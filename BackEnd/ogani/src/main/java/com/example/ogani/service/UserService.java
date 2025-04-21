package com.example.ogani.service;

import com.example.ogani.entity.User;
import com.example.ogani.model.request.ChangePasswordRequest;
import com.example.ogani.model.request.CreateUserRequest;
import com.example.ogani.model.request.UpdateProfileRequest;
import com.example.ogani.model.response.MessageResponse;

public interface UserService {
    
    void register(CreateUserRequest request);


    User getUserByUsername(String username);

    User updateUser(UpdateProfileRequest request);

    void changePassword(ChangePasswordRequest request);

    MessageResponse forgotPassword(String email);

    MessageResponse resetPassword(String token, String password);
}
