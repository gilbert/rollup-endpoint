var assert  = require('assert');
var request = require('supertest');
var app     = require('./server.js');


describe('Middleware response', function () {

  it("serves a bundled css file", function (done) {

    request(app)
      .get('/assets/app-bundle.js')
      .expect(200)
      .expect('Content-Type', /text\/javascript/)
      .end(function(err, response) {
        if (err) throw err;
        assert.ok(response.text.match(/foo\(bar\)/), "The main file should be served");
        assert.ok(
          response.text.match(/function foo/) && response.text.match(/bar/),
          "All imported files should be included");

        assert.ok(response.text.match(/return x\+2/), "Executes plugins");
        done()
      });
  })
});
