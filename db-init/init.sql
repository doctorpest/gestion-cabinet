--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: allergies; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.allergies (
    id integer NOT NULL,
    patient_id integer,
    description text NOT NULL
);


ALTER TABLE public.allergies OWNER TO doctorpest;

--
-- Name: allergies_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.allergies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.allergies_id_seq OWNER TO doctorpest;

--
-- Name: allergies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.allergies_id_seq OWNED BY public.allergies.id;


--
-- Name: certificats; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.certificats (
    id integer NOT NULL,
    patient_id integer,
    medecin_id integer,
    contenu text NOT NULL,
    date_certificat date DEFAULT CURRENT_DATE
);


ALTER TABLE public.certificats OWNER TO doctorpest;

--
-- Name: certificats_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.certificats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.certificats_id_seq OWNER TO doctorpest;

--
-- Name: certificats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.certificats_id_seq OWNED BY public.certificats.id;


--
-- Name: factures; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.factures (
    id integer NOT NULL,
    patient_id integer,
    montant_total numeric(10,2) NOT NULL,
    montant_paye numeric(10,2) DEFAULT 0 NOT NULL,
    est_reglee boolean GENERATED ALWAYS AS ((montant_paye >= montant_total)) STORED,
    date_emission timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.factures OWNER TO doctorpest;

--
-- Name: factures_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.factures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.factures_id_seq OWNER TO doctorpest;

--
-- Name: factures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.factures_id_seq OWNED BY public.factures.id;


--
-- Name: medecins; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.medecins (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL
);


ALTER TABLE public.medecins OWNER TO doctorpest;

--
-- Name: medecins_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.medecins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medecins_id_seq OWNER TO doctorpest;

--
-- Name: medecins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.medecins_id_seq OWNED BY public.medecins.id;


--
-- Name: medicaments; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.medicaments (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    dosage character varying(100),
    duree character varying(100)
);


ALTER TABLE public.medicaments OWNER TO doctorpest;

--
-- Name: medicaments_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.medicaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.medicaments_id_seq OWNER TO doctorpest;

--
-- Name: medicaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.medicaments_id_seq OWNED BY public.medicaments.id;


--
-- Name: ordonnance_medicaments; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.ordonnance_medicaments (
    id integer NOT NULL,
    ordonnance_id integer,
    medicament_id integer
);


ALTER TABLE public.ordonnance_medicaments OWNER TO doctorpest;

--
-- Name: ordonnance_medicaments_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.ordonnance_medicaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ordonnance_medicaments_id_seq OWNER TO doctorpest;

--
-- Name: ordonnance_medicaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.ordonnance_medicaments_id_seq OWNED BY public.ordonnance_medicaments.id;


--
-- Name: ordonnances; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.ordonnances (
    id integer NOT NULL,
    patient_id integer,
    medecin_id integer,
    date_prescription date DEFAULT CURRENT_DATE NOT NULL,
    remarque text
);


ALTER TABLE public.ordonnances OWNER TO doctorpest;

--
-- Name: ordonnances_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.ordonnances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ordonnances_id_seq OWNER TO doctorpest;

--
-- Name: ordonnances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.ordonnances_id_seq OWNED BY public.ordonnances.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    date_naissance date NOT NULL,
    est_assure boolean DEFAULT false,
    pays character varying(100),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    telephone character varying(20),
    situation_familiale character varying(50),
    nombre_enfants integer,
    couverture_sociale character varying(100),
    cin character varying(20)
);


ALTER TABLE public.patients OWNER TO doctorpest;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patients_id_seq OWNER TO doctorpest;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: rendez_vous; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.rendez_vous (
    id integer NOT NULL,
    patient_id integer,
    date_rdv timestamp without time zone NOT NULL,
    motif text,
    statut character varying(50) DEFAULT 'prévu'::character varying
);


ALTER TABLE public.rendez_vous OWNER TO doctorpest;

--
-- Name: rendez_vous_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.rendez_vous_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rendez_vous_id_seq OWNER TO doctorpest;

--
-- Name: rendez_vous_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.rendez_vous_id_seq OWNED BY public.rendez_vous.id;


--
-- Name: schema_dentaire; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.schema_dentaire (
    id integer NOT NULL,
    patient_id integer,
    image_url text,
    data jsonb
);


ALTER TABLE public.schema_dentaire OWNER TO doctorpest;

--
-- Name: schema_dentaire_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.schema_dentaire_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schema_dentaire_id_seq OWNER TO doctorpest;

--
-- Name: schema_dentaire_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.schema_dentaire_id_seq OWNED BY public.schema_dentaire.id;


--
-- Name: services_a_realiser; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.services_a_realiser (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    tarif numeric(10,2) NOT NULL,
    patient_id integer
);


ALTER TABLE public.services_a_realiser OWNER TO doctorpest;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.services_id_seq OWNER TO doctorpest;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services_a_realiser.id;


--
-- Name: stock_produits; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.stock_produits (
    id integer NOT NULL,
    nom_produit character varying(255) NOT NULL,
    fournisseur character varying(255),
    date_achat date DEFAULT CURRENT_DATE NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    prix_unitaire numeric(10,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE public.stock_produits OWNER TO doctorpest;

--
-- Name: stock_produits_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.stock_produits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_produits_id_seq OWNER TO doctorpest;

--
-- Name: stock_produits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.stock_produits_id_seq OWNED BY public.stock_produits.id;


--
-- Name: traitements; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.traitements (
    id integer NOT NULL,
    patient_id integer,
    medecin_id integer,
    date_traitement date NOT NULL,
    note text,
    tarif numeric(10,2)
);


ALTER TABLE public.traitements OWNER TO doctorpest;

--
-- Name: traitements_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.traitements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.traitements_id_seq OWNER TO doctorpest;

--
-- Name: traitements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.traitements_id_seq OWNED BY public.traitements.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(20) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['medecin'::character varying, 'assistante'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO doctorpest;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO doctorpest;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: doctorpest
--

CREATE TABLE public.utilisateurs (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utilisateurs OWNER TO doctorpest;

--
-- Name: utilisateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: doctorpest
--

CREATE SEQUENCE public.utilisateurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateurs_id_seq OWNER TO doctorpest;

--
-- Name: utilisateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doctorpest
--

ALTER SEQUENCE public.utilisateurs_id_seq OWNED BY public.utilisateurs.id;


--
-- Name: allergies id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.allergies ALTER COLUMN id SET DEFAULT nextval('public.allergies_id_seq'::regclass);


--
-- Name: certificats id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.certificats ALTER COLUMN id SET DEFAULT nextval('public.certificats_id_seq'::regclass);


--
-- Name: factures id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.factures ALTER COLUMN id SET DEFAULT nextval('public.factures_id_seq'::regclass);


--
-- Name: medecins id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.medecins ALTER COLUMN id SET DEFAULT nextval('public.medecins_id_seq'::regclass);


--
-- Name: medicaments id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.medicaments ALTER COLUMN id SET DEFAULT nextval('public.medicaments_id_seq'::regclass);


--
-- Name: ordonnance_medicaments id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnance_medicaments ALTER COLUMN id SET DEFAULT nextval('public.ordonnance_medicaments_id_seq'::regclass);


--
-- Name: ordonnances id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnances ALTER COLUMN id SET DEFAULT nextval('public.ordonnances_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: rendez_vous id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.rendez_vous ALTER COLUMN id SET DEFAULT nextval('public.rendez_vous_id_seq'::regclass);


--
-- Name: schema_dentaire id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.schema_dentaire ALTER COLUMN id SET DEFAULT nextval('public.schema_dentaire_id_seq'::regclass);


--
-- Name: services_a_realiser id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.services_a_realiser ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: stock_produits id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.stock_produits ALTER COLUMN id SET DEFAULT nextval('public.stock_produits_id_seq'::regclass);


--
-- Name: traitements id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.traitements ALTER COLUMN id SET DEFAULT nextval('public.traitements_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: utilisateurs id; Type: DEFAULT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id SET DEFAULT nextval('public.utilisateurs_id_seq'::regclass);


--
-- Data for Name: allergies; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.allergies (id, patient_id, description) FROM stdin;
2	2	Allergie au latex
3	5	Aspirine
4	5	ibuprofen
5	4	Allergie au Latex
6	5	Latex
7	8	Allergie au Latex
\.


--
-- Data for Name: certificats; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.certificats (id, patient_id, medecin_id, contenu, date_certificat) FROM stdin;
\.


--
-- Data for Name: factures; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.factures (id, patient_id, montant_total, montant_paye, date_emission) FROM stdin;
2	2	200.00	150.00	2025-05-31 20:30:51.957332
3	4	150.00	0.00	2025-06-05 01:49:48.591756
4	5	300.00	0.00	2025-06-05 01:59:08.968852
5	6	0.00	0.00	2025-06-07 00:34:57.505462
6	7	0.00	0.00	2025-06-07 01:15:03.014038
7	8	100.00	50.00	2025-06-07 02:08:34.895164
8	8	100.00	50.00	2025-06-07 02:09:32.638517
9	8	200.00	100.00	2025-06-07 02:10:52.998295
10	8	0.00	200.00	2025-06-11 01:35:56.839651
11	4	200.00	150.00	2025-06-11 01:41:38.20018
12	3	0.00	0.00	2025-06-12 00:47:01.030452
13	8	0.00	200.00	2025-06-14 17:42:45.10122
14	3	100.00	0.00	2025-06-14 17:44:05.867842
\.


--
-- Data for Name: medecins; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.medecins (id, nom, prenom) FROM stdin;
1	Dupont	Jean-Paul
\.


--
-- Data for Name: medicaments; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.medicaments (id, nom, dosage, duree) FROM stdin;
1	Doliprane 1g EFF	1cp 3x/jour	\N
2	Zamoz 1g	1cp 2x/jour	07j
3	Bi-Oragin	1cp 3x/jour, au milieu du repas	05j
\.


--
-- Data for Name: ordonnance_medicaments; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.ordonnance_medicaments (id, ordonnance_id, medicament_id) FROM stdin;
\.


--
-- Data for Name: ordonnances; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.ordonnances (id, patient_id, medecin_id, date_prescription, remarque) FROM stdin;
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.patients (id, nom, prenom, date_naissance, est_assure, pays, date_creation, telephone, situation_familiale, nombre_enfants, couverture_sociale, cin) FROM stdin;
2	Dupont	Jean	1980-04-10	t	France	2025-05-31 20:29:15.134557	\N	\N	\N	\N	\N
3	Buron	Marylise	1999-12-12	t	France	2025-06-04 00:03:55.081198	\N	\N	\N	\N	\N
4	Bros	Luigi	2000-04-05	t	Maroc	2025-06-04 00:42:27.387861	+212701099800	Célibataire	0	CNSS	\N
5	Bros	Mario	2000-03-03	t	France	2025-06-04 01:22:00.08496	+33123456789	Célibataire	0	ASS	\N
6	Maria	Lisa	2000-12-11	t	Maroc	2025-06-05 00:37:03.641567	+21267898632	Marié	1	CNSS	\N
7	Olly	Julli	1998-08-09	f	France	2025-06-07 01:15:00.420751	+339874744849	Célibataire	0	\N	\N
8	sombr	Clairo	1991-04-07	t	Maroc	2025-06-07 01:19:02.737104	+3395959333	Célibataire 	0	CNAM	\N
\.


--
-- Data for Name: rendez_vous; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.rendez_vous (id, patient_id, date_rdv, motif, statut) FROM stdin;
1	2	2025-06-10 10:00:00	Contrôle annuel	prévu
3	2	2025-10-12 00:55:00	Contôle	prévu
4	4	2025-07-07 12:30:00	Contrôle 	prévu
5	6	2025-12-12 00:00:00	Traitement	prévu
6	3	2025-07-08 15:00:00	Traitement	prévu
7	6	2025-06-07 08:00:00	Contrôle annuel	prévu
8	7	2025-06-07 14:00:00	Traitements 	prévu
9	7	2025-06-11 13:00:00	Contrôle	prévu
10	5	2025-06-14 12:00:00	Traitements 	prévu
\.


--
-- Data for Name: schema_dentaire; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.schema_dentaire (id, patient_id, image_url, data) FROM stdin;
1	2	\N	\N
2	8	/uploads/schemas/schema_1749681349656.png	\N
3	3	/uploads/schemas/schema_1749682222027.png	\N
\.


--
-- Data for Name: services_a_realiser; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.services_a_realiser (id, nom, description, tarif, patient_id) FROM stdin;
1	Détartrage	Nettoyage complet des dents	50.00	\N
2	Dents 41	Nettoyage complet des dents	50.00	2
3	Dent 52	Carrie	100.00	2
4	Dents 41	Nettoyage complet des dents	50.00	2
5	Dent 41	Détartrage	100.00	4
6	Dents 42	Détartrage	100.00	5
7	dent 42	Chnagement de prothèse 	200.00	8
\.


--
-- Data for Name: stock_produits; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.stock_produits (id, nom_produit, fournisseur, date_achat, stock, prix_unitaire) FROM stdin;
1	Anesthésie	AMED	2025-06-20	2	120.00
\.


--
-- Data for Name: traitements; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.traitements (id, patient_id, medecin_id, date_traitement, note, tarif) FROM stdin;
2	2	1	2025-06-01	Détartrage effectué	\N
3	2	1	2025-05-31	Détartrage effectué	\N
4	2	1	2025-05-31	Détartrage effectué	100.00
5	2	1	2024-05-07	Carrie	200.00
6	4	1	2024-07-09	Nettoyage des dents	150.00
7	5	1	2025-06-08	Examen complet	300.00
8	8	1	2025-06-19	Détartrage	100.00
9	8	1	2025-06-12	Suite de la séance précédente	100.00
10	4	1	2025-06-18	Suivi	50.00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.users (id, username, password, role) FROM stdin;
1	doctorpest	$2b$10$EQuaT6dmsDRjfa3JLjh7fetI3jXbeZXQfT0DCv9/pF/O5lCnclQ3O	medecin
3	assistante	$2b$10$u57BubQHrdL5JcCJPT11n.OJ7PBiBORBaET2bHbTr0syVmIS1hrES	assistante
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: doctorpest
--

COPY public.utilisateurs (id, username, password, date_creation) FROM stdin;
1	doctorpest	$2b$10$p59.FNfJ55NN7k.hLbrtve2pjkbpDthYUDigO.WGeW14e7txTA0zK	2025-05-31 20:59:18.197145
\.


--
-- Name: allergies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.allergies_id_seq', 7, true);


--
-- Name: certificats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.certificats_id_seq', 1, false);


--
-- Name: factures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.factures_id_seq', 14, true);


--
-- Name: medecins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.medecins_id_seq', 1, true);


--
-- Name: medicaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.medicaments_id_seq', 3, true);


--
-- Name: ordonnance_medicaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.ordonnance_medicaments_id_seq', 1, false);


--
-- Name: ordonnances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.ordonnances_id_seq', 1, false);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.patients_id_seq', 8, true);


--
-- Name: rendez_vous_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.rendez_vous_id_seq', 10, true);


--
-- Name: schema_dentaire_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.schema_dentaire_id_seq', 3, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.services_id_seq', 7, true);


--
-- Name: stock_produits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.stock_produits_id_seq', 1, true);


--
-- Name: traitements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.traitements_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: utilisateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: doctorpest
--

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 1, true);


--
-- Name: allergies allergies_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.allergies
    ADD CONSTRAINT allergies_pkey PRIMARY KEY (id);


--
-- Name: certificats certificats_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.certificats
    ADD CONSTRAINT certificats_pkey PRIMARY KEY (id);


--
-- Name: factures factures_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.factures
    ADD CONSTRAINT factures_pkey PRIMARY KEY (id);


--
-- Name: medecins medecins_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.medecins
    ADD CONSTRAINT medecins_pkey PRIMARY KEY (id);


--
-- Name: medicaments medicaments_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.medicaments
    ADD CONSTRAINT medicaments_pkey PRIMARY KEY (id);


--
-- Name: ordonnance_medicaments ordonnance_medicaments_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnance_medicaments
    ADD CONSTRAINT ordonnance_medicaments_pkey PRIMARY KEY (id);


--
-- Name: ordonnances ordonnances_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnances
    ADD CONSTRAINT ordonnances_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: rendez_vous rendez_vous_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.rendez_vous
    ADD CONSTRAINT rendez_vous_pkey PRIMARY KEY (id);


--
-- Name: schema_dentaire schema_dentaire_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.schema_dentaire
    ADD CONSTRAINT schema_dentaire_pkey PRIMARY KEY (id);


--
-- Name: services_a_realiser services_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.services_a_realiser
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: stock_produits stock_produits_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.stock_produits
    ADD CONSTRAINT stock_produits_pkey PRIMARY KEY (id);


--
-- Name: traitements traitements_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.traitements
    ADD CONSTRAINT traitements_pkey PRIMARY KEY (id);


--
-- Name: patients unique_cin; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT unique_cin UNIQUE (cin);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_username_key; Type: CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_username_key UNIQUE (username);


--
-- Name: idx_services_a_realiser_patient_id; Type: INDEX; Schema: public; Owner: doctorpest
--

CREATE INDEX idx_services_a_realiser_patient_id ON public.services_a_realiser USING btree (patient_id);


--
-- Name: allergies allergies_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.allergies
    ADD CONSTRAINT allergies_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: certificats certificats_medecin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.certificats
    ADD CONSTRAINT certificats_medecin_id_fkey FOREIGN KEY (medecin_id) REFERENCES public.medecins(id) ON DELETE SET NULL;


--
-- Name: certificats certificats_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.certificats
    ADD CONSTRAINT certificats_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: factures factures_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.factures
    ADD CONSTRAINT factures_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: ordonnance_medicaments ordonnance_medicaments_medicament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnance_medicaments
    ADD CONSTRAINT ordonnance_medicaments_medicament_id_fkey FOREIGN KEY (medicament_id) REFERENCES public.medicaments(id) ON DELETE SET NULL;


--
-- Name: ordonnance_medicaments ordonnance_medicaments_ordonnance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnance_medicaments
    ADD CONSTRAINT ordonnance_medicaments_ordonnance_id_fkey FOREIGN KEY (ordonnance_id) REFERENCES public.ordonnances(id) ON DELETE CASCADE;


--
-- Name: ordonnances ordonnances_medecin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnances
    ADD CONSTRAINT ordonnances_medecin_id_fkey FOREIGN KEY (medecin_id) REFERENCES public.medecins(id) ON DELETE SET NULL;


--
-- Name: ordonnances ordonnances_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.ordonnances
    ADD CONSTRAINT ordonnances_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: rendez_vous rendez_vous_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.rendez_vous
    ADD CONSTRAINT rendez_vous_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: schema_dentaire schema_dentaire_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.schema_dentaire
    ADD CONSTRAINT schema_dentaire_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: services_a_realiser services_a_realiser_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.services_a_realiser
    ADD CONSTRAINT services_a_realiser_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: traitements traitements_medecin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.traitements
    ADD CONSTRAINT traitements_medecin_id_fkey FOREIGN KEY (medecin_id) REFERENCES public.medecins(id) ON DELETE SET NULL;


--
-- Name: traitements traitements_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doctorpest
--

ALTER TABLE ONLY public.traitements
    ADD CONSTRAINT traitements_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

