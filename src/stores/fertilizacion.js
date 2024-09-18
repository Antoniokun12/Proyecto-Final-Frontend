import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js";
export const useFertilizacionStore = defineStore("fertilizacion", () => {
    const useUsuario = useAdministradorStore()
    let loading = ref(false);



    let getFertilizacion = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/fertilizacion/listar`, {
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

    let getFertilizacionActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/fertilizacion/listaractivados`, {
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

    let getFertilizacionInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/fertilizacion/listardesactivados`, {
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

    let getFertilizacionByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/fertilizacion/listarid/${id}`, {
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

    let postFertilizacion = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/fertilizacion/escribir`, r, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Fertilizacion registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar la Fertilizacion";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    let putFertilizacion = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/fertilizacion/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `fertilizacion editado correctamente`,
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

    let toggleEstadoFertilizacion = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/fertilizacion/activar/${id}`
                : `api/fertilizacion/desactivar/${id}`;
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

        getFertilizacion,
        getFertilizacionActivos,
        getFertilizacionInactivos,
        getFertilizacionByID,
        postFertilizacion,
        putFertilizacion,
        toggleEstadoFertilizacion,
        loading,
    };
}, {
    persist: true,
});