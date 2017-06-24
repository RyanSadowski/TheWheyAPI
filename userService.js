var db                = require('./db');

module.exports.modXP = function (user_id, xp){
  db.query('SELECT * FROM users WHERE id = ($1)', [user_id],function(err, result){
    if(err){
      console.error("ERROR: ", err)
    }else{
      console.log("exp: ", result.rows[0].exp);
      //UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
      db.query('UPDATE users SET exp = ($1) WHERE id = ($2)', [result.rows[0].exp + xp ,user_id],function(err, result){
        if(err){
          console.error("ERROR: ", err)
        }
      });
    }
  });
};

//TODO levelup

//TODO mod Stats
