import { ENode } from "./ENode.js";

/**
 * qfe文件的内容的实例化
 */
export class EContent
{
    /**
     * 组件或页面名称
     */
    name = "";

    /**
     * 树的key 到 树的根节点 映射
     * @type {Map<string, ENode>}
     */
    rootMap = new Map();

    /**
     * 默认树的key
     */
    defaultTreeKey = "main";

    /**
     * 字符串映射
     * 字符串key 到 字符串内容 映射
     * @type {Map<string, string>}
     */
    stringMap = new Map();

    /**
     * @returns {ENode}
     */
    get defaultRoot()
    {
        return this.rootMap.get(this.defaultTreeKey);
    }

    /**
     * 序列化为对象
     * @returns {import("./EFileContentObj.d.ts").EfileContentObj}
     */
    toContentObject()
    {
        let ret = {
            name: this.name,
            rootMap: {},
            defaultTree: this.defaultTreeKey,
            stringMap: {}
        };
        this.rootMap.forEach((o, key) =>
        {
            Object.defineProperty(ret.rootMap, key, {
                enumerable: true,
                value: o.toContentNode()
            });
        });
        this.stringMap.forEach((o, key) =>
        {
            Object.defineProperty(ret.rootMap, key, {
                enumerable: true,
                value: o
            });
        });
        return ret;
    }

    /**
     * 从对象初始化
     * @param {import("./EFileContentObj.d.ts").EfileContentObj} obj
     */
    initFromObject(obj)
    {
        if (obj.name)
        {
            this.name = obj.name;
        }
        else
        {
            this.name = "";
        }

        if (obj.defaultTree)
        {
            this.defaultTreeKey = obj.defaultTree;
        }
        else
        {
            this.defaultTreeKey = "main";
        }

        if (obj.rootMap)
        {
            this.rootMap = new Map(
                Object.entries(obj.rootMap).map(o => [o[0], ENode.fromContentNode(o[1])])
            );
        }
        else
        {
            this.rootMap = new Map();
        }

        if (obj.stringMap)
        {
            this.stringMap = new Map(Object.entries(obj.stringMap));
        }
        else
        {
            this.stringMap = new Map();
        }
    }

    /**
     * 初始化为新内容实例
     */
    initAsNew()
    {
        this.name = "";
        this.defaultTreeKey = "main";
        this.rootMap = new Map();
        this.rootMap.set("main", new ENode());
        this.stringMap = new Map();
    }

    /**
     * 创建并初始化为一个页面
     */
    static createAsPage()
    {
        let ret = new EContent();
        ret.initAsNew();
        return ret;
    }
}