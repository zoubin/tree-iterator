var inherits = require('util').inherits;
var TreeIterator = require('./tree-iterator.js');

inherits(PostOrderTreeIterator, TreeIterator);

module.exports = PostOrderTreeIterator;

function PostOrderTreeIterator(root, successors, visited) {
    if (!(this instanceof PostOrderTreeIterator)) {
        return new PostOrderTreeIterator(root, successors, visited);
    }
    TreeIterator.apply(this, arguments);
};

PostOrderTreeIterator.prototype.next = function() {
    if (this.returned) {
        return this.returned;
    }
    var node;
    var suc;
    while (this.path.length) {
        node = this.path.pop();
        if (this.visited[node]) {
            continue;
        }
        if (this.path.indexOf(node) > -1) {
            // cycle detected
            return this.reportCycle(node);
        }
        suc = this.successor(node);
        if (suc.done) {
            // no successors
            return this.visit(node);
        }
        // check the next successor
        this.path.push(node, suc.value);
    }
    return this.return();
};
