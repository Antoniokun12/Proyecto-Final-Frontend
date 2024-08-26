<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Comprador</div>
      <q-btn
        label="Agregar Comprador"
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
          <q-item clickable v-ripple @click="listarComprador">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarCompradorActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarCompradorInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedCompradorId"
        label="Seleccionar Comprador"
        :options="compradorOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerCompradorPorID"
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
<template v-slot:body-cell-idProduccion="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.produccionNlote }}</p>
  </q-td>
</template>
        <template v-slot:body-cell-valor="props">
          <q-td :props="props"
            style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
            <p>{{ formatCurrency(props.row.valor) }}</p>
          </q-td>
        </template>
        <template v-slot:body-cell-fecha="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fecha) }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarComprador(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Comprador
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarComprador(props.row)"
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
                  @click="desactivarComprador(props.row)"
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
                <div class="text-h6">No hay Compradores disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarComprador">
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
                  Comprador
                </h1>
              </div>
          <q-select standout v-model="idProduccion" :options="organizarProduccion" option-value="valor" option-label="label" label="Produccion" style="background-color: #grey; margin-bottom: 20px" />

              <q-input
                v-model.trim="especie"
                label="Especie"
                required
              />
              <q-input v-model.trim="nombre" label="Nombre" required />
              <q-input v-model.trim="telefono" label="Telefono" required inputmode="numeric" pattern="\d*"/>
              <q-input v-model.number="cantidad" type="number" label="Cantidad" required />
              <q-input v-model.trim="nguiaTransporte" label="N° de Guia Transporte" required />
              <q-input v-model.number="valor" type="number" label="Valor" required />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarComprador"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useComprador.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useCompradorStore } from "../stores/comprador.js";
import { useProduccionStore } from "../stores/produccion.js";
const useProduccion = useProduccionStore();

const drawer = ref(false);
const showForm = ref(false);
const especie = ref("");
const cantidad = ref("");
const valor = ref("");
const nguiaTransporte = ref("");
const idProduccion = ref("");
const nombre = ref("");
const telefono = ref("");
const selectedCompradorId = ref("");
const compradorId = ref(null); // Para almacenar el ID del proveedor en edición

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idProduccion", label: "Produccion", align: "center",     field: row => getproduccionNlote(row.idProduccion) },

  {
    name: "especie",
    label: "Especie",
    align: "center",
    field: "especie",
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: "nombre",
  },
  { name: "telefono", label: "Telefono", align: "center", field: "telefono" },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "nguiaTransporte", label: "N° de Guia Transporte", align: "center", field: "nguiaTransporte" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const compradorOptions = ref([]);

const useComprador = useCompradorStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let produccionTodo = ref([]);

onMounted(async () => {
  await listarProduccion();
  await listarComprador();
});
async function listarProduccion() {
  try {
    const res = await useProduccion.getProduccionActivos();
    console.log("Respuesta completa de listaractivados:", JSON.stringify(res, null, 2));
    if (res && Array.isArray(res.activados)) {
      produccionTodo.value = res.activados;
      console.log("Produccion cargado:", JSON.stringify(produccionTodo.value, null, 2));
    } else {
      console.error("Respuesta inesperada al listar Produccion:", res);
      produccionTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar Produccion:", error);
    produccionTodo.value = [];
  }
}


const organizarProduccion = computed(() => {
  console.log("Calculando organizarProduccion", produccionTodo.value);
  return produccionTodo.value.map((element) => ({
    label: `${element.Nlote} - ${element.especie}`,
    value: element._id,
    nombre: element.especie,
  }));
});

function guardarCompradorReciente(id) {
  localStorage.setItem('CompradorReciente', id);
}

function obtenerCompradorReciente() {
  return localStorage.getItem('CompradorReciente');
}

async function listarComprador() {
  try {
    const res = await useComprador.listarComprador();
    if (res && Array.isArray(res.comprador)) {
      const CompradorRecienteId = obtenerCompradorReciente();
      rows.value = res.comprador.map(comprador => {
        const produccionNlote = getproduccionNlote(comprador.idProduccion);
        return {
          ...comprador,
          produccionNlote: produccionNlote
        };
      }).sort((a, b) => {
        if (a._id === CompradorRecienteId) return -1;
        if (b._id === CompradorRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar comprador:", error);
  }
}

function getproduccionNlote(id) {
  console.log("Buscando produccion con id:", id);
  console.log("produccionTodo:", produccionTodo.value);
  if (!id) return 'produccion no especificada';
  if (produccionTodo.value.length === 0) {
    console.log("produccionTodo está vacío. Intentando cargar produccions...");
    listarProduccion();
    return 'Cargando...';
  }
  const produccion = produccionTodo.value.find(produccion => produccion._id === id);
  console.log("produccion encontrada:", produccion);
  return produccion ? `${produccion.Nlote} - ${produccion.especie}` : 'produccion no encontrada';
}

async function listarCompradorActivos() {
  try {
    const r = await useComprador.getCompradorActivos();
    if (r && Array.isArray(r.activados)) {
      const CompradorRecienteId = obtenerCompradorReciente();
      rows.value = r.activados.map(comprador => {
        const produccionNlote = getproduccionNlote(comprador.idProduccion);
        return {
          ...comprador,
          produccionNlote: produccionNlote
        };
      }).sort((a, b) => {
        if (a._id === CompradorRecienteId) return -1;
        if (b._id === CompradorRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar comprador:", error);
  }
}

async function listarCompradorInactivos() {
  try {
    const r = await useComprador.getCompradorInactivos();
    if (r && Array.isArray(r.desactivados)) {
      const CompradorRecienteId = obtenerCompradorReciente();
      rows.value = r.desactivados.map(comprador => {
        const produccionNlote = getproduccionNlote(comprador.idProduccion);
        return {
          ...comprador,
          produccionNlote: produccionNlote
        };
      }).sort((a, b) => {
        if (a._id === CompradorRecienteId) return -1;
        if (b._id === CompradorRecienteId) return 1;
        return 0;
      });
      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar comprador:", error);
  }
}

async function agregarOEditarComprador() {
  try {
    const idProduccionValue = compradorId.value ? idProduccion.value.valor : idProduccion.value.value;

    const data = {
idProduccion: idProduccionValue,
      especie: especie.value,
   nombre: nombre.value,
      telefono: telefono.value,
      cantidad: cantidad.value,
 valor: valor.value,
      nguiaTransporte: nguiaTransporte.value,
    };

    let result;
    console.log("Datos a enviar:", data); 

    if (compradorId.value) {
      result = await useComprador.putComprador(compradorId.value, data);
    } else {
      result = await useComprador.postComprador(data);
    }

    if (result.success) {
      listarComprador();  
      showForm.value = false; 
    } else {
      console.error(result.error); 
    }
  } catch (error) {
    console.error(error);
  }
}




function cancelarAgregarComprador() {
  showForm.value = false;
  compradorId.value = null;
  especie.value = "";
  idProduccion.value = "";
  nombre.value = "";
  telefono.value = "";
  cantidad.value = "";
  valor.value = "";
  nguiaTransporte.value = "";

}

function editarComprador(comprador) {
  especie.value = comprador.especie;
  const selectedProduccion = produccionTodo.value.find(produccion => produccion._id === comprador.idProduccion);
  if (selectedProduccion) {
    idProduccion.value = {
      label: `${selectedProduccion.Nlote} - ${selectedProduccion.especie}`,
      valor: selectedProduccion._id, 
      nombre: selectedProduccion.nombre
    };
  }
  nombre.value = comprador.nombre;
  telefono.value = comprador.telefono;
  cantidad.value = comprador.cantidad;
  valor.value = comprador.valor;
  nguiaTransporte.value = comprador.nguiaTransporte;
  compradorId.value = comprador._id; 
  showForm.value = true;
}


async function obtenerCompradorPorID(selectedCompradorId) {
  try {
    const comprador = await useComprador.listarCompradorporId(selectedCompradorId);
    if (comprador) {
      rows.value = [comprador];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarComprador(comprador) {
  try {
    await useComprador.toggleEstadoComprador(comprador._id, true);
    listarComprador();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarComprador(comprador) {
  try {
    await useComprador.toggleEstadoComprador(comprador._id, false);
    listarComprador();
  } catch (error) {
    console.error(error);
  }
}

listarComprador(); // Llama a la función para listar proveedores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarComprador();
  }
});
function formatCurrency(value) {
  if (value === undefined || value === null) {
    return '$0';
  }
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
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
