<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Proveedores</div>
      <q-btn
        label="Agregar Proveedor"
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
          <q-item clickable v-ripple @click="listarProveedores">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarProveedoresActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarProveedoresActivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedProveedorId"
        label="Seleccionar Proveedor"
        :options="proveedorOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerProveedorPorID"
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
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarProveedor(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Administrador
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarProveedor(props.row)"
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
                  @click="desactivarProveedor(props.row)"
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
                <div class="text-h6">No hay Proveedores disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarProveedor">
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
                  Proveedor
                </h1>
              </div>
              <q-input
                v-model.trim="nombre"
                label="Nombre del Proveedor"
                required
              />
              <q-input v-model.trim="direccion" label="Dirección" required />
              <q-input v-model.trim="telefono" label="Teléfono" required />
              <q-input v-model.trim="email" label="Email" required />
              
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarProveedor"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useProveedores.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProveedorStore } from "../stores/proveedores.js";

const drawer = ref(false);
const showForm = ref(false);
const nombre = ref("");
const email = ref("");
const direccion = ref("");
const telefono = ref("");
const selectedProveedorId = ref("");
const proveedorId = ref(null); // Para almacenar el ID del proveedor en edición

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  {
    name: "nombre",
    label: "Nombre Proveedor",
    align: "center",
    field: "nombre",
  },
  {
    name: "direccion",
    label: "Dirección",
    align: "center",
    field: "direccion",
  },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  { name: "email", label: "Email", align: "center", field: "email" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const proveedorOptions = ref([]);

const useProveedores = useProveedorStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function listarProveedores() {
  try {
    const r = await useProveedores.getProveedores();
    rows.value = r.proveedores || [];
    proveedorOptions.value = r.proveedores.map(p => ({
      value: p._id,
      label: p.nombre
    }));
  } catch (error) {
    console.error(error);
    rows.value = [];
    proveedorOptions.value = [];
  }
}



async function listarProveedoresActivos() {
  try {
    const r = await useProveedores.getProveedoresActivos();
    rows.value = r.activados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarProveedoresInactivos() {
  try {
    const r = await useProveedores.getProveedoresInactivos();
    rows.value = r.desactivados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarProveedor() {
  try {
    const data = {
      nombre: nombre.value,
      direccion: direccion.value,
      telefono: telefono.value,
      email: email.value,
    };

    let result;

    if (proveedorId.value) {
      result = await useProveedores.putProveedor(proveedorId.value, data);
    } else {
      result = await useProveedores.postProveedor(data);
    }

    if (result.success) {
      listarProveedores(); // Actualiza la lista de proveedores después de agregar o editar
      showForm.value = false;   // Cierra el formulario solo si la operación fue exitosa
    } else {
      console.error(result.error); // Agrega un mensaje de error si la operación falla
    }
  } catch (error) {
    console.error(error);
  }
}


function cancelarAgregarProveedor() {
  showForm.value = false;
  proveedorId.value = null;
  nombre.value = "";
  direccion.value = "";
  telefono.value = "";
  email.value = "";
}

function editarProveedor(proveedor) {
  nombre.value = proveedor.nombre;
  direccion.value = proveedor.direccion;
  telefono.value = proveedor.telefono;
  email.value = proveedor.email;
  proveedorId.value = proveedor._id; // Almacena el ID del proveedor en edición
  showForm.value = true;
}

async function obtenerProveedorPorID(selectedProveedorId) {
  try {
    const proveedor = await useProveedores.getProveedorByID(selectedProveedorId);
    if (proveedor) {
      rows.value = [proveedor];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarProveedor(proveedor) {
  try {
    await useProveedores.toggleEstadoProveedor(proveedor._id, true);
    listarProveedores();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarProveedor(proveedor) {
  try {
    await useProveedores.toggleEstadoProveedor(proveedor._id, false);
    listarProveedores();
  } catch (error) {
    console.error(error);
  }
}

listarProveedores(); // Llama a la función para listar proveedores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarProveedor();
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
