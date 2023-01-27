package com.opencbs.core.controllers.profiles;

import com.opencbs.core.domain.ProfileAccounts;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.SimplifiedProfileAccount;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.dto.profiles.ProfilesDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.workers.ProfileWorker;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/profiles")
@SuppressWarnings("unused")
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileWorker profileWorker;

    @Autowired
    public ProfileController(ProfileService profileService,
                             ProfileWorker profileWorker) {
        this.profileService = profileService;
        this.profileWorker = profileWorker;
    }

    @PermissionRequired(name = "GET_PROFILES", moduleType = ModuleType.PROFILES, description = "")
    @RequestMapping(method = RequestMethod.GET)
    public Page<ProfilesDto> get(@RequestParam(value = "search", required = false) String searchString,
                                 Pageable pageable) {
        Page<Profile> page = this.profileService.search(searchString, pageable, UserHelper.getCurrentUser());
        ModelMapper mapper = new ModelMapper();
        return page.map(x -> mapper.map(x, ProfilesDto.class));
    }

    @PermissionRequired(name = "GET_PROFILES", moduleType = ModuleType.PROFILES, description = "")
    @GetMapping(value = "/{profiledId}/single")
    public ProfilesDto get(@PathVariable Long profiledId) {
        Profile profile = this.profileService.findOne(profiledId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", profiledId)));
        ModelMapper mapper = new ModelMapper();
        return mapper.map(profile, ProfilesDto.class);
    }

    @PermissionRequired(name = "GET_PROFILES", moduleType = ModuleType.PROFILES, description = "")
    @RequestMapping(value = "/with-accounts", method = RequestMethod.GET)
    public Page<SimplifiedProfileAccount> getAllWithCurrentAccount(@RequestParam(value = "search", required = false) String search,
                                                                   Pageable pageable) {
        return this.profileWorker.getAllWithCurrentAccount(search, pageable, UserHelper.getCurrentUser());
    }

    @RequestMapping(path = "current-account/{profileId}", method = RequestMethod.GET)
    public Long getCurrentAccountId(@PathVariable Long profileId) {
        Optional<ProfileAccounts> profileAccounts =  this.profileService.getAccountByProfile(profileId);
        return profileAccounts.map(ProfileAccounts::getAccountId).orElse(null);
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.profileService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found(ID=%d).", id)));

        return this.profileService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id, @RequestParam(value = "dateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) throws Exception {
        this.profileService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found(ID=%d).", id)));
        return this.profileService.getRevisionByDate(id, dateTime);
    }
}
