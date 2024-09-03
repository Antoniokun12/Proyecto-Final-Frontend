import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const usePreparacionStore = defineStore(
  "PreparacionSuelo",
  () => {
    let loading = ref(false);
    let preparacion = ref([]);
    const useUsuario = useAdministradorStore();

    const getPreparacion = async () => {
      try {
        loading.value = true;
        console.log(`${useUsuario.token} usuariotokennnnn`);
        console.log(`${localStorage.getItem('x-token')}localllllll`);

        let res = await axios.get(`api/preparacion_suelo/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        preparacion.value = res.data.preparacion || [];
        return res.data;
      } catch (error) {
        console.error("NO se pudo obtener la lista de preparacion", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const getPreparacionActivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/preparacion_suelo/listaractivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        preparacion.value = res.data.activados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const getPreparacionInactivos = async () => {
      loading.value = true;
      try {
        let res = await axios.get(`api/preparacion_suelo/listardesactivados`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        preparacion.value = res.data.desactivados || [];
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };


    const getPreparacionsporId = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/preparacion_suelo/listarid/${id}`, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de preparacion", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postPreparacion = async (data) => {
      loading.value = true;
      try {
        let req = await axios.post(`api/preparacion_suelo/escribir`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Preparación registrada correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, preparacion: req.data.preparacion };
      } catch (error) {
        let errorMessage = "Error al registrar la preparacion";
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

    const putPrepacion = async (id, data) => {
      loading.value = true;
      try {
        let req = await axios.put(`api/preparacion_suelo/modificar/${id}`, data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        Notify.create({
          message: `Preparación actualizada correctamente`,
          color: "positive",
          position: "top",
        });
        return { success: true, preparacion: req.data.preparacion };
      } catch (error) {
        let errorMessage = "Error al actualizar la preparacion";
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
    const toggleEstadoPreparacion = async (id, activar) => {
      loading.value = true;
      try {
        const url = activar
          ? `api/preparacion_suelo/activar/${id}`
          : `api/preparacion_suelo/desactivar/${id}`;
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
      getPreparacion,
      getPreparacionActivos,
      getPreparacionInactivos,
      getPreparacionsporId,
      postPreparacion,
      putPrepacion,
      toggleEstadoPreparacion,
      loading,
      preparacion,
      useUsuario,
    };
  },

  { persist: true }
);