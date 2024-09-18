<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Registros de Clima</div>
      <q-btn label="Agregar Clima" color="blue-14" @click="showForm = true" class="q-my-md" />
      <q-btn-dropdown color="blue-14" icon="visibility" label="Filtrar" style="margin-left: 16px">
        <q-list>
          <q-item clickable v-ripple @click="listarClima">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select v-model="selectedClimaId" label="Seleccionar Registro de Clima" :options="climaOptions" emit-value
        map-options option-value="value" option-label="label" style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerClimaPorID" />
    </div>
    <template v-slot:body-cell-idFinca="props">
      <q-td :props="props" style="text-align: center;">
        <p>{{ props.row.fincanombre }}</p>
      </q-td>
    </template>
    <template v-slot:body-cell-idEmpleado="props">
      <q-td :props="props"
        style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
        <p>{{ props.row.idEmpleado ? getEmpleadoNombre(props.row.idEmpleado) : 'Empleado no especificado' }}</p>
      </q-td>
    </template>

    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table :rows="rows" :columns="columns" row-key="_id" flat bordered square no-data-label="">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn flat dense round icon="edit" @click="editarClima(props.row)">
                  <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                    style="width: 170px; height: 40px; font-size: 15px">
                    Editar Clima
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="q-pa-md text-center">
                <q-icon name="sentiment_dissatisfied" size="lg" class="q-mr-sm" />
                <div class="text-h6">No hay registros de clima disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarClima">
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 20px;
                  border: 2px solid #000000;
                  border-radius: 8px;
                ">
                <q-avatar size="80px">
                  <img src="https://example.com/clima-icon.png" />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Clima
                </h1>
              </div>
              <q-input v-model.trim="tipo" label="Tipo de Clima" required />


              
              <q-select v-model="idFinca" :options="organizarFincas" option-value="value" option-label="label"
                label="Finca" style="background-color: grey; margin-bottom: 20px" />


                <!-- <q-select v-model="idFinca" :options="organizarFincas" emit-value map-options option-value="value" option-label="label"
                label="Finca" style="background-color: grey; margin-bottom: 20px" /> -->



              <q-select v-model="idEmpleado" label="Seleccionar Empleado" :options="EmpleadosActivos" emit-value
                map-options option-value="value" option-label="label" style="margin-left: 16px; max-width: 200px" />
            
              <q-input v-model.trim="horaFinal" type="datetime-local" label="Hora Final" required />
              <q-input v-model.trim="tempMin" label="Temperatura Mínima" required />
              <q-input v-model.trim="tempMax" label="Temperatura Máxima" required />
              <div style="margin-top: 15px; display: flex; justify-content: center">
                <q-btn label="Cancelar" color="negative" @click="cancelarAgregarClima" class="q-mr-sm" />
                <q-btn type="submit" @click="agregarOEditarClima" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useClima.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useClimaStore } from "../stores/clima.js";
import { useFincasStore } from "../stores/fincas.js";
import { useEmpleadosStore } from "../stores/empleados.js";
const selectedClimaId = ref("")
const showForm = ref(false);
const tipo = ref("");

const horaFinal = ref("");
const tempMin = ref("");
const tempMax = ref("");
const climaId = ref(null);
const idFinca = ref("");
const idEmpleado = ref("")
const EmpleadosOptions = ref([]);
const EmpleadosActivos = ref([]);
const rows = ref([]);
const columns = ref([
  { name: "tipo", label: "Tipo", align: "center", field: "tipo" },
  { name: "idFinca", label: "Finca", align: "center", field: row => getFincanombre(row.idFinca) },
  {
    name: "idEmpleado",
    label: "Empleado",
    align: "center",
    field: row => getEmpleadoNombre(row.idEmpleado)
  },
  {
    name: "horaInicial",
    label: "Hora Inicial",
    align: "center",
    field: "horaInicial",
    format: (val) => new Date(val).toLocaleString(),
  },
  {
    name: "horaFinal",
    label: "Hora Final",
    align: "center",
    field: "horaFinal",
    format: (val) => new Date(val).toLocaleString(),
  },
  { name: "tempMin", label: "Temp. Mínima", align: "center", field: "tempMin" },
  { name: "tempMax", label: "Temp. Máxima", align: "center", field: "tempMax" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const climaOptions = ref([]);
const useFinca = useFincasStore();
const useClima = useClimaStore();
let fincaTodo = ref([]);
const useEmpleados = useEmpleadosStore();

async function listarClima() {
  try {
    const r = await useClima.getClima();
    let persona = await useEmpleados.getEmpleados();
    console.log("-------------------",persona , "------------");
    rows.value = r.clima;
    climaOptions.value = r.clima.map((clima) => ({
      label: clima.tipo,
      value: clima._id,
    }));
  } catch (error) {
    console.error(error);
  }
}



async function listarFincas() {
  try {
    const res = await useFinca.listaractivados();
    console.log("Respuesta de listaractivados:", res);
    if (res && res.data && Array.isArray(res.data.activados)) {
      fincaTodo.value = res.data.activados;
      console.log("Fincas cargadas:", JSON.stringify(fincaTodo.value, null, 2));
    } else {
      console.error("Respuesta inesperada al listar fincas:", res);
      fincaTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar fincas:", error);
    fincaTodo.value = [];
  }
}



const organizarFincas = computed(() => {
  console.log("Calculando organizarFincas", fincaTodo.value);
  return fincaTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.rut}`,
    value: element._id,
    nombre: element.nombre,
  }));
});


async function listarEmpleados() {
  try {
    const r = await useEmpleados.getEmpleados();
    rows.value = r.empleados || [];
    EmpleadosOptions.value = r.empleados.map((e) => ({
      value: e._id,
      label: e.nombre,
      doc: e.documento
    }));

    EmpleadosActivos.value = r.empleados.filter(objeto => objeto.estado === 1).map((p) => ({
      value: p._id,
      label: `${p.nombre} - ${p.documento}`,
    }));

  } catch (error) {
    console.error(error);
    rows.value = [];
    EmpleadosOptions.value = [];
  }
}



function getEmpleadoNombre(id) {
  const empleado = EmpleadosOptions.value.find((empleado) => empleado.value === id);
  return empleado ? `${empleado.doc} - ${empleado.label}` : "Documento no encontrado";
}
function getFincanombre(id) {
  console.log("Buscando finca con id:", id);
  console.log("fincaTodo:", fincaTodo.value);
  if (!id) return 'Finca no especificada';
  if (fincaTodo.value.length === 0) {
    console.warn("fincaTodo está vacío. Intentando cargar fincas...");
    listarFincas();
    return 'Cargando...';
  }
  const finca = fincaTodo.value.find(finca => finca._id === id);
  console.log("Finca encontrada:", finca);
  return finca ? `${finca.nombre} - ${finca.rut}` : 'Finca no encontrada';
}


// {
//       "idFinca": "66c57e11461411591b58151b",
//       "idEmpleado": "66b6d75c1752b7090e56eaad",
//       "tipo": "no",
//       "horaFinal":"2024-09-14 15:23:45",
//       "tempMin": "45",
//       "tempMax": "47"
// }


async function agregarOEditarClima() {

  try {
   const data = {
      idFinca: idFinca.value.value,
      idEmpleado: idEmpleado.value,
      tipo: tipo.value,
      horaFinal: horaFinal.value,
      tempMin: tempMin.value,
      tempMax: tempMax.value,
    };
 
  

    let result;
    if (climaId.value) {
      result = await useClima.putClima(climaId.value, data);
    } else {
      result = await useClima.postClima(data);
    }

    if (result.success) {
      listarClima();
      showForm.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarClima() {
  showForm.value = false;
  climaId.value = null;
  tipo.value = "";
  idEmpleado.value = "";
  horaFinal.value = "";
  tempMin.value = "";
  tempMax.value = "";
}

function editarClima(clima) {
  idFinca.value = clima.idFinca;
  tipo.value = clima.tipo;
  idEmpleado.value = clima.idEmpleado;
  horaFinal.value = new Date(clima.horaFinal).toISOString().substring(0, 16);
  tempMin.value = clima.tempMin;
  tempMax.value = clima.tempMax;
  climaId.value = clima._id;
  showForm.value = true;
}

async function obtenerClimaPorID(selectedClimaId) {
  try {
    const clima = await useClima.getClimaByID(selectedClimaId);
    rows.value = [clima];
  } catch (error) {
    console.error(error);
  }
}
listarFincas();
listarEmpleados()
listarClima();
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
