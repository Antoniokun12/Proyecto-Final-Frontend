<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Produccion</div>
      <q-btn
        label="Agregar Produccion"
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
          <q-item clickable v-ripple @click="listarProduccion">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarProduccionActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarProduccionInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedProduccionId"
        label="Seleccionar Produccion"
        :options="produccionOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerProduccionPorID"
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
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarProduccion(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Produccion
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarProduccion(props.row)"
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
                  @click="desactivarProduccion(props.row)"
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
                <div class="text-h6">No hay Produccion disponible</div>
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
            <q-form @submit.prevent="agregarOEditarProduccion">
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
                  Produccion
                </h1>
              </div>
          <q-select standout v-model="idCultivo" :options="organizarCultivos" option-value="valor" option-label="label" label="Finca" style="background-color: #grey; margin-bottom: 20px" />

              <q-input
                v-model.trim="Nlote"
                label="Nlote de Produccion"
                required
              />
              <q-input v-model.trim="especie" label="Especie" required />
              <q-input v-model.trim="cantidad" label="Cantidad" required />
              <q-input v-model.trim="cantidadTrabajadores" label="Cantidad de Trabajadores" required />
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
      <div v-if="useProduccion.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useProduccionStore } from "../stores/produccion.js";
import { useCultivosStore } from "../stores/cultivos.js";
const useCultivo = useCultivosStore();

const drawer = ref(false);
const showForm = ref(false);
const Nlote = ref("");
const cantidadTrabajadores = ref("");
const observaciones = ref("");
const idCultivo = ref("");
const especie = ref("");
const cantidad = ref("");
const selectedProduccionId = ref("");
const produccionId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idCultivo", label: "Finca", align: "center",     field: row => getCultivonombre(row.idCultivo) },

  {
    name: "Nlote",
    label: "Número de lote",
    align: "center",
    field: "Nlote",
  },
  {
    name: "especie",
    label: "Especie",
    align: "center",
    field: "especie",
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "cantidadTrabajadores", label: "Cantidad de Trabajadores", align: "center", field: "cantidadTrabajadores" },
  { name: "observaciones", label: "observaciones", align: "center", field: "observaciones" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const produccionOptions = ref([]);

const useProduccion = useProduccionStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let cultivoTodo = ref([]);

onMounted(async () => {
  await listarCultivos();
});

listarProduccion();

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

function guardarProduccionReciente(id) {
  localStorage.setItem('ProduccionReciente', id);
}

function obtenerProduccionReciente() {
  return localStorage.getItem('ProduccionReciente');
}

async function listarProduccion() {
  try {
    const res = await useProduccion.getProduccion();
    console.log("Respuesta completa de getProduccion:", res);
    if (res && Array.isArray(res.producciones)) {  // Nota las tres 'c' en 'produccciones'
      const ProduccionRecienteId = obtenerProduccionReciente();
      rows.value = res.producciones.map(produccion => {
        const cultivonombre = getCultivonombre(produccion.idCultivo);
        return {
          ...produccion,
          cultivonombre: cultivonombre
        };
      }).sort((a, b) => {
        if (a._id === ProduccionRecienteId) return -1;
        if (b._id === ProduccionRecienteId) return 1;
        return 0;
      });
      console.log("Filas de producción:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar produccion:", error);
  }
}




function getCultivonombre(id) {
  console.log("Buscando cultivo con id:", id);
  console.log("cultivoTodo:", cultivoTodo.value);
  if (!id) return 'cultivo no especificada';
  if (cultivoTodo.value.length === 0) {
    console.log("cultivoTodo está vacío. Intentando cargar cultivos...");
    listarCultivos();
    return 'Cargando...';
  }
  const cultivo = cultivoTodo.value.find(cultivo => cultivo._id === id);
  console.log("cultivo encontrada:", cultivo);
  return cultivo ? `${cultivo.nombre} - ${cultivo.tipo}` : 'cultivo no encontrado';
}

async function listarProduccionActivos() {
  try {
    const r = await useProduccion.getProduccionActivos();
    if (r && Array.isArray(r.activados)) {  // Nota las tres 'c' en 'produccciones'
      const ProduccionRecienteId = obtenerProduccionReciente();
      rows.value = r.activados.map(produccion => {
        const cultivonombre = getCultivonombre(produccion.idCultivo);
        return {
          ...produccion,
          cultivonombre: cultivonombre
        };
      }).sort((a, b) => {
        if (a._id === ProduccionRecienteId) return -1;
        if (b._id === ProduccionRecienteId) return 1;
        return 0;
      });
      console.log("Filas de producción:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar produccion:", error);
  }
}

async function listarProduccionInactivos() {
  try {
    const r = await useProduccion.getProduccionInactivos();
    if (r && Array.isArray(r.desactivados)) {  // Nota las tres 'c' en 'produccciones'
      const ProduccionRecienteId = obtenerProduccionReciente();
      rows.value = r.desactivados.map(produccion => {
        const cultivonombre = getCultivonombre(produccion.idCultivo);
        return {
          ...produccion,
          cultivonombre: cultivonombre
        };
      }).sort((a, b) => {
        if (a._id === ProduccionRecienteId) return -1;
        if (b._id === ProduccionRecienteId) return 1;
        return 0;
      });
      console.log("Filas de producción:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar produccion:", error);
  }
}

async function agregarOEditarProduccion() {
  try {
    let idCultivoValue;
    if (typeof idCultivo.value === 'object' && idCultivo.value !== null) {
      idCultivoValue = idCultivo.value.value || idCultivo.value.valor;
    } else {
      idCultivoValue = idCultivo.value;
    }

    const data = {
      idCultivo: idCultivoValue,
      Nlote: Nlote.value,
      especie: especie.value,
      cantidad: cantidad.value,
      cantidadTrabajadores: cantidadTrabajadores.value,
      observaciones: observaciones.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (produccionId.value) {
      result = await useProduccion.putProduccion(produccionId.value, data);
    } else {
      result = await useProduccion.postProduccion(data);
    }

    if (result.success) {
      listarProduccion();
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
  Nlote.value = "";
  idCultivo.value = "";
  especie.value = "";
  cantidad.value = "";
  cantidadTrabajadores.value = "";
  observaciones.value = "";

}

function editarProduccion(cultivo) {
  Nlote.value = cultivo.Nlote;
  const selectedCultivo = cultivoTodo.value.find(c => c._id === cultivo.idCultivo);
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
  especie.value = cultivo.especie;
  cantidad.value = cultivo.cantidad;
  cantidadTrabajadores.value = cultivo.cantidadTrabajadores;
  observaciones.value = cultivo.observaciones;
  produccionId.value = cultivo._id;
  showForm.value = true;

  console.log("Editando producción:", { ...cultivo, idCultivo: idCultivo.value });
}


async function obtenerProduccionPorID(selectedProduccionId) {
  try {
    const produccion = await useProduccion.getProduccionByID(selectedProduccionId);
    if (produccion) {
      rows.value = [produccion];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarProduccion(produccion) {
  try {
    await useProduccion.toggleEstadoProduccion(produccion._id, true);
    listarProduccion();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarProduccion(produccion) {
  try {
    await useProduccion.toggleEstadoProduccion(produccion._id, false);
    listarProduccion();
  } catch (error) {
    console.error(error);
  }
}

listarProduccion(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarProduccion();
  }
});
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