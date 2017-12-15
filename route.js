'use strict';

const creditscore = require('./functions/creditscore');
const login = require('./functions/login');
const registerUser = require('./functions/registerUser');
const loan = require('./functions/loan');
const getloandetails = require('./functions/getloandetails');
const getparticulardetails = require('./functions/getparticulardetails');
var cors = require('cors');
var mongoose = require('mongoose');

var Promises = require('promise');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var Photo = require('./models/document');
var path = require('path');

const savetransaction = require('./functions/savetransaction');

module.exports = router => {
    
router.post('/creditscore', cors(), (req, res1) => {

    console.log("entering register function in functions ");
    const requestid = parseInt(req.body.requestid);
    console.log(requestid);
   
    creditscore
    .creditscore(requestid)
    .then(result => {


        res.status(result.status).json({
            message:"succeess"
        

        });

    })
    .catch(err => res.status(err.status).json({
        message: err.message
    }).json({
        status: err.status
    }));
      
});


    router.post('/registerUser', cors(), (req, res) => {

        const email = req.body.email;
        console.log(email);
       
        const password = req.body.password;
        console.log(password);
        
        const firstname = req.body.firstname;
        console.log(firstname);
        const lastname = req.body.lastname;
        console.log(lastname);
        const dateofbirth = req.body.dateofbirth;
        console.log(dateofbirth);
        //const gender = req.body.gender;
        //console.log(gender);
        // const age =parseInt(req.body.age);
        // console.log(age);
        const phonenumber =parseInt(req.body.phonenumber);
        console.log(phonenumber);
        const retypepassword = req.body.retypepassword;
        console.log(retypepassword);

        
        if (!email || !password || !firstname || !lastname || !dateofbirth  || !phonenumber || !retypepassword) {

            res
                .status(400)
                .json({
                    message: 'Invalid Request !'
                });

        } else {

            registerUser
                .registerUser(email,password,retypepassword,firstname,lastname,dateofbirth,phonenumber)
                .then(result => {

                    res.send({
                        "message": "user has been registered successfully",
                        "status": true,
                    
            
                    });
            

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }).json({
                    status: err.status
                }));
        }
    });

router.post('/login', cors(), (req, res) => {
    console.log("entering login function in functions ");
    const emailid = req.body.email;
    console.log(emailid);
    const passwordid = req.body.password;
    console.log(passwordid);
    
    login
    .loginUser(emailid, passwordid)
    .then(result => {


        res.send({
            "message": "Login Successful",
            "status": true,
        

        });

    })
    .catch(err => res.status(err.status).json({
        message: err.message
    }).json({
        status: err.status
    }));
      
}); 
cloudinary.config({
    cloud_name: 'diyzkcsmp',
    api_key: '188595956976777',
    api_secret: 'F7ajPhx0uHdohqfbjq2ykBZcMiw'
});

router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
    const id = req.headers['userid'];
    console.log(id)
    var photo = new Photo(req.body);
    console.log("req.files.image" + JSON.stringify(req.files));
    var imageFile = req.files.file.path;
   cloudinary
        .uploader
        .upload(imageFile, {
            tags: 'express_sample'
        })
        .then(function(image) {
            console.log('** file uploaded to Cloudinary service');
            console.dir(image);
            photo.url = image.url;
            photo.userid = id;
           // photo.claimno = claimno;
            // Save photo with image metadata
            return photo.save();
        })
        .then(function(photo) {

           res.send({
                url: photo._doc.url,
                //claimno: photo._doc.claimno,
                message: "files uploaded succesfully"
            });
        })
        .finally(function() {

           res.render('photos/create_through_server', {
                photo: photo,
                upload: photo.image
            });
        });
});

router.get('/images/id', cors(), (req, res) => {
    const id = req.body.userid
    console.log("id" + id);
    Photo
        .find({
            "userid": id
        })
        .then((images) => {
            var image = [];
            for (let i = 0; i < images.length; i++) {
                image.push(images[i]._doc)

           }

           res.send({
                images: image,
                message: "image fetched succesfully"
            });
        })

});  




router.post('/loandetails', cors(), (req, res) => {
    
            // const requestid = req.body.requestid;
            // console.log("line number 203----->",requestid);
            var requestid    = "";
            var possible= "0123456789674736728367382772898366377267489457636736273448732432642326734"
            for (var i=0; i<3;i++)
            requestid += possible.charAt(Math.floor(Math.random() * possible.length));
            console.log("requestid"+requestid)
            var transactionstring  = req.body.transactionstring;
            console.log(transactionstring)
           
            
            loan.loandetails(requestid,transactionstring)

            .then(result => {
                console.log(result);
                res.send({
                    "message": "loan details entered successfully",
                    "requestid":requestid,
                    "status": true,
                
        
                });
                    })
                    
                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }).json({
                        status: err.status
                    }));
    
    }); 

    router.post('/getloandetails', cors(), (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        console.log(JSON.stringify(req.body));
        console.log(email);
        if (email == "man@admin.com") {
            console.log("yes");
            getloandetails
            .getloandetails(email)
            .then(function(result) {
                console.log(result)

                res.send({
                    status: result.status,
                    message: result.usr
                });
            })
            .catch(err => res.status(err.status).json({
                message: err.message
            }));
    

            
            res.send({
                "message": "Login Successful",
                "status": true,
            })
        }  else {

            console.log("no");
            res.send({
                "message": "email is not valid",
                "status": true,
            })
        }    


               
    }); 


    router.post('/getparticulardetails', cors(), (req, res) => {

        console.log(req.body.requestid);
        var requestid = req.body.requestid;
                        getparticulardetails
                         .getparticulardetails(requestid)
                         .then(function(result) {
                   console.log(result)
        
                             res.send({
                                status: result.status,
                                message: result.usr
                            });
                        })
                        .catch(err => res.status(err.status).json({
                         message: err.message
                         }));
                
        
             });
             router.post('/savetransaction', cors(), (req, res) => {
                 var name = req.body.name;
                var transactionstring = JSON.stringfy(req.body.transactionstring);
                var requestid = req.body.requestid;
                
                                        savetransaction
                                         .savetransaction(name,transactionstring,requestid)
                                         .then(function(result) {
                                   console.log(result)
                        
                                             res.send({
                                                
                                                message: "entered successfully"
                                            });
                                        })
                                        .catch(err => res.status(err.status).json({
                                         message: err.message
                                         }));
                                
                        
                             });
                             

                             router.post('/approveloan', cors(), (req, res) => {
                                const id = req.body.requestid;
                                console.log(id);
                                
                                if (!id) {
                                    // the if statement checks if any of the above paramenters are null or not..if
                                    // is the it sends an error report.
                                    res
                                        .status(400)
                                        .json({
                                            message: 'Invalid Request !'
                                        });
                            
                                } else {
                                    approveloan
                                        .approveloan(id)
                                        .then(result => {
                            
                                            res
                                                .status(result.status)
                                                .json({
                                                    status: result.status,
                                                    message: result.message
                                                })
                                        })
                                        .catch(err => res.status(err.status).json({
                                            message: err.message
                                        }));
                                }
                            
                            });
                            
        
        
}

