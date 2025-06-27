<template>
  <q-page padding>
    <div class="text-center text-h6 q-mb-md">
      {{ today }}
    </div>

    <div class="row items-center q-mb-md">
      <q-input
        filled
        v-model="search"
        placeholder="Rechercher un produit..."
        class="col"
        debounce="300"
        clearable
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        label="Ajouter un produit"
        icon="add"
        color="primary"
        class="q-ml-md"
        @click="dialog = true"
      />
    </div>

    <q-table
      :rows="filteredProduits"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="q-mt-md custom-table"
    >
      <!-- Formattage personnalisé pour la colonne date_achat -->
      <template #body-cell-date_achat="props">
        <q-td>
          {{ formatDate(props.row.date_achat) }}
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td class="q-gutter-xs">
          <q-btn icon="add" color="positive" flat round @click="incrementStock(props.row)" />
          <q-btn icon="remove" color="negative" flat round @click="decrementStock(props.row)" />
        </q-td>
      </template>
    </q-table>
  </q-page>

  <!-- Dialog pour ajouter un produit -->
  <q-dialog v-model="dialog" persistent>
    <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px;">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Ajouter un produit</div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-md column">
          <q-input
            filled
            v-model="newProduit.nom_produit"
            label="Nom du produit"
            lazy-rules
            :rules="[val => !!val || 'Champ requis']"
          />
          <q-input
            filled
            v-model="newProduit.fournisseur"
            label="Fournisseur"
            lazy-rules
            :rules="[val => !!val || 'Champ requis']"
          />
          <q-input
            filled
            v-model.number="newProduit.stock"
            label="Stock"
            type="number"
            min="0"
            lazy-rules
            :rules="[val => val >= 0 || 'Doit être >= 0']"
          />
          <q-input
            filled
            v-model.number="newProduit.prix_unitaire"
            label="Prix unitaire (dh)"
            type="number"
            min="0"
            step="0.01"
            lazy-rules
            :rules="[val => val >= 0 || 'Doit être >= 0']"
          />
          <!-- Champ de date -->
          <q-input filled v-model="stockData.dateEntree" label="Date d'entrée" readonly>
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="stockData.dateEntree" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Annuler" color="primary" v-close-popup @click="resetForm()" />
        <q-btn flat label="Ajouter" color="primary" @click="addProduit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import api from '../api'
import type { QTableColumn } from 'quasar'

const today = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date())

interface Produit {
  id: number
  nom_produit: string
  fournisseur: string
  date_achat: string
  stock: number
  prix_unitaire: number
}

const search = ref('')
const produits = ref<Produit[]>([])
const dialog = ref(false)

const newProduit = ref({
  nom_produit: '',
  fournisseur: '',
  date_achat: '',
  stock: 0,
  prix_unitaire: 0,
})

const columns: QTableColumn[] = [
  // { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'nom_produit', label: 'Nom du produit', field: 'nom_produit', align: 'center' },
  { name: 'fournisseur', label: 'Fournisseur', field: 'fournisseur', align: 'center' },
  { name: 'date_achat', label: 'Date d\'achat', field: 'date_achat', align: 'center' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center' },
  { name: 'prix_unitaire', label: 'Prix unitaire (dh)', field: 'prix_unitaire', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const filteredProduits = computed(() =>
  produits.value.filter(p =>
    p.nom_produit.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(fetchProduits)

async function fetchProduits() {
  try {
    const response = await api.get('/stock')
    produits.value = response.data
  } catch (err) {
    console.error('Erreur fetchProduits:', err)
  }
}

async function updateProduit(produit: Produit) {
  try {
    await api.put(`/stock/${produit.id}`, {
      nom_produit: produit.nom_produit,
      fournisseur: produit.fournisseur,
      stock: produit.stock,
      prix_unitaire: produit.prix_unitaire,
    })
  } catch (err) {
    console.error('Erreur updateProduit:', err)
  }
}

async function incrementStock(produit: Produit) {
  produit.stock++
  await updateProduit(produit)
}

async function decrementStock(produit: Produit) {
  if (produit.stock > 0) {
    produit.stock--
    await updateProduit(produit)
  }
}

function getTodayDateISO() {
  return new Date().toISOString().slice(0, 10)
}
function resetForm() {
  newProduit.value = {
    nom_produit: '',
    fournisseur: '',
    date_achat: getTodayDateISO(),
    stock: 0,
    prix_unitaire: 0,
  }
}

const stockData = ref({
  dateEntree: new Date().toISOString().substr(0, 10), // valeur par défaut = aujourd'hui
  // autres champs de ton stock
})


async function addProduit() {
  if (!newProduit.value.nom_produit || !newProduit.value.fournisseur || !newProduit.value.date_achat) {
    alert('Veuillez remplir tous les champs requis.')
    return
  }
  try {
    const response = await api.post('/stock', newProduit.value)
    produits.value.unshift(response.data)
    dialog.value = false
    resetForm()
  } catch (err) {
    console.error('Erreur addProduit:', err)
    alert('Erreur lors de l\'ajout du produit')
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR')
}


watch(dialog, (val) => {
  if (val) {
    resetForm()
  }
})

</script>

<style>
.custom-table .q-table__container {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  text-align: center;
}

.custom-table td {
  text-align: center;
  vertical-align: middle;
  height: 50px;
  font-size: 15px;
}
</style>
