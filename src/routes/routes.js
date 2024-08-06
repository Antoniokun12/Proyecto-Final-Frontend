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
            },
            {
                path: '/administradores',
                name: 'Administradores',
                component: Administradores,
            },
            {
                path: '/analisis_suelo',
                name: 'Analisis_suelo',
                component: Analisissuelo,
            },
            {
                path: '/clima',
                name: 'Clima',
                component: Clima,
            },
            {
                path: '/comprador',
                name: 'Comprador',
                component: Comprador,
            },
            {
                path: '/control_plagas',
                name: 'Control_plagas',
                component: Controlplagas,
            },
            {
                path: '/cultivos',
                name: 'Cultivos',
                component: Cultivos,
            },
            {
                path: '/elaboracion_sustrato',
                name: 'Elaboracion_sustrato',
                component: Elaboracionsustrato,
            },
            {
                path: '/empleados',
                name: 'Empleados',
                component: Empleados,
            },
            {
                path: '/factura',
                name: 'Factura',
                component: Factura,
            },
            {
                path: '/fertilizacion',
                name: 'Fertilizacion',
                component: Fertilizacion,
            },
            {
                path: '/fincas',
                name: 'Fincas',
                component: Fincas,
            },
            {
                path: '/gastos',
                name: 'Gastos',
                component: Gastos,
            },
            {
                path: '/insumos',
                name: 'Insumos',
                component: Insumos,
            },
            {
                path: '/inventario',
                name: 'Inventario',
                component: Inventario,
            },
            {
                path: '/mantenimientos',
                name: 'Mantenimiento',
                component: Mantenimiento,
            },
            {
                path: '/maquinaria_herramientas',
                name: 'MaquinaHerramientas',
                component: MaquinaHerramientas,
            },
            {
                path: '/nomina',
                name: 'Nomina',
                component: Nomina,
            },
            {
                path: '/parcelas',
                name: 'Parcelas',
                component: Parcelas,
            },
            {
                path: '/preparacion_suelo',
                name: 'Preparacion_suelo',
                component: Preparacionsuelo,
            },
            {
                path: '/procesos',
                name: 'Procesos',
                component: Procesos,
            },
            {
                path: '/produccion',
                name: 'Produccion',
                component: Produccion,
            },
            {
                path: '/proveedores',
                name: 'Proveedores',
                component: Proveedores,
            },
            {
                path: '/riego',
                name: 'Riego',
                component: Riego,
            },
            {
                path: '/semillas',
                name: 'Semillas',
                component: Semillas,
            },
            {
                path: '/siembra',
                name: 'Siembra',
                component: Siembra,
            },
        ]
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})



