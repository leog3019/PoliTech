import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  AuthInstances,
  require_events,
  require_safe_buffer
} from "./chunk-GRLTNXQ7.js";
import {
  Component,
  ComponentContainer,
  Deferred,
  FirebaseApp,
  FirebaseApps,
  LogLevel,
  Logger,
  Provider,
  SDK_VERSION,
  Sha1,
  VERSION,
  _getProvider,
  _registerComponent,
  assert,
  assertionError,
  base64,
  base64Encode,
  contains,
  createMockUserToken,
  deepCopy,
  errorPrefix,
  getApp,
  getDefaultEmulatorHostnameAndPort,
  getModularInstance,
  isAdmin,
  isEmpty,
  isMobileCordova,
  isNodeSdk,
  isReactNative,
  isValidFormat,
  jsonEval,
  map,
  querystring,
  registerVersion,
  safeGet,
  stringLength,
  stringToByteArray,
  stringify,
  ɵAngularFireSchedulers,
  ɵAppCheckInstances,
  ɵgetAllInstancesOf,
  ɵgetDefaultInstanceOf,
  ɵzoneWrap
} from "./chunk-GYM6T3DH.js";
import {
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  makeEnvironmentProviders,
  require_cjs,
  require_operators,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-NASD4L7L.js";
import {
  __async,
  __commonJS,
  __require,
  __toESM
} from "./chunk-INDP74QC.js";

// node_modules/websocket-driver/lib/websocket/streams.js
var require_streams = __commonJS({
  "node_modules/websocket-driver/lib/websocket/streams.js"(exports) {
    "use strict";
    var Stream = __require("stream").Stream;
    var util = __require("util");
    var IO = function(driver) {
      this.readable = this.writable = true;
      this._paused = false;
      this._driver = driver;
    };
    util.inherits(IO, Stream);
    IO.prototype.pause = function() {
      this._paused = true;
      this._driver.messages._paused = true;
    };
    IO.prototype.resume = function() {
      this._paused = false;
      this.emit("drain");
      var messages = this._driver.messages;
      messages._paused = false;
      messages.emit("drain");
    };
    IO.prototype.write = function(chunk) {
      if (!this.writable) return false;
      this._driver.parse(chunk);
      return !this._paused;
    };
    IO.prototype.end = function(chunk) {
      if (!this.writable) return;
      if (chunk !== void 0) this.write(chunk);
      this.writable = false;
      var messages = this._driver.messages;
      if (messages.readable) {
        messages.readable = messages.writable = false;
        messages.emit("end");
      }
    };
    IO.prototype.destroy = function() {
      this.end();
    };
    var Messages = function(driver) {
      this.readable = this.writable = true;
      this._paused = false;
      this._driver = driver;
    };
    util.inherits(Messages, Stream);
    Messages.prototype.pause = function() {
      this._driver.io._paused = true;
    };
    Messages.prototype.resume = function() {
      this._driver.io._paused = false;
      this._driver.io.emit("drain");
    };
    Messages.prototype.write = function(message) {
      if (!this.writable) return false;
      if (typeof message === "string") this._driver.text(message);
      else this._driver.binary(message);
      return !this._paused;
    };
    Messages.prototype.end = function(message) {
      if (message !== void 0) this.write(message);
    };
    Messages.prototype.destroy = function() {
    };
    exports.IO = IO;
    exports.Messages = Messages;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/headers.js
var require_headers = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/headers.js"(exports, module) {
    "use strict";
    var Headers = function() {
      this.clear();
    };
    Headers.prototype.ALLOWED_DUPLICATES = ["set-cookie", "set-cookie2", "warning", "www-authenticate"];
    Headers.prototype.clear = function() {
      this._sent = {};
      this._lines = [];
    };
    Headers.prototype.set = function(name2, value) {
      if (value === void 0) return;
      name2 = this._strip(name2);
      value = this._strip(value);
      var key = name2.toLowerCase();
      if (!this._sent.hasOwnProperty(key) || this.ALLOWED_DUPLICATES.indexOf(key) >= 0) {
        this._sent[key] = true;
        this._lines.push(name2 + ": " + value + "\r\n");
      }
    };
    Headers.prototype.toString = function() {
      return this._lines.join("");
    };
    Headers.prototype._strip = function(string) {
      return string.toString().replace(/^ */, "").replace(/ *$/, "");
    };
    module.exports = Headers;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/stream_reader.js
var require_stream_reader = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/stream_reader.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var StreamReader = function() {
      this._queue = [];
      this._queueSize = 0;
      this._offset = 0;
    };
    StreamReader.prototype.put = function(buffer) {
      if (!buffer || buffer.length === 0) return;
      if (!Buffer2.isBuffer(buffer)) buffer = Buffer2.from(buffer);
      this._queue.push(buffer);
      this._queueSize += buffer.length;
    };
    StreamReader.prototype.read = function(length) {
      if (length > this._queueSize) return null;
      if (length === 0) return Buffer2.alloc(0);
      this._queueSize -= length;
      var queue = this._queue, remain = length, first = queue[0], buffers, buffer;
      if (first.length >= length) {
        if (first.length === length) {
          return queue.shift();
        } else {
          buffer = first.slice(0, length);
          queue[0] = first.slice(length);
          return buffer;
        }
      }
      for (var i = 0, n = queue.length; i < n; i++) {
        if (remain < queue[i].length) break;
        remain -= queue[i].length;
      }
      buffers = queue.splice(0, i);
      if (remain > 0 && queue.length > 0) {
        buffers.push(queue[0].slice(0, remain));
        queue[0] = queue[0].slice(remain);
      }
      return Buffer2.concat(buffers, length);
    };
    StreamReader.prototype.eachByte = function(callback, context) {
      var buffer, n, index;
      while (this._queue.length > 0) {
        buffer = this._queue[0];
        n = buffer.length;
        while (this._offset < n) {
          index = this._offset;
          this._offset += 1;
          callback.call(context, buffer[index]);
        }
        this._offset = 0;
        this._queue.shift();
      }
    };
    module.exports = StreamReader;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/base.js
var require_base = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/base.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Emitter = require_events().EventEmitter;
    var util = __require("util");
    var streams = require_streams();
    var Headers = require_headers();
    var Reader = require_stream_reader();
    var Base = function(request, url, options) {
      Emitter.call(this);
      Base.validateOptions(options || {}, ["maxLength", "masking", "requireMasking", "protocols"]);
      this._request = request;
      this._reader = new Reader();
      this._options = options || {};
      this._maxLength = this._options.maxLength || this.MAX_LENGTH;
      this._headers = new Headers();
      this.__queue = [];
      this.readyState = 0;
      this.url = url;
      this.io = new streams.IO(this);
      this.messages = new streams.Messages(this);
      this._bindEventListeners();
    };
    util.inherits(Base, Emitter);
    Base.isWebSocket = function(request) {
      var connection = request.headers.connection || "", upgrade = request.headers.upgrade || "";
      return request.method === "GET" && connection.toLowerCase().split(/ *, */).indexOf("upgrade") >= 0 && upgrade.toLowerCase() === "websocket";
    };
    Base.validateOptions = function(options, validKeys) {
      for (var key2 in options) {
        if (validKeys.indexOf(key2) < 0) throw new Error("Unrecognized option: " + key2);
      }
    };
    var instance = {
      // This is 64MB, small enough for an average VPS to handle without
      // crashing from process out of memory
      MAX_LENGTH: 67108863,
      STATES: ["connecting", "open", "closing", "closed"],
      _bindEventListeners: function() {
        var self = this;
        this.messages.on("error", function() {
        });
        this.on("message", function(event) {
          var messages = self.messages;
          if (messages.readable) messages.emit("data", event.data);
        });
        this.on("error", function(error2) {
          var messages = self.messages;
          if (messages.readable) messages.emit("error", error2);
        });
        this.on("close", function() {
          var messages = self.messages;
          if (!messages.readable) return;
          messages.readable = messages.writable = false;
          messages.emit("end");
        });
      },
      getState: function() {
        return this.STATES[this.readyState] || null;
      },
      addExtension: function(extension) {
        return false;
      },
      setHeader: function(name2, value) {
        if (this.readyState > 0) return false;
        this._headers.set(name2, value);
        return true;
      },
      start: function() {
        if (this.readyState !== 0) return false;
        if (!Base.isWebSocket(this._request)) return this._failHandshake(new Error("Not a WebSocket request"));
        var response;
        try {
          response = this._handshakeResponse();
        } catch (error2) {
          return this._failHandshake(error2);
        }
        this._write(response);
        if (this._stage !== -1) this._open();
        return true;
      },
      _failHandshake: function(error2) {
        var headers = new Headers();
        headers.set("Content-Type", "text/plain");
        headers.set("Content-Length", Buffer2.byteLength(error2.message, "utf8"));
        headers = ["HTTP/1.1 400 Bad Request", headers.toString(), error2.message];
        this._write(Buffer2.from(headers.join("\r\n"), "utf8"));
        this._fail("protocol_error", error2.message);
        return false;
      },
      text: function(message) {
        return this.frame(message);
      },
      binary: function(message) {
        return false;
      },
      ping: function() {
        return false;
      },
      pong: function() {
        return false;
      },
      close: function(reason, code) {
        if (this.readyState !== 1) return false;
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(null, null));
        return true;
      },
      _open: function() {
        this.readyState = 1;
        this.__queue.forEach(function(args) {
          this.frame.apply(this, args);
        }, this);
        this.__queue = [];
        this.emit("open", new Base.OpenEvent());
      },
      _queue: function(message) {
        this.__queue.push(message);
        return true;
      },
      _write: function(chunk) {
        var io = this.io;
        if (io.readable) io.emit("data", chunk);
      },
      _fail: function(type, message) {
        this.readyState = 2;
        this.emit("error", new Error(message));
        this.close();
      }
    };
    for (key in instance) Base.prototype[key] = instance[key];
    var key;
    Base.ConnectEvent = function() {
    };
    Base.OpenEvent = function() {
    };
    Base.CloseEvent = function(code, reason) {
      this.code = code;
      this.reason = reason;
    };
    Base.MessageEvent = function(data) {
      this.data = data;
    };
    Base.PingEvent = function(data) {
      this.data = data;
    };
    Base.PongEvent = function(data) {
      this.data = data;
    };
    module.exports = Base;
  }
});

// node_modules/http-parser-js/http-parser.js
var require_http_parser = __commonJS({
  "node_modules/http-parser-js/http-parser.js"(exports) {
    var assert2 = __require("assert");
    exports.HTTPParser = HTTPParser;
    function HTTPParser(type) {
      assert2.ok(type === HTTPParser.REQUEST || type === HTTPParser.RESPONSE || type === void 0);
      if (type === void 0) {
      } else {
        this.initialize(type);
      }
      this.maxHeaderSize = HTTPParser.maxHeaderSize;
    }
    HTTPParser.prototype.initialize = function(type, async_resource) {
      assert2.ok(type === HTTPParser.REQUEST || type === HTTPParser.RESPONSE);
      this.type = type;
      this.state = type + "_LINE";
      this.info = {
        headers: [],
        upgrade: false
      };
      this.trailers = [];
      this.line = "";
      this.isChunked = false;
      this.connection = "";
      this.headerSize = 0;
      this.body_bytes = null;
      this.isUserCall = false;
      this.hadError = false;
    };
    HTTPParser.encoding = "ascii";
    HTTPParser.maxHeaderSize = 80 * 1024;
    HTTPParser.REQUEST = "REQUEST";
    HTTPParser.RESPONSE = "RESPONSE";
    var kOnHeaders = HTTPParser.kOnHeaders = 1;
    var kOnHeadersComplete = HTTPParser.kOnHeadersComplete = 2;
    var kOnBody = HTTPParser.kOnBody = 3;
    var kOnMessageComplete = HTTPParser.kOnMessageComplete = 4;
    HTTPParser.prototype[kOnHeaders] = HTTPParser.prototype[kOnHeadersComplete] = HTTPParser.prototype[kOnBody] = HTTPParser.prototype[kOnMessageComplete] = function() {
    };
    var compatMode0_12 = true;
    Object.defineProperty(HTTPParser, "kOnExecute", {
      get: function() {
        compatMode0_12 = false;
        return 99;
      }
    });
    var methods = exports.methods = HTTPParser.methods = ["DELETE", "GET", "HEAD", "POST", "PUT", "CONNECT", "OPTIONS", "TRACE", "COPY", "LOCK", "MKCOL", "MOVE", "PROPFIND", "PROPPATCH", "SEARCH", "UNLOCK", "BIND", "REBIND", "UNBIND", "ACL", "REPORT", "MKACTIVITY", "CHECKOUT", "MERGE", "M-SEARCH", "NOTIFY", "SUBSCRIBE", "UNSUBSCRIBE", "PATCH", "PURGE", "MKCALENDAR", "LINK", "UNLINK", "SOURCE"];
    var method_connect = methods.indexOf("CONNECT");
    HTTPParser.prototype.reinitialize = HTTPParser;
    HTTPParser.prototype.close = HTTPParser.prototype.pause = HTTPParser.prototype.resume = HTTPParser.prototype.free = function() {
    };
    HTTPParser.prototype._compatMode0_11 = false;
    HTTPParser.prototype.getAsyncId = function() {
      return 0;
    };
    var headerState = {
      REQUEST_LINE: true,
      RESPONSE_LINE: true,
      HEADER: true
    };
    HTTPParser.prototype.execute = function(chunk, start, length) {
      if (!(this instanceof HTTPParser)) {
        throw new TypeError("not a HTTPParser");
      }
      start = start || 0;
      length = typeof length === "number" ? length : chunk.length;
      this.chunk = chunk;
      this.offset = start;
      var end = this.end = start + length;
      try {
        while (this.offset < end) {
          if (this[this.state]()) {
            break;
          }
        }
      } catch (err) {
        if (this.isUserCall) {
          throw err;
        }
        this.hadError = true;
        return err;
      }
      this.chunk = null;
      length = this.offset - start;
      if (headerState[this.state]) {
        this.headerSize += length;
        if (this.headerSize > (this.maxHeaderSize || HTTPParser.maxHeaderSize)) {
          return new Error("max header size exceeded");
        }
      }
      return length;
    };
    var stateFinishAllowed = {
      REQUEST_LINE: true,
      RESPONSE_LINE: true,
      BODY_RAW: true
    };
    HTTPParser.prototype.finish = function() {
      if (this.hadError) {
        return;
      }
      if (!stateFinishAllowed[this.state]) {
        return new Error("invalid state for EOF");
      }
      if (this.state === "BODY_RAW") {
        this.userCall()(this[kOnMessageComplete]());
      }
    };
    HTTPParser.prototype.consume = HTTPParser.prototype.unconsume = HTTPParser.prototype.getCurrentBuffer = function() {
    };
    HTTPParser.prototype.userCall = function() {
      this.isUserCall = true;
      var self = this;
      return function(ret) {
        self.isUserCall = false;
        return ret;
      };
    };
    HTTPParser.prototype.nextRequest = function() {
      this.userCall()(this[kOnMessageComplete]());
      this.reinitialize(this.type);
    };
    HTTPParser.prototype.consumeLine = function() {
      var end = this.end, chunk = this.chunk;
      for (var i = this.offset; i < end; i++) {
        if (chunk[i] === 10) {
          var line = this.line + chunk.toString(HTTPParser.encoding, this.offset, i);
          if (line.charAt(line.length - 1) === "\r") {
            line = line.substr(0, line.length - 1);
          }
          this.line = "";
          this.offset = i + 1;
          return line;
        }
      }
      this.line += chunk.toString(HTTPParser.encoding, this.offset, this.end);
      this.offset = this.end;
    };
    var headerExp = /^([^: \t]+):[ \t]*((?:.*[^ \t])|)/;
    var headerContinueExp = /^[ \t]+(.*[^ \t])/;
    HTTPParser.prototype.parseHeader = function(line, headers) {
      if (line.indexOf("\r") !== -1) {
        throw parseErrorCode("HPE_LF_EXPECTED");
      }
      var match = headerExp.exec(line);
      var k = match && match[1];
      if (k) {
        headers.push(k);
        headers.push(match[2]);
      } else {
        var matchContinue = headerContinueExp.exec(line);
        if (matchContinue && headers.length) {
          if (headers[headers.length - 1]) {
            headers[headers.length - 1] += " ";
          }
          headers[headers.length - 1] += matchContinue[1];
        }
      }
    };
    var requestExp = /^([A-Z-]+) ([^ ]+) HTTP\/(\d)\.(\d)$/;
    HTTPParser.prototype.REQUEST_LINE = function() {
      var line = this.consumeLine();
      if (!line) {
        return;
      }
      var match = requestExp.exec(line);
      if (match === null) {
        throw parseErrorCode("HPE_INVALID_CONSTANT");
      }
      this.info.method = this._compatMode0_11 ? match[1] : methods.indexOf(match[1]);
      if (this.info.method === -1) {
        throw new Error("invalid request method");
      }
      this.info.url = match[2];
      this.info.versionMajor = +match[3];
      this.info.versionMinor = +match[4];
      this.body_bytes = 0;
      this.state = "HEADER";
    };
    var responseExp = /^HTTP\/(\d)\.(\d) (\d{3}) ?(.*)$/;
    HTTPParser.prototype.RESPONSE_LINE = function() {
      var line = this.consumeLine();
      if (!line) {
        return;
      }
      var match = responseExp.exec(line);
      if (match === null) {
        throw parseErrorCode("HPE_INVALID_CONSTANT");
      }
      this.info.versionMajor = +match[1];
      this.info.versionMinor = +match[2];
      var statusCode = this.info.statusCode = +match[3];
      this.info.statusMessage = match[4];
      if ((statusCode / 100 | 0) === 1 || statusCode === 204 || statusCode === 304) {
        this.body_bytes = 0;
      }
      this.state = "HEADER";
    };
    HTTPParser.prototype.shouldKeepAlive = function() {
      if (this.info.versionMajor > 0 && this.info.versionMinor > 0) {
        if (this.connection.indexOf("close") !== -1) {
          return false;
        }
      } else if (this.connection.indexOf("keep-alive") === -1) {
        return false;
      }
      if (this.body_bytes !== null || this.isChunked) {
        return true;
      }
      return false;
    };
    HTTPParser.prototype.HEADER = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      var info = this.info;
      if (line) {
        this.parseHeader(line, info.headers);
      } else {
        var headers = info.headers;
        var hasContentLength = false;
        var currentContentLengthValue;
        var hasUpgradeHeader = false;
        for (var i = 0; i < headers.length; i += 2) {
          switch (headers[i].toLowerCase()) {
            case "transfer-encoding":
              this.isChunked = headers[i + 1].toLowerCase() === "chunked";
              break;
            case "content-length":
              currentContentLengthValue = +headers[i + 1];
              if (hasContentLength) {
                if (currentContentLengthValue !== this.body_bytes) {
                  throw parseErrorCode("HPE_UNEXPECTED_CONTENT_LENGTH");
                }
              } else {
                hasContentLength = true;
                this.body_bytes = currentContentLengthValue;
              }
              break;
            case "connection":
              this.connection += headers[i + 1].toLowerCase();
              break;
            case "upgrade":
              hasUpgradeHeader = true;
              break;
          }
        }
        if (this.isChunked && hasContentLength) {
          hasContentLength = false;
          this.body_bytes = null;
        }
        if (hasUpgradeHeader && this.connection.indexOf("upgrade") != -1) {
          info.upgrade = this.type === HTTPParser.REQUEST || info.statusCode === 101;
        } else {
          info.upgrade = info.method === method_connect;
        }
        if (this.isChunked && info.upgrade) {
          this.isChunked = false;
        }
        info.shouldKeepAlive = this.shouldKeepAlive();
        var skipBody;
        if (compatMode0_12) {
          skipBody = this.userCall()(this[kOnHeadersComplete](info));
        } else {
          skipBody = this.userCall()(this[kOnHeadersComplete](info.versionMajor, info.versionMinor, info.headers, info.method, info.url, info.statusCode, info.statusMessage, info.upgrade, info.shouldKeepAlive));
        }
        if (skipBody === 2) {
          this.nextRequest();
          return true;
        } else if (this.isChunked && !skipBody) {
          this.state = "BODY_CHUNKHEAD";
        } else if (skipBody || this.body_bytes === 0) {
          this.nextRequest();
          return info.upgrade;
        } else if (this.body_bytes === null) {
          this.state = "BODY_RAW";
        } else {
          this.state = "BODY_SIZED";
        }
      }
    };
    HTTPParser.prototype.BODY_CHUNKHEAD = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      this.body_bytes = parseInt(line, 16);
      if (!this.body_bytes) {
        this.state = "BODY_CHUNKTRAILERS";
      } else {
        this.state = "BODY_CHUNK";
      }
    };
    HTTPParser.prototype.BODY_CHUNK = function() {
      var length = Math.min(this.end - this.offset, this.body_bytes);
      this.userCall()(this[kOnBody](this.chunk, this.offset, length));
      this.offset += length;
      this.body_bytes -= length;
      if (!this.body_bytes) {
        this.state = "BODY_CHUNKEMPTYLINE";
      }
    };
    HTTPParser.prototype.BODY_CHUNKEMPTYLINE = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      assert2.equal(line, "");
      this.state = "BODY_CHUNKHEAD";
    };
    HTTPParser.prototype.BODY_CHUNKTRAILERS = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      if (line) {
        this.parseHeader(line, this.trailers);
      } else {
        if (this.trailers.length) {
          this.userCall()(this[kOnHeaders](this.trailers, ""));
        }
        this.nextRequest();
      }
    };
    HTTPParser.prototype.BODY_RAW = function() {
      var length = this.end - this.offset;
      this.userCall()(this[kOnBody](this.chunk, this.offset, length));
      this.offset = this.end;
    };
    HTTPParser.prototype.BODY_SIZED = function() {
      var length = Math.min(this.end - this.offset, this.body_bytes);
      this.userCall()(this[kOnBody](this.chunk, this.offset, length));
      this.offset += length;
      this.body_bytes -= length;
      if (!this.body_bytes) {
        this.nextRequest();
      }
    };
    ["Headers", "HeadersComplete", "Body", "MessageComplete"].forEach(function(name2) {
      var k = HTTPParser["kOn" + name2];
      Object.defineProperty(HTTPParser.prototype, "on" + name2, {
        get: function() {
          return this[k];
        },
        set: function(to) {
          this._compatMode0_11 = true;
          method_connect = "CONNECT";
          return this[k] = to;
        }
      });
    });
    function parseErrorCode(code) {
      var err = new Error("Parse Error");
      err.code = code;
      return err;
    }
  }
});

// node_modules/websocket-driver/lib/websocket/http_parser.js
var require_http_parser2 = __commonJS({
  "node_modules/websocket-driver/lib/websocket/http_parser.js"(exports, module) {
    "use strict";
    var NodeHTTPParser = require_http_parser().HTTPParser;
    var Buffer2 = require_safe_buffer().Buffer;
    var TYPES = {
      request: NodeHTTPParser.REQUEST || "request",
      response: NodeHTTPParser.RESPONSE || "response"
    };
    var HttpParser = function(type) {
      this._type = type;
      this._parser = new NodeHTTPParser(TYPES[type]);
      this._complete = false;
      this.headers = {};
      var current = null, self = this;
      this._parser.onHeaderField = function(b, start, length) {
        current = b.toString("utf8", start, start + length).toLowerCase();
      };
      this._parser.onHeaderValue = function(b, start, length) {
        var value = b.toString("utf8", start, start + length);
        if (self.headers.hasOwnProperty(current)) self.headers[current] += ", " + value;
        else self.headers[current] = value;
      };
      this._parser.onHeadersComplete = this._parser[NodeHTTPParser.kOnHeadersComplete] = function(majorVersion, minorVersion, headers, method, pathname, statusCode) {
        var info = arguments[0];
        if (typeof info === "object") {
          method = info.method;
          pathname = info.url;
          statusCode = info.statusCode;
          headers = info.headers;
        }
        self.method = typeof method === "number" ? HttpParser.METHODS[method] : method;
        self.statusCode = statusCode;
        self.url = pathname;
        if (!headers) return;
        for (var i = 0, n = headers.length, key, value; i < n; i += 2) {
          key = headers[i].toLowerCase();
          value = headers[i + 1];
          if (self.headers.hasOwnProperty(key)) self.headers[key] += ", " + value;
          else self.headers[key] = value;
        }
        self._complete = true;
      };
    };
    HttpParser.METHODS = {
      0: "DELETE",
      1: "GET",
      2: "HEAD",
      3: "POST",
      4: "PUT",
      5: "CONNECT",
      6: "OPTIONS",
      7: "TRACE",
      8: "COPY",
      9: "LOCK",
      10: "MKCOL",
      11: "MOVE",
      12: "PROPFIND",
      13: "PROPPATCH",
      14: "SEARCH",
      15: "UNLOCK",
      16: "BIND",
      17: "REBIND",
      18: "UNBIND",
      19: "ACL",
      20: "REPORT",
      21: "MKACTIVITY",
      22: "CHECKOUT",
      23: "MERGE",
      24: "M-SEARCH",
      25: "NOTIFY",
      26: "SUBSCRIBE",
      27: "UNSUBSCRIBE",
      28: "PATCH",
      29: "PURGE",
      30: "MKCALENDAR",
      31: "LINK",
      32: "UNLINK"
    };
    var VERSION2 = process.version ? process.version.match(/[0-9]+/g).map(function(n) {
      return parseInt(n, 10);
    }) : [];
    if (VERSION2[0] === 0 && VERSION2[1] === 12) {
      HttpParser.METHODS[16] = "REPORT";
      HttpParser.METHODS[17] = "MKACTIVITY";
      HttpParser.METHODS[18] = "CHECKOUT";
      HttpParser.METHODS[19] = "MERGE";
      HttpParser.METHODS[20] = "M-SEARCH";
      HttpParser.METHODS[21] = "NOTIFY";
      HttpParser.METHODS[22] = "SUBSCRIBE";
      HttpParser.METHODS[23] = "UNSUBSCRIBE";
      HttpParser.METHODS[24] = "PATCH";
      HttpParser.METHODS[25] = "PURGE";
    }
    HttpParser.prototype.isComplete = function() {
      return this._complete;
    };
    HttpParser.prototype.parse = function(chunk) {
      var consumed = this._parser.execute(chunk, 0, chunk.length);
      if (typeof consumed !== "number") {
        this.error = consumed;
        this._complete = true;
        return;
      }
      if (this._complete) this.body = consumed < chunk.length ? chunk.slice(consumed) : Buffer2.alloc(0);
    };
    module.exports = HttpParser;
  }
});

// node_modules/websocket-extensions/lib/parser.js
var require_parser = __commonJS({
  "node_modules/websocket-extensions/lib/parser.js"(exports, module) {
    "use strict";
    var TOKEN = /([!#\$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+)/;
    var NOTOKEN = /([^!#\$%&'\*\+\-\.\^_`\|~0-9A-Za-z])/g;
    var QUOTED = /"((?:\\[\x00-\x7f]|[^\x00-\x08\x0a-\x1f\x7f"\\])*)"/;
    var PARAM = new RegExp(TOKEN.source + "(?:=(?:" + TOKEN.source + "|" + QUOTED.source + "))?");
    var EXT = new RegExp(TOKEN.source + "(?: *; *" + PARAM.source + ")*", "g");
    var EXT_LIST = new RegExp("^" + EXT.source + "(?: *, *" + EXT.source + ")*$");
    var NUMBER = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var Parser = {
      parseHeader: function(header) {
        var offers = new Offers();
        if (header === "" || header === void 0) return offers;
        if (!EXT_LIST.test(header)) throw new SyntaxError("Invalid Sec-WebSocket-Extensions header: " + header);
        var values = header.match(EXT);
        values.forEach(function(value) {
          var params = value.match(new RegExp(PARAM.source, "g")), name2 = params.shift(), offer = {};
          params.forEach(function(param) {
            var args = param.match(PARAM), key = args[1], data;
            if (args[2] !== void 0) {
              data = args[2];
            } else if (args[3] !== void 0) {
              data = args[3].replace(/\\/g, "");
            } else {
              data = true;
            }
            if (NUMBER.test(data)) data = parseFloat(data);
            if (hasOwnProperty.call(offer, key)) {
              offer[key] = [].concat(offer[key]);
              offer[key].push(data);
            } else {
              offer[key] = data;
            }
          }, this);
          offers.push(name2, offer);
        }, this);
        return offers;
      },
      serializeParams: function(name2, params) {
        var values = [];
        var print = function(key2, value) {
          if (value instanceof Array) {
            value.forEach(function(v) {
              print(key2, v);
            });
          } else if (value === true) {
            values.push(key2);
          } else if (typeof value === "number") {
            values.push(key2 + "=" + value);
          } else if (NOTOKEN.test(value)) {
            values.push(key2 + '="' + value.replace(/"/g, '\\"') + '"');
          } else {
            values.push(key2 + "=" + value);
          }
        };
        for (var key in params) print(key, params[key]);
        return [name2].concat(values).join("; ");
      }
    };
    var Offers = function() {
      this._byName = {};
      this._inOrder = [];
    };
    Offers.prototype.push = function(name2, params) {
      if (!hasOwnProperty.call(this._byName, name2)) this._byName[name2] = [];
      this._byName[name2].push(params);
      this._inOrder.push({
        name: name2,
        params
      });
    };
    Offers.prototype.eachOffer = function(callback, context) {
      var list3 = this._inOrder;
      for (var i = 0, n = list3.length; i < n; i++) callback.call(context, list3[i].name, list3[i].params);
    };
    Offers.prototype.byName = function(name2) {
      return this._byName[name2] || [];
    };
    Offers.prototype.toArray = function() {
      return this._inOrder.slice();
    };
    module.exports = Parser;
  }
});

// node_modules/websocket-extensions/lib/pipeline/ring_buffer.js
var require_ring_buffer = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/ring_buffer.js"(exports, module) {
    "use strict";
    var RingBuffer = function(bufferSize) {
      this._bufferSize = bufferSize;
      this.clear();
    };
    RingBuffer.prototype.clear = function() {
      this._buffer = new Array(this._bufferSize);
      this._ringOffset = 0;
      this._ringSize = this._bufferSize;
      this._head = 0;
      this._tail = 0;
      this.length = 0;
    };
    RingBuffer.prototype.push = function(value) {
      var expandBuffer = false, expandRing = false;
      if (this._ringSize < this._bufferSize) {
        expandBuffer = this._tail === 0;
      } else if (this._ringOffset === this._ringSize) {
        expandBuffer = true;
        expandRing = this._tail === 0;
      }
      if (expandBuffer) {
        this._tail = this._bufferSize;
        this._buffer = this._buffer.concat(new Array(this._bufferSize));
        this._bufferSize = this._buffer.length;
        if (expandRing) this._ringSize = this._bufferSize;
      }
      this._buffer[this._tail] = value;
      this.length += 1;
      if (this._tail < this._ringSize) this._ringOffset += 1;
      this._tail = (this._tail + 1) % this._bufferSize;
    };
    RingBuffer.prototype.peek = function() {
      if (this.length === 0) return void 0;
      return this._buffer[this._head];
    };
    RingBuffer.prototype.shift = function() {
      if (this.length === 0) return void 0;
      var value = this._buffer[this._head];
      this._buffer[this._head] = void 0;
      this.length -= 1;
      this._ringOffset -= 1;
      if (this._ringOffset === 0 && this.length > 0) {
        this._head = this._ringSize;
        this._ringOffset = this.length;
        this._ringSize = this._bufferSize;
      } else {
        this._head = (this._head + 1) % this._ringSize;
      }
      return value;
    };
    module.exports = RingBuffer;
  }
});

// node_modules/websocket-extensions/lib/pipeline/functor.js
var require_functor = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/functor.js"(exports, module) {
    "use strict";
    var RingBuffer = require_ring_buffer();
    var Functor = function(session, method) {
      this._session = session;
      this._method = method;
      this._queue = new RingBuffer(Functor.QUEUE_SIZE);
      this._stopped = false;
      this.pending = 0;
    };
    Functor.QUEUE_SIZE = 8;
    Functor.prototype.call = function(error2, message, callback, context) {
      if (this._stopped) return;
      var record = {
        error: error2,
        message,
        callback,
        context,
        done: false
      }, called = false, self = this;
      this._queue.push(record);
      if (record.error) {
        record.done = true;
        this._stop();
        return this._flushQueue();
      }
      var handler = function(err, msg) {
        if (!(called ^ (called = true))) return;
        if (err) {
          self._stop();
          record.error = err;
          record.message = null;
        } else {
          record.message = msg;
        }
        record.done = true;
        self._flushQueue();
      };
      try {
        this._session[this._method](message, handler);
      } catch (err) {
        handler(err);
      }
    };
    Functor.prototype._stop = function() {
      this.pending = this._queue.length;
      this._stopped = true;
    };
    Functor.prototype._flushQueue = function() {
      var queue = this._queue, record;
      while (queue.length > 0 && queue.peek().done) {
        record = queue.shift();
        if (record.error) {
          this.pending = 0;
          queue.clear();
        } else {
          this.pending -= 1;
        }
        record.callback.call(record.context, record.error, record.message);
      }
    };
    module.exports = Functor;
  }
});

// node_modules/websocket-extensions/lib/pipeline/pledge.js
var require_pledge = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/pledge.js"(exports, module) {
    "use strict";
    var RingBuffer = require_ring_buffer();
    var Pledge = function() {
      this._complete = false;
      this._callbacks = new RingBuffer(Pledge.QUEUE_SIZE);
    };
    Pledge.QUEUE_SIZE = 4;
    Pledge.all = function(list3) {
      var pledge = new Pledge(), pending = list3.length, n = pending;
      if (pending === 0) pledge.done();
      while (n--) list3[n].then(function() {
        pending -= 1;
        if (pending === 0) pledge.done();
      });
      return pledge;
    };
    Pledge.prototype.then = function(callback) {
      if (this._complete) callback();
      else this._callbacks.push(callback);
    };
    Pledge.prototype.done = function() {
      this._complete = true;
      var callbacks = this._callbacks, callback;
      while (callback = callbacks.shift()) callback();
    };
    module.exports = Pledge;
  }
});

// node_modules/websocket-extensions/lib/pipeline/cell.js
var require_cell = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/cell.js"(exports, module) {
    "use strict";
    var Functor = require_functor();
    var Pledge = require_pledge();
    var Cell = function(tuple) {
      this._ext = tuple[0];
      this._session = tuple[1];
      this._functors = {
        incoming: new Functor(this._session, "processIncomingMessage"),
        outgoing: new Functor(this._session, "processOutgoingMessage")
      };
    };
    Cell.prototype.pending = function(direction) {
      var functor = this._functors[direction];
      if (!functor._stopped) functor.pending += 1;
    };
    Cell.prototype.incoming = function(error2, message, callback, context) {
      this._exec("incoming", error2, message, callback, context);
    };
    Cell.prototype.outgoing = function(error2, message, callback, context) {
      this._exec("outgoing", error2, message, callback, context);
    };
    Cell.prototype.close = function() {
      this._closed = this._closed || new Pledge();
      this._doClose();
      return this._closed;
    };
    Cell.prototype._exec = function(direction, error2, message, callback, context) {
      this._functors[direction].call(error2, message, function(err, msg) {
        if (err) err.message = this._ext.name + ": " + err.message;
        callback.call(context, err, msg);
        this._doClose();
      }, this);
    };
    Cell.prototype._doClose = function() {
      var fin = this._functors.incoming, fout = this._functors.outgoing;
      if (!this._closed || fin.pending + fout.pending !== 0) return;
      if (this._session) this._session.close();
      this._session = null;
      this._closed.done();
    };
    module.exports = Cell;
  }
});

// node_modules/websocket-extensions/lib/pipeline/index.js
var require_pipeline = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/index.js"(exports, module) {
    "use strict";
    var Cell = require_cell();
    var Pledge = require_pledge();
    var Pipeline = function(sessions) {
      this._cells = sessions.map(function(session) {
        return new Cell(session);
      });
      this._stopped = {
        incoming: false,
        outgoing: false
      };
    };
    Pipeline.prototype.processIncomingMessage = function(message, callback, context) {
      if (this._stopped.incoming) return;
      this._loop("incoming", this._cells.length - 1, -1, -1, message, callback, context);
    };
    Pipeline.prototype.processOutgoingMessage = function(message, callback, context) {
      if (this._stopped.outgoing) return;
      this._loop("outgoing", 0, this._cells.length, 1, message, callback, context);
    };
    Pipeline.prototype.close = function(callback, context) {
      this._stopped = {
        incoming: true,
        outgoing: true
      };
      var closed = this._cells.map(function(a) {
        return a.close();
      });
      if (callback) Pledge.all(closed).then(function() {
        callback.call(context);
      });
    };
    Pipeline.prototype._loop = function(direction, start, end, step, message, callback, context) {
      var cells = this._cells, n = cells.length, self = this;
      while (n--) cells[n].pending(direction);
      var pipe = function(index, error2, msg) {
        if (index === end) return callback.call(context, error2, msg);
        cells[index][direction](error2, msg, function(err, m) {
          if (err) self._stopped[direction] = true;
          pipe(index + step, err, m);
        });
      };
      pipe(start, null, message);
    };
    module.exports = Pipeline;
  }
});

// node_modules/websocket-extensions/lib/websocket_extensions.js
var require_websocket_extensions = __commonJS({
  "node_modules/websocket-extensions/lib/websocket_extensions.js"(exports, module) {
    "use strict";
    var Parser = require_parser();
    var Pipeline = require_pipeline();
    var Extensions = function() {
      this._rsv1 = this._rsv2 = this._rsv3 = null;
      this._byName = {};
      this._inOrder = [];
      this._sessions = [];
      this._index = {};
    };
    Extensions.MESSAGE_OPCODES = [1, 2];
    var instance = {
      add: function(ext) {
        if (typeof ext.name !== "string") throw new TypeError("extension.name must be a string");
        if (ext.type !== "permessage") throw new TypeError('extension.type must be "permessage"');
        if (typeof ext.rsv1 !== "boolean") throw new TypeError("extension.rsv1 must be true or false");
        if (typeof ext.rsv2 !== "boolean") throw new TypeError("extension.rsv2 must be true or false");
        if (typeof ext.rsv3 !== "boolean") throw new TypeError("extension.rsv3 must be true or false");
        if (this._byName.hasOwnProperty(ext.name)) throw new TypeError('An extension with name "' + ext.name + '" is already registered');
        this._byName[ext.name] = ext;
        this._inOrder.push(ext);
      },
      generateOffer: function() {
        var sessions = [], offer = [], index = {};
        this._inOrder.forEach(function(ext) {
          var session = ext.createClientSession();
          if (!session) return;
          var record = [ext, session];
          sessions.push(record);
          index[ext.name] = record;
          var offers = session.generateOffer();
          offers = offers ? [].concat(offers) : [];
          offers.forEach(function(off3) {
            offer.push(Parser.serializeParams(ext.name, off3));
          }, this);
        }, this);
        this._sessions = sessions;
        this._index = index;
        return offer.length > 0 ? offer.join(", ") : null;
      },
      activate: function(header) {
        var responses = Parser.parseHeader(header), sessions = [];
        responses.eachOffer(function(name2, params) {
          var record = this._index[name2];
          if (!record) throw new Error('Server sent an extension response for unknown extension "' + name2 + '"');
          var ext = record[0], session = record[1], reserved = this._reserved(ext);
          if (reserved) throw new Error("Server sent two extension responses that use the RSV" + reserved[0] + ' bit: "' + reserved[1] + '" and "' + ext.name + '"');
          if (session.activate(params) !== true) throw new Error("Server sent unacceptable extension parameters: " + Parser.serializeParams(name2, params));
          this._reserve(ext);
          sessions.push(record);
        }, this);
        this._sessions = sessions;
        this._pipeline = new Pipeline(sessions);
      },
      generateResponse: function(header) {
        var sessions = [], response = [], offers = Parser.parseHeader(header);
        this._inOrder.forEach(function(ext) {
          var offer = offers.byName(ext.name);
          if (offer.length === 0 || this._reserved(ext)) return;
          var session = ext.createServerSession(offer);
          if (!session) return;
          this._reserve(ext);
          sessions.push([ext, session]);
          response.push(Parser.serializeParams(ext.name, session.generateResponse()));
        }, this);
        this._sessions = sessions;
        this._pipeline = new Pipeline(sessions);
        return response.length > 0 ? response.join(", ") : null;
      },
      validFrameRsv: function(frame) {
        var allowed = {
          rsv1: false,
          rsv2: false,
          rsv3: false
        }, ext;
        if (Extensions.MESSAGE_OPCODES.indexOf(frame.opcode) >= 0) {
          for (var i = 0, n = this._sessions.length; i < n; i++) {
            ext = this._sessions[i][0];
            allowed.rsv1 = allowed.rsv1 || ext.rsv1;
            allowed.rsv2 = allowed.rsv2 || ext.rsv2;
            allowed.rsv3 = allowed.rsv3 || ext.rsv3;
          }
        }
        return (allowed.rsv1 || !frame.rsv1) && (allowed.rsv2 || !frame.rsv2) && (allowed.rsv3 || !frame.rsv3);
      },
      processIncomingMessage: function(message, callback, context) {
        this._pipeline.processIncomingMessage(message, callback, context);
      },
      processOutgoingMessage: function(message, callback, context) {
        this._pipeline.processOutgoingMessage(message, callback, context);
      },
      close: function(callback, context) {
        if (!this._pipeline) return callback.call(context);
        this._pipeline.close(callback, context);
      },
      _reserve: function(ext) {
        this._rsv1 = this._rsv1 || ext.rsv1 && ext.name;
        this._rsv2 = this._rsv2 || ext.rsv2 && ext.name;
        this._rsv3 = this._rsv3 || ext.rsv3 && ext.name;
      },
      _reserved: function(ext) {
        if (this._rsv1 && ext.rsv1) return [1, this._rsv1];
        if (this._rsv2 && ext.rsv2) return [2, this._rsv2];
        if (this._rsv3 && ext.rsv3) return [3, this._rsv3];
        return false;
      }
    };
    for (key in instance) Extensions.prototype[key] = instance[key];
    var key;
    module.exports = Extensions;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/hybi/frame.js
var require_frame = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/hybi/frame.js"(exports, module) {
    "use strict";
    var Frame = function() {
    };
    var instance = {
      final: false,
      rsv1: false,
      rsv2: false,
      rsv3: false,
      opcode: null,
      masked: false,
      maskingKey: null,
      lengthBytes: 1,
      length: 0,
      payload: null
    };
    for (key in instance) Frame.prototype[key] = instance[key];
    var key;
    module.exports = Frame;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/hybi/message.js
var require_message = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/hybi/message.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Message = function() {
      this.rsv1 = false;
      this.rsv2 = false;
      this.rsv3 = false;
      this.opcode = null;
      this.length = 0;
      this._chunks = [];
    };
    var instance = {
      read: function() {
        return this.data = this.data || Buffer2.concat(this._chunks, this.length);
      },
      pushFrame: function(frame) {
        this.rsv1 = this.rsv1 || frame.rsv1;
        this.rsv2 = this.rsv2 || frame.rsv2;
        this.rsv3 = this.rsv3 || frame.rsv3;
        if (this.opcode === null) this.opcode = frame.opcode;
        this._chunks.push(frame.payload);
        this.length += frame.length;
      }
    };
    for (key in instance) Message.prototype[key] = instance[key];
    var key;
    module.exports = Message;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/hybi.js
var require_hybi = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/hybi.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = __require("crypto");
    var util = __require("util");
    var Extensions = require_websocket_extensions();
    var Base = require_base();
    var Frame = require_frame();
    var Message = require_message();
    var Hybi = function(request, url, options) {
      Base.apply(this, arguments);
      this._extensions = new Extensions();
      this._stage = 0;
      this._masking = this._options.masking;
      this._protocols = this._options.protocols || [];
      this._requireMasking = this._options.requireMasking;
      this._pingCallbacks = {};
      if (typeof this._protocols === "string") this._protocols = this._protocols.split(/ *, */);
      if (!this._request) return;
      var protos = this._request.headers["sec-websocket-protocol"], supported = this._protocols;
      if (protos !== void 0) {
        if (typeof protos === "string") protos = protos.split(/ *, */);
        this.protocol = protos.filter(function(p) {
          return supported.indexOf(p) >= 0;
        })[0];
      }
      this.version = "hybi-" + Hybi.VERSION;
    };
    util.inherits(Hybi, Base);
    Hybi.VERSION = "13";
    Hybi.mask = function(payload, mask, offset) {
      if (!mask || mask.length === 0) return payload;
      offset = offset || 0;
      for (var i = 0, n = payload.length - offset; i < n; i++) {
        payload[offset + i] = payload[offset + i] ^ mask[i % 4];
      }
      return payload;
    };
    Hybi.generateAccept = function(key2) {
      var sha12 = crypto.createHash("sha1");
      sha12.update(key2 + Hybi.GUID);
      return sha12.digest("base64");
    };
    Hybi.GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    var instance = {
      FIN: 128,
      MASK: 128,
      RSV1: 64,
      RSV2: 32,
      RSV3: 16,
      OPCODE: 15,
      LENGTH: 127,
      OPCODES: {
        continuation: 0,
        text: 1,
        binary: 2,
        close: 8,
        ping: 9,
        pong: 10
      },
      OPCODE_CODES: [0, 1, 2, 8, 9, 10],
      MESSAGE_OPCODES: [0, 1, 2],
      OPENING_OPCODES: [1, 2],
      ERRORS: {
        normal_closure: 1e3,
        going_away: 1001,
        protocol_error: 1002,
        unacceptable: 1003,
        encoding_error: 1007,
        policy_violation: 1008,
        too_large: 1009,
        extension_error: 1010,
        unexpected_condition: 1011
      },
      ERROR_CODES: [1e3, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011],
      DEFAULT_ERROR_CODE: 1e3,
      MIN_RESERVED_ERROR: 3e3,
      MAX_RESERVED_ERROR: 4999,
      // http://www.w3.org/International/questions/qa-forms-utf-8.en.php
      UTF8_MATCH: /^([\x00-\x7F]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$/,
      addExtension: function(extension) {
        this._extensions.add(extension);
        return true;
      },
      parse: function(chunk) {
        this._reader.put(chunk);
        var buffer = true;
        while (buffer) {
          switch (this._stage) {
            case 0:
              buffer = this._reader.read(1);
              if (buffer) this._parseOpcode(buffer[0]);
              break;
            case 1:
              buffer = this._reader.read(1);
              if (buffer) this._parseLength(buffer[0]);
              break;
            case 2:
              buffer = this._reader.read(this._frame.lengthBytes);
              if (buffer) this._parseExtendedLength(buffer);
              break;
            case 3:
              buffer = this._reader.read(4);
              if (buffer) {
                this._stage = 4;
                this._frame.maskingKey = buffer;
              }
              break;
            case 4:
              buffer = this._reader.read(this._frame.length);
              if (buffer) {
                this._stage = 0;
                this._emitFrame(buffer);
              }
              break;
            default:
              buffer = null;
          }
        }
      },
      text: function(message) {
        if (this.readyState > 1) return false;
        return this.frame(message, "text");
      },
      binary: function(message) {
        if (this.readyState > 1) return false;
        return this.frame(message, "binary");
      },
      ping: function(message, callback) {
        if (this.readyState > 1) return false;
        message = message || "";
        if (callback) this._pingCallbacks[message] = callback;
        return this.frame(message, "ping");
      },
      pong: function(message) {
        if (this.readyState > 1) return false;
        message = message || "";
        return this.frame(message, "pong");
      },
      close: function(reason, code) {
        reason = reason || "";
        code = code || this.ERRORS.normal_closure;
        if (this.readyState <= 0) {
          this.readyState = 3;
          this.emit("close", new Base.CloseEvent(code, reason));
          return true;
        } else if (this.readyState === 1) {
          this.readyState = 2;
          this._extensions.close(function() {
            this.frame(reason, "close", code);
          }, this);
          return true;
        } else {
          return false;
        }
      },
      frame: function(buffer, type, code) {
        if (this.readyState <= 0) return this._queue([buffer, type, code]);
        if (this.readyState > 2) return false;
        if (buffer instanceof Array) buffer = Buffer2.from(buffer);
        if (typeof buffer === "number") buffer = buffer.toString();
        var message = new Message(), isText = typeof buffer === "string", payload, copy;
        message.rsv1 = message.rsv2 = message.rsv3 = false;
        message.opcode = this.OPCODES[type || (isText ? "text" : "binary")];
        payload = isText ? Buffer2.from(buffer, "utf8") : buffer;
        if (code) {
          copy = payload;
          payload = Buffer2.allocUnsafe(2 + copy.length);
          payload.writeUInt16BE(code, 0);
          copy.copy(payload, 2);
        }
        message.data = payload;
        var onMessageReady = function(message2) {
          var frame = new Frame();
          frame.final = true;
          frame.rsv1 = message2.rsv1;
          frame.rsv2 = message2.rsv2;
          frame.rsv3 = message2.rsv3;
          frame.opcode = message2.opcode;
          frame.masked = !!this._masking;
          frame.length = message2.data.length;
          frame.payload = message2.data;
          if (frame.masked) frame.maskingKey = crypto.randomBytes(4);
          this._sendFrame(frame);
        };
        if (this.MESSAGE_OPCODES.indexOf(message.opcode) >= 0) this._extensions.processOutgoingMessage(message, function(error2, message2) {
          if (error2) return this._fail("extension_error", error2.message);
          onMessageReady.call(this, message2);
        }, this);
        else onMessageReady.call(this, message);
        return true;
      },
      _sendFrame: function(frame) {
        var length = frame.length, header = length <= 125 ? 2 : length <= 65535 ? 4 : 10, offset = header + (frame.masked ? 4 : 0), buffer = Buffer2.allocUnsafe(offset + length), masked = frame.masked ? this.MASK : 0;
        buffer[0] = (frame.final ? this.FIN : 0) | (frame.rsv1 ? this.RSV1 : 0) | (frame.rsv2 ? this.RSV2 : 0) | (frame.rsv3 ? this.RSV3 : 0) | frame.opcode;
        if (length <= 125) {
          buffer[1] = masked | length;
        } else if (length <= 65535) {
          buffer[1] = masked | 126;
          buffer.writeUInt16BE(length, 2);
        } else {
          buffer[1] = masked | 127;
          buffer.writeUInt32BE(Math.floor(length / 4294967296), 2);
          buffer.writeUInt32BE(length % 4294967296, 6);
        }
        frame.payload.copy(buffer, offset);
        if (frame.masked) {
          frame.maskingKey.copy(buffer, header);
          Hybi.mask(buffer, frame.maskingKey, offset);
        }
        this._write(buffer);
      },
      _handshakeResponse: function() {
        var secKey = this._request.headers["sec-websocket-key"], version2 = this._request.headers["sec-websocket-version"];
        if (version2 !== Hybi.VERSION) throw new Error("Unsupported WebSocket version: " + version2);
        if (typeof secKey !== "string") throw new Error("Missing handshake request header: Sec-WebSocket-Key");
        this._headers.set("Upgrade", "websocket");
        this._headers.set("Connection", "Upgrade");
        this._headers.set("Sec-WebSocket-Accept", Hybi.generateAccept(secKey));
        if (this.protocol) this._headers.set("Sec-WebSocket-Protocol", this.protocol);
        var extensions = this._extensions.generateResponse(this._request.headers["sec-websocket-extensions"]);
        if (extensions) this._headers.set("Sec-WebSocket-Extensions", extensions);
        var start = "HTTP/1.1 101 Switching Protocols", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "utf8");
      },
      _shutdown: function(code, reason, error2) {
        delete this._frame;
        delete this._message;
        this._stage = 5;
        var sendCloseFrame = this.readyState === 1;
        this.readyState = 2;
        this._extensions.close(function() {
          if (sendCloseFrame) this.frame(reason, "close", code);
          this.readyState = 3;
          if (error2) this.emit("error", new Error(reason));
          this.emit("close", new Base.CloseEvent(code, reason));
        }, this);
      },
      _fail: function(type, message) {
        if (this.readyState > 1) return;
        this._shutdown(this.ERRORS[type], message, true);
      },
      _parseOpcode: function(octet) {
        var rsvs = [this.RSV1, this.RSV2, this.RSV3].map(function(rsv) {
          return (octet & rsv) === rsv;
        });
        var frame = this._frame = new Frame();
        frame.final = (octet & this.FIN) === this.FIN;
        frame.rsv1 = rsvs[0];
        frame.rsv2 = rsvs[1];
        frame.rsv3 = rsvs[2];
        frame.opcode = octet & this.OPCODE;
        this._stage = 1;
        if (!this._extensions.validFrameRsv(frame)) return this._fail("protocol_error", "One or more reserved bits are on: reserved1 = " + (frame.rsv1 ? 1 : 0) + ", reserved2 = " + (frame.rsv2 ? 1 : 0) + ", reserved3 = " + (frame.rsv3 ? 1 : 0));
        if (this.OPCODE_CODES.indexOf(frame.opcode) < 0) return this._fail("protocol_error", "Unrecognized frame opcode: " + frame.opcode);
        if (this.MESSAGE_OPCODES.indexOf(frame.opcode) < 0 && !frame.final) return this._fail("protocol_error", "Received fragmented control frame: opcode = " + frame.opcode);
        if (this._message && this.OPENING_OPCODES.indexOf(frame.opcode) >= 0) return this._fail("protocol_error", "Received new data frame but previous continuous frame is unfinished");
      },
      _parseLength: function(octet) {
        var frame = this._frame;
        frame.masked = (octet & this.MASK) === this.MASK;
        frame.length = octet & this.LENGTH;
        if (frame.length >= 0 && frame.length <= 125) {
          this._stage = frame.masked ? 3 : 4;
          if (!this._checkFrameLength()) return;
        } else {
          this._stage = 2;
          frame.lengthBytes = frame.length === 126 ? 2 : 8;
        }
        if (this._requireMasking && !frame.masked) return this._fail("unacceptable", "Received unmasked frame but masking is required");
      },
      _parseExtendedLength: function(buffer) {
        var frame = this._frame;
        frame.length = this._readUInt(buffer);
        this._stage = frame.masked ? 3 : 4;
        if (this.MESSAGE_OPCODES.indexOf(frame.opcode) < 0 && frame.length > 125) return this._fail("protocol_error", "Received control frame having too long payload: " + frame.length);
        if (!this._checkFrameLength()) return;
      },
      _checkFrameLength: function() {
        var length = this._message ? this._message.length : 0;
        if (length + this._frame.length > this._maxLength) {
          this._fail("too_large", "WebSocket frame length too large");
          return false;
        } else {
          return true;
        }
      },
      _emitFrame: function(buffer) {
        var frame = this._frame, payload = frame.payload = Hybi.mask(buffer, frame.maskingKey), opcode = frame.opcode, message, code, reason, callbacks, callback;
        delete this._frame;
        if (opcode === this.OPCODES.continuation) {
          if (!this._message) return this._fail("protocol_error", "Received unexpected continuation frame");
          this._message.pushFrame(frame);
        }
        if (opcode === this.OPCODES.text || opcode === this.OPCODES.binary) {
          this._message = new Message();
          this._message.pushFrame(frame);
        }
        if (frame.final && this.MESSAGE_OPCODES.indexOf(opcode) >= 0) return this._emitMessage(this._message);
        if (opcode === this.OPCODES.close) {
          code = payload.length >= 2 ? payload.readUInt16BE(0) : null;
          reason = payload.length > 2 ? this._encode(payload.slice(2)) : null;
          if (!(payload.length === 0) && !(code !== null && code >= this.MIN_RESERVED_ERROR && code <= this.MAX_RESERVED_ERROR) && this.ERROR_CODES.indexOf(code) < 0) code = this.ERRORS.protocol_error;
          if (payload.length > 125 || payload.length > 2 && !reason) code = this.ERRORS.protocol_error;
          this._shutdown(code || this.DEFAULT_ERROR_CODE, reason || "");
        }
        if (opcode === this.OPCODES.ping) {
          this.frame(payload, "pong");
          this.emit("ping", new Base.PingEvent(payload.toString()));
        }
        if (opcode === this.OPCODES.pong) {
          callbacks = this._pingCallbacks;
          message = this._encode(payload);
          callback = callbacks[message];
          delete callbacks[message];
          if (callback) callback();
          this.emit("pong", new Base.PongEvent(payload.toString()));
        }
      },
      _emitMessage: function(message) {
        var message = this._message;
        message.read();
        delete this._message;
        this._extensions.processIncomingMessage(message, function(error2, message2) {
          if (error2) return this._fail("extension_error", error2.message);
          var payload = message2.data;
          if (message2.opcode === this.OPCODES.text) payload = this._encode(payload);
          if (payload === null) return this._fail("encoding_error", "Could not decode a text frame as UTF-8");
          else this.emit("message", new Base.MessageEvent(payload));
        }, this);
      },
      _encode: function(buffer) {
        try {
          var string = buffer.toString("binary", 0, buffer.length);
          if (!this.UTF8_MATCH.test(string)) return null;
        } catch (e) {
        }
        return buffer.toString("utf8", 0, buffer.length);
      },
      _readUInt: function(buffer) {
        if (buffer.length === 2) return buffer.readUInt16BE(0);
        return buffer.readUInt32BE(0) * 4294967296 + buffer.readUInt32BE(4);
      }
    };
    for (key in instance) Hybi.prototype[key] = instance[key];
    var key;
    module.exports = Hybi;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/proxy.js
var require_proxy = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/proxy.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Stream = __require("stream").Stream;
    var url = __require("url");
    var util = __require("util");
    var Base = require_base();
    var Headers = require_headers();
    var HttpParser = require_http_parser2();
    var PORTS = {
      "ws:": 80,
      "wss:": 443
    };
    var Proxy = function(client, origin, options) {
      this._client = client;
      this._http = new HttpParser("response");
      this._origin = typeof client.url === "object" ? client.url : url.parse(client.url);
      this._url = typeof origin === "object" ? origin : url.parse(origin);
      this._options = options || {};
      this._state = 0;
      this.readable = this.writable = true;
      this._paused = false;
      this._headers = new Headers();
      this._headers.set("Host", this._origin.host);
      this._headers.set("Connection", "keep-alive");
      this._headers.set("Proxy-Connection", "keep-alive");
      var auth = this._url.auth && Buffer2.from(this._url.auth, "utf8").toString("base64");
      if (auth) this._headers.set("Proxy-Authorization", "Basic " + auth);
    };
    util.inherits(Proxy, Stream);
    var instance = {
      setHeader: function(name2, value) {
        if (this._state !== 0) return false;
        this._headers.set(name2, value);
        return true;
      },
      start: function() {
        if (this._state !== 0) return false;
        this._state = 1;
        var origin = this._origin, port = origin.port || PORTS[origin.protocol], start = "CONNECT " + origin.hostname + ":" + port + " HTTP/1.1";
        var headers = [start, this._headers.toString(), ""];
        this.emit("data", Buffer2.from(headers.join("\r\n"), "utf8"));
        return true;
      },
      pause: function() {
        this._paused = true;
      },
      resume: function() {
        this._paused = false;
        this.emit("drain");
      },
      write: function(chunk) {
        if (!this.writable) return false;
        this._http.parse(chunk);
        if (!this._http.isComplete()) return !this._paused;
        this.statusCode = this._http.statusCode;
        this.headers = this._http.headers;
        if (this.statusCode === 200) {
          this.emit("connect", new Base.ConnectEvent());
        } else {
          var message = "Can't establish a connection to the server at " + this._origin.href;
          this.emit("error", new Error(message));
        }
        this.end();
        return !this._paused;
      },
      end: function(chunk) {
        if (!this.writable) return;
        if (chunk !== void 0) this.write(chunk);
        this.readable = this.writable = false;
        this.emit("close");
        this.emit("end");
      },
      destroy: function() {
        this.end();
      }
    };
    for (key in instance) Proxy.prototype[key] = instance[key];
    var key;
    module.exports = Proxy;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/client.js
var require_client = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/client.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = __require("crypto");
    var url = __require("url");
    var util = __require("util");
    var HttpParser = require_http_parser2();
    var Base = require_base();
    var Hybi = require_hybi();
    var Proxy = require_proxy();
    var Client = function(_url, options) {
      this.version = "hybi-" + Hybi.VERSION;
      Hybi.call(this, null, _url, options);
      this.readyState = -1;
      this._key = Client.generateKey();
      this._accept = Hybi.generateAccept(this._key);
      this._http = new HttpParser("response");
      var uri = url.parse(this.url), auth = uri.auth && Buffer2.from(uri.auth, "utf8").toString("base64");
      if (this.VALID_PROTOCOLS.indexOf(uri.protocol) < 0) throw new Error(this.url + " is not a valid WebSocket URL");
      this._pathname = (uri.pathname || "/") + (uri.search || "");
      this._headers.set("Host", uri.host);
      this._headers.set("Upgrade", "websocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("Sec-WebSocket-Key", this._key);
      this._headers.set("Sec-WebSocket-Version", Hybi.VERSION);
      if (this._protocols.length > 0) this._headers.set("Sec-WebSocket-Protocol", this._protocols.join(", "));
      if (auth) this._headers.set("Authorization", "Basic " + auth);
    };
    util.inherits(Client, Hybi);
    Client.generateKey = function() {
      return crypto.randomBytes(16).toString("base64");
    };
    var instance = {
      VALID_PROTOCOLS: ["ws:", "wss:"],
      proxy: function(origin, options) {
        return new Proxy(this, origin, options);
      },
      start: function() {
        if (this.readyState !== -1) return false;
        this._write(this._handshakeRequest());
        this.readyState = 0;
        return true;
      },
      parse: function(chunk) {
        if (this.readyState === 3) return;
        if (this.readyState > 0) return Hybi.prototype.parse.call(this, chunk);
        this._http.parse(chunk);
        if (!this._http.isComplete()) return;
        this._validateHandshake();
        if (this.readyState === 3) return;
        this._open();
        this.parse(this._http.body);
      },
      _handshakeRequest: function() {
        var extensions = this._extensions.generateOffer();
        if (extensions) this._headers.set("Sec-WebSocket-Extensions", extensions);
        var start = "GET " + this._pathname + " HTTP/1.1", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "utf8");
      },
      _failHandshake: function(message) {
        message = "Error during WebSocket handshake: " + message;
        this.readyState = 3;
        this.emit("error", new Error(message));
        this.emit("close", new Base.CloseEvent(this.ERRORS.protocol_error, message));
      },
      _validateHandshake: function() {
        this.statusCode = this._http.statusCode;
        this.headers = this._http.headers;
        if (this._http.error) return this._failHandshake(this._http.error.message);
        if (this._http.statusCode !== 101) return this._failHandshake("Unexpected response code: " + this._http.statusCode);
        var headers = this._http.headers, upgrade = headers["upgrade"] || "", connection = headers["connection"] || "", accept = headers["sec-websocket-accept"] || "", protocol = headers["sec-websocket-protocol"] || "";
        if (upgrade === "") return this._failHandshake("'Upgrade' header is missing");
        if (upgrade.toLowerCase() !== "websocket") return this._failHandshake("'Upgrade' header value is not 'WebSocket'");
        if (connection === "") return this._failHandshake("'Connection' header is missing");
        if (connection.toLowerCase() !== "upgrade") return this._failHandshake("'Connection' header value is not 'Upgrade'");
        if (accept !== this._accept) return this._failHandshake("Sec-WebSocket-Accept mismatch");
        this.protocol = null;
        if (protocol !== "") {
          if (this._protocols.indexOf(protocol) < 0) return this._failHandshake("Sec-WebSocket-Protocol mismatch");
          else this.protocol = protocol;
        }
        try {
          this._extensions.activate(this.headers["sec-websocket-extensions"]);
        } catch (e) {
          return this._failHandshake(e.message);
        }
      }
    };
    for (key in instance) Client.prototype[key] = instance[key];
    var key;
    module.exports = Client;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/draft75.js
var require_draft75 = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/draft75.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Base = require_base();
    var util = __require("util");
    var Draft75 = function(request, url, options) {
      Base.apply(this, arguments);
      this._stage = 0;
      this.version = "hixie-75";
      this._headers.set("Upgrade", "WebSocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("WebSocket-Origin", this._request.headers.origin);
      this._headers.set("WebSocket-Location", this.url);
    };
    util.inherits(Draft75, Base);
    var instance = {
      close: function() {
        if (this.readyState === 3) return false;
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(null, null));
        return true;
      },
      parse: function(chunk) {
        if (this.readyState > 1) return;
        this._reader.put(chunk);
        this._reader.eachByte(function(octet) {
          var message;
          switch (this._stage) {
            case -1:
              this._body.push(octet);
              this._sendHandshakeBody();
              break;
            case 0:
              this._parseLeadingByte(octet);
              break;
            case 1:
              this._length = (octet & 127) + 128 * this._length;
              if (this._closing && this._length === 0) {
                return this.close();
              } else if ((octet & 128) !== 128) {
                if (this._length === 0) {
                  this._stage = 0;
                } else {
                  this._skipped = 0;
                  this._stage = 2;
                }
              }
              break;
            case 2:
              if (octet === 255) {
                this._stage = 0;
                message = Buffer2.from(this._buffer).toString("utf8", 0, this._buffer.length);
                this.emit("message", new Base.MessageEvent(message));
              } else {
                if (this._length) {
                  this._skipped += 1;
                  if (this._skipped === this._length) this._stage = 0;
                } else {
                  this._buffer.push(octet);
                  if (this._buffer.length > this._maxLength) return this.close();
                }
              }
              break;
          }
        }, this);
      },
      frame: function(buffer) {
        if (this.readyState === 0) return this._queue([buffer]);
        if (this.readyState > 1) return false;
        if (typeof buffer !== "string") buffer = buffer.toString();
        var length = Buffer2.byteLength(buffer), frame = Buffer2.allocUnsafe(length + 2);
        frame[0] = 0;
        frame.write(buffer, 1);
        frame[frame.length - 1] = 255;
        this._write(frame);
        return true;
      },
      _handshakeResponse: function() {
        var start = "HTTP/1.1 101 Web Socket Protocol Handshake", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "utf8");
      },
      _parseLeadingByte: function(octet) {
        if ((octet & 128) === 128) {
          this._length = 0;
          this._stage = 1;
        } else {
          delete this._length;
          delete this._skipped;
          this._buffer = [];
          this._stage = 2;
        }
      }
    };
    for (key in instance) Draft75.prototype[key] = instance[key];
    var key;
    module.exports = Draft75;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/draft76.js
var require_draft76 = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/draft76.js"(exports, module) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Base = require_base();
    var Draft75 = require_draft75();
    var crypto = __require("crypto");
    var util = __require("util");
    var numberFromKey = function(key2) {
      return parseInt((key2.match(/[0-9]/g) || []).join(""), 10);
    };
    var spacesInKey = function(key2) {
      return (key2.match(/ /g) || []).length;
    };
    var Draft76 = function(request, url, options) {
      Draft75.apply(this, arguments);
      this._stage = -1;
      this._body = [];
      this.version = "hixie-76";
      this._headers.clear();
      this._headers.set("Upgrade", "WebSocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("Sec-WebSocket-Origin", this._request.headers.origin);
      this._headers.set("Sec-WebSocket-Location", this.url);
    };
    util.inherits(Draft76, Draft75);
    var instance = {
      BODY_SIZE: 8,
      start: function() {
        if (!Draft75.prototype.start.call(this)) return false;
        this._started = true;
        this._sendHandshakeBody();
        return true;
      },
      close: function() {
        if (this.readyState === 3) return false;
        if (this.readyState === 1) this._write(Buffer2.from([255, 0]));
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(null, null));
        return true;
      },
      _handshakeResponse: function() {
        var headers = this._request.headers, key1 = headers["sec-websocket-key1"], key2 = headers["sec-websocket-key2"];
        if (!key1) throw new Error("Missing required header: Sec-WebSocket-Key1");
        if (!key2) throw new Error("Missing required header: Sec-WebSocket-Key2");
        var number1 = numberFromKey(key1), spaces1 = spacesInKey(key1), number2 = numberFromKey(key2), spaces2 = spacesInKey(key2);
        if (number1 % spaces1 !== 0 || number2 % spaces2 !== 0) throw new Error("Client sent invalid Sec-WebSocket-Key headers");
        this._keyValues = [number1 / spaces1, number2 / spaces2];
        var start = "HTTP/1.1 101 WebSocket Protocol Handshake", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "binary");
      },
      _handshakeSignature: function() {
        if (this._body.length < this.BODY_SIZE) return null;
        var md5 = crypto.createHash("md5"), buffer = Buffer2.allocUnsafe(8 + this.BODY_SIZE);
        buffer.writeUInt32BE(this._keyValues[0], 0);
        buffer.writeUInt32BE(this._keyValues[1], 4);
        Buffer2.from(this._body).copy(buffer, 8, 0, this.BODY_SIZE);
        md5.update(buffer);
        return Buffer2.from(md5.digest("binary"), "binary");
      },
      _sendHandshakeBody: function() {
        if (!this._started) return;
        var signature = this._handshakeSignature();
        if (!signature) return;
        this._write(signature);
        this._stage = 0;
        this._open();
        if (this._body.length > this.BODY_SIZE) this.parse(this._body.slice(this.BODY_SIZE));
      },
      _parseLeadingByte: function(octet) {
        if (octet !== 255) return Draft75.prototype._parseLeadingByte.call(this, octet);
        this._closing = true;
        this._length = 0;
        this._stage = 1;
      }
    };
    for (key in instance) Draft76.prototype[key] = instance[key];
    var key;
    module.exports = Draft76;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/server.js
var require_server = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/server.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var HttpParser = require_http_parser2();
    var Base = require_base();
    var Draft75 = require_draft75();
    var Draft76 = require_draft76();
    var Hybi = require_hybi();
    var Server = function(options) {
      Base.call(this, null, null, options);
      this._http = new HttpParser("request");
    };
    util.inherits(Server, Base);
    var instance = {
      EVENTS: ["open", "message", "error", "close", "ping", "pong"],
      _bindEventListeners: function() {
        this.messages.on("error", function() {
        });
        this.on("error", function() {
        });
      },
      parse: function(chunk) {
        if (this._delegate) return this._delegate.parse(chunk);
        this._http.parse(chunk);
        if (!this._http.isComplete()) return;
        this.method = this._http.method;
        this.url = this._http.url;
        this.headers = this._http.headers;
        this.body = this._http.body;
        var self = this;
        this._delegate = Server.http(this, this._options);
        this._delegate.messages = this.messages;
        this._delegate.io = this.io;
        this._open();
        this.EVENTS.forEach(function(event) {
          this._delegate.on(event, function(e) {
            self.emit(event, e);
          });
        }, this);
        this.protocol = this._delegate.protocol;
        this.version = this._delegate.version;
        this.parse(this._http.body);
        this.emit("connect", new Base.ConnectEvent());
      },
      _open: function() {
        this.__queue.forEach(function(msg) {
          this._delegate[msg[0]].apply(this._delegate, msg[1]);
        }, this);
        this.__queue = [];
      }
    };
    ["addExtension", "setHeader", "start", "frame", "text", "binary", "ping", "close"].forEach(function(method) {
      instance[method] = function() {
        if (this._delegate) {
          return this._delegate[method].apply(this._delegate, arguments);
        } else {
          this.__queue.push([method, arguments]);
          return true;
        }
      };
    });
    for (key in instance) Server.prototype[key] = instance[key];
    var key;
    Server.isSecureRequest = function(request) {
      if (request.connection && request.connection.authorized !== void 0) return true;
      if (request.socket && request.socket.secure) return true;
      var headers = request.headers;
      if (!headers) return false;
      if (headers["https"] === "on") return true;
      if (headers["x-forwarded-ssl"] === "on") return true;
      if (headers["x-forwarded-scheme"] === "https") return true;
      if (headers["x-forwarded-proto"] === "https") return true;
      return false;
    };
    Server.determineUrl = function(request) {
      var scheme = this.isSecureRequest(request) ? "wss:" : "ws:";
      return scheme + "//" + request.headers.host + request.url;
    };
    Server.http = function(request, options) {
      options = options || {};
      if (options.requireMasking === void 0) options.requireMasking = true;
      var headers = request.headers, version2 = headers["sec-websocket-version"], key2 = headers["sec-websocket-key"], key1 = headers["sec-websocket-key1"], key22 = headers["sec-websocket-key2"], url = this.determineUrl(request);
      if (version2 || key2) return new Hybi(request, url, options);
      else if (key1 || key22) return new Draft76(request, url, options);
      else return new Draft75(request, url, options);
    };
    module.exports = Server;
  }
});

// node_modules/websocket-driver/lib/websocket/driver.js
var require_driver = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver.js"(exports, module) {
    "use strict";
    var Base = require_base();
    var Client = require_client();
    var Server = require_server();
    var Driver = {
      client: function(url, options) {
        options = options || {};
        if (options.masking === void 0) options.masking = true;
        return new Client(url, options);
      },
      server: function(options) {
        options = options || {};
        if (options.requireMasking === void 0) options.requireMasking = true;
        return new Server(options);
      },
      http: function() {
        return Server.http.apply(Server, arguments);
      },
      isSecureRequest: function(request) {
        return Server.isSecureRequest(request);
      },
      isWebSocket: function(request) {
        return Base.isWebSocket(request);
      },
      validateOptions: function(options, validKeys) {
        Base.validateOptions(options, validKeys);
      }
    };
    module.exports = Driver;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/api/event.js
var require_event = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/api/event.js"(exports, module) {
    "use strict";
    var Event = function(eventType, options) {
      this.type = eventType;
      for (var key in options) this[key] = options[key];
    };
    Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
      this.type = eventType;
      this.bubbles = canBubble;
      this.cancelable = cancelable;
    };
    Event.prototype.stopPropagation = function() {
    };
    Event.prototype.preventDefault = function() {
    };
    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET = 2;
    Event.BUBBLING_PHASE = 3;
    module.exports = Event;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/api/event_target.js
var require_event_target = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/api/event_target.js"(exports, module) {
    "use strict";
    var Event = require_event();
    var EventTarget = {
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      addEventListener: function(eventType, listener, useCapture) {
        this.on(eventType, listener);
      },
      removeEventListener: function(eventType, listener, useCapture) {
        this.removeListener(eventType, listener);
      },
      dispatchEvent: function(event) {
        event.target = event.currentTarget = this;
        event.eventPhase = Event.AT_TARGET;
        if (this["on" + event.type]) this["on" + event.type](event);
        this.emit(event.type, event);
      }
    };
    module.exports = EventTarget;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/api.js
var require_api = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/api.js"(exports, module) {
    "use strict";
    var Stream = __require("stream").Stream;
    var util = __require("util");
    var driver = require_driver();
    var EventTarget = require_event_target();
    var Event = require_event();
    var API = function(options) {
      options = options || {};
      driver.validateOptions(options, ["headers", "extensions", "maxLength", "ping", "proxy", "tls", "ca"]);
      this.readable = this.writable = true;
      var headers = options.headers;
      if (headers) {
        for (var name2 in headers) this._driver.setHeader(name2, headers[name2]);
      }
      var extensions = options.extensions;
      if (extensions) {
        [].concat(extensions).forEach(this._driver.addExtension, this._driver);
      }
      this._ping = options.ping;
      this._pingId = 0;
      this.readyState = API.CONNECTING;
      this.bufferedAmount = 0;
      this.protocol = "";
      this.url = this._driver.url;
      this.version = this._driver.version;
      var self = this;
      this._driver.on("open", function(e) {
        self._open();
      });
      this._driver.on("message", function(e) {
        self._receiveMessage(e.data);
      });
      this._driver.on("close", function(e) {
        self._beginClose(e.reason, e.code);
      });
      this._driver.on("error", function(error2) {
        self._emitError(error2.message);
      });
      this.on("error", function() {
      });
      this._driver.messages.on("drain", function() {
        self.emit("drain");
      });
      if (this._ping) this._pingTimer = setInterval(function() {
        self._pingId += 1;
        self.ping(self._pingId.toString());
      }, this._ping * 1e3);
      this._configureStream();
      if (!this._proxy) {
        this._stream.pipe(this._driver.io);
        this._driver.io.pipe(this._stream);
      }
    };
    util.inherits(API, Stream);
    API.CONNECTING = 0;
    API.OPEN = 1;
    API.CLOSING = 2;
    API.CLOSED = 3;
    API.CLOSE_TIMEOUT = 3e4;
    var instance = {
      write: function(data) {
        return this.send(data);
      },
      end: function(data) {
        if (data !== void 0) this.send(data);
        this.close();
      },
      pause: function() {
        return this._driver.messages.pause();
      },
      resume: function() {
        return this._driver.messages.resume();
      },
      send: function(data) {
        if (this.readyState > API.OPEN) return false;
        if (!(data instanceof Buffer)) data = String(data);
        return this._driver.messages.write(data);
      },
      ping: function(message, callback) {
        if (this.readyState > API.OPEN) return false;
        return this._driver.ping(message, callback);
      },
      close: function(code, reason) {
        if (code === void 0) code = 1e3;
        if (reason === void 0) reason = "";
        if (code !== 1e3 && (code < 3e3 || code > 4999)) throw new Error("Failed to execute 'close' on WebSocket: The code must be either 1000, or between 3000 and 4999. " + code + " is neither.");
        if (this.readyState < API.CLOSING) {
          var self = this;
          this._closeTimer = setTimeout(function() {
            self._beginClose("", 1006);
          }, API.CLOSE_TIMEOUT);
        }
        if (this.readyState !== API.CLOSED) this.readyState = API.CLOSING;
        this._driver.close(reason, code);
      },
      _configureStream: function() {
        var self = this;
        this._stream.setTimeout(0);
        this._stream.setNoDelay(true);
        ["close", "end"].forEach(function(event) {
          this._stream.on(event, function() {
            self._finalizeClose();
          });
        }, this);
        this._stream.on("error", function(error2) {
          self._emitError("Network error: " + self.url + ": " + error2.message);
          self._finalizeClose();
        });
      },
      _open: function() {
        if (this.readyState !== API.CONNECTING) return;
        this.readyState = API.OPEN;
        this.protocol = this._driver.protocol || "";
        var event = new Event("open");
        event.initEvent("open", false, false);
        this.dispatchEvent(event);
      },
      _receiveMessage: function(data) {
        if (this.readyState > API.OPEN) return false;
        if (this.readable) this.emit("data", data);
        var event = new Event("message", {
          data
        });
        event.initEvent("message", false, false);
        this.dispatchEvent(event);
      },
      _emitError: function(message) {
        if (this.readyState >= API.CLOSING) return;
        var event = new Event("error", {
          message
        });
        event.initEvent("error", false, false);
        this.dispatchEvent(event);
      },
      _beginClose: function(reason, code) {
        if (this.readyState === API.CLOSED) return;
        this.readyState = API.CLOSING;
        this._closeParams = [reason, code];
        if (this._stream) {
          this._stream.destroy();
          if (!this._stream.readable) this._finalizeClose();
        }
      },
      _finalizeClose: function() {
        if (this.readyState === API.CLOSED) return;
        this.readyState = API.CLOSED;
        if (this._closeTimer) clearTimeout(this._closeTimer);
        if (this._pingTimer) clearInterval(this._pingTimer);
        if (this._stream) this._stream.end();
        if (this.readable) this.emit("end");
        this.readable = this.writable = false;
        var reason = this._closeParams ? this._closeParams[0] : "", code = this._closeParams ? this._closeParams[1] : 1006;
        var event = new Event("close", {
          code,
          reason
        });
        event.initEvent("close", false, false);
        this.dispatchEvent(event);
      }
    };
    for (method in instance) API.prototype[method] = instance[method];
    var method;
    for (key in EventTarget) API.prototype[key] = EventTarget[key];
    var key;
    module.exports = API;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/client.js
var require_client2 = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/client.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var net = __require("net");
    var tls = __require("tls");
    var url = __require("url");
    var driver = require_driver();
    var API = require_api();
    var Event = require_event();
    var DEFAULT_PORTS = {
      "http:": 80,
      "https:": 443,
      "ws:": 80,
      "wss:": 443
    };
    var SECURE_PROTOCOLS = ["https:", "wss:"];
    var Client = function(_url, protocols, options) {
      options = options || {};
      this.url = _url;
      this._driver = driver.client(this.url, {
        maxLength: options.maxLength,
        protocols
      });
      ["open", "error"].forEach(function(event) {
        this._driver.on(event, function() {
          self.headers = self._driver.headers;
          self.statusCode = self._driver.statusCode;
        });
      }, this);
      var proxy = options.proxy || {}, endpoint = url.parse(proxy.origin || this.url), port = endpoint.port || DEFAULT_PORTS[endpoint.protocol], secure = SECURE_PROTOCOLS.indexOf(endpoint.protocol) >= 0, onConnect = function() {
        self._onConnect();
      }, netOptions = options.net || {}, originTLS = options.tls || {}, socketTLS = proxy.origin ? proxy.tls || {} : originTLS, self = this;
      netOptions.host = socketTLS.host = endpoint.hostname;
      netOptions.port = socketTLS.port = port;
      originTLS.ca = originTLS.ca || options.ca;
      socketTLS.servername = socketTLS.servername || endpoint.hostname;
      this._stream = secure ? tls.connect(socketTLS, onConnect) : net.connect(netOptions, onConnect);
      if (proxy.origin) this._configureProxy(proxy, originTLS);
      API.call(this, options);
    };
    util.inherits(Client, API);
    Client.prototype._onConnect = function() {
      var worker = this._proxy || this._driver;
      worker.start();
    };
    Client.prototype._configureProxy = function(proxy, originTLS) {
      var uri = url.parse(this.url), secure = SECURE_PROTOCOLS.indexOf(uri.protocol) >= 0, self = this, name2;
      this._proxy = this._driver.proxy(proxy.origin);
      if (proxy.headers) {
        for (name2 in proxy.headers) this._proxy.setHeader(name2, proxy.headers[name2]);
      }
      this._proxy.pipe(this._stream, {
        end: false
      });
      this._stream.pipe(this._proxy);
      this._proxy.on("connect", function() {
        if (secure) {
          var options = {
            socket: self._stream,
            servername: uri.hostname
          };
          for (name2 in originTLS) options[name2] = originTLS[name2];
          self._stream = tls.connect(options);
          self._configureStream();
        }
        self._driver.io.pipe(self._stream);
        self._stream.pipe(self._driver.io);
        self._driver.start();
      });
      this._proxy.on("error", function(error2) {
        self._driver.emit("error", error2);
      });
    };
    module.exports = Client;
  }
});

// node_modules/faye-websocket/lib/faye/eventsource.js
var require_eventsource = __commonJS({
  "node_modules/faye-websocket/lib/faye/eventsource.js"(exports, module) {
    "use strict";
    var Stream = __require("stream").Stream;
    var util = __require("util");
    var driver = require_driver();
    var Headers = require_headers();
    var API = require_api();
    var EventTarget = require_event_target();
    var Event = require_event();
    var EventSource = function(request, response, options) {
      this.writable = true;
      options = options || {};
      this._stream = response.socket;
      this._ping = options.ping || this.DEFAULT_PING;
      this._retry = options.retry || this.DEFAULT_RETRY;
      var scheme = driver.isSecureRequest(request) ? "https:" : "http:";
      this.url = scheme + "//" + request.headers.host + request.url;
      this.lastEventId = request.headers["last-event-id"] || "";
      this.readyState = API.CONNECTING;
      var headers = new Headers(), self = this;
      if (options.headers) {
        for (var key2 in options.headers) headers.set(key2, options.headers[key2]);
      }
      if (!this._stream || !this._stream.writable) return;
      process.nextTick(function() {
        self._open();
      });
      this._stream.setTimeout(0);
      this._stream.setNoDelay(true);
      var handshake = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache, no-store\r\nConnection: close\r\n" + headers.toString() + "\r\nretry: " + Math.floor(this._retry * 1e3) + "\r\n\r\n";
      this._write(handshake);
      this._stream.on("drain", function() {
        self.emit("drain");
      });
      if (this._ping) this._pingTimer = setInterval(function() {
        self.ping();
      }, this._ping * 1e3);
      ["error", "end"].forEach(function(event) {
        self._stream.on(event, function() {
          self.close();
        });
      });
    };
    util.inherits(EventSource, Stream);
    EventSource.isEventSource = function(request) {
      if (request.method !== "GET") return false;
      var accept = (request.headers.accept || "").split(/\s*,\s*/);
      return accept.indexOf("text/event-stream") >= 0;
    };
    var instance = {
      DEFAULT_PING: 10,
      DEFAULT_RETRY: 5,
      _write: function(chunk) {
        if (!this.writable) return false;
        try {
          return this._stream.write(chunk, "utf8");
        } catch (e) {
          return false;
        }
      },
      _open: function() {
        if (this.readyState !== API.CONNECTING) return;
        this.readyState = API.OPEN;
        var event = new Event("open");
        event.initEvent("open", false, false);
        this.dispatchEvent(event);
      },
      write: function(message) {
        return this.send(message);
      },
      end: function(message) {
        if (message !== void 0) this.write(message);
        this.close();
      },
      send: function(message, options) {
        if (this.readyState > API.OPEN) return false;
        message = String(message).replace(/(\r\n|\r|\n)/g, "$1data: ");
        options = options || {};
        var frame = "";
        if (options.event) frame += "event: " + options.event + "\r\n";
        if (options.id) frame += "id: " + options.id + "\r\n";
        frame += "data: " + message + "\r\n\r\n";
        return this._write(frame);
      },
      ping: function() {
        return this._write(":\r\n\r\n");
      },
      close: function() {
        if (this.readyState > API.OPEN) return false;
        this.readyState = API.CLOSED;
        this.writable = false;
        if (this._pingTimer) clearInterval(this._pingTimer);
        if (this._stream) this._stream.end();
        var event = new Event("close");
        event.initEvent("close", false, false);
        this.dispatchEvent(event);
        return true;
      }
    };
    for (method in instance) EventSource.prototype[method] = instance[method];
    var method;
    for (key in EventTarget) EventSource.prototype[key] = EventTarget[key];
    var key;
    module.exports = EventSource;
  }
});

// node_modules/faye-websocket/lib/faye/websocket.js
var require_websocket = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var driver = require_driver();
    var API = require_api();
    var WebSocket2 = function(request, socket, body, protocols, options) {
      options = options || {};
      this._stream = socket;
      this._driver = driver.http(request, {
        maxLength: options.maxLength,
        protocols
      });
      var self = this;
      if (!this._stream || !this._stream.writable) return;
      if (!this._stream.readable) return this._stream.end();
      var catchup = function() {
        self._stream.removeListener("data", catchup);
      };
      this._stream.on("data", catchup);
      API.call(this, options);
      process.nextTick(function() {
        self._driver.start();
        self._driver.io.write(body);
      });
    };
    util.inherits(WebSocket2, API);
    WebSocket2.isWebSocket = function(request) {
      return driver.isWebSocket(request);
    };
    WebSocket2.validateOptions = function(options, validKeys) {
      driver.validateOptions(options, validKeys);
    };
    WebSocket2.WebSocket = WebSocket2;
    WebSocket2.Client = require_client2();
    WebSocket2.EventSource = require_eventsource();
    module.exports = WebSocket2;
  }
});

// node_modules/@angular/fire/fesm2022/angular-fire-database.mjs
var import_rxjs2 = __toESM(require_cjs(), 1);
var import_operators2 = __toESM(require_operators(), 1);

// node_modules/rxfire/database/index.esm.js
var import_rxjs = __toESM(require_cjs());
var import_operators = __toESM(require_operators());

// node_modules/@firebase/database/dist/node-esm/index.node.esm.js
var import_faye_websocket = __toESM(require_websocket());
var PROTOCOL_VERSION = "5";
var VERSION_PARAM = "v";
var TRANSPORT_SESSION_PARAM = "s";
var REFERER_PARAM = "r";
var FORGE_REF = "f";
var FORGE_DOMAIN_RE = /(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/;
var LAST_SESSION_PARAM = "ls";
var APPLICATION_ID_PARAM = "p";
var APP_CHECK_TOKEN_PARAM = "ac";
var WEBSOCKET = "websocket";
var LONG_POLLING = "long_polling";
var DOMStorageWrapper = class {
  /**
   * @param domStorage_ - The underlying storage object (e.g. localStorage or sessionStorage)
   */
  constructor(domStorage_) {
    this.domStorage_ = domStorage_;
    this.prefix_ = "firebase:";
  }
  /**
   * @param key - The key to save the value under
   * @param value - The value being stored, or null to remove the key.
   */
  set(key, value) {
    if (value == null) {
      this.domStorage_.removeItem(this.prefixedName_(key));
    } else {
      this.domStorage_.setItem(this.prefixedName_(key), stringify(value));
    }
  }
  /**
   * @returns The value that was stored under this key, or null
   */
  get(key) {
    const storedVal = this.domStorage_.getItem(this.prefixedName_(key));
    if (storedVal == null) {
      return null;
    } else {
      return jsonEval(storedVal);
    }
  }
  remove(key) {
    this.domStorage_.removeItem(this.prefixedName_(key));
  }
  prefixedName_(name2) {
    return this.prefix_ + name2;
  }
  toString() {
    return this.domStorage_.toString();
  }
};
var MemoryStorage = class {
  constructor() {
    this.cache_ = {};
    this.isInMemoryStorage = true;
  }
  set(key, value) {
    if (value == null) {
      delete this.cache_[key];
    } else {
      this.cache_[key] = value;
    }
  }
  get(key) {
    if (contains(this.cache_, key)) {
      return this.cache_[key];
    }
    return null;
  }
  remove(key) {
    delete this.cache_[key];
  }
};
var createStoragefor = function(domStorageName) {
  try {
    if (typeof window !== "undefined" && typeof window[domStorageName] !== "undefined") {
      const domStorage = window[domStorageName];
      domStorage.setItem("firebase:sentinel", "cache");
      domStorage.removeItem("firebase:sentinel");
      return new DOMStorageWrapper(domStorage);
    }
  } catch (e) {
  }
  return new MemoryStorage();
};
var PersistentStorage = createStoragefor("localStorage");
var SessionStorage = createStoragefor("sessionStorage");
var logClient = new Logger("@firebase/database");
var LUIDGenerator = /* @__PURE__ */ function() {
  let id = 1;
  return function() {
    return id++;
  };
}();
var sha1 = function(str) {
  const utf8Bytes = stringToByteArray(str);
  const sha12 = new Sha1();
  sha12.update(utf8Bytes);
  const sha1Bytes = sha12.digest();
  return base64.encodeByteArray(sha1Bytes);
};
var buildLogMessage_ = function(...varArgs) {
  let message = "";
  for (let i = 0; i < varArgs.length; i++) {
    const arg = varArgs[i];
    if (Array.isArray(arg) || arg && typeof arg === "object" && // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof arg.length === "number") {
      message += buildLogMessage_.apply(null, arg);
    } else if (typeof arg === "object") {
      message += stringify(arg);
    } else {
      message += arg;
    }
    message += " ";
  }
  return message;
};
var logger = null;
var firstLog_ = true;
var enableLogging$1 = function(logger_, persistent) {
  assert(!persistent || logger_ === true || logger_ === false, "Can't turn on custom loggers persistently.");
  if (logger_ === true) {
    logClient.logLevel = LogLevel.VERBOSE;
    logger = logClient.log.bind(logClient);
    if (persistent) {
      SessionStorage.set("logging_enabled", true);
    }
  } else if (typeof logger_ === "function") {
    logger = logger_;
  } else {
    logger = null;
    SessionStorage.remove("logging_enabled");
  }
};
var log = function(...varArgs) {
  if (firstLog_ === true) {
    firstLog_ = false;
    if (logger === null && SessionStorage.get("logging_enabled") === true) {
      enableLogging$1(true);
    }
  }
  if (logger) {
    const message = buildLogMessage_.apply(null, varArgs);
    logger(message);
  }
};
var logWrapper = function(prefix) {
  return function(...varArgs) {
    log(prefix, ...varArgs);
  };
};
var error = function(...varArgs) {
  const message = "FIREBASE INTERNAL ERROR: " + buildLogMessage_(...varArgs);
  logClient.error(message);
};
var fatal = function(...varArgs) {
  const message = `FIREBASE FATAL ERROR: ${buildLogMessage_(...varArgs)}`;
  logClient.error(message);
  throw new Error(message);
};
var warn = function(...varArgs) {
  const message = "FIREBASE WARNING: " + buildLogMessage_(...varArgs);
  logClient.warn(message);
};
var warnIfPageIsSecure = function() {
  if (typeof window !== "undefined" && window.location && window.location.protocol && window.location.protocol.indexOf("https:") !== -1) {
    warn("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
  }
};
var isInvalidJSONNumber = function(data) {
  return typeof data === "number" && (data !== data || // NaN
  data === Number.POSITIVE_INFINITY || data === Number.NEGATIVE_INFINITY);
};
var executeWhenDOMReady = function(fn) {
  if (isNodeSdk() || document.readyState === "complete") {
    fn();
  } else {
    let called = false;
    const wrappedFn = function() {
      if (!document.body) {
        setTimeout(wrappedFn, Math.floor(10));
        return;
      }
      if (!called) {
        called = true;
        fn();
      }
    };
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", wrappedFn, false);
      window.addEventListener("load", wrappedFn, false);
    } else if (document.attachEvent) {
      document.attachEvent("onreadystatechange", () => {
        if (document.readyState === "complete") {
          wrappedFn();
        }
      });
      window.attachEvent("onload", wrappedFn);
    }
  }
};
var MIN_NAME = "[MIN_NAME]";
var MAX_NAME = "[MAX_NAME]";
var nameCompare = function(a, b) {
  if (a === b) {
    return 0;
  } else if (a === MIN_NAME || b === MAX_NAME) {
    return -1;
  } else if (b === MIN_NAME || a === MAX_NAME) {
    return 1;
  } else {
    const aAsInt = tryParseInt(a), bAsInt = tryParseInt(b);
    if (aAsInt !== null) {
      if (bAsInt !== null) {
        return aAsInt - bAsInt === 0 ? a.length - b.length : aAsInt - bAsInt;
      } else {
        return -1;
      }
    } else if (bAsInt !== null) {
      return 1;
    } else {
      return a < b ? -1 : 1;
    }
  }
};
var stringCompare = function(a, b) {
  if (a === b) {
    return 0;
  } else if (a < b) {
    return -1;
  } else {
    return 1;
  }
};
var requireKey = function(key, obj) {
  if (obj && key in obj) {
    return obj[key];
  } else {
    throw new Error("Missing required key (" + key + ") in object: " + stringify(obj));
  }
};
var ObjectToUniqueKey = function(obj) {
  if (typeof obj !== "object" || obj === null) {
    return stringify(obj);
  }
  const keys = [];
  for (const k in obj) {
    keys.push(k);
  }
  keys.sort();
  let key = "{";
  for (let i = 0; i < keys.length; i++) {
    if (i !== 0) {
      key += ",";
    }
    key += stringify(keys[i]);
    key += ":";
    key += ObjectToUniqueKey(obj[keys[i]]);
  }
  key += "}";
  return key;
};
var splitStringBySize = function(str, segsize) {
  const len = str.length;
  if (len <= segsize) {
    return [str];
  }
  const dataSegs = [];
  for (let c = 0; c < len; c += segsize) {
    if (c + segsize > len) {
      dataSegs.push(str.substring(c, len));
    } else {
      dataSegs.push(str.substring(c, c + segsize));
    }
  }
  return dataSegs;
};
function each(obj, fn) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(key, obj[key]);
    }
  }
}
var doubleToIEEE754String = function(v) {
  assert(!isInvalidJSONNumber(v), "Invalid JSON number");
  const ebits = 11, fbits = 52;
  const bias = (1 << ebits - 1) - 1;
  let s, e, f, ln, i;
  if (v === 0) {
    e = 0;
    f = 0;
    s = 1 / v === -Infinity ? 1 : 0;
  } else {
    s = v < 0;
    v = Math.abs(v);
    if (v >= Math.pow(2, 1 - bias)) {
      ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
      e = ln + bias;
      f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
    } else {
      e = 0;
      f = Math.round(v / Math.pow(2, 1 - bias - fbits));
    }
  }
  const bits = [];
  for (i = fbits; i; i -= 1) {
    bits.push(f % 2 ? 1 : 0);
    f = Math.floor(f / 2);
  }
  for (i = ebits; i; i -= 1) {
    bits.push(e % 2 ? 1 : 0);
    e = Math.floor(e / 2);
  }
  bits.push(s ? 1 : 0);
  bits.reverse();
  const str = bits.join("");
  let hexByteString = "";
  for (i = 0; i < 64; i += 8) {
    let hexByte = parseInt(str.substr(i, 8), 2).toString(16);
    if (hexByte.length === 1) {
      hexByte = "0" + hexByte;
    }
    hexByteString = hexByteString + hexByte;
  }
  return hexByteString.toLowerCase();
};
var isChromeExtensionContentScript = function() {
  return !!(typeof window === "object" && window["chrome"] && window["chrome"]["extension"] && !/^chrome/.test(window.location.href));
};
var isWindowsStoreApp = function() {
  return typeof Windows === "object" && typeof Windows.UI === "object";
};
function errorForServerCode(code, query3) {
  let reason = "Unknown Error";
  if (code === "too_big") {
    reason = "The data requested exceeds the maximum size that can be accessed with a single request.";
  } else if (code === "permission_denied") {
    reason = "Client doesn't have permission to access the desired data.";
  } else if (code === "unavailable") {
    reason = "The service is unavailable";
  }
  const error2 = new Error(code + " at " + query3._path.toString() + ": " + reason);
  error2.code = code.toUpperCase();
  return error2;
}
var INTEGER_REGEXP_ = new RegExp("^-?(0*)\\d{1,10}$");
var INTEGER_32_MIN = -2147483648;
var INTEGER_32_MAX = 2147483647;
var tryParseInt = function(str) {
  if (INTEGER_REGEXP_.test(str)) {
    const intVal = Number(str);
    if (intVal >= INTEGER_32_MIN && intVal <= INTEGER_32_MAX) {
      return intVal;
    }
  }
  return null;
};
var exceptionGuard = function(fn) {
  try {
    fn();
  } catch (e) {
    setTimeout(() => {
      const stack = e.stack || "";
      warn("Exception was thrown by user callback.", stack);
      throw e;
    }, Math.floor(0));
  }
};
var beingCrawled = function() {
  const userAgent = typeof window === "object" && window["navigator"] && window["navigator"]["userAgent"] || "";
  return userAgent.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i) >= 0;
};
var setTimeoutNonBlocking = function(fn, time) {
  const timeout = setTimeout(fn, time);
  if (typeof timeout === "number" && // @ts-ignore Is only defined in Deno environments.
  typeof Deno !== "undefined" && // @ts-ignore Deno and unrefTimer are only defined in Deno environments.
  Deno["unrefTimer"]) {
    Deno.unrefTimer(timeout);
  } else if (typeof timeout === "object" && timeout["unref"]) {
    timeout["unref"]();
  }
  return timeout;
};
var RepoInfo = class {
  /**
   * @param host - Hostname portion of the url for the repo
   * @param secure - Whether or not this repo is accessed over ssl
   * @param namespace - The namespace represented by the repo
   * @param webSocketOnly - Whether to prefer websockets over all other transports (used by Nest).
   * @param nodeAdmin - Whether this instance uses Admin SDK credentials
   * @param persistenceKey - Override the default session persistence storage key
   */
  constructor(host, secure, namespace, webSocketOnly, nodeAdmin = false, persistenceKey = "", includeNamespaceInQueryParams = false, isUsingEmulator = false) {
    this.secure = secure;
    this.namespace = namespace;
    this.webSocketOnly = webSocketOnly;
    this.nodeAdmin = nodeAdmin;
    this.persistenceKey = persistenceKey;
    this.includeNamespaceInQueryParams = includeNamespaceInQueryParams;
    this.isUsingEmulator = isUsingEmulator;
    this._host = host.toLowerCase();
    this._domain = this._host.substr(this._host.indexOf(".") + 1);
    this.internalHost = PersistentStorage.get("host:" + host) || this._host;
  }
  isCacheableHost() {
    return this.internalHost.substr(0, 2) === "s-";
  }
  isCustomHost() {
    return this._domain !== "firebaseio.com" && this._domain !== "firebaseio-demo.com";
  }
  get host() {
    return this._host;
  }
  set host(newHost) {
    if (newHost !== this.internalHost) {
      this.internalHost = newHost;
      if (this.isCacheableHost()) {
        PersistentStorage.set("host:" + this._host, this.internalHost);
      }
    }
  }
  toString() {
    let str = this.toURLString();
    if (this.persistenceKey) {
      str += "<" + this.persistenceKey + ">";
    }
    return str;
  }
  toURLString() {
    const protocol = this.secure ? "https://" : "http://";
    const query3 = this.includeNamespaceInQueryParams ? `?ns=${this.namespace}` : "";
    return `${protocol}${this.host}/${query3}`;
  }
};
function repoInfoNeedsQueryParam(repoInfo) {
  return repoInfo.host !== repoInfo.internalHost || repoInfo.isCustomHost() || repoInfo.includeNamespaceInQueryParams;
}
function repoInfoConnectionURL(repoInfo, type, params) {
  assert(typeof type === "string", "typeof type must == string");
  assert(typeof params === "object", "typeof params must == object");
  let connURL;
  if (type === WEBSOCKET) {
    connURL = (repoInfo.secure ? "wss://" : "ws://") + repoInfo.internalHost + "/.ws?";
  } else if (type === LONG_POLLING) {
    connURL = (repoInfo.secure ? "https://" : "http://") + repoInfo.internalHost + "/.lp?";
  } else {
    throw new Error("Unknown connection type: " + type);
  }
  if (repoInfoNeedsQueryParam(repoInfo)) {
    params["ns"] = repoInfo.namespace;
  }
  const pairs = [];
  each(params, (key, value) => {
    pairs.push(key + "=" + value);
  });
  return connURL + pairs.join("&");
}
var StatsCollection = class {
  constructor() {
    this.counters_ = {};
  }
  incrementCounter(name2, amount = 1) {
    if (!contains(this.counters_, name2)) {
      this.counters_[name2] = 0;
    }
    this.counters_[name2] += amount;
  }
  get() {
    return deepCopy(this.counters_);
  }
};
var collections = {};
var reporters = {};
function statsManagerGetCollection(repoInfo) {
  const hashString = repoInfo.toString();
  if (!collections[hashString]) {
    collections[hashString] = new StatsCollection();
  }
  return collections[hashString];
}
function statsManagerGetOrCreateReporter(repoInfo, creatorFunction) {
  const hashString = repoInfo.toString();
  if (!reporters[hashString]) {
    reporters[hashString] = creatorFunction();
  }
  return reporters[hashString];
}
var SDK_VERSION2 = "";
function setSDKVersion(version2) {
  SDK_VERSION2 = version2;
}
var WEBSOCKET_MAX_FRAME_SIZE = 16384;
var WEBSOCKET_KEEPALIVE_INTERVAL = 45e3;
var WebSocketImpl = null;
if (typeof MozWebSocket !== "undefined") {
  WebSocketImpl = MozWebSocket;
} else if (typeof WebSocket !== "undefined") {
  WebSocketImpl = WebSocket;
}
function setWebSocketImpl(impl) {
  WebSocketImpl = impl;
}
var WebSocketConnection = class _WebSocketConnection {
  /**
   * @param connId identifier for this transport
   * @param repoInfo The info for the websocket endpoint.
   * @param applicationId The Firebase App ID for this project.
   * @param appCheckToken The App Check Token for this client.
   * @param authToken The Auth Token for this client.
   * @param transportSessionId Optional transportSessionId if this is connecting
   * to an existing transport session
   * @param lastSessionId Optional lastSessionId if there was a previous
   * connection
   */
  constructor(connId, repoInfo, applicationId, appCheckToken, authToken, transportSessionId, lastSessionId) {
    this.connId = connId;
    this.applicationId = applicationId;
    this.appCheckToken = appCheckToken;
    this.authToken = authToken;
    this.keepaliveTimer = null;
    this.frames = null;
    this.totalFrames = 0;
    this.bytesSent = 0;
    this.bytesReceived = 0;
    this.log_ = logWrapper(this.connId);
    this.stats_ = statsManagerGetCollection(repoInfo);
    this.connURL = _WebSocketConnection.connectionURL_(repoInfo, transportSessionId, lastSessionId, appCheckToken, applicationId);
    this.nodeAdmin = repoInfo.nodeAdmin;
  }
  /**
   * @param repoInfo - The info for the websocket endpoint.
   * @param transportSessionId - Optional transportSessionId if this is connecting to an existing transport
   *                                         session
   * @param lastSessionId - Optional lastSessionId if there was a previous connection
   * @returns connection url
   */
  static connectionURL_(repoInfo, transportSessionId, lastSessionId, appCheckToken, applicationId) {
    const urlParams = {};
    urlParams[VERSION_PARAM] = PROTOCOL_VERSION;
    if (!isNodeSdk() && typeof location !== "undefined" && location.hostname && FORGE_DOMAIN_RE.test(location.hostname)) {
      urlParams[REFERER_PARAM] = FORGE_REF;
    }
    if (transportSessionId) {
      urlParams[TRANSPORT_SESSION_PARAM] = transportSessionId;
    }
    if (lastSessionId) {
      urlParams[LAST_SESSION_PARAM] = lastSessionId;
    }
    if (appCheckToken) {
      urlParams[APP_CHECK_TOKEN_PARAM] = appCheckToken;
    }
    if (applicationId) {
      urlParams[APPLICATION_ID_PARAM] = applicationId;
    }
    return repoInfoConnectionURL(repoInfo, WEBSOCKET, urlParams);
  }
  /**
   * @param onMessage - Callback when messages arrive
   * @param onDisconnect - Callback with connection lost.
   */
  open(onMessage, onDisconnect3) {
    this.onDisconnect = onDisconnect3;
    this.onMessage = onMessage;
    this.log_("Websocket connecting to " + this.connURL);
    this.everConnected_ = false;
    PersistentStorage.set("previous_websocket_failure", true);
    try {
      let options;
      if (isNodeSdk()) {
        const device = this.nodeAdmin ? "AdminNode" : "Node";
        options = {
          headers: {
            "User-Agent": `Firebase/${PROTOCOL_VERSION}/${SDK_VERSION2}/${process.platform}/${device}`,
            "X-Firebase-GMPID": this.applicationId || ""
          }
        };
        if (this.authToken) {
          options.headers["Authorization"] = `Bearer ${this.authToken}`;
        }
        if (this.appCheckToken) {
          options.headers["X-Firebase-AppCheck"] = this.appCheckToken;
        }
        const env = process["env"];
        const proxy = this.connURL.indexOf("wss://") === 0 ? env["HTTPS_PROXY"] || env["https_proxy"] : env["HTTP_PROXY"] || env["http_proxy"];
        if (proxy) {
          options["proxy"] = {
            origin: proxy
          };
        }
      }
      this.mySock = new WebSocketImpl(this.connURL, [], options);
    } catch (e) {
      this.log_("Error instantiating WebSocket.");
      const error2 = e.message || e.data;
      if (error2) {
        this.log_(error2);
      }
      this.onClosed_();
      return;
    }
    this.mySock.onopen = () => {
      this.log_("Websocket connected.");
      this.everConnected_ = true;
    };
    this.mySock.onclose = () => {
      this.log_("Websocket connection was disconnected.");
      this.mySock = null;
      this.onClosed_();
    };
    this.mySock.onmessage = (m) => {
      this.handleIncomingFrame(m);
    };
    this.mySock.onerror = (e) => {
      this.log_("WebSocket error.  Closing connection.");
      const error2 = e.message || e.data;
      if (error2) {
        this.log_(error2);
      }
      this.onClosed_();
    };
  }
  /**
   * No-op for websockets, we don't need to do anything once the connection is confirmed as open
   */
  start() {
  }
  static forceDisallow() {
    _WebSocketConnection.forceDisallow_ = true;
  }
  static isAvailable() {
    let isOldAndroid = false;
    if (typeof navigator !== "undefined" && navigator.userAgent) {
      const oldAndroidRegex = /Android ([0-9]{0,}\.[0-9]{0,})/;
      const oldAndroidMatch = navigator.userAgent.match(oldAndroidRegex);
      if (oldAndroidMatch && oldAndroidMatch.length > 1) {
        if (parseFloat(oldAndroidMatch[1]) < 4.4) {
          isOldAndroid = true;
        }
      }
    }
    return !isOldAndroid && WebSocketImpl !== null && !_WebSocketConnection.forceDisallow_;
  }
  /**
   * Returns true if we previously failed to connect with this transport.
   */
  static previouslyFailed() {
    return PersistentStorage.isInMemoryStorage || PersistentStorage.get("previous_websocket_failure") === true;
  }
  markConnectionHealthy() {
    PersistentStorage.remove("previous_websocket_failure");
  }
  appendFrame_(data) {
    this.frames.push(data);
    if (this.frames.length === this.totalFrames) {
      const fullMess = this.frames.join("");
      this.frames = null;
      const jsonMess = jsonEval(fullMess);
      this.onMessage(jsonMess);
    }
  }
  /**
   * @param frameCount - The number of frames we are expecting from the server
   */
  handleNewFrameCount_(frameCount) {
    this.totalFrames = frameCount;
    this.frames = [];
  }
  /**
   * Attempts to parse a frame count out of some text. If it can't, assumes a value of 1
   * @returns Any remaining data to be process, or null if there is none
   */
  extractFrameCount_(data) {
    assert(this.frames === null, "We already have a frame buffer");
    if (data.length <= 6) {
      const frameCount = Number(data);
      if (!isNaN(frameCount)) {
        this.handleNewFrameCount_(frameCount);
        return null;
      }
    }
    this.handleNewFrameCount_(1);
    return data;
  }
  /**
   * Process a websocket frame that has arrived from the server.
   * @param mess - The frame data
   */
  handleIncomingFrame(mess) {
    if (this.mySock === null) {
      return;
    }
    const data = mess["data"];
    this.bytesReceived += data.length;
    this.stats_.incrementCounter("bytes_received", data.length);
    this.resetKeepAlive();
    if (this.frames !== null) {
      this.appendFrame_(data);
    } else {
      const remainingData = this.extractFrameCount_(data);
      if (remainingData !== null) {
        this.appendFrame_(remainingData);
      }
    }
  }
  /**
   * Send a message to the server
   * @param data - The JSON object to transmit
   */
  send(data) {
    this.resetKeepAlive();
    const dataStr = stringify(data);
    this.bytesSent += dataStr.length;
    this.stats_.incrementCounter("bytes_sent", dataStr.length);
    const dataSegs = splitStringBySize(dataStr, WEBSOCKET_MAX_FRAME_SIZE);
    if (dataSegs.length > 1) {
      this.sendString_(String(dataSegs.length));
    }
    for (let i = 0; i < dataSegs.length; i++) {
      this.sendString_(dataSegs[i]);
    }
  }
  shutdown_() {
    this.isClosed_ = true;
    if (this.keepaliveTimer) {
      clearInterval(this.keepaliveTimer);
      this.keepaliveTimer = null;
    }
    if (this.mySock) {
      this.mySock.close();
      this.mySock = null;
    }
  }
  onClosed_() {
    if (!this.isClosed_) {
      this.log_("WebSocket is closing itself");
      this.shutdown_();
      if (this.onDisconnect) {
        this.onDisconnect(this.everConnected_);
        this.onDisconnect = null;
      }
    }
  }
  /**
   * External-facing close handler.
   * Close the websocket and kill the connection.
   */
  close() {
    if (!this.isClosed_) {
      this.log_("WebSocket is being closed");
      this.shutdown_();
    }
  }
  /**
   * Kill the current keepalive timer and start a new one, to ensure that it always fires N seconds after
   * the last activity.
   */
  resetKeepAlive() {
    clearInterval(this.keepaliveTimer);
    this.keepaliveTimer = setInterval(() => {
      if (this.mySock) {
        this.sendString_("0");
      }
      this.resetKeepAlive();
    }, Math.floor(WEBSOCKET_KEEPALIVE_INTERVAL));
  }
  /**
   * Send a string over the websocket.
   *
   * @param str - String to send.
   */
  sendString_(str) {
    try {
      this.mySock.send(str);
    } catch (e) {
      this.log_("Exception thrown from WebSocket.send():", e.message || e.data, "Closing connection.");
      setTimeout(this.onClosed_.bind(this), 0);
    }
  }
};
WebSocketConnection.responsesRequiredToBeHealthy = 2;
WebSocketConnection.healthyTimeout = 3e4;
var name = "@firebase/database";
var version = "1.0.6";
var AppCheckTokenProvider = class {
  constructor(appName_, appCheckProvider) {
    this.appName_ = appName_;
    this.appCheckProvider = appCheckProvider;
    this.appCheck = appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.getImmediate({
      optional: true
    });
    if (!this.appCheck) {
      appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.get().then((appCheck) => this.appCheck = appCheck);
    }
  }
  getToken(forceRefresh) {
    if (!this.appCheck) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.appCheck) {
            this.getToken(forceRefresh).then(resolve, reject);
          } else {
            resolve(null);
          }
        }, 0);
      });
    }
    return this.appCheck.getToken(forceRefresh);
  }
  addTokenChangeListener(listener) {
    var _a2;
    (_a2 = this.appCheckProvider) === null || _a2 === void 0 ? void 0 : _a2.get().then((appCheck) => appCheck.addTokenListener(listener));
  }
  notifyForInvalidToken() {
    warn(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`);
  }
};
var FirebaseAuthTokenProvider = class {
  constructor(appName_, firebaseOptions_, authProvider_) {
    this.appName_ = appName_;
    this.firebaseOptions_ = firebaseOptions_;
    this.authProvider_ = authProvider_;
    this.auth_ = null;
    this.auth_ = authProvider_.getImmediate({
      optional: true
    });
    if (!this.auth_) {
      authProvider_.onInit((auth) => this.auth_ = auth);
    }
  }
  getToken(forceRefresh) {
    if (!this.auth_) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.auth_) {
            this.getToken(forceRefresh).then(resolve, reject);
          } else {
            resolve(null);
          }
        }, 0);
      });
    }
    return this.auth_.getToken(forceRefresh).catch((error2) => {
      if (error2 && error2.code === "auth/token-not-initialized") {
        log("Got auth/token-not-initialized error.  Treating as null token.");
        return null;
      } else {
        return Promise.reject(error2);
      }
    });
  }
  addTokenChangeListener(listener) {
    if (this.auth_) {
      this.auth_.addAuthTokenListener(listener);
    } else {
      this.authProvider_.get().then((auth) => auth.addAuthTokenListener(listener));
    }
  }
  removeTokenChangeListener(listener) {
    this.authProvider_.get().then((auth) => auth.removeAuthTokenListener(listener));
  }
  notifyForInvalidToken() {
    let errorMessage = 'Provided authentication credentials for the app named "' + this.appName_ + '" are invalid. This usually indicates your app was not initialized correctly. ';
    if ("credential" in this.firebaseOptions_) {
      errorMessage += 'Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.';
    } else if ("serviceAccount" in this.firebaseOptions_) {
      errorMessage += 'Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.';
    } else {
      errorMessage += 'Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.';
    }
    warn(errorMessage);
  }
};
var EmulatorTokenProvider = class {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }
  getToken(forceRefresh) {
    return Promise.resolve({
      accessToken: this.accessToken
    });
  }
  addTokenChangeListener(listener) {
    listener(this.accessToken);
  }
  removeTokenChangeListener(listener) {
  }
  notifyForInvalidToken() {
  }
};
EmulatorTokenProvider.OWNER = "owner";
var PacketReceiver = class {
  /**
   * @param onMessage_
   */
  constructor(onMessage_) {
    this.onMessage_ = onMessage_;
    this.pendingResponses = [];
    this.currentResponseNum = 0;
    this.closeAfterResponse = -1;
    this.onClose = null;
  }
  closeAfter(responseNum, callback) {
    this.closeAfterResponse = responseNum;
    this.onClose = callback;
    if (this.closeAfterResponse < this.currentResponseNum) {
      this.onClose();
      this.onClose = null;
    }
  }
  /**
   * Each message from the server comes with a response number, and an array of data. The responseNumber
   * allows us to ensure that we process them in the right order, since we can't be guaranteed that all
   * browsers will respond in the same order as the requests we sent
   */
  handleResponse(requestNum, data) {
    this.pendingResponses[requestNum] = data;
    while (this.pendingResponses[this.currentResponseNum]) {
      const toProcess = this.pendingResponses[this.currentResponseNum];
      delete this.pendingResponses[this.currentResponseNum];
      for (let i = 0; i < toProcess.length; ++i) {
        if (toProcess[i]) {
          exceptionGuard(() => {
            this.onMessage_(toProcess[i]);
          });
        }
      }
      if (this.currentResponseNum === this.closeAfterResponse) {
        if (this.onClose) {
          this.onClose();
          this.onClose = null;
        }
        break;
      }
      this.currentResponseNum++;
    }
  }
};
var FIREBASE_LONGPOLL_START_PARAM = "start";
var FIREBASE_LONGPOLL_CLOSE_COMMAND = "close";
var FIREBASE_LONGPOLL_COMMAND_CB_NAME = "pLPCommand";
var FIREBASE_LONGPOLL_DATA_CB_NAME = "pRTLPCB";
var FIREBASE_LONGPOLL_ID_PARAM = "id";
var FIREBASE_LONGPOLL_PW_PARAM = "pw";
var FIREBASE_LONGPOLL_SERIAL_PARAM = "ser";
var FIREBASE_LONGPOLL_CALLBACK_ID_PARAM = "cb";
var FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM = "seg";
var FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET = "ts";
var FIREBASE_LONGPOLL_DATA_PARAM = "d";
var FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM = "dframe";
var MAX_URL_DATA_SIZE = 1870;
var SEG_HEADER_SIZE = 30;
var MAX_PAYLOAD_SIZE = MAX_URL_DATA_SIZE - SEG_HEADER_SIZE;
var KEEPALIVE_REQUEST_INTERVAL = 25e3;
var LP_CONNECT_TIMEOUT = 3e4;
var BrowserPollConnection = class _BrowserPollConnection {
  /**
   * @param connId An identifier for this connection, used for logging
   * @param repoInfo The info for the endpoint to send data to.
   * @param applicationId The Firebase App ID for this project.
   * @param appCheckToken The AppCheck token for this client.
   * @param authToken The AuthToken to use for this connection.
   * @param transportSessionId Optional transportSessionid if we are
   * reconnecting for an existing transport session
   * @param lastSessionId Optional lastSessionId if the PersistentConnection has
   * already created a connection previously
   */
  constructor(connId, repoInfo, applicationId, appCheckToken, authToken, transportSessionId, lastSessionId) {
    this.connId = connId;
    this.repoInfo = repoInfo;
    this.applicationId = applicationId;
    this.appCheckToken = appCheckToken;
    this.authToken = authToken;
    this.transportSessionId = transportSessionId;
    this.lastSessionId = lastSessionId;
    this.bytesSent = 0;
    this.bytesReceived = 0;
    this.everConnected_ = false;
    this.log_ = logWrapper(connId);
    this.stats_ = statsManagerGetCollection(repoInfo);
    this.urlFn = (params) => {
      if (this.appCheckToken) {
        params[APP_CHECK_TOKEN_PARAM] = this.appCheckToken;
      }
      return repoInfoConnectionURL(repoInfo, LONG_POLLING, params);
    };
  }
  /**
   * @param onMessage - Callback when messages arrive
   * @param onDisconnect - Callback with connection lost.
   */
  open(onMessage, onDisconnect3) {
    this.curSegmentNum = 0;
    this.onDisconnect_ = onDisconnect3;
    this.myPacketOrderer = new PacketReceiver(onMessage);
    this.isClosed_ = false;
    this.connectTimeoutTimer_ = setTimeout(() => {
      this.log_("Timed out trying to connect.");
      this.onClosed_();
      this.connectTimeoutTimer_ = null;
    }, Math.floor(LP_CONNECT_TIMEOUT));
    executeWhenDOMReady(() => {
      if (this.isClosed_) {
        return;
      }
      this.scriptTagHolder = new FirebaseIFrameScriptHolder((...args) => {
        const [command, arg1, arg2, arg3, arg4] = args;
        this.incrementIncomingBytes_(args);
        if (!this.scriptTagHolder) {
          return;
        }
        if (this.connectTimeoutTimer_) {
          clearTimeout(this.connectTimeoutTimer_);
          this.connectTimeoutTimer_ = null;
        }
        this.everConnected_ = true;
        if (command === FIREBASE_LONGPOLL_START_PARAM) {
          this.id = arg1;
          this.password = arg2;
        } else if (command === FIREBASE_LONGPOLL_CLOSE_COMMAND) {
          if (arg1) {
            this.scriptTagHolder.sendNewPolls = false;
            this.myPacketOrderer.closeAfter(arg1, () => {
              this.onClosed_();
            });
          } else {
            this.onClosed_();
          }
        } else {
          throw new Error("Unrecognized command received: " + command);
        }
      }, (...args) => {
        const [pN, data] = args;
        this.incrementIncomingBytes_(args);
        this.myPacketOrderer.handleResponse(pN, data);
      }, () => {
        this.onClosed_();
      }, this.urlFn);
      const urlParams = {};
      urlParams[FIREBASE_LONGPOLL_START_PARAM] = "t";
      urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = Math.floor(Math.random() * 1e8);
      if (this.scriptTagHolder.uniqueCallbackIdentifier) {
        urlParams[FIREBASE_LONGPOLL_CALLBACK_ID_PARAM] = this.scriptTagHolder.uniqueCallbackIdentifier;
      }
      urlParams[VERSION_PARAM] = PROTOCOL_VERSION;
      if (this.transportSessionId) {
        urlParams[TRANSPORT_SESSION_PARAM] = this.transportSessionId;
      }
      if (this.lastSessionId) {
        urlParams[LAST_SESSION_PARAM] = this.lastSessionId;
      }
      if (this.applicationId) {
        urlParams[APPLICATION_ID_PARAM] = this.applicationId;
      }
      if (this.appCheckToken) {
        urlParams[APP_CHECK_TOKEN_PARAM] = this.appCheckToken;
      }
      if (typeof location !== "undefined" && location.hostname && FORGE_DOMAIN_RE.test(location.hostname)) {
        urlParams[REFERER_PARAM] = FORGE_REF;
      }
      const connectURL = this.urlFn(urlParams);
      this.log_("Connecting via long-poll to " + connectURL);
      this.scriptTagHolder.addTag(connectURL, () => {
      });
    });
  }
  /**
   * Call this when a handshake has completed successfully and we want to consider the connection established
   */
  start() {
    this.scriptTagHolder.startLongPoll(this.id, this.password);
    this.addDisconnectPingFrame(this.id, this.password);
  }
  /**
   * Forces long polling to be considered as a potential transport
   */
  static forceAllow() {
    _BrowserPollConnection.forceAllow_ = true;
  }
  /**
   * Forces longpolling to not be considered as a potential transport
   */
  static forceDisallow() {
    _BrowserPollConnection.forceDisallow_ = true;
  }
  // Static method, use string literal so it can be accessed in a generic way
  static isAvailable() {
    if (isNodeSdk()) {
      return false;
    } else if (_BrowserPollConnection.forceAllow_) {
      return true;
    } else {
      return !_BrowserPollConnection.forceDisallow_ && typeof document !== "undefined" && document.createElement != null && !isChromeExtensionContentScript() && !isWindowsStoreApp();
    }
  }
  /**
   * No-op for polling
   */
  markConnectionHealthy() {
  }
  /**
   * Stops polling and cleans up the iframe
   */
  shutdown_() {
    this.isClosed_ = true;
    if (this.scriptTagHolder) {
      this.scriptTagHolder.close();
      this.scriptTagHolder = null;
    }
    if (this.myDisconnFrame) {
      document.body.removeChild(this.myDisconnFrame);
      this.myDisconnFrame = null;
    }
    if (this.connectTimeoutTimer_) {
      clearTimeout(this.connectTimeoutTimer_);
      this.connectTimeoutTimer_ = null;
    }
  }
  /**
   * Triggered when this transport is closed
   */
  onClosed_() {
    if (!this.isClosed_) {
      this.log_("Longpoll is closing itself");
      this.shutdown_();
      if (this.onDisconnect_) {
        this.onDisconnect_(this.everConnected_);
        this.onDisconnect_ = null;
      }
    }
  }
  /**
   * External-facing close handler. RealTime has requested we shut down. Kill our connection and tell the server
   * that we've left.
   */
  close() {
    if (!this.isClosed_) {
      this.log_("Longpoll is being closed.");
      this.shutdown_();
    }
  }
  /**
   * Send the JSON object down to the server. It will need to be stringified, base64 encoded, and then
   * broken into chunks (since URLs have a small maximum length).
   * @param data - The JSON data to transmit.
   */
  send(data) {
    const dataStr = stringify(data);
    this.bytesSent += dataStr.length;
    this.stats_.incrementCounter("bytes_sent", dataStr.length);
    const base64data = base64Encode(dataStr);
    const dataSegs = splitStringBySize(base64data, MAX_PAYLOAD_SIZE);
    for (let i = 0; i < dataSegs.length; i++) {
      this.scriptTagHolder.enqueueSegment(this.curSegmentNum, dataSegs.length, dataSegs[i]);
      this.curSegmentNum++;
    }
  }
  /**
   * This is how we notify the server that we're leaving.
   * We aren't able to send requests with DHTML on a window close event, but we can
   * trigger XHR requests in some browsers (everything but Opera basically).
   */
  addDisconnectPingFrame(id, pw) {
    if (isNodeSdk()) {
      return;
    }
    this.myDisconnFrame = document.createElement("iframe");
    const urlParams = {};
    urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM] = "t";
    urlParams[FIREBASE_LONGPOLL_ID_PARAM] = id;
    urlParams[FIREBASE_LONGPOLL_PW_PARAM] = pw;
    this.myDisconnFrame.src = this.urlFn(urlParams);
    this.myDisconnFrame.style.display = "none";
    document.body.appendChild(this.myDisconnFrame);
  }
  /**
   * Used to track the bytes received by this client
   */
  incrementIncomingBytes_(args) {
    const bytesReceived = stringify(args).length;
    this.bytesReceived += bytesReceived;
    this.stats_.incrementCounter("bytes_received", bytesReceived);
  }
};
var FirebaseIFrameScriptHolder = class _FirebaseIFrameScriptHolder {
  /**
   * @param commandCB - The callback to be called when control commands are recevied from the server.
   * @param onMessageCB - The callback to be triggered when responses arrive from the server.
   * @param onDisconnect - The callback to be triggered when this tag holder is closed
   * @param urlFn - A function that provides the URL of the endpoint to send data to.
   */
  constructor(commandCB, onMessageCB, onDisconnect3, urlFn) {
    this.onDisconnect = onDisconnect3;
    this.urlFn = urlFn;
    this.outstandingRequests = /* @__PURE__ */ new Set();
    this.pendingSegs = [];
    this.currentSerial = Math.floor(Math.random() * 1e8);
    this.sendNewPolls = true;
    if (!isNodeSdk()) {
      this.uniqueCallbackIdentifier = LUIDGenerator();
      window[FIREBASE_LONGPOLL_COMMAND_CB_NAME + this.uniqueCallbackIdentifier] = commandCB;
      window[FIREBASE_LONGPOLL_DATA_CB_NAME + this.uniqueCallbackIdentifier] = onMessageCB;
      this.myIFrame = _FirebaseIFrameScriptHolder.createIFrame_();
      let script = "";
      if (this.myIFrame.src && this.myIFrame.src.substr(0, "javascript:".length) === "javascript:") {
        const currentDomain = document.domain;
        script = '<script>document.domain="' + currentDomain + '";</script>';
      }
      const iframeContents = "<html><body>" + script + "</body></html>";
      try {
        this.myIFrame.doc.open();
        this.myIFrame.doc.write(iframeContents);
        this.myIFrame.doc.close();
      } catch (e) {
        log("frame writing exception");
        if (e.stack) {
          log(e.stack);
        }
        log(e);
      }
    } else {
      this.commandCB = commandCB;
      this.onMessageCB = onMessageCB;
    }
  }
  /**
   * Each browser has its own funny way to handle iframes. Here we mush them all together into one object that I can
   * actually use.
   */
  static createIFrame_() {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    if (document.body) {
      document.body.appendChild(iframe);
      try {
        const a = iframe.contentWindow.document;
        if (!a) {
          log("No IE domain setting required");
        }
      } catch (e) {
        const domain = document.domain;
        iframe.src = "javascript:void((function(){document.open();document.domain='" + domain + "';document.close();})())";
      }
    } else {
      throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
    }
    if (iframe.contentDocument) {
      iframe.doc = iframe.contentDocument;
    } else if (iframe.contentWindow) {
      iframe.doc = iframe.contentWindow.document;
    } else if (iframe.document) {
      iframe.doc = iframe.document;
    }
    return iframe;
  }
  /**
   * Cancel all outstanding queries and remove the frame.
   */
  close() {
    this.alive = false;
    if (this.myIFrame) {
      this.myIFrame.doc.body.textContent = "";
      setTimeout(() => {
        if (this.myIFrame !== null) {
          document.body.removeChild(this.myIFrame);
          this.myIFrame = null;
        }
      }, Math.floor(0));
    }
    const onDisconnect3 = this.onDisconnect;
    if (onDisconnect3) {
      this.onDisconnect = null;
      onDisconnect3();
    }
  }
  /**
   * Actually start the long-polling session by adding the first script tag(s) to the iframe.
   * @param id - The ID of this connection
   * @param pw - The password for this connection
   */
  startLongPoll(id, pw) {
    this.myID = id;
    this.myPW = pw;
    this.alive = true;
    while (this.newRequest_()) {
    }
  }
  /**
   * This is called any time someone might want a script tag to be added. It adds a script tag when there aren't
   * too many outstanding requests and we are still alive.
   *
   * If there are outstanding packet segments to send, it sends one. If there aren't, it sends a long-poll anyways if
   * needed.
   */
  newRequest_() {
    if (this.alive && this.sendNewPolls && this.outstandingRequests.size < (this.pendingSegs.length > 0 ? 2 : 1)) {
      this.currentSerial++;
      const urlParams = {};
      urlParams[FIREBASE_LONGPOLL_ID_PARAM] = this.myID;
      urlParams[FIREBASE_LONGPOLL_PW_PARAM] = this.myPW;
      urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = this.currentSerial;
      let theURL = this.urlFn(urlParams);
      let curDataString = "";
      let i = 0;
      while (this.pendingSegs.length > 0) {
        const nextSeg = this.pendingSegs[0];
        if (nextSeg.d.length + SEG_HEADER_SIZE + curDataString.length <= MAX_URL_DATA_SIZE) {
          const theSeg = this.pendingSegs.shift();
          curDataString = curDataString + "&" + FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM + i + "=" + theSeg.seg + "&" + FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET + i + "=" + theSeg.ts + "&" + FIREBASE_LONGPOLL_DATA_PARAM + i + "=" + theSeg.d;
          i++;
        } else {
          break;
        }
      }
      theURL = theURL + curDataString;
      this.addLongPollTag_(theURL, this.currentSerial);
      return true;
    } else {
      return false;
    }
  }
  /**
   * Queue a packet for transmission to the server.
   * @param segnum - A sequential id for this packet segment used for reassembly
   * @param totalsegs - The total number of segments in this packet
   * @param data - The data for this segment.
   */
  enqueueSegment(segnum, totalsegs, data) {
    this.pendingSegs.push({
      seg: segnum,
      ts: totalsegs,
      d: data
    });
    if (this.alive) {
      this.newRequest_();
    }
  }
  /**
   * Add a script tag for a regular long-poll request.
   * @param url - The URL of the script tag.
   * @param serial - The serial number of the request.
   */
  addLongPollTag_(url, serial) {
    this.outstandingRequests.add(serial);
    const doNewRequest = () => {
      this.outstandingRequests.delete(serial);
      this.newRequest_();
    };
    const keepaliveTimeout = setTimeout(doNewRequest, Math.floor(KEEPALIVE_REQUEST_INTERVAL));
    const readyStateCB = () => {
      clearTimeout(keepaliveTimeout);
      doNewRequest();
    };
    this.addTag(url, readyStateCB);
  }
  /**
   * Add an arbitrary script tag to the iframe.
   * @param url - The URL for the script tag source.
   * @param loadCB - A callback to be triggered once the script has loaded.
   */
  addTag(url, loadCB) {
    if (isNodeSdk()) {
      this.doNodeLongPoll(url, loadCB);
    } else {
      setTimeout(() => {
        try {
          if (!this.sendNewPolls) {
            return;
          }
          const newScript = this.myIFrame.doc.createElement("script");
          newScript.type = "text/javascript";
          newScript.async = true;
          newScript.src = url;
          newScript.onload = newScript.onreadystatechange = function() {
            const rstate = newScript.readyState;
            if (!rstate || rstate === "loaded" || rstate === "complete") {
              newScript.onload = newScript.onreadystatechange = null;
              if (newScript.parentNode) {
                newScript.parentNode.removeChild(newScript);
              }
              loadCB();
            }
          };
          newScript.onerror = () => {
            log("Long-poll script failed to load: " + url);
            this.sendNewPolls = false;
            this.close();
          };
          this.myIFrame.doc.body.appendChild(newScript);
        } catch (e) {
        }
      }, Math.floor(1));
    }
  }
};
var TransportManager = class _TransportManager {
  /**
   * @param repoInfo - Metadata around the namespace we're connecting to
   */
  constructor(repoInfo) {
    this.initTransports_(repoInfo);
  }
  static get ALL_TRANSPORTS() {
    return [BrowserPollConnection, WebSocketConnection];
  }
  /**
   * Returns whether transport has been selected to ensure WebSocketConnection or BrowserPollConnection are not called after
   * TransportManager has already set up transports_
   */
  static get IS_TRANSPORT_INITIALIZED() {
    return this.globalTransportInitialized_;
  }
  initTransports_(repoInfo) {
    const isWebSocketsAvailable = WebSocketConnection && WebSocketConnection["isAvailable"]();
    let isSkipPollConnection = isWebSocketsAvailable && !WebSocketConnection.previouslyFailed();
    if (repoInfo.webSocketOnly) {
      if (!isWebSocketsAvailable) {
        warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway.");
      }
      isSkipPollConnection = true;
    }
    if (isSkipPollConnection) {
      this.transports_ = [WebSocketConnection];
    } else {
      const transports = this.transports_ = [];
      for (const transport of _TransportManager.ALL_TRANSPORTS) {
        if (transport && transport["isAvailable"]()) {
          transports.push(transport);
        }
      }
      _TransportManager.globalTransportInitialized_ = true;
    }
  }
  /**
   * @returns The constructor for the initial transport to use
   */
  initialTransport() {
    if (this.transports_.length > 0) {
      return this.transports_[0];
    } else {
      throw new Error("No transports available");
    }
  }
  /**
   * @returns The constructor for the next transport, or null
   */
  upgradeTransport() {
    if (this.transports_.length > 1) {
      return this.transports_[1];
    } else {
      return null;
    }
  }
};
TransportManager.globalTransportInitialized_ = false;
var UPGRADE_TIMEOUT = 6e4;
var DELAY_BEFORE_SENDING_EXTRA_REQUESTS = 5e3;
var BYTES_SENT_HEALTHY_OVERRIDE = 10 * 1024;
var BYTES_RECEIVED_HEALTHY_OVERRIDE = 100 * 1024;
var MESSAGE_TYPE = "t";
var MESSAGE_DATA = "d";
var CONTROL_SHUTDOWN = "s";
var CONTROL_RESET = "r";
var CONTROL_ERROR = "e";
var CONTROL_PONG = "o";
var SWITCH_ACK = "a";
var END_TRANSMISSION = "n";
var PING = "p";
var SERVER_HELLO = "h";
var Connection = class {
  /**
   * @param id - an id for this connection
   * @param repoInfo_ - the info for the endpoint to connect to
   * @param applicationId_ - the Firebase App ID for this project
   * @param appCheckToken_ - The App Check Token for this device.
   * @param authToken_ - The auth token for this session.
   * @param onMessage_ - the callback to be triggered when a server-push message arrives
   * @param onReady_ - the callback to be triggered when this connection is ready to send messages.
   * @param onDisconnect_ - the callback to be triggered when a connection was lost
   * @param onKill_ - the callback to be triggered when this connection has permanently shut down.
   * @param lastSessionId - last session id in persistent connection. is used to clean up old session in real-time server
   */
  constructor(id, repoInfo_, applicationId_, appCheckToken_, authToken_, onMessage_, onReady_, onDisconnect_, onKill_, lastSessionId) {
    this.id = id;
    this.repoInfo_ = repoInfo_;
    this.applicationId_ = applicationId_;
    this.appCheckToken_ = appCheckToken_;
    this.authToken_ = authToken_;
    this.onMessage_ = onMessage_;
    this.onReady_ = onReady_;
    this.onDisconnect_ = onDisconnect_;
    this.onKill_ = onKill_;
    this.lastSessionId = lastSessionId;
    this.connectionCount = 0;
    this.pendingDataMessages = [];
    this.state_ = 0;
    this.log_ = logWrapper("c:" + this.id + ":");
    this.transportManager_ = new TransportManager(repoInfo_);
    this.log_("Connection created");
    this.start_();
  }
  /**
   * Starts a connection attempt
   */
  start_() {
    const conn = this.transportManager_.initialTransport();
    this.conn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, null, this.lastSessionId);
    this.primaryResponsesRequired_ = conn["responsesRequiredToBeHealthy"] || 0;
    const onMessageReceived = this.connReceiver_(this.conn_);
    const onConnectionLost = this.disconnReceiver_(this.conn_);
    this.tx_ = this.conn_;
    this.rx_ = this.conn_;
    this.secondaryConn_ = null;
    this.isHealthy_ = false;
    setTimeout(() => {
      this.conn_ && this.conn_.open(onMessageReceived, onConnectionLost);
    }, Math.floor(0));
    const healthyTimeoutMS = conn["healthyTimeout"] || 0;
    if (healthyTimeoutMS > 0) {
      this.healthyTimeout_ = setTimeoutNonBlocking(() => {
        this.healthyTimeout_ = null;
        if (!this.isHealthy_) {
          if (this.conn_ && this.conn_.bytesReceived > BYTES_RECEIVED_HEALTHY_OVERRIDE) {
            this.log_("Connection exceeded healthy timeout but has received " + this.conn_.bytesReceived + " bytes.  Marking connection healthy.");
            this.isHealthy_ = true;
            this.conn_.markConnectionHealthy();
          } else if (this.conn_ && this.conn_.bytesSent > BYTES_SENT_HEALTHY_OVERRIDE) {
            this.log_("Connection exceeded healthy timeout but has sent " + this.conn_.bytesSent + " bytes.  Leaving connection alive.");
          } else {
            this.log_("Closing unhealthy connection after timeout.");
            this.close();
          }
        }
      }, Math.floor(healthyTimeoutMS));
    }
  }
  nextTransportId_() {
    return "c:" + this.id + ":" + this.connectionCount++;
  }
  disconnReceiver_(conn) {
    return (everConnected) => {
      if (conn === this.conn_) {
        this.onConnectionLost_(everConnected);
      } else if (conn === this.secondaryConn_) {
        this.log_("Secondary connection lost.");
        this.onSecondaryConnectionLost_();
      } else {
        this.log_("closing an old connection");
      }
    };
  }
  connReceiver_(conn) {
    return (message) => {
      if (this.state_ !== 2) {
        if (conn === this.rx_) {
          this.onPrimaryMessageReceived_(message);
        } else if (conn === this.secondaryConn_) {
          this.onSecondaryMessageReceived_(message);
        } else {
          this.log_("message on old connection");
        }
      }
    };
  }
  /**
   * @param dataMsg - An arbitrary data message to be sent to the server
   */
  sendRequest(dataMsg) {
    const msg = {
      t: "d",
      d: dataMsg
    };
    this.sendData_(msg);
  }
  tryCleanupConnection() {
    if (this.tx_ === this.secondaryConn_ && this.rx_ === this.secondaryConn_) {
      this.log_("cleaning up and promoting a connection: " + this.secondaryConn_.connId);
      this.conn_ = this.secondaryConn_;
      this.secondaryConn_ = null;
    }
  }
  onSecondaryControl_(controlData) {
    if (MESSAGE_TYPE in controlData) {
      const cmd = controlData[MESSAGE_TYPE];
      if (cmd === SWITCH_ACK) {
        this.upgradeIfSecondaryHealthy_();
      } else if (cmd === CONTROL_RESET) {
        this.log_("Got a reset on secondary, closing it");
        this.secondaryConn_.close();
        if (this.tx_ === this.secondaryConn_ || this.rx_ === this.secondaryConn_) {
          this.close();
        }
      } else if (cmd === CONTROL_PONG) {
        this.log_("got pong on secondary.");
        this.secondaryResponsesRequired_--;
        this.upgradeIfSecondaryHealthy_();
      }
    }
  }
  onSecondaryMessageReceived_(parsedData) {
    const layer = requireKey("t", parsedData);
    const data = requireKey("d", parsedData);
    if (layer === "c") {
      this.onSecondaryControl_(data);
    } else if (layer === "d") {
      this.pendingDataMessages.push(data);
    } else {
      throw new Error("Unknown protocol layer: " + layer);
    }
  }
  upgradeIfSecondaryHealthy_() {
    if (this.secondaryResponsesRequired_ <= 0) {
      this.log_("Secondary connection is healthy.");
      this.isHealthy_ = true;
      this.secondaryConn_.markConnectionHealthy();
      this.proceedWithUpgrade_();
    } else {
      this.log_("sending ping on secondary.");
      this.secondaryConn_.send({
        t: "c",
        d: {
          t: PING,
          d: {}
        }
      });
    }
  }
  proceedWithUpgrade_() {
    this.secondaryConn_.start();
    this.log_("sending client ack on secondary");
    this.secondaryConn_.send({
      t: "c",
      d: {
        t: SWITCH_ACK,
        d: {}
      }
    });
    this.log_("Ending transmission on primary");
    this.conn_.send({
      t: "c",
      d: {
        t: END_TRANSMISSION,
        d: {}
      }
    });
    this.tx_ = this.secondaryConn_;
    this.tryCleanupConnection();
  }
  onPrimaryMessageReceived_(parsedData) {
    const layer = requireKey("t", parsedData);
    const data = requireKey("d", parsedData);
    if (layer === "c") {
      this.onControl_(data);
    } else if (layer === "d") {
      this.onDataMessage_(data);
    }
  }
  onDataMessage_(message) {
    this.onPrimaryResponse_();
    this.onMessage_(message);
  }
  onPrimaryResponse_() {
    if (!this.isHealthy_) {
      this.primaryResponsesRequired_--;
      if (this.primaryResponsesRequired_ <= 0) {
        this.log_("Primary connection is healthy.");
        this.isHealthy_ = true;
        this.conn_.markConnectionHealthy();
      }
    }
  }
  onControl_(controlData) {
    const cmd = requireKey(MESSAGE_TYPE, controlData);
    if (MESSAGE_DATA in controlData) {
      const payload = controlData[MESSAGE_DATA];
      if (cmd === SERVER_HELLO) {
        const handshakePayload = Object.assign({}, payload);
        if (this.repoInfo_.isUsingEmulator) {
          handshakePayload.h = this.repoInfo_.host;
        }
        this.onHandshake_(handshakePayload);
      } else if (cmd === END_TRANSMISSION) {
        this.log_("recvd end transmission on primary");
        this.rx_ = this.secondaryConn_;
        for (let i = 0; i < this.pendingDataMessages.length; ++i) {
          this.onDataMessage_(this.pendingDataMessages[i]);
        }
        this.pendingDataMessages = [];
        this.tryCleanupConnection();
      } else if (cmd === CONTROL_SHUTDOWN) {
        this.onConnectionShutdown_(payload);
      } else if (cmd === CONTROL_RESET) {
        this.onReset_(payload);
      } else if (cmd === CONTROL_ERROR) {
        error("Server Error: " + payload);
      } else if (cmd === CONTROL_PONG) {
        this.log_("got pong on primary.");
        this.onPrimaryResponse_();
        this.sendPingOnPrimaryIfNecessary_();
      } else {
        error("Unknown control packet command: " + cmd);
      }
    }
  }
  /**
   * @param handshake - The handshake data returned from the server
   */
  onHandshake_(handshake) {
    const timestamp = handshake.ts;
    const version2 = handshake.v;
    const host = handshake.h;
    this.sessionId = handshake.s;
    this.repoInfo_.host = host;
    if (this.state_ === 0) {
      this.conn_.start();
      this.onConnectionEstablished_(this.conn_, timestamp);
      if (PROTOCOL_VERSION !== version2) {
        warn("Protocol version mismatch detected");
      }
      this.tryStartUpgrade_();
    }
  }
  tryStartUpgrade_() {
    const conn = this.transportManager_.upgradeTransport();
    if (conn) {
      this.startUpgrade_(conn);
    }
  }
  startUpgrade_(conn) {
    this.secondaryConn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, this.sessionId);
    this.secondaryResponsesRequired_ = conn["responsesRequiredToBeHealthy"] || 0;
    const onMessage = this.connReceiver_(this.secondaryConn_);
    const onDisconnect3 = this.disconnReceiver_(this.secondaryConn_);
    this.secondaryConn_.open(onMessage, onDisconnect3);
    setTimeoutNonBlocking(() => {
      if (this.secondaryConn_) {
        this.log_("Timed out trying to upgrade.");
        this.secondaryConn_.close();
      }
    }, Math.floor(UPGRADE_TIMEOUT));
  }
  onReset_(host) {
    this.log_("Reset packet received.  New host: " + host);
    this.repoInfo_.host = host;
    if (this.state_ === 1) {
      this.close();
    } else {
      this.closeConnections_();
      this.start_();
    }
  }
  onConnectionEstablished_(conn, timestamp) {
    this.log_("Realtime connection established.");
    this.conn_ = conn;
    this.state_ = 1;
    if (this.onReady_) {
      this.onReady_(timestamp, this.sessionId);
      this.onReady_ = null;
    }
    if (this.primaryResponsesRequired_ === 0) {
      this.log_("Primary connection is healthy.");
      this.isHealthy_ = true;
    } else {
      setTimeoutNonBlocking(() => {
        this.sendPingOnPrimaryIfNecessary_();
      }, Math.floor(DELAY_BEFORE_SENDING_EXTRA_REQUESTS));
    }
  }
  sendPingOnPrimaryIfNecessary_() {
    if (!this.isHealthy_ && this.state_ === 1) {
      this.log_("sending ping on primary.");
      this.sendData_({
        t: "c",
        d: {
          t: PING,
          d: {}
        }
      });
    }
  }
  onSecondaryConnectionLost_() {
    const conn = this.secondaryConn_;
    this.secondaryConn_ = null;
    if (this.tx_ === conn || this.rx_ === conn) {
      this.close();
    }
  }
  /**
   * @param everConnected - Whether or not the connection ever reached a server. Used to determine if
   * we should flush the host cache
   */
  onConnectionLost_(everConnected) {
    this.conn_ = null;
    if (!everConnected && this.state_ === 0) {
      this.log_("Realtime connection failed.");
      if (this.repoInfo_.isCacheableHost()) {
        PersistentStorage.remove("host:" + this.repoInfo_.host);
        this.repoInfo_.internalHost = this.repoInfo_.host;
      }
    } else if (this.state_ === 1) {
      this.log_("Realtime connection lost.");
    }
    this.close();
  }
  onConnectionShutdown_(reason) {
    this.log_("Connection shutdown command received. Shutting down...");
    if (this.onKill_) {
      this.onKill_(reason);
      this.onKill_ = null;
    }
    this.onDisconnect_ = null;
    this.close();
  }
  sendData_(data) {
    if (this.state_ !== 1) {
      throw "Connection is not connected";
    } else {
      this.tx_.send(data);
    }
  }
  /**
   * Cleans up this connection, calling the appropriate callbacks
   */
  close() {
    if (this.state_ !== 2) {
      this.log_("Closing realtime connection.");
      this.state_ = 2;
      this.closeConnections_();
      if (this.onDisconnect_) {
        this.onDisconnect_();
        this.onDisconnect_ = null;
      }
    }
  }
  closeConnections_() {
    this.log_("Shutting down all connections");
    if (this.conn_) {
      this.conn_.close();
      this.conn_ = null;
    }
    if (this.secondaryConn_) {
      this.secondaryConn_.close();
      this.secondaryConn_ = null;
    }
    if (this.healthyTimeout_) {
      clearTimeout(this.healthyTimeout_);
      this.healthyTimeout_ = null;
    }
  }
};
var ServerActions = class {
  put(pathString, data, onComplete, hash) {
  }
  merge(pathString, data, onComplete, hash) {
  }
  /**
   * Refreshes the auth token for the current connection.
   * @param token - The authentication token
   */
  refreshAuthToken(token) {
  }
  /**
   * Refreshes the app check token for the current connection.
   * @param token The app check token
   */
  refreshAppCheckToken(token) {
  }
  onDisconnectPut(pathString, data, onComplete) {
  }
  onDisconnectMerge(pathString, data, onComplete) {
  }
  onDisconnectCancel(pathString, onComplete) {
  }
  reportStats(stats) {
  }
};
var EventEmitter = class {
  constructor(allowedEvents_) {
    this.allowedEvents_ = allowedEvents_;
    this.listeners_ = {};
    assert(Array.isArray(allowedEvents_) && allowedEvents_.length > 0, "Requires a non-empty array");
  }
  /**
   * To be called by derived classes to trigger events.
   */
  trigger(eventType, ...varArgs) {
    if (Array.isArray(this.listeners_[eventType])) {
      const listeners = [...this.listeners_[eventType]];
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].callback.apply(listeners[i].context, varArgs);
      }
    }
  }
  on(eventType, callback, context) {
    this.validateEventType_(eventType);
    this.listeners_[eventType] = this.listeners_[eventType] || [];
    this.listeners_[eventType].push({
      callback,
      context
    });
    const eventData = this.getInitialEvent(eventType);
    if (eventData) {
      callback.apply(context, eventData);
    }
  }
  off(eventType, callback, context) {
    this.validateEventType_(eventType);
    const listeners = this.listeners_[eventType] || [];
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].callback === callback && (!context || context === listeners[i].context)) {
        listeners.splice(i, 1);
        return;
      }
    }
  }
  validateEventType_(eventType) {
    assert(this.allowedEvents_.find((et) => {
      return et === eventType;
    }), "Unknown event: " + eventType);
  }
};
var OnlineMonitor = class _OnlineMonitor extends EventEmitter {
  constructor() {
    super(["online"]);
    this.online_ = true;
    if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined" && !isMobileCordova()) {
      window.addEventListener("online", () => {
        if (!this.online_) {
          this.online_ = true;
          this.trigger("online", true);
        }
      }, false);
      window.addEventListener("offline", () => {
        if (this.online_) {
          this.online_ = false;
          this.trigger("online", false);
        }
      }, false);
    }
  }
  static getInstance() {
    return new _OnlineMonitor();
  }
  getInitialEvent(eventType) {
    assert(eventType === "online", "Unknown event type: " + eventType);
    return [this.online_];
  }
  currentlyOnline() {
    return this.online_;
  }
};
var MAX_PATH_DEPTH = 32;
var MAX_PATH_LENGTH_BYTES = 768;
var Path = class {
  /**
   * @param pathOrString - Path string to parse, or another path, or the raw
   * tokens array
   */
  constructor(pathOrString, pieceNum) {
    if (pieceNum === void 0) {
      this.pieces_ = pathOrString.split("/");
      let copyTo = 0;
      for (let i = 0; i < this.pieces_.length; i++) {
        if (this.pieces_[i].length > 0) {
          this.pieces_[copyTo] = this.pieces_[i];
          copyTo++;
        }
      }
      this.pieces_.length = copyTo;
      this.pieceNum_ = 0;
    } else {
      this.pieces_ = pathOrString;
      this.pieceNum_ = pieceNum;
    }
  }
  toString() {
    let pathString = "";
    for (let i = this.pieceNum_; i < this.pieces_.length; i++) {
      if (this.pieces_[i] !== "") {
        pathString += "/" + this.pieces_[i];
      }
    }
    return pathString || "/";
  }
};
function newEmptyPath() {
  return new Path("");
}
function pathGetFront(path) {
  if (path.pieceNum_ >= path.pieces_.length) {
    return null;
  }
  return path.pieces_[path.pieceNum_];
}
function pathGetLength(path) {
  return path.pieces_.length - path.pieceNum_;
}
function pathPopFront(path) {
  let pieceNum = path.pieceNum_;
  if (pieceNum < path.pieces_.length) {
    pieceNum++;
  }
  return new Path(path.pieces_, pieceNum);
}
function pathGetBack(path) {
  if (path.pieceNum_ < path.pieces_.length) {
    return path.pieces_[path.pieces_.length - 1];
  }
  return null;
}
function pathToUrlEncodedString(path) {
  let pathString = "";
  for (let i = path.pieceNum_; i < path.pieces_.length; i++) {
    if (path.pieces_[i] !== "") {
      pathString += "/" + encodeURIComponent(String(path.pieces_[i]));
    }
  }
  return pathString || "/";
}
function pathSlice(path, begin = 0) {
  return path.pieces_.slice(path.pieceNum_ + begin);
}
function pathParent(path) {
  if (path.pieceNum_ >= path.pieces_.length) {
    return null;
  }
  const pieces = [];
  for (let i = path.pieceNum_; i < path.pieces_.length - 1; i++) {
    pieces.push(path.pieces_[i]);
  }
  return new Path(pieces, 0);
}
function pathChild(path, childPathObj) {
  const pieces = [];
  for (let i = path.pieceNum_; i < path.pieces_.length; i++) {
    pieces.push(path.pieces_[i]);
  }
  if (childPathObj instanceof Path) {
    for (let i = childPathObj.pieceNum_; i < childPathObj.pieces_.length; i++) {
      pieces.push(childPathObj.pieces_[i]);
    }
  } else {
    const childPieces = childPathObj.split("/");
    for (let i = 0; i < childPieces.length; i++) {
      if (childPieces[i].length > 0) {
        pieces.push(childPieces[i]);
      }
    }
  }
  return new Path(pieces, 0);
}
function pathIsEmpty(path) {
  return path.pieceNum_ >= path.pieces_.length;
}
function newRelativePath(outerPath, innerPath) {
  const outer = pathGetFront(outerPath), inner = pathGetFront(innerPath);
  if (outer === null) {
    return innerPath;
  } else if (outer === inner) {
    return newRelativePath(pathPopFront(outerPath), pathPopFront(innerPath));
  } else {
    throw new Error("INTERNAL ERROR: innerPath (" + innerPath + ") is not within outerPath (" + outerPath + ")");
  }
}
function pathCompare(left, right) {
  const leftKeys = pathSlice(left, 0);
  const rightKeys = pathSlice(right, 0);
  for (let i = 0; i < leftKeys.length && i < rightKeys.length; i++) {
    const cmp = nameCompare(leftKeys[i], rightKeys[i]);
    if (cmp !== 0) {
      return cmp;
    }
  }
  if (leftKeys.length === rightKeys.length) {
    return 0;
  }
  return leftKeys.length < rightKeys.length ? -1 : 1;
}
function pathEquals(path, other) {
  if (pathGetLength(path) !== pathGetLength(other)) {
    return false;
  }
  for (let i = path.pieceNum_, j = other.pieceNum_; i <= path.pieces_.length; i++, j++) {
    if (path.pieces_[i] !== other.pieces_[j]) {
      return false;
    }
  }
  return true;
}
function pathContains(path, other) {
  let i = path.pieceNum_;
  let j = other.pieceNum_;
  if (pathGetLength(path) > pathGetLength(other)) {
    return false;
  }
  while (i < path.pieces_.length) {
    if (path.pieces_[i] !== other.pieces_[j]) {
      return false;
    }
    ++i;
    ++j;
  }
  return true;
}
var ValidationPath = class {
  /**
   * @param path - Initial Path.
   * @param errorPrefix_ - Prefix for any error messages.
   */
  constructor(path, errorPrefix_) {
    this.errorPrefix_ = errorPrefix_;
    this.parts_ = pathSlice(path, 0);
    this.byteLength_ = Math.max(1, this.parts_.length);
    for (let i = 0; i < this.parts_.length; i++) {
      this.byteLength_ += stringLength(this.parts_[i]);
    }
    validationPathCheckValid(this);
  }
};
function validationPathPush(validationPath, child3) {
  if (validationPath.parts_.length > 0) {
    validationPath.byteLength_ += 1;
  }
  validationPath.parts_.push(child3);
  validationPath.byteLength_ += stringLength(child3);
  validationPathCheckValid(validationPath);
}
function validationPathPop(validationPath) {
  const last = validationPath.parts_.pop();
  validationPath.byteLength_ -= stringLength(last);
  if (validationPath.parts_.length > 0) {
    validationPath.byteLength_ -= 1;
  }
}
function validationPathCheckValid(validationPath) {
  if (validationPath.byteLength_ > MAX_PATH_LENGTH_BYTES) {
    throw new Error(validationPath.errorPrefix_ + "has a key path longer than " + MAX_PATH_LENGTH_BYTES + " bytes (" + validationPath.byteLength_ + ").");
  }
  if (validationPath.parts_.length > MAX_PATH_DEPTH) {
    throw new Error(validationPath.errorPrefix_ + "path specified exceeds the maximum depth that can be written (" + MAX_PATH_DEPTH + ") or object contains a cycle " + validationPathToErrorString(validationPath));
  }
}
function validationPathToErrorString(validationPath) {
  if (validationPath.parts_.length === 0) {
    return "";
  }
  return "in property '" + validationPath.parts_.join(".") + "'";
}
var VisibilityMonitor = class _VisibilityMonitor extends EventEmitter {
  constructor() {
    super(["visible"]);
    let hidden;
    let visibilityChange;
    if (typeof document !== "undefined" && typeof document.addEventListener !== "undefined") {
      if (typeof document["hidden"] !== "undefined") {
        visibilityChange = "visibilitychange";
        hidden = "hidden";
      } else if (typeof document["mozHidden"] !== "undefined") {
        visibilityChange = "mozvisibilitychange";
        hidden = "mozHidden";
      } else if (typeof document["msHidden"] !== "undefined") {
        visibilityChange = "msvisibilitychange";
        hidden = "msHidden";
      } else if (typeof document["webkitHidden"] !== "undefined") {
        visibilityChange = "webkitvisibilitychange";
        hidden = "webkitHidden";
      }
    }
    this.visible_ = true;
    if (visibilityChange) {
      document.addEventListener(visibilityChange, () => {
        const visible = !document[hidden];
        if (visible !== this.visible_) {
          this.visible_ = visible;
          this.trigger("visible", visible);
        }
      }, false);
    }
  }
  static getInstance() {
    return new _VisibilityMonitor();
  }
  getInitialEvent(eventType) {
    assert(eventType === "visible", "Unknown event type: " + eventType);
    return [this.visible_];
  }
};
var RECONNECT_MIN_DELAY = 1e3;
var RECONNECT_MAX_DELAY_DEFAULT = 60 * 5 * 1e3;
var RECONNECT_MAX_DELAY_FOR_ADMINS = 30 * 1e3;
var RECONNECT_DELAY_MULTIPLIER = 1.3;
var RECONNECT_DELAY_RESET_TIMEOUT = 3e4;
var SERVER_KILL_INTERRUPT_REASON = "server_kill";
var INVALID_TOKEN_THRESHOLD = 3;
var PersistentConnection = class _PersistentConnection extends ServerActions {
  /**
   * @param repoInfo_ - Data about the namespace we are connecting to
   * @param applicationId_ - The Firebase App ID for this project
   * @param onDataUpdate_ - A callback for new data from the server
   */
  constructor(repoInfo_, applicationId_, onDataUpdate_, onConnectStatus_, onServerInfoUpdate_, authTokenProvider_, appCheckTokenProvider_, authOverride_) {
    super();
    this.repoInfo_ = repoInfo_;
    this.applicationId_ = applicationId_;
    this.onDataUpdate_ = onDataUpdate_;
    this.onConnectStatus_ = onConnectStatus_;
    this.onServerInfoUpdate_ = onServerInfoUpdate_;
    this.authTokenProvider_ = authTokenProvider_;
    this.appCheckTokenProvider_ = appCheckTokenProvider_;
    this.authOverride_ = authOverride_;
    this.id = _PersistentConnection.nextPersistentConnectionId_++;
    this.log_ = logWrapper("p:" + this.id + ":");
    this.interruptReasons_ = {};
    this.listens = /* @__PURE__ */ new Map();
    this.outstandingPuts_ = [];
    this.outstandingGets_ = [];
    this.outstandingPutCount_ = 0;
    this.outstandingGetCount_ = 0;
    this.onDisconnectRequestQueue_ = [];
    this.connected_ = false;
    this.reconnectDelay_ = RECONNECT_MIN_DELAY;
    this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_DEFAULT;
    this.securityDebugCallback_ = null;
    this.lastSessionId = null;
    this.establishConnectionTimer_ = null;
    this.visible_ = false;
    this.requestCBHash_ = {};
    this.requestNumber_ = 0;
    this.realtime_ = null;
    this.authToken_ = null;
    this.appCheckToken_ = null;
    this.forceTokenRefresh_ = false;
    this.invalidAuthTokenCount_ = 0;
    this.invalidAppCheckTokenCount_ = 0;
    this.firstConnection_ = true;
    this.lastConnectionAttemptTime_ = null;
    this.lastConnectionEstablishedTime_ = null;
    if (authOverride_ && !isNodeSdk()) {
      throw new Error("Auth override specified in options, but not supported on non Node.js platforms");
    }
    VisibilityMonitor.getInstance().on("visible", this.onVisible_, this);
    if (repoInfo_.host.indexOf("fblocal") === -1) {
      OnlineMonitor.getInstance().on("online", this.onOnline_, this);
    }
  }
  sendRequest(action, body, onResponse) {
    const curReqNum = ++this.requestNumber_;
    const msg = {
      r: curReqNum,
      a: action,
      b: body
    };
    this.log_(stringify(msg));
    assert(this.connected_, "sendRequest call when we're not connected not allowed.");
    this.realtime_.sendRequest(msg);
    if (onResponse) {
      this.requestCBHash_[curReqNum] = onResponse;
    }
  }
  get(query3) {
    this.initConnection_();
    const deferred = new Deferred();
    const request = {
      p: query3._path.toString(),
      q: query3._queryObject
    };
    const outstandingGet = {
      action: "g",
      request,
      onComplete: (message) => {
        const payload = message["d"];
        if (message["s"] === "ok") {
          deferred.resolve(payload);
        } else {
          deferred.reject(payload);
        }
      }
    };
    this.outstandingGets_.push(outstandingGet);
    this.outstandingGetCount_++;
    const index = this.outstandingGets_.length - 1;
    if (this.connected_) {
      this.sendGet_(index);
    }
    return deferred.promise;
  }
  listen(query3, currentHashFn, tag, onComplete) {
    this.initConnection_();
    const queryId = query3._queryIdentifier;
    const pathString = query3._path.toString();
    this.log_("Listen called for " + pathString + " " + queryId);
    if (!this.listens.has(pathString)) {
      this.listens.set(pathString, /* @__PURE__ */ new Map());
    }
    assert(query3._queryParams.isDefault() || !query3._queryParams.loadsAllData(), "listen() called for non-default but complete query");
    assert(!this.listens.get(pathString).has(queryId), `listen() called twice for same path/queryId.`);
    const listenSpec = {
      onComplete,
      hashFn: currentHashFn,
      query: query3,
      tag
    };
    this.listens.get(pathString).set(queryId, listenSpec);
    if (this.connected_) {
      this.sendListen_(listenSpec);
    }
  }
  sendGet_(index) {
    const get4 = this.outstandingGets_[index];
    this.sendRequest("g", get4.request, (message) => {
      delete this.outstandingGets_[index];
      this.outstandingGetCount_--;
      if (this.outstandingGetCount_ === 0) {
        this.outstandingGets_ = [];
      }
      if (get4.onComplete) {
        get4.onComplete(message);
      }
    });
  }
  sendListen_(listenSpec) {
    const query3 = listenSpec.query;
    const pathString = query3._path.toString();
    const queryId = query3._queryIdentifier;
    this.log_("Listen on " + pathString + " for " + queryId);
    const req = {
      /*path*/
      p: pathString
    };
    const action = "q";
    if (listenSpec.tag) {
      req["q"] = query3._queryObject;
      req["t"] = listenSpec.tag;
    }
    req[
      /*hash*/
      "h"
    ] = listenSpec.hashFn();
    this.sendRequest(action, req, (message) => {
      const payload = message[
        /*data*/
        "d"
      ];
      const status = message[
        /*status*/
        "s"
      ];
      _PersistentConnection.warnOnListenWarnings_(payload, query3);
      const currentListenSpec = this.listens.get(pathString) && this.listens.get(pathString).get(queryId);
      if (currentListenSpec === listenSpec) {
        this.log_("listen response", message);
        if (status !== "ok") {
          this.removeListen_(pathString, queryId);
        }
        if (listenSpec.onComplete) {
          listenSpec.onComplete(status, payload);
        }
      }
    });
  }
  static warnOnListenWarnings_(payload, query3) {
    if (payload && typeof payload === "object" && contains(payload, "w")) {
      const warnings = safeGet(payload, "w");
      if (Array.isArray(warnings) && ~warnings.indexOf("no_index")) {
        const indexSpec = '".indexOn": "' + query3._queryParams.getIndex().toString() + '"';
        const indexPath = query3._path.toString();
        warn(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${indexSpec} at ${indexPath} to your security rules for better performance.`);
      }
    }
  }
  refreshAuthToken(token) {
    this.authToken_ = token;
    this.log_("Auth token refreshed");
    if (this.authToken_) {
      this.tryAuth();
    } else {
      if (this.connected_) {
        this.sendRequest("unauth", {}, () => {
        });
      }
    }
    this.reduceReconnectDelayIfAdminCredential_(token);
  }
  reduceReconnectDelayIfAdminCredential_(credential) {
    const isFirebaseSecret = credential && credential.length === 40;
    if (isFirebaseSecret || isAdmin(credential)) {
      this.log_("Admin auth credential detected.  Reducing max reconnect time.");
      this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
    }
  }
  refreshAppCheckToken(token) {
    this.appCheckToken_ = token;
    this.log_("App check token refreshed");
    if (this.appCheckToken_) {
      this.tryAppCheck();
    } else {
      if (this.connected_) {
        this.sendRequest("unappeck", {}, () => {
        });
      }
    }
  }
  /**
   * Attempts to authenticate with the given credentials. If the authentication attempt fails, it's triggered like
   * a auth revoked (the connection is closed).
   */
  tryAuth() {
    if (this.connected_ && this.authToken_) {
      const token = this.authToken_;
      const authMethod = isValidFormat(token) ? "auth" : "gauth";
      const requestData = {
        cred: token
      };
      if (this.authOverride_ === null) {
        requestData["noauth"] = true;
      } else if (typeof this.authOverride_ === "object") {
        requestData["authvar"] = this.authOverride_;
      }
      this.sendRequest(authMethod, requestData, (res) => {
        const status = res[
          /*status*/
          "s"
        ];
        const data = res[
          /*data*/
          "d"
        ] || "error";
        if (this.authToken_ === token) {
          if (status === "ok") {
            this.invalidAuthTokenCount_ = 0;
          } else {
            this.onAuthRevoked_(status, data);
          }
        }
      });
    }
  }
  /**
   * Attempts to authenticate with the given token. If the authentication
   * attempt fails, it's triggered like the token was revoked (the connection is
   * closed).
   */
  tryAppCheck() {
    if (this.connected_ && this.appCheckToken_) {
      this.sendRequest("appcheck", {
        "token": this.appCheckToken_
      }, (res) => {
        const status = res[
          /*status*/
          "s"
        ];
        const data = res[
          /*data*/
          "d"
        ] || "error";
        if (status === "ok") {
          this.invalidAppCheckTokenCount_ = 0;
        } else {
          this.onAppCheckRevoked_(status, data);
        }
      });
    }
  }
  /**
   * @inheritDoc
   */
  unlisten(query3, tag) {
    const pathString = query3._path.toString();
    const queryId = query3._queryIdentifier;
    this.log_("Unlisten called for " + pathString + " " + queryId);
    assert(query3._queryParams.isDefault() || !query3._queryParams.loadsAllData(), "unlisten() called for non-default but complete query");
    const listen = this.removeListen_(pathString, queryId);
    if (listen && this.connected_) {
      this.sendUnlisten_(pathString, queryId, query3._queryObject, tag);
    }
  }
  sendUnlisten_(pathString, queryId, queryObj, tag) {
    this.log_("Unlisten on " + pathString + " for " + queryId);
    const req = {
      /*path*/
      p: pathString
    };
    const action = "n";
    if (tag) {
      req["q"] = queryObj;
      req["t"] = tag;
    }
    this.sendRequest(action, req);
  }
  onDisconnectPut(pathString, data, onComplete) {
    this.initConnection_();
    if (this.connected_) {
      this.sendOnDisconnect_("o", pathString, data, onComplete);
    } else {
      this.onDisconnectRequestQueue_.push({
        pathString,
        action: "o",
        data,
        onComplete
      });
    }
  }
  onDisconnectMerge(pathString, data, onComplete) {
    this.initConnection_();
    if (this.connected_) {
      this.sendOnDisconnect_("om", pathString, data, onComplete);
    } else {
      this.onDisconnectRequestQueue_.push({
        pathString,
        action: "om",
        data,
        onComplete
      });
    }
  }
  onDisconnectCancel(pathString, onComplete) {
    this.initConnection_();
    if (this.connected_) {
      this.sendOnDisconnect_("oc", pathString, null, onComplete);
    } else {
      this.onDisconnectRequestQueue_.push({
        pathString,
        action: "oc",
        data: null,
        onComplete
      });
    }
  }
  sendOnDisconnect_(action, pathString, data, onComplete) {
    const request = {
      /*path*/
      p: pathString,
      /*data*/
      d: data
    };
    this.log_("onDisconnect " + action, request);
    this.sendRequest(action, request, (response) => {
      if (onComplete) {
        setTimeout(() => {
          onComplete(response[
            /*status*/
            "s"
          ], response[
            /* data */
            "d"
          ]);
        }, Math.floor(0));
      }
    });
  }
  put(pathString, data, onComplete, hash) {
    this.putInternal("p", pathString, data, onComplete, hash);
  }
  merge(pathString, data, onComplete, hash) {
    this.putInternal("m", pathString, data, onComplete, hash);
  }
  putInternal(action, pathString, data, onComplete, hash) {
    this.initConnection_();
    const request = {
      /*path*/
      p: pathString,
      /*data*/
      d: data
    };
    if (hash !== void 0) {
      request[
        /*hash*/
        "h"
      ] = hash;
    }
    this.outstandingPuts_.push({
      action,
      request,
      onComplete
    });
    this.outstandingPutCount_++;
    const index = this.outstandingPuts_.length - 1;
    if (this.connected_) {
      this.sendPut_(index);
    } else {
      this.log_("Buffering put: " + pathString);
    }
  }
  sendPut_(index) {
    const action = this.outstandingPuts_[index].action;
    const request = this.outstandingPuts_[index].request;
    const onComplete = this.outstandingPuts_[index].onComplete;
    this.outstandingPuts_[index].queued = this.connected_;
    this.sendRequest(action, request, (message) => {
      this.log_(action + " response", message);
      delete this.outstandingPuts_[index];
      this.outstandingPutCount_--;
      if (this.outstandingPutCount_ === 0) {
        this.outstandingPuts_ = [];
      }
      if (onComplete) {
        onComplete(message[
          /*status*/
          "s"
        ], message[
          /* data */
          "d"
        ]);
      }
    });
  }
  reportStats(stats) {
    if (this.connected_) {
      const request = {
        /*counters*/
        c: stats
      };
      this.log_("reportStats", request);
      this.sendRequest(
        /*stats*/
        "s",
        request,
        (result) => {
          const status = result[
            /*status*/
            "s"
          ];
          if (status !== "ok") {
            const errorReason = result[
              /* data */
              "d"
            ];
            this.log_("reportStats", "Error sending stats: " + errorReason);
          }
        }
      );
    }
  }
  onDataMessage_(message) {
    if ("r" in message) {
      this.log_("from server: " + stringify(message));
      const reqNum = message["r"];
      const onResponse = this.requestCBHash_[reqNum];
      if (onResponse) {
        delete this.requestCBHash_[reqNum];
        onResponse(message[
          /*body*/
          "b"
        ]);
      }
    } else if ("error" in message) {
      throw "A server-side error has occurred: " + message["error"];
    } else if ("a" in message) {
      this.onDataPush_(message["a"], message["b"]);
    }
  }
  onDataPush_(action, body) {
    this.log_("handleServerMessage", action, body);
    if (action === "d") {
      this.onDataUpdate_(
        body[
          /*path*/
          "p"
        ],
        body[
          /*data*/
          "d"
        ],
        /*isMerge*/
        false,
        body["t"]
      );
    } else if (action === "m") {
      this.onDataUpdate_(
        body[
          /*path*/
          "p"
        ],
        body[
          /*data*/
          "d"
        ],
        /*isMerge=*/
        true,
        body["t"]
      );
    } else if (action === "c") {
      this.onListenRevoked_(body[
        /*path*/
        "p"
      ], body[
        /*query*/
        "q"
      ]);
    } else if (action === "ac") {
      this.onAuthRevoked_(body[
        /*status code*/
        "s"
      ], body[
        /* explanation */
        "d"
      ]);
    } else if (action === "apc") {
      this.onAppCheckRevoked_(body[
        /*status code*/
        "s"
      ], body[
        /* explanation */
        "d"
      ]);
    } else if (action === "sd") {
      this.onSecurityDebugPacket_(body);
    } else {
      error("Unrecognized action received from server: " + stringify(action) + "\nAre you using the latest client?");
    }
  }
  onReady_(timestamp, sessionId) {
    this.log_("connection ready");
    this.connected_ = true;
    this.lastConnectionEstablishedTime_ = (/* @__PURE__ */ new Date()).getTime();
    this.handleTimestamp_(timestamp);
    this.lastSessionId = sessionId;
    if (this.firstConnection_) {
      this.sendConnectStats_();
    }
    this.restoreState_();
    this.firstConnection_ = false;
    this.onConnectStatus_(true);
  }
  scheduleConnect_(timeout) {
    assert(!this.realtime_, "Scheduling a connect when we're already connected/ing?");
    if (this.establishConnectionTimer_) {
      clearTimeout(this.establishConnectionTimer_);
    }
    this.establishConnectionTimer_ = setTimeout(() => {
      this.establishConnectionTimer_ = null;
      this.establishConnection_();
    }, Math.floor(timeout));
  }
  initConnection_() {
    if (!this.realtime_ && this.firstConnection_) {
      this.scheduleConnect_(0);
    }
  }
  onVisible_(visible) {
    if (visible && !this.visible_ && this.reconnectDelay_ === this.maxReconnectDelay_) {
      this.log_("Window became visible.  Reducing delay.");
      this.reconnectDelay_ = RECONNECT_MIN_DELAY;
      if (!this.realtime_) {
        this.scheduleConnect_(0);
      }
    }
    this.visible_ = visible;
  }
  onOnline_(online) {
    if (online) {
      this.log_("Browser went online.");
      this.reconnectDelay_ = RECONNECT_MIN_DELAY;
      if (!this.realtime_) {
        this.scheduleConnect_(0);
      }
    } else {
      this.log_("Browser went offline.  Killing connection.");
      if (this.realtime_) {
        this.realtime_.close();
      }
    }
  }
  onRealtimeDisconnect_() {
    this.log_("data client disconnected");
    this.connected_ = false;
    this.realtime_ = null;
    this.cancelSentTransactions_();
    this.requestCBHash_ = {};
    if (this.shouldReconnect_()) {
      if (!this.visible_) {
        this.log_("Window isn't visible.  Delaying reconnect.");
        this.reconnectDelay_ = this.maxReconnectDelay_;
        this.lastConnectionAttemptTime_ = (/* @__PURE__ */ new Date()).getTime();
      } else if (this.lastConnectionEstablishedTime_) {
        const timeSinceLastConnectSucceeded = (/* @__PURE__ */ new Date()).getTime() - this.lastConnectionEstablishedTime_;
        if (timeSinceLastConnectSucceeded > RECONNECT_DELAY_RESET_TIMEOUT) {
          this.reconnectDelay_ = RECONNECT_MIN_DELAY;
        }
        this.lastConnectionEstablishedTime_ = null;
      }
      const timeSinceLastConnectAttempt = (/* @__PURE__ */ new Date()).getTime() - this.lastConnectionAttemptTime_;
      let reconnectDelay = Math.max(0, this.reconnectDelay_ - timeSinceLastConnectAttempt);
      reconnectDelay = Math.random() * reconnectDelay;
      this.log_("Trying to reconnect in " + reconnectDelay + "ms");
      this.scheduleConnect_(reconnectDelay);
      this.reconnectDelay_ = Math.min(this.maxReconnectDelay_, this.reconnectDelay_ * RECONNECT_DELAY_MULTIPLIER);
    }
    this.onConnectStatus_(false);
  }
  establishConnection_() {
    return __async(this, null, function* () {
      if (this.shouldReconnect_()) {
        this.log_("Making a connection attempt");
        this.lastConnectionAttemptTime_ = (/* @__PURE__ */ new Date()).getTime();
        this.lastConnectionEstablishedTime_ = null;
        const onDataMessage = this.onDataMessage_.bind(this);
        const onReady = this.onReady_.bind(this);
        const onDisconnect3 = this.onRealtimeDisconnect_.bind(this);
        const connId = this.id + ":" + _PersistentConnection.nextConnectionId_++;
        const lastSessionId = this.lastSessionId;
        let canceled = false;
        let connection = null;
        const closeFn = function() {
          if (connection) {
            connection.close();
          } else {
            canceled = true;
            onDisconnect3();
          }
        };
        const sendRequestFn = function(msg) {
          assert(connection, "sendRequest call when we're not connected not allowed.");
          connection.sendRequest(msg);
        };
        this.realtime_ = {
          close: closeFn,
          sendRequest: sendRequestFn
        };
        const forceRefresh = this.forceTokenRefresh_;
        this.forceTokenRefresh_ = false;
        try {
          const [authToken, appCheckToken] = yield Promise.all([this.authTokenProvider_.getToken(forceRefresh), this.appCheckTokenProvider_.getToken(forceRefresh)]);
          if (!canceled) {
            log("getToken() completed. Creating connection.");
            this.authToken_ = authToken && authToken.accessToken;
            this.appCheckToken_ = appCheckToken && appCheckToken.token;
            connection = new Connection(
              connId,
              this.repoInfo_,
              this.applicationId_,
              this.appCheckToken_,
              this.authToken_,
              onDataMessage,
              onReady,
              onDisconnect3,
              /* onKill= */
              (reason) => {
                warn(reason + " (" + this.repoInfo_.toString() + ")");
                this.interrupt(SERVER_KILL_INTERRUPT_REASON);
              },
              lastSessionId
            );
          } else {
            log("getToken() completed but was canceled");
          }
        } catch (error2) {
          this.log_("Failed to get token: " + error2);
          if (!canceled) {
            if (this.repoInfo_.nodeAdmin) {
              warn(error2);
            }
            closeFn();
          }
        }
      }
    });
  }
  interrupt(reason) {
    log("Interrupting connection for reason: " + reason);
    this.interruptReasons_[reason] = true;
    if (this.realtime_) {
      this.realtime_.close();
    } else {
      if (this.establishConnectionTimer_) {
        clearTimeout(this.establishConnectionTimer_);
        this.establishConnectionTimer_ = null;
      }
      if (this.connected_) {
        this.onRealtimeDisconnect_();
      }
    }
  }
  resume(reason) {
    log("Resuming connection for reason: " + reason);
    delete this.interruptReasons_[reason];
    if (isEmpty(this.interruptReasons_)) {
      this.reconnectDelay_ = RECONNECT_MIN_DELAY;
      if (!this.realtime_) {
        this.scheduleConnect_(0);
      }
    }
  }
  handleTimestamp_(timestamp) {
    const delta = timestamp - (/* @__PURE__ */ new Date()).getTime();
    this.onServerInfoUpdate_({
      serverTimeOffset: delta
    });
  }
  cancelSentTransactions_() {
    for (let i = 0; i < this.outstandingPuts_.length; i++) {
      const put = this.outstandingPuts_[i];
      if (put && /*hash*/
      "h" in put.request && put.queued) {
        if (put.onComplete) {
          put.onComplete("disconnect");
        }
        delete this.outstandingPuts_[i];
        this.outstandingPutCount_--;
      }
    }
    if (this.outstandingPutCount_ === 0) {
      this.outstandingPuts_ = [];
    }
  }
  onListenRevoked_(pathString, query3) {
    let queryId;
    if (!query3) {
      queryId = "default";
    } else {
      queryId = query3.map((q) => ObjectToUniqueKey(q)).join("$");
    }
    const listen = this.removeListen_(pathString, queryId);
    if (listen && listen.onComplete) {
      listen.onComplete("permission_denied");
    }
  }
  removeListen_(pathString, queryId) {
    const normalizedPathString = new Path(pathString).toString();
    let listen;
    if (this.listens.has(normalizedPathString)) {
      const map3 = this.listens.get(normalizedPathString);
      listen = map3.get(queryId);
      map3.delete(queryId);
      if (map3.size === 0) {
        this.listens.delete(normalizedPathString);
      }
    } else {
      listen = void 0;
    }
    return listen;
  }
  onAuthRevoked_(statusCode, explanation) {
    log("Auth token revoked: " + statusCode + "/" + explanation);
    this.authToken_ = null;
    this.forceTokenRefresh_ = true;
    this.realtime_.close();
    if (statusCode === "invalid_token" || statusCode === "permission_denied") {
      this.invalidAuthTokenCount_++;
      if (this.invalidAuthTokenCount_ >= INVALID_TOKEN_THRESHOLD) {
        this.reconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
        this.authTokenProvider_.notifyForInvalidToken();
      }
    }
  }
  onAppCheckRevoked_(statusCode, explanation) {
    log("App check token revoked: " + statusCode + "/" + explanation);
    this.appCheckToken_ = null;
    this.forceTokenRefresh_ = true;
    if (statusCode === "invalid_token" || statusCode === "permission_denied") {
      this.invalidAppCheckTokenCount_++;
      if (this.invalidAppCheckTokenCount_ >= INVALID_TOKEN_THRESHOLD) {
        this.appCheckTokenProvider_.notifyForInvalidToken();
      }
    }
  }
  onSecurityDebugPacket_(body) {
    if (this.securityDebugCallback_) {
      this.securityDebugCallback_(body);
    } else {
      if ("msg" in body) {
        console.log("FIREBASE: " + body["msg"].replace("\n", "\nFIREBASE: "));
      }
    }
  }
  restoreState_() {
    this.tryAuth();
    this.tryAppCheck();
    for (const queries of this.listens.values()) {
      for (const listenSpec of queries.values()) {
        this.sendListen_(listenSpec);
      }
    }
    for (let i = 0; i < this.outstandingPuts_.length; i++) {
      if (this.outstandingPuts_[i]) {
        this.sendPut_(i);
      }
    }
    while (this.onDisconnectRequestQueue_.length) {
      const request = this.onDisconnectRequestQueue_.shift();
      this.sendOnDisconnect_(request.action, request.pathString, request.data, request.onComplete);
    }
    for (let i = 0; i < this.outstandingGets_.length; i++) {
      if (this.outstandingGets_[i]) {
        this.sendGet_(i);
      }
    }
  }
  /**
   * Sends client stats for first connection
   */
  sendConnectStats_() {
    const stats = {};
    let clientName = "js";
    if (isNodeSdk()) {
      if (this.repoInfo_.nodeAdmin) {
        clientName = "admin_node";
      } else {
        clientName = "node";
      }
    }
    stats["sdk." + clientName + "." + SDK_VERSION2.replace(/\./g, "-")] = 1;
    if (isMobileCordova()) {
      stats["framework.cordova"] = 1;
    } else if (isReactNative()) {
      stats["framework.reactnative"] = 1;
    }
    this.reportStats(stats);
  }
  shouldReconnect_() {
    const online = OnlineMonitor.getInstance().currentlyOnline();
    return isEmpty(this.interruptReasons_) && online;
  }
};
PersistentConnection.nextPersistentConnectionId_ = 0;
PersistentConnection.nextConnectionId_ = 0;
var NamedNode = class _NamedNode {
  constructor(name2, node) {
    this.name = name2;
    this.node = node;
  }
  static Wrap(name2, node) {
    return new _NamedNode(name2, node);
  }
};
var Index = class {
  /**
   * @returns A standalone comparison function for
   * this index
   */
  getCompare() {
    return this.compare.bind(this);
  }
  /**
   * Given a before and after value for a node, determine if the indexed value has changed. Even if they are different,
   * it's possible that the changes are isolated to parts of the snapshot that are not indexed.
   *
   *
   * @returns True if the portion of the snapshot being indexed changed between oldNode and newNode
   */
  indexedValueChanged(oldNode, newNode) {
    const oldWrapped = new NamedNode(MIN_NAME, oldNode);
    const newWrapped = new NamedNode(MIN_NAME, newNode);
    return this.compare(oldWrapped, newWrapped) !== 0;
  }
  /**
   * @returns a node wrapper that will sort equal to or less than
   * any other node wrapper, using this index
   */
  minPost() {
    return NamedNode.MIN;
  }
};
var __EMPTY_NODE;
var KeyIndex = class extends Index {
  static get __EMPTY_NODE() {
    return __EMPTY_NODE;
  }
  static set __EMPTY_NODE(val) {
    __EMPTY_NODE = val;
  }
  compare(a, b) {
    return nameCompare(a.name, b.name);
  }
  isDefinedOn(node) {
    throw assertionError("KeyIndex.isDefinedOn not expected to be called.");
  }
  indexedValueChanged(oldNode, newNode) {
    return false;
  }
  minPost() {
    return NamedNode.MIN;
  }
  maxPost() {
    return new NamedNode(MAX_NAME, __EMPTY_NODE);
  }
  makePost(indexValue, name2) {
    assert(typeof indexValue === "string", "KeyIndex indexValue must always be a string.");
    return new NamedNode(indexValue, __EMPTY_NODE);
  }
  /**
   * @returns String representation for inclusion in a query spec
   */
  toString() {
    return ".key";
  }
};
var KEY_INDEX = new KeyIndex();
var SortedMapIterator = class {
  /**
   * @param node - Node to iterate.
   * @param isReverse_ - Whether or not to iterate in reverse
   */
  constructor(node, startKey, comparator, isReverse_, resultGenerator_ = null) {
    this.isReverse_ = isReverse_;
    this.resultGenerator_ = resultGenerator_;
    this.nodeStack_ = [];
    let cmp = 1;
    while (!node.isEmpty()) {
      node = node;
      cmp = startKey ? comparator(node.key, startKey) : 1;
      if (isReverse_) {
        cmp *= -1;
      }
      if (cmp < 0) {
        if (this.isReverse_) {
          node = node.left;
        } else {
          node = node.right;
        }
      } else if (cmp === 0) {
        this.nodeStack_.push(node);
        break;
      } else {
        this.nodeStack_.push(node);
        if (this.isReverse_) {
          node = node.right;
        } else {
          node = node.left;
        }
      }
    }
  }
  getNext() {
    if (this.nodeStack_.length === 0) {
      return null;
    }
    let node = this.nodeStack_.pop();
    let result;
    if (this.resultGenerator_) {
      result = this.resultGenerator_(node.key, node.value);
    } else {
      result = {
        key: node.key,
        value: node.value
      };
    }
    if (this.isReverse_) {
      node = node.left;
      while (!node.isEmpty()) {
        this.nodeStack_.push(node);
        node = node.right;
      }
    } else {
      node = node.right;
      while (!node.isEmpty()) {
        this.nodeStack_.push(node);
        node = node.left;
      }
    }
    return result;
  }
  hasNext() {
    return this.nodeStack_.length > 0;
  }
  peek() {
    if (this.nodeStack_.length === 0) {
      return null;
    }
    const node = this.nodeStack_[this.nodeStack_.length - 1];
    if (this.resultGenerator_) {
      return this.resultGenerator_(node.key, node.value);
    } else {
      return {
        key: node.key,
        value: node.value
      };
    }
  }
};
var LLRBNode = class _LLRBNode {
  /**
   * @param key - Key associated with this node.
   * @param value - Value associated with this node.
   * @param color - Whether this node is red.
   * @param left - Left child.
   * @param right - Right child.
   */
  constructor(key, value, color, left, right) {
    this.key = key;
    this.value = value;
    this.color = color != null ? color : _LLRBNode.RED;
    this.left = left != null ? left : SortedMap.EMPTY_NODE;
    this.right = right != null ? right : SortedMap.EMPTY_NODE;
  }
  /**
   * Returns a copy of the current node, optionally replacing pieces of it.
   *
   * @param key - New key for the node, or null.
   * @param value - New value for the node, or null.
   * @param color - New color for the node, or null.
   * @param left - New left child for the node, or null.
   * @param right - New right child for the node, or null.
   * @returns The node copy.
   */
  copy(key, value, color, left, right) {
    return new _LLRBNode(key != null ? key : this.key, value != null ? value : this.value, color != null ? color : this.color, left != null ? left : this.left, right != null ? right : this.right);
  }
  /**
   * @returns The total number of nodes in the tree.
   */
  count() {
    return this.left.count() + 1 + this.right.count();
  }
  /**
   * @returns True if the tree is empty.
   */
  isEmpty() {
    return false;
  }
  /**
   * Traverses the tree in key order and calls the specified action function
   * for each node.
   *
   * @param action - Callback function to be called for each
   *   node.  If it returns true, traversal is aborted.
   * @returns The first truthy value returned by action, or the last falsey
   *   value returned by action
   */
  inorderTraversal(action) {
    return this.left.inorderTraversal(action) || !!action(this.key, this.value) || this.right.inorderTraversal(action);
  }
  /**
   * Traverses the tree in reverse key order and calls the specified action function
   * for each node.
   *
   * @param action - Callback function to be called for each
   * node.  If it returns true, traversal is aborted.
   * @returns True if traversal was aborted.
   */
  reverseTraversal(action) {
    return this.right.reverseTraversal(action) || action(this.key, this.value) || this.left.reverseTraversal(action);
  }
  /**
   * @returns The minimum node in the tree.
   */
  min_() {
    if (this.left.isEmpty()) {
      return this;
    } else {
      return this.left.min_();
    }
  }
  /**
   * @returns The maximum key in the tree.
   */
  minKey() {
    return this.min_().key;
  }
  /**
   * @returns The maximum key in the tree.
   */
  maxKey() {
    if (this.right.isEmpty()) {
      return this.key;
    } else {
      return this.right.maxKey();
    }
  }
  /**
   * @param key - Key to insert.
   * @param value - Value to insert.
   * @param comparator - Comparator.
   * @returns New tree, with the key/value added.
   */
  insert(key, value, comparator) {
    let n = this;
    const cmp = comparator(key, n.key);
    if (cmp < 0) {
      n = n.copy(null, null, null, n.left.insert(key, value, comparator), null);
    } else if (cmp === 0) {
      n = n.copy(null, value, null, null, null);
    } else {
      n = n.copy(null, null, null, null, n.right.insert(key, value, comparator));
    }
    return n.fixUp_();
  }
  /**
   * @returns New tree, with the minimum key removed.
   */
  removeMin_() {
    if (this.left.isEmpty()) {
      return SortedMap.EMPTY_NODE;
    }
    let n = this;
    if (!n.left.isRed_() && !n.left.left.isRed_()) {
      n = n.moveRedLeft_();
    }
    n = n.copy(null, null, null, n.left.removeMin_(), null);
    return n.fixUp_();
  }
  /**
   * @param key - The key of the item to remove.
   * @param comparator - Comparator.
   * @returns New tree, with the specified item removed.
   */
  remove(key, comparator) {
    let n, smallest;
    n = this;
    if (comparator(key, n.key) < 0) {
      if (!n.left.isEmpty() && !n.left.isRed_() && !n.left.left.isRed_()) {
        n = n.moveRedLeft_();
      }
      n = n.copy(null, null, null, n.left.remove(key, comparator), null);
    } else {
      if (n.left.isRed_()) {
        n = n.rotateRight_();
      }
      if (!n.right.isEmpty() && !n.right.isRed_() && !n.right.left.isRed_()) {
        n = n.moveRedRight_();
      }
      if (comparator(key, n.key) === 0) {
        if (n.right.isEmpty()) {
          return SortedMap.EMPTY_NODE;
        } else {
          smallest = n.right.min_();
          n = n.copy(smallest.key, smallest.value, null, null, n.right.removeMin_());
        }
      }
      n = n.copy(null, null, null, null, n.right.remove(key, comparator));
    }
    return n.fixUp_();
  }
  /**
   * @returns Whether this is a RED node.
   */
  isRed_() {
    return this.color;
  }
  /**
   * @returns New tree after performing any needed rotations.
   */
  fixUp_() {
    let n = this;
    if (n.right.isRed_() && !n.left.isRed_()) {
      n = n.rotateLeft_();
    }
    if (n.left.isRed_() && n.left.left.isRed_()) {
      n = n.rotateRight_();
    }
    if (n.left.isRed_() && n.right.isRed_()) {
      n = n.colorFlip_();
    }
    return n;
  }
  /**
   * @returns New tree, after moveRedLeft.
   */
  moveRedLeft_() {
    let n = this.colorFlip_();
    if (n.right.left.isRed_()) {
      n = n.copy(null, null, null, null, n.right.rotateRight_());
      n = n.rotateLeft_();
      n = n.colorFlip_();
    }
    return n;
  }
  /**
   * @returns New tree, after moveRedRight.
   */
  moveRedRight_() {
    let n = this.colorFlip_();
    if (n.left.left.isRed_()) {
      n = n.rotateRight_();
      n = n.colorFlip_();
    }
    return n;
  }
  /**
   * @returns New tree, after rotateLeft.
   */
  rotateLeft_() {
    const nl = this.copy(null, null, _LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, nl, null);
  }
  /**
   * @returns New tree, after rotateRight.
   */
  rotateRight_() {
    const nr = this.copy(null, null, _LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, nr);
  }
  /**
   * @returns Newt ree, after colorFlip.
   */
  colorFlip_() {
    const left = this.left.copy(null, null, !this.left.color, null, null);
    const right = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, left, right);
  }
  /**
   * For testing.
   *
   * @returns True if all is well.
   */
  checkMaxDepth_() {
    const blackDepth = this.check_();
    return Math.pow(2, blackDepth) <= this.count() + 1;
  }
  check_() {
    if (this.isRed_() && this.left.isRed_()) {
      throw new Error("Red node has red child(" + this.key + "," + this.value + ")");
    }
    if (this.right.isRed_()) {
      throw new Error("Right child of (" + this.key + "," + this.value + ") is red");
    }
    const blackDepth = this.left.check_();
    if (blackDepth !== this.right.check_()) {
      throw new Error("Black depths differ");
    } else {
      return blackDepth + (this.isRed_() ? 0 : 1);
    }
  }
};
LLRBNode.RED = true;
LLRBNode.BLACK = false;
var LLRBEmptyNode = class {
  /**
   * Returns a copy of the current node.
   *
   * @returns The node copy.
   */
  copy(key, value, color, left, right) {
    return this;
  }
  /**
   * Returns a copy of the tree, with the specified key/value added.
   *
   * @param key - Key to be added.
   * @param value - Value to be added.
   * @param comparator - Comparator.
   * @returns New tree, with item added.
   */
  insert(key, value, comparator) {
    return new LLRBNode(key, value, null);
  }
  /**
   * Returns a copy of the tree, with the specified key removed.
   *
   * @param key - The key to remove.
   * @param comparator - Comparator.
   * @returns New tree, with item removed.
   */
  remove(key, comparator) {
    return this;
  }
  /**
   * @returns The total number of nodes in the tree.
   */
  count() {
    return 0;
  }
  /**
   * @returns True if the tree is empty.
   */
  isEmpty() {
    return true;
  }
  /**
   * Traverses the tree in key order and calls the specified action function
   * for each node.
   *
   * @param action - Callback function to be called for each
   * node.  If it returns true, traversal is aborted.
   * @returns True if traversal was aborted.
   */
  inorderTraversal(action) {
    return false;
  }
  /**
   * Traverses the tree in reverse key order and calls the specified action function
   * for each node.
   *
   * @param action - Callback function to be called for each
   * node.  If it returns true, traversal is aborted.
   * @returns True if traversal was aborted.
   */
  reverseTraversal(action) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  check_() {
    return 0;
  }
  /**
   * @returns Whether this node is red.
   */
  isRed_() {
    return false;
  }
};
var SortedMap = class _SortedMap {
  /**
   * @param comparator_ - Key comparator.
   * @param root_ - Optional root node for the map.
   */
  constructor(comparator_, root_ = _SortedMap.EMPTY_NODE) {
    this.comparator_ = comparator_;
    this.root_ = root_;
  }
  /**
   * Returns a copy of the map, with the specified key/value added or replaced.
   * (TODO: We should perhaps rename this method to 'put')
   *
   * @param key - Key to be added.
   * @param value - Value to be added.
   * @returns New map, with item added.
   */
  insert(key, value) {
    return new _SortedMap(this.comparator_, this.root_.insert(key, value, this.comparator_).copy(null, null, LLRBNode.BLACK, null, null));
  }
  /**
   * Returns a copy of the map, with the specified key removed.
   *
   * @param key - The key to remove.
   * @returns New map, with item removed.
   */
  remove(key) {
    return new _SortedMap(this.comparator_, this.root_.remove(key, this.comparator_).copy(null, null, LLRBNode.BLACK, null, null));
  }
  /**
   * Returns the value of the node with the given key, or null.
   *
   * @param key - The key to look up.
   * @returns The value of the node with the given key, or null if the
   * key doesn't exist.
   */
  get(key) {
    let cmp;
    let node = this.root_;
    while (!node.isEmpty()) {
      cmp = this.comparator_(key, node.key);
      if (cmp === 0) {
        return node.value;
      } else if (cmp < 0) {
        node = node.left;
      } else if (cmp > 0) {
        node = node.right;
      }
    }
    return null;
  }
  /**
   * Returns the key of the item *before* the specified key, or null if key is the first item.
   * @param key - The key to find the predecessor of
   * @returns The predecessor key.
   */
  getPredecessorKey(key) {
    let cmp, node = this.root_, rightParent = null;
    while (!node.isEmpty()) {
      cmp = this.comparator_(key, node.key);
      if (cmp === 0) {
        if (!node.left.isEmpty()) {
          node = node.left;
          while (!node.right.isEmpty()) {
            node = node.right;
          }
          return node.key;
        } else if (rightParent) {
          return rightParent.key;
        } else {
          return null;
        }
      } else if (cmp < 0) {
        node = node.left;
      } else if (cmp > 0) {
        rightParent = node;
        node = node.right;
      }
    }
    throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?");
  }
  /**
   * @returns True if the map is empty.
   */
  isEmpty() {
    return this.root_.isEmpty();
  }
  /**
   * @returns The total number of nodes in the map.
   */
  count() {
    return this.root_.count();
  }
  /**
   * @returns The minimum key in the map.
   */
  minKey() {
    return this.root_.minKey();
  }
  /**
   * @returns The maximum key in the map.
   */
  maxKey() {
    return this.root_.maxKey();
  }
  /**
   * Traverses the map in key order and calls the specified action function
   * for each key/value pair.
   *
   * @param action - Callback function to be called
   * for each key/value pair.  If action returns true, traversal is aborted.
   * @returns The first truthy value returned by action, or the last falsey
   *   value returned by action
   */
  inorderTraversal(action) {
    return this.root_.inorderTraversal(action);
  }
  /**
   * Traverses the map in reverse key order and calls the specified action function
   * for each key/value pair.
   *
   * @param action - Callback function to be called
   * for each key/value pair.  If action returns true, traversal is aborted.
   * @returns True if the traversal was aborted.
   */
  reverseTraversal(action) {
    return this.root_.reverseTraversal(action);
  }
  /**
   * Returns an iterator over the SortedMap.
   * @returns The iterator.
   */
  getIterator(resultGenerator) {
    return new SortedMapIterator(this.root_, null, this.comparator_, false, resultGenerator);
  }
  getIteratorFrom(key, resultGenerator) {
    return new SortedMapIterator(this.root_, key, this.comparator_, false, resultGenerator);
  }
  getReverseIteratorFrom(key, resultGenerator) {
    return new SortedMapIterator(this.root_, key, this.comparator_, true, resultGenerator);
  }
  getReverseIterator(resultGenerator) {
    return new SortedMapIterator(this.root_, null, this.comparator_, true, resultGenerator);
  }
};
SortedMap.EMPTY_NODE = new LLRBEmptyNode();
function NAME_ONLY_COMPARATOR(left, right) {
  return nameCompare(left.name, right.name);
}
function NAME_COMPARATOR(left, right) {
  return nameCompare(left, right);
}
var MAX_NODE$2;
function setMaxNode$1(val) {
  MAX_NODE$2 = val;
}
var priorityHashText = function(priority) {
  if (typeof priority === "number") {
    return "number:" + doubleToIEEE754String(priority);
  } else {
    return "string:" + priority;
  }
};
var validatePriorityNode = function(priorityNode) {
  if (priorityNode.isLeafNode()) {
    const val = priorityNode.val();
    assert(typeof val === "string" || typeof val === "number" || typeof val === "object" && contains(val, ".sv"), "Priority must be a string or number.");
  } else {
    assert(priorityNode === MAX_NODE$2 || priorityNode.isEmpty(), "priority of unexpected type.");
  }
  assert(priorityNode === MAX_NODE$2 || priorityNode.getPriority().isEmpty(), "Priority nodes can't have a priority of their own.");
};
var __childrenNodeConstructor;
var LeafNode = class _LeafNode {
  /**
   * @param value_ - The value to store in this leaf node. The object type is
   * possible in the event of a deferred value
   * @param priorityNode_ - The priority of this node.
   */
  constructor(value_, priorityNode_ = _LeafNode.__childrenNodeConstructor.EMPTY_NODE) {
    this.value_ = value_;
    this.priorityNode_ = priorityNode_;
    this.lazyHash_ = null;
    assert(this.value_ !== void 0 && this.value_ !== null, "LeafNode shouldn't be created with null/undefined value.");
    validatePriorityNode(this.priorityNode_);
  }
  static set __childrenNodeConstructor(val) {
    __childrenNodeConstructor = val;
  }
  static get __childrenNodeConstructor() {
    return __childrenNodeConstructor;
  }
  /** @inheritDoc */
  isLeafNode() {
    return true;
  }
  /** @inheritDoc */
  getPriority() {
    return this.priorityNode_;
  }
  /** @inheritDoc */
  updatePriority(newPriorityNode) {
    return new _LeafNode(this.value_, newPriorityNode);
  }
  /** @inheritDoc */
  getImmediateChild(childName) {
    if (childName === ".priority") {
      return this.priorityNode_;
    } else {
      return _LeafNode.__childrenNodeConstructor.EMPTY_NODE;
    }
  }
  /** @inheritDoc */
  getChild(path) {
    if (pathIsEmpty(path)) {
      return this;
    } else if (pathGetFront(path) === ".priority") {
      return this.priorityNode_;
    } else {
      return _LeafNode.__childrenNodeConstructor.EMPTY_NODE;
    }
  }
  hasChild() {
    return false;
  }
  /** @inheritDoc */
  getPredecessorChildName(childName, childNode) {
    return null;
  }
  /** @inheritDoc */
  updateImmediateChild(childName, newChildNode) {
    if (childName === ".priority") {
      return this.updatePriority(newChildNode);
    } else if (newChildNode.isEmpty() && childName !== ".priority") {
      return this;
    } else {
      return _LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(childName, newChildNode).updatePriority(this.priorityNode_);
    }
  }
  /** @inheritDoc */
  updateChild(path, newChildNode) {
    const front = pathGetFront(path);
    if (front === null) {
      return newChildNode;
    } else if (newChildNode.isEmpty() && front !== ".priority") {
      return this;
    } else {
      assert(front !== ".priority" || pathGetLength(path) === 1, ".priority must be the last token in a path");
      return this.updateImmediateChild(front, _LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateChild(pathPopFront(path), newChildNode));
    }
  }
  /** @inheritDoc */
  isEmpty() {
    return false;
  }
  /** @inheritDoc */
  numChildren() {
    return 0;
  }
  /** @inheritDoc */
  forEachChild(index, action) {
    return false;
  }
  val(exportFormat) {
    if (exportFormat && !this.getPriority().isEmpty()) {
      return {
        ".value": this.getValue(),
        ".priority": this.getPriority().val()
      };
    } else {
      return this.getValue();
    }
  }
  /** @inheritDoc */
  hash() {
    if (this.lazyHash_ === null) {
      let toHash = "";
      if (!this.priorityNode_.isEmpty()) {
        toHash += "priority:" + priorityHashText(this.priorityNode_.val()) + ":";
      }
      const type = typeof this.value_;
      toHash += type + ":";
      if (type === "number") {
        toHash += doubleToIEEE754String(this.value_);
      } else {
        toHash += this.value_;
      }
      this.lazyHash_ = sha1(toHash);
    }
    return this.lazyHash_;
  }
  /**
   * Returns the value of the leaf node.
   * @returns The value of the node.
   */
  getValue() {
    return this.value_;
  }
  compareTo(other) {
    if (other === _LeafNode.__childrenNodeConstructor.EMPTY_NODE) {
      return 1;
    } else if (other instanceof _LeafNode.__childrenNodeConstructor) {
      return -1;
    } else {
      assert(other.isLeafNode(), "Unknown node type");
      return this.compareToLeafNode_(other);
    }
  }
  /**
   * Comparison specifically for two leaf nodes
   */
  compareToLeafNode_(otherLeaf) {
    const otherLeafType = typeof otherLeaf.value_;
    const thisLeafType = typeof this.value_;
    const otherIndex = _LeafNode.VALUE_TYPE_ORDER.indexOf(otherLeafType);
    const thisIndex = _LeafNode.VALUE_TYPE_ORDER.indexOf(thisLeafType);
    assert(otherIndex >= 0, "Unknown leaf type: " + otherLeafType);
    assert(thisIndex >= 0, "Unknown leaf type: " + thisLeafType);
    if (otherIndex === thisIndex) {
      if (thisLeafType === "object") {
        return 0;
      } else {
        if (this.value_ < otherLeaf.value_) {
          return -1;
        } else if (this.value_ === otherLeaf.value_) {
          return 0;
        } else {
          return 1;
        }
      }
    } else {
      return thisIndex - otherIndex;
    }
  }
  withIndex() {
    return this;
  }
  isIndexed() {
    return true;
  }
  equals(other) {
    if (other === this) {
      return true;
    } else if (other.isLeafNode()) {
      const otherLeaf = other;
      return this.value_ === otherLeaf.value_ && this.priorityNode_.equals(otherLeaf.priorityNode_);
    } else {
      return false;
    }
  }
};
LeafNode.VALUE_TYPE_ORDER = ["object", "boolean", "number", "string"];
var nodeFromJSON$1;
var MAX_NODE$1;
function setNodeFromJSON(val) {
  nodeFromJSON$1 = val;
}
function setMaxNode(val) {
  MAX_NODE$1 = val;
}
var PriorityIndex = class extends Index {
  compare(a, b) {
    const aPriority = a.node.getPriority();
    const bPriority = b.node.getPriority();
    const indexCmp = aPriority.compareTo(bPriority);
    if (indexCmp === 0) {
      return nameCompare(a.name, b.name);
    } else {
      return indexCmp;
    }
  }
  isDefinedOn(node) {
    return !node.getPriority().isEmpty();
  }
  indexedValueChanged(oldNode, newNode) {
    return !oldNode.getPriority().equals(newNode.getPriority());
  }
  minPost() {
    return NamedNode.MIN;
  }
  maxPost() {
    return new NamedNode(MAX_NAME, new LeafNode("[PRIORITY-POST]", MAX_NODE$1));
  }
  makePost(indexValue, name2) {
    const priorityNode = nodeFromJSON$1(indexValue);
    return new NamedNode(name2, new LeafNode("[PRIORITY-POST]", priorityNode));
  }
  /**
   * @returns String representation for inclusion in a query spec
   */
  toString() {
    return ".priority";
  }
};
var PRIORITY_INDEX = new PriorityIndex();
var LOG_2 = Math.log(2);
var Base12Num = class {
  constructor(length) {
    const logBase2 = (num) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parseInt(Math.log(num) / LOG_2, 10)
    );
    const bitMask = (bits) => parseInt(Array(bits + 1).join("1"), 2);
    this.count = logBase2(length + 1);
    this.current_ = this.count - 1;
    const mask = bitMask(this.count);
    this.bits_ = length + 1 & mask;
  }
  nextBitIsOne() {
    const result = !(this.bits_ & 1 << this.current_);
    this.current_--;
    return result;
  }
};
var buildChildSet = function(childList, cmp, keyFn, mapSortFn) {
  childList.sort(cmp);
  const buildBalancedTree = function(low, high) {
    const length = high - low;
    let namedNode;
    let key;
    if (length === 0) {
      return null;
    } else if (length === 1) {
      namedNode = childList[low];
      key = keyFn ? keyFn(namedNode) : namedNode;
      return new LLRBNode(key, namedNode.node, LLRBNode.BLACK, null, null);
    } else {
      const middle = parseInt(length / 2, 10) + low;
      const left = buildBalancedTree(low, middle);
      const right = buildBalancedTree(middle + 1, high);
      namedNode = childList[middle];
      key = keyFn ? keyFn(namedNode) : namedNode;
      return new LLRBNode(key, namedNode.node, LLRBNode.BLACK, left, right);
    }
  };
  const buildFrom12Array = function(base122) {
    let node = null;
    let root2 = null;
    let index = childList.length;
    const buildPennant = function(chunkSize, color) {
      const low = index - chunkSize;
      const high = index;
      index -= chunkSize;
      const childTree = buildBalancedTree(low + 1, high);
      const namedNode = childList[low];
      const key = keyFn ? keyFn(namedNode) : namedNode;
      attachPennant(new LLRBNode(key, namedNode.node, color, null, childTree));
    };
    const attachPennant = function(pennant) {
      if (node) {
        node.left = pennant;
        node = pennant;
      } else {
        root2 = pennant;
        node = pennant;
      }
    };
    for (let i = 0; i < base122.count; ++i) {
      const isOne = base122.nextBitIsOne();
      const chunkSize = Math.pow(2, base122.count - (i + 1));
      if (isOne) {
        buildPennant(chunkSize, LLRBNode.BLACK);
      } else {
        buildPennant(chunkSize, LLRBNode.BLACK);
        buildPennant(chunkSize, LLRBNode.RED);
      }
    }
    return root2;
  };
  const base12 = new Base12Num(childList.length);
  const root = buildFrom12Array(base12);
  return new SortedMap(mapSortFn || cmp, root);
};
var _defaultIndexMap;
var fallbackObject = {};
var IndexMap = class _IndexMap {
  constructor(indexes_, indexSet_) {
    this.indexes_ = indexes_;
    this.indexSet_ = indexSet_;
  }
  /**
   * The default IndexMap for nodes without a priority
   */
  static get Default() {
    assert(fallbackObject && PRIORITY_INDEX, "ChildrenNode.ts has not been loaded");
    _defaultIndexMap = _defaultIndexMap || new _IndexMap({
      ".priority": fallbackObject
    }, {
      ".priority": PRIORITY_INDEX
    });
    return _defaultIndexMap;
  }
  get(indexKey) {
    const sortedMap = safeGet(this.indexes_, indexKey);
    if (!sortedMap) {
      throw new Error("No index defined for " + indexKey);
    }
    if (sortedMap instanceof SortedMap) {
      return sortedMap;
    } else {
      return null;
    }
  }
  hasIndex(indexDefinition) {
    return contains(this.indexSet_, indexDefinition.toString());
  }
  addIndex(indexDefinition, existingChildren) {
    assert(indexDefinition !== KEY_INDEX, "KeyIndex always exists and isn't meant to be added to the IndexMap.");
    const childList = [];
    let sawIndexedValue = false;
    const iter = existingChildren.getIterator(NamedNode.Wrap);
    let next = iter.getNext();
    while (next) {
      sawIndexedValue = sawIndexedValue || indexDefinition.isDefinedOn(next.node);
      childList.push(next);
      next = iter.getNext();
    }
    let newIndex;
    if (sawIndexedValue) {
      newIndex = buildChildSet(childList, indexDefinition.getCompare());
    } else {
      newIndex = fallbackObject;
    }
    const indexName = indexDefinition.toString();
    const newIndexSet = Object.assign({}, this.indexSet_);
    newIndexSet[indexName] = indexDefinition;
    const newIndexes = Object.assign({}, this.indexes_);
    newIndexes[indexName] = newIndex;
    return new _IndexMap(newIndexes, newIndexSet);
  }
  /**
   * Ensure that this node is properly tracked in any indexes that we're maintaining
   */
  addToIndexes(namedNode, existingChildren) {
    const newIndexes = map(this.indexes_, (indexedChildren, indexName) => {
      const index = safeGet(this.indexSet_, indexName);
      assert(index, "Missing index implementation for " + indexName);
      if (indexedChildren === fallbackObject) {
        if (index.isDefinedOn(namedNode.node)) {
          const childList = [];
          const iter = existingChildren.getIterator(NamedNode.Wrap);
          let next = iter.getNext();
          while (next) {
            if (next.name !== namedNode.name) {
              childList.push(next);
            }
            next = iter.getNext();
          }
          childList.push(namedNode);
          return buildChildSet(childList, index.getCompare());
        } else {
          return fallbackObject;
        }
      } else {
        const existingSnap = existingChildren.get(namedNode.name);
        let newChildren = indexedChildren;
        if (existingSnap) {
          newChildren = newChildren.remove(new NamedNode(namedNode.name, existingSnap));
        }
        return newChildren.insert(namedNode, namedNode.node);
      }
    });
    return new _IndexMap(newIndexes, this.indexSet_);
  }
  /**
   * Create a new IndexMap instance with the given value removed
   */
  removeFromIndexes(namedNode, existingChildren) {
    const newIndexes = map(this.indexes_, (indexedChildren) => {
      if (indexedChildren === fallbackObject) {
        return indexedChildren;
      } else {
        const existingSnap = existingChildren.get(namedNode.name);
        if (existingSnap) {
          return indexedChildren.remove(new NamedNode(namedNode.name, existingSnap));
        } else {
          return indexedChildren;
        }
      }
    });
    return new _IndexMap(newIndexes, this.indexSet_);
  }
};
var EMPTY_NODE;
var ChildrenNode = class _ChildrenNode {
  /**
   * @param children_ - List of children of this node..
   * @param priorityNode_ - The priority of this node (as a snapshot node).
   */
  constructor(children_, priorityNode_, indexMap_) {
    this.children_ = children_;
    this.priorityNode_ = priorityNode_;
    this.indexMap_ = indexMap_;
    this.lazyHash_ = null;
    if (this.priorityNode_) {
      validatePriorityNode(this.priorityNode_);
    }
    if (this.children_.isEmpty()) {
      assert(!this.priorityNode_ || this.priorityNode_.isEmpty(), "An empty node cannot have a priority");
    }
  }
  static get EMPTY_NODE() {
    return EMPTY_NODE || (EMPTY_NODE = new _ChildrenNode(new SortedMap(NAME_COMPARATOR), null, IndexMap.Default));
  }
  /** @inheritDoc */
  isLeafNode() {
    return false;
  }
  /** @inheritDoc */
  getPriority() {
    return this.priorityNode_ || EMPTY_NODE;
  }
  /** @inheritDoc */
  updatePriority(newPriorityNode) {
    if (this.children_.isEmpty()) {
      return this;
    } else {
      return new _ChildrenNode(this.children_, newPriorityNode, this.indexMap_);
    }
  }
  /** @inheritDoc */
  getImmediateChild(childName) {
    if (childName === ".priority") {
      return this.getPriority();
    } else {
      const child3 = this.children_.get(childName);
      return child3 === null ? EMPTY_NODE : child3;
    }
  }
  /** @inheritDoc */
  getChild(path) {
    const front = pathGetFront(path);
    if (front === null) {
      return this;
    }
    return this.getImmediateChild(front).getChild(pathPopFront(path));
  }
  /** @inheritDoc */
  hasChild(childName) {
    return this.children_.get(childName) !== null;
  }
  /** @inheritDoc */
  updateImmediateChild(childName, newChildNode) {
    assert(newChildNode, "We should always be passing snapshot nodes");
    if (childName === ".priority") {
      return this.updatePriority(newChildNode);
    } else {
      const namedNode = new NamedNode(childName, newChildNode);
      let newChildren, newIndexMap;
      if (newChildNode.isEmpty()) {
        newChildren = this.children_.remove(childName);
        newIndexMap = this.indexMap_.removeFromIndexes(namedNode, this.children_);
      } else {
        newChildren = this.children_.insert(childName, newChildNode);
        newIndexMap = this.indexMap_.addToIndexes(namedNode, this.children_);
      }
      const newPriority = newChildren.isEmpty() ? EMPTY_NODE : this.priorityNode_;
      return new _ChildrenNode(newChildren, newPriority, newIndexMap);
    }
  }
  /** @inheritDoc */
  updateChild(path, newChildNode) {
    const front = pathGetFront(path);
    if (front === null) {
      return newChildNode;
    } else {
      assert(pathGetFront(path) !== ".priority" || pathGetLength(path) === 1, ".priority must be the last token in a path");
      const newImmediateChild = this.getImmediateChild(front).updateChild(pathPopFront(path), newChildNode);
      return this.updateImmediateChild(front, newImmediateChild);
    }
  }
  /** @inheritDoc */
  isEmpty() {
    return this.children_.isEmpty();
  }
  /** @inheritDoc */
  numChildren() {
    return this.children_.count();
  }
  /** @inheritDoc */
  val(exportFormat) {
    if (this.isEmpty()) {
      return null;
    }
    const obj = {};
    let numKeys = 0, maxKey = 0, allIntegerKeys = true;
    this.forEachChild(PRIORITY_INDEX, (key, childNode) => {
      obj[key] = childNode.val(exportFormat);
      numKeys++;
      if (allIntegerKeys && _ChildrenNode.INTEGER_REGEXP_.test(key)) {
        maxKey = Math.max(maxKey, Number(key));
      } else {
        allIntegerKeys = false;
      }
    });
    if (!exportFormat && allIntegerKeys && maxKey < 2 * numKeys) {
      const array = [];
      for (const key in obj) {
        array[key] = obj[key];
      }
      return array;
    } else {
      if (exportFormat && !this.getPriority().isEmpty()) {
        obj[".priority"] = this.getPriority().val();
      }
      return obj;
    }
  }
  /** @inheritDoc */
  hash() {
    if (this.lazyHash_ === null) {
      let toHash = "";
      if (!this.getPriority().isEmpty()) {
        toHash += "priority:" + priorityHashText(this.getPriority().val()) + ":";
      }
      this.forEachChild(PRIORITY_INDEX, (key, childNode) => {
        const childHash = childNode.hash();
        if (childHash !== "") {
          toHash += ":" + key + ":" + childHash;
        }
      });
      this.lazyHash_ = toHash === "" ? "" : sha1(toHash);
    }
    return this.lazyHash_;
  }
  /** @inheritDoc */
  getPredecessorChildName(childName, childNode, index) {
    const idx = this.resolveIndex_(index);
    if (idx) {
      const predecessor = idx.getPredecessorKey(new NamedNode(childName, childNode));
      return predecessor ? predecessor.name : null;
    } else {
      return this.children_.getPredecessorKey(childName);
    }
  }
  getFirstChildName(indexDefinition) {
    const idx = this.resolveIndex_(indexDefinition);
    if (idx) {
      const minKey = idx.minKey();
      return minKey && minKey.name;
    } else {
      return this.children_.minKey();
    }
  }
  getFirstChild(indexDefinition) {
    const minKey = this.getFirstChildName(indexDefinition);
    if (minKey) {
      return new NamedNode(minKey, this.children_.get(minKey));
    } else {
      return null;
    }
  }
  /**
   * Given an index, return the key name of the largest value we have, according to that index
   */
  getLastChildName(indexDefinition) {
    const idx = this.resolveIndex_(indexDefinition);
    if (idx) {
      const maxKey = idx.maxKey();
      return maxKey && maxKey.name;
    } else {
      return this.children_.maxKey();
    }
  }
  getLastChild(indexDefinition) {
    const maxKey = this.getLastChildName(indexDefinition);
    if (maxKey) {
      return new NamedNode(maxKey, this.children_.get(maxKey));
    } else {
      return null;
    }
  }
  forEachChild(index, action) {
    const idx = this.resolveIndex_(index);
    if (idx) {
      return idx.inorderTraversal((wrappedNode) => {
        return action(wrappedNode.name, wrappedNode.node);
      });
    } else {
      return this.children_.inorderTraversal(action);
    }
  }
  getIterator(indexDefinition) {
    return this.getIteratorFrom(indexDefinition.minPost(), indexDefinition);
  }
  getIteratorFrom(startPost, indexDefinition) {
    const idx = this.resolveIndex_(indexDefinition);
    if (idx) {
      return idx.getIteratorFrom(startPost, (key) => key);
    } else {
      const iterator = this.children_.getIteratorFrom(startPost.name, NamedNode.Wrap);
      let next = iterator.peek();
      while (next != null && indexDefinition.compare(next, startPost) < 0) {
        iterator.getNext();
        next = iterator.peek();
      }
      return iterator;
    }
  }
  getReverseIterator(indexDefinition) {
    return this.getReverseIteratorFrom(indexDefinition.maxPost(), indexDefinition);
  }
  getReverseIteratorFrom(endPost, indexDefinition) {
    const idx = this.resolveIndex_(indexDefinition);
    if (idx) {
      return idx.getReverseIteratorFrom(endPost, (key) => {
        return key;
      });
    } else {
      const iterator = this.children_.getReverseIteratorFrom(endPost.name, NamedNode.Wrap);
      let next = iterator.peek();
      while (next != null && indexDefinition.compare(next, endPost) > 0) {
        iterator.getNext();
        next = iterator.peek();
      }
      return iterator;
    }
  }
  compareTo(other) {
    if (this.isEmpty()) {
      if (other.isEmpty()) {
        return 0;
      } else {
        return -1;
      }
    } else if (other.isLeafNode() || other.isEmpty()) {
      return 1;
    } else if (other === MAX_NODE) {
      return -1;
    } else {
      return 0;
    }
  }
  withIndex(indexDefinition) {
    if (indexDefinition === KEY_INDEX || this.indexMap_.hasIndex(indexDefinition)) {
      return this;
    } else {
      const newIndexMap = this.indexMap_.addIndex(indexDefinition, this.children_);
      return new _ChildrenNode(this.children_, this.priorityNode_, newIndexMap);
    }
  }
  isIndexed(index) {
    return index === KEY_INDEX || this.indexMap_.hasIndex(index);
  }
  equals(other) {
    if (other === this) {
      return true;
    } else if (other.isLeafNode()) {
      return false;
    } else {
      const otherChildrenNode = other;
      if (!this.getPriority().equals(otherChildrenNode.getPriority())) {
        return false;
      } else if (this.children_.count() === otherChildrenNode.children_.count()) {
        const thisIter = this.getIterator(PRIORITY_INDEX);
        const otherIter = otherChildrenNode.getIterator(PRIORITY_INDEX);
        let thisCurrent = thisIter.getNext();
        let otherCurrent = otherIter.getNext();
        while (thisCurrent && otherCurrent) {
          if (thisCurrent.name !== otherCurrent.name || !thisCurrent.node.equals(otherCurrent.node)) {
            return false;
          }
          thisCurrent = thisIter.getNext();
          otherCurrent = otherIter.getNext();
        }
        return thisCurrent === null && otherCurrent === null;
      } else {
        return false;
      }
    }
  }
  /**
   * Returns a SortedMap ordered by index, or null if the default (by-key) ordering can be used
   * instead.
   *
   */
  resolveIndex_(indexDefinition) {
    if (indexDefinition === KEY_INDEX) {
      return null;
    } else {
      return this.indexMap_.get(indexDefinition.toString());
    }
  }
};
ChildrenNode.INTEGER_REGEXP_ = /^(0|[1-9]\d*)$/;
var MaxNode = class extends ChildrenNode {
  constructor() {
    super(new SortedMap(NAME_COMPARATOR), ChildrenNode.EMPTY_NODE, IndexMap.Default);
  }
  compareTo(other) {
    if (other === this) {
      return 0;
    } else {
      return 1;
    }
  }
  equals(other) {
    return other === this;
  }
  getPriority() {
    return this;
  }
  getImmediateChild(childName) {
    return ChildrenNode.EMPTY_NODE;
  }
  isEmpty() {
    return false;
  }
};
var MAX_NODE = new MaxNode();
Object.defineProperties(NamedNode, {
  MIN: {
    value: new NamedNode(MIN_NAME, ChildrenNode.EMPTY_NODE)
  },
  MAX: {
    value: new NamedNode(MAX_NAME, MAX_NODE)
  }
});
KeyIndex.__EMPTY_NODE = ChildrenNode.EMPTY_NODE;
LeafNode.__childrenNodeConstructor = ChildrenNode;
setMaxNode$1(MAX_NODE);
setMaxNode(MAX_NODE);
var USE_HINZE = true;
function nodeFromJSON(json, priority = null) {
  if (json === null) {
    return ChildrenNode.EMPTY_NODE;
  }
  if (typeof json === "object" && ".priority" in json) {
    priority = json[".priority"];
  }
  assert(priority === null || typeof priority === "string" || typeof priority === "number" || typeof priority === "object" && ".sv" in priority, "Invalid priority type found: " + typeof priority);
  if (typeof json === "object" && ".value" in json && json[".value"] !== null) {
    json = json[".value"];
  }
  if (typeof json !== "object" || ".sv" in json) {
    const jsonLeaf = json;
    return new LeafNode(jsonLeaf, nodeFromJSON(priority));
  }
  if (!(json instanceof Array) && USE_HINZE) {
    const children = [];
    let childrenHavePriority = false;
    const hinzeJsonObj = json;
    each(hinzeJsonObj, (key, child3) => {
      if (key.substring(0, 1) !== ".") {
        const childNode = nodeFromJSON(child3);
        if (!childNode.isEmpty()) {
          childrenHavePriority = childrenHavePriority || !childNode.getPriority().isEmpty();
          children.push(new NamedNode(key, childNode));
        }
      }
    });
    if (children.length === 0) {
      return ChildrenNode.EMPTY_NODE;
    }
    const childSet = buildChildSet(children, NAME_ONLY_COMPARATOR, (namedNode) => namedNode.name, NAME_COMPARATOR);
    if (childrenHavePriority) {
      const sortedChildSet = buildChildSet(children, PRIORITY_INDEX.getCompare());
      return new ChildrenNode(childSet, nodeFromJSON(priority), new IndexMap({
        ".priority": sortedChildSet
      }, {
        ".priority": PRIORITY_INDEX
      }));
    } else {
      return new ChildrenNode(childSet, nodeFromJSON(priority), IndexMap.Default);
    }
  } else {
    let node = ChildrenNode.EMPTY_NODE;
    each(json, (key, childData) => {
      if (contains(json, key)) {
        if (key.substring(0, 1) !== ".") {
          const childNode = nodeFromJSON(childData);
          if (childNode.isLeafNode() || !childNode.isEmpty()) {
            node = node.updateImmediateChild(key, childNode);
          }
        }
      }
    });
    return node.updatePriority(nodeFromJSON(priority));
  }
}
setNodeFromJSON(nodeFromJSON);
var PathIndex = class extends Index {
  constructor(indexPath_) {
    super();
    this.indexPath_ = indexPath_;
    assert(!pathIsEmpty(indexPath_) && pathGetFront(indexPath_) !== ".priority", "Can't create PathIndex with empty path or .priority key");
  }
  extractChild(snap) {
    return snap.getChild(this.indexPath_);
  }
  isDefinedOn(node) {
    return !node.getChild(this.indexPath_).isEmpty();
  }
  compare(a, b) {
    const aChild = this.extractChild(a.node);
    const bChild = this.extractChild(b.node);
    const indexCmp = aChild.compareTo(bChild);
    if (indexCmp === 0) {
      return nameCompare(a.name, b.name);
    } else {
      return indexCmp;
    }
  }
  makePost(indexValue, name2) {
    const valueNode = nodeFromJSON(indexValue);
    const node = ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_, valueNode);
    return new NamedNode(name2, node);
  }
  maxPost() {
    const node = ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_, MAX_NODE);
    return new NamedNode(MAX_NAME, node);
  }
  toString() {
    return pathSlice(this.indexPath_, 0).join("/");
  }
};
var ValueIndex = class extends Index {
  compare(a, b) {
    const indexCmp = a.node.compareTo(b.node);
    if (indexCmp === 0) {
      return nameCompare(a.name, b.name);
    } else {
      return indexCmp;
    }
  }
  isDefinedOn(node) {
    return true;
  }
  indexedValueChanged(oldNode, newNode) {
    return !oldNode.equals(newNode);
  }
  minPost() {
    return NamedNode.MIN;
  }
  maxPost() {
    return NamedNode.MAX;
  }
  makePost(indexValue, name2) {
    const valueNode = nodeFromJSON(indexValue);
    return new NamedNode(name2, valueNode);
  }
  /**
   * @returns String representation for inclusion in a query spec
   */
  toString() {
    return ".value";
  }
};
var VALUE_INDEX = new ValueIndex();
function changeValue(snapshotNode) {
  return {
    type: "value",
    snapshotNode
  };
}
function changeChildAdded(childName, snapshotNode) {
  return {
    type: "child_added",
    snapshotNode,
    childName
  };
}
function changeChildRemoved(childName, snapshotNode) {
  return {
    type: "child_removed",
    snapshotNode,
    childName
  };
}
function changeChildChanged(childName, snapshotNode, oldSnap) {
  return {
    type: "child_changed",
    snapshotNode,
    childName,
    oldSnap
  };
}
function changeChildMoved(childName, snapshotNode) {
  return {
    type: "child_moved",
    snapshotNode,
    childName
  };
}
var IndexedFilter = class {
  constructor(index_) {
    this.index_ = index_;
  }
  updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator) {
    assert(snap.isIndexed(this.index_), "A node must be indexed if only a child is updated");
    const oldChild = snap.getImmediateChild(key);
    if (oldChild.getChild(affectedPath).equals(newChild.getChild(affectedPath))) {
      if (oldChild.isEmpty() === newChild.isEmpty()) {
        return snap;
      }
    }
    if (optChangeAccumulator != null) {
      if (newChild.isEmpty()) {
        if (snap.hasChild(key)) {
          optChangeAccumulator.trackChildChange(changeChildRemoved(key, oldChild));
        } else {
          assert(snap.isLeafNode(), "A child remove without an old child only makes sense on a leaf node");
        }
      } else if (oldChild.isEmpty()) {
        optChangeAccumulator.trackChildChange(changeChildAdded(key, newChild));
      } else {
        optChangeAccumulator.trackChildChange(changeChildChanged(key, newChild, oldChild));
      }
    }
    if (snap.isLeafNode() && newChild.isEmpty()) {
      return snap;
    } else {
      return snap.updateImmediateChild(key, newChild).withIndex(this.index_);
    }
  }
  updateFullNode(oldSnap, newSnap, optChangeAccumulator) {
    if (optChangeAccumulator != null) {
      if (!oldSnap.isLeafNode()) {
        oldSnap.forEachChild(PRIORITY_INDEX, (key, childNode) => {
          if (!newSnap.hasChild(key)) {
            optChangeAccumulator.trackChildChange(changeChildRemoved(key, childNode));
          }
        });
      }
      if (!newSnap.isLeafNode()) {
        newSnap.forEachChild(PRIORITY_INDEX, (key, childNode) => {
          if (oldSnap.hasChild(key)) {
            const oldChild = oldSnap.getImmediateChild(key);
            if (!oldChild.equals(childNode)) {
              optChangeAccumulator.trackChildChange(changeChildChanged(key, childNode, oldChild));
            }
          } else {
            optChangeAccumulator.trackChildChange(changeChildAdded(key, childNode));
          }
        });
      }
    }
    return newSnap.withIndex(this.index_);
  }
  updatePriority(oldSnap, newPriority) {
    if (oldSnap.isEmpty()) {
      return ChildrenNode.EMPTY_NODE;
    } else {
      return oldSnap.updatePriority(newPriority);
    }
  }
  filtersNodes() {
    return false;
  }
  getIndexedFilter() {
    return this;
  }
  getIndex() {
    return this.index_;
  }
};
var RangedFilter = class _RangedFilter {
  constructor(params) {
    this.indexedFilter_ = new IndexedFilter(params.getIndex());
    this.index_ = params.getIndex();
    this.startPost_ = _RangedFilter.getStartPost_(params);
    this.endPost_ = _RangedFilter.getEndPost_(params);
    this.startIsInclusive_ = !params.startAfterSet_;
    this.endIsInclusive_ = !params.endBeforeSet_;
  }
  getStartPost() {
    return this.startPost_;
  }
  getEndPost() {
    return this.endPost_;
  }
  matches(node) {
    const isWithinStart = this.startIsInclusive_ ? this.index_.compare(this.getStartPost(), node) <= 0 : this.index_.compare(this.getStartPost(), node) < 0;
    const isWithinEnd = this.endIsInclusive_ ? this.index_.compare(node, this.getEndPost()) <= 0 : this.index_.compare(node, this.getEndPost()) < 0;
    return isWithinStart && isWithinEnd;
  }
  updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator) {
    if (!this.matches(new NamedNode(key, newChild))) {
      newChild = ChildrenNode.EMPTY_NODE;
    }
    return this.indexedFilter_.updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator);
  }
  updateFullNode(oldSnap, newSnap, optChangeAccumulator) {
    if (newSnap.isLeafNode()) {
      newSnap = ChildrenNode.EMPTY_NODE;
    }
    let filtered = newSnap.withIndex(this.index_);
    filtered = filtered.updatePriority(ChildrenNode.EMPTY_NODE);
    const self = this;
    newSnap.forEachChild(PRIORITY_INDEX, (key, childNode) => {
      if (!self.matches(new NamedNode(key, childNode))) {
        filtered = filtered.updateImmediateChild(key, ChildrenNode.EMPTY_NODE);
      }
    });
    return this.indexedFilter_.updateFullNode(oldSnap, filtered, optChangeAccumulator);
  }
  updatePriority(oldSnap, newPriority) {
    return oldSnap;
  }
  filtersNodes() {
    return true;
  }
  getIndexedFilter() {
    return this.indexedFilter_;
  }
  getIndex() {
    return this.index_;
  }
  static getStartPost_(params) {
    if (params.hasStart()) {
      const startName = params.getIndexStartName();
      return params.getIndex().makePost(params.getIndexStartValue(), startName);
    } else {
      return params.getIndex().minPost();
    }
  }
  static getEndPost_(params) {
    if (params.hasEnd()) {
      const endName = params.getIndexEndName();
      return params.getIndex().makePost(params.getIndexEndValue(), endName);
    } else {
      return params.getIndex().maxPost();
    }
  }
};
var LimitedFilter = class {
  constructor(params) {
    this.withinDirectionalStart = (node) => this.reverse_ ? this.withinEndPost(node) : this.withinStartPost(node);
    this.withinDirectionalEnd = (node) => this.reverse_ ? this.withinStartPost(node) : this.withinEndPost(node);
    this.withinStartPost = (node) => {
      const compareRes = this.index_.compare(this.rangedFilter_.getStartPost(), node);
      return this.startIsInclusive_ ? compareRes <= 0 : compareRes < 0;
    };
    this.withinEndPost = (node) => {
      const compareRes = this.index_.compare(node, this.rangedFilter_.getEndPost());
      return this.endIsInclusive_ ? compareRes <= 0 : compareRes < 0;
    };
    this.rangedFilter_ = new RangedFilter(params);
    this.index_ = params.getIndex();
    this.limit_ = params.getLimit();
    this.reverse_ = !params.isViewFromLeft();
    this.startIsInclusive_ = !params.startAfterSet_;
    this.endIsInclusive_ = !params.endBeforeSet_;
  }
  updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator) {
    if (!this.rangedFilter_.matches(new NamedNode(key, newChild))) {
      newChild = ChildrenNode.EMPTY_NODE;
    }
    if (snap.getImmediateChild(key).equals(newChild)) {
      return snap;
    } else if (snap.numChildren() < this.limit_) {
      return this.rangedFilter_.getIndexedFilter().updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator);
    } else {
      return this.fullLimitUpdateChild_(snap, key, newChild, source, optChangeAccumulator);
    }
  }
  updateFullNode(oldSnap, newSnap, optChangeAccumulator) {
    let filtered;
    if (newSnap.isLeafNode() || newSnap.isEmpty()) {
      filtered = ChildrenNode.EMPTY_NODE.withIndex(this.index_);
    } else {
      if (this.limit_ * 2 < newSnap.numChildren() && newSnap.isIndexed(this.index_)) {
        filtered = ChildrenNode.EMPTY_NODE.withIndex(this.index_);
        let iterator;
        if (this.reverse_) {
          iterator = newSnap.getReverseIteratorFrom(this.rangedFilter_.getEndPost(), this.index_);
        } else {
          iterator = newSnap.getIteratorFrom(this.rangedFilter_.getStartPost(), this.index_);
        }
        let count = 0;
        while (iterator.hasNext() && count < this.limit_) {
          const next = iterator.getNext();
          if (!this.withinDirectionalStart(next)) {
            continue;
          } else if (!this.withinDirectionalEnd(next)) {
            break;
          } else {
            filtered = filtered.updateImmediateChild(next.name, next.node);
            count++;
          }
        }
      } else {
        filtered = newSnap.withIndex(this.index_);
        filtered = filtered.updatePriority(ChildrenNode.EMPTY_NODE);
        let iterator;
        if (this.reverse_) {
          iterator = filtered.getReverseIterator(this.index_);
        } else {
          iterator = filtered.getIterator(this.index_);
        }
        let count = 0;
        while (iterator.hasNext()) {
          const next = iterator.getNext();
          const inRange = count < this.limit_ && this.withinDirectionalStart(next) && this.withinDirectionalEnd(next);
          if (inRange) {
            count++;
          } else {
            filtered = filtered.updateImmediateChild(next.name, ChildrenNode.EMPTY_NODE);
          }
        }
      }
    }
    return this.rangedFilter_.getIndexedFilter().updateFullNode(oldSnap, filtered, optChangeAccumulator);
  }
  updatePriority(oldSnap, newPriority) {
    return oldSnap;
  }
  filtersNodes() {
    return true;
  }
  getIndexedFilter() {
    return this.rangedFilter_.getIndexedFilter();
  }
  getIndex() {
    return this.index_;
  }
  fullLimitUpdateChild_(snap, childKey, childSnap, source, changeAccumulator) {
    let cmp;
    if (this.reverse_) {
      const indexCmp = this.index_.getCompare();
      cmp = (a, b) => indexCmp(b, a);
    } else {
      cmp = this.index_.getCompare();
    }
    const oldEventCache = snap;
    assert(oldEventCache.numChildren() === this.limit_, "");
    const newChildNamedNode = new NamedNode(childKey, childSnap);
    const windowBoundary = this.reverse_ ? oldEventCache.getFirstChild(this.index_) : oldEventCache.getLastChild(this.index_);
    const inRange = this.rangedFilter_.matches(newChildNamedNode);
    if (oldEventCache.hasChild(childKey)) {
      const oldChildSnap = oldEventCache.getImmediateChild(childKey);
      let nextChild = source.getChildAfterChild(this.index_, windowBoundary, this.reverse_);
      while (nextChild != null && (nextChild.name === childKey || oldEventCache.hasChild(nextChild.name))) {
        nextChild = source.getChildAfterChild(this.index_, nextChild, this.reverse_);
      }
      const compareNext = nextChild == null ? 1 : cmp(nextChild, newChildNamedNode);
      const remainsInWindow = inRange && !childSnap.isEmpty() && compareNext >= 0;
      if (remainsInWindow) {
        if (changeAccumulator != null) {
          changeAccumulator.trackChildChange(changeChildChanged(childKey, childSnap, oldChildSnap));
        }
        return oldEventCache.updateImmediateChild(childKey, childSnap);
      } else {
        if (changeAccumulator != null) {
          changeAccumulator.trackChildChange(changeChildRemoved(childKey, oldChildSnap));
        }
        const newEventCache = oldEventCache.updateImmediateChild(childKey, ChildrenNode.EMPTY_NODE);
        const nextChildInRange = nextChild != null && this.rangedFilter_.matches(nextChild);
        if (nextChildInRange) {
          if (changeAccumulator != null) {
            changeAccumulator.trackChildChange(changeChildAdded(nextChild.name, nextChild.node));
          }
          return newEventCache.updateImmediateChild(nextChild.name, nextChild.node);
        } else {
          return newEventCache;
        }
      }
    } else if (childSnap.isEmpty()) {
      return snap;
    } else if (inRange) {
      if (cmp(windowBoundary, newChildNamedNode) >= 0) {
        if (changeAccumulator != null) {
          changeAccumulator.trackChildChange(changeChildRemoved(windowBoundary.name, windowBoundary.node));
          changeAccumulator.trackChildChange(changeChildAdded(childKey, childSnap));
        }
        return oldEventCache.updateImmediateChild(childKey, childSnap).updateImmediateChild(windowBoundary.name, ChildrenNode.EMPTY_NODE);
      } else {
        return snap;
      }
    } else {
      return snap;
    }
  }
};
var QueryParams = class _QueryParams {
  constructor() {
    this.limitSet_ = false;
    this.startSet_ = false;
    this.startNameSet_ = false;
    this.startAfterSet_ = false;
    this.endSet_ = false;
    this.endNameSet_ = false;
    this.endBeforeSet_ = false;
    this.limit_ = 0;
    this.viewFrom_ = "";
    this.indexStartValue_ = null;
    this.indexStartName_ = "";
    this.indexEndValue_ = null;
    this.indexEndName_ = "";
    this.index_ = PRIORITY_INDEX;
  }
  hasStart() {
    return this.startSet_;
  }
  /**
   * @returns True if it would return from left.
   */
  isViewFromLeft() {
    if (this.viewFrom_ === "") {
      return this.startSet_;
    } else {
      return this.viewFrom_ === "l";
    }
  }
  /**
   * Only valid to call if hasStart() returns true
   */
  getIndexStartValue() {
    assert(this.startSet_, "Only valid if start has been set");
    return this.indexStartValue_;
  }
  /**
   * Only valid to call if hasStart() returns true.
   * Returns the starting key name for the range defined by these query parameters
   */
  getIndexStartName() {
    assert(this.startSet_, "Only valid if start has been set");
    if (this.startNameSet_) {
      return this.indexStartName_;
    } else {
      return MIN_NAME;
    }
  }
  hasEnd() {
    return this.endSet_;
  }
  /**
   * Only valid to call if hasEnd() returns true.
   */
  getIndexEndValue() {
    assert(this.endSet_, "Only valid if end has been set");
    return this.indexEndValue_;
  }
  /**
   * Only valid to call if hasEnd() returns true.
   * Returns the end key name for the range defined by these query parameters
   */
  getIndexEndName() {
    assert(this.endSet_, "Only valid if end has been set");
    if (this.endNameSet_) {
      return this.indexEndName_;
    } else {
      return MAX_NAME;
    }
  }
  hasLimit() {
    return this.limitSet_;
  }
  /**
   * @returns True if a limit has been set and it has been explicitly anchored
   */
  hasAnchoredLimit() {
    return this.limitSet_ && this.viewFrom_ !== "";
  }
  /**
   * Only valid to call if hasLimit() returns true
   */
  getLimit() {
    assert(this.limitSet_, "Only valid if limit has been set");
    return this.limit_;
  }
  getIndex() {
    return this.index_;
  }
  loadsAllData() {
    return !(this.startSet_ || this.endSet_ || this.limitSet_);
  }
  isDefault() {
    return this.loadsAllData() && this.index_ === PRIORITY_INDEX;
  }
  copy() {
    const copy = new _QueryParams();
    copy.limitSet_ = this.limitSet_;
    copy.limit_ = this.limit_;
    copy.startSet_ = this.startSet_;
    copy.startAfterSet_ = this.startAfterSet_;
    copy.indexStartValue_ = this.indexStartValue_;
    copy.startNameSet_ = this.startNameSet_;
    copy.indexStartName_ = this.indexStartName_;
    copy.endSet_ = this.endSet_;
    copy.endBeforeSet_ = this.endBeforeSet_;
    copy.indexEndValue_ = this.indexEndValue_;
    copy.endNameSet_ = this.endNameSet_;
    copy.indexEndName_ = this.indexEndName_;
    copy.index_ = this.index_;
    copy.viewFrom_ = this.viewFrom_;
    return copy;
  }
};
function queryParamsGetNodeFilter(queryParams) {
  if (queryParams.loadsAllData()) {
    return new IndexedFilter(queryParams.getIndex());
  } else if (queryParams.hasLimit()) {
    return new LimitedFilter(queryParams);
  } else {
    return new RangedFilter(queryParams);
  }
}
function queryParamsLimitToFirst(queryParams, newLimit) {
  const newParams = queryParams.copy();
  newParams.limitSet_ = true;
  newParams.limit_ = newLimit;
  newParams.viewFrom_ = "l";
  return newParams;
}
function queryParamsLimitToLast(queryParams, newLimit) {
  const newParams = queryParams.copy();
  newParams.limitSet_ = true;
  newParams.limit_ = newLimit;
  newParams.viewFrom_ = "r";
  return newParams;
}
function queryParamsStartAt(queryParams, indexValue, key) {
  const newParams = queryParams.copy();
  newParams.startSet_ = true;
  if (indexValue === void 0) {
    indexValue = null;
  }
  newParams.indexStartValue_ = indexValue;
  if (key != null) {
    newParams.startNameSet_ = true;
    newParams.indexStartName_ = key;
  } else {
    newParams.startNameSet_ = false;
    newParams.indexStartName_ = "";
  }
  return newParams;
}
function queryParamsStartAfter(queryParams, indexValue, key) {
  let params;
  if (queryParams.index_ === KEY_INDEX || !!key) {
    params = queryParamsStartAt(queryParams, indexValue, key);
  } else {
    params = queryParamsStartAt(queryParams, indexValue, MAX_NAME);
  }
  params.startAfterSet_ = true;
  return params;
}
function queryParamsEndAt(queryParams, indexValue, key) {
  const newParams = queryParams.copy();
  newParams.endSet_ = true;
  if (indexValue === void 0) {
    indexValue = null;
  }
  newParams.indexEndValue_ = indexValue;
  if (key !== void 0) {
    newParams.endNameSet_ = true;
    newParams.indexEndName_ = key;
  } else {
    newParams.endNameSet_ = false;
    newParams.indexEndName_ = "";
  }
  return newParams;
}
function queryParamsEndBefore(queryParams, indexValue, key) {
  let params;
  if (queryParams.index_ === KEY_INDEX || !!key) {
    params = queryParamsEndAt(queryParams, indexValue, key);
  } else {
    params = queryParamsEndAt(queryParams, indexValue, MIN_NAME);
  }
  params.endBeforeSet_ = true;
  return params;
}
function queryParamsOrderBy(queryParams, index) {
  const newParams = queryParams.copy();
  newParams.index_ = index;
  return newParams;
}
function queryParamsToRestQueryStringParameters(queryParams) {
  const qs = {};
  if (queryParams.isDefault()) {
    return qs;
  }
  let orderBy;
  if (queryParams.index_ === PRIORITY_INDEX) {
    orderBy = "$priority";
  } else if (queryParams.index_ === VALUE_INDEX) {
    orderBy = "$value";
  } else if (queryParams.index_ === KEY_INDEX) {
    orderBy = "$key";
  } else {
    assert(queryParams.index_ instanceof PathIndex, "Unrecognized index type!");
    orderBy = queryParams.index_.toString();
  }
  qs[
    "orderBy"
    /* REST_QUERY_CONSTANTS.ORDER_BY */
  ] = stringify(orderBy);
  if (queryParams.startSet_) {
    const startParam = queryParams.startAfterSet_ ? "startAfter" : "startAt";
    qs[startParam] = stringify(queryParams.indexStartValue_);
    if (queryParams.startNameSet_) {
      qs[startParam] += "," + stringify(queryParams.indexStartName_);
    }
  }
  if (queryParams.endSet_) {
    const endParam = queryParams.endBeforeSet_ ? "endBefore" : "endAt";
    qs[endParam] = stringify(queryParams.indexEndValue_);
    if (queryParams.endNameSet_) {
      qs[endParam] += "," + stringify(queryParams.indexEndName_);
    }
  }
  if (queryParams.limitSet_) {
    if (queryParams.isViewFromLeft()) {
      qs[
        "limitToFirst"
        /* REST_QUERY_CONSTANTS.LIMIT_TO_FIRST */
      ] = queryParams.limit_;
    } else {
      qs[
        "limitToLast"
        /* REST_QUERY_CONSTANTS.LIMIT_TO_LAST */
      ] = queryParams.limit_;
    }
  }
  return qs;
}
function queryParamsGetQueryObject(queryParams) {
  const obj = {};
  if (queryParams.startSet_) {
    obj[
      "sp"
      /* WIRE_PROTOCOL_CONSTANTS.INDEX_START_VALUE */
    ] = queryParams.indexStartValue_;
    if (queryParams.startNameSet_) {
      obj[
        "sn"
        /* WIRE_PROTOCOL_CONSTANTS.INDEX_START_NAME */
      ] = queryParams.indexStartName_;
    }
    obj[
      "sin"
      /* WIRE_PROTOCOL_CONSTANTS.INDEX_START_IS_INCLUSIVE */
    ] = !queryParams.startAfterSet_;
  }
  if (queryParams.endSet_) {
    obj[
      "ep"
      /* WIRE_PROTOCOL_CONSTANTS.INDEX_END_VALUE */
    ] = queryParams.indexEndValue_;
    if (queryParams.endNameSet_) {
      obj[
        "en"
        /* WIRE_PROTOCOL_CONSTANTS.INDEX_END_NAME */
      ] = queryParams.indexEndName_;
    }
    obj[
      "ein"
      /* WIRE_PROTOCOL_CONSTANTS.INDEX_END_IS_INCLUSIVE */
    ] = !queryParams.endBeforeSet_;
  }
  if (queryParams.limitSet_) {
    obj[
      "l"
      /* WIRE_PROTOCOL_CONSTANTS.LIMIT */
    ] = queryParams.limit_;
    let viewFrom = queryParams.viewFrom_;
    if (viewFrom === "") {
      if (queryParams.isViewFromLeft()) {
        viewFrom = "l";
      } else {
        viewFrom = "r";
      }
    }
    obj[
      "vf"
      /* WIRE_PROTOCOL_CONSTANTS.VIEW_FROM */
    ] = viewFrom;
  }
  if (queryParams.index_ !== PRIORITY_INDEX) {
    obj[
      "i"
      /* WIRE_PROTOCOL_CONSTANTS.INDEX */
    ] = queryParams.index_.toString();
  }
  return obj;
}
var ReadonlyRestClient = class _ReadonlyRestClient extends ServerActions {
  /**
   * @param repoInfo_ - Data about the namespace we are connecting to
   * @param onDataUpdate_ - A callback for new data from the server
   */
  constructor(repoInfo_, onDataUpdate_, authTokenProvider_, appCheckTokenProvider_) {
    super();
    this.repoInfo_ = repoInfo_;
    this.onDataUpdate_ = onDataUpdate_;
    this.authTokenProvider_ = authTokenProvider_;
    this.appCheckTokenProvider_ = appCheckTokenProvider_;
    this.log_ = logWrapper("p:rest:");
    this.listens_ = {};
  }
  reportStats(stats) {
    throw new Error("Method not implemented.");
  }
  static getListenId_(query3, tag) {
    if (tag !== void 0) {
      return "tag$" + tag;
    } else {
      assert(query3._queryParams.isDefault(), "should have a tag if it's not a default query.");
      return query3._path.toString();
    }
  }
  /** @inheritDoc */
  listen(query3, currentHashFn, tag, onComplete) {
    const pathString = query3._path.toString();
    this.log_("Listen called for " + pathString + " " + query3._queryIdentifier);
    const listenId = _ReadonlyRestClient.getListenId_(query3, tag);
    const thisListen = {};
    this.listens_[listenId] = thisListen;
    const queryStringParameters = queryParamsToRestQueryStringParameters(query3._queryParams);
    this.restRequest_(pathString + ".json", queryStringParameters, (error2, result) => {
      let data = result;
      if (error2 === 404) {
        data = null;
        error2 = null;
      }
      if (error2 === null) {
        this.onDataUpdate_(
          pathString,
          data,
          /*isMerge=*/
          false,
          tag
        );
      }
      if (safeGet(this.listens_, listenId) === thisListen) {
        let status;
        if (!error2) {
          status = "ok";
        } else if (error2 === 401) {
          status = "permission_denied";
        } else {
          status = "rest_error:" + error2;
        }
        onComplete(status, null);
      }
    });
  }
  /** @inheritDoc */
  unlisten(query3, tag) {
    const listenId = _ReadonlyRestClient.getListenId_(query3, tag);
    delete this.listens_[listenId];
  }
  get(query3) {
    const queryStringParameters = queryParamsToRestQueryStringParameters(query3._queryParams);
    const pathString = query3._path.toString();
    const deferred = new Deferred();
    this.restRequest_(pathString + ".json", queryStringParameters, (error2, result) => {
      let data = result;
      if (error2 === 404) {
        data = null;
        error2 = null;
      }
      if (error2 === null) {
        this.onDataUpdate_(
          pathString,
          data,
          /*isMerge=*/
          false,
          /*tag=*/
          null
        );
        deferred.resolve(data);
      } else {
        deferred.reject(new Error(data));
      }
    });
    return deferred.promise;
  }
  /** @inheritDoc */
  refreshAuthToken(token) {
  }
  /**
   * Performs a REST request to the given path, with the provided query string parameters,
   * and any auth credentials we have.
   */
  restRequest_(pathString, queryStringParameters = {}, callback) {
    queryStringParameters["format"] = "export";
    return Promise.all([this.authTokenProvider_.getToken(
      /*forceRefresh=*/
      false
    ), this.appCheckTokenProvider_.getToken(
      /*forceRefresh=*/
      false
    )]).then(([authToken, appCheckToken]) => {
      if (authToken && authToken.accessToken) {
        queryStringParameters["auth"] = authToken.accessToken;
      }
      if (appCheckToken && appCheckToken.token) {
        queryStringParameters["ac"] = appCheckToken.token;
      }
      const url = (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host + pathString + "?ns=" + this.repoInfo_.namespace + querystring(queryStringParameters);
      this.log_("Sending REST request for " + url);
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (callback && xhr.readyState === 4) {
          this.log_("REST Response for " + url + " received. status:", xhr.status, "response:", xhr.responseText);
          let res = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              res = jsonEval(xhr.responseText);
            } catch (e) {
              warn("Failed to parse JSON response for " + url + ": " + xhr.responseText);
            }
            callback(null, res);
          } else {
            if (xhr.status !== 401 && xhr.status !== 404) {
              warn("Got unsuccessful REST response for " + url + " Status: " + xhr.status);
            }
            callback(xhr.status);
          }
          callback = null;
        }
      };
      xhr.open(
        "GET",
        url,
        /*asynchronous=*/
        true
      );
      xhr.send();
    });
  }
};
var SnapshotHolder = class {
  constructor() {
    this.rootNode_ = ChildrenNode.EMPTY_NODE;
  }
  getNode(path) {
    return this.rootNode_.getChild(path);
  }
  updateSnapshot(path, newSnapshotNode) {
    this.rootNode_ = this.rootNode_.updateChild(path, newSnapshotNode);
  }
};
function newSparseSnapshotTree() {
  return {
    value: null,
    children: /* @__PURE__ */ new Map()
  };
}
function sparseSnapshotTreeRemember(sparseSnapshotTree, path, data) {
  if (pathIsEmpty(path)) {
    sparseSnapshotTree.value = data;
    sparseSnapshotTree.children.clear();
  } else if (sparseSnapshotTree.value !== null) {
    sparseSnapshotTree.value = sparseSnapshotTree.value.updateChild(path, data);
  } else {
    const childKey = pathGetFront(path);
    if (!sparseSnapshotTree.children.has(childKey)) {
      sparseSnapshotTree.children.set(childKey, newSparseSnapshotTree());
    }
    const child3 = sparseSnapshotTree.children.get(childKey);
    path = pathPopFront(path);
    sparseSnapshotTreeRemember(child3, path, data);
  }
}
function sparseSnapshotTreeForget(sparseSnapshotTree, path) {
  if (pathIsEmpty(path)) {
    sparseSnapshotTree.value = null;
    sparseSnapshotTree.children.clear();
    return true;
  } else {
    if (sparseSnapshotTree.value !== null) {
      if (sparseSnapshotTree.value.isLeafNode()) {
        return false;
      } else {
        const value = sparseSnapshotTree.value;
        sparseSnapshotTree.value = null;
        value.forEachChild(PRIORITY_INDEX, (key, tree) => {
          sparseSnapshotTreeRemember(sparseSnapshotTree, new Path(key), tree);
        });
        return sparseSnapshotTreeForget(sparseSnapshotTree, path);
      }
    } else if (sparseSnapshotTree.children.size > 0) {
      const childKey = pathGetFront(path);
      path = pathPopFront(path);
      if (sparseSnapshotTree.children.has(childKey)) {
        const safeToRemove = sparseSnapshotTreeForget(sparseSnapshotTree.children.get(childKey), path);
        if (safeToRemove) {
          sparseSnapshotTree.children.delete(childKey);
        }
      }
      return sparseSnapshotTree.children.size === 0;
    } else {
      return true;
    }
  }
}
function sparseSnapshotTreeForEachTree(sparseSnapshotTree, prefixPath, func) {
  if (sparseSnapshotTree.value !== null) {
    func(prefixPath, sparseSnapshotTree.value);
  } else {
    sparseSnapshotTreeForEachChild(sparseSnapshotTree, (key, tree) => {
      const path = new Path(prefixPath.toString() + "/" + key);
      sparseSnapshotTreeForEachTree(tree, path, func);
    });
  }
}
function sparseSnapshotTreeForEachChild(sparseSnapshotTree, func) {
  sparseSnapshotTree.children.forEach((tree, key) => {
    func(key, tree);
  });
}
var StatsListener = class {
  constructor(collection_) {
    this.collection_ = collection_;
    this.last_ = null;
  }
  get() {
    const newStats = this.collection_.get();
    const delta = Object.assign({}, newStats);
    if (this.last_) {
      each(this.last_, (stat, value) => {
        delta[stat] = delta[stat] - value;
      });
    }
    this.last_ = newStats;
    return delta;
  }
};
var FIRST_STATS_MIN_TIME = 10 * 1e3;
var FIRST_STATS_MAX_TIME = 30 * 1e3;
var REPORT_STATS_INTERVAL = 5 * 60 * 1e3;
var StatsReporter = class {
  constructor(collection, server_) {
    this.server_ = server_;
    this.statsToReport_ = {};
    this.statsListener_ = new StatsListener(collection);
    const timeout = FIRST_STATS_MIN_TIME + (FIRST_STATS_MAX_TIME - FIRST_STATS_MIN_TIME) * Math.random();
    setTimeoutNonBlocking(this.reportStats_.bind(this), Math.floor(timeout));
  }
  reportStats_() {
    const stats = this.statsListener_.get();
    const reportedStats = {};
    let haveStatsToReport = false;
    each(stats, (stat, value) => {
      if (value > 0 && contains(this.statsToReport_, stat)) {
        reportedStats[stat] = value;
        haveStatsToReport = true;
      }
    });
    if (haveStatsToReport) {
      this.server_.reportStats(reportedStats);
    }
    setTimeoutNonBlocking(this.reportStats_.bind(this), Math.floor(Math.random() * 2 * REPORT_STATS_INTERVAL));
  }
};
var OperationType;
(function(OperationType2) {
  OperationType2[OperationType2["OVERWRITE"] = 0] = "OVERWRITE";
  OperationType2[OperationType2["MERGE"] = 1] = "MERGE";
  OperationType2[OperationType2["ACK_USER_WRITE"] = 2] = "ACK_USER_WRITE";
  OperationType2[OperationType2["LISTEN_COMPLETE"] = 3] = "LISTEN_COMPLETE";
})(OperationType || (OperationType = {}));
function newOperationSourceUser() {
  return {
    fromUser: true,
    fromServer: false,
    queryId: null,
    tagged: false
  };
}
function newOperationSourceServer() {
  return {
    fromUser: false,
    fromServer: true,
    queryId: null,
    tagged: false
  };
}
function newOperationSourceServerTaggedQuery(queryId) {
  return {
    fromUser: false,
    fromServer: true,
    queryId,
    tagged: true
  };
}
var AckUserWrite = class _AckUserWrite {
  /**
   * @param affectedTree - A tree containing true for each affected path. Affected paths can't overlap.
   */
  constructor(path, affectedTree, revert) {
    this.path = path;
    this.affectedTree = affectedTree;
    this.revert = revert;
    this.type = OperationType.ACK_USER_WRITE;
    this.source = newOperationSourceUser();
  }
  operationForChild(childName) {
    if (!pathIsEmpty(this.path)) {
      assert(pathGetFront(this.path) === childName, "operationForChild called for unrelated child.");
      return new _AckUserWrite(pathPopFront(this.path), this.affectedTree, this.revert);
    } else if (this.affectedTree.value != null) {
      assert(this.affectedTree.children.isEmpty(), "affectedTree should not have overlapping affected paths.");
      return this;
    } else {
      const childTree = this.affectedTree.subtree(new Path(childName));
      return new _AckUserWrite(newEmptyPath(), childTree, this.revert);
    }
  }
};
var ListenComplete = class _ListenComplete {
  constructor(source, path) {
    this.source = source;
    this.path = path;
    this.type = OperationType.LISTEN_COMPLETE;
  }
  operationForChild(childName) {
    if (pathIsEmpty(this.path)) {
      return new _ListenComplete(this.source, newEmptyPath());
    } else {
      return new _ListenComplete(this.source, pathPopFront(this.path));
    }
  }
};
var Overwrite = class _Overwrite {
  constructor(source, path, snap) {
    this.source = source;
    this.path = path;
    this.snap = snap;
    this.type = OperationType.OVERWRITE;
  }
  operationForChild(childName) {
    if (pathIsEmpty(this.path)) {
      return new _Overwrite(this.source, newEmptyPath(), this.snap.getImmediateChild(childName));
    } else {
      return new _Overwrite(this.source, pathPopFront(this.path), this.snap);
    }
  }
};
var Merge = class _Merge {
  constructor(source, path, children) {
    this.source = source;
    this.path = path;
    this.children = children;
    this.type = OperationType.MERGE;
  }
  operationForChild(childName) {
    if (pathIsEmpty(this.path)) {
      const childTree = this.children.subtree(new Path(childName));
      if (childTree.isEmpty()) {
        return null;
      } else if (childTree.value) {
        return new Overwrite(this.source, newEmptyPath(), childTree.value);
      } else {
        return new _Merge(this.source, newEmptyPath(), childTree);
      }
    } else {
      assert(pathGetFront(this.path) === childName, "Can't get a merge for a child not on the path of the operation");
      return new _Merge(this.source, pathPopFront(this.path), this.children);
    }
  }
  toString() {
    return "Operation(" + this.path + ": " + this.source.toString() + " merge: " + this.children.toString() + ")";
  }
};
var CacheNode = class {
  constructor(node_, fullyInitialized_, filtered_) {
    this.node_ = node_;
    this.fullyInitialized_ = fullyInitialized_;
    this.filtered_ = filtered_;
  }
  /**
   * Returns whether this node was fully initialized with either server data or a complete overwrite by the client
   */
  isFullyInitialized() {
    return this.fullyInitialized_;
  }
  /**
   * Returns whether this node is potentially missing children due to a filter applied to the node
   */
  isFiltered() {
    return this.filtered_;
  }
  isCompleteForPath(path) {
    if (pathIsEmpty(path)) {
      return this.isFullyInitialized() && !this.filtered_;
    }
    const childKey = pathGetFront(path);
    return this.isCompleteForChild(childKey);
  }
  isCompleteForChild(key) {
    return this.isFullyInitialized() && !this.filtered_ || this.node_.hasChild(key);
  }
  getNode() {
    return this.node_;
  }
};
var EventGenerator = class {
  constructor(query_) {
    this.query_ = query_;
    this.index_ = this.query_._queryParams.getIndex();
  }
};
function eventGeneratorGenerateEventsForChanges(eventGenerator, changes, eventCache, eventRegistrations) {
  const events = [];
  const moves = [];
  changes.forEach((change) => {
    if (change.type === "child_changed" && eventGenerator.index_.indexedValueChanged(change.oldSnap, change.snapshotNode)) {
      moves.push(changeChildMoved(change.childName, change.snapshotNode));
    }
  });
  eventGeneratorGenerateEventsForType(eventGenerator, events, "child_removed", changes, eventRegistrations, eventCache);
  eventGeneratorGenerateEventsForType(eventGenerator, events, "child_added", changes, eventRegistrations, eventCache);
  eventGeneratorGenerateEventsForType(eventGenerator, events, "child_moved", moves, eventRegistrations, eventCache);
  eventGeneratorGenerateEventsForType(eventGenerator, events, "child_changed", changes, eventRegistrations, eventCache);
  eventGeneratorGenerateEventsForType(eventGenerator, events, "value", changes, eventRegistrations, eventCache);
  return events;
}
function eventGeneratorGenerateEventsForType(eventGenerator, events, eventType, changes, registrations, eventCache) {
  const filteredChanges = changes.filter((change) => change.type === eventType);
  filteredChanges.sort((a, b) => eventGeneratorCompareChanges(eventGenerator, a, b));
  filteredChanges.forEach((change) => {
    const materializedChange = eventGeneratorMaterializeSingleChange(eventGenerator, change, eventCache);
    registrations.forEach((registration) => {
      if (registration.respondsTo(change.type)) {
        events.push(registration.createEvent(materializedChange, eventGenerator.query_));
      }
    });
  });
}
function eventGeneratorMaterializeSingleChange(eventGenerator, change, eventCache) {
  if (change.type === "value" || change.type === "child_removed") {
    return change;
  } else {
    change.prevName = eventCache.getPredecessorChildName(change.childName, change.snapshotNode, eventGenerator.index_);
    return change;
  }
}
function eventGeneratorCompareChanges(eventGenerator, a, b) {
  if (a.childName == null || b.childName == null) {
    throw assertionError("Should only compare child_ events.");
  }
  const aWrapped = new NamedNode(a.childName, a.snapshotNode);
  const bWrapped = new NamedNode(b.childName, b.snapshotNode);
  return eventGenerator.index_.compare(aWrapped, bWrapped);
}
function newViewCache(eventCache, serverCache) {
  return {
    eventCache,
    serverCache
  };
}
function viewCacheUpdateEventSnap(viewCache, eventSnap, complete, filtered) {
  return newViewCache(new CacheNode(eventSnap, complete, filtered), viewCache.serverCache);
}
function viewCacheUpdateServerSnap(viewCache, serverSnap, complete, filtered) {
  return newViewCache(viewCache.eventCache, new CacheNode(serverSnap, complete, filtered));
}
function viewCacheGetCompleteEventSnap(viewCache) {
  return viewCache.eventCache.isFullyInitialized() ? viewCache.eventCache.getNode() : null;
}
function viewCacheGetCompleteServerSnap(viewCache) {
  return viewCache.serverCache.isFullyInitialized() ? viewCache.serverCache.getNode() : null;
}
var emptyChildrenSingleton;
var EmptyChildren = () => {
  if (!emptyChildrenSingleton) {
    emptyChildrenSingleton = new SortedMap(stringCompare);
  }
  return emptyChildrenSingleton;
};
var ImmutableTree = class _ImmutableTree {
  constructor(value, children = EmptyChildren()) {
    this.value = value;
    this.children = children;
  }
  static fromObject(obj) {
    let tree = new _ImmutableTree(null);
    each(obj, (childPath, childSnap) => {
      tree = tree.set(new Path(childPath), childSnap);
    });
    return tree;
  }
  /**
   * True if the value is empty and there are no children
   */
  isEmpty() {
    return this.value === null && this.children.isEmpty();
  }
  /**
   * Given a path and predicate, return the first node and the path to that node
   * where the predicate returns true.
   *
   * TODO Do a perf test -- If we're creating a bunch of `{path: value:}`
   * objects on the way back out, it may be better to pass down a pathSoFar obj.
   *
   * @param relativePath - The remainder of the path
   * @param predicate - The predicate to satisfy to return a node
   */
  findRootMostMatchingPathAndValue(relativePath, predicate) {
    if (this.value != null && predicate(this.value)) {
      return {
        path: newEmptyPath(),
        value: this.value
      };
    } else {
      if (pathIsEmpty(relativePath)) {
        return null;
      } else {
        const front = pathGetFront(relativePath);
        const child3 = this.children.get(front);
        if (child3 !== null) {
          const childExistingPathAndValue = child3.findRootMostMatchingPathAndValue(pathPopFront(relativePath), predicate);
          if (childExistingPathAndValue != null) {
            const fullPath = pathChild(new Path(front), childExistingPathAndValue.path);
            return {
              path: fullPath,
              value: childExistingPathAndValue.value
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    }
  }
  /**
   * Find, if it exists, the shortest subpath of the given path that points a defined
   * value in the tree
   */
  findRootMostValueAndPath(relativePath) {
    return this.findRootMostMatchingPathAndValue(relativePath, () => true);
  }
  /**
   * @returns The subtree at the given path
   */
  subtree(relativePath) {
    if (pathIsEmpty(relativePath)) {
      return this;
    } else {
      const front = pathGetFront(relativePath);
      const childTree = this.children.get(front);
      if (childTree !== null) {
        return childTree.subtree(pathPopFront(relativePath));
      } else {
        return new _ImmutableTree(null);
      }
    }
  }
  /**
   * Sets a value at the specified path.
   *
   * @param relativePath - Path to set value at.
   * @param toSet - Value to set.
   * @returns Resulting tree.
   */
  set(relativePath, toSet) {
    if (pathIsEmpty(relativePath)) {
      return new _ImmutableTree(toSet, this.children);
    } else {
      const front = pathGetFront(relativePath);
      const child3 = this.children.get(front) || new _ImmutableTree(null);
      const newChild = child3.set(pathPopFront(relativePath), toSet);
      const newChildren = this.children.insert(front, newChild);
      return new _ImmutableTree(this.value, newChildren);
    }
  }
  /**
   * Removes the value at the specified path.
   *
   * @param relativePath - Path to value to remove.
   * @returns Resulting tree.
   */
  remove(relativePath) {
    if (pathIsEmpty(relativePath)) {
      if (this.children.isEmpty()) {
        return new _ImmutableTree(null);
      } else {
        return new _ImmutableTree(null, this.children);
      }
    } else {
      const front = pathGetFront(relativePath);
      const child3 = this.children.get(front);
      if (child3) {
        const newChild = child3.remove(pathPopFront(relativePath));
        let newChildren;
        if (newChild.isEmpty()) {
          newChildren = this.children.remove(front);
        } else {
          newChildren = this.children.insert(front, newChild);
        }
        if (this.value === null && newChildren.isEmpty()) {
          return new _ImmutableTree(null);
        } else {
          return new _ImmutableTree(this.value, newChildren);
        }
      } else {
        return this;
      }
    }
  }
  /**
   * Gets a value from the tree.
   *
   * @param relativePath - Path to get value for.
   * @returns Value at path, or null.
   */
  get(relativePath) {
    if (pathIsEmpty(relativePath)) {
      return this.value;
    } else {
      const front = pathGetFront(relativePath);
      const child3 = this.children.get(front);
      if (child3) {
        return child3.get(pathPopFront(relativePath));
      } else {
        return null;
      }
    }
  }
  /**
   * Replace the subtree at the specified path with the given new tree.
   *
   * @param relativePath - Path to replace subtree for.
   * @param newTree - New tree.
   * @returns Resulting tree.
   */
  setTree(relativePath, newTree) {
    if (pathIsEmpty(relativePath)) {
      return newTree;
    } else {
      const front = pathGetFront(relativePath);
      const child3 = this.children.get(front) || new _ImmutableTree(null);
      const newChild = child3.setTree(pathPopFront(relativePath), newTree);
      let newChildren;
      if (newChild.isEmpty()) {
        newChildren = this.children.remove(front);
      } else {
        newChildren = this.children.insert(front, newChild);
      }
      return new _ImmutableTree(this.value, newChildren);
    }
  }
  /**
   * Performs a depth first fold on this tree. Transforms a tree into a single
   * value, given a function that operates on the path to a node, an optional
   * current value, and a map of child names to folded subtrees
   */
  fold(fn) {
    return this.fold_(newEmptyPath(), fn);
  }
  /**
   * Recursive helper for public-facing fold() method
   */
  fold_(pathSoFar, fn) {
    const accum = {};
    this.children.inorderTraversal((childKey, childTree) => {
      accum[childKey] = childTree.fold_(pathChild(pathSoFar, childKey), fn);
    });
    return fn(pathSoFar, this.value, accum);
  }
  /**
   * Find the first matching value on the given path. Return the result of applying f to it.
   */
  findOnPath(path, f) {
    return this.findOnPath_(path, newEmptyPath(), f);
  }
  findOnPath_(pathToFollow, pathSoFar, f) {
    const result = this.value ? f(pathSoFar, this.value) : false;
    if (result) {
      return result;
    } else {
      if (pathIsEmpty(pathToFollow)) {
        return null;
      } else {
        const front = pathGetFront(pathToFollow);
        const nextChild = this.children.get(front);
        if (nextChild) {
          return nextChild.findOnPath_(pathPopFront(pathToFollow), pathChild(pathSoFar, front), f);
        } else {
          return null;
        }
      }
    }
  }
  foreachOnPath(path, f) {
    return this.foreachOnPath_(path, newEmptyPath(), f);
  }
  foreachOnPath_(pathToFollow, currentRelativePath, f) {
    if (pathIsEmpty(pathToFollow)) {
      return this;
    } else {
      if (this.value) {
        f(currentRelativePath, this.value);
      }
      const front = pathGetFront(pathToFollow);
      const nextChild = this.children.get(front);
      if (nextChild) {
        return nextChild.foreachOnPath_(pathPopFront(pathToFollow), pathChild(currentRelativePath, front), f);
      } else {
        return new _ImmutableTree(null);
      }
    }
  }
  /**
   * Calls the given function for each node in the tree that has a value.
   *
   * @param f - A function to be called with the path from the root of the tree to
   * a node, and the value at that node. Called in depth-first order.
   */
  foreach(f) {
    this.foreach_(newEmptyPath(), f);
  }
  foreach_(currentRelativePath, f) {
    this.children.inorderTraversal((childName, childTree) => {
      childTree.foreach_(pathChild(currentRelativePath, childName), f);
    });
    if (this.value) {
      f(currentRelativePath, this.value);
    }
  }
  foreachChild(f) {
    this.children.inorderTraversal((childName, childTree) => {
      if (childTree.value) {
        f(childName, childTree.value);
      }
    });
  }
};
var CompoundWrite = class _CompoundWrite {
  constructor(writeTree_) {
    this.writeTree_ = writeTree_;
  }
  static empty() {
    return new _CompoundWrite(new ImmutableTree(null));
  }
};
function compoundWriteAddWrite(compoundWrite, path, node) {
  if (pathIsEmpty(path)) {
    return new CompoundWrite(new ImmutableTree(node));
  } else {
    const rootmost = compoundWrite.writeTree_.findRootMostValueAndPath(path);
    if (rootmost != null) {
      const rootMostPath = rootmost.path;
      let value = rootmost.value;
      const relativePath = newRelativePath(rootMostPath, path);
      value = value.updateChild(relativePath, node);
      return new CompoundWrite(compoundWrite.writeTree_.set(rootMostPath, value));
    } else {
      const subtree = new ImmutableTree(node);
      const newWriteTree2 = compoundWrite.writeTree_.setTree(path, subtree);
      return new CompoundWrite(newWriteTree2);
    }
  }
}
function compoundWriteAddWrites(compoundWrite, path, updates) {
  let newWrite = compoundWrite;
  each(updates, (childKey, node) => {
    newWrite = compoundWriteAddWrite(newWrite, pathChild(path, childKey), node);
  });
  return newWrite;
}
function compoundWriteRemoveWrite(compoundWrite, path) {
  if (pathIsEmpty(path)) {
    return CompoundWrite.empty();
  } else {
    const newWriteTree2 = compoundWrite.writeTree_.setTree(path, new ImmutableTree(null));
    return new CompoundWrite(newWriteTree2);
  }
}
function compoundWriteHasCompleteWrite(compoundWrite, path) {
  return compoundWriteGetCompleteNode(compoundWrite, path) != null;
}
function compoundWriteGetCompleteNode(compoundWrite, path) {
  const rootmost = compoundWrite.writeTree_.findRootMostValueAndPath(path);
  if (rootmost != null) {
    return compoundWrite.writeTree_.get(rootmost.path).getChild(newRelativePath(rootmost.path, path));
  } else {
    return null;
  }
}
function compoundWriteGetCompleteChildren(compoundWrite) {
  const children = [];
  const node = compoundWrite.writeTree_.value;
  if (node != null) {
    if (!node.isLeafNode()) {
      node.forEachChild(PRIORITY_INDEX, (childName, childNode) => {
        children.push(new NamedNode(childName, childNode));
      });
    }
  } else {
    compoundWrite.writeTree_.children.inorderTraversal((childName, childTree) => {
      if (childTree.value != null) {
        children.push(new NamedNode(childName, childTree.value));
      }
    });
  }
  return children;
}
function compoundWriteChildCompoundWrite(compoundWrite, path) {
  if (pathIsEmpty(path)) {
    return compoundWrite;
  } else {
    const shadowingNode = compoundWriteGetCompleteNode(compoundWrite, path);
    if (shadowingNode != null) {
      return new CompoundWrite(new ImmutableTree(shadowingNode));
    } else {
      return new CompoundWrite(compoundWrite.writeTree_.subtree(path));
    }
  }
}
function compoundWriteIsEmpty(compoundWrite) {
  return compoundWrite.writeTree_.isEmpty();
}
function compoundWriteApply(compoundWrite, node) {
  return applySubtreeWrite(newEmptyPath(), compoundWrite.writeTree_, node);
}
function applySubtreeWrite(relativePath, writeTree, node) {
  if (writeTree.value != null) {
    return node.updateChild(relativePath, writeTree.value);
  } else {
    let priorityWrite = null;
    writeTree.children.inorderTraversal((childKey, childTree) => {
      if (childKey === ".priority") {
        assert(childTree.value !== null, "Priority writes must always be leaf nodes");
        priorityWrite = childTree.value;
      } else {
        node = applySubtreeWrite(pathChild(relativePath, childKey), childTree, node);
      }
    });
    if (!node.getChild(relativePath).isEmpty() && priorityWrite !== null) {
      node = node.updateChild(pathChild(relativePath, ".priority"), priorityWrite);
    }
    return node;
  }
}
function writeTreeChildWrites(writeTree, path) {
  return newWriteTreeRef(path, writeTree);
}
function writeTreeAddOverwrite(writeTree, path, snap, writeId, visible) {
  assert(writeId > writeTree.lastWriteId, "Stacking an older write on top of newer ones");
  if (visible === void 0) {
    visible = true;
  }
  writeTree.allWrites.push({
    path,
    snap,
    writeId,
    visible
  });
  if (visible) {
    writeTree.visibleWrites = compoundWriteAddWrite(writeTree.visibleWrites, path, snap);
  }
  writeTree.lastWriteId = writeId;
}
function writeTreeAddMerge(writeTree, path, changedChildren, writeId) {
  assert(writeId > writeTree.lastWriteId, "Stacking an older merge on top of newer ones");
  writeTree.allWrites.push({
    path,
    children: changedChildren,
    writeId,
    visible: true
  });
  writeTree.visibleWrites = compoundWriteAddWrites(writeTree.visibleWrites, path, changedChildren);
  writeTree.lastWriteId = writeId;
}
function writeTreeGetWrite(writeTree, writeId) {
  for (let i = 0; i < writeTree.allWrites.length; i++) {
    const record = writeTree.allWrites[i];
    if (record.writeId === writeId) {
      return record;
    }
  }
  return null;
}
function writeTreeRemoveWrite(writeTree, writeId) {
  const idx = writeTree.allWrites.findIndex((s) => {
    return s.writeId === writeId;
  });
  assert(idx >= 0, "removeWrite called with nonexistent writeId.");
  const writeToRemove = writeTree.allWrites[idx];
  writeTree.allWrites.splice(idx, 1);
  let removedWriteWasVisible = writeToRemove.visible;
  let removedWriteOverlapsWithOtherWrites = false;
  let i = writeTree.allWrites.length - 1;
  while (removedWriteWasVisible && i >= 0) {
    const currentWrite = writeTree.allWrites[i];
    if (currentWrite.visible) {
      if (i >= idx && writeTreeRecordContainsPath_(currentWrite, writeToRemove.path)) {
        removedWriteWasVisible = false;
      } else if (pathContains(writeToRemove.path, currentWrite.path)) {
        removedWriteOverlapsWithOtherWrites = true;
      }
    }
    i--;
  }
  if (!removedWriteWasVisible) {
    return false;
  } else if (removedWriteOverlapsWithOtherWrites) {
    writeTreeResetTree_(writeTree);
    return true;
  } else {
    if (writeToRemove.snap) {
      writeTree.visibleWrites = compoundWriteRemoveWrite(writeTree.visibleWrites, writeToRemove.path);
    } else {
      const children = writeToRemove.children;
      each(children, (childName) => {
        writeTree.visibleWrites = compoundWriteRemoveWrite(writeTree.visibleWrites, pathChild(writeToRemove.path, childName));
      });
    }
    return true;
  }
}
function writeTreeRecordContainsPath_(writeRecord, path) {
  if (writeRecord.snap) {
    return pathContains(writeRecord.path, path);
  } else {
    for (const childName in writeRecord.children) {
      if (writeRecord.children.hasOwnProperty(childName) && pathContains(pathChild(writeRecord.path, childName), path)) {
        return true;
      }
    }
    return false;
  }
}
function writeTreeResetTree_(writeTree) {
  writeTree.visibleWrites = writeTreeLayerTree_(writeTree.allWrites, writeTreeDefaultFilter_, newEmptyPath());
  if (writeTree.allWrites.length > 0) {
    writeTree.lastWriteId = writeTree.allWrites[writeTree.allWrites.length - 1].writeId;
  } else {
    writeTree.lastWriteId = -1;
  }
}
function writeTreeDefaultFilter_(write) {
  return write.visible;
}
function writeTreeLayerTree_(writes, filter, treeRoot) {
  let compoundWrite = CompoundWrite.empty();
  for (let i = 0; i < writes.length; ++i) {
    const write = writes[i];
    if (filter(write)) {
      const writePath = write.path;
      let relativePath;
      if (write.snap) {
        if (pathContains(treeRoot, writePath)) {
          relativePath = newRelativePath(treeRoot, writePath);
          compoundWrite = compoundWriteAddWrite(compoundWrite, relativePath, write.snap);
        } else if (pathContains(writePath, treeRoot)) {
          relativePath = newRelativePath(writePath, treeRoot);
          compoundWrite = compoundWriteAddWrite(compoundWrite, newEmptyPath(), write.snap.getChild(relativePath));
        } else ;
      } else if (write.children) {
        if (pathContains(treeRoot, writePath)) {
          relativePath = newRelativePath(treeRoot, writePath);
          compoundWrite = compoundWriteAddWrites(compoundWrite, relativePath, write.children);
        } else if (pathContains(writePath, treeRoot)) {
          relativePath = newRelativePath(writePath, treeRoot);
          if (pathIsEmpty(relativePath)) {
            compoundWrite = compoundWriteAddWrites(compoundWrite, newEmptyPath(), write.children);
          } else {
            const child3 = safeGet(write.children, pathGetFront(relativePath));
            if (child3) {
              const deepNode = child3.getChild(pathPopFront(relativePath));
              compoundWrite = compoundWriteAddWrite(compoundWrite, newEmptyPath(), deepNode);
            }
          }
        } else ;
      } else {
        throw assertionError("WriteRecord should have .snap or .children");
      }
    }
  }
  return compoundWrite;
}
function writeTreeCalcCompleteEventCache(writeTree, treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
  if (!writeIdsToExclude && !includeHiddenWrites) {
    const shadowingNode = compoundWriteGetCompleteNode(writeTree.visibleWrites, treePath);
    if (shadowingNode != null) {
      return shadowingNode;
    } else {
      const subMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
      if (compoundWriteIsEmpty(subMerge)) {
        return completeServerCache;
      } else if (completeServerCache == null && !compoundWriteHasCompleteWrite(subMerge, newEmptyPath())) {
        return null;
      } else {
        const layeredCache = completeServerCache || ChildrenNode.EMPTY_NODE;
        return compoundWriteApply(subMerge, layeredCache);
      }
    }
  } else {
    const merge2 = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
    if (!includeHiddenWrites && compoundWriteIsEmpty(merge2)) {
      return completeServerCache;
    } else {
      if (!includeHiddenWrites && completeServerCache == null && !compoundWriteHasCompleteWrite(merge2, newEmptyPath())) {
        return null;
      } else {
        const filter = function(write) {
          return (write.visible || includeHiddenWrites) && (!writeIdsToExclude || !~writeIdsToExclude.indexOf(write.writeId)) && (pathContains(write.path, treePath) || pathContains(treePath, write.path));
        };
        const mergeAtPath = writeTreeLayerTree_(writeTree.allWrites, filter, treePath);
        const layeredCache = completeServerCache || ChildrenNode.EMPTY_NODE;
        return compoundWriteApply(mergeAtPath, layeredCache);
      }
    }
  }
}
function writeTreeCalcCompleteEventChildren(writeTree, treePath, completeServerChildren) {
  let completeChildren = ChildrenNode.EMPTY_NODE;
  const topLevelSet = compoundWriteGetCompleteNode(writeTree.visibleWrites, treePath);
  if (topLevelSet) {
    if (!topLevelSet.isLeafNode()) {
      topLevelSet.forEachChild(PRIORITY_INDEX, (childName, childSnap) => {
        completeChildren = completeChildren.updateImmediateChild(childName, childSnap);
      });
    }
    return completeChildren;
  } else if (completeServerChildren) {
    const merge2 = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
    completeServerChildren.forEachChild(PRIORITY_INDEX, (childName, childNode) => {
      const node = compoundWriteApply(compoundWriteChildCompoundWrite(merge2, new Path(childName)), childNode);
      completeChildren = completeChildren.updateImmediateChild(childName, node);
    });
    compoundWriteGetCompleteChildren(merge2).forEach((namedNode) => {
      completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
    });
    return completeChildren;
  } else {
    const merge2 = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
    compoundWriteGetCompleteChildren(merge2).forEach((namedNode) => {
      completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
    });
    return completeChildren;
  }
}
function writeTreeCalcEventCacheAfterServerOverwrite(writeTree, treePath, childPath, existingEventSnap, existingServerSnap) {
  assert(existingEventSnap || existingServerSnap, "Either existingEventSnap or existingServerSnap must exist");
  const path = pathChild(treePath, childPath);
  if (compoundWriteHasCompleteWrite(writeTree.visibleWrites, path)) {
    return null;
  } else {
    const childMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, path);
    if (compoundWriteIsEmpty(childMerge)) {
      return existingServerSnap.getChild(childPath);
    } else {
      return compoundWriteApply(childMerge, existingServerSnap.getChild(childPath));
    }
  }
}
function writeTreeCalcCompleteChild(writeTree, treePath, childKey, existingServerSnap) {
  const path = pathChild(treePath, childKey);
  const shadowingNode = compoundWriteGetCompleteNode(writeTree.visibleWrites, path);
  if (shadowingNode != null) {
    return shadowingNode;
  } else {
    if (existingServerSnap.isCompleteForChild(childKey)) {
      const childMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, path);
      return compoundWriteApply(childMerge, existingServerSnap.getNode().getImmediateChild(childKey));
    } else {
      return null;
    }
  }
}
function writeTreeShadowingWrite(writeTree, path) {
  return compoundWriteGetCompleteNode(writeTree.visibleWrites, path);
}
function writeTreeCalcIndexedSlice(writeTree, treePath, completeServerData, startPost, count, reverse, index) {
  let toIterate;
  const merge2 = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
  const shadowingNode = compoundWriteGetCompleteNode(merge2, newEmptyPath());
  if (shadowingNode != null) {
    toIterate = shadowingNode;
  } else if (completeServerData != null) {
    toIterate = compoundWriteApply(merge2, completeServerData);
  } else {
    return [];
  }
  toIterate = toIterate.withIndex(index);
  if (!toIterate.isEmpty() && !toIterate.isLeafNode()) {
    const nodes = [];
    const cmp = index.getCompare();
    const iter = reverse ? toIterate.getReverseIteratorFrom(startPost, index) : toIterate.getIteratorFrom(startPost, index);
    let next = iter.getNext();
    while (next && nodes.length < count) {
      if (cmp(next, startPost) !== 0) {
        nodes.push(next);
      }
      next = iter.getNext();
    }
    return nodes;
  } else {
    return [];
  }
}
function newWriteTree() {
  return {
    visibleWrites: CompoundWrite.empty(),
    allWrites: [],
    lastWriteId: -1
  };
}
function writeTreeRefCalcCompleteEventCache(writeTreeRef, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
  return writeTreeCalcCompleteEventCache(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites);
}
function writeTreeRefCalcCompleteEventChildren(writeTreeRef, completeServerChildren) {
  return writeTreeCalcCompleteEventChildren(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerChildren);
}
function writeTreeRefCalcEventCacheAfterServerOverwrite(writeTreeRef, path, existingEventSnap, existingServerSnap) {
  return writeTreeCalcEventCacheAfterServerOverwrite(writeTreeRef.writeTree, writeTreeRef.treePath, path, existingEventSnap, existingServerSnap);
}
function writeTreeRefShadowingWrite(writeTreeRef, path) {
  return writeTreeShadowingWrite(writeTreeRef.writeTree, pathChild(writeTreeRef.treePath, path));
}
function writeTreeRefCalcIndexedSlice(writeTreeRef, completeServerData, startPost, count, reverse, index) {
  return writeTreeCalcIndexedSlice(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerData, startPost, count, reverse, index);
}
function writeTreeRefCalcCompleteChild(writeTreeRef, childKey, existingServerCache) {
  return writeTreeCalcCompleteChild(writeTreeRef.writeTree, writeTreeRef.treePath, childKey, existingServerCache);
}
function writeTreeRefChild(writeTreeRef, childName) {
  return newWriteTreeRef(pathChild(writeTreeRef.treePath, childName), writeTreeRef.writeTree);
}
function newWriteTreeRef(path, writeTree) {
  return {
    treePath: path,
    writeTree
  };
}
var ChildChangeAccumulator = class {
  constructor() {
    this.changeMap = /* @__PURE__ */ new Map();
  }
  trackChildChange(change) {
    const type = change.type;
    const childKey = change.childName;
    assert(type === "child_added" || type === "child_changed" || type === "child_removed", "Only child changes supported for tracking");
    assert(childKey !== ".priority", "Only non-priority child changes can be tracked.");
    const oldChange = this.changeMap.get(childKey);
    if (oldChange) {
      const oldType = oldChange.type;
      if (type === "child_added" && oldType === "child_removed") {
        this.changeMap.set(childKey, changeChildChanged(childKey, change.snapshotNode, oldChange.snapshotNode));
      } else if (type === "child_removed" && oldType === "child_added") {
        this.changeMap.delete(childKey);
      } else if (type === "child_removed" && oldType === "child_changed") {
        this.changeMap.set(childKey, changeChildRemoved(childKey, oldChange.oldSnap));
      } else if (type === "child_changed" && oldType === "child_added") {
        this.changeMap.set(childKey, changeChildAdded(childKey, change.snapshotNode));
      } else if (type === "child_changed" && oldType === "child_changed") {
        this.changeMap.set(childKey, changeChildChanged(childKey, change.snapshotNode, oldChange.oldSnap));
      } else {
        throw assertionError("Illegal combination of changes: " + change + " occurred after " + oldChange);
      }
    } else {
      this.changeMap.set(childKey, change);
    }
  }
  getChanges() {
    return Array.from(this.changeMap.values());
  }
};
var NoCompleteChildSource_ = class {
  getCompleteChild(childKey) {
    return null;
  }
  getChildAfterChild(index, child3, reverse) {
    return null;
  }
};
var NO_COMPLETE_CHILD_SOURCE = new NoCompleteChildSource_();
var WriteTreeCompleteChildSource = class {
  constructor(writes_, viewCache_, optCompleteServerCache_ = null) {
    this.writes_ = writes_;
    this.viewCache_ = viewCache_;
    this.optCompleteServerCache_ = optCompleteServerCache_;
  }
  getCompleteChild(childKey) {
    const node = this.viewCache_.eventCache;
    if (node.isCompleteForChild(childKey)) {
      return node.getNode().getImmediateChild(childKey);
    } else {
      const serverNode = this.optCompleteServerCache_ != null ? new CacheNode(this.optCompleteServerCache_, true, false) : this.viewCache_.serverCache;
      return writeTreeRefCalcCompleteChild(this.writes_, childKey, serverNode);
    }
  }
  getChildAfterChild(index, child3, reverse) {
    const completeServerData = this.optCompleteServerCache_ != null ? this.optCompleteServerCache_ : viewCacheGetCompleteServerSnap(this.viewCache_);
    const nodes = writeTreeRefCalcIndexedSlice(this.writes_, completeServerData, child3, 1, reverse, index);
    if (nodes.length === 0) {
      return null;
    } else {
      return nodes[0];
    }
  }
};
function newViewProcessor(filter) {
  return {
    filter
  };
}
function viewProcessorAssertIndexed(viewProcessor, viewCache) {
  assert(viewCache.eventCache.getNode().isIndexed(viewProcessor.filter.getIndex()), "Event snap not indexed");
  assert(viewCache.serverCache.getNode().isIndexed(viewProcessor.filter.getIndex()), "Server snap not indexed");
}
function viewProcessorApplyOperation(viewProcessor, oldViewCache, operation, writesCache, completeCache) {
  const accumulator = new ChildChangeAccumulator();
  let newViewCache2, filterServerNode;
  if (operation.type === OperationType.OVERWRITE) {
    const overwrite = operation;
    if (overwrite.source.fromUser) {
      newViewCache2 = viewProcessorApplyUserOverwrite(viewProcessor, oldViewCache, overwrite.path, overwrite.snap, writesCache, completeCache, accumulator);
    } else {
      assert(overwrite.source.fromServer, "Unknown source.");
      filterServerNode = overwrite.source.tagged || oldViewCache.serverCache.isFiltered() && !pathIsEmpty(overwrite.path);
      newViewCache2 = viewProcessorApplyServerOverwrite(viewProcessor, oldViewCache, overwrite.path, overwrite.snap, writesCache, completeCache, filterServerNode, accumulator);
    }
  } else if (operation.type === OperationType.MERGE) {
    const merge2 = operation;
    if (merge2.source.fromUser) {
      newViewCache2 = viewProcessorApplyUserMerge(viewProcessor, oldViewCache, merge2.path, merge2.children, writesCache, completeCache, accumulator);
    } else {
      assert(merge2.source.fromServer, "Unknown source.");
      filterServerNode = merge2.source.tagged || oldViewCache.serverCache.isFiltered();
      newViewCache2 = viewProcessorApplyServerMerge(viewProcessor, oldViewCache, merge2.path, merge2.children, writesCache, completeCache, filterServerNode, accumulator);
    }
  } else if (operation.type === OperationType.ACK_USER_WRITE) {
    const ackUserWrite = operation;
    if (!ackUserWrite.revert) {
      newViewCache2 = viewProcessorAckUserWrite(viewProcessor, oldViewCache, ackUserWrite.path, ackUserWrite.affectedTree, writesCache, completeCache, accumulator);
    } else {
      newViewCache2 = viewProcessorRevertUserWrite(viewProcessor, oldViewCache, ackUserWrite.path, writesCache, completeCache, accumulator);
    }
  } else if (operation.type === OperationType.LISTEN_COMPLETE) {
    newViewCache2 = viewProcessorListenComplete(viewProcessor, oldViewCache, operation.path, writesCache, accumulator);
  } else {
    throw assertionError("Unknown operation type: " + operation.type);
  }
  const changes = accumulator.getChanges();
  viewProcessorMaybeAddValueEvent(oldViewCache, newViewCache2, changes);
  return {
    viewCache: newViewCache2,
    changes
  };
}
function viewProcessorMaybeAddValueEvent(oldViewCache, newViewCache2, accumulator) {
  const eventSnap = newViewCache2.eventCache;
  if (eventSnap.isFullyInitialized()) {
    const isLeafOrEmpty = eventSnap.getNode().isLeafNode() || eventSnap.getNode().isEmpty();
    const oldCompleteSnap = viewCacheGetCompleteEventSnap(oldViewCache);
    if (accumulator.length > 0 || !oldViewCache.eventCache.isFullyInitialized() || isLeafOrEmpty && !eventSnap.getNode().equals(oldCompleteSnap) || !eventSnap.getNode().getPriority().equals(oldCompleteSnap.getPriority())) {
      accumulator.push(changeValue(viewCacheGetCompleteEventSnap(newViewCache2)));
    }
  }
}
function viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, viewCache, changePath, writesCache, source, accumulator) {
  const oldEventSnap = viewCache.eventCache;
  if (writeTreeRefShadowingWrite(writesCache, changePath) != null) {
    return viewCache;
  } else {
    let newEventCache, serverNode;
    if (pathIsEmpty(changePath)) {
      assert(viewCache.serverCache.isFullyInitialized(), "If change path is empty, we must have complete server data");
      if (viewCache.serverCache.isFiltered()) {
        const serverCache = viewCacheGetCompleteServerSnap(viewCache);
        const completeChildren = serverCache instanceof ChildrenNode ? serverCache : ChildrenNode.EMPTY_NODE;
        const completeEventChildren = writeTreeRefCalcCompleteEventChildren(writesCache, completeChildren);
        newEventCache = viewProcessor.filter.updateFullNode(viewCache.eventCache.getNode(), completeEventChildren, accumulator);
      } else {
        const completeNode = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
        newEventCache = viewProcessor.filter.updateFullNode(viewCache.eventCache.getNode(), completeNode, accumulator);
      }
    } else {
      const childKey = pathGetFront(changePath);
      if (childKey === ".priority") {
        assert(pathGetLength(changePath) === 1, "Can't have a priority with additional path components");
        const oldEventNode = oldEventSnap.getNode();
        serverNode = viewCache.serverCache.getNode();
        const updatedPriority = writeTreeRefCalcEventCacheAfterServerOverwrite(writesCache, changePath, oldEventNode, serverNode);
        if (updatedPriority != null) {
          newEventCache = viewProcessor.filter.updatePriority(oldEventNode, updatedPriority);
        } else {
          newEventCache = oldEventSnap.getNode();
        }
      } else {
        const childChangePath = pathPopFront(changePath);
        let newEventChild;
        if (oldEventSnap.isCompleteForChild(childKey)) {
          serverNode = viewCache.serverCache.getNode();
          const eventChildUpdate = writeTreeRefCalcEventCacheAfterServerOverwrite(writesCache, changePath, oldEventSnap.getNode(), serverNode);
          if (eventChildUpdate != null) {
            newEventChild = oldEventSnap.getNode().getImmediateChild(childKey).updateChild(childChangePath, eventChildUpdate);
          } else {
            newEventChild = oldEventSnap.getNode().getImmediateChild(childKey);
          }
        } else {
          newEventChild = writeTreeRefCalcCompleteChild(writesCache, childKey, viewCache.serverCache);
        }
        if (newEventChild != null) {
          newEventCache = viewProcessor.filter.updateChild(oldEventSnap.getNode(), childKey, newEventChild, childChangePath, source, accumulator);
        } else {
          newEventCache = oldEventSnap.getNode();
        }
      }
    }
    return viewCacheUpdateEventSnap(viewCache, newEventCache, oldEventSnap.isFullyInitialized() || pathIsEmpty(changePath), viewProcessor.filter.filtersNodes());
  }
}
function viewProcessorApplyServerOverwrite(viewProcessor, oldViewCache, changePath, changedSnap, writesCache, completeCache, filterServerNode, accumulator) {
  const oldServerSnap = oldViewCache.serverCache;
  let newServerCache;
  const serverFilter = filterServerNode ? viewProcessor.filter : viewProcessor.filter.getIndexedFilter();
  if (pathIsEmpty(changePath)) {
    newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), changedSnap, null);
  } else if (serverFilter.filtersNodes() && !oldServerSnap.isFiltered()) {
    const newServerNode = oldServerSnap.getNode().updateChild(changePath, changedSnap);
    newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), newServerNode, null);
  } else {
    const childKey = pathGetFront(changePath);
    if (!oldServerSnap.isCompleteForPath(changePath) && pathGetLength(changePath) > 1) {
      return oldViewCache;
    }
    const childChangePath = pathPopFront(changePath);
    const childNode = oldServerSnap.getNode().getImmediateChild(childKey);
    const newChildNode = childNode.updateChild(childChangePath, changedSnap);
    if (childKey === ".priority") {
      newServerCache = serverFilter.updatePriority(oldServerSnap.getNode(), newChildNode);
    } else {
      newServerCache = serverFilter.updateChild(oldServerSnap.getNode(), childKey, newChildNode, childChangePath, NO_COMPLETE_CHILD_SOURCE, null);
    }
  }
  const newViewCache2 = viewCacheUpdateServerSnap(oldViewCache, newServerCache, oldServerSnap.isFullyInitialized() || pathIsEmpty(changePath), serverFilter.filtersNodes());
  const source = new WriteTreeCompleteChildSource(writesCache, newViewCache2, completeCache);
  return viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, newViewCache2, changePath, writesCache, source, accumulator);
}
function viewProcessorApplyUserOverwrite(viewProcessor, oldViewCache, changePath, changedSnap, writesCache, completeCache, accumulator) {
  const oldEventSnap = oldViewCache.eventCache;
  let newViewCache2, newEventCache;
  const source = new WriteTreeCompleteChildSource(writesCache, oldViewCache, completeCache);
  if (pathIsEmpty(changePath)) {
    newEventCache = viewProcessor.filter.updateFullNode(oldViewCache.eventCache.getNode(), changedSnap, accumulator);
    newViewCache2 = viewCacheUpdateEventSnap(oldViewCache, newEventCache, true, viewProcessor.filter.filtersNodes());
  } else {
    const childKey = pathGetFront(changePath);
    if (childKey === ".priority") {
      newEventCache = viewProcessor.filter.updatePriority(oldViewCache.eventCache.getNode(), changedSnap);
      newViewCache2 = viewCacheUpdateEventSnap(oldViewCache, newEventCache, oldEventSnap.isFullyInitialized(), oldEventSnap.isFiltered());
    } else {
      const childChangePath = pathPopFront(changePath);
      const oldChild = oldEventSnap.getNode().getImmediateChild(childKey);
      let newChild;
      if (pathIsEmpty(childChangePath)) {
        newChild = changedSnap;
      } else {
        const childNode = source.getCompleteChild(childKey);
        if (childNode != null) {
          if (pathGetBack(childChangePath) === ".priority" && childNode.getChild(pathParent(childChangePath)).isEmpty()) {
            newChild = childNode;
          } else {
            newChild = childNode.updateChild(childChangePath, changedSnap);
          }
        } else {
          newChild = ChildrenNode.EMPTY_NODE;
        }
      }
      if (!oldChild.equals(newChild)) {
        const newEventSnap = viewProcessor.filter.updateChild(oldEventSnap.getNode(), childKey, newChild, childChangePath, source, accumulator);
        newViewCache2 = viewCacheUpdateEventSnap(oldViewCache, newEventSnap, oldEventSnap.isFullyInitialized(), viewProcessor.filter.filtersNodes());
      } else {
        newViewCache2 = oldViewCache;
      }
    }
  }
  return newViewCache2;
}
function viewProcessorCacheHasChild(viewCache, childKey) {
  return viewCache.eventCache.isCompleteForChild(childKey);
}
function viewProcessorApplyUserMerge(viewProcessor, viewCache, path, changedChildren, writesCache, serverCache, accumulator) {
  let curViewCache = viewCache;
  changedChildren.foreach((relativePath, childNode) => {
    const writePath = pathChild(path, relativePath);
    if (viewProcessorCacheHasChild(viewCache, pathGetFront(writePath))) {
      curViewCache = viewProcessorApplyUserOverwrite(viewProcessor, curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
    }
  });
  changedChildren.foreach((relativePath, childNode) => {
    const writePath = pathChild(path, relativePath);
    if (!viewProcessorCacheHasChild(viewCache, pathGetFront(writePath))) {
      curViewCache = viewProcessorApplyUserOverwrite(viewProcessor, curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
    }
  });
  return curViewCache;
}
function viewProcessorApplyMerge(viewProcessor, node, merge2) {
  merge2.foreach((relativePath, childNode) => {
    node = node.updateChild(relativePath, childNode);
  });
  return node;
}
function viewProcessorApplyServerMerge(viewProcessor, viewCache, path, changedChildren, writesCache, serverCache, filterServerNode, accumulator) {
  if (viewCache.serverCache.getNode().isEmpty() && !viewCache.serverCache.isFullyInitialized()) {
    return viewCache;
  }
  let curViewCache = viewCache;
  let viewMergeTree;
  if (pathIsEmpty(path)) {
    viewMergeTree = changedChildren;
  } else {
    viewMergeTree = new ImmutableTree(null).setTree(path, changedChildren);
  }
  const serverNode = viewCache.serverCache.getNode();
  viewMergeTree.children.inorderTraversal((childKey, childTree) => {
    if (serverNode.hasChild(childKey)) {
      const serverChild = viewCache.serverCache.getNode().getImmediateChild(childKey);
      const newChild = viewProcessorApplyMerge(viewProcessor, serverChild, childTree);
      curViewCache = viewProcessorApplyServerOverwrite(viewProcessor, curViewCache, new Path(childKey), newChild, writesCache, serverCache, filterServerNode, accumulator);
    }
  });
  viewMergeTree.children.inorderTraversal((childKey, childMergeTree) => {
    const isUnknownDeepMerge = !viewCache.serverCache.isCompleteForChild(childKey) && childMergeTree.value === null;
    if (!serverNode.hasChild(childKey) && !isUnknownDeepMerge) {
      const serverChild = viewCache.serverCache.getNode().getImmediateChild(childKey);
      const newChild = viewProcessorApplyMerge(viewProcessor, serverChild, childMergeTree);
      curViewCache = viewProcessorApplyServerOverwrite(viewProcessor, curViewCache, new Path(childKey), newChild, writesCache, serverCache, filterServerNode, accumulator);
    }
  });
  return curViewCache;
}
function viewProcessorAckUserWrite(viewProcessor, viewCache, ackPath, affectedTree, writesCache, completeCache, accumulator) {
  if (writeTreeRefShadowingWrite(writesCache, ackPath) != null) {
    return viewCache;
  }
  const filterServerNode = viewCache.serverCache.isFiltered();
  const serverCache = viewCache.serverCache;
  if (affectedTree.value != null) {
    if (pathIsEmpty(ackPath) && serverCache.isFullyInitialized() || serverCache.isCompleteForPath(ackPath)) {
      return viewProcessorApplyServerOverwrite(viewProcessor, viewCache, ackPath, serverCache.getNode().getChild(ackPath), writesCache, completeCache, filterServerNode, accumulator);
    } else if (pathIsEmpty(ackPath)) {
      let changedChildren = new ImmutableTree(null);
      serverCache.getNode().forEachChild(KEY_INDEX, (name2, node) => {
        changedChildren = changedChildren.set(new Path(name2), node);
      });
      return viewProcessorApplyServerMerge(viewProcessor, viewCache, ackPath, changedChildren, writesCache, completeCache, filterServerNode, accumulator);
    } else {
      return viewCache;
    }
  } else {
    let changedChildren = new ImmutableTree(null);
    affectedTree.foreach((mergePath, value) => {
      const serverCachePath = pathChild(ackPath, mergePath);
      if (serverCache.isCompleteForPath(serverCachePath)) {
        changedChildren = changedChildren.set(mergePath, serverCache.getNode().getChild(serverCachePath));
      }
    });
    return viewProcessorApplyServerMerge(viewProcessor, viewCache, ackPath, changedChildren, writesCache, completeCache, filterServerNode, accumulator);
  }
}
function viewProcessorListenComplete(viewProcessor, viewCache, path, writesCache, accumulator) {
  const oldServerNode = viewCache.serverCache;
  const newViewCache2 = viewCacheUpdateServerSnap(viewCache, oldServerNode.getNode(), oldServerNode.isFullyInitialized() || pathIsEmpty(path), oldServerNode.isFiltered());
  return viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, newViewCache2, path, writesCache, NO_COMPLETE_CHILD_SOURCE, accumulator);
}
function viewProcessorRevertUserWrite(viewProcessor, viewCache, path, writesCache, completeServerCache, accumulator) {
  let complete;
  if (writeTreeRefShadowingWrite(writesCache, path) != null) {
    return viewCache;
  } else {
    const source = new WriteTreeCompleteChildSource(writesCache, viewCache, completeServerCache);
    const oldEventCache = viewCache.eventCache.getNode();
    let newEventCache;
    if (pathIsEmpty(path) || pathGetFront(path) === ".priority") {
      let newNode;
      if (viewCache.serverCache.isFullyInitialized()) {
        newNode = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
      } else {
        const serverChildren = viewCache.serverCache.getNode();
        assert(serverChildren instanceof ChildrenNode, "serverChildren would be complete if leaf node");
        newNode = writeTreeRefCalcCompleteEventChildren(writesCache, serverChildren);
      }
      newNode = newNode;
      newEventCache = viewProcessor.filter.updateFullNode(oldEventCache, newNode, accumulator);
    } else {
      const childKey = pathGetFront(path);
      let newChild = writeTreeRefCalcCompleteChild(writesCache, childKey, viewCache.serverCache);
      if (newChild == null && viewCache.serverCache.isCompleteForChild(childKey)) {
        newChild = oldEventCache.getImmediateChild(childKey);
      }
      if (newChild != null) {
        newEventCache = viewProcessor.filter.updateChild(oldEventCache, childKey, newChild, pathPopFront(path), source, accumulator);
      } else if (viewCache.eventCache.getNode().hasChild(childKey)) {
        newEventCache = viewProcessor.filter.updateChild(oldEventCache, childKey, ChildrenNode.EMPTY_NODE, pathPopFront(path), source, accumulator);
      } else {
        newEventCache = oldEventCache;
      }
      if (newEventCache.isEmpty() && viewCache.serverCache.isFullyInitialized()) {
        complete = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
        if (complete.isLeafNode()) {
          newEventCache = viewProcessor.filter.updateFullNode(newEventCache, complete, accumulator);
        }
      }
    }
    complete = viewCache.serverCache.isFullyInitialized() || writeTreeRefShadowingWrite(writesCache, newEmptyPath()) != null;
    return viewCacheUpdateEventSnap(viewCache, newEventCache, complete, viewProcessor.filter.filtersNodes());
  }
}
var View = class {
  constructor(query_, initialViewCache) {
    this.query_ = query_;
    this.eventRegistrations_ = [];
    const params = this.query_._queryParams;
    const indexFilter = new IndexedFilter(params.getIndex());
    const filter = queryParamsGetNodeFilter(params);
    this.processor_ = newViewProcessor(filter);
    const initialServerCache = initialViewCache.serverCache;
    const initialEventCache = initialViewCache.eventCache;
    const serverSnap = indexFilter.updateFullNode(ChildrenNode.EMPTY_NODE, initialServerCache.getNode(), null);
    const eventSnap = filter.updateFullNode(ChildrenNode.EMPTY_NODE, initialEventCache.getNode(), null);
    const newServerCache = new CacheNode(serverSnap, initialServerCache.isFullyInitialized(), indexFilter.filtersNodes());
    const newEventCache = new CacheNode(eventSnap, initialEventCache.isFullyInitialized(), filter.filtersNodes());
    this.viewCache_ = newViewCache(newEventCache, newServerCache);
    this.eventGenerator_ = new EventGenerator(this.query_);
  }
  get query() {
    return this.query_;
  }
};
function viewGetServerCache(view) {
  return view.viewCache_.serverCache.getNode();
}
function viewGetCompleteNode(view) {
  return viewCacheGetCompleteEventSnap(view.viewCache_);
}
function viewGetCompleteServerCache(view, path) {
  const cache = viewCacheGetCompleteServerSnap(view.viewCache_);
  if (cache) {
    if (view.query._queryParams.loadsAllData() || !pathIsEmpty(path) && !cache.getImmediateChild(pathGetFront(path)).isEmpty()) {
      return cache.getChild(path);
    }
  }
  return null;
}
function viewIsEmpty(view) {
  return view.eventRegistrations_.length === 0;
}
function viewAddEventRegistration(view, eventRegistration) {
  view.eventRegistrations_.push(eventRegistration);
}
function viewRemoveEventRegistration(view, eventRegistration, cancelError) {
  const cancelEvents = [];
  if (cancelError) {
    assert(eventRegistration == null, "A cancel should cancel all event registrations.");
    const path = view.query._path;
    view.eventRegistrations_.forEach((registration) => {
      const maybeEvent = registration.createCancelEvent(cancelError, path);
      if (maybeEvent) {
        cancelEvents.push(maybeEvent);
      }
    });
  }
  if (eventRegistration) {
    let remaining = [];
    for (let i = 0; i < view.eventRegistrations_.length; ++i) {
      const existing = view.eventRegistrations_[i];
      if (!existing.matches(eventRegistration)) {
        remaining.push(existing);
      } else if (eventRegistration.hasAnyCallback()) {
        remaining = remaining.concat(view.eventRegistrations_.slice(i + 1));
        break;
      }
    }
    view.eventRegistrations_ = remaining;
  } else {
    view.eventRegistrations_ = [];
  }
  return cancelEvents;
}
function viewApplyOperation(view, operation, writesCache, completeServerCache) {
  if (operation.type === OperationType.MERGE && operation.source.queryId !== null) {
    assert(viewCacheGetCompleteServerSnap(view.viewCache_), "We should always have a full cache before handling merges");
    assert(viewCacheGetCompleteEventSnap(view.viewCache_), "Missing event cache, even though we have a server cache");
  }
  const oldViewCache = view.viewCache_;
  const result = viewProcessorApplyOperation(view.processor_, oldViewCache, operation, writesCache, completeServerCache);
  viewProcessorAssertIndexed(view.processor_, result.viewCache);
  assert(result.viewCache.serverCache.isFullyInitialized() || !oldViewCache.serverCache.isFullyInitialized(), "Once a server snap is complete, it should never go back");
  view.viewCache_ = result.viewCache;
  return viewGenerateEventsForChanges_(view, result.changes, result.viewCache.eventCache.getNode(), null);
}
function viewGetInitialEvents(view, registration) {
  const eventSnap = view.viewCache_.eventCache;
  const initialChanges = [];
  if (!eventSnap.getNode().isLeafNode()) {
    const eventNode = eventSnap.getNode();
    eventNode.forEachChild(PRIORITY_INDEX, (key, childNode) => {
      initialChanges.push(changeChildAdded(key, childNode));
    });
  }
  if (eventSnap.isFullyInitialized()) {
    initialChanges.push(changeValue(eventSnap.getNode()));
  }
  return viewGenerateEventsForChanges_(view, initialChanges, eventSnap.getNode(), registration);
}
function viewGenerateEventsForChanges_(view, changes, eventCache, eventRegistration) {
  const registrations = eventRegistration ? [eventRegistration] : view.eventRegistrations_;
  return eventGeneratorGenerateEventsForChanges(view.eventGenerator_, changes, eventCache, registrations);
}
var referenceConstructor$1;
var SyncPoint = class {
  constructor() {
    this.views = /* @__PURE__ */ new Map();
  }
};
function syncPointSetReferenceConstructor(val) {
  assert(!referenceConstructor$1, "__referenceConstructor has already been defined");
  referenceConstructor$1 = val;
}
function syncPointGetReferenceConstructor() {
  assert(referenceConstructor$1, "Reference.ts has not been loaded");
  return referenceConstructor$1;
}
function syncPointIsEmpty(syncPoint) {
  return syncPoint.views.size === 0;
}
function syncPointApplyOperation(syncPoint, operation, writesCache, optCompleteServerCache) {
  const queryId = operation.source.queryId;
  if (queryId !== null) {
    const view = syncPoint.views.get(queryId);
    assert(view != null, "SyncTree gave us an op for an invalid query.");
    return viewApplyOperation(view, operation, writesCache, optCompleteServerCache);
  } else {
    let events = [];
    for (const view of syncPoint.views.values()) {
      events = events.concat(viewApplyOperation(view, operation, writesCache, optCompleteServerCache));
    }
    return events;
  }
}
function syncPointGetView(syncPoint, query3, writesCache, serverCache, serverCacheComplete) {
  const queryId = query3._queryIdentifier;
  const view = syncPoint.views.get(queryId);
  if (!view) {
    let eventCache = writeTreeRefCalcCompleteEventCache(writesCache, serverCacheComplete ? serverCache : null);
    let eventCacheComplete = false;
    if (eventCache) {
      eventCacheComplete = true;
    } else if (serverCache instanceof ChildrenNode) {
      eventCache = writeTreeRefCalcCompleteEventChildren(writesCache, serverCache);
      eventCacheComplete = false;
    } else {
      eventCache = ChildrenNode.EMPTY_NODE;
      eventCacheComplete = false;
    }
    const viewCache = newViewCache(new CacheNode(eventCache, eventCacheComplete, false), new CacheNode(serverCache, serverCacheComplete, false));
    return new View(query3, viewCache);
  }
  return view;
}
function syncPointAddEventRegistration(syncPoint, query3, eventRegistration, writesCache, serverCache, serverCacheComplete) {
  const view = syncPointGetView(syncPoint, query3, writesCache, serverCache, serverCacheComplete);
  if (!syncPoint.views.has(query3._queryIdentifier)) {
    syncPoint.views.set(query3._queryIdentifier, view);
  }
  viewAddEventRegistration(view, eventRegistration);
  return viewGetInitialEvents(view, eventRegistration);
}
function syncPointRemoveEventRegistration(syncPoint, query3, eventRegistration, cancelError) {
  const queryId = query3._queryIdentifier;
  const removed = [];
  let cancelEvents = [];
  const hadCompleteView = syncPointHasCompleteView(syncPoint);
  if (queryId === "default") {
    for (const [viewQueryId, view] of syncPoint.views.entries()) {
      cancelEvents = cancelEvents.concat(viewRemoveEventRegistration(view, eventRegistration, cancelError));
      if (viewIsEmpty(view)) {
        syncPoint.views.delete(viewQueryId);
        if (!view.query._queryParams.loadsAllData()) {
          removed.push(view.query);
        }
      }
    }
  } else {
    const view = syncPoint.views.get(queryId);
    if (view) {
      cancelEvents = cancelEvents.concat(viewRemoveEventRegistration(view, eventRegistration, cancelError));
      if (viewIsEmpty(view)) {
        syncPoint.views.delete(queryId);
        if (!view.query._queryParams.loadsAllData()) {
          removed.push(view.query);
        }
      }
    }
  }
  if (hadCompleteView && !syncPointHasCompleteView(syncPoint)) {
    removed.push(new (syncPointGetReferenceConstructor())(query3._repo, query3._path));
  }
  return {
    removed,
    events: cancelEvents
  };
}
function syncPointGetQueryViews(syncPoint) {
  const result = [];
  for (const view of syncPoint.views.values()) {
    if (!view.query._queryParams.loadsAllData()) {
      result.push(view);
    }
  }
  return result;
}
function syncPointGetCompleteServerCache(syncPoint, path) {
  let serverCache = null;
  for (const view of syncPoint.views.values()) {
    serverCache = serverCache || viewGetCompleteServerCache(view, path);
  }
  return serverCache;
}
function syncPointViewForQuery(syncPoint, query3) {
  const params = query3._queryParams;
  if (params.loadsAllData()) {
    return syncPointGetCompleteView(syncPoint);
  } else {
    const queryId = query3._queryIdentifier;
    return syncPoint.views.get(queryId);
  }
}
function syncPointViewExistsForQuery(syncPoint, query3) {
  return syncPointViewForQuery(syncPoint, query3) != null;
}
function syncPointHasCompleteView(syncPoint) {
  return syncPointGetCompleteView(syncPoint) != null;
}
function syncPointGetCompleteView(syncPoint) {
  for (const view of syncPoint.views.values()) {
    if (view.query._queryParams.loadsAllData()) {
      return view;
    }
  }
  return null;
}
var referenceConstructor;
function syncTreeSetReferenceConstructor(val) {
  assert(!referenceConstructor, "__referenceConstructor has already been defined");
  referenceConstructor = val;
}
function syncTreeGetReferenceConstructor() {
  assert(referenceConstructor, "Reference.ts has not been loaded");
  return referenceConstructor;
}
var syncTreeNextQueryTag_ = 1;
var SyncTree = class {
  /**
   * @param listenProvider_ - Used by SyncTree to start / stop listening
   *   to server data.
   */
  constructor(listenProvider_) {
    this.listenProvider_ = listenProvider_;
    this.syncPointTree_ = new ImmutableTree(null);
    this.pendingWriteTree_ = newWriteTree();
    this.tagToQueryMap = /* @__PURE__ */ new Map();
    this.queryToTagMap = /* @__PURE__ */ new Map();
  }
};
function syncTreeApplyUserOverwrite(syncTree, path, newData, writeId, visible) {
  writeTreeAddOverwrite(syncTree.pendingWriteTree_, path, newData, writeId, visible);
  if (!visible) {
    return [];
  } else {
    return syncTreeApplyOperationToSyncPoints_(syncTree, new Overwrite(newOperationSourceUser(), path, newData));
  }
}
function syncTreeApplyUserMerge(syncTree, path, changedChildren, writeId) {
  writeTreeAddMerge(syncTree.pendingWriteTree_, path, changedChildren, writeId);
  const changeTree = ImmutableTree.fromObject(changedChildren);
  return syncTreeApplyOperationToSyncPoints_(syncTree, new Merge(newOperationSourceUser(), path, changeTree));
}
function syncTreeAckUserWrite(syncTree, writeId, revert = false) {
  const write = writeTreeGetWrite(syncTree.pendingWriteTree_, writeId);
  const needToReevaluate = writeTreeRemoveWrite(syncTree.pendingWriteTree_, writeId);
  if (!needToReevaluate) {
    return [];
  } else {
    let affectedTree = new ImmutableTree(null);
    if (write.snap != null) {
      affectedTree = affectedTree.set(newEmptyPath(), true);
    } else {
      each(write.children, (pathString) => {
        affectedTree = affectedTree.set(new Path(pathString), true);
      });
    }
    return syncTreeApplyOperationToSyncPoints_(syncTree, new AckUserWrite(write.path, affectedTree, revert));
  }
}
function syncTreeApplyServerOverwrite(syncTree, path, newData) {
  return syncTreeApplyOperationToSyncPoints_(syncTree, new Overwrite(newOperationSourceServer(), path, newData));
}
function syncTreeApplyServerMerge(syncTree, path, changedChildren) {
  const changeTree = ImmutableTree.fromObject(changedChildren);
  return syncTreeApplyOperationToSyncPoints_(syncTree, new Merge(newOperationSourceServer(), path, changeTree));
}
function syncTreeApplyListenComplete(syncTree, path) {
  return syncTreeApplyOperationToSyncPoints_(syncTree, new ListenComplete(newOperationSourceServer(), path));
}
function syncTreeApplyTaggedListenComplete(syncTree, path, tag) {
  const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
  if (queryKey) {
    const r = syncTreeParseQueryKey_(queryKey);
    const queryPath = r.path, queryId = r.queryId;
    const relativePath = newRelativePath(queryPath, path);
    const op = new ListenComplete(newOperationSourceServerTaggedQuery(queryId), relativePath);
    return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
  } else {
    return [];
  }
}
function syncTreeRemoveEventRegistration(syncTree, query3, eventRegistration, cancelError, skipListenerDedup = false) {
  const path = query3._path;
  const maybeSyncPoint = syncTree.syncPointTree_.get(path);
  let cancelEvents = [];
  if (maybeSyncPoint && (query3._queryIdentifier === "default" || syncPointViewExistsForQuery(maybeSyncPoint, query3))) {
    const removedAndEvents = syncPointRemoveEventRegistration(maybeSyncPoint, query3, eventRegistration, cancelError);
    if (syncPointIsEmpty(maybeSyncPoint)) {
      syncTree.syncPointTree_ = syncTree.syncPointTree_.remove(path);
    }
    const removed = removedAndEvents.removed;
    cancelEvents = removedAndEvents.events;
    if (!skipListenerDedup) {
      const removingDefault = -1 !== removed.findIndex((query4) => {
        return query4._queryParams.loadsAllData();
      });
      const covered = syncTree.syncPointTree_.findOnPath(path, (relativePath, parentSyncPoint) => syncPointHasCompleteView(parentSyncPoint));
      if (removingDefault && !covered) {
        const subtree = syncTree.syncPointTree_.subtree(path);
        if (!subtree.isEmpty()) {
          const newViews = syncTreeCollectDistinctViewsForSubTree_(subtree);
          for (let i = 0; i < newViews.length; ++i) {
            const view = newViews[i], newQuery = view.query;
            const listener = syncTreeCreateListenerForView_(syncTree, view);
            syncTree.listenProvider_.startListening(syncTreeQueryForListening_(newQuery), syncTreeTagForQuery(syncTree, newQuery), listener.hashFn, listener.onComplete);
          }
        }
      }
      if (!covered && removed.length > 0 && !cancelError) {
        if (removingDefault) {
          const defaultTag = null;
          syncTree.listenProvider_.stopListening(syncTreeQueryForListening_(query3), defaultTag);
        } else {
          removed.forEach((queryToRemove) => {
            const tagToRemove = syncTree.queryToTagMap.get(syncTreeMakeQueryKey_(queryToRemove));
            syncTree.listenProvider_.stopListening(syncTreeQueryForListening_(queryToRemove), tagToRemove);
          });
        }
      }
    }
    syncTreeRemoveTags_(syncTree, removed);
  }
  return cancelEvents;
}
function syncTreeApplyTaggedQueryOverwrite(syncTree, path, snap, tag) {
  const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
  if (queryKey != null) {
    const r = syncTreeParseQueryKey_(queryKey);
    const queryPath = r.path, queryId = r.queryId;
    const relativePath = newRelativePath(queryPath, path);
    const op = new Overwrite(newOperationSourceServerTaggedQuery(queryId), relativePath, snap);
    return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
  } else {
    return [];
  }
}
function syncTreeApplyTaggedQueryMerge(syncTree, path, changedChildren, tag) {
  const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
  if (queryKey) {
    const r = syncTreeParseQueryKey_(queryKey);
    const queryPath = r.path, queryId = r.queryId;
    const relativePath = newRelativePath(queryPath, path);
    const changeTree = ImmutableTree.fromObject(changedChildren);
    const op = new Merge(newOperationSourceServerTaggedQuery(queryId), relativePath, changeTree);
    return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
  } else {
    return [];
  }
}
function syncTreeAddEventRegistration(syncTree, query3, eventRegistration, skipSetupListener = false) {
  const path = query3._path;
  let serverCache = null;
  let foundAncestorDefaultView = false;
  syncTree.syncPointTree_.foreachOnPath(path, (pathToSyncPoint, sp) => {
    const relativePath = newRelativePath(pathToSyncPoint, path);
    serverCache = serverCache || syncPointGetCompleteServerCache(sp, relativePath);
    foundAncestorDefaultView = foundAncestorDefaultView || syncPointHasCompleteView(sp);
  });
  let syncPoint = syncTree.syncPointTree_.get(path);
  if (!syncPoint) {
    syncPoint = new SyncPoint();
    syncTree.syncPointTree_ = syncTree.syncPointTree_.set(path, syncPoint);
  } else {
    foundAncestorDefaultView = foundAncestorDefaultView || syncPointHasCompleteView(syncPoint);
    serverCache = serverCache || syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
  }
  let serverCacheComplete;
  if (serverCache != null) {
    serverCacheComplete = true;
  } else {
    serverCacheComplete = false;
    serverCache = ChildrenNode.EMPTY_NODE;
    const subtree = syncTree.syncPointTree_.subtree(path);
    subtree.foreachChild((childName, childSyncPoint) => {
      const completeCache = syncPointGetCompleteServerCache(childSyncPoint, newEmptyPath());
      if (completeCache) {
        serverCache = serverCache.updateImmediateChild(childName, completeCache);
      }
    });
  }
  const viewAlreadyExists = syncPointViewExistsForQuery(syncPoint, query3);
  if (!viewAlreadyExists && !query3._queryParams.loadsAllData()) {
    const queryKey = syncTreeMakeQueryKey_(query3);
    assert(!syncTree.queryToTagMap.has(queryKey), "View does not exist, but we have a tag");
    const tag = syncTreeGetNextQueryTag_();
    syncTree.queryToTagMap.set(queryKey, tag);
    syncTree.tagToQueryMap.set(tag, queryKey);
  }
  const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, path);
  let events = syncPointAddEventRegistration(syncPoint, query3, eventRegistration, writesCache, serverCache, serverCacheComplete);
  if (!viewAlreadyExists && !foundAncestorDefaultView && !skipSetupListener) {
    const view = syncPointViewForQuery(syncPoint, query3);
    events = events.concat(syncTreeSetupListener_(syncTree, query3, view));
  }
  return events;
}
function syncTreeCalcCompleteEventCache(syncTree, path, writeIdsToExclude) {
  const includeHiddenSets = true;
  const writeTree = syncTree.pendingWriteTree_;
  const serverCache = syncTree.syncPointTree_.findOnPath(path, (pathSoFar, syncPoint) => {
    const relativePath = newRelativePath(pathSoFar, path);
    const serverCache2 = syncPointGetCompleteServerCache(syncPoint, relativePath);
    if (serverCache2) {
      return serverCache2;
    }
  });
  return writeTreeCalcCompleteEventCache(writeTree, path, serverCache, writeIdsToExclude, includeHiddenSets);
}
function syncTreeGetServerValue(syncTree, query3) {
  const path = query3._path;
  let serverCache = null;
  syncTree.syncPointTree_.foreachOnPath(path, (pathToSyncPoint, sp) => {
    const relativePath = newRelativePath(pathToSyncPoint, path);
    serverCache = serverCache || syncPointGetCompleteServerCache(sp, relativePath);
  });
  let syncPoint = syncTree.syncPointTree_.get(path);
  if (!syncPoint) {
    syncPoint = new SyncPoint();
    syncTree.syncPointTree_ = syncTree.syncPointTree_.set(path, syncPoint);
  } else {
    serverCache = serverCache || syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
  }
  const serverCacheComplete = serverCache != null;
  const serverCacheNode = serverCacheComplete ? new CacheNode(serverCache, true, false) : null;
  const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, query3._path);
  const view = syncPointGetView(syncPoint, query3, writesCache, serverCacheComplete ? serverCacheNode.getNode() : ChildrenNode.EMPTY_NODE, serverCacheComplete);
  return viewGetCompleteNode(view);
}
function syncTreeApplyOperationToSyncPoints_(syncTree, operation) {
  return syncTreeApplyOperationHelper_(
    operation,
    syncTree.syncPointTree_,
    /*serverCache=*/
    null,
    writeTreeChildWrites(syncTree.pendingWriteTree_, newEmptyPath())
  );
}
function syncTreeApplyOperationHelper_(operation, syncPointTree, serverCache, writesCache) {
  if (pathIsEmpty(operation.path)) {
    return syncTreeApplyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache);
  } else {
    const syncPoint = syncPointTree.get(newEmptyPath());
    if (serverCache == null && syncPoint != null) {
      serverCache = syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
    }
    let events = [];
    const childName = pathGetFront(operation.path);
    const childOperation = operation.operationForChild(childName);
    const childTree = syncPointTree.children.get(childName);
    if (childTree && childOperation) {
      const childServerCache = serverCache ? serverCache.getImmediateChild(childName) : null;
      const childWritesCache = writeTreeRefChild(writesCache, childName);
      events = events.concat(syncTreeApplyOperationHelper_(childOperation, childTree, childServerCache, childWritesCache));
    }
    if (syncPoint) {
      events = events.concat(syncPointApplyOperation(syncPoint, operation, writesCache, serverCache));
    }
    return events;
  }
}
function syncTreeApplyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache) {
  const syncPoint = syncPointTree.get(newEmptyPath());
  if (serverCache == null && syncPoint != null) {
    serverCache = syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
  }
  let events = [];
  syncPointTree.children.inorderTraversal((childName, childTree) => {
    const childServerCache = serverCache ? serverCache.getImmediateChild(childName) : null;
    const childWritesCache = writeTreeRefChild(writesCache, childName);
    const childOperation = operation.operationForChild(childName);
    if (childOperation) {
      events = events.concat(syncTreeApplyOperationDescendantsHelper_(childOperation, childTree, childServerCache, childWritesCache));
    }
  });
  if (syncPoint) {
    events = events.concat(syncPointApplyOperation(syncPoint, operation, writesCache, serverCache));
  }
  return events;
}
function syncTreeCreateListenerForView_(syncTree, view) {
  const query3 = view.query;
  const tag = syncTreeTagForQuery(syncTree, query3);
  return {
    hashFn: () => {
      const cache = viewGetServerCache(view) || ChildrenNode.EMPTY_NODE;
      return cache.hash();
    },
    onComplete: (status) => {
      if (status === "ok") {
        if (tag) {
          return syncTreeApplyTaggedListenComplete(syncTree, query3._path, tag);
        } else {
          return syncTreeApplyListenComplete(syncTree, query3._path);
        }
      } else {
        const error2 = errorForServerCode(status, query3);
        return syncTreeRemoveEventRegistration(
          syncTree,
          query3,
          /*eventRegistration*/
          null,
          error2
        );
      }
    }
  };
}
function syncTreeTagForQuery(syncTree, query3) {
  const queryKey = syncTreeMakeQueryKey_(query3);
  return syncTree.queryToTagMap.get(queryKey);
}
function syncTreeMakeQueryKey_(query3) {
  return query3._path.toString() + "$" + query3._queryIdentifier;
}
function syncTreeQueryKeyForTag_(syncTree, tag) {
  return syncTree.tagToQueryMap.get(tag);
}
function syncTreeParseQueryKey_(queryKey) {
  const splitIndex = queryKey.indexOf("$");
  assert(splitIndex !== -1 && splitIndex < queryKey.length - 1, "Bad queryKey.");
  return {
    queryId: queryKey.substr(splitIndex + 1),
    path: new Path(queryKey.substr(0, splitIndex))
  };
}
function syncTreeApplyTaggedOperation_(syncTree, queryPath, operation) {
  const syncPoint = syncTree.syncPointTree_.get(queryPath);
  assert(syncPoint, "Missing sync point for query tag that we're tracking");
  const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, queryPath);
  return syncPointApplyOperation(syncPoint, operation, writesCache, null);
}
function syncTreeCollectDistinctViewsForSubTree_(subtree) {
  return subtree.fold((relativePath, maybeChildSyncPoint, childMap) => {
    if (maybeChildSyncPoint && syncPointHasCompleteView(maybeChildSyncPoint)) {
      const completeView = syncPointGetCompleteView(maybeChildSyncPoint);
      return [completeView];
    } else {
      let views = [];
      if (maybeChildSyncPoint) {
        views = syncPointGetQueryViews(maybeChildSyncPoint);
      }
      each(childMap, (_key, childViews) => {
        views = views.concat(childViews);
      });
      return views;
    }
  });
}
function syncTreeQueryForListening_(query3) {
  if (query3._queryParams.loadsAllData() && !query3._queryParams.isDefault()) {
    return new (syncTreeGetReferenceConstructor())(query3._repo, query3._path);
  } else {
    return query3;
  }
}
function syncTreeRemoveTags_(syncTree, queries) {
  for (let j = 0; j < queries.length; ++j) {
    const removedQuery = queries[j];
    if (!removedQuery._queryParams.loadsAllData()) {
      const removedQueryKey = syncTreeMakeQueryKey_(removedQuery);
      const removedQueryTag = syncTree.queryToTagMap.get(removedQueryKey);
      syncTree.queryToTagMap.delete(removedQueryKey);
      syncTree.tagToQueryMap.delete(removedQueryTag);
    }
  }
}
function syncTreeGetNextQueryTag_() {
  return syncTreeNextQueryTag_++;
}
function syncTreeSetupListener_(syncTree, query3, view) {
  const path = query3._path;
  const tag = syncTreeTagForQuery(syncTree, query3);
  const listener = syncTreeCreateListenerForView_(syncTree, view);
  const events = syncTree.listenProvider_.startListening(syncTreeQueryForListening_(query3), tag, listener.hashFn, listener.onComplete);
  const subtree = syncTree.syncPointTree_.subtree(path);
  if (tag) {
    assert(!syncPointHasCompleteView(subtree.value), "If we're adding a query, it shouldn't be shadowed");
  } else {
    const queriesToStop = subtree.fold((relativePath, maybeChildSyncPoint, childMap) => {
      if (!pathIsEmpty(relativePath) && maybeChildSyncPoint && syncPointHasCompleteView(maybeChildSyncPoint)) {
        return [syncPointGetCompleteView(maybeChildSyncPoint).query];
      } else {
        let queries = [];
        if (maybeChildSyncPoint) {
          queries = queries.concat(syncPointGetQueryViews(maybeChildSyncPoint).map((view2) => view2.query));
        }
        each(childMap, (_key, childQueries) => {
          queries = queries.concat(childQueries);
        });
        return queries;
      }
    });
    for (let i = 0; i < queriesToStop.length; ++i) {
      const queryToStop = queriesToStop[i];
      syncTree.listenProvider_.stopListening(syncTreeQueryForListening_(queryToStop), syncTreeTagForQuery(syncTree, queryToStop));
    }
  }
  return events;
}
var ExistingValueProvider = class _ExistingValueProvider {
  constructor(node_) {
    this.node_ = node_;
  }
  getImmediateChild(childName) {
    const child3 = this.node_.getImmediateChild(childName);
    return new _ExistingValueProvider(child3);
  }
  node() {
    return this.node_;
  }
};
var DeferredValueProvider = class _DeferredValueProvider {
  constructor(syncTree, path) {
    this.syncTree_ = syncTree;
    this.path_ = path;
  }
  getImmediateChild(childName) {
    const childPath = pathChild(this.path_, childName);
    return new _DeferredValueProvider(this.syncTree_, childPath);
  }
  node() {
    return syncTreeCalcCompleteEventCache(this.syncTree_, this.path_);
  }
};
var generateWithValues = function(values) {
  values = values || {};
  values["timestamp"] = values["timestamp"] || (/* @__PURE__ */ new Date()).getTime();
  return values;
};
var resolveDeferredLeafValue = function(value, existingVal, serverValues) {
  if (!value || typeof value !== "object") {
    return value;
  }
  assert(".sv" in value, "Unexpected leaf node or priority contents");
  if (typeof value[".sv"] === "string") {
    return resolveScalarDeferredValue(value[".sv"], existingVal, serverValues);
  } else if (typeof value[".sv"] === "object") {
    return resolveComplexDeferredValue(value[".sv"], existingVal);
  } else {
    assert(false, "Unexpected server value: " + JSON.stringify(value, null, 2));
  }
};
var resolveScalarDeferredValue = function(op, existing, serverValues) {
  switch (op) {
    case "timestamp":
      return serverValues["timestamp"];
    default:
      assert(false, "Unexpected server value: " + op);
  }
};
var resolveComplexDeferredValue = function(op, existing, unused) {
  if (!op.hasOwnProperty("increment")) {
    assert(false, "Unexpected server value: " + JSON.stringify(op, null, 2));
  }
  const delta = op["increment"];
  if (typeof delta !== "number") {
    assert(false, "Unexpected increment value: " + delta);
  }
  const existingNode = existing.node();
  assert(existingNode !== null && typeof existingNode !== "undefined", "Expected ChildrenNode.EMPTY_NODE for nulls");
  if (!existingNode.isLeafNode()) {
    return delta;
  }
  const leaf = existingNode;
  const existingVal = leaf.getValue();
  if (typeof existingVal !== "number") {
    return delta;
  }
  return existingVal + delta;
};
var resolveDeferredValueTree = function(path, node, syncTree, serverValues) {
  return resolveDeferredValue(node, new DeferredValueProvider(syncTree, path), serverValues);
};
var resolveDeferredValueSnapshot = function(node, existing, serverValues) {
  return resolveDeferredValue(node, new ExistingValueProvider(existing), serverValues);
};
function resolveDeferredValue(node, existingVal, serverValues) {
  const rawPri = node.getPriority().val();
  const priority = resolveDeferredLeafValue(rawPri, existingVal.getImmediateChild(".priority"), serverValues);
  let newNode;
  if (node.isLeafNode()) {
    const leafNode = node;
    const value = resolveDeferredLeafValue(leafNode.getValue(), existingVal, serverValues);
    if (value !== leafNode.getValue() || priority !== leafNode.getPriority().val()) {
      return new LeafNode(value, nodeFromJSON(priority));
    } else {
      return node;
    }
  } else {
    const childrenNode = node;
    newNode = childrenNode;
    if (priority !== childrenNode.getPriority().val()) {
      newNode = newNode.updatePriority(new LeafNode(priority));
    }
    childrenNode.forEachChild(PRIORITY_INDEX, (childName, childNode) => {
      const newChildNode = resolveDeferredValue(childNode, existingVal.getImmediateChild(childName), serverValues);
      if (newChildNode !== childNode) {
        newNode = newNode.updateImmediateChild(childName, newChildNode);
      }
    });
    return newNode;
  }
}
var Tree = class {
  /**
   * @param name - Optional name of the node.
   * @param parent - Optional parent node.
   * @param node - Optional node to wrap.
   */
  constructor(name2 = "", parent = null, node = {
    children: {},
    childCount: 0
  }) {
    this.name = name2;
    this.parent = parent;
    this.node = node;
  }
};
function treeSubTree(tree, pathObj) {
  let path = pathObj instanceof Path ? pathObj : new Path(pathObj);
  let child3 = tree, next = pathGetFront(path);
  while (next !== null) {
    const childNode = safeGet(child3.node.children, next) || {
      children: {},
      childCount: 0
    };
    child3 = new Tree(next, child3, childNode);
    path = pathPopFront(path);
    next = pathGetFront(path);
  }
  return child3;
}
function treeGetValue(tree) {
  return tree.node.value;
}
function treeSetValue(tree, value) {
  tree.node.value = value;
  treeUpdateParents(tree);
}
function treeHasChildren(tree) {
  return tree.node.childCount > 0;
}
function treeIsEmpty(tree) {
  return treeGetValue(tree) === void 0 && !treeHasChildren(tree);
}
function treeForEachChild(tree, action) {
  each(tree.node.children, (child3, childTree) => {
    action(new Tree(child3, tree, childTree));
  });
}
function treeForEachDescendant(tree, action, includeSelf, childrenFirst) {
  if (includeSelf && !childrenFirst) {
    action(tree);
  }
  treeForEachChild(tree, (child3) => {
    treeForEachDescendant(child3, action, true, childrenFirst);
  });
  if (includeSelf && childrenFirst) {
    action(tree);
  }
}
function treeForEachAncestor(tree, action, includeSelf) {
  let node = includeSelf ? tree : tree.parent;
  while (node !== null) {
    if (action(node)) {
      return true;
    }
    node = node.parent;
  }
  return false;
}
function treeGetPath(tree) {
  return new Path(tree.parent === null ? tree.name : treeGetPath(tree.parent) + "/" + tree.name);
}
function treeUpdateParents(tree) {
  if (tree.parent !== null) {
    treeUpdateChild(tree.parent, tree.name, tree);
  }
}
function treeUpdateChild(tree, childName, child3) {
  const childEmpty = treeIsEmpty(child3);
  const childExists = contains(tree.node.children, childName);
  if (childEmpty && childExists) {
    delete tree.node.children[childName];
    tree.node.childCount--;
    treeUpdateParents(tree);
  } else if (!childEmpty && !childExists) {
    tree.node.children[childName] = child3.node;
    tree.node.childCount++;
    treeUpdateParents(tree);
  }
}
var INVALID_KEY_REGEX_ = /[\[\].#$\/\u0000-\u001F\u007F]/;
var INVALID_PATH_REGEX_ = /[\[\].#$\u0000-\u001F\u007F]/;
var MAX_LEAF_SIZE_ = 10 * 1024 * 1024;
var isValidKey = function(key) {
  return typeof key === "string" && key.length !== 0 && !INVALID_KEY_REGEX_.test(key);
};
var isValidPathString = function(pathString) {
  return typeof pathString === "string" && pathString.length !== 0 && !INVALID_PATH_REGEX_.test(pathString);
};
var isValidRootPathString = function(pathString) {
  if (pathString) {
    pathString = pathString.replace(/^\/*\.info(\/|$)/, "/");
  }
  return isValidPathString(pathString);
};
var isValidPriority = function(priority) {
  return priority === null || typeof priority === "string" || typeof priority === "number" && !isInvalidJSONNumber(priority) || priority && typeof priority === "object" && // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contains(priority, ".sv");
};
var validateFirebaseDataArg = function(fnName, value, path, optional) {
  if (optional && value === void 0) {
    return;
  }
  validateFirebaseData(errorPrefix(fnName, "value"), value, path);
};
var validateFirebaseData = function(errorPrefix2, data, path_) {
  const path = path_ instanceof Path ? new ValidationPath(path_, errorPrefix2) : path_;
  if (data === void 0) {
    throw new Error(errorPrefix2 + "contains undefined " + validationPathToErrorString(path));
  }
  if (typeof data === "function") {
    throw new Error(errorPrefix2 + "contains a function " + validationPathToErrorString(path) + " with contents = " + data.toString());
  }
  if (isInvalidJSONNumber(data)) {
    throw new Error(errorPrefix2 + "contains " + data.toString() + " " + validationPathToErrorString(path));
  }
  if (typeof data === "string" && data.length > MAX_LEAF_SIZE_ / 3 && stringLength(data) > MAX_LEAF_SIZE_) {
    throw new Error(errorPrefix2 + "contains a string greater than " + MAX_LEAF_SIZE_ + " utf8 bytes " + validationPathToErrorString(path) + " ('" + data.substring(0, 50) + "...')");
  }
  if (data && typeof data === "object") {
    let hasDotValue = false;
    let hasActualChild = false;
    each(data, (key, value) => {
      if (key === ".value") {
        hasDotValue = true;
      } else if (key !== ".priority" && key !== ".sv") {
        hasActualChild = true;
        if (!isValidKey(key)) {
          throw new Error(errorPrefix2 + " contains an invalid key (" + key + ") " + validationPathToErrorString(path) + `.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);
        }
      }
      validationPathPush(path, key);
      validateFirebaseData(errorPrefix2, value, path);
      validationPathPop(path);
    });
    if (hasDotValue && hasActualChild) {
      throw new Error(errorPrefix2 + ' contains ".value" child ' + validationPathToErrorString(path) + " in addition to actual children.");
    }
  }
};
var validateFirebaseMergePaths = function(errorPrefix2, mergePaths) {
  let i, curPath;
  for (i = 0; i < mergePaths.length; i++) {
    curPath = mergePaths[i];
    const keys = pathSlice(curPath);
    for (let j = 0; j < keys.length; j++) {
      if (keys[j] === ".priority" && j === keys.length - 1) ;
      else if (!isValidKey(keys[j])) {
        throw new Error(errorPrefix2 + "contains an invalid key (" + keys[j] + ") in path " + curPath.toString() + `. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);
      }
    }
  }
  mergePaths.sort(pathCompare);
  let prevPath = null;
  for (i = 0; i < mergePaths.length; i++) {
    curPath = mergePaths[i];
    if (prevPath !== null && pathContains(prevPath, curPath)) {
      throw new Error(errorPrefix2 + "contains a path " + prevPath.toString() + " that is ancestor of another path " + curPath.toString());
    }
    prevPath = curPath;
  }
};
var validateFirebaseMergeDataArg = function(fnName, data, path, optional) {
  if (optional && data === void 0) {
    return;
  }
  const errorPrefix$1 = errorPrefix(fnName, "values");
  if (!(data && typeof data === "object") || Array.isArray(data)) {
    throw new Error(errorPrefix$1 + " must be an object containing the children to replace.");
  }
  const mergePaths = [];
  each(data, (key, value) => {
    const curPath = new Path(key);
    validateFirebaseData(errorPrefix$1, value, pathChild(path, curPath));
    if (pathGetBack(curPath) === ".priority") {
      if (!isValidPriority(value)) {
        throw new Error(errorPrefix$1 + "contains an invalid value for '" + curPath.toString() + "', which must be a valid Firebase priority (a string, finite number, server value, or null).");
      }
    }
    mergePaths.push(curPath);
  });
  validateFirebaseMergePaths(errorPrefix$1, mergePaths);
};
var validatePriority = function(fnName, priority, optional) {
  if (optional && priority === void 0) {
    return;
  }
  if (isInvalidJSONNumber(priority)) {
    throw new Error(errorPrefix(fnName, "priority") + "is " + priority.toString() + ", but must be a valid Firebase priority (a string, finite number, server value, or null).");
  }
  if (!isValidPriority(priority)) {
    throw new Error(errorPrefix(fnName, "priority") + "must be a valid Firebase priority (a string, finite number, server value, or null).");
  }
};
var validateKey = function(fnName, argumentName, key, optional) {
  if (optional && key === void 0) {
    return;
  }
  if (!isValidKey(key)) {
    throw new Error(errorPrefix(fnName, argumentName) + 'was an invalid key = "' + key + `".  Firebase keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]").`);
  }
};
var validatePathString = function(fnName, argumentName, pathString, optional) {
  if (optional && pathString === void 0) {
    return;
  }
  if (!isValidPathString(pathString)) {
    throw new Error(errorPrefix(fnName, argumentName) + 'was an invalid path = "' + pathString + `". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`);
  }
};
var validateRootPathString = function(fnName, argumentName, pathString, optional) {
  if (pathString) {
    pathString = pathString.replace(/^\/*\.info(\/|$)/, "/");
  }
  validatePathString(fnName, argumentName, pathString, optional);
};
var validateWritablePath = function(fnName, path) {
  if (pathGetFront(path) === ".info") {
    throw new Error(fnName + " failed = Can't modify data under /.info/");
  }
};
var validateUrl = function(fnName, parsedUrl) {
  const pathString = parsedUrl.path.toString();
  if (!(typeof parsedUrl.repoInfo.host === "string") || parsedUrl.repoInfo.host.length === 0 || !isValidKey(parsedUrl.repoInfo.namespace) && parsedUrl.repoInfo.host.split(":")[0] !== "localhost" || pathString.length !== 0 && !isValidRootPathString(pathString)) {
    throw new Error(errorPrefix(fnName, "url") + `must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`);
  }
};
var EventQueue = class {
  constructor() {
    this.eventLists_ = [];
    this.recursionDepth_ = 0;
  }
};
function eventQueueQueueEvents(eventQueue, eventDataList) {
  let currList = null;
  for (let i = 0; i < eventDataList.length; i++) {
    const data = eventDataList[i];
    const path = data.getPath();
    if (currList !== null && !pathEquals(path, currList.path)) {
      eventQueue.eventLists_.push(currList);
      currList = null;
    }
    if (currList === null) {
      currList = {
        events: [],
        path
      };
    }
    currList.events.push(data);
  }
  if (currList) {
    eventQueue.eventLists_.push(currList);
  }
}
function eventQueueRaiseEventsAtPath(eventQueue, path, eventDataList) {
  eventQueueQueueEvents(eventQueue, eventDataList);
  eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, (eventPath) => pathEquals(eventPath, path));
}
function eventQueueRaiseEventsForChangedPath(eventQueue, changedPath, eventDataList) {
  eventQueueQueueEvents(eventQueue, eventDataList);
  eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, (eventPath) => pathContains(eventPath, changedPath) || pathContains(changedPath, eventPath));
}
function eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, predicate) {
  eventQueue.recursionDepth_++;
  let sentAll = true;
  for (let i = 0; i < eventQueue.eventLists_.length; i++) {
    const eventList = eventQueue.eventLists_[i];
    if (eventList) {
      const eventPath = eventList.path;
      if (predicate(eventPath)) {
        eventListRaise(eventQueue.eventLists_[i]);
        eventQueue.eventLists_[i] = null;
      } else {
        sentAll = false;
      }
    }
  }
  if (sentAll) {
    eventQueue.eventLists_ = [];
  }
  eventQueue.recursionDepth_--;
}
function eventListRaise(eventList) {
  for (let i = 0; i < eventList.events.length; i++) {
    const eventData = eventList.events[i];
    if (eventData !== null) {
      eventList.events[i] = null;
      const eventFn = eventData.getEventRunner();
      if (logger) {
        log("event: " + eventData.toString());
      }
      exceptionGuard(eventFn);
    }
  }
}
var INTERRUPT_REASON = "repo_interrupt";
var MAX_TRANSACTION_RETRIES = 25;
var Repo = class {
  constructor(repoInfo_, forceRestClient_, authTokenProvider_, appCheckProvider_) {
    this.repoInfo_ = repoInfo_;
    this.forceRestClient_ = forceRestClient_;
    this.authTokenProvider_ = authTokenProvider_;
    this.appCheckProvider_ = appCheckProvider_;
    this.dataUpdateCount = 0;
    this.statsListener_ = null;
    this.eventQueue_ = new EventQueue();
    this.nextWriteId_ = 1;
    this.interceptServerDataCallback_ = null;
    this.onDisconnect_ = newSparseSnapshotTree();
    this.transactionQueueTree_ = new Tree();
    this.persistentConnection_ = null;
    this.key = this.repoInfo_.toURLString();
  }
  /**
   * @returns The URL corresponding to the root of this Firebase.
   */
  toString() {
    return (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host;
  }
};
function repoStart(repo, appId, authOverride) {
  repo.stats_ = statsManagerGetCollection(repo.repoInfo_);
  if (repo.forceRestClient_ || beingCrawled()) {
    repo.server_ = new ReadonlyRestClient(repo.repoInfo_, (pathString, data, isMerge, tag) => {
      repoOnDataUpdate(repo, pathString, data, isMerge, tag);
    }, repo.authTokenProvider_, repo.appCheckProvider_);
    setTimeout(() => repoOnConnectStatus(
      repo,
      /* connectStatus= */
      true
    ), 0);
  } else {
    if (typeof authOverride !== "undefined" && authOverride !== null) {
      if (typeof authOverride !== "object") {
        throw new Error("Only objects are supported for option databaseAuthVariableOverride");
      }
      try {
        stringify(authOverride);
      } catch (e) {
        throw new Error("Invalid authOverride provided: " + e);
      }
    }
    repo.persistentConnection_ = new PersistentConnection(repo.repoInfo_, appId, (pathString, data, isMerge, tag) => {
      repoOnDataUpdate(repo, pathString, data, isMerge, tag);
    }, (connectStatus) => {
      repoOnConnectStatus(repo, connectStatus);
    }, (updates) => {
      repoOnServerInfoUpdate(repo, updates);
    }, repo.authTokenProvider_, repo.appCheckProvider_, authOverride);
    repo.server_ = repo.persistentConnection_;
  }
  repo.authTokenProvider_.addTokenChangeListener((token) => {
    repo.server_.refreshAuthToken(token);
  });
  repo.appCheckProvider_.addTokenChangeListener((result) => {
    repo.server_.refreshAppCheckToken(result.token);
  });
  repo.statsReporter_ = statsManagerGetOrCreateReporter(repo.repoInfo_, () => new StatsReporter(repo.stats_, repo.server_));
  repo.infoData_ = new SnapshotHolder();
  repo.infoSyncTree_ = new SyncTree({
    startListening: (query3, tag, currentHashFn, onComplete) => {
      let infoEvents = [];
      const node = repo.infoData_.getNode(query3._path);
      if (!node.isEmpty()) {
        infoEvents = syncTreeApplyServerOverwrite(repo.infoSyncTree_, query3._path, node);
        setTimeout(() => {
          onComplete("ok");
        }, 0);
      }
      return infoEvents;
    },
    stopListening: () => {
    }
  });
  repoUpdateInfo(repo, "connected", false);
  repo.serverSyncTree_ = new SyncTree({
    startListening: (query3, tag, currentHashFn, onComplete) => {
      repo.server_.listen(query3, currentHashFn, tag, (status, data) => {
        const events = onComplete(status, data);
        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, query3._path, events);
      });
      return [];
    },
    stopListening: (query3, tag) => {
      repo.server_.unlisten(query3, tag);
    }
  });
}
function repoServerTime(repo) {
  const offsetNode = repo.infoData_.getNode(new Path(".info/serverTimeOffset"));
  const offset = offsetNode.val() || 0;
  return (/* @__PURE__ */ new Date()).getTime() + offset;
}
function repoGenerateServerValues(repo) {
  return generateWithValues({
    timestamp: repoServerTime(repo)
  });
}
function repoOnDataUpdate(repo, pathString, data, isMerge, tag) {
  repo.dataUpdateCount++;
  const path = new Path(pathString);
  data = repo.interceptServerDataCallback_ ? repo.interceptServerDataCallback_(pathString, data) : data;
  let events = [];
  if (tag) {
    if (isMerge) {
      const taggedChildren = map(data, (raw) => nodeFromJSON(raw));
      events = syncTreeApplyTaggedQueryMerge(repo.serverSyncTree_, path, taggedChildren, tag);
    } else {
      const taggedSnap = nodeFromJSON(data);
      events = syncTreeApplyTaggedQueryOverwrite(repo.serverSyncTree_, path, taggedSnap, tag);
    }
  } else if (isMerge) {
    const changedChildren = map(data, (raw) => nodeFromJSON(raw));
    events = syncTreeApplyServerMerge(repo.serverSyncTree_, path, changedChildren);
  } else {
    const snap = nodeFromJSON(data);
    events = syncTreeApplyServerOverwrite(repo.serverSyncTree_, path, snap);
  }
  let affectedPath = path;
  if (events.length > 0) {
    affectedPath = repoRerunTransactions(repo, path);
  }
  eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, events);
}
function repoOnConnectStatus(repo, connectStatus) {
  repoUpdateInfo(repo, "connected", connectStatus);
  if (connectStatus === false) {
    repoRunOnDisconnectEvents(repo);
  }
}
function repoOnServerInfoUpdate(repo, updates) {
  each(updates, (key, value) => {
    repoUpdateInfo(repo, key, value);
  });
}
function repoUpdateInfo(repo, pathString, value) {
  const path = new Path("/.info/" + pathString);
  const newNode = nodeFromJSON(value);
  repo.infoData_.updateSnapshot(path, newNode);
  const events = syncTreeApplyServerOverwrite(repo.infoSyncTree_, path, newNode);
  eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
}
function repoGetNextWriteId(repo) {
  return repo.nextWriteId_++;
}
function repoGetValue(repo, query3, eventRegistration) {
  const cached = syncTreeGetServerValue(repo.serverSyncTree_, query3);
  if (cached != null) {
    return Promise.resolve(cached);
  }
  return repo.server_.get(query3).then((payload) => {
    const node = nodeFromJSON(payload).withIndex(query3._queryParams.getIndex());
    syncTreeAddEventRegistration(repo.serverSyncTree_, query3, eventRegistration, true);
    let events;
    if (query3._queryParams.loadsAllData()) {
      events = syncTreeApplyServerOverwrite(repo.serverSyncTree_, query3._path, node);
    } else {
      const tag = syncTreeTagForQuery(repo.serverSyncTree_, query3);
      events = syncTreeApplyTaggedQueryOverwrite(repo.serverSyncTree_, query3._path, node, tag);
    }
    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, query3._path, events);
    syncTreeRemoveEventRegistration(repo.serverSyncTree_, query3, eventRegistration, null, true);
    return node;
  }, (err) => {
    repoLog(repo, "get for query " + stringify(query3) + " failed: " + err);
    return Promise.reject(new Error(err));
  });
}
function repoSetWithPriority(repo, path, newVal, newPriority, onComplete) {
  repoLog(repo, "set", {
    path: path.toString(),
    value: newVal,
    priority: newPriority
  });
  const serverValues = repoGenerateServerValues(repo);
  const newNodeUnresolved = nodeFromJSON(newVal, newPriority);
  const existing = syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path);
  const newNode = resolveDeferredValueSnapshot(newNodeUnresolved, existing, serverValues);
  const writeId = repoGetNextWriteId(repo);
  const events = syncTreeApplyUserOverwrite(repo.serverSyncTree_, path, newNode, writeId, true);
  eventQueueQueueEvents(repo.eventQueue_, events);
  repo.server_.put(path.toString(), newNodeUnresolved.val(
    /*export=*/
    true
  ), (status, errorReason) => {
    const success = status === "ok";
    if (!success) {
      warn("set at " + path + " failed: " + status);
    }
    const clearEvents = syncTreeAckUserWrite(repo.serverSyncTree_, writeId, !success);
    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, clearEvents);
    repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
  });
  const affectedPath = repoAbortTransactions(repo, path);
  repoRerunTransactions(repo, affectedPath);
  eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, []);
}
function repoUpdate(repo, path, childrenToMerge, onComplete) {
  repoLog(repo, "update", {
    path: path.toString(),
    value: childrenToMerge
  });
  let empty = true;
  const serverValues = repoGenerateServerValues(repo);
  const changedChildren = {};
  each(childrenToMerge, (changedKey, changedValue) => {
    empty = false;
    changedChildren[changedKey] = resolveDeferredValueTree(pathChild(path, changedKey), nodeFromJSON(changedValue), repo.serverSyncTree_, serverValues);
  });
  if (!empty) {
    const writeId = repoGetNextWriteId(repo);
    const events = syncTreeApplyUserMerge(repo.serverSyncTree_, path, changedChildren, writeId);
    eventQueueQueueEvents(repo.eventQueue_, events);
    repo.server_.merge(path.toString(), childrenToMerge, (status, errorReason) => {
      const success = status === "ok";
      if (!success) {
        warn("update at " + path + " failed: " + status);
      }
      const clearEvents = syncTreeAckUserWrite(repo.serverSyncTree_, writeId, !success);
      const affectedPath = clearEvents.length > 0 ? repoRerunTransactions(repo, path) : path;
      eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, clearEvents);
      repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
    });
    each(childrenToMerge, (changedPath) => {
      const affectedPath = repoAbortTransactions(repo, pathChild(path, changedPath));
      repoRerunTransactions(repo, affectedPath);
    });
    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, []);
  } else {
    log("update() called with empty data.  Don't do anything.");
    repoCallOnCompleteCallback(repo, onComplete, "ok", void 0);
  }
}
function repoRunOnDisconnectEvents(repo) {
  repoLog(repo, "onDisconnectEvents");
  const serverValues = repoGenerateServerValues(repo);
  const resolvedOnDisconnectTree = newSparseSnapshotTree();
  sparseSnapshotTreeForEachTree(repo.onDisconnect_, newEmptyPath(), (path, node) => {
    const resolved = resolveDeferredValueTree(path, node, repo.serverSyncTree_, serverValues);
    sparseSnapshotTreeRemember(resolvedOnDisconnectTree, path, resolved);
  });
  let events = [];
  sparseSnapshotTreeForEachTree(resolvedOnDisconnectTree, newEmptyPath(), (path, snap) => {
    events = events.concat(syncTreeApplyServerOverwrite(repo.serverSyncTree_, path, snap));
    const affectedPath = repoAbortTransactions(repo, path);
    repoRerunTransactions(repo, affectedPath);
  });
  repo.onDisconnect_ = newSparseSnapshotTree();
  eventQueueRaiseEventsForChangedPath(repo.eventQueue_, newEmptyPath(), events);
}
function repoOnDisconnectCancel(repo, path, onComplete) {
  repo.server_.onDisconnectCancel(path.toString(), (status, errorReason) => {
    if (status === "ok") {
      sparseSnapshotTreeForget(repo.onDisconnect_, path);
    }
    repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
  });
}
function repoOnDisconnectSet(repo, path, value, onComplete) {
  const newNode = nodeFromJSON(value);
  repo.server_.onDisconnectPut(path.toString(), newNode.val(
    /*export=*/
    true
  ), (status, errorReason) => {
    if (status === "ok") {
      sparseSnapshotTreeRemember(repo.onDisconnect_, path, newNode);
    }
    repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
  });
}
function repoOnDisconnectSetWithPriority(repo, path, value, priority, onComplete) {
  const newNode = nodeFromJSON(value, priority);
  repo.server_.onDisconnectPut(path.toString(), newNode.val(
    /*export=*/
    true
  ), (status, errorReason) => {
    if (status === "ok") {
      sparseSnapshotTreeRemember(repo.onDisconnect_, path, newNode);
    }
    repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
  });
}
function repoOnDisconnectUpdate(repo, path, childrenToMerge, onComplete) {
  if (isEmpty(childrenToMerge)) {
    log("onDisconnect().update() called with empty data.  Don't do anything.");
    repoCallOnCompleteCallback(repo, onComplete, "ok", void 0);
    return;
  }
  repo.server_.onDisconnectMerge(path.toString(), childrenToMerge, (status, errorReason) => {
    if (status === "ok") {
      each(childrenToMerge, (childName, childNode) => {
        const newChildNode = nodeFromJSON(childNode);
        sparseSnapshotTreeRemember(repo.onDisconnect_, pathChild(path, childName), newChildNode);
      });
    }
    repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
  });
}
function repoAddEventCallbackForQuery(repo, query3, eventRegistration) {
  let events;
  if (pathGetFront(query3._path) === ".info") {
    events = syncTreeAddEventRegistration(repo.infoSyncTree_, query3, eventRegistration);
  } else {
    events = syncTreeAddEventRegistration(repo.serverSyncTree_, query3, eventRegistration);
  }
  eventQueueRaiseEventsAtPath(repo.eventQueue_, query3._path, events);
}
function repoRemoveEventCallbackForQuery(repo, query3, eventRegistration) {
  let events;
  if (pathGetFront(query3._path) === ".info") {
    events = syncTreeRemoveEventRegistration(repo.infoSyncTree_, query3, eventRegistration);
  } else {
    events = syncTreeRemoveEventRegistration(repo.serverSyncTree_, query3, eventRegistration);
  }
  eventQueueRaiseEventsAtPath(repo.eventQueue_, query3._path, events);
}
function repoInterrupt(repo) {
  if (repo.persistentConnection_) {
    repo.persistentConnection_.interrupt(INTERRUPT_REASON);
  }
}
function repoResume(repo) {
  if (repo.persistentConnection_) {
    repo.persistentConnection_.resume(INTERRUPT_REASON);
  }
}
function repoLog(repo, ...varArgs) {
  let prefix = "";
  if (repo.persistentConnection_) {
    prefix = repo.persistentConnection_.id + ":";
  }
  log(prefix, ...varArgs);
}
function repoCallOnCompleteCallback(repo, callback, status, errorReason) {
  if (callback) {
    exceptionGuard(() => {
      if (status === "ok") {
        callback(null);
      } else {
        const code = (status || "error").toUpperCase();
        let message = code;
        if (errorReason) {
          message += ": " + errorReason;
        }
        const error2 = new Error(message);
        error2.code = code;
        callback(error2);
      }
    });
  }
}
function repoStartTransaction(repo, path, transactionUpdate, onComplete, unwatcher, applyLocally) {
  repoLog(repo, "transaction on " + path);
  const transaction = {
    path,
    update: transactionUpdate,
    onComplete,
    // One of TransactionStatus enums.
    status: null,
    // Used when combining transactions at different locations to figure out
    // which one goes first.
    order: LUIDGenerator(),
    // Whether to raise local events for this transaction.
    applyLocally,
    // Count of how many times we've retried the transaction.
    retryCount: 0,
    // Function to call to clean up our .on() listener.
    unwatcher,
    // Stores why a transaction was aborted.
    abortReason: null,
    currentWriteId: null,
    currentInputSnapshot: null,
    currentOutputSnapshotRaw: null,
    currentOutputSnapshotResolved: null
  };
  const currentState = repoGetLatestState(repo, path, void 0);
  transaction.currentInputSnapshot = currentState;
  const newVal = transaction.update(currentState.val());
  if (newVal === void 0) {
    transaction.unwatcher();
    transaction.currentOutputSnapshotRaw = null;
    transaction.currentOutputSnapshotResolved = null;
    if (transaction.onComplete) {
      transaction.onComplete(null, false, transaction.currentInputSnapshot);
    }
  } else {
    validateFirebaseData("transaction failed: Data returned ", newVal, transaction.path);
    transaction.status = 0;
    const queueNode = treeSubTree(repo.transactionQueueTree_, path);
    const nodeQueue = treeGetValue(queueNode) || [];
    nodeQueue.push(transaction);
    treeSetValue(queueNode, nodeQueue);
    let priorityForNode;
    if (typeof newVal === "object" && newVal !== null && contains(newVal, ".priority")) {
      priorityForNode = safeGet(newVal, ".priority");
      assert(isValidPriority(priorityForNode), "Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.");
    } else {
      const currentNode = syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path) || ChildrenNode.EMPTY_NODE;
      priorityForNode = currentNode.getPriority().val();
    }
    const serverValues = repoGenerateServerValues(repo);
    const newNodeUnresolved = nodeFromJSON(newVal, priorityForNode);
    const newNode = resolveDeferredValueSnapshot(newNodeUnresolved, currentState, serverValues);
    transaction.currentOutputSnapshotRaw = newNodeUnresolved;
    transaction.currentOutputSnapshotResolved = newNode;
    transaction.currentWriteId = repoGetNextWriteId(repo);
    const events = syncTreeApplyUserOverwrite(repo.serverSyncTree_, path, newNode, transaction.currentWriteId, transaction.applyLocally);
    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
    repoSendReadyTransactions(repo, repo.transactionQueueTree_);
  }
}
function repoGetLatestState(repo, path, excludeSets) {
  return syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path, excludeSets) || ChildrenNode.EMPTY_NODE;
}
function repoSendReadyTransactions(repo, node = repo.transactionQueueTree_) {
  if (!node) {
    repoPruneCompletedTransactionsBelowNode(repo, node);
  }
  if (treeGetValue(node)) {
    const queue = repoBuildTransactionQueue(repo, node);
    assert(queue.length > 0, "Sending zero length transaction queue");
    const allRun = queue.every(
      (transaction) => transaction.status === 0
      /* TransactionStatus.RUN */
    );
    if (allRun) {
      repoSendTransactionQueue(repo, treeGetPath(node), queue);
    }
  } else if (treeHasChildren(node)) {
    treeForEachChild(node, (childNode) => {
      repoSendReadyTransactions(repo, childNode);
    });
  }
}
function repoSendTransactionQueue(repo, path, queue) {
  const setsToIgnore = queue.map((txn) => {
    return txn.currentWriteId;
  });
  const latestState = repoGetLatestState(repo, path, setsToIgnore);
  let snapToSend = latestState;
  const latestHash = latestState.hash();
  for (let i = 0; i < queue.length; i++) {
    const txn = queue[i];
    assert(txn.status === 0, "tryToSendTransactionQueue_: items in queue should all be run.");
    txn.status = 1;
    txn.retryCount++;
    const relativePath = newRelativePath(path, txn.path);
    snapToSend = snapToSend.updateChild(relativePath, txn.currentOutputSnapshotRaw);
  }
  const dataToSend = snapToSend.val(true);
  const pathToSend = path;
  repo.server_.put(pathToSend.toString(), dataToSend, (status) => {
    repoLog(repo, "transaction put response", {
      path: pathToSend.toString(),
      status
    });
    let events = [];
    if (status === "ok") {
      const callbacks = [];
      for (let i = 0; i < queue.length; i++) {
        queue[i].status = 2;
        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, queue[i].currentWriteId));
        if (queue[i].onComplete) {
          callbacks.push(() => queue[i].onComplete(null, true, queue[i].currentOutputSnapshotResolved));
        }
        queue[i].unwatcher();
      }
      repoPruneCompletedTransactionsBelowNode(repo, treeSubTree(repo.transactionQueueTree_, path));
      repoSendReadyTransactions(repo, repo.transactionQueueTree_);
      eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
      for (let i = 0; i < callbacks.length; i++) {
        exceptionGuard(callbacks[i]);
      }
    } else {
      if (status === "datastale") {
        for (let i = 0; i < queue.length; i++) {
          if (queue[i].status === 3) {
            queue[i].status = 4;
          } else {
            queue[i].status = 0;
          }
        }
      } else {
        warn("transaction at " + pathToSend.toString() + " failed: " + status);
        for (let i = 0; i < queue.length; i++) {
          queue[i].status = 4;
          queue[i].abortReason = status;
        }
      }
      repoRerunTransactions(repo, path);
    }
  }, latestHash);
}
function repoRerunTransactions(repo, changedPath) {
  const rootMostTransactionNode = repoGetAncestorTransactionNode(repo, changedPath);
  const path = treeGetPath(rootMostTransactionNode);
  const queue = repoBuildTransactionQueue(repo, rootMostTransactionNode);
  repoRerunTransactionQueue(repo, queue, path);
  return path;
}
function repoRerunTransactionQueue(repo, queue, path) {
  if (queue.length === 0) {
    return;
  }
  const callbacks = [];
  let events = [];
  const txnsToRerun = queue.filter((q) => {
    return q.status === 0;
  });
  const setsToIgnore = txnsToRerun.map((q) => {
    return q.currentWriteId;
  });
  for (let i = 0; i < queue.length; i++) {
    const transaction = queue[i];
    const relativePath = newRelativePath(path, transaction.path);
    let abortTransaction = false, abortReason;
    assert(relativePath !== null, "rerunTransactionsUnderNode_: relativePath should not be null.");
    if (transaction.status === 4) {
      abortTransaction = true;
      abortReason = transaction.abortReason;
      events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
    } else if (transaction.status === 0) {
      if (transaction.retryCount >= MAX_TRANSACTION_RETRIES) {
        abortTransaction = true;
        abortReason = "maxretry";
        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
      } else {
        const currentNode = repoGetLatestState(repo, transaction.path, setsToIgnore);
        transaction.currentInputSnapshot = currentNode;
        const newData = queue[i].update(currentNode.val());
        if (newData !== void 0) {
          validateFirebaseData("transaction failed: Data returned ", newData, transaction.path);
          let newDataNode = nodeFromJSON(newData);
          const hasExplicitPriority = typeof newData === "object" && newData != null && contains(newData, ".priority");
          if (!hasExplicitPriority) {
            newDataNode = newDataNode.updatePriority(currentNode.getPriority());
          }
          const oldWriteId = transaction.currentWriteId;
          const serverValues = repoGenerateServerValues(repo);
          const newNodeResolved = resolveDeferredValueSnapshot(newDataNode, currentNode, serverValues);
          transaction.currentOutputSnapshotRaw = newDataNode;
          transaction.currentOutputSnapshotResolved = newNodeResolved;
          transaction.currentWriteId = repoGetNextWriteId(repo);
          setsToIgnore.splice(setsToIgnore.indexOf(oldWriteId), 1);
          events = events.concat(syncTreeApplyUserOverwrite(repo.serverSyncTree_, transaction.path, newNodeResolved, transaction.currentWriteId, transaction.applyLocally));
          events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, oldWriteId, true));
        } else {
          abortTransaction = true;
          abortReason = "nodata";
          events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
        }
      }
    }
    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
    events = [];
    if (abortTransaction) {
      queue[i].status = 2;
      (function(unwatcher) {
        setTimeout(unwatcher, Math.floor(0));
      })(queue[i].unwatcher);
      if (queue[i].onComplete) {
        if (abortReason === "nodata") {
          callbacks.push(() => queue[i].onComplete(null, false, queue[i].currentInputSnapshot));
        } else {
          callbacks.push(() => queue[i].onComplete(new Error(abortReason), false, null));
        }
      }
    }
  }
  repoPruneCompletedTransactionsBelowNode(repo, repo.transactionQueueTree_);
  for (let i = 0; i < callbacks.length; i++) {
    exceptionGuard(callbacks[i]);
  }
  repoSendReadyTransactions(repo, repo.transactionQueueTree_);
}
function repoGetAncestorTransactionNode(repo, path) {
  let front;
  let transactionNode = repo.transactionQueueTree_;
  front = pathGetFront(path);
  while (front !== null && treeGetValue(transactionNode) === void 0) {
    transactionNode = treeSubTree(transactionNode, front);
    path = pathPopFront(path);
    front = pathGetFront(path);
  }
  return transactionNode;
}
function repoBuildTransactionQueue(repo, transactionNode) {
  const transactionQueue = [];
  repoAggregateTransactionQueuesForNode(repo, transactionNode, transactionQueue);
  transactionQueue.sort((a, b) => a.order - b.order);
  return transactionQueue;
}
function repoAggregateTransactionQueuesForNode(repo, node, queue) {
  const nodeQueue = treeGetValue(node);
  if (nodeQueue) {
    for (let i = 0; i < nodeQueue.length; i++) {
      queue.push(nodeQueue[i]);
    }
  }
  treeForEachChild(node, (child3) => {
    repoAggregateTransactionQueuesForNode(repo, child3, queue);
  });
}
function repoPruneCompletedTransactionsBelowNode(repo, node) {
  const queue = treeGetValue(node);
  if (queue) {
    let to = 0;
    for (let from3 = 0; from3 < queue.length; from3++) {
      if (queue[from3].status !== 2) {
        queue[to] = queue[from3];
        to++;
      }
    }
    queue.length = to;
    treeSetValue(node, queue.length > 0 ? queue : void 0);
  }
  treeForEachChild(node, (childNode) => {
    repoPruneCompletedTransactionsBelowNode(repo, childNode);
  });
}
function repoAbortTransactions(repo, path) {
  const affectedPath = treeGetPath(repoGetAncestorTransactionNode(repo, path));
  const transactionNode = treeSubTree(repo.transactionQueueTree_, path);
  treeForEachAncestor(transactionNode, (node) => {
    repoAbortTransactionsOnNode(repo, node);
  });
  repoAbortTransactionsOnNode(repo, transactionNode);
  treeForEachDescendant(transactionNode, (node) => {
    repoAbortTransactionsOnNode(repo, node);
  });
  return affectedPath;
}
function repoAbortTransactionsOnNode(repo, node) {
  const queue = treeGetValue(node);
  if (queue) {
    const callbacks = [];
    let events = [];
    let lastSent = -1;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status === 3) ;
      else if (queue[i].status === 1) {
        assert(lastSent === i - 1, "All SENT items should be at beginning of queue.");
        lastSent = i;
        queue[i].status = 3;
        queue[i].abortReason = "set";
      } else {
        assert(queue[i].status === 0, "Unexpected transaction status in abort");
        queue[i].unwatcher();
        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, queue[i].currentWriteId, true));
        if (queue[i].onComplete) {
          callbacks.push(queue[i].onComplete.bind(null, new Error("set"), false, null));
        }
      }
    }
    if (lastSent === -1) {
      treeSetValue(node, void 0);
    } else {
      queue.length = lastSent + 1;
    }
    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, treeGetPath(node), events);
    for (let i = 0; i < callbacks.length; i++) {
      exceptionGuard(callbacks[i]);
    }
  }
}
function decodePath(pathString) {
  let pathStringDecoded = "";
  const pieces = pathString.split("/");
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].length > 0) {
      let piece = pieces[i];
      try {
        piece = decodeURIComponent(piece.replace(/\+/g, " "));
      } catch (e) {
      }
      pathStringDecoded += "/" + piece;
    }
  }
  return pathStringDecoded;
}
function decodeQuery(queryString) {
  const results = {};
  if (queryString.charAt(0) === "?") {
    queryString = queryString.substring(1);
  }
  for (const segment of queryString.split("&")) {
    if (segment.length === 0) {
      continue;
    }
    const kv = segment.split("=");
    if (kv.length === 2) {
      results[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
    } else {
      warn(`Invalid query segment '${segment}' in query '${queryString}'`);
    }
  }
  return results;
}
var parseRepoInfo = function(dataURL, nodeAdmin) {
  const parsedUrl = parseDatabaseURL(dataURL), namespace = parsedUrl.namespace;
  if (parsedUrl.domain === "firebase.com") {
    fatal(parsedUrl.host + " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
  }
  if ((!namespace || namespace === "undefined") && parsedUrl.domain !== "localhost") {
    fatal("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");
  }
  if (!parsedUrl.secure) {
    warnIfPageIsSecure();
  }
  const webSocketOnly = parsedUrl.scheme === "ws" || parsedUrl.scheme === "wss";
  return {
    repoInfo: new RepoInfo(
      parsedUrl.host,
      parsedUrl.secure,
      namespace,
      webSocketOnly,
      nodeAdmin,
      /*persistenceKey=*/
      "",
      /*includeNamespaceInQueryParams=*/
      namespace !== parsedUrl.subdomain
    ),
    path: new Path(parsedUrl.pathString)
  };
};
var parseDatabaseURL = function(dataURL) {
  let host = "", domain = "", subdomain = "", pathString = "", namespace = "";
  let secure = true, scheme = "https", port = 443;
  if (typeof dataURL === "string") {
    let colonInd = dataURL.indexOf("//");
    if (colonInd >= 0) {
      scheme = dataURL.substring(0, colonInd - 1);
      dataURL = dataURL.substring(colonInd + 2);
    }
    let slashInd = dataURL.indexOf("/");
    if (slashInd === -1) {
      slashInd = dataURL.length;
    }
    let questionMarkInd = dataURL.indexOf("?");
    if (questionMarkInd === -1) {
      questionMarkInd = dataURL.length;
    }
    host = dataURL.substring(0, Math.min(slashInd, questionMarkInd));
    if (slashInd < questionMarkInd) {
      pathString = decodePath(dataURL.substring(slashInd, questionMarkInd));
    }
    const queryParams = decodeQuery(dataURL.substring(Math.min(dataURL.length, questionMarkInd)));
    colonInd = host.indexOf(":");
    if (colonInd >= 0) {
      secure = scheme === "https" || scheme === "wss";
      port = parseInt(host.substring(colonInd + 1), 10);
    } else {
      colonInd = host.length;
    }
    const hostWithoutPort = host.slice(0, colonInd);
    if (hostWithoutPort.toLowerCase() === "localhost") {
      domain = "localhost";
    } else if (hostWithoutPort.split(".").length <= 2) {
      domain = hostWithoutPort;
    } else {
      const dotInd = host.indexOf(".");
      subdomain = host.substring(0, dotInd).toLowerCase();
      domain = host.substring(dotInd + 1);
      namespace = subdomain;
    }
    if ("ns" in queryParams) {
      namespace = queryParams["ns"];
    }
  }
  return {
    host,
    port,
    domain,
    subdomain,
    secure,
    scheme,
    pathString,
    namespace
  };
};
var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
var nextPushId = /* @__PURE__ */ function() {
  let lastPushTime = 0;
  const lastRandChars = [];
  return function(now) {
    const duplicateTime = now === lastPushTime;
    lastPushTime = now;
    let i;
    const timeStampChars = new Array(8);
    for (i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }
    assert(now === 0, "Cannot push at time == 0");
    let id = timeStampChars.join("");
    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    assert(id.length === 20, "nextPushId: Length should be 20.");
    return id;
  };
}();
var DataEvent = class {
  /**
   * @param eventType - One of: value, child_added, child_changed, child_moved, child_removed
   * @param eventRegistration - The function to call to with the event data. User provided
   * @param snapshot - The data backing the event
   * @param prevName - Optional, the name of the previous child for child_* events.
   */
  constructor(eventType, eventRegistration, snapshot, prevName) {
    this.eventType = eventType;
    this.eventRegistration = eventRegistration;
    this.snapshot = snapshot;
    this.prevName = prevName;
  }
  getPath() {
    const ref3 = this.snapshot.ref;
    if (this.eventType === "value") {
      return ref3._path;
    } else {
      return ref3.parent._path;
    }
  }
  getEventType() {
    return this.eventType;
  }
  getEventRunner() {
    return this.eventRegistration.getEventRunner(this);
  }
  toString() {
    return this.getPath().toString() + ":" + this.eventType + ":" + stringify(this.snapshot.exportVal());
  }
};
var CancelEvent = class {
  constructor(eventRegistration, error2, path) {
    this.eventRegistration = eventRegistration;
    this.error = error2;
    this.path = path;
  }
  getPath() {
    return this.path;
  }
  getEventType() {
    return "cancel";
  }
  getEventRunner() {
    return this.eventRegistration.getEventRunner(this);
  }
  toString() {
    return this.path.toString() + ":cancel";
  }
};
var CallbackContext = class {
  constructor(snapshotCallback, cancelCallback) {
    this.snapshotCallback = snapshotCallback;
    this.cancelCallback = cancelCallback;
  }
  onValue(expDataSnapshot, previousChildName) {
    this.snapshotCallback.call(null, expDataSnapshot, previousChildName);
  }
  onCancel(error2) {
    assert(this.hasCancelCallback, "Raising a cancel event on a listener with no cancel callback");
    return this.cancelCallback.call(null, error2);
  }
  get hasCancelCallback() {
    return !!this.cancelCallback;
  }
  matches(other) {
    return this.snapshotCallback === other.snapshotCallback || this.snapshotCallback.userCallback !== void 0 && this.snapshotCallback.userCallback === other.snapshotCallback.userCallback && this.snapshotCallback.context === other.snapshotCallback.context;
  }
};
var OnDisconnect = class {
  /** @hideconstructor */
  constructor(_repo, _path) {
    this._repo = _repo;
    this._path = _path;
  }
  /**
   * Cancels all previously queued `onDisconnect()` set or update events for this
   * location and all children.
   *
   * If a write has been queued for this location via a `set()` or `update()` at a
   * parent location, the write at this location will be canceled, though writes
   * to sibling locations will still occur.
   *
   * @returns Resolves when synchronization to the server is complete.
   */
  cancel() {
    const deferred = new Deferred();
    repoOnDisconnectCancel(this._repo, this._path, deferred.wrapCallback(() => {
    }));
    return deferred.promise;
  }
  /**
   * Ensures the data at this location is deleted when the client is disconnected
   * (due to closing the browser, navigating to a new page, or network issues).
   *
   * @returns Resolves when synchronization to the server is complete.
   */
  remove() {
    validateWritablePath("OnDisconnect.remove", this._path);
    const deferred = new Deferred();
    repoOnDisconnectSet(this._repo, this._path, null, deferred.wrapCallback(() => {
    }));
    return deferred.promise;
  }
  /**
   * Ensures the data at this location is set to the specified value when the
   * client is disconnected (due to closing the browser, navigating to a new page,
   * or network issues).
   *
   * `set()` is especially useful for implementing "presence" systems, where a
   * value should be changed or cleared when a user disconnects so that they
   * appear "offline" to other users. See
   * {@link https://firebase.google.com/docs/database/web/offline-capabilities | Enabling Offline Capabilities in JavaScript}
   * for more information.
   *
   * Note that `onDisconnect` operations are only triggered once. If you want an
   * operation to occur each time a disconnect occurs, you'll need to re-establish
   * the `onDisconnect` operations each time.
   *
   * @param value - The value to be written to this location on disconnect (can
   * be an object, array, string, number, boolean, or null).
   * @returns Resolves when synchronization to the Database is complete.
   */
  set(value) {
    validateWritablePath("OnDisconnect.set", this._path);
    validateFirebaseDataArg("OnDisconnect.set", value, this._path, false);
    const deferred = new Deferred();
    repoOnDisconnectSet(this._repo, this._path, value, deferred.wrapCallback(() => {
    }));
    return deferred.promise;
  }
  /**
   * Ensures the data at this location is set to the specified value and priority
   * when the client is disconnected (due to closing the browser, navigating to a
   * new page, or network issues).
   *
   * @param value - The value to be written to this location on disconnect (can
   * be an object, array, string, number, boolean, or null).
   * @param priority - The priority to be written (string, number, or null).
   * @returns Resolves when synchronization to the Database is complete.
   */
  setWithPriority(value, priority) {
    validateWritablePath("OnDisconnect.setWithPriority", this._path);
    validateFirebaseDataArg("OnDisconnect.setWithPriority", value, this._path, false);
    validatePriority("OnDisconnect.setWithPriority", priority, false);
    const deferred = new Deferred();
    repoOnDisconnectSetWithPriority(this._repo, this._path, value, priority, deferred.wrapCallback(() => {
    }));
    return deferred.promise;
  }
  /**
   * Writes multiple values at this location when the client is disconnected (due
   * to closing the browser, navigating to a new page, or network issues).
   *
   * The `values` argument contains multiple property-value pairs that will be
   * written to the Database together. Each child property can either be a simple
   * property (for example, "name") or a relative path (for example, "name/first")
   * from the current location to the data to update.
   *
   * As opposed to the `set()` method, `update()` can be use to selectively update
   * only the referenced properties at the current location (instead of replacing
   * all the child properties at the current location).
   *
   * @param values - Object containing multiple values.
   * @returns Resolves when synchronization to the Database is complete.
   */
  update(values) {
    validateWritablePath("OnDisconnect.update", this._path);
    validateFirebaseMergeDataArg("OnDisconnect.update", values, this._path, false);
    const deferred = new Deferred();
    repoOnDisconnectUpdate(this._repo, this._path, values, deferred.wrapCallback(() => {
    }));
    return deferred.promise;
  }
};
var QueryImpl = class _QueryImpl {
  /**
   * @hideconstructor
   */
  constructor(_repo, _path, _queryParams, _orderByCalled) {
    this._repo = _repo;
    this._path = _path;
    this._queryParams = _queryParams;
    this._orderByCalled = _orderByCalled;
  }
  get key() {
    if (pathIsEmpty(this._path)) {
      return null;
    } else {
      return pathGetBack(this._path);
    }
  }
  get ref() {
    return new ReferenceImpl(this._repo, this._path);
  }
  get _queryIdentifier() {
    const obj = queryParamsGetQueryObject(this._queryParams);
    const id = ObjectToUniqueKey(obj);
    return id === "{}" ? "default" : id;
  }
  /**
   * An object representation of the query parameters used by this Query.
   */
  get _queryObject() {
    return queryParamsGetQueryObject(this._queryParams);
  }
  isEqual(other) {
    other = getModularInstance(other);
    if (!(other instanceof _QueryImpl)) {
      return false;
    }
    const sameRepo = this._repo === other._repo;
    const samePath = pathEquals(this._path, other._path);
    const sameQueryIdentifier = this._queryIdentifier === other._queryIdentifier;
    return sameRepo && samePath && sameQueryIdentifier;
  }
  toJSON() {
    return this.toString();
  }
  toString() {
    return this._repo.toString() + pathToUrlEncodedString(this._path);
  }
};
function validateNoPreviousOrderByCall(query3, fnName) {
  if (query3._orderByCalled === true) {
    throw new Error(fnName + ": You can't combine multiple orderBy calls.");
  }
}
function validateQueryEndpoints(params) {
  let startNode = null;
  let endNode = null;
  if (params.hasStart()) {
    startNode = params.getIndexStartValue();
  }
  if (params.hasEnd()) {
    endNode = params.getIndexEndValue();
  }
  if (params.getIndex() === KEY_INDEX) {
    const tooManyArgsError = "Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().";
    const wrongArgTypeError = "Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";
    if (params.hasStart()) {
      const startName = params.getIndexStartName();
      if (startName !== MIN_NAME) {
        throw new Error(tooManyArgsError);
      } else if (typeof startNode !== "string") {
        throw new Error(wrongArgTypeError);
      }
    }
    if (params.hasEnd()) {
      const endName = params.getIndexEndName();
      if (endName !== MAX_NAME) {
        throw new Error(tooManyArgsError);
      } else if (typeof endNode !== "string") {
        throw new Error(wrongArgTypeError);
      }
    }
  } else if (params.getIndex() === PRIORITY_INDEX) {
    if (startNode != null && !isValidPriority(startNode) || endNode != null && !isValidPriority(endNode)) {
      throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).");
    }
  } else {
    assert(params.getIndex() instanceof PathIndex || params.getIndex() === VALUE_INDEX, "unknown index type.");
    if (startNode != null && typeof startNode === "object" || endNode != null && typeof endNode === "object") {
      throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.");
    }
  }
}
function validateLimit(params) {
  if (params.hasStart() && params.hasEnd() && params.hasLimit() && !params.hasAnchoredLimit()) {
    throw new Error("Query: Can't combine startAt(), startAfter(), endAt(), endBefore(), and limit(). Use limitToFirst() or limitToLast() instead.");
  }
}
var ReferenceImpl = class _ReferenceImpl extends QueryImpl {
  /** @hideconstructor */
  constructor(repo, path) {
    super(repo, path, new QueryParams(), false);
  }
  get parent() {
    const parentPath = pathParent(this._path);
    return parentPath === null ? null : new _ReferenceImpl(this._repo, parentPath);
  }
  get root() {
    let ref3 = this;
    while (ref3.parent !== null) {
      ref3 = ref3.parent;
    }
    return ref3;
  }
};
var DataSnapshot = class _DataSnapshot {
  /**
   * @param _node - A SnapshotNode to wrap.
   * @param ref - The location this snapshot came from.
   * @param _index - The iteration order for this snapshot
   * @hideconstructor
   */
  constructor(_node, ref3, _index) {
    this._node = _node;
    this.ref = ref3;
    this._index = _index;
  }
  /**
   * Gets the priority value of the data in this `DataSnapshot`.
   *
   * Applications need not use priority but can order collections by
   * ordinary properties (see
   * {@link https://firebase.google.com/docs/database/web/lists-of-data#sorting_and_filtering_data |Sorting and filtering data}
   * ).
   */
  get priority() {
    return this._node.getPriority().val();
  }
  /**
   * The key (last part of the path) of the location of this `DataSnapshot`.
   *
   * The last token in a Database location is considered its key. For example,
   * "ada" is the key for the /users/ada/ node. Accessing the key on any
   * `DataSnapshot` will return the key for the location that generated it.
   * However, accessing the key on the root URL of a Database will return
   * `null`.
   */
  get key() {
    return this.ref.key;
  }
  /** Returns the number of child properties of this `DataSnapshot`. */
  get size() {
    return this._node.numChildren();
  }
  /**
   * Gets another `DataSnapshot` for the location at the specified relative path.
   *
   * Passing a relative path to the `child()` method of a DataSnapshot returns
   * another `DataSnapshot` for the location at the specified relative path. The
   * relative path can either be a simple child name (for example, "ada") or a
   * deeper, slash-separated path (for example, "ada/name/first"). If the child
   * location has no data, an empty `DataSnapshot` (that is, a `DataSnapshot`
   * whose value is `null`) is returned.
   *
   * @param path - A relative path to the location of child data.
   */
  child(path) {
    const childPath = new Path(path);
    const childRef = child(this.ref, path);
    return new _DataSnapshot(this._node.getChild(childPath), childRef, PRIORITY_INDEX);
  }
  /**
   * Returns true if this `DataSnapshot` contains any data. It is slightly more
   * efficient than using `snapshot.val() !== null`.
   */
  exists() {
    return !this._node.isEmpty();
  }
  /**
   * Exports the entire contents of the DataSnapshot as a JavaScript object.
   *
   * The `exportVal()` method is similar to `val()`, except priority information
   * is included (if available), making it suitable for backing up your data.
   *
   * @returns The DataSnapshot's contents as a JavaScript value (Object,
   *   Array, string, number, boolean, or `null`).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exportVal() {
    return this._node.val(true);
  }
  /**
   * Enumerates the top-level children in the `IteratedDataSnapshot`.
   *
   * Because of the way JavaScript objects work, the ordering of data in the
   * JavaScript object returned by `val()` is not guaranteed to match the
   * ordering on the server nor the ordering of `onChildAdded()` events. That is
   * where `forEach()` comes in handy. It guarantees the children of a
   * `DataSnapshot` will be iterated in their query order.
   *
   * If no explicit `orderBy*()` method is used, results are returned
   * ordered by key (unless priorities are used, in which case, results are
   * returned by priority).
   *
   * @param action - A function that will be called for each child DataSnapshot.
   * The callback can return true to cancel further enumeration.
   * @returns true if enumeration was canceled due to your callback returning
   * true.
   */
  forEach(action) {
    if (this._node.isLeafNode()) {
      return false;
    }
    const childrenNode = this._node;
    return !!childrenNode.forEachChild(this._index, (key, node) => {
      return action(new _DataSnapshot(node, child(this.ref, key), PRIORITY_INDEX));
    });
  }
  /**
   * Returns true if the specified child path has (non-null) data.
   *
   * @param path - A relative path to the location of a potential child.
   * @returns `true` if data exists at the specified child path; else
   *  `false`.
   */
  hasChild(path) {
    const childPath = new Path(path);
    return !this._node.getChild(childPath).isEmpty();
  }
  /**
   * Returns whether or not the `DataSnapshot` has any non-`null` child
   * properties.
   *
   * You can use `hasChildren()` to determine if a `DataSnapshot` has any
   * children. If it does, you can enumerate them using `forEach()`. If it
   * doesn't, then either this snapshot contains a primitive value (which can be
   * retrieved with `val()`) or it is empty (in which case, `val()` will return
   * `null`).
   *
   * @returns true if this snapshot has any children; else false.
   */
  hasChildren() {
    if (this._node.isLeafNode()) {
      return false;
    } else {
      return !this._node.isEmpty();
    }
  }
  /**
   * Returns a JSON-serializable representation of this object.
   */
  toJSON() {
    return this.exportVal();
  }
  /**
   * Extracts a JavaScript value from a `DataSnapshot`.
   *
   * Depending on the data in a `DataSnapshot`, the `val()` method may return a
   * scalar type (string, number, or boolean), an array, or an object. It may
   * also return null, indicating that the `DataSnapshot` is empty (contains no
   * data).
   *
   * @returns The DataSnapshot's contents as a JavaScript value (Object,
   *   Array, string, number, boolean, or `null`).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  val() {
    return this._node.val();
  }
};
function ref(db, path) {
  db = getModularInstance(db);
  db._checkNotDeleted("ref");
  return path !== void 0 ? child(db._root, path) : db._root;
}
function refFromURL(db, url) {
  db = getModularInstance(db);
  db._checkNotDeleted("refFromURL");
  const parsedURL = parseRepoInfo(url, db._repo.repoInfo_.nodeAdmin);
  validateUrl("refFromURL", parsedURL);
  const repoInfo = parsedURL.repoInfo;
  if (!db._repo.repoInfo_.isCustomHost() && repoInfo.host !== db._repo.repoInfo_.host) {
    fatal("refFromURL: Host name does not match the current database: (found " + repoInfo.host + " but expected " + db._repo.repoInfo_.host + ")");
  }
  return ref(db, parsedURL.path.toString());
}
function child(parent, path) {
  parent = getModularInstance(parent);
  if (pathGetFront(parent._path) === null) {
    validateRootPathString("child", "path", path, false);
  } else {
    validatePathString("child", "path", path, false);
  }
  return new ReferenceImpl(parent._repo, pathChild(parent._path, path));
}
function onDisconnect(ref3) {
  ref3 = getModularInstance(ref3);
  return new OnDisconnect(ref3._repo, ref3._path);
}
function push(parent, value) {
  parent = getModularInstance(parent);
  validateWritablePath("push", parent._path);
  validateFirebaseDataArg("push", value, parent._path, true);
  const now = repoServerTime(parent._repo);
  const name2 = nextPushId(now);
  const thennablePushRef = child(parent, name2);
  const pushRef = child(parent, name2);
  let promise;
  if (value != null) {
    promise = set(pushRef, value).then(() => pushRef);
  } else {
    promise = Promise.resolve(pushRef);
  }
  thennablePushRef.then = promise.then.bind(promise);
  thennablePushRef.catch = promise.then.bind(promise, void 0);
  return thennablePushRef;
}
function remove(ref3) {
  validateWritablePath("remove", ref3._path);
  return set(ref3, null);
}
function set(ref3, value) {
  ref3 = getModularInstance(ref3);
  validateWritablePath("set", ref3._path);
  validateFirebaseDataArg("set", value, ref3._path, false);
  const deferred = new Deferred();
  repoSetWithPriority(
    ref3._repo,
    ref3._path,
    value,
    /*priority=*/
    null,
    deferred.wrapCallback(() => {
    })
  );
  return deferred.promise;
}
function setPriority(ref3, priority) {
  ref3 = getModularInstance(ref3);
  validateWritablePath("setPriority", ref3._path);
  validatePriority("setPriority", priority, false);
  const deferred = new Deferred();
  repoSetWithPriority(ref3._repo, pathChild(ref3._path, ".priority"), priority, null, deferred.wrapCallback(() => {
  }));
  return deferred.promise;
}
function setWithPriority(ref3, value, priority) {
  validateWritablePath("setWithPriority", ref3._path);
  validateFirebaseDataArg("setWithPriority", value, ref3._path, false);
  validatePriority("setWithPriority", priority, false);
  if (ref3.key === ".length" || ref3.key === ".keys") {
    throw "setWithPriority failed: " + ref3.key + " is a read-only object.";
  }
  const deferred = new Deferred();
  repoSetWithPriority(ref3._repo, ref3._path, value, priority, deferred.wrapCallback(() => {
  }));
  return deferred.promise;
}
function update(ref3, values) {
  validateFirebaseMergeDataArg("update", values, ref3._path, false);
  const deferred = new Deferred();
  repoUpdate(ref3._repo, ref3._path, values, deferred.wrapCallback(() => {
  }));
  return deferred.promise;
}
function get(query3) {
  query3 = getModularInstance(query3);
  const callbackContext = new CallbackContext(() => {
  });
  const container = new ValueEventRegistration(callbackContext);
  return repoGetValue(query3._repo, query3, container).then((node) => {
    return new DataSnapshot(node, new ReferenceImpl(query3._repo, query3._path), query3._queryParams.getIndex());
  });
}
var ValueEventRegistration = class _ValueEventRegistration {
  constructor(callbackContext) {
    this.callbackContext = callbackContext;
  }
  respondsTo(eventType) {
    return eventType === "value";
  }
  createEvent(change, query3) {
    const index = query3._queryParams.getIndex();
    return new DataEvent("value", this, new DataSnapshot(change.snapshotNode, new ReferenceImpl(query3._repo, query3._path), index));
  }
  getEventRunner(eventData) {
    if (eventData.getEventType() === "cancel") {
      return () => this.callbackContext.onCancel(eventData.error);
    } else {
      return () => this.callbackContext.onValue(eventData.snapshot, null);
    }
  }
  createCancelEvent(error2, path) {
    if (this.callbackContext.hasCancelCallback) {
      return new CancelEvent(this, error2, path);
    } else {
      return null;
    }
  }
  matches(other) {
    if (!(other instanceof _ValueEventRegistration)) {
      return false;
    } else if (!other.callbackContext || !this.callbackContext) {
      return true;
    } else {
      return other.callbackContext.matches(this.callbackContext);
    }
  }
  hasAnyCallback() {
    return this.callbackContext !== null;
  }
};
var ChildEventRegistration = class _ChildEventRegistration {
  constructor(eventType, callbackContext) {
    this.eventType = eventType;
    this.callbackContext = callbackContext;
  }
  respondsTo(eventType) {
    let eventToCheck = eventType === "children_added" ? "child_added" : eventType;
    eventToCheck = eventToCheck === "children_removed" ? "child_removed" : eventToCheck;
    return this.eventType === eventToCheck;
  }
  createCancelEvent(error2, path) {
    if (this.callbackContext.hasCancelCallback) {
      return new CancelEvent(this, error2, path);
    } else {
      return null;
    }
  }
  createEvent(change, query3) {
    assert(change.childName != null, "Child events should have a childName.");
    const childRef = child(new ReferenceImpl(query3._repo, query3._path), change.childName);
    const index = query3._queryParams.getIndex();
    return new DataEvent(change.type, this, new DataSnapshot(change.snapshotNode, childRef, index), change.prevName);
  }
  getEventRunner(eventData) {
    if (eventData.getEventType() === "cancel") {
      return () => this.callbackContext.onCancel(eventData.error);
    } else {
      return () => this.callbackContext.onValue(eventData.snapshot, eventData.prevName);
    }
  }
  matches(other) {
    if (other instanceof _ChildEventRegistration) {
      return this.eventType === other.eventType && (!this.callbackContext || !other.callbackContext || this.callbackContext.matches(other.callbackContext));
    }
    return false;
  }
  hasAnyCallback() {
    return !!this.callbackContext;
  }
};
function addEventListener(query3, eventType, callback, cancelCallbackOrListenOptions, options) {
  let cancelCallback;
  if (typeof cancelCallbackOrListenOptions === "object") {
    cancelCallback = void 0;
    options = cancelCallbackOrListenOptions;
  }
  if (typeof cancelCallbackOrListenOptions === "function") {
    cancelCallback = cancelCallbackOrListenOptions;
  }
  if (options && options.onlyOnce) {
    const userCallback = callback;
    const onceCallback = (dataSnapshot, previousChildName) => {
      repoRemoveEventCallbackForQuery(query3._repo, query3, container);
      userCallback(dataSnapshot, previousChildName);
    };
    onceCallback.userCallback = callback.userCallback;
    onceCallback.context = callback.context;
    callback = onceCallback;
  }
  const callbackContext = new CallbackContext(callback, cancelCallback || void 0);
  const container = eventType === "value" ? new ValueEventRegistration(callbackContext) : new ChildEventRegistration(eventType, callbackContext);
  repoAddEventCallbackForQuery(query3._repo, query3, container);
  return () => repoRemoveEventCallbackForQuery(query3._repo, query3, container);
}
function onValue(query3, callback, cancelCallbackOrListenOptions, options) {
  return addEventListener(query3, "value", callback, cancelCallbackOrListenOptions, options);
}
function onChildAdded(query3, callback, cancelCallbackOrListenOptions, options) {
  return addEventListener(query3, "child_added", callback, cancelCallbackOrListenOptions, options);
}
function onChildChanged(query3, callback, cancelCallbackOrListenOptions, options) {
  return addEventListener(query3, "child_changed", callback, cancelCallbackOrListenOptions, options);
}
function onChildMoved(query3, callback, cancelCallbackOrListenOptions, options) {
  return addEventListener(query3, "child_moved", callback, cancelCallbackOrListenOptions, options);
}
function onChildRemoved(query3, callback, cancelCallbackOrListenOptions, options) {
  return addEventListener(query3, "child_removed", callback, cancelCallbackOrListenOptions, options);
}
function off(query3, eventType, callback) {
  let container = null;
  const expCallback = callback ? new CallbackContext(callback) : null;
  if (eventType === "value") {
    container = new ValueEventRegistration(expCallback);
  } else if (eventType) {
    container = new ChildEventRegistration(eventType, expCallback);
  }
  repoRemoveEventCallbackForQuery(query3._repo, query3, container);
}
var QueryConstraint = class {
};
var QueryEndAtConstraint = class extends QueryConstraint {
  constructor(_value, _key) {
    super();
    this._value = _value;
    this._key = _key;
    this.type = "endAt";
  }
  _apply(query3) {
    validateFirebaseDataArg("endAt", this._value, query3._path, true);
    const newParams = queryParamsEndAt(query3._queryParams, this._value, this._key);
    validateLimit(newParams);
    validateQueryEndpoints(newParams);
    if (query3._queryParams.hasEnd()) {
      throw new Error("endAt: Starting point was already set (by another call to endAt, endBefore or equalTo).");
    }
    return new QueryImpl(query3._repo, query3._path, newParams, query3._orderByCalled);
  }
};
function endAt(value, key) {
  validateKey("endAt", "key", key, true);
  return new QueryEndAtConstraint(value, key);
}
var QueryEndBeforeConstraint = class extends QueryConstraint {
  constructor(_value, _key) {
    super();
    this._value = _value;
    this._key = _key;
    this.type = "endBefore";
  }
  _apply(query3) {
    validateFirebaseDataArg("endBefore", this._value, query3._path, false);
    const newParams = queryParamsEndBefore(query3._queryParams, this._value, this._key);
    validateLimit(newParams);
    validateQueryEndpoints(newParams);
    if (query3._queryParams.hasEnd()) {
      throw new Error("endBefore: Starting point was already set (by another call to endAt, endBefore or equalTo).");
    }
    return new QueryImpl(query3._repo, query3._path, newParams, query3._orderByCalled);
  }
};
function endBefore(value, key) {
  validateKey("endBefore", "key", key, true);
  return new QueryEndBeforeConstraint(value, key);
}
var QueryStartAtConstraint = class extends QueryConstraint {
  constructor(_value, _key) {
    super();
    this._value = _value;
    this._key = _key;
    this.type = "startAt";
  }
  _apply(query3) {
    validateFirebaseDataArg("startAt", this._value, query3._path, true);
    const newParams = queryParamsStartAt(query3._queryParams, this._value, this._key);
    validateLimit(newParams);
    validateQueryEndpoints(newParams);
    if (query3._queryParams.hasStart()) {
      throw new Error("startAt: Starting point was already set (by another call to startAt, startBefore or equalTo).");
    }
    return new QueryImpl(query3._repo, query3._path, newParams, query3._orderByCalled);
  }
};
function startAt(value = null, key) {
  validateKey("startAt", "key", key, true);
  return new QueryStartAtConstraint(value, key);
}
var QueryStartAfterConstraint = class extends QueryConstraint {
  constructor(_value, _key) {
    super();
    this._value = _value;
    this._key = _key;
    this.type = "startAfter";
  }
  _apply(query3) {
    validateFirebaseDataArg("startAfter", this._value, query3._path, false);
    const newParams = queryParamsStartAfter(query3._queryParams, this._value, this._key);
    validateLimit(newParams);
    validateQueryEndpoints(newParams);
    if (query3._queryParams.hasStart()) {
      throw new Error("startAfter: Starting point was already set (by another call to startAt, startAfter, or equalTo).");
    }
    return new QueryImpl(query3._repo, query3._path, newParams, query3._orderByCalled);
  }
};
function startAfter(value, key) {
  validateKey("startAfter", "key", key, true);
  return new QueryStartAfterConstraint(value, key);
}
var QueryLimitToFirstConstraint = class extends QueryConstraint {
  constructor(_limit) {
    super();
    this._limit = _limit;
    this.type = "limitToFirst";
  }
  _apply(query3) {
    if (query3._queryParams.hasLimit()) {
      throw new Error("limitToFirst: Limit was already set (by another call to limitToFirst or limitToLast).");
    }
    return new QueryImpl(query3._repo, query3._path, queryParamsLimitToFirst(query3._queryParams, this._limit), query3._orderByCalled);
  }
};
function limitToFirst(limit) {
  if (typeof limit !== "number" || Math.floor(limit) !== limit || limit <= 0) {
    throw new Error("limitToFirst: First argument must be a positive integer.");
  }
  return new QueryLimitToFirstConstraint(limit);
}
var QueryLimitToLastConstraint = class extends QueryConstraint {
  constructor(_limit) {
    super();
    this._limit = _limit;
    this.type = "limitToLast";
  }
  _apply(query3) {
    if (query3._queryParams.hasLimit()) {
      throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");
    }
    return new QueryImpl(query3._repo, query3._path, queryParamsLimitToLast(query3._queryParams, this._limit), query3._orderByCalled);
  }
};
function limitToLast(limit) {
  if (typeof limit !== "number" || Math.floor(limit) !== limit || limit <= 0) {
    throw new Error("limitToLast: First argument must be a positive integer.");
  }
  return new QueryLimitToLastConstraint(limit);
}
var QueryOrderByChildConstraint = class extends QueryConstraint {
  constructor(_path) {
    super();
    this._path = _path;
    this.type = "orderByChild";
  }
  _apply(query3) {
    validateNoPreviousOrderByCall(query3, "orderByChild");
    const parsedPath = new Path(this._path);
    if (pathIsEmpty(parsedPath)) {
      throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");
    }
    const index = new PathIndex(parsedPath);
    const newParams = queryParamsOrderBy(query3._queryParams, index);
    validateQueryEndpoints(newParams);
    return new QueryImpl(
      query3._repo,
      query3._path,
      newParams,
      /*orderByCalled=*/
      true
    );
  }
};
function orderByChild(path) {
  if (path === "$key") {
    throw new Error('orderByChild: "$key" is invalid.  Use orderByKey() instead.');
  } else if (path === "$priority") {
    throw new Error('orderByChild: "$priority" is invalid.  Use orderByPriority() instead.');
  } else if (path === "$value") {
    throw new Error('orderByChild: "$value" is invalid.  Use orderByValue() instead.');
  }
  validatePathString("orderByChild", "path", path, false);
  return new QueryOrderByChildConstraint(path);
}
var QueryOrderByKeyConstraint = class extends QueryConstraint {
  constructor() {
    super(...arguments);
    this.type = "orderByKey";
  }
  _apply(query3) {
    validateNoPreviousOrderByCall(query3, "orderByKey");
    const newParams = queryParamsOrderBy(query3._queryParams, KEY_INDEX);
    validateQueryEndpoints(newParams);
    return new QueryImpl(
      query3._repo,
      query3._path,
      newParams,
      /*orderByCalled=*/
      true
    );
  }
};
function orderByKey() {
  return new QueryOrderByKeyConstraint();
}
var QueryOrderByPriorityConstraint = class extends QueryConstraint {
  constructor() {
    super(...arguments);
    this.type = "orderByPriority";
  }
  _apply(query3) {
    validateNoPreviousOrderByCall(query3, "orderByPriority");
    const newParams = queryParamsOrderBy(query3._queryParams, PRIORITY_INDEX);
    validateQueryEndpoints(newParams);
    return new QueryImpl(
      query3._repo,
      query3._path,
      newParams,
      /*orderByCalled=*/
      true
    );
  }
};
function orderByPriority() {
  return new QueryOrderByPriorityConstraint();
}
var QueryOrderByValueConstraint = class extends QueryConstraint {
  constructor() {
    super(...arguments);
    this.type = "orderByValue";
  }
  _apply(query3) {
    validateNoPreviousOrderByCall(query3, "orderByValue");
    const newParams = queryParamsOrderBy(query3._queryParams, VALUE_INDEX);
    validateQueryEndpoints(newParams);
    return new QueryImpl(
      query3._repo,
      query3._path,
      newParams,
      /*orderByCalled=*/
      true
    );
  }
};
function orderByValue() {
  return new QueryOrderByValueConstraint();
}
var QueryEqualToValueConstraint = class extends QueryConstraint {
  constructor(_value, _key) {
    super();
    this._value = _value;
    this._key = _key;
    this.type = "equalTo";
  }
  _apply(query3) {
    validateFirebaseDataArg("equalTo", this._value, query3._path, false);
    if (query3._queryParams.hasStart()) {
      throw new Error("equalTo: Starting point was already set (by another call to startAt/startAfter or equalTo).");
    }
    if (query3._queryParams.hasEnd()) {
      throw new Error("equalTo: Ending point was already set (by another call to endAt/endBefore or equalTo).");
    }
    return new QueryEndAtConstraint(this._value, this._key)._apply(new QueryStartAtConstraint(this._value, this._key)._apply(query3));
  }
};
function equalTo(value, key) {
  validateKey("equalTo", "key", key, true);
  return new QueryEqualToValueConstraint(value, key);
}
function query(query3, ...queryConstraints) {
  let queryImpl = getModularInstance(query3);
  for (const constraint of queryConstraints) {
    queryImpl = constraint._apply(queryImpl);
  }
  return queryImpl;
}
syncPointSetReferenceConstructor(ReferenceImpl);
syncTreeSetReferenceConstructor(ReferenceImpl);
var FIREBASE_DATABASE_EMULATOR_HOST_VAR = "FIREBASE_DATABASE_EMULATOR_HOST";
var repos = {};
var useRestClient = false;
function repoManagerApplyEmulatorSettings(repo, host, port, tokenProvider) {
  repo.repoInfo_ = new RepoInfo(
    `${host}:${port}`,
    /* secure= */
    false,
    repo.repoInfo_.namespace,
    repo.repoInfo_.webSocketOnly,
    repo.repoInfo_.nodeAdmin,
    repo.repoInfo_.persistenceKey,
    repo.repoInfo_.includeNamespaceInQueryParams,
    /*isUsingEmulator=*/
    true
  );
  if (tokenProvider) {
    repo.authTokenProvider_ = tokenProvider;
  }
}
function repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url, nodeAdmin) {
  let dbUrl = url || app.options.databaseURL;
  if (dbUrl === void 0) {
    if (!app.options.projectId) {
      fatal("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp().");
    }
    log("Using default host for project ", app.options.projectId);
    dbUrl = `${app.options.projectId}-default-rtdb.firebaseio.com`;
  }
  let parsedUrl = parseRepoInfo(dbUrl, nodeAdmin);
  let repoInfo = parsedUrl.repoInfo;
  let isEmulator;
  let dbEmulatorHost = void 0;
  if (typeof process !== "undefined" && process.env) {
    dbEmulatorHost = process.env[FIREBASE_DATABASE_EMULATOR_HOST_VAR];
  }
  if (dbEmulatorHost) {
    isEmulator = true;
    dbUrl = `http://${dbEmulatorHost}?ns=${repoInfo.namespace}`;
    parsedUrl = parseRepoInfo(dbUrl, nodeAdmin);
    repoInfo = parsedUrl.repoInfo;
  } else {
    isEmulator = !parsedUrl.repoInfo.secure;
  }
  const authTokenProvider = nodeAdmin && isEmulator ? new EmulatorTokenProvider(EmulatorTokenProvider.OWNER) : new FirebaseAuthTokenProvider(app.name, app.options, authProvider);
  validateUrl("Invalid Firebase Database URL", parsedUrl);
  if (!pathIsEmpty(parsedUrl.path)) {
    fatal("Database URL must point to the root of a Firebase Database (not including a child path).");
  }
  const repo = repoManagerCreateRepo(repoInfo, app, authTokenProvider, new AppCheckTokenProvider(app.name, appCheckProvider));
  return new Database(repo, app);
}
function repoManagerDeleteRepo(repo, appName) {
  const appRepos = repos[appName];
  if (!appRepos || appRepos[repo.key] !== repo) {
    fatal(`Database ${appName}(${repo.repoInfo_}) has already been deleted.`);
  }
  repoInterrupt(repo);
  delete appRepos[repo.key];
}
function repoManagerCreateRepo(repoInfo, app, authTokenProvider, appCheckProvider) {
  let appRepos = repos[app.name];
  if (!appRepos) {
    appRepos = {};
    repos[app.name] = appRepos;
  }
  let repo = appRepos[repoInfo.toURLString()];
  if (repo) {
    fatal("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.");
  }
  repo = new Repo(repoInfo, useRestClient, authTokenProvider, appCheckProvider);
  appRepos[repoInfo.toURLString()] = repo;
  return repo;
}
function repoManagerForceRestClient(forceRestClient2) {
  useRestClient = forceRestClient2;
}
var Database = class {
  /** @hideconstructor */
  constructor(_repoInternal, app) {
    this._repoInternal = _repoInternal;
    this.app = app;
    this["type"] = "database";
    this._instanceStarted = false;
  }
  get _repo() {
    if (!this._instanceStarted) {
      repoStart(this._repoInternal, this.app.options.appId, this.app.options["databaseAuthVariableOverride"]);
      this._instanceStarted = true;
    }
    return this._repoInternal;
  }
  get _root() {
    if (!this._rootInternal) {
      this._rootInternal = new ReferenceImpl(this._repo, newEmptyPath());
    }
    return this._rootInternal;
  }
  _delete() {
    if (this._rootInternal !== null) {
      repoManagerDeleteRepo(this._repo, this.app.name);
      this._repoInternal = null;
      this._rootInternal = null;
    }
    return Promise.resolve();
  }
  _checkNotDeleted(apiName) {
    if (this._rootInternal === null) {
      fatal("Cannot call " + apiName + " on a deleted database.");
    }
  }
};
function checkTransportInit() {
  if (TransportManager.IS_TRANSPORT_INITIALIZED) {
    warn("Transport has already been initialized. Please call this function before calling ref or setting up a listener");
  }
}
function forceWebSockets() {
  checkTransportInit();
  BrowserPollConnection.forceDisallow();
}
function forceLongPolling() {
  checkTransportInit();
  WebSocketConnection.forceDisallow();
  BrowserPollConnection.forceAllow();
}
function getDatabase(app = getApp(), url) {
  const db = _getProvider(app, "database").getImmediate({
    identifier: url
  });
  if (!db._instanceStarted) {
    const emulator = getDefaultEmulatorHostnameAndPort("database");
    if (emulator) {
      connectDatabaseEmulator(db, ...emulator);
    }
  }
  return db;
}
function connectDatabaseEmulator(db, host, port, options = {}) {
  db = getModularInstance(db);
  db._checkNotDeleted("useEmulator");
  if (db._instanceStarted) {
    fatal("Cannot call useEmulator() after instance has already been initialized.");
  }
  const repo = db._repoInternal;
  let tokenProvider = void 0;
  if (repo.repoInfo_.nodeAdmin) {
    if (options.mockUserToken) {
      fatal('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".');
    }
    tokenProvider = new EmulatorTokenProvider(EmulatorTokenProvider.OWNER);
  } else if (options.mockUserToken) {
    const token = typeof options.mockUserToken === "string" ? options.mockUserToken : createMockUserToken(options.mockUserToken, db.app.options.projectId);
    tokenProvider = new EmulatorTokenProvider(token);
  }
  repoManagerApplyEmulatorSettings(repo, host, port, tokenProvider);
}
function goOffline(db) {
  db = getModularInstance(db);
  db._checkNotDeleted("goOffline");
  repoInterrupt(db._repo);
}
function goOnline(db) {
  db = getModularInstance(db);
  db._checkNotDeleted("goOnline");
  repoResume(db._repo);
}
function enableLogging(logger2, persistent) {
  enableLogging$1(logger2, persistent);
}
function registerDatabase(variant) {
  setSDKVersion(SDK_VERSION);
  _registerComponent(new Component(
    "database",
    (container, {
      instanceIdentifier: url
    }) => {
      const app = container.getProvider("app").getImmediate();
      const authProvider = container.getProvider("auth-internal");
      const appCheckProvider = container.getProvider("app-check-internal");
      return repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url);
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setMultipleInstances(true));
  registerVersion(name, version, variant);
  registerVersion(name, version, "esm2017");
}
var SERVER_TIMESTAMP = {
  ".sv": "timestamp"
};
function serverTimestamp() {
  return SERVER_TIMESTAMP;
}
function increment(delta) {
  return {
    ".sv": {
      "increment": delta
    }
  };
}
var TransactionResult = class {
  /** @hideconstructor */
  constructor(committed, snapshot) {
    this.committed = committed;
    this.snapshot = snapshot;
  }
  /** Returns a JSON-serializable representation of this object. */
  toJSON() {
    return {
      committed: this.committed,
      snapshot: this.snapshot.toJSON()
    };
  }
};
function runTransaction(ref3, transactionUpdate, options) {
  var _a2;
  ref3 = getModularInstance(ref3);
  validateWritablePath("Reference.transaction", ref3._path);
  if (ref3.key === ".length" || ref3.key === ".keys") {
    throw "Reference.transaction failed: " + ref3.key + " is a read-only object.";
  }
  const applyLocally = (_a2 = options === null || options === void 0 ? void 0 : options.applyLocally) !== null && _a2 !== void 0 ? _a2 : true;
  const deferred = new Deferred();
  const promiseComplete = (error2, committed, node) => {
    let dataSnapshot = null;
    if (error2) {
      deferred.reject(error2);
    } else {
      dataSnapshot = new DataSnapshot(node, new ReferenceImpl(ref3._repo, ref3._path), PRIORITY_INDEX);
      deferred.resolve(new TransactionResult(committed, dataSnapshot));
    }
  };
  const unwatcher = onValue(ref3, () => {
  });
  repoStartTransaction(ref3._repo, ref3._path, transactionUpdate, promiseComplete, unwatcher, applyLocally);
  return deferred.promise;
}
PersistentConnection.prototype.simpleListen = function(pathString, onComplete) {
  this.sendRequest("q", {
    p: pathString
  }, onComplete);
};
PersistentConnection.prototype.echo = function(data, onEcho) {
  this.sendRequest("echo", {
    d: data
  }, onEcho);
};
var hijackHash = function(newHash) {
  const oldPut = PersistentConnection.prototype.put;
  PersistentConnection.prototype.put = function(pathString, data, onComplete, hash) {
    if (hash !== void 0) {
      hash = newHash();
    }
    oldPut.call(this, pathString, data, onComplete, hash);
  };
  return function() {
    PersistentConnection.prototype.put = oldPut;
  };
};
var forceRestClient = function(forceRestClient2) {
  repoManagerForceRestClient(forceRestClient2);
};
function _initStandalone({
  app,
  url,
  version: version2,
  customAuthImpl,
  customAppCheckImpl,
  nodeAdmin = false
}) {
  setSDKVersion(version2);
  const componentContainer = new ComponentContainer("database-standalone");
  const authProvider = new Provider("auth-internal", componentContainer);
  let appCheckProvider;
  if (customAppCheckImpl) {
    appCheckProvider = new Provider("app-check-internal", componentContainer);
    appCheckProvider.setComponent(new Component(
      "app-check-internal",
      () => customAppCheckImpl,
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
  }
  authProvider.setComponent(new Component(
    "auth-internal",
    () => customAuthImpl,
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  return repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url, nodeAdmin);
}
setWebSocketImpl(import_faye_websocket.default.Client);
registerDatabase("node");

// node_modules/rxfire/database/index.esm.js
var _a;
var ListenEvent;
(function(ListenEvent2) {
  ListenEvent2["added"] = "child_added";
  ListenEvent2["removed"] = "child_removed";
  ListenEvent2["changed"] = "child_changed";
  ListenEvent2["moved"] = "child_moved";
  ListenEvent2["value"] = "value";
})(ListenEvent || (ListenEvent = {}));
var ListenerMethods = Object.freeze((_a = {}, _a[ListenEvent.added] = onChildAdded, _a[ListenEvent.removed] = onChildRemoved, _a[ListenEvent.changed] = onChildChanged, _a[ListenEvent.moved] = onChildMoved, _a[ListenEvent.value] = onValue, _a));
function fromRef(ref3, event) {
  return new import_rxjs.Observable(function(subscriber) {
    var fn = ListenerMethods[event](ref3, function(snapshot, prevKey) {
      subscriber.next({
        snapshot,
        prevKey,
        event
      });
    }, subscriber.error.bind(subscriber));
    return {
      unsubscribe: function() {
        off(ref3, event, fn);
      }
    };
  }).pipe(
    // Ensures subscribe on observable is async. This handles
    // a quirk in the SDK where on/once callbacks can happen
    // synchronously.
    (0, import_operators.delay)(0)
  );
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from3, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from3.length, ar; i < l; i++) {
    if (ar || !(i in from3)) {
      if (!ar) ar = Array.prototype.slice.call(from3, 0, i);
      ar[i] = from3[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from3));
}
function validateEventsArray(events) {
  if (events == null || events.length === 0) {
    events = [ListenEvent.added, ListenEvent.removed, ListenEvent.changed, ListenEvent.moved];
  }
  return events;
}
function object(query3) {
  return fromRef(query3, ListenEvent.value);
}
function objectVal(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return fromRef(query3, ListenEvent.value).pipe((0, import_operators.map)(function(change) {
    return changeToData(change, options);
  }));
}
function changeToData(change, options) {
  var _a2;
  if (options === void 0) {
    options = {};
  }
  var val = change.snapshot.val();
  if (!change.snapshot.exists()) {
    return val;
  }
  if (typeof val !== "object") {
    return val;
  }
  return __assign(__assign({}, val), options.keyField ? (_a2 = {}, _a2[options.keyField] = change.snapshot.key, _a2) : null);
}
function stateChanges(query3, options) {
  if (options === void 0) {
    options = {};
  }
  var events = validateEventsArray(options.events);
  var childEvent$ = events.map(function(event) {
    return fromRef(query3, event);
  });
  return import_rxjs.merge.apply(void 0, childEvent$);
}
function get2(query3) {
  return (0, import_rxjs.from)(get(query3)).pipe((0, import_operators.map)(function(snapshot) {
    var event = ListenEvent.value;
    return {
      snapshot,
      prevKey: null,
      event
    };
  }));
}
function list(query3, options) {
  if (options === void 0) {
    options = {};
  }
  var events = validateEventsArray(options.events);
  return get2(query3).pipe((0, import_operators.switchMap)(function(change) {
    var childEvent$ = [(0, import_rxjs.of)(change)];
    events.forEach(function(event) {
      childEvent$.push(fromRef(query3, event));
    });
    return import_rxjs.merge.apply(void 0, childEvent$).pipe((0, import_operators.scan)(buildView, []));
  }), (0, import_operators.distinctUntilChanged)());
}
function listVal(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return list(query3).pipe((0, import_operators.map)(function(arr) {
    return arr.map(function(change) {
      return changeToData(change, options);
    });
  }));
}
function positionFor(changes, key) {
  var len = changes.length;
  for (var i = 0; i < len; i++) {
    if (changes[i].snapshot.key === key) {
      return i;
    }
  }
  return -1;
}
function positionAfter(changes, prevKey) {
  if (prevKey == null) {
    return 0;
  } else {
    var i = positionFor(changes, prevKey);
    if (i === -1) {
      return changes.length;
    } else {
      return i + 1;
    }
  }
}
function buildView(current, change) {
  var snapshot = change.snapshot, prevKey = change.prevKey, event = change.event;
  var key = snapshot.key;
  var currentKeyPosition = positionFor(current, key);
  var afterPreviousKeyPosition = positionAfter(current, prevKey || void 0);
  switch (event) {
    case ListenEvent.value:
      if (change.snapshot && change.snapshot.exists()) {
        var prevKey_1 = null;
        change.snapshot.forEach(function(snapshot2) {
          var action = {
            snapshot: snapshot2,
            event: ListenEvent.value,
            prevKey: prevKey_1
          };
          prevKey_1 = snapshot2.key;
          current = __spreadArray(__spreadArray([], current, true), [action], false);
          return false;
        });
      }
      return current;
    case ListenEvent.added:
      if (currentKeyPosition > -1) {
        var previous = current[currentKeyPosition - 1];
        if ((previous && previous.snapshot.key || null) !== prevKey) {
          current = current.filter(function(x) {
            return x.snapshot.key !== snapshot.key;
          });
          current.splice(afterPreviousKeyPosition, 0, change);
        }
      } else if (prevKey == null) {
        return __spreadArray([change], current, true);
      } else {
        current = current.slice();
        current.splice(afterPreviousKeyPosition, 0, change);
      }
      return current;
    case ListenEvent.removed:
      return current.filter(function(x) {
        return x.snapshot.key !== snapshot.key;
      });
    case ListenEvent.changed:
      return current.map(function(x) {
        return x.snapshot.key === key ? change : x;
      });
    case ListenEvent.moved:
      if (currentKeyPosition > -1) {
        var data = current.splice(currentKeyPosition, 1)[0];
        current = current.slice();
        current.splice(afterPreviousKeyPosition, 0, data);
        return current;
      }
      return current;
    default:
      return current;
  }
}
function auditTrail(query3, options) {
  if (options === void 0) {
    options = {};
  }
  var auditTrail$ = stateChanges(query3, options).pipe((0, import_operators.scan)(function(current, changes) {
    return __spreadArray(__spreadArray([], current, true), [changes], false);
  }, []));
  return waitForLoaded(query3, auditTrail$);
}
function loadedData(query3) {
  return fromRef(query3, ListenEvent.value).pipe((0, import_operators.map)(function(data) {
    var lastKeyToLoad;
    data.snapshot.forEach(function(child3) {
      lastKeyToLoad = child3.key;
      return false;
    });
    return {
      data,
      lastKeyToLoad
    };
  }));
}
function waitForLoaded(query3, snap$) {
  var loaded$ = loadedData(query3);
  return loaded$.pipe(
    (0, import_operators.withLatestFrom)(snap$),
    // Get the latest values from the "loaded" and "child" datasets
    // We can use both datasets to form an array of the latest values.
    (0, import_operators.map)(function(_a2) {
      var loaded = _a2[0], changes = _a2[1];
      var lastKeyToLoad = loaded.lastKeyToLoad;
      var loadedKeys = changes.map(function(change) {
        return change.snapshot.key;
      });
      return {
        changes,
        lastKeyToLoad,
        loadedKeys
      };
    }),
    // This is the magical part, only emit when the last load key
    // in the dataset has been loaded by a child event. At this point
    // we can assume the dataset is "whole".
    (0, import_operators.skipWhile)(function(meta) {
      return meta.loadedKeys.indexOf(meta.lastKeyToLoad) === -1;
    }),
    // Pluck off the meta data because the user only cares
    // to iterate through the snapshots
    (0, import_operators.map)(function(meta) {
      return meta.changes;
    })
  );
}

// node_modules/@angular/fire/fesm2022/angular-fire-database.mjs
var Database2 = class {
  constructor(database) {
    return database;
  }
};
var DATABASE_PROVIDER_NAME = "database";
var DatabaseInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(DATABASE_PROVIDER_NAME);
  }
};
var databaseInstance$ = (0, import_rxjs2.timer)(0, 300).pipe((0, import_operators2.concatMap)(() => (0, import_rxjs2.from)(ɵgetAllInstancesOf(DATABASE_PROVIDER_NAME))), (0, import_operators2.distinct)());
var PROVIDED_DATABASE_INSTANCES = new InjectionToken("angularfire2.database-instances");
function defaultDatabaseInstanceFactory(provided, defaultApp) {
  const defaultDatabase = ɵgetDefaultInstanceOf(DATABASE_PROVIDER_NAME, provided, defaultApp);
  return defaultDatabase && new Database2(defaultDatabase);
}
function databaseInstanceFactory(fn) {
  return (zone, injector) => {
    const database = zone.runOutsideAngular(() => fn(injector));
    return new Database2(database);
  };
}
var DATABASE_INSTANCES_PROVIDER = {
  provide: DatabaseInstances,
  deps: [[new Optional(), PROVIDED_DATABASE_INSTANCES]]
};
var DEFAULT_DATABASE_INSTANCE_PROVIDER = {
  provide: Database2,
  useFactory: defaultDatabaseInstanceFactory,
  deps: [[new Optional(), PROVIDED_DATABASE_INSTANCES], FirebaseApp]
};
var DatabaseModule = class _DatabaseModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "rtdb");
  }
  static ɵfac = function DatabaseModule_Factory(t) {
    return new (t || _DatabaseModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _DatabaseModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_DATABASE_INSTANCE_PROVIDER, DATABASE_INSTANCES_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatabaseModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_DATABASE_INSTANCE_PROVIDER, DATABASE_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
function provideDatabase(fn, ...deps) {
  registerVersion("angularfire", VERSION.full, "rtdb");
  return makeEnvironmentProviders([DEFAULT_DATABASE_INSTANCE_PROVIDER, DATABASE_INSTANCES_PROVIDER, {
    provide: PROVIDED_DATABASE_INSTANCES,
    useFactory: databaseInstanceFactory(fn),
    multi: true,
    deps: [
      NgZone,
      Injector,
      ɵAngularFireSchedulers,
      FirebaseApps,
      // Database+Auth work better if Auth is loaded first
      [new Optional(), AuthInstances],
      [new Optional(), ɵAppCheckInstances],
      ...deps
    ]
  }]);
}
var fromRef2 = ɵzoneWrap(fromRef, true);
var stateChanges2 = ɵzoneWrap(stateChanges, true);
var list2 = ɵzoneWrap(list, true);
var listVal2 = ɵzoneWrap(listVal, true);
var auditTrail2 = ɵzoneWrap(auditTrail, true);
var object2 = ɵzoneWrap(object, true);
var objectVal2 = ɵzoneWrap(objectVal, true);
var changeToData2 = ɵzoneWrap(changeToData, true);
var child2 = ɵzoneWrap(child, true);
var connectDatabaseEmulator2 = ɵzoneWrap(connectDatabaseEmulator, true);
var enableLogging2 = ɵzoneWrap(enableLogging, true);
var endAt2 = ɵzoneWrap(endAt, true);
var endBefore2 = ɵzoneWrap(endBefore, true);
var equalTo2 = ɵzoneWrap(equalTo, true);
var forceLongPolling2 = ɵzoneWrap(forceLongPolling, true);
var forceWebSockets2 = ɵzoneWrap(forceWebSockets, true);
var get3 = ɵzoneWrap(get, true);
var getDatabase2 = ɵzoneWrap(getDatabase, true);
var goOffline2 = ɵzoneWrap(goOffline, true);
var goOnline2 = ɵzoneWrap(goOnline, true);
var increment2 = ɵzoneWrap(increment, true);
var limitToFirst2 = ɵzoneWrap(limitToFirst, true);
var limitToLast2 = ɵzoneWrap(limitToLast, true);
var off2 = ɵzoneWrap(off, true);
var onChildAdded2 = ɵzoneWrap(onChildAdded, true);
var onChildChanged2 = ɵzoneWrap(onChildChanged, true);
var onChildMoved2 = ɵzoneWrap(onChildMoved, true);
var onChildRemoved2 = ɵzoneWrap(onChildRemoved, true);
var onDisconnect2 = ɵzoneWrap(onDisconnect, true);
var onValue2 = ɵzoneWrap(onValue, true);
var orderByChild2 = ɵzoneWrap(orderByChild, true);
var orderByKey2 = ɵzoneWrap(orderByKey, true);
var orderByPriority2 = ɵzoneWrap(orderByPriority, true);
var orderByValue2 = ɵzoneWrap(orderByValue, true);
var push2 = ɵzoneWrap(push, true);
var query2 = ɵzoneWrap(query, true);
var ref2 = ɵzoneWrap(ref, true);
var refFromURL2 = ɵzoneWrap(refFromURL, true);
var remove2 = ɵzoneWrap(remove, true);
var runTransaction2 = ɵzoneWrap(runTransaction, true);
var serverTimestamp2 = ɵzoneWrap(serverTimestamp, true);
var set2 = ɵzoneWrap(set, true);
var setPriority2 = ɵzoneWrap(setPriority, true);
var setWithPriority2 = ɵzoneWrap(setWithPriority, true);
var startAfter2 = ɵzoneWrap(startAfter, true);
var startAt2 = ɵzoneWrap(startAt, true);
var update2 = ɵzoneWrap(update, true);
export {
  DataSnapshot,
  Database2 as Database,
  DatabaseInstances,
  DatabaseModule,
  ListenEvent,
  ListenerMethods,
  OnDisconnect,
  QueryConstraint,
  TransactionResult,
  QueryImpl as _QueryImpl,
  QueryParams as _QueryParams,
  ReferenceImpl as _ReferenceImpl,
  forceRestClient as _TEST_ACCESS_forceRestClient,
  hijackHash as _TEST_ACCESS_hijackHash,
  _initStandalone,
  repoManagerDatabaseFromApp as _repoManagerDatabaseFromApp,
  setSDKVersion as _setSDKVersion,
  validatePathString as _validatePathString,
  validateWritablePath as _validateWritablePath,
  auditTrail2 as auditTrail,
  changeToData2 as changeToData,
  child2 as child,
  connectDatabaseEmulator2 as connectDatabaseEmulator,
  databaseInstance$,
  enableLogging2 as enableLogging,
  endAt2 as endAt,
  endBefore2 as endBefore,
  equalTo2 as equalTo,
  forceLongPolling2 as forceLongPolling,
  forceWebSockets2 as forceWebSockets,
  fromRef2 as fromRef,
  get3 as get,
  getDatabase2 as getDatabase,
  goOffline2 as goOffline,
  goOnline2 as goOnline,
  increment2 as increment,
  limitToFirst2 as limitToFirst,
  limitToLast2 as limitToLast,
  list2 as list,
  listVal2 as listVal,
  object2 as object,
  objectVal2 as objectVal,
  off2 as off,
  onChildAdded2 as onChildAdded,
  onChildChanged2 as onChildChanged,
  onChildMoved2 as onChildMoved,
  onChildRemoved2 as onChildRemoved,
  onDisconnect2 as onDisconnect,
  onValue2 as onValue,
  orderByChild2 as orderByChild,
  orderByKey2 as orderByKey,
  orderByPriority2 as orderByPriority,
  orderByValue2 as orderByValue,
  provideDatabase,
  push2 as push,
  query2 as query,
  ref2 as ref,
  refFromURL2 as refFromURL,
  remove2 as remove,
  runTransaction2 as runTransaction,
  serverTimestamp2 as serverTimestamp,
  set2 as set,
  setPriority2 as setPriority,
  setWithPriority2 as setWithPriority,
  startAfter2 as startAfter,
  startAt2 as startAt,
  stateChanges2 as stateChanges,
  update2 as update
};
/*! Bundled license information:

@firebase/database/dist/node-esm/index.node.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/database/dist/node-esm/index.node.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

rxfire/database/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

rxfire/database/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=@angular_fire_database.js.map
