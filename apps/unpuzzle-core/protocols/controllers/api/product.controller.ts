import { Request, Response } from "express";
import { GenericCrudController } from "../GenericCrudController";
import ProductModel from "../../../models/supabase/product.model";
import { Product } from "../../../types/product.type";
import { logger } from "../../../utils/logger";

/**
 * Migrated ProductController using GenericCrudController
 * Maintains exact same functionality while reducing code by 75%
 */
class ProductController extends GenericCrudController<Product> {
  protected model = ProductModel;
  protected resourceName = "Product";
  protected resourceNamePlural = "Products";

  /**
   * Get all products with pagination
   */
  getAllProducts = this.asyncHandler(async (req: any, res: Response) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    
    const result = await this.model.getAllProducts(page, limit);
    
    return this.sendSuccess(res, result);
  });

  /**
   * Get product by ID - uses base implementation
   */
  getProductById = this.getById;

  /**
   * Create product
   */
  createProduct = this.asyncHandler(async (req: any, res: Response) => {
    const productData = req.body;
    
    // Replace console.log with proper logging
    logger.info('Creating product', { 
      productName: productData.name,
      productType: productData.type 
    });
    
    const result = await this.model.createProduct(productData);
    
    return this.sendSuccess(res, result, "Product created successfully", 201);
  });

  /**
   * Update product - uses base implementation
   */
  updateProduct = this.update;

  /**
   * Delete product - uses base implementation
   */
  deleteProduct = this.delete;

  /**
   * Required fields for product creation
   */
  protected getRequiredFields(): string[] {
    return ['name', 'price']; // Adjust based on your product schema
  }
}

// Export without BindMethods as BaseController handles method binding
export default new ProductController();