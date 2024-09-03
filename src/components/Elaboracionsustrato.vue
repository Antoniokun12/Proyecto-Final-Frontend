<template>
    <q-page>
      <div class="q-pa-md text-center">
        <div class="text-h2">Elaboracion de sustratos</div>
        <q-btn
          label="Agregar Sustrato"
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
            <q-item clickable v-ripple @click="listarElaboracionSustrato">
              <q-item-section>Listar Todos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listarElaboracionSustratoActivos">
              <q-item-section>Listar Activos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listarAElaboracionsustratoInactivos">
              <q-item-section>Listar Inactivos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- <q-select
          v-model="selectedAnalisisId"
          label="Seleccionar Analisis"
          :options="proveedorOptions"
          emit-value
          map-options
          option-value="value"
          option-label="label"
          style="margin-left: 16px; max-width: 200px"
          @update:model-value="obtenerProveedorPorID"
        /> -->
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
            <template v-slot:body-cell-idProceso="props">
              <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ props.row.idProceso ? getTipoProceso(props.row.idProceso) : 'Proceso no especificada' }}</p>
        </q-td>
      </template>
    
<template v-slot:body-cell-idEmpleado="props">
  <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
<p>{{ props.row.idEmpleado ? getEmpleadoNombre(props.row.idEmpleado) : 'Empleado no especificado' }}</p>
</q-td>
</template>
              <template v-slot:body-cell-opciones="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    round
                    icon="edit"
                    @click="editarElaboracion(props.row)"
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
                    @click="activarElaboracion(props.row)"
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
                    @click="desactivarElaboracion(props.row)"
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
                  <div class="text-h6">No hay Sustratos disponibles</div>
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
              <q-form @submit.prevent="agregarOEditarElaboracion">
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
                    Sustrato
                  </h1>
                </div>

                        <q-select
          v-model="idProceso"
          label="Seleccionar Proceso"
          :options="ProcesosActivos"
          emit-value
          map-options
          option-value="value"
          option-label="label"
          style="margin-left: 16px; max-width: 200px"
        />
        <q-select 
          v-model="idEmpleado"
          label="Seleccionar Empleado"
          :options="EmpleadosActivos"
          emit-value
          map-options
          option-value="value"
          option-label="label" 
          style="margin-left: 16px; max-width: 200px"
        />
        
                <q-input v-model.trim="productoComercial" label="Producto Comercial" required />
                <q-input v-model.trim="ingredienteActivo" label="Ingrediente Activo" required />
                <q-input v-model.trim="dosisUtilizada" label="Dosis Utilizada" required />
                <q-input v-model.trim="metodoAplicacion" label="Metodo Aplicacion" required />
                <q-input v-model.trim="observaciones" label="observaciones" required />

  
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
        <div v-if="useElaboracion.loading" class="overlay">
          <q-spinner size="xl" color="primary" />
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { useElaboracionSustratoStore} from "../stores/elaboracionSustrato.js";
  import { useEmpleadosStore } from "../stores/empleados.js";
  import { useProcesosStore } from "../stores/procesos.js";

  const drawer = ref(false);
  const showForm = ref(false);

const idProceso = ref("");
const idEmpleado = ref("");

const productoComercial = ref("");
const ingredienteActivo = ref("");
const dosisUtilizada = ref("");
const metodoAplicacion = ref("");
const observaciones = ref("");
const estado = ref("");



const elaboracionId = ref(false); 

  
  const showPassword = ref(false);
  
  const rows = ref([]);
  const columns = ref([
    {
      name: "idProceso",
      label: "Tipo Proceso",
      align: "center",
      field: "idProceso",
    },
    {
      name: "idEmpleado",
      label: "Empleado",
      align: "center",
      field: "idEmpleado"
    },
    { name: "fecha", label: "Fecha", align: "center", field: "fecha" },
    { name: "productoComercial", label: "Producto Comercial", align: "center", field: "productoComercial" },
    { name: "ingredienteActivo", label: "Ingrediente Activo", align: "center", field: "ingredienteActivo" },
    { name: "dosisUtilizada", label: "Dosis Utilizada", align: "center", field: "dosisUtilizada" },
    { name: "metodoAplicacion", label: "Metodo Aplicacion", align: "center", field: "metodoAplicacion" },
    { name: "observaciones", label: "Observaciones", align: "center", field: "observaciones" },
    { name: "estado", label: "Estado", align: "center", field: "estado" },
    { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
  ]);
  

const EmpleadosOptions = ref([]);
const EmpleadosActivos = ref([]);


const ProcesosOptions = ref([]);
const ProcesosActivos = ref([]);


  

  const useElaboracion = useElaboracionSustratoStore();
  const useEmpleados = useEmpleadosStore(); 
  const useProcesos= useProcesosStore();

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }
  

async function listarElaboracionSustrato() {
    try {
      const r = await useElaboracion.getElaboracionSustrato();
      console.log(r,"este elaboracionnnnn")
      rows.value = r.sustra;
      console.log(r,"este es res elaboracion");
    } catch (error) {
      console.error(error);
      rows.value = [];
    }
  }






async function listarProcesos() {
    try {
      const r = await useProcesos.getProceso();
      console.log(r,"este es el res de procesos")
      rows.value = r.proceso || [];
      ProcesosOptions.value = r.proceso.map((p) => ({
        value: p._id,
        label: p.tipo,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async function listarProcesosActivos() {
    try {
      const r = await useProcesos.getProcesoActivos();
      console.log(r,"este es el res de procesosactivados")
      rows.value = r.activados || [];
   ProcesosActivos.value=r.activados.map((p) => ({
        value: p._id,
        label: p.tipo,
      }));
    } catch (error) {
      console.error(error);
    }
  }



function getTipoProceso(id) {

const proceso = ProcesosOptions.value.find((proceso) => proceso.value === id);
return proceso ? `${proceso.label}` : "Proceso no encontrado";
}




  

  async function listarEmpleados() {
    try {
      const r = await useEmpleados.getEmpleados();
      rows.value = r.empleados || [];
      EmpleadosOptions.value = r.empleados.map((e) => ({
        value: e._id,
        label: e.nombre,
        doc: e.documento
      }));

    } catch (error) {
      console.error(error);
      rows.value = [];
      AnalisisOptions.value = [];
    }
  }

  function getEmpleadoNombre(id) {
  const empleado = EmpleadosOptions.value.find((empleado) => empleado.value === id);
  return empleado ? `${empleado.doc} - ${empleado.label}` : "Documento no encontrado";
}
  

async function listarEmpleadosActivos() {
    try {
      const r = await useEmpleados.getEmpleadosActivos();
      EmpleadosActivos.value = r.activados.map((e) => ({
        value: e._id,
        label: `${e.nombre} - ${e.documento}`,
      }));

    } catch (error) {
      console.error(error);
      rows.value = [];
      AnalisisOptions.value = [];
    }
  }



async function listarElaboracionSustratoActivos() {
    try {
      const r = await useElaboracion.getElaboracionSustratoActivos();
      rows.value = r.activados || [];
    } catch (error) {
      console.error(error);
      rows.value = [];
    }
  }



async function listarAElaboracionsustratoInactivos() {
    try {
      const r = await useElaboracion.getElaboracionSustratoInactivos();
      rows.value = r.desactivados || [];
    } catch (error) {
      console.error(error);
      rows.value = [];
    }
  }
  


async function agregarOEditarElaboracion() {
    try {
      const data = {
        idProceso: idProceso.value,
        idEmpleado: idEmpleado.value,
        productoComercial: productoComercial.value,
        ingredienteActivo: ingredienteActivo.value,
        dosisUtilizada: dosisUtilizada.value,
        metodoAplicacion: metodoAplicacion.value,
        observaciones:observaciones.value
      };
  
      let result;
  
      if (elaboracionId.value) {
        result = await useElaboracion.putElaboracionSustrato(elaboracionId.value, data);
      } else {
        result = await useElaboracion.postElaboracionSustrato(data);
      }
  
      if (result.success) {
        listarElaboracionSustrato(); 
        showForm.value = false; 
        elaboracionId.value = false
      } else {
        console.error(result.error); 
      }
    } catch (error) {
      console.error(error);
    }
  }

  

   function cancelarAgregarProveedor() {
    showForm.value = false;
    idProceso.value="";
    idEmpleado.value="";
    productoComercial.value="";
    ingredienteActivo.value="";
    dosisUtilizada.value="";
    metodoAplicacion.value="";
    observaciones.value="";
  }

  


function editarElaboracion(elaboracion) {
    console.log(elaboracion._id,"elaboracion en llenar para editar")
    idProceso.value = elaboracion.idProceso;
    idEmpleado.value = elaboracion.idEmpleado;
    productoComercial.value = elaboracion.productoComercial;
    ingredienteActivo.value = elaboracion.ingredienteActivo;
    dosisUtilizada.value = elaboracion.dosisUtilizada;
    metodoAplicacion.value = elaboracion.metodoAplicacion;
    observaciones.value = elaboracion.observaciones;
    showForm.value = true;
    elaboracionId.value=elaboracion._id
  }
  



async function activarElaboracion(elaboracion) {
    try {
      await  useElaboracion.toggleEstadoElaboracionSustrato(elaboracion._id, true);
      listarElaboracionSustrato();
    } catch (error) {
      console.error(error);
    }
  }



  async function desactivarElaboracion(elaboracion) {
    try {
      await useElaboracion.toggleEstadoElaboracionSustrato(elaboracion._id, false);
      listarElaboracionSustrato();
    } catch (error) {
      console.error(error);
    }
  }
  
  
 

  (async () => {
  try {
    await listarEmpleados()
    await listarEmpleadosActivos()
    await listarProcesos()
    await listarProcesosActivos()
    await listarElaboracionSustrato()

  } catch (error) {
    console.error('selecione listar todos si no aparece los datos en la tabla');
  }
})();
  
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
  