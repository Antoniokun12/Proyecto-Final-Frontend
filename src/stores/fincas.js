import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useAdministradorStore } from "./administrador";
import { Notify } from "quasar";

export const useFincasStore = defineStore(
  "Finca",
  () => {
    let loading = ref(false);
    let fincas = ref([]);
    const useUsuario = useAdministradorStore();

    const listarFinca = async () => {
      try {
        loading.value = true;
        let res = await axios.get(`api/fincas/listar`, {
          headers: {
            "x-token": useUsuario.token,
          },
      });
      console.log("Respuesta de la API:", res.data);
      fincas.value = res.data.fincas || [];
      return res.data;
  } catch (error) {
        console.error("NO se pudo obtener la lista de fincas", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const listaractivados = async () => {
      try {
        loading.value = true;
        console.log(useUsuario.token);
        console.log(localStorage.getItem('x-token'));

        const response = await axios.get("api/fincas/listaractivados", {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de fincas", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const listardesactivados = async () => {
      try {
        loading.value = true;
        // console.log(useUsuario.token);
        console.log(localStorage.getItem('x-token'));

        const response = await axios.get("api/fincas/listardesactivados", {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de fincas", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const listarFincasporAdmin = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/fincas/poradmin/${id}`, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de fincas", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postFincas = async (data) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));
    
        const r = await axios.post("api/fincas/escribir", data, {
          headers: {
            "x-token": localStorage.getItem('x-token'),
          },
        });
    
        Notify.create({
          message: 'Finca registrada correctamente',
          color: "positive",
          position: "top",
        });
    
        console.log(r);
        return r;
      } catch (error) {
        let errorMessage = 'Error al guardar la finca';
    
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          errorMessage = error.response.data.message || 'Error en la respuesta del servidor';
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          errorMessage = 'No se recibió respuesta del servidor';
        } else {
          // Algo sucedió en la configuración de la solicitud que provocó un error
          errorMessage = error.message;
        }
    
        Notify.create({
          type: 'negative',
          message: errorMessage,
        });
    
        console.log("Error al guardar la finca:", errorMessage);
        return error;
      } finally {
        loading.value = false;
      }
    };




    const putFinca = async (id, data) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));
        const r = await axios.put(`api/fincas/modificar/${id}`, data, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        Notify.create({
          message: 'finca actualizado correctamente',
          color: "positive",
          position: "top",
        })

        return r;

    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response.data.errors[0].msg
      })
        loading.value =true
        console.log(error);
        return error;
    } finally {
        loading.value = false;
      }
    };
    const putActivarFinca = async (id) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const r = await axios.put(
          `api/fincas/activar/${id}`,
          {},
          {
            headers: {
                     "x-token": localStorage.getItem('x-token'),
            },
          }
        );
        console.log(r);
        return r;
      } catch (error) {
        loading.value = true;
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const putDesactivarFinca = async (id) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const r = await axios.put(
          `api/fincas/desactivar/${id}`,
          {},
          {
            headers: {
                     "x-token": localStorage.getItem('x-token'),
            },
          }
        );
        console.log(r);
        return r;
      } catch (error) {
        loading.value = true;
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };


    return {
      listarFinca,
      listaractivados,
      listardesactivados,
      listarFincasporAdmin,
      postFincas,
      putFinca,
      putActivarFinca,
      putDesactivarFinca,
      loading,
      fincas,
      useUsuario,
    };
  },

  { persist: true }
);