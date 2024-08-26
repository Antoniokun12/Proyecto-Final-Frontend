import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useSemillasStore = defineStore("semillas", () => {
    const loading = ref(false);
    const useUsuario = useAdministradorStore();

    const getSemillas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/semillas/listar`, {
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

    const getSemillasByID = async (id) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/semillas/listarid/${id}`, {
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

    const getSemillasActivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/semillas/listaractivados`, {
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

    const getSemillasInactivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/semillas/listardesactivados`, {
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

    const postSemillas = async (data) => {
        loading.value = true;
        try {
            const req = await axios.post(`api/semillas/escribir`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Semilla registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, semilla: req.data };
        } catch (error) {
            let errorMessage = "Error al registrar la semilla";
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

    const putSemillas = async (id, data) => {
        loading.value = true;
        try {
            const req = await axios.put(`api/semillas/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Semilla actualizada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, semilla: req.data };
        } catch (error) {
            let errorMessage = "Error al actualizar la semilla";
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

    const toggleEstadoSemillas = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/semillas/activar/${id}`
                : `api/semillas/desactivar/${id}`;
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
        getSemillas,
        getSemillasByID,
        getSemillasActivas,
        getSemillasInactivas,
        postSemillas,
        putSemillas,
        toggleEstadoSemillas,
        loading,
    };
}, {
    persist: true,
});
