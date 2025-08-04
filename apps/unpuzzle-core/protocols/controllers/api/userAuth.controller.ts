import { NextFunction, Request, Response } from "express";
import { BindMethods } from "../../utility/BindMethods";
import { CookieManager } from "../../utility/cookieManager";
import ResponseHandler from "../../utility/ResponseHandler";
import { clerkClient } from '@clerk/express'

class UserAuthController {
  constructor() {}
  
  getUserFromToken=async(req:any,res:Response,next:NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      const user = req.user;
      if(!user) throw new Error("user not found");
      return responseHandler.success(user);
    } catch (error) {
      return responseHandler.error(error as Error);
    }
  }

  refreshUser=(req:any,res:Response,next:NextFunction)=>{
    const user = req.user;
    console.log("refresh user:", user)
    if(!user) {
      return res.redirect("/sign-in");
    }
    res.redirect("/")
  }

  logout=async(req:any,res:Response,next:NextFunction)=>{
    const sessionId = req.cookies['__session'];
    try{
      CookieManager.clearAllAuthCookies(res)
      Object.keys(req.cookies).forEach(cookieName => {
        res.clearCookie(cookieName);
      });
      
      res.redirect("/")
      if (sessionId) {
        await clerkClient.sessions.revokeSession(sessionId);
      }
    }catch(error){
      console.log(error as Error)
    }
  }
}

const binding = new BindMethods(new UserAuthController());
export default binding.bindMethods();
