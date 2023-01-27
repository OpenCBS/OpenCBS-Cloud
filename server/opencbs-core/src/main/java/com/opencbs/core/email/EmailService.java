package com.opencbs.core.email;

import java.util.Collection;

public interface EmailService {
    void sendEmail(Collection<String> recipients, String subject, String text);
}

