import { Request, Response, NextFunction } from 'express';
import {BindMethods} from "../../utility/BindMethods"
import ResponseHandler from "../../utility/ResponseHandler"
import UserModel from "../../../models/supabase/user.model"

class WebhookClerkController {
  // Create a new video upload
  async webhookClerk(req: Request, res: Response, next: NextFunction) {
    const responseHandler = new ResponseHandler(res, next)
    try {
      console.log("req.body: ", req.body.type);
      
        if(req.body.type === "user.created"){
          const {id, email_addresses, first_name, last_name, image_url} = req.body.data
          console.log({id, email_addresses, first_name, last_name, image_url});
            const user = await UserModel.createUser({id, email: email_addresses[0].email_address, first_name, last_name, image_url})
            console.log("user: ", user);
        }

     

      return responseHandler.success({});
    } catch (error) {
      console.error('Upload creation error:', error);
      return responseHandler.error(error as Error);
    }
  }

}

const binding = new BindMethods(new WebhookClerkController())
export default binding.bindMethods()