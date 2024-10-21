<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Insumos</div>
      <q-btn
        label="Agregar Insumo"
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
          <q-item clickable v-ripple @click="listarInsumos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarInsumosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarInsumosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedInsumoId"
        label="Seleccionar Insumo"
        :options="insumoOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerInsumoPorID"
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
            no-data-label="No hay registros de insumos disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarInsumo(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Insumo
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarInsumo(props.row)"
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
                  @click="desactivarInsumo(props.row)"
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
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card style="width: 400px; border-radius: 15px">
          <q-card-section>
            <q-form @submit.prevent="agregarOEditarInsumo">
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
                  Insumo
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
                v-model.trim="registroICA"
                label="Registro ICA"
                required
              />
              <q-input
                v-model.trim="registroINVIMA"
                label="Registro INVIMA"
                required
              />
              <q-input
                v-model.trim="relacionNPK"
                label="Relación NPK"
                required
              />
              <q-input
                v-model.trim="cantidad"
                label="Cantidad"
                type="number"
                required
              />
              <q-select
                v-model="unidad"
                label="Unidad"
                :options="[
                  { label: 'Kilogramos (kg)', value: 'kg' },
                  { label: 'Litros (lts)', value: 'lts' },
                ]"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model.trim="observaciones" label="Observaciones" />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarInsumo"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <div v-if="useInsumos.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useInsumosStore } from "../stores/insumos.js";
import { useFincasStore } from "../stores/fincas.js";

const showForm = ref(false);
const idFinca = ref("");
const nombre = ref("");
const registroICA = ref("");
const registroINVIMA = ref("");
const relacionNPK = ref("");
const cantidad = ref(0);
const unidad = ref("");
const responsable = ref("");
const observaciones = ref("");
const total = ref(0);
const insumoId = ref(null);
const selectedInsumoId = ref("");

const rows = ref([]);
const columns = ref([
  {
    name: "id_finca",
    label: "Finca",
    align: "center",
    field: "nombreFinca",
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: "nombre",
  },
  {
    name: "registro_ica",
    label: "Registro Ica",
    align: "center",
    field: "registro_ica",
  },
  {
    name: "resgistro_invima",
    label: "Registro Invima",
    align: "center",
    field: "registro_invima",
  },
  {
    name: "relacion_NPK",
    label: "Relacion NPK",
    align: "center",
    field: "relacion_NPK",
  },
  {
    name: "unidad",
    label: "Unidad",
    align: "center",
    field: "unidad",
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },

  {
    name: "observaciones",
    label: "Observaciones",
    align: "center",
    field: "observaciones",
  },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const fincasOptions = ref([]); // Cambiado de proveedoresOptions a fincasOptions
const insumoOptions = ref([]);

const useInsumos = useInsumosStore();
const useFincas = useFincasStore();

async function listarInsumos() {
  try {
    const r = await useInsumos.getInsumos();
    console.log("Insumos obtenidos:", r.insumos); // Verificar los insumos

    const fincasResponse = await useFincas.listarFinca();
    console.log("Respuesta completa de listarFinca:", fincasResponse); // Verificar la respuesta completa

    // Cambiado a `fincasResponse.finca` ya que la respuesta devuelve `finca` y no `fincas`
    const fincas = fincasResponse.finca || []; 

    rows.value = r.insumos.map((insumo) => {
      const finca = fincas.find((e) => e._id === insumo.id_finca);
      console.log(`Insumo: ${insumo.nombre}, ID Finca: ${insumo.id_finca}, Finca encontrada:`, finca);
      return {
        ...insumo,
        nombreFinca: finca ? finca.nombre : "Desconocido", // Si no se encuentra la finca
      };
    });

    insumoOptions.value = r.insumos.map((insumo) => {
      const finca = fincas.find((e) => e._id === insumo.id_finca);
      const nombreFinca = finca ? finca.nombre : "Desconocido";
      return {
        label: `${insumo.nombre} - Finca ${nombreFinca}`,
        value: insumo._id,
      };
    });
  } catch (error) {
    console.error('Error al listar insumos o fincas:', error);
  }
}



async function listarInsumosActivos() {
  try {
    const r = await useInsumos.getInsumosActivas();
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || []; // Asegurar que el campo es 'finca'

    rows.value = r.activados.map((insumo) => {
      const finca = fincas.find((e) => e._id === insumo.id_finca); // id_finca en vez de idFinca
      return {
        ...insumo,
        nombreFinca: finca ? finca.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error('Error al listar insumos activos:', error);
    rows.value = [];
  }
}

async function listarInsumosInactivos() {
  try {
    const r = await useInsumos.getInsumosInactivas();
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || []; // Corregido a 'finca'

    rows.value = r.desactivados.map((insumo) => {
      const finca = fincas.find((e) => e._id === insumo.id_finca); // id_finca en vez de idFinca
      return {
        ...insumo,
        nombreFinca: finca ? finca.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error('Error al listar insumos inactivos:', error);
    rows.value = [];
  }
}

async function obtenerInsumoPorID(selectedInsumoId) {
  try {
    const r = await useInsumos.getInsumosByID(selectedInsumoId);
    const fincasResponse = await useFincas.listarFinca();
    const fincas = fincasResponse.finca || []; // Asegurarse de que es 'finca'

    if (r.insumo) {
      const finca = fincas.find((e) => e._id === r.insumo.id_finca); // id_finca en vez de idFinca
      rows.value = [
        {
          ...r.insumo,
          nombreFinca: finca ? finca.nombre : "Desconocido",
        },
      ];
    } else {
      console.error("No se encontró ningún insumo con el ID proporcionado");
      rows.value = [];
    }
  } catch (error) {
    console.error('Error al obtener el insumo por ID:', error);
    rows.value = [];
  }
}

async function agregarOEditarInsumo() {
  try {
    const data = {
      id_finca: idFinca.value, // Corregido a id_finca
      nombre: nombre.value,
      registro_ica: registroICA.value,
      registro_invima: registroINVIMA.value,
      relacion_NPK: relacionNPK.value,
      cantidad: cantidad.value,
      unidad: unidad.value,
      observaciones: observaciones.value,
      estado: 1,
    };

    let result;

    if (insumoId.value) {
      result = await useInsumos.putInsumos(insumoId.value, data);
    } else {
      result = await useInsumos.postInsumos(data);
    }

    if (result.success) {
      listarInsumos();
      resetForm();
      showForm.value = false;
    }
  } catch (error) {
    console.error('Error al agregar o editar insumo:', error);
  }
}

function cancelarAgregarInsumo() {
  resetForm();
  showForm.value = false;
}

function editarInsumo(insumo) {
  insumoId.value = insumo._id;
  idFinca.value = insumo.id_finca; // Corregido a id_finca
  nombre.value = insumo.nombre;
  registroICA.value = insumo.registro_ica;
  registroINVIMA.value = insumo.registro_invima;
  relacionNPK.value = insumo.relacion_NPK;
  cantidad.value = insumo.cantidad;
  unidad.value = insumo.unidad;
  observaciones.value = insumo.observaciones;
  showForm.value = true;
}

async function activarInsumo(insumo) {
  try {
    await useInsumos.toggleEstadoInsumos(insumo._id, true);
    listarInsumos();
  } catch (error) {
    console.error('Error al activar insumo:', error);
  }
}

async function desactivarInsumo(insumo) {
  try {
    await useInsumos.toggleEstadoInsumos(insumo._id, false);
    listarInsumos();
  } catch (error) {
    console.error('Error al desactivar insumo:', error);
  }
}

function resetForm() {
  insumoId.value = null;
  idFinca.value = "";
  nombre.value = "";
  registroICA.value = "";
  registroINVIMA.value = "";
  relacionNPK.value = "";
  cantidad.value = 0;
  unidad.value = "";
  observaciones.value = "";
  total.value = 0;
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

watch(showForm, (newVal) => {
  if (newVal) {
    cargarFincas();
  }
});

listarInsumos();
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
