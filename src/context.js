import { createHookArray, createHookObj, NElement, NLocate } from "../lib/qwqframe.js";

// 左侧栏上下文
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

export let projectContext = {
    /** @type {FileSystemDirectoryHandle} */
    fileSystemDirectoryHandle: null,
    info: createHookObj({
        projectName: ""
    })
};

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