var h = require("../index.js");

var tree = h("div.header", {style: {"background-color": "yellow"}}, [
  h(".header_container", [
    h(".header_container_logo"),
    h(".header_container_login-container")
  ])
]);

console.log(tree.outerHTML)
