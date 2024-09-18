import { createRouter, createWebHashHistory } from 'vue-router';
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Inicio from "../components/Inicio.vue";
import Administradores from "../components/Administradores.vue";

import Analisissuelo from "../components/Analisissuelo.vue";
import Clima from "../components/Clima.vue";
import Comprador from "../components/Comprador.vue";
import Controlplagas from "../components/Controlplagas.vue";
import Cultivos from "../components/Cultivos.vue";
import Elaboracionsustrato from "../components/Elaboracionsustrato.vue";
import Empleados from "../components/Empleados.vue";
import Factura from "../components/Factura.vue";
import Fertilizacion from "../components/Fertilizacion.vue";
import Fincas from "../components/Fincas.vue";
import Gastos from "../components/Gastos.vue";
import Insumos from "../components/Insumos.vue";
import Inventario from "../components/Inventario.vue";
import Mantenimiento from "../components/Mantenimiento.vue";
import MaquinaHerramientas from "../components/Maquinash.vue";
import Nomina from "../components/Nomina.vue";
import Parcelas from "../components/Parcelas.vue";
import Preparacionsuelo from "../components/Preparacionsuelo.vue";
import Procesos from "../components/Procesos.vue";
import Produccion from "../components/Produccion.vue";
import Proveedores from "../components/Proveedores.vue";
import Riego from "../components/Riego.vue";
import Semillas from "../components/Semillas.vue";
import Siembra from "../components/Siembra.vue";
import { useAdministradorStore } from "../stores/administrador.js";

const auth = (to, from, next) => {
    if (checkAuth()) {
      next() // Permite el acceso si hay un token válido
    } else {
      return next({ name: 'login' }) // Redirige a la página de login si no hay token
    }
  };
  
  const checkAuth = () => {
    const useUsuario = useAdministradorStore();
    const token = useUsuario.token;
    return !!token; // Devuelve true si hay un token, false si no lo hay
  };


const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        children: [
            {
                path: '/home',
                name: 'Inicio',
                component: Inicio,
                beforeEnter: auth
            },
            {
                path: '/administradores',
                name: 'Administradores',
                component: Administradores,
                beforeEnter: auth
            },
            {
                path: '/analisis_suelo',
                name: 'Analisis_suelo',
                component: Analisissuelo,
                beforeEnter: auth
            },
            {
                path: '/clima',
                name: 'Clima',
                component: Clima,
                beforeEnter: auth
            },
            {
                path: '/comprador',
                name: 'Comprador',
                component: Comprador,
                beforeEnter: auth
            },
            {
                path: '/control_plagas',
                name: 'Control_plagas',
                component: Controlplagas,
                beforeEnter: auth
            },
            {
                path: '/cultivos',
                name: 'Cultivos',
                component: Cultivos,
                beforeEnter: auth
            },
            {
                path: '/elaboracion_sustrato',
                name: 'Elaboracion_sustrato',
                component: Elaboracionsustrato,
                beforeEnter: auth
            },
            {
                path: '/empleados',
                name: 'Empleados',
                component: Empleados,
                beforeEnter: auth
            },
            {
                path: '/factura',
                name: 'Factura',
                component: Factura,
                beforeEnter: auth
            },
            {
                path: '/fertilizacion',
                name: 'Fertilizacion',
                component: Fertilizacion,
                beforeEnter: auth
            },
            {
                path: '/fincas',
                name: 'Fincas',
                component: Fincas,
                beforeEnter: auth
            },
            {
                path: '/gastos',
                name: 'Gastos',
                component: Gastos,
                beforeEnter: auth
            },
            {
                path: '/insumos',
                name: 'Insumos',
                component: Insumos,
                beforeEnter: auth
            },
            {
                path: '/inventario',
                name: 'Inventario',
                component: Inventario,
                beforeEnter: auth
            },
            {
                path: '/mantenimientos',
                name: 'Mantenimiento',
                component: Mantenimiento,
                beforeEnter: auth
            },
            {
                path: '/maquinaria_herramientas',
                name: 'MaquinaHerramientas',
                component: MaquinaHerramientas,
                beforeEnter: auth
            },
            {
                path: '/nomina',
                name: 'Nomina',
                component: Nomina,
                beforeEnter: auth
            },
            {
                path: '/parcelas',
                name: 'Parcelas',
                component: Parcelas,
                beforeEnter: auth
            },
            {
                path: '/preparacion_suelo',
                name: 'Preparacion_suelo',
                component: Preparacionsuelo,
                beforeEnter: auth
            },
            {
                path: '/procesos',
                name: 'Procesos',
                component: Procesos,
                beforeEnter: auth
            },
            {
                path: '/produccion',
                name: 'Produccion',
                component: Produccion,
                beforeEnter: auth
            },
            {
                path: '/proveedores',
                name: 'Proveedores',
                component: Proveedores,
                beforeEnter: auth
            },
            {
                path: '/riego',
                name: 'Riego',
                component: Riego,
                beforeEnter: auth
            },
            {
                path: '/semillas',
                name: 'Semillas',
                component: Semillas,
                beforeEnter: auth
            },
            {
                path: '/siembra',
                name: 'Siembra',
                component: Siembra,
                beforeEnter: auth
            },
        ]
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})



