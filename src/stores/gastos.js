import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useGastosStore = defineStore("gasto", () => {
    const loading = ref(false);
    const useUsuario = useAdministradorStore();

    const getGastos = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/gastos/listar`, {
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

    const getGastosByID = async (id) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/gastos/listarid/${id}`, {
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

    const getGastosActivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/gastos/listaractivados`, {
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

    const getGastosInactivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/gastos/listardesactivados`, {
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

    const postGastos = async (data) => {
        loading.value = true;
        try {
            const req = await axios.post(`api/gastos/escribir`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Gasto registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, Gasto: req.data };
        } catch (error) {
            let errorMessage = "Error al registrar Gasto";
            if (error.response && error.response.data?.error) {
                errorMessage = error.response.data.error;
            } else {
                errorMessage = error.message;
            }
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    const putGastos = async (id, data) => {
        loading.value = true;
        try {
            const req = await axios.put(`api/gastos/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Gasto actualizada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, Gasto: req.data };
        } catch (error) {
            let errorMessage = "Error al actualizar el Gasto";
            if (error.response && error.response.data?.error) {
                errorMessage = error.response.data.error;
            } else {
                errorMessage = error.message;
            }
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    const toggleEstadoGastos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/gastos/activar/${id}`
                : `api/gastos/desactivar/${id}`;
            const req = await axios.put(url, {}, {
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
        getGastos,
        getGastosByID,
        getGastosActivas,
        getGastosInactivas,
        postGastos,
        putGastos,
        toggleEstadoGastos,
        loading,
    };
}, {
    persist: true,
});