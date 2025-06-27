<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-input
        filled
        v-model="search"
        placeholder="Rechercher un patient..."
        class="col"
        debounce="300"
        clearable
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-table
      :rows="filteredPatients"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="q-mt-md"
    >
      <template #body-cell-actions="props">
        <q-td class="q-gutter-xs">
          <q-btn
            flat
            round
            icon="receipt_long"
            color="primary"
            @click.stop="openFactureDialog(props.row)"
            title="Ajouter facture"
          />

          <q-btn
            flat
            round
            icon="edit"
            color="primary"
            @click.stop="openEditDialog(props.row)"
            title="Modifier patient"
          />

          <q-btn
            flat
            round
            icon="visibility"
            color="primary"
            @click.stop="viewPatientDetails(props.row)"
            title="Voir fiche patient"
          />


        </q-td>
      </template>
    </q-table>

    <!-- Dialog de création de facture -->
    <q-dialog v-model="factureDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="receipt_long" class="q-mr-sm" color="primary" />
          <div class="text-h6">Nouvelle Facture</div>
        </q-card-section>

        <q-separator />

        <q-form @submit.prevent="submitFacture">
          <q-card-section class="q-gutter-md">
            <div><strong>Patient :</strong> {{ selectedPatient?.prenom }} {{ selectedPatient?.nom }}</div>

            <q-input
              v-model="factureData.montant_total"
              label="Montant (dh)"
              type="number"
              filled
              dense
              required
            />

            <q-input
              v-model.number="factureData.montant_paye"
              label="Montant payé (dh)"
              type="number"
              step="0.01"
              filled
              dense
              required
            />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-gutter-sm q-pa-sm">
            <q-btn flat label="Annuler" @click="factureDialog = false" color="grey" />
            <q-btn label="Ajouter" type="submit" color="primary" icon="add" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
      <!-- Dialog de modification de patients -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 500px;">
        <q-card-section>
          <div class="text-h6">Modifier Patient</div>
        </q-card-section>

        <q-form @submit.prevent="submitEdit">
          <q-card-section class="q-gutter-md">
            <q-input v-model="editedPatient.nom" label="Nom" filled dense required />
            <q-input v-model="editedPatient.prenom" label="Prénom" filled dense required />
            <q-input v-model="editedPatient.date_naissance" label="Date de naissance" filled dense mask="####-##-##">
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="editedPatient.date_naissance" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-toggle v-model="editedPatient.est_assure" label="Assuré ?" />

            <q-input
              v-if="editedPatient.est_assure"
              v-model="editedPatient.couverture_sociale"
              label="Couverture sociale"
              filled
              dense
            />

            <q-input v-model="editedPatient.telephone" label="Téléphone" filled dense />
            <q-input v-model="editedPatient.pays" label="Pays" filled dense />
            <q-input v-model="editedPatient.situation_familiale" label="Situation familiale" filled dense />
            <q-input v-model.number="editedPatient.nombre_enfants" label="Nombre d'enfants" type="number" filled dense />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-sm">
            <q-btn flat label="Annuler" @click="editDialog = false" color="grey-7" />
            <q-btn label="Enregistrer" type="submit" color="primary" icon="save" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Dialog de détails du patient -->
    <q-dialog v-model="detailsDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 400px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="person" size="md" color="primary" class="q-mr-sm" />
          <div class="text-h6">Fiche Patient</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Informations personnelles</div>
          <div><strong>Nom :</strong> {{ selectedPatient1.nom }}</div>
          <div><strong>Prénom :</strong> {{ selectedPatient1.prenom }}</div>
          <div><strong>CIN :</strong> {{ selectedPatient1.cin || 'N/A' }}</div>
          <div><strong>Date de naissance :</strong> {{ selectedPatient1.date_naissance }}</div>
          <div><strong>Assuré :</strong> {{ selectedPatient1.est_assure ? 'Oui' : 'Non' }}</div>
          <div v-if="selectedPatient1.est_assure"><strong>Couverture sociale :</strong> {{ selectedPatient1.couverture_sociale }}</div>
          <div><strong>Téléphone :</strong> {{ selectedPatient1.telephone }}</div>
          <div><strong>Pays :</strong> {{ selectedPatient1.pays }}</div>
          <div><strong>Situation familiale :</strong> {{ selectedPatient1.situation_familiale }}</div>
          <div><strong>Nombre d'enfants :</strong> {{ selectedPatient1.nombre_enfants }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Facturation</div>
            <div>
              <div><strong>Montant total :</strong> {{ montantTotalFormate }}DH     <q-badge
                :label="facture?.statut"
                :color="facture?.statut === 'Réglé' ? 'green' : 'red'"
                class="q-ml-sm"
              /></div>


            </div>
            <div><strong>Montant payé :</strong> {{ montantPayeFormate }}dh</div>
            <div>
              <strong>Reste à payer :</strong>
              {{ resteAPayer }}DH
            </div>

        </q-card-section>


        <q-card-actions align="right">
          <q-btn flat label="Fermer" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
//import { useRouter } from 'vue-router'
import api from '../api'

interface Patient {
  id: number
  nom: string
  prenom: string
  date_naissance: string
  est_assure: boolean
  cin?: string
  couverture_sociale?: string
  telephone?: string
  pays?: string
  situation_familiale?: string
  nombre_enfants?: number
}

interface Facture {
  montant_total: number;
  montant_paye: number;
  statut?: string; // ajouté pour le statut de la facture
  // ajoute d'autres champs si besoin
}


//const router = useRouter()
const search = ref('')
const patients = ref<Patient[]>([])


const factureDialog = ref(false)
const selectedPatient = ref<Patient | null>(null)

const editDialog = ref(false)
const editedPatient = ref<Patient>({
  id: 0,
  nom: '',
  prenom: '',
  date_naissance: '',
  est_assure: false,
  couverture_sociale: '',
  telephone: '',
  pays: '',
  situation_familiale: '',
  nombre_enfants: 0
})

const detailsDialog = ref(false)
const selectedPatient1 = ref<Patient>({
  id: 0,
  nom: '',
  prenom: '',
  date_naissance: '',
  est_assure: false,
  couverture_sociale: '',
  telephone: '',
  pays: '',
  situation_familiale: '',
  nombre_enfants: 0
})

const factureData = ref({
  montant_total: null as number | null,
  montant_paye: null as number | null
})

const facture = ref<{
  montant_total: number;
  montant_paye: number;
  reste_a_payer: number;
  statut?: string; // ajouté pour le statut de la facture
} | null>(null)


const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', align: 'left' as const },
  { name: 'prenom', label: 'Prénom', field: 'prenom', align: 'left' as const },
  { name: 'cin', label: 'CIN', field: 'cin', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const }
]

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
    console.error('Erreur récupération patients :', err)
  }
}

const filteredPatients = computed(() =>
  patients.value.filter(p =>
    `${p.nom} ${p.prenom} ${p.cin}`.toLowerCase().includes(search.value.toLowerCase())
  )
)

const openFactureDialog = (patient: Patient) => {
  selectedPatient.value = patient
  factureDialog.value = true
}

const submitFacture = async () => {
  if (
    !selectedPatient.value ||
    factureData.value.montant_total === null ||
    factureData.value.montant_paye === null
  ) {
    return
  }

  try {
    const token = localStorage.getItem('token')
    await api.post('/factures', {
      patient_id: selectedPatient.value.id,
      montant_total: factureData.value.montant_total,
      montant_paye: factureData.value.montant_paye
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Réinitialiser et fermer
    factureDialog.value = false
    factureData.value = { montant_total: null, montant_paye: null }
  } catch (err) {
    console.error('Erreur lors de l’ajout de la facture :', err)
  }
}

const openEditDialog = (patient: Patient) => {
  editedPatient.value = { ...patient }  // Clonage pour ne pas modifier directement la table
  editDialog.value = true
}

const submitEdit = async () => {
  try {
    const token = localStorage.getItem('token')
    await api.put(`/patients/${editedPatient.value.id}`, editedPatient.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Rafraîchir la liste
    await fetchPatients()
    editDialog.value = false
  } catch (err) {
    console.error('Erreur modification patient :', err)
  }
}

//const factureTotals = ref<{ total_montant: number; total_paye: number } | null>(null);

const viewPatientDetails = async (patient: Patient) => {
  selectedPatient1.value = patient
  detailsDialog.value = true

  try {
    const token = localStorage.getItem('token')
    const response = await api.get(`/factures/patient/${patient.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const factures: Facture[] = response.data;

    if (factures.length > 0) {
      const montantTotal = factures.reduce((acc: number, f: Facture) => acc + Number(f.montant_total), 0);
      const montantPaye = factures.reduce((acc: number, f: Facture) => acc + Number(f.montant_paye), 0);
      const reste = montantTotal - montantPaye;

      facture.value = {
        montant_total: montantTotal,
        montant_paye: montantPaye,
        reste_a_payer: reste,
        statut: montantTotal === montantPaye ? 'Réglé' : 'Non réglé'
      };
    } else {
        facture.value = {
          montant_total: 0,
          montant_paye: 0,
          reste_a_payer: 0,
          statut: 'Non réglé'
        };
    }
      } catch (err) {
        console.error('Erreur récupération facture:', err)
        facture.value = {
          montant_total: 0,
          montant_paye: 0,
          reste_a_payer: 0
        }
      }
    }




// const generateCertificate = async (patient: Patient) => {
//   await router.push(`/patients/${patient.id}/certificat`)
// }

const montantTotalFormate = computed(() =>
  facture.value ? facture.value.montant_total.toFixed(2) : '0.00'
)

const montantPayeFormate = computed(() =>
  facture.value ? facture.value.montant_paye.toFixed(2) : '0.00'
)


const resteAPayer = computed(() => {
  if (
    facture.value &&
    facture.value.montant_total !== undefined &&
    facture.value.montant_paye !== undefined
  ) {
    return (facture.value.montant_total - facture.value.montant_paye).toFixed(2)
  }
  return '0.00'
})


onMounted(fetchPatients)
</script>
