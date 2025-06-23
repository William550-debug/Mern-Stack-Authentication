import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'; // Assuming you have a configured transporter for sending emails
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ message: "All fields are required" , success: false });
    }

    try{

        //create user && encrypt password
        const existingUser  = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ message: "User already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();


   


        //create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Helps prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Our Service",
            text: `Hello ${name},\n\nThank you for registering! We're glad to have you on board.\n\nBest,\nThe Team`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ message: "Registration successful", success: true });



    }
    catch (error){
        res.status(500).json({ message: "Internal server error", success: false });
    }

}


export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    try {
        //find user
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email credentials ", success: false });
        }

        //check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password credentials", success: false });
        }

        //create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log("Token generated:", token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // Helps prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ message: "Login successful", success: true });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }


}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}



export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        console.log("User ID:", userId);

        const user = await userModel.findById(userId);

        console.log("User found:", user);

        if(user.isVerified) {
            return res.json({ message: "User already verified", success: false });
        }

        const otp = String(Math.floor(100000 + Math.random() * 90000));

        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes


        

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verify Your Email",
            text: `Your verification OTP is ${otp}. It is valid for 10 minutes.`
        }

        //console.log("mailOptions", mailOptions);

        await transporter.sendMail(mailOptions);

        //console.log("Email sent response:", response);

        user.verifyOtp = otp;
        await user.save();
        return res.json({ message: "OTP sent successfully", success: true });


    }
    catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}


// Verify OTP
export const verifyOtp = async (req, res) => {

    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ message: "User ID and OTP are required", success: false });
    }

    try{

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ message: "User not found", success: false });
        }
        if (user.isVerified) {
            return res.json({ message: "User already verified", success: false });
        }
        if (user.verifyOtp !== otp || user.verifyOtpExpireAt < Date.now() || !user.verifyOtp === '') {
            return res.json({ message: "Invalid or expired OTP", success: false });
        }

        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0

        

        await user.save();

        return res.json({ message: "User verified successfully", success: true });

    }
    catch (error) {

        res.status(500).json({ message: "Internal server error", success: false });
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res, next) => {

    try{


        return res.json({ message: "User is authenticated", success: true });
    }catch (error) {
        console.error("Error in isAuthenticated:", error);
        res.status(500).json({ message: error.message, success: false });
    }

}

//send password otp
export const sendResetOtp = async (req, res) => {

    const {email} = req.body;

    if(!email) {
        return res.json({ message: "Email is required", success: false });
    }

    try {
        const user = await userModel.findOne({ email });


        if (!user) {
            return res.json({ message: "User not found", success: false });
        }


        const otp = String(Math.floor(100000 + Math.random() * 90000));


        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset Your Password",
            text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`
        }

        //console.log("mailOptions", mailOptions);

        await transporter.sendMail(mailOptions);

        //console.log("Email sent response:", response);

        await user.save();
        return res.json({ message: "Password reset OTP sent successfully", success: true });




    
    }catch (error) {
        console.error("Error sending password OTP:", error);
        res.status(500).json({ message: error.message, success: false });
    }

}



//for reseting the password

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ message: "Email and OTP are required", success: false });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    if (user.resetOtp !== otp) {
      return res.json({ message: "Invalid OTP", success: false });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ message: "OTP has expired", success: false });
    }

    return res.json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.error("Error verifying reset OTP:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


// Verify Password Reset OTP and reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    //console.log("Reset Password Request:", { email, otp, newPassword });

    if (!email || !otp || !newPassword) {
        return res.json({ message: "Email, OTP, and new password are required", success: false });
    }

    try {
        const user = await userModel.findOne({ email });
       // console.log("User found:", user);
        

        if (!user) {
            console.log("User not found for email:", email);
            return res.json({ message: "User not found", success: false });
        }

       if(user.resetOtp === "" || user.resetOtp != otp) {
        
           //console.log("Invalid otp for user:", user._id);
           return res.json({ message: "Invalid  OTP", success: false });
       }

       if(user.resetOtpExpireAt < Date.now()) {
           //console.log("OTP expired for user:", user._id);
           return res.json({ message: "OTP expired", success: false });

       }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ message: "Password reset successfully", success: true });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }

}
