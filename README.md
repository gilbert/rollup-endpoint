# rollup-endpoint

Easily serve a JavaScript bundle – bundled with [rollup.js](http://rollupjs.org/) – from an express.js endpoint. No grunt/gulp, no build files, no required configuration – just pure data.

### Installation

    $ npm install rollup-endpoint --save

## Usage - Easy Version

Assuming you have the following directory structure:

```
client/
└── main.js

server.js
package.json
```

Then you can write the following as your `server.js`:

```javascript
// server.js
var rollup = require('rollup-endpoint');
var app  = require('express')();

app.get('/assets/app-bundle.js', rollup.serve({
  entry: __dirname + '/client/main.js'
}));

console.log("Listening on port 5555...");
app.listen(5555);
```

Then run `node server.js`.

Now any GET request to `localhost:5555/assets/app-bundle.js` will compile and rollup the JS file located at `./client/main.js`. Any `import` statements within `main.js` will be included in the final output, too.

## Advanced Usage

rollup-endpoint passes all your options along to rollup itself, so you can specify any option as described in the [rollup JavaScript API](https://github.com/rollup/rollup/wiki/JavaScript-API#rolluprollup-options-).

When the `NODE_ENV` environment variable is set to `production`, rollup-endpoint will automatically cache and gzip your bundle output.

### Plugins

Plugins are configured in the same way as [rollup's JavaScript API](https://github.com/rollup/rollup/wiki/JavaScript-API#plugins).

Here's a useful example. In production, you might want to transpile your code to ES5, as well as minify it. However, you probably don't want waste CPU cycles doing the same in development. Here's how you can do that:

```js
var rollupOptions = { entry: 'my-file.js' };

if ( process.env.NODE_ENV === 'production' ) {
  rollupOptions.plugins = [
    require('rollup-plugin-buble')(),
    require('rollup-plugin-uglify')(),
  ]
}

app.get('/app-bundle.js', rollup.serve(rollupOptions))
```

### Generate Options

If you need to configure the [rollup generate options](https://github.com/rollup/rollup/wiki/JavaScript-API#bundlegenerate-options-), you can pass them as `generateOptions`:

```js
app.get('/assets/app-bundle.js', rollup.serve({
  entry: __dirname + '/client/main.js',
  generateOptions: {
    format: 'amd',
    sourceMap: true, // defaults to `false` in production
  }
}));
```
