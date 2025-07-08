import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";

const Table = () => {

    const { fetchDataBackend } = useFetch()
    const [users, setUsers] = useState([])

    const listUsuarios = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios`
        const storedUser = JSON.parse(localStorage.getItem("auth-token"))
        const headers= {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser.state.token}`,
        }
        const response = await fetchDataBackend(url, null, "GET", headers)
        setUsers(...users, response)
    }

    useEffect(() => {
        listUsuarios()
    }, [])


    if (users.length === 0) {
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">No existen registros</span>
            </div>
        )
    }

    return (

        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre mascota", "Nombre propietario", "Email", "Celular", "Estado", "Acciones"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {
                    users.map((users, index) => (
                        <tr className="hover:bg-gray-300 text-center"
                            key={users._id}>
                            <td>{index + 1}</td>
                            <td>{users.nombreMascota}</td>
                            <td>{users.nombreUsuario}</td>
                            <td>{users.emailUsuario}</td>
                            <td>{users.celularUsuario}</td>
                            <td>
                                <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{users.estadoMascota && "activo"}</span>
                            </td>
                            <td className='py-2 text-center'>
                                <MdPublishedWithChanges
                                    title="Actualizar"
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-blue-600"
                                />

                                <MdInfo
                                    title="Más información"
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-green-600"
                                />

                                <MdDeleteForever
                                    title="Eliminar"
                                    className="h-7 w-7 text-red-900 cursor-pointer inline-block hover:text-red-600"
                                />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default Table
