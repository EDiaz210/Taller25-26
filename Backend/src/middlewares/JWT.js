import jwt from "jsonwebtoken"
import Jugador from "../models/Jugador.js"

const crearTokenJWT = (id, rol) => {

    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        console.log("No hay token");
        return res.status(401).json({ msg: "Acceso denegado: token no proporcionado o inválido" });
    }

    try {
        const token = authorization.split(" ")[1];
        console.log("Token recibido:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded);

        const { id, rol } = decoded;

        if (rol === "jugador") {
            req.jugadorBDD = await Jugador.findById(id).lean().select("-password");
            return next();
        }

        return res.status(403).json({ msg: "Rol no autorizado" });

    } catch (error) {
        console.log("Error verificando token:", error.message);
        return res.status(401).json({ msg: "Token inválido o expirado" });
    }
};




export { 
    crearTokenJWT,
    verificarTokenJWT 
}
