var PostOrderTree = require('..');
var tree = {
    0: [1, 2],
    2: [3]
};
var ordered = [];
var nodes = PostOrderTree(0, function (node) {
    return tree[node];
});
for (var n of nodes) {
    ordered.push(n);
}
// [1, 3, 2, 0]
console.log('ordered:', ordered);
