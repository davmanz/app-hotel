import { Router, query } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
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

//Instancia de Rutas
const router = Router();

// Ruta Base
router.get("/", (req, res) => res.render("index"));

//*****************************************************************************//
//                                                                             //
//                              MIDDLEWARES                                    //
//                                                                             //
//*****************************************************************************//
//********************//
//    CHECK TOKEN     //
//********************//
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Formato Bearer <token>
  if (!token)
    return res.status(401).send("Acceso Denegado. No hay token provisto.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Token inválido.");
  }
}

//********************//
//     CHECK ADMIN    //
//********************//
function checkAdmin(req, res, next) {
  // Verificar si el usuario es admin desde la sesión o las cookies
  try {
    const isAdmin = req.session.userAdmin.data.isAdmin;
    if (!isAdmin) {
      // Si el usuario no es admin, puedes responder con un error o redirigir
      return res
        .status(403)
        .send("Acceso denegado, se requiere ser administrador");
    }

    // Si el usuario es admin, continua con el siguiente middleware
    next();
  } catch {
    return res
      .status(403)
      .send("Acceso denegado, se requiere ser administrador");
  }
}

//********************//
// GESTION DE MULTER  //
//********************//
const storage = multer.memoryStorage();
const upload_img = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 },
});

//*****************************************************************************//
//                                                                             //
//                INICIOS DE SESION USUARIO BASICOS                            //
//                                                                             //
//*****************************************************************************//
//********************//
//    INICIO SESION   //
//********************//
router.get("/logusr", (req, res) => res.render("logusr"));

router.post("/logusr", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    if (user.success) {
      delete user.password_hash;

      req.session.user = user; // Aquí 'user' contiene los datos del usuario
      res.redirect("/prfluser"); // Si todo es correcto, redirigir al índice o dashboard
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
//  PANEL DE USUARIO  //
//********************//
router.get("/prfluser", (req, res) => {
  if (req.session.user) {
    // Renderizar la página de perfil con los datos del usuario
    res.render("prfluser", { user_data: req.session.user.user });
  } else {
    // Redirigir al login si no hay datos de sesión
    res.redirect("/");
  }
});

//*****************************************************************************//
//                                                                             //
//               INICIOS DE SESION DE ADMINISTRADORES                          //
//                                                                             //
//*****************************************************************************//
//********************//
//   INICIO SESION    //
//********************//
router.get("/logadm", (req, res) => res.render("logadm"));

router.post("/logadm", async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // Comprobar credenciales
    const userAdmin = await loginAdmin(nickname, password);

    if (userAdmin.success) {
      delete userAdmin.password_hash;
      delete userAdmin.id;
      userAdmin.data.isAdmin = true;
      req.session.userAdmin = userAdmin;
      res.redirect("/panel");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

//********************//
//   PANEL DE ADMIN   //
//********************//
router.get("/panel", checkAdmin, (req, res) => res.render("paneladmin"));

//*****************************************************************************//
//                                                                             //
//                            RUTA CREAR USUARIOS                              //
//                                                                             //
//*****************************************************************************//

router.get("/panel/addusr", checkAdmin, (req, res) => {
  res.render("addusr");
});

router.post("/panel/addusr", upload_img.single("photo"), async (req, res) => {

  const dataUser ={   
      user_id: uuidv4(),
      name: req.body.name,
      last_name: req.body.last_name,
      document_type: req.body.id_type,
      document_number: req.body.id_number,
      email: req.body.email,
      phone: req.body.phone,
      password: await hashPassword(req.body.password),
      r_person_a: req.body.r_person_a,
      r_person_a_phone: req.body.r_person_a_phone,
      r_person_b: req.body.r_person_b,
      r_person_b_phone: req.body.r_person_b_phone
  };
  
  try {
    if (req.file) {
      const filename = `user-${uuidv4()}${path.extname(req.file.originalname)}`;
      await sharp(req.file.buffer)
      f.toFormat('jpeg')
      .resize(240, 220)
      .toFile(`./src/uploads/users/${filename}`);
      dataUser.imagePath = filename;
    }
    else{
      //dataUser.imagePath = `../uploads/users/user_default.png`;
      dataUser.imagePath = path
    };

    console.log(dataUser);

    /*
    //Para guardar los datos del usuario
    await storeUserWithImage(data_serv);
    req.session.successUsr = data_serv;
    res.redirect('/success');
    */
  } catch (error) {
      console.error(error);
      res.status(400).render('add_usr', { error: error.message });
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
      return res.status(404).json({
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
