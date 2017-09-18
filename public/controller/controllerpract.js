var myApp=angular.module('myApp',[]);     
myApp.controller('FirstCntrl',['$scope','$http','$window','$timeout','$filter','$q',
function($scope,$http,$window,$filter,$q,$timeout){
    $scope.ordmat="";
    $scope.schmat="";
    $scope.totmat="";
    var fixdec= null;
    /*$scope.bill=$scope.billtype;
    alert($scope.bill);*/

   /* $scope.adjqty= parseFloat($scope.ordmat)+parseFloat($scope.schmat)
    alert($scope.adjqty);*/
    $scope.userit=[];
    $scope.useritbill=[];
    $scope.useritsplit=[];
    $scope.radiowithinstate = "withinstate";
    //edit in list page
    var voucherNoGet = null;
    //$scope.payButton = "false" ;
    //alert($scope.payButton);
      //change save to update and pay to print
   $scope.edituseritButton = null;
    
   var indexvalue = 0; //this is for making index global value
    //for radio default
    $scope.radio = {
        state:'with in state'  
      };
//for tax interest values
      var interest1 = 0;
        var interest2 = 0;
         var interest3 = 0;
         var labourTaxInterest = 0;
         var lastdate = null;
         //for labour tax validation
          $scope.LabourTax = null;
          //for weight tolerance in gwt
           $scope.WeightTolerance = null;
          var saleInvoceEditId = null;
          var editedInvoice = null;
      // $scope.item =[]
      // $scope.item.withinstatecgst = 1000
//for radio button with in state and out of state column generation

//validation purpose
// if($scope.bitem.date == undefined ||$scope.bitem.ItemName == undefined ||$scope.bitem.stockin == undefined || $scope.bitem.stockout == undefined ||$scope.bitem.wt == undefined || $scope.bitem.pcs == undefined || $scope.bitem.titems == undefined){
   


//    }


$scope.radiobutton=function(){
        //alert(indexvalue)
        // taxamtcal(indexvalue)
        if($scope.radio.state == "with in state"){
           $scope.radiowithinstate = "withinstate"
              //get tax value in index page
             
           $http.get('/gettaxwithinstate').success(function(response){
                            interest1 = response[0].Rate
                            interest2 = response[1].Rate
                   // taxamtcal(indexvalue)    
           });

        }else{

                 $scope.radiowithinstate = "outofstate"
                     //get tax value in index page
                 $http.get('/gettaxoutofstate').success(function(response){
                          // $scope.outofstateigst = response[0].Rate
                          interest3 = response[0].Rate
                 });
             }
      //  taxamtcal(indexvalue)

}  
$scope.radiobutton()
//get sales person names
$http.get('/getSalesPerson').success(function(response){
        $scope.salesperson=response;
        //alert($scope.res);
});

$http.get('/user').success(function(response){
        $scope.res=response;
        //alert($scope.res);
});
//latest date using db
$http.get('/getinventorygroupvaluenotationlast').success(function(response){
                     console.log(response);  
                     console.log(response[0].date);
                      lastdate = response[0].date         
                 });
//for tax amount calculation
var taxamtcal = function($index){
        
    //alert("taxamtcal  taxamtcal ")
        console.log($scope.userit[$index])
       
       // alert(" entered taxamtcal  $scope.userit[$index].gwt "+$scope.userit[$index].gwt)
        // if($scope.userit[$index].stwt == undefined ||$scope.userit[$index].stwt == ""){
        //        $scope.userit[$index].stwt = 0 
        //  }
       
        if($scope.userit[$index].labval== undefined || $scope.userit[$index].labval==""){
               $scope.userit[$index].labval = 0 
         }

         if($scope.userit[$index].stval == undefined ||$scope.userit[$index].stval == ""){
               $scope.userit[$index].stval = 0 
         }
         $scope.userit[$index].ntwt = $scope.userit[$index].gwt - $scope.userit[$index].stwt
                 
         //labour tax reason
         if($scope.LabourTax == "Yes"){
            var calcu = (($scope.userit[$index].chgunt*$scope.userit[$index].rate)+parseInt ($scope.userit[$index].stval)).toFixed(fixdec)
          
         }else{
                   var calcu = (($scope.userit[$index].chgunt*$scope.userit[$index].rate)+parseInt ($scope.userit[$index].labval)+parseInt ($scope.userit[$index].stval)).toFixed(fixdec)
               }
            if($scope.transaction == "Regular Sale"){
                if($scope.radiowithinstate == "withinstate"){
                   // alert(" withinstate call ")
                   //var cgst1 = parseFloat((calcu*interest1)/100).toFixed(fixdec)
                     // alert("cgst1 "+cgst1)
                    $scope.userit[$index].withinstatecgst = parseFloat((calcu*interest1)/100).toFixed(fixdec)
                 //  $scope.userit[$index].withinstatecgst = ( $scope.userit[$index].withinstatecgst).toFixed(fixdec)
                    
                    //var sgst1 = parseFloat((calcu*interest2)/100).toFixed(fixdec)
                   // alert("sgst1 "+sgst1)
                    $scope.userit[$index].withinstatesgst =parseFloat((calcu*interest2)/100).toFixed(fixdec)
                  //  $scope.userit[$index].withinstatesgst = ($scope.userit[$index].withinstatesgst).toFixed(fixdec)
                   //var total12 = parseFloat(cgst1) + parseFloat(sgst1);
                   //alert("total12 "+total12)
                 //  var final12 =  (total12 + parseFloat(calcu)).toFixed(fixdec)
                  // alert("final12 "+final12) 
                    $scope.userit[$index].taxamt = parseFloat($scope.userit[$index].withinstatecgst) +parseFloat($scope.userit[$index].withinstatesgst)
                    $scope.userit[$index].taxamt = ($scope.userit[$index].taxamt).toFixed(fixdec)
                   // alert("$scope.userit[$index].taxamt "+$scope.userit[$index].taxamt)
                    $scope.userit[$index].final = (parseFloat($scope.userit[$index].taxamt) + parseFloat(calcu)).toFixed(fixdec)
                   // $scope.userit[$index].taxval1.toFixed(fixdec);
                }else{
         
                     $scope.userit[$index].outofstateigst =((calcu*interest3)/100).toFixed(fixdec);
                     $scope.userit[$index].taxamt =  parseFloat($scope.userit[$index].outofstateigst);
                     $scope.userit[$index].taxamt = ($scope.userit[$index].taxamt).toFixed(fixdec);
                      $scope.userit[$index].final = (parseFloat($scope.userit[$index].taxamt) + parseFloat(calcu)).toFixed(fixdec)
                  
                    }
           }else if($scope.transaction == "Urd Purchase"){
                    $scope.userit[$index].taxamt = 0;
                    $scope.userit[$index].final = calcu;
                    //alert( $scope.userit[$index].final);
                   }

}


$scope.bar=function()
{
   // alert("hi")
}
$scope.billType=function()
{
    $scope.billt=$scope.billtype;
    //alert($scope.bill);
    console.log( $scope.billt)
     window.sessionStorage.setItem("Billtype",$scope.billt);
}
//for validation
$scope.reqColor = function() {
    
    if ($scope.transaction && $scope.partyname != undefined){
      return false; 
     // $scope.all = true;
    } else{
      return true;
    }
    
  }
//for validation
$scope.reqColorPay = function() {
   // alert("reqColorPay")
    if ($scope.transaction && $scope.partyname != undefined){
      console.log("reqColorPay")
      if($scope.transaction == "Urd Purchase"){
        return true; 
      }else{
        return false;
      }
      
     // $scope.all = true;
    } else{
      // if($scope.transaction == "Urd Purchase"){
      //   return false;
      // }else{
      console.log("true else")
        return true;
     // }
      
    }
    
  }


$scope.itemSelect = function(itemname,in1) {
      // alert("itemSelect itemSelect "+in1)
      if(in1 != undefined ){
 
          $scope.userit[in1] = ""
  
         console.log($scope.userit[in1])
         $scope.userit[in1].itemName =itemname 
         //alert("inside loop look")
      }
      $scope.userit[in1]  =JSON.parse(window.sessionStorage.getItem("Str41"));
      console.log($scope.userit[in1])
      $scope.userit[in1].itemName =itemname    

      for(a=0;a<$scope.items.length;a++){
       
          if (itemname == $scope.items[a].Name){
                 // alert("$scope.items[i].Name "+$scope.items[i].Name)
                    console.log($scope.items[a].InvGroupName)
                  $http.get('/itemdetails'+$scope.items[a].InvGroupName).success(function(response){
                            console.log(response);
                            console.log(response[0].PurchaseAcc);
                            if($scope.transaction =="Urd Purchase"){
                               $scope.userit[in1].accNumbers = response[0].PurchaseAcc; 

                             }else if($scope.transaction =="Regular Sale"){
                                $scope.userit[in1].accNumbers = response[0].SalesAcc;
                             }
                           
                           

                            console.log(lastdate)
                           // alert(lastdate)
                            var itempuritydata = response[0].InvGroupID +","+lastdate;
                       $http.get('/itemPurityDetails'+itempuritydata).success(function(response){
                              console.log(response)
                             $scope.irate=response; 
                             // $scope.userit[in1].irate = response
                              $scope.userit[in1].irate = response
                            })   
            
                    })
              break;
          }    
       
       }

  
}

// for history selection
$scope.row1 = function(tag){
   // console.log("this is row id"+id);
  console.log("u clicked on row 1");
  console.log(tag.barcodeNumber)
  $scope.idSelectedVote = tag;
  console.log($scope.idSelectedVote)
  $http.get('/history',{params:{"barcode":tag.barcodeNumber}}).success(function(response)
        { 
            console.log(response)
            $scope.userit = response;

        })
    $scope.finalCal();

  }

   //$scope.amt.adj = null//18/4
   var  saleinvsubtol =null;
   var cal = 0;
   $scope.adjqty = null; 
   // var irateresult = null;
    // var index4 = 0;
    // var promises = [];
   var arrcon = []; 

   //urd ids
   // var urdids = function(urdids){
   //   if($scope.transaction == "Urd Purchase"){
   //          //alert("Urd and ");
   //          //this for sending ids to print in invoice
   //          if(arrurdid.indexOf(urdids) == -1) {
   //           // alert("entered to remove duplicates ")
   //             arrurdid.push(urdids);
   //           //  window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
     
   //             console.log(arrurdid)
   //            // alert(arrcon)
   //            }
   //          }

   //             window.sessionStorage.setItem("userids",JSON.stringify(arrurdid));
     
   // }

$scope.updateEditTransaction = function(){
 // alert("updateEditTransaction call")
 console.log($scope.userit);
 console.log($scope.userit.length);
 var lengthuserit = $scope.userit.length ;
 for(let v =0;v<lengthuserit ; v++){
  $http.put('/useritupdate',$scope.userit[v]).success(function(response)
       {
                                             
           console.log(response[0]);
           // $scope.getDetails();
            console.log(arrcon)
           
       })
}
               $scope.saleinv[0].partyname=$scope.partyname;
               var saleInvoiceStatus = "completed";
                var update=saleInvoceEditId+","+$scope.saleinv[0].partyname+","+$scope.saleinv[0].taxableval+","+$scope.saleinv[0].tax+","+$scope.saleinv[0].subtol
                +","+$scope.saleinv[0].adj+","+$scope.saleinv[0].labourValue+","+$scope.saleinv[0].labourtax+","+saleInvoiceStatus;
                console.log(update)
                $http.put('/saleinvoicedata12/'+update).success(function(response)
                     {
                          //$scope.result = response;
                        //  console.log(response);
                         // alert("enterd into not null saleinv")
                     window.sessionStorage.setItem("saleinvoicedata_id",saleInvoceEditId);
                     window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
                     window.sessionStorage.setItem("transact", $scope.transaction);
                     window.sessionStorage.setItem("editedInvoice", editedInvoice);
                     
                     })
                alert("updated successfully");

}


$scope.getDetails=function(){
       //  arrcon = [];
     // to make url change based on requirement    
     var url = null ; 
    
     if(voucherNoGet != null){
         url = '/voucherNoGetDetails' ;
         alert("'/voucherNoGetDetails'")
     }else{
          url =  '/userit' ; 
     }
      // $http.get('/voucherNoGetDetails/'+voucherNoGet)

     $http.get(url,{params:{"partyname":$scope.partyname,"Transaction":$scope.transaction,"voucherNo":voucherNoGet}}).success(function(response){
     voucherNoGet = null;
     $scope.userit=response;
     var arrlength =response.length ;
        //  var datastore = response;
        //  index4 = 0 ;
         console.log(response);
        // alert("in getdetails "+response.length)
         window.sessionStorage.setItem("Party",$scope.partyname);

        

         (async function loop() {
    for (let i = 0; i <= arrlength-1; i++) {
        await new Promise(resolve => setTimeout(resolve,
       // Math.random()
    $http.get('/itemnamedetails'+$scope.userit[i].itemName).success(function(response){
                               
                            
                       $http.get('/itemdetails'+response[0].InvGroupName).success(function(response){
                             console.log(response);
                            console.log(response[0].PurchaseAcc);
                            if($scope.transaction =="Urd Purchase"){
                               $scope.userit[i].accNumbers = response[0].PurchaseAcc; 

                             }else if($scope.transaction =="Regular Sale"){
                                $scope.userit[i].accNumbers = response[0].SalesAcc;
                             }
                           
                           var itempuritydata = response[0].InvGroupID +","+lastdate;
                       $http.get('/itemPurityDetails'+itempuritydata).success(function(response){
                           
                         //   console.log(index4)
                               $scope.userit[i].irate = response
                               
                               console.log($scope.userit[i].irate)
                            //   index4++
                               // alert("inside http "+n)
                            })   
            
                        })
                   })  






        ));


        console.log(i);
        //only regular sale
          if($scope.transaction == "Regular Sale" ||$scope.transaction == "Urd Purchase" ){
           // alert("Urd and regular sale")
            //this for sending ids to print in invoice
            if(arrcon.indexOf($scope.userit[i]._id) == -1) {
             // alert("entered to remove duplicates ")
               arrcon.push($scope.userit[i]._id);
               window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
     
               console.log(arrcon)
              //alert(arrcon)
              }
            }

              window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
     

    }
})(); //awiyt

})

 if(voucherNoGet == null ||$scope.transaction == "Regular Sale" ){
      $scope.finalCal(); 
     }
//trial ends
 }
//for edit item to get 
  // $scope.userit = window.sessionStorage.getItem("edit");
  // console.log( $scope.userit)
  // $scope.studentt3=JSON.parse(window.sessionStorage.getItem("Str3"));
  // console.log($scope.studentt3)
 var edituserit=JSON.parse(window.sessionStorage.getItem("Str3"));
 if(edituserit!=null){

    //change save to update and pay to print
    console.log(edituserit);
     $scope.edituseritButton = true;
    //console.log($scope.userit[0] = edituserit)
    // window.sessionStorage.setItem("voucherNo", voucherNoEdit);
     voucherNoGet = window.sessionStorage.getItem("voucherNo");
   editedInvoice = voucherNoGet
      $http.get('/voucherNoGetDetailsSaleInvoice/'+voucherNoGet).success(function(response)
        { 
            console.log(response);
            $scope.saleinv = response;
             console.log(response[0]._id);
             //alert(response[0]._id);
             saleInvoceEditId = response[0]._id ;

        })

      $scope.getDetails();
     // $http.get('/voucherNoGetDetails/'+voucherNoGet).success(function(response)
     //    { 
     //      console.log(response);
     //      console.log(response.length);
     //      var lengthedit = response.length ;
     //       //       (async function loop() {
     //       // for (let i = 0; i < lengthedit ; i++) {
     //       //     console.log("done"+i);
     //       //     await new Promise(resolve => setTimeout(resolve,$scope.userit[i] = response[i] ))
     //       //   }
     //       // })()

     //      // var k = 0;

     //      for(let m = 0; m<lengthedit;m++){
     //        $scope.userit[m] = response[m];
     //        console.log($scope.userit[m]);
     //       // k++;

     //      }
     //      //$scope.userit[0] = response[0];

     //    })
         
    console.log($scope.transaction = edituserit.Transaction)
    console.log($scope.partyname = edituserit.partyname)
    console.log($scope.partyname)
}
// var useritirate1 = function(){
//  // alert("useritirate1 ")
//   console.log(irateresult)
//   $scope.userit[0].irate = null;
// $scope.userit[0].irate = irateresult
// console.log($scope.userit.irate)
//  alert($scope.userit.irate)
// }
 $scope.finalCal=function()
 {
     console.log($scope.partyname)
      console.log($scope.transaction)
       
 $http.get('/getsaleinv',{params:{"name":$scope.partyname,"Transaction":$scope.transaction}}).success(function(response){
           
        // thhis displaayed in confirm page also
        console.log(response)
        $scope.saleinv=response;
         if($scope.saleinv.length!=0){
                        $scope.discount = parseFloat (response[0].dis);
                        $scope.discount1 =parseFloat (response[0].dis);
                        $scope.ccamt =  parseFloat (response[0].char);
                        $scope.ccamt1 = parseFloat( response[0].char);
                      }
       
        console.log($scope.saleinv)
        console.log($scope.saleinv.length)
        
        if($scope.saleinv.length==0 && $scope.transaction == "Regular Sale")
        {
         console.log("$scope.saleinv.length==0")
            $scope.saleinv.push({
                'taxableval':0,
                'tax':0,
                'dis':0,
                'char':0,
                'subtol':0,
                'adj':0,
                'netamt':0,
                'status':""
            })
            //$scope.adjqty = 0;
        }
         window.sessionStorage.setItem("saleinvoicedata_id",response[0]._id);

    })
   $http.get('/useradj',{params:{"name":$scope.partyname}}).success(function(response){
         $scope.useradj = response;
         cal = response;
          console.log(cal);
        console.log($scope.useradj)
        if($scope.useradj.length==0)
        {
            $scope.urdamt=0;
            $scope.bookamt=0;
            $scope.schamt=0;
            $scope.schmat=0;
            $scope.ordamt=0;
            $scope.ordmat=0;
        }
        else
        {
     
         console.log("in $scope.useradj.length== else ")
         console.log(response[0].urd_amt)
         console.log(response[0].sch_amt)
         console.log(response[0].rd_amt)
         console.log(response[0].partyname)
          var rd = response[0].rd_amt
          $scope.urdamt = response[0].urd_amt ;
        
           var urd =response[0].urd_amt;
            $scope.urd_amt = parseFloat(urd)
            console.log($scope.urd_amt)
          
           var sa =response[0].sch_amt;
             $scope.sch_amt = parseFloat(sa)
             console.log($scope.sch_amt)
            if($scope.transaction == "Urd Purchase"||$scope.transaction == "RD PURCHASE"){
                $scope.adjqty = 0
            }else{
      //now not using 18/5    $scope.adjqty = sa + urd +rd
          console.log(urd)
             }
             //alert()
            // console.log($scope.adjqty)
   window.sessionStorage.setItem("URD_PARTY", response[0].partyname);
   window.sessionStorage.setItem("URD_VALUE", urd);
    
     }
     })
  //$scope.getTotNetAmt()//18/4
}

         /*var refresh = function() {
         $http.get('/userit',{params:{"partyname":$scope.partyname}}).success(function(response){
        $scope.userit=response;
        window.sessionStorage.setItem("Party",$scope.partyname);
    })
     }
     refresh();*/
/*$http.get('/userit'+$scope.partyname).success(function(response){
        $scope.userit=response;
    })*/
         
     var adjbal="";
     $scope.rate="";
     $scope.totalTaxableVal="";
     $scope.totalTaxVal="";
     $scope.subTotVal="";
     $scope.gwtarr=[];
     $scope.netwtarr=[];
     console.log("hi"+$scope.netwtarr);
     $scope.chararr=[];
     $scope.wasarr=[];
     $scope.taxablearr=[0];
     $scope.taxarr=[0];
     $scope.totvalarr=[0];
     $scope.stwt=[];
     //25/5  $scope.partyname="";
     // $scope.partyname="";
     $scope.irate=[];
     $scope.rate=[];
     $scope.ftaxable="";

    //var refresh = function() {
     /*$http.get('/userit').success(function(response){
        $scope.userit=response;
    })*/
$http.get('/itemrate').success(function(response){
        $scope.irate=response;
        //alert($scope.irate[0].rate);
    })

// $scope.taxvalchange = function(){
//     alert("change call ")
// }
// $scope.$watch('taxval', function(newvalue,oldvalue) {
//     alert("change call ")
//             });
$scope.purityCal=function(val,purity){
        
       //alert("purity calculation function called"+purity.Rate+purity)
       //alert($scope.userit[val].gwt);

       for(i=0;i<$scope.irate.length;i++)
       {
          if (purity == $scope.irate[i].ValueNotation)
          {
              $scope.userit[val].rate=$scope.irate[i].Rate;
              break;
          }
        
       
       }



       
        var labvar = parseFloat($scope.userit[val].labamt)
        if(labvar==NaN){
         $scope.userit[val].labval=0;
        }
        var stvar = parseFloat($scope.userit[val].stchg)
        if(stvar==NaN){
         $scope.userit[val].stval=0;
        }

    if($scope.userit[val].gwt=="" || $scope.userit[val].gwt == "NaN" || $scope.userit[val].gwt==undefined)
    {
       // alert("null value")
        $scope.userit[val].chgunt=0;
        $scope.userit[val].ntwt=0;
        $scope.userit[val].taxval=0;
        $scope.userit[val].taxamt=0;
        $scope.userit[val].final=0;
        $scope.newwas(val,pctcal);
    }
   /* else if($scope.userit[$index].wastage!=null && $scope.userit[$index].gwt!=null)
{
    alert("not null wastage value")
    $scope.newwas($index,pctcal);

}*/
    else 
    {
        //alert("null value")
      //26/4  var gwt=$scope.userit[$index].gwt;
   //   $scope.userit[$index].gwt = 3;//added 26/4
      console.log($scope.userit[val].gwt)//added 26/4
        var gwt=$scope.userit[val].gwt;
        //alert(gwt);
   
    $scope.userit[val].ntwt=$scope.userit[val].gwt;
    if($scope.userit[val].stwt!=null)
    {
      $scope.userit[val].ntwt=$scope.userit[val].ntwt-parseFloat($scope.userit[val].stwt);
    }
    $scope.userit[val].chgunt=$scope.userit[val].ntwt;
    //alert("here is index"+$scope.userit[$index].chgunt)
    //
    //$scope.newwas($index,pctcal);
 
    $scope.userit[val].taxval=parseFloat($scope.userit[val].chgunt*$scope.userit[val].rate).toFixed(fixdec)
    //  $scope.userit[val].taxval=parseFloat($scope.userit[val].chgunt*$scope.userit[val].rate).toFixed(fixdec)
   
    console.log( $scope.userit[val].taxval);
   // alert( $scope.userit[val].taxval);
    // if($scope.userit[val].taxval == "NaN"){
    //  // alert("inside a string"+ $scope.userit[val].taxval);
    //   $scope.userit[val].taxval = 0;
    // }
    // $scope.userit[val].taxamt=$scope.userit[val].taxval/100;
    // $scope.userit[val].final=parseFloat($scope.userit[val].taxval)+parseFloat($scope.userit[val].taxamt)
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();
    $scope.getTotNetAmt();

}
}   

// $scope.weightTolerance = function($index){
//  // alert("got call weightTolerance");

//     //taking wt tolerance 10%
//     $http.get('/getbar'+$scope.userit[$index].barcodeNumber).success(function(response)
//          {

//             console.log(response[0].gwt)
//             console.log(response[0])
//             //alert(response[0].barcode) 
//             var upperlimit = ((response[0].gwt)*(110/100));
//             var lowerlimit = ((response[0].gwt)*(90/100));
//             console.log(upperlimit);
//             console.log(lowerlimit);
//             if($scope.userit[$index].gwt <= lowerlimit || $scope.userit[$index].gwt >= upperlimit){
//                  alert("The weight limit tolerance is 10%. Please enter weight within limit");
//                  $scope.userit[$index].gwt = response[0].gwt;
//                //  $scope.userit[$index].barcodeNumber = $scope.userit[$index].barcodeNumber;
//                  $scope.newgwt($index);
//                }
               
//          })
     
// }
 // $scope.item = []
 // $scope.item[0].gwt = 100;
 //decimal validations gpcs
 $scope.gpcsDecimals = function($index){
   $scope.userit[$index].gpcs  = (parseFloat($scope.userit[$index].gpcs)).toFixed(0);
   $scope.userit[$index].gpcs = parseFloat($scope.userit[$index].gpcs)
  
 }
 //decimal validations stwt
 // $scope.stwtDecimals = function($index){
 //   $scope.userit[$index].stwt  = (parseFloat($scope.userit[$index].stwt)).toFixed(fixdec);
 //   $scope.userit[$index].stwt = parseFloat($scope.userit[$index].stwt)
 //   $scope.newstwt($index)
 // }
$scope.findWeightTolerence =function($index){

    console.log($scope.userit)
    // alert(" blur call");
     $http.get('/getbar'+$scope.userit[$index].barcodeNumber).success(function(response)
         { 
            //$scope.item = [];
            console.log(response[0].gwt)
            console.log(response[0])
            //alert(response[0].barcode) 
            var upperlimit = ((response[0].gwt)*((100+$scope.WeightTolerance)/100));
            var lowerlimit = ((response[0].gwt)*((100-$scope.WeightTolerance)/100));
            console.log(upperlimit);
            console.log(lowerlimit);
            if($scope.userit[$index].gwt <= lowerlimit || $scope.userit[$index].gwt >= upperlimit){
                 $scope.userit[$index].gwt = response[0].gwt;
                // $scope.item.gwt = 100;
                // alert($scope.userit[$index].gwt);
                alert("the weight is not in tolerance limit");
                 
                 $scope.newgwt($index);
               }
         })

}
//var wttolerance = null;
$scope.newgwt=function($index,pctcal)
{  
    //for index specifing
    //  alert(wttolerance)
    indexvalue = $index
    console.log("i got call")
  
    //console.log($scope.userit[0].gwt)

    //alert($scope.userit[$index].gwt)
    //decimal point validation
   
    
    if($scope.userit[$index].labamt==null){
         $scope.userit[$index].labval=0;
        }

        if($scope.userit[$index].stchg==null){
         $scope.userit[$index].stval=0;
        }

    if($scope.userit[$index].gwt=="")
    {
        //alert("null value")
        $scope.userit[$index].chgunt=0;
        $scope.userit[$index].ntwt=0;
        $scope.userit[$index].taxval=0;
        $scope.userit[$index].taxamt=0;
        $scope.userit[$index].final=0;
        $scope.newwas($index,pctcal);
    }
   
    else 
    {
       
      console.log($scope.userit[$index].gwt)//added 26/4
        $scope.userit[$index].gwt  = (parseFloat($scope.userit[$index].gwt)).toFixed(fixdec);
        $scope.userit[$index].gwt  = parseFloat($scope.userit[$index].gwt)
  //alert("$scope.userit[$index].gwt "+$scope.userit[$index].gwt);
    //$scope.userit[$index].gwt = 100;
  // $scope.userit[$index].gwt = ($scope.userit[$index].gwt).toFixed(fixdec)
   //$scope.userit[$index].ntwt=(parseFloat($scope.userit[$index].gwt)).toFixed(fixdec);
      $scope.userit[$index].stwt = 0;
     $scope.userit[$index].ntwt=(parseFloat($scope.userit[$index].gwt)-parseFloat($scope.userit[$index].stwt)).toFixed(fixdec);
       
      if($scope.userit[$index].stwt!=null)
    {
      // alert("gwt ntwt  "+typeof($scope.userit[$index].ntwt)+$scope.userit[$index].ntwt);

      $scope.userit[$index].ntwt=($scope.userit[$index].ntwt-parseFloat($scope.userit[$index].stwt)).toFixed(fixdec);
    }
    $scope.userit[$index].chgunt=($scope.userit[$index].ntwt);
    $scope.userit[$index].taxval=($scope.userit[$index].chgunt*$scope.userit[$index].rate).toFixed(2);
  
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();
    $scope.getTotNetAmt();

}

/*else {
    
}*/
}

$scope.newstwt=function($index)
{
   //alert(($scope.userit[$index].stwt))
   console.log($scope.userit[$index].stwt)
  console.log(typeof($scope.userit[$index].stwt));
    // if($scope.userit[$index].stwt == undefined ||$scope.userit[$index].stwt ==  NaN||$scope.userit[$index].stwt == null){
    //   parseFloat($scope.userit[$index].stwt) = 0;
    //   alert("Nan or undefined");
       
    // }
    if($scope.userit[$index].stwt == undefined){
      // ($scope.userit[$index].stwt) = "";
      // if($scope.userit[$index].stwt ==""){
      //   alert("space")
      // }
      
       $scope.userit[$index].ntwt=(parseFloat($scope.userit[$index].gwt)).toFixed(fixdec);
        $scope.userit[$index].chgunt=($scope.userit[$index].ntwt);
        // $scope.userit[$index].chgunt=$scope.userit[$index].chgunt.toFixed(fixdec)
       
        //alert("Null or undefined"+$scope.userit[$index].chgunt);
    }else{
       var stwtCheck  = $scope.userit[$index].stwt.toString();
     // $scope.userit[$index].stwt =( $scope.userit[$index].stwt).toFixed(fixdec);
      stwtCheck = parseFloat (stwtCheck) ;
   
       var ntwtCheck =(parseFloat($scope.userit[$index].gwt)-parseFloat(stwtCheck)).toFixed(fixdec);
        ntwtCheck = (parseFloat(ntwtCheck));
        console.log(typeof(ntwtCheck));

         $scope.userit[$index].ntwt = parseFloat(ntwtCheck).toFixed(fixdec);
       // // $scope.userit[$index].ntwt = ( ($scope.userit[$index].ntwt)).toFixed(fixdec);
       // var a = ($scope.userit[$index].ntwt) ;
       //    $scope.userit[$index].ntwt= (a).toFixed(fixdec);
         //alert(a);
          $scope.userit[$index].ntwt = parseFloat( $scope.userit[$index].ntwt)
         // var num = "12.345678"
  // $scope.userit[$index].ntwt = $scope.userit[$index].ntwt.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    console.log($scope.userit[$index].ntwt );
   // alert( $scope.userit[$index].ntwt );
console.log(typeof($scope.userit[$index].ntwt));
       //  console.log($scope.userit[$index].ntwt);
         $scope.userit[$index].chgunt=( parseFloat($scope.userit[$index].ntwt)).toFixed(fixdec);
         //alert("gwt ntwt in stwt "+typeof($scope.userit[$index].ntwt)+$scope.userit[$index].ntwt);
 
      //  $scope.userit[$index].chgunt=$scope.userit[$index].chgunt.toFixed(fixdec)
      
    }
   // $scope.userit[$index].ntwt=(parseFloat($scope.userit[$index].gwt)-parseFloat($scope.userit[$index].stwt)).toFixed(fixdec);
   // $scope.userit[$index].chgunt=($scope.userit[$index].ntwt).toFixed(fixdec);
        
    $scope.userit[$index].taxval1 = parseFloat($scope.userit[$index].chgunt)*parseFloat($scope.userit[$index].rate);
    $scope.userit[$index].taxval = parseFloat($scope.userit[$index].taxval1).toFixed(2);
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();
    $scope.getTotNetAmt();
 }

$scope.newwas=function($index,pctcal)
{
  
  if(pctcal == undefined){
    alert("Please select pct");
     $scope.userit[$index].wastage = 0;
  }else{
    /*alert($scope.userit[$index].chgunt)*/
     
   // var lab= window.sessionStorage.getItem("taxv");
   $scope.userit[$index].wastage =( $scope.userit[$index].wastage).toFixed(fixdec);
   $scope.userit[$index].wastage = parseFloat ($scope.userit[$index].wastage) ;
   

    if($scope.userit[$index].wastage==null || $scope.userit[$index].wastage=="")
    {
        
        
  /*$scope.userit[$index].taxval1=lab;
         $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(fixdec);
         alert($scope.userit[$index].taxval)*/
         $scope.userit[$index].chgunt=($scope.userit[$index].ntwt).toFixed(fixdec);

    }
     else if($scope.userit[$index].wastage==undefined)
     {
       // alert("null value")
        //alert($scope.userit[$index].chgunt)
         $scope.userit[$index].chgunt=($scope.userit[$index].ntwt).toFixed(fixdec);
    }

   else if(pctcal=="AddPercent")
    {
        //alert(pctcal);
        var wastage=(($scope.userit[$index].wastage*$scope.userit[$index].ntwt)/100).toFixed(fixdec);
        //alert($scope.userit[$index].wastage);
        $scope.userit[$index].chgunt=(parseFloat($scope.userit[$index].ntwt)+parseFloat(wastage)-$scope.totmat).toFixed(fixdec);
        //alert($scope.userit[$index].chgunt);
    }
    else if(pctcal=="Add Units")
    {
        var wastage=$scope.userit[$index].wastage;
        $scope.userit[$index].chgunt=(parseFloat($scope.userit[$index].ntwt)+parseFloat(wastage)-$scope.totmat).toFixed(fixdec);
    }
    else if(pctcal=="SubPercent")
    {
       var wastage=($scope.userit[$index].wastage*$scope.userit[$index].ntwt)/100;
        //alert($scope.userit[$index].wastage);
       $scope.userit[$index].chgunt=(parseFloat($scope.userit[$index].ntwt)-parseFloat(wastage)-$scope.totmat).toFixed(fixdec);
    }
    else
    {
       var wastage=$scope.userit[$index].wastage;
       $scope.userit[$index].chgunt=(parseFloat($scope.userit[$index].ntwt)-parseFloat(wastage)-$scope.totmat).toFixed(fixdec);
    }
    //alert($scope.totmat);
     
     //alert($scope.userit[$index].chgunt);
     if($scope.userit[$index].chgunt<0)
     {
        //alert("less than 0");
        $scope.userit[$index].chgunt=0;
        $scope.userit[$index].matadj=parseFloat($scope.userit[$index].ntwt)+parseFloat($scope.userit[$index].wastage);
        $scope.totmat=$scope.totmat-$scope.userit[$index].matadj;

        $scope.userit[$index].taxval1=$scope.userit[$index].chgunt*$scope.userit[$index].rate;
        $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
        //alert($scope.userit[$index].taxval)
        window.sessionStorage.setItem("taxv",$scope.userit[$index].taxval)
        /*$scope.ftaxable=$scope.userit[$index].taxval;
        alert(ftaxable);*/
         // $scope.userit[$index].taxamt1=$scope.userit[$index].taxval/100;
         // $scope.userit[$index].taxamt=$scope.userit[$index].taxamt1.toFixed(fixdec);
         // $scope.userit[$index].final1=parseFloat($scope.userit[$index].taxval)+parseFloat($scope.userit[$index].taxamt)
         // $scope.userit[$index].final=$scope.userit[$index].final1.toFixed(fixdec);
         $scope.getTotTaxVal();
         $scope.getTotTaxAmt();
         $scope.getFinalVal();
         $scope.getTotNetAmt();

     }
     //alert($scope.userit[$index].chgunt);
    //alert($scope.userit[$index].chgunt); 
     else
      {
        //alert("else")
        //alert($scope.userit[$index].chgunt);
        //alert($scope.userit[$index].rate)
         $scope.totmat=0;
         $scope.userit[$index].matadj=0;
     
        /*This holds the adjustment material balance*/
         $scope.userit[$index].taxval=$scope.userit[$index].chgunt*$scope.userit[$index].rate;
         $scope.userit[$index].taxval=$scope.userit[$index].taxval.toFixed(2);
         //alert($scope.userit[$index].taxval);
          window.sessionStorage.setItem("taxv",$scope.userit[$index].taxval)
         // $scope.userit[$index].taxamt1=$scope.userit[$index].taxval/100;
         // $scope.userit[$index].taxamt=$scope.userit[$index].taxamt1.toFixed(fixdec);

         // $scope.userit[$index].final1=parseFloat($scope.userit[$index].taxval)+parseFloat($scope.userit[$index].taxamt)
         // $scope.userit[$index].final=$scope.userit[$index].final1.toFixed(fixdec);
         $scope.getTotTaxVal();
         $scope.getTotTaxAmt();
         $scope.getFinalVal();
         $scope.getTotNetAmt();
 }
}
}

$scope.mrpcal=function($index)
{
    //alert("hi mrp");
    //alert($scope.userit[$index].mrp)
    $scope.userit[$index].taxval=$scope.userit[$index].mrp*$scope.userit[$index].rate;
         $scope.userit[$index].taxval=$scope.userit[$index].taxval.toFixed(2);
         //alert($scope.userit[$index].taxval);
          window.sessionStorage.setItem("taxv",$scope.userit[$index].taxval)
         // $scope.userit[$index].taxamt1=$scope.userit[$index].taxval/100;
         // $scope.userit[$index].taxamt=$scope.userit[$index].taxamt1.toFixed(fixdec);

         // $scope.userit[$index].final1=parseFloat($scope.userit[$index].taxval)+parseFloat($scope.userit[$index].taxamt)
         // $scope.userit[$index].final=$scope.userit[$index].final1.toFixed(fixdec);
         $scope.getTotTaxVal();
         $scope.getTotTaxAmt();
         $scope.getFinalVal();
         $scope.getTotNetAmt();
}
 $scope.newlab=function($index,labval2)
 {
    // alert( $scope.LabourTax );

     $scope.userit[$index].labamt =( $scope.userit[$index].labamt).toFixed(fixdec);
     $scope.userit[$index].labamt = parseFloat ($scope.userit[$index].labamt) ;
   
     if($scope.userit[$index].stval == undefined){
            $scope.userit[$index].stval = 0;
        }
       
     if($scope.userit[$index].labamt=="")
       {
          // alert("space")
           $scope.userit[$index].labval = 0;
       }
     else if($scope.userit[$index].labamt==undefined)
       {
        //alert("==undefined")
         $scope.userit[$index].labval = 0;
       
       }

   if(labval2=="Percent")
    {
        //alert(labval)
        var addlab=(($scope.userit[$index].chgunt*$scope.userit[$index].rate));
        if($scope.userit[$index].labamt != null){
               var labval1=(addlab*$scope.userit[$index].labamt)/100;
               $scope.userit[$index].labval= labval1.toFixed(fixdec);
            }
         if($scope.LabourTax == "No"){   
                 $scope.userit[$index].taxval1=addlab+parseFloat($scope.userit[$index].labval)+parseFloat($scope.userit[$index].stval);
                 $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
            }else{
                 $scope.userit[$index].labourTaxValue = (($scope.userit[$index].labval*labourTaxInterest)/100).toFixed(fixdec);
            }
    }
    else if(labval2=="PerUnit")
    {
        //alert(labval);
        var addlab=(($scope.userit[$index].chgunt*$scope.userit[$index].rate))
        
        if($scope.userit[$index].labamt != null){
        var addlab1=$scope.userit[$index].chgunt*$scope.userit[$index].labamt;        
            $scope.userit[$index].labval=(parseFloat(addlab1)).toFixed(fixdec)
         }
         if($scope.LabourTax == "No"){
                 $scope.userit[$index].taxval1=addlab+parseFloat($scope.userit[$index].labval)+parseFloat($scope.userit[$index].stval);
                 $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
         }else{
            $scope.userit[$index].labourTaxValue = (($scope.userit[$index].labval*labourTaxInterest)/100).toFixed(fixdec);
         
         }
    }
    else if(labval2=="Amount")
    {
        console.log($scope.userit[$index].stval)
        console.log($scope.userit[$index].labval)
        if($scope.userit[$index].labamt != null){
        $scope.userit[$index].labval=($scope.userit[$index].labamt).toFixed(fixdec);
        }
        if($scope.LabourTax == "No"){
                $scope.userit[$index].taxval1=($scope.userit[$index].chgunt*$scope.userit[$index].rate)+parseFloat($scope.userit[$index].labval)+parseFloat($scope.userit[$index].stval);
                $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
        }else{
           $scope.userit[$index].labourTaxValue = (($scope.userit[$index].labval*labourTaxInterest)/100).toFixed(fixdec);
         
        }

    }
    $scope.labourTax();
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();
    $scope.getTotNetAmt();
    
} 
 
//var taxg =null;
 $scope.newstchg=function($index,stonecal2)
 {
    
    $scope.userit[$index].stchg =( $scope.userit[$index].stchg).toFixed(fixdec);
    $scope.userit[$index].stchg = parseFloat ($scope.userit[$index].stchg) ;
   
    if($scope.userit[$index].labamt==null)
    {
       $scope.userit[$index].labval=0;
    }
    

    if($scope.userit[$index].stchg==null)
    {
     $scope.userit[$index].stval = 0;
  
    }
     else if($scope.userit[$index].stchg==undefined)
     {
         $scope.userit[$index].stval = 0;
        /*alert("null value")
        alert($scope.userit[$index].chgunt)*/
         // $scope.userit[$index].taxval1=lab;
         // $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(fixdec);
         // //alert($scope.userit[$index].taxval)
    }
     if(stonecal2=="Percent")
    {
         //
        var addstone=(($scope.userit[$index].chgunt*$scope.userit[$index].rate));
       // alert(addstone);
       
       if($scope.userit[$index].stchg != null){
        var stval1=(addstone*$scope.userit[$index].stchg)/100;
        $scope.userit[$index].stval= stval1.toFixed(fixdec);
            }
         
        if($scope.LabourTax == "No"){

             $scope.userit[$index].taxval1=addstone+parseFloat($scope.userit[$index].stval)+parseFloat($scope.userit[$index].labval);
             $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
        
         }else{
                   
             $scope.userit[$index].taxval1=addstone+parseFloat($scope.userit[$index].stval);
             $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
        
         }
    }
    else if(stonecal2=="PerUnit")
    {
       
        var addstone=(($scope.userit[$index].chgunt*$scope.userit[$index].rate))
        
        if($scope.userit[$index].stchg != null){
        var addstone1=$scope.userit[$index].chgunt*$scope.userit[$index].stchg;        
            $scope.userit[$index].stval=(parseFloat(addstone1)).toFixed(fixdec);
         }
        if($scope.LabourTax == "No"){
            $scope.userit[$index].taxval1=addstone+parseFloat($scope.userit[$index].stval)+parseFloat($scope.userit[$index].labval);
            $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
         
         }else{
            $scope.userit[$index].taxval1=addstone+parseFloat($scope.userit[$index].stval);
            $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
         
         }
    }
    else if(stonecal2=="Amount")
    {
        console.log($scope.userit[$index].stval)
        console.log($scope.userit[$index].labval)
        
        if($scope.userit[$index].stchg != null){
        $scope.userit[$index].stval=($scope.userit[$index].stchg).toFixed(fixdec);
        }
        if($scope.LabourTax == "No"){
           $scope.userit[$index].taxval1=($scope.userit[$index].chgunt*$scope.userit[$index].rate)+parseFloat($scope.userit[$index].labval)+parseFloat($scope.userit[$index].stval);
           $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);
        
         }else{

                 $scope.userit[$index].taxval1=($scope.userit[$index].chgunt*$scope.userit[$index].rate)+parseFloat($scope.userit[$index].stval);
                 $scope.userit[$index].taxval=$scope.userit[$index].taxval1.toFixed(2);   
         }
     }

        $scope.getTotTaxVal();
        $scope.getTotTaxAmt();
        $scope.getFinalVal();
        $scope.getTotNetAmt();
  
 }

$scope.getTotTaxVal=function()
{
    taxamtcal(indexvalue) 
  //taxamtcal(0)
 // alert(" call getTotTaxVal ")
//alert($scope.saleinv[0].taxableval)
    //alert("entered totalTaxableVal")
    $scope.saleinv[0].taxableval= 0;
    
    for(i=0;i<=$scope.userit.length-1;i++)
    {
       
       $scope.saleinv[0].taxableval1=parseFloat($scope.saleinv[0].taxableval)+parseFloat($scope.userit[i].taxval);
       $scope.saleinv[0].taxableval=$scope.saleinv[0].taxableval1.toFixed(fixdec);
       
    }
    }

$scope.getTotTaxAmt=function(){
    //alert("entered totalTaxableVal")
    $scope.saleinv[0].tax=0;
    for(i=0;i<=$scope.userit.length-1;i++)
    {
        console.log($scope.saleinv[0].tax)
        
       $scope.saleinv[0].tax1=parseFloat($scope.saleinv[0].tax)+parseFloat($scope.userit[i].taxamt);
       $scope.saleinv[0].tax=$scope.saleinv[0].tax1.toFixed(fixdec);
       console.log($scope.saleinv[0].tax)
    }
    //alert("Total tax amount");
    //alert($scope.saleinv[0].tax);
}
$scope.labourTax = function (){
      $scope.saleinv[0].labourtax=0;
       $scope.saleinv[0].labourValue = 0;
    for(i=0;i<=$scope.userit.length-1;i++)
      {
        //console.log($scope.saleinv[0].tax)
        
       //$scope.saleinv[0].labourtax1=parseFloat($scope.saleinv[0].tax)+parseFloat($scope.userit[i].taxamt);
      // $scope.saleinv[0].labourValue = (parseFloat($scope.saleinv[0].labourValue)+parseFloat($scope.userit[i].labval)).toFixed(fixdec);
       // $scope.saleinv[0].labourValue = (parseFloat($scope.saleinv[0].labourValue1)).toFixed(fixdec);
        $scope.saleinv[0].labourValue = (parseFloat($scope.saleinv[0].labourValue)+parseFloat($scope.userit[i].labval)).toFixed(fixdec);
    
       $scope.saleinv[0].labourtax = (parseFloat($scope.saleinv[0].labourtax)+parseFloat($scope.userit[i].labourTaxValue)).toFixed(fixdec);
      console.log($scope.saleinv[0].labourValue)
       console.log($scope.saleinv[0].labourtax)
     }
}
$scope.getFinalVal=function(){

    //alert($scope.saleinv[0].subtol)
    //alert($scope.userit[i].final)
    //alert("entered totalTaxableVal")

    $scope.saleinv[0].subtol=0;
    for(i=0;i<=$scope.userit.length-1;i++)
    {
        if($scope.LabourTax == "Yes"){
           //  $scope.saleinv[0].labourValue = (parseFloat($scope.saleinv[0].labourValue)+parseFloat($scope.userit[i].labval)).toFixed(fixdec);
    
            if($scope.userit[i].labourTaxValue == undefined || $scope.userit[i].labval == undefined ){
               $scope.userit[i].labourTaxValue = 0;
                $scope.userit[i].labval = 0;
               console.log("inside loop")
            }
            console.log("labourValue"+$scope.userit[i].labval);
            console.log(" labourtax"+$scope.userit[i].labourTaxValue);
             console.log("final "+$scope.userit[i].final);
              console.log("subtol "+$scope.saleinv[0].subtol);
              console.log("subtol1 "+$scope.saleinv[0].subtol1);
             // alert("got call")
            $scope.saleinv[0].subtol1 = parseFloat($scope.saleinv[0].subtol)+parseFloat($scope.userit[i].final)+ parseFloat( $scope.userit[i].labourTaxValue)+ parseFloat( $scope.userit[i].labval);
            console.log($scope.saleinv[0].subtol1)
            // $scope.saleinv[0].subtol1 =  $scope.saleinv[0].subtol1 + parseFloat( $scope.saleinv[0].labourtax);
            // console.log($scope.saleinv[0].subtol1)
            $scope.saleinv[0].subtol=$scope.saleinv[0].subtol1.toFixed(fixdec);
          

         }else{
               $scope.saleinv[0].subtol1=parseFloat($scope.saleinv[0].subtol)+parseFloat($scope.userit[i].final);
               $scope.saleinv[0].subtol=$scope.saleinv[0].subtol1.toFixed(fixdec);
          }
    }
}
var urdvalue = null;
$scope.getTotNetAmt=function(){
     console.log("iam getTotNetAmt see me")
    //$scope.saleinv[0].adj = 100
    $scope.saleinv[0].netamt=0;
    for(i=0;i<=$scope.userit.length-1;i++)
    {
        console.log($scope.adjqty)
   //      //alert($scope.saleinv[0].subtol1);
   //     // alert($scope.saleinv[0].adj);
   // //changed to 18/4  $scope.saleinv[0].netamt1=$scope.saleinv[0].subtol1-$scope.saleinv[0].adj;
   //   $scope.saleinv[0].netamt1=$scope.saleinv[0].subtol1-$scope.adj;
    //alert($scope.saleinv[0].netamt1);
            $scope.saleinv[0].adj =  $scope.adjqty //21/4
            console.log($scope.transaction)
            $scope.saleinv[0].Transaction = $scope.transaction;//25/4
            if($scope.transaction =="Sale Returns" || $scope.transaction == "Urd Purchase" ||$scope.transaction == "RD PURCHASE"){
                console.log($scope.saleinv[0].adj)
     $scope.saleinv[0].netamt1=$scope.saleinv[0].subtol1;   
     //changed to 18/4  $scope.saleinv[0].netamt1=$scope
     $scope.saleinv[0].netamt=$scope.saleinv[0].netamt1.toFixed(fixdec);
     //026 urdvalue = $scope.saleinv[0].netamt;
         console.log( "$scope.saleinv[0].netamt")
      console.log( $scope.saleinv[0].netamt)
 }else{ 
    console.log(" with regular sale")
        console.log($scope.saleinv[0].adj)
     $scope.saleinv[0].netamt1=$scope.saleinv[0].subtol1-$scope.saleinv[0].adj;
   //changed to 18/4  $scope.saleinv[0].netamt1=$scope
     $scope.saleinv[0].netamt=$scope.saleinv[0].netamt1.toFixed(fixdec);
    //026 urdvalue = $scope.saleinv[0].netamt;
    console.log( "$scope.saleinv[0].netamt")
    //alert("In net amount function")
    //alert($scope.saleinv[0].netamt);
    console.log( $scope.saleinv[0].netamt)

 }
   }
}

// $scope.ccamt = 0;
// $scope.discount = 0;
var addcredit = 0;
$scope.addDis=function()
{
    // if($scope.ccamt==null)
    // {
    //   $scope.ccamt = 0;
    // }
    console.log($scope.discount)
    if($scope.discount == null){
   // alert("discount "+$scope.discount);
    // $scope.discount1 = parseFloat($scope.discount).toFixed(fixdec)
     $scope.saleinv[0].dis= 0;
     $scope.discount1 = 0;
    
    
    }else{
         $scope.discount1 = parseFloat($scope.discount).toFixed(fixdec)
         $scope.saleinv[0].dis=parseFloat($scope.discount).toFixed(fixdec);
    
    }
   
    var total=parseFloat($scope.saleinv[0].taxableval)+parseFloat($scope.saleinv[0].tax)+ parseFloat( $scope.saleinv[0].labourtax)+ parseFloat( $scope.saleinv[0].labourValue);
    $scope.saleinv[0].subtol1=total-$scope.saleinv[0].dis;
    $scope.saleinv[0].subtol=$scope.saleinv[0].subtol1.toFixed(fixdec);
    $scope.saleinv[0].netamt1=parseFloat($scope.saleinv[0].subtol) + parseFloat(addcredit);
    //alert(addcredit)
   // $scope.saleinv[0].netamt1=parseFloat($scope.saleinv[0].subtol) ;
    $scope.saleinv[0].netamt = $scope.saleinv[0].netamt1.toFixed(fixdec);
   // alert($scope.saleinv[0].netamt)
}

$scope.addCca=function()
{   
    // if($scope.discount == null){
    //   $scope.discount = 0;
    // }
   
    if($scope.ccamt==null)
    {
      //$scope.discount =0;
      alert(" if loop")
      $scope.ccamt1 = 0;

      $scope.saleinv[0].char = 0;
     
      $scope.saleinv[0].netamt1 = parseFloat($scope.saleinv[0].subtol);
      $scope.saleinv[0].netamt = $scope.saleinv[0].netamt1.toFixed(fixdec);
      console.log($scope.saleinv[0].netamt )
    }
    else
    {
      alert(" else loop")
      $scope.ccamt1 = parseFloat($scope.ccamt).toFixed(fixdec);
      addcredit =  $scope.ccamt1;
      $scope.saleinv[0].char=parseFloat($scope.ccamt).toFixed(fixdec);
      $scope.saleinv[0].netamt1=parseFloat($scope.saleinv[0].subtol)+parseFloat($scope.ccamt);
      $scope.saleinv[0].netamt = $scope.saleinv[0].netamt1.toFixed(fixdec);
      //$scope.saleinv[0].subtol-=$scope.dis;
    }
}
$scope.roundOff=function()
{
    $scope.saleinv[0].netamt=Math.round($scope.saleinv[0].netamt);
}

/*$scope.calTaxVal=function(taxable)
{

    alert($scope.item);
alert(taxable);
}*/

    $scope.useritem=[];
    console.log($scope.useritem.length);
    $scope.tableSelection = {};
    $scope.personalDetails = [
        {
            'fname':'Muhammed',
            'lname':'Shanid',
            'email':'shanid@shanid.com'
        },
        {
            'fname':'John',
            'lname':'Abraham',
            'email':'john@john.com'
        },
        {
            'fname':'Roy',
            'lname':'Mathew',
            'email':'roy@roy.com'
        }];
$scope.savedata=function(partyname,gwt,rate,total,$index)
{
    //alert("save data is called"+gwt+rate+total+" "+$index)
    $scope.userit.splice($index, 1,({
             'partyname':partyname,
               'gwt': $scope.item.gwt, 
                'rate': $scope.item.rate,
                'total': $scope.item.total,
                'taxval':$scope.item.taxval,
    }))
    console.log($scope.userit);
    window.sessionStorage.setItem("ItemData",$scope.userit);
}
$scope.totamt="";

$scope.cal=function()
{
    
    var gwt=$scope.item.gwt;
    
    var rate=$scope.item.rate;
    $scope.item.totamt=gwt*rate;

}
 $scope.addNew = function(){
   
    console.log($scope.userit)
    // alert($scope.userit)
     window.sessionStorage.setItem("Str41",JSON.stringify($scope.userit));
          
    //alert($scope.userit.length);
    //alert($scope.totmat);
    //alert($scope.netwtarr.length);
    var csfdata="party";
    
     $scope.userit.push({ 

          'name':$scope.partyname,
               'purity' : "",
               'gwt': "", 
                'rate': "",
                'total': "",
                'taxval':"",
                'matadj':$scope.totmat ,
                'irate':[]              
            });
//$scope.item.gwt=0;
//alert($scope.item.gwt);
  //$scope.stwt[$scope.userit.length-1]=0;
  $scope.netwtarr[$scope.userit.length-1]=0;
  $scope.chararr[$scope.userit.length-1]=0;
  $scope.wasarr[$scope.userit.length-1]=0;
  $scope.taxablearr[$scope.userit.length-1]=[0];
  $scope.taxarr[$scope.userit.length-1]=[0];
  $scope.totvalarr[$scope.userit.length-1]=[0];
 //$scope.userit[$index].matadj=$scope.totmat;

    //$scope.netwtarr[$scope.userit.length]=0;
     //alert($scope.userit.length);
     console.log($scope.userit);
   /* $http.put('/users/'+csfdata).success(function(response)
        {
        $scope.result=response;
        console.log($scope.result);
        refresh();*/
        //})
            $scope.personalDetails.push({ 
                'fname': "", 
                'lname': "",
                'email': "",
            });
        };

    var usercsf="party";
     /*$http.get('/userit', {params:{"name":usercsf}}).success(function(response){
        $scope.useritem=response.items;
        var count=$scope.useritem.length();
        console.log(count);
        console.log("the useritemlist are"+$scope.res);
    })*/
//removing id from arrcon array
var removeidarrcon = function(id){

//alert("removeidarrcon removeidarrcon")
          //removing arrcon value id 
          var index = arrcon.indexOf(id);

          if (index > -1) {
               arrcon.splice(index, 1);
            }
          console.log(arrcon)

}


$scope.removeSelectedRows = function() {
            
   var partyname=$scope.saleinv[0].partyname;
    var length=$scope.userit.length;
    var rowCountUi=0;
    var rowCountDb=0;
   // console.log($scope.tableSelection[index])
    console.log($scope.tableSelection[i])
    //alert("length of the table is"+length);
    //alert($scope.telection[7]);ableS

    if (0 == $scope.userit.length) {
                       // do stuff
        alert("Please Select Checkbox");
        return;
      }else{
    var r = confirm("Are you sure you want to delete this ?")
            if (r == true) {
                         
    for (var i = $scope.userit.length - 1; i >= 0; i--) {
      if ($scope.tableSelection[i]) {
        if($scope.userit[i]._id==null)
        {
          
        //delete row from data
        removeidarrcon($scope.userit[i]._id)
        $scope.userit.splice(i, 1);
         rowCountUi+=1;
        $scope.getTotTaxVal();
        $scope.getTotTaxAmt();
        $scope.getFinalVal();
        $scope.getTotNetAmt();   
        //alert(i);
    }
    else
    {
        //alert("entered into else loop delete remove");

   



        removeidarrcon($scope.userit[i]._id)
        var udelete=$scope.userit[i]._id+","+$scope.userit[i].barcodeNumber;
        console.log($scope.userit[i]._id)
        console.log($scope.userit[i])
        console.log($scope.userit[i].barcode)
        $http.delete('/userit/'+udelete).success(function(response)
            {
                 
            });
        $scope.tableSelection[i] = "";
        $scope.userit.splice(i, 1);
       rowCountDb+=1;
       $scope.getTotTaxVal();
       $scope.getTotTaxAmt();
       $scope.getFinalVal();
       $scope.getTotNetAmt(); 

         }

    //$scope.removeSelectedRows= ""
    //refresh();
   
 }
     //refresh();
}//for llop close

    if(rowCountDb>0 && (rowCountDb+rowCountUi)==length)
    {
        $http.delete('saleinv/'+partyname).success(function(response)
        {
        })
        $scope.finalCal();
        //$scope.saleinv.splice(0, 1);
    }
   }//validation loop
    //refresh();
  }//array length check
} //closing of main function
    
$http.get('/uom').success(function(response){
        $scope.uom=response;
    })

$http.get('/pct').success(function(response){
        $scope.pct=response;
    })

$http.get('/labcal').success(function(response){
        $scope.labcal=response;
    })

$scope.val="hi welcome";
var num=20.41;
var mat=Math.round(num * 100) / 100;
//alert(mat);
var numb = 123.23454;
numb = numb.toFixed(2);
    
    $scope.staff=  [
     
    ];
     
     $scope.export = function(){
        html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
            }
        });
     }
var use =null

$scope.change = function( $index){
  //this is for index value
  indexvalue = $index
  //console.log("iam changing");
  var check = null;
  //console.log( $scope.userit[$index].barcodeNumber);
  //console.log( $scope.$index.barcode);
  var barcodenum = $scope.userit[$index].barcodeNumber;
  var len = barcodenum.toString().length;
  //console.log(barcodenum.toString().length);
  if (len == 8 ){
      $http.get('/getbar'+barcodenum).success(function(response)
         { 
              //console.log(" displaying object");
              use=response[0];
            //   console.log(response)
            //  console.log(response.length)
            //  console.log(response[0].orderstatus)
            //  //this is because barcode as two matches so this way doing
            // console.log(response[response.length-1].orderStatus)
            // use.orderStatus = response[response.length-1].orderStatus//to find the latest record   
            //  //console.log(response[0]._id)
            // // console.log("use")
            //  // alert(use.orderStatus)
            //   console.log(response)
              //console.log(use.orderStatus);
             console.log(response)
             console.log(response.length)
             console.log(response[0].orderstatus)
             //this is because barcode as two matches so this way doing
            console.log(response[response.length-1].orderStatus)
            use.orderStatus = response[response.length-1].orderStatus//to find the latest record   
             //console.log(response[0]._id)
            // console.log("use")
             // alert(use.orderStatus)
              console.log(response)
              if(use.orderStatus == "completed"){
                  $scope.userit[$index].barcodeNumber="";

                }else if(use.orderStatus =="Inprogress"){            
                  $scope.userit[$index].barcodeNumber="";
               }else{
                     $scope.user[$index]=response[0];
                     if($scope.user[$index].split == "yes")
                  {
                           window.sessionStorage.setItem("splitgwt"+$index,$scope.user[$index].gwt)
                           window.sessionStorage.setItem("splitgpcs"+$index,$scope.user[$index].gpcs)
                           window.sessionStorage.setItem("splitbarcodeid"+$index,$scope.user[$index]._id)
                           window.sessionStorage.setItem("Str4",JSON.stringify($scope.user[$index]))
                           var Str5 = window.sessionStorage.getItem("Str4");
                           var temp1=JSON.parse(window.sessionStorage.getItem("Str4"));
                        }

                         $scope.userit[$index]=$scope.user[$index]
                         //alert($scope.user[$index].purity)
                         console.log($scope.userit[$index])
                       // $scope.item.purity = 0;
                        console.log($scope.userit[$index].itemName)
                //       $scope.itemSelect($scope.userit[$index].itemName,$index)
                       // $scope.userit[$index].irate = use.purity;
                        $scope.userit[$index].barcodeNumber = use.barcode 
                       
                       // alert(wttolerance)
                      //  $scope.userit[$index].purity = $scope.user[$index].purity;
                        // console.log(use.purity)
                        //console.log($scope.userit[$index].purity)
                       // $scope.userit[$index]._id = null;
                       // alert( "check in the id "+$scope.userit[$index]._id )
                        //for hsf name
                      //  alert($scope.userit[$index].itemName)
                        // $http.get('/itemsdatachange'+$scope.userit[$index].itemName).success(function(response){
                        //        console.log(response)
                        //        $scope.userit[$index].Hsc = response[0].Hsc
                        //        // alert($scope.userit[$index].Hsc)
                        //         //scope.userit[$index].Hsc)
                        //         // alert("see response")
                        //      });



                   
                   // alert( $scope.userit[$index].barcodeNumber)
                    
                   // $scope.itemSelect($scope.userit[$index].itemName,$index)
                  // $scope.itemSelect($scope.userit[$index].itemName)
                    // console.log($scope.userit[$index]);
                    // console.log( $scope.userit[$index].count); //added 13/4
                    // console.log($scope.userit[$index].name = $scope.user[$index].iname);
        //$scope.itemSelect($scope.userit[$index].itemName,$index)
                    //purity issue
         for(a=0;a<$scope.items.length;a++){
       
          if ($scope.userit[$index].itemName == $scope.items[a].Name){
                 // alert("$scope.items[i].Name "+$scope.items[i].Name)
                    console.log($scope.items[a].InvGroupName)
                  $http.get('/itemdetails'+$scope.items[a].InvGroupName).success(function(response){
                            console.log(response)
                            console.log(response[0].PurchaseAcc);
                            if($scope.transaction =="Urd Purchase"){
                               $scope.userit[$index].accNumbers = response[0].PurchaseAcc; 

                             }else if($scope.transaction =="Regular Sale"){
                                $scope.userit[$index].accNumbers = response[0].SalesAcc;
                             }
                          var itempuritydata = response[0].InvGroupID +","+lastdate;
                       $http.get('/itemPurityDetails'+itempuritydata).success(function(response){
                                 console.log(response)
                             $scope.irate=response; 
                             // $scope.userit[in1].irate = response
                              $scope.userit[$index].irate = response
                            })   
            
                    })
              break;
            }    
       
       }
   $scope.userit[$index].irate = use.purity;
                    // console.log(check)

                    $scope.getTotTaxVal();
                    $scope.getTotTaxAmt();
                    $scope.getFinalVal();
                    $scope.getTotNetAmt();
                 }//else ends here
        
        
        })

  }
    
}

// for history
$scope.history = function( ){
    console.log($scope.partyname) 
     var update=$scope.partyname;
     $http.get('/historyfetch/'+update).success(function(response)
        { 
            console.log(response)
            $scope.user = response;
        })
}
//for urd selection
var diff = 0;
var subtol = 0;
var total = 0;
var pushid = [];
//$scope.myChkModel = {}
// $scope.myChkModel = {
//                   value :true
//                  };
$scope.myClick = function(myChkModel,item){
 //alert("Push Id length:"+pushid.length)
 // $scope.myChkModel.value = true
 // alert($scope.myChkModel.value);
  // $scope.checkboxModel = {
  //      value :true
      
  //    };
    //}]);

   console.log(item._id)
   
   if(myChkModel == true){
    //alert(item.final)
    //console.log(item.final)
 // alert("If Part")
   // console.log( parseFloat ( $scope.saleinv[0].subtol))
    subtol = $scope.saleinv[0].subtol;
    total += parseFloat(item.final)
 // alert("$scope.saleinv[0].subtol "+$scope.saleinv[0].subtol)
//  alert("Total URD"+total)
// alert("item.final "+item.final)
// alert(" total "+ total)
    //total =parseInt(total)+ parseInt(item.final)
   // pushid.push(item._id) 11/7
 // alert("pushid length"+pushid.length)
    console.log(pushid);
    //console.log(total) 
   
    console.log($scope.adjqty)
   // alert($scope.adjqty)
     
     if( total >  subtol){

          if($scope.saleinv[0].netamt == 0){
            alert("Net Amount is already zero you cannot add extra amount")
            //myChkModel = false
            
          }else{
                  $scope.adjqty = subtol
                  diff = total - subtol
                  pushid.push(item._id)
                  //  alert("Diff Value:"+diff)
                  console.log( diff);
                  $scope.saleinv[0].netamt = 0;
                  $scope.getTotNetAmt();
                  urdinvoice(total,diff)
                 
               }
         
     }else{
         
    //console.log(total)
    //alert(total) 
         $scope.adjqty = total
       //  $scope.adjqty = total
         console.log(total)
         pushid.push(item._id)
         console.log($scope.adjqty)
         $scope.getTotNetAmt();

          urdinvoice(total,diff)
           }

    }else{
       // alert("Else Part  executed")
        // alert(item.final)
   // console.log(item.final)
    total = parseInt(total) - parseInt(item.final)
    //console.log(total)
    $scope.adjqty = total
    console.log($scope.adjqty)
   // alert($scope.adjqty)
     $scope.getTotNetAmt();

     urdinvoice(total,diff)

    }  
}

// urd to display invoice
var urdinvoice = function(total,diff){
     // alert("urdinvoice")
     window.sessionStorage.setItem("URD_ADJUSTED",total);
     window.sessionStorage.setItem("URD_BALANCE",diff);
}
//to make window zero when not called
if(diff == 0 && subtol == 0){
 urdinvoice(0,0) 
}
// //for final adj
// $scope.adjustment = function( ){
//     alert($scope.adjqty)
// }
//var replay =null;
$scope.urd= {}
$scope.TransactionDetails = function( ){
 

    //console.log("Transaction call  Transaction call  Transaction call  Transaction call ")
    // console.log($scope.partyname) 
    //party = $scope.partyname;
    // console.log( $scope.partyname.netamt);
    // console.log( $scope.transaction);
    window.sessionStorage.setItem("transact", $scope.transaction);
 
    if($scope.transaction == "Urd Purchase"|| $scope.transaction == "RD PURCHASE"){
         console.log($scope.transaction)
         $scope.all = $scope.transaction
     }else if($scope.transaction == "VALUATION"){
 
        $scope.all = $scope.transaction
     }else{
        $scope.all = ""
        }
 
    // var update=$scope.partyname+","+$scope.transaction;
    // console.log(update)

     if($scope.transaction == "Regular Sale" ||$scope.transaction ==  "Urd Purchase" ){
        var update=$scope.partyname+","+"Urd Purchase";
         console.log(update)
       $http.get('/transdetails/'+update).success(function(response)
         { 
            console.log(response)
            $scope.urd = response;
            console.log(response[0].date)
            // for(p =0;p<response.length;p++){
            //             $scope.date23 = response[p].date;
            //            // $scope.myDateFiltered = $filter('date')($scope.date23, 'dd/MM/yy');
            //              $scope.urd[p].date = $filter('date')(new Date($scope.date23),'dd-MMM-yyyy');  
            //            // alert($scope.myDateFiltered )
            //          }
         })

     }

    //  if($scope.transaction =="Regular Sale"){
    //  $scope.userit=[];
    //  var update=$scope.partyname+","+$scope.transaction;
    //  $http.get('/transdetails/'+update).success(function(response)
    //     { 
            
    //         console.log(response)
    //      //   $scope.userit = response;
    //         $scope.user=$scope.userit;
    //         $scope.saleinv=[];
    //         $scope.saleinv.push({
    //             'taxableval':0,
    //             'tax':0,
    //             'dis':0,
    //             'char':0,
    //             'subtol':0,
    //             'adj':0,
    //             'netamt':0,
    //             'status':""
    //         })
    //      $scope.getTotTaxVal();
    //      $scope.getTotTaxAmt();
    //      $scope.getFinalVal();
    //      $scope.getTotNetAmt();
    //     })   
    // } else  if($scope.transaction =="Urd Purchase"){
    //     $scope.userit = []
    // }
    
      //make discount and credit charges to zero when changes
      $scope.discount = null;
      $scope.ccamt = null;
      $scope.discount1 =null;
      $scope.ccamt1 = null;
         
}

$scope.user = [];
$scope.resu ;
 var flag = 0;
 //187var arrcon = [];
  // var flagCall1 = function(){
  //   alert("call me dude")
  // }
   var flagCall = function(){
            if(flag == 0){
             // alert(" validations are clear")

        console.log( $scope.partyname)
        
        
     if($scope.transaction =="Sale Returns"){
        var r = confirm("Do you want final amount to add as URD AMOUNT  "+$scope.userit[0].taxval)
         if (r == true) {
            console.log( "You pressed OK!")
          $http.post('/Transaction',$scope.userit).success(function(response)
          {  
               
            $scope.useramt= parseFloat(response[0].taxval)    
          })
          } else {
                console.log( "You not pressed OK!")
                }
     }
       
 // stockinward details when click on save      
       var stockInward = null
    if($scope.transaction =="Urd Purchase" ||$scope.transaction =="RD PURCHASE"||$scope.transaction =="Sale Returns")
       {
        stockInward ="yes"
        
         var car = data+","+ stockInward;
        console.log(car)  
         // $http.post('/transactiondetail/'+car).success(function(response)
         //      {  
         //     console.log("i got replay")
         //    console.log(response);
    
             // })
      }else if($scope.transaction =="Sale Returns"){
     
                     var car = data+","+ stockInward;
                        console.log(car)  
            $http.post('/salereturn/'+car).success(function(response)
                 {  
                     console.log("i got replay")
                    console.log(response);
                })
     }else{
        //stockInward ="yes"
                var car = data+","+ stockInward;
                console.log(car)                 
                console.log(data)
                // $http.post('/transactiondetail/'+car).success(function(response)
                //   {  
                //         console.log("i got replay")
                //          console.log(response);
                //   })
      }
        
        $scope.user = $scope.userit;
        console.log($scope.user)



        for(let i=0;i<=$scope.userit.length-1;i++)
          { 
            
             // alert("start for loop value "+i+"length of userit.length "+$scope.userit.length)
               // alert("orderstatus "+$scope.userit[i].orderStatus)

                 

               console.log($scope.userit[i])
                // alert(" $scope.userit[i].name "+$scope.userit[i].name)
                //for hsc feching

               for(j=0;j<$scope.items.length-1;j++)
                  {
                       //alert("inside loop "+$scope.items[i].Name)
                       console.log($scope.items[j])
                     if ($scope.userit[i].itemName == $scope.items[j].Name)
                         { 
                            //alert($scope.items[j])
                            console.log($scope.items[j])
                            //alert($scope.items[j].Hsc)
                            $scope.userit[i].Hsc=$scope.items[j].Hsc;
                            console.log($scope.userit[i].Hsc)
                          //  alert("i got Hsc "+$scope.userit[i].Hsc)
                            break;
                          }
                  }



                  // for transaction  types
                 $scope.userit[i].remarks = $scope.remarks
                 console.log($scope.userit[i].remarks)
           
                 console.log($scope.userit[i].date)
                 console.log($scope.userit[i].Transaction)
                 $scope.userit[i].Transaction = $scope.transaction
                 console.log($scope.userit[i].Transaction)
                 if($scope.userit[i].date == undefined){
                //  $scope.userit[i].date = "2017-04-24T12:20:18.920Z"
                     $scope.userit[i].date = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
                     $scope.userit[i].Transaction = $scope.transaction
                  }
                  // $scope.userit[i].Gwt =parseFloat($scope.userit[i].gwt)
                  //            alert($scope.userit[i].Gwt)
                  //defining fields

                 var data = $scope.transaction+","+$scope.userit[i].barcodeNumber+","+$scope.userit[i].chgunt+","+$scope.userit[i].date+","+$scope.userit[i].desc+","
                     +$scope.userit[i].final+","+$scope.userit[i].gpcs+","+$scope.userit[i].gwt+","+$scope.userit[i].itemName+","+$scope.userit[i].ntwt+","+$scope.partyname+","
                     +$scope.userit[i].size+","+$scope.userit[i].taxval+","+$scope.userit[i].taxamt+","+$scope.userit[i].stwt+","+$scope.userit[i].wastage+","+$scope.userit[i].stval+","
                     +$scope.userit[i].labval+","+$scope.userit[i].rate +","+ $scope.userit[i]._id +","+$scope.userit[i].StockFrom+","+$scope.userit[i].StockTo+","
                     +$scope.userit[i].withinstatecgst+","+$scope.userit[i].withinstatesgst +","+ $scope.userit[i].outofstateigst;
                 console.log(data)
                 console.log($scope.userit[i])
                 console.log($scope.transaction)
       
       
                 if($scope.userit[i]._id!=null)
                   {  
                      // alert("save entered $scope.userit[i]._id!=null "+$scope.userit[i]._id)
                      // console.log("$scope.userit[i]._id!=null");
                       //console.log($scope.userit[i])
                       var ordstatus = $scope.userit[i].orderStatus
                       //console.log($scope.userit[i].orderstatus)
                       //console.log($scope.userit[i]._id)
                        // $scope.userit[i]._id = null;
                       // console.log($scope.userit[i]._id)
                       if($scope.userit[i].orderStatus == "available"){
                            // alert("entered into orderstatus available")
                             $scope.userit[i]._id = null;
                             //console.log($scope.userit[i]._id)
                             //console.log("available so insert")
                             $scope.userit[i].partyname=$scope.partyname;
                               // $scope.userit[i].stockPoint ="URD treasure"
                             $scope.userit[i].StockInward = "no"
                             $scope.userit[i].orderStatus = "Inprogress"
                             
                             $http.post('/userit12',$scope.userit[i]).success(function(response)
                                  {
                                        //alert(response)
                                        console.log(response)
                                      
                                     // arrcon.push(response._id)
                                      console.log(arrcon);
                                     // alert(arrcon)
                                       var update=$scope.partyname+","+$scope.transaction;
                                       $http.get('/transdetails/'+update).success(function(response)
                                             { 
                                                console.log(response)
                                                 //$scope.userit[i] = response;
                                                $scope.user=$scope.userit;
                                               $scope.getDetails();
                                              })

                                   })

                        }else if($scope.userit[i].orderStatus == "Inprogress"){
                                 // alert("entered into orderstatus Inprogress")
                            
                                  //console.log("Inprogress then update ")
                                  //console.log( $scope.userit[i].barcode)
                                  // if($scope.userit[i].barcode == undefined){
                                  //     console.log("this is non barcode item")
                                       // }
                                // var new1 = data+","+$scope.userit[i].orderStatus;
                                 $http.put('/useritupdate',$scope.userit[i]).success(function(response)
                                      {
                                               //$scope.result=response;
                                                // $scope.userit[i] = response;
                                            
                                               console.log(response);
                                              // console.log(response._id);
                                             //  arrcon.push($scope.userit[i]._id)
                                             //  console.log(arrcon);
                                             //alert(arrcon)
                                            $scope.getDetails();
                                      })

                         }else if($scope.userit[i].orderStatus == "completed"){

                                   //console.log("completed then update ")
                                   //console.log( $scope.userit[i].barcode)
                                      // if($scope.userit[i].barcode == undefined){
                                   //     console.log("this is non barcode item")
                                    // }
                                  // var new1 = data+","+$scope.userit[i].orderStatus;
                                   $http.put('/useritupdate',$scope.userit[i]).success(function(response)
                                         { 
                                                 // $scope.userit=response;
                                                 // console.log(response);
                                                 $scope.getDetails();
                                          })

                                }
    
                       
                   }else{


                          // console.log("this is main else loop");
                          // alert("$scope.userit[i]._id else =null");
                         console.log($scope.userit[i])
                         $scope.userit[i].partyname=$scope.partyname;
                         if($scope.transaction == "Urd Purchase"){
                               $scope.userit[i].stockPoint ="urd treasure" 
                               $scope.userit[i].stockInward = "yes"
                          }else{
                                 $scope.userit[i].stockPoint ="Regular sale treasure"
                                 $scope.userit[i].stockInward = "no"
                               }
                 
                        // $scope.userit[i].orderStatus = "Inprogress"
                         // alert("vaule of I before post"+i)
                       //  console.log($scope.userit[i])
                       //  console.log($scope.userit[0])
                           // $http.post('/userit12',$scope.userit[i]).success(function(response)
                           //        {
                           //              //alert(response)
                           //              console.log(response)
                                      

                           //         })
                                 //   '/transdetails/'+data
                       //  $http.post('/savedata',$scope.userit[i]).success(function(response){
                               console.log(data)
                               var data1 = data+","+$scope.userit[i].stockPoint+","+$scope.userit[i].stockInward+","+$scope.userit[i].Hsc+
                               ","+$scope.userit[i].purity+","+$scope.userit[i].pctcal+","+$scope.userit[i].labcal+","+$scope.userit[i].uom+
                               ","+$scope.userit[i].stonecal+","+$scope.userit[i].salesPerson +","+$scope.userit[i].AccNo +","+$scope.userit[i].labourTaxValue+","+$scope.userit[i].labamt;
                                console.log(data1)
                               //  var date3 = new Date()
                                $http.post('/savedata1/'+data1).success(function(response){
                         
                                 console.log(response)
                                 // $scope.mylink1 = "pdf.html" //not working  
                                
                                  if($scope.transaction =="Urd Purchase"){
                                       var update=$scope.partyname+","+"Urd Purchase";
                                       console.log(update)
                                       $http.get('/transdetails/'+update).success(function(response)
                                           { 
                                             console.log(response)
                                             $scope.urd = response;
                                             // window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
     
                                            // $scope.userit = []
                                           $scope.getDetails()
                                               // alert("got getting vall")
                                           }) 
                                           } 

                                         
                                  $scope.getDetails();
                                    


                          }); 

                                 
                         
                       }

                     // $scope.mylink1 = "pdf.html" //working 
                        //alert("i value outside post"+i)
                       // $scope.getDetails();
                       console.log("i           "+i);
         }//for loop closer

       // $scope.getDetails();
        //userit data getting from db
         
        // $http.get('/itemsdatachange'+$scope.userit[$index].itemName).success(function(response){
        //                        console.log(response)
        //                 $scope.userit[$index].Hsc = response[0].Hsc
        //                         //alert($scope.userit[$index].Hsc)
        //                         //scope.userit[$index].Hsc)
        //                         // alert("see response")
        //       });

   if($scope.transaction !="Urd Purchase"){


        if($scope.saleinv[0]._id==null)
            {
                console.log("enterd into null saleinv")   
                $scope.saleinv[0].partyname=$scope.partyname;
                $scope.saleinv[0].status="In Progress";
                $scope.saleinv[0].date = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
               //  $scope.saleinv[0].date = $scope.discount1 ;
               //  $scope.saleinv[0].date = $scope.ccamt1 ; 
               // // ccamt 
                   // alert('date'+$scope.saleinv[0].date);
                    console.log($scope.saleinv);
                   //alert("id null "+$scope.saleinv);

                 $http.post('/saleinvoicedata',$scope.saleinv).success(function(response){
                       // alert("saved successfully $scope.saleinv[0]._id==null");
                    console.log(response);
                    console.log(response[0]._id);
                    window.sessionStorage.setItem("saleinvoicedata_id",response[0]._id);
                    // window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
                 }); 
            }else{

                console.log("enterd into not null saleinv")
               // alert("enterd into not null saleinv")
               $scope.saleinv[0].status="In Progress"
                $scope.saleinv[0].partyname=$scope.partyname;
                var update=$scope.saleinv[0]._id+","+$scope.saleinv[0].partyname+","+$scope.saleinv[0].taxableval+","+$scope.saleinv[0].tax+","+$scope.saleinv[0].subtol
                +","+$scope.saleinv[0].adj+","+$scope.saleinv[0].labourValue+","+$scope.saleinv[0].labourtax+","+ $scope.saleinv[0].status+","+ $scope.saleinv[0].dis
                +","+$scope.saleinv[0].char+","+$scope.saleinv[0].netamt;
                console.log(update)
               // alert($scope.saleinv[0].char);
                $http.put('/saleinvoicedata12/'+update).success(function(response)
                     {
                          //$scope.result = response;
                          console.log(response);
                         // alert("enterd into not null saleinv")
                             window.sessionStorage.setItem("saleinvoicedata_id",response[0]._id);
                    // window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
                
                     })
            }
      }
   alert("Order Saved Successfully");
     }
     // else{
     //           // alert(" validations issues please check")
     //          }

   }

$scope.save=function(){
    arrcon = []
    flag = 0 ;
        //alert($scope.item.barcode);$scope.partyname
        window.sessionStorage.setItem("remarks",$scope.remarks);
       //  $scope.userit[0].partyname = $scope.partyname;
        console.log($scope.userit);
        console.log($scope.userit.length);
        //validation purpose
        if(flag == 0){

          if (0 == $scope.userit.length) {
                       // do stuff
                       alert("Please Enter values");
                       return;
                   }
                 
             for(let i=0;i<=$scope.userit.length-1;i++) {  
              
                   if($scope.userit[i].itemName == null || $scope.userit[i].itemName == undefined || $scope.userit[i].itemName =="" )
                   {
                      alert("Please Select Item");
                      flag = 1;
                       return;
                   }
               if($scope.userit[i].purity == null || $scope.userit[i].purity == undefined || $scope.userit[i].purity =="")
                  {
                        alert("Please Select Purity");
                        flag = 1;
                        return;
                 }
               var gwt5=parseFloat($scope.userit[i].gwt)
               if($scope.userit[i].gwt == null || $scope.userit[i].gwt == undefined || $scope.userit[i].gwt =="" || gwt5 == NaN)
                  {
                      alert("Please Select Proper Gross Weight");
                      flag = 1;
                      return;
                   }
                if($scope.userit[i].salesPerson == null || $scope.userit[i].salesPerson == undefined || $scope.userit[i].salesPerson =="" )
                  {
                      alert("Please Select Sales person");
                      flag = 1;
                      return;
                   }
                if($scope.userit[i].AccNo == null || $scope.userit[i].AccNo == undefined || $scope.userit[i].AccNo =="" )
                  {
                      alert("Please Select Acc No");
                      flag = 1;
                      return;
                   }
                if(i == $scope.userit.length-1 ){
                     flagCall();
                   // $scope.getDetails();
                }   

              }
        }
        //alert($scope.userit.length)
        //flagCall1()
        
 
// for data useradj
 if($scope.transaction =="Sale Returns" || $scope.transaction =="Urd Purchase" || $scope.transaction =="RD PURCHASE" || $scope.urd_amt !=null || $scope.book_amt != null|| $scope.sch_amt !=null){
    console.log("entere into "+$scope.urd_amt);
    console.log("entere into "+$scope.book_amt);
     console.log("entere into "+$scope.sch_amt);
     console.log( urdvalue); 
     if($scope.transaction =="RD PURCHASE") {
        $scope.rd = parseFloat (urdvalue);
      console.log( $scope.rd); 
      }else if($scope.transaction =="Sale Returns"){ 
        $scope.urd_amt = parseFloat ($scope.userit[0].taxval);
       console.log( $scope.urd_amt); 
      }else { $scope.userit[0].taxval
        $scope.urd_amt = parseFloat (urdvalue);
       console.log( $scope.urd_amt); 
      }

     // $scope.rd = parseFloat (urdvalue);
     //  console.log( $scope.urd_amt);
     if(cal === "undefined" || cal.length == 0){
            console.log("true");
              var update=$scope.partyname+","+$scope.urd_amt+","+$scope.book_amt+","+$scope.sch_amt+","+$scope.rd;
              $http.put('/useradjupdate/'+update).success(function(response)
        {
        $scope.resp=response;
        console.log($scope.resp);
        })
         }else{
           console.log("false");
            var update=$scope.partyname+","+$scope.urd_amt+","+$scope.book_amt+","+$scope.sch_amt+","+$scope.rd;
              $http.put('/useradjup/'+update).success(function(response)
        {
          console.log("iam updated");  
        $scope.resp=response;
        console.log($scope.resp);
        })
         }
    
         }
    //  alert("Order Saved Successfully");
     // $scope.getTotNetAmt();

     } //save function closer
//for confirm the page

$scope.user = {};
var tpcs = null;
 var twgt =null;
  var gwt = null;
  var gpcs = null;

$scope.confirm = function(){
       console.log("clicked on confirm");
       console.log($scope.user);
      // window.sessionStorage.setItem("userids", $scope.user);
       window.sessionStorage.setItem("userids",JSON.stringify(arrcon));
       //alert(userids)
        //  window.sessionStorage.setItem("Str4",JSON.stringify($scope.user[$index]))
          //to update sal
       var update=$scope.partyname+","+$scope.transaction;
       $http.put('/saleinvoicedataconfirm/'+update).success(function(response)
             {
                // $scope.result=response;
                 console.log($scope.result);
             })               
        console.log($scope.user.gpcs);
     //   console.log($scope.user[0].gpcs);
       console.log($scope.transaction);
       console.log($scope.user.length);
    //   console.log($scope.user[0].split);
      // if($scope.user[0].split =="true"){}
     for(i=0;i<=$scope.user.length-1;i++)
        {
                        
                        console.log($scope.user[i].itemName);
                        //alert("in confirm")
     $http.get('/checkofcomboitem/'+$scope.user[i].itemName).success(function(response)
        {  
         //console.log("i got replay form confirm")
         console.log(response);
          console.log(response[0].comboItem);
        // alert("check combo")
         if(response[0].comboItem == "yes"){

                     //updating the combo main barcode
                   $http.get('/getbar'+$scope.user[i].barcodeNumber).success(function(response)
                         { 
                            console.log(response[0])
                            console.log(combocheck)
                            var combocheck = response[0]
                             
                            //console.log(response[0].gpcs)
                            
                            combocheck.gpcs = combocheck.gpcs -  $scope.user[i].gpcs 
                            combocheck.gwt = combocheck.gwt - $scope.user[i].gwt
                            if(combocheck.gwt == 0){
                              combocheck.orderStatus = "completed"
                            }else{
                              combocheck.orderStatus = "available"
                            }
                            console.log(combocheck.gpcs) 
                            console.log(combocheck.gwt) 
                            console.log($scope.user[i].gpcs) 
                            console.log($scope.user[i].gwt) 

                            console.log(combocheck) 
                            // this is for updating the existing barcode
                            $http.put('/useritupdate',combocheck).success(function(response)
                                         { 
                                          console.log(response)
                                                
                                          })

                  
                         }) //'/getbar'
                   



                    // generating new barcode
                     var count12 = 0
                    for(i=1;i<=100;i++)
                    {
                        var barcode = Math.floor(Math.random() *  ((99999999-10000000)+1) + 10000000);
                        //console.log("the value of i "+i)
                        $http.get('/barcode',{params:{"barcode":barcode}}).success(function(response)
                             { 
                                 console.log(response.length)
                                  count12 = response.length
                                 console.log(count12)

                              })

                        if(count12 == 0){
                        console.log(count12)
                        $scope.user[i].barcodeNumber = barcode
                        $scope.user[i].orderStatus = "completed"
                        // for combo new barcode 
                         $http.post('/combotransactiondetail',$scope.user[i]).success(function(response)
                                        {  
                                             //console.log("i got from split")
                                           // $scope.latest1=response;
                                            console.log(response);
                                         })

                             break;
                        }
                   }  // for loop i=100
                  
                  

            }//if loop response[0].comboItem == "yes"
       }) //checkofcomboitem

          if($scope.user[i].split == "yes"){
             console.log(" true")
           //  alert("entered into split yes")
             console.log( $scope.user[i].barcode)
             console.log( $scope.user[i].gpcs)
              console.log( $scope.user[i])
              window.sessionStorage.setItem("Str4",JSON.stringify($scope.user[i]));
            // var editt=JSON.parse(window.sessionStorage.getItem("Str4"));
            // console.log( editt.stwt)
            //  console.log( editt)
             var bcode =$scope.user[i].barcode;
             var stw = $scope.user[i].stwt ;
             console.log(stw)
            
                if(stw == undefined){
                        var gwt = $scope.user[i].gwt
                 }else{
                            var gwt = $scope.user[i].gwt - stw;
                 }
                gwt = parseInt(gwt)
                console.log(gwt);
                var gpcs = $scope.user[i].gpcs
                gpcs= parseInt(gpcs)
                console.log(gpcs)
                console.log($scope.user[i].count)
                var count = $scope.user[i].count
                console.log(count)
                //working for $q

                $scope.getcount = function(count){
                var q = $q.defer()

                $http.get('/count1/'+count).success(function(response)
                      { 

                            console.log("i got replay form count")

                             console.log(response);
                             q.resolve(response);
                         }).error(function(response){
                            q.reject(response)
                         });
                         return q.promise;
                     }

                  $scope.promise = $scope.getcount(count)   

                  $scope.promise.then(function(response){
                    console.log(response)
                     console.log("i printing the response")

                           // $scope.reverse=response[0];
                            console.log(response);
                             tpcs =  response[0].totalpcs
                             tpcs = parseInt(tpcs)//26/5
                            console.log(tpcs);
                             twgt =  response[0].totalweight
                            twgt = parseInt(twgt)//26/5
                            console.log(twgt);
                             $scope.getif();
                          
                },
                    function(err){
                     console.log(err)   
                    })
                  console.log("out side promise")
                  alert(" out side promise")
                  $scope.getif = function(){
                    console.log(" $scope.getif")

                  if ( (gwt != twgt) || ( gpcs != tpcs) )
                             {
            //                     var editt=JSON.parse(window.sessionStorage.getItem("Str4"));
            // console.log( editt.stwt)
            //  console.log( editt)
                                 // $scope.user[i] = {};
                              $scope.user[i]  =JSON.parse(window.sessionStorage.getItem("Str4"));
           
                                  console.log("entered into the split loop")
                                  var dgwt = twgt - gwt;
                                  var dgpcs = tpcs - gpcs; 
                                 // var latest = dgwt+","+dgpcs+","+bcode;
                                  console.log(dgpcs)
                                  // $scope.user[i].gpcs = null;
                                  $scope.user[i].gpcs = dgpcs
                                  console.log( $scope.user[i].gpcs)
                                  $scope.user[i].gwt =  dgwt
                                  console.log( $scope.user[i].gwt)
                                  $scope.user[i].Transaction = "Split return"
                                  $scope.user[i].StockInward = "yes"
                                 // $scope.user[i]. = "yes"
                                  $scope.user[i].refid = $scope.user[i].barcode 
                                  $scope.user[i].barcode = ""
                                   $scope.user[i].orderStatus ="completed" 
                                  $scope.user[i].StockPoint = "Split Treasure"
                                  $http.post('/splitreturn',$scope.user[i]).success(function(response)
                                        {  
                                             console.log("i got from split")
                                           // $scope.latest1=response;
                                            console.log(response);
                                         })
                               
                              }
                          }
            }
  console.log("iam working")
    console.log($scope.user);
   
        $scope.user[i].orderstatus = "completed"
      //    $scope.user[i].StockInward = "no"
        console.log($scope.user._id)
        console.log($scope.user[0]._id)
        console.log($scope.user[i]._id)
        console.log($scope.user[i].date)
        console.log(arrcon[i])
        var data = null;
        if($scope.user[i]._id == undefined){
           
            var data = arrcon[i]+","+$scope.user[i].orderstatus;
       
        }else{
          var data =$scope.user[i]._id+","+$scope.user[i].orderstatus+","+ $scope.user[i].barcode;
          
        }
        //var data = arrcon[i]+","+$scope.user[i].orderstatus+","+$scope.user[i].barcode+","+$scope.user[i].date+","+$scope.user[i].Transaction;
       //  var data = arrcon[i]+","+$scope.user[i].orderstatus;
       // var data =$scope.user[i]._id+","+$scope.user[i].orderstatus+","+ $scope.user[i].barcode+","+$scope.user[i].date
             
        console.log(data)
    $http.post('/confirmtransaction/'+data).success(function(response)
        {  
         console.log("i got replay form confirm")
         console.log(response);
        // $scope.resul=response;
       // console.log($scope.resul);
        })
     } //for

  //urd status update  for adjustment values
 // pushid[]
 //alert("before confirm urd")
  console.log( pushid)
  console.log( pushid.length)
  for( i=0;i<pushid.length;i++){
   console.log( pushid[i])
  // var data =
//this is for handling urd extra amount

  if( i == pushid.length-1 ){
    //urd adjustment
   // alert("i == pushid.length-1")
           if( total >  subtol){

                // alert("total >  subtol")

                console.log("total2 >  subtol2 total2 >  subtol2")
                 $scope.adjqty = subtol
                 diff = total - subtol
                  console.log( diff)
                diff = diff.toFixed(fixdec)
                 // $scope.saleinv[0].netamt = 0
                var data2 = pushid[i]+","+diff;

                var r = confirm("Do you want to pay cash return "+ parseInt(diff))
                if (r == true) {
                       var urdRefund = diff;
                       window.sessionStorage.setItem("urdRefund",diff);
                       var urdUpdate = pushid[i]+","+diff+","+urdRefund ;
                       $http.put('/urdstatus/'+ urdUpdate).success(function(response)
                             {  
                                 //   alert("true")
                               // alert("r == true")
                                 console.log("i got replay form confirm")
                                 console.log(response);
                                 // $scope.resul=response;
                                // console.log($scope.resul);
    
                             })
                          // break;
                   }else{
                         //  alert(" total >  subtol false")
                           $http.put('/urdstatus/'+ data2).success(function(response)
                               {  
                                  console.log("i got replay form confirm")
                                  console.log(response);
        
       
                               })
                               // break;
                         }
             }else{
                     $http.put('/urdstatus123/'+ pushid[i]).success(function(response)
                          {  
                                 console.log("i got replay form confirm")
                                 console.log(response);
        
                           })
                 }  
          //here
     }else{
      //alert("urdstatus123")
         $http.put('/urdstatus123/'+ pushid[i]).success(function(response)
        {  
         console.log("i got replay form confirm")
         console.log(response);
        // $scope.resul=response;
       // console.log($scope.resul);
        })

     }
    

  }



}//function close



    $scope.gwtCal=function(gwt,$index)
    {
        //alert("gwtcal called");
        //alert($index+gwt);
       var gwt=gwt;
        //$scope.gwt.splice($index,0,gwt);
        //alert($scope.gwt[$index]);
       $scope.netwtarr[$index]=gwt;
       //alert($scope.netwtarr[$index]);
       $scope.chararr[$index]=gwt;
       $scope.taxablearr[$index]=gwt;
       var taxcal=$scope.taxablearr[$index]/100;
    //alert(taxcal);
       $scope.taxarr[$index]=taxcal;
    //alert($scope.taxarr[$index]);
       var totalcal=parseFloat($scope.taxarr[$index])+parseFloat($scope.taxablearr[$index]);
    //alert(totalcal);
       $scope.totvalarr[$index]=totalcal;
        //alert($scope.taxablearr[$index]);
       console.log($scope.netwtarr[$index]);
        //alert("gwt calculation function");
        //alert("taxable value is")
        //alert($scope.taxablearr[$index]);
       $scope.getTotTaxVal();
       $scope.getTotTaxAmt();
       $scope.getFinalVal();
    }



$scope.stwtCal=function(stwt,$index,gwt)
{
    //alert("HI");
    var stwt=stwt;
    var gwt=gwt;
    //$scope.stwt.splice($index,0,stwt);
    //alert($scope.stwt[$index])
    //var gwt=gwt;
    //alert(stwt);
    var ntwtcal=gwt-stwt;
    //alert(ntwtcal);
    $scope.netwtarr[$index]=ntwtcal;
    //alert($scope.netwtarr[$index]);
}

$scope.wasCal=function(was,$index)
    {
        //alert("wascal called");
        var was=was;
        //alert(was);
        var charcal=parseFloat(was)+parseFloat($scope.netwtarr[$index])
        //alert(charcal);
        $scope.chararr.splice($index,0,charcal)
        $http.get('/itemrate').success(function(response){
        $scope.irate=response;

        var rate=$scope.irate[0].rate;
        //alert(rate);
        //alert($scope.chararr[$index]);
        var taxablecal=$scope.chararr[$index]*rate;
        //alert(taxablecal);
        $scope.taxablearr[$index]=taxablecal;
        var taxcal=$scope.taxablearr[$index]/100;
        $scope.taxarr[$index]=taxcal;
        var totalcal=parseFloat($scope.taxarr[$index])+parseFloat($scope.taxablearr[$index]);
    
        $scope.totvalarr[$index]=totalcal;
        $scope.getTotTaxVal();
        $scope.getTotTaxAmt();
        $scope.getFinalVal();
})
}

$scope.labCal=function(labamt,$index)
{
    //alert("labamt called");
    $scope.labamt=labamt;
    //alert(labamt);
    var labcal=parseFloat(labamt)+parseFloat($scope.taxablearr[$index])
    //alert(labcal);
    $scope.taxablearr[$index]=labcal;
    var taxcal=$scope.taxablearr[$index]/100;
    //alert(taxcal);
    $scope.taxarr[$index]=taxcal;
    //alert($scope.taxarr[$index]);
    var totalcal=parseFloat($scope.taxarr[$index])+parseFloat($scope.taxablearr[$index]);
    //alert(totalcal);
    $scope.totvalarr[$index]=totalcal;
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();
    //alert($scope.totvalarr[$index]);
}
$scope.stchgCal=function(stchg,$index)
{
   // alert("stchg called");
    var stcal=parseFloat(stchg)+parseFloat($scope.taxablearr[$index])
    $scope.taxablearr[$index]=stcal;
     var taxcal=$scope.taxablearr[$index]/100;
    //alert(taxcal);
    $scope.taxarr[$index]=taxcal;
    //alert($scope.taxarr[$index]);
    var totalcal=parseFloat($scope.taxarr[$index])+parseFloat($scope.taxablearr[$index]);
    //alert(totalcal);
    $scope.totvalarr[$index]=totalcal;
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();

    //alert($scope.totvalarr[$index]);
}

$scope.mrpCal=function(mrp,$index){
 //alert("mrpfunction called")
 $scope.taxablearr[$index]=mrp;
  var taxcal=$scope.taxablearr[$index]/100;
    //alert(taxcal);
    $scope.taxarr[$index]=taxcal;
    //alert($scope.taxarr[$index]);
    var totalcal=parseFloat($scope.taxarr[$index])+parseFloat($scope.taxablearr[$index]);
    //alert(totalcal);
    $scope.totvalarr[$index]=totalcal;
    $scope.getTotTaxVal();
    $scope.getTotTaxAmt();
    $scope.getFinalVal();

}
    $scope.select=function(){
        var mrp=$scope.user.mrp;
        var pcs=$scope.user.pcs;
        $scope.total=pcs*mrp;
    $http.post('/useritem',$scope.user).success(function(response){
    });
    
        //alert("HIiiiiiiiiiiii");
         
        //alert(taxval);
    
         //alert($scope.taxval);

        //alert($scope.dis);
        var data=$scope.user.mySelectValue;
       // alert(data);

        var data1=$scope.user.mySelectValue1;
       // alert(data1);
        var labamt1=parseFloat($scope.user.labamt);
        //alert(data1);
        $scope.gwt=$scope.user.gwt;
        $scope.wastage=$scope.user.was;
        $scope.pct=$scope.user.pct;

        if($scope.pct=="Add%")
        {
           // alert("HI PCT")
            $scope.wastage=($scope.wastage*$scope.gwt)/100;
           // alert($scope.wastage);
            return $scope.wastage;
        }

        $scope.charunit=parseFloat($scope.gwt)+parseFloat($scope.wastage);
       // alert("charge units is"+$scope.charunit);
         //var stwt=$scope.user.stwt;
        //alert(stwt);
       // $scope.ntwt=$scope.gwt-stwt;
        /*if($scope.ntwt==null)
        {
            alert($scope.gwt);
            

            $scope.total=$scope.gwt*$scope.taxval;
            
        }
        else{
            
        
        }*/
        /*else{
            
        }*/
        //return $scope.total;
        //alert($scope.ntwt);
        //alert($scope.total);
        
        //alert("hi"+$scope.total);
        $scope.total=$scope.charunit*$scope.taxval+labamt1;
      //  alert($scope.total);
        $scope.tax=$scope.total/100;
         $scope.dis=$scope.user.dis;
        if($scope.dis==null)
        {
            //alert("null value");
            $scope.subtol=$scope.total+$scope.tax;
            return $scope.subtol;
        }
         
        //alert($scope.wastage);
        $scope.cca=$scope.user.cca;
        $scope.subtol=$scope.total+$scope.tax-$scope.dis;
        $scope.amount=$scope.user.amt;
        if($scope.user.trans=="Amount")
        {
        if($scope.amount==null)
        {
           $scope.netwt=$scope.cca+$scope.subtol-$scope.amount; 
           return $scope.netwt;
        }
        $scope.netwt=$scope.cca+$scope.subtol-$scope.amount;
        $scope.netwt1=$scope.netwt.toFixed(2);
    }
    else {
        $scope.mate=$scope.amount;
        $scope.charunit=parseFloat($scope.gwt)+parseFloat($scope.wastage)-$scope.mate;
        $scope.total=$scope.charunit*$scope.taxval+labamt1;
         //  alert($scope.total);
        $scope.tax=$scope.total/100;
        $scope.netwt=$scope.cca+$scope.subtol;
        $scope.netwt1=$scope.netwt.toFixed(2);
    }

   
        //alert($scope.netwt)
        refresh();
        //});

     }
        //var data3=wt;
        //var data4=pcs;
        ////alert(wt);
        //alert(pcs);
         //var orders=data+","+data1+","+data3+","+data4;
         /*$http.post('/orders',$scope.user).success(function(response){
         });*/
         //alert(orders);
        /*$http.put('/order/'+orders).success(function(response)
        {
        $scope.result=response;
    })*/
        /*$http.post('/users',$scope.user).success(function(response){
        var username=response.name;*/
        //alert(mySelectValue);
        //alert(mySelectValue1);
    //}
    
    //alert($scope.mySelectValue);

    $scope.ShowConfirm = function () {
                if ($window.confirm("Cash advance?")) {
                    window.location.href="cashadv.html";
                } else {
                     window.location.href="index.html";
                }
            }
    /*$scope.sayHi = function() {
    alert('hi!')
  }*/
    /*$scope.itotal= window.sessionStorage.getItem("cal");
    //alert($scope.itotal);
    $scope.count=1;
    $scope.v1="0";
     $scope.mobile=function(mobile){
        var ph=mobile;
        console.log(ph);
        window.sessionStorage.setItem("ph",ph);
        //alert(ph);
        $http.post('/',$scope.user).success(function(response){
        $scope.id=response._id;
        window.location.href="menu.html";
    })
    }
     $scope.name= window.sessionStorage.getItem("Name");
   $scope.Rs=window.sessionStorage.getItem("RS");
    */
    $scope.addon=function()
    {
        //alert("HI");
    //alert(mySelectValue);
    }

        $http.get('/cash').success(function(response){
        $scope.cash=response;
        //alert($scope.items);
    });
        $http.get('/bank').success(function(response){
        $scope.Bank=response;
        //alert($scope.items);
    });

        $http.get('/itemsdata').success(function(response){
            console.log(response)
        $scope.items=response;

        
        
        //alert($scope.items);
    });
    
        $http.get('/user').success(function(response){
        $scope.res=response;
    })
        // for transaction details collection in inventory
         $http.get('/transactiondetails').success(function(response){
            console.log(response)
        $scope.transactions=response;
        //alert($scope.items);
    });

       //configurations for urd weight gross wt or nett wt
    $http.get('/configuration').success(function(response){
       // response;
        console.log(response)
       $scope.urdweight = response[0].Urd_Weight;
      $scope.LabourTax = response[0].LabourTax;
      $scope.WeightTolerance = response[0].WeightTolerance;
       fixdec  = response[0].DecimalPoints; 
       // console.log(response.UpperLimit)
         console.log($scope.urdweight);
         //alert( $scope.LabourTax )
         if( $scope.LabourTax == "Yes"){
               $http.get('/getLabourTax').success(function(response){
                            // interest1 = response[0].Rate
                            // interest2 = response[1].Rate
                            console.log(response)
                            labourTaxInterest = response[0].Rate ;
                            console.log(labourTaxInterest);
                     
                   });

         }

    })

    // $scope.edit=function(name,quan){
    //     //alert(name+quan);
    //     var mp= window.sessionStorage.getItem("ph");
    //     var quant=quan;
    //     var iname=name;
    //     //alert(iname);
    //     $http.get('/menu', {params:{"price":iname}}).success(function(response){
    //     var price=response.price;
    //     var total=quan*price;
    //     //alert(total);
    //     var edit=mp+","+iname+","+quant+","+total;
    //     $http.put('/itemedit/'+edit).success(function(response)
    //     {
    //     $scope.result=response;
    //     console.log($scope.result);
    //     window.location.reload();
    //     })
    //     });
    //     //$http.put('/itemedit/'+edit);

    // }
    $scope.add=function()
    {
       $http.post('/users',$scope.user).success(function(response){
       $scope.names=response;
    })
   }
    $scope.delete=function(name)
    {
        //alert("hi")
        var mp= window.sessionStorage.getItem("ph");
        var iname=name;
        var itemname=mp+","+iname;
        //alert(iname);
        $http.delete('/item/'+itemname);
        window.location.reload();
    }

     $("a[data-tab-destination]").on('click', function() {
        var tab = $(this).attr('data-tab-destination');
        $("#"+tab).click();
    });
    }]);


myApp.controller('PdfCntrl',['$scope','$http','$window',
function($scope,$http,$window){
   // alert("pdf controller called");
   var sgsttotal = 0 ;
   var cgsttotal = 0 ;
   var igsttotal = 0;
   var taxvaltotal = 0;
   var subtotal1 = 0;
   var fixdec =2;
   //used for display array
   var l = 0;
   $scope.userdisplay = [] 
   //var 
    $scope.billType=window.sessionStorage.getItem("Billtype");
    
    $scope.partyname = window.sessionStorage.getItem("Party");
  
    $scope.billType=window.sessionStorage.getItem("Billtype");//25/4
    $scope.trans = window.sessionStorage.getItem("transact"); //24/4
   // $scope.urd_value = window.sessionStorage.getItem("URD_VALUE");
    var urdparty = window.sessionStorage.getItem("URD_PARTY");
    var  barcode = window.sessionStorage.getItem("valu");//12/5
    var remarks = window.sessionStorage.getItem("remarks");
    var saleinvoice_id = window.sessionStorage.getItem("saleinvoicedata_id");
    var editedInvoice = window.sessionStorage.getItem("editedInvoice");
     // alert(editedInvoice) 
     //check edited invoice or not
     var editedInvoiceCheck = null;
      if(editedInvoice != null ){
        alert(editedInvoice) 
       editedInvoiceCheck = "true";

       }
      //else{
      //   alert("not null")
      // }
      console.log(editedInvoice)            
    console.log(" saleinvoice_id "+saleinvoice_id);
    //window.sessionStorage.setItem("userids", $scope.user);
    var user1 = JSON.parse(window.sessionStorage.getItem("userids"));
     // $scope.user[i]    =JSON.parse(window.sessionStorage.getItem("Str4"));
    console.log(user1)
    

    console.log(remarks);
    console.log(barcode);
    
    console.log(urdparty) 
    $scope.invoice = null;
    var prefix = null;
    var typeno = null;
    var trans = $scope.trans;
    $scope.urdweight = null;

    //configurations for urd weight gross wt or nett wt
    $http.get('/configuration').success(function(response){
       // response;
        console.log(response)
       $scope.urdweight = response[0].Urd_Weight;
        $scope.LabourTaxCheck = response[0].LabourTax
              //  $scope.LabourTax = response[0].LabourTax;
       // console.log(response.UpperLimit)
         console.log($scope.urdweight)

        //alert($scope.irate[0].rate);
    })
    // merchant details 
    $http.get('/getmerchantdetails').success(function(response){
       console.log(response);
       console.log($scope.Landmark =response[0].Address[0].Landmark);
       console.log($scope.Street =response[0].Address[1].Street);
       console.log($scope.Place =response[0].Address[2].Place);
       console.log($scope.Phone =response[0].Address[3].Phone);
       console.log($scope.Mobile =response[0].Address[4].Mobile);
       console.log($scope.email =response[0].Address[5].email);

       console.log($scope.ShopName =response[0].ShopName);

    })

     $scope.urd_adj = window.sessionStorage.getItem("URD_ADJUSTED");
      $scope.urd_adj = parseFloat($scope.urd_adj).toFixed(fixdec);
     $scope.urd_bal = window.sessionStorage.getItem("URD_BALANCE");
     $scope.urd_bal = parseFloat($scope.urd_bal).toFixed(fixdec);
     $scope.urdRefund = window.sessionStorage.getItem("urdRefund");
       $scope.urdRefund = parseFloat( $scope.urdRefund).toFixed(fixdec);
     console.log($scope.urd_adj)
     console.log($scope.urd_bal)
     console.log($scope.urdRefund)
     
     if( $scope.urdRefund != undefined){
      //alert("urd refund "+$scope.urdRefund)
      $scope.urd_bal = 0;
     }
     //party details
     //$scope.partyname = "party901"
     $http.get('/getsaleinvoice_id'+saleinvoice_id).success(function(response){ 
          console.log(response)
          console.log(response[0].dis)
          $scope.discount = response[0].dis;
          $scope.charge = response[0].char;
          $scope.subtotal = response[0].subtol;
          $scope.taxableval = response[0].taxableval;
          $scope.nett = response[0].netamt;
         // $scope.charge1 = 10;
          console.log(response[0].char)
         // alert(response[0].char)
          if( $scope.charge != 0){
            $scope.charge1 = $scope.charge;
          }
          if( $scope.LabourTaxCheck == "Yes"){
            $scope.labourValue = response[0].labourValue;
            $scope.labourtax = response[0].labourtax;
          }
          //write now charge amount and value are same so using this
          //if any changes then get charge value using window



        })
      $http.get('/getpartydetails'+ $scope.partyname ).success(function(response){

            console.log(response)
            $scope.partyLicense = response[0].partyLicense;
            $scope.partyPAN = response[0].PAN;
          })

        if($scope.trans == trans){
           $http.get('/getinvoice'+trans).success(function(response){
                 invoice =response[0];
                 console.log( response[0])
                 prefix = invoice.TransactionPrefix;
                 typeno = invoice.StartingTransactionTypeNo;

                 console.log( invoice.TransactionPrefix)
                 console.log( invoice.StartingTransactionTypeNo)
                 var updat = invoice.TransactionPrefix+","+invoice.StartingTransactionTypeNo;
 
           $http.get('/transactionsto/'+updat).success(function(response)
                 {  
                   console.log("i got replay")
                   console.log(response);
                   var num = response+1;
                   var updat =invoice.TransactionPrefix+","+num;
                   $http.post('/transactionstoc/'+updat).success(function(response)
                        {  
                            console.log("i got replay")
                            console.log(response);
                             console.log(response.prefix);
                             console.log(response.typeno);
                             $scope.invoice = response.prefix+response.typeno;
                             console.log($scope.invoice);
                             if( editedInvoiceCheck == "true"){
                               $scope.invoice = editedInvoice ;
                             } 
                             var usecase = user1 +","+$scope.invoice; 
                             console.log(user1)
                             $http.post('/user12/'+usecase).success(function(response){
                                  console.log(response);
                                  }) 
                             var saleInvoiceData = saleinvoice_id +","+$scope.invoice;       
                             $http.post('/saleInvoiceInvoice/'+saleInvoiceData ).success(function(response){
                                  console.log(response);
                                 })                
                       })                   
                 }) 
       })

 
      // $scope.urd_adj = window.sessionStorage.getItem("URD_ADJUSTED")
      // $scope.urd_bal = window.sessionStorage.getItem("URD_BALANCE")
    }
    //var updat = "RD"+","+"1";

    if(urdparty ==$scope.partyname){
       $scope.urd_value = window.sessionStorage.getItem("URD_VALUE");
       console.log($scope.urd_value)
    }else{
          $scope.urd_value = 0;
          console.log($scope.urd_value)
         }
   
   

    var date=new Date();
     //25/4$scope.FromDate = ('0' + (date.getDate())).slice(-2)+'-'+date.getMonth()+ 1 +  '-' + (date.getFullYear()); 
      $scope.FromDate =  new Date(); //25/4
console.log( $scope.FromDate)
// $http.get('/userit',{params:{"partyname":$scope.partyname,"Transaction":$scope.trans}}).success(function(response){
//         $scope.userit=response;
//     })

//for urd
if($scope.trans == "Urd Purchase"){
    //for barcode data =
    l = 0;
    for( k=0;k<=user1.length-1;k++)
    {
       $http.get('/getparty',{params:{"id":user1[k]}}).success(function(response){
         console.log(response)
       //  console.log(l)
          $scope.userdisplay[l] = response[0];
          console.log( $scope.userdisplay[l])
          l++;
           // $scope.nett = ($scope.subtotal1).toFixed(fixdec)
         // to disapper in pdf
          $scope.LabourTaxCheck = "No"    
          numberwords();
        })
      
      }
}

if($scope.trans == "Regular Sale"){
    //for barcode data 
    for( k=0;k<=user1.length-1;k++)
    {
   // alert(user1[k])
  
    $http.get('/getparty',{params:{"id":user1[k]}}).success(function(response){
         console.log(response)
       //  console.log(l)
          $scope.userdisplay[l] = response[0];
          console.log( $scope.userdisplay[l])
          l++;
           // l++;
         
         if(response[0].withinstatesgst == undefined||response[0].withinstatesgst == 0){
              $scope.gst = "igst"
              $http.get('/gettaxoutofstate').success(function(response){
                          // $scope.outofstateigst = response[0].Rate
                          $scope.igst = response[0].Rate
                    });
          }else{
                 // alert ("withinstatesgst is defined"+response[0].withinstatesgst)

                $scope.gst = "cgst"
                $http.get('/gettaxwithinstate').success(function(response){
                            $scope.cgst = response[0].Rate
                            $scope.sgst = response[1].Rate
                       // taxamtcal(indexvalue)    
                       });
               }

               //to display  cgst or igst and calculations
         for(i=0;i<response.length;i++){
            if(response[0].withinstatesgst == undefined||response[0].withinstatesgst == 0){
                // alert("response[0].withinstatesgst == undefined")
                  igsttotal = igsttotal + parseFloat(response[i]. outofstateigst)
                  $scope.igsttax = igsttotal.toFixed(fixdec)
                  taxvaltotal = taxvaltotal + parseFloat(response[i].taxval)
                  $scope.taxvaltotal =taxvaltotal.toFixed(fixdec)
                  $scope.subtotal1 = igsttotal + taxvaltotal
                 // $scope.nett = ($scope.subtotal1).toFixed(fixdec)
                  numberwords()

            }else{
                 // alert("response[0].withinstatesgst == defined")
                  
                  sgsttotal = sgsttotal + parseFloat(response[i].withinstatesgst)
                  $scope.sgsttax = sgsttotal.toFixed(fixdec)
      
                 cgsttotal = cgsttotal + parseFloat(response[i]. withinstatecgst)
                 $scope.cgsttax = cgsttotal.toFixed(fixdec)
                 taxvaltotal = taxvaltotal + parseFloat(response[i].taxval)
                 $scope.taxvaltotal =taxvaltotal.toFixed(fixdec)
                 $scope.subtotal1 = sgsttotal +cgsttotal + taxvaltotal
               //  $scope.nett = $scope.subtotal1.toFixed(fixdec)
                 numberwords()

                  //  $scope.userit[$index].withinstatecgst = parseFloat((calcu*interest1)/100).toFixed(fixdec)
                  //   $scope.userit[$index].withinstatesgst =parseFloat((calcu*interest2)/100).toFixed(fixdec)
                  //   $scope.userit[$index].taxamt = parseFloat($scope.userit[$index].withinstatecgst) +parseFloat($scope.userit[$index].withinstatesgst)
                  // $scope.userit[$index].final = (parseFloat($scope.userit[$index].taxamt) + parseFloat(calcu)).toFixed(fixdec)
                 

                 }
        
         
         }
        
    })

  }
   
} // if regular sale
// else if($scope.trans == "VALUATION"){
//         console.log(barcode)

//        // $scope.userit= valuation;
//    if(barcode ==0){
//     console.log(barcode)
//      $http.get('/userit',{params:{"partyname":$scope.partyname,"Transaction":$scope.trans}}).success(function(response){
//         $scope.userit=response;
//         console.log( $scope.userit)
//         })
//      }else{
//         console.log(barcode)
//            // console.log(barcode);
//         $http.get('/getparty',{params:{"name":$scope.partyname,"Transaction":$scope.trans}}).success(function(response){
//         $scope.userit=response;
//         console.log( $scope.userit)
//             })
//         }
  

//     }else{
//      $http.get('/userit',{params:{"partyname":$scope.partyname,"Transaction":$scope.trans}}).success(function(response){
//         $scope.userit=response;
//         console.log( $scope.userit)
//     })

//     }
 //pdf particulars printing
 //$scope.urd_value = 0
 $scope.sca = 0
 $scope.smca = 0
 $scope.orad = 0
 $scope.ormd = 0
 $scope.v1 = 0
 $scope.v2 = 0
 $scope.charge1 = 0
 $scope.charge2 = 0
 $scope.labour = 0

 // for saving of history
 $scope.nett = null
 $scope.bill = function(){
   // alert("Bill function called");
   // alert($scope.useritbill.length);
    var hist = $scope.FromDate+","+$scope.trans+","+ $scope.invoice+","
    + $scope.nett+","+ remarks+","+$scope.partyname;
     $http.post('/historyupdate/'+hist).success(function(response)
        {  
             console.log("i got replay")
            console.log(response);
    
         })

 }   

var numberwords = function(){        
        var amount = $scope.nett;
    console.log(amount)
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    
    console.log(amount)
    
    var atemp = amount.split(".");
    
    console.log(atemp)
    
    var number = atemp[0].split(",").join("");
    
    console.log(number)
    var n_length = number.length;
    
    console.log(n_length)
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
        console.log(words_string)
        $scope.wor = words_string;
    }
  }
    //})
}])//PdfCntrl ends here

myApp.controller('ListCntrl',['$scope','$http','$window',
function($scope,$http,$window){
    console.log("hi listCntrl ");
     // for transaction details collection in inventory
         $http.get('/transactiondetails').success(function(response){
            console.log(response)
        $scope.transactions=response;
        //alert($scope.items);
    });
$scope.Transaction = function( ){
    
    console.log( $scope.transaction);
     var update=$scope.transaction;
     
 }

 $scope.list = function( ){
    console.log("got call");
    console.log($scope.transaction);
    if($scope.transaction == undefined){
      alert("Please Select Transaction");
    }
if($scope.transaction == "Estimate" ){
     $http.get('/listtran/'+ $scope.transaction ).success(function(response)
        { 
            console.log(response)
            $scope.List = response;
        })
     }else{
        var update = $scope.transaction;
        console.log(update)
     $http.get('/historyfet/'+update).success(function(response)
            { 
            console.log(response)
             $scope.List = response;
             console.log(response[0]);
             console.log(response[0].netamt)

             $scope.selected=[];
            //$scope.user = response;
            })
        }
}
 
var deleteitem = null;
var  voucherNoEdit = null;
 $scope.row1 = function(item){
   // console.log("this is row id"+id);
  console.log("u clicked on row 1");
  $scope.idSelectedVote = item;
   console.log(item.voucherNo);
   voucherNoEdit = item.voucherNo; 
   deleteitem = item;
}

//for edit
$scope.edit = function(item){
    console.log("call from edit");
     console.log(deleteitem);
     if(deleteitem == null){
      alert("Please Select any Party");

     }else{

           $scope.mylink = "index.html";
           window.sessionStorage.setItem("Str3",JSON.stringify(deleteitem));
          // window.sessionStorage.setItem("voucherNo",JSON.stringify(deleteitem));
            window.sessionStorage.setItem("voucherNo", voucherNoEdit);
                
     }
     
   //  window.sessionStorage.setItem("edit",deleteitem);
    //   window.sessionStorage.setItem("Party",$scope.partyname);
    // })



}

$scope.delete = function(item){
    console.log("call from delete");
   console.log(deleteitem.barcodeNumber);
   console.log(deleteitem.partyname);
   console.log(deleteitem.Transaction);
   console.log(deleteitem._id);
   var udelete = deleteitem.partyname+","+deleteitem.Transaction;
    console.log(udelete);

    $http.delete('/saleinvoiced/'+udelete).success(function(response)
            {
               //  console.log(response)
            });
    $http.delete('/transactiond/'+udelete).success(function(response)
            {
                // console.log(response)
            });
    $http.delete('/useritemd/'+udelete).success(function(response)
            {
                 //console.log(response)
            });
    //for barcoded one '/history',{params:{"barcode":deleteitem.barcode}}
    $http.delete('/transactiondetaild',{params:{"barcode":deleteitem.barcodeNumber}}).success(function(response)
            {
                 //console.log(response)
            });
    $http.delete('/transactiondetaile',{params:{"barcode":deleteitem.barcodeNumber}}).success(function(response)
            {
//console.log(response)
            });

    }
//for list edit option
//  $scope.selected=[];
// $scope.getTemplate = function (item) {
//     console.log(item)
//         console.log(item._id)
//          console.log($scope.selected._id)
//         if (item._id === $scope.selected._id) return 'edit';
//         else return 'display';
//     };

//     $scope.editContact = function (item) {
//         console.log("iam edit")
//         $scope.selected = angular.copy(item);
//         console.log($scope.selected)
//     };

//     // $scope.saveContact = function (index) {
//     //     console.log(index)
// $scope.saveContact = function ( ) {
//       //  console.log(index)
//         console.log("Saving contact");
//        console.log($scope.selected);
//        // $scope.List[idx] = angular.copy($scope.selected);
//        // $scope.model.contacts[idx] = angular.copy($scope.model.selected);
//         //console.log( $scope.item);
//       //  $scope.reset();
//       var update = $scope.selected._id+","+$scope.selected.partyname +","+$scope.selected.VoucherNo+","+$scope.selected.Value
//       console.log(update)
//        $http.delete('/historydelete/'+update).success(function(response)
//                 {
//                     // $scope.result=response;
//                     // console.log($scope.result);
//                 })
//     };
    // $scope.save = function (item) {
    //     console.log("Saving contact");
     
    // };

    // $scope.reset = function () {
    //     $scope.selected = {};
    // };


    //for delete
    $scope.dele = function ( ) {
      //  console.log(index)
        console.log("delete contact");
       console.log($scope.selected);
       // $scope.List[idx] = angular.copy($scope.selected);
       // $scope.model.contacts[idx] = angular.copy($scope.model.selected);
        //console.log( $scope.item);
      //  $scope.reset();
      var update = $scope.selected._id
       $http.put('/historyup/'+update).success(function(response)
                {
                    $scope.result=response;
                    console.log($scope.result);
                })
    };

}])