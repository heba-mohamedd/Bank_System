import userModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/db.service.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import {
  ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY,
  SALT_ROUNDS,
} from "../../../config/config.service.js";
import { successResponse } from "../../common/utils/response.success.js";
import { GenerateToken } from "../../common/utils/token.service.js";

export const signUp = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const userExist = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (userExist) {
    throw new Error("email already exist", { cause: 409 });
  }

  const user = await db_service.create({
    model: userModel,
    data: {
      fullName,
      email,
      password: await Hash({ plainText: password, salt_rounds: SALT_ROUNDS }),
    },
  });

  successResponse({
    res,
    status: 201,
    data: { message: "success" },
  });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const userExist = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (!userExist) {
    throw new Error("user not exist", { cause: 404 });
  }

  const isMatch = await Compare({
    plainText: password,
    cipherText: userExist.password,
  });
  if (!isMatch) {
    return next(new Error("Invalid email or password", { cause: 401 }));
  }

  const accessToken = GenerateToken({
    payload: { id: userExist._id, email: userExist.email },
    secret_key: ACCESS_SECRET_KEY,
    options: { expiresIn: "1h" },
  });

  const refreshToken = GenerateToken({
    payload: { id: userExist._id, email: userExist.email },
    secret_key: REFRESH_SECRET_KEY,
    options: { expiresIn: "7d" },
  });

  return successResponse({
    res,
    status: 200,
    message: "logged in successfully",
    data: { accessToken, refreshToken },
  });
};
