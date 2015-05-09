var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
inherits(PostOrderTree, EventEmitter);

module.exports = PostOrderTree;

function PostOrderTree(root, getSuccessors, visited) {
    if (!(this instanceof PostOrderTree)) {
        return new PostOrderTree(root, getSuccessors, visited);
    }
    this.visited = visited;
    this.root = root;
    this.getSuccessors = function *(node) {
        yield* (getSuccessors(node) || []);
    };
}

PostOrderTree.prototype[Symbol.iterator] = function *() {
    var self = this;
    var path = [this.root];
    var visited = this.visited || {};

    var node;
    var suc;
    var sucIter = {};
    while (path.length) {
        node = path.pop();
        if (visited[node]) {
            continue;
        }
        if (path.indexOf(node) > -1) {
            // cycle detected
            process.nextTick(this.emit.bind(this, 'cycle', this.getCycle(node, path)));
            continue;
        }
        suc = next(node);
        if (suc.done) {
            visited[node] = true;
            // no successors
            yield node;
        } else {
            // check the next successor
            path.push(node, suc.value);
        }
    }

    function next(node) {
        if (!sucIter[node]) {
            sucIter[node] = self.getSuccessors(node);
        }
        return sucIter[node].next();
    }
};

PostOrderTree.prototype.getCycle = function(node, path) {
    var cycle = [node];
    var i = path.length;
    while (i--) {
        cycle.unshift(path[i]);
        if (path[i] === node) {
            break;
        }
    }
    return cycle;
};

