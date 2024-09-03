<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Siembra</div>
      <q-btn
        label="Agregar Siembra"
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
          <q-item clickable v-ripple @click="listarSiembra">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSiembraActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSiembraInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedSiembraId"
        label="Seleccionar Siembra"
        :options="siembraOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerSiembraporID"
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
<template v-slot:body-cell-idCultivo="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.cultivonombre }}</p>
  </q-td>
</template>

<template v-slot:body-cell-idEmpleado="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.empleadonombre }}</p>
  </q-td>
</template>
<template v-slot:body-cell-idInventario="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.inventariotipo }}</p>
  </q-td>
</template>
<template v-slot:body-cell-fechacosecha="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fechacosecha) }}</p>
  </q-td>
</template>
<template v-slot:body-cell-fechasiembra="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fechasiembra) }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarSiembra(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Siembra
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarSiembra(props.row)"
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
                  @click="desactivarSiembra(props.row)"
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
                <div class="text-h6">No hay Siembra disponible</div>
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
            <q-form @submit.prevent="agregarOEditarSiembra">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 20px;
                  border: 2px solid #000000; /* Color del borde */
                  border-radius: 8px; /* Borde redondeado */
                "
              >
                <q-avatar size="80px">
                  <img
                    src="https://e7.pngegg.com/pngimages/889/101/png-clipart-computer-icons-natural-environment-nature-natural-resource-coral-collection-leaf-hand.png"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Siembra
                </h1>
              </div>
          <q-select standout v-model="idCultivo" :options="organizarCultivos" option-value="valor" option-label="label" label="Cultivos" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idEmpleado" :options="organizarEmpleados" option-value="valor" option-label="label" label="Empleados" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idInventario" :options="organizarInventario" option-value="valor" option-label="label" label="Inventario" style="background-color: #grey; margin-bottom: 20px" />

              <!-- <q-input v-model.trim="transplante" label="Transplante" required /> -->
  <q-select 
    standout 
    v-model="transplanteBoolean" 
    :options="options" 
    label="Transplante" 
    style="background-color: #grey; margin-bottom: 20px"
  />
              <q-input v-model.trim="CultivoAnterior" label="Cultivo Anterior" required />
              <q-input v-model.trim="fechacosecha" type="Date" label="fecha de Cosecha" required />
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarSiembra"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useSiembra.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useSiembraStore } from "../stores/siembra.js";
import { useCultivosStore } from "../stores/cultivos.js";
const useCultivo = useCultivosStore();

import { useEmpleadosStore } from "../stores/empleados.js";
const useEmpleado = useEmpleadosStore();

import { useInventarioStore } from "../stores/inventario.js";
const useInventario = useInventarioStore();

const drawer = ref(false);
const showForm = ref(false);
const fechacosecha = ref("");
const idCultivo = ref("");
const idEmpleado = ref("");
const idInventario = ref("");
const transplante = ref("");
const CultivoAnterior = ref("");
const selectedSiembraId = ref("");
const transplanteBoolean = ref(false); // Variable para el booleano

const siembraId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idCultivo", label: "Cultivo", align: "center",     field: row => getCultivonombre(row.idCultivo) },
  { name: "idEmpleado", label: "Empleado", align: "center",     field: row => getEmpleadonombre(row.idEmpleado) },
  { name: "idInventario", label: "Inventario", align: "center",     field: row => getInventariotipo(row.idInventario) },

{
  name: "transplante",
  label: "Transplante",
  align: "center",
  field: row => (row.transplante ? "sí" : "no"),  // Transforma true en "sí" y false en "no"
},
  { name: "CultivoAnterior", label: "Cultivo Anterior", align: "center", field: "CultivoAnterior" },
  { name: "fechacosecha", label: "Fecha de Cosecha", align: "center", field: "fechacosecha" },
  { name: "fechasiembra", label: "fecha de Siembra", align: "center", field: "fechasiembra" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const siembraOptions = ref([]);

const useSiembra = useSiembraStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}


onMounted(async () => {
  await listarCultivos();
  await listarEmpleados();
  await listarInventario();
  await listarSiembra();

});

  let cultivoTodo = ref([]);

async function listarCultivos() {
  try {
    const res = await useCultivo.getCultivosActivos();
    console.log("Respuesta de listaractivados:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      cultivoTodo.value = res.activados;
      console.log("Cultivos cargados:", cultivoTodo.value);
    } else {
      console.error("Respuesta inesperada al listar cultivos:", res);
      cultivoTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar cultivos:", error);
    cultivoTodo.value = [];
  }
}


const organizarCultivos = computed(() => {
  console.log("Calculando organizarCultivos", cultivoTodo.value);
  return cultivoTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.tipo}`,
    value: element._id,
    nombre: element.nombre,
  }));
});
 let inventarioTodo = ref([]);
  
async function listarInventario() {
  try {
    const res = await useInventario.getInventarioActivas();
    console.log("Respuesta de listaractivados:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      inventarioTodo.value = res.activados;
      console.log("Inventario cargados:", inventarioTodo.value);
    } else {
      console.error("Respuesta inesperada al listar Inventario:", res);
      inventarioTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar Inventario:", error);
    inventarioTodo.value = [];
  }
}
const organizarInventario = computed(() => {
  console.log("Calculando organizarInventario", inventarioTodo.value);
  return inventarioTodo.value.map((element) => ({
    label: `${element.tipo} - ${element.observacion}`,
    value: element._id,
    nombre: element.nombre,
  }));
});
function getInventariotipo(id) {
  // console.log("Buscando inventario con id:", id);
  console.log("inventarioTodo:", inventarioTodo.value);
  if (!id) return 'inventario no especificada';
  if (inventarioTodo.value.length === 0) {
    // console.log("inventarioTodo está vacío. Intentando cargar inventarios...");
    listarSiembra();
    return 'Cargando...';
  }
  const inventario = inventarioTodo.value.find(inventario => inventario._id === id);
  console.log("inventario encontrada:", inventario);
  return inventario ? `${inventario.tipo} - ${inventario.observacion}` : 'inventario no encontrado';
}

let empleadoTodo = ref([]);


async function listarEmpleados() {
  try {
    const res = await useEmpleado.getEmpleadosActivos();
    console.log("Respuesta de getEmpleadosActivos:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      empleadoTodo.value = res.activados;
      console.log("Empleados cargados:", empleadoTodo.value);
    } else {
      console.error("Respuesta inesperada al listar empleados:", res);
      empleadoTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar empleados:", error);
    empleadoTodo.value = [];
  }
}

const organizarEmpleados = computed(() => {
  console.log("Calculando organizarEmpleados", empleadoTodo.value);
  return empleadoTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.documento}`,
    value: element._id,
    nombre: element.nombre,
  }));
});

function guardarSiembraReciente(id) {
  localStorage.setItem('SiembraReciente', id);
}

function obtenerSiembraReciente() {
  return localStorage.getItem('SiembraReciente');
}

async function listarSiembra() {
  console.log("Antes de listar siembras, empleadoTodo:", empleadoTodo.value);
  try {
    const res = await useSiembra.getSiembra();
    console.log("Respuesta de getSiembra:", res);
    if (res && Array.isArray(res.siembra)) {
      const SiembraRecienteId = obtenerSiembraReciente();
      rows.value = res.siembra.map(siembra => {
        return {
          ...siembra,
          cultivonombre: getCultivonombre(siembra.idCultivo),
          inventariotipo: getInventariotipo(siembra.idInventario),
          empleadonombre: getEmpleadonombre(siembra.idEmpleado),
        };
      }).sort((a, b) => {
        if (a._id === SiembraRecienteId) return -1;
        if (b._id === SiembraRecienteId) return 1;
        return 0;
      });
      if (SiembraRecienteId) {
        selectedSiembraId.value = SiembraRecienteId;
        obtenerSiembraporID(SiembraRecienteId);
      }
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al listar siembras:", error);
    rows.value = [];
  }
}



function getCultivonombre(id) {
  // console.log("Buscando cultivo con id:", id);
  console.log("cultivoTodo:", cultivoTodo.value);
  if (!id) return 'cultivo no especificada';
  if (cultivoTodo.value.length === 0) {
    // console.log("cultivoTodo está vacío. Intentando cargar cultivos...");
    listarSiembra();
    return 'Cargando...';
  }
  const cultivo = cultivoTodo.value.find(cultivo => cultivo._id === id);
  console.log("cultivo encontrada:", cultivo);
  return cultivo ? `${cultivo.nombre} - ${cultivo.tipo}` : 'cultivo no encontrado';
}
function getEmpleadonombre(id) {
  console.log("Buscando empleado con id:", id);
  console.log("Estado actual de empleadoTodo:", empleadoTodo.value);
  if (!id) return 'empleado no especificada';
  if (empleadoTodo.value.length === 0) {
    listarEmpleados();
    return 'Cargando...';
  }
  const empleado = empleadoTodo.value.find(empleado => empleado._id === id);
  console.log("Empleado encontrado:", empleado);
  return empleado ? `${empleado.nombre} - ${empleado.documento}` : 'empleado no encontrado';
}


async function listarSiembraActivos() {
  try {
    const r = await useSiembra.getSiembraActivos();
    if (r && Array.isArray(r.activados)) {
      const SiembraRecienteId = obtenerSiembraReciente();
      rows.value = r.activados.map(siembra => {
        const cultivonombre = getCultivonombre(siembra.idCultivo);
        const empleadonombre = getEmpleadonombre(siembra.idEmpleado);
        const inventariotipo = getInventariotipo(siembra.idInventario);
        return {
          ...siembra,
          cultivonombre: cultivonombre,
          inventariotipo: inventariotipo,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === SiembraRecienteId) return -1;
        if (b._id === SiembraRecienteId) return 1;
        return 0;
      });
      console.log("Filas de siembra:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar siembra:", error);
  }
}

async function listarSiembraInactivos() {
  try {
    const r = await useSiembra.getSiembraInactivos();
    if (r && Array.isArray(r.desactivados)) {
      const SiembraRecienteId = obtenerSiembraReciente();
      rows.value = r.desactivados.map(siembra => {
        const cultivonombre = getCultivonombre(siembra.idCultivo);
        const inventariotipo = getInventariotipo(siembra.idInventario);
        const empleadonombre = getEmpleadonombre(siembra.idEmpleado);
        return {
          ...siembra,
          cultivonombre: cultivonombre,
          inventariotipo: inventariotipo,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === SiembraRecienteId) return -1;
        if (b._id === SiembraRecienteId) return 1;
        return 0;
      });
      console.log("Filas de siembra:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar siembra:", error);
  }
}

async function agregarOEditarSiembra() {
  try {
    let idCultivoValue;
    if (typeof idCultivo.value === 'object' && idCultivo.value !== null) {
      idCultivoValue = idCultivo.value.value || idCultivo.value.valor;
    } else {
      idCultivoValue = idCultivo.value;
    }
let idEmpleadoValue;
    if (typeof idEmpleado.value === 'object' && idEmpleado.value !== null) {
      idEmpleadoValue = idEmpleado.value.value || idEmpleado.value.valor;
    } else {
      idEmpleadoValue = idEmpleado.value;
    }
    let idInventarioValue;
    if (typeof idInventario.value === 'object' && idInventario.value !== null) {
      idInventarioValue = idInventario.value.value || idInventario.value.valor;
    } else {
      idInventarioValue = idInventario.value;
    }
        const transplanteValue = transplanteBoolean.value ? transplanteBoolean.value.value : transplanteBoolean.value; // Extraer valor booleano

    const data = {
      idCultivo: idCultivoValue,
      idEmpleado: idEmpleadoValue,
      idInventario: idInventarioValue,
      transplante: transplanteValue, // Usando transplanteBoolean
      CultivoAnterior: CultivoAnterior.value,
      fechacosecha: fechacosecha.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (siembraId.value) {
      result = await useSiembra.putSiembra(siembraId.value, data);
    } else {
      result = await useSiembra.postSiembra(data);
    }

    if (result.success) {
      await listarSiembra();
      showForm.value = false;
      // Limpiar los campos después de guardar
      cancelarAgregarSiembra();
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error al agregar/editar siembra:", error);
  }
}


function cancelarAgregarSiembra() {
  showForm.value = false;
  siembraId.value = null;
  idCultivo.value = "";
  idEmpleado.value = "";
  idInventario.value = "";
  transplanteBoolean.value = false; // Resetear a false
  CultivoAnterior.value = "";
  fechacosecha.value = "";
}

function editarSiembra(siembra) {
    console.log("Fechas originales:", {
    fechacosecha: siembra.fechacosecha,
  });
  // Handle cultivo selection
  const selectedCultivo = cultivoTodo.value.find(c => c._id === siembra.idCultivo);
  if (selectedCultivo) {
    idCultivo.value = {
      label: `${selectedCultivo.nombre} - ${selectedCultivo.tipo}`,
      value: selectedCultivo._id,
      nombre: selectedCultivo.nombre
    };
  } else {
    console.error("No se encontró el cultivo correspondiente");
    idCultivo.value = null;
  }

  const selectedEmpleado = empleadoTodo.value.find(e => e._id === siembra.idEmpleado);
  if (selectedEmpleado) {
    idEmpleado.value = {
      label: `${selectedEmpleado.nombre} - ${selectedEmpleado.documento}`,
      value: selectedEmpleado._id,
      nombre: selectedEmpleado.nombre
    };
  }else {
    console.error("No se encontró el empleado correspondiente");
    idEmpleado.value = null;
  }
    const selectedInventario = inventarioTodo.value.find(e => e._id === siembra.idInventario);
  if (selectedInventario) {
    idInventario.value = {
      label: `${selectedInventario.tipo} - ${selectedInventario.observacion}`,
      value: selectedInventario._id,
      nombre: selectedInventario.nombre
    };
  } else {
    console.error("No se encontró el empleado correspondiente");
    idInventario.value = null;
  }

  transplanteBoolean.value = siembra.transplante ? { label: 'Sí', value: true } : { label: 'No', value: false };
  CultivoAnterior.value = siembra.CultivoAnterior;
  fechacosecha.value = datee(siembra.fechacosecha);
  siembraId.value = siembra._id;
  showForm.value = true;

  console.log("Editando siembra:", { 
    ...siembra, 
    idCultivo: idCultivo.value, 
    idEmpleado: idEmpleado.value,
    idInventario: idInventario.value,
    transplante: transplante.value,
    fechacosecha: fechacosecha.value,
  });
}


async function obtenerSiembraporID(selectedSiembraId) {
  try {
    const siembra = await useSiembra.getSiembrasporId(selectedSiembraId);
    if (siembra) {
      rows.value = [siembra];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarSiembra(siembra) {
  try {
    await useSiembra.toggleEstadoSiembra(siembra._id, true);
    listarSiembra();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarSiembra(siembra) {
  try {
    await useSiembra.toggleEstadoSiembra(siembra._id, false);
    listarSiembra();
  } catch (error) {
    console.error(error);
  }
}

listarSiembra(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarSiembra();
  }
});

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

//       const model = ref(null);
//       const options = [
//         'Si', 'No'
//       ];
//       const transplanteBoolean = computed({
//   get() {
//     return transplante.value === 'Si';
//   },
//   set(value) {
//     transplante.value = value ? 'Si' : 'No';
//   }
// });
const options = [
  { label: 'Sí', value: true },
  { label: 'No', value: false },
];
function datee(dateString) {
  if (!dateString) return '';
  
  // Si la fecha ya está en formato YYYY-MM-DD, simplemente devuélvela
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Si la fecha está en formato DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Para otros formatos, intenta usar Date
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  // Si nada funciona, devuelve la cadena original
  console.error("Formato de fecha no reconocido:", dateString);
  return dateString;
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
