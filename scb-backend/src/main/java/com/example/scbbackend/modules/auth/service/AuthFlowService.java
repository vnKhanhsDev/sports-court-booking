package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.modules.auth.enums.AuthFlowStep;
import com.example.scbbackend.modules.user.entity.Account;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthFlowService {

    public List<AuthFlowStep> determineRegisterSteps(Account account) {
        List<AuthFlowStep> steps = new ArrayList<>();

        steps.add(AuthFlowStep.OTP);

        if (account == null) {
            steps.add(AuthFlowStep.PERSONAL_INFO);
            steps.add(AuthFlowStep.CREATE_PASSWORD);
            steps.add(AuthFlowStep.SUCCESS);
            return steps;
        }

        steps.add(AuthFlowStep.PERSONAL_INFO);
        steps.add(AuthFlowStep.SUCCESS);
        return steps;
    }

}
