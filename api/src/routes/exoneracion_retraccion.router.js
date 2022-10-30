import express from "express";
import pool from "./../libs/postgres.pool.js";
const router = express.Router();

router.get("/:ruc", async (req, res) => {
  const { ruc } = req.params;
  console.log(ruc);
  const query = `SELECT * FROM exoneracion_retraccion WHERE ruc = '${ruc}'`;
  const rta = await pool.query(query);
  const responde = !!rta.rowCount;
  return res.json({
    responde,
    info: rta.rows,
  });
});

export default router;
