package com.opencbs.core.email.impl;

import com.opencbs.core.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;

import java.util.Collection;

@RequiredArgsConstructor
@Component
public class EmailServiceImpl implements EmailService {

    @Value(value = "${email.sender}")
    private String sender;

    @Value(value = "${spring.mail.username}")
    private String senderEmail;

    private final JavaMailSender emailSender;


    public void sendEmail(Collection<String> recipients, String subject, String text) {
        String[] to = new String[recipients.size()];
        MimeMessagePreparator message = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            mimeMessage.setFrom(String.format("%s<%s>", sender, senderEmail));
            messageHelper.setTo(recipients.toArray(to));
            messageHelper.setSubject(subject);
            messageHelper.setText(text, true);
        };
        emailSender.send(message);
    }
}