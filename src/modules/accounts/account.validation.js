import Joi from "joi";

export const accountDataSchema = {
  body: Joi.object({
    // userId: Joi.string().custom((value, helper) => {
    //   const isValid = Types.ObjectId.isValid(value);
    //   return isValid ? value : helper.message("inValid id");
    // }),
    balance: Joi.number().min(0).default(0),
    status: Joi.boolean().default(true),
    currency: Joi.string().default("EGP"),
  }).required(),
};
