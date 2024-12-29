import { bindValue, eventName, NElement, NList, styles } from "../../lib/qwqframe.js";
import { editerContext } from "../context.js";
import { ENode } from "../file/ENode.js";



/**
 * 显示节点类
 */
class TreeNode
{
    /**
     * 显示节点
     * @type {NElement}
     */
    element = null;

    /**
     * 节点已展开
     * @type {boolean}
     */
    unfolded = false;

    /**
     * 原始数据节点
     * @type {ENode}
     */
    eNode = null;

    /**
     * 树状深度
     */
    deepth = 0;


    /**
     * 子节点列表
     * @type {Array<TreeNode>}
     */
    childs = [];

    /**
     * @param {ENode} eNode
     */
    constructor(eNode)
    {
        this.eNode = eNode;
        this.element = TreeNode.createElement(eNode.id, this.deepth);
    }

    /**
     * 更新子节点列表
     */
    updateChild()
    {
        let childNodeList = this.eNode.childs;
        let childNodeSet = new Set(childNodeList);
        let nowIndex = 0;
        for (let i = 0; i < childNodeList.length; i++)
        {
        }
    }

    /**
     * 展开节点
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
        }
    }

    /**
     * 折叠节点
     */
    fold()
    {
        if (this.unfolded)
        {
            this.unfolded = false;
            this.childs.forEach(o =>
            {
                o.nodeRemove();
            });
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
        }
        this.childs.forEach(o =>
        {
            o.nodeRemove();
        });
        this.element.remove();
    }


    /**
     * 创建列表项显示元素
     * @param {string} name
     * @param {number} deepth
     */
    static createElement(name, deepth)
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

            name,

            eventName.click((e) =>
            { // 左键
                e.stopPropagation();
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
                    duration: 75,
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
                    duration: 75,
                    fill: "forwards"
                });
            }),
        ]);
        return ret;
    }
}



/**
 * 初始化节点树列表
 */
export function initTreeList()
{
    /**
     * @type {TreeNode}
     */
    let nowRoot = null;

    /**
     * 刷新节点树列表
     */
    function refreshList()
    {
        editerContext.treeListElement.removeChilds();
        if (!nowRoot)
        {
            return;
        }
        editerContext.treeListElement.addChild(nowRoot.element);
    }

    editerContext.treeListElement.applyNList([
        eventName.contextmenu(e =>
        {
            e.preventDefault();
            e.stopPropagation();
            if (nowRoot)
                (/** @type {HTMLDivElement} */(nowRoot.element.node)).dispatchEvent(new MouseEvent("contextmenu", e));
        })
    ]);

    bindValue(editerContext, "nowRootNode").bindToCallback((/** @type {ENode} */ o) =>
    {
        if (!o)
        {
            nowRoot = null;
            refreshList();
            return;
        }
        nowRoot = new TreeNode(o);
        refreshList();
    }).emit();
}