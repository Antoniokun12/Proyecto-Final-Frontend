<template>
  <q-page-container>
    <q-page class="q-pa-md main-container">
      <q-card class="content-card q-pa-md">
        <q-card-section>
          <div class="text-h4 text-weight-bold text-center q-my-md">
            Buenas Prácticas Agrícolas: Manejo del Suelo
          </div>
        </q-card-section>

        <q-card-section>
          <q-img
            src="https://media.istockphoto.com/id/1256012711/es/foto/listo-para-mudarte-a-un-nuevo-hogar.jpg?s=612x612&w=0&k=20&c=RPjLuFB4bhmqZBdC2CPdBePSXXAQOurDOI8rSNkEIDA="
            alt="Manejo del Suelo"
            class="custom-img"
          />
          <div class="q-my-md q-px-md">
            <p>
              El manejo adecuado del suelo es esencial para la producción
              agrícola sostenible. Aquí hay algunos aspectos clave y prácticas
              recomendadas:
            </p>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4 text-weight-bold text-center q-my-md">
            1. Rotación de Cultivos
          </div>
          <q-img
            src="https://media.istockphoto.com/id/2063348041/es/foto/primer-plano-de-brotes-j%C3%B3venes-de-ma%C3%ADz-que-crecen-en-el-campo-cultivo-de-plantas-de-ma%C3%ADz.webp?b=1&s=170667a&w=0&k=20&c=JjmojL9DKeH87_JtA2ZLNVmfG1RO6VZBch0yG-5y8Yw="
            alt="Rotación de Cultivos"
            class="custom-img"
          />
          <div class="q-my-md q-px-md">
            <p>
              La rotación de cultivos implica alternar diferentes tipos de
              cultivos en la misma área en diferentes temporadas. Esto ayuda a
              prevenir el agotamiento de nutrientes y reduce la incidencia de
              plagas y enfermedades.
            </p>
            <ul>
              <li>Mejora la estructura del suelo</li>
              <li>Reduce la erosión</li>
              <li>Aumenta la biodiversidad</li>
            </ul>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4 text-weight-bold text-center q-my-md">
            2. Uso de Abonos Orgánicos
          </div>
          <q-img
            src="https://img.freepik.com/foto-gratis/cuchara-medicion-verde-suelo-oscuro_23-2148181144.jpg"
            alt="Abonos Orgánicos"
            class="custom-img"
          />
          <div class="q-my-md q-px-md">
            <p>
              Los abonos orgánicos, como el compost y el estiércol, mejoran la
              fertilidad del suelo al proporcionar nutrientes esenciales y
              mejorar la estructura del suelo.
            </p>
            <ul>
              <li>Mejoran la retención de agua del suelo</li>
              <li>Incrementan la actividad microbiana</li>
              <li>Proveen nutrientes a largo plazo</li>
            </ul>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4 text-weight-bold text-center q-my-md">
            3. Conservación de la Materia Orgánica del Suelo
          </div>
          <q-img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-y7_Uj85Pfc4qORLKsXZsEZ-EA8UqmV6Yiw&s"
            alt="Materia Orgánica del Suelo"
            class="custom-img"
          />
          <div class="q-my-md q-px-md">
            <p>
              Mantener niveles adecuados de materia orgánica es crucial para la
              salud del suelo. La materia orgánica mejora la estructura del
              suelo, la retención de agua y la disponibilidad de nutrientes.
            </p>
            <ul>
              <li>Incorpora residuos de cultivos y abonos verdes</li>
              <li>Evita la quema de residuos de cultivos</li>
              <li>Utiliza técnicas de labranza mínima</li>
            </ul>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4 text-weight-bold text-center q-my-md">
            4. Control de la Erosión
          </div>
          <q-img
            src="https://blog.aepla.es/wp-content/uploads/2021/02/buenas-practicas-cultivos-erosion_redes.jpeg"
            alt="Control de la Erosión"
            class="custom-img"
          />
          <div class="q-my-md q-px-md">
            <p>
              El control de la erosión es fundamental para prevenir la pérdida
              de suelo fértil y mantener la productividad agrícola. Algunas
              prácticas incluyen:
            </p>
            <ul>
              <li>Uso de coberturas vegetales</li>
              <li>Construcción de terrazas</li>
              <li>Implementación de barreras vegetativas</li>
            </ul>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h4 text-weight-bold text-center q-my-md">
            5. Manejo de la Salinidad
          </div>
          <q-img
            src="https://blogdefagro.com/wp-content/uploads/2022/07/47938d_b5dce51ed3044f4189c73711f07b2353_mv2.jpg"
            alt="Manejo de la Salinidad"
            class="custom-img"
          />
          <div class="q-my-md q-px-md">
            <p>
              La salinidad del suelo puede afectar negativamente el crecimiento
              de los cultivos. Algunas estrategias para manejar la salinidad
              incluyen:
            </p>
            <ul>
              <li>Uso de cultivos tolerantes a la salinidad</li>
              <li>Aplicación de enmiendas como el yeso</li>
              <li>Mejora del drenaje del suelo</li>
            </ul>
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup>
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  text-align: center; /* Centrará todo el contenido */
  font-size: 18px;
  padding: 0%;
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
</style>
