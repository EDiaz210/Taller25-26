import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import storeAuth from "../../context/storeAuth"

const CardPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const id = storeAuth(state => state.id)
    const token = storeAuth(state => state.token);
    const updatePasswordUser = async (data) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/jugador/actualizarpassword/${id}`;
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
            <div className='mt-5'>
                <ToastContainer />
                <h1 className='font-black text-2xl text-gray-500 mt-16'>Actualizar contraseña</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
            </div>

            <form onSubmit={handleSubmit(updatePasswordUser)}>
                <div>
                    <label className="mb-2 block text-sm font-semibold">Contraseña actual</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña actual"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("presentpassword", { required: "La contraseña actual es obligatoria" })}
                    />
                    {errors.contraseniaActual && <p className="text-red-800">{errors.contraseniaActual.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa la nueva contraseña"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        {...register("newpassword", { required: "La nueva contraseña es obligatoria" })}
                    />
                    {errors.contraseniaNueva && <p className="text-red-800">{errors.contraseniaNueva.message}</p>}
                </div>

                <div className="flex gap-4">

                    <button
                        type="submit"
                        onClick={() => setShowPassword(!showPassword)}
                        className="bg-gray-800 w-full p-2 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
                    >
                        Cambiar
                    </button>
                </div>
            </form>
        </>
    );
};

export default CardPassword;
