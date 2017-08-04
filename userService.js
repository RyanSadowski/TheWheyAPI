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
              userService.levelUp(user_id, nextLevel);
            }
          }
        });
      }
    }
  });
};

module.exports.modXP = function (userId, xpAmmount) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ($1)', [userId], function (err, result) {
      if (err) {
        reject(err);
      } else {
        var newXP = result.rows[0].exp + xpAmmount
        db.query('UPDATE users SET exp = ($1) WHERE id = ($2)', [newXP, userId], function (err) {
          if (err) {
            reject(err);
          } else {
            userService.checkLevelUp(userId, newXP, result.rows[0].level)
            resolve(xpAmmount);
          }
        });
      }
    });
  })
}


/*----------------------------------------------------*/
module.exports.levelUp = function (user_id, nextLevel) {
  db.query('UPDATE users SET level = ($1) WHERE id = ($2)', [nextLevel, user_id], function (err) {
    if (err) {
      console.error("ERROR: ", err)
    } else {
      console.log("gratz on ding dawg");
      return "gratz on ding";
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
module.exports.getLiftName = function (value) {
  return new Promise((resolve, reject) => {
    db.query('SELECT name FROM liftlist WHERE id = $1'[value], function (err, result) {
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
    db.query('SELECT * FROM users WHERE id = ($1)', [userId], function (err, result) {
      if (err) {
        reject(err);
      } else {
        delete result.rows[0].password;
        resolve(result.rows);
      }
    })
  })
}

module.exports.getLevels = function (userId) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ($1)', [userId], function (err, result) {
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
    resolve("TBD" + userId);
  })
}

module.exports.getLiftName = function (liftId) {
  return new Promise((resolve, reject) => {
    db.query('SELECT name FROM liftlist WHERE id = ($1)', [liftId], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows);
      }
    })
  })
}
//workoutJson.lifts, userId
module.exports.checkPR = function (lifts, userId) {
  var prs = [];
  return new Promise((resolve, reject) => {
    for (var i = 0, len = lifts.length; i < len; i++) {
      db.query('SELECT * FROM liftjournal WHERE lift_id = ($1) AND user_id = ($2) AND weight > ($3)', [lifts[i].id, userId, lifts[i].weight], function (err, result) {
        if (err) {
          reject(err);
        } else if (result.rows[0] == null) {
          resolve("true")
        }
      })
      if (i === (lifts.length - 1)) {
        resolve("false");
      }
    }
  })
}
module.exports.saveWorkout = function (workoutdata, userId) {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO workoutlog(user_id, type_id, distance, duration, name, description, start, finish, location ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [userId, workoutdata.type_id, workoutdata.distance, workoutdata.duration, workoutdata.name, workoutdata.description, workoutdata.start, workoutdata.finish, workoutdata.location],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          for (var i = 0, len = workoutdata.lifts.length; i < len; i++) {
            db.query("INSERT INTO liftjournal(workoutlog_id, lift_id, sets, reps, weight, notes, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
              [result.rows[0].id, workoutdata.lifts[i].lift_id, workoutdata.lifts[i].sets, workoutdata.lifts[i].reps, workoutdata.lifts[i].weight,
              workoutdata.lifts[i].notes, userId],
              function (err, results) {
                if (err) {
                  reject(err)
                }
                else {
                  //one lift saved
                }
              })
            if (i === (workoutdata.lifts.length - 1)) {
              resolve(result.rows);
            }
          }
        }
      })
  })
}
// module.exports.saveLift = function (liftData, workoutID, userId) {
  
//   return new Promise((resolve, reject) => {
//     db.query("INSERT INTO liftjournal(workoutlog_id, lift_id, sets, reps, weight, notes, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
//       [workoutID, liftData.lift_id, liftData.sets, liftData.reps, liftData.weight,
//         liftData.notes, userId],
//       function (err, results) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results.rows);
//         }
//       })
//   })
// }

module.exports.getInventory = function (userId) {
  return new Promise((resolve, reject) => {
    resolve("TBD" + userId);
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
    this.getJournal(userId).then(function (werd) {
      resolve(werd);
    });
  }))
  promises.push(new Promise((resolve, reject) => {
    this.getInventory(userId).then(function (werd) {
      resolve(werd);
    });
  }))
  return Promise.all(promises);
}

module.exports.saveWorkoutData = function (workoutJson, userId) {
  var promises = [];
  var workoutID;
  var response = {};
  promises.push(new Promise((resolve, reject) => {
    this.checkPR(workoutJson.lifts, userId).then(function (prs) {
      resolve(prs);
    })
  }))
  promises.push(new Promise((resolve, reject) => {
    this.saveWorkout(workoutJson, userId).then(function (workout) {
      console.log("workout", workout[0].id);
      workoutID = workout[0].id;
      response.workout = ("workout " + workout[0].id + " created!");
      resolve("workout " + workout[0].id + " created!");
    })
  }))
  promises.push(new Promise((resolve, reject) => {
    this.modXP(userId, 50).then(function (xp) {
      resolve(xp);
    })
  }))

  return Promise.all(promises);
}
