var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/@uppy/utils/lib/hasProperty.js
var require_hasProperty = __commonJS(function(exports, module) {
  module.exports = function has(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  };
});

// node_modules/@uppy/utils/lib/Translator.js
var require_Translator = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var has = require_hasProperty();
  module.exports = /* @__PURE__ */ function() {
    function Translator(locales) {
      var _this = this;
      this.locale = {
        strings: {},
        pluralize: function pluralize(n) {
          if (n === 1) {
            return 0;
          }
          return 1;
        }
      };
      if (Array.isArray(locales)) {
        locales.forEach(function(locale) {
          return _this._apply(locale);
        });
      } else {
        this._apply(locales);
      }
    }
    var _proto = Translator.prototype;
    _proto._apply = function _apply(locale) {
      if (!locale || !locale.strings) {
        return;
      }
      var prevLocale = this.locale;
      this.locale = _extends({}, prevLocale, {
        strings: _extends({}, prevLocale.strings, locale.strings)
      });
      this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
    };
    _proto.interpolate = function interpolate(phrase, options) {
      var _String$prototype = String.prototype, split = _String$prototype.split, replace = _String$prototype.replace;
      var dollarRegex = /\$/g;
      var dollarBillsYall = "$$$$";
      var interpolated = [phrase];
      for (var arg in options) {
        if (arg !== "_" && has(options, arg)) {
          var replacement = options[arg];
          if (typeof replacement === "string") {
            replacement = replace.call(options[arg], dollarRegex, dollarBillsYall);
          }
          interpolated = insertReplacement(interpolated, new RegExp("%\\{" + arg + "\\}", "g"), replacement);
        }
      }
      return interpolated;
      function insertReplacement(source, rx, replacement2) {
        var newParts = [];
        source.forEach(function(chunk) {
          if (typeof chunk !== "string") {
            return newParts.push(chunk);
          }
          split.call(chunk, rx).forEach(function(raw, i, list) {
            if (raw !== "") {
              newParts.push(raw);
            }
            if (i < list.length - 1) {
              newParts.push(replacement2);
            }
          });
        });
        return newParts;
      }
    };
    _proto.translate = function translate(key, options) {
      return this.translateArray(key, options).join("");
    };
    _proto.translateArray = function translateArray(key, options) {
      if (!has(this.locale.strings, key)) {
        throw new Error("missing string: " + key);
      }
      var string = this.locale.strings[key];
      var hasPluralForms = typeof string === "object";
      if (hasPluralForms) {
        if (options && typeof options.smart_count !== "undefined") {
          var plural = this.locale.pluralize(options.smart_count);
          return this.interpolate(string[plural], options);
        } else {
          throw new Error("Attempted to use a string with plural forms, but no value was given for %{smart_count}");
        }
      }
      return this.interpolate(string, options);
    };
    return Translator;
  }();
});

// node_modules/namespace-emitter/index.js
var require_namespace_emitter = __commonJS(function(exports, module) {
  module.exports = function createNamespaceEmitter() {
    var emitter = {};
    var _fns = emitter._fns = {};
    emitter.emit = function emit(event, arg1, arg2, arg3, arg4, arg5, arg6) {
      var toEmit = getListeners(event);
      if (toEmit.length) {
        emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6]);
      }
    };
    emitter.on = function on(event, fn) {
      if (!_fns[event]) {
        _fns[event] = [];
      }
      _fns[event].push(fn);
    };
    emitter.once = function once(event, fn) {
      function one() {
        fn.apply(this, arguments);
        emitter.off(event, one);
      }
      this.on(event, one);
    };
    emitter.off = function off(event, fn) {
      var keep = [];
      if (event && fn) {
        var fns = this._fns[event];
        var i = 0;
        var l = fns ? fns.length : 0;
        for (i;i < l; i++) {
          if (fns[i] !== fn) {
            keep.push(fns[i]);
          }
        }
      }
      keep.length ? this._fns[event] = keep : delete this._fns[event];
    };
    function getListeners(e) {
      var out = _fns[e] ? _fns[e] : [];
      var idx = e.indexOf(":");
      var args = idx === -1 ? [e] : [e.substring(0, idx), e.substring(idx + 1)];
      var keys = Object.keys(_fns);
      var i = 0;
      var l = keys.length;
      for (i;i < l; i++) {
        var key = keys[i];
        if (key === "*") {
          out = out.concat(_fns[key]);
        }
        if (args.length === 2 && args[0] === key) {
          out = out.concat(_fns[key]);
          break;
        }
      }
      return out;
    }
    function emitAll(e, fns, args) {
      var i = 0;
      var l = fns.length;
      for (i;i < l; i++) {
        if (!fns[i])
          break;
        fns[i].event = e;
        fns[i].apply(fns[i], args);
      }
    }
    return emitter;
  };
});

// node_modules/cuid/lib/pad.js
var require_pad = __commonJS(function(exports, module) {
  module.exports = function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
  };
});

// node_modules/cuid/lib/fingerprint.browser.js
var require_fingerprint_browser = __commonJS(function(exports, module) {
  var pad = require_pad();
  var env = typeof window === "object" ? window : self;
  var globalCount = Object.keys(env).length;
  var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
  var clientId = pad((mimeTypesLength + navigator.userAgent.length).toString(36) + globalCount.toString(36), 4);
  module.exports = function fingerprint() {
    return clientId;
  };
});

// node_modules/cuid/lib/getRandomValue.browser.js
var require_getRandomValue_browser = __commonJS(function(exports, module) {
  var getRandomValue;
  var crypto = window.crypto || window.msCrypto;
  if (crypto) {
    lim = Math.pow(2, 32) - 1;
    getRandomValue = function() {
      return Math.abs(crypto.getRandomValues(new Uint32Array(1))[0] / lim);
    };
  } else {
    getRandomValue = Math.random;
  }
  var lim;
  module.exports = getRandomValue;
});

// node_modules/cuid/index.js
var require_cuid = __commonJS(function(exports, module) {
  var fingerprint = require_fingerprint_browser();
  var pad = require_pad();
  var getRandomValue = require_getRandomValue_browser();
  var c = 0;
  var blockSize = 4;
  var base = 36;
  var discreteValues = Math.pow(base, blockSize);
  function randomBlock() {
    return pad((getRandomValue() * discreteValues << 0).toString(base), blockSize);
  }
  function safeCounter() {
    c = c < discreteValues ? c : 0;
    c++;
    return c - 1;
  }
  function cuid() {
    var letter = "c", timestamp = new Date().getTime().toString(base), counter = pad(safeCounter().toString(base), blockSize), print = fingerprint(), random = randomBlock() + randomBlock();
    return letter + timestamp + counter + print + random;
  }
  cuid.slug = function slug() {
    var date = new Date().getTime().toString(36), counter = safeCounter().toString(36).slice(-4), print = fingerprint().slice(0, 1) + fingerprint().slice(-1), random = randomBlock().slice(-2);
    return date.slice(-2) + counter + print + random;
  };
  cuid.isCuid = function isCuid(stringToCheck) {
    if (typeof stringToCheck !== "string")
      return false;
    if (stringToCheck.startsWith("c"))
      return true;
    return false;
  };
  cuid.isSlug = function isSlug(stringToCheck) {
    if (typeof stringToCheck !== "string")
      return false;
    var stringLength = stringToCheck.length;
    if (stringLength >= 7 && stringLength <= 10)
      return true;
    return false;
  };
  cuid.fingerprint = fingerprint;
  module.exports = cuid;
});

// node_modules/lodash.throttle/index.js
var require_lodash = __commonJS(function(exports, module) {
  var FUNC_ERROR_TEXT = "Expected a function";
  var NAN = 0 / 0;
  var symbolTag = "[object Symbol]";
  var reTrim = /^\s+|\s+$/g;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var objectProto = Object.prototype;
  var objectToString = objectProto.toString;
  var nativeMax = Math.max;
  var nativeMin = Math.min;
  var now = function() {
    return root.Date.now();
  };
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
      return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = undefined;
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
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
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
  function throttle(func, wait, options) {
    var leading = true, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = "leading" in options ? !!options.leading : leading;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      leading,
      maxWait: wait,
      trailing
    });
  }
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  module.exports = throttle;
});

// node_modules/@transloadit/prettier-bytes/prettierBytes.js
var require_prettierBytes = __commonJS(function(exports, module) {
  module.exports = function prettierBytes(num) {
    if (typeof num !== "number" || isNaN(num)) {
      throw new TypeError("Expected a number, got " + typeof num);
    }
    var neg = num < 0;
    var units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    if (neg) {
      num = -num;
    }
    if (num < 1) {
      return (neg ? "-" : "") + num + " B";
    }
    var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
    num = Number(num / Math.pow(1024, exponent));
    var unit = units[exponent];
    if (num >= 10 || num % 1 === 0) {
      return (neg ? "-" : "") + num.toFixed(0) + " " + unit;
    } else {
      return (neg ? "-" : "") + num.toFixed(1) + " " + unit;
    }
  };
});

// node_modules/wildcard/index.js
var require_wildcard = __commonJS(function(exports, module) {
  function WildcardMatcher(text, separator) {
    this.text = text = text || "";
    this.hasWild = ~text.indexOf("*");
    this.separator = separator;
    this.parts = text.split(separator);
  }
  WildcardMatcher.prototype.match = function(input) {
    var matches = true;
    var parts = this.parts;
    var ii;
    var partsCount = parts.length;
    var testParts;
    if (typeof input == "string" || input instanceof String) {
      if (!this.hasWild && this.text != input) {
        matches = false;
      } else {
        testParts = (input || "").split(this.separator);
        for (ii = 0;matches && ii < partsCount; ii++) {
          if (parts[ii] === "*") {
            continue;
          } else if (ii < testParts.length) {
            matches = parts[ii] === testParts[ii];
          } else {
            matches = false;
          }
        }
        matches = matches && testParts;
      }
    } else if (typeof input.splice == "function") {
      matches = [];
      for (ii = input.length;ii--; ) {
        if (this.match(input[ii])) {
          matches[matches.length] = input[ii];
        }
      }
    } else if (typeof input == "object") {
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
    if (typeof test != "undefined") {
      return matcher.match(test);
    }
    return matcher;
  };
});

// node_modules/mime-match/index.js
var require_mime_match = __commonJS(function(exports, module) {
  var wildcard = require_wildcard();
  var reMimePartSplit = /[\/\+\.]/;
  module.exports = function(target, pattern) {
    function test(pattern2) {
      var result = wildcard(pattern2, target, reMimePartSplit);
      return result && result.length >= 2;
    }
    return pattern ? test(pattern.split(";")[0]) : test;
  };
});

// node_modules/@uppy/store-default/lib/index.js
var require_lib = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var DefaultStore = /* @__PURE__ */ function() {
    function DefaultStore2() {
      this.state = {};
      this.callbacks = [];
    }
    var _proto = DefaultStore2.prototype;
    _proto.getState = function getState() {
      return this.state;
    };
    _proto.setState = function setState(patch) {
      var prevState = _extends({}, this.state);
      var nextState = _extends({}, this.state, patch);
      this.state = nextState;
      this._publish(prevState, nextState, patch);
    };
    _proto.subscribe = function subscribe(listener) {
      var _this = this;
      this.callbacks.push(listener);
      return function() {
        _this.callbacks.splice(_this.callbacks.indexOf(listener), 1);
      };
    };
    _proto._publish = function _publish() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0;_key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this.callbacks.forEach(function(listener) {
        listener.apply(undefined, args);
      });
    };
    return DefaultStore2;
  }();
  DefaultStore.VERSION = "1.2.3";
  module.exports = function defaultStore() {
    return new DefaultStore;
  };
});

// node_modules/@uppy/utils/lib/getFileNameAndExtension.js
var require_getFileNameAndExtension = __commonJS(function(exports, module) {
  module.exports = function getFileNameAndExtension(fullFileName) {
    var lastDot = fullFileName.lastIndexOf(".");
    if (lastDot === -1 || lastDot === fullFileName.length - 1) {
      return {
        name: fullFileName,
        extension: undefined
      };
    } else {
      return {
        name: fullFileName.slice(0, lastDot),
        extension: fullFileName.slice(lastDot + 1)
      };
    }
  };
});

// node_modules/@uppy/utils/lib/mimeTypes.js
var require_mimeTypes = __commonJS(function(exports, module) {
  module.exports = {
    md: "text/markdown",
    markdown: "text/markdown",
    mp4: "video/mp4",
    mp3: "audio/mp3",
    svg: "image/svg+xml",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    heic: "image/heic",
    heif: "image/heif",
    yaml: "text/yaml",
    yml: "text/yaml",
    csv: "text/csv",
    tsv: "text/tab-separated-values",
    tab: "text/tab-separated-values",
    avi: "video/x-msvideo",
    mks: "video/x-matroska",
    mkv: "video/x-matroska",
    mov: "video/quicktime",
    doc: "application/msword",
    docm: "application/vnd.ms-word.document.macroenabled.12",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    dot: "application/msword",
    dotm: "application/vnd.ms-word.template.macroenabled.12",
    dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    xla: "application/vnd.ms-excel",
    xlam: "application/vnd.ms-excel.addin.macroenabled.12",
    xlc: "application/vnd.ms-excel",
    xlf: "application/x-xliff+xml",
    xlm: "application/vnd.ms-excel",
    xls: "application/vnd.ms-excel",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroenabled.12",
    xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xlt: "application/vnd.ms-excel",
    xltm: "application/vnd.ms-excel.template.macroenabled.12",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    xlw: "application/vnd.ms-excel",
    txt: "text/plain",
    text: "text/plain",
    conf: "text/plain",
    log: "text/plain",
    pdf: "application/pdf"
  };
});

// node_modules/@uppy/utils/lib/getFileType.js
var require_getFileType = __commonJS(function(exports, module) {
  var getFileNameAndExtension = require_getFileNameAndExtension();
  var mimeTypes = require_mimeTypes();
  module.exports = function getFileType(file) {
    var fileExtension = file.name ? getFileNameAndExtension(file.name).extension : null;
    fileExtension = fileExtension ? fileExtension.toLowerCase() : null;
    if (file.type) {
      return file.type;
    } else if (fileExtension && mimeTypes[fileExtension]) {
      return mimeTypes[fileExtension];
    } else {
      return "application/octet-stream";
    }
  };
});

// node_modules/@uppy/utils/lib/generateFileID.js
var require_generateFileID = __commonJS(function(exports, module) {
  module.exports = function generateFileID(file) {
    var id = "uppy";
    if (typeof file.name === "string") {
      id += "-" + encodeFilename(file.name.toLowerCase());
    }
    if (file.type !== undefined) {
      id += "-" + file.type;
    }
    if (file.meta && typeof file.meta.relativePath === "string") {
      id += "-" + encodeFilename(file.meta.relativePath.toLowerCase());
    }
    if (file.data.size !== undefined) {
      id += "-" + file.data.size;
    }
    if (file.data.lastModified !== undefined) {
      id += "-" + file.data.lastModified;
    }
    return id;
  };
  function encodeFilename(name) {
    var suffix = "";
    return name.replace(/[^A-Z0-9]/ig, function(character) {
      suffix += "-" + encodeCharacter(character);
      return "/";
    }) + suffix;
  }
  function encodeCharacter(character) {
    return character.charCodeAt(0).toString(32);
  }
});

// node_modules/@uppy/core/lib/supportsUploadProgress.js
var require_supportsUploadProgress = __commonJS(function(exports, module) {
  module.exports = function supportsUploadProgress(userAgent) {
    if (userAgent == null) {
      userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null;
    }
    if (!userAgent)
      return true;
    var m = /Edge\/(\d+\.\d+)/.exec(userAgent);
    if (!m)
      return true;
    var edgeVersion = m[1];
    var _edgeVersion$split = edgeVersion.split("."), major = _edgeVersion$split[0], minor = _edgeVersion$split[1];
    major = parseInt(major, 10);
    minor = parseInt(minor, 10);
    if (major < 15 || major === 15 && minor < 15063) {
      return true;
    }
    if (major > 18 || major === 18 && minor >= 18218) {
      return true;
    }
    return false;
  };
});

// node_modules/@uppy/utils/lib/getTimeStamp.js
var require_getTimeStamp = __commonJS(function(exports, module) {
  module.exports = function getTimeStamp() {
    var date = new Date;
    var hours = pad(date.getHours().toString());
    var minutes = pad(date.getMinutes().toString());
    var seconds = pad(date.getSeconds().toString());
    return hours + ":" + minutes + ":" + seconds;
  };
  function pad(str) {
    return str.length !== 2 ? 0 + str : str;
  }
});

// node_modules/@uppy/core/lib/loggers.js
var require_loggers = __commonJS(function(exports, module) {
  var getTimeStamp = require_getTimeStamp();
  var justErrorsLogger = {
    debug: function debug() {},
    warn: function warn() {},
    error: function error() {
      var _console;
      for (var _len = arguments.length, args = new Array(_len), _key = 0;_key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return (_console = console).error.apply(_console, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
    }
  };
  var debugLogger = {
    debug: function debug() {
      var debug2 = console.debug || console.log;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;_key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      debug2.call.apply(debug2, [console, "[Uppy] [" + getTimeStamp() + "]"].concat(args));
    },
    warn: function warn() {
      var _console2;
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;_key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return (_console2 = console).warn.apply(_console2, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
    },
    error: function error() {
      var _console3;
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0;_key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return (_console3 = console).error.apply(_console3, ["[Uppy] [" + getTimeStamp() + "]"].concat(args));
    }
  };
  module.exports = {
    justErrorsLogger,
    debugLogger
  };
});

// node_modules/preact/dist/preact.js
var require_preact = __commonJS(function(exports, module) {
  (function() {
    function VNode() {}
    function h2(nodeName, attributes) {
      var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
      for (i = arguments.length;i-- > 2; )
        stack.push(arguments[i]);
      if (attributes && attributes.children != null) {
        if (!stack.length)
          stack.push(attributes.children);
        delete attributes.children;
      }
      while (stack.length)
        if ((child = stack.pop()) && child.pop !== undefined)
          for (i = child.length;i--; )
            stack.push(child[i]);
        else {
          if (typeof child == "boolean")
            child = null;
          if (simple = typeof nodeName != "function") {
            if (child == null)
              child = "";
            else if (typeof child == "number")
              child = String(child);
            else if (typeof child != "string")
              simple = false;
          }
          if (simple && lastSimple)
            children[children.length - 1] += child;
          else if (children === EMPTY_CHILDREN)
            children = [child];
          else
            children.push(child);
          lastSimple = simple;
        }
      var p = new VNode;
      p.nodeName = nodeName;
      p.children = children;
      p.attributes = attributes == null ? undefined : attributes;
      p.key = attributes == null ? undefined : attributes.key;
      if (options.vnode !== undefined)
        options.vnode(p);
      return p;
    }
    function extend(obj, props) {
      for (var i in props)
        obj[i] = props[i];
      return obj;
    }
    function cloneElement(vnode, props) {
      return h2(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function enqueueRender(component) {
      if (!component.__d && (component.__d = true) && items.push(component) == 1)
        (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
      var p, list = items;
      items = [];
      while (p = list.pop())
        if (p.__d)
          renderComponent(p);
    }
    function isSameNodeType(node, vnode, hydrating2) {
      if (typeof vnode == "string" || typeof vnode == "number")
        return node.splitText !== undefined;
      if (typeof vnode.nodeName == "string")
        return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
      else
        return hydrating2 || node._componentConstructor === vnode.nodeName;
    }
    function isNamedNode(node, nodeName) {
      return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }
    function getNodeProps(vnode) {
      var props = extend({}, vnode.attributes);
      props.children = vnode.children;
      var defaultProps = vnode.nodeName.defaultProps;
      if (defaultProps !== undefined) {
        for (var i in defaultProps)
          if (props[i] === undefined)
            props[i] = defaultProps[i];
      }
      return props;
    }
    function createNode(nodeName, isSvg) {
      var node = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", nodeName) : document.createElement(nodeName);
      node.__n = nodeName;
      return node;
    }
    function removeNode(node) {
      var parentNode = node.parentNode;
      if (parentNode)
        parentNode.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
      if (name === "className")
        name = "class";
      if (name === "key")
        ;
      else if (name === "ref") {
        if (old)
          old(null);
        if (value)
          value(node);
      } else if (name === "class" && !isSvg)
        node.className = value || "";
      else if (name === "style") {
        if (!value || typeof value == "string" || typeof old == "string")
          node.style.cssText = value || "";
        if (value && typeof value == "object") {
          if (typeof old != "string") {
            for (var i in old)
              if (!(i in value))
                node.style[i] = "";
          }
          for (var i in value)
            node.style[i] = typeof value[i] == "number" && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + "px" : value[i];
        }
      } else if (name === "dangerouslySetInnerHTML") {
        if (value)
          node.innerHTML = value.__html || "";
      } else if (name[0] == "o" && name[1] == "n") {
        var useCapture = name !== (name = name.replace(/Capture$/, ""));
        name = name.toLowerCase().substring(2);
        if (value) {
          if (!old)
            node.addEventListener(name, eventProxy, useCapture);
        } else
          node.removeEventListener(name, eventProxy, useCapture);
        (node.__l || (node.__l = {}))[name] = value;
      } else if (name !== "list" && name !== "type" && !isSvg && name in node) {
        setProperty(node, name, value == null ? "" : value);
        if (value == null || value === false)
          node.removeAttribute(name);
      } else {
        var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""));
        if (value == null || value === false)
          if (ns)
            node.removeAttributeNS("http://www.w3.org/1999/xlink", name.toLowerCase());
          else
            node.removeAttribute(name);
        else if (typeof value != "function")
          if (ns)
            node.setAttributeNS("http://www.w3.org/1999/xlink", name.toLowerCase(), value);
          else
            node.setAttribute(name, value);
      }
    }
    function setProperty(node, name, value) {
      try {
        node[name] = value;
      } catch (e) {}
    }
    function eventProxy(e) {
      return this.__l[e.type](options.event && options.event(e) || e);
    }
    function flushMounts() {
      var c;
      while (c = mounts.pop()) {
        if (options.afterMount)
          options.afterMount(c);
        if (c.componentDidMount)
          c.componentDidMount();
      }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
      if (!diffLevel++) {
        isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
        hydrating = dom != null && !("__preactattr_" in dom);
      }
      var ret = idiff(dom, vnode, context, mountAll, componentRoot);
      if (parent && ret.parentNode !== parent)
        parent.appendChild(ret);
      if (!--diffLevel) {
        hydrating = false;
        if (!componentRoot)
          flushMounts();
      }
      return ret;
    }
    function idiff(dom, vnode, context, mountAll, componentRoot) {
      var out = dom, prevSvgMode = isSvgMode;
      if (vnode == null || typeof vnode == "boolean")
        vnode = "";
      if (typeof vnode == "string" || typeof vnode == "number") {
        if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
          if (dom.nodeValue != vnode)
            dom.nodeValue = vnode;
        } else {
          out = document.createTextNode(vnode);
          if (dom) {
            if (dom.parentNode)
              dom.parentNode.replaceChild(out, dom);
            recollectNodeTree(dom, true);
          }
        }
        out.__preactattr_ = true;
        return out;
      }
      var vnodeName = vnode.nodeName;
      if (typeof vnodeName == "function")
        return buildComponentFromVNode(dom, vnode, context, mountAll);
      isSvgMode = vnodeName === "svg" ? true : vnodeName === "foreignObject" ? false : isSvgMode;
      vnodeName = String(vnodeName);
      if (!dom || !isNamedNode(dom, vnodeName)) {
        out = createNode(vnodeName, isSvgMode);
        if (dom) {
          while (dom.firstChild)
            out.appendChild(dom.firstChild);
          if (dom.parentNode)
            dom.parentNode.replaceChild(out, dom);
          recollectNodeTree(dom, true);
        }
      }
      var { firstChild: fc, __preactattr_: props } = out, vchildren = vnode.children;
      if (props == null) {
        props = out.__preactattr_ = {};
        for (var a = out.attributes, i = a.length;i--; )
          props[a[i].name] = a[i].value;
      }
      if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] == "string" && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
        if (fc.nodeValue != vchildren[0])
          fc.nodeValue = vchildren[0];
      } else if (vchildren && vchildren.length || fc != null)
        innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
      diffAttributes(out, vnode.attributes, props);
      isSvgMode = prevSvgMode;
      return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
      var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
      if (len !== 0)
        for (var i = 0;i < len; i++) {
          var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
          if (key != null) {
            keyedLen++;
            keyed[key] = _child;
          } else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating))
            children[childrenLen++] = _child;
        }
      if (vlen !== 0)
        for (var i = 0;i < vlen; i++) {
          vchild = vchildren[i];
          child = null;
          var key = vchild.key;
          if (key != null) {
            if (keyedLen && keyed[key] !== undefined) {
              child = keyed[key];
              keyed[key] = undefined;
              keyedLen--;
            }
          } else if (!child && min < childrenLen) {
            for (j = min;j < childrenLen; j++)
              if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
                child = c;
                children[j] = undefined;
                if (j === childrenLen - 1)
                  childrenLen--;
                if (j === min)
                  min++;
                break;
              }
          }
          child = idiff(child, vchild, context, mountAll);
          f = originalChildren[i];
          if (child && child !== dom && child !== f)
            if (f == null)
              dom.appendChild(child);
            else if (child === f.nextSibling)
              removeNode(f);
            else
              dom.insertBefore(child, f);
        }
      if (keyedLen) {
        for (var i in keyed)
          if (keyed[i] !== undefined)
            recollectNodeTree(keyed[i], false);
      }
      while (min <= childrenLen)
        if ((child = children[childrenLen--]) !== undefined)
          recollectNodeTree(child, false);
    }
    function recollectNodeTree(node, unmountOnly) {
      var component = node._component;
      if (component)
        unmountComponent(component);
      else {
        if (node.__preactattr_ != null && node.__preactattr_.ref)
          node.__preactattr_.ref(null);
        if (unmountOnly === false || node.__preactattr_ == null)
          removeNode(node);
        removeChildren(node);
      }
    }
    function removeChildren(node) {
      node = node.lastChild;
      while (node) {
        var next = node.previousSibling;
        recollectNodeTree(node, true);
        node = next;
      }
    }
    function diffAttributes(dom, attrs, old) {
      var name;
      for (name in old)
        if ((!attrs || attrs[name] == null) && old[name] != null)
          setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
      for (name in attrs)
        if (!(name === "children" || name === "innerHTML" || (name in old) && attrs[name] === (name === "value" || name === "checked" ? dom[name] : old[name])))
          setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
      var name = component.constructor.name;
      (components[name] || (components[name] = [])).push(component);
    }
    function createComponent(Ctor, props, context) {
      var inst, list = components[Ctor.name];
      if (Ctor.prototype && Ctor.prototype.render) {
        inst = new Ctor(props, context);
        Component.call(inst, props, context);
      } else {
        inst = new Component(props, context);
        inst.constructor = Ctor;
        inst.render = doRender;
      }
      if (list) {
        for (var i = list.length;i--; )
          if (list[i].constructor === Ctor) {
            inst.__b = list[i].__b;
            list.splice(i, 1);
            break;
          }
      }
      return inst;
    }
    function doRender(props, state, context) {
      return this.constructor(props, context);
    }
    function setComponentProps(component, props, opts, context, mountAll) {
      if (!component.__x) {
        component.__x = true;
        if (component.__r = props.ref)
          delete props.ref;
        if (component.__k = props.key)
          delete props.key;
        if (!component.base || mountAll) {
          if (component.componentWillMount)
            component.componentWillMount();
        } else if (component.componentWillReceiveProps)
          component.componentWillReceiveProps(props, context);
        if (context && context !== component.context) {
          if (!component.__c)
            component.__c = component.context;
          component.context = context;
        }
        if (!component.__p)
          component.__p = component.props;
        component.props = props;
        component.__x = false;
        if (opts !== 0)
          if (opts === 1 || options.syncComponentUpdates !== false || !component.base)
            renderComponent(component, 1, mountAll);
          else
            enqueueRender(component);
        if (component.__r)
          component.__r(component);
      }
    }
    function renderComponent(component, opts, mountAll, isChild) {
      if (!component.__x) {
        var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = false;
        if (isUpdate) {
          component.props = previousProps;
          component.state = previousState;
          component.context = previousContext;
          if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false)
            skip = true;
          else if (component.componentWillUpdate)
            component.componentWillUpdate(props, state, context);
          component.props = props;
          component.state = state;
          component.context = context;
        }
        component.__p = component.__s = component.__c = component.__b = null;
        component.__d = false;
        if (!skip) {
          rendered = component.render(props, state, context);
          if (component.getChildContext)
            context = extend(extend({}, context), component.getChildContext());
          var toUnmount, base, childComponent = rendered && rendered.nodeName;
          if (typeof childComponent == "function") {
            var childProps = getNodeProps(rendered);
            inst = initialChildComponent;
            if (inst && inst.constructor === childComponent && childProps.key == inst.__k)
              setComponentProps(inst, childProps, 1, context, false);
            else {
              toUnmount = inst;
              component._component = inst = createComponent(childComponent, childProps, context);
              inst.__b = inst.__b || nextBase;
              inst.__u = component;
              setComponentProps(inst, childProps, 0, context, false);
              renderComponent(inst, 1, mountAll, true);
            }
            base = inst.base;
          } else {
            cbase = initialBase;
            toUnmount = initialChildComponent;
            if (toUnmount)
              cbase = component._component = null;
            if (initialBase || opts === 1) {
              if (cbase)
                cbase._component = null;
              base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
            }
          }
          if (initialBase && base !== initialBase && inst !== initialChildComponent) {
            var baseParent = initialBase.parentNode;
            if (baseParent && base !== baseParent) {
              baseParent.replaceChild(base, initialBase);
              if (!toUnmount) {
                initialBase._component = null;
                recollectNodeTree(initialBase, false);
              }
            }
          }
          if (toUnmount)
            unmountComponent(toUnmount);
          component.base = base;
          if (base && !isChild) {
            var componentRef = component, t = component;
            while (t = t.__u)
              (componentRef = t).base = base;
            base._component = componentRef;
            base._componentConstructor = componentRef.constructor;
          }
        }
        if (!isUpdate || mountAll)
          mounts.unshift(component);
        else if (!skip) {
          if (component.componentDidUpdate)
            component.componentDidUpdate(previousProps, previousState, previousContext);
          if (options.afterUpdate)
            options.afterUpdate(component);
        }
        if (component.__h != null)
          while (component.__h.length)
            component.__h.pop().call(component);
        if (!diffLevel && !isChild)
          flushMounts();
      }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
      var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
      while (c && !isOwner && (c = c.__u))
        isOwner = c.constructor === vnode.nodeName;
      if (c && isOwner && (!mountAll || c._component)) {
        setComponentProps(c, props, 3, context, mountAll);
        dom = c.base;
      } else {
        if (originalComponent && !isDirectOwner) {
          unmountComponent(originalComponent);
          dom = oldDom = null;
        }
        c = createComponent(vnode.nodeName, props, context);
        if (dom && !c.__b) {
          c.__b = dom;
          oldDom = null;
        }
        setComponentProps(c, props, 1, context, mountAll);
        dom = c.base;
        if (oldDom && dom !== oldDom) {
          oldDom._component = null;
          recollectNodeTree(oldDom, false);
        }
      }
      return dom;
    }
    function unmountComponent(component) {
      if (options.beforeUnmount)
        options.beforeUnmount(component);
      var base = component.base;
      component.__x = true;
      if (component.componentWillUnmount)
        component.componentWillUnmount();
      component.base = null;
      var inner = component._component;
      if (inner)
        unmountComponent(inner);
      else if (base) {
        if (base.__preactattr_ && base.__preactattr_.ref)
          base.__preactattr_.ref(null);
        component.__b = base;
        removeNode(base);
        collectComponent(component);
        removeChildren(base);
      }
      if (component.__r)
        component.__r(null);
    }
    function Component(props, context) {
      this.__d = true;
      this.context = context;
      this.props = props;
      this.state = this.state || {};
    }
    function render(vnode, parent, merge) {
      return diff(merge, vnode, {}, false, parent, false);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var defer = typeof Promise == "function" ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var items = [];
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = false;
    var hydrating = false;
    var components = {};
    extend(Component.prototype, {
      setState: function(state, callback) {
        var s = this.state;
        if (!this.__s)
          this.__s = extend({}, s);
        extend(s, typeof state == "function" ? state(s, this.props) : state);
        if (callback)
          (this.__h = this.__h || []).push(callback);
        enqueueRender(this);
      },
      forceUpdate: function(callback) {
        if (callback)
          (this.__h = this.__h || []).push(callback);
        renderComponent(this, 2);
      },
      render: function() {}
    });
    var preact = {
      h: h2,
      createElement: h2,
      cloneElement,
      Component,
      render,
      rerender,
      options
    };
    if (typeof module != "undefined")
      module.exports = preact;
    else
      self.preact = preact;
  })();
});

// node_modules/@uppy/utils/lib/isDOMElement.js
var require_isDOMElement = __commonJS(function(exports, module) {
  module.exports = function isDOMElement(obj) {
    return obj && typeof obj === "object" && obj.nodeType === Node.ELEMENT_NODE;
  };
});

// node_modules/@uppy/utils/lib/findDOMElement.js
var require_findDOMElement = __commonJS(function(exports, module) {
  var isDOMElement = require_isDOMElement();
  module.exports = function findDOMElement(element, context) {
    if (context === undefined) {
      context = document;
    }
    if (typeof element === "string") {
      return context.querySelector(element);
    }
    if (isDOMElement(element)) {
      return element;
    }
  };
});

// node_modules/@uppy/core/lib/Plugin.js
var require_Plugin = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var preact = require_preact();
  var findDOMElement = require_findDOMElement();
  function debounce(fn) {
    var calling = null;
    var latestArgs = null;
    return function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0;_key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      latestArgs = args;
      if (!calling) {
        calling = Promise.resolve().then(function() {
          calling = null;
          return fn.apply(undefined, latestArgs);
        });
      }
      return calling;
    };
  }
  module.exports = /* @__PURE__ */ function() {
    function Plugin(uppy, opts) {
      this.uppy = uppy;
      this.opts = opts || {};
      this.update = this.update.bind(this);
      this.mount = this.mount.bind(this);
      this.install = this.install.bind(this);
      this.uninstall = this.uninstall.bind(this);
    }
    var _proto = Plugin.prototype;
    _proto.getPluginState = function getPluginState() {
      var _this$uppy$getState = this.uppy.getState(), plugins = _this$uppy$getState.plugins;
      return plugins[this.id] || {};
    };
    _proto.setPluginState = function setPluginState(update) {
      var _extends2;
      var _this$uppy$getState2 = this.uppy.getState(), plugins = _this$uppy$getState2.plugins;
      this.uppy.setState({
        plugins: _extends({}, plugins, (_extends2 = {}, _extends2[this.id] = _extends({}, plugins[this.id], update), _extends2))
      });
    };
    _proto.setOptions = function setOptions(newOpts) {
      this.opts = _extends({}, this.opts, newOpts);
      this.setPluginState();
    };
    _proto.update = function update(state) {
      if (typeof this.el === "undefined") {
        return;
      }
      if (this._updateUI) {
        this._updateUI(state);
      }
    };
    _proto.afterUpdate = function afterUpdate() {};
    _proto.onMount = function onMount() {};
    _proto.mount = function mount(target, plugin) {
      var _this = this;
      var callerPluginName = plugin.id;
      var targetElement = findDOMElement(target);
      if (targetElement) {
        this.isTargetDOMEl = true;
        this.rerender = function(state) {
          if (!_this.uppy.getPlugin(_this.id))
            return;
          _this.el = preact.render(_this.render(state), targetElement, _this.el);
          _this.afterUpdate();
        };
        this._updateUI = debounce(this.rerender);
        this.uppy.log("Installing " + callerPluginName + " to a DOM element '" + target + "'");
        if (this.opts.replaceTargetContent) {
          targetElement.innerHTML = "";
        }
        this.el = preact.render(this.render(this.uppy.getState()), targetElement);
        this.onMount();
        return this.el;
      }
      var targetPlugin;
      if (typeof target === "object" && target instanceof Plugin) {
        targetPlugin = target;
      } else if (typeof target === "function") {
        var Target = target;
        this.uppy.iteratePlugins(function(plugin2) {
          if (plugin2 instanceof Target) {
            targetPlugin = plugin2;
            return false;
          }
        });
      }
      if (targetPlugin) {
        this.uppy.log("Installing " + callerPluginName + " to " + targetPlugin.id);
        this.parent = targetPlugin;
        this.el = targetPlugin.addTarget(plugin);
        this.onMount();
        return this.el;
      }
      this.uppy.log("Not installing " + callerPluginName);
      var message = "Invalid target option given to " + callerPluginName + ".";
      if (typeof target === "function") {
        message += " The given target is not a Plugin class. " + "Please check that you're not specifying a React Component instead of a plugin. " + "If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: " + "run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.";
      } else {
        message += "If you meant to target an HTML element, please make sure that the element exists. " + "Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. " + `(see https://github.com/transloadit/uppy/issues/1042)

` + "If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.";
      }
      throw new Error(message);
    };
    _proto.render = function render(state) {
      throw new Error("Extend the render method to add your plugin to a DOM element");
    };
    _proto.addTarget = function addTarget(plugin) {
      throw new Error("Extend the addTarget method to add your plugin to another plugin's target");
    };
    _proto.unmount = function unmount() {
      if (this.isTargetDOMEl && this.el && this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
    };
    _proto.install = function install() {};
    _proto.uninstall = function uninstall() {
      this.unmount();
    };
    return Plugin;
  }();
});

// node_modules/@uppy/core/lib/index.js
var require_lib2 = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _defineProperties(target, props) {
    for (var i = 0;i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map : undefined;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor;
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  var Translator = require_Translator();
  var ee = require_namespace_emitter();
  var cuid = require_cuid();
  var throttle = require_lodash();
  var prettierBytes = require_prettierBytes();
  var match = require_mime_match();
  var DefaultStore = require_lib();
  var getFileType = require_getFileType();
  var getFileNameAndExtension = require_getFileNameAndExtension();
  var generateFileID = require_generateFileID();
  var supportsUploadProgress = require_supportsUploadProgress();
  var _require = require_loggers();
  var justErrorsLogger = _require.justErrorsLogger;
  var debugLogger = _require.debugLogger;
  var Plugin = require_Plugin();
  var RestrictionError = /* @__PURE__ */ function(_Error) {
    _inheritsLoose(RestrictionError2, _Error);
    function RestrictionError2() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0;_key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _Error.call.apply(_Error, [this].concat(args)) || this;
      _this.isRestriction = true;
      return _this;
    }
    return RestrictionError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));
  var Uppy = /* @__PURE__ */ function() {
    function Uppy2(opts) {
      var _this2 = this;
      this.defaultLocale = {
        strings: {
          addBulkFilesFailed: {
            0: "Failed to add %{smart_count} file due to an internal error",
            1: "Failed to add %{smart_count} files due to internal errors"
          },
          youCanOnlyUploadX: {
            0: "You can only upload %{smart_count} file",
            1: "You can only upload %{smart_count} files"
          },
          youHaveToAtLeastSelectX: {
            0: "You have to select at least %{smart_count} file",
            1: "You have to select at least %{smart_count} files"
          },
          exceedsSize2: "%{backwardsCompat} %{size}",
          exceedsSize: "This file exceeds maximum allowed size of",
          inferiorSize: "This file is smaller than the allowed size of %{size}",
          youCanOnlyUploadFileTypes: "You can only upload: %{types}",
          noNewAlreadyUploading: "Cannot add new files: already uploading",
          noDuplicates: "Cannot add the duplicate file '%{fileName}', it already exists",
          companionError: "Connection with Companion failed",
          companionUnauthorizeHint: "To unauthorize to your %{provider} account, please go to %{url}",
          failedToUpload: "Failed to upload %{file}",
          noInternetConnection: "No Internet connection",
          connectedToInternet: "Connected to the Internet",
          noFilesFound: "You have no files or folders here",
          selectX: {
            0: "Select %{smart_count}",
            1: "Select %{smart_count}"
          },
          selectAllFilesFromFolderNamed: "Select all files from folder %{name}",
          unselectAllFilesFromFolderNamed: "Unselect all files from folder %{name}",
          selectFileNamed: "Select file %{name}",
          unselectFileNamed: "Unselect file %{name}",
          openFolderNamed: "Open folder %{name}",
          cancel: "Cancel",
          logOut: "Log out",
          filter: "Filter",
          resetFilter: "Reset filter",
          loading: "Loading...",
          authenticateWithTitle: "Please authenticate with %{pluginName} to select files",
          authenticateWith: "Connect to %{pluginName}",
          emptyFolderAdded: "No files were added from empty folder",
          folderAdded: {
            0: "Added %{smart_count} file from %{folder}",
            1: "Added %{smart_count} files from %{folder}"
          }
        }
      };
      var defaultOptions = {
        id: "uppy",
        autoProceed: false,
        allowMultipleUploads: true,
        debug: false,
        restrictions: {
          maxFileSize: null,
          minFileSize: null,
          maxNumberOfFiles: null,
          minNumberOfFiles: null,
          allowedFileTypes: null
        },
        meta: {},
        onBeforeFileAdded: function onBeforeFileAdded(currentFile, files) {
          return currentFile;
        },
        onBeforeUpload: function onBeforeUpload(files) {
          return files;
        },
        store: DefaultStore(),
        logger: justErrorsLogger
      };
      this.opts = _extends({}, defaultOptions, opts, {
        restrictions: _extends({}, defaultOptions.restrictions, opts && opts.restrictions)
      });
      if (opts && opts.logger && opts.debug) {
        this.log("You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.", "warning");
      } else if (opts && opts.debug) {
        this.opts.logger = debugLogger;
      }
      this.log("Using Core v" + this.constructor.VERSION);
      if (this.opts.restrictions.allowedFileTypes && this.opts.restrictions.allowedFileTypes !== null && !Array.isArray(this.opts.restrictions.allowedFileTypes)) {
        throw new TypeError("`restrictions.allowedFileTypes` must be an array");
      }
      this.i18nInit();
      this.plugins = {};
      this.getState = this.getState.bind(this);
      this.getPlugin = this.getPlugin.bind(this);
      this.setFileMeta = this.setFileMeta.bind(this);
      this.setFileState = this.setFileState.bind(this);
      this.log = this.log.bind(this);
      this.info = this.info.bind(this);
      this.hideInfo = this.hideInfo.bind(this);
      this.addFile = this.addFile.bind(this);
      this.removeFile = this.removeFile.bind(this);
      this.pauseResume = this.pauseResume.bind(this);
      this._calculateProgress = throttle(this._calculateProgress.bind(this), 500, {
        leading: true,
        trailing: true
      });
      this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
      this.resetProgress = this.resetProgress.bind(this);
      this.pauseAll = this.pauseAll.bind(this);
      this.resumeAll = this.resumeAll.bind(this);
      this.retryAll = this.retryAll.bind(this);
      this.cancelAll = this.cancelAll.bind(this);
      this.retryUpload = this.retryUpload.bind(this);
      this.upload = this.upload.bind(this);
      this.emitter = ee();
      this.on = this.on.bind(this);
      this.off = this.off.bind(this);
      this.once = this.emitter.once.bind(this.emitter);
      this.emit = this.emitter.emit.bind(this.emitter);
      this.preProcessors = [];
      this.uploaders = [];
      this.postProcessors = [];
      this.store = this.opts.store;
      this.setState({
        plugins: {},
        files: {},
        currentUploads: {},
        allowNewUpload: true,
        capabilities: {
          uploadProgress: supportsUploadProgress(),
          individualCancellation: true,
          resumableUploads: false
        },
        totalProgress: 0,
        meta: _extends({}, this.opts.meta),
        info: {
          isHidden: true,
          type: "info",
          message: ""
        }
      });
      this._storeUnsubscribe = this.store.subscribe(function(prevState, nextState, patch) {
        _this2.emit("state-update", prevState, nextState, patch);
        _this2.updateAll(nextState);
      });
      if (this.opts.debug && typeof window !== "undefined") {
        window[this.opts.id] = this;
      }
      this._addListeners();
    }
    var _proto = Uppy2.prototype;
    _proto.on = function on(event, callback) {
      this.emitter.on(event, callback);
      return this;
    };
    _proto.off = function off(event, callback) {
      this.emitter.off(event, callback);
      return this;
    };
    _proto.updateAll = function updateAll(state) {
      this.iteratePlugins(function(plugin) {
        plugin.update(state);
      });
    };
    _proto.setState = function setState(patch) {
      this.store.setState(patch);
    };
    _proto.getState = function getState() {
      return this.store.getState();
    };
    _proto.setFileState = function setFileState(fileID, state) {
      var _extends2;
      if (!this.getState().files[fileID]) {
        throw new Error("Can’t set state for " + fileID + " (the file could have been removed)");
      }
      this.setState({
        files: _extends({}, this.getState().files, (_extends2 = {}, _extends2[fileID] = _extends({}, this.getState().files[fileID], state), _extends2))
      });
    };
    _proto.i18nInit = function i18nInit() {
      this.translator = new Translator([this.defaultLocale, this.opts.locale]);
      this.locale = this.translator.locale;
      this.i18n = this.translator.translate.bind(this.translator);
      this.i18nArray = this.translator.translateArray.bind(this.translator);
    };
    _proto.setOptions = function setOptions(newOpts) {
      this.opts = _extends({}, this.opts, newOpts, {
        restrictions: _extends({}, this.opts.restrictions, newOpts && newOpts.restrictions)
      });
      if (newOpts.meta) {
        this.setMeta(newOpts.meta);
      }
      this.i18nInit();
      if (newOpts.locale) {
        this.iteratePlugins(function(plugin) {
          plugin.setOptions();
        });
      }
      this.setState();
    };
    _proto.resetProgress = function resetProgress() {
      var defaultProgress = {
        percentage: 0,
        bytesUploaded: 0,
        uploadComplete: false,
        uploadStarted: null
      };
      var files = _extends({}, this.getState().files);
      var updatedFiles = {};
      Object.keys(files).forEach(function(fileID) {
        var updatedFile = _extends({}, files[fileID]);
        updatedFile.progress = _extends({}, updatedFile.progress, defaultProgress);
        updatedFiles[fileID] = updatedFile;
      });
      this.setState({
        files: updatedFiles,
        totalProgress: 0
      });
      this.emit("reset-progress");
    };
    _proto.addPreProcessor = function addPreProcessor(fn) {
      this.preProcessors.push(fn);
    };
    _proto.removePreProcessor = function removePreProcessor(fn) {
      var i = this.preProcessors.indexOf(fn);
      if (i !== -1) {
        this.preProcessors.splice(i, 1);
      }
    };
    _proto.addPostProcessor = function addPostProcessor(fn) {
      this.postProcessors.push(fn);
    };
    _proto.removePostProcessor = function removePostProcessor(fn) {
      var i = this.postProcessors.indexOf(fn);
      if (i !== -1) {
        this.postProcessors.splice(i, 1);
      }
    };
    _proto.addUploader = function addUploader(fn) {
      this.uploaders.push(fn);
    };
    _proto.removeUploader = function removeUploader(fn) {
      var i = this.uploaders.indexOf(fn);
      if (i !== -1) {
        this.uploaders.splice(i, 1);
      }
    };
    _proto.setMeta = function setMeta(data) {
      var updatedMeta = _extends({}, this.getState().meta, data);
      var updatedFiles = _extends({}, this.getState().files);
      Object.keys(updatedFiles).forEach(function(fileID) {
        updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
          meta: _extends({}, updatedFiles[fileID].meta, data)
        });
      });
      this.log("Adding metadata:");
      this.log(data);
      this.setState({
        meta: updatedMeta,
        files: updatedFiles
      });
    };
    _proto.setFileMeta = function setFileMeta(fileID, data) {
      var updatedFiles = _extends({}, this.getState().files);
      if (!updatedFiles[fileID]) {
        this.log("Was trying to set metadata for a file that has been removed: ", fileID);
        return;
      }
      var newMeta = _extends({}, updatedFiles[fileID].meta, data);
      updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
        meta: newMeta
      });
      this.setState({
        files: updatedFiles
      });
    };
    _proto.getFile = function getFile(fileID) {
      return this.getState().files[fileID];
    };
    _proto.getFiles = function getFiles() {
      var _this$getState = this.getState(), files = _this$getState.files;
      return Object.keys(files).map(function(fileID) {
        return files[fileID];
      });
    };
    _proto._checkMinNumberOfFiles = function _checkMinNumberOfFiles(files) {
      var minNumberOfFiles = this.opts.restrictions.minNumberOfFiles;
      if (Object.keys(files).length < minNumberOfFiles) {
        throw new RestrictionError("" + this.i18n("youHaveToAtLeastSelectX", {
          smart_count: minNumberOfFiles
        }));
      }
    };
    _proto._checkRestrictions = function _checkRestrictions(files, file) {
      var _this$opts$restrictio = this.opts.restrictions, maxFileSize = _this$opts$restrictio.maxFileSize, minFileSize = _this$opts$restrictio.minFileSize, maxNumberOfFiles = _this$opts$restrictio.maxNumberOfFiles, allowedFileTypes = _this$opts$restrictio.allowedFileTypes;
      if (maxNumberOfFiles) {
        if (Object.keys(files).length + 1 > maxNumberOfFiles) {
          throw new RestrictionError("" + this.i18n("youCanOnlyUploadX", {
            smart_count: maxNumberOfFiles
          }));
        }
      }
      if (allowedFileTypes) {
        var isCorrectFileType = allowedFileTypes.some(function(type) {
          if (type.indexOf("/") > -1) {
            if (!file.type)
              return false;
            return match(file.type.replace(/;.*?$/, ""), type);
          }
          if (type[0] === ".") {
            return file.extension.toLowerCase() === type.substr(1).toLowerCase();
          }
          return false;
        });
        if (!isCorrectFileType) {
          var allowedFileTypesString = allowedFileTypes.join(", ");
          throw new RestrictionError(this.i18n("youCanOnlyUploadFileTypes", {
            types: allowedFileTypesString
          }));
        }
      }
      if (maxFileSize && file.data.size != null) {
        if (file.data.size > maxFileSize) {
          throw new RestrictionError(this.i18n("exceedsSize2", {
            backwardsCompat: this.i18n("exceedsSize"),
            size: prettierBytes(maxFileSize)
          }));
        }
      }
      if (minFileSize && file.data.size != null) {
        if (file.data.size < minFileSize) {
          throw new RestrictionError(this.i18n("inferiorSize", {
            size: prettierBytes(minFileSize)
          }));
        }
      }
    };
    _proto._showOrLogErrorAndThrow = function _showOrLogErrorAndThrow(err, _temp) {
      var _ref = _temp === undefined ? {} : _temp, _ref$showInformer = _ref.showInformer, showInformer = _ref$showInformer === undefined ? true : _ref$showInformer, _ref$file = _ref.file, file = _ref$file === undefined ? null : _ref$file, _ref$throwErr = _ref.throwErr, throwErr = _ref$throwErr === undefined ? true : _ref$throwErr;
      var message = typeof err === "object" ? err.message : err;
      var details = typeof err === "object" && err.details ? err.details : "";
      var logMessageWithDetails = message;
      if (details) {
        logMessageWithDetails += " " + details;
      }
      if (err.isRestriction) {
        this.log(logMessageWithDetails);
        this.emit("restriction-failed", file, err);
      } else {
        this.log(logMessageWithDetails, "error");
      }
      if (showInformer) {
        this.info({
          message,
          details
        }, "error", 5000);
      }
      if (throwErr) {
        throw typeof err === "object" ? err : new Error(err);
      }
    };
    _proto._assertNewUploadAllowed = function _assertNewUploadAllowed(file) {
      var _this$getState2 = this.getState(), allowNewUpload = _this$getState2.allowNewUpload;
      if (allowNewUpload === false) {
        this._showOrLogErrorAndThrow(new RestrictionError(this.i18n("noNewAlreadyUploading")), {
          file
        });
      }
    };
    _proto._checkAndCreateFileStateObject = function _checkAndCreateFileStateObject(files, file) {
      var fileType = getFileType(file);
      file.type = fileType;
      var onBeforeFileAddedResult = this.opts.onBeforeFileAdded(file, files);
      if (onBeforeFileAddedResult === false) {
        this._showOrLogErrorAndThrow(new RestrictionError("Cannot add the file because onBeforeFileAdded returned false."), {
          showInformer: false,
          file
        });
      }
      if (typeof onBeforeFileAddedResult === "object" && onBeforeFileAddedResult) {
        file = onBeforeFileAddedResult;
      }
      var fileName;
      if (file.name) {
        fileName = file.name;
      } else if (fileType.split("/")[0] === "image") {
        fileName = fileType.split("/")[0] + "." + fileType.split("/")[1];
      } else {
        fileName = "noname";
      }
      var fileExtension = getFileNameAndExtension(fileName).extension;
      var isRemote = file.isRemote || false;
      var fileID = generateFileID(file);
      if (files[fileID]) {
        this._showOrLogErrorAndThrow(new RestrictionError(this.i18n("noDuplicates", {
          fileName
        })), {
          file
        });
      }
      var meta = file.meta || {};
      meta.name = fileName;
      meta.type = fileType;
      var size = isFinite(file.data.size) ? file.data.size : null;
      var newFile = {
        source: file.source || "",
        id: fileID,
        name: fileName,
        extension: fileExtension || "",
        meta: _extends({}, this.getState().meta, meta),
        type: fileType,
        data: file.data,
        progress: {
          percentage: 0,
          bytesUploaded: 0,
          bytesTotal: size,
          uploadComplete: false,
          uploadStarted: null
        },
        size,
        isRemote,
        remote: file.remote || "",
        preview: file.preview
      };
      try {
        this._checkRestrictions(files, newFile);
      } catch (err) {
        this._showOrLogErrorAndThrow(err, {
          file: newFile
        });
      }
      return newFile;
    };
    _proto._startIfAutoProceed = function _startIfAutoProceed() {
      var _this3 = this;
      if (this.opts.autoProceed && !this.scheduledAutoProceed) {
        this.scheduledAutoProceed = setTimeout(function() {
          _this3.scheduledAutoProceed = null;
          _this3.upload().catch(function(err) {
            if (!err.isRestriction) {
              _this3.log(err.stack || err.message || err);
            }
          });
        }, 4);
      }
    };
    _proto.addFile = function addFile(file) {
      var _extends3;
      this._assertNewUploadAllowed(file);
      var _this$getState3 = this.getState(), files = _this$getState3.files;
      var newFile = this._checkAndCreateFileStateObject(files, file);
      this.setState({
        files: _extends({}, files, (_extends3 = {}, _extends3[newFile.id] = newFile, _extends3))
      });
      this.emit("file-added", newFile);
      this.log("Added file: " + newFile.name + ", " + newFile.id + ", mime type: " + newFile.type);
      this._startIfAutoProceed();
      return newFile.id;
    };
    _proto.addFiles = function addFiles(fileDescriptors) {
      var _this4 = this;
      this._assertNewUploadAllowed();
      var files = _extends({}, this.getState().files);
      var newFiles = [];
      var errors = [];
      for (var i = 0;i < fileDescriptors.length; i++) {
        try {
          var newFile = this._checkAndCreateFileStateObject(files, fileDescriptors[i]);
          newFiles.push(newFile);
          files[newFile.id] = newFile;
        } catch (err2) {
          if (!err2.isRestriction) {
            errors.push(err2);
          }
        }
      }
      this.setState({
        files
      });
      newFiles.forEach(function(newFile2) {
        _this4.emit("file-added", newFile2);
      });
      if (newFiles.length > 5) {
        this.log("Added batch of " + newFiles.length + " files");
      } else {
        Object.keys(newFiles).forEach(function(fileID) {
          _this4.log("Added file: " + newFiles[fileID].name + `
 id: ` + newFiles[fileID].id + `
 type: ` + newFiles[fileID].type);
        });
      }
      if (newFiles.length > 0) {
        this._startIfAutoProceed();
      }
      if (errors.length > 0) {
        var message = `Multiple errors occurred while adding files:
`;
        errors.forEach(function(subError) {
          message += `
 * ` + subError.message;
        });
        this.info({
          message: this.i18n("addBulkFilesFailed", {
            smart_count: errors.length
          }),
          details: message
        }, "error", 5000);
        var err = new Error(message);
        err.errors = errors;
        throw err;
      }
    };
    _proto.removeFiles = function removeFiles(fileIDs, reason) {
      var _this5 = this;
      var _this$getState4 = this.getState(), files = _this$getState4.files, currentUploads = _this$getState4.currentUploads;
      var updatedFiles = _extends({}, files);
      var updatedUploads = _extends({}, currentUploads);
      var removedFiles = Object.create(null);
      fileIDs.forEach(function(fileID) {
        if (files[fileID]) {
          removedFiles[fileID] = files[fileID];
          delete updatedFiles[fileID];
        }
      });
      function fileIsNotRemoved(uploadFileID) {
        return removedFiles[uploadFileID] === undefined;
      }
      var uploadsToRemove = [];
      Object.keys(updatedUploads).forEach(function(uploadID) {
        var newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved);
        if (newFileIDs.length === 0) {
          uploadsToRemove.push(uploadID);
          return;
        }
        updatedUploads[uploadID] = _extends({}, currentUploads[uploadID], {
          fileIDs: newFileIDs
        });
      });
      uploadsToRemove.forEach(function(uploadID) {
        delete updatedUploads[uploadID];
      });
      var stateUpdate = {
        currentUploads: updatedUploads,
        files: updatedFiles
      };
      if (Object.keys(updatedFiles).length === 0) {
        stateUpdate.allowNewUpload = true;
        stateUpdate.error = null;
      }
      this.setState(stateUpdate);
      this._calculateTotalProgress();
      var removedFileIDs = Object.keys(removedFiles);
      removedFileIDs.forEach(function(fileID) {
        _this5.emit("file-removed", removedFiles[fileID], reason);
      });
      if (removedFileIDs.length > 5) {
        this.log("Removed " + removedFileIDs.length + " files");
      } else {
        this.log("Removed files: " + removedFileIDs.join(", "));
      }
    };
    _proto.removeFile = function removeFile(fileID, reason) {
      if (reason === undefined) {
        reason = null;
      }
      this.removeFiles([fileID], reason);
    };
    _proto.pauseResume = function pauseResume(fileID) {
      if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
        return;
      }
      var wasPaused = this.getFile(fileID).isPaused || false;
      var isPaused = !wasPaused;
      this.setFileState(fileID, {
        isPaused
      });
      this.emit("upload-pause", fileID, isPaused);
      return isPaused;
    };
    _proto.pauseAll = function pauseAll() {
      var updatedFiles = _extends({}, this.getState().files);
      var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function(file) {
        return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
      });
      inProgressUpdatedFiles.forEach(function(file) {
        var updatedFile = _extends({}, updatedFiles[file], {
          isPaused: true
        });
        updatedFiles[file] = updatedFile;
      });
      this.setState({
        files: updatedFiles
      });
      this.emit("pause-all");
    };
    _proto.resumeAll = function resumeAll() {
      var updatedFiles = _extends({}, this.getState().files);
      var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function(file) {
        return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
      });
      inProgressUpdatedFiles.forEach(function(file) {
        var updatedFile = _extends({}, updatedFiles[file], {
          isPaused: false,
          error: null
        });
        updatedFiles[file] = updatedFile;
      });
      this.setState({
        files: updatedFiles
      });
      this.emit("resume-all");
    };
    _proto.retryAll = function retryAll() {
      var updatedFiles = _extends({}, this.getState().files);
      var filesToRetry = Object.keys(updatedFiles).filter(function(file) {
        return updatedFiles[file].error;
      });
      filesToRetry.forEach(function(file) {
        var updatedFile = _extends({}, updatedFiles[file], {
          isPaused: false,
          error: null
        });
        updatedFiles[file] = updatedFile;
      });
      this.setState({
        files: updatedFiles,
        error: null
      });
      this.emit("retry-all", filesToRetry);
      if (filesToRetry.length === 0) {
        return Promise.resolve({
          successful: [],
          failed: []
        });
      }
      var uploadID = this._createUpload(filesToRetry, {
        forceAllowNewUpload: true
      });
      return this._runUpload(uploadID);
    };
    _proto.cancelAll = function cancelAll() {
      this.emit("cancel-all");
      var _this$getState5 = this.getState(), files = _this$getState5.files;
      var fileIDs = Object.keys(files);
      if (fileIDs.length) {
        this.removeFiles(fileIDs, "cancel-all");
      }
      this.setState({
        totalProgress: 0,
        error: null
      });
    };
    _proto.retryUpload = function retryUpload(fileID) {
      this.setFileState(fileID, {
        error: null,
        isPaused: false
      });
      this.emit("upload-retry", fileID);
      var uploadID = this._createUpload([fileID], {
        forceAllowNewUpload: true
      });
      return this._runUpload(uploadID);
    };
    _proto.reset = function reset() {
      this.cancelAll();
    };
    _proto._calculateProgress = function _calculateProgress(file, data) {
      if (!this.getFile(file.id)) {
        this.log("Not setting progress for a file that has been removed: " + file.id);
        return;
      }
      var canHavePercentage = isFinite(data.bytesTotal) && data.bytesTotal > 0;
      this.setFileState(file.id, {
        progress: _extends({}, this.getFile(file.id).progress, {
          bytesUploaded: data.bytesUploaded,
          bytesTotal: data.bytesTotal,
          percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
        })
      });
      this._calculateTotalProgress();
    };
    _proto._calculateTotalProgress = function _calculateTotalProgress() {
      var files = this.getFiles();
      var inProgress = files.filter(function(file) {
        return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
      });
      if (inProgress.length === 0) {
        this.emit("progress", 0);
        this.setState({
          totalProgress: 0
        });
        return;
      }
      var sizedFiles = inProgress.filter(function(file) {
        return file.progress.bytesTotal != null;
      });
      var unsizedFiles = inProgress.filter(function(file) {
        return file.progress.bytesTotal == null;
      });
      if (sizedFiles.length === 0) {
        var progressMax = inProgress.length * 100;
        var currentProgress = unsizedFiles.reduce(function(acc, file) {
          return acc + file.progress.percentage;
        }, 0);
        var _totalProgress = Math.round(currentProgress / progressMax * 100);
        this.setState({
          totalProgress: _totalProgress
        });
        return;
      }
      var totalSize = sizedFiles.reduce(function(acc, file) {
        return acc + file.progress.bytesTotal;
      }, 0);
      var averageSize = totalSize / sizedFiles.length;
      totalSize += averageSize * unsizedFiles.length;
      var uploadedSize = 0;
      sizedFiles.forEach(function(file) {
        uploadedSize += file.progress.bytesUploaded;
      });
      unsizedFiles.forEach(function(file) {
        uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
      });
      var totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100);
      if (totalProgress > 100) {
        totalProgress = 100;
      }
      this.setState({
        totalProgress
      });
      this.emit("progress", totalProgress);
    };
    _proto._addListeners = function _addListeners() {
      var _this6 = this;
      this.on("error", function(error) {
        var errorMsg = "Unknown error";
        if (error.message) {
          errorMsg = error.message;
        }
        if (error.details) {
          errorMsg += " " + error.details;
        }
        _this6.setState({
          error: errorMsg
        });
      });
      this.on("upload-error", function(file, error, response) {
        var errorMsg = "Unknown error";
        if (error.message) {
          errorMsg = error.message;
        }
        if (error.details) {
          errorMsg += " " + error.details;
        }
        _this6.setFileState(file.id, {
          error: errorMsg,
          response
        });
        _this6.setState({
          error: error.message
        });
        if (typeof error === "object" && error.message) {
          var newError = new Error(error.message);
          newError.details = error.message;
          if (error.details) {
            newError.details += " " + error.details;
          }
          newError.message = _this6.i18n("failedToUpload", {
            file: file.name
          });
          _this6._showOrLogErrorAndThrow(newError, {
            throwErr: false
          });
        } else {
          _this6._showOrLogErrorAndThrow(error, {
            throwErr: false
          });
        }
      });
      this.on("upload", function() {
        _this6.setState({
          error: null
        });
      });
      this.on("upload-started", function(file, upload) {
        if (!_this6.getFile(file.id)) {
          _this6.log("Not setting progress for a file that has been removed: " + file.id);
          return;
        }
        _this6.setFileState(file.id, {
          progress: {
            uploadStarted: Date.now(),
            uploadComplete: false,
            percentage: 0,
            bytesUploaded: 0,
            bytesTotal: file.size
          }
        });
      });
      this.on("upload-progress", this._calculateProgress);
      this.on("upload-success", function(file, uploadResp) {
        if (!_this6.getFile(file.id)) {
          _this6.log("Not setting progress for a file that has been removed: " + file.id);
          return;
        }
        var currentProgress = _this6.getFile(file.id).progress;
        _this6.setFileState(file.id, {
          progress: _extends({}, currentProgress, {
            uploadComplete: true,
            percentage: 100,
            bytesUploaded: currentProgress.bytesTotal
          }),
          response: uploadResp,
          uploadURL: uploadResp.uploadURL,
          isPaused: false
        });
        _this6._calculateTotalProgress();
      });
      this.on("preprocess-progress", function(file, progress) {
        if (!_this6.getFile(file.id)) {
          _this6.log("Not setting progress for a file that has been removed: " + file.id);
          return;
        }
        _this6.setFileState(file.id, {
          progress: _extends({}, _this6.getFile(file.id).progress, {
            preprocess: progress
          })
        });
      });
      this.on("preprocess-complete", function(file) {
        if (!_this6.getFile(file.id)) {
          _this6.log("Not setting progress for a file that has been removed: " + file.id);
          return;
        }
        var files = _extends({}, _this6.getState().files);
        files[file.id] = _extends({}, files[file.id], {
          progress: _extends({}, files[file.id].progress)
        });
        delete files[file.id].progress.preprocess;
        _this6.setState({
          files
        });
      });
      this.on("postprocess-progress", function(file, progress) {
        if (!_this6.getFile(file.id)) {
          _this6.log("Not setting progress for a file that has been removed: " + file.id);
          return;
        }
        _this6.setFileState(file.id, {
          progress: _extends({}, _this6.getState().files[file.id].progress, {
            postprocess: progress
          })
        });
      });
      this.on("postprocess-complete", function(file) {
        if (!_this6.getFile(file.id)) {
          _this6.log("Not setting progress for a file that has been removed: " + file.id);
          return;
        }
        var files = _extends({}, _this6.getState().files);
        files[file.id] = _extends({}, files[file.id], {
          progress: _extends({}, files[file.id].progress)
        });
        delete files[file.id].progress.postprocess;
        _this6.setState({
          files
        });
      });
      this.on("restored", function() {
        _this6._calculateTotalProgress();
      });
      if (typeof window !== "undefined" && window.addEventListener) {
        window.addEventListener("online", function() {
          return _this6.updateOnlineStatus();
        });
        window.addEventListener("offline", function() {
          return _this6.updateOnlineStatus();
        });
        setTimeout(function() {
          return _this6.updateOnlineStatus();
        }, 3000);
      }
    };
    _proto.updateOnlineStatus = function updateOnlineStatus() {
      var online = typeof window.navigator.onLine !== "undefined" ? window.navigator.onLine : true;
      if (!online) {
        this.emit("is-offline");
        this.info(this.i18n("noInternetConnection"), "error", 0);
        this.wasOffline = true;
      } else {
        this.emit("is-online");
        if (this.wasOffline) {
          this.emit("back-online");
          this.info(this.i18n("connectedToInternet"), "success", 3000);
          this.wasOffline = false;
        }
      }
    };
    _proto.getID = function getID() {
      return this.opts.id;
    };
    _proto.use = function use(Plugin2, opts) {
      if (typeof Plugin2 !== "function") {
        var msg = "Expected a plugin class, but got " + (Plugin2 === null ? "null" : typeof Plugin2) + "." + " Please verify that the plugin was imported and spelled correctly.";
        throw new TypeError(msg);
      }
      var plugin = new Plugin2(this, opts);
      var pluginId = plugin.id;
      this.plugins[plugin.type] = this.plugins[plugin.type] || [];
      if (!pluginId) {
        throw new Error("Your plugin must have an id");
      }
      if (!plugin.type) {
        throw new Error("Your plugin must have a type");
      }
      var existsPluginAlready = this.getPlugin(pluginId);
      if (existsPluginAlready) {
        var _msg = "Already found a plugin named '" + existsPluginAlready.id + "'. " + ("Tried to use: '" + pluginId + `'.
`) + "Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.";
        throw new Error(_msg);
      }
      if (Plugin2.VERSION) {
        this.log("Using " + pluginId + " v" + Plugin2.VERSION);
      }
      this.plugins[plugin.type].push(plugin);
      plugin.install();
      return this;
    };
    _proto.getPlugin = function getPlugin(id) {
      var foundPlugin = null;
      this.iteratePlugins(function(plugin) {
        if (plugin.id === id) {
          foundPlugin = plugin;
          return false;
        }
      });
      return foundPlugin;
    };
    _proto.iteratePlugins = function iteratePlugins(method) {
      var _this7 = this;
      Object.keys(this.plugins).forEach(function(pluginType) {
        _this7.plugins[pluginType].forEach(method);
      });
    };
    _proto.removePlugin = function removePlugin(instance) {
      this.log("Removing plugin " + instance.id);
      this.emit("plugin-remove", instance);
      if (instance.uninstall) {
        instance.uninstall();
      }
      var list = this.plugins[instance.type].slice();
      var index = list.indexOf(instance);
      if (index !== -1) {
        list.splice(index, 1);
        this.plugins[instance.type] = list;
      }
      var updatedState = this.getState();
      delete updatedState.plugins[instance.id];
      this.setState(updatedState);
    };
    _proto.close = function close() {
      var _this8 = this;
      this.log("Closing Uppy instance " + this.opts.id + ": removing all files and uninstalling plugins");
      this.reset();
      this._storeUnsubscribe();
      this.iteratePlugins(function(plugin) {
        _this8.removePlugin(plugin);
      });
    };
    _proto.info = function info(message, type, duration) {
      if (type === undefined) {
        type = "info";
      }
      if (duration === undefined) {
        duration = 3000;
      }
      var isComplexMessage = typeof message === "object";
      this.setState({
        info: {
          isHidden: false,
          type,
          message: isComplexMessage ? message.message : message,
          details: isComplexMessage ? message.details : null
        }
      });
      this.emit("info-visible");
      clearTimeout(this.infoTimeoutID);
      if (duration === 0) {
        this.infoTimeoutID = undefined;
        return;
      }
      this.infoTimeoutID = setTimeout(this.hideInfo, duration);
    };
    _proto.hideInfo = function hideInfo() {
      var newInfo = _extends({}, this.getState().info, {
        isHidden: true
      });
      this.setState({
        info: newInfo
      });
      this.emit("info-hidden");
    };
    _proto.log = function log(message, type) {
      var logger = this.opts.logger;
      switch (type) {
        case "error":
          logger.error(message);
          break;
        case "warning":
          logger.warn(message);
          break;
        default:
          logger.debug(message);
          break;
      }
    };
    _proto.run = function run() {
      this.log("Calling run() is no longer necessary.", "warning");
      return this;
    };
    _proto.restore = function restore(uploadID) {
      this.log('Core: attempting to restore upload "' + uploadID + '"');
      if (!this.getState().currentUploads[uploadID]) {
        this._removeUpload(uploadID);
        return Promise.reject(new Error("Nonexistent upload"));
      }
      return this._runUpload(uploadID);
    };
    _proto._createUpload = function _createUpload(fileIDs, opts) {
      var _extends4;
      if (opts === undefined) {
        opts = {};
      }
      var _opts = opts, _opts$forceAllowNewUp = _opts.forceAllowNewUpload, forceAllowNewUpload = _opts$forceAllowNewUp === undefined ? false : _opts$forceAllowNewUp;
      var _this$getState6 = this.getState(), allowNewUpload = _this$getState6.allowNewUpload, currentUploads = _this$getState6.currentUploads;
      if (!allowNewUpload && !forceAllowNewUpload) {
        throw new Error("Cannot create a new upload: already uploading.");
      }
      var uploadID = cuid();
      this.emit("upload", {
        id: uploadID,
        fileIDs
      });
      this.setState({
        allowNewUpload: this.opts.allowMultipleUploads !== false,
        currentUploads: _extends({}, currentUploads, (_extends4 = {}, _extends4[uploadID] = {
          fileIDs,
          step: 0,
          result: {}
        }, _extends4))
      });
      return uploadID;
    };
    _proto._getUpload = function _getUpload(uploadID) {
      var _this$getState7 = this.getState(), currentUploads = _this$getState7.currentUploads;
      return currentUploads[uploadID];
    };
    _proto.addResultData = function addResultData(uploadID, data) {
      var _extends5;
      if (!this._getUpload(uploadID)) {
        this.log("Not setting result for an upload that has been removed: " + uploadID);
        return;
      }
      var currentUploads = this.getState().currentUploads;
      var currentUpload = _extends({}, currentUploads[uploadID], {
        result: _extends({}, currentUploads[uploadID].result, data)
      });
      this.setState({
        currentUploads: _extends({}, currentUploads, (_extends5 = {}, _extends5[uploadID] = currentUpload, _extends5))
      });
    };
    _proto._removeUpload = function _removeUpload(uploadID) {
      var currentUploads = _extends({}, this.getState().currentUploads);
      delete currentUploads[uploadID];
      this.setState({
        currentUploads
      });
    };
    _proto._runUpload = function _runUpload(uploadID) {
      var _this9 = this;
      var uploadData = this.getState().currentUploads[uploadID];
      var restoreStep = uploadData.step;
      var steps = [].concat(this.preProcessors, this.uploaders, this.postProcessors);
      var lastStep = Promise.resolve();
      steps.forEach(function(fn, step) {
        if (step < restoreStep) {
          return;
        }
        lastStep = lastStep.then(function() {
          var _extends6;
          var _this9$getState = _this9.getState(), currentUploads = _this9$getState.currentUploads;
          var currentUpload = currentUploads[uploadID];
          if (!currentUpload) {
            return;
          }
          var updatedUpload = _extends({}, currentUpload, {
            step
          });
          _this9.setState({
            currentUploads: _extends({}, currentUploads, (_extends6 = {}, _extends6[uploadID] = updatedUpload, _extends6))
          });
          return fn(updatedUpload.fileIDs, uploadID);
        }).then(function(result) {
          return null;
        });
      });
      lastStep.catch(function(err) {
        _this9.emit("error", err, uploadID);
        _this9._removeUpload(uploadID);
      });
      return lastStep.then(function() {
        var _this9$getState2 = _this9.getState(), currentUploads = _this9$getState2.currentUploads;
        var currentUpload = currentUploads[uploadID];
        if (!currentUpload) {
          return;
        }
        var files = currentUpload.fileIDs.map(function(fileID) {
          return _this9.getFile(fileID);
        });
        var successful = files.filter(function(file) {
          return !file.error;
        });
        var failed = files.filter(function(file) {
          return file.error;
        });
        _this9.addResultData(uploadID, {
          successful,
          failed,
          uploadID
        });
      }).then(function() {
        var _this9$getState3 = _this9.getState(), currentUploads = _this9$getState3.currentUploads;
        if (!currentUploads[uploadID]) {
          return;
        }
        var currentUpload = currentUploads[uploadID];
        var result = currentUpload.result;
        _this9.emit("complete", result);
        _this9._removeUpload(uploadID);
        return result;
      }).then(function(result) {
        if (result == null) {
          _this9.log("Not setting result for an upload that has been removed: " + uploadID);
        }
        return result;
      });
    };
    _proto.upload = function upload() {
      var _this10 = this;
      if (!this.plugins.uploader) {
        this.log("No uploader type plugins are used", "warning");
      }
      var files = this.getState().files;
      var onBeforeUploadResult = this.opts.onBeforeUpload(files);
      if (onBeforeUploadResult === false) {
        return Promise.reject(new Error("Not starting the upload because onBeforeUpload returned false"));
      }
      if (onBeforeUploadResult && typeof onBeforeUploadResult === "object") {
        files = onBeforeUploadResult;
        this.setState({
          files
        });
      }
      return Promise.resolve().then(function() {
        return _this10._checkMinNumberOfFiles(files);
      }).catch(function(err) {
        _this10._showOrLogErrorAndThrow(err);
      }).then(function() {
        var _this10$getState = _this10.getState(), currentUploads = _this10$getState.currentUploads;
        var currentlyUploadingFiles = Object.keys(currentUploads).reduce(function(prev, curr) {
          return prev.concat(currentUploads[curr].fileIDs);
        }, []);
        var waitingFileIDs = [];
        Object.keys(files).forEach(function(fileID) {
          var file = _this10.getFile(fileID);
          if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
            waitingFileIDs.push(file.id);
          }
        });
        var uploadID = _this10._createUpload(waitingFileIDs);
        return _this10._runUpload(uploadID);
      }).catch(function(err) {
        _this10._showOrLogErrorAndThrow(err, {
          showInformer: false
        });
      });
    };
    _createClass(Uppy2, [{
      key: "state",
      get: function get() {
        return this.getState();
      }
    }]);
    return Uppy2;
  }();
  Uppy.VERSION = "1.13.1";
  module.exports = function(opts) {
    return new Uppy(opts);
  };
  module.exports.Uppy = Uppy;
  module.exports.Plugin = Plugin;
  module.exports.debugLogger = debugLogger;
});

// node_modules/classnames/index.js
var require_classnames = __commonJS(function(exports, module) {
  /*!
    Copyright (c) 2017 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  */
  (function() {
    var hasOwn = {}.hasOwnProperty;
    function classNames() {
      var classes = [];
      for (var i = 0;i < arguments.length; i++) {
        var arg = arguments[i];
        if (!arg)
          continue;
        var argType = typeof arg;
        if (argType === "string" || argType === "number") {
          classes.push(arg);
        } else if (Array.isArray(arg) && arg.length) {
          var inner = classNames.apply(null, arg);
          if (inner) {
            classes.push(inner);
          }
        } else if (argType === "object") {
          for (var key in arg) {
            if (hasOwn.call(arg, key) && arg[key]) {
              classes.push(key);
            }
          }
        }
      }
      return classes.join(" ");
    }
    if (typeof module !== "undefined" && module.exports) {
      classNames.default = classNames;
      module.exports = classNames;
    } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
      define("classnames", [], function() {
        return classNames;
      });
    } else {
      window.classNames = classNames;
    }
  })();
});

// node_modules/is-shallow-equal/index.js
var require_is_shallow_equal = __commonJS(function(exports, module) {
  module.exports = function isShallowEqual(a, b) {
    if (a === b)
      return true;
    for (var i in a)
      if (!(i in b))
        return false;
    for (var i in b)
      if (a[i] !== b[i])
        return false;
    return true;
  };
});

// node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js
var require_getFileTypeIcon = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  function iconImage() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("g", {
      fill: "#686DE0",
      "fill-rule": "evenodd"
    }, h2("path", {
      d: "M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
      "fill-rule": "nonzero"
    }), h2("path", {
      d: "M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z",
      "fill-rule": "nonzero"
    }), h2("circle", {
      cx: "7.5",
      cy: "9.5",
      r: "1.5"
    })));
  }
  function iconAudio() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("path", {
      d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z",
      fill: "#049BCF",
      "fill-rule": "nonzero"
    }));
  }
  function iconVideo() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("path", {
      d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z",
      fill: "#19AF67",
      "fill-rule": "nonzero"
    }));
  }
  function iconPDF() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("path", {
      d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z",
      fill: "#E2514A",
      "fill-rule": "nonzero"
    }));
  }
  function iconArchive() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("path", {
      d: "M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z",
      fill: "#00C469",
      "fill-rule": "nonzero"
    }));
  }
  function iconFile() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("g", {
      fill: "#A7AFB7",
      "fill-rule": "nonzero"
    }, h2("path", {
      d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z"
    }), h2("path", {
      d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z"
    })));
  }
  function iconText() {
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "25",
      height: "25",
      viewBox: "0 0 25 25"
    }, h2("path", {
      d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z",
      fill: "#5A5E69",
      "fill-rule": "nonzero"
    }));
  }
  module.exports = function getIconByMime(fileType) {
    var defaultChoice = {
      color: "#838999",
      icon: iconFile()
    };
    if (!fileType)
      return defaultChoice;
    var fileTypeGeneral = fileType.split("/")[0];
    var fileTypeSpecific = fileType.split("/")[1];
    if (fileTypeGeneral === "text") {
      return {
        color: "#5a5e69",
        icon: iconText()
      };
    }
    if (fileTypeGeneral === "image") {
      return {
        color: "#686de0",
        icon: iconImage()
      };
    }
    if (fileTypeGeneral === "audio") {
      return {
        color: "#068dbb",
        icon: iconAudio()
      };
    }
    if (fileTypeGeneral === "video") {
      return {
        color: "#19af67",
        icon: iconVideo()
      };
    }
    if (fileTypeGeneral === "application" && fileTypeSpecific === "pdf") {
      return {
        color: "#e25149",
        icon: iconPDF()
      };
    }
    var archiveTypes = ["zip", "x-7z-compressed", "x-rar-compressed", "x-gtar", "x-apple-diskimage", "x-diskcopy"];
    if (fileTypeGeneral === "application" && archiveTypes.indexOf(fileTypeSpecific) !== -1) {
      return {
        color: "#00C469",
        icon: iconArchive()
      };
    }
    return defaultChoice;
  };
});

// node_modules/@uppy/dashboard/lib/components/FilePreview.js
var require_FilePreview = __commonJS(function(exports, module) {
  var getFileTypeIcon = require_getFileTypeIcon();
  var _require = require_preact();
  var h2 = _require.h;
  module.exports = function FilePreview(props) {
    var file = props.file;
    if (file.preview) {
      return h2("img", {
        class: "uppy-Dashboard-Item-previewImg",
        alt: file.name,
        src: file.preview
      });
    }
    var _getFileTypeIcon = getFileTypeIcon(file.type), color = _getFileTypeIcon.color, icon = _getFileTypeIcon.icon;
    return h2("div", {
      class: "uppy-Dashboard-Item-previewIconWrap"
    }, h2("span", {
      class: "uppy-Dashboard-Item-previewIcon",
      style: {
        color
      }
    }, icon), h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-Dashboard-Item-previewIconBg",
      width: "58",
      height: "76",
      viewBox: "0 0 58 76"
    }, h2("rect", {
      fill: "#FFF",
      width: "58",
      height: "76",
      rx: "3",
      "fill-rule": "evenodd"
    })));
  };
});

// node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js
var require_FilePreviewAndLink = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  var FilePreview = require_FilePreview();
  var getFileTypeIcon = require_getFileTypeIcon();
  module.exports = function FilePreviewAndLink(props) {
    return h2("div", {
      class: "uppy-Dashboard-Item-previewInnerWrap",
      style: {
        backgroundColor: getFileTypeIcon(props.file.type).color
      }
    }, props.showLinkToFileUploadResult && props.file.uploadURL && h2("a", {
      class: "uppy-Dashboard-Item-previewLink",
      href: props.file.uploadURL,
      rel: "noreferrer noopener",
      target: "_blank",
      "aria-label": props.file.meta.name
    }), h2(FilePreview, {
      file: props.file
    }));
  };
});

// node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js
var require_FileProgress = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  function onPauseResumeCancelRetry(props) {
    if (props.isUploaded)
      return;
    if (props.error && !props.hideRetryButton) {
      props.retryUpload(props.file.id);
      return;
    }
    if (props.resumableUploads && !props.hidePauseResumeButton) {
      props.pauseUpload(props.file.id);
    } else if (props.individualCancellation && !props.hideCancelButton) {
      props.cancelUpload(props.file.id);
    }
  }
  function progressIndicatorTitle(props) {
    if (props.isUploaded) {
      return props.i18n("uploadComplete");
    }
    if (props.error) {
      return props.i18n("retryUpload");
    }
    if (props.resumableUploads) {
      if (props.file.isPaused) {
        return props.i18n("resumeUpload");
      }
      return props.i18n("pauseUpload");
    } else if (props.individualCancellation) {
      return props.i18n("cancelUpload");
    }
    return "";
  }
  function ProgressIndicatorButton(props) {
    return h2("div", {
      class: "uppy-Dashboard-Item-progress"
    }, h2("button", {
      class: "uppy-u-reset uppy-Dashboard-Item-progressIndicator",
      type: "button",
      "aria-label": progressIndicatorTitle(props),
      title: progressIndicatorTitle(props),
      onclick: function onclick() {
        return onPauseResumeCancelRetry(props);
      }
    }, props.children));
  }
  function ProgressCircleContainer(_ref) {
    var children = _ref.children;
    return h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "70",
      height: "70",
      viewBox: "0 0 36 36",
      class: "uppy-c-icon uppy-Dashboard-Item-progressIcon--circle"
    }, children);
  }
  function ProgressCircle(_ref2) {
    var progress = _ref2.progress;
    var circleLength = 2 * Math.PI * 15;
    return h2("g", null, h2("circle", {
      class: "uppy-Dashboard-Item-progressIcon--bg",
      r: "15",
      cx: "18",
      cy: "18",
      "stroke-width": "2",
      fill: "none"
    }), h2("circle", {
      class: "uppy-Dashboard-Item-progressIcon--progress",
      r: "15",
      cx: "18",
      cy: "18",
      transform: "rotate(-90, 18, 18)",
      "stroke-width": "2",
      fill: "none",
      "stroke-dasharray": circleLength,
      "stroke-dashoffset": circleLength - circleLength / 100 * progress
    }));
  }
  module.exports = function FileProgress(props) {
    if (!props.file.progress.uploadStarted) {
      return null;
    }
    if (props.isUploaded) {
      return h2("div", {
        class: "uppy-Dashboard-Item-progress"
      }, h2("div", {
        class: "uppy-Dashboard-Item-progressIndicator"
      }, h2(ProgressCircleContainer, null, h2("circle", {
        r: "15",
        cx: "18",
        cy: "18",
        fill: "#1bb240"
      }), h2("polygon", {
        class: "uppy-Dashboard-Item-progressIcon--check",
        transform: "translate(2, 3)",
        points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634"
      }))));
    }
    if (props.error && !props.hideRetryButton) {
      return h2(ProgressIndicatorButton, props, h2("svg", {
        "aria-hidden": "true",
        focusable: "false",
        class: "uppy-c-icon uppy-Dashboard-Item-progressIcon--retry",
        width: "28",
        height: "31",
        viewBox: "0 0 16 19"
      }, h2("path", {
        d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z"
      }), h2("path", {
        d: "M7.9 3H10v2H7.9z"
      }), h2("path", {
        d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z"
      }), h2("path", {
        d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z"
      })));
    }
    if (props.resumableUploads && !props.hidePauseResumeButton) {
      return h2(ProgressIndicatorButton, props, h2(ProgressCircleContainer, null, h2(ProgressCircle, {
        progress: props.file.progress.percentage
      }), props.file.isPaused ? h2("polygon", {
        class: "uppy-Dashboard-Item-progressIcon--play",
        transform: "translate(3, 3)",
        points: "12 20 12 10 20 15"
      }) : h2("g", {
        class: "uppy-Dashboard-Item-progressIcon--pause",
        transform: "translate(14.5, 13)"
      }, h2("rect", {
        x: "0",
        y: "0",
        width: "2",
        height: "10",
        rx: "0"
      }), h2("rect", {
        x: "5",
        y: "0",
        width: "2",
        height: "10",
        rx: "0"
      }))));
    }
    if (!props.resumableUploads && props.individualCancellation && !props.hideCancelButton) {
      return h2(ProgressIndicatorButton, props, h2(ProgressCircleContainer, null, h2(ProgressCircle, {
        progress: props.file.progress.percentage
      }), h2("polygon", {
        class: "cancel",
        transform: "translate(2, 2)",
        points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12"
      })));
    }
    return h2("div", {
      class: "uppy-Dashboard-Item-progress"
    }, h2("div", {
      class: "uppy-Dashboard-Item-progressIndicator"
    }, h2(ProgressCircleContainer, null, h2(ProgressCircle, {
      progress: props.file.progress.percentage
    }))));
  };
});

// node_modules/@uppy/dashboard/lib/utils/truncateString.js
var require_truncateString = __commonJS(function(exports, module) {
  module.exports = function truncateString(string, maxLength) {
    var separator = "...";
    if (string.length <= maxLength) {
      return string;
    } else if (maxLength <= separator.length) {
      return string.substr(0, maxLength);
    } else {
      var charsToShow = maxLength - separator.length;
      var frontChars = Math.ceil(charsToShow / 2);
      var backChars = Math.floor(charsToShow / 2);
      return string.substr(0, frontChars) + separator + string.substr(string.length - backChars);
    }
  };
});

// node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js
var require_FileInfo = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  var prettierBytes = require_prettierBytes();
  var truncateString = require_truncateString();
  var renderAcquirerIcon = function renderAcquirerIcon2(acquirer, props) {
    return h2("span", {
      title: props.i18n("fileSource", {
        name: acquirer.name
      })
    }, acquirer.icon());
  };
  var renderFileSource = function renderFileSource2(props) {
    return props.file.source && props.file.source !== props.id && h2("div", {
      class: "uppy-Dashboard-Item-sourceIcon"
    }, props.acquirers.map(function(acquirer) {
      if (acquirer.id === props.file.source) {
        return renderAcquirerIcon(acquirer, props);
      }
    }));
  };
  var renderFileName = function renderFileName2(props) {
    var maxNameLength;
    if (props.containerWidth <= 352) {
      maxNameLength = 35;
    } else if (props.containerWidth <= 576) {
      maxNameLength = 60;
    } else {
      maxNameLength = 30;
    }
    return h2("div", {
      class: "uppy-Dashboard-Item-name",
      title: props.file.meta.name
    }, truncateString(props.file.meta.name, maxNameLength));
  };
  var renderFileSize = function renderFileSize2(props) {
    return props.file.data.size && h2("div", {
      class: "uppy-Dashboard-Item-statusSize"
    }, prettierBytes(props.file.data.size));
  };
  var ErrorButton = function ErrorButton2(_ref) {
    var { file, onClick } = _ref;
    if (file.error) {
      return h2("span", {
        class: "uppy-Dashboard-Item-errorDetails",
        "aria-label": file.error,
        "data-microtip-position": "bottom",
        "data-microtip-size": "medium",
        role: "tooltip",
        onclick: onClick
      }, "?");
    }
    return null;
  };
  module.exports = function FileInfo(props) {
    return h2("div", {
      class: "uppy-Dashboard-Item-fileInfo",
      "data-uppy-file-source": props.file.source
    }, renderFileName(props), h2("div", {
      class: "uppy-Dashboard-Item-status"
    }, renderFileSize(props), renderFileSource(props), h2(ErrorButton, {
      file: props.file,
      onClick: function onClick() {
        alert(props.file.error);
      }
    })));
  };
});

// node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js
var require_copyToClipboard = __commonJS(function(exports, module) {
  module.exports = function copyToClipboard(textToCopy, fallbackString) {
    fallbackString = fallbackString || "Copy the URL below";
    return new Promise(function(resolve) {
      var textArea = document.createElement("textarea");
      textArea.setAttribute("style", {
        position: "fixed",
        top: 0,
        left: 0,
        width: "2em",
        height: "2em",
        padding: 0,
        border: "none",
        outline: "none",
        boxShadow: "none",
        background: "transparent"
      });
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      var magicCopyFailed = function magicCopyFailed2() {
        document.body.removeChild(textArea);
        window.prompt(fallbackString, textToCopy);
        resolve();
      };
      try {
        var successful = document.execCommand("copy");
        if (!successful) {
          return magicCopyFailed("copy command unavailable");
        }
        document.body.removeChild(textArea);
        return resolve();
      } catch (err) {
        document.body.removeChild(textArea);
        return magicCopyFailed(err);
      }
    });
  };
});

// node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js
var require_Buttons = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  var copyToClipboard = require_copyToClipboard();
  function EditButton(_ref) {
    var { file, uploadInProgressOrComplete, metaFields, i18n, onClick } = _ref;
    if (!uploadInProgressOrComplete && metaFields && metaFields.length > 0) {
      return h2("button", {
        class: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit",
        type: "button",
        "aria-label": i18n("editFile") + " " + file.meta.name,
        title: i18n("editFile"),
        onclick: function onclick() {
          return onClick();
        }
      }, h2("svg", {
        "aria-hidden": "true",
        focusable: "false",
        class: "uppy-c-icon",
        width: "14",
        height: "14",
        viewBox: "0 0 14 14"
      }, h2("g", {
        "fill-rule": "evenodd"
      }, h2("path", {
        d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z",
        "fill-rule": "nonzero"
      }), h2("rect", {
        x: "1",
        y: "12.293",
        width: "11",
        height: "1",
        rx: ".5"
      }), h2("path", {
        "fill-rule": "nonzero",
        d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z"
      }))));
    }
    return null;
  }
  function RemoveButton(_ref2) {
    var { i18n, onClick } = _ref2;
    return h2("button", {
      class: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove",
      type: "button",
      "aria-label": i18n("removeFile"),
      title: i18n("removeFile"),
      onclick: function onclick() {
        return onClick();
      }
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "18",
      height: "18",
      viewBox: "0 0 18 18"
    }, h2("path", {
      d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z"
    }), h2("path", {
      fill: "#FFF",
      d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z"
    })));
  }
  var copyLinkToClipboard = function copyLinkToClipboard2(event, props) {
    copyToClipboard(props.file.uploadURL, props.i18n("copyLinkToClipboardFallback")).then(function() {
      props.log("Link copied to clipboard.");
      props.info(props.i18n("copyLinkToClipboardSuccess"), "info", 3000);
    }).catch(props.log).then(function() {
      return event.target.focus({
        preventScroll: true
      });
    });
  };
  function CopyLinkButton(props) {
    return h2("button", {
      class: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink",
      type: "button",
      "aria-label": props.i18n("copyLink"),
      title: props.i18n("copyLink"),
      onclick: function onclick(event) {
        return copyLinkToClipboard(event, props);
      }
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "14",
      height: "14",
      viewBox: "0 0 14 12"
    }, h2("path", {
      d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z"
    })));
  }
  module.exports = function Buttons(props) {
    var { file, uploadInProgressOrComplete, metaFields, showLinkToFileUploadResult, showRemoveButton, i18n, removeFile, toggleFileCard, log, info } = props;
    return h2("div", {
      className: "uppy-Dashboard-Item-actionWrapper"
    }, h2(EditButton, {
      i18n,
      file,
      uploadInProgressOrComplete,
      metaFields,
      onClick: function onClick() {
        return toggleFileCard(file.id);
      }
    }), showLinkToFileUploadResult && file.uploadURL ? h2(CopyLinkButton, {
      file,
      i18n,
      info,
      log
    }) : null, showRemoveButton ? h2(RemoveButton, {
      i18n,
      info: props.info,
      log: props.log,
      onClick: function onClick() {
        return removeFile(file.id, "removed-by-user");
      }
    }) : null);
  };
});

// node_modules/@uppy/dashboard/lib/components/FileItem/index.js
var require_FileItem = __commonJS(function(exports, module) {
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_preact();
  var h2 = _require.h;
  var Component = _require.Component;
  var classNames = require_classnames();
  var shallowEqual = require_is_shallow_equal();
  var FilePreviewAndLink = require_FilePreviewAndLink();
  var FileProgress = require_FileProgress();
  var FileInfo = require_FileInfo();
  var Buttons = require_Buttons();
  module.exports = /* @__PURE__ */ function(_Component) {
    _inheritsLoose(FileItem, _Component);
    function FileItem() {
      return _Component.apply(this, arguments) || this;
    }
    var _proto = FileItem.prototype;
    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
      return !shallowEqual(this.props, nextProps);
    };
    _proto.componentDidMount = function componentDidMount() {
      var file = this.props.file;
      if (!file.preview) {
        this.props.handleRequestThumbnail(file);
      }
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      var file = this.props.file;
      if (!file.preview) {
        this.props.handleCancelThumbnail(file);
      }
    };
    _proto.render = function render() {
      var file = this.props.file;
      var isProcessing = file.progress.preprocess || file.progress.postprocess;
      var isUploaded = file.progress.uploadComplete && !isProcessing && !file.error;
      var uploadInProgressOrComplete = file.progress.uploadStarted || isProcessing;
      var uploadInProgress = file.progress.uploadStarted && !file.progress.uploadComplete || isProcessing;
      var error = file.error || false;
      var showRemoveButton = this.props.individualCancellation ? !isUploaded : !uploadInProgress && !isUploaded;
      if (isUploaded && this.props.showRemoveButtonAfterComplete) {
        showRemoveButton = true;
      }
      var dashboardItemClass = classNames({
        "uppy-Dashboard-Item": true,
        "is-inprogress": uploadInProgress,
        "is-processing": isProcessing,
        "is-complete": isUploaded,
        "is-error": !!error,
        "is-resumable": this.props.resumableUploads,
        "is-noIndividualCancellation": !this.props.individualCancellation
      });
      return h2("div", {
        class: dashboardItemClass,
        id: "uppy_" + file.id,
        role: this.props.role
      }, h2("div", {
        class: "uppy-Dashboard-Item-preview"
      }, h2(FilePreviewAndLink, {
        file,
        showLinkToFileUploadResult: this.props.showLinkToFileUploadResult
      }), h2(FileProgress, {
        file,
        error,
        isUploaded,
        hideRetryButton: this.props.hideRetryButton,
        hideCancelButton: this.props.hideCancelButton,
        hidePauseResumeButton: this.props.hidePauseResumeButton,
        showRemoveButtonAfterComplete: this.props.showRemoveButtonAfterComplete,
        resumableUploads: this.props.resumableUploads,
        individualCancellation: this.props.individualCancellation,
        pauseUpload: this.props.pauseUpload,
        cancelUpload: this.props.cancelUpload,
        retryUpload: this.props.retryUpload,
        i18n: this.props.i18n
      })), h2("div", {
        class: "uppy-Dashboard-Item-fileInfoAndButtons"
      }, h2(FileInfo, {
        file,
        id: this.props.id,
        acquirers: this.props.acquirers,
        containerWidth: this.props.containerWidth,
        i18n: this.props.i18n
      }), h2(Buttons, {
        file,
        metaFields: this.props.metaFields,
        showLinkToFileUploadResult: this.props.showLinkToFileUploadResult,
        showRemoveButton,
        uploadInProgressOrComplete,
        removeFile: this.props.removeFile,
        toggleFileCard: this.props.toggleFileCard,
        i18n: this.props.i18n,
        log: this.props.log,
        info: this.props.info
      })));
    };
    return FileItem;
  }(Component);
});

// node_modules/@uppy/dashboard/lib/components/VirtualList.js
var require_VirtualList = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0;i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_preact();
  var h2 = _require.h;
  var Component = _require.Component;
  var STYLE_INNER = {
    position: "relative",
    width: "100%",
    minHeight: "100%"
  };
  var STYLE_CONTENT = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    overflow: "visible"
  };
  var VirtualList = /* @__PURE__ */ function(_Component) {
    _inheritsLoose(VirtualList2, _Component);
    function VirtualList2(props) {
      var _this;
      _this = _Component.call(this, props) || this;
      _this.handleResize = function() {
        _this.resize();
      };
      _this.handleScroll = function() {
        _this.setState({
          offset: _this.base.scrollTop
        });
        if (_this.props.sync) {
          _this.forceUpdate();
        }
      };
      _this.focusElement = null;
      _this.state = {
        offset: 0,
        height: 0
      };
      return _this;
    }
    var _proto = VirtualList2.prototype;
    _proto.resize = function resize() {
      if (this.state.height !== this.base.offsetHeight) {
        this.setState({
          height: this.base.offsetHeight
        });
      }
    };
    _proto.componentWillUpdate = function componentWillUpdate() {
      if (this.base.contains(document.activeElement)) {
        this.focusElement = document.activeElement;
      }
    };
    _proto.componentDidUpdate = function componentDidUpdate() {
      if (this.focusElement && this.focusElement.parentNode && document.activeElement !== this.focusElement) {
        this.focusElement.focus();
      }
      this.focusElement = null;
      this.resize();
    };
    _proto.componentDidMount = function componentDidMount() {
      this.resize();
      window.addEventListener("resize", this.handleResize);
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    };
    _proto.render = function render(_ref) {
      var { data, rowHeight, renderRow, overscanCount: _ref$overscanCount } = _ref, overscanCount = _ref$overscanCount === undefined ? 10 : _ref$overscanCount, sync = _ref.sync, props = _objectWithoutPropertiesLoose(_ref, ["data", "rowHeight", "renderRow", "overscanCount", "sync"]);
      var _this$state = this.state, offset = _this$state.offset, height = _this$state.height;
      var start = Math.floor(offset / rowHeight);
      var visibleRowCount = Math.floor(height / rowHeight);
      if (overscanCount) {
        start = Math.max(0, start - start % overscanCount);
        visibleRowCount += overscanCount;
      }
      var end = start + visibleRowCount + 4;
      var selection = data.slice(start, end);
      var styleInner = _extends({}, STYLE_INNER, {
        height: data.length * rowHeight
      });
      var styleContent = _extends({}, STYLE_CONTENT, {
        top: start * rowHeight
      });
      return h2("div", _extends({
        onScroll: this.handleScroll
      }, props), h2("div", {
        role: "presentation",
        style: styleInner
      }, h2("div", {
        role: "presentation",
        style: styleContent
      }, selection.map(renderRow))));
    };
    return VirtualList2;
  }(Component);
  module.exports = VirtualList;
});

// node_modules/@uppy/dashboard/lib/components/FileList.js
var require_FileList = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var FileItem = require_FileItem();
  var VirtualList = require_VirtualList();
  var classNames = require_classnames();
  var _require = require_preact();
  var h2 = _require.h;
  function chunks(list, size) {
    var chunked = [];
    var currentChunk = [];
    list.forEach(function(item, i) {
      if (currentChunk.length < size) {
        currentChunk.push(item);
      } else {
        chunked.push(currentChunk);
        currentChunk = [item];
      }
    });
    if (currentChunk.length)
      chunked.push(currentChunk);
    return chunked;
  }
  module.exports = function(props) {
    var noFiles = props.totalFileCount === 0;
    var dashboardFilesClass = classNames("uppy-Dashboard-files", {
      "uppy-Dashboard-files--noFiles": noFiles
    });
    var rowHeight = props.itemsPerRow === 1 ? 71 : 200;
    var fileProps = {
      id: props.id,
      error: props.error,
      i18n: props.i18n,
      log: props.log,
      info: props.info,
      acquirers: props.acquirers,
      resumableUploads: props.resumableUploads,
      individualCancellation: props.individualCancellation,
      hideRetryButton: props.hideRetryButton,
      hidePauseResumeButton: props.hidePauseResumeButton,
      hideCancelButton: props.hideCancelButton,
      showLinkToFileUploadResult: props.showLinkToFileUploadResult,
      showRemoveButtonAfterComplete: props.showRemoveButtonAfterComplete,
      isWide: props.isWide,
      metaFields: props.metaFields,
      retryUpload: props.retryUpload,
      pauseUpload: props.pauseUpload,
      cancelUpload: props.cancelUpload,
      toggleFileCard: props.toggleFileCard,
      removeFile: props.removeFile,
      handleRequestThumbnail: props.handleRequestThumbnail,
      handleCancelThumbnail: props.handleCancelThumbnail
    };
    var rows = chunks(Object.keys(props.files), props.itemsPerRow);
    function renderRow(row) {
      return h2("div", {
        role: "presentation",
        key: row[0]
      }, row.map(function(fileID) {
        return h2(FileItem, _extends({
          key: fileID
        }, fileProps, {
          role: "listitem",
          file: props.files[fileID]
        }));
      }));
    }
    return h2(VirtualList, {
      class: dashboardFilesClass,
      role: "list",
      data: rows,
      renderRow,
      rowHeight
    });
  };
});

// node_modules/@uppy/dashboard/lib/components/AddFiles.js
var require_AddFiles = __commonJS(function(exports, module) {
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_preact();
  var h2 = _require.h;
  var Component = _require.Component;
  var AddFiles = /* @__PURE__ */ function(_Component) {
    _inheritsLoose(AddFiles2, _Component);
    function AddFiles2() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0;_key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.triggerFileInputClick = function() {
        _this.fileInput.click();
      };
      _this.triggerFolderInputClick = function() {
        _this.folderInput.click();
      };
      _this.onFileInputChange = function(event) {
        _this.props.handleInputChange(event);
        event.target.value = null;
      };
      _this.renderHiddenInput = function(isFolder, refCallback) {
        return h2("input", {
          class: "uppy-Dashboard-input",
          hidden: true,
          "aria-hidden": "true",
          tabindex: -1,
          webkitdirectory: isFolder,
          type: "file",
          name: "files[]",
          multiple: _this.props.maxNumberOfFiles !== 1,
          onchange: _this.onFileInputChange,
          accept: _this.props.allowedFileTypes,
          ref: refCallback
        });
      };
      _this.renderMyDeviceAcquirer = function() {
        return h2("div", {
          class: "uppy-DashboardTab",
          role: "presentation",
          "data-uppy-acquirer-id": "MyDevice"
        }, h2("button", {
          type: "button",
          class: "uppy-DashboardTab-btn",
          role: "tab",
          tabindex: 0,
          "data-uppy-super-focusable": true,
          onclick: _this.triggerFileInputClick
        }, h2("svg", {
          "aria-hidden": "true",
          focusable: "false",
          width: "32",
          height: "32",
          viewBox: "0 0 32 32"
        }, h2("g", {
          fill: "none",
          "fill-rule": "evenodd"
        }, h2("rect", {
          width: "32",
          height: "32",
          rx: "16",
          fill: "#2275D7"
        }), h2("path", {
          d: "M21.973 21.152H9.863l-1.108-5.087h14.464l-1.246 5.087zM9.935 11.37h3.958l.886 1.444a.673.673 0 0 0 .585.316h6.506v1.37H9.935v-3.13zm14.898 3.44a.793.793 0 0 0-.616-.31h-.978v-2.126c0-.379-.275-.613-.653-.613H15.75l-.886-1.445a.673.673 0 0 0-.585-.316H9.232c-.378 0-.667.209-.667.587V14.5h-.782a.793.793 0 0 0-.61.303.795.795 0 0 0-.155.663l1.45 6.633c.078.36.396.618.764.618h13.354c.36 0 .674-.246.76-.595l1.631-6.636a.795.795 0 0 0-.144-.675z",
          fill: "#FFF"
        }))), h2("div", {
          class: "uppy-DashboardTab-name"
        }, _this.props.i18n("myDevice"))));
      };
      _this.renderBrowseButton = function(text, onClickFn) {
        var numberOfAcquirers = _this.props.acquirers.length;
        return h2("button", {
          type: "button",
          class: "uppy-u-reset uppy-Dashboard-browse",
          onclick: onClickFn,
          "data-uppy-super-focusable": numberOfAcquirers === 0
        }, text);
      };
      _this.renderDropPasteBrowseTagline = function() {
        var numberOfAcquirers = _this.props.acquirers.length;
        var lowerFMSelectionType = _this.props.fileManagerSelectionType;
        var camelFMSelectionType = lowerFMSelectionType.charAt(0).toUpperCase() + lowerFMSelectionType.slice(1);
        var browseText = "browse";
        var browseFilesText = "browse";
        var browseFoldersText = "browse";
        if (lowerFMSelectionType === "files") {
          try {
            browseText = _this.props.i18n("browse");
            browseFilesText = _this.props.i18n("browse");
            browseFoldersText = _this.props.i18n("browse");
          } catch (_unused) {}
        }
        try {
          browseFilesText = _this.props.i18n("browseFiles");
          browseFoldersText = _this.props.i18n("browseFolders");
        } catch (_unused2) {}
        var browse = _this.renderBrowseButton(browseText, _this.triggerFileInputClick);
        var browseFiles = _this.renderBrowseButton(browseFilesText, _this.triggerFileInputClick);
        var browseFolders = _this.renderBrowseButton(browseFoldersText, _this.triggerFolderInputClick);
        var titleText;
        if (numberOfAcquirers > 0) {
          titleText = _this.props.i18nArray("dropPasteImport" + camelFMSelectionType, {
            browseFiles,
            browseFolders,
            browse
          });
        } else {
          titleText = _this.props.i18nArray("dropPaste" + camelFMSelectionType, {
            browseFiles,
            browseFolders,
            browse
          });
        }
        if (lowerFMSelectionType === "files") {
          try {
            if (numberOfAcquirers > 0) {
              titleText = _this.props.i18nArray("dropPasteImport", {
                browse
              });
            } else {
              titleText = _this.props.i18nArray("dropPaste", {
                browse
              });
            }
          } catch (_unused3) {}
        }
        return h2("div", {
          class: "uppy-Dashboard-AddFiles-title"
        }, titleText);
      };
      _this.renderAcquirer = function(acquirer) {
        return h2("div", {
          class: "uppy-DashboardTab",
          role: "presentation",
          "data-uppy-acquirer-id": acquirer.id
        }, h2("button", {
          type: "button",
          class: "uppy-DashboardTab-btn",
          role: "tab",
          tabindex: 0,
          "aria-controls": "uppy-DashboardContent-panel--" + acquirer.id,
          "aria-selected": _this.props.activePickerPanel.id === acquirer.id,
          "data-uppy-super-focusable": true,
          onclick: function onclick() {
            return _this.props.showPanel(acquirer.id);
          }
        }, acquirer.icon(), h2("div", {
          class: "uppy-DashboardTab-name"
        }, acquirer.name)));
      };
      _this.renderAcquirers = function(acquirers) {
        var acquirersWithoutLastTwo = [].concat(acquirers);
        var lastTwoAcquirers = acquirersWithoutLastTwo.splice(acquirers.length - 2, acquirers.length);
        return h2("div", {
          class: "uppy-Dashboard-AddFiles-list",
          role: "tablist"
        }, _this.renderMyDeviceAcquirer(), acquirersWithoutLastTwo.map(function(acquirer) {
          return _this.renderAcquirer(acquirer);
        }), h2("span", {
          role: "presentation",
          style: "white-space: nowrap;"
        }, lastTwoAcquirers.map(function(acquirer) {
          return _this.renderAcquirer(acquirer);
        })));
      };
      return _this;
    }
    var _proto = AddFiles2.prototype;
    _proto.renderPoweredByUppy = function renderPoweredByUppy() {
      var uppyBranding = h2("span", null, h2("svg", {
        "aria-hidden": "true",
        focusable: "false",
        class: "uppy-c-icon uppy-Dashboard-poweredByIcon",
        width: "11",
        height: "11",
        viewBox: "0 0 11 11"
      }, h2("path", {
        d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z",
        "fill-rule": "evenodd"
      })), h2("span", {
        class: "uppy-Dashboard-poweredByUppy"
      }, "Uppy"));
      var linkText = this.props.i18nArray("poweredBy2", {
        backwardsCompat: this.props.i18n("poweredBy"),
        uppy: uppyBranding
      });
      return h2("a", {
        tabindex: "-1",
        href: "https://uppy.io",
        rel: "noreferrer noopener",
        target: "_blank",
        class: "uppy-Dashboard-poweredBy"
      }, linkText);
    };
    _proto.render = function render() {
      var _this2 = this;
      return h2("div", {
        class: "uppy-Dashboard-AddFiles"
      }, this.renderHiddenInput(false, function(ref) {
        _this2.fileInput = ref;
      }), this.renderHiddenInput(true, function(ref) {
        _this2.folderInput = ref;
      }), this.renderDropPasteBrowseTagline(), this.props.acquirers.length > 0 && this.renderAcquirers(this.props.acquirers), h2("div", {
        class: "uppy-Dashboard-AddFiles-info"
      }, this.props.note && h2("div", {
        class: "uppy-Dashboard-note"
      }, this.props.note), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy(this.props)));
    };
    return AddFiles2;
  }(Component);
  module.exports = AddFiles;
});

// node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js
var require_AddFilesPanel = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  var AddFiles = require_AddFiles();
  var AddFilesPanel = function AddFilesPanel2(props) {
    return h2("div", {
      class: "uppy-Dashboard-AddFilesPanel",
      "data-uppy-panelType": "AddFiles",
      "aria-hidden": props.showAddFilesPanel
    }, h2("div", {
      class: "uppy-DashboardContent-bar"
    }, h2("div", {
      class: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "1"
    }, props.i18n("addingMoreFiles")), h2("button", {
      class: "uppy-DashboardContent-back",
      type: "button",
      onclick: function onclick(ev) {
        return props.toggleAddFilesPanel(false);
      }
    }, props.i18n("back"))), h2(AddFiles, props));
  };
  module.exports = AddFilesPanel;
});

// node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js
var require_ignoreEvent = __commonJS(function(exports, module) {
  function ignoreEvent(ev) {
    var tagName = ev.target.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA") {
      ev.stopPropagation();
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
  }
  module.exports = ignoreEvent;
});

// node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js
var require_PickerPanelContent = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  var ignoreEvent = require_ignoreEvent();
  function PickerPanelContent(props) {
    return h2("div", {
      class: "uppy-DashboardContent-panel",
      role: "tabpanel",
      "data-uppy-panelType": "PickerPanel",
      id: "uppy-DashboardContent-panel--" + props.activePickerPanel.id,
      onDragOver: ignoreEvent,
      onDragLeave: ignoreEvent,
      onDrop: ignoreEvent,
      onPaste: ignoreEvent
    }, h2("div", {
      class: "uppy-DashboardContent-bar"
    }, h2("div", {
      class: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "1"
    }, props.i18n("importFrom", {
      name: props.activePickerPanel.name
    })), h2("button", {
      class: "uppy-DashboardContent-back",
      type: "button",
      onclick: props.hideAllPanels
    }, props.i18n("done"))), h2("div", {
      class: "uppy-DashboardContent-panelBody"
    }, props.getPlugin(props.activePickerPanel.id).render(props.state)));
  }
  module.exports = PickerPanelContent;
});

// node_modules/@uppy/dashboard/lib/components/EditorPanel.js
var require_EditorPanel = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  function EditorPanel(props) {
    var file = this.props.files[this.props.fileCardFor];
    return h2("div", {
      class: "uppy-DashboardContent-panel",
      role: "tabpanel",
      "data-uppy-panelType": "FileEditor",
      id: "uppy-DashboardContent-panel--editor"
    }, h2("div", {
      class: "uppy-DashboardContent-bar"
    }, h2("div", {
      class: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "1"
    }, props.i18nArray("editing", {
      file: h2("span", {
        class: "uppy-DashboardContent-titleFile"
      }, file.meta ? file.meta.name : file.name)
    })), h2("button", {
      class: "uppy-DashboardContent-back",
      type: "button",
      onclick: props.hideAllPanels
    }, props.i18n("done"))), h2("div", {
      class: "uppy-DashboardContent-panelBody"
    }, props.editors.map(function(target) {
      return props.getPlugin(target.id).render(props.state);
    })));
  }
  module.exports = EditorPanel;
});

// node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js
var require_PickerPanelTopBar = __commonJS(function(exports, module) {
  var _require = require_preact();
  var h2 = _require.h;
  var uploadStates = {
    STATE_ERROR: "error",
    STATE_WAITING: "waiting",
    STATE_PREPROCESSING: "preprocessing",
    STATE_UPLOADING: "uploading",
    STATE_POSTPROCESSING: "postprocessing",
    STATE_COMPLETE: "complete",
    STATE_PAUSED: "paused"
  };
  function getUploadingState(isAllErrored, isAllComplete, isAllPaused, files) {
    if (files === undefined) {
      files = {};
    }
    if (isAllErrored) {
      return uploadStates.STATE_ERROR;
    }
    if (isAllComplete) {
      return uploadStates.STATE_COMPLETE;
    }
    if (isAllPaused) {
      return uploadStates.STATE_PAUSED;
    }
    var state = uploadStates.STATE_WAITING;
    var fileIDs = Object.keys(files);
    for (var i = 0;i < fileIDs.length; i++) {
      var progress = files[fileIDs[i]].progress;
      if (progress.uploadStarted && !progress.uploadComplete) {
        return uploadStates.STATE_UPLOADING;
      }
      if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
        state = uploadStates.STATE_PREPROCESSING;
      }
      if (progress.postprocess && state !== uploadStates.STATE_UPLOADING && state !== uploadStates.STATE_PREPROCESSING) {
        state = uploadStates.STATE_POSTPROCESSING;
      }
    }
    return state;
  }
  function UploadStatus(props) {
    var uploadingState = getUploadingState(props.isAllErrored, props.isAllComplete, props.isAllPaused, props.files);
    switch (uploadingState) {
      case "uploading":
        return props.i18n("uploadingXFiles", {
          smart_count: props.inProgressNotPausedFiles.length
        });
      case "preprocessing":
      case "postprocessing":
        return props.i18n("processingXFiles", {
          smart_count: props.processingFiles.length
        });
      case "paused":
        return props.i18n("uploadPaused");
      case "waiting":
        return props.i18n("xFilesSelected", {
          smart_count: props.newFiles.length
        });
      case "complete":
        return props.i18n("uploadComplete");
    }
  }
  function PanelTopBar(props) {
    var allowNewUpload = props.allowNewUpload;
    if (allowNewUpload && props.maxNumberOfFiles) {
      allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
    }
    return h2("div", {
      class: "uppy-DashboardContent-bar"
    }, !props.isAllComplete && !props.hideCancelButton ? h2("button", {
      class: "uppy-DashboardContent-back",
      type: "button",
      onclick: props.cancelAll
    }, props.i18n("cancel")) : h2("div", null), h2("div", {
      class: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "1"
    }, h2(UploadStatus, props)), allowNewUpload ? h2("button", {
      class: "uppy-DashboardContent-addMore",
      type: "button",
      "aria-label": props.i18n("addMoreFiles"),
      title: props.i18n("addMoreFiles"),
      onclick: function onclick() {
        return props.toggleAddFilesPanel(true);
      }
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "15",
      height: "15",
      viewBox: "0 0 15 15"
    }, h2("path", {
      d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z"
    })), h2("span", {
      class: "uppy-DashboardContent-addMoreCaption"
    }, props.i18n("addMore"))) : h2("div", null));
  }
  module.exports = PanelTopBar;
});

// node_modules/@uppy/dashboard/lib/components/FileCard/index.js
var require_FileCard = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_preact();
  var h2 = _require.h;
  var Component = _require.Component;
  var getFileTypeIcon = require_getFileTypeIcon();
  var ignoreEvent = require_ignoreEvent();
  var FilePreview = require_FilePreview();
  var FileCard = /* @__PURE__ */ function(_Component) {
    _inheritsLoose(FileCard2, _Component);
    function FileCard2(props) {
      var _this;
      _this = _Component.call(this, props) || this;
      _this.saveOnEnter = function(ev) {
        if (ev.keyCode === 13) {
          ev.stopPropagation();
          ev.preventDefault();
          var file = _this.props.files[_this.props.fileCardFor];
          _this.props.saveFileCard(_this.state.formState, file.id);
        }
      };
      _this.updateMeta = function(newVal, name) {
        var _extends2;
        _this.setState({
          formState: _extends({}, _this.state.formState, (_extends2 = {}, _extends2[name] = newVal, _extends2))
        });
      };
      _this.handleSave = function() {
        var fileID = _this.props.fileCardFor;
        _this.props.saveFileCard(_this.state.formState, fileID);
      };
      _this.handleCancel = function() {
        _this.props.toggleFileCard();
      };
      _this.renderMetaFields = function() {
        var metaFields = _this.props.metaFields || [];
        var fieldCSSClasses = {
          text: "uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input"
        };
        return metaFields.map(function(field) {
          var id = "uppy-Dashboard-FileCard-input-" + field.id;
          return h2("fieldset", {
            key: field.id,
            class: "uppy-Dashboard-FileCard-fieldset"
          }, h2("label", {
            class: "uppy-Dashboard-FileCard-label",
            for: id
          }, field.name), field.render !== undefined ? field.render({
            value: _this.state.formState[field.id],
            onChange: function onChange(newVal) {
              return _this.updateMeta(newVal, field.id);
            },
            fieldCSSClasses
          }, h2) : h2("input", {
            class: fieldCSSClasses.text,
            id,
            type: field.type || "text",
            value: _this.state.formState[field.id],
            placeholder: field.placeholder,
            onkeyup: _this.saveOnEnter,
            onkeydown: _this.saveOnEnter,
            onkeypress: _this.saveOnEnter,
            oninput: function oninput(ev) {
              return _this.updateMeta(ev.target.value, field.id);
            },
            "data-uppy-super-focusable": true
          }));
        });
      };
      var _file = _this.props.files[_this.props.fileCardFor];
      var _metaFields = _this.props.metaFields || [];
      var storedMetaData = {};
      _metaFields.forEach(function(field) {
        storedMetaData[field.id] = _file.meta[field.id] || "";
      });
      _this.state = {
        formState: storedMetaData
      };
      return _this;
    }
    var _proto = FileCard2.prototype;
    _proto.render = function render() {
      var _this2 = this;
      var file = this.props.files[this.props.fileCardFor];
      var showEditButton = this.props.canEditFile(file);
      return h2("div", {
        class: "uppy-Dashboard-FileCard",
        "data-uppy-panelType": "FileCard",
        onDragOver: ignoreEvent,
        onDragLeave: ignoreEvent,
        onDrop: ignoreEvent,
        onPaste: ignoreEvent
      }, h2("div", {
        class: "uppy-DashboardContent-bar"
      }, h2("div", {
        class: "uppy-DashboardContent-title",
        role: "heading",
        "aria-level": "1"
      }, this.props.i18nArray("editing", {
        file: h2("span", {
          class: "uppy-DashboardContent-titleFile"
        }, file.meta ? file.meta.name : file.name)
      })), h2("button", {
        class: "uppy-DashboardContent-back",
        type: "button",
        title: this.props.i18n("finishEditingFile"),
        onclick: this.handleSave
      }, this.props.i18n("done"))), h2("div", {
        class: "uppy-Dashboard-FileCard-inner"
      }, h2("div", {
        class: "uppy-Dashboard-FileCard-preview",
        style: {
          backgroundColor: getFileTypeIcon(file.type).color
        }
      }, h2(FilePreview, {
        file
      }), showEditButton && h2("button", {
        type: "button",
        class: "uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit",
        onClick: function onClick() {
          return _this2.props.openFileEditor(file);
        }
      }, this.props.i18n("editFile"))), h2("div", {
        class: "uppy-Dashboard-FileCard-info"
      }, this.renderMetaFields()), h2("div", {
        class: "uppy-Dashboard-FileCard-actions"
      }, h2("button", {
        class: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn",
        type: "button",
        onclick: this.handleSave
      }, this.props.i18n("saveChanges")), h2("button", {
        class: "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn",
        type: "button",
        onclick: this.handleCancel
      }, this.props.i18n("cancel")))));
    };
    return FileCard2;
  }(Component);
  module.exports = FileCard;
});

// node_modules/@uppy/utils/lib/isDragDropSupported.js
var require_isDragDropSupported = __commonJS(function(exports, module) {
  module.exports = function isDragDropSupported() {
    var div = document.createElement("div");
    if (!("draggable" in div) || !(("ondragstart" in div) && ("ondrop" in div))) {
      return false;
    }
    if (!("FormData" in window)) {
      return false;
    }
    if (!("FileReader" in window)) {
      return false;
    }
    return true;
  };
});

// node_modules/preact-css-transition-group/dist/preact-css-transition-group.js
var require_preact_css_transition_group = __commonJS(function(exports, module) {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_preact()) : typeof define === "function" && define.amd ? define(["preact"], factory) : global2.PreactCSSTransitionGroup = factory(global2.preact);
  })(exports, function(preact) {
    function getKey(vnode) {
      return vnode.attributes && vnode.attributes.key;
    }
    function getComponentBase(component) {
      return component.base;
    }
    function onlyChild(children) {
      return children && children[0];
    }
    function filterNullChildren(children) {
      return children && children.filter(function(i) {
        return i !== null;
      });
    }
    function find(arr, iter) {
      for (var i = arr.length;i--; ) {
        if (iter(arr[i]))
          return true;
      }
      return false;
    }
    function inChildrenByKey(children, key) {
      return find(children, function(c) {
        return getKey(c) === key;
      });
    }
    function inChildren(children, child) {
      return inChildrenByKey(children, getKey(child));
    }
    function isShownInChildrenByKey(children, key, showProp) {
      return find(children, function(c) {
        return getKey(c) === key && c.props[showProp];
      });
    }
    function isShownInChildren(children, child, showProp) {
      return isShownInChildrenByKey(children, getKey(child), showProp);
    }
    function mergeChildMappings(prev, next) {
      var ret = [];
      var nextChildrenPending = {}, pendingChildren = [];
      prev.forEach(function(c) {
        var key = getKey(c);
        if (inChildrenByKey(next, key)) {
          if (pendingChildren.length) {
            nextChildrenPending[key] = pendingChildren;
            pendingChildren = [];
          }
        } else {
          pendingChildren.push(c);
        }
      });
      next.forEach(function(c) {
        var key = getKey(c);
        if (nextChildrenPending.hasOwnProperty(key)) {
          ret = ret.concat(nextChildrenPending[key]);
        }
        ret.push(c);
      });
      return ret.concat(pendingChildren);
    }
    var SPACE = " ";
    var RE_CLASS = /[\n\t\r]+/g;
    var norm = function(elemClass) {
      return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
    };
    function addClass(elem, className) {
      if (elem.classList) {
        var _elem$classList;
        (_elem$classList = elem.classList).add.apply(_elem$classList, className.split(" "));
      } else {
        elem.className += " " + className;
      }
    }
    function removeClass(elem, needle) {
      needle = needle.trim();
      if (elem.classList) {
        var _elem$classList2;
        (_elem$classList2 = elem.classList).remove.apply(_elem$classList2, needle.split(" "));
      } else {
        var elemClass = elem.className.trim();
        var className = norm(elemClass);
        needle = SPACE + needle + SPACE;
        while (className.indexOf(needle) >= 0) {
          className = className.replace(needle, SPACE);
        }
        elem.className = className.trim();
      }
    }
    var EVENT_NAME_MAP = {
      transitionend: {
        transition: "transitionend",
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "mozTransitionEnd",
        OTransition: "oTransitionEnd",
        msTransition: "MSTransitionEnd"
      },
      animationend: {
        animation: "animationend",
        WebkitAnimation: "webkitAnimationEnd",
        MozAnimation: "mozAnimationEnd",
        OAnimation: "oAnimationEnd",
        msAnimation: "MSAnimationEnd"
      }
    };
    var endEvents = [];
    function detectEvents() {
      var testEl = document.createElement("div"), style = testEl.style;
      if (!("AnimationEvent" in window)) {
        delete EVENT_NAME_MAP.animationend.animation;
      }
      if (!("TransitionEvent" in window)) {
        delete EVENT_NAME_MAP.transitionend.transition;
      }
      for (var baseEventName in EVENT_NAME_MAP) {
        var baseEvents = EVENT_NAME_MAP[baseEventName];
        for (var styleName in baseEvents) {
          if (styleName in style) {
            endEvents.push(baseEvents[styleName]);
            break;
          }
        }
      }
    }
    if (typeof window !== "undefined") {
      detectEvents();
    }
    function addEndEventListener(node, eventListener) {
      if (!endEvents.length) {
        return window.setTimeout(eventListener, 0);
      }
      endEvents.forEach(function(endEvent) {
        node.addEventListener(endEvent, eventListener, false);
      });
    }
    function removeEndEventListener(node, eventListener) {
      if (!endEvents.length)
        return;
      endEvents.forEach(function(endEvent) {
        node.removeEventListener(endEvent, eventListener, false);
      });
    }
    var classCallCheck = function(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
    var inherits = function(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };
    var objectWithoutProperties = function(obj, keys) {
      var target = {};
      for (var i in obj) {
        if (keys.indexOf(i) >= 0)
          continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i))
          continue;
        target[i] = obj[i];
      }
      return target;
    };
    var possibleConstructorReturn = function(self2, call) {
      if (!self2) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return call && (typeof call === "object" || typeof call === "function") ? call : self2;
    };
    var TICK = 17;
    var CSSTransitionGroupChild = function(_Component) {
      inherits(CSSTransitionGroupChild2, _Component);
      function CSSTransitionGroupChild2() {
        var _temp, _this, _ret;
        classCallCheck(this, CSSTransitionGroupChild2);
        for (var _len = arguments.length, args = Array(_len), _key = 0;_key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.flushClassNameQueue = function() {
          if (getComponentBase(_this)) {
            addClass(getComponentBase(_this), _this.classNameQueue.join(" "));
          }
          _this.classNameQueue.length = 0;
          _this.timeout = null;
        }, _temp), possibleConstructorReturn(_this, _ret);
      }
      CSSTransitionGroupChild2.prototype.transition = function transition(animationType, finishCallback, timeout) {
        var _this2 = this;
        var node = getComponentBase(this);
        var className = this.props.name[animationType] || this.props.name + "-" + animationType;
        var activeClassName = this.props.name[animationType + "Active"] || className + "-active";
        var timer = null;
        if (this.endListener) {
          this.endListener();
        }
        this.endListener = function(e) {
          if (e && e.target !== node)
            return;
          clearTimeout(timer);
          removeClass(node, className);
          removeClass(node, activeClassName);
          removeEndEventListener(node, _this2.endListener);
          _this2.endListener = null;
          if (finishCallback) {
            finishCallback();
          }
        };
        if (timeout) {
          timer = setTimeout(this.endListener, timeout);
          this.transitionTimeouts.push(timer);
        } else {
          addEndEventListener(node, this.endListener);
        }
        addClass(node, className);
        this.queueClass(activeClassName);
      };
      CSSTransitionGroupChild2.prototype.queueClass = function queueClass(className) {
        this.classNameQueue.push(className);
        if (!this.timeout) {
          this.timeout = setTimeout(this.flushClassNameQueue, TICK);
        }
      };
      CSSTransitionGroupChild2.prototype.stop = function stop() {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.classNameQueue.length = 0;
          this.timeout = null;
        }
        if (this.endListener) {
          this.endListener();
        }
      };
      CSSTransitionGroupChild2.prototype.componentWillMount = function componentWillMount() {
        this.classNameQueue = [];
        this.transitionTimeouts = [];
      };
      CSSTransitionGroupChild2.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.transitionTimeouts.forEach(function(timeout) {
          clearTimeout(timeout);
        });
      };
      CSSTransitionGroupChild2.prototype.componentWillEnter = function componentWillEnter(done) {
        if (this.props.enter) {
          this.transition("enter", done, this.props.enterTimeout);
        } else {
          done();
        }
      };
      CSSTransitionGroupChild2.prototype.componentWillLeave = function componentWillLeave(done) {
        if (this.props.leave) {
          this.transition("leave", done, this.props.leaveTimeout);
        } else {
          done();
        }
      };
      CSSTransitionGroupChild2.prototype.render = function render() {
        return onlyChild(this.props.children);
      };
      return CSSTransitionGroupChild2;
    }(preact.Component);
    var CSSTransitionGroup = function(_Component) {
      inherits(CSSTransitionGroup2, _Component);
      function CSSTransitionGroup2(props) {
        classCallCheck(this, CSSTransitionGroup2);
        var _this = possibleConstructorReturn(this, _Component.call(this));
        _this.renderChild = function(child) {
          var _this$props = _this.props;
          var transitionName = _this$props.transitionName;
          var transitionEnter = _this$props.transitionEnter;
          var transitionLeave = _this$props.transitionLeave;
          var transitionEnterTimeout = _this$props.transitionEnterTimeout;
          var transitionLeaveTimeout = _this$props.transitionLeaveTimeout;
          var key = getKey(child);
          return preact.h(CSSTransitionGroupChild, {
            key,
            ref: function(c) {
              if (!(_this.refs[key] = c))
                child = null;
            },
            name: transitionName,
            enter: transitionEnter,
            leave: transitionLeave,
            enterTimeout: transitionEnterTimeout,
            leaveTimeout: transitionLeaveTimeout
          }, child);
        };
        _this.refs = {};
        _this.state = {
          children: (props.children || []).slice()
        };
        return _this;
      }
      CSSTransitionGroup2.prototype.shouldComponentUpdate = function shouldComponentUpdate(_, _ref) {
        var children = _ref.children;
        return children !== this.state.children;
      };
      CSSTransitionGroup2.prototype.componentWillMount = function componentWillMount() {
        this.currentlyTransitioningKeys = {};
        this.keysToEnter = [];
        this.keysToLeave = [];
      };
      CSSTransitionGroup2.prototype.componentWillReceiveProps = function componentWillReceiveProps(_ref2) {
        var _this2 = this;
        var children = _ref2.children;
        var exclusive = _ref2.exclusive;
        var showProp = _ref2.showProp;
        var nextChildMapping = filterNullChildren(children || []).slice();
        var prevChildMapping = filterNullChildren(exclusive ? this.props.children : this.state.children);
        var newChildren = mergeChildMappings(prevChildMapping, nextChildMapping);
        if (showProp) {
          newChildren = newChildren.map(function(c) {
            if (!c.props[showProp] && isShownInChildren(prevChildMapping, c, showProp)) {
              var _cloneElement;
              c = preact.cloneElement(c, (_cloneElement = {}, _cloneElement[showProp] = true, _cloneElement));
            }
            return c;
          });
        }
        if (exclusive) {
          newChildren.forEach(function(c) {
            return _this2.stop(getKey(c));
          });
        }
        this.setState({ children: newChildren });
        this.forceUpdate();
        nextChildMapping.forEach(function(c) {
          var key = c.key;
          var hasPrev = prevChildMapping && inChildren(prevChildMapping, c);
          if (showProp) {
            if (hasPrev) {
              var showInPrev = isShownInChildren(prevChildMapping, c, showProp), showInNow = c.props[showProp];
              if (!showInPrev && showInNow && !_this2.currentlyTransitioningKeys[key]) {
                _this2.keysToEnter.push(key);
              }
            }
          } else if (!hasPrev && !_this2.currentlyTransitioningKeys[key]) {
            _this2.keysToEnter.push(key);
          }
        });
        prevChildMapping.forEach(function(c) {
          var key = c.key;
          var hasNext = nextChildMapping && inChildren(nextChildMapping, c);
          if (showProp) {
            if (hasNext) {
              var showInNext = isShownInChildren(nextChildMapping, c, showProp);
              var showInNow = c.props[showProp];
              if (!showInNext && showInNow && !_this2.currentlyTransitioningKeys[key]) {
                _this2.keysToLeave.push(key);
              }
            }
          } else if (!hasNext && !_this2.currentlyTransitioningKeys[key]) {
            _this2.keysToLeave.push(key);
          }
        });
      };
      CSSTransitionGroup2.prototype.performEnter = function performEnter(key) {
        var _this3 = this;
        this.currentlyTransitioningKeys[key] = true;
        var component = this.refs[key];
        if (component.componentWillEnter) {
          component.componentWillEnter(function() {
            return _this3._handleDoneEntering(key);
          });
        } else {
          this._handleDoneEntering(key);
        }
      };
      CSSTransitionGroup2.prototype._handleDoneEntering = function _handleDoneEntering(key) {
        delete this.currentlyTransitioningKeys[key];
        var currentChildMapping = filterNullChildren(this.props.children), showProp = this.props.showProp;
        if (!currentChildMapping || !showProp && !inChildrenByKey(currentChildMapping, key) || showProp && !isShownInChildrenByKey(currentChildMapping, key, showProp)) {
          this.performLeave(key);
        } else {
          this.setState({ children: currentChildMapping });
        }
      };
      CSSTransitionGroup2.prototype.stop = function stop(key) {
        delete this.currentlyTransitioningKeys[key];
        var component = this.refs[key];
        if (component)
          component.stop();
      };
      CSSTransitionGroup2.prototype.performLeave = function performLeave(key) {
        var _this4 = this;
        this.currentlyTransitioningKeys[key] = true;
        var component = this.refs[key];
        if (component && component.componentWillLeave) {
          component.componentWillLeave(function() {
            return _this4._handleDoneLeaving(key);
          });
        } else {
          this._handleDoneLeaving(key);
        }
      };
      CSSTransitionGroup2.prototype._handleDoneLeaving = function _handleDoneLeaving(key) {
        delete this.currentlyTransitioningKeys[key];
        var showProp = this.props.showProp, currentChildMapping = filterNullChildren(this.props.children);
        if (showProp && currentChildMapping && isShownInChildrenByKey(currentChildMapping, key, showProp)) {
          this.performEnter(key);
        } else if (!showProp && currentChildMapping && inChildrenByKey(currentChildMapping, key)) {
          this.performEnter(key);
        } else {
          this.setState({ children: currentChildMapping });
        }
      };
      CSSTransitionGroup2.prototype.componentDidUpdate = function componentDidUpdate() {
        var _this5 = this;
        var keysToEnter = this.keysToEnter;
        var keysToLeave = this.keysToLeave;
        this.keysToEnter = [];
        keysToEnter.forEach(function(k) {
          return _this5.performEnter(k);
        });
        this.keysToLeave = [];
        keysToLeave.forEach(function(k) {
          return _this5.performLeave(k);
        });
      };
      CSSTransitionGroup2.prototype.render = function render(_ref3, _ref4) {
        var Component = _ref3.component;
        var transitionName = _ref3.transitionName;
        var transitionEnter = _ref3.transitionEnter;
        var transitionLeave = _ref3.transitionLeave;
        var transitionEnterTimeout = _ref3.transitionEnterTimeout;
        var transitionLeaveTimeout = _ref3.transitionLeaveTimeout;
        var c = _ref3.children;
        var props = objectWithoutProperties(_ref3, ["component", "transitionName", "transitionEnter", "transitionLeave", "transitionEnterTimeout", "transitionLeaveTimeout", "children"]);
        var children = _ref4.children;
        return preact.h(Component, props, filterNullChildren(children).map(this.renderChild));
      };
      return CSSTransitionGroup2;
    }(preact.Component);
    CSSTransitionGroup.defaultProps = {
      component: "span",
      transitionEnter: true,
      transitionLeave: true
    };
    return CSSTransitionGroup;
  });
});

// node_modules/@uppy/dashboard/lib/components/Dashboard.js
var require_Dashboard = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var FileList = require_FileList();
  var AddFiles = require_AddFiles();
  var AddFilesPanel = require_AddFilesPanel();
  var PickerPanelContent = require_PickerPanelContent();
  var EditorPanel = require_EditorPanel();
  var PanelTopBar = require_PickerPanelTopBar();
  var FileCard = require_FileCard();
  var classNames = require_classnames();
  var isDragDropSupported = require_isDragDropSupported();
  var _require = require_preact();
  var h2 = _require.h;
  var PreactCSSTransitionGroup = require_preact_css_transition_group();
  function TransitionWrapper(props) {
    return h2(PreactCSSTransitionGroup, {
      transitionName: "uppy-transition-slideDownUp",
      transitionEnterTimeout: 250,
      transitionLeaveTimeout: 250
    }, props.children);
  }
  var WIDTH_XL = 900;
  var WIDTH_LG = 700;
  var WIDTH_MD = 576;
  var HEIGHT_MD = 400;
  module.exports = function Dashboard(props) {
    var noFiles = props.totalFileCount === 0;
    var isSizeMD = props.containerWidth > WIDTH_MD;
    var dashboardClassName = classNames({
      "uppy-Root": props.isTargetDOMEl,
      "uppy-Dashboard": true,
      "uppy-Dashboard--animateOpenClose": props.animateOpenClose,
      "uppy-Dashboard--isClosing": props.isClosing,
      "uppy-Dashboard--isDraggingOver": props.isDraggingOver,
      "uppy-Dashboard--modal": !props.inline,
      "uppy-size--md": props.containerWidth > WIDTH_MD,
      "uppy-size--lg": props.containerWidth > WIDTH_LG,
      "uppy-size--xl": props.containerWidth > WIDTH_XL,
      "uppy-size--height-md": props.containerHeight > HEIGHT_MD,
      "uppy-Dashboard--isAddFilesPanelVisible": props.showAddFilesPanel,
      "uppy-Dashboard--isInnerWrapVisible": props.areInsidesReadyToBeVisible
    });
    var itemsPerRow = 1;
    if (props.containerWidth > WIDTH_XL) {
      itemsPerRow = 5;
    } else if (props.containerWidth > WIDTH_LG) {
      itemsPerRow = 4;
    } else if (props.containerWidth > WIDTH_MD) {
      itemsPerRow = 3;
    }
    var showFileList = props.showSelectedFiles && !noFiles;
    return h2("div", {
      class: dashboardClassName,
      "data-uppy-theme": props.theme,
      "data-uppy-num-acquirers": props.acquirers.length,
      "data-uppy-drag-drop-supported": isDragDropSupported(),
      "aria-hidden": props.inline ? "false" : props.isHidden,
      "aria-label": !props.inline ? props.i18n("dashboardWindowTitle") : props.i18n("dashboardTitle"),
      onpaste: props.handlePaste,
      onDragOver: props.handleDragOver,
      onDragLeave: props.handleDragLeave,
      onDrop: props.handleDrop
    }, h2("div", {
      class: "uppy-Dashboard-overlay",
      tabindex: -1,
      onclick: props.handleClickOutside
    }), h2("div", {
      class: "uppy-Dashboard-inner",
      "aria-modal": !props.inline && "true",
      role: !props.inline && "dialog",
      style: {
        width: props.inline && props.width ? props.width : "",
        height: props.inline && props.height ? props.height : ""
      }
    }, !props.inline ? h2("button", {
      class: "uppy-u-reset uppy-Dashboard-close",
      type: "button",
      "aria-label": props.i18n("closeModal"),
      title: props.i18n("closeModal"),
      onclick: props.closeModal
    }, h2("span", {
      "aria-hidden": "true"
    }, "×")) : null, h2("div", {
      class: "uppy-Dashboard-innerWrap"
    }, h2("div", {
      class: "uppy-Dashboard-dropFilesHereHint"
    }, props.i18n("dropHint")), showFileList && h2(PanelTopBar, props), showFileList ? h2(FileList, _extends({}, props, {
      itemsPerRow
    })) : h2(AddFiles, _extends({}, props, {
      isSizeMD
    })), h2(TransitionWrapper, null, props.showAddFilesPanel ? h2(AddFilesPanel, _extends({
      key: "AddFiles"
    }, props, {
      isSizeMD
    })) : null), h2(TransitionWrapper, null, props.fileCardFor ? h2(FileCard, _extends({
      key: "FileCard"
    }, props)) : null), h2(TransitionWrapper, null, props.activePickerPanel ? h2(PickerPanelContent, _extends({
      key: "Picker"
    }, props)) : null), h2(TransitionWrapper, null, props.showFileEditor ? h2(EditorPanel, _extends({
      key: "Editor"
    }, props)) : null), h2("div", {
      class: "uppy-Dashboard-progressindicators"
    }, props.progressindicators.map(function(target) {
      return props.getPlugin(target.id).render(props.state);
    })))));
  };
});

// node_modules/@uppy/status-bar/lib/StatusBarStates.js
var require_StatusBarStates = __commonJS(function(exports, module) {
  module.exports = {
    STATE_ERROR: "error",
    STATE_WAITING: "waiting",
    STATE_PREPROCESSING: "preprocessing",
    STATE_UPLOADING: "uploading",
    STATE_POSTPROCESSING: "postprocessing",
    STATE_COMPLETE: "complete"
  };
});

// node_modules/@uppy/utils/lib/secondsToTime.js
var require_secondsToTime = __commonJS(function(exports, module) {
  module.exports = function secondsToTime(rawSeconds) {
    var hours = Math.floor(rawSeconds / 3600) % 24;
    var minutes = Math.floor(rawSeconds / 60) % 60;
    var seconds = Math.floor(rawSeconds % 60);
    return {
      hours,
      minutes,
      seconds
    };
  };
});

// node_modules/@uppy/utils/lib/prettyETA.js
var require_prettyETA = __commonJS(function(exports, module) {
  var secondsToTime = require_secondsToTime();
  module.exports = function prettyETA(seconds) {
    var time = secondsToTime(seconds);
    var hoursStr = time.hours ? time.hours + "h " : "";
    var minutesVal = time.hours ? ("0" + time.minutes).substr(-2) : time.minutes;
    var minutesStr = minutesVal ? minutesVal + "m" : "";
    var secondsVal = minutesVal ? ("0" + time.seconds).substr(-2) : time.seconds;
    var secondsStr = time.hours ? "" : minutesVal ? " " + secondsVal + "s" : secondsVal + "s";
    return "" + hoursStr + minutesStr + secondsStr;
  };
});

// node_modules/@uppy/status-bar/lib/StatusBar.js
var require_StatusBar = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var throttle = require_lodash();
  var classNames = require_classnames();
  var statusBarStates = require_StatusBarStates();
  var prettierBytes = require_prettierBytes();
  var prettyETA = require_prettyETA();
  var _require = require_preact();
  var h2 = _require.h;
  function calculateProcessingProgress(files) {
    var progresses = [];
    Object.keys(files).forEach(function(fileID) {
      var progress = files[fileID].progress;
      if (progress.preprocess) {
        progresses.push(progress.preprocess);
      }
      if (progress.postprocess) {
        progresses.push(progress.postprocess);
      }
    });
    var _progresses$ = progresses[0], mode = _progresses$.mode, message = _progresses$.message;
    var value = progresses.filter(isDeterminate).reduce(function(total, progress, index, all) {
      return total + progress.value / all.length;
    }, 0);
    function isDeterminate(progress) {
      return progress.mode === "determinate";
    }
    return {
      mode,
      message,
      value
    };
  }
  function togglePauseResume(props) {
    if (props.isAllComplete)
      return;
    if (!props.resumableUploads) {
      return props.cancelAll();
    }
    if (props.isAllPaused) {
      return props.resumeAll();
    }
    return props.pauseAll();
  }
  module.exports = function(props) {
    props = props || {};
    var _props = props, newFiles = _props.newFiles, allowNewUpload = _props.allowNewUpload, isUploadInProgress = _props.isUploadInProgress, isAllPaused = _props.isAllPaused, resumableUploads = _props.resumableUploads, error = _props.error, hideUploadButton = _props.hideUploadButton, hidePauseResumeButton = _props.hidePauseResumeButton, hideCancelButton = _props.hideCancelButton, hideRetryButton = _props.hideRetryButton;
    var uploadState = props.uploadState;
    var progressValue = props.totalProgress;
    var progressMode;
    var progressBarContent;
    if (uploadState === statusBarStates.STATE_PREPROCESSING || uploadState === statusBarStates.STATE_POSTPROCESSING) {
      var progress = calculateProcessingProgress(props.files);
      progressMode = progress.mode;
      if (progressMode === "determinate") {
        progressValue = progress.value * 100;
      }
      progressBarContent = ProgressBarProcessing(progress);
    } else if (uploadState === statusBarStates.STATE_COMPLETE) {
      progressBarContent = ProgressBarComplete(props);
    } else if (uploadState === statusBarStates.STATE_UPLOADING) {
      if (!props.supportsUploadProgress) {
        progressMode = "indeterminate";
        progressValue = null;
      }
      progressBarContent = ProgressBarUploading(props);
    } else if (uploadState === statusBarStates.STATE_ERROR) {
      progressValue = undefined;
      progressBarContent = ProgressBarError(props);
    }
    var width = typeof progressValue === "number" ? progressValue : 100;
    var isHidden = uploadState === statusBarStates.STATE_WAITING && props.hideUploadButton || uploadState === statusBarStates.STATE_WAITING && !props.newFiles > 0 || uploadState === statusBarStates.STATE_COMPLETE && props.hideAfterFinish;
    var showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
    var showCancelBtn = !hideCancelButton && uploadState !== statusBarStates.STATE_WAITING && uploadState !== statusBarStates.STATE_COMPLETE;
    var showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === statusBarStates.STATE_UPLOADING;
    var showRetryBtn = error && !hideRetryButton;
    var progressClassNames = `uppy-StatusBar-progress
                           ` + (progressMode ? "is-" + progressMode : "");
    var statusBarClassNames = classNames({
      "uppy-Root": props.isTargetDOMEl
    }, "uppy-StatusBar", "is-" + uploadState);
    return h2("div", {
      class: statusBarClassNames,
      "aria-hidden": isHidden
    }, h2("div", {
      class: progressClassNames,
      style: {
        width: width + "%"
      },
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": progressValue
    }), progressBarContent, h2("div", {
      class: "uppy-StatusBar-actions"
    }, showUploadBtn ? h2(UploadBtn, _extends({}, props, {
      uploadState
    })) : null, showRetryBtn ? h2(RetryBtn, props) : null, showPauseResumeBtn ? h2(PauseResumeButton, props) : null, showCancelBtn ? h2(CancelBtn, props) : null));
  };
  var UploadBtn = function UploadBtn2(props) {
    var uploadBtnClassNames = classNames("uppy-u-reset", "uppy-c-btn", "uppy-StatusBar-actionBtn", "uppy-StatusBar-actionBtn--upload", {
      "uppy-c-btn-primary": props.uploadState === statusBarStates.STATE_WAITING
    });
    return h2("button", {
      type: "button",
      class: uploadBtnClassNames,
      "aria-label": props.i18n("uploadXFiles", {
        smart_count: props.newFiles
      }),
      onclick: props.startUpload,
      "data-uppy-super-focusable": true
    }, props.newFiles && props.isUploadStarted ? props.i18n("uploadXNewFiles", {
      smart_count: props.newFiles
    }) : props.i18n("uploadXFiles", {
      smart_count: props.newFiles
    }));
  };
  var RetryBtn = function RetryBtn2(props) {
    return h2("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
      "aria-label": props.i18n("retryUpload"),
      onclick: props.retryAll,
      "data-uppy-super-focusable": true
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "8",
      height: "10",
      viewBox: "0 0 8 10"
    }, h2("path", {
      d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
    })), props.i18n("retry"));
  };
  var CancelBtn = function CancelBtn2(props) {
    return h2("button", {
      type: "button",
      class: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
      title: props.i18n("cancel"),
      "aria-label": props.i18n("cancel"),
      onclick: props.cancelAll,
      "data-uppy-super-focusable": true
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, h2("g", {
      fill: "none",
      "fill-rule": "evenodd"
    }, h2("circle", {
      fill: "#888",
      cx: "8",
      cy: "8",
      r: "8"
    }), h2("path", {
      fill: "#FFF",
      d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
    }))));
  };
  var PauseResumeButton = function PauseResumeButton2(props) {
    var { isAllPaused, i18n } = props;
    var title = isAllPaused ? i18n("resume") : i18n("pause");
    return h2("button", {
      title,
      "aria-label": title,
      class: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
      type: "button",
      onclick: function onclick() {
        return togglePauseResume(props);
      },
      "data-uppy-super-focusable": true
    }, isAllPaused ? h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, h2("g", {
      fill: "none",
      "fill-rule": "evenodd"
    }, h2("circle", {
      fill: "#888",
      cx: "8",
      cy: "8",
      r: "8"
    }), h2("path", {
      fill: "#FFF",
      d: "M6 4.25L11.5 8 6 11.75z"
    }))) : h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-c-icon",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, h2("g", {
      fill: "none",
      "fill-rule": "evenodd"
    }, h2("circle", {
      fill: "#888",
      cx: "8",
      cy: "8",
      r: "8"
    }), h2("path", {
      d: "M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z",
      fill: "#FFF"
    }))));
  };
  var LoadingSpinner = function LoadingSpinner2() {
    return h2("svg", {
      class: "uppy-StatusBar-spinner",
      "aria-hidden": "true",
      focusable: "false",
      width: "14",
      height: "14"
    }, h2("path", {
      d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
      "fill-rule": "evenodd"
    }));
  };
  var ProgressBarProcessing = function ProgressBarProcessing2(props) {
    var value = Math.round(props.value * 100);
    return h2("div", {
      class: "uppy-StatusBar-content"
    }, h2(LoadingSpinner, null), props.mode === "determinate" ? value + "% · " : "", props.message);
  };
  var renderDot = function renderDot2() {
    return " · ";
  };
  var ProgressDetails = function ProgressDetails2(props) {
    var ifShowFilesUploadedOfTotal = props.numUploads > 1;
    return h2("div", {
      class: "uppy-StatusBar-statusSecondary"
    }, ifShowFilesUploadedOfTotal && props.i18n("filesUploadedOfTotal", {
      complete: props.complete,
      smart_count: props.numUploads
    }), h2("span", {
      class: "uppy-StatusBar-additionalInfo"
    }, ifShowFilesUploadedOfTotal && renderDot(), props.i18n("dataUploadedOfTotal", {
      complete: prettierBytes(props.totalUploadedSize),
      total: prettierBytes(props.totalSize)
    }), renderDot(), props.i18n("xTimeLeft", {
      time: prettyETA(props.totalETA)
    })));
  };
  var UnknownProgressDetails = function UnknownProgressDetails2(props) {
    return h2("div", {
      class: "uppy-StatusBar-statusSecondary"
    }, props.i18n("filesUploadedOfTotal", {
      complete: props.complete,
      smart_count: props.numUploads
    }));
  };
  var UploadNewlyAddedFiles = function UploadNewlyAddedFiles2(props) {
    var uploadBtnClassNames = classNames("uppy-u-reset", "uppy-c-btn", "uppy-StatusBar-actionBtn", "uppy-StatusBar-actionBtn--uploadNewlyAdded");
    return h2("div", {
      class: "uppy-StatusBar-statusSecondary"
    }, h2("div", {
      class: "uppy-StatusBar-statusSecondaryHint"
    }, props.i18n("xMoreFilesAdded", {
      smart_count: props.newFiles
    })), h2("button", {
      type: "button",
      class: uploadBtnClassNames,
      "aria-label": props.i18n("uploadXFiles", {
        smart_count: props.newFiles
      }),
      onclick: props.startUpload
    }, props.i18n("upload")));
  };
  var ThrottledProgressDetails = throttle(ProgressDetails, 500, {
    leading: true,
    trailing: true
  });
  var ProgressBarUploading = function ProgressBarUploading2(props) {
    if (!props.isUploadStarted || props.isAllComplete) {
      return null;
    }
    var title = props.isAllPaused ? props.i18n("paused") : props.i18n("uploading");
    var showUploadNewlyAddedFiles = props.newFiles && props.isUploadStarted;
    return h2("div", {
      class: "uppy-StatusBar-content",
      "aria-label": title,
      title
    }, !props.isAllPaused ? h2(LoadingSpinner, null) : null, h2("div", {
      class: "uppy-StatusBar-status"
    }, h2("div", {
      class: "uppy-StatusBar-statusPrimary"
    }, props.supportsUploadProgress ? title + ": " + props.totalProgress + "%" : title), !props.isAllPaused && !showUploadNewlyAddedFiles && props.showProgressDetails ? props.supportsUploadProgress ? h2(ThrottledProgressDetails, props) : h2(UnknownProgressDetails, props) : null, showUploadNewlyAddedFiles ? h2(UploadNewlyAddedFiles, props) : null));
  };
  var ProgressBarComplete = function ProgressBarComplete2(_ref) {
    var { totalProgress, i18n } = _ref;
    return h2("div", {
      class: "uppy-StatusBar-content",
      role: "status",
      title: i18n("complete")
    }, h2("div", {
      class: "uppy-StatusBar-status"
    }, h2("div", {
      class: "uppy-StatusBar-statusPrimary"
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-StatusBar-statusIndicator uppy-c-icon",
      width: "15",
      height: "11",
      viewBox: "0 0 15 11"
    }, h2("path", {
      d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
    })), i18n("complete"))));
  };
  var ProgressBarError = function ProgressBarError2(_ref2) {
    var { error, retryAll, hideRetryButton, i18n } = _ref2;
    function displayErrorAlert() {
      var errorMessage = i18n("uploadFailed") + ` 

 ` + error;
      alert(errorMessage);
    }
    return h2("div", {
      class: "uppy-StatusBar-content",
      role: "alert",
      title: i18n("uploadFailed")
    }, h2("div", {
      class: "uppy-StatusBar-status"
    }, h2("div", {
      class: "uppy-StatusBar-statusPrimary"
    }, h2("svg", {
      "aria-hidden": "true",
      focusable: "false",
      class: "uppy-StatusBar-statusIndicator uppy-c-icon",
      width: "11",
      height: "11",
      viewBox: "0 0 11 11"
    }, h2("path", {
      d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
    })), i18n("uploadFailed"))), h2("span", {
      class: "uppy-StatusBar-details",
      "aria-label": error,
      "data-microtip-position": "top-right",
      "data-microtip-size": "medium",
      role: "tooltip",
      onclick: displayErrorAlert
    }, "?"));
  };
});

// node_modules/@uppy/utils/lib/getSpeed.js
var require_getSpeed = __commonJS(function(exports, module) {
  module.exports = function getSpeed(fileProgress) {
    if (!fileProgress.bytesUploaded)
      return 0;
    var timeElapsed = new Date - fileProgress.uploadStarted;
    var uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
    return uploadSpeed;
  };
});

// node_modules/@uppy/utils/lib/getBytesRemaining.js
var require_getBytesRemaining = __commonJS(function(exports, module) {
  module.exports = function getBytesRemaining(fileProgress) {
    return fileProgress.bytesTotal - fileProgress.bytesUploaded;
  };
});

// node_modules/@uppy/status-bar/lib/index.js
var require_lib3 = __commonJS(function(exports, module) {
  var _class;
  var _temp;
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _assertThisInitialized(self2) {
    if (self2 === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_lib2();
  var Plugin = _require.Plugin;
  var Translator = require_Translator();
  var StatusBarUI = require_StatusBar();
  var statusBarStates = require_StatusBarStates();
  var getSpeed = require_getSpeed();
  var getBytesRemaining = require_getBytesRemaining();
  module.exports = (_temp = _class = /* @__PURE__ */ function(_Plugin) {
    _inheritsLoose(StatusBar, _Plugin);
    function StatusBar(uppy, opts) {
      var _this;
      _this = _Plugin.call(this, uppy, opts) || this;
      _this.startUpload = function() {
        return _this.uppy.upload().catch(function() {});
      };
      _this.id = _this.opts.id || "StatusBar";
      _this.title = "StatusBar";
      _this.type = "progressindicator";
      _this.defaultLocale = {
        strings: {
          uploading: "Uploading",
          upload: "Upload",
          complete: "Complete",
          uploadFailed: "Upload failed",
          paused: "Paused",
          retry: "Retry",
          retryUpload: "Retry upload",
          cancel: "Cancel",
          pause: "Pause",
          resume: "Resume",
          filesUploadedOfTotal: {
            0: "%{complete} of %{smart_count} file uploaded",
            1: "%{complete} of %{smart_count} files uploaded"
          },
          dataUploadedOfTotal: "%{complete} of %{total}",
          xTimeLeft: "%{time} left",
          uploadXFiles: {
            0: "Upload %{smart_count} file",
            1: "Upload %{smart_count} files"
          },
          uploadXNewFiles: {
            0: "Upload +%{smart_count} file",
            1: "Upload +%{smart_count} files"
          },
          xMoreFilesAdded: {
            0: "%{smart_count} more file added",
            1: "%{smart_count} more files added"
          }
        }
      };
      var defaultOptions = {
        target: "body",
        hideUploadButton: false,
        hideRetryButton: false,
        hidePauseResumeButton: false,
        hideCancelButton: false,
        showProgressDetails: false,
        hideAfterFinish: true
      };
      _this.opts = _extends({}, defaultOptions, opts);
      _this.i18nInit();
      _this.render = _this.render.bind(_assertThisInitialized(_this));
      _this.install = _this.install.bind(_assertThisInitialized(_this));
      return _this;
    }
    var _proto = StatusBar.prototype;
    _proto.setOptions = function setOptions(newOpts) {
      _Plugin.prototype.setOptions.call(this, newOpts);
      this.i18nInit();
    };
    _proto.i18nInit = function i18nInit() {
      this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
      this.i18n = this.translator.translate.bind(this.translator);
      this.setPluginState();
    };
    _proto.getTotalSpeed = function getTotalSpeed(files) {
      var totalSpeed = 0;
      files.forEach(function(file) {
        totalSpeed = totalSpeed + getSpeed(file.progress);
      });
      return totalSpeed;
    };
    _proto.getTotalETA = function getTotalETA(files) {
      var totalSpeed = this.getTotalSpeed(files);
      if (totalSpeed === 0) {
        return 0;
      }
      var totalBytesRemaining = files.reduce(function(total, file) {
        return total + getBytesRemaining(file.progress);
      }, 0);
      return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
    };
    _proto.getUploadingState = function getUploadingState(isAllErrored, isAllComplete, files) {
      if (isAllErrored) {
        return statusBarStates.STATE_ERROR;
      }
      if (isAllComplete) {
        return statusBarStates.STATE_COMPLETE;
      }
      var state = statusBarStates.STATE_WAITING;
      var fileIDs = Object.keys(files);
      for (var i = 0;i < fileIDs.length; i++) {
        var progress = files[fileIDs[i]].progress;
        if (progress.uploadStarted && !progress.uploadComplete) {
          return statusBarStates.STATE_UPLOADING;
        }
        if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
          state = statusBarStates.STATE_PREPROCESSING;
        }
        if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
          state = statusBarStates.STATE_POSTPROCESSING;
        }
      }
      return state;
    };
    _proto.render = function render(state) {
      var { capabilities, files, allowNewUpload, totalProgress, error } = state;
      var filesArray = Object.keys(files).map(function(file) {
        return files[file];
      });
      var newFiles = filesArray.filter(function(file) {
        return !file.progress.uploadStarted && !file.progress.preprocess && !file.progress.postprocess;
      });
      var uploadStartedFiles = filesArray.filter(function(file) {
        return file.progress.uploadStarted;
      });
      var pausedFiles = uploadStartedFiles.filter(function(file) {
        return file.isPaused;
      });
      var completeFiles = filesArray.filter(function(file) {
        return file.progress.uploadComplete;
      });
      var erroredFiles = filesArray.filter(function(file) {
        return file.error;
      });
      var inProgressFiles = filesArray.filter(function(file) {
        return !file.progress.uploadComplete && file.progress.uploadStarted;
      });
      var inProgressNotPausedFiles = inProgressFiles.filter(function(file) {
        return !file.isPaused;
      });
      var startedFiles = filesArray.filter(function(file) {
        return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
      });
      var processingFiles = filesArray.filter(function(file) {
        return file.progress.preprocess || file.progress.postprocess;
      });
      var totalETA = this.getTotalETA(inProgressNotPausedFiles);
      var totalSize = 0;
      var totalUploadedSize = 0;
      startedFiles.forEach(function(file) {
        totalSize = totalSize + (file.progress.bytesTotal || 0);
        totalUploadedSize = totalUploadedSize + (file.progress.bytesUploaded || 0);
      });
      var isUploadStarted = startedFiles.length > 0;
      var isAllComplete = totalProgress === 100 && completeFiles.length === Object.keys(files).length && processingFiles.length === 0;
      var isAllErrored = error && erroredFiles.length === filesArray.length;
      var isAllPaused = inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length;
      var isUploadInProgress = inProgressFiles.length > 0;
      var resumableUploads = capabilities.resumableUploads || false;
      var supportsUploadProgress = capabilities.uploadProgress !== false;
      return StatusBarUI({
        error,
        uploadState: this.getUploadingState(isAllErrored, isAllComplete, state.files || {}),
        allowNewUpload,
        totalProgress,
        totalSize,
        totalUploadedSize,
        isAllComplete,
        isAllPaused,
        isAllErrored,
        isUploadStarted,
        isUploadInProgress,
        complete: completeFiles.length,
        newFiles: newFiles.length,
        numUploads: startedFiles.length,
        totalETA,
        files,
        i18n: this.i18n,
        pauseAll: this.uppy.pauseAll,
        resumeAll: this.uppy.resumeAll,
        retryAll: this.uppy.retryAll,
        cancelAll: this.uppy.cancelAll,
        startUpload: this.startUpload,
        resumableUploads,
        supportsUploadProgress,
        showProgressDetails: this.opts.showProgressDetails,
        hideUploadButton: this.opts.hideUploadButton,
        hideRetryButton: this.opts.hideRetryButton,
        hidePauseResumeButton: this.opts.hidePauseResumeButton,
        hideCancelButton: this.opts.hideCancelButton,
        hideAfterFinish: this.opts.hideAfterFinish,
        isTargetDOMEl: this.isTargetDOMEl
      });
    };
    _proto.install = function install() {
      var target = this.opts.target;
      if (target) {
        this.mount(target, this);
      }
    };
    _proto.uninstall = function uninstall() {
      this.unmount();
    };
    return StatusBar;
  }(Plugin), _class.VERSION = "1.7.5", _temp);
});

// node_modules/@uppy/informer/lib/index.js
var require_lib4 = __commonJS(function(exports, module) {
  var _class;
  var _temp;
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_lib2();
  var Plugin = _require.Plugin;
  var _require2 = require_preact();
  var h2 = _require2.h;
  module.exports = (_temp = _class = /* @__PURE__ */ function(_Plugin) {
    _inheritsLoose(Informer, _Plugin);
    function Informer(uppy, opts) {
      var _this;
      _this = _Plugin.call(this, uppy, opts) || this;
      _this.render = function(state) {
        var _state$info = state.info, isHidden = _state$info.isHidden, message = _state$info.message, details = _state$info.details;
        function displayErrorAlert() {
          var errorMessage = message + ` 

 ` + details;
          alert(errorMessage);
        }
        var handleMouseOver = function handleMouseOver2() {
          clearTimeout(_this.uppy.infoTimeoutID);
        };
        var handleMouseLeave = function handleMouseLeave2() {
          _this.uppy.infoTimeoutID = setTimeout(_this.uppy.hideInfo, 2000);
        };
        return h2("div", {
          class: "uppy uppy-Informer",
          "aria-hidden": isHidden
        }, h2("p", {
          role: "alert"
        }, message, " ", details && h2("span", {
          "aria-label": details,
          "data-microtip-position": "top-left",
          "data-microtip-size": "medium",
          role: "tooltip",
          onclick: displayErrorAlert,
          onMouseOver: handleMouseOver,
          onMouseLeave: handleMouseLeave
        }, "?")));
      };
      _this.type = "progressindicator";
      _this.id = _this.opts.id || "Informer";
      _this.title = "Informer";
      var defaultOptions = {};
      _this.opts = _extends({}, defaultOptions, opts);
      return _this;
    }
    var _proto = Informer.prototype;
    _proto.install = function install() {
      var target = this.opts.target;
      if (target) {
        this.mount(target, this);
      }
    };
    return Informer;
  }(Plugin), _class.VERSION = "1.5.10", _temp);
});

// node_modules/@uppy/utils/lib/dataURItoBlob.js
var require_dataURItoBlob = __commonJS(function(exports, module) {
  module.exports = function dataURItoBlob(dataURI, opts, toFile) {
    var data = dataURI.split(",")[1];
    var mimeType = opts.mimeType || dataURI.split(",")[0].split(":")[1].split(";")[0];
    if (mimeType == null) {
      mimeType = "plain/text";
    }
    var binary = atob(data);
    var array = [];
    for (var i = 0;i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    var bytes;
    try {
      bytes = new Uint8Array(array);
    } catch (err) {
      return null;
    }
    if (toFile) {
      return new File([bytes], opts.name || "", {
        type: mimeType
      });
    }
    return new Blob([bytes], {
      type: mimeType
    });
  };
});

// node_modules/@uppy/utils/lib/isObjectURL.js
var require_isObjectURL = __commonJS(function(exports, module) {
  module.exports = function isObjectURL(url) {
    return url.indexOf("blob:") === 0;
  };
});

// node_modules/@uppy/utils/lib/isPreviewSupported.js
var require_isPreviewSupported = __commonJS(function(exports, module) {
  module.exports = function isPreviewSupported(fileType) {
    if (!fileType)
      return false;
    var fileTypeSpecific = fileType.split("/")[1];
    if (/^(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(fileTypeSpecific)) {
      return true;
    }
    return false;
  };
});

// node_modules/math-log2/index.js
var require_math_log2 = __commonJS(function(exports, module) {
  module.exports = Math.log2 || function(x) {
    return Math.log(x) * Math.LOG2E;
  };
});

// node_modules/exifr/dist/mini.legacy.umd.js
var require_mini_legacy_umd = __commonJS(function(exports, module) {
  (function(e, t) {
    typeof exports == "object" && typeof module != "undefined" ? t(exports) : typeof define == "function" && define.amd ? define("exifr", ["exports"], t) : t((e = e || self).exifr = {});
  })(exports, function(e) {
    function t(e2, t2) {
      if (!(e2 instanceof t2))
        throw new TypeError("Cannot call a class as a function");
    }
    function n(e2, t2) {
      for (var n2 = 0;n2 < t2.length; n2++) {
        var r2 = t2[n2];
        r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e2, r2.key, r2);
      }
    }
    function r(e2, t2, r2) {
      return t2 && n(e2.prototype, t2), r2 && n(e2, r2), e2;
    }
    function i(e2, t2, n2) {
      return t2 in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[t2] = n2, e2;
    }
    function a(e2, t2) {
      if (typeof t2 != "function" && t2 !== null)
        throw new TypeError("Super expression must either be null or a function");
      e2.prototype = Object.create(t2 && t2.prototype, { constructor: { value: e2, writable: true, configurable: true } });
      var n2 = ["prototype", "__proto__", "caller", "arguments", "length", "name"];
      Object.getOwnPropertyNames(t2).forEach(function(r2) {
        n2.indexOf(r2) === -1 && e2[r2] !== t2[r2] && (e2[r2] = t2[r2]);
      }), t2 && u(e2, t2);
    }
    function s(e2) {
      return (s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e3) {
        return e3.__proto__ || Object.getPrototypeOf(e3);
      })(e2);
    }
    function u(e2, t2) {
      return (u = Object.setPrototypeOf || function(e3, t3) {
        return e3.__proto__ = t3, e3;
      })(e2, t2);
    }
    function o() {
      if (typeof Reflect == "undefined" || !Reflect.construct)
        return false;
      if (Reflect.construct.sham)
        return false;
      if (typeof Proxy == "function")
        return true;
      try {
        return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), true;
      } catch (e2) {
        return false;
      }
    }
    function f(e2, t2, n2) {
      return (f = o() ? Reflect.construct : function(e3, t3, n3) {
        var r2 = [null];
        r2.push.apply(r2, t3);
        var i2 = new (Function.bind.apply(e3, r2));
        return n3 && u(i2, n3.prototype), i2;
      }).apply(null, arguments);
    }
    function c(e2) {
      var t2 = typeof Map == "function" ? new Map : undefined;
      return (c = function(e3) {
        if (e3 === null || (n2 = e3, Function.toString.call(n2).indexOf("[native code]") === -1))
          return e3;
        var n2;
        if (typeof e3 != "function")
          throw new TypeError("Super expression must either be null or a function");
        if (t2 !== undefined) {
          if (t2.has(e3))
            return t2.get(e3);
          t2.set(e3, r2);
        }
        function r2() {
          return f(e3, arguments, s(this).constructor);
        }
        return r2.prototype = Object.create(e3.prototype, { constructor: { value: r2, enumerable: false, writable: true, configurable: true } }), u(r2, e3);
      })(e2);
    }
    function h2(e2) {
      if (e2 === undefined)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return e2;
    }
    function l(e2, t2) {
      return !t2 || typeof t2 != "object" && typeof t2 != "function" ? h2(e2) : t2;
    }
    function d(e2, t2, n2) {
      return (d = typeof Reflect != "undefined" && Reflect.get ? Reflect.get : function(e3, t3, n3) {
        var r2 = function(e4, t4) {
          for (;!Object.prototype.hasOwnProperty.call(e4, t4) && (e4 = s(e4)) !== null; )
            ;
          return e4;
        }(e3, t3);
        if (r2) {
          var i2 = Object.getOwnPropertyDescriptor(r2, t3);
          return i2.get ? i2.get.call(n3) : i2.value;
        }
      })(e2, t2, n2 || e2);
    }
    var p = Object.values || function(e2) {
      var t2 = [];
      for (var n2 in e2)
        t2.push(e2[n2]);
      return t2;
    }, v = Object.entries || function(e2) {
      var t2 = [];
      for (var n2 in e2)
        t2.push([n2, e2[n2]]);
      return t2;
    }, y = Object.assign || function(e2) {
      for (var t2 = arguments.length, n2 = new Array(t2 > 1 ? t2 - 1 : 0), r2 = 1;r2 < t2; r2++)
        n2[r2 - 1] = arguments[r2];
      return n2.forEach(function(t3) {
        for (var n3 in t3)
          e2[n3] = t3[n3];
      }), e2;
    }, g = Object.fromEntries || function(e2) {
      var t2 = {};
      return k(e2).forEach(function(e3) {
        var n2 = e3[0], r2 = e3[1];
        t2[n2] = r2;
      }), t2;
    }, k = Array.from || function(e2) {
      if (e2 instanceof S) {
        var t2 = [];
        return e2.forEach(function(e3, n2) {
          return t2.push([n2, e3]);
        }), t2;
      }
      return Array.prototype.slice.call(e2);
    };
    function m(e2) {
      return this.indexOf(e2) !== -1;
    }
    Array.prototype.includes || (Array.prototype.includes = m), String.prototype.includes || (String.prototype.includes = m), String.prototype.startsWith || (String.prototype.startsWith = function(e2) {
      var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return this.substring(t2, t2 + e2.length) === e2;
    }), String.prototype.endsWith || (String.prototype.endsWith = function(e2) {
      var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.length;
      return this.substring(t2 - e2.length, t2) === e2;
    });
    var b = typeof self != "undefined" ? self : global, A = b.fetch || function(e2) {
      var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new Promise(function(n2, r2) {
        var i2 = new XMLHttpRequest;
        if (i2.open("get", e2, true), i2.responseType = "arraybuffer", i2.onerror = r2, t2.headers)
          for (var a2 in t2.headers)
            i2.setRequestHeader(a2, t2.headers[a2]);
        i2.onload = function() {
          n2({ ok: i2.status >= 200 && i2.status < 300, status: i2.status, arrayBuffer: function() {
            return Promise.resolve(i2.response);
          } });
        }, i2.send(null);
      });
    }, w = function(e2) {
      var t2 = [];
      if (Object.defineProperties(t2, { size: { get: function() {
        return this.length;
      } }, has: { value: function(e3) {
        return this.indexOf(e3) !== -1;
      } }, add: { value: function(e3) {
        this.has(e3) || this.push(e3);
      } }, delete: { value: function(e3) {
        if (this.has(e3)) {
          var t3 = this.indexOf(e3);
          this.splice(t3, 1);
        }
      } } }), Array.isArray(e2))
        for (var n2 = 0;n2 < e2.length; n2++)
          t2.add(e2[n2]);
      return t2;
    }, O = function(e2) {
      return new S(e2);
    }, S = b.Map !== undefined && b.Map.prototype.keys !== undefined ? b.Map : function() {
      function e2(n2) {
        if (t(this, e2), this.clear(), n2)
          for (var r2 = 0;r2 < n2.length; r2++)
            this.set(n2[r2][0], n2[r2][1]);
      }
      return r(e2, [{ key: "clear", value: function() {
        this._map = {}, this._keys = [];
      } }, { key: "get", value: function(e3) {
        return this._map["map_" + e3];
      } }, { key: "set", value: function(e3, t2) {
        return this._map["map_" + e3] = t2, this._keys.indexOf(e3) < 0 && this._keys.push(e3), this;
      } }, { key: "has", value: function(e3) {
        return this._keys.indexOf(e3) >= 0;
      } }, { key: "delete", value: function(e3) {
        var t2 = this._keys.indexOf(e3);
        return !(t2 < 0) && (delete this._map["map_" + e3], this._keys.splice(t2, 1), true);
      } }, { key: "keys", value: function() {
        return this._keys.slice(0);
      } }, { key: "values", value: function() {
        var e3 = this;
        return this._keys.map(function(t2) {
          return e3.get(t2);
        });
      } }, { key: "entries", value: function() {
        var e3 = this;
        return this._keys.map(function(t2) {
          return [t2, e3.get(t2)];
        });
      } }, { key: "forEach", value: function(e3, t2) {
        for (var n2 = 0;n2 < this._keys.length; n2++)
          e3.call(t2, this._map["map_" + this._keys[n2]], this._keys[n2], this);
      } }, { key: "size", get: function() {
        return this._keys.length;
      } }]), e2;
    }(), P = typeof self != "undefined" ? self : global, U = typeof navigator != "undefined", x = U && typeof HTMLImageElement == "undefined", C = !(typeof global == "undefined" || typeof process == "undefined" || !process.versions || !process.versions.node), _ = P.Buffer, j = !!_;
    var B = function(e2) {
      return e2 !== undefined;
    };
    function V(e2) {
      return e2 === undefined || (e2 instanceof S ? e2.size === 0 : p(e2).filter(B).length === 0);
    }
    function I(e2) {
      var t2 = new Error(e2);
      throw delete t2.stack, t2;
    }
    function z(e2) {
      var t2 = function(e3) {
        var t3 = 0;
        return e3.ifd0.enabled && (t3 += 1024), e3.exif.enabled && (t3 += 2048), e3.makerNote && (t3 += 2048), e3.userComment && (t3 += 1024), e3.gps.enabled && (t3 += 512), e3.interop.enabled && (t3 += 100), e3.ifd1.enabled && (t3 += 1024), t3 + 2048;
      }(e2);
      return e2.jfif.enabled && (t2 += 50), e2.xmp.enabled && (t2 += 20000), e2.iptc.enabled && (t2 += 14000), e2.icc.enabled && (t2 += 6000), t2;
    }
    var L = typeof TextDecoder != "undefined" ? new TextDecoder("utf-8") : undefined;
    function T(e2) {
      return L ? L.decode(e2) : j ? Buffer.from(e2).toString("utf8") : decodeURIComponent(escape(String.fromCharCode.apply(null, e2)));
    }
    var F = function() {
      function e2(n2) {
        var r2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0, i2 = arguments.length > 2 ? arguments[2] : undefined, a2 = arguments.length > 3 ? arguments[3] : undefined;
        if (t(this, e2), typeof a2 == "boolean" && (this.le = a2), Array.isArray(n2) && (n2 = new Uint8Array(n2)), n2 === 0)
          this.byteOffset = 0, this.byteLength = 0;
        else if (n2 instanceof ArrayBuffer) {
          i2 === undefined && (i2 = n2.byteLength - r2);
          var s2 = new DataView(n2, r2, i2);
          this._swapDataView(s2);
        } else if (n2 instanceof Uint8Array || n2 instanceof DataView || n2 instanceof e2) {
          i2 === undefined && (i2 = n2.byteLength - r2), (r2 += n2.byteOffset) + i2 > n2.byteOffset + n2.byteLength && I("Creating view outside of available memory in ArrayBuffer");
          var u2 = new DataView(n2.buffer, r2, i2);
          this._swapDataView(u2);
        } else if (typeof n2 == "number") {
          var o2 = new DataView(new ArrayBuffer(n2));
          this._swapDataView(o2);
        } else
          I("Invalid input argument for BufferView: " + n2);
      }
      return r(e2, null, [{ key: "from", value: function(t2, n2) {
        return t2 instanceof this && t2.le === n2 ? t2 : new e2(t2, undefined, undefined, n2);
      } }]), r(e2, [{ key: "_swapArrayBuffer", value: function(e3) {
        this._swapDataView(new DataView(e3));
      } }, { key: "_swapBuffer", value: function(e3) {
        this._swapDataView(new DataView(e3.buffer, e3.byteOffset, e3.byteLength));
      } }, { key: "_swapDataView", value: function(e3) {
        this.dataView = e3, this.buffer = e3.buffer, this.byteOffset = e3.byteOffset, this.byteLength = e3.byteLength;
      } }, { key: "_lengthToEnd", value: function(e3) {
        return this.byteLength - e3;
      } }, { key: "set", value: function(t2, n2) {
        var r2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : e2;
        t2 instanceof DataView || t2 instanceof e2 ? t2 = new Uint8Array(t2.buffer, t2.byteOffset, t2.byteLength) : t2 instanceof ArrayBuffer && (t2 = new Uint8Array(t2)), t2 instanceof Uint8Array || I("BufferView.set(): Invalid data argument.");
        var i2 = this.toUint8();
        return i2.set(t2, n2), new r2(this, n2, t2.byteLength);
      } }, { key: "subarray", value: function(t2, n2) {
        return new e2(this, t2, n2 = n2 || this._lengthToEnd(t2));
      } }, { key: "toUint8", value: function() {
        return new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
      } }, { key: "getUint8Array", value: function(e3, t2) {
        return new Uint8Array(this.buffer, this.byteOffset + e3, t2);
      } }, { key: "getString", value: function() {
        var e3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0, t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.byteLength, n2 = this.getUint8Array(e3, t2);
        return T(n2);
      } }, { key: "getUnicodeString", value: function() {
        for (var e3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0, t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.byteLength, n2 = [], r2 = 0;r2 < t2 && e3 + r2 < this.byteLength; r2 += 2)
          n2.push(this.getUint16(e3 + r2));
        return n2.map(function(e4) {
          return String.fromCharCode(e4);
        }).join("");
      } }, { key: "getInt8", value: function(e3) {
        return this.dataView.getInt8(e3);
      } }, { key: "getUint8", value: function(e3) {
        return this.dataView.getUint8(e3);
      } }, { key: "getInt16", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getInt16(e3, t2);
      } }, { key: "getInt32", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getInt32(e3, t2);
      } }, { key: "getUint16", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getUint16(e3, t2);
      } }, { key: "getUint32", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getUint32(e3, t2);
      } }, { key: "getFloat32", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getFloat32(e3, t2);
      } }, { key: "getFloat64", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getFloat64(e3, t2);
      } }, { key: "getFloat", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getFloat32(e3, t2);
      } }, { key: "getDouble", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.le;
        return this.dataView.getFloat64(e3, t2);
      } }, { key: "getUintBytes", value: function(e3, t2, n2) {
        switch (t2) {
          case 1:
            return this.getUint8(e3, n2);
          case 2:
            return this.getUint16(e3, n2);
          case 4:
            return this.getUint32(e3, n2);
          case 8:
            return this.getUint64 && this.getUint64(e3, n2);
        }
      } }, { key: "getUint", value: function(e3, t2, n2) {
        switch (t2) {
          case 8:
            return this.getUint8(e3, n2);
          case 16:
            return this.getUint16(e3, n2);
          case 32:
            return this.getUint32(e3, n2);
          case 64:
            return this.getUint64 && this.getUint64(e3, n2);
        }
      } }, { key: "toString", value: function(e3) {
        return this.dataView.toString(e3, this.constructor.name);
      } }, { key: "ensureChunk", value: function() {} }]), e2;
    }();
    function E(e2, t2) {
      I("".concat(e2, " '").concat(t2, "' was not loaded, try using full build of exifr."));
    }
    var D = function(e2) {
      function n2(e3) {
        var r2;
        return t(this, n2), (r2 = l(this, s(n2).call(this))).kind = e3, r2;
      }
      return a(n2, e2), r(n2, [{ key: "get", value: function(e3, t2) {
        return this.has(e3) || E(this.kind, e3), t2 && ((e3 in t2) || function(e4, t3) {
          I("Unknown ".concat(e4, " '").concat(t3, "'."));
        }(this.kind, e3), t2[e3].enabled || E(this.kind, e3)), d(s(n2.prototype), "get", this).call(this, e3);
      } }, { key: "keyList", value: function() {
        return k(this.keys());
      } }]), n2;
    }(c(S)), M = new D("file parser"), R = new D("segment parser"), N = new D("file reader");
    function W(e2) {
      return function() {
        for (var t2 = [], n2 = 0;n2 < arguments.length; n2++)
          t2[n2] = arguments[n2];
        try {
          return Promise.resolve(e2.apply(this, t2));
        } catch (e3) {
          return Promise.reject(e3);
        }
      };
    }
    function K(e2, t2, n2) {
      return n2 ? t2 ? t2(e2) : e2 : (e2 && e2.then || (e2 = Promise.resolve(e2)), t2 ? e2.then(t2) : e2);
    }
    var H = W(function(e2) {
      return new Promise(function(t2, n2) {
        var r2 = new FileReader;
        r2.onloadend = function() {
          return t2(r2.result || new ArrayBuffer);
        }, r2.onerror = n2, r2.readAsArrayBuffer(e2);
      });
    }), X = W(function(e2) {
      return A(e2).then(function(e3) {
        return e3.arrayBuffer();
      });
    }), Y = W(function(e2, t2) {
      return K(t2(e2), function(e3) {
        return new F(e3);
      });
    }), G = W(function(e2, t2, n2) {
      var r2 = new (N.get(n2))(e2, t2);
      return K(r2.read(), function() {
        return r2;
      });
    }), J = W(function(e2, t2, n2, r2) {
      return N.has(n2) ? G(e2, t2, n2) : r2 ? Y(e2, r2) : (I("Parser ".concat(n2, " is not loaded")), K());
    });
    function q(e2, t2) {
      return (n2 = e2).startsWith("data:") || n2.length > 1e4 ? G(e2, t2, "base64") : U ? J(e2, t2, "url", X) : C ? G(e2, t2, "fs") : void I("Invalid input argument");
      var n2;
    }
    var Q = function(e2) {
      function n2() {
        return t(this, n2), l(this, s(n2).apply(this, arguments));
      }
      return a(n2, e2), r(n2, [{ key: "tagKeys", get: function() {
        return this.allKeys || (this.allKeys = k(this.keys())), this.allKeys;
      } }, { key: "tagValues", get: function() {
        return this.allValues || (this.allValues = k(this.values())), this.allValues;
      } }]), n2;
    }(c(S));
    function Z(e2, t2, n2) {
      var r2 = new Q, i2 = n2;
      Array.isArray(i2) || (typeof i2.entries == "function" && (i2 = i2.entries()), i2 = k(i2));
      for (var a2 = 0;a2 < i2.length; a2++) {
        var s2 = i2[a2], u2 = s2[0], o2 = s2[1];
        r2.set(u2, o2);
      }
      if (Array.isArray(t2)) {
        var f2 = t2;
        Array.isArray(f2) || (typeof f2.entries == "function" && (f2 = f2.entries()), f2 = k(f2));
        for (var c2 = 0;c2 < f2.length; c2++) {
          var h3 = f2[c2];
          e2.set(h3, r2);
        }
      } else
        e2.set(t2, r2);
      return r2;
    }
    function $(e2, t2, n2) {
      var r2, i2 = e2.get(t2), a2 = n2;
      Array.isArray(a2) || (typeof a2.entries == "function" && (a2 = a2.entries()), a2 = k(a2));
      for (var s2 = 0;s2 < a2.length; s2++)
        r2 = a2[s2], i2.set(r2[0], r2[1]);
    }
    var ee = O(), te = O(), ne = O(), re = ["chunked", "firstChunkSize", "firstChunkSizeNode", "firstChunkSizeBrowser", "chunkSize", "chunkLimit"], ie = ["jfif", "xmp", "icc", "iptc"], ae = ["tiff"].concat(ie), se = ["ifd0", "ifd1", "exif", "gps", "interop"], ue = [].concat(ae, se), oe = ["makerNote", "userComment"], fe = ["translateKeys", "translateValues", "reviveValues", "multiSegment"], ce = [].concat(fe, ["sanitize", "mergeOutput"]), he = function() {
      function e2() {
        t(this, e2);
      }
      return r(e2, [{ key: "translate", get: function() {
        return this.translateKeys || this.translateValues || this.reviveValues;
      } }]), e2;
    }(), le = function(e2) {
      function n2(e3, r2, a2, u2) {
        var o2;
        if (t(this, n2), i(h2(o2 = l(this, s(n2).call(this))), "enabled", false), i(h2(o2), "skip", w()), i(h2(o2), "pick", w()), i(h2(o2), "deps", w()), i(h2(o2), "translateKeys", false), i(h2(o2), "translateValues", false), i(h2(o2), "reviveValues", false), o2.key = e3, o2.enabled = r2, o2.parse = o2.enabled, o2.applyInheritables(u2), o2.canBeFiltered = se.includes(e3), o2.canBeFiltered && (o2.dict = ee.get(e3)), a2 !== undefined)
          if (Array.isArray(a2))
            o2.parse = o2.enabled = true, o2.canBeFiltered && a2.length > 0 && o2.translateTagSet(a2, o2.pick);
          else if (typeof a2 == "object") {
            if (o2.enabled = true, o2.parse = a2.parse !== false, o2.canBeFiltered) {
              var { pick: f2, skip: c2 } = a2;
              f2 && f2.length > 0 && o2.translateTagSet(f2, o2.pick), c2 && c2.length > 0 && o2.translateTagSet(c2, o2.skip);
            }
            o2.applyInheritables(a2);
          } else
            a2 === true || a2 === false ? o2.parse = o2.enabled = a2 : I("Invalid options argument: ".concat(a2));
        return o2;
      }
      return a(n2, e2), r(n2, [{ key: "needed", get: function() {
        return this.enabled || this.deps.size > 0;
      } }]), r(n2, [{ key: "applyInheritables", value: function(e3) {
        var t2, n3, r2 = fe;
        Array.isArray(r2) || (typeof r2.entries == "function" && (r2 = r2.entries()), r2 = k(r2));
        for (var i2 = 0;i2 < r2.length; i2++)
          (n3 = e3[t2 = r2[i2]]) !== undefined && (this[t2] = n3);
      } }, { key: "translateTagSet", value: function(e3, t2) {
        if (this.dict) {
          var n3, r2, i2 = this.dict, a2 = i2.tagKeys, s2 = i2.tagValues, u2 = e3;
          Array.isArray(u2) || (typeof u2.entries == "function" && (u2 = u2.entries()), u2 = k(u2));
          for (var o2 = 0;o2 < u2.length; o2++)
            typeof (n3 = u2[o2]) == "string" ? ((r2 = s2.indexOf(n3)) === -1 && (r2 = a2.indexOf(Number(n3))), r2 !== -1 && t2.add(Number(a2[r2]))) : t2.add(n3);
        } else {
          var f2 = e3;
          Array.isArray(f2) || (typeof f2.entries == "function" && (f2 = f2.entries()), f2 = k(f2));
          for (var c2 = 0;c2 < f2.length; c2++) {
            var h3 = f2[c2];
            t2.add(h3);
          }
        }
      } }, { key: "finalizeFilters", value: function() {
        !this.enabled && this.deps.size > 0 ? (this.enabled = true, ke(this.pick, this.deps)) : this.enabled && this.pick.size > 0 && ke(this.pick, this.deps);
      } }]), n2;
    }(he), de = { jfif: false, tiff: true, xmp: false, icc: false, iptc: false, ifd0: true, ifd1: false, exif: true, gps: true, interop: false, makerNote: false, userComment: false, multiSegment: false, skip: [], pick: [], translateKeys: true, translateValues: true, reviveValues: true, sanitize: true, mergeOutput: true, silentErrors: true, chunked: true, firstChunkSize: undefined, firstChunkSizeNode: 512, firstChunkSizeBrowser: 65536, chunkSize: 65536, chunkLimit: 5 }, pe = O(), ve = function(e2) {
      function n2(e3) {
        var r2;
        return t(this, n2), r2 = l(this, s(n2).call(this)), e3 === true ? r2.setupFromTrue() : e3 === undefined ? r2.setupFromUndefined() : Array.isArray(e3) ? r2.setupFromArray(e3) : typeof e3 == "object" ? r2.setupFromObject(e3) : I("Invalid options argument ".concat(e3)), r2.firstChunkSize === undefined && (r2.firstChunkSize = U ? r2.firstChunkSizeBrowser : r2.firstChunkSizeNode), r2.mergeOutput && (r2.ifd1.enabled = false), r2.filterNestedSegmentTags(), r2.traverseTiffDependencyTree(), r2.checkLoadedPlugins(), r2;
      }
      return a(n2, e2), r(n2, null, [{ key: "useCached", value: function(e3) {
        var t2 = pe.get(e3);
        return t2 !== undefined ? t2 : (t2 = new this(e3), pe.set(e3, t2), t2);
      } }]), r(n2, [{ key: "setupFromUndefined", value: function() {
        var e3, t2 = re;
        Array.isArray(t2) || (typeof t2.entries == "function" && (t2 = t2.entries()), t2 = k(t2));
        for (var n3 = 0;n3 < t2.length; n3++)
          this[e3 = t2[n3]] = de[e3];
        var r2 = ce;
        Array.isArray(r2) || (typeof r2.entries == "function" && (r2 = r2.entries()), r2 = k(r2));
        for (var i2 = 0;i2 < r2.length; i2++)
          this[e3 = r2[i2]] = de[e3];
        var a2 = oe;
        Array.isArray(a2) || (typeof a2.entries == "function" && (a2 = a2.entries()), a2 = k(a2));
        for (var s2 = 0;s2 < a2.length; s2++)
          this[e3 = a2[s2]] = de[e3];
        var u2 = ue;
        Array.isArray(u2) || (typeof u2.entries == "function" && (u2 = u2.entries()), u2 = k(u2));
        for (var o2 = 0;o2 < u2.length; o2++)
          this[e3 = u2[o2]] = new le(e3, de[e3], undefined, this);
      } }, { key: "setupFromTrue", value: function() {
        var e3, t2 = re;
        Array.isArray(t2) || (typeof t2.entries == "function" && (t2 = t2.entries()), t2 = k(t2));
        for (var n3 = 0;n3 < t2.length; n3++)
          this[e3 = t2[n3]] = de[e3];
        var r2 = ce;
        Array.isArray(r2) || (typeof r2.entries == "function" && (r2 = r2.entries()), r2 = k(r2));
        for (var i2 = 0;i2 < r2.length; i2++)
          this[e3 = r2[i2]] = de[e3];
        var a2 = oe;
        Array.isArray(a2) || (typeof a2.entries == "function" && (a2 = a2.entries()), a2 = k(a2));
        for (var s2 = 0;s2 < a2.length; s2++)
          this[e3 = a2[s2]] = true;
        var u2 = ue;
        Array.isArray(u2) || (typeof u2.entries == "function" && (u2 = u2.entries()), u2 = k(u2));
        for (var o2 = 0;o2 < u2.length; o2++)
          this[e3 = u2[o2]] = new le(e3, true, undefined, this);
      } }, { key: "setupFromArray", value: function(e3) {
        var t2, n3 = re;
        Array.isArray(n3) || (typeof n3.entries == "function" && (n3 = n3.entries()), n3 = k(n3));
        for (var r2 = 0;r2 < n3.length; r2++)
          this[t2 = n3[r2]] = de[t2];
        var i2 = ce;
        Array.isArray(i2) || (typeof i2.entries == "function" && (i2 = i2.entries()), i2 = k(i2));
        for (var a2 = 0;a2 < i2.length; a2++)
          this[t2 = i2[a2]] = de[t2];
        var s2 = oe;
        Array.isArray(s2) || (typeof s2.entries == "function" && (s2 = s2.entries()), s2 = k(s2));
        for (var u2 = 0;u2 < s2.length; u2++)
          this[t2 = s2[u2]] = de[t2];
        var o2 = ue;
        Array.isArray(o2) || (typeof o2.entries == "function" && (o2 = o2.entries()), o2 = k(o2));
        for (var f2 = 0;f2 < o2.length; f2++)
          this[t2 = o2[f2]] = new le(t2, false, undefined, this);
        this.setupGlobalFilters(e3, undefined, se);
      } }, { key: "setupFromObject", value: function(e3) {
        var t2;
        se.ifd0 = se.ifd0 || se.image, se.ifd1 = se.ifd1 || se.thumbnail, y(this, e3);
        var n3 = re;
        Array.isArray(n3) || (typeof n3.entries == "function" && (n3 = n3.entries()), n3 = k(n3));
        for (var r2 = 0;r2 < n3.length; r2++)
          this[t2 = n3[r2]] = ge(e3[t2], de[t2]);
        var i2 = ce;
        Array.isArray(i2) || (typeof i2.entries == "function" && (i2 = i2.entries()), i2 = k(i2));
        for (var a2 = 0;a2 < i2.length; a2++)
          this[t2 = i2[a2]] = ge(e3[t2], de[t2]);
        var s2 = oe;
        Array.isArray(s2) || (typeof s2.entries == "function" && (s2 = s2.entries()), s2 = k(s2));
        for (var u2 = 0;u2 < s2.length; u2++)
          this[t2 = s2[u2]] = ge(e3[t2], de[t2]);
        var o2 = ae;
        Array.isArray(o2) || (typeof o2.entries == "function" && (o2 = o2.entries()), o2 = k(o2));
        for (var f2 = 0;f2 < o2.length; f2++)
          this[t2 = o2[f2]] = new le(t2, de[t2], e3[t2], this);
        var c2 = se;
        Array.isArray(c2) || (typeof c2.entries == "function" && (c2 = c2.entries()), c2 = k(c2));
        for (var h3 = 0;h3 < c2.length; h3++)
          this[t2 = c2[h3]] = new le(t2, de[t2], e3[t2], this.tiff);
        this.setupGlobalFilters(e3.pick, e3.skip, se, ue), e3.tiff === true ? this.batchEnableWithBool(se, true) : e3.tiff === false ? this.batchEnableWithUserValue(se, e3) : Array.isArray(e3.tiff) ? this.setupGlobalFilters(e3.tiff, undefined, se) : typeof e3.tiff == "object" && this.setupGlobalFilters(e3.tiff.pick, e3.tiff.skip, se);
      } }, { key: "batchEnableWithBool", value: function(e3, t2) {
        var n3 = e3;
        Array.isArray(n3) || (typeof n3.entries == "function" && (n3 = n3.entries()), n3 = k(n3));
        for (var r2 = 0;r2 < n3.length; r2++) {
          this[n3[r2]].enabled = t2;
        }
      } }, { key: "batchEnableWithUserValue", value: function(e3, t2) {
        var n3 = e3;
        Array.isArray(n3) || (typeof n3.entries == "function" && (n3 = n3.entries()), n3 = k(n3));
        for (var r2 = 0;r2 < n3.length; r2++) {
          var i2 = n3[r2], a2 = t2[i2];
          this[i2].enabled = a2 !== false && a2 !== undefined;
        }
      } }, { key: "setupGlobalFilters", value: function(e3, t2, n3) {
        var r2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : n3;
        if (e3 && e3.length) {
          var i2 = r2;
          Array.isArray(i2) || (typeof i2.entries == "function" && (i2 = i2.entries()), i2 = k(i2));
          for (var a2 = 0;a2 < i2.length; a2++) {
            var s2 = i2[a2];
            this[s2].enabled = false;
          }
          var u2 = ye(e3, n3), o2 = u2;
          Array.isArray(o2) || (typeof o2.entries == "function" && (o2 = o2.entries()), o2 = k(o2));
          for (var f2 = 0;f2 < o2.length; f2++) {
            var c2 = o2[f2], h3 = c2[0], l2 = c2[1];
            ke(this[h3].pick, l2), this[h3].enabled = true;
          }
        } else if (t2 && t2.length) {
          var d2 = ye(t2, n3), p2 = d2;
          Array.isArray(p2) || (typeof p2.entries == "function" && (p2 = p2.entries()), p2 = k(p2));
          for (var v2 = 0;v2 < p2.length; v2++) {
            var y2 = p2[v2], g2 = y2[0], m2 = y2[1];
            ke(this[g2].skip, m2);
          }
        }
      } }, { key: "filterNestedSegmentTags", value: function() {
        var e3 = this.ifd0, t2 = this.exif, n3 = this.xmp, r2 = this.iptc, i2 = this.icc;
        this.makerNote ? t2.deps.add(37500) : t2.skip.add(37500), this.userComment ? t2.deps.add(37510) : t2.skip.add(37510), n3.enabled || e3.skip.add(700), r2.enabled || e3.skip.add(33723), i2.enabled || e3.skip.add(34675);
      } }, { key: "traverseTiffDependencyTree", value: function() {
        var e3 = this, t2 = this.ifd0, n3 = this.exif, r2 = this.gps;
        this.interop.needed && (n3.deps.add(40965), t2.deps.add(40965)), n3.needed && t2.deps.add(34665), r2.needed && t2.deps.add(34853), this.tiff.enabled = se.some(function(t3) {
          return e3[t3].enabled === true;
        }) || this.makerNote || this.userComment;
        var i2 = se;
        Array.isArray(i2) || (typeof i2.entries == "function" && (i2 = i2.entries()), i2 = k(i2));
        for (var a2 = 0;a2 < i2.length; a2++) {
          this[i2[a2]].finalizeFilters();
        }
      } }, { key: "checkLoadedPlugins", value: function() {
        var e3 = ae;
        Array.isArray(e3) || (typeof e3.entries == "function" && (e3 = e3.entries()), e3 = k(e3));
        for (var t2 = 0;t2 < e3.length; t2++) {
          var n3 = e3[t2];
          this[n3].enabled && !R.has(n3) && E("segment parser", n3);
        }
      } }, { key: "onlyTiff", get: function() {
        var e3 = this;
        return !ie.map(function(t2) {
          return e3[t2].enabled;
        }).some(function(e4) {
          return e4 === true;
        }) && this.tiff.enabled;
      } }]), n2;
    }(he);
    function ye(e2, t2) {
      var n2, r2, i2, a2 = [], s2 = t2;
      Array.isArray(s2) || (typeof s2.entries == "function" && (s2 = s2.entries()), s2 = k(s2));
      for (var u2 = 0;u2 < s2.length; u2++) {
        r2 = s2[u2], n2 = [];
        var o2 = ee.get(r2);
        Array.isArray(o2) || (typeof o2.entries == "function" && (o2 = o2.entries()), o2 = k(o2));
        for (var f2 = 0;f2 < o2.length; f2++)
          i2 = o2[f2], (e2.includes(i2[0]) || e2.includes(i2[1])) && n2.push(i2[0]);
        n2.length && a2.push([r2, n2]);
      }
      return a2;
    }
    function ge(e2, t2) {
      return e2 !== undefined ? e2 : t2 !== undefined ? t2 : undefined;
    }
    function ke(e2, t2) {
      var n2 = t2;
      Array.isArray(n2) || (typeof n2.entries == "function" && (n2 = n2.entries()), n2 = k(n2));
      for (var r2 = 0;r2 < n2.length; r2++) {
        var i2 = n2[r2];
        e2.add(i2);
      }
    }
    function me(e2, t2, n2) {
      return n2 ? t2 ? t2(e2) : e2 : (e2 && e2.then || (e2 = Promise.resolve(e2)), t2 ? e2.then(t2) : e2);
    }
    function be(e2, t2) {
      var n2 = e2();
      return n2 && n2.then ? n2.then(t2) : t2(n2);
    }
    function Ae() {}
    i(ve, "default", de);
    var we = function() {
      function e2(n2) {
        t(this, e2), i(this, "parsers", {}), this.options = ve.useCached(n2);
      }
      return r(e2, [{ key: "setup", value: function() {
        if (!this.fileParser) {
          var e3 = this.file, t2 = e3.getUint16(0), n2 = M;
          Array.isArray(n2) || (typeof n2.entries == "function" && (n2 = n2.entries()), n2 = k(n2));
          for (var r2 = 0;r2 < n2.length; r2++) {
            var i2 = n2[r2], a2 = i2[0], s2 = i2[1];
            if (s2.canHandle(e3, t2))
              return this.fileParser = new s2(this.options, this.file, this.parsers), e3[a2] = true;
          }
          I("Unknown file format");
        }
      } }, { key: "read", value: function(e3) {
        try {
          var t2 = this;
          return me(function(e4, t3) {
            return typeof e4 == "string" ? q(e4, t3) : U && !x && e4 instanceof HTMLImageElement ? q(e4.src, t3) : e4 instanceof Uint8Array || e4 instanceof ArrayBuffer || e4 instanceof DataView ? new F(e4) : U && e4 instanceof Blob ? J(e4, t3, "blob", H) : void I("Invalid input argument");
          }(e3, t2.options), function(e4) {
            t2.file = e4;
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "parse", value: function() {
        try {
          var e3 = this;
          return e3.setup(), me(e3.fileParser.parse(), function() {
            var t2, n2 = {}, r2 = [], i2 = p(e3.parsers).map((t2 = function(t3) {
              var i3;
              return be(function() {
                return e3.options.silentErrors ? (n3 = function(e4, t4) {
                  try {
                    var n4 = e4();
                  } catch (e5) {
                    return t4(e5);
                  }
                  return n4 && n4.then ? n4.then(undefined, t4) : n4;
                }(function() {
                  return me(t3.parse(), function(e4) {
                    i3 = e4;
                  });
                }, function(e4) {
                  r2.push(e4);
                }), a2 = function() {
                  r2.push.apply(r2, t3.errors);
                }, n3 && n3.then ? n3.then(a2) : a2(n3)) : me(t3.parse(), function(e4) {
                  i3 = e4;
                });
                var n3, a2;
              }, function() {
                t3.assignToOutput(n2, i3);
              });
            }, function() {
              for (var e4 = [], n3 = 0;n3 < arguments.length; n3++)
                e4[n3] = arguments[n3];
              try {
                return Promise.resolve(t2.apply(this, e4));
              } catch (e5) {
                return Promise.reject(e5);
              }
            }));
            return me(Promise.all(i2), function() {
              return e3.options.silentErrors && r2.length > 0 && (n2.errors = r2), e3.file.close && e3.file.close(), V(t3 = n2) ? undefined : t3;
              var t3;
            });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "extractThumbnail", value: function() {
        try {
          var e3 = this;
          e3.setup();
          var t2, n2 = e3.options, r2 = e3.file, i2 = R.get("tiff", n2);
          return be(function() {
            if (!r2.tiff)
              return function(e4) {
                var t3 = e4();
                if (t3 && t3.then)
                  return t3.then(Ae);
              }(function() {
                if (r2.jpeg)
                  return me(e3.fileParser.getOrFindSegment("tiff"), function(e4) {
                    t2 = e4;
                  });
              });
            t2 = { start: 0, type: "tiff" };
          }, function() {
            if (t2 !== undefined)
              return me(e3.fileParser.ensureSegmentChunk(t2), function(t3) {
                return me((e3.parsers.tiff = new i2(t3, n2, r2)).extractThumbnail(), function(e4) {
                  return r2.close && r2.close(), e4;
                });
              });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }]), e2;
    }();
    var Oe, Se = (Oe = function(e2, t2) {
      var n2, r2, i2, a2 = new we(t2);
      return n2 = a2.read(e2), r2 = function() {
        return a2.parse();
      }, i2 ? r2 ? r2(n2) : n2 : (n2 && n2.then || (n2 = Promise.resolve(n2)), r2 ? n2.then(r2) : n2);
    }, function() {
      for (var e2 = [], t2 = 0;t2 < arguments.length; t2++)
        e2[t2] = arguments[t2];
      try {
        return Promise.resolve(Oe.apply(this, e2));
      } catch (e3) {
        return Promise.reject(e3);
      }
    }), Pe = Object.freeze({ __proto__: null, parse: Se, Exifr: we, fileParsers: M, segmentParsers: R, fileReaders: N, tagKeys: ee, tagValues: te, tagRevivers: ne, createDictionary: Z, extendDictionary: $, fetchUrlAsArrayBuffer: X, readBlobAsArrayBuffer: H, chunkedProps: re, otherSegments: ie, segments: ae, tiffBlocks: se, segmentsAndBlocks: ue, tiffExtractables: oe, inheritables: fe, allFormatters: ce, Options: ve });
    function Ue() {}
    var xe = function() {
      function e2(n2, r2, a2) {
        var s2 = this;
        t(this, e2), i(this, "ensureSegmentChunk", function(e3) {
          return function() {
            for (var t2 = [], n3 = 0;n3 < arguments.length; n3++)
              t2[n3] = arguments[n3];
            try {
              return Promise.resolve(e3.apply(this, t2));
            } catch (e4) {
              return Promise.reject(e4);
            }
          };
        }(function(e3) {
          var t2, n3, r3, i2 = e3.start, a3 = e3.size || 65536;
          return t2 = function() {
            if (s2.file.chunked)
              return function(e4) {
                var t3 = e4();
                if (t3 && t3.then)
                  return t3.then(Ue);
              }(function() {
                if (!s2.file.available(i2, a3))
                  return function(e4) {
                    if (e4 && e4.then)
                      return e4.then(Ue);
                  }(function(e4, t3) {
                    try {
                      var n4 = e4();
                    } catch (e5) {
                      return t3(e5);
                    }
                    return n4 && n4.then ? n4.then(undefined, t3) : n4;
                  }(function() {
                    return t3 = s2.file.readChunk(i2, a3), n4 = function(t4) {
                      e3.chunk = t4;
                    }, r4 ? n4 ? n4(t3) : t3 : (t3 && t3.then || (t3 = Promise.resolve(t3)), n4 ? t3.then(n4) : t3);
                    var t3, n4, r4;
                  }, function(t3) {
                    I("Couldn't read segment: ".concat(JSON.stringify(e3), ". ").concat(t3.message));
                  }));
                e3.chunk = s2.file.subarray(i2, a3);
              });
            s2.file.byteLength > i2 + a3 ? e3.chunk = s2.file.subarray(i2, a3) : e3.size === undefined ? e3.chunk = s2.file.subarray(i2) : I("Segment unreachable: " + JSON.stringify(e3));
          }, n3 = function() {
            return e3.chunk;
          }, (r3 = t2()) && r3.then ? r3.then(n3) : n3(r3);
        })), this.extendOptions && this.extendOptions(n2), this.options = n2, this.file = r2, this.parsers = a2;
      }
      return r(e2, [{ key: "createParser", value: function(e3, t2) {
        var n2 = new (R.get(e3))(t2, this.options, this.file);
        return this.parsers[e3] = n2;
      } }]), e2;
    }(), Ce = function() {
      function e2(n2) {
        var r2 = this, a2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, s2 = arguments.length > 2 ? arguments[2] : undefined;
        t(this, e2), i(this, "errors", []), i(this, "raw", O()), i(this, "handleError", function(e3) {
          if (!r2.options.silentErrors)
            throw e3;
          r2.errors.push(e3.message);
        }), this.chunk = this.normalizeInput(n2), this.file = s2, this.type = this.constructor.type, this.globalOptions = this.options = a2, this.localOptions = a2[this.type], this.canTranslate = this.localOptions && this.localOptions.translate;
      }
      return r(e2, [{ key: "normalizeInput", value: function(e3) {
        return e3 instanceof F ? e3 : new F(e3);
      } }], [{ key: "findPosition", value: function(e3, t2) {
        var n2 = e3.getUint16(t2 + 2) + 2, r2 = typeof this.headerLength == "function" ? this.headerLength(e3, t2, n2) : this.headerLength, i2 = t2 + r2, a2 = n2 - r2;
        return { offset: t2, length: n2, headerLength: r2, start: i2, size: a2, end: i2 + a2 };
      } }, { key: "parse", value: function(e3) {
        var t2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, n2 = new ve(i({}, this.type, t2)), r2 = new this(e3, n2);
        return r2.parse();
      } }]), r(e2, [{ key: "translate", value: function() {
        this.canTranslate && (this.translated = this.translateBlock(this.raw, this.type));
      } }, { key: "translateBlock", value: function(e3, t2) {
        var n2 = ne.get(t2), r2 = te.get(t2), i2 = ee.get(t2), a2 = this.options[t2], s2 = a2.reviveValues && !!n2, u2 = a2.translateValues && !!r2, o2 = a2.translateKeys && !!i2, f2 = {}, c2 = e3;
        Array.isArray(c2) || (typeof c2.entries == "function" && (c2 = c2.entries()), c2 = k(c2));
        for (var h3 = 0;h3 < c2.length; h3++) {
          var l2 = c2[h3], d2 = l2[0], p2 = l2[1];
          s2 && n2.has(d2) ? p2 = n2.get(d2)(p2) : u2 && r2.has(d2) && (p2 = this.translateValue(p2, r2.get(d2))), o2 && i2.has(d2) && (d2 = i2.get(d2) || d2), f2[d2] = p2;
        }
        return f2;
      } }, { key: "translateValue", value: function(e3, t2) {
        return t2[e3] || e3;
      } }, { key: "assignToOutput", value: function(e3, t2) {
        this.assignObjectToOutput(e3, this.constructor.type, t2);
      } }, { key: "assignObjectToOutput", value: function(e3, t2, n2) {
        if (this.globalOptions.mergeOutput)
          return y(e3, n2);
        e3[t2] ? y(e3[t2], n2) : e3[t2] = n2;
      } }, { key: "output", get: function() {
        return this.translated ? this.translated : this.raw ? g(this.raw) : undefined;
      } }]), e2;
    }();
    function _e(e2, t2, n2) {
      return n2 ? t2 ? t2(e2) : e2 : (e2 && e2.then || (e2 = Promise.resolve(e2)), t2 ? e2.then(t2) : e2);
    }
    i(Ce, "headerLength", 4), i(Ce, "type", undefined), i(Ce, "multiSegment", false), i(Ce, "canHandle", function() {
      return false;
    });
    function je() {}
    function Be(e2, t2) {
      if (!t2)
        return e2 && e2.then ? e2.then(je) : Promise.resolve();
    }
    function Ve(e2) {
      var t2 = e2();
      if (t2 && t2.then)
        return t2.then(je);
    }
    function Ie(e2, t2) {
      var n2 = e2();
      return n2 && n2.then ? n2.then(t2) : t2(n2);
    }
    function ze(e2, t2, n2) {
      if (!e2.s) {
        if (n2 instanceof Le) {
          if (!n2.s)
            return void (n2.o = ze.bind(null, e2, t2));
          1 & t2 && (t2 = n2.s), n2 = n2.v;
        }
        if (n2 && n2.then)
          return void n2.then(ze.bind(null, e2, t2), ze.bind(null, e2, 2));
        e2.s = t2, e2.v = n2;
        var r2 = e2.o;
        r2 && r2(e2);
      }
    }
    var Le = function() {
      function e2() {}
      return e2.prototype.then = function(t2, n2) {
        var r2 = new e2, i2 = this.s;
        if (i2) {
          var a2 = 1 & i2 ? t2 : n2;
          if (a2) {
            try {
              ze(r2, 1, a2(this.v));
            } catch (e3) {
              ze(r2, 2, e3);
            }
            return r2;
          }
          return this;
        }
        return this.o = function(e3) {
          try {
            var i3 = e3.v;
            1 & e3.s ? ze(r2, 1, t2 ? t2(i3) : i3) : n2 ? ze(r2, 1, n2(i3)) : ze(r2, 2, i3);
          } catch (e4) {
            ze(r2, 2, e4);
          }
        }, r2;
      }, e2;
    }();
    function Te(e2) {
      return e2 instanceof Le && 1 & e2.s;
    }
    function Fe(e2, t2, n2) {
      for (var r2;; ) {
        var i2 = e2();
        if (Te(i2) && (i2 = i2.v), !i2)
          return a2;
        if (i2.then) {
          r2 = 0;
          break;
        }
        var a2 = n2();
        if (a2 && a2.then) {
          if (!Te(a2)) {
            r2 = 1;
            break;
          }
          a2 = a2.s;
        }
        if (t2) {
          var s2 = t2();
          if (s2 && s2.then && !Te(s2)) {
            r2 = 2;
            break;
          }
        }
      }
      var u2 = new Le, o2 = ze.bind(null, u2, 2);
      return (r2 === 0 ? i2.then(c2) : r2 === 1 ? a2.then(f2) : s2.then(h3)).then(undefined, o2), u2;
      function f2(r3) {
        a2 = r3;
        do {
          if (t2 && (s2 = t2()) && s2.then && !Te(s2))
            return void s2.then(h3).then(undefined, o2);
          if (!(i2 = e2()) || Te(i2) && !i2.v)
            return void ze(u2, 1, a2);
          if (i2.then)
            return void i2.then(c2).then(undefined, o2);
          Te(a2 = n2()) && (a2 = a2.v);
        } while (!a2 || !a2.then);
        a2.then(f2).then(undefined, o2);
      }
      function c2(e3) {
        e3 ? (a2 = n2()) && a2.then ? a2.then(f2).then(undefined, o2) : f2(a2) : ze(u2, 1, a2);
      }
      function h3() {
        (i2 = e2()) ? i2.then ? i2.then(c2).then(undefined, o2) : c2(i2) : ze(u2, 1, a2);
      }
    }
    function Ee(e2) {
      return e2 === 192 || e2 === 194 || e2 === 196 || e2 === 219 || e2 === 221 || e2 === 218 || e2 === 254;
    }
    function De(e2) {
      return e2 >= 224 && e2 <= 239;
    }
    function Me(e2, t2) {
      var n2 = R;
      Array.isArray(n2) || (typeof n2.entries == "function" && (n2 = n2.entries()), n2 = k(n2));
      for (var r2 = 0;r2 < n2.length; r2++) {
        var i2 = n2[r2], a2 = i2[0];
        if (i2[1].canHandle(e2, t2))
          return a2;
      }
    }
    var Re = function(e2) {
      function n2() {
        var e3, r2;
        t(this, n2);
        for (var a2 = arguments.length, u2 = new Array(a2), o2 = 0;o2 < a2; o2++)
          u2[o2] = arguments[o2];
        return i(h2(r2 = l(this, (e3 = s(n2)).call.apply(e3, [this].concat(u2)))), "appSegments", []), i(h2(r2), "jpegSegments", []), i(h2(r2), "unknownSegments", []), r2;
      }
      return a(n2, e2), r(n2, [{ key: "parse", value: function() {
        try {
          var e3 = this;
          return _e(e3.findAppSegments(), function() {
            return _e(e3.readSegments(), function() {
              e3.mergeMultiSegments(), e3.createParsers();
            });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "readSegments", value: function() {
        try {
          var e3 = this.appSegments.map(this.ensureSegmentChunk);
          return Be(Promise.all(e3));
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "setupSegmentFinderArgs", value: function(e3) {
        var t2 = this;
        e3 === true ? (this.findAll = true, this.wanted = w(R.keyList())) : (e3 = e3 === undefined ? R.keyList().filter(function(e4) {
          return t2.options[e4].enabled;
        }) : e3.filter(function(e4) {
          return t2.options[e4].enabled && R.has(e4);
        }), this.findAll = false, this.remaining = w(e3), this.wanted = w(e3)), this.unfinishedMultiSegment = false;
      } }, { key: "findAppSegments", value: function() {
        var e3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0, t2 = arguments.length > 1 ? arguments[1] : undefined;
        try {
          var n3 = this;
          n3.setupSegmentFinderArgs(t2);
          var { file: r2, findAll: i2, wanted: a2, remaining: s2 } = n3;
          return Ie(function() {
            if (!i2 && n3.file.chunked)
              return i2 = k(a2).some(function(e4) {
                var t3 = R.get(e4), r3 = n3.options[e4];
                return t3.multiSegment && r3.multiSegment;
              }), Ve(function() {
                if (i2)
                  return Be(n3.file.readWhole());
              });
          }, function() {
            var t3 = false;
            if (e3 = n3._findAppSegments(e3, r2.byteLength, i2, a2, s2), !n3.options.onlyTiff)
              return function() {
                if (r2.chunked) {
                  var i3 = false;
                  return Fe(function() {
                    return !t3 && s2.size > 0 && !i3 && (!!r2.canReadNextChunk || !!n3.unfinishedMultiSegment);
                  }, undefined, function() {
                    var a3 = r2.nextChunkOffset, s3 = n3.appSegments.some(function(e4) {
                      return !n3.file.available(e4.offset || e4.start, e4.length || e4.size);
                    });
                    return Ie(function() {
                      return e3 > a3 && !s3 ? _e(r2.readNextChunk(e3), function(e4) {
                        i3 = !e4;
                      }) : _e(r2.readNextChunk(a3), function(e4) {
                        i3 = !e4;
                      });
                    }, function() {
                      (e3 = n3._findAppSegments(e3, r2.byteLength)) === undefined && (t3 = true);
                    });
                  });
                }
              }();
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "_findAppSegments", value: function(e3, t2) {
        t2 -= 2;
        for (var n3, r2, i2, a2, s2, u2, o2 = this.file, f2 = this.findAll, c2 = this.wanted, h3 = this.remaining, l2 = this.options;e3 < t2; e3++)
          if (o2.getUint8(e3) === 255) {
            if (De(n3 = o2.getUint8(e3 + 1))) {
              if (r2 = o2.getUint16(e3 + 2), (i2 = Me(o2, e3)) && c2.has(i2) && (s2 = (a2 = R.get(i2)).findPosition(o2, e3), u2 = l2[i2], s2.type = i2, this.appSegments.push(s2), !f2 && (a2.multiSegment && u2.multiSegment ? (this.unfinishedMultiSegment = s2.chunkNumber < s2.chunkCount, this.unfinishedMultiSegment || h3.delete(i2)) : h3.delete(i2), h3.size === 0)))
                break;
              l2.recordUnknownSegments && ((s2 = Ce.findPosition(o2, e3)).marker = n3, this.unknownSegments.push(s2)), e3 += r2 + 1;
            } else if (Ee(n3)) {
              if (r2 = o2.getUint16(e3 + 2), n3 === 218 && l2.stopAfterSos !== false)
                return;
              l2.recordJpegSegments && this.jpegSegments.push({ offset: e3, length: r2, marker: n3 }), e3 += r2 + 1;
            }
          }
        return e3;
      } }, { key: "mergeMultiSegments", value: function() {
        var e3 = this;
        if (this.appSegments.some(function(e4) {
          return e4.multiSegment;
        })) {
          var t2 = function(e4, t3) {
            for (var n3, r2, i2, a2 = O(), s2 = 0;s2 < e4.length; s2++)
              n3 = e4[s2], r2 = n3[t3], a2.has(r2) ? i2 = a2.get(r2) : a2.set(r2, i2 = []), i2.push(n3);
            return k(a2);
          }(this.appSegments, "type");
          this.mergedAppSegments = t2.map(function(t3) {
            var n3 = t3[0], r2 = t3[1], i2 = R.get(n3, e3.options);
            return i2.handleMultiSegments ? { type: n3, chunk: i2.handleMultiSegments(r2) } : r2[0];
          });
        }
      } }, { key: "createParsers", value: function() {
        try {
          var e3 = this.mergedAppSegments || this.appSegments;
          Array.isArray(e3) || (typeof e3.entries == "function" && (e3 = e3.entries()), e3 = k(e3));
          for (var t2 = 0;t2 < e3.length; t2++) {
            var n3 = e3[t2], r2 = n3.type, i2 = n3.chunk;
            if (this.options[r2].enabled) {
              var a2 = this.parsers[r2];
              if (a2 && a2.append)
                ;
              else if (!a2) {
                var s2 = new (R.get(r2, this.options))(i2, this.options, this.file);
                this.parsers[r2] = s2;
              }
            }
          }
          return _e();
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "getSegment", value: function(e3) {
        return this.appSegments.find(function(t2) {
          return t2.type === e3;
        });
      } }, { key: "getOrFindSegment", value: function(e3) {
        try {
          var t2 = this, n3 = t2.getSegment(e3);
          return Ie(function() {
            if (n3 === undefined)
              return _e(t2.findAppSegments(0, [e3]), function() {
                n3 = t2.getSegment(e3);
              });
          }, function() {
            return n3;
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }], [{ key: "canHandle", value: function(e3, t2) {
        return t2 === 65496;
      } }]), n2;
    }(xe);
    function Ne() {}
    i(Re, "type", "jpeg"), M.set("jpeg", Re);
    function We(e2, t2) {
      if (!t2)
        return e2 && e2.then ? e2.then(Ne) : Promise.resolve();
    }
    function Ke(e2, t2) {
      var n2 = e2();
      return n2 && n2.then ? n2.then(t2) : t2(n2);
    }
    var He = [undefined, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4];
    var Xe = function(e2) {
      function n2() {
        return t(this, n2), l(this, s(n2).apply(this, arguments));
      }
      return a(n2, e2), r(n2, [{ key: "parse", value: function() {
        try {
          var e3 = this;
          e3.parseHeader();
          var t2 = e3.options;
          return Ke(function() {
            if (t2.ifd0.enabled)
              return We(e3.parseIfd0Block());
          }, function() {
            return Ke(function() {
              if (t2.exif.enabled)
                return We(e3.safeParse("parseExifBlock"));
            }, function() {
              return Ke(function() {
                if (t2.gps.enabled)
                  return We(e3.safeParse("parseGpsBlock"));
              }, function() {
                return Ke(function() {
                  if (t2.interop.enabled)
                    return We(e3.safeParse("parseInteropBlock"));
                }, function() {
                  return Ke(function() {
                    if (t2.ifd1.enabled)
                      return We(e3.safeParse("parseThumbnailBlock"));
                  }, function() {
                    return e3.createOutput();
                  });
                });
              });
            });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "safeParse", value: function(e3) {
        var t2 = this[e3]();
        return t2.catch !== undefined && (t2 = t2.catch(this.handleError)), t2;
      } }, { key: "findIfd0Offset", value: function() {
        this.ifd0Offset === undefined && (this.ifd0Offset = this.chunk.getUint32(4));
      } }, { key: "findIfd1Offset", value: function() {
        if (this.ifd1Offset === undefined) {
          this.findIfd0Offset();
          var e3 = this.chunk.getUint16(this.ifd0Offset), t2 = this.ifd0Offset + 2 + 12 * e3;
          this.ifd1Offset = this.chunk.getUint32(t2);
        }
      } }, { key: "parseBlock", value: function(e3, t2) {
        var n3 = O();
        return this[t2] = n3, this.parseTags(e3, t2, n3), n3;
      } }, { key: "parseIfd0Block", value: function() {
        try {
          var e3 = this;
          if (e3.ifd0)
            return;
          var t2 = e3.file;
          return e3.findIfd0Offset(), e3.ifd0Offset < 8 && I("Malformed EXIF data"), !t2.chunked && e3.ifd0Offset > t2.byteLength && I(`IFD0 offset points to outside of file.
this.ifd0Offset: `.concat(e3.ifd0Offset, ", file.byteLength: ").concat(t2.byteLength)), Ke(function() {
            if (t2.tiff)
              return We(t2.ensureChunk(e3.ifd0Offset, z(e3.options)));
          }, function() {
            var t3 = e3.parseBlock(e3.ifd0Offset, "ifd0");
            if (t3.size !== 0)
              return e3.exifOffset = t3.get(34665), e3.interopOffset = t3.get(40965), e3.gpsOffset = t3.get(34853), e3.xmp = t3.get(700), e3.iptc = t3.get(33723), e3.icc = t3.get(34675), e3.options.sanitize && (t3.delete(34665), t3.delete(40965), t3.delete(34853), t3.delete(700), t3.delete(33723), t3.delete(34675)), t3;
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "parseExifBlock", value: function() {
        try {
          var e3 = this;
          if (e3.exif)
            return;
          return Ke(function() {
            if (!e3.ifd0)
              return We(e3.parseIfd0Block());
          }, function() {
            if (e3.exifOffset !== undefined)
              return Ke(function() {
                if (e3.file.tiff)
                  return We(e3.file.ensureChunk(e3.exifOffset, z(e3.options)));
              }, function() {
                var t2 = e3.parseBlock(e3.exifOffset, "exif");
                return e3.interopOffset || (e3.interopOffset = t2.get(40965)), e3.makerNote = t2.get(37500), e3.userComment = t2.get(37510), e3.options.sanitize && (t2.delete(40965), t2.delete(37500), t2.delete(37510)), e3.unpack(t2, 41728), e3.unpack(t2, 41729), t2;
              });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "unpack", value: function(e3, t2) {
        var n3 = e3.get(t2);
        n3 && n3.length === 1 && e3.set(t2, n3[0]);
      } }, { key: "parseGpsBlock", value: function() {
        try {
          var e3 = this;
          if (e3.gps)
            return;
          return Ke(function() {
            if (!e3.ifd0)
              return We(e3.parseIfd0Block());
          }, function() {
            if (e3.gpsOffset !== undefined) {
              var t2 = e3.parseBlock(e3.gpsOffset, "gps");
              return t2 && t2.has(2) && t2.has(4) && (t2.set("latitude", Ye.apply(undefined, t2.get(2).concat([t2.get(1)]))), t2.set("longitude", Ye.apply(undefined, t2.get(4).concat([t2.get(3)])))), t2;
            }
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "parseInteropBlock", value: function() {
        try {
          var e3 = this;
          if (e3.interop)
            return;
          return Ke(function() {
            if (!e3.ifd0)
              return We(e3.parseIfd0Block());
          }, function() {
            return Ke(function() {
              if (e3.interopOffset === undefined && !e3.exif)
                return We(e3.parseExifBlock());
            }, function() {
              if (e3.interopOffset !== undefined)
                return e3.parseBlock(e3.interopOffset, "interop");
            });
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "parseThumbnailBlock", value: function() {
        var e3 = arguments.length > 0 && arguments[0] !== undefined && arguments[0];
        try {
          var t2 = this;
          if (t2.ifd1 || t2.ifd1Parsed)
            return;
          if (t2.options.mergeOutput && !e3)
            return;
          return t2.findIfd1Offset(), t2.ifd1Offset > 0 && (t2.parseBlock(t2.ifd1Offset, "ifd1"), t2.ifd1Parsed = true), t2.ifd1;
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "extractThumbnail", value: function() {
        try {
          var e3 = this;
          return e3.headerParsed || e3.parseHeader(), Ke(function() {
            if (!e3.ifd1Parsed)
              return We(e3.parseThumbnailBlock(true));
          }, function() {
            if (e3.ifd1 !== undefined) {
              var t2 = e3.ifd1.get(513), n3 = e3.ifd1.get(514);
              return e3.chunk.getUint8Array(t2, n3);
            }
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "createOutput", value: function() {
        var e3, t2, n3, r2 = {}, i2 = se;
        Array.isArray(i2) || (typeof i2.entries == "function" && (i2 = i2.entries()), i2 = k(i2));
        for (var a2 = 0;a2 < i2.length; a2++)
          if (!V(e3 = this[t2 = i2[a2]]))
            if (n3 = this.canTranslate ? this.translateBlock(e3, t2) : g(e3), this.options.mergeOutput) {
              if (t2 === "ifd1")
                continue;
              y(r2, n3);
            } else
              r2[t2] = n3;
        return this.makerNote && (r2.makerNote = this.makerNote), this.userComment && (r2.userComment = this.userComment), r2;
      } }, { key: "assignToOutput", value: function(e3, t2) {
        if (this.globalOptions.mergeOutput)
          y(e3, t2);
        else {
          var n3 = v(t2);
          Array.isArray(n3) || (typeof n3.entries == "function" && (n3 = n3.entries()), n3 = k(n3));
          for (var r2 = 0;r2 < n3.length; r2++) {
            var i2 = n3[r2], a2 = i2[0], s2 = i2[1];
            this.assignObjectToOutput(e3, a2, s2);
          }
        }
      } }, { key: "image", get: function() {
        return this.ifd0;
      } }, { key: "thumbnail", get: function() {
        return this.ifd1;
      } }], [{ key: "canHandle", value: function(e3, t2) {
        return e3.getUint8(t2 + 1) === 225 && e3.getUint32(t2 + 4) === 1165519206 && e3.getUint16(t2 + 8) === 0;
      } }]), n2;
    }(function(e2) {
      function n2() {
        return t(this, n2), l(this, s(n2).apply(this, arguments));
      }
      return a(n2, e2), r(n2, [{ key: "parseHeader", value: function() {
        var e3 = this.chunk.getUint16();
        e3 === 18761 ? this.le = true : e3 === 19789 && (this.le = false), this.chunk.le = this.le, this.headerParsed = true;
      } }, { key: "parseTags", value: function(e3, t2) {
        var n3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : O(), r2 = this.options[t2], i2 = r2.pick, a2 = r2.skip, s2 = (i2 = w(i2)).size > 0, u2 = a2.size === 0, o2 = this.chunk.getUint16(e3);
        e3 += 2;
        for (var f2 = 0;f2 < o2; f2++) {
          var c2 = this.chunk.getUint16(e3);
          if (s2) {
            if (i2.has(c2) && (n3.set(c2, this.parseTag(e3, c2, t2)), i2.delete(c2), i2.size === 0))
              break;
          } else
            !u2 && a2.has(c2) || n3.set(c2, this.parseTag(e3, c2, t2));
          e3 += 12;
        }
        return n3;
      } }, { key: "parseTag", value: function(e3, t2, n3) {
        var r2, i2 = this.chunk, a2 = i2.getUint16(e3 + 2), s2 = i2.getUint32(e3 + 4), u2 = He[a2];
        if (u2 * s2 <= 4 ? e3 += 8 : e3 = i2.getUint32(e3 + 8), (a2 < 1 || a2 > 13) && I("Invalid TIFF value type. block: ".concat(n3.toUpperCase(), ", tag: ").concat(t2.toString(16), ", type: ").concat(a2, ", offset ").concat(e3)), e3 > i2.byteLength && I("Invalid TIFF value offset. block: ".concat(n3.toUpperCase(), ", tag: ").concat(t2.toString(16), ", type: ").concat(a2, ", offset ").concat(e3, " is outside of chunk size ").concat(i2.byteLength)), a2 === 1)
          return i2.getUint8Array(e3, s2);
        if (a2 === 2)
          return (r2 = function(e4) {
            for (;e4.endsWith("\x00"); )
              e4 = e4.slice(0, -1);
            return e4;
          }(r2 = i2.getString(e3, s2)).trim()) === "" ? undefined : r2;
        if (a2 === 7)
          return i2.getUint8Array(e3, s2);
        if (s2 === 1)
          return this.parseTagValue(a2, e3);
        for (var o2 = new (function(e4) {
          switch (e4) {
            case 1:
              return Uint8Array;
            case 3:
              return Uint16Array;
            case 4:
              return Uint32Array;
            case 5:
              return Array;
            case 6:
              return Int8Array;
            case 8:
              return Int16Array;
            case 9:
              return Int32Array;
            case 10:
              return Array;
            case 11:
              return Float32Array;
            case 12:
              return Float64Array;
            default:
              return Array;
          }
        }(a2))(s2), f2 = u2, c2 = 0;c2 < s2; c2++)
          o2[c2] = this.parseTagValue(a2, e3), e3 += f2;
        return o2;
      } }, { key: "parseTagValue", value: function(e3, t2) {
        var n3 = this.chunk;
        switch (e3) {
          case 1:
            return n3.getUint8(t2);
          case 3:
            return n3.getUint16(t2);
          case 4:
            return n3.getUint32(t2);
          case 5:
            return n3.getUint32(t2) / n3.getUint32(t2 + 4);
          case 6:
            return n3.getInt8(t2);
          case 8:
            return n3.getInt16(t2);
          case 9:
            return n3.getInt32(t2);
          case 10:
            return n3.getInt32(t2) / n3.getInt32(t2 + 4);
          case 11:
            return n3.getFloat(t2);
          case 12:
            return n3.getDouble(t2);
          case 13:
            return n3.getUint32(t2);
          default:
            I("Invalid tiff type ".concat(e3));
        }
      } }]), n2;
    }(Ce));
    function Ye(e2, t2, n2, r2) {
      var i2 = e2 + t2 / 60 + n2 / 3600;
      return r2 !== "S" && r2 !== "W" || (i2 *= -1), i2;
    }
    i(Xe, "type", "tiff"), i(Xe, "headerLength", 10), R.set("tiff", Xe);
    var Ge = Object.freeze({ __proto__: null, default: Pe, parse: Se, Exifr: we, fileParsers: M, segmentParsers: R, fileReaders: N, tagKeys: ee, tagValues: te, tagRevivers: ne, createDictionary: Z, extendDictionary: $, fetchUrlAsArrayBuffer: X, readBlobAsArrayBuffer: H, chunkedProps: re, otherSegments: ie, segments: ae, tiffBlocks: se, segmentsAndBlocks: ue, tiffExtractables: oe, inheritables: fe, allFormatters: ce, Options: ve });
    function Je(e2, t2, n2) {
      return n2 ? t2 ? t2(e2) : e2 : (e2 && e2.then || (e2 = Promise.resolve(e2)), t2 ? e2.then(t2) : e2);
    }
    function qe(e2) {
      return function() {
        for (var t2 = [], n2 = 0;n2 < arguments.length; n2++)
          t2[n2] = arguments[n2];
        try {
          return Promise.resolve(e2.apply(this, t2));
        } catch (e3) {
          return Promise.reject(e3);
        }
      };
    }
    var Qe = qe(function(e2) {
      var t2 = new we(rt);
      return Je(t2.read(e2), function() {
        return Je(t2.parse(), function(e3) {
          if (e3 && e3.ifd0)
            return e3.ifd0[274];
        });
      });
    }), Ze = qe(function(e2) {
      var t2 = new we(nt);
      return Je(t2.read(e2), function() {
        return Je(t2.parse(), function(e3) {
          if (e3 && e3.gps) {
            var t3 = e3.gps;
            return { latitude: t3.latitude, longitude: t3.longitude };
          }
        });
      });
    }), $e = qe(function(e2) {
      return Je(this.thumbnail(e2), function(e3) {
        if (e3 !== undefined) {
          var t2 = new Blob([e3]);
          return URL.createObjectURL(t2);
        }
      });
    }), et = qe(function(e2) {
      var t2 = new we(it);
      return Je(t2.read(e2), function() {
        return Je(t2.extractThumbnail(), function(e3) {
          return e3 && j ? _.from(e3) : e3;
        });
      });
    }), tt = { ifd0: false, ifd1: false, exif: false, gps: false, interop: false, sanitize: false, reviveValues: true, translateKeys: false, translateValues: false, mergeOutput: false }, nt = y({}, tt, { firstChunkSize: 40000, gps: [1, 2, 3, 4] }), rt = y({}, tt, { firstChunkSize: 40000, ifd0: [274] }), it = y({}, tt, { tiff: false, ifd1: true, mergeOutput: false }), at = { 1: { dimensionSwapped: false, scaleX: 1, scaleY: 1, deg: 0, rad: 0 }, 2: { dimensionSwapped: false, scaleX: -1, scaleY: 1, deg: 0, rad: 0 }, 3: { dimensionSwapped: false, scaleX: 1, scaleY: 1, deg: 180, rad: 180 * Math.PI / 180 }, 4: { dimensionSwapped: false, scaleX: -1, scaleY: 1, deg: 180, rad: 180 * Math.PI / 180 }, 5: { dimensionSwapped: true, scaleX: 1, scaleY: -1, deg: 90, rad: 90 * Math.PI / 180 }, 6: { dimensionSwapped: true, scaleX: 1, scaleY: 1, deg: 90, rad: 90 * Math.PI / 180 }, 7: { dimensionSwapped: true, scaleX: 1, scaleY: -1, deg: 270, rad: 270 * Math.PI / 180 }, 8: { dimensionSwapped: true, scaleX: 1, scaleY: 1, deg: 270, rad: 270 * Math.PI / 180 } };
    if (e.rotateCanvas = true, e.rotateCss = true, typeof navigator == "object") {
      var st = navigator.userAgent;
      if (st.includes("iPad") || st.includes("iPhone")) {
        var ut = st.match(/OS (\d+)_(\d+)/), ot = (ut[0], ut[1]), ft = ut[2], ct = Number(ot) + 0.1 * Number(ft);
        e.rotateCanvas = ct < 13.4, e.rotateCss = false;
      }
      if (st.includes("Chrome/")) {
        var ht = st.match(/Chrome\/(\d+)/), lt = (ht[0], ht[1]);
        Number(lt) >= 81 && (e.rotateCanvas = e.rotateCss = false);
      }
    }
    function dt() {}
    var pt = function(e2) {
      function n2() {
        var e3, r2;
        t(this, n2);
        for (var a2 = arguments.length, u2 = new Array(a2), o2 = 0;o2 < a2; o2++)
          u2[o2] = arguments[o2];
        return i(h2(r2 = l(this, (e3 = s(n2)).call.apply(e3, [this].concat(u2)))), "ranges", new vt), r2.byteLength !== 0 && r2.ranges.add(0, r2.byteLength), r2;
      }
      return a(n2, e2), r(n2, [{ key: "_tryExtend", value: function(e3, t2, n3) {
        if (e3 === 0 && this.byteLength === 0 && n3) {
          var r2 = new DataView(n3.buffer || n3, n3.byteOffset, n3.byteLength);
          this._swapDataView(r2);
        } else {
          var i2 = e3 + t2;
          if (i2 > this.byteLength) {
            var a2 = this._extend(i2).dataView;
            this._swapDataView(a2);
          }
        }
      } }, { key: "_extend", value: function(e3) {
        var t2;
        t2 = j ? _.allocUnsafe(e3) : new Uint8Array(e3);
        var n3 = new DataView(t2.buffer, t2.byteOffset, t2.byteLength);
        return t2.set(new Uint8Array(this.buffer, this.byteOffset, this.byteLength), 0), { uintView: t2, dataView: n3 };
      } }, { key: "subarray", value: function(e3, t2) {
        var r2 = arguments.length > 2 && arguments[2] !== undefined && arguments[2];
        return t2 = t2 || this._lengthToEnd(e3), r2 && this._tryExtend(e3, t2), this.ranges.add(e3, t2), d(s(n2.prototype), "subarray", this).call(this, e3, t2);
      } }, { key: "set", value: function(e3, t2) {
        var r2 = arguments.length > 2 && arguments[2] !== undefined && arguments[2];
        r2 && this._tryExtend(t2, e3.byteLength, e3);
        var i2 = d(s(n2.prototype), "set", this).call(this, e3, t2);
        return this.ranges.add(t2, i2.byteLength), i2;
      } }, { key: "ensureChunk", value: function(e3, t2) {
        try {
          if (!this.chunked)
            return;
          if (this.ranges.available(e3, t2))
            return;
          return function(e4, t3) {
            if (!t3)
              return e4 && e4.then ? e4.then(dt) : Promise.resolve();
          }(this.readChunk(e3, t2));
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "available", value: function(e3, t2) {
        return this.ranges.available(e3, t2);
      } }]), n2;
    }(F), vt = function() {
      function e2() {
        t(this, e2), i(this, "list", []);
      }
      return r(e2, [{ key: "add", value: function(e3, t2) {
        var n2 = e3 + t2, r2 = this.list.filter(function(t3) {
          return yt(e3, t3.offset, n2) || yt(e3, t3.end, n2);
        });
        if (r2.length > 0) {
          e3 = Math.min.apply(Math, [e3].concat(r2.map(function(e4) {
            return e4.offset;
          }))), t2 = (n2 = Math.max.apply(Math, [n2].concat(r2.map(function(e4) {
            return e4.end;
          })))) - e3;
          var i2 = r2.shift();
          i2.offset = e3, i2.length = t2, i2.end = n2, this.list = this.list.filter(function(e4) {
            return !r2.includes(e4);
          });
        } else
          this.list.push({ offset: e3, length: t2, end: n2 });
      } }, { key: "available", value: function(e3, t2) {
        var n2 = e3 + t2;
        return this.list.some(function(t3) {
          return t3.offset <= e3 && n2 <= t3.end;
        });
      } }, { key: "length", get: function() {
        return this.list.length;
      } }]), e2;
    }();
    function yt(e2, t2, n2) {
      return e2 <= t2 && t2 <= n2;
    }
    function gt() {}
    function kt(e2, t2) {
      if (!t2)
        return e2 && e2.then ? e2.then(gt) : Promise.resolve();
    }
    function mt(e2, t2, n2) {
      return n2 ? t2 ? t2(e2) : e2 : (e2 && e2.then || (e2 = Promise.resolve(e2)), t2 ? e2.then(t2) : e2);
    }
    var bt = function(e2) {
      function n2() {
        return t(this, n2), l(this, s(n2).apply(this, arguments));
      }
      return a(n2, e2), r(n2, [{ key: "readWhole", value: function() {
        try {
          var e3 = this;
          return e3.chunked = false, mt(H(e3.input), function(t2) {
            e3._swapArrayBuffer(t2);
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "readChunked", value: function() {
        return this.chunked = true, this.size = this.input.size, d(s(n2.prototype), "readChunked", this).call(this);
      } }, { key: "_readChunk", value: function(e3, t2) {
        try {
          var n3 = this, r2 = t2 ? e3 + t2 : undefined, i2 = n3.input.slice(e3, r2);
          return mt(H(i2), function(t3) {
            return n3.set(t3, e3, true);
          });
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }]), n2;
    }(function(e2) {
      function n2(e3, r2) {
        var a2;
        return t(this, n2), i(h2(a2 = l(this, s(n2).call(this, 0))), "chunksRead", 0), a2.input = e3, a2.options = r2, a2;
      }
      return a(n2, e2), r(n2, [{ key: "readWhole", value: function() {
        try {
          return this.chunked = false, kt(this.readChunk(this.nextChunkOffset));
        } catch (e3) {
          return Promise.reject(e3);
        }
      } }, { key: "readChunked", value: function() {
        try {
          return this.chunked = true, kt(this.readChunk(0, this.options.firstChunkSize));
        } catch (e3) {
          return Promise.reject(e3);
        }
      } }, { key: "readNextChunk", value: function(e3) {
        try {
          if (e3 === undefined && (e3 = this.nextChunkOffset), this.fullyRead)
            return this.chunksRead++, false;
          var t2 = this.options.chunkSize;
          return n3 = this.readChunk(e3, t2), r2 = function(e4) {
            return !!e4 && e4.byteLength === t2;
          }, i2 ? r2 ? r2(n3) : n3 : (n3 && n3.then || (n3 = Promise.resolve(n3)), r2 ? n3.then(r2) : n3);
        } catch (e4) {
          return Promise.reject(e4);
        }
        var n3, r2, i2;
      } }, { key: "readChunk", value: function(e3, t2) {
        try {
          if (this.chunksRead++, (t2 = this.safeWrapAddress(e3, t2)) === 0)
            return;
          return this._readChunk(e3, t2);
        } catch (e4) {
          return Promise.reject(e4);
        }
      } }, { key: "safeWrapAddress", value: function(e3, t2) {
        return this.size !== undefined && e3 + t2 > this.size ? Math.max(0, this.size - e3) : t2;
      } }, { key: "read", value: function() {
        return this.options.chunked ? this.readChunked() : this.readWhole();
      } }, { key: "close", value: function() {} }, { key: "nextChunkOffset", get: function() {
        if (this.ranges.list.length !== 0)
          return this.ranges.list[0].length;
      } }, { key: "canReadNextChunk", get: function() {
        return this.chunksRead < this.options.chunkLimit;
      } }, { key: "fullyRead", get: function() {
        return this.size !== undefined && this.nextChunkOffset === this.size;
      } }]), n2;
    }(pt));
    N.set("blob", bt), e.Exifr = we, e.Options = ve, e.allFormatters = ce, e.chunkedProps = re, e.createDictionary = Z, e.default = Ge, e.disableAllOptions = tt, e.extendDictionary = $, e.fetchUrlAsArrayBuffer = X, e.fileParsers = M, e.fileReaders = N, e.gps = Ze, e.gpsOnlyOptions = nt, e.inheritables = fe, e.orientation = Qe, e.orientationOnlyOptions = rt, e.otherSegments = ie, e.parse = Se, e.readBlobAsArrayBuffer = H, e.rotation = function(t2) {
      return Je(Qe(t2), function(t3) {
        return y({ canvas: e.rotateCanvas, css: e.rotateCss }, at[t3]);
      });
    }, e.rotations = at, e.segmentParsers = R, e.segments = ae, e.segmentsAndBlocks = ue, e.tagKeys = ee, e.tagRevivers = ne, e.tagValues = te, e.thumbnail = et, e.thumbnailOnlyOptions = it, e.thumbnailUrl = $e, e.tiffBlocks = se, e.tiffExtractables = oe, Object.defineProperty(e, "__esModule", { value: true });
  });
});

// node_modules/@uppy/thumbnail-generator/lib/index.js
var require_lib5 = __commonJS(function(exports, module) {
  var _class;
  var _temp;
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_lib2();
  var Plugin = _require.Plugin;
  var Translator = require_Translator();
  var dataURItoBlob = require_dataURItoBlob();
  var isObjectURL = require_isObjectURL();
  var isPreviewSupported = require_isPreviewSupported();
  var MathLog2 = require_math_log2();
  var exifr = require_mini_legacy_umd();
  module.exports = (_temp = _class = /* @__PURE__ */ function(_Plugin) {
    _inheritsLoose(ThumbnailGenerator, _Plugin);
    function ThumbnailGenerator(uppy, opts) {
      var _this;
      _this = _Plugin.call(this, uppy, opts) || this;
      _this.onFileAdded = function(file) {
        if (!file.preview && isPreviewSupported(file.type) && !file.isRemote) {
          _this.addToQueue(file.id);
        }
      };
      _this.onCancelRequest = function(file) {
        var index = _this.queue.indexOf(file.id);
        if (index !== -1) {
          _this.queue.splice(index, 1);
        }
      };
      _this.onFileRemoved = function(file) {
        var index = _this.queue.indexOf(file.id);
        if (index !== -1) {
          _this.queue.splice(index, 1);
        }
        if (file.preview && isObjectURL(file.preview)) {
          URL.revokeObjectURL(file.preview);
        }
      };
      _this.onRestored = function() {
        var _this$uppy$getState = _this.uppy.getState(), files = _this$uppy$getState.files;
        var fileIDs = Object.keys(files);
        fileIDs.forEach(function(fileID) {
          var file = _this.uppy.getFile(fileID);
          if (!file.isRestored)
            return;
          if (!file.preview || isObjectURL(file.preview)) {
            _this.addToQueue(file.id);
          }
        });
      };
      _this.waitUntilAllProcessed = function(fileIDs) {
        fileIDs.forEach(function(fileID) {
          var file = _this.uppy.getFile(fileID);
          _this.uppy.emit("preprocess-progress", file, {
            mode: "indeterminate",
            message: _this.i18n("generatingThumbnails")
          });
        });
        var emitPreprocessCompleteForAll = function emitPreprocessCompleteForAll2() {
          fileIDs.forEach(function(fileID) {
            var file = _this.uppy.getFile(fileID);
            _this.uppy.emit("preprocess-complete", file);
          });
        };
        return new Promise(function(resolve, reject) {
          if (_this.queueProcessing) {
            _this.uppy.once("thumbnail:all-generated", function() {
              emitPreprocessCompleteForAll();
              resolve();
            });
          } else {
            emitPreprocessCompleteForAll();
            resolve();
          }
        });
      };
      _this.type = "modifier";
      _this.id = _this.opts.id || "ThumbnailGenerator";
      _this.title = "Thumbnail Generator";
      _this.queue = [];
      _this.queueProcessing = false;
      _this.defaultThumbnailDimension = 200;
      _this.defaultLocale = {
        strings: {
          generatingThumbnails: "Generating thumbnails..."
        }
      };
      var defaultOptions = {
        thumbnailWidth: null,
        thumbnailHeight: null,
        waitForThumbnailsBeforeUpload: false,
        lazy: false
      };
      _this.opts = _extends({}, defaultOptions, opts);
      if (_this.opts.lazy && _this.opts.waitForThumbnailsBeforeUpload) {
        throw new Error("ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`.");
      }
      _this.i18nInit();
      return _this;
    }
    var _proto = ThumbnailGenerator.prototype;
    _proto.setOptions = function setOptions(newOpts) {
      _Plugin.prototype.setOptions.call(this, newOpts);
      this.i18nInit();
    };
    _proto.i18nInit = function i18nInit() {
      this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
      this.i18n = this.translator.translate.bind(this.translator);
      this.setPluginState();
    };
    _proto.createThumbnail = function createThumbnail(file, targetWidth, targetHeight) {
      var _this2 = this;
      var originalUrl = URL.createObjectURL(file.data);
      var onload = new Promise(function(resolve, reject) {
        var image = new Image;
        image.src = originalUrl;
        image.addEventListener("load", function() {
          URL.revokeObjectURL(originalUrl);
          resolve(image);
        });
        image.addEventListener("error", function(event) {
          URL.revokeObjectURL(originalUrl);
          reject(event.error || new Error("Could not create thumbnail"));
        });
      });
      var orientationPromise = exifr.rotation(file.data).catch(function(_err) {
        return 1;
      });
      return Promise.all([onload, orientationPromise]).then(function(_ref) {
        var image = _ref[0], orientation = _ref[1];
        var dimensions = _this2.getProportionalDimensions(image, targetWidth, targetHeight, orientation.deg);
        var rotatedImage = _this2.rotateImage(image, orientation);
        var resizedImage = _this2.resizeImage(rotatedImage, dimensions.width, dimensions.height);
        return _this2.canvasToBlob(resizedImage, "image/jpeg", 80);
      }).then(function(blob) {
        return URL.createObjectURL(blob);
      });
    };
    _proto.getProportionalDimensions = function getProportionalDimensions(img, width, height, rotation) {
      var aspect = img.width / img.height;
      if (rotation === 90 || rotation === 270) {
        aspect = img.height / img.width;
      }
      if (width != null) {
        return {
          width,
          height: Math.round(width / aspect)
        };
      }
      if (height != null) {
        return {
          width: Math.round(height * aspect),
          height
        };
      }
      return {
        width: this.defaultThumbnailDimension,
        height: Math.round(this.defaultThumbnailDimension / aspect)
      };
    };
    _proto.protect = function protect(image) {
      var ratio = image.width / image.height;
      var maxSquare = 5000000;
      var maxSize = 4096;
      var maxW = Math.floor(Math.sqrt(maxSquare * ratio));
      var maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));
      if (maxW > maxSize) {
        maxW = maxSize;
        maxH = Math.round(maxW / ratio);
      }
      if (maxH > maxSize) {
        maxH = maxSize;
        maxW = Math.round(ratio * maxH);
      }
      if (image.width > maxW) {
        var canvas = document.createElement("canvas");
        canvas.width = maxW;
        canvas.height = maxH;
        canvas.getContext("2d").drawImage(image, 0, 0, maxW, maxH);
        image = canvas;
      }
      return image;
    };
    _proto.resizeImage = function resizeImage(image, targetWidth, targetHeight) {
      image = this.protect(image);
      var steps = Math.ceil(MathLog2(image.width / targetWidth));
      if (steps < 1) {
        steps = 1;
      }
      var sW = targetWidth * Math.pow(2, steps - 1);
      var sH = targetHeight * Math.pow(2, steps - 1);
      var x = 2;
      while (steps--) {
        var canvas = document.createElement("canvas");
        canvas.width = sW;
        canvas.height = sH;
        canvas.getContext("2d").drawImage(image, 0, 0, sW, sH);
        image = canvas;
        sW = Math.round(sW / x);
        sH = Math.round(sH / x);
      }
      return image;
    };
    _proto.rotateImage = function rotateImage(image, translate) {
      var w = image.width;
      var h2 = image.height;
      if (translate.deg === 90 || translate.deg === 270) {
        w = image.height;
        h2 = image.width;
      }
      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h2;
      var context = canvas.getContext("2d");
      context.translate(w / 2, h2 / 2);
      if (translate.canvas) {
        context.rotate(translate.rad);
        context.scale(translate.scaleX, translate.scaleY);
      }
      context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
      return canvas;
    };
    _proto.canvasToBlob = function canvasToBlob(canvas, type, quality) {
      try {
        canvas.getContext("2d").getImageData(0, 0, 1, 1);
      } catch (err) {
        if (err.code === 18) {
          return Promise.reject(new Error("cannot read image, probably an svg with external resources"));
        }
      }
      if (canvas.toBlob) {
        return new Promise(function(resolve) {
          canvas.toBlob(resolve, type, quality);
        }).then(function(blob) {
          if (blob === null) {
            throw new Error("cannot read image, probably an svg with external resources");
          }
          return blob;
        });
      }
      return Promise.resolve().then(function() {
        return dataURItoBlob(canvas.toDataURL(type, quality), {});
      }).then(function(blob) {
        if (blob === null) {
          throw new Error("could not extract blob, probably an old browser");
        }
        return blob;
      });
    };
    _proto.setPreviewURL = function setPreviewURL(fileID, preview) {
      this.uppy.setFileState(fileID, {
        preview
      });
    };
    _proto.addToQueue = function addToQueue(item) {
      this.queue.push(item);
      if (this.queueProcessing === false) {
        this.processQueue();
      }
    };
    _proto.processQueue = function processQueue() {
      var _this3 = this;
      this.queueProcessing = true;
      if (this.queue.length > 0) {
        var current = this.uppy.getFile(this.queue.shift());
        if (!current) {
          this.uppy.log("[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug", "error");
          return;
        }
        return this.requestThumbnail(current).catch(function(err) {}).then(function() {
          return _this3.processQueue();
        });
      } else {
        this.queueProcessing = false;
        this.uppy.log("[ThumbnailGenerator] Emptied thumbnail queue");
        this.uppy.emit("thumbnail:all-generated");
      }
    };
    _proto.requestThumbnail = function requestThumbnail(file) {
      var _this4 = this;
      if (isPreviewSupported(file.type) && !file.isRemote) {
        return this.createThumbnail(file, this.opts.thumbnailWidth, this.opts.thumbnailHeight).then(function(preview) {
          _this4.setPreviewURL(file.id, preview);
          _this4.uppy.log("[ThumbnailGenerator] Generated thumbnail for " + file.id);
          _this4.uppy.emit("thumbnail:generated", _this4.uppy.getFile(file.id), preview);
        }).catch(function(err) {
          _this4.uppy.log("[ThumbnailGenerator] Failed thumbnail for " + file.id + ":", "warning");
          _this4.uppy.log(err, "warning");
          _this4.uppy.emit("thumbnail:error", _this4.uppy.getFile(file.id), err);
        });
      }
      return Promise.resolve();
    };
    _proto.install = function install() {
      this.uppy.on("file-removed", this.onFileRemoved);
      if (this.opts.lazy) {
        this.uppy.on("thumbnail:request", this.onFileAdded);
        this.uppy.on("thumbnail:cancel", this.onCancelRequest);
      } else {
        this.uppy.on("file-added", this.onFileAdded);
        this.uppy.on("restored", this.onRestored);
      }
      if (this.opts.waitForThumbnailsBeforeUpload) {
        this.uppy.addPreProcessor(this.waitUntilAllProcessed);
      }
    };
    _proto.uninstall = function uninstall() {
      this.uppy.off("file-removed", this.onFileRemoved);
      if (this.opts.lazy) {
        this.uppy.off("thumbnail:request", this.onFileAdded);
        this.uppy.off("thumbnail:cancel", this.onCancelRequest);
      } else {
        this.uppy.off("file-added", this.onFileAdded);
        this.uppy.off("restored", this.onRestored);
      }
      if (this.opts.waitForThumbnailsBeforeUpload) {
        this.uppy.removePreProcessor(this.waitUntilAllProcessed);
      }
    };
    return ThumbnailGenerator;
  }(Plugin), _class.VERSION = "1.6.6", _temp);
});

// node_modules/@uppy/utils/lib/findAllDOMElements.js
var require_findAllDOMElements = __commonJS(function(exports, module) {
  var isDOMElement = require_isDOMElement();
  module.exports = function findAllDOMElements(element) {
    if (typeof element === "string") {
      var elements = [].slice.call(document.querySelectorAll(element));
      return elements.length > 0 ? elements : null;
    }
    if (typeof element === "object" && isDOMElement(element)) {
      return [element];
    }
  };
});

// node_modules/@uppy/utils/lib/toArray.js
var require_toArray = __commonJS(function(exports, module) {
  module.exports = function toArray(list) {
    return Array.prototype.slice.call(list || [], 0);
  };
});

// node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js
var require_getRelativePath = __commonJS(function(exports, module) {
  module.exports = function getRelativePath(fileEntry) {
    if (!fileEntry.fullPath || fileEntry.fullPath === "/" + fileEntry.name) {
      return null;
    } else {
      return fileEntry.fullPath;
    }
  };
});

// node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js
var require_getFilesAndDirectoriesFromDirectory = __commonJS(function(exports, module) {
  module.exports = function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, _ref) {
    var onSuccess = _ref.onSuccess;
    directoryReader.readEntries(function(entries) {
      var newEntries = [].concat(oldEntries, entries);
      if (entries.length) {
        setTimeout(function() {
          getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, {
            onSuccess
          });
        }, 0);
      } else {
        onSuccess(newEntries);
      }
    }, function(error) {
      logDropError(error);
      onSuccess(oldEntries);
    });
  };
});

// node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js
var require_webkitGetAsEntryApi = __commonJS(function(exports, module) {
  var toArray = require_toArray();
  var getRelativePath = require_getRelativePath();
  var getFilesAndDirectoriesFromDirectory = require_getFilesAndDirectoriesFromDirectory();
  module.exports = function webkitGetAsEntryApi(dataTransfer, logDropError) {
    var files = [];
    var rootPromises = [];
    var createPromiseToAddFileOrParseDirectory = function createPromiseToAddFileOrParseDirectory2(entry) {
      return new Promise(function(resolve) {
        if (entry.isFile) {
          entry.file(function(file) {
            file.relativePath = getRelativePath(entry);
            files.push(file);
            resolve();
          }, function(error) {
            logDropError(error);
            resolve();
          });
        } else if (entry.isDirectory) {
          var directoryReader = entry.createReader();
          getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
            onSuccess: function onSuccess(entries) {
              var promises = entries.map(function(entry2) {
                return createPromiseToAddFileOrParseDirectory2(entry2);
              });
              Promise.all(promises).then(function() {
                return resolve();
              });
            }
          });
        }
      });
    };
    toArray(dataTransfer.items).forEach(function(item) {
      var entry = item.webkitGetAsEntry();
      if (entry) {
        rootPromises.push(createPromiseToAddFileOrParseDirectory(entry));
      }
    });
    return Promise.all(rootPromises).then(function() {
      return files;
    });
  };
});

// node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js
var require_fallbackApi = __commonJS(function(exports, module) {
  var toArray = require_toArray();
  module.exports = function fallbackApi(dataTransfer) {
    var files = toArray(dataTransfer.files);
    return Promise.resolve(files);
  };
});

// node_modules/@uppy/utils/lib/getDroppedFiles/index.js
var require_getDroppedFiles = __commonJS(function(exports, module) {
  var webkitGetAsEntryApi = require_webkitGetAsEntryApi();
  var fallbackApi = require_fallbackApi();
  module.exports = function getDroppedFiles(dataTransfer, _temp) {
    var _ref = _temp === undefined ? {} : _temp, _ref$logDropError = _ref.logDropError, logDropError = _ref$logDropError === undefined ? function() {} : _ref$logDropError;
    if (dataTransfer.items && dataTransfer.items[0] && "webkitGetAsEntry" in dataTransfer.items[0]) {
      return webkitGetAsEntryApi(dataTransfer, logDropError);
    } else {
      return fallbackApi(dataTransfer);
    }
  };
});

// node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js
var require_getActiveOverlayEl = __commonJS(function(exports, module) {
  module.exports = function getActiveOverlayEl(dashboardEl, activeOverlayType) {
    if (activeOverlayType) {
      var overlayEl = dashboardEl.querySelector('[data-uppy-paneltype="' + activeOverlayType + '"]');
      if (overlayEl)
        return overlayEl;
    }
    return dashboardEl;
  };
});

// node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js
var require_FOCUSABLE_ELEMENTS = __commonJS(function(exports, module) {
  module.exports = ['a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', "input:not([disabled]):not([inert]):not([aria-hidden])", "select:not([disabled]):not([inert]):not([aria-hidden])", "textarea:not([disabled]):not([inert]):not([aria-hidden])", "button:not([disabled]):not([inert]):not([aria-hidden])", 'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])'];
});

// node_modules/@uppy/dashboard/lib/utils/trapFocus.js
var require_trapFocus = __commonJS(function(exports, module) {
  var toArray = require_toArray();
  var getActiveOverlayEl = require_getActiveOverlayEl();
  var FOCUSABLE_ELEMENTS = require_FOCUSABLE_ELEMENTS();
  function focusOnFirstNode(event, nodes) {
    var node = nodes[0];
    if (node) {
      node.focus();
      event.preventDefault();
    }
  }
  function focusOnLastNode(event, nodes) {
    var node = nodes[nodes.length - 1];
    if (node) {
      node.focus();
      event.preventDefault();
    }
  }
  function isFocusInOverlay(activeOverlayEl) {
    return activeOverlayEl.contains(document.activeElement);
  }
  function trapFocus(event, activeOverlayType, dashboardEl) {
    var activeOverlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
    var focusableNodes = toArray(activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS));
    var focusedItemIndex = focusableNodes.indexOf(document.activeElement);
    if (!isFocusInOverlay(activeOverlayEl)) {
      focusOnFirstNode(event, focusableNodes);
    } else if (event.shiftKey && focusedItemIndex === 0) {
      focusOnLastNode(event, focusableNodes);
    } else if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
      focusOnFirstNode(event, focusableNodes);
    }
  }
  module.exports = {
    forModal: function forModal(event, activeOverlayType, dashboardEl) {
      trapFocus(event, activeOverlayType, dashboardEl);
    },
    forInline: function forInline(event, activeOverlayType, dashboardEl) {
      if (activeOverlayType === null) {} else {
        trapFocus(event, activeOverlayType, dashboardEl);
      }
    }
  };
});

// node_modules/resize-observer-polyfill/dist/ResizeObserver.js
var require_ResizeObserver = __commonJS(function(exports, module) {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.ResizeObserver = factory();
  })(exports, function() {
    var MapShim = function() {
      if (typeof Map !== "undefined") {
        return Map;
      }
      function getIndex(arr, key) {
        var result = -1;
        arr.some(function(entry, index2) {
          if (entry[0] === key) {
            result = index2;
            return true;
          }
          return false;
        });
        return result;
      }
      return function() {
        function class_1() {
          this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
          get: function() {
            return this.__entries__.length;
          },
          enumerable: true,
          configurable: true
        });
        class_1.prototype.get = function(key) {
          var index2 = getIndex(this.__entries__, key);
          var entry = this.__entries__[index2];
          return entry && entry[1];
        };
        class_1.prototype.set = function(key, value) {
          var index2 = getIndex(this.__entries__, key);
          if (~index2) {
            this.__entries__[index2][1] = value;
          } else {
            this.__entries__.push([key, value]);
          }
        };
        class_1.prototype.delete = function(key) {
          var entries = this.__entries__;
          var index2 = getIndex(entries, key);
          if (~index2) {
            entries.splice(index2, 1);
          }
        };
        class_1.prototype.has = function(key) {
          return !!~getIndex(this.__entries__, key);
        };
        class_1.prototype.clear = function() {
          this.__entries__.splice(0);
        };
        class_1.prototype.forEach = function(callback, ctx) {
          if (ctx === undefined) {
            ctx = null;
          }
          for (var _i = 0, _a = this.__entries__;_i < _a.length; _i++) {
            var entry = _a[_i];
            callback.call(ctx, entry[1], entry[0]);
          }
        };
        return class_1;
      }();
    }();
    var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
    var global$1 = function() {
      if (typeof global !== "undefined" && global.Math === Math) {
        return global;
      }
      if (typeof self !== "undefined" && self.Math === Math) {
        return self;
      }
      if (typeof window !== "undefined" && window.Math === Math) {
        return window;
      }
      return Function("return this")();
    }();
    var requestAnimationFrame$1 = function() {
      if (typeof requestAnimationFrame === "function") {
        return requestAnimationFrame.bind(global$1);
      }
      return function(callback) {
        return setTimeout(function() {
          return callback(Date.now());
        }, 1000 / 60);
      };
    }();
    var trailingTimeout = 2;
    function throttle(callback, delay) {
      var leadingCall = false, trailingCall = false, lastCallTime = 0;
      function resolvePending() {
        if (leadingCall) {
          leadingCall = false;
          callback();
        }
        if (trailingCall) {
          proxy();
        }
      }
      function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
      }
      function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
          if (timeStamp - lastCallTime < trailingTimeout) {
            return;
          }
          trailingCall = true;
        } else {
          leadingCall = true;
          trailingCall = false;
          setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
      }
      return proxy;
    }
    var REFRESH_DELAY = 20;
    var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
    var mutationObserverSupported = typeof MutationObserver !== "undefined";
    var ResizeObserverController = function() {
      function ResizeObserverController2() {
        this.connected_ = false;
        this.mutationEventsAdded_ = false;
        this.mutationsObserver_ = null;
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
      }
      ResizeObserverController2.prototype.addObserver = function(observer) {
        if (!~this.observers_.indexOf(observer)) {
          this.observers_.push(observer);
        }
        if (!this.connected_) {
          this.connect_();
        }
      };
      ResizeObserverController2.prototype.removeObserver = function(observer) {
        var observers2 = this.observers_;
        var index2 = observers2.indexOf(observer);
        if (~index2) {
          observers2.splice(index2, 1);
        }
        if (!observers2.length && this.connected_) {
          this.disconnect_();
        }
      };
      ResizeObserverController2.prototype.refresh = function() {
        var changesDetected = this.updateObservers_();
        if (changesDetected) {
          this.refresh();
        }
      };
      ResizeObserverController2.prototype.updateObservers_ = function() {
        var activeObservers = this.observers_.filter(function(observer) {
          return observer.gatherActive(), observer.hasActive();
        });
        activeObservers.forEach(function(observer) {
          return observer.broadcastActive();
        });
        return activeObservers.length > 0;
      };
      ResizeObserverController2.prototype.connect_ = function() {
        if (!isBrowser || this.connected_) {
          return;
        }
        document.addEventListener("transitionend", this.onTransitionEnd_);
        window.addEventListener("resize", this.refresh);
        if (mutationObserverSupported) {
          this.mutationsObserver_ = new MutationObserver(this.refresh);
          this.mutationsObserver_.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        } else {
          document.addEventListener("DOMSubtreeModified", this.refresh);
          this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
      };
      ResizeObserverController2.prototype.disconnect_ = function() {
        if (!isBrowser || !this.connected_) {
          return;
        }
        document.removeEventListener("transitionend", this.onTransitionEnd_);
        window.removeEventListener("resize", this.refresh);
        if (this.mutationsObserver_) {
          this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
          document.removeEventListener("DOMSubtreeModified", this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
      };
      ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
        var _b = _a.propertyName, propertyName = _b === undefined ? "" : _b;
        var isReflowProperty = transitionKeys.some(function(key) {
          return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
          this.refresh();
        }
      };
      ResizeObserverController2.getInstance = function() {
        if (!this.instance_) {
          this.instance_ = new ResizeObserverController2;
        }
        return this.instance_;
      };
      ResizeObserverController2.instance_ = null;
      return ResizeObserverController2;
    }();
    var defineConfigurable = function(target, props) {
      for (var _i = 0, _a = Object.keys(props);_i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
          value: props[key],
          enumerable: false,
          writable: false,
          configurable: true
        });
      }
      return target;
    };
    var getWindowOf = function(target) {
      var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
      return ownerGlobal || global$1;
    };
    var emptyRect = createRectInit(0, 0, 0, 0);
    function toFloat(value) {
      return parseFloat(value) || 0;
    }
    function getBordersSize(styles) {
      var positions = [];
      for (var _i = 1;_i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
      }
      return positions.reduce(function(size, position) {
        var value = styles["border-" + position + "-width"];
        return size + toFloat(value);
      }, 0);
    }
    function getPaddings(styles) {
      var positions = ["top", "right", "bottom", "left"];
      var paddings = {};
      for (var _i = 0, positions_1 = positions;_i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles["padding-" + position];
        paddings[position] = toFloat(value);
      }
      return paddings;
    }
    function getSVGContentRect(target) {
      var bbox = target.getBBox();
      return createRectInit(0, 0, bbox.width, bbox.height);
    }
    function getHTMLElementContentRect(target) {
      var { clientWidth, clientHeight } = target;
      if (!clientWidth && !clientHeight) {
        return emptyRect;
      }
      var styles = getWindowOf(target).getComputedStyle(target);
      var paddings = getPaddings(styles);
      var horizPad = paddings.left + paddings.right;
      var vertPad = paddings.top + paddings.bottom;
      var width = toFloat(styles.width), height = toFloat(styles.height);
      if (styles.boxSizing === "border-box") {
        if (Math.round(width + horizPad) !== clientWidth) {
          width -= getBordersSize(styles, "left", "right") + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
          height -= getBordersSize(styles, "top", "bottom") + vertPad;
        }
      }
      if (!isDocumentElement(target)) {
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        if (Math.abs(vertScrollbar) !== 1) {
          width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
          height -= horizScrollbar;
        }
      }
      return createRectInit(paddings.left, paddings.top, width, height);
    }
    var isSVGGraphicsElement = function() {
      if (typeof SVGGraphicsElement !== "undefined") {
        return function(target) {
          return target instanceof getWindowOf(target).SVGGraphicsElement;
        };
      }
      return function(target) {
        return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
      };
    }();
    function isDocumentElement(target) {
      return target === getWindowOf(target).document.documentElement;
    }
    function getContentRect(target) {
      if (!isBrowser) {
        return emptyRect;
      }
      if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
      }
      return getHTMLElementContentRect(target);
    }
    function createReadOnlyRect(_a) {
      var { x, y, width, height } = _a;
      var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
      var rect = Object.create(Constr.prototype);
      defineConfigurable(rect, {
        x,
        y,
        width,
        height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
      });
      return rect;
    }
    function createRectInit(x, y, width, height) {
      return { x, y, width, height };
    }
    var ResizeObservation = function() {
      function ResizeObservation2(target) {
        this.broadcastWidth = 0;
        this.broadcastHeight = 0;
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
      }
      ResizeObservation2.prototype.isActive = function() {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
      };
      ResizeObservation2.prototype.broadcastRect = function() {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
      };
      return ResizeObservation2;
    }();
    var ResizeObserverEntry = function() {
      function ResizeObserverEntry2(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        defineConfigurable(this, { target, contentRect });
      }
      return ResizeObserverEntry2;
    }();
    var ResizeObserverSPI = function() {
      function ResizeObserverSPI2(callback, controller, callbackCtx) {
        this.activeObservations_ = [];
        this.observations_ = new MapShim;
        if (typeof callback !== "function") {
          throw new TypeError("The callback provided as parameter 1 is not a function.");
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
      }
      ResizeObserverSPI2.prototype.observe = function(target) {
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        if (typeof Element === "undefined" || !(Element instanceof Object)) {
          return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
          throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        if (observations.has(target)) {
          return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        this.controller_.refresh();
      };
      ResizeObserverSPI2.prototype.unobserve = function(target) {
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        if (typeof Element === "undefined" || !(Element instanceof Object)) {
          return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
          throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        if (!observations.has(target)) {
          return;
        }
        observations.delete(target);
        if (!observations.size) {
          this.controller_.removeObserver(this);
        }
      };
      ResizeObserverSPI2.prototype.disconnect = function() {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
      };
      ResizeObserverSPI2.prototype.gatherActive = function() {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function(observation) {
          if (observation.isActive()) {
            _this.activeObservations_.push(observation);
          }
        });
      };
      ResizeObserverSPI2.prototype.broadcastActive = function() {
        if (!this.hasActive()) {
          return;
        }
        var ctx = this.callbackCtx_;
        var entries = this.activeObservations_.map(function(observation) {
          return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
      };
      ResizeObserverSPI2.prototype.clearActive = function() {
        this.activeObservations_.splice(0);
      };
      ResizeObserverSPI2.prototype.hasActive = function() {
        return this.activeObservations_.length > 0;
      };
      return ResizeObserverSPI2;
    }();
    var observers = typeof WeakMap !== "undefined" ? new WeakMap : new MapShim;
    var ResizeObserver = function() {
      function ResizeObserver2(callback) {
        if (!(this instanceof ResizeObserver2)) {
          throw new TypeError("Cannot call a class as a function.");
        }
        if (!arguments.length) {
          throw new TypeError("1 argument required, but only 0 present.");
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
      }
      return ResizeObserver2;
    }();
    [
      "observe",
      "unobserve",
      "disconnect"
    ].forEach(function(method) {
      ResizeObserver.prototype[method] = function() {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
      };
    });
    var index = function() {
      if (typeof global$1.ResizeObserver !== "undefined") {
        return global$1.ResizeObserver;
      }
      return ResizeObserver;
    }();
    return index;
  });
});

// node_modules/lodash.debounce/index.js
var require_lodash2 = __commonJS(function(exports, module) {
  var FUNC_ERROR_TEXT = "Expected a function";
  var NAN = 0 / 0;
  var symbolTag = "[object Symbol]";
  var reTrim = /^\s+|\s+$/g;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var objectProto = Object.prototype;
  var objectToString = objectProto.toString;
  var nativeMax = Math.max;
  var nativeMin = Math.min;
  var now = function() {
    return root.Date.now();
  };
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
      return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = undefined;
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
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
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
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  module.exports = debounce;
});

// node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js
var require_createSuperFocus = __commonJS(function(exports, module) {
  var debounce = require_lodash2();
  var FOCUSABLE_ELEMENTS = require_FOCUSABLE_ELEMENTS();
  var getActiveOverlayEl = require_getActiveOverlayEl();
  module.exports = function createSuperFocus() {
    var lastFocusWasOnSuperFocusableEl = false;
    var superFocus = function superFocus2(dashboardEl, activeOverlayType) {
      var overlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
      var isFocusInOverlay = overlayEl.contains(document.activeElement);
      if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl)
        return;
      var superFocusableEl = overlayEl.querySelector("[data-uppy-super-focusable]");
      if (isFocusInOverlay && !superFocusableEl)
        return;
      if (superFocusableEl) {
        superFocusableEl.focus({
          preventScroll: true
        });
        lastFocusWasOnSuperFocusableEl = true;
      } else {
        var firstEl = overlayEl.querySelector(FOCUSABLE_ELEMENTS);
        firstEl && firstEl.focus({
          preventScroll: true
        });
        lastFocusWasOnSuperFocusableEl = false;
      }
    };
    return debounce(superFocus, 260);
  };
});

// node_modules/memoize-one/dist/memoize-one.cjs.js
var require_memoize_one_cjs = __commonJS(function(exports, module) {
  function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
      return false;
    }
    for (var i = 0;i < newInputs.length; i++) {
      if (newInputs[i] !== lastInputs[i]) {
        return false;
      }
    }
    return true;
  }
  function memoizeOne(resultFn, isEqual) {
    if (isEqual === undefined) {
      isEqual = areInputsEqual;
    }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
      var newArgs = [];
      for (var _i = 0;_i < arguments.length; _i++) {
        newArgs[_i] = arguments[_i];
      }
      if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
        return lastResult;
      }
      lastResult = resultFn.apply(this, newArgs);
      calledOnce = true;
      lastThis = this;
      lastArgs = newArgs;
      return lastResult;
    }
    return memoized;
  }
  module.exports = memoizeOne;
});

// node_modules/@uppy/dashboard/lib/index.js
var require_lib6 = __commonJS(function(exports, module) {
  var _class;
  var _temp;
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _assertThisInitialized(self2) {
    if (self2 === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var _require = require_lib2();
  var Plugin = _require.Plugin;
  var Translator = require_Translator();
  var DashboardUI = require_Dashboard();
  var StatusBar = require_lib3();
  var Informer = require_lib4();
  var ThumbnailGenerator = require_lib5();
  var findAllDOMElements = require_findAllDOMElements();
  var toArray = require_toArray();
  var getDroppedFiles = require_getDroppedFiles();
  var trapFocus = require_trapFocus();
  var cuid = require_cuid();
  var ResizeObserver = require_ResizeObserver().default || require_ResizeObserver();
  var createSuperFocus = require_createSuperFocus();
  var memoize = require_memoize_one_cjs().default || require_memoize_one_cjs();
  var TAB_KEY = 9;
  var ESC_KEY = 27;
  function createPromise() {
    var o = {};
    o.promise = new Promise(function(resolve, reject) {
      o.resolve = resolve;
      o.reject = reject;
    });
    return o;
  }
  function defaultPickerIcon() {
    return h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "30",
      height: "30",
      viewBox: "0 0 30 30"
    }, h("path", {
      d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z"
    }));
  }
  module.exports = (_temp = _class = /* @__PURE__ */ function(_Plugin) {
    _inheritsLoose(Dashboard, _Plugin);
    function Dashboard(uppy, _opts) {
      var _this;
      _this = _Plugin.call(this, uppy, _opts) || this;
      _this.setOptions = function(newOpts) {
        _Plugin.prototype.setOptions.call(_assertThisInitialized(_this), newOpts);
        _this.i18nInit();
      };
      _this.i18nInit = function() {
        _this.translator = new Translator([_this.defaultLocale, _this.uppy.locale, _this.opts.locale]);
        _this.i18n = _this.translator.translate.bind(_this.translator);
        _this.i18nArray = _this.translator.translateArray.bind(_this.translator);
        _this.setPluginState();
      };
      _this.removeTarget = function(plugin) {
        var pluginState = _this.getPluginState();
        var newTargets = pluginState.targets.filter(function(target) {
          return target.id !== plugin.id;
        });
        _this.setPluginState({
          targets: newTargets
        });
      };
      _this.addTarget = function(plugin) {
        var callerPluginId = plugin.id || plugin.constructor.name;
        var callerPluginName = plugin.title || callerPluginId;
        var callerPluginType = plugin.type;
        if (callerPluginType !== "acquirer" && callerPluginType !== "progressindicator" && callerPluginType !== "editor") {
          var msg = "Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor";
          _this.uppy.log(msg, "error");
          return;
        }
        var target = {
          id: callerPluginId,
          name: callerPluginName,
          type: callerPluginType
        };
        var state = _this.getPluginState();
        var newTargets = state.targets.slice();
        newTargets.push(target);
        _this.setPluginState({
          targets: newTargets
        });
        return _this.el;
      };
      _this.hideAllPanels = function() {
        var update = {
          activePickerPanel: false,
          showAddFilesPanel: false,
          activeOverlayType: null,
          fileCardFor: null,
          showFileEditor: false
        };
        var current = _this.getPluginState();
        if (current.activePickerPanel === update.activePickerPanel && current.showAddFilesPanel === update.showAddFilesPanel && current.showFileEditor === update.showFileEditor && current.activeOverlayType === update.activeOverlayType) {
          return;
        }
        console.log(update);
        _this.setPluginState(update);
      };
      _this.showPanel = function(id) {
        var _this$getPluginState = _this.getPluginState(), targets = _this$getPluginState.targets;
        var activePickerPanel = targets.filter(function(target) {
          return target.type === "acquirer" && target.id === id;
        })[0];
        _this.setPluginState({
          activePickerPanel,
          activeOverlayType: "PickerPanel"
        });
      };
      _this.canEditFile = function(file) {
        var _this$getPluginState2 = _this.getPluginState(), targets = _this$getPluginState2.targets;
        var editors = _this._getEditors(targets);
        return editors.some(function(target) {
          return _this.uppy.getPlugin(target.id).canEditFile(file);
        });
      };
      _this.openFileEditor = function(file) {
        var _this$getPluginState3 = _this.getPluginState(), targets = _this$getPluginState3.targets;
        var editors = _this._getEditors(targets);
        _this.setPluginState({
          showFileEditor: true,
          activeOverlayType: "FileEditor"
        });
        editors.forEach(function(editor) {
          _this.uppy.getPlugin(editor.id).selectFile(file);
        });
      };
      _this.openModal = function() {
        var _createPromise = createPromise(), promise = _createPromise.promise, resolve = _createPromise.resolve;
        _this.savedScrollPosition = window.pageYOffset;
        _this.savedActiveElement = document.activeElement;
        if (_this.opts.disablePageScrollWhenModalOpen) {
          document.body.classList.add("uppy-Dashboard-isFixed");
        }
        if (_this.opts.animateOpenClose && _this.getPluginState().isClosing) {
          var handler = function handler2() {
            _this.setPluginState({
              isHidden: false
            });
            _this.el.removeEventListener("animationend", handler2, false);
            resolve();
          };
          _this.el.addEventListener("animationend", handler, false);
        } else {
          _this.setPluginState({
            isHidden: false
          });
          resolve();
        }
        if (_this.opts.browserBackButtonClose) {
          _this.updateBrowserHistory();
        }
        document.addEventListener("keydown", _this.handleKeyDownInModal);
        _this.uppy.emit("dashboard:modal-open");
        return promise;
      };
      _this.closeModal = function(opts) {
        if (opts === undefined) {
          opts = {};
        }
        var _opts2 = opts, _opts2$manualClose = _opts2.manualClose, manualClose = _opts2$manualClose === undefined ? true : _opts2$manualClose;
        var _this$getPluginState4 = _this.getPluginState(), isHidden = _this$getPluginState4.isHidden, isClosing = _this$getPluginState4.isClosing;
        if (isHidden || isClosing) {
          return;
        }
        var _createPromise2 = createPromise(), promise = _createPromise2.promise, resolve = _createPromise2.resolve;
        if (_this.opts.disablePageScrollWhenModalOpen) {
          document.body.classList.remove("uppy-Dashboard-isFixed");
        }
        if (_this.opts.animateOpenClose) {
          _this.setPluginState({
            isClosing: true
          });
          var handler = function handler2() {
            _this.setPluginState({
              isHidden: true,
              isClosing: false
            });
            _this.superFocus.cancel();
            _this.savedActiveElement.focus();
            _this.el.removeEventListener("animationend", handler2, false);
            resolve();
          };
          _this.el.addEventListener("animationend", handler, false);
        } else {
          _this.setPluginState({
            isHidden: true
          });
          _this.superFocus.cancel();
          _this.savedActiveElement.focus();
          resolve();
        }
        document.removeEventListener("keydown", _this.handleKeyDownInModal);
        if (manualClose) {
          if (_this.opts.browserBackButtonClose) {
            if (history.state && history.state[_this.modalName]) {
              history.go(-1);
            }
          }
        }
        _this.uppy.emit("dashboard:modal-closed");
        return promise;
      };
      _this.isModalOpen = function() {
        return !_this.getPluginState().isHidden || false;
      };
      _this.requestCloseModal = function() {
        if (_this.opts.onRequestCloseModal) {
          return _this.opts.onRequestCloseModal();
        }
        return _this.closeModal();
      };
      _this.setDarkModeCapability = function(isDarkModeOn) {
        var _this$uppy$getState = _this.uppy.getState(), capabilities = _this$uppy$getState.capabilities;
        _this.uppy.setState({
          capabilities: _extends({}, capabilities, {
            darkMode: isDarkModeOn
          })
        });
      };
      _this.handleSystemDarkModeChange = function(event) {
        var isDarkModeOnNow = event.matches;
        _this.uppy.log("[Dashboard] Dark mode is " + (isDarkModeOnNow ? "on" : "off"));
        _this.setDarkModeCapability(isDarkModeOnNow);
      };
      _this.toggleFileCard = function(fileId) {
        if (fileId) {
          _this.uppy.emit("dashboard:file-edit-start");
        } else {
          _this.uppy.emit("dashboard:file-edit-complete");
        }
        _this.setPluginState({
          fileCardFor: fileId || null,
          activeOverlayType: fileId ? "FileCard" : null
        });
      };
      _this.toggleAddFilesPanel = function(show) {
        _this.setPluginState({
          showAddFilesPanel: show,
          activeOverlayType: show ? "AddFiles" : null
        });
      };
      _this.addFiles = function(files) {
        var descriptors = files.map(function(file) {
          return {
            source: _this.id,
            name: file.name,
            type: file.type,
            data: file,
            meta: {
              relativePath: file.relativePath || null
            }
          };
        });
        try {
          _this.uppy.addFiles(descriptors);
        } catch (err) {
          _this.uppy.log(err);
        }
      };
      _this.startListeningToResize = function() {
        _this.resizeObserver = new ResizeObserver(function(entries, observer) {
          var uppyDashboardInnerEl = entries[0];
          var _uppyDashboardInnerEl = uppyDashboardInnerEl.contentRect, width = _uppyDashboardInnerEl.width, height = _uppyDashboardInnerEl.height;
          _this.uppy.log("[Dashboard] resized: " + width + " / " + height, "debug");
          _this.setPluginState({
            containerWidth: width,
            containerHeight: height,
            areInsidesReadyToBeVisible: true
          });
        });
        _this.resizeObserver.observe(_this.el.querySelector(".uppy-Dashboard-inner"));
        _this.makeDashboardInsidesVisibleAnywayTimeout = setTimeout(function() {
          var pluginState = _this.getPluginState();
          var isModalAndClosed = !_this.opts.inline && pluginState.isHidden;
          if (!pluginState.areInsidesReadyToBeVisible && !isModalAndClosed) {
            _this.uppy.log("[Dashboard] resize event didn't fire on time: defaulted to mobile layout", "debug");
            _this.setPluginState({
              areInsidesReadyToBeVisible: true
            });
          }
        }, 1000);
      };
      _this.stopListeningToResize = function() {
        _this.resizeObserver.disconnect();
        clearTimeout(_this.makeDashboardInsidesVisibleAnywayTimeout);
      };
      _this.recordIfFocusedOnUppyRecently = function(event) {
        if (_this.el.contains(event.target)) {
          _this.ifFocusedOnUppyRecently = true;
        } else {
          _this.ifFocusedOnUppyRecently = false;
          _this.superFocus.cancel();
        }
      };
      _this.updateBrowserHistory = function() {
        if (!history.state || !history.state[_this.modalName]) {
          var _extends2;
          history.pushState(_extends({}, history.state, (_extends2 = {}, _extends2[_this.modalName] = true, _extends2)), "");
        }
        window.addEventListener("popstate", _this.handlePopState, false);
      };
      _this.handlePopState = function(event) {
        if (_this.isModalOpen() && (!event.state || !event.state[_this.modalName])) {
          _this.closeModal({
            manualClose: false
          });
        }
        if (!_this.isModalOpen() && event.state && event.state[_this.modalName]) {
          history.go(-1);
        }
      };
      _this.handleKeyDownInModal = function(event) {
        if (event.keyCode === ESC_KEY)
          _this.requestCloseModal(event);
        if (event.keyCode === TAB_KEY)
          trapFocus.forModal(event, _this.getPluginState().activeOverlayType, _this.el);
      };
      _this.handleClickOutside = function() {
        if (_this.opts.closeModalOnClickOutside)
          _this.requestCloseModal();
      };
      _this.handlePaste = function(event) {
        _this.uppy.iteratePlugins(function(plugin) {
          if (plugin.type === "acquirer") {
            plugin.handleRootPaste && plugin.handleRootPaste(event);
          }
        });
        var files = toArray(event.clipboardData.files);
        _this.addFiles(files);
      };
      _this.handleInputChange = function(event) {
        event.preventDefault();
        var files = toArray(event.target.files);
        _this.addFiles(files);
      };
      _this.handleDragOver = function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "copy";
        clearTimeout(_this.removeDragOverClassTimeout);
        _this.setPluginState({
          isDraggingOver: true
        });
      };
      _this.handleDragLeave = function(event) {
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(_this.removeDragOverClassTimeout);
        _this.removeDragOverClassTimeout = setTimeout(function() {
          _this.setPluginState({
            isDraggingOver: false
          });
        }, 50);
      };
      _this.handleDrop = function(event, dropCategory) {
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(_this.removeDragOverClassTimeout);
        _this.setPluginState({
          isDraggingOver: false
        });
        _this.uppy.iteratePlugins(function(plugin) {
          if (plugin.type === "acquirer") {
            plugin.handleRootDrop && plugin.handleRootDrop(event);
          }
        });
        var executedDropErrorOnce = false;
        var logDropError = function logDropError2(error) {
          _this.uppy.log(error, "error");
          if (!executedDropErrorOnce) {
            _this.uppy.info(error.message, "error");
            executedDropErrorOnce = true;
          }
        };
        getDroppedFiles(event.dataTransfer, {
          logDropError
        }).then(function(files) {
          if (files.length > 0) {
            _this.uppy.log("[Dashboard] Files were dropped");
            _this.addFiles(files);
          }
        });
      };
      _this.handleRequestThumbnail = function(file) {
        if (!_this.opts.waitForThumbnailsBeforeUpload) {
          _this.uppy.emit("thumbnail:request", file);
        }
      };
      _this.handleCancelThumbnail = function(file) {
        if (!_this.opts.waitForThumbnailsBeforeUpload) {
          _this.uppy.emit("thumbnail:cancel", file);
        }
      };
      _this.handleKeyDownInInline = function(event) {
        if (event.keyCode === TAB_KEY)
          trapFocus.forInline(event, _this.getPluginState().activeOverlayType, _this.el);
      };
      _this.handlePasteOnBody = function(event) {
        var isFocusInOverlay = _this.el.contains(document.activeElement);
        if (isFocusInOverlay) {
          _this.handlePaste(event);
        }
      };
      _this.handleComplete = function(_ref) {
        var { failed, uploadID } = _ref;
        if (_this.opts.closeAfterFinish && failed.length === 0) {
          _this.requestCloseModal();
        }
      };
      _this.initEvents = function() {
        if (_this.opts.trigger && !_this.opts.inline) {
          var showModalTrigger = findAllDOMElements(_this.opts.trigger);
          if (showModalTrigger) {
            showModalTrigger.forEach(function(trigger) {
              return trigger.addEventListener("click", _this.openModal);
            });
          } else {
            _this.uppy.log("Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself", "warning");
          }
        }
        _this.startListeningToResize();
        document.addEventListener("paste", _this.handlePasteOnBody);
        _this.uppy.on("plugin-remove", _this.removeTarget);
        _this.uppy.on("file-added", _this.hideAllPanels);
        _this.uppy.on("dashboard:modal-closed", _this.hideAllPanels);
        _this.uppy.on("file-editor:complete", _this.hideAllPanels);
        _this.uppy.on("complete", _this.handleComplete);
        document.addEventListener("focus", _this.recordIfFocusedOnUppyRecently, true);
        document.addEventListener("click", _this.recordIfFocusedOnUppyRecently, true);
        if (_this.opts.inline) {
          _this.el.addEventListener("keydown", _this.handleKeyDownInInline);
        }
      };
      _this.removeEvents = function() {
        var showModalTrigger = findAllDOMElements(_this.opts.trigger);
        if (!_this.opts.inline && showModalTrigger) {
          showModalTrigger.forEach(function(trigger) {
            return trigger.removeEventListener("click", _this.openModal);
          });
        }
        _this.stopListeningToResize();
        document.removeEventListener("paste", _this.handlePasteOnBody);
        window.removeEventListener("popstate", _this.handlePopState, false);
        _this.uppy.off("plugin-remove", _this.removeTarget);
        _this.uppy.off("file-added", _this.hideAllPanels);
        _this.uppy.off("dashboard:modal-closed", _this.hideAllPanels);
        _this.uppy.off("complete", _this.handleComplete);
        document.removeEventListener("focus", _this.recordIfFocusedOnUppyRecently);
        document.removeEventListener("click", _this.recordIfFocusedOnUppyRecently);
        if (_this.opts.inline) {
          _this.el.removeEventListener("keydown", _this.handleKeyDownInInline);
        }
      };
      _this.superFocusOnEachUpdate = function() {
        var isFocusInUppy = _this.el.contains(document.activeElement);
        var isFocusNowhere = document.activeElement === document.body || document.activeElement === null;
        var isInformerHidden = _this.uppy.getState().info.isHidden;
        var isModal = !_this.opts.inline;
        if (isInformerHidden && (isModal || isFocusInUppy || isFocusNowhere && _this.ifFocusedOnUppyRecently)) {
          _this.superFocus(_this.el, _this.getPluginState().activeOverlayType);
        } else {
          _this.superFocus.cancel();
        }
      };
      _this.afterUpdate = function() {
        _this.superFocusOnEachUpdate();
      };
      _this.cancelUpload = function(fileID) {
        _this.uppy.removeFile(fileID);
      };
      _this.saveFileCard = function(meta, fileID) {
        _this.uppy.setFileMeta(fileID, meta);
        _this.toggleFileCard();
      };
      _this._attachRenderFunctionToTarget = function(target) {
        var plugin = _this.uppy.getPlugin(target.id);
        return _extends({}, target, {
          icon: plugin.icon || _this.opts.defaultPickerIcon,
          render: plugin.render
        });
      };
      _this._isTargetSupported = function(target) {
        var plugin = _this.uppy.getPlugin(target.id);
        if (typeof plugin.isSupported !== "function") {
          return true;
        }
        return plugin.isSupported();
      };
      _this._getAcquirers = memoize(function(targets) {
        return targets.filter(function(target) {
          return target.type === "acquirer" && _this._isTargetSupported(target);
        }).map(_this._attachRenderFunctionToTarget);
      });
      _this._getProgressIndicators = memoize(function(targets) {
        return targets.filter(function(target) {
          return target.type === "progressindicator";
        }).map(_this._attachRenderFunctionToTarget);
      });
      _this._getEditors = memoize(function(targets) {
        return targets.filter(function(target) {
          return target.type === "editor";
        }).map(_this._attachRenderFunctionToTarget);
      });
      _this.render = function(state) {
        var pluginState = _this.getPluginState();
        var { files, capabilities, allowNewUpload } = state;
        var newFiles = Object.keys(files).filter(function(file) {
          return !files[file].progress.uploadStarted;
        });
        var uploadStartedFiles = Object.keys(files).filter(function(file) {
          return files[file].progress.uploadStarted;
        });
        var pausedFiles = Object.keys(files).filter(function(file) {
          return files[file].isPaused;
        });
        var completeFiles = Object.keys(files).filter(function(file) {
          return files[file].progress.uploadComplete;
        });
        var erroredFiles = Object.keys(files).filter(function(file) {
          return files[file].error;
        });
        var inProgressFiles = Object.keys(files).filter(function(file) {
          return !files[file].progress.uploadComplete && files[file].progress.uploadStarted;
        });
        var inProgressNotPausedFiles = inProgressFiles.filter(function(file) {
          return !files[file].isPaused;
        });
        var processingFiles = Object.keys(files).filter(function(file) {
          return files[file].progress.preprocess || files[file].progress.postprocess;
        });
        var isUploadStarted = uploadStartedFiles.length > 0;
        var isAllComplete = state.totalProgress === 100 && completeFiles.length === Object.keys(files).length && processingFiles.length === 0;
        var isAllErrored = isUploadStarted && erroredFiles.length === uploadStartedFiles.length;
        var isAllPaused = inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length;
        var acquirers = _this._getAcquirers(pluginState.targets);
        var progressindicators = _this._getProgressIndicators(pluginState.targets);
        var editors = _this._getEditors(pluginState.targets);
        var theme;
        if (_this.opts.theme === "auto") {
          theme = capabilities.darkMode ? "dark" : "light";
        } else {
          theme = _this.opts.theme;
        }
        if (["files", "folders", "both"].indexOf(_this.opts.fileManagerSelectionType) < 0) {
          _this.opts.fileManagerSelectionType = "files";
          console.error('Unsupported option for "fileManagerSelectionType". Using default of "' + _this.opts.fileManagerSelectionType + '".');
        }
        return DashboardUI({
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
          isAllErrored,
          isAllPaused,
          totalFileCount: Object.keys(files).length,
          totalProgress: state.totalProgress,
          allowNewUpload,
          acquirers,
          theme,
          activePickerPanel: pluginState.activePickerPanel,
          showFileEditor: pluginState.showFileEditor,
          animateOpenClose: _this.opts.animateOpenClose,
          isClosing: pluginState.isClosing,
          getPlugin: _this.uppy.getPlugin,
          progressindicators,
          editors,
          autoProceed: _this.uppy.opts.autoProceed,
          id: _this.id,
          closeModal: _this.requestCloseModal,
          handleClickOutside: _this.handleClickOutside,
          handleInputChange: _this.handleInputChange,
          handlePaste: _this.handlePaste,
          inline: _this.opts.inline,
          showPanel: _this.showPanel,
          hideAllPanels: _this.hideAllPanels,
          log: _this.uppy.log,
          i18n: _this.i18n,
          i18nArray: _this.i18nArray,
          removeFile: _this.uppy.removeFile,
          uppy: _this.uppy,
          info: _this.uppy.info,
          note: _this.opts.note,
          metaFields: pluginState.metaFields,
          resumableUploads: capabilities.resumableUploads || false,
          individualCancellation: capabilities.individualCancellation,
          isMobileDevice: capabilities.isMobileDevice,
          pauseUpload: _this.uppy.pauseResume,
          retryUpload: _this.uppy.retryUpload,
          cancelUpload: _this.cancelUpload,
          cancelAll: _this.uppy.cancelAll,
          fileCardFor: pluginState.fileCardFor,
          toggleFileCard: _this.toggleFileCard,
          toggleAddFilesPanel: _this.toggleAddFilesPanel,
          showAddFilesPanel: pluginState.showAddFilesPanel,
          saveFileCard: _this.saveFileCard,
          openFileEditor: _this.openFileEditor,
          canEditFile: _this.canEditFile,
          width: _this.opts.width,
          height: _this.opts.height,
          showLinkToFileUploadResult: _this.opts.showLinkToFileUploadResult,
          fileManagerSelectionType: _this.opts.fileManagerSelectionType,
          proudlyDisplayPoweredByUppy: _this.opts.proudlyDisplayPoweredByUppy,
          hideCancelButton: _this.opts.hideCancelButton,
          hideRetryButton: _this.opts.hideRetryButton,
          hidePauseResumeButton: _this.opts.hidePauseResumeButton,
          showRemoveButtonAfterComplete: _this.opts.showRemoveButtonAfterComplete,
          containerWidth: pluginState.containerWidth,
          containerHeight: pluginState.containerHeight,
          areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
          isTargetDOMEl: _this.isTargetDOMEl,
          parentElement: _this.el,
          allowedFileTypes: _this.uppy.opts.restrictions.allowedFileTypes,
          maxNumberOfFiles: _this.uppy.opts.restrictions.maxNumberOfFiles,
          showSelectedFiles: _this.opts.showSelectedFiles,
          handleRequestThumbnail: _this.handleRequestThumbnail,
          handleCancelThumbnail: _this.handleCancelThumbnail,
          isDraggingOver: pluginState.isDraggingOver,
          handleDragOver: _this.handleDragOver,
          handleDragLeave: _this.handleDragLeave,
          handleDrop: _this.handleDrop
        });
      };
      _this.discoverProviderPlugins = function() {
        _this.uppy.iteratePlugins(function(plugin) {
          if (plugin && !plugin.target && plugin.opts && plugin.opts.target === _this.constructor) {
            _this.addTarget(plugin);
          }
        });
      };
      _this.install = function() {
        _this.setPluginState({
          isHidden: true,
          fileCardFor: null,
          activeOverlayType: null,
          showAddFilesPanel: false,
          activePickerPanel: false,
          showFileEditor: false,
          metaFields: _this.opts.metaFields,
          targets: [],
          areInsidesReadyToBeVisible: false,
          isDraggingOver: false
        });
        var _this$opts = _this.opts, inline = _this$opts.inline, closeAfterFinish = _this$opts.closeAfterFinish;
        if (inline && closeAfterFinish) {
          throw new Error("[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.");
        }
        var allowMultipleUploads = _this.uppy.opts.allowMultipleUploads;
        if (allowMultipleUploads && closeAfterFinish) {
          _this.uppy.log("[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploads` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true", "warning");
        }
        var target = _this.opts.target;
        if (target) {
          _this.mount(target, _assertThisInitialized(_this));
        }
        var plugins = _this.opts.plugins || [];
        plugins.forEach(function(pluginID) {
          var plugin = _this.uppy.getPlugin(pluginID);
          if (plugin) {
            plugin.mount(_assertThisInitialized(_this), plugin);
          }
        });
        if (!_this.opts.disableStatusBar) {
          _this.uppy.use(StatusBar, {
            id: _this.id + ":StatusBar",
            target: _assertThisInitialized(_this),
            hideUploadButton: _this.opts.hideUploadButton,
            hideRetryButton: _this.opts.hideRetryButton,
            hidePauseResumeButton: _this.opts.hidePauseResumeButton,
            hideCancelButton: _this.opts.hideCancelButton,
            showProgressDetails: _this.opts.showProgressDetails,
            hideAfterFinish: _this.opts.hideProgressAfterFinish,
            locale: _this.opts.locale
          });
        }
        if (!_this.opts.disableInformer) {
          _this.uppy.use(Informer, {
            id: _this.id + ":Informer",
            target: _assertThisInitialized(_this)
          });
        }
        if (!_this.opts.disableThumbnailGenerator) {
          _this.uppy.use(ThumbnailGenerator, {
            id: _this.id + ":ThumbnailGenerator",
            thumbnailWidth: _this.opts.thumbnailWidth,
            waitForThumbnailsBeforeUpload: _this.opts.waitForThumbnailsBeforeUpload,
            lazy: !_this.opts.waitForThumbnailsBeforeUpload
          });
        }
        _this.darkModeMediaQuery = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
        var isDarkModeOnFromTheStart = _this.darkModeMediaQuery ? _this.darkModeMediaQuery.matches : false;
        _this.uppy.log("[Dashboard] Dark mode is " + (isDarkModeOnFromTheStart ? "on" : "off"));
        _this.setDarkModeCapability(isDarkModeOnFromTheStart);
        if (_this.opts.theme === "auto") {
          _this.darkModeMediaQuery.addListener(_this.handleSystemDarkModeChange);
        }
        _this.discoverProviderPlugins();
        _this.initEvents();
      };
      _this.uninstall = function() {
        if (!_this.opts.disableInformer) {
          var informer = _this.uppy.getPlugin(_this.id + ":Informer");
          if (informer)
            _this.uppy.removePlugin(informer);
        }
        if (!_this.opts.disableStatusBar) {
          var statusBar = _this.uppy.getPlugin(_this.id + ":StatusBar");
          if (statusBar)
            _this.uppy.removePlugin(statusBar);
        }
        if (!_this.opts.disableThumbnailGenerator) {
          var thumbnail = _this.uppy.getPlugin(_this.id + ":ThumbnailGenerator");
          if (thumbnail)
            _this.uppy.removePlugin(thumbnail);
        }
        var plugins = _this.opts.plugins || [];
        plugins.forEach(function(pluginID) {
          var plugin = _this.uppy.getPlugin(pluginID);
          if (plugin)
            plugin.unmount();
        });
        if (_this.opts.theme === "auto") {
          _this.darkModeMediaQuery.removeListener(_this.handleSystemDarkModeChange);
        }
        _this.unmount();
        _this.removeEvents();
      };
      _this.id = _this.opts.id || "Dashboard";
      _this.title = "Dashboard";
      _this.type = "orchestrator";
      _this.modalName = "uppy-Dashboard-" + cuid();
      _this.defaultLocale = {
        strings: {
          closeModal: "Close Modal",
          importFrom: "Import from %{name}",
          addingMoreFiles: "Adding more files",
          addMoreFiles: "Add more files",
          dashboardWindowTitle: "File Uploader Window (Press escape to close)",
          dashboardTitle: "File Uploader",
          copyLinkToClipboardSuccess: "Link copied to clipboard",
          copyLinkToClipboardFallback: "Copy the URL below",
          copyLink: "Copy link",
          fileSource: "File source: %{name}",
          done: "Done",
          back: "Back",
          addMore: "Add more",
          removeFile: "Remove file",
          editFile: "Edit file",
          editing: "Editing %{file}",
          finishEditingFile: "Finish editing file",
          saveChanges: "Save changes",
          cancel: "Cancel",
          myDevice: "My Device",
          dropPasteFiles: "Drop files here, paste or %{browseFiles}",
          dropPasteFolders: "Drop files here, paste or %{browseFolders}",
          dropPasteBoth: "Drop files here, paste, %{browseFiles} or %{browseFolders}",
          dropPasteImportFiles: "Drop files here, paste, %{browseFiles} or import from:",
          dropPasteImportFolders: "Drop files here, paste, %{browseFolders} or import from:",
          dropPasteImportBoth: "Drop files here, paste, %{browseFiles}, %{browseFolders} or import from:",
          dropHint: "Drop your files here",
          browseFiles: "browse files",
          browseFolders: "browse folders",
          uploadComplete: "Upload complete",
          uploadPaused: "Upload paused",
          resumeUpload: "Resume upload",
          pauseUpload: "Pause upload",
          retryUpload: "Retry upload",
          cancelUpload: "Cancel upload",
          xFilesSelected: {
            0: "%{smart_count} file selected",
            1: "%{smart_count} files selected"
          },
          uploadingXFiles: {
            0: "Uploading %{smart_count} file",
            1: "Uploading %{smart_count} files"
          },
          processingXFiles: {
            0: "Processing %{smart_count} file",
            1: "Processing %{smart_count} files"
          },
          poweredBy2: "%{backwardsCompat} %{uppy}",
          poweredBy: "Powered by"
        }
      };
      var defaultOptions = {
        target: "body",
        metaFields: [],
        trigger: "#uppy-select-files",
        inline: false,
        width: 750,
        height: 550,
        thumbnailWidth: 280,
        waitForThumbnailsBeforeUpload: false,
        defaultPickerIcon,
        showLinkToFileUploadResult: true,
        showProgressDetails: false,
        hideUploadButton: false,
        hideCancelButton: false,
        hideRetryButton: false,
        hidePauseResumeButton: false,
        hideProgressAfterFinish: false,
        note: null,
        closeModalOnClickOutside: false,
        closeAfterFinish: false,
        disableStatusBar: false,
        disableInformer: false,
        disableThumbnailGenerator: false,
        disablePageScrollWhenModalOpen: true,
        animateOpenClose: true,
        fileManagerSelectionType: "files",
        proudlyDisplayPoweredByUppy: true,
        onRequestCloseModal: function onRequestCloseModal() {
          return _this.closeModal();
        },
        showSelectedFiles: true,
        showRemoveButtonAfterComplete: false,
        browserBackButtonClose: false,
        theme: "light"
      };
      _this.opts = _extends({}, defaultOptions, _opts);
      _this.i18nInit();
      _this.superFocus = createSuperFocus();
      _this.ifFocusedOnUppyRecently = false;
      _this.makeDashboardInsidesVisibleAnywayTimeout = null;
      _this.removeDragOverClassTimeout = null;
      return _this;
    }
    return Dashboard;
  }(Plugin), _class.VERSION = "1.12.5", _temp);
});

// node_modules/@uppy/companion-client/lib/AuthError.js
var require_AuthError = __commonJS(function(exports, module) {
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map : undefined;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor;
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  var AuthError = /* @__PURE__ */ function(_Error) {
    _inheritsLoose(AuthError2, _Error);
    function AuthError2() {
      var _this;
      _this = _Error.call(this, "Authorization required") || this;
      _this.name = "AuthError";
      _this.isAuthError = true;
      return _this;
    }
    return AuthError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));
  module.exports = AuthError;
});

// node_modules/@uppy/utils/lib/NetworkError.js
var require_NetworkError = __commonJS(function(exports, module) {
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map : undefined;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor;
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function() {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  var NetworkError = /* @__PURE__ */ function(_Error) {
    _inheritsLoose(NetworkError2, _Error);
    function NetworkError2(error, xhr) {
      var _this;
      if (xhr === undefined) {
        xhr = null;
      }
      _this = _Error.call(this, `This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.

Source error: [` + error + "]") || this;
      _this.isNetworkError = true;
      _this.request = xhr;
      return _this;
    }
    return NetworkError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));
  module.exports = NetworkError;
});

// node_modules/@uppy/utils/lib/fetchWithNetworkError.js
var require_fetchWithNetworkError = __commonJS(function(exports, module) {
  var NetworkError = require_NetworkError();
  module.exports = function fetchWithNetworkError() {
    return fetch.apply(undefined, arguments).catch(function(err) {
      if (err.name === "AbortError") {
        throw err;
      } else {
        throw new NetworkError(err);
      }
    });
  };
});

// node_modules/@uppy/companion-client/lib/RequestClient.js
var require_RequestClient = __commonJS(function(exports, module) {
  var _class;
  var _temp;
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _defineProperties(target, props) {
    for (var i = 0;i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var AuthError = require_AuthError();
  var fetchWithNetworkError = require_fetchWithNetworkError();
  function stripSlash(url) {
    return url.replace(/\/$/, "");
  }
  module.exports = (_temp = _class = /* @__PURE__ */ function() {
    function RequestClient(uppy, opts) {
      this.uppy = uppy;
      this.opts = opts;
      this.onReceiveResponse = this.onReceiveResponse.bind(this);
      this.allowedHeaders = ["accept", "content-type", "uppy-auth-token"];
      this.preflightDone = false;
    }
    var _proto = RequestClient.prototype;
    _proto.headers = function headers() {
      var userHeaders = this.opts.companionHeaders || this.opts.serverHeaders || {};
      return Promise.resolve(_extends({}, this.defaultHeaders, userHeaders));
    };
    _proto._getPostResponseFunc = function _getPostResponseFunc(skip) {
      var _this = this;
      return function(response) {
        if (!skip) {
          return _this.onReceiveResponse(response);
        }
        return response;
      };
    };
    _proto.onReceiveResponse = function onReceiveResponse(response) {
      var state = this.uppy.getState();
      var companion = state.companion || {};
      var host = this.opts.companionUrl;
      var headers = response.headers;
      if (headers.has("i-am") && headers.get("i-am") !== companion[host]) {
        var _extends2;
        this.uppy.setState({
          companion: _extends({}, companion, (_extends2 = {}, _extends2[host] = headers.get("i-am"), _extends2))
        });
      }
      return response;
    };
    _proto._getUrl = function _getUrl(url) {
      if (/^(https?:|)\/\//.test(url)) {
        return url;
      }
      return this.hostname + "/" + url;
    };
    _proto._json = function _json(res) {
      if (res.status === 401) {
        throw new AuthError;
      }
      if (res.status < 200 || res.status > 300) {
        var errMsg = "Failed request with status: " + res.status + ". " + res.statusText;
        return res.json().then(function(errData) {
          errMsg = errData.message ? errMsg + " message: " + errData.message : errMsg;
          errMsg = errData.requestId ? errMsg + " request-Id: " + errData.requestId : errMsg;
          throw new Error(errMsg);
        }).catch(function() {
          throw new Error(errMsg);
        });
      }
      return res.json();
    };
    _proto.preflight = function preflight(path) {
      var _this2 = this;
      if (this.preflightDone) {
        return Promise.resolve(this.allowedHeaders.slice());
      }
      return fetch(this._getUrl(path), {
        method: "OPTIONS"
      }).then(function(response) {
        if (response.headers.has("access-control-allow-headers")) {
          _this2.allowedHeaders = response.headers.get("access-control-allow-headers").split(",").map(function(headerName) {
            return headerName.trim().toLowerCase();
          });
        }
        _this2.preflightDone = true;
        return _this2.allowedHeaders.slice();
      }).catch(function(err) {
        _this2.uppy.log("[CompanionClient] unable to make preflight request " + err, "warning");
        _this2.preflightDone = true;
        return _this2.allowedHeaders.slice();
      });
    };
    _proto.preflightAndHeaders = function preflightAndHeaders(path) {
      var _this3 = this;
      return Promise.all([this.preflight(path), this.headers()]).then(function(_ref) {
        var allowedHeaders = _ref[0], headers = _ref[1];
        Object.keys(headers).forEach(function(header) {
          if (allowedHeaders.indexOf(header.toLowerCase()) === -1) {
            _this3.uppy.log("[CompanionClient] excluding unallowed header " + header);
            delete headers[header];
          }
        });
        return headers;
      });
    };
    _proto.get = function get(path, skipPostResponse) {
      var _this4 = this;
      return this.preflightAndHeaders(path).then(function(headers) {
        return fetchWithNetworkError(_this4._getUrl(path), {
          method: "get",
          headers,
          credentials: "same-origin"
        });
      }).then(this._getPostResponseFunc(skipPostResponse)).then(function(res) {
        return _this4._json(res);
      }).catch(function(err) {
        err = err.isAuthError ? err : new Error("Could not get " + _this4._getUrl(path) + ". " + err);
        return Promise.reject(err);
      });
    };
    _proto.post = function post(path, data, skipPostResponse) {
      var _this5 = this;
      return this.preflightAndHeaders(path).then(function(headers) {
        return fetchWithNetworkError(_this5._getUrl(path), {
          method: "post",
          headers,
          credentials: "same-origin",
          body: JSON.stringify(data)
        });
      }).then(this._getPostResponseFunc(skipPostResponse)).then(function(res) {
        return _this5._json(res);
      }).catch(function(err) {
        err = err.isAuthError ? err : new Error("Could not post " + _this5._getUrl(path) + ". " + err);
        return Promise.reject(err);
      });
    };
    _proto.delete = function _delete(path, data, skipPostResponse) {
      var _this6 = this;
      return this.preflightAndHeaders(path).then(function(headers) {
        return fetchWithNetworkError(_this6.hostname + "/" + path, {
          method: "delete",
          headers,
          credentials: "same-origin",
          body: data ? JSON.stringify(data) : null
        });
      }).then(this._getPostResponseFunc(skipPostResponse)).then(function(res) {
        return _this6._json(res);
      }).catch(function(err) {
        err = err.isAuthError ? err : new Error("Could not delete " + _this6._getUrl(path) + ". " + err);
        return Promise.reject(err);
      });
    };
    _createClass(RequestClient, [{
      key: "hostname",
      get: function get() {
        var _this$uppy$getState = this.uppy.getState(), companion = _this$uppy$getState.companion;
        var host = this.opts.companionUrl;
        return stripSlash(companion && companion[host] ? companion[host] : host);
      }
    }, {
      key: "defaultHeaders",
      get: function get() {
        return {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Uppy-Versions": "@uppy/companion-client=" + RequestClient.VERSION
        };
      }
    }]);
    return RequestClient;
  }(), _class.VERSION = "1.5.3", _temp);
});

// node_modules/@uppy/companion-client/lib/tokenStorage.js
var require_tokenStorage = __commonJS(function(exports, module) {
  exports.setItem = function(key, value) {
    return new Promise(function(resolve) {
      localStorage.setItem(key, value);
      resolve();
    });
  };
  exports.getItem = function(key) {
    return Promise.resolve(localStorage.getItem(key));
  };
  exports.removeItem = function(key) {
    return new Promise(function(resolve) {
      localStorage.removeItem(key);
      resolve();
    });
  };
});

// node_modules/@uppy/companion-client/lib/Provider.js
var require_Provider = __commonJS(function(exports, module) {
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  var RequestClient = require_RequestClient();
  var tokenStorage = require_tokenStorage();
  var _getName = function _getName2(id) {
    return id.split("-").map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }).join(" ");
  };
  module.exports = /* @__PURE__ */ function(_RequestClient) {
    _inheritsLoose(Provider, _RequestClient);
    function Provider(uppy, opts) {
      var _this;
      _this = _RequestClient.call(this, uppy, opts) || this;
      _this.provider = opts.provider;
      _this.id = _this.provider;
      _this.name = _this.opts.name || _getName(_this.id);
      _this.pluginId = _this.opts.pluginId;
      _this.tokenKey = "companion-" + _this.pluginId + "-auth-token";
      return _this;
    }
    var _proto = Provider.prototype;
    _proto.headers = function headers() {
      return Promise.all([_RequestClient.prototype.headers.call(this), this.getAuthToken()]).then(function(_ref) {
        var headers2 = _ref[0], token = _ref[1];
        return _extends({}, headers2, {
          "uppy-auth-token": token
        });
      });
    };
    _proto.onReceiveResponse = function onReceiveResponse(response) {
      response = _RequestClient.prototype.onReceiveResponse.call(this, response);
      var plugin = this.uppy.getPlugin(this.pluginId);
      var oldAuthenticated = plugin.getPluginState().authenticated;
      var authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
      plugin.setPluginState({
        authenticated
      });
      return response;
    };
    _proto.setAuthToken = function setAuthToken(token) {
      return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
    };
    _proto.getAuthToken = function getAuthToken() {
      return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
    };
    _proto.authUrl = function authUrl() {
      return this.hostname + "/" + this.id + "/connect";
    };
    _proto.fileUrl = function fileUrl(id) {
      return this.hostname + "/" + this.id + "/get/" + id;
    };
    _proto.list = function list(directory) {
      return this.get(this.id + "/list/" + (directory || ""));
    };
    _proto.logout = function logout() {
      var _this2 = this;
      return this.get(this.id + "/logout").then(function(response) {
        return Promise.all([response, _this2.uppy.getPlugin(_this2.pluginId).storage.removeItem(_this2.tokenKey)]);
      }).then(function(_ref2) {
        var response = _ref2[0];
        return response;
      });
    };
    Provider.initPlugin = function initPlugin(plugin, opts, defaultOpts) {
      plugin.type = "acquirer";
      plugin.files = [];
      if (defaultOpts) {
        plugin.opts = _extends({}, defaultOpts, opts);
      }
      if (opts.serverUrl || opts.serverPattern) {
        throw new Error("`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`");
      }
      if (opts.companionAllowedHosts) {
        var pattern = opts.companionAllowedHosts;
        if (typeof pattern !== "string" && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
          throw new TypeError(plugin.id + ': the option "companionAllowedHosts" must be one of string, Array, RegExp');
        }
        plugin.opts.companionAllowedHosts = pattern;
      } else {
        if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
          plugin.opts.companionAllowedHosts = "https://" + opts.companionUrl.replace(/^\/\//, "");
        } else {
          plugin.opts.companionAllowedHosts = opts.companionUrl;
        }
      }
      plugin.storage = plugin.opts.storage || tokenStorage;
    };
    return Provider;
  }(RequestClient);
});

// node_modules/@uppy/companion-client/lib/Socket.js
var require_Socket = __commonJS(function(exports, module) {
  var ee = require_namespace_emitter();
  module.exports = /* @__PURE__ */ function() {
    function UppySocket(opts) {
      this.opts = opts;
      this._queued = [];
      this.isOpen = false;
      this.emitter = ee();
      this._handleMessage = this._handleMessage.bind(this);
      this.close = this.close.bind(this);
      this.emit = this.emit.bind(this);
      this.on = this.on.bind(this);
      this.once = this.once.bind(this);
      this.send = this.send.bind(this);
      if (!opts || opts.autoOpen !== false) {
        this.open();
      }
    }
    var _proto = UppySocket.prototype;
    _proto.open = function open() {
      var _this = this;
      this.socket = new WebSocket(this.opts.target);
      this.socket.onopen = function(e) {
        _this.isOpen = true;
        while (_this._queued.length > 0 && _this.isOpen) {
          var first = _this._queued[0];
          _this.send(first.action, first.payload);
          _this._queued = _this._queued.slice(1);
        }
      };
      this.socket.onclose = function(e) {
        _this.isOpen = false;
      };
      this.socket.onmessage = this._handleMessage;
    };
    _proto.close = function close() {
      if (this.socket) {
        this.socket.close();
      }
    };
    _proto.send = function send(action, payload) {
      if (!this.isOpen) {
        this._queued.push({
          action,
          payload
        });
        return;
      }
      this.socket.send(JSON.stringify({
        action,
        payload
      }));
    };
    _proto.on = function on(action, handler) {
      this.emitter.on(action, handler);
    };
    _proto.emit = function emit(action, payload) {
      this.emitter.emit(action, payload);
    };
    _proto.once = function once(action, handler) {
      this.emitter.once(action, handler);
    };
    _proto._handleMessage = function _handleMessage(e) {
      try {
        var message = JSON.parse(e.data);
        this.emit(message.action, message.payload);
      } catch (err) {
        console.log(err);
      }
    };
    return UppySocket;
  }();
});

// node_modules/@uppy/companion-client/lib/index.js
var require_lib7 = __commonJS(function(exports, module) {
  var RequestClient = require_RequestClient();
  var Provider = require_Provider();
  var Socket = require_Socket();
  module.exports = {
    RequestClient,
    Provider,
    Socket
  };
});

// node_modules/@uppy/utils/lib/emitSocketProgress.js
var require_emitSocketProgress = __commonJS(function(exports, module) {
  var throttle = require_lodash();
  function _emitSocketProgress(uploader, progressData, file) {
    var { progress, bytesUploaded, bytesTotal } = progressData;
    if (progress) {
      uploader.uppy.log("Upload progress: " + progress);
      uploader.uppy.emit("upload-progress", file, {
        uploader,
        bytesUploaded,
        bytesTotal
      });
    }
  }
  module.exports = throttle(_emitSocketProgress, 300, {
    leading: true,
    trailing: true
  });
});

// node_modules/@uppy/utils/lib/getSocketHost.js
var require_getSocketHost = __commonJS(function(exports, module) {
  module.exports = function getSocketHost(url) {
    var regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
    var host = regex.exec(url)[1];
    var socketProtocol = /^http:\/\//i.test(url) ? "ws" : "wss";
    return socketProtocol + "://" + host;
  };
});

// node_modules/@uppy/utils/lib/settle.js
var require_settle = __commonJS(function(exports, module) {
  module.exports = function settle(promises) {
    var resolutions = [];
    var rejections = [];
    function resolved(value) {
      resolutions.push(value);
    }
    function rejected(error) {
      rejections.push(error);
    }
    var wait = Promise.all(promises.map(function(promise) {
      return promise.then(resolved, rejected);
    }));
    return wait.then(function() {
      return {
        successful: resolutions,
        failed: rejections
      };
    });
  };
});

// node_modules/@uppy/utils/lib/EventTracker.js
var require_EventTracker = __commonJS(function(exports, module) {
  module.exports = /* @__PURE__ */ function() {
    function EventTracker(emitter) {
      this._events = [];
      this._emitter = emitter;
    }
    var _proto = EventTracker.prototype;
    _proto.on = function on(event, fn) {
      this._events.push([event, fn]);
      return this._emitter.on(event, fn);
    };
    _proto.remove = function remove() {
      var _this = this;
      this._events.forEach(function(_ref) {
        var event = _ref[0], fn = _ref[1];
        _this._emitter.off(event, fn);
      });
    };
    return EventTracker;
  }();
});

// node_modules/@uppy/utils/lib/ProgressTimeout.js
var require_ProgressTimeout = __commonJS(function(exports, module) {
  var ProgressTimeout = /* @__PURE__ */ function() {
    function ProgressTimeout2(timeout, timeoutHandler) {
      this._timeout = timeout;
      this._onTimedOut = timeoutHandler;
      this._isDone = false;
      this._aliveTimer = null;
      this._onTimedOut = this._onTimedOut.bind(this);
    }
    var _proto = ProgressTimeout2.prototype;
    _proto.progress = function progress() {
      if (this._isDone)
        return;
      if (this._timeout > 0) {
        if (this._aliveTimer)
          clearTimeout(this._aliveTimer);
        this._aliveTimer = setTimeout(this._onTimedOut, this._timeout);
      }
    };
    _proto.done = function done() {
      if (this._aliveTimer) {
        clearTimeout(this._aliveTimer);
        this._aliveTimer = null;
      }
      this._isDone = true;
    };
    return ProgressTimeout2;
  }();
  module.exports = ProgressTimeout;
});

// node_modules/@uppy/utils/lib/RateLimitedQueue.js
var require_RateLimitedQueue = __commonJS(function(exports, module) {
  function findIndex(array, predicate) {
    for (var i = 0;i < array.length; i++) {
      if (predicate(array[i]))
        return i;
    }
    return -1;
  }
  function createCancelError() {
    return new Error("Cancelled");
  }
  module.exports = /* @__PURE__ */ function() {
    function RateLimitedQueue(limit) {
      if (typeof limit !== "number" || limit === 0) {
        this.limit = Infinity;
      } else {
        this.limit = limit;
      }
      this.activeRequests = 0;
      this.queuedHandlers = [];
    }
    var _proto = RateLimitedQueue.prototype;
    _proto._call = function _call(fn) {
      var _this = this;
      this.activeRequests += 1;
      var _done = false;
      var cancelActive;
      try {
        cancelActive = fn();
      } catch (err) {
        this.activeRequests -= 1;
        throw err;
      }
      return {
        abort: function abort() {
          if (_done)
            return;
          _done = true;
          _this.activeRequests -= 1;
          cancelActive();
          _this._queueNext();
        },
        done: function done() {
          if (_done)
            return;
          _done = true;
          _this.activeRequests -= 1;
          _this._queueNext();
        }
      };
    };
    _proto._queueNext = function _queueNext() {
      var _this2 = this;
      Promise.resolve().then(function() {
        _this2._next();
      });
    };
    _proto._next = function _next() {
      if (this.activeRequests >= this.limit) {
        return;
      }
      if (this.queuedHandlers.length === 0) {
        return;
      }
      var next = this.queuedHandlers.shift();
      var handler = this._call(next.fn);
      next.abort = handler.abort;
      next.done = handler.done;
    };
    _proto._queue = function _queue(fn, options) {
      var _this3 = this;
      if (options === undefined) {
        options = {};
      }
      var handler = {
        fn,
        priority: options.priority || 0,
        abort: function abort() {
          _this3._dequeue(handler);
        },
        done: function done() {
          throw new Error("Cannot mark a queued request as done: this indicates a bug");
        }
      };
      var index = findIndex(this.queuedHandlers, function(other) {
        return handler.priority > other.priority;
      });
      if (index === -1) {
        this.queuedHandlers.push(handler);
      } else {
        this.queuedHandlers.splice(index, 0, handler);
      }
      return handler;
    };
    _proto._dequeue = function _dequeue(handler) {
      var index = this.queuedHandlers.indexOf(handler);
      if (index !== -1) {
        this.queuedHandlers.splice(index, 1);
      }
    };
    _proto.run = function run(fn, queueOptions) {
      if (this.activeRequests < this.limit) {
        return this._call(fn);
      }
      return this._queue(fn, queueOptions);
    };
    _proto.wrapPromiseFunction = function wrapPromiseFunction(fn, queueOptions) {
      var _this4 = this;
      return function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0;_key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var queuedRequest;
        var outerPromise = new Promise(function(resolve, reject) {
          queuedRequest = _this4.run(function() {
            var cancelError;
            var innerPromise;
            try {
              innerPromise = Promise.resolve(fn.apply(undefined, args));
            } catch (err) {
              innerPromise = Promise.reject(err);
            }
            innerPromise.then(function(result) {
              if (cancelError) {
                reject(cancelError);
              } else {
                queuedRequest.done();
                resolve(result);
              }
            }, function(err) {
              if (cancelError) {
                reject(cancelError);
              } else {
                queuedRequest.done();
                reject(err);
              }
            });
            return function() {
              cancelError = createCancelError();
            };
          }, queueOptions);
        });
        outerPromise.abort = function() {
          queuedRequest.abort();
        };
        return outerPromise;
      };
    };
    return RateLimitedQueue;
  }();
});

// node_modules/@uppy/utils/lib/isNetworkError.js
var require_isNetworkError = __commonJS(function(exports, module) {
  function isNetworkError(xhr) {
    if (!xhr) {
      return false;
    }
    return xhr.readyState !== 0 && xhr.readyState !== 4 || xhr.status === 0;
  }
  module.exports = isNetworkError;
});

// node_modules/@uppy/xhr-upload/lib/index.js
var require_lib8 = __commonJS(function(exports, module) {
  var _class;
  var _temp;
  function _assertThisInitialized(self2) {
    if (self2 === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1;i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var _require = require_lib2();
  var Plugin = _require.Plugin;
  var cuid = require_cuid();
  var Translator = require_Translator();
  var _require2 = require_lib7();
  var Provider = _require2.Provider;
  var RequestClient = _require2.RequestClient;
  var Socket = _require2.Socket;
  var emitSocketProgress = require_emitSocketProgress();
  var getSocketHost = require_getSocketHost();
  var settle = require_settle();
  var EventTracker = require_EventTracker();
  var ProgressTimeout = require_ProgressTimeout();
  var RateLimitedQueue = require_RateLimitedQueue();
  var NetworkError = require_NetworkError();
  var isNetworkError = require_isNetworkError();
  function buildResponseError(xhr, error) {
    if (!error)
      error = new Error("Upload error");
    if (typeof error === "string")
      error = new Error(error);
    if (!(error instanceof Error)) {
      error = _extends(new Error("Upload error"), {
        data: error
      });
    }
    if (isNetworkError(xhr)) {
      error = new NetworkError(error, xhr);
      return error;
    }
    error.request = xhr;
    return error;
  }
  function setTypeInBlob(file) {
    var dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
    return dataWithUpdatedType;
  }
  module.exports = (_temp = _class = /* @__PURE__ */ function(_Plugin) {
    _inheritsLoose(XHRUpload, _Plugin);
    function XHRUpload(uppy, opts) {
      var _this;
      _this = _Plugin.call(this, uppy, opts) || this;
      _this.type = "uploader";
      _this.id = _this.opts.id || "XHRUpload";
      _this.title = "XHRUpload";
      _this.defaultLocale = {
        strings: {
          timedOut: "Upload stalled for %{seconds} seconds, aborting."
        }
      };
      var defaultOptions = {
        formData: true,
        fieldName: "files[]",
        method: "post",
        metaFields: null,
        responseUrlFieldName: "url",
        bundle: false,
        headers: {},
        timeout: 30 * 1000,
        limit: 0,
        withCredentials: false,
        responseType: "",
        getResponseData: function getResponseData(responseText, response) {
          var parsedResponse = {};
          try {
            parsedResponse = JSON.parse(responseText);
          } catch (err) {
            console.log(err);
          }
          return parsedResponse;
        },
        getResponseError: function getResponseError(responseText, response) {
          var error = new Error("Upload error");
          if (isNetworkError(response)) {
            error = new NetworkError(error, response);
          }
          return error;
        },
        validateStatus: function validateStatus(status, responseText, response) {
          return status >= 200 && status < 300;
        }
      };
      _this.opts = _extends({}, defaultOptions, opts);
      _this.i18nInit();
      _this.handleUpload = _this.handleUpload.bind(_assertThisInitialized(_this));
      if (_this.opts.__queue instanceof RateLimitedQueue) {
        _this.requests = _this.opts.__queue;
      } else {
        _this.requests = new RateLimitedQueue(_this.opts.limit);
      }
      if (_this.opts.bundle && !_this.opts.formData) {
        throw new Error("`opts.formData` must be true when `opts.bundle` is enabled.");
      }
      _this.uploaderEvents = Object.create(null);
      return _this;
    }
    var _proto = XHRUpload.prototype;
    _proto.setOptions = function setOptions(newOpts) {
      _Plugin.prototype.setOptions.call(this, newOpts);
      this.i18nInit();
    };
    _proto.i18nInit = function i18nInit() {
      this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
      this.i18n = this.translator.translate.bind(this.translator);
      this.setPluginState();
    };
    _proto.getOptions = function getOptions(file) {
      var overrides = this.uppy.getState().xhrUpload;
      var opts = _extends({}, this.opts, overrides || {}, file.xhrUpload || {}, {
        headers: {}
      });
      _extends(opts.headers, this.opts.headers);
      if (overrides) {
        _extends(opts.headers, overrides.headers);
      }
      if (file.xhrUpload) {
        _extends(opts.headers, file.xhrUpload.headers);
      }
      return opts;
    };
    _proto.addMetadata = function addMetadata(formData, meta, opts) {
      var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields : Object.keys(meta);
      metaFields.forEach(function(item) {
        formData.append(item, meta[item]);
      });
    };
    _proto.createFormDataUpload = function createFormDataUpload(file, opts) {
      var formPost = new FormData;
      this.addMetadata(formPost, file.meta, opts);
      var dataWithUpdatedType = setTypeInBlob(file);
      if (file.name) {
        formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
      } else {
        formPost.append(opts.fieldName, dataWithUpdatedType);
      }
      return formPost;
    };
    _proto.createBundledUpload = function createBundledUpload(files, opts) {
      var _this2 = this;
      var formPost = new FormData;
      var _this$uppy$getState = this.uppy.getState(), meta = _this$uppy$getState.meta;
      this.addMetadata(formPost, meta, opts);
      files.forEach(function(file) {
        var opts2 = _this2.getOptions(file);
        var dataWithUpdatedType = setTypeInBlob(file);
        if (file.name) {
          formPost.append(opts2.fieldName, dataWithUpdatedType, file.name);
        } else {
          formPost.append(opts2.fieldName, dataWithUpdatedType);
        }
      });
      return formPost;
    };
    _proto.createBareUpload = function createBareUpload(file, opts) {
      return file.data;
    };
    _proto.upload = function upload(file, current, total) {
      var _this3 = this;
      var opts = this.getOptions(file);
      this.uppy.log("uploading " + current + " of " + total);
      return new Promise(function(resolve, reject) {
        _this3.uppy.emit("upload-started", file);
        var data = opts.formData ? _this3.createFormDataUpload(file, opts) : _this3.createBareUpload(file, opts);
        var xhr = new XMLHttpRequest;
        _this3.uploaderEvents[file.id] = new EventTracker(_this3.uppy);
        var timer = new ProgressTimeout(opts.timeout, function() {
          xhr.abort();
          queuedRequest.done();
          var error = new Error(_this3.i18n("timedOut", {
            seconds: Math.ceil(opts.timeout / 1000)
          }));
          _this3.uppy.emit("upload-error", file, error);
          reject(error);
        });
        var id = cuid();
        xhr.upload.addEventListener("loadstart", function(ev) {
          _this3.uppy.log("[XHRUpload] " + id + " started");
        });
        xhr.upload.addEventListener("progress", function(ev) {
          _this3.uppy.log("[XHRUpload] " + id + " progress: " + ev.loaded + " / " + ev.total);
          timer.progress();
          if (ev.lengthComputable) {
            _this3.uppy.emit("upload-progress", file, {
              uploader: _this3,
              bytesUploaded: ev.loaded,
              bytesTotal: ev.total
            });
          }
        });
        xhr.addEventListener("load", function(ev) {
          _this3.uppy.log("[XHRUpload] " + id + " finished");
          timer.done();
          queuedRequest.done();
          if (_this3.uploaderEvents[file.id]) {
            _this3.uploaderEvents[file.id].remove();
            _this3.uploaderEvents[file.id] = null;
          }
          if (opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
            var body = opts.getResponseData(xhr.responseText, xhr);
            var uploadURL = body[opts.responseUrlFieldName];
            var uploadResp = {
              status: ev.target.status,
              body,
              uploadURL
            };
            _this3.uppy.emit("upload-success", file, uploadResp);
            if (uploadURL) {
              _this3.uppy.log("Download " + file.name + " from " + uploadURL);
            }
            return resolve(file);
          } else {
            var _body = opts.getResponseData(xhr.responseText, xhr);
            var error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
            var response = {
              status: ev.target.status,
              body: _body
            };
            _this3.uppy.emit("upload-error", file, error, response);
            return reject(error);
          }
        });
        xhr.addEventListener("error", function(ev) {
          _this3.uppy.log("[XHRUpload] " + id + " errored");
          timer.done();
          queuedRequest.done();
          if (_this3.uploaderEvents[file.id]) {
            _this3.uploaderEvents[file.id].remove();
            _this3.uploaderEvents[file.id] = null;
          }
          var error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
          _this3.uppy.emit("upload-error", file, error);
          return reject(error);
        });
        xhr.open(opts.method.toUpperCase(), opts.endpoint, true);
        xhr.withCredentials = opts.withCredentials;
        if (opts.responseType !== "") {
          xhr.responseType = opts.responseType;
        }
        Object.keys(opts.headers).forEach(function(header) {
          xhr.setRequestHeader(header, opts.headers[header]);
        });
        var queuedRequest = _this3.requests.run(function() {
          xhr.send(data);
          return function() {
            timer.done();
            xhr.abort();
          };
        });
        _this3.onFileRemove(file.id, function() {
          queuedRequest.abort();
          reject(new Error("File removed"));
        });
        _this3.onCancelAll(file.id, function() {
          queuedRequest.abort();
          reject(new Error("Upload cancelled"));
        });
      });
    };
    _proto.uploadRemote = function uploadRemote(file, current, total) {
      var _this4 = this;
      var opts = this.getOptions(file);
      return new Promise(function(resolve, reject) {
        _this4.uppy.emit("upload-started", file);
        var fields = {};
        var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields : Object.keys(file.meta);
        metaFields.forEach(function(name) {
          fields[name] = file.meta[name];
        });
        var Client = file.remote.providerOptions.provider ? Provider : RequestClient;
        var client = new Client(_this4.uppy, file.remote.providerOptions);
        client.post(file.remote.url, _extends({}, file.remote.body, {
          endpoint: opts.endpoint,
          size: file.data.size,
          fieldname: opts.fieldName,
          metadata: fields,
          httpMethod: opts.method,
          useFormData: opts.formData,
          headers: opts.headers
        })).then(function(res) {
          var token = res.token;
          var host = getSocketHost(file.remote.companionUrl);
          var socket = new Socket({
            target: host + "/api/" + token,
            autoOpen: false
          });
          _this4.uploaderEvents[file.id] = new EventTracker(_this4.uppy);
          _this4.onFileRemove(file.id, function() {
            socket.send("pause", {});
            queuedRequest.abort();
            resolve("upload " + file.id + " was removed");
          });
          _this4.onCancelAll(file.id, function() {
            socket.send("pause", {});
            queuedRequest.abort();
            resolve("upload " + file.id + " was canceled");
          });
          _this4.onRetry(file.id, function() {
            socket.send("pause", {});
            socket.send("resume", {});
          });
          _this4.onRetryAll(file.id, function() {
            socket.send("pause", {});
            socket.send("resume", {});
          });
          socket.on("progress", function(progressData) {
            return emitSocketProgress(_this4, progressData, file);
          });
          socket.on("success", function(data) {
            var body = opts.getResponseData(data.response.responseText, data.response);
            var uploadURL = body[opts.responseUrlFieldName];
            var uploadResp = {
              status: data.response.status,
              body,
              uploadURL
            };
            _this4.uppy.emit("upload-success", file, uploadResp);
            queuedRequest.done();
            if (_this4.uploaderEvents[file.id]) {
              _this4.uploaderEvents[file.id].remove();
              _this4.uploaderEvents[file.id] = null;
            }
            return resolve();
          });
          socket.on("error", function(errData) {
            var resp = errData.response;
            var error = resp ? opts.getResponseError(resp.responseText, resp) : _extends(new Error(errData.error.message), {
              cause: errData.error
            });
            _this4.uppy.emit("upload-error", file, error);
            queuedRequest.done();
            if (_this4.uploaderEvents[file.id]) {
              _this4.uploaderEvents[file.id].remove();
              _this4.uploaderEvents[file.id] = null;
            }
            reject(error);
          });
          var queuedRequest = _this4.requests.run(function() {
            socket.open();
            if (file.isPaused) {
              socket.send("pause", {});
            }
            return function() {
              return socket.close();
            };
          });
        }).catch(function(err) {
          _this4.uppy.emit("upload-error", file, err);
          reject(err);
        });
      });
    };
    _proto.uploadBundle = function uploadBundle(files) {
      var _this5 = this;
      return new Promise(function(resolve, reject) {
        var endpoint = _this5.opts.endpoint;
        var method = _this5.opts.method;
        var optsFromState = _this5.uppy.getState().xhrUpload;
        var formData = _this5.createBundledUpload(files, _extends({}, _this5.opts, optsFromState || {}));
        var xhr = new XMLHttpRequest;
        var timer = new ProgressTimeout(_this5.opts.timeout, function() {
          xhr.abort();
          var error = new Error(_this5.i18n("timedOut", {
            seconds: Math.ceil(_this5.opts.timeout / 1000)
          }));
          emitError(error);
          reject(error);
        });
        var emitError = function emitError2(error) {
          files.forEach(function(file) {
            _this5.uppy.emit("upload-error", file, error);
          });
        };
        xhr.upload.addEventListener("loadstart", function(ev) {
          _this5.uppy.log("[XHRUpload] started uploading bundle");
          timer.progress();
        });
        xhr.upload.addEventListener("progress", function(ev) {
          timer.progress();
          if (!ev.lengthComputable)
            return;
          files.forEach(function(file) {
            _this5.uppy.emit("upload-progress", file, {
              uploader: _this5,
              bytesUploaded: ev.loaded / ev.total * file.size,
              bytesTotal: file.size
            });
          });
        });
        xhr.addEventListener("load", function(ev) {
          timer.done();
          if (_this5.opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
            var body = _this5.opts.getResponseData(xhr.responseText, xhr);
            var uploadResp = {
              status: ev.target.status,
              body
            };
            files.forEach(function(file) {
              _this5.uppy.emit("upload-success", file, uploadResp);
            });
            return resolve();
          }
          var error = _this5.opts.getResponseError(xhr.responseText, xhr) || new Error("Upload error");
          error.request = xhr;
          emitError(error);
          return reject(error);
        });
        xhr.addEventListener("error", function(ev) {
          timer.done();
          var error = _this5.opts.getResponseError(xhr.responseText, xhr) || new Error("Upload error");
          emitError(error);
          return reject(error);
        });
        _this5.uppy.on("cancel-all", function() {
          timer.done();
          xhr.abort();
        });
        xhr.open(method.toUpperCase(), endpoint, true);
        xhr.withCredentials = _this5.opts.withCredentials;
        if (_this5.opts.responseType !== "") {
          xhr.responseType = _this5.opts.responseType;
        }
        Object.keys(_this5.opts.headers).forEach(function(header) {
          xhr.setRequestHeader(header, _this5.opts.headers[header]);
        });
        xhr.send(formData);
        files.forEach(function(file) {
          _this5.uppy.emit("upload-started", file);
        });
      });
    };
    _proto.uploadFiles = function uploadFiles(files) {
      var _this6 = this;
      var promises = files.map(function(file, i) {
        var current = parseInt(i, 10) + 1;
        var total = files.length;
        if (file.error) {
          return Promise.reject(new Error(file.error));
        } else if (file.isRemote) {
          return _this6.uploadRemote(file, current, total);
        } else {
          return _this6.upload(file, current, total);
        }
      });
      return settle(promises);
    };
    _proto.onFileRemove = function onFileRemove(fileID, cb) {
      this.uploaderEvents[fileID].on("file-removed", function(file) {
        if (fileID === file.id)
          cb(file.id);
      });
    };
    _proto.onRetry = function onRetry(fileID, cb) {
      this.uploaderEvents[fileID].on("upload-retry", function(targetFileID) {
        if (fileID === targetFileID) {
          cb();
        }
      });
    };
    _proto.onRetryAll = function onRetryAll(fileID, cb) {
      var _this7 = this;
      this.uploaderEvents[fileID].on("retry-all", function(filesToRetry) {
        if (!_this7.uppy.getFile(fileID))
          return;
        cb();
      });
    };
    _proto.onCancelAll = function onCancelAll(fileID, cb) {
      var _this8 = this;
      this.uploaderEvents[fileID].on("cancel-all", function() {
        if (!_this8.uppy.getFile(fileID))
          return;
        cb();
      });
    };
    _proto.handleUpload = function handleUpload(fileIDs) {
      var _this9 = this;
      if (fileIDs.length === 0) {
        this.uppy.log("[XHRUpload] No files to upload!");
        return Promise.resolve();
      }
      if (this.opts.limit === 0 && !this.opts.__queue) {
        this.uppy.log("[XHRUpload] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/xhr-upload/#limit-0", "warning");
      }
      this.uppy.log("[XHRUpload] Uploading...");
      var files = fileIDs.map(function(fileID) {
        return _this9.uppy.getFile(fileID);
      });
      if (this.opts.bundle) {
        var isSomeFileRemote = files.some(function(file) {
          return file.isRemote;
        });
        if (isSomeFileRemote) {
          throw new Error("Can’t upload remote files when bundle: true option is set");
        }
        return this.uploadBundle(files);
      }
      return this.uploadFiles(files).then(function() {
        return null;
      });
    };
    _proto.install = function install() {
      if (this.opts.bundle) {
        var _this$uppy$getState2 = this.uppy.getState(), capabilities = _this$uppy$getState2.capabilities;
        this.uppy.setState({
          capabilities: _extends({}, capabilities, {
            individualCancellation: false
          })
        });
      }
      this.uppy.addUploader(this.handleUpload);
    };
    _proto.uninstall = function uninstall() {
      if (this.opts.bundle) {
        var _this$uppy$getState3 = this.uppy.getState(), capabilities = _this$uppy$getState3.capabilities;
        this.uppy.setState({
          capabilities: _extends({}, capabilities, {
            individualCancellation: true
          })
        });
      }
      this.uppy.removeUploader(this.handleUpload);
    };
    return XHRUpload;
  }(Plugin), _class.VERSION = "1.6.3", _temp);
});

// client/src/js/loader.js
var import_core = __toESM(require_lib2(), 1);
var import_dashboard = __toESM(require_lib6(), 1);
var import_xhr_upload = __toESM(require_lib8(), 1);

// client/src/js/common.js
function DFU() {
  this.init = function() {};
  this.files = {};
  this.prefix = "dfufile";
  this.getFieldName = function(upload_element, id) {
    return upload_element.getAttribute("data-name") + "[" + id + "]";
  };
  this.getClosest = function(elem, s) {
    try {
      return elem.closest(s);
    } catch (e) {
      if (!document.documentElement.contains(elem))
        return null;
      do {
        if (elem.matches(s))
          return elem;
        elem = elem.parentElement || elem.parentNode;
      } while (elem !== null && elem.nodeType === 1);
      return null;
    }
  };
  this.getForm = function(elem) {
    return this.getClosest(elem, "form");
  };
  this.removeField = function(upload_element, id) {
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
  this.appendField = function(upload_element, id, uuid) {
    try {
      var f = this.getForm(upload_element);
      if (!f) {
        throw "cannot find form for element";
      }
      var name = this.getFieldName(upload_element, id);
      var field = f.elements[name];
      if (field) {
        field.value = uuid;
      } else {
        var field = document.createElement("input");
        field.type = "hidden";
        field.value = uuid;
        field.name = name;
        field.classList.add("dfu_uploaded_file");
        upload_element.appendChild(field);
      }
      return field;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  this.getFile = function(upload_element, id) {
    if (typeof this.files[upload_element.id] == "undefined") {
      this.files[upload_element.id] = [];
      this.files[upload_element.id][id] = {};
    } else if (typeof this.files[upload_element.id][id] == "undefined") {
      this.files[upload_element.id][id] = {};
    }
    return this.files[upload_element.id][id];
  };
  this.handleUnblock = function(upload_element) {
    var f = this.getForm(upload_element);
    if (f) {
      this.toggleSubmitButtons(f, false);
      f.onsubmit = function() {
        return true;
      };
    }
  };
  this.handleSubmit = function(upload_element) {
    var f = this.getForm(upload_element);
    if (f) {
      this.toggleSubmitButtons(f, true);
      f.onsubmit = function() {
        return false;
      };
    }
  };
  this.toggleSubmitButtons = function(frm, disable) {
    var submit_elements = frm.querySelectorAll('[type="submit"]');
    if (submit_elements) {
      var submits = Array.from(submit_elements);
      for (var d of submits) {
        if (disable && !d.disabled) {
          d.setAttribute("disabled", "disabled");
          if (d.dataset.uploadsPending) {
            if (d.nodeName == "BUTTON") {
              d.dataset.uploadsNotPending = d.textContent;
              d.textContent = d.dataset.uploadsPending;
            } else {
              d.dataset.uploadsNotPending = d.value;
              d.value = d.dataset.uploadsPending;
            }
          }
        } else if (!disable && d.disabled) {
          d.removeAttribute("disabled");
          if (d.dataset.uploadsNotPending) {
            if (d.nodeName == "BUTTON") {
              d.textContent = d.dataset.uploadsNotPending;
            } else {
              d.value = d.dataset.uploadsNotPending;
            }
          }
        }
      }
    }
  };
  this.getFileElement = function(upload_element, id) {
    var file = document.getElementById(upload_element.id + "-upload-" + id);
    return file;
  };
  this.isImage = function(mimetype) {
    var pattern = /^image\//;
    var result = mimetype.match(pattern);
    return result != null;
  };
  this.notify = function(result, uppyFile, uppyResponse, uri, notificationUrl) {
    try {
      let formData = {
        uploaded: 1,
        result: result ? 1 : 0,
        id: uppyFile.id,
        name: uppyFile.name ? uppyFile.name : "",
        size: uppyFile.size ? uppyFile.size : "",
        type: uppyFile.type ? uppyFile.type : "",
        uri,
        src: window.location.href,
        meta: JSON.stringify(uppyFile.meta)
      };
      let xhr = new XMLHttpRequest;
      xhr.open("POST", notificationUrl);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(new URLSearchParams(formData).toString());
    } catch (e) {
      console.error("Could not notify (" + (result ? 1 : 0) + ") - " + e);
    }
  };
  this.notifyComplete = function(result, notificationUrl) {
    try {
      let formData = {
        uploaded: 1,
        completed: 1,
        successful: result.successful.length,
        failed: result.failed.length,
        uploadId: result.uploadID,
        src: window.location.href
      };
      let xhr = new XMLHttpRequest;
      xhr.open("POST", notificationUrl);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(new URLSearchParams(formData).toString());
    } catch (e) {
      console.error("Could not notify completion: " + e);
    }
  };
  this.setPresignedUrl = function(file, presignUrl, callback) {
    try {
      let formData = {
        id: file.id,
        name: file.name
      };
      let xhrSuccess = function() {
        if (xhr.status != 200) {
          callback(file, false);
        } else if (xhr.readyState == 4) {
          let response = JSON.parse(xhr.responseText);
          let preSignedUrl = response.presignedurl ? response.presignedurl : false;
          callback(file, preSignedUrl);
        }
      };
      let xhrError = function() {
        callback(file, false);
      };
      let xhr = new XMLHttpRequest;
      xhr.open("POST", presignUrl);
      xhr.addEventListener("load", xhrSuccess);
      xhr.addEventListener("error", xhrError);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(new URLSearchParams(formData).toString());
    } catch (e) {
      console.error("Could not get presigned url: " + e);
    }
  };
}

// client/src/js/loader.js
function DFULoader(opts) {
  this.uploadElement = opts.uploadElement;
  this.init = function() {};
  this.handle = function() {
    this.uploadElement.dfu = new DFU;
    this.uploadElement.dfu.init();
    const config = JSON.parse(this.uploadElement.dataset.config);
    const id = this.uploadElement.id;
    const uploadType = this.uploadElement.dataset.uploadType;
    let httpMethod = config.request.method ? config.request.method : "POST";
    let formData = true;
    let bundle = false;
    switch (httpMethod) {
      case "PUT":
        formData = false;
        break;
    }
    let meta = {};
    if (typeof config.request.params == "object") {
      meta = config.request.params;
    }
    const maxFileSize = config.validation.sizeLimit ? config.validation.sizeLimit : null;
    const maxNumFiles = config.validation.itemLimit ? config.validation.itemLimit : null;
    const minNumFiles = null;
    const allowedFileTypes = config.validation.acceptFiles ? config.validation.acceptFiles.split(",") : ["image/*"];
    const maxImageWidth = config.validation.image.maxWidth ? config.validation.image.maxWidth : 0;
    const maxImageHeight = config.validation.image.maxHeight ? config.validation.image.maxHeight : 0;
    const minImageWidth = config.validation.image.minWidth ? config.validation.image.minWidth : 0;
    const minImageHeight = config.validation.image.minHeight ? config.validation.image.minHeight : 0;
    const restrictions = {
      maxFileSize,
      maxNumberOfFiles: maxNumFiles,
      minNumberOfFiles: minNumFiles,
      allowedFileTypes
    };
    const notificationUrl = config.urls.notificationUrl ? config.urls.notificationUrl : null;
    const preSignUrlForFile = config.urls.presignUrl ? config.urls.presignUrl : null;
    const uppy = new import_core.default({
      id: "uppy-" + id,
      autoProceed: false,
      allowMultipleUploadBatches: true,
      debug: false,
      meta,
      restrictions
    }).use(import_dashboard.default, {
      id: "dashboard-" + id,
      target: this.uploadElement.querySelector(".dashboard"),
      inline: true,
      width: "100%",
      height: "370px",
      waitForThumbnailsBeforeUpload: true,
      showLinkToFileUploadResult: false,
      proudlyDisplayPoweredByUppy: false,
      showProgressDetails: true,
      replaceTargetContent: true,
      hideProgressAfterFinish: true,
      note: "",
      doneButtonHandler: null
    }).use(import_xhr_upload.default, {
      method: httpMethod,
      formData,
      bundle,
      fieldName: this.uploadElement.dataset.name,
      endpoint: config.request.endpoint,
      responseType: "json",
      shouldRetry: function(xhr) {
        return false;
      },
      getResponseData: function getResponseData(xhr) {
        if (typeof xhr.response == "object") {
          return xhr.response;
        } else if (xhr.responseURL != "") {
          return {
            url: xhr.responseURL
          };
        } else {
          return {};
        }
      }
    });
    uppy.on("upload-success", (file, response) => {
      let uri = "";
      let endpoint = "";
      try {
        endpoint = file.xhrUpload.endpoint ? file.xhrUpload.endpoint : "";
      } catch (e) {}
      if (endpoint) {
        uri = endpoint;
      } else if (response.body.uuid) {
        uri = response.body.uuid;
      }
      if (notificationUrl) {
        this.uploadElement.dfu.notify(true, file, response, uri, notificationUrl);
      }
      if (uri) {
        this.uploadElement.dfu.appendField(this.uploadElement, file.id, uri);
      }
    });
    uppy.on("upload-error", (file, response) => {
      let uri = "";
      let endpoint = "";
      try {
        file.xhrUpload.endpoint && file.xhrUpload.endpoint;
      } catch (e) {}
      if (endpoint) {
        uri = endpoint;
      } else if (response.body.uuid) {
        uri = response.body.uuid;
      }
      if (notificationUrl) {
        this.uploadElement.dfu.notify(false, file, response, uri, notificationUrl);
      }
      this.uploadElement.dfu.removeField(this.uploadElement, file.id);
    });
    uppy.on("error", (result) => {
      this.uploadElement.dfu.handleUnblock(this.uploadElement);
    });
    uppy.on("complete", (result) => {
      if (notificationUrl) {
        this.uploadElement.dfu.notifyComplete(result, notificationUrl);
      }
      this.uploadElement.dfu.handleUnblock(this.uploadElement);
    });
    uppy.on("cancel-all", (result) => {
      this.uploadElement.dfu.handleUnblock(this.uploadElement);
    });
    uppy.on("file-removed", (file, reason) => {
      const items = uppy.getFiles();
      if (items.length == 0) {
        this.uploadElement.dfu.handleUnblock(this.uploadElement);
      }
    });
    uppy.on("file-added", (file) => {
      this.uploadElement.dfu.handleSubmit(this.uploadElement);
      if (preSignUrlForFile) {
        uppy.setFileState(file.id, {
          xhrUpload: {
            ...file.xhrUpload,
            endpoint: ""
          }
        });
        this.uploadElement.dfu.setPresignedUrl(file, preSignUrlForFile, function(file2, preSignedUrl) {
          if (preSignedUrl) {
            uppy.setFileState(file2.id, {
              xhrUpload: {
                ...file2.xhrUpload,
                endpoint: preSignedUrl
              }
            });
          } else {
            uppy.removeFile(file2.id);
            uppy.info({
              message: config.messages.fileCannotBeUploadedError,
              type: "warning",
              duration: 7500
            });
          }
        });
      }
      var meta2 = {};
      meta2[config.request.uuidName] = file.id;
      uppy.setFileMeta(file.id, meta2);
      if (this.uploadElement.dfu.isImage(file.data.type)) {
        let data = file.data;
        let url = URL.createObjectURL(data);
        let image = new Image;
        image.src = url;
        image.onload = () => {
          let remove = false;
          let message = config.messages.dimensionsMismatchError;
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
              message,
              type: "error",
              duration: 7500
            });
            URL.revokeObjectURL(url);
          }
        };
      }
    });
    let ev = new Event("uploaderReady");
    this.uploadElement.dispatchEvent(ev);
  };
}

// client/src/js/uppy.js
var dfuXHRUploaders = document.querySelectorAll(".dfu-uploader-uppy");
dfuXHRUploaders.forEach((dfuXHRUploaderElement) => {
  try {
    var dfuLoader = new DFULoader({
      uploadElement: dfuXHRUploaderElement
    });
    dfuLoader.init();
    dfuLoader.handle();
  } catch (e) {
    console.error("Caught uploader error:" + e);
  }
});

//# debugId=F14F54B31AD5AFD664756E2164756E21
//# sourceMappingURL=uppy.js.map
