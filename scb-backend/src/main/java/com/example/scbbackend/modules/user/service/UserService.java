package com.example.scbbackend.modules.user.service;

import com.example.scbbackend.modules.user.dto.request.UserCreationRequest;
import com.example.scbbackend.modules.user.dto.response.UserRegistrationResponse;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.UserProfile;
import com.example.scbbackend.modules.user.enums.Gender;
import com.example.scbbackend.modules.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AccountService accountService;
    private final UserProfileRepository userProfileRepository;

    @Transactional
    public void createUser(UserCreationRequest request) {
        Account account = accountService.createAccount(request);

        userProfileRepository.save(
                UserProfile.builder()
                        .account(account)
                        .fullName(request.fullName())
                        .gender(Gender.fromString(request.gender()))
                        .dob(request.dob())
                        .build()
        );
    }

    @Transactional(readOnly = true)
    public UserRegistrationResponse getUserRegistration(String contact) {
        Account account = accountService.findAccountByContact(contact);

        if (account == null) return null;

        UserProfile profile = account.getUserProfile();

        return UserRegistrationResponse.builder()
                .accountId(account.getId())
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .dob(profile.getDob())
                .build();
    }

}
