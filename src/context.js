import { createHookArray, createHookObj, EventHandler, NElement, NLocate } from "../lib/qwqframe.js";

/**
 * 左侧栏上下文
 */
export let leftBarContext = createHookObj({
    nowPageElement: new NLocate(),
    nowPageButton: null,
    /**
     * @type {Array<{
     *  id: string,
     *  button: NElement,
     *  page: NElement
     * }>}
     */
    pages: createHookArray([])
});

/**
 * 当前项目上下文
 */
export let projectContext = {
    /** @type {FileSystemDirectoryHandle} */
    fileSystemDirectoryHandle: null,
    info: createHookObj({
        projectName: ""
    }),
    /**
     * 项目上下文事件
     */
    events: {
        /**
         * 打开项目事件
         */
        open: new EventHandler()
    }
};

/**
 * 中间的编辑器上下文
 */
export let editerContext = createHookObj({
    nowFilePath: "",
    nowFileName: "",
    /** @type {import("./file/EContent.js").EContent} */
    nowFileCotext: null,
    /** @type {import("./file/ENode.js").ENode} */
    nowRootNode: null,

    /** @type {NElement} */
    snippetListElement: null,
    /** @type {NElement} */
    treeListElement: null,
    /** @type {NElement<HTMLIFrameElement>} */
    previewElement: null,
    /** @type {NElement} */
    detailListElement: null,
});