<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Nómina</div>
      <q-btn
        label="Agregar Nómina"
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
          <q-item clickable v-ripple @click="listarNominas">
            <q-item-section>Listar Todas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarNominasActivas">
            <q-item-section>Listar Activas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarNominasInactivas">
            <q-item-section>Listar Inactivas</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedNominaId"
        label="Seleccionar Nómina"
        :options="nominaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerNominaPorID"
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
            no-data-label="No hay registros de nómina disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarNomina(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Nómina
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarNomina(props.row)"
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
                  @click="desactivarNomina(props.row)"
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
            <q-form @submit.prevent="agregarOEditarNomina">
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
                  Nomina
                </h1>
              </div>
              <q-select
                v-model="idEmpleado"
                label="Empleado"
                :options="empleadosOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model.trim="tipo" label="Tipo" required />
              <q-input
                v-model.trim="valor"
                label="Valor"
                required
                type="number"
              />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarNomina"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useNominas.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useNominaStore } from "../stores/nomina.js";
import { useEmpleadosStore } from "../stores/empleados.js";

const drawer = ref(false);
const showForm = ref(false);
const idEmpleado = ref("");
const tipo = ref("");
const valor = ref(0);
const selectedNominaId = ref("");
const nominaId = ref(null);

const isEditing = ref(false);

const rows = ref([]);
const columns = ref([
  {
    name: "idEmpleado",
    label: "Empleado",
    align: "center",
    field: "nombreEmpleado",
  },
  { name: "tipo", label: "Tipo", align: "center", field: "tipo" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const nominaOptions = ref([]);

const useNominas = useNominaStore();
const useEmpleados = useEmpleadosStore();

const empleadosOptions = ref([]);

async function listarNominas() {
  try {
    const r = await useNominas.getNominas();
    const empleados = await useEmpleados.getEmpleados();
    rows.value = r.nomina.map((nomina) => {
      const empleado = empleados.empleados.find(
        (e) => e._id === nomina.idEmpleado
      );
      return {
        ...nomina,
        nombreEmpleado: empleado ? empleado.nombre : "Desconocido",
      };
    });
    nominaOptions.value = r.nomina.map((nomina) => ({
      label: nomina.tipo,
      value: nomina._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarNominasActivas() {
  try {
    const r = await useNominas.getNominasActivas();
    const empleados = await useEmpleados.getEmpleados();
    rows.value = r.activados.map((nomina) => {
      const empleado = empleados.empleados.find(
        (e) => e._id === nomina.idEmpleado
      );
      return {
        ...nomina,
        nombreEmpleado: empleado ? empleado.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function listarNominasInactivas() {
  try {
    const r = await useNominas.getNominasInactivas();
    const empleados = await useEmpleados.getEmpleados();
    rows.value = r.desactivados.map((nomina) => {
      const empleado = empleados.empleados.find(
        (e) => e._id === nomina.idEmpleado
      );
      return {
        ...nomina,
        nombreEmpleado: empleado ? empleado.nombre : "Desconocido",
      };
    });
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}

async function agregarOEditarNomina() {
  try {
    const data = {
      idEmpleado: idEmpleado.value,
      tipo: tipo.value,
      valor: valor.value,
    };

    let result;

    if (nominaId.value) {
      result = await useNominas.putNomina(nominaId.value, data);
    } else {
      result = await useNominas.postNomina(data);
    }

    if (result.success) {
      listarNominas();
      showForm.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}

function cancelarAgregarNomina() {
  showForm.value = false;
  isEditing.value = false;
  nominaId.value = null;
  idEmpleado.value = "";
  tipo.value = "";
  valor.value = 0;
}

function editarNomina(nomina) {
  idEmpleado.value = nomina.idEmpleado;
  tipo.value = nomina.tipo;
  valor.value = nomina.valor;
  nominaId.value = nomina._id;
  isEditing.value = true;
  showForm.value = true;
}

async function obtenerNominaPorID(selectedNominaId) {
  try {
    const nomina = await useNominas.getNominaByID(selectedNominaId);
    rows.value = [nomina];
  } catch (error) {
    console.error(error);
  }
}

async function listarEmpleados() {
  try {
    const r = await useEmpleados.getEmpleados();
    empleadosOptions.value = r.empleados.map((empleado) => ({
      label: empleado.nombre + " Documento( " + empleado.documento + ")",
      value: empleado._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function activarNomina(nomina) {
  try {
    await useNominas.toggleEstadoNomina(nomina._id, true);
    listarNominas();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarNomina(nomina) {
  try {
    await useNominas.toggleEstadoNomina(nomina._id, false);
    listarNominas();
  } catch (error) {
    console.error(error);
  }
}

listarNominas();
listarEmpleados();

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarNomina();
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