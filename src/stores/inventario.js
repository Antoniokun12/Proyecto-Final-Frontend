import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useInventarioStore = defineStore("inventario", () => {
    const loading = ref(false);
    const useUsuario = useAdministradorStore();

    const getInventario = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/inventario/listar`, {
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

    const getInventarioByID = async (id) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/inventario/listarid/${id}`, {
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

    const getInventarioActivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/inventario/listaractivados`, {
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

    const getInventarioInactivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/inventario/listardesactivados`, {
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

    const postInventario = async (data) => {
        loading.value = true;
        try {
            const req = await axios.post(`api/inventario/escribir`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Inventario registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, inventario: req.data };
        } catch (error) {
            let errorMessage = "Error al registrar Inventario";
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

    const putInventario = async (id, data) => {
        loading.value = true;
        try {
            const req = await axios.put(`api/inventario/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Inventario actualizada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, inventario: req.data };
        } catch (error) {
            let errorMessage = "Error al actualizar el Inventario";
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

    const toggleEstadoInventario = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/inventario/activar/${id}`
                : `api/inventario/desactivar/${id}`;
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
        getInventario,
        getInventarioByID,
        getInventarioActivas,
        getInventarioInactivas,
        postInventario,
        putInventario,
        toggleEstadoInventario,
        loading,
    };
}, {
    persist: true,
});