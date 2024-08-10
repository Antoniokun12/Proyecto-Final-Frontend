<template>
  <q-page>
    <q-drawer v-model="drawer" side="left" bordered>
      <q-list>
        <q-expansion-item
          label="Gestión Administrativa"
          icon="settings"
          expand-separator
          default-opened
        >
          <q-item clickable v-ripple @click="listarAdministradores">
            <q-item-section>Administrador</q-item-section>
          </q-item>
          <!-- Otros items pueden ser añadidos aquí -->
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <div class="q-pa-md text-center">
      <div class="text-h2">Administradores</div>
      <q-btn
        label="Agregar Administrador"
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
          <q-item clickable v-ripple @click="listarAdministradores">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarAdministradoresActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarAdministradoresInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedUserId"
        label="Seleccionar Administrador"
        :options="userOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerAdministradorPorID"
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
                  @click="editarAdministrador(props.row)"
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
                  @click="activarAdministrador(props.row)"
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
                  @click="desactivarAdministrador(props.row)"
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
                <div class="text-h6">No hay Administradores disponibles</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card style="width: 400px; border-radius: 15px;">
          <q-card-section>
            <q-form @submit.prevent="agregarOEditarAdministrador">
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
                  Administrador
                </h1>
              </div>
              <q-input
                v-model.trim="nombre"
                label="Nombre Administrador"
                required
              />
              <q-input v-model.trim="cedula" label="Cédula" required />
              <q-input v-model.trim="direccion" label="Dirección" required />
              <q-input v-model.trim="email" label="Email" required />
              <q-input v-model.trim="telefono" label="Teléfono" required />
              <q-input v-model.trim="municipio" label="Municipio" required />
              <q-input
                v-if="!isEditing"
                v-model.trim="password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                required
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    @click="togglePasswordVisibility"
                    class="cursor-pointer"
                    size="20px"
                  />
                </template>
              </q-input>
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarAdministrador"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useAdministradores.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAdministradorStore } from "../stores/administrador.js";

const drawer = ref(false);
const showForm = ref(false);
const nombre = ref("");
const email = ref("");
const cedula = ref("");
const direccion = ref("");
const municipio = ref("");
const telefono = ref("");
const password = ref("");
const selectedUserId = ref("");
const administradorId = ref(null); // Para almacenar el ID del administrador en edición

const isEditing = ref(false);
const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  {
    name: "nombre",
    label: "Nombre Administrador",
    align: "center",
    field: "nombre",
  },
  { name: "cedula", label: "Cedula", align: "center", field: "cedula" },
  { name: "email", label: "Email", align: "center", field: "email" },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  {
    name: "direccion",
    label: "Dirección",
    align: "center",
    field: "direccion",
  },
  {
    name: "municipio",
    label: "Municipio",
    align: "center",
    field: "municipio",
  },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const userOptions = ref([]);

const useAdministradores = useAdministradorStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function listarAdministradores() {
  try {
    const r = await useAdministradores.getAdministradores();
    rows.value = r.admin;
    userOptions.value = r.admin.map((administrador) => ({
      label: administrador.nombre,
      value: administrador._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarAdministradoresActivos() {
  try {
    const r = await useAdministradores.getAdministradoresActivos();
    rows.value = r.activados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarAdministradoresInactivos() {
  try {
    const r = await useAdministradores.getAdministradoresInactivos();
    rows.value = r.desactivados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}
async function agregarOEditarAdministrador() {
  try {
    const data = {
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value,
      password: password.value,
      cedula: cedula.value,
      direccion: direccion.value,
      municipio: municipio.value,
    };

    let result;

    if (administradorId.value) {
      result = await useAdministradores.putAdministrador(
        administradorId.value,
        data
      );
    } else {
      result = await useAdministradores.postAdministrador(data);
    }

    if (result.success) {
      listarAdministradores(); // Actualiza la lista de administradores después de agregar o editar
      showForm.value = false; // Cierra el formulario solo si la operación fue exitosa
    }
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarAdministrador() {
  showForm.value = false;
  isEditing.value = false;
  administradorId.value = null;
  nombre.value = "";
  email.value = "";
  telefono.value = "";
  cedula.value = "";
  direccion.value = "";
  municipio.value = "";
  password.value = "";
}

function editarAdministrador(administrador) {
  nombre.value = administrador.nombre;
  email.value = administrador.email;
  telefono.value = administrador.telefono;
  cedula.value = administrador.cedula;
  direccion.value = administrador.direccion;
  municipio.value = administrador.municipio;
  password.value = ""; // La contraseña no se muestra
  administradorId.value = administrador._id; // Almacena el ID del administrador en edición
  isEditing.value = true;
  showForm.value = true;
}

async function obtenerAdministradorPorID(selectedUserId) {
  try {
    const administrador = await useAdministradores.getAdministradorByID(
      selectedUserId
    );
    rows.value = [administrador]; // Actualiza la tabla con el usuario seleccionado
  } catch (error) {
    console.error(error);
  }
}

async function activarAdministrador(administrador) {
  try {
    await useAdministradores.toggleEstadoAdministrador(administrador._id, true);
    listarAdministradores();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarAdministrador(administrador) {
  try {
    await useAdministradores.toggleEstadoAdministrador(
      administrador._id,
      false
    );
    listarAdministradores();
  } catch (error) {
    console.error(error);
  }
}

listarAdministradores(); // Llama a la función para listar administradores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarAdministrador();
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

