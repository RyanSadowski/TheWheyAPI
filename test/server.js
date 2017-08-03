process.env.NODE_ENV = 'test';

var server      = require('../server');
var chai        = require('chai');
var chaiHttp    = require('chai-http');
var should      = chai.should();

chai.use(chaiHttp);

describe('Ping', () => {
  it('it should Get a status', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Server is up. Please see API documentation to use');
        done();
      });
  });
  it('it should see its own post data', (done) => {
    chai.request(server)
      .post('/')
      .set('content-type', 'application/json')
      .send({"random_data":"1234567asdfb"  })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('data');
        done();
      });
  });
});
