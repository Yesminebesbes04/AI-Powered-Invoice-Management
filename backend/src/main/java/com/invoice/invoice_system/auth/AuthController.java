package com.invoice.invoice_system.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.invoice_system.dto.AuthResponse;
import com.invoice.invoice_system.dto.LoginRequest;
import com.invoice.invoice_system.dto.RegisterRequest;
import com.invoice.invoice_system.entity.User;
import com.invoice.invoice_system.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        String token = authService.login(
                request.getUsername(),
                request.getPassword());

        User user = authService.getUserByUsername(
                request.getUsername());

        return new AuthResponse(
                token,
                user.getRole());
    }
}