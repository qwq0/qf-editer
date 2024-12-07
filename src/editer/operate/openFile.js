import { delayPromise, eventName, NList } from "../../../lib/qwqframe.js";
import { editerContext } from "../../context.js";
import { EContent } from "../../file/EContent.js";
import { EFile } from "../../file/EFile.js";
import { getExtName, getFileName, readFileAsStr, writeFile } from "../../tools/fileOperate.js";
import { showInfoBox } from "../../ui/infobox.js";
import { showMenu } from "../../ui/menu.js";
import { showNotice } from "../../ui/Notice.js";

/**
 * 在编辑器中打开文件
 * @param {string} filePath
 */
export async function editerOpenFile(filePath)
{
    if (filePath == "/qfe.config.json")
    { // 配置文件
        showNotice("无法打开", "无法使用qfe编辑qfe配置文件");
        return;
    }

    let extName = getExtName(filePath);
    let fileContent = "";

    try
    {
        fileContent = await readFileAsStr(filePath);
    }
    catch (err)
    {
        console.error("error when read file:", filePath, err);
        showNotice("文件打开失败", (err?.toString ? err?.toString() : "未知错误"));
        return;
    }

    if (extName == "js")
    { // js文件
        if (fileContent == "" || (fileContent.length < 10 && fileContent.trim() == ""))
        { // 空文件
            let confirm = await showInfoBox("初始化文件", "打开了一个空的js文件\n要将此文件初始化吗", true);
            if (confirm)
            {
                showMenu([
                    NList.getElement([
                        "初始化为完整页面",
                        eventName.click(async (e) =>
                        {
                            let eFile = new EFile();
                            eFile.fileType = "full_page";
                            await writeFile(filePath, eFile.toFileContent());
                            await delayPromise(100);
                            editerOpenFile(filePath);
                        })
                    ]),
                    NList.getElement([
                        "初始化为组件",
                        eventName.click(async (e) =>
                        {
                            let eFile = new EFile();
                            eFile.fileType = "component";
                            await writeFile(filePath, eFile.toFileContent());
                            await delayPromise(100);
                            editerOpenFile(filePath);
                        })
                    ]),
                    NList.getElement([
                        "初始化为预制件",
                        eventName.click(async (e) =>
                        {
                            let eFile = new EFile();
                            eFile.fileType = "snippet";
                            await writeFile(filePath, eFile.toFileContent());
                            await delayPromise(100);
                            editerOpenFile(filePath);
                        })
                    ]),
                    NList.getElement([
                        "初始化为状态节点",
                        eventName.click(async (e) =>
                        {
                            let eFile = new EFile();
                            eFile.fileType = "state_node";
                            await writeFile(filePath, eFile.toFileContent());
                            await delayPromise(100);
                            editerOpenFile(filePath);
                        })
                    ]),
                ]);
            }
        }
        else if (
            fileContent.startsWith("// qf_editer_file/") ||
            fileContent.startsWith("//qf_editer_file/") ||
            fileContent.startsWith("// qfef/") ||
            fileContent.startsWith("//qfef/")
        )
        { // qfe的js文件
            /** @type {EContent} */
            let eContent = null;
            try
            {
                let eFile = EFile.fromFileContent(fileContent);
                eContent = new EContent();
                eContent.initFromObject(eFile.content);
            }
            catch (err)
            {
                console.error("error when open qfe file:", err);
                showNotice("文件解析失败", (err?.toString ? err?.toString() : "未知错误"));
                return;
            }

            if (eContent)
            {
                editerContext.nowFilePath = filePath;
                editerContext.nowFileName = getFileName(filePath);
                editerContext.nowFileCotext = eContent;
            }
        }
        else
        { // 无法识别的js文件
            showNotice("无法打开", "此文件既不是空文件, 也不是由qfe创建的文件");
        }
    }
    else
    { // 不支持的类型
        showNotice("无法打开", "不支持的文件类型");
    }
}