# TheWhey API


For any API routes besides Authenticating an account and Registering an account you will need a token.
You can send your auth token in 3 different places. `req.body.token || req.query.token || req.headers['x-access-token']`

API accepts JSON or URL-Encoded 

## API ROUTES

### USER 

#### Register Account : POST `/user/setup`    

Example

 {
  "username":"CheryTr33Cutr",
  "password":"********",
  "firstName":"Abraham",
  "lastName":"Lincoln",
  "email":"CheryTr33Cutr@Wmail.net"
}

Returns

 {
  "success": true,
  "obj": {
    "__v": 0,
    "username": "CheryTr33Cutr",
    "password": "**HASH**",
    "firstName": "Abraham",
    "lastName": "Lincoln",
    "email": "CheryTr33Cutr@Wmail.net",
    "_id": "5940c48e799fd672fe0a7f6c",
    "xp": 0,
    "active": true,
    "updated_at": "2017-06-14T05:07:26.651Z"
  },
  "body": "user registered"
}

#### Authenticate Account : POST `/user/auth`    

Example

{
	"username":"CheryTr33Cutr",
	"password":"********"
} 

Returns

{
  "success": true,
  "token": "***TOKEN***",
  "username": "CheryTr33Cutr"
}
