import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const useCultivosStore = defineStore(
  "Cultivo",
  () => {
    let loading = ref(false);
    let cultivos = ref([]);
    const useUsuario = useAdministradorStore();

    const listarCultivo = async () => {
      try {
        loading.value = true;
        console.log(`${useUsuario.token} usuariotokennnnn`);
        console.log(`${localStorage.getItem('x-token')}localllllll`);

        let res = await axios.get(`api/cultivos/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
      });
      cultivos.value = res.data.cultivos || [];
      return res.data;
  } catch (error) {
        console.error("NO se pudo obtener la lista de cultivos", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const getCultivosActivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/cultivos/listaractivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        cultivos.value = res.data.activados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
  
    const getCultivosInactivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/cultivos/listardesactivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        cultivos.value = res.data.desactivados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
  
  
    const listarCultivosporId = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/cultivos/listarid/${id}`, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de cultivos", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postCultivo = async (data) => {
        loading.value = true;
        try {
          let req = await axios.post(`api/cultivos/escribir`, data, {
            headers: {
              "x-token": useUsuario.token,
            },
          });
          Notify.create({
            message: `Cultivo registrada correctamente`,
            color: "positive",
            position: "top",
          });
          return { success: true, cultivo: req.data.cultivo };
        } catch (error) {
          let errorMessage = "Error al registrar la cultivo";
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
    
      const putCultivo = async (id, data) => {
        loading.value = true;
        try {
          let req = await axios.put(`api/cultivos/modificar/${id}`, data, {
            headers: {
              "x-token": useUsuario.token,
            },
          });
          Notify.create({
            message: `Cultivo actualizada correctamente`,
            color: "positive",
            position: "top",
          });
          return { success: true, cultivo: req.data.cultivo };
        } catch (error) {
          let errorMessage = "Error al actualizar la cultivo";
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
    const toggleEstadoCultivo = async (id, activar) => {
        loading.value = true;
        try {
          const url = activar
            ? `api/cultivos/activar/${id}`
            : `api/cultivos/desactivar/${id}`;
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
      listarCultivo,
      getCultivosActivos,
      getCultivosInactivos,
      listarCultivosporId,
      postCultivo,
      putCultivo,
      toggleEstadoCultivo,
      loading,
      cultivos,
      useUsuario,
    };
  },

  { persist: true }
);