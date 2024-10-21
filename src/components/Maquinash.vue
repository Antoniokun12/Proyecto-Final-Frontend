<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Maquinaria</div>
      <q-btn
        label="Agregar Maquina"
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
          <q-item clickable v-ripple @click="listarMaquina">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMaquinaActivos">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMaquinaInactivos">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedMaquinaId"
        label="Seleccionar Maquina"
        :options="maquinaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerMaquinaPorID"
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
<template v-slot:body-cell-idProveedor="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.proveedornombre }}</p>
  </q-td>
</template>

<template v-slot:body-cell-idEmpleado="props">
  <q-td :props="props" style="text-align: center;">
    <p>{{ props.row.empleadonombre }}</p>
  </q-td>
</template>
<template v-slot:body-cell-FechaCompra="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.FechaCompra) }}</p>
  </q-td>
</template>
<template v-slot:body-cell-mantenimiento="props">
  <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <q-btn class="segui" @click="openSeguimientoModal(props.row)" icon="show_chart">
      <q-tooltip>Mirar mantenimiento</q-tooltip>
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
                  @click="editarMaquina(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Maquina
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="toggle_on"
                  @click="activarMaquina(props.row)"
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
                  @click="desactivarMaquina(props.row)"
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
                <div class="text-h6">No hay Maquina disponible</div>
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
            <q-form @submit.prevent="agregarOEditarMaquina">
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
                  Maquina
                </h1>
              </div>
          <q-select standout v-model="idProveedor" :options="organizarProveedor" option-value="valor" option-label="label" label="Proveedor" style="background-color: #grey; margin-bottom: 20px" />
          <!-- <q-select standout v-model="idEmpleado" :options="organizarEmpleados" option-value="valor" option-label="label" label="Empleados" style="background-color: #grey; margin-bottom: 20px" /> -->

              <q-input
                v-model.trim="nombre"
                label="Nombre maquina"
                required
              />
              <q-input v-model.trim="tipo" label="Tipo" required />
              <q-input v-model.number="observaciones" label="Observaciones"required />
              <q-input v-model.number="cantidad" type="number" label="cantidad" required />
              <q-input v-model.trim="total" type="number" label="Total" required />

              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarMaquina"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="useMaquina.loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>

<q-dialog v-model="seguimientoModalOpen" persistent>
  <q-card>
    <q-card-section>
      <div class="nombreyfoto">
        <div class="text-h6">{{ selectedMaquina?.nombre }}</div>
        <q-btn @click="toggleSegui" label="Agregar nuevo Mantenimiento" class="button" />
      </div>
      <q-table
        flat
        bordered
        :rows="selectedMaquina?.mantenimiento || []"
        :columns="mantenimientoColumns"
        row-key="fechamantenimiento"
      >
        <template v-slot:body-cell-fechamantenimiento="props">
          <q-td :props="props">
            <p>{{ props.row.fechamantenimiento ? formatDate(props.row.fechamantenimiento) : 'N/A' }}</p>
          </q-td>
        </template>
        <template v-slot:body-cell-edita="props">
          <q-td :props="props">
            <q-btn
              icon="edit"
              color="primary"
              @click="editarmantenimiento(props.row)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="primary" @click="closeModal" />
    </q-card-actions>
  </q-card>
</q-dialog>
<q-dialog v-model="segui">
  <q-card class="segui-modal">
    <q-card-section>
      <div class="segui-modal-contenedor">
        <div class="formulariosegui">
                  <div v-for="(mantenimiento, index) in mantenimientos" :key="index" >
          <h4 class="titulosegui">{{ botoneditar ? 'Editar Mantenimiento' : 'Agregar Mantenimiento' }}</h4>
          <q-input v-model="mantenimiento.responsable" filled label="Responsable" dense />
          <q-input v-model="mantenimiento.observaciones" filled label="Observaciones" dense />
          <q-input
            v-model.number="mantenimiento.precio"
            filled
            type="number"
            label="Precio"
            dense
            :rules="[val => val > 0 || 'El precio debe ser mayor a 0']"
          />
        </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-if="botoneditar"
        label="Editar"
        @click="editamantenimiento"
:loading="useMaquina.loading"      />
      <q-btn
        v-else
        label="Agregar Mantenimiento"
        @click="actualizarMantenimiento"
:loading="useMaquina.loading"      />
      <q-btn label="Cerrar" @click="toggleSegui" />
    </q-card-actions>
  </q-card>
</q-dialog>
  
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useMaquinariasStore } from "../stores/maquinarias.js";
import { useProveedorStore } from "../stores/proveedores.js";
const useProveedor = useProveedorStore();

import { useEmpleadosStore } from "../stores/empleados.js";
const useEmpleado = useEmpleadosStore();
import { useQuasar } from 'quasar'
import { Notify } from 'quasar';



const $q = useQuasar();
const drawer = ref(false);
const showForm = ref(false);
const nombre = ref("");
const tipo = ref("");
const observaciones = ref("");
const total = ref("");
const cantidad = ref("");
const idProveedor = ref("");
const idEmpleado = ref("");
const selectedMaquinaId = ref("");
const maquinaId = ref(null); 

const showPassword = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idProveedor", label: "Proveedor", align: "center",     field: row => getproveedornombre(row.idProveedor) },
  // { name: "idEmpleado", label: "Empleado", align: "center",     field: row => getEmpleadonombre(row.idEmpleado) },

  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: "nombre",
  },

  { name: "tipo", label: "Tipo", align: "center", field: "tipo" },
  { name: "total", label: "Total", align: "center", field: "total" },
  { name: "FechaCompra", label: "Fecha Compra", align: "center", field: "FechaCompra" },
  { name: "observaciones", label: "observaciones", align: "center", field: "observaciones" },
  { name: "cantidad", label: "Cantidad", align: "center", field: "cantidad" },
  { name: "mantenimiento", label: "mantenimiento", field: "mantenimiento", align: "center" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const maquinaOptions = ref([]);

const useMaquina = useMaquinariasStore();

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

let ProveedorTodo = ref([]);
let empleadoTodo = ref([]);


onMounted(async () => {
  await Promise.all([listarProveedor(), listarEmpleados()]);
  await listarMaquina();
});

async function listarProveedor() {
  try {
    const res = await useProveedor.getProveedoresActivos();
    console.log("Respuesta de listaractivados:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      ProveedorTodo.value = res.activados;
      console.log("proveedores cargados:", ProveedorTodo.value);
    } else {
      console.error("Respuesta inesperada al listar proveedores:", res);
      ProveedorTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar proveedores:", error);
    ProveedorTodo.value = [];
  }
}

async function listarEmpleados() {
  try {
    const res = await useEmpleado.getEmpleadosActivos();
    console.log("Respuesta de getEmpleadosActivos:", res);
    if (res && res.activados && Array.isArray(res.activados)) {
      empleadoTodo.value = res.activados;
      console.log("Empleados cargados:", empleadoTodo.value);
    } else {
      console.error("Respuesta inesperada al listar empleados:", res);
      empleadoTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar empleados:", error);
    empleadoTodo.value = [];
  }
}

async function listarMaquina() {
  if (!isOnline()) {
    mostrarMensajeError("No hay conexión a internet. La lista de máquinas no pudo ser actualizada.");
    return;
  }

  try {
    const res = await useMaquina.getMaquinarias();
    console.log("Respuesta de getMaquinarias:", res);
    if (res && Array.isArray(res.maquina)) {
      rows.value = res.maquina.map(maquina => {
        const proveedornombre = getproveedornombre(maquina.idProveedor);
        const empleadonombre = getEmpleadonombre(maquina.idEmpleado);
        return {
          ...maquina,
          proveedornombre,
          empleadonombre
        };
      });
      console.log("Filas de maquinas procesadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
      mostrarMensajeError("Error al cargar la lista de máquinas. Formato de datos inesperado.");
    }
  } catch (error) {
    console.error("Error al listar maquinas:", error);
    mostrarMensajeError("Error al cargar la lista de máquinas. Por favor, intenta nuevamente.");
  }
}

function getproveedornombre(id) {
  if (!id) return 'Proveedor no especificado';
  const proveedor = ProveedorTodo.value.find(proveedor => proveedor._id === id);
  return proveedor ? `${proveedor.nombre} - ${proveedor.telefono}` : 'Proveedor no encontrado';
}

function getEmpleadonombre(id) {
  if (!id) return 'Empleado no especificado';
  const empleado = empleadoTodo.value.find(emp => emp._id === id);
  console.log(`Buscando empleado con id ${id}:`, empleado);
  return empleado ? `${empleado.nombre} - ${empleado.documento}` : 'Empleado no encontrado';
}

const organizarProveedor = computed(() => {
  return ProveedorTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.telefono}`,
    value: element._id,
    nombre: element.nombre,
  }));
});

const organizarEmpleados = computed(() => {
  return empleadoTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.documento}`,
    value: element._id,
    nombre: element.nombre,
  }));
});

async function listarMaquinaActivos() {
  try {
    const r = await useMaquina.getMaquinariasActivos();
    if (r && Array.isArray(r.activados)) {
      rows.value = r.activados.map(maquina => {
        const proveedornombre = getproveedornombre(maquina.idProveedor);
        const empleadonombre = getEmpleadonombre(maquina.idEmpleado);
        return {
          ...maquina,
          proveedornombre: proveedornombre,
          empleadonombre: empleadonombre
        };
      });
      console.log("Filas de maquina:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", r);
    }
  } catch (error) {
    console.error("Error al listar maquina:", error);
  }
}

async function listarMaquinaInactivos() {
  try {
    const r = await useMaquina.getMaquinariasInactivos();
    if (r && Array.isArray(r.desactivados)) {
      rows.value = r.desactivados.map(maquina => {
        const proveedornombre = getproveedornombre(maquina.idProveedor);
        const empleadonombre = getEmpleadonombre(maquina.idEmpleado);
        return {
          ...maquina,
          proveedornombre: proveedornombre,
          empleadonombre: empleadonombre
        };
      });
      console.log("Filas de maquina:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", r);
    }
  } catch (error) {
    console.error("Error al listar maquina:", error);
  }
}
async function agregarOEditarMaquina() {
  try {
    let idProveedorValue;
    if (typeof idProveedor.value === 'object' && idProveedor.value !== null) {
      idProveedorValue = idProveedor.value.value || idProveedor.value.valor;
    } else {
      idProveedorValue = idProveedor.value;
    }
let idEmpleadoValue;
    if (typeof idEmpleado.value === 'object' && idEmpleado.value !== null) {
      idEmpleadoValue = idEmpleado.value.value || idEmpleado.value.valor;
    } else {
      idEmpleadoValue = idEmpleado.value;
    }
    const data = {
      idProveedor: idProveedorValue,
      idEmpleado: idEmpleadoValue,
      nombre: nombre.value,
      cantidad: cantidad.value,
      observaciones: observaciones.value,
      tipo: tipo.value,
      total: total.value,
    };

    console.log("Datos a enviar:", data);

    let result;
    if (maquinaId.value) {
      result = await useMaquina.putMaquinarias(maquinaId.value, data);
    } else {
      result = await useMaquina.postMaquinarias(data);
    }

    if (result.success) {
      await listarMaquina();
      showForm.value = false;
      // Limpiar los campos después de guardar
      cancelarAgregarMaquina();
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error al agregar/editar producción:", error);
  }
}


function cancelarAgregarMaquina() {
  showForm.value = false;
  maquinaId.value = null;
  nombre.value = "";
  idProveedor.value = "";
  idEmpleado.value = "";
  cantidad.value = "";
  tipo.value = "";
  observaciones.value = "";
  total.value = "";

}

function editarMaquina(maquina) {
  nombre.value = maquina.nombre;
  const selectedProveedor = ProveedorTodo.value.find(c => c._id ===  maquina.idProveedor);
  if (selectedProveedor) {
    idProveedor.value = {
      label: `${selectedProveedor.nombre} - ${selectedProveedor.telefono}`,
      value: selectedProveedor._id,  // Cambiado de 'valor' a 'value'
      nombre: selectedProveedor.nombre
    };
  } else {
    console.error("No se encontró el cultivo correspondiente");
    idProveedor.value = null;
  }
  
  const selectedEmpleado = empleadoTodo.value.find(c => c._id === maquina.idEmpleado);
  if (selectedEmpleado) {
    idEmpleado.value = {
      label: `${selectedEmpleado.nombre} - ${selectedEmpleado.documento}`,
      value: selectedEmpleado._id,  // Cambiado de 'valor' a 'value'
      nombre: selectedEmpleado.nombre
    };
  } else {
    console.error("No se encontró el proveedor correspondiente");
    idEmpleado.value = null;
  }
  tipo.value = maquina.tipo;
  observaciones.value = maquina.observaciones;
  total.value = maquina.total;
  cantidad.value = maquina.cantidad;
  maquinaId.value = maquina._id;
  showForm.value = true;

  console.log("Editando maquina:", { ...maquina, idProveedor: idProveedor.value,idEmpleado: idEmpleado.value  });
}


async function obtenerMaquinaPorID(selectedMaquinaId) {
  try {
    const maquina = await useMaquina.getMaquinariasByID(selectedMaquinaId);
    if (maquina) {
      rows.value = [maquina];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}



async function activarMaquina(maquina) {
  try {
    await useMaquina.toggleEstadoMaquinarias(maquina._id, true);
    listarMaquina();
  } catch (error) {
    console.error(error);
  }
}

async function desactivarMaquina(maquina) {
  try {
    await useMaquina.toggleEstadoMaquinarias(maquina._id, false);
    listarMaquina();
  } catch (error) {
    console.error(error);
  }
}

listarMaquina(); 

const loading = ref(false);
watch(showForm, (newVal) => {
  if (!newVal) {
    cancelarAgregarMaquina();
  }
});

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};


let segui = ref(false);
const seguimientoModalOpen = ref(false);
const selectedMaquina = ref(null);
let infor = ref("");
let botoneditar = ref(false);
function isOnline() {
  return navigator.onLine;
}
    const isLoading = ref(false)

const toggleSegui = () => {
  segui.value = !segui.value;
  botoneditar.value=false
  mantenimientos.value=[{ responsable: '', observaciones: '', precio: '' }]
};
const cerrarformu = () => {
  segui.value = !segui.value;
};

const closeModal = () => {
  seguimientoModalOpen.value = false;
  segui.value=false;
  console.log(segui.value,"este es closemodal segui")
};

const openSeguimientoModal = (maquina) => {
  console.log("maquina seleccionada:", maquina);
  selectedMaquina.value = maquina;
  seguimientoModalOpen.value = true;
};

const mantenimientos = ref([{responsable: '', observaciones: '', precio: '' }]);

async function actualizarMantenimiento() {
  if (await validarseguii()) {
    const mantenimientoData = mantenimientos.value[0];
    console.log("Datos a enviar:", JSON.stringify(mantenimientoData, null, 2));
    
    if (!selectedMaquina.value || !selectedMaquina.value._id) {
      mostrarMensajeError("No se ha seleccionado una máquina.");
      return;
    }
    
    try {
      isLoading.value = true;
      let seguiz = await useMaquina.putAgregarMantenimiento(selectedMaquina.value._id, mantenimientoData);
      
      if (seguiz.success) {
        console.log("Respuesta del servidor:", JSON.stringify(seguiz.data, null, 2));
        
        // Verificar si el mantenimiento se agregó correctamente
        if (seguiz.data && seguiz.data.mantenimiento && seguiz.data.mantenimiento.length > 0 && seguiz.data.mantenimiento[seguiz.data.mantenimiento.length - 1] !== null) {
          mostrarMensajeExito("Mantenimiento agregado correctamente");
          await listarMaquina();
          closeModal();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          // mostrarMensajeError("El mantenimiento no se agregó correctamente. Por favor, verifica los datos e intenta nuevamente.");
          console.error("Respuesta inesperada del servidor:", seguiz);
        }
      } else {
        mostrarMensajeError(seguiz.error || "Error al agregar mantenimiento");
        console.error("Error en la respuesta del servidor:", seguiz);
      }
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
      mostrarMensajeError("Error al agregar mantenimiento. Por favor, intenta nuevamente.");
    } finally {
      isLoading.value = false;
    }
  }
}
async function validarseguii() {
  let verificado = true;
  for (let i = 0; i < mantenimientos.value.length; i++) {
    const mantenimiento = mantenimientos.value[i];
if (!mantenimiento.responsable) { 
  mostrarMensajeError(`El responsable del mantenimiento debe ser un nombre`);
  verificado = false;
}
if (!mantenimiento.observaciones) {
  mostrarMensajeError(`observaciones del mantenimiento`);
  verificado = false;
}

    if (isNaN(mantenimiento.precio) || mantenimiento.precio <= 0) {
      mostrarMensajeError(` precio debe ser un número válido`);
      verificado = false;
    }

  }

  if (verificado) {
    mostrarMensajeExito("El mantenimiento se envió correctamente");
  }

  return verificado;
}

const mantenimientoColumns = ref([
  { name: "edita", label: "Editar", field: "edita", align: "center" },
  { name: 'responsable', label: 'responsable', field: 'responsable', align: 'center' },
  { name: 'observaciones', label: 'observaciones', field: 'observaciones', align: 'center' },
  { name: 'precio', label: 'precio', field: 'precio', align: 'center' },
  { name: 'fechamantenimiento', label: 'fechamantenimiento', field: 'fechamantenimiento', align: 'center' },
]);
function editarmantenimiento(inf) {
  if (!inf) return;
  segui.value = true;
  infor.value = inf;
  botoneditar.value = true;
  mantenimientos.value = [{ ...inf }];
}

  async function editamantenimiento() {
      if (await validarseguii()) {
        const mantenimientoData = {
          responsable: mantenimientos.value[0].responsable,
          observaciones: mantenimientos.value[0].observaciones,
          precio: mantenimientos.value[0].precio,
        };

        try {
          isLoading.value = true;
          const response = await useMaquina.putEditarMantenimiento(
            selectedMaquina.value._id,
            infor.value._id,
            { mantenimiento: mantenimientoData }
          );
          
          if (response.success) {
            mostrarMensajeExito("Mantenimiento editado exitosamente");
            await listarMaquina();
            closeModal();
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            mostrarMensajeError(response.error || "No se pudo editar el mantenimiento");
          }
        } catch (error) {
          console.error("Error al actualizar el mantenimiento:", error);
          mostrarMensajeError("No se pudo editar el mantenimiento");
        } finally {
          isLoading.value = false;
        }
      }
    }

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
}


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
