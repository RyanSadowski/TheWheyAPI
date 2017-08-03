process.env.NODE_ENV = 'test';

var server      = require('../server');
var chai        = require('chai');
var chaiHttp    = require('chai-http');
var should      = chai.should();

chai.use(chaiHttp);

var token = '';
var id = '';


describe('Home Routes', () => {

  //   it('should authenticate test user', (done) => {
  //   chai.request(server)
  //   .post('/user/auth')
  //   .set('content-type', 'application/json')
  //   .send({  "username":"CheryTr33Cutr",  "password":"********"})
  //   .end((err, res) => {
  //     res.should.have.status(201);
  //     res.body.should.be.a('object');
  //     res.body.should.have.property('success').eql(true);
  //     token = res.body.token;
  //     id = res.body.id;
  //     done();
  //   });
  // });

  // it('it should Get all the Home Screen info', (done) => {
  //   chai.request(server)
  //     .post('/home/')
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       res.body.should.be.a('object');
  //       // res.body.should.have.property('success');
  //       done();
  //     });
  // });


});
