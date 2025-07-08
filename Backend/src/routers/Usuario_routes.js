import {Router} from 'express'
import { registrarUsuario, listarUsuarios } from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'


const router = Router()
router.post('/usuario/registro',verificarTokenJWT,registrarUsuario)
router.get("/usuarios",verificarTokenJWT,listarUsuarios)


export default router