import mongoose, {Schema,model} from 'mongoose'
import bcrypt from "bcryptjs"

const usuarioSchema = new Schema({
    nombreUsuario:{
        type:String,
        required:true,
        trim:true
    },
    cedulaUsuario:{
        type:String,
        required:true,
        trim:true
    },
    celularUsuario:{
        type:String,
        trim:true,
        required:true
    },
    nombreMascota:{
        type:String,
        required:true,
        trim:true
    },
    emailUsuario:{
        type:String,
        required:true,
        trim:true,
		unique:true
    },
    passwordUsuario:{
        type:String,
        required:true
    },
    avatarMascota:{
        type:String,
        trim:true
    },
    avatarMascotaID:{
        type:String,
        trim:true
    },
    avatarMascotaIA:{
        type:String,
        trim:true
    },
    tipoMascota:{
        type:String,
        required:true,
        trim:true
    },
    fechaNacimientoMascota:{
        type:Date,
        required:true,
        trim:true
    },
    sintomasMascota:{
        type:String,
        required:true,
        trim:true
    },
    fechaIngresoMascota:{
        type:Date,
        required:true,
        trim:true,
        default:Date.now
    },
    salidaMascota:{
        type:Date,
        trim:true,
        default:null
    },
    estadoMascota:{
        type:Boolean,
        default:true
    },
    rol:{
        type:String,
        default:"usuario"
    },
    jugador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Jugadores'
    }

},{
    timestamps:true
})

// Método para cifrar el password del usuario
usuarioSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
// Método para verificar si el password ingresado es el mismo de la BDD
usuarioSchema.methods.matchPassword = function(password){
    return bcrypt.compare(password,this.password)
}

export default model('usuario',usuarioSchema)