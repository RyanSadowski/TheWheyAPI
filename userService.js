var db = require('./db');
var userService = require('./userService');


/*---------------------------------------------------------*/
module.exports.checkLevelUp = function (user_id, xp, level) {
  var maxLevel = 0;
  var nextLevel = level + 1;
  db.query('SELECT * FROM levels', function (err, result) {
    if (err) {
      console.error("ERROR: ", err)
    } else {
      maxLevel = result.rows.length;
      if (level < maxLevel) {
        db.query('SELECT * FROM levels WHERE id = ($1)', [nextLevel], function (err, result) {
          if (err) {
            console.error("ERROR: ", err)
          } else {
            if (xp >= result.rows[0].xp) {
              console.log("LEVEL UP");
              userService.levelUp(user_id, nextLevel);
            }
          }
        });
      }
    }
  });
};

/*--------------------------------------------------*/
module.exports.modXP = function (user_id, xpAmmount) {
  db.query('SELECT * FROM users WHERE id = ($1)', [user_id], function (err, result) {
    if (err) {
      console.error("ERROR: ", err)
    } else {
      var newXP = result.rows[0].exp + xpAmmount
      db.query('UPDATE users SET exp = ($1) WHERE id = ($2)', [newXP, user_id], function (err) {
        if (err) {
          console.error("ERROR: ", err)
        } else {
          userService.checkLevelUp(user_id, newXP, result.rows[0].level);
        }
      });
    }
  });
};

/*----------------------------------------------------*/
module.exports.levelUp = function (user_id, nextLevel) {
  db.query('UPDATE users SET level = ($1) WHERE id = ($2)', [nextLevel, user_id], function (err) {
    if (err) {
      console.error("ERROR: ", err)
    } else {
      console.log("gratz on ding dawg");
    }
  });
}

/*---------------------------------------------------------*/
module.exports.modStat = function (user_id, stat_id, amount) {
  //TODO mod Stats

  /*
  gets called from levelup... idk how this works yet
  */
}

/*-------------------------------------------------*/
module.exports.gainsGoblin = function (user_id, xp) {
  //TODO gainsGoblin

  /*
  somehow this gets called every week and takes away a set amount of xp
  */
}


module.exports.getLifts = function (value) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM liftlist', function (err, result) {
      if (err) {
        reject(err);
      } else {
        // console.log(result.rows);
        resolve(result.rows);
      }
    })
  })
}
module.exports.getWorkoutTypes = function (value) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM workouttypes', function (err, result) {
      if (err) {
        reject(err);
      } else {
        // console.log(result.rows);
        resolve(result.rows);
      }
    })
  })
}

module.exports.getUserData = function (userId) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ($1)', [1], function (err, result) {
      if (err) {
        reject(err);
      } else {
        console.log(result.rows);
        resolve(result.rows);
      }
    })
  })
}

module.exports.getLevels = function (userId) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ($1)', [1], function (err, result) {
      if (err) {
        reject(err);
      } else {
        db.query('SELECT * FROM levels WHERE id = ($1)', [result.rows[0].level], function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows);
          }
        })
      }
    })
  })
}
module.exports.getJournal = function (userId) {
  return new Promise((resolve, reject) => {
  resolve("TBD");
  })
}

module.exports.getInventory = function (userId) {
  return new Promise((resolve, reject) => {
  resolve("TBD");
  })
}

/*-------------------------------------------------*/

module.exports.getHomeData = function (userId) {
  var promises = [];
  promises.push(new Promise((resolve, reject) => {
    this.getLifts().then(function (terd) {
      resolve(terd);
    });
  }))
  promises.push(new Promise((resolve, reject) => {
    this.getWorkoutTypes().then(function (werd) {
      resolve(werd);
    });
  }))
  promises.push(new Promise((resolve, reject) => {
    this.getUserData(userId).then(function (werd) {
      resolve(werd);
    });
  }))
  promises.push(new Promise((resolve, reject) => {
    this.getLevels(userId).then(function (werd) {
      resolve(werd);
    });
  }))
  promises.push(new Promise((resolve, reject) => {
    this.getJournal().then(function (werd) {
      resolve(werd);
    });
  }))
  promises.push(new Promise((resolve, reject) => {
    this.getInventory().then(function (werd) {
      resolve(werd);
    });
  }))
  return Promise.all(promises);
}
