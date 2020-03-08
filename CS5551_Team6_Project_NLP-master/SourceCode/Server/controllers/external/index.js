var request = require('request');
module.exports = function(app) {
    var query='https://language.googleapis.com/v1beta2/documents:analyzeSyntax?key=AIzaSyA7f9wgc1XwprL1hSPWFaBotvttChr24yU';
    //var url = 'https://api.wunderground.com/api/36b799dc821d5836/hourly/q/MO/kansas%20city.json';
    app.post('/hiresh/nlp', function(req, res) {
        console.log(req.query);
        res.contentType("application/json");
       request.post({
               url: query,
               method: 'POST',
               json: {

                   "document" :  {
                       "type":"PLAIN_TEXT",
                       "content" : req.query.text
                   }
                   ,
                   "encodingType" : "None"
               }
           }
       ).pipe(res);
    });
}