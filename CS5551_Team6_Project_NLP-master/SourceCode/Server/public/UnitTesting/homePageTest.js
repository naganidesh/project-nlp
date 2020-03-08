describe("homeController", function() {
    var scope;
    beforeEach(angular.mock.module("HomePage"));
    beforeEach(angular.mock.inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('homeController', {$scope: scope});
    }));
    it("check if answer and question is empty", function() {

        scope.Valid('','');
        expect(scope.temp).toEqual("answer and question can not be empty");
    });

    it("check if question is empty", function() {

        scope.Valid('','Why Java is Platform Independent?');
        expect(scope.temp).toEqual("question can not be empty");
    });
    it("check if answer is empty", function() {

        scope.Valid('Because of Platform Independent and ByteCode','');
        expect(scope.temp).toEqual("answer can not be empty");
    });

});
angular.module('HomePage', []).controller('homeController', function ($scope,$http) {
    $scope.temp = "";
    $scope.Valid = function (answer,question) {

        $scope.answer = answer;
        $scope.question = question;

        if($scope.answer == '' && $scope.question == '' )
        {

            $scope.temp = "answer and question can not be empty";
        }
        else if($scope.question == 'Why Java is Platform Independent?')
        {

            $scope.temp = "question can not be empty";
        }
        else
        {
            $scope.temp = "answer can not be empty";
        }
    }
});