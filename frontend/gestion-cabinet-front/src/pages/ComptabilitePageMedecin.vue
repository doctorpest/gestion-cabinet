<template>
  <q-page padding>
    <div class="q-mb-md flex justify-between items-center">
      <div><strong>Date :</strong> {{ dateAujourdhui }}</div>
      <q-btn label="Prévisualiser fiche" icon="visibility" color="primary" @click="dialogVisible = true" />
    </div>

    <q-table
      :rows="patientsAssures"
      :columns="colonnes"
      flat
      bordered
      row-key="id"
    />

    <div class="q-mt-md text-right">
      <strong>Total payé :</strong> {{ totalPaye.toFixed(2) }}DH
    </div>

    <!-- MODAL DE PRÉVISUALISATION -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 800px">
        <q-card-section>
          <div class="text-h6">Fiche de comptabilité – {{ dateAujourdhui }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-markup-table dense>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <!-- <th>Couverture sociale</th> -->
                <th>Montant payé</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in patientsAssures" :key="patient.id">
                <td>{{ patient.nom }}</td>
                <td>{{ patient.prenom }}</td>
                <!-- <td>{{ patient.couverture_sociale }}</td> -->
                <td>{{ Number(patient.montant_paye).toFixed(2) }}DH</td>
              </tr>
            </tbody>
          </q-markup-table>

          <div class="q-mt-md text-right">
            <strong>Total payé :</strong> {{ totalPaye.toFixed(2) }}DH
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Fermer" @click="dialogVisible = false" />
          <q-btn icon="print" label="Imprimer" color="primary" @click="genererPDF" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import headerImage from 'src/assets/headerImage'
import footerImage from 'src/assets/footerImage'

interface PatientAssure {
  id: number
  nom: string
  prenom: string
  couverture_sociale: string
  montant_paye: number
}

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number
  }
}

const patientsAssures = ref<PatientAssure[]>([])
const dialogVisible = ref(false)

const colonnes: {
  name: string
  label: string
  field: string | ((row: PatientAssure) => string)
  align?: 'left' | 'right' | 'center'
}[] = [
  { name: 'nom', label: 'Nom', field: 'nom', align: 'left' },
  { name: 'prenom', label: 'Prénom', field: 'prenom', align: 'left' },
  // { name: 'couverture_sociale', label: 'Couverture sociale', field: 'couverture_sociale', align: 'left' },
  {
    name: 'montant_paye',
    label: 'Montant payé',
    field: (row: PatientAssure) => `${Number(row.montant_paye).toFixed(2)}DH`,
    align: 'right'
  }
]

const dateAujourdhui = new Date().toLocaleDateString('fr-FR')

onMounted(async () => {
  try {
    const response = await api.get<PatientAssure[]>('/patients/assures')
    patientsAssures.value = response.data.map(p => ({
      ...p,
      montant_paye: Number(p.montant_paye) || 0
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des patients assurés', error)
  }
})

const totalPaye = computed(() =>
  patientsAssures.value.reduce((acc, p) => acc + (p.montant_paye || 0), 0)
)

function genererPDF() {
  const doc = new jsPDF() as jsPDFWithAutoTable
  // 1. En-tête image
  doc.addImage(headerImage, 'PNG', 10, 5, 190, 25)


  //doc.text(`Fiche de Comptabilité – ${dateAujourdhui}`, 14, 15)
  // 2. Titre centré sous l’en-tête
  const titre = `Fiche de Comptabilité – ${dateAujourdhui}`
  const pageWidth = doc.internal.pageSize.getWidth()
  const textWidth = doc.getTextWidth(titre)
  const centerX = (pageWidth - textWidth) / 2
  doc.text(titre, centerX, 50) // Position verticale sous l’en-tête


  autoTable(doc, {
    startY: 70,
    head: [['Nom', 'Prénom', 'Montant payé']],
    body: patientsAssures.value.map(p => [
      p.nom,
      p.prenom,
      `${Number(p.montant_paye).toFixed(2)}DH`
    ])
  })

  const finalY = doc.lastAutoTable?.finalY || 50
  doc.text(`Total payé : ${totalPaye.value.toFixed(2)}DH`, 14, finalY + 10)

    // 5. Pied de page image
  doc.addImage(footerImage, 'PNG', 10, 275, 190, 15)
  doc.save(`comptabilite_${dateAujourdhui}.pdf`)
}
</script>

