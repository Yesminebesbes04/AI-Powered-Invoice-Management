package com.invoice.invoice_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.invoice.invoice_system.dto.CreateUserRequest;
import com.invoice.invoice_system.entity.User;
import com.invoice.invoice_system.repository.UserRepository;
import com.invoice.invoice_system.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserController(
            UserRepository userRepository,
            AuthService authService) {

        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @Valid @RequestBody CreateUserRequest request) {

        User user = authService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable Long id) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        System.out.println(
                "USER FOUND = " + user);

        if (user != null &&
                !"ADMIN".equals(user.getRole())) {

            System.out.println(
                    "DELETING USER = "
                    + user.getUsername());

            userRepository.deleteById(id);

            System.out.println(
                    "DELETE EXECUTED");
        }
    }

    @PutMapping("/{id}/role")
    public User changeRole(
            @PathVariable Long id) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        if (user == null) {
            return null;
        }

        if ("ADMIN".equals(user.getRole())) {

            user.setRole("USER");

        } else {

            user.setRole("ADMIN");
        }

        return userRepository.save(user);
    }
}