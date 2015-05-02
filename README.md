# tree-iterator
Iterator for walking trees

## post-order walk
A stable post-order tree walk.

### Usage

```javascript
var PostOrderTreeIterator = require('tree-iterator').postOrder;
var walker = PostOrderTreeIterator(root, successors, visited);
```

* `root`: [String|Number]. It is the root (key) of tree.
* `successors`: [Function]. It accepts a node (key), and returns the successors, which can either be `Array`, or `Object` with a `.next` method;
* `visited`: [Object]. Used to avoid revisit the same node in graph walking.

It returns a object with a `.next` method, which implements the [Iterator Interface](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iterator-interface)

### Examples

**Without Cycle**

```javascript
var assert = require('assert');
var PostOrderTreeIterator = require('tree-iterator').postOrder;

var records = [
    { id:0, deps: [1, 2] },
    { id:2, deps: [3] }
];
var graph = records.reduce(function (o, r) {
    o[r.id] = r.deps;
    return o;
}, {});

var walker = PostOrderTreeIterator(0, function (n) {
    return graph[n];
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

```

**With Cycle**

```javascript
var assert = require('assert');
var PostOrderTreeIterator = require('tree-iterator').postOrder;

var records = [
    { id:0, deps: [1] },
    { id:1, deps: [2] },
    { id:2, deps: [3, 0] }
];
var graph = records.reduce(function (o, r) {
    o[r.id] = r.deps;
    return o;
}, {});

var walker = PostOrderTreeIterator(0, function (n) {
    return graph[n];
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

```

