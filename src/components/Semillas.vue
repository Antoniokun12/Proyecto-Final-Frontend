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
                v-model="idProveedor"
                label="Proveedor"
                :options="proveedoresOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input
                v-model.trim="numFactura"
                label="Número de Factura"
                required
              />
              <q-input
                v-model.trim="fechaVencimiento"
                type="date"
                label="Fecha de vencimiento"
                required
              />
              <q-input v-model.trim="especie" label="Especie" required />
              <q-input
                v-model.trim="NumLote"
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
                v-model.trim="unidadtotal"
                label="Unidades Totales"
                required
                type="number"
              />
              <q-input
                v-model.trim="total"
                label="Total"
                required
                type="number"
              />

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
import { useProveedorStore } from "../stores/proveedores.js";

const showForm = ref(false);
const idProveedor = ref("");
const numFactura = ref("");
const fechaCompra = ref(null);
const fechaVencimiento = ref(null);
const especie = ref("");
const NumLote = ref(0);
const origen = ref("");
const poderGerminativo = ref("");
const unidadtotal = ref(0);
const total = ref(0);
const selectedSemillaId = ref("");
let semillaId = ref(null);

const rows = ref([]);
const columns = ref([
  {
    name: "idProveedor",
    label: "Proveedor",
    align: "center",
    field: "nombreProveedor",
  },
  {
    name: "numFactura",
    label: "Número de Factura",
    align: "center",
    field: "numFactura",
  },
  {
    name: "fechaCompra",
    label: "Fecha de Compra",
    align: "center",
    field: "fechaCompra",
    format: (val) => {
      const fecha = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);

      return fechaFormateada;
    },
  },
  {
    name: "fechaVencimiento",
    label: "Fecha de Vencimiento",
    align: "center",
    field: "fechaVencimiento",
    format: (val) => {
      const fecha = new Date(val);
      const opcionesFecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);

      return fechaFormateada;
    },
  },
  { name: "especie", label: "Especie", align: "center", field: "especie" },
  {
    name: "NumLote",
    label: "Número de Lote",
    align: "center",
    field: "NumLote",
  },
  { name: "origen", label: "Origen", align: "center", field: "origen" },
  {
    name: "poderGerminativo",
    label: "Poder Germinativo",
    align: "center",
    field: "poderGerminativo",
  },
  {
    name: "unidadtotal",
    label: "Unidades Totales",
    align: "center",
    field: "unidadtotal",
  },
  { name: "total", label: "Total", align: "center", field: "total" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const semillaOptions = ref([]);

const useSemillas = useSemillasStore();
const useProveedores = useProveedorStore();

const proveedoresOptions = ref([]);

async function listarSemillas() {
  try {
    const r = await useSemillas.getSemillas();
    const proveedores = await useProveedores.getProveedores();
    // console.log(r);
    rows.value = r.semillas.map((semillas) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === semillas.idProveedor
      );
      return {
        ...semillas,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
    semillaOptions.value = r.semillas.map((semilla) => ({
      label: semilla.especie,
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
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.activados.map((semillas) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === semillas.idProveedor
      );
      return {
        ...semillas,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
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
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.desactivados.map((semillas) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === semillas.idProveedor
      );
      return {
        ...semillas,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
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
    const proveedores = await useProveedores.getProveedores();
    if (r.semilla) {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === r.semilla.idProveedor
      );
      rows.value = [{
        ...r.semilla,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      }];
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
  idProveedor.value = "";
  numFactura.value = "";
  fechaCompra.value = null;
  fechaVencimiento.value = null;
  especie.value = "";
  NumLote.value = 0;
  origen.value = "";
  poderGerminativo.value = "";
  unidadtotal.value = 0;
  total.value = 0;
  semillaId.value = null;
}

async function agregarOEditarSemilla() {
  const semillaData = {
    idProveedor: idProveedor.value,
    numFactura: numFactura.value,
    fechaVencimiento: fechaVencimiento.value,
    especie: especie.value,
    NumLote: NumLote.value,
    origen: origen.value,
    poderGerminativo: poderGerminativo.value,
    unidadtotal: unidadtotal.value,
    total: total.value,
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
  idProveedor.value = semillas.idProveedor;
  numFactura.value = semillas.numFactura;
  fechaVencimiento.value = new Date(semillas.fechaVencimiento)
    .toISOString()
    .substring(0, 10);
  especie.value = semillas.especie;
  NumLote.value = semillas.NumLote;
  origen.value = semillas.origen;
  poderGerminativo.value = semillas.poderGerminativo;
  unidadtotal.value = semillas.unidadtotal;
  total.value = semillas.total;
  semillaId.value = semillas._id;
  showForm.value = true;
}

async function listarProveedores() {
  try {
    const r = await useProveedores.getProveedores();
    proveedoresOptions.value = r.proveedores.map((proveedor) => ({
      label: proveedor.nombre,
      value: proveedor._id,
    }));
  } catch (error) {
    console.error(error);
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

listarSemillas();
listarProveedores();
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
