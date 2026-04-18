import express from "express";
import { PORT } from "../config/config.service.js";
import checkConnectionDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import accountRouter from "./modules/accounts/account.controller.js";
import transactionRouter from "./modules/transactions/transaction.controller.js";

const app = express();
const port = PORT;
const bootstrap = async () => {
  app.use(express.json());
  app.get("/", (req, res) => res.json({ message: "wellcome in social App" }));

  checkConnectionDB();

  app.use("/users", userRouter);
  app.use("/accounts", accountRouter);
  app.use("/transactions", transactionRouter);

  app.use("{/*demo}", (req, res, next) => {
    throw new Error(`URL ${req.originalUrl} Not Found ....`, { cause: 404 });
  });

  app.use((err, req, res, next) => {
    res
      .status(err.cause || 500)
      .json({ message: err.message, stack: err.stack });
  });
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

export default bootstrap;
