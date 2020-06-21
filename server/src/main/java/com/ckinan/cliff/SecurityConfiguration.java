package com.ckinan.cliff;

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

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomUsernamePasswordAuthenticationFilter cupaf = new CustomUsernamePasswordAuthenticationFilter();
        cupaf.setAuthenticationSuccessHandler(new CustomAuthenticationSuccessHandler());
        cupaf.setAuthenticationFailureHandler(new CustomAuthenticationFailureHandler());
        cupaf.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login", "POST"));
        cupaf.setAuthenticationManager(authenticationManager());

        final CorsConfiguration cc = new CorsConfiguration();
        cc.setAllowedOrigins(Arrays.asList("http://localhost:7000"));
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
