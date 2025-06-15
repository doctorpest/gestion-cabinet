<template>
  <q-page class="q-pa-md" style="background-color: #f5f7fa; min-height: 100vh;">
    <div class="column items-center" style="min-height: 100vh;">
      <h2 class="text-h5 text-blue-10 q-mt-xl" style="font-family: 'Poppins', sans-serif;">
        Bonjour {{ username }}
      </h2>

      <!-- Cartes légèrement descendues -->
      <div class="row justify-center q-gutter-xl q-mt-lg">
        <!-- Carte Patients -->
        <q-card
          class="shadow-lg rounded"
          style="width: 400px; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; transition: transform 0.3s ease;"
          @mouseenter="hover = 'patients'"
          @mouseleave="hover = null"
          :style="{ transform: hover === 'patients' ? 'scale(1.05)' : 'scale(1)' }"
          @click="goToPatients"
        >
          <q-card-section class="text-center">
            <q-icon name="person" size="60px" />
            <div class="text-h5 q-mt-sm">Patients</div>
          </q-card-section>
        </q-card>

        <!-- Carte RDV -->
        <q-card
          class="shadow-lg rounded"
          style="width: 400px; padding: 20px; background: linear-gradient(135deg, #43cea2, #185a9d); color: #fff; transition: transform 0.3s ease;"
          @mouseenter="hover = 'rdvs'"
          @mouseleave="hover = null"
          :style="{ transform: hover === 'rdvs' ? 'scale(1.05)' : 'scale(1)' }"
          @click="goToRDV"
        >
          <q-card-section class="text-center">
            <q-icon name="event" size="60px" />
            <div class="text-h5 q-mt-sm">RDV</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'  // Import nommé


interface JwtPayload {
  username: string;
}

const username = ref('')
const router = useRouter()
const hover = ref<string | null>(null)

const goToPatients = async () => {
  await router.push('/patients')
}

const goToRDV = async () => {
  await router.push('/rdv')
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      username.value = decoded.username
    } catch {
      console.error('Token invalide ou décodage impossible')
      username.value = 'Utilisateur'
    }
  } else {
    username.value = 'Utilisateur'
  }
})
</script>
