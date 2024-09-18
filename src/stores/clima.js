import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useClimaStore = defineStore("clima", () => {
  let loading = ref(false);
  const proveedor = ref(null);
  const useUsuario = useAdministradorStore();


  const clima = ref([]);

  let getClima = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/clima/listar`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      clima.value = res.data.clima || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getClimaByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/clima/listarid/${id}`, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      clima.value = res.data.clima;
      return res.data.clima;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  // const getClimaActivos = async () => {
  //   loading.value = true;
  //   try {
  //     let res = await axios.get(`api/clima/listaractivados`, {
  //       headers: {
  //         "x-token": useUsuario.token,
  //       },
  //     });
  //     clima.value = res.data.activados || [];
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // const getClimaInactivos = async () => {
  //   loading.value = true;
  //   try {
  //     let res = await axios.get(`api/clima/listardesactivados`, {
  //       headers: {
  //         "x-token": useUsuario.token,
  //       },
  //     });
  //     clima.value = res.data.desactivados || [];
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //     return error;
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  const postClima = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/clima/escribir`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `clima registrado correctamente`,
        color: "positive",
        position: "top",
      });
        
      return { success: true, clima: req.data.clima };
   
      
    } catch (error) {
      let errorMessage = "Error al registrar el clima";
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

  const putClima = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/clima/modificar/${id}`, data, {
        headers: {
          "x-token": useUsuario.token,
        },
      });
      Notify.create({
        message: `Proveedor actualizado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, clima: req.data.clima };
    } catch (error) {
      let errorMessage = "Error al actualizar el proveedor";
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

  const toggleEstadoclima = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/clima/activar/${id}`
        : `api/clima/desactivar/${id}`;
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
    getClima,
    getClimaByID,
    // getClimaActivos,
    // getClimaInactivos,
    postClima,
    putClima,
    toggleEstadoclima,
    loading,
  };
}, {
  persist: true,
});
