import { Router } from "express";
import * as TS from "./transaction.service.js";
import * as TV from "./transaction.validation.js";
import { authentication } from "../../common/middleware/authentication.js";
import { validation } from "../../common/middleware/validation.js";
import { authorization } from "../../common/middleware/authorization.js";
import { RoleEnum } from "../../common/enum/user.enum.js";

const transactionRouter = Router();

transactionRouter.post(
  "/deposit",
  authentication,
  authorization(RoleEnum.user),
  validation(TV.depositSchema),
  TS.deposit,
);

transactionRouter.post(
  "/withdraw",
  authentication,
  authorization(RoleEnum.user),
  validation(TV.withdrawSchema),
  TS.withdraw,
);

transactionRouter.post(
  "/transfer",
  authentication,
  authorization(RoleEnum.user),
  validation(TV.transferSchema),
  TS.transfer,
);
transactionRouter.get(
  "/me",
  authentication,
  authorization(RoleEnum.user),
  TS.MyAllTransactions,
);

transactionRouter.get(
  "/:id",
  authentication,
  authorization(RoleEnum.user),
  validation(TV.SingleTransactionSchema),
  TS.myTransaction,
);

export default transactionRouter;
