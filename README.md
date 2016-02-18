## Hipsterscript
> The most hipster DSL for creating virtual trees.

## Example
```javascript
var h = require("hipsterscript");

var tree = h("div.header", {style: {"background-color": "yellow"}}, [
  h(".header_container", [
    h(".header_container_logo"),
    h(".header_container_login-container")
  ])
]);

console.log(tree.outerHTML);
```
## API
### `h(selector, properties, children)`

| Name | Type | Description |
|------|------|-------------|
| selector | `String` | DOM Selector 
| properties | `Object ` | (Optional) - Attributes to set on the node
| children | `Array<hNode>` | (Optional) - Children nodes.

Returns: `hNode`
