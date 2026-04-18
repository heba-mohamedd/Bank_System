import Joi from "joi";
import { RoleEnum } from "../../common/enum/user.enum.js";

export const signUpSchema = {
  body: Joi.object({
    fullName: Joi.string().min(4).max(30).trim().required(),

    email: Joi.string().email().required(),

    password: Joi.string()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .message(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      )
      .required(),

    role: Joi.string()
      .valid(...Object.values(RoleEnum))
      .default("user"),
  }).required(),
};

export const signInSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .message(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      )
      .required(),
  }).required(),
};
