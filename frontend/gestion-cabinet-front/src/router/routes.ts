import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  // },
  {
    path: '/',
    component: () => import('pages/LoginPage.vue'),

  }
,
{
  path: '/MedecinDashboard',
    component: () => import('layouts/MedecinLayout.vue'),
    children: [{ path: '', component: () => import('pages/MedecinDashboard.vue') }],
},

{
  path: '/patients',
    component: () => import('layouts/MedecinLayout.vue'),
    children: [{ path: '', component: () => import('pages/PatientsPage.vue') }],
},
{
  path: '/patients/add',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/AddPatientPage.vue') }],
},
{path: '/patients/:id',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/DossierMedical.vue') }],
},

{
  path: '/patients/:id/edit',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/PatientEdit.vue') }],
},
{
  path: '/rdv',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/RendezVousPage.vue') }],
},
{
  path: '/AssistanteDashboard',
  component: () => import('layouts/AssistanteLayout.vue'),
  children: [{ path: '', component: () => import('pages/AssistanteDashboard.vue') }],
},
{
  path: '/assistante/patients-tous',
  component: () => import('layouts/AssistanteLayout.vue'),
  children: [{ path: '', component: () => import('pages/TousLesPatientsPage.vue') }],
},
{
  path: '/assistante/patient-add',
  component: () => import('layouts/AssistanteLayout.vue'),
  children: [{ path: '', component: () => import('pages/AssistanteAddPatientPage.vue') }],
},
{
  path: '/assistante/agenda',
  component: () => import('layouts/AssistanteLayout.vue'),
  children: [{ path: '', component: () => import('pages/AssistanteRDV.vue') }],
},
{
  path: '/assistante/factures',
  component: () => import('layouts/AssistanteLayout.vue'),
  children: [{ path: '', component: () => import('pages/AddFacturePage.vue') }],
},
{
  path:'/assistante/comptabilite',
  component: () => import('layouts/AssistanteLayout.vue'),
  children: [{ path: '', component: () => import('pages/ComptabilitePage.vue') }],
},
{
  path: '/comptabilite',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/ComptabilitePageMedecin.vue') }],
},
{
  path: '/comptabiliteMedecin',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/ComptabilitePatientsMedecin.vue') }],
},
{
  path:'/stock',
  component: () => import('layouts/MedecinLayout.vue'),
  children: [{ path: '', component: () => import('pages/StockPage.vue') }],
},
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
