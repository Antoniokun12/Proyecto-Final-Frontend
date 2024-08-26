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
                v-model="idProveedor"
                label="Proveedor"
                :options="proveedoresOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model.trim="nombre" label="Nombre" required />
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
              <q-input
                v-model.trim="unidad"
                label="Unidad"
                type="number"
                required
              />
              <q-input
                v-model.trim="responsable"
                label="Responsable"
                required
              />
              <q-input
                v-model.trim="observaciones"
                label="Observaciones"
                required
              />
              <q-input
                v-model.trim="total"
                label="Total"
                type="number"
                required
              />

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
import { useProveedorStore } from "../stores/proveedores.js";

const showForm = ref(false);
const idProveedor = ref("");
const nombre = ref("");
const relacionNPK = ref("");
const cantidad = ref(0);
const unidad = ref(0);
const responsable = ref("");
const observaciones = ref("");
const total = ref(0);
const insumoId = ref(null);
const selectedInsumoId = ref("");

const rows = ref([]);
const columns = ref([
  {
    name: "idProveedor",
    label: "Proveedor",
    align: "center",
    field: "nombreProveedor",
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: "nombre",
  },
  {
    name: "relacionNPK",
    label: "Relación NPK",
    align: "center",
    field: "relacionNPK",
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "unidad", label: "Unidad", align: "center", field: "unidad" },
  {
    name: "responsable",
    label: "Responsable",
    align: "center",
    field: "responsable",
  },
  {
    name: "observaciones",
    label: "Observaciones",
    align: "center",
    field: "observaciones",
  },
  {
    name: "total",
    label: "Total",
    align: "center",
    field: "total",
  },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const proveedoresOptions = ref([]);
const insumoOptions = ref([]);

const useInsumos = useInsumosStore();
const useProveedores = useProveedorStore();

async function listarInsumos() {
  try {
    const r = await useInsumos.getInsumos();
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.insumos.map((insumo) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === insumo.idProveedor
      );
      return {
        ...insumo,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
    insumoOptions.value = r.insumos.map((insumo) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === insumo.idProveedor
      );
      const nombreProveedor = proveedor ? proveedor.nombre : "Desconocido";
      
      return {
        label: `${insumo.nombre} - Proveedor ${nombreProveedor}`,
        value: insumo._id,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function listarInsumosActivos() {
  try {
    const r = await useInsumos.getInsumosActivas();
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.activados.map((insumo) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === insumo.idProveedor
      );
      return {
        ...insumo,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarInsumosInactivos() {
  try {
    const r = await useInsumos.getInsumosInactivas();
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.desactivados.map((insumo) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === insumo.idProveedor
      );
      return {
        ...insumo,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function obtenerInsumoPorID(selectedInsumoId) {
  try {
    const r = await useInsumos.getInsumosByID(selectedInsumoId);
    const proveedores = await useProveedores.getProveedores();
    if (r.insumo) {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === r.insumo.idProveedor
      );
      rows.value = [{
        ...r.insumo,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      }];
    } else {
      console.error("No se encontró ninguna insumo con el ID proporcionado");
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarInsumo() {
  try {
    const data = {
      idProveedor: idProveedor.value,
      nombre: nombre.value,
      relacionNPK: relacionNPK.value,
      cantidad: cantidad.value,
      unidad: unidad.value,
      responsable: responsable.value,
      observaciones: observaciones.value,
      total: total.value,
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
    console.error(error);
  }
}

function cancelarAgregarInsumo() {
  resetForm();
  showForm.value = false;
}

function editarInsumo(insumo) {
  insumoId.value = insumo._id;
  idProveedor.value = insumo.idProveedor;
  nombre.value = insumo.nombre;
  relacionNPK.value = insumo.relacionNPK;
  cantidad.value = insumo.cantidad;
  unidad.value = insumo.unidad;
  responsable.value = insumo.responsable;
  observaciones.value = insumo.observaciones;
  total.value = insumo.total;
  showForm.value = true;
}

async function activarInsumo(insumo) {
  try {
    await useInsumos.toggleEstadoInsumos(insumo._id, true);
    listarInsumos();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarInsumo(insumo) {
  try {
    await useInsumos.toggleEstadoInsumos(insumo._id, false);
    listarInsumos();
  } catch (error) {
    console.error(error);
  }
}

function resetForm() {
  insumoId.value = null;
  idProveedor.value = "";
  nombre.value = "";
  relacionNPK.value = "";
  cantidad.value = 0;
  unidad.value = 0;
  responsable.value = "";
  observaciones.value = "";
  total.value = 0;
}

async function cargarProveedores() {
  try {
    const r = await useProveedores.getProveedores();
    proveedoresOptions.value = r.proveedores.map((proveedor) => ({
      value: proveedor._id,
      label: proveedor.nombre,
    }));
  } catch (error) {
    console.error(error);
  }
}

watch(showForm, (newVal) => {
  if (newVal) {
    cargarProveedores();
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
