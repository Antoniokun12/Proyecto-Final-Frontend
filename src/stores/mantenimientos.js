import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js";
export const useMantenimientosStore = defineStore("mantenimiento", () => {
    const useUsuario = useAdministradorStore()
    let loading = ref(false);



    let getManteni = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/mantenimiento/listar`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data;

        } catch (error) {
            console.log(error);
            console.log("error");

            return error;
        } finally {
            loading.value = false;
        }
    };

    let getManteniActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/mantenimiento/listaractivados`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getManteniInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/mantenimiento/listardesactivados`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getManteniByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/mantenimiento/listarid/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let postManteni = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/mantenimiento/escribir`, r, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Mantenimiento registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar la mantenimiento";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    let putManteni = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/mantenimiento/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Mantenimiento editado correctamente`,
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

    let toggleEstadoManteni = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/mantenimiento/activar/${id}`
                : `api/mantenimiento/desactivar/${id}`;
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



    return {
        getManteni,
        getManteniActivos,
        getManteniInactivos,
        getManteniByID,
        postManteni,
        putManteni,
        toggleEstadoManteni,
        loading,
    };
}, {
    persist: true,
});
