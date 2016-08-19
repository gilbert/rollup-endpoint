var rollupEndpoint = require('../index.js');

var app = require('express')();

app.get('/assets/app-bundle.js', rollupEndpoint.serve({
  entry: __dirname + '/src/main.js',
  plugins: [ require('rollup-plugin-buble')() ]
}));

module.exports = app;

if (require.main === module) {

  app.get('/', function (req, res) {
    res.send(`
      <h1>Rollup Endpoint</h1>
      <div id="app"></div>
      <script src="/assets/app-bundle.js"></script>
    `)
  })

  app.listen(4040);
  console.log("Listening on port 4040");
}
