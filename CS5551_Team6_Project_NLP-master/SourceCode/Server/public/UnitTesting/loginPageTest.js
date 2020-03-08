describe("Signupcontroller", function() {
    var scope;
    beforeEach(angular.mock.module("LoginPage"));
    beforeEach(angular.mock.inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('Signupcontroller', {$scope: scope});
    }));
    it("check if userId and password is empty", function() {

        scope.Valid('','');
        expect(scope.temp).toEqual("userId and question can not be empty");
    });

    it("check if password is empty", function() {

        scope.Valid('','1234');
        expect(scope.temp).toEqual("password can not be empty");
    });
    it("check if userId is empty", function() {

        scope.Valid('asd12','');
        expect(scope.temp).toEqual("userId can not be empty");
    });

});
angular.module('LoginPage', []).controller('Signupcontroller', function ($scope,$http) {
    $scope.temp = "";
    $scope.Valid = function (userId,password) {

        $scope.userId = userId;
        $scope.password = password;

        if($scope.userId == '' && $scope.password == '' )
        {

            $scope.temp = "userId and question can not be empty";
        }
        else if($scope.password == '1234')
        {

            $scope.temp = "password can not be empty";
        }
        else
        {
            $scope.temp = "userId can not be empty";
        }
    }
});