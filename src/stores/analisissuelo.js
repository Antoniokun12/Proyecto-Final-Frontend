import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useAnalisisSueloStore = defineStore("analisisSuelo", () => {
  let loading = ref(false);

  const useUsuario = useAdministradorStore();


  let getAnalisisSuelos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/analisis/listar`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      console.log(res, "este es el res de store")
      return res.data;

    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };


  const getAnalisisSuelosByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/analisis/listarid/${id}`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });

      return res.data
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getAnalisisSuelosActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/analisis/listaractivados`, {
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

  const getAnalisisSuelosInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/analisis/listardesactivados`, {
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

  const postAnalisisSuelos = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/analisis/escribir`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Analasis de suelo registrado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, analisis: req.data };
    } catch (error) {
      let errorMessage = "Error al registrar el Analisis de suelo";
      if (error.response) {
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
      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  const putAnalisisSuelos = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/analisis/modificar/${id}`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Analisis de suelo actualizado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, analisis: req.data };
    } catch (error) {
      let errorMessage = "Error al actualizar el Analaisis de suelo";
      if (error.response) {
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
      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  const toggleEstadoAnalisisSuelos = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/analisis/activar/${id}`
        : `api/analisis/desactivar/${id}`;
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
    getAnalisisSuelos,
    getAnalisisSuelosActivos,
    getAnalisisSuelosInactivos,
    postAnalisisSuelos,
    putAnalisisSuelos,
    getAnalisisSuelosByID,
    toggleEstadoAnalisisSuelos,
    loading,
  };
}, {
  persist: true,
});