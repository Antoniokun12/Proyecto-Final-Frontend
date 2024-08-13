import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useAdministradorStore } from "../stores/administrador.js"

export const useProveedorStore = defineStore("proveedor", () => {
  let loading = ref(false);
  const proveedor = ref(null);
  const useAdmin = useAdministradorStore();


  const proveedores = ref([]);

  let getProveedores = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/proveedores/listar`, {
        headers: {
          "x-token": useAdmin.token,
        },
      });
      proveedores.value = res.data.proveedores || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProveedorByID = async (id) => {
    loading.value = true;
    try {
      let res = await axios.get(`api/proveedores/listarid/${id}`, {
        headers: {
          "x-token": useAdmin.token,
        },
      });
      proveedor.value = res.data.proveedor;
      return res.data.proveedor;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProveedoresActivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/proveedores/listaractivados`, {
        headers: {
          "x-token": useAdmin.token,
        },
      });
      proveedores.value = res.data.activados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const getProveedoresInactivos = async () => {
    loading.value = true;
    try {
      let res = await axios.get(`api/proveedores/listardesactivados`, {
        headers: {
          "x-token": useAdmin.token,
        },
      });
      proveedores.value = res.data.desactivados || [];
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const postProveedor = async (data) => {
    loading.value = true;
    try {
      let req = await axios.post(`api/proveedores/escribir`, data, {
        headers: {
          "x-token": useAdmin.token,
        },
      });
      Notify.create({
        message: `Proveedor registrado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, proveedor: req.data.proveedor };
    } catch (error) {
      let errorMessage = "Error al registrar el proveedor";
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

  const putProveedor = async (id, data) => {
    loading.value = true;
    try {
      let req = await axios.put(`api/proveedores/modificar/${id}`, data, {
        headers: {
          "x-token": useAdmin.token,
        },
      });
      Notify.create({
        message: `Proveedor actualizado correctamente`,
        color: "positive",
        position: "top",
      });
      return { success: true, proveedor: req.data.proveedor };
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

  const toggleEstadoProveedor = async (id, activar) => {
    loading.value = true;
    try {
      const url = activar
        ? `api/proveedores/activar/${id}`
        : `api/proveedores/desactivar/${id}`;
      let req = await axios.put(url, {}, {
        headers: {
          "x-token": useAdmin.token,
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
    getProveedores,
    getProveedorByID,
    getProveedoresActivos,
    getProveedoresInactivos,
    postProveedor,
    putProveedor,
    toggleEstadoProveedor,
    loading,
  };
}, {
  persist: true,
});
