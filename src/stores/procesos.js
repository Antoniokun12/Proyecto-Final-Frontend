import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "./administrador.js"

export const useProcesosStore = defineStore("Proceso", () => {
  let loading = ref(false);
  let token = ref("");
  const proceso = ref(null);
  const useUsuario = useAdministradorStore();


  const procesos = ref([]);

  let getProceso = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/procesos/listar`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      proceso.value = res.data.proceso || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProcesoByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/procesos/listarid/${id}`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      proceso.value = res.data.proceso;
      return res.data.proceso;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProcesoActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/procesos/listaractivados`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      proceso.value = res.data.activados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProcesoInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/procesos/listardesactivados`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      proceso.value = res.data.desactivados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const postProceso = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/procesos/escribir`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Proceso registrado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, proceso: req.data.proceso };
    } catch (error) {
      let errorMessage = "Error al registrar el proceso";
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

  const putProceso = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/procesos/modificar/${id}`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Proceso actualizado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, proceso: req.data.proceso };
    } catch (error) {
      let errorMessage = "Error al actualizar la proceso";
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
  

  const toggleEstadoProceso = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/procesos/activar/${id}`
        : `api/procesos/desactivar/${id}`;
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
    getProceso,
    getProcesoByID,
    getProcesoActivos,
    getProcesoInactivos,
    postProceso,
    putProceso,
    toggleEstadoProceso,
    proceso,
    token,
    loading,
  };
}, {
  persist: true,
});