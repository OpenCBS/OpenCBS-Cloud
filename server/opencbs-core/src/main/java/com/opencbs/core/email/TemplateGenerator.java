package com.opencbs.core.email;

import com.opencbs.core.helpers.FileProvider;
import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.SneakyThrows;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;

public class TemplateGenerator {

    @SneakyThrows
    public static String getContent(String templateName, Map<String, Object> variables) {
        final String emailTemplate = FileProvider.getEmail(templateName);
        Template template = new Template("name", new StringReader(emailTemplate),
                new Configuration(Configuration.VERSION_2_3_26));

        StringWriter stringWriter = new StringWriter();
        template.process(variables, stringWriter);

        return stringWriter.toString();
    }
}