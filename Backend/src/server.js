//Requerir modulos
import express from "express"; //framework
import dotenv from "dotenv";
import cors from "cors"; //sirve para conectar el backend y frontend con codigo de area
import routerJugadores from './routers/Jugador_routes.js'
import routerUsuario from './routers/Usuario_routes.js'
import cloudinary from 'cloudinary'
import fileupload from 'express-fileupload'


//Inicializaciones
const app = express()
dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(fileupload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

//Configuraciones
app.set('port', process.env.PORT || 3000) 
//app.set('port', process.env.CLOUDINARY || 3000) //process es paara datos sensibles
app.use(cors())

//MiddLewares
app.use(express.json()) //guarda la informacion del frontend en un archivo json para procesar el backend

//Rutas
app.get('/',(req,res)=>{
    res.send("Server on")
})

// Rutas para jugadores
app.use('/api',routerJugadores)

// Rutas para usuario
app.use('/api',routerUsuario)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


//Exportar la instancia
export default app

//EL uso del archivo no es muy usado pero es necesario