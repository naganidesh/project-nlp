var app = angular.module('RegisterApp', []);
app.controller('Signupcontroller',function ($scope,$http){
    $scope.CreateUser=function() {
        var Name="";var username="";var password="";var confirmpassword="";
        Name = $scope.txtName;
        username = $scope.txtUsername;
        password = $scope.txtPassword;
        confirmpassword = $scope.txtConfirmpassword;
        var Errormessage="";
        Errormessage= ValidateUserDetails(Name, username, password, confirmpassword);
        if(Errormessage!=null && Errormessage!=""){
            alert(Errormessage)
            return;
        }
        else{
            var array=[];
            array=getUserDetails();
            if(array.filter(user=>user.username==username).length>0)
            {
                alert('User already exists with the username. Please try signup with another username');
            }
            else
            {
                var details={
                    name:Name,
                    username:username,
                    password:password
                };
                array.push(details);
                localStorage.setItem("UserDetails",JSON.stringify(array));
                sessionStorage.FBName=Name;
                window.location.href = "HomePage.html";
            }
        }
    }
});
