import Usuario from "../models/usuarios.js"
import mongoose from "mongoose"
import { sendMailToOwner } from "../config/nodemailer.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"
import usuarios from "../models/usuarios.js"

const registrarUsuario = async (req,res ) => { 
    //1
    const {emailUsuario} = req.body
    //2
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Usuario.findOne({emailUsuario})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //3
    const password = Math.random().toString(36).toUpperCase().slice(2, 5)
    const nuevoUsuario = new Usuario({
        ...req.body,
        passwordUsuario:await Usuario.prototype.encrypPassword(password),
        jugador: req.jugadorBDD._id
    })
    if(req.files?.imagen){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'Jugador'})
        nuevoUsuario.avatarMascota = secure_url
        nuevoUsuario.avatarMascotaID = public_id
        await fs.unlink(req.files.imagen.tempFilePath)
    }
    await nuevoUsuario.save()
    //4
    res.status(201).json({msg:"Registro exitoso y correo enviado al propietario"})
}

const listarUsuarios = async (req,res)=>{
    const usuarios = await Usuario.find({estadoMascota:true}).where('jugador').equals(req.jugadorBDD).select("-salida -createdAt -updatedAt -__v").populate('jugador','_id nombre apellido')
    res.status(200).json(usuarios)
}


export{
    registrarUsuario,
    listarUsuarios
}
