import { cssG, expandElement, NElement, NList } from "../../lib/qwqframe.js";
import { body } from "./body.js";
import { buttonAsse } from "./button.js";

/**
 * 显示信息框
 * @async
 * @param {string} title
 * @param {string} text
 * @param {boolean} [allowCancel]
 * @param {Array<NElement>} [extraEle]
 * @returns {Promise<boolean>}
 */
export function showInfoBox(title, text, allowCancel = false, ...extraEle)
{
    return new Promise(resolve =>
    {
        /**
         * @type {NElement}
         */
        let infoBox = undefined;
        let infoBoxHolder = expandElement({ // 背景
            width: "100%", height: "100%",
            left: "0", top: "0",
            $position: "absolute",
            style: {
                userSelect: "none",
                backgroundColor: cssG.rgb(0, 0, 0, 0.7),
                alignItems: "center",
                justifyContent: "center",
                zIndex: "30001"
            },
            assembly: [e =>
            {
                e.animate([
                    {
                        opacity: 0.05
                    },
                    {
                        opacity: 1
                    }
                ], {
                    duration: 115
                });
            }],
            display: "flex",
            child: [{ // 信息框
                style: {
                    border: "1px white solid",
                    backgroundColor: cssG.rgb(255, 255, 255),
                    color: cssG.rgb(0, 0, 0),
                    alignItems: "center",
                    justifyContent: "center",
                    flexFlow: "column",
                    lineHeight: "35px",
                    minHeight: "190px",
                    minWidth: "280px",
                    maxWidth: "95%",
                    maxHeight: "95%",
                    boxSizing: "border-box",
                    padding: "20px",
                    borderRadius: "7px",
                    pointerEvents: "none"
                },
                assembly: [e =>
                {
                    e.animate([
                        {
                            transform: "scale(0.9) translateY(-45px)"
                        },
                        {
                        }
                    ], {
                        duration: 115
                    });
                    setTimeout(() => { e.setStyle("pointerEvents", "auto"); }, 120);
                }, e => { infoBox = e; }],
                position$: "static",
                display: "flex",
                child: [{
                    text: title
                }, {
                    text: text,
                    style: {
                        overflow: "auto",
                        alignSelf: "stretch",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }
                }, ...extraEle, {
                    text: "确定",
                    assembly: [buttonAsse],
                    event: {
                        click: () =>
                        {
                            closeInfoBox();
                            resolve(true);
                        }
                    }
                },
                (allowCancel ? {
                    text: "取消",
                    assembly: [buttonAsse],
                    event: {
                        click: () =>
                        {
                            closeInfoBox();
                            resolve(false);
                        }
                    }
                } : null)]
            }]
        });
        function closeInfoBox()
        {
            infoBox.setStyle("pointerEvents", "none");
            infoBox.animate([
                {
                },
                {
                    transform: "scale(0.9) translateY(-40px)"
                }
            ], {
                duration: 95,
                fill: "forwards"
            });
            infoBoxHolder.animate([
                {
                    opacity: 1
                },
                {
                    opacity: 0.05
                }
            ], {
                duration: 95,
                fill: "forwards"
            });
            setTimeout(() =>
            {
                infoBoxHolder.remove();
            }, 120);
        }
        body.addChild(infoBoxHolder);
    });
}

/**
 * 显示输入框
 * @param {string} title
 * @param {string} text
 * @param {boolean} [allowCancel]
 * @param {string} [initValue]
 * @returns {Promise<string>}
 */
export async function showInputBox(title, text, allowCancel = false, initValue = "")
{
    let input = expandElement({
        tagName: "input",
        assembly: [buttonAsse],
        style: {
            textAlign: "center",
            margin: "15px"
        },
        attr: {
            value: initValue
        }
    });
    input.addEventListener("keydown", e => { e.stopPropagation(); }, true);
    setTimeout(() => input.element.focus(), 100);
    let confirm = await showInfoBox(title, text, allowCancel, input);
    return (confirm ? input.element.value : undefined);
}

/**
 * 显示多行输入框
 * @param {string} title
 * @param {string} text
 * @param {boolean} [allowCancel]
 * @param {string} [initValue]
 * @returns {Promise<string>}
 */
export async function showTextareaBox(title, text, allowCancel = false, initValue = "")
{
    let textarea = expandElement({
        tagName: "textarea",
        style: {
            resize: "none",
            height: "5em",
            weight: "20em"
        },
        attr: {
            value: initValue
        }
    });
    textarea.addEventListener("keydown", e => { e.stopPropagation(); }, true);
    setTimeout(() => textarea.element.focus(), 100);
    let confirm = await showInfoBox(title, text, allowCancel, textarea);
    return (confirm ? textarea.element.value : undefined);
}

/**
 * 显示复制框
 * @param {string} title
 * @param {string} text
 * @param {string} copyText
 * @returns {Promise<boolean>}
 */
export async function showCopyBox(title, text, copyText)
{
    let copyTextarea = expandElement({
        tagName: "textarea",
        style: {
            resize: "none",
            height: "5em",
            weight: "20em"
        },
        attr: {
            value: copyText
        }
    });
    copyTextarea.addEventListener("keydown", e => { e.stopPropagation(); }, true);
    copyTextarea.addEventListener("input", () =>
    {
        copyTextarea.element.value = copyText;
    });
    setTimeout(() => copyTextarea.element.focus(), 100);
    return await showInfoBox(title, text, false, copyTextarea);
}

/**
 * 显示表单框
 * @param {string} title
 * @param {string} text
 * @param {import("../../lib/qwqframe.js").NList_list} form
 * @returns {Promise<Boolean>}
 */
export async function showFormBox(title, text, form)
{
    let confirm = await showInfoBox(title, text, true, NList.getElement(form));
    return confirm;
}