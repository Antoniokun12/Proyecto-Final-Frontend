import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useNominaStore = defineStore("nomina", () => {
    const loading = ref(false);
    const useUsuario = useAdministradorStore();

    const getNominas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/nomina/listar`, {
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

    const getNominaByID = async (id) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/nomina/listarid/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.nomina;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    const getNominasActivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/nomina/listar/activadas`, {
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

    const getNominasInactivas = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/nomina/listar/desactivadas`, {
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

    const postNomina = async (data) => {
        loading.value = true;
        try {
            const req = await axios.post(`api/nomina/escribir`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Nómina registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, nomina: req.data.nomina };
        } catch (error) {
            let errorMessage = "Error al registrar la nómina";
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

    const putNomina = async (id, data) => {
        loading.value = true;
        try {
            const req = await axios.put(`api/nomina/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Nómina actualizada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, nomina: req.data.nomina };
        } catch (error) {
            let errorMessage = "Error al actualizar la nómina";
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

    const toggleEstadoNomina = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/nomina/activar/${id}`
                : `api/nomina/desactivar/${id}`;
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
        getNominas,
        getNominaByID,
        getNominasActivas,
        getNominasInactivas,
        postNomina,
        putNomina,
        toggleEstadoNomina,
        loading,
    };
}, {
    persist: true,
});
