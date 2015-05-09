var test = require('tape');
var PostOrderTree = require('..');

test('single node', function (t) {
    var tree = {
        0: []
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var walker = nodes[Symbol.iterator]();
    t.deepEqual(walker.next(), {
        done: false,
        value: 0
    }, 'first iteration, not done');
    t.deepEqual(walker.next(), {
        done: true,
        value: undefined
    }, 'second iteration, done');
    t.end();
});
test('two nodes', function (t) {
    var tree = {
        0: [1]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    t.deepEqual(ordered, [1, 0]);
    t.end();
});
test('three nodes, grandparent, parent and child', function (t) {
    var tree = {
        0: [1],
        1: [2]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    t.deepEqual(ordered, [2, 1, 0]);
    t.end();
});
test('three nodes, common successor', function (t) {
    var tree = {
        0: [1, 2],
        1: [2]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    t.deepEqual(ordered, [2, 1, 0]);
    t.end();
});
test('three nodes, parent and children', function (t) {
    var tree = {
        0: [1, 2]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    t.deepEqual(ordered, [1, 2, 0]);
    t.end();
});
test('more than three nodes, grandparent and grand children', function (t) {
    var tree = {
        0: [1, 2],
        2: [3]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    t.deepEqual(ordered, [1, 3, 2, 0]);
    t.end();
});
test('cycle, single node', function (t) {
    t.plan(2);
    var tree = {
        0: [0]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    nodes.on('cycle', function (cycle) {
        t.deepEqual(ordered, [0]);
        t.deepEqual(cycle, [0, 0]);
    });
});
test('cycle, two nodes', function (t) {
    t.plan(2);
    var tree = {
        0: [1],
        1: [0]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    nodes.on('cycle', function (cycle) {
        t.deepEqual(cycle, [0, 1, 0]);
        t.deepEqual(ordered, [1, 0]);
    });
});
test('cycle, triangle', function (t) {
    t.plan(2);
    var tree = {
        0: [1],
        1: [2],
        2: [0]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    nodes.on('cycle', function (cycle) {
        t.deepEqual(cycle, [0, 1, 2, 0]);
        t.deepEqual(ordered, [2, 1, 0]);
    });
});
test('cycle, 4 nodes with triangle, case 1', function (t) {
    t.plan(2);
    var tree = {
        0: [1],
        1: [2],
        2: [0, 3]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    nodes.on('cycle', function (cycle) {
        t.deepEqual(cycle, [0, 1, 2, 0]);
        t.deepEqual(ordered, [3, 2, 1, 0]);
    });
});
test('cycle, 4 nodes with triangle, case 2', function (t) {
    t.plan(2);
    var tree = {
        0: [1],
        1: [2],
        2: [3, 0]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    nodes.on('cycle', function (cycle) {
        t.deepEqual(cycle, [0, 1, 2, 0]);
        t.deepEqual(ordered, [3, 2, 1, 0]);
    });
});
test('two cycles', function (t) {
    t.plan(2);
    var tree = {
        0: [1, 3],
        1: [2],
        2: [0],
        3: [2]
    };
    var nodes = PostOrderTree(0, function (node) {
        return tree[node];
    });
    var ordered = walk(nodes);
    nodes.on('cycle', function (cycle) {
        t.deepEqual(cycle, [0, 1, 2, 0]);
        t.deepEqual(ordered, [2, 1, 3, 0]);
    });
});

function walk(nodes) {
    var ordered = [];
    for (var n of nodes) {
        ordered.push(n);
    }
    return ordered;
}
