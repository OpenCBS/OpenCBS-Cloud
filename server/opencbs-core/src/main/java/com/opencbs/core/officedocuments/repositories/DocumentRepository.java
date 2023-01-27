package com.opencbs.core.officedocuments.repositories;

import com.opencbs.core.officedocuments.domain.Source;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Repository
public interface DocumentRepository {
    List<Source> getJsonData(String script) throws IOException;
    Map<String, Object> getStaticJsonData(String script) throws IOException;
}
