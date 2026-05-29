package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.infrastructure.mail.MailService;
import com.example.scbbackend.modules.auth.enums.OtpType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final MailService mailService;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String HASH_KEY_CODE = "code";
    private static final String HASH_KEY_ATTEMPTS = "attempts";
    private static final int EXPIRY_MINUTES = 3;
    private static final int MAX_ATTEMPTS = 5;

    private String generateRedisKey(String identifier, OtpType type) {
        return String.format("otp:%s:%s", type.name().toLowerCase(), identifier);
    }

    public void generateAndSaveOtp(String identifier, OtpType type) {
        String redisKey = generateRedisKey(identifier, type);

        String otpCode = String.valueOf(100000 + new Random().nextInt(900000));

        redisTemplate.opsForHash().put(redisKey, HASH_KEY_CODE, otpCode);
        redisTemplate.opsForHash().put(redisKey, HASH_KEY_ATTEMPTS, "0");

        redisTemplate.expire(redisKey, EXPIRY_MINUTES, TimeUnit.MINUTES);

        mailService.sendOtpForRegistration(identifier, otpCode);
    }

    public boolean verifyOtp(String identifier, OtpType type, String code) {
        String redisKey = generateRedisKey(identifier, type);

        Map<Object, Object> otpData = redisTemplate.opsForHash().entries(redisKey);

        if (otpData.isEmpty()) {
            throw new AppException(ApiCode.OTP_INVALID);
        }

        String storedCode = (String) otpData.get(HASH_KEY_CODE);
        int currentAttempts = Integer.parseInt((String) otpData.get(HASH_KEY_ATTEMPTS));

        if (currentAttempts >= MAX_ATTEMPTS) {
            throw new AppException(ApiCode.OTP_MAX_ATTEMPTS);
        }

        if (!code.equals(storedCode)) {
            redisTemplate.opsForHash().increment(redisKey, HASH_KEY_ATTEMPTS, 1);

            Long remainingTimeToLive = redisTemplate.getExpire(redisKey, TimeUnit.MINUTES);
            if (remainingTimeToLive != null && remainingTimeToLive > 0) {
                redisTemplate.expire(redisKey, remainingTimeToLive, TimeUnit.MINUTES);
            }

            throw new AppException(ApiCode.OTP_INCORRECT);
        }

        redisTemplate.delete(redisKey);
        return true;
    }

}
