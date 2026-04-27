# Compteur Connecté

Application web de gestion de compteurs connectés (électricité, eau, chauffage, gaz) pour organisations immobilières et leurs locataires.

## Fonctionnalités

- **Interface Organisation** : gestion des sites, bâtiments, compteurs SIM, clients, règles de facturation et émission de factures.
- **Interface Client** : consultation de la consommation (graphiques, historique), téléchargement des factures et informations de contact.
- **Collecte automatique** : réception des index et alertes envoyés par les compteurs connectés en temps réel.
- **Facturation flexible** : tarifs simples, progressifs ou abonnement + consommation, avec suivi des paiements.

## Stack

- **Frontend** : Svelte 5 + Tailwind CSS + DaisyUI
- **Backend** : SvelteKit (Node.js adapter)
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : sessions avec `@oslojs/crypto`

## Développement

```bash
# Installer les dépendances
bun install

# Lancer la base de données et appliquer les migrations
./dev-postrges.sh   # ou votre propre instance PostgreSQL
bun run migrate

# Lancer le serveur de développement
bun run dev
```

## Scripts utiles

| Script | Description |
|--------|-------------|
| `bun run dev` | Serveur de développement Vite |
| `bun run build` | Build de production |
| `bun run migrate` | Créer/appliquer les migrations Prisma |
| `bun run studio` | Ouvrir Prisma Studio |
| `bun run seed` | Exécuter le seed de la base |

## Structure

- `src/routes` – pages et API SvelteKit
- `src/lib` – composants, utils et logique métier
- `prisma/schema.prisma` – modèles de données (utilisateurs, organisations, compteurs, consommations, facturation)
