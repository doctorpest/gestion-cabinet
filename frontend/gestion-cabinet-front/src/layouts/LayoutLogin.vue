<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <q-page-container class="row no-wrap" style="height: 100vh;">

      <!-- Partie gauche : logo + fond -->
      <div
        class="col-5 flex flex-center"
        style="background: linear-gradient(135deg, #00796b 0%, #004d40 100%);"
      >
        <img
          src="~assets/logo.png"
          alt="Logo Cabinet"
          style="max-width: 70%; max-height: 70%;"
        />
      </div>

      <!-- Partie droite : contenu login -->
      <q-page
        class="col-7 flex flex-column justify-center items-center"
        style="padding: 0 50px;"
      >
        <h1
          class="text-teal-9"
          style="font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 2rem; margin-bottom: 1rem; letter-spacing: 1px;"
        >
        Welcome to ELANOUAR Dental Clinic
        </h1>


        <q-card
          flat
          bordered
          class="q-pa-xl"
          style="max-width: 420px; width: 100%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); border-radius: 16px;"
        >
          <q-card-section>
            <q-form @submit.prevent="login" class="q-gutter-md">

              <q-input
                filled
                v-model="username"
                label="Nom d'utilisateur"
                type="text"
                autofocus
                lazy-rules
                :rules="[val => !!val || 'Le nom est requis']"
              />

              <q-input
                filled
                v-model="password"
                label="Mot de passe"
                type="password"
                lazy-rules
                :rules="[val => !!val || 'Le mot de passe est requis']"
              />

              <q-btn
                type="submit"
                label="Se connecter"
                color="teal"
                class="full-width"
                unelevated
              />

            </q-form>
          </q-card-section>
        </q-card>
      </q-page>

    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    })
    const token = response.data.token

    localStorage.setItem('token', token)
    await router.push('/dashboard')
  } catch (error) {
    alert('Erreur de connexion')
    console.error(error)
  }
}
</script>

<style scoped>
.text-teal-9 {
  color: #00796b;
}

.q-page-container {
  min-height: 100vh;
}

.q-btn.full-width {
  font-weight: 700;
  font-size: 1.1rem;
}
</style>
