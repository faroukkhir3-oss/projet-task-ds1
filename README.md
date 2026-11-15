# API REST de Gestion de Projets et Tâches

DS1 - Mini-Projet - ISIDS (Express.js + MongoDB)

## Auteurs
<<<<<<< HEAD
- omar farouk khemir
- 
=======
-Omar Farouk Khemir

>>>>>>> 171e4f9 (feat: MongoDB connection w base express server)

## Installation
```bash
npm install
cp .env.example .env      # puis modifier JWT_SECRET et MONGO_URI
npm run dev
```

## Authentification
Header : `Authorization: Bearer <token>`

| Méthode | Route | Description | Accès |
|---|---|---|---|
| POST | /api/auth/register | Inscription (nom, login, motDePasse, role) | Public |
| POST | /api/auth/login | Connexion, retourne un JWT | Public |
| GET | /api/auth/me | Profil connecté | Authentifié |

## Projets
| Méthode | Route | Description | Accès |
|---|---|---|---|
| POST | /api/projects | Créer un projet | user, manager |
| GET | /api/projects | Lister (user : les siens, manager : tous) | user, manager |
| GET | /api/projects/:id | Détail | propriétaire / manager |
| PUT | /api/projects/:id | Modifier | propriétaire / manager |
| DELETE | /api/projects/:id | Supprimer (+ ses tâches) | propriétaire / manager |

Recherche/tri : `?search=mot&statut=en cours&sort=-dateCreation,nom`

## Tâches
| Méthode | Route | Description | Accès |
|---|---|---|---|
| POST | /api/projects/:projectId/tasks | Créer une tâche | user, manager |
| GET | /api/projects/:projectId/tasks | Tâches d'un projet | selon droits |
| GET | /api/tasks | Toutes les tâches accessibles | selon droits |
| GET | /api/tasks/:id | Détail | propriétaire du projet / assigné / manager |
| PUT | /api/tasks/:id | Modifier | idem |
| DELETE | /api/tasks/:id | Supprimer | idem |

- Statuts autorisés : `todo`, `doing`, `done`
- `assigneA` (affectation) : **manager uniquement**
- Recherche/tri/filtres : `?search=mot&statut=todo&projet=<id>&assigneA=<id>&deadlineAvant=2026-12-31&sort=deadline,-titre`
