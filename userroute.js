const express = require('express');
const router = express();
const bcrypt=require('bcrypt');
const registermodel = require('../models/registermodel');
const jwt = require('jsonwebtoken');
const tokenmodel=require('../models/tokenmodel');

router.post('/user/registration', async (req, res) => {
    try {
        var { role,name,email,password } = req.body//requested values
        
        

        var emailcheck = await registermodel.find({ email: email })//mongodb query
            if (emailcheck.length>0) {
                res.status(200).json({
                    status: false,
                    msg: "Email already exists"
                });
                return;
            }
        var encryptedPassword = await bcrypt.hash(password, 10);
            var d = new registermodel({
                role:role,
                name: name,
                email: email,
                password: encryptedPassword,
            })
            await d.save()
            res.status(200).json({
                status: true,
                msg: "success",
                user: d,
            });
            return;
        }
    
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
        return;
    }
});



router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        

        // Find the user by email
        const user = await registermodel.findOne({ email: email });

        if (!user) {
            console.log("Email not found");
            
            res.status(200).json({
                status:false,
                msg:"Email Not Found"
            });
          
            return;
        }

        // Compare the password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token=jwt.sign({userid:user._id},'your_secret_key',{expiresIn: '100h' });

            const tokenEntry = new tokenmodel({
                userId: user._id,
                token: token,
            });
            await tokenEntry.save();

            console.log("Login success");

            res.status(200).json({
                status: true,
                token: token,
                name: email,
                msg: "success",
            });
            return;
        } else {
            console.log("Password not matching");
            res.status(200).json({
                status:false,
                msg:"Password Not Matching",
            });
            return;
        }
    } catch (err) {
        console.error("Error during login", err);
        return res.status(500).send("Internal server error");
    }
});

router.put('/user/reset', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for required fields
      console.log(password);

        console.log(`Resetting password for email: ${email}`);
        
        const user = await registermodel.findOne({ email: email });
        
        if (!user) {
            console.log("Email not found");
            return res.status(404).json({ status: false, msg: "Email not found" });
        }

        // Hash the new password
        const encryptedPassword = await bcrypt.hash(password, 10); // Ensure password is defined
        user.password = encryptedPassword;

        // Save the updated user
        await user.save();

        return res.status(400).json({
            status: true,
            msg: "Password updated successfully"
        });
    } catch (err) {
        console.error("Error during password reset:", err); // Log the actual error
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
});



//userlist getting route
router.get('/user/list',async(req,res)=>{
    try{
        const userlist=await registermodel.find({});
        if(!userlist){
            res.status(200).json({
                status:false,
                msg:"unsuccessful"
            });
        }
        else{
            res.status(200).json({
                status:true,
                msg:"successful",
                userlist:userlist
            });
        }
    }
    catch(err){
        console.log("error occured");
    }
});

module.exports=router;