import express from "express";
import ExoRetraccionRouter from "./exoneracion_retraccion.router.js";

export default (app) => {
  const router = express.Router();
  router.use("/exoneracion-retraccion", ExoRetraccionRouter);
  app.use("/api", router);
};
