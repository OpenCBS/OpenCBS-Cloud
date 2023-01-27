package com.opencbs.bonds.controllers;

import com.opencbs.bonds.dayclosure.ActualizeBondStarterService;
import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.SimplifiedBond;
import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.bonds.dto.BondAmountDto;
import com.opencbs.bonds.dto.BondDetailsDto;
import com.opencbs.bonds.dto.BondDto;
import com.opencbs.bonds.dto.BondExpireDateDto;
import com.opencbs.bonds.mappers.BondMapper;
import com.opencbs.bonds.mappers.BondScheduleMapper;
import com.opencbs.bonds.services.BondRollBackWorker;
import com.opencbs.bonds.services.BondService;
import com.opencbs.bonds.validators.BondValidator;
import com.opencbs.bonds.workers.BondWorker;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.CommentDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
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

import javax.script.ScriptException;
import java.time.LocalDate;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value = "/api/bonds")
@SuppressWarnings("unused")
public class BondController {

    private final BondValidator bondValidator;
    private final BondMapper bondMapper;
    private final BondService bondService;
    private final BondScheduleMapper bondScheduleMapper;
    private final ProfileService profileService;
    private final ActualizeBondStarterService actualizeBondStarterService;
    private final BondWorker bondWorker;
    private final BondRollBackWorker bondRollBackWorker;

    @Autowired
    public BondController(BondValidator bondValidator,
                          BondMapper bondMapper,
                          BondService bondService,
                          BondScheduleMapper bondScheduleMapper,
                          ProfileService profileService,
                          ActualizeBondStarterService actualizeBondStarterService,
                          BondWorker bondWorker,
                          BondRollBackWorker bondRollBackWorker) {
        this.bondValidator = bondValidator;
        this.bondMapper = bondMapper;
        this.bondService = bondService;
        this.bondScheduleMapper = bondScheduleMapper;
        this.profileService = profileService;
        this.actualizeBondStarterService = actualizeBondStarterService;
        this.bondWorker = bondWorker;
        this.bondRollBackWorker = bondRollBackWorker;
    }

    @GetMapping
    @PermissionRequired(name = "BONDS", moduleType = ModuleType.BONDS, description = "")
    public Page<SimplifiedBond> getAllBonds(@RequestParam(value = "search", required = false) String searchQuery,
                                            Pageable pageable) {
        return this.bondService.getAllSimplifiedBonds(searchQuery, pageable);
    }

    @GetMapping(value = "/{id}")
    public BondDetailsDto get(@PathVariable long id) {
        Bond bond = this.bondService.findById(id);
        BondDetailsDto result = this.bondMapper.mapToDto(bond);
        return result;
    }

    @GetMapping(value = "/by-profile/{profileId}")
    public Page<BondDetailsDto> getByProfile(Pageable pageable, @PathVariable(value = "profileId") long profileId) {
        Profile profile = this.profileService.findOne(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", profileId)));
        return this.bondService.getByProfile(pageable, profile).map(this.bondMapper::mapToDto);
    }

    @PermissionRequired(name = "BONDS_CREATE", moduleType = ModuleType.BONDS, description = "")
    @PostMapping
    public BondDetailsDto create(@RequestBody BondDto dto)
            throws ScriptException, ResourceNotFoundException {
        this.bondValidator.validateOnCreate(dto);
        return this.bondMapper.mapToDto(this.bondService.create(this.bondMapper.mapToEntity(dto), UserHelper.getCurrentUser()));
    }

    @PermissionRequired(name = "BONDS_UPDATE", moduleType = ModuleType.BONDS, description = "")
    @PutMapping(value = "/{id}")
    public BondDetailsDto update(@PathVariable Long id, @RequestBody BondDto dto)
            throws ScriptException, ResourceNotFoundException {
        this.bondValidator.validate(dto);
        Bond bond = this.bondService.findById(id);
        if (!bond.getStatus().equals(BondStatus.IN_PROGRESS))
            throw new RuntimeException("Bond edit is possible only if the status is IN PROGRESS");
        Bond zip = this.bondMapper.zip(bond, dto);
        zip.setId(id);
        return this.bondMapper.mapToDto(this.bondService.update(zip));
    }

    @PostMapping(value = "/preview")
    public ScheduleDto preview(@RequestBody BondDto dto) {
        this.bondValidator.validateOnCreate(dto);
        Bond bond = this.bondMapper.mapToEntity(dto);
        return this.bondScheduleMapper.mapToScheduleDto(this.bondService.preview(bond));
    }

    @PermissionRequired(name = "BONDS_SELL", moduleType = ModuleType.BONDS, description = "")
    @PostMapping(value = "/start/{id}")
    public BondDetailsDto start(@PathVariable Long id)
            throws ResourceNotFoundException {
        Bond bond = this.bondService.findById(id);
        return this.bondMapper.mapToDto(this.bondWorker.start(bond));
    }

    @RequestMapping(value = "/convert-amount", method = GET)
    public BondAmountDto getBondAmount(@RequestParam(value = "quantity") Integer quantity,
                                       @RequestParam(value = "currency") Long currencyId,
                                       @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        this.bondValidator.quantityValidate(quantity, currencyId);
        return this.bondService.getBondAmount(quantity, currencyId, date.atTime(DateHelper.getLocalTimeNow()));
    }

    @PostMapping(value = "/expire-date")
    public LocalDate getExpireDate(@RequestBody BondExpireDateDto dto) {
        this.bondValidator.validateExpireDate(dto);
        return this.bondService.getExpireDate(this.bondMapper.mapToEntityExpireDate(dto));
    }

    @GetMapping(value = "/{bondId}/schedule")
    public ScheduleDto getBondSchedule(@PathVariable Long bondId){
        Bond bond = this.bondService.findById(bondId);
        return this.bondScheduleMapper.mapToScheduleDto(this.bondService.getInstallmentsByBond(bond));
    }

    @PermissionRequired(name = "ACTUALIZE_BONDS", moduleType = ModuleType.BONDS, description = "")
    @PostMapping(value = "/actualize/{bondId}")
    public String getActualizeBorrowingProgress(@PathVariable long bondId,
                                                @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        this.actualizeBondStarterService.actualizing(bondId, date, UserHelper.getCurrentUser());
        return "Actualize bond was started";
    }

    @PermissionRequired(name = "ROLLBACK_BOND_EVENTS", moduleType = ModuleType.BONDS, description = "")
    @PostMapping(value = "/{bondId}/roll-back")
    public String rollingBackRepayments(@PathVariable long bondId,
                                        @RequestBody CommentDto dto) throws Exception {
        return this.bondRollBackWorker.rollback(dto.getComment(), bondId, UserHelper.getCurrentUser());
    }

    @PermissionRequired(name = "VALUE_DATE_BOND_EVENTS", moduleType = ModuleType.BONDS, description = "")
    @PostMapping(value = "/{bondId}/valueDate")
    public BondDetailsDto setValueDate(@PathVariable Long bondId,
                             @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) throws Exception {
        Bond bond = this.bondService.findById(bondId);
        return this.bondMapper.mapToDto(this.bondWorker.setValueDate(bond, date));
    }

}
