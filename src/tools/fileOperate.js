import { projectContext } from "../context.js";

/**
 * 获取文件夹句柄
 * @param {string | Array<string>} path
 * @param {boolean} [create]
 * @returns {Promise<FileSystemDirectoryHandle>}
 */
export async function getDirectoryHandle(path, create = false)
{
    /**
     * @type {Array<string>}
     */
    let pathArray = null;
    if (typeof (path) == "string")
    {
        pathArray = path.split("/");
        if (pathArray[0] == "")
            pathArray = pathArray.slice(1);
    }
    else
    {
        pathArray = path;
    }
    if (!projectContext.fileSystemDirectoryHandle)
        throw "cannot get directory because the project directory handle was not found";
    let ret = projectContext.fileSystemDirectoryHandle;
    for (let name of pathArray)
    {
        ret = await ret.getDirectoryHandle(name, { create: create });
    }
    return ret;
}

/**
 * 读取文件
 * 对于不存在的文件返回null
 * @param {string} filePath
 * @returns {Promise<string | null>}
 */
export async function readFileAsStr(filePath)
{
    if (!projectContext.fileSystemDirectoryHandle)
        throw "cannot read file because the project directory handle was not found";
    let path = filePath.split("/");
    if (path[0] == "")
        path = path.slice(1);
    let fileHandle = await (await getDirectoryHandle(path.slice(0, -1), false)).getFileHandle(path.at(-1), { create: false });
    let fileObj = await fileHandle.getFile();
    let ret = await fileObj.text();
    return ret;
}

/**
 * 写入文件
 * @param {string} filePath
 * @param {string | Uint8Array} content
 */
export async function writeFile(filePath, content)
{
    if (!projectContext.fileSystemDirectoryHandle)
        throw "cannot write file because the project directory handle was not found";
    let path = filePath.split("/");
    if (path[0] == "")
        path = path.slice(1);
    let fileHandle = await (await getDirectoryHandle(path.slice(0, -1), true)).getFileHandle(path.at(-1), { create: true });
    let writable = await fileHandle.createWritable({ keepExistingData: false });
    let rawContent = (typeof (content) == "string" ? (new TextEncoder()).encode(content) : content);
    await writable.write(rawContent);
    await writable.close();
    return;
}

/**
 * 从路径获取文件扩展名
 * @param {string} filePath
 * @returns {string}
 */
export function getExtName(filePath)
{
    let splitIndex = filePath.lastIndexOf("/");
    let pointIndex = filePath.lastIndexOf(".");
    if (pointIndex > splitIndex)
        return filePath.slice(pointIndex + 1);
    else
        return "";
}

/**
 * 从路径获取文件名
 * @param {string} filePath
 * @returns {string}
 */
export function getFileName(filePath)
{
    let splitIndex = filePath.lastIndexOf("/");
    return filePath.slice(splitIndex + 1);
}