codewars
========

codewars.com library and cli.

*Note:* work in progress.

Flow
----

```
$ mkdir kata; cd kata

$ codewars next  // or kata_id instead

$ ls
README.md kata.js test.js

$ codewars test  // local testing
Test Passed

$ codewars attempt
```


Commands
--------

**next** - retrieves the next kata. Places the stub into `kata.js`, the test into `test.js` and the description in the `README.md`.

**<kata_id>** - same as `next`, but by providing a specific kata id

**test** - run the test.js with kata.js

**test --watch** or **-w** - will run the test, and watch for changes in the files; re-running the test when a file is updated



Regarding stack-traces
----------------------

Stack-traces, or at least the line number and the character
of the failed code, are visible only in Node v0.11 and above. This
is due to the new [displayErrors option](http://nodejs.org/dist/v0.11.11/docs/api/vm.html#vm_script_runinthiscontext_options) of the
`vm` module, which is not available on older versions.

A pull-request is welcome for a way to run katas securely and
have stack-traces on earlier versions of Node.


License
-------

MIT
