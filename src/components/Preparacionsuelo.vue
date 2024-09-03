<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Preparación de suelo</div>
      <q-btn
        label="Agregar Preparación de suelo"
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
          <q-item clickable v-ripple @click="listarPreparacion">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarPreparacionActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarPreparacionInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedPreparaciónId"
        label="Seleccionar Preparación de suelo"
        :options="preparacionOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerPreparacionPorID"
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
          <template v-slot:body-cell-idParcela="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.Parcelanumero }}</p>
  </q-td>
</template>
<template v-slot:body-cell-idEmpleado="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.empleadonombre }}</p>
  </q-td>
</template>
<template v-slot:body-cell-fecha="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fecha) }}</p>
  </q-td>
</template>
   <template v-slot:body-cell-productos="props">
            <q-td :props="props" style="text-align: center;">
              <q-btn class="segui" @click="openProductosModal(props.row)" icon="inventory">
                <q-tooltip>Ver Productos</q-tooltip>
              </q-btn>
            </q-td>
          </template>
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarPreparacion(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar preparacion
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarPreparacion(props.row)"
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
                  @click="desactivarPreparacion(props.row)"
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
                <div class="text-h6">No hay Preparación disponible</div>
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
            <q-form @submit.prevent="agregarOEditarPreparacion">
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
                  Preparación de suelo
                </h1>
              </div>
          <q-select standout v-model="idParcela" :options="organizarParcelas" option-value="valor" option-label="label" label="Parcela" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idEmpleado" :options="organizarEmpleados" option-value="valor" option-label="label" label="Empleado" style="background-color: #grey; margin-bottom: 20px" />

              <q-input
                v-model.trim="operario"
                label="Operario"
                required
              />
              <q-input v-model.trim="responsable" label="Responsable" required />
              <q-input v-model.trim="observaciones" label="Observaciones" required />
 <div>
                <h3 style="font-size: 30px; margin: 0; margin-left: 15px">
                  Productos
                </h3>
                            <q-input v-model="productos[0].ingredienteActivo" label="ingredientes Activo" required />
              <q-input v-model="productos[0].dosis" label="Dosis" required />
              <q-input v-model="productos[0].metodoAplicacion" label="Método de Aplicación" required />

 </div>
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarPreparacion"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="usePreparacion.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
                <q-dialog v-model="productosModalOpen" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Productos</div>
            </q-card-section>

            <q-card-section>
              <q-table
                :rows="selectedPreparacion?.productos || []"
                :columns="producolumns"
                row-key="ingredienteActivo"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="primary" @click="productosModalOpen = false" />
            </q-card-actions>
          </q-card>
        </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { usePreparacionStore } from "../stores/preparacion_suelo.js";
import { useParcelaStore } from "../stores/parcelas.js";
const useParcela = useParcelaStore();

import { useEmpleadosStore } from "../stores/empleados.js";
const useEmpleado = useEmpleadosStore();

const drawer = ref(false);
const showForm = ref(false);
const operario = ref("");
const responsable = ref("");
const productos = ref([{ ingredienteActivo: '', dosis: '', metodoAplicacion: ''}]);
const observaciones = ref("");
const idParcela = ref("");
const idEmpleado = ref("");
const selectedPreparaciónId = ref("");
const preparacionId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idParcela", label: "Parcela", align: "center",     field: row => getParcelanumero(row.idParcela) },
  { name: "idEmpleado", label: "Empleado", align: "center",     field: row => getEmpleadonombre(row.idEmpleado) },


  {
    name: "operario",
    label: "Operario",
    align: "center",
    field: "operario",
  },
    { name: "productos", label: "Productos", align: "center", field: "productos" },
  { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
  { name: "responsable", label: "Responsable", align: "center", field: "responsable" },
  { name: "observaciones", label: "Observaciones", align: "center", field: "observaciones" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const preparacionOptions = ref([]);

const usePreparacion = usePreparacionStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let parcelaTodo = ref([]);

onMounted(async () => {
  await listarParcelas();
  await listarEmpleados();
  await listarPreparacion();

});

async function listarParcelas() {
  try {
    const res = await useParcela.getParcelasActivos();
    console.log("Respuesta de getParcelasActivos:", res);
    if (res && Array.isArray(res.activados)) {
      parcelaTodo.value = res.activados;
      console.log("Parcelas cargadas:", JSON.stringify(parcelaTodo.value, null, 2));
    } else {
      console.error("Respuesta inesperada al listar parcelas:", res);
      parcelaTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar parcelas:", error);
    parcelaTodo.value = [];
  }
}

const organizarParcelas = computed(() => {
  console.log("Calculando organizarParcelas", parcelaTodo.value);
  return parcelaTodo.value.map((element) => ({
    label: `${element.numero}-${element.detalle}`,
    value: element._id,
    nombre: element.nombre,
  }));
});


let empleadoTodo = ref([]);


async function listarEmpleados() {
  try {
    const res = await useEmpleado.getEmpleadosActivos();
    console.log("Respuesta de getEmpleadosActivos:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      empleadoTodo.value = res.activados;
      console.log("empleados cargados:", empleadoTodo.value);
    } else {
      console.error("Respuesta inesperada al listar empleados:", res);
      empleadoTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar empleados:", error);
    empleadoTodo.value = [];
  }
}

const organizarEmpleados = computed(() => {
  console.log("Calculando organizarEmpleados", empleadoTodo.value);
  return empleadoTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.documento}`,
    value: element._id,
    nombre: element.nombre,
  }));
});

function guardarPreparacionReciente(id) {
  localStorage.setItem('PreparacionReciente', id);
}

function obtenerPreparacionReciente() {
  return localStorage.getItem('PreparacionReciente');
}

async function listarPreparacion() {
  try {
    const res = await usePreparacion.getPreparacion();
    console.log("Respuesta de getPreparacion:", res);
    if (res && Array.isArray(res.preparacion)) {
      const PreparacionRecienteId = obtenerPreparacionReciente();
      rows.value = res.preparacion.map(preparacion => {
        const Parcelanumero = getParcelanumero(preparacion.idParcela);
        const empleadonombre = getEmpleadonombre(preparacion.idEmpleado);
        return {
          ...preparacion,
         Parcelanumero: Parcelanumero,
          empleadonombre: empleadonombre
        };
      }).sort((a, b) => {
        if (a._id === PreparacionRecienteId) return -1;
        if (b._id === PreparacionRecienteId) return 1;
        return 0;
      });
      console.log("Filas de control:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar preparacion:", error);
  }
}

function getParcelanumero(id) {
  if (!id) return 'Parcela no especificada';
  const parcela = parcelaTodo.value.find(parcela => parcela._id === id);
  return parcela ? `${parcela.numero}-${parcela.detalle}` : 'Parcela no encontrada';
}


function getEmpleadonombre(id) {
  if (!id) return 'Empleado no especificado';
  const empleado = empleadoTodo.value.find(empleado => empleado._id === id);
  return empleado ? `${empleado.nombre}-${empleado.documento}` : 'empleado no encontrado';
}

// async function listarPreparacionActivos() {
//   try {
//     const r = await usePreparacion.getPreparacionActivos();
//     rows.value = r.activados || [];
//   } catch (error) {
//     console.error(error);
//     rows.value = [];
//   }
// }

async function listarPreparacionActivos() {
  try {
    const r = await usePreparacion.getPreparacionActivos();
    
    if (r && Array.isArray(r.activados)) {
      const PreparacionRecienteId = obtenerPreparacionReciente();
      
      rows.value = r.activados
        .map(preparacion => {
          const Parcelanumero = getParcelanumero(preparacion.idParcela);
          const empleadonombre = getEmpleadonombre(preparacion.idEmpleado);
          return {
            ...preparacion,
            Parcelanumero,
            empleadonombre
          };
        })
        .sort((a, b) => {
          if (a._id === PreparacionRecienteId) return -1;
          if (b._id === PreparacionRecienteId) return 1;
          return 0;
        });
      
      console.log("Filas de control:", rows.value);
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}


async function listarPreparacionInactivos() {
  try {
    const r = await usePreparacion.getPreparacionInactivos();
    
    if (r && Array.isArray(r.desactivados)) {
      const PreparacionRecienteId = obtenerPreparacionReciente();
      
      rows.value = r.desactivados
        .map(preparacion => {
          const Parcelanumero = getParcelanumero(preparacion.idParcela);
          const empleadonombre = getEmpleadonombre(preparacion.idEmpleado);
          return {
            ...preparacion,
            Parcelanumero,
            empleadonombre
          };
        })
        .sort((a, b) => {
          if (a._id === PreparacionRecienteId) return -1;
          if (b._id === PreparacionRecienteId) return 1;
          return 0;
        });
      
      console.log("Filas de control:", rows.value);
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}
// async function listarPreparacionInactivos() {
//   try {
//     const r = await usePreparacion.getPreparacionInactivos();
//     rows.value = r.desactivados || [];
//   } catch (error) {
//     console.error(error);
//     rows.value = [];
//   }
// }

async function agregarOEditarPreparacion() {
  try {
    let idParcelaValue;
    if (typeof idParcela.value === 'object' && idParcela.value !== null) {
      idParcelaValue = idParcela.value.value || idParcela.value.valor;
    } else {
      idParcelaValue = idParcela.value;
    }
let idEmpleadoValue;
    if (typeof idEmpleado.value === 'object' && idEmpleado.value !== null) {
      idEmpleadoValue = idEmpleado.value.value || idEmpleado.value.valor;
    } else {
      idEmpleadoValue = idEmpleado.value;
    }
    const data = {
              productos: productos.value,
      idParcela: idParcelaValue,
      idEmpleado: idEmpleadoValue,
      operario: operario.value,
      responsable: responsable.value,
      observaciones: observaciones.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (preparacionId.value) {
      result = await usePreparacion.putPrepacion(preparacionId.value, data);
    } else {
      result = await usePreparacion.postPreparacion(data);
    }

    if (result.success) {
      await listarPreparacion();
      showForm.value = false;
      // Limpiar los campos después de guardar
      cancelarAgregarPreparacion();
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error al agregar/editar producción:", error);
  }
}


function cancelarAgregarPreparacion() {
  showForm.value = false;
  preparacionId.value = null;
    productos.value = "";
  operario.value = "";
  idParcela.value = "";
  idEmpleado.value = "";
  responsable.value = "";
  observaciones.value = "";

}

function editarPreparacion(preparacion) {
  operario.value = preparacion.operario;
const selectedParcela = parcelaTodo.value.find(parcela => parcela._id === preparacion.idParcela);
  
  if (selectedParcela) {
    idParcela.value = {
      label: `${selectedParcela.numero} - ${selectedParcela.detalle}`,
      value: selectedParcela._id,
      nombre: selectedParcela.nombre
    };
    console.log("Parcela seleccionada para editar:", idParcela.value); // Para depuración
  }
  
  const selectedEmpleado = empleadoTodo.value.find(c => c._id === preparacion.idEmpleado);
  if (selectedEmpleado) {
    idEmpleado.value = {
      label: `${selectedEmpleado.nombre} - ${selectedEmpleado.documento}`,
      value: selectedEmpleado._id,  // Cambiado de 'valor' a 'value'
      nombre: selectedEmpleado.nombre
    };
  } else {
    console.error("No se encontró el cultivo correspondiente");
    idEmpleado.value = null;
  }
    productos.value = preparacion.productos;
  responsable.value = preparacion.responsable;
  observaciones.value = preparacion.observaciones;
  preparacionId.value = preparacion._id;
  showForm.value = true;

  console.log("Editando producción:", { ...preparacion, idParcela: idParcela.value,idEmpleado: idEmpleado.value  });
}


async function obtenerPreparacionPorID(selectedPreparaciónId) {
  try {
    const preparacion = await usePreparacion.getPreparacionsporId(selectedPreparaciónId);
    if (preparacion) {
      rows.value = [preparacion];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarPreparacion(preparacion) {
  try {
    await usePreparacion.toggleEstadoPreparacion(preparacion._id, true);
    listarPreparacion();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarPreparacion(preparacion) {
  try {
    await usePreparacion.toggleEstadoPreparacion(preparacion._id, false);
    listarPreparacion();
  } catch (error) {
    console.error(error);
  }
}

listarPreparacion(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarPreparacion();
  }
});

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};



const productosModalOpen = ref(false);
const selectedPreparacion = ref(null);

const openProductosModal = (preparacion) => {
  console.log("Abriendo modal de productos para:", preparacion);
  selectedPreparacion.value = preparacion;
  productosModalOpen.value = true;
  console.log("productosModalOpen:", productosModalOpen.value);
  console.log("Datos de productos:", selectedPreparacion.value.productos);
};

const producolumns = ref([
  { name: "ingredienteActivo", label: "Ingredientes Activo", field: "ingredienteActivo", align: "center" },
  { name: "dosis", label: "Dosis", field: "dosis", align: "center" },
  { name: "metodoAplicacion", label: "Método de Aplicación", field: "metodoAplicacion", align: "center" },

]);

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
