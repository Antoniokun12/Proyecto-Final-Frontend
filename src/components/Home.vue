<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-teal-10 text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          size="25px"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          :style="{
            fontSize: '45px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }"
        >
          <q-avatar size="80px">
            <img
              src="https://e7.pngegg.com/pngimages/889/101/png-clipart-computer-icons-natural-environment-nature-natural-resource-coral-collection-leaf-hand.png"
            />
          </q-avatar>
          AgriSmart
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="account_circle"
          size="25px"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
      <q-tabs align="left">
        <q-route-tab to="/home" label="Inicio" />
        <!-- <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" /> -->
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list>
        <!-- Gestión Administrativa -->
        <q-expansion-item
          v-model="sections.gestionAdministrativa"
          label="Gestión Administrativa"
          icon="business"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/administradores"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="person" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Administrador</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/empleados"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="people" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Empleados</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/nomina"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="attach_money" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Nomina</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/proveedores"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="local_shipping" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Proveedores</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/factura"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="receipt" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Factura</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/gastos"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="paid" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Gastos</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>

        <!-- Cultivos y Suelo -->
        <q-expansion-item
          v-model="sections.cultivosYSuelo"
          label="Cultivos y Suelo"
          icon="nature"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/cultivos"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="grass" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cultivos</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/parcelas"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="map" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Parcelas</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/preparacion_suelo"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="eco" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Preparación Suelo</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/analisis_suelo"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="bar_chart" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Análisis Suelo</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/fertilizacion"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="fertilizer" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Fertilización</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/siembra"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="seedling" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Siembra</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/semillas"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="grain" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Semillas</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>

        <!-- Mantenimiento y Herramientas -->
        <q-expansion-item
          v-model="sections.mantenimientoYHerramientas"
          label="Mantenimiento y Herramientas"
          icon="build"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/mantenimientos"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="build" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mantenimientos</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/maquinaria_herramientas"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="build_circle" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Maquinaria y Herramientas</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>

        <!-- Riego y Clima -->
        <q-expansion-item
          v-model="sections.riegoYClima"
          label="Riego y Clima"
          icon="water"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/riego"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="water_drop" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Riego</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/clima"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="weather_sunny" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Clima</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>
        <!-- Control y Protección -->
        <q-expansion-item
          v-model="sections.controlYProteccion"
          label="Control y Protección"
          icon="shield"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/control_plagas"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="bug_report" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Control Plagas</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/elaboracion_sustrato"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="agriculture" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Elaboración Sustrato</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>

        <!-- Inventario y Producción -->
        <q-expansion-item
          v-model="sections.inventarioYProduccion"
          label="Inventario y Producción"
          icon="inventory"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/inventario"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inventory_2" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Inventario</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/produccion"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="production_quantity_limits" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Producción</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/insumos"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="shopping_cart" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Insumos</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>

        <!-- Fincas y Procesos -->
        <q-expansion-item
          v-model="sections.fincasYProcesos"
          label="Fincas y Procesos"
          icon="domain"
          class="q-mb-md"
          expand-icon="expand_more"
          collapse-icon="expand_less"
        >
          <router-link
            to="/fincas"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="domain" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Fincas</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
          <router-link
            to="/procesos"
            class="drawer-link"
            active-class="drawer-link-active"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="build_circle" size="36px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Procesos</q-item-label>
              </q-item-section>
            </q-item>
          </router-link>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <h4 class="text-center">PERFIL</h4>
      <q-list>
        <q-item v-if="usuario">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Nombre</q-item-label>
            <q-item-label>{{ usuario.nombre }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="usuario">
          <q-item-section avatar>
            <q-icon name="email" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Email</q-item-label>
            <q-item-label>{{ usuario.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="usuario">
          <q-item-section avatar>
            <q-icon name="phone" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Teléfono</q-item-label>
            <q-item-label>{{ usuario.telefono }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="usuario">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Dirección</q-item-label>
            <q-item-label>{{ usuario.direccion }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="usuario">
          <q-item-section avatar>
            <q-icon name="location_city" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Municipio</q-item-label>
            <q-item-label>{{ usuario.municipio }}</q-item-label>
          </q-item-section>
        </q-item>
        <div class="text-center q-my-md">
          <q-btn
            label="Cerrar sesión"
            color="red"
            size="md"
            @click="cerrarSesion"
          />
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-teal-10 text-white">
      <q-toolbar>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          "
        >
          <div style="display: flex; align-items: center">
            <q-avatar size="60px">
              <img
                src="https://e7.pngegg.com/pngimages/889/101/png-clipart-computer-icons-natural-environment-nature-natural-resource-coral-collection-leaf-hand.png"
              />
            </q-avatar>
            <span style="margin-left: 10px">
              © 2024 AgriSmart. All rights reserved.
            </span>
          </div>
          <div>
            <a href="/privacy-policy" class="text-white">Privacy Policy</a> |
            <a href="/terms-of-service" class="text-white">Terms of Service</a>
          </div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdministradorStore } from "../stores/administrador";
import { useRouter } from "vue-router";

const administradorStore = useAdministradorStore();
const router = useRouter();
const usuario = computed(() => administradorStore.administrador);

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const sections = ref({
  gestionAdministrativa: false,
  cultivosYSuelo: false,
  mantenimientoYHerramientas: false,
  riegoYClima: false,
  controlYProteccion: false,
  inventarioYProduccion: false,
  fincasYProcesos: false,
});

const toggleSection = (section) => {
  // Alterna el estado de la sección específica
  sections.value[section] = !sections.value[section];
};

const isOpen = (section) => {
  // Retorna si la sección está abierta
  return sections.value[section];
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;

  for (let section in sections.value) {
    sections.value[section] = false;
  }
};

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const cerrarSesion = () => {
  administradorStore.clearAdministrador();
  router.push({ name: "login" });
};

onMounted(() => {
  leftDrawerOpen.value = false;
});
</script>

<style>
.main-container {
  display: flex;
  justify-content: center;
  text-align: center; /* Centrará todo el contenido */
  font-size: 18px;
}

.content-card {
  max-width: 800px;
  width: 100%;
}

.q-my-md {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.q-px-md {
  padding-left: 1rem;
  padding-right: 1rem;
}

.custom-img {
  display: block;
  margin: 0 auto;
  width: 80%;
  max-width: 600px;
}

.drawer-link {
  display: block;
  padding: 5px 5px;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s;
  font-size: 22px;
  text-align: left;
  white-space: nowrap;
}

.drawer-link:hover {
  background-color: #6f9768;
}

.drawer-link-active {
  background-color: #b0bec5;
}

.drawer-link {
  text-decoration: none;
  color: inherit;
}

.q-item-label.header {
  font-weight: bold;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 5px;
}
</style>
