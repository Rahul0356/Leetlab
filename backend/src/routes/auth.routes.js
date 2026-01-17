import express from "express";
import { check, login, logout, register } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();


//routes

authRoutes.post("/register",register)

authRoutes.post("/login",login)

authRoutes.post("/logout",authMiddleware,logout)

authRoutes.get("/check",authMiddleware,check)

// router.get("/get-submissions",authenticate , getSubmissions)

// router.get("/get-playlists" , authenticate , getUserPlaylists)

export default authRoutes;