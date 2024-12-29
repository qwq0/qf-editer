/**
 * 元素节点类
 */
export class ENode
{
    /**
     * 元素的类型
     */
    type = "";

    /**
     * 元素id
     */
    id = "";

    /**
     * 节点属性
     * @type {Object<string, string | number | boolean>}
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

    /**
     * 所在的文件上下文
     * @type {import("./EContent.js").EContent}
     */
    context = null;

    /**
     * 序列化为对象
     * @returns {import("./EFileContentObj.d.ts").EFCNode}
     */
    toContentNode()
    {
        /** @type {import("./EFileContentObj.d.ts").EFCNode} */
        let ret = {};

        if (this.type != "")
            ret.type = this.type;
        if (this.id != "")
            ret.id = this.id;
        if (Object.keys(this.attribute).length > 0)
            ret.attr = Object.assign({}, this.attribute);
        if (this.childs.length > 0)
            ret.child = this.childs.map(o => o.toContentNode());

        return ret;
    }

    /**
     * 将序列化对象实例化
     * @param {ENode} obj
     * @returns {ENode}
     */
    static fromContentNode(obj)
    {
        let ret = new ENode();

        if (obj.type != undefined)
            ret.type = obj.type;
        if (obj.id != undefined)
            ret.id = obj.id;
        if (obj.attribute != undefined && Object.keys(obj.attribute).length > 0)
            ret.attribute = Object.assign({}, obj.attribute);
        if (obj.childs != undefined && obj.childs.length > 0)
            ret.childs = obj.childs.map(o => ENode.fromContentNode(o));

        return ret;
    }

    static create()
    { }
}