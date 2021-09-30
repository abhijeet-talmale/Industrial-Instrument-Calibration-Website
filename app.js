const express =  require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');
const bodyParser=require('body-parser');
const session =  require("express-session");
const encoder=bodyParser.urlencoded();

dotenv.config({path:'./.env'})

const app = express();

const db=mysql.createConnection({
     
    host:'localhost',
    user:'root',
    password:'root',
    database:'project'

});

db.connect((error)=>{
   if(error){
       console.log("error");
   }
   else{
       console.log("mysql connected");
   }
});

const publicDirectory = path.join(__dirname,'./public');
console.log(__dirname);
app.use(express.static(publicDirectory));

app.set('view engine','hbs');

app.use(express.static(path.join(__dirname,'./views')));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// app.get("/",(req,res)=>{
   
//     //res.send("<h1>Home Page</h1>")
//     res.sendFile("index.html");
// });

app.use('/',require('./routes/pages'));

app.use('/auth',require('./routes/auth'));

app.get("/",(req,res)=>{
    res.sendFile("index.html");
});
app.get("/login.html",function(req,res){
    res.sendFile(__dirname+"/login.html")
})

app.post("/login",encoder,function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    console.log(email);
    console.log(password);
    db.query('select * from  register where email=? and password=?',[email,password],function(error,results,fields){
        if(results.length > 0){
             //res.redirect('https://www.geeksforgeeks.org');
            // res.redirect('/login.html');
             res.redirect('/welcome')
             console.log("no error");
        }
        else{
            
            res.redirect('/login.html');
            
        }
        
    })
})
app.post("/api/adminlogin",encoder,function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    console.log(email);
    console.log(password);
    db.query('select * from  admin where email=? and password=?',[email,password],function(error,results,fields){
        if(results.length > 0){
             //res.redirect('https://www.geeksforgeeks.org');
            // res.redirect('/login.html');
             res.redirect('/welcomeadmin')
             console.log("no error");
        }
        else{
            
            res.redirect('/adminlogin.html');
            
        }
        
    })
})

app.get("/welcome",function(req,res){
    res.sendFile(__dirname +"/welcome.html")
});
app.get('/logout', function(req, res){
    // clear the remember me cookie when logging out
    res.clearCookie('remember_me');
    //req.logout();
    res.redirect('/');
   });

   app.get('/request', function(req, res){
    
    res.redirect('/request.html');
   });
   app.post('/api/request',function(req,res){
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const email=req.body.email;
    const phoneNumber=req.body.phoneNumber;
    const hospitalname=req.body.hospitalname;
    const hospitalId=req.body.hospitalId;
    var data=[firstname,lastname,email,phoneNumber,hospitalname,hospitalId];
    console.log(data);
    var insertQuery="INSERT INTO request(firstname,lastname,email,phonenumber,hospitalname,hospitalid)values(?,?,?,?,?,?)";    
    db.query(insertQuery , data ,function(err,data){
        if(err){
            console.log("error"+err);
        }
        else{
            res.send("Form Submitted");
            //res.redirect("/welcome");
            //console.log(data);
        }

    });
   });
   app.get("/welcomeadmin",function(req,res){
    res.sendFile(__dirname +"/welcomeadmin.html")
});

app.post('/api/calibration',function(req,res){
    const email=req.body.email;
    const instrument=req.body.instrument;
    const instrumentnumber=req.body.instrumentnumber;
    const calibrationFrequancy=req.body.calibrationFrequancy;
    const lastcalibrateDate=req.body.lastcalibrateDate;
    const nextCalibratedDate=req.body.nextCalibratedDate;
    var data=[email,instrument,instrumentnumber,calibrationFrequancy,lastcalibrateDate,nextCalibratedDate];
    console.log(data);
    var insertQuery="INSERT INTO calibratedInstrument(EmailID,NameofInstrument,indentificationnumber,calibrationperiod,calibrationlastdate,nextcalibrationdate)values(?,?,?,?,?,?)";    
    db.query(insertQuery , data ,function(err,data){
        if(err){
            console.log("error"+err);
        }
        else{
            res.send("Form Submitted");
            //res.redirect("/welcome");
            //console.log(data);
        }

    });
   });
   
// app.post("/api/login",(request,response)=>{
//       console.log("post method invoked");
      
//       var newUser= request.body;

//       console.log(newUser);

//       let email=newUser.email;
//       let password=newUser.password;

//       var data=[email,password];

//       var selectquery="select * from register where email=? AND password=?";
//       db.query(selectquery,data,function(err,data){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("success");
//             console.log(data);
//            response.redirect("/index");
            
//         }    

//       });
// });
app.get("/api/requestadmin",(req,res)=>{
    var getAllquery="SELECT * FROM request";
    db.query(getAllquery,function(err,data){
        if(err){
            console.log("error"+err);
        }
        else{
            res.send(data);
            //console.log(data);
        }
      
    });
    //res.send(data);

});
app.get("/api/calibrationdata",(req,res)=>{
    var getAllquery="SELECT * FROM calibratedInstrument";
    db.query(getAllquery,function(err,data){
        if(err){
            console.log("error"+err);
        }
        else{
            res.send(data);
            //console.log(data);
        }
      
    });
    //res.send(data);

});
app.listen(5000,()=>{
console.log("Server listen at 5000");
});