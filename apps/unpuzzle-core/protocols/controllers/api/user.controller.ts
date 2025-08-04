import { Request, Response, NextFunction } from "express";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import UserModel from "../../../models/supabase/user.model";
import CreditTrackModel from "../../../models/supabase/creditTrack.model";
import CreditTransactionModel from "../../../models/supabase/creditTransaction.model";

class UserController {
  constructor() {}

  /**
   * Get user data including credit information
   * GET /api/user/:userId
   */
  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { userId } = req.params;
      
      if (!userId) {
        throw new Error("User ID is required");
      }

      const user = await UserModel.getUserById(userId);
      
      if (!user) {
        return responseHandler.error(new Error("User not found"), 404);
      }

      // Get credit information from credit_track table
      const creditTrack = await CreditTrackModel.getCreditTrackByUserId(userId);
      const availableCredits = creditTrack?.available_credit || 0;

      // Calculate total credits from credit transactions
      const { data: transactions } = await CreditTransactionModel.getCreditTransactionsByUserId(userId, 1, 1000);
      const totalCredits = transactions?.reduce((total, transaction) => {
        if (transaction.type === 'purchase' || transaction.type === 'bonus') {
          return total + transaction.amount;
        } else if (transaction.type === 'usage' || transaction.type === 'refund') {
          return total - transaction.amount;
        }
        return total;
      }, 0) || availableCredits;

      // Format response according to frontend expectations
      const response = {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim(),
        availableCredits: availableCredits,
        totalCredits: totalCredits,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };

      return responseHandler.success(response);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  /**
   * Get only credit information for a user
   * GET /api/user/:userId/credits
   */
  getUserCredits = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { userId } = req.params;
      
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Verify user exists
      const user = await UserModel.getUserById(userId);
      if (!user) {
        return responseHandler.error(new Error("User not found"), 404);
      }

      // Get from credit_track table
      let creditData = await CreditTrackModel.getCreditTrackByUserId(userId);
      
      // If not found in credit_track, create initial record
      if (!creditData) {
        creditData = await CreditTrackModel.createCreditTrack({
          user_id: userId,
          available_credit: 0
        });
      }

      // Calculate total credits from credit transactions
      const { data: transactions } = await CreditTransactionModel.getCreditTransactionsByUserId(userId, 1, 1000);
      const totalCredits = transactions?.reduce((total, transaction) => {
        if (transaction.type === 'purchase' || transaction.type === 'bonus') {
          return total + transaction.amount;
        } else if (transaction.type === 'usage' || transaction.type === 'refund') {
          return total - transaction.amount;
        }
        return total;
      }, 0) || creditData.available_credit;

      // Format response according to frontend expectations
      const response = {
        id: creditData.id,
        userId: creditData.user_id,
        availableCredits: creditData.available_credit || 0,
        totalCredits: totalCredits,
        createdAt: creditData.created_at,
        updatedAt: creditData.updated_at
      };

      return responseHandler.success(response);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  /**
   * Get user's credit transaction history
   * GET /api/user/:userId/transactions
   */
  getUserTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { data: transactions, count } = await CreditTransactionModel.getCreditTransactionsByUserId(
        userId,
        page,
        limit
      );

      const response = {
        transactions,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      };

      return responseHandler.success(response);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  /**
   * Get all users (admin endpoint)
   * GET /api/users
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await UserModel.getAllUsers(page, limit);
      
      // Format users with credit info from credit_track
      const formattedUsers = await Promise.all(users?.map(async (user) => {
        const creditTrack = await CreditTrackModel.getCreditTrackByUserId(user.id);
        
        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          availableCredits: creditTrack?.available_credit || 0,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        };
      }) || []);

      return responseHandler.success(formattedUsers);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };
}

const binding = new BindMethods(new UserController());
export default binding.bindMethods();