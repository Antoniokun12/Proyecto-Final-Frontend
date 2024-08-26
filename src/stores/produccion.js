import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "./administrador.js"

export const useProduccionStore = defineStore("produccion", () => {
  let loading = ref(false);
  let token = ref("");
  const produccion = ref(null);
  const useUsuario = useAdministradorStore();


  const producciones = ref([]);

  let getProduccion = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/produccion/listar`, {
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

  const getProduccionByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/produccion/listarid/${id}`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      produccion.value = res.data.produccion;
      return res.data.produccion;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProduccionActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/produccion/listaractivados`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      producciones.value = res.data.activados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProduccionInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/produccion/listardesactivados`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      producciones.value = res.data.desactivados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const postProduccion = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/produccion/escribir`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Produccion registrada correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, produccion: req.data.produccion };
    } catch (error) {
      let errorMessage = "Error al registrar la produccion";
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

  const putProduccion = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/produccion/modificar/${id}`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Produccion actualizada correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, produccion: req.data.produccion };
    } catch (error) {
      let errorMessage = "Error al actualizar la produccion";
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
  

  const toggleEstadoProduccion = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/produccion/activar/${id}`
        : `api/produccion/desactivar/${id}`;
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
    getProduccion,
    getProduccionByID,
    getProduccionActivos,
    getProduccionInactivos,
    postProduccion,
    putProduccion,
    toggleEstadoProduccion,
    token,
    loading,
  };
}, {
  persist: true,
});
