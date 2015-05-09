var PostOrderTree = require('..');
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
