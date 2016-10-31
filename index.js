var rollup = require('rollup');
var fs = require('fs');
var nodeEnv = process.env.NODE_ENV || 'development';
var cacheResponse = require('./lib/cache-response');


exports.serve = function (options) {

  options = options || {};

  if ( ! options.entry ) {
    throw Error('[rollup-endpoint] Please specify an entry file.');
  }
  if ( ! fs.existsSync(options.entry) ) {
    throw Error('[rollup-endpoint] File does not exist: ' + options.entry);
  }

  //
  // generateOptions
  //
  var generateOptions = options.generateOptions || {};
  delete options.generateOptions

  generateOptions.format = generateOptions.format || 'iife';

  if ( generateOptions.sourceMap === undefined && nodeEnv === 'development' ) {
    generateOptions.sourceMap = true
  }

  //
  // Cache variables
  //
  var bundleCache = null; // Bundle cache is for incremental dev builds
  var hardCache = null;   // Hard cache is final output for production performance

  return function (req, res) {

    if ( hardCache && hardCache.then ) {
      // Code bundling is in progress; send response after it's done
      return hardCache.then(function (result) {
        result.send(req, res)
      })
    }
    else if (hardCache) {
      // Code has already been bundled. Send back cached response
      return hardCache.send(req, res)
    }

    // No hard cache at this point.
    // We're either in development, or the first build in production.
    options.cache = bundleCache;

    rollup.rollup(options)
      .then( function ( bundle ) {

        // Generate bundle + sourcemap
        var result = bundle.generate(generateOptions);

        if ( nodeEnv === 'production' ) {
          // minify, gzip, and cache

          // Temporarily assign hardCache to a promise to prevent
          // multiple responses triggering multiple bundle compiles
          hardCache = cacheResponse(result.code, {
            'Cache-Control': 'public, max-age=60',
            'Content-Type': 'text/javascript',
          })
            .then(function (result) {
              hardCache.send(req, res);
              // unwrap hardCache to avoid unnecessary ticks in future
              hardCache = result;
            })

          // Merge into promise pipeline to catch possible errors
          return hardCache
        }
        else {
          bundleCache = bundle;
          if ( req.query.sourceMap ) {
            res.send(result.map);
          }
          else {
            res.set('Content-Type', 'text/javascript');
            if ( generateOptions.sourceMap ) {
              res.set('X-SourceMap', req.originalUrl + '?sourceMap=1');
            }
            res.send(result.code);
          }
        }
      })
      .catch(function (err) {

        if ( nodeEnv === 'development' ) {
          // Inject error into page
          res.send( errorInjection(err) );
        }
        else {
          console.log('[rollup-endpoint]', err.message, err.stack)
          res.status(500).send(err.message);
        }
      });
  }
}

var errorInjection = function (syntaxError) {
  return `
    var file    = ${ JSON.stringify( syntaxError.id ) };
    var stack   = ${ JSON.stringify( syntaxError.stack.split('\n') ) };
    var snippet = ${ JSON.stringify( syntaxError.snippet ) };
    ${ fs.readFileSync(__dirname + '/lib/error-injection.js') }
  `
}
