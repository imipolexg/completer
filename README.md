A ternary search trie modified to support autocompletion suggestions.

It's kind of like a binary search tree with lexical ordering. Best case
O(log n) lookups, and space requirements not significantly greater than the
array of completions itself.

Construct with an array of strings:

    const Completer = require('trie-completer');

    let completer = new Completer([
        'a', 'aa', 'aaab', 'abc', 'def'
    ]);

Then you can get the completions for a prefix via `completer.getCompletions(prefix)`
Completions will be sorted in ascending lexical order.

See Sedgewick & Wayne, Algorithms, 4th edition, Section 5.2
