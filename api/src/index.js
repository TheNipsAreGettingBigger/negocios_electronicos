import express from "express";
import cors from "cors";
import bodyParserErrorHandler from "express-body-parser-error-handler";
import routerApi from "./routes/index.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParserErrorHandler());
app.use(cors());

routerApi(app);

app.listen(port, () => {
  console.log("Listening on port " + port + " -> http://localhost:" + port);
});
