import { getNElement } from "../../lib/qwqframe.js";

export let body = getNElement(document.body);

body.setStyles({
    width: "100%",
    height: "100%",
    margin: "0"
});

body.getParent().setStyles({
    width: "100%",
    height: "100%",
    margin: "0"
});