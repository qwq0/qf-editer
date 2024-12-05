import { body } from "../ui/body.js";
import { getHoverAsse } from "./hover.js";
import { delayPromise, eventName, NElement, NList, styles } from "../../lib/qwqframe.js";


/**
 * @type {Set<CursorMenu>}
 */
let visibleMenuSet = new Set();

/**
 * 光标菜单
 * 通常是右键后显示的菜单
 */
export class CursorMenu
{
    /**
     * @type {NElement}
     */
    #menuElement = null;

    /**
     * @type {NElement}
     */
    #holderElement = null;

    constructor()
    {
        this.#holderElement = NList.getElement([ // 背景
            styles({
                position: "absolute",
                inset: "0"
            }),

            eventName.click(e =>
            {
                this.hide();
            }),
            eventName.contextmenu(e =>
            {
                e.preventDefault();
                this.hide();
            }),

            [ // 菜单本体
                e => { this.#menuElement = e; },

                eventName.click(e =>
                {
                    e.stopPropagation();
                }),
                eventName.contextmenu(e =>
                {
                    e.stopPropagation();
                }),

                styles({
                    border: "1px solid rgba(30, 30, 70, 0.3)",
                    borderRadius: "4.5px",
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    height: "fit-content",
                    width: "fit-content",
                    position: "absolute",
                    boxShadow: "0px 0px 5px rgba(40, 40, 40, 0.5)"
                })
            ]
        ]);
    }


    /**
     * 添加列表项
     * @param {{
     *  text: string,
     *  enable: boolean,
     *  callback?: () => void
     * }} item
     */
    addItem(item)
    {
        this.#menuElement.addChild(NList.getElement([
            String(item.text),

            (!item.enable ? styles({ color: "rgb(160, 160, 165)" }) : null),
            styles({
                margin: "3px",
                padding: "3px",
                borderRadius: "3px",
                cursor: "default"
            }),

            getHoverAsse({
                backgroundColor: "rgba(40, 40, 40, 0)"
            }, {
                backgroundColor: "rgba(40, 40, 40, 0.1)"
            }),

            eventName.click(e =>
            {
                if (!item.enable)
                    return;
                try
                {
                    item.callback();
                }
                catch (err)
                {
                    console.error(err);
                }
                this.hide();
            })
        ]));
    }


    /**
     * 显示在指定坐标
     * @param {number} x
     * @param {number} y
     */
    showAt(x, y)
    {
        body.addChild(this.#holderElement);

        visibleMenuSet.add(this);

        let width = this.#menuElement.element.clientWidth;
        let height = this.#menuElement.element.clientHeight;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        if (y + height > windowHeight)
            y = y - height;
        if (y < 0)
            y = 0;
        if (x + width > windowWidth)
            x = windowWidth - width;
        if (x < 0)
            x = 0;

        this.#menuElement.setStyles({
            left: x + "px",
            top: y + "px"
        });

        this.#menuElement.animateCommit([
            {
                opacity: 0.1
            },
            {
                opacity: 1
            }
        ], 140);
    }

    /**
     * 隐藏
     */
    async hide()
    {
        visibleMenuSet.delete(this);
        await this.#menuElement.animateCommit([
            {
                opacity: 1
            },
            {
                opacity: 0.1
            }
        ], 110);
        await delayPromise(5);
        this.#holderElement.remove();
    }

    /**
     * 显示菜单
     * @param {Array<{
     *  text: string,
     *  callback?: () => void,
     *  color?: string
     * }>} list
     * @param {number} x
     * @param {number} y
     */
    static showMenu(list, x, y)
    {
        let menu = new CursorMenu();
        list.forEach(o =>
        {
            if (!o)
                return;
            menu.addItem({
                text: o.text,
                enable: o.callback != undefined,
                callback: o.callback
            });
        });
        menu.showAt(x, y);
    }
}