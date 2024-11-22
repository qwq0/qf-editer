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
    nowFilePath: ""
});