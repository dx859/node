var url = require('url');

var urlStr = 'http://user:pass@host.com:80/resource/path/?query=string#hash';

var urlObj = url.parse(urlStr, true, false);
var urlString = url.format(urlObj);

/*
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'user:pass',
  host: 'host.com:80',
  port: '80',
  hostname: 'host.com',
  hash: '#hash',
  search: '?query=string',
  query: { query: 'string' },
  pathname: '/resource/path/',
  path: '/resource/path/?query=string',
  href: 'http://user:pass@host.com:80/resource/path/?query=string#hash' }
 */
console.log(urlString);
console.log(urlObj);

//url.resolve(from, to)
var url = require('url');
var originalUrl = 'http://user:pass@host.com:80/resource/path?query=string#hash';
var newResource = '/another/path?querynew';
console.log(url.resolve(originalUrl, newResource)); // http://user:pass@host.com:80/another/path?querynew
