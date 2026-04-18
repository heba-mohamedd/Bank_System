import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { validation } from "../../common/middleware/validation.js";

const userRouter = Router();

userRouter.post("/signup", validation(UV.signUpSchema), US.signUp);
userRouter.post("/signin", validation(UV.signInSchema), US.signIn);

export default userRouter;
