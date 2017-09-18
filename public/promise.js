var app = angular.module('myApp', []);
app.controller('myCtrl',['$scope','$q', function($scope, $q) {
  $scope.name="hii am shiva";
 // alert('shivu');
  $scope.addition = function(){
			//   alert(10+5);
			  $scope.add(5,2) 
			 .then(function (result){
			  //$scope.add1=result;
			  return $scope.multiply(result,8)
			  
			  }).then(function (result){
				 //$scope.add1=result;
				 return $scope.sub(result,10)
				 
			  }).then(function(result)
			  {
				  $scope.add1=result;
				  return $scope.div(result,4)
			  })
   
			  
  }
  
  $scope.add=function(x,y)
  {
	 console.log(x+y);
	 var q = $q.defer();
	 var result= x+y;
		if(result>=0)
		{
			q.resolve(x+y);
		}
		else
		{
			q.reject("condition fail");
		}
		return q.promise;
	 
  }
    $scope.multiply=function(x,y)
  {
	 console.log(x*y);
	 var q = $q.defer();
	 var result= x*y;
		if(result>=0)
		{
			q.resolve(x*y);
		}
		else
		{
			q.reject("condition fail");
		}
		return q.promise;
	 
  }
    $scope.sub=function(x,y)
  {
	 console.log(x-y);
	 var q = $q.defer();
	 var result= x-y;
		if(result>=0)
		{
			q.resolve(x-y);
		}
		else
		{
			q.reject("condition fail");
		}
		return q.promise;
	 
  }
    $scope.div=function(x,y)
  {
	 console.log(x/y);
	 var q = $q.defer();
	 var result= x/y;
		if(result>=0)
		{
			q.resolve(x/y);
		}
		else
		{
			q.reject("condition fail");
		}
		return q.promise;
	 
  }
     
  
}]);