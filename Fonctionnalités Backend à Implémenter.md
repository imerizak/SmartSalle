# Fonctionnalités Backend à Implémenter

Ce document détaille les endpoints API à créer ou modifier pour le backend Java afin de supporter les fonctionnalités du frontend.

## 1. Gestion des Membres (Users avec rôle CLIENT)

**Modèle existant :** `User.java` (nécessite de gérer le `UserRole.CLIENT`)
**Repository existant :** `UserRepository.java` (pourra nécessiter des méthodes de recherche spécifiques)

**Nouveau Controller : `MemberController.java` (@RequestMapping("/api/members"))**
- `GET /` : Lister tous les membres (avec pagination et filtres : nom, email, statut d'adhésion).
- `POST /` : Créer un nouveau membre (gérer l'assignation du rôle CLIENT).
- `GET /{id}` : Récupérer un membre par son ID.
- `PUT /{id}` : Mettre à jour les informations d'un membre.
- `DELETE /{id}` : Supprimer un membre (ou le marquer comme inactif).

**Nouveau Service : `MemberService.java`**
- Logique métier pour toutes les opérations CRUD sur les membres.
- Validation des données.
- Gestion des relations (ex: adhésions).

## 2. Gestion des Coachs (Users avec rôle TRAINER)

**Modèle existant :** `User.java` (nécessite de gérer le `UserRole.TRAINER`)
**Repository existant :** `UserRepository.java`

**Nouveau Controller : `CoachController.java` (@RequestMapping("/api/coaches"))**
- `GET /` : Lister tous les coachs (avec pagination et filtres : nom, email, spécialités).
- `POST /` : Créer un nouveau coach (gérer l'assignation du rôle TRAINER, spécialités, bio, etc.).
- `GET /{id}` : Récupérer un coach par son ID.
- `PUT /{id}` : Mettre à jour les informations d'un coach.
- `DELETE /{id}` : Supprimer un coach.

**Nouveau Service : `CoachService.java`**
- Logique métier pour les coachs.

## 3. Gestion des Présences (Attendance)

**Nouveau Modèle : `AttendanceRecord.java`**
- `id: Long`
- `member: User` (référence à l'utilisateur membre)
- `checkInTime: LocalDateTime`
- `checkOutTime: LocalDateTime` (optionnel)
- `type: String` (ex: "Gym Session", "Yoga Class")
- `durationInMinutes: Integer` (calculé)

**Nouveau Controller : `AttendanceController.java` (@RequestMapping("/api/attendance"))**
- `GET /` : Lister tous les enregistrements de présence (avec filtres : membre ID, période, type).
- `POST /check-in` : Enregistrer un check-in pour un membre (via ID membre).
- `POST /check-out` : Enregistrer un check-out pour un membre (via ID membre ou ID d'enregistrement de présence).
- `GET /stats` : Récupérer des statistiques (visites totales, visiteurs uniques, durée moyenne).

**Nouveau Service : `AttendanceService.java`**
- Logique métier pour la gestion des présences.
- Calcul de la durée.

**Nouveau Repository : `AttendanceRepository.java`**

## 4. Gestion des Événements (Events)

**Nouveau Modèle : `Event.java`**
- `id: Long`
- `title: String`
- `description: String`
- `dateTime: LocalDateTime`
- `durationInMinutes: Integer`
- `capacity: Integer`
- `location: String`
- `instructor: User` (référence à l'utilisateur coach)
- `type: String` (ex: "workshop", "class")
- `status: String` (ex: "upcoming", "ongoing", "completed", "cancelled")

**Nouveau Modèle : `EventRegistration.java`** (pour gérer les inscriptions)
- `id: Long`
- `event: Event`
- `member: User`
- `registrationTime: LocalDateTime`

**Nouveau Controller : `EventController.java` (@RequestMapping("/api/events"))**
- `GET /` : Lister tous les événements (avec filtres : statut, type, date).
- `POST /` : Créer un nouvel événement.
- `GET /{id}` : Récupérer un événement par son ID.
- `PUT /{id}` : Mettre à jour un événement.
- `DELETE /{id}` : Supprimer un événement (ou le marquer comme annulé).
- `GET /{id}/registrations` : Lister les membres inscrits à un événement.
- `POST /{id}/register` : Inscrire le membre authentifié à un événement.
- `DELETE /{id}/unregister` : Désinscrire le membre authentifié d'un événement.

**Nouveau Service : `EventService.java`**
- Logique métier pour les événements et les inscriptions.
- Gestion de la capacité.
- Potentiellement, logique de notification (si gérée par le backend).

**Nouveaux Repositories : `EventRepository.java`, `EventRegistrationRepository.java`**

## 5. Gestion des Paiements (Payments)

**Modèle existant :** `Payment.java`, `Membership.java`
**Controller existant :** `PaymentController.java` (actuellement sur `/api/memberships`, à revoir ou compléter)
**Service existant :** `PaymentService.java`, `MembershipService.java`
**Repository existant :** `PaymentRepository.java`, `MembershipRepository.java`

**Améliorations pour `PaymentController.java` (ou nouveau controller @RequestMapping("/api/payments"))**
- `GET /` : Lister tous les paiements (avec filtres : membre ID, statut, période, type d'adhésion).
- `GET /{id}` : Récupérer un paiement par son ID.
- `POST /` : (Déjà existant pour `MembershipRequest` via `/api/memberships`) Créer un nouveau paiement (ex: pour un abonnement).
- `PUT /{id}/status` : Mettre à jour le statut d'un paiement (ex: marquer comme "paid").
- `GET /stats` : Récupérer des statistiques de paiements (montant total, payé, en attente).

**Améliorations pour `PaymentService.java`**
- Ajouter la logique pour les nouvelles opérations.

## 6. Authentification et Profil Utilisateur

- Le backend doit valider les JWT de Supabase en utilisant `SupabaseJwtFilter.java`.
- Le backend doit pouvoir récupérer l'utilisateur authentifié à partir du token JWT pour les opérations contextuelles (ex: inscription à un événement par l'utilisateur courant).
- Les opérations de création/modification de profil utilisateur (email, mot de passe) sont gérées par Supabase via le frontend. Le backend pourrait avoir besoin d'endpoints pour que l'admin modifie certaines données utilisateur non liées à l'auth (ex: rôle, prénom, nom) si ce n'est pas déjà couvert par Member/Coach controllers.

## 7. Paramètres (Settings)

- Les fonctionnalités exactes du panel "Settings" du frontend n'ont pas été explorées en détail.
- Si des paramètres applicatifs ou spécifiques à l'utilisateur (non gérés par le profil Supabase) doivent être sauvegardés, des endpoints dédiés seront nécessaires.
  - Ex: `GET /api/settings/user`, `PUT /api/settings/user`
  - Ex: `GET /api/settings/application`, `PUT /api/settings/application` (pour admin)

## Structure Générale des Controllers
- Utiliser `@RestController`
- Utiliser `@RequestMapping` au niveau de la classe.
- Injecter les services via constructeur.
- Gérer les exceptions avec `@ExceptionHandler` ou un `ControllerAdvice` global.
- Retourner des `ResponseEntity` pour contrôler le statut HTTP et le corps de la réponse.
- Utiliser des DTOs (Data Transfer Objects) pour les requêtes et réponses si nécessaire pour découpler l'API des modèles d'entité et pour la validation.

