import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const useCompradorStore = defineStore(
  "Comprador",
  () => {
    let loading = ref(false);
    let comprador = ref([]);
    const useUsuario = useAdministradorStore();

    const listarComprador = async () => {
      try {
        loading.value = true;
        console.log(`${useUsuario.token} usuariotokennnnn`);
        console.log(`${localStorage.getItem('x-token')}localllllll`);

        let res = await axios.get(`api/comprador/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
      });
      comprador.value = res.data.comprador || [];
      return res.data;
  } catch (error) {
        console.error("NO se pudo obtener la lista de comprador", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const getCompradorActivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/comprador/listaractivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        comprador.value = res.data.activados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
  
    const getCompradorInactivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/comprador/listardesactivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        comprador.value = res.data.desactivados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
  
  
    const listarCompradorporId = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/comprador/listarid/${id}`, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de comprador", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postComprador = async (data) => {
      loading.value = true;
      try {
        let req = await axios.post(`api/comprador/escribir`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Comprador registrado correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, comprador: req.data.comprador };
      } catch (error) {
        let errorMessage = "Error al registrar el comprador";
        if (error.response) {
          console.error("Error response:", error.response.data); // Para depuración
          if (error.response.data?.errors) {
            // Si hay múltiples errores, los recorremos y los mostramos
            error.response.data.errors.forEach(err => {
              Notify.create({
                type: "negative",
                message: err.msg,  // Mostramos el mensaje de cada error
              });
            });
          } else if (error.response.data?.error) {
            errorMessage = error.response.data.error;
          }
        } else {
          errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
      } finally {
        loading.value = false;
      }
    };
    
    
    
      const putComprador = async (id, data) => {
        loading.value = true;
        try {
          let req = await axios.put(`api/comprador/modificar/${id}`, data, {
            headers: {
              "x-token": useUsuario.token,
            },
          });
          Notify.create({
            message: `Comprador actualizada correctamente`,
            color: "positive",
            position: "top",
          });
          return { success: true, comprador: req.data.comprador };
        } catch (error) {
          let errorMessage = "Error al actualizar la comprador";
          if (error.response) {
            console.error("Error response:", error.response.data); // Log para depuración
            if (error.response.data?.error) {
              errorMessage = error.response.data.error;
            }
          } else {
            errorMessage = error.message;
          }
          Notify.create({
            type: "negative",
            message: errorMessage,
          });
          return { success: false, error: errorMessage };
        } finally {
          loading.value = false;
        }
      };
    const toggleEstadoComprador = async (id, activar) => {
        loading.value = true;
        try {
          const url = activar
            ? `api/comprador/activar/${id}`
            : `api/comprador/desactivar/${id}`;
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
      listarComprador,
      getCompradorActivos,
      getCompradorInactivos,
      listarCompradorporId,
      postComprador,
      putComprador,
      toggleEstadoComprador,
      loading,
      comprador,
      useUsuario,
    };
  },

  { persist: true }
);