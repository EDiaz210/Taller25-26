
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import storeAuth from "../../context/storeAuth"
import storeProfile from "../../context/storeProfile"
import { useState } from "react";

const FormularioPerfil = () => {

    const {user} = storeProfile() 

    const [showDatos, setShowDatos] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const id = storeAuth(state => state.id)
    const token = storeAuth(state => state.token);
    const updatePasswordUser = async (data) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/jugador/${id}`;
            const response = await axios.put(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
            toast.success(response.data.msg);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || 'Error al actualizar contraseña');
        }
    };

    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit(updatePasswordUser)}>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Nombre</label>
                    <input
                        type={showDatos ? 'text' : 'nombre'}
                        defaultValue={user?.nombre}
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("nombre", { required: "El nombre es obligatorio" })}
                    />
                    {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Apellido</label>
                    <input
                        type={showDatos ? 'text' : 'apellido'}
                        defaultValue={user?.apellido}
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("apellido", { required: "El apellido es obligatorio" })}
                    />
                    {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Usuario</label>
                    <input
                        type={showDatos ? 'text' : 'username'}
                        defaultValue={user?.username}
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("username", { required: "El usuario es obligatorio" })}
                    />
                    {errors.username && <p className="text-red-800">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                    <input
                        type={showDatos ? 'text' : 'email'}
                        defaultValue={user?.email}
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "El correo no es válido"
                            }
                        })}
                    />
                    {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                </div>

                <button
                    onClick={() => setShowDatos(!showDatos)}
                    type="submit"
                    className='bg-gray-800 w-full p-2 mt-5 text-slate-300 uppercase font-bold rounded-lg 
                        hover:bg-gray-600 cursor-pointer transition-all'
                >
                    Actualizar
                </button>

            </form>
        </>
    );
};

export default FormularioPerfil;
