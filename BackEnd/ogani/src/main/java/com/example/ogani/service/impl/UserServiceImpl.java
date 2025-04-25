package com.example.ogani.service.impl;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import com.example.ogani.model.response.MessageResponse;
import com.example.ogani.security.jwt.JwtUtils;
import com.example.ogani.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ogani.entity.ERole;
import com.example.ogani.entity.Role;
import com.example.ogani.entity.User;
import com.example.ogani.exception.BadRequestException;
import com.example.ogani.exception.NotFoundException;
import com.example.ogani.model.request.ChangePasswordRequest;
import com.example.ogani.model.request.CreateUserRequest;
import com.example.ogani.model.request.UpdateProfileRequest;
import com.example.ogani.repository.RoleRepository;
import com.example.ogani.repository.UserRepository;
import com.example.ogani.service.UserService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void register(CreateUserRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.isEnabled()) {
                throw new IllegalArgumentException("Email already registered.");
            } else {
                String token = jwtUtils.generateConfirmToken(request.getEmail());
                String resetLink = "http://localhost:4200/authenticate?token=" + token;
                emailService.sendResetPasswordEmail("Xác thực lại email", user.getEmail(), resetLink);
                return;
            }
        }
        // TODO Auto-generated method stub
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        user.setEnabled(false);
        userRepository.save(user);
        String token = jwtUtils.generateConfirmToken(request.getEmail());
        String resetLink = "http://localhost:4200/authenticate?token=" + token;
        emailService.sendResetPasswordEmail("Xác thực email", user.getEmail(), resetLink);
    }

    @Override
    public User getUserByUsername(String username) {
        // TODO Auto-generated method stub
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User"));
        return user;
    }

    @Override
    public User updateUser(UpdateProfileRequest request) {
        // TODO Auto-generated method stub
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User"));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return user;
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        // TODO Auto-generated method stub
        // User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User"));

        // if(encoder.encode(request.getOldPassword()) != user.getPassword()){
        //   throw new BadRequestException("Old Passrword Not Same");
        // }
        // user.setPassword(encoder.encode(request.getNewPassword()));

        // userRepository.save(user);

    }

    @Override
    public MessageResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Not found user"));
        String token = jwtUtils.generateResetToken(user.getEmail());
        String resetLink = "http://localhost:4200/reset-password?token=" + token;
        emailService.sendResetPasswordEmail("Đặt lại mật khẩu", user.getEmail(), resetLink);
        return new MessageResponse("Email da duoc gui!");
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(String token, String password) {
        // Kiểm tra token hợp lệ
        if (!jwtUtils.validateResetToken(token)) {
            throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn.");
        }

        // Lấy email từ token
        String email = jwtUtils.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        // Cập nhật mật khẩu mới
        user.setPassword(encoder.encode(password));
        userRepository.save(user);

        return new MessageResponse("Mat khau thay doi thanh cong!");
    }

    @Override
    public MessageResponse confirmEmail(String token) {
        if (!jwtUtils.validateConfirmToken(token)) {
            throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn.");
        }
        String email = jwtUtils.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        user.setEnabled(true);
        userRepository.save(user);
        return new MessageResponse("Account verified. You can now login.");
    }
}
