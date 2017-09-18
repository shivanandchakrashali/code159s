var myApp=angular.module('myApp',[]); 

myApp.controller('reportCntrl',['$scope','$http','$window','$q',
function($scope,$http,$window,$q){

console.log("well come to report controller")

//for radio default
    $scope.radio = {
        "transaction":'regular',
        "barcode":'yes',
        "weight":'ntwt',
        // "report":'itemName',
        "report":'purity',
      };


//radiobutton()
$scope.radiobutton1 = function(){
	console.log("entered into radiobutton1");
  if( $scope.radio.report != "itemName" ){
      $scope.reportpurity = "purity";
   // alert("it is purity")
  }
	//alert($scope.radio.transaction);
}

//preview function
$scope.preview = function(){
	
var receivedata = null;
var issuedata = null;
var report1 =[];
//var nietos = [];
function* gen(){
  var reportdate   = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
   
  var reportdata = $scope.radio.transaction+","+$scope.radio.barcode+","+$scope.radio.weight+","+$scope.radio.report+","+reportdate ;
    console.log(reportdata)
  var x = yield $http.get('/receiveonedate/'+reportdata ).success(function(response){
                       // $scope.reportonedate2= response
                          console.log("/receiveonedate/")
                          console.log(response)
                          receivedata = response; 

                });
  //console.log(x)
  var y = yield $http.get('/issueonedate/'+reportdata ).success(function(response){
                       // $scope.reportonedate2= response
                          console.log("/issueonedate/")
                          console.log(response)
                          issuedata = response;
                          console.log(issuedata )
                          console.log(receivedata)
                         // console.log(receivedata[0]._id)
                          console.log(issuedata.length )
                          console.log(receivedata.length)
                          for(let m = 0; m<issuedata.length ; m++){
                              //console.log("loop "+m)
                             for(let n = 0; n<receivedata.length ; n++){
                                 //console.log("entereefnnn loop "+n)
                                  if(issuedata[m]._id == receivedata[n]._id ){
                                   // console.log("if if if loop")
                                    var opQty = 0;
                                    var opPcs = 0;
                                    var totQty = 0;
                                    var totPcs = 0;
                                    var ciQty = 0;
                                    var ciPcs = 0;
                                   // console.log(issuedata[m])
                                    //console.log(receivedata[n])
                                    totQty = opQty + issuedata[m].weight;
                                    totPcs = opPcs + issuedata[m].gpcs;
                                    ciQty = receivedata[n].weight - totQty;
                                    ciPcs =   receivedata[n].gpcs - totPcs;
                                   

                                   var obj = {};
                                   obj["item"] = issuedata[m]._id;
                                   obj["opQty"] = opQty;
                                   obj["opPcs"] = opPcs;
                                   obj["rcvQty"] = receivedata[n].weight;
                                   obj["rcvPcs"] = receivedata[n].gpcs;
                                   obj["totQty"] = totQty;
                                   obj["totPcs"] = totPcs;
                                   obj["issQty"] = issuedata[m].weight;
                                   obj["issPcs"] = issuedata[m].gpcs;
                                   obj["ciQty"] = ciQty;
                                   obj["ciPcs"] = ciPcs;
                                   report1.push(obj);
                                    // report1.push([issuedata[m]._id,opQty,opPcs,receivedata[n].weight,
                                    // receivedata[n].gpcs,totQty,totPcs,issuedata[m].weight,issuedata[m].gpcs,ciQty,ciPcs]);
                                      console.log(report1[n])
                                      console.log(report1)
                                     // console.log(nietos)
                                      $scope.reportonedate1 = report1;
                                      // console.log($scope.reportonedate1)
                                  }



                             }


                          }

                         // console.log("tyriuriri")

                });
        


}
var mygen = gen()
console.log(mygen.next())
console.log(mygen.next())
//console.log(mygen.next())
}

//purity function
// var purityarry = []
// var purity2 = function(){
// console.log("purity call")
//  $http.get('/inventorygroupmasterdetails').success(function(response){
//                             console.log(response)
//                             var group = response

//                               console.log(group.length)
//                               for(let l = 0; l < group.length;l++){
//                            console.log(group[l].InvGroupName)
//                             // $scope.reportonedate1 = response;
//                        $http.get('/itemreport'+ group[l].InvGroupID).success(function(response){
//                              // console.log(response)
//                                var purityarry1 = {};
//                                    purityarry1["purity"] = response;
//                                    purityarry1["group"] = group[l].InvGroupName;
//                                    // obj["opQty"] = opQty;
//                                    // obj["opPcs"] = opPcs;
//                               purityarry.push(purityarry1);
                             //  console.log(purityarry)
                             //  for(let k = 0;k< purityarry.length;k++){
                                
                             //   console.log("group  "+ purityarry[k].group)
                             //   puritypurity.push(purityarry1)
                             //    for(let q = 0;q< purityarry[k].purity.length;q++){
                             //  // console.log(purityarry[k].purity[q].ValueNotation);
                             //   console.log("   purtiy  "+purityarry[k].purity[q].ValueNotation)
                             //    }
                             // }
                              
//                             }) 
//                             }  
            
//                     })


// for  purity
var itemgroup =[]
var receivedata1 = null;
//var issuedata1 = null;
var report1 =[];
var lengthitemNamesort = null;
 var purity2 = function(){

function* gen2(){
var reportdate   = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
   
  var reportdata = $scope.radio.transaction+","+$scope.radio.barcode+","+$scope.radio.weight+","+$scope.radio.report+","+reportdate ;
    console.log(reportdata)
 var x1 = yield $http.get('/receiveonedate/'+reportdata ).success(function(response){
                       // $scope.reportonedate2= response
                          console.log("/receiveonedate/")
                          console.log(response)
                          receivedata1 = response; 

                });
  var x2 = yield $http.get('/itemreport2').success(function(response){
  
            var itemNamesort = response; 
            console.log(itemNamesort.length)
            lengthitemNamesort = itemNamesort.length
          for(let t = 0;t<lengthitemNamesort;t++){
    
    $http.get('/itemnamedetails'+itemNamesort[t]._id.itemName).success(function(response){

             itemgroup1 = {};
             itemgroup1["itemName"] = response[0].Name;
             itemgroup1["Group"] = response[0].InvGroupName
             itemgroup1["issQty"] = itemNamesort[t].ntwt;
            // itemgroup1["issQty"] = itemNamesort[t].weight;
             itemgroup1["issPcs"] = itemNamesort[t].gpcs;
             itemgroup1["purity"] = itemNamesort[t]._id.purity;
                                   

               itemgroup.push(itemgroup1);
            // }
                console.log(itemgroup)
                console.log("loop "+itemgroup.length)
             // //  alert(arrcon)
             //  }

                  for(let m = 0; m<lengthitemNamesort ; m++){
                              //console.log("loop "+lengthitemNamesort)
                             for(let n = 0; n<receivedata1.length ; n++){
                                // console.log("entereefnnn loop "+receivedata1.length)
                                //console.log(itemgroup[n].itemName )
                                 console.log(receivedata1[m]._id.itemName)
                               
                               
                                  if(receivedata1[m]._id.itemName == itemgroup[n].itemName ){
                                    console.log("if if if loop")
                                    var opQty = 0;
                                    var opPcs = 0;
                                    var totQty = 0;
                                    var totPcs = 0;
                                    var ciQty = 0;
                                    var ciPcs = 0;
                                   // console.log(issuedata[m])
                                    //console.log(receivedata[n])
                                    totQty = opQty + issuedata[m].weight;
                                    totPcs = opPcs + issuedata[m].gpcs;
                                    ciQty = receivedata[n].weight - totQty;
                                    ciPcs =   receivedata[n].gpcs - totPcs;
                                   

                                   var obj = {};
                                   obj["item"] = issuedata[m]._id;
                                   obj["opQty"] = opQty;
                                   obj["opPcs"] = opPcs;
                                   obj["rcvQty"] = receivedata[n].weight;
                                   obj["rcvPcs"] = receivedata[n].gpcs;
                                   obj["totQty"] = totQty;
                                   obj["totPcs"] = totPcs;
                                   obj["issQty"] = issuedata[m].weight;
                                   obj["issPcs"] = issuedata[m].gpcs;
                                   obj["ciQty"] = ciQty;
                                   obj["ciPcs"] = ciPcs;
                                   report1.push(obj);
                                    // report1.push([issuedata[m]._id,opQty,opPcs,receivedata[n].weight,
                                    // receivedata[n].gpcs,totQty,totPcs,issuedata[m].weight,issuedata[m].gpcs,ciQty,ciPcs]);
                                      console.log(report1[n])
                                      console.log(report1)
                                     // console.log(nietos)
                                      $scope.reportonedate1 = report1;
                                      // console.log($scope.reportonedate1)
                                  }



                             }


                          } 







                            })
        }

     }) //'/itemreport2'
  var x3 = yield $http.get('/itemreport2').success(function(response){
                  // console.log("loop "+itemgroup.length)
                  //  console.log("entereefnnn loop "+receivedata1.length)
                                
                //for m

                        })



}//gen2
var mygen2 = gen2()
console.log(mygen2.next())
console.log(mygen2.next())
//console.log(mygen2.next())
}();

}]);