import { initDetailList } from "./detailList.js";
import { initPreview } from "./preview.js";
import { initSnippetList } from "./snippetList.js";
import { initTreeList } from "./treeList.js";

/**
 * 初始化编辑器
 */
export function initEditer()
{
    try
    {
        initDetailList();
        initSnippetList();
        initTreeList();
        initPreview();
    }
    catch(err)
    {
        console.error("Failed to init the editer.");
        console.error(err);
    }
}