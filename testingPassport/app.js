var app = angular.module('formApp',[]) ;

app.controller('formController', ['$scope', '$http', '$window', function($scope, $http, $window) {

   	$scope.user = {username: 'john.doe', password: 'foobar'};



    $scope.orderProp = 'rank';
    $scope.myBool = 'false';
    $scope.reverse = false;

   
}]);