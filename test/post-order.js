var assert = require('assert');
var PostOrderTreeIterator = require('..').postOrder;

describe('post order tree walker', function () {
    it('single node', function () {
        var tree = {
            0: []
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });
        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('two nodes', function () {
        var tree = {
            0: [1]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });
        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('three nodes, grandparent, parent and child', function () {
        var tree = {
            0: [1],
            1: [2]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });
        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('three nodes, common successor', function () {
        var tree = {
            0: [1, 2],
            1: [2]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });
        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('three nodes, parent and children', function () {
        var tree = {
            0: [1, 2]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });
        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('more than three nodes, grandparent and grand children', function () {
        var tree = {
            0: [1, 2],
            2: [3]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 3
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });
        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });
        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('cycle, single node', function () {
        var tree = {
            0: [0]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        var res = walker.next();
        assert.equal(res.done, false);
        assert.equal(res.value, undefined);
        assert.equal(res.error instanceof Error, true);
        assert.deepEqual(res.cycle, ['0', '0']);

        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });

        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('cycle, two nodes', function () {
        var tree = {
            0: [1],
            1: [0]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        var res = walker.next();
        assert.deepEqual(res.cycle, ['0', '1', '0']);

        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });

        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('cycle, triangle', function () {
        var tree = {
            0: [1],
            1: [2],
            2: [0]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        var res = walker.next();
        assert.deepEqual(res.cycle, ['0', '1', '2', '0']);

        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });

        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('cycle, 4 nodes with triangle, case 1', function () {
        var tree = {
            0: [1],
            1: [2],
            2: [0, 3]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });
        var res = walker.next();
        assert.deepEqual(res.cycle, ['0', '1', '2', '0']);

        assert.deepEqual(walker.next(), {
            done: false,
            value: 3
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });

        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('cycle, 4 nodes with triangle, case 2', function () {
        var tree = {
            0: [1],
            1: [2],
            2: [3, 0]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 3
        });

        assert.deepEqual(walker.next().cycle, ['0', '1', '2', '0']);

        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });

        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
    it('two cycles', function () {
        var tree = {
            0: [1, 3],
            1: [2],
            2: [0],
            3: [2]
        };
        var walker = PostOrderTreeIterator(0, function (node) {
            return tree[node];
        });

        assert.deepEqual(walker.next().cycle, ['0', '1', '2', '0']);

        assert.deepEqual(walker.next(), {
            done: false,
            value: 2
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 1
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 3
        });

        assert.deepEqual(walker.next(), {
            done: false,
            value: 0
        });

        assert.deepEqual(walker.next(), {
            done: true,
            value: undefined
        });
    });
});
