<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mb-md shadow-2 rounded-borders bg-grey-1">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h5 text-primary q-mb-xs">
            <q-icon name="person" class="q-mr-sm" />
            {{ patient.nom }} {{ patient.prenom }}
          </div>
          <div class="text-body1">Âge : <span class="text-weight-medium">{{ patient.age }}</span></div>
          <div class="text-body1">Pays : {{ patient.pays }}</div>
          <div class="text-body1">Téléphone : {{ patient.telephone }}</div>
          <div class="text-body1">
            Assuré :
            <q-badge color="green" v-if="patient.assure">{{ patient.couverture_sociale || 'Oui' }}</q-badge>
            <q-badge color="red" v-else>Non</q-badge>
          </div>
        </div>
        <q-avatar size="80px" icon="badge" color="primary" text-color="white" />
      </div>
    </q-card>

    <q-card class="q-pa-md q-mb-md shadow-2 bg-grey-1">
      <div class="text-h6 text-deep-orange q-mb-md">
        <q-icon name="healing" class="q-mr-sm" />
        Allergies et Antécédents
      </div>
      <q-list v-if="allergies.length" bordered separator>
        <q-item v-for="a in allergies" :key="a.id">
          <q-item-section>
            <q-chip color="pink-3" text-color="black">{{ a.description }}</q-chip>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="text-grey-6">Aucune allergie renseignée.</div>
      <q-btn icon="add" label="Ajouter allergie" color="deep-orange" class="q-mt-sm" @click="dialogAllergie = true" />
    </q-card>

    <q-card class="q-pa-md q-mb-md shadow-2 bg-grey-1">
      <div class="text-h6 text-indigo q-mb-md">
        <q-icon name="engineering" class="q-mr-sm" />
        Services à Réaliser
      </div>
      <q-markup-table dense flat bordered v-if="services.length">
      <thead>
        <tr>
          <th class="text-center">Dents</th>
          <th class="text-center">Description</th>
          <th class="text-center">Tarif (€)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in services" :key="s.id">
          <td class="text-center text-weight-medium">{{ s.nom }}</td>
          <td class="text-center">{{ s.description || '-' }}</td>
          <td class="text-center text-positive">{{ s.tarif.toFixed(2) }}</td>
        </tr>
      </tbody>

      </q-markup-table>
      <div v-else class="text-grey-6">Aucun service renseigné.</div>
      <q-btn icon="add_circle" label="Ajouter service" color="indigo" class="q-mt-sm" @click="dialogService = true" />
    </q-card>
    <div class="text-right text-weight-bold q-mt-sm">
        Total des Services : {{ totalServices.toFixed(2) }} €
      </div>

    <q-card class="q-pa-md q-mb-md shadow-2 bg-grey-1">
      <div class="text-h6 text-teal q-mb-md">
        <q-icon name="local_hospital" class="q-mr-sm" />
        Traitements
      </div>
      <q-markup-table dense flat bordered v-if="traitements.length">
        <thead>
          <tr>
            <th class="text-center">Date</th>
            <th class="text-center">Note</th>
            <th class="text-center">Tarif (€)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in traitements" :key="t.id">
            <td class="text-center">{{ formatDate(t.date_traitement) }}</td>
            <td class="text-center">{{ t.note || '-' }}</td>
            <td class="text-center text-primary">{{ t.tarif ? t.tarif.toFixed(2) : '-' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <div v-else class="text-grey-6">Aucun traitement renseigné.</div>
      <q-btn icon="add_box" label="Ajouter traitement" color="teal" class="q-mt-sm" @click="dialogTraitement = true" />
    </q-card>




    <q-card v-if="facture" class="q-pa-md q-mb-md shadow-2 bg-grey-1">
      <div class="text-h6 text-grey-8 q-mb-sm">
        <q-icon name="receipt_long" class="q-mr-sm" />
        Facture du patient
        <q-badge v-if="facture.est_reglee" color="green" class="q-ml-sm">Réglée</q-badge>
      </div>
      <div class="q-mb-xs">Montant total : <strong>{{ Number(facture.montant_total).toFixed(2) }}        €</strong></div>
      <div class="q-mb-xs">Montant payé : <strong class="text-positive">{{ Number(facture.montant_paye).toFixed(2) }} €</strong></div>
      <div>
        Montant impayé :
        <strong :class="facture.montant_total - facture.montant_paye > 0 ? 'text-negative' : 'text-positive'">
          {{ Math.max(0, Number(facture.montant_total) - Number(facture.montant_paye)).toFixed(2) }} €
        </strong>
      </div>
    </q-card>


    <!-- Dialogues inchangés -->
<!-- Dialogues modernisés -->
<q-dialog v-model="dialogAllergie">
  <q-card class="rounded-borders q-pa-md shadow-4 bg-white" style="min-width: 350px;">
    <q-card-section class="row items-center q-pb-none">
      <q-icon name="healing" color="deep-orange" class="q-mr-sm" />
      <div class="text-h6 text-deep-orange">Nouvelle allergie</div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="newAllergie" label="Description" filled dense />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Annuler" color="grey" @click="dialogAllergie = false" />
      <q-btn label="Ajouter" color="deep-orange" unelevated @click="addAllergie" />
    </q-card-actions>
  </q-card>
</q-dialog>

<q-dialog v-model="dialogService">
  <q-card class="rounded-borders q-pa-md shadow-4 bg-white" style="min-width: 400px;">
    <q-card-section class="row items-center q-pb-none">
      <q-icon name="add_circle" color="indigo" class="q-mr-sm" />
      <div class="text-h6 text-indigo">Nouveau service</div>
    </q-card-section>
    <q-card-section>
      <q-input v-model="newService.nom" label="Nom" filled dense class="q-mb-sm" />
      <q-input v-model="newService.description" label="Description" type="textarea" filled dense class="q-mb-sm" />
      <q-input v-model="newService.tarif" label="Tarif (€)" type="number" filled dense />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Annuler" color="grey" @click="dialogService = false" />
      <q-btn label="Ajouter" color="indigo" unelevated @click="addService" />
    </q-card-actions>
  </q-card>
</q-dialog>

<q-dialog v-model="dialogTraitement">
  <q-card class="rounded-borders q-pa-md shadow-4 bg-white" style="min-width: 420px;">
    <q-card-section class="row items-center q-pb-none">
      <q-icon name="medical_services" color="teal" class="q-mr-sm" />
      <div class="text-h6 text-teal">Nouveau traitement</div>
    </q-card-section>
    <q-card-section>
    <q-input
      v-model="newTraitement.date"
      label="Date du traitement"
      filled
      dense
      readonly
      :rules="[val => !!val || 'Date requise']"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer" @click="dateMenu = true" />
      </template>
      <q-menu v-model="dateMenu" cover>
        <q-date v-model="newTraitement.date" mask="YYYY-MM-DD" minimal color="teal">
          <div class="row justify-end q-pa-sm">
            <q-btn label="OK" color="primary" flat v-close-popup />
          </div>
        </q-date>
      </q-menu>
    </q-input>
      <q-select
        v-model="newTraitement.medecin_id"
        :options="medecins.map(m => ({ label: m.nom + ' ' + m.prenom, value: m.id }))"
        label="Médecin"
        emit-value
        map-options
        filled
        dense
        clearable
        class="q-mb-sm"
      />
      <q-input v-model="newTraitement.note" label="Note" type="textarea" filled dense class="q-mb-sm" />
      <q-input v-model="newTraitement.tarif" label="Tarif (€)" type="number" filled dense />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Annuler" color="grey" @click="dialogTraitement = false" />
      <q-btn label="Ajouter" color="teal" unelevated @click="addTraitement" />
    </q-card-actions>
  </q-card>
</q-dialog>





  </q-page>
</template>



<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import api from '../api' // adapte ce chemin selon ton projet

// Interfaces typescript
interface Patient {
  id: number
  nom: string
  prenom: string
  age: number
  pays: string
  telephone: string
  assure: boolean
  couverture_sociale?: string
}

interface Service {
  id: number
  nom: string
  description?: string
  tarif: number
  patient_id?: number
}

interface Traitement {
  id: number
  patient_id?: number
  medecin_id?: number
  date_traitement: string
  note?: string
  tarif?: number
}

interface Allergie {
  id: number
  patient_id?: number
  description: string
}

interface Medecin {
  id: number
  nom: string
  prenom: string
}

interface Facture {
  id: number
  patient_id: number
  montant_total: number
  montant_paye: number
  est_reglee: boolean
  date_emission: string
}




// Récupérer l'id patient depuis la route
const route = useRoute()
const patientId = Number(route.params.id)

const dateMenu = ref(false)

// Références pour les données
const patient = ref<Patient>({
  id: 0,
  nom: '',
  prenom: '',
  age: 0,
  pays: '',
  telephone: '',
  assure: false,
  couverture_sociale: ''
})


const services = ref<Service[]>([])
const traitements = ref<Traitement[]>([])
const allergies = ref<Allergie[]>([])
const medecins = ref<Medecin[]>([])
const facture = ref<Facture | null>(null)

// Dialogues pour ajout
const dialogAllergie = ref(false)
const dialogService = ref(false)
const dialogTraitement = ref(false)

// Nouveaux éléments à créer
const newAllergie = ref('')
const newService = ref<{ nom: string; tarif: string; description: string }>({ nom: '', tarif: '', description: '' })
const newTraitement = ref<{ note: string; tarif: string; date: string; medecin_id: number | null }>({ note: '', tarif: '', date: '', medecin_id: null })

const schemaImageUrl = ref<string | null>(null)
//const dialogSchema = ref(false)


// Fonction format date simple (adapter si besoin)
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}



// Charger les données du patient et ses infos liées
async function fetchPatientData() {
  try {
    const response = await api.get(`/patients/${patientId}`)
    const data = response.data

    patient.value = {
      ...data,
      assure: data.est_assure,
    }
    services.value = data.services_a_realiser || []
    traitements.value = data.traitements || []
    allergies.value = data.allergies || []
  } catch (error) {
    console.error('Erreur lors du chargement des données', error)
  }
}

async function fetchMedecins() {
  try {
    const response = await api.get('/medecins')
    medecins.value = response.data
  } catch (error) {
    console.error('Erreur chargement médecins', error)
  }
}

async function fetchFacture() {
  try {
    const response = await api.get(`/factures/patient/${patientId}`);
    if (response.data.length) {
      facture.value = response.data[0];

    } else {
      // Crée la facture si elle n'existe pas
      const creation = await api.post('/factures', {
        patient_id: patientId,
        montant_total: totalTraitements.value,
        montant_paye: 0
      });
      facture.value = creation.data;
    }
  } catch (err) {
    console.error('Erreur chargement/création facture', err);
  }
}

// Récupère l'image au chargement
async function fetchSchemaImage() {
  try {
    const res = await api.get(`/schema-dentaire/patient/${patientId}`)
    schemaImageUrl.value = res.data.image_url
  } catch (err) {
    console.error('Erreur chargement schéma', err)
  }
}

// Après upload, recharge l'image et ferme le dialogue
// async function onSchemaUploaded() {
//   dialogSchema.value = false
//   await fetchSchemaImage()
// }



// Méthodes d'ajout (exemple simple)
async function addAllergie() {
  try {
    await api.post('/allergies', {
      patient_id: patientId,
      description: newAllergie.value
    })
    newAllergie.value = ''
    dialogAllergie.value = false
    await fetchPatientData()
  } catch (error) {
    console.error('Erreur ajout allergie', error)
  }
}

async function addService() {
  try {
    await api.post('/services', {
      patient_id: patientId,
      nom: newService.value.nom,
      description: newService.value.description,
      tarif: Number(newService.value.tarif)
    })
    newService.value = { nom: '', tarif: '', description: '' }
    dialogService.value = false
    await fetchPatientData()
  } catch (error) {
    console.error('Erreur ajout service', error)
  }
}


async function addTraitement() {
  if (!newTraitement.value.medecin_id) {
    alert('Veuillez choisir un médecin');
    return;
  }

  if (!newTraitement.value.date) {
    alert('Veuillez sélectionner une date de traitement');
    return;
  }

  if (
    newTraitement.value.tarif === '' ||
    isNaN(Number(newTraitement.value.tarif))
  ) {
    alert('Veuillez saisir un tarif valide');
    return;
  }

  try {
    await api.post('/traitements', {
      patient_id: patientId,
      medecin_id: newTraitement.value.medecin_id,
      note: newTraitement.value.note,
      tarif: Number(newTraitement.value.tarif),
      date_traitement: newTraitement.value.date
    });

    // Reset
    newTraitement.value = { note: '', tarif: '', date: '', medecin_id: null };
    dialogTraitement.value = false;
    await fetchPatientData();
  } catch (error) {
    console.error('Erreur ajout traitement', error);
  }
  await fetchPatientData();
  await fetchFacture(); // pour recalculer le montant_total automatiquement
}


const totalServices = computed(() =>
  services.value.reduce((sum, s) => sum + (s.tarif || 0), 0)
)

const totalTraitements = computed(() =>
  traitements.value.reduce((sum, t) => sum + (t.tarif || 0), 0)
)

watch(totalTraitements, async (newTotal) => {
  if (facture.value) {
    try {
      const newEstReglee = facture.value.montant_paye >= newTotal;

      await api.put(`/factures/${facture.value.id}`, {
        montant_total: newTotal,
        montant_paye: facture.value.montant_paye,
        est_reglee: newEstReglee
      });

      facture.value.montant_total = newTotal;
      facture.value.est_reglee = newEstReglee;
    } catch (err) {
      console.error('Erreur mise à jour facture', err);
    }
  }
});



// Chargement initial
onMounted(async () => {
  await fetchPatientData()
  await fetchMedecins()
  await fetchFacture()
  await fetchSchemaImage()

})
</script>
