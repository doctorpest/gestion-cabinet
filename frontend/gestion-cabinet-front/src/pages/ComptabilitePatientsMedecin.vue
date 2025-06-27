<template>
  <q-page class="q-pa-md bg-grey-1">
  <div class="q-pa-lg bg-white shadow-2 rounded-borders">
    <!-- Date du jour -->
    <div class="text-h5 q-mb-lg text-primary text-weight-medium">{{ dateAujourdhui }}</div>

    <!-- Barre de recherche -->
    <q-input
      filled
      v-model="search"
      label="Rechercher un patient"
      debounce="300"
      class="q-mb-lg"
      clearable
      rounded
      standout="bg-primary text-white"
    />

    <!-- Tableau des patients -->
    <q-table
      :rows="filteredPatients"
      :columns="columns"
      row-key="id"
      flat
      bordered
      dense
      class="styled-table"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="!props.row.couverture_sociale || props.row.couverture_sociale.trim() === '' ? 'bg-red-1' : ''"
        >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'couverture_sociale'">
              {{ props.row.couverture_sociale || 'Non Assuré' }}
            </template>
            <template v-else-if="typeof col.field === 'function'">
              {{ col.field(props.row) }}
            </template>
            <template v-else>
              {{ props.row[col.field] }}
            </template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr class="bg-grey-2 text-bold">
          <q-td colspan="3" class="text-right">Totaux :</q-td>
          <q-td class="text-right text-negative">{{ totalDu }}DH</q-td>
          <q-td class="text-right text-positive">{{ totalPaye }}DH</q-td>
          <q-td class="text-right text-warning">{{ totalImpayé }}DH</q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Bilan comptable -->
    <div class="q-mt-xl row items-center justify-end">
      <div class="text-subtitle1 q-mr-sm text-weight-medium text-dark">Bilan Comptable :</div>
      <q-btn flat label="À déclarer" color="primary" @click="goToCompta" />
    </div>
  </div>
</q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

interface Patient {
  id: number
  nom: string
  prenom: string
  couverture_sociale: string | null
  montant_du: number
  montant_paye: number
}


const search = ref('')
const patients = ref<Patient[]>([])
const router = useRouter()

const fetchPatients = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await api.get('/patients/avec-factures', {
      headers: { Authorization: `Bearer ${token}` }
    })
    patients.value = res.data
  } catch (err) {
    console.error('Erreur récupération patients avec factures', err)
  }
}



const filteredPatients = computed(() => {
  if (!search.value) return patients.value
  return patients.value.filter(p =>
    `${p.nom} ${p.prenom}`.toLowerCase().includes(search.value.toLowerCase())
  )
})

const totalDu = computed(() =>
  filteredPatients.value.reduce((acc, p) => acc + Number(p.montant_du), 0)
)
const totalPaye = computed(() =>
  filteredPatients.value.reduce((acc, p) => acc + Number(p.montant_paye), 0)
)

const totalImpayé = computed(() =>
  totalDu.value - totalPaye.value
)

// const rowClass = ({ row }: { row: Patient }) => {
//   console.log('couverture:', row.couverture_sociale)
//   return {
//     'bg-red-1': !row.couverture_sociale || row.couverture_sociale.trim() === ''
//   }
// }


const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', align: 'left' as const },
  { name: 'prenom', label: 'Prénom', field: 'prenom', align: 'left' as const },
  { name: 'couverture_sociale', label: 'Couverture Sociale', field: 'couverture_sociale', align: 'left' as const },
  { name: 'montant_du', label: 'À payer (dh)', field: 'montant_du', align: 'right' as const },
  { name: 'montant_paye', label: 'Payé (dh)', field: 'montant_paye', align: 'right' as const },
  {
    name: 'impaye',
    label: 'Reste impayé (dh)',
    field: (row: Patient) => row.montant_du - row.montant_paye,
    align: 'right' as const
  }
]

const goToCompta = async () => {
  await router.push('/comptabilite')
}

onMounted(fetchPatients)
</script>

<style scoped>
.bg-red-1 {
  background-color: #ffe6e6 !important;
}

.styled-table thead {
  background-color: #f0f0f0;
  font-weight: 600;
}

.rounded-borders {
  border-radius: 12px;
}

.q-input input {
  font-size: 16px;
}

/* EN-TÊTE DU TABLEAU */
.styled-table thead th {
  font-size: 16px;
  font-weight: 600;
  color: #0d47a1;
  text-transform: uppercase;
  padding: 12px 8px;
  border-bottom: 2px solid #bbdefb;
  letter-spacing: 0.5px;
}

/* BORDURE BAS DE L’EN-TÊTE */
.styled-table thead tr {
  border-bottom: 2px solid #90caf9;
  background-color: #e6f2ff !important; /* bleu pastel doux */
  height: 56px;
}

/* CORPS */
.styled-table td {
  font-size: 14px;
  padding: 12px 8px;
}

/* LIGNE AU SURVOL */
.styled-table tbody tr:hover {
  background-color: #e3f2fd;
  transition: background-color 0.3s ease;
}

/* LIGNE DES TOTAUX */
.q-table .bg-grey-2 {
  background-color: #f5f5f5;
  font-weight: bold;
  font-size: 14px;
}
</style>
