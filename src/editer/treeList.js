import { bindValue, eventName, NElement, NList, styles } from "../../lib/qwqframe.js";
import { editerContext } from "../context.js";
import { ENode } from "../file/ENode.js";


/**
 * 节点实例 到 显示节点 映射
 * @type {WeakMap<ENode, TreeNode>}
 */
let nodeMap = new WeakMap();

/**
 * 显示节点
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
    }

    /**
     * 展开节点
     */
    unfold()
    {
    }

    /**
     * 折叠节点
     */
    fold()
    {
    }

    /**
     * 通过原始节点获取显示节点
     * @param {ENode} node
     * @returns {TreeNode}
     */
    static getNode(node)
    {
        let ret = nodeMap.get(node);
        if (!ret)
        {
            ret = new TreeNode(node);
            nodeMap.set(node, ret);
        }
        return ret;
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
        nowRoot = TreeNode.getNode(o);
        refreshList();
    }).emit();
}