package com.example.ogani.service.impl;

import com.example.ogani.service.GeminiService;
import com.example.ogani.entity.Product;
import com.example.ogani.repository.ProductRepository;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class GeminiServiceImpl {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    private final ProductRepository productRepository;

    public GeminiServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public String getAnswer(String question) {
        if (question.toLowerCase().contains("giá")) {
            return getProductPrice(question);
        } else if (question.toLowerCase().contains("chi tiết")) {
            return getProductDetails(question);
        } else {
            return getGeminiResponse(question);
        }
    }

    private String getProductPrice(String question) {
        for (Product product : productRepository.findAll()) {
            if (question.toLowerCase().contains(product.getName().toLowerCase())) {
                return "Giá của " + product.getName() + " là " + product.getPrice() + " VND";
            }
        }
        return "Câu hỏi này của bạn khó quá. Bạn tra Chat GPT xem.";
    }

    private String getProductDetails(String question) {
        for (Product product : productRepository.findAll()) {
            if (question.toLowerCase().contains(product.getName().toLowerCase())) {
                return "Thông tin chi tiết của " + product.getName() + ":\n" +
                        "" + product.getDescription() + "\n" +
                        "Giá: " + product.getPrice() + " VND\n" +
                        ". Bạn đặt online về ăn đi, tốt cho sức khỏe lắm. Tôi ăn rồi, rất ngon, rẻ nữa!";
            }
        }
        return "Câu hỏi này của bạn khó quá. Bạn tra Chat GPT xem.";
    }


public String getGeminiResponse(String question) {
    try {
        URL url = new URL(API_URL + apiKey);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String inputJson = """
                {
                  "contents": [
                    {
                      "parts": [
                        { "text": "%s" }
                      ]
                    }
                  ]
                }
                """.formatted(question);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(inputJson.getBytes(StandardCharsets.UTF_8));
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            response.append(line.trim());
        }

        String responseString = response.toString();

        JsonObject jsonResponse = JsonParser.parseString(responseString).getAsJsonObject();
        JsonArray candidates = jsonResponse.getAsJsonArray("candidates");

        if (candidates.size() > 0) {
            JsonObject candidate = candidates.get(0).getAsJsonObject();
            JsonObject content = candidate.getAsJsonObject("content");
            JsonArray parts = content.getAsJsonArray("parts");

            if (parts.size() > 0) {
                return parts.get(0).getAsJsonObject().get("text").getAsString();
            }
        }

        return "Không có câu trả lời từ AI.";

    } catch (IOException e) {
        log.error("Lỗi khi gọi Gemini API: {}", e.getMessage());
        return "Lỗi khi gọi AI: " + e.getMessage();
    }
}
}

