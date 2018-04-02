var axios = require('axios');

var isFn = function(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
}

var log = function(m) {
  console.log(m);
};

var opts = {
  baseURL: undefined,
  success: log,
  err: log
};

/**
 * Schema for the GET and DELETE params
 */
var GetDeleteConfig = function(queryParams) {

  this.params = {};
  this.params.params = queryParams || {};

}

var request = function(route, success, data, err, type) {

  if (success != null && !isFn(success)) {
    throw new TypeError('Success callback (argument 2) must be a function.');
  }

  if (err != null && !isFn(err)) {
    throw new TypeError('Error callback (argument 4) must be a function.');
  }

  /**
   * Axios has different signatures for GET/DELETE and POST/PUT, respectively
   */
  var getDelete = type === 'get' || type === 'delete';

  /**
   * Check for passed callbacks
   * If none, use defaults
   */
  var cb = success || opts.success;
  var errCb = err || opts.err;

  /**
   * If GET/DELETE, create appropriate schema for query params
   * If POST/PUT, pass the payload
   */
  var requestData = getDelete ? new GetDeleteConfig(data) : data;

  axios[type](route, requestData)
    .then(function(res) {
      cb(res);
    })
    .catch(function(err) {
      errCb(err);
    });

}


exports.install = function(Vue, options) {

  if (options != null) {
    Object.keys(options).forEach(function(k) {
      opts[k] = options[k];
    });
  }

  axios.defaults.baseURL = opts.baseURL;

  Vue.prototype.$get = function(path, cb, data, errCb) {
    request(path, cb, data, errCb, 'get');
  }
  Vue.prototype.$post = function(path, cb, data, errCb) {
    request(path, cb, data, errCb, 'post');
  }
  Vue.prototype.$put = function(path, cb, data, errCb) {
    request(path, cb, data, errCb, 'put');
  }
  Vue.prototype.$delete = function(path, cb, data, errCb) {
    request(path, cb, data, errCb, 'delete');
  }
  Vue.prototype.$axios = axios;
}
