package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.auth.entity.OtpCode;
import com.example.scbbackend.modules.auth.enums.OtpChannel;
import com.example.scbbackend.modules.auth.enums.OtpType;
import com.example.scbbackend.modules.auth.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpCodeService {

    private final int EXPIRY_MINUTES = 5;
    private final int MAX_ATTEMPTS = 5;

    private final OtpCodeRepository otpCodeRepository;
    private final JavaMailSender javaMailSender;

    @Transactional
    public void sendOtpCode(String contact, OtpType type) {
        otpCodeRepository.findAllByContactAndTypeAndUsedFalse(contact, type)
                .forEach(otpCode -> {
                    otpCode.setUsed(true);
                    otpCodeRepository.save(otpCode);
                });

        OtpChannel channel = contact.contains("@") ? OtpChannel.EMAIL : OtpChannel.PHONE;
        String code = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(EXPIRY_MINUTES);

        otpCodeRepository.save(
                OtpCode.builder()
                        .contact(contact)
                        .code(code)
                        .channel(channel)
                        .type(type)
                        .expiryAt(expiry)
                        .build());

        sendViaChannel(contact, channel, code);
    }

    private void sendViaChannel(String contact, OtpChannel channel, String code) {
        switch (channel) {
            case OtpChannel.EMAIL -> sendEmail(contact, code);
            case OtpChannel.PHONE -> sendSms(contact, code);
            default -> throw new AppException(ApiCode.OTP_CHANNEL_INVALID);
        }
    }

    private void sendEmail(String email, String code) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject("OTP CODE");
        mailMessage.setText(code);
        javaMailSender.send(mailMessage);
    }

    private void sendSms(String phone, String code) {
        log.info("Send OTP via sms (pending development)");
    }

    @Transactional(noRollbackFor = AppException.class)
    public void verifyOtpCode(String contact, OtpType type, String code) {
        OtpCode otpCode = otpCodeRepository
                .findTopByContactAndTypeAndUsedFalseOrderByCreatedAtDesc(contact, type)
                .orElseThrow(() -> new AppException(ApiCode.OTP_INVALID));

        if (otpCode.getExpiryAt().isBefore(LocalDateTime.now()))
            throw new AppException(ApiCode.OTP_EXPIRED);

        otpCode.setAttempts(otpCode.getAttempts() + 1);
        otpCodeRepository.save(otpCode);

        if (otpCode.getAttempts() > MAX_ATTEMPTS)
            throw new AppException(ApiCode.OTP_MAX_ATTEMPTS);

        if (!otpCode.getCode().equals(code))
            throw new AppException(ApiCode.OTP_INCORRECT);

        otpCode.setUsed(true);
        otpCodeRepository.save(otpCode);
    }

    @Transactional
    public void resendOtpCode(String contact, String typeStr) {
        OtpType type = OtpType.fromString(typeStr);
        sendOtpCode(contact, type);
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanupExpiredOtpCode() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(EXPIRY_MINUTES);
        otpCodeRepository.deleteByExpiryAtBeforeAndUsedFalse(threshold);
    }

}
