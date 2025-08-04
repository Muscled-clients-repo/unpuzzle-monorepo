// utility
import {BindMethods} from "../utility/BindMethods"
import ResponseHandler from "../utility/ResponseHandler";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

class Authentication{
    private appUrl:string | undefined
    private jwtSecret:string | undefined

    constructor(){
        this.appUrl=process.env.APP_URL_ENDPOINT
        this.jwtSecret = process.env.JWT_SECRET;
        if(!this.jwtSecret) throw new Error("JWT_SECRET is not set");
    }

    validateToken=(token: string)=>{
        try {
            const decoded = jwt.verify(token, this.jwtSecret as string);
            return decoded;
        } catch (error) {
            throw new Error("Invalid token");
        }
    }

    requiredAuth=async(req:any, res:Response, next:NextFunction)=>{
        const responseHandler = new ResponseHandler(res,next)
        try{
            if(!req.user){
                return responseHandler.error(new Error("Unauthorized"),401)
            }
            next()
        }catch(error){
            next(error)
        }
    }
    
    auth=async(req:any, res:Response, next:NextFunction)=>{
        try{
            const token = req.cookies["__m1atrj"];
            console.log(token)
            if(token){
                const decoded = this.validateToken(token)
                req.user = decoded
                console.log(req.user)
                return next()
            }
            const authorization = req.headers['authorization'];
            if(!authorization){
                console.log("Still authorization")
                console.log(authorization)
                return next()
            }
            const response = await fetch(`${this.appUrl}/api/user-auth`, {
                headers: {
                    'Authorization': authorization
                }
            })
            
            if (!response.ok) {
                console.error('User auth API failed:', response.status, response.statusText);
                return next();
            }
            
            const responseData = await response.json();
            const {data} = responseData;
            
            // Validate that data exists and is not empty
            if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
                console.error('Invalid or empty data received from user auth API');
                return next();
            }
            
            // generate jwt token
            const jwtToken = jwt.sign(data, this.jwtSecret as string)
            res.cookie("__m1atrj", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            })
            req.user = data
            return next()

        }catch(error){
            console.error('Auth middleware error:', error);
            return next(error)
        }

    }
}
  
const binding = new BindMethods(new Authentication())
export default binding.bindMethods();

  