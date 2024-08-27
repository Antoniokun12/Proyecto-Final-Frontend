<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Máquinas y Herramientas</div>
      <q-btn
        label="Agregar Máquina"
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
          <q-item clickable v-ripple @click="listarMaquinas">
            <q-item-section>Listar Todas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMaquinasActivas">
            <q-item-section>Listar Activas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMaquinasInactivas">
            <q-item-section>Listar Inactivas</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedMaquinaId"
        label="Seleccionar Máquina"
        :options="maquinaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerMaquinaPorID"
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
            no-data-label="No hay registros de máquinas disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarMaquina(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Máquina
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarMaquina(props.row)"
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
                  @click="desactivarMaquina(props.row)"
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
            <q-form @submit.prevent="agregarOEditarMaquina">
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
                    src="https://cdn-icons-png.flaticon.com/512/2327/2327006.png"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Máquina
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
              <q-input v-model.trim="tipo" label="Tipo" required />
              <q-input
                v-model.trim="FechaCompra"
                label="Fecha de Compra"
                type="date"
                required
              />
              <q-input
                v-model.trim="observaciones"
                label="Observaciones"
                required
              />
              <q-input
                v-model.trim="cantidad"
                label="Cantidad"
                type="number"
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
                  @click="cancelarAgregarMaquina"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useMaquinarias.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMaquinariasStore } from "../stores/maquinarias.js";
import { useProveedorStore } from "../stores/proveedores.js";

const showForm = ref(false);
const idProveedor = ref("");
const nombre = ref("");
const tipo = ref("");
const FechaCompra = ref("");
const observaciones = ref("");
const cantidad = ref(0);
const total = ref(0);
const maquinaId = ref(null);
const selectedMaquinaId = ref("");

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
    name: "tipo",
    label: "Tipo",
    align: "center",
    field: "tipo",
  },
  {
    name: "FechaCompra",
    label: "Fecha de Compra",
    align: "center",
    field: "FechaCompra",
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
    name: "observaciones",
    label: "Observaciones",
    align: "center",
    field: "observaciones",
  },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
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
const maquinaOptions = ref([]);

const useMaquinarias = useMaquinariasStore();
const useProveedores = useProveedorStore();

async function listarMaquinas() {
  try {
    const r = await useMaquinarias.getMaquinarias();
    console.log(r);
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.maquina.map((maquina) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === maquina.idProveedor
      );
      return {
        ...maquina,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
    maquinaOptions.value = r.maquina.map((maquina) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === maquina.idProveedor
      );
      const nombreProveedor = proveedor ? proveedor.nombre : "Desconocido";
      return {
        label: `${maquina.nombre} - Proveedor ${nombreProveedor}`,
        value: maquina._id,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function listarMaquinasActivas() {
  try {
    const r = await useMaquinarias.getMaquinariasActivos();
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.activados.map((maquina) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === maquina.idProveedor
      );
      return {
        ...maquina,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function listarMaquinasInactivas() {
  try {
    const r = await useMaquinarias.getMaquinariasInactivos();
    const proveedores = await useProveedores.getProveedores();
    rows.value = r.desactivados.map((maquina) => {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === maquina.idProveedor
      );
      return {
        ...maquina,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function obtenerMaquinaPorID(selectedMaquinaId) {
  try {
    const r = await useMaquinarias.getMaquinariasByID(selectedMaquinaId);
    const proveedores = await useProveedores.getProveedores();
    if (r.maquinaria) {
      const proveedor = proveedores.proveedores.find(
        (e) => e._id === r.maquinaria.idProveedor
      );
      rows.value = [{
        ...r.maquinaria,
        nombreProveedor: proveedor ? proveedor.nombre : "Desconocido",
      }];
    } else {
      console.error("No se encontró ninguna maquina con el ID proporcionado");
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

function resetForm() {
  idProveedor.value = "";
  nombre.value = "";
  tipo.value = "";
  FechaCompra.value = "";
  observaciones.value = "";
  cantidad.value = 0;
  total.value = 0;
}

async function agregarOEditarMaquina() {
  try {
    const data = {
      idProveedor: idProveedor.value,
      nombre: nombre.value,
      tipo: tipo.value,
      FechaCompra: FechaCompra.value,
      observaciones: observaciones.value,
      cantidad: cantidad.value,
      total: total.value,
    };

    let result;

    if (maquinaId.value) {
      result = await useMaquinarias.putMaquinarias(maquinaId.value, data);
    } else {
      result = await useMaquinarias.postMaquinarias(data);
    }

    if (result.success) {
      listarMaquinas();
      resetForm();
      showForm.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function editarMaquina(maquina) {
  showForm.value = true;
  maquinaId.value = maquina._id;
  idProveedor.value = maquina.idProveedor;
  nombre.value = maquina.nombre;
  tipo.value = maquina.tipo;
  FechaCompra.value = new Date(maquina.FechaCompra).toISOString().substring(0, 10);
  observaciones.value = maquina.observaciones;
  cantidad.value = maquina.cantidad;
  total.value = maquina.total;
}

async function activarMaquina(maquina) {
  try {
    await useMaquinarias.toggleEstadoMaquinarias(maquina._id, true);
    listarMaquinas();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarMaquina(maquina) {
  try {
    await useMaquinarias.toggleEstadoMaquinarias(maquina._id, false);
    listarMaquinas();
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarMaquina() {
  resetForm();
  showForm.value = false;
}

watch(showForm, (value) => {
  if (!value) resetForm();
});

listarMaquinas();
cargarProveedores();

async function cargarProveedores() {
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
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
