-- Table des patients
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE NOT NULL,
  est_assure BOOLEAN DEFAULT false,
  pays VARCHAR(100),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des allergies
CREATE TABLE allergies (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  description TEXT NOT NULL
);

-- Table des médecins
CREATE TABLE medecins (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL
);

-- Table des services (types de traitements possibles)
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  tarif NUMERIC(10,2) NOT NULL
);

-- Table des traitements effectués
CREATE TABLE traitements (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  medecin_id INTEGER REFERENCES medecins(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  date_traitement DATE NOT NULL,
  note TEXT
);

-- Table des factures
CREATE TABLE factures (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  montant_total NUMERIC(10,2) NOT NULL,
  montant_paye NUMERIC(10,2) NOT NULL DEFAULT 0,
  est_reglee BOOLEAN GENERATED ALWAYS AS (montant_paye >= montant_total) STORED,
  date_emission TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rendez-vous
CREATE TABLE rendez_vous (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  date_rdv TIMESTAMP NOT NULL,
  motif TEXT,
  statut VARCHAR(50) DEFAULT 'prévu'  -- exemples: prévu, annulé, terminé
);

-- Table du schéma dentaire
CREATE TABLE schema_dentaire (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'  -- Données flexibles pour stocker état des dents
);
