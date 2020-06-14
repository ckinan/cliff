package com.ckinan.cliff;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomUsernamePasswordAuthenticationFilter cupaf = new CustomUsernamePasswordAuthenticationFilter();
        cupaf.setAuthenticationManager(authenticationManager());
        http
                //.csrf().csrfTokenRepository(new CookieCsrfTokenRepository() | HttpSessionCsrfTokenRepository)
                .addFilterBefore(
                        cupaf,
                        UsernamePasswordAuthenticationFilter.class)
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/resource").hasRole("USER")
                .antMatchers(HttpMethod.GET, "/me").hasRole("USER")
                .antMatchers(HttpMethod.POST, "/login").permitAll()
                .anyRequest().authenticated();
    }
}
