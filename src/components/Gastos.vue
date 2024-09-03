<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Gastos</div>
      <q-btn
        label="Agregar Gasto"
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
          <q-item clickable v-ripple @click="listarGastos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarGastosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarGastosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedGastoId"
        label="Seleccionar Gasto"
        :options="gastosOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerGastoPorID"
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
            no-data-label="No hay registros de gastos disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarGasto(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Gasto
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarGasto(props.row)"
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
                  @click="desactivarGasto(props.row)"
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
            <q-form @submit.prevent="agregarOEditarGasto">
              <!-- Header -->
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
                    alt="Gastos"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Gastos
                </h1>
              </div>

              <!-- Campos adicionales -->
              <q-select
                v-model="idInsumo"
                label="Seleccionar Insumo"
                :options="insumosOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-select
                v-model="idSemilla"
                label="Seleccionar Semilla"
                :options="semillasOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-select
                v-model="idMantenimiento"
                label="Seleccionar Mantenimiento"
                :options="mantenimientosOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />

              <q-input v-model.trim="nombre" label="Nombre" required />
              <q-input
                v-model.trim="numero_factura"
                label="Número de Factura"
                required
              />
              <q-input
                v-model.trim="descripcion"
                label="Descripción"
                required
              />
              <q-input
                v-model.trim="total"
                label="Total"
                type="number"
                required
              />

              <!-- Botones -->
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarGasto"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Loader -->
      <div v-if="useGastos.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useGastosStore } from "../stores/gastos.js";
import { useInsumosStore } from "../stores/insumos.js";
import { useSemillasStore } from "../stores/semillas.js";
import { useMantenimientosStore } from "../stores/mantenimientos.js";

const showForm = ref(false);
const nombre = ref("");
const numero_factura = ref("");
const descripcion = ref("");
const total = ref(0);
const gastoId = ref(null);
const selectedGastoId = ref("");
const idInsumo = ref("");
const idSemilla = ref("");
const idMantenimiento = ref("");

const rows = ref([]);
const columns = ref([
  {
    name: "idInsumo",
    label: "Insumo",
    align: "center",
    field: "nombreInsumo",
  },
  {
    name: "idSemilla",
    label: "Semilla",
    align: "center",
    field: "nombreSemilla",
  },
  {
    name: "idMantenimiento",
    label: "Mántenimiento",
    align: "center",
    field: "nombreMantenimiento",
  },
  { name: "nombre", label: "Nombre", align: "center", field: "nombre" },
  {
    name: "numero_factura",
    label: "Número de Factura",
    align: "center",
    field: "numero_factura",
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
  },
  { name: "total", label: "Total", align: "center", field: "total" },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const gastosOptions = ref([]);
const insumosOptions = ref([]);
const semillasOptions = ref([]);
const mantenimientosOptions = ref([]);

const useGastos = useGastosStore();
const useInsumos = useInsumosStore();
const useSemillas = useSemillasStore();
const useMantenimientos = useMantenimientosStore();

async function listarGastos() {
  try {
    const r = await useGastos.getGastos();
    const insumos = await useInsumos.getInsumos();
    const semillas = await useSemillas.getSemillas();
    const mantenimiento = await useMantenimientos.getManteni();
    rows.value = r.gasto.map((gasto) => {
      const insumo = insumos.insumos.find((e) => e._id === gasto.idInsumo);
      const semilla = semillas.semillas.find((e) => e._id === gasto.idSemilla);
      const mantenimientos = mantenimiento.mantenimiento.find(
        (e) => e._id === gasto.idMantenimiento
      );
      return {
        ...gasto,
        nombreInsumo: insumo ? insumo.nombre : "NN",
        nombreSemilla: semilla ? semilla.especie : "NN",
        nombreMantenimiento: mantenimientos ? mantenimientos.responsable : "NN",
      };
    });
    gastosOptions.value = r.gasto.map((gasto) => ({
      label: gasto.nombre + " Factura( " + gasto.numero_factura + ")",
      value: gasto._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarGastosActivos() {
  try {
    const r = await useGastos.getGastosActivas();
    const insumos = await useInsumos.getInsumos();
    const semillas = await useSemillas.getSemillas();
    const mantenimiento = await useMantenimientos.getManteni();
    rows.value = r.activados.map((gasto) => {
      const insumo = insumos.insumos.find((e) => e._id === gasto.idInsumo);
      const semilla = semillas.semillas.find((e) => e._id === gasto.idSemilla);
      const mantenimientos = mantenimiento.mantenimiento.find(
        (e) => e._id === gasto.idMantenimiento
      );
      return {
        ...gasto,
        nombreInsumo: insumo ? insumo.nombre : "NN",
        nombreSemilla: semilla ? semilla.especie : "NN",
        nombreMantenimiento: mantenimientos ? mantenimientos.responsable : "NN",
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function listarGastosInactivos() {
  try {
    const r = await useGastos.getGastosInactivas();
    const insumos = await useInsumos.getInsumos();
    const semillas = await useSemillas.getSemillas();
    const mantenimiento = await useMantenimientos.getManteni();
    rows.value = r.desactivados.map((gasto) => {
      const insumo = insumos.insumos.find((e) => e._id === gasto.idInsumo);
      const semilla = semillas.semillas.find((e) => e._id === gasto.idSemilla);
      const mantenimientos = mantenimiento.mantenimiento.find(
        (e) => e._id === gasto.idMantenimiento
      );
      return {
        ...gasto,
        nombreInsumo: insumo ? insumo.nombre : "NN",
        nombreSemilla: semilla ? semilla.especie : "NN",
        nombreMantenimiento: mantenimientos ? mantenimientos.responsable : "NN",
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function listarInsumos() {
  try {
    const r = await useInsumos.getInsumos();
    insumosOptions.value = r.insumos.map((insumo) => ({
      label: insumo.nombre,
      value: insumo._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarSemillas() {
  try {
    const r = await useSemillas.getSemillas();
    semillasOptions.value = r.semillas.map((semilla) => ({
      label: semilla.especie,
      value: semilla._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarMantenimientos() {
  try {
    const r = await useMantenimientos.getManteni();
    mantenimientosOptions.value = r.mantenimiento.map((mantenimiento) => ({
      label: mantenimiento.responsable,
      value: mantenimiento._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function agregarOEditarGasto() {
  const data = {
    nombre: nombre.value,
    numero_factura: numero_factura.value,
    descripcion: descripcion.value,
    total: total.value,
    idInsumo: idInsumo.value,
    idSemilla: idSemilla.value,
    idMantenimiento: idMantenimiento.value,
  };

  try {
    if (gastoId.value) {
      await useGastos.putGastos(gastoId.value, data);
    } else {
      await useGastos.postGastos(data);
    }
    listarGastos();
    Onreset();
    showForm.value = false;
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarGasto() {
  Onreset();
  showForm.value = false;
}

function editarGasto(gasto) {
  gastoId.value = gasto._id;
  nombre.value = gasto.nombre;
  numero_factura.value = gasto.numero_factura;
  descripcion.value = gasto.descripcion;
  total.value = gasto.total;
  idInsumo.value = gasto.idInsumo;
  idSemilla.value = gasto.idSemilla;
  idMantenimiento.value = gasto.idMantenimiento;
  showForm.value = true;
}

function Onreset() {
  gastoId.value = null;
  nombre.value = "";
  numero_factura.value = "";
  descripcion.value = "";
  total.value = 0;
  idInsumo.value = "";
  idSemilla.value = "";
  idMantenimiento.value = "";
}

async function activarGasto(gasto) {
  try {
    await useGastos.toggleEstadoGastos(gasto._id, true);
    listarGastos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarGasto(gasto) {
  try {
    await useGastos.toggleEstadoGastos(gasto._id, false);
    listarGastos();
  } catch (error) {
    console.error(error);
  }
}

async function obtenerGastoPorID(selectedGastoId) {
  try {
    const r = await useGastos.getGastosByID(selectedGastoId);
    const insumos = await useInsumos.getInsumos();
    const semillas = await useSemillas.getSemillas();
    const mantenimiento = await useMantenimientos.getManteni();

    // Si r.gasto es un solo objeto, no necesitamos mapear, simplemente manejamos el objeto directamente
    const gasto = r.gasto;
    const insumo = insumos.insumos.find((e) => e._id === gasto.idInsumo);
    const semilla = semillas.semillas.find((e) => e._id === gasto.idSemilla);
    const mantenimientos = mantenimiento.mantenimiento.find(
      (e) => e._id === gasto.idMantenimiento
    );

    // Asignamos el objeto a rows.value como un arreglo con un solo elemento
    rows.value = [
      {
        ...gasto,
        nombreInsumo: insumo ? insumo.nombre : "NN",
        nombreSemilla: semilla ? semilla.especie : "NN",
        nombreMantenimiento: mantenimientos ? mantenimientos.responsable : "NN",
      },
    ];
  } catch (error) {
    console.error(error);
  }
}

listarGastos();
listarInsumos();
listarSemillas();
listarMantenimientos();
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.q-btn-dropdown {
  display: inline-flex;
}
</style>
