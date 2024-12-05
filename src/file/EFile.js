/**
 * 表示一个qfe文件的类
 * @template {Object} T
 */
export class EFile
{
    /**
     * 文件类型
     */
    fileType = "";

    /**
     * 元信息部分
     * @type {Array<string>}
     */
    metaPart = [];

    /**
     * 内容部分
     * @type {Array<string>}
     */
    contentPart = [];

    /**
     * 生成的部分
     * @type {Array<string>}
     */
    generatedPart = [];

    /**
     * 额外部分
     * @type {Array<string>}
     */
    externalPart = [];

    /**
     * 内容
     * @type {T}
     */
    content = null;

    /**
     * 元数据
     * @type {Object<string, string>}
     */
    meta = {
        version: "1"
    };

    partToContent()
    {
        // @ts-ignore
        this.content = {};

        let startLineIndex = 0;
        let endLineIndex = this.contentPart.length - 1;

        while (endLineIndex >= 0 && this.contentPart[endLineIndex].trim() != "*/")
        {
            endLineIndex--;
        }
        while (startLineIndex < endLineIndex && this.contentPart[startLineIndex].trim() != "/*")
        {
            startLineIndex++;
        }

        let contentJson = this.contentPart.slice(startLineIndex + 1, endLineIndex).join("\n");
        try
        {
            this.content = JSON.parse(contentJson);
            if (this.content == null)
            {
                // @ts-ignore
                this.content = {};
            }
        }
        catch (err)
        {
            console.error("file part to content error:", err);
        }
    }

    contentToPart()
    {
        this.contentPart = [];

        let contentJson = JSON.stringify((this.content ? this.content : {}), undefined, 4);
        contentJson.replaceAll("*/", "*\\/");

        this.contentPart.push("/*");
        contentJson.split("\n").forEach(o =>
        {
            this.contentPart.push(o);
        });
        this.contentPart.push("*/");
    }

    partToMeta()
    {
        this.metaPart = [];
        let entries = Object.entries(this.meta);
        entries.forEach(o =>
        {
            this.metaPart.push(`// ${o[0]} = ${o[1]}`);
        });
    }

    metaToPart()
    {
        this.meta = {};
        this.metaPart.forEach(o =>
        {
            if (o.startsWith("//"))
            {
                let ind = o.indexOf("=", 2);
                if (ind == -1)
                    return;
                let key = o.slice(2, ind).trim();
                let value = o.slice(ind + 1).trim();
                Object.defineProperty(this.meta, key, {
                    value: value,
                    configurable: true,
                    enumerable: true,
                    writable: true
                });
            }
        });
    }

    /**
     * 序列化
     */
    toFileContent()
    {
        this.metaToPart();
        this.contentToPart();
        /**
         * @type {Array<string | Array<string>>}
         */
        let lineSlice = [];
        lineSlice.push(`// qf_editer_file/${this.fileType}`);
        lineSlice.push(this.metaPart);
        lineSlice.push("// #qfe-slice-content");
        lineSlice.push(this.contentPart);
        lineSlice.push("// #qfe-slice-generated");
        lineSlice.push(this.generatedPart);
        lineSlice.push("// #qfe-slice-external");
        lineSlice.push(this.externalPart);
        return lineSlice.flat().join("\n");
    }

    /**
     * 反序列化
     * @param {string} fileContent
     * @returns {EFile}
     */
    static fromFileContent(fileContent)
    {
        /**
         * 源码字符串
         */
        let srcString = fileContent.replaceAll("\r", "");
        /**
         * 每行内容
         */
        let lineSlice = srcString.split("\n");

        let ret = new EFile();

        ret.fileType = lineSlice[0].slice(lineSlice[0].indexOf("/", 2) + 1);

        let nowLineIndex = 1;

        while (nowLineIndex < lineSlice.length)
        {
            if (lineSlice[nowLineIndex].trim() == "// #qfe-slice-content")
            {
                nowLineIndex++;
                break;
            }
            ret.metaPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
        }

        while (nowLineIndex < lineSlice.length)
        {
            if (lineSlice[nowLineIndex].trim() == "// #qfe-slice-generated")
            {
                nowLineIndex++;
                break;
            }
            ret.contentPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
        }

        while (nowLineIndex < lineSlice.length)
        {
            if (lineSlice[nowLineIndex].trim() == "// #qfe-slice-external")
            {
                nowLineIndex++;
                break;
            }
            ret.generatedPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
        }

        while (nowLineIndex < lineSlice.length)
        {
            ret.externalPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
        }

        ret.partToMeta();
        ret.partToContent();

        return ret;
    }
}