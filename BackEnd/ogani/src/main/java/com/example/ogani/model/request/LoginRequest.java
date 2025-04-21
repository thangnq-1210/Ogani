package com.example.ogani.model.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotNull(message = "Email rỗng")
    @NotEmpty(message = "Email rỗng")
    @Email(message = "Email không hợp lệ")
    @Schema(description = "Email", example = "admin@gmail.com")
    private String email;

    @NotNull(message = "Mật khẩu rỗng")
    @NotEmpty(message = "Mật khẩu rỗng")
    @Size(min = 6, max = 30, message = "Mật khẩu có từ 6-30 ký tự")
    @Schema(description = "Mật khẩu", example = "123456")
    private String password;
}

