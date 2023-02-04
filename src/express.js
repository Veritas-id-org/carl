mysql = require('mysql');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
const { constants } = require('zlib');
const { unescape } = require('querystring');
const { Console } = require('console');
var app = module.exports = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('images'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var owner
var address
var website
var ops;
var opsColor;
var brandName;
var category;
var brandOps;

var connection = mysql.createConnection({
   host: 'db',
   user: 'user',
   password: 'letmein',
   database: 'varitas'
});

function rendhome(res){
   const queryHomeq = "select * from varitas.owners where name='"+ owner + "'";
   const queryBrandq = "select * from varitas.brands where owner='"+ owner + "'";
   
   connection.query(queryHomeq, (err,result) => {
      if (err) throw err;
      console.log(result);
      if (result[0]){
         owner = result[0]['name']
         address = result[0]['addr']
         website = result[0]['website']
      }  
     }); 
     
     connection.query(queryBrandq, (err1,result1) => {
        if (err1) throw err1;
        console.log(result1);
        var brandandCate;
        result1.forEach(element => {
           brandandCate = brandandCate + '\<option value=\"' + element['name'] + ":" + element['category'] + '\"\>' + element['name'] + ":::" + element['category'] + '\<\/option\>'
           brandName = element['name']
           category = element['category']
           console.log(category);
           
        }); 
          
     
        res.render('ownerhome',{
           owner,
           ops,
           address,
           website,
           opsColor,
           brandandCate 
        })    
     }); 

}

app.post('/ma',urlencodedParser,(req, res) => {
   console.log("posthere!")
   ops = 'Manage Account' ;
   if(req.headers.referer){ //check if req come from login auth
      console.log(req.headers.referer) 
     if(req.headers.referer.match('ma')) {
        console.log("Updating owner details"); 
        owner = req.body.owner
        address = req.body.address
        website = req.body.website
        brandName = req.body.addbrand
        category = req.body.addcate
        brandOps = req.body.AddorRemove

        if (brandOps == "Remove") {
           var dk = req.body.brandname;
           const brandArr = dk.split(":");
           const rmBrand = "DELETE FROM varitas.brands WHERE name = '" + brandArr[0] + "' AND category = '" + brandArr[1] + "'";
           connection.query(rmBrand, (err,result) => {
            if (err) throw err;
            console.log(result);
           });

        }    
        else if (brandName != null && category != null && brandOps == "Add") {
         console.log("got brand and category update!")
         
         const addBrand = "INSERT INTO varitas.brands(name,category,owner) VALUES('" + brandName
         + "','" + category + "','" + owner + "');"
         connection.query(addBrand, (err,result) => {
            if (err) throw err;
            console.log(result);
           });

        }
        else{
          const updateOwner = "update varitas.owners set addr='" + address +"', " + "website='"
         + website + "' where name='" + owner + "'";
         console.log(updateOwner)
         connection.query(updateOwner, (err,result) => {
          if (err) throw err;
          console.log(result);
         });

        }
        rendhome(res, address, website)

   }
   else res.redirect('/login') 
  }
});

app.get('/ma',(req, res) => {
   console.log("gethere!")
   ops = 'Manage Account' ;
   opsColor = "ma";
   
   if(req.headers.referer){ //check if req come from login auth
      console.log(req.headers.referer) 
     if(req.headers.referer.match('login') || req.headers.referer.match('ma') 
     || req.headers.referer.match('mp') || req.headers.referer.match('rp') 
     || req.headers.referer.match('blk')) {
       const queryHome = "select * from varitas.owners where name='"+ req.query.owner + "'";
       const queryBrand = "select * from varitas.brands where owner='"+ req.query.owner + "'";

       connection.query(queryHome, (err,result) => {
          if (err) throw err;
          console.log(result);
          if (result[0]){
             owner = result[0]['name']
             address = result[0]['addr']
             website = result[0]['website']
          }  
         }); 
         
         connection.query(queryBrand, (err1,result1) => {
            if (err1) throw err1;
            console.log(result1);
            var brandandCate;
            result1.forEach(element => {
               brandandCate = brandandCate + '\<option value=\"' + element['name'] + ":" + element['category'] + '\"\>' + element['name'] + ":::" + element['category'] + '\<\/option\>'
               brandName = element['name']
               category = element['category']
               console.log(category);
               
            }); 
              
         
            res.render('ownerhome',{
               owner,
               ops,
               address,
               website,
               opsColor,
               brandandCate 
            })    
         }); 
      }
   else res.redirect('/login') 
  }
});

app.get('/mp',(req, res) => {
   console.log("getProduct!") 
   ops = 'Manage Product'
   opsColor = "mp";
   if(req.headers.referer){ //check if req come from login auth
      console.log(req.headers.referer)
     if(req.headers.referer.match('login') || req.headers.referer.match('ma') 
     || req.headers.referer.match('mp') || req.headers.referer.match('rp') 
     || req.headers.referer.match('blk')) {

      const queryHome = "select * from varitas.owners where name='"+ req.query.owner + "'";
       const queryBrand = "select * from varitas.brands where owner='"+ req.query.owner + "'";

       connection.query(queryHome, (err,result) => {
          if (err) throw err;
          console.log(result);
          if (result[0]){
             owner = result[0]['name']
             address = result[0]['addr']
             website = result[0]['website']
          }  
         }); 
         
         connection.query(queryBrand, (err1,result1) => {
            if (err1) throw err1;
            console.log(result1);
            var brandandCate;
            result1.forEach(element => {
               brandandCate = brandandCate + '\<option value=\"' + element['name'] + ":" + element['category'] + '\"\>' + element['name'] + ":::" + element['category'] + '\<\/option\>'
               brandName = element['name']
               category = element['category']
               console.log(category);
               
            }); 
              
         
            res.render('product',{
               owner,
               ops,
               address,
               website,
               opsColor,
               brandandCate 
            })    
         }); 
         
   }
   else res.redirect('/login') 
  }
});

app.get('/rp',(req, res) => {
   console.log("gethere!") 
   ops = 'View Reports'
   opsColor = "rp";
   if(req.headers.referer){ //check if req come from login auth
      console.log(req.headers.referer)
     if(req.headers.referer.match('login') || req.headers.referer.match('ma') 
     || req.headers.referer.match('mp') || req.headers.referer.match('rp') 
     || req.headers.referer.match('blk')) {
       const selectOwner = "select * from varitas.owners where name='"+ req.query.owner + "'";
       connection.query(selectOwner, (err,result) => {
          if (err) throw err;
          console.log(result);
          if (result[0]){
            owner = result[0]['name']
            address = result[0]['addr']
            console.log(address)
            website = result[0]['website']
            res.render('ownerhome',{
               owner,
               ops,
               address,
               website,
               opsColor
            })
         }
         }); 
         
   }
   else res.redirect('/login') 
  }
});

app.get('/blk',(req, res) => {
   console.log("gethere!") 
   ops = 'Manage Transactions'
   opsColor = "blk";
   if(req.headers.referer){ //check if req come from login auth
      console.log(req.headers.referer)
     if(req.headers.referer.match('login') || req.headers.referer.match('ma') 
     || req.headers.referer.match('mp') || req.headers.referer.match('rp') 
     || req.headers.referer.match('blk')) {
       const uq = "select * from varitas.owners where name='"+ req.query.owner + "'";
       connection.query(uq, (err,result) => {
          if (err) throw err;
          console.log(result);
          if (result[0]){
            owner = result[0]['name']
            address = result[0]['addr']
            website = result[0]['website']
            res.render('ownerhome',{
               owner,
               ops,
               address,
               website,
               opsColor
            })
         }
         });      
   }
   else res.redirect('/login') 
  }
});

function auth(req, res, user, pass){

   const uq = "select * from varitas.owners where name='"+ user + "' and password='" + pass + "'";
     
     connection.query(uq, (err,result) => {
      if (err) throw err;
      console.log(result);
      
      if (result[0]) res.redirect('/ma?owner='+ user);
      else res.redirect('login');
      
     }); 

}

function restrict(req, res, next) {
    //res.send("yeah from a function");
    var q = req.query['qs1']
    var answ = `the string is ${q}`
    res.send(answ);
    next();

}

app.get('/', function (req, res) {
   res.redirect('/login');
})

app.get('/login', function (req, res) {
   res.render('login');
})

app.post('/login', urlencodedParser,function(req, res, next) {
   console.log(req.body.name)
   console.log(req.body.password)
   auth(req, res, req.body.name, req.body.password);

})

app.get('/restrict/*',restrict, function (req, res) {
   var q = req.query['qs1']
   res.send('the query is %s',q);
})

app.get('/db',function (req, res) {
  
connection.connect(function(err) {
   if (err) {
     return console.error('error: ' + err.message);
   }
   console.log('Connected to the MySQL server.');
 });
   
  const sqlQuery = 'SELECT * FROM varitas.owners';
  
  connection.query(sqlQuery, (err,result) => {
   if (err) throw err;
   console.log('id: ' + result[0]['owner_id'])
   console.log('Business name: ' + result[0]['name'])
   console.log('password: ' + result[0]['password'])
   console.log('description: ' + result[0]['description'])
   res.send(result);
  }); 
  
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Veritas serever listening at http://%s:%s", host, port)
})
