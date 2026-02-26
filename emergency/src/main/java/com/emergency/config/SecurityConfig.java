package com.emergency.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.emergency.security.JwtAuthFilter;
import com.emergency.security.JwtUtil;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
            		// ✅ PUBLIC
            	    .requestMatchers("/api/auth/**").permitAll()
            	    .requestMatchers(HttpMethod.POST, "/api/citizen/register").permitAll()
            	    .requestMatchers(HttpMethod.POST, "/api/contact/submit").permitAll()

            	    // 👤 CITIZEN
            	    .requestMatchers("/api/citizen/**").hasAuthority("CITIZEN")
            	    .requestMatchers("/api/user/**").hasAuthority("CITIZEN")

            	    // 🚓 POLICE
            	    .requestMatchers("/api/police/**").hasAuthority("POLICE")

            	    // 🏥 HOSPITAL
            	    .requestMatchers("/api/hospital/**").hasAuthority("HOSPITAL")

            	    // 👑 ADMIN
            	    .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
            	    .requestMatchers("/api/contact/admin/**").hasAuthority("ADMIN")

            	    // 💬 FEEDBACK
            	    .requestMatchers(HttpMethod.POST, "/api/feedback").authenticated()
            	    .requestMatchers(HttpMethod.GET, "/api/feedback").authenticated()

            	    .anyRequest().authenticated()
            )
            .addFilterBefore(
                new JwtAuthFilter(jwtUtil),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        http
//            .csrf(csrf -> csrf.disable())
//            .cors(Customizer.withDefaults())
//            .sessionManagement(session ->
//                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//            )
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/api/auth/**").permitAll()
//                .requestMatchers("/api/citizen/**").hasRole("CITIZEN")
//                .requestMatchers("/api/police/**").hasRole("POLICE")
//                .requestMatchers("/api/hospital/**").hasRole("HOSPITAL")
//                .requestMatchers("/api/admin/**").permitAll()
//                
//                .requestMatchers(HttpMethod.POST, "/api/feedback").authenticated()
//
//                .requestMatchers(HttpMethod.GET, "/api/feedback").authenticated()
//
//                .requestMatchers(HttpMethod.POST, "/api/contact/submit").permitAll()
//
//                .requestMatchers("/api/contact/admin/**").hasRole("ADMIN")
//
//                .anyRequest().authenticated()
//            )
//            .addFilterBefore(
//                new JwtAuthFilter(jwtUtil),
//                UsernamePasswordAuthenticationFilter.class
//            );
//
//        return http.build();
//    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
