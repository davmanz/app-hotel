import mysql from "mysql2";
import util from "util";
import fs from "fs";
const unlinkAsync = util.promisify(fs.unlink);
import path from "path";
import { clear } from "console";
import bcrypt from "bcrypt";

const config = {
  host: "127.0.0.1",
  user: "root",
  password:
    "w6g624x62462ca2fca62nykigmi284bdya3z32228gni28bvdyhsgc3qe4req625f1w984g4w65s4d65454gsff",
  database: "bd_hotel",
};

class Database {
  constructor(config) {
    this.config = config;
    this.pool = mysql.createPool(this.config);
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        this.connection = connection;
        resolve();
      });
    });
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.release();
      this.connection = null;
    }
  }

  async query(sql, params = []) {
    await this.connect();
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  async beginTransaction() {
    await this.connect();
    await this.connection.beginTransaction();
  }

  async commit() {
    await this.connection.commit();
  }

  async rollback() {
    await this.connection.rollback();
  }
}

//*********************************************************************************************************************************************************

const db = new Database(config);

//*****************************************************************************//
//                                                                             //
//                     INICIOS DE SESION USUARIO BASICO                        //
//                                                                             //
//*****************************************************************************//
async function loginUser(email, password) {
  try {
    await db.connect();
    const users = await db.query(
      `
      SELECT u.*, GROUP_CONCAT(c.contract_id) AS contract_ids, dt.name_document FROM users u 
      LEFT JOIN contracts c ON u.user_id = c.user_id
      LEFT JOIN documenttypes dt ON u.document_id = dt.document_id
      WHERE u.email = ? 
      GROUP BY u.user_id;`,
      [email]
    );

    if (users.length === 0) {
      // No se encontró el usuario con el correo dado
      return { success: false, message: "Usuario no encontrado." };
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // La contraseña coincide, el usuario está autenticado
      return {
        success: true,
        user: user,
        message: "Usuario autenticado correctamente.",
      };
    }
  } catch (error) {
    // Manejo de errores durante la conexión a la base de datos o el proceso de consulta
    console.error("Error al autenticar al usuario:", error);
    return {
      success: false,
      message: "Error al procesar la solicitud de inicio de sesión.",
    };
  } finally {
    await db.disconnect();
  }
}

//*****************************************************************************//
//                                                                             //
//                    INICIOS DE SESION DE ADMINISTRADORES                     //
//                                                                             //
//*****************************************************************************//
async function loginAdmin(nickname, password){

  try {
    await db.connect();
    const userAdmin = await db.query(
      `
      SELECT * FROM admins WHERE nickname = ? `,
      [nickname]
    );

    if (userAdmin.length === 0) {
      // No se encontró el usuario con el correo dado
      return { success: false, message: "Usuario no encontrado." };
    };

    const match = await bcrypt.compare(password, userAdmin[0].password_hash);

    if (match) {
      // La contraseña coincide, el usuario está autenticado
      return {
        success: true,
        data: userAdmin[0],
        message: "Usuario administrador autenticado correctamente.",
      };
    }
  } catch (error) {
    // Manejo de errores durante la conexión a la base de datos o el proceso de consulta
    console.error("Error al autenticar al usuario:", error);
    return {
      success: false,
      message: "Error al procesar la solicitud de inicio de sesión.",
    };
  } finally {
    await db.disconnect();
  }

}

//*****************************************************************************//
//                                                                             //
//                       CONSULTA DE DATOS DE CONTRATOS                        //
//                                                                             //
//*****************************************************************************//
async function searchContracs(num) {
  try {
    await db.connect();
    const dataContract = await db.query(
      `
      SELECT * FROM contracts crt
      WHERE crt.contract_id = ?`,
      [num]
    );
    if (dataContract.length === 0) {
      // No se encontró el usuario con el correo dado
      return { 
        success: false, 
        message: "Contrato no encontrado." };
    };
      return dataContract[0]

  } catch (error) {
    // Manejo de errores durante la conexión a la base de datos o el proceso de consulta
    console.error("Error al buscar el Contrato:", error);
    return {
      success: false,
      message: "Error al procesar la solicitud de inicio de sesión.",
    };
  } finally {
    await db.disconnect();
  }
}

//*****************************************************************************//
//                                                                             //
//                          CONSULTA DE MESES PAGADOS                          //
//                                                                             //
//*****************************************************************************//
async function monthPending(crt) {
  try {
    await db.connect();
    const pending = await db.query(
      `SELECT paid_date, validate, refused 
      FROM payment_history
      WHERE contract_id = ?
      ORDER BY paid_date DESC
      LIMIT 1;
      `,
      [crt]
    );
    return pending;
  } catch (error) {
    // Manejo de errores durante la conexión a la base de datos o el proceso de consulta
    console.error("Error al consultar la Base de Datos", error);
    return {
      success: false,
      message: "Error al consultar la Base de Datos",
    };
  } finally {
    db.disconnect();
  }
}

export { loginUser, searchContracs, monthPending, loginAdmin};
