import jwt from "jsonwebtoken";

const userAuth = async (req, res , next )=> {

    console.log("token", req.cookies.token);


    const { token } = req.cookies;


    if (!token) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }

    try{

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        console.log("tokenDecode", tokenDecode);

        if(tokenDecode.id){
            req.body = req.body || {}; // Ensure req.body is defined
            req.body.userId = tokenDecode.id ;

            console.log("req.body.userId", req.body.userId);
        }else{
            return res.json({ message: "Unauthorized", success: false });
        }

        next();

    }
    catch (error) {
        return res.json({ message:error.message, success: false });
    }


}


export default userAuth;