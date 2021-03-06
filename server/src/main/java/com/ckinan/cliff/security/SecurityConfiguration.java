package com.ckinan.cliff.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Value("${client.url}")
    private String CLIENT_URL;

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfiguration.class);

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        LOGGER.info("CLIENT_URL -> " + CLIENT_URL);
        CustomUsernamePasswordAuthenticationFilter cupaf = new CustomUsernamePasswordAuthenticationFilter();
        cupaf.setAuthenticationSuccessHandler(new CustomAuthenticationSuccessHandler());
        cupaf.setAuthenticationFailureHandler(new CustomAuthenticationFailureHandler());
        cupaf.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login", "POST"));
        cupaf.setAuthenticationManager(authenticationManager());

        final CorsConfiguration cc = new CorsConfiguration();
        cc.setAllowedOrigins(Arrays.asList(CLIENT_URL));
        cc.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        cc.setAllowedHeaders(Collections.unmodifiableList(Collections.singletonList("*")));
        cc.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource ubccs = new UrlBasedCorsConfigurationSource();
        ubccs.registerCorsConfiguration("/**", cc);

        http
                //.csrf().csrfTokenRepository(new CookieCsrfTokenRepository() | HttpSessionCsrfTokenRepository)
                .addFilterBefore(
                        cupaf,
                        UsernamePasswordAuthenticationFilter.class)
                .csrf().disable()
                .cors().configurationSource(ubccs)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/me").hasRole("USER")
                .antMatchers(HttpMethod.GET, "/api/tracks").hasRole("USER")
                .antMatchers(HttpMethod.POST, "/api/track").hasRole("USER")
                .antMatchers(HttpMethod.POST, "/api/login").permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                .and()
                .logout().logoutUrl("/api/logout").logoutSuccessHandler(new CustomLogoutSuccessHandler());
    }

}
