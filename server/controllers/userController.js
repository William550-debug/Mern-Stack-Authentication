import userModel from "../models/userModel.js";



export const getUserData  = async(req, res) =>{

    


    try{

        

        const { userId } = req.body;

        

        const user = await userModel.findById(userId);

        console.log("Fetched user:", user);
  

        if (!user) {
            console.error("User not found");
            return res.json({ message: "User not found", success: false });
        }

        res.json({
            message: "User data fetched successfully",
            success: true,
            userData: {
                email: user.email,
                name: user.name,
                isVerified: user.isVerified
             
            }
        });

    }
    catch (error) {
        console.error("Error fetching user data:", error);
        res.json({ message: error.message, success: false });
    }


}