import { Request, Response, NextFunction } from "express";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import {StripeService} from "../../../contexts/services/StripeServices"


class PaymentDistController {
    constructor() {}

    checkBlance= async(req: any,res: Response,next: NextFunction): Promise<void> =>{
        const responseHandler = new ResponseHandler(res, next);
        const stripeService = new StripeService()
        
        try {
            const data = await stripeService.createPaymentIntent(2000)
            responseHandler.success(data);
        } catch (error: any) {
            console.log(error);
            responseHandler.error(error);
        }
    }

    widthdraw= async(req: any,res: Response,next: NextFunction): Promise<void> =>{
        const responseHandler = new ResponseHandler(res, next);
        const stripeService = new StripeService()
        
        try {
            const data = await stripeService.createPaymentIntent(2000)
            responseHandler.success(data);
        } catch (error: any) {
            console.log(error);
            responseHandler.error(error);
        }
    }

    connectBankAccount= async(req: any,res: Response,next: NextFunction): Promise<void> =>{
        const responseHandler = new ResponseHandler(res, next);
        const stripeService = new StripeService()
        
        try {
            const data = await stripeService.createPaymentIntent(2000)
            responseHandler.success(data);
        } catch (error: any) {
            console.log(error);
            responseHandler.error(error);
        }
    }
}

const binding = new BindMethods(new PaymentDistController());
export default binding.bindMethods();
