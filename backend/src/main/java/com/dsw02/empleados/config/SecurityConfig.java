package com.dsw02.empleados.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/health").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/empleados/**").hasAnyRole("ADMIN", "USER")
                    .requestMatchers(HttpMethod.GET, "/api/v1/departamentos/**").hasAnyRole("ADMIN", "USER")
                    .requestMatchers(HttpMethod.POST, "/api/v1/empleados/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/v1/departamentos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/empleados/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/departamentos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/empleados/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/departamentos/**").hasRole("ADMIN")
                    .requestMatchers("/api/v1/**").authenticated()
                    .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
