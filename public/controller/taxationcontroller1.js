
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http,$localStorage,$sessionStorage, $window) {
    console.log("Hello World from controller display");
 
var refresh = function() {
$http.get('/getitemtaxation').success(function(response) {
 	console.log("i get the data i requested");
  	$scope.res = response;
    console.log(response);

  });
};

refresh();
$scope.user = {};

$scope.addnewitem = function() {

  if($scope.user.name == undefined ||$scope.user.aliasname== undefined ||$scope.user.taxlevel == undefined){
    //alert("");
    for(let k = 0;k<1;k++){
    console.log($scope.user.name);
    if($scope.user.name == undefined){
      alert("Please enter Tax Name");
      break;
    }
    console.log($scope.user.aliasname);
    if($scope.user.aliasname == undefined){
      alert("Please enter Alias Name");
      break;
    }
    console.log( $scope.user.taxlevel);
    if($scope.user.taxlevel == undefined){
      alert("Please enter Display Order");
      break;
    }
  }//for llop
 }else{
    console.log("i am add" + $scope.user.name, $scope.user.aliasname, $scope.user.taxlevel);
    $http.post('/opalpost', $scope.user).success(function(response) {
               console.log(response);
               refresh();
       });
    $scope.user = ""

  }
  

  
};

$scope.remove = function(id) {
  console.log("remove call"+id);

  console.log("this is delete"+id);
$http.delete('/opal/' + id).success(function(response) {
    refresh();
  });
};


$scope.edit = function(id) {
  console.log("edit call" +id);
  console.log("this is " +id);
  // var uid=id;
  $http.get('/item1/' + id).success(function(response) {
     $scope.user = response;

  });

};  

$scope.update = function() {
  console.log($scope.user._id);
  if($scope.user._id == undefined){
    alert("Please Select Edit")

  }else{

  $http.put('/opal/' + $scope.user._id, $scope.user).success (function(response) {
           refresh();
       });

   $scope.user = ""

  }


  
};

$scope.deselect = function() {
  $scope.user = ""
}

}]);