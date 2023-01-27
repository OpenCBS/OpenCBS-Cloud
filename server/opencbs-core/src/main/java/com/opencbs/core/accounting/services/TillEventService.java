package com.opencbs.core.accounting.services;

import com.opencbs.core.domain.till.TillEvent;
import com.opencbs.core.accounting.repositories.TillEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class TillEventService {
    private final TillEventRepository tillEventRepository;

    @Autowired
    public TillEventService(TillEventRepository tillEventRepository) {
        this.tillEventRepository = tillEventRepository;
    }

    @Transactional
    public TillEvent create(TillEvent tillEvent) {
        return this.tillEventRepository.save(tillEvent);
    }
}
