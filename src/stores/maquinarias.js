
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
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading.value = false;
        }
    };

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
    let putAgregarMantenimiento = async (id, data) => {
        try {
          let response = await axios.put(`api/maquinasherramienta/agregamantenimiento/${id}`, data, {
            headers: {
              "x-token": useUsuario.token,
            },
          });
          return { success: true, data: response.data };
        } catch (error) {
          console.error("Error en putAgregarMantenimiento:", error);
          return {
            success: false,
            error: error.response?.data?.error || "Error al agregar mantenimiento"
          };
        }
      };
      
      let putEditarMantenimiento = async (maquinaId, mantenimientoId, mantenimientoData) => {
        try {
          const response = await axios.put(
            `/api/maquinasherramienta/editamantenimiento/${maquinaId}/${mantenimientoId}`,
            mantenimientoData,
            {
              headers: {
                "Content-Type": "application/json",
                "x-token": useUsuario.token,
              },
            }
          );
          return { success: true, data: response.data };
        } catch (error) {
          console.error("Error en putEditarMantenimiento:", error);
          return {
            success: false,
            error: error.response?.data?.error || "Error al editar mantenimiento"
          };
        }
      };
    let putAgregarProductoDesinfeccion = async (id, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/maquinasherramienta/desinfeccion/${id}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Desinfección agregado correctamente`,
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

    let putEditarProductoDesinfeccion = async (id, desinfeccionId, productoId, data) => {
        loading.value = true;
        try {
            let req = await axios.put(`api/maquinasherramienta/editardesinfeccion/${id}/desinfeccion/${desinfeccionId}/producto/${productoId}`, data, {
                headers: {
                    "x-token": useUsuario.token,
                },
            });
            Notify.create({
                message: `Desinfección editada correctamente`,
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
        putAgregarMantenimiento,
        putEditarMantenimiento,
        putAgregarProductoDesinfeccion,
        putEditarProductoDesinfeccion,
        toggleEstadoMaquinarias,
        loading,

    };
}, {
    persist: true,
});
