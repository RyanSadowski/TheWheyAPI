

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

