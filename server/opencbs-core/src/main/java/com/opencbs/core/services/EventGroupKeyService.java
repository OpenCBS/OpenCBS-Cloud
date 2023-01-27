package com.opencbs.core.services;

import com.opencbs.core.repositories.implementations.EventGroupKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventGroupKeyService {
    private EventGroupKeyRepository eventGroupKeyRepository;

    @Autowired
    public EventGroupKeyService(EventGroupKeyRepository eventGroupKeyRepository) {
        this.eventGroupKeyRepository = eventGroupKeyRepository;
    }

    public Long getNextEventGroupKey(){
        return this.eventGroupKeyRepository.getNextEventGroupKey();
    }
}
