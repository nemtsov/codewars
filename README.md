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


Regarding stack-traces
----------------------

Stack-traces, or at least the line number and the character
of the failed code, are visible only in Node v0.11 and above. This
is due to the new [displayErrors option](http://nodejs.org/dist/v0.11.11/docs/api/vm.html#vm_script_runinthiscontext_options) of the
`vm` module, which is not available on v0.10 and below.

A pull-request is welcome for a way to run katas securely and
have stack-traces on earlier versions of Node.


License
-------

MIT
