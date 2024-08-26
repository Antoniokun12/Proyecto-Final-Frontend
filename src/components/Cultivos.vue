<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Cultivos</div>
      <q-btn
        label="Agregar Cultivo"
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
          <q-item clickable v-ripple @click="listarCultivos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarCultivosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarCultivosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedCultivoId"
        label="Seleccionar Cultivo"
        :options="cultivoOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerCultivoPorID"
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
          <template v-slot:body-cell-idParcela="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.Parcelanumero }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarCultivo(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Cultivo
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarCultivo(props.row)"
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
                  @click="desactivarCultivo(props.row)"
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
                <div class="text-h6">No hay Cultivos disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarCultivo">
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
                  Cultivo
                </h1>
              </div>
          <q-select standout v-model="idParcela" :options="organizarParcelas" option-value="valor" option-label="label" label="Parcela" style="background-color: #grey; margin-bottom: 20px" />
              <q-input
                v-model.trim="nombre"
                label="Nombre del Cultivo"
                required
              />
            
              <q-input v-model.trim="tipo" label="Tipo" required />              
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarCultivo"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useCultivos.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, computed} from "vue";
import { useCultivosStore } from "../stores/cultivos.js";
import { useParcelaStore } from "../stores/parcelas.js";
const useParcela = useParcelaStore();
const drawer = ref(false);
const showForm = ref(false);
const nombre = ref("");
const tipo = ref("");
const idParcela = ref("");
const selectedCultivoId = ref("");
const cultivoId = ref(null); // Para almacenar el ID del proveedor en edición

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
      { name: "idParcela", label: "Parcela", align: "center", field: row => getParcelanumero(row.idParcela) },

  {
    name: "nombre",
    label: "Nombre Cultivo",
    align: "center",
    field: "nombre",
  },
  {
    name: "tipo",
    label: "Tipo",
    align: "center",
    field: "tipo",
  },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const cultivoOptions = ref([]);

const useCultivos = useCultivosStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// async function listarCultivos() {
//   try {
//     const r = await useCultivos.listarCultivo();
//     rows.value = r.cultivos || [];
//     cultivoOptions.value = r.cultivos.map(p => ({
//       value: p._id,
//       label: p.nombre
//     }));
//   } catch (error) {
//     console.error(error);
//     rows.value = [];
//     cultivoOptions.value = [];
//   }
// }
let parcelaTodo = ref([]);

onMounted(async () => {
  await listarParcelas();
  await listarCultivos();
});

async function listarParcelas() {
  try {
    const r = await useParcela.getParcelasActivos();
    // console.log("Respuesta de getParcelasActivos:", res);
    if (r && Array.isArray(r.activados)) {
      parcelaTodo.value = res.activados;
      console.log("Parcelas cargadas:", JSON.stringify(parcelaTodo.value, null, 2));
    } else {
      console.error("Respuesta inesperada al listar parcelas:", r);
      parcelaTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar parcelas:", error);
    parcelaTodo.value = [];
  }
}

const organizarParcelas = computed(() => {
  console.log("Calculando organizarParcelas", parcelaTodo.value);
  return parcelaTodo.value.map((element) => ({
    label: `${element.numero}`,
    value: element._id,
    nombre: element.nombre,
  }));
});


function guardarCultivoReciente(id) {
  localStorage.setItem('CultivoReciente', id);
}

function obtenerCultivoReciente() {
  return localStorage.getItem('CultivoReciente');
}

async function listarCultivos() {
  try {
    const res = await useCultivos.listarCultivo();
    console.log("Respuesta de listarCultivo:", res); // Para depuración
    if (res && Array.isArray(res.cultivos)) {
      const CultivoRecienteId = obtenerCultivoReciente();
      rows.value = res.cultivos.map(cultivo => {
        const Parcelanumero = getParcelanumero(cultivo.idParcela);
        return {
          ...cultivo,
          Parcelanumero: Parcelanumero
        };
      }).sort((a, b) => {
        if (a._id === CultivoRecienteId) return -1;
        if (b._id === CultivoRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al listar cultivos:", error);
    rows.value = [];
  }
}

function getParcelanumero(id) {
  if (!id) return 'Parcela no especificada';
  const parcela = parcelaTodo.value.find(parcela => parcela._id === id);
  return parcela ? `${parcela.numero}` : 'Parcela no encontrada';
}


async function listarCultivosActivos() {
  try {
    const r = await useCultivos.getCultivosActivos();
    if (r && Array.isArray(r.activados)) {
      const CultivoRecienteId = obtenerCultivoReciente();
      rows.value = r.activados.map(cultivo => {
        const Parcelanumero = getParcelanumero(cultivo.idParcela);
        return {
          ...cultivo,
          Parcelanumero: Parcelanumero
        };
      }).sort((a, b) => {
        if (a._id === CultivoRecienteId) return -1;
        if (b._id === CultivoRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al listar cultivos:", error);
    rows.value = [];
  }
}

async function listarCultivosInactivos() {
  try {
    const r = await useCultivos.getCultivosInactivos();
    if (r && Array.isArray(r.desactivados)) {
      const CultivoRecienteId = obtenerCultivoReciente();
      rows.value = r.desactivados.map(cultivo => {
        const Parcelanumero = getParcelanumero(cultivo.idParcela);
        return {
          ...cultivo,
          Parcelanumero: Parcelanumero
        };
      }).sort((a, b) => {
        if (a._id === CultivoRecienteId) return -1;
        if (b._id === CultivoRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
      rows.value = [];
    }
  } catch (error) {
    console.error("Error al listar cultivos:", error);
    rows.value = [];
  }
}

async function agregarOEditarCultivo() {
  try {
    let idParcelaValue;
    if (cultivoId.value) {
      idParcelaValue = idParcela.value && idParcela.value.value ? idParcela.value.value : idParcela.value;
    } else {
      idParcelaValue = idParcela.value && idParcela.value.value ? idParcela.value.value : idParcela.value;
    }

    console.log("ID de parcela a enviar:", idParcelaValue); // Para depuración

    const data = {
      nombre: nombre.value,
      idParcela: idParcelaValue,
      tipo: tipo.value,
    };

    console.log("Datos completos a enviar:", data); // Para depuración

    let result;
    if (cultivoId.value) {
      result = await useCultivos.putCultivo(cultivoId.value, data);
    } else {
      result = await useCultivos.postCultivo(data);
    }

    if (result.success) {
      await listarCultivos();
      showForm.value = false;
    } else {
      console.error("Error al guardar el cultivo:", result.error);
    }
  } catch (error) {
    console.error("Error en agregarOEditarCultivo:", error);
  }
}


function cancelarAgregarCultivo() {
  showForm.value = false;
  cultivoId.value = null;
  nombre.value = "";
  idParcela.value = "";
  tipo.value = "";
}

function editarCultivo(cultivo) {
  nombre.value = cultivo.nombre;
const selectedParcela = parcelaTodo.value.find(parcela => parcela._id === cultivo.idParcela);
  
  if (selectedParcela) {
    idParcela.value = {
      label: `${selectedParcela.numero} - ${selectedParcela.ubicacion}`,
      value: selectedParcela._id,
      nombre: selectedParcela.nombre
    };
    console.log("Parcela seleccionada para editar:", idParcela.value); // Para depuración
  }
  tipo.value = cultivo.tipo;
  cultivoId.value = cultivo._id; // Almacena el ID del proveedor en edición
  showForm.value = true;
}

async function obtenerCultivoPorID(selectedCultivoId) {
  try {
    const cultivo = await useCultivos.listarCultivosporId(selectedCultivoId);
    if (cultivo) {
      rows.value = [cultivo];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarCultivo(cultivo) {
  try {
    await useCultivos.toggleEstadoCultivo(cultivo._id, true);
    listarCultivos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarCultivo(cultivo) {
  try {
    await useCultivos.toggleEstadoCultivo(cultivo._id, false);
    listarCultivos();
  } catch (error) {
    console.error(error);
  }
}

listarCultivos(); // Llama a la función para listar proveedores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarCultivo();
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