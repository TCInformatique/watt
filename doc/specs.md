# Spécifications Fonctionnelles — Compteur Connecté

> Ce document décrit les vues (pages), leurs fonctionnalités et les règles métier associées.

---

## 1. Principes généraux

### 1.1 Routing & Organisation

- L'`orgId` actif est stocké en session. S'il est absent, l'utilisateur est redirigé vers `/home` pour choisir ou créer une organisation.
- L'espace Organisation et l'espace Client partagent la même base de code et le même `orgId`.
- L'espace Client vit sous la route `/(org)/client` (ou `/(org)/portail`).
- L'accès à une route est refusé (403 ou redirect) si le rôle de l'utilisateur n'est pas autorisé.

### 1.2 Rôles & Permissions

Deux niveaux de rôles coexistent :

| Niveau           | Rôle      | Description                                                                                                                                                                                                                 |
| ---------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Application**  | `root`    | Super-admin technique (accès global)                                                                                                                                                                                        |
| **Application**  | `admin`   | Admin de l'application (gestion des orgs, utilisateurs)                                                                                                                                                                     |
| **Application**  | `basic`   | Utilisateur standard                                                                                                                                                                                                        |
| **Organisation** | `admin`   | Gérant / propriétaire. Paramétrage org + gestion complète du parc                                                                                                                                                           |
| **Organisation** | `manager` | Gestion opérationnelle (compteurs, facturation, clients). Mêmes droits que `admin` sur le parc et la facturation. Différence avec `admin` floue pour l'instant ; la distinction fine viendra au fil des paramètres avancés. |
| **Organisation** | `client`  | Consommateur final. Accès limité à son propre portail                                                                                                                                                                       |

### 1.3 Données techniques

- **Compteurs connectés** : transmission automatique via SIM (2G/3G/4G/5G).
- **Types de mesure** : électricité, eau sanitaire chaude (volume), eau sanitaire froide (volume), chauffage (énergie calorifique), gaz.
- **Flexibilité des données** : la table `Consumption` est une table **timeseries** hébergée sur **TimescaleDB** (extension PostgreSQL). Une colonne `data Json` (en complément ou remplacement des champs spécifiques) est recommandée pour s'adapter aux différents types de compteurs et aux volumes de données. L'hypertable doit être partitionnée par `timestamp` pour garantir les performances sur des millions de relevés.
- **Granularité temps réel** (post-MVP) : la visualisation pourra adapter sa résolution selon la période (24h → 5s, semaine → 2min, mois → 15min, >1 mois → 1h). Pour le MVP, des données journalières / horaires suffisent.

---

## 2. Espace Organisation

### 2.1 Tableau de bord (`/(org)`)

**Accès** : `admin`, `manager`  
**Objectif** : vue d'ensemble du parc et des alertes.

**Contenu** :

- Nombre de compteurs par statut (`online` / `offline` / `maintenance`)
- Nombre de factures en attente de paiement (montant total)
- Consommation globale du mois en cours (kWh / m³ / etc.)
- Liste des 5 dernières alertes (compteurs hors ligne, consommations anormales)
- Accès rapide aux sections principales (Sites, Compteurs, Factures)

**Actions** :

- Filtrer le tableau de bord par site

---

### 2.2 Gestion des membres (`/(org)/members`)

**Accès** : `admin`, `manager`  
**Objectif** : CRUD des contacts et gestion des membres de l'organisation.

**Contenu** :

- Liste paginée des membres (nom, email, rôle, statut invitation)
- Filtres par rôle et par recherche textuelle

**Actions** :

- Créer un membre (invitation par email)
- Modifier le rôle d'un membre (`manager` ↔ `client`)
- Archiver / supprimer un membre
- Visualiser le détail d'un membre (`/(org)/members/[id]`)

**Règles métier** :

- Un contact invité (`isInvitation = true`) doit pouvoir accepter l'invitation et créer son compte `User`.
- Un `client` ne voit que son propre portail ; il n'accède pas à l'espace Organisation.

---

### 2.3 Gestion du parc

#### 2.3.1 Sites (`/(org)/sites`)

**Accès** : `admin`, `manager`  
**Objectif** : gérer les bâtiments et sites physiques.

**Contenu** :

- Liste des sites (nom, adresse, nombre de locations, nombre de compteurs)
- Carte / synthèse par site

**Actions** :

- Créer / modifier / supprimer un site
- Visualiser le détail d'un site (`/(org)/sites/[id]`)

#### 2.3.2 Détail d'un site (`/(org)/sites/[id]`)

**Contenu** :

- Informations du site (nom, adresse complète)
- Liste des locations (Appartement 01, 02, etc.)
- Liste des compteurs associés
- Synthèse des consommations du site (graphique)

**Actions** :

- CRUD Location au sein du site
- Affecter / déplacer un compteur vers une location

#### 2.3.3 Compteurs (`/(org)/meters`)

**Accès** : `admin`, `manager`  
**Objectif** : superviser l'ensemble des compteurs connectés.

**Contenu** :

- Liste des compteurs avec filtres (statut, type, site, location)
- Colonnes : numéro de série, modèle, SIM, statut, type d'énergie, dernière transmission

**Actions** :

- Créer / modifier / archiver un compteur
- Visualiser le détail d'un compteur (`/(org)/meters/[id]`)

#### 2.3.4 Détail d'un compteur (`/(org)/meters/[id]`)

**Contenu** :

- Fiche technique (série, modèle, SIM, type, statut)
- Localisation (site + location)
- Graphique des consommations sur les 30 derniers jours
- Tableau des derniers relevés reçus

**Actions** :

- Changer le statut (`online` → `maintenance`)
- Dissocier le compteur d'une location

---

### 2.4 Suivi des consommations (`/(org)/consumptions`)

**Accès** : `admin`, `manager`  
**Objectif** : analyse globale et détection d'anomalies.

**Contenu** :

- Graphique principal : consommation totale sur la période sélectionnée
- Filtres : site, location, compteur, période (jour / mois / année)
- Tableau des données brutes (timestamp, index, puissance, alertes)
- Indicateurs de comparaison (vs période précédente)

**Actions** :

- Exporter les données en CSV
- (Post-MVP) Détection automatique d'anomalies

---

### 2.5 Facturation

#### 2.5.1 Tarifs (`/(org)/tariffs`)

**Accès** : `admin`, `manager`  
**Objectif** : définir les règles de tarification.

**Contenu** :

- Liste des tarifs actifs (nom, type, période de validité)

**Actions** :

- Créer un tarif :
  - **Tarif simple** : prix unitaire fixe (par kWh / m³ / unité)
  - **Tarif progressif** : paliers de consommation avec prix dégressif. Nécessite la saisie de `TariffTier` (min, max, prix)
  - **Abonnement + consommation** : montant fixe de base (mise en service) + montant annuel plateforme + prix unitaire variable
  - **Personnalisé** : cas spécifiques
- Modifier / désactiver un tarif (date de fin)

**Règles métier** :

- Un tarif est appliqué au niveau du **contrat** (et donc par client).
- La devise par défaut est le CHF.

#### 2.5.2 Contrats (`/(org)/contracts`)

**Accès** : `admin`, `manager`  
**Objectif** : lier un client à un tarif et à un site.

**Contenu** :

- Liste des contrats (client, tarif, site, période, statut)

**Actions** :

- Créer un contrat (client + tarif + site + dates)
- Résilier / renouveler un contrat
- Visualiser le détail (`/(org)/contracts/[id]`)

**Règles métier** :

- Un contrat actif est nécessaire pour créer un `BillingPoint`.

#### 2.5.3 Points de facturation (`/(org)/billing-points`)

**Accès** : `admin`, `manager`  
**Objectif** : associer un client, un lieu physique et un compteur.

**Contenu** :

- Liste des points de facturation (client, location, compteur, contrat, label)

**Actions** :

- Créer un point de facturation
- Modifier l'association (changer de compteur ou de client)
- Supprimer un point de facturation

**Règles métier** :

- Un `BillingPoint` représente l'unité de facturation minimale.
- Toutes les factures sont émises au niveau du `BillingPoint`.

---

### 2.6 Factures & Paiements

#### 2.6.1 Liste des factures (`/(org)/invoices`)

**Accès** : `admin`, `manager`  
**Objectif** : superviser et gérer le cycle de facturation.

**Contenu** :

- Liste des factures avec filtres (statut, client, période)
- Colonnes : n° de facture, client, période, montant total, statut

**Actions** :

- Générer une facture manuellement pour un `BillingPoint` et une période donnée
- Marquer une facture comme "envoyée"
- Enregistrer un paiement reçu
- Télécharger le PDF
- Annuler une facture (`cancelled`)

**Règles métier** :

- La génération automatique est activable (ex. le 1er de chaque mois).
- Le système calcule la consommation entre deux dates à partir des index du compteur.
- Le but final est de s'interfacer facilement avec des logiciels comptables tiers ; la gestion interne reste légère (pas de double comptabilité complexe).

#### 2.6.2 Détail d'une facture (`/(org)/invoices/[id]`)

**Contenu** :

- En-tête (client, adresse, période, dates)
- Lignes de facture (description, quantité, prix unitaire, total)
- Historique des paiements associés

---

### 2.7 Paramètres de l'organisation (`/(org)/settings`)

**Accès** : `admin` (pour le MVP, `manager` peut être exclu des paramètres sensibles)  
**Objectif** : configurer l'organisation.

**Contenu** :

- Coordonnées de l'organisation (nom, adresse, email, téléphone)
- Coordonnées bancaires (pour l'affichage sur les factures)
- Document PDF général (conditions de facturation, contrat type) — visible par tous les clients
- Informations service (personne de contact technique, concierge, etc.) — affichées dans le portail client

**Actions** :

- Modifier les informations org
- Uploader / remplacer le document PDF général

---

### 2.8 Flux d'énergie — Tableau de bord de synthèse (`/(org)/energy-flow`)

**Accès** : `admin`, `manager`  
**Objectif** : vue agrégée et comparative des consommations par type d'énergie.

**Contenu** :

- Répartition des consommations par type (électricité, eau chaude, eau froide, chauffage, gaz)
- Comparatif site par site ou période par période
- Indicateurs de rendement (si pertinent)

---

## 3. Espace Client (Portail)

### 3.1 Tableau de bord (`/(org)/client`)

**Accès** : `client` (MemberRole)  
**Objectif** : vue synthétique de la consommation et des alertes.

**Contenu** :

- Graphique principal de consommation (période par défaut : mois en cours)
- Dernières factures (échues / payées)
- Alertes éventuelles (compteur hors ligne, consommation inhabituelle)
- Accès rapide aux sections (Consommation, Factures, Documents, RFID)

---

### 3.2 Consommation (`/(org)/client/consumption`)

**Accès** : `client`  
**Objectif** : visualiser en détail la consommation du ou des compteurs associés.

**Contenu** :

- Graphique évolutif avec sélecteur de période (jour / mois / année)
- Historique complet des relevés (tableau)
- Informations du compteur (type, numéro de série, adresse du site)

**Actions** :

- Changer la période affichée
- (Post-MVP) Sélectionner la granularité (temps réel avec résolution variable)

---

### 3.3 Factures (`/(org)/client/invoices`)

**Accès** : `client`  
**Objectif** : consulter et télécharger ses factures.

**Contenu** :

- Liste des factures (période, montant, statut)
- Détails de chaque facture (lignes, tarif appliqué)

**Actions** :

- Télécharger le PDF
- (Post-MVP) Payer en ligne

---

### 3.4 Documents (`/(org)/client/documents`)

**Accès** : `client`  
**Objectif** : accéder aux documents contractuels.

**Contenu** :

- Document général de l'organisation (conditions de facturation)
- Documents personnalisés liés au contrat du client (annexes)

**Actions** :

- Télécharger les PDF

---

### 3.5 Gestion RFID (`/(org)/client/rfid`)

**Accès** : `client`  
**Objectif** : enregistrer et gérer ses badges RFID pour la consommation à la demande.

**Contenu** :

- Liste des badges RFID enregistrés (nom, numéro, statut actif/inactif)

**Actions** :

- Ajouter un badge (saisie manuelle du numéro ou scan)
- Activer / désactiver un badge
- Supprimer un badge

**Règles métier** :

- Le badge est utilisable ensuite sur des systèmes de consommation à la demande (ex. chargeurs de voiture).
- L'org voit la liste des badges actifs d'un client dans son espace (optionnel, post-MVP).

---

### 3.6 Informations service (`/(org)/client/service`)

**Accès** : `client`  
**Objectif** : afficher les contacts utiles renseignés par l'organisation.

**Contenu** :

- Personne de contact (nom, téléphone, email)
- Contact technique
- Contact concierge / gardien
- Adresse et horaires éventuels

**Règles métier** :

- Ces informations sont définies au niveau de l'organisation (dans `/(org)/settings`), pas au niveau du compteur.

---

## 4. API & Ingestion des données

### 4.1 Endpoint de réception Modbus (`POST /api/meters/modbus`)

**Authentification** : clé API ou token par compteur (à définir).  
**Objectif** : recevoir les trames Modbus envoyées par les compteurs connectés (passerelle GPRS/4G).

**Format attendu** :
Le endpoint reçoit des données structurées issues du protocole Modbus (RTU over TCP ou directement une payload JSON normalisée par la passerelle) :

```json
{
	"serialNumber": "ABC123",
	"timestamp": "2026-04-27T10:00:00Z",
	"indexValue": 12345.67,
	"instantPower": 2.5,
	"voltage": 230,
	"current": 10.5,
	"alertStatus": null
}
```

**Règles métier** :

- Vérification que le `serialNumber` existe et est actif.
- Stockage dans l'hypertable `Consumption` (TimescaleDB).
- Mise à jour du statut du compteur à `online`.
- (Post-MVP) Détection d'anomalies et génération d'alertes.

### 4.2 Export des données

**Endpoint** : `GET /api/export/consumptions` (ou via l'UI)  
**Format** : CSV  
**Paramètres** : site, location, compteur, période.

---

## 5. Export & Intégrations comptables

**Objectif** : faciliter le transfert des factures vers des logiciels de comptabilité tiers.

**Actions** :

- Export des factures en CSV / XML (format standard suisse)
- (Post-MVP) API ou webhook vers logiciel tiers
- (Post-MVP) Connecteur e-billing / QR-facture suisse

---

## 6. Décisions reportées (Post-MVP)

| Sujet                                                         | Raison                                                                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Temps réel**                                                | Granularité variable (5s / 2min / 15min / 1h). Nécessite une architecture temps réel (WebSocket ou polling). TimescaleDB est déjà en place pour l'ingestion. |
| **Paiement en ligne**                                         | Intégration Stripe / Twint / PostFinance. Non critique pour le MVP.                                                                         |
| **Détection d'anomalies IA**                                  | Nécessite un historique conséquent et un modèle d'analyse.                                                                                  |
| **PWA / App native**                                          | Le web responsive suffit pour valider le produit.                                                                                           |
| **Connecteur comptable direct**                               | Export manuel suffisant pour démarrer ; l'intégration native viendra après.                                                                 |
| **Type d'électricité** (monophasé / triphasé / tarif horaire) | À clarifier avec le fournisseur de compteurs.                                                                                               |
