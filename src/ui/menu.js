import { cssG, expandElement, NElement, NEvent, NList, styles } from "../../lib/qwqframe.js";
import { body } from "./body.js";
import { buttonAsse } from "./button.js";

/**
 * 显示菜单
 * @async
 * @param {Array<NElement | import("../../lib/qwqframe.js").NList_list>} menuItems
 * @returns {Promise<boolean>}
 */
export function showMenu(menuItems)
{
    return new Promise(resolve =>
    {
        /**
         * @type {NElement}
         */
        var menu = null;
        var menuHolder = NList.getElement([ // 背景
            styles({
                width: "100%",
                height: "100%",
                position: "absolute",
                userSelect: "none",
                backgroundColor: cssG.rgb(0, 0, 0, 0.7),
                alignItems: "center",
                justifyContent: "center",
                zIndex: "30001",
                display: "flex",
            }),

            e =>
            {
                e.animate([
                    {
                        opacity: 0.1
                    },
                    {
                        opacity: 1
                    }
                ], {
                    duration: 105
                });
            },

            new NEvent("click", closeMenuBox),

            [ // 菜单
                styles({
                    border: "1px white solid",
                    backgroundColor: cssG.rgb(255, 255, 255),
                    color: cssG.rgb(0, 0, 0),
                    alignItems: "stretch",
                    justifyContent: "center",
                    flexFlow: "column",
                    lineHeight: "45px",
                    minHeight: "10px",
                    minWidth: "280px",
                    maxHeight: "100%",
                    maxWidth: "95%",
                    boxSizing: "border-box",
                    padding: "10px",
                    borderRadius: "4px",
                    pointerEvents: "none",
                    overflow: "auto",
                }),

                e => menu = e,

                new NEvent("click", e => { e.stopPropagation(); }),

                ...menuItems,

                e =>
                {
                    e.animate([
                        {
                            transform: "scale(0.9) translateY(-100px)"
                        },
                        {
                        }
                    ], {
                        duration: 105
                    });
                    setTimeout(() => { e.setStyle("pointerEvents", "auto"); }, 120);
                    e.getChilds().forEach(o =>
                    {
                        o.addEventListener("click", closeMenuBox);
                        buttonAsse(o);
                    });
                }
            ],
        ]);
        function closeMenuBox()
        {
            menu.setStyle("pointerEvents", "none");
            menu.animate([
                {
                },
                {
                    transform: "scale(0.9) translateY(-100px)"
                }
            ], {
                duration: 95,
                fill: "forwards"
            });
            menuHolder.animate([
                {
                    opacity: 1
                },
                {
                    opacity: 0.1
                }
            ], {
                duration: 95,
                fill: "forwards"
            });
            setTimeout(() =>
            {
                menuHolder.remove();
            }, 120);
        }
        body.addChild(menuHolder);
    });
}