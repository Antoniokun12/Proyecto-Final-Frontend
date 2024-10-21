<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Semillas</div>
      <q-btn
        label="Agregar Semilla"
        color="green-14"
        @click="showForm = true"
        class="q-my-md"
      />
      <q-btn-dropdown
        color="green-14"
        icon="visibility"
        label="Filtrar"
        style="margin-left: 16px"
      >
        <q-list>
          <q-item clickable v-ripple @click="listarSemillas">
            <q-item-section>Listar Todas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSemillasActivas">
            <q-item-section>Listar Activas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSemillasInactivas">
            <q-item-section>Listar Inactivas</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedSemillaId"
        label="Seleccionar Semilla"
        :options="semillaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerSemillaPorID"
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
            no-data-label="No hay registros de semillas disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarSemilla(props.row)"
                >
                  <q-tooltip
                    class="bg-green rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Semilla
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarSemilla(props.row)"
                  v-if="props.row.estado == 0"
                >
                  <q-tooltip
                    class="bg-green rounded-borders row flex-center"
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
                  @click="desactivarSemilla(props.row)"
                  v-if="props.row.estado == 1"
                >
                  <q-tooltip
                    class="bg-green rounded-borders row flex-center"
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
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card style="width: 400px; border-radius: 15px">
          <q-card-section>
            <q-form @submit.prevent="agregarOEditarSemilla">
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
                    src="https://e7.pngegg.com/pngimages/889/101/png-clipart-computer-icons-natural-environment-nature-natural-resource-coral-collection-leaf-hand.png"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Semilla
                </h1>
              </div>
              <q-select
                v-model="idFinca"
                label="Finca"
                :options="fincasOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model.trim="nombre" label="Nombre" required />
              <q-input
                v-model.trim="registroIca"
                label="Registro ICA"
                required
              />
              <q-input
                v-model.trim="registroInvima"
                label="Registro INVIMA"
                required
              />
              <q-input
                v-model.trim="fechaVencimiento"
                type="date"
                label="Fecha de vencimiento"
                required
              />
              <q-input
                v-model.trim="especieVariedad"
                label="Especie y Variedad"
                required
              />
              <q-input
                v-model.trim="numLote"
                label="Número de Lote"
                required
                type="number"
              />
              <q-input v-model.trim="origen" label="Origen" required />
              <q-input
                v-model.trim="poderGerminativo"
                label="Poder Germinativo"
                required
              />
              <q-input
                v-model.trim="cantidad"
                label="Cantidad en Kg(Kilogramo)"
                required
                type="number"
              />
              <q-input v-model.trim="observaciones" label="Observaciones" />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarSemilla"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useSemillas.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useSemillasStore } from "../stores/semillas.js";
import { useFincasStore } from "../stores/fincas.js"; // Cambié a finca

const showForm = ref(false);
const idFinca = ref("");
const nombre = ref(""); 
const registroIca = ref(""); 
const registroInvima = ref(""); 
const fechaVencimiento = ref(null);
const especieVariedad = ref(""); 
const numLote = ref("");
const origen = ref("");
const poderGerminativo = ref("");
const cantidad = ref(0);
const observaciones = ref(""); 
const semillaId = ref(null);

const rows = ref([]);
const columns = ref([
  { name: "id_finca", label: "Finca", align: "center", field: "nombreFinca" },
  { name: "nombre", label: "Nombre", align: "center", field: "nombre" },
  { name: "registro_ica", label: "Registro ICA", align: "center", field: "registro_ica" },
  { name: "registro_invima", label: "Registro INVIMA", align: "center", field: "registro_invima" },
  { name: "fechaVencimiento", label: "Fecha de Vencimiento", align: "center", field: "fechaVencimiento", format: (val) => new Date(val).toLocaleDateString("es-ES") },
  { name: "especie_variedad", label: "Especie o Variedad", align: "center", field: "especie_variedad" },
  { name: "numLote", label: "Número de Lote", align: "center", field: "numLote" },
  { name: "origen", label: "Origen", align: "center", field: "origen" },
  { name: "poderGerminativo", label: "Poder Germinativo", align: "center", field: "poderGerminativo" },
  { name: "unidad", label: "Unidad", align: "center", field: "unidad" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "observaciones", label: "Observaciones", align: "center", field: "observaciones" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const semillaOptions = ref([]);
const fincasOptions = ref([]);

const useSemillas = useSemillasStore();
const useFincas = useFincasStore();

async function listarSemillas() {
  try {
    const r = await useSemillas.getSemillas();
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || [];

    rows.value = r.semillas.map((semilla) => {
      const finca = fincas.find((e) => e._id === semilla.id_finca);
      return {
        ...semilla,
        nombreFinca: finca ? finca.nombre : "Desconocido",
      };
    });

    semillaOptions.value = r.semillas.map((semilla) => ({
      label: semilla.nombre,
      value: semilla._id,
    }));
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarSemillasActivas() {
  try {
    const r = await useSemillas.getSemillasActivas();
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || [];

    rows.value = r.activados.map((semilla) => {
      const finca = fincas.find((e) => e._id === semilla.id_finca);
      return {
        ...semilla,
        nombreFinca: finca ? finca.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarSemillasInactivas() {
  try {
    const r = await useSemillas.getSemillasInactivas();
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || [];

    rows.value = r.desactivados.map((semilla) => {
      const finca = fincas.find((e) => e._id === semilla.id_finca);
      return {
        ...semilla,
        nombreFinca: finca ? finca.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function obtenerSemillaPorID(selectedSemillaId) {
  try {
    const r = await useSemillas.getSemillasByID(selectedSemillaId);
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || [];

    if (r.semilla) {
      const finca = fincas.find((e) => e._id === r.semilla.id_finca);
      rows.value = [
        {
          ...r.semilla,
          nombreFinca: finca ? finca.nombre : "Desconocido",
        },
      ];
    } else {
      console.error("No se encontró ninguna semilla con el ID proporcionado");
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

function cancelarAgregarSemilla() {
  limpiarFormulario();
  showForm.value = false;
}

function limpiarFormulario() {
  idFinca.value = "";
  nombre.value = "";
  registroIca.value = "";
  registroInvima.value = "";
  fechaVencimiento.value = null;
  especieVariedad.value = "";
  numLote.value = 0;
  origen.value = "";
  poderGerminativo.value = "";
  cantidad.value = 0;
  observaciones.value = "";
  semillaId.value = null;
}

async function agregarOEditarSemilla() {
  const semillaData = {
    id_finca: idFinca.value,
    nombre: nombre.value,
    registro_ica: registroIca.value,
    registro_invima: registroInvima.value,
    fechaVencimiento: fechaVencimiento.value,
    especie_variedad: especieVariedad.value,
    numLote: numLote.value,
    origen: origen.value,
    poderGerminativo: poderGerminativo.value,
    cantidad: cantidad.value,
    observaciones: observaciones.value,
  };

  try {
    if (semillaId.value) {
      await useSemillas.putSemillas(semillaId.value, semillaData);
    } else {
      await useSemillas.postSemillas(semillaData);
    }
    listarSemillas();
    showForm.value = false;
    limpiarFormulario();
  } catch (error) {
    console.error(error);
  }
}

async function editarSemilla(semillas) {
  idFinca.value = semillas.id_finca;
  nombre.value = semillas.nombre;
  registroIca.value = semillas.registro_ica;
  registroInvima.value = semillas.registro_invima;
  fechaVencimiento.value = new Date(semillas.fechaVencimiento).toISOString().substring(0, 10);
  especieVariedad.value = semillas.especie_variedad;
  numLote.value = semillas.numLote;
  origen.value = semillas.origen;
  poderGerminativo.value = semillas.poderGerminativo;
  cantidad.value = semillas.cantidad;
  observaciones.value = semillas.observaciones;
  semillaId.value = semillas._id;
  showForm.value = true;
}

async function cargarFincas() {
  try {
    const r = await useFincas.listarFinca();
    fincasOptions.value = r.finca.map((finca) => ({
      value: finca._id,
      label: finca.nombre,
    })); // Corregido a r.finca
  } catch (error) {
    console.error('Error al cargar fincas:', error);
  }
}
async function activarSemilla(row) {
  await useSemillas.toggleEstadoSemillas(row._id, true);
  listarSemillas();
}

async function desactivarSemilla(row) {
  await useSemillas.toggleEstadoSemillas(row._id, false);
  listarSemillas();
}

watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarSemilla();
  }
});

watch(showForm, (newVal) => {
  if (newVal) {
    cargarFincas();
  }
});


listarSemillas();

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
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
