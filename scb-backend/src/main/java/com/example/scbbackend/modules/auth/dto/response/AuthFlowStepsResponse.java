package com.example.scbbackend.modules.auth.dto.response;

import com.example.scbbackend.modules.auth.enums.AuthFlowStep;

import java.util.List;

public record AuthFlowStepsResponse(
        List<AuthFlowStep> steps
) { }
