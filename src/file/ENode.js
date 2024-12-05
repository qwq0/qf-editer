/**
 * 元素节点
 */
export class ENode
{
    /**
     * 元素的类型
     */
    typeId = "";

    /**
     * 元素id
     */
    id = "";

    /**
     * 节点属性
     * @type {Object<string, string | number>}
     */
    attribute = {};

    /**
     * @type {ENode}
     */
    parent = null;

    /**
     * 子节点
     * @type {Array<ENode>}
     */
    childs = [];
}