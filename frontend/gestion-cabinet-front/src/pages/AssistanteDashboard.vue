<template>
  <q-page class="q-pa-md" style="background-color: #f5f7fa;">
    <div class="row q-col-gutter-md q-mt-xxl" style="margin-top: 30px;">
      <!-- Total Patients -->
      <q-card
        class="col-xs-12 col-sm-4 shadow-lg rounded"
        style="background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; transition: transform 0.3s ease;"
        @mouseenter="hover = 'patients'"
        @mouseleave="hover = null"
        :style="{ transform: hover === 'patients' ? 'scale(1.05)' : 'scale(1)' }"
        @click="goToAllPatients"
      >
        <q-card-section>
          <div class="text-subtitle1 font-weight-bold" style="letter-spacing: 1px;">Total Patients</div>
          <div class="text-h4 q-mt-xs font-weight-extrabold">{{ totalPatients }}</div>
        </q-card-section>
      </q-card>

      <!-- RDV Aujourd’hui -->
      <q-card
        class="col-xs-12 col-sm-4 shadow-lg rounded"
        style="background: linear-gradient(135deg, #43cea2, #185a9d); color: #fff; transition: transform 0.3s ease;"
        @mouseenter="hover = 'rdvs'"
        @mouseleave="hover = null"
        :style="{ transform: hover === 'rdvs' ? 'scale(1.05)' : 'scale(1)' }"
        @click="goToAgenda"
      >
        <q-card-section>
          <div class="text-subtitle1 font-weight-bold" style="letter-spacing: 1px;">RDV Aujourd’hui</div>
          <div class="text-h4 q-mt-xs font-weight-extrabold">{{ rdvsToday.length }}</div>
        </q-card-section>
      </q-card>

      <!-- Actions rapides -->
      <q-card
        class="col-xs-12 col-sm-4 shadow-lg rounded"
        style="background: #fff; color: #333; transition: transform 0.3s ease;"
        @mouseenter="hover = 'actions'"
        @mouseleave="hover = null"
        :style="{ transform: hover === 'actions' ? 'scale(1.03)' : 'scale(1)' }"
      >
        <q-card-section>
          <q-btn
            outlined
            color="primary"
            label="Ajouter une facture"
            icon="person_add"
            @click="goToFactures"
            class="q-mb-sm full-width"
          />
          <q-btn
            outlined
            color="primary"
            label="Ajouter un patient"
            icon="person_add"
            @click="goToAddPatients"
            class="q-mb-sm full-width"
          />
          <q-btn
            outlined
            color="primary"
            label="Ajouter un RDV"
            icon="event"
            @click="dialog = true"
            class="full-width"
          />
        </q-card-section>
      </q-card>
    </div>

    <!-- RDV Aujourd’hui -->
    <q-card class="q-mt-xl shadow-lg rounded">
      <q-card-section>
        <div class="text-h5 font-weight-bold" style="color: #667eea; margin-bottom: 1rem;">Rendez-vous d’aujourd’hui</div>

        <q-table
          :rows="rdvsToday"
          :columns="columns"
          row-key="id"
          flat
          dense
          bordered
          separator="horizontal"
          class="q-mt-md"
        >
          <template v-slot:body-cell-date_rdv="props">
            <q-td :props="props" style="font-weight: 600; color: #185a9d;">
              {{ formatHour(props.row.date_rdv) }}
            </q-td>
          </template>
        </q-table>

        <div v-if="!rdvsToday.length" class="text-grey-6 text-italic q-mt-md" style="font-size: 1.1rem;">
          Aucun RDV prévu aujourd’hui
        </div>
      </q-card-section>
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
import { useRouter } from 'vue-router'
import api from '../api'

const hover = ref<string | null>(null)

interface Patient {
  id: number
  nom: string
  prenom: string
}

interface RendezVous {
  id: number
  nom: string
  prenom: string
  date_rdv: string
  motif: string
}

const router = useRouter()
const patients = ref<Patient[]>([])
const rdvs = ref<RendezVous[]>([])

const totalPatients = computed(() => patients.value.length)

const dialog = ref(false)

const newRdv = ref({
  patient_id: null,
  date: '',
  heure: '',
  motif: ''
})

const rdvsToday = computed(() => {
  const today = new Date()
  return rdvs.value.filter(rdv => {
    const date = new Date(rdv.date_rdv)
    return date.toDateString() === today.toDateString()
  }).sort((a, b) => new Date(a.date_rdv).getTime() - new Date(b.date_rdv).getTime())
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
    label: 'Heure',
    field: 'date_rdv',
    align: 'left' as const,
  },
  {
    name: 'motif',
    label: 'Motif',
    field: 'motif',
    align: 'left' as const,
  }
]


// const fetchPatients = async () => {
//   try {
//     const res = await api.get('/patients')
//     patients.value = res.data
//   } catch (err) {
//     console.error('Erreur chargement patients', err)
//   }
// }

const fetchPatients = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get('/patients', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    patients.value = response.data
  } catch (err) {
    console.error('Erreur lors de la récupération des patients:', err)
  }
}

const fetchRDV = async () => {
  try {
    const res = await api.get('/rendez-vous')
    rdvs.value = res.data
  } catch (err) {
    console.error('Erreur chargement RDV', err)
  }
}

const ajouterRendezVous = async () => {
  try {
    const token = localStorage.getItem('token')
    const dateHeure = `${newRdv.value.date} ${newRdv.value.heure}`

    await api.post('/rendez-vous', {
      patient_id: newRdv.value.patient_id,
      date_rdv: dateHeure,
      motif: newRdv.value.motif
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    dialog.value = false
    await fetchRDV()
  } catch (err) {
    console.error('Erreur ajout RDV :', err)
  }
}

const patientsOptions = computed(() =>
  patients.value.map(p => ({
    id: p.id,
    nomComplet: `${p.prenom} ${p.nom}`
  }))
)



function formatHour(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const goToAllPatients = async()=> {
  await router.push('/assistante/patients-tous')
}

const goToAgenda = async()=> {
  await router.push('/assistante/agenda')
}

const goToAddPatients = async()=> {
  await router.push('/assistante/patient-add')
}

const goToFactures = async()=> {
  await router.push('/assistante/factures')
}

onMounted(async() => {
  await fetchPatients()
  await fetchRDV()
})
</script>
