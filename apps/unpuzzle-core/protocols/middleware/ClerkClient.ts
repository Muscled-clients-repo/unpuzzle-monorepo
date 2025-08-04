// Import type definitions
/// <reference path="../../types/express.d.ts" />

// utility
import {BindMethods} from "../utility/BindMethods"

// middleware
import { clerkClient } from '@clerk/express'
import { Request, Response, NextFunction } from 'express';
import UserModel from "../../models/supabase/user.model"
import jwt from "jsonwebtoken";
import { CookieManager } from "../utility/cookieManager";
import { User } from "../../types/user.type";


class ClerkClient{
    private jwtSecret: string;
    constructor(){
        this.jwtSecret = process.env.JWT_SECRET || "";
        if(!this.jwtSecret) throw new Error("JWT_SECRET is not set");
    }
    validateToken=(token: string)=>{
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return decoded;
        } catch (error) {
            // Don't throw immediately, return null to allow other auth methods
            console.log("Token validation failed:", error instanceof Error ? error.message : 'Unknown error');
            return null;
        }
    }

    async getUserFromClerkId(userId: string): Promise<any> {
        try {
            // Get or create user in our database
            let user = await UserModel.getUserById(userId);
            if (!user) {
                const clerkUser = await clerkClient.users.getUser(userId);
                const newUser: User = {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    first_name: clerkUser.firstName || '',
                    last_name: clerkUser.lastName || '',
                    image_url: clerkUser.imageUrl || ''
                };
                user = await UserModel.createUser(newUser);
            }
            return user;
        } catch (error) {
            console.log("Failed to get user from Clerk ID:", error instanceof Error ? error.message : 'Unknown error');
            return null;
        }
    }

    requireAuthRedirect=async(req:Request, res: Response, next: NextFunction)=>{
        try{
            console.log("User required", req.user)
            if(req.user){
                return next();
            }else{
                res.redirect("/sign-in")
            }
        }catch(error){
            return next(error)
        }
    }
    
    requiredAuth=async(req:Request, res: Response, next: NextFunction)=>{
        try{
            console.log("User required", req.user)
            if(req.user){
                return next();
            }else{
                const error = new Error("Unauthorized") as any;
                error.statusCode = 401
                return next(error)
            }
        }catch(error){
            return next(error)
        }
    }
    async getUser(req: Request, res: Response, next: NextFunction){
        // First check Authorization header for cross-origin requests
        const authHeader = req.headers.authorization;
        let token = CookieManager.getAuthCookie(req);
        
        // If no cookie, check Authorization header
        if (!token && authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        
        if (process.env.NODE_ENV === 'development') {
            // req.user={
            //     id:"user_2yje3NugrwcgIJ85KkQmcZNr2yL",
            //     email:"nazmul291@gmail.com",
            //     first_name:"",
            //     last_name:"",
            //     role:"user",
            //     bio:"",
            //     title:"",
            //     image_url:"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeWplM09KS3lyU09pSjBPZE9VelFlTVZRRmUifQ"
            // }
            console.log("=== Cookie Debug Info ===");
            console.log("Request URL:", req.url);
            console.log("Request Origin:", req.headers.origin);
            console.log("Request Host:", req.headers.host);
            console.log("All cookies:", req.cookies);
            console.log("Auth token from cookie:", token);
            console.log("Cookie header:", req.headers.cookie);
            console.log("========================");
            // return next()
        }
        const auth = req.auth;
        try {
            // First check if we have a valid JWT token (from cookie or header)
            if(token){
                const decoded = this.validateToken(token);
                if (decoded && typeof decoded === 'object' && 'id' in decoded) {
                    req.user = decoded as any;
                    return next();
                }
            }
            
            // If no valid JWT, check if Clerk authenticated the request
            if(auth?.userId){
                const userId = auth.userId;
                if (process.env.NODE_ENV === 'development') {
                    console.log("userId is: ", userId);
                }
                const user = await this.getUserFromClerkId(userId);
                if (!user) return next();
                const newToken = jwt.sign(user, this.jwtSecret);
                CookieManager.setAuthCookie(res, newToken);
                req.user = user;
                return next();
            }
            
            // If Authorization header contains a Clerk user ID (for cross-origin requests)
            if (authHeader?.startsWith('clerk_')) {
                const clerkUserId = authHeader.substring(6); // Remove 'clerk_' prefix
                const user = await this.getUserFromClerkId(clerkUserId);
                if (user) {
                    const newToken = jwt.sign(user, this.jwtSecret);
                    CookieManager.setAuthCookie(res, newToken);
                    req.user = user;
                }
            }
            
            return next();
        } catch (error) {
            return next(error);
        }
    }
}
  
const binding = new BindMethods(new ClerkClient())
export default binding.bindMethods();

  