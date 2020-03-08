var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const db = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Rest API's
require('./controllers/external/index')(app);

var url = 'mongodb://anvesh12:anvesh12@ds137703.mlab.com:37703/nlp_database';

app.post('/enroll', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db = client.db();
        insertDocument(db, req.body, function () {
            res.write("Successfully inserted");
            res.end();
        });
    });
    });
    var insertDocument = function (db, data, callback) {
        db.collection('registerDetails').insertOne(data, function (err, result) {
            if (err) {
                res.write("Registration Failed, Error While Registering");
                res.end();
            }
            console.log("Inserted a document into the nlpDB collection.");
            callback();
        });
    };

app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are QQQQQQQQQ" + searchKeywords);
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        var query = {uaername: searchKeywords};
        dbo.collection("registerDetails").find(query).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});

app.post('/answers/create', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db = client.db();
        insertAnswerDetails(db, req.body, function () {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertAnswerDetails = function (db, data, callback) {
    db.collection('answers').insertOne(data, function (err, result) {
        if (err) {
            res.write("Document insertion is failed");
            res.end();
        }
        console.log("Inserted a document into the Answers collection.");
        callback();
    });
};
app.get('/questions/search', function (req, res) {
    console.log("Param are AAAAAAAAA");
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        dbo.collection("questions").find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});

app.get('/question/delete',function (req, res) {
    let questionId = req.query.qid;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        dbo.collection("questions").deleteOne
        ({
            "question_id": parseInt(questionId)
        }, function (err, result) {
            if (err) throw err;
            db.close();
            res.json(result);
        });
    });
});

app.get('/queskeys/search',(req,res)=>{
    var search_text = req.query.srch;
    console.log(search_text);
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        dbo.collection("questions").find({question:{ $regex: search_text, $options: 'i' }}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });

});

app.get('/registerDetails/search', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        dbo.collection("registerDetails").find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});


app.post('/questions/create', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        var db = client.db();
        insertQuestionDetails(db, req.body, function () {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertQuestionDetails = function (db, data, callback) {
    db.collection('questions').insertOne(data, function (err, result) {
        if (err) {
            res.write("Document insertion is failed");
            res.end();
        }
        console.log("Inserted a document into the Answers collection.");
        callback();
    });
};
app.delete('/answers/delete',function (req, res) {
    let userId = req.query.userId;
    let questionId = req.query.questionId;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        dbo.collection("answers").deleteOne
        ({
            "questionId": parseInt(questionId),
            "userId": userId
        }, function (err, result) {
            if (err) throw err;
            db.close();
            res.json(result);
        });
    });
})

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    module.exports = app;