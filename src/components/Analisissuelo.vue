<template>
    <q-page>
      <div class="q-pa-md text-center">
        <div class="text-h2">Analisis de Suelos</div>
        <q-btn
          label="Agregar Analisis"
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
            <q-item clickable v-ripple @click="listarAnalisisSuelo">
              <q-item-section>Listar Todos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listarAnalisisSueloActivos">
              <q-item-section>Listar Activos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="listarAnalisisSueloInactivos">
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
            <template v-slot:body-cell-idParcela="props">
              <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ props.row.idParcela ? getParcelaNumero(props.row.idParcela) : 'Parcela no especificada' }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-cultivo="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ props.row.cultivo ? getCultivoNombre(props.row.cultivo) : 'Cultivo no especificado' }}</p>
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
                    @click="editarAnalisis(props.row)"
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
                    @click="activarAnalisis(props.row)"
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
                    @click="desactivarAnalisis(props.row)"
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
                  <div class="text-h6">No hay Analisis disponibles</div>
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
              <q-form @submit.prevent="agregarOEditarAnalisis">
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
                    Analisis
                  </h1>
                </div>

                        <q-select
          v-model="idParcela"
          label="Seleccionar Parcela"
          :options="ParcelasActivas"
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
        
                <q-input v-model.trim="muestra" label="Muestra" required />
                <q-select
                v-model="idCultivo"
                label="Seleccionar Cultivo"
                :options="CultivosActivos"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                style="margin-left: 16px; max-width: 200px"
              />
                <q-input v-model.trim="laboratorio" label="Laboratorio" required />
                <q-input v-model.trim="resultados" label="Resultados" required />
                <q-input v-model.trim="recomendaciones" label="Recomendaciones" required />

  
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
        <div v-if="useAnalisisSuelo.loading" class="overlay">
          <q-spinner size="xl" color="primary" />
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { useAnalisisSueloStore } from "../stores/analisissuelo.js";
  import { useEmpleadosStore } from "../stores/empleados.js";
  import { useParcelaStore } from "../stores/parcelas.js";
  import { useCultivosStore } from "../stores/cultivos.js";





  const drawer = ref(false);
  const showForm = ref(false);

//   const nombre = ref("");
//   const email = ref("");
//   const direccion = ref("");
//   const telefono = ref("");

const idParcela = ref("");
const idEmpleado = ref("");
const idCultivo = ref("");
const muestra = ref("");
const laboratorio = ref("");
const resultados = ref("");
const recomendaciones = ref("")


  const selectedProveedorId = ref("");
  const analisisId = ref(false); 
  
  const showPassword = ref(false);
  
  const rows = ref([]);
  const columns = ref([
    {
      name: "idParcela",
      label: "Numero Parcela",
      align: "center",
      field: "idParcela",
    },
    {
      name: "idEmpleado",
      label: "Empleado",
      align: "center",
      field: "idEmpleado"
    },
    { name: "muestra", label: "Muestra", align: "center", field: "muestra" },
    { name: "cultivo", label: "Cultivo", align: "center", field: "cultivo" },
    { name: "laboratorio", label: "Laboratorio", align: "center", field: "laboratorio" },
    { name: "resultados", label: "Resultados", align: "center", field: "resultados" },
    { name: "recomendaciones", label: "Recomendaciones", align: "center", field: "recomendaciones" },
    { name: "estado", label: "Estado", align: "center", field: "estado" },
    { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
  ]);
  

const AnalisisOptions = ref([]);
const ParcelasOptions = ref([]);
const ParcelasActivas = ref([]);
const EmpleadosOptions = ref([]);
const EmpleadosActivos = ref([]);
const CultivosOptions = ref([]);
const CultivosActivos = ref([]);


  

  const useAnalisisSuelo = useAnalisisSueloStore();
const useParcelas = useParcelaStore();
  const useEmpleados = useEmpleadosStore(); 
  const useCultivos= useCultivosStore();

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
  }
  

  async function listarAnalisisSuelo() {
    try {
      const r = await useAnalisisSuelo.getAnalisisSuelos();
      rows.value = r.analisis;
      console.log(r,"este es res analisiss");
    } catch (error) {
      console.error(error);
      rows.value = [];
      AnalisisOptions.value = [];
    }
  }


  function getParcelanumero(id) {
  console.log("Buscando parcela con id:", id);
  // console.log("fincaTodo:", fincaTodo.value);
  if (!id) return 'Finca no especificada';
  if (fincaTodo.value.length === 0) {
    console.warn("fincaTodo está vacío. Intentando cargar fincas...");
    listarFincas();
    return 'Cargando...';
  }
  const parcela = ParcelasOptions.value.find(parce => parce._id === id);
  console.log("Parcela encontrada:", parcela);
  return parcela ? `${parcela.label} - ${parcela.rut}` : 'Parcela no encontrada';
}


  async function listarParcelas() {
    try {
      const r = await useParcelas.getParcelas();
      console.log(r,"este es el res de parcelas")
      rows.value = r.parcela || [];
      ParcelasOptions.value = r.parcela.map((p) => ({
        value: p._id,
        label: p.numero,
      }));

   ParcelasActivas.value=r.parcela.filter(objeto => objeto.estado === 1).map((p) => ({
        value: p._id,
        label: p.numero,
      }));


    } catch (error) {
      console.error(error);
      rows.value = [];
      AnalisisOptions.value = [];
    }
  }

  function getParcelaNumero(id) {

  const parcela = ParcelasOptions.value.find((parcela) => parcela.value === id);
  return parcela ? `${parcela.label}` : "Parcela no encontrada";
}

  async function listarCultivos() {
    try {
      const r = await useCultivos.listarCultivo();

      rows.value = r.cultivos || [];
      CultivosOptions.value = r.cultivos.map((p) => ({
        value: p._id,
        label: p.nombre,
      }));

      CultivosActivos.value=r.cultivos.filter(objeto => objeto.estado === 1).map((p) => ({
        value: p._id,
        label: p.nombre,
      }));


    } catch (error) {
      console.error(error);
      rows.value = [];
      AnalisisOptions.value = [];
    }
  }

  function getCultivoNombre(id) {
  const cultivo = CultivosOptions.value.find((cultivo) => cultivo.value === id);
  return cultivo ? `${cultivo.label}` : "cultivo no encontrado";
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

      EmpleadosActivos.value=r.empleados.filter(objeto => objeto.estado === 1).map((p) => ({
        value: p._id,
        label: `${p.nombre} - ${p.documento}`,
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
  
//   async function listarProveedoresActivos() {
//     try {
//       const r = await useProveedores.getProveedoresActivos();
//       rows.value = r.activados || [];
//     } catch (error) {
//       console.error(error);
//       rows.value = [];
//     }
//   }
async function listarAnalisisSueloActivos() {
    try {
      const r = await useAnalisisSuelo.getAnalisisSuelosActivos();
      rows.value = r.activados || [];
    } catch (error) {
      console.error(error);
      rows.value = [];
    }
  }
  
//   async function listarProveedoresInactivos() {
//     try {
//       const r = await useProveedores.getProveedoresInactivos();
//       rows.value = r.desactivados || [];
//     } catch (error) {
//       console.error(error);
//       rows.value = [];
//     }
//   }
async function listarAnalisisSueloInactivos() {
    try {
      const r = await useAnalisisSuelo.getAnalisisSuelosInactivos();
      rows.value = r.desactivados || [];
    } catch (error) {
      console.error(error);
      rows.value = [];
    }
  }
  
//   async function agregarOEditarProveedor() {
//     try {
//       const data = {
//         nombre: nombre.value,
//         direccion: direccion.value,
//         telefono: telefono.value,
//         email: email.value,
//       };
  
//       let result;
  
//       if (proveedorId.value) {
//         result = await useProveedores.putProveedor(proveedorId.value, data);
//       } else {
//         result = await useProveedores.postProveedor(data);
//       }
  
//       if (result.success) {
//         listarProveedores(); // Actualiza la lista de proveedores después de agregar o editar
//         showForm.value = false; // Cierra el formulario solo si la operación fue exitosa
//       } else {
//         console.error(result.error); // Agrega un mensaje de error si la operación falla
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

async function agregarOEditarAnalisis() {
    try {
      const data = {
        idParcela: idParcela.value,
        idEmpleado: idEmpleado.value,
        muestra: muestra.value,
        cultivo: idCultivo.value,
        laboratorio: laboratorio.value,
        resultados: resultados.value,
        recomendaciones: recomendaciones.value,
      };
  
      let result;
  
      if (analisisId.value) {
        result = await useAnalisisSuelo.putAnalisisSuelos(analisisId.value, data);
      } else {
        result = await useAnalisisSuelo.postAnalisisSuelos(data);
      }
  
      if (result.success) {
        listarAnalisisSuelo(); 
        showForm.value = false; 
        analisisId.value = false
      } else {
        console.error(result.error); 
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // function cancelarAgregarProveedor() {
  //   showForm.value = false;
  //   proveedorId.value = null;
  //   nombre.value = "";
  //   direccion.value = "";
  //   telefono.value = "";
  //   email.value = "";
  // }
   function cancelarAgregarProveedor() {
    showForm.value = false;
    idParcela.value = "";
    idEmpleado.value = "";
    muestra.value = "";
    idCultivo.value = "";
    laboratorio.value = "";
    resultados.value = "";
    recomendaciones.value = "";
  }

  
  // function editarProveedor(proveedor) {
  //   nombre.value = proveedor.nombre;
  //   direccion.value = proveedor.direccion;
  //   telefono.value = proveedor.telefono;
  //   email.value = proveedor.email;
  //   proveedorId.value = proveedor._id; 
  //   showForm.value = true;
  // }
  function editarAnalisis(analisis) {
    console.log(analisis._id,"analisiis en editar")
    idParcela.value = analisis.idParcela;
    idEmpleado.value = analisis.idEmpleado;
    muestra.value = analisis.muestra;
    idCultivo.value = analisis.cultivo;
    laboratorio.value = analisis.laboratorio;
    resultados.value = analisis.resultados;
    recomendaciones.value = analisis.recomendaciones;
    showForm.value = true;
    analisisId.value=analisis._id
  }
  
  // async function obtenerProveedorPorID(selectedProveedorId) {
  //   try {
  //     const proveedor = await useProveedores.getProveedorByID(
  //       selectedProveedorId
  //     );
  //     if (proveedor) {
  //       rows.value = [proveedor];
  //     } else {
  //       rows.value = [];
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
   async function obtenerAnalisisPorID(selectedAnalisisId) {
    try {
      const analisis = await useAnalisisSuelo.getAnalisisSuelosByID(
        selectedAnalisisId
      );
      if (analisis) {
        rows.value = [analisis];
      } else {
        rows.value = [];
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // async function activarProveedor(proveedor) {
  //   try {
  //     await useProveedores.toggleEstadoProveedor(proveedor._id, true);
  //     listarProveedores();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  async function activarAnalisis(analisis) {
    try {
      await  useAnalisisSuelo.toggleEstadoAnalisisSuelos(analisis._id, true);
      listarAnalisisSuelo();
    } catch (error) {
      console.error(error);
    }
  }
  
  // async function desactivarProveedor(proveedor) {
  //   try {
  //     await useProveedores.toggleEstadoProveedor(proveedor._id, false);
  //     listarProveedores();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function desactivarAnalisis(analisis) {
    try {
      await useAnalisisSuelo.toggleEstadoAnalisisSuelos(analisis._id, false);
      listarAnalisisSuelo();
    } catch (error) {
      console.error(error);
    }
  }
  
  
 

  (async () => {
  try {
    await listarEmpleados()
    await listarParcelas()
    await listarCultivos()
    await listarAnalisisSuelo(); 
   
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
  