import { EventHandler, eventName, NElement, NList, styles } from "../../lib/qwqframe.js";
import { projectContext } from "../context.js";
import { buttonAsse } from "../ui/button.js";
import { createLeftBarPage } from "./leftBarPage.js";


let ignoredDirectorySet = new Set([".git"]);
class DirectoryNode
{
    name = "";

    /**
     * @type {Array<DirectoryNode>}
     */
    childs = [];

    /**
     * @type {Array<{
     *  name: string,
     *  element?: NElement
     * }>}
     */
    files = [];

    /**
     * @type {NElement}
     */
    element = null;

    /**
     * @type {FileSystemDirectoryHandle}
     */
    handle = null;

    deepth = 0;

    unfolded = false;

    onFold = new EventHandler();
    onUnfold = new EventHandler();

    /**
     * @param {string} name
     * @param {number} deepth
     * @param {number} deepth
     */
    constructor(name, deepth)
    {
        this.name = name;
        this.deepth = deepth;
        this.element = DirectoryNode.createElement(name, deepth, this);
    }

    async refresh()
    {
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
        let directoryInd = 0;
        let fileInd = 0;
        for (let o of entries)
        {
            if (o[1].kind == "directory")
            {
                if (ignoredDirectorySet.has(o[0]))
                    continue;

                while (directoryInd < this.childs.length && this.childs[directoryInd].name < o[0])
                {
                    this.childs[directoryInd].nodeRemoved();
                    this.childs.splice(directoryInd, 1);
                }

                if (directoryInd < this.childs.length && this.childs[directoryInd].name == o[0])
                {
                    directoryInd++;
                }
                else
                {
                    let node = new DirectoryNode(o[0], this.deepth + 1);
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
            {
                while (fileInd < this.files.length && this.files[fileInd].name < o[0])
                {
                    if (this.files[fileInd].element)
                        this.files[fileInd].element.remove();
                    this.files.splice(fileInd, 1);
                }

                if (fileInd < this.files.length && this.files[fileInd].name == o[0])
                {
                    fileInd++;
                }
                else
                {
                    let node = {
                        name: o[0],
                        element: DirectoryNode.createElement(o[0], this.deepth + 1)
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
        {
            this.childs[directoryInd].nodeRemoved();
            this.childs.splice(directoryInd, 1);
        }
        while (fileInd < this.files.length)
        {
            if (this.files[fileInd].element)
                this.files[fileInd].element.remove();
            this.files.splice(fileInd, 1);
        }
    }

    nodeRemoved()
    {
        if (this.unfolded)
        {
            this.unfolded = false;
            this.onFold.trigger();
        }
        this.childs.forEach(o =>
        {
            o.nodeRemoved();
        });
        if (this.element)
        {
            this.element.remove();
        }
        this.files.forEach(o =>
        {
            if (o.element)
            {
                o.element.remove();
            }
        });
    }

    fold()
    {
        if (this.unfolded)
        {
            this.unfolded = false;
            this.childs.forEach(o =>
            {
                o.nodeRemoved();
            });
            this.files.forEach(o =>
            {
                if (o.element)
                {
                    o.element.remove();
                }
            });
            this.onFold.trigger();
        }
    }

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
     * @param {string} name
     * @param {number} deepth
     * @param {DirectoryNode} [directoryNode]
     */
    static createElement(name, deepth, directoryNode)
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
            {
                if (directoryNode)
                {
                    if (directoryNode.unfolded)
                        directoryNode.fold();
                    else
                        directoryNode.unfold();
                }
                else
                { }
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

    let fileTree = new DirectoryNode("", 0);

    /**
     * 更新文件树
     */
    async function updateFileTree()
    {
        fileTree.handle = projectContext.fileSystemDirectoryHandle;
        // fileExplorerTree.removeChilds();
        fileTree.unfold();
    }

    createLeftBarPage("fileExplorer", NList.getElement([
        "fe"
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
                    projectContext.fileSystemDirectoryHandle = fileSystemDirectoryHandle;
                    updateFileTree();
                }
            })
        ],

        [
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
            ])
        ]
    ]));
}