/**
 * Created by user on 23/10/2016.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
// var url = 'mongodb://root:secure@ds161483.mlab.com:61483/asefall17';
var url = 'mongodb://anvesh12:anvesh12@ds137703.mlab.com:37703/nlp_database';
// var url = 'mongodb://appstest:appstest123@ds137003.mlab.com:37003/apps';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/enroll', function (req, res) {
    MongoClient.connect(url, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        var db= client.db();
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertDocument = function(db, data, callback) {
    db.collection('authenticate').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the asedemo collection.");
        callback();
    });
};

app.get('/getData', function (req, res) {
    var searchKeywords = req.query.keywords;
    console.log("Param are "+searchKeywords);
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while cosnnecting to Database");
            res.end();
        }
        if (err) throw err;
        var dbo = db.db("nlp_database");
        var query = { uaername: searchKeywords };
        dbo.collection("authenticate").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result[0].major);
            db.close();
            res.json(result);
        });
    });
});

var server = app.listen(8081,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});