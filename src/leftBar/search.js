import { NList, styles } from "../../lib/qwqframe.js";
import { createLeftBarPage } from "./leftBarPage.js";

/**
 * 初始化搜索
 */
export function initSearch()
{
    createLeftBarPage("search", NList.getElement([
        "sch"
    ]), NList.getElement([
        styles({
            color: "rgb(255, 255, 255)",
        }),
        "hi1"
    ]));
}