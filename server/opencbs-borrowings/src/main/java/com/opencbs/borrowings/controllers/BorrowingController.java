package com.opencbs.borrowings.controllers;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.dto.BorrowingDetailDto;
import com.opencbs.borrowings.dto.BorrowingDto;
import com.opencbs.borrowings.dto.BorrowingSimplifiedDto;
import com.opencbs.borrowings.mappers.BorrowingMapper;
import com.opencbs.borrowings.mappers.BorrowingScheduleMapper;
import com.opencbs.borrowings.services.ActualizeBorrowingStarterService;
import com.opencbs.borrowings.services.BorrowingOperationsService;
import com.opencbs.borrowings.services.BorrowingService;
import com.opencbs.borrowings.validators.BorrowingValidator;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.CommentDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import javax.script.ScriptException;
import java.time.LocalDate;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/api/borrowings")
@SuppressWarnings("unused")
public class BorrowingController {

    private final BorrowingService borrowingService;
    private final BorrowingOperationsService borrowingOperationsService;
    private final BorrowingValidator borrowingValidator;
    private final BorrowingMapper borrowingMapper;
    private final BorrowingScheduleMapper borrowingScheduleMapper;
    private final ProfileService profileService;
    private final ActualizeBorrowingStarterService actualizeBorrowingStarterService;

    @Autowired
    public BorrowingController(BorrowingService borrowingService,
                               BorrowingOperationsService borrowingOperationsService,
                               BorrowingValidator borrowingValidator,
                               BorrowingMapper borrowingMapper,
                               BorrowingScheduleMapper borrowingScheduleMapper,
                               ProfileService profileService,
                               ActualizeBorrowingStarterService actualizeBorrowingStarterService) {
        this.borrowingService = borrowingService;
        this.borrowingOperationsService = borrowingOperationsService;
        this.borrowingValidator = borrowingValidator;
        this.borrowingMapper = borrowingMapper;
        this.borrowingScheduleMapper = borrowingScheduleMapper;
        this.profileService = profileService;
        this.actualizeBorrowingStarterService = actualizeBorrowingStarterService;
    }

    @PostMapping
    public BorrowingDetailDto create(@RequestBody BorrowingDto dto) throws ResourceNotFoundException, ScriptException {
        this.borrowingValidator.validate(dto);
        Borrowing borrowing = borrowingMapper.mapToEntity(dto, UserHelper.getCurrentUser());
        borrowing.setId(null);
        return this.borrowingMapper.mapToDetailDto(borrowingService.firstSave(borrowing));
    }

    @PutMapping(value = "/{borrowingId}")
    public BorrowingDetailDto put(@RequestBody BorrowingDto dto,
                                  @PathVariable long borrowingId) throws ResourceNotFoundException, ScriptException {
        this.borrowingValidator.validate(dto);
        Borrowing borrowing = this.borrowingService.findOne(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
        if (!borrowing.getStatus().equals(BorrowingStatus.PENDING))
            throw new RuntimeException("Borrowing edit is possible if only the status is PENDING.");
        borrowing = this.borrowingMapper.zip(borrowing, dto, UserHelper.getCurrentUser());
        borrowing.setId(borrowingId);
        return this.borrowingMapper.mapToDetailDto(this.borrowingService.update(borrowing));
    }

    @PermissionRequired(name = "GET_BORROWINGS", moduleType = ModuleType.BORROWINGS, description = "")
    @GetMapping(value = "/{borrowingId}")
    public BorrowingDetailDto getOne(@PathVariable long borrowingId) {
        Borrowing borrowing = this.borrowingService.findOne(borrowingId).orElseThrow(
                () -> new ResourceAccessException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
        return this.borrowingMapper.mapToDetailDto(borrowing);
    }

    @PermissionRequired(name = "GET_BORROWINGS", moduleType = ModuleType.BORROWINGS, description = "")
    @GetMapping(value = "/by-profile/{profileId}")
    public Page<BorrowingDetailDto> getByProfile(Pageable pageable, @PathVariable(value = "profileId") long profileId) {
        Profile profile = this.profileService.findOne(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", profileId)));
        return this.borrowingService.getByProfile(pageable, profile).map(this.borrowingMapper::mapToDetailDto);
    }

    @PostMapping(value = "/preview")
    public ScheduleDto preview(@RequestBody BorrowingDto dto) {
        this.borrowingValidator.validate(dto);
        Borrowing borrowing = borrowingMapper.mapToEntity(dto, UserHelper.getCurrentUser());
        return this.borrowingScheduleMapper.mapToScheduleDto(this.borrowingService.preview(borrowing));
    }

    @PostMapping(value = "/{borrowingId}/disburse")
    public BorrowingDetailDto disburse(@PathVariable long borrowingId) throws ResourceNotFoundException {
        Borrowing borrowing = this.borrowingService.findOne(borrowingId).orElseThrow(
                () -> new ResourceAccessException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
        if (!borrowing.getStatus().equals(BorrowingStatus.PENDING))
            throw new RuntimeException("Borrowing must be pending");
        this.borrowingValidator.validate(this.borrowingMapper.mapToDto(borrowing));
        return this.borrowingMapper.mapToDetailDto(this.borrowingOperationsService.disburse(borrowing, UserHelper.getCurrentUser()));
    }

    @PermissionRequired(name = "GET_BORROWINGS", moduleType = ModuleType.BORROWINGS, description = "")
    @GetMapping
    public Page<BorrowingSimplifiedDto> getAll(@RequestParam(value = "search", required = false) String searchString,
                                               Pageable pageable) {
        return this.borrowingService.getAll(searchString, pageable).map(this.borrowingMapper::mapToSimplifiedDto);
    }

    @PostMapping(value = "/{borrowingId}/roll-back")
    public BorrowingDetailDto rollBackBorrowingEvent(@PathVariable Long borrowingId,
                                                     @RequestBody CommentDto dto) throws ResourceNotFoundException{
        Borrowing borrowing = this.borrowingService.findOne(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
        return this.borrowingMapper.mapToDetailDto(this.borrowingOperationsService.rollBack(dto.getComment(), borrowing, UserHelper.getCurrentUser()));
    }

    @GetMapping(value = "/{borrowingId}/schedule")
    public ScheduleDto getBorrowingSchedule(@PathVariable Long borrowingId) {
        Borrowing borrowing = this.borrowingService.findOne(borrowingId).orElseThrow(
                () -> new ResourceAccessException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
        return this.borrowingMapper.mapToSchedule(this.borrowingService.getInstallment(borrowing));
    }

    @PermissionRequired(name = "ACTUALIZE_BORROWINGS", moduleType = ModuleType.BORROWINGS, description = "")
    @RequestMapping(value = "/actualize/{borrowingId}", method = POST)
    public String getActualizeBorrowingProgress(@PathVariable long borrowingId,
                                                @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        this.actualizeBorrowingStarterService.actualizing(borrowingId, date, UserHelper.getCurrentUser());
        return "Actualize borrowing started";
    }
}
