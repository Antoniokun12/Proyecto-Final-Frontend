<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Fincas</div>
      <q-btn
        label="Agregar Finca"
        color="orange-14"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown
        color="orange-14"
        icon="visibility"
        label="Filtrar"
        style="margin-left: 16px"
      >
        <q-list>
          <q-item clickable v-ripple @click="listarFincas">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listaractivados">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listardesactivados">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedFincaId"
        label="Seleccionar Finca"
        :options="fincaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="buscarFincaPorNombre"
      />
    </div>

    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="_id"
            flat
            bordered
            square
            no-data-label=""
          >
            <template v-slot:body-cell-idAdministrador="props">
              <q-td :props="props" style="text-align: center;">
                <p>{{ getAdminNombre(props.row.idAdministrador) }}</p>
              </q-td>
            </template>

            <template v-slot:body-cell-area="props">
              <q-td :props="props">
                {{ formatArea(props.row.area) }}
              </q-td>
            </template>

        <!-- Modal Ubicación Geográfica -->
          <template v-slot:body-cell-ubicacionGeografica="props">
            <q-td :props="props" style="text-align: center;">
              <q-btn class="segui" @click="openUbicacionModal(props.row)" icon="location_on">
                <q-tooltip>Ver ubicación geográfica</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:body-cell-limites="props">
            <q-td :props="props" style="text-align: center;">
              <q-btn class="segui" @click="openLimitesModal(props.row)" icon="crop_free">
                <q-tooltip>Ver límites</q-tooltip>
              </q-btn>
            </q-td>
          </template>


            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editar(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Finca
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="editarestado(props.row)"
                  v-if="props.row.estado == 0"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Activar
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_off"
                  @click="editarestado(props.row)"
                  v-if="props.row.estado == 1"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px"
                  >
                    Desactivar
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-chip :color="props.row.estado == 1 ? 'green' : 'red'" dark>
                  {{ props.row.estado == 1 ? "Activo" : "Inactivo" }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="q-pa-md text-center">
                <q-icon
                  name="sentiment_dissatisfied"
                  size="lg"
                  class="q-mr-sm"
                />
                <div class="text-h6">No hay Fincas disponibles</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card style="width: 400px; border-radius: 15px">
          <q-card-section>
            <q-form @submit.prevent="agregarOEditarFinca">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 20px;
                  border: 2px solid #000000;
                  border-radius: 8px;
                "
              >
                <q-avatar size="80px">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Finca
                </h1>
              </div>
              <q-select standout v-model="idAdministrador" :options="organizarAdmins" option-value="valor" option-label="label" label="Administrador" style="background-color: #grey; margin-bottom: 20px" />
              <q-input v-model.trim="nombre" label="Nombre de la Finca" required />
              <q-input v-model.trim="direccion" label="Dirección" required />
              <q-input v-model.trim="rut" label="RUT" required />
              <q-input v-model.trim="area" label="Área" required />
              <q-input v-model.trim="ciudad" label="Ciudad" required />
              <q-input v-model.trim="departamento" label="Departamento" required />
              <q-input v-model="ubicacionGeografica[0].latitud" label="Latitud" required />
              <q-input v-model="ubicacionGeografica[0].longitud" label="Longitud" required />
              <q-input v-model="limites[0].norte" label="Límite Norte" required />
              <q-input v-model="limites[0].sur" label="Límite Sur" required />
              <q-input v-model="limites[0].este" label="Límite Este" required />
              <q-input v-model="limites[0].oeste" label="Límite Oeste" required />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cerrar"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useFinca.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
        <q-dialog v-model="ubicacionModalOpen" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Ubicación Geográfica</div>
            </q-card-section>

            <q-card-section>
              <q-table
                :rows="selectedFinca?.ubicacionGeografica || []"
                :columns="ubicolumns"
                row-key="latitud"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" @click="ubicacionModalOpen = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Modal Límites -->
        <q-dialog v-model="limitesModalOpen" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Límites</div>
            </q-card-section>

            <q-card-section>
<q-table
  :rows="selectedFinca?.limites ? selectedFinca.limites : []"
  :columns="limitescolumns"
  row-key="norte"
/>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" @click="limitesModalOpen = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
  </q-page>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useFincasStore } from "../stores/fincas.js";
import { useAdministradorStore } from "../stores/administrador.js";
import { useQuasar } from 'quasar'

const $q = useQuasar();
const useAdmin = useAdministradorStore();
const useFinca = useFincasStore();

const showForm = ref(false);
const nombre = ref("");
const idAdministrador = ref("");
const direccion = ref("");
const rut = ref("");
const ubicacionGeografica = ref([{ latitud: '', longitud: ''}]);
const area = ref("");
const ciudad = ref("");
const departamento = ref("");
const limites = ref([{ norte: '', sur: '', este: '', oeste: ''}]);
const selectedFincaId = ref("");
const fincaId = ref(null);

const rows = ref([]);
const columns = ref([
  { name: "idAdministrador", label: "Administrador", align: "center", field: "idAdministrador" },
  { name: "nombre", label: "Nombre Finca", align: "center", field: "nombre", sortable: true },
  { name: "direccion", label: "Dirección", align: "center", field: "direccion" },
  { name: "ubicacionGeografica", label: "ubicacion Geografica", align: "center", field: "ubicacionGeografica" },
  { name: "ciudad", label: "Ciudad", align: "center", field: "ciudad" },
  { name: "limites", label: "limites", align: "center", field: "limites" },
  { name: "rut", label: "RUT", align: "center", field: "rut" },
  { name: "area", label: "Área", align: "center", field: "area" },
  { name: "departamento", label: "Departamento", align: "center", field: "departamento" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

let adminTodo = ref([]);

onMounted(async () => {
  await listarFincas();
  await listarAdministradores();
});

async function listarAdministradores() {
  try {
    const res = await useAdmin.getAdministradoresActivos();
    if (res && Array.isArray(res.activados)) {
      adminTodo.value = res.activados;
    } else {
      console.error("Respuesta inesperada al listar admins:", res);
      adminTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar admins:", error);
    adminTodo.value = [];
  }
}

const organizarAdmins = computed(() => {
  return adminTodo.value.map((element) => ({        
    label: `${element.nombre} - ${element.cedula}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
});

function guardarFincaReciente(id) {
  localStorage.setItem('FincaReciente', id);
}

function obtenerFincaReciente() {
  return localStorage.getItem('FincaReciente');
}

async function listarFincas() {
  try {
    const res = await useFinca.listarFinca();
    if (res && Array.isArray(res.finca)) {
      const FincaRecienteId = obtenerFincaReciente();
      rows.value = res.finca.map(finca => ({
        ...finca,
        adminNombre: getAdminNombre(finca.idAdministrador)
      })).sort((a, b) => {
        if (a._id === FincaRecienteId) return -1;
        if (b._id === FincaRecienteId) return 1;
        return 0;
      });
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar fincas:", error);
  }
}

function getAdminNombre(id) {
  const admin = adminTodo.value.find(admin => admin._id === id);
  if (admin) {
    return `${admin.nombre} - ${admin.cedula}`;
  } else {
    console.warn(`Administrador no encontrado para el ID: ${id}`);
    return 'Admin no encontrado';
  }
}

async function listaractivados() {
  try {
    const res = await useFinca.listaractivados();
    if (res?.data?.activados) {
      rows.value = res.data.activados;
    } else {
      console.error("Datos inesperados del servidor:", res);
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al listar fincas activas:", error);
    rows.value = [];
  }
}

async function listardesactivados() {
  try {
    const res = await useFinca.listardesactivados();
    if (res?.data?.desactivados) {
      rows.value = res.data.desactivados;
    } else {
      console.error("Datos inesperados del servidor:", res);
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al listar fincas desactivadas:", error);
    rows.value = [];
  }
}

async function agregarOEditarFinca() {
  if (await validar()) {
    const todo = {
      idAdministrador: idAdministrador.value.valor,
      nombre: nombre.value,
      direccion: direccion.value,
      rut: rut.value,
      ubicacionGeografica: ubicacionGeografica.value,
      area: area.value,
      ciudad: ciudad.value,
      departamento: departamento.value,
      limites: limites.value,
    };

    try {
      let response;
      if (fincaId.value) {
        response = await useFinca.putFinca(fincaId.value, todo);
      } else {
        response = await useFinca.postFincas(todo);
      }

      if (response.status === 200) {
        if (!fincaId.value) {
          guardarFincaReciente(response.data.finca._id);
        }
        await listarFincas();
        await listarAdministradores();
        showForm.value = false;
        // mostrarMensajeExito(fincaId.value ? "Finca actualizada exitosamente" : "Finca agregada exitosamente");
      } else {
        console.error('Respuesta inesperada del servidor:', response);
      }
    } catch (error) {
      console.error("Error al guardar/actualizar finca:", error);
      mostrarMensajeError("Error al guardar/actualizar finca");
    }
  }
}

function editar(info) {
  fincaId.value = info._id;
  nombre.value = info.nombre;
  ciudad.value = info.ciudad;
  direccion.value = info.direccion;
  rut.value = info.rut;
  ubicacionGeografica.value = info.ubicacionGeografica;
  area.value = info.area;
  const selectedAdmin = adminTodo.value.find(admin => admin._id === info.idAdministrador);
  if (selectedAdmin) {
    idAdministrador.value = {
      label: `${selectedAdmin.nombre} - ${selectedAdmin.cedula}`,
      valor: selectedAdmin._id,
      nombre: selectedAdmin.nombre
    };
  }
  departamento.value = info.departamento;
  limites.value = info.limites;
  showForm.value = true;
}

async function editarestado(info) {
  try {
    if (info.estado == 1) {
      await useFinca.putDesactivarFinca(info._id);
    } else if (info.estado == 0) {
      await useFinca.putActivarFinca(info._id);
    }
    await listarFincas();
    mostrarMensajeExito("Estado de la finca actualizado exitosamente");
  } catch (error) {
    console.error("Error al cambiar el estado de la finca:", error);
    mostrarMensajeError("Error al cambiar el estado de la finca");
  }
}

async function buscarFincaPorNombre(selectedFincaId) {
  try {
    const res = await useFinca.listarFinca(selectedFincaId);
    if (res && Array.isArray(res.finca)) {
      rows.value = res.finca.map(finca => ({
        ...finca,
        adminNombre: getAdminNombre(finca.idAdministrador)
      }));
    } else {
      console.error("Datos inesperados del servidor:", res);
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al buscar finca por nombre:", error);
    rows.value = [];
  }
}

async function validar() {
  let verificado = true;

  if (nombre.value === "") {
    mostrarMensajeError("El nombre está vacío");
    verificado = false;
  }
  if (idAdministrador.value === "") {
    mostrarMensajeError("El Administrador está vacío");
    verificado = false;
  }
  if (direccion.value === "") {
    mostrarMensajeError("La dirección está vacía");
    verificado = false;
  }
  if (rut.value === "") {
    mostrarMensajeError("Digite RUT");
    verificado = false;
  }
  if (ubicacionGeografica.value[0].latitud === "") {
    mostrarMensajeError("Digite una latitud");
    verificado = false;
  }
  if (ubicacionGeografica.value[0].longitud === "") {
    mostrarMensajeError("Digite una longitud");
    verificado = false;
  }
  if (ciudad.value === "") {
    mostrarMensajeError("La ciudad está vacía");
    verificado = false;
  }
  if (area.value === "") {
    mostrarMensajeError("Digite área");
    verificado = false;
  }
  if (departamento.value === "") {
    mostrarMensajeError("Debe ingresar un departamento");
    verificado = false;
  }
  if (limites.value[0].norte === "") {
    mostrarMensajeError("Debe ingresar el límite norte");
    verificado = false;
  }
  if (limites.value[0].sur === "") {
    mostrarMensajeError("Debe ingresar el límite sur");
    verificado = false;
  }
  if (limites.value[0].este === "") {
    mostrarMensajeError("Debe ingresar el límite este");
    verificado = false;
  }
  if (limites.value[0].oeste === "") {
    mostrarMensajeError("Debe ingresar el límite oeste");
    verificado = false;
  }

  return verificado;
}

function mostrarMensajeError(mensaje) {
  $q.notify({
    type: "negative",
    message: mensaje,
    position: "bottom-right",
  });
}

function mostrarMensajeExito(mensaje) {
  $q.notify({
    type: "positive",
    message: mensaje,
    position: "bottom-right",
  });
}

function cerrar() {
  showForm.value = false;
  fincaId.value = null;
  nombre.value = "";
  idAdministrador.value = "";
  direccion.value = "";
  rut.value = "";
  ubicacionGeografica.value = [{ latitud: '', longitud: '' }];
  area.value = "";
  ciudad.value = "";
  departamento.value = "";
  limites.value = [{ norte: '', sur: '', este: '', oeste: '' }];
}

// Computed property para las opciones del select de fincas
const fincaOptions = computed(() => {
  return rows.value.map(finca => ({
    label: finca.nombre,
    value: finca._id
  }));
});

// Llamada inicial para cargar las fincas
listarFincas();


const ubicacionModalOpen = ref(false);
const limitesModalOpen = ref(false);
const selectedFinca = ref(null);

const openUbicacionModal = (finca) => {
  console.log("Abriendo modal de ubicación para:", finca);
  selectedFinca.value = finca;
  ubicacionModalOpen.value = true;
  console.log("ubicacionModalOpen:", ubicacionModalOpen.value);
  console.log("Datos de ubicación:", selectedFinca.value.ubicacionGeografica);
};

const openLimitesModal = (finca) => {
  console.log("Abriendo modal de límites para:", finca);
  selectedFinca.value = { ...finca };  // Crear una copia para evitar problemas de reactividad
  limitesModalOpen.value = true;
  console.log("limitesModalOpen:", limitesModalOpen.value);
  console.log("Datos de límites:", selectedFinca.value.limites);
};

const ubicolumns = ref([
  { name: "latitud", label: "Latitud", field: "latitud", align: "center" },
  { name: "longitud", label: "Longitud", field: "longitud", align: "center" },
]);

const limitescolumns = ref([
  { name: "norte", label: "Norte", field: "norte", align: "center" },
  { name: "sur", label: "Sur", field: "sur", align: "center" },
  { name: "este", label: "Este", field: "este", align: "center" },
  { name: "oeste", label: "Oeste", field: "oeste", align: "center" },
]);

const formatArea = (area) => {
  return `${area} m²`;
};

</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>

<style scoped>

/* Estilos para el contenedor principal */
.container {
  width: 97vmax;
  margin: 0 auto;
  min-height:auto;

overflow:hidden !important;
}

body{
  background-color: red;
}


.container::-webkit-scrollbar {
  display: none !important; /* Oculta el scrollbar */
}

.departamento-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.5); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.departamento-modal-contenedor {
  position: relative;
   /* background-color: rgb(226, 226, 226); */
   /* background-color: #3876d3; */

  /*padding: 20px;
  border-radius: 8px; */
  max-width: 400px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.departamento-modal-imagen {
  max-width: 50%;
  max-height: 50%;
  object-fit: contain;
}
.departamento-modal-cerrar {
  position: absolute;
  top: 30px;
  right: 30px;
}

/* estilos para el nombre dentro del seguimiento */
.text-h6{
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-transform: uppercase;
}
/* Estilos para el título */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
/**/
/* Estilos para los botones */

.departamentoimc{
  width:90%;
  height:40%
}
.departamentocerrar{
    width:10%;
  height: 10px;
  background-color: rgb(214, 55, 55);
  margin-top: 2%;
}
.buttonX {
  background-color: #ffffff00;
  border: 0 solid #cccccc00;
  color: #504d4d;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  transition: transform .2s;
}

.buttonX:hover {
    font-size: 25px;
  transform: scale(1.2);
  color: #000000;
}


.button {
 
  border: none;
  color: black;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  margin-bottom: 10px;
  box-shadow: 5px 4px 8px black;
  border-radius: 8px;
}

.button:hover {
  background-color: #77c57b;
  box-shadow: 3px 2px 10px black;
}

/* Estilos para los inputs */
.input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 4px;
}

/* Estilos para la tabla */
.table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #f8141400;
  margin-top: 7vmax;
}

.table th, .table td {

  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}
.tituloTabla{
margin-top: 1vmax;
  font-size: xx-large;
  display: flex;
  text-align: center;
  justify-content: center;

}



/* Estilos para las opciones de la tabla */
.option-button {
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 2px;
  border-radius: 4px;
}

.option-button:hover {
  background-color: #dadada;
}


.crearfinca {
  background-color: #f9f9f9;
  padding: 20px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   margin-top: 1px;
width: 50vmax;
height: 90vh;
overflow: scroll;
border-color: green;
margin-left: auto;
margin-right: auto;
position: absolute;
top: 54%;
left: 50%;
transform: translate(-50%,-50%);
}

/* -------------------------------------- */

.crearfinca::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.crearfinca::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2vmax;
}

.crearfinca::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2vmax;
}

.crearfinca::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* -------------------------------------- */


.encabezadoCrear{
    display: flex;
    justify-content: space-between;
}

.crearfinca h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.crearfinca input[type="text"],
.crearfinca input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.crearfinca input[type="text"]:focus,
.crearfinca input[type="date"]:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 5px #66afe9;
}

.crearfinca input[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.crearfinca input[type="submit"]:hover {
  background-color: #45a049;
}

.q-dialog {
  width: 80%;
  max-width: 600px;
}

.seguimiento-entry {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.custom-select {
 position:absolute;
  width: 10vmax;
  height: 4vmin;
  border-radius: 4vmin;
  right: 1%;
  margin-top:0.8vmin;
  z-index: 1;
  box-shadow: 0px 2px 5px black; 
  border: none;
  outline: none;
}
.tablaselect{
  display: flex;
  position: absolute;
  width: 95%;
  margin-top: 6vmax;
}

.contenedorFiltro{
  display: flex;
  justify-content: flex-end;
  width: 100%;
  
}

.custom-select2 {
 position:absolute;
  width: 10vmax;
  height: 4vmin;
  border-radius: 4vmin;
  right: 15%;
  margin-top:0.8vmin;
  z-index: 1;
  box-shadow: 0px 2px 5px black; 
  border: none;
  outline: none;
}

.inputlistarcumple{
  position:absolute;
  width: auto;
  height: 4.5vmin;
  background-color: rgba(16, 16, 16, 0);
  right: 15%;
  margin-top:0.8vmin;
  z-index: 1;
  display: flex;
  flex-direction: row;

gap:1vmin;
border-radius: 1vmin;
align-items: center;
}

.inputlistarn{
  position:absolute;
  width:auto;
  height: 4.5vmin;
  gap: 1vmin;
  background-color: rgba(16, 16, 16, 0);
  right: 15%;
  margin-top:0.5vmin;
  z-index: 1;
  display: flex;
  flex-direction: row;
align-items: center;

}

.inputn{
  width: 15vmax;
  margin: 8px 0;
  height: 2.5vmin;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 1vmin;
  border: solid 1.5px black;
}
.inputc{
  width: 10vmax;
  margin: 8px 0;
  height: 2.5vmin;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 1vmin;
  border: solid 1.5px black;
}

#buttonf{
  padding: 0px;
  width: 8vmin;
  height: 2.5vmin;
  display: flex;
  text-align: center;
  padding: 0px;
  font-size: small;
  margin: 0px;
  margin-bottom: 1px;
}


/* estilos pa area */
.truncated-text {
  display: inline-block;
  max-width: 150px;
  overflow: scroll;
  scrollbar-width: none;
  text-overflow:initial;
  white-space: nowrap;
  cursor: pointer;
}
.q-tooltip {
  max-width: 300px;
  white-space: normal;
  word-break: break-word;
}
.textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
}

.filtro{
background-color: #0303039f;
width: 100%;
height:  100%;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
}
.nombreydepartamento, .formulariosegui{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center ;
}

/* .formulariosegui{
color:black;
}
.inputsegui{
width: 60%;
height: 40px;
margin:2%;
margin-left: 20%;
border: 1px solid green
}
.titulosegui{
color: rgb(80, 80, 248);
font-family: 'Times New Roman', Times, serif;
font-size: 30px;
text-align: center;
}
.botonesegui{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  margin-left: 10%;
} */
 .formulariosegui {
  color: #333;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.inputsegui {
  width: 100%;
  height: 60px;
  margin: 10px 0;
  padding: 0 10px;
  /* border: 1px solid #4CAF50; */
  border-radius: 4px;
  font-size: 16px;
}

.titulosegui {
  color: #3f51b5;
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.botonesegui {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.tablalineas{
  border:2px solid black
}

.btndesac {
  box-shadow: none !important;
  border: none !important;
}
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-close {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>