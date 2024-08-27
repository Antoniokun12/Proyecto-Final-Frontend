<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Riego</div>
      <q-btn
        label="Agregar Riego"
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
          <q-item clickable v-ripple @click="listarRiego">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarRiegoActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarRiegoInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedRiegoId"
        label="Seleccionar Riego"
        :options="riegoOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerRiegoPorID"
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
<template v-slot:body-cell-fechaRiego="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fechaRiego) }}</p>
  </q-td>
</template><template v-slot:body-cell-horaInicio="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatTime(props.row.horaInicio) }}</p>
  </q-td>
</template><template v-slot:body-cell-horaFin="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatTime(props.row.horaFin) }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarRiego(props.row)"
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
                  @click="activarRiego(props.row)"
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
                  @click="desactivarRiego(props.row)"
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
                <div class="text-h6">No hay Riego disponible</div>
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
            <q-form @submit.prevent="agregarOEditarRiego">
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
                  Riego
                </h1>
              </div>
          <q-select standout v-model="idCultivo" :options="organizarCultivos" option-value="valor" option-label="label" label="Cultivos" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idEmpleado" :options="organizarEmpleados" option-value="valor" option-label="label" label="Empleados" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="estadoFenologico" :options="options" label="estadoFenologico" style="background-color: #grey; margin-bottom: 20px" />

              <q-input
                v-model.trim="diasTransplante"
                label="Dias de Transplante"
                required
              />
              <!-- <q-input v-model.trim="estadoFenologico" label="estadoFenologico de control" required /> -->
              <q-input v-model.trim="horaInicio" type="time" label="hora de Inicio" required />
              <q-input v-model.number="dosis" type="number" label="Dosis" placeholder="litros por hora"required />
              <q-input v-model.trim="horaFin" type="time" label="hora Fin" required />
              <q-input v-model.number="cantidadAgua" type="number" label="cantidad de Agua" placeholder="litros en total"required />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarRiego"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useRiego.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRiegoStore } from "../stores/riego.js";
import { useCultivosStore } from "../stores/cultivos.js";
const useCultivo = useCultivosStore();

import { useEmpleadosStore } from "../stores/empleados.js";
const useEmpleado = useEmpleadosStore();

const drawer = ref(false);
const showForm = ref(false);
const diasTransplante = ref("");
const horaInicio = ref("");
const dosis = ref("");
const horaFin = ref("");
const cantidadAgua = ref("");
const idCultivo = ref("");
const idEmpleado = ref("");
const estadoFenologico = ref("");
const selectedRiegoId = ref("");
const produccionId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idCultivo", label: "Cultivo", align: "center",     field: row => getCultivonombre(row.idCultivo) },
  { name: "idEmpleado", label: "Empleado", align: "center",     field: row => getEmpleadonombre(row.idEmpleado) },
  { name: "fechaRiego", label: "Fecha de Riego", align: "center", field: "fechaRiego" },



  {
    name: "diasTransplante",
    label: "dias de Transplante",
    align: "center",
    field: "diasTransplante",
  },

  { name: "estadoFenologico", label: "estado Fenologico", align: "center", field: "estadoFenologico" },
  { name: "horaInicio", label: "hora de Inicio", align: "center", field: "horaInicio" },
  { name: "horaFin", label: "hora Fin", align: "center", field: "horaFin" },
  { name: "dosis", label: "Dosis", align: "center", field: "dosis" },
  { name: "cantidadAgua", label: "Cantidad de Agua", align: "center", field: "cantidadAgua" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const riegoOptions = ref([]);

const useRiego = useRiegoStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let cultivoTodo = ref([]);

onMounted(async () => {
  await listarCultivos();
  await listarRiego();
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

function guardarRiegoReciente(id) {
  localStorage.setItem('RiegoReciente', id);
}

function obtenerriegoReciente() {
  return localStorage.getItem('RiegoReciente');
}

async function listarRiego() {
  try {
    const res = await useRiego.getRiego();
    console.log("Respuesta de getRiego:", res);
    if (res && Array.isArray(res.riego)) {
      const riegoRecienteId = obtenerriegoReciente();
      rows.value = res.riego.map(riego => {
        const cultivonombre = getCultivonombre(riego.idCultivo);
        const empleadonombre = getEmpleadonombre(riego.idEmpleado);
        return {
          ...riego,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === riegoRecienteId) return -1;
        if (b._id === riegoRecienteId) return 1;
        return 0;
      });
      console.log("Filas de riego:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar riego:", error);
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

async function listarRiegoActivos() {
  try {
    const r = await useRiego.getRiegoActivos();
    if (r && Array.isArray(r.activados)) {
      const riegoRecienteId = obtenerriegoReciente();
      rows.value = r.activados.map(riego => {
        const cultivonombre = getCultivonombre(riego.idCultivo);
        const empleadonombre = getEmpleadonombre(riego.idEmpleado);
        return {
          ...riego,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === riegoRecienteId) return -1;
        if (b._id === riegoRecienteId) return 1;
        return 0;
      });
      console.log("Filas de riego:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar riego:", error);
  }
}

async function listarRiegoInactivos() {
  try {
    const r = await useRiego.getRiegoInactivos();
    if (r && Array.isArray(r.desactivados)) {
      const riegoRecienteId = obtenerriegoReciente();
      rows.value = r.desactivados.map(riego => {
        const cultivonombre = getCultivonombre(riego.idCultivo);
        const empleadonombre = getEmpleadonombre(riego.idEmpleado);
        return {
          ...riego,
          cultivonombre: cultivonombre,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === riegoRecienteId) return -1;
        if (b._id === riegoRecienteId) return 1;
        return 0;
      });
      console.log("Filas de riego:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar riego:", error);
  }
}

async function agregarOEditarRiego() {
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
      diasTransplante: diasTransplante.value,
      estadoFenologico: estadoFenologico.value,
      cantidadAgua: cantidadAgua.value,
      dosis: dosis.value,
      horaInicio: horaInicio.value,
      horaFin: horaFin.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (produccionId.value) {
      result = await useRiego.putRiego(produccionId.value, data);
    } else {
      result = await useRiego.postRiego(data);
    }

    if (result.success) {
      await listarRiego();
      showForm.value = false;
      // Limpiar los campos después de guardar
      cancelarAgregarRiego();
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error al agregar/editar producción:", error);
  }
}


function cancelarAgregarRiego() {
  showForm.value = false;
  produccionId.value = null;
  diasTransplante.value = "";
  idCultivo.value = "";
  idEmpleado.value = "";
  cantidadAgua.value = "";
  estadoFenologico.value = "";
  horaInicio.value = "";
  dosis.value = "";
  horaFin.value = "";

}

function editarRiego(riego) {
  diasTransplante.value = riego.diasTransplante;
  const selectedCultivo = cultivoTodo.value.find(c => c._id ===  riego.idCultivo);
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
  
  const selectedEmpleado = empleadoTodo.value.find(c => c._id === riego.idEmpleado);
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
  estadoFenologico.value = riego.estadoFenologico;
  horaInicio.value = riego.horaInicio;
  dosis.value = riego.dosis;
  horaFin.value = riego.horaFin;
  cantidadAgua.value = riego.cantidadAgua;
  produccionId.value = riego._id;
  showForm.value = true;

  console.log("Editando producción:", { ...riego, idCultivo: idCultivo.value,idEmpleado: idEmpleado.value  });
}


async function obtenerRiegoPorID(selectedRiegoId) {
  try {
    const riego = await useRiego.getRiegosporId(selectedRiegoId);
    if (riego) {
      rows.value = [riego];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarRiego(riego) {
  try {
    await useRiego.toggleEstadoRiego(riego._id, true);
    listarRiego();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarRiego(riego) {
  try {
    await useRiego.toggleEstadoRiego(riego._id, false);
    listarRiego();
  } catch (error) {
    console.error(error);
  }
}

listarRiego(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarRiego();
  }
});

      const model = ref(null);
      const options = [
        'Inicial', 'floración', 'cosecha'
      ];

const formatTime = (timeString) => {
  return timeString;  // Retorna la cadena de tiempo tal como está.
};

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};
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
