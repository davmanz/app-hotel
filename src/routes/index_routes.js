import { Router, query } from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import { formartDate } from "../js/formatDate.js";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { hashPassword, checkPassword } from "../js/hashpass.js";
import {
  loginUser,
  searchContracs,
  monthPending,
  loginAdmin,
} from "../js/connection.js";

const storage = multer.memoryStorage();
const upload_img = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 },
});

//Instancia de Rutas
const router = Router();

// Ruta Base
router.get("/", (req, res) => res.render("index"));

//*****************************************************************************//
//                                                                             //
//                           INICIOS DE SESION                                 //
//                                                                             //
//*****************************************************************************//

//********************//
//                    //
//  USUARIOS BASICOS  //
//                    //
//********************//

router.get("/logusr", (req, res) => res.render("logusr"));

router.post("/logusr", async (req, res) => {
  const data_usr = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await loginUser(data_usr.email, data_usr.password);
    if (user) {
      delete user.password_hash;
      delete user.admin;
      delete user.active;
      req.session.user = user; // Aquí 'user' contiene los datos del usuario
      res.redirect("/prfl_user"); // Si todo es correcto, redirigir al índice o dashboard
    } else {
      res.send({
        success: false,
        message: "Correo electrónico o contraseña incorrecta.",
      });
    }
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: "Error al procesar la solicitud." });
  }
});

//********************//
//                    //
//  ADMINISTRADORES   //
//                    //
//********************//

router.get("/logadm", (req, res) => res.render("logadm"));

router.post("/logadm", async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nickname, password } = req.body;

  try {
    // Comprobar credenciales
    const passwordValid = await loginAdmin(nickname, password);

    if (true) {
      console.log(passwordValid.success);
      res.redirect("/panel");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

//*****************************************************************************//
//                                                                             //
//                           PANEL DE USUARIO                                  //
//                                                                             //
//*****************************************************************************//

router.get("/prfl_user", (req, res) => {
  if (req.session.user) {
    // Renderizar la página de perfil con los datos del usuario
    res.render("prfl_user", { user_data: req.session.user.user });
  } else {
    // Redirigir al login si no hay datos de sesión
    res.redirect("/");
  }
});


//*****************************************************************************//
//                                                                             //
//                           CONSULTAS AL SERVIDOR                             //
//                                                                             //
//*****************************************************************************//

//********************//
//                    //
//  DATO DE CONTRATOS //
//                    //
//********************//

router.get("/vwctrt/:searchDoc", async (req, res) => {
  try {
    const contractInfo = await searchContracs(req.params.searchDoc);

    // Verifica si se encontraron resultados
    if (Object.keys(contractInfo).length > 0) {
      // Formatear las fechas antes de enviar
      contractInfo.contract_start_date = formartDate(
        contractInfo.contract_start_date
      );
      contractInfo.contract_end_date = formartDate(
        contractInfo.contract_end_date
      );

      // Enviar el primer resultado, suponiendo que el número de documento es único
      res.json({ success: true, data: contractInfo });
    } else {
      // No se encontraron resultados, enviar mensaje correspondiente
      res.json({ success: false, message: "Documento no encontrado." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

//********************//
//                    //
// ULTIMO MES PAGADO  //
//                    //
//********************//
router.get("/pdmth/:MonthUnPaid", async (req, res) => {
  try {
    // Validar el parámetro MonthUnPaid aquí si es necesario...
    let data = await monthPending(req.params.MonthUnPaid);

    if (data.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No se encontraron datos para el mes proporcionado",
        });
    }

    const paidDate = new Date(data[0].paid_date);
    const year = paidDate.getUTCFullYear(); // Año
    const month = String(paidDate.getUTCMonth() + 1).padStart(2, "0"); // Mes
    data[0].paid_date = `${year}-${month}`;

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error("Error en el endpoint /pdmth/:MonthUnPaid", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;
