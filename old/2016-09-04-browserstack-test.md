+++
date = "2016-09-04"
tags =  ["pc"]
title = "browserstack-test"
slug = "browserstack-test"
+++

ブラウザのテストをするには、[BrowserStack](https://www.browserstack.com)が便利です。と言ってもここまでのものを使うことはあまりないと思いますが、それでもテストが楽になります。通常、テストは`CircleCI`, `Wercker`などで行うと思います。

https://www.browserstack.com/javascript-testing-api


```bash
$ npm -g install browserstack-runner
$ browserstack-runner init
$ cat browserstack.json
$ browserstack-runner
```

```js
var browserstackRunner = require('browserstack-runner');

var config = require('./browserstack.json');

browserstackRunner.run(config, function(error, report) {
  if(error) {
    console.log("Error:" + error);
    return;
  }
  console.log(JSON.stringify(report, null, 2));
  console.log("Test Finished");
});
```
