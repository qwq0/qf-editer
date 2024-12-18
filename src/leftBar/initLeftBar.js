import { initFileExplorer } from "./fileExplorer.js";
import { initSearch } from "./search.js";

/**
 * 初始化左侧栏
 */
export function initLeftBar()
{
    try
    {
        initFileExplorer();
        initSearch();
    }
    catch(err)
    {
        console.error("Failed to init the left sidebar.");
        console.error(err);
    }
}