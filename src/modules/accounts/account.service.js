import * as db_service from "../../DB/db.service.js";
import bankAccountModel from "../../DB/models/bankAccount.model.js";
import userModel from "../../DB/models/user.model.js";
import { successResponse } from "../../common/utils/response.success.js";
import { v4 as uuidv4 } from "uuid";

export const createAccount = async (req, res, next) => {
  const { balance, status, currency } = req.body;
  const userId = req.user._id;
  const accountNumber = uuidv4();
  const userExist = await db_service.findById({
    model: userModel,
    id: userId,
  });

  if (!userExist) {
    throw new Error("User not found", { cause: 404 });
  }

  const account = await db_service.create({
    model: bankAccountModel,
    data: {
      userId,
      accountNumber,
      balance: balance ?? 0,
      status: status ?? true,
      currency: currency ?? "EGP",
    },
  });

  return successResponse({
    res,
    status: 201,
    message: "Account created successfully",
    data: account,
  });
};

export const MyAccount = async (req, res, next) => {
  const { user } = req;

  const accounts = await db_service.find({
    model: bankAccountModel,
    filter: { userId: user._id },
  });
  if (accounts.length < 1) {
    return successResponse({
      res,
      message: "No accounts found",
    });
  }

  return successResponse({
    res,
    message: "Accounts fetched successfully",
    data: accounts,
  });
};
