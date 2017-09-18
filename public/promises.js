var myApp=angular.module('myApp',[]);     
myApp.controller('Promisescntrl',['$scope','$http','$q',
function($scope,$http,$q,){
	//alert("iam new here")

	$scope.add=function (x,y){
		var q= $q.defer();
		var result = x+y;
		//return (x+y)
		
		//if(result>=0){
			q.resolve(x+y)
		//}
		return q.promise;
	}

	// $scope.multiply=function (x,y){
	// 	var q= $q.defer();
	// 	var result = x*y;
	// 	//return (x+y)
	// 	// console.log(x+y)
	// 	if(result>=0){
	// 		q.resolve(x*y)
	// 	}
	// 	return q.promise;
	// }
	// $scope.sub=function (x,y){
	// 	var q= $q.defer();
	// 	var result = x-y;
		
	// 	if(result>=0){
	// 		q.resolve(x-y)
	// 	}
	// 	return q.promise;
	// }


	
	$scope.Addition = function(){
		$scope.add(5,2).then(function(result){
		        //alert(result)
		       // $scope.add1 = result;
		        console.log("$scope.add")
		       return $scope.add(result,2);
			}).then(function(result){
		        console.log("$scope.mul")
		        //$scope.add(result,2)
		        $scope.add1 = result;
		         return $scope.add(result,2);
			 })
			.then(function(result){
				 console.log("$scope.sub")
		        //alert(result)
		       // $scope.add1 = result;
		        //$scope.add(r
			})


	}
// $scope.add1 = function(a,b){
// 	console.log(a+b)
// 	console.log("add1")
// 	//$scope.sub1(5,6)
// }
// $scope.mul1 = function(a,b){
// 	console.log(a*b)
// 	console.log("mul1")
// }
// $scope.sub1 = function(a,b){
// 	console.log(a-b)
// 	console.log("sub1")
// }
// $scope.add1(5,6)
// $scope.mul1(5,6)
// $scope.sub1(5,6)
	// .then(function(result){
	// 	alert(result)
	// })


}

])