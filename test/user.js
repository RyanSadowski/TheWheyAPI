process.env.NODE_ENV = 'test';

var server      = require('../server');
var chai        = require('chai');
var chaiHttp    = require('chai-http');
var should      = chai.should();

chai.use(chaiHttp);

describe('/GET ALL USERS', () => {
  it('it should Get all users', (done) => {
    chai.request(server)
      .get('/user/all')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('all users');
        res.body.should.have.property('body');
        done();
      });
  });
});
