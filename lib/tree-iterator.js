var ArrayIterator = require('./array-iterator.js');
module.exports = TreeIterator;

function TreeIterator(root, successors, visited) {
    if (!(this instanceof TreeIterator)) {
        return new TreeIterator(root, successors, visited);
    }
    this.path = [root];
    this.visited = visited || {};
    this.successors = successors;
    this.successorIterator = {};
};

TreeIterator.prototype.successor = function(node) {
    if (!this.successorIterator.hasOwnProperty(node)) {
        var iter = this.successors(node);
        if (iter && typeof iter.next === 'function') {
            this.successorIterator[node] = iter;
        } else {
            this.successorIterator[node] = ArrayIterator(iter);
        }
    }
    return this.successorIterator[node].next();
};

TreeIterator.prototype.next = function() {
    throw new Error('method .next() NOT implemented.');
};

TreeIterator.prototype.getCyclePath = function(node) {
    var cycle = [node];
    var i = this.path.length;
    while (i--) {
        cycle.unshift(this.path[i]);
        if (this.path[i] === node) {
            break;
        }
    }
    return cycle;
};

TreeIterator.prototype.visit = function(err, node) {
    if (!err) {
        this.visited[node] = true;
        return {
            done: false,
            value: node
        };
    }
    return {
        done: false,
        error: err,
        cycle: this.getCyclePath(node)
    };
};

TreeIterator.prototype.return = function(v) {
    this.returned = { done: true, value: v };
    return this.returned;
};

TreeIterator.prototype.throw = function(err) {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    if (!(err instanceof Error)) {
        err = new Error('error throwed');
    }
    throw err;
};

