import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import { connectDB } from './config/db.js';
import localBodyRouter from './routes/localBodyRoute.js';
import issueRouter from './routes/issueRoute.js';
import voteRouter from './routes/voteRoute.js';
import adminRouter from './routes/adminRoute.js';
import analyticsRouter from './routes/analyticsRoute.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDB()

app.get('/',(req,res)=>{
    res.send("Server")
})



app.use('/api/user',userRouter);
app.use('/api/local-bodies', localBodyRouter);
app.use('/api/issues',issueRouter);
app.use('/api/vote',voteRouter);
app.use('/api/admin',adminRouter);
app.use('/api/analytics', analyticsRouter)



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})