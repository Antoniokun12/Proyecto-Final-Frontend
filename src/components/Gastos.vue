<template>
  <div class="container">
    <div class="titulo">
      <div style="margin-bottom: 30px">
        <h2 style="margin: 0; color: cornflowerblue">Gastos</h2>
      </div>
      <div style="margin-bottom: 30px; display: flex; justify-content: center">
        <hr
          style="
            border: 1px solid blue;
            height: 5px;
            background: blue;
            width: 70%;
          "
        />
      </div>
    </div>
    <q-btn label="Agregar Gasto" color="primary" @click="openDialog" />

    <!-- Tabla principal de facturas -->
    <div>
      <q-table
        title="Facturas"
        :rows="rows"
        :columns="columns"
        row-key="id"
        bordered
        class="tabla"
        no-data-label="No hay datos"
        rows-per-page-options="0"
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <button @click="ver(props.row)">👁️</button>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Cuadro de diálogo con detalles de la factura -->
    <q-dialog
      v-model="abrir"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="text-dark">
        <q-bar class="bg-primary q-pa-lg">
          <q-space />
          <q-btn
            dense
            flat
            icon="edit"
            @click="editarGasto(gasto)"
            size="lg"
          >
            <q-tooltip style="font-size: 16px" class="bg-white text-primary"
              >Editar</q-tooltip
            >
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup size="lg">
            <q-tooltip style="font-size: 16px" class="bg-white text-primary"
              >Cerrar</q-tooltip
            >
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="titulo">
            <h3 style="margin-bottom: 20px">Detalle de factura</h3>
          </div>
          <div class="formulario">
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 30px;
              "
            >
              <q-input
                v-model="numero"
                label="# de factura"
                style="width: 20%"
                readonly
              />
              <q-input
                v-model="comprador"
                label="Responsable"
                style="width: 70%"
                readonly
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 30px;
              "
            >
              <p>Fecha: {{ formatDate(fecha) }}</p>
              <q-input
                :model-value="totalFactura"
                label="Total factura"
                style="width: 60%"
                readonly
              />
            </div>
          </div>
        </q-card-section>

        <!-- Tabla de insumos y semillas -->
        <q-card-section class="q-pt-none">
          <div>
            <q-table
              :rows="insumosSemillas"
              :columns="columnsInsumosSemillas"
              title="Detalles de Insumos/Semillas"
              row-key="_id"
              no-data-label="No hay datos"
              rows-per-page-options="0"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="codigo" :props="props" style="width: 20%">
                    {{ props.row.nombreProveedor || "Sin Proveedor" }}
                    <!-- Mostramos el id del proveedor -->
                  </q-td>
                  <q-td key="nombre" :props="props" style="width: 20%">
                    {{
                      props.row.nombreInsumo ||
                      props.row.nombreSemilla ||
                      "Desconocido"
                    }}
                  </q-td>
                  <q-td key="unidad" :props="props" style="width: 20%">
                    {{ props.row.unidad }}
                  </q-td>
                  <q-td key="cantidad" :props="props" style="width: 20%">
                    {{ props.row.cantidad }}
                  </q-td>
                  <q-td key="subtotal" :props="props" style="width: 20%">
                    {{ formatCurrency(props.row.sub_total) }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>

        <!-- Nueva tabla de otros gastos -->
        <q-card-section class="q-pt-none">
          <div>
            <q-table
              :rows="otrosGastos"
              :columns="columnsOtrosGastos"
              title="Otros Gastos"
              row-key="_id"
              no-data-label="No hay datos"
              rows-per-page-options="0"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="tipo" :props="props" style="width: 33.3%">
                    {{ props.row.tipo }}
                  </q-td>
                  <q-td key="descripcion" :props="props" style="width: 33.3%">
                    {{ props.row.descripcion }}
                  </q-td>
                  <q-td key="monto" :props="props" style="width: 33.3%">
                    {{ formatCurrency(props.row.monto) }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
  <!-- Diálogo que contiene el formulario -->
  <q-dialog v-model="isDialogOpen" persistent>
    <q-card style="width: 80vw; max-width: 2000px">
      <q-card-section>
        <div class="text-h4" style="text-align: center">Gasto</div>
      </q-card-section>

      <q-card-section>
        <!-- Aquí va el formulario completo -->
        <q-form @submit="submitGasto">
          <!-- Campos generales del formulario -->
          <div class="form-container">
            <q-input
              v-model="gasto.nombre"
              label="Nombre del Responsable"
              required
            />
            <q-select
              v-model="gasto.id_finca"
              :options="fincasOptions"
              label="Seleccionar Finca"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              dense
            />
            <q-input
              v-model="gasto.numero_factura"
              label="Número de factura"
              required
            />
            <q-input v-model="gasto.descripcion" label="Descripción" required />
          </div>
          <!-- Tabla para insumos -->
          <h4>Insumos</h4>
          <q-table
            :rows="gasto.insumos"
            :columns="insumoColumns"
            row-key="_id"
            no-data-label="No hay datos"
            rows-per-page-options="0"
            dense
          >
            <!-- Seleccionar proveedor -->
            <template v-slot:body-cell-id_proveedor="props">
              <q-td :props="props" style="width: 20%">
                <q-select
                  v-model="props.row.id_proveedor"
                  :options="proveedoresOptions"
                  label="Seleccionar proveedor"
                  emit-value
                  map-options
                  option-value="value"
                  option-label="label"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>

            <!-- Seleccionar insumo -->
            <template v-slot:body-cell-id_insumo="props">
              <q-td :props="props" style="width: 20%">
                <q-select
                  v-model="props.row.id_insumo"
                  :options="insumosOptions"
                  label="Seleccionar insumo"
                  emit-value
                  map-options
                  option-value="value"
                  option-label="label"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>

            <!-- Seleccionar unidad -->
            <template v-slot:body-cell-unidad="props">
              <q-td :props="props" style="width: 20%">
                <q-select
                  v-model="props.row.unidad"
                  :options="unidadesPeso"
                  label="Seleccionar unidad"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>

            <!-- Campo de cantidad -->
            <template v-slot:body-cell-cantidad="props">
              <q-td :props="props" style="width: 20%">
                <q-input
                  v-model.number="props.row.cantidad"
                  type="number"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>

            <!-- Campo de sub total -->
            <template v-slot:body-cell-sub_total="props">
              <q-td :props="props" style="width: 20%">
                <q-input
                  v-model.number="props.row.sub_total"
                  type="number"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>
          </q-table>

          <q-btn
            @click="addInsumoRow"
            type="button"
            label="Agregar Insumo"
            color="grey-7"
          />
          <!-- Tabla para semillas -->
          <h4>Semillas</h4>
          <q-table
            :rows="gasto.semillas"
            :columns="semillaColumns"
            row-key="_id"
            no-data-label="No hay datos"
            rows-per-page-options="0"
            dense
          >
            <!-- Seleccionar proveedor y semilla -->
            <template v-slot:body-cell-id_proveedor="props">
              <q-td :props="props" style="width: 20%">
                <q-select
                  v-model="props.row.id_proveedor"
                  :options="proveedoresOptions"
                  label="Seleccionar proveedor"
                  emit-value
                  map-options
                  option-value="value"
                  option-label="label"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>
            <template v-slot:body-cell-id_semilla="props">
              <q-td :props="props" style="width: 20%">
                <q-select
                  v-model="props.row.id_semilla"
                  :options="semillasOptions"
                  label="Seleccionar semilla"
                  emit-value
                  map-options
                  option-value="value"
                  option-label="label"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>

            <template v-slot:body-cell-unidad="props">
              <q-td :props="props" style="width: 20%">
                <q-select
                  v-model="props.row.unidad"
                  :options="unidadesPeso"
                  label="Seleccionar unidad"
                  dense
                  class="full-width"
                />
              </q-td>
            </template>

            <!-- Edición en la tabla de semillas -->
            <template v-slot:body-cell-cantidad="props">
              <q-td :props="props" style="width: 20%">
                <q-input
                  v-model.number="props.row.cantidad"
                  type="number"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>
            <template v-slot:body-cell-sub_total="props">
              <q-td :props="props" style="width: 20%">
                <q-input
                  v-model.number="props.row.sub_total"
                  type="number"
                  class="full-width"
                  dense
                />
              </q-td>
            </template>
          </q-table>
          <q-btn
            @click="addSemillaRow"
            type="button"
            label="Agregar Semilla"
            color="grey-7"
          />

          <!-- Tabla para otros gastos -->
          <h4>Otros Gastos</h4>
          <q-table
            :rows="gasto.otros_gastos"
            :columns="otrosGastosColumns"
            row-key="_id"
            no-data-label="No hay datos"
            rows-per-page-options="0"
            dense
          >
            <!-- Campos tipo, descripcion y monto en la tabla de otros gastos -->
            <template v-slot:body-cell-tipo="props">
              <q-td :props="props" style="width: 33.3%">
                <q-input v-model="props.row.tipo" label="Tipo de gasto" dense />
              </q-td>
            </template>
            <template v-slot:body-cell-descripcion="props">
              <q-td :props="props" style="width: 33.3%">
                <q-input
                  v-model="props.row.descripcion"
                  label="Descripción"
                  dense
                />
              </q-td>
            </template>
            <template v-slot:body-cell-monto="props">
              <q-td :props="props" style="width: 33.3%">
                <q-input
                  v-model.number="props.row.monto"
                  type="number"
                  label="Monto"
                  dense
                />
              </q-td>
            </template>
          </q-table>
          <q-btn
            @click="addOtroGastoRow"
            type="button"
            label="Agregar Otro Gasto"
            color="grey-7"
          />
        </q-form>
      </q-card-section>

      <!-- Botón para cerrar el diálogo -->
      <q-card-actions align="center">
        <q-btn
          type="submit"
          label="Guardar Gasto"
          style="width: 150px"
          color="primary"
          @click="submitGasto"
        />
        <q-btn
          type="submit"
          label="Cancelar"
          style="width: 150px"
          color="negative"
          @click="closeDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGastosStore } from "../stores/gastos.js";
import { useSemillasStore } from "../stores/semillas.js";
import { useInsumosStore } from "../stores/insumos.js";
import { useProveedorStore } from "../stores/proveedores.js";
import { useFincasStore } from "../stores/fincas.js";

const isDialogOpen = ref(false);

let abrir = ref(false);
let maximizedToggle = ref(true);
let totalFactura = ref("");
let numero = ref("");
let comprador = ref("");
let insumosSemillas = ref([]); // Aquí se almacenarán los insumos y semillas de la factura seleccionada
let otrosGastos = ref([]); // Aquí se almacenarán los otros gastos de la factura seleccionada
const gastoSeleccionado = ref(null);
const gastoId = ref(null);


const nombre = ref('');
const id_finca = ref('');
const numero_factura = ref('');
const descripcion = ref('');
const fecha = ref(null);
const insumos = ref([]);
const semillas = ref([]);
const otros_gastos = ref([]);


function formattedTotal(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0, // Opcional, ajusta según la necesidad
    maximumFractionDigits: 0,
  });
}

function formatCurrency(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const semillasOptions = ref([]);
const insumosOptions = ref([]);
const proveedoresOptions = ref([]);
const fincasOptions = ref([]);
const unidadesPeso = ["g", "kg", "t"];
const unidadesLiquido = ["ml", "lts"];

const gasto = ref({
  nombre: "",
  id_finca: "",
  numero_factura: "",
  descripcion: "",
  fecha: null,
  insumos: [], // Lista de insumos que el usuario puede agregar dinámicamente
  semillas: [], // Lista de semillas que el usuario puede agregar
  otros_gastos: [], // Lista de otros gastos
});

const rows = ref([]);

const columns = ref([
  {
    name: "numero",
    label: "Número de factura",
    field: "numero_factura",
    align: "center",
  },
  {
    name: "fecha",
    required: true,
    label: "Fecha de factura",
    align: "center",
    field: "fecha",
    format: (val) => {
      const fecha = new Date(val);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Descripción",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "total",
    label: "Valor Total",
    align: "center",
    field: "total",
    format: (val) => formatCurrency(val),
  },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const columnsInsumosSemillas = ref([
  {
    name: "codigo",
    label: "Código (Proveedor)",
    field: "id_proveedor",
    align: "center",
  },
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "unidad", label: "Unidad", field: "unidad", align: "center" },
  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  { name: "subtotal", label: "Subtotal", align: "center", field: "sub_total" },
]);

const columnsOtrosGastos = ref([
  { name: "tipo", label: "Tipo de Gasto", field: "tipo", align: "center" },
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
    align: "center",
  },
  { name: "monto", label: "Monto", field: "monto", align: "center" },
]);

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const useGastos = useGastosStore();
const useSemillas = useSemillasStore();
const useInsumos = useInsumosStore();
const useProveedores = useProveedorStore();
const useFinca = useFincasStore();

async function listarGastos() {
  try {
    // Obtener los gastos desde la API
    const r = await useGastos.getGastos();
    const gastos = r.gasto; // Suponiendo que la respuesta contiene un array llamado 'gasto'

    // Obtener los proveedores activos
    const proveedoresResponse = await useProveedores.getProveedoresActivos();
    const proveedoresOptions = proveedoresResponse.activados.map(
      (proveedor) => ({
        label: proveedor.nombre,
        value: proveedor._id,
      })
    );

    // Obtener los insumos activos
    const insumosResponse = await useInsumos.getInsumosActivas();
    const insumosOptions = insumosResponse.activados.map((insumo) => ({
      label: insumo.nombre, // El nombre del insumo
      value: insumo._id,
    }));

    // Obtener las semillas activas
    const semillasResponse = await useSemillas.getSemillasActivas();
    const semillasOptions = semillasResponse.activados.map((semilla) => ({
      label: semilla.nombre, // El nombre de la semilla
      value: semilla._id,
    }));

    // Mapeamos los gastos para añadir el nombre del proveedor, insumo y semilla
    rows.value = gastos.map((gasto) => {
      // Para cada insumo, buscamos el nombre del proveedor y del insumo
      const insumosConNombres = gasto.insumos.map((insumo) => {
        const proveedor = proveedoresOptions.find(
          (p) => p.value === insumo.id_proveedor
        );
        const nombreInsumo = insumosOptions.find(
          (i) => i.value === insumo.id_insumo
        );
        return {
          ...insumo,
          nombreProveedor: proveedor ? proveedor.label : "Desconocido", // Nombre del proveedor
          nombreInsumo: nombreInsumo ? nombreInsumo.label : insumo.id_insumo, // Nombre del insumo o ID si no lo encuentra
        };
      });

      // Para cada semilla, buscamos el nombre del proveedor y de la semilla
      const semillasConNombres = gasto.semillas.map((semilla) => {
        const proveedor = proveedoresOptions.find(
          (p) => p.value === semilla.id_proveedor
        );
        const nombreSemilla = semillasOptions.find(
          (s) => s.value === semilla.id_semilla
        );
        return {
          ...semilla,
          nombreProveedor: proveedor ? proveedor.label : "Desconocido", // Nombre del proveedor
          nombreSemilla: nombreSemilla
            ? nombreSemilla.label
            : semilla.id_semilla, // Nombre de la semilla o ID si no lo encuentra
        };
      });

      // Retornamos el gasto con los insumos y semillas actualizados
      return {
        ...gasto,
        insumos: insumosConNombres,
        semillas: semillasConNombres,
      };
    });

    console.log(rows.value); // Debug para revisar que los datos se cargan correctamente
  } catch (error) {
    console.error("Error al listar gastos:", error);
  }
}

async function listarSemillas() {
  const r = await useSemillas.getSemillasActivas();
  semillasOptions.value = r.activados.map((s) => ({
    value: s._id,
    label: s.nombre,
  }));
}

async function listarInsumos() {
  const r = await useInsumos.getInsumosActivas();
  insumosOptions.value = r.activados.map((i) => ({
    value: i._id,
    label: i.nombre,
  }));
}

async function listarProveedores() {
  try {
    const r = await useProveedores.getProveedoresActivos();
    proveedoresOptions.value = r.activados.map((proveedor) => ({
      label: proveedor.nombre,
      value: proveedor._id,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function listarFincas() {
  try {
    const r = await useFinca.listarFinca();
    fincasOptions.value = r.finca.map((finca) => ({
      label: finca.nombre,
      value: finca._id,
    }));
  } catch (error) {
    console.error(error);
  }
  console.log(fincasOptions);
}

function ver(factura) {
  console.log(factura)
  gasto.value = factura;
  abrir.value = true;
  numero.value = factura.numero_factura;
  fecha.value = factura.fecha;
  comprador.value = factura.nombre; // Usamos el campo 'nombre' como comprador
  totalFactura.value = formattedTotal(factura.total);

  // Unimos insumos y semillas en una sola lista
  insumosSemillas.value = [
    ...factura.insumos.map((insumo) => ({
      ...insumo,
      nombre: `Insumo ${insumo.id_insumo}`, // Ajuste el nombre si tienes más información
    })),
    ...factura.semillas.map((semilla) => ({
      ...semilla,
      nombre: `Semilla ${semilla.id_semilla}`, // Ajuste el nombre si tienes más información
    })),
  ];

  // Asignamos los otros gastos a su respectiva lista
  otrosGastos.value = factura.otros_gastos;
}

// Columnas de la tabla de insumos para monstar nada mas
const insumoColumns = [
  {
    name: "id_proveedor",
    label: "Proveedor",
    align: "center",
    field: "id_proveedor",
    required: true,
  },
  {
    name: "id_insumo",
    label: "Insumo",
    align: "center",
    field: "id_insumo",
    required: true,
  },
  {
    name: "unidad",
    label: "Unidad",
    align: "center",
    field: "unidad",
    required: true,
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "center",
    field: "cantidad",
    required: true,
  },
  {
    name: "sub_total",
    label: "SubTotal",
    align: "center",
    field: "sub_total",
    required: true,
  },
];

// Columnas de la tabla de semillas
const semillaColumns = [
  {
    name: "id_proveedor",
    label: "Proveedor",
    field: "id_proveedor",
    align: "center",
    required: true,
  },
  {
    name: "id_semilla",
    label: "Semilla",
    align: "center",
    field: "id_semilla",
    required: true,
  },
  {
    name: "unidad",
    label: "Unidad",
    align: "center",
    field: "unidad",
    required: true,
  },
  {
    name: "cantidad",
    label: "Cantidad",
    align: "center",
    field: "cantidad",
    required: true,
  },
  {
    name: "sub_total",
    label: "SubTotal",
    align: "center",
    field: "sub_total",
    required: true,
  },
];

// Columnas de la tabla de otros gastos
const otrosGastosColumns = [
  {
    name: "tipo",
    label: "Tipo",
    align: "center",
    field: "tipo",
    required: true,
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "center",
    field: "descripcion",
    required: true,
  },
  {
    name: "monto",
    label: "Monto",
    align: "center",
    field: "monto",
    required: true,
  },
];

// Funciones para agregar filas a las tablas
const addInsumoRow = () => {
  gasto.value.insumos.push({
    id_proveedor: "",
    id_insumo: "",
    unidad: "",
    cantidad: 0,
    sub_total: 0,
  });
};

const addSemillaRow = () => {
  gasto.value.semillas.push({
    id_proveedor: "",
    id_semilla: "",
    unidad: "",
    cantidad: 0,
    sub_total: 0,
  });
};

const addOtroGastoRow = () => {
  gasto.value.otros_gastos.push({
    tipo: "",
    descripcion: "",
    monto: 0,
  });
};

// Función para abrir el diálogo
const openDialog = () => {
  isDialogOpen.value = true;
};

// Función para cerrar el diálogo
const closeDialog = () => {
  isDialogOpen.value = false;
  gasto.value = {
    nombre: "",
    id_finca: "",
    numero_factura: "",
    descripcion: "",
    fecha: null,
    insumos: [],
    semillas: [],
    otros_gastos: [],
  };
};

const gastosStore = useGastosStore();

// const submitGasto = async () => {
//   const success = await gastosStore.postGastos(gasto.value);
//   if (success) {
//     // Limpiar formulario
//     gasto.value = {
//       nombre: "",
//       id_finca: "",
//       numero_factura: "",
//       descripcion: "",
//       fecha: null,
//       insumos: [],
//       semillas: [],
//       otros_gastos: [],
//     };
//   }
// };
async function submitGasto() {
  if (gasto.value._id) {
    await actualizarGasto();
    // Actualiza si ya existe un ID
  } else {
    await useGastos.postGastos(gasto.value);  // Crea nuevo gasto
  }
  isDialogOpen.value = false;  // Cierra el diálogo
  listarGastos();
  // Actualiza la lista
  // Reiniciar el formulario
  gasto.value = {
    nombre: "",
    id_finca: "",
    numero_factura: "",
    descripcion: "",
    fecha: null,
    insumos: [],
    semillas: [],
    otros_gastos: [],
  };
}

async function editarGasto(gasto) {

  console.log("Gasto seleccionado para editar:", gasto); 
  
  // Asignar datos al formulario
  nombre.value = gasto.nombre;
  id_finca.value = gasto.id_finca;
  numero_factura.value = gasto.numero_factura;
  descripcion.value = gasto.descripcion;
  fecha.value = new Date(gasto.fecha);  // Convertir fecha a formato correcto
  insumos.value = gasto.insumos;
  semillas.value = gasto.semillas;
  otros_gastos.value = gasto.otros_gastos;
  gastoId.value = gasto._id;
  isDialogOpen.value = true;  // Abre el cuadro de edición
}

async function actualizarGasto() {
  try {
    const id = gasto.value._id;
    await useGastos.putGastos(id, gasto.value);  // Actualiza el gasto en la store
    isDialogOpen.value = false;  // Cierra el diálogo
    listarGastos();  // Refresca la lista
  } catch (error) {
    console.error("Error al actualizar el gasto:", error);
  }
}

onMounted(() => {
  listarGastos();
  listarSemillas();
  listarInsumos();
  listarProveedores();
  listarFincas(); // Si tienes una tienda para fincas
});
</script>



<style scoped>
* {
  margin: 0;
}
.container {
  padding: 20px;
}

.titulo {
  text-align: center;
}

.formulario {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.tabla {
  border: 1px solid blue;
}

.form-container {
  display: flex;
  flex-wrap: wrap; /* Permite que los inputs se muevan a la siguiente línea si es necesario */
  gap: 16px; /* Espaciado entre los inputs */
}

.form-container > * {
  flex: 1 1 calc(50% - 16px); /* Dos columnas, ajustando el ancho según el gap */
}
</style>

