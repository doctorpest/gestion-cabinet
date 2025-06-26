<template>
  <q-page class="q-pa-xl flex flex-center bg-gradient">
    <q-card class="form-card-modern q-pa-xl">
      <q-card-section>
        <div class="text-h4 text-primary text-center q-mb-xs">
          🩺 Ajouter un patient
        </div>
        <div class="text-subtitle2 text-center text-grey-7 q-mb-xl">
          Merci de remplir les informations du patient
        </div>

        <q-form @submit.prevent="submitForm" ref="formRef" class="q-gutter-md column">
          <q-input
            v-model="form.nom"
            label="Nom"
            outlined
            dense
            clearable
            class="input-modern"
            :rules="[val => !!val || 'Le nom est requis']"
            placeholder="Entrez le nom"
            autofocus
          />

          <q-input
            v-model="form.prenom"
            label="Prénom"
            outlined
            dense
            clearable
            class="input-modern"
            :rules="[val => !!val || 'Le prénom est requis']"
            placeholder="Entrez le prénom"
          />

          <!-- Date de naissance -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <q-select
              v-model="selectedDay"
              :options="days"
              label="Jour"
              outlined
              dense
              emit-value
              map-options
              class="col input-modern"
            />
            <q-select
              v-model="selectedMonth"
              :options="months"
              label="Mois"
              outlined
              dense
              emit-value
              map-options
              class="col input-modern"
            />
            <q-select
              v-model="selectedYear"
              :options="years"
              label="Année"
              outlined
              dense
              emit-value
              map-options
              class="col input-modern"
            />
          </div>

          <!-- Toggle assuré -->
          <div class="row q-col-gutter-sm q-mb-sm items-center">
            <div class="col-6">
              <q-toggle
                v-model="form.est_assure"
                label="Le patient est-il assuré ?"
                color="primary"
                checked-icon="mdi-shield-check"
                unchecked-icon="mdi-shield-off"
                label-class="text-weight-medium"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="form.cin"
                label="CIN"
                outlined
                dense
                clearable
                class="input-modern"
                placeholder="Entrez le CIN"
                :rules="[val => !!val || 'Le CIN est requis']"
              />
            </div>
          </div>
          <q-input
            v-model="form.couverture_sociale"
            label="Couverture sociale"
            outlined
            dense
            class="input-modern"
            :disable="!form.est_assure"

            placeholder="Ex: CNSS"
          />

          <q-input
            v-model="form.pays"
            label="Pays"
            outlined
            dense
            class="input-modern"

            placeholder="Ex: France"
          />

          <q-input
            v-model="form.telephone"
            label="Téléphone"
            outlined
            dense
            class="input-modern"
            type="tel"

            placeholder="+33 6 12 34 56 78"
          />

          <q-input
            v-model="form.situation_familiale"
            label="Situation familiale"
            outlined
            dense
            class="input-modern"

            placeholder="Ex: Célibataire"
          />

          <q-input
            v-model.number="form.nombre_enfants"
            label="Nombre d'enfants"
            type="number"
            min="0"
            outlined
            dense
            class="input-modern"

            placeholder="0"
          />

          <!-- BOUTON -->
          <div class="q-mt-lg flex justify-center">
            <q-btn
              label="✅ Ajouter"
              type="submit"
              color="primary"
              unelevated
              rounded
              size="md"
              class="btn-modern btn-small"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { watch } from 'vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = ref({
  nom: '',
  prenom: '',
  date_naissance: '',
  est_assure: false,
  cin: '',
  couverture_sociale: '',
  pays: '',
  telephone: '',
  situation_familiale: '',
  nombre_enfants: 0
})

const selectedDay = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)
const selectedYear = ref<number | null>(null)

const days = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: i + 1 }))
const months = [
  { label: 'Janvier', value: 1 },
  { label: 'Février', value: 2 },
  { label: 'Mars', value: 3 },
  { label: 'Avril', value: 4 },
  { label: 'Mai', value: 5 },
  { label: 'Juin', value: 6 },
  { label: 'Juillet', value: 7 },
  { label: 'Août', value: 8 },
  { label: 'Septembre', value: 9 },
  { label: 'Octobre', value: 10 },
  { label: 'Novembre', value: 11 },
  { label: 'Décembre', value: 12 }
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, i) => {
  const y = currentYear - i
  return { label: String(y), value: y }
})

// Mettre à jour form.date_naissance automatiquement
watch([selectedDay, selectedMonth, selectedYear], () => {
  if (selectedDay.value && selectedMonth.value && selectedYear.value) {
    form.value.date_naissance =
      `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
  }
})


const submitForm = async () => {
  if (!(await formRef.value?.validate?.())) return

  loading.value = true
  const dataToSend = {
    ...form.value,
    couverture_sociale: form.value.est_assure ? form.value.couverture_sociale : null
  }

  try {
    await api.post('/patients', dataToSend)
    await router.push('/assistante/patients-tous')
  } catch (error) {
    console.error('Erreur lors de l\'ajout du patient :', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #f3f4f6, #e3f2fd);
  min-height: 100vh;
}

.form-card-modern {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.input-modern {
  border-radius: 12px;
  background-color: #fafafa;
  transition: box-shadow 0.2s ease;
}

.input-modern:focus-within {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.4);
}

.btn-modern {
  background: linear-gradient(to right, #1e88e5, #42a5f5);
  color: white;
  font-weight: 600;
  padding: 14px 30px;
  box-shadow: 0 8px 20px rgba(66, 165, 245, 0.4);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.btn-modern:hover {
  transform: scale(1.04);
  box-shadow: 0 12px 28px rgba(30, 136, 229, 0.5);
}
</style>
