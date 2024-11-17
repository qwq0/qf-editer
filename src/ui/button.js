import { eventName, NElement, NEvent, styles } from "../../lib/qwqframe.js";

/**
 * 按钮流水线
 * @param {NElement} ele
 * @returns {NElement}
 */
export function buttonAsse(ele)
{
    let hovering = false;
    ele.applyNList([
        styles({
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "15px",
            paddingRight: "15px",
            display: "flex",
        }),

        eventName.mouseenter(() =>
        {
            hovering = true;
            ele.animate([
                {
                    backgroundColor: "rgba(150, 150, 150, 0)"
                },
                {
                    backgroundColor: "rgba(150, 150, 150, 0.3)"
                }
            ], {
                duration: 190,
                fill: "forwards"
            });
        }),
        eventName.mouseleave(() =>
        {
            hovering = false;
            ele.animate([
                {
                    backgroundColor: "rgba(150, 150, 150, 0.3)"
                },
                {
                    backgroundColor: "rgba(150, 150, 150, 0)"
                }
            ], {
                duration: 140,
                fill: "forwards"
            });
        }),
        new NEvent("mousedown", () =>
        {
            ele.animate([
                {
                    backgroundColor: (hovering ? "rgba(150, 150, 150, 0.3)" : "rgba(150, 150, 150, 0)")
                },
                {
                    backgroundColor: "rgba(150, 150, 150, 0.5)"
                }
            ], {
                duration: 140,
                fill: "forwards"
            });
        }),
        new NEvent("mouseup", () =>
        {
            ele.animate([
                {
                    backgroundColor: "rgba(150, 150, 150, 0.5)"
                },
                {
                    backgroundColor: (hovering ? "rgba(150, 150, 150, 0.3)" : "rgba(150, 150, 150, 0)")
                }
            ], {
                duration: 140,
                fill: "forwards"
            });
        }),
    ]);
    return ele;
}
