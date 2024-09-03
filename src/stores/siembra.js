import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const useSiembraStore = defineStore(
  "Siembra",
  () => {
    let loading = ref(false);
    let siembra = ref([]);
    const useUsuario = useAdministradorStore();

    const getSiembra = async () => {
      try {
        loading.value = true;
        console.log(`${useUsuario.token} usuariotokennnnn`);
        console.log(`${localStorage.getItem('x-token')}localllllll`);

        let res = await axios.get(`api/siembra/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        siembra.value = res.data.siembra || [];
        return res.data;
      } catch (error) {
        console.error("NO se pudo obtener la lista de siembra", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const getSiembraActivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/siembra/listaractivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        siembra.value = res.data.activados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const getSiembraInactivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/siembra/listardesactivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        siembra.value = res.data.desactivados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };


    const getSiembrasporId = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/siembra/listarid/${id}`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de siembra", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postSiembra = async (data) => {
      loading.value = true;
      try {
        let req = await axios.post(`api/siembra/escribir`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Siembra registrada correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, siembra: req.data.siembra };
      } catch (error) {
        let errorMessage = "Error al registrar la siembra";
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

    const putSiembra = async (id, data) => {
      loading.value = true;
      try {
        let req = await axios.put(`api/siembra/modificar/${id}`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Siembra actualizado correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, siembra: req.data.siembra };
      } catch (error) {
        let errorMessage = "Error al actualizar la siembra";
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
    const toggleEstadoSiembra = async (id, activar) => {
      loading.value = true;
      try {
        const url = activar
          ? `api/siembra/activar/${id}`
          : `api/siembra/desactivar/${id}`;
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
      getSiembra,
      getSiembraActivos,
      getSiembraInactivos,
      getSiembrasporId,
      postSiembra,
      putSiembra,
      toggleEstadoSiembra,
      loading,
      siembra,
      useUsuario,
    };
  },

  { persist: true }
);