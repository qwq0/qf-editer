import { NList, styles } from "../../lib/qwqframe.js";
import { createLeftBarPage } from "./leftBarPage.js";

/**
 * 初始化搜索
 */
export function initSearch()
{
    createLeftBarPage("search", NList.getElement([
        styles({
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }),
        "sch"
    ]), NList.getElement([
        styles({
            color: "rgb(255, 255, 255)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            overflow: "auto",
            scrollbarWidth: "none"
        }),
        [
            "搜索",
            styles({
                color: "rgb(120, 120, 120)",
                alignSelf: "start"
            })
        ],

        [
            "TODO"
        ]
    ]));
}