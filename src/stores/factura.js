import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useFacturaStore = defineStore("factura", () => {
    const loading = ref(false);
    const useUsuario = useAdministradorStore();

    const getFactura = async () => {
        loading.value = true;
        try {
            const res = await axios.get(`api/factura/listar`, {
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

    const getFacturaByID = async (id) => {
        loading.value = true;
        try {
            const res = await axios.get(`api/factura/listarid/${id}`, {
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

    const postFactura = async (data) => {
        loading.value = true;
        try {
            const req = await axios.post(`api/factura/escribir`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Factura registrada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, factura: req.data };
        } catch (error) {
            let errorMessage = "Error al registrar Factura";
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

    const putFactura = async (id, data) => {
        loading.value = true;
        try {
            const req = await axios.put(`api/factura/modificar/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Factura actualizada correctamente`,
                color: "positive",
                position: "top",
            });
            return { success: true, Factura: req.data };
        } catch (error) {
            let errorMessage = "Error al actualizar el Factura";
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


    return {
        getFactura,
        getFacturaByID,
        postFactura,
        putFactura,
        loading,
    };
}, {
    persist: true,
});