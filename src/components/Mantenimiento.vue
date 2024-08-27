<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Mantenimientos</div>
      <q-btn
        label="Agregar Mantenimiento"
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
          <q-item clickable v-ripple @click="listarMantenimientos">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMantenimientosActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMantenimientosInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
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
            no-data-label="No hay registros de mantenimientos disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarMantenimiento(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Mantenimiento
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarMantenimiento(props.row)"
                  v-if="props.row.estado === 0"
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
                  @click="desactivarMantenimiento(props.row)"
                  v-if="props.row.estado === 1"
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
                <q-chip :color="props.row.estado === 1 ? 'green' : 'red'" dark>
                  {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
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
            <q-form @submit.prevent="agregarOEditarMantenimiento">
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
                    src="https://cdn-icons-png.flaticon.com/512/2331/2331943.png"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Mantenimiento
                </h1>
              </div>
              <q-select
                v-model="idMaquina"
                label="Máquina"
                :options="maquinaOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input
                v-model.trim="verificacionRealizada"
                label="Verificación Realizada"
                required
              />
              <q-input
                v-model.trim="calibracion"
                label="Calibración"
                required
              />
              <q-input
                v-model.trim="responsable"
                label="Responsable"
                required
              />
              <q-input v-model.trim="observaciones" label="Observaciones" />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarMantenimiento"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useMantenimientos.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMantenimientosStore } from "../stores/mantenimientos.js";
import { useMaquinariasStore } from "../stores/maquinarias.js";

const showForm = ref(false);
const idMaquina = ref("");
const fecha = ref("");
const verificacionRealizada = ref("");
const calibracion = ref("");
const responsable = ref("");
const observaciones = ref("");
const mantenimientoId = ref(null);

const rows = ref([]);
const columns = ref([
  {
    name: "idMaquina",
    label: "Máquina",
    align: "center",
    field: "nombreMaquina",
  },
  {
    name: "fecha",
    label: "Fecha",
    align: "center",
    field: "fecha",
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
    name: "verificacionRealizada",
    label: "Verificación Realizada",
    align: "center",
    field: "verificacionRealizada",
  },
  {
    name: "calibracion",
    label: "Calibración",
    align: "center",
    field: "calibracion",
  },
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
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const maquinaOptions = ref([]);

const useMantenimientos = useMantenimientosStore();
const useMaquinarias = useMaquinariasStore();

async function listarMantenimientos() {
  try {
    const r = await useMantenimientos.getManteni();
    const maquinas = await useMaquinarias.getMaquinarias();
    rows.value = r.mantenimiento.map((mantenimiento) => {
      const maquina = maquinas.maquina.find(
        (e) => e._id === mantenimiento.idMaquina
      );
      return {
        ...mantenimiento,
        nombreMaquina: maquina ? maquina.nombre : "No disponible",
      };
    });
    maquinaOptions.value = maquinas.maquina.map((maquina) => ({
      label: maquina.nombre,
      value: maquina._id,
    }));
  } catch (e) {
    console.error(e);
  }
}

async function listarMantenimientosActivos() {
  try {
    const r = await useMantenimientos.getManteniActivos();
    rows.value = r.mantenimiento;
  } catch (e) {
    console.error(e);
  }
}

async function listarMantenimientosInactivos() {
  try {
    const r = await useMantenimientos.getManteniInactivos();
    rows.value = r.mantenimiento;
  } catch (e) {
    console.error(e);
  }
}

async function obtenerMantenimientoPorID(id) {
  try {
    const r = await useMantenimientos.getManteniByID(id);
    if (r.mantenimiento) {
      idMaquina.value = r.mantenimiento.idMaquina;
      fecha.value = r.mantenimiento.fecha;
      verificacionRealizada.value = r.mantenimiento.verificacionRealizada;
      calibracion.value = r.mantenimiento.calibracion;
      responsable.value = r.mantenimiento.responsable;
      observaciones.value = r.mantenimiento.observaciones;
    }
  } catch (e) {
    console.error(e);
  }
}

function editarMantenimiento(mantenimiento) {
  showForm.value = true;
  idMaquina.value = mantenimiento.idMaquina;
  fecha.value = mantenimiento.fecha;
  verificacionRealizada.value = mantenimiento.verificacionRealizada;
  calibracion.value = mantenimiento.calibracion;
  responsable.value = mantenimiento.responsable;
  observaciones.value = mantenimiento.observaciones;
  mantenimientoId.value = mantenimiento._id;
}

function cancelarAgregarMantenimiento() {
  showForm.value = false;
  fecha.value = "";
  verificacionRealizada.value = "";
  calibracion.value = "";
  responsable.value = "";
  observaciones.value = "";
  mantenimientoId.value = null;
}

async function agregarOEditarMantenimiento() {
  try {
    const data = {
      idMaquina: idMaquina.value,
      verificacionRealizada: verificacionRealizada.value,
      calibracion: calibracion.value,
      responsable: responsable.value,
      observaciones: observaciones.value,
    };

    let result;

    if (mantenimientoId.value) {
      result = await useMantenimientos.putManteni(mantenimientoId.value, data);
    } else {
      result = await useMantenimientos.postManteni(data);
    }

    if (result.success) {
      listarMantenimientos();
      cancelarAgregarMantenimiento();
      showForm.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function activarMantenimiento(mantenimiento) {
  try {
    await useMantenimientos.activarMantenimiento(mantenimiento._id);
    await listarMantenimientos();
  } catch (e) {
    console.error(e);
  }
}

async function desactivarMantenimiento(mantenimiento) {
  try {
    await useMantenimientos.desactivarMantenimiento(mantenimiento._id);
    await listarMantenimientos();
  } catch (e) {
    console.error(e);
  }
}

watch(showForm, (val) => {
  if (!val) {
    cancelarAgregarMantenimiento();
  }
});

listarMantenimientos();
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
