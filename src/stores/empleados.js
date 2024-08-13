
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useEmpleadosStore = defineStore("empleados", () => {
    let loading = ref(false);
    const useUsuario = useAdministradorStore();
    let empleados = ref({
        nombre: '',
        documento: '',
        direccion: '',
        correo: '',
        telefono: '',
        estudios: '',
        fechaNacimiento: '',
        descripcion: '',
        fechaContrato: ''

    });
    const empleado = ref([]);

    let getEmpleados = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/empleados/listar`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            empleado.value = res.data.empleados || [];
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getEmpleadosActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/empleados/listaractivados`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            empleado.value = res.data.activados || [];
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getEmpleadosInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/empleados/listardesactivados`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            empleado.value = res.data.desactivados || [];
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getEmpleadosByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/empleados/listarid/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.empleado;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    // let login = async (l) => {
    //     loading.value = true;
    //     try {
    //         let req = await axios.post(`api/empleados/login`, l);
    //         console.log(req);
    //         if (req.status === 200) {
    //             token.value = req.data.token;
    //             empleado.value = req.data.usuario; // Asigna los datos correctamente
    //             console.log(empleado.value); // Verifica los datos en consola
    //             return true;
    //         }
    //         return false;
    //     } catch (error) {
    //         console.log(error);
    //         return false;
    //     } finally {
    //         loading.value = false;
    //     }
    // };

    let postEmpleados = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/empleados/escribir`, r, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `empleado registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar el empleado";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    let putEmpleados = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/empleados/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `empleados editado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };
        } catch (error) {
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    let toggleEstadoEmpleados = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/empleados/activar/${id}`
                : `api/empleados/desactivar/${id}`;
            let req = await axios.put(url, {}, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return req.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    const clearEmpleados = () => {
        empleado.value = null;
        token.value = null;
    };

    return {
        getEmpleados,
        getEmpleadosActivos,
        getEmpleadosInactivos,
        getEmpleadosByID,
        postEmpleados,
        putEmpleados,
        toggleEstadoEmpleados,
        loading,
        empleados,
        clearEmpleados
    };
}, {
    persist: true,
});
