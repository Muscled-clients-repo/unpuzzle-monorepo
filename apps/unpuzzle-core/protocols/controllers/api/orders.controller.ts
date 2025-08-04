import { Request, Response, NextFunction } from "express";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import {StripeService} from "../../../contexts/services/StripeServices"
import OrdersModel from "../../../models/supabase/orders.model"
import ProductModel from "../../../models/supabase/product.model";


class OrdersController {
    constructor() {}

    bodyPreprocess=async(req: any)=>{
        const {body} = req
        const {items} = body
        if(!items){
            throw new Error("Items are required")
        }
        const productService = ProductModel
        
        try{
            let totalAmount = 0
            const productIds = items.map((item: any) => item.product_id)
            const itemsReduced = items.reduce((acc: any, item: any)=>{
                acc[item.product_id] = item
                return acc
            },{})
            
            const products = await productService.getProductsByIds(productIds)
            
            products.forEach((product: any)=>{
                totalAmount += product.price * itemsReduced[product.id].quantity
            })
    
            body['total_amount']=totalAmount
            body['payment_amount']=totalAmount
            
    
            console.log(body)
            
            return body
        }catch(error){
            throw error
        }
    }

    createPaymentIntent= async(amount: number)=>{
        
        const stripeService = new StripeService()
        
        try {
            const data = await stripeService.createPaymentIntent({
                amount: amount,
                description: 'Order payment'
            })
            return data
        } catch (error: any) {
            throw error
        }
    }

    createOrder= async(req: any,res: Response,next: NextFunction)=>{
        const responseHandler = new ResponseHandler(res, next);
        const orderService = OrdersModel
        try {
            // preprocess
            const body = await this.bodyPreprocess(req)

            // insert user_id
            // const user_id = req.user.id
            body["user_id"] = "user_2yje3NugrwcgIJ85KkQmcZNr2yL"

            // Create payment intent
            const payment_intent = await this.createPaymentIntent(body.payment_amount)

            console.log(payment_intent)

            // create order
            body['payment_id']=payment_intent.id
            body['payment_status']="pending"
            await orderService.createOrders(body)

            responseHandler.success(payment_intent);
        } catch (error: any) {
            responseHandler.error(error);
        }
    }

}

const binding = new BindMethods(new OrdersController());
export default binding.bindMethods();
