import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import Jugadores from "../models/Jugador.js"
import mongoose from "mongoose"

const registro = async (req,res)=>{
    const {email,password} = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({
        msg:"Lo sentimos, debes llenar todos los campos"
    })

    const verificarEmailBDD = await Jugadores.findOne({ email });
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
    }

    const nuevojugador = new Jugadores(req.body)
    nuevojugador.password = await nuevojugador.encrypPassword(password)

    const token = nuevojugador.crearToken()
    await sendMailToRegister(email,token)
    await nuevojugador.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const confirmarEmail = async (req,res)=>{
    if(!(req.params.token)) 
        return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"
    })

    const jugadorBDD = await Jugadores.findOne({token:req.params.token});

    if(!jugadorBDD?.token) 
        return res.status(404).json({msg:"La cuenta ya ha sido confirmada"
    })

    jugadorBDD.token = null
    jugadorBDD.confirmEmail=true

    await jugadorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

const recuperarPassword = async (req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json(
        {msg:"Lo sentimos, debes llenar todos los campos"}
    )
    const jugadorBDD = await Jugadores.findOne({email});
    if(!jugadorBDD) return res.status(404).json(
        {msg:"Lo sentimos, el usuario no se encuentra registrado"}
    )
    const token = jugadorBDD.crearToken()
    jugadorBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await jugadorBDD.save()
    res.status(200).json({
        msg:"Revisa tu correo electrónico para reestablecer tu cuenta"}
    )

}
const comprobarTokenPassword = async (req,res)=>{ 
    const {token} = req.params
    const jugadorBDD = await Jugadores .findOne({token})
    if(jugadorBDD?.token !== token) return res.status(404).json(
        {msg:"Lo sentimos, no se puede validar la cuenta"}
    )

    await jugadorBDD.save()
    res.status(200).json(
        {msg:"Token confirmado, ya puedes crear tu nuevo password"}
    ) 
}
const crearNuevaPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json(
        {msg:"Lo sentimos, debes llenar todos los campos"}
    )
    if(password !== confirmpassword) return res.status(404).json(
        {msg:"Lo sentimos, los passwords no coinciden"}
    )
    const jugadorBDD = await Jugadores.findOne({token:req.params.token})
    if(jugadorBDD?.token !== req.params.token) return res.status(404).json(
        {msg:"Lo sentimos, no se puede validar la cuenta"}
    )
    jugadorBDD.token = null
    jugadorBDD.password = await jugadorBDD.encrypPassword(password)
    await jugadorBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

const login = async(req,res)=>{

    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json(
        {msg:"Lo sentimos, debes llenar todos los campos"}
    )
    const jugadorBDD = await Jugadores.findOne({email}).select("-status -__v -token -updatedAt -createdAt")

    if(jugadorBDD?.confirmEmail === false) return res.status(401).json(
        {msg:"Lo sentimos tu cuenta aun no ha sido verificada"}
    )
    if(!jugadorBDD) return res.status(404).json(
        {msg:"Usuario no registrado"}
    )
    const verificarPassword = await jugadorBDD.matchPassword(password)

    if(!verificarPassword)res.status(401).json(
        {msg:"Contraseña incorrecta"}
    )

    const {nombre,apellido,username,_id,rol} = jugadorBDD
    const token =crearTokenJWT(jugadorBDD._id, jugadorBDD.rol)
    res.status(200).json({
        token,
        rol,
        nombre,
        apellido,
        username,
        _id,
        email:jugadorBDD.email
    })

}
const perfil =(req,res)=>{
	const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.jugadorBDD
    res.status(200).json(datosPerfil)
}
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    const {nombre,apellido,username,email} = req.body
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json(
        {msg:`Lo sentimos, debe ser un id válido`}
    );
    if (Object.values(req.body).includes("")) return res.status(400).json(
        {msg:"Lo sentimos, debes llenar todos los campos"}
    )
    const jugadorBDD = await Jugadores.findById(id)
    if(!jugadorBDD) return res.status(404).json(
        {msg:`Lo sentimos, no existe el veterinario ${id}`}
    )
    if (jugadorBDD.email != email)
    {
        const jugadorBDDMail = await Jugadores.findOne({email})
        if (jugadorBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el email existe ya se encuentra registrado`})  
        }
    }
    jugadorBDD.nombre = nombre ?? jugadorBDD.nombre
    jugadorBDD.apellido = apellido ?? jugadorBDD.apellido
    jugadorBDD.username = username ?? jugadorBDD.username
    jugadorBDD.email = email ?? jugadorBDD.email
    await jugadorBDD.save()
    res.status(200).json(
        {msg:"Perfil actualizado correctamente"}
    )
    console.log(jugadorBDD)
    res.status(200).json(jugadorBDD)
}

const actualizarPassword = async (req,res)=>{
    const{presentpassword,newpassword} = req.body
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    const jugadorBDD = await Jugadores.findById(req.jugadorBDD._id)
    if(!jugadorBDD) return res.status(404).json(
        {msg:`Lo sentimos, no existe el veterinario ${id}`}
    )
    const verificarPassword = await jugadorBDD.matchPassword(presentpassword)
    if(!verificarPassword) return res.status(404).json(
        {msg:"Lo sentimos, el password actual no es el correcto"}
    )
    jugadorBDD.password = await jugadorBDD.encrypPassword(newpassword)
    await jugadorBDD.save()
    res.status(200).json(
        {msg:"Password actualizado correctamente"}
    )
}

export {
    registro,
    confirmarEmail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevaPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
}