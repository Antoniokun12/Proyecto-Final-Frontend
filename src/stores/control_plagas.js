import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const useControlplagaStore = defineStore(
  "Controlplaga",
  () => {
    let loading = ref(false);
    let controlplaga = ref([]);
    const useUsuario = useAdministradorStore();

    const getControlplaga = async () => {
      try {
        loading.value = true;
        console.log(`${useUsuario.token} usuariotokennnnn`);
        console.log(`${localStorage.getItem('x-token')}localllllll`);

        let res = await axios.get(`api/control/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
      });
      controlplaga.value = res.data.controlplaga || [];
      return res.data;
  } catch (error) {
        console.error("NO se pudo obtener la lista de controlplaga", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const getControlplagaActivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/control/listaractivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        controlplaga.value = res.data.activados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
  
    const getControlplagaInactivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/control/listardesactivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        controlplaga.value = res.data.desactivados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
  
  
    const getControlplagasporId = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/control/listarid/${id}`, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de controlplaga", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postControlplaga = async (data) => {
        loading.value = true;
        try {
          let req = await axios.post(`api/control/escribir`, data, {
            headers: {
              "x-token": useUsuario.token,
            },
          });
          Notify.create({
            message: `controlplaga registrada correctamente`,
            color: "positive",
            position: "top",
          });
          return { success: true, controlplaga: req.data.controlplaga };
        } catch (error) {
          let errorMessage = "Error al registrar la controlplaga";
          if (error.response) {
            if (error.response.data?.error) {
              errorMessage = error.response.data.error;
            }
            console.error("Error response:", error.response.data); // Para depuración
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
    
      const putControlplaga = async (id, data) => {
        loading.value = true;
        try {
          let req = await axios.put(`api/control/modificar/${id}`, data, {
            headers: {
              "x-token": useUsuario.token,
            },
          });
          Notify.create({
            message: `Control de plaga actualizada correctamente`,
            color: "positive",
            position: "top",
          });
          return { success: true, controlplaga: req.data.controlplaga };
        } catch (error) {
          let errorMessage = "Error al actualizar la controlplaga";
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
    const toggleEstadoControlplaga = async (id, activar) => {
        loading.value = true;
        try {
          const url = activar
            ? `api/control/activar/${id}`
            : `api/control/desactivar/${id}`;
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
      getControlplaga,
      getControlplagaActivos,
      getControlplagaInactivos,
      getControlplagasporId,
      postControlplaga,
      putControlplaga,
      toggleEstadoControlplaga,
      loading,
      controlplaga,
      useUsuario,
    };
  },

  { persist: true }
);