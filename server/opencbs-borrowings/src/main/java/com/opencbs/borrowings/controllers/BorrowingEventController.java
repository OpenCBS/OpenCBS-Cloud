package com.opencbs.borrowings.controllers;

import com.opencbs.borrowings.domain.BorrowingEvent;
import com.opencbs.borrowings.dto.BorrowingEventDto;
import com.opencbs.borrowings.mappers.BorrowingEventMapper;
import com.opencbs.borrowings.services.BorrowingEventService;
import com.opencbs.borrowings.services.BorrowingService;
import com.opencbs.core.dto.requests.EventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/borrowings/{borrowingId}/events")
public class BorrowingEventController {

    private final BorrowingEventService borrowingEventService;
    private final BorrowingService borrowingService;
    private final BorrowingEventMapper borrowingEventMapper;

    @Autowired
    public BorrowingEventController(BorrowingEventService borrowingEventService,
                                    BorrowingService borrowingService,
                                    BorrowingEventMapper borrowingEventMapper) {
        this.borrowingEventService = borrowingEventService;
        this.borrowingService = borrowingService;
        this.borrowingEventMapper = borrowingEventMapper;
    }

    @GetMapping()
    public List<BorrowingEventDto> getAllBorrowingEvents(@PathVariable Long borrowingId, EventRequest request) {
        this.borrowingService.findOne(borrowingId).orElseThrow(
                () -> new ResourceAccessException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
        return this.borrowingEventService.findAllConsolidatedByBorrowingId(borrowingId, request)
                .stream()
                .sorted((a, b) -> {
                    int num = a.getEffectiveAt().compareTo(b.getEffectiveAt());
                    if (num == 0) {
                        return a.getId().compareTo(b.getId());
                    }
                    return num;
                })
                .map(this.borrowingEventMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/{groupKey}")
    public List<BorrowingEventDto> getAllEventsByGroupKey(@PathVariable Long groupKey) {
        return this.borrowingEventService.findAllByGroupKey(groupKey)
                .stream()
                .sorted(Comparator.comparing(BorrowingEvent::getId))
                .map(this.borrowingEventMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
