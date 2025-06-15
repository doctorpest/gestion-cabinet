<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'

const route = useRoute()
const router = useRouter()
const patientId = Number(route.params.id)

const loading = ref(false)
const error = ref('')
const success = ref(false)

// Données du patient
const form = ref({
  nom: '',
  prenom: '',
  date_naissance: '',
  est_assure: false,
  couverture_sociale: '',
  pays: '',
  telephone: '',
  situation_familiale: '',
  nombre_enfants: 0,
})

async function fetchPatient() {
  try {
    loading.value = true
    const res = await api.get(`/patients/${patientId}`)
    const data = res.data

    form.value = {
      nom: data.nom,
      prenom: data.prenom,
      date_naissance: data.date_naissance?.split('T')[0], // format date ISO
      est_assure: data.est_assure,
      couverture_sociale: data.couverture_sociale || '',
      pays: data.pays,
      telephone: data.telephone,
      situation_familiale: data.situation_familiale || '',
      nombre_enfants: data.nombre_enfants || 0,
    }
  } catch (err) {
    error.value = 'Erreur de chargement des données'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function updatePatient() {
  try {
    loading.value = true
    await api.put(`/patients/${patientId}`, form.value)
    success.value = true
    setTimeout(() => {
       void router.push('/patients') // redirige vers la liste
    }, 1000)
  } catch (err) {
    error.value = "Erreur lors de la mise à jour"
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPatient)
</script>

<template>
  <div class="q-pa-xl flex flex-center" style="background: #f5f9ff; min-height: 100vh;">
    <q-card
      flat
      bordered
      class="q-pa-xl"
      style="max-width: 600px; width: 100%; border-radius: 16px; box-shadow: 0 8px 24px rgba(25, 118, 210, 0.1);"
    >
      <!-- Titre centré -->
      <q-card-section class="text-center">
        <div class="text-h5 text-primary" style="font-weight: 600;">
          Modifier les informations du patient
        </div>
        <q-separator color="primary" class="q-my-sm" />
      </q-card-section>

      <!-- Formulaire -->
      <q-card-section>
        <q-form @submit.prevent="updatePatient" class="q-gutter-md">
          <q-input filled v-model="form.nom" label="Nom" />
          <q-input filled v-model="form.prenom" label="Prénom" />
          <q-input filled v-model="form.date_naissance" label="Date de naissance" mask="####-##-##" hint="Format : AAAA-MM-JJ" />
          <q-toggle v-model="form.est_assure" label="Assuré ?" color="primary" />

          <q-input
            v-if="form.est_assure"
            filled
            v-model="form.couverture_sociale"
            label="Couverture sociale"
          />

          <q-input filled v-model="form.telephone" label="Téléphone" />
          <q-input filled v-model="form.pays" label="Pays" />
          <q-input filled v-model="form.situation_familiale" label="Situation familiale" />
          <q-input filled v-model.number="form.nombre_enfants" label="Nombre d'enfants" type="number" min="0" />

          <!-- Boutons -->
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              type="submit"
              label="Enregistrer"
              color="primary"
              unelevated
              :loading="loading"
              class="rounded-borders"
            />
            <q-btn
              flat
              label="Annuler"
              color="primary"
              @click="router.back()"
            />
          </div>
        </q-form>

        <!-- Messages -->
        <q-banner v-if="error" class="bg-red-1 text-red q-mt-md" rounded>
          {{ error }}
        </q-banner>
        <q-banner v-if="success" class="bg-green-1 text-green q-mt-md" rounded>
          Mise à jour réussie !
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>