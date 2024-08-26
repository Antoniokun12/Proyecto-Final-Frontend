import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useInsumosStore = defineStore("insumos", () => {
    const loading = ref(false);
    const useUsuario = useAdministradorStore();

    const getInsumos = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/insumos/listar`, {
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

    const getInsumosByID = async (id) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/insumos/listarid/${id}`, {
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

    const getInsumosActivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/insumos/listaractivados`, {
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

    const getInsumosInactivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/insumos/listardesactivados`, {
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

    const postInsumos = async (data) => {
        loading.value = true;
        try {
            const req = await axios.post(`api/insumos/escribir`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Insumo registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, semilla: req.data };
        } catch (error) {
            let errorMessage = "Error al registrar la insumo";
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

    const putInsumos = async (id, data) => {
        loading.value = true;
        try {
            const req = await axios.put(`api/insumos/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Insumo actualizada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, semilla: req.data };
        } catch (error) {
            let errorMessage = "Error al actualizar la insumo";
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

    const toggleEstadoInsumos = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/insumos/activar/${id}`
                : `api/insumos/desactivar/${id}`;
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
        getInsumos,
        getInsumosByID,
        getInsumosActivas,
        getInsumosInactivas,
        postInsumos,
        putInsumos,
        toggleEstadoInsumos,
        loading,
    };
}, {
    persist: true,
});