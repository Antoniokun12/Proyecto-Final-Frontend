
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js";
export const useMaquinariasStore = defineStore("maquinarias", () => {
    const useUsuario = useAdministradorStore()
    let loading = ref(false);
   
    

    let getMaquinarias = async () => {
        loading.value = true;        
        try {
            let res = await axios.get(`api/maquinasherramienta/listar`, {
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

    let getMaquinariasActivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinasherramienta/listaractivados`, {
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

    let getMaquinariasInactivos = async () => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinasherramienta/listardesactivados`, {
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

    let getMaquinariasByID = async (id) => {
        loading.value = true;
        try {
            let res = await axios.get(`api/maquinasherramienta/listarid/${id}`, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            return res.data.maqui;
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
    //         let req = await axios.post(`api/administrador/login`, l);
    //         console.log(req);
    //         if (req.status === 200) {
    //             token.value = req.data.token;
    //             administrador.value = req.data.usuario; // Asigna los datos correctamente
    //             console.log(administrador.value); // Verifica los datos en consola
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

    let postMaquinarias = async (r) => {
        loading.value = true;
        try {
            let req = await axios.post(`api/maquinasherramienta/escribir`, r, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Maquinaria registrado correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || "Error al registrar la maquinaria";
            Notify.create({
                type: "negative",
                message: errorMessage,
            });
            return { success: false };
        } finally {
            loading.value = false;
        }
    };

    let putMaquinarias = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/maquinasherramienta/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Maquinarias editado correctamente`,
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

    let toggleEstadoMaquinarias = async (id, activar) => {
        loading.value = true;
        try {
            const url = activar
                ? `api/maquinasherramienta/activar/${id}`
                : `api/maquinasherramienta/desactivar/${id}`;
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
        getMaquinarias,
        getMaquinariasActivos,
        getMaquinariasInactivos,
        getMaquinariasByID,
        postMaquinarias,
        putMaquinarias,
        toggleEstadoMaquinarias,
        loading,
       
    };
}, {
    persist: true,
});
