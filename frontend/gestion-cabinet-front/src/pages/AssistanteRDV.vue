<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md shadow-2 bg-grey-1">
      <div class="text-h5 text-primary q-mb-md">
        <q-icon name="event" class="q-mr-sm" />
        Liste des Rendez-vous
      </div>

      <q-btn label="Nouveau Rendez-vous" icon="add" color="primary" @click="dialog = true" class="q-mb-md" />

      <q-table
        :rows="rendezVousFiltres"
        :columns="columns"
        row-key="id"
        flat
        bordered
        dense
        separator="horizontal"
      >
        <template v-slot:body-cell-date_rdv="props">
          <q-td :props="props">
            {{ formatDate(props.row.date_rdv) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn icon="delete" flat dense color="red" @click="supprimerRendezVous(props.row.id)" />
          </q-td>
        </template>
      </q-table>

      <div v-if="!rendezVousFiltres.length" class="text-grey-6 q-mt-md">Aucun rendez-vous à venir.</div>
    </q-card>

    <q-dialog v-model="dialog" persistent transition-show="scale" transition-hide="scale">
    <q-card style="min-width: 400px; max-width: 90vw;">
    <q-card-section class="row items-center q-pb-none">
      <q-icon name="event_available" size="md" color="primary" class="q-mr-sm" />
      <div class="text-h6">Nouveau Rendez-vous</div>
    </q-card-section>

    <q-separator />

    <q-form @submit.prevent="ajouterRendezVous">
      <q-card-section class="q-gutter-md">

        <q-select
          v-model="newRdv.patient_id"
          :options="patientsOptions"
          label="Patient"
          option-value="id"
          option-label="nomComplet"
          emit-value
          map-options
          dense
          filled
          clearable
        />

        <q-input
          v-model="newRdv.date"
          label="Date"
          mask="####-##-##"
          filled
          dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newRdv.date" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="newRdv.heure"
          label="Heure (ex: 14:00 ou 2:00 PM)"
          filled
          mask="##:## AA"
          dense
        />


        <q-input
          v-model="newRdv.motif"
          label="Motif"
          type="text"
          dense
          filled
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-gutter-sm q-pa-sm">
        <q-btn flat label="Annuler" @click="dialog = false" color="grey-7" icon="close" />
        <q-btn label="Ajouter" color="primary" type="submit" icon="send" />
      </q-card-actions>
    </q-form>
  </q-card>
</q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api' // adapte ce chemin si nécessaire

interface RendezVous {
  nom: string;
  prenom: string;
  date_rdv: string;
  motif: string;
  statut: string;
}

interface Patient {
  id: number;
  nom: string;
  prenom: string;
}

const rendezVous = ref<RendezVous[]>([])
const patients = ref<Patient[]>([])
const patientsOptions = computed(() => patients.value)
const dialog = ref(false)

const newRdv = ref({
  patient_id: 0,
  date: '',
  heure: '',
  motif: '',
  statut: 'prévu'
})


const columns = [
  {
    name: 'patient',
    label: 'Patient',
    field: (row: RendezVous) => `${row.nom} ${row.prenom}`,
    align: 'left' as const,
  },
  {
    name: 'date_rdv',
    label: 'Date',
    field: 'date_rdv',
    align: 'left' as const,
  },
  {
    name: 'motif',
    label: 'Motif',
    field: 'motif',
    align: 'left' as const,
  },
  {
    name: 'statut',
    label: 'Statut',
    field: 'statut',
    align: 'left' as const,
  },
  {
    name: 'actions',
    label: '',
    field: 'actions',
    align: 'right' as const,
  }
]

const fetchRendezVous = async () => {
  try {
    const res = await api.get('/rendez-vous')
    rendezVous.value = res.data
  } catch (err) {
    console.error('Erreur chargement RDV', err)
  }
}

// const fetchPatients = async () => {
//   try {
//     const res = await api.get('/patients') // Assure-toi que cette route existe côté backend
//     patients.value = res.data
//   } catch (err) {
//     console.error('Erreur chargement patients', err)
//   }
// }
const fetchPatients = async () => {
  try {
    const res = await api.get('/patients')
    // On construit l'option label à partir du nom/prénom
    patients.value = res.data.map((p: Patient) => ({
      id: p.id,
      nomComplet: `${p.nom} ${p.prenom}`
    }))
  } catch (err) {
    console.error('Erreur chargement patients', err)
  }
}

const combineDateTime = () => {
  const [hoursPart, minutesPartRaw] = newRdv.value.heure.trim().split(':')

  const minutesMatch = minutesPartRaw?.match(/^(\d{2})\s*(AM|PM)?$/i)
  const minutes: string = minutesMatch?.[1] ?? '00'
  const ampm: string = minutesMatch?.[2]?.toUpperCase() ?? ''

  let hourNum: number = parseInt(hoursPart || '0')
  if (ampm === 'PM' && hourNum < 12) hourNum += 12
  if (ampm === 'AM' && hourNum === 12) hourNum = 0

  const hourStr: string = hourNum.toString().padStart(2, '0')
  return `${newRdv.value.date}T${hourStr}:${minutes}:00`
}


const ajouterRendezVous = async () => {
  try {
    const payload = {
      patient_id: newRdv.value.patient_id,
      motif: newRdv.value.motif,
      statut: newRdv.value.statut,
      date_rdv: combineDateTime()
    }

    await api.post('/rendez-vous', payload)
    dialog.value = false
    await fetchRendezVous()
    newRdv.value = { patient_id: 0, date: '', heure: '', motif: '', statut: 'prévu' }
  } catch (err) {
    console.error('Erreur ajout RDV', err)
  }
}


// const ajouterRendezVous = async () => {
//   try {
//     await api.post('/rendez-vous', newRdv.value)
//     dialog.value = false
//     await fetchRendezVous()
//     newRdv.value = { patient_id: 0, date_rdv: '', motif: '', statut: 'prévu' }
//   } catch (err) {
//     console.error('Erreur ajout RDV', err)
//   }
// }

const supprimerRendezVous = async (id: number) => {
  try {
    await api.delete(`/rendez-vous/${id}`)
    await fetchRendezVous()
  } catch (err) {
    console.error('Erreur suppression RDV', err)
  }
}

const rendezVousFiltres = computed(() => {
  const now = new Date()
  return rendezVous.value
    .filter(r => new Date(r.date_rdv) > now)
    .sort((a, b) => new Date(a.date_rdv).getTime() - new Date(b.date_rdv).getTime())
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

onMounted(async () => {
  await fetchRendezVous()
  await fetchPatients()
})
</script>
