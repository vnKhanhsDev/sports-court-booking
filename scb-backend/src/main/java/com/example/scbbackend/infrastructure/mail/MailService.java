package com.example.scbbackend.infrastructure.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Async(value = "mailExecutor")
    public void sendOtpForRegistration(String toEmail, String code) {
        String subject = "Mã OTP xác thực đăng ký tài khoản";
        String content = "Mã OTP là: " + code;
        sendMail(toEmail, subject, content);
    }

    // =====================================
    // PRIVATE HELPER METHODS
    // =====================================

    private void sendMail(String toEmail, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
            log.info("Mail sent to [{}] subject=\"{}\"", toEmail, subject);
        } catch (MessagingException ex) {
            log.error("Failed to send mail to [{}]: {}", toEmail, ex.getMessage(), ex);
        }
    }

}
