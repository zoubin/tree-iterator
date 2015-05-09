# tree-iterator
Iterator for post-order-walking trees

## Usage

```javascript
var PostOrderTree = require('tree-iterator');
```

### iterable = PostOrderTree(root, getsuccessors, visited)

* `root`: *String|Number*. It is the root (key) of tree.
* `getsuccessors`: *Function*. It accepts a node (key), and returns its successors, which can either be `Array`, or somthing `Iterable`;
* `visited`: *Object*. Used to avoid revisiting the same node in [graph walking](https://github.com/zoubin/deps-iterator). Visited nodes are excluded from later paths.
* `iterable`: *Iterable*.

### for (var node of iterable)

### iter = iterable\[Symbol.iterator\]()

### iterable.on('cycle', cb)

## Examples

**for..of**

```javascript
var PostOrderTree = require('tree-iterator');
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
console.log('ordered:', ordered);

```

output:

```
⌘ node examples/no-cycle.js
ordered: [ 1, 3, 2, 0  ]
```

**.on('cycle', cb)**

```javascript
var PostOrderTree = require('tree-iterator');
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

```

output:

```
⌘ node examples/cycle.js
ordered: [ 3, 2, 1, 0  ]
cycle detected: [ 0, 1, 2, 0  ]
```

**iterable\[Symbol.iterator\]()**

```javascript
var PostOrderTree = require('tree-iterator');
var tree = {
    0: [1],
    1: [2],
    2: [3]
};
var nodes = PostOrderTree(0, function (node) {
    return tree[node];
});
var iter = nodes[Symbol.iterator]();

console.log(iter.next()); // { value: 3, done: false  }
console.log(iter.next()); // { value: 2, done: false  }
console.log(iter.next()); // { value: 1, done: false  }
console.log(iter.next()); // { value: 0, done: false  }
console.log(iter.next()); // { value: undefined, done: true  }

```

output:

```
⌘ node examples/iter.js
{ value: 3, done: false  }
{ value: 2, done: false  }
{ value: 1, done: false  }
{ value: 0, done: false  }
{ value: undefined, done: true  }
```
