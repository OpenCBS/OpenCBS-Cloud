package com.opencbs.core.services;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.taskmanager.ProfileTaskEventParticipant;
import com.opencbs.core.domain.taskmanager.TaskEvent;
import com.opencbs.core.domain.taskmanager.TaskEventParticipant;
import com.opencbs.core.domain.taskmanager.TaskEventParticipantsEntity;
import com.opencbs.core.domain.taskmanager.UserTaskEventParticipant;
import com.opencbs.core.dto.taskevent.TaskEventDetailsDto;
import com.opencbs.core.dto.taskevent.TaskEventDto;
import com.opencbs.core.dto.taskevent.TaskEventParticipantsDetailsDto;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.mappers.UserMapper;
import com.opencbs.core.repositories.TaskEventParticipantRepository;
import com.opencbs.core.repositories.TaskEventRepository;
import com.opencbs.core.repositories.customs.TaskEventsParticipantsRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskEventService {

    private final TaskEventRepository taskEventRepository;
    private final UserService userService;
    private final ProfileService profileService;
    private final UserMapper userMapper;
    private final TaskEventsParticipantsRepositoryCustom taskEventsParticipantsRepositoryCustom;
    private final TaskEventParticipantRepository taskEventParticipantRepository;

    @Autowired
    public TaskEventService(TaskEventRepository taskEventRepository,
                            UserService userService,
                            ProfileService profileService,
                            UserMapper userMapper,
                            TaskEventsParticipantsRepositoryCustom taskEventsParticipantsRepositoryCustom,
                            TaskEventParticipantRepository taskEventParticipantRepository) {
        this.taskEventRepository = taskEventRepository;
        this.userService = userService;
        this.profileService = profileService;
        this.userMapper = userMapper;
        this.taskEventsParticipantsRepositoryCustom = taskEventsParticipantsRepositoryCustom;
        this.taskEventParticipantRepository = taskEventParticipantRepository;
    }

    public Optional<TaskEvent> findById(long userId, long taskEventId) {
        return this.findByUserId(userId)
                .stream()
                .filter(x -> x.getId().equals(taskEventId))
                .findFirst();
    }

    public Optional<TaskEvent> findById(long id) {
        return Optional.ofNullable(this.taskEventRepository.findOne(id));
    }

    private List<TaskEvent> findByUserId(Long userId) {
        List<TaskEvent> userTaskEvents = new ArrayList<>();
        this.taskEventRepository.findAll()
                .forEach(x -> x.getParticipants().forEach(a -> {
                    if (a instanceof UserTaskEventParticipant) {
                        if (((UserTaskEventParticipant) a).getUser().getId().equals(userId)) {
                            if (!userTaskEvents.contains(x)) {
                                userTaskEvents.add(x);
                            }
                        }
                    }
                }));
        return userTaskEvents;
    }

    @Transactional
    public TaskEvent create(TaskEventDto dto, User currentUser) {
        TaskEvent taskEvent = new TaskEvent();
        taskEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        taskEvent.setCreatedBy(currentUser);
        taskEvent.setAllDay(dto.isAllDay());
        taskEvent.setContent(dto.getDescription());
        taskEvent.setTitle(dto.getTitle());
        taskEvent.setStartDate(dto.getStart());
        taskEvent.setEndDate(dto.getEnd());
        taskEvent.setNotifyAt(dto.getNotify());

        List<TaskEventParticipant> participantsList = new ArrayList<>();

        dto.getParticipants().forEach(x -> {
            if (x.isUser()) {
                UserTaskEventParticipant userParticipant = new UserTaskEventParticipant();
                userParticipant.setUser(this.userService.getOne(x.getParticipantId()).get());
                userParticipant.setTaskEvent(taskEvent);
                participantsList.add(userParticipant);
            } else {
                ProfileTaskEventParticipant profileParticipant = new ProfileTaskEventParticipant();
                profileParticipant.setProfile(this.profileService.getOne(x.getParticipantId()).get());
                profileParticipant.setTaskEvent(taskEvent);
                participantsList.add(profileParticipant);
            }
        });
        taskEvent.setParticipants(participantsList);
        taskEvent.setId(null);
        return this.taskEventRepository.save(taskEvent);
    }

    @Transactional
    public TaskEvent update(TaskEvent taskEvent, TaskEventDto dto, long userId) {
        taskEvent.setId(dto.getId());
        taskEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        taskEvent.setCreatedBy(this.userService.findById(userId).get());
        taskEvent.setAllDay(dto.isAllDay());
        taskEvent.setContent(dto.getDescription());
        taskEvent.setTitle(dto.getTitle());
        taskEvent.setStartDate(dto.getStart());
        taskEvent.setEndDate(dto.getEnd());
        taskEvent.setNotifyAt(dto.getNotify());
        taskEvent.getParticipants()
                .stream()
                .forEach(x -> x.setDeleted(true));

        List<TaskEventParticipant> participantsList = new ArrayList<>();

        dto.getParticipants().forEach(x -> {
            if (x.isUser()) {
                UserTaskEventParticipant userParticipant = new UserTaskEventParticipant();
                userParticipant.setUser(this.userService.findById(x.getParticipantId()).get());
                userParticipant.setTaskEvent(taskEvent);
                participantsList.add(userParticipant);
                this.taskEventParticipantRepository.save(userParticipant);
            } else {
                ProfileTaskEventParticipant profileParticipant = new ProfileTaskEventParticipant();
                profileParticipant.setProfile(this.profileService.getOne(x.getParticipantId()).get());
                profileParticipant.setTaskEvent(taskEvent);
                participantsList.add(profileParticipant);
                this.taskEventParticipantRepository.save(profileParticipant);
            }
        });
        taskEvent.setParticipants(participantsList);
        this.taskEventRepository.save(taskEvent);
        return taskEvent;
    }

    public TaskEventDetailsDto convertToDto(TaskEvent taskEvent) {
        TaskEventDetailsDto detailsDto = new TaskEventDetailsDto();
        detailsDto.setId(taskEvent.getId());
        detailsDto.setAllDay(taskEvent.isAllDay());
        detailsDto.setDescription(taskEvent.getContent());
        detailsDto.setEnd(taskEvent.getEndDate());
        detailsDto.setNotify(taskEvent.getNotifyAt());
        detailsDto.setStart(taskEvent.getStartDate());
        detailsDto.setTitle(taskEvent.getTitle());
        detailsDto.setCreatedAt(taskEvent.getCreatedAt());
        detailsDto.setCreatedBy(this.userMapper.mapToDto(taskEvent.getCreatedBy()));

        List<TaskEventParticipantsDetailsDto> detailsDtoList = new ArrayList<>();
        taskEvent.getParticipants()
                .forEach(x -> {
                    if (x instanceof UserTaskEventParticipant) {
                        User user = ((UserTaskEventParticipant) x).getUser();
                        TaskEventParticipantsDetailsDto participantDto = new TaskEventParticipantsDetailsDto();
                        participantDto.setUser(true);
                        participantDto.setDeleted(x.isDeleted());
                        participantDto.setParticipantId(user.getId());
                        participantDto.setName(user.getFirstName() + " " + user.getLastName());
                        detailsDtoList.add(participantDto);
                    } else {
                        Profile profile = ((ProfileTaskEventParticipant) x).getProfile();
                        TaskEventParticipantsDetailsDto participantDto = new TaskEventParticipantsDetailsDto();
                        participantDto.setUser(false);
                        participantDto.setDeleted(x.isDeleted());
                        participantDto.setName(profile.getName());
                        participantDto.setParticipantId(profile.getId());
                        detailsDtoList.add(participantDto);
                    }
                });
        List<TaskEventParticipantsDetailsDto> collect = detailsDtoList
                .stream()
                .filter(x -> !x.isDeleted())
                .collect(Collectors.toList());
        detailsDto.setTaskEventParticipants(collect);
        return detailsDto;
    }

    public Page<TaskEventParticipantsEntity> findAllParticipants(String searchString, Pageable pageable) {

        Long total = userService.getCountNotSystemUser() + profileService.getCountProfiles();

        return new PageImpl<>(this.taskEventsParticipantsRepositoryCustom.findAllTaskEventParticipants(searchString, pageable), pageable, total);
    }

    public List<TaskEvent> getAllToDate(long userId, String date, Long months) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime startDate = LocalDateTime.of(localDate, DateHelper.getLocalTimeNow());
        months = (months == null) ? 3L : months;
        Long finalMonths = months;
        return this.findByUserId(userId)
                .stream()
                .filter(x -> x.getStartDate().compareTo(startDate.plusMonths(finalMonths)) <= 0)
                .collect(Collectors.toList());
    }

    public List<TaskEvent> getAllByProfileId(long profileId) {
        List<TaskEvent> profileTaskEvent = new ArrayList<>();
        this.taskEventRepository.findAll()
                .forEach(x -> x.getParticipants().forEach(a -> {
                    if (a instanceof ProfileTaskEventParticipant) {
                        if (((ProfileTaskEventParticipant) a).getProfile().getId() == profileId && !a.isDeleted()) {
                            profileTaskEvent.add(x);
                        }
                    }
                }));
        return profileTaskEvent;
    }
}
