/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "df5ff963eab1d8f408b8"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var riot = __webpack_require__(1);
	// Provide some settings
	riot.settings.brackets = '{{ }}';
	// Get application tag and mount it! Yeah baby!
	__webpack_require__(3);
	riot.mount('app');
	// Router
	__webpack_require__(33);
	// SASS
	__webpack_require__(52);
	__webpack_require__(54);
	__webpack_require__(56);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.6.8, @license MIT */

	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.6.8', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`

	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},

	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',

	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',

	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  XLINK_NS = 'http://www.w3.org/1999/xlink',
	  XLINK_REGEX = /^xlink:(\w+)/,
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
	  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
	  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],

	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,

	  // detect firefox to fix #1374
	  FIREFOX = window && !!window.InstallTrigger
	/* istanbul ignore next */
	riot.observable = function(el) {

	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */

	  el = el || {}

	  /**
	   * Private variables
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice

	  /**
	   * Private Methods
	   */

	  /**
	   * Helper function needed to get and loop all the events in a string
	   * @param   { String }   e - event string
	   * @param   {Function}   fn - callback
	   */
	  function onEachEvent(e, fn) {
	    var es = e.split(' '), l = es.length, i = 0
	    for (; i < l; i++) {
	      var name = es[i]
	      if (name) fn(name, i)
	    }
	  }

	  /**
	   * Public Api
	   */

	  // extend the el object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el

	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })

	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },

	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name, pos) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },

	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },

	    /**
	     * Execute all callback functions that listen to
	     * the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {

	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns

	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }

	        onEachEvent(events, function(name, pos) {

	          fns = slice.call(callbacks[name] || [], 0)

	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) continue
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }

	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))

	        })

	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })

	  return el

	}
	/* istanbul ignore next */
	;(function(riot) {

	/**
	 * Simple client-side router
	 * @module riot-route
	 */


	var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0

	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}

	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)

	  if (args) return args.slice(1)
	}

	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}

	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}

	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}

	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}

	function isString(str) {
	  return typeof str == 'string'
	}

	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}

	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
	}

	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0, first
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (first = emitStack.shift()) first() // stack increses within this call
	    emitStackLevel = 0
	  }
	}

	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return

	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode

	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return

	  if (el.href != loc.href
	    && (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    )) return

	  e.preventDefault()
	}

	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  // Server-side usage: directly execute handlers for the path
	  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))

	  path = base + normalize(path)
	  title = title || doc.title
	  // browsers ignores the second parameter `title`
	  shouldReplace
	    ? hist.replaceState(null, title, path)
	    : hist.pushState(null, title, path)
	  // so we need to set it manually
	  doc.title = title
	  routeFound = false
	  emit()
	  return routeFound
	}

	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}

	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}

	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}

	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}

	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)

	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter)
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter)
	  return router
	}

	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}

	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}

	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}

	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}

	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}

	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}

	/** Prepare the router **/
	route.base()
	route.parser()

	riot.route = route
	})(riot)
	/* istanbul ignore next */

	/**
	 * The riot template engine
	 * @version v2.4.2
	 */
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */

	var brackets = (function (UNDEF) {

	  var
	    REGLOB = 'g',

	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

	    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

	    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },

	    DEFAULT = '{ }'

	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]

	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings

	  function _loopback (re) { return re }

	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }

	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs

	    var arr = pair.split(' ')

	    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))

	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }

	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }

	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache

	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]

	    isexpr = start = re.lastIndex = 0

	    while ((match = re.exec(str))) {

	      pos = match.index

	      if (isexpr) {

	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3]) {
	          continue
	        }
	      }

	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }

	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }

	    return parts

	    function unescapeStr (s) {
	      if (tmpl || isexpr) {
	        parts.push(s && s.replace(_bp[5], '$1'))
	      } else {
	        parts.push(s)
	      }
	    }

	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]

	      recch.lastIndex = ix
	      ix = 1
	      while ((match = recch.exec(s))) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }

	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }

	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])

	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }

	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }

	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	    }
	    cachedBrackets = pair
	  }

	  function _setSettings (o) {
	    var b

	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }

	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })

	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset

	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS

	  return _brackets

	})()

	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */

	var tmpl = (function () {

	  var _cache = {}

	  function _tmpl (str, data) {
	    if (!str) return str

	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }

	  _tmpl.haveRaw = brackets.hasRaw

	  _tmpl.hasExpr = brackets.hasExpr

	  _tmpl.loopKeys = brackets.loopKeys

	  // istanbul ignore next
	  _tmpl.clearCache = function () { _cache = {} }

	  _tmpl.errorHandler = null

	  function _logErr (err, ctx) {

	    if (_tmpl.errorHandler) {

	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }

	  function _create (str) {
	    var expr = _getTmpl(str)

	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr

	    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
	  }

	  var
	    CH_IDEXPR = String.fromCharCode(0x2057),
	    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g

	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)

	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []

	      for (i = j = 0; i < parts.length; ++i) {

	        expr = parts[i]

	        if (expr && (expr = i & 1

	            ? _parseExpr(expr, 1, qstr)

	            : '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'

	          )) list[j++] = expr

	      }

	      expr = j < 2 ? list[0]
	           : '[' + list.join(',') + '].join("")'

	    } else {

	      expr = _parseExpr(parts[1], 0, qstr)
	    }

	    if (qstr[0]) {
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	    }
	    return expr
	  }

	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    }

	  function _parseExpr (expr, asText, qstr) {

	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match

	      while (expr &&
	            (match = expr.match(RE_CSNAME)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g

	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext

	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }

	      expr = !cnt ? _wrapExpr(expr, asText)
	           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr

	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]

	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }

	  // istanbul ignore next: not both
	  var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/

	  function _wrapExpr (expr, asText, key) {
	    var tb

	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length

	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })

	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }

	    if (key) {

	      expr = (tb
	          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'

	    } else if (asText) {

	      expr = 'function(v){' + (tb
	          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }

	    return expr
	  }

	  _tmpl.version = brackets.version = 'v2.4.2'

	  return _tmpl

	})()

	/*
	  lib/browser/tag/mkdom.js

	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/

	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   { String } templ  - The template coming from the custom tag definition
	   * @param   { String } [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @param   { Boolean } checkSvg - flag needed to know if we need to force the svg rendering in case of loop nodes
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html, checkSvg) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div', checkSvg && isSVGTag(tagName))

	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)

	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      setInnerHTML(el, templ)

	    el.stub = true

	    return el
	  }

	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'

	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild

	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }

	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ

	    // be careful with #1343 - string on the source having `$1`
	    var src = {}

	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()

	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }

	  return _mkdom

	})()

	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}

	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {

	  var i = tags.length,
	    j = items.length,
	    t

	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}

	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}

	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)

	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}

	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}

	/**
	 * Insert a new tag avoiding the insert for the conditional tags
	 * @param   {Boolean} isVirtual [description]
	 * @param   { Tag }  prevTag - tag instance used as reference to prepend our new tag
	 * @param   { Tag }  newTag - new tag to be inserted
	 * @param   { HTMLElement }  root - loop parent node
	 * @param   { Array }  tags - array containing the current tags list
	 * @param   { Function }  virtualFn - callback needed to move or insert virtual DOM
	 * @param   { Object } dom - DOM node we need to loop
	 */
	function insertTag(isVirtual, prevTag, newTag, root, tags, virtualFn, dom) {
	  if (isInStub(prevTag.root)) return
	  if (isVirtual) virtualFn(prevTag, root, newTag, dom.childNodes.length)
	  else root.insertBefore(prevTag.root, newTag.root) // #1374 some browsers reset selected here
	}


	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {

	  // remove the each property from the original tag
	  remAttr(dom, 'each')

	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'

	  // parse the each expression
	  expr = tmpl.loopKeys(expr)

	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)

	  // clean template code
	  parent.one('before-mount', function () {

	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root

	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()

	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }

	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length

	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]

	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item

	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {

	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)

	        tag.mount()

	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          insertTag(isVirtual, tag, tags[i], root, tags, addVirtual, dom)
	          oldItems.splice(i, 0, item)
	        }

	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)

	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	        // #closes 2040 PLEASE DON'T REMOVE IT!
	        // there are no tests for this feature
	        if (contains(items, oldItems[i]))
	          insertTag(isVirtual, tag, tags[i], root, tags, moveVirtual, dom)

	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }

	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }

	    // remove the redundant tags
	    unmountRedundant(items, tags)

	    // insert the new nodes
	    root.insertBefore(frag, ref)
	    if (isOption) {

	      // #1374 FireFox bug in <option selected={expression}>
	      if (FIREFOX && !root.multiple) {
	        for (var n = 0; n < root.length; n++) {
	          if (root[n].__riot1374) {
	            root.selectedIndex = n  // clear other options
	            delete root[n].__riot1374
	            break
	          }
	        }
	      }
	    }

	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags

	    // clone the items array
	    oldItems = items.slice()

	  })

	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {

	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }

	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')

	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)

	    return newNode
	  })()

	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''

	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })

	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }

	})(riot)


	function parseNamedElements(root, tag, childTags, forceParsingNamed) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0

	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)

	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }

	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    attr = getAttr(dom, 'each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = [],
	    dom

	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id

	  extend(this, { parent: parent, root: root, opts: opts}, item)
	  // protect the "tags" property from being overridden
	  defineProperty(this, 'tags', {})

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })

	  dom = mkdom(impl.tmpl, innerHTML, isLoop)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      if (el.name in attr) return
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }

	  function inheritFrom(target) {
	    each(Object.keys(target), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)

	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = target[k]
	      }
	    })
	  }

	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {

	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent in loop
	    if (isLoop) {
	      inheritFrom(self.parent)
	    }
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)

	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })

	    return this
	  })

	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance,
	        props = [],
	        obj

	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix

	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	      } else instance = mix

	      var proto = Object.getPrototypeOf(instance)

	      // build multilevel prototype inheritance chain property list
	      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
	      while (obj = Object.getPrototypeOf(obj || instance))

	      // loop the keys in the function prototype or the all object keys
	      each(props, function(key) {
	        // bind methods to self
	        // allow mixins to override other properties/parent mixins
	        if (key != 'init') {
	          // check for getters/setters
	          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
	          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)

	          // apply method only if it does not already exist on the instance
	          if (!self.hasOwnProperty(key) && hasGetterSetter) {
	            Object.defineProperty(self, key, descriptor)
	          } else {
	            self[key] = isFunction(instance[key]) ?
	              instance[key].bind(self) :
	              instance[key]
	          }
	        }
	      })

	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })

	  defineProperty(this, 'mount', function() {

	    updateOpts()

	    // add global mixins
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)

	    if (globalMixin)
	      for (var i in globalMixin)
	        if (globalMixin.hasOwnProperty(i))
	          self.mixin(globalMixin[i])

	    // children in loop should inherit from true parent
	    if (self._parent && self._parent.root.isLoop) {
	      inheritFrom(self._parent)
	    }

	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('before-mount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }

	    defineProperty(self, 'root', root)

	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)

	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })


	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)

	    self.trigger('before-unmount')

	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)
	      else {
	        // the riot-tag and the data-is attributes aren't needed anymore, remove them
	        remAttr(p, RIOT_TAG_IS)
	        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
	      }

	    }

	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }

	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag

	  })

	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'

	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }


	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)

	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var ptag = tag._parent,
	      item = tag._item,
	      el

	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}


	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}

	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.parent || expr.dom.parentNode

	    if (expr.bool) {
	      value = !!value
	    } else if (value == null) {
	      value = ''
	    }

	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value

	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        // cache the parent node because somehow it will become null on IE
	        // on the next iteration
	        expr.parent = parent
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }

	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      if (dom.value !== value) {
	        dom.value = value
	        setAttr(dom, attrName, value)
	      }
	      return
	    } else {
	      // remove original attribute
	      remAttr(dom, attrName)
	    }

	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }

	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)

	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'

	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''

	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
	        dom.__riot1374 = value   // #1374
	      }

	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }

	  })

	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0

	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	/**
	 * Get the outer html of any DOM node SVGs included
	 * @param   { Object } el - DOM node to parse
	 * @returns { String } el.outerHTML
	 */
	function getOuterHTML(el) {
	  if (el.outerHTML) return el.outerHTML
	  // some browsers do not support outerHTML on the SVGs tags
	  else {
	    var container = mkEl('div')
	    container.appendChild(el.cloneNode(true))
	    return container.innerHTML
	  }
	}

	/**
	 * Set the inner html of any DOM node SVGs included
	 * @param { Object } container - DOM node where we will inject the new html
	 * @param { String } html - html to inject
	 */
	function setInnerHTML(container, html) {
	  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
	  // some browsers do not support innerHTML on the SVGs tags
	  else {
	    var doc = new DOMParser().parseFromString(html, 'application/xml')
	    container.appendChild(
	      container.ownerDocument.importNode(doc.documentElement, true)
	    )
	  }
	}

	/**
	 * Checks wether a DOM node must be considered part of an svg document
	 * @param   { String }  name - tag name
	 * @returns { Boolean } -
	 */
	function isSVGTag(name) {
	  return ~SVG_TAGS_LIST.indexOf(name)
	}

	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}

	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}

	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}

	/**
	 * Set any DOM/SVG attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  var xlink = XLINK_REGEX.exec(name)
	  if (xlink && xlink[1])
	    dom.setAttributeNS(XLINK_NS, xlink[1], val)
	  else
	    dom.setAttribute(name, val)
	}

	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]

	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}

	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return

	  tags = parent.tags[tagName]

	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}

	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent

	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''

	  return tag
	}

	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: true
	  }, options))
	  return el
	}

	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}

	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }

	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}


	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data

	  var o = {}
	  for (var key in data) {
	    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
	  }
	  return o
	}

	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @param   { Boolean } isSvg - should we use a SVG as parent node?
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name, isSvg) {
	  return isSvg ?
	    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
	    document.createElement(name)
	}

	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  return Object.create(parent || null)
	}

	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}

	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }

	  // skip the elements with no named properties
	  if (!key) return

	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])

	}

	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}

	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame

	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0

	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf

	})(window || {})

	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }

	  return tag
	}
	/**
	 * Riot public api
	 */

	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }

	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {},
	    globals = mixins[GLOBAL_MIXIN] = {},
	    _id = 0

	  /**
	   * Create/Return a mixin by its name
	   * @param   { String }  name - mixin name (global mixin if object)
	   * @param   { Object }  mixin - mixin logic
	   * @param   { Boolean } g - is global?
	   * @returns { Object }  the mixin logic
	   */
	  return function(name, mixin, g) {
	    // Unnamed global
	    if (isObject(name)) {
	      riot.mixin('__unnamed_'+_id++, name, true)
	      return
	    }

	    var store = g ? globals : mixins

	    // Getter
	    if (!mixin) {
	      if (typeof store[name] === T_UNDEF) {
	        throw new Error('Unregistered mixin: ' + name)
	      }
	      return store[name]
	    }
	    // Setter
	    if (isFunction(mixin)) {
	      extend(mixin.prototype, store[name] || {})
	      store[name] = mixin
	    }
	    else {
	      store[name] = extend(store[name] || {}, mixin)
	    }
	  }

	})()

	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {

	  var els,
	    allTags,
	    tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)

	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }

	  // ----- mount code -----

	  // inject styles into DOM
	  styleManager.inject()

	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))

	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  pushTags(els)

	  return tags
	}

	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}

	/**
	 * Export the Virtual DOM
	 */
	riot.vdom = __virtualDom

	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(2) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(4);
	__webpack_require__(28);
	riot.tag2('app', '<basic-layout if="{{isHome}}"></basic-layout> <home-layout if="{{!isHome}}"></home-layout>', '', '', function (opts) {
	    var _this = this;

	    this.isHome = !!window.location.hash.replace('#', '');
	    riot.route(function (collection, id, action) {
	        _this.update({ isHome: !!collection });
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(5);
	__webpack_require__(9);
	__webpack_require__(12);
	__webpack_require__(16);
	__webpack_require__(24);
	__webpack_require__(27);
	riot.tag2('basic-layout', '<material-navbar> <div class="row"> <div class="col col-lg-3 col-md-6 col-sm-11 col-xs-11"> <div class="logo"> <a href="#" title="$syui.terminal">{{parent.logoText}}</a> <a href="https://syui.gitlab.io/" riot> <div class="for-riot"></div> </a> </div> </div> <div class="col col-lg-9 col-md-6 col-sm-1 col-xs-1 gitcol"> </div> </div> </material-navbar> <div class="row content"> <div name="menu" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 col left"> <riotmui-list name="riotmuiList" links="{{this.links}}"></riotmui-list> </div> <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12 col right"> <div class="container"> <div class="row"> <div id="window"> <div id="toolbar"> <div class="top"> <div id="title"></div> <div id="title-left"> <a href="javascript:location.reload(true)"><i class="icon ion-plus-circled"></i></a> <i class="icon ion-minus-circled" id="mainTitleB"></i> <i class="icon ion-close-circled" id="mainTitleA"></i> </div> <div id="bubble"> <div class="shine"></div> <div class="glow"></div> </div> </div> </div> <div id="terminal"> </div> </div> </div> <div class="row"> </div> </div> </div> </div> <div class="overlay" onclick="{{close}}" name="overlay" if="{{opened}}"></div>', '', '', function (opts) {
	    var _this = this;

	    this.opened = false;
	    this.logoText = '$syui.terminal';
	    this.links = [];
	    this.route = window.location.hash.replace('#', '') || 'Home';
	    this.tags.riotmuiList.update({ selected: window.location.hash });
	    riot.route(function (collection, id, action) {
	        _this.update({ route: collection || 'Home' });
	        _this.tags.riotmuiList.update({ selected: '#' + collection });
	    });

	    this.tags.riotmuiList.on('onClick', function () {
	        _this.close();
	    });
	    this.mq = window.matchMedia('only screen and (min-width : 320px) and (max-width : 480px)');
	    this.mq.addListener(function () {
	        _this.checkOutMatches();
	    });
	    this.checkOutMatches = function () {
	        if (_this.mq.matches) {
	            _this.update({ logoText: '=' });
	        } else {
	            _this.update({ logoText: '=' });
	        }
	    };
	    this.checkOutMatches();

	    this.back = function () {
	        window.location.hash = "/#";
	    };
	    this.toggleMenu = function () {
	        !_this.opened ? _this.open() : _this.close();
	    };
	    this.open = function () {
	        _this.update({ opened: true });
	        _this.menu.style.left = '0px';
	    };
	    this.close = function () {
	        _this.update({ opened: false });
	        _this.menu.style.left = '-100%';
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(6, function() {
				var newContent = __webpack_require__(6);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "home-layout {\n  display: block;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans';\n /** HEDAER **/\n  /** CONTENT **/ }\n  home-layout .row {\n    margin: 0;\n    padding: 0; }\n    home-layout .row .col {\n      margin: 0;\n      padding: 0; }\n  home-layout .icon-row {\n    height: 67px; }\n  home-layout material-navbar {\n    height: 310px; }\n    home-layout material-navbar.footer {\n      height: 200px; }\n      home-layout material-navbar.footer .nav-wrapper {\n        display: flex;\n        flex-direction: row;\n        align-items: center;\n        text-align: center; }\n        home-layout material-navbar.footer .nav-wrapper material-button {\n          left: 50%;\n          margin-left: -70px; }\n    home-layout material-navbar .row .col {\n      display: flex;\n      flex-direction: row;\n      align-items: center; }\n      home-layout material-navbar .row .col.logocol {\n        flex-direction: column; }\n      home-layout material-navbar .row .col .logo logo {\n        display: block;\n        width: 100%;\n        height: 100%; }\n    home-layout material-navbar .gitcol {\n      flex-direction: column !important;\n      align-items: flex-end !important; }\n      home-layout material-navbar .gitcol .github {\n        margin-right: 10px;\n        margin-top: 12px; }\n    home-layout material-navbar .logo {\n      display: block;\n      margin-left: 20px;\n      font-size: 33px;\n      font-weight: 100; }\n      home-layout material-navbar .logo .menu {\n        display: none; }\n      home-layout material-navbar .logo a {\n        display: inline-block;\n        text-decoration: none; }\n      home-layout material-navbar .logo .for-riot {\n        display: inline-block;\n        vertical-align: middle;\n        margin-left: 5px;\n        width: 92px;\n        height: 37px;\n        position: relative;\n        bottom: 2px; }\n  home-layout > .content .wrapper .center {\n    max-width: 1100px;\n    width: 100%;\n    margin: 40px auto;\n    text-align: center; }\n    home-layout > .content .wrapper .center.p1 {\n      margin: 40px auto 60px auto; }\n  home-layout > .content .wrapper h1 {\n    color: #61bdcc;\n    font-size: 22px;\n    font-weight: 100;\n    margin: 0; }\n  home-layout > .content .wrapper h3 {\n    color: #61bdcc;\n    font-size: 20px;\n    font-weight: 100; }\n  home-layout > .content .wrapper a {\n    color: #61bdcc;\n    font-weight: 100; }\n  home-layout > .content .wrapper riotmui-code {\n    margin: 10px 0; }\n  home-layout > .content .wrapper ul {\n    list-style: none; }\n  home-layout > .content .wrapper .checkout {\n    margin: 80px 0;\n    border: 1px solid #61bdcc; }\n  home-layout > .content .wrapper .line {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: #25313b; }\n\n@media (min-width: 768px) and (max-width: 1024px) {\n  home-layout material-navbar {\n    height: 300px; } }\n\n@media (min-width: 480px) and (max-width: 768px) {\n  home-layout material-navbar {\n    height: 200px; } }\n\n@media (min-width: 320px) and (max-width: 480px) {\n  home-layout material-navbar {\n    height: 200px; } }\n", ""]);

	// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(10);
	riot.tag2('material-navbar', '<div class="nav-wrapper"> <yield></yield> </div>', '', 'role="toolbar"', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(11, function() {
				var newContent = __webpack_require__(11);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "material-navbar {\n  display: block;\n  color: #fff;\n  -webkit-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  -ms-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  -moz-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  -o-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.12), 0 6px 20px 0 rgba(0, 0, 0, 0.14);\n  background-color: #25313b;\n  width: 100%;\n  height: 70px;\n  line-height: 70px; }\n  material-navbar:not(material-input) {\n    line-height: 0px; }\n  material-navbar a {\n    color: #fff; }\n  material-navbar .nav-wrapper {\n    position: relative;\n    height: 100%; }\n    material-navbar .nav-wrapper .logo {\n      line-height: 66px; }\n  material-navbar[fixed] {\n    position: relative;\n    height: 70px;\n    z-index: 998; }\n", ""]);

	// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(13);
	__webpack_require__(15);
	riot.tag2('material-pane', '<material-navbar riot-style="height:{{opts[\'material-navbar-height\'] || \'60px\'}};line-height: {{opts[\'material-navbar-height\'] || \'60px\'}};background-color:{{opts[\'material-navbar-color\'] || \'#ccc\'}}"> <content select=".material-pane-left-bar"></content> <content select=".material-pane-title"></content> <content select=".material-pane-right-bar"></content> </material-navbar> <div class="content"> <content select=".material-pane-content"></content> <yield></yield> </div>', '', '', function (opts) {
	  this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(14, function() {
				var newContent = __webpack_require__(14);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "material-pane {\n  display: block; }\n  material-pane material-navbar .nav-wrapper {\n    display: flex;\n    justify-content: space-between;\n    flex-grow: 1;\n    /** USE MaTRIAL-BUTTON INTO PANE**/ }\n    material-pane material-navbar .nav-wrapper .material-pane-title {\n      font-size: 26px;\n      text-transform: uppercase;\n      text-align: center; }\n    material-pane material-navbar .nav-wrapper material-button {\n      background: transparent; }\n  material-pane .content .material-pane-content {\n    padding: 10px;\n    background: #f2f2f2; }\n", ""]);

	// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var Content = {
	    init: function init() {
	        var _this = this;

	        this.on('mount', function () {
	            [].forEach.call(_this.root.querySelectorAll('content'), function (node) {
	                var selector = node.getAttribute('select');
	                [].forEach.call(_this.root.querySelectorAll(selector), function (content) {
	                    node.parentNode.insertBefore(content, node.nextSibling);
	                });
	                node.parentNode.removeChild(node);
	            });
	        });
	    }
	};
	riot.mixin('content', Content);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(17);
	__webpack_require__(19);
	__webpack_require__(20);
	riot.tag2('material-button', '<material-waves onclick="{{click}}" onmousedown="{{launch}}" center="{{opts[\'waves-center\']}}" rounded="{{opts[\'rounded\']}}" opacity="{{opts[\'waves-opacity\']}}" color="{{opts[\'waves-color\']}}" duration="{{opts[\'waves-duration\']}}"></material-waves> <div class="content"><yield></yield></div>', '', '', function (opts) {
	    var _this = this;

	    this.dynamicAttributes = ['disabled'];

	    this.disabled = opts.disabled || false;

	    this.launch = function (e) {
	        if (!_this.disabled) _this.tags['material-waves'].trigger('launch', e);
	    };

	    this.click = function () {
	        if (opts.link) window.location.href = opts.link;
	        _this.trigger('click');
	    };

	    this.mixin('dynamicAttributes');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(18, function() {
				var newContent = __webpack_require__(18);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "material-button {\n  margin: 20px;\n  border: none;\n  border-radius: 2px;\n  display: inline-block;\n  position: relative;\n  height: 40px;\n  line-height: 36px;\n  background: #61bdcc;\n  color: #fff;\n  padding: 20px;\n  cursor: pointer;\n  text-transform: uppercase;\n  vertical-align: middle;\n  outline: 0;\n  -webkit-tap-highlight-color: transparent;\n  /** CONTENT **/\n  /** Rounded **/\n  /** Shady **/\n  /**Disabled **/ }\n  material-button:hover material-waves {\n    background: rgba(255, 255, 255, 0.2);\n    -webkit-transition: background .2s ease-in;\n    -ms-transition: background .2s ease-in;\n    -moz-transition: background .2s ease-in;\n    -o-transition: background .2s ease-in;\n    transition: background .2s ease-in; }\n  material-button material-waves {\n    background: rgba(255, 255, 255, 0);\n    -webkit-transition: background .2s ease-in;\n    -ms-transition: background .2s ease-in;\n    -moz-transition: background .2s ease-in;\n    -o-transition: background .2s ease-in;\n    transition: background .2s ease-in; }\n  material-button .content {\n    width: 101%;\n    height: 100%;\n    display: block;\n    text-align: center; }\n    material-button .content .text, material-button .content i.material-icons, material-button .content i.icon, material-button .content a {\n      display: inline-block;\n      vertical-align: middle;\n      font-size: 18px;\n      color: #fff;\n      line-height: 40px; }\n      material-button .content .text.material-icons, material-button .content i.material-icons.material-icons, material-button .content i.icon.material-icons, material-button .content a.material-icons {\n        font-size: 20px; }\n      material-button .content .text svg, material-button .content i.material-icons svg, material-button .content i.icon svg, material-button .content a svg {\n        fill: #fff;\n        stroke: #fff; }\n  material-button[rounded=\"true\"] {\n    border-radius: 50%;\n    width: 40px;\n    padding: 0; }\n    material-button[rounded=\"true\"] .content {\n      width: 100%;\n      height: 100%;\n      display: flex;\n      align-items: center;\n      text-align: center; }\n      material-button[rounded=\"true\"] .content i.material-icons, material-button[rounded=\"true\"] .content i.icon {\n        display: inline-block;\n        text-align: center;\n        width: 100%;\n        height: 100%;\n        -webkit-user-select: none;\n        -ms-user-select: none;\n        -moz-user-select: none;\n        -o-user-select: none;\n        user-select: none; }\n  material-button[shady=\"true\"] {\n    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n    transition: box-shadow .2s; }\n    material-button[shady=\"true\"]:hover {\n      -webkit-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      -ms-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      -moz-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      -o-box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.14), 0 2px 12px 0 rgba(0, 0, 0, 0.12);\n      transition: box-shadow .2s; }\n  material-button[disabled=\"true\"] {\n    background: #ccc;\n    color: #999999;\n    cursor: default; }\n    material-button[disabled=\"true\"] #content .text, material-button[disabled=\"true\"] #content i.material-icons, material-button[disabled=\"true\"] #content i.icon, material-button[disabled=\"true\"] #content a {\n      color: #999999; }\n      material-button[disabled=\"true\"] #content .text svg, material-button[disabled=\"true\"] #content i.material-icons svg, material-button[disabled=\"true\"] #content i.icon svg, material-button[disabled=\"true\"] #content a svg {\n        fill: #999999;\n        stroke: #999999; }\n    material-button[disabled=\"true\"]:hover material-waves {\n      background: transparent; }\n", ""]);

	// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {/**
	 * The mixin ables to update root tag attributes
	 * if in this.dynamicAttributes array contains
	 * name of attribute, which equals variable into tag instance
	 * Example:
	 * <my-tag disabled="true"></my-tag>
	 * <my-tag>
	 *     ....
	 *     <script>
	 *         this.disabled = true;
	 *         this.dynamicAttributes = ['disabled'];
	 *         setTimeout(function(){
	 *              this.update({disabled:false});
	 *         }.bind(this),1000);
	 *     </script>
	 * </my-tag>
	 * In this example disabled attribute of my-tag
	 * will be changed after 1s and we will see following HTML
	 * <my-tag disabled="false"></my-tag>
	 */
	'use strict';

	var DynamicAttributesMixin = {
	    init: function init() {
	        var _this = this;

	        this.on('update', function (updated) {
	            if (updated && _this.dynamicAttributes) {
	                _this.dynamicAttributes.forEach(function (key) {
	                    if (updated[key] != undefined) {
	                        _this.root.setAttribute(key, updated[key]);
	                    }
	                });
	            }
	        });
	    }
	};

	riot.mixin('dynamicAttributes', DynamicAttributesMixin);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(21);
	__webpack_require__(23);
	riot.tag2('material-waves', '<div id="waves" name="waves"></div>', '', '', function (opts) {
	    var _this3 = this;

	    var _createClass = (function () {
	        function defineProperties(target, props) {
	            for (var i = 0; i < props.length; i++) {
	                var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	            }
	        }return function (Constructor, protoProps, staticProps) {
	            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	        };
	    })();

	    var _get = function get(_x, _x2, _x3) {
	        var _again = true;_function: while (_again) {
	            var object = _x,
	                property = _x2,
	                receiver = _x3;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	                var parent = Object.getPrototypeOf(object);if (parent === null) {
	                    return undefined;
	                } else {
	                    _x = parent;_x2 = property;_x3 = receiver;_again = true;desc = parent = undefined;continue _function;
	                }
	            } else if ('value' in desc) {
	                return desc.value;
	            } else {
	                var getter = desc.get;if (getter === undefined) {
	                    return undefined;
	                }return getter.call(receiver);
	            }
	        }
	    };

	    function _classCallCheck(instance, Constructor) {
	        if (!(instance instanceof Constructor)) {
	            throw new TypeError('Cannot call a class as a function');
	        }
	    }

	    function _inherits(subClass, superClass) {
	        if (typeof superClass !== 'function' && superClass !== null) {
	            throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	        }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	    }

	    var Bound = riot.mixin('Bound');

	    var Wave = (function (_Bound) {
	        _inherits(Wave, _Bound);

	        function Wave(container, opts, e) {
	            _classCallCheck(this, Wave);

	            _get(Object.getPrototypeOf(Wave.prototype), 'constructor', this).call(this);

	            if (!container) console.error('You should to set container to the wave!');
	            this.container = container;

	            this.maxOpacity = opts.opacity || 0.6;
	            this.duration = opts.duration || 750;
	            this.color = opts.color || '#fff';
	            this.center = opts.center || false;

	            this.event = e;

	            this.containerBound = this.receiveBound();
	            this.maxScale = this.containerBound.size / 100 * 10;
	            this.created = Date.now();

	            this.start = {};

	            this.createNode();
	            this.waveIn();
	        }

	        _createClass(Wave, [{
	            key: 'createNode',
	            value: function createNode() {
	                this.wave = document.createElement('div');
	                this.wave.classList.add('wave');
	                this.container.appendChild(this.wave);
	            }
	        }, {
	            key: 'waveIn',
	            value: function waveIn() {
	                var _this = this;

	                if (this.center && !this.event) console.error('Setup at least mouse event... Or just set center attribute');

	                this.start.x = this.center ? this.containerBound.height / 2 : this.event.pageY - this.containerBound.offsetTop;
	                this.start.y = this.center ? this.containerBound.width / 2 : this.event.pageX - this.containerBound.offsetLeft;

	                var isIE = window.navigator.userAgent.indexOf('Trident') !== -1;
	                setTimeout(function () {
	                    return _this.setStyles(_this.maxOpacity);
	                }, isIE ? 50 : 0);
	            }
	        }, {
	            key: 'waveOut',
	            value: function waveOut() {
	                var _this2 = this;

	                var delta = Date.now() - this.created;
	                var deltaX = Math.round(this.duration / 2) - delta;
	                var delay = deltaX > 0 ? deltaX : 0;
	                setTimeout(function () {
	                    _this2.setStyles(0);
	                    setTimeout(function () {
	                        if (_this2.wave.parentNode === _this2.container) {
	                            _this2.container.removeChild(_this2.wave);
	                        }
	                    }, _this2.duration);
	                }, delay);
	            }
	        }, {
	            key: 'setStyles',
	            value: function setStyles(opacity) {
	                this.wave.setAttribute('style', this.convertStyle({
	                    'top': this.start.x + 'px',
	                    'left': this.start.y + 'px',
	                    'transform': 'scale(' + this.maxScale + ')',
	                    'transition-duration': this.duration + 'ms',
	                    'transition-timing-function': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
	                    'background': this.color,
	                    'opacity': opacity
	                }));
	            }
	        }, {
	            key: 'convertStyle',
	            value: function convertStyle(o) {
	                var style = '';
	                Object.keys(o).forEach(function (key) {
	                    if (o.hasOwnProperty(key)) {
	                        style += key + ':' + o[key] + ';';
	                    }
	                });
	                return style;
	            }
	        }]);

	        return Wave;
	    })(Bound);

	    this._waves = [];
	    this._events = [];

	    this.on('launch', function (e) {
	        _this3._waves.push(new Wave(_this3.waves, opts, e));
	        if (!_this3._events.length) {
	            _this3._events.push(e.target.addEventListener('mouseup', function () {
	                return _this3.trigger('hold');
	            }));
	            _this3._events.push(e.target.addEventListener('mouseleave', function () {
	                return _this3.trigger('hold');
	            }));
	        }
	    });

	    this.on('hold', function () {
	        if (_this3._waves[_this3._waves.length - 1]) _this3._waves[_this3._waves.length - 1].waveOut();
	        if (_this3._waves[_this3._waves.length - 1]) _this3._waves.slice(_this3._waves.length - 1, 1);
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(22);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(22, function() {
				var newContent = __webpack_require__(22);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "material-waves {\n  display: block;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  overflow: hidden; }\n  material-waves #waves {\n    display: block;\n    width: 100%;\n    height: 100%;\n    position: relative;\n    overflow: hidden;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    -moz-user-select: none;\n    -o-user-select: none;\n    user-select: none;\n    vertical-align: middle;\n    -webkit-transform: rotate(0deg);\n    z-index: 1; }\n    material-waves #waves .wave {\n      position: absolute;\n      -webkit-border-radius: 50%;\n      -ms-border-radius: 50%;\n      -moz-border-radius: 50%;\n      -o-border-radius: 50%;\n      border-radius: 50%;\n      width: 20px;\n      height: 20px;\n      margin-top: -10px;\n      margin-left: -10px;\n      z-index: 0;\n      opacity: 0;\n      -webkit-transform: scale(0);\n      -ms-transform: scale(0);\n      -moz-transform: scale(0);\n      -o-transform: scale(0);\n      transform: scale(0);\n      -webkit-transition-property: transform,opacity;\n      -ms-transition-property: transform,opacity;\n      -moz-transition-property: transform,opacity;\n      -o-transition-property: transform,opacity;\n      transition-property: transform,opacity;\n      pointer-events: none; }\n  material-waves[rounded=\"true\"] {\n    border-radius: 50%; }\n    material-waves[rounded=\"true\"] #waves {\n      border-radius: 50%; }\n", ""]);

	// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {/**
	 * Bound class contain methods for
	 * receiving bounds of DOM element.
	 */
	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Bound = (function () {
	    function Bound() {
	        _classCallCheck(this, Bound);
	    }

	    _createClass(Bound, [{
	        key: 'receiveBound',

	        /**
	         * Get Bounds
	         * @returns {*}
	         */
	        value: function receiveBound() {
	            if (!this.container) console.error('Yor class must contain a container. It is DOM Element. Define please this.container property.');
	            var document,
	                window,
	                box,
	                doc = this.container && this.container.ownerDocument;
	            // Get document
	            document = doc.documentElement;
	            // Get container
	            if (typeof this.container.getBoundingClientRect !== typeof undefined) {
	                box = this.container.getBoundingClientRect();
	            }
	            window = this.getWindow(doc);
	            // Return BoundingRect with additional properties.
	            return this.mix(box, {
	                size: Math.max(box.width, box.height),
	                offsetTop: box.top + window.pageYOffset - document.clientTop,
	                offsetLeft: box.left + window.pageXOffset - document.clientLeft
	            });
	        }

	        /**
	         * Window or not?
	         * @param o - supposing object
	         * @returns {boolean}
	         */
	    }, {
	        key: 'isWindow',
	        value: function isWindow(o) {
	            return o !== null && o === o.window;
	        }

	        /**
	         * Get window method
	         * @param e - supposing object
	         * @returns {*}
	         */
	    }, {
	        key: 'getWindow',
	        value: function getWindow(o) {
	            return this.isWindow(o) ? o : o.nodeType === 9 && o.defaultView;
	        }

	        /**
	         * Simple mixin. Unfortunately, babel don't support Object.assign \ or mixin
	         * @param so
	         * @param to
	         * @returns {*}
	         */
	    }, {
	        key: 'mix',
	        value: function mix(so, to) {
	            for (var key in so) {
	                // only copy if not already present
	                if (!(key in to)) {
	                    to[key] = so[key];
	                }
	            }
	            return to;
	        }
	    }]);

	    return Bound;
	})();

	riot.mixin('Bound', Bound);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(25);
	riot.tag2('riotmui-list', '<ul> <li each="{{item,key in items}}" class="{{selected:parent.selected==item.link}}"> <a if="{{item.link}}" onclick="{{onClick}}" href="{{item.link}}" onclick="{{parent.select}}" title="{{item.title}}">{{item.title}}</a> </li> </ul>', '', 'role="toolbar"', function (opts) {
	    var _this = this;

	    this.items = opts.links || [];
	    this.onClick = function (e) {
	        _this.trigger('onClick');
	        window.location.href = e.target.getAttribute('href');
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(26, function() {
				var newContent = __webpack_require__(26);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "riotmui-list ul {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n  riotmui-list ul li {\n    cursor: pointer;\n    transition: background .2s; }\n    riotmui-list ul li:hover {\n      background: #fff;\n      transition: all .2s; }\n    riotmui-list ul li a {\n      text-decoration: none;\n      color: #070726;\n      display: block;\n      height: 100%;\n      padding: 15px 0px 15px 20px;\n      font-size: 20px; }\n    riotmui-list ul li.selected {\n      border-left: 4px solid #579ead; }\n      riotmui-list ul li.selected a {\n        color: #579ead; }\n", ""]);

	// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	!function(t,e){if(true)module.exports=e(__webpack_require__(1));else if("function"==typeof define&&define.amd)define(["riot"],e);else{var r=e("object"==typeof exports?require("riot"):t.riot);for(var n in r)("object"==typeof exports?exports:t)[n]=r[n]}}(this,function(t){return function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){function n(t){return t&&"undefined"!=typeof Symbol&&t.constructor===Symbol?"symbol":typeof t}var o,i,u;!function(n,s){i=[t,r(1),r(2)],o=s,u="function"==typeof o?o.apply(e,i):o,!(void 0!==u&&(t.exports=u))}(this,function(t,e,r){function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==("undefined"==typeof e?"undefined":n(e))&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+("undefined"==typeof e?"undefined":n(e)));t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var s=function(){function t(t,e){var r=[],n=!0,o=!1,i=void 0;try{for(var u,s=t[Symbol.iterator]();!(n=(u=s.next()).done)&&(r.push(u.value),!e||r.length!==e);n=!0);}catch(a){o=!0,i=a}finally{try{!n&&s["return"]&&s["return"]()}finally{if(o)throw i}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),a=function x(t,e,r){null===t&&(t=Function.prototype);var n=Object.getOwnPropertyDescriptor(t,e);if(void 0===n){var o=Object.getPrototypeOf(t);return null===o?void 0:x(o,e,r)}if("value"in n)return n.value;var i=n.get;return void 0===i?void 0:i.call(r)},c=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),h=console&&console.error||function(){},f=function(){function t(){u(this,t),e.router=this,e.observable(this),this.interceptors=[this.processRoute.bind(this)],this.handler=new v,this.current=new p("").response,this.process=this.process.bind(this)}return c(t,[{key:"route",value:function(t){this.handler=t}},{key:"routes",value:function(t){this.route((new v).routes(t))}},{key:"use",value:function(t){this.interceptors.push(t)}},{key:"process",value:function(){var t=Array.prototype.slice.call(arguments),e=t.join("/");"/"!==e[0]&&(e="/"+e);var r=new p(e);return this.rootContext||(this.rootContext=r),this.processRequest(r),r}},{key:"processRequest",value:function(t){return this.processInterceptors(t),this.processResponse(t)}},{key:"processResponse",value:function(t){if(this.isRedirect(t))return this.processRedirect(t);var e=(t.request,t.response);return e.redirectTo?void 0:(this.current=e,this.rootContext=null,this.trigger("route:updated",e),t)}},{key:"isRedirect",value:function(t){return!!t.response.redirectTo}},{key:"processRedirect",value:function(t){var e=t.response.redirectTo;this.rootContext.addRedirect(e),this.navigateTo(e)}},{key:"navigateTo",value:function(t){e.route(t)}},{key:"processInterceptors",value:function(t,e,r){var n=(e||[]).concat(this.interceptors).concat(r||[]),o=function i(){if(!t.stop){var e=n.shift(),r=t.request,o=t.response;if(e)return e(r,o,i,t)}return t};return o()}},{key:"processRoute",value:function(t,e,r,n){return this.handler.process(t,e,n),r()}},{key:"start",value:function(){e.route(this.process),e.route.start(),this.exec()}},{key:"exec",value:function(){e.route.exec(this.process)}}]),t}(),p=function(){function t(e){u(this,t),this.request="string"==typeof e?new k(e):e,this.response=new O(this.request),this.redirectStack=[]}return c(t,[{key:"addRedirect",value:function(t){if(this.redirectStack.indexOf(t)>-1)throw new Error("Cyclic redirection to "+t+". Stack = "+this.redirectStack);this.redirectStack.push(t)}}]),t}(),l=function(){function t(){u(this,t)}return c(t,[{key:"matches",value:function(t){return!1}},{key:"process",value:function(t,e){var r=this.matches(t);return r?this.routeMatch(t,e,r):this.routeMiss(t,e)}},{key:"routeMatch",value:function(t,e,r){return e.add(r),!0}},{key:"routeMiss",value:function(t,e){return!1}},{key:"processRoutes",value:function(t,e,r){if(r&&r.length){for(var n=r.length,o=0;n>o;o++){var i=r[o];if(i.process(t,e))return!0}return!1}}},{key:"createRequest",value:function(t,e){return new y(t,e)}}]),t}(),d=function(t){function e(t){u(this,e);var r=o(this,Object.getPrototypeOf(e).call(this,t));t=t||{},r.tag=t.tag,r.api=t.api,r.path=t.path,r.name=t.name,r.updatable=t.updatable,r.pathParameterNames=[];var n=r.getPath().replace(/^\//,"");return r.pattern="^/?"+n.replace(/:([^\/]+)/g,function(t,e){return this.pathParameterNames.push(e),"([^/]+)"}.bind(r))+"(:?/|$)",r.regex=new RegExp(r.pattern),r}return i(e,t),c(e,[{key:"routes",value:function(t){var e=t.filter(function(t){return t instanceof m}),r=t.filter(function(t){return t instanceof b}),n=t.filter(function(t){return t instanceof g}),o=t.filter(function(t){return-1===e.indexOf(t)&&-1===r.indexOf(t)&&-1===n.indexOf(t)});return n.length>1&&h("Can't use more than one NotFoundRoute per route. --> "+this.getPath()),r.length>1&&h("Can't use more than one DefaultRoute per route. --> "+this.getPath()),this._routes=[].concat(e).concat(o).concat(r).concat(n),this}},{key:"matches",value:function(t){var e=this.regex.exec(t.uri);if(e){var r={};for(var n in this.pathParameterNames){var o=this.pathParameterNames[n];r[o]=decodeURIComponent(e[parseInt(n,10)+1])}return{route:this,tag:this.tag,api:this.api,found:e[0],params:r}}return!1}},{key:"routeMatch",value:function(t,r,n){var o=a(Object.getPrototypeOf(e.prototype),"routeMatch",this).call(this,t,r,n);return this.processRoutes(t,r,n),o}},{key:"processRoutes",value:function(t,r,n){return a(Object.getPrototypeOf(e.prototype),"processRoutes",this).call(this,this.createRequest(t,n),r,this._routes)}},{key:"getPath",value:function(){return this.name||this.path||("string"==typeof this.tag?this.tag:"")}}]),e}(l),v=function(t){function e(){return u(this,e),o(this,Object.getPrototypeOf(e).apply(this,arguments))}return i(e,t),e}(d),y=function j(t,e){u(this,j),this.request=t,this.matcher=e,this.uri=this.request.uri.substring(e.found.length),this.parentUri=this.request.uri.substring(0,e.found.length)},g=function(t){function e(t){u(this,e);var r=o(this,Object.getPrototypeOf(e).call(this,t));return t=t||{},r.tag=t.tag,r.api=t.api,r}return i(e,t),c(e,[{key:"matches",value:function(t){return{route:this,tag:this.tag,api:this.api,found:t.uri}}}]),e}(l),m=function(t){function e(t){u(this,e);var r=o(this,Object.getPrototypeOf(e).call(this,t));return t=t||{},r.from=t.from,r.to=t.to,r.pattern="(^/?)"+r.from+"(/|$)",r.regex=new RegExp(r.pattern),r}return i(e,t),c(e,[{key:"process",value:function(t,e){var r=t.uri.replace(this.regex,"$1"+this.to+"$2");if(r!==t.uri){var n=t.parentUri||"";return e.redirectTo=n+r,!0}}}]),e}(l),b=function(t){function e(t){u(this,e);var r=o(this,Object.getPrototypeOf(e).call(this,t));return t=t||{},r.tag=t.tag,r.api=t.api,r}return i(e,t),c(e,[{key:"matches",value:function(t){var e=t.uri.trim();return"/"===e||""===e?{route:this,tag:this.tag,api:this.api,found:e}:void 0}}]),e}(l),k=function w(t){u(this,w),this.uri=t},O=function(){function t(e){u(this,t),this.uri=e.uri,this.matches=[],this.params={}}return c(t,[{key:"add",value:function(t){this.matches.push(t);var e=t.params;if(e)for(var r in e)e.hasOwnProperty(r)&&(this.params[r]=e[r])}},{key:"get",value:function(t){return this.matches[t]}},{key:"size",value:function(){return this.matches.length}},{key:"isEmpty",value:function(){return this.matches.length}}]),t}();e.tag("route","<router-content></router-content>",function(t){this.calculateLevel=function(t){var e=0;return t.parent&&(e+=this.calculateLevel(t.parent)),t.opts.__router_level&&(e+=t.opts.__router_level),t.__router_tag&&(e+=1),e}.bind(this),this.normalizeTag=function(t,e,r){var n=t(e,r);return"string"==typeof n?t=n:(t=n.tag||t,e=n.api||e),[t,e,r]},this.unmountTag=function(){this.instance&&this.instance.unmount(!0)},this.mountTag=function(t,r,n){if("function"==typeof t){var o=this.normalizeTag(t,r,n),i=s(o,3);t=i[0],r=i[1],n=i[2]}this.canUpdate(t,r,n)?this.instance.update(r):(this.unmountTag(),t&&(this.root.replaceChild(document.createElement(t),this.root.children[0]),this.instance=e.mount(this.root.children[0],t,r)[0],this.instanceTag=t,this.instanceApi=r))},this.canUpdate=function(r,n,o){return(e.router.config.updatable||t.updatable||o.updatable)&&this.instance&&this.instance.isMounted&&this.instanceTag===r?!0:!1},this.updateRoute=function(){var t={tag:null};if(e.router&&e.router.current){var n=e.router.current;if(this.level<=n.size()){var o=n.get(this.level);if(o){var i=o.params||{},u=r(!0,{},o.api,i,{__router_level:this.level});t={tag:o.tag,api:u,updatable:o.route.updatable}}}}t.tag?this.mountTag(t.tag,t.api,t):this.unmountTag()}.bind(this),this.__router_tag="route",this.level=this.calculateLevel(this),e.router.on("route:updated",this.updateRoute),this.on("unmount",function(){e.router.off("route:updated",this.updateRoute),this.unmountTag()}.bind(this)),this.on("mount",function(){this.updateRoute()}.bind(this))});var R=new f;R.Route=d,R.DefaultRoute=b,R.RedirectRoute=m,R.NotFoundRoute=g,R._={Response:O,Request:k},R.config={updatable:!1},e.router=R,t.exports=R})},function(e,r){e.exports=t},function(t,e){"use strict";var r=Object.prototype.hasOwnProperty,n=Object.prototype.toString,o=function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===n.call(t)},i=function(t){if(!t||"[object Object]"!==n.call(t))return!1;var e=r.call(t,"constructor"),o=t.constructor&&t.constructor.prototype&&r.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!e&&!o)return!1;var i;for(i in t);return"undefined"==typeof i||r.call(t,i)};t.exports=function u(){var t,e,r,n,s,a,c=arguments[0],h=1,f=arguments.length,p=!1;for("boolean"==typeof c?(p=c,c=arguments[1]||{},h=2):("object"!=typeof c&&"function"!=typeof c||null==c)&&(c={});f>h;++h)if(t=arguments[h],null!=t)for(e in t)r=c[e],n=t[e],c!==n&&(p&&n&&(i(n)||(s=o(n)))?(s?(s=!1,a=r&&o(r)?r:[]):a=r&&i(r)?r:{},c[e]=u(p,a,n)):"undefined"!=typeof n&&(c[e]=n));return c}}])});
	//# sourceMappingURL=router.min.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(29);
	__webpack_require__(9);
	__webpack_require__(12);
	__webpack_require__(16);
	__webpack_require__(24);
	__webpack_require__(31);
	__webpack_require__(32);
	__webpack_require__(27);
	riot.tag2('home-layout', '<div class="container"> <div class="row"> <div id="window"> <div id="toolbar"> <div class="top"> <div id="title"></div> <div id="title-left"> <a href="javascript:location.reload(true)"><i class="icon ion-plus-circled"></i></a> <i class="icon ion-minus-circled" id="mainTitleB"></i> <i class="icon ion-close-circled" id="mainTitleA"></i> </div> <div id="bubble"> <div class="shine"></div> <div class="glow"></div> </div> </div> </div> <div id="terminal"> </div> </div> </div> <div class="row"> </div> </div>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(30);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(30, function() {
				var newContent = __webpack_require__(30);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "home-layout {\n  display: block;\n  width: 100%;\n  color: #070731;\n  font-family: 'Open Sans';\n  background-color: rgba(0, 0, 0, 0.08);\n  /** HEDAER **/\n  /** CONTENT **/ }\n  home-layout .row {\n    margin: 0;\n    padding: 0; }\n    home-layout .row .col {\n      margin: 0;\n      padding: 0; }\n  home-layout .icon-row {\n    height: 67px; }\n  home-layout material-navbar {\n    height: 310px; }\n    home-layout material-navbar.footer {\n      height: 200px; }\n      home-layout material-navbar.footer .nav-wrapper {\n        display: flex;\n        flex-direction: row;\n        align-items: center;\n        text-align: center; }\n        home-layout material-navbar.footer .nav-wrapper material-button {\n          left: 50%;\n          margin-left: -70px; }\n    home-layout material-navbar .row .col {\n      display: flex;\n      flex-direction: row;\n      align-items: center; }\n      home-layout material-navbar .row .col.logocol {\n        flex-direction: column; }\n      home-layout material-navbar .row .col .logo logo {\n        display: block;\n        width: 100%;\n        height: 100%; }\n    home-layout material-navbar .gitcol {\n      flex-direction: column !important;\n      align-items: flex-end !important; }\n      home-layout material-navbar .gitcol .github {\n        margin-right: 10px;\n        margin-top: 12px; }\n    home-layout material-navbar .logo {\n      display: block;\n      margin-left: 20px;\n      font-size: 33px;\n      font-weight: 100; }\n      home-layout material-navbar .logo .menu {\n        display: none; }\n      home-layout material-navbar .logo a {\n        display: inline-block;\n        text-decoration: none; }\n      home-layout material-navbar .logo .for-riot {\n        display: inline-block;\n        vertical-align: middle;\n        margin-left: 5px;\n        width: 92px;\n        height: 37px;\n        position: relative;\n        bottom: 2px; }\n  home-layout > .content .wrapper .center {\n    max-width: 1100px;\n    width: 100%;\n    margin: 40px auto;\n    text-align: center; }\n    home-layout > .content .wrapper .center.p1 {\n      margin: 40px auto 60px auto; }\n  home-layout > .content .wrapper h1 {\n    color: #61bdcc;\n    font-size: 22px;\n    font-weight: 100;\n    margin: 0; }\n  home-layout > .content .wrapper h3 {\n    color: #61bdcc;\n    font-size: 20px;\n    font-weight: 100; }\n  home-layout > .content .wrapper a {\n    color: #61bdcc;\n    font-weight: 100; }\n  home-layout > .content .wrapper riotmui-code {\n    margin: 10px 0; }\n  home-layout > .content .wrapper ul {\n    list-style: none; }\n  home-layout > .content .wrapper .checkout {\n    margin: 80px 0;\n    border: 1px solid #61bdcc; }\n  home-layout > .content .wrapper .line {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background: #25313b; }\n\n@media (min-width: 768px) and (max-width: 1024px) {\n  home-layout material-navbar {\n    height: 300px; } }\n\n@media (min-width: 480px) and (max-width: 768px) {\n  home-layout material-navbar {\n    height: 200px; } }\n\n@media (min-width: 320px) and (max-width: 480px) {\n  home-layout material-navbar {\n    height: 200px; } }\n", ""]);

	// exports


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag2('script', '', '', 'src="/bower_components/jquery.terminal/js/jquery.terminal.min.js"', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var riot = __webpack_require__(1);
	__webpack_require__(27);
	// Page tags
	//require('./components/pages/home.tag');
	//require('./components/pages/404.tag');
	__webpack_require__(34);
	//require('./components/pages/checkbox.tag');
	//require('./components/pages/combobox.tag');
	//require('./components/pages/input.tag');
	//require('./components/pages/dropdown.tag');
	//require('./components/pages/dropdown-list.tag');
	__webpack_require__(51);
	//require('./components/pages/pane.tag');
	//require('./components/pages/popup.tag');
	//require('./components/pages/snackbar.tag');
	//require('./components/pages/tabs.tag');
	//require('./components/pages/textarea.tag');

	var Route = riot.router.Route,
	    DefaultRoute = riot.router.DefaultRoute,
	    NotFoundRoute = riot.router.NotFoundRoute,
	    RedirectRoute = riot.router.RedirectRoute;

	riot.router.routes([new DefaultRoute({ tag: 'home' }), new Route({ tag: 'buttons' })]);

	//new Route({tag: 'checkbox'}),
	//new Route({tag: 'combobox'}),
	//new Route({tag: 'm-input'}),
	//new Route({tag: 'dropdown'}),
	//new Route({tag: 'dropdown-list'}),
	//new Route({tag: 'navbar'}),
	//new Route({tag: 'pane'}),
	//new Route({tag: 'popup'}),
	//new Route({tag: 'snackbar'}),
	//new Route({tag: 'tabs'}),
	//new Route({tag: 'm-textarea'}),
	//new NotFoundRoute({tag:'not-found'})
	riot.router.start();

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(35);
	__webpack_require__(41);
	__webpack_require__(48);
	__webpack_require__(38);

	__webpack_require__(16);

	riot.tag2('buttons', '<riotmui-desc> </riotmui-desc>', '', '', function (opts) {

	    this.example1 = '<material-button class="ui">\n      <div class="text">BUTTON</div>\n  </material-button>';
	    this.example2 = '<material-button class="ui" waves-center="true" rounded="true" waves-opacity="0.6" waves-duration="600" style="background:#f43137">\n      <i class="material-icons">add</i>\n  </material-button>';
	    this.example3 = '<material-button class="ui" waves-color="#000" shady="true" style="background:#ed7ff4; height: 50px; line-height: 46px">\n      <div class="text">ICON</div>\n      <i class="material-icons">create</i>\n  </material-button>';
	    this.example4 = '<material-button class="ui" disabled="true">\n      <div class="text">Disabled</div>\n  </material-button>';
	    this.children = [{
	        title: '<div class="text">TEXT</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds text to the button.'
	    }, {
	        title: '<div class="icon"><svg>...</svg></div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds icon to the button.'
	    }, {
	        title: ' <i class="material-icons"> create </i>',
	        type: 'tag',
	        'default': '',
	        desc: 'If you use google material icon set you can add it into material-button.'
	    }];

	    this.options = [{
	        title: 'rounded',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will make button rounded.'
	    }, {
	        title: 'shady',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will add to the button box-shadow property.'
	    }, {
	        title: 'disabled',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" user won\'t be able to click on it. Also it will change button color.'
	    }, {
	        title: 'link',
	        type: 'String',
	        'default': '',
	        desc: 'If will be set link attribute then material button will behave it like a "a" tag.'
	    }, {
	        title: 'waves-center',
	        type: 'String ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" waves will start animation from center of button.'
	    }, {
	        title: 'waves-opacity',
	        type: 'Number [0<x<1]',
	        'default': '0.4',
	        desc: 'Using this option it\'s possible to setup wave opacity.'
	    }, {
	        title: 'waves-duration',
	        type: 'Number [ms]',
	        'default': '400',
	        desc: 'Speed of waves animation.'
	    }, {
	        title: 'waves-color',
	        type: 'color [RGB]',
	        'default': '#fff',
	        desc: 'Allows to setup waves\'s color.'
	    }];

	    this.styling = [{
	        title: '$material-button-height',
	        type: 'px',
	        'default': '40',
	        desc: 'Sets default height of button.'
	    }, {
	        title: '$material-button-background',
	        type: 'color',
	        'default': '#61bdcc',
	        desc: 'Sets default button background.'
	    }, {
	        title: '$material-button-disabled-background',
	        type: 'color',
	        'default': '#ccc',
	        desc: 'Sets disabled button background.'
	    }, {
	        title: '$material-button-color',
	        type: 'color',
	        'default': '#fff',
	        desc: 'Sets default button text color.'
	    }, {
	        title: '$material-button-padding',
	        type: 'rem',
	        'default': '0 2rem',
	        desc: 'Sets default button left&right offset.'
	    }, {
	        title: '$material-button-font-size',
	        type: 'px',
	        'default': '18',
	        desc: 'Sets default button text font size.'
	    }, {
	        title: '$material-button-icon-size',
	        type: 'px',
	        'default': '20',
	        desc: 'Sets default button icon font size. (For google material icon set)'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(36);
	__webpack_require__(15);
	__webpack_require__(38);
	__webpack_require__(12);
	__webpack_require__(16);
	riot.tag2('riotmui-desc', '<div class="content"> <content select=".riotmui-desc-examples"></content> <content select=".riotmui-desc-description"></content> <yield></yield> </div>', '', 'role="toolbar"', function (opts) {
	  this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(37);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(37, function() {
				var newContent = __webpack_require__(37);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "riotmui-desc > .content {\n  padding: 0 20px; }\n  riotmui-desc > .content > .title {\n    padding: 50px 0 20px 0;\n    font-size: 28px;\n    color: #1c3b53; }\n    riotmui-desc > .content > .title.first {\n      padding: 20px 0; }\n  riotmui-desc > .content material-card {\n    margin-top: 20px;\n    position: relative; }\n    riotmui-desc > .content material-card:first-child {\n      margin-top: 0; }\n    riotmui-desc > .content material-card .title {\n      padding: 10px 20px;\n      font-size: 18px;\n      color: #61bdcc;\n      box-shadow: none; }\n    riotmui-desc > .content material-card .material-card-content {\n      padding: 10px 20px 20px 20px; }\n      riotmui-desc > .content material-card .material-card-content .button-container {\n        display: inline-block;\n        position: relative; }\n        riotmui-desc > .content material-card .material-card-content .button-container material-dropdown p {\n          padding: 20px 51px; }\n  riotmui-desc > .content .riotmui-desc-description p {\n    display: block;\n    padding: 5px 5px; }\n  riotmui-desc > .content .riotmui-desc-description .description-title {\n    padding: 30px 0px 15px 0;\n    font-size: 20px;\n    color: #61bdcc;\n    box-shadow: none; }\n\n@media only screen and (min-width: 768px) and (max-width: 1024px) {\n  riotmui-desc > .content {\n    padding: 0 5px; }\n    riotmui-desc > .content .col-flex {\n      margin-top: 20px; }\n      riotmui-desc > .content .col-flex:first-child {\n        margin-top: 0px; } }\n\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  riotmui-desc > .content {\n    padding: 0 5px; }\n    riotmui-desc > .content .col-flex {\n      margin-top: 20px; }\n      riotmui-desc > .content .col-flex:first-child {\n        margin-top: 0px; } }\n\n@media only screen and (min-width: 480px) and (max-width: 768px) {\n  riotmui-desc > .content .col-flex {\n    margin-top: 20px; }\n    riotmui-desc > .content .col-flex:first-child {\n      margin-top: 0px; } }\n", ""]);

	// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(39);
	__webpack_require__(15);
	riot.tag2('material-card', '<div class="title" if="{{titleExist}}"> <content select=".material-card-title"></content> </div> <yield></yield>', '', '', function (opts) {
	    var _this = this;

	    this.titleExist = false;
	    this.on('mount', function () {
	        _this.update({ titleExist: !!_this.root.querySelector('.material-card-title') });
	    });
	    this.mixin('content');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(40);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(40, function() {
				var newContent = __webpack_require__(40);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "material-card {\n  display: block;\n  background-color: #fff;\n  margin: 0;\n  overflow-y: auto;\n  will-change: width, height;\n  -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -ms-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  -o-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  transform: translateY(0px);\n  opacity: 1;\n  -webkit-transition: transform .2s ease-in,opacity .2s;\n  -ms-transition: transform .2s ease-in,opacity .2s;\n  -moz-transition: transform .2s ease-in,opacity .2s;\n  -o-transition: transform .2s ease-in,opacity .2s;\n  transition: transform .2s ease-in,opacity .2s; }\n  material-card .title {\n    padding: 20px 10px;\n    font-size: 22px;\n    color: #25313b;\n    -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    -ms-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    -moz-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    -o-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02);\n    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 7px 0 rgba(0, 0, 0, 0.02); }\n  material-card .material-card-content {\n    padding: 20px; }\n", ""]);

	// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(42);
	__webpack_require__(44);
	__webpack_require__(46);
	__webpack_require__(47);
	riot.tag2('riotmui-code', '<pre>\n        <code data-language="html">\n            {{opts.code}}\n        </code>\n    </pre>', '', '', function (opts) {
	  Rainbow.color();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(43);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(43, function() {
				var newContent = __webpack_require__(43);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "riotmui-code {\n  display: block;\n  background: #f5f5f5; }\n  riotmui-code pre {\n    margin: 0; }\n", ""]);

	// exports


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(45);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(45, function() {
				var newContent = __webpack_require__(45);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "/**\n * GitHub theme\n *\n * @author Craig Campbell\n * @version 1.0.4\n */\npre {\n  word-wrap: break-word;\n  padding: 6px 10px;\n  line-height: 19px;\n  overflow-wrap: inherit;\n  overflow-x: scroll; }\n\ncode {\n  padding: 0px 5px;\n  font-size: 18px; }\n\npre code {\n  border: 0px;\n  padding: 0px;\n  margin: 0px;\n  -moz-border-radius: 0px;\n  -webkit-border-radius: 0px;\n  border-radius: 0px; }\n\npre, code {\n  font-family: Consolas, 'Liberation Mono', Courier, monospace;\n  color: #333;\n  background: #f8f8f8;\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n  border-radius: 3px; }\n\npre, pre code {\n  font-size: 15px; }\n\npre .comment {\n  color: #998; }\n\npre .support {\n  color: #0086B3; }\n\npre .tag, pre .tag-name {\n  color: navy; }\n\npre .keyword, pre .css-property, pre .vendor-prefix, pre .sass, pre .class, pre .id, pre .css-value, pre .entity.function, pre .storage.function {\n  font-weight: bold; }\n\npre .css-property, pre .css-value, pre .vendor-prefix, pre .support.namespace {\n  color: #333; }\n\npre .constant.numeric, pre .keyword.unit, pre .hex-color {\n  font-weight: normal;\n  color: #099; }\n\npre .entity.class {\n  color: #458; }\n\npre .entity.id, pre .entity.function {\n  color: #900; }\n\npre .attribute, pre .variable {\n  color: teal; }\n\npre .string, pre .support.value {\n  font-weight: normal;\n  color: #d14; }\n\npre .regexp {\n  color: #009926; }\n", ""]);

	// exports


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	/* Rainbow v1.1.9 rainbowco.de */
	"use strict";

	window.Rainbow = (function () {
	    function q(a) {
	        var b,
	            c = a.getAttribute && a.getAttribute("data-language") || 0;if (!c) {
	            a = a.attributes;for (b = 0; b < a.length; ++b) if ("data-language" === a[b].nodeName) return a[b].nodeValue;
	        }return c;
	    }function B(a) {
	        var b = q(a) || q(a.parentNode);if (!b) {
	            var c = /\blang(?:uage)?-(\w+)/;(a = a.className.match(c) || a.parentNode.className.match(c)) && (b = a[1]);
	        }return b;
	    }function C(a, b) {
	        for (var c in e[d]) {
	            c = parseInt(c, 10);if (a == c && b == e[d][c] ? 0 : a <= c && b >= e[d][c]) delete e[d][c], delete j[d][c];if (a >= c && a < e[d][c] || b > c && b < e[d][c]) return !0;
	        }return !1;
	    }function r(a, b) {
	        return '<span class="' + a.replace(/\./g, " ") + (l ? " " + l : "") + '">' + b + "</span>";
	    }function s(a, b, c, h) {
	        var f = a.exec(c);if (f) {
	            ++t;!b.name && "string" == typeof b.matches[0] && (b.name = b.matches[0], delete b.matches[0]);var k = f[0],
	                i = f.index,
	                u = f[0].length + i,
	                g = function g() {
	                function f() {
	                    s(a, b, c, h);
	                }t % 100 > 0 ? f() : setTimeout(f, 0);
	            };if (C(i, u)) g();else {
	                var m = v(b.matches),
	                    l = function l(a, c, h) {
	                    if (a >= c.length) h(k);else {
	                        var d = f[c[a]];if (d) {
	                            var e = b.matches[c[a]],
	                                i = e.language,
	                                g = e.name && e.matches ? e.matches : e,
	                                j = function j(b, d, e) {
	                                var i;i = 0;var g;for (g = 1; g < c[a]; ++g) f[g] && (i = i + f[g].length);d = e ? r(e, d) : d;k = k.substr(0, i) + k.substr(i).replace(b, d);l(++a, c, h);
	                            };i ? n(d, i, function (a) {
	                                j(d, a);
	                            }) : typeof e === "string" ? j(d, d, e) : w(d, g.length ? g : [g], function (a) {
	                                j(d, a, e.matches ? e.name : 0);
	                            });
	                        } else l(++a, c, h);
	                    }
	                };l(0, m, function (a) {
	                    b.name && (a = r(b.name, a));if (!j[d]) {
	                        j[d] = {};e[d] = {};
	                    }j[d][i] = { replace: f[0], "with": a };e[d][i] = u;g();
	                });
	            }
	        } else h();
	    }function v(a) {
	        var b = [],
	            c;for (c in a) a.hasOwnProperty(c) && b.push(c);return b.sort(function (a, b) {
	            return b - a;
	        });
	    }function w(a, b, c) {
	        function h(b, k) {
	            k < b.length ? s(b[k].pattern, b[k], a, function () {
	                h(b, ++k);
	            }) : D(a, function (a) {
	                delete j[d];delete e[d];--d;c(a);
	            });
	        }++d;h(b, 0);
	    }function D(a, b) {
	        function c(a, b, h, e) {
	            if (h < b.length) {
	                ++x;var g = b[h],
	                    l = j[d][g],
	                    a = a.substr(0, g) + a.substr(g).replace(l.replace, l["with"]),
	                    g = function g() {
	                    c(a, b, ++h, e);
	                };0 < x % 250 ? g() : setTimeout(g, 0);
	            } else e(a);
	        }var h = v(j[d]);c(a, h, 0, b);
	    }function n(a, b, c) {
	        var d = m[b] || [],
	            f = m[y] || [],
	            b = z[b] ? d : d.concat(f);w(a.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&(?![\w\#]+;)/g, "&amp;"), b, c);
	    }function o(_x, _x2, _x3) {
	        var _again = true;

	        _function: while (_again) {
	            var a = _x,
	                b = _x2,
	                c = _x3;
	            _again = false;
	            if (b < a.length) {
	                var d = a[b],
	                    f = B(d);if (!(-1 < (" " + d.className + " ").indexOf(" rainbow ")) && f) {
	                    return f = f.toLowerCase(), d.className += d.className ? " rainbow" : "rainbow", n(d.innerHTML, f, function (k) {
	                        d.innerHTML = k;j = {};e = {};p && p(d, f);setTimeout(function () {
	                            o(a, ++b, c);
	                        }, 0);
	                    });
	                } else {
	                    _x = a;
	                    _x2 = ++b;
	                    _x3 = c;
	                    _again = true;
	                    d = f = undefined;
	                    continue _function;
	                }
	            }c && c();
	        }
	    }function A(a, b) {
	        var a = a && "function" == typeof a.getElementsByTagName ? a : document,
	            c = a.getElementsByTagName("pre"),
	            d = a.getElementsByTagName("code"),
	            f,
	            e = [];for (f = 0; f < d.length; ++f) e.push(d[f]);for (f = 0; f < c.length; ++f) c[f].getElementsByTagName("code").length || e.push(c[f]);o(e, 0, b);
	    }var j = {},
	        e = {},
	        m = {},
	        z = {},
	        d = 0,
	        y = 0,
	        t = 0,
	        x = 0,
	        l,
	        p;return { extend: function extend(a, b, c) {
	            1 == arguments.length && (b = a, a = y);z[a] = c;m[a] = b.concat(m[a] || []);
	        }, b: function b(a) {
	            p = a;
	        }, a: function a(_a) {
	            l = _a;
	        }, color: function color(a, b, c) {
	            if ("string" == typeof a) return n(a, b, c);if ("function" == typeof a) return A(0, a);A(a, b);
	        } };
	})();document.addEventListener ? document.addEventListener("DOMContentLoaded", Rainbow.color, !1) : window.attachEvent("onload", Rainbow.color);
	Rainbow.onHighlight = Rainbow.b;Rainbow.addClass = Rainbow.a;

/***/ }),
/* 47 */
/***/ (function(module, exports) {

	/**
	 * HTML patterns
	 *
	 * @author Craig Campbell
	 * @version 1.0.9
	 */
	'use strict';

	Rainbow.extend('html', [{
	    'name': 'source.php.embedded',
	    'matches': {
	        2: {
	            'language': 'php'
	        }
	    },
	    'pattern': /&lt;\?=?(?!xml)(php)?([\s\S]*?)(\?&gt;)/gm
	}, {
	    'name': 'source.css.embedded',
	    'matches': {
	        1: {
	            'matches': {
	                1: 'support.tag.style',
	                2: [{
	                    'name': 'entity.tag.style',
	                    'pattern': /^style/g
	                }, {
	                    'name': 'string',
	                    'pattern': /('|")(.*?)(\1)/g
	                }, {
	                    'name': 'entity.tag.style.attribute',
	                    'pattern': /(\w+)/g
	                }],
	                3: 'support.tag.style'
	            },
	            'pattern': /(&lt;\/?)(style.*?)(&gt;)/g
	        },
	        2: {
	            'language': 'css'
	        },
	        3: 'support.tag.style',
	        4: 'entity.tag.style',
	        5: 'support.tag.style'
	    },
	    'pattern': /(&lt;style.*?&gt;)([\s\S]*?)(&lt;\/)(style)(&gt;)/gm
	}, {
	    'name': 'source.js.embedded',
	    'matches': {
	        1: {
	            'matches': {
	                1: 'support.tag.script',
	                2: [{
	                    'name': 'entity.tag.script',
	                    'pattern': /^script/g
	                }, {
	                    'name': 'string',
	                    'pattern': /('|")(.*?)(\1)/g
	                }, {
	                    'name': 'entity.tag.script.attribute',
	                    'pattern': /(\w+)/g
	                }],
	                3: 'support.tag.script'
	            },
	            'pattern': /(&lt;\/?)(script.*?)(&gt;)/g
	        },
	        2: {
	            'language': 'javascript'
	        },
	        3: 'support.tag.script',
	        4: 'entity.tag.script',
	        5: 'support.tag.script'
	    },
	    'pattern': /(&lt;script(?! src).*?&gt;)([\s\S]*?)(&lt;\/)(script)(&gt;)/gm
	}, {
	    'name': 'comment.html',
	    'pattern': /&lt;\!--[\S\s]*?--&gt;/g
	}, {
	    'matches': {
	        1: 'support.tag.open',
	        2: 'support.tag.close'
	    },
	    'pattern': /(&lt;)|(\/?\??&gt;)/g
	}, {
	    'name': 'support.tag',
	    'matches': {
	        1: 'support.tag',
	        2: 'support.tag.special',
	        3: 'support.tag-name'
	    },
	    'pattern': /(&lt;\??)(\/|\!?)(\w+)/g
	}, {
	    'matches': {
	        1: 'support.attribute'
	    },
	    'pattern': /([a-z-]+)(?=\=)/gi
	}, {
	    'matches': {
	        1: 'support.operator',
	        2: 'string.quote',
	        3: 'string.value',
	        4: 'string.quote'
	    },
	    'pattern': /(=)('|")(.*?)(\2)/g
	}, {
	    'matches': {
	        1: 'support.operator',
	        2: 'support.value'
	    },
	    'pattern': /(=)([a-zA-Z\-0-9]*)\b/g
	}, {
	    'matches': {
	        1: 'support.attribute'
	    },
	    'pattern': /\s(\w+)(?=\s|&gt;)(?![\s\S]*&lt;)/g
	}], true);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(49);
	riot.tag2('riotmui-option', '<div class="option row" each="{{option,key in opts.data}}"> <div class="option-title col-lg-3 col-md-3 col-sm-6 col-xs-6">{{option.title}}</div> <div class="option-desc col-lg-9 col-md-9 col-sm-6 col-xs-6"> <p> <span class="type">{{option.type}}</span> <span class="default">{{option.default}}</span> </p> <p> {{option.desc}} </p> </div> </div>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(50);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(50, function() {
				var newContent = __webpack_require__(50);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "riotmui-option .option {\n  padding: 10px 0; }\n  riotmui-option .option-title {\n    font-weight: 700; }\n  riotmui-option .option .type {\n    color: #8d9899; }\n  riotmui-option .option .default {\n    color: #414546;\n    margin-left: 20px; }\n", ""]);

	// exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(35);
	__webpack_require__(41);
	__webpack_require__(48);
	__webpack_require__(38);

	__webpack_require__(9);
	riot.tag2('navbar', '<riotmui-desc> <div class="riotmui-desc-examples row"> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Default Navbar</div> <div class="material-card-content"> <material-navbar> <div class="logo"><a href="#">Logo</a></div> </material-navbar> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example1}}"></riotmui-code> </material-card> </div> <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-flex"> <material-card> <div class="material-card-title">Custom styling</div> <div class="material-card-content"> <material-navbar style="background: #ccc;"> <div class="logo"><a href="#">Logo</a></div> </material-navbar> </div> <riotmui-code style="margin-top: 46px" code="{{this.parent.parent.example2}}"></riotmui-code> </material-card> </div> </div> <div class="riotmui-desc-description"> <p> Material Navbar can be used like a header or some another ui element of your web page. </p> <div class="description-title" if="{{this.parent.children}}">Children</div> <riotmui-option data="{{this.parent.children}}"></riotmui-option> <div class="description-title" if="{{this.parent.options}}">Options</div> <riotmui-option data="{{this.parent.options}}"></riotmui-option> <div class="description-title" if="{{this.parent.methods}}">Methods,Listeners and Properties</div> <riotmui-option data="{{this.parent.methods}}"></riotmui-option> </div> </riotmui-desc>', '', '', function (opts) {

	    this.example1 = '<material-navbar>\n        <div class="logo"><a href="#">Logo</a></div>\n  </material-navbar>';
	    this.example2 = '<material-navbar style="background: #ccc;" >\n      <div class="logo"><a href="#">Logo</a></div>\n  </material-navbar>';
	    this.children = [{
	        title: '<div class="logo">Logo</div>',
	        type: 'tag',
	        'default': '',
	        desc: 'Adds logotype element to material navbar.'
	    }];

	    this.options = [{
	        title: 'fixed',
	        type: 'string ["true"|"false"]',
	        'default': 'false',
	        desc: 'If set "true" will make navbar stuck to current position.'
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(53);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(53, function() {
				var newContent = __webpack_require__(53);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "html {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\n * Remove default margin.\n */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\n   ========================================================================== */\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\n   ========================================================================== */\n/**\n * Remove the gray background color from active links in IE 10.\n */\na {\n  background-color: transparent; }\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\n * Address styling not present in Safari and Chrome.\n */\ndfn {\n  font-style: italic; }\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\n * Address styling not present in IE 8/9.\n */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\nimg {\n  border: 0; }\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\nfigure {\n  margin: 1em 40px; }\n\n/**\n * Address differences between Firefox and other browsers.\n */\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0; }\n\n/**\n * Contain overflow in all browsers.\n */\npre {\n  overflow: auto; }\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\n   ========================================================================== */\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\nbutton {\n  overflow: visible; }\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\n/* 1 */\nhtml input[type=\"button\"],\nbutton,\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\n * Re-set default cursor for disabled elements.\n */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\ninput {\n  line-height: normal; }\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  /* 2 */\n  box-sizing: content-box; }\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * Define consistent border, margin, and padding.\n */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\ntextarea {\n  overflow: auto; }\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\n   ========================================================================== */\n/**\n * Remove most spacing between table cells.\n */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\nhome-layout material-navbar {\n  height: 310px; }\n\nbuttons {\n  margin: 20px; }\n\ncheckbox {\n  margin: 20px; }\n\ncombobox {\n  margin: 20px; }\n\nmaterial-navbar .nav-wrapper .logo {\n  line-height: 33px; }\n\nbasic-layout {\n  background: rgba(0, 0, 0, 0.5); }\n\nbasic-layout > .content route {\n  width: 100%;\n  /*height: 100%;*/\n  background: rgba(0, 0, 0, 0.5); }\n\nmaterial-navbar .nav-wrapper {\n  background: rgba(0, 0, 0, 0.5); }\n\nbasic-layout > .content riotmui-list {\n  display: none; }\n\nbasic-layout > .content .left {\n  display: none; }\n\nhome-layout {\n  display: none; }\n", ""]);

	// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(55);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(55, function() {
				var newContent = __webpack_require__(55);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "/**\n * Flex Grid -\n * Version: 0.2.1\n *\n * Simple grid built with flex box and sass.\n *\n * Matthew Simo - matthew.a.simo@gmail.com\n */\n/**\n * Grid setup\n *\n * The grid will calculate dimensions based on these two variables\n * $fg-columns will inform the grid loops how many columns there should be.\n * $fg-gutter will inform the grid loops how big eac column's gutters should be.\n */\n/**\n * Break point namespace object\n *\n * Set the default namespace object with these defaults with the\n * understanding that you can pass in whatever you might require for your site.\n *\n * $fg-breakpoints is a Sass list with nested lists inside. Each sub list defines two things.\n * 1. The namespace for that breakpoint. (Required) (i.e. xs, sm, md, lg)\n * 2. The min-width measurement for the breakpoint for that namespace. (i.e. 48em, 62em, 75em)\n *\n * Note: These should be in the proper order (at least till libsass handles map keys properly).\n *\n * Note: If the measurement is left out then it will be skipped when generating\n * the grid and applied to global styles.\n *\n */\n/**\n * Calculate column size percentage\n */\n/**\n * Spacing mixin to create uniform margin/padding\n */\n/**\n * Row wrapper class, flex box parent.\n */\n.row {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  margin-left: -0.5rem;\n  margin-right: -0.5rem; }\n\n.col-xs, .col-sm, .col-md, .col-lg, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 0;\n  flex-shrink: 0;\n  padding-left: 0.5rem;\n  padding-right: 0.5rem; }\n\n.col-xs, .col-sm, .col-md, .col-lg {\n  flex-grow: 1;\n  flex-basis: 0;\n  max-width: 100%; }\n\n/**\n * Generate a set of grid column classes using a namespace\n *\n * .col-[namespace] for intelligent column division\n * .col-[namespace]-[number] for a column that covers a specific number of columns (e.g. 1-12 by default)\n * .off-[namespace]-[number] for pushing a col a specific number of columns (e.g. 1-11 by default)\n */\n/**\n * Build the grid in two steps, to help minimize file size\n * Step 1, for each namespace, create the grid-base\n * Step 2, for each namespace, wrap the col width/offset measurements in their breakpoint media query\n */\n.off-xs-1 {\n  margin-left: 8.33333%; }\n\n.off-xs-2 {\n  margin-left: 16.66667%; }\n\n.off-xs-3 {\n  margin-left: 25%; }\n\n.off-xs-4 {\n  margin-left: 33.33333%; }\n\n.off-xs-5 {\n  margin-left: 41.66667%; }\n\n.off-xs-6 {\n  margin-left: 50%; }\n\n.off-xs-7 {\n  margin-left: 58.33333%; }\n\n.off-xs-8 {\n  margin-left: 66.66667%; }\n\n.off-xs-9 {\n  margin-left: 75%; }\n\n.off-xs-10 {\n  margin-left: 83.33333%; }\n\n.off-xs-11 {\n  margin-left: 91.66667%; }\n\n@media only screen and (min-width: 768px) {\n  .off-sm-1 {\n    margin-left: 8.33333%; }\n  .off-sm-2 {\n    margin-left: 16.66667%; }\n  .off-sm-3 {\n    margin-left: 25%; }\n  .off-sm-4 {\n    margin-left: 33.33333%; }\n  .off-sm-5 {\n    margin-left: 41.66667%; }\n  .off-sm-6 {\n    margin-left: 50%; }\n  .off-sm-7 {\n    margin-left: 58.33333%; }\n  .off-sm-8 {\n    margin-left: 66.66667%; }\n  .off-sm-9 {\n    margin-left: 75%; }\n  .off-sm-10 {\n    margin-left: 83.33333%; }\n  .off-sm-11 {\n    margin-left: 91.66667%; } }\n\n@media only screen and (min-width: 992px) {\n  .off-md-1 {\n    margin-left: 8.33333%; }\n  .off-md-2 {\n    margin-left: 16.66667%; }\n  .off-md-3 {\n    margin-left: 25%; }\n  .off-md-4 {\n    margin-left: 33.33333%; }\n  .off-md-5 {\n    margin-left: 41.66667%; }\n  .off-md-6 {\n    margin-left: 50%; }\n  .off-md-7 {\n    margin-left: 58.33333%; }\n  .off-md-8 {\n    margin-left: 66.66667%; }\n  .off-md-9 {\n    margin-left: 75%; }\n  .off-md-10 {\n    margin-left: 83.33333%; }\n  .off-md-11 {\n    margin-left: 91.66667%; } }\n\n@media only screen and (min-width: 1200px) {\n  .off-lg-1 {\n    margin-left: 8.33333%; }\n  .off-lg-2 {\n    margin-left: 16.66667%; }\n  .off-lg-3 {\n    margin-left: 25%; }\n  .off-lg-4 {\n    margin-left: 33.33333%; }\n  .off-lg-5 {\n    margin-left: 41.66667%; }\n  .off-lg-6 {\n    margin-left: 50%; }\n  .off-lg-7 {\n    margin-left: 58.33333%; }\n  .off-lg-8 {\n    margin-left: 66.66667%; }\n  .off-lg-9 {\n    margin-left: 75%; }\n  .off-lg-10 {\n    margin-left: 83.33333%; }\n  .off-lg-11 {\n    margin-left: 91.66667%; } }\n\n@media (min-width: 1200px) {\n  .col-lg-10 {\n    width: 100%; } }\n\n@media (min-width: 992px) {\n  .col-md-10 {\n    width: 100%; } }\n", ""]);

	// exports


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(57);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(57, function() {
				var newContent = __webpack_require__(57);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "/*\n\nOriginal style from softwaremaniacs.org (c) Ivan Sagalaev <Maniac@SoftwareManiacs.Org>\n\n*/\n.hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  background: #f0f0f0;\n  -webkit-text-size-adjust: none; }\n\n.hljs,\n.hljs-subst,\n.hljs-tag .hljs-title,\n.nginx .hljs-title {\n  color: black; }\n\n.hljs-string,\n.hljs-title,\n.hljs-constant,\n.hljs-parent,\n.hljs-tag .hljs-value,\n.hljs-rule .hljs-value,\n.hljs-preprocessor,\n.hljs-pragma,\n.hljs-name,\n.haml .hljs-symbol,\n.ruby .hljs-symbol,\n.ruby .hljs-symbol .hljs-string,\n.hljs-template_tag,\n.django .hljs-variable,\n.smalltalk .hljs-class,\n.hljs-addition,\n.hljs-flow,\n.hljs-stream,\n.bash .hljs-variable,\n.pf .hljs-variable,\n.apache .hljs-tag,\n.apache .hljs-cbracket,\n.tex .hljs-command,\n.tex .hljs-special,\n.erlang_repl .hljs-function_or_atom,\n.asciidoc .hljs-header,\n.markdown .hljs-header,\n.coffeescript .hljs-attribute,\n.tp .hljs-variable {\n  color: #800; }\n\n.smartquote,\n.hljs-comment,\n.hljs-annotation,\n.diff .hljs-header,\n.hljs-chunk,\n.asciidoc .hljs-blockquote,\n.markdown .hljs-blockquote {\n  color: #888; }\n\n.hljs-number,\n.hljs-date,\n.hljs-regexp,\n.hljs-literal,\n.hljs-hexcolor,\n.smalltalk .hljs-symbol,\n.smalltalk .hljs-char,\n.go .hljs-constant,\n.hljs-change,\n.lasso .hljs-variable,\n.makefile .hljs-variable,\n.asciidoc .hljs-bullet,\n.markdown .hljs-bullet,\n.asciidoc .hljs-link_url,\n.markdown .hljs-link_url {\n  color: #080; }\n\n.hljs-label,\n.ruby .hljs-string,\n.hljs-decorator,\n.hljs-filter .hljs-argument,\n.hljs-localvars,\n.hljs-array,\n.hljs-attr_selector,\n.hljs-important,\n.hljs-pseudo,\n.hljs-pi,\n.haml .hljs-bullet,\n.hljs-doctype,\n.hljs-deletion,\n.hljs-envvar,\n.hljs-shebang,\n.apache .hljs-sqbracket,\n.nginx .hljs-built_in,\n.tex .hljs-formula,\n.erlang_repl .hljs-reserved,\n.hljs-prompt,\n.asciidoc .hljs-link_label,\n.markdown .hljs-link_label,\n.vhdl .hljs-attribute,\n.clojure .hljs-attribute,\n.asciidoc .hljs-attribute,\n.lasso .hljs-attribute,\n.coffeescript .hljs-property,\n.hljs-phony {\n  color: #88f; }\n\n.hljs-keyword,\n.hljs-id,\n.hljs-title,\n.hljs-built_in,\n.css .hljs-tag,\n.hljs-doctag,\n.smalltalk .hljs-class,\n.hljs-winutils,\n.bash .hljs-variable,\n.pf .hljs-variable,\n.apache .hljs-tag,\n.hljs-type,\n.hljs-typename,\n.tex .hljs-command,\n.asciidoc .hljs-strong,\n.markdown .hljs-strong,\n.hljs-request,\n.hljs-status,\n.tp .hljs-data,\n.tp .hljs-io {\n  font-weight: bold; }\n\n.asciidoc .hljs-emphasis,\n.markdown .hljs-emphasis,\n.tp .hljs-units {\n  font-style: italic; }\n\n.nginx .hljs-built_in {\n  font-weight: normal; }\n\n.coffeescript .javascript,\n.javascript .xml,\n.lasso .markup,\n.tex .hljs-formula,\n.xml .javascript,\n.xml .vbscript,\n.xml .css,\n.xml .hljs-cdata {\n  opacity: 0.5; }\n", ""]);

	// exports


/***/ })
/******/ ]);
