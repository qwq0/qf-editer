import { eventName, NElement, NList, styles } from "../../lib/qwqframe.js";
import { projectContext } from "../context.js";
import { buttonAsse } from "../ui/button.js";
import { createLeftBarPage } from "./leftBarPage.js";

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
     *  elements?: Array<NElement>
     * }>}
     */
    files = [];

    /**
     * @type {Array<NElement>}
     */
    elements = null;

    /**
     * @type {FileSystemDirectoryHandle}
     */
    handle = null;

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
                while (directoryInd < this.childs.length && this.childs[directoryInd].name < o[0])
                {
                    this.childs.splice(directoryInd, 1);
                }

                if (directoryInd < this.childs.length && this.childs[directoryInd].name == o[0])
                {
                    directoryInd++;
                }
                else
                {
                    let node = new DirectoryNode();
                    node.name = o[0];
                    this.childs.splice(directoryInd, 0, node);
                }
            }
            else if (o[1].kind == "file")
            {
                while (fileInd < this.files.length && this.files[fileInd].name < o[0])
                {
                    this.files.splice(fileInd, 1);
                }

                if (fileInd < this.files.length && this.files[fileInd].name == o[0])
                {
                    fileInd++;
                }
                else
                {
                    let node = {};
                    node.name = o[0];
                    this.files.splice(fileInd, 0, node);
                }
            }
        }
    }

    nodeRemoved()
    {
        if (this.elements)
        {
            this.elements.forEach(o => { o.remove(); });
            this.elements = null;
        }
        this.childs.forEach(o =>
        {
            if (o.elements)
            {
                o.elements.forEach(v =>
                {
                    v.remove();
                });
                o.elements = null;
            }
        });
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

    let fileTree = new DirectoryNode();

    /**
     * 更新文件树
     */
    async function updateFileTree()
    {
        let list = await Array.fromAsync(projectContext.fileSystemDirectoryHandle.keys());
        fileExplorerTree.removeChilds();
        list.forEach(o =>
        {
            fileExplorerTree.addChild(NList.getElement([
                styles({
                    width: "100%",
                    height: "30px",
                    lineHeight: "30px"
                }),
                o,
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
                        duration: 190,
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
                        duration: 140,
                        fill: "forwards"
                    });
                }),
            ]));
        });
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

            ele => { fileExplorerTree = ele; }
        ]
    ]));
}