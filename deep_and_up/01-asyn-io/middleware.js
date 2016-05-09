'use strict';

/**
 * Module dependencies
 * @private
 */
var http = require('http');
var EventEmitter = require('events').EventEmitter;

/**
 * Module exports
 * @public
 */

/**
 * Module variables
 * @private
 */

var proto = {};

function createServer() {
  function app(req, res) { app.handle(req, res, next); }
  merge(app, proto);
  merge(app, EventEmitter.prototype);
  app.route = '/';
  app.stack = [];
  return app;
}

proto.use = function(route, fn) {
  var handle = fn;
  var path = route;

  // default route to '/'
  if (typeof route !== 'string') {
    handle = route;
    path = '/';
  }

  // wrap sub-apps
  if (typeof handle.handle === 'function') {
    var server = handle;
    server.route = path;
    handle = function(req, res, next) {
      server.handle(req, res, next);
    };
  }

  // wrap vanilla http.Servers
  if (handle instanceof http.Server) {
    handle = handle.listeners('request')[0];
  }

  // strip trailing slash
  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
  }

  this.stack.push({ route: path, handle: handle });

  return this;
};

proto.handle = function(req, res, out) {
  function next(err) {
    var layer = stack[index++];
    layer.handle(req, res, next);
  }
  next();
};

proto.listen = function() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};




function merge(a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
}
