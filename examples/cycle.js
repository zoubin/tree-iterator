var PostOrderTree = require('..');
var tree = {
    0: [1],
    1: [2],
    2: [3, 0]
};
var nodes = PostOrderTree(0, function (node) {
    return tree[node];
});
var ordered = [];
nodes.on('cycle', function (cycle) {
    // cycle detected: [0, 1, 2, 0]
    console.log('cycle detected:', cycle);
});
for (var n of nodes) {
    ordered.push(n);
}
// [3, 2, 1, 0]
console.log('ordered:', ordered);
