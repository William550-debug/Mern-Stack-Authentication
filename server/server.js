import express from "express"
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import cookieParser from "cookie-parser";
import connectDb from "./config/mongoDb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = process.env.PORT || 4000;
connectDb();


app.use(express.json());
app.use(cookieParser());

const allowedOrigin = ["http://localhost:5173"]
app.use(cors({
    
    origin:allowedOrigin,
    credentials:true
}));

//Api endpoint
app.get("/", (req, res) => 
    res.send("API is running")
);


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
})