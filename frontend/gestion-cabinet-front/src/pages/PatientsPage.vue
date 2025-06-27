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

      <q-btn
        label="Ajouter un patient"
        icon="person_add"
        color="primary"
        class="q-ml-md"
        @click="router.push('/patients/add')"
      />
    </div>

    <q-table
      :rows="filteredPatients"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="q-mt-md"
      @row-click="goToPatient"
    >
    <template #body-cell-actions="props">
      <q-td class="q-gutter-xs">
        <q-btn
          flat
          round
          icon="edit"
          color="primary"
          @click.stop="editPatient(props.row)"
          title="Modifier"
        />
        <q-btn
          flat
          round
          icon="description"
          color="secondary"
          @click.stop="openCertificatDialog(props.row)"
          title="Certificat médical"
        />
        <q-btn
          flat
          round
          icon="local_pharmacy"
          color="accent"
          @click.stop="openPrescriptionDialog(props.row)"
          title="Ordonnance"
        />
      </q-td>
    </template>
    </q-table>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Nouvelle ordonnance</div>
          <div class="text-subtitle2">Patient : {{ selectedPatient?.nom }} {{ selectedPatient?.prenom }}</div>
        </q-card-section>

        <q-card-section>
          <q-select
            filled
            v-model="medicamentSearch"
            use-input
            hide-selected
            fill-input
            input-debounce="300"
            label="Ajouter un médicament"
            :options="filteredMedicaments"
            @update:model-value="handleMedicamentSelect"
            new-value-mode="add"
            emit-value
            map-options
          />

          <div v-for="(medoc, index) in ordonnanceMedicaments" :key="index" class="q-my-md">
            <div class="row items-center q-gutter-sm">
              <div class="col">{{ medoc.nom }}</div>
              <q-input v-model="medoc.dosage" label="Dosage" class="col" filled dense />
              <q-input v-model="medoc.duree" label="Durée" class="col" filled dense />
              <q-btn icon="delete" flat round color="negative" @click="removeMedicament(index)" />
            </div>
          </div>
        </q-card-section>

        <q-markup-table flat bordered class="q-mt-md">
          <thead>
            <tr>
              <th>Médicament</th>
              <th>Dosage</th>
              <th>Durée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(medoc, index) in ordonnanceMedicaments" :key="index">
              <td>{{ medoc.nom }}</td>
              <td>
                <q-input v-model="medoc.dosage" dense filled placeholder="ex: 500mg" />
              </td>
              <td>
                <q-input v-model="medoc.duree" dense filled placeholder="ex: 7 jours" />
              </td>
              <td>
                <q-btn flat icon="delete" color="negative" @click="removeMedicament(index)" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Visualiser ordonnance" color="primary" @click="visualiserOrdonnance" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showOrdonnancePreview" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Ordonnance</div>
          <div>{{ new Date().toLocaleDateString() }}</div>
          <div class="q-mt-sm">Patient : {{ selectedPatient?.nom }} {{ selectedPatient?.prenom }}</div>
        </q-card-section>

        <q-card-section>re
          <div v-for="medoc in ordonnanceMedicaments" :key="medoc.nom">
            <strong>{{ medoc.nom }} :</strong><br />
            {{ medoc.dosage }} x {{ medoc.duree }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fermer" v-close-popup />
          <q-btn flat label="Imprimer / PDF" color="primary" @click="exportPDF" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCertificatDialog" persistent>
      <q-card style="min-width: 600px; max-width: 700px;">
        <q-card-section>
          <div class="text-h6">Certificat Médical</div>
          <div class="text-subtitle2">Patient : {{ selectedPatient?.nom }} {{ selectedPatient?.prenom }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            filled
            v-model="selectedMedecin"
            :options="medecinsList.map(m => ({ label: m.prenom + ' ' + m.nom, value: m.id }))"
            label="Médecin"
            emit-value
            map-options
          />

          <q-input filled v-model="certificatData.dateCertificat" label="Date du certificat" readonly>
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="certificatData.dateCertificat" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input filled v-model="certificatData.nbJours" type="number" label="Nombre de jours d'arrêt" />

          <div class="row q-gutter-sm">
            <q-input filled v-model="certificatData.arretDu" label="Du" readonly>
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="certificatData.arretDu" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="certificatData.arretAu" label="Au" readonly>
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="certificatData.arretAu" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <q-input filled v-model="certificatData.nbJoursProlongation" type="number" label="Nombre de jours de prolongation" />

          <div class="row q-gutter-sm">
            <q-input filled v-model="certificatData.prolongationDu" label="Du" readonly>
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="certificatData.prolongationDu" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input filled v-model="certificatData.prolongationAu" label="Au" readonly>
              <template #append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="certificatData.prolongationAu" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Visualiser le certificat" color="primary" @click="visualiserCertificat" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCertificatPreview" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Prévisualisation Certificat Médical</div>
          <div>Date : {{ formatDate(certificatData.dateCertificat) || '......' }}</div>
          <div class="q-mt-sm">Patient : {{ selectedPatient?.nom }} {{ selectedPatient?.prenom }}</div>
          <div class="q-mt-sm">Médecin : {{ selectedMedecinLabel }}</div>
        </q-card-section>

        <q-card-section>
          <p>Arrêt de travail : {{ certificatData.nbJours || '......' }} jours</p>
          <p>Du : {{ formatDate(certificatData.arretDu) || '......' }} au {{ formatDate(certificatData.arretAu) || '......' }}</p>
          <p>Prolongation : {{ certificatData.nbJoursProlongation || '......' }} jours</p>
          <p>Du : {{ formatDate(certificatData.prolongationDu) || '......' }} au {{ formatDate(certificatData.prolongationAu) || '......' }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn flat label="Imprimer / PDF" color="primary" @click="imprimerCertificat" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
//import axios from 'axios'
import api from '../api'
import jsPDF from 'jspdf'
import headerImage from '../assets/headerImage.js'
import footerImage from '../assets/footerImage'


interface Patient {
  id: number
  nom: string
  prenom: string
  [key: string]: unknown
}

interface Medicament {
  nom: string
  dosage?: string
  duree?: string
}

interface MedicamentFromApi {
  id: number
  nom: string
  dosage: string
  duree: string
}

interface Medecin {
  id: number
  nom: string
  prenom: string
}

const router = useRouter()
const search = ref('')
const patients = ref<Patient[]>([])
//const medicaments = ref<string[]>([])
const selectedPatient = ref<Patient | null>(null)
const ordonnanceMedicaments = ref<Medicament[]>([])
const medicamentSearch = ref('')
const showDialog = ref(false)
const showOrdonnancePreview = ref(false)

const allMedicaments = ref<MedicamentFromApi[]>([])
const medicamentOptions = ref<{ label: string; value: string }[]>([])
const medecinsList = ref<Medecin[]>([])
const showCertificatDialog = ref(false)
const showCertificatPreview = ref(false)

const certificatData = ref({
  dateCertificat: new Date().toISOString().substr(0, 10),
  nbJours: '',
  arretDu: '',
  arretAu: '',
  nbJoursProlongation: '',
  prolongationDu: '',
  prolongationAu: ''
})

const selectedMedecin = ref<number | null>(null)

const columns = [
  { name: 'nom', label: 'Nom', field: 'nom', align: 'left' as const },
  { name: 'prenom', label: 'Prénom', field: 'prenom', align: 'left' as const },
  { name: 'actions', label: '', field: 'actions', align: 'right' as const }
]

function formatDate(dateStr: string): string {
  if (!dateStr) return '......';
  const date = new Date(dateStr);
  const jour = String(date.getDate()).padStart(2, '0');
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();
  return `${jour}/${mois}/${annee}`;
}

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

const filteredPatients = computed(() =>
  patients.value.filter(p =>
    `${p.nom} ${p.prenom}`.toLowerCase().includes(search.value.toLowerCase())
  )
)

const fetchMedicaments = async () => {
  try {
    const res = await api.get('/medicaments')
    allMedicaments.value = res.data
    medicamentOptions.value = res.data.map((m: MedicamentFromApi) => ({
      label: m.nom,
      value: m.nom
    }))
  } catch (err) {
    console.error('Erreur medicaments:', err)
  }
}

const fetchMedecins = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get('/medecins', {
      headers: { Authorization: `Bearer ${token}` }
    })
    medecinsList.value = response.data // pur et simple
  } catch (error) {
    console.error('Erreur lors du chargement des médecins :', error)
  }
}

const filteredMedicaments = computed(() => {
  const term = medicamentSearch.value.toLowerCase()
  return medicamentOptions.value.filter(opt =>
    opt.label.toLowerCase().includes(term)
  )
})



const openPrescriptionDialog = (patient: Patient) => {
  selectedPatient.value = patient
  ordonnanceMedicaments.value = []
  showDialog.value = true
}

const openCertificatDialog = (patient: Patient) => {
  selectedPatient.value = patient
  showCertificatDialog.value = true
}

const handleMedicamentSelect = (nom: string) => {
  const existing = ordonnanceMedicaments.value.find(m => m.nom === nom)
  if (existing) return

  const med = allMedicaments.value.find(m => m.nom === nom)
  if (med) {
    ordonnanceMedicaments.value.push({
      nom: med.nom,
      dosage: med.dosage,
      duree: med.duree
    })
  } else {
    ordonnanceMedicaments.value.push({
      nom,
      dosage: '',
      duree: ''
    })
  }

  medicamentSearch.value = ''
}

const removeMedicament = (index: number) => {
  ordonnanceMedicaments.value.splice(index, 1)
}

const visualiserOrdonnance = () => {
  if (ordonnanceMedicaments.value.length === 0) {
    alert('Ajoutez au moins un médicament.')
    return
  }
  showDialog.value = false
  showOrdonnancePreview.value = true
}

const selectedMedecinLabel = computed(() => {
  const med = medecinsList.value.find(m => m.id === selectedMedecin.value)
  return med ? `${med.prenom} ${med.nom}` : 'Médecin non sélectionné'
})

const visualiserCertificat = () => {
  if (!selectedPatient.value || !selectedMedecin.value) {
    alert("Veuillez sélectionner un patient et un médecin.");
    return;
  }

  showCertificatDialog.value = false;
  showCertificatPreview.value = true;
}

// const visualiserCertificatPDF = () => {
//   const doc = new jsPDF()
//   doc.setFontSize(12)

//   const patient = selectedPatient.value
//   const medecin = medecinsList.value.find(m => m.id === selectedMedecin.value)
//   const d = certificatData.value

//   doc.text(`Salé le: ${formatDate(d.dateCertificat)}`, 105, 20, { align: 'center' })
//   doc.setFontSize(16)
//   doc.text('Certificat Médical', 105, 30, { align: 'center' })
//   doc.setFontSize(12)

//   let y = 50
//   doc.text(`Je soussigné Dr. ${medecin ? medecin.prenom + ' ' + medecin.nom : '.........................................'},`, 10, y)
//   y += 15
//   doc.text(`Certifie que l'état de santé de : ${patient ? patient.nom + ' ' + patient.prenom : '.........................................'}`, 10, y)
//   y += 15
//   doc.text(`1- Nécessite un arrêt de travail de ${d.nbJours || '.........................................'} jours`, 10, y)
//   y += 15
//   doc.text(`Sauf complications, du ${formatDate(d.arretDu) || '.............'} au ${formatDate(d.arretAu) || '.............'} inclus.`, 10, y)
//   y += 15
//   doc.text(`2- Nécessite une prolongation d'arrêt de travail de ${d.nbJoursProlongation || '.........................................'} jours`, 10, y)
//   y += 15
//   doc.text(`Sauf complications, du ${formatDate(d.arretDu) || '.............'} au ${formatDate(d.arretAu) || '.............'} inclus.`, 10, y)
//   y += 25
//   doc.text(`Ce certificat est délivré à l'intéressé pour servir et valoir ce que de droit.`, 105, y, { align: 'center' })
//   y += 25
//   doc.text('Signature', 160, y)

//   doc.save('certificat-medical.pdf')
// }

const visualiserCertificatPDF = () => {
  const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a5'
  });
  doc.setFontSize(12)

  // 1. Ajout de l'image en tête

  doc.addImage(headerImage, 'PNG', 10, 5, 128, 20) // largeur réduite à ~90% du A5

  const patient = selectedPatient.value
  const medecin = medecinsList.value.find(m => m.id === selectedMedecin.value)
  const d = certificatData.value

  // 2. Laisse de la place après l'image
  doc.setFontSize(16)
  let y = 40
  doc.text('Certificat Médical', 74, y, { align: 'center' })

  y += 10
  doc.setFontSize(12)
  doc.text(`Salé le: ${formatDate(d.dateCertificat)}`, 74, y, { align: 'center' })
  y += 12
  doc.setFontSize(10)

  y += 12
  doc.text(`Je soussigné Dr. ${medecin ? medecin.prenom + ' ' + medecin.nom : '.........................................'},`, 10, y)
  y += 8
  doc.text(`Certifie que l'état de santé de : ${patient ? patient.nom + ' ' + patient.prenom : '.........................................'}`, 10, y)
  y += 8
  doc.text(`1- Nécessite un arrêt de travail de ${d.nbJours || '.........................................'} jours`, 10, y)
  y += 8
  doc.text(`Sauf complications, du ${formatDate(d.arretDu) || '.............'} au ${formatDate(d.arretAu) || '.............'} inclus.`, 10, y)
  y += 8
  doc.text(`2- Nécessite une prolongation d'arrêt de travail de ${d.nbJoursProlongation || '.........................................'} jours`, 10, y)
  y += 8
  doc.text(`Sauf complications, du ${formatDate(d.arretDu) || '.............'} au ${formatDate(d.arretAu) || '.............'} inclus.`, 10, y)
  y += 12
  doc.text(`Ce certificat est délivré à l'intéressé pour servir et valoir ce que de droit.`, 74, y, { align: 'center' })
  y += 20
  doc.text('Signature', 120, y)

  // 3. Footer texte simple

  doc.addImage(footerImage, 'PNG', 10, 190, 128, 10)


  // 🔥 Impression automatique
  doc.autoPrint();

  const blob = doc.output('blob');
  const blobURL = URL.createObjectURL(blob);
  const printWindow = window.open(blobURL, '_blank');

  if (printWindow) {
    printWindow.focus();
  } else {
    alert("Impossible d'ouvrir le PDF dans une nouvelle fenêtre. Vérifiez votre bloqueur de pop-ups.");
  }
  // doc.save('certificat-medical.pdf')
};

// const visualiserCertificatPDF = () => {
//   const doc = new jsPDF({
//   orientation: 'portrait',
//   unit: 'mm',
//   format: 'a5'
//   });
//   doc.setFontSize(12)

//   // 1. Ajout de l'image en tête

//   doc.addImage(headerImage, 'PNG', 10, 5, 128, 20) // largeur réduite à ~90% du A5

//   const patient = selectedPatient.value
//   const medecin = medecinsList.value.find(m => m.id === selectedMedecin.value)
//   const d = certificatData.value

//   // 2. Laisse de la place après l'image
//   doc.setFontSize(16)
//   let y = 40
//   doc.text('Certificat Médical', 74, y, { align: 'center' })

//   y += 10
//   doc.setFontSize(12)
//   doc.text(`Salé le: ${formatDate(d.dateCertificat)}`, 74, y, { align: 'center' })
//   y += 12
//   doc.setFontSize(10)

//   y += 12
//   doc.text(`Je soussigné Dr. ${medecin ? medecin.prenom + ' ' + medecin.nom : '.........................................'},`, 10, y)
//   y += 8
//   doc.text(`Certifie que l'état de santé de : ${patient ? patient.nom + ' ' + patient.prenom : '.........................................'}`, 10, y)
//   y += 8
//   doc.text(`1- Nécessite un arrêt de travail de ${d.nbJours || '.........................................'} jours`, 10, y)
//   y += 8
//   doc.text(`Sauf complications, du ${formatDate(d.arretDu) || '.............'} au ${formatDate(d.arretAu) || '.............'} inclus.`, 10, y)
//   y += 8
//   doc.text(`2- Nécessite une prolongation d'arrêt de travail de ${d.nbJoursProlongation || '.........................................'} jours`, 10, y)
//   y += 8
//   doc.text(`Sauf complications, du ${formatDate(d.arretDu) || '.............'} au ${formatDate(d.arretAu) || '.............'} inclus.`, 10, y)
//   y += 12
//   doc.text(`Ce certificat est délivré à l'intéressé pour servir et valoir ce que de droit.`, 74, y, { align: 'center' })
//   y += 20
//   doc.text('Signature', 120, y)

//   // 3. Footer texte simple

//   doc.addImage(footerImage, 'PNG', 10, 190, 128, 10)


//   // 🔥 Impression automatique
//   doc.autoPrint();

//   const blob = doc.output('blob');
//   const blobURL = URL.createObjectURL(blob);
//   const printWindow = window.open(blobURL, '_blank');

//   if (printWindow) {
//     printWindow.focus();
//   } else {
//     alert("Impossible d'ouvrir le PDF dans une nouvelle fenêtre. Vérifiez votre bloqueur de pop-ups.");
//   }
//   // doc.save('certificat-medical.pdf')
// };

const imprimerCertificat = () => {
  showCertificatPreview.value = false
  visualiserCertificatPDF() // Appelle ici ta fonction jsPDF (renomme si nécessaire)
}

// const exportPDF = () => {
//   const doc = new jsPDF()

//   doc.addImage(headerImage, 'PNG', 10, 5, 190, 25) // (x, y, width, height)

//   doc.text(`Ordonnance - ${new Date().toLocaleDateString()}`, 10, 10)
//   doc.text(`Patient: ${selectedPatient.value?.nom} ${selectedPatient.value?.prenom}`, 10, 20)

//   let y = 30
//   for (const m of ordonnanceMedicaments.value) {
//     doc.text(`${m.nom}: ${m.dosage} x ${m.duree}`, 10, y)
//     y += 10
//   }

//   doc.addImage(footerImage, 'PNG', 10, 275, 190, 15) // x, y, width, height

//   doc.save('ordonnance.pdf')
// }

// const exportPDF = () => {
//   const doc = new jsPDF({
//   orientation: 'portrait',
//   unit: 'mm',
//   format: 'a5' // <- Le point crucial
// });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();

//   // 1. En-tête image
//   doc.addImage(headerImage, 'PNG', 10, 5, 128, 20);

//   let y = 40;

//   // 2. Titre centré
//   doc.setFont('Helvetica', 'bold');
//   doc.setFontSize(16);
//   doc.text('ORDONNANCE', pageWidth / 2, y, { align: 'center' });
//   y += 12;

//   // 3. Date centrée
//   doc.setFont('Helvetica', 'normal');
//   doc.setFontSize(12);
//   const date = new Date().toLocaleDateString();
//   doc.text(`Salé Le ${date}`, pageWidth / 2, y, { align: 'center' });
//   y += 15;

//   // 4. Infos patient
//   if (selectedPatient.value) {
//   doc.text(
//     `Patient : ${selectedPatient.value.nom} ${selectedPatient.value.prenom}`,
//     pageWidth / 2,
//     y,
//     { align: 'center' }
//   );
//   y += 10;
// }


//   // 5. Médicaments
//   doc.setFont('Helvetica', 'bold');
//   doc.text('Prescription :', 20, y);
//   y += 10;

//   doc.setFont('Helvetica', 'normal');
//   if (ordonnanceMedicaments.value.length > 0) {
//     ordonnanceMedicaments.value.forEach((medoc, index) => {
//       const nom = medoc.nom || 'Nom inconnu';
//       const dosage = medoc.dosage || '......';
//       const duree = medoc.duree || '......';

//       doc.text(`${index + 1}. ${nom}`, 25, y);
//       y += 7;
//       doc.text(`   - Dosage : ${dosage}`, 30, y);
//       y += 6;
//       doc.text(`   - Durée : ${duree}`, 30, y);
//       y += 10;

//       // Saut de page si on dépasse
//       if (y > pageHeight - 40) {
//         doc.addPage();
//         y = 35;
//         doc.addImage(headerImage, 'PNG', 10, 5, 128, 20);
//         y += 40;
//       }
//     });
//   } else {
//     doc.text('Aucun médicament prescrit.', 25, y);
//     y += 10;
//   }

//   // 6. Pied de page image
//   doc.addImage(footerImage, 'PNG', 10, 190, 128, 10);

//   // 7. Enregistrement
//   // const nomFichier = `ordonnance_${selectedPatient.value?.nom || 'patient'}.pdf`;
//   // doc.save(nomFichier);
//   // 2. Lancer l'impression automatiquement
//   doc.autoPrint();

//   // 3. Ouvrir dans une nouvelle fenêtre pour impression
//   const pdfBlob = doc.output('blob');
//   const pdfUrl = URL.createObjectURL(pdfBlob);
//   const printWindow = window.open(pdfUrl, '_blank');
//   if (printWindow) {
//     printWindow.focus();
//   }
// };

const exportPDF = () => {
  const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a5' // <- Le point crucial
});

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. En-tête image
  doc.addImage(headerImage, 'PNG', 10, 5, 128, 20);

  let y = 40;

  // 2. Titre centré
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ORDONNANCE', pageWidth / 2, y, { align: 'center' });
  y += 12;

  // 3. Date centrée
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  const date = new Date().toLocaleDateString();
  doc.text(`Salé Le ${date}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  // 4. Infos patient
  if (selectedPatient.value) {
  doc.text(
    `Patient : ${selectedPatient.value.nom} ${selectedPatient.value.prenom}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 10;
}


  // 5. Médicaments
  doc.setFont('Helvetica', 'bold');
  doc.text('Prescription :', 20, y);
  y += 10;

  doc.setFont('Helvetica', 'normal');
  if (ordonnanceMedicaments.value.length > 0) {
    ordonnanceMedicaments.value.forEach((medoc, index) => {
      const nom = medoc.nom || 'Nom inconnu';
      const dosage = medoc.dosage || '......';
      const duree = medoc.duree || '......';

      doc.text(`${index + 1}. ${nom}`, 25, y);
      y += 7;
      doc.text(`   - Dosage : ${dosage}`, 30, y);
      y += 6;
      doc.text(`   - Durée : ${duree}`, 30, y);
      y += 10;

      // Saut de page si on dépasse
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 35;
        doc.addImage(headerImage, 'PNG', 10, 5, 128, 20);
        y += 40;
      }
    });
  } else {
    doc.text('Aucun médicament prescrit.', 25, y);
    y += 10;
  }

  // 6. Pied de page image
  doc.addImage(footerImage, 'PNG', 10, 190, 128, 10);

  // 7. Enregistrement
  // const nomFichier = `ordonnance_${selectedPatient.value?.nom || 'patient'}.pdf`;
  // doc.save(nomFichier);
  // 2. Lancer l'impression automatiquement
  doc.autoPrint();

  // 3. Ouvrir dans une nouvelle fenêtre pour impression
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.focus();
  }
};


const goToPatient = async (_evt: Event, row: Patient) => {
  await router.push(`/patients/${row.id}`)
}

const editPatient = async (patient: Patient) => {
  await router.push(`/patients/${patient.id}/edit`)
}

// const generateCertificate = async (patient: Patient) => {
//   await router.push(`/patients/${patient.id}/certificat`)
// }

onMounted( async () => {
  await fetchPatients()
  await fetchMedicaments()
  await fetchMedecins()
})
</script>
