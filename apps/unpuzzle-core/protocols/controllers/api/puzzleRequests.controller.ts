import { Request, Response } from "express";
import { BindMethods } from "../../utility/BindMethods";

class PuzzleRequestController {
  constructor() {}

  getPuzzleRequest = async (req: Request, res: Response) => {};
}

const binding = new BindMethods(new PuzzleRequestController());
export default binding.bindMethods();
