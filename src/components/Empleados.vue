<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Empleados</div>
      <q-btn
        label="Agregar Empleados"
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
          <q-item clickable v-ripple @click="listarEmpleados">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarEmpleadosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarEmpleadosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedEmpleadosId"
        label="Seleccionar Empleados"
        :options="userOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerEmpleadosPorID"
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
                  @click="editarEmpleados(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 170px; height: 40px; font-size: 15px"
                  >
                    Editar Empleados
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarEmpleados(props.row)"
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
                  @click="desactivarEmpleados(props.row)"
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
                <div class="text-h6">No hay Empleados disponibles</div>
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
            <q-form @submit.prevent="agregarOEditarEmpleados">
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
                  Empleado
                </h1>
              </div>
              <q-input v-model.trim="nombre" label="Nombre " required />
              <q-input v-model.trim="documento" label="Documento" required />
              <q-input v-model.trim="direccion" label="Dirección" required />
              <q-input v-model.trim="correo" label="Correo" required />
              <q-input v-model.trim="telefono" label="Teléfono" required />
              <q-input
                v-model.trim="fechaNacimiento"
                type="date"
                label="FechaNacimiento"
                required
              />
              <q-input v-model.trim="estudios" label="Estudios" required />
              <q-input
                v-model.trim="descripcion"
                label="Descripcion"
                required
              />
              <q-input
                v-model.trim="fechaContratacion"
                type="date"
                label="FechaContrato"
                required
              />
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
                  @click="cancelarAgregarEmpleados"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useEmpleados.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>
  
  <script setup>
import { ref, watch } from "vue";
import { useEmpleadosStore } from "../stores/empleados.js";

const drawer = ref(false);
const showForm = ref(false);
const nombre = ref("");
const correo = ref("");
const documento = ref("");
const direccion = ref("");
const telefono = ref("");
const password = ref("");
const selectedEmpleadosId = ref("");
const fechaNacimiento = ref("");
const estudios = ref("");
const descripcion = ref("");
const fechaContratacion = ref("");
const empleadosId = ref(null);
//   const administradorId = ref(null); // Para almacenar el ID del administrador en edición

const isEditing = ref(false);
const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  {
    name: "nombre",
    label: "Nombre ",
    align: "center",
    field: "nombre",
  },
  {
    name: "documento",
    label: "documento",
    align: "center",
    field: "documento",
  },
  { name: "correo", label: "correo", align: "center", field: "correo" },
  { name: "telefono", label: "Teléfono", align: "center", field: "telefono" },
  {
    name: "direccion",
    label: "Dirección",
    align: "center",
    field: "direccion",
  },
  {
    name: "fechaNacimiento",
    label: "FechaNacimiento",
    align: "center",
    field: "fechaNacimiento",
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
  { name: "estudios", label: "Estudios", align: "center", field: "estudios" },
  {
    name: "descripcion",
    label: "Descripcion",
    align: "center",
    field: "descripcion",
  },
  {
    name: "fechaContratacion",
    label: "FechaContratacion",
    align: "center",
    field: "fechaContratacion",
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
  { name: "estado", label: "Estado", align: "center", field: "estado" },

  {
    name: "opciones",
    label: "Opciones",
    align: "center",
    field: "opciones",
  },
]);

const userOptions = ref([]);

const useEmpleados = useEmpleadosStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function listarEmpleados() {
  try {
    const r = await useEmpleados.getEmpleados();
    rows.value = r.empleados;
    userOptions.value = r.empleados.map((empleados) => ({
      label: empleados.nombre,
      value: empleados._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarEmpleadosActivos() {
  try {
    const r = await useEmpleados.getEmpleadosActivos();
    rows.value = r.activados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarEmpleadosInactivos() {
  try {
    const r = await useEmpleados.getEmpleadosInactivos();
    rows.value = r.desactivados || [];
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}
async function agregarOEditarEmpleados() {
  try {
    const data = {
      nombre: nombre.value,
      correo: correo.value,
      telefono: telefono.value,
      password: password.value,
      documento: documento.value,
      direccion: direccion.value,
      fechaNacimiento: fechaNacimiento.value,
      estudios: estudios.value,
      descripcion: descripcion.value,
      fechaContratacion: fechaContratacion.value,
    };

    let result;

    if (empleadosId.value) {
      result = await useEmpleados.putEmpleados(empleadosId.value, data);
    } else {
      result = await useEmpleados.postEmpleados(data);
    }

    if (result.success) {
      listarEmpleados(); // Actualiza la lista de administradores después de agregar o editar
      showForm.value = false; // Cierra el formulario solo si la operación fue exitosa
    }
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarEmpleados() {
  showForm.value = false;
  isEditing.value = false;
  empleadosId.value = null;
  nombre.value = "";
  correo.value = "";
  telefono.value = "";
  documento.value = "";
  direccion.value = "";
  fechaNacimiento.value = "";
  estudios.value = "";
  descripcion.value = "";
  fechaContratacion.value = "";
  password.value = "";
}

function editarEmpleados(empleados) {
  nombre.value = empleados.nombre;
  correo.value = empleados.correo;
  telefono.value = empleados.telefono;
  documento.value = empleados.documento;
  direccion.value = empleados.direccion;
  fechaNacimiento.value = empleados.fechaNacimiento;
  estudios.value = empleados.estudios;
  descripcion.value = empleados.descripcion;
  fechaContratacion.value = empleados.fechaContratacion;
  password.value = ""; // La contraseña no se muestra
  // administradorId.value = administrador._id; // Almacena el ID del administrador en edición
  isEditing.value = true;
  showForm.value = true;
}

async function obtenerEmpleadosPorID(selectedEmpleadosId) {
  try {
    const empleado = await useEmpleados.getEmpleadosByID(selectedEmpleadosId);
    if (empleado) {
      rows.value = [empleado];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}

async function activarEmpleados(empleados) {
  try {
    await useEmpleados.toggleEstadoEmpleados(empleados._id, true);
    listarEmpleados();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarEmpleados(empleados) {
  try {
    await useEmpleados.toggleEstadoEmpleados(empleados._id, false);
    listarEmpleados();
  } catch (error) {
    console.error(error);
  }
}

listarEmpleados(); // Llama a la función para listar administradores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarEmpleados();
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