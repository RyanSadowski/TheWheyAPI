

## Ping

#### It it should Get a status

```javascript
    
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Server is up. Please see API documentation to use');
        done();
      });
  
```

## /USER

#### It it should Get all users

```javascript
    
    chai.request(server)
    .get('/user/all')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('all users');
      res.body.should.have.property('body');
      done();
    });
  
```

#### It should authenticate test user

```javascript
    
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
  
```

#### It should get user stats for test user

```javascript
    
    chai.request(server)
    .get('/user/stats/' + id)
    .set('content-type', 'application/json')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('user stats');
      res.body.should.have.property('success').eql(true);
      done();
    });
  
```

#### It should delete test user

```javascript
    

    chai.request(server)
    .delete('/user/rip')
    .set('content-type', 'application/json')
    .set('x-access-token', token)
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('user deleted');
      done();
    });
  
```

#### It should CREATE test user

```javascript
    

    chai.request(server)
    .post('/user/setup')
    .set('content-type', 'application/json')
    .send({"username":"CheryTr33Cutr",  "password":"********",  "firstName":"Abraham",
    "lastName":"Lincoln",  "email":"CheryTr33Cutr@Wmail.net"})
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('user registered');
      res.body.should.have.property('success').eql(true);
      done();
    });
  
```

## /LIFTS

#### It should authenticate test user

```javascript
    
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
  
```

#### It should Get the lifts

```javascript
    
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
  
```

#### It should post a workout for test user

```javascript
    
    //console.log(token, " toek ", id , " id")
    chai.request(server)
    .post('/lifts/workout')
    .set('content-type', 'application/json')
    .set('x-access-token', token)
    .send({"type_id":5,"name":"test Workout","description":"I did a workout today, PR squat of 1000#",
    "lifts":[{"lift_id":1,"sets":3,"reps":8,"weight":135,"notes":"bench"}]})
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      // res.body.should.have.property('message').eql('workout registered');
      // res.body.should.have.property('success').eql(true);
      done();
    });
  
```

