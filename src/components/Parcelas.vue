<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Parcelas</div>
      <q-btn
        label="Agregar Parcela"
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
          <q-item clickable v-ripple @click="listarParcelas">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarParcelasActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarParcelasInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedParcelaId"
        label="Seleccionar Parcela"
        :options="parcelaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerParcelaPorID"
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
<template v-slot:body-cell-idFinca="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.fincanombre }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-area="props">
              <q-td :props="props">
                {{ formatArea(props.row.area) }}
              </q-td>
            </template>
          <template v-slot:body-cell-ubicacionGeografica="props">
            <q-td :props="props" style="text-align: center;">
              <q-btn class="segui" @click="openUbicacionModal(props.row)" icon="location_on">
                <q-tooltip>Ver ubicación geográfica</q-tooltip>
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
                  @click="editarParcela(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Parcela
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarParcela(props.row)"
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
                  @click="desactivarParcela(props.row)"
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
                <div class="text-h6">No hay Parcelas disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarParcela">
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
                  Parcela
                </h1>
              </div>
          <q-select standout v-model="idFinca" :options="organizarFincas" option-value="valor" option-label="label" label="Finca" style="background-color: #grey; margin-bottom: 20px" />
              <!-- <q-input v-model.trim="numero" label="Numero" required /> -->
              <q-input v-model.trim="cultivoAnterior" label="cultivo Anterior" required />
              <q-input v-model.trim="cultivoActual" label="cultivo Actual" required />
              <q-input v-model.trim="detalle" label="Detalle" required />
              <q-input v-model.number="area" type="number" label="Area" required placeholder="m2"/>
              <q-input v-model.trim="asistenteTecnico" label="asistente Tecnico" required />
                              <h3 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Ubicacion
                </h3>
                            <q-input v-model="ubicacionGeografica[0].latitud" label="Latitud" required />
              <q-input v-model="ubicacionGeografica[0].longitud" label="Longitud" required />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarParcela"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useParcelas.loading" class="overlay">
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
                :rows="selectedParcela?.ubicacionGeografica || []"
                :columns="ubicolumns"
                row-key="latitud"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" @click="ubicacionModalOpen = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useParcelaStore } from "../stores/parcelas.js";
import { useFincasStore } from "../stores/fincas.js";
const useFinca = useFincasStore();

const drawer = ref(false);
const showForm = ref(false);
const ubicacionGeografica = ref([{ latitud: '', longitud: ''}]);
const cultivoActual = ref("");
const area = ref("");
const asistenteTecnico = ref("");
const detalle = ref("");
const idFinca = ref("");
// const numero = ref("");
const cultivoAnterior = ref("");
const selectedParcelaId = ref("");
const parcelaId = ref(null); // Para almacenar el ID del proveedor en edición

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idFinca", label: "Finca", align: "center",     field: row => getFincanombre(row.idFinca) },
  {
    name: "numero",
    label: "Numero",
    align: "center",
    field: "numero",
  },
    { name: "ubicacionGeografica", label: "ubicacion Geografica", align: "center", field: "ubicacionGeografica" },
  { name: "cultivoAnterior", label: "cultivo Anterior", align: "center", field: "cultivoAnterior" },
  { name: "cultivoActual", label: "cultivo Actual", align: "center", field: "cultivoActual" },
  { name: "detalle", label: "Detalle", align: "center", field: "detalle" },
  { name: "area", label: "Área", align: "center", field: "area" },
  { name: "asistenteTecnico", label: "Asistente Tecnico", align: "center", field: "asistenteTecnico" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const parcelaOptions = ref([]);

const useParcelas = useParcelaStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let fincaTodo = ref([]);

onMounted(async () => {
  await listarFincas();
  await listarParcelas();
});

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

function guardarParcelaReciente(id) {
  localStorage.setItem('ParcelaReciente', id);
}

function obtenerParcelaReciente() {
  return localStorage.getItem('ParcelaReciente');
}

async function listarParcelas() {
  try {
    const res = await useParcelas.getParcelas();
    if (res && Array.isArray(res.parcela)) {
      const ParcelaRecienteId = obtenerParcelaReciente();
      rows.value = res.parcela.map(parcela => {
        const fincanombre = getFincanombre(parcela.idFinca);
        return {
          ...parcela,
          fincanombre: fincanombre
        };
      }).sort((a, b) => {
        if (a._id === ParcelaRecienteId) return -1;
        if (b._id === ParcelaRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar parcelas:", error);
  }
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

async function listarParcelasActivos() {
  try {
    const r = await useParcelas.getParcelasActivos();
    rows.value = r.activados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarParcelasInactivos() {
  try {
    const r = await useParcelas.getParcelasInactivos();
    rows.value = r.desactivados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarParcela() {
  try {
    // Determina el valor correcto de idFinca dependiendo de la operación
    const idFincaValue = parcelaId.value ? idFinca.value.valor : idFinca.value.value;

    const data = {
      idFinca: idFincaValue, // Utiliza el valor adecuado para `POST` o `PUT`
      ubicacionGeografica: ubicacionGeografica.value.map(geo => ({ latitud: geo.latitud, longitud: geo.longitud })),
      // numero: numero.value,
      cultivoAnterior: cultivoAnterior.value,
      cultivoActual: cultivoActual.value,
      asistenteTecnico: asistenteTecnico.value,
      area: area.value,
      detalle: detalle.value,
    };

    let result;
    console.log("Datos a enviar:", data); // Para depuración

    if (parcelaId.value) {
      // Si existe `parcelaId.value`, realiza un PUT
      result = await useParcelas.putParcela(parcelaId.value, data);
    } else {
      // Si `parcelaId.value` no existe, realiza un POST
      result = await useParcelas.postParcela(data);
    }

    if (result.success) {
      listarParcelas(); // Actualiza la lista de parcelas después de agregar o editar
      showForm.value = false; // Cierra el formulario solo si la operación fue exitosa
      
    } else {
      console.error(result.error); // Agrega un mensaje de error si la operación falla
    }
  } catch (error) {
    console.error(error);
  }
}




function cancelarAgregarParcela() {
  showForm.value = false;
  parcelaId.value = null;
  ubicacionGeografica.value = "";
  idFinca.value = "";
  // numero.value = "";
  cultivoAnterior.value = "";
  cultivoActual.value = "";
  asistenteTecnico.value = "";
  area.value = "";
  detalle.value = "";
}

function editarParcela(parcela) {
  ubicacionGeografica.value = parcela.ubicacionGeografica;
  const selectedFinca = fincaTodo.value.find(finca => finca._id === parcela.idFinca);
  if (selectedFinca) {
    idFinca.value = {
      label: `${selectedFinca.nombre} - ${selectedFinca.rut}`,
      valor: selectedFinca._id, // Asegúrate de que esto se llame `valor`
      nombre: selectedFinca.nombre
    };
  }
  // numero.value = parcela.numero;
  cultivoAnterior.value = parcela.cultivoAnterior;
  cultivoActual.value = parcela.cultivoActual;
  asistenteTecnico.value = parcela.asistenteTecnico;
  area.value = parcela.area;
  detalle.value = parcela.detalle;
  parcelaId.value = parcela._id; // Almacena el ID del proveedor en edición
  showForm.value = true;
}


async function obtenerParcelaPorID(selectedParcelaId) {
  try {
    const parcela = await useParcelas.getParcelasByID(selectedParcelaId);
    if (parcela) {
      rows.value = [parcela];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarParcela(parcela) {
  try {
    await useParcelas.toggleEstadoParcela(parcela._id, true);
    listarParcelas();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarParcela(parcela) {
  try {
    await useParcelas.toggleEstadoParcela(parcela._id, false);
    listarParcelas();
  } catch (error) {
    console.error(error);
  }
}

listarParcelas(); // Llama a la función para listar proveedores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarParcela();
  }
});

const ubicacionModalOpen = ref(false);
const selectedParcela = ref(null);

const openUbicacionModal = (parcela) => {
  console.log("Abriendo modal de ubicación para:", parcela);
  selectedParcela.value = parcela;
  ubicacionModalOpen.value = true;
  console.log("ubicacionModalOpen:", ubicacionModalOpen.value);
  console.log("Datos de ubicación:", selectedParcela.value.ubicacionGeografica);
};

const ubicolumns = ref([
  { name: "latitud", label: "Latitud", field: "latitud", align: "center" },
  { name: "longitud", label: "Longitud", field: "longitud", align: "center" },
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
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
