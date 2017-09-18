/* using the express library for requests for mongodb database */
var express=require('express');
var app=express();
var mongojs=require('mongojs');
var db=mongojs('inventory',['user','tags','transaction','saleinvoice','mode','transactiondetail','batch','bank',
  'transactionSeriesInvoice','itemrate','item','menu','order','useritem','purity','uom','pct','labcal','useradj',
  'barcodesumm','stockpointmaster','configurations','inventorygroupmaster','salescategorymaster','itemtype','taxrate',
  'items','tax','taxation','inventoryGroupAccMaster','inventorygroupvaluenotationdaily','salesPerson','loginDetails']);


var bodyParser=require('body-parser');


app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/countdata',function(req,res)
{
  // console.log("countdata countdata countdata countdata")
 //db.barcodesumm.count(function(err,doc){
    db.barcodesumm.find({}).sort({_id:-1}).limit(1,function(err,doc)
    {
        res.json(doc);
        //console.log(doc);
    })
  // db.barcodesumm.find({}.sort({_id:-1}).limit(1),(function(err,doc){
  //     // console.log("the count is "+doc);
  //     if(err){
  //       console.log(err)
  //     }
  //       res.json(doc);
  //       console.log(doc)
  //    }))
  })
console.log("data is today update")
//for tags count
app.get('/gettags',function(req,res)
{
  //console.log("gettags gettags gettags gettags gettags gettags gettags gettags");
  var a=req.query.count

  var b =parseInt(a)
 

  db.tags.count({count:b,status:"Inprogress"},(function(err,doc){
       //console.log("the count is "+doc);
        res.json(doc);
        
     }))
  })
//for update of color in batch
app.put('/colorupdate/:list',function(req,res)
{ //'/status/:update'
  console.log(" colorupdate colorupdate colorupdate colorupdate colorupdate colorupdate colorupdate colorupdate colorupdate");
    var str=req.params.list;
   // console.log(str);
    var str_array=str.split(",");
    var a =str_array[0];
    //console.log("status is"+status);
    var color=str_array[1]
    //var bar =parseInt(code1);
  //var a=req.query.count
 // var barcode=req.query.barcode;
 // console.log(req.query.count);

 //  var barcode=req.query.barcode;
  var b =parseInt(a)
  console.log(b);
  // var color = req.query.color
   console.log(color)
   //db.batch.update({"barcode":code1},{"$set":{"stats":status,
  db.batch.update({barcode:b},{"$set":{"color":color, "stats" : "completed"}},(function(err,doc){
       //console.log("the count is "+doc);
        res.json(doc);
        
     }))
  
 })
//for batch compare count
app.get('/batchcount',function(req,res)
{
  //console.log("batchcount batchcount batchcount batchcount gettags batchcount")
 // var barcode=req.query.barcode;
  var a=req.query.count
  //console.log(req.query.count);

 //  var barcode=req.query.barcode;
  var b =parseInt(a)
  //console.log(b);

  db.batch.find({count:b},(function(err,doc){
    //   console.log("the count is "+doc);
        res.json(doc);
        
     }))
  })
//for batch grey color incomplete
app.get('/greycolor',function(req,res)
{
  

  db.batch.find({"color":"grey"},(function(err,doc){
    //   console.log("the count is "+doc);
        res.json(doc);
        
     }))
  })
app.get('/bardata',function(req,res)
{
    //console.log("i received a get request from index");
    db.barcodesumm.find({status:"Inprogress"},function(err,doc){
        //console.log(doc); db.barcodesumm.find({status:"completed"})
        res.json(doc);
})

     })



// prn file generation

app.post('/prn',function(req,res)
{
  //console.log("prn function prn function")
  var ItemName =req.body.itemName;
  if(ItemName == "Big Chain"){
    var path = 'sample/prntext.txt';
    var path1 = 'sample/prnfile.prn';
  } else if(ItemName == "Bangales"){
    var path = 'sample/prnbangalestext.txt';
    var path1 = 'sample/prnbangalesfile.prn';
  }else if(ItemName == "Gold Ring"){
    var path = 'sample/prngoldringtext.txt';
    var path1 = 'sample/prngoldringfile.prn';
  }
  

  var http = require('http');
  fs = require('fs')
  fs.readFile(path, 'utf8', function (err,data) {
      if (err) {
         return console.log(err);
      }
    var ItemName =req.body.itemName;
    var barcode = req.body.barcode;
    var result = data.replace(/Item NameOrCategory/g, ItemName);
    var result1 =result.replace(/12345678/g, barcode);
    
      fs.writeFile(path1, result1, 'utf8', function (err) {
           if (err) return console.log(err);

     //this for batch file and print command
              require('child_process').exec(__dirname + "/batchfile.bat", function (err, stdout, stderr) {
  
                   if (err) {
                     return console.log(err);
                    }

                  //  console.log(stdout);
             });
      });
  });
});
// app.post('/print',function(req,res)
// {
// var http = require('http');
// fs = require('fs')
// fs.readFile('sample/BC_Silver - Copy.txt', 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
    
//    }
//    else
//    {
//     console.log("File reading successful----------------")
//     console.log(data)
//    }

//    var Printer = require('node-printer');
//    console.log(Printer.list());
   

//  // console.log(data);
  
//   //console.log(req.body.chgunt);
//   //console.log(req.body.barcode);
//   //console.log(req.body.iname);
//   // var ItemName =req.body.iname;
//   // var barcode = req.body.barcode;
//   // var Charge1Total =req.body.taxval1;
//   // var GrossQty =req.body.gwt;
//   // var ChargableUnits =req.body.chgunt;

//   //  var result = data.replace(/batch.ItemName/g, ItemName);
//   //  var result1 =result.replace(/batch.Barcode/g, barcode);
//   //  var result2 = result1.replace(/StockBookDetail.Charge1Total/g, Charge1Total);
//   //  var result3 = result2.replace(/StockBookDetail.GrossQty/g, GrossQty );
//   //  var result4 = result3.replace(/StockBookDetail.ChargeableUnits/g, ChargableUnits);
//   //   var result5 =result4.replace(/StockBookDetail.Barcode/g, barcode);
    
//   // fs.writeFile('sample/sample.prn', result5, 'utf8', function (err) {
//   //    if (err) return console.log(err);
//   // });
// });
// });
//getting tax value in index page
// app.get('/gettaxvalue',function(req,res)
// {
//     db.itemrate.find(function(err,doc){
//         res.json(doc);
// })
// })


// 916 rs 2999 data 
app.get('/itemrate',function(req,res)
{
    //console.log("i received a get request from index");
    db.itemrate.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
// configuration details
app.get('/configuration',function(req,res)
{
    //console.log("i received a get request from index");
    db.configurations.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})

//roundOffConfiguration
app.get('/roundOffConfiguration',function(req,res)
{
    db.roundOffConfig.find(function(err,doc){
        res.json(doc);
})
})
// for getting treasure name in barcode summary
app.get('/Treasure',function(req,res)
{
   // console.log("i received a get request from index");
    db.stockpointmaster.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})

app.get('/purity',function(req,res)
{
   // console.log("i received a get request from index");
    db.purity.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
app.get('/uom',function(req,res)
{
   // console.log("i received a get request from index");
    db.uom.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
app.get('/labcal',function(req,res)
{
    //console.log("i received a get request from index");
    db.labcal.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
app.get('/pct:type',function(req,res)
{
  
    var type = req.params.type;
    console.log("pct pct pct pct pct pct pct pct "+type);
    db.pct.find({"type":type},function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
//for list search
app.get('/list',function(req,res)
{
   // console.log("i received a get request from index");
   //22/6 db.barcodesumm.find({status:"Inprogress"},function(err,doc){
        //console.log(doc);
         db.barcodesumm.find({status:"Inprogress"},function(err,doc){
   
        res.json(doc);
})
})
app.get('/listdata:list',function(req,res)
{
    console.log("i list is exicuted list1 list1");
    var tax = req.params.list;
   var tax1=parseInt(tax);
    //console.log("here the replay is "+tax);

   db.tags.find({"count": tax1},function(err,doc){
      //  console.log(doc);
      //  db.tags.find({"count": tax1,"status":"Inprogress"},function(err,doc){
   
        res.json(doc);
})
})
// barcode data
app.get('/getbar:barcodenum',function(req,res)
{
   // console.log("i received a get request from count");
    var tax = req.params.barcodenum;
   var tax1=parseInt(tax);
    //console.log("here the replay is "+tax1);

    //26/4db.batch.find({"barcode": tax1},function(err,doc){
      //20/5  db.batch.find({"barcode": tax1},function(err,doc){
    //db.transactiondetail.find({"barcode": tax1,"orderStatus":"available"},function(err,doc){     
        //console.log(doc);
    db.transactiondetail.find({"barcode": tax1},function(err,doc){     
     
        res.json(doc);
})
})

app.get('/getInvAccNo:invGroupName',function(req,res)
{
   //console.log("i getInvAccNo getInvAccNo getInvAccNo getInvAccNo getInvAccNo");
    var invGroupName = req.params.invGroupName;
    console.log(invGroupName)
   
    db.inventoryGroupAccMaster.find({"InvGroupName": invGroupName},function(err,doc){     
        console.log(doc);
        res.json(doc);
})
})

// app.get('/tags',function(req,res)
// {
//     //console.log("i received a get request from index");
//     db.tags.find(function(err,doc){
//         //console.log(doc);
//         res.json(doc);
// })
// })
// iam working here                 eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
app.get('/batchdata',function(req,res)
{
  //console.log("gettags gettags gettags gettags gettags gettags gettags gettags");
  var count=req.query.count;

  count = parseInt(count)
  var tags = req.query.tags;
  tags = parseInt(tags)
   db.batch.find({count:count}).sort({_id:-1}).limit(tags,function(err,doc)
    {
        res.json(doc);
    })
   // db.batch.find({count:count,"stats" : "Inprogress"}).sort({_id:-1}).limit(1,function(err,doc)
   //  {
   //      res.json(doc);
   //      //console.log(doc);
   //  })
})

// app.get('/batchdata/:update',function(req,res)
// {
//   var count = req.params.update;
  
//     count = parseInt(count)
//      db.batch.find({count:count}).sort({_id:-1},function(err,doc)
//     {
//         res.json(doc);
//     })
// })
// for batch records
app.get('/batchrecords/:update',function(req,res)
{ 
     var str = req.params.update;
   console.log(" in list batchrecords exicuted");
    var str_array=str.split(",");
    var count=str_array[0];
    count = parseInt(count)
    // console.log("status is"+status);
    // var code1=str_array[1]
   //console.log("the last record is")
   //console.log(count)
    db.batch.find({count:count,"stats" : "Inprogress"},function(err,doc)
    {
        res.json(doc);
        //console.log(doc);
    })
})
//for barcode identity
// app.get('/getbarcode',function(req,res)
// {
//     console.log("the batch no is")
//    // db.batch.find(function(err,doc)
//     db.transactiondetail.find({partyname:partyname},function(err,doc){
//         res.json(doc);
//         console.log(doc);
//     });
// });
app.post('/tags',function(req,res)
{
    
    db.tags.insert(req.body,function(err,doc)
    {
   res.json(doc);
    })

})
// edit update
app.put('/tagsupdate',function(req,res)
{
  console.log("tagsupdate tagsupdate tagsupdate tagsupdate ")
    db.tags.update(req.body,function(err,doc)
    {
   res.json(doc);
    })

})
// for last record in barcode generation
app.get('/lastrec/:update',function(req,res)
{ 
     var str=req.params.update;
  //  console.log(str);
    var str_array=str.split(",");
    var count=str_array[0];
    count = parseInt(count)
    // console.log("status is"+status);
    // var code1=str_array[1]
   //console.log("the last record is")
   //console.log(count)
   //db.transactiondetail.find({count:count}).sort({_id:-1}).limit(1
    db.batch.find({count:count,"stats" : "Inprogress"}).sort({_id:-1}).limit(1,function(err,doc)
    {
        res.json(doc);
        //console.log(doc);
    })
})
// history details
app.get('/history',function(req,res)
{       
   // console.log("entered into new  trans data");
    var barcode=req.query.barcode;
    db.batch.find({barcode:barcode},function(err,doc){ 
     
        res.json(doc);
       
    });
});
//for barcode generation
app.get('/barcode',function(req,res)
{       
   
    var barcode=req.query.barcode;
    

    db.transactiondetail.find({barcode:barcode},function(err,doc){ 
     // console.log(" in new history")
        res.json(doc);
       // console.log(doc);
    });
});

//for color change
app.get('/batchbarcode',function(req,res)
{       
   
    var barcode=req.query.barcode;
    barcode = parseInt(barcode)

    db.batch.find({barcode:barcode},function(err,doc){ 
     // console.log(" in new history")
        res.json(doc);
       // console.log(doc);
    });
});
// app.get('/barcode1',function(req,res)
// {       
//     console.log("entered into new  trans data");
//     var barcode=req.query.barcode;
//     console.log(barcode)
//     // console.log(str);
//     // var str_array=str.split(",");
//     // var partyname=str_array[0];
//     // console.log(partyname);

//     db.transactiondetail.find({barcode:barcode},function(err,doc){ 
//       console.log(" in new history")
//         res.json(doc);
//         console.log(doc);
//     });
// });
app.post('/userdata/:updat',function(req,res){
    //console.log("igot order requestttttttttttttttttttttt");
 var str=req.params.updat;
    //console.log(str);
    var str_array=str.split(",");
    var tran=str_array[0];
    //console.log("status is"+status);
    var code1=str_array[1]
    var bar =parseInt(code1);
  //  console.log("code1"+code1)
    var chgunt=str_array[2]
    var date=str_array[3]
    var desc=str_array[4]
    var final=str_array[5]
    var gpcs=str_array[6]
    var gwt=str_array[7]
    var iname=str_array[8]
    var ntwt=str_array[9]
    var partyname=str_array[10]
    var size=str_array[11]
    var taxval1=str_array[12]
    var taxamt1=str_array[13]
   var wt=str_array[14]

    var wastage=str_array[15]
    var stval=str_array[16]
    var labval=str_array[17]
    var rate=str_array[18]
    var stock=str_array[19]
    //console.log(partyname)
    console.log("finished")
    //db.useritem.insert
     db.useritem.insert({"barcode":bar,"Transaction":tran,"chgunt":chgunt,"date":date,"desc":desc,"final":final,"gpcs":gpcs,"gwt":gwt,
        "name":iname,"ntwt":ntwt,"partyname":partyname,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,"StockInward":stock,"wastage":wastage,"stval":stval,"labval":labval},function(err,doc){
     
    //var document={name:name,city:city,no:no,email:email,street:street};
   // db.useritem.insert(req.body,function(err,doc){
        res.json(doc);
      //  console.log(doc);
    
})
})


//  app.get('/transdetails/:update',function(req,res)
// {       
//     console.log("entered into new  trans data");
//     var str=req.params.update;
//     console.log(str);
//     var str_array=str.split(",");
//     var partyname=str_array[0];
//     console.log(partyname);
// for urd rd normal transaction
app.post('/savedata1/:update',function(req,res){
  console.log("save data save data  save data  save data save data save data ")
 // console.log(req.body.date)

//   console.log(req.body.gwt)
// console.log(req.body.rate)
// $scope.transaction+"1,"+$scope.userit[i].barcodeNumber+"2,"+$scope.userit[i].chgunt+"3,"+$scope.userit[i].date+"4,"+$scope.userit[i].desc+"5,"
//                      +$scope.userit[i].final+"6,"+$scope.userit[i].gpcs+"7,"+$scope.userit[i].gwt+"8,"+$scope.userit[i].itemName+",9"+$scope.userit[i].ntwt+"10,"+$scope.partyname+"11,"
//                      +$scope.userit[i].size+"12,"+$scope.userit[i].taxval+"13,"+$scope.userit[i].taxamt+"14,"+$scope.userit[i].stwt+"15,"+$scope.userit[i].wastage+"16,"+$scope.userit[i].stval+"17,"
//                      +$scope.userit[i].labval+"18,"+$scope.userit[i].rate +"19,"+ $scope.userit[i]._id +"20,"+$scope.userit[i].StockFrom+"21,"+$scope.userit[i].StockTo+"22,"
//                      +$scope.userit[i].withinstatecgst+"23,"+$scope.userit[i].withinstatesgst +"24,"+ $scope.userit[i].outofstateigst 25  
//  ","+$scope.userit[i].purity+","+$scope.userit[i].pctcal+","+$scope.userit[i].labcal+","+$scope.userit[i].uom+","+$scope.userit[i].stonecal;
                               
                 
 var str=req.params.update;
    console.log(str);
   // console.log(req.body.date3)
    //var str=req.params.updat;
   // console.log(str);
    var str_array=str.split(",");
    var tran=str_array[0];
    //console.log("status is"+status);
    var code1=str_array[1]
    var bar =parseInt(code1);
    // console.log(code1)
    // console.log("code"+code1)
    // console.log("bar"+bar)
    //console.log("code1 the code is lok here eeeeeeeeeeeeeeeeeeeeeeeeeeeee "+code1)

    var chgunt=str_array[2]
    var date=str_array[3]
    var desc=str_array[4]
    var final=str_array[5]
    var gpcs=str_array[6]
    
    if( gpcs == "undefined"){
           gpcs = 0
        }else{
          gpcs = parseFloat(gpcs)
        }
    var gwt=str_array[7]
    gwt = parseFloat(gwt)
    var iname=str_array[8]
    var ntwt=str_array[9]
    ntwt = parseFloat(ntwt)
    var partyname=str_array[10]
    var size=str_array[11]
    var taxval1=str_array[12]
    var taxamt1=str_array[13]
    var wt=str_array[14]

    if( wt == "undefined"){
           wt =null
        }
        wt = parseFloat(wt)
    var wastage=str_array[15] //
    var stval=str_array[16] //
    var labval=str_array[17] //
    var rate=str_array[18]
  
  // var id=str_array[19]
    //console.log("here is iddddddddddddddddd   "+id)
     var stockin=str_array[20]
   // console.log("here is idddddddddstockin"+stockin)
      var stockout=str_array[21]
     // console.log("here is idddddddddstockout"+stockout)
      //var order = "Inprogress"
       // var order =str_array[22]

      
         var withinstatecgst =str_array[22]
         var withinstatesgst  =str_array[23]
         var outofstateigst =str_array[24]    
// var data1 = data+","+$scope.userit[i].stockPoint+","+$scope.userit[i].stockInward;
          var stockPoint  =str_array[25]
         var stockInward =str_array[26]                //       console.log(data1)
         var Hsc  =str_array[27]
         console.log(" Hsc   Hsc  Hsc  Hsc  Hsc  Hsc  Hsc  Hsc "+Hsc )
//  ","+$scope.userit[i].purity+","+$scope.userit[i].pctcal+","+$scope.userit[i].labcal+","+$scope.userit[i].uom+","+$scope.userit[i].stonecal;
   
          var purity  =str_array[28]
          var pctcal  =str_array[29]                     
          var labcal  =str_array[30]
          var uom  =str_array[31]
          var stonecal  =str_array[32]
          var salesPerson = str_array[33] 
           var AccNo = str_array[34]
           var labourTaxValue = str_array[35]
          var labamt  =str_array[36]
          var urdAdjustment = str_array[37]
          var stchg = str_array[38]
          var comboItem = str_array[39]
           var mrp = str_array[40]
          //  mrp = parseFloat(mrp)
          console.log("mrp mrp mrp mrp "+mrp)
       
        if( mrp == "undefined"){
            mrp = null;
        }else{
          mrp = parseFloat(mrp)
         }
        if(stchg == "undefined"){
          stchg = null;
        }
        if( withinstatecgst == "undefined"){
          withinstatecgst =null
          withinstatesgst =null
        }
        if( outofstateigst == "undefined"){
          outofstateigst =null
        }
        if( wastage == "undefined"){
            wastage =null
        }
        if( stval == "undefined"){
           stval =null
        }
        if( labval == "undefined"){
          labval =null
        }
        if( desc == "undefined"){
          desc =null
        }
        if( size == "undefined"){
          size =null
        }
        if( labourTaxValue == "undefined"){
          labourTaxValue =null
        }


  // console.log("db.transactiondetail.insert db.transactiondetail.insert db.transactiondetail.insert db.transactiondetail.insert")
  //    db.transactiondetail.insert(req.body,function(err,doc){
  //       res.json(doc);
  //     })
 // db.transactiondetail.insert({"partyname":partyname,"Transaction":"train",orderStatus:"Inprogress"},function(err,doc){ 
            
 //        res.json(doc);
 //    });
  if( wt == "undefined"){
           wt =null
        }
        wt = parseFloat(wt)
        if(tran == "Regular Sale"){
         db.transactiondetail.insert({"Transaction":tran,"barcodeNumber":bar,"chgunt":chgunt,"date":date,"desc":desc,"final":final,"gpcs":gpcs,"gwt":gwt,
                "itemName":iname,"ntwt":ntwt,"partyname":partyname,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,"wastage":wastage,"stval":stval,
                "labval":labval,"orderStatus":"Inprogress","StockInward":stockInward,"withinstatecgst":withinstatecgst,"withinstatesgst":withinstatesgst,
                "outofstateigst":outofstateigst,"stockInward":stockInward,"Hsc":Hsc,"purity":purity,"uom":uom,"pctcal":pctcal,"labcal":labcal,
                "stonecal":stonecal,'salesPerson':salesPerson,'AccNo':AccNo,'labourTaxValue':labourTaxValue,'labamt':labamt,'stchg':stchg,'comboItem':comboItem,'mrp':mrp},function(err,doc){
                res.json(doc);
                // console.log("response look here")
                // console.log(doc);   
        })
       }else{
         db.transactiondetail.insert({"Transaction":tran,"barcodeNumber":bar,"chgunt":chgunt,"date":date,"desc":desc,"final":final,"gpcs":gpcs,"gwt":gwt,
                "itemName":iname,"ntwt":ntwt,"partyname":partyname,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,"wastage":wastage,"stval":stval,
                "labval":labval,"orderStatus":"Inprogress","StockInward":stockInward,"withinstatecgst":withinstatecgst,"withinstatesgst":withinstatesgst,
                "outofstateigst":outofstateigst,"stockInward":stockInward,"Hsc":Hsc,"purity":purity,"uom":uom,"pctcal":pctcal,"labcal":labcal,
                "stonecal":stonecal,'salesPerson':salesPerson,'AccNo':AccNo,'labourTaxValue':labourTaxValue,'labamt':labamt,"urdAdjustment":urdAdjustment,'stchg':stchg,'comboItem':comboItem,'mrp':mrp},function(err,doc){
                res.json(doc);
                // console.log("response look here")
                // console.log(doc);   
        })
       }

})


app.post('/batchdata1',function(req,res){
   
     delete( req.body.irate);
     // req.body.date = req.body.barcode 

    //var document={name:name,city:city,no:no,email:email,street:street};
    db.batch.insert(req.body,function(err,doc){
        res.json(doc);
       
})
})
// for composite
// app.post('/icomposite',function(req,res){
//     console.log("igot order requesttt");
    
//     console.log(req.body);
//     var name=req.body;
//     console.log("batchdata");
    
//     //var document={name:name,city:city,no:no,email:email,street:street};
//     db.icomposite.insert(req.body,function(err,doc){
//         res.json(doc);
//         //console.log(doc);
//     //})
// })
// })
app.post('/saleinvoicedata',function(req,res){
    
    //var document={name:name,city:city,no:no,email:email,street:street};
    db.saleinvoice.insert(req.body,function(err,doc){
        res.json(doc);
      
})
})
app.post('/bardata',function(req,res){
    
    //var document={name:name,city:city,no:no,email:email,street:street};
    db.barcodesumm.insert(req.body,function(err,doc){
        res.json(doc);
})
})
// for date check
app.post('/datef:date',function(req,res){
    var str=req.params.date;

    var str_array=str.split(",");
    var fdate=str_array[0];
   
    //console.log(frdate)
    var tdate=str_array[1];
   


     db.date2.find({
    date: {
        $gte:(fdate),
     $lt:(tdate)
    }
},function(err,doc){

res.json(doc);
console.log(doc)



})
})

app.get('/dateBatchFind/:date',function(req,res)
{
  //  console.log("i got the date")
    var str=req.params.date;
    //console.log(str);
    var str_array=str.split(",");
    var fdate=str_array[0];
  //  var frdate=new Date(fdate)
    //console.log(frdate)
    var tdate=str_array[1];
    //var todate=new Date(tdate)
    //console.log(todate);
   // date: { $gt:(fromdate), $lt: (reportdate) }
    db.batch.find({date: { $gt:(fdate), $lt: (tdate) }},function(err,doc){
     //console.log(doc);
      res.json(doc);

    })
})
app.get('/itemsdata',function(req,res)
{
   // console.log("i received a get request from index");
    db.items.find(function(err,doc){
     //   console.log(doc);
        res.json(doc);
})
})
//hsc fetch during change barcode fetch
app.get('/itemsdatachange:itemName',function(req,res)
{
   console.log("itemsdatachange itemsdatachange itemsdatachange itemsdatachange");
  // console.log(req.body.itemName)
   var itemname=req.params.itemName;
   console.log(itemname)
    db.items.find({Name:itemname},function(err,doc){
     //   console.log(doc);
        res.json(doc);
     //      db.inventorygroupmaster.find({InvGroupName:itemname},function(err,doc){
     // //   console.log(doc);
     //    res.json(doc);
})
})

app.get('/itemdetails:itemname',function(req,res)
{
    console.log("i received a get request from index");
    var itemname=req.params.itemname;


    console.log("Item details function called+++++++++"+itemname)
    console.log(itemname)
    db.inventorygroupmaster.find({InvGroupName:itemname},function(err,doc){
       console.log(doc);
        res.json(doc);
})
})

app.get('/itemnamedetails:itemname',function(req,res)
{
   // console.log("i received a get request from index");
    var name=req.params.itemname;

   // console.log("Item details function called+++++++++"+itemname)
  
    db.items.find({Name:name},function(err,doc){
     //console.log(doc.Name);
        res.json(doc);
})
})

app.get('/itemPurityDetails:inGrpId',function(req,res)
{
   // console.log("i received a get request from index");
    var str=req.params.inGrpId;
    var str_array=str.split(",");
    var itemgroupid=str_array[0];
    var currentdate =str_array[1];
    // console.log("Item purity details function called-----"+itemgroupid)
    // var currentdate = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
    //  currentdate =currentdate.slice(0, 10);
    //   console.log("curreenenen "+currentdate)
  //name changed+current date
   // db.inventorygroupvaluenotation.find({InvGroupID:itemgroupid},function(err,doc){
      db.inventorygroupvaluenotationdaily.find({InvGroupID:itemgroupid,date:currentdate},function(err,doc){
    console.log("purity call")
     //   console.log(doc);
        res.json(doc);
})
})
//insert
app.post('/transactionstoc/:updat',function(req,res)
{
    //console.log("iam updating here is this kkkkkkkk");
   
    var str=req.params.updat;
    //console.log(str);
    var str_array=str.split(",");
    var pre=str_array[0];
    var type=str_array[1];
  
     db.transactionInvoice.insert({"prefix":pre,"typeno":type},function(err,doc){
        //res.json(doc);
      //   console.log(doc);
        res.json(doc);
      });
})
// find
app.get('/transactionsto/:updat',function(req,res)
{//transactionsto
   // console.log("iam updating here is this kkkkkkkk");
   
    var str=req.params.updat;
    //console.log(str);
    var str_array=str.split(",");
    var pre=str_array[0];
    var type=str_array[1];
  
     db.transactionInvoice.count({"prefix":pre},function(err,doc){
        //res.json(doc);
        // console.log(doc);
        res.json(doc);
      });
})
// for transaction details collection in barcode generation
// app.put('/transactionstock',function(req,res){
//     console.log("igot barcode data connection establisheddddddddddddddddddddddddddddddddddddddddddddddddd");
//     //console.log(req.body.partyname);
//     var barcode=req.body;
//     console.log("bar code details");
//     console.log(barcode);
    
//     //var document={name:name,city:city,no:no,email:email,street:street};
//    // db.transactiondetails.insert({barcode:"barcode",Transaction:"Barcoding",StockInward:"yes"},function(err,doc){
//      db.transactiondetails.insert(req.body,function(err,doc){
        
//         res.json(doc);
// })
// })
//app.post('/transactionstock/:update',function(req,res)
app.post('/transactionstock',function(req,res)
{
    delete(req.body.Batch)
    delete(req.body.stats)
    delete(req.body.tags)
    delete(req.body.wt)
    delete(req.body.color)
     delete( req.body.irate)

 db.transactiondetail.insert(req.body,function(err,doc){
     
        res.json(doc);
     //   console.log(doc);
    
})
})
// for transaction details for barcoding parallel in and out
app.post('/transactionstockInward',function(req,res)
{
     // delete(req.body.Transaction)
       delete(req.body.orderStatus)
        req.body.StockInward = "no"
        req.body.refid = req.body.barcode 
       delete( req.body.orderstatus)
        req.body.barcode = ""
       delete( req.body.voucherClass)
       delete( req.body.irate)
              delete( req.body.voucherClassId) 
              delete( req.body.transactionTypeId )
               delete( req.body.invGroupName )
               delete( req.body.invGroupAccNo )
              delete( req.body.voucherDate)
               delete( req.body.voucherTime )
            req.body.ntwt  = parseFloat(req.body.ntwt)
            req.body.gwt  = parseFloat(req.body.gwt)
            req.body.gpcs  = parseFloat(req.body.gpcs)
      db.transactiondetail.insert(req.body,function(err,doc){
       res.json(doc);    
})
})
// for transaction details collection in inventory
app.get('/transactiondetails',function(req,res)
{
    //console.log("i received a get request from index");
  db.transactionSeriesInvoice.find(function(err,doc){
      //  console.log(doc);
        res.json(doc);
})
})

app.get('/cash',function(req,res)
{
   // console.log("i received a get request from index");
    db.mode.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})

app.get('/bank',function(req,res)
{
    console.log("i received a get request from index");
    db.bank.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})

app.get('/user',function(req,res)
{
    console.log("i received a get request from user");
    db.user.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})

//get sales person names
app.get('/getSalesPerson',function(req,res)
{
    console.log("i received a get request from user");
    db.salesPerson.find(function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
// Transaction urd
app.post('/Transaction',function(req,res)
{ 
    console.log("from transaction");
    console.log(req.body);
   
    db.transaction.insert(req.body,function(err,doc){
        res.json(doc);
        console.log(doc);

})
})
// for urd status update
app.put('/urdstatus123/:data',function(req,res)
{ 
  var str=req.params.data;
    console.log(str);

    var str_array=str.split(",");
    var id=str_array[0];
      var orderstatus = "completed"
  db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"orderStatus":orderstatus}},function(err,doc)
        {
        res.json(doc);
        console.log(doc)
       });

 })
app.put('/urdstatus/:data',function(req,res)
{ 
  
    var str=req.params.data;
    console.log(str);

    var str_array=str.split(",");
    var id=str_array[0];
    console.log(id);
    var diff = str_array[1];
    var urdRefund = str_array[2];
     console.log("diff  console.log(diff);  console.log(diff);  console.log(diff);  console.log(diff);");
    console.log(diff);
    console.log("urdRefund "+urdRefund );
    if(urdRefund == undefined){
       console.log("urdRefund == undefined "+urdRefund );
      var orderstatus = "Inprogress"
      db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"orderStatus":orderstatus, "urdAdjustment" :diff}},function(err,doc)
        {
        res.json(doc);
        console.log(doc)
       });

    }else{
      console.log("urdRefund == defined "+urdRefund );
    var orderstatus = "completed"
  db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"orderStatus":orderstatus, "urdAdjustment":diff, "urdRefund":diff }},function(err,doc)
        {
        res.json(doc);
        console.log(doc)
       });
}
})
// Transaction rd
app.put('/RD',function(req,res)
{ 
    console.log("from rd");
    console.log(req.body);
    var name=req.body;
    db.transaction.insert(req.body,function(err,doc){
        res.json(doc);
})
})
// Transaction regularsale
app.put('/RegularSale',function(req,res)
{ 
    console.log("from regularsale");
    console.log(req.body);
    var name=req.body;
    db.transaction.insert(req.body,function(err,doc){
        res.json(doc);
})
})
app.get('/trans',function(req,res){
  //console.log("I received a new username request for login and document");
  var partyname=req.query.partyname;
  
  db.transaction.find({partyname:partyname},function(err,doc){
        res.json(doc);
       // console.log(doc);
    });
});

app.put('/status/:update',function(req,res)
{
    console.log("iam updating here is this kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
   
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var status=str_array[0];
    console.log("status is"+status);
    var code1=str_array[1]
  //  var barcode =parseInt(code1);
    console.log("code1"+code1)
    var partyname=str_array[2]
    console.log(partyname)

     var trans=str_array[3]
    console.log(trans)
    console.log("finished")
     db.batch.update({"barcode":code1},{"$set":{"stats":status,"Transaction":trans,"partyname":partyname}},function(err,doc){
        //res.json(doc);
        if(err)
        {
            console.log(err)
        }

        console.log("noerror, the updated data is ")
         console.log(doc);
        res.json(doc);
      });
})
// for transaction details
app.post('/transactiondetail/:updat',function(req,res)
{
    console.log("iam updating here is this kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
   
    var str=req.params.updat;
    console.log(str);
    var str_array=str.split(",");
    var tran=str_array[0];
    //console.log("status is"+status);
    // var code1=str_array[1]
    // var bar =parseInt(code1);
    var bar = str_array[1];
  //  console.log("code1"+code1)
    var chgunt=str_array[2]
    var date=str_array[3]
    var desc=str_array[4]
    var final=str_array[5]
    var gpcs=str_array[6]
    var gwt=str_array[7]
    var iname=str_array[8]
    var ntwt=str_array[9]
    var partyname=str_array[10]
    var size=str_array[11]
    var taxval1=str_array[12]
    var taxamt1=str_array[13]
    var wt=str_array[14]

    var wastage=str_array[15]
    var stval=str_array[16]
    var labval=str_array[17]
    var rate=str_array[18]

    var stock=str_array[19]
    //console.log(partyname)
    console.log("finished")
    db.transactiondetail.insert({"barcode":bar,"Transaction":tran,"chgunt":chgunt,"date":date,"desc":desc,"final":final,"gpcs":gpcs,"gwt":gwt,
        "name":iname,"ntwt":ntwt,"partyname":partyname,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,"StockInward":stock,
        "wastage":wastage,"stval":stval,"labval":labval},function(err,doc){
        //res.json(doc);
        if(err)
        {
            console.log(err)
        }

        console.log("noerror, the updated data is ")
         console.log(doc);
        res.json(doc);
      });
})
// sale return update
app.post('/salereturn/:updat',function(req,res)
{
    console.log("iam updating here is this kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
   
    var str=req.params.updat;
    console.log(str);
    var str_array=str.split(",");
    var tran=str_array[0];
    //console.log("status is"+status);
    // var code1=str_array[1]
    // var bar =parseInt(code1);
    var bar = str_array[1]
  var chgunt=str_array[2]
    var date=str_array[3]
    var desc=str_array[4]
    var final=str_array[5]
    var gpcs=str_array[6]
    var gwt=str_array[7]
    var iname=str_array[8]
    var ntwt=str_array[9]
    var partyname=str_array[10]
    var size=str_array[11]
    var taxval1=str_array[12]
    var taxamt1=str_array[13]
    var wt=str_array[14]

    var wastage=str_array[15]
    var stval=str_array[16]
    var labval=str_array[17]
    var rate=str_array[18]

    var stock=str_array[19]
    //console.log(partyname)
    console.log("finished")
     db.transactiondetail.insert({"barcode":bar,"Transaction":tran,"chgunt":chgunt,"date":date,"desc":desc,"final":final,"gpcs":gpcs,"gwt":gwt,
        "name":iname,"ntwt":ntwt,"partyname":partyname,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,"StockInward":stock,"wastage":wastage,"stval":stval,"labval":labval},function(err,doc){
        //res.json(doc);
        if(err)
        {
            console.log(err)
        }

        console.log("noerror, the updated data is ")
         console.log(doc);
        res.json(doc);
      });
})
//history 
app.post('/historyupdate/:updat',function(req,res){
    console.log("igot order requestttttttttttttttttttttt");
 var str=req.params.updat;
    console.log(str);
    var str_array=str.split(",");
    var date=str_array[0];
    //console.log("status is"+status);
    var tran=str_array[1]
   
    var voucher=str_array[2]
    var value=str_array[3]
    var remarks=str_array[4]
    var party=str_array[5]   
    console.log(party) 
     db.history.insert({Date:date,TransactionType:tran,Value:value,VoucherNo:voucher,Remarks:remarks,partyname:party},function(err,doc){
     
    //var document={name:name,city:city,no:no,email:email,street:street};
   // db.useritem.insert(req.body,function(err,doc){
        res.json(doc);
        console.log(doc);
    
})
})
// for pdf data generation using barcode
app.get('/getparty',function(req,res)
{    
   // console.log("iam pdf ppppppppppppppppppppppppppppppppaaaaaaaa");
    // var partyname=req.query.name;
var id =req.query.id;
     //  console.log(partyname);
     // var trans=req.query.Transaction;
     // console.log(trans);
    //db.transactiondetail.find({"partyname":partyname,"Transaction":trans},function(err,doc){
      db.transactiondetail.find({_id:mongojs.ObjectId(id)},function(err,doc){
        
        res.json(doc);
        console.log(doc);
    });
})
app.put('/confirm/:update',function(req,res)
{
    console.log("iam updating here is this confirm button");
   
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var status=str_array[0];
    console.log("status is"+status);
    var code1=str_array[1]
    var barcode =parseInt(code1);
    console.log("code1"+code1)

    console.log("finished")
     db.batch.update({"barcode":barcode},{"$set":{"stats":status}},function(err,doc){
        res.json(doc);
        if(err)
        {
            console.log(err)
        }

        console.log("noerror")
      });
})
//transaction confirmation 
app.post('/confirmtransaction/:data',function(req,res)
{
    var str=req.params.data;
    console.log("Order confirmation function called----------");
    console.log(str);

    var str_array=str.split(",");
    var id=str_array[0];
    var status =str_array[1];
    var bar =str_array[2];
     console.log(id)
    console.log(status)
     console.log(bar)
//({_id:mongojs.ObjectId(id)},{$set:{"Tran
//if(bar == "undefined"){
     db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"orderStatus":status}},function(err,doc)
        {
        res.json(doc);
       });

// }else{
//     db.transactiondetail.update({_id:id},{$set:{"orderstatus":status}},function(err,doc)
//         {
//         res.json(doc);
//        });
//     }
})

app.get('/count1/:count',function(req,res)
{
   // console.log("iam finding count ");
   
    var str=req.params.count;
    
    var count1 =parseInt(str);
   // console.log("count"+count1)

    //console.log("finished")
     db.barcodesumm.find({"count":count1},function(err,doc){
        //res.json(doc);db.barcodesumm.find({"count":1})
        if(err)
        {
            console.log(err)
        }

        //console.log("noerror")
        res.json(doc);
      });
})
// for split result
app.post('/splitreturn',function(req,res)
{
 // console.log("iam inserting in the split table ");
   //console.log(req.body)
     db.transactiondetail.insert(req.body,function(err,doc){
       // console.log("noerror")
        res.json(doc);
      });
})

// for combo new barcode
app.post('/combotransactiondetail',function(req,res)
{
 // console.log("iam inserting in the split table ");
   //console.log(req.body)
     db.transactiondetail.insert(req.body,function(err,doc){
       // console.log("noerror")
        res.json(doc);
      });
})


app.get('/useritfind/:update',function(req,res)
{ 
    var str=req.params.update;
   // console.log(str);
    var str_array=str.split(",");
    var id=str_array[0];
    //  console.log("the array is idddddddddddddddddddddddddddddddddddddddd");
    // console.log(id);
     //db.useritem.findOne({_id:id},function(err,doc){
     // db.useritem.update({"barcode":barcode},{$set:{"partyname":partyname,"name":name,"gwt":gwt,"rate":rate,"total":tot}},function(err,doc){
     // db.transactiondetail.findOne({_id:id},function(err,doc){
        db.transactiondetail.find({_id:mongojs.ObjectId(id)},function(err,doc){
   //{_id:mongojs.ObjectId(id)
     if(err)
        {
            console.log(err)
        }
       // console.log("findOne");
        res.json(doc);
        //console.log(doc);
      })

})

app.get('/editsummarycount',function(req,res)
{ 
    var count1=req.query.count;
    count1 = parseInt(count1)

      db.tags.find({count:count1},function(err,doc){
  if(err)
        {
            console.log(err)
        }
       // console.log("findOne");
        res.json(doc);
        //console.log(doc);
      })

})
//for updaet of edited editsummarycountupdate
app.put('/editsummarycountupdate/:update',function(req,res)
{ 
  
var str=req.params.update;
    console.log(str);
    //var str=req.params.updat;
   // console.log(str);
    var str_array=str.split(",");
    var id=str_array[0];
    //console.log("status is"+status);
    var count=str_array[1]
   // =parseInt(code1);
    
    //console.log("code1 the code is lok here eeeeeeeeeeeeeeeeeeeeeeeeeeeee "+code1)

     var date=str_array[2]
    var ItemName=str_array[3]
    var wt=str_array[4]
    var pcs=str_array[5]
    var titems=str_array[6]
    var remark=str_array[7]
    
    var stockin=str_array[8]
    var stockout=str_array[9]
    var composite=str_array[10]
    var splittable=str_array[11]
    
  
     

 // db.barcodesumm.update({_id:mongojs.ObjectId(id)},
 //  update:{$set:{itemname: req.body.itemname, stockfrom: req.body.stockfrom ,totalpcs:req.body.totalpcs,totalweight:req.body.totalweight,totaltags:req.body.totaltags}},new :true},function(err,doc){
  
  db.barcodesumm.update({_id:mongojs.ObjectId(id)},{$set:{"itemname":ItemName,"stockfrom":stockout,"stockto":stockin,"totalpcs":pcs,"totalweight":wt,"totaltags":titems,"count":count,
        "date":date,"composite":composite,"split":splittable,"remarks":remark}},function(err,doc){
   
      
     if(err)
        {
            console.log(err)
        }
        res.json(doc);
        console.log(doc);
      })
});

app.post('/userit12',function(req,res)
{
  //console.log(req.body);
   // console.log("entered into put request $scope.userit[i]._id!=null +++++++=====+++++");
       console.log(req.body.gwt);
        console.log(req.body.gpcs);
      req.body.gpcs =  parseFloat(req.body.gpcs);
       req.body.gwt = parseFloat(req.body.gwt);
         
   db.transactiondetail.insert(req.body,function(err,doc){
   
     if(err)
        {
            console.log(err)
        }
        res.json(doc);
        //console.log(doc);
      })

   // var id = req.body._id
   //     console.log(req.body)
   //     console.log(req.body.barcode)
  
     // db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"Transaction":req.body.Transaction,"barcode":req.body.barcode,"chgunt":req.body.chgunt,"date":req.body.date,"desc":req.body.desc,
     //     "gpcs":req.body.gpcs,"gwt":req.body.gwt,"itemName":req.body.itemName,"ntwt":req.body.ntwt,"rate":req.body.rate,"size":req.body.size,"taxval":req.body.taxval,"stwt":req.body.stwt,"withinstatecgst":req.body.withinstatecgst,
     //     "withinstatesgst":req.body.withinstatesgst,"outofstateigst":req.body.outofstateigst,"partyname":req.body.partyname, "orderStatus":req.body.order,"StockInward":"no",
     //    "wastage":req.body.wastage,"stval":req.body.stval,"labval":req.body.labval,"final":req.body.final,"invGroupAccNO":req.body.invGroupAccNO,"invGroupName":req.body.invGroupName,
     //   "transactionTypeId":req.body.transactionTypeId,"voucherClass":req.body.voucherClass,"voucherClassId":req.body.voucherClassId,"voucherDate":req.body.voucherDate,"voucherTime":req.body.voucherTime,}},function(err,doc)
      
     //    {
     //        res.json(doc);
        
     //    });  
});
// for update of userit
app.put('/useritupdate',function(req,res)
{
   
    var id = req.body._id
       // console.log(req.body)
       // console.log(req.body.barcode)
  
     db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"Transaction":req.body.Transaction,"barcode":req.body.barcode,"chgunt":req.body.chgunt,"date":req.body.date,"desc":req.body.desc,
         "gpcs":req.body.gpcs,"gwt":req.body.gwt,"itemName":req.body.itemName,"ntwt":req.body.ntwt,"rate":req.body.rate,"mrp":req.body.mrp,"size":req.body.size,"taxval":req.body.taxval,"stwt":req.body.stwt,"withinstatecgst":req.body.withinstatecgst,
         "withinstatesgst":req.body.withinstatesgst,"outofstateigst":req.body.outofstateigst,"partyname":req.body.partyname, "orderStatus":req.body.orderStatus,"StockInward":"no",
        "wastage":req.body.wastage,"stval":req.body.stval,"labval":req.body.labval,"final":req.body.final,"invGroupAccNO":req.body.invGroupAccNO,"invGroupName":req.body.invGroupName,
       "transactionTypeId":req.body.transactionTypeId,"voucherClass":req.body.voucherClass,"voucherClassId":req.body.voucherClassId,"voucherDate":req.body.voucherDate,"voucherTime":req.body.voucherTime,
       "salesPerson":req.body.salesPerson,"AccNo":req.body.AccNo,"labourTaxValue":req.body.labourTaxValue,'labamt':req.body.labamt,'stchg':req.body.stchg,'comboItem':req.body.comboItem}},function(err,doc)
      
        {
            res.json(doc);
        
        });  
     
   
  // }
   // else{
   //  console.log("defined previsly")
   //  console.log("code1 the code is lok here eeeeeeeeeeeeeeeeeeeeeeeeeeeee "+bar)
   // console.log("code"+code1)
   // console.log("bar"+bar)
   //  db.transactiondetail.update({_id:id},{$set:{"Transaction":tran,"barcode":bar,"chgunt":chgunt,"date":date,"desc":desc,"final":final,"gpcs":gpcs,"gwt":gwt,
   //      "name":iname,"ntwt":ntwt,"partyname":partyname,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,"wastage":wastage,"stval":stval,
   //      "labval":labval,"orderstatus":order,"StockInward":"no"}},function(err,doc){
   
     
   //          res.json(doc);
   //          console.log(doc);
   //      })
   //   }
  
});
app.put('/saleinvoicedata12/:update',function(req,res)
{
    console.log("entered into put request for saleinvoicedata saleinvoicedata update ");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var id=str_array[0];
    console.log(id);
    var partyname=str_array[1];
    console.log(partyname);
    var taxableval=str_array[2];
   // console.log(name);
    var tax=str_array[3];
    var subtol=str_array[4];
    var adj=str_array[5];
    var labourValue=str_array[6];
    
    if(labourValue == "undefined"){
      labourValue = 0;
    }
    console.log(labourValue)
    var labourtax=str_array[7];
    if(labourtax == "undefined"){
      labourtax = 0;
    }
    console.log(labourtax)
    var saleInvoiceStatus = str_array[8];
        if(saleInvoiceStatus == "completed"){
           var status = "completed"; 
        }else{
           var status = "In Progress";
        }
var dis = str_array[9];
    var char = str_array[10];
    console.log("char"+char);
     console.log(" char char Charge1Total char char char char char Charge1Total char char");
        if(dis == "undefined"){
      dis = 0;
    }
    if(char == "undefined"){
      char = 0;
    }
    var netamt = str_array[11];
     var invoiceValue = str_array[12];
      var decimals = str_array[13];
      var transaction = str_array[14];
      if(transaction == "RegularSale"){
          db.saleinvoice.update({_id:mongojs.ObjectId(id)},{$set:{"partyname":partyname,"taxableval":taxableval,"tax":tax,"subtol":subtol,"adj":adj,
            "status":status,"labourtax":labourtax,"labourValue":labourValue,"dis":dis,"char":char,"netamt":netamt,"decimals":decimals,"invoiceValue":invoiceValue}},function(err,doc){
              res.json(doc);
              console.log(doc);
          })
        }else{
          db.saleinvoice.update({_id:mongojs.ObjectId(id)},{$set:{"partyname":partyname,"taxableval":taxableval,"tax":tax,"subtol":subtol,"adj":adj,
            "labourtax":labourtax,"labourValue":labourValue,"dis":dis,"char":char,"netamt":netamt,"decimals":decimals,"invoiceValue":invoiceValue}},function(err,doc){
              res.json(doc);
              console.log(doc);
          })

        }
         
})

//confirm
app.put('/saleinvoicedataconfirm/:update',function(req,res)
{
    console.log("saleinvoicedataconfirm call");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    // var id=str_array[0];
    // console.log(id);
    var partyname=str_array[0];
    console.log(partyname);
    var transaction=str_array[1];
    console.log(transaction);
    db.saleinvoice.update({"partyname":partyname,"status":"In Progress", "Transaction" :transaction },{$set:{"status":"completed"}})
    // res.json(doc);
    //     console.log(doc);
})

app.get('/getsaleinvoice_id:id1',function(req,res){
  console.log("getsaleinvoice_id getsaleinvoice_id getsaleinvoice_id ");

  var id=req.params.id1;
  //var trans=req.query.Transaction;
   console.log(id);
   // "_id" : ObjectId("597f10802fec641cfc8ec970"),
  // db.useritem.find({partyname:partyname,Transaction:trans},function(err,doc){
  db.saleinvoice.find({_id:mongojs.ObjectId(id)},function(err,doc){
  
        res.json(doc);
        console.log("here is resulrs")
        console.log(doc);
    });
});

app.get('/menu',function(req,res){
  console.log("I received a menu request");
  var pr=req.query.price;

  db.menu.findOne({name:pr},function(err,doc){
        res.json(doc);
      })
});
// app.get('/itemlist',function(req,res){
//   console.log("I received a username request for login");
//   var ph=req.query.mobile;
//   console.log(ph);
  
//   db.item.findOne({mobile:ph},function(err,doc){
    
//         res.json(doc);
//         console.log(doc);
//       })
// });

// app.delete('/item/:itemname',function(req,res)
// {
//     console.log("hi delete");
//     var str=req.params.itemname;
//     console.log(str);
//     var str_array=str.split(",");
//     var mp=str_array[0];
//     console.log(mp);
//     var iname=str_array[1];
//     //var name=req.params.iname;
//     console.log(iname);
//     db.item.update({mobile:mp},{$pull:{item:{name:iname}}})
// })
app.put('/users/:csfdata',function(req,res){
    console.log("I received a put request")
    var name=req.params.csfdata;
    console.log(name);
   
    db.useritem.update({name:name},{"$push":{items:{name:"",score:""}}},function(err,doc){
    //db.users.update({_id:mongojs.ObjectId(userid),csf:csfname},{"$push":{csf:{name:csfname,score:score,percentage:per,date:date,actdef:actdef}}},function(err,doc){   
   /* db.users.update({"name":username,"csf.id":csfid},
{$set:{"csf.$.score":score,"csf.$.percentage":per,"csf.$.date":date,"csf.$.actdef":actdef}})*/
});
});
app.get('/userit',function(req,res){
  console.log("I received a new username request for login and document from pdf");
  var partyname=req.query.partyname;
  var trans=req.query.Transaction;
  var voucherNo = req.query.voucherNo;
   console.log(trans);
  // db.useritem.find({partyname:partyname,Transaction:trans},function(err,doc){
  db.transactiondetail.find({partyname:partyname,Transaction:trans,orderStatus:"Inprogress"},function(err,doc){
  
        res.json(doc);
        console.log(doc);
    });
});

app.get('/voucherNoGetDetails',function(req,res){
  console.log("I received request for details by id+++++++++------");
  var voucherNo = req.query.voucherNo;
  //var trans=req.query.Transaction;
   console.log(voucherNo);
  // db.useritem.find({partyname:partyname,Transaction:trans},function(err,doc){
  db.transactiondetail.find({"voucherNo":voucherNo},function(err,doc){
  
        res.json(doc);
        console.log(doc);
    });
});

app.get('/voucherNoGetDetailsSaleInvoice/:data',function(req,res){
  console.log("I received request for details by id+++++++++------");
  var voucher=req.params.data;
  //var trans=req.query.Transaction;
   console.log(voucher);
  // db.useritem.find({partyname:partyname,Transaction:trans},function(err,doc){
  db.saleinvoice.find({"voucherNo":voucher},function(err,doc){
  
        res.json(doc);
        console.log(doc);
    });
});



app.get('/transactiondetailbyid:id',function(req,res){
  console.log("I received request for details by id+++++++++------");
  var id=req.params.id;
  //var trans=req.query.Transaction;
   console.log(id);
  // db.useritem.find({partyname:partyname,Transaction:trans},function(err,doc){
  db.transactiondetail.find({_id:mongojs.ObjectId(id)},function(err,doc){
  
        res.json(doc);
        console.log(doc);
    });
});

app.put('/tdetailupdatebyid:str1',function(req,res){
  console.log("transactiondetailupdatebyid function called =========================================================");
  var str2=req.params.str1;
  console.log(str2)
  var str_array = str2.split(",");
  var id =  str_array[0];
  var orderstatus = str_array[1];
  console.log(id)
  console.log(orderstatus)

  //var trans=req.query.Transaction;
   
  // db.useritem.find({partyname:partyname,Transaction:trans},function(err,doc){
  db.transactiondetail.update({_id:mongojs.ObjectId(id)},{$set:{"orderStatus":orderstatus}},function(err,doc)
        {
        res.json(doc);
       console.log(doc)
       });
});
 
 app.get('/getsaleinv',function(req,res){
  console.log("I received a new username request for login and document saleinv lok here");
  var username=req.query.name;
  var trans=req.query.Transaction;
   console.log(trans);
   // if(status = "completed"){
   //    db.saleinvoice.find({partyname:username,Transaction:trans, status : "In Progress"},function(err,doc){
   //      res.json(doc);
   //      console.log("here is data completed");
   //      console.log(doc);
   //    });
   // }
  // else{
    db.saleinvoice.find({partyname:username,Transaction:trans, status : "In Progress"},function(err,doc){
        res.json(doc);
        console.log("here is data in progress "+ doc);
        console.log(doc);
    });
   //}
  
});

app.get('/useradj',function(req,res){
  console.log("I received a new username request for login and document");
  var username=req.query.name;
  db.useradj.find({partyname:username},function(err,doc){ 
    // db.transaction.find({partyname:username},function(err,doc){
        res.json(doc);
        console.log(doc);
    });
});
app.put('/useradjupdate/:update',function(req,res)
{
    console.log("entered into new tablwwwwwwwwwwwwwwwwwwwwwwww");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);

    var urd_am=str_array[1];
 var urd_amt = parseInt(urd_am)
    console.log(urd_amt);

    var book_am=str_array[2];
    var book_amt = parseInt(book_am)
    console.log(book_amt);

    var sch_am=str_array[3];
    var sch_amt = parseInt(sch_am)
    console.log(sch_amt);

     var rd=str_array[4];
    var rdamt = parseInt(rd)
    console.log(rdamt );
    // var rate=str_array[4];
    // var tot=str_array[5];
    //db.useradj.insert({"partyname":partyname,"urd_amt":urd_amt," book_amt": book_amt,"sch_amt":sch_amt,"rd_amt":rdamt},function(err,doc){ 
    db.useradj.insert({"partyname":partyname,"urd_amt":urd_amt," book_amt": book_amt,"sch_amt":sch_amt,"rd_amt":rdamt},function(err,doc){ 
    
    // db.transaction.find({partyname:username},function(err,doc){
      if(err)
        {
            console.log(err)
        }

        console.log(" in new useradj")
        res.json(doc);

        console.log(doc);
    });
});
// db.batch.update({"barcode":barcode},{"$set":{"stats":status}},function(err,doc){
app.put('/useradjup/:update',function(req,res)
{ //this is for update
    console.log("entered into new tablwwuuuuuuuuuuuuuuuuuuuu");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);

    var urd_am=str_array[1];
 var urd_amt = parseInt(urd_am)
    console.log(urd_amt);

    var book_am=str_array[2];
    var book_amt = parseInt(book_am)
    console.log(book_amt);

    var sch_am=str_array[3];
    var sch_amt = parseInt(sch_am)
    console.log(sch_amt);

     var rd=str_array[4];
    var rdamt = parseInt(rd)
    console.log(rdamt );
    // var rate=str_array[4];
    // var tot=str_array[5];
    //db.useradj.insert({"partyname":partyname,"urd_amt":urd_amt," book_amt": book_amt,"sch_amt":sch_amt,"rd_amt":rdamt},function(err,doc){ 
    db.useradj.update({"partyname":partyname},{"$set":{"urd_amt":urd_amt," book_amt": book_amt,"sch_amt":sch_amt,"rd_amt":rdamt}},function(err,doc){ 
    // db.batch.update({"barcode":barcode},{"$set":{"stats":status}},function(err,doc){

    // db.transaction.find({partyname:username},function(err,doc){
      if(err)
        {
            console.log(err)
        }

        console.log(" in new useradj")
        res.json(doc);

        console.log(doc);
    });
});
 app.get('/transdetails/:update',function(req,res)
{       
    console.log("entered into new  trans data");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);
    
    var trans=str_array[1];
    console.log(trans);

   // var orderstatus = "Inprogress"
   //22/5 db.useritem.find({"partyname":partyname,"Transaction":trans},function(err,doc){ 
    // db.transaction.find({partyname:username},function(err,doc){
     db.transactiondetail.find({"partyname":partyname,"Transaction":trans,orderStatus:"Inprogress"},function(err,doc){ 
            
        res.json(doc);
    });
});
// for regular sale saved data
 app.get('/regularsaledetails/:update',function(req,res)
{       
    console.log("entered into new  trans data");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);

    var trans=str_array[1];
    console.log(trans);

    db.batch.find({"partyname":partyname,"Transaction":trans},function(err,doc){ 
    // db.transaction.find({partyname:username},function(err,doc){
      
        console.log(" in new trans")
        res.json(doc);

        console.log(doc);
    });
});

 //for historyfetching
app.get('/historyfetch/:update',function(req,res)
{       
    console.log("entered into new  trans data");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);

    // db.history.find({partyname:partyname},function(err,doc){ 
     db.transactiondetail.find({partyname:partyname,orderStatus:"completed"},function(err,doc){ 
    
        res.json(doc);

        console.log(doc);
    });
});

// data history fetch in list
app.get('/historyfet/:update',function(req,res)
{       
    //console.log("entered into new  trans data");
    var str=req.params.update;
   // console.log(str);
    var str_array=str.split(",");
    var trans=str_array[0];
    //console.log(trans);
   // var order = "completed"
    //db.history.find({"TransactionType":"URD PURCHASE"}
    // db.history.find({"TransactionType":trans},function(err,doc){ 
    // db.transactiondetail.find({"TransactionType":trans,"orderstatus":"completed"},function(err,doc){ 
    // db.transactiondetail.find({"Transaction":trans,"orderStatus":"completed"},function(err,doc){ 
     if(trans == "Regular Sale"){
          db.saleinvoice.find({"Transaction":trans,"status":"completed"},function(err,doc){ 
         
             res.json(doc);
         });
        }else{
           // db.saleinvoice.find({ $and:[ {"voucherNo" : {  $ne: null } }, {  "Transaction" : "Urd Purchase"}]}
           db.saleinvoice.find({ $and:[ {"voucherNo" : {  $ne: null } }, {  "Transaction" :trans}]},function(err,doc){ 
         
         // db.saleinvoice.find({"Transaction":trans},function(err,doc){ 
         
             res.json(doc);
         });
        }
});
// list data update
app.put('/historyup/:update',function(req,res)
{
    console.log("entered into put request $scope.userit[i]._id!=null");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var id=str_array[0];
    console.log(id);
    var partyname=str_array[1];
    console.log(partyname);
    var vouc=str_array[2];
    console.log(vouc);
    var val=str_array[3];
    
    db.history.update({_id:mongojs.ObjectId(id)},{$set:{"partyname":partyname,"VoucherNo":vouc,"Value":val}},function(err,doc){
     // db.useritem.update({"barcode":barcode},{$set:{"partyname":partyname,"name":name,"gwt":gwt,"rate":rate,"total":tot}},function(err,doc){
    
     if(err)
        {
            console.log(err)
        }
        res.json(doc);
        console.log(doc);
      })
});
// history delete
app.delete('/historydelete/:udelete',function(req,res)
{
   // console.log("i got the delete request");
    var id=req.params.udelete;
    //console.log(id);
    db.history.remove({_id: mongojs.ObjectId(id)}, function(err, docs) {
})
})
// delete of barcodesummarydelete
app.delete('/barcodesummarydelete/:udelete',function(req,res)
{
   //console.log("i got the delete request");
    var id=req.params.udelete;
    //console.log(id);
    db.barcodesumm.remove({_id: mongojs.ObjectId(id)}, function(err, docs) {
})
})
// for barcode delete
app.delete('/deletebarcode/:udelete',function(req,res)
{
   console.log("i got the delete request");
    var barcode=req.params.udelete;
    //console.log(id);
    barcode = parseInt(barcode)
    db.batch.remove({ barcode:barcode}, function(err, docs) {
})
})
// edit in barcode generation update
app.put('/editupdate',function(req,res){
  console.log("entered into put request $scope.userit[i]._id!=null");
       
       var id = req.body._id
       console.log(req.body)
       console.log(req.body.barcode)
     // db.batch.update({_id:mongojs.ObjectId(id)},{$set:{"name":req.body.name,"desc":req.body.desc ,"hsc":req.body.hsc ,"invGroupName":req.body.invGroupName,
     //     "outofstate":req.body.outofstate ,"withinstate":req.body.withinstate,"salesTax":req.body.salesTax,"comboItem":req.body.comboItem,"marginReport":req.body.marginReport,"itemType":req.body.itemType}},function(err,doc)
      db.batch.update({_id:mongojs.ObjectId(id)},{$set:{"barcode":req.body.barcode,"chgunt":req.body.chgunt,"date":req.body.date,"desc":req.body.desc,
         "gpcs":req.body.gpcs,"gwt":req.body.gwt,"name":req.body.iname,"ntwt":req.body.ntwt,"rate":req.body.rate,"size":req.body.size,"taxval":req.body.taxval,"stwt":req.body.stwt,
        "wastage":req.body.wastage,"stval":req.body.stval,"mrp":req.body.mrp,"labval":req.body.labval}},function(err,doc)
      
        {
            res.json(doc);
        
        });  
})

// app.put('/editupdate/:update',function(req,res)
// {
//     //console.log("entered into put request $scope.userit[i]._id!=null");
//       var str=req.params.update;
//    // console.log(str);
//     var str_array=str.split(",");
//     var id=str_array[0];
//     //console.log("id the id is "+id);
//     var code1=str_array[1]
//     var bar =parseInt(code1);
//   //  console.log("code1"+code1)
//     var chgunt=str_array[2]
//     var date=str_array[3]
//     var desc=str_array[4]
//     var final=str_array[5]
//     var gpcs=str_array[6]
//     var gwt=str_array[7]
//     var iname=str_array[8]
//     var ntwt=str_array[9]
//    // var partyname=str_array[10]
//     var size=str_array[11]
//     var taxval1=str_array[12]
//     var taxamt1=str_array[13]
//    var wt=str_array[14]

//     var wastage=str_array[15]
//     var stval=str_array[16]
//     var labval=str_array[17]
//     var rate=str_array[18]
//     //  var stockin=str_array[19];

//        var stockout=str_array[20];
//    // var order = "available"
//     // db.transactiondetail.insert({barcode:barcode,},function(err,doc){
//      db.batch.update({_id:mongojs.ObjectId(id)},{$set:{"barcode":bar,"chgunt":chgunt,"date":date,"desc":desc,
//         "final":final,"gpcs":gpcs,"gwt":gwt,"name":iname,"ntwt":ntwt,"rate":rate,"size":size,"taxval":taxval1,"taxamt":taxamt1,"stwt":wt,
//         "wastage":wastage,"stval":stval,"labval":labval}},function(err,doc){
     
//     //var document={name:name,city:city,no:no,email:email,street:street};
//    // db.useritem.insert(req.body,function(err,doc){
//         res.json(doc);
//        // console.log(doc);
    
// })
// });
// history delete
app.delete('/historydelete/:udelete',function(req,res)
{
  //  console.log("i got the delete request");
    var id=req.params.udelete;
   // console.log(id);
    db.history.remove({_id: mongojs.ObjectId(id)}, function(err, docs) {
})
})

app.delete('/userit/:udelete',function(req,res)
{
   // console.log("i got the delete request");
   // var id=req.params.udelete;
    var str=req.params.udelete;
    console.log(str);
    var str_array=str.split(",");
    var id=str_array[0];
    // console.log("id the id is "+id);
    //  console.log(id);
   // var code1=str_array[1]
   // var bar =parseInt(code1);
  //   if(code1 == "undefined"){
  // //  console.log("undefined loop")
  //   db.transactiondetail.remove({_id: mongojs.ObjectId(id)}, function(err, docs) {
  //   })
  //   }else{
     db.transactiondetail.remove({_id:mongojs.ObjectId(id)}, function(err, docs) {
    })
   // }
})
app.delete('/saleinv/:partyname',function(req,res)
{
   var name=req.params.partyname;
   console.log("i got the saleinvoice delete request "+name);
    
    //console.log(name);
    db.saleinvoice.remove({partyname: name}, function(err, docs) {
})
})



// app.put('/tagdeleted1/:update',function(req,res)
// {
//    console.log("i got the tagdeleted1 tagdeleted1 tagdeleted1 tagdeleted1");
//    // var tag5=req.query.itemno
//    // console.log(tag5)
//    // var count4=req.query.count
//    //  console.log(count4)
//    // var a
//    var id=req.params.update;
//     console.log(id);
//    db.tags.update({_id: mongojs.ObjectId(id)},{"$set":{"status":"completed"}},function(err, docs) {
//      // console.log(" tag delete exicuted successfully "+count);
//      // count++
//   })
//      //console.log(" tag delete after remove function");
// })
app.delete('/tagdeleted12/:update',function(req,res)
{
   console.log("i got the tagdeleted1 tagdeleted1 tagdeleted1 tagdeleted1");
   
   var id=req.params.update;
    console.log(id);
      db.tags.remove({_id: mongojs.ObjectId(id)})
     //console.log(" tag delete after remove function");
})
//delete and create a new one
app.delete('/tagdelete/:update',function(req,res)
{
    //console.log("i got the tag delete request");
   var count=req.params.update;
   // console.log(str);
    // var str_array=str.split(",");
    
    
    // var tagno=parseInt(str_array[0]);
     count = parseInt(count);
   
   // console.log(tagno);({barcode:b},{"$set":{"color":color}},
    db.tags.remove({ count:count}, function(err, docs) {
})
})
//delete from barcodesumm a new one
// app.put('/barcodedelete/:update',function(req,res)
// {
//     console.log("i got the tag update  request call call call");
//    var str=req.params.update;
//    // console.log(str);
//     var str_array=str.split(",");
    
    
//     var count = parseInt(str_array[0]);
//     console.log(count)
//     db.barcodesumm.update({"count":count},{"$set":{"status":"completed"}},function(err, docs) {
// })
// })
//delete the barsumm record
app.delete('/barcodedelete/:update',function(req,res)
{
    console.log("i got the tag update  request call call call");
   var str=req.params.update;
   // console.log(str);
    var str_array=str.split(",");
    
    
    var count = parseInt(str_array[0]);
    console.log(count)
    db.barcodesumm.remove({"count":count})
})
//summary count
app.get('/summarycount/:update',function(req,res)
{
   // console.log("i got the tag delete request");
   var str=req.params.update;
    //console.log(str);
    var str_array=str.split(",");
    
    
    var tagno=parseInt(str_array[0]);
    var count = parseInt(str_array[1]);
   
    //console.log(tagno);
    db.tags.find({"count":count,status:"Inprogress"},function(err,doc){
      //  console.log(doc);
        res.json(doc);
})
})


// getinovice transaction type
app.get('/getinvoice:trans',function(req,res)
{
    //console.log("i received a get request from count");
    var tax = req.params.trans;
  // var tax1=parseInt(tax);
   // console.log("here the replay is "+tax1);

    //26/4db.batch.find({"barcode": tax1},function(err,doc){
        db.transactionSeriesInvoice.find({"TransactionType":tax},function(err,doc){
        console.log(doc);
        res.json(doc);
})
})
// for insert invoice
// app.post('/postinvoice/:update',function(req,res)
// {   //'/listtran/:update'
//     console.log("i receivecooooooooooooooooooooooooooooooooooooooooooooooooooo");
//    var str=req.params.update;
//     console.log(str);
//     var str_array=str.split(",");
    
//     var prefix=str_array[0];
//     console.log(prefix);
//      var typeno=str_array[1];
//     console.log(typeno);
   
//      db.transactionInvoice.insert({"prefix":prefix,"typeno":typeno},function(err,doc){
//         console.log(doc);
//         res.json(doc);
// })
// })
//
// app.post('/userit1/:update',function(req,res){
//   console.log("I received a new username request for login and document from pdf");
//   // var typeno=req.params.partyname;
//   // var prefix=req.params.Transaction;
//   // var typeno= "100";
//   // var prefix="200";
//   var str=req.params.update;
//     console.log(str);
//     var str_array=str.split(",");
    
//     var prefix=str_array[0];
//     console.log(prefix);
//      var typeno=str_array[1];
//     console.log(typeno);
//    console.log(prefix);
//   db.transactionInvoice.insert({"prefix":prefix,"typeno":typeno},function(err,doc){
//         console.log(doc);
//         res.json(doc);
// })
// });
// for pras
 app.post('/saleinv1',function(req,res){
  console.log("I received a new username request for login and document saleinv lok here eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  var username=req.query.name;
  var trans=req.query.Transaction;
   console.log(trans);
  db.transactionInvoice.insert({partyname:username,Transaction:trans},function(err,doc){
    // db.transactionInvoice.insert({"prefix":prefix,"typeno":typeno},function(err,doc){
//    
        res.json(doc);
        console.log(doc);
    });
});

app.get('/listtran/:update',function(req,res)
{       
    console.log("entered into new  trans data");
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    
    var trans=str_array[0];
    console.log(trans);

    db.useritem.find({"Transaction":trans},function(err,doc){ 
    // db.transaction.find({partyname:username},function(err,doc){
      
        console.log(" in new trans")
        res.json(doc);

        console.log(doc);
    });
});

// delete from database saleinvoice
app.delete('/saleinvoiced/:update',function(req,res)
{
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);
    var trans=str_array[1];
    console.log(trans);
    
    db.saleinvoice.remove({"partyname":partyname,"Transaction":trans}, function(err, docs) {
})
})
//for delete latest record
app.delete('/updatelistdelete',function(req,res)
{
    //  console.log("req.query.barcode req.query.barcode req.query.barcode req.query.barcode")
   
    //  var count =req.params.udelete;
    // //console.log(id);
    // count = parseInt(count)
     db.updatelist.findAndModify({query :{}, sort: {"_id" : -1}, remove:true}, function(err, docs) {
   // db.updatelist.remove({"count":count}
})
})
// delete in bar generation
app.get('/deletequery',function(req,res)
{
    
db.updatelist.find({}).sort({_id:-1}).limit(1,function(err,doc)
    {
        res.json(doc);
        //console.log(doc);
    })
})
// for post in db.updatelist
app.post('/updatelistinsert/:udelete',function(req,res)
{
    var count =req.params.udelete;
    //console.log(id);
    count = parseInt(count)
    db.updatelist.insert({"count":count},function(err,doc)
    {
   res.json(doc);
    })

})
// delete from database transaction
app.delete('/transactiond/:update',function(req,res)
{
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);
    var trans=str_array[1];
    console.log(trans);
    
    db.transaction.remove({"partyname":partyname,"Transaction":trans}, function(err, docs) {
})
})
// delete from database  useritem
app.delete('/useritemd/:update',function(req,res)
{
    var str=req.params.update;
    console.log(str);
    var str_array=str.split(",");
    var partyname=str_array[0];
    console.log(partyname);
    var trans=str_array[1];
    console.log(trans);
    
    db. useritem.remove({"partyname":partyname,"Transaction":trans}, function(err, docs) {
})
})
// delete from database barcodetransactiondetailed
app.delete('/transactiondetaild',function(req,res)
{
    console.log("transactiondetaild req.query.barcode req.query.barcode req.query.barcode")
    var bar=req.query.barcode;
    var barcode = parseInt(bar)
    console.log(barcode)
    //  barcode=parseInt(barcode);

    db.transactiondetail.remove({"barcode":barcode}, function(err, docs) {

})
})
// delete from database transactiondetaile
app.delete('/transactiondetaile',function(req,res)
{
     console.log("req.query.barcode req.query.barcode req.query.barcode req.query.barcode")
   
     var barcode=req.query.barcode;
    console.log(barcode)
    db.transactiondetail.remove({"refid":barcode}, function(err, docs) {
})
})

//for item html get details
app.get('/getinventorygroupmaster',function(req,res)
{
    db.inventorygroupmaster.find(function(err,doc){
        res.json(doc);
})
})
//for item html get details
app.get('/getitemtype',function(req,res)
{
    db.itemtype.find(function(err,doc){
        res.json(doc);
})
})
//for item html get details
app.get('/getsalescategorymaster',function(req,res)
{
    db.salescategorymaster.find(function(err,doc){
        res.json(doc);
})
})
//for item html get details
app.get('/gettaxrate',function(req,res)
{
    db.taxrate.find(function(err,doc){
        res.json(doc);
})
})
// for save item 
app.post('/saveitempost',function(req,res){
     db.items.insert(req.body,function(err,doc){
        res.json(doc);
      })
})
//for get details of saved items
app.get('/getitemdata',function(req,res)
{
    db.items.find(function(err,doc){
        res.json(doc);
})
})
// for filter in item page
app.get('/getfilter/:update',function(req,res)
{
  var sale1 = req.params.update;
      console.log(sale1)
      if(sale1 == " All" ){
        //console.log("entered into if loop loop")
         db.items.find(function(err,doc){
        res.json(doc);
})

      }else{
     db.items.find({saleCategory:sale1},function(err,doc)
    {
        res.json(doc);
    })
   }
})
// for delete in item page
app.delete('/itemdelete/:udelete',function(req,res)
{
   // console.log("i got the delete request");
    var id=req.params.udelete;
   
    db.items.remove({_id: mongojs.ObjectId(id)}, function(err, docs) {
})
})
// for edit item 
app.put('/editeditem',function(req,res){
       var id = req.body._id
     db.items.update({_id:mongojs.ObjectId(id)},{$set:{"name":req.body.name,"desc":req.body.desc ,"hsc":req.body.hsc ,"invGroupName":req.body.invGroupName,
         "outofstate":req.body.outofstate ,"withinstate":req.body.withinstate,"salesTax":req.body.salesTax,"comboItem":req.body.comboItem,"marginReport":req.body.marginReport,"itemType":req.body.itemType}},function(err,doc)
        {
            res.json(doc);
        
        });
})
// in item page with in state


app.get('/gettaxwithinstate', function(req, res){
 console.log("i received a get request");
 db.tax.find({"withinstate":"yes"},function (err, docs) {
 //console.log(docs);db.tax.find({"withinstate":"yes"}).pretty()
 res.json(docs);
});
});

// in item page out of state
app.get('/gettaxoutofstate', function(req, res){
 console.log("i received a get request");
 db.tax.find({"outofstate":"yes"},function (err, docs) {
 //console.log(docs);db.tax.find({"withinstate":"yes"}).pretty()
 res.json(docs);
});
});

// labourtax
app.get('/getLabourTax', function(req, res){
 //console.log("i received a get request");
 db.tax.find({ "taxname" : "LabourTax"},function (err, docs) {
 //console.log(docs);db.tax.find({"withinstate":"yes"}).pretty()

 res.json(docs);
});
});
// for combo
app.get('/checkofcomboitem/:combo',  function (req, res) {
 // console.log("this is a put request");
var name = req.params.combo;
//console.log(id);
db.items.find({Name:name}, function (err, doc) {
  res.json(doc);
  //console.log("the edit details r" +doc)
});
});
// frist page taxation

// taxation project starts here

app.get('/getitemtaxation', function(req, res){
   db.taxation.find(function (err, docs) {
    res.json(docs);
  });
});

app.post('/opalpost', function (req, res) {
  
  db.taxation.insert(req.body,function(err, doc) {
     res.json(doc);

  });
});



app.delete('/opal/:id', function (req, res) {
  var id = req.params.id;
  console.log("this is delete"+id);
  db.taxation.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
    console.log(doc);
  });
});

app.get('/item1/:id',  function (req, res) {
  console.log("this is a put request");
var id = req.params.id;
console.log(id);
db.taxation.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
  res.json(doc);
  console.log("the edit details r" +doc)
});
});


app.put('/opal/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.taxation.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, aliasname: req.body.aliasname, taxlevel: req.body.taxlevel}},
    new: true}, function (err, doc) {

      res.json(doc);
    });
});

// frist page taxation

app.get('/gettax', function(req, res){
 console.log("i received a get request");
 db.tax.find(function (err, docs) {
 //console.log(docs);
 res.json(docs);
});
});

app.post('/opal1', function (req, res) {
   console.log("i got post opal1 opal1opal1 opal1 opal1 request");
   console.log(req.body)
   console.log(req.body.taxname);
  
  db.tax.insert(req.body,function(err, doc) {
    res.json(doc);

  });

});

app.delete('/opal1/:id', function (req, res) {
  var id = req.params.id;
  console.log("this is delete"+id);
  db.tax.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
    console.log(doc);
  });
});

app.get('/editititem2',function (req, res) {
  console.log("this is  editititem2 editititem2 editititem2a put request");
var aliasname=req.query.aliasname;
var taxname=req.query.taxname;
console.log(taxname)
console.log(aliasname)
// var id = req.body.aliasname;
// var id = req.body.taxname;
// console.log(req.params.tax)
// var taxarr = req.params.tax
// console.log(taxarr)
// console.log(taxarr.taxname);
// console.log(taxarr.aliasname);
//db.tax.find({aliasname:"gst",taxname:"GST"})
db.tax.find({aliasname:aliasname,taxname:taxname}, function (err, doc) {
  res.json(doc);
  console.log("the edit details r" +doc)
});
});


//app.put('/updateedit/:id', function (req, res) {
app.put('/updateedit', function (req, res) {
  console.log("update  updateedit function updateedit updateedit update function")
  var id = req.body._id;
  console.log(id);
  db.tax.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {taxname: req.body.taxname, aliasname: req.body.aliasname, displaydate: req.body.displaydate,Rate:req.body.Rate,
      name:req.body.name,outofstate: req.body.outofstate,withinstate: req.body.withinstate}},
    new: true}, function (err, doc) {

      res.json(doc);
    });
  });
  // 22/3 fetching data
  app.get('/purchase',  function (req, res) {
    
  db.taxerate.find(function (err, docs) {
 //console.log(docs);

 res.json(docs);
});

  });
//});

// posting data

app.post('/opaltx', function (req, res) {
  // console.log("i got post request");
  console.log("iam done here")
  var tax = req.body.name;
  var tax1 = req.body.PurchaseAc;
  var tax2 = req.body.SaleAc; 
  var tax3 = req.body.Rate; 
  var tax4 = req.body.CessOn; 
   var tax5 = req.body.From; 
  var tax6= req.body.To; 
  var tax7 = req.body.Rate1; 
 console.log("name value " + tax);
 console.log("pur value  " + tax1);
  console.log("sale value  " + tax2);
   console.log("rate value  " + tax3);
  console.log("CessOn value  " + tax4);
  console.log("from value  " + tax5);
   console.log("to value  " + tax6);
    console.log("rate1 value  12 " + tax7);

 var document = {name: tax,PurchaseAc: tax1, SaleAc: tax2,Rate: tax3, CessOn: tax4,From: tax5,To: tax6, Rate1: tax7};
  db.taxtable2.insert(req.body,function(err, doc) {
   res.json(doc);
   });
  
});

// report controller
//'/getbar:barcodenum',
// app.get('/reportonedate/:reportdate',  function (req, res) {
//    // console.log("reportonedate reportonedate reportonedate reportonedate")
//     var reportdate = req.params.reportdate;
//     console.log(reportdate);
//     //from date
//     //1-apr 31st march
//     var fromdate = null
//     var date = new Date()
     
//     var year = date.getFullYear();
//     var month = date.getMonth()+1;
//     var april = 04
//     //month =3
//     if( 3 < month){
//           //console.log("greater "+year)
//           // fromdate = new Date(year+"-"+march);
//           // fromdate = new Date(((new Date(new Date(year+"-"+march)).toISOString().slice(0, 23))+"-05:30")).toISOString();
//          fromdate = new Date(((new Date(new Date(year+"-"+april)).toISOString().slice(0, 23))+"-05:30")).toISOString();
//          // console.log(fromdate)
//       }else{
//            year = date.getFullYear()-1;
//           // console.log("lesser "+year)
//            // fromdate = new Date(year+"-"+march);
//           fromdate = new Date(((new Date(new Date(year+"-"+april)).toISOString().slice(0, 23))+"-05:30")).toISOString();
  
//           // console.log(fromdate)
//        }

//   db.transactiondetail.find({ date: {$gte:(fromdate), $lt: (reportdate)}},function (err, docs) {
//           //console.log(docs);
//           res.json(docs);
//     });

// });
//current finacial year
var fromdate = null
var currentyear = function(){
  //1-apr 31st march
    
    var date = new Date()
     
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var april = 04
    //month =3
    if( 3 < month){
          //console.log("greater "+year)
          // fromdate = new Date(year+"-"+march);
          // fromdate = new Date(((new Date(new Date(year+"-"+march)).toISOString().slice(0, 23))+"-05:30")).toISOString();
         fromdate = new Date(((new Date(new Date(year+"-"+april)).toISOString().slice(0, 23))+"-05:30")).toISOString();
         // console.log(fromdate)
      }else{
           year = date.getFullYear()-1;
          // console.log("lesser "+year)
           // fromdate = new Date(year+"-"+march);
          fromdate = new Date(((new Date(new Date(year+"-"+april)).toISOString().slice(0, 23))+"-05:30")).toISOString();
  
           
       }
       console.log(fromdate)
       console.log("current year date")

}
currentyear();
//app.get('/countdata',
app.get('/issueonedate/:data',function (req, res) {
    console.log("preiwiwitonedate reportonedate reportonedate reportonedate")
    // var username=req.query.name;
    // var reportdate = req.params.reportdate;
    // console.log(reportdate);

   console.log(req.params.data)
   var str=req.params.data;
    // console.log(str);
    var reportdata = str.split(",");
    var transaction =reportdata[0];
    var barcode =reportdata[1];
    var  weight =reportdata[2];
    var report =reportdata[3];
    var reportdate =reportdata[4];
    console.log(" transaction "+transaction+" barcode" +
     barcode+" weight "+weight+" report "+report+" reportdate "+reportdate )
     
    var report = '$'+report;
    //var weight = weight;
    var inputweight = '$'+weight;
    console.log(report)
    console.log("fromdate "+fromdate)
    //from date  weight inputweight
    

  // db.transactiondetail.find({ date: {$gte:(fromdate), $lt: (reportdate)}},function (err, docs) {
  //         //console.log(docs);
  //         res.json(docs);
  //   });
  if(barcode == "yes"){
        console.log("if yes");
        db.transactiondetail.aggregate([
                 {$match:{"Transaction": { $ne: NaN }, "barcodeNumber": { $ne: NaN }, "orderStatus":"completed" , date: { $gt:(fromdate), $lt: (reportdate) }}},
                 {$group:{_id:report ,weight:{$sum:inputweight},gpcs:{$sum:"$gpcs"}}},{ $sort : { _id: 1 } }
                 ],function (err, docs) {
                  //console.log(docs);
              res.json(docs);
          });

  }else{
          console.log("else no");
          db.transactiondetail.aggregate([
                 {$match:{"Transaction": { $ne: NaN },"barcodeNumber": NaN, "orderStatus":"completed" , date: { $gt:(fromdate), $lt: (reportdate) }}},
                 {$group:{_id:report ,weight:{$sum:inputweight},gpcs:{$sum:"$gpcs"}}},{ $sort : { _id: 1 } }
                 ],function (err, docs) {
                  console.log(docs);
               res.json(docs);
          });


       }


});
app.get('/receiveonedate/:data',  function (req, res) {
    console.log("receiveonedate receiveonedate receiveonedatereportonedate")
    

     console.log(req.params.data)
      var str=req.params.data;
   // console.log(str);
    var reportdata = str.split(",");
    var transaction =reportdata[0];
    var barcode =reportdata[1];
    var  weight =reportdata[2];
    var report =reportdata[3];
    var report1 =reportdata[3];
    var reportdate =reportdata[4];
    console.log(" transaction "+transaction+" barcode" +
     barcode+" weight "+weight+" report "+report+" reportdate "+reportdate )
     
    var report = '$'+report;
    //var weight = weight;
    var inputweight = '$'+weight;
    console.log(report1)
    console.log("fromdate "+fromdate)
    //from date  weight inputweight
    if("purity" == report1){
      db.transactiondetail.aggregate([
                 {$match:{'refid': {$exists: true, $ne: null }, date: { $gt:(fromdate), $lt: (reportdate) }}},
                 {$group:{_id :{purity:"$purity",itemName:"$itemName"} ,weight:{$sum:inputweight},gpcs:{$sum:"$gpcs"}}},{ $sort : { _id: 1 } }
                 ],function (err, docs) {
                  //console.log(docs);
               res.json(docs);
        });
      
    }else{

      db.transactiondetail.aggregate([
                 {$match:{'refid': {$exists: true, $ne: null }, date: { $gt:(fromdate), $lt: (reportdate) }}},
                 {$group:{_id:report ,weight:{$sum:inputweight},gpcs:{$sum:"$gpcs"}}},{ $sort : { _id: 1 } }
                 ],function (err, docs) {
                  //console.log(docs);
               res.json(docs);
        });
      
    }
        
});
//purity in report
app.get('/inventorygroupmasterdetails',function(req,res)
{
   // console.log("inventorygroupmasterdetails request from index");

    db.inventorygroupmaster.find({},function(err,doc){
     //   console.log(doc);
        res.json(doc);
})
})
//purity

app.get('/itemreport2',function(req,res)
{
   // console.log("i received a get request from index");
    var itemgroupid=req.params.inGrpId;

    console.log("Item purity details function called-----"+itemgroupid)
  db.transactiondetail.aggregate([
    { "$lookup": { 
        "from": "inventorygroupvaluenotation", 
        "localField": "purity", 
        "foreignField": "ValueNotation", 
        "as": "collection2_doc"
    }}, 
   { "$unwind": "$collection2_doc" },
    { "$redact": { 
        "$cond": [
            { "$eq": [ "$purity", "$collection2_doc.ValueNotation" ] }, 
            "$$KEEP", 
            "$$PRUNE"
        ]
    }},{$match:{"barcodeNumber": { $ne: NaN }, "orderStatus":"completed" , date: { $gt:("2016-07-10T10:50:42.389Z"), $lt: ("2018-02-10T10:50:42.389Z") }}},
    {$group:{_id :{purity:"$purity",itemName:"$itemName"}, gwt:{$sum:"$gwt"},gpcs:{$sum:"$gpcs"},ntwt:{$sum:"$ntwt"}}}
   
],function(err,doc){
   // db.inventorygroupvaluenotation.find({InvGroupID:itemgroupid},function(err,doc){
     //   console.log(doc);
        res.json(doc);
})
})
//pdf party pan details
app.get('/getpartydetails:name',function(req,res)
{
    console.log("i list is exicuted list1 list1");
   //  var  = req.params.name;
   // var tax1=parseInt(tax);
    //console.log("here the replay is "+tax);

   // db.tags.find({"count": tax1},function(err,doc){
      //  console.log(doc);
        db.user.find({"name": req.params.name},function(err,doc){
   
        res.json(doc);
})
})
// in mainpgae getinventorygroupvaluenotation
app.get('/getinventorygroupvaluenotation/:data',function(req,res)
{
  
//    var date = new Date();
//   date.setDate(date.getDate() - 1)
//   date.toISOString()
// console.log("date is here "+date.toISOString())
   // var currentdate   = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
   // currentdate.setDate(currentdate .getDate() - 1);
   //{count:b},
   var str=req.params.data;
   
    var str_array=str.split(",");
     var currentdate=str_array[0];

    db.inventorygroupvaluenotationdaily.find({date:currentdate},function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
//last date
app.get('/getinventorygroupvaluenotationlast',function(req,res)
{

    db.inventorygroupvaluenotationdaily.find({}).sort({_id:-1}).limit(1,function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
 
  app.get('/todayinventorygroupvaluenotation/:data',function(req,res)
{
     var str=req.params.data;
   
    var str_array=str.split(",");
     var currentdate=str_array[0];
//    var date = new Date();
//   date.setDate(date.getDate() - 1)
//   date.toISOString()
// console.log("date is here "+date.toISOString())
   // var currentdate   = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
   // currentdate.setDate(currentdate .getDate() - 1);
   //{count:b},
   //var currentdate = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
     currentdate =currentdate.slice(0, 10);
    db.inventorygroupvaluenotationdaily.find({date: { $gt:(currentdate)}},function(err,doc){
        //console.log(doc);
        res.json(doc);
})
})
app.post('/postinventorygroupvaluenotation/:data',function(req,res)
{
    var str=req.params.data;
   
    var str_array=str.split(",");
     var NotationID=str_array[0];

     var InvGroupID=str_array[1];

     var ValueNotation=str_array[2];

     var ConversionPercentage=str_array[3];
     var Rate=str_array[4];
     var InvGroupName=str_array[5];
     var date=str_array[6];
     var update=str_array[7];
     console.log(update)
     console.log(str)

    // req.body.date = new Date(((new Date(new Date()).toISOString().slice(0, 23))+"-05:30")).toISOString();
    // console.log(req.body[0].date4)
    // console.log(req.body[0].InvGroupID)
    //  console.log("date displayed uplokk")
   //  db.inventorygroupvaluenotationdaily.insert(req.body,function(err,doc)
   //  {
   //     console.log(doc)
   // res.json(doc);
   //  })
   if(update == "equal" ){
    console.log("update");
   db.inventorygroupvaluenotationdaily.update({"NotationID":NotationID ,"InvGroupID" :InvGroupID,"ValueNotation":ValueNotation,"ConversionPercentage":ConversionPercentage,
      "InvGroupName":InvGroupName,date:date},{$set:{"Rate":Rate}},function(err,doc)
        {
            console.log(doc)
            res.json(doc);
        })
  }else{
      console.log("insert");
    db.inventorygroupvaluenotationdaily.insert({"NotationID":NotationID ,"InvGroupID" :InvGroupID,"ValueNotation":ValueNotation,"ConversionPercentage":ConversionPercentage,
      "Rate":Rate,"InvGroupName":InvGroupName,date:date},function(err,doc)
        {
            console.log(doc)
            res.json(doc);
        })
  }


})
//merchant details
app.get('/getmerchantdetails',function(req,res)
{
   // console.log("i received a get request from index");
    db.merchantDetails.find(function(err,doc){
     //   console.log(doc);
        res.json(doc);
})
})
// app.post('/user12/:user1').success(function(response){

//     })
app.post('/user12/:data',function(req,res)
{ 
  var str=req.params.data;
    console.log(str);
     var str_array=str.split(",");
    //console.log( str_array.length);
    var length = str_array.length;
    console.log(length);
    var voucher = str_array[length - 1];
    for(let i =0;i<length - 1;i++){
      console.log("here is the length "+str_array[i]);
      db.transactiondetail.update({_id:mongojs.ObjectId(str_array[i])},{$set:{"voucherNo":voucher }},function(err,doc)
        {
        //res.json(doc);
        console.log(doc)
       });
    }
    
    console.log("voucher length "+voucher)
    console.log('look up things syuasasdyusadsdhyasdbdfhudbasjdbashudbhdhy');
 })

app.post('/saleInvoiceInvoice/:data',function(req,res)
{ 
  var str=req.params.data;
    console.log(str);
     var str_array=str.split(",");
    //console.log( str_array.length);
    var id = str_array[0];
   // console.log(length);
    var voucher = str_array[1];
    
     db.saleinvoice.update({_id:mongojs.ObjectId(id)},{$set:{"voucherNo":voucher }},function(err,doc)
        {
        //res.json(doc);
        console.log(doc)
       });
   
    
     })
app.get('/getLoginDetails',function(req,res)
{       
   // console.log("entered into new  trans data");
    var username=req.query.username;
    var password=req.query.password;
    db.loginDetails.find({name:username,password:password},function(err,doc){ 
     
        res.json(doc);
       
    });
});
app.listen(9000);
console.log("server running on port 9000");