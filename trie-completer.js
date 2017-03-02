/**
 * A ternary search trie modified to support autocompletion suggestions.
 *
 * It's kind of like a binary search tree with lexical ordering. Best case
 * O(log n) lookups, and space requirements not significantly greater than the
 * array of completions itself.
 *
 * Construct with an array of strings:
 *
 *  const Completer = require('completer');
 *
 *  let completer = new Completer([
 *    'a', 'aa', 'aaab', 'abc', 'def'
 *  ]);
 *
 * Then you can get the completions for a prefix via completer.getCompletions(prefix);
 * Completions will be sorted in ascending lexical order.
 *
 * See Sedgewick & Wayne, Algorithms, 4th edition, Section 5.2
 */
module.exports = function (completions) {
  let Node = function() {
    this.c = null;
    this.left = null;
    this.mid = null;
    this.right = null;
    this.completion = null;
    this.isCompletion = null;
  };

  this.size = 0;

  let _put = function(node, completion, d) {
    let c = completion[d];

    if (!node) {
      node = new Node();
      node.c = c;
    }

    if (c < node.c) {
      node.left = _put(node.left, completion, d);
    } else if (c > node.c) {
      node.right = _put(node.right, completion, d);
    } else if (d < completion.length - 1) {
      node.mid = _put(node.mid, completion, d+1);
    } else {
      node.isCompletion = true;
    }

    return node;
  };

  let _get = function(node, prefix, d) {
    if (!node) {
      return null;
    }

    let c = prefix[d];
    if (c < node.c) {
      return _get(node.left, prefix, d);
    } else if (c > node.c) {
      return _get(node.right, prefix, d);
    } else if (d < prefix.length - 1) {
      return _get(node.mid, prefix, d+1);
    } else {
      return node;
    }
  };

  this.contains = function(completion) {
    let node = _get(this.root, completion, 0);
    if (!node) {
      return false;
    }
    return node.isCompletion;
  };

  this.addCompletion = function(completion) {
    if (!this.contains(completion)) {
      this.size++;
    }
    this.root = _put(this.root, completion, 0);
  };

  let collectCompletions = function (node, prefix, completions, limit) {
    if (limit && completions.length == limit) {
      return;
    }

    if (node.isCompletion) {
      completions.push(prefix+node.c);
    }

    if (node.left) {
      collectCompletions(node.left, prefix, completions, limit);
    }

    if (node.mid) {
      collectCompletions(node.mid, prefix+node.c, completions, limit);
    }

    if (node.right) {
      collectCompletions(node.right, prefix, completions, limit);
    }
  };

  this.getCompletions = function(prefix, limit) {
    let completions = [];
    if (!prefix) {
      return completions;
    }

    let prefixNode = _get(this.root, prefix, 0);
    if (!prefixNode) {
      return completions;
    }

    if (prefixNode.isCompletion) {
      completions.push(prefix);
    }

    if (!prefixNode.mid) {
      return completions;
    }

    collectCompletions(prefixNode.mid, prefix, completions, limit);

    return completions;
  };

  let _constructor = function (that) {
    // We use pseudorandom indexing to construct a (relatively) balanced trie
    let indexCache = {};
    let getRandomInt = function (min, max) {
      min = Math.ceil(min); max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };

    let getRandomIndex = function(list) {
      let index;

      do {
        index = getRandomInt(0, list.length);
      } while(indexCache[index]);

      indexCache[index] = true;

      return index;
    };

    let totalCompletions = 0;
    while (totalCompletions < completions.length) {
      let i = getRandomIndex(completions);
      that.addCompletion(completions[i]);
      totalCompletions++;
    }

    indexCache = undefined; // Help the Garbage Collector out
  };

  _constructor(this);
};
