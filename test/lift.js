process.env.NODE_ENV = 'test';

var server      = require('../server');
var chai        = require('chai');
var chaiHttp    = require('chai-http');
var should      = chai.should();

chai.use(chaiHttp);

var token = '';
var id = '';

describe('/AUTH USER', () =>{
  it('should authenticate test user', (done) => {
    chai.request(server)
    .post('/user/auth')
    .set('content-type', 'application/json')
    .send({  "username":"CheryTr33Cutr",  "password":"********"})
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      token = res.body.token;
      id = res.body.id;
      done();
    });
  });
});

describe('/GET LIFTS', () =>{
  it('should Get the lifts', (done) => {
    chai.request(server)
    .get('/lifts/all')
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
});

describe('/POST WORKOUT', () =>{
  it('should post a workout for test user', (done) => {
    console.log(token, " toek ", id , " id")
    chai.request(server)
    .post('/lifts/workout')
    .set('content-type', 'application/json')
    .set('x-access-token', token)
    .send({
      "type_id":5,
      "name":"test Workout",
      "description":"I did a workout today, PR squat of 1000#",
      "lifts":[
        {
          "lift_id":2,
          "sets":3,
          "reps":8,
          "weight":1000,
          "notes":"that was heavy"
        },
        {
          "lift_id":1,
          "sets":3,
          "reps":8,
          "weight":135,
          "notes":"bench"
        }
      ]})
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        // res.body.should.have.property('message').eql('workout registered');
        // res.body.should.have.property('success').eql(true);
        done();
      });
    });
  });
