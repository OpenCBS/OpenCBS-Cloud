package com.opencbs.loans.credit.lines.controllers;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.dto.CreditLineCreateDto;
import com.opencbs.loans.credit.lines.dto.CreditLineDto;
import com.opencbs.loans.credit.lines.dto.CreditLineInfoDto;
import com.opencbs.loans.credit.lines.mappers.CreditLineMapper;
import com.opencbs.loans.credit.lines.services.CreditLineService;
import com.opencbs.loans.credit.lines.validators.CreditLineValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/credit-lines")
@RequiredArgsConstructor
public class CreditLineController {

    private final ProfileService profileService;
    private final CreditLineService creditLineService;
    private final CreditLineMapper creditLineMapper;
    private final CreditLineValidator creditLineValidator;

    @PostMapping()
    public CreditLineInfoDto createCreditLine(@RequestBody CreditLineCreateDto creditLineCreateDto) {
        this.creditLineValidator.validate(creditLineCreateDto);
        CreditLine creditLine = this.creditLineMapper.mapDtoToEntity(creditLineCreateDto);
        return this.creditLineMapper.mapInfoToDto(this.creditLineService.create(creditLine));
    }

    @PutMapping(value = "/{id}")
    public CreditLineInfoDto editCreditLine(@RequestBody CreditLineCreateDto creditLineCreateDto, @PathVariable Long id) {
        this.creditLineValidator.validate(creditLineCreateDto);
        CreditLine creditLine = this.creditLineService.getCreditLineById(id);
        creditLine = this.creditLineMapper.mapDtoToEntity(creditLineCreateDto);
        creditLine.setId(id);
        return this.creditLineMapper.mapInfoToDto(this.creditLineService.update(creditLine));
    }

    @GetMapping(value = "/{id}")
    public CreditLineInfoDto get(@PathVariable Long id) {
        CreditLine creditLine = this.creditLineService.getCreditLineById(id);
        return this.creditLineMapper.mapInfoToDto(creditLine);
    }

    @GetMapping(value = "/by-profile/{profileId}")
    public Page<CreditLineDto> getByProfile(Pageable pageable, @PathVariable(value = "profileId") Long profileId) throws ResourceNotFoundException {
        Profile profile = this.profileService.getOne(profileId).orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", profileId)));
        return this.creditLineService.getAllByProfile(pageable, profile).map(this.creditLineMapper::mapToDto);
    }

    @GetMapping(value = "/loan-applications/{profileId}")
    public List<CreditLineInfoDto> getValidCreditLines(@PathVariable(value = "profileId") Long profileId) {
        Profile profile = this.profileService.getOne(profileId).orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", profileId)));
        List<CreditLine> creditLines = this.creditLineService.findAllByProfile(profile);
        if (!creditLines.isEmpty()) {
            return creditLines
                    .stream()
                    .filter(x -> DateHelper.greaterOrEqual(x.getMaturityDate(), LocalDate.now()))
                    .map(this.creditLineMapper::mapInfoToDto)
                    .collect(Collectors.toList());
        }
        return null;
    }
}
