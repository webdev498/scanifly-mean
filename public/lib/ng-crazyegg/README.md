# Angular CrazyEgg Module

A simple wrapper to pull in the CrazyEgg snippet with an AngularJS-based application. This structure is based on [ng-optimizely](https://github.com/jacopotarantino/ng-optimizely)

This module provides only a simple API to download the CrazyEgg snippet onto the page. The `loadProject` method(usage described below) returns a promise so you can delay execution until after the snippet has loaded.

## Install

```bash
$ bower install --save ng-crazyegg
```

Then require ng-crazyegg in your application:

```javascript
var app = angular.module('app', ['ng-crazyegg']);
```

## Run

In your app's run block execute the `initCrazyEgg` method:

```javascript
angular.module('app')
.run(['crazyegg', function(crazyegg) {
  crazyegg.initCrazyEgg('12345678');
}]);
```

## Test

I can say TODO ... but I won't do them .... sooooo :)

## License

The MIT License (MIT)

Copyright (c) 2014 Jacopo Tarantino

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
