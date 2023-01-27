package com.opencbs.core.controllers;

import com.opencbs.core.domain.taskmanager.TaskEvent;
import com.opencbs.core.domain.taskmanager.TaskEventParticipantsEntity;
import com.opencbs.core.dto.taskevent.TaskEventDetailsDto;
import com.opencbs.core.dto.taskevent.TaskEventDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.repositories.customs.TaskEventsParticipantsRepositoryCustom;
import com.opencbs.core.services.TaskEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/task-events")
@SuppressWarnings("unused")
public class TaskEventController {

    private final TaskEventService taskEventService;
    private final TaskEventsParticipantsRepositoryCustom taskEventsParticipantsRepositoryCustom;

    @Autowired
    public TaskEventController(TaskEventService taskEventService,
                               TaskEventsParticipantsRepositoryCustom taskEventsParticipantsRepositoryCustom) {
        this.taskEventService = taskEventService;
        this.taskEventsParticipantsRepositoryCustom = taskEventsParticipantsRepositoryCustom;
    }

    @RequestMapping(method = RequestMethod.POST)
    public TaskEventDetailsDto post(@RequestBody TaskEventDto dto) {
        TaskEvent taskEvent = this.taskEventService.create(dto, UserHelper.getCurrentUser());
        return this.taskEventService.convertToDto(taskEvent);
    }

    @RequestMapping(value = "/{userId}/{taskEventId}", method = RequestMethod.GET)
    public TaskEventDetailsDto getById(@PathVariable long userId,
                                       @PathVariable long taskEventId) throws ResourceNotFoundException {
        TaskEvent taskEvent = this.taskEventService.findById(userId, taskEventId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task event not found (ID=%d).", taskEventId)));
        return this.taskEventService.convertToDto(taskEvent);
    }

    @RequestMapping(value = "/participants", method = RequestMethod.GET)
    public Page<TaskEventParticipantsEntity> getAll(Pageable pageable, @RequestParam(name = "search", required = false) String searchString) {
        if (searchString == null) {
            searchString = "";
        }
        return this.taskEventService.findAllParticipants(searchString, pageable);
    }

    @RequestMapping(value = "/{userId}/{taskEventId}", method = RequestMethod.PUT)
    public TaskEventDetailsDto update(@PathVariable long userId,
                                      @PathVariable long taskEventId,
                                      @RequestBody TaskEventDto dto) throws ResourceNotFoundException {
        TaskEvent taskEvent = this.taskEventService.findById(userId, taskEventId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Task not found (ID=%d).", taskEventId)));
        TaskEvent updatedTaskEvent = this.taskEventService.update(taskEvent, dto, userId);
        return this.taskEventService.convertToDto(updatedTaskEvent);
    }

    @RequestMapping(value = "/{userId}", method = RequestMethod.GET)
    public List<TaskEventDetailsDto> getAllToDate(@PathVariable long userId,
                                                  @RequestParam(name = "date") String date,
                                                  @RequestParam(name = "monthNum", required = false) Long months) {
        return this.taskEventService.getAllToDate(userId, date, months)
                .stream()
                .map(this.taskEventService::convertToDto)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/by-profile/{profileId}", method = RequestMethod.GET)
    public List<TaskEventDetailsDto> getAllTaskEventsByProfile(@PathVariable long profileId) {
        return this.taskEventService.getAllByProfileId(profileId)
                .stream()
                .distinct()
                .map(this.taskEventService::convertToDto)
                .collect(Collectors.toList());
    }
}
