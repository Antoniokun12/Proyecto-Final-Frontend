<template>
  <div class="login-container">
    <div class="q-pa-md" style="max-width: 400px">
      <h1 class="titulo">AgriSmart</h1>
      <q-form class="q-gutter-md" @submit.prevent="loginUsuario">
        <q-input
          filled
          class="input"
          v-model="email"
          label="Ingrese su correo electrónico *"
        />
        <q-input
          filled
          class="input"
          :type="isPwd ? 'password' : 'text'"
          v-model="password"
          label="Ingrese su contraseña"
          ><template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div class="button-container">
          <q-btn label="Iniciar sesión" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
    <div v-if="useUsuarios.loading" class="overlay">
      <q-spinner size="xl" color="primary" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAdministradorStore } from "../stores/administrador.js";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

let useUsuarios = useAdministradorStore();

const email = ref("");
const password = ref("");
const router = useRouter();
const errors = ref({
  email: "",
  password: "",
});

const isPwd = ref(true);

function validarCorreo(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function mostrarNotificacion(mensaje, color = "negative") {
  Notify.create({
    message: mensaje,
    color: color,
    position: "top",
    icon: "sentiment_dissatisfied",
  });
}

async function loginUsuario() {
  errors.value.email = "";
  errors.value.password = "";

  if (!email.value) {
    mostrarNotificacion("El correo electrónico es obligatorio.");
    return;
  }
  if (!validarCorreo(email.value)) {
    mostrarNotificacion("El correo electrónico no es válido.");
    return;
  }
  if (!password.value) {
    mostrarNotificacion("La contraseña es obligatoria.");
    return;
  }

  try {
    let data = {
      email: email.value,
      password: password.value,
    };
    const loginSuccessful = await useUsuarios.login(data);

    if (loginSuccessful) {
      router.push("/home");
      onReset();
    } else {
      mostrarNotificacion("Correo electrónico o contraseña incorrectos.");
    }
  } catch (error) {
    console.error(error);
    mostrarNotificacion(
      "Ocurrió un error al iniciar sesión. Inténtalo de nuevo más tarde."
    );
  }
}

const onReset = () => {
  email.value = "";
  password.value = "";
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://c.wallhere.com/photos/76/d0/1920x1080_px_landscape-792595.jpg!d");
  background-size: 100% 100%; /* Ajusta el tamaño de la imagen al 50% del ancho y alto del contenedor */
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  background-position: center;
  color: white;
}

.titulo {
  font-family: "Roboto", sans-serif;
  font-size: 70px;
  font-weight: bold;
}

.input {
  background-color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.forgot-password-container {
  margin-top: 20px;
  text-align: center;
}

.forgot-password-container a {
  color: rgb(242, 242, 13);
  text-decoration: underline;
  cursor: pointer;
}

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
