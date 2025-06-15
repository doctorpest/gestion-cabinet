<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>

        <!-- Titre cliquable -->
        <q-btn
          flat
          dense
          class="text-primary text-weight-bold text-h6"
          @click="router.push('/AssistanteDashboard')"
        >
          Assistante
        </q-btn>

        <q-space />

        <!-- Menu de navigation -->
        <q-btn flat dense icon="dashboard" label="Dashboard" @click="router.push('/AssistanteDashboard')" />
        <q-btn flat dense icon="people" label="Patients" @click="router.push('/assistante/patients-tous')" />
        <q-btn flat dense icon="event_note" label="Agenda" @click="router.push('/assistante/agenda')" />
        <!-- <q-btn flat dense icon="assignment" label="Certificats" @click="router.push('/assistante/certificats')" /> -->
        <q-btn flat dense icon="receipt" label="Factures" @click="router.push('/assistante/factures')" />
        <q-btn flat dense icon="account_balance" label="Comptabilité" @click="router.push('/assistante/comptabilite')" />
        <q-btn flat dense icon="logout" @click="logout" />

      </q-toolbar>
    </q-header>

    <!-- Contenu -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  localStorage.removeItem('token')
  await router.push('/')
}
</script>
