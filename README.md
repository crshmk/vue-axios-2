Vue-Axios-2
---
One-liner http requests

This Vue plugin wraps [Axios](https://www.npmjs.com/package/axios) and exposes the following methods on a Vue instance:
```javascript
this.$get()
this.$post()
this.$put()
this.$delete()
```

### Examples

```javascript
data: function() {
    return {
      books: []
    };
  },
  methods: {
    setBooks: function(res) {
      this.books = res.data;
    },
    err: function(res) {
      // handle the error
    },
    createBook: function(title) {
      this.$post('products/books', this.setBooks, {name: title}, this.err);
    },
    updateBook: function(newTitle) {
      this.$put(
        'products/books/42',
        this.setBooks,
        {newName: newTitle},
        this.err
      );
    },
    deleteBook: function(id) {
      this.$delete('products/books/' + id, this.setBooks)
    }
  },
  created: function() {
    this.$get('path/to/img');
    this.$get('products/books', this.setBooks);
  }
  ```

### Install
`main.js`

```javascript
var http = require('vue-axios-2');

Vue.use(http);
```

### Method Signatures

Each method takes the following signature:
```javascript
(route, successCallback, data, errorCallback)
```
type | description | required
--- | --- | ---
string | route | yes
function | success callback | no
object | POST/PUT payload or GET/DELETE query params | no
function | http error callback | no

### Callbacks
Success and error callbacks are unary functions that are handed the response object from an Axios request. Success callbacks are executed in `then()`; error callbacks in `catch()`. The schema for the response object handed to the callbacks may be found [here](https://www.npmjs.com/package/axios#response-schema).


It's normally best for callbacks to refer to component methods.
```javascript
data: function() {
  return {
    chairs: []
  };
},
methods: {
  setResponse: function(res) {
    this.chairs = res.data;
  }
},
created: function() {
  this.$get('products/chairs', this.setChairs);
}
```

### Sending Data
The third parameter passes an object to be parsed as a query string for GET and DELETE requests, and an object to be parsed as the payload for POST and PUT requests.

To add query parameters to POST and PUT requests, put them in the route string.
```javascript
this.$put('products/chairs/42?auth=123', this.cb, {name: 'new name'});
```

### Options
Three options are available when installing as `Vue.use(http, options)`
- `baseURL`: a string to be prepended to every route requested, e.g. `/api/`
- `success`: a default function for successful requests that execute then()
- `err`: a default function for requests with errors

```javascript
var http = require('vue-axios-2');

var log = res => { console.log(res) };

let options = {
  baseURL: '/api/',
  success: log,
  err: log
};

Vue.use(http, options);
```

## Etc

The Axios object is also set on the Vue instance, available as
```javascript
this.$axios()
```
