import express from "express";
import { loginuser,registeruser,adminlogin } from "../controller/usercontroller.js";


const userouter= express.Router()

userouter.post("/register",registeruser)
userouter.post("/login",loginuser)
userouter.post("/admin",adminlogin)

export default userouter

