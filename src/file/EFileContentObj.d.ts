/**
 * qfe文件内容部分的节点类型
 */
type EFCNode = {
    id?: string;
    class?: Array<string>;
    type?: string;
    attr?: Object<string, string | number | boolean>;
    refId?: string;
    child?: Array<EFCNode>;
};

/**
 * qfe文件内容部分表示对节点的引用
 */
type EFCRefNode = {
    ref: string;
};

/**
 * qfe文件内容部分的类型
 */
export type EfileContentObj = {
    name?: string;
    rootMap?: Object<string, EFCNode>;
    defaultTree?: string;
    stringMap?: Object<string, string>;
};