import { delayPromise, EventHandler, eventName, NElement, NList, styles } from "../../lib/qwqframe.js";
import { projectContext } from "../context.js";
import { editerOpenFile } from "../editer/operate/openFile.js";
import { buttonAsse } from "../ui/button.js";
import { CursorMenu } from "../ui/CursorMenu.js";
import { showInfoBox, showInputBox } from "../ui/infobox.js";
import { showMenu } from "../ui/menu.js";
import { showNotice } from "../ui/Notice.js";
import { createLeftBarPage } from "./leftBarPage.js";

/**
 * 忽略的目录名集合
 */
let ignoredDirectorySet = new Set([".git"]);

/**
 * 目录节点
 */
class DirectoryNode
{
    /**
     * 文件夹名
     */
    name = "";

    /**
     * 基于项目文件夹的相对路径
     */
    path = "";

    /**
     * 子目录节点
     * @type {Array<DirectoryNode>}
     */
    childs = [];

    /**
     * 子文件
     * @type {Array<{
     *  name: string,
     *  path: string,
     *  element?: NElement,
     *  handle: FileSystemFileHandle
     * }>}
     */
    files = [];

    /**
     * 元素
     * @type {NElement}
     */
    element = null;

    /**
     * 文件夹句柄
     * @type {FileSystemDirectoryHandle}
     */
    handle = null;

    deepth = 0;

    unfolded = false;

    onFold = new EventHandler();
    onUnfold = new EventHandler();

    /**
     * @param {string} name
     * @param {DirectoryNode} [parentNode]
     */
    constructor(name, parentNode)
    {
        this.name = name;
        if (parentNode)
        {
            this.deepth = parentNode.deepth + 1;
            this.path = parentNode.path + "/" + this.name;
        }
        this.element = DirectoryNode.createElement(name, this.deepth, this.path, this);
    }

    /**
     * 刷新文件内容
     */
    async refresh()
    {
        if (!this.handle)
            return;

        let entries = await Array.fromAsync(this.handle.entries());
        entries.sort((x, y) =>
        {
            if (x[0] < y[0])
                return -1;
            else if (x[0] > y[0])
                return 1;
            else
                return 0;
        });

        /**
         * 子节点数组索引
         */
        let directoryInd = 0;
        /**
         * 文件数组索引
         */
        let fileInd = 0;
        for (let o of entries)
        {
            if (o[1].kind == "directory")
            { // 文件夹
                if (ignoredDirectorySet.has(o[0]))
                    continue;

                while (directoryInd < this.childs.length && this.childs[directoryInd].name < o[0])
                { // 已经不存在
                    this.childs[directoryInd].nodeRemove();
                    this.childs.splice(directoryInd, 1);
                }

                if (directoryInd < this.childs.length && this.childs[directoryInd].name == o[0])
                { // 不变的
                    directoryInd++;
                }
                else
                { // 原先不存在的
                    let node = new DirectoryNode(o[0], this);
                    node.handle = o[1];
                    this.childs.splice(directoryInd, 0, node);
                    if (this.unfolded)
                    {
                        let lastElement = this.element;
                        if (directoryInd > 0)
                            lastElement = this.childs[directoryInd - 1].element;
                        lastElement.insAfter(node.element);
                    }
                    directoryInd++;
                }
            }
            else if (o[1].kind == "file")
            { // 文件
                while (fileInd < this.files.length && this.files[fileInd].name < o[0])
                { // 已经不存在的
                    if (this.files[fileInd].element)
                        this.files[fileInd].element.remove();
                    this.files.splice(fileInd, 1);
                }

                if (fileInd < this.files.length && this.files[fileInd].name == o[0])
                { // 不变的
                    fileInd++;
                }
                else
                { // 原先不存在的
                    let path = this.path + "/" + o[0];
                    let node = {
                        name: o[0],
                        path: path,
                        element: DirectoryNode.createElement(o[0], this.deepth + 1, path),
                        handle: o[1]
                    };
                    this.files.splice(fileInd, 0, node);
                    if (this.unfolded)
                    {
                        let lastElement = this.element;
                        if (this.childs.length > 0)
                            lastElement = this.childs.at(-1).element;
                        if (fileInd > 0)
                            lastElement = this.files[fileInd - 1].element;
                        lastElement.insAfter(node.element);
                    }
                    fileInd++;
                }
            }
        }
        while (directoryInd < this.childs.length)
        { // 还未处理的已经不存在的文件夹
            this.childs[directoryInd].nodeRemove();
            this.childs.splice(directoryInd, 1);
        }
        while (fileInd < this.files.length)
        { // 还未处理的已经不存在的文件
            if (this.files[fileInd].element)
                this.files[fileInd].element.remove();
            this.files.splice(fileInd, 1);
        }
    }

    /**
     * 移除节点
     * 移除此节点和所有子节点的显示元素
     */
    nodeRemove()
    {
        if (this.unfolded)
        {
            this.unfolded = false;
            this.onFold.trigger();
        }
        this.files.forEach(o =>
        {
            if (o.element)
            {
                o.element.remove();
            }
        });
        this.childs.forEach(o =>
        {
            o.nodeRemove();
        });
        if (this.element)
        {
            this.element.remove();
        }
    }

    /**
     * 折叠文件夹
     * 隐藏所有子节点
     */
    fold()
    {
        if (this.unfolded)
        {
            this.unfolded = false;
            this.files.forEach(o =>
            {
                if (o.element)
                {
                    o.element.remove();
                }
            });
            this.childs.forEach(o =>
            {
                o.nodeRemove();
            });
            this.onFold.trigger();
        }
    }

    /**
     * 清除整个子树
     */
    clear()
    {
        this.unfolded = false;
        this.files.forEach(o =>
        {
            if (o.element)
                o.element.remove();
        });
        this.files = [];
        this.childs.forEach(o =>
        {
            o.nodeRemove();
        });
        this.childs = [];
    }

    /**
     * 展开文件夹
     * 同时会刷新子节点
     */
    unfold()
    {
        if (!this.unfolded)
        {
            this.unfolded = true;
            let lastElement = this.element;
            this.childs.forEach(o =>
            {
                lastElement.insAfter(o.element);
                lastElement = o.element;
            });
            this.files.forEach(o =>
            {
                lastElement.insAfter(o.element);
                lastElement = o.element;
            });
            this.onUnfold.trigger();
        }
        this.refresh();
    }

    /**
     * 创建列表项显示元素
     * @param {string} name
     * @param {number} deepth
     * @param {string} filePath
     * @param {DirectoryNode} [directoryNode]
     */
    static createElement(name, deepth, filePath, directoryNode)
    {
        let ret = NList.getElement([
            styles({
                width: "100%",
                height: "30px",
                lineHeight: "30px",
                whiteSpace: "pre",
                textOverflow: "clip",
                paddingLeft: (deepth * 15) + "px"
            }),

            (directoryNode ? [
                styles({
                    display: "inline-block",
                    width: "20px",
                    textAlign: "center"
                }),
                "▷",
                ele =>
                {
                    directoryNode.onFold.add(e =>
                    {
                        ele.setText("▷");
                    });
                    directoryNode.onUnfold.add(e =>
                    {
                        ele.setText("▼");
                    });
                }
            ] : null),

            name,

            eventName.click((e) =>
            { // 左键
                e.stopPropagation();
                if (directoryNode)
                { // 文件夹
                    if (directoryNode.unfolded)
                        directoryNode.fold();
                    else
                        directoryNode.unfold();
                }
                else
                { // 文件
                    editerOpenFile(filePath);
                }
            }),
            eventName.contextmenu((e) =>
            { // 右键
                e.stopPropagation();
                e.preventDefault();
                if (directoryNode)
                { // 文件夹
                    if (!directoryNode.handle)
                        return;
                    CursorMenu.showMenu([
                        {
                            text: "新建文件",
                            callback: async () =>
                            {
                                let name = await showInputBox("创建文件", "请输入文件夹名", true);
                                if (name != undefined)
                                {
                                    if (name != "")
                                    {
                                        try
                                        {
                                            await directoryNode.handle.getFileHandle(name, { create: false });
                                            showNotice("创建失败", "文件已经存在");
                                            return;
                                        }
                                        catch (err) { }

                                        try
                                        {
                                            await directoryNode.handle.getFileHandle(name, { create: true });
                                            await delayPromise(120);
                                            directoryNode.unfold();
                                        }
                                        catch (err)
                                        {
                                            console.error(err);
                                            showNotice("创建失败", "创建文件失败");
                                        }
                                    }
                                    else
                                    {
                                        showNotice("创建失败", "文件名不可为空");
                                    }
                                }
                            }
                        },
                        {
                            text: "新建文件夹",
                            callback: async () =>
                            {
                                let name = await showInputBox("创建文件夹", "请输入文件夹名", true);
                                if (name != undefined)
                                {
                                    if (name != "")
                                    {
                                        try
                                        {
                                            await directoryNode.handle.getDirectoryHandle(name, { create: false });
                                            showNotice("创建失败", "文件夹已经存在");
                                            return;
                                        }
                                        catch (err) { }

                                        try
                                        {
                                            await directoryNode.handle.getDirectoryHandle(name, { create: true });
                                            await delayPromise(120);
                                            directoryNode.unfold();
                                        }
                                        catch (err)
                                        {
                                            console.error(err);
                                            showNotice("创建失败", "创建文件夹失败");
                                        }
                                    }
                                    else
                                    {
                                        showNotice("创建失败", "文件夹名不可为空");
                                    }
                                }
                            }
                        }
                    ], e.clientX, e.clientY);
                }
                else
                { // 文件
                    CursorMenu.showMenu([
                        {
                            text: "(空)"
                        }
                    ], e.clientX, e.clientY);
                }
            }),
            eventName.mouseenter((e, ele) =>
            {
                ele.animate([
                    {
                        backgroundColor: "rgba(150, 150, 150, 0)"
                    },
                    {
                        backgroundColor: "rgba(150, 150, 150, 0.3)"
                    }
                ], {
                    duration: 120,
                    fill: "forwards"
                });
            }),
            eventName.mouseleave((e, ele) =>
            {
                ele.animate([
                    {
                        backgroundColor: "rgba(150, 150, 150, 0.3)"
                    },
                    {
                        backgroundColor: "rgba(150, 150, 150, 0)"
                    }
                ], {
                    duration: 120,
                    fill: "forwards"
                });
            }),
        ]);
        return ret;
    }
}

/**
 * 初始化文件资源管理器
 */
export function initFileExplorer()
{
    /**
     * @type {NElement}
     */
    let fileExplorerTree = null;

    let fileTree = new DirectoryNode("");

    setInterval(() =>
    {
        fileTree.refresh();
    }, 3900);

    /**
     * 更新文件树
     */
    async function updateFileTree()
    {
        fileTree.clear();
        fileTree.handle = projectContext.fileSystemDirectoryHandle;
        fileTree.name = projectContext.fileSystemDirectoryHandle.name;
        // fileExplorerTree.removeChilds();
        fileTree.unfold();
    }

    createLeftBarPage("fileExplorer", NList.getElement([
        styles({
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }),
        "FE"
    ]), NList.getElement([
        styles({
            color: "rgb(255, 255, 255)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            overflow: "auto",
            scrollbarWidth: "none"
        }),
        [
            "资源管理器",
            styles({
                color: "rgb(120, 120, 120)",
                fontSize: "0.7em",
                position: "absolute",
                top: "0",
                left: "0"
            })
        ],
        [],
        [
            buttonAsse,
            "打开项目",
            eventName.click(async (e) =>
            {
                if (window.showDirectoryPicker)
                {
                    let fileSystemDirectoryHandle = await window.showDirectoryPicker({
                        id: "qf-editer",
                        mode: "readwrite",
                        startIn: "desktop"
                    });

                    let hasConfigFile = false;
                    try
                    {
                        if (await fileSystemDirectoryHandle.getFileHandle("qfe.config.json", { create: false }))
                        {
                            hasConfigFile = true;
                        }
                    }
                    catch (err)
                    { }
                    if (!hasConfigFile)
                    {
                        let confirm = await showInfoBox("初始化项目", `无法找到qfe.config.json\n确认打开项目将自动创建此文件`, true);
                        if (confirm)
                        {
                            let configFileHandle = await fileSystemDirectoryHandle.getFileHandle("qfe.config.json", { create: true });
                            let configWriteable = await configFileHandle.createWritable({ keepExistingData: false });
                            await configWriteable.write((new TextEncoder()).encode("{}"));
                            await configWriteable.close();
                        }
                        else 
                        {
                            return;
                        }
                    }

                    projectContext.info.projectName = fileSystemDirectoryHandle.name;
                    projectContext.fileSystemDirectoryHandle = fileSystemDirectoryHandle;
                    updateFileTree();
                }
            })
        ],

        [ // 文件树菜单
            styles({
                width: "100%",
                minHeight: "500px",
                borderTop: "1px solid rgba(130, 130, 130, 0.5)",
                borderBottom: "1px solid rgba(130, 130, 130, 0.5)"
            }),

            ele => { fileExplorerTree = ele; },

            fileTree.element.applyNList([
                styles({
                    display: "none"
                })
            ]),

            [
                styles({
                    width: "100%",
                    height: "50px",
                }),
            ],

            eventName.contextmenu(e =>
            {
                e.preventDefault();
                e.stopPropagation();
                (/** @type {HTMLDivElement} */(fileTree.element.node)).dispatchEvent(new MouseEvent("contextmenu", e));
            })
        ]
    ]));
}