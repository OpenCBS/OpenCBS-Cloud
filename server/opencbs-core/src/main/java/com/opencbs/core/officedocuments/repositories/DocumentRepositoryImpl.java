package com.opencbs.core.officedocuments.repositories;

import com.opencbs.core.officedocuments.domain.Source;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.opencbs.core.officedocuments.helpers.TemplateHelper.getObjectFromJson;

@Repository
public class DocumentRepositoryImpl implements DocumentRepository {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DocumentRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Source> getJsonData(String script) throws IOException {
        List<String> results = this.jdbcTemplate.queryForList(script, String.class);
        List<Source> map = new ArrayList<>();

        if (results == null || results.isEmpty()) {
            return map;
        }

        for (String result : results) {
            if (result == null) {
                continue;
            }
            map.add(getObjectFromJson(result, Source.class));
        }
        return map;
    }

    @Override
    public Map<String, Object> getStaticJsonData(String script) throws IOException {
        List<String> t = this.jdbcTemplate.queryForList(script, String.class);
        if (t.isEmpty() || t.get(0) == null) {
            return new HashMap<>();
        }
        Source source = getObjectFromJson(t.get(0), Source.class);
        if (source.isEmpty()) {
            return new HashMap<>();
        }
        return source.get(0);
    }
}
