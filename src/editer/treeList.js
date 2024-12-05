import { NElement } from "../../lib/qwqframe.js";
import { ENode } from "../file/ENode.js";

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
     * @param {ENode} eNode
     */
    constructor(eNode)
    {
        this.eNode = eNode;
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
}

/**
 * @type {WeakMap<ENode, TreeNode>}
 */
let nodeStateMap = new WeakMap();

/**
 * 初始化节点树列表
 */
export function initTreeList()
{

}