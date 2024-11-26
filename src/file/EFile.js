/**
 * 表示一个qfe文件的类
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
     * 序列化
     */
    toFileContent()
    {
        let lineSlice = [];
        return lineSlice.join("\n");
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
            ret.metaPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
            if (lineSlice[nowLineIndex] == "// #qfe-slice-content")
            {
                nowLineIndex++;
                break;
            }
        }

        while (nowLineIndex < lineSlice.length)
        {
            ret.contentPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
            if (lineSlice[nowLineIndex] == "// #qfe-slice-generated")
            {
                nowLineIndex++;
                break;
            }
        }

        while (nowLineIndex < lineSlice.length)
        {
            ret.generatedPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
            if (lineSlice[nowLineIndex] == "// #qfe-slice-external")
            {
                nowLineIndex++;
                break;
            }
        }

        while (nowLineIndex < lineSlice.length)
        {
            ret.externalPart.push(lineSlice[nowLineIndex]);
            nowLineIndex++;
        }

        return ret;
    }
}