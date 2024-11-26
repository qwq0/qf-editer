import { NList } from "../../../lib/qwqframe.js";
import { EFile } from "../../file/EFile.js";
import { getExtName, readFileAsStr } from "../../tools/fileOperate.js";
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
    let fileContent = await readFileAsStr(filePath);

    if (extName == "js")
    { // js文件
        if (fileContent == "" || (fileContent.length < 10 && fileContent.trim() == ""))
        { // 空文件
            let confirm = await showInfoBox("初始化文件", "打开了一个空的js文件\n要将此文件初始化吗", true);
            if (confirm)
            {
                showMenu([
                    NList.getElement([
                        "初始化为完整页面"
                    ]),
                    NList.getElement([
                        "初始化为组件"
                    ]),
                    NList.getElement([
                        "初始化为预制件"
                    ]),
                    NList.getElement([
                        "初始化为状态节点"
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
            let eFile = EFile.fromFileContent(fileContent);
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