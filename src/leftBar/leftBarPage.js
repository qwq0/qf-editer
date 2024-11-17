import { eventName, NElement, NList, styles } from "../../lib/qwqframe.js";
import { leftBarContext } from "../context.js";

/**
 * 高亮当前按钮
 * @param {NElement} currentButton 
 */
function highlightCurrentButton(currentButton)
{
    if (leftBarContext.nowPageButton)
        leftBarContext.nowPageButton.setStyles({
            color: "rgb(90, 90, 90)",
            borderLeft: ""
        });
    currentButton.setStyles({
        color: "rgb(210, 210, 210)",
        borderLeft: "3px solid rgba(210, 210, 210, 0.8)"
    });
}

/**
 * 添加左侧栏页面
 * @param {string} id
 * @param {NElement} button
 * @param {NElement} page
 */
export function createLeftBarPage(id, button, page)
{
    button.applyNList([
        styles({
            color: "rgb(90, 90, 90)",
            width: "100%",
            aspectRatio: "1 / 1",
            boxSizing: "border-box",
            cursor: "pointer"
        }),
        eventName.click(e =>
        {
            highlightCurrentButton(button);
            leftBarContext.nowPageButton = button;
            leftBarContext.nowPageElement = page;
        })
    ]);
    page.applyNList([
        styles({
            position: "absolute",
            width: "100%",
            height: "100%"
        })
    ]);

    leftBarContext.pages.push({
        id: id,
        button: button,
        page: page
    });

    if (leftBarContext.nowPageButton == null)
    {
        highlightCurrentButton(button);
        leftBarContext.nowPageButton = button;
        leftBarContext.nowPageElement = page;
    }
}