<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Fertilizacion</div>
      <q-btn label="Agregar Fertilizacion" color="orange-14" @click="showForm = true" class="q-my-md" />
      <q-btn-dropdown color="orange-14" icon="visibility" label="Filtrar" style="margin-left: 16px">
        <q-list>
          <q-item clickable v-ripple @click="listarFertilizacion">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarFertilizacionActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarFertilizacionInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <q-table :rows="rows" :columns="columns" row-key="_id" flat bordered square
            no-data-label="No hay registros de Fertilizacion disponibles">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn flat dense round icon="edit" @click="editarFertilizacion(props.row)">
                  <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px">
                    Editar Fertilizacion
                  </q-tooltip>
                </q-btn>
                <q-btn flat dense round icon="toggle_on" @click="activarFerilizacion(props.row)"
                  v-if="props.row.estado === 0">
                  <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px">
                    Activar
                  </q-tooltip>
                </q-btn>
                <q-btn flat dense round icon="toggle_off" @click="desactivarFertilizacion(props.row)"
                  v-if="props.row.estado === 1">
                  <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                    style="width: 120px; height: 40px; font-size: 15px">
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
            <q-form @submit.prevent="agregarOEditarFertilizacion">
              <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    border: 2px solid #000000;
                    border-radius: 8px;
                  ">
                <q-avatar size="80px">
                  <img src="https://cdn-icons-png.flaticon.com/512/2331/2331943.png" />
                </q-avatar>
                <h1 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Fertilizacion
                </h1>
              </div>
              <q-select v-model="idCultivo" label="Cultivo" :options="cultivoOptions" emit-value map-options
                option-value="value" option-label="label" required />
              <q-select v-model="idEmpleado" label="IdEmpleado" :options="empleadoOptions" emit-value map-options
                option-value="value" option-label="label" required />
              <q-select v-model="idInventario" label="IdInventario" :options="inventarioOptions" emit-value map-options
                option-value="value" option-label="label" required />
              <q-input v-model.trim="estadoFenologico" label=" estadoFenologico" required />
              <q-input v-model.trim="tipo" label="  tipo" required />
              <q-input v-model.trim="nombreFertilizante" label="  nombreFertilizante" required />
              <q-input v-model.trim="cantidad" label="  cantidad" required />
              <div style="margin-top: 15px; display: flex; justify-content: center">
                <q-btn label="Cancelar" color="negative" @click="cancelarAgregarFertilizacion" class="q-mr-sm" />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useFertilizacion.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useFertilizacionStore } from "../stores/fertilizacion.js";
import { useCultivosStore } from "../stores/cultivos.js";
import { useEmpleadosStore } from "../stores/empleados.js";
import { useInventarioStore } from "../stores/inventario.js";
const showForm = ref(false);
const idCultivo = ref("");
const idEmpleado = ref("");
const idInventario = ref("");
const estadoFenologico = ref("");
const tipo = ref("");
const nombreFertilizante = ref("");
const cantidad = ref("");
const FertilizacionId = ref(null);

const rows = ref([]);
const columns = ref([
  {
    name: "idCultivo",
    label: "Cultivo",
    align: "center",
    field: "nombreCultivo",
  },
  {
    name: "idEmpleado",
    label: "Empleado",
    align: "center",
    field: "nombreEmpleado",
  },
  {
    name: "idInventario",
    label: "Inventario",
    align: "center",
    field: "nombreInventario",
  },
  {
    name: "estadoFenologico",
    label: "estadoFenologico",
    align: "center",
    field: "estadoFenologico",
  },
  {
    name: "tipo",
    label: "tipo",
    align: "center",
    field: "tipo",
  },
  {
    name: "nombreFertilizante",
    label: "nombreFertilizante",
    align: "center",
    field: "nombreFertilizante",
  },
  {
    name: "cantidad",
    label: "cantidad",
    align: "center",
    field: "cantidad",
  },

  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  { name: "opciones",
    label: "Opciones",
    align: "center",
    field: "opciones"
  },
]);

const fertilizacionOptions = ref([]);
const cultivoOptions = ref([]);
const empleadoOptions = ref([])
const inventarioOptions = ref([])

const useFertilizacion = useFertilizacionStore();
const useCultivos = useCultivosStore();
const useEmpleados = useEmpleadosStore();
const useInventario = useInventarioStore();









async function listarFertilizacion() {
  try {
    const r = await useFertilizacion.getFertilizacion();
    const cultivos = await useCultivos.listarCultivo();
    const empleados = await useEmpleados.getEmpleados(); // Obtener empleados aquí
    const inventarios = await useInventario.getInventario();
    console.log(inventarios);
    
    // Combina ambos datos en una sola función
    rows.value = r.fertilizacion.map((fertilizacion) => {

      const cultivo = cultivos.cultivos.find(
        (e) => e._id === fertilizacion.idCultivo
      );
      const empleado = empleados.empleados.find(
        (e) => e._id === fertilizacion.idEmpleado
      );

      const inventario = inventarios.inventario.find(
       (e) => e._id === fertilizacion.idInventario
      );

      return {
        ...fertilizacion,
        nombreCultivo: cultivo ? cultivo.nombre : "No disponible",
        nombreEmpleado: empleado ? empleado.nombre : "No disponible", // Agrega el empleado aquí
        nombreInventario: inventario ? inventario.tipo : "No disponible",
      };
    });
    
    cultivoOptions.value = cultivos.cultivos.map((cultivo) => ({
      label: cultivo.nombre,
      value: cultivo._id,
    }));

    empleadoOptions.value = empleados.empleados.map((empleado) => ({
      label: empleado.nombre,
      value: empleado._id,
    }));

    inventarioOptions.value = inventarios.inventario.map((inventario) => ({
      label: inventario.tipo,
      value: inventario._id,
    }));
    
  } catch (e) {
    console.error(e);
  }
}



// async function listarEmpleados() {
//     try {
//       const r = await useFertilizacion.getFertilizacion();
//       let empleados = await useEmpleados.getEmpleados();
//       console.log("*********************", empleados, "**************************");
//       rows.value = r.fertilizacion.map((fertilizacion) => {
//         const empleado = empleados.empleados.find(
//           (e) => e._id === fertilizacion.idEmpleado
//         );

//         return {
//           ...fertilizacion,
//           nombreEmpleado: empleado ? empleado.nombre : "No disponible",
//         };
//       });
//       empleadoOptions.value = empleados.empleado.map((empleado) => ({
//         label: empleado.nombre,
//         value: empleado._id,
//       }));
//     } catch (e) {
//       console.error(e);
//     }
// }


// async function listarInventario(params) {
//   try {
//     let r = await useFertilizacion.getFertilizacion();
//     let inventarios = await useInventario.getInventario();
//     console.log("*******************", inventarios, "**********************");

//     rows.value = r.fertilizacion.map((fertilizacion) => {
//       const inventario = inventario.inventario.find(
//         (e) => e._id === fertilizacion.idInventario
//       );

//       return {
//         ...fertilizacion,
//         nombreInventario: inventario ? inventario.tipo : "No disponible",
//       };
//     });

//   } catch (error) {
//     console.log(error);
    
//   }

// }


































async function listarFertilizacionActivos() {
  try {
    const r = await useFertilizacion.getFertilizacionActivos();
    rows.value = r.fertilizacion;
  } catch (e) {
    console.error(e);
  }
}













async function listarFertilizacionInactivos() {
  try {
    const r = await useFertilizacion.getFertilizacionInactivos();
    rows.value = r.fertilizacion;
  } catch (e) {
    console.error(e);
  }
}






async function obtenerFertilizacionPorID(id) {
  try {
    const r = await useFertilizacion.getFertilizacionByID(id);
    if (r.fertilizacion) {
      idCultivo.value = r.fertilizacion.idCultivo;
      idEmpleado.value = r.fertilizacion.idEmpleado;
      idInventario.value = r.fertilizacion.idInventario;
      estadoFenologico.value = r.fertilizacion.estadoFenologico;
      tipo.value = r.fertilizacion.tipo;
      nombreFertilizante.value = r.fertilizacion.nombreFertilizante;
      cantidad.value = r.fertilizacion.cantidad;
    }
  } catch (e) {
    console.error(e);
  }
}














function editarFertilizacion(fertilizacion) {
  showForm.value = true;
  idCultivo.value = fertilizacion.idCultivo;
  idEmpleado.value = fertilizacion.idEmpleado;
  idInventario.value = fertilizacion.idInventario;
  estadoFenologico.value = fertilizacion.estadoFenologico;
  tipo.value = fertilizacion.tipo;
  nombreFertilizante.value = fertilizacion.nombreFertilizante;
  cantidad.value = fertilizacion.cantidad;
  FertilizacionId.value = fertilizacion._id;
}




function cancelarAgregarFertilizacion() {
  showForm.value = false;
  estadoFenologico.value = "";
  idCultivo.value = "";
  idEmpleado.value = "";
  idInventario.value = "";
  tipo.value = "";
  nombreFertilizante.value = "";
  cantidad.value = "";
  FertilizacionId.value = null;
}

async function agregarOEditarFertilizacion() {
  try {
    const data = {
      idCultivo: idCultivo.value,
      idEmpleado: idEmpleado.value,
      idInventario: idInventario.value,
      estadoFenologico: estadoFenologico.value,
      tipo: tipo.value,
      nombreFertilizante: nombreFertilizante.value,
      cantidad : cantidad.value
    };

    let result;

    if (FertilizacionId.value) {
      result = await useFertilizacion.putFertilizacion(FertilizacionId.value, data);
    } else {
      result = await useFertilizacion.postFertilizacion(data);
    }

    if (result.success) {
      listarFertilizacion();
      cancelarAgregarFertilizacion();
      showForm.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}









async function activarFerilizacion(fertilizacion) {
  try {
    await useFertilizacion.toggleEstadoFertilizacion(fertilizacion._id , true);
    await listarFertilizacion();
  } catch (e) {
    console.error(e);
  }
}

async function desactivarFertilizacion(fertilizacion) {
  try {
    await useFertilizacion.toggleEstadoFertilizacion(fertilizacion._id , false);
    await listarFertilizacion();
  } catch (e) {
    console.error(e);
  }
}

watch(showForm, (val) => {
  if (!val) {
    cancelarAgregarFertilizacion();
  }
});


obtenerFertilizacionPorID();
listarFertilizacion();
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