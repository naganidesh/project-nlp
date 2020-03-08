
function getUserDetails() {
    var users = JSON.parse(localStorage.getItem('UserDetails'));
    return users?users:[];
}
function CheckUser(scope)
{
    var username="";var password="";
    username=scope.txtUsername;
    password=scope.txtPassword;
    var errormessage="";
    if(username==null || username==""){
        errormessage=errormessage+"Username,";
    }
    if(password==null || password==""){
        errormessage=errormessage+"password,";
    }
    if(errormessage!=null && errormessage!=""){
        return("Enter "+errormessage.substr(0,errormessage.length-1));
    }
    var array=[];
    array=getUserDetails();
    if(array.filter(user=>user.username==username).length>0)
    {
        if(array.filter(user=>user.username==username && user.password==password).length>0){
            sessionStorage.FBName=array.filter(user=>user.username==username && user.password==password)[0].name;
            return "valid";
        }
        else{
            return "Invalid"
        }
    }
    else
    {
        return "nouser";
    }
}

var loginApp = angular.module('LoginApp', []);
loginApp.controller('FBcontroller',function ($scope,$http) {
    $scope.getDbData = function(){
        if(($scope.txtUsername=='' || $scope.txtUsername==undefined) &&($scope.txtPassword==''
            ||  $scope.txtPassword==undefined)){
           alert("Please Enter UserName and Password");
            return;
        }
        $http.get('/getData?keywords=' + $scope.txtUsername).then(function (d) {
                console.log(d);
                console.log("length is " + d.data.length);
                 if (d.data.length != 0) {
                    var document = [];
                    for (i = 0; i < d.data.length; i++) {
                        if (d.data[i].password == $scope.txtPassword) {
                            console.log("matched");
                            sessionStorage.setItem("username",d.data[i].uaername);
                            sessionStorage.setItem("name",d.data[i].name);
                            window.location.href="HomePage.html";
                        }
                        else {
                            alert("Password is Incorrect Please Enter Valid Password");
                        }
                        document.push(new Array(d.data[i].username + '-' + d.data[i].password));
                    }
                    console.log("document is " + document);
                }
                else {
                    alert("Username is not available");
                    console.log("Username is not available");
                }
            }, function (err) {
                console.log(err);
            }
        )

    };
    $scope.FbLogin = function () {
        FB.login(function(response){
                if(response.authResponse) (
                    FB.api('/me','GET',{fields:'email,first_name,name,id'},function(response){
                        sessionStorage.FBName=response.name.toString();
                        sessionStorage.setItem("username",response.email.toString());
                        sessionStorage.setItem("name",response.name.toString());
                        window.location.href = "HomePage.html";
                    })
                )
            },
            {scope:'email',return_scope:true}
        )
    }
    $scope.AppLogin=function(){
        var status=CheckUser($scope);
        if(status=="valid"){
            window.location.href="HomePage.html";
        }
        else if(status=="invalid"){
            alert("Password is Incorrect");
        }
        else if(status=="nouser"){
            alert('User is not registered');
        }
        else{
            alert(status);
        }
    }
});
