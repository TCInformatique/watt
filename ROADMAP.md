# Roadmap — Compteur Connecté

> Ce document liste les fonctionnalités à implémenter, phase par phase, en partant du cahier des charges. Chaque phase est conçue pour être livrable et testable indépendamment.

---

## Glossaire métier

| Terme | Définition |
|-------|------------|
| **Org** | Organisation / propriétaire-gérant qui administre les compteurs |
| **Site** | Site ou bâtiment (ex. *Résidence Les Alpes*) |
| **Location** | Lieu physique dans un site (ex. *Appartement 01*) |
| **Meter** | Compteur connecté équipé d'une carte SIM |
| **BillingPoint** | Point de facturation = association **Client + Lieu + Compteur + Contrat** |
| **Tariff** | Règle de tarification appliquée à un contrat |
| **Consumption** | Relevé de consommation reçu du compteur |

---

## Phase 0 — Fondations

**Objectif** : authentification, autorisation et structure de navigation opérationnelles.

- [ ] Finaliser le schéma Prisma (v1 validée)
- [ ] Générer et appliquer la migration initiale
- [ ] Seed de démo fonctionnel (`bun run seed`)
- [ ] Middleware d'authentification & gestion des sessions
- [ ] Guard de routes selon le rôle (`root`, `admin`, `manager`, `client`)
- [ ] Layout de base Organisation (sidebar / header)
- [ ] Layout de base Client (vue simplifiée)
- [ ] Page de connexion / déconnexion
- [ ] Création du premier utilisateur `root` et de son organisation

---

## Phase 1 — Gestion du parc (Interface Organisation)

**Objectif** : permettre à une organisation de créer et structurer son parc de compteurs.

### 1.1 Sites & Locations
- [ ] CRUD Site (nom, adresse, ville, NPA)
- [ ] CRUD Location au sein d'un Site (nom, description)
- [ ] Vue d'ensemble d'un site avec ses locations et compteurs associés

### 1.2 Compteurs
- [ ] CRUD Compteur (numéro de série, modèle, SIM, type d'énergie, statut)
- [ ] Association Compteur ↔ Site / Location
- [ ] Liste des compteurs avec filtre par statut (`online` / `offline` / `maintenance`)
- [ ] Détail d'un compteur : infos techniques + dernières valeurs reçues

### 1.3 Clients (consommateurs)
- [ ] Création / édition / archivage d'un contact client
- [ ] Invitation par email à créer un accès client
- [ ] Attribution d'un ou plusieurs compteurs à un client (via BillingPoint)

---

## Phase 2 — Collecte & Visualisation des données

**Objectif** : ingérer les relevés et les présenter aux deux interfaces.

### 2.1 Ingestion
- [ ] Endpoint API sécurisé pour réception des données des compteurs (JSON / webhook)
- [ ] Stockage des relevés : `indexValue`, `instantPower`, `voltage`, `current`, `alertStatus`
- [ ] Gestion des doublons et validation du format
- [ ] Mise à jour du statut du compteur (`online` / `offline`) selon la fréquence de réception

### 2.2 Tableau de bord Organisation
- [ ] Vue globale de la consommation de tous les compteurs
- [ ] Filtrage par site, par location, par période (jour / mois / année)
- [ ] Graphiques d'évolution (courbes et histogrammes)
- [ ] Indicateurs : compteurs hors ligne, consommation anormale

### 2.3 Interface Client — Consommation
- [ ] Page d'accueil client avec graphique principal
- [ ] Sélection de la granularité : temps réel / jour / mois / année
- [ ] Historique complet des index avec tableau de données
- [ ] Informations du compteur (type, numéro de série, adresse du site)

---

## Phase 3 — Facturation

**Objectif** : modéliser les règles de facturation et générer des factures.

### 3.1 Règles de tarification
- [ ] Création de tarifs :
  - **Tarif simple** : prix fixe par kWh / m³ / unité
  - **Tarif progressif** : paliers de consommation avec prix dégressif
  - **Abonnement + consommation** : montant fixe de base + montant annuel plateforme + consommation
  - **Tarif personnalisé** par client ou par site
- [ ] Gestion des paliers (`TariffTier`) pour les tarifs progressifs
- [ ] Activation / désactivation d'un tarif (dates `activeFrom` → `activeUntil`)

### 3.2 Contrats
- [ ] Création d'un contrat client (client ↔ tarif ↔ site)
- [ ] Période de validité (début / fin)
- [ ] Association du contrat à un ou plusieurs BillingPoints

### 3.3 Génération des factures
- [ ] Calcul automatique de la consommation sur une période à partir des index
- [ ] Application de la règle tarifaire du contrat
- [ ] Création de la facture avec lignes détaillées :
  - Consommation énergétique
  - Frais fixes / abonnement
  - Montant total TTC
- [ ] Statuts de facture : `draft` → `sent` → `paid` / `overdue` / `cancelled`
- [ ] Génération du PDF

---

## Phase 4 — Gestion financière & Paiements

**Objectif** : permettre le suivi et le règlement des factures.

### 4.1 Interface Organisation — Finance
- [ ] Liste des factures avec filtres (par client, statut, période)
- [ ] Libération / envoi des factures aux clients
- [ ] Suivi des paiements reçus
- [ ] Export comptable (CSV / Excel)

### 4.2 Interface Client — Factures
- [ ] Liste des factures (dues / payées / en retard)
- [ ] Téléchargement du PDF
- [ ] Visualisation du détail (lignes, tarif appliqué, période)
- [ ] **Optionnel** : paiement en ligne (intégration Stripe / Twint / PostFinance)

### 4.3 Paiements
- [ ] Enregistrement manuel d'un paiement par l'organisation
- [ ] Association paiement ↔ facture
- [ ] Historique des transactions

---

## Phase 5 — Configuration & Paramétrages

**Objectif** : finaliser les écrans de paramétrage pour le gérant.

- [ ] Configuration de l'organisation (coordonnées bancaires, adresse de facturation)
- [ ] Gestion des utilisateurs organisation (admin, manager)
- [ ] Paramètres des compteurs (fréquence d'envoi, seuils d'alerte)
- [ ] Upload de documents modèles (conditions de facturation, contrat type)

---

## Phase 6 — Évolutions & Features avancées

**Objectif** : différenciateurs et automatisation.

- [ ] **Alertes** : notification en cas de consommation anormale, compteur hors ligne, fuite (eau)
- [ **RFID** : activation d'un badge par le client pour saisie manuelle ou accès local
- [ ] **Multi-énergie** : tableau de bord croisé électricité / eau / chauffage / gaz
- [ ] **IA / Prédiction** : estimation de la prochaine facture, détection de fuites ou surconsommation
- [ ] **API publique** : accès client via token pour intégrations tierces
- [ ] **Application mobile** : PWA ou app native pour l'interface client

---

## Livrables par phase

| Phase | Livrable clé | Tests recommandés |
|-------|--------------|-------------------|
| 0 | Connexion + layout opérationnels | Tests E2E login / logout |
| 1 | CRUD complet Sites / Locations / Meters / Clients | Tests CRUD + validation formulaires |
| 2 | Données de consommation visibles sur les 2 interfaces | Tests API ingestion + rendu graphique |
| 3 | Première facture générée automatiquement | Tests unitaires calculs tarifaires |
| 4 | Circuit complet : facture → envoi → paiement | Tests E2E circuit financier |
| 5 | Application configurable sans code | Tests de non-régression |
| 6 | Alertes en temps réel | Tests de seuils et notifications |

---

## Notes

- Chaque phase doit pouvoir être déployée en production (pas de "big bang").
- Privilégier les quick-wins de la Phase 2 pour montrer de la valeur rapidement aux clients.
- La partie **Facturation** (Phase 3) est le cœur métier : elle doit être testée finement (arrondis, paliers, dates de changement de tarif).
