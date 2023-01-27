package com.opencbs.core.officedocuments.helpers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.officedocuments.domain.SourceEnum;
import com.opencbs.core.officedocuments.domain.TemplateItem;

import java.io.IOException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TemplateHelper {
    public static <T extends Object> T getObjectFromJson(String json, Class<T> clazz) throws IOException {
        return new ObjectMapper().readValue(json, clazz);
    }

    public static Optional<TemplateItem> createTemplateItem(String sourceTemplate) {
        Pattern pattern = Pattern.compile("(?<template>(\\((?<command>[^\\]\\[]+)\\))? ?\\[(?<key>[^\\.\\] ]+)\\.(?<name>[^\\]\\(]+)(\\((?<format>[^/)]*)\\))?\\])");
        Matcher matcher = pattern.matcher(sourceTemplate);

        if (!matcher.find()) return Optional.empty();

        TemplateItem templateItem = new TemplateItem();
        templateItem.setTemplate(matcher.group("template"));
        SourceEnum key = SourceEnum.getByName(matcher.group("key"));
        templateItem.setKey(key);
        templateItem.setName(matcher.group("name"));
        templateItem.setFormat(matcher.group("format"));
        templateItem.setCommand(matcher.group("command"));
        templateItem.setApplied(false);
        return Optional.of(templateItem);
    }
}
