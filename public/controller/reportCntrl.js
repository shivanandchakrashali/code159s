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

var fixdec =2;
//radiobutton()
$scope.radiobutton1 = function(){
	console.log("entered into radiobutton1");
   $scope.reportonedate1 = null;
  // if( $scope.radio.report != "itemName" ){
  //     //$scope.reportpurity = "purity";
  //  // alert("it is purity")
  // }
	//alert($scope.radio.transaction);

}

//preview function
//$scope.reportpurity ='purity';
$scope.preview = function(){
    var receivedata = null;
    var issuedata = null;
    var report1 =[];
    var reportdate   = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
   

    var reportdata = $scope.radio.transaction+","+$scope.radio.barcode+","+$scope.radio.weight+","+$scope.radio.report+","+reportdate ;
    console.log(reportdata)	
    //var nietos = [];
    if($scope.radio.report =='itemName'){
        //alert("itemname")
      genWrap1( function* (){
        //function* gen(){
  
        var x = yield $http.get('/receiveonedate/'+reportdata ).success(function(response){
                       // $scope.reportonedate2= response
                      // alert("enetere x")
                       //   console.log("/receiveonedate/")
                          console.log(response)
                          receivedata = response; 

                });
          //console.log(x)
        var y = yield $http.get('/issueonedate/'+reportdata ).success(function(response){
                       // $scope.reportonedate2= response
                     //   alert("enetere x")
                        //  console.log("/issueonedate/")
                          console.log(response)
                          issuedata = response;
                         // console.log(issuedata )
                         // console.log(receivedata)
                         // console.log(receivedata[0]._id)
                         // console.log(issuedata.length )
                         // console.log(receivedata.length)
                          for(let m = 0; m<issuedata.length ; m++){
                             // console.log("loop m "+m)
                             // alert("loopm "+m)
                             for(let n = 0; n<receivedata.length ; n++){
                                // console.log("loop m "+m+" n loop "+n)
                                  // alert("loopmn "+n)
                                 // console.log(issuedata[m]._id)
                                  // console.log(receivedata[n]._id)
                                  if(issuedata[m]._id == receivedata[n]._id ){
                                   // console.log("if if if loop")

                                    // alert("loopmif loop "+m)
                                    var opQty = 0;
                                    var opPcs = 0;
                                    var totQty = 0;
                                    var totPcs = 0;
                                    var ciQty = 0;
                                    var ciPcs = 0;
                                     // console.log(issuedata[m])
                                    //console.log(receivedata[n])
                                    // totQty = opQty + issuedata[m].weight;
                                    // totPcs = opPcs + issuedata[m].gpcs;
                                    totQty =( opQty + receivedata[n].weight).toFixed(fixdec) ;
                                    totPcs = (opPcs + receivedata[n].gpcs).toFixed(fixdec);

                                    ciQty = (totQty -issuedata[m].weight).toFixed(fixdec) ;
                                    ciPcs = (totPcs - issuedata[m].gpcs ).toFixed(fixdec);
                                     //   console.log("m "+m+" n "+n + "totQty "+totQty + " totPcs "+totPcs);
                                     console.log("receivedata[n].weight "+receivedata[n].weight+"receivedata[n].gpcs "+receivedata[n].gpcs); 
                                    
                                     console.log("issuedata[m].weight "+issuedata[m].weight+"issuedata[m].gpcs "+issuedata[m].gpcs); 
                                     console.log("opQty "+opQty +"opPcs "+opPcs + "totQty "+totQty + " totPcs "+totPcs);
                                     if(issuedata[m].gpcs == null){
                                      issuedata[m].gpcs = 0;
                                     }
                                     if(issuedata[m].weight == null){
                                      issuedata[m].weight = 0;
                                     }
                                     if(receivedata[n].gpcs == null){
                                      receivedata[n].gpcs = 0;
                                     }
                                     if(receivedata[n].weight == null){
                                      receivedata[n].weight = 0;
                                     }
                         
                                   var obj = {};
                                   obj["item"] = issuedata[m]._id;
                                   obj["opQty"] = (opQty).toFixed(fixdec);
                                   obj["opPcs"] = (opPcs).toFixed(fixdec);
                                   obj["rcvQty"] = (receivedata[n].weight).toFixed(fixdec);
                                   obj["rcvPcs"] = (receivedata[n].gpcs).toFixed(fixdec);
                                   obj["totQty"] = totQty;
                                   obj["totPcs"] = totPcs;
                                   obj["issQty"] = (issuedata[m].weight).toFixed(fixdec);
                                   obj["issPcs"] = (issuedata[m].gpcs).toFixed(fixdec);
                                   obj["ciQty"] = ciQty;
                                   obj["ciPcs"] = ciPcs;
                                   report1.push(obj);
                                    // report1.push([issuedata[m]._id,opQty,opPcs,receivedata[n].weight,
                                    // receivedata[n].gpcs,totQty,totPcs,issuedata[m].weight,issuedata[m].gpcs,ciQty,ciPcs]);
                                     // console.log(report1[n])
                                     // console.log(report1)
                                     // console.log(nietos)
                                    //  $scope.reportonedate1 = report1;
                                      // console.log($scope.reportonedate1)
                                      // var p = $q.defer()
                                      //  p = $q.all(report1[n]).then(function (res) {
                                      //     //return for chaining
                                      //      return res[1];
                                      //   });
                                       //push promise to list
                                     //  report1.push(obj);
                                  } //if

                                  //consolidate promises    
                                  $scope.reportonedate1 = report1;
                                     
                             }//let n


                          } //let m

                         // console.log("tyriuriri")

           });
        


      })//gen


        function genWrap1(generator){

          var gen = generator();

          function handle(yielded){
        if(!yielded.done){
           console.log(yielded)
            yielded.value.then(function(data){
            return handle(gen.next())
          })
        }
      }
      return handle(gen.next())
      }


    }//itemname

    if($scope.radio.report =='purity'){
      //alert("puritytyty")

      var itemgroup =[]
      var receivedata1 = null;
      //var issuedata1 = null;
      var report1 =[];
      var  printary = [];
      var lengthitemNamesort = null;
      var printfinalary = []
      // var purity2 = function(){

      genWrap( function* (){
          var reportdate   = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
   
          var reportdata = $scope.radio.transaction+","+$scope.radio.barcode+","+$scope.radio.weight+","+$scope.radio.report+","+reportdate ;
         // console.log(reportdata)
          var x1 = yield $http.get('/receiveonedate/'+reportdata ).success(function(response){
                       // $scope.reportonedate2= response
                          //console.log("/receiveonedate/")
                         console.log(response)
                          receivedata1 = response; 
                         // console.log(" x1 = yield ")
                });

          var x2 = yield $http.get('/itemreport2').success(function(response){
  
                 var itemNamesort = response; 
                  //  console.log(itemNamesort.length)
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
                            // console.log(itemgroup1)
            
                         })
                  }
                 console.log(" x2 = yield ")
                }) //'/itemreport2'
          //yield not working for loop so $http.get written
          var x3 = yield $http.get('/itemreport2').success(function(response){
                   //console.log("loop "+itemgroup.length)
                  //  console.log("entereefnnn loop "+receivedata1.length)
                
                     for(let m = 0; m<receivedata1.length  ; m++){
                             // console.log(receivedata1)
                             // console.log("loop "+lengthitemNamesort)
                             for(let n = 0; n<itemgroup.length ; n++){
                             // console.log("loop m "+m+" n loop "+n)
                                  
                                if(receivedata1[m]._id.itemName == itemgroup[n].itemName && receivedata1[m]._id.purity == itemgroup[n].purity ){
                                 console.log(" inside loop m "+m+" n loop "+n)
                                    // console.log(receivedata1[m]._id.itemName+itemgroup[n].itemName )
                                    // console.log(receivedata1[m]._id.purity+itemgroup[n].purity )
                                    
                                    var opQty = 0;
                                    var opPcs = 0;
                                    var totQty = 0;
                                    var totPcs = 0;
                                    var ciQty = 0;
                                    var ciPcs = 0;
                                   //  if(issuedata[m] == null){
                                   //    issuedata[m] = 0;
                                   //  }
                                   // console.log(issuedata[n])
                                   
                                    if(receivedata1[m].gpcs == null){
                                      receivedata1[m].gpcs = 0;
                                      //alert("null gpcs");
                                    }
                                    if(receivedata1[m].weight == null){
                                      receivedata1[m].weight = 0;
                                      //alert("null weight");
                                    }

                                    if(itemgroup[n].issPcs== null){
                                      itemgroup[n].issPcs = 0;
                                     // alert("null gpcs");
                                    }
                                    if(itemgroup[n].issQty == null){
                                      itemgroup[n].issQty = 0;
                                     // alert("null weight");
                                    }
                                     console.log(receivedata1[m])
                                    totQty = (opQty + receivedata1[m].weight).toFixed(fixdec);
                                    totPcs = (opPcs + receivedata1[m].gpcs).toFixed(fixdec);
                                    ciQty = (totQty-itemgroup[n].issQty).toFixed(fixdec);
                                    ciPcs =  (totPcs-itemgroup[n].issPcs).toFixed(fixdec);
                                     console.log(" after loop m "+m+" n loop "+n);
                                  
                                    // totQty = (opQty + receivedata1[m].weight);
                                    // totPcs = (opPcs + receivedata1[m].gpcs);
                                    // ciQty = (totQty-itemgroup[n].issQty);
                                    // ciPcs =  (totPcs-itemgroup[n].issPcs);
                                     
                                     
                                    //  totQty =( opQty + receivedata[n].weight).toFixed(fixdec) ;
                                    // totPcs = (opPcs + receivedata[n].gpcs).toFixed(fixdec);

                                    // ciQty = (totQty -issuedata[m].weight).toFixed(fixdec) ;
                                    // ciPcs = (totPcs - issuedata[m].gpcs ).toFixed(fixdec);
                                     

                                   var obj = {};
                                   obj["item"] = itemgroup[n].itemName;
                                   obj["opQty"] = opQty;
                                   obj["opPcs"] = opPcs;
                                   obj["rcvQty"] = (receivedata1[m].weight).toFixed(fixdec);
                                   obj["rcvPcs"] = (receivedata1[m].gpcs).toFixed(fixdec);
                                   obj["totQty"] = totQty;
                                   obj["totPcs"] = totPcs;
                                   obj["issQty"] = (itemgroup[n].issQty).toFixed(fixdec);
                                   obj["issPcs"] = (itemgroup[n].issPcs).toFixed(fixdec);
                                   obj["ciQty"] = (ciQty);
                                   obj["ciPcs"] = (ciPcs);
                                   obj["group"] = itemgroup[n].Group;
                                   obj["purity"] = itemgroup[n].purity;
                                   report1.push(obj);
                                    // report1.push([issuedata[m]._id,opQty,opPcs,receivedata[n].weight,
                                    // receivedata[n].gpcs,totQty,totPcs,issuedata[m].weight,issuedata[m].gpcs,ciQty,ciPcs]);
                                      // console.log(report1[n])
                                     // console.log(report1)
                                    //  $scope.reportonedate1 = report1;
                                     // console.log(nietos)
                                   //  console.log(report1.length)
                                   //  $scope.reportonedate1 = report1;
                                      // console.log($scope.reportonedate1)
                                  }

                             }


                      } 


                      console.log(" x3 = yield ");

                 }) //item2
                            //direct for loop not working so using this
            var x4 = yield $http.get('/itemreport2').success(function(response){
                      for(let k = 0;k< report1.length;k++){
                         //console.log(report1[k])
                        // console.log(report1[k].group)
                        // console.log(report1[k].purity)
                         //console.log(report1[k].item)
                          if( printary.indexOf(report1[k].group) == -1) {
                                 // alert("entered to remove duplicates ")
                               var obj3 = {};
                                obj3["group"] = report1[k].group;
                            
                                 
                                   
                                 printary.push(report1[k].group);
                                  printfinalary.push(obj3)
                                 // console.log(printary)
                                  //  alert(arrcon)
                         }
                         if( printary.indexOf(report1[k].purity) == -1) {
                         // alert("entered to remove duplicates ")
                           var obj3 = {};
                           
                            obj3["purity"] = report1[k].purity;
                            printary.push(report1[k].purity);
                             printfinalary.push(obj3)
                             var obj = {};
                                   obj["item"] = report1[k].item;
                                   obj["opQty"] = report1[k].itemopQty;
                                   obj["opPcs"] = report1[k].itemopPcs;
                                   obj["rcvQty"] = report1[k].rcvQty;
                                   obj["rcvPcs"] = report1[k].rcvPcs;
                                   obj["totQty"] = report1[k].totQty;
                                   obj["totPcs"] = report1[k].totPcs;
                                   obj["issQty"] = report1[k].issQty ;
                                   obj["issPcs"] = report1[k].issPcs;
                                   obj["ciQty"] = report1[k].ciQty;
                                   obj["ciPcs"] = report1[k].ciPcs;
                                   printfinalary.push(obj)
                          // console.log(printary)
                           $scope.reportonedate1 =printfinalary;
                            console.log(" x4 = yield ");
                           //  alert(arrcon)
                         }else{
                                   var obj = {};
                                   obj["item"] = report1[k].item;
                                   obj["opQty"] = report1[k].opQty;
                                   obj["opPcs"] = report1[k].opPcs;
                                   obj["rcvQty"] = report1[k].rcvQty;
                                   obj["rcvPcs"] = report1[k].rcvPcs;
                                   obj["totQty"] = report1[k].totQty;
                                   obj["totPcs"] = report1[k].totPcs;
                                   obj["issQty"] = report1[k].issQty ;
                                   obj["issPcs"] = report1[k].issPcs;
                                   obj["ciQty"] = report1[k].ciQty;
                                   obj["ciPcs"] = report1[k].ciPcs;
                                   printfinalary.push(obj)
                                    //   console.log(printary)
                                     $scope.reportonedate1 =printfinalary;
                                     // console.log(" x4 = yield ");

                              }
                     
                       }//for loop
               

                 })//4

        });//gen2

function genWrap(generator){

  var gen = generator();

  function handle(yielded){
    if(!yielded.done){
      console.log(yielded)
      yielded.value.then(function(data){
      return handle(gen.next())
      })
    }
  }
  return handle(gen.next())
}


}//purity



}//preview





// var mygen2 = gen2()
// console.log(mygen2.next())
// console.log(mygen2.next())
//console.log(mygen2.next())
//}();purity

}]);