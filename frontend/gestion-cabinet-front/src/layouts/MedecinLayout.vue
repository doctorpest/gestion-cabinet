<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barre du haut -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>

        <!-- Titre cliquable -->
        <q-btn
          flat
          dense
          class="text-primary text-weight-bold text-h6"
          @click="router.push('/MedecinDashboard')"
        >
          Médecin
        </q-btn>

        <q-space />

        <!-- Liens de navigation -->
        <q-btn flat dense icon="dashboard" label="Dashboard" @click="router.push('/MedecinDashboard')" />
        <q-btn flat dense icon="people" label="Patients" @click="router.push('/patients')" />
        <q-btn flat dense icon="event" label="Agenda" @click="router.push('/rdv')" />
        <q-btn flat dense icon="logout" @click="logout" />

      </q-toolbar>
    </q-header>

    <!-- Contenu principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

async function logout() {
  localStorage.removeItem('token')
  await router.push('/')
}
</script>