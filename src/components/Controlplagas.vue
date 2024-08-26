<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Control de plagas</div>
      <q-btn
        label="Agregar Control"
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
          <q-item clickable v-ripple @click="listarControl">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarControlActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarControlInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedControlplagaId"
        label="Seleccionar Control de plaga"
        :options="controlplagaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerControlplagaPorID"
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
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarControlplaga(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Control
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarControlplaga(props.row)"
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
                  @click="desactivarControlplaga(props.row)"
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
                <div class="text-h6">No hay Control disponible</div>
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
            <q-form @submit.prevent="agregarOEditarControlplaga">
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
                  Control de plaga
                </h1>
              </div>
          <q-select standout v-model="idCultivo" :options="organizarCultivos" option-value="valor" option-label="label" label="Cultivos" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idEmpleado" :options="organizarEmpleados" option-value="valor" option-label="label" label="Empleados" style="background-color: #grey; margin-bottom: 20px" />

              <q-input
                v-model.trim="tipoCultivo"
                label="tipo de Cultivo"
                required
              />
              <q-input v-model.trim="nombre" label="Nombre" required />
              <!-- <q-input v-model.trim="tipo" label="Tipo de control" required /> -->
               <q-select standout v-model="tipo" :options="options" label="Tipo" style="background-color: #grey; margin-bottom: 20px"
      />
              <q-input v-model.trim="ingredientesActivo" label="Ingredientes Activo" required />
              <q-input v-model.trim="dosis" label="Dosis" required />
              <q-input v-model.trim="observaciones" label="Observaciones" required />

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
      <div v-if="useControlplaga.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useControlplagaStore } from "../stores/control_plagas.js";
import { useCultivosStore } from "../stores/cultivos.js";
const useCultivo = useCultivosStore();

import { useEmpleadosStore } from "../stores/empleados.js";
const useEmpleado = useEmpleadosStore();

const drawer = ref(false);
const showForm = ref(false);
const tipoCultivo = ref("");
const ingredientesActivo = ref("");
const dosis = ref("");
const observaciones = ref("");
const idCultivo = ref("");
const idEmpleado = ref("");
const nombre = ref("");
const tipo = ref("");
const selectedControlplagaId = ref("");
const produccionId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idCultivo", label: "Cultivo", align: "center",     field: row => getCultivonombre(row.idCultivo) },
  { name: "idEmpleado", label: "Empleado", align: "center",     field: row => getEmpleadonombre(row.idEmpleado) },


  {
    name: "tipoCultivo",
    label: "Tipo de Cultivo",
    align: "center",
    field: "tipoCultivo",
  },
  {
    name: "nombre",
    label: "nombre",
    align: "center",
    field: "nombre",
  },
  { name: "tipo", label: "Tipo de control", align: "center", field: "tipo" },
  { name: "ingredientesActivo", label: "Ingredientes Activo", align: "center", field: "ingredientesActivo" },
  { name: "dosis", label: "Dosis", align: "center", field: "dosis" },
  { name: "observaciones", label: "observaciones", align: "center", field: "observaciones" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const controlplagaOptions = ref([]);

const useControlplaga = useControlplagaStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let cultivoTodo = ref([]);

onMounted(async () => {
  await listarCultivos();
  await listarControl();
  await listarEmpleados();

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
      // console.log("empleados cargados:", empleadoTodo.value);
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

function guardarControlplagaReciente(id) {
  localStorage.setItem('ControlplagaReciente', id);
}

function obtenerControlplagaReciente() {
  return localStorage.getItem('ControlplagaReciente');
}

async function listarControl() {
  try {
    const res = await useControlplaga.getControlplaga();
    console.log("Respuesta de getControlplaga:", res);
    if (res && Array.isArray(res.controlplaga)) {
      const ControlplagaRecienteId = obtenerControlplagaReciente();
      rows.value = res.controlplaga.map(controlplaga => {
        const cultivonombre = getCultivonombre(controlplaga.idCultivo);
        const empleadonombre = getEmpleadonombre(controlplaga.idEmpleado);
        return {
          ...controlplaga,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === ControlplagaRecienteId) return -1;
        if (b._id === ControlplagaRecienteId) return 1;
        return 0;
      });
      console.log("Filas de control:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar controlplaga:", error);
  }
}

function getCultivonombre(id) {
  // console.log("Buscando cultivo con id:", id);
  console.log("cultivoTodo:", cultivoTodo.value);
  if (!id) return 'cultivo no especificada';
  if (cultivoTodo.value.length === 0) {
    // console.log("cultivoTodo está vacío. Intentando cargar cultivos...");
    listarCultivos();
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

async function listarControlActivos() {
  try {
    const r = await useControlplaga.getControlplagaActivos();
    if (r && Array.isArray(r.activados)) {
      const ControlplagaRecienteId = obtenerControlplagaReciente();
      rows.value = r.activados.map(controlplaga => {
        const cultivonombre = getCultivonombre(controlplaga.idCultivo);
        const empleadonombre = getEmpleadonombre(controlplaga.idEmpleado);
        return {
          ...controlplaga,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === ControlplagaRecienteId) return -1;
        if (b._id === ControlplagaRecienteId) return 1;
        return 0;
      });
      console.log("Filas de control:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar controlplaga:", error);
  }
}

async function listarControlInactivos() {
  try {
    const r = await useControlplaga.getControlplagaInactivos();
    if (r && Array.isArray(r.desactivados)) {
      const ControlplagaRecienteId = obtenerControlplagaReciente();
      rows.value = r.desactivados.map(controlplaga => {
        const cultivonombre = getCultivonombre(controlplaga.idCultivo);
        const empleadonombre = getEmpleadonombre(controlplaga.idEmpleado);
        return {
          ...controlplaga,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === ControlplagaRecienteId) return -1;
        if (b._id === ControlplagaRecienteId) return 1;
        return 0;
      });
      console.log("Filas de control:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar controlplaga:", error);
  }
}

async function agregarOEditarControlplaga() {
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
      tipoCultivo: tipoCultivo.value,
      nombre: nombre.value,
      tipo: tipo.value,
      dosis: dosis.value,
      ingredientesActivo: ingredientesActivo.value,
      observaciones: observaciones.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (produccionId.value) {
      result = await useControlplaga.putControlplaga(produccionId.value, data);
    } else {
      result = await useControlplaga.postControlplaga(data);
    }

    if (result.success) {
      await listarControl();
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
  tipoCultivo.value = "";
  idCultivo.value = "";
  idEmpleado.value = "";
  nombre.value = "";
  tipo.value = "";
  ingredientesActivo.value = "";
  dosis.value = "";
  observaciones.value = "";

}

function editarControlplaga(controlplaga) {
  tipoCultivo.value = controlplaga.tipoCultivo;
  const selectedCultivo = cultivoTodo.value.find(c => c._id ===  controlplaga.idCultivo);
  if (selectedCultivo) {
    idCultivo.value = {
      label: `${selectedCultivo.nombre} - ${selectedCultivo.tipo}`,
      value: selectedCultivo._id,  // Cambiado de 'valor' a 'value'
      nombre: selectedCultivo.nombre
    };
  } else {
    console.error("No se encontró el cultivo correspondiente");
    idCultivo.value = null;
  }
  
  const selectedEmpleado = empleadoTodo.value.find(c => c._id === controlplaga.idEmpleado);
  if (selectedEmpleado) {
    idEmpleado.value = {
      label: `${selectedEmpleado.nombre} - ${selectedEmpleado.documento}`,
      value: selectedEmpleado._id,  // Cambiado de 'valor' a 'value'
      nombre: selectedEmpleado.nombre
    };
  } else {
    console.error("No se encontró el cultivo correspondiente");
    idEmpleado.value = null;
  }
  nombre.value = controlplaga.nombre;
  tipo.value = controlplaga.tipo;
  ingredientesActivo.value = controlplaga.ingredientesActivo;
  dosis.value = controlplaga.dosis;
  observaciones.value = controlplaga.observaciones;
  produccionId.value = controlplaga._id;
  showForm.value = true;

  console.log("Editando producción:", { ...controlplaga, idCultivo: idCultivo.value,idEmpleado: idEmpleado.value  });
}


async function obtenerControlplagaPorID(selectedControlplagaId) {
  try {
    const controlplaga = await useControlplaga.getControlplagasporId(selectedControlplagaId);
    if (controlplaga) {
      rows.value = [controlplaga];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarControlplaga(controlplaga) {
  try {
    await useControlplaga.toggleEstadoControlplaga(controlplaga._id, true);
    listarControl();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarControlplaga(controlplaga) {
  try {
    await useControlplaga.toggleEstadoControlplaga(controlplaga._id, false);
    listarControl();
  } catch (error) {
    console.error(error);
  }
}

listarControl(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarProduccion();
  }
});

      const model = ref(null);
      const options = [
        'Fitusanitario', 'Normal'
      ];


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
