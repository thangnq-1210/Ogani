package com.example.ogani.controller;

import com.example.ogani.service.GeminiService;
import com.example.ogani.entity.Product;
import com.example.ogani.repository.ProductRepository;
import com.example.ogani.service.impl.GeminiServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AIController {

    private final GeminiServiceImpl geminiService;
    private final ProductRepository productRepository;

    @PostMapping("/ask")
    public ResponseEntity<?> askAI(@RequestBody Map<String, String> request) {
        String question = request.get("question");

        try {
            String response = geminiService.getAnswer(question);
            return ResponseEntity.ok(Map.of("response", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi AI: " + e.getMessage()));
        }
    }
}
