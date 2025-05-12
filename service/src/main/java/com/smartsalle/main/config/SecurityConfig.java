package com.smartsalle.main.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Pour @PreAuthorize etc.
public class SecurityConfig {

    @Value("${supabase.jwt.secret}")
    private String jwtSecret;

    private final CustomJwtAuthenticationConverter customJwtAuthenticationConverter;

    public SecurityConfig(CustomJwtAuthenticationConverter customJwtAuthenticationConverter) {
        this.customJwtAuthenticationConverter = customJwtAuthenticationConverter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Désactiver CSRF car on utilise JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API Stateless
            .authorizeHttpRequests(authorize -> authorize
                // Configurer les endpoints publics ici si nécessaire (ex: /auth/**, /public/**)
                // .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                .anyRequest().authenticated() // Toutes les autres requêtes nécessitent une authentification
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(customJwtAuthenticationConverter)
                )
            ); // Configurer le serveur de ressources pour JWT et utiliser le converter custom

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(), "HS256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }

    // Optionnel: JwtEncoder si le backend doit aussi émettre des JWTs
    /*
    @Bean
    public JwtEncoder jwtEncoder() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(), "HS256");
        ImmutableSecret<com.nimbusds.jose.proc.SecurityContext> immutableSecret = new ImmutableSecret<>(key);
        return new NimbusJwtEncoder(immutableSecret);
    }
    */
}

