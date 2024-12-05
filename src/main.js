import { bindArrayHook, bindValue, NAttr, NList, nTagName, NTagName, styles } from "../lib/qwqframe.js";
import { editerContext, leftBarContext, projectContext } from "./context.js";
import { initEditer } from "./editer/initEditer.js";
import { initLeftBar } from "./leftBar/initLeftBar.js";
import { initRightBar } from "./rightBar/initRightBar.js";
import { body } from "./ui/body.js";

(() =>
{
    body.addChild(NList.getElement([
        styles({
            height: "100%",
            width: "100%",
            backgroundColor: "rgb(0, 0, 0)",
            userSelect: "none",
            position: "fixed"
        }),

        [ // 顶栏
            styles({
                position: "absolute",
                height: "36px",
                width: "100%",
                top: "0",
                backgroundColor: "rgb(40, 40, 40)",
                color: "rgb(210, 210, 210)",
                display: "flex",
                justifyContent: "center"
            }),

            [
                bindValue(projectContext.info, "projectName", o => (o ? `${o} - ` : "")),
                bindValue(editerContext, "nowFileName", o => (o ? `${o} - ` : "")),
                "Q Frame Editer",
                styles({
                    alignSelf: "center",
                }),
            ]
        ],

        [
            styles({
                position: "absolute",
                top: "36px",
                left: "0",
                bottom: "21px",
                width: "100%"
            }),

            [ // 左侧栏
                styles({
                    position: "absolute",
                    height: "100%",
                    width: "45px",
                    top: "0",
                    backgroundColor: "rgb(34, 34, 34)"
                }),
                ele =>
                {
                    bindArrayHook(leftBarContext.pages, {
                        add: (index, o) =>
                        {
                            let button = o.button;
                            ele.insChild(button, index);
                            return () => { button.remove(); };
                        },
                        del: () => { }
                    });
                }
            ],

            [ // 主体
                styles({
                    position: "absolute",
                    left: "45px",
                    right: "39px",
                    height: "100%",
                    top: "0"
                }),

                [ // 左侧项目概览
                    styles({
                        position: "absolute",
                        left: "0",
                        width: "200px",
                        top: "0",
                        height: "100%",
                        backgroundColor: "rgb(28, 28, 28)"
                    }),
                    bindValue(leftBarContext, "nowPageElement")
                ],

                [ // 主体上方选项卡
                    styles({
                        position: "absolute",
                        left: "200px",
                        right: "0",
                        top: "0",
                        height: "33px",
                        backgroundColor: "rgb(25, 25, 25)"
                    })
                ],

                [ // 编辑器主体
                    styles({
                        position: "absolute",
                        left: "200px",
                        right: "0",
                        top: "33px",
                        bottom: "0",
                        backgroundColor: "rgb(7, 7, 7)"
                    }),

                    [ // 左侧列表
                        styles({
                            position: "absolute",
                            left: "0",
                            width: "270px",
                            top: "0",
                            height: "100%",
                            borderRight: "1px solid rgba(190, 190, 190, 0.3)",
                            boxSizing: "border-box",
                            backgroundColor: "rgb(17, 17, 17)"
                        }),
                        [ // 预制片段列表
                            styles({
                                position: "absolute",
                                left: "0",
                                width: "100%",
                                top: "0",
                                height: "50%",
                                borderBottom: "1px solid rgba(190, 190, 190, 0.3)",
                                boxSizing: "border-box"
                            }),
                            ele => { editerContext.snippetListElement = ele; }
                        ],
                        [ // 节点树列表
                            styles({
                                position: "absolute",
                                left: "0",
                                width: "100%",
                                top: "50%",
                                bottom: "0",
                                boxSizing: "border-box"
                            }),
                            ele => { editerContext.treeListElement = ele; }
                        ]
                    ],

                    [ // 预览视图
                        styles({
                            position: "absolute",
                            left: "270px",
                            right: "250px",
                            top: "0",
                            height: "100%",
                            boxSizing: "border-box"
                        }),
                        [
                            nTagName.iframe,
                            new NAttr("src", "about:blank"),
                            new NAttr("sandbox", "allow-scripts"),
                            new NAttr("allow", ""),
                            styles({
                                border: "0",
                                width: "100%",
                                height: "100%"
                            }),
                            ele => { editerContext.previewElement = ele; }
                        ]
                    ],

                    [ // 右侧详情列表
                        styles({
                            position: "absolute",
                            right: "0",
                            width: "250px",
                            top: "0",
                            height: "100%",
                            borderLeft: "1px solid rgba(190, 190, 190, 0.3)",
                            boxSizing: "border-box",
                            backgroundColor: "rgb(17, 17, 17)"
                        }),
                        ele => { editerContext.detailListElement = ele; }
                    ]
                ],
            ],

            [ // 底部窗口
                styles({
                    position: "absolute",
                    left: "45px",
                    right: "45px",
                    height: "0",
                    bottom: "0",
                    backgroundColor: "rgb(34, 34, 34)",
                    display: "none"
                }),
            ],

            [ // 右侧栏
                styles({
                    position: "absolute",
                    height: "100%",
                    width: "39px",
                    top: "0",
                    right: "0",
                    backgroundColor: "rgb(34, 34, 34)"
                })
            ]
        ],

        [ // 底栏
            styles({
                position: "absolute",
                height: "21px",
                width: "100%",
                bottom: "0",
                backgroundColor: "rgb(230, 220, 40)"
            })
        ]
    ]));


    initLeftBar();
    initRightBar();
    initEditer();
})();