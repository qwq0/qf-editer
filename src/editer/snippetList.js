import { eventName, NList, styles } from "../../lib/qwqframe.js";
import { editerContext } from "../context.js";

/**
 * snippet列表项类
 */
class SnippetItem
{
    /**
     * 元素类型id
     * 对应type
     */
    type = "";

    /**
     * 默认显示名称
     * 若有多语言将覆盖此值
     */
    displayName = "";

    /**
     * 图标
     */
    icon = "";
}

/**
 * 当前的snippet列表
 * @type {Array<SnippetItem>}
 */
let snippetList = [];

/**
 * 刷新snippet列表信息
 */
function refreshSnippetListInfo()
{
    let ret = new SnippetItem();
    ret.displayName = "div";
    snippetList.push(ret);
}

/**
 * 初始化预制片段列表
 */
export function initSnippetList()
{
    /**
     * 刷新snippet列表显示
     */
    function refreshSnippetListDisplay()
    {
        editerContext.snippetListElement.removeChilds();
        snippetList.forEach(o =>
        {
            editerContext.snippetListElement.addChild(NList.getElement([
                styles({
                    width: "60px",
                    height: "94px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxSizing: "border-box",
                    color: "rgb(190, 190, 190)"
                }),
                o.displayName
            ]));
        });
    }

    editerContext.snippetListElement.applyNList([
        styles({
            display: "grid"
        }),
        eventName.contextmenu(e =>
        {
            e.preventDefault();
            e.stopPropagation();
        })
    ]);

    refreshSnippetListInfo();
    refreshSnippetListDisplay();
}