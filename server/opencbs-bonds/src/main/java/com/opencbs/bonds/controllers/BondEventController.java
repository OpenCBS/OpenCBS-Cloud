package com.opencbs.bonds.controllers;

import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.mappers.BondEventMapper;
import com.opencbs.bonds.services.BondEventService;
import com.opencbs.core.dto.EventDto;
import com.opencbs.core.dto.requests.EventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/bonds/{bondId}/events")
public class BondEventController {

    private final BondEventService bondEventService;
    private final BondEventMapper bondEventMapper;

    @Autowired
    public BondEventController(BondEventService bondEventService,
                               BondEventMapper bondEventMapper) {
        this.bondEventService = bondEventService;
        this.bondEventMapper = bondEventMapper;
    }

    @GetMapping
    public List<EventDto> getAllBondEvents(@PathVariable Long bondId, EventRequest request) {
        return this.bondEventService.findAllConsolidatedByBondId(bondId, request)
                .stream()
                .sorted((bondEvent1, bondEvent2) -> {
                    int num = bondEvent1.getEffectiveAt().compareTo(bondEvent2.getEffectiveAt());
                    if(num == 0){
                        return bondEvent1.getId().compareTo(bondEvent2.getId());
                    }
                    return num;
                })
                .map(this.bondEventMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{groupKey}")
    public List<EventDto> getAllEventsByGroupKey(@PathVariable Long groupKey) {
        return this.bondEventService.findAllByGroupKey(groupKey)
                .stream()
                .sorted(Comparator.comparing(BondEvent::getId))
                .map(this.bondEventMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
