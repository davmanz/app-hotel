import express from "express";
import session from "express-session";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import indexRoutes from './routes/index_routes.js';
import 'dotenv/config';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Configuración de la sesión
app.use(session({
  secret: process.env.SECRET, // Asegúrate de que SECRET esté definida en tu archivo .env
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Solo envía cookies sobre HTTPS, la opción secure en true solo funciona sobre HTTPS
    httpOnly: true, // Hace que la cookie sea inaccesible para los scripts del lado del cliente
    sameSite: 'strict' // Restringe cómo se envían las cookies con solicitudes entre sitios
  }
}));

// Rutas
app.use(indexRoutes);

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, "/views/pages"));
app.set('view engine', 'ejs');

// Iniciar el servidor
app.listen(app.get('port'), () => console.log('Server numero', app.get('port')));
