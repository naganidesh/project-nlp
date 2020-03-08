
window.fbAsyncInit = function() {
    FB.init({
        appId      : '445473702642088',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8',
        status     : true
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/**
 * Created by user on 23/10/2016.
 */
var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});
myapp.controller('MongoRestController',function($scope,$http,$window){
    function ValidateUserDetails(Name,username,password,confirmpassword) {
        var missingValues = "";
        console.log('check'+Name);
        if (Name == null || Name == "" || Name==undefined) {
            missingValues = missingValues + "Name,";
        }
        if (username == null || username == "" || username==undefined) {
            missingValues = missingValues + "Username,";
        }
        if (password == null || password == "" || password==undefined) {
            missingValues = missingValues + "Password,";
        }
        if (confirmpassword == null || confirmpassword == "" || confirmpassword==undefined) {
            missingValues = missingValues + "Confirm Password,";
        }

        if (missingValues != null && missingValues != "") {
            return "Please Enter :" + missingValues.substr(0,missingValues.length-1);
        }
        else if(password!=confirmpassword){
            return "Password and Confirm password should match";
        }
        else {
            return "";
        }
    }
        $scope.insertData = function(){
            var errormessage=ValidateUserDetails($scope.txtName,$scope.txtUsername,$scope.txtPassword,$scope.txtConfirmpassword);
            if(errormessage!='' && errormessage!= null && errormessage!=undefined)
            {
                alert(errormessage);
                return;
            }
            var query='/registerDetails/search'
            $http.get(query).then(function(data) {
                console.log(data);
                if (data.data.length != 0) {
                    for (i = 0; i < data.data.length; i++) {
                        if (data.data[i].uaername == $scope.txtUsername) {
                            alert("Username Already Exists Please try with another Username");
                            return;
                        }
                    }
                }
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
                var req = $http.post('/enroll',dataParams)
                    .then(function(data, status, headers, config) {
                        // $scope.message = data;
                        console.log("here "+data);
                        $window.location.href = 'LoginPage.html';
                        alert('Registartion Successful Please Login');
                    });
            });
        };

    }
);
