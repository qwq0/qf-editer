import { cssG, styles, NElement, NList } from "../../lib/qwqframe.js";
import { body } from "../ui/body.js";

let noticeHolder = NList.getElement([
    styles({
        pointerEvents: "none",

        position: "absolute",
        right: "15px",
        top: "15px",

        zIndex: "10000"
    })
]);
body.addChild(noticeHolder);

/**
 * 通知
 */
export class Notice
{
    /**
     * @type {NElement}
     */
    element = null;

    /**
     * 标题
     */
    title = "";

    /**
     * 内容
     */
    content = "";

    /**
     * 创建者
     */
    producer = "";

    /**
     * @param {string} title
     * @param {string} content
     * @param {string} [producer]
     */
    constructor(title, content, producer = "qf-editer")
    {
        this.title = title;
        this.content = content;
        this.producer = producer;
    }

    /**
     * 显示此通知
     */
    show()
    {
        if (!this.element)
        {
            this.element = NList.getElement([
                styles({
                    position: "relative",

                    minWidth: "240px",
                    maxWidth: "400px",
                    width: "min-content",
                    minHeight: "80px",

                    color: cssG.rgb(255, 255, 255),
                    backgroundColor: cssG.rgb(255, 255, 255, 0.1),
                    backdropFilter: "blur(2px) brightness(90%)",
                    borderRadius: "4px",
                    boxShadow: `${cssG.rgb(0, 0, 0, 0.55)} 3px 3px 9px`,
                    marginBottom: "10px",
                    marginLeft: "auto",
                    padding: "10px"
                }),
                [
                    this.title,
                    styles({
                        fontSize: "1.4em",
                        marginBottom: "3px"
                    })
                ],
                [
                    this.content,
                    styles({
                        whiteSpace: "pre-warp"
                    })
                ],
                [
                    this.producer,
                    styles({
                        fontSize: "0.8em",

                        position: "absolute",
                        right: "5px",
                        bottom: "5px",
                    })
                ]
            ]);
        }
        this.element.animate([
            {
                translate: "150% 0",
                opacity: "0.1"
            },
            {}
        ], {
            duration: 380,
            easing: "ease-in"
        });
        noticeHolder.addChild(this.element);

        setTimeout(() =>
        {
            this.hide();
        }, 2000 + Math.max(6 * 1000, this.content.length * 60));
    }

    /**
     * 隐藏此通知
     */
    async hide()
    {
        if (this.element)
        {
            await this.element.animateCommit([
                {
                },
                {
                    translate: "150% 0",
                    opacity: "0.1"
                }
            ], {
                duration: 260,
                fill: "forwards",
                easing: "ease-in"
            });

            let placeholder = NList.getElement([
                styles({
                    height: `${this.element.element.clientHeight}px`,
                    width: "1px",
                    marginBottom: String(this.element.getStyle("marginBottom"))
                })
            ]);
            this.element.replaceWith(placeholder);

            await placeholder.animateCommit([
                {
                },
                {
                    height: "0",
                    marginBottom: "0"
                }
            ], {
                duration: 150,
                fill: "forwards",
                easing: "ease-in"
            });

            placeholder.remove();
        }
    }
}

/**
 * 显示通知
 * @param {string} title 
 * @param {string} text 
 * @param {string} [producer]
 */
export function showNotice(title, text, producer)
{
    (new Notice(title, text, producer)).show();
}