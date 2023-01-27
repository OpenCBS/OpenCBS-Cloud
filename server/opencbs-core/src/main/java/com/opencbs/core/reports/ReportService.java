package com.opencbs.core.reports;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReportService<T, R> {

    List<T> getDocumentsByPoint(String point) throws Exception;

    List<T> getDocumentBySearch(String search);

    List<T> getDocumentsByGroup(String group);

    ResponseEntity getDocuments(R request) throws Exception;
}
