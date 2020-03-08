/**
 * Created by user on 23/10/2016.
 */
var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});
myapp.controller('MongoRestController',function($scope,$http,$window){




        $scope.insertData = function(){
            console.log($scope.txtName);
            var dataParams = {
                'name' : $scope.txtName,
                'uaername' : $scope.txtUsername,
                'password' : $scope.txtPassword,
                'confirmpassword' : $scope.txtConfirmpassword
            };
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            var req = $http.post('http://127.0.0.1:8081/enroll',dataParams);
            req.success(function(data, status, headers, config) {
                // $scope.message = data;
                console.log("here "+data);
                // $window.location.href = 'getData.html';
            });
            req.error(function(data, status, headers, config) {
                alert( "failure message: " + JSON.stringify({data: data}));
            });
        };

                }
            );

myapp.controller('getController',function($scope,$http,$window){
    $scope.getDbData = function(){
        console.log("Value is ZZZZZZZZZ "+$scope.txtUsername);



        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.get('http://127.0.0.1:8081/getData?keywords=' + $scope.txtUsername).then(function (d) {
                    console.log(typeof(d));
                    console.log("length is " + d.data.length);
                    if (d.data.length != 0) {
                        var document = [];
                        for (i = 0; i < d.data.length; i++) {
                            if (d.data[i].password == $scope.txtPassword) {
                                console.log("matched");
                            }
                            else {
                                console.log("Not matched");
                            }
                            document.push(new Array(d.data[i].username + '-' + d.data[i].password));
                        }
                        console.log("document is " + document);
                    }
                    else {

                        console.log("Username is not available");
                    }
                }, function (err) {
                    console.log(err);
                }
            )

    };
});
