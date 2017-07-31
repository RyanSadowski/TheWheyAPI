process.env.NODE_ENV = 'test';

var server      = require('../server');
var chai        = require('chai');
var chaiHttp    = require('chai-http');
var should      = chai.should();

chai.use(chaiHttp);

describe('Home Routes', () => {
  it('it should Get all the Home Screen info', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
