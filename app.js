var MongoClient = require('mongodb').MongoClient;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/json', function(req, res, next){
  MongoClient.connect("mongodb://127.0.0.1", function(err, db){
    if(!err){
      var dbo = db.db("Mydemo")
      dbo.collection('LuckyDraw').find({}, {"_id":0}).sort({"award":-1}).toArray(function(err, data){
        if(!err){
          res.json(data)
        }
      })
    }
  });
})


app.get('/senddata', function(req, res, next){
  var title = req.query.title
  var award = req.query.award
  var winner = req.query.winner
  
  //console.log(title,award,winner)

  MongoClient.connect("mongodb://127.0.0.1", function(err, db){
    if(!err){
      //console.log("連線成功")
      var dbo = db.db("Mydemo")
      winner_split = winner.split(',')
      for(var i=0; i<winner_split.length; i++){
        //console.log(winner_split[i])
        dbo.collection("LuckyDraw").insert({title: title, award: award, winner: winner_split[i]}, function(err, result){
          if(!err){
            console.log("寫入成功")
          } else{
            console.log("寫入失敗")
          }
        })
      }

    } else {
      console.log("連線失敗",err)
    }
    res.end()
  })

})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
