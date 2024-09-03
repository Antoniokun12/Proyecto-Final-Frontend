import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "./administrador.js"

export const useElaboracionSustratoStore = defineStore("elaboracionSustrato", () => {
  let loading = ref(false);

  const useUsuario = useAdministradorStore();


  let getElaboracionSustrato = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/elaboracion/listar`, {
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


  const getElaboracionSustratoByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/elaboracion/listarid/${id}`, {
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

  const getElaboracionSustratoActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/elaboracion/listaractivados`, {
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

  const getElaboracionSustratoInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/elaboracion/listardesactivados`, {
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

  const postElaboracionSustrato = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/elaboracion/escribir`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Elaboracion de sustrato registrado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, analisis: req.data };
    } catch (error) {
      let errorMessage = "Error al registrar la Elaboracion de sustrato";
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

  const putElaboracionSustrato = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/elaboracion/modificar/${id}`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Elaboracion de sustrato actualizado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, analisis: req.data };
    } catch (error) {
      let errorMessage = "Error al actualizar la Elaboracion de sustrato";
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

  const toggleEstadoElaboracionSustrato = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/elaboracion/activar/${id}`
        : `api/elaboracion/desactivar/${id}`;
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
    getElaboracionSustrato,
    getElaboracionSustratoByID,
    getElaboracionSustratoActivos,
    getElaboracionSustratoInactivos,
    postElaboracionSustrato,
    putElaboracionSustrato,
    toggleEstadoElaboracionSustrato,
    loading,
  };
}, {
  persist: true,
});