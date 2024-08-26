<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Procesos</div>
      <q-btn
        label="Agregar Proceso"
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
          <q-item clickable v-ripple @click="listarProcesos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarProcesosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarProcesosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedPorcesosId"
        label="Seleccionar Proceso"
        :options="procesosOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerProcesosporID"
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
<template v-slot:body-cell-fechaInicio="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fechaInicio) }}</p>
  </q-td>
</template>
<template v-slot:body-cell-fechaFinal="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fechaFinal) }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarProceso(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Proceso
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarProceso(props.row)"
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
                  @click="desactivarProceso(props.row)"
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
                <div class="text-h6">No hay Procesos disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarProceso">
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
                  Proceso
                </h1>
              </div>
          <q-select standout v-model="idCultivo" :options="organizarCultivos" option-value="valor" option-label="label" label="Cultivos" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idEmpleado" :options="organizarEmpleados" option-value="valor" option-label="label" label="Empleados" style="background-color: #grey; margin-bottom: 20px" />

              <q-input v-model.trim="descripcion" label="Descripcion" required />
              <q-input v-model.trim="tipo" label="Tipo de Proceso" required />
              <q-input v-model.trim="fechaInicio" type="Date" label="Fecha de Inicio" required />
              <q-input v-model.trim="fechaFinal" type="Date" label="fecha Final" required />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarProduccion"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useProceso.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useProcesosStore } from "../stores/procesos.js";
import { useCultivosStore } from "../stores/cultivos.js";
const useCultivo = useCultivosStore();

import { useEmpleadosStore } from "../stores/empleados.js";
const useEmpleado = useEmpleadosStore();

const drawer = ref(false);
const showForm = ref(false);
const fechaInicio = ref("");
const fechaFinal = ref("");
const idCultivo = ref("");
const idEmpleado = ref("");
const descripcion = ref("");
const tipo = ref("");
const selectedPorcesosId = ref("");
const produccionId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idCultivo", label: "Cultivo", align: "center",     field: row => getCultivonombre(row.idCultivo) },
  { name: "idEmpleado", label: "Empleado", align: "center",     field: row => getEmpleadonombre(row.idEmpleado) },

  {
    name: "descripcion",
    label: "Descripcion",
    align: "center",
    field: "descripcion",
  },
  { name: "tipo", label: "Tipo de Proceso", align: "center", field: "tipo" },
  { name: "fechaInicio", label: "Fecha de Inicio", align: "center", field: "fechaInicio" },
  { name: "fechaFinal", label: "fecha Final", align: "center", field: "fechaFinal" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const procesosOptions = ref([]);

const useProceso = useProcesosStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let cultivoTodo = ref([]);

onMounted(async () => {
  await listarCultivos();
  await listarEmpleados();
  await listarProcesos();

});

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

let empleadoTodo = ref([]);


async function listarEmpleados() {
  try {
    const res = await useEmpleado.getEmpleadosActivos();
    console.log("Respuesta de getEmpleadosActivos:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      empleadoTodo.value = res.activados;
      console.log("empleados cargados:", empleadoTodo.value);
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

function guardarProcesoReciente(id) {
  localStorage.setItem('ProcesoReciente', id);
}

function obtenerProcesoReciente() {
  return localStorage.getItem('ProcesoReciente');
}

async function listarProcesos() {
  try {
    const res = await useProceso.getProceso();
    console.log("Respuesta de getProceso:", res);
    if (res && Array.isArray(res.proceso)) {
      const ProcesoRecienteId = obtenerProcesoReciente();
      rows.value = res.proceso.map(proceso => {
        const cultivonombre = getCultivonombre(proceso.idCultivo);
        const empleadonombre = getEmpleadonombre(proceso.idEmpleado);
        return {
          ...proceso,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === ProcesoRecienteId) return -1;
        if (b._id === ProcesoRecienteId) return 1;
        return 0;
      });
      console.log("Filas de procesos:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar proceso:", error);
  }
}

function getCultivonombre(id) {
  // console.log("Buscando cultivo con id:", id);
  console.log("cultivoTodo:", cultivoTodo.value);
  if (!id) return 'cultivo no especificada';
  if (cultivoTodo.value.length === 0) {
    // console.log("cultivoTodo está vacío. Intentando cargar cultivos...");
    listarProcesos();
    return 'Cargando...';
  }
  const cultivo = cultivoTodo.value.find(cultivo => cultivo._id === id);
  console.log("cultivo encontrada:", cultivo);
  return cultivo ? `${cultivo.nombre} - ${cultivo.tipo}` : 'cultivo no encontrado';
}

function getEmpleadonombre(id) {
  // console.log("Buscando empleado con id:", id);
  console.log("empleadoTodo:", empleadoTodo.value);
  if (!id) return 'empleadp no especificada';
  if (empleadoTodo.value.length === 0) {
    // console.log("empleadoTodo está vacío. Intentando cargar empleados...");
    listarEmpleados();
    return 'Cargando...';
  }
  const empleado = empleadoTodo.value.find(empleado => empleado._id === id);
  console.log("empleado encontrada:", empleado);
  return empleado ? `${empleado.nombre} - ${empleado.documento}` : 'empleado no encontrado';
}

async function listarProcesosActivos() {
  try {
    const r = await useProceso.getProcesoActivos();
    if (r && Array.isArray(r.activados)) {
      const ProcesoRecienteId = obtenerProcesoReciente();
      rows.value = r.activados.map(proceso => {
        const cultivonombre = getCultivonombre(proceso.idCultivo);
        const empleadonombre = getEmpleadonombre(proceso.idEmpleado);
        return {
          ...proceso,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === ProcesoRecienteId) return -1;
        if (b._id === ProcesoRecienteId) return 1;
        return 0;
      });
      console.log("Filas de procesos:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar proceso:", error);
  }
}

async function listarProcesosInactivos() {
  try {
    const r = await useProceso.getProcesoInactivos();
    if (r && Array.isArray(r.desactivados)) {
      const ProcesoRecienteId = obtenerProcesoReciente();
      rows.value = r.desactivados.map(proceso => {
        const cultivonombre = getCultivonombre(proceso.idCultivo);
        const empleadonombre = getEmpleadonombre(proceso.idEmpleado);
        return {
          ...proceso,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === ProcesoRecienteId) return -1;
        if (b._id === ProcesoRecienteId) return 1;
        return 0;
      });
      console.log("Filas de procesos:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar proceso:", error);
  }
}

async function agregarOEditarProceso() {
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
    const data = {
      idCultivo: idCultivoValue,
      idEmpleado: idEmpleadoValue,
      descripcion: descripcion.value,
      tipo: tipo.value,
      fechaFinal: fechaFinal.value,
      fechaInicio: fechaInicio.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (produccionId.value) {
      result = await useProceso.putProceso(produccionId.value, data);
    } else {
      result = await useProceso.postProceso(data);
    }

    if (result.success) {
      await listarProcesos();
      showForm.value = false;
      // Limpiar los campos después de guardar
      cancelarAgregarProduccion();
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error al agregar/editar producción:", error);
  }
}


function cancelarAgregarProduccion() {
  showForm.value = false;
  produccionId.value = null;
  idCultivo.value = "";
  idEmpleado.value = "";
  descripcion.value = "";
  tipo.value = "";
  fechaInicio.value = "";
  fechaFinal.value = "";
}

function editarProceso(proceso) {
    console.log("Fechas originales:", {
    fechaInicio: proceso.fechaInicio,
    fechaFinal: proceso.fechaFinal
  });
  // Handle cultivo selection
  const selectedCultivo = cultivoTodo.value.find(c => c._id === proceso.idCultivo);
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

  // Handle empleado selection
  const selectedEmpleado = empleadoTodo.value.find(e => e._id === proceso.idEmpleado);
  if (selectedEmpleado) {
    idEmpleado.value = {
      label: `${selectedEmpleado.nombre} - ${selectedEmpleado.documento}`,
      value: selectedEmpleado._id,
      nombre: selectedEmpleado.nombre
    };
  } else {
    console.error("No se encontró el empleado correspondiente");
    idEmpleado.value = null;
  }

  descripcion.value = proceso.descripcion;
  tipo.value = proceso.tipo;

  // Convert dates to the format expected by your date inputs (assuming YYYY-MM-DD)
  fechaInicio.value = datee(proceso.fechaInicio);
  fechaFinal.value = datee(proceso.fechaFinal);

  produccionId.value = proceso._id;
  showForm.value = true;

  console.log("Editando proceso:", { 
    ...proceso, 
    idCultivo: idCultivo.value, 
    idEmpleado: idEmpleado.value,
    fechaInicio: fechaInicio.value,
    fechaFinal: fechaFinal.value
  });
}


async function obtenerProcesosporID(selectedPorcesosId) {
  try {
    const proceso = await useProceso.getProcesoByID(selectedPorcesosId);
    if (proceso) {
      rows.value = [proceso];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarProceso(proceso) {
  try {
    await useProceso.toggleEstadoProceso(proceso._id, true);
    listarProcesos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarProceso(proceso) {
  try {
    await useProceso.toggleEstadoProceso(proceso._id, false);
    listarProcesos();
  } catch (error) {
    console.error(error);
  }
}

listarProcesos(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarProduccion();
  }
});

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

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
