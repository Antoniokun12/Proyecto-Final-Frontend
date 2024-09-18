<template>
  <q-page>
    <div class="q-pa-md text-center">
      <div class="text-h2">Facturas</div>
      <q-btn
        label="Agregar Factura"
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
          <q-item clickable v-ripple @click="listarFacturas">
            <q-item-section>Listar Todas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarFacturasActivas">
            <q-item-section>Listar Activas</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarFacturasInactivas">
            <q-item-section>Listar Inactivas</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-select
        v-model="selectedItemId"
        label="Seleccionar Factura"
        :options="itemOptions"
        emit-value
        map-options
        option-value="value"
        option-label="label"
        style="margin-left: 16px; max-width: 200px"
        @update:model-value="obtenerFacturaPorID"
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
            no-data-label="No hay facturas disponibles"
          >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="editarFactura(props.row)"
                >
                  <q-tooltip
                    class="bg-indigo rounded-borders row flex-center"
                    :offset="[10, 10]"
                    style="width: 200px; height: 40px; font-size: 15px"
                  >
                    Editar Factura
                  </q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="q-pa-md text-center">
                <q-icon
                  name="sentiment_dissatisfied"
                  size="lg"
                  class="q-mr-sm"
                />
                <div class="text-h6">No hay facturas disponibles</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pa-md">
      <q-dialog v-model="showForm">
        <q-card style="width: 600px; border-radius: 15px;">
          <q-card-section>
            <q-form @submit.prevent="agregarOEditarFactura">
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
                  Factura
                </h1>
              </div>
              <q-select
                v-model="idComprador"
                label="Comprador"
                :options="compradorOptions"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                required
              />
              <q-input
                v-model.trim="nloteComercial"
                label="N° Lote Comercial"
                required
              />
              <q-input
                v-model.trim="valor"
                label="Valor"
                type="number"
                required
              />
              <div v-for="(detalleItem, index) in detalles" :key="index">
                <q-input
                  v-model.trim="detalleItem.nombreProducto"
                  label="Nombre del Producto"
                  required
                />
                <q-input
                  v-model.trim="detalleItem.cantidad"
                  label="Cantidad"
                  type="number"
                  required
                />
                <q-input
                  v-model.trim="detalleItem.subtotal"
                  label="Subtotal"
                  type="number"
                />
                <q-input
                  v-model.trim="detalleItem.total"
                  label="Total"
                  type="number"
                />
                <q-input
                  v-model.trim="detalleItem.iva"
                  label="IVA"
                  type="number"
                />
                <q-btn
                  flat
                  color="negative"
                  label="Eliminar Detalle"
                  @click="eliminarDetalle(index)"
                />
              </div>
              <q-btn
                flat
                color="primary"
                label="Agregar Detalle"
                @click="agregarDetalle"
              />
              <div
                style="margin-top: 15px; display: flex; justify-content: center"
              >
                <q-btn
                  label="Cancelar"
                  color="negative"
                  @click="cancelarAgregarFactura"
                  class="q-mr-sm"
                />
                <q-btn type="submit" label="Guardar" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <div v-if="loading" class="overlay">
        <q-spinner size="xl" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useFacturaStore } from "../stores/factura.js";
import { useCompradorStore } from "../stores/comprador.js"; // Añade esta importación si es necesario

const showForm = ref(false);
const idComprador = ref("");
const nloteComercial = ref("");
const valor = ref("");
const detalles = ref([]);
const compradorOptions = ref([]);
const selectedItemId = ref("");
const itemId = ref(null); // Para almacenar el ID de la factura en edición
const isEditing = ref(false);
const loading = ref(false);

const rows = ref([]);
const columns = ref([
  { name: "idComprador", label: "Comprador", align: "center", field: "idComprador" },
  { name: "nloteComercial", label: "N° Lote Comercial", align: "center", field: "nloteComercial" },
  { name: "valor", label: "Valor", align: "center", field: "valor" },
  { name: "detalles", label: "Detalles", align: "center", field: "detalles" },
  { name: "opciones", label: "Opciones", align: "center", field: "opciones" },
]);

const itemOptions = ref([]);

const useFacturas = useFacturaStore();
const useCompradores = useCompradorStore(); // Añade esta línea si es necesario

async function listarFacturas() {
  try {
    loading.value = true;
    const r = await useFacturas.getFactura();
    rows.value = r.factura;
    itemOptions.value = r.factura.map((item) => ({
      label: item.nloteComercial,
      value: item._id,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function listarFacturasActivas() {
  // Implementa la lógica para listar facturas activas si es necesario
}

async function listarFacturasInactivas() {
  // Implementa la lógica para listar facturas inactivas si es necesario
}

async function agregarOEditarFactura() {
  try {
    const data = {
      idComprador: idComprador.value,
      nloteComercial: nloteComercial.value,
      valor: valor.value,
      detalle: detalles.value,
    };

    if (isEditing.value) {
      await useFacturas.editarFactura(itemId.value, data);
    } else {
      await useFacturas.agregarFactura(data);
    }
    cancelarAgregarFactura();
    listarFacturas(); // Refrescar los datos
  } catch (error) {
    console.error(error);
  }
}

function editarFactura(data) {
  idComprador.value = data.idComprador;
  nloteComercial.value = data.nloteComercial;
  valor.value = data.valor;
  detalles.value = data.detalle;
  itemId.value = data._id;
  isEditing.value = true;
  showForm.value = true;
}

function obtenerFacturaPorID(id) {
  if (id) {
    useFacturas.getFacturaById(id).then((res) => {
      const data = res.data;
      editarFactura(data);
    });
  }
}

function cancelarAgregarFactura() {
  showForm.value = false;
  idComprador.value = "";
  nloteComercial.value = "";
  valor.value = "";
  detalles.value = [];
  itemId.value = null;
  isEditing.value = false;
}

function agregarDetalle() {
  detalles.value.push({
    nombreProducto: "",
    cantidad: 0,
    subtotal: 0,
    total: 0,
    iva: 0,
  });
}

function eliminarDetalle(index) {
  detalles.value.splice(index, 1);
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
