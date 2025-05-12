# Documentation de la Sécurité JWT et Gestion des Rôles avec Supabase

## Introduction

Ce document décrit la configuration de la sécurité basée sur les JSON Web Tokens (JWT) émis par Supabase et la gestion des rôles utilisateurs dans l'application backend Java SmartSalle. L'objectif est de valider les tokens JWT, d'extraire les rôles des utilisateurs et de sécuriser les endpoints de l'API en fonction de ces rôles.

## 1. Configuration de Spring Security pour JWT Supabase

L'application Spring Boot est configurée pour agir comme un serveur de ressources OAuth2, validant les JWT émis par Supabase.

### Dépendances Maven

Les dépendances suivantes sont utilisées dans le `pom.xml` :

*   `spring-boot-starter-security`
*   `spring-boot-starter-oauth2-resource-server`
*   `io.jsonwebtoken/jjwt` (bien que Spring Security 3+ utilise Nimbus JOSE JWT par défaut pour la validation, `jjwt` pourrait être utilisé pour d'autres opérations JWT si nécessaire, mais la configuration actuelle se base sur Nimbus).

### Configuration Java (`SecurityConfig.java`)

Le fichier `src/main/java/com/smartsalle/main/config/SecurityConfig.java` contient la configuration principale de la sécurité :

*   **`@EnableWebSecurity`** et **`@EnableMethodSecurity(prePostEnabled = true)`** : Activent la sécurité web Spring et la sécurité au niveau des méthodes (pour les annotations `@PreAuthorize`).
*   **`SecurityFilterChain` Bean** :
    *   Désactive CSRF (Cross-Site Request Forgery) car l'API est stateless et utilise des tokens JWT.
    *   Configure la gestion de session en `STATELESS`.
    *   Définit que toutes les requêtes (`anyRequest().authenticated()`) nécessitent une authentification, sauf celles explicitement autorisées (non configuré pour l'instant, mais possible via `requestMatchers(...).permitAll()`).
    *   Configure le serveur de ressources OAuth2 pour utiliser JWT (`oauth2ResourceServer(oauth2 -> oauth2.jwt(...))`).
    *   Intègre un `CustomJwtAuthenticationConverter` pour extraire les rôles du JWT.
*   **`JwtDecoder` Bean** :
    *   Configure un `NimbusJwtDecoder` pour valider les tokens JWT signés avec l'algorithme HS256.
    *   Utilise un secret (`supabase.jwt.secret`) récupéré depuis les propriétés de l'application (`application.properties` ou variables d'environnement).

### Configuration du Secret JWT Supabase

Le secret JWT utilisé par Supabase pour signer les tokens doit être configuré dans le fichier `src/main/resources/application.properties` (ou via une variable d'environnement) :

```properties
supabase.jwt.secret=VOTRE_SECRET_JWT_SUPABASE_ICI
```

**Important** : Ce secret est critique pour la sécurité. Il doit être long, complexe et gardé confidentiel. Ne le committez jamais directement dans un dépôt de code public. Utilisez des variables d'environnement en production.

## 2. Extraction et Mapping des Rôles

### `CustomJwtAuthenticationConverter.java`

Un converter personnalisé, `src/main/java/com/smartsalle/main/config/CustomJwtAuthenticationConverter.java`, est utilisé pour extraire les rôles du token JWT et les convertir en `GrantedAuthority` pour Spring Security.

*   Il lit un claim spécifique du JWT (par défaut `user_role`) qui est supposé contenir le rôle de l'utilisateur (ex: "ADMIN", "TRAINER", "CLIENT"). Ce claim doit être configuré dans Supabase via les "Custom Claims" lors de l'émission du token.
*   Les rôles extraits sont préfixés par `ROLE_` (convention Spring Security) et convertis en `SimpleGrantedAuthority`.
*   Si le claim contient une chaîne unique, un seul rôle est assigné. S'il contient une collection de chaînes, plusieurs rôles peuvent être assignés.

### Configuration du Claim de Rôle dans Supabase

Pour que le backend puisse extraire les rôles, vous devez configurer Supabase pour inclure un claim personnalisé (par exemple, `user_role`) dans les JWT émis. Cela se fait généralement via les "Auth Hooks" de Supabase, en particulier le "Custom Access Token Hook".

Exemple de fonction SQL pour un Auth Hook dans Supabase :

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.app_role; -- Supposant que vous avez une table user_roles et un type app_role
  begin
    select role into user_role from public.user_roles where user_id = (event->>
'user_id
')::uuid;

    claims := event->
'claims
';

    if user_role is not null then
      claims := jsonb_set(claims, 
'{user_role}
', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, 
'{user_role}
', 
'null
'); -- ou un rôle par défaut
    end if;

    -- Injecter l'ID utilisateur interne (si différent du sub UUID de Supabase)
    -- Supposons que votre table users a un id (bigint) et un supabase_uuid (uuid)
    -- declare
    --  internal_user_id bigint;
    -- begin
    --   select id into internal_user_id from public.users where supabase_uuid = (event->>
'user_id
')::uuid;
    --   if internal_user_id is not null then
    --     claims := jsonb_set(claims, 
'{userId}
', to_jsonb(internal_user_id));
    --   end if;
    -- end;

    event := jsonb_set(event, 
'{claims}
', claims);
    return event;
  end;
$$;
```

**Note sur `userId` Claim** : Pour que les fonctionnalités comme `getUserIdFromAuthentication` dans `EventController` fonctionnent correctement et récupèrent l'ID utilisateur interne (type `Long`), il est crucial d'ajouter un claim `userId` au JWT via le hook Supabase, contenant cet ID interne.

## 3. Sécurisation des Endpoints

Les endpoints de l'API sont sécurisés en utilisant les annotations `@PreAuthorize` au niveau des méthodes des contrôleurs. Ces annotations utilisent Spring Expression Language (SpEL) pour définir les conditions d'accès basées sur les rôles.

Exemples d'utilisation :

*   `@PreAuthorize("hasRole(\'ADMIN\')")` : Autorise l'accès uniquement aux utilisateurs ayant le rôle `ADMIN`.
*   `@PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')")` : Autorise l'accès aux utilisateurs ayant le rôle `ADMIN` ou `TRAINER`.
*   `@PreAuthorize("isAuthenticated()")` : Autorise l'accès à tout utilisateur authentifié, quel que soit son rôle.
*   Conditions plus complexes : `@PreAuthorize("hasRole(\'CLIENT\') and @paymentService.isOwner(authentication, #id)")` : Autorise un `CLIENT` si une méthode de service (`isOwner`) confirme qu'il est le propriétaire de la ressource.

Les rôles attendus dans les annotations sont les noms courts (ex: "ADMIN"), le préfixe `ROLE_` est géré par Spring Security.

## 4. Gestion des Erreurs d'Accès

*   Si un utilisateur non authentifié tente d'accéder à un endpoint sécurisé, une réponse `401 Unauthorized` est retournée.
*   Si un utilisateur authentifié tente d'accéder à un endpoint pour lequel il n'a pas les rôles requis, une réponse `403 Forbidden` est retournée. Un `ExceptionHandler` pour `AccessDeniedException` a été ajouté dans les contrôleurs pour personnaliser ce message si besoin.

## 5. Points Importants pour l'Intégration

1.  **Configuration du Secret JWT** : Assurez-vous que `supabase.jwt.secret` est correctement configuré et sécurisé.
2.  **Custom Claims dans Supabase** : Configurez le "Custom Access Token Hook" dans Supabase pour injecter le claim `user_role` (et `userId` si vous utilisez un ID interne différent du `sub` de Supabase) dans les JWT.
3.  **Cohérence des Rôles** : Les noms de rôles utilisés dans le backend (`ADMIN`, `TRAINER`, `CLIENT`) doivent correspondre à ceux définis et injectés par Supabase dans le claim `user_role`.
4.  **Mapping `userId`** : Si votre modèle `User` interne utilise un ID de type `Long` et que le `sub` du JWT Supabase est un UUID, vous devez impérativement injecter un claim `userId` (contenant l'ID `Long`) dans le JWT via le hook Supabase pour que les logiques de vérification de propriété (ex: un client accédant à ses propres données) fonctionnent correctement.

## Conclusion

Cette configuration fournit une base solide pour sécuriser votre API backend Java en utilisant les JWT et les rôles gérés par Supabase. Des tests approfondis sont nécessaires pour valider tous les scénarios d'accès.
