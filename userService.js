var db                = require('./db');
var userService       = require('./userService');


module.exports.checkLevelUp = function (user_id, xp, level){
  var maxLevel = 0;
  var nextLevel = level + 1;
  db.query('SELECT * FROM levels', function(err, result){
    if(err){
      console.error("ERROR: ", err)
    }else{
      maxLevel = result.rows.length;
      //console.log('level is ', level, ' max level is ', maxLevel );
      if(level < maxLevel){
        //console.log('next level')
        db.query('SELECT * FROM levels WHERE id = ($1)', [nextLevel] ,function(err, result){
          if(err){
            console.error("ERROR: ", err)
          }else{
            //console.log(result.rows);
            //console.log('next level is ', nextLevel, ' and you have ', xp, ' of ', result.rows[0].xp );
            if (xp >= result.rows[0].xp){
              //console.log("LEVEL UP");
              userService.levelUp(user_id, nextLevel);
            }
          }
        });
      }
    }
  });
};

module.exports.modXP = function (user_id, xpAmmount){
  db.query('SELECT * FROM users WHERE id = ($1)', [user_id],function(err, result){
    if(err){
      console.error("ERROR: ", err)
    }else{
      //console.log("exp: ", result.rows[0].exp);
      var newXP = result.rows[0].exp + xpAmmount
      db.query('UPDATE users SET exp = ($1) WHERE id = ($2)', [newXP ,user_id],function(err){
        if(err){
          console.error("ERROR: ", err)
        }else{
          userService.checkLevelUp(user_id, newXP, result.rows[0].level);

        }
      });
    }
  });
};

module.exports.levelUp = function (user_id, nextLevel){
  db.query('UPDATE users SET level = ($1) WHERE id = ($2)', [nextLevel ,user_id],function(err){
    if(err){
      console.error("ERROR: ", err)
    }else{
      console.log("gratz on ding dawg");
    }
  });
}

module.exports.modStat = function (user_id, stat_id, amount){
  //TODO mod Stats

  /*
  gets called from levelup... idk how this works yet
  */

}
module.exports.gainsGoblin = function (user_id, xp){
  //TODO gainsGoblin

  /*
  somehow this gets called every week and takes away a set amount of xp
  */

}
