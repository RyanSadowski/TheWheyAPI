process.env.NODE_ENV = 'test';

var server      = require('../server');
var userTests   = require('./user');
var serverTests = require('./server');
var chai        = require('chai');
var chaiHttp    = require('chai-http');
var should      = chai.should();

chai.use(chaiHttp);

var token = '';
var id = '';

describe('/LIFTS', () =>{
  it('should authenticate test user', (done) => {
    chai.request(server)
    .post('/user/auth')
    .set('content-type', 'application/json')
    .send({  "username":"CheryTr33Cutr",  "password":"********"})
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      token = res.body.token;
      id = res.body.id;
      done();
    });
  });

  it('should Get the lifts', (done) => {
    chai.request(server)
    .post('/lifts/all')
    .set('content-type', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('all lifts');
      res.body.should.have.property('success').eql(true);
      done();
    });
  });

  it('should Get the workout types', (done) => {
    chai.request(server)
    .post('/lifts/workouttypes')
    .set('content-type', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('all workouts');
      res.body.should.have.property('success').eql(true);
      done();
    });
  });

  it('should post a workout for test user', (done) => {
    chai.request(server)
    .put('/lifts/workout')
    .set('content-type', 'application/json')
    .set('x-access-token', token)
    .send({"type_id":5,"name":"test Workout","description":"I did a workout today, PR squat of 1000#",
    "lifts":[{"lift_id":1,"sets":3,"reps":8,"weight":135,"notes":"bench"}]})
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      done();
    });
  });
});
