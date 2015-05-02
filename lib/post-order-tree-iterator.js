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
    var node = this.path.pop();
    while (this.visited[node]) {
        node = this.path.pop();
    }

    if (typeof node === 'undefined') {
        return this.return();
    }

    var suc = this.successor(node);
    while (!suc.done) {
        this.path.push(node);
        node = suc.value;
        if (this.path.indexOf(node) > -1) {
            // cycle detected
            return this.visit(new Error('Cycle Detected:'), node);
        }
        suc = this.successor(node);
    }
    return this.visit(null, node);
};
