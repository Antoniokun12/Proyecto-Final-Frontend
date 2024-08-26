import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "./administrador.js"

export const useParcelaStore = defineStore("parcela", () => {
  let loading = ref(false);
  let token = ref("");
  const parcela = ref(null);
  const useUsuario = useAdministradorStore();


  const parcelas = ref([]);

  let getParcelas = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/parcelas/listar`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      parcelas.value = res.data.parcelas || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getParcelasByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/parcelas/listarid/${id}`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      parcela.value = res.data.parcela;
      return res.data.parcela;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getParcelasActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/parcelas/listaractivados`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      parcelas.value = res.data.activados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getParcelasInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/parcelas/listardesactivados`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      parcelas.value = res.data.desactivados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const postParcela = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/parcelas/escribir`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Parcela registrada correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, parcela: req.data.parcela };
    } catch (error) {
      let errorMessage = "Error al registrar la parcela";
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

  const putParcela = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/parcelas/modificar/${id}`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Parcela actualizada correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, parcela: req.data.parcela };
    } catch (error) {
      let errorMessage = "Error al actualizar la parcela";
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
  

  const toggleEstadoParcela = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/parcelas/activar/${id}`
        : `api/parcelas/desactivar/${id}`;
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
    getParcelas,
    getParcelasByID,
    getParcelasActivos,
    getParcelasInactivos,
    postParcela,
    putParcela,
    toggleEstadoParcela,
    token,
    loading,
  };
}, {
  persist: true,
});