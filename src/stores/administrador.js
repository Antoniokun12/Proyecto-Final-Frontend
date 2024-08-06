import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";

export const useAdministradorStore = defineStore("administrador", () => {
    let loading = ref(false);
    let token = ref("");
    let administrador = ref({
        nombre: '',
        cedula: '',
        direccion: '',
        email: '',
        telefono: '',
        municipio: ''
    });
    const administradores = ref([]);

    let getAdministradores = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/administrador/listar`, {
                headers: {
                    "x-token": token.value,
                },
            });
            administradores.value = res.data.admin || [];
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getAdministradoresActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/administrador/listaractivados`, {
                headers: {
                    "x-token": token.value,
                },
            });
            administradores.value = res.data.activados || [];
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getAdministradoresInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/administrador/listardesactivados`, {
                headers: {
                    "x-token": token.value,
                },
            });
            administradores.value = res.data.desactivados || [];
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let getAdministradorByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/administrador/listarid/${id}`, {
                headers: {
                    "x-token": token.value,
                },
            });
            return res.data.admin;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

    let login = async (l) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/administrador/login`, l);
            console.log(req);
            if (req.status === 200) {
                token.value = req.data.token;
                administrador.value = req.data.usuario; // Asigna los datos correctamente
                console.log(administrador.value); // Verifica los datos en consola
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            loading.value = false;
        }
    };

    let postAdministrador = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/administrador/escribir`, r, {
                headers: {
                    "x-token": token.value,
                },
            });
            Notify.create({
                message: `Administrador registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar el administrador";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    let putAdministrador = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/administrador/modificar/${id}`, data, {
                headers: {
                    "x-token": token.value,
                },
            });
            Notify.create({
                message: `Administrador editado correctamente`,
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

    let toggleEstadoAdministrador = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/administrador/activar/${id}`
                : `api/administrador/desactivar/${id}`;
            let req = await axios.put(url, {}, {
                headers: {
                    "x-token": token.value,
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

    const clearAdministrador = () => {
        administrador.value = null;
        token.value = null;
    };

    return {
        getAdministradores,
        getAdministradoresActivos,
        getAdministradoresInactivos,
        getAdministradorByID,
        login,
        postAdministrador,
        putAdministrador,
        toggleEstadoAdministrador,
        token,
        loading,
        administrador,
        clearAdministrador
    };
}, {
    persist: true,
});
