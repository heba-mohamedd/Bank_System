import Joi from "joi";
import { Types } from "mongoose";

export const depositSchema = {
  body: Joi.object({
    accountId: Joi.string().required(),
    amount: Joi.number().positive().min(1).required(),
  }).required(),
};

export const withdrawSchema = {
  body: Joi.object({
    accountId: Joi.string().required(),
    amount: Joi.number().positive().min(1).required(),
  }).required(),
};

export const transferSchema = {
  body: Joi.object({
    accountId: Joi.string().custom((value, helper) => {
      const isValid = Types.ObjectId.isValid(value);
      return isValid ? value : helper.message("inValid id");
    }),
    accountId_To: Joi.string().custom((value, helper) => {
      const isValid = Types.ObjectId.isValid(value);
      return isValid ? value : helper.message("inValid id");
    }),
    transfer_amount: Joi.number().positive().min(1).required(),
  }).required(),
};

export const SingleTransactionSchema = {
  params: Joi.object({
    id: Joi.string().custom((value, helper) => {
      const isValid = Types.ObjectId.isValid(value);
      return isValid ? value : helper.message("inValid id");
    }),
  }).required(),
};
