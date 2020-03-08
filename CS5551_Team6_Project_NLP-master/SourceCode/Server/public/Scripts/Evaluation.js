var student;var tutor;var keyword;var keys='';var keywords;var result;var keyNotinAns;var ansNotinKey;
    var foundinAns;var useranswer;var foundinKey;var http;var grammarError;
    var synonyms={
        synonyms:{}
    };
    var Question;
    /*var Question= {
        questionID: 10,
        question: 'what is java is called platform independent?',
        answer: 'Java is called Platform independent because of its byte code which can run on any OS.',
        keywords: [{'id': 1, 'key': 'byte code', 'score': 5},
            {'id': 2, 'key': 'run on any OS', 'score': 5}]
    };*/
var textAnalyze = function($scope,$http,qid) {
    http=$http;
    var txtSearch='object oriented programming';
    var query1 = 'https://kgsearch.googleapis.com/v1/entities:search?query='+txtSearch.replace(' ','+')+'&key=AIzaSyC5YlF6OB7EVbG48qtWsyiYYsySPUlRyug&limit=10&indent=True';
    $http.get(query1).then(function(data) {
        console.log(data);
    });
    var query='https://api.mlab.com/api/1/databases/nlp_database/collections/questions?apiKey=lSMpIYO_9GB-Gnslwjb-KPeyA4fc4hxb';
    $http.get(query+'&q={"question_id":'+qid+'}').then(function(data){
        Question=data.data[0];
        AnswerEval($scope,$http,qid);
    });
}
function AnswerEval($scope,$http,qid){
    useranswer=document.getElementById("answers-"+qid).value;
    var query = '/hiresh/nlp?text='
    $http.post(query+ useranswer).then(function (data) {
        student =data;
        $http.post(query+ Question.answer).then(function (data) {
            //console.log(data);
            tutor =data;
            Result(student.data.tokens,tutor.data.tokens,$http);
        });
    });
}
    function Result(student,tutor,$http)
    {
        keywords = alasql('SELECT LOWER(keywords.key) as a,LOWER(tutor.text.content) as b,LOWER(tutor.partOfSpeech.tag) as c,keywords.score as d \
         ,tutor.lemma as lemma,keywords.score as score,tutor.dependencyEdge.headTokenIndex as actlIndex,tutor.dependencyEdge.label as actlLabel\
         FROM ? AS keywords JOIN ? AS tutor ON LOWER(keywords.key) LIKE "%"+'+'LOWER(tutor.text.content)'+'+"%"\
         OR " "+'+'LOWER(keywords.key)'+'+" " LIKE "% "+'+'LOWER(tutor.lemma)'+'+" %"',
            [Question.keywords,tutor]);

        result = alasql('SELECT student.text.content as ans,keywords.a as key,keywords.d as score,student.dependencyEdge.headTokenIndex as ansIndex,keywords.actlIndex as actlIndex \
        ,student.dependencyEdge.label as anslabel,keywords.actlLabel as actlLabel,"" as actvalue,"" as ansvalue\
         FROM ? AS student JOIN ? AS keywords ON LOWER(student.text.content) = keywords.b\
         OR LOWER(student.lemma) = keywords.b',
            [student, keywords]);

        for(var i=0;i<result.length;i++)
        {
            result[i].actvalue=tutor[result[i].actlIndex].text.content;
            result[i].ansvalue=student[result[i].ansIndex].text.content
        }

        keyNotinAns = alasql('COLUMN OF SELECT keywords.b \
         FROM ? AS student RIGHT JOIN ? AS keywords ON LOWER(student.text.content) = LOWER(keywords.b)\
          OR LOWER(student.lemma) = keywords.b WHERE student.text.content IS NULL AND keywords.b IS NOT NULL',
            [student, keywords]);

        ansNotinKey = alasql('SELECT student.text.content as a,student.lemma as lemma \
         FROM ? AS student LEFT JOIN ? AS keywords ON LOWER(student.text.content) = LOWER(keywords.b)\
          OR LOWER(student.lemma) = keywords.b WHERE student.text.content IS NOT NULL AND keywords.b IS NULL',
            [student, keywords]);
        if(ansNotinKey.length>0) {
            for (var i = 0; i < ansNotinKey.length; i++) {
                if (i == ansNotinKey.length - 1) {
                    CallAPI(i, ansNotinKey[i].a, $http, 'no end');
                }
                else {
                    CallAPI(i, ansNotinKey[i].a, $http, 'no end');
                }
            }
        }
        if(keyNotinAns.length>0) {
            for (var i = 0; i < keyNotinAns.length; i++) {
                if (i == keyNotinAns.length - 1) {
                    CallAPI(i, keyNotinAns[i], $http, 'end');
                }
                else {
                    CallAPI(i, keyNotinAns[i], $http, 'no end');
                }
            }
        }
        else
        {
            Display();
        }
    }
    var CallAPI=function(i,value,$http,isEnd)
    {
        //console.log(i+','+value);
        var query = 'https://words.bighugelabs.com/api/2/9cf7cd4e66f41736f7d126e38c973b2f/';
        $http.get(query+ value+'/json').then(function (data) {
            //console.log('kj');
            //console.log(data);
            if(data.data.verb!=null) {
                synonyms.synonyms[value] = data.data.verb.syn;
            }
            if(data.data.noun!=null){
                if(synonyms.synonyms[value]!=null) {
                    synonyms.synonyms[value] = synonyms.synonyms[value].concat(data.data.noun.syn);
                }
                else{
                    synonyms.synonyms[value] = data.data.noun.syn;
                }
            }
            if(data.data.adjective!=null){
                if(synonyms.synonyms[value]!=null) {
                    synonyms.synonyms[value] = synonyms.synonyms[value].concat(data.data.adjective.syn);
                }
                else{
                    synonyms.synonyms[value] = data.data.adjective.syn;
                }
            }
            if(isEnd=="end"){
                Display();
            }
        })
            .catch(function (err) {
                if(isEnd=="end"){
                    Display();
                }
            });
    }
    function Display(){
        for(var i=0;i<keyNotinAns.length && keyNotinAns.length>0;i++) {
            //console.log('bbb'+synonyms.synonyms[keyNotinAns[i]]);
            if(synonyms.synonyms[keyNotinAns[i]] !=undefined) {
                foundinAns = alasql('SELECT DISTINCT synonyms._ as a,"' + keyNotinAns[i] + '" as b,ansNotinKey.a as ans,ansNotinKey.lemma as lemma \
         FROM ? AS synonyms JOIN ? AS ansNotinKey ON LOWER(synonyms._) LIKE "%"+' + 'LOWER(ansNotinKey.a)' + '+"%" \
         OR LOWER(synonyms._) =LOWER(ansNotinKey.lemma)\
         WHERE LENGTH(ansNotinKey.a)>1',
                    [synonyms.synonyms[keyNotinAns[i]], ansNotinKey]);
                for (var j = 0; j < foundinAns.length; j++) {
                    if (keyNotinAns.length > 0) {
                        //console.log('aaa'+foundinAns[j].b);
                        var index = keyNotinAns.indexOf(foundinAns[j].b);
                        //console.log(index);
                        if (index >= 0) {
                            i = i - 1;
                            keyNotinAns.splice(index, 1);
                        }
                    }
                }
            }
        }

        for(var i=0;i<ansNotinKey.length && keyNotinAns.length>0;i++) {
            //console.log(synonyms.synonyms[ansNotinKey[i].a]);
            if(synonyms.synonyms[ansNotinKey[i].a] !=undefined) {
                foundinKey = alasql('SELECT DISTINCT synonyms._ as a,keyNotinAns._ as b,keyNotinAns._ as ans \
         FROM ? AS synonyms JOIN ? AS keyNotinAns ON LOWER(synonyms._) LIKE "%"+' + 'LOWER(keyNotinAns._)' + '+"%" \
         WHERE LENGTH(keyNotinAns._)>1',
                    [synonyms.synonyms[ansNotinKey[i].a], keyNotinAns]);
                for (var j = 0; j < foundinKey.length; j++) {
                    if (keyNotinAns.length > 0) {
                        //console.log('aaa'+foundinAns[j].b);
                        var index = keyNotinAns.indexOf(foundinKey[j].b);
                        //console.log(index);
                        if (index >= 0) {
                            keyNotinAns.splice(index, 1);
                        }
                    }
                }
            }
        }
        //console.log(keyNotinAns);
        grammerCheck();
    }
    function grammerCheck() {
        var query = 'https://api.textgears.com/check.php?text=' + useranswer.replace(' ', '+') + '&key=NUEMXNPjrK80zWef';
        http.get(query).then(function (data) {
            grammarError=0;
            if(data.data.errors.length>0)
            {
                grammarError=data.data.errors.length;
            }
            CalculateMarks();
        });
    }
    function CalculateMarks()
    {
        //console.log(keywords);
        //console.log(synonyms);
        var keywordsgroup=alasql('SELECT keywords.a as a,keywords.score as score,count(*) as `count` \
        FROM ? as keywords GROUP BY keywords.a,keywords.score'
            ,[keywords]);
        //console.log(keywordsgroup);
        /*console.log(alasql('SELECT DISTINCT Keywords.a as a,Keywords.b as b \
         FROM ? AS Keywords',
            [keywords]));*/
        var missingKeys =alasql('SELECT DISTINCT Keywords.a as a,Keywords.b as b,keygrp.score as score,keygrp.[count] as `count` \
         FROM ? AS Keywords JOIN ? AS keyNotinAns ON LOWER(keyNotinAns._) =LOWER(Keywords.b)\
         join ? keygrp on Keywords.a=keygrp.a',
            [keywords,keyNotinAns,keywordsgroup]);

        var checkresult = alasql('SELECT result1.key,result1.score,result1.ans,result1.actvalue\
         FROM ? AS result1 JOIN ? AS result2 ON LOWER(result1.ans) = LOWER(result2.ansvalue)\
         where result1.actlLabel="NN" and result2.anslabel="NN" and LOWER(result1.ans+result1.actvalue)=LOWER(result2.ansvalue+result2.ans)',
            [result, result]);

        var swapKeys =alasql('SELECT DISTINCT keywords.a as a,keywords.b as b,keywordsgroup.score as score,keywordsgroup.[count] as `count` \
         FROM ? AS checkresult JOIN ? AS keywordsgroup ON LOWER(checkresult.key) =LOWER(keywordsgroup.a)\
         join ? AS keywords on LOWER(checkresult.ans)=LOWER(keywords.b) or LOWER(checkresult.actvalue)=LOWER(keywords.b)',
            [checkresult,keywordsgroup,keywords]);

        for(var i=0;i<swapKeys.length;i++) {
            missingKeys.push({a: swapKeys[i].a, b: swapKeys[i].b, score: swapKeys[i].score, count: swapKeys[i].count});
        }

        var studentNegCount =alasql('SELECT count(*) as `count` from ? as student where student.dependencyEdge.label="NEG"',
            [student.data.tokens,tutor.data.tokens]);
        var tutorNegCount =alasql('SELECT count(*) as `count` from ? as tutor where tutor.dependencyEdge.label="NEG"',
            [tutor.data.tokens]);

        var score=10;
        for(var i=0;i<missingKeys.length;i++){
            score=score-(missingKeys[i].score/missingKeys[i]['count']);
        }

        if(studentNegCount[0].count!=tutorNegCount[0].count)
        {
            score=(score<=2?0:score-2);
        }
        if(grammarError>0){
            score=((score<=grammarError*0.5)?0:(score-(grammarError*0.5)));
        }
        score=score*10;

        if(score>50){
            $('.progress-bar-info').css('background-color', 'green');;
        }
        else {
            $('.progress-bar-info').css('background-color', 'red');;
        }
        $('#txtanswer').text(useranswer);
        document.getElementById('progressbar').style.width=(score==0?2:score)+'%';
        document.getElementById('progressbar').innerText=(score+'% correct');
        //  document.getElementById('progress').css('border','1px solid');
        document.getElementById('getAnswer').click();
    }
