import express from "express"
import userAuth from "../middleware/useAuth.js"
import {getUserData} from "../controllers/usercontroller.js"

const userRouter=express.Router()

userRouter.get('/data',userAuth,getUserData)
export default userRouter