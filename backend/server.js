import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import DbCon from './utlis/db.js'
import AuthRoutes from './routes/Auth.js'
import AdminRoutes from './routes/AdminRoutes.js'

// import uploadRoutes from './routes/uploadRoutes.js';


dotenv.config()
const PORT=process.env.PORT || 4000
const app=express()

// mongo db 
DbCon()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: true, // or your front-end URL
    credentials: true, // Allow credentials (cookies, headers, etc.)
}));


app.use('/auth',AuthRoutes)
app.use('/admin',AdminRoutes)
// app.use('/api/uploads', uploadRoutes);

app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})