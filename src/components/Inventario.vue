<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Inventario</div>
      <q-btn
        label="Agregar Inventario"
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
          <q-item clickable v-ripple @click="listarInventario">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarInventarioActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarInventarioInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedInventarioId"
        label="Seleccionar Inventario"
        :options="inventarioOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerInventarioPorID"
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
            no-data-label="No hay registros de inventario disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarInventario(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Inventario
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarInventario(props.row)"
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
                  @click="desactivarInventario(props.row)"
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
            <q-form @submit.prevent="agregarOEditarInventario">
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
                    alt="Inventario"
                  />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Inventario
                </h1>
              </div>
              <q-select
                v-model="idSemilla"
                label="Semilla"
                :options="semillasOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-select
                v-model="idInsumo"
                label="Insumo"
                :options="insumosOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-select
                v-model="idMaquina_herramienta"
                label="Máquina/Herramienta"
                :options="maquinasOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input v-model.trim="tipo" label="Tipo" required />
              <q-input
                v-model.trim="cantidad"
                label="Cantidad"
                type="number"
                required
              />
              <q-input
                v-model.trim="unidad"
                label="Unidad"
                required
              />
              <q-input
                v-model.trim="observacion"
                label="Observación"
                required
              />

              <!-- Buttons -->
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarInventario"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Loader -->
      <div v-if="useInventario.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useInventarioStore } from "../stores/inventario.js";
import { useSemillasStore } from "../stores/semillas.js";
import { useInsumosStore } from "../stores/insumos.js";
import { useMaquinariasStore } from "../stores/maquinarias.js";

const showForm = ref(false);
const idSemilla = ref("");
const idInsumo = ref("");
const idMaquina_herramienta = ref("");
const tipo = ref("");
const cantidad = ref(0);
const unidad = ref("");
const observacion = ref("");
const inventarioId = ref(null);
const selectedInventarioId = ref("");

const rows = ref([]);
const columns = ref([
  {
    name: "idSemilla",
    label: "Semilla",
    align: "center",
    field: "nombreSemilla",
  },
  {
    name: "idInsumo",
    label: "Insumo",
    align: "center",
    field: "nombreInsumo",
  },
  {
    name: "idMaquina_herramienta",
    label: "Máquina/Herramienta",
    align: "center",
    field: "nombreMaquina",
  },
  { name: "tipo", label: "Tipo", align: "center", field: "tipo" },
  {
    name: "observacion",
    label: "Observación",
    align: "center",
    field: "observacion",
  },
  { name: "unidad", label: "Unidad", align: "center", field: "unidad" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const semillasOptions = ref([]);
const insumosOptions = ref([]);
const maquinasOptions = ref([]);
const inventarioOptions = ref([]);

const useInventario = useInventarioStore();
const useSemillas = useSemillasStore();
const useInsumos = useInsumosStore();
const useMaquinas = useMaquinariasStore();

async function listarInventario() {
  try {
    const r = await useInventario.getInventario();
    const semillas = await useSemillas.getSemillas();
    const insumos = await useInsumos.getInsumos();
    const maquina = await useMaquinas.getMaquinarias();
    rows.value = r.inventario.map((inventario) => {
      const semilla = semillas.semillas.find(
        (e) => e._id === inventario.idSemilla
      );
      const insumo = insumos.insumos.find((e) => e._id === inventario.idInsumo);
      const maquinas = maquina.maquina.find(
        (e) => e._id === inventario.idMaquina_herramienta
      );
      return {
        ...inventario,
        nombreSemilla: semilla ? semilla.especie : "NN",
        nombreInsumo: insumo ? insumo.nombre : "NN",
        nombreMaquina: maquinas ? maquinas.nombre : "NN",
      };
    });
    inventarioOptions.value = r.inventario.map((inventario) => ({
      label: inventario.tipo,
      value: inventario._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarInventarioActivos() {
  const r = await useInventario.getInventarioActivas();
  const semillas = await useSemillas.getSemillas();
  const insumos = await useInsumos.getInsumos();
  const maquina = await useMaquinas.getMaquinarias();
  rows.value = r.activados.map((inventario) => {
    const semilla = semillas.semillas.find(
      (e) => e._id === inventario.idSemilla
    );
    const insumo = insumos.insumos.find((e) => e._id === inventario.idInsumo);
    const maquinas = maquina.maquina.find(
      (e) => e._id === inventario.idMaquina_herramienta
    );
    return {
      ...inventario,
      nombreSemilla: semilla ? semilla.especie : "NN",
      nombreInsumo: insumo ? insumo.nombre : "NN",
      nombreMaquina: maquinas ? maquinas.nombre : "NN",
    };
  });
}

async function listarInventarioInactivos() {
  const r = await useInventario.getInventarioInactivas();
  const semillas = await useSemillas.getSemillas();
  const insumos = await useInsumos.getInsumos();
  const maquina = await useMaquinas.getMaquinarias();
  rows.value = r.desactivados.map((inventario) => {
    const semilla = semillas.semillas.find(
      (e) => e._id === inventario.idSemilla
    );
    const insumo = insumos.insumos.find((e) => e._id === inventario.idInsumo);
    const maquinas = maquina.maquina.find(
      (e) => e._id === inventario.idMaquina_herramienta
    );
    return {
      ...inventario,
      nombreSemilla: semilla ? semilla.especie : "NN",
      nombreInsumo: insumo ? insumo.nombre : "NN",
      nombreMaquina: maquinas ? maquinas.nombre : "NN",
    };
  });
}

// async function obtenerInventarioPorID(id) {
//   if (id) {
//     const r = await useInventario.getInventarioById(id);
//     rows.value = [
//       {
//         ...r,
//         nombreSemilla:
//           semillasOptions.value.find((s) => s.value === r.idSemilla)?.label ??
//           "",
//         nombreInsumo:
//           insumosOptions.value.find((i) => i.value === r.idInsumo)?.label ?? "",
//         nombreMaquina:
//           maquinasOptions.value.find((m) => m.value === r.idMaquina_herramienta)
//             ?.label ?? "",
//       },
//     ];
//   }
// }

async function agregarOEditarInventario() {
  try {
    const data = {
      idSemilla: idSemilla.value,
      idInsumo: idInsumo.value,
      idMaquina_herramienta: idMaquina_herramienta.value,
      tipo: tipo.value,
      cantidad: cantidad.value,
      unidad: unidad.value,
      observacion: observacion.value,
    };

    let result;

    if (inventarioId.value) {
      result = await useInventario.putInventario(
        inventarioId.value,
        data
      );
      console.log(data)
    } else {
      result = await useInventario.postInventario(data);
      console.log(data)
    }

    if (result.success) {
      showForm.value = false;
      Onreset();
      listarInventario();
    }
  } catch (error) {
    console.error(error);
  }
}

function editarInventario(inventario) {
  idSemilla.value = inventario.idSemilla;
  idInsumo.value = inventario.idInsumo;
  idMaquina_herramienta.value = inventario.idMaquina_herramienta;
  tipo.value = inventario.tipo;
  cantidad.value = inventario.cantidad;
  unidad.value = inventario.unidad;
  observacion.value = inventario.observacion;
  showForm.value = true;
  inventarioId.value = inventario._id;
}

function cancelarAgregarInventario() {
  inventarioId.value = null;
  showForm.value = false;
  idSemilla.value = "";
  idInsumo.value = "";
  idMaquina_herramienta.value = "";
  tipo.value = "";
  cantidad.value = 0;
  unidad.value = 0;
  observacion.value = "";
}

function Onreset() {
  inventarioId.value = null;
  idSemilla.value = "";
  idInsumo.value = "";
  idMaquina_herramienta.value = "";
  tipo.value = "";
  cantidad.value = 0;
  unidad.value = 0;
  observacion.value = "";
}

async function activarInventario(inventario) {
  try {
    await useInventario.toggleEstadoInventario(inventario._id, true);
    listarInventario();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarInventario(inventario) {
  try {
    await useInventario.toggleEstadoInventario(inventario._id, false);
    listarInventario();
  } catch (error) {
    console.error(error);
  }
}

async function listarSemillas() {
  const r = await useSemillas.getSemillas();
  semillasOptions.value = r.semillas.map((s) => ({
    value: s._id,
    label: s.especie,
  }));
}

async function listarInsumos() {
  const r = await useInsumos.getInsumos();
  insumosOptions.value = r.insumos.map((i) => ({
    value: i._id,
    label: i.nombre,
  }));
}

async function listarMaquinasHerramientas() {
  const r = await useMaquinas.getMaquinarias();
  maquinasOptions.value = r.maquina.map((m) => ({
    value: m._id,
    label: m.nombre,
  }));
}

listarInventario();
listarSemillas();
listarInsumos();
listarMaquinasHerramientas();
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

