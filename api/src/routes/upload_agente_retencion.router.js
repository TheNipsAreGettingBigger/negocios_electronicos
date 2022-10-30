import sequelize from "./../libs/sequelize.js";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PATH_FILE = join(__dirname, "../..", "AgenRet_TXT.txt");

const insertAgenteRetencion = async () => {
  await sequelize.authenticate();
  const file = readline.createInterface(fs.createReadStream(PATH_FILE));
  const agentes = [];
  file.on("line", (line) => {
    agentes.push(line.split("|").slice(0, -1));
  });
  file.on("close", async () => {
    await sequelize.query(
      "TRUNCATE TABLE exoneracion_retraccion RESTART IDENTITY"
    );
    const [, ...data] = agentes;
    await sequelize.query({
      query:
        "INSERT INTO exoneracion_retraccion (ruc,razon,a_partir_del,resolucion) VALUES ?",
      values: [data],
    });
  });
};

insertAgenteRetencion();
