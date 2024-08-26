<template>
    <q-page>
        <q-drawer v-model="drawer" side="left" bordered>
            <q-list>
                <q-expansion-item label="Gestión Maquinarias" icon="settings" expand-separator default-opened>
                    <q-item clickable v-ripple @click="listarMaquinarias">
                        <q-item-section>Maquinarias</q-item-section>
                    </q-item>
                    <!-- Otros items pueden ser añadidos aquí -->
                </q-expansion-item>
            </q-list>
        </q-drawer>

        <div class="q-pa-md text-center">
            <div class="text-h2">Maquinarias</div>
            <q-btn label="Agregar Maquinarias" color="orange-14" @click="showForm = true" class="q-my-md" />
            <q-btn-dropdown color="orange-14" icon="visibility" label="Filtrar" style="margin-left: 16px">
                <q-list>
                    <q-item clickable v-ripple @click="listarMaquinarias">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarMaquinariasActivos">
                        <q-item-section>Listar Activos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarMaquinariasInactivos">
                        <q-item-section>Listar Inactivos</q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <q-select  v-model="selectedMaquinariasId"
        label="Seleccionar maquinaria"
        :options="maquinariaOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerMaquinariasPorID" />
                
              
        </div>
        
        <div class="q-pa-md">
            <q-card>
                <q-card-section>
                    <q-table :rows="rows" :columns="columns" row-key="_id" flat bordered square no-data-label="">
                        <template v-slot:body-cell-opciones="props">
                            <q-td :props="props">
                            <q-btn flat dense round icon="edit" @click="editarMaquinarias(props.row)">
                                    <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                                        style="width: 120px; height: 40px; font-size: 15px">
                                        Editar Maquinarias
                                    </q-tooltip>
                                </q-btn>
                                <q-btn flat dense round icon="toggle_on" @click="activarMaquinarias(props.row)"
                                    v-if="props.row.estado == 0">
                                    <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                                        style="width: 120px; height: 40px; font-size: 15px">
                                        Activar
                                    </q-tooltip>
                                </q-btn>
                                <q-btn flat dense round icon="toggle_off" @click="desactivarMaquinarias(props.row)"
                                    v-if="props.row.estado == 1">
                                    <q-tooltip class="bg-indigo rounded-borders row flex-center" :offset="[10, 10]"
                                        style="width: 120px; height: 40px; font-size: 15px">
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
                                <q-icon name="sentiment_dissatisfied" size="lg" class="q-mr-sm" />
                                <div class="text-h6">No hay Maquinaria disponibles</div>
                            </div>
                        </template>
                    </q-table>
                </q-card-section>
            </q-card>
        </div>

        <div class="q-pa-md">
            <q-dialog v-model="showForm">
                <q-card>
                    <q-card-section>
                        <q-form @submit.prevent="agregarOEditarMaquinarias">
                            <h1 style="
                      font-size: 30px;
                      text-align: center;
                      margin: 0;
                      line-height: 50px;
                    ">
                                Maquinarias
                            </h1>
                            <q-input v-model.trim="nombre" label="Nombre " required />
                            <q-select :options="opciones" v-model.trim="idProveedor" label="IdProveedores" required
                                use-input hide-selected fill-input input-debounce="0" @filter="filterFn">
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            Sin resultados
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>

                            <q-input v-model.trim="tipo" label="Tipo" required />
                            <q-input v-model.trim="fechaCompra" label="FechaCompra" required />
                            <q-input v-model.trim="observaciones" label="Observaciones" required />
                            <q-input v-model.trim="cantidad" label="Cantidad" required />
                            <q-input v-model.trim="total" label="total" required />

                            <div style="margin-top: 15px">
                                <q-btn label="Cancelar" color="negative" @click="cancelarAgregarMaquinarias"
                                    class="q-mr-sm" />
                                <q-btn type="submit" label="Guardar" color="primary" />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-dialog>
            <div v-if="useMaquinarias.loading" class="overlay">
                <q-spinner size="xl" color="primary" />
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useMaquinariasStore } from "../stores/maquinarias.js";
import { useProveedorStore } from "../stores/proveedores.js"

const drawer = ref(false);
const showForm = ref(false);
const nombre = ref("");
const tipo = ref("");
const fechaCompra = ref("");
const observaciones = ref("");
const cantidad = ref("");
const total = ref("");
//   const password = ref("");
const selectedMaquinariasId = ref("");
const maquinariasId = ref(null); // Para almacenar el ID del administrador en edición
const usuarios = [];
const idProveedor = ref("")
const isEditing = ref(false);
const showPassword = ref(false);



const rows = ref([]);
const columns = ref([
    {
        name: "nombre",
        label: "Nombre",
        align: "center",
        field: "nombre",
    },
    { name: "tipo", label: "Tipo", align: "center", field: "tipo" },
    { name: "fechaCompra", label: "FechaCompra", align: "center", field: "fechaCompra" },
    { name: "observaciones", label: "Observaciones", align: "center", field: "observaciones" },
    {
        name: "cantidad",
        label: "Cantidad",
        align: "center",
        field: "cantidad",
    },
    {
        name: "total",
        label: "Total",
        align: "center",
        field: "total",
    },
    {
        name: "idproveedor",
        label: "IdProveedor",
        align: "center",
        field: (row) => (row.idProveedor ? row.idProveedor.nombre : "NA")


    },
    { name: "estado", label: "Estado", align: "center", field: "estado" },
    { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const userOptions = ref([]);

const useMaquinarias = useMaquinariasStore();
const useProveedores = useProveedorStore();



let provedores = []
let datos = {}
const opciones = ref(provedores)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = provedores.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};

async function listarProveedores() {
    const data = await useProveedores.getProveedores()
    console.log("pro",data);
    
    data.proveedores.forEach(item => {
        datos = {
            label: `${item?.nombre} `,
            value: item._id


        };
        provedores.push(datos);
    });
    console.log(provedores);

}
const options = ref(usuarios)
async function listarMaquinariasActivos() {
    try {
        const r = await useMaquinarias.getMaquinariasActivos();
        rows.value = r.activados || [];
    } catch (error) {
        console.error(error);
        rows.value = [];
    }
}

async function listarMaquinariasInactivos() {
    try {
        const r = await useMaquinarias.getMaquinariasInactivos();
        rows.value = r.desactivados || [];
    } catch (error) {
        console.error(error);
        rows.value = [];
    }
}
async function agregarOEditarMaquinarias() {
    try {
        const data = {
            nombre: nombre.value,
            tipo: tipo.value,
            fechaCompra: fechaCompra.value,
            observaciones: observaciones.value,
            cantidad: cantidad.value,
            total: total.value,
            idProveedor: idProveedor.value.value
        };


        let result;

        if (maquinariasId.value) {
            result = await useMaquinarias.putMaquinarias(maquinariasId.value, data);
        } else {
            result = await useMaquinarias.postMaquinarias(data);
        }

        if (result.success) {
            listarMaquinarias(); // Actualiza la lista de administradores después de agregar o editar
            showForm.value = false; // Cierra el formulario solo si la operación fue exitosa
        }
    } catch (error) {
        console.error(error);
        console.log("error");

    }
}


function cancelarAgregarMaquinarias() {
    showForm.value = false;
    isEditing.value = false;
    maquinariasId.value = null;
    nombre.value = "";
    tipo.value = "";
    fechaCompra.value = "";
    observaciones.value = "";
    cantidad.value = "";
    total.value = "";

}


function editarMaquinarias(maquinarias) {
    nombre.value = maquinarias.nombre;
    tipo.value = maquinarias.tipo;
    fechaCompra.value = maquinarias.fechaCompra;
    observaciones.value = maquinarias.observaciones;
    cantidad.value = maquinarias.cantidad;
    total.value = maquinarias.total;
    // password.value = ""; // La contraseña no se muestra
    maquinariasId.value = maquinarias._id; // Almacena el ID del administrador en edición
    isEditing.value = true;
    showForm.value = true;
    idProveedor.value = maquinarias.idProveedor.nombre;
}
const maquinariaOptions= ref([])
async function listarMaquinarias() {
  try {
    const r = await useMaquinarias.getMaquinarias();
    rows.value = r.maquinaria || [];
    
    maquinariaOptions.value = r.maquinaria.map((p) => ({
      value: p.id,
      label: p.nombre,
    }));
   
  } catch (error) {
    console.error(error);
    rows.value = [];
    maquinariaOptions.value = [];
  }
}
async function obtenerMaquinariasPorID(selectedMaquinariasId) {
    try {
    const maquinaria = await useMaquinarias.getMaquinariasByID(
      selectedMaquinariasId
    );
    if (maquinaria) {
      rows.value = [maquinaria];
    } else {
      rows.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}

async function activarMaquinarias(maquinarias) {
    try {
        await useMaquinarias.toggleEstadoMaquinarias(maquinarias._id, true);
        listarMaquinarias();
    } catch (error) {
        console.error(error);
    }
}


async function desactivarMaquinarias(maquinarias) {
    try {
        await useMaquinarias.toggleEstadoMaquinarias(maquinarias._id, false);
        listarMaquinarias();
    } catch (error) {
        console.error(error);
    }
}

listarProveedores(); // Llama a la función para listar administradores al cargar el componente

const loading = ref(false);
watch(showForm, (newVal) => {
    if (!newVal) {
        cancelarAgregarMaquinarias();
    }
});
onMounted(() => {
    listarMaquinarias();
    listarProveedores()
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