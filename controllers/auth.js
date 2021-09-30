const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');

const db=mysql.createConnection({
     
    host:'localhost',
    user:'root',
    password:'root',
    database:'project'

});

exports.register = (req,res)=>{
    console.log(req.body);
  
    //res.redirect("/login.html");
    

    // const firstname=req.body.firstname;
    // const lastname=req.body.lastname;
    // const email=req.body.email;
    // const password=req.body.password;
    // const passwordconfirm=req.body.passwordconfirm;
    // const phoneNumber=req.body.phoneNumber;
    // const hospitalname=req.body.hospitalname;
    // const hospitalId=req.body.hospitalId;

    const {firstname,lastname,email,password,passwordconfirm,phoneNumber,hospitalname,hospitalId}=req.body;
      
    db.query('select * from register where email=?',[email],async(error,results)=>{
        if(error){
          console.log(error);
        }
        if(results.length > 0){
           return res.render('register',{
               message:'that eamil already been use'
           })
        }else if(password!=passwordconfirm){
            return res.render('register',{
                message:'Passwords do not match'
            }) ;
          

        }

        //let hashpassword = await bcrypt.hash(password,8);
        //console.log(hashpassword);
        //res.send("testing");
        db.query('Insert Into register set ?',{firstname:firstname,lastname:lastname,
            email:email,password:password,
            phoneNumber:phoneNumber,hospitalname:hospitalname,
            hospitalId:hospitalId},(error,results)=>{
                if(error){

                    console.log(error);
                }
                else{
                    
                   console.log(results);
                   return res.render('register',{
                    message:'user registered'
                }) ;
                
                }

            });
    });
   // res.send("Form Submited");
    res.redirect("/login.html");

}