/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 873
(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(325);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ },

/***/ 552
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(873),
    getRawTag = __webpack_require__(659),
    objectToString = __webpack_require__(969);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ },

/***/ 128
(module, __unused_webpack_exports, __webpack_require__) {

var trimmedEndIndex = __webpack_require__(800);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ },

/***/ 840
(module, __unused_webpack_exports, __webpack_require__) {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ },

/***/ 659
(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(873);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ },

/***/ 969
(module) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ },

/***/ 325
(module, __unused_webpack_exports, __webpack_require__) {

var freeGlobal = __webpack_require__(840);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ },

/***/ 800
(module) {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ },

/***/ 221
(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(805),
    now = __webpack_require__(124),
    toNumber = __webpack_require__(374);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ },

/***/ 805
(module) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ },

/***/ 346
(module) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ },

/***/ 394
(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(552),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ },

/***/ 124
(module, __unused_webpack_exports, __webpack_require__) {

var root = __webpack_require__(325);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ },

/***/ 350
(module, __unused_webpack_exports, __webpack_require__) {

var debounce = __webpack_require__(221),
    isObject = __webpack_require__(805);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ },

/***/ 374
(module, __unused_webpack_exports, __webpack_require__) {

var baseTrim = __webpack_require__(128),
    isObject = __webpack_require__(805),
    isSymbol = __webpack_require__(394);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ },

/***/ 57
(module, __unused_webpack_exports, __webpack_require__) {

var wildcard = __webpack_require__(163);
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};


/***/ },

/***/ 835
(module) {

/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}


/***/ },

/***/ 163
(module) {

"use strict";
/* jshint node: true */


/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};


/***/ },

/***/ 942
(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else // removed by dead control flow
{}
}());


/***/ },

/***/ 837
(module) {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw new $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ },

/***/ 400
(module) {

"use strict";

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ },

/***/ 117
(module) {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ },

/***/ 269
(module) {

"use strict";

module.exports = Object.create ? Object.create(null) : {};


/***/ },

/***/ 741
(module) {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ },

/***/ 717
(__unused_webpack_module, exports) {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ },

/***/ 823
(module) {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/concatenation wrap */
/******/ 	// wrap a concatenated module body as a lazy, memoized accessor; mod is
/******/ 	// set before the body runs so re-entrant calls (require cycles) observe
/******/ 	// the partial exports like Node.js
/******/ 	__webpack_require__.cw = (body) => {
/******/ 		var mod;
/******/ 		return () => {
/******/ 			if (body) {
/******/ 				var fn = body;
/******/ 				body = 0;
/******/ 				mod = { exports: {} };
/******/ 				fn.call(mod.exports, mod, mod.exports);
/******/ 			}
/******/ 			return mod.exports;
/******/ 		};
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		const getProto = Object.getPrototypeOf;
/******/ 		let leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			const ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			const def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// MODULE: ./node_modules/@transloadit/prettier-bytes/dist/prettierBytes.js
var prettierBytes_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

module.exports = function prettierBytes(input) {
    if (typeof input !== 'number' || Number.isNaN(input)) {
        throw new TypeError(`Expected a number, got ${typeof input}`);
    }
    const neg = input < 0;
    let num = Math.abs(input);
    if (neg) {
        num = -num;
    }
    if (num === 0) {
        return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
    const value = Number(num / 1024 ** exponent);
    const unit = units[exponent];
    return `${value >= 10 || value % 1 === 0 ? Math.round(value) : value.toFixed(1)} ${unit}`;
};
//# sourceMappingURL=prettierBytes.js.map
});

// MODULE: ./node_modules/eventemitter3/index.js
var eventemitter3_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}

});

// MODULE: ./node_modules/core-js/internals/a-callable.js
var a_callable_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isCallable = is_callable_namespaceFn();
var tryToString = try_to_string_namespaceFn();

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};

});

// MODULE: ./node_modules/core-js/internals/a-possible-prototype.js
var a_possible_prototype_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isPossiblePrototype = is_possible_prototype_namespaceFn();

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};

});

// MODULE: ./node_modules/core-js/internals/add-to-unscopables.js
var add_to_unscopables_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var wellKnownSymbol = well_known_symbol_namespaceFn();
var create = object_create_namespaceFn();
var defineProperty = (object_define_property_namespaceFn().f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

});

// MODULE: ./node_modules/core-js/internals/advance-string-index.js
var advance_string_index_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var charAt = (string_multibyte_namespaceFn().o);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length || 1 : 1);
};

});

// MODULE: ./node_modules/core-js/internals/an-instance.js
var an_instance_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isPrototypeOf = object_is_prototype_of_namespaceFn();

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};

});

// MODULE: ./node_modules/core-js/internals/an-object.js
var an_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isObject = is_object_namespaceFn();

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};

});

// MODULE: ./node_modules/core-js/internals/array-for-each.js
var array_for_each_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $forEach = (array_iteration_namespaceFn().jJ);
var arrayMethodIsStrict = array_method_is_strict_namespaceFn();

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

});

// MODULE: ./node_modules/core-js/internals/array-from.js
var array_from_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var bind = function_bind_context_namespaceFn();
var call = function_call_namespaceFn();
var toObject = to_object_namespaceFn();
var callWithSafeIterationClosing = call_with_safe_iteration_closing_namespaceFn();
var isArrayIteratorMethod = is_array_iterator_method_namespaceFn();
var isConstructor = is_constructor_namespaceFn();
var lengthOfArrayLike = length_of_array_like_namespaceFn();
var createProperty = create_property_namespaceFn();
var setArrayLength = array_set_length_namespaceFn();
var getIterator = get_iterator_internal_namespaceFn();
var getIteratorMethod = get_iterator_method_internal_namespaceFn();
var iteratorClose = iterator_close_namespaceFn();
var doesNotExceedSafeInteger = does_not_exceed_safe_integer_namespaceFn();

var $Array = Array;

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var IS_CONSTRUCTOR = isConstructor(this);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
  var O = toObject(arrayLike);
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
    result = IS_CONSTRUCTOR ? new this() : [];
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    for (;!(step = call(next, iterator)).done; index++) {
      try {
        doesNotExceedSafeInteger(index);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      try {
        createProperty(result, index, value);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
    }
  } else {
    length = lengthOfArrayLike(O);
    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  setArrayLength(result, index);
  return result;
};

});

// MODULE: ./node_modules/core-js/internals/array-includes.js
var array_includes_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var toIndexedObject = to_indexed_object_namespaceFn();
var toAbsoluteIndex = to_absolute_index_namespaceFn();
var lengthOfArrayLike = length_of_array_like_namespaceFn();

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  m: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  q: createMethod(false)
};

});

// MODULE: ./node_modules/core-js/internals/array-iteration.js
var array_iteration_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var bind = function_bind_context_namespaceFn();
var IndexedObject = indexed_object_namespaceFn();
var toObject = to_object_namespaceFn();
var lengthOfArrayLike = length_of_array_like_namespaceFn();
var arraySpeciesCreate = array_species_create_namespaceFn();
var createProperty = create_property_namespaceFn();

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE === 1;
  var IS_FILTER = TYPE === 2;
  var IS_SOME = TYPE === 3;
  var IS_EVERY = TYPE === 4;
  var IS_FIND_INDEX = TYPE === 6;
  var IS_FILTER_REJECT = TYPE === 7;
  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(self);
    var boundFunction = bind(callbackfn, that);
    var index = 0;
    var resIndex = 0;
    var target = IS_MAP ? arraySpeciesCreate($this, length) : IS_FILTER || IS_FILTER_REJECT ? arraySpeciesCreate($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) createProperty(target, index, result);    // map
        else if (result) switch (TYPE) {
          case 3: return true;                                // some
          case 5: return value;                               // find
          case 6: return index;                               // findIndex
          case 2: createProperty(target, resIndex++, value);  // filter
        } else switch (TYPE) {
          case 4: return false;                               // every
          case 7: createProperty(target, resIndex++, value);  // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  jJ: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  ...void (createMethod(1)),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  pb: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  ...void (createMethod(3)),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  ...void (createMethod(4)),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  ...void (createMethod(5)),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  ...void (createMethod(6)),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  ...void (createMethod(7))
};

});

// MODULE: ./node_modules/core-js/internals/array-method-has-species-support.js
var array_method_has_species_support_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var V8_VERSION = environment_v8_version_namespaceFn();

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

});

// MODULE: ./node_modules/core-js/internals/array-method-is-strict.js
var array_method_is_strict_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

});

// MODULE: ./node_modules/core-js/internals/array-set-length.js
var array_set_length_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var isArray = is_array_namespaceFn();

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};

});

// MODULE: ./node_modules/core-js/internals/array-slice.js
var array_slice_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();

module.exports = uncurryThis([].slice);

});

// MODULE: ./node_modules/core-js/internals/array-sort.js
var array_sort_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var arraySlice = array_slice_namespaceFn();

var floor = Math.floor;

var sort = function (array, comparefn) {
  var length = array.length;

  if (length < 8) {
    // insertion sort
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    }
  } else {
    // merge sort
    var middle = floor(length / 2);
    var left = sort(arraySlice(array, 0, middle), comparefn);
    var right = sort(arraySlice(array, middle), comparefn);
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;

    while (lindex < llength || rindex < rlength) {
      array[lindex + rindex] = (lindex < llength && rindex < rlength)
        ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
        : lindex < llength ? left[lindex++] : right[rindex++];
    }
  }

  return array;
};

module.exports = sort;

});

// MODULE: ./node_modules/core-js/internals/array-species-constructor.js
var array_species_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isArray = is_array_namespaceFn();
var isConstructor = is_constructor_namespaceFn();
var isObject = is_object_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};

});

// MODULE: ./node_modules/core-js/internals/array-species-create.js
var array_species_create_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var arraySpeciesConstructor = array_species_constructor_namespaceFn();

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

});

// MODULE: ./node_modules/core-js/internals/call-with-safe-iteration-closing.js
var call_with_safe_iteration_closing_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var anObject = an_object_namespaceFn();
var iteratorClose = iterator_close_namespaceFn();

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

});

// MODULE: ./node_modules/core-js/internals/check-correctness-of-iteration.js
var check_correctness_of_iteration_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var wellKnownSymbol = well_known_symbol_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

});

// MODULE: ./node_modules/core-js/internals/classof-raw.js
var classof_raw_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

});

// MODULE: ./node_modules/core-js/internals/classof.js
var classof_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var TO_STRING_TAG_SUPPORT = to_string_tag_support_namespaceFn();
var isCallable = is_callable_namespaceFn();
var classofRaw = classof_raw_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

});

// MODULE: ./node_modules/core-js/internals/copy-constructor-properties.js
var copy_constructor_properties_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var hasOwn = has_own_property_namespaceFn();
var ownKeys = own_keys_namespaceFn();
var getOwnPropertyDescriptorModule = object_get_own_property_descriptor_namespaceFn();
var definePropertyModule = object_define_property_namespaceFn();

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

});

// MODULE: ./node_modules/core-js/internals/correct-prototype-getter.js
var correct_prototype_getter_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

});

// MODULE: ./node_modules/core-js/internals/create-iter-result-object.js
var create_iter_result_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};

});

// MODULE: ./node_modules/core-js/internals/create-non-enumerable-property.js
var create_non_enumerable_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var definePropertyModule = object_define_property_namespaceFn();
var createPropertyDescriptor = create_property_descriptor_namespaceFn();

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

});

// MODULE: ./node_modules/core-js/internals/create-property-descriptor.js
var create_property_descriptor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

});

// MODULE: ./node_modules/core-js/internals/create-property.js
var create_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var definePropertyModule = object_define_property_namespaceFn();
var createPropertyDescriptor = create_property_descriptor_namespaceFn();

module.exports = function (object, key, value) {
  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};

});

// MODULE: ./node_modules/core-js/internals/date-to-primitive.js
var date_to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var anObject = an_object_namespaceFn();
var ordinaryToPrimitive = ordinary_to_primitive_namespaceFn();

var $TypeError = TypeError;

// `Date.prototype[@@toPrimitive](hint)` method implementation
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
module.exports = function (hint) {
  anObject(this);
  if (hint === 'string' || hint === 'default') hint = 'string';
  else if (hint !== 'number') throw new $TypeError('Incorrect hint');
  return ordinaryToPrimitive(this, hint);
};

});

// MODULE: ./node_modules/core-js/internals/define-built-in-accessor.js
var define_built_in_accessor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var makeBuiltIn = make_built_in_namespaceFn();
var defineProperty = object_define_property_namespaceFn();

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};

});

// MODULE: ./node_modules/core-js/internals/define-built-in.js
var define_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isCallable = is_callable_namespaceFn();
var definePropertyModule = object_define_property_namespaceFn();
var makeBuiltIn = make_built_in_namespaceFn();
var defineGlobalProperty = define_global_property_namespaceFn();

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};

});

// MODULE: ./node_modules/core-js/internals/define-built-ins.js
var define_built_ins_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var defineBuiltIn = define_built_in_namespaceFn();

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};

});

// MODULE: ./node_modules/core-js/internals/define-global-property.js
var define_global_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};

});

// MODULE: ./node_modules/core-js/internals/descriptors.js
var descriptors_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});

});

// MODULE: ./node_modules/core-js/internals/document-create-element.js
var document_create_element_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var isObject = is_object_namespaceFn();

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/does-not-exceed-safe-integer.js
var does_not_exceed_safe_integer_namespaceFn = () => {
	return __webpack_require__(837);
};

// EXTERNAL MODULE: ./node_modules/core-js/internals/dom-iterables.js
var dom_iterables_namespaceFn = () => {
	return __webpack_require__(400);
};

// MODULE: ./node_modules/core-js/internals/dom-token-list-prototype.js
var dom_token_list_prototype_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = document_create_element_namespaceFn();

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

});

// MODULE: ./node_modules/core-js/internals/enum-bug-keys.js
var enum_bug_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

});

// MODULE: ./node_modules/core-js/internals/environment-user-agent.js
var environment_user_agent_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';

});

// MODULE: ./node_modules/core-js/internals/environment-v8-version.js
var environment_v8_version_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var userAgent = environment_user_agent_namespaceFn();

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;

});

// MODULE: ./node_modules/core-js/internals/export.js
var export_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var getOwnPropertyDescriptor = (object_get_own_property_descriptor_namespaceFn().f);
var createNonEnumerableProperty = create_non_enumerable_property_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var defineGlobalProperty = define_global_property_namespaceFn();
var copyConstructorProperties = copy_constructor_properties_namespaceFn();
var isForced = is_forced_namespaceFn();

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};

});

// MODULE: ./node_modules/core-js/internals/fails.js
var fails_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

});

// MODULE: ./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js
var fix_regexp_well_known_symbol_logic_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: Remove from `core-js@4` since it's moved to entry points
es_regexp_exec_namespaceFn();
var call = function_call_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var regexpExec = regexp_exec_namespaceFn();
var fails = fails_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var createNonEnumerableProperty = create_non_enumerable_property_namespaceFn();

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegExp methods
    var O = {};
    // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) !== 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      var constructor = {};
      // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
      constructor[SPECIES] = function () { return re; };
      re = { constructor: constructor, flags: '' };
      // eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () {
      execCalled = true;
      return null;
    };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: call(nativeRegExpMethod, regexp, str, arg2) };
        }
        return { done: true, value: call(nativeMethod, str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

});

// MODULE: ./node_modules/core-js/internals/function-bind-context.js
var function_bind_context_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_clause_namespaceFn();
var aCallable = a_callable_namespaceFn();
var NATIVE_BIND = function_bind_native_namespaceFn();

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

});

// MODULE: ./node_modules/core-js/internals/function-bind-native.js
var function_bind_native_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = function () { /* empty */ }.bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

});

// MODULE: ./node_modules/core-js/internals/function-call.js
var function_call_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var NATIVE_BIND = function_bind_native_namespaceFn();

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

});

// MODULE: ./node_modules/core-js/internals/function-name.js
var function_name_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var hasOwn = has_own_property_namespaceFn();

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && function something() { /* empty */ }.name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

});

// MODULE: ./node_modules/core-js/internals/function-uncurry-this-accessor.js
var function_uncurry_this_accessor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var aCallable = a_callable_namespaceFn();

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};

});

// MODULE: ./node_modules/core-js/internals/function-uncurry-this-clause.js
var function_uncurry_this_clause_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var classofRaw = classof_raw_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};

});

// MODULE: ./node_modules/core-js/internals/function-uncurry-this.js
var function_uncurry_this_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var NATIVE_BIND = function_bind_native_namespaceFn();

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};

});

// MODULE: ./node_modules/core-js/internals/get-built-in-prototype-method.js
var get_built_in_prototype_method_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();

module.exports = function (CONSTRUCTOR, METHOD) {
  var Constructor = globalThis[CONSTRUCTOR];
  var Prototype = Constructor && Constructor.prototype;
  return Prototype && Prototype[METHOD];
};

});

// MODULE: ./node_modules/core-js/internals/get-built-in.js
var get_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var isCallable = is_callable_namespaceFn();

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};

});

// MODULE: ./node_modules/core-js/internals/get-iterator-internal.js
var get_iterator_internal_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var isCallable = is_callable_namespaceFn();
var anObject = an_object_namespaceFn();
var tryToString = try_to_string_namespaceFn();
var getIteratorMethod = get_iterator_method_internal_namespaceFn();

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (isCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};

});

// MODULE: ./node_modules/core-js/internals/get-iterator-method-internal.js
var get_iterator_method_internal_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var classof = classof_raw_namespaceFn();
var isNullOrUndefined = is_null_or_undefined_namespaceFn();
var getMethod = get_method_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || (classof(it) === 'Arguments' ? ArrayPrototype[ITERATOR] : undefined);
};

});

// MODULE: ./node_modules/core-js/internals/get-method.js
var get_method_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var aCallable = a_callable_namespaceFn();
var isNullOrUndefined = is_null_or_undefined_namespaceFn();

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};

});

// MODULE: ./node_modules/core-js/internals/global-this.js
var global_this_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

});

// MODULE: ./node_modules/core-js/internals/has-own-property.js
var has_own_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var toObject = to_object_namespaceFn();

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

});

// MODULE: ./node_modules/core-js/internals/hidden-keys.js
var hidden_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

module.exports = {};

});

// MODULE: ./node_modules/core-js/internals/html.js
var html_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var getBuiltIn = get_built_in_namespaceFn();

module.exports = getBuiltIn('document', 'documentElement');

});

// MODULE: ./node_modules/core-js/internals/ie8-dom-define.js
var ie8_dom_define_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var fails = fails_namespaceFn();
var createElement = document_create_element_namespaceFn();

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});

});

// MODULE: ./node_modules/core-js/internals/indexed-object.js
var indexed_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var fails = fails_namespaceFn();
var classof = classof_raw_namespaceFn();

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;

});

// MODULE: ./node_modules/core-js/internals/inherit-if-required.js
var inherit_if_required_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isCallable = is_callable_namespaceFn();
var isObject = is_object_namespaceFn();
var setPrototypeOf = object_set_prototype_of_namespaceFn();

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};

});

// MODULE: ./node_modules/core-js/internals/inspect-source.js
var inspect_source_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var isCallable = is_callable_namespaceFn();
var store = shared_store_namespaceFn();

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;

});

// MODULE: ./node_modules/core-js/internals/internal-state.js
var internal_state_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var NATIVE_WEAK_MAP = weak_map_basic_detection_namespaceFn();
var globalThis = global_this_namespaceFn();
var isObject = is_object_namespaceFn();
var createNonEnumerableProperty = create_non_enumerable_property_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var shared = shared_store_namespaceFn();
var sharedKey = shared_key_namespaceFn();
var hiddenKeys = hidden_keys_namespaceFn();

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

});

// MODULE: ./node_modules/core-js/internals/is-array-iterator-method.js
var is_array_iterator_method_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var wellKnownSymbol = well_known_symbol_namespaceFn();
var Iterators = iterators_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

});

// MODULE: ./node_modules/core-js/internals/is-array.js
var is_array_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var classof = classof_raw_namespaceFn();

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};

});

// MODULE: ./node_modules/core-js/internals/is-callable.js
var is_callable_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};

});

// MODULE: ./node_modules/core-js/internals/is-constructor.js
var is_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var fails = fails_namespaceFn();
var isCallable = is_callable_namespaceFn();
var classof = classof_namespaceFn();
var getBuiltIn = get_built_in_namespaceFn();
var inspectSource = inspect_source_namespaceFn();

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

});

// MODULE: ./node_modules/core-js/internals/is-forced.js
var is_forced_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var isCallable = is_callable_namespaceFn();

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/is-null-or-undefined.js
var is_null_or_undefined_namespaceFn = () => {
	return __webpack_require__(117);
};

// MODULE: ./node_modules/core-js/internals/is-object.js
var is_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isCallable = is_callable_namespaceFn();

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

});

// MODULE: ./node_modules/core-js/internals/is-possible-prototype.js
var is_possible_prototype_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isObject = is_object_namespaceFn();

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};

});

// MODULE: ./node_modules/core-js/internals/is-pure.js
var is_pure_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

module.exports = false;

});

// MODULE: ./node_modules/core-js/internals/is-raw-json.js
var is_raw_json_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isObject = is_object_namespaceFn();
var getInternalState = (internal_state_namespaceFn().get);

module.exports = function isRawJSON(O) {
  if (!isObject(O)) return false;
  var state = getInternalState(O);
  return !!state && state.type === 'RawJSON';
};

});

// MODULE: ./node_modules/core-js/internals/is-symbol.js
var is_symbol_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var getBuiltIn = get_built_in_namespaceFn();
var isCallable = is_callable_namespaceFn();
var isPrototypeOf = object_is_prototype_of_namespaceFn();
var USE_SYMBOL_AS_UID = use_symbol_as_uid_namespaceFn();

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};

});

// MODULE: ./node_modules/core-js/internals/iterator-close.js
var iterator_close_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var anObject = an_object_namespaceFn();
var getMethod = get_method_namespaceFn();

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

});

// MODULE: ./node_modules/core-js/internals/iterator-create-constructor.js
var iterator_create_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var IteratorPrototype = (iterators_core_namespaceFn().IteratorPrototype);
var create = object_create_namespaceFn();
var createPropertyDescriptor = create_property_descriptor_namespaceFn();
var setToStringTag = set_to_string_tag_namespaceFn();
var Iterators = iterators_namespaceFn();

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

});

// MODULE: ./node_modules/core-js/internals/iterator-define.js
var iterator_define_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var call = function_call_namespaceFn();
var IS_PURE = is_pure_namespaceFn();
var FunctionName = function_name_namespaceFn();
var isCallable = is_callable_namespaceFn();
var createIteratorConstructor = iterator_create_constructor_namespaceFn();
var getPrototypeOf = object_get_prototype_of_namespaceFn();
var setPrototypeOf = object_set_prototype_of_namespaceFn();
var setToStringTag = set_to_string_tag_namespaceFn();
var createNonEnumerableProperty = create_non_enumerable_property_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var Iterators = iterators_namespaceFn();
var IteratorsCore = iterators_core_namespaceFn();

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    }

    return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};

});

// MODULE: ./node_modules/core-js/internals/iterators-core.js
var iterators_core_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var isCallable = is_callable_namespaceFn();
var isObject = is_object_namespaceFn();
var create = object_create_namespaceFn();
var getPrototypeOf = object_get_prototype_of_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var IS_PURE = is_pure_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/iterators.js
var iterators_namespaceFn = () => {
	return __webpack_require__(269);
};

// MODULE: ./node_modules/core-js/internals/length-of-array-like.js
var length_of_array_like_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var toLength = to_length_namespaceFn();

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

});

// MODULE: ./node_modules/core-js/internals/make-built-in.js
var make_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var fails = fails_namespaceFn();
var isCallable = is_callable_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var CONFIGURABLE_FUNCTION_NAME = (function_name_namespaceFn().CONFIGURABLE);
var inspectSource = inspect_source_namespaceFn();
var InternalStateModule = internal_state_namespaceFn();

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/math-trunc.js
var math_trunc_namespaceFn = () => {
	return __webpack_require__(741);
};

// MODULE: ./node_modules/core-js/internals/native-raw-json.js
var native_raw_json_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* eslint-disable es/no-json -- safe */
var fails = fails_namespaceFn();

module.exports = !fails(function () {
  var unsafeInt = '9007199254740993';
  // eslint-disable-next-line es/no-json-rawjson -- feature detection
  var raw = JSON.rawJSON(unsafeInt);
  // eslint-disable-next-line es/no-json-israwjson -- feature detection
  return !JSON.isRawJSON(raw) || JSON.stringify(raw) !== unsafeInt;
});

});

// MODULE: ./node_modules/core-js/internals/object-assign.js
var object_assign_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var call = function_call_namespaceFn();
var fails = fails_namespaceFn();
var objectKeys = object_keys_namespaceFn();
var getOwnPropertySymbolsModule = object_get_own_property_symbols_namespaceObject();
var propertyIsEnumerableModule = object_property_is_enumerable_namespaceFn();
var toObject = to_object_namespaceFn();
var IndexedObject = indexed_object_namespaceFn();

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol('assign detection');
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

});

// MODULE: ./node_modules/core-js/internals/object-create.js
var object_create_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* global ActiveXObject -- old IE, WSH */
var anObject = an_object_namespaceFn();
var definePropertiesModule = object_define_properties_namespaceFn();
var enumBugKeys = enum_bug_keys_namespaceFn();
var hiddenKeys = hidden_keys_namespaceFn();
var html = html_namespaceFn();
var documentCreateElement = document_create_element_namespaceFn();
var sharedKey = shared_key_namespaceFn();

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

});

// MODULE: ./node_modules/core-js/internals/object-define-properties.js
var object_define_properties_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var V8_PROTOTYPE_DEFINE_BUG = v8_prototype_define_bug_namespaceFn();
var definePropertyModule = object_define_property_namespaceFn();
var anObject = an_object_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var objectKeys = object_keys_namespaceFn();

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

});

// MODULE: ./node_modules/core-js/internals/object-define-property.js
var object_define_property_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var IE8_DOM_DEFINE = ie8_dom_define_namespaceFn();
var V8_PROTOTYPE_DEFINE_BUG = v8_prototype_define_bug_namespaceFn();
var anObject = an_object_namespaceFn();
var toPropertyKey = to_property_key_namespaceFn();

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

});

// MODULE: ./node_modules/core-js/internals/object-get-own-property-descriptor.js
var object_get_own_property_descriptor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var call = function_call_namespaceFn();
var propertyIsEnumerableModule = object_property_is_enumerable_namespaceFn();
var createPropertyDescriptor = create_property_descriptor_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var toPropertyKey = to_property_key_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var IE8_DOM_DEFINE = ie8_dom_define_namespaceFn();

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

});

// MODULE: ./node_modules/core-js/internals/object-get-own-property-names-external.js
var object_get_own_property_names_external_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = classof_raw_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var $getOwnPropertyNames = (object_get_own_property_names_namespaceFn().f);
var arraySlice = array_slice_namespaceFn();

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) === 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

});

// MODULE: ./node_modules/core-js/internals/object-get-own-property-names.js
var object_get_own_property_names_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var internalObjectKeys = object_keys_internal_namespaceFn();
var enumBugKeys = enum_bug_keys_namespaceFn();

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/object-get-own-property-symbols.js
var object_get_own_property_symbols_namespaceFn = () => {
	return __webpack_require__(717);
};

// MODULE: ./node_modules/core-js/internals/object-get-prototype-of.js
var object_get_prototype_of_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var hasOwn = has_own_property_namespaceFn();
var isCallable = is_callable_namespaceFn();
var toObject = to_object_namespaceFn();
var sharedKey = shared_key_namespaceFn();
var CORRECT_PROTOTYPE_GETTER = correct_prototype_getter_namespaceFn();

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};

});

// MODULE: ./node_modules/core-js/internals/object-is-prototype-of.js
var object_is_prototype_of_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();

module.exports = uncurryThis({}.isPrototypeOf);

});

// MODULE: ./node_modules/core-js/internals/object-keys-internal.js
var object_keys_internal_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var indexOf = (array_includes_namespaceFn().q);
var hiddenKeys = hidden_keys_namespaceFn();

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

});

// MODULE: ./node_modules/core-js/internals/object-keys.js
var object_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var internalObjectKeys = object_keys_internal_namespaceFn();
var enumBugKeys = enum_bug_keys_namespaceFn();

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

});

// MODULE: ./node_modules/core-js/internals/object-property-is-enumerable.js
var object_property_is_enumerable_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

});

// MODULE: ./node_modules/core-js/internals/object-set-prototype-of.js
var object_set_prototype_of_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = function_uncurry_this_accessor_namespaceFn();
var isObject = is_object_namespaceFn();
var requireObjectCoercible = require_object_coercible_namespaceFn();
var aPossiblePrototype = a_possible_prototype_namespaceFn();

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

});

// MODULE: ./node_modules/core-js/internals/object-to-string.js
var object_to_string_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var TO_STRING_TAG_SUPPORT = to_string_tag_support_namespaceFn();
var classof = classof_namespaceFn();

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

});

// MODULE: ./node_modules/core-js/internals/ordinary-to-primitive.js
var ordinary_to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var isCallable = is_callable_namespaceFn();
var isObject = is_object_namespaceFn();

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};

});

// MODULE: ./node_modules/core-js/internals/own-keys.js
var own_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var getBuiltIn = get_built_in_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var getOwnPropertyNamesModule = object_get_own_property_names_namespaceFn();
var getOwnPropertySymbolsModule = object_get_own_property_symbols_namespaceObject();
var anObject = an_object_namespaceFn();

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

});

// MODULE: ./node_modules/core-js/internals/parse-json-string.js
var parse_json_string_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var hasOwn = has_own_property_namespaceFn();

var $SyntaxError = SyntaxError;
var $parseInt = parseInt;
var fromCharCode = String.fromCharCode;
var at = uncurryThis(''.charAt);
var slice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);

var codePoints = {
  '\\"': '"',
  '\\\\': '\\',
  '\\/': '/',
  '\\b': '\b',
  '\\f': '\f',
  '\\n': '\n',
  '\\r': '\r',
  '\\t': '\t'
};

var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
// eslint-disable-next-line regexp/no-control-character -- safe
var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;

module.exports = function (source, i) {
  var unterminated = true;
  var value = '';
  while (i < source.length) {
    var chr = at(source, i);
    if (chr === '\\') {
      var twoChars = slice(source, i, i + 2);
      if (hasOwn(codePoints, twoChars)) {
        value += codePoints[twoChars];
        i += 2;
      } else if (twoChars === '\\u') {
        i += 2;
        var fourHexDigits = slice(source, i, i + 4);
        if (!exec(IS_4_HEX_DIGITS, fourHexDigits)) throw new $SyntaxError('Bad Unicode escape at: ' + i);
        value += fromCharCode($parseInt(fourHexDigits, 16));
        i += 4;
      } else throw new $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
    } else if (chr === '"') {
      unterminated = false;
      i++;
      break;
    } else {
      if (exec(IS_C0_CONTROL_CODE, chr)) throw new $SyntaxError('Bad control character in string literal at: ' + i);
      value += chr;
      i++;
    }
  }
  if (unterminated) throw new $SyntaxError('Unterminated string at: ' + i);
  return { value: value, end: i };
};

});

// MODULE: ./node_modules/core-js/internals/path.js
var path_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();

module.exports = globalThis;

});

// MODULE: ./node_modules/core-js/internals/regexp-exec-abstract.js
var regexp_exec_abstract_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var anObject = an_object_namespaceFn();
var isCallable = is_callable_namespaceFn();
var classof = classof_raw_namespaceFn();
var regexpExec = regexp_exec_namespaceFn();

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw new $TypeError('RegExp#exec called on incompatible receiver');
};

});

// MODULE: ./node_modules/core-js/internals/regexp-exec.js
var regexp_exec_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = function_call_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var toString = to_string_namespaceFn();
var regexpFlags = regexp_flags_namespaceFn();
var stickyHelpers = regexp_sticky_helpers_namespaceFn();
var shared = shared_namespaceFn();
var create = object_create_namespaceFn();
var getInternalState = (internal_state_namespaceFn().get);
var UNSUPPORTED_DOT_ALL = regexp_unsupported_dot_all_namespaceFn();
var UNSUPPORTED_NCG = regexp_unsupported_ncg_namespaceFn();

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

var setGroups = function (re, groups) {
  var object = re.groups = create(null);
  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];
    object[group[0]] = re[group[1]];
  }
};

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;

      if (result && state.groups) setGroups(result, state.groups);

      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      var prevChar = re.lastIndex > 0 && charAt(str, re.lastIndex - 1);
      if (re.lastIndex > 0 &&
        (!re.multiline || re.multiline && prevChar !== '\n' && prevChar !== '\r' && prevChar !== '\u2028' && prevChar !== '\u2029')) {
        source = '(?: (?:' + source + '))';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    var match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = str;
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (var i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) setGroups(match, groups);

    return match;
  };
}

module.exports = patchedExec;

});

// MODULE: ./node_modules/core-js/internals/regexp-flags-detection.js
var regexp_flags_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var fails = fails_namespaceFn();

// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
var RegExp = globalThis.RegExp;

var FLAGS_GETTER_IS_CORRECT = !fails(function () {
  var INDICES_SUPPORT = true;
  try {
    RegExp('.', 'd');
  } catch (error) {
    INDICES_SUPPORT = false;
  }

  var O = {};
  // modern V8 bug
  var calls = '';
  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

  var addGetter = function (key, chr) {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(O, key, { get: function () {
      calls += chr;
      return true;
    } });
  };

  var pairs = {
    dotAll: 's',
    global: 'g',
    ignoreCase: 'i',
    multiline: 'm',
    sticky: 'y'
  };

  if (INDICES_SUPPORT) pairs.hasIndices = 'd';

  for (var key in pairs) addGetter(key, pairs[key]);

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var result = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call(O);

  return result !== expected || calls !== expected;
});

module.exports = { correct: FLAGS_GETTER_IS_CORRECT };

});

// MODULE: ./node_modules/core-js/internals/regexp-flags.js
var regexp_flags_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var anObject = an_object_namespaceFn();

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.unicodeSets) result += 'v';
  if (that.sticky) result += 'y';
  return result;
};

});

// MODULE: ./node_modules/core-js/internals/regexp-get-flags.js
var regexp_get_flags_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var isPrototypeOf = object_is_prototype_of_namespaceFn();
var regExpFlagsDetection = regexp_flags_detection_namespaceFn();
var regExpFlagsGetterImplementation = regexp_flags_namespaceFn();

var RegExpPrototype = RegExp.prototype;

module.exports = regExpFlagsDetection.correct ? function (it) {
  return it.flags;
} : function (it) {
  return (!regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, 'flags'))
    ? call(regExpFlagsGetterImplementation, it)
    : it.flags;
};

});

// MODULE: ./node_modules/core-js/internals/regexp-sticky-helpers.js
var regexp_sticky_helpers_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var globalThis = global_this_namespaceFn();

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = globalThis.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') !== null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') !== null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};

});

// MODULE: ./node_modules/core-js/internals/regexp-unsupported-dot-all.js
var regexp_unsupported_dot_all_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var globalThis = global_this_namespaceFn();

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = globalThis.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.test('\n') && re.flags === 's');
});

});

// MODULE: ./node_modules/core-js/internals/regexp-unsupported-ncg.js
var regexp_unsupported_ncg_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var globalThis = global_this_namespaceFn();

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = globalThis.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

});

// MODULE: ./node_modules/core-js/internals/require-object-coercible.js
var require_object_coercible_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var isNullOrUndefined = is_null_or_undefined_namespaceFn();

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};

});

// MODULE: ./node_modules/core-js/internals/safe-get-built-in.js
var safe_get_built_in_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Avoid NodeJS experimental warning
module.exports = function (name) {
  if (!DESCRIPTORS) return globalThis[name];
  var descriptor = getOwnPropertyDescriptor(globalThis, name);
  return descriptor && descriptor.value;
};

});

// MODULE: ./node_modules/core-js/internals/set-to-string-tag.js
var set_to_string_tag_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var defineProperty = (object_define_property_namespaceFn().f);
var hasOwn = has_own_property_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

});

// MODULE: ./node_modules/core-js/internals/shared-key.js
var shared_key_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var shared = shared_namespaceFn();
var uid = uid_namespaceFn();

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

});

// MODULE: ./node_modules/core-js/internals/shared-store.js
var shared_store_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var IS_PURE = is_pure_namespaceFn();
var globalThis = global_this_namespaceFn();
var defineGlobalProperty = define_global_property_namespaceFn();

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.50.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2013–2025 Denis Pushkarev (zloirock.ru), 2025–2026 CoreJS Company (core-js.io). All rights reserved.',
  license: 'https://github.com/zloirock/core-js/blob/v3.50.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

});

// MODULE: ./node_modules/core-js/internals/shared.js
var shared_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var store = shared_store_namespaceFn();
// eslint-disable-next-line es/no-object-create -- safe
var create = Object.create || Object;

module.exports = function (key, value) {
  return store[key] || (store[key] = value || create(null));
};

});

// MODULE: ./node_modules/core-js/internals/string-multibyte.js
var string_multibyte_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var toIntegerOrInfinity = to_integer_or_infinity_namespaceFn();
var toString = to_string_namespaceFn();
var requireObjectCoercible = require_object_coercible_namespaceFn();

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  L: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  o: createMethod(true)
};

});

// MODULE: ./node_modules/core-js/internals/string-punycode-to-ascii.js
var string_punycode_to_ascii_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var uncurryThis = function_uncurry_this_namespaceFn();

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;

var $RangeError = RangeError;
var exec = uncurryThis(regexSeparators.exec);
var floor = Math.floor;
var fromCharCode = String.fromCharCode;
var charCodeAt = uncurryThis(''.charCodeAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var split = uncurryThis(''.split);
var toLowerCase = uncurryThis(''.toLowerCase);

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = charCodeAt(string, counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = charCodeAt(string, counter++);
      if ((extra & 0xFC00) === 0xDC00) { // Low surrogate.
        push(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        push(output, value);
        counter--;
      }
    } else {
      push(output, value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  while (delta > baseMinusTMin * tMax >> 1) {
    delta = floor(delta / baseMinusTMin);
    k += base;
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      push(output, fromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    push(output, delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      throw new $RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw new $RangeError(OVERFLOW_ERROR);
      }
      if (currentValue === n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        var k = base;
        while (true) {
          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          push(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor(qMinusT / baseMinusT);
          k += base;
        }

        push(output, fromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        handledCPCount++;
      }
    }

    delta++;
    n++;
  }
  return join(output, '');
};

module.exports = function (input) {
  var encoded = [];
  var labels = split(replace(toLowerCase(input), regexSeparators, '\u002E'), '.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    push(encoded, exec(regexNonASCII, label) ? 'xn--' + encode(label) : label);
  }
  return join(encoded, '.');
};

});

// MODULE: ./node_modules/core-js/internals/string-trim.js
var string_trim_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();
var requireObjectCoercible = require_object_coercible_namespaceFn();
var toString = to_string_namespaceFn();
var whitespaces = whitespaces_namespaceFn();

var replace = uncurryThis(''.replace);
var ltrim = RegExp('^[' + whitespaces + ']+');
var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '$1');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  ...void (createMethod(1)),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  ...void (createMethod(2)),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  Bq: createMethod(3)
};

});

// MODULE: ./node_modules/core-js/internals/symbol-constructor-detection.js
var symbol_constructor_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = environment_v8_version_namespaceFn();
var fails = fails_namespaceFn();
var globalThis = global_this_namespaceFn();

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

});

// MODULE: ./node_modules/core-js/internals/symbol-define-to-primitive.js
var symbol_define_to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var getBuiltIn = get_built_in_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();

module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, { arity: 1 });
  }
};

});

// MODULE: ./node_modules/core-js/internals/symbol-registry-detection.js
var symbol_registry_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var NATIVE_SYMBOL = symbol_constructor_detection_namespaceFn();

/* eslint-disable es/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;

});

// MODULE: ./node_modules/core-js/internals/this-number-value.js
var this_number_value_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
module.exports = uncurryThis(1.1.valueOf);

});

// MODULE: ./node_modules/core-js/internals/to-absolute-index.js
var to_absolute_index_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var toIntegerOrInfinity = to_integer_or_infinity_namespaceFn();

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

});

// MODULE: ./node_modules/core-js/internals/to-indexed-object.js
var to_indexed_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = indexed_object_namespaceFn();
var requireObjectCoercible = require_object_coercible_namespaceFn();

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

});

// MODULE: ./node_modules/core-js/internals/to-integer-or-infinity.js
var to_integer_or_infinity_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var trunc = math_trunc_namespaceFn();

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};

});

// MODULE: ./node_modules/core-js/internals/to-length.js
var to_length_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var toIntegerOrInfinity = to_integer_or_infinity_namespaceFn();

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

});

// MODULE: ./node_modules/core-js/internals/to-object.js
var to_object_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var requireObjectCoercible = require_object_coercible_namespaceFn();

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};

});

// MODULE: ./node_modules/core-js/internals/to-primitive.js
var to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var isObject = is_object_namespaceFn();
var isSymbol = is_symbol_namespaceFn();
var getMethod = get_method_namespaceFn();
var ordinaryToPrimitive = ordinary_to_primitive_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

});

// MODULE: ./node_modules/core-js/internals/to-property-key.js
var to_property_key_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var toPrimitive = to_primitive_namespaceFn();
var isSymbol = is_symbol_namespaceFn();

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

});

// MODULE: ./node_modules/core-js/internals/to-string-tag-support.js
var to_string_tag_support_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var wellKnownSymbol = well_known_symbol_namespaceFn();

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};
// eslint-disable-next-line unicorn/no-immediate-mutation -- ES3 syntax limitation
test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';

});

// MODULE: ./node_modules/core-js/internals/to-string.js
var to_string_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var classof = classof_namespaceFn();

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};

});

// EXTERNAL MODULE: ./node_modules/core-js/internals/try-to-string.js
var try_to_string_namespaceFn = () => {
	return __webpack_require__(823);
};

// MODULE: ./node_modules/core-js/internals/uid.js
var uid_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var uncurryThis = function_uncurry_this_namespaceFn();

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.1.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

});

// MODULE: ./node_modules/core-js/internals/url-constructor-detection.js
var url_constructor_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var fails = fails_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var IS_PURE = is_pure_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');

module.exports = !fails(function () {
  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
  var url = new URL('b?a=1&b=2&c=3', 'https://a');
  var params = url.searchParams;
  var params2 = new URLSearchParams('a=1&a=2&b=3');
  var result = '';
  url.pathname = 'c%20d';
  params.forEach(function (value, key) {
    params['delete']('b');
    result += key + value;
  });
  params2['delete']('a', 2);
  // `undefined` case is a Chromium 117 bug
  // https://bugs.chromium.org/p/v8/issues/detail?id=14222
  params2['delete']('b', undefined);
  return (IS_PURE && (!url.toJSON || !params2.has('a', 1) || params2.has('a', 2) || !params2.has('a', undefined) || params2.has('b')))
    || (!params.size && (IS_PURE || !DESCRIPTORS))
    || !params.sort
    || url.href !== 'https://a/c%20d?a=1&c=3'
    || params.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !params[ITERATOR]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('https://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('https://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('https://x', undefined).host !== 'x';
});

});

// MODULE: ./node_modules/core-js/internals/url-percent-coding.js
var url_percent_coding_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
es_string_from_code_point_namespaceFn();
var getBuiltIn = get_built_in_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();

var fromCharCode = String.fromCharCode;
var fromCodePoint = getBuiltIn('String', 'fromCodePoint');
var $encodeURIComponent = encodeURIComponent;
var $parseInt = parseInt;
var charAt = uncurryThis(''.charAt);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var exec = uncurryThis(/./.exec);

var FALLBACK_REPLACER = '\uFFFD';
var VALID_HEX = /^[0-9a-f]+$/i;
// a surrogate pair is matched first, so a one-unit match is always a lone surrogate
var SURROGATE = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g;

var parseHexOctet = function (string, start) {
  var substr = stringSlice(string, start, start + 2);
  if (!exec(VALID_HEX, substr)) return NaN;

  return $parseInt(substr, 16);
};

var getLeadingOnes = function (octet) {
  var count = 0;
  for (var mask = 0x80; mask > 0 && (octet & mask) !== 0; mask >>= 1) {
    count++;
  }
  return count;
};

var utf8Decode = function (octets) {
  var codePoint = null;
  var length = octets.length;

  switch (length) {
    case 1:
      codePoint = octets[0];
      break;
    case 2:
      codePoint = (octets[0] & 0x1F) << 6 | (octets[1] & 0x3F);
      break;
    case 3:
      codePoint = (octets[0] & 0x0F) << 12 | (octets[1] & 0x3F) << 6 | (octets[2] & 0x3F);
      break;
    case 4:
      codePoint = (octets[0] & 0x07) << 18 | (octets[1] & 0x3F) << 12 | (octets[2] & 0x3F) << 6 | (octets[3] & 0x3F);
      break;
  }

  // reject surrogates, overlong encodings, and out-of-range codepoints
  if (codePoint === null
    || codePoint > 0x10FFFF
    || (codePoint >= 0xD800 && codePoint <= 0xDFFF)
    || codePoint < (length > 3 ? 0x10000 : length > 2 ? 0x800 : length > 1 ? 0x80 : 0)
  ) return null;

  return codePoint;
};

var replaceLoneSurrogate = function (chunk) {
  return chunk.length === 2 ? chunk : FALLBACK_REPLACER;
};

// https://url.spec.whatwg.org/#percent-decode
/* eslint-disable max-depth -- ok */
var decode = function (input) {
  var length = input.length;
  var result = '';
  var i = 0;

  while (i < length) {
    var decodedChar = charAt(input, i);

    if (decodedChar === '%') {
      if (charAt(input, i + 1) === '%' || i + 3 > length) {
        result += '%';
        i++;
        continue;
      }

      var octet = parseHexOctet(input, i + 1);

      // eslint-disable-next-line no-self-compare -- NaN check
      if (octet !== octet) {
        result += decodedChar;
        i++;
        continue;
      }

      i += 2;
      var byteSequenceLength = getLeadingOnes(octet);

      if (byteSequenceLength === 0) {
        decodedChar = fromCharCode(octet);
      } else {
        if (byteSequenceLength === 1 || byteSequenceLength > 4) {
          result += FALLBACK_REPLACER;
          i++;
          continue;
        }

        var octets = [octet];
        var sequenceIndex = 1;

        while (sequenceIndex < byteSequenceLength) {
          i++;
          if (i + 3 > length || charAt(input, i) !== '%') break;

          var nextByte = parseHexOctet(input, i + 1);

          // eslint-disable-next-line no-self-compare -- NaN check
          if (nextByte !== nextByte || nextByte > 191 || nextByte < 128) break;

          // https://encoding.spec.whatwg.org/#utf-8-decoder - position-specific byte ranges
          if (sequenceIndex === 1) {
            if (octet === 0xE0 && nextByte < 0xA0) break;
            if (octet === 0xED && nextByte > 0x9F) break;
            if (octet === 0xF0 && nextByte < 0x90) break;
            if (octet === 0xF4 && nextByte > 0x8F) break;
          }

          push(octets, nextByte);
          i += 2;
          sequenceIndex++;
        }

        if (octets.length !== byteSequenceLength) {
          result += FALLBACK_REPLACER;
          continue;
        }

        var codePoint = utf8Decode(octets);
        if (codePoint === null) {
          for (var replacement = 0; replacement < byteSequenceLength; replacement++) result += FALLBACK_REPLACER;
          i++;
          continue;
        } else {
          decodedChar = fromCodePoint(codePoint);
        }
      }
    }

    result += decodedChar;
    i++;
  }

  return result;
};
/* eslint-enable max-depth -- ok */

// https://url.spec.whatwg.org/#string-percent-encode-after-encoding
// a lone surrogate is the only input `encodeURIComponent` throws on, and the UTF-8
// encoder replaces it - so the throw selects the slow path instead of a per-call scan
var encode = function (input) {
  try {
    return $encodeURIComponent(input);
  } catch (error) {
    return $encodeURIComponent(replace(input, SURROGATE, replaceLoneSurrogate));
  }
};

module.exports = {
  decode: decode,
  encode: encode
};

});

// MODULE: ./node_modules/core-js/internals/use-symbol-as-uid.js
var use_symbol_as_uid_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = symbol_constructor_detection_namespaceFn();

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';

});

// MODULE: ./node_modules/core-js/internals/v8-prototype-define-bug.js
var v8_prototype_define_bug_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var fails = fails_namespaceFn();

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});

});

// MODULE: ./node_modules/core-js/internals/validate-arguments-length.js
var validate_arguments_length_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};

});

// MODULE: ./node_modules/core-js/internals/weak-map-basic-detection.js
var weak_map_basic_detection_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var isCallable = is_callable_namespaceFn();

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));

});

// MODULE: ./node_modules/core-js/internals/well-known-symbol-define.js
var well_known_symbol_define_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var path = path_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var wrappedWellKnownSymbolModule = well_known_symbol_wrapped_namespaceFn();
var defineProperty = (object_define_property_namespaceFn().f);

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

});

// MODULE: ./node_modules/core-js/internals/well-known-symbol-wrapped.js
var well_known_symbol_wrapped_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var wellKnownSymbol = well_known_symbol_namespaceFn();

exports.f = wellKnownSymbol;

});

// MODULE: ./node_modules/core-js/internals/well-known-symbol.js
var well_known_symbol_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var shared = shared_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var uid = uid_namespaceFn();
var NATIVE_SYMBOL = symbol_constructor_detection_namespaceFn();
var USE_SYMBOL_AS_UID = use_symbol_as_uid_namespaceFn();

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

});

// MODULE: ./node_modules/core-js/internals/whitespaces.js
var whitespaces_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

});

// MODULE: ./node_modules/core-js/modules/es.array.filter.js
var es_array_filter_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var $filter = (array_iteration_namespaceFn().pb);
var arrayMethodHasSpeciesSupport = array_method_has_species_support_namespaceFn();

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.array.from.js
var es_array_from_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var from = array_from_namespaceFn();
var checkCorrectnessOfIteration = check_correctness_of_iteration_namespaceFn();

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});

});

// MODULE: ./node_modules/core-js/modules/es.array.iterator.js
var es_array_iterator_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var toIndexedObject = to_indexed_object_namespaceFn();
var addToUnscopables = add_to_unscopables_namespaceFn();
var Iterators = iterators_namespaceFn();
var InternalStateModule = internal_state_namespaceFn();
var defineProperty = (object_define_property_namespaceFn().f);
var defineIterator = iterator_define_namespaceFn();
var createIterResultObject = create_iter_result_object_namespaceFn();
var IS_PURE = is_pure_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  switch (state.kind) {
    case 'keys': return createIterResultObject(index, false);
    case 'values': return createIterResultObject(target[index], false);
  } return createIterResultObject([index, target[index]], false);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }

});

// MODULE: ./node_modules/core-js/modules/es.date.to-primitive.js
var es_date_to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var hasOwn = has_own_property_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var dateToPrimitive = date_to_primitive_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var DatePrototype = Date.prototype;

// `Date.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
if (!hasOwn(DatePrototype, TO_PRIMITIVE)) {
  defineBuiltIn(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
}

});

// MODULE: ./node_modules/core-js/modules/es.function.name.js
var es_function_name_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var DESCRIPTORS = descriptors_namespaceFn();
var FUNCTION_NAME_EXISTS = (function_name_namespaceFn().EXISTS);
var uncurryThis = function_uncurry_this_namespaceFn();
var defineBuiltInAccessor = define_built_in_accessor_namespaceFn();

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineBuiltInAccessor(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

});

// MODULE: ./node_modules/core-js/modules/es.json.stringify.js
var es_json_stringify_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var getBuiltIn = get_built_in_namespaceFn();
var call = function_call_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var fails = fails_namespaceFn();
var isArray = is_array_namespaceFn();
var isCallable = is_callable_namespaceFn();
var isObject = is_object_namespaceFn();
var create = object_create_namespaceFn();
var isRawJSON = is_raw_json_namespaceFn();
var isSymbol = is_symbol_namespaceFn();
var classof = classof_raw_namespaceFn();
var thisNumberValue = this_number_value_namespaceFn();
var includes = (array_includes_namespaceFn().m);
var hasOwn = has_own_property_namespaceFn();
var toString = to_string_namespaceFn();
var parseJSONString = parse_json_string_namespaceFn();
var uid = uid_namespaceFn();
var NATIVE_SYMBOL = symbol_constructor_detection_namespaceFn();
var NATIVE_RAW_JSON = native_raw_json_namespaceFn();

var $String = String;
var $TypeError = TypeError;
var $stringify = getBuiltIn('JSON', 'stringify');
var $BigInt = getBuiltIn('BigInt');
var stringValueOf = uncurryThis(''.valueOf);
var booleanValueOf = uncurryThis(true.valueOf);
var bigIntValueOf = $BigInt && uncurryThis($BigInt.prototype.valueOf);
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var slice = uncurryThis(''.slice);
var push = uncurryThis([].push);
var pop = uncurryThis([].pop);
var numberToString = uncurryThis(1.1.toString);

var surrogates = /[\uD800-\uDFFF]/g;
var leadingSurrogates = /^[\uD800-\uDBFF]$/;
var trailingSurrogates = /^[\uDC00-\uDFFF]$/;
var digits = /^\d+$/;

// a placeholder of a raw JSON value
var RAW_MARK = uid();
// a prefix of keys of a reordered object, see `createOrderedObject`
var KEY_MARK = uid();
// the last key of a reordered object, marks the end of its serialization
var END_MARK = uid();
var RAW_MARK_LENGTH = RAW_MARK.length;
var KEY_MARK_LENGTH = KEY_MARK.length;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')('stringify detection');
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) !== '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) !== '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) !== '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var isRawJSONValue = NATIVE_RAW_JSON ? getBuiltIn('JSON', 'isRawJSON') : isRawJSON;

var stringifyWithProperSymbolsConversion = WRONG_SYMBOLS_CONVERSION ? function (it, replacer, space) {
  return $stringify(it, function (key, value) {
    var replaced = call(replacer, this, key, value);
    if (!isSymbol(replaced)) return replaced;
  }, space);
} : $stringify;

var fixIllFormedJSON = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if (
    (exec(leadingSurrogates, match) && !exec(trailingSurrogates, next)) ||
    (exec(trailingSurrogates, match) && !exec(leadingSurrogates, prev))
  ) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

// `PropertyList` of `JSON.stringify`
// https://tc39.es/ecma262/#sec-json.stringify
var getPropertyList = function (replacer) {
  if (!isArray(replacer)) return;
  var rawLength = replacer.length;
  var propertyList = [];
  // a null prototype object is used as a set of already added keys to keep the deduplication linear
  var addedKeys = create(null);
  for (var i = 0; i < rawLength; i++) {
    var element = replacer[i];
    var key;
    if (typeof element == 'string') key = element;
    else if (typeof element == 'number' || classof(element) === 'Number' || classof(element) === 'String') key = toString(element);
    else continue;
    if (!hasOwn(addedKeys, key)) {
      addedKeys[key] = true;
      push(propertyList, key);
    }
  }
  return propertyList;
};

// values with such an internal slot are unwrapped by `SerializeJSONProperty` instead of being serialized as objects
var hasInternalSlot = function (valueOf, it) {
  try {
    valueOf(it);
    return true;
  } catch (error) {
    return false;
  }
};

// the slot check is expensive, so it's performed only for the kind reported by the value itself -
// a value lying about its kind via `Symbol.toStringTag` is serialized as an ordinary object
var isBoxedPrimitive = function (it) {
  var kind = classof(it);
  return (kind === 'Number' && hasInternalSlot(thisNumberValue, it))
    || (kind === 'String' && hasInternalSlot(stringValueOf, it))
    || (kind === 'Boolean' && hasInternalSlot(booleanValueOf, it))
    || (!!bigIntValueOf && kind === 'BigInt' && hasInternalSlot(bigIntValueOf, it));
};

// only objects serialized by `SerializeJSONObject` are affected by the property list
var isSerializedAsObject = function (it) {
  if (!isObject(it) || isCallable(it) || isArray(it)) return false;
  try {
    return !isBoxedPrimitive(it);
  // `classof` reads `Symbol.toStringTag`, so a proxy could throw - it has no internal slots anyway
  } catch (error) {
    return true;
  }
};

// the engine unwraps it in the same order as it would read the original property,
// so the property is read lazily and `toJSON` is called once and with the original key
var createElementHolder = function (holder, key) {
  return {
    toJSON: function () {
      var element = holder[key];
      if (isObject(element) || typeof element == 'bigint') {
        var elementToJSON = element.toJSON;
        if (isCallable(elementToJSON)) element = call(elementToJSON, element, key);
      } return element;
    }
  };
};

// own keys of objects are sorted - integer-like keys are moved to the beginning,
// so such keys should be marked and restored in the serialized string
var getKeyPrefix = function (propertyList) {
  for (var i = 0, length = propertyList.length; i < length; i++) {
    if (exec(digits, propertyList[i])) return KEY_MARK;
  } return '';
};

// `SerializeJSONObject` iterates the property list, so the value is replaced with an object with keys in this order
var createOrderedObject = function (value, propertyList, keyPrefix) {
  // keys are not marked if the property list has no integer-like keys, so `Object.prototype`
  // with a setter, a non-writable property or `__proto__` should not intercept the assignment
  var ordered = create(null);
  for (var i = 0, length = propertyList.length; i < length; i++) {
    var key = propertyList[i];
    ordered[keyPrefix + key] = createElementHolder(value, key);
  }
  ordered[END_MARK] = null;
  return ordered;
};

// `JSON.stringify` method
// https://tc39.es/ecma262/#sec-json.stringify
// https://github.com/tc39/proposal-json-parse-with-source
if ($stringify) $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE || !NATIVE_RAW_JSON }, {
  stringify: function stringify(text, replacer, space) {
    var replacerFunction = isCallable(replacer) ? replacer : undefined;
    var propertyList = replacerFunction ? undefined : getPropertyList(replacer);
    var keyPrefix = propertyList && getKeyPrefix(propertyList);
    var rawStrings = [];
    var openObjects = [];
    var parentOrdered = [];
    var currentOrdered;
    var marked = false;
    var root = true;

    var json = stringifyWithProperSymbolsConversion(text, function (key, value) {
      // some old implementations (like WebKit) could pass numbers as keys
      key = $String(key);

      if (propertyList) {
        if (key === END_MARK) {
          pop(openObjects);
          currentOrdered = pop(parentOrdered);
          return;
        }
        if (root) root = false;
        // the innermost reordered object already contains only keys of the property list and arrays are not
        // affected by it, the rest of objects (like objects with a fake `Symbol.toStringTag`) are filtered here
        else if (this !== currentOrdered && !isArray(this) && !includes(propertyList, key)) return;
      } else if (replacerFunction) value = call(replacerFunction, this, key, value);

      if (isRawJSONValue(value)) {
        if (NATIVE_RAW_JSON) return value;
        marked = true;
        return RAW_MARK + (push(rawStrings, value.rawJSON) - 1);
      }

      if (propertyList && isSerializedAsObject(value)) {
        // reordered objects are new each time, so cycles should be detected before the engine does it
        if (includes(openObjects, value)) throw new $TypeError('Converting circular structure to JSON');
        var ordered = createOrderedObject(value, propertyList, keyPrefix);
        push(openObjects, value);
        push(parentOrdered, currentOrdered);
        currentOrdered = ordered;
        if (keyPrefix) marked = true;
        return ordered;
      }

      return value;
    }, space);

    if (typeof json != 'string') return json;

    if (ILL_FORMED_UNICODE) json = replace(json, surrogates, fixIllFormedJSON);

    if (!marked) return json;

    var result = '';
    var length = json.length;

    for (var i = 0; i < length; i++) {
      var chr = charAt(json, i);
      if (chr === '"') {
        var end = parseJSONString(json, ++i).end - 1;
        var string = slice(json, i, end);
        if (slice(string, 0, RAW_MARK_LENGTH) === RAW_MARK) result += rawStrings[slice(string, RAW_MARK_LENGTH)];
        else if (slice(string, 0, KEY_MARK_LENGTH) === KEY_MARK) result += '"' + slice(string, KEY_MARK_LENGTH) + '"';
        else result += '"' + string + '"';
        i = end;
      } else result += chr;
    }

    return result;
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.number.constructor.js
var es_number_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var IS_PURE = is_pure_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var globalThis = global_this_namespaceFn();
var path = path_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var isForced = is_forced_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var inheritIfRequired = inherit_if_required_namespaceFn();
var isPrototypeOf = object_is_prototype_of_namespaceFn();
var isSymbol = is_symbol_namespaceFn();
var toPrimitive = to_primitive_namespaceFn();
var fails = fails_namespaceFn();
var getOwnPropertyNames = (object_get_own_property_names_namespaceFn().f);
var getOwnPropertyDescriptor = (object_get_own_property_descriptor_namespaceFn().f);
var defineProperty = (object_define_property_namespaceFn().f);
var thisNumberValue = this_number_value_namespaceFn();
var trim = (string_trim_namespaceFn().Bq);

var NUMBER = 'Number';
var NativeNumber = globalThis[NUMBER];
var PureNumberNamespace = path[NUMBER];
var NumberPrototype = NativeNumber.prototype;
var TypeError = globalThis.TypeError;
var stringSlice = uncurryThis(''.slice);
var charCodeAt = uncurryThis(''.charCodeAt);

// `ToNumeric` abstract operation
// https://tc39.es/ecma262/#sec-tonumeric
var toNumeric = function (value) {
  var primValue = toPrimitive(value, 'number');
  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
};

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (isSymbol(it)) throw new TypeError('Cannot convert a Symbol value to a number');
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = charCodeAt(it, 0);
    if (first === 43 || first === 45) {
      third = charCodeAt(it, 2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (charCodeAt(it, 1)) {
        // fast equal of /^0b[01]+$/i
        case 66:
        case 98:
          radix = 2;
          maxCode = 49;
          break;
        // fast equal of /^0o[0-7]+$/i
        case 79:
        case 111:
          radix = 8;
          maxCode = 55;
          break;
        default:
          return +it;
      }
      digits = stringSlice(it, 2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = charCodeAt(digits, index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

var FORCED = isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'));

var calledWithNew = function (dummy) {
  // includes check on 1..constructor(foo) case
  return isPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue(dummy); });
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
var NumberWrapper = function Number(value) {
  var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
  return calledWithNew(this) ? inheritIfRequired(Object(n), this, NumberWrapper) : n;
};

NumberWrapper.prototype = NumberPrototype;
if (FORCED && !IS_PURE) NumberPrototype.constructor = NumberWrapper;

$({ global: true, constructor: true, wrap: true, forced: FORCED }, {
  Number: NumberWrapper
});

// Use `internal/copy-constructor-properties` helper in `core-js@4`
var copyConstructorProperties = function (target, source) {
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(source) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (hasOwn(source, key = keys[j]) && !hasOwn(target, key)) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

if (IS_PURE && PureNumberNamespace) copyConstructorProperties(path[NUMBER], PureNumberNamespace);
if (FORCED || IS_PURE) copyConstructorProperties(path[NUMBER], NativeNumber);

});

// MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptor.js
var es_object_get_own_property_descriptor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var fails = fails_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var nativeGetOwnPropertyDescriptor = (object_get_own_property_descriptor_namespaceFn().f);
var DESCRIPTORS = descriptors_namespaceFn();

var FORCED = !DESCRIPTORS || fails(function () { nativeGetOwnPropertyDescriptor(1); });

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js
var es_object_get_own_property_descriptors_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var ownKeys = own_keys_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var getOwnPropertyDescriptorModule = object_get_own_property_descriptor_namespaceFn();
var createProperty = create_property_namespaceFn();

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.object.get-own-property-symbols.js
var es_object_get_own_property_symbols_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var NATIVE_SYMBOL = symbol_constructor_detection_namespaceFn();
var fails = fails_namespaceFn();
var getOwnPropertySymbolsModule = object_get_own_property_symbols_namespaceObject();
var toObject = to_object_namespaceFn();

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.object.keys.js
var es_object_keys_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var toObject = to_object_namespaceFn();
var nativeKeys = object_keys_namespaceFn();
var fails = fails_namespaceFn();

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.object.to-string.js
var es_object_to_string_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var TO_STRING_TAG_SUPPORT = to_string_tag_support_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var toString = object_to_string_namespaceFn();

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}

});

// MODULE: ./node_modules/core-js/modules/es.regexp.exec.js
var es_regexp_exec_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var exec = regexp_exec_namespaceFn();

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});

});

// MODULE: ./node_modules/core-js/modules/es.regexp.to-string.js
var es_regexp_to_string_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var PROPER_FUNCTION_NAME = (function_name_namespaceFn().PROPER);
var defineBuiltIn = define_built_in_namespaceFn();
var anObject = an_object_namespaceFn();
var $toString = to_string_namespaceFn();
var fails = fails_namespaceFn();
var getRegExpFlags = regexp_get_flags_namespaceFn();

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) !== '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name !== TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExpPrototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}

});

// MODULE: ./node_modules/core-js/modules/es.string.from-code-point.js
var es_string_from_code_point_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var toAbsoluteIndex = to_absolute_index_namespaceFn();

var $RangeError = RangeError;
var fromCharCode = String.fromCharCode;
// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
var $fromCodePoint = String.fromCodePoint;
var join = uncurryThis([].join);

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length !== 1;

// `String.fromCodePoint` method
// https://tc39.es/ecma262/#sec-string.fromcodepoint
$({ target: 'String', stat: true, arity: 1, forced: INCORRECT_LENGTH }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  fromCodePoint: function fromCodePoint(x) {
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i];
      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw new $RangeError(code + ' is not a valid code point');
      elements[i++] = code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
    } return join(elements, '');
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.string.iterator.js
var es_string_iterator_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var charAt = (string_multibyte_namespaceFn().o);
var toString = to_string_namespaceFn();
var InternalStateModule = internal_state_namespaceFn();
var defineIterator = iterator_define_namespaceFn();
var createIterResultObject = create_iter_result_object_namespaceFn();

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject(point, false);
});

});

// MODULE: ./node_modules/core-js/modules/es.string.match.js
var es_string_match_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var call = function_call_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var fixRegExpWellKnownSymbolLogic = fix_regexp_well_known_symbol_logic_namespaceFn();
var anObject = an_object_namespaceFn();
var isObject = is_object_namespaceFn();
var toLength = to_length_namespaceFn();
var toString = to_string_namespaceFn();
var requireObjectCoercible = require_object_coercible_namespaceFn();
var getMethod = get_method_namespaceFn();
var advanceStringIndex = advance_string_index_namespaceFn();
var getRegExpFlags = regexp_get_flags_namespaceFn();
var regExpExec = regexp_exec_abstract_namespaceFn();

var stringIndexOf = uncurryThis(''.indexOf);

// @@match logic
fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = isObject(regexp) ? getMethod(regexp, MATCH) : undefined;
      if (matcher) return call(matcher, regexp, O);
      var S = toString(O);
      return new RegExp(regexp)[MATCH](S);
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      var flags = toString(getRegExpFlags(rx));

      if (!~stringIndexOf(flags, 'g')) return regExpExec(rx, S);

      var fullUnicode = !!~stringIndexOf(flags, 'u') || !!~stringIndexOf(flags, 'v');
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = toString(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

});

// MODULE: ./node_modules/core-js/modules/es.symbol.constructor.js
var es_symbol_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var globalThis = global_this_namespaceFn();
var call = function_call_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var IS_PURE = is_pure_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var NATIVE_SYMBOL = symbol_constructor_detection_namespaceFn();
var fails = fails_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var isPrototypeOf = object_is_prototype_of_namespaceFn();
var anObject = an_object_namespaceFn();
var toIndexedObject = to_indexed_object_namespaceFn();
var toPropertyKey = to_property_key_namespaceFn();
var $toString = to_string_namespaceFn();
var createPropertyDescriptor = create_property_descriptor_namespaceFn();
var nativeObjectCreate = object_create_namespaceFn();
var objectKeys = object_keys_namespaceFn();
var getOwnPropertyNamesModule = object_get_own_property_names_namespaceFn();
var getOwnPropertyNamesExternal = object_get_own_property_names_external_namespaceFn();
var getOwnPropertySymbolsModule = object_get_own_property_symbols_namespaceObject();
var getOwnPropertyDescriptorModule = object_get_own_property_descriptor_namespaceFn();
var definePropertyModule = object_define_property_namespaceFn();
var definePropertiesModule = object_define_properties_namespaceFn();
var propertyIsEnumerableModule = object_property_is_enumerable_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var defineBuiltInAccessor = define_built_in_accessor_namespaceFn();
var shared = shared_namespaceFn();
var sharedKey = shared_key_namespaceFn();
var hiddenKeys = hidden_keys_namespaceFn();
var uid = uid_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var wrappedWellKnownSymbolModule = well_known_symbol_wrapped_namespaceFn();
var defineWellKnownSymbol = well_known_symbol_define_namespaceFn();
var defineSymbolToPrimitive = symbol_define_to_primitive_namespaceFn();
var setToStringTag = set_to_string_tag_namespaceFn();
var InternalStateModule = internal_state_namespaceFn();
var $forEach = (array_iteration_namespaceFn().jJ);

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = globalThis.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var RangeError = globalThis.RangeError;
var TypeError = globalThis.TypeError;
var QObject = globalThis.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var fallbackDefineProperty = function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  } return O;
};

var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a !== 7;
}) ? fallbackDefineProperty : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    // first definition - default non-enumerable; redefinition - preserve existing state
    if (!('enumerable' in Attributes) ? !hasOwn(O, key) || (hasOwn(O, HIDDEN) && O[HIDDEN][key]) : !Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, nativeObjectCreate(null)));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw new TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      var $this = this === undefined ? globalThis : this;
      if ($this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn($this, HIDDEN) && hasOwn($this[HIDDEN], tag)) $this[HIDDEN][tag] = false;
      var descriptor = createPropertyDescriptor(1, value);
      try {
        setSymbolDescriptor($this, tag, descriptor);
      } catch (error) {
        if (!(error instanceof RangeError)) throw error;
        fallbackDefineProperty($this, tag, descriptor);
      }
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://tc39.es/ecma262/#sec-symbol.prototype.description
    defineBuiltInAccessor(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

});

// MODULE: ./node_modules/core-js/modules/es.symbol.description.js
var es_symbol_description_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = export_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var globalThis = global_this_namespaceFn();
var call = function_call_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var isCallable = is_callable_namespaceFn();
var isPrototypeOf = object_is_prototype_of_namespaceFn();
var toString = to_string_namespaceFn();
var defineBuiltInAccessor = define_built_in_accessor_namespaceFn();
var copyConstructorProperties = copy_constructor_properties_namespaceFn();

var NativeSymbol = globalThis.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      // eslint-disable-next-line sonarjs/inconsistent-function-call -- ok
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  // wrap Symbol.for for correct handling of empty string descriptions
  var nativeFor = SymbolWrapper['for'];
  SymbolWrapper['for'] = { 'for': function (key) {
    var stringKey = toString(key);
    var symbol = call(nativeFor, this, stringKey);
    if (stringKey === '') EmptyStringDescriptionStore[symbol] = true;
    return symbol;
  } }['for'];
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('description detection')) === 'Symbol(description detection)';
  var thisSymbolValue = uncurryThis(SymbolPrototype.valueOf);
  var symbolDescriptiveString = uncurryThis(SymbolPrototype.toString);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineBuiltInAccessor(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = thisSymbolValue(this);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var string = symbolDescriptiveString(symbol);
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

});

// MODULE: ./node_modules/core-js/modules/es.symbol.for.js
var es_symbol_for_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var getBuiltIn = get_built_in_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var toString = to_string_namespaceFn();
var shared = shared_namespaceFn();
var NATIVE_SYMBOL_REGISTRY = symbol_registry_detection_namespaceFn();

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.symbol.iterator.js
var es_symbol_iterator_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var defineWellKnownSymbol = well_known_symbol_define_namespaceFn();

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

});

// MODULE: ./node_modules/core-js/modules/es.symbol.js
var es_symbol_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
es_symbol_constructor_namespaceFn();
es_symbol_for_namespaceFn();
es_symbol_key_for_namespaceFn();
es_json_stringify_namespaceFn();
es_object_get_own_property_symbols_namespaceFn();

});

// MODULE: ./node_modules/core-js/modules/es.symbol.key-for.js
var es_symbol_key_for_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var isSymbol = is_symbol_namespaceFn();
var tryToString = try_to_string_namespaceFn();
var shared = shared_namespaceFn();
var NATIVE_SYMBOL_REGISTRY = symbol_registry_detection_namespaceFn();

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw new TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});

});

// MODULE: ./node_modules/core-js/modules/es.symbol.to-primitive.js
var es_symbol_to_primitive_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var defineWellKnownSymbol = well_known_symbol_define_namespaceFn();
var defineSymbolToPrimitive = symbol_define_to_primitive_namespaceFn();

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

});

// MODULE: ./node_modules/core-js/modules/web.dom-collections.for-each.js
var web_dom_collections_for_each_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var DOMIterables = dom_iterables_namespaceObject();
var DOMTokenListPrototype = dom_token_list_prototype_namespaceFn();
var forEach = array_for_each_namespaceFn();
var createNonEnumerableProperty = create_non_enumerable_property_namespaceFn();

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(globalThis[COLLECTION_NAME] && globalThis[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);

});

// MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js
var web_dom_collections_iterator_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var globalThis = global_this_namespaceFn();
var DOMIterables = dom_iterables_namespaceObject();
var DOMTokenListPrototype = dom_token_list_prototype_namespaceFn();
var ArrayIteratorMethods = es_array_iterator_namespaceFn();
var createNonEnumerableProperty = create_non_enumerable_property_namespaceFn();
var setToStringTag = set_to_string_tag_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    setToStringTag(CollectionPrototype, COLLECTION_NAME, true);
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(globalThis[COLLECTION_NAME] && globalThis[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

});

// MODULE: ./node_modules/core-js/modules/web.url-search-params.constructor.js
var web_url_search_params_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
es_array_iterator_namespaceFn();
var $ = export_namespaceFn();
var globalThis = global_this_namespaceFn();
var safeGetBuiltIn = safe_get_built_in_namespaceFn();
var call = function_call_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var USE_NATIVE_URL = url_constructor_detection_namespaceFn();
var percentCoding = url_percent_coding_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var defineBuiltInAccessor = define_built_in_accessor_namespaceFn();
var defineBuiltIns = define_built_ins_namespaceFn();
var setToStringTag = set_to_string_tag_namespaceFn();
var createIteratorConstructor = iterator_create_constructor_namespaceFn();
var InternalStateModule = internal_state_namespaceFn();
var anInstance = an_instance_namespaceFn();
var isCallable = is_callable_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var bind = function_bind_context_namespaceFn();
var classof = classof_namespaceFn();
var anObject = an_object_namespaceFn();
var isObject = is_object_namespaceFn();
var $toString = to_string_namespaceFn();
var create = object_create_namespaceFn();
var createPropertyDescriptor = create_property_descriptor_namespaceFn();
var getIterator = get_iterator_internal_namespaceFn();
var getIteratorMethod = get_iterator_method_internal_namespaceFn();
var createIterResultObject = create_iter_result_object_namespaceFn();
var validateArgumentsLength = validate_arguments_length_namespaceFn();
var wellKnownSymbol = well_known_symbol_namespaceFn();
var arraySort = array_sort_namespaceFn();

var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState = InternalStateModule.set;
var getInternalParamsState = InternalStateModule.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = InternalStateModule.getterFor(URL_SEARCH_PARAMS_ITERATOR);
var percentDecode = percentCoding.decode;
var percentEncode = percentCoding.encode;

var nativeFetch = safeGetBuiltIn('fetch');
var NativeRequest = safeGetBuiltIn('Request');
var Headers = safeGetBuiltIn('Headers');
var RequestPrototype = NativeRequest && NativeRequest.prototype;
var HeadersPrototype = Headers && Headers.prototype;
var TypeError = globalThis.TypeError;
var charAt = uncurryThis(''.charAt);
var join = uncurryThis([].join);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var splice = uncurryThis([].splice);
var split = uncurryThis(''.split);
var stringSlice = uncurryThis(''.slice);

var plus = /\+/g;

// https://url.spec.whatwg.org/#urlencoded-parsing - `+` decodes to a space
var decodeQueryComponent = function (input) {
  return percentDecode(replace(input, plus, ' '));
};

var find = /[!'()~]|%20/g;

var replacements = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replacements[match];
};

var serialize = function (it) {
  return replace(percentEncode(it), find, replacer);
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    target: getInternalParamsState(params).entries,
    index: 0,
    kind: kind
  });
}, URL_SEARCH_PARAMS, function next() {
  var state = getInternalIteratorState(this);
  var target = state.target;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = null;
    return createIterResultObject(undefined, true);
  }
  var entry = target[index];
  switch (state.kind) {
    case 'keys': return createIterResultObject(entry.key, false);
    case 'values': return createIterResultObject(entry.value, false);
  } return createIterResultObject([entry.key, entry.value], false);
}, true);

var URLSearchParamsState = function (init) {
  this.entries = [];
  this.url = null;

  if (init !== undefined) {
    if (isObject(init)) this.parseObject(init);
    else this.parseQuery(typeof init == 'string' ? charAt(init, 0) === '?' ? stringSlice(init, 1) : init : $toString(init));
  }
};

URLSearchParamsState.prototype = {
  type: URL_SEARCH_PARAMS,
  bindURL: function (url) {
    this.url = url;
    this.update();
  },
  parseObject: function (object) {
    var entries = this.entries;
    var iteratorMethod = getIteratorMethod(object);
    var iterator, next, step, entryIterator, entryNext, first, second;

    if (iteratorMethod) {
      iterator = getIterator(object, iteratorMethod);
      next = iterator.next;
      while (!(step = call(next, iterator)).done) {
        entryIterator = getIterator(anObject(step.value));
        entryNext = entryIterator.next;
        if (
          (first = call(entryNext, entryIterator)).done ||
          (second = call(entryNext, entryIterator)).done ||
          !call(entryNext, entryIterator).done
        ) throw new TypeError('Expected sequence with length 2');
        push(entries, { key: $toString(first.value), value: $toString(second.value) });
      }
    } else for (var key in object) if (hasOwn(object, key)) {
      push(entries, { key: key, value: $toString(object[key]) });
    }
  },
  parseQuery: function (query) {
    if (query) {
      var entries = this.entries;
      var attributes = split(query, '&');
      var index = 0;
      var attribute, entry;
      while (index < attributes.length) {
        attribute = attributes[index++];
        if (attribute.length) {
          entry = split(attribute, '=');
          push(entries, {
            key: decodeQueryComponent(shift(entry)),
            value: decodeQueryComponent(join(entry, '='))
          });
        }
      }
    }
  },
  serialize: function () {
    var entries = this.entries;
    var result = [];
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      push(result, serialize(entry.key) + '=' + serialize(entry.value));
    } return join(result, '&');
  },
  update: function () {
    this.entries.length = 0;
    this.parseQuery(this.url.query);
  },
  updateURL: function () {
    if (this.url) this.url.update();
  }
};

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsPrototype);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var state = setInternalState(this, new URLSearchParamsState(init));
  if (!DESCRIPTORS) this.size = state.entries.length;
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

defineBuiltIns(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    var state = getInternalParamsState(this);
    validateArgumentsLength(arguments.length, 2);
    push(state.entries, { key: $toString(name), value: $toString(value) });
    if (!DESCRIPTORS) this.size++;
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name /* , value */) {
    var state = getInternalParamsState(this);
    var length = validateArgumentsLength(arguments.length, 1);
    var entries = state.entries;
    var key = $toString(name);
    var $value = length < 2 ? undefined : arguments[1];
    var value = $value === undefined ? $value : $toString($value);
    var index = 0;
    while (index < entries.length) {
      var entry = entries[index];
      if (entry.key === key && (value === undefined || entry.value === value)) {
        splice(entries, index, 1);
      } else index++;
    }
    if (!DESCRIPTORS) this.size = entries.length;
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    var entries = getInternalParamsState(this).entries;
    validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    var entries = getInternalParamsState(this).entries;
    validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) push(result, entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name /* , value */) {
    var entries = getInternalParamsState(this).entries;
    var length = validateArgumentsLength(arguments.length, 1);
    var key = $toString(name);
    var $value = length < 2 ? undefined : arguments[1];
    var value = $value === undefined ? $value : $toString($value);
    var index = 0;
    while (index < entries.length) {
      var entry = entries[index++];
      if (entry.key === key && (value === undefined || entry.value === value)) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    var state = getInternalParamsState(this);
    validateArgumentsLength(arguments.length, 2);
    var entries = state.entries;
    var found = false;
    var key = $toString(name);
    var val = $toString(value);
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) splice(entries, index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) push(entries, { key: key, value: val });
    if (!DESCRIPTORS) this.size = entries.length;
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    arraySort(state.entries, function (a, b) {
      return a.key > b.key ? 1 : -1;
    });
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
  return getInternalParamsState(this).serialize();
}, { enumerable: true });

// `URLSearchParams.prototype.size` getter
// https://url.spec.whatwg.org/#dom-urlsearchparams-size
if (DESCRIPTORS) defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
  get: function size() {
    return getInternalParamsState(this).entries.length;
  },
  configurable: true,
  enumerable: true
});

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

$({ global: true, constructor: true, forced: !USE_NATIVE_URL }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
if (!USE_NATIVE_URL && isCallable(Headers)) {
  var headersHas = uncurryThis(HeadersPrototype.has);
  var headersSet = uncurryThis(HeadersPrototype.set);

  var wrapRequestOptions = function (init) {
    if (isObject(init)) {
      var body = init.body;
      var headers;
      if (classof(body) === URL_SEARCH_PARAMS) {
        headers = init.headers ? new Headers(init.headers) : new Headers();
        if (!headersHas(headers, 'content-type')) {
          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
        return create(init, {
          body: createPropertyDescriptor(0, $toString(body)),
          headers: createPropertyDescriptor(0, headers)
        });
      }
    } return init;
  };

  if (isCallable(nativeFetch)) {
    $({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
      fetch: function fetch(input /* , init */) {
        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
      }
    });
  }

  if (isCallable(NativeRequest)) {
    var RequestConstructor = function Request(input /* , init */) {
      anInstance(this, RequestPrototype);
      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
    };

    RequestPrototype.constructor = RequestConstructor;
    RequestConstructor.prototype = RequestPrototype;

    $({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
      Request: RequestConstructor
    });
  }
}

module.exports = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

});

// MODULE: ./node_modules/core-js/modules/web.url-search-params.js
var web_url_search_params_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: Remove this module from `core-js@4` since it's replaced to module below
web_url_search_params_constructor_namespaceFn();

});

// MODULE: ./node_modules/core-js/modules/web.url.constructor.js
var web_url_constructor_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
es_string_iterator_namespaceFn();
var $ = export_namespaceFn();
var DESCRIPTORS = descriptors_namespaceFn();
var USE_NATIVE_URL = url_constructor_detection_namespaceFn();
var globalThis = global_this_namespaceFn();
var bind = function_bind_context_namespaceFn();
var uncurryThis = function_uncurry_this_namespaceFn();
var defineBuiltIn = define_built_in_namespaceFn();
var defineBuiltInAccessor = define_built_in_accessor_namespaceFn();
var anInstance = an_instance_namespaceFn();
var hasOwn = has_own_property_namespaceFn();
var assign = object_assign_namespaceFn();
var arrayFrom = array_from_namespaceFn();
var arraySlice = array_slice_namespaceFn();
var codeAt = (string_multibyte_namespaceFn().L);
var toASCII = string_punycode_to_ascii_namespaceFn();
var percentCoding = url_percent_coding_namespaceFn();
var $toString = to_string_namespaceFn();
var setToStringTag = set_to_string_tag_namespaceFn();
var validateArgumentsLength = validate_arguments_length_namespaceFn();
var URLSearchParamsModule = web_url_search_params_constructor_namespaceFn();
var InternalStateModule = internal_state_namespaceFn();

var setInternalState = InternalStateModule.set;
var getInternalURLState = InternalStateModule.getterFor('URL');
var URLSearchParams = URLSearchParamsModule.URLSearchParams;
var getInternalSearchParamsState = URLSearchParamsModule.getState;
var percentDecode = percentCoding.decode;
var percentEncode = percentCoding.encode;

var NativeURL = globalThis.URL;
var TypeError = globalThis.TypeError;
var parseInt = globalThis.parseInt;
var floor = Math.floor;
var pow = Math.pow;
var fromCharCode = String.fromCharCode;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(/./.exec);
var join = uncurryThis([].join);
var numberToString = uncurryThis(1.1.toString);
var pop = uncurryThis([].pop);
var push = uncurryThis([].push);
var replace = uncurryThis(''.replace);
var shift = uncurryThis([].shift);
var split = uncurryThis(''.split);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);
var toLowerCase = uncurryThis(''.toLowerCase);
var unshift = uncurryThis([].unshift);

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[a-z]/i;
var ALPHANUMERIC_PLUS_MINUS_DOT = /[\d+\-.a-z]/i;
var DIGIT = /\d/;
var HEX_START = /^0x/i;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\da-f]+$/i;
/* eslint-disable regexp/no-control-character -- safe */
// https://url.spec.whatwg.org/#forbidden-domain-code-point
var FORBIDDEN_DOMAIN_CODE_POINT = /[\u0000-\u0020#%/:<>?@[\\\]^|\u007F]/;
// https://url.spec.whatwg.org/#forbidden-host-code-point
var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
var LEADING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+/;
var TRAILING_C0_CONTROL_OR_SPACE = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/;
var TAB_AND_NEW_LINE = /[\t\n\r]/g;
var NON_ASCII = /[^\u0000-\u007F]/;
/* eslint-enable regexp/no-control-character -- safe */
// UTS#46 maps these onto a string containing a forbidden domain code point, so a domain
// holding one is rejected - listing them is far smaller than shipping the mapping table
var MAPPED_ONTO_FORBIDDEN = '\u00A8\u00AF\u00B4\u00B8\u02D8\u02D9\u02DA\u02DB\u02DC\u02DD\u037A\u0384\u0385\u1FBD\u1FBF\u1FC0'
  + '\u1FC1\u1FCD\u1FCE\u1FCF\u1FDD\u1FDE\u1FDF\u1FED\u1FEE\u1FFD\u1FFE\u2017\u203E\u2047\u2048\u2049'
  + '\u2100\u2101\u2105\u2106\u2A74\u309B\u309C\uFC5E\uFC5F\uFC60\uFC61\uFC62\uFC63\uFDFA\uFDFB\uFE13'
  + '\uFE16\uFE47\uFE48\uFE49\uFE4A\uFE4B\uFE4C\uFE55\uFE56\uFE5F\uFE64\uFE65\uFE68\uFE6A\uFE6B\uFE70'
  + '\uFE72\uFE74\uFE76\uFE78\uFE7A\uFE7C\uFE7E\uFFE3';
// eslint-disable-next-line no-unassigned-vars -- expected `undefined` value
var EOF;

// https://www.unicode.org/reports/tr46/#IDNA_Mapping_Table
var isIgnoredCodePoint = function (code) {
  return code === 0xAD || code === 0x34F || code === 0x200B || code === 0x3164
    || code === 0xFEFF || code === 0xFFA0
    || (code >= 0x115F && code <= 0x1160)
    || (code >= 0x17B4 && code <= 0x17B5)
    || (code >= 0x180B && code <= 0x180F)
    || (code >= 0x2060 && code <= 0x2064) || (code >= 0x206A && code <= 0x206F)
    || (code >= 0xFE00 && code <= 0xFE0F)
    || (code >= 0xE0100 && code <= 0xE01EF);
};

var isDisallowedCodePoint = function (code) {
  return code === 0xFFFD
    // lone surrogate - a matched pair is a single code point and never lands here
    || (code >= 0xD800 && code <= 0xDFFF)
    // C1 controls
    || (code >= 0x80 && code <= 0x9F)
    // line and paragraph separators, bidirectional formatting characters
    || (code >= 0x200E && code <= 0x200F) || (code >= 0x2028 && code <= 0x2029)
    || (code >= 0x202A && code <= 0x202E) || (code >= 0x2065 && code <= 0x2069)
    // noncharacters
    || (code >= 0xFDD0 && code <= 0xFDEF) || (code & 0xFFFE) === 0xFFFE
    // private use
    || (code >= 0xE000 && code <= 0xF8FF) || (code >= 0xF0000 && code <= 0x10FFFD);
};

var mapCodePoint = function (code) {
  // full-width forms
  if (code >= 0xFF01 && code <= 0xFF5E) return code - 0xFEE0;
  // spaces and the listed code points collapse onto a forbidden domain code point; a space
  // stands in for the real mapping since either way the domain is rejected
  if (code === 0xA0 || code === 0x1680 || code === 0x202F || code === 0x205F || code === 0x3000) return 0x20;
  if (code >= 0x2000 && code <= 0x200A) return 0x20;
  // the list holds no supplementary code point, and `fromCharCode` would truncate one
  if (code <= 0xFFFF && stringIndexOf(MAPPED_ONTO_FORBIDDEN, fromCharCode(code)) > -1) return 0x20;
  return code;
};

// https://url.spec.whatwg.org/#concept-domain-to-ascii
// A subset of UTS#46 processing - the full mapping table is too large to ship. Covered are the
// entries cheap to express: the ignored and disallowed code points, full-width forms, and the
// code points mapping onto a forbidden domain code point. Not covered, so such domains are
// punycoded rather than mapped or rejected: unassigned code points, half-width forms,
// compatibility decompositions, NFC, CheckJoiners, CheckBidi, and labels that already arrive
// punycoded - those are not decoded back for validation.
var domainToASCII = function (domain) {
  // every mapped, ignored and disallowed code point is non-ASCII, so an ASCII domain
  // needs the punycode step only - this keeps the common case off the slow path
  if (!exec(NON_ASCII, domain)) return domain === '' ? null : toASCII(domain);
  var codePoints = arrayFrom(domain);
  var result = '';
  var index, code, mapped;
  for (index = 0; index < codePoints.length; index++) {
    code = codeAt(codePoints[index], 0);
    if (isDisallowedCodePoint(code)) return null;
    if (isIgnoredCodePoint(code)) continue;
    mapped = mapCodePoint(code);
    result += mapped === code ? codePoints[index] : fromCharCode(mapped);
  }
  return result === '' ? null : toASCII(result);
};

// https://url.spec.whatwg.org/#ends-in-a-number-checker
var endsInNumber = function (input) {
  var parts = split(input, '.');
  var last, hexPart;
  if (parts[parts.length - 1] === '') {
    if (parts.length === 1) return false;
    parts.length--;
  }
  last = parts[parts.length - 1];
  if (exec(DEC, last)) return true;
  if (exec(HEX_START, last)) {
    hexPart = stringSlice(last, 2);
    return hexPart === '' || !!exec(HEX, hexPart);
  }
  return false;
};

// https://url.spec.whatwg.org/#concept-ipv4-parser
var parseIPv4 = function (input) {
  var parts = split(input, '.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] === '') {
    parts.length--;
  }
  partsLength = parts.length;
  if (partsLength > 4) return null;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part === '') return null;
    radix = 10;
    if (part.length > 1 && charAt(part, 0) === '0') {
      radix = exec(HEX_START, part) ? 16 : 8;
      part = stringSlice(part, radix === 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!exec(radix === 10 ? DEC : radix === 8 ? OCT : HEX, part)) return null;
      number = parseInt(part, radix);
    }
    push(numbers, number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index === partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = pop(numbers);
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// https://url.spec.whatwg.org/#concept-ipv6-parser
// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var chr = function () {
    return charAt(input, pointer);
  };

  if (chr() === ':') {
    if (charAt(input, 1) !== ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (chr()) {
    if (pieceIndex === 8) return;
    if (chr() === ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && exec(HEX, chr())) {
      value = value * 16 + parseInt(chr(), 16);
      pointer++;
      length++;
    }
    if (chr() === '.') {
      if (length === 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (chr()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (chr() === '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!exec(DIGIT, chr())) return;
        while (exec(DIGIT, chr())) {
          number = parseInt(chr(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece === 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen === 2 || numbersSeen === 4) pieceIndex++;
      }
      if (numbersSeen !== 4) return;
      break;
    } else if (chr() === ':') {
      pointer++;
      if (!chr()) return;
    } else if (chr()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex !== 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  return currLength > maxLength ? currStart : maxIndex;
};

// https://url.spec.whatwg.org/#host-serializing
var serializeHost = function (host) {
  var result, index, compress, ignore0;

  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      unshift(result, host % 256);
      host = floor(host / 256);
    }
    return join(result, '.');
  }

  // ipv6
  if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += numberToString(host[index], 16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  }

  return host;
};

// https://url.spec.whatwg.org/#c0-control-percent-encode-set
// empty because the set is the code points outside U+0020..U+007E, which the range
// check below already covers; the sets extending it only add code points inside it
var C0ControlPercentEncodeSet = {};
var queryPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '#': 1, '<': 1, '>': 1
});
var specialQueryPercentEncodeSet = assign({}, queryPercentEncodeSet, {
  "'": 1
});
var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1, '^': 1
});
var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

// https://url.spec.whatwg.org/#string-utf-8-percent-encode
var utf8PercentEncode = function (chr, set) {
  var code = codeAt(chr, 0);
  // percent-encoding leaves ' alone, but it belongs to the special-query percent-encode set
  return code >= 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : chr === "'" && hasOwn(set, chr) ? '%27' : percentEncode(chr);
};

// https://url.spec.whatwg.org/#special-scheme
var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

// https://url.spec.whatwg.org/#windows-drive-letter
var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length === 2 && exec(ALPHA, charAt(string, 0))
    && ((second = charAt(string, 1)) === ':' || (!normalized && second === '|'));
};

// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
    string.length === 2 ||
    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

// https://url.spec.whatwg.org/#single-dot-path-segment
var isSingleDot = function (segment) {
  return segment === '.' || toLowerCase(segment) === '%2e';
};

// https://url.spec.whatwg.org/#double-dot-path-segment
var isDoubleDot = function (segment) {
  segment = toLowerCase(segment);
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

var URLState = function (url, isBase, base) {
  var urlString = $toString(url);
  var baseState, failure, searchParams;
  if (isBase) {
    failure = this.parse(urlString);
    if (failure) throw new TypeError(failure);
    this.searchParams = null;
  } else {
    if (base !== undefined) baseState = new URLState(base, true);
    failure = this.parse(urlString, null, baseState);
    if (failure) throw new TypeError(failure);
    searchParams = getInternalSearchParamsState(new URLSearchParams());
    searchParams.bindURL(this);
    this.searchParams = searchParams;
  }
};

URLState.prototype = {
  type: 'URL',
  // https://url.spec.whatwg.org/#url-parsing
  // eslint-disable-next-line max-statements -- TODO
  parse: function (input, stateOverride, base) {
    var url = this;
    var state = stateOverride || SCHEME_START;
    var pointer = 0;
    var buffer = '';
    var seenAt = false;
    var seenBracket = false;
    var seenPasswordToken = false;
    var codePoints, chr, bufferCodePoints, failure;

    input = $toString(input);

    if (!stateOverride) {
      url.scheme = '';
      url.username = '';
      url.password = '';
      url.host = null;
      url.port = null;
      url.path = [];
      url.query = null;
      url.fragment = null;
      url.cannotBeABaseURL = false;
      input = replace(input, LEADING_C0_CONTROL_OR_SPACE, '');
      input = replace(input, TRAILING_C0_CONTROL_OR_SPACE, '$1');
    }

    input = replace(input, TAB_AND_NEW_LINE, '');

    codePoints = arrayFrom(input);

    while (pointer <= codePoints.length) {
      chr = codePoints[pointer];
      switch (state) {
        case SCHEME_START:
          if (chr && exec(ALPHA, chr)) {
            buffer += toLowerCase(chr);
            state = SCHEME;
          } else if (!stateOverride) {
            state = NO_SCHEME;
            continue;
          } else return INVALID_SCHEME;
          break;

        case SCHEME:
          if (chr && exec(ALPHANUMERIC_PLUS_MINUS_DOT, chr)) {
            buffer += toLowerCase(chr);
          } else if (chr === ':') {
            if (stateOverride && (
              (url.isSpecial() !== hasOwn(specialSchemes, buffer)) ||
              (buffer === 'file' && (url.includesCredentials() || url.port !== null)) ||
              (url.scheme === 'file' && url.host === '')
            )) return;
            url.scheme = buffer;
            if (stateOverride) {
              if (url.isSpecial() && specialSchemes[url.scheme] === url.port) url.port = null;
              return;
            }
            buffer = '';
            if (url.scheme === 'file') {
              state = FILE;
            } else if (url.isSpecial() && base && base.scheme === url.scheme) {
              state = SPECIAL_RELATIVE_OR_AUTHORITY;
            } else if (url.isSpecial()) {
              state = SPECIAL_AUTHORITY_SLASHES;
            } else if (codePoints[pointer + 1] === '/') {
              state = PATH_OR_AUTHORITY;
              pointer++;
            } else {
              url.cannotBeABaseURL = true;
              push(url.path, '');
              state = CANNOT_BE_A_BASE_URL_PATH;
            }
          } else if (!stateOverride) {
            buffer = '';
            state = NO_SCHEME;
            pointer = 0;
            continue;
          } else return INVALID_SCHEME;
          break;

        case NO_SCHEME:
          if (!base || (base.cannotBeABaseURL && chr !== '#')) return INVALID_SCHEME;
          if (base.cannotBeABaseURL && chr === '#') {
            url.scheme = base.scheme;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            url.cannotBeABaseURL = true;
            state = FRAGMENT;
            break;
          }
          state = base.scheme === 'file' ? FILE : RELATIVE;
          continue;

        case SPECIAL_RELATIVE_OR_AUTHORITY:
          if (chr === '/' && codePoints[pointer + 1] === '/') {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
            pointer++;
          } else {
            state = RELATIVE;
            continue;
          } break;

        case PATH_OR_AUTHORITY:
          if (chr === '/') {
            state = AUTHORITY;
            break;
          } else {
            state = PATH;
            continue;
          }

        case RELATIVE:
          url.scheme = base.scheme;
          if (chr === EOF) {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
          } else if (chr === '/' || (chr === '\\' && url.isSpecial())) {
            state = RELATIVE_SLASH;
          } else if (chr === '?') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = '';
            state = QUERY;
          } else if (chr === '#') {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            url.path = arraySlice(base.path);
            if (url.path.length) url.path.length--;
            state = PATH;
            continue;
          } break;

        case RELATIVE_SLASH:
          if (url.isSpecial() && (chr === '/' || chr === '\\')) {
            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          } else if (chr === '/') {
            state = AUTHORITY;
          } else {
            url.username = base.username;
            url.password = base.password;
            url.host = base.host;
            url.port = base.port;
            state = PATH;
            continue;
          } break;

        case SPECIAL_AUTHORITY_SLASHES:
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          if (chr !== '/' || codePoints[pointer + 1] !== '/') continue;
          pointer++;
          break;

        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
          if (chr !== '/' && chr !== '\\') {
            state = AUTHORITY;
            continue;
          } break;

        case AUTHORITY:
          if (chr === '@') {
            if (seenAt) buffer = '%40' + buffer;
            seenAt = true;
            bufferCodePoints = arrayFrom(buffer);
            for (var i = 0; i < bufferCodePoints.length; i++) {
              var codePoint = bufferCodePoints[i];
              if (codePoint === ':' && !seenPasswordToken) {
                seenPasswordToken = true;
                continue;
              }
              var encodedCodePoints = utf8PercentEncode(codePoint, userinfoPercentEncodeSet);
              if (seenPasswordToken) url.password += encodedCodePoints;
              else url.username += encodedCodePoints;
            }
            buffer = '';
          } else if (
            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
            (chr === '\\' && url.isSpecial())
          ) {
            if (seenAt && buffer === '') return INVALID_AUTHORITY;
            pointer -= arrayFrom(buffer).length + 1;
            buffer = '';
            state = HOST;
          } else buffer += chr;
          break;

        case HOST:
        case HOSTNAME:
          if (stateOverride && url.scheme === 'file') {
            state = FILE_HOST;
            continue;
          } else if (chr === ':' && !seenBracket) {
            if (buffer === '') return INVALID_HOST;
            if (stateOverride === HOSTNAME) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PORT;
          } else if (
            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
            (chr === '\\' && url.isSpecial())
          ) {
            if (url.isSpecial() && buffer === '') return INVALID_HOST;
            if (stateOverride && buffer === '' && (url.includesCredentials() || url.port !== null)) return;
            failure = url.parseHost(buffer);
            if (failure) return failure;
            buffer = '';
            state = PATH_START;
            if (stateOverride) return;
            continue;
          } else {
            if (chr === '[') seenBracket = true;
            else if (chr === ']') seenBracket = false;
            buffer += chr;
          } break;

        case PORT:
          if (exec(DIGIT, chr)) {
            buffer += chr;
          } else if (
            chr === EOF || chr === '/' || chr === '?' || chr === '#' ||
            (chr === '\\' && url.isSpecial()) ||
            stateOverride
          ) {
            if (buffer !== '') {
              var port = parseInt(buffer, 10);
              if (port > 0xFFFF) return INVALID_PORT;
              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
              buffer = '';
            }
            if (stateOverride) return;
            state = PATH_START;
            continue;
          } else return INVALID_PORT;
          break;

        case FILE:
          url.scheme = 'file';
          url.host = '';
          if (chr === '/' || chr === '\\') state = FILE_SLASH;
          else if (base && base.scheme === 'file') {
            switch (chr) {
              case EOF:
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.query = base.query;
                break;
              case '?':
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.query = '';
                state = QUERY;
                break;
              case '#':
                url.host = base.host;
                url.path = arraySlice(base.path);
                url.query = base.query;
                url.fragment = '';
                state = FRAGMENT;
                break;
              default:
                url.host = base.host;
                if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))) {
                  url.path = arraySlice(base.path);
                  url.shortenPath();
                }
                state = PATH;
                continue;
            }
          } else {
            state = PATH;
            continue;
          } break;

        case FILE_SLASH:
          if (chr === '/' || chr === '\\') {
            state = FILE_HOST;
            break;
          }
          if (base && base.scheme === 'file') {
            url.host = base.host;
            if (!startsWithWindowsDriveLetter(join(arraySlice(codePoints, pointer), ''))
              && isWindowsDriveLetter(base.path[0], true)) push(url.path, base.path[0]);
          }
          state = PATH;
          continue;

        case FILE_HOST:
          if (chr === EOF || chr === '/' || chr === '\\' || chr === '?' || chr === '#') {
            if (!stateOverride && isWindowsDriveLetter(buffer)) {
              state = PATH;
            } else if (buffer === '') {
              url.host = '';
              if (stateOverride) return;
              state = PATH_START;
            } else {
              failure = url.parseHost(buffer);
              if (failure) return failure;
              if (url.host === 'localhost') url.host = '';
              if (stateOverride) return;
              buffer = '';
              state = PATH_START;
            } continue;
          } else buffer += chr;
          break;

        case PATH_START:
          if (url.isSpecial()) {
            state = PATH;
            if (chr !== '/' && chr !== '\\') continue;
          } else if (!stateOverride && chr === '?') {
            url.query = '';
            state = QUERY;
          } else if (!stateOverride && chr === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr !== EOF) {
            state = PATH;
            if (chr !== '/') continue;
          } break;

        case PATH:
          if (
            chr === EOF || chr === '/' ||
            (chr === '\\' && url.isSpecial()) ||
            (!stateOverride && (chr === '?' || chr === '#'))
          ) {
            if (isDoubleDot(buffer)) {
              url.shortenPath();
              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else if (isSingleDot(buffer)) {
              if (chr !== '/' && !(chr === '\\' && url.isSpecial())) {
                push(url.path, '');
              }
            } else {
              if (url.scheme === 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                // eslint-disable-next-line max-depth -- ok
                if (url.host !== null && url.host !== '') url.host = '';
                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
              }
              push(url.path, buffer);
            }
            buffer = '';
            if (url.scheme === 'file' && (chr === EOF || chr === '?' || chr === '#')) {
              while (url.path.length > 1 && url.path[0] === '') {
                shift(url.path);
              }
            }
            if (chr === '?') {
              url.query = '';
              state = QUERY;
            } else if (chr === '#') {
              url.fragment = '';
              state = FRAGMENT;
            }
          } else {
            buffer += utf8PercentEncode(chr, pathPercentEncodeSet);
          } break;

        case CANNOT_BE_A_BASE_URL_PATH:
          if (chr === '?') {
            url.query = '';
            state = QUERY;
          } else if (chr === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr !== EOF) {
            if (chr === ' ') {
              url.path[0] += codePoints[pointer + 1] === '?' || codePoints[pointer + 1] === '#' ? '%20' : ' ';
            } else {
              url.path[0] += utf8PercentEncode(chr, C0ControlPercentEncodeSet);
            }
          } break;

        case QUERY:
          if (!stateOverride && chr === '#') {
            url.fragment = '';
            state = FRAGMENT;
          } else if (chr !== EOF) {
            url.query += utf8PercentEncode(chr, url.isSpecial() ? specialQueryPercentEncodeSet : queryPercentEncodeSet);
          } break;

        case FRAGMENT:
          if (chr !== EOF) url.fragment += utf8PercentEncode(chr, fragmentPercentEncodeSet);
          break;
      }

      pointer++;
    }
  },
  // https://url.spec.whatwg.org/#host-parsing
  parseHost: function (input) {
    var result, codePoints, index;
    if (charAt(input, 0) === '[') {
      if (charAt(input, input.length - 1) !== ']') return INVALID_HOST;
      result = parseIPv6(stringSlice(input, 1, -1));
      if (!result) return INVALID_HOST;
      this.host = result;
    // opaque host
    } else if (!this.isSpecial()) {
      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) return INVALID_HOST;
      result = '';
      codePoints = arrayFrom(input);
      for (index = 0; index < codePoints.length; index++) {
        result += utf8PercentEncode(codePoints[index], C0ControlPercentEncodeSet);
      }
      this.host = result;
    } else {
      input = domainToASCII(percentDecode(input));
      if (input === null || exec(FORBIDDEN_DOMAIN_CODE_POINT, input)) return INVALID_HOST;
      if (endsInNumber(input)) {
        result = parseIPv4(input);
        if (result === null) return INVALID_HOST;
        this.host = result;
      } else {
        this.host = input;
      }
    }
  },
  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
  cannotHaveUsernamePasswordPort: function () {
    return this.host === null || this.host === '' || this.cannotBeABaseURL || this.scheme === 'file';
  },
  // https://url.spec.whatwg.org/#include-credentials
  includesCredentials: function () {
    return this.username !== '' || this.password !== '';
  },
  // https://url.spec.whatwg.org/#is-special
  isSpecial: function () {
    return hasOwn(specialSchemes, this.scheme);
  },
  // https://url.spec.whatwg.org/#shorten-a-urls-path
  shortenPath: function () {
    var path = this.path;
    var pathSize = path.length;
    if (pathSize && (this.scheme !== 'file' || pathSize !== 1 || !isWindowsDriveLetter(path[0], true))) {
      path.length--;
    }
  },
  // https://url.spec.whatwg.org/#concept-url-serializer
  serialize: function () {
    var url = this;
    var scheme = url.scheme;
    var username = url.username;
    var password = url.password;
    var host = url.host;
    var port = url.port;
    var path = url.path;
    var query = url.query;
    var fragment = url.fragment;
    var output = scheme + ':';
    if (host !== null) {
      output += '//';
      if (url.includesCredentials()) {
        output += username + (password ? ':' + password : '') + '@';
      }
      output += serializeHost(host);
      if (port !== null) output += ':' + port;
    } else if (scheme === 'file') output += '//';
    if (host === null && !url.cannotBeABaseURL && path.length > 1 && path[0] === '') output += '/.';
    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
    if (query !== null) output += '?' + query;
    if (fragment !== null) output += '#' + fragment;
    return output;
  },
  // https://url.spec.whatwg.org/#dom-url-href
  setHref: function (href) {
    var failure = this.parse(href);
    if (failure) throw new TypeError(failure);
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-origin
  getOrigin: function () {
    var scheme = this.scheme;
    var port = this.port;
    if (scheme === 'blob') try {
      return new URLConstructor(this.path[0]).origin;
    } catch (error) {
      return 'null';
    }
    if (scheme === 'file' || !this.isSpecial()) return 'null';
    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
  },
  // https://url.spec.whatwg.org/#dom-url-protocol
  getProtocol: function () {
    return this.scheme + ':';
  },
  setProtocol: function (protocol) {
    this.parse($toString(protocol) + ':', SCHEME_START);
  },
  // https://url.spec.whatwg.org/#dom-url-username
  getUsername: function () {
    return this.username;
  },
  setUsername: function (username) {
    var codePoints = arrayFrom($toString(username));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.username = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.username += utf8PercentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-password
  getPassword: function () {
    return this.password;
  },
  setPassword: function (password) {
    var codePoints = arrayFrom($toString(password));
    if (this.cannotHaveUsernamePasswordPort()) return;
    this.password = '';
    for (var i = 0; i < codePoints.length; i++) {
      this.password += utf8PercentEncode(codePoints[i], userinfoPercentEncodeSet);
    }
  },
  // https://url.spec.whatwg.org/#dom-url-host
  getHost: function () {
    var host = this.host;
    var port = this.port;
    return host === null ? ''
      : port === null ? serializeHost(host)
      : serializeHost(host) + ':' + port;
  },
  setHost: function (host) {
    if (this.cannotBeABaseURL) return;
    this.parse(host, HOST);
  },
  // https://url.spec.whatwg.org/#dom-url-hostname
  getHostname: function () {
    var host = this.host;
    return host === null ? '' : serializeHost(host);
  },
  setHostname: function (hostname) {
    if (this.cannotBeABaseURL) return;
    this.parse(hostname, HOSTNAME);
  },
  // https://url.spec.whatwg.org/#dom-url-port
  getPort: function () {
    var port = this.port;
    return port === null ? '' : $toString(port);
  },
  setPort: function (port) {
    if (this.cannotHaveUsernamePasswordPort()) return;
    port = $toString(port);
    if (port === '') this.port = null;
    else this.parse(port, PORT);
  },
  // https://url.spec.whatwg.org/#dom-url-pathname
  getPathname: function () {
    var path = this.path;
    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
  },
  setPathname: function (pathname) {
    if (this.cannotBeABaseURL) return;
    this.path = [];
    this.parse(pathname, PATH_START);
  },
  // https://url.spec.whatwg.org/#dom-url-search
  getSearch: function () {
    var query = this.query;
    return query ? '?' + query : '';
  },
  setSearch: function (search) {
    search = $toString(search);
    if (search === '') {
      this.query = null;
    } else {
      if (charAt(search, 0) === '?') search = stringSlice(search, 1);
      this.query = '';
      this.parse(search, QUERY);
    }
    this.searchParams.update();
  },
  // https://url.spec.whatwg.org/#dom-url-searchparams
  getSearchParams: function () {
    return this.searchParams.facade;
  },
  // https://url.spec.whatwg.org/#dom-url-hash
  getHash: function () {
    var fragment = this.fragment;
    return fragment ? '#' + fragment : '';
  },
  setHash: function (hash) {
    hash = $toString(hash);
    if (hash === '') {
      this.fragment = null;
      return;
    }
    if (charAt(hash, 0) === '#') hash = stringSlice(hash, 1);
    this.fragment = '';
    this.parse(hash, FRAGMENT);
  },
  update: function () {
    this.query = this.searchParams.serialize() || null;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLPrototype);
  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
  var state = setInternalState(that, new URLState(url, false, base));
  if (!DESCRIPTORS) {
    that.href = state.serialize();
    that.origin = state.getOrigin();
    that.protocol = state.getProtocol();
    that.username = state.getUsername();
    that.password = state.getPassword();
    that.host = state.getHost();
    that.hostname = state.getHostname();
    that.port = state.getPort();
    that.pathname = state.getPathname();
    that.search = state.getSearch();
    that.searchParams = state.getSearchParams();
    that.hash = state.getHash();
  }
};

var URLPrototype = URLConstructor.prototype;

var accessorDescriptor = function (getter, setter) {
  return {
    get: function () {
      return getInternalURLState(this)[getter]();
    },
    set: setter && function (value) {
      return getInternalURLState(this)[setter](value);
    },
    configurable: true,
    enumerable: true
  };
};

if (DESCRIPTORS) {
  // `URL.prototype.href` accessors pair
  // https://url.spec.whatwg.org/#dom-url-href
  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
  // `URL.prototype.origin` getter
  // https://url.spec.whatwg.org/#dom-url-origin
  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
  // `URL.prototype.protocol` accessors pair
  // https://url.spec.whatwg.org/#dom-url-protocol
  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
  // `URL.prototype.username` accessors pair
  // https://url.spec.whatwg.org/#dom-url-username
  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
  // `URL.prototype.password` accessors pair
  // https://url.spec.whatwg.org/#dom-url-password
  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
  // `URL.prototype.host` accessors pair
  // https://url.spec.whatwg.org/#dom-url-host
  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
  // `URL.prototype.hostname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hostname
  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
  // `URL.prototype.port` accessors pair
  // https://url.spec.whatwg.org/#dom-url-port
  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
  // `URL.prototype.pathname` accessors pair
  // https://url.spec.whatwg.org/#dom-url-pathname
  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
  // `URL.prototype.search` accessors pair
  // https://url.spec.whatwg.org/#dom-url-search
  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
  // `URL.prototype.searchParams` getter
  // https://url.spec.whatwg.org/#dom-url-searchparams
  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
  // `URL.prototype.hash` accessors pair
  // https://url.spec.whatwg.org/#dom-url-hash
  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
defineBuiltIn(URLPrototype, 'toString', function toString() {
  return getInternalURLState(this).serialize();
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  if (nativeCreateObjectURL) defineBuiltIn(URLConstructor, 'createObjectURL', bind(nativeCreateObjectURL, NativeURL));
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  if (nativeRevokeObjectURL) defineBuiltIn(URLConstructor, 'revokeObjectURL', bind(nativeRevokeObjectURL, NativeURL));
}

setToStringTag(URLConstructor, 'URL');

$({ global: true, constructor: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
  URL: URLConstructor
});

});

// MODULE: ./node_modules/core-js/modules/web.url.js
var web_url_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

// TODO: Remove this module from `core-js@4` since it's replaced to module below
web_url_constructor_namespaceFn();

});

// MODULE: ./node_modules/core-js/modules/web.url.to-json.js
var web_url_to_json_namespaceFn = /*#__PURE__*/__webpack_require__.cw(function(module, exports) {

var $ = export_namespaceFn();
var call = function_call_namespaceFn();
var getBuiltInPrototypeMethod = get_built_in_prototype_method_namespaceFn();

var toString = getBuiltInPrototypeMethod('URL', 'toString');

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
$({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return call(toString, this);
  }
});

});

;// ./node_modules/core-js/modules/es.object.to-string.js
es_object_to_string_namespaceFn();

function dom_iterables_namespaceObject() { return dom_iterables_namespaceObject.c || (dom_iterables_namespaceObject.c = __webpack_require__.t(dom_iterables_namespaceFn(), 2)); }
;// ./node_modules/core-js/modules/web.dom-collections.for-each.js
web_dom_collections_for_each_namespaceFn();

;// ./node_modules/@uppy/core/dist/style.css
// extracted by mini-css-extract-plugin

function object_get_own_property_symbols_namespaceObject() { return object_get_own_property_symbols_namespaceObject.c || (object_get_own_property_symbols_namespaceObject.c = __webpack_require__.t(object_get_own_property_symbols_namespaceFn(), 2)); }
;// ./node_modules/core-js/modules/es.symbol.js
es_symbol_namespaceFn();

;// ./node_modules/core-js/modules/es.symbol.description.js
es_symbol_description_namespaceFn();

;// ./node_modules/core-js/modules/es.symbol.iterator.js
es_symbol_iterator_namespaceFn();

;// ./node_modules/core-js/modules/es.symbol.to-primitive.js
es_symbol_to_primitive_namespaceFn();

;// ./node_modules/core-js/modules/es.array.filter.js
es_array_filter_namespaceFn();

;// ./node_modules/core-js/modules/es.array.iterator.js
es_array_iterator_namespaceFn();

;// ./node_modules/core-js/modules/es.date.to-primitive.js
es_date_to_primitive_namespaceFn();

;// ./node_modules/core-js/modules/es.function.name.js
es_function_name_namespaceFn();

;// ./node_modules/core-js/modules/es.number.constructor.js
es_number_constructor_namespaceFn();

;// ./node_modules/core-js/modules/es.object.get-own-property-descriptor.js
es_object_get_own_property_descriptor_namespaceFn();

;// ./node_modules/core-js/modules/es.object.get-own-property-descriptors.js
es_object_get_own_property_descriptors_namespaceFn();

;// ./node_modules/core-js/modules/es.object.keys.js
es_object_keys_namespaceFn();

;// ./node_modules/core-js/modules/es.string.iterator.js
es_string_iterator_namespaceFn();

;// ./node_modules/core-js/modules/web.dom-collections.iterator.js
web_dom_collections_iterator_namespaceFn();

;// ./node_modules/core-js/modules/web.url.js
web_url_namespaceFn();

;// ./node_modules/core-js/modules/web.url.to-json.js
web_url_to_json_namespaceFn();

;// ./node_modules/core-js/modules/web.url-search-params.js
web_url_search_params_namespaceFn();

;// ./node_modules/@uppy/store-default/package.json
const package_namespaceObject = {"rE":"4.3.2"};
;// ./node_modules/@uppy/store-default/lib/index.js

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
    static VERSION = package_namespaceObject.rE;
    state = {};
    #callbacks = new Set();
    getState() {
        return this.state;
    }
    setState(patch) {
        const prevState = { ...this.state };
        const nextState = { ...this.state, ...patch };
        this.state = nextState;
        this.#publish(prevState, nextState, patch);
    }
    subscribe(listener) {
        this.#callbacks.add(listener);
        return () => {
            this.#callbacks.delete(listener);
        };
    }
    #publish(...args) {
        this.#callbacks.forEach((listener) => {
            listener(...args);
        });
    }
}
/* harmony default export */ const lib = (DefaultStore);

;// ./node_modules/@uppy/utils/lib/getFileNameAndExtension.js
/**
 * Takes a full filename string and returns an object {name, extension}
 */
function getFileNameAndExtension(fullFileName) {
    const lastDot = fullFileName.lastIndexOf('.');
    // these count as no extension: "no-dot", "trailing-dot."
    if (lastDot === -1 || lastDot === fullFileName.length - 1) {
        return {
            name: fullFileName,
            extension: undefined,
        };
    }
    return {
        name: fullFileName.slice(0, lastDot),
        extension: fullFileName.slice(lastDot + 1),
    };
}

;// ./node_modules/@uppy/utils/lib/mimeTypes.js
// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
/* harmony default export */ const lib_mimeTypes = ({
    __proto__: null,
    md: 'text/markdown',
    markdown: 'text/markdown',
    mp4: 'video/mp4',
    mp3: 'audio/mp3',
    svg: 'image/svg+xml',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    heif: 'image/heif',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    csv: 'text/csv',
    tsv: 'text/tab-separated-values',
    tab: 'text/tab-separated-values',
    avi: 'video/x-msvideo',
    mks: 'video/x-matroska',
    mkv: 'video/x-matroska',
    mov: 'video/quicktime',
    dicom: 'application/dicom',
    doc: 'application/msword',
    msg: 'application/vnd.ms-outlook',
    docm: 'application/vnd.ms-word.document.macroenabled.12',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    dot: 'application/msword',
    dotm: 'application/vnd.ms-word.template.macroenabled.12',
    dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    xla: 'application/vnd.ms-excel',
    xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
    xlc: 'application/vnd.ms-excel',
    xlf: 'application/x-xliff+xml',
    xlm: 'application/vnd.ms-excel',
    xls: 'application/vnd.ms-excel',
    xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlt: 'application/vnd.ms-excel',
    xltm: 'application/vnd.ms-excel.template.macroenabled.12',
    xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    xlw: 'application/vnd.ms-excel',
    txt: 'text/plain',
    text: 'text/plain',
    conf: 'text/plain',
    log: 'text/plain',
    pdf: 'application/pdf',
    zip: 'application/zip',
    '7z': 'application/x-7z-compressed',
    rar: 'application/x-rar-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    dmg: 'application/x-apple-diskimage',
});

;// ./node_modules/@uppy/utils/lib/getFileType.js


function getFileType(file) {
    if (file.type)
        return file.type;
    const fileExtension = file.name
        ? getFileNameAndExtension(file.name).extension?.toLowerCase()
        : null;
    if (fileExtension && fileExtension in lib_mimeTypes) {
        // else, see if we can map extension to a mime type
        return lib_mimeTypes[fileExtension];
    }
    // if all fails, fall back to a generic byte stream type
    return 'application/octet-stream';
}

;// ./node_modules/@uppy/utils/lib/generateFileID.js

function encodeCharacter(character) {
    return character.charCodeAt(0).toString(32);
}
function encodeFilename(name) {
    let suffix = '';
    return (name.replace(/[^A-Z0-9]/gi, (character) => {
        suffix += `-${encodeCharacter(character)}`;
        return '/';
    }) + suffix);
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 */
function generateFileID(file, instanceId) {
    // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
    // is slower! simple string concatenation is fast
    let id = instanceId || 'uppy';
    if (typeof file.name === 'string') {
        id += `-${encodeFilename(file.name.toLowerCase())}`;
    }
    if (file.type !== undefined) {
        id += `-${file.type}`;
    }
    if (file.meta && typeof file.meta.relativePath === 'string') {
        id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
    }
    if (file.data.size !== undefined) {
        id += `-${file.data.size}`;
    }
    if (file.data.lastModified !== undefined) {
        id += `-${file.data.lastModified}`;
    }
    return id;
}
// If the provider has a stable, unique ID, then we can use that to identify the file.
// Then we don't have to generate our own ID, and we can add the same file many times if needed (different path)
function hasFileStableId(file) {
    if (!file.isRemote || !file.remote)
        return false;
    // These are the providers that it seems like have stable IDs for their files. The other's I haven't checked yet.
    const stableIdProviders = new Set([
        'box',
        'dropbox',
        'drive',
        'facebook',
        'unsplash',
    ]);
    return stableIdProviders.has(file.remote.provider);
}
function getSafeFileId(file, instanceId) {
    if (hasFileStableId(file))
        return file.id;
    const fileType = getFileType(file);
    return generateFileID({
        ...file,
        type: fileType,
    }, instanceId);
}

;// ./node_modules/@uppy/utils/lib/Translator.js
function insertReplacement(source, rx, replacement) {
    const newParts = [];
    source.forEach((chunk) => {
        // When the source contains multiple placeholders for interpolation,
        // we should ignore chunks that are not strings, because those
        // can be JSX objects and will be otherwise incorrectly turned into strings.
        // Without this condition we’d get this: [object Object] hello [object Object] my <button>
        if (typeof chunk !== 'string') {
            return newParts.push(chunk);
        }
        return rx[Symbol.split](chunk).forEach((raw, i, list) => {
            if (raw !== '') {
                newParts.push(raw);
            }
            // Interlace with the `replacement` value
            if (i < list.length - 1) {
                newParts.push(replacement);
            }
        });
    });
    return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param phrase that needs interpolation, with placeholders
 * @param options with values that will be used to replace placeholders
 */
function interpolate(phrase, options) {
    const dollarRegex = /\$/g;
    const dollarBillsYall = '$$$$';
    let interpolated = [phrase];
    if (options == null)
        return interpolated;
    for (const arg of Object.keys(options)) {
        if (arg !== '_') {
            // Ensure replacement value is escaped to prevent special $-prefixed
            // regex replace tokens. the "$$$$" is needed because each "$" needs to
            // be escaped with "$" itself, and we need two in the resulting output.
            let replacement = options[arg];
            if (typeof replacement === 'string') {
                replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
            }
            // We create a new `RegExp` each time instead of using a more-efficient
            // string replace so that the same argument can be replaced multiple times
            // in the same phrase.
            interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
        }
    }
    return interpolated;
}
const defaultOnMissingKey = (key) => {
    throw new Error(`missing string: ${key}`);
};
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */
class Translator {
    locale;
    constructor(locales, { onMissingKey = defaultOnMissingKey } = {}) {
        this.locale = {
            strings: {},
            pluralize(n) {
                if (n === 1) {
                    return 0;
                }
                return 1;
            },
        };
        if (Array.isArray(locales)) {
            locales.forEach(this.#apply, this);
        }
        else {
            this.#apply(locales);
        }
        this.#onMissingKey = onMissingKey;
    }
    #onMissingKey;
    #apply(locale) {
        if (!locale?.strings) {
            return;
        }
        const prevLocale = this.locale;
        Object.assign(this.locale, {
            strings: { ...prevLocale.strings, ...locale.strings },
            pluralize: locale.pluralize || prevLocale.pluralize,
        });
    }
    /**
     * Public translate method
     *
     * @param key
     * @param options with values that will be used later to replace placeholders in string
     * @returns string translated (and interpolated)
     */
    translate(key, options) {
        return this.translateArray(key, options).join('');
    }
    /**
     * Get a translation and return the translated and interpolated parts as an array.
     *
     * @returns The translated and interpolated parts, in order.
     */
    translateArray(key, options) {
        let string = this.locale.strings[key];
        if (string == null) {
            this.#onMissingKey(key);
            string = key;
        }
        const hasPluralForms = typeof string === 'object';
        if (hasPluralForms) {
            if (options && typeof options.smart_count !== 'undefined') {
                const plural = this.locale.pluralize(options.smart_count);
                return interpolate(string[plural], options);
            }
            throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
        }
        if (typeof string !== 'string') {
            throw new Error(`string was not a string`);
        }
        return interpolate(string, options);
    }
}

// EXTERNAL MODULE: ./node_modules/lodash/throttle.js
var throttle = __webpack_require__(350);
// EXTERNAL MODULE: ./node_modules/namespace-emitter/index.js
var namespace_emitter = __webpack_require__(835);
;// ./node_modules/nanoid/non-secure/index.js

let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size | 0
    while (i-- > 0) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}

let nanoid = (size = 21) => {
  let id = ''
  let i = size | 0
  while (i-- > 0) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}

;// ./node_modules/@uppy/core/package.json
const core_package_namespaceObject = {"rE":"4.5.3"};
;// ./node_modules/@uppy/core/lib/getFileName.js
function getFileName(fileType, fileDescriptor) {
    if (fileDescriptor.name) {
        return fileDescriptor.name;
    }
    if (fileType.split('/')[0] === 'image') {
        return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
    }
    return 'noname';
}

;// ./node_modules/@uppy/core/lib/locale.js
/* harmony default export */ const locale = ({
    strings: {
        addBulkFilesFailed: {
            0: 'Failed to add %{smart_count} file due to an internal error',
            1: 'Failed to add %{smart_count} files due to internal errors',
        },
        youCanOnlyUploadX: {
            0: 'You can only upload %{smart_count} file',
            1: 'You can only upload %{smart_count} files',
        },
        youHaveToAtLeastSelectX: {
            0: 'You have to select at least %{smart_count} file',
            1: 'You have to select at least %{smart_count} files',
        },
        aggregateExceedsSize: 'You selected %{size} of files, but maximum allowed size is %{sizeAllowed}',
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noMoreFilesAllowed: 'Cannot add more files',
        noDuplicates: "Cannot add the duplicate file '%{fileName}', it already exists",
        companionError: 'Connection with Companion failed',
        authAborted: 'Authentication aborted',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        noSearchResults: 'Unfortunately, there are no results for this search',
        selectX: {
            0: 'Select %{smart_count}',
            1: 'Select %{smart_count}',
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        logIn: 'Log in',
        pickFiles: 'Pick files',
        pickPhotos: 'Pick photos',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        loadedXFiles: 'Loaded %{numFiles} files',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        signInWithGoogle: 'Sign in with Google',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        search: 'Search',
        resetSearch: 'Reset search',
        emptyFolderAdded: 'No files were added from empty folder',
        addedNumFiles: 'Added %{numFiles} file(s)',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
            0: 'Added %{smart_count} file from %{folder}',
            1: 'Added %{smart_count} files from %{folder}',
        },
        additionalRestrictionsFailed: '%{count} additional restrictions were not fulfilled',
        unnamed: 'Unnamed',
        pleaseWait: 'Please wait',
    },
});

;// ./node_modules/@uppy/utils/lib/getTimeStamp.js
/**
 * Adds zero to strings shorter than two characters.
 */
function pad(number) {
    return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */
function getTimeStamp() {
    const date = new Date();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

;// ./node_modules/@uppy/core/lib/loggers.js

// Swallow all logs, except errors.
// default if logger is not set or debug: false
const justErrorsLogger = {
    debug: () => { },
    warn: () => { },
    error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args),
};
// Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true
const debugLogger = {
    debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
    warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
    error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args),
};


;// ./node_modules/@transloadit/prettier-bytes/dist/prettierBytes.js
prettierBytes_namespaceFn();

// EXTERNAL MODULE: ./node_modules/mime-match/index.js
var mime_match = __webpack_require__(57);
;// ./node_modules/@uppy/core/lib/Restricter.js

// @ts-ignore untyped

const Restricter_defaultOptions = {
    maxFileSize: null,
    minFileSize: null,
    maxTotalFileSize: null,
    maxNumberOfFiles: null,
    minNumberOfFiles: null,
    allowedFileTypes: null,
    requiredMetaFields: [],
};
class RestrictionError extends Error {
    isUserFacing;
    file;
    constructor(message, opts) {
        super(message);
        this.isUserFacing = opts?.isUserFacing ?? true;
        if (opts?.file) {
            this.file = opts.file; // only some restriction errors are related to a particular file
        }
    }
    isRestriction = true;
}
class Restricter {
    getI18n;
    getOpts;
    constructor(getOpts, getI18n) {
        this.getI18n = getI18n;
        this.getOpts = () => {
            const opts = getOpts();
            if (opts.restrictions?.allowedFileTypes != null &&
                !Array.isArray(opts.restrictions.allowedFileTypes)) {
                throw new TypeError('`restrictions.allowedFileTypes` must be an array');
            }
            return opts;
        };
    }
    // Because these operations are slow, we cannot run them for every file (if we are adding multiple files)
    validateAggregateRestrictions(existingFiles, addingFiles) {
        const { maxTotalFileSize, maxNumberOfFiles } = this.getOpts().restrictions;
        if (maxNumberOfFiles) {
            const nonGhostFiles = existingFiles.filter((f) => !f.isGhost);
            if (nonGhostFiles.length + addingFiles.length > maxNumberOfFiles) {
                throw new RestrictionError(`${this.getI18n()('youCanOnlyUploadX', {
                    smart_count: maxNumberOfFiles,
                })}`);
            }
        }
        if (maxTotalFileSize) {
            const totalFilesSize = [...existingFiles, ...addingFiles].reduce((total, f) => total + (f.size ?? 0), 0);
            if (totalFilesSize > maxTotalFileSize) {
                throw new RestrictionError(this.getI18n()('aggregateExceedsSize', {
                    sizeAllowed: prettierBytes_namespaceFn()(maxTotalFileSize),
                    size: prettierBytes_namespaceFn()(totalFilesSize),
                }));
            }
        }
    }
    validateSingleFile(file) {
        const { maxFileSize, minFileSize, allowedFileTypes } = this.getOpts().restrictions;
        if (allowedFileTypes) {
            const isCorrectFileType = allowedFileTypes.some((type) => {
                // check if this is a mime-type
                if (type.includes('/')) {
                    if (!file.type)
                        return false;
                    return mime_match(file.type.replace(/;.*?$/, ''), type);
                }
                // otherwise this is likely an extension
                if (type[0] === '.' && file.extension) {
                    return file.extension.toLowerCase() === type.slice(1).toLowerCase();
                }
                return false;
            });
            if (!isCorrectFileType) {
                const allowedFileTypesString = allowedFileTypes.join(', ');
                throw new RestrictionError(this.getI18n()('youCanOnlyUploadFileTypes', {
                    types: allowedFileTypesString,
                }), { file });
            }
        }
        // We can't check maxFileSize if the size is unknown.
        if (maxFileSize && file.size != null && file.size > maxFileSize) {
            throw new RestrictionError(this.getI18n()('exceedsSize', {
                size: prettierBytes_namespaceFn()(maxFileSize),
                file: file.name ?? this.getI18n()('unnamed'),
            }), { file });
        }
        // We can't check minFileSize if the size is unknown.
        if (minFileSize && file.size != null && file.size < minFileSize) {
            throw new RestrictionError(this.getI18n()('inferiorSize', {
                size: prettierBytes_namespaceFn()(minFileSize),
            }), { file });
        }
    }
    validate(existingFiles, addingFiles) {
        addingFiles.forEach((addingFile) => {
            this.validateSingleFile(addingFile);
        });
        this.validateAggregateRestrictions(existingFiles, addingFiles);
    }
    validateMinNumberOfFiles(files) {
        const { minNumberOfFiles } = this.getOpts().restrictions;
        if (minNumberOfFiles && Object.keys(files).length < minNumberOfFiles) {
            throw new RestrictionError(this.getI18n()('youHaveToAtLeastSelectX', {
                smart_count: minNumberOfFiles,
            }));
        }
    }
    getMissingRequiredMetaFields(file) {
        const error = new RestrictionError(this.getI18n()('missingRequiredMetaFieldOnFile', {
            fileName: file.name ?? this.getI18n()('unnamed'),
        }));
        const { requiredMetaFields } = this.getOpts().restrictions;
        const missingFields = [];
        for (const field of requiredMetaFields) {
            if (!Object.hasOwn(file.meta, field) || file.meta[field] === '') {
                missingFields.push(field);
            }
        }
        return { missingFields, error };
    }
}


;// ./node_modules/@uppy/core/lib/supportsUploadProgress.js
// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
function supportsUploadProgress(userAgent) {
    // Allow passing in userAgent for tests
    if (userAgent == null && typeof navigator !== 'undefined') {
        userAgent = navigator.userAgent;
    }
    // Assume it works because basically everything supports progress events.
    if (!userAgent)
        return true;
    const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
    if (!m)
        return true;
    const edgeVersion = m[1];
    const version = edgeVersion.split('.', 2);
    const major = parseInt(version[0], 10);
    const minor = parseInt(version[1], 10);
    // Worked before:
    // Edge 40.15063.0.0
    // Microsoft EdgeHTML 15.15063
    if (major < 15 || (major === 15 && minor < 15063)) {
        return true;
    }
    // Fixed in:
    // Microsoft EdgeHTML 18.18218
    if (major > 18 || (major === 18 && minor >= 18218)) {
        return true;
    }
    // other versions don't work.
    return false;
}

;// ./node_modules/@uppy/core/lib/Uppy.js
/* global AggregateError */






// @ts-ignore untyped








const defaultUploadState = {
    totalProgress: 0,
    allowNewUpload: true,
    error: null,
    recoveredState: null,
};
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */
class Uppy {
    static VERSION = core_package_namespaceObject.rE;
    #plugins = Object.create(null);
    #restricter;
    #storeUnsubscribe;
    #emitter = namespace_emitter();
    #preProcessors = new Set();
    #uploaders = new Set();
    #postProcessors = new Set();
    defaultLocale;
    locale;
    // The user optionally passes in options, but we set defaults for missing options.
    // We consider all options present after the contructor has run.
    opts;
    store;
    // Warning: do not use this from a plugin, as it will cause the plugins' translations to be missing
    i18n;
    i18nArray;
    scheduledAutoProceed = null;
    wasOffline = false;
    /**
     * Instantiate Uppy
     */
    constructor(opts) {
        this.defaultLocale = locale;
        const defaultOptions = {
            id: 'uppy',
            autoProceed: false,
            allowMultipleUploadBatches: true,
            debug: false,
            restrictions: Restricter_defaultOptions,
            meta: {},
            onBeforeFileAdded: (file, files) => !Object.hasOwn(files, file.id),
            onBeforeUpload: (files) => files,
            store: new lib(),
            logger: justErrorsLogger,
            infoTimeout: 5000,
        };
        const merged = { ...defaultOptions, ...opts };
        // Merge default options with the ones set by user,
        // making sure to merge restrictions too
        this.opts = {
            ...merged,
            restrictions: {
                ...defaultOptions.restrictions,
                ...opts?.restrictions,
            },
        };
        // Support debug: true for backwards-compatability, unless logger is set in opts
        // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions
        if (opts?.logger && opts.debug) {
            this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
        }
        else if (opts?.debug) {
            this.opts.logger = debugLogger;
        }
        this.log(`Using Core v${Uppy.VERSION}`);
        this.i18nInit();
        this.store = this.opts.store;
        this.setState({
            ...defaultUploadState,
            plugins: {},
            files: {},
            currentUploads: {},
            capabilities: {
                uploadProgress: supportsUploadProgress(),
                individualCancellation: true,
                resumableUploads: false,
            },
            meta: { ...this.opts.meta },
            info: [],
        });
        this.#restricter = new Restricter(() => this.opts, () => this.i18n);
        this.#storeUnsubscribe = this.store.subscribe((prevState, nextState, patch) => {
            this.emit('state-update', prevState, nextState, patch);
            this.updateAll(nextState);
        });
        // Exposing uppy object on window for debugging and testing
        if (this.opts.debug && typeof window !== 'undefined') {
            // @ts-ignore Mutating the global object for debug purposes
            window[this.opts.id] = this;
        }
        this.#addListeners();
    }
    emit(event, ...args) {
        this.#emitter.emit(event, ...args);
    }
    on(event, callback) {
        this.#emitter.on(event, callback);
        return this;
    }
    once(event, callback) {
        this.#emitter.once(event, callback);
        return this;
    }
    off(event, callback) {
        this.#emitter.off(event, callback);
        return this;
    }
    /**
     * Iterate on all plugins and run `update` on them.
     * Called each time state changes.
     *
     */
    updateAll(state) {
        this.iteratePlugins((plugin) => {
            plugin.update(state);
        });
    }
    /**
     * Updates state with a patch
     */
    setState(patch) {
        this.store.setState(patch);
    }
    /**
     * Returns current state.
     */
    getState() {
        return this.store.getState();
    }
    patchFilesState(filesWithNewState) {
        const existingFilesState = this.getState().files;
        this.setState({
            files: {
                ...existingFilesState,
                ...Object.fromEntries(Object.entries(filesWithNewState).map(([fileID, newFileState]) => [
                    fileID,
                    {
                        ...existingFilesState[fileID],
                        ...newFileState,
                    },
                ])),
            },
        });
    }
    /**
     * Shorthand to set state for a specific file.
     */
    setFileState(fileID, state) {
        if (!this.getState().files[fileID]) {
            throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
        }
        this.patchFilesState({ [fileID]: state });
    }
    i18nInit() {
        const onMissingKey = (key) => this.log(`Missing i18n string: ${key}`, 'error');
        const translator = new Translator([this.defaultLocale, this.opts.locale], {
            onMissingKey,
        });
        this.i18n = translator.translate.bind(translator);
        this.i18nArray = translator.translateArray.bind(translator);
        this.locale = translator.locale;
    }
    setOptions(newOpts) {
        this.opts = {
            ...this.opts,
            ...newOpts,
            restrictions: {
                ...this.opts.restrictions,
                ...newOpts?.restrictions,
            },
        };
        if (newOpts.meta) {
            this.setMeta(newOpts.meta);
        }
        this.i18nInit();
        if (newOpts.locale) {
            this.iteratePlugins((plugin) => {
                plugin.setOptions(newOpts);
            });
        }
        // Note: this is not the preact `setState`, it's an internal function that has the same name.
        this.setState(undefined); // so that UI re-renders with new options
    }
    resetProgress() {
        const defaultProgress = {
            percentage: 0,
            bytesUploaded: false,
            uploadComplete: false,
            uploadStarted: null,
        };
        const files = { ...this.getState().files };
        const updatedFiles = Object.create(null);
        Object.keys(files).forEach((fileID) => {
            updatedFiles[fileID] = {
                ...files[fileID],
                progress: {
                    ...files[fileID].progress,
                    ...defaultProgress,
                },
                // @ts-expect-error these typed are inserted
                // into the namespace in their respective packages
                // but core isn't ware of those
                tus: undefined,
                transloadit: undefined,
            };
        });
        this.setState({ files: updatedFiles, ...defaultUploadState });
    }
    clear() {
        const { capabilities, currentUploads } = this.getState();
        if (Object.keys(currentUploads).length > 0 &&
            !capabilities.individualCancellation) {
            throw new Error('The installed uploader plugin does not allow removing files during an upload.');
        }
        this.setState({ ...defaultUploadState, files: {} });
    }
    addPreProcessor(fn) {
        this.#preProcessors.add(fn);
    }
    removePreProcessor(fn) {
        return this.#preProcessors.delete(fn);
    }
    addPostProcessor(fn) {
        this.#postProcessors.add(fn);
    }
    removePostProcessor(fn) {
        return this.#postProcessors.delete(fn);
    }
    addUploader(fn) {
        this.#uploaders.add(fn);
    }
    removeUploader(fn) {
        return this.#uploaders.delete(fn);
    }
    setMeta(data) {
        const updatedMeta = { ...this.getState().meta, ...data };
        const updatedFiles = { ...this.getState().files };
        Object.keys(updatedFiles).forEach((fileID) => {
            updatedFiles[fileID] = {
                ...updatedFiles[fileID],
                meta: { ...updatedFiles[fileID].meta, ...data },
            };
        });
        this.log('Adding metadata:');
        this.log(data);
        this.setState({
            meta: updatedMeta,
            files: updatedFiles,
        });
    }
    setFileMeta(fileID, data) {
        const updatedFiles = { ...this.getState().files };
        if (!updatedFiles[fileID]) {
            this.log(`Was trying to set metadata for a file that has been removed: ${fileID}`);
            return;
        }
        const newMeta = { ...updatedFiles[fileID].meta, ...data };
        updatedFiles[fileID] = { ...updatedFiles[fileID], meta: newMeta };
        this.setState({ files: updatedFiles });
    }
    /**
     * Get a file object.
     */
    getFile(fileID) {
        return this.getState().files[fileID];
    }
    /**
     * Get all files in an array.
     */
    getFiles() {
        const { files } = this.getState();
        return Object.values(files);
    }
    getFilesByIds(ids) {
        return ids.map((id) => this.getFile(id));
    }
    getObjectOfFilesPerState() {
        const { files: filesObject, totalProgress, error } = this.getState();
        const files = Object.values(filesObject);
        const inProgressFiles = [];
        const newFiles = [];
        const startedFiles = [];
        const uploadStartedFiles = [];
        const pausedFiles = [];
        const completeFiles = [];
        const erroredFiles = [];
        const inProgressNotPausedFiles = [];
        const processingFiles = [];
        for (const file of files) {
            const { progress } = file;
            if (!progress.uploadComplete && progress.uploadStarted) {
                inProgressFiles.push(file);
                if (!file.isPaused) {
                    inProgressNotPausedFiles.push(file);
                }
            }
            if (!progress.uploadStarted) {
                newFiles.push(file);
            }
            if (progress.uploadStarted ||
                progress.preprocess ||
                progress.postprocess) {
                startedFiles.push(file);
            }
            if (progress.uploadStarted) {
                uploadStartedFiles.push(file);
            }
            if (file.isPaused) {
                pausedFiles.push(file);
            }
            if (progress.uploadComplete) {
                completeFiles.push(file);
            }
            if (file.error) {
                erroredFiles.push(file);
            }
            if (progress.preprocess || progress.postprocess) {
                processingFiles.push(file);
            }
        }
        return {
            newFiles,
            startedFiles,
            uploadStartedFiles,
            pausedFiles,
            completeFiles,
            erroredFiles,
            inProgressFiles,
            inProgressNotPausedFiles,
            processingFiles,
            isUploadStarted: uploadStartedFiles.length > 0,
            isAllComplete: totalProgress === 100 &&
                completeFiles.length === files.length &&
                processingFiles.length === 0,
            isAllErrored: !!error && erroredFiles.length === files.length,
            isAllPaused: inProgressFiles.length !== 0 &&
                pausedFiles.length === inProgressFiles.length,
            isUploadInProgress: inProgressFiles.length > 0,
            isSomeGhost: files.some((file) => file.isGhost),
        };
    }
    #informAndEmit(errors) {
        for (const error of errors) {
            if (error.isRestriction) {
                this.emit('restriction-failed', error.file, error);
            }
            else {
                this.emit('error', error, error.file);
            }
            this.log(error, 'warning');
        }
        const userFacingErrors = errors.filter((error) => error.isUserFacing);
        // don't flood the user: only show the first 4 toasts
        const maxNumToShow = 4;
        const firstErrors = userFacingErrors.slice(0, maxNumToShow);
        const additionalErrors = userFacingErrors.slice(maxNumToShow);
        firstErrors.forEach(({ message, details = '' }) => {
            this.info({ message, details }, 'error', this.opts.infoTimeout);
        });
        if (additionalErrors.length > 0) {
            this.info({
                message: this.i18n('additionalRestrictionsFailed', {
                    count: additionalErrors.length,
                }),
            });
        }
    }
    validateRestrictions(file, files = this.getFiles()) {
        try {
            this.#restricter.validate(files, [file]);
        }
        catch (err) {
            return err;
        }
        return null;
    }
    validateSingleFile(file) {
        try {
            this.#restricter.validateSingleFile(file);
        }
        catch (err) {
            return err.message;
        }
        return null;
    }
    validateAggregateRestrictions(files) {
        const existingFiles = this.getFiles();
        try {
            this.#restricter.validateAggregateRestrictions(existingFiles, files);
        }
        catch (err) {
            return err.message;
        }
        return null;
    }
    #checkRequiredMetaFieldsOnFile(file) {
        const { missingFields, error } = this.#restricter.getMissingRequiredMetaFields(file);
        if (missingFields.length > 0) {
            this.setFileState(file.id, {
                missingRequiredMetaFields: missingFields,
                error: error.message,
            });
            this.log(error.message);
            this.emit('restriction-failed', file, error);
            return false;
        }
        if (missingFields.length === 0 && file.missingRequiredMetaFields) {
            this.setFileState(file.id, {
                missingRequiredMetaFields: [],
            });
        }
        return true;
    }
    #checkRequiredMetaFields(files) {
        let success = true;
        for (const file of Object.values(files)) {
            if (!this.#checkRequiredMetaFieldsOnFile(file)) {
                success = false;
            }
        }
        return success;
    }
    #assertNewUploadAllowed(file) {
        const { allowNewUpload } = this.getState();
        if (allowNewUpload === false) {
            const error = new RestrictionError(this.i18n('noMoreFilesAllowed'), {
                file,
            });
            this.#informAndEmit([error]);
            throw error;
        }
    }
    checkIfFileAlreadyExists(fileID) {
        const { files } = this.getState();
        if (files[fileID] && !files[fileID].isGhost) {
            return true;
        }
        return false;
    }
    /**
     * Create a file state object based on user-provided `addFile()` options.
     */
    #transformFile(fileDescriptorOrFile) {
        // Uppy expects files in { name, type, size, data } format.
        // If the actual File object is passed from input[type=file] or drag-drop,
        // we normalize it to match Uppy file object
        const file = (fileDescriptorOrFile instanceof File
            ? {
                name: fileDescriptorOrFile.name,
                type: fileDescriptorOrFile.type,
                size: fileDescriptorOrFile.size,
                data: fileDescriptorOrFile,
            }
            : fileDescriptorOrFile);
        const fileType = getFileType(file);
        const fileName = getFileName(fileType, file);
        const fileExtension = getFileNameAndExtension(fileName).extension;
        const id = getSafeFileId(file, this.getID());
        const meta = file.meta || {};
        meta.name = fileName;
        meta.type = fileType;
        // `null` means the size is unknown.
        const size = Number.isFinite(file.data.size)
            ? file.data.size
            : null;
        return {
            source: file.source || '',
            id,
            name: fileName,
            extension: fileExtension || '',
            meta: {
                ...this.getState().meta,
                ...meta,
            },
            type: fileType,
            data: file.data,
            progress: {
                percentage: 0,
                bytesUploaded: false,
                bytesTotal: size,
                uploadComplete: false,
                uploadStarted: null,
            },
            size,
            isGhost: false,
            isRemote: file.isRemote || false,
            remote: file.remote,
            preview: file.preview,
        };
    }
    // Schedule an upload if `autoProceed` is enabled.
    #startIfAutoProceed() {
        if (this.opts.autoProceed && !this.scheduledAutoProceed) {
            this.scheduledAutoProceed = setTimeout(() => {
                this.scheduledAutoProceed = null;
                this.upload().catch((err) => {
                    if (!err.isRestriction) {
                        this.log(err.stack || err.message || err);
                    }
                });
            }, 4);
        }
    }
    #checkAndUpdateFileState(filesToAdd) {
        let { files: existingFiles } = this.getState();
        // create a copy of the files object only once
        let nextFilesState = { ...existingFiles };
        const validFilesToAdd = [];
        const errors = [];
        for (const fileToAdd of filesToAdd) {
            try {
                let newFile = this.#transformFile(fileToAdd);
                // If a file has been recovered (Golden Retriever), but we were unable to recover its data (probably too large),
                // users are asked to re-select these half-recovered files and then this method will be called again.
                // In order to keep the progress, meta and everything else, we keep the existing file,
                // but we replace `data`, and we remove `isGhost`, because the file is no longer a ghost now
                const isGhost = existingFiles[newFile.id]?.isGhost;
                if (isGhost) {
                    const existingFileState = existingFiles[newFile.id];
                    newFile = {
                        ...existingFileState,
                        isGhost: false,
                        data: fileToAdd.data,
                    };
                    this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
                }
                const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, nextFilesState);
                // update state after onBeforeFileAdded
                existingFiles = this.getState().files;
                nextFilesState = { ...existingFiles, ...nextFilesState };
                if (!onBeforeFileAddedResult &&
                    this.checkIfFileAlreadyExists(newFile.id)) {
                    throw new RestrictionError(this.i18n('noDuplicates', {
                        fileName: newFile.name ?? this.i18n('unnamed'),
                    }), { file: fileToAdd });
                }
                // Pass through reselected files from Golden Retriever
                if (onBeforeFileAddedResult === false && !isGhost) {
                    // Don’t show UI info for this error, as it should be done by the developer
                    throw new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.', { isUserFacing: false, file: fileToAdd });
                }
                else if (typeof onBeforeFileAddedResult === 'object' &&
                    onBeforeFileAddedResult !== null) {
                    newFile = onBeforeFileAddedResult;
                }
                this.#restricter.validateSingleFile(newFile);
                // need to add it to the new local state immediately, so we can use the state to validate the next files too
                nextFilesState[newFile.id] = newFile;
                validFilesToAdd.push(newFile);
            }
            catch (err) {
                errors.push(err);
            }
        }
        try {
            // need to run this separately because it's much more slow, so if we run it inside the for-loop it will be very slow
            // when many files are added
            this.#restricter.validateAggregateRestrictions(Object.values(existingFiles), validFilesToAdd);
        }
        catch (err) {
            errors.push(err);
            // If we have any aggregate error, don't allow adding this batch
            return {
                nextFilesState: existingFiles,
                validFilesToAdd: [],
                errors,
            };
        }
        return {
            nextFilesState,
            validFilesToAdd,
            errors,
        };
    }
    /**
     * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
     * try to guess file type in a clever way, check file against restrictions,
     * and start an upload if `autoProceed === true`.
     */
    addFile(file) {
        this.#assertNewUploadAllowed(file);
        const { nextFilesState, validFilesToAdd, errors } = this.#checkAndUpdateFileState([file]);
        const restrictionErrors = errors.filter((error) => error.isRestriction);
        this.#informAndEmit(restrictionErrors);
        if (errors.length > 0)
            throw errors[0];
        this.setState({ files: nextFilesState });
        const [firstValidFileToAdd] = validFilesToAdd;
        this.emit('file-added', firstValidFileToAdd);
        this.emit('files-added', validFilesToAdd);
        this.log(`Added file: ${firstValidFileToAdd.name}, ${firstValidFileToAdd.id}, mime type: ${firstValidFileToAdd.type}`);
        this.#startIfAutoProceed();
        return firstValidFileToAdd.id;
    }
    /**
     * Add multiple files to `state.files`. See the `addFile()` documentation.
     *
     * If an error occurs while adding a file, it is logged and the user is notified.
     * This is good for UI plugins, but not for programmatic use.
     * Programmatic users should usually still use `addFile()` on individual files.
     */
    addFiles(fileDescriptors) {
        this.#assertNewUploadAllowed();
        const { nextFilesState, validFilesToAdd, errors } = this.#checkAndUpdateFileState(fileDescriptors);
        const restrictionErrors = errors.filter((error) => error.isRestriction);
        this.#informAndEmit(restrictionErrors);
        const nonRestrictionErrors = errors.filter((error) => !error.isRestriction);
        if (nonRestrictionErrors.length > 0) {
            let message = 'Multiple errors occurred while adding files:\n';
            nonRestrictionErrors.forEach((subError) => {
                message += `\n * ${subError.message}`;
            });
            this.info({
                message: this.i18n('addBulkFilesFailed', {
                    smart_count: nonRestrictionErrors.length,
                }),
                details: message,
            }, 'error', this.opts.infoTimeout);
            if (typeof AggregateError === 'function') {
                throw new AggregateError(nonRestrictionErrors, message);
            }
            else {
                const err = new Error(message);
                // @ts-expect-error fallback when AggregateError is not available
                err.errors = nonRestrictionErrors;
                throw err;
            }
        }
        // OK, we haven't thrown an error, we can start updating state and emitting events now:
        this.setState({ files: nextFilesState });
        validFilesToAdd.forEach((file) => {
            this.emit('file-added', file);
        });
        this.emit('files-added', validFilesToAdd);
        if (validFilesToAdd.length > 5) {
            this.log(`Added batch of ${validFilesToAdd.length} files`);
        }
        else {
            Object.values(validFilesToAdd).forEach((file) => {
                this.log(`Added file: ${file.name}\n id: ${file.id}\n type: ${file.type}`);
            });
        }
        if (validFilesToAdd.length > 0) {
            this.#startIfAutoProceed();
        }
    }
    removeFiles(fileIDs) {
        const { files, currentUploads } = this.getState();
        const updatedFiles = { ...files };
        const updatedUploads = { ...currentUploads };
        const removedFiles = Object.create(null);
        fileIDs.forEach((fileID) => {
            if (files[fileID]) {
                removedFiles[fileID] = files[fileID];
                delete updatedFiles[fileID];
            }
        });
        // Remove files from the `fileIDs` list in each upload.
        function fileIsNotRemoved(uploadFileID) {
            return removedFiles[uploadFileID] === undefined;
        }
        Object.keys(updatedUploads).forEach((uploadID) => {
            const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved);
            // Remove the upload if no files are associated with it anymore.
            if (newFileIDs.length === 0) {
                delete updatedUploads[uploadID];
                return;
            }
            const { capabilities } = this.getState();
            if (newFileIDs.length !== currentUploads[uploadID].fileIDs.length &&
                !capabilities.individualCancellation) {
                throw new Error('The installed uploader plugin does not allow removing files during an upload.');
            }
            updatedUploads[uploadID] = {
                ...currentUploads[uploadID],
                fileIDs: newFileIDs,
            };
        });
        const stateUpdate = {
            currentUploads: updatedUploads,
            files: updatedFiles,
        };
        // If all files were removed - allow new uploads,
        // and clear recoveredState
        if (Object.keys(updatedFiles).length === 0) {
            stateUpdate.allowNewUpload = true;
            stateUpdate.error = null;
            stateUpdate.recoveredState = null;
        }
        this.setState(stateUpdate);
        this.#updateTotalProgressThrottled();
        const removedFileIDs = Object.keys(removedFiles);
        removedFileIDs.forEach((fileID) => {
            this.emit('file-removed', removedFiles[fileID]);
        });
        if (removedFileIDs.length > 5) {
            this.log(`Removed ${removedFileIDs.length} files`);
        }
        else {
            this.log(`Removed files: ${removedFileIDs.join(', ')}`);
        }
    }
    removeFile(fileID) {
        this.removeFiles([fileID]);
    }
    pauseResume(fileID) {
        if (!this.getState().capabilities.resumableUploads ||
            this.getFile(fileID).progress.uploadComplete) {
            return undefined;
        }
        const file = this.getFile(fileID);
        const wasPaused = file.isPaused || false;
        const isPaused = !wasPaused;
        this.setFileState(fileID, {
            isPaused,
        });
        this.emit('upload-pause', file, isPaused);
        return isPaused;
    }
    pauseAll() {
        const updatedFiles = { ...this.getState().files };
        const inProgressUpdatedFiles = Object.keys(updatedFiles).filter((file) => {
            return (!updatedFiles[file].progress.uploadComplete &&
                updatedFiles[file].progress.uploadStarted);
        });
        inProgressUpdatedFiles.forEach((file) => {
            const updatedFile = { ...updatedFiles[file], isPaused: true };
            updatedFiles[file] = updatedFile;
        });
        this.setState({ files: updatedFiles });
        this.emit('pause-all');
    }
    resumeAll() {
        const updatedFiles = { ...this.getState().files };
        const inProgressUpdatedFiles = Object.keys(updatedFiles).filter((file) => {
            return (!updatedFiles[file].progress.uploadComplete &&
                updatedFiles[file].progress.uploadStarted);
        });
        inProgressUpdatedFiles.forEach((file) => {
            const updatedFile = {
                ...updatedFiles[file],
                isPaused: false,
                error: null,
            };
            updatedFiles[file] = updatedFile;
        });
        this.setState({ files: updatedFiles });
        this.emit('resume-all');
    }
    #getFilesToRetry() {
        const { files } = this.getState();
        return Object.keys(files).filter((fileId) => {
            const file = files[fileId];
            // Only retry files that have errors AND don't have missing required metadata
            return (file.error &&
                (!file.missingRequiredMetaFields ||
                    file.missingRequiredMetaFields.length === 0));
        });
    }
    async #doRetryAll() {
        const filesToRetry = this.#getFilesToRetry();
        const updatedFiles = { ...this.getState().files };
        filesToRetry.forEach((fileID) => {
            updatedFiles[fileID] = {
                ...updatedFiles[fileID],
                isPaused: false,
                error: null,
            };
        });
        this.setState({
            files: updatedFiles,
            error: null,
        });
        this.emit('retry-all', this.getFilesByIds(filesToRetry));
        if (filesToRetry.length === 0) {
            return {
                successful: [],
                failed: [],
            };
        }
        const uploadID = this.#createUpload(filesToRetry, {
            forceAllowNewUpload: true, // create new upload even if allowNewUpload: false
        });
        return this.#runUpload(uploadID);
    }
    async retryAll() {
        const result = await this.#doRetryAll();
        this.emit('complete', result);
        return result;
    }
    cancelAll() {
        this.emit('cancel-all');
        const { files } = this.getState();
        const fileIDs = Object.keys(files);
        if (fileIDs.length) {
            this.removeFiles(fileIDs);
        }
        this.setState(defaultUploadState);
    }
    retryUpload(fileID) {
        this.setFileState(fileID, {
            error: null,
            isPaused: false,
        });
        this.emit('upload-retry', this.getFile(fileID));
        const uploadID = this.#createUpload([fileID], {
            forceAllowNewUpload: true, // create new upload even if allowNewUpload: false
        });
        return this.#runUpload(uploadID);
    }
    logout() {
        this.iteratePlugins((plugin) => {
            ;
            plugin.provider?.logout?.();
        });
    }
    #handleUploadProgress = (file, progress) => {
        const fileInState = file ? this.getFile(file.id) : undefined;
        if (file == null || !fileInState) {
            this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
            return;
        }
        if (fileInState.progress.percentage === 100) {
            this.log(`Not setting progress for a file that has been already uploaded: ${file.id}`);
            return;
        }
        const newProgress = {
            bytesTotal: progress.bytesTotal,
            // bytesTotal may be null or zero; in that case we can't divide by it
            percentage: progress.bytesTotal != null &&
                Number.isFinite(progress.bytesTotal) &&
                progress.bytesTotal > 0
                ? Math.round((progress.bytesUploaded / progress.bytesTotal) * 100)
                : undefined,
        };
        if (fileInState.progress.uploadStarted != null) {
            this.setFileState(file.id, {
                progress: {
                    ...fileInState.progress,
                    ...newProgress,
                    bytesUploaded: progress.bytesUploaded,
                },
            });
        }
        else {
            this.setFileState(file.id, {
                progress: {
                    ...fileInState.progress,
                    ...newProgress,
                },
            });
        }
        this.#updateTotalProgressThrottled();
    };
    #updateTotalProgress() {
        const totalProgress = this.#calculateTotalProgress();
        let totalProgressPercent = null;
        if (totalProgress != null) {
            totalProgressPercent = Math.round(totalProgress * 100);
            if (totalProgressPercent > 100)
                totalProgressPercent = 100;
            else if (totalProgressPercent < 0)
                totalProgressPercent = 0;
        }
        this.emit('progress', totalProgressPercent ?? 0);
        this.setState({
            totalProgress: totalProgressPercent ?? 0,
        });
    }
    // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.
    #updateTotalProgressThrottled = throttle(() => this.#updateTotalProgress(), 500, { leading: true, trailing: true });
    [Symbol.for('uppy test: updateTotalProgress')]() {
        return this.#updateTotalProgress();
    }
    #calculateTotalProgress() {
        // calculate total progress, using the number of files currently uploading,
        // between 0 and 1 and sum of individual progress of each file
        const files = this.getFiles();
        // note: also includes files that have completed uploading:
        const filesInProgress = files.filter((file) => {
            return (file.progress.uploadStarted ||
                file.progress.preprocess ||
                file.progress.postprocess);
        });
        if (filesInProgress.length === 0) {
            return 0;
        }
        if (filesInProgress.every((file) => file.progress.uploadComplete)) {
            // If every uploading file is complete, and we're still getting progress, it probably means
            // there's a bug somewhere in some progress reporting code (maybe not even our code)
            // and we're still getting progress, so let's just assume it means a 100% progress
            return 1;
        }
        const isSizedFile = (file) => file.progress.bytesTotal != null && file.progress.bytesTotal !== 0;
        const sizedFilesInProgress = filesInProgress.filter(isSizedFile);
        const unsizedFilesInProgress = filesInProgress.filter((file) => !isSizedFile(file));
        if (sizedFilesInProgress.every((file) => file.progress.uploadComplete) &&
            unsizedFilesInProgress.length > 0 &&
            !unsizedFilesInProgress.every((file) => file.progress.uploadComplete)) {
            // we are done with uploading all files of known size, however
            // there is at least one file with unknown size still uploading,
            // and we cannot say anything about their progress
            // In any case, return null because it doesn't make any sense to show a progress
            return null;
        }
        const totalFilesSize = sizedFilesInProgress.reduce((acc, file) => acc + (file.progress.bytesTotal ?? 0), 0);
        const totalUploadedSize = sizedFilesInProgress.reduce((acc, file) => acc + (file.progress.bytesUploaded || 0), 0);
        return totalFilesSize === 0 ? 0 : totalUploadedSize / totalFilesSize;
    }
    /**
     * Registers listeners for all global actions, like:
     * `error`, `file-removed`, `upload-progress`
     */
    #addListeners() {
        // Type inference only works for inline functions so we have to type it again
        const errorHandler = (error, file, response) => {
            let errorMsg = error.message || 'Unknown error';
            if (error.details) {
                errorMsg += ` ${error.details}`;
            }
            this.setState({ error: errorMsg });
            if (file != null && file.id in this.getState().files) {
                this.setFileState(file.id, {
                    error: errorMsg,
                    response,
                });
            }
        };
        this.on('error', errorHandler);
        this.on('upload-error', (file, error, response) => {
            errorHandler(error, file, response);
            if (typeof error === 'object' && error.message) {
                this.log(error.message, 'error');
                const newError = new Error(this.i18n('failedToUpload', { file: file?.name ?? '' })); // we may want a new custom error here
                newError.isUserFacing = true; // todo maybe don't do this with all errors?
                newError.details = error.message;
                if (error.details) {
                    newError.details += ` ${error.details}`;
                }
                this.#informAndEmit([newError]);
            }
            else {
                this.#informAndEmit([error]);
            }
        });
        let uploadStalledWarningRecentlyEmitted = null;
        this.on('upload-stalled', (error, files) => {
            const { message } = error;
            const details = files.map((file) => file.meta.name).join(', ');
            if (!uploadStalledWarningRecentlyEmitted) {
                this.info({ message, details }, 'warning', this.opts.infoTimeout);
                uploadStalledWarningRecentlyEmitted = setTimeout(() => {
                    uploadStalledWarningRecentlyEmitted = null;
                }, this.opts.infoTimeout);
            }
            this.log(`${message} ${details}`.trim(), 'warning');
        });
        this.on('upload', () => {
            this.setState({ error: null });
        });
        const onUploadStarted = (files) => {
            const filesFiltered = files.filter((file) => {
                const exists = file != null && this.getFile(file.id);
                if (!exists)
                    this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return exists;
            });
            const filesState = Object.fromEntries(filesFiltered.map((file) => [
                file.id,
                {
                    progress: {
                        uploadStarted: Date.now(),
                        uploadComplete: false,
                        bytesUploaded: 0,
                        bytesTotal: file.size,
                    },
                },
            ]));
            this.patchFilesState(filesState);
        };
        this.on('upload-start', onUploadStarted);
        this.on('upload-progress', this.#handleUploadProgress);
        this.on('upload-success', (file, uploadResp) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            const currentProgress = this.getFile(file.id).progress;
            this.setFileState(file.id, {
                progress: {
                    ...currentProgress,
                    postprocess: this.#postProcessors.size > 0
                        ? {
                            mode: 'indeterminate',
                        }
                        : undefined,
                    uploadComplete: true,
                    percentage: 100,
                    bytesUploaded: currentProgress.bytesTotal,
                },
                response: uploadResp,
                uploadURL: uploadResp.uploadURL,
                isPaused: false,
            });
            // Remote providers sometimes don't tell us the file size,
            // but we can know how many bytes we uploaded once the upload is complete.
            if (file.size == null) {
                this.setFileState(file.id, {
                    size: uploadResp.bytesUploaded || currentProgress.bytesTotal,
                });
            }
            this.#updateTotalProgressThrottled();
        });
        this.on('preprocess-progress', (file, progress) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            this.setFileState(file.id, {
                progress: { ...this.getFile(file.id).progress, preprocess: progress },
            });
        });
        this.on('preprocess-complete', (file) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            const files = { ...this.getState().files };
            files[file.id] = {
                ...files[file.id],
                progress: { ...files[file.id].progress },
            };
            delete files[file.id].progress.preprocess;
            this.setState({ files });
        });
        this.on('postprocess-progress', (file, progress) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            this.setFileState(file.id, {
                progress: {
                    ...this.getState().files[file.id].progress,
                    postprocess: progress,
                },
            });
        });
        this.on('postprocess-complete', (file) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            const files = {
                ...this.getState().files,
            };
            files[file.id] = {
                ...files[file.id],
                progress: {
                    ...files[file.id].progress,
                },
            };
            delete files[file.id].progress.postprocess;
            this.setState({ files });
        });
        this.on('restored', () => {
            // Files may have changed--ensure progress is still accurate.
            this.#updateTotalProgressThrottled();
        });
        // @ts-expect-error should fix itself when dashboard it typed (also this doesn't belong here)
        this.on('dashboard:file-edit-complete', (file) => {
            if (file) {
                this.#checkRequiredMetaFieldsOnFile(file);
            }
        });
        // show informer if offline
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('online', this.#updateOnlineStatus);
            window.addEventListener('offline', this.#updateOnlineStatus);
            setTimeout(this.#updateOnlineStatus, 3000);
        }
    }
    updateOnlineStatus() {
        const online = window.navigator.onLine ?? true;
        if (!online) {
            this.emit('is-offline');
            this.info(this.i18n('noInternetConnection'), 'error', 0);
            this.wasOffline = true;
        }
        else {
            this.emit('is-online');
            if (this.wasOffline) {
                this.emit('back-online');
                this.info(this.i18n('connectedToInternet'), 'success', 3000);
                this.wasOffline = false;
            }
        }
    }
    #updateOnlineStatus = this.updateOnlineStatus.bind(this);
    getID() {
        return this.opts.id;
    }
    /**
     * Registers a plugin with Core.
     */
    use(Plugin, 
    // We want to let the plugin decide whether `opts` is optional or not
    // so we spread the argument rather than defining `opts:` ourselves.
    ...args) {
        if (typeof Plugin !== 'function') {
            const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` +
                ' Please verify that the plugin was imported and spelled correctly.';
            throw new TypeError(msg);
        }
        // Instantiate
        const plugin = new Plugin(this, ...args);
        const pluginId = plugin.id;
        if (!pluginId) {
            throw new Error('Your plugin must have an id');
        }
        if (!plugin.type) {
            throw new Error('Your plugin must have a type');
        }
        const existsPluginAlready = this.getPlugin(pluginId);
        if (existsPluginAlready) {
            const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` +
                `Tried to use: '${pluginId}'.\n` +
                'Uppy plugins must have unique `id` options.';
            throw new Error(msg);
        }
        // @ts-expect-error does exist
        if (Plugin.VERSION) {
            // @ts-expect-error does exist
            this.log(`Using ${pluginId} v${Plugin.VERSION}`);
        }
        if (plugin.type in this.#plugins) {
            this.#plugins[plugin.type].push(plugin);
        }
        else {
            this.#plugins[plugin.type] = [plugin];
        }
        plugin.install();
        this.emit('plugin-added', plugin);
        return this;
    }
    /**
     * Find one Plugin by name.
     */
    getPlugin(id) {
        for (const plugins of Object.values(this.#plugins)) {
            const foundPlugin = plugins.find((plugin) => plugin.id === id);
            if (foundPlugin != null)
                return foundPlugin;
        }
        return undefined;
    }
    [Symbol.for('uppy test: getPlugins')](type) {
        return this.#plugins[type];
    }
    /**
     * Iterate through all `use`d plugins.
     *
     */
    iteratePlugins(method) {
        Object.values(this.#plugins).flat(1).forEach(method);
    }
    /**
     * Uninstall and remove a plugin.
     *
     * @param {object} instance The plugin instance to remove.
     */
    removePlugin(instance) {
        this.log(`Removing plugin ${instance.id}`);
        this.emit('plugin-remove', instance);
        if (instance.uninstall) {
            instance.uninstall();
        }
        const list = this.#plugins[instance.type];
        // list.indexOf failed here, because Vue3 converted the plugin instance
        // to a Proxy object, which failed the strict comparison test:
        // obj !== objProxy
        const index = list.findIndex((item) => item.id === instance.id);
        if (index !== -1) {
            list.splice(index, 1);
        }
        const state = this.getState();
        const updatedState = {
            plugins: {
                ...state.plugins,
                [instance.id]: undefined,
            },
        };
        this.setState(updatedState);
    }
    /**
     * Uninstall all plugins and close down this Uppy instance.
     */
    destroy() {
        this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
        this.cancelAll();
        this.#storeUnsubscribe();
        this.iteratePlugins((plugin) => {
            this.removePlugin(plugin);
        });
        if (typeof window !== 'undefined' && window.removeEventListener) {
            window.removeEventListener('online', this.#updateOnlineStatus);
            window.removeEventListener('offline', this.#updateOnlineStatus);
        }
    }
    hideInfo() {
        const { info } = this.getState();
        this.setState({ info: info.slice(1) });
        this.emit('info-hidden');
    }
    /**
     * Set info message in `state.info`, so that UI plugins like `Informer`
     * can display the message.
     */
    info(message, type = 'info', duration = 3000) {
        const isComplexMessage = typeof message === 'object';
        this.setState({
            info: [
                ...this.getState().info,
                {
                    type,
                    message: isComplexMessage ? message.message : message,
                    details: isComplexMessage ? message.details : null,
                },
            ],
        });
        setTimeout(() => this.hideInfo(), duration);
        this.emit('info-visible');
    }
    /**
     * Passes messages to a function, provided in `opts.logger`.
     * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
     */
    log(message, type) {
        const { logger } = this.opts;
        switch (type) {
            case 'error':
                logger.error(message);
                break;
            case 'warning':
                logger.warn(message);
                break;
            default:
                logger.debug(message);
                break;
        }
    }
    // We need to store request clients by a unique ID, so we can share RequestClient instances across files
    // this allows us to do rate limiting and synchronous operations like refreshing provider tokens
    // example: refreshing tokens: if each file has their own requestclient,
    // we don't have any way to synchronize all requests in order to
    // - block all requests
    // - refresh the token
    // - unblock all requests and allow them to run with a the new access token
    // back when we had a requestclient per file, once an access token expired,
    // all 6 files would go ahead and refresh the token at the same time
    // (calling /refresh-token up to 6 times), which will probably fail for some providers
    #requestClientById = new Map();
    registerRequestClient(id, client) {
        this.#requestClientById.set(id, client);
    }
    /** @protected */
    getRequestClientForFile(file) {
        if (!file.remote)
            throw new Error(`Tried to get RequestClient for a non-remote file ${file.id}`);
        const requestClient = this.#requestClientById.get(file.remote.requestClientId);
        if (requestClient == null)
            throw new Error(`requestClientId "${file.remote.requestClientId}" not registered for file "${file.id}"`);
        return requestClient;
    }
    /**
     * Restore an upload by its ID.
     */
    restore(uploadID) {
        this.log(`Core: attempting to restore upload "${uploadID}"`);
        if (!this.getState().currentUploads[uploadID]) {
            this.#removeUpload(uploadID);
            return Promise.reject(new Error('Nonexistent upload'));
        }
        return this.#runUpload(uploadID);
    }
    /**
     * Create an upload for a bunch of files.
     *
     */
    #createUpload(fileIDs, opts = {}) {
        // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
        const { forceAllowNewUpload = false } = opts;
        const { allowNewUpload, currentUploads } = this.getState();
        if (!allowNewUpload && !forceAllowNewUpload) {
            throw new Error('Cannot create a new upload: already uploading.');
        }
        const uploadID = nanoid();
        this.emit('upload', uploadID, this.getFilesByIds(fileIDs));
        this.setState({
            allowNewUpload: this.opts.allowMultipleUploadBatches !== false &&
                this.opts.allowMultipleUploads !== false,
            currentUploads: {
                ...currentUploads,
                [uploadID]: {
                    fileIDs,
                    step: 0,
                    result: {},
                },
            },
        });
        return uploadID;
    }
    [Symbol.for('uppy test: createUpload')](...args) {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/47595
        return this.#createUpload(...args);
    }
    #getUpload(uploadID) {
        const { currentUploads } = this.getState();
        return currentUploads[uploadID];
    }
    /**
     * Add data to an upload's result object.
     */
    addResultData(uploadID, data) {
        if (!this.#getUpload(uploadID)) {
            this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
            return;
        }
        const { currentUploads } = this.getState();
        const currentUpload = {
            ...currentUploads[uploadID],
            result: { ...currentUploads[uploadID].result, ...data },
        };
        this.setState({
            currentUploads: { ...currentUploads, [uploadID]: currentUpload },
        });
    }
    /**
     * Remove an upload, eg. if it has been canceled or completed.
     *
     */
    #removeUpload(uploadID) {
        const currentUploads = { ...this.getState().currentUploads };
        delete currentUploads[uploadID];
        this.setState({
            currentUploads,
        });
    }
    /**
     * Run an upload. This picks up where it left off in case the upload is being restored.
     */
    async #runUpload(uploadID) {
        const getCurrentUpload = () => {
            const { currentUploads } = this.getState();
            return currentUploads[uploadID];
        };
        let currentUpload = getCurrentUpload();
        const steps = [
            ...this.#preProcessors,
            ...this.#uploaders,
            ...this.#postProcessors,
        ];
        try {
            for (let step = currentUpload.step || 0; step < steps.length; step++) {
                if (!currentUpload) {
                    break;
                }
                const fn = steps[step];
                this.setState({
                    currentUploads: {
                        ...this.getState().currentUploads,
                        [uploadID]: {
                            ...currentUpload,
                            step,
                        },
                    },
                });
                const { fileIDs } = currentUpload;
                // TODO give this the `updatedUpload` object as its only parameter maybe?
                // Otherwise when more metadata may be added to the upload this would keep getting more parameters
                await fn(fileIDs, uploadID);
                // Update currentUpload value in case it was modified asynchronously.
                currentUpload = getCurrentUpload();
            }
        }
        catch (err) {
            this.#removeUpload(uploadID);
            throw err;
        }
        // Set result data.
        if (currentUpload) {
            // Mark postprocessing step as complete if necessary; this addresses a case where we might get
            // stuck in the postprocessing UI while the upload is fully complete.
            // If the postprocessing steps do not do any work, they may not emit postprocessing events at
            // all, and never mark the postprocessing as complete. This is fine on its own but we
            // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
            // state if any postprocessors are registered. That is to avoid a "flash of completed state"
            // before the postprocessing plugins can emit events.
            //
            // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
            // postprocessing completion, we do it instead.
            currentUpload.fileIDs.forEach((fileID) => {
                const file = this.getFile(fileID);
                if (file?.progress.postprocess) {
                    this.emit('postprocess-complete', file);
                }
            });
            const files = currentUpload.fileIDs.map((fileID) => this.getFile(fileID));
            const successful = files.filter((file) => !file.error);
            const failed = files.filter((file) => file.error);
            this.addResultData(uploadID, { successful, failed, uploadID });
            // Update currentUpload value in case it was modified asynchronously.
            currentUpload = getCurrentUpload();
        }
        // Emit completion events.
        // This is in a separate function so that the `currentUploads` variable
        // always refers to the latest state. In the handler right above it refers
        // to an outdated object without the `.result` property.
        let result;
        if (currentUpload) {
            result = currentUpload.result;
            this.#removeUpload(uploadID);
        }
        if (result == null) {
            this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
            result = {
                successful: [],
                failed: [],
                uploadID,
            };
        }
        return result;
    }
    /**
     * Start an upload for all the files that are not currently being uploaded.
     */
    async upload() {
        if (!this.#plugins.uploader?.length) {
            this.log('No uploader type plugins are used', 'warning');
        }
        let { files } = this.getState();
        // retry any failed files from a previous upload() call
        const filesToRetry = this.#getFilesToRetry();
        if (filesToRetry.length > 0) {
            const retryResult = await this.#doRetryAll(); // we don't want the complete event to fire
            const hasNewFiles = this.getFiles().filter((file) => file.progress.uploadStarted == null)
                .length > 0;
            // if no new files, make it idempotent and return
            if (!hasNewFiles) {
                this.emit('complete', retryResult);
                return retryResult;
            }
            // reload files which might have  changed after retry
            ;
            ({ files } = this.getState());
        }
        // If no files to retry, proceed with original upload() behavior for new files
        const onBeforeUploadResult = this.opts.onBeforeUpload(files);
        if (onBeforeUploadResult === false) {
            return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
        }
        if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
            files = onBeforeUploadResult;
            // Updating files in state, because uploader plugins receive file IDs,
            // and then fetch the actual file object from state
            this.setState({
                files,
            });
        }
        return Promise.resolve()
            .then(() => this.#restricter.validateMinNumberOfFiles(files))
            .catch((err) => {
            this.#informAndEmit([err]);
            throw err;
        })
            .then(() => {
            if (!this.#checkRequiredMetaFields(files)) {
                throw new RestrictionError(this.i18n('missingRequiredMetaField'));
            }
        })
            .catch((err) => {
            // Doing this in a separate catch because we already emited and logged
            // all the errors in `checkRequiredMetaFields` so we only throw a generic
            // missing fields error here.
            throw err;
        })
            .then(async () => {
            const { currentUploads } = this.getState();
            // get a list of files that are currently assigned to uploads
            const currentlyUploadingFiles = Object.values(currentUploads).flatMap((curr) => curr.fileIDs);
            const waitingFileIDs = [];
            Object.keys(files).forEach((fileID) => {
                const file = this.getFile(fileID);
                // if the file hasn't started uploading and hasn't already been assigned to an upload..
                if (!file.progress.uploadStarted &&
                    currentlyUploadingFiles.indexOf(fileID) === -1) {
                    waitingFileIDs.push(file.id);
                }
            });
            const uploadID = this.#createUpload(waitingFileIDs);
            const result = await this.#runUpload(uploadID);
            this.emit('complete', result);
            return result;
        })
            .catch((err) => {
            this.emit('error', err);
            this.log(err, 'error');
            throw err;
        });
    }
}
/* harmony default export */ const lib_Uppy = (Uppy);

;// ./node_modules/@uppy/utils/lib/isDOMElement.js
/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 */
function isDOMElement(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    if (!('nodeType' in obj))
        return false;
    return obj.nodeType === Node.ELEMENT_NODE;
}

;// ./node_modules/@uppy/utils/lib/findDOMElement.js

function findDOMElement(element, context = document) {
    if (typeof element === 'string') {
        return context.querySelector(element);
    }
    if (isDOMElement(element)) {
        return element;
    }
    return null;
}
/* harmony default export */ const lib_findDOMElement = (findDOMElement);

;// ./node_modules/@uppy/utils/lib/getTextDirection.js
/**
 * Get the declared text direction for an element.
 */
function getTextDirection(element) {
    // There is another way to determine text direction using getComputedStyle(), as done here:
    // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
    //
    // We do not use that approach because we are interested specifically in the _declared_ text direction.
    // If no text direction is declared, we have to provide our own explicit text direction so our
    // bidirectional CSS style sheets work.
    while (element && !element.dir) {
        element = element.parentNode;
    }
    return element?.dir;
}
/* harmony default export */ const lib_getTextDirection = (getTextDirection);

;// ./node_modules/preact/dist/preact.module.js
var preact_module_n,preact_module_l,preact_module_u,preact_module_t,preact_module_i,preact_module_r,preact_module_o,preact_module_e,preact_module_f,preact_module_c,preact_module_a,preact_module_s,h,preact_module_p,preact_module_v,preact_module_y,preact_module_d={},preact_module_w=[],preact_module_=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,preact_module_g=Array.isArray;function preact_module_m(n,l){for(var u in l)n[u]=l[u];return n}function preact_module_b(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function preact_module_k(l,u,t){var i,r,o,e={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:e[o]=u[o];if(arguments.length>2&&(e.children=arguments.length>3?preact_module_n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===e[o]&&(e[o]=l.defaultProps[o]);return preact_module_x(l,e,i,r,null)}function preact_module_x(n,t,i,r,o){var e={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==o?++preact_module_u:o,__i:-1,__u:0};return null==o&&null!=preact_module_l.vnode&&preact_module_l.vnode(e),e}function M(){return{current:null}}function preact_module_S(n){return n.children}function preact_module_C(n,l){this.props=n,this.context=l}function preact_module_$(n,l){if(null==l)return n.__?preact_module_$(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?preact_module_$(n):null}function I(n){if(n.__P&&n.__d){var u=n.__v,t=u.__e,i=[],r=[],o=preact_module_m({},u);o.__v=u.__v+1,preact_module_l.vnode&&preact_module_l.vnode(o),preact_module_q(n.__P,o,u,n.__n,n.__P.namespaceURI,32&u.__u?[t]:null,i,null==t?preact_module_$(u):t,!!(32&u.__u),r),o.__v=u.__v,o.__.__k[o.__i]=o,D(i,o,r),u.__e=u.__=null,o.__e!=t&&preact_module_P(o)}}function preact_module_P(n){if(null!=(n=n.__)&&null!=n.__c)return n.__e=n.__c.base=null,n.__k.some(function(l){if(null!=l&&null!=l.__e)return n.__e=n.__c.base=l.__e}),preact_module_P(n)}function preact_module_A(n){(!n.__d&&(n.__d=!0)&&preact_module_i.push(n)&&!H.__r++||preact_module_r!=preact_module_l.debounceRendering)&&((preact_module_r=preact_module_l.debounceRendering)||preact_module_o)(H)}function H(){try{for(var n,l=1;preact_module_i.length;)preact_module_i.length>l&&preact_module_i.sort(preact_module_e),n=preact_module_i.shift(),l=preact_module_i.length,I(n)}finally{preact_module_i.length=H.__r=0}}function preact_module_L(n,l,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,_,g=t&&t.__k||preact_module_w,m=l.length;for(f=preact_module_T(u,l,g,f,m),s=0;s<m;s++)null!=(p=u.__k[s])&&(h=-1!=p.__i&&g[p.__i]||preact_module_d,p.__i=s,_=preact_module_q(n,p,h,i,r,o,e,f,c,a),v=p.__e,p.ref&&h.ref!=p.ref&&(h.ref&&J(h.ref,null,p),a.push(p.ref,p.__c||v,p)),null==y&&null!=v&&(y=v),4&p.__u?(f=preact_module_j(p,f,n),h.__e&&(h.__e=null)):"function"==typeof p.type&&void 0!==_?f=_:v&&(f=v.nextSibling),p.__u&=-7);return u.__e=y,f}function preact_module_T(n,l,u,t,i){var r,o,e,f,c,a=u.length,s=a,h=0;for(n.__k=new Array(i),r=0;r<i;r++)null!=(o=l[r])&&"boolean"!=typeof o&&"function"!=typeof o?("string"==typeof o||"number"==typeof o||"bigint"==typeof o||o.constructor==String?o=n.__k[r]=preact_module_x(null,o,null,null,null):preact_module_g(o)?o=n.__k[r]=preact_module_x(preact_module_S,{children:o},null,null,null):void 0===o.constructor&&o.__b>0?o=n.__k[r]=preact_module_x(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):n.__k[r]=o,f=r+h,o.__=n,o.__b=n.__b+1,e=null,-1!=(c=o.__i=preact_module_O(o,u,f,s))&&(s--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>a?h--:i<a&&h++),"function"!=typeof o.type&&(o.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,o.__u|=4))):n.__k[r]=null;if(s)for(r=0;r<a;r++)null!=(e=u[r])&&0==(2&e.__u)&&(e.__e==t&&(t=preact_module_$(e)),K(e,e));return t}function preact_module_j(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=preact_module_j(t[i],l,u));return l}n.__e!=l&&(l&&n.type&&!l.parentNode&&(l=preact_module_$(n)),l=u.insertBefore(n.__e,l||null));do{l=l&&l.nextSibling}while(null!=l&&8==l.nodeType);return l}function preact_module_F(n,l){return l=l||[],null==n||"boolean"==typeof n||(preact_module_g(n)?n.some(function(n){preact_module_F(n,l)}):l.push(n)),l}function preact_module_O(n,l,u,t){var i,r,o,e=n.key,f=n.type,c=l[u],a=null!=c&&0==(2&c.__u);if(null===c&&null==e||a&&e==c.key&&f==c.type)return u;if(t>(a?1:0))for(i=u-1,r=u+1;i>=0||r<l.length;)if(null!=(c=l[o=i>=0?i--:r++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return o;return-1}function preact_module_z(n,l,u){"-"==l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||preact_module_.test(l)?u:u+"px"}function preact_module_N(n,l,u,t,i){var r,o;n:if("style"==l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||preact_module_z(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||preact_module_z(n.style,l,u[l])}else if("o"==l[0]&&"n"==l[1])r=l!=(l=l.replace(preact_module_s,"$1")),o=l.toLowerCase(),l=o in n||"onFocusOut"==l||"onFocusIn"==l?o.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t?u[preact_module_a]=t[preact_module_a]:(u[preact_module_a]=h,n.addEventListener(l,r?preact_module_v:preact_module_p,r)):n.removeEventListener(l,r?preact_module_v:preact_module_p,r);else{if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!=l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u))}}function preact_module_V(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u[preact_module_c])u[preact_module_c]=h++;else if(u[preact_module_c]<t[preact_module_a])return;return t(preact_module_l.event?preact_module_l.event(u):u)}}}function preact_module_q(n,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,d,_,k,x,M,I,P,A,H,T,j,F=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),o=[f=u.__e=t.__e]),(s=preact_module_l.__b)&&s(u);n:if("function"==typeof F){h=e.length;try{if(x=u.props,M=F.prototype&&F.prototype.render,I=(s=F.contextType)&&i[s.__c],P=s?I?I.props.value:s.__:i,t.__c?k=(p=u.__c=t.__c).__=p.__E:(M?u.__c=p=new F(x,P):(u.__c=p=new preact_module_C(x,P),p.constructor=F,p.render=Q),I&&I.sub(p),p.state||(p.state={}),p.__n=i,v=p.__d=!0,p.__h=[],p._sb=[]),M&&null==p.__s&&(p.__s=p.state),M&&null!=F.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=preact_module_m({},p.__s)),preact_module_m(p.__s,F.getDerivedStateFromProps(x,p.__s))),y=p.props,d=p.state,p.__v=u,v)M&&null==F.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),M&&null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(M&&null==F.getDerivedStateFromProps&&x!==y&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(x,P),u.__v==t.__v||!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(x,p.__s,P)){u.__v!=t.__v&&(p.props=x,p.state=p.__s,p.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u)}),preact_module_w.push.apply(p.__h,p._sb),p._sb=[],p.__h.length&&e.push(p),f=preact_module_$(t);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(x,p.__s,P),M&&null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(y,d,_)})}if(p.context=P,p.props=x,p.__P=n,p.__e=!1,A=preact_module_l.__r,H=0,M)p.state=p.__s,p.__d=!1,A&&A(u),s=p.render(p.props,p.state,p.context),preact_module_w.push.apply(p.__h,p._sb),p._sb=[];else do{p.__d=!1,A&&A(u),s=p.render(p.props,p.state,p.context),p.state=p.__s}while(p.__d&&++H<25);p.state=p.__s,null!=p.getChildContext&&(i=preact_module_m(preact_module_m({},i),p.getChildContext())),M&&!v&&null!=p.getSnapshotBeforeUpdate&&(_=p.getSnapshotBeforeUpdate(y,d)),T=null!=s&&s.type===preact_module_S&&null==s.key?preact_module_E(s.props.children):s,f=preact_module_L(n,preact_module_g(T)?T:[T],u,t,i,r,o,e,f,c,a),p.base=u.__e,u.__u&=-161,p.__h.length&&e.push(p),k&&(p.__E=p.__=null)}catch(n){if(e.length=h,u.__v=null,c||null!=o){if(n.then){for(u.__u|=c?160:128;f&&8==f.nodeType&&f.nextSibling;)f=f.nextSibling;null!=o&&(o[o.indexOf(f)]=null),u.__e=f}else if(null!=o)for(j=o.length;j--;)preact_module_b(o[j])}else u.__e=t.__e;null==u.__k&&(u.__k=t.__k||[]),n.then||preact_module_B(u),preact_module_l.__e(n,u,t)}}else null==o&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=G(t.__e,u,t,i,r,o,e,c,a);return(s=preact_module_l.diffed)&&s(u),128&u.__u?void 0:f}function preact_module_B(n){n&&(n.__c&&(n.__c.__e=!0),n.__k&&n.__k.some(preact_module_B))}function D(n,u,t){for(var i=0;i<t.length;i++)J(t[i],t[++i],t[++i]);preact_module_l.__c&&preact_module_l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){preact_module_l.__e(n,u.__v)}})}function preact_module_E(n){return"object"!=typeof n||null==n||n.__b>0?n:preact_module_g(n)?n.map(preact_module_E):void 0!==n.constructor?null:preact_module_m({},n)}function G(u,t,i,r,o,e,f,c,a){var s,h,p,v,y,w,_,m=i.props||preact_module_d,k=t.props,x=t.type;if("svg"==x?o="http://www.w3.org/2000/svg":"math"==x?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=e)for(s=0;s<e.length;s++)if((y=e[s])&&"setAttribute"in y==!!x&&(x?y.localName==x:3==y.nodeType)){u=y,e[s]=null;break}if(null==u){if(null==x)return document.createTextNode(k);u=document.createElementNS(o,x,k.is&&k),c&&(preact_module_l.__m&&preact_module_l.__m(t,e),c=!1),e=null}if(null==x)m===k||c&&u.data==k||(u.data=k);else{if(e="textarea"==x&&null!=k.defaultValue?null:e&&preact_module_n.call(u.childNodes),!c&&null!=e)for(m={},s=0;s<u.attributes.length;s++)m[(y=u.attributes[s]).name]=y.value;for(s in m)y=m[s],"dangerouslySetInnerHTML"==s?p=y:"children"==s||s in k||"value"==s&&"defaultValue"in k||"checked"==s&&"defaultChecked"in k||preact_module_N(u,s,null,y,o);for(s in k)y=k[s],"children"==s?v=y:"dangerouslySetInnerHTML"==s?h=y:"value"==s?w=y:"checked"==s?_=y:c&&"function"!=typeof y||m[s]===y||preact_module_N(u,s,y,m[s],o);if(h)c||p&&(h.__html==p.__html||h.__html==u.innerHTML)||(u.innerHTML=h.__html),t.__k=[];else if(p&&(u.innerHTML=""),preact_module_L("template"==t.type?u.content:u,preact_module_g(v)?v:[v],t,i,r,"foreignObject"==x?"http://www.w3.org/1999/xhtml":o,e,f,e?e[0]:i.__k&&preact_module_$(i,0),c,a),null!=e)for(s=e.length;s--;)preact_module_b(e[s]);c&&"textarea"!=x||(s="value","progress"==x&&null==w?u.removeAttribute("value"):null!=w&&(w!==u[s]||"progress"==x&&!w||"option"==x&&w!=m[s])&&preact_module_N(u,s,w,m[s],o),s="checked",null!=_&&_!=u[s]&&preact_module_N(u,s,_,m[s],o))}return u}function J(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u))}else n.current=u}catch(n){preact_module_l.__e(n,t)}}function K(n,u,t){var i,r;if(preact_module_l.unmount&&preact_module_l.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||J(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){preact_module_l.__e(n,u)}i.base=i.__P=i.__n=null}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&K(i[r],u,t||"function"!=typeof n.type);t||preact_module_b(n.__e),n.__c=n.__=n.__e=void 0}function Q(n,l,u){return this.constructor(n,u)}function preact_module_R(u,t,i){var r,o,e,f;t==document&&(t=document.documentElement),preact_module_l.__&&preact_module_l.__(u,t),o=(r="function"==typeof i)?null:i&&i.__k||t.__k,e=[],f=[],preact_module_q(t,u=(!r&&i||t).__k=preact_module_k(preact_module_S,null,[u]),o||preact_module_d,preact_module_d,t.namespaceURI,!r&&i?[i]:o?null:t.firstChild?preact_module_n.call(t.childNodes):null,e,!r&&i?i:o?o.__e:t.firstChild,r,f),D(e,u,f),u.props.children=null}function preact_module_U(n,l){preact_module_R(n,l,preact_module_U)}function W(l,u,t){var i,r,o,e,f=preact_module_m({},l.props);for(o in l.type&&l.type.defaultProps&&(e=l.type.defaultProps),u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=void 0===u[o]&&null!=e?e[o]:u[o];return arguments.length>2&&(f.children=arguments.length>3?preact_module_n.call(arguments,2):t),preact_module_x(l.type,f,i||l.key,r||l.ref,null)}function X(n){function l(n){var u,t;return this.getChildContext||(u=new Set,(t={})[l.__c]=this,this.getChildContext=function(){return t},this.componentWillUnmount=function(){u=null},this.shouldComponentUpdate=function(n){this.props.value!=n.value&&u.forEach(function(n){n.__e=!0,preact_module_A(n)})},this.sub=function(n){u.add(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u&&u.delete(n),l&&l.call(n)}}),n.children}return l.__c="__cC"+preact_module_y++,l.__=n,l.Provider=l.__l=(l.Consumer=function(n,l){return n.children(l)}).contextType=l,l}preact_module_n=preact_module_w.slice,preact_module_l={__e:function(n,l,u,t){for(var i,r,o;l=l.__;)if((i=l.__c)&&!i.__)try{if((r=i.constructor)&&null!=r.getDerivedStateFromError&&(i.setState(r.getDerivedStateFromError(n)),o=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),o=i.__d),o)return i.__E=i}catch(l){n=l}throw n}},preact_module_u=0,preact_module_t=function(n){return null!=n&&void 0===n.constructor},preact_module_C.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=preact_module_m({},this.state),"function"==typeof n&&(n=n(preact_module_m({},u),this.props)),n&&preact_module_m(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),preact_module_A(this))},preact_module_C.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),preact_module_A(this))},preact_module_C.prototype.render=preact_module_S,preact_module_i=[],preact_module_o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,preact_module_e=function(n,l){return n.__v.__b-l.__v.__b},H.__r=0,preact_module_f=Math.random().toString(8),preact_module_c="__d"+preact_module_f,preact_module_a="__a"+preact_module_f,preact_module_s=/(PointerCapture)$|Capture$/i,h=0,preact_module_p=preact_module_V(!1),preact_module_v=preact_module_V(!0),preact_module_y=0;
//# sourceMappingURL=preact.module.js.map

;// ./node_modules/preact/hooks/dist/hooks.module.js
var hooks_module_t,hooks_module_r,hooks_module_u,hooks_module_i,hooks_module_o=0,hooks_module_f=[],hooks_module_c=preact_module_l,hooks_module_e=hooks_module_c.__b,hooks_module_a=hooks_module_c.__r,hooks_module_v=hooks_module_c.diffed,hooks_module_l=hooks_module_c.__c,hooks_module_m=hooks_module_c.unmount,hooks_module_p=hooks_module_c.__;function hooks_module_s(n,t){hooks_module_c.__h&&hooks_module_c.__h(hooks_module_r,n,hooks_module_o||t),hooks_module_o=0;var u=hooks_module_r.__H||(hooks_module_r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function hooks_module_d(n){return hooks_module_o=1,hooks_module_y(hooks_module_D,n)}function hooks_module_y(n,u,i){var o=hooks_module_s(hooks_module_t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):hooks_module_D(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}))}],o.__c=hooks_module_r,!hooks_module_r.__f)){var f=function(n,t,r){if(!o.__c.__H)return!0;var u=!1,i=o.__c.props!==n;if(o.__c.__H.__.some(function(n){if(n.__N){u=!0;var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0)}}),c){var f=c.call(this,n,t,r);return u?f||i:f}return!u||i};hooks_module_r.__f=!0;var c=hooks_module_r.shouldComponentUpdate,e=hooks_module_r.componentWillUpdate;hooks_module_r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u}e&&e.call(this,n,t,r)},hooks_module_r.shouldComponentUpdate=f}return o.__N||o.__}function hooks_module_h(n,u){var i=hooks_module_s(hooks_module_t++,3);!hooks_module_c.__s&&hooks_module_C(i.__H,u)&&(i.__=n,i.u=u,hooks_module_r.__H.__h.push(i))}function hooks_module_(n,u){var i=hooks_module_s(hooks_module_t++,4);!hooks_module_c.__s&&hooks_module_C(i.__H,u)&&(i.__=n,i.u=u,hooks_module_r.__h.push(i))}function hooks_module_A(n){return hooks_module_o=5,hooks_module_T(function(){return{current:n}},[])}function hooks_module_F(n,t,r){hooks_module_o=6,hooks_module_(function(){if("function"==typeof n){var r=n(t());return function(){n(null),r&&"function"==typeof r&&r()}}if(n)return n.current=t(),function(){return n.current=null}},null==r?r:r.concat(n))}function hooks_module_T(n,r){var u=hooks_module_s(hooks_module_t++,7);return hooks_module_C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function hooks_module_q(n,t){return hooks_module_o=8,hooks_module_T(function(){return n},t)}function hooks_module_x(n){var u=hooks_module_r.context[n.__c],i=hooks_module_s(hooks_module_t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(hooks_module_r)),u.props.value):n.__}function hooks_module_P(n,t){hooks_module_c.useDebugValue&&hooks_module_c.useDebugValue(t?t(n):n)}function hooks_module_b(n){var u=hooks_module_s(hooks_module_t++,10),i=hooks_module_d();return u.__=n,hooks_module_r.componentDidCatch||(hooks_module_r.componentDidCatch=function(n,t){u.__&&u.__(n,t),i[1](n)}),[i[0],function(){i[1](void 0)}]}function hooks_module_g(){var n=hooks_module_s(hooks_module_t++,11);if(!n.__){for(var u=hooks_module_r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++}return n.__}function hooks_module_j(){for(var n;n=hooks_module_f.shift();){var t=n.__H;if(n.__P&&t)try{t.__h.some(hooks_module_z),t.__h.some(hooks_module_B),t.__h=[]}catch(r){t.__h=[],hooks_module_c.__e(r,n.__v)}}}hooks_module_c.__b=function(n){hooks_module_r=null,hooks_module_e&&hooks_module_e(n)},hooks_module_c.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),hooks_module_p&&hooks_module_p(n,t)},hooks_module_c.__r=function(n){hooks_module_a&&hooks_module_a(n),hooks_module_t=0;var i=(hooks_module_r=n.__c).__H;i&&(hooks_module_u===hooks_module_r?(i.__h=[],hooks_module_r.__h=[],i.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(i.__h.some(hooks_module_z),i.__h.some(hooks_module_B),i.__h=[],hooks_module_t=0)),hooks_module_u=hooks_module_r},hooks_module_c.diffed=function(n){hooks_module_v&&hooks_module_v(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==hooks_module_f.push(t)&&hooks_module_i===hooks_module_c.requestAnimationFrame||((hooks_module_i=hooks_module_c.requestAnimationFrame)||hooks_module_w)(hooks_module_j)),t.__H.__.some(function(n){n.u&&(n.__H=n.u,n.u=void 0)})),hooks_module_u=hooks_module_r=null},hooks_module_c.__c=function(n,t){t.some(function(n){try{n.__h.some(hooks_module_z),n.__h=n.__h.filter(function(n){return!n.__||hooks_module_B(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],hooks_module_c.__e(r,n.__v)}}),hooks_module_l&&hooks_module_l(n,t)},hooks_module_c.unmount=function(n){hooks_module_m&&hooks_module_m(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.some(function(n){try{hooks_module_z(n)}catch(n){t=n}}),r.__H=void 0,t&&hooks_module_c.__e(t,r.__v))};var hooks_module_k="function"==typeof requestAnimationFrame;function hooks_module_w(n){var t,r=function(){clearTimeout(u),hooks_module_k&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,35);hooks_module_k&&(t=requestAnimationFrame(r))}function hooks_module_z(n){var t=hooks_module_r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),hooks_module_r=t}function hooks_module_B(n){var t=hooks_module_r;n.__c=n.__(),hooks_module_r=t}function hooks_module_C(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function hooks_module_D(n,t){return"function"==typeof t?t(n):t}
//# sourceMappingURL=hooks.module.js.map

;// ./node_modules/preact/compat/dist/compat.module.js
/* unused harmony import specifier */ var compat_module_t;
/* unused harmony import specifier */ var compat_module_r;
/* unused harmony import specifier */ var compat_module_o;
/* unused harmony import specifier */ var compat_module_i;
/* unused harmony import specifier */ var compat_module_u;
/* unused harmony import specifier */ var compat_module_a;
/* unused harmony import specifier */ var compat_module_e;
/* unused harmony import specifier */ var compat_module_l;
/* unused harmony import specifier */ var compat_module_f;
/* unused harmony import specifier */ var compat_module_n;
/* unused harmony import specifier */ var compat_module_c;
/* unused harmony import specifier */ var compat_module_s;
/* unused harmony import specifier */ var compat_module_h;
/* unused harmony import specifier */ var compat_module_v;
/* unused harmony import specifier */ var compat_module_d;
/* unused harmony import specifier */ var compat_module_m;
/* unused harmony import specifier */ var compat_module_p;
/* unused harmony import specifier */ var compat_module_y;
/* unused harmony import specifier */ var compat_module_;
/* unused harmony import specifier */ var compat_module_b;
/* unused harmony import specifier */ var compat_module_S;
function compat_module_g(n,t){for(var e in t)n[e]=t[e];return n}function compat_module_E(n,t){for(var e in n)if("__source"!==e&&!(e in t))return!0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return!0;return!1}function compat_module_C(n,t){var e=t(),r=compat_module_c({t:{__:e,u:t}}),u=r[0].t,o=r[1];return compat_module_s(function(){u.__=e,u.u=t,compat_module_R(u)&&o({t:u})},[n,e,t]),compat_module_h(function(){return compat_module_R(u)&&o({t:u}),n(function(){compat_module_R(u)&&o({t:u})})},[n]),e}function compat_module_R(n){try{return!((t=n.__)===(e=n.u())&&(0!==t||1/t==1/e)||t!=t&&e!=e)}catch(n){return!0}// removed by dead control flow
 var t, e; }function compat_module_x(n){n()}function compat_module_w(n){return n}function compat_module_k(){return[!1,compat_module_x]}var compat_module_I=(/* unused pure expression or super */ null && (compat_module_s));function compat_module_M(n,t){this.props=n,this.context=t}function compat_module_N(n,e){function r(n){var t=this.props.ref;return t!=n.ref&&t&&("function"==typeof t?t(null):t.current=null),e?!e(this.props,n)||t!=n.ref:compat_module_E(this.props,n)}function u(e){return this.shouldComponentUpdate=r,compat_module_t(n,e)}return u.displayName="Memo("+(n.displayName||n.name)+")",u.__f=u.prototype.isReactComponent=!0,u.type=n,u}(compat_module_M.prototype=new preact_module_C).isPureReactComponent=!0,compat_module_M.prototype.shouldComponentUpdate=function(n,t){return compat_module_E(this.props,n)||compat_module_E(this.state,t)};var compat_module_T=preact_module_l.__b;preact_module_l.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),compat_module_T&&compat_module_T(n)};var compat_module_A="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function compat_module_D(n){function t(t){var e=compat_module_g({},t);return delete e.ref,n(e,t.ref||null)}return t.$$typeof=compat_module_A,t.render=n,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(n.displayName||n.name)+")",t}var compat_module_F=function(n,t){return null==n?null:compat_module_r(compat_module_r(n).map(t))},compat_module_L=(/* unused pure expression or super */ null && ({map:compat_module_F,forEach:compat_module_F,count:function(n){return n?compat_module_r(n).length:0},only:function(n){var t=compat_module_r(n);if(1!==t.length)throw"Children.only";return t[0]},toArray:compat_module_r})),compat_module_O=preact_module_l.__e;preact_module_l.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k||[]),u.__c(n,t);compat_module_O(n,t,e,r)};var compat_module_U=preact_module_l.unmount;function compat_module_V(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c()}),n.__c.__H=null),null!=(n=compat_module_g({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c.__e=!0,n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return compat_module_V(n,t,e)})),n}function compat_module_W(n,t,e){return n&&e&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return compat_module_W(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.appendChild(n.__e),n.__c.__e=!0,n.__c.__P=e)),n}function compat_module_P(){this.__u=0,this.o=null,this.__b=null}function compat_module_j(n){var t=n.__&&n.__.__c;return t&&t.__a&&t.__a(n)}function compat_module_z(n){var e,r,u,o=null;function i(i){if(e||(e=n()).then(function(n){n&&(o=n.default||n),u=!0},function(n){r=n,u=!0}),r)throw r;if(!u)throw e;return o?compat_module_t(o,i):null}return i.displayName="Lazy",i.__f=!0,i}function compat_module_B(){this.i=null,this.l=null}preact_module_l.unmount=function(n){var t=n.__c;t&&(t.__z=!0),t&&t.__R&&t.__R(),t&&32&n.__u&&(n.type=null),compat_module_U&&compat_module_U(n)},(compat_module_P.prototype=new preact_module_C).__c=function(n,t){var e=t.__c,r=this;null==r.o&&(r.o=[]),r.o.push(e);var u=compat_module_j(r.__v),o=!1,i=function(){o||r.__z||(o=!0,e.__R=null,u?u(f):f())};e.__R=i;var l=e.__P;e.__P=null;var f=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=compat_module_W(n,n.__c.__P,n.__c.__O)}var t;for(r.setState({__a:r.__b=null});t=r.o.pop();)t.__P=l,t.forceUpdate()}};r.__u++||32&t.__u||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i)},compat_module_P.prototype.componentWillUnmount=function(){this.o=[]},compat_module_P.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=compat_module_V(this.__b,r,o.__O=o.__P)}this.__b=null}var i=e.__a&&preact_module_k(preact_module_S,null,n.fallback);return i&&(i.__u&=-33),[preact_module_k(preact_module_S,null,e.__a?null:n.children),i]};var compat_module_H=function(n,t,e){if(++e[1]===e[0]&&n.l.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.l.size))for(e=n.i;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.i=e=e[2]}};function compat_module_Z(n){return this.getChildContext=function(){return n.context},n.children}function Y(n){var e=this,r=n.h;if(e.componentWillUnmount=function(){compat_module_o(null,e.v),e.v=null,e.h=null},e.h&&e.h!==r&&e.componentWillUnmount(),!e.v){for(var u=e.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;e.h=r,e.v={nodeType:1,parentNode:r,childNodes:[],__k:{__m:u.__m},contains:function(){return!0},namespaceURI:r.namespaceURI,insertBefore:function(n,t){this.childNodes.push(n),e.h.insertBefore(n,t)},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),e.h.removeChild(n)}}}compat_module_o(compat_module_t(compat_module_Z,{context:e.context},n.__v),e.v)}function compat_module_$(n,e){var r=compat_module_t(Y,{__v:n,h:e});return r.containerInfo=e,r}(compat_module_B.prototype=new preact_module_C).__a=function(n){var t=this,e=compat_module_j(t.__v),r=t.l.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),compat_module_H(t,n,r)):u()};e?e(o):o()}},compat_module_B.prototype.render=function(n){this.i=null,this.l=new Map;var t=preact_module_F(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.l.set(t[e],this.i=[1,0,this.i]);return n.children},compat_module_B.prototype.componentDidUpdate=compat_module_B.prototype.componentDidMount=function(){var n=this;this.l.forEach(function(t,e){compat_module_H(n,e,t)})};var compat_module_q="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,compat_module_G=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,compat_module_J=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,compat_module_K=/[A-Z0-9]/g,compat_module_Q="undefined"!=typeof document,compat_module_X=function(n){return("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};function nn(n,t,e){return null==t.__k&&(t.textContent=""),preact_module_R(n,t),"function"==typeof e&&e(),n?n.__c:null}function tn(n,t,e){return compat_module_i(n,t),"function"==typeof e&&e(),n?n.__c:null}preact_module_C.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(preact_module_C.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n})}})});var compat_module_en=preact_module_l.event;preact_module_l.event=function(n){return compat_module_en&&(n=compat_module_en(n)),n.persist=function(){},n.isPropagationStopped=function(){return this.cancelBubble},n.isDefaultPrevented=function(){return this.defaultPrevented},n.nativeEvent=n};var rn,un={configurable:!0,get:function(){return this.class}},compat_module_on=preact_module_l.vnode;preact_module_l.vnode=function(n){"string"==typeof n.type&&function(n){var t=n.props,e=n.type,u={},o=-1==e.indexOf("-");for(var i in t){var l=t[i];if(!("value"===i&&"defaultValue"in t&&null==l||compat_module_Q&&"children"===i&&"noscript"===e||"class"===i||"className"===i)){var f=i.toLowerCase();"defaultValue"===i&&"value"in t&&null==t.value?i="value":"download"===i&&!0===l?l="":"translate"===f&&"no"===l?l=!1:"o"===f[0]&&"n"===f[1]?"ondoubleclick"===f?i="ondblclick":"onchange"!==f||"input"!==e&&"textarea"!==e||compat_module_X(t.type)?"onfocus"===f?i="onfocusin":"onblur"===f?i="onfocusout":compat_module_J.test(i)&&(i=f):f=i="oninput":o&&compat_module_G.test(i)?i=i.replace(compat_module_K,"-$&").toLowerCase():null===l&&(l=void 0),"oninput"===f&&u[i=f]&&(i="oninputCapture"),u[i]=l}}"select"==e&&(u.multiple&&Array.isArray(u.value)&&(u.value=preact_module_F(t.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value)})),null!=u.defaultValue&&(u.value=preact_module_F(t.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value}))),t.class&&!t.className?(u.class=t.class,Object.defineProperty(u,"className",un)):t.className&&(u.class=u.className=t.className),n.props=u}(n),n.$$typeof=compat_module_q,compat_module_on&&compat_module_on(n)};var ln=preact_module_l.__r;preact_module_l.__r=function(n){ln&&ln(n),rn=n.__c};var compat_module_fn=preact_module_l.diffed;preact_module_l.diffed=function(n){compat_module_fn&&compat_module_fn(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value),rn=null};var compat_module_an=(/* unused pure expression or super */ null && ({ReactCurrentDispatcher:{current:{readContext:function(n){return rn.__n[n.__c].props.value},useCallback:compat_module_v,useContext:compat_module_d,useDebugValue:compat_module_m,useDeferredValue:compat_module_w,useEffect:compat_module_h,useId:compat_module_p,useImperativeHandle:compat_module_y,useInsertionEffect:compat_module_I,useLayoutEffect:compat_module_s,useMemo:compat_module_,useReducer:compat_module_b,useRef:compat_module_S,useState:compat_module_c,useSyncExternalStore:compat_module_C,useTransition:compat_module_k}}})),cn="18.3.1";function sn(n){return compat_module_t.bind(null,n)}function hn(n){return!!n&&n.$$typeof===compat_module_q}function vn(n){return hn(n)&&n.type===compat_module_u}function dn(n){return!!n&&"string"==typeof n.displayName&&0==n.displayName.indexOf("Memo(")}function mn(n){return hn(n)?compat_module_a.apply(null,arguments):n}function pn(n){return!!n.__k&&(compat_module_o(null,n),!0)}function yn(n){return n&&(n.base||1===n.nodeType&&n)||null}var _n=function(n,t){return n(t)},bn=function(n,t){var r,u=compat_module_e.debounceRendering;compat_module_e.debounceRendering=function(n){r=n};try{var o=n(t);return r&&r(),o}finally{compat_module_e.debounceRendering=u}},Sn=(/* unused pure expression or super */ null && (hn)),gn=(/* unused pure expression or super */ null && ({useState:compat_module_c,useId:compat_module_p,useReducer:compat_module_b,useEffect:compat_module_h,useLayoutEffect:compat_module_s,useInsertionEffect:compat_module_I,useTransition:compat_module_k,useDeferredValue:compat_module_w,useSyncExternalStore:compat_module_C,startTransition:compat_module_x,useRef:compat_module_S,useImperativeHandle:compat_module_y,useMemo:compat_module_,useCallback:compat_module_v,useContext:compat_module_d,useDebugValue:compat_module_m,version:"18.3.1",Children:compat_module_L,render:nn,hydrate:tn,unmountComponentAtNode:pn,createPortal:compat_module_$,createElement:compat_module_t,createContext:compat_module_l,createFactory:sn,cloneElement:mn,createRef:compat_module_f,Fragment:compat_module_u,isValidElement:hn,isElement:Sn,isFragment:vn,isMemo:dn,findDOMNode:yn,Component:compat_module_n,PureComponent:compat_module_M,memo:compat_module_N,forwardRef:compat_module_D,flushSync:bn,unstable_batchedUpdates:_n,StrictMode:compat_module_u,Suspense:compat_module_P,SuspenseList:compat_module_B,lazy:compat_module_z,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:compat_module_an}));
//# sourceMappingURL=compat.module.js.map

;// ./node_modules/@uppy/core/lib/BasePlugin.js
/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */

class BasePlugin {
    uppy;
    opts;
    id;
    defaultLocale;
    i18n;
    i18nArray;
    type;
    VERSION;
    constructor(uppy, opts) {
        this.uppy = uppy;
        this.opts = opts ?? {};
    }
    getPluginState() {
        const { plugins } = this.uppy.getState();
        return (plugins?.[this.id] || {});
    }
    setPluginState(update) {
        const { plugins } = this.uppy.getState();
        this.uppy.setState({
            plugins: {
                ...plugins,
                [this.id]: {
                    ...plugins[this.id],
                    ...update,
                },
            },
        });
    }
    setOptions(newOpts) {
        this.opts = { ...this.opts, ...newOpts };
        this.setPluginState(undefined); // so that UI re-renders with new options
        this.i18nInit();
    }
    i18nInit() {
        const translator = new Translator([
            this.defaultLocale,
            this.uppy.locale,
            this.opts.locale,
        ]);
        this.i18n = translator.translate.bind(translator);
        this.i18nArray = translator.translateArray.bind(translator);
        this.setPluginState(undefined); // so that UI re-renders and we see the updated locale
    }
    /**
     * Extendable methods
     * ==================
     * These methods are here to serve as an overview of the extendable methods as well as
     * making them not conditional in use, such as `if (this.afterUpdate)`.
     */
    addTarget(plugin) {
        throw new Error("Extend the addTarget method to add your plugin to another plugin's target");
    }
    install() { }
    uninstall() { }
    update(state) { }
    // Called after every state update, after everything's mounted. Debounced.
    afterUpdate() { }
}

;// ./node_modules/@uppy/core/lib/UIPlugin.js




/**
 * Defer a frequent call to the microtask queue.
 */
function debounce(fn) {
    let calling = null;
    let latestArgs;
    return (...args) => {
        latestArgs = args;
        if (!calling) {
            calling = Promise.resolve().then(() => {
                calling = null;
                // At this point `args` may be different from the most
                // recent state, if multiple calls happened since this task
                // was queued. So we use the `latestArgs`, which definitely
                // is the most recent call.
                return fn(...latestArgs);
            });
        }
        return calling;
    };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */
class UIPlugin extends BasePlugin {
    #updateUI;
    isTargetDOMEl;
    el;
    parent;
    title;
    getTargetPlugin(target) {
        let targetPlugin;
        if (typeof target?.addTarget === 'function') {
            // Targeting a plugin *instance*
            targetPlugin = target;
            if (!(targetPlugin instanceof UIPlugin)) {
                console.warn(new Error('The provided plugin is not an instance of UIPlugin. This is an indication of a bug with the way Uppy is bundled.', { cause: { targetPlugin, UIPlugin } }));
            }
        }
        else if (typeof target === 'function') {
            // Targeting a plugin type
            const Target = target;
            // Find the target plugin instance.
            this.uppy.iteratePlugins((p) => {
                if (p instanceof Target) {
                    targetPlugin = p;
                }
            });
        }
        return targetPlugin;
    }
    /**
     * Check if supplied `target` is a DOM element or an `object`.
     * If it’s an object — target is a plugin, and we search `plugins`
     * for a plugin with same name and return its target.
     */
    mount(target, plugin) {
        const callerPluginName = plugin.id;
        const targetElement = lib_findDOMElement(target);
        if (targetElement) {
            this.isTargetDOMEl = true;
            // When target is <body> with a single <div> element,
            // Preact thinks it’s the Uppy root element in there when doing a diff,
            // and destroys it. So we are creating a fragment (could be empty div)
            const uppyRootElement = document.createElement('div');
            uppyRootElement.classList.add('uppy-Root');
            // API for plugins that require a synchronous rerender.
            this.#updateUI = debounce((state) => {
                // plugin could be removed, but this.rerender is debounced below,
                // so it could still be called even after uppy.removePlugin or uppy.destroy
                // hence the check
                if (!this.uppy.getPlugin(this.id))
                    return;
                nn(this.render(state, uppyRootElement), uppyRootElement);
                this.afterUpdate();
            });
            this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);
            if (this.opts.replaceTargetContent) {
                // Doing render(h(null), targetElement), which should have been
                // a better way, since because the component might need to do additional cleanup when it is removed,
                // stopped working — Preact just adds null into target, not replacing
                targetElement.innerHTML = '';
            }
            nn(this.render(this.uppy.getState(), uppyRootElement), uppyRootElement);
            this.el = uppyRootElement;
            targetElement.appendChild(uppyRootElement);
            // Set the text direction if the page has not defined one.
            uppyRootElement.dir =
                this.opts.direction || lib_getTextDirection(uppyRootElement) || 'ltr';
            this.onMount();
            return this.el;
        }
        const targetPlugin = this.getTargetPlugin(target);
        if (targetPlugin) {
            this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
            this.parent = targetPlugin;
            this.el = targetPlugin.addTarget(plugin);
            this.onMount();
            return this.el;
        }
        this.uppy.log(`Not installing ${callerPluginName}`);
        let message = `Invalid target option given to ${callerPluginName}.`;
        if (typeof target === 'function') {
            message +=
                ' The given target is not a Plugin class. ' +
                    "Please check that you're not specifying a React Component instead of a plugin. " +
                    'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' +
                    'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
        }
        else {
            message +=
                'If you meant to target an HTML element, please make sure that the element exists. ' +
                    'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' +
                    '(see https://github.com/transloadit/uppy/issues/1042)\n\n' +
                    'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
        }
        throw new Error(message);
    }
    /**
     * Called when plugin is mounted, whether in DOM or into another plugin.
     * Needed because sometimes plugins are mounted separately/after `install`,
     * so this.el and this.parent might not be available in `install`.
     * This is the case with @uppy/react plugins, for example.
     */
    render(state, container) {
        throw new Error('Extend the render method to add your plugin to a DOM element');
    }
    update(state) {
        if (this.el != null) {
            this.#updateUI?.(state);
        }
    }
    unmount() {
        if (this.isTargetDOMEl) {
            this.el?.remove();
        }
        this.onUnmount();
    }
    onMount() { }
    onUnmount() { }
}
/* harmony default export */ const lib_UIPlugin = (UIPlugin);

;// ./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
/* unused harmony import specifier */ var jsxRuntime_module_e;
/* unused harmony import specifier */ var jsxRuntime_module_r;
var jsxRuntime_module_t=/["&<]/;function jsxRuntime_module_n(r){if(0===r.length||!1===jsxRuntime_module_t.test(r))return r;for(var e=0,n=0,o="",f="";n<r.length;n++){switch(r.charCodeAt(n)){case 34:f="&quot;";break;case 38:f="&amp;";break;case 60:f="&lt;";break;default:continue}n!==e&&(o+=r.slice(e,n)),o+=f,e=n+1}return n!==e&&(o+=r.slice(e,n)),o}var jsxRuntime_module_o=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,jsxRuntime_module_f=0,jsxRuntime_module_i=Array.isArray;function jsxRuntime_module_u(e,t,n,o,i,u){t||(t={});var a,c,p=t;if("ref"in p)for(c in p={},t)"ref"==c?a=t[c]:p[c]=t[c];var l={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--jsxRuntime_module_f,__i:-1,__u:0,__source:i,__self:u};if("function"==typeof e&&(a=e.defaultProps))for(c in a)void 0===p[c]&&(p[c]=a[c]);return preact_module_l.vnode&&preact_module_l.vnode(l),l}function jsxRuntime_module_a(r){var t=jsxRuntime_module_u(jsxRuntime_module_e,{tpl:r,exprs:[].slice.call(arguments,1)});return t.key=t.__v,t}var jsxRuntime_module_c=(/* unused pure expression or super */ null && ({})),jsxRuntime_module_p=/[A-Z]/g;function jsxRuntime_module_l(e,t){if(jsxRuntime_module_r.attr){var f=jsxRuntime_module_r.attr(e,t);if("string"==typeof f)return f}if(t=function(r){return null!==r&&"object"==typeof r&&"function"==typeof r.valueOf?r.valueOf():r}(t),"ref"===e||"key"===e)return"";if("style"===e&&"object"==typeof t){var i="";for(var u in t){var a=t[u];if(null!=a&&""!==a){var l="-"==u[0]?u:jsxRuntime_module_c[u]||(jsxRuntime_module_c[u]=u.replace(jsxRuntime_module_p,"-$&").toLowerCase()),s=";";"number"!=typeof a||l.startsWith("--")||jsxRuntime_module_o.test(l)||(s="px;"),i=i+l+":"+a+s}}return e+'="'+jsxRuntime_module_n(i)+'"'}return null==t||!1===t||"function"==typeof t||"object"==typeof t?"":!0===t?e:e+'="'+jsxRuntime_module_n(""+t)+'"'}function jsxRuntime_module_s(r){if(null==r||"boolean"==typeof r||"function"==typeof r)return null;if("object"==typeof r){if(void 0===r.constructor)return r;if(jsxRuntime_module_i(r)){for(var e=0;e<r.length;e++)r[e]=jsxRuntime_module_s(r[e]);return r}}return jsxRuntime_module_n(""+r)}
//# sourceMappingURL=jsxRuntime.module.js.map

;// ./node_modules/@uppy/informer/package.json
const informer_package_namespaceObject = {"rE":"4.3.2"};
;// ./node_modules/@uppy/informer/lib/FadeIn.js


const TRANSITION_MS = 300;
class FadeIn extends preact_module_C {
    ref = M();
    componentWillEnter(callback) {
        this.ref.current.style.opacity = '1';
        this.ref.current.style.transform = 'none';
        setTimeout(callback, TRANSITION_MS);
    }
    componentWillLeave(callback) {
        this.ref.current.style.opacity = '0';
        this.ref.current.style.transform = 'translateY(350%)';
        setTimeout(callback, TRANSITION_MS);
    }
    render() {
        const { children } = this.props;
        return (jsxRuntime_module_u("div", { className: "uppy-Informer-animated", ref: this.ref, children: children }));
    }
}

;// ./node_modules/@uppy/informer/lib/TransitionGroup.js
// INFO: not typing copy pasted libarary code
// @ts-nocheck
/**
 * @source https://github.com/developit/preact-transition-group
 */

function TransitionGroup_assign(obj, props) {
    return Object.assign(obj, props);
}
function getKey(vnode, fallback) {
    return vnode?.key ?? fallback;
}
function linkRef(component, name) {
    // biome-ignore lint/suspicious/noAssignInExpressions: ...
    const cache = component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
    return (cache[name] ||
        // biome-ignore lint/suspicious/noAssignInExpressions: ...
        (cache[name] = (c) => {
            component.refs[name] = c;
        }));
}
function getChildMapping(children) {
    const out = {};
    for (let i = 0; i < children.length; i++) {
        if (children[i] != null) {
            const key = getKey(children[i], i.toString(36));
            out[key] = children[i];
        }
    }
    return out;
}
function mergeChildMappings(prev, next) {
    prev = prev || {};
    next = next || {};
    const getValueForKey = (key) => Object.hasOwn(next, key) ? next[key] : prev[key];
    // For each key of `next`, the list of keys to insert before that key in
    // the combined list
    const nextKeysPending = {};
    let pendingKeys = [];
    for (const prevKey in prev) {
        if (Object.hasOwn(next, prevKey)) {
            if (pendingKeys.length) {
                nextKeysPending[prevKey] = pendingKeys;
                pendingKeys = [];
            }
        }
        else {
            pendingKeys.push(prevKey);
        }
    }
    const childMapping = {};
    for (const nextKey in next) {
        if (Object.hasOwn(nextKeysPending, nextKey)) {
            for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
                const pendingNextKey = nextKeysPending[nextKey][i];
                childMapping[nextKeysPending[nextKey][i]] =
                    getValueForKey(pendingNextKey);
            }
        }
        childMapping[nextKey] = getValueForKey(nextKey);
    }
    // Finally, add the keys which didn't appear before any key in `next`
    for (let i = 0; i < pendingKeys.length; i++) {
        childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }
    return childMapping;
}
const identity = (i) => i;
class TransitionGroup extends preact_module_C {
    constructor(props, context) {
        super(props, context);
        this.refs = {};
        this.state = {
            children: getChildMapping(preact_module_F(preact_module_F(this.props.children)) || []),
        };
        this.performAppear = this.performAppear.bind(this);
        this.performEnter = this.performEnter.bind(this);
        this.performLeave = this.performLeave.bind(this);
    }
    componentWillMount() {
        this.currentlyTransitioningKeys = {};
        this.keysToAbortLeave = [];
        this.keysToEnter = [];
        this.keysToLeave = [];
    }
    componentDidMount() {
        const initialChildMapping = this.state.children;
        for (const key in initialChildMapping) {
            if (initialChildMapping[key]) {
                // this.performAppear(getKey(initialChildMapping[key], key));
                this.performAppear(key);
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const nextChildMapping = getChildMapping(preact_module_F(nextProps.children) || []);
        const prevChildMapping = this.state.children;
        this.setState((prevState) => ({
            children: mergeChildMappings(prevState.children, nextChildMapping),
        }));
        let key;
        for (key in nextChildMapping) {
            if (Object.hasOwn(nextChildMapping, key)) {
                const hasPrev = prevChildMapping && Object.hasOwn(prevChildMapping, key);
                // We should re-enter the component and abort its leave function
                if (nextChildMapping[key] &&
                    hasPrev &&
                    this.currentlyTransitioningKeys[key]) {
                    this.keysToEnter.push(key);
                    this.keysToAbortLeave.push(key);
                }
                else if (nextChildMapping[key] &&
                    !hasPrev &&
                    !this.currentlyTransitioningKeys[key]) {
                    this.keysToEnter.push(key);
                }
            }
        }
        for (key in prevChildMapping) {
            if (Object.hasOwn(prevChildMapping, key)) {
                const hasNext = nextChildMapping && Object.hasOwn(nextChildMapping, key);
                if (prevChildMapping[key] &&
                    !hasNext &&
                    !this.currentlyTransitioningKeys[key]) {
                    this.keysToLeave.push(key);
                }
            }
        }
    }
    componentDidUpdate() {
        const { keysToEnter } = this;
        this.keysToEnter = [];
        keysToEnter.forEach(this.performEnter);
        const { keysToLeave } = this;
        this.keysToLeave = [];
        keysToLeave.forEach(this.performLeave);
    }
    _finishAbort(key) {
        const idx = this.keysToAbortLeave.indexOf(key);
        if (idx !== -1) {
            this.keysToAbortLeave.splice(idx, 1);
        }
    }
    performAppear(key) {
        this.currentlyTransitioningKeys[key] = true;
        const component = this.refs[key];
        if (component?.componentWillAppear) {
            component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
        }
        else {
            this._handleDoneAppearing(key);
        }
    }
    _handleDoneAppearing(key) {
        const component = this.refs[key];
        if (component?.componentDidAppear) {
            component.componentDidAppear();
        }
        delete this.currentlyTransitioningKeys[key];
        this._finishAbort(key);
        const currentChildMapping = getChildMapping(preact_module_F(this.props.children) || []);
        if (!currentChildMapping || !Object.hasOwn(currentChildMapping, key)) {
            // This was removed before it had fully appeared. Remove it.
            this.performLeave(key);
        }
    }
    performEnter(key) {
        this.currentlyTransitioningKeys[key] = true;
        const component = this.refs[key];
        if (component?.componentWillEnter) {
            component.componentWillEnter(this._handleDoneEntering.bind(this, key));
        }
        else {
            this._handleDoneEntering(key);
        }
    }
    _handleDoneEntering(key) {
        const component = this.refs[key];
        if (component?.componentDidEnter) {
            component.componentDidEnter();
        }
        delete this.currentlyTransitioningKeys[key];
        this._finishAbort(key);
        const currentChildMapping = getChildMapping(preact_module_F(this.props.children) || []);
        if (!currentChildMapping || !Object.hasOwn(currentChildMapping, key)) {
            // This was removed before it had fully entered. Remove it.
            this.performLeave(key);
        }
    }
    performLeave(key) {
        // If we should immediately abort this leave function,
        // don't run the leave transition at all.
        const idx = this.keysToAbortLeave.indexOf(key);
        if (idx !== -1) {
            return;
        }
        this.currentlyTransitioningKeys[key] = true;
        const component = this.refs[key];
        if (component?.componentWillLeave) {
            component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
        }
        else {
            // Note that this is somewhat dangerous b/c it calls setState()
            // again, effectively mutating the component before all the work
            // is done.
            this._handleDoneLeaving(key);
        }
    }
    _handleDoneLeaving(key) {
        // If we should immediately abort the leave,
        // then skip this altogether
        const idx = this.keysToAbortLeave.indexOf(key);
        if (idx !== -1) {
            return;
        }
        const component = this.refs[key];
        if (component?.componentDidLeave) {
            component.componentDidLeave();
        }
        delete this.currentlyTransitioningKeys[key];
        const currentChildMapping = getChildMapping(preact_module_F(this.props.children) || []);
        if (currentChildMapping && Object.hasOwn(currentChildMapping, key)) {
            // This entered again before it fully left. Add it again.
            this.performEnter(key);
        }
        else {
            const children = TransitionGroup_assign({}, this.state.children);
            delete children[key];
            this.setState({ children });
        }
    }
    render({ childFactory, transitionLeave, transitionName, transitionAppear, transitionEnter, transitionLeaveTimeout, transitionEnterTimeout, transitionAppearTimeout, component, ...props }, { children }) {
        // TODO: we could get rid of the need for the wrapper node
        // by cloning a single child
        const childrenToRender = Object.entries(children)
            .map(([key, child]) => {
            if (!child)
                return undefined;
            const ref = linkRef(this, key);
            return W(childFactory(child), { ref, key });
        })
            .filter(Boolean);
        return preact_module_k(component, props, childrenToRender);
    }
}
TransitionGroup.defaultProps = {
    component: 'span',
    childFactory: identity,
};
/* harmony default export */ const lib_TransitionGroup = (TransitionGroup);

;// ./node_modules/@uppy/informer/lib/Informer.js






/**
 * Informer
 * Shows rad message bubbles
 * used like this: `uppy.info('hello world', 'info', 5000)`
 * or for errors: `uppy.info('Error uploading img.jpg', 'error', 5000)`
 *
 */
class Informer extends lib_UIPlugin {
    static VERSION = informer_package_namespaceObject.rE;
    constructor(uppy, opts) {
        super(uppy, opts);
        this.type = 'progressindicator';
        this.id = this.opts.id || 'Informer';
        this.title = 'Informer';
    }
    render = (state) => {
        return (jsxRuntime_module_u("div", { className: "uppy uppy-Informer", children: jsxRuntime_module_u(lib_TransitionGroup, { children: state.info.map((info) => (jsxRuntime_module_u(FadeIn, { children: jsxRuntime_module_u("p", { role: "alert", children: [info.message, ' ', info.details && (
                            // biome-ignore lint/a11y/useKeyWithClickEvents: ...
                            jsxRuntime_module_u("span", { "aria-label": info.details, "data-microtip-position": "top-left", "data-microtip-size": "medium", role: "tooltip", onClick: () => alert(`${info.message} \n\n ${info.details}`), children: "?" }))] }) }, info.message))) }) }));
    };
    install() {
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
    }
}

;// ./node_modules/@uppy/informer/lib/index.js


;// ./node_modules/@uppy/provider-views/lib/ProviderView/AuthView.js


function GoogleIcon() {
    return (jsxRuntime_module_u("svg", { width: "26", height: "26", viewBox: "0 0 26 26", xmlns: "http://www.w3.org/2000/svg", children: jsxRuntime_module_u("g", { fill: "none", "fill-rule": "evenodd", children: [jsxRuntime_module_u("circle", { fill: "#FFF", cx: "13", cy: "13", r: "13" }), jsxRuntime_module_u("path", { d: "M21.64 13.205c0-.639-.057-1.252-.164-1.841H13v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z", fill: "#4285F4", "fill-rule": "nonzero" }), jsxRuntime_module_u("path", { d: "M13 22c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H4.957v2.332A8.997 8.997 0 0013 22z", fill: "#34A853", "fill-rule": "nonzero" }), jsxRuntime_module_u("path", { d: "M7.964 14.71A5.41 5.41 0 017.682 13c0-.593.102-1.17.282-1.71V8.958H4.957A8.996 8.996 0 004 13c0 1.452.348 2.827.957 4.042l3.007-2.332z", fill: "#FBBC05", "fill-rule": "nonzero" }), jsxRuntime_module_u("path", { d: "M13 7.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C17.463 4.891 15.426 4 13 4a8.997 8.997 0 00-8.043 4.958l3.007 2.332C8.672 9.163 10.656 7.58 13 7.58z", fill: "#EA4335", "fill-rule": "nonzero" }), jsxRuntime_module_u("path", { d: "M4 4h18v18H4z" })] }) }));
}
function DefaultForm({ pluginName, i18n, onAuth, }) {
    // In order to comply with Google's brand we need to create a different button
    // for the Google Drive plugin
    const isGoogleDrive = pluginName === 'Google Drive';
    const onSubmit = hooks_module_q((e) => {
        e.preventDefault();
        onAuth();
    }, [onAuth]);
    return (jsxRuntime_module_u("form", { onSubmit: onSubmit, children: isGoogleDrive ? (jsxRuntime_module_u("button", { type: "submit", className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Provider-authBtn uppy-Provider-btn-google", "data-uppy-super-focusable": true, children: [jsxRuntime_module_u(GoogleIcon, {}), i18n('signInWithGoogle')] })) : (jsxRuntime_module_u("button", { type: "submit", className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Provider-authBtn", "data-uppy-super-focusable": true, children: i18n('authenticateWith', { pluginName }) })) }));
}
const defaultRenderForm = ({ pluginName, i18n, onAuth, }) => jsxRuntime_module_u(DefaultForm, { pluginName: pluginName, i18n: i18n, onAuth: onAuth });
function AuthView({ loading, pluginName, pluginIcon, i18n, handleAuth, renderForm = defaultRenderForm, }) {
    return (jsxRuntime_module_u("div", { className: "uppy-Provider-auth", children: [jsxRuntime_module_u("div", { className: "uppy-Provider-authIcon", children: pluginIcon() }), jsxRuntime_module_u("div", { className: "uppy-Provider-authTitle", children: i18n('authenticateWithTitle', {
                    pluginName,
                }) }), renderForm({ pluginName, i18n, loading, onAuth: handleAuth })] }));
}

;// ./node_modules/@uppy/provider-views/lib/GooglePicker/googlePicker.js
const getAuthHeader = (token) => ({
    authorization: `Bearer ${token}`,
});
const injectedScripts = new Set();
let driveApiLoaded = false;
// https://stackoverflow.com/a/39008859/6519037
async function injectScript(src) {
    if (injectedScripts.has(src))
        return;
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', () => resolve());
        script.addEventListener('error', (e) => reject(e.error));
        document.head.appendChild(script);
    });
    injectedScripts.add(src);
}
async function ensureScriptsInjected(pickerType) {
    await Promise.all([
        injectScript('https://accounts.google.com/gsi/client'), // Google Identity Services
        (async () => {
            await injectScript('https://apis.google.com/js/api.js');
            if (pickerType === 'drive' && !driveApiLoaded) {
                await new Promise((resolve) => gapi.load('client:picker', () => resolve()));
                await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
                driveApiLoaded = true;
            }
        })(),
    ]);
}
async function isTokenValid(accessToken, signal) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${encodeURIComponent(accessToken)}`, { signal });
    if (response.ok) {
        return true;
    }
    // console.warn('Token is invalid or expired:', response.status, await response.text());
    // Token is invalid or expired
    return false;
}
async function authorize({ pickerType, clientId, accessToken, }) {
    const response = await new Promise((resolve, reject) => {
        const scopes = pickerType === 'drive'
            ? ['https://www.googleapis.com/auth/drive.file']
            : ['https://www.googleapis.com/auth/photospicker.mediaitems.readonly'];
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            // Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
            scope: scopes.join(' '),
            callback: resolve,
            error_callback: reject,
        });
        if (accessToken === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({ prompt: 'consent' });
        }
        else {
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
    if (response.error) {
        throw new Error(`OAuth2 error: ${response.error}`);
    }
    return response.access_token;
}
async function logout(accessToken) {
    await new Promise((resolve) => google.accounts.oauth2.revoke(accessToken, resolve));
}
class InvalidTokenError extends Error {
    constructor() {
        super('Invalid or expired token');
        this.name = 'InvalidTokenError';
    }
}
async function showDrivePicker({ token, apiKey, appId, onFilesPicked, signal, }) {
    // google drive picker will crash hard if given an invalid token, so we need to check it first
    // https://github.com/transloadit/uppy/pull/5443#pullrequestreview-2452439265
    if (!(await isTokenValid(token, signal))) {
        throw new InvalidTokenError();
    }
    const onPicked = (picked) => {
        if (picked.action === google.picker.Action.PICKED) {
            // console.log('Picker response', JSON.stringify(picked, null, 2));
            onFilesPicked(picked.docs.map((doc) => ({
                platform: 'drive',
                id: doc.id,
                name: doc.name,
                mimeType: doc.mimeType,
            })), token);
        }
    };
    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(apiKey)
        .setAppId(appId)
        .setOAuthToken(token)
        .addView(new google.picker.DocsView(google.picker.ViewId.DOCS)
        .setIncludeFolders(true)
        // Note: setEnableDrives doesn't seem to work
        // .setEnableDrives(true)
        .setSelectFolderEnabled(false)
        .setMode(google.picker.DocsViewMode.LIST))
        // NOTE: photos is broken and results in an error being returned from Google
        // I think it's the old Picasa photos
        // .addView(google.picker.ViewId.PHOTOS)
        .setCallback(onPicked)
        .build();
    picker.setVisible(true);
    signal?.addEventListener('abort', () => picker.dispose());
}
async function showPhotosPicker({ token, pickingSession, onPickingSessionChange, signal, }) {
    // https://developers.google.com/photos/picker/guides/get-started-picker
    const headers = getAuthHeader(token);
    let newPickingSession = pickingSession;
    if (newPickingSession == null) {
        const createSessionResponse = await fetch('https://photospicker.googleapis.com/v1/sessions', { method: 'post', headers, signal });
        if (createSessionResponse.status === 401) {
            const resp = await createSessionResponse.json();
            if (resp.error?.status === 'UNAUTHENTICATED') {
                throw new InvalidTokenError();
            }
        }
        if (!createSessionResponse.ok) {
            throw new Error('Failed to create a session');
        }
        newPickingSession = (await createSessionResponse.json());
        onPickingSessionChange(newPickingSession);
    }
    const w = window.open(newPickingSession.pickerUri);
    signal?.addEventListener('abort', () => w?.close());
}
async function resolvePickedPhotos({ accessToken, pickingSession, signal, }) {
    const headers = getAuthHeader(accessToken);
    let pageToken;
    let mediaItems = [];
    do {
        const pageSize = 100;
        const response = await fetch(`https://photospicker.googleapis.com/v1/mediaItems?${new URLSearchParams({ sessionId: pickingSession.id, pageSize: String(pageSize), ...(pageToken && { pageToken }) }).toString()}`, { headers, signal });
        if (!response.ok)
            throw new Error('Failed to get a media items');
        const { mediaItems: batchMediaItems, nextPageToken, } = await response.json();
        pageToken = nextPageToken;
        mediaItems.push(...batchMediaItems);
    } while (pageToken);
    // Filter out items that aren't fully processed or ready
    mediaItems = mediaItems.flatMap((i) => i.type === 'PHOTO' ||
        (i.type === 'VIDEO' &&
            i.mediaFile.mediaFileMetadata.videoMetadata.processingStatus === 'READY')
        ? [i]
        : []);
    // Transform media items into picked items with appropriate metadata
    return mediaItems.map((mediaItem) => {
        const { id, type, mediaFile: { mimeType, filename, baseUrl }, } = mediaItem;
        return {
            platform: 'photos',
            id,
            mimeType,
            // we want the original resolution, so we don't append any parameter to the baseUrl
            // https://developers.google.com/photos/library/guides/access-media-items#base-urls
            url: type === 'VIDEO' ? `${baseUrl}=dv` : `${baseUrl}=d`, // dv to download video, d to get original image (non cropped)
            name: filename,
            metadata: {
                // Note that metadata keys `filename` and `type` have special meanings in Companion
                // and should not be overridden
                googlePhotosFileType: mediaItem.type,
                createTime: mediaItem.createTime,
                width: mediaItem.mediaFile.mediaFileMetadata.width,
                height: mediaItem.mediaFile.mediaFileMetadata.height,
                ...(mediaItem.type === 'PHOTO' && {
                    cameraMake: mediaItem.mediaFile.mediaFileMetadata.photoMetadata?.cameraMake,
                    cameraModel: mediaItem.mediaFile.mediaFileMetadata.photoMetadata?.cameraModel,
                    focalLength: mediaItem.mediaFile.mediaFileMetadata.photoMetadata?.focalLength,
                    apertureFNumber: mediaItem.mediaFile.mediaFileMetadata.photoMetadata
                        ?.apertureFNumber,
                    isoEquivalent: mediaItem.mediaFile.mediaFileMetadata.photoMetadata?.isoEquivalent,
                    exposureTime: mediaItem.mediaFile.mediaFileMetadata.photoMetadata?.exposureTime,
                }),
                ...(mediaItem.type === 'VIDEO' && {
                    cameraMake: mediaItem.mediaFile.mediaFileMetadata.videoMetadata.cameraMake,
                    cameraModel: mediaItem.mediaFile.mediaFileMetadata.videoMetadata.cameraModel,
                    fps: mediaItem.mediaFile.mediaFileMetadata.videoMetadata.fps,
                    processingStatus: mediaItem.mediaFile.mediaFileMetadata.videoMetadata
                        .processingStatus,
                }),
            },
        };
    });
}
async function pollPickingSession({ pickingSessionRef, accessTokenRef, signal, onFilesPicked, onError, }) {
    // if we have an active session, poll it until it either times out, or the user selects some photos.
    // Note that the user can also just close the page, but we get no indication of that from Google when polling,
    // so we just have to continue polling in the background, so we can react to it
    // in case the user opens the photo selector again. Hence the infinite for loop
    for (let interval = 1;;) {
        try {
            if (pickingSessionRef.current != null) {
                interval = parseFloat(pickingSessionRef.current.pollingConfig.pollInterval);
            }
            else {
                interval = 1;
            }
            await Promise.race([
                new Promise((resolve) => setTimeout(resolve, interval * 1000)),
                new Promise((_resolve, reject) => {
                    signal.addEventListener('abort', reject);
                }),
            ]);
            signal.throwIfAborted();
            const accessToken = accessTokenRef.current;
            const pickingSession = pickingSessionRef.current;
            if (pickingSession != null && accessToken != null) {
                const headers = getAuthHeader(accessToken);
                // https://developers.google.com/photos/picker/reference/rest/v1/sessions
                const response = await fetch(`https://photospicker.googleapis.com/v1/sessions/${encodeURIComponent(pickingSession.id)}`, { headers, signal });
                if (!response.ok)
                    throw new Error('Failed to get session');
                const json = await response.json();
                if (json.mediaItemsSet) {
                    // console.log('User picked!', json)
                    const resolvedPhotos = await resolvePickedPhotos({
                        accessToken,
                        pickingSession,
                        signal,
                    });
                    pickingSessionRef.current = undefined;
                    onFilesPicked(resolvedPhotos, accessToken);
                }
                if (pickingSession.pollingConfig.timeoutIn === '0s') {
                    pickingSessionRef.current = undefined;
                }
            }
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            // just report the error and continue polling
            onError(err);
        }
    }
}

;// ./node_modules/@uppy/provider-views/lib/GooglePicker/icons.js
/* unused harmony import specifier */ var _jsx;
/* unused harmony import specifier */ var _jsxs;

const GooglePhotosIcon = () => (_jsx("svg", { "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "-7 -7 73 73", children: _jsxs("g", { fill: "none", "fill-rule": "evenodd", children: [_jsx("path", { d: "M-3-3h64v64H-3z" }), _jsxs("g", { "fill-rule": "nonzero", children: [_jsx("path", { fill: "#FBBC04", d: "M14.8 13.4c8.1 0 14.7 6.6 14.7 14.8v1.3H1.3c-.7 0-1.3-.6-1.3-1.3C0 20 6.6 13.4 14.8 13.4z" }), _jsx("path", { fill: "#EA4335", d: "M45.6 14.8c0 8.1-6.6 14.7-14.8 14.7h-1.3V1.3c0-.7.6-1.3 1.3-1.3C39 0 45.6 6.6 45.6 14.8z" }), _jsx("path", { fill: "#4285F4", d: "M44.3 45.6c-8.2 0-14.8-6.6-14.8-14.8v-1.3h28.2c.7 0 1.3.6 1.3 1.3 0 8.2-6.6 14.8-14.8 14.8z" }), _jsx("path", { fill: "#34A853", d: "M13.4 44.3c0-8.2 6.6-14.8 14.8-14.8h1.3v28.2c0 .7-.6 1.3-1.3 1.3-8.2 0-14.8-6.6-14.8-14.8z" })] })] }) }));
const GoogleDriveIcon = () => (_jsx("svg", { "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: _jsxs("g", { fillRule: "nonzero", fill: "none", children: [_jsx("path", { d: "M6.663 22.284l.97 1.62c.202.34.492.609.832.804l3.465-5.798H5c0 .378.1.755.302 1.096l1.361 2.278z", fill: "#0066DA" }), _jsx("path", { d: "M16 12.09l-3.465-5.798c-.34.195-.63.463-.832.804l-6.4 10.718A2.15 2.15 0 005 18.91h6.93L16 12.09z", fill: "#00AC47" }), _jsx("path", { d: "M23.535 24.708c.34-.195.63-.463.832-.804l.403-.67 1.928-3.228c.201-.34.302-.718.302-1.096h-6.93l1.474 2.802 1.991 2.996z", fill: "#EA4335" }), _jsx("path", { d: "M16 12.09l3.465-5.798A2.274 2.274 0 0018.331 6h-4.662c-.403 0-.794.11-1.134.292L16 12.09z", fill: "#00832D" }), _jsx("path", { d: "M20.07 18.91h-8.14l-3.465 5.798c.34.195.73.292 1.134.292h12.802c.403 0 .794-.11 1.134-.292L20.07 18.91z", fill: "#2684FC" }), _jsx("path", { d: "M23.497 12.455l-3.2-5.359a2.252 2.252 0 00-.832-.804L16 12.09l4.07 6.82h6.917c0-.377-.1-.755-.302-1.096l-3.188-5.359z", fill: "#FFBA00" })] }) }));

;// ./node_modules/@uppy/provider-views/lib/GooglePicker/GooglePickerView.js
/* unused harmony import specifier */ var GooglePickerView_jsxs;
/* unused harmony import specifier */ var GooglePickerView_jsx;
/* unused harmony import specifier */ var useState;
/* unused harmony import specifier */ var useEffect;
/* unused harmony import specifier */ var useCallback;
/* unused harmony import specifier */ var useRef;
/* unused harmony import specifier */ var GooglePickerView_AuthView;
/* unused harmony import specifier */ var GooglePickerView_showDrivePicker;
/* unused harmony import specifier */ var GooglePickerView_showPhotosPicker;
/* unused harmony import specifier */ var GooglePickerView_ensureScriptsInjected;
/* unused harmony import specifier */ var GooglePickerView_authorize;
/* unused harmony import specifier */ var GooglePickerView_InvalidTokenError;
/* unused harmony import specifier */ var GooglePickerView_pollPickingSession;
/* unused harmony import specifier */ var GooglePickerView_logout;
/* unused harmony import specifier */ var GooglePickerView_GoogleDriveIcon;
/* unused harmony import specifier */ var GooglePickerView_GooglePhotosIcon;





function useStore(store, key) {
    const [value, setValueState] = useState();
    useEffect(() => {
        ;
        (async () => {
            setValueState(await store.getItem(key));
        })();
    }, [key, store]);
    const setValue = useCallback(async (v) => {
        setValueState(v);
        if (v == null) {
            return store.removeItem(key);
        }
        return store.setItem(key, v);
    }, [key, store]);
    return [value, setValue];
}
function GooglePickerView({ uppy, i18n, clientId, onFilesPicked, pickerType, apiKey, appId, storage, }) {
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessTokenStored] = useStore(storage, `uppy:google-${pickerType}-picker:accessToken`);
    const pickingSessionRef = useRef();
    const accessTokenRef = useRef(accessToken);
    const shownPickerRef = useRef(false);
    const setAccessToken = useCallback((t) => {
        uppy.log('Access token updated');
        setAccessTokenStored(t);
        accessTokenRef.current = t;
    }, [setAccessTokenStored, uppy]);
    // keep access token in sync with the ref
    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);
    const showPicker = useCallback(async (signal) => {
        let newAccessToken = accessToken;
        const doShowPicker = async (token) => {
            if (pickerType === 'drive') {
                await GooglePickerView_showDrivePicker({
                    token,
                    apiKey,
                    appId,
                    onFilesPicked,
                    signal,
                });
            }
            else {
                // photos
                const onPickingSessionChange = (newPickingSession) => {
                    pickingSessionRef.current = newPickingSession;
                };
                await GooglePickerView_showPhotosPicker({
                    token,
                    pickingSession: pickingSessionRef.current,
                    onPickingSessionChange,
                    signal,
                });
            }
        };
        setLoading(true);
        try {
            try {
                await GooglePickerView_ensureScriptsInjected(pickerType);
                if (newAccessToken == null) {
                    newAccessToken = await GooglePickerView_authorize({ clientId, pickerType });
                }
                if (newAccessToken == null)
                    throw new Error();
                await doShowPicker(newAccessToken);
                shownPickerRef.current = true;
                setAccessToken(newAccessToken);
            }
            catch (err) {
                if (err instanceof GooglePickerView_InvalidTokenError) {
                    uppy.log('Token is invalid or expired, reauthenticating');
                    newAccessToken = await GooglePickerView_authorize({
                        pickerType,
                        accessToken: newAccessToken,
                        clientId,
                    });
                    // now try again:
                    await doShowPicker(newAccessToken);
                    shownPickerRef.current = true;
                    setAccessToken(newAccessToken);
                }
                else {
                    throw err;
                }
            }
        }
        catch (err) {
            if (err instanceof Error &&
                'type' in err &&
                err.type === 'popup_closed') {
                // user closed the auth popup, ignore
            }
            else {
                setAccessToken(null);
                uppy.log(err);
            }
        }
        finally {
            setLoading(false);
        }
    }, [
        accessToken,
        apiKey,
        appId,
        clientId,
        onFilesPicked,
        pickerType,
        setAccessToken,
        uppy,
    ]);
    useEffect(() => {
        const abortController = new AbortController();
        GooglePickerView_pollPickingSession({
            pickingSessionRef,
            accessTokenRef,
            signal: abortController.signal,
            onFilesPicked,
            onError: (err) => uppy.log(err),
        });
        return () => abortController.abort();
    }, [onFilesPicked, uppy]);
    useEffect(() => {
        // when mounting, once we have a token, be nice to the user and automatically show the picker
        // accessToken === undefined means not yet loaded from storage, so wait for that first
        if (accessToken === undefined || shownPickerRef.current) {
            return undefined;
        }
        const abortController = new AbortController();
        showPicker(abortController.signal);
        return () => {
            // only abort the picker if it's not yet shown
            if (!shownPickerRef.current)
                abortController.abort();
        };
    }, [accessToken, showPicker]);
    const handleLogoutClick = useCallback(async () => {
        if (accessToken) {
            await GooglePickerView_logout(accessToken);
            setAccessToken(null);
            pickingSessionRef.current = undefined;
        }
    }, [accessToken, setAccessToken]);
    if (loading) {
        return GooglePickerView_jsxs("div", { children: [i18n('pleaseWait'), "..."] });
    }
    if (accessToken == null) {
        return (GooglePickerView_jsx(GooglePickerView_AuthView, { pluginName: pickerType === 'drive'
                ? i18n('pluginNameGoogleDrivePicker')
                : i18n('pluginNameGooglePhotosPicker'), pluginIcon: pickerType === 'drive' ? GooglePickerView_GoogleDriveIcon : GooglePickerView_GooglePhotosIcon, handleAuth: showPicker, i18n: i18n, loading: loading }));
    }
    return (GooglePickerView_jsxs("div", { style: { textAlign: 'center' }, children: [GooglePickerView_jsx("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary", style: { display: 'block', marginBottom: '1em' }, disabled: loading, onClick: () => showPicker(), children: pickerType === 'drive' ? i18n('pickFiles') : i18n('pickPhotos') }), GooglePickerView_jsx("button", { type: "button", className: "uppy-u-reset uppy-c-btn", disabled: loading, onClick: handleLogoutClick, children: i18n('logOut') })] }));
}

;// ./node_modules/@uppy/utils/lib/remoteFileObjToLocal.js

function remoteFileObjToLocal(file) {
    return {
        ...file,
        type: file.mimeType,
        extension: file.name ? getFileNameAndExtension(file.name).extension : null,
    };
}

// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(942);
;// ./node_modules/@uppy/provider-views/package.json
const provider_views_package_namespaceObject = {"rE":"4.5.3"};
;// ./node_modules/@uppy/utils/lib/VirtualList.js

/**
 * Adapted from preact-virtual-list: https://github.com/developit/preact-virtual-list
 *
 * © 2016 Jason Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Adaptations:
 * - Added role=presentation to helper elements
 * - Tweaked styles for Uppy's Dashboard use case
 */

const STYLE_INNER = {
    position: 'relative',
    // Disabled for our use case: the wrapper elements around FileList already deal with overflow,
    // and this additional property would hide things that we want to show.
    //
    // overflow: 'hidden',
    width: '100%',
    minHeight: '100%',
};
const STYLE_CONTENT = {
    position: 'absolute',
    top: 0,
    left: 0,
    // Because the `top` value gets set to some offset, this `height` being 100% would make the scrollbar
    // stretch far beyond the content. For our use case, the content div actually can get its height from
    // the elements inside it, so we don't need to specify a `height` property at all.
    //
    // height: '100%',
    width: '100%',
    overflow: 'visible',
};
class VirtualList extends preact_module_C {
    constructor(props) {
        super(props);
        // The currently focused node, used to retain focus when the visible rows change.
        // To avoid update loops, this should not cause state updates, so it's kept as a plain property.
        this.focusElement = null;
        this.state = {
            offset: 0,
            height: 0,
        };
    }
    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.handleResize);
    }
    // TODO: refactor to stable lifecycle method
    componentWillUpdate() {
        if (this.base.contains(document.activeElement)) {
            this.focusElement = document.activeElement;
        }
    }
    componentDidUpdate() {
        // Maintain focus when rows are added and removed.
        if (this.focusElement?.parentNode &&
            document.activeElement !== this.focusElement) {
            this.focusElement.focus();
        }
        this.focusElement = null;
        this.resize();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleScroll = () => {
        this.setState({ offset: this.base.scrollTop });
    };
    handleResize = () => {
        this.resize();
    };
    resize() {
        const { height } = this.state;
        if (height !== this.base.offsetHeight) {
            this.setState({
                height: this.base.offsetHeight,
            });
        }
    }
    render({ data, rowHeight, renderRow, overscanCount = 10, ...props }) {
        const { offset, height } = this.state;
        // first visible row index
        let start = Math.floor(offset / rowHeight);
        // actual number of visible rows (without overscan)
        let visibleRowCount = Math.floor(height / rowHeight);
        // Overscan: render blocks of rows modulo an overscan row count
        // This dramatically reduces DOM writes during scrolling
        if (overscanCount) {
            start = Math.max(0, start - (start % overscanCount));
            visibleRowCount += overscanCount;
        }
        // last visible + overscan row index + padding to allow keyboard focus to travel past the visible area
        const end = start + visibleRowCount + 4;
        // data slice currently in viewport plus overscan items
        const selection = data.slice(start, end);
        const styleInner = { ...STYLE_INNER, height: data.length * rowHeight };
        const styleContent = { ...STYLE_CONTENT, top: start * rowHeight };
        // The `role="presentation"` attributes ensure that these wrapper elements are not treated as list
        // items by accessibility and outline tools.
        return (jsxRuntime_module_u("div", { onScroll: this.handleScroll, ...props, children: jsxRuntime_module_u("div", { role: "presentation", style: styleInner, children: jsxRuntime_module_u("div", { role: "presentation", style: styleContent, children: selection.map(renderRow) }) }) }));
    }
}
/* harmony default export */ const lib_VirtualList = (VirtualList);

;// ./node_modules/@uppy/provider-views/lib/Item/components/ItemIcon.js

function FileIcon() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: 11, height: 14.5, viewBox: "0 0 44 58", children: jsxRuntime_module_u("path", { d: "M27.437.517a1 1 0 0 0-.094.03H4.25C2.037.548.217 2.368.217 4.58v48.405c0 2.212 1.82 4.03 4.03 4.03H39.03c2.21 0 4.03-1.818 4.03-4.03V15.61a1 1 0 0 0-.03-.28 1 1 0 0 0 0-.093 1 1 0 0 0-.03-.032 1 1 0 0 0 0-.03 1 1 0 0 0-.032-.063 1 1 0 0 0-.03-.063 1 1 0 0 0-.032 0 1 1 0 0 0-.03-.063 1 1 0 0 0-.032-.03 1 1 0 0 0-.03-.063 1 1 0 0 0-.063-.062l-14.593-14a1 1 0 0 0-.062-.062A1 1 0 0 0 28 .708a1 1 0 0 0-.374-.157 1 1 0 0 0-.156 0 1 1 0 0 0-.03-.03l-.003-.003zM4.25 2.547h22.218v9.97c0 2.21 1.82 4.03 4.03 4.03h10.564v36.438a2.02 2.02 0 0 1-2.032 2.032H4.25c-1.13 0-2.032-.9-2.032-2.032V4.58c0-1.13.902-2.032 2.03-2.032zm24.218 1.345l10.375 9.937.75.718H30.5c-1.13 0-2.032-.9-2.032-2.03V3.89z" }) }));
}
function FolderIcon() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", style: { minWidth: 16, marginRight: 3 }, viewBox: "0 0 276.157 276.157", children: jsxRuntime_module_u("path", { d: "M273.08 101.378c-3.3-4.65-8.86-7.32-15.254-7.32h-24.34V67.59c0-10.2-8.3-18.5-18.5-18.5h-85.322c-3.63 0-9.295-2.875-11.436-5.805l-6.386-8.735c-4.982-6.814-15.104-11.954-23.546-11.954H58.73c-9.292 0-18.638 6.608-21.737 15.372l-2.033 5.752c-.958 2.71-4.72 5.37-7.596 5.37H18.5C8.3 49.09 0 57.39 0 67.59v167.07c0 .886.16 1.73.443 2.52.152 3.306 1.18 6.424 3.053 9.064 3.3 4.652 8.86 7.32 15.255 7.32h188.487c11.395 0 23.27-8.425 27.035-19.18l40.677-116.188c2.11-6.035 1.43-12.164-1.87-16.816zM18.5 64.088h8.864c9.295 0 18.64-6.607 21.738-15.37l2.032-5.75c.96-2.712 4.722-5.373 7.597-5.373h29.565c3.63 0 9.295 2.876 11.437 5.806l6.386 8.735c4.982 6.815 15.104 11.954 23.546 11.954h85.322c1.898 0 3.5 1.602 3.5 3.5v26.47H69.34c-11.395 0-23.27 8.423-27.035 19.178L15 191.23V67.59c0-1.898 1.603-3.5 3.5-3.5zm242.29 49.15l-40.676 116.188c-1.674 4.78-7.812 9.135-12.877 9.135H18.75c-1.447 0-2.576-.372-3.02-.997-.442-.625-.422-1.814.057-3.18l40.677-116.19c1.674-4.78 7.812-9.134 12.877-9.134h188.487c1.448 0 2.577.372 3.02.997.443.625.423 1.814-.056 3.18z" }) }));
}
function VideoIcon() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", style: { width: 16, marginRight: 4 }, viewBox: "0 0 58 58", children: [jsxRuntime_module_u("path", { d: "M36.537 28.156l-11-7a1.005 1.005 0 0 0-1.02-.033C24.2 21.3 24 21.635 24 22v14a1 1 0 0 0 1.537.844l11-7a1.002 1.002 0 0 0 0-1.688zM26 34.18V23.82L34.137 29 26 34.18z" }), jsxRuntime_module_u("path", { d: "M57 6H1a1 1 0 0 0-1 1v44a1 1 0 0 0 1 1h56a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM10 28H2v-9h8v9zm-8 2h8v9H2v-9zm10 10V8h34v42H12V40zm44-12h-8v-9h8v9zm-8 2h8v9h-8v-9zm8-22v9h-8V8h8zM2 8h8v9H2V8zm0 42v-9h8v9H2zm54 0h-8v-9h8v9z" })] }));
}
function ItemIcon({ itemIconString, alt = undefined, }) {
    if (itemIconString === null)
        return null;
    switch (itemIconString) {
        case 'file':
            return jsxRuntime_module_u(FileIcon, {});
        case 'folder':
            return jsxRuntime_module_u(FolderIcon, {});
        case 'video':
            return jsxRuntime_module_u(VideoIcon, {});
        default: {
            return (jsxRuntime_module_u("img", { src: itemIconString, alt: alt, referrerPolicy: "no-referrer", loading: "lazy", width: 16, height: 16 }));
        }
    }
}

;// ./node_modules/@uppy/provider-views/lib/Item/components/GridItem.js


function GridItem({ file, toggleCheckbox, className, isDisabled, restrictionError, showTitles, children = null, i18n, }) {
    return (jsxRuntime_module_u("li", { className: className, title: isDisabled && restrictionError ? restrictionError : undefined, children: [jsxRuntime_module_u("input", { type: "checkbox", className: "uppy-u-reset uppy-ProviderBrowserItem-checkbox uppy-ProviderBrowserItem-checkbox--grid", onChange: toggleCheckbox, name: "listitem", id: file.id, checked: file.status === 'checked', disabled: isDisabled, "data-uppy-super-focusable": true }), jsxRuntime_module_u("label", { htmlFor: file.id, "aria-label": file.data.name ?? i18n('unnamed'), className: "uppy-u-reset uppy-ProviderBrowserItem-inner", children: [jsxRuntime_module_u(ItemIcon, { itemIconString: file.data.thumbnail || file.data.icon }), showTitles && (file.data.name ?? i18n('unnamed')), children] })] }));
}
/* harmony default export */ const components_GridItem = (GridItem);

;// ./node_modules/@uppy/provider-views/lib/Item/components/ListItem.js


function ListItem({ file, openFolder, className, isDisabled, restrictionError, toggleCheckbox, showTitles, i18n, }) {
    return (jsxRuntime_module_u("li", { className: className, title: file.status !== 'checked' && restrictionError
            ? restrictionError
            : undefined, children: [jsxRuntime_module_u("input", { type: "checkbox", className: "uppy-u-reset uppy-ProviderBrowserItem-checkbox", onChange: toggleCheckbox, 
                // for the <label/>
                name: "listitem", id: file.id, checked: file.status === 'checked', "aria-label": file.data.isFolder
                    ? i18n('allFilesFromFolderNamed', {
                        name: file.data.name ?? i18n('unnamed'),
                    })
                    : null, disabled: isDisabled, "data-uppy-super-focusable": true }), file.data.isFolder ? (
            // button to open a folder
            jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-ProviderBrowserItem-inner", onClick: () => openFolder(file.id), "aria-label": i18n('openFolderNamed', {
                    name: file.data.name ?? i18n('unnamed'),
                }), children: [jsxRuntime_module_u("div", { className: "uppy-ProviderBrowserItem-iconWrap", children: jsxRuntime_module_u(ItemIcon, { itemIconString: file.data.icon }) }), showTitles && file.data.name ? (jsxRuntime_module_u("span", { children: file.data.name })) : (i18n('unnamed'))] })) : (
            // label for a checkbox
            jsxRuntime_module_u("label", { htmlFor: file.id, className: "uppy-u-reset uppy-ProviderBrowserItem-inner", children: [jsxRuntime_module_u("div", { className: "uppy-ProviderBrowserItem-iconWrap", children: jsxRuntime_module_u(ItemIcon, { itemIconString: file.data.icon }) }), showTitles && (file.data.name ?? i18n('unnamed'))] }))] }));
}

;// ./node_modules/@uppy/provider-views/lib/Item/index.js




function Item(props) {
    const { viewType, toggleCheckbox, showTitles, i18n, openFolder, file, utmSource, } = props;
    const restrictionError = file.type === 'folder' ? null : file.restrictionError;
    const isDisabled = !!restrictionError && file.status !== 'checked';
    const ourProps = {
        file,
        openFolder,
        toggleCheckbox,
        utmSource,
        i18n,
        viewType,
        showTitles,
        className: classnames('uppy-ProviderBrowserItem', { 'uppy-ProviderBrowserItem--disabled': isDisabled }, { 'uppy-ProviderBrowserItem--noPreview': file.data.icon === 'video' }, { 'uppy-ProviderBrowserItem--is-checked': file.status === 'checked' }, { 'uppy-ProviderBrowserItem--is-partial': file.status === 'partial' }),
        isDisabled,
        restrictionError,
    };
    switch (viewType) {
        case 'grid':
            return jsxRuntime_module_u(components_GridItem, { ...ourProps });
        case 'list':
            return jsxRuntime_module_u(ListItem, { ...ourProps });
        case 'unsplash':
            return (jsxRuntime_module_u(components_GridItem, { ...ourProps, children: jsxRuntime_module_u("a", { href: `${file.data.author.url}?utm_source=${utmSource}&utm_medium=referral`, target: "_blank", rel: "noopener noreferrer", className: "uppy-ProviderBrowserItem-author", tabIndex: -1, children: file.data.author.name }) }));
        default:
            throw new Error(`There is no such type ${viewType}`);
    }
}

;// ./node_modules/@uppy/provider-views/lib/Browser.js




function Browser_Browser(props) {
    const { displayedPartialTree, viewType, toggleCheckbox, handleScroll, showTitles, i18n, isLoading, openFolder, noResultsLabel, virtualList, utmSource, } = props;
    const [isShiftKeyPressed, setIsShiftKeyPressed] = hooks_module_d(false);
    // This records whether the user is holding the SHIFT key this very moment.
    // Typically, this is implemented using `onClick((e) => e.shiftKey)` -
    // however we can't use that, because for accessibility reasons
    // we're using html tags that don't support `e.shiftKey` property (see #3768).
    hooks_module_h(() => {
        const handleKeyUp = (e) => {
            if (e.key === 'Shift')
                setIsShiftKeyPressed(false);
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Shift')
                setIsShiftKeyPressed(true);
        };
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    if (isLoading) {
        return (jsxRuntime_module_u("div", { className: "uppy-Provider-loading", children: typeof isLoading === 'string' ? isLoading : i18n('loading') }));
    }
    if (displayedPartialTree.length === 0) {
        return jsxRuntime_module_u("div", { className: "uppy-Provider-empty", children: noResultsLabel });
    }
    const renderItem = (item) => (jsxRuntime_module_u(Item, { viewType: viewType, toggleCheckbox: (event) => {
            event.stopPropagation();
            event.preventDefault();
            // Prevent shift-clicking from highlighting file names
            // (https://stackoverflow.com/a/1527797/3192470)
            document.getSelection()?.removeAllRanges();
            toggleCheckbox(item, isShiftKeyPressed);
        }, showTitles: showTitles, i18n: i18n, openFolder: openFolder, file: item, utmSource: utmSource }, item.id));
    // todo remove virtuallist option and always use virtual list
    if (virtualList) {
        return (jsxRuntime_module_u("div", { className: "uppy-ProviderBrowser-body", children: jsxRuntime_module_u(lib_VirtualList, { className: "uppy-ProviderBrowser-list", data: displayedPartialTree, renderRow: renderItem, rowHeight: 35.5 }) }));
    }
    return (jsxRuntime_module_u("div", { className: "uppy-ProviderBrowser-body", children: jsxRuntime_module_u("ul", { className: "uppy-ProviderBrowser-list", onScroll: handleScroll, 
            // making <ul> not focusable for firefox
            tabIndex: -1, children: displayedPartialTree.map(renderItem) }) }));
}
/* harmony default export */ const lib_Browser = (Browser_Browser);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/getNumberOfSelectedFiles.js
/**
 * We're interested in all 'checked' leaves of this tree,
 * but we don't yet know how many files there are inside of each checked folder.
 * `getNumberOfSelectedFiles()` returns the most intuitive number we can show to the user
 * in this situation.
 */
const getNumberOfSelectedFiles = (partialTree) => {
    const checkedLeaves = partialTree.filter((item) => {
        if (item.type === 'file' && item.status === 'checked') {
            return true;
        }
        if (item.type === 'folder' && item.status === 'checked') {
            const doesItHaveChildren = partialTree.some((i) => i.type !== 'root' && i.parentId === item.id);
            return !doesItHaveChildren;
        }
        return false;
    });
    return checkedLeaves.length;
};
/* harmony default export */ const PartialTreeUtils_getNumberOfSelectedFiles = (getNumberOfSelectedFiles);

;// ./node_modules/@uppy/provider-views/lib/FooterActions.js




function FooterActions({ cancelSelection, donePicking, i18n, partialTree, validateAggregateRestrictions, }) {
    const aggregateRestrictionError = hooks_module_T(() => {
        return validateAggregateRestrictions(partialTree);
    }, [partialTree, validateAggregateRestrictions]);
    const nOfSelectedFiles = hooks_module_T(() => {
        return PartialTreeUtils_getNumberOfSelectedFiles(partialTree);
    }, [partialTree]);
    if (nOfSelectedFiles === 0) {
        return null;
    }
    return (jsxRuntime_module_u("div", { className: "uppy-ProviderBrowser-footer", children: [jsxRuntime_module_u("div", { className: "uppy-ProviderBrowser-footer-buttons", children: [jsxRuntime_module_u("button", { className: classnames('uppy-u-reset uppy-c-btn uppy-c-btn-primary', {
                            'uppy-c-btn--disabled': aggregateRestrictionError,
                        }), disabled: !!aggregateRestrictionError, onClick: donePicking, type: "button", children: i18n('selectX', {
                            smart_count: nOfSelectedFiles,
                        }) }), jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-c-btn-link", onClick: cancelSelection, type: "button", children: i18n('cancel') })] }), aggregateRestrictionError && (jsxRuntime_module_u("div", { className: "uppy-ProviderBrowser-footer-error", children: aggregateRestrictionError }))] }));
}

;// ./node_modules/@uppy/provider-views/lib/SearchInput.js



function SearchInput({ searchString, setSearchString, submitSearchString, wrapperClassName, inputClassName, inputLabel, clearSearchLabel = '', showButton = false, buttonLabel = '', buttonCSSClassName = '', }) {
    const onInput = (e) => {
        setSearchString(e.target.value);
    };
    const submit = hooks_module_q((ev) => {
        ev.preventDefault();
        submitSearchString();
    }, [submitSearchString]);
    // We do this to avoid nested <form>s
    // (See https://github.com/transloadit/uppy/pull/5050#discussion_r1640392516)
    const [form] = hooks_module_d(() => {
        const formEl = document.createElement('form');
        formEl.setAttribute('tabindex', '-1');
        formEl.id = nanoid();
        return formEl;
    });
    hooks_module_h(() => {
        document.body.appendChild(form);
        form.addEventListener('submit', submit);
        return () => {
            form.removeEventListener('submit', submit);
            document.body.removeChild(form);
        };
    }, [form, submit]);
    return (jsxRuntime_module_u("section", { className: wrapperClassName, children: [jsxRuntime_module_u("input", { className: `uppy-u-reset ${inputClassName}`, type: "search", "aria-label": inputLabel, placeholder: inputLabel, value: searchString, onInput: onInput, form: form.id, "data-uppy-super-focusable": true }), !showButton && (
            // 🔍
            jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon uppy-ProviderBrowser-searchFilterIcon", width: "12", height: "12", viewBox: "0 0 12 12", children: jsxRuntime_module_u("path", { d: "M8.638 7.99l3.172 3.172a.492.492 0 1 1-.697.697L7.91 8.656a4.977 4.977 0 0 1-2.983.983C2.206 9.639 0 7.481 0 4.819 0 2.158 2.206 0 4.927 0c2.721 0 4.927 2.158 4.927 4.82a4.74 4.74 0 0 1-1.216 3.17zm-3.71.685c2.176 0 3.94-1.726 3.94-3.856 0-2.129-1.764-3.855-3.94-3.855C2.75.964.984 2.69.984 4.819c0 2.13 1.765 3.856 3.942 3.856z" }) })), !showButton && searchString && (
            // ❌
            jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-ProviderBrowser-searchFilterReset", type: "button", "aria-label": clearSearchLabel, title: clearSearchLabel, onClick: () => setSearchString(''), children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", viewBox: "0 0 19 19", children: jsxRuntime_module_u("path", { d: "M17.318 17.232L9.94 9.854 9.586 9.5l-.354.354-7.378 7.378h.707l-.62-.62v.706L9.318 9.94l.354-.354-.354-.354L1.94 1.854v.707l.62-.62h-.706l7.378 7.378.354.354.354-.354 7.378-7.378h-.707l.622.62v-.706L9.854 9.232l-.354.354.354.354 7.378 7.378.708-.707-7.38-7.378v.708l7.38-7.38.353-.353-.353-.353-.622-.622-.353-.353-.354.352-7.378 7.38h.708L2.56 1.23 2.208.88l-.353.353-.622.62-.353.355.352.353 7.38 7.38v-.708l-7.38 7.38-.353.353.352.353.622.622.353.353.354-.353 7.38-7.38h-.708l7.38 7.38z" }) }) })), showButton && (jsxRuntime_module_u("button", { className: `uppy-u-reset uppy-c-btn uppy-c-btn-primary ${buttonCSSClassName}`, type: "submit", form: form.id, children: buttonLabel }))] }));
}
/* harmony default export */ const lib_SearchInput = (SearchInput);

;// ./node_modules/@uppy/provider-views/lib/utils/getTagFile.js
// TODO: document what is a "tagFile" or get rid of this concept
const getTagFile = (file, plugin, provider) => {
    const tagFile = {
        id: file.id,
        source: plugin.id,
        name: file.name || file.id,
        type: file.mimeType,
        isRemote: true,
        data: file,
        preview: file.thumbnail || undefined,
        meta: {
            authorName: file.author?.name,
            authorUrl: file.author?.url,
            // We need to do this `|| null` check, because null value
            // for .relDirPath is `undefined` and for .relativePath is `null`.
            // I do think we should just use `null` everywhere.
            relativePath: file.relDirPath || null,
            absolutePath: file.absDirPath,
        },
        body: {
            fileId: file.id,
        },
        remote: {
            companionUrl: plugin.opts.companionUrl,
            url: `${provider.fileUrl(file.requestPath)}`,
            body: {
                fileId: file.id,
            },
            providerName: provider.name,
            provider: provider.provider,
            requestClientId: provider.provider,
        },
    };
    return tagFile;
};
/* harmony default export */ const utils_getTagFile = (getTagFile);

;// ./node_modules/@uppy/provider-views/lib/utils/addFiles.js


const addFiles = (companionFiles, plugin, provider) => {
    const tagFiles = companionFiles.map((f) => utils_getTagFile(f, plugin, provider));
    const filesToAdd = [];
    const filesAlreadyAdded = [];
    tagFiles.forEach((tagFile) => {
        if (plugin.uppy.checkIfFileAlreadyExists(getSafeFileId(tagFile, plugin.uppy.getID()))) {
            filesAlreadyAdded.push(tagFile);
        }
        else {
            filesToAdd.push(tagFile);
        }
    });
    if (filesToAdd.length > 0) {
        plugin.uppy.info(plugin.uppy.i18n('addedNumFiles', { numFiles: filesToAdd.length }));
    }
    if (filesAlreadyAdded.length > 0) {
        plugin.uppy.info(`Not adding ${filesAlreadyAdded.length} files because they already exist`);
    }
    plugin.uppy.addFiles(filesToAdd);
};
/* harmony default export */ const utils_addFiles = (addFiles);

;// ./node_modules/@uppy/provider-views/lib/utils/getClickedRange.js
// Shift-clicking selects a single consecutive list of items
// starting at the previous click.
const getClickedRange = (clickedId, displayedPartialTree, isShiftKeyPressed, lastCheckbox) => {
    const lastCheckboxIndex = displayedPartialTree.findIndex((item) => item.id === lastCheckbox);
    if (lastCheckboxIndex !== -1 && isShiftKeyPressed) {
        const newCheckboxIndex = displayedPartialTree.findIndex((item) => item.id === clickedId);
        const clickedRange = displayedPartialTree.slice(Math.min(lastCheckboxIndex, newCheckboxIndex), Math.max(lastCheckboxIndex, newCheckboxIndex) + 1);
        return clickedRange.map((item) => item.id);
    }
    return [clickedId];
};
/* harmony default export */ const utils_getClickedRange = (getClickedRange);

;// ./node_modules/@uppy/provider-views/lib/utils/handleError.js
const handleError = (uppy) => (error) => {
    // authError just means we're not authenticated, don't report it
    if (error.isAuthError) {
        return;
    }
    // AbortError means the user has clicked "cancel" on an operation
    if (error.name === 'AbortError') {
        uppy.log('Aborting request', 'warning');
        return;
    }
    uppy.log(error, 'error');
    if (error.name === 'UserFacingApiError') {
        uppy.info({
            message: uppy.i18n('companionError'),
            details: uppy.i18n(error.message),
        }, 'warning', 5000);
    }
};
/* harmony default export */ const utils_handleError = (handleError);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/getBreadcrumbs.js
const getBreadcrumbs = (partialTree, currentFolderId) => {
    let folder = partialTree.find((f) => f.id === currentFolderId);
    let breadcrumbs = [];
    while (true) {
        breadcrumbs = [folder, ...breadcrumbs];
        if (folder.type === 'root')
            break;
        const currentParentId = folder.parentId;
        folder = partialTree.find((f) => f.id === currentParentId);
    }
    return breadcrumbs;
};
/* harmony default export */ const PartialTreeUtils_getBreadcrumbs = (getBreadcrumbs);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/getCheckedFilesWithPaths.js
const getPath = (partialTree, id, cache) => {
    const sId = id === null ? 'null' : id;
    if (cache[sId])
        return cache[sId];
    const file = partialTree.find((f) => f.id === id);
    if (file.type === 'root')
        return [];
    const meAndParentPath = [...getPath(partialTree, file.parentId, cache), file];
    cache[sId] = meAndParentPath;
    return meAndParentPath;
};
// See "Uppy file properties" documentation for `.absolutePath` and `.relativePath`
// (https://uppy.io/docs/uppy/#working-with-uppy-files)
const getCheckedFilesWithPaths = (partialTree) => {
    // Equivalent to `const cache = {}`, but makes keys such as 'hasOwnProperty' safe too
    const cache = Object.create(null);
    // We're only interested in injecting paths into 'checked' files
    const checkedFiles = partialTree.filter((item) => item.type === 'file' && item.status === 'checked');
    const companionFilesWithInjectedPaths = checkedFiles.map((file) => {
        const absFolders = getPath(partialTree, file.id, cache);
        const firstCheckedFolderIndex = absFolders.findIndex((i) => i.type === 'folder' && i.status === 'checked');
        const relFolders = absFolders.slice(firstCheckedFolderIndex);
        const absDirPath = `/${absFolders.map((i) => i.data.name).join('/')}`;
        const relDirPath = relFolders.length === 1
            ? // Must return `undefined` (which later turns into `null` in `.getTagFile()`)
                // (https://github.com/transloadit/uppy/pull/4537#issuecomment-1629136652)
                undefined
            : relFolders.map((i) => i.data.name).join('/');
        return {
            ...file.data,
            absDirPath,
            relDirPath,
        };
    });
    return companionFilesWithInjectedPaths;
};
/* harmony default export */ const PartialTreeUtils_getCheckedFilesWithPaths = (getCheckedFilesWithPaths);

;// ./node_modules/eventemitter3/index.js
eventemitter3_namespaceFn();

;// ./node_modules/eventemitter3/index.mjs
/* unused harmony import specifier */ var eventemitter3_EventEmitter;



/* harmony default export */ const eventemitter3 = ((/* unused pure expression or super */ null && (eventemitter3_EventEmitter)));

;// ./node_modules/p-timeout/index.js
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function pTimeout(promise, options) {
	const {
		milliseconds,
		fallback,
		message,
		customTimers = {setTimeout, clearTimeout},
	} = options;

	let timer;
	let abortHandler;

	const wrappedPromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			abortHandler = () => {
				reject(getAbortedReason(signal));
			};

			signal.addEventListener('abort', abortHandler, {once: true});
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}

		// We create the error outside of `setTimeout` to preserve the stack trace.
		const timeoutError = new TimeoutError();

		timer = customTimers.setTimeout.call(undefined, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			if (message === false) {
				resolve();
			} else if (message instanceof Error) {
				reject(message);
			} else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	});

	const cancelablePromise = wrappedPromise.finally(() => {
		cancelablePromise.clear();
		if (abortHandler && options.signal) {
			options.signal.removeEventListener('abort', abortHandler);
		}
	});

	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(undefined, timer);
		timer = undefined;
	};

	return cancelablePromise;
}

;// ./node_modules/p-queue/dist/lower-bound.js
// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
function lowerBound(array, value, comparator) {
    let first = 0;
    let count = array.length;
    while (count > 0) {
        const step = Math.trunc(count / 2);
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
            first = ++it;
            count -= step + 1;
        }
        else {
            count = step;
        }
    }
    return first;
}

;// ./node_modules/p-queue/dist/priority-queue.js

class PriorityQueue {
    #queue = [];
    enqueue(run, options) {
        options = {
            priority: 0,
            ...options,
        };
        const element = {
            priority: options.priority,
            id: options.id,
            run,
        };
        if (this.size === 0 || this.#queue[this.size - 1].priority >= options.priority) {
            this.#queue.push(element);
            return;
        }
        const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
        this.#queue.splice(index, 0, element);
    }
    setPriority(id, priority) {
        const index = this.#queue.findIndex((element) => element.id === id);
        if (index === -1) {
            throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
        }
        const [item] = this.#queue.splice(index, 1);
        this.enqueue(item.run, { priority, id });
    }
    dequeue() {
        const item = this.#queue.shift();
        return item?.run;
    }
    filter(options) {
        return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
    }
    get size() {
        return this.#queue.length;
    }
}

;// ./node_modules/p-queue/dist/index.js



/**
Promise queue with concurrency control.
*/
class PQueue extends eventemitter3_namespaceFn() {
    #carryoverConcurrencyCount;
    #isIntervalIgnored;
    #intervalCount = 0;
    #intervalCap;
    #interval;
    #intervalEnd = 0;
    #intervalId;
    #timeoutId;
    #queue;
    #queueClass;
    #pending = 0;
    // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
    #concurrency;
    #isPaused;
    #throwOnTimeout;
    // Use to assign a unique identifier to a promise function, if not explicitly specified
    #idAssigner = 1n;
    /**
    Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.

    Applies to each future operation.
    */
    timeout;
    // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
    constructor(options) {
        super();
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        options = {
            carryoverConcurrencyCount: false,
            intervalCap: Number.POSITIVE_INFINITY,
            interval: 0,
            concurrency: Number.POSITIVE_INFINITY,
            autoStart: true,
            queueClass: PriorityQueue,
            ...options,
        };
        if (!(typeof options.intervalCap === 'number' && options.intervalCap >= 1)) {
            throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ''}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === undefined || !(Number.isFinite(options.interval) && options.interval >= 0)) {
            throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ''}\` (${typeof options.interval})`);
        }
        this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
        this.#intervalCap = options.intervalCap;
        this.#interval = options.interval;
        this.#queue = new options.queueClass();
        this.#queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this.timeout = options.timeout;
        this.#throwOnTimeout = options.throwOnTimeout === true;
        this.#isPaused = options.autoStart === false;
    }
    get #doesIntervalAllowAnother() {
        return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
    }
    get #doesConcurrentAllowAnother() {
        return this.#pending < this.#concurrency;
    }
    #next() {
        this.#pending--;
        this.#tryToStartAnother();
        this.emit('next');
    }
    #onResumeInterval() {
        this.#onInterval();
        this.#initializeIntervalIfNeeded();
        this.#timeoutId = undefined;
    }
    get #isIntervalPaused() {
        const now = Date.now();
        if (this.#intervalId === undefined) {
            const delay = this.#intervalEnd - now;
            if (delay < 0) {
                // Act as the interval was done
                // We don't need to resume it here because it will be resumed on line 160
                this.#intervalCount = (this.#carryoverConcurrencyCount) ? this.#pending : 0;
            }
            else {
                // Act as the interval is pending
                if (this.#timeoutId === undefined) {
                    this.#timeoutId = setTimeout(() => {
                        this.#onResumeInterval();
                    }, delay);
                }
                return true;
            }
        }
        return false;
    }
    #tryToStartAnother() {
        if (this.#queue.size === 0) {
            // We can clear the interval ("pause")
            // Because we can redo it later ("resume")
            if (this.#intervalId) {
                clearInterval(this.#intervalId);
            }
            this.#intervalId = undefined;
            this.emit('empty');
            if (this.#pending === 0) {
                this.emit('idle');
            }
            return false;
        }
        if (!this.#isPaused) {
            const canInitializeInterval = !this.#isIntervalPaused;
            if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
                const job = this.#queue.dequeue();
                if (!job) {
                    return false;
                }
                this.emit('active');
                job();
                if (canInitializeInterval) {
                    this.#initializeIntervalIfNeeded();
                }
                return true;
            }
        }
        return false;
    }
    #initializeIntervalIfNeeded() {
        if (this.#isIntervalIgnored || this.#intervalId !== undefined) {
            return;
        }
        this.#intervalId = setInterval(() => {
            this.#onInterval();
        }, this.#interval);
        this.#intervalEnd = Date.now() + this.#interval;
    }
    #onInterval() {
        if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = undefined;
        }
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
        this.#processQueue();
    }
    /**
    Executes all queued functions until it reaches the limit.
    */
    #processQueue() {
        // eslint-disable-next-line no-empty
        while (this.#tryToStartAnother()) { }
    }
    get concurrency() {
        return this.#concurrency;
    }
    set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === 'number' && newConcurrency >= 1)) {
            throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this.#concurrency = newConcurrency;
        this.#processQueue();
    }
    async #throwOnAbort(signal) {
        return new Promise((_resolve, reject) => {
            signal.addEventListener('abort', () => {
                reject(signal.reason);
            }, { once: true });
        });
    }
    /**
    Updates the priority of a promise function by its id, affecting its execution order. Requires a defined concurrency limit to take effect.

    For example, this can be used to prioritize a promise function to run earlier.

    ```js
    import PQueue from 'p-queue';

    const queue = new PQueue({concurrency: 1});

    queue.add(async () => '🦄', {priority: 1});
    queue.add(async () => '🦀', {priority: 0, id: '🦀'});
    queue.add(async () => '🦄', {priority: 1});
    queue.add(async () => '🦄', {priority: 1});

    queue.setPriority('🦀', 2);
    ```

    In this case, the promise function with `id: '🦀'` runs second.

    You can also deprioritize a promise function to delay its execution:

    ```js
    import PQueue from 'p-queue';

    const queue = new PQueue({concurrency: 1});

    queue.add(async () => '🦄', {priority: 1});
    queue.add(async () => '🦀', {priority: 1, id: '🦀'});
    queue.add(async () => '🦄');
    queue.add(async () => '🦄', {priority: 0});

    queue.setPriority('🦀', -1);
    ```
    Here, the promise function with `id: '🦀'` executes last.
    */
    setPriority(id, priority) {
        this.#queue.setPriority(id, priority);
    }
    async add(function_, options = {}) {
        // In case `id` is not defined.
        options.id ??= (this.#idAssigner++).toString();
        options = {
            timeout: this.timeout,
            throwOnTimeout: this.#throwOnTimeout,
            ...options,
        };
        return new Promise((resolve, reject) => {
            this.#queue.enqueue(async () => {
                this.#pending++;
                try {
                    options.signal?.throwIfAborted();
                    this.#intervalCount++;
                    let operation = function_({ signal: options.signal });
                    if (options.timeout) {
                        operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
                    }
                    if (options.signal) {
                        operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
                    }
                    const result = await operation;
                    resolve(result);
                    this.emit('completed', result);
                }
                catch (error) {
                    if (error instanceof TimeoutError && !options.throwOnTimeout) {
                        resolve();
                        return;
                    }
                    reject(error);
                    this.emit('error', error);
                }
                finally {
                    this.#next();
                }
            }, options);
            this.emit('add');
            this.#tryToStartAnother();
        });
    }
    async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
    }
    /**
    Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
    */
    start() {
        if (!this.#isPaused) {
            return this;
        }
        this.#isPaused = false;
        this.#processQueue();
        return this;
    }
    /**
    Put queue execution on hold.
    */
    pause() {
        this.#isPaused = true;
    }
    /**
    Clear the queue.
    */
    clear() {
        this.#queue = new this.#queueClass();
    }
    /**
    Can be called multiple times. Useful if you for example add additional items at a later time.

    @returns A promise that settles when the queue becomes empty.
    */
    async onEmpty() {
        // Instantly resolve if the queue is empty
        if (this.#queue.size === 0) {
            return;
        }
        await this.#onEvent('empty');
    }
    /**
    @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.

    If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.

    Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
    */
    async onSizeLessThan(limit) {
        // Instantly resolve if the queue is empty.
        if (this.#queue.size < limit) {
            return;
        }
        await this.#onEvent('next', () => this.#queue.size < limit);
    }
    /**
    The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.

    @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
    */
    async onIdle() {
        // Instantly resolve if none pending and if nothing else is queued
        if (this.#pending === 0 && this.#queue.size === 0) {
            return;
        }
        await this.#onEvent('idle');
    }
    async #onEvent(event, filter) {
        return new Promise(resolve => {
            const listener = () => {
                if (filter && !filter()) {
                    return;
                }
                this.off(event, listener);
                resolve();
            };
            this.on(event, listener);
        });
    }
    /**
    Size of the queue, the number of queued items waiting to run.
    */
    get size() {
        return this.#queue.size;
    }
    /**
    Size of the queue, filtered by the given options.

    For example, this can be used to find the number of items remaining in the queue with a specific priority level.
    */
    sizeBy(options) {
        // eslint-disable-next-line unicorn/no-array-callback-reference
        return this.#queue.filter(options).length;
    }
    /**
    Number of running items (no longer in the queue).
    */
    get pending() {
        return this.#pending;
    }
    /**
    Whether the queue is currently paused.
    */
    get isPaused() {
        return this.#isPaused;
    }
}

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/shallowClone.js
/**
 * One-level copying is sufficient as mutations within our `partialTree` are limited to properties
 * such as `.status`, `.cached`, `.nextPagePath`, and not `.data = { THIS }`.
 */
const shallowClone = (partialTree) => {
    return partialTree.map((item) => ({ ...item }));
};
/* harmony default export */ const PartialTreeUtils_shallowClone = (shallowClone);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/afterFill.js
// p-queue does not have a `"main"` field in its `package.json`, and that makes `import/no-unresolved` freak out.
// We can safely ignore it because bundlers will happily use the `"exports"` field instead.


const recursivelyFetch = async (queue, poorTree, poorFolder, apiList, validateSingleFile) => {
    let items = [];
    let currentPath = poorFolder.cached
        ? poorFolder.nextPagePath
        : poorFolder.id;
    while (currentPath) {
        const response = await apiList(currentPath);
        items = items.concat(response.items);
        currentPath = response.nextPagePath;
    }
    const newFolders = items.filter((i) => i.isFolder === true);
    const newFiles = items.filter((i) => i.isFolder === false);
    const folders = newFolders.map((folder) => ({
        type: 'folder',
        id: folder.requestPath,
        cached: false,
        nextPagePath: null,
        status: 'checked',
        parentId: poorFolder.id,
        data: folder,
    }));
    const files = newFiles.map((file) => {
        const restrictionError = validateSingleFile(file);
        return {
            type: 'file',
            id: file.requestPath,
            restrictionError,
            status: restrictionError ? 'unchecked' : 'checked',
            parentId: poorFolder.id,
            data: file,
        };
    });
    poorFolder.cached = true;
    poorFolder.nextPagePath = null;
    poorTree.push(...files, ...folders);
    folders.forEach(async (folder) => {
        queue.add(() => recursivelyFetch(queue, poorTree, folder, apiList, validateSingleFile));
    });
};
const afterFill = async (partialTree, apiList, validateSingleFile, reportProgress) => {
    const queue = new PQueue({ concurrency: 6 });
    // fill up the missing parts of a partialTree!
    const poorTree = PartialTreeUtils_shallowClone(partialTree);
    const poorFolders = poorTree.filter((item) => item.type === 'folder' &&
        item.status === 'checked' &&
        // either "not yet cached at all" or "some pages are left to fetch"
        (item.cached === false || item.nextPagePath));
    // per each poor folder, recursively fetch all files and make them .checked!
    poorFolders.forEach((poorFolder) => {
        queue.add(() => recursivelyFetch(queue, poorTree, poorFolder, apiList, validateSingleFile));
    });
    queue.on('completed', () => {
        const nOfFilesChecked = poorTree.filter((i) => i.type === 'file' && i.status === 'checked').length;
        reportProgress(nOfFilesChecked);
    });
    await queue.onIdle();
    return poorTree;
};
/* harmony default export */ const PartialTreeUtils_afterFill = (afterFill);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/afterOpenFolder.js
const afterOpenFolder = (oldPartialTree, discoveredItems, clickedFolder, currentPagePath, validateSingleFile) => {
    const discoveredFolders = discoveredItems.filter((i) => i.isFolder === true);
    const discoveredFiles = discoveredItems.filter((i) => i.isFolder === false);
    const isParentFolderChecked = clickedFolder.type === 'folder' && clickedFolder.status === 'checked';
    const folders = discoveredFolders.map((folder) => ({
        type: 'folder',
        id: folder.requestPath,
        cached: false,
        nextPagePath: null,
        status: isParentFolderChecked ? 'checked' : 'unchecked',
        parentId: clickedFolder.id,
        data: folder,
    }));
    const files = discoveredFiles.map((file) => {
        const restrictionError = validateSingleFile(file);
        return {
            type: 'file',
            id: file.requestPath,
            restrictionError,
            status: isParentFolderChecked && !restrictionError ? 'checked' : 'unchecked',
            parentId: clickedFolder.id,
            data: file,
        };
    });
    // just doing `clickedFolder.cached = true` in a non-mutating way
    const updatedClickedFolder = {
        ...clickedFolder,
        cached: true,
        nextPagePath: currentPagePath,
    };
    const partialTreeWithUpdatedClickedFolder = oldPartialTree.map((folder) => folder.id === updatedClickedFolder.id ? updatedClickedFolder : folder);
    const newPartialTree = [
        ...partialTreeWithUpdatedClickedFolder,
        ...folders,
        ...files,
    ];
    return newPartialTree;
};
/* harmony default export */ const PartialTreeUtils_afterOpenFolder = (afterOpenFolder);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/afterScrollFolder.js
const afterScrollFolder = (oldPartialTree, currentFolderId, items, nextPagePath, validateSingleFile) => {
    const currentFolder = oldPartialTree.find((i) => i.id === currentFolderId);
    const newFolders = items.filter((i) => i.isFolder === true);
    const newFiles = items.filter((i) => i.isFolder === false);
    // just doing `scrolledFolder.nextPagePath = ...` in a non-mutating way
    const scrolledFolder = { ...currentFolder, nextPagePath };
    const partialTreeWithUpdatedScrolledFolder = oldPartialTree.map((folder) => folder.id === scrolledFolder.id ? scrolledFolder : folder);
    const isParentFolderChecked = scrolledFolder.type === 'folder' && scrolledFolder.status === 'checked';
    const folders = newFolders.map((folder) => ({
        type: 'folder',
        id: folder.requestPath,
        cached: false,
        nextPagePath: null,
        status: isParentFolderChecked ? 'checked' : 'unchecked',
        parentId: scrolledFolder.id,
        data: folder,
    }));
    const files = newFiles.map((file) => {
        const restrictionError = validateSingleFile(file);
        return {
            type: 'file',
            id: file.requestPath,
            restrictionError,
            status: isParentFolderChecked && !restrictionError ? 'checked' : 'unchecked',
            parentId: scrolledFolder.id,
            data: file,
        };
    });
    const newPartialTree = [
        ...partialTreeWithUpdatedScrolledFolder,
        ...folders,
        ...files,
    ];
    return newPartialTree;
};
/* harmony default export */ const PartialTreeUtils_afterScrollFolder = (afterScrollFolder);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/afterToggleCheckbox.js

/*
  FROM        | TO

  root        |  root
    folder    |    folder
    folder ✅︎  |    folder ✅︎
      file    |      file ✅︎
      file    |      file ✅︎
      folder  |      folder ✅︎
        file  |        file ✅︎
    file      |    file
    file      |    file
*/
const percolateDown = (tree, id, shouldMarkAsChecked) => {
    const children = tree.filter((item) => item.type !== 'root' && item.parentId === id);
    children.forEach((item) => {
        item.status =
            shouldMarkAsChecked && !(item.type === 'file' && item.restrictionError)
                ? 'checked'
                : 'unchecked';
        percolateDown(tree, item.id, shouldMarkAsChecked);
    });
};
/*
  FROM         | TO

  root         |  root
    folder     |    folder
    folder     |    folder [▬] ('partial' status)
      file     |      file
      folder   |      folder ✅︎
        file ✅︎ |       file ✅︎
    file       |    file
    file       |    file
*/
const percolateUp = (tree, id) => {
    const folder = tree.find((item) => item.id === id);
    if (folder.type === 'root')
        return;
    const validChildren = tree.filter((item) => 
    // is a child
    item.type !== 'root' &&
        item.parentId === folder.id &&
        // does pass validations
        !(item.type === 'file' && item.restrictionError));
    const areAllChildrenChecked = validChildren.every((item) => item.status === 'checked');
    const areAllChildrenUnchecked = validChildren.every((item) => item.status === 'unchecked');
    if (areAllChildrenChecked) {
        folder.status = 'checked';
    }
    else if (areAllChildrenUnchecked) {
        folder.status = 'unchecked';
    }
    else {
        folder.status = 'partial';
    }
    percolateUp(tree, folder.parentId);
};
const afterToggleCheckbox = (oldTree, clickedRange) => {
    const tree = PartialTreeUtils_shallowClone(oldTree);
    if (clickedRange.length >= 2) {
        // We checked two or more items
        const newlyCheckedItems = tree.filter((item) => item.type !== 'root' && clickedRange.includes(item.id));
        newlyCheckedItems.forEach((item) => {
            if (item.type === 'file') {
                item.status = item.restrictionError ? 'unchecked' : 'checked';
            }
            else {
                item.status = 'checked';
            }
        });
        newlyCheckedItems.forEach((item) => {
            percolateDown(tree, item.id, true);
        });
        percolateUp(tree, newlyCheckedItems[0].parentId);
    }
    else {
        // We checked exactly one item
        const clickedItem = tree.find((item) => item.id === clickedRange[0]);
        clickedItem.status =
            clickedItem.status === 'checked' ? 'unchecked' : 'checked';
        percolateDown(tree, clickedItem.id, clickedItem.status === 'checked');
        percolateUp(tree, clickedItem.parentId);
    }
    return tree;
};
/* harmony default export */ const PartialTreeUtils_afterToggleCheckbox = (afterToggleCheckbox);

;// ./node_modules/@uppy/provider-views/lib/utils/PartialTreeUtils/index.js




/* harmony default export */ const PartialTreeUtils = ({
    afterOpenFolder: PartialTreeUtils_afterOpenFolder,
    afterScrollFolder: PartialTreeUtils_afterScrollFolder,
    afterToggleCheckbox: PartialTreeUtils_afterToggleCheckbox,
    afterFill: PartialTreeUtils_afterFill,
});

;// ./node_modules/@uppy/provider-views/lib/utils/shouldHandleScroll.js
const shouldHandleScroll = (event) => {
    const { scrollHeight, scrollTop, offsetHeight } = event.target;
    const scrollPosition = scrollHeight - (scrollTop + offsetHeight);
    return scrollPosition < 50;
};
/* harmony default export */ const utils_shouldHandleScroll = (shouldHandleScroll);

;// ./node_modules/@uppy/provider-views/lib/Breadcrumbs.js


function Breadcrumbs(props) {
    const { openFolder, title, breadcrumbsIcon, breadcrumbs, i18n } = props;
    return (jsxRuntime_module_u("div", { className: "uppy-Provider-breadcrumbs", children: [jsxRuntime_module_u("div", { className: "uppy-Provider-breadcrumbsIcon", children: breadcrumbsIcon }), breadcrumbs.map((folder, index) => (jsxRuntime_module_u(preact_module_S, { children: [jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn", onClick: () => openFolder(folder.id), children: folder.type === 'root'
                            ? title
                            : (folder.data.name ?? i18n('unnamed')) }, folder.id), breadcrumbs.length === index + 1 ? '' : ' / '] })))] }));
}

;// ./node_modules/@uppy/provider-views/lib/ProviderView/User.js


function User({ i18n, logout, username }) {
    return (jsxRuntime_module_u(preact_module_S, { children: [username && (jsxRuntime_module_u("span", { className: "uppy-ProviderBrowser-user", children: username }, "username")), jsxRuntime_module_u("button", { type: "button", onClick: logout, className: "uppy-u-reset uppy-c-btn uppy-ProviderBrowser-userLogout", children: i18n('logOut') }, "logout")] }));
}

;// ./node_modules/@uppy/provider-views/lib/ProviderView/Header.js




function Header(props) {
    return (jsxRuntime_module_u("div", { className: "uppy-ProviderBrowser-header", children: jsxRuntime_module_u("div", { className: classnames('uppy-ProviderBrowser-headerBar', !props.showBreadcrumbs && 'uppy-ProviderBrowser-headerBar--simple'), children: [props.showBreadcrumbs && (jsxRuntime_module_u(Breadcrumbs, { openFolder: props.openFolder, breadcrumbs: props.breadcrumbs, breadcrumbsIcon: props.pluginIcon?.(), title: props.title, i18n: props.i18n })), jsxRuntime_module_u(User, { logout: props.logout, username: props.username, i18n: props.i18n })] }) }));
}

;// ./node_modules/@uppy/provider-views/lib/ProviderView/ProviderView.js

















function defaultPickerIcon() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", width: "30", height: "30", viewBox: "0 0 30 30", children: jsxRuntime_module_u("path", { d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z" }) }));
}
const getDefaultState = (rootFolderId) => ({
    authenticated: undefined, // we don't know yet
    partialTree: [
        {
            type: 'root',
            id: rootFolderId,
            cached: false,
            nextPagePath: null,
        },
    ],
    currentFolderId: rootFolderId,
    searchString: '',
    didFirstRender: false,
    username: null,
    loading: false,
});
/**
 * Class to easily generate generic views for Provider plugins
 */
class ProviderView {
    static VERSION = provider_views_package_namespaceObject.rE;
    plugin;
    provider;
    opts;
    isHandlingScroll = false;
    lastCheckbox = null;
    constructor(plugin, opts) {
        this.plugin = plugin;
        this.provider = opts.provider;
        const defaultOptions = {
            viewType: 'list',
            showTitles: true,
            showFilter: true,
            showBreadcrumbs: true,
            loadAllFiles: false,
            virtualList: false,
        };
        this.opts = { ...defaultOptions, ...opts };
        this.openFolder = this.openFolder.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.resetPluginState = this.resetPluginState.bind(this);
        this.donePicking = this.donePicking.bind(this);
        this.render = this.render.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        // Set default state for the plugin
        this.resetPluginState();
        // todo
        // @ts-expect-error this should be typed in @uppy/dashboard.
        this.plugin.uppy.on('dashboard:close-panel', this.resetPluginState);
        this.plugin.uppy.registerRequestClient(this.provider.provider, this.provider);
    }
    resetPluginState() {
        this.plugin.setPluginState(getDefaultState(this.plugin.rootFolderId));
    }
    tearDown() {
        // Nothing.
    }
    setLoading(loading) {
        this.plugin.setPluginState({ loading });
    }
    cancelSelection() {
        const { partialTree } = this.plugin.getPluginState();
        const newPartialTree = partialTree.map((item) => item.type === 'root' ? item : { ...item, status: 'unchecked' });
        this.plugin.setPluginState({ partialTree: newPartialTree });
    }
    #abortController;
    async #withAbort(op) {
        // prevent multiple requests in parallel from causing race conditions
        this.#abortController?.abort();
        const abortController = new AbortController();
        this.#abortController = abortController;
        const cancelRequest = () => {
            abortController.abort();
        };
        try {
            // @ts-expect-error this should be typed in @uppy/dashboard.
            // Even then I don't think we can make this work without adding dashboard
            // as a dependency to provider-views.
            this.plugin.uppy.on('dashboard:close-panel', cancelRequest);
            this.plugin.uppy.on('cancel-all', cancelRequest);
            await op(abortController.signal);
        }
        finally {
            // @ts-expect-error this should be typed in @uppy/dashboard.
            // Even then I don't think we can make this work without adding dashboard
            // as a dependency to provider-views.
            this.plugin.uppy.off('dashboard:close-panel', cancelRequest);
            this.plugin.uppy.off('cancel-all', cancelRequest);
            this.#abortController = undefined;
        }
    }
    async openFolder(folderId) {
        this.lastCheckbox = null;
        // Returning cached folder
        const { partialTree } = this.plugin.getPluginState();
        const clickedFolder = partialTree.find((folder) => folder.id === folderId);
        if (clickedFolder.cached) {
            this.plugin.setPluginState({
                currentFolderId: folderId,
                searchString: '',
            });
            return;
        }
        this.setLoading(true);
        await this.#withAbort(async (signal) => {
            let currentPagePath = folderId;
            let currentItems = [];
            do {
                const { username, nextPagePath, items } = await this.provider.list(currentPagePath, { signal });
                // It's important to set the username during one of our first fetches
                this.plugin.setPluginState({ username });
                currentPagePath = nextPagePath;
                currentItems = currentItems.concat(items);
                this.setLoading(this.plugin.uppy.i18n('loadedXFiles', {
                    numFiles: currentItems.length,
                }));
            } while (this.opts.loadAllFiles && currentPagePath);
            const newPartialTree = PartialTreeUtils.afterOpenFolder(partialTree, currentItems, clickedFolder, currentPagePath, this.validateSingleFile);
            this.plugin.setPluginState({
                partialTree: newPartialTree,
                currentFolderId: folderId,
                searchString: '',
            });
        }).catch(utils_handleError(this.plugin.uppy));
        this.setLoading(false);
    }
    /**
     * Removes session token on client side.
     */
    async logout() {
        await this.#withAbort(async (signal) => {
            const res = await this.provider.logout({
                signal,
            });
            // res.ok is from the JSON body, not to be confused with Response.ok
            if (res.ok) {
                if (!res.revoked) {
                    const message = this.plugin.uppy.i18n('companionUnauthorizeHint', {
                        provider: this.plugin.title,
                        url: res.manual_revoke_url,
                    });
                    this.plugin.uppy.info(message, 'info', 7000);
                }
                this.plugin.setPluginState({
                    ...getDefaultState(this.plugin.rootFolderId),
                    authenticated: false,
                });
            }
        }).catch(utils_handleError(this.plugin.uppy));
    }
    async handleAuth(authFormData) {
        await this.#withAbort(async (signal) => {
            this.setLoading(true);
            await this.provider.login({ authFormData, signal });
            this.plugin.setPluginState({ authenticated: true });
            await Promise.all([
                this.provider.fetchPreAuthToken(),
                this.openFolder(this.plugin.rootFolderId),
            ]);
        }).catch(utils_handleError(this.plugin.uppy));
        this.setLoading(false);
    }
    async handleScroll(event) {
        const { partialTree, currentFolderId } = this.plugin.getPluginState();
        const currentFolder = partialTree.find((i) => i.id === currentFolderId);
        if (utils_shouldHandleScroll(event) &&
            !this.isHandlingScroll &&
            currentFolder.nextPagePath) {
            this.isHandlingScroll = true;
            await this.#withAbort(async (signal) => {
                const { nextPagePath, items } = await this.provider.list(currentFolder.nextPagePath, { signal });
                const newPartialTree = PartialTreeUtils.afterScrollFolder(partialTree, currentFolderId, items, nextPagePath, this.validateSingleFile);
                this.plugin.setPluginState({ partialTree: newPartialTree });
            }).catch(utils_handleError(this.plugin.uppy));
            this.isHandlingScroll = false;
        }
    }
    validateSingleFile = (file) => {
        const companionFile = remoteFileObjToLocal(file);
        const result = this.plugin.uppy.validateSingleFile(companionFile);
        return result;
    };
    async donePicking() {
        const { partialTree } = this.plugin.getPluginState();
        this.setLoading(true);
        await this.#withAbort(async (signal) => {
            // 1. Enrich our partialTree by fetching all 'checked' but not-yet-fetched folders
            const enrichedTree = await PartialTreeUtils.afterFill(partialTree, (path) => this.provider.list(path, { signal }), this.validateSingleFile, (n) => {
                this.setLoading(this.plugin.uppy.i18n('addedNumFiles', { numFiles: n }));
            });
            // 2. Now that we know how many files there are - recheck aggregateRestrictions!
            const aggregateRestrictionError = this.validateAggregateRestrictions(enrichedTree);
            if (aggregateRestrictionError) {
                this.plugin.setPluginState({ partialTree: enrichedTree });
                return;
            }
            // 3. Add files
            const companionFiles = PartialTreeUtils_getCheckedFilesWithPaths(enrichedTree);
            utils_addFiles(companionFiles, this.plugin, this.provider);
            // 4. Reset state
            this.resetPluginState();
        }).catch(utils_handleError(this.plugin.uppy));
        this.setLoading(false);
    }
    toggleCheckbox(ourItem, isShiftKeyPressed) {
        const { partialTree } = this.plugin.getPluginState();
        const clickedRange = utils_getClickedRange(ourItem.id, this.getDisplayedPartialTree(), isShiftKeyPressed, this.lastCheckbox);
        const newPartialTree = PartialTreeUtils.afterToggleCheckbox(partialTree, clickedRange);
        this.plugin.setPluginState({ partialTree: newPartialTree });
        this.lastCheckbox = ourItem.id;
    }
    getDisplayedPartialTree = () => {
        const { partialTree, currentFolderId, searchString } = this.plugin.getPluginState();
        const inThisFolder = partialTree.filter((item) => item.type !== 'root' && item.parentId === currentFolderId);
        const filtered = searchString === ''
            ? inThisFolder
            : inThisFolder.filter((item) => (item.data.name ?? this.plugin.uppy.i18n('unnamed'))
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) !== -1);
        return filtered;
    };
    getBreadcrumbs = () => {
        const { partialTree, currentFolderId } = this.plugin.getPluginState();
        return PartialTreeUtils_getBreadcrumbs(partialTree, currentFolderId);
    };
    getSelectedAmount = () => {
        const { partialTree } = this.plugin.getPluginState();
        return PartialTreeUtils_getNumberOfSelectedFiles(partialTree);
    };
    validateAggregateRestrictions = (partialTree) => {
        const checkedFiles = partialTree.filter((item) => item.type === 'file' && item.status === 'checked');
        const uppyFiles = checkedFiles.map((file) => file.data);
        return this.plugin.uppy.validateAggregateRestrictions(uppyFiles);
    };
    render(state, viewOptions = {}) {
        const { didFirstRender } = this.plugin.getPluginState();
        const { i18n } = this.plugin.uppy;
        if (!didFirstRender) {
            this.plugin.setPluginState({ didFirstRender: true });
            this.provider.fetchPreAuthToken();
            this.openFolder(this.plugin.rootFolderId);
        }
        const opts = { ...this.opts, ...viewOptions };
        const { authenticated, loading } = this.plugin.getPluginState();
        const pluginIcon = this.plugin.icon || defaultPickerIcon;
        if (authenticated === false) {
            return (jsxRuntime_module_u(AuthView, { pluginName: this.plugin.title, pluginIcon: pluginIcon, handleAuth: this.handleAuth, i18n: this.plugin.uppy.i18n, renderForm: opts.renderAuthForm, loading: loading }));
        }
        const { partialTree, username, searchString } = this.plugin.getPluginState();
        const breadcrumbs = this.getBreadcrumbs();
        return (jsxRuntime_module_u("div", { className: classnames('uppy-ProviderBrowser', `uppy-ProviderBrowser-viewType--${opts.viewType}`), children: [jsxRuntime_module_u(Header, { showBreadcrumbs: opts.showBreadcrumbs, openFolder: this.openFolder, breadcrumbs: breadcrumbs, pluginIcon: pluginIcon, title: this.plugin.title, logout: this.logout, username: username, i18n: i18n }), opts.showFilter && (jsxRuntime_module_u(lib_SearchInput, { searchString: searchString, setSearchString: (s) => {
                        this.plugin.setPluginState({ searchString: s });
                    }, submitSearchString: () => { }, inputLabel: i18n('filter'), clearSearchLabel: i18n('resetFilter'), wrapperClassName: "uppy-ProviderBrowser-searchFilter", inputClassName: "uppy-ProviderBrowser-searchFilterInput" })), jsxRuntime_module_u(lib_Browser, { toggleCheckbox: this.toggleCheckbox, displayedPartialTree: this.getDisplayedPartialTree(), openFolder: this.openFolder, virtualList: opts.virtualList, noResultsLabel: i18n('noFilesFound'), handleScroll: this.handleScroll, viewType: opts.viewType, showTitles: opts.showTitles, i18n: this.plugin.uppy.i18n, isLoading: loading, utmSource: "Companion" }), jsxRuntime_module_u(FooterActions, { partialTree: partialTree, donePicking: this.donePicking, cancelSelection: this.cancelSelection, i18n: i18n, validateAggregateRestrictions: this.validateAggregateRestrictions })] }));
    }
}

;// ./node_modules/@uppy/provider-views/lib/ProviderView/index.js


;// ./node_modules/@uppy/provider-views/lib/SearchProviderView/SearchProviderView.js













const defaultState = {
    loading: false,
    searchString: '',
    partialTree: [
        {
            type: 'root',
            id: null,
            cached: false,
            nextPagePath: null,
        },
    ],
    currentFolderId: null,
    isInputMode: true,
};
const defaultOptions = {
    viewType: 'grid',
    showTitles: true,
    showFilter: true,
    utmSource: 'Companion',
};
/**
 * SearchProviderView, used for Unsplash and future image search providers.
 * Extends generic View, shared with regular providers like Google Drive and Instagram.
 */
class SearchProviderView {
    static VERSION = provider_views_package_namespaceObject.rE;
    plugin;
    provider;
    opts;
    isHandlingScroll = false;
    lastCheckbox = null;
    constructor(plugin, opts) {
        this.plugin = plugin;
        this.provider = opts.provider;
        this.opts = { ...defaultOptions, ...opts };
        this.setSearchString = this.setSearchString.bind(this);
        this.search = this.search.bind(this);
        this.resetPluginState = this.resetPluginState.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.donePicking = this.donePicking.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.render = this.render.bind(this);
        // Set default state for the plugin
        this.resetPluginState();
        // @ts-expect-error this should be typed in @uppy/dashboard.
        this.plugin.uppy.on('dashboard:close-panel', this.resetPluginState);
        this.plugin.uppy.registerRequestClient(this.provider.provider, this.provider);
    }
    tearDown() {
        // Nothing.
    }
    setLoading(loading) {
        this.plugin.setPluginState({ loading });
    }
    resetPluginState() {
        this.plugin.setPluginState(defaultState);
    }
    cancelSelection() {
        const { partialTree } = this.plugin.getPluginState();
        const newPartialTree = partialTree.map((item) => item.type === 'root' ? item : { ...item, status: 'unchecked' });
        this.plugin.setPluginState({ partialTree: newPartialTree });
    }
    async search() {
        const { searchString } = this.plugin.getPluginState();
        if (searchString === '')
            return;
        this.setLoading(true);
        try {
            const response = await this.provider.search(searchString);
            const newPartialTree = [
                {
                    type: 'root',
                    id: null,
                    cached: false,
                    nextPagePath: response.nextPageQuery,
                },
                ...response.items.map((item) => ({
                    type: 'file',
                    id: item.requestPath,
                    status: 'unchecked',
                    parentId: null,
                    data: item,
                })),
            ];
            this.plugin.setPluginState({
                partialTree: newPartialTree,
                isInputMode: false,
            });
        }
        catch (error) {
            utils_handleError(this.plugin.uppy)(error);
        }
        this.setLoading(false);
    }
    async handleScroll(event) {
        const { partialTree, searchString } = this.plugin.getPluginState();
        const root = partialTree.find((i) => i.type === 'root');
        if (utils_shouldHandleScroll(event) &&
            !this.isHandlingScroll &&
            root.nextPagePath) {
            this.isHandlingScroll = true;
            try {
                const response = await this.provider.search(searchString, root.nextPagePath);
                const newRoot = {
                    ...root,
                    nextPagePath: response.nextPageQuery,
                };
                const oldItems = partialTree.filter((i) => i.type !== 'root');
                const newPartialTree = [
                    newRoot,
                    ...oldItems,
                    ...response.items.map((item) => ({
                        type: 'file',
                        id: item.requestPath,
                        status: 'unchecked',
                        parentId: null,
                        data: item,
                    })),
                ];
                this.plugin.setPluginState({ partialTree: newPartialTree });
            }
            catch (error) {
                utils_handleError(this.plugin.uppy)(error);
            }
            this.isHandlingScroll = false;
        }
    }
    async donePicking() {
        const { partialTree } = this.plugin.getPluginState();
        // 1. Add files
        const companionFiles = PartialTreeUtils_getCheckedFilesWithPaths(partialTree);
        utils_addFiles(companionFiles, this.plugin, this.provider);
        // 2. Reset state
        this.resetPluginState();
    }
    toggleCheckbox(ourItem, isShiftKeyPressed) {
        const { partialTree } = this.plugin.getPluginState();
        const clickedRange = utils_getClickedRange(ourItem.id, this.getDisplayedPartialTree(), isShiftKeyPressed, this.lastCheckbox);
        const newPartialTree = PartialTreeUtils.afterToggleCheckbox(partialTree, clickedRange);
        this.plugin.setPluginState({ partialTree: newPartialTree });
        this.lastCheckbox = ourItem.id;
    }
    validateSingleFile = (file) => {
        const companionFile = remoteFileObjToLocal(file);
        const result = this.plugin.uppy.validateSingleFile(companionFile);
        return result;
    };
    getDisplayedPartialTree = () => {
        const { partialTree } = this.plugin.getPluginState();
        return partialTree.filter((item) => item.type !== 'root');
    };
    setSearchString = (searchString) => {
        this.plugin.setPluginState({ searchString });
        if (searchString === '') {
            this.plugin.setPluginState({ partialTree: [] });
        }
    };
    validateAggregateRestrictions = (partialTree) => {
        const checkedFiles = partialTree.filter((item) => item.type === 'file' && item.status === 'checked');
        const uppyFiles = checkedFiles.map((file) => file.data);
        return this.plugin.uppy.validateAggregateRestrictions(uppyFiles);
    };
    render(state, viewOptions = {}) {
        const { isInputMode, searchString, loading, partialTree } = this.plugin.getPluginState();
        const { i18n } = this.plugin.uppy;
        const opts = { ...this.opts, ...viewOptions };
        if (isInputMode) {
            return (jsxRuntime_module_u(lib_SearchInput, { searchString: searchString, setSearchString: this.setSearchString, submitSearchString: this.search, inputLabel: i18n('enterTextToSearch'), buttonLabel: i18n('searchImages'), wrapperClassName: "uppy-SearchProvider", inputClassName: "uppy-c-textInput uppy-SearchProvider-input", showButton: true, buttonCSSClassName: "uppy-SearchProvider-searchButton" }));
        }
        return (jsxRuntime_module_u("div", { className: classnames('uppy-ProviderBrowser', `uppy-ProviderBrowser-viewType--${opts.viewType}`), children: [opts.showFilter && (jsxRuntime_module_u(lib_SearchInput, { searchString: searchString, setSearchString: this.setSearchString, submitSearchString: this.search, inputLabel: i18n('search'), clearSearchLabel: i18n('resetSearch'), wrapperClassName: "uppy-ProviderBrowser-searchFilter", inputClassName: "uppy-ProviderBrowser-searchFilterInput" })), jsxRuntime_module_u(lib_Browser, { toggleCheckbox: this.toggleCheckbox, displayedPartialTree: this.getDisplayedPartialTree(), handleScroll: this.handleScroll, openFolder: async () => { }, noResultsLabel: i18n('noSearchResults'), viewType: opts.viewType, showTitles: opts.showTitles, isLoading: loading, i18n: i18n, virtualList: false, utmSource: this.opts.utmSource }), jsxRuntime_module_u(FooterActions, { partialTree: partialTree, donePicking: this.donePicking, cancelSelection: this.cancelSelection, i18n: i18n, validateAggregateRestrictions: this.validateAggregateRestrictions })] }));
    }
}

;// ./node_modules/@uppy/provider-views/lib/SearchProviderView/index.js


;// ./node_modules/@uppy/provider-views/lib/index.js





;// ./node_modules/@uppy/utils/lib/emaFilter.js
/**
 * Low-pass filter using Exponential Moving Averages (aka exponential smoothing)
 * Filters a sequence of values by updating the mixing the previous output value
 * with the new input using the exponential window function
 *
 * @param newValue the n-th value of the sequence
 * @param previousSmoothedValue the exponential average of the first n-1 values
 * @param halfLife value of `dt` to move the smoothed value halfway between `previousFilteredValue` and `newValue`
 * @param dt time elapsed between adding the (n-1)th and the n-th values
 * @returns the exponential average of the first n values
 */
function emaFilter(newValue, previousSmoothedValue, halfLife, dt) {
    if (halfLife === 0 || newValue === previousSmoothedValue)
        return newValue;
    if (dt === 0)
        return previousSmoothedValue;
    return newValue + (previousSmoothedValue - newValue) * 2 ** (-dt / halfLife);
}

;// ./node_modules/@uppy/status-bar/package.json
const status_bar_package_namespaceObject = {"rE":"4.2.3"};
;// ./node_modules/@uppy/status-bar/lib/locale.js
/* harmony default export */ const lib_locale = ({
    strings: {
        // Shown in the status bar while files are being uploaded.
        uploading: 'Uploading',
        // Shown in the status bar once all files have been uploaded.
        complete: 'Complete',
        // Shown in the status bar if an upload failed.
        uploadFailed: 'Upload failed',
        // Shown in the status bar while the upload is paused.
        paused: 'Paused',
        // Used as the label for the button that retries an upload.
        retry: 'Retry',
        // Used as the label for the button that cancels an upload.
        cancel: 'Cancel',
        // Used as the label for the button that pauses an upload.
        pause: 'Pause',
        // Used as the label for the button that resumes an upload.
        resume: 'Resume',
        // Used as the label for the button that resets the upload state after an upload
        done: 'Done',
        // When `showProgressDetails` is set, shows the number of files that have been fully uploaded so far.
        filesUploadedOfTotal: {
            0: '%{complete} of %{smart_count} file uploaded',
            1: '%{complete} of %{smart_count} files uploaded',
        },
        // When `showProgressDetails` is set, shows the amount of bytes that have been uploaded so far.
        dataUploadedOfTotal: '%{complete} of %{total}',
        dataUploadedOfUnknown: '%{complete} of unknown',
        // When `showProgressDetails` is set, shows an estimation of how long the upload will take to complete.
        xTimeLeft: '%{time} left',
        // Used as the label for the button that starts an upload.
        uploadXFiles: {
            0: 'Upload %{smart_count} file',
            1: 'Upload %{smart_count} files',
        },
        // Used as the label for the button that starts an upload, if another upload has been started in the past
        // and new files were added later.
        uploadXNewFiles: {
            0: 'Upload +%{smart_count} file',
            1: 'Upload +%{smart_count} files',
        },
        upload: 'Upload',
        retryUpload: 'Retry upload',
        xMoreFilesAdded: {
            0: '%{smart_count} more file added',
            1: '%{smart_count} more files added',
        },
        showErrorDetails: 'Show error details',
    },
});

;// ./node_modules/@uppy/status-bar/lib/StatusBarStates.js
/* harmony default export */ const StatusBarStates = ({
    STATE_ERROR: 'error',
    STATE_WAITING: 'waiting',
    STATE_PREPROCESSING: 'preprocessing',
    STATE_UPLOADING: 'uploading',
    STATE_POSTPROCESSING: 'postprocessing',
    STATE_COMPLETE: 'complete',
});

;// ./node_modules/@uppy/utils/lib/secondsToTime.js
function secondsToTime(rawSeconds) {
    const hours = Math.floor(rawSeconds / 3600) % 24;
    const minutes = Math.floor(rawSeconds / 60) % 60;
    const seconds = Math.floor(rawSeconds % 60);
    return { hours, minutes, seconds };
}

;// ./node_modules/@uppy/utils/lib/prettyETA.js

function prettyETA(seconds) {
    const time = secondsToTime(seconds);
    // Only display hours and minutes if they are greater than 0 but always
    // display minutes if hours is being displayed
    // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s
    const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
    const minutesStr = time.minutes === 0
        ? ''
        : `${time.hours === 0
            ? time.minutes
            : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
    const secondsStr = time.hours !== 0
        ? ''
        : `${time.minutes === 0
            ? time.seconds
            : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
    return `${hoursStr}${minutesStr}${secondsStr}`;
}

;// ./node_modules/@uppy/status-bar/lib/Components.js






const DOT = `\u00B7`;
const renderDot = () => ` ${DOT} `;
function UploadBtn(props) {
    const { newFiles, isUploadStarted, recoveredState, i18n, uploadState, isSomeGhost, startUpload, } = props;
    const uploadBtnClassNames = classnames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
        'uppy-c-btn-primary': uploadState === StatusBarStates.STATE_WAITING,
    }, { 'uppy-StatusBar-actionBtn--disabled': isSomeGhost });
    const uploadBtnText = newFiles && isUploadStarted && !recoveredState
        ? i18n('uploadXNewFiles', { smart_count: newFiles })
        : i18n('uploadXFiles', { smart_count: newFiles });
    return (jsxRuntime_module_u("button", { type: "button", className: uploadBtnClassNames, "aria-label": i18n('uploadXFiles', { smart_count: newFiles }), onClick: startUpload, disabled: isSomeGhost, "data-uppy-super-focusable": true, children: uploadBtnText }));
}
function RetryBtn(props) {
    const { i18n, uppy } = props;
    return (jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry", "aria-label": i18n('retryUpload'), onClick: () => uppy.retryAll().catch(() => {
            /* Error reported and handled via an event */
        }), "data-uppy-super-focusable": true, "data-cy": "retry", children: [jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "8", height: "10", viewBox: "0 0 8 10", children: jsxRuntime_module_u("path", { d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z" }) }), i18n('retry')] }));
}
function CancelBtn(props) {
    const { i18n, uppy } = props;
    return (jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-StatusBar-actionCircleBtn", title: i18n('cancel'), "aria-label": i18n('cancel'), onClick: () => uppy.cancelAll(), "data-cy": "cancel", "data-uppy-super-focusable": true, children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "16", height: "16", viewBox: "0 0 16 16", children: jsxRuntime_module_u("g", { fill: "none", fillRule: "evenodd", children: [jsxRuntime_module_u("circle", { fill: "#888", cx: "8", cy: "8", r: "8" }), jsxRuntime_module_u("path", { fill: "#FFF", d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z" })] }) }) }));
}
function PauseResumeButton(props) {
    const { isAllPaused, i18n, isAllComplete, resumableUploads, uppy } = props;
    const title = isAllPaused ? i18n('resume') : i18n('pause');
    function togglePauseResume() {
        if (isAllComplete)
            return;
        if (!resumableUploads) {
            uppy.cancelAll();
            return;
        }
        if (isAllPaused) {
            uppy.resumeAll();
            return;
        }
        uppy.pauseAll();
    }
    return (jsxRuntime_module_u("button", { title: title, "aria-label": title, className: "uppy-u-reset uppy-StatusBar-actionCircleBtn", type: "button", onClick: togglePauseResume, "data-cy": "togglePauseResume", "data-uppy-super-focusable": true, children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "16", height: "16", viewBox: "0 0 16 16", children: jsxRuntime_module_u("g", { fill: "none", fillRule: "evenodd", children: [jsxRuntime_module_u("circle", { fill: "#888", cx: "8", cy: "8", r: "8" }), jsxRuntime_module_u("path", { fill: "#FFF", d: isAllPaused
                            ? 'M6 4.25L11.5 8 6 11.75z'
                            : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z' })] }) }) }));
}
function DoneBtn(props) {
    const { i18n, doneButtonHandler } = props;
    return (jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done", onClick: doneButtonHandler, "data-uppy-super-focusable": true, children: i18n('done') }));
}
function LoadingSpinner() {
    return (jsxRuntime_module_u("svg", { className: "uppy-StatusBar-spinner", "aria-hidden": "true", focusable: "false", width: "14", height: "14", children: jsxRuntime_module_u("path", { d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0", fillRule: "evenodd" }) }));
}
function ProgressBarProcessing(props) {
    const { progress } = props;
    const { value, mode, message } = progress;
    const dot = `\u00B7`;
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-content", children: [jsxRuntime_module_u(LoadingSpinner, {}), mode === 'determinate' ? `${Math.round(value * 100)}% ${dot} ` : '', message] }));
}
function ProgressDetails(props) {
    const { numUploads, complete, totalUploadedSize, totalSize, totalETA, i18n } = props;
    const ifShowFilesUploadedOfTotal = numUploads > 1;
    const totalUploadedSizeStr = prettierBytes_namespaceFn()(totalUploadedSize);
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusSecondary", children: [ifShowFilesUploadedOfTotal &&
                i18n('filesUploadedOfTotal', {
                    complete,
                    smart_count: numUploads,
                }), jsxRuntime_module_u("span", { className: "uppy-StatusBar-additionalInfo", children: [ifShowFilesUploadedOfTotal && renderDot(), totalSize != null
                        ? i18n('dataUploadedOfTotal', {
                            complete: totalUploadedSizeStr,
                            total: prettierBytes_namespaceFn()(totalSize),
                        })
                        : i18n('dataUploadedOfUnknown', { complete: totalUploadedSizeStr }), renderDot(), totalETA != null &&
                        i18n('xTimeLeft', {
                            time: prettyETA(totalETA),
                        })] })] }));
}
function FileUploadCount(props) {
    const { i18n, complete, numUploads } = props;
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusSecondary", children: i18n('filesUploadedOfTotal', { complete, smart_count: numUploads }) }));
}
function UploadNewlyAddedFiles(props) {
    const { i18n, newFiles, startUpload } = props;
    const uploadBtnClassNames = classnames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusSecondary", children: [jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusSecondaryHint", children: i18n('xMoreFilesAdded', { smart_count: newFiles }) }), jsxRuntime_module_u("button", { type: "button", className: uploadBtnClassNames, "aria-label": i18n('uploadXFiles', { smart_count: newFiles }), onClick: startUpload, children: i18n('upload') })] }));
}
function ProgressBarUploading(props) {
    const { i18n, supportsUploadProgress, totalProgress, showProgressDetails, isUploadStarted, isAllComplete, isAllPaused, newFiles, numUploads, complete, totalUploadedSize, totalSize, totalETA, startUpload, } = props;
    const showUploadNewlyAddedFiles = newFiles && isUploadStarted;
    if (!isUploadStarted || isAllComplete) {
        return null;
    }
    const title = isAllPaused ? i18n('paused') : i18n('uploading');
    function renderProgressDetails() {
        if (!isAllPaused && !showUploadNewlyAddedFiles && showProgressDetails) {
            if (supportsUploadProgress) {
                return (jsxRuntime_module_u(ProgressDetails, { numUploads: numUploads, complete: complete, totalUploadedSize: totalUploadedSize, totalSize: totalSize, totalETA: totalETA, i18n: i18n }));
            }
            return (jsxRuntime_module_u(FileUploadCount, { i18n: i18n, complete: complete, numUploads: numUploads }));
        }
        return null;
    }
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-content", title: title, children: [!isAllPaused ? jsxRuntime_module_u(LoadingSpinner, {}) : null, jsxRuntime_module_u("div", { className: "uppy-StatusBar-status", children: [jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusPrimary", children: supportsUploadProgress && totalProgress !== 0
                            ? `${title}: ${totalProgress}%`
                            : title }), renderProgressDetails(), showUploadNewlyAddedFiles ? (jsxRuntime_module_u(UploadNewlyAddedFiles, { i18n: i18n, newFiles: newFiles, startUpload: startUpload })) : null] })] }));
}
function ProgressBarComplete(props) {
    const { i18n } = props;
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-content", 
        // biome-ignore lint/a11y/useSemanticElements: ...
        role: "status", title: i18n('complete'), children: jsxRuntime_module_u("div", { className: "uppy-StatusBar-status", children: jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusPrimary", children: [jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-StatusBar-statusIndicator uppy-c-icon", width: "15", height: "11", viewBox: "0 0 15 11", children: jsxRuntime_module_u("path", { d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z" }) }), i18n('complete')] }) }) }));
}
function ProgressBarError(props) {
    const { error, i18n, complete, numUploads } = props;
    function displayErrorAlert() {
        const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`;
        alert(errorMessage); // TODO: move to custom alert implementation
    }
    return (jsxRuntime_module_u("div", { className: "uppy-StatusBar-content", title: i18n('uploadFailed'), children: [jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-StatusBar-statusIndicator uppy-c-icon", width: "11", height: "11", viewBox: "0 0 11 11", children: jsxRuntime_module_u("path", { d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z" }) }), jsxRuntime_module_u("div", { className: "uppy-StatusBar-status", children: [jsxRuntime_module_u("div", { className: "uppy-StatusBar-statusPrimary", children: [i18n('uploadFailed'), jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-StatusBar-details", "aria-label": i18n('showErrorDetails'), "data-microtip-position": "top-right", "data-microtip-size": "medium", onClick: displayErrorAlert, type: "button", children: "?" })] }), jsxRuntime_module_u(FileUploadCount, { i18n: i18n, complete: complete, numUploads: numUploads })] })] }));
}


;// ./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js
function calculateProcessingProgress(files) {
    const values = [];
    let mode = 'indeterminate';
    let message;
    for (const { progress } of Object.values(files)) {
        const { preprocess, postprocess } = progress;
        // In the future we should probably do this differently. For now we'll take the
        // mode and message from the first file…
        if (message == null && (preprocess || postprocess)) {
            ;
            ({ mode, message } = preprocess || postprocess);
        }
        if (preprocess?.mode === 'determinate')
            values.push(preprocess.value);
        if (postprocess?.mode === 'determinate')
            values.push(postprocess.value);
    }
    const value = values.reduce((total, progressValue) => {
        return total + progressValue / values.length;
    }, 0);
    return {
        mode,
        message,
        value,
    };
}

;// ./node_modules/@uppy/status-bar/lib/StatusBarUI.js






const { STATE_ERROR, STATE_WAITING, STATE_PREPROCESSING, STATE_UPLOADING, STATE_POSTPROCESSING, STATE_COMPLETE, } = StatusBarStates;
function StatusBarUI({ newFiles, allowNewUpload, isUploadInProgress, isAllPaused, resumableUploads, error, hideUploadButton = undefined, hidePauseResumeButton = false, hideCancelButton = false, hideRetryButton = false, recoveredState, uploadState, totalProgress, files, supportsUploadProgress, hideAfterFinish = false, isSomeGhost, doneButtonHandler = undefined, isUploadStarted, i18n, startUpload, uppy, isAllComplete, showProgressDetails = undefined, numUploads, complete, totalSize, totalETA, totalUploadedSize, }) {
    function getProgressValue() {
        switch (uploadState) {
            case STATE_POSTPROCESSING:
            case STATE_PREPROCESSING: {
                const progress = calculateProcessingProgress(files);
                if (progress.mode === 'determinate') {
                    return progress.value * 100;
                }
                return totalProgress;
            }
            case STATE_ERROR: {
                return null;
            }
            case STATE_UPLOADING: {
                if (!supportsUploadProgress) {
                    return null;
                }
                return totalProgress;
            }
            default:
                return totalProgress;
        }
    }
    function getIsIndeterminate() {
        switch (uploadState) {
            case STATE_POSTPROCESSING:
            case STATE_PREPROCESSING: {
                const { mode } = calculateProcessingProgress(files);
                return mode === 'indeterminate';
            }
            case STATE_UPLOADING: {
                if (!supportsUploadProgress) {
                    return true;
                }
                return false;
            }
            default:
                return false;
        }
    }
    const progressValue = getProgressValue();
    const width = progressValue ?? 100;
    const showUploadBtn = !error &&
        newFiles &&
        ((!isUploadInProgress && !isAllPaused) || recoveredState) &&
        allowNewUpload &&
        !hideUploadButton;
    const showCancelBtn = !hideCancelButton &&
        uploadState !== STATE_WAITING &&
        uploadState !== STATE_COMPLETE;
    const showPauseResumeBtn = resumableUploads &&
        !hidePauseResumeButton &&
        uploadState === STATE_UPLOADING;
    const showRetryBtn = error && !isAllComplete && !hideRetryButton;
    const showDoneBtn = doneButtonHandler && uploadState === STATE_COMPLETE;
    const progressClassNames = classnames('uppy-StatusBar-progress', {
        'is-indeterminate': getIsIndeterminate(),
    });
    const statusBarClassNames = classnames('uppy-StatusBar', `is-${uploadState}`, { 'has-ghosts': isSomeGhost });
    const progressBarStateEl = (() => {
        switch (uploadState) {
            case STATE_PREPROCESSING:
            case STATE_POSTPROCESSING:
                return (jsxRuntime_module_u(ProgressBarProcessing, { progress: calculateProcessingProgress(files) }));
            case STATE_COMPLETE:
                return jsxRuntime_module_u(ProgressBarComplete, { i18n: i18n });
            case STATE_ERROR:
                return (jsxRuntime_module_u(ProgressBarError, { error: error, i18n: i18n, numUploads: numUploads, complete: complete }));
            case STATE_UPLOADING:
                return (jsxRuntime_module_u(ProgressBarUploading, { i18n: i18n, supportsUploadProgress: supportsUploadProgress, totalProgress: totalProgress, showProgressDetails: showProgressDetails, isUploadStarted: isUploadStarted, isAllComplete: isAllComplete, isAllPaused: isAllPaused, newFiles: newFiles, numUploads: numUploads, complete: complete, totalUploadedSize: totalUploadedSize, totalSize: totalSize, totalETA: totalETA, startUpload: startUpload }));
            default:
                return null;
        }
    })();
    const atLeastOneAction = showUploadBtn ||
        showRetryBtn ||
        showPauseResumeBtn ||
        showCancelBtn ||
        showDoneBtn;
    const thereIsNothingInside = !atLeastOneAction && !progressBarStateEl;
    const isHidden = thereIsNothingInside || (uploadState === STATE_COMPLETE && hideAfterFinish);
    if (isHidden) {
        return null;
    }
    return (jsxRuntime_module_u("div", { className: statusBarClassNames, children: [jsxRuntime_module_u("div", { className: progressClassNames, style: { width: `${width}%` }, role: "progressbar", "aria-label": `${width}%`, "aria-valuetext": `${width}%`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": progressValue }), progressBarStateEl, jsxRuntime_module_u("div", { className: "uppy-StatusBar-actions", children: [showUploadBtn ? (jsxRuntime_module_u(UploadBtn, { newFiles: newFiles, isUploadStarted: isUploadStarted, recoveredState: recoveredState, i18n: i18n, isSomeGhost: isSomeGhost, startUpload: startUpload, uploadState: uploadState })) : null, showRetryBtn ? jsxRuntime_module_u(RetryBtn, { i18n: i18n, uppy: uppy }) : null, showPauseResumeBtn ? (jsxRuntime_module_u(PauseResumeButton, { isAllPaused: isAllPaused, i18n: i18n, isAllComplete: isAllComplete, resumableUploads: resumableUploads, uppy: uppy })) : null, showCancelBtn ? jsxRuntime_module_u(CancelBtn, { i18n: i18n, uppy: uppy }) : null, showDoneBtn ? (jsxRuntime_module_u(DoneBtn, { i18n: i18n, doneButtonHandler: doneButtonHandler })) : null] })] }));
}

;// ./node_modules/@uppy/status-bar/lib/StatusBar.js








const speedFilterHalfLife = 2000;
const ETAFilterHalfLife = 2000;
function getUploadingState(error, isAllComplete, recoveredState, files) {
    if (error) {
        return StatusBarStates.STATE_ERROR;
    }
    if (isAllComplete) {
        return StatusBarStates.STATE_COMPLETE;
    }
    if (recoveredState) {
        return StatusBarStates.STATE_WAITING;
    }
    let state = StatusBarStates.STATE_WAITING;
    const fileIDs = Object.keys(files);
    for (let i = 0; i < fileIDs.length; i++) {
        const { progress } = files[fileIDs[i]];
        // If ANY files are being uploaded right now, show the uploading state.
        if (progress.uploadStarted && !progress.uploadComplete) {
            return StatusBarStates.STATE_UPLOADING;
        }
        // If files are being preprocessed AND postprocessed at this time, we show the
        // preprocess state. If any files are being uploaded we show uploading.
        if (progress.preprocess) {
            state = StatusBarStates.STATE_PREPROCESSING;
        }
        // If NO files are being preprocessed or uploaded right now, but some files are
        // being postprocessed, show the postprocess state.
        if (progress.postprocess && state !== StatusBarStates.STATE_PREPROCESSING) {
            state = StatusBarStates.STATE_POSTPROCESSING;
        }
    }
    return state;
}
const StatusBar_defaultOptions = {
    hideUploadButton: false,
    hideRetryButton: false,
    hidePauseResumeButton: false,
    hideCancelButton: false,
    showProgressDetails: false,
    hideAfterFinish: true,
    doneButtonHandler: null,
};
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */
class StatusBar extends lib_UIPlugin {
    static VERSION = status_bar_package_namespaceObject.rE;
    #lastUpdateTime;
    #previousUploadedBytes;
    #previousSpeed;
    #previousETA;
    constructor(uppy, opts) {
        super(uppy, { ...StatusBar_defaultOptions, ...opts });
        this.id = this.opts.id || 'StatusBar';
        this.title = 'StatusBar';
        this.type = 'progressindicator';
        this.defaultLocale = lib_locale;
        this.i18nInit();
        this.render = this.render.bind(this);
        this.install = this.install.bind(this);
    }
    #computeSmoothETA(totalBytes) {
        if (totalBytes.total == null || totalBytes.total === 0) {
            return null;
        }
        const remaining = totalBytes.total - totalBytes.uploaded;
        if (remaining <= 0) {
            return null;
        }
        // When state is restored, lastUpdateTime is still nullish at this point.
        this.#lastUpdateTime ??= performance.now();
        const dt = performance.now() - this.#lastUpdateTime;
        if (dt === 0) {
            return Math.round((this.#previousETA ?? 0) / 100) / 10;
        }
        const uploadedBytesSinceLastTick = totalBytes.uploaded - this.#previousUploadedBytes;
        this.#previousUploadedBytes = totalBytes.uploaded;
        // uploadedBytesSinceLastTick can be negative in some cases (packet loss?)
        // in which case, we wait for next tick to update ETA.
        if (uploadedBytesSinceLastTick <= 0) {
            return Math.round((this.#previousETA ?? 0) / 100) / 10;
        }
        const currentSpeed = uploadedBytesSinceLastTick / dt;
        const filteredSpeed = this.#previousSpeed == null
            ? currentSpeed
            : emaFilter(currentSpeed, this.#previousSpeed, speedFilterHalfLife, dt);
        this.#previousSpeed = filteredSpeed;
        const instantETA = remaining / filteredSpeed;
        const updatedPreviousETA = Math.max(this.#previousETA - dt, 0);
        const filteredETA = this.#previousETA == null
            ? instantETA
            : emaFilter(instantETA, updatedPreviousETA, ETAFilterHalfLife, dt);
        this.#previousETA = filteredETA;
        this.#lastUpdateTime = performance.now();
        return Math.round(filteredETA / 100) / 10;
    }
    startUpload = () => {
        return this.uppy.upload().catch((() => {
            // Error logged in Core
        }));
    };
    render(state) {
        const { capabilities, files, allowNewUpload, totalProgress, error, recoveredState, } = state;
        const { newFiles, startedFiles, completeFiles, isUploadStarted, isAllComplete, isAllPaused, isUploadInProgress, isSomeGhost, } = this.uppy.getObjectOfFilesPerState();
        // If some state was recovered, we want to show Upload button/counter
        // for all the files, because in this case it’s not an Upload button,
        // but “Confirm Restore Button”
        const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
        const resumableUploads = !!capabilities.resumableUploads;
        const supportsUploadProgress = capabilities.uploadProgress !== false;
        let totalSize = null;
        let totalUploadedSize = 0;
        // Only if all files have a known size, does it make sense to display a total size
        if (startedFiles.every((f) => f.progress.bytesTotal != null && f.progress.bytesTotal !== 0)) {
            totalSize = 0;
            startedFiles.forEach((file) => {
                totalSize += file.progress.bytesTotal || 0;
                totalUploadedSize += file.progress.bytesUploaded || 0;
            });
        }
        else {
            // however uploaded size we will always have
            startedFiles.forEach((file) => {
                totalUploadedSize += file.progress.bytesUploaded || 0;
            });
        }
        const totalETA = this.#computeSmoothETA({
            uploaded: totalUploadedSize,
            total: totalSize,
        });
        return StatusBarUI({
            error,
            uploadState: getUploadingState(error, isAllComplete, recoveredState, state.files || {}),
            allowNewUpload,
            totalProgress,
            totalSize,
            totalUploadedSize,
            isAllComplete: false,
            isAllPaused,
            isUploadStarted,
            isUploadInProgress,
            isSomeGhost,
            recoveredState,
            complete: completeFiles.length,
            newFiles: newFilesOrRecovered.length,
            numUploads: startedFiles.length,
            totalETA,
            files,
            i18n: this.i18n,
            uppy: this.uppy,
            startUpload: this.startUpload,
            doneButtonHandler: this.opts.doneButtonHandler,
            resumableUploads,
            supportsUploadProgress,
            showProgressDetails: this.opts.showProgressDetails,
            hideUploadButton: this.opts.hideUploadButton,
            hideRetryButton: this.opts.hideRetryButton,
            hidePauseResumeButton: this.opts.hidePauseResumeButton,
            hideCancelButton: this.opts.hideCancelButton,
            hideAfterFinish: this.opts.hideAfterFinish,
        });
    }
    onMount() {
        // Set the text direction if the page has not defined one.
        const element = this.el;
        const direction = lib_getTextDirection(element);
        if (!direction) {
            element.dir = 'ltr';
        }
    }
    #onUploadStart = () => {
        const { recoveredState } = this.uppy.getState();
        this.#previousSpeed = null;
        this.#previousETA = null;
        if (recoveredState) {
            this.#previousUploadedBytes = Object.values(recoveredState.files).reduce((pv, { progress }) => pv + progress.bytesUploaded, 0);
            // We don't set `#lastUpdateTime` at this point because the upload won't
            // actually resume until the user asks for it.
            this.uppy.emit('restore-confirmed');
            return;
        }
        this.#lastUpdateTime = performance.now();
        this.#previousUploadedBytes = 0;
    };
    install() {
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
        this.uppy.on('upload', this.#onUploadStart);
        // To cover the use case where the status bar is installed while the upload
        // has started, we set `lastUpdateTime` right away.
        this.#lastUpdateTime = performance.now();
        this.#previousUploadedBytes = this.uppy
            .getFiles()
            .reduce((pv, file) => pv + file.progress.bytesUploaded, 0);
    }
    uninstall() {
        this.unmount();
        this.uppy.off('upload', this.#onUploadStart);
    }
}

;// ./node_modules/@uppy/status-bar/lib/index.js


;// ./node_modules/@uppy/utils/lib/dataURItoBlob.js
const DATA_URL_PATTERN = /^data:([^/]+\/[^,;]+(?:[^,]*?))(;base64)?,([\s\S]*)$/;
function dataURItoBlob(dataURI, opts, toFile) {
    // get the base64 data
    const dataURIData = DATA_URL_PATTERN.exec(dataURI);
    // user may provide mime type, if not get it from data URI
    const mimeType = opts.mimeType ?? dataURIData?.[1] ?? 'plain/text';
    let data; // We add `!` to tell TS we're OK with `data` being not defined when the dataURI is invalid.
    if (dataURIData?.[2] != null) {
        const binary = atob(decodeURIComponent(dataURIData[3]));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        data = [bytes];
    }
    else if (dataURIData?.[3] != null) {
        data = [decodeURIComponent(dataURIData[3])];
    }
    // Convert to a File?
    if (toFile) {
        return new File(data, opts.name || '', { type: mimeType });
    }
    return new Blob(data, { type: mimeType });
}
/* harmony default export */ const lib_dataURItoBlob = (dataURItoBlob);

;// ./node_modules/@uppy/utils/lib/isObjectURL.js
/**
 * Check if a URL string is an object URL from `URL.createObjectURL`.
 */
function isObjectURL(url) {
    return url.startsWith('blob:');
}

;// ./node_modules/@uppy/utils/lib/isPreviewSupported.js
function isPreviewSupported(fileType) {
    if (!fileType)
        return false;
    // list of images that browsers can preview
    return /^[^/]+\/(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(fileType);
}

;// ./node_modules/exifr/dist/mini.esm.mjs
function mini_esm_e(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var mini_esm_t="undefined"!=typeof self?self:__webpack_require__.g;const mini_esm_s="undefined"!=typeof navigator,mini_esm_i=mini_esm_s&&"undefined"==typeof HTMLImageElement,mini_esm_n=!("undefined"==typeof __webpack_require__.g||"undefined"==typeof process||!process.versions||!process.versions.node),mini_esm_r=mini_esm_t.Buffer,mini_esm_a=!!mini_esm_r,mini_esm_h=e=>void 0!==e;function mini_esm_f(e){return void 0===e||(e instanceof Map?0===e.size:0===Object.values(e).filter(mini_esm_h).length)}function mini_esm_l(e){let t=new Error(e);throw delete t.stack,t}function mini_esm_o(e){let t=function(e){let t=0;return e.ifd0.enabled&&(t+=1024),e.exif.enabled&&(t+=2048),e.makerNote&&(t+=2048),e.userComment&&(t+=1024),e.gps.enabled&&(t+=512),e.interop.enabled&&(t+=100),e.ifd1.enabled&&(t+=1024),t+2048}(e);return e.jfif.enabled&&(t+=50),e.xmp.enabled&&(t+=2e4),e.iptc.enabled&&(t+=14e3),e.icc.enabled&&(t+=6e3),t}const mini_esm_u=e=>String.fromCharCode.apply(null,e),mini_esm_d="undefined"!=typeof TextDecoder?new TextDecoder("utf-8"):void 0;class mini_esm_c{static from(e,t){return e instanceof this&&e.le===t?e:new mini_esm_c(e,void 0,void 0,t)}constructor(e,t=0,s,i){if("boolean"==typeof i&&(this.le=i),Array.isArray(e)&&(e=new Uint8Array(e)),0===e)this.byteOffset=0,this.byteLength=0;else if(e instanceof ArrayBuffer){void 0===s&&(s=e.byteLength-t);let i=new DataView(e,t,s);this._swapDataView(i)}else if(e instanceof Uint8Array||e instanceof DataView||e instanceof mini_esm_c){void 0===s&&(s=e.byteLength-t),(t+=e.byteOffset)+s>e.byteOffset+e.byteLength&&mini_esm_l("Creating view outside of available memory in ArrayBuffer");let i=new DataView(e.buffer,t,s);this._swapDataView(i)}else if("number"==typeof e){let t=new DataView(new ArrayBuffer(e));this._swapDataView(t)}else mini_esm_l("Invalid input argument for BufferView: "+e)}_swapArrayBuffer(e){this._swapDataView(new DataView(e))}_swapBuffer(e){this._swapDataView(new DataView(e.buffer,e.byteOffset,e.byteLength))}_swapDataView(e){this.dataView=e,this.buffer=e.buffer,this.byteOffset=e.byteOffset,this.byteLength=e.byteLength}_lengthToEnd(e){return this.byteLength-e}set(e,t,s=mini_esm_c){return e instanceof DataView||e instanceof mini_esm_c?e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer&&(e=new Uint8Array(e)),e instanceof Uint8Array||mini_esm_l("BufferView.set(): Invalid data argument."),this.toUint8().set(e,t),new s(this,t,e.byteLength)}subarray(e,t){return t=t||this._lengthToEnd(e),new mini_esm_c(this,e,t)}toUint8(){return new Uint8Array(this.buffer,this.byteOffset,this.byteLength)}getUint8Array(e,t){return new Uint8Array(this.buffer,this.byteOffset+e,t)}getString(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return i=s,mini_esm_d?mini_esm_d.decode(i):mini_esm_a?Buffer.from(i).toString("utf8"):decodeURIComponent(escape(mini_esm_u(i)));// removed by dead control flow
 var i; }getLatin1String(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return mini_esm_u(s)}getUnicodeString(e=0,t=this.byteLength){const s=[];for(let i=0;i<t&&e+i<this.byteLength;i+=2)s.push(this.getUint16(e+i));return mini_esm_u(s)}getInt8(e){return this.dataView.getInt8(e)}getUint8(e){return this.dataView.getUint8(e)}getInt16(e,t=this.le){return this.dataView.getInt16(e,t)}getInt32(e,t=this.le){return this.dataView.getInt32(e,t)}getUint16(e,t=this.le){return this.dataView.getUint16(e,t)}getUint32(e,t=this.le){return this.dataView.getUint32(e,t)}getFloat32(e,t=this.le){return this.dataView.getFloat32(e,t)}getFloat64(e,t=this.le){return this.dataView.getFloat64(e,t)}getFloat(e,t=this.le){return this.dataView.getFloat32(e,t)}getDouble(e,t=this.le){return this.dataView.getFloat64(e,t)}getUintBytes(e,t,s){switch(t){case 1:return this.getUint8(e,s);case 2:return this.getUint16(e,s);case 4:return this.getUint32(e,s);case 8:return this.getUint64&&this.getUint64(e,s)}}getUint(e,t,s){switch(t){case 8:return this.getUint8(e,s);case 16:return this.getUint16(e,s);case 32:return this.getUint32(e,s);case 64:return this.getUint64&&this.getUint64(e,s)}}toString(e){return this.dataView.toString(e,this.constructor.name)}ensureChunk(){}}function mini_esm_p(e,t){mini_esm_l(`${e} '${t}' was not loaded, try using full build of exifr.`)}class mini_esm_g extends Map{constructor(e){super(),this.kind=e}get(e,t){return this.has(e)||mini_esm_p(this.kind,e),t&&(e in t||function(e,t){mini_esm_l(`Unknown ${e} '${t}'.`)}(this.kind,e),t[e].enabled||mini_esm_p(this.kind,e)),super.get(e)}keyList(){return Array.from(this.keys())}}var mini_esm_m=new mini_esm_g("file parser"),mini_esm_y=new mini_esm_g("segment parser"),mini_esm_b=new mini_esm_g("file reader");let mini_esm_w=mini_esm_t.fetch;function mini_esm_k(e,t){return(i=e).startsWith("data:")||i.length>1e4?mini_esm_v(e,t,"base64"):mini_esm_n&&e.includes("://")?mini_esm_O(e,t,"url",mini_esm_S):mini_esm_n?mini_esm_v(e,t,"fs"):mini_esm_s?mini_esm_O(e,t,"url",mini_esm_S):void mini_esm_l("Invalid input argument");// removed by dead control flow
 var i; }async function mini_esm_O(e,t,s,i){return mini_esm_b.has(s)?mini_esm_v(e,t,s):i?async function(e,t){let s=await t(e);return new mini_esm_c(s)}(e,i):void mini_esm_l(`Parser ${s} is not loaded`)}async function mini_esm_v(e,t,s){let i=new(mini_esm_b.get(s))(e,t);return await i.read(),i}const mini_esm_S=e=>mini_esm_w(e).then((e=>e.arrayBuffer())),mini_esm_A=e=>new Promise(((t,s)=>{let i=new FileReader;i.onloadend=()=>t(i.result||new ArrayBuffer),i.onerror=s,i.readAsArrayBuffer(e)}));class mini_esm_U extends Map{get tagKeys(){return this.allKeys||(this.allKeys=Array.from(this.keys())),this.allKeys}get tagValues(){return this.allValues||(this.allValues=Array.from(this.values())),this.allValues}}function mini_esm_x(e,t,s){let i=new mini_esm_U;for(let[e,t]of s)i.set(e,t);if(Array.isArray(t))for(let s of t)e.set(s,i);else e.set(t,i);return i}function mini_esm_C(e,t,s){let i,n=e.get(t);for(i of s)n.set(i[0],i[1])}const mini_esm_B=new Map,mini_esm_V=new Map,mini_esm_I=new Map,mini_esm_L=["chunked","firstChunkSize","firstChunkSizeNode","firstChunkSizeBrowser","chunkSize","chunkLimit"],mini_esm_T=["jfif","xmp","icc","iptc","ihdr"],mini_esm_z=["tiff",...mini_esm_T],mini_esm_P=["ifd0","ifd1","exif","gps","interop"],mini_esm_F=[...mini_esm_z,...mini_esm_P],mini_esm_j=["makerNote","userComment"],mini_esm_E=["translateKeys","translateValues","reviveValues","multiSegment"],mini_esm_M=[...mini_esm_E,"sanitize","mergeOutput","silentErrors"];class mini_esm_{get translate(){return this.translateKeys||this.translateValues||this.reviveValues}}class mini_esm_D extends mini_esm_{get needed(){return this.enabled||this.deps.size>0}constructor(t,s,i,n){if(super(),mini_esm_e(this,"enabled",!1),mini_esm_e(this,"skip",new Set),mini_esm_e(this,"pick",new Set),mini_esm_e(this,"deps",new Set),mini_esm_e(this,"translateKeys",!1),mini_esm_e(this,"translateValues",!1),mini_esm_e(this,"reviveValues",!1),this.key=t,this.enabled=s,this.parse=this.enabled,this.applyInheritables(n),this.canBeFiltered=mini_esm_P.includes(t),this.canBeFiltered&&(this.dict=mini_esm_B.get(t)),void 0!==i)if(Array.isArray(i))this.parse=this.enabled=!0,this.canBeFiltered&&i.length>0&&this.translateTagSet(i,this.pick);else if("object"==typeof i){if(this.enabled=!0,this.parse=!1!==i.parse,this.canBeFiltered){let{pick:e,skip:t}=i;e&&e.length>0&&this.translateTagSet(e,this.pick),t&&t.length>0&&this.translateTagSet(t,this.skip)}this.applyInheritables(i)}else!0===i||!1===i?this.parse=this.enabled=i:mini_esm_l(`Invalid options argument: ${i}`)}applyInheritables(e){let t,s;for(t of mini_esm_E)s=e[t],void 0!==s&&(this[t]=s)}translateTagSet(e,t){if(this.dict){let s,i,{tagKeys:n,tagValues:r}=this.dict;for(s of e)"string"==typeof s?(i=r.indexOf(s),-1===i&&(i=n.indexOf(Number(s))),-1!==i&&t.add(Number(n[i]))):t.add(s)}else for(let s of e)t.add(s)}finalizeFilters(){!this.enabled&&this.deps.size>0?(this.enabled=!0,mini_esm_X(this.pick,this.deps)):this.enabled&&this.pick.size>0&&mini_esm_X(this.pick,this.deps)}}var mini_esm_N={jfif:!1,tiff:!0,xmp:!1,icc:!1,iptc:!1,ifd0:!0,ifd1:!1,exif:!0,gps:!0,interop:!1,ihdr:void 0,makerNote:!1,userComment:!1,multiSegment:!1,skip:[],pick:[],translateKeys:!0,translateValues:!0,reviveValues:!0,sanitize:!0,mergeOutput:!0,silentErrors:!0,chunked:!0,firstChunkSize:void 0,firstChunkSizeNode:512,firstChunkSizeBrowser:65536,chunkSize:65536,chunkLimit:5},mini_esm_$=new Map;class mini_esm_R extends mini_esm_{static useCached(e){let t=mini_esm_$.get(e);return void 0!==t||(t=new this(e),mini_esm_$.set(e,t)),t}constructor(e){super(),!0===e?this.setupFromTrue():void 0===e?this.setupFromUndefined():Array.isArray(e)?this.setupFromArray(e):"object"==typeof e?this.setupFromObject(e):mini_esm_l(`Invalid options argument ${e}`),void 0===this.firstChunkSize&&(this.firstChunkSize=mini_esm_s?this.firstChunkSizeBrowser:this.firstChunkSizeNode),this.mergeOutput&&(this.ifd1.enabled=!1),this.filterNestedSegmentTags(),this.traverseTiffDependencyTree(),this.checkLoadedPlugins()}setupFromUndefined(){let e;for(e of mini_esm_L)this[e]=mini_esm_N[e];for(e of mini_esm_M)this[e]=mini_esm_N[e];for(e of mini_esm_j)this[e]=mini_esm_N[e];for(e of mini_esm_F)this[e]=new mini_esm_D(e,mini_esm_N[e],void 0,this)}setupFromTrue(){let e;for(e of mini_esm_L)this[e]=mini_esm_N[e];for(e of mini_esm_M)this[e]=mini_esm_N[e];for(e of mini_esm_j)this[e]=!0;for(e of mini_esm_F)this[e]=new mini_esm_D(e,!0,void 0,this)}setupFromArray(e){let t;for(t of mini_esm_L)this[t]=mini_esm_N[t];for(t of mini_esm_M)this[t]=mini_esm_N[t];for(t of mini_esm_j)this[t]=mini_esm_N[t];for(t of mini_esm_F)this[t]=new mini_esm_D(t,!1,void 0,this);this.setupGlobalFilters(e,void 0,mini_esm_P)}setupFromObject(e){let t;for(t of(mini_esm_P.ifd0=mini_esm_P.ifd0||mini_esm_P.image,mini_esm_P.ifd1=mini_esm_P.ifd1||mini_esm_P.thumbnail,Object.assign(this,e),mini_esm_L))this[t]=mini_esm_W(e[t],mini_esm_N[t]);for(t of mini_esm_M)this[t]=mini_esm_W(e[t],mini_esm_N[t]);for(t of mini_esm_j)this[t]=mini_esm_W(e[t],mini_esm_N[t]);for(t of mini_esm_z)this[t]=new mini_esm_D(t,mini_esm_N[t],e[t],this);for(t of mini_esm_P)this[t]=new mini_esm_D(t,mini_esm_N[t],e[t],this.tiff);this.setupGlobalFilters(e.pick,e.skip,mini_esm_P,mini_esm_F),!0===e.tiff?this.batchEnableWithBool(mini_esm_P,!0):!1===e.tiff?this.batchEnableWithUserValue(mini_esm_P,e):Array.isArray(e.tiff)?this.setupGlobalFilters(e.tiff,void 0,mini_esm_P):"object"==typeof e.tiff&&this.setupGlobalFilters(e.tiff.pick,e.tiff.skip,mini_esm_P)}batchEnableWithBool(e,t){for(let s of e)this[s].enabled=t}batchEnableWithUserValue(e,t){for(let s of e){let e=t[s];this[s].enabled=!1!==e&&void 0!==e}}setupGlobalFilters(e,t,s,i=s){if(e&&e.length){for(let e of i)this[e].enabled=!1;let t=mini_esm_K(e,s);for(let[e,s]of t)mini_esm_X(this[e].pick,s),this[e].enabled=!0}else if(t&&t.length){let e=mini_esm_K(t,s);for(let[t,s]of e)mini_esm_X(this[t].skip,s)}}filterNestedSegmentTags(){let{ifd0:e,exif:t,xmp:s,iptc:i,icc:n}=this;this.makerNote?t.deps.add(37500):t.skip.add(37500),this.userComment?t.deps.add(37510):t.skip.add(37510),s.enabled||e.skip.add(700),i.enabled||e.skip.add(33723),n.enabled||e.skip.add(34675)}traverseTiffDependencyTree(){let{ifd0:e,exif:t,gps:s,interop:i}=this;i.needed&&(t.deps.add(40965),e.deps.add(40965)),t.needed&&e.deps.add(34665),s.needed&&e.deps.add(34853),this.tiff.enabled=mini_esm_P.some((e=>!0===this[e].enabled))||this.makerNote||this.userComment;for(let e of mini_esm_P)this[e].finalizeFilters()}get onlyTiff(){return!mini_esm_T.map((e=>this[e].enabled)).some((e=>!0===e))&&this.tiff.enabled}checkLoadedPlugins(){for(let e of mini_esm_z)this[e].enabled&&!mini_esm_y.has(e)&&mini_esm_p("segment parser",e)}}function mini_esm_K(e,t){let s,i,n,r,a=[];for(n of t){for(r of(s=mini_esm_B.get(n),i=[],s))(e.includes(r[0])||e.includes(r[1]))&&i.push(r[0]);i.length&&a.push([n,i])}return a}function mini_esm_W(e,t){return void 0!==e?e:void 0!==t?t:void 0}function mini_esm_X(e,t){for(let s of t)e.add(s)}mini_esm_e(mini_esm_R,"default",mini_esm_N);class mini_esm_H{constructor(t){mini_esm_e(this,"parsers",{}),mini_esm_e(this,"output",{}),mini_esm_e(this,"errors",[]),mini_esm_e(this,"pushToErrors",(e=>this.errors.push(e))),this.options=mini_esm_R.useCached(t)}async read(e){this.file=await function(e,t){return"string"==typeof e?mini_esm_k(e,t):mini_esm_s&&!mini_esm_i&&e instanceof HTMLImageElement?mini_esm_k(e.src,t):e instanceof Uint8Array||e instanceof ArrayBuffer||e instanceof DataView?new mini_esm_c(e):mini_esm_s&&e instanceof Blob?mini_esm_O(e,t,"blob",mini_esm_A):void mini_esm_l("Invalid input argument")}(e,this.options)}setup(){if(this.fileParser)return;let{file:e}=this,t=e.getUint16(0);for(let[s,i]of mini_esm_m)if(i.canHandle(e,t))return this.fileParser=new i(this.options,this.file,this.parsers),e[s]=!0;this.file.close&&this.file.close(),mini_esm_l("Unknown file format")}async parse(){let{output:e,errors:t}=this;return this.setup(),this.options.silentErrors?(await this.executeParsers().catch(this.pushToErrors),t.push(...this.fileParser.errors)):await this.executeParsers(),this.file.close&&this.file.close(),this.options.silentErrors&&t.length>0&&(e.errors=t),mini_esm_f(s=e)?void 0:s;// removed by dead control flow
 var s; }async executeParsers(){let{output:e}=this;await this.fileParser.parse();let t=Object.values(this.parsers).map((async t=>{let s=await t.parse();t.assignToOutput(e,s)}));this.options.silentErrors&&(t=t.map((e=>e.catch(this.pushToErrors)))),await Promise.all(t)}async extractThumbnail(){this.setup();let{options:e,file:t}=this,s=mini_esm_y.get("tiff",e);var i;if(t.tiff?i={start:0,type:"tiff"}:t.jpeg&&(i=await this.fileParser.getOrFindSegment("tiff")),void 0===i)return;let n=await this.fileParser.ensureSegmentChunk(i),r=this.parsers.tiff=new s(n,e,t),a=await r.extractThumbnail();return t.close&&t.close(),a}}async function mini_esm_Y(e,t){let s=new mini_esm_H(t);return await s.read(e),s.parse()}var mini_esm_G=Object.freeze({__proto__:null,parse:mini_esm_Y,Exifr:mini_esm_H,fileParsers:mini_esm_m,segmentParsers:mini_esm_y,fileReaders:mini_esm_b,tagKeys:mini_esm_B,tagValues:mini_esm_V,tagRevivers:mini_esm_I,createDictionary:mini_esm_x,extendDictionary:mini_esm_C,fetchUrlAsArrayBuffer:mini_esm_S,readBlobAsArrayBuffer:mini_esm_A,chunkedProps:mini_esm_L,otherSegments:mini_esm_T,segments:mini_esm_z,tiffBlocks:mini_esm_P,segmentsAndBlocks:mini_esm_F,tiffExtractables:mini_esm_j,inheritables:mini_esm_E,allFormatters:mini_esm_M,Options:mini_esm_R});class mini_esm_J{static findPosition(e,t){let s=e.getUint16(t+2)+2,i="function"==typeof this.headerLength?this.headerLength(e,t,s):this.headerLength,n=t+i,r=s-i;return{offset:t,length:s,headerLength:i,start:n,size:r,end:n+r}}static parse(e,t={}){return new this(e,new mini_esm_R({[this.type]:t}),e).parse()}normalizeInput(e){return e instanceof mini_esm_c?e:new mini_esm_c(e)}constructor(t,s={},i){mini_esm_e(this,"errors",[]),mini_esm_e(this,"raw",new Map),mini_esm_e(this,"handleError",(e=>{if(!this.options.silentErrors)throw e;this.errors.push(e.message)})),this.chunk=this.normalizeInput(t),this.file=i,this.type=this.constructor.type,this.globalOptions=this.options=s,this.localOptions=s[this.type],this.canTranslate=this.localOptions&&this.localOptions.translate}translate(){this.canTranslate&&(this.translated=this.translateBlock(this.raw,this.type))}get output(){return this.translated?this.translated:this.raw?Object.fromEntries(this.raw):void 0}translateBlock(e,t){let s=mini_esm_I.get(t),i=mini_esm_V.get(t),n=mini_esm_B.get(t),r=this.options[t],a=r.reviveValues&&!!s,h=r.translateValues&&!!i,f=r.translateKeys&&!!n,l={};for(let[t,r]of e)a&&s.has(t)?r=s.get(t)(r):h&&i.has(t)&&(r=this.translateValue(r,i.get(t))),f&&n.has(t)&&(t=n.get(t)||t),l[t]=r;return l}translateValue(e,t){return t[e]||t.DEFAULT||e}assignToOutput(e,t){this.assignObjectToOutput(e,this.constructor.type,t)}assignObjectToOutput(e,t,s){if(this.globalOptions.mergeOutput)return Object.assign(e,s);e[t]?Object.assign(e[t],s):e[t]=s}}mini_esm_e(mini_esm_J,"headerLength",4),mini_esm_e(mini_esm_J,"type",void 0),mini_esm_e(mini_esm_J,"multiSegment",!1),mini_esm_e(mini_esm_J,"canHandle",(()=>!1));function mini_esm_q(e){return 192===e||194===e||196===e||219===e||221===e||218===e||254===e}function mini_esm_Q(e){return e>=224&&e<=239}function mini_esm_Z(e,t,s){for(let[i,n]of mini_esm_y)if(n.canHandle(e,t,s))return i}class mini_esm_ee extends class{constructor(t,s,i){mini_esm_e(this,"errors",[]),mini_esm_e(this,"ensureSegmentChunk",(async e=>{let t=e.start,s=e.size||65536;if(this.file.chunked)if(this.file.available(t,s))e.chunk=this.file.subarray(t,s);else try{e.chunk=await this.file.readChunk(t,s)}catch(t){mini_esm_l(`Couldn't read segment: ${JSON.stringify(e)}. ${t.message}`)}else this.file.byteLength>t+s?e.chunk=this.file.subarray(t,s):void 0===e.size?e.chunk=this.file.subarray(t):mini_esm_l("Segment unreachable: "+JSON.stringify(e));return e.chunk})),this.extendOptions&&this.extendOptions(t),this.options=t,this.file=s,this.parsers=i}injectSegment(e,t){this.options[e].enabled&&this.createParser(e,t)}createParser(e,t){let s=new(mini_esm_y.get(e))(t,this.options,this.file);return this.parsers[e]=s}createParsers(e){for(let t of e){let{type:e,chunk:s}=t,i=this.options[e];if(i&&i.enabled){let t=this.parsers[e];t&&t.append||t||this.createParser(e,s)}}}async readSegments(e){let t=e.map(this.ensureSegmentChunk);await Promise.all(t)}}{constructor(...t){super(...t),mini_esm_e(this,"appSegments",[]),mini_esm_e(this,"jpegSegments",[]),mini_esm_e(this,"unknownSegments",[])}static canHandle(e,t){return 65496===t}async parse(){await this.findAppSegments(),await this.readSegments(this.appSegments),this.mergeMultiSegments(),this.createParsers(this.mergedAppSegments||this.appSegments)}setupSegmentFinderArgs(e){!0===e?(this.findAll=!0,this.wanted=new Set(mini_esm_y.keyList())):(e=void 0===e?mini_esm_y.keyList().filter((e=>this.options[e].enabled)):e.filter((e=>this.options[e].enabled&&mini_esm_y.has(e))),this.findAll=!1,this.remaining=new Set(e),this.wanted=new Set(e)),this.unfinishedMultiSegment=!1}async findAppSegments(e=0,t){this.setupSegmentFinderArgs(t);let{file:s,findAll:i,wanted:n,remaining:r}=this;if(!i&&this.file.chunked&&(i=Array.from(n).some((e=>{let t=mini_esm_y.get(e),s=this.options[e];return t.multiSegment&&s.multiSegment})),i&&await this.file.readWhole()),e=this.findAppSegmentsInRange(e,s.byteLength),!this.options.onlyTiff&&s.chunked){let t=!1;for(;r.size>0&&!t&&(s.canReadNextChunk||this.unfinishedMultiSegment);){let{nextChunkOffset:i}=s,n=this.appSegments.some((e=>!this.file.available(e.offset||e.start,e.length||e.size)));if(t=e>i&&!n?!await s.readNextChunk(e):!await s.readNextChunk(i),void 0===(e=this.findAppSegmentsInRange(e,s.byteLength)))return}}}findAppSegmentsInRange(e,t){t-=2;let s,i,n,r,a,h,{file:f,findAll:l,wanted:o,remaining:u,options:d}=this;for(;e<t;e++)if(255===f.getUint8(e))if(s=f.getUint8(e+1),mini_esm_Q(s)){if(i=f.getUint16(e+2),n=mini_esm_Z(f,e,i),n&&o.has(n)&&(r=mini_esm_y.get(n),a=r.findPosition(f,e),h=d[n],a.type=n,this.appSegments.push(a),!l&&(r.multiSegment&&h.multiSegment?(this.unfinishedMultiSegment=a.chunkNumber<a.chunkCount,this.unfinishedMultiSegment||u.delete(n)):u.delete(n),0===u.size)))break;d.recordUnknownSegments&&(a=mini_esm_J.findPosition(f,e),a.marker=s,this.unknownSegments.push(a)),e+=i+1}else if(mini_esm_q(s)){if(i=f.getUint16(e+2),218===s&&!1!==d.stopAfterSos)return;d.recordJpegSegments&&this.jpegSegments.push({offset:e,length:i,marker:s}),e+=i+1}return e}mergeMultiSegments(){if(!this.appSegments.some((e=>e.multiSegment)))return;let e=function(e,t){let s,i,n,r=new Map;for(let a=0;a<e.length;a++)s=e[a],i=s[t],r.has(i)?n=r.get(i):r.set(i,n=[]),n.push(s);return Array.from(r)}(this.appSegments,"type");this.mergedAppSegments=e.map((([e,t])=>{let s=mini_esm_y.get(e,this.options);if(s.handleMultiSegments){return{type:e,chunk:s.handleMultiSegments(t)}}return t[0]}))}getSegment(e){return this.appSegments.find((t=>t.type===e))}async getOrFindSegment(e){let t=this.getSegment(e);return void 0===t&&(await this.findAppSegments(0,[e]),t=this.getSegment(e)),t}}mini_esm_e(mini_esm_ee,"type","jpeg"),mini_esm_m.set("jpeg",mini_esm_ee);const te=[void 0,1,1,2,4,8,1,1,2,4,8,4,8,4];class se extends mini_esm_J{parseHeader(){var e=this.chunk.getUint16();18761===e?this.le=!0:19789===e&&(this.le=!1),this.chunk.le=this.le,this.headerParsed=!0}parseTags(e,t,s=new Map){let{pick:i,skip:n}=this.options[t];i=new Set(i);let r=i.size>0,a=0===n.size,h=this.chunk.getUint16(e);e+=2;for(let f=0;f<h;f++){let h=this.chunk.getUint16(e);if(r){if(i.has(h)&&(s.set(h,this.parseTag(e,h,t)),i.delete(h),0===i.size))break}else!a&&n.has(h)||s.set(h,this.parseTag(e,h,t));e+=12}return s}parseTag(e,t,s){let{chunk:i}=this,n=i.getUint16(e+2),r=i.getUint32(e+4),a=te[n];if(a*r<=4?e+=8:e=i.getUint32(e+8),(n<1||n>13)&&mini_esm_l(`Invalid TIFF value type. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e}`),e>i.byteLength&&mini_esm_l(`Invalid TIFF value offset. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e} is outside of chunk size ${i.byteLength}`),1===n)return i.getUint8Array(e,r);if(2===n)return""===(h=function(e){for(;e.endsWith("\0");)e=e.slice(0,-1);return e}(h=i.getString(e,r)).trim())?void 0:h;var h;if(7===n)return i.getUint8Array(e,r);if(1===r)return this.parseTagValue(n,e);{let t=new(function(e){switch(e){case 1:return Uint8Array;case 3:return Uint16Array;case 4:return Uint32Array;case 5:return Array;case 6:return Int8Array;case 8:return Int16Array;case 9:return Int32Array;case 10:return Array;case 11:return Float32Array;case 12:return Float64Array;default:return Array}}(n))(r),s=a;for(let i=0;i<r;i++)t[i]=this.parseTagValue(n,e),e+=s;return t}}parseTagValue(e,t){let{chunk:s}=this;switch(e){case 1:return s.getUint8(t);case 3:return s.getUint16(t);case 4:return s.getUint32(t);case 5:return s.getUint32(t)/s.getUint32(t+4);case 6:return s.getInt8(t);case 8:return s.getInt16(t);case 9:return s.getInt32(t);case 10:return s.getInt32(t)/s.getInt32(t+4);case 11:return s.getFloat(t);case 12:return s.getDouble(t);case 13:return s.getUint32(t);default:mini_esm_l(`Invalid tiff type ${e}`)}}}class ie extends se{static canHandle(e,t){return 225===e.getUint8(t+1)&&1165519206===e.getUint32(t+4)&&0===e.getUint16(t+8)}async parse(){this.parseHeader();let{options:e}=this;return e.ifd0.enabled&&await this.parseIfd0Block(),e.exif.enabled&&await this.safeParse("parseExifBlock"),e.gps.enabled&&await this.safeParse("parseGpsBlock"),e.interop.enabled&&await this.safeParse("parseInteropBlock"),e.ifd1.enabled&&await this.safeParse("parseThumbnailBlock"),this.createOutput()}safeParse(e){let t=this[e]();return void 0!==t.catch&&(t=t.catch(this.handleError)),t}findIfd0Offset(){void 0===this.ifd0Offset&&(this.ifd0Offset=this.chunk.getUint32(4))}findIfd1Offset(){if(void 0===this.ifd1Offset){this.findIfd0Offset();let e=this.chunk.getUint16(this.ifd0Offset),t=this.ifd0Offset+2+12*e;this.ifd1Offset=this.chunk.getUint32(t)}}parseBlock(e,t){let s=new Map;return this[t]=s,this.parseTags(e,t,s),s}async parseIfd0Block(){if(this.ifd0)return;let{file:e}=this;this.findIfd0Offset(),this.ifd0Offset<8&&mini_esm_l("Malformed EXIF data"),!e.chunked&&this.ifd0Offset>e.byteLength&&mini_esm_l(`IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`),e.tiff&&await e.ensureChunk(this.ifd0Offset,mini_esm_o(this.options));let t=this.parseBlock(this.ifd0Offset,"ifd0");return 0!==t.size?(this.exifOffset=t.get(34665),this.interopOffset=t.get(40965),this.gpsOffset=t.get(34853),this.xmp=t.get(700),this.iptc=t.get(33723),this.icc=t.get(34675),this.options.sanitize&&(t.delete(34665),t.delete(40965),t.delete(34853),t.delete(700),t.delete(33723),t.delete(34675)),t):void 0}async parseExifBlock(){if(this.exif)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.exifOffset)return;this.file.tiff&&await this.file.ensureChunk(this.exifOffset,mini_esm_o(this.options));let e=this.parseBlock(this.exifOffset,"exif");return this.interopOffset||(this.interopOffset=e.get(40965)),this.makerNote=e.get(37500),this.userComment=e.get(37510),this.options.sanitize&&(e.delete(40965),e.delete(37500),e.delete(37510)),this.unpack(e,41728),this.unpack(e,41729),e}unpack(e,t){let s=e.get(t);s&&1===s.length&&e.set(t,s[0])}async parseGpsBlock(){if(this.gps)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.gpsOffset)return;let e=this.parseBlock(this.gpsOffset,"gps");return e&&e.has(2)&&e.has(4)&&(e.set("latitude",ne(...e.get(2),e.get(1))),e.set("longitude",ne(...e.get(4),e.get(3)))),e}async parseInteropBlock(){if(!this.interop&&(this.ifd0||await this.parseIfd0Block(),void 0!==this.interopOffset||this.exif||await this.parseExifBlock(),void 0!==this.interopOffset))return this.parseBlock(this.interopOffset,"interop")}async parseThumbnailBlock(e=!1){if(!this.ifd1&&!this.ifd1Parsed&&(!this.options.mergeOutput||e))return this.findIfd1Offset(),this.ifd1Offset>0&&(this.parseBlock(this.ifd1Offset,"ifd1"),this.ifd1Parsed=!0),this.ifd1}async extractThumbnail(){if(this.headerParsed||this.parseHeader(),this.ifd1Parsed||await this.parseThumbnailBlock(!0),void 0===this.ifd1)return;let e=this.ifd1.get(513),t=this.ifd1.get(514);return this.chunk.getUint8Array(e,t)}get image(){return this.ifd0}get thumbnail(){return this.ifd1}createOutput(){let e,t,s,i={};for(t of mini_esm_P)if(e=this[t],!mini_esm_f(e))if(s=this.canTranslate?this.translateBlock(e,t):Object.fromEntries(e),this.options.mergeOutput){if("ifd1"===t)continue;Object.assign(i,s)}else i[t]=s;return this.makerNote&&(i.makerNote=this.makerNote),this.userComment&&(i.userComment=this.userComment),i}assignToOutput(e,t){if(this.globalOptions.mergeOutput)Object.assign(e,t);else for(let[s,i]of Object.entries(t))this.assignObjectToOutput(e,s,i)}}function ne(e,t,s,i){var n=e+t/60+s/3600;return"S"!==i&&"W"!==i||(n*=-1),n}mini_esm_e(ie,"type","tiff"),mini_esm_e(ie,"headerLength",10),mini_esm_y.set("tiff",ie);var mini_esm_re=Object.freeze({__proto__:null,default:mini_esm_G,Exifr:mini_esm_H,fileParsers:mini_esm_m,segmentParsers:mini_esm_y,fileReaders:mini_esm_b,tagKeys:mini_esm_B,tagValues:mini_esm_V,tagRevivers:mini_esm_I,createDictionary:mini_esm_x,extendDictionary:mini_esm_C,fetchUrlAsArrayBuffer:mini_esm_S,readBlobAsArrayBuffer:mini_esm_A,chunkedProps:mini_esm_L,otherSegments:mini_esm_T,segments:mini_esm_z,tiffBlocks:mini_esm_P,segmentsAndBlocks:mini_esm_F,tiffExtractables:mini_esm_j,inheritables:mini_esm_E,allFormatters:mini_esm_M,Options:mini_esm_R,parse:mini_esm_Y});const ae={ifd0:!1,ifd1:!1,exif:!1,gps:!1,interop:!1,sanitize:!1,reviveValues:!0,translateKeys:!1,translateValues:!1,mergeOutput:!1},he=Object.assign({},ae,{firstChunkSize:4e4,gps:[1,2,3,4]});async function fe(e){let t=new mini_esm_H(he);await t.read(e);let s=await t.parse();if(s&&s.gps){let{latitude:e,longitude:t}=s.gps;return{latitude:e,longitude:t}}}const le=Object.assign({},ae,{tiff:!1,ifd1:!0,mergeOutput:!1});async function oe(e){let t=new mini_esm_H(le);await t.read(e);let s=await t.extractThumbnail();return s&&mini_esm_a?mini_esm_r.from(s):s}async function ue(e){let t=await this.thumbnail(e);if(void 0!==t){let e=new Blob([t]);return URL.createObjectURL(e)}}const de=Object.assign({},ae,{firstChunkSize:4e4,ifd0:[274]});async function ce(e){let t=new mini_esm_H(de);await t.read(e);let s=await t.parse();if(s&&s.ifd0)return s.ifd0[274]}const pe=Object.freeze({1:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:0,rad:0},2:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:0,rad:0},3:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:180,rad:180*Math.PI/180},4:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:180,rad:180*Math.PI/180},5:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:90,rad:90*Math.PI/180},6:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:90,rad:90*Math.PI/180},7:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:270,rad:270*Math.PI/180},8:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:270,rad:270*Math.PI/180}});let ge=!0,me=!0;if("object"==typeof navigator){let e=navigator.userAgent;if(e.includes("iPad")||e.includes("iPhone")){let t=e.match(/OS (\d+)_(\d+)/);if(t){let[,e,s]=t,i=Number(e)+.1*Number(s);ge=i<13.4,me=!1}}else if(e.includes("OS X 10")){let[,t]=e.match(/OS X 10[_.](\d+)/);ge=me=Number(t)<15}if(e.includes("Chrome/")){let[,t]=e.match(/Chrome\/(\d+)/);ge=me=Number(t)<81}else if(e.includes("Firefox/")){let[,t]=e.match(/Firefox\/(\d+)/);ge=me=Number(t)<77}}async function ye(e){let t=await ce(e);return Object.assign({canvas:ge,css:me},pe[t])}class mini_esm_be extends mini_esm_c{constructor(...t){super(...t),mini_esm_e(this,"ranges",new mini_esm_we),0!==this.byteLength&&this.ranges.add(0,this.byteLength)}_tryExtend(e,t,s){if(0===e&&0===this.byteLength&&s){let e=new DataView(s.buffer||s,s.byteOffset,s.byteLength);this._swapDataView(e)}else{let s=e+t;if(s>this.byteLength){let{dataView:e}=this._extend(s);this._swapDataView(e)}}}_extend(e){let t;t=mini_esm_a?mini_esm_r.allocUnsafe(e):new Uint8Array(e);let s=new DataView(t.buffer,t.byteOffset,t.byteLength);return t.set(new Uint8Array(this.buffer,this.byteOffset,this.byteLength),0),{uintView:t,dataView:s}}subarray(e,t,s=!1){return t=t||this._lengthToEnd(e),s&&this._tryExtend(e,t),this.ranges.add(e,t),super.subarray(e,t)}set(e,t,s=!1){s&&this._tryExtend(t,e.byteLength,e);let i=super.set(e,t);return this.ranges.add(t,i.byteLength),i}async ensureChunk(e,t){this.chunked&&(this.ranges.available(e,t)||await this.readChunk(e,t))}available(e,t){return this.ranges.available(e,t)}}class mini_esm_we{constructor(){mini_esm_e(this,"list",[])}get length(){return this.list.length}add(e,t,s=0){let i=e+t,n=this.list.filter((t=>ke(e,t.offset,i)||ke(e,t.end,i)));if(n.length>0){e=Math.min(e,...n.map((e=>e.offset))),i=Math.max(i,...n.map((e=>e.end))),t=i-e;let s=n.shift();s.offset=e,s.length=t,s.end=i,this.list=this.list.filter((e=>!n.includes(e)))}else this.list.push({offset:e,length:t,end:i})}available(e,t){let s=e+t;return this.list.some((t=>t.offset<=e&&s<=t.end))}}function ke(e,t,s){return e<=t&&t<=s}class Oe extends mini_esm_be{constructor(t,s){super(0),mini_esm_e(this,"chunksRead",0),this.input=t,this.options=s}async readWhole(){this.chunked=!1,await this.readChunk(this.nextChunkOffset)}async readChunked(){this.chunked=!0,await this.readChunk(0,this.options.firstChunkSize)}async readNextChunk(e=this.nextChunkOffset){if(this.fullyRead)return this.chunksRead++,!1;let t=this.options.chunkSize,s=await this.readChunk(e,t);return!!s&&s.byteLength===t}async readChunk(e,t){if(this.chunksRead++,0!==(t=this.safeWrapAddress(e,t)))return this._readChunk(e,t)}safeWrapAddress(e,t){return void 0!==this.size&&e+t>this.size?Math.max(0,this.size-e):t}get nextChunkOffset(){if(0!==this.ranges.list.length)return this.ranges.list[0].length}get canReadNextChunk(){return this.chunksRead<this.options.chunkLimit}get fullyRead(){return void 0!==this.size&&this.nextChunkOffset===this.size}read(){return this.options.chunked?this.readChunked():this.readWhole()}close(){}}mini_esm_b.set("blob",class extends Oe{async readWhole(){this.chunked=!1;let e=await mini_esm_A(this.input);this._swapArrayBuffer(e)}readChunked(){return this.chunked=!0,this.size=this.input.size,super.readChunked()}async _readChunk(e,t){let s=t?e+t:void 0,i=this.input.slice(e,s),n=await mini_esm_A(i);return this.set(n,e,!0)}});/* harmony default export */ const mini_esm = ((/* unused pure expression or super */ null && (mini_esm_re)));

;// ./node_modules/@uppy/thumbnail-generator/package.json
const thumbnail_generator_package_namespaceObject = {"rE":"4.2.3"};
;// ./node_modules/@uppy/thumbnail-generator/lib/locale.js
/* harmony default export */ const thumbnail_generator_lib_locale = ({
    strings: {
        generatingThumbnails: 'Generating thumbnails...',
    },
});

;// ./node_modules/@uppy/thumbnail-generator/lib/index.js




// @ts-ignore untyped



/**
 * Save a <canvas> element's content to a Blob object.
 *
 */
function canvasToBlob(canvas, type, quality) {
    try {
        canvas.getContext('2d').getImageData(0, 0, 1, 1);
    }
    catch (err) {
        if (err.code === 18) {
            return Promise.reject(new Error('cannot read image, probably an svg with external resources'));
        }
    }
    if (canvas.toBlob) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, type, quality);
        }).then((blob) => {
            if (blob === null) {
                throw new Error('cannot read image, probably an svg with external resources');
            }
            return blob;
        });
    }
    return Promise.resolve()
        .then(() => {
        return lib_dataURItoBlob(canvas.toDataURL(type, quality), {});
    })
        .then((blob) => {
        if (blob === null) {
            throw new Error('could not extract blob, probably an old browser');
        }
        return blob;
    });
}
function rotateImage(image, translate) {
    let w = image.width;
    let h = image.height;
    if (translate.deg === 90 || translate.deg === 270) {
        w = image.height;
        h = image.width;
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    context.translate(w / 2, h / 2);
    if (translate.canvas) {
        context.rotate(translate.rad);
        context.scale(translate.scaleX, translate.scaleY);
    }
    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
    return canvas;
}
/**
 * Make sure the image doesn’t exceed browser/device canvas limits.
 * For ios with 256 RAM and ie
 */
function protect(image) {
    // https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    const ratio = image.width / image.height;
    const maxSquare = 5000000; // ios max canvas square
    const maxSize = 4096; // ie max canvas dimensions
    let maxW = Math.floor(Math.sqrt(maxSquare * ratio));
    let maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));
    if (maxW > maxSize) {
        maxW = maxSize;
        maxH = Math.round(maxW / ratio);
    }
    if (maxH > maxSize) {
        maxH = maxSize;
        maxW = Math.round(ratio * maxH);
    }
    if (image.width > maxW) {
        const canvas = document.createElement('canvas');
        canvas.width = maxW;
        canvas.height = maxH;
        canvas.getContext('2d').drawImage(image, 0, 0, maxW, maxH);
        return canvas;
    }
    return image;
}
const lib_defaultOptions = {
    thumbnailWidth: null,
    thumbnailHeight: null,
    thumbnailType: 'image/jpeg',
    waitForThumbnailsBeforeUpload: false,
    lazy: false,
};
/**
 * The Thumbnail Generator plugin
 */
class ThumbnailGenerator extends lib_UIPlugin {
    static VERSION = thumbnail_generator_package_namespaceObject.rE;
    queue;
    queueProcessing;
    defaultThumbnailDimension;
    thumbnailType;
    constructor(uppy, opts) {
        super(uppy, { ...lib_defaultOptions, ...opts });
        this.type = 'modifier';
        this.id = this.opts.id || 'ThumbnailGenerator';
        this.title = 'Thumbnail Generator';
        this.queue = [];
        this.queueProcessing = false;
        this.defaultThumbnailDimension = 200;
        this.thumbnailType = this.opts.thumbnailType;
        this.defaultLocale = thumbnail_generator_lib_locale;
        this.i18nInit();
        if (this.opts.lazy && this.opts.waitForThumbnailsBeforeUpload) {
            throw new Error('ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`.');
        }
    }
    createThumbnail(file, targetWidth, targetHeight) {
        const originalUrl = URL.createObjectURL(file.data);
        const onload = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = originalUrl;
            image.addEventListener('load', () => {
                URL.revokeObjectURL(originalUrl);
                resolve(image);
            });
            image.addEventListener('error', (event) => {
                URL.revokeObjectURL(originalUrl);
                reject(event.error || new Error('Could not create thumbnail'));
            });
        });
        const orientationPromise = ye(file.data).catch(() => 1);
        return Promise.all([onload, orientationPromise])
            .then(([image, orientation]) => {
            const dimensions = this.getProportionalDimensions(image, targetWidth, targetHeight, orientation.deg);
            const rotatedImage = rotateImage(image, orientation);
            const resizedImage = this.resizeImage(rotatedImage, dimensions.width, dimensions.height);
            return canvasToBlob(resizedImage, this.thumbnailType, 80);
        })
            .then((blob) => {
            return URL.createObjectURL(blob);
        });
    }
    /**
     * Get the new calculated dimensions for the given image and a target width
     * or height. If both width and height are given, only width is taken into
     * account. If neither width nor height are given, the default dimension
     * is used.
     */
    getProportionalDimensions(img, width, height, deg) {
        let aspect = img.width / img.height;
        if (deg === 90 || deg === 270) {
            aspect = img.height / img.width;
        }
        if (width != null) {
            let targetWidth = width;
            // Thumbnail shouldn’t be enlarged / upscaled, only reduced.
            // If img is already smaller than width/height, leave it as is.
            if (img.width < width)
                targetWidth = img.width;
            return {
                width: targetWidth,
                height: Math.round(targetWidth / aspect),
            };
        }
        if (height != null) {
            let targetHeight = height;
            if (img.height < height)
                targetHeight = img.height;
            return {
                width: Math.round(targetHeight * aspect),
                height: targetHeight,
            };
        }
        return {
            width: this.defaultThumbnailDimension,
            height: Math.round(this.defaultThumbnailDimension / aspect),
        };
    }
    /**
     * Resize an image to the target `width` and `height`.
     *
     * Returns a Canvas with the resized image on it.
     */
    resizeImage(image, targetWidth, targetHeight) {
        // Resizing in steps refactored to use a solution from
        // https://blog.uploadcare.com/image-resize-in-browsers-is-broken-e38eed08df01
        let img = protect(image);
        let steps = Math.ceil(Math.log2(img.width / targetWidth));
        if (steps < 1) {
            steps = 1;
        }
        let sW = targetWidth * 2 ** (steps - 1);
        let sH = targetHeight * 2 ** (steps - 1);
        const x = 2;
        while (steps--) {
            const canvas = document.createElement('canvas');
            canvas.width = sW;
            canvas.height = sH;
            canvas.getContext('2d').drawImage(img, 0, 0, sW, sH);
            img = canvas;
            sW = Math.round(sW / x);
            sH = Math.round(sH / x);
        }
        return img;
    }
    /**
     * Set the preview URL for a file.
     */
    setPreviewURL(fileID, preview) {
        this.uppy.setFileState(fileID, { preview });
    }
    addToQueue(fileID) {
        this.queue.push(fileID);
        if (this.queueProcessing === false) {
            this.processQueue();
        }
    }
    processQueue() {
        this.queueProcessing = true;
        if (this.queue.length > 0) {
            const current = this.uppy.getFile(this.queue.shift());
            if (!current) {
                this.uppy.log('[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug', 'error');
                return Promise.resolve();
            }
            return this.requestThumbnail(current)
                .catch(() => { })
                .then(() => this.processQueue());
        }
        this.queueProcessing = false;
        this.uppy.log('[ThumbnailGenerator] Emptied thumbnail queue');
        this.uppy.emit('thumbnail:all-generated');
        return Promise.resolve();
    }
    requestThumbnail(file) {
        if (isPreviewSupported(file.type) && !file.isRemote) {
            return this.createThumbnail(file, this.opts.thumbnailWidth, this.opts.thumbnailHeight)
                .then((preview) => {
                this.setPreviewURL(file.id, preview);
                this.uppy.log(`[ThumbnailGenerator] Generated thumbnail for ${file.id}`);
                this.uppy.emit('thumbnail:generated', this.uppy.getFile(file.id), preview);
            })
                .catch((err) => {
                this.uppy.log(`[ThumbnailGenerator] Failed thumbnail for ${file.id}:`, 'warning');
                this.uppy.log(err, 'warning');
                this.uppy.emit('thumbnail:error', this.uppy.getFile(file.id), err);
            });
        }
        return Promise.resolve();
    }
    onFileAdded = (file) => {
        if (!file.preview &&
            file.data &&
            isPreviewSupported(file.type) &&
            !file.isRemote) {
            this.addToQueue(file.id);
        }
    };
    /**
     * Cancel a lazy request for a thumbnail if the thumbnail has not yet been generated.
     */
    onCancelRequest = (file) => {
        const index = this.queue.indexOf(file.id);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    };
    /**
     * Clean up the thumbnail for a file. Cancel lazy requests and free the thumbnail URL.
     */
    onFileRemoved = (file) => {
        const index = this.queue.indexOf(file.id);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
        // Clean up object URLs.
        if (file.preview && isObjectURL(file.preview)) {
            URL.revokeObjectURL(file.preview);
        }
    };
    onRestored = () => {
        const restoredFiles = this.uppy.getFiles().filter((file) => file.isRestored);
        restoredFiles.forEach((file) => {
            // Only add blob URLs; they are likely invalid after being restored.
            if (!file.preview || isObjectURL(file.preview)) {
                this.addToQueue(file.id);
            }
        });
    };
    onAllFilesRemoved = () => {
        this.queue = [];
    };
    waitUntilAllProcessed = (fileIDs) => {
        fileIDs.forEach((fileID) => {
            const file = this.uppy.getFile(fileID);
            this.uppy.emit('preprocess-progress', file, {
                mode: 'indeterminate',
                message: this.i18n('generatingThumbnails'),
            });
        });
        const emitPreprocessCompleteForAll = () => {
            fileIDs.forEach((fileID) => {
                const file = this.uppy.getFile(fileID);
                this.uppy.emit('preprocess-complete', file);
            });
        };
        return new Promise((resolve) => {
            if (this.queueProcessing) {
                this.uppy.once('thumbnail:all-generated', () => {
                    emitPreprocessCompleteForAll();
                    resolve();
                });
            }
            else {
                emitPreprocessCompleteForAll();
                resolve();
            }
        });
    };
    install() {
        this.uppy.on('file-removed', this.onFileRemoved);
        this.uppy.on('cancel-all', this.onAllFilesRemoved);
        if (this.opts.lazy) {
            this.uppy.on('thumbnail:request', this.onFileAdded);
            this.uppy.on('thumbnail:cancel', this.onCancelRequest);
        }
        else {
            this.uppy.on('thumbnail:request', this.onFileAdded);
            this.uppy.on('file-added', this.onFileAdded);
            this.uppy.on('restored', this.onRestored);
        }
        if (this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.addPreProcessor(this.waitUntilAllProcessed);
        }
    }
    uninstall() {
        this.uppy.off('file-removed', this.onFileRemoved);
        this.uppy.off('cancel-all', this.onAllFilesRemoved);
        if (this.opts.lazy) {
            this.uppy.off('thumbnail:request', this.onFileAdded);
            this.uppy.off('thumbnail:cancel', this.onCancelRequest);
        }
        else {
            this.uppy.off('thumbnail:request', this.onFileAdded);
            this.uppy.off('file-added', this.onFileAdded);
            this.uppy.off('restored', this.onRestored);
        }
        if (this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.removePreProcessor(this.waitUntilAllProcessed);
        }
    }
}

;// ./node_modules/@uppy/utils/lib/findAllDOMElements.js

/**
 * Find one or more DOM elements.
 */
function findAllDOMElements(element) {
    if (typeof element === 'string') {
        const elements = document.querySelectorAll(element);
        return elements.length === 0 ? null : Array.from(elements);
    }
    if (typeof element === 'object' && isDOMElement(element)) {
        return [element];
    }
    return null;
}
/* harmony default export */ const lib_findAllDOMElements = (findAllDOMElements);

;// ./node_modules/@uppy/utils/lib/toArray.js
/**
 * Converts list into array
 */
/* harmony default export */ const toArray = (Array.from);

;// ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js

// .files fallback, should be implemented in any browser
function fallbackApi(dataTransfer) {
    const files = toArray(dataTransfer.files);
    return Promise.resolve(files);
}

;// ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js
/**
 * Recursive function, calls the original callback() when the directory is entirely parsed.
 */
function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, { onSuccess }) {
    directoryReader.readEntries((entries) => {
        const newEntries = [...oldEntries, ...entries];
        // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory()
        // must be called until it calls the onSuccess with an empty array.
        if (entries.length) {
            queueMicrotask(() => {
                getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, { onSuccess });
            });
            // Done iterating this particular directory
        }
        else {
            onSuccess(newEntries);
        }
    }, 
    // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
    (error) => {
        logDropError(error);
        onSuccess(oldEntries);
    });
}

;// ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js

/**
 * Polyfill for the new (experimental) getAsFileSystemHandle API (using the popular webkitGetAsEntry behind the scenes)
 * so that we can switch to the getAsFileSystemHandle API once it (hopefully) becomes standard
 */
function getAsFileSystemHandleFromEntry(entry, logDropError) {
    if (entry == null)
        return entry;
    return {
        kind: entry.isFile
            ? 'file'
            : entry.isDirectory
                ? 'directory'
                : undefined,
        name: entry.name,
        getFile() {
            return new Promise((resolve, reject) => entry.file(resolve, reject));
        },
        async *values() {
            // If the file is a directory.
            const directoryReader = entry.createReader();
            const entries = await new Promise((resolve) => {
                getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
                    onSuccess: (dirEntries) => resolve(dirEntries.map((file) => getAsFileSystemHandleFromEntry(file, logDropError))),
                });
            });
            yield* entries;
        },
        isSameEntry: undefined,
    };
}
async function* createPromiseToAddFileOrParseDirectory(entry, relativePath, lastResortFile = undefined) {
    const getNextRelativePath = () => `${relativePath}/${entry.name}`;
    // For each dropped item, - make sure it's a file/directory, and start deepening in!
    if (entry.kind === 'file') {
        const file = await entry.getFile();
        if (file != null) {
            ;
            file.relativePath = relativePath ? getNextRelativePath() : null;
            yield file;
        }
        else if (lastResortFile != null)
            yield lastResortFile;
    }
    else if (entry.kind === 'directory') {
        for await (const handle of entry.values()) {
            // Recurse on the directory, appending the dir name to the relative path
            yield* createPromiseToAddFileOrParseDirectory(handle, relativePath ? getNextRelativePath() : entry.name);
        }
    }
    else if (lastResortFile != null)
        yield lastResortFile;
}
/**
 * Load all files from data transfer, and recursively read any directories.
 * Note that IE is not supported for drag-drop, because IE doesn't support Data Transfers
 *
 * @param {DataTransfer} dataTransfer
 * @param {*} logDropError on error
 */
async function* getFilesFromDataTransfer(dataTransfer, logDropError) {
    // Retrieving the dropped items must happen synchronously
    // otherwise only the first item gets treated and the other ones are garbage collected.
    // https://github.com/transloadit/uppy/pull/3998
    const fileSystemHandles = await Promise.all(Array.from(dataTransfer.items, async (item) => {
        // biome-ignore lint/style/useConst: ...
        let fileSystemHandle;
        // TODO enable getAsFileSystemHandle API once we can get it working with subdirectories
        // IMPORTANT: Need to check isSecureContext *before* calling getAsFileSystemHandle
        // or else Chrome will crash when running in HTTP: https://github.com/transloadit/uppy/issues/4133
        // if (window.isSecureContext && item.getAsFileSystemHandle != null)
        // fileSystemHandle = await item.getAsFileSystemHandle()
        // `webkitGetAsEntry` exists in all popular browsers (including non-WebKit browsers),
        // however it may be renamed to getAsEntry() in the future, so you should code defensively, looking for both.
        // from https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
        const getAsEntry = () => typeof item.getAsEntry === 'function'
            ? item.getAsEntry()
            : item.webkitGetAsEntry();
        fileSystemHandle ??= getAsFileSystemHandleFromEntry(getAsEntry(), logDropError);
        return {
            fileSystemHandle,
            lastResortFile: item.getAsFile(), // can be used as a fallback in case other methods fail
        };
    }));
    for (const { lastResortFile, fileSystemHandle } of fileSystemHandles) {
        // fileSystemHandle and lastResortFile can be null when we drop an url.
        if (fileSystemHandle != null) {
            try {
                yield* createPromiseToAddFileOrParseDirectory(fileSystemHandle, '', lastResortFile);
            }
            catch (err) {
                // Example: If dropping a symbolic link, Chromium will throw:
                // "DOMException: A requested file or directory could not be found at the time an operation was processed.",
                // So we will use lastResortFile instead. See https://github.com/transloadit/uppy/issues/3505.
                if (lastResortFile != null) {
                    yield lastResortFile;
                }
                else {
                    logDropError(err);
                }
            }
        }
        else if (lastResortFile != null)
            yield lastResortFile;
    }
}

;// ./node_modules/@uppy/utils/lib/getDroppedFiles/index.js


/**
 * Returns a promise that resolves to the array of dropped files (if a folder is
 * dropped, and browser supports folder parsing - promise resolves to the flat
 * array of all files in all directories).
 * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf")
 * if browser supports it. Otherwise it's undefined.
 *
 * @param dataTransfer
 * @param options
 * @param options.logDropError - a function that's called every time some
 * folder or some file error out (e.g. because of the folder name being too long
 * on Windows). Notice that resulting promise will always be resolved anyway.
 *
 * @returns {Promise} - Array<File>
 */
async function getDroppedFiles(dataTransfer, options) {
    // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
    const logDropError = options?.logDropError ?? Function.prototype;
    try {
        const accumulator = [];
        for await (const file of getFilesFromDataTransfer(dataTransfer, logDropError)) {
            accumulator.push(file);
        }
        return accumulator;
        // Otherwise just return all first-order files
    }
    catch {
        return fallbackApi(dataTransfer);
    }
}

;// ./node_modules/@uppy/dashboard/package.json
const dashboard_package_namespaceObject = {"rE":"4.4.3"};
;// ./node_modules/@uppy/utils/lib/isDragDropSupported.js
/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 */
function isDragDropSupported() {
    const div = document.body;
    if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
        return false;
    }
    if (!('FormData' in window)) {
        return false;
    }
    if (!('FileReader' in window)) {
        return false;
    }
    return true;
}

;// ./node_modules/@uppy/dashboard/lib/components/AddFiles.js


class AddFiles extends preact_module_C {
    fileInput = null;
    folderInput = null;
    mobilePhotoFileInput = null;
    mobileVideoFileInput = null;
    triggerFileInputClick = () => {
        this.fileInput?.click();
    };
    triggerFolderInputClick = () => {
        this.folderInput?.click();
    };
    triggerVideoCameraInputClick = () => {
        this.mobileVideoFileInput?.click();
    };
    triggerPhotoCameraInputClick = () => {
        this.mobilePhotoFileInput?.click();
    };
    onFileInputChange = (event) => {
        this.props.handleInputChange(event);
        // Clear the input so that Chrome/Safari/etc. can detect file section when the same file is repeatedly selected
        // (see https://github.com/transloadit/uppy/issues/768#issuecomment-2264902758)
        event.currentTarget.value = '';
    };
    renderHiddenInput = (isFolder, refCallback) => {
        return (jsxRuntime_module_u("input", { className: "uppy-Dashboard-input", hidden: true, "aria-hidden": "true", tabIndex: -1, 
            // @ts-expect-error default types don't yet know about the `webkitdirectory` property
            webkitdirectory: isFolder, type: "file", name: "files[]", multiple: this.props.maxNumberOfFiles !== 1, onChange: this.onFileInputChange, accept: this.props.allowedFileTypes?.join(', '), ref: refCallback }));
    };
    renderHiddenCameraInput = (type, nativeCameraFacingMode, refCallback) => {
        const typeToAccept = { photo: 'image/*', video: 'video/*' };
        const accept = typeToAccept[type];
        return (jsxRuntime_module_u("input", { className: "uppy-Dashboard-input", hidden: true, "aria-hidden": "true", tabIndex: -1, type: "file", name: `camera-${type}`, onChange: this.onFileInputChange, capture: nativeCameraFacingMode === '' ? 'environment' : nativeCameraFacingMode, accept: accept, ref: refCallback }));
    };
    renderMyDeviceAcquirer = () => {
        return (jsxRuntime_module_u("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": "MyDevice", children: jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-uppy-super-focusable": true, onClick: this.triggerFileInputClick, children: [jsxRuntime_module_u("div", { className: "uppy-DashboardTab-inner", children: jsxRuntime_module_u("svg", { className: "uppy-DashboardTab-iconMyDevice", "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: jsxRuntime_module_u("path", { d: "M8.45 22.087l-1.305-6.674h17.678l-1.572 6.674H8.45zm4.975-12.412l1.083 1.765a.823.823 0 00.715.386h7.951V13.5H8.587V9.675h4.838zM26.043 13.5h-1.195v-2.598c0-.463-.336-.75-.798-.75h-8.356l-1.082-1.766A.823.823 0 0013.897 8H7.728c-.462 0-.815.256-.815.718V13.5h-.956a.97.97 0 00-.746.37.972.972 0 00-.19.81l1.724 8.565c.095.44.484.755.933.755H24c.44 0 .824-.3.929-.727l2.043-8.568a.972.972 0 00-.176-.825.967.967 0 00-.753-.38z", fill: "currentcolor", "fill-rule": "evenodd" }) }) }), jsxRuntime_module_u("div", { className: "uppy-DashboardTab-name", children: this.props.i18n('myDevice') })] }) }));
    };
    renderPhotoCamera = () => {
        return (jsxRuntime_module_u("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": "MobilePhotoCamera", children: jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-uppy-super-focusable": true, onClick: this.triggerPhotoCameraInputClick, children: [jsxRuntime_module_u("div", { className: "uppy-DashboardTab-inner", children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: jsxRuntime_module_u("path", { d: "M23.5 9.5c1.417 0 2.5 1.083 2.5 2.5v9.167c0 1.416-1.083 2.5-2.5 2.5h-15c-1.417 0-2.5-1.084-2.5-2.5V12c0-1.417 1.083-2.5 2.5-2.5h2.917l1.416-2.167C13 7.167 13.25 7 13.5 7h5c.25 0 .5.167.667.333L20.583 9.5H23.5zM16 11.417a4.706 4.706 0 00-4.75 4.75 4.704 4.704 0 004.75 4.75 4.703 4.703 0 004.75-4.75c0-2.663-2.09-4.75-4.75-4.75zm0 7.825c-1.744 0-3.076-1.332-3.076-3.074 0-1.745 1.333-3.077 3.076-3.077 1.744 0 3.074 1.333 3.074 3.076s-1.33 3.075-3.074 3.075z", fill: "#02B383", "fill-rule": "nonzero" }) }) }), jsxRuntime_module_u("div", { className: "uppy-DashboardTab-name", children: this.props.i18n('takePictureBtn') })] }) }));
    };
    renderVideoCamera = () => {
        return (jsxRuntime_module_u("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": "MobileVideoCamera", children: jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-uppy-super-focusable": true, onClick: this.triggerVideoCameraInputClick, children: [jsxRuntime_module_u("div", { className: "uppy-DashboardTab-inner", children: jsxRuntime_module_u("svg", { "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", children: jsxRuntime_module_u("path", { fill: "#FF675E", fillRule: "nonzero", d: "m21.254 14.277 2.941-2.588c.797-.313 1.243.818 1.09 1.554-.01 2.094.02 4.189-.017 6.282-.126.915-1.145 1.08-1.58.34l-2.434-2.142c-.192.287-.504 1.305-.738.468-.104-1.293-.028-2.596-.05-3.894.047-.312.381.823.426 1.069.063-.384.206-.744.362-1.09zm-12.939-3.73c3.858.013 7.717-.025 11.574.02.912.129 1.492 1.237 1.351 2.217-.019 2.412.04 4.83-.03 7.239-.17 1.025-1.166 1.59-2.029 1.429-3.705-.012-7.41.025-11.114-.019-.913-.129-1.492-1.237-1.352-2.217.018-2.404-.036-4.813.029-7.214.136-.82.83-1.473 1.571-1.454z " }) }) }), jsxRuntime_module_u("div", { className: "uppy-DashboardTab-name", children: this.props.i18n('recordVideoBtn') })] }) }));
    };
    renderBrowseButton = (text, onClickFn) => {
        const numberOfAcquirers = this.props.acquirers.length;
        return (jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-Dashboard-browse", onClick: onClickFn, "data-uppy-super-focusable": numberOfAcquirers === 0, children: text }));
    };
    renderDropPasteBrowseTagline = (numberOfAcquirers) => {
        const browseFiles = this.renderBrowseButton(this.props.i18n('browseFiles'), this.triggerFileInputClick);
        const browseFolders = this.renderBrowseButton(this.props.i18n('browseFolders'), this.triggerFolderInputClick);
        // in order to keep the i18n CamelCase and options lower (as are defaults) we will want to transform a lower
        // to Camel
        const lowerFMSelectionType = this.props.fileManagerSelectionType;
        const camelFMSelectionType = lowerFMSelectionType.charAt(0).toUpperCase() +
            lowerFMSelectionType.slice(1);
        return (jsxRuntime_module_u("div", { class: "uppy-Dashboard-AddFiles-title", children: this.props.disableLocalFiles
                ? this.props.i18n('importFiles')
                : numberOfAcquirers > 0
                    ? this.props.i18nArray(`dropPasteImport${camelFMSelectionType}`, {
                        browseFiles,
                        browseFolders,
                        browse: browseFiles,
                    })
                    : this.props.i18nArray(`dropPaste${camelFMSelectionType}`, {
                        browseFiles,
                        browseFolders,
                        browse: browseFiles,
                    }) }));
    };
    [Symbol.for('uppy test: disable unused locale key warning')]() {
        // Those are actually used in `renderDropPasteBrowseTagline` method.
        this.props.i18nArray('dropPasteBoth');
        this.props.i18nArray('dropPasteFiles');
        this.props.i18nArray('dropPasteFolders');
        this.props.i18nArray('dropPasteImportBoth');
        this.props.i18nArray('dropPasteImportFiles');
        this.props.i18nArray('dropPasteImportFolders');
    }
    renderAcquirer = (acquirer) => {
        return (jsxRuntime_module_u("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": acquirer.id, children: jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-cy": acquirer.id, "aria-controls": `uppy-DashboardContent-panel--${acquirer.id}`, "aria-selected": this.props.activePickerPanel?.id === acquirer.id, "data-uppy-super-focusable": true, onClick: () => this.props.showPanel(acquirer.id), children: [jsxRuntime_module_u("div", { className: "uppy-DashboardTab-inner", children: acquirer.icon() }), jsxRuntime_module_u("div", { className: "uppy-DashboardTab-name", children: acquirer.name })] }) }));
    };
    renderAcquirers = (acquirers) => {
        // Group last two buttons, so we don’t end up with
        // just one button on a new line
        const acquirersWithoutLastTwo = [...acquirers];
        const lastTwoAcquirers = acquirersWithoutLastTwo.splice(acquirers.length - 2, acquirers.length);
        return (jsxRuntime_module_u(preact_module_S, { children: [acquirersWithoutLastTwo.map((acquirer) => this.renderAcquirer(acquirer)), jsxRuntime_module_u("span", { role: "presentation", style: { 'white-space': 'nowrap' }, children: lastTwoAcquirers.map((acquirer) => this.renderAcquirer(acquirer)) })] }));
    };
    renderSourcesList = (acquirers, disableLocalFiles) => {
        const { showNativePhotoCameraButton, showNativeVideoCameraButton } = this.props;
        let list = [];
        const myDeviceKey = 'myDevice';
        if (!disableLocalFiles)
            list.push({
                key: myDeviceKey,
                elements: this.renderMyDeviceAcquirer(),
            });
        if (showNativePhotoCameraButton)
            list.push({
                key: 'nativePhotoCameraButton',
                elements: this.renderPhotoCamera(),
            });
        if (showNativeVideoCameraButton)
            list.push({
                key: 'nativePhotoCameraButton',
                elements: this.renderVideoCamera(),
            });
        list.push(...acquirers.map((acquirer) => ({
            key: acquirer.id,
            elements: this.renderAcquirer(acquirer),
        })));
        // doesn't make sense to show only a lonely "My Device"
        const hasOnlyMyDevice = list.length === 1 && list[0].key === myDeviceKey;
        if (hasOnlyMyDevice)
            list = [];
        // Group last two buttons, so we don’t end up with
        // just one button on a new line
        const listWithoutLastTwo = [...list];
        const lastTwo = listWithoutLastTwo.splice(list.length - 2, list.length);
        return (jsxRuntime_module_u(preact_module_S, { children: [this.renderDropPasteBrowseTagline(list.length), jsxRuntime_module_u("div", { className: "uppy-Dashboard-AddFiles-list", role: "tablist", children: [listWithoutLastTwo.map(({ key, elements }) => (jsxRuntime_module_u(preact_module_S, { children: elements }, key))), jsxRuntime_module_u("span", { role: "presentation", style: { 'white-space': 'nowrap' }, children: lastTwo.map(({ key, elements }) => (jsxRuntime_module_u(preact_module_S, { children: elements }, key))) })] })] }));
    };
    renderPoweredByUppy() {
        const { i18nArray } = this.props;
        const uppyBranding = (jsxRuntime_module_u("span", { children: [jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon uppy-Dashboard-poweredByIcon", width: "11", height: "11", viewBox: "0 0 11 11", children: jsxRuntime_module_u("path", { d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z", fillRule: "evenodd" }) }), jsxRuntime_module_u("span", { className: "uppy-Dashboard-poweredByUppy", children: "Uppy" })] }));
        const linkText = i18nArray('poweredBy', { uppy: uppyBranding });
        return (jsxRuntime_module_u("a", { tabIndex: -1, href: "https://uppy.io", rel: "noreferrer noopener", target: "_blank", className: "uppy-Dashboard-poweredBy", children: linkText }));
    }
    render() {
        const { showNativePhotoCameraButton, showNativeVideoCameraButton, nativeCameraFacingMode, } = this.props;
        return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-AddFiles", children: [this.renderHiddenInput(false, (ref) => {
                    this.fileInput = ref;
                }), this.renderHiddenInput(true, (ref) => {
                    this.folderInput = ref;
                }), showNativePhotoCameraButton &&
                    this.renderHiddenCameraInput('photo', nativeCameraFacingMode, (ref) => {
                        this.mobilePhotoFileInput = ref;
                    }), showNativeVideoCameraButton &&
                    this.renderHiddenCameraInput('video', nativeCameraFacingMode, (ref) => {
                        this.mobileVideoFileInput = ref;
                    }), this.renderSourcesList(this.props.acquirers, this.props.disableLocalFiles), jsxRuntime_module_u("div", { className: "uppy-Dashboard-AddFiles-info", children: [this.props.note && (jsxRuntime_module_u("div", { className: "uppy-Dashboard-note", children: this.props.note })), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy()] })] }));
    }
}
/* harmony default export */ const components_AddFiles = (AddFiles);

;// ./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js




const AddFilesPanel = (props) => {
    return (jsxRuntime_module_u("div", { className: classnames('uppy-Dashboard-AddFilesPanel', props.className), "data-uppy-panelType": "AddFiles", "aria-hidden": !props.showAddFilesPanel, children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-bar", children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: props.i18n('addingMoreFiles') }), jsxRuntime_module_u("button", { className: "uppy-DashboardContent-back", type: "button", onClick: () => props.toggleAddFilesPanel(false), children: props.i18n('back') })] }), jsxRuntime_module_u(components_AddFiles, { ...props })] }));
};
/* harmony default export */ const components_AddFilesPanel = (AddFilesPanel);

;// ./node_modules/@uppy/dashboard/lib/components/EditorPanel.js



function EditorPanel(props) {
    const file = props.files[props.fileCardFor];
    const handleCancel = () => {
        props.uppy.emit('file-editor:cancel', file);
        props.closeFileEditor();
    };
    return (jsxRuntime_module_u("div", { className: classnames('uppy-DashboardContent-panel', props.className), role: "tabpanel", "data-uppy-panelType": "FileEditor", id: "uppy-DashboardContent-panel--editor", children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-bar", children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: props.i18nArray('editing', {
                            file: (jsxRuntime_module_u("span", { className: "uppy-DashboardContent-titleFile", children: file.meta ? file.meta.name : file.name })),
                        }) }), jsxRuntime_module_u("button", { className: "uppy-DashboardContent-back", type: "button", onClick: handleCancel, children: props.i18n('cancel') }), jsxRuntime_module_u("button", { className: "uppy-DashboardContent-save", type: "button", onClick: props.saveFileEditor, children: props.i18n('save') })] }), jsxRuntime_module_u("div", { className: "uppy-DashboardContent-panelBody", children: props.editors.map((target) => {
                    return props.uppy.getPlugin(target.id).render(props.state);
                }) })] }));
}
/* harmony default export */ const components_EditorPanel = (EditorPanel);

;// ./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js


function iconImage() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("g", { fill: "#686DE0", fillRule: "evenodd", children: [jsxRuntime_module_u("path", { d: "M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z", fillRule: "nonzero" }), jsxRuntime_module_u("path", { d: "M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z", fillRule: "nonzero" }), jsxRuntime_module_u("circle", { cx: "7.5", cy: "9.5", r: "1.5" })] }) }));
}
function iconAudio() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("path", { d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z", fill: "#049BCF", fillRule: "nonzero" }) }));
}
function iconVideo() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("path", { d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z", fill: "#19AF67", fillRule: "nonzero" }) }));
}
function iconPDF() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("path", { d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z", fill: "#E2514A", fillRule: "nonzero" }) }));
}
function iconArchive() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("path", { d: "M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z", fill: "#00C469", fillRule: "nonzero" }) }));
}
function iconFile() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("g", { fill: "#A7AFB7", fillRule: "nonzero", children: [jsxRuntime_module_u("path", { d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z" }), jsxRuntime_module_u("path", { d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z" })] }) }));
}
function iconText() {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: jsxRuntime_module_u("path", { d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z", fill: "#5A5E69", fillRule: "nonzero" }) }));
}
function getIconByMime(fileType) {
    const defaultChoice = {
        color: '#838999',
        icon: iconFile(),
    };
    if (!fileType)
        return defaultChoice;
    const fileTypeGeneral = fileType.split('/')[0];
    const fileTypeSpecific = fileType.split('/')[1];
    // Text
    if (fileTypeGeneral === 'text') {
        return {
            color: '#5a5e69',
            icon: iconText(),
        };
    }
    // Image
    if (fileTypeGeneral === 'image') {
        return {
            color: '#686de0',
            icon: iconImage(),
        };
    }
    // Audio
    if (fileTypeGeneral === 'audio') {
        return {
            color: '#068dbb',
            icon: iconAudio(),
        };
    }
    // Video
    if (fileTypeGeneral === 'video') {
        return {
            color: '#19af67',
            icon: iconVideo(),
        };
    }
    // PDF
    if (fileTypeGeneral === 'application' && fileTypeSpecific === 'pdf') {
        return {
            color: '#e25149',
            icon: iconPDF(),
        };
    }
    // Archive
    const archiveTypes = [
        'zip',
        'x-7z-compressed',
        'x-zip-compressed',
        'x-rar-compressed',
        'x-tar',
        'x-gzip',
        'x-apple-diskimage',
    ];
    if (fileTypeGeneral === 'application' &&
        archiveTypes.indexOf(fileTypeSpecific) !== -1) {
        return {
            color: '#00C469',
            icon: iconArchive(),
        };
    }
    return defaultChoice;
}

;// ./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js
// ignore drop/paste events if they are not in input or textarea —
// otherwise when Url plugin adds drop/paste listeners to this.el,
// draging UI elements or pasting anything into any field triggers those events —
// Url treats them as URLs that need to be imported
function ignoreEvent(ev) {
    const { tagName } = ev.target;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        ev.stopPropagation();
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
}
/* harmony default export */ const utils_ignoreEvent = (ignoreEvent);

;// ./node_modules/@uppy/dashboard/lib/components/FilePreview.js



function FilePreview(props) {
    const { file } = props;
    if (file.preview) {
        return (jsxRuntime_module_u("img", { draggable: false, className: "uppy-Dashboard-Item-previewImg", alt: file.name, src: file.preview }));
    }
    const { color, icon } = getIconByMime(file.type);
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-previewIconWrap", children: [jsxRuntime_module_u("span", { className: "uppy-Dashboard-Item-previewIcon", style: { color }, children: icon }), jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-Dashboard-Item-previewIconBg", width: "58", height: "76", viewBox: "0 0 58 76", children: jsxRuntime_module_u("rect", { fill: "#FFF", width: "58", height: "76", rx: "3", fillRule: "evenodd" }) })] }));
}

;// ./node_modules/@uppy/dashboard/lib/components/FileCard/RenderMetaFields.js


function RenderMetaFields(props) {
    const { computedMetaFields, requiredMetaFields, updateMeta, form, formState, } = props;
    const fieldCSSClasses = {
        text: 'uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input',
    };
    return computedMetaFields.map((field) => {
        const id = `uppy-Dashboard-FileCard-input-${field.id}`;
        const required = requiredMetaFields.includes(field.id);
        return (jsxRuntime_module_u("fieldset", { className: "uppy-Dashboard-FileCard-fieldset", children: [jsxRuntime_module_u("label", { className: "uppy-Dashboard-FileCard-label", htmlFor: id, children: field.name }), field.render !== undefined ? (field.render({
                    value: formState[field.id],
                    onChange: (newVal) => updateMeta(newVal, field.id),
                    fieldCSSClasses,
                    required,
                    form: form.id,
                }, preact_module_k)) : (jsxRuntime_module_u("input", { className: fieldCSSClasses.text, id: id, form: form.id, type: field.type || 'text', required: required, value: formState[field.id], placeholder: field.placeholder, onInput: (ev) => updateMeta(ev.target.value, field.id), "data-uppy-super-focusable": true }))] }, field.id));
    });
}

;// ./node_modules/@uppy/dashboard/lib/components/FileCard/index.js









function FileCard(props) {
    const { files, fileCardFor, toggleFileCard, saveFileCard, metaFields, requiredMetaFields, openFileEditor, i18n, i18nArray, className, canEditFile, } = props;
    const getMetaFields = () => {
        return typeof metaFields === 'function'
            ? metaFields(files[fileCardFor])
            : metaFields;
    };
    const file = files[fileCardFor];
    const computedMetaFields = getMetaFields() ?? [];
    const showEditButton = canEditFile(file);
    const storedMetaData = {};
    computedMetaFields.forEach((field) => {
        storedMetaData[field.id] = file.meta[field.id] ?? '';
    });
    const [formState, setFormState] = hooks_module_d(storedMetaData);
    const handleSave = hooks_module_q((ev) => {
        ev.preventDefault();
        saveFileCard(formState, fileCardFor);
    }, [saveFileCard, formState, fileCardFor]);
    const updateMeta = (newVal, name) => {
        setFormState({
            ...formState,
            [name]: newVal,
        });
    };
    const handleCancel = () => {
        toggleFileCard(false);
    };
    const [form] = hooks_module_d(() => {
        const formEl = document.createElement('form');
        formEl.setAttribute('tabindex', '-1');
        formEl.id = nanoid();
        return formEl;
    });
    hooks_module_h(() => {
        document.body.appendChild(form);
        form.addEventListener('submit', handleSave);
        return () => {
            form.removeEventListener('submit', handleSave);
            document.body.removeChild(form);
        };
    }, [form, handleSave]);
    return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ...
    jsxRuntime_module_u("div", { className: classnames('uppy-Dashboard-FileCard', className), "data-uppy-panelType": "FileCard", onDragOver: utils_ignoreEvent, onDragLeave: utils_ignoreEvent, onDrop: utils_ignoreEvent, onPaste: utils_ignoreEvent, children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-bar", children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: i18nArray('editing', {
                            file: (jsxRuntime_module_u("span", { className: "uppy-DashboardContent-titleFile", children: file.meta ? file.meta.name : file.name })),
                        }) }), jsxRuntime_module_u("button", { className: "uppy-DashboardContent-back", type: "button", form: form.id, title: i18n('finishEditingFile'), onClick: handleCancel, children: i18n('cancel') })] }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-FileCard-inner", children: [jsxRuntime_module_u("div", { className: "uppy-Dashboard-FileCard-preview", style: { backgroundColor: getIconByMime(file.type).color }, children: [jsxRuntime_module_u(FilePreview, { file: file }), showEditButton && (jsxRuntime_module_u("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit", onClick: (event) => {
                                    // When opening the image editor we want to save any meta fields changes.
                                    // Otherwise it's confusing for the user to click save in the editor,
                                    // but the changes here are discarded. This bypasses validation,
                                    // but we are okay with that.
                                    handleSave(event);
                                    openFileEditor(file);
                                }, children: i18n('editImage') }))] }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-FileCard-info", children: jsxRuntime_module_u(RenderMetaFields, { computedMetaFields: computedMetaFields, requiredMetaFields: requiredMetaFields, updateMeta: updateMeta, form: form, formState: formState }) }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-FileCard-actions", children: [jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn", 
                                // If `form` attribute is supported, we want a submit button to trigger the form validation.
                                // Otherwise, fallback to a classic button with a onClick event handler.
                                type: "submit", form: form.id, children: i18n('saveChanges') }), jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn", type: "button", onClick: handleCancel, form: form.id, children: i18n('cancel') })] })] })] }));
}

;// ./node_modules/shallow-equal/dist/index.modern.mjs
function shallowEqualArrays(arrA, arrB) {
  if (arrA === arrB) {
    return true;
  }
  if (!arrA || !arrB) {
    return false;
  }
  const len = arrA.length;
  if (arrB.length !== len) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }
  return true;
}

function shallowEqualObjects(objA, objB) {
  if (objA === objB) {
    return true;
  }
  if (!objA || !objB) {
    return false;
  }
  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;
  if (bKeys.length !== len) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    const key = aKeys[i];
    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }
  return true;
}

function shallowEqual(a, b) {
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr !== bIsArr) {
    return false;
  }
  if (aIsArr && bIsArr) {
    return shallowEqualArrays(a, b);
  }
  return shallowEqualObjects(a, b);
}


//# sourceMappingURL=index.modern.mjs.map

;// ./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js
/**
 * Copies text to clipboard by creating an almost invisible textarea,
 * adding text there, then running execCommand('copy').
 * Falls back to prompt() when the easy way fails (hello, Safari!)
 * From http://stackoverflow.com/a/30810322
 *
 * @param {string} textToCopy
 * @param {string} fallbackString
 * @returns {Promise}
 */
function copyToClipboard(textToCopy, fallbackString = 'Copy the URL below') {
    return new Promise((resolve) => {
        const textArea = document.createElement('textarea');
        textArea.setAttribute('style', {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '2em',
            height: '2em',
            padding: 0,
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
        });
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        const magicCopyFailed = () => {
            document.body.removeChild(textArea);
            window.prompt(fallbackString, textToCopy);
            resolve();
        };
        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                return magicCopyFailed();
            }
            document.body.removeChild(textArea);
            return resolve();
        }
        catch (_err) {
            document.body.removeChild(textArea);
            return magicCopyFailed();
        }
    });
}

;// ./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js



function EditButton({ file, uploadInProgressOrComplete, metaFields, canEditFile, i18n, onClick, }) {
    if ((!uploadInProgressOrComplete && metaFields && metaFields.length > 0) ||
        (!uploadInProgressOrComplete && canEditFile(file))) {
        return (jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit", type: "button", "aria-label": i18n('editFileWithFilename', { file: file.meta.name }), title: i18n('editFileWithFilename', { file: file.meta.name }), onClick: () => onClick(), children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "14", height: "14", viewBox: "0 0 14 14", children: jsxRuntime_module_u("g", { fillRule: "evenodd", children: [jsxRuntime_module_u("path", { d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z", fillRule: "nonzero" }), jsxRuntime_module_u("rect", { x: "1", y: "12.293", width: "11", height: "1", rx: ".5" }), jsxRuntime_module_u("path", { fillRule: "nonzero", d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z" })] }) }) }));
    }
    return null;
}
function RemoveButton({ i18n, onClick, file, }) {
    return (jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove", type: "button", "aria-label": i18n('removeFile', { file: file.meta.name }), title: i18n('removeFile', { file: file.meta.name }), onClick: () => onClick(), children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "18", height: "18", viewBox: "0 0 18 18", children: [jsxRuntime_module_u("path", { d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z" }), jsxRuntime_module_u("path", { fill: "#FFF", d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z" })] }) }));
}
function CopyLinkButton({ file, uppy, i18n, }) {
    const copyLinkToClipboard = (event) => {
        copyToClipboard(file.uploadURL, i18n('copyLinkToClipboardFallback'))
            .then(() => {
            uppy.log('Link copied to clipboard.');
            uppy.info(i18n('copyLinkToClipboardSuccess'), 'info', 3000);
        })
            .catch(uppy.log)
            // avoid losing focus
            .then(() => event.target.focus({ preventScroll: true }));
    };
    return (jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink", type: "button", "aria-label": i18n('copyLink'), title: i18n('copyLink'), onClick: (event) => copyLinkToClipboard(event), children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "14", height: "14", viewBox: "0 0 14 12", children: jsxRuntime_module_u("path", { d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z" }) }) }));
}
function Buttons(props) {
    const { uppy, file, uploadInProgressOrComplete, canEditFile, metaFields, showLinkToFileUploadResult, showRemoveButton, i18n, toggleFileCard, openFileEditor, } = props;
    const editAction = () => {
        if (metaFields && metaFields.length > 0) {
            toggleFileCard(true, file.id);
        }
        else {
            openFileEditor(file);
        }
    };
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-actionWrapper", children: [jsxRuntime_module_u(EditButton, { i18n: i18n, file: file, uploadInProgressOrComplete: uploadInProgressOrComplete, canEditFile: canEditFile, metaFields: metaFields, onClick: editAction }), showLinkToFileUploadResult && file.uploadURL ? (jsxRuntime_module_u(CopyLinkButton, { file: file, uppy: uppy, i18n: i18n })) : null, showRemoveButton ? (jsxRuntime_module_u(RemoveButton, { i18n: i18n, file: file, onClick: () => uppy.removeFile(file.id) })) : null] }));
}

;// ./node_modules/@uppy/utils/lib/truncateString.js
/**
 * Truncates a string to the given number of chars (maxLength) by inserting '...' in the middle of that string.
 * Partially taken from https://stackoverflow.com/a/5723274/3192470.
 */
const separator = '...';
function truncateString(string, maxLength) {
    // Return the empty string if maxLength is zero
    if (maxLength === 0)
        return '';
    // Return original string if it's already shorter than maxLength
    if (string.length <= maxLength)
        return string;
    // Return truncated substring appended of the ellipsis char if string can't be meaningfully truncated
    if (maxLength <= separator.length + 1)
        return `${string.slice(0, maxLength - 1)}…`;
    const charsToShow = maxLength - separator.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return string.slice(0, frontChars) + separator + string.slice(-backChars);
}

;// ./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js


const metaFieldIdToName = (metaFieldId, metaFields) => {
    const fields = typeof metaFields === 'function' ? metaFields() : metaFields;
    const field = fields.filter((f) => f.id === metaFieldId);
    return field[0].name;
};
function MetaErrorMessage(props) {
    const { file, toggleFileCard, i18n, metaFields } = props;
    const { missingRequiredMetaFields } = file;
    if (!missingRequiredMetaFields?.length) {
        return null;
    }
    const metaFieldsString = missingRequiredMetaFields
        .map((missingMetaField) => metaFieldIdToName(missingMetaField, metaFields))
        .join(', ');
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-errorMessage", children: [i18n('missingRequiredMetaFields', {
                smart_count: missingRequiredMetaFields.length,
                fields: metaFieldsString,
            }), ' ', jsxRuntime_module_u("button", { type: "button", class: "uppy-u-reset uppy-Dashboard-Item-errorMessageBtn", onClick: () => toggleFileCard(true, file.id), children: i18n('editFile') })] }));
}

;// ./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js





const renderFileName = (props) => {
    const { author, name } = props.file.meta;
    function getMaxNameLength() {
        if (props.isSingleFile && props.containerHeight >= 350) {
            return 90;
        }
        if (props.containerWidth <= 352) {
            return 35;
        }
        if (props.containerWidth <= 576) {
            return 60;
        }
        // When `author` is present, we want to make sure
        // the file name fits on one line so we can place
        // the author on the second line.
        return author ? 20 : 30;
    }
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-name", title: name, children: truncateString(name, getMaxNameLength()) }));
};
const renderAuthor = (props) => {
    const { author } = props.file.meta;
    const providerName = props.file.remote?.providerName;
    const dot = `\u00B7`;
    if (!author) {
        return null;
    }
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-author", children: [jsxRuntime_module_u("a", { href: `${author.url}?utm_source=Companion&utm_medium=referral`, target: "_blank", rel: "noopener noreferrer", children: truncateString(author.name, 13) }), providerName ? (jsxRuntime_module_u(preact_module_S, { children: [` ${dot} `, providerName, ` ${dot} `] })) : null] }));
};
const renderFileSize = (props) => props.file.size && (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-statusSize", children: prettierBytes_namespaceFn()(props.file.size) }));
const ReSelectButton = (props) => props.file.isGhost && (jsxRuntime_module_u("span", { children: [' \u2022 ', jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-reSelect", type: "button", onClick: () => props.toggleAddFilesPanel(true), children: props.i18n('reSelect') })] }));
const ErrorButton = ({ file, onClick, }) => {
    if (file.error) {
        return (jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-errorDetails", "aria-label": file.error, "data-microtip-position": "bottom", "data-microtip-size": "medium", onClick: onClick, type: "button", children: "?" }));
    }
    return null;
};
function FileInfo(props) {
    const { file, i18n, toggleFileCard, metaFields, toggleAddFilesPanel, isSingleFile, containerHeight, containerWidth, } = props;
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-fileInfo", "data-uppy-file-source": file.source, children: [jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-fileName", children: [renderFileName({
                        file,
                        isSingleFile,
                        containerHeight,
                        containerWidth,
                    }), jsxRuntime_module_u(ErrorButton, { file: file, onClick: () => alert(file.error) })] }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-status", children: [renderAuthor({ file }), renderFileSize({ file }), ReSelectButton({ file, toggleAddFilesPanel, i18n })] }), jsxRuntime_module_u(MetaErrorMessage, { file: file, i18n: i18n, toggleFileCard: toggleFileCard, metaFields: metaFields })] }));
}

;// ./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js





function FilePreviewAndLink(props) {
    const { file, i18n, toggleFileCard, metaFields, showLinkToFileUploadResult } = props;
    const white = 'rgba(255, 255, 255, 0.5)';
    const previewBackgroundColor = file.preview
        ? white
        : getIconByMime(file.type).color;
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-previewInnerWrap", style: { backgroundColor: previewBackgroundColor }, children: [showLinkToFileUploadResult && file.uploadURL && (jsxRuntime_module_u("a", { className: "uppy-Dashboard-Item-previewLink", href: file.uploadURL, rel: "noreferrer noopener", target: "_blank", "aria-label": file.meta.name, children: jsxRuntime_module_u("span", { hidden: true, children: file.meta.name }) })), jsxRuntime_module_u(FilePreview, { file: file }), jsxRuntime_module_u(MetaErrorMessage, { file: file, i18n: i18n, toggleFileCard: toggleFileCard, metaFields: metaFields })] }));
}

;// ./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js


function onPauseResumeCancelRetry(props) {
    if (props.isUploaded)
        return;
    if (props.error && !props.hideRetryButton) {
        props.uppy.retryUpload(props.file.id);
        return;
    }
    if (props.resumableUploads && !props.hidePauseResumeButton) {
        props.uppy.pauseResume(props.file.id);
    }
    else if (props.individualCancellation && !props.hideCancelButton) {
        props.uppy.removeFile(props.file.id);
    }
}
function progressIndicatorTitle(props) {
    if (props.isUploaded) {
        return props.i18n('uploadComplete');
    }
    if (props.error) {
        return props.i18n('retryUpload');
    }
    if (props.resumableUploads) {
        if (props.file.isPaused) {
            return props.i18n('resumeUpload');
        }
        return props.i18n('pauseUpload');
    }
    if (props.individualCancellation) {
        return props.i18n('cancelUpload');
    }
    return '';
}
function ProgressIndicatorButton(props) {
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-progress", children: jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-progressIndicator", type: "button", "aria-label": progressIndicatorTitle(props), title: progressIndicatorTitle(props), onClick: () => onPauseResumeCancelRetry(props), children: props.children }) }));
}
function ProgressCircleContainer({ children }) {
    return (jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", width: "70", height: "70", viewBox: "0 0 36 36", className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--circle", children: children }));
}
function ProgressCircle({ progress }) {
    // circle length equals 2 * PI * R
    const circleLength = 2 * Math.PI * 15;
    return (jsxRuntime_module_u("g", { children: [jsxRuntime_module_u("circle", { className: "uppy-Dashboard-Item-progressIcon--bg", r: "15", cx: "18", cy: "18", "stroke-width": "2", fill: "none" }), jsxRuntime_module_u("circle", { className: "uppy-Dashboard-Item-progressIcon--progress", r: "15", cx: "18", cy: "18", transform: "rotate(-90, 18, 18)", fill: "none", "stroke-width": "2", "stroke-dasharray": circleLength, "stroke-dashoffset": circleLength - (circleLength / 100) * progress })] }));
}
function FileProgress(props) {
    // Nothing if upload has not started
    if (!props.file.progress.uploadStarted) {
        return null;
    }
    if (props.file.progress.percentage === undefined) {
        return null;
    }
    // Green checkmark when complete
    if (props.isUploaded) {
        return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-progress", children: jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-progressIndicator", children: jsxRuntime_module_u(ProgressCircleContainer, { children: [jsxRuntime_module_u("circle", { r: "15", cx: "18", cy: "18", fill: "#1bb240" }), jsxRuntime_module_u("polygon", { className: "uppy-Dashboard-Item-progressIcon--check", transform: "translate(2, 3)", points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634" })] }) }) }));
    }
    if (props.recoveredState) {
        return null;
    }
    // Retry button for error
    if (props.error && !props.hideRetryButton) {
        return (jsxRuntime_module_u(ProgressIndicatorButton, { ...props, children: jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--retry", width: "28", height: "31", viewBox: "0 0 16 19", children: [jsxRuntime_module_u("path", { d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z" }), jsxRuntime_module_u("path", { d: "M7.9 3H10v2H7.9z" }), jsxRuntime_module_u("path", { d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z" }), jsxRuntime_module_u("path", { d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z" })] }) }));
    }
    // Pause/resume button for resumable uploads
    if (props.resumableUploads && !props.hidePauseResumeButton) {
        return (jsxRuntime_module_u(ProgressIndicatorButton, { ...props, children: jsxRuntime_module_u(ProgressCircleContainer, { children: [jsxRuntime_module_u(ProgressCircle, { progress: props.file.progress.percentage }), props.file.isPaused ? (jsxRuntime_module_u("polygon", { className: "uppy-Dashboard-Item-progressIcon--play", transform: "translate(3, 3)", points: "12 20 12 10 20 15" })) : (jsxRuntime_module_u("g", { className: "uppy-Dashboard-Item-progressIcon--pause", transform: "translate(14.5, 13)", children: [jsxRuntime_module_u("rect", { x: "0", y: "0", width: "2", height: "10", rx: "0" }), jsxRuntime_module_u("rect", { x: "5", y: "0", width: "2", height: "10", rx: "0" })] }))] }) }));
    }
    // Cancel button for non-resumable uploads if individualCancellation is supported (not bundled)
    if (!props.resumableUploads &&
        props.individualCancellation &&
        !props.hideCancelButton) {
        return (jsxRuntime_module_u(ProgressIndicatorButton, { ...props, children: jsxRuntime_module_u(ProgressCircleContainer, { children: [jsxRuntime_module_u(ProgressCircle, { progress: props.file.progress.percentage }), jsxRuntime_module_u("polygon", { className: "cancel", transform: "translate(2, 2)", points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12" })] }) }));
    }
    // Just progress when buttons are disabled
    return (jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-progress", children: jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-progressIndicator", children: jsxRuntime_module_u(ProgressCircleContainer, { children: jsxRuntime_module_u(ProgressCircle, { progress: props.file.progress.percentage }) }) }) }));
}

;// ./node_modules/@uppy/dashboard/lib/components/FileItem/index.js


// biome-ignore lint/style/useImportType: h is not a type






class FileItem extends preact_module_C {
    componentDidMount() {
        const { file } = this.props;
        if (!file.preview) {
            this.props.handleRequestThumbnail(file);
        }
    }
    shouldComponentUpdate(nextProps) {
        return !shallowEqualObjects(this.props, nextProps);
    }
    // VirtualList mounts FileItems again and they emit `thumbnail:request`
    // Otherwise thumbnails are broken or missing after Golden Retriever restores files
    componentDidUpdate() {
        const { file } = this.props;
        if (!file.preview) {
            this.props.handleRequestThumbnail(file);
        }
    }
    componentWillUnmount() {
        const { file } = this.props;
        if (!file.preview) {
            this.props.handleCancelThumbnail(file);
        }
    }
    render() {
        const { file } = this.props;
        const isProcessing = file.progress.preprocess || file.progress.postprocess;
        const isUploaded = !!file.progress.uploadComplete && !isProcessing && !file.error;
        const uploadInProgressOrComplete = !!file.progress.uploadStarted || !!isProcessing;
        const uploadInProgress = (file.progress.uploadStarted && !file.progress.uploadComplete) ||
            isProcessing;
        const error = file.error || false;
        // File that Golden Retriever was able to partly restore (only meta, not blob),
        // users still need to re-add it, so it’s a ghost
        const { isGhost } = file;
        let showRemoveButton = this.props.individualCancellation
            ? !isUploaded
            : !uploadInProgress && !isUploaded;
        if (isUploaded && this.props.showRemoveButtonAfterComplete) {
            showRemoveButton = true;
        }
        const dashboardItemClass = classnames({
            'uppy-Dashboard-Item': true,
            'is-inprogress': uploadInProgress && !this.props.recoveredState,
            'is-processing': isProcessing,
            'is-complete': isUploaded,
            'is-error': !!error,
            'is-resumable': this.props.resumableUploads,
            'is-noIndividualCancellation': !this.props.individualCancellation,
            'is-ghost': isGhost,
        });
        return (jsxRuntime_module_u("div", { className: dashboardItemClass, id: `uppy_${file.id}`, role: this.props.role, children: [jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-preview", children: [jsxRuntime_module_u(FilePreviewAndLink, { file: file, showLinkToFileUploadResult: this.props.showLinkToFileUploadResult, i18n: this.props.i18n, toggleFileCard: this.props.toggleFileCard, metaFields: this.props.metaFields }), jsxRuntime_module_u(FileProgress, { uppy: this.props.uppy, file: file, error: error, isUploaded: isUploaded, hideRetryButton: this.props.hideRetryButton, hideCancelButton: this.props.hideCancelButton, hidePauseResumeButton: this.props.hidePauseResumeButton, recoveredState: this.props.recoveredState, resumableUploads: this.props.resumableUploads, individualCancellation: this.props.individualCancellation, i18n: this.props.i18n })] }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-Item-fileInfoAndButtons", children: [jsxRuntime_module_u(FileInfo, { file: file, containerWidth: this.props.containerWidth, containerHeight: this.props.containerHeight, i18n: this.props.i18n, toggleAddFilesPanel: this.props.toggleAddFilesPanel, toggleFileCard: this.props.toggleFileCard, metaFields: this.props.metaFields, isSingleFile: this.props.isSingleFile }), jsxRuntime_module_u(Buttons, { file: file, metaFields: this.props.metaFields, showLinkToFileUploadResult: this.props.showLinkToFileUploadResult, showRemoveButton: showRemoveButton, canEditFile: this.props.canEditFile, uploadInProgressOrComplete: uploadInProgressOrComplete, toggleFileCard: this.props.toggleFileCard, openFileEditor: this.props.openFileEditor, uppy: this.props.uppy, i18n: this.props.i18n })] })] }));
    }
}

;// ./node_modules/@uppy/dashboard/lib/components/FileList.js

// @ts-ignore untyped




function chunks(list, size) {
    const chunked = [];
    let currentChunk = [];
    list.forEach((item) => {
        if (currentChunk.length < size) {
            currentChunk.push(item);
        }
        else {
            chunked.push(currentChunk);
            currentChunk = [item];
        }
    });
    if (currentChunk.length)
        chunked.push(currentChunk);
    return chunked;
}
function FileList({ id, i18n, uppy, files, resumableUploads, hideRetryButton, hidePauseResumeButton, hideCancelButton, showLinkToFileUploadResult, showRemoveButtonAfterComplete, metaFields, isSingleFile, toggleFileCard, handleRequestThumbnail, handleCancelThumbnail, recoveredState, individualCancellation, itemsPerRow, openFileEditor, canEditFile, toggleAddFilesPanel, containerWidth, containerHeight, }) {
    // It's not great that this is hardcoded!
    // It's ESPECIALLY not great that this is checking against `itemsPerRow`!
    const rowHeight = itemsPerRow === 1
        ? // Mobile
            71
        : // 190px height + 2 * 5px margin
            200;
    // Sort files by file.isGhost, ghost files first, only if recoveredState is present
    const rows = hooks_module_T(() => {
        const sortByGhostComesFirst = (file1, file2) => Number(files[file2].isGhost) - Number(files[file1].isGhost);
        const fileIds = Object.keys(files);
        if (recoveredState)
            fileIds.sort(sortByGhostComesFirst);
        return chunks(fileIds, itemsPerRow);
    }, [files, itemsPerRow, recoveredState]);
    const renderRow = (row) => (jsxRuntime_module_u("div", { class: "uppy-Dashboard-filesInner", 
        // The `role="presentation` attribute ensures that the list items are properly
        // associated with the `VirtualList` element.
        role: "presentation", children: row.map((fileID) => (jsxRuntime_module_u(FileItem, { uppy: uppy, 
            // FIXME This is confusing, it's actually the Dashboard's plugin ID
            id: id, 
            // TODO move this to context
            i18n: i18n, 
            // features
            resumableUploads: resumableUploads, individualCancellation: individualCancellation, 
            // visual options
            hideRetryButton: hideRetryButton, hidePauseResumeButton: hidePauseResumeButton, hideCancelButton: hideCancelButton, showLinkToFileUploadResult: showLinkToFileUploadResult, showRemoveButtonAfterComplete: showRemoveButtonAfterComplete, metaFields: metaFields, recoveredState: recoveredState, isSingleFile: isSingleFile, containerWidth: containerWidth, containerHeight: containerHeight, 
            // callbacks
            toggleFileCard: toggleFileCard, handleRequestThumbnail: handleRequestThumbnail, handleCancelThumbnail: handleCancelThumbnail, role: "listitem", openFileEditor: openFileEditor, canEditFile: canEditFile, toggleAddFilesPanel: toggleAddFilesPanel, file: files[fileID] }, fileID))) }, row[0]));
    if (isSingleFile) {
        return jsxRuntime_module_u("div", { class: "uppy-Dashboard-files", children: renderRow(rows[0]) });
    }
    return (jsxRuntime_module_u(lib_VirtualList, { class: "uppy-Dashboard-files", role: "list", data: rows, renderRow: renderRow, rowHeight: rowHeight }));
}

;// ./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js





function PickerPanelContent({ activePickerPanel, className, hideAllPanels, i18n, state, uppy, }) {
    const ref = hooks_module_A(null);
    return (jsxRuntime_module_u("div", { className: classnames('uppy-DashboardContent-panel', className), role: "tabpanel", "data-uppy-panelType": "PickerPanel", id: `uppy-DashboardContent-panel--${activePickerPanel.id}`, onDragOver: utils_ignoreEvent, onDragLeave: utils_ignoreEvent, onDrop: utils_ignoreEvent, onPaste: utils_ignoreEvent, children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-bar", children: [jsxRuntime_module_u("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: i18n('importFrom', { name: activePickerPanel.name }) }), jsxRuntime_module_u("button", { className: "uppy-DashboardContent-back", type: "button", onClick: hideAllPanels, children: i18n('cancel') })] }), jsxRuntime_module_u("div", { ref: ref, className: "uppy-DashboardContent-panelBody", children: uppy.getPlugin(activePickerPanel.id).render(state, ref.current) })] }));
}
/* harmony default export */ const components_PickerPanelContent = (PickerPanelContent);

;// ./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js


const uploadStates = {
    STATE_ERROR: 'error',
    STATE_WAITING: 'waiting',
    STATE_PREPROCESSING: 'preprocessing',
    STATE_UPLOADING: 'uploading',
    STATE_POSTPROCESSING: 'postprocessing',
    STATE_COMPLETE: 'complete',
    STATE_PAUSED: 'paused',
};
function PickerPanelTopBar_getUploadingState(isAllErrored, isAllComplete, isAllPaused, files = {}) {
    if (isAllErrored) {
        return uploadStates.STATE_ERROR;
    }
    if (isAllComplete) {
        return uploadStates.STATE_COMPLETE;
    }
    if (isAllPaused) {
        return uploadStates.STATE_PAUSED;
    }
    let state = uploadStates.STATE_WAITING;
    const fileIDs = Object.keys(files);
    for (let i = 0; i < fileIDs.length; i++) {
        const { progress } = files[fileIDs[i]];
        // If ANY files are being uploaded right now, show the uploading state.
        if (progress.uploadStarted && !progress.uploadComplete) {
            return uploadStates.STATE_UPLOADING;
        }
        // If files are being preprocessed AND postprocessed at this time, we show the
        // preprocess state. If any files are being uploaded we show uploading.
        if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
            state = uploadStates.STATE_PREPROCESSING;
        }
        // If NO files are being preprocessed or uploaded right now, but some files are
        // being postprocessed, show the postprocess state.
        if (progress.postprocess &&
            state !== uploadStates.STATE_UPLOADING &&
            state !== uploadStates.STATE_PREPROCESSING) {
            state = uploadStates.STATE_POSTPROCESSING;
        }
    }
    return state;
}
function UploadStatus({ files, i18n, isAllComplete, isAllErrored, isAllPaused, inProgressNotPausedFiles, newFiles, processingFiles, }) {
    const uploadingState = PickerPanelTopBar_getUploadingState(isAllErrored, isAllComplete, isAllPaused, files);
    switch (uploadingState) {
        case 'uploading':
            return i18n('uploadingXFiles', {
                smart_count: inProgressNotPausedFiles.length,
            });
        case 'preprocessing':
        case 'postprocessing':
            return i18n('processingXFiles', { smart_count: processingFiles.length });
        case 'paused':
            return i18n('uploadPaused');
        case 'waiting':
            return i18n('xFilesSelected', { smart_count: newFiles.length });
        case 'complete':
            return i18n('uploadComplete');
        case 'error':
            return i18n('error');
        default:
    }
}
function PanelTopBar(props) {
    const { i18n, isAllComplete, hideCancelButton, maxNumberOfFiles, toggleAddFilesPanel, uppy, } = props;
    let { allowNewUpload } = props;
    // TODO maybe this should be done in ../Dashboard.js, then just pass that down as `allowNewUpload`
    if (allowNewUpload && maxNumberOfFiles) {
        allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
    }
    return (jsxRuntime_module_u("div", { className: "uppy-DashboardContent-bar", children: [!isAllComplete && !hideCancelButton ? (jsxRuntime_module_u("button", { className: "uppy-DashboardContent-back", type: "button", onClick: () => uppy.cancelAll(), children: i18n('cancel') })) : (jsxRuntime_module_u("div", {})), jsxRuntime_module_u("div", { className: "uppy-DashboardContent-title", children: jsxRuntime_module_u(UploadStatus, { ...props }) }), allowNewUpload ? (jsxRuntime_module_u("button", { className: "uppy-DashboardContent-addMore", type: "button", "aria-label": i18n('addMoreFiles'), title: i18n('addMoreFiles'), onClick: () => toggleAddFilesPanel(true), children: [jsxRuntime_module_u("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "15", height: "15", viewBox: "0 0 15 15", children: jsxRuntime_module_u("path", { d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z" }) }), jsxRuntime_module_u("span", { className: "uppy-DashboardContent-addMoreCaption", children: i18n('addMore') })] })) : (jsxRuntime_module_u("div", {}))] }));
}
/* harmony default export */ const PickerPanelTopBar = (PanelTopBar);

;// ./node_modules/@uppy/dashboard/lib/components/Slide.js



const transitionName = 'uppy-transition-slideDownUp';
const duration = 250;
/**
 * Vertical slide transition.
 *
 * This can take a _single_ child component, which _must_ accept a `className` prop.
 *
 * Currently this is specific to the `uppy-transition-slideDownUp` transition,
 * but it should be simple to extend this for any type of single-element
 * transition by setting the CSS name and duration as props.
 */
function Slide({ children }) {
    const [cachedChildren, setCachedChildren] = hooks_module_d(null);
    const [className, setClassName] = hooks_module_d('');
    const enterTimeoutRef = hooks_module_A();
    const leaveTimeoutRef = hooks_module_A();
    const animationFrameRef = hooks_module_A();
    const handleEnterTransition = () => {
        setClassName(`${transitionName}-enter`);
        cancelAnimationFrame(animationFrameRef.current);
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = undefined;
        animationFrameRef.current = requestAnimationFrame(() => {
            setClassName(`${transitionName}-enter ${transitionName}-enter-active`);
            enterTimeoutRef.current = setTimeout(() => {
                setClassName('');
            }, duration);
        });
    };
    const handleLeaveTransition = () => {
        setClassName(`${transitionName}-leave`);
        cancelAnimationFrame(animationFrameRef.current);
        clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = undefined;
        animationFrameRef.current = requestAnimationFrame(() => {
            setClassName(`${transitionName}-leave ${transitionName}-leave-active`);
            leaveTimeoutRef.current = setTimeout(() => {
                setCachedChildren(null);
                setClassName('');
            }, duration);
        });
    };
    hooks_module_h(() => {
        const child = preact_module_F(children)[0];
        if (cachedChildren === child)
            return;
        if (child && !cachedChildren) {
            handleEnterTransition();
        }
        else if (cachedChildren && !child && !leaveTimeoutRef.current) {
            handleLeaveTransition();
        }
        setCachedChildren(child);
    }, [children, cachedChildren]); // Dependency array to trigger effect on children change
    hooks_module_h(() => {
        return () => {
            clearTimeout(enterTimeoutRef.current);
            clearTimeout(leaveTimeoutRef.current);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []); // Cleanup useEffect
    if (!cachedChildren)
        return null;
    return W(cachedChildren, {
        className: classnames(className, cachedChildren.props.className),
    });
}
/* harmony default export */ const components_Slide = (Slide);

;// ./node_modules/@uppy/dashboard/lib/components/Dashboard.js












// http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal
const WIDTH_XL = 900;
const WIDTH_LG = 700;
const WIDTH_MD = 576;
const HEIGHT_MD = 330;
function Dashboard_Dashboard(props) {
    const isNoFiles = props.totalFileCount === 0;
    const isSingleFile = props.totalFileCount === 1;
    const isSizeMD = props.containerWidth > WIDTH_MD;
    const isSizeHeightMD = props.containerHeight > HEIGHT_MD;
    const dashboardClassName = classnames({
        'uppy-Dashboard': true,
        'uppy-Dashboard--isDisabled': props.disabled,
        'uppy-Dashboard--animateOpenClose': props.animateOpenClose,
        'uppy-Dashboard--isClosing': props.isClosing,
        'uppy-Dashboard--isDraggingOver': props.isDraggingOver,
        'uppy-Dashboard--modal': !props.inline,
        'uppy-size--md': props.containerWidth > WIDTH_MD,
        'uppy-size--lg': props.containerWidth > WIDTH_LG,
        'uppy-size--xl': props.containerWidth > WIDTH_XL,
        'uppy-size--height-md': props.containerHeight > HEIGHT_MD,
        // We might want to enable this in the future
        // 'uppy-size--height-lg': props.containerHeight > HEIGHT_LG,
        // 'uppy-size--height-xl': props.containerHeight > HEIGHT_XL,
        'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel,
        'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible,
        // Only enable “centered single file” mode when Dashboard is tall enough
        'uppy-Dashboard--singleFile': props.singleFileFullScreen && isSingleFile && isSizeHeightMD,
    });
    // Important: keep these in sync with the percent width values in `src/components/FileItem/index.scss`.
    let itemsPerRow = 1; // mobile
    if (props.containerWidth > WIDTH_XL) {
        itemsPerRow = 5;
    }
    else if (props.containerWidth > WIDTH_LG) {
        itemsPerRow = 4;
    }
    else if (props.containerWidth > WIDTH_MD) {
        itemsPerRow = 3;
    }
    const showFileList = props.showSelectedFiles && !isNoFiles;
    const numberOfFilesForRecovery = props.recoveredState
        ? Object.keys(props.recoveredState.files).length
        : null;
    const numberOfGhosts = props.files
        ? Object.keys(props.files).filter((fileID) => props.files[fileID].isGhost)
            .length
        : 0;
    const renderRestoredText = () => {
        if (numberOfGhosts > 0) {
            return props.i18n('recoveredXFiles', {
                smart_count: numberOfGhosts,
            });
        }
        return props.i18n('recoveredAllFiles');
    };
    const dashboard = (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: ...
    jsxRuntime_module_u("div", { className: dashboardClassName, "data-uppy-theme": props.theme, "data-uppy-num-acquirers": props.acquirers.length, "data-uppy-drag-drop-supported": !props.disableLocalFiles && isDragDropSupported(), "aria-hidden": props.inline ? 'false' : props.isHidden, "aria-disabled": props.disabled, "aria-label": !props.inline
            ? props.i18n('dashboardWindowTitle')
            : props.i18n('dashboardTitle'), onPaste: props.handlePaste, onDragOver: props.handleDragOver, onDragLeave: props.handleDragLeave, onDrop: props.handleDrop, children: [jsxRuntime_module_u("div", { "aria-hidden": "true", className: "uppy-Dashboard-overlay", tabIndex: -1, onClick: props.handleClickOutside }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-inner", role: props.inline ? undefined : 'dialog', style: {
                    width: props.inline && props.width ? props.width : '',
                    height: props.inline && props.height ? props.height : '',
                }, children: [!props.inline ? (jsxRuntime_module_u("button", { className: "uppy-u-reset uppy-Dashboard-close", type: "button", "aria-label": props.i18n('closeModal'), title: props.i18n('closeModal'), onClick: props.closeModal, children: jsxRuntime_module_u("span", { "aria-hidden": "true", children: "\u00D7" }) })) : null, jsxRuntime_module_u("div", { className: "uppy-Dashboard-innerWrap", children: [jsxRuntime_module_u("div", { className: "uppy-Dashboard-dropFilesHereHint", children: props.i18n('dropHint') }), showFileList && jsxRuntime_module_u(PickerPanelTopBar, { ...props }), numberOfFilesForRecovery && (jsxRuntime_module_u("div", { className: "uppy-Dashboard-serviceMsg", children: [jsxRuntime_module_u("svg", { className: "uppy-Dashboard-serviceMsg-icon", "aria-hidden": "true", focusable: "false", width: "21", height: "16", viewBox: "0 0 24 19", children: jsxRuntime_module_u("g", { transform: "translate(0 -1)", fill: "none", fillRule: "evenodd", children: [jsxRuntime_module_u("path", { d: "M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z", fill: "#FFD300" }), jsxRuntime_module_u("path", { fill: "#000", d: "M11 6h2l-.3 8h-1.4z" }), jsxRuntime_module_u("circle", { fill: "#000", cx: "12", cy: "17", r: "1" })] }) }), jsxRuntime_module_u("strong", { className: "uppy-Dashboard-serviceMsg-title", children: props.i18n('sessionRestored') }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-serviceMsg-text", children: renderRestoredText() })] })), showFileList ? (jsxRuntime_module_u(FileList, { id: props.id, i18n: props.i18n, uppy: props.uppy, files: props.files, resumableUploads: props.resumableUploads, hideRetryButton: props.hideRetryButton, hidePauseResumeButton: props.hidePauseResumeButton, hideCancelButton: props.hideCancelButton, showLinkToFileUploadResult: props.showLinkToFileUploadResult, showRemoveButtonAfterComplete: props.showRemoveButtonAfterComplete, metaFields: props.metaFields, toggleFileCard: props.toggleFileCard, handleRequestThumbnail: props.handleRequestThumbnail, handleCancelThumbnail: props.handleCancelThumbnail, recoveredState: props.recoveredState, individualCancellation: props.individualCancellation, openFileEditor: props.openFileEditor, canEditFile: props.canEditFile, toggleAddFilesPanel: props.toggleAddFilesPanel, isSingleFile: isSingleFile, itemsPerRow: itemsPerRow, containerWidth: props.containerWidth, containerHeight: props.containerHeight })) : (jsxRuntime_module_u(components_AddFiles, { i18n: props.i18n, i18nArray: props.i18nArray, acquirers: props.acquirers, handleInputChange: props.handleInputChange, maxNumberOfFiles: props.maxNumberOfFiles, allowedFileTypes: props.allowedFileTypes, showNativePhotoCameraButton: props.showNativePhotoCameraButton, showNativeVideoCameraButton: props.showNativeVideoCameraButton, nativeCameraFacingMode: props.nativeCameraFacingMode, showPanel: props.showPanel, activePickerPanel: props.activePickerPanel, disableLocalFiles: props.disableLocalFiles, fileManagerSelectionType: props.fileManagerSelectionType, note: props.note, proudlyDisplayPoweredByUppy: props.proudlyDisplayPoweredByUppy })), jsxRuntime_module_u(components_Slide, { children: props.showAddFilesPanel ? (jsxRuntime_module_u(components_AddFilesPanel, { ...props, isSizeMD: isSizeMD }, "AddFiles")) : null }), jsxRuntime_module_u(components_Slide, { children: props.fileCardFor ? jsxRuntime_module_u(FileCard, { ...props }, "FileCard") : null }), jsxRuntime_module_u(components_Slide, { children: props.activePickerPanel ? (jsxRuntime_module_u(components_PickerPanelContent, { ...props }, "Picker")) : null }), jsxRuntime_module_u(components_Slide, { children: props.showFileEditor ? (jsxRuntime_module_u(components_EditorPanel, { ...props }, "Editor")) : null }), jsxRuntime_module_u("div", { className: "uppy-Dashboard-progressindicators", children: props.progressindicators.map((target) => {
                                    // TODO
                                    // Here we're telling typescript all `this.type = 'progressindicator'` plugins inherit from `UIPlugin`
                                    // This is factually true in Uppy right now, but maybe it doesn't have to be
                                    return props.uppy.getPlugin(target.id).render(props.state);
                                }) })] })] })] }));
    return dashboard;
}

;// ./node_modules/@uppy/dashboard/lib/locale.js
/* harmony default export */ const dashboard_lib_locale = ({
    strings: {
        // When `inline: false`, used as the screen reader label for the button that closes the modal.
        closeModal: 'Close Modal',
        // Used as the screen reader label for the plus (+) button that shows the “Add more files” screen
        addMoreFiles: 'Add more files',
        addingMoreFiles: 'Adding more files',
        // Used as the header for import panels, e.g., “Import from Google Drive”.
        importFrom: 'Import from %{name}',
        // When `inline: false`, used as the screen reader label for the dashboard modal.
        dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
        // When `inline: true`, used as the screen reader label for the dashboard area.
        dashboardTitle: 'Uppy Dashboard',
        // Shown in the Informer when a link to a file was copied to the clipboard.
        copyLinkToClipboardSuccess: 'Link copied to clipboard.',
        // Used when a link cannot be copied automatically — the user has to select the text from the
        // input element below this string.
        copyLinkToClipboardFallback: 'Copy the URL below',
        // Used as the hover title and screen reader label for buttons that copy a file link.
        copyLink: 'Copy link',
        back: 'Back',
        // Used as the screen reader label for buttons that remove a file.
        removeFile: 'Remove file',
        // Used as the screen reader label for buttons that open the metadata editor panel for a file.
        editFile: 'Edit file',
        editImage: 'Edit image',
        // Shown in the panel header for the metadata editor. Rendered as “Editing image.png”.
        editing: 'Editing %{file}',
        // Shown on the main upload screen when an upload error occurs
        error: 'Error',
        // Used as the screen reader label for the button that saves metadata edits and returns to the
        // file list view.
        finishEditingFile: 'Finish editing file',
        saveChanges: 'Save changes',
        // Used as the label for the tab button that opens the system file selection dialog.
        myDevice: 'My Device',
        dropHint: 'Drop your files here',
        // Used as the hover text and screen reader label for file progress indicators when
        // they have been fully uploaded.
        uploadComplete: 'Upload complete',
        uploadPaused: 'Upload paused',
        // Used as the hover text and screen reader label for the buttons to resume paused uploads.
        resumeUpload: 'Resume upload',
        // Used as the hover text and screen reader label for the buttons to pause uploads.
        pauseUpload: 'Pause upload',
        // Used as the hover text and screen reader label for the buttons to retry failed uploads.
        retryUpload: 'Retry upload',
        // Used as the hover text and screen reader label for the buttons to cancel uploads.
        cancelUpload: 'Cancel upload',
        // Used in a title, how many files are currently selected
        xFilesSelected: {
            0: '%{smart_count} file selected',
            1: '%{smart_count} files selected',
        },
        uploadingXFiles: {
            0: 'Uploading %{smart_count} file',
            1: 'Uploading %{smart_count} files',
        },
        processingXFiles: {
            0: 'Processing %{smart_count} file',
            1: 'Processing %{smart_count} files',
        },
        // The "powered by Uppy" link at the bottom of the Dashboard.
        poweredBy: 'Powered by %{uppy}',
        addMore: 'Add more',
        editFileWithFilename: 'Edit file %{file}',
        save: 'Save',
        cancel: 'Cancel',
        dropPasteFiles: 'Drop files here or %{browseFiles}',
        dropPasteFolders: 'Drop files here or %{browseFolders}',
        dropPasteBoth: 'Drop files here, %{browseFiles} or %{browseFolders}',
        dropPasteImportFiles: 'Drop files here, %{browseFiles} or import from:',
        dropPasteImportFolders: 'Drop files here, %{browseFolders} or import from:',
        dropPasteImportBoth: 'Drop files here, %{browseFiles}, %{browseFolders} or import from:',
        importFiles: 'Import files from:',
        browseFiles: 'browse files',
        browseFolders: 'browse folders',
        recoveredXFiles: {
            0: 'We could not fully recover 1 file. Please re-select it and resume the upload.',
            1: 'We could not fully recover %{smart_count} files. Please re-select them and resume the upload.',
        },
        recoveredAllFiles: 'We restored all files. You can now resume the upload.',
        sessionRestored: 'Session restored',
        reSelect: 'Re-select',
        missingRequiredMetaFields: {
            0: 'Missing required meta field: %{fields}.',
            1: 'Missing required meta fields: %{fields}.',
        },
        // Used for native device camera buttons on mobile
        takePictureBtn: 'Take Picture',
        recordVideoBtn: 'Record Video',
    },
});

;// ./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js
/* harmony default export */ const FOCUSABLE_ELEMENTS = ([
    'a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'input:not([disabled]):not([inert]):not([aria-hidden])',
    'select:not([disabled]):not([inert]):not([aria-hidden])',
    'textarea:not([disabled]):not([inert]):not([aria-hidden])',
    'button:not([disabled]):not([inert]):not([aria-hidden])',
    'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
]);

// EXTERNAL MODULE: ./node_modules/lodash/debounce.js
var lodash_debounce = __webpack_require__(221);
;// ./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js
/**
 * @returns {HTMLElement} - either dashboard element, or the overlay that's most on top
 */
function getActiveOverlayEl(dashboardEl, activeOverlayType) {
    if (activeOverlayType) {
        const overlayEl = dashboardEl.querySelector(`[data-uppy-paneltype="${activeOverlayType}"]`);
        // if an overlay is already mounted
        if (overlayEl)
            return overlayEl;
    }
    return dashboardEl;
}

;// ./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js
// @ts-ignore untyped



/*
  Focuses on some element in the currently topmost overlay.

  1. If there are some [data-uppy-super-focusable] elements rendered already - focuses
     on the first superfocusable element, and leaves focus up to the control of
     a user (until currently focused element disappears from the screen [which
     can happen when overlay changes, or, e.g., when we click on a folder in googledrive]).
  2. If there are no [data-uppy-super-focusable] elements yet (or ever) - focuses
     on the first focusable element, but switches focus if superfocusable elements appear on next render.
*/
function createSuperFocus() {
    let lastFocusWasOnSuperFocusableEl = false;
    const superFocus = (dashboardEl, activeOverlayType) => {
        const overlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
        const isFocusInOverlay = overlayEl.contains(document.activeElement);
        // If focus is already in the topmost overlay, AND on last update we focused on the superfocusable
        // element - then leave focus up to the user.
        // [Practical check] without this line, typing in the search input in googledrive overlay won't work.
        if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl)
            return;
        const superFocusableEl = overlayEl.querySelector('[data-uppy-super-focusable]');
        // If we are already in the topmost overlay, AND there are no super focusable elements yet, - leave focus up to the user.
        // [Practical check] without this line, if you are in an empty folder in google drive, and something's uploading in the
        // bg, - focus will be jumping to Done all the time.
        if (isFocusInOverlay && !superFocusableEl)
            return;
        if (superFocusableEl) {
            superFocusableEl.focus({ preventScroll: true });
            lastFocusWasOnSuperFocusableEl = true;
        }
        else {
            const firstEl = overlayEl.querySelector(FOCUSABLE_ELEMENTS);
            firstEl?.focus({ preventScroll: true });
            lastFocusWasOnSuperFocusableEl = false;
        }
    };
    // ___Why do we need to debounce?
    //    1. To deal with animations: overlay changes via animations, which results in the DOM updating AFTER plugin.update()
    //       already executed.
    //    [Practical check] without debounce, if we open the Url overlay, and click 'Done', Dashboard won't get focused again.
    //    [Practical check] if we delay 250ms instead of 260ms - IE11 won't get focused in same situation.
    //    2. Performance: there can be many state update()s in a second, and this function is called every time.
    return lodash_debounce(superFocus, 260);
}

;// ./node_modules/@uppy/dashboard/lib/utils/trapFocus.js
// @ts-ignore untyped



function focusOnFirstNode(event, nodes) {
    const node = nodes[0];
    if (node) {
        node.focus();
        event.preventDefault();
    }
}
function focusOnLastNode(event, nodes) {
    const node = nodes[nodes.length - 1];
    if (node) {
        node.focus();
        event.preventDefault();
    }
}
// ___Why not just use (focusedItemIndex === -1)?
//    Firefox thinks <ul> is focusable, but we don't have <ul>s in our FOCUSABLE_ELEMENTS. Which means that if we tab into
//    the <ul>, code will think that we are not in the active overlay, and we should focusOnFirstNode() of the currently
//    active overlay!
//    [Practical check] if we use (focusedItemIndex === -1), instagram provider in firefox will never get focus on its pics
//    in the <ul>.
function isFocusInOverlay(activeOverlayEl) {
    return activeOverlayEl.contains(document.activeElement);
}
function trapFocus(event, activeOverlayType, dashboardEl) {
    const activeOverlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
    const focusableNodes = toArray(activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS));
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement);
    // If we pressed tab, and focus is not yet within the current overlay - focus on
    // the first element within the current overlay.
    // This is a safety measure (for when user returns from another tab e.g.), most
    // plugins will try to focus on some important element as it loads.
    if (!isFocusInOverlay(activeOverlayEl)) {
        focusOnFirstNode(event, focusableNodes);
        // If we pressed shift + tab, and we're on the first element of a modal
    }
    else if (event.shiftKey && focusedItemIndex === 0) {
        focusOnLastNode(event, focusableNodes);
        // If we pressed tab, and we're on the last element of the modal
    }
    else if (!event.shiftKey &&
        focusedItemIndex === focusableNodes.length - 1) {
        focusOnFirstNode(event, focusableNodes);
    }
}
// Traps focus inside of the currently open overlay (e.g. Dashboard, or e.g. Instagram),
// never lets focus disappear from the modal.

// Traps focus inside of the currently open overlay, unless overlay is null - then let the user tab away.
function forInline(event, activeOverlayType, dashboardEl) {
    // ___When we're in the bare 'Drop files here, paste, browse or import from' screen
    if (activeOverlayType === null) {
        // Do nothing and let the browser handle it, user can tab away from Uppy to other elements on the page
        // ___When there is some overlay with 'Done' button
    }
    else {
        // Trap the focus inside this overlay!
        // User can close the overlay (click 'Done') if they want to travel away from Uppy.
        trapFocus(event, activeOverlayType, dashboardEl);
    }
}

;// ./node_modules/@uppy/dashboard/lib/Dashboard.js















const TAB_KEY = 9;
const ESC_KEY = 27;
function createPromise() {
    const o = {};
    o.promise = new Promise((resolve, reject) => {
        o.resolve = resolve;
        o.reject = reject;
    });
    return o;
}
const Dashboard_defaultOptions = {
    target: 'body',
    metaFields: [],
    thumbnailWidth: 280,
    thumbnailType: 'image/jpeg',
    waitForThumbnailsBeforeUpload: false,
    defaultPickerIcon: defaultPickerIcon,
    showLinkToFileUploadResult: false,
    showProgressDetails: false,
    hideUploadButton: false,
    hideCancelButton: false,
    hideRetryButton: false,
    hidePauseResumeButton: false,
    hideProgressAfterFinish: false,
    note: null,
    singleFileFullScreen: true,
    disableStatusBar: false,
    disableInformer: false,
    disableThumbnailGenerator: false,
    fileManagerSelectionType: 'files',
    proudlyDisplayPoweredByUppy: true,
    showSelectedFiles: true,
    showRemoveButtonAfterComplete: false,
    showNativePhotoCameraButton: false,
    showNativeVideoCameraButton: false,
    theme: 'light',
    autoOpen: null,
    disabled: false,
    disableLocalFiles: false,
    nativeCameraFacingMode: '',
    onDragLeave: () => { },
    onDragOver: () => { },
    onDrop: () => { },
    plugins: [],
    // Dynamic default options, they have to be defined in the constructor (because
    // they require access to the `this` keyword), but we still want them to
    // appear in the default options so TS knows they'll be defined.
    doneButtonHandler: undefined,
    onRequestCloseModal: null,
    // defaultModalOptions
    inline: false,
    animateOpenClose: true,
    browserBackButtonClose: false,
    closeAfterFinish: false,
    closeModalOnClickOutside: false,
    disablePageScrollWhenModalOpen: true,
    trigger: null,
    // defaultInlineOptions
    width: 750,
    height: 550,
};
/**
 * Dashboard UI with previews, metadata editing, tabs for various services and more
 */
class Dashboard extends lib_UIPlugin {
    static VERSION = dashboard_package_namespaceObject.rE;
    #disabledNodes;
    modalName = `uppy-Dashboard-${nanoid()}`;
    superFocus = createSuperFocus();
    ifFocusedOnUppyRecently = false;
    dashboardIsDisabled;
    savedScrollPosition;
    savedActiveElement;
    resizeObserver;
    darkModeMediaQuery;
    // Timeouts
    makeDashboardInsidesVisibleAnywayTimeout;
    constructor(uppy, opts) {
        const autoOpen = opts?.autoOpen ?? null;
        super(uppy, { ...Dashboard_defaultOptions, ...opts, autoOpen });
        this.id = this.opts.id || 'Dashboard';
        this.title = 'Dashboard';
        this.type = 'orchestrator';
        this.defaultLocale = dashboard_lib_locale;
        // Dynamic default options:
        if (this.opts.doneButtonHandler === undefined) {
            // `null` means "do not display a Done button", while `undefined` means
            // "I want the default behavior". For this reason, we need to differentiate `null` and `undefined`.
            this.opts.doneButtonHandler = () => {
                this.uppy.clear();
                this.requestCloseModal();
            };
        }
        this.opts.onRequestCloseModal ??= () => this.closeModal();
        this.i18nInit();
    }
    removeTarget = (plugin) => {
        const pluginState = this.getPluginState();
        // filter out the one we want to remove
        const newTargets = pluginState.targets.filter((target) => target.id !== plugin.id);
        this.setPluginState({
            targets: newTargets,
        });
    };
    addTarget = (plugin) => {
        const callerPluginId = plugin.id || plugin.constructor.name;
        const callerPluginName = plugin.title || callerPluginId;
        const callerPluginType = plugin.type;
        if (callerPluginType !== 'acquirer' &&
            callerPluginType !== 'progressindicator' &&
            callerPluginType !== 'editor') {
            const msg = 'Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor';
            this.uppy.log(msg, 'error');
            return null;
        }
        const target = {
            id: callerPluginId,
            name: callerPluginName,
            type: callerPluginType,
        };
        const state = this.getPluginState();
        const newTargets = state.targets.slice();
        newTargets.push(target);
        this.setPluginState({
            targets: newTargets,
        });
        return this.el;
    };
    hideAllPanels = () => {
        const state = this.getPluginState();
        const update = {
            activePickerPanel: undefined,
            showAddFilesPanel: false,
            activeOverlayType: null,
            fileCardFor: null,
            showFileEditor: false,
        };
        if (state.activePickerPanel === update.activePickerPanel &&
            state.showAddFilesPanel === update.showAddFilesPanel &&
            state.showFileEditor === update.showFileEditor &&
            state.activeOverlayType === update.activeOverlayType) {
            // avoid doing a state update if nothing changed
            return;
        }
        this.setPluginState(update);
        this.uppy.emit('dashboard:close-panel', state.activePickerPanel?.id);
    };
    showPanel = (id) => {
        const { targets } = this.getPluginState();
        const activePickerPanel = targets.find((target) => {
            return target.type === 'acquirer' && target.id === id;
        });
        this.setPluginState({
            activePickerPanel,
            activeOverlayType: 'PickerPanel',
        });
        this.uppy.emit('dashboard:show-panel', id);
    };
    canEditFile = (file) => {
        const { targets } = this.getPluginState();
        const editors = this.#getEditors(targets);
        return editors.some((target) => this.uppy.getPlugin(target.id).canEditFile(file));
    };
    openFileEditor = (file) => {
        const { targets } = this.getPluginState();
        const editors = this.#getEditors(targets);
        this.setPluginState({
            showFileEditor: true,
            fileCardFor: file.id || null,
            activeOverlayType: 'FileEditor',
        });
        editors.forEach((editor) => {
            ;
            this.uppy.getPlugin(editor.id).selectFile(file);
        });
    };
    closeFileEditor = () => {
        const { metaFields } = this.getPluginState();
        const isMetaEditorEnabled = metaFields && metaFields.length > 0;
        if (isMetaEditorEnabled) {
            this.setPluginState({
                showFileEditor: false,
                activeOverlayType: 'FileCard',
            });
        }
        else {
            this.setPluginState({
                showFileEditor: false,
                fileCardFor: null,
                activeOverlayType: 'AddFiles',
            });
        }
    };
    saveFileEditor = () => {
        const { targets } = this.getPluginState();
        const editors = this.#getEditors(targets);
        editors.forEach((editor) => {
            ;
            this.uppy.getPlugin(editor.id).save();
        });
        this.closeFileEditor();
    };
    openModal = () => {
        const { promise, resolve } = createPromise();
        // save scroll position
        this.savedScrollPosition = window.pageYOffset;
        // save active element, so we can restore focus when modal is closed
        this.savedActiveElement = document.activeElement;
        if (this.opts.disablePageScrollWhenModalOpen) {
            document.body.classList.add('uppy-Dashboard-isFixed');
        }
        if (this.opts.animateOpenClose && this.getPluginState().isClosing) {
            const handler = () => {
                this.setPluginState({
                    isHidden: false,
                });
                this.el.removeEventListener('animationend', handler, false);
                resolve();
            };
            this.el.addEventListener('animationend', handler, false);
        }
        else {
            this.setPluginState({
                isHidden: false,
            });
            resolve();
        }
        if (this.opts.browserBackButtonClose) {
            this.updateBrowserHistory();
        }
        // handle ESC and TAB keys in modal dialog
        document.addEventListener('keydown', this.handleKeyDownInModal);
        this.uppy.emit('dashboard:modal-open');
        return promise;
    };
    closeModal = (opts) => {
        // Whether the modal is being closed by the user (`true`) or by other means (e.g. browser back button)
        const manualClose = opts?.manualClose ?? true;
        const { isHidden, isClosing } = this.getPluginState();
        if (isHidden || isClosing) {
            // short-circuit if animation is ongoing
            return undefined;
        }
        const { promise, resolve } = createPromise();
        if (this.opts.disablePageScrollWhenModalOpen) {
            document.body.classList.remove('uppy-Dashboard-isFixed');
        }
        if (this.opts.animateOpenClose) {
            this.setPluginState({
                isClosing: true,
            });
            const handler = () => {
                this.setPluginState({
                    isHidden: true,
                    isClosing: false,
                });
                this.superFocus.cancel();
                this.savedActiveElement.focus();
                this.el.removeEventListener('animationend', handler, false);
                resolve();
            };
            this.el.addEventListener('animationend', handler, false);
        }
        else {
            this.setPluginState({
                isHidden: true,
            });
            this.superFocus.cancel();
            this.savedActiveElement.focus();
            resolve();
        }
        // handle ESC and TAB keys in modal dialog
        document.removeEventListener('keydown', this.handleKeyDownInModal);
        if (manualClose) {
            if (this.opts.browserBackButtonClose) {
                // Make sure that the latest entry in the history state is our modal name
                if (history.state?.[this.modalName]) {
                    // Go back in history to clear out the entry we created (ultimately closing the modal)
                    history.back();
                }
            }
        }
        this.uppy.emit('dashboard:modal-closed');
        return promise;
    };
    isModalOpen = () => {
        return !this.getPluginState().isHidden || false;
    };
    requestCloseModal = () => {
        if (this.opts.onRequestCloseModal) {
            return this.opts.onRequestCloseModal();
        }
        return this.closeModal();
    };
    setDarkModeCapability = (isDarkModeOn) => {
        const { capabilities } = this.uppy.getState();
        this.uppy.setState({
            capabilities: {
                ...capabilities,
                darkMode: isDarkModeOn,
            },
        });
    };
    handleSystemDarkModeChange = (event) => {
        const isDarkModeOnNow = event.matches;
        this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnNow ? 'on' : 'off'}`);
        this.setDarkModeCapability(isDarkModeOnNow);
    };
    toggleFileCard = (show, fileID) => {
        const file = this.uppy.getFile(fileID);
        if (show) {
            this.uppy.emit('dashboard:file-edit-start', file);
        }
        else {
            this.uppy.emit('dashboard:file-edit-complete', file);
        }
        this.setPluginState({
            fileCardFor: show ? fileID : null,
            activeOverlayType: show ? 'FileCard' : null,
        });
    };
    toggleAddFilesPanel = (show) => {
        this.setPluginState({
            showAddFilesPanel: show,
            activeOverlayType: show ? 'AddFiles' : null,
        });
    };
    addFiles = (files) => {
        const descriptors = files.map((file) => ({
            source: this.id,
            name: file.name,
            type: file.type,
            data: file,
            meta: {
                // path of the file relative to the ancestor directory the user selected.
                // e.g. 'docs/Old Prague/airbnb.pdf'
                relativePath: file.relativePath || file.webkitRelativePath || null,
            },
        }));
        try {
            this.uppy.addFiles(descriptors);
        }
        catch (err) {
            this.uppy.log(err);
        }
    };
    // ___Why make insides of Dashboard invisible until first ResizeObserver event is emitted?
    //    ResizeOberserver doesn't emit the first resize event fast enough, users can see the jump from one .uppy-size-- to
    //    another (e.g. in Safari)
    // ___Why not apply visibility property to .uppy-Dashboard-inner?
    //    Because ideally, acc to specs, ResizeObserver should see invisible elements as of width 0. So even though applying
    //    invisibility to .uppy-Dashboard-inner works now, it may not work in the future.
    startListeningToResize = () => {
        // Watch for Dashboard container (`.uppy-Dashboard-inner`) resize
        // and update containerWidth/containerHeight in plugin state accordingly.
        // Emits first event on initialization.
        this.resizeObserver = new ResizeObserver((entries) => {
            const uppyDashboardInnerEl = entries[0];
            const { width, height } = uppyDashboardInnerEl.contentRect;
            this.setPluginState({
                containerWidth: width,
                containerHeight: height,
                areInsidesReadyToBeVisible: true,
            });
        });
        this.resizeObserver.observe(this.el.querySelector('.uppy-Dashboard-inner'));
        // If ResizeObserver fails to emit an event telling us what size to use - default to the mobile view
        this.makeDashboardInsidesVisibleAnywayTimeout = setTimeout(() => {
            const pluginState = this.getPluginState();
            const isModalAndClosed = !this.opts.inline && pluginState.isHidden;
            if (
            // We might want to enable this in the future
            // if ResizeObserver hasn't yet fired,
            !pluginState.areInsidesReadyToBeVisible &&
                // and it's not due to the modal being closed
                !isModalAndClosed) {
                this.uppy.log('[Dashboard] resize event didn’t fire on time: defaulted to mobile layout', 'warning');
                this.setPluginState({
                    areInsidesReadyToBeVisible: true,
                });
            }
        }, 1000);
    };
    stopListeningToResize = () => {
        this.resizeObserver.disconnect();
        clearTimeout(this.makeDashboardInsidesVisibleAnywayTimeout);
    };
    // Records whether we have been interacting with uppy right now,
    // which is then used to determine whether state updates should trigger a refocusing.
    recordIfFocusedOnUppyRecently = (event) => {
        if (this.el.contains(event.target)) {
            this.ifFocusedOnUppyRecently = true;
        }
        else {
            this.ifFocusedOnUppyRecently = false;
            // ___Why run this.superFocus.cancel here when it already runs in superFocusOnEachUpdate?
            //    Because superFocus is debounced, when we move from Uppy to some other element on the page,
            //    previously run superFocus sometimes hits and moves focus back to Uppy.
            this.superFocus.cancel();
        }
    };
    disableInteractiveElements = (disable) => {
        const NODES_TO_DISABLE = [
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            '[role="button"]:not([disabled])',
        ];
        const nodesToDisable = this.#disabledNodes ??
            toArray(this.el.querySelectorAll(NODES_TO_DISABLE)).filter((node) => !node.classList.contains('uppy-Dashboard-close'));
        for (const node of nodesToDisable) {
            // Links can’t have `disabled` attr, so we use `aria-disabled` for a11y
            if (node.tagName === 'A') {
                node.setAttribute('aria-disabled', disable);
            }
            else {
                node.disabled = disable;
            }
        }
        if (disable) {
            this.#disabledNodes = nodesToDisable;
        }
        else {
            this.#disabledNodes = null;
        }
        this.dashboardIsDisabled = disable;
    };
    updateBrowserHistory = () => {
        // Ensure history state does not already contain our modal name to avoid double-pushing
        if (!history.state?.[this.modalName]) {
            // Push to history so that the page is not lost on browser back button press
            history.pushState({
                ...history.state,
                [this.modalName]: true,
            }, '');
        }
        // Listen for back button presses
        window.addEventListener('popstate', this.handlePopState, false);
    };
    handlePopState = (event) => {
        // Close the modal if the history state no longer contains our modal name
        if (this.isModalOpen() && (!event.state || !event.state[this.modalName])) {
            this.closeModal({ manualClose: false });
        }
        // When the browser back button is pressed and uppy is now the latest entry
        // in the history but the modal is closed, fix the history by removing the
        // uppy history entry.
        // This occurs when another entry is added into the history state while the
        // modal is open, and then the modal gets manually closed.
        // Solves PR #575 (https://github.com/transloadit/uppy/pull/575)
        if (!this.isModalOpen() && event.state?.[this.modalName]) {
            history.back();
        }
    };
    handleKeyDownInModal = (event) => {
        // close modal on esc key press
        if (event.keyCode === ESC_KEY)
            this.requestCloseModal();
        // trap focus on tab key press
        if (event.keyCode === TAB_KEY)
            trapFocus(event, this.getPluginState().activeOverlayType, this.el);
    };
    handleClickOutside = () => {
        if (this.opts.closeModalOnClickOutside)
            this.requestCloseModal();
    };
    handlePaste = (event) => {
        // Let any acquirer plugin (Url/Webcam/etc.) handle pastes to the root
        this.uppy.iteratePlugins((plugin) => {
            if (plugin.type === 'acquirer') {
                // Every Plugin with .type acquirer can define handleRootPaste(event)
                ;
                plugin.handleRootPaste?.(event);
            }
        });
        // Add all dropped files
        const files = toArray(event.clipboardData.files);
        if (files.length > 0) {
            this.uppy.log('[Dashboard] Files pasted');
            this.addFiles(files);
        }
    };
    handleInputChange = (event) => {
        event.preventDefault();
        const files = toArray(event.currentTarget.files || []);
        if (files.length > 0) {
            this.uppy.log('[Dashboard] Files selected through input');
            this.addFiles(files);
        }
    };
    handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // Check if some plugin can handle the datatransfer without files —
        // for instance, the Url plugin can import a url
        const canSomePluginHandleRootDrop = () => {
            let somePluginCanHandleRootDrop = true;
            this.uppy.iteratePlugins((plugin) => {
                if (plugin.canHandleRootDrop?.(event)) {
                    somePluginCanHandleRootDrop = true;
                }
            });
            return somePluginCanHandleRootDrop;
        };
        // Check if the "type" of the datatransfer object includes files
        const doesEventHaveFiles = () => {
            const { types } = event.dataTransfer;
            return types.some((type) => type === 'Files');
        };
        // Deny drop, if no plugins can handle datatransfer, there are no files,
        // or when opts.disabled is set, or new uploads are not allowed
        const somePluginCanHandleRootDrop = canSomePluginHandleRootDrop();
        const hasFiles = doesEventHaveFiles();
        if ((!somePluginCanHandleRootDrop && !hasFiles) ||
            this.opts.disabled ||
            // opts.disableLocalFiles should only be taken into account if no plugins
            // can handle the datatransfer
            (this.opts.disableLocalFiles &&
                (hasFiles || !somePluginCanHandleRootDrop)) ||
            !this.uppy.getState().allowNewUpload) {
            event.dataTransfer.dropEffect = 'none';
            return;
        }
        // Add a small (+) icon on drop
        // (and prevent browsers from interpreting this as files being _moved_ into the
        // browser, https://github.com/transloadit/uppy/issues/1978).
        event.dataTransfer.dropEffect = 'copy';
        this.setPluginState({ isDraggingOver: true });
        this.opts.onDragOver(event);
    };
    handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setPluginState({ isDraggingOver: false });
        this.opts.onDragLeave(event);
    };
    handleDrop = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setPluginState({ isDraggingOver: false });
        // Let any acquirer plugin (Url/Webcam/etc.) handle drops to the root
        this.uppy.iteratePlugins((plugin) => {
            if (plugin.type === 'acquirer') {
                // Every Plugin with .type acquirer can define handleRootDrop(event)
                ;
                plugin.handleRootDrop?.(event);
            }
        });
        // Add all dropped files
        let executedDropErrorOnce = false;
        const logDropError = (error) => {
            this.uppy.log(error, 'error');
            // In practice all drop errors are most likely the same,
            // so let's just show one to avoid overwhelming the user
            if (!executedDropErrorOnce) {
                this.uppy.info(error.message, 'error');
                executedDropErrorOnce = true;
            }
        };
        this.uppy.log('[Dashboard] Processing dropped files');
        // Add all dropped files
        const files = await getDroppedFiles(event.dataTransfer, { logDropError });
        if (files.length > 0) {
            this.uppy.log('[Dashboard] Files dropped');
            this.addFiles(files);
        }
        this.opts.onDrop(event);
    };
    handleRequestThumbnail = (file) => {
        if (!this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.emit('thumbnail:request', file);
        }
    };
    /**
     * We cancel thumbnail requests when a file item component unmounts to avoid
     * clogging up the queue when the user scrolls past many elements.
     */
    handleCancelThumbnail = (file) => {
        if (!this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.emit('thumbnail:cancel', file);
        }
    };
    handleKeyDownInInline = (event) => {
        // Trap focus on tab key press.
        if (event.keyCode === TAB_KEY)
            forInline(event, this.getPluginState().activeOverlayType, this.el);
    };
    // ___Why do we listen to the 'paste' event on a document instead of onPaste={props.handlePaste} prop,
    //    or this.el.addEventListener('paste')?
    //    Because (at least) Chrome doesn't handle paste if focus is on some button, e.g. 'My Device'.
    //    => Therefore, the best option is to listen to all 'paste' events, and only react to them when we are focused on our
    //       particular Uppy instance.
    // ___Why do we still need onPaste={props.handlePaste} for the DashboardUi?
    //    Because if we click on the 'Drop files here' caption e.g., `document.activeElement` will be 'body'. Which means our
    //    standard determination of whether we're pasting into our Uppy instance won't work.
    //    => Therefore, we need a traditional onPaste={props.handlePaste} handler too.
    handlePasteOnBody = (event) => {
        const isFocusInOverlay = this.el.contains(document.activeElement);
        if (isFocusInOverlay) {
            this.handlePaste(event);
        }
    };
    handleComplete = ({ failed }) => {
        if (this.opts.closeAfterFinish && !failed?.length) {
            // All uploads are done
            this.requestCloseModal();
        }
    };
    handleCancelRestore = () => {
        this.uppy.emit('restore-canceled');
    };
    #generateLargeThumbnailIfSingleFile = () => {
        if (this.opts.disableThumbnailGenerator) {
            return;
        }
        const LARGE_THUMBNAIL = 600;
        const files = this.uppy.getFiles();
        if (files.length === 1) {
            const thumbnailGenerator = this.uppy.getPlugin(`${this.id}:ThumbnailGenerator`);
            thumbnailGenerator?.setOptions({ thumbnailWidth: LARGE_THUMBNAIL });
            const fileForThumbnail = { ...files[0], preview: undefined };
            thumbnailGenerator?.requestThumbnail(fileForThumbnail).then(() => {
                thumbnailGenerator?.setOptions({
                    thumbnailWidth: this.opts.thumbnailWidth,
                });
            });
        }
    };
    #openFileEditorWhenFilesAdded = (files) => {
        const firstFile = files[0];
        const { metaFields } = this.getPluginState();
        const isMetaEditorEnabled = metaFields && metaFields.length > 0;
        const isImageEditorEnabled = this.canEditFile(firstFile);
        if (isMetaEditorEnabled && this.opts.autoOpen === 'metaEditor') {
            this.toggleFileCard(true, firstFile.id);
        }
        else if (isImageEditorEnabled && this.opts.autoOpen === 'imageEditor') {
            this.openFileEditor(firstFile);
        }
    };
    initEvents = () => {
        // Modal open button
        if (this.opts.trigger && !this.opts.inline) {
            const showModalTrigger = lib_findAllDOMElements(this.opts.trigger);
            if (showModalTrigger) {
                showModalTrigger.forEach((trigger) => trigger.addEventListener('click', this.openModal));
            }
            else {
                this.uppy.log('Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself', 'warning');
            }
        }
        this.startListeningToResize();
        document.addEventListener('paste', this.handlePasteOnBody);
        this.uppy.on('plugin-added', this.#addSupportedPluginIfNoTarget);
        this.uppy.on('plugin-remove', this.removeTarget);
        this.uppy.on('file-added', this.hideAllPanels);
        this.uppy.on('dashboard:modal-closed', this.hideAllPanels);
        this.uppy.on('complete', this.handleComplete);
        this.uppy.on('files-added', this.#generateLargeThumbnailIfSingleFile);
        this.uppy.on('file-removed', this.#generateLargeThumbnailIfSingleFile);
        // ___Why fire on capture?
        //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.
        document.addEventListener('focus', this.recordIfFocusedOnUppyRecently, true);
        document.addEventListener('click', this.recordIfFocusedOnUppyRecently, true);
        if (this.opts.inline) {
            this.el.addEventListener('keydown', this.handleKeyDownInInline);
        }
        if (this.opts.autoOpen) {
            this.uppy.on('files-added', this.#openFileEditorWhenFilesAdded);
        }
    };
    removeEvents = () => {
        const showModalTrigger = lib_findAllDOMElements(this.opts.trigger);
        if (!this.opts.inline && showModalTrigger) {
            showModalTrigger.forEach((trigger) => trigger.removeEventListener('click', this.openModal));
        }
        this.stopListeningToResize();
        document.removeEventListener('paste', this.handlePasteOnBody);
        window.removeEventListener('popstate', this.handlePopState, false);
        this.uppy.off('plugin-added', this.#addSupportedPluginIfNoTarget);
        this.uppy.off('plugin-remove', this.removeTarget);
        this.uppy.off('file-added', this.hideAllPanels);
        this.uppy.off('dashboard:modal-closed', this.hideAllPanels);
        this.uppy.off('complete', this.handleComplete);
        this.uppy.off('files-added', this.#generateLargeThumbnailIfSingleFile);
        this.uppy.off('file-removed', this.#generateLargeThumbnailIfSingleFile);
        document.removeEventListener('focus', this.recordIfFocusedOnUppyRecently);
        document.removeEventListener('click', this.recordIfFocusedOnUppyRecently);
        if (this.opts.inline) {
            this.el.removeEventListener('keydown', this.handleKeyDownInInline);
        }
        if (this.opts.autoOpen) {
            this.uppy.off('files-added', this.#openFileEditorWhenFilesAdded);
        }
    };
    superFocusOnEachUpdate = () => {
        const isFocusInUppy = this.el.contains(document.activeElement);
        // When focus is lost on the page (== focus is on body for most browsers, or focus is null for IE11)
        const isFocusNowhere = document.activeElement === document.body ||
            document.activeElement === null;
        const isInformerHidden = this.uppy.getState().info.length === 0;
        const isModal = !this.opts.inline;
        if (
        // If update is connected to showing the Informer - let the screen reader calmly read it.
        isInformerHidden &&
            // If we are in a modal - always superfocus without concern for other elements
            // on the page (user is unlikely to want to interact with the rest of the page)
            (isModal ||
                // If we are already inside of Uppy, or
                isFocusInUppy ||
                // If we are not focused on anything BUT we have already, at least once, focused on uppy
                //   1. We focus when isFocusNowhere, because when the element we were focused
                //      on disappears (e.g. an overlay), - focus gets lost. If user is typing
                //      something somewhere else on the page, - focus won't be 'nowhere'.
                //   2. We only focus when focus is nowhere AND this.ifFocusedOnUppyRecently,
                //      to avoid focus jumps if we do something else on the page.
                //   [Practical check] Without '&& this.ifFocusedOnUppyRecently', in Safari, in inline mode,
                //                     when file is uploading, - navigate via tab to the checkbox,
                //                     try to press space multiple times. Focus will jump to Uppy.
                (isFocusNowhere && this.ifFocusedOnUppyRecently))) {
            this.superFocus(this.el, this.getPluginState().activeOverlayType);
        }
        else {
            this.superFocus.cancel();
        }
    };
    afterUpdate = () => {
        if (this.opts.disabled && !this.dashboardIsDisabled) {
            this.disableInteractiveElements(true);
            return;
        }
        if (!this.opts.disabled && this.dashboardIsDisabled) {
            this.disableInteractiveElements(false);
        }
        this.superFocusOnEachUpdate();
    };
    saveFileCard = (meta, fileID) => {
        this.uppy.setFileMeta(fileID, meta);
        this.toggleFileCard(false, fileID);
    };
    #attachRenderFunctionToTarget = (target) => {
        const plugin = this.uppy.getPlugin(target.id);
        return {
            ...target,
            icon: plugin.icon || this.opts.defaultPickerIcon,
            render: plugin.render,
        };
    };
    #isTargetSupported = (target) => {
        const plugin = this.uppy.getPlugin(target.id);
        // If the plugin does not provide a `supported` check, assume the plugin works everywhere.
        if (typeof plugin.isSupported !== 'function') {
            return true;
        }
        return plugin.isSupported();
    };
    #getAcquirers = (targets) => {
        return targets
            .filter((target) => target.type === 'acquirer' && this.#isTargetSupported(target))
            .map(this.#attachRenderFunctionToTarget);
    };
    #getProgressIndicators = (targets) => {
        return targets
            .filter((target) => target.type === 'progressindicator')
            .map(this.#attachRenderFunctionToTarget);
    };
    #getEditors = (targets) => {
        return targets
            .filter((target) => target.type === 'editor')
            .map(this.#attachRenderFunctionToTarget);
    };
    render = (state) => {
        const pluginState = this.getPluginState();
        const { files, capabilities, allowNewUpload } = state;
        const { newFiles, uploadStartedFiles, completeFiles, erroredFiles, inProgressFiles, inProgressNotPausedFiles, processingFiles, isUploadStarted, isAllComplete, isAllPaused, } = this.uppy.getObjectOfFilesPerState();
        const acquirers = this.#getAcquirers(pluginState.targets);
        const progressindicators = this.#getProgressIndicators(pluginState.targets);
        const editors = this.#getEditors(pluginState.targets);
        let theme;
        if (this.opts.theme === 'auto') {
            theme = capabilities.darkMode ? 'dark' : 'light';
        }
        else {
            theme = this.opts.theme;
        }
        if (['files', 'folders', 'both'].indexOf(this.opts.fileManagerSelectionType) <
            0) {
            this.opts.fileManagerSelectionType = 'files';
            console.warn(`Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`);
        }
        return Dashboard_Dashboard({
            state,
            isHidden: pluginState.isHidden,
            files,
            newFiles,
            uploadStartedFiles,
            completeFiles,
            erroredFiles,
            inProgressFiles,
            inProgressNotPausedFiles,
            processingFiles,
            isUploadStarted,
            isAllComplete,
            isAllPaused,
            totalFileCount: Object.keys(files).length,
            totalProgress: state.totalProgress,
            allowNewUpload,
            acquirers,
            theme,
            disabled: this.opts.disabled,
            disableLocalFiles: this.opts.disableLocalFiles,
            direction: this.opts.direction,
            activePickerPanel: pluginState.activePickerPanel,
            showFileEditor: pluginState.showFileEditor,
            saveFileEditor: this.saveFileEditor,
            closeFileEditor: this.closeFileEditor,
            disableInteractiveElements: this.disableInteractiveElements,
            animateOpenClose: this.opts.animateOpenClose,
            isClosing: pluginState.isClosing,
            progressindicators,
            editors,
            autoProceed: this.uppy.opts.autoProceed,
            id: this.id,
            closeModal: this.requestCloseModal,
            handleClickOutside: this.handleClickOutside,
            handleInputChange: this.handleInputChange,
            handlePaste: this.handlePaste,
            inline: this.opts.inline,
            showPanel: this.showPanel,
            hideAllPanels: this.hideAllPanels,
            i18n: this.i18n,
            i18nArray: this.i18nArray,
            uppy: this.uppy,
            note: this.opts.note,
            recoveredState: state.recoveredState,
            metaFields: pluginState.metaFields,
            resumableUploads: capabilities.resumableUploads || false,
            individualCancellation: capabilities.individualCancellation,
            isMobileDevice: capabilities.isMobileDevice,
            fileCardFor: pluginState.fileCardFor,
            toggleFileCard: this.toggleFileCard,
            toggleAddFilesPanel: this.toggleAddFilesPanel,
            showAddFilesPanel: pluginState.showAddFilesPanel,
            saveFileCard: this.saveFileCard,
            openFileEditor: this.openFileEditor,
            canEditFile: this.canEditFile,
            width: this.opts.width,
            height: this.opts.height,
            showLinkToFileUploadResult: this.opts.showLinkToFileUploadResult,
            fileManagerSelectionType: this.opts.fileManagerSelectionType,
            proudlyDisplayPoweredByUppy: this.opts.proudlyDisplayPoweredByUppy,
            hideCancelButton: this.opts.hideCancelButton,
            hideRetryButton: this.opts.hideRetryButton,
            hidePauseResumeButton: this.opts.hidePauseResumeButton,
            showRemoveButtonAfterComplete: this.opts.showRemoveButtonAfterComplete,
            containerWidth: pluginState.containerWidth,
            containerHeight: pluginState.containerHeight,
            areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
            parentElement: this.el,
            allowedFileTypes: this.uppy.opts.restrictions.allowedFileTypes,
            maxNumberOfFiles: this.uppy.opts.restrictions.maxNumberOfFiles,
            requiredMetaFields: this.uppy.opts.restrictions.requiredMetaFields,
            showSelectedFiles: this.opts.showSelectedFiles,
            showNativePhotoCameraButton: this.opts.showNativePhotoCameraButton,
            showNativeVideoCameraButton: this.opts.showNativeVideoCameraButton,
            nativeCameraFacingMode: this.opts.nativeCameraFacingMode,
            singleFileFullScreen: this.opts.singleFileFullScreen,
            handleCancelRestore: this.handleCancelRestore,
            handleRequestThumbnail: this.handleRequestThumbnail,
            handleCancelThumbnail: this.handleCancelThumbnail,
            // drag props
            isDraggingOver: pluginState.isDraggingOver,
            handleDragOver: this.handleDragOver,
            handleDragLeave: this.handleDragLeave,
            handleDrop: this.handleDrop,
        });
    };
    #addSpecifiedPluginsFromOptions = () => {
        const { plugins } = this.opts;
        plugins.forEach((pluginID) => {
            const plugin = this.uppy.getPlugin(pluginID);
            if (plugin) {
                ;
                plugin.mount(this, plugin);
            }
            else {
                this.uppy.log(`[Uppy] Dashboard could not find plugin '${pluginID}', make sure to uppy.use() the plugins you are specifying`, 'warning');
            }
        });
    };
    #autoDiscoverPlugins = () => {
        this.uppy.iteratePlugins(this.#addSupportedPluginIfNoTarget);
    };
    #addSupportedPluginIfNoTarget = (plugin) => {
        // Only these types belong on the Dashboard,
        // we wouldn’t want to try and mount Compressor or Tus, for example.
        const typesAllowed = ['acquirer', 'editor'];
        if (plugin && !plugin.opts?.target && typesAllowed.includes(plugin.type)) {
            const pluginAlreadyAdded = this.getPluginState().targets.some((installedPlugin) => plugin.id === installedPlugin.id);
            if (!pluginAlreadyAdded) {
                ;
                plugin.mount(this, plugin);
            }
        }
    };
    #getStatusBarOpts() {
        const { hideUploadButton, hideRetryButton, hidePauseResumeButton, hideCancelButton, showProgressDetails, hideProgressAfterFinish, locale: l, doneButtonHandler, } = this.opts;
        return {
            hideUploadButton,
            hideRetryButton,
            hidePauseResumeButton,
            hideCancelButton,
            showProgressDetails,
            hideAfterFinish: hideProgressAfterFinish,
            locale: l,
            doneButtonHandler,
        };
    }
    #getThumbnailGeneratorOpts() {
        const { thumbnailWidth, thumbnailHeight, thumbnailType, waitForThumbnailsBeforeUpload, } = this.opts;
        return {
            thumbnailWidth,
            thumbnailHeight,
            thumbnailType,
            waitForThumbnailsBeforeUpload,
            // If we don't block on thumbnails, we can lazily generate them
            lazy: !waitForThumbnailsBeforeUpload,
        };
    }
    #getInformerOpts() {
        return {
        // currently no options
        };
    }
    setOptions(opts) {
        super.setOptions(opts);
        this.uppy
            .getPlugin(this.#getStatusBarId())
            ?.setOptions(this.#getStatusBarOpts());
        this.uppy
            .getPlugin(this.#getThumbnailGeneratorId())
            ?.setOptions(this.#getThumbnailGeneratorOpts());
    }
    #getStatusBarId() {
        return `${this.id}:StatusBar`;
    }
    #getThumbnailGeneratorId() {
        return `${this.id}:ThumbnailGenerator`;
    }
    #getInformerId() {
        return `${this.id}:Informer`;
    }
    install = () => {
        // Set default state for Dashboard
        this.setPluginState({
            isHidden: true,
            fileCardFor: null,
            activeOverlayType: null,
            showAddFilesPanel: false,
            activePickerPanel: undefined,
            showFileEditor: false,
            metaFields: this.opts.metaFields,
            targets: [],
            // We'll make them visible once .containerWidth is determined
            areInsidesReadyToBeVisible: false,
            isDraggingOver: false,
        });
        const { inline, closeAfterFinish } = this.opts;
        if (inline && closeAfterFinish) {
            throw new Error('[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.');
        }
        const { allowMultipleUploads, allowMultipleUploadBatches } = this.uppy.opts;
        if ((allowMultipleUploads || allowMultipleUploadBatches) &&
            closeAfterFinish) {
            this.uppy.log('[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploadBatches` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true', 'warning');
        }
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
        if (!this.opts.disableStatusBar) {
            this.uppy.use(StatusBar, {
                id: this.#getStatusBarId(),
                target: this,
                ...this.#getStatusBarOpts(),
            });
        }
        if (!this.opts.disableInformer) {
            this.uppy.use(Informer, {
                id: this.#getInformerId(),
                target: this,
                ...this.#getInformerOpts(),
            });
        }
        if (!this.opts.disableThumbnailGenerator) {
            this.uppy.use(ThumbnailGenerator, {
                id: this.#getThumbnailGeneratorId(),
                ...this.#getThumbnailGeneratorOpts(),
            });
        }
        // Dark Mode / theme
        this.darkModeMediaQuery =
            typeof window !== 'undefined' && window.matchMedia
                ? window.matchMedia('(prefers-color-scheme: dark)')
                : null;
        const isDarkModeOnFromTheStart = this.darkModeMediaQuery
            ? this.darkModeMediaQuery.matches
            : false;
        this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnFromTheStart ? 'on' : 'off'}`);
        this.setDarkModeCapability(isDarkModeOnFromTheStart);
        if (this.opts.theme === 'auto') {
            this.darkModeMediaQuery?.addListener(this.handleSystemDarkModeChange);
        }
        this.#addSpecifiedPluginsFromOptions();
        this.#autoDiscoverPlugins();
        this.initEvents();
    };
    uninstall = () => {
        if (!this.opts.disableInformer) {
            const informer = this.uppy.getPlugin(`${this.id}:Informer`);
            // Checking if this plugin exists, in case it was removed by uppy-core
            // before the Dashboard was.
            if (informer)
                this.uppy.removePlugin(informer);
        }
        if (!this.opts.disableStatusBar) {
            const statusBar = this.uppy.getPlugin(`${this.id}:StatusBar`);
            if (statusBar)
                this.uppy.removePlugin(statusBar);
        }
        if (!this.opts.disableThumbnailGenerator) {
            const thumbnail = this.uppy.getPlugin(`${this.id}:ThumbnailGenerator`);
            if (thumbnail)
                this.uppy.removePlugin(thumbnail);
        }
        const { plugins } = this.opts;
        plugins.forEach((pluginID) => {
            const plugin = this.uppy.getPlugin(pluginID);
            if (plugin)
                plugin.unmount();
        });
        if (this.opts.theme === 'auto') {
            this.darkModeMediaQuery?.removeListener(this.handleSystemDarkModeChange);
        }
        if (this.opts.disablePageScrollWhenModalOpen) {
            document.body.classList.remove('uppy-Dashboard-isFixed');
        }
        this.unmount();
        this.removeEvents();
    };
}

;// ./node_modules/@uppy/dashboard/lib/index.js


;// ./node_modules/@uppy/core/lib/EventManager.js
/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
class EventManager {
    #uppy;
    #events = [];
    constructor(uppy) {
        this.#uppy = uppy;
    }
    on(event, fn) {
        this.#events.push([event, fn]);
        return this.#uppy.on(event, fn);
    }
    remove() {
        for (const [event, fn] of this.#events.splice(0)) {
            this.#uppy.off(event, fn);
        }
    }
    onFilePause(fileID, cb) {
        this.on('upload-pause', (file, isPaused) => {
            if (fileID === file?.id) {
                cb(isPaused);
            }
        });
    }
    onFileRemove(fileID, cb) {
        this.on('file-removed', (file) => {
            if (fileID === file.id)
                cb(file.id);
        });
    }
    onPause(fileID, cb) {
        this.on('upload-pause', (file, isPaused) => {
            if (fileID === file?.id) {
                // const isPaused = this.#uppy.pauseResume(fileID)
                cb(isPaused);
            }
        });
    }
    onRetry(fileID, cb) {
        this.on('upload-retry', (file) => {
            if (fileID === file?.id) {
                cb();
            }
        });
    }
    onRetryAll(fileID, cb) {
        this.on('retry-all', () => {
            if (!this.#uppy.getFile(fileID))
                return;
            cb();
        });
    }
    onPauseAll(fileID, cb) {
        this.on('pause-all', () => {
            if (!this.#uppy.getFile(fileID))
                return;
            cb();
        });
    }
    onCancelAll(fileID, eventHandler) {
        this.on('cancel-all', (...args) => {
            if (!this.#uppy.getFile(fileID))
                return;
            eventHandler(...args);
        });
    }
    onResumeAll(fileID, cb) {
        this.on('resume-all', () => {
            if (!this.#uppy.getFile(fileID))
                return;
            cb();
        });
    }
}

;// ./node_modules/@uppy/utils/lib/NetworkError.js
class NetworkError extends Error {
    cause;
    isNetworkError;
    request;
    constructor(error, xhr = null) {
        super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
        this.cause = error;
        this.isNetworkError = true;
        this.request = xhr;
    }
}
/* harmony default export */ const lib_NetworkError = (NetworkError);

;// ./node_modules/@uppy/utils/lib/ProgressTimeout.js
/**
 * Helper to abort upload requests if there has not been any progress for `timeout` ms.
 * Create an instance using `timer = new ProgressTimeout(10000, onTimeout)`
 * Call `timer.progress()` to signal that there has been progress of any kind.
 * Call `timer.done()` when the upload has completed.
 */
class ProgressTimeout {
    #aliveTimer;
    #isDone = false;
    #onTimedOut;
    #timeout;
    constructor(timeout, timeoutHandler) {
        this.#timeout = timeout;
        this.#onTimedOut = () => timeoutHandler(timeout);
    }
    progress() {
        // Some browsers fire another progress event when the upload is
        // cancelled, so we have to ignore progress after the timer was
        // told to stop.
        if (this.#isDone)
            return;
        if (this.#timeout > 0) {
            clearTimeout(this.#aliveTimer);
            this.#aliveTimer = setTimeout(this.#onTimedOut, this.#timeout);
        }
    }
    done() {
        if (!this.#isDone) {
            clearTimeout(this.#aliveTimer);
            this.#aliveTimer = undefined;
            this.#isDone = true;
        }
    }
}
/* harmony default export */ const lib_ProgressTimeout = (ProgressTimeout);

;// ./node_modules/@uppy/utils/lib/fetcher.js


const fetcher_noop = () => { };
/**
 * Fetches data from a specified URL using XMLHttpRequest, with optional retry functionality and progress tracking.
 *
 * @param url The URL to send the request to.
 * @param options Optional settings for the fetch operation.
 */
function fetcher(url, options = {}) {
    const { body = null, headers = {}, method = 'GET', onBeforeRequest = fetcher_noop, onUploadProgress = fetcher_noop, shouldRetry = () => true, onAfterResponse = fetcher_noop, onTimeout = fetcher_noop, responseType, retries = 3, signal = null, timeout = 30_000, withCredentials = false, } = options;
    // 300 ms, 600 ms, 1200 ms, 2400 ms, 4800 ms
    const delay = (attempt) => 0.3 * 2 ** (attempt - 1) * 1000;
    const timer = new lib_ProgressTimeout(timeout, onTimeout);
    function requestWithRetry(retryCount = 0) {
        // biome-ignore lint/suspicious/noAsyncPromiseExecutor: it's fine
        return new Promise(async (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const onError = (error) => {
                if (shouldRetry(xhr) && retryCount < retries) {
                    setTimeout(() => {
                        requestWithRetry(retryCount + 1).then(resolve, reject);
                    }, delay(retryCount));
                }
                else {
                    timer.done();
                    reject(error);
                }
            };
            xhr.open(method, url, true);
            xhr.withCredentials = withCredentials;
            if (responseType) {
                xhr.responseType = responseType;
            }
            signal?.addEventListener('abort', () => {
                xhr.abort();
                // Using DOMException for abort errors aligns with
                // the convention established by the Fetch API.
                reject(new DOMException('Aborted', 'AbortError'));
            });
            xhr.onload = async () => {
                try {
                    await onAfterResponse(xhr, retryCount);
                }
                catch (err) {
                    // This is important as we need to emit the xhr
                    // over the upload-error event.
                    err.request = xhr;
                    onError(err);
                    return;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    timer.done();
                    resolve(xhr);
                }
                else if (shouldRetry(xhr) && retryCount < retries) {
                    setTimeout(() => {
                        requestWithRetry(retryCount + 1).then(resolve, reject);
                    }, delay(retryCount));
                }
                else {
                    timer.done();
                    reject(new lib_NetworkError(xhr.statusText, xhr));
                }
            };
            xhr.onerror = () => onError(new lib_NetworkError(xhr.statusText, xhr));
            xhr.upload.onprogress = (event) => {
                timer.progress();
                onUploadProgress(event);
            };
            if (headers) {
                Object.keys(headers).forEach((key) => {
                    xhr.setRequestHeader(key, headers[key]);
                });
            }
            await onBeforeRequest(xhr, retryCount);
            xhr.send(body);
        });
    }
    return requestWithRetry();
}

;// ./node_modules/@uppy/utils/lib/fileFilters.js
function filterNonFailedFiles(files) {
    const hasError = (file) => 'error' in file && !!file.error;
    return files.filter((file) => !hasError(file));
}
// Don't double-emit upload-started for Golden Retriever-restored files that were already started
function filterFilesToEmitUploadStarted(files) {
    return files.filter((file) => !file.progress?.uploadStarted || !file.isRestored);
}

;// ./node_modules/@uppy/utils/lib/getAllowedMetaFields.js
function getAllowedMetaFields(fields, meta) {
    if (fields === true) {
        return Object.keys(meta);
    }
    if (Array.isArray(fields)) {
        return fields;
    }
    return [];
}

;// ./node_modules/@uppy/utils/lib/isNetworkError.js
function isNetworkError(xhr) {
    if (!xhr) {
        return false;
    }
    return (xhr.readyState !== 0 && xhr.readyState !== 4) || xhr.status === 0;
}
/* harmony default export */ const lib_isNetworkError = (isNetworkError);

;// ./node_modules/@uppy/utils/lib/RateLimitedQueue.js
function createCancelError(cause) {
    return new Error('Cancelled', { cause });
}
function abortOn(signal) {
    if (signal != null) {
        const abortPromise = () => this.abort(signal.reason);
        signal.addEventListener('abort', abortPromise, { once: true });
        const removeAbortListener = () => {
            signal.removeEventListener('abort', abortPromise);
        };
        this.then?.(removeAbortListener, removeAbortListener);
    }
    return this;
}
class RateLimitedQueue {
    #activeRequests = 0;
    #queuedHandlers = [];
    #paused = false;
    #pauseTimer;
    #downLimit = 1;
    #upperLimit;
    #rateLimitingTimer;
    limit;
    constructor(limit) {
        if (typeof limit !== 'number' || limit === 0) {
            this.limit = Infinity;
        }
        else {
            this.limit = limit;
        }
    }
    #call(fn) {
        this.#activeRequests += 1;
        let done = false;
        let cancelActive;
        try {
            cancelActive = fn();
        }
        catch (err) {
            this.#activeRequests -= 1;
            throw err;
        }
        return {
            abort: (cause) => {
                if (done)
                    return;
                done = true;
                this.#activeRequests -= 1;
                cancelActive?.(cause);
                this.#queueNext();
            },
            done: () => {
                if (done)
                    return;
                done = true;
                this.#activeRequests -= 1;
                this.#queueNext();
            },
        };
    }
    #queueNext() {
        // Do it soon but not immediately, this allows clearing out the entire queue synchronously
        // one by one without continuously _advancing_ it (and starting new tasks before immediately
        // aborting them)
        queueMicrotask(() => this.#next());
    }
    #next() {
        if (this.#paused || this.#activeRequests >= this.limit) {
            return;
        }
        if (this.#queuedHandlers.length === 0) {
            return;
        }
        // Dispatch the next request, and update the abort/done handlers
        // so that cancelling it does the Right Thing (and doesn't just try
        // to dequeue an already-running request).
        const next = this.#queuedHandlers.shift();
        if (next == null) {
            throw new Error('Invariant violation: next is null');
        }
        const handler = this.#call(next.fn);
        next.abort = handler.abort;
        next.done = handler.done;
    }
    #queue(fn, options) {
        const handler = {
            fn,
            priority: options?.priority || 0,
            abort: () => {
                this.#dequeue(handler);
            },
            done: () => {
                throw new Error('Cannot mark a queued request as done: this indicates a bug');
            },
        };
        const index = this.#queuedHandlers.findIndex((other) => {
            return handler.priority > other.priority;
        });
        if (index === -1) {
            this.#queuedHandlers.push(handler);
        }
        else {
            this.#queuedHandlers.splice(index, 0, handler);
        }
        return handler;
    }
    #dequeue(handler) {
        const index = this.#queuedHandlers.indexOf(handler);
        if (index !== -1) {
            this.#queuedHandlers.splice(index, 1);
        }
    }
    run(fn, queueOptions) {
        if (!this.#paused && this.#activeRequests < this.limit) {
            return this.#call(fn);
        }
        return this.#queue(fn, queueOptions);
    }
    wrapSyncFunction(fn, queueOptions) {
        return (...args) => {
            const queuedRequest = this.run(() => {
                fn(...args);
                queueMicrotask(() => queuedRequest.done());
                return () => { };
            }, queueOptions);
            return {
                abortOn,
                abort() {
                    queuedRequest.abort();
                },
            };
        };
    }
    wrapPromiseFunction(fn, queueOptions) {
        return (...args) => {
            let queuedRequest;
            const outerPromise = new Promise((resolve, reject) => {
                queuedRequest = this.run(() => {
                    let cancelError;
                    let innerPromise;
                    try {
                        innerPromise = Promise.resolve(fn(...args));
                    }
                    catch (err) {
                        innerPromise = Promise.reject(err);
                    }
                    innerPromise.then((result) => {
                        if (cancelError) {
                            reject(cancelError);
                        }
                        else {
                            queuedRequest.done();
                            resolve(result);
                        }
                    }, (err) => {
                        if (cancelError) {
                            reject(cancelError);
                        }
                        else {
                            queuedRequest.done();
                            reject(err);
                        }
                    });
                    return (cause) => {
                        cancelError = createCancelError(cause);
                    };
                }, queueOptions);
            });
            outerPromise.abort = (cause) => {
                queuedRequest.abort(cause);
            };
            outerPromise.abortOn = abortOn;
            return outerPromise;
        };
    }
    resume() {
        this.#paused = false;
        clearTimeout(this.#pauseTimer);
        for (let i = 0; i < this.limit; i++) {
            this.#queueNext();
        }
    }
    #resume = () => this.resume();
    /**
     * Freezes the queue for a while or indefinitely.
     *
     * @param {number | null } [duration] Duration for the pause to happen, in milliseconds.
     *                                    If omitted, the queue won't resume automatically.
     */
    pause(duration = null) {
        this.#paused = true;
        clearTimeout(this.#pauseTimer);
        if (duration != null) {
            this.#pauseTimer = setTimeout(this.#resume, duration);
        }
    }
    /**
     * Pauses the queue for a duration, and lower the limit of concurrent requests
     * when the queue resumes. When the queue resumes, it tries to progressively
     * increase the limit in `this.#increaseLimit` until another call is made to
     * `this.rateLimit`.
     * Call this function when using the RateLimitedQueue for network requests and
     * the remote server responds with 429 HTTP code.
     *
     * @param {number} duration in milliseconds.
     */
    rateLimit(duration) {
        clearTimeout(this.#rateLimitingTimer);
        this.pause(duration);
        if (this.limit > 1 && Number.isFinite(this.limit)) {
            this.#upperLimit = this.limit - 1;
            this.limit = this.#downLimit;
            this.#rateLimitingTimer = setTimeout(this.#increaseLimit, duration);
        }
    }
    #increaseLimit = () => {
        if (this.#paused) {
            this.#rateLimitingTimer = setTimeout(this.#increaseLimit, 0);
            return;
        }
        this.#downLimit = this.limit;
        this.limit = Math.ceil((this.#upperLimit + this.#downLimit) / 2);
        for (let i = this.#downLimit; i <= this.limit; i++) {
            this.#queueNext();
        }
        if (this.#upperLimit - this.#downLimit > 3) {
            this.#rateLimitingTimer = setTimeout(this.#increaseLimit, 2000);
        }
        else {
            this.#downLimit = Math.floor(this.#downLimit / 2);
        }
    };
    get isPaused() {
        return this.#paused;
    }
}
const internalRateLimitedQueue = Symbol('__queue');

;// ./node_modules/@uppy/xhr-upload/package.json
const xhr_upload_package_namespaceObject = {"rE":"4.4.2"};
;// ./node_modules/@uppy/xhr-upload/lib/locale.js
/* harmony default export */ const xhr_upload_lib_locale = ({
    strings: {
        // Shown in the Informer if an upload is being canceled because it stalled for too long.
        uploadStalled: 'Upload has not made any progress for %{seconds} seconds. You may want to retry it.',
    },
});

;// ./node_modules/@uppy/xhr-upload/lib/index.js










function buildResponseError(xhr, err) {
    let error = err;
    // No error message
    if (!error)
        error = new Error('Upload error');
    // Got an error message string
    if (typeof error === 'string')
        error = new Error(error);
    // Got something else
    if (!(error instanceof Error)) {
        error = Object.assign(new Error('Upload error'), { data: error });
    }
    if (lib_isNetworkError(xhr)) {
        error = new lib_NetworkError(error, xhr);
        return error;
    }
    // @ts-expect-error request can only be set on NetworkError
    // but we use NetworkError to distinguish between errors.
    error.request = xhr;
    return error;
}
/**
 * Set `data.type` in the blob to `file.meta.type`,
 * because we might have detected a more accurate file type in Uppy
 * https://stackoverflow.com/a/50875615
 */
function setTypeInBlob(file) {
    const dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
    return dataWithUpdatedType;
}
const xhr_upload_lib_defaultOptions = {
    formData: true,
    fieldName: 'file',
    method: 'post',
    allowedMetaFields: true,
    bundle: false,
    headers: {},
    timeout: 30 * 1000,
    limit: 5,
    withCredentials: false,
    responseType: '',
};
class XHRUpload extends BasePlugin {
    static VERSION = xhr_upload_package_namespaceObject.rE;
    #getFetcher;
    requests;
    uploaderEvents;
    constructor(uppy, opts) {
        super(uppy, {
            ...xhr_upload_lib_defaultOptions,
            fieldName: opts.bundle ? 'files[]' : 'file',
            ...opts,
        });
        this.type = 'uploader';
        this.id = this.opts.id || 'XHRUpload';
        this.defaultLocale = xhr_upload_lib_locale;
        this.i18nInit();
        // Simultaneous upload limiting is shared across all uploads with this plugin.
        if (internalRateLimitedQueue in this.opts) {
            // @ts-ignore untyped internal
            this.requests = this.opts[internalRateLimitedQueue];
        }
        else {
            this.requests = new RateLimitedQueue(this.opts.limit);
        }
        if (this.opts.bundle && !this.opts.formData) {
            throw new Error('`opts.formData` must be true when `opts.bundle` is enabled.');
        }
        if (this.opts.bundle && typeof this.opts.headers === 'function') {
            throw new Error('`opts.headers` can not be a function when the `bundle: true` option is set.');
        }
        if (opts?.allowedMetaFields === undefined && 'metaFields' in this.opts) {
            throw new Error('The `metaFields` option has been renamed to `allowedMetaFields`.');
        }
        this.uploaderEvents = Object.create(null);
        /**
         * xhr-upload wrapper for `fetcher` to handle user options
         * `validateStatus`, `getResponseError`, `getResponseData`
         * and to emit `upload-progress`, `upload-error`, and `upload-success` events.
         */
        this.#getFetcher = (files) => {
            return async (url, options) => {
                try {
                    const res = await fetcher(url, {
                        ...options,
                        onBeforeRequest: (xhr, retryCount) => this.opts.onBeforeRequest?.(xhr, retryCount, files),
                        shouldRetry: this.opts.shouldRetry,
                        onAfterResponse: this.opts.onAfterResponse,
                        onTimeout: (timeout) => {
                            const seconds = Math.ceil(timeout / 1000);
                            const error = new Error(this.i18n('uploadStalled', { seconds }));
                            this.uppy.emit('upload-stalled', error, files);
                        },
                        onUploadProgress: (event) => {
                            if (event.lengthComputable) {
                                for (const { id } of files) {
                                    const file = this.uppy.getFile(id);
                                    this.uppy.emit('upload-progress', file, {
                                        uploadStarted: file.progress.uploadStarted ?? 0,
                                        bytesUploaded: (event.loaded / event.total) * file.size,
                                        bytesTotal: file.size,
                                    });
                                }
                            }
                        },
                    });
                    let body = await this.opts.getResponseData?.(res);
                    if (res.responseType === 'json') {
                        body ??= res.response;
                    }
                    else {
                        try {
                            body ??= JSON.parse(res.responseText);
                        }
                        catch (cause) {
                            throw new Error('@uppy/xhr-upload expects a JSON response (with a `url` property). To parse non-JSON responses, use `getResponseData` to turn your response into JSON.', { cause });
                        }
                    }
                    const uploadURL = typeof body?.url === 'string' ? body.url : undefined;
                    for (const { id } of files) {
                        this.uppy.emit('upload-success', this.uppy.getFile(id), {
                            status: res.status,
                            body,
                            uploadURL,
                        });
                    }
                    return res;
                }
                catch (error) {
                    if (error.name === 'AbortError') {
                        return undefined;
                    }
                    const request = error.request;
                    for (const file of files) {
                        this.uppy.emit('upload-error', this.uppy.getFile(file.id), buildResponseError(request, error), request);
                    }
                    throw error;
                }
            };
        };
    }
    getOptions(file) {
        const overrides = this.uppy.getState().xhrUpload;
        const { headers } = this.opts;
        const opts = {
            ...this.opts,
            ...(overrides || {}),
            ...(file.xhrUpload || {}),
            headers: {},
        };
        // Support for `headers` as a function, only in the XHRUpload settings.
        // Options set by other plugins in Uppy state or on the files themselves are still merged in afterward.
        //
        // ```js
        // headers: (file) => ({ expires: file.meta.expires })
        // ```
        if (typeof headers === 'function') {
            opts.headers = headers(file);
        }
        else {
            Object.assign(opts.headers, this.opts.headers);
        }
        if (overrides) {
            Object.assign(opts.headers, overrides.headers);
        }
        if (file.xhrUpload) {
            Object.assign(opts.headers, file.xhrUpload.headers);
        }
        return opts;
    }
    addMetadata(formData, meta, opts) {
        const allowedMetaFields = getAllowedMetaFields(opts.allowedMetaFields, meta);
        allowedMetaFields.forEach((item) => {
            const value = meta[item];
            if (Array.isArray(value)) {
                // In this case we don't transform `item` to add brackets, it's up to
                // the user to add the brackets so it won't be overridden.
                value.forEach((subItem) => formData.append(item, subItem));
            }
            else {
                formData.append(item, value);
            }
        });
    }
    createFormDataUpload(file, opts) {
        const formPost = new FormData();
        this.addMetadata(formPost, file.meta, opts);
        const dataWithUpdatedType = setTypeInBlob(file);
        if (file.name) {
            formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
        }
        else {
            formPost.append(opts.fieldName, dataWithUpdatedType);
        }
        return formPost;
    }
    createBundledUpload(files, opts) {
        const formPost = new FormData();
        const { meta } = this.uppy.getState();
        this.addMetadata(formPost, meta, opts);
        files.forEach((file) => {
            const options = this.getOptions(file);
            const dataWithUpdatedType = setTypeInBlob(file);
            if (file.name) {
                formPost.append(options.fieldName, dataWithUpdatedType, file.name);
            }
            else {
                formPost.append(options.fieldName, dataWithUpdatedType);
            }
        });
        return formPost;
    }
    async #uploadLocalFile(file) {
        const events = new EventManager(this.uppy);
        const controller = new AbortController();
        const uppyFetch = this.requests.wrapPromiseFunction(async () => {
            const opts = this.getOptions(file);
            const fetch = this.#getFetcher([file]);
            const body = opts.formData
                ? this.createFormDataUpload(file, opts)
                : file.data;
            const endpoint = typeof opts.endpoint === 'string'
                ? opts.endpoint
                : await opts.endpoint(file);
            return fetch(endpoint, {
                ...opts,
                body,
                signal: controller.signal,
            });
        });
        events.onFileRemove(file.id, () => controller.abort());
        events.onCancelAll(file.id, () => {
            controller.abort();
        });
        try {
            await uppyFetch().abortOn(controller.signal);
        }
        catch (error) {
            // TODO: create formal error with name 'AbortError' (this comes from RateLimitedQueue)
            if (error.message !== 'Cancelled') {
                throw error;
            }
        }
        finally {
            events.remove();
        }
    }
    async #uploadBundle(files) {
        const controller = new AbortController();
        const uppyFetch = this.requests.wrapPromiseFunction(async () => {
            const optsFromState = this.uppy.getState().xhrUpload ?? {};
            const fetch = this.#getFetcher(files);
            const body = this.createBundledUpload(files, {
                ...this.opts,
                ...optsFromState,
            });
            const endpoint = typeof this.opts.endpoint === 'string'
                ? this.opts.endpoint
                : await this.opts.endpoint(files);
            return fetch(endpoint, {
                // headers can't be a function with bundle: true
                ...this.opts,
                body,
                signal: controller.signal,
            });
        });
        function abort() {
            controller.abort();
        }
        // We only need to abort on cancel all because
        // individual cancellations are not possible with bundle: true
        this.uppy.once('cancel-all', abort);
        try {
            await uppyFetch().abortOn(controller.signal);
        }
        catch (error) {
            // TODO: create formal error with name 'AbortError' (this comes from RateLimitedQueue)
            if (error.message !== 'Cancelled') {
                throw error;
            }
        }
        finally {
            this.uppy.off('cancel-all', abort);
        }
    }
    #getCompanionClientArgs(file) {
        const opts = this.getOptions(file);
        const allowedMetaFields = getAllowedMetaFields(opts.allowedMetaFields, file.meta);
        return {
            ...file.remote?.body,
            protocol: 'multipart',
            endpoint: opts.endpoint,
            size: file.data.size,
            fieldname: opts.fieldName,
            metadata: Object.fromEntries(allowedMetaFields.map((name) => [name, file.meta[name]])),
            httpMethod: opts.method,
            useFormData: opts.formData,
            headers: opts.headers,
        };
    }
    async #uploadFiles(files) {
        await Promise.allSettled(files.map((file) => {
            if (file.isRemote) {
                const getQueue = () => this.requests;
                const controller = new AbortController();
                const removedHandler = (removedFile) => {
                    if (removedFile.id === file.id)
                        controller.abort();
                };
                this.uppy.on('file-removed', removedHandler);
                const uploadPromise = this.uppy
                    .getRequestClientForFile(file)
                    .uploadRemoteFile(file, this.#getCompanionClientArgs(file), {
                    signal: controller.signal,
                    getQueue,
                });
                this.requests.wrapSyncFunction(() => {
                    this.uppy.off('file-removed', removedHandler);
                }, { priority: -1 })();
                return uploadPromise;
            }
            return this.#uploadLocalFile(file);
        }));
    }
    #handleUpload = async (fileIDs) => {
        if (fileIDs.length === 0) {
            this.uppy.log('[XHRUpload] No files to upload!');
            return;
        }
        // No limit configured by the user, and no RateLimitedQueue passed in by a "parent" plugin
        // (basically just AwsS3) using the internal symbol
        // @ts-ignore untyped internal
        if (this.opts.limit === 0 && !this.opts[internalRateLimitedQueue]) {
            this.uppy.log('[XHRUpload] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/xhr-upload/#limit-0', 'warning');
        }
        this.uppy.log('[XHRUpload] Uploading...');
        const files = this.uppy.getFilesByIds(fileIDs);
        const filesFiltered = filterNonFailedFiles(files);
        const filesToEmit = filterFilesToEmitUploadStarted(filesFiltered);
        this.uppy.emit('upload-start', filesToEmit);
        if (this.opts.bundle) {
            // if bundle: true, we don’t support remote uploads
            const isSomeFileRemote = filesFiltered.some((file) => file.isRemote);
            if (isSomeFileRemote) {
                throw new Error('Can’t upload remote files when the `bundle: true` option is set');
            }
            if (typeof this.opts.headers === 'function') {
                throw new TypeError('`headers` may not be a function when the `bundle: true` option is set');
            }
            await this.#uploadBundle(filesFiltered);
        }
        else {
            await this.#uploadFiles(filesFiltered);
        }
    };
    install() {
        if (this.opts.bundle) {
            const { capabilities } = this.uppy.getState();
            this.uppy.setState({
                capabilities: {
                    ...capabilities,
                    individualCancellation: false,
                },
            });
        }
        this.uppy.addUploader(this.#handleUpload);
    }
    uninstall() {
        if (this.opts.bundle) {
            const { capabilities } = this.uppy.getState();
            this.uppy.setState({
                capabilities: {
                    ...capabilities,
                    individualCancellation: true,
                },
            });
        }
        this.uppy.removeUploader(this.#handleUpload);
    }
}

;// ./node_modules/core-js/modules/es.array.from.js
es_array_from_namespaceFn();

;// ./node_modules/core-js/modules/es.regexp.exec.js
es_regexp_exec_namespaceFn();

;// ./node_modules/core-js/modules/es.regexp.to-string.js
es_regexp_to_string_namespaceFn();

;// ./node_modules/core-js/modules/es.string.match.js
es_string_match_namespaceFn();

;// ./client/src/js/common.js











/**
 * DFU: common methods
 */
function DFU() {
  this.init = function () {};
  this.files = {}; // register of uploaded files per uploader element
  this.prefix = "dfufile";
  this.getFieldName = function (upload_element, id) {
    return upload_element.getAttribute('data-name') + "[" + id + "]";
  };
  this.getClosest = function (elem, s) {
    try {
      return elem.closest(s);
    } catch (e) {
      // Polyfill to get closest selector (IE9+)
      // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
      if (!document.documentElement.contains(elem)) return null;
      do {
        if (elem.matches(s)) return elem;
        elem = elem.parentElement || elem.parentNode;
      } while (elem !== null && elem.nodeType === 1);
      return null;
    }
  };

  /**
   * Get the form for the element provided
   */
  this.getForm = function (elem) {
    return this.getClosest(elem, 'form');
  };
  /**
   * Remove the hidden input representing an uploaded file
   * @param upload_element DOMElement
   * @param int id the file id (from Fine Uploader)
   */
  this.removeField = function (upload_element, id) {
    var f = this.getForm(upload_element);
    if (!f) {
      return false;
    }
    var name = this.getFieldName(upload_element, id);
    var field = f.elements[name];
    if (field) {
      oldField = upload_element.removeChild(field);
    }
  };
  /**
   * Append a hidden input containing the file upload uuid as a value
   * @param upload_element DOMElement
   * @param int id the file id (from Fine Uploader)
   * @param string uuid returned from the upload server
   */
  this.appendField = function (upload_element, id, uuid) {
    try {
      var f = this.getForm(upload_element);
      if (!f) {
        throw 'cannot find form for element';
      }
      var name = this.getFieldName(upload_element, id);
      var field = f.elements[name];
      if (field) {
        // ensure field value is the uuid provided
        field.value = uuid;
      } else {
        var field = document.createElement('input');
        field.type = 'hidden';
        field.value = uuid;
        field.name = name;
        field.classList.add('dfu_uploaded_file');
        upload_element.appendChild(field);
      }
      return field;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * Return internal data for file
   * @param upload_element DOMElement
   * @param int id the file id (from Fine Uploader)
   */
  this.getFile = function (upload_element, id) {
    if (typeof this.files[upload_element.id] == 'undefined') {
      this.files[upload_element.id] = [];
      this.files[upload_element.id][id] = {};
    } else if (typeof this.files[upload_element.id][id] == 'undefined') {
      this.files[upload_element.id][id] = {};
    }
    return this.files[upload_element.id][id];
  };
  this.handleUnblock = function (upload_element) {
    var f = this.getForm(upload_element);
    if (f) {
      // unblock the form if none uploading
      this.toggleSubmitButtons(f, false);
      f.onsubmit = function () {
        return true;
      };
    }
  };
  this.handleSubmit = function (upload_element) {
    var f = this.getForm(upload_element);
    if (f) {
      this.toggleSubmitButtons(f, true);
      f.onsubmit = function () {
        return false;
      };
    }
  };

  /**
   * @param DOMElement frm a form
   */
  this.toggleSubmitButtons = function (frm, disable) {
    var submit_elements = frm.querySelectorAll('[type="submit"]');
    if (submit_elements) {
      var submits = Array.from(submit_elements);
      for (var _i = 0, _submits = submits; _i < _submits.length; _i++) {
        var d = _submits[_i];
        if (disable && !d.disabled) {
          // if disable and button is enabled
          d.setAttribute('disabled', 'disabled');
          if (d.dataset.uploadsPending) {
            if (d.nodeName == 'BUTTON') {
              d.dataset.uploadsNotPending = d.textContent;
              d.textContent = d.dataset.uploadsPending;
            } else {
              d.dataset.uploadsNotPending = d.value;
              d.value = d.dataset.uploadsPending;
            }
          }
        } else if (!disable && d.disabled) {
          // if enable and button is disabled
          d.removeAttribute('disabled');
          if (d.dataset.uploadsNotPending) {
            if (d.nodeName == 'BUTTON') {
              d.textContent = d.dataset.uploadsNotPending;
            } else {
              d.value = d.dataset.uploadsNotPending;
            }
          }
        }
      }
    }
  };

  /**
   * For non-UI uploader, this returns the DOMElement representing a file upload
   * @param DOMElement upload_element
   * @param int id the file id (from Fine Uploader)
   */
  this.getFileElement = function (upload_element, id) {
    var file = document.getElementById(upload_element.id + "-upload-" + id);
    return file;
  };

  /**
   * Simple match on mimetype to test if a file might be an image based on its mimetype
   * @param string mimetype e.g image/jpg
   */
  this.isImage = function (mimetype) {
    var pattern = /^image\//;
    var result = mimetype.match(pattern);
    return result != null;
  };

  /**
   * Notify the configured notification URL
   * @param bool whether upload success or error
   * @param object file the Uppy file object (https://uppy.io/docs/uppy/#File-Objects)
   * @param object  the uppy response with response data from the remote endpoint
   * @param string uri a URN or URL representing the file
   * @param string notificationUrl
   */
  this.notify = function (result, uppyFile, uppyResponse, uri, notificationUrl) {
    try {
      var formData = {
        uploaded: 1,
        result: result ? 1 : 0,
        id: uppyFile.id,
        name: uppyFile.name ? uppyFile.name : '',
        size: uppyFile.size ? uppyFile.size : '',
        type: uppyFile.type ? uppyFile.type : '',
        uri: uri,
        src: window.location.href,
        meta: JSON.stringify(uppyFile.meta)
      };
      var xhr = new XMLHttpRequest();
      xhr.open('POST', notificationUrl);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(new URLSearchParams(formData).toString());
    } catch (e) {
      console.error('Could not notify (' + (result ? 1 : 0) + ') - ' + e);
    }
  };

  /**
   * Notify completion to the configured notify URL
   * @param object 'The result parameter is an object with arrays of successful and failed files'
   * @param string notification URL
   */
  this.notifyComplete = function (result, notificationUrl) {
    try {
      var formData = {
        uploaded: 1,
        completed: 1,
        successful: result.successful.length,
        failed: result.failed.length,
        uploadId: result.uploadID,
        src: window.location.href
      };
      var xhr = new XMLHttpRequest();
      xhr.open('POST', notificationUrl);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(new URLSearchParams(formData).toString());
    } catch (e) {
      console.error('Could not notify completion: ' + e);
    }
  };

  /**
   * Get a pre-signed URL for a file
   * @param File the file needing a pre signed URL
   * @param string presign URL (the service that does the presigning)
   */
  this.setPresignedUrl = function (file, presignUrl, callback) {
    try {
      var formData = {
        'id': file.id,
        'name': file.name
      };
      var xhrSuccess = function xhrSuccess() {
        if (xhr.status != 200) {
          callback(file, false);
        } else if (xhr.readyState == 4) {
          var response = JSON.parse(xhr.responseText);
          var preSignedUrl = response.presignedurl ? response.presignedurl : false;
          callback(file, preSignedUrl);
        }
      };
      var xhrError = function xhrError() {
        callback(file, false);
      };
      var xhr = new XMLHttpRequest();
      xhr.open('POST', presignUrl);
      xhr.addEventListener('load', xhrSuccess);
      xhr.addEventListener('error', xhrError);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(new URLSearchParams(formData).toString());
    } catch (e) {
      console.error('Could not get presigned url: ' + e);
    }
  };
}
;// ./client/src/js/loader.js
function loader_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? loader_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : loader_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
;


















/**
 * DFU Loader applied to a single DOM Element representing an upload field
 */




function DFULoader(opts) {
  this.uploadElement = opts.uploadElement;
  this.init = function () {};
  this.handle = function () {
    var _this = this;
    this.uploadElement.dfu = new DFU();
    this.uploadElement.dfu.init();
    var config = JSON.parse(this.uploadElement.dataset.config);
    var id = this.uploadElement.id;
    var uploadType = this.uploadElement.dataset.uploadType;
    // default httpMethod is post
    var httpMethod = config.request.method ? config.request.method : 'POST';
    var formData = true;
    var bundle = false;
    switch (httpMethod) {
      case 'PUT':
        formData = false;
        break;
    }
    var meta = {};
    if (_typeof(config.request.params) == 'object') {
      meta = config.request.params;
    }
    var maxFileSize = config.validation.sizeLimit ? config.validation.sizeLimit : null;
    var maxNumFiles = config.validation.itemLimit ? config.validation.itemLimit : null;
    var minNumFiles = null;
    var allowedFileTypes = config.validation.acceptFiles ? config.validation.acceptFiles.split(',') : ['image/*']; // default to images

    var maxImageWidth = config.validation.image.maxWidth ? config.validation.image.maxWidth : 0;
    var maxImageHeight = config.validation.image.maxHeight ? config.validation.image.maxHeight : 0;
    var minImageWidth = config.validation.image.minWidth ? config.validation.image.minWidth : 0;
    var minImageHeight = config.validation.image.minHeight ? config.validation.image.minHeight : 0;
    var restrictions = {
      maxFileSize: maxFileSize,
      maxNumberOfFiles: maxNumFiles,
      minNumberOfFiles: minNumFiles,
      allowedFileTypes: allowedFileTypes
    };
    var notificationUrl = config.urls.notificationUrl ? config.urls.notificationUrl : null;
    var preSignUrlForFile = config.urls.presignUrl ? config.urls.presignUrl : null;
    var uppy = new lib_Uppy({
      id: 'uppy-' + id,
      autoProceed: false,
      allowMultipleUploadBatches: true,
      debug: false,
      meta: meta,
      restrictions: restrictions
    }).use(Dashboard, {
      id: 'dashboard-' + id,
      target: this.uploadElement.querySelector('.dashboard'),
      inline: true,
      width: '100%',
      height: '370px',
      waitForThumbnailsBeforeUpload: true,
      showLinkToFileUploadResult: false,
      proudlyDisplayPoweredByUppy: false,
      showProgressDetails: true,
      replaceTargetContent: true,
      hideProgressAfterFinish: true,
      note: '',
      doneButtonHandler: null
    }).use(XHRUpload, {
      method: httpMethod,
      formData: formData,
      bundle: bundle,
      fieldName: this.uploadElement.dataset.name,
      endpoint: config.request.endpoint,
      shouldRetry: function shouldRetry(xhr) {
        return false;
      }
    });
    uppy.on('upload-success', function (file, response) {
      var uri = '';
      var endpoint = '';
      try {
        endpoint = file.xhrUpload.endpoint ? file.xhrUpload.endpoint : '';
      } catch (e) {
        // no endpoint
      }
      if (endpoint) {
        uri = endpoint;
      } else if (response.body.uuid) {
        uri = response.body.uuid;
      }
      if (notificationUrl) {
        // notify success
        _this.uploadElement.dfu.notify(true, file, response, uri, notificationUrl);
      }
      // Append field when a uri is available
      if (uri) {
        _this.uploadElement.dfu.appendField(_this.uploadElement, file.id, uri);
      }
    });
    uppy.on('upload-error', function (file, response) {
      var uri = '';
      var endpoint = '';
      try {
        file.xhrUpload.endpoint ? file.xhrUpload.endpoint : '';
      } catch (e) {
        // no endpoint
      }
      if (endpoint) {
        uri = endpoint;
      } else if (response.body.uuid) {
        uri = response.body.uuid;
      }
      if (notificationUrl) {
        // notify error
        _this.uploadElement.dfu.notify(false, file, response, uri, notificationUrl);
      }
      // Single upload error
      _this.uploadElement.dfu.removeField(_this.uploadElement, file.id);
    });
    uppy.on('error', function (result) {
      // all error
      _this.uploadElement.dfu.handleUnblock(_this.uploadElement);
    });
    uppy.on('complete', function (result) {
      if (notificationUrl) {
        // ping completion url
        _this.uploadElement.dfu.notifyComplete(result, notificationUrl);
      }
      // all complete
      _this.uploadElement.dfu.handleUnblock(_this.uploadElement);
    });
    uppy.on('cancel-all', function (result) {
      // all cancelled
      _this.uploadElement.dfu.handleUnblock(_this.uploadElement);
    });
    uppy.on('file-removed', function (file, reason) {
      // a file was removed
      var items = uppy.getFiles();
      if (items.length == 0) {
        // all files removed
        _this.uploadElement.dfu.handleUnblock(_this.uploadElement);
      }
    });
    uppy.on('file-added', function (file) {
      // block submit
      _this.uploadElement.dfu.handleSubmit(_this.uploadElement);

      // update pre-signed URLs if required
      if (preSignUrlForFile) {
        // initially clear the endpoint for this file
        uppy.setFileState(file.id, {
          xhrUpload: _objectSpread(_objectSpread({}, file.xhrUpload), {}, {
            endpoint: ''
          })
        });
        _this.uploadElement.dfu.setPresignedUrl(
        // the file
        file,
        // URL to get presigned URLs from
        preSignUrlForFile,
        // callback to set pre-signed URL
        function (file, preSignedUrl) {
          if (preSignedUrl) {
            uppy.setFileState(file.id, {
              xhrUpload: _objectSpread(_objectSpread({}, file.xhrUpload), {}, {
                endpoint: preSignedUrl
              })
            });
          } else {
            // failed to get a presigned URL
            uppy.removeFile(file.id);
            uppy.info({
              message: config.messages.fileCannotBeUploadedError,
              type: 'warning',
              duration: 7500
            });
          }
        });
      }

      // set required file meta
      var meta = {};
      meta[config.request.uuidName] = file.id;
      uppy.setFileMeta(file.id, meta);
      if (_this.uploadElement.dfu.isImage(file.data.type)) {
        // handle image dimension validation
        var data = file.data;
        var url = URL.createObjectURL(data);
        var image = new Image();
        image.src = url;
        image.onload = function () {
          var remove = false;
          var message = config.messages.dimensionsMismatchError;
          if (maxImageWidth > 0 && image.width > maxImageWidth) {
            message = config.messages.maxWidthImageError;
            remove = true;
          } else if (maxImageHeight > 0 && image.height > maxImageHeight) {
            message = config.messages.maxHeightImageError;
            remove = true;
          } else if (minImageWidth > 0 && image.width < minImageWidth) {
            message = config.messages.minWidthImageError;
            remove = true;
          } else if (minImageHeight > 0 && image.height < minImageHeight) {
            message = config.messages.minHeightImageError;
            remove = true;
          }
          if (remove) {
            uppy.removeFile(file.id);
            uppy.info({
              message: message,
              type: 'error',
              duration: 7500
            });
            URL.revokeObjectURL(url);
          }
        };
      }
    });
    var ev = new Event('uploaderReady');
    this.uploadElement.dispatchEvent(ev);
  };
}
;// ./client/src/js/uppy.js






var dfuXHRUploaders = document.querySelectorAll('.dfu-uploader-uppy');
dfuXHRUploaders.forEach(function (dfuXHRUploaderElement) {
  try {
    var dfuLoader = new DFULoader({
      uploadElement: dfuXHRUploaderElement
    });
    dfuLoader.init();
    dfuLoader.handle();
  } catch (e) {
    console.error('Caught uploader error:' + e);
  }
});
})();

// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=uppy.js.map