import { Router } from "express";
import * as AS from "./account.service.js";
import * as VA from "./account.validation.js";

import { authorization } from "../../common/middleware/authorization.js";
import { authentication } from "../../common/middleware/authentication.js";
import { RoleEnum } from "../../common/enum/user.enum.js";
import { validation } from "../../common/middleware/validation.js";
const accountRouter = Router();

accountRouter.post(
  "/create",
  authentication,
  validation(VA.accountDataSchema),
  AS.createAccount,
);

accountRouter.get(
  "/me",
  authentication,
  authorization(RoleEnum.user),
  AS.MyAccount,
);

export default accountRouter;
