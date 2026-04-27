# Roadmap — Compteur Connecté

> Ce document liste les fonctionnalités à implémenter, phase par phase, en partant du cahier des charges. Chaque phase est conçue pour être livrable et testable indépendamment.
> Les estimations sont exprimées en **jours de développement** (journée pleine, 1 dev).

---

## Glossaire métier

| Terme            | Définition                                                                |
| ---------------- | ------------------------------------------------------------------------- |
| **Org**          | Organisation / propriétaire-gérant qui administre les compteurs           |
| **Site**         | Site ou bâtiment (ex. _Résidence Les Alpes_)                              |
| **Location**     | Lieu physique dans un site (ex. _Appartement 01_)                         |
| **Meter**        | Compteur connecté équipé d'une carte SIM                                  |
| **BillingPoint** | Point de facturation = association **Client + Lieu + Compteur + Contrat** |
| **Tariff**       | Règle de tarification appliquée à un contrat                              |
| **Consumption**  | Relevé de consommation reçu du compteur                                   |

---

## Récapitulatif global

| Phase | Thème                          | Estimation | Cumulé             |
| ----- | ------------------------------ | ---------- | ------------------ |
| 0     | Fondations                     | ~5j        | ~5j (1 semaine)    |
| 1     | Gestion du parc                | ~9j        | ~14j (3 semaines)  |
| 2     | Collecte & Visualisation       | ~11j       | ~25j (5 semaines)  |
| 3     | Facturation                    | ~14j       | ~39j (8 semaines)  |
| 4     | Gestion financière & Paiements | ~6j        | ~45j (9 semaines)  |
| 5     | Configuration & Paramétrages   | ~4j        | ~49j (10 semaines) |
| 6     | Évolutions & Features avancées | —          | Post-MVP           |

> **Total MVP (Phases 0 → 5) : ~49 jours** (~10 semaines à temps plein, 1 dev)

---

## Phase 0 — Fondations (~5j)

**Objectif** : authentification, autorisation et structure de navigation opérationnelles.
**Dépendances** : aucune

- [ ] Finaliser le schéma Prisma (v1 validée) — ~0.5j
- [ ] Générer et appliquer la migration initiale — ~0.5j
- [ ] Seed de démo fonctionnel (`bun run seed`) — ~0.5j
- [ ] Middleware d'authentification & gestion des sessions — ~1j
- [ ] Guard de routes selon le rôle (`root`, `admin`, `manager`, `client`) — ~0.5j
- [ ] Layout de base Organisation (sidebar / header) — ~1j
- [ ] Layout de base Client (vue simplifiée) — ~0.5j
- [ ] Page de connexion / déconnexion — ~0.5j
- [ ] Création du premier utilisateur `root` et de son organisation — ~0.5j

---

## Phase 1 — Gestion du parc (Interface Organisation) (~9j)

**Objectif** : permettre à une organisation de créer et structurer son parc de compteurs.
**Dépendances** : Phase 0

### 1.1 Sites & Locations (~2.5j)

- [ ] CRUD Site (nom, adresse, ville, NPA) — ~1j
- [ ] CRUD Location au sein d'un Site (nom, description) — ~1j
- [ ] Vue d'ensemble d'un site avec ses locations et compteurs associés — ~0.5j

### 1.2 Compteurs (~4j)

- [ ] CRUD Compteur (numéro de série, modèle, SIM, type d'énergie, statut) — ~1.5j
- [ ] Association Compteur ↔ Site / Location — ~0.5j
- [ ] Liste des compteurs avec filtre par statut (`online` / `offline` / `maintenance`) — ~1j
- [ ] Détail d'un compteur : infos techniques + dernières valeurs reçues — ~1j

### 1.3 Clients (consommateurs) (~2.5j)

- [ ] Création / édition / archivage d'un contact client — ~1j
- [ ] Invitation par email à créer un accès client — ~1j
- [ ] Attribution d'un ou plusieurs compteurs à un client (via BillingPoint) — ~0.5j

---

## Phase 2 — Collecte & Visualisation des données (~11j)

**Objectif** : ingérer les relevés et les présenter aux deux interfaces.
**Dépendances** : Phase 1

### 2.1 Ingestion (~3.5j)

- [ ] Endpoint API sécurisé pour réception des données des compteurs (JSON / webhook) — ~1.5j
- [ ] Stockage des relevés : `indexValue`, `instantPower`, `voltage`, `current`, `alertStatus` — ~1j
- [ ] Gestion des doublons et validation du format — ~0.5j
- [ ] Mise à jour du statut du compteur (`online` / `offline`) selon la fréquence de réception — ~0.5j

### 2.2 Tableau de bord Organisation (~4j)

- [ ] Vue globale de la consommation de tous les compteurs — ~1.5j
- [ ] Filtrage par site, par location, par période (jour / mois / année) — ~1j
- [ ] Graphiques d'évolution (courbes et histogrammes) — ~1j
- [ ] Indicateurs : compteurs hors ligne, consommation anormale — ~0.5j

### 2.3 Interface Client — Consommation (~3.5j)

- [ ] Page d'accueil client avec graphique principal — ~1.5j
- [ ] Sélection de la granularité : temps réel / jour / mois / année — ~0.5j
- [ ] Historique complet des index avec tableau de données — ~1j
- [ ] Informations du compteur (type, numéro de série, adresse du site) — ~0.5j

---

## Phase 3 — Facturation (~14j)

**Objectif** : modéliser les règles de facturation et générer des factures.
**Dépendances** : Phase 2

### 3.1 Règles de tarification (~4j)

- [ ] Création de tarifs :
  - **Tarif simple** : prix fixe par kWh / m³ / unité — ~0.5j
  - **Tarif progressif** : paliers de consommation avec prix dégressif — ~1.5j
  - **Abonnement + consommation** : montant fixe de base + montant annuel plateforme + consommation — ~1j
  - **Tarif personnalisé** par client ou par site — ~0.5j
- [ ] Gestion des paliers (`TariffTier`) pour les tarifs progressifs — ~0.5j

### 3.2 Contrats (~1.5j)

- [ ] Création d'un contrat client (client ↔ tarif ↔ site) — ~0.5j
- [ ] Période de validité (début / fin) — ~0.5j
- [ ] Association du contrat à un ou plusieurs BillingPoints — ~0.5j

### 3.3 Génération des factures (~8.5j)

- [ ] Calcul automatique de la consommation sur une période à partir des index — ~2j
- [ ] Application de la règle tarifaire du contrat — ~2j
- [ ] Création de la facture avec lignes détaillées :
  - Consommation énergétique — ~0.5j
  - Frais fixes / abonnement — ~0.5j
  - Montant total TTC — ~0.5j
- [ ] Statuts de facture : `draft` → `sent` → `paid` / `overdue` / `cancelled` — ~0.5j
- [ ] Génération du PDF — ~1.5j
- [ ] Tests edge cases (arrondis, changement de tarif en cours de période) — ~1j

---

## Phase 4 — Gestion financière & Paiements (~6j)

**Objectif** : permettre le suivi et le règlement des factures.
**Dépendances** : Phase 3

### 4.1 Interface Organisation — Finance (~2.5j)

- [ ] Liste des factures avec filtres (par client, statut, période) — ~1j
- [ ] Libération / envoi des factures aux clients — ~0.5j
- [ ] Suivi des paiements reçus — ~0.5j
- [ ] Export comptable (CSV / Excel) — ~0.5j

### 4.2 Interface Client — Factures (~1.5j)

- [ ] Liste des factures (dues / payées / en retard) — ~0.5j
- [ ] Téléchargement du PDF — ~0.5j
- [ ] Visualisation du détail (lignes, tarif appliqué, période) — ~0.5j
- [ ] **Optionnel** : paiement en ligne (intégration Stripe / Twint / PostFinance) — ~2j (hors MVP)

### 4.3 Paiements (~2j)

- [ ] Enregistrement manuel d'un paiement par l'organisation — ~0.5j
- [ ] Association paiement ↔ facture — ~0.5j
- [ ] Historique des transactions — ~0.5j
- [ ] Mise à jour automatique du statut `paid` / `overdue` — ~0.5j

---

## Phase 5 — Configuration & Paramétrages (~4j)

**Objectif** : finaliser les écrans de paramétrage pour le gérant.
**Dépendances** : Phase 4

- [ ] Configuration de l'organisation (coordonnées bancaires, adresse de facturation) — ~0.5j
- [ ] Gestion des utilisateurs organisation (admin, manager) — ~1j
- [ ] Paramètres des compteurs (fréquence d'envoi, seuils d'alerte) — ~0.5j
- [ ] Upload de documents modèles (conditions de facturation, contrat type) — ~1j
- [ ] Informations service (contact technique, concierge) affichées dans le portail client — ~1j

---

## Phase 6 — Évolutions & Features avancées (Post-MVP)

**Objectif** : différenciateurs et automatisation.

- [ ] **Alertes** : notification en cas de consommation anormale, compteur hors ligne, fuite (eau)
- [ ] **RFID** : activation d'un badge par le client pour saisie manuelle ou accès local
- [ ] **Multi-énergie** : tableau de bord croisé électricité / eau / chauffage / gaz
- [ ] **IA / Prédiction** : estimation de la prochaine facture, détection de fuites ou surconsommation
- [ ] **API publique** : accès client via token pour intégrations tierces
- [ ] **Application mobile** : PWA ou app native pour l'interface client
- [ ] **Temps réel** : granularité variable (24h → 5s, semaine → 2min, mois → 15min, >1 mois → 1h)
- [ ] **Connecteur comptable** : intégration native avec logiciels tiers (e-billing, QR-facture)

---

## Livrables par phase

| Phase | Livrable clé                                          | Tests recommandés                     | Estimation |
| ----- | ----------------------------------------------------- | ------------------------------------- | ---------- |
| 0     | Connexion + layout opérationnels                      | Tests E2E login / logout              | ~5j        |
| 1     | CRUD complet Sites / Locations / Meters / Clients     | Tests CRUD + validation formulaires   | ~9j        |
| 2     | Données de consommation visibles sur les 2 interfaces | Tests API ingestion + rendu graphique | ~11j       |
| 3     | Première facture générée automatiquement              | Tests unitaires calculs tarifaires    | ~14j       |
| 4     | Circuit complet : facture → envoi → paiement          | Tests E2E circuit financier           | ~6j        |
| 5     | Application configurable sans code                    | Tests de non-régression               | ~4j        |
| 6     | Alertes en temps réel                                 | Tests de seuils et notifications      | Post-MVP   |

---

## Planning indicatif

```
Semaine  1 : ████████ Phase 0 — Fondations
Semaine  2 : ████████ Phase 1 — Gestion du parc (partie 1)
Semaine  3 : ████████ Phase 1 — Gestion du parc (partie 2)
Semaine  4 : ████████ Phase 2 — Ingestion + Dashboard Org
Semaine  5 : ████████ Phase 2 — Dashboard Client + Export
Semaine  6 : ████████ Phase 3 — Tarifs + Contrats
Semaine  7 : ████████ Phase 3 — Génération factures + PDF
Semaine  8 : ████████ Phase 3 — Tests + ajustements
Semaine  9 : ████████ Phase 4 — Paiements + Export comptable
Semaine 10 : ████████ Phase 5 — Paramétrages + polish
```

---

## Notes

- Chaque phase doit pouvoir être déployée en production (pas de "big bang").
- Privilégier les quick-wins de la Phase 2 pour montrer de la valeur rapidement aux clients.
- La partie **Facturation** (Phase 3) est le cœur métier : elle doit être testée finement (arrondis, paliers, dates de changement de tarif).
- Les estimations supposent un développeur solo à temps plein sur le projet. En parallèle avec d'autres missions, compter le double de temps calendaire.
- Les phases 0 et 1 peuvent être légèrement chevauchées si le schéma Prisma est déjà stabilisé.
