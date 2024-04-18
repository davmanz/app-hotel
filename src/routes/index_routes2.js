import { Router, query } from 'express';
import { getDocumentTypes,
  storeUserWithImage,
  update_bd,
  searchUser,
  storeContract,
  read_bd,
  deleteUser,
  searchContracs,
  logadmr,
  insert_bd} from '../js/connection.js';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {formartDate} from '../js/formatDate.js';
import {fileURLToPath} from "url";
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import {hashPassword, checkPassword} from '../js/hashpass.js';

// Configuración de almacenamiento para Multer
const storage = multer.memoryStorage();
const upload_img = multer({ storage: storage,
  limits: {fileSize: 4 * 1024 * 1024}
});

//Instancia de Rutas
const router = Router();
//------------------------------ GET -----------------------------------------------------
// Ruta Base
router.get('/', (req , res) => res.render('index'));

// Ruta Login Administradores
router.get('/logadm', (req, res) => res.render('login_adm'));

// Ruta Login Usuarios
router.get('/logusr', (req , res) => res.render('login_usr'));

//ENDPOINTS Perfil Clientes Usuarios*****************************************************
// Ruta Perfil Usuario
router.get('/prfl_user', (req, res) => {

  if (req.session.user) {
    // Renderizar la página de perfil con los datos del usuario
    res.render('prfl_user', { user_data: req.session.user });
  } else {
    // Redirigir al login si no hay datos de sesión
    res.redirect('/');
  };

});

//ENDPOINT PANEL DE ADMINITRACION*******************************************************
// 1 - Ruta Panel de Adminitracion
router.get('/panel', (req, res) => res.render('panel'));

//ENDPOINTS Adminitracion de Usuarios***************************************************
// 1 - Ruta Admin Creacion Usuario------------
router.get('/addusr', async (req, res) => {
  try {
      const documentTypes = await getDocumentTypes();
      res.render('add_usr', { 
          title: 'Agregar Usuario',
          documentTypes // Asegúrate de que esta línea está presente
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

//Ruta Exito de Creacion
router.get('/success', (req, res) => {res.render('success', { userData: req.session.successUsr});});

// 2 - Ruta Admin Ver Usuarios--------------
router.get('/vwusr', (req, res) => res.render('view_usr'));

//Ruta LLamada Usuarios Visualisacion de datos
router.get('/vwusr/:searchUser', async (req, res) => {
  try {
    const docNum = req.params.searchUser;
    const userInfo = await searchUser(docNum);
    
    // Verifica si se encontraron resultados
    if (userInfo.length > 0) {
      // Enviar el primer resultado, suponiendo que el número de documento es único
      res.json({ success: true, data: userInfo });
    } else {
      // No se encontraron resultados, enviar mensaje correspondiente
      res.json({ success: false, message: 'Documento no encontrado.' });
    }

  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

//Llamada a ruta /modusr/:idUser para edicion
router.get('/vwusr/edit/:documentNumber', async (req, res) => {
  
  const docNum = req.params.documentNumber;

  try {
      // Suponiendo que tienes una función para verificar si el documento existe
      const idUser = await read_bd('user_id', 'users', 'document_number', docNum);

      if (idUser.length > 0 ) {
          res.json({ 
              success: true, 
              redirectUrl: `/modusr/${idUser[0].user_id}`
          });
      } else {
        console.log('NO');
          res.json({ 
              success: false, 
              message: 'Documento no encontrado.'
          });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor' 
      });
  }
});

//Ruta Admin Edicion de Usuario
router.get('/modusr/:idUser', async (req, res) => {

  try {
      const idUser= await read_bd(
        'first_name, last_name, email, user_id, document_number, document_type', 
        'users', 
        'user_id ', 
        req.params.idUser 
        );
      const documentTypes = await getDocumentTypes();
      res.render('modify_usr', {
          user: idUser[0],
          documentTypes,
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

// Rutas Exito de operacion
router.get('/success_mod', (req, res) => {res.render('success_mod');});

//ENDPOINTS Adminitracion de Contratos****************************************************

// 1 - Ruta Admin Creacion Contratos---------------
router.get('/crtcontract', (req, res) => res.render('create_contract'));

//Ruta Exito de Creacion
router.get('/sscontract', (req , res) => {res.render('success_contract', {contractData: req.session.contractData});});

// 2 -  Ruta Admin Ver Contratos----------
router.get('/vwctrt', (req, res) => res.render('view_ctrt'));

// Ruta LLamada Contratos Visualisacion de datos
router.get('/vwctrt/:searchDoc', async (req, res) => {
  const contractInfo = await searchContracs(req.params.searchDoc);
  try {
    // Verifica si se encontraron resultados
    if (contractInfo.length > 0) {
      // Formatear las fechas antes de enviar
      contractInfo[0].contract_start_date = formartDate(contractInfo[0].contract_start_date);
      contractInfo[0].contract_end_date = formartDate(contractInfo[0].contract_end_date);

      // Enviar el primer resultado, suponiendo que el número de documento es único
      res.json({ success: true, data: contractInfo[0] });
    } else {
      // No se encontraron resultados, enviar mensaje correspondiente
      res.json({ success: false, message: 'Documento no encontrado.' });
    }

  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// LLamadas segundarias******************************************************************
//Endpoint para insertar imagen
router.get('/show_user_photo/:imageName', (req, res) => {
  const imageName = req.params.imageName; // Obtiene el parámetro de la URL
  res.sendFile('./src/uploads/users/' + imageName, { root: process.cwd() });
});

//Endpoint solcitud de datos en contratos
router.get('/fdocmod/:numDoc', async (req,res) => {

  try {
    const numDoc = req.params.numDoc;
    const dataBd = await read_bd(
      'first_name, last_name, user_id', 
      'users', 
      'document_number' ,
      numDoc
      );
    
    // Verifica si se encontraron resultados
    if (dataBd.length > 0) {
      // Enviar el primer resultado, suponiendo que el número de documento es único
      res.json({ success: true, data: dataBd[0] });
    } else {
      // No se encontraron resultados, enviar mensaje correspondiente
      res.json({ success: false, message: 'Documento no encontrado.' });
    }

  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

//Endponit Para descarga de contrato
router.get('/dwlcontract', (req, res) => {
  const imageName = req.query.imageName;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const parentDirectory = path.join(__dirname, '..');
  const directoryPath = path.join(parentDirectory, 'uploads/contract');


  const filePath = path.join(directoryPath, imageName);
  // Verificar si el archivo existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('El archivo solicitado no fue encontrado en el servidor.');
    }
    
    // Configurar los headers para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename=' + imageName);
    res.setHeader('Content-Transfer-Encoding', 'binary');
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Enviar el archivo para su descarga
    res.download(filePath, imageName, (err) => {
      if (err) {
        console.error("Error al descargar el archivo: ", err);
      }
    });
  });
});

//-----------------------------------------POST----------------------------------------*/

// EndPoint Guardado Usuario en BD
router.post('/addusr', upload_img.single('photo'), async (req, res) => {
  const data_serv ={   
      user_id: uuidv4(),
      name: req.body.name,
      last_name: req.body.last_name,
      document_type: req.body.id_type,
      document_number: req.body.id_number,
      email: req.body.email,
      password: await hashPassword(req.body.password),
      adminCheck: req.body.isAdmin === 'on' ? 1 : 0,
  };

  try {
      if (req.file) {
          const filename = `user-${uuidv4()}${path.extname(req.file.originalname)}`;
          await sharp(req.file.buffer)
              f.toFormat('jpeg')
              .resize(240, 220)
              .toFile(`./src/uploads/users/${filename}`);

          data_serv.imagePath = filename;
      }

      //Para guardar los datos del usuario
      await storeUserWithImage(data_serv);
      req.session.successUsr = data_serv;
      res.redirect('/success');

  } catch (error) {
      console.error(error);
      res.status(400).render('add_usr', { error: error.message });
  }
});

//EndPoint Modificacion Usuario en BD
router.post('/modusr/', upload_img.single('photo'), async (req, res) => {
  const data_serv = {
      user_id: req.body.pswd,
      first_name: req.body.name,
      last_name: req.body.last_name,
      email: req.body.email,
      password_hash: await hashPassword(req.body.password),
      document_id: req.body['id-number'],
      document_type: req.body['id-type'],
  };

  try {
      if (req.file) {
          const filename = `user-${uuidv4()}${path.extname(req.file.originalname)}`;
          await sharp(req.file.buffer)
              .resize(240, 220)
              .toFile(`./src/uploads/users/${filename}`);

          data_serv.personal_photo = filename;
      }

      let updates = {};
      for (const key in data_serv) {
          if (data_serv.hasOwnProperty(key) && key !== 'user_id' && data_serv[key]) {
              updates[key] = data_serv[key];
          }
      }

      if (Object.keys(updates).length > 0) {
          await update_bd('users', updates, 'user_id', data_serv.user_id);
          res.redirect('/success_mod');
      } else {
          res.redirect('/');
      }

  } catch (error) {
      console.error("Error al actualizar el usuario", error);
      res.status(500).send('Ocurrió un error al actualizar el usuario');
  }
});

// EndPoint Guardado Contrato en BD
router.post('/addcontract', async (req, res) => {

  const data_contract ={
    name: req.body.user_name,
    idUser: req.body.pswd,
    startDate: req.body.start_date,
    endDate: req.body.end_date,
    paymentDay: req.body.payment_day,
    rentMount: req.body.rent_amount,
    warranty: req.body.warranty,
    hasWifi: req.body.has_wifi,
    wifiCost: req.body.wifi_cost,
    roomNumber:req.body.room_number,
  };

  try {      
    storeContract(data_contract);

    //Guardar en objeti Global

    req.session.contractData = data_contract

    // Redireccionar a la página de éxito o mostrar un mensaje
    res.redirect('/sscontract');

    } catch (error) {
    console.error(error);
    res.status(400).render('crtcontract', { error: error.message }); // Renderiza de nuevo el formulario con el mensaje de error
  }

  });

  
router.post('/login_adm', async (req, res) => {
  const data_usr = {
    email: req.body.email,
    password: req.body.password
  };
  
  try {
    // Obtener el hash de contraseña, admin y active del usuario desde la base de datos
    const result = await read_bd('*', 'users', 'email', data_usr.email);
     
    // Si no se encuentra el usuario o el resultado está vacío
    if (!result || result.length === 0) {
      return res.send('No Existe Usuario'); // Usuario no encontrado
    };
  
    const user = result[0];
  
    // Comprobar si la contraseña coincide y si el usuario es administrador y está activo
    const isPasswordValid = await checkPassword(data_usr.password, user.password_hash);
    const isAdmin = user.admin === 1;
    const isActive = user.active === 1;
  
    if (isPasswordValid && isAdmin && isActive) {

      delete user.password_hash;
      delete user.personal_photo;
      delete user.document_type;

      req.session.userAdmin = user

      // Si todo es correcto, redirigir al índice o dashboard
      res.redirect('/panel');
    } else {
      // Si algo falla, redirigir a la página de error de login
      res.send('No tienes Permisos de Acceso a la Administracion');
    };
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  };
});

router.post('/login_usr', async (req, res) => {
  const data_usr = {
    email: req.body.email,
    password: req.body.password
  };
  
  try {
    // Obtener el hash de contraseña, admin y active del usuario desde la base de datos
    const result = await logadmr(data_usr.email);
     
    // Si no se encuentra el usuario o el resultado está vacío
    if (!result || result.length === 0) {
      return res.send('No Existe Usuario'); // Usuario no encontrado
    };
  
    const user = result[0];
  
    // Comprobar si la contraseña coincide y si el usuario es administrador y está activo
    const isPasswordValid = await checkPassword(data_usr.password, user.password_hash);
    const isActive = user.active === 1;
  
    if (isPasswordValid && isActive) {

      const doc_type = {
        1:'C.C',
        2:'C.E',
        3:'NIT',
        4:'PASS',
        5:'PPT'
      };
      delete user.password_hash;
      delete user.user_id;
      delete user.admin;
      delete user.active;
      user.document_type = doc_type[user.document_type]
    
      // Guardar los datos del usuario en la sesión
      req.session.user = user; // Aquí 'user' contiene los datos del usuario

      // Si todo es correcto, redirigir al índice o dashboard
      res.redirect('/prfl_user');
    } else {
      // Si algo falla, redirigir a la página de error de login
      res.send('Password or Email error');
    };
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  };
});

router.post('/payment_up', upload_img.single('photo'), async (req, res) => {
  try {
    // Verifica si se cargó un archivo
    if (!req.file) {
      return res.status(400).send('No se cargó ningún archivo.');
    }

    const filename = `${uuidv4()}`;
          await sharp(req.file.buffer)
              .toFormat('jpeg')
              .toFile(`./src/uploads/payments/${filename}.jpeg`);

    // Aquí puedes hacer algo con la imagen procesada, como guardarla en disco o en una base de datos

    const query = `INSERT INTO payment_history(contract_id,upload_date,paid_month,img_payment) VALUES(?,?,?,?)`
    const uploadDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const values = [
      req.body.select_payment,
      uploadDate,
      req.body.month,
      filename
    ]

    await insert_bd(query,values)

    // Finalmente, envía una respuesta al cliente
    res.status(200).send('Archivo cargado y procesado con éxito.');

  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).send('Error interno del servidor.');
  }
});
//-----------------------------------------DELETE----------------------------------------*/
// EndPoint Borrado de Usuarios
router.delete('/deleteuser/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      
      await deleteUser(userId);
      res.redirect('/index');
    
  } catch (error) {
      console.error("Error al eliminar el usuario", error);
      res.status(500).send('Ocurrió un error al eliminar el usuario');
  }
});

export default router;