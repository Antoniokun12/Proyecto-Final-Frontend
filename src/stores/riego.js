import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const useRiegoStore = defineStore(
  "Riego",
  () => {
    let loading = ref(false);
    let riego = ref([]);
    const useUsuario = useAdministradorStore();

    const getRiego = async () => {
      try {
        loading.value = true;
        console.log(`${useUsuario.token} usuariotokennnnn`);
        console.log(`${localStorage.getItem('x-token')}localllllll`);

        let res = await axios.get(`api/riego/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        riego.value = res.data.riego || [];
        return res.data;
      } catch (error) {
        console.error("NO se pudo obtener la lista de riego", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const getRiegoActivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/riego/listaractivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        riego.value = res.data.activados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const getRiegoInactivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/riego/listardesactivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        riego.value = res.data.desactivados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };


    const getRiegosporId = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/riego/listarid/${id}`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de riego", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postRiego = async (data) => {
      loading.value = true;
      try {
        let req = await axios.post(`api/riego/escribir`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Riego registrada correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, riego: req.data.riego };
      } catch (error) {
        let errorMessage = "Error al registrar la riego";
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

    const putRiego = async (id, data) => {
      loading.value = true;
      try {
        let req = await axios.put(`api/riego/modificar/${id}`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Riego actualizado correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, riego: req.data.riego };
      } catch (error) {
        let errorMessage = "Error al actualizar la riego";
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
    const toggleEstadoRiego = async (id, activar) => {
      loading.value = true;
      try {
        const url = activar
          ? `api/riego/activar/${id}`
          : `api/riego/desactivar/${id}`;
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
      getRiego,
      getRiegoActivos,
      getRiegoInactivos,
      getRiegosporId,
      postRiego,
      putRiego,
      toggleEstadoRiego,
      loading,
      riego,
      useUsuario,
    };
  },

  { persist: true }
);