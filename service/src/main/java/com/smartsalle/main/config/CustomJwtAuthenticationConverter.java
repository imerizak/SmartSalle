package com.smartsalle.main.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String ROLE_CLAIM_NAME = "user_role"; // Ou le nom du claim utilisé par Supabase pour les rôles
    private static final String DEFAULT_ROLE_PREFIX = "ROLE_";

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        // Essayer d'extraire le rôle du claim "user_role" ou d'un autre claim pertinent
        // Supabase peut stocker le rôle dans app_metadata.role, user_metadata.role, ou un claim custom comme "user_role"
        // Il faut vérifier la configuration exacte de Supabase pour ce projet.
        // Pour cet exemple, nous utilisons "user_role" comme claim direct.

        Object rolesClaim = jwt.getClaim(ROLE_CLAIM_NAME);

        if (rolesClaim instanceof String) {
            // Si le rôle est une simple chaîne
            String role = (String) rolesClaim;
            if (role != null && !role.trim().isEmpty()) {
                return Collections.singletonList(new SimpleGrantedAuthority(DEFAULT_ROLE_PREFIX + role.toUpperCase()));
            }
        } else if (rolesClaim instanceof Collection) {
            // Si les rôles sont une collection de chaînes
            @SuppressWarnings("unchecked")
            Collection<String> roles = (Collection<String>) rolesClaim;
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority(DEFAULT_ROLE_PREFIX + role.toUpperCase()))
                    .collect(Collectors.toList());
        }
        
        // Si aucun rôle n'est trouvé ou si le format n'est pas géré, retourner une liste vide ou un rôle par défaut
        // Par exemple, on pourrait assigner un rôle "USER" par défaut si aucun rôle spécifique n'est trouvé.
        // Pour l'instant, on retourne une liste vide si le claim n'est pas trouvé ou mal formaté.
        return Collections.emptyList();
    }
}

