package com.opencbs.core.controllers;

import com.opencbs.core.domain.OtherFee;
import com.opencbs.core.dto.CreateOtherFeeDto;
import com.opencbs.core.dto.OtherFeeDetailDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.OtherFeeMapper;
import com.opencbs.core.services.OtherFeeService;
import com.opencbs.core.validators.OtherFeeValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RequestMapping(value = "/api/other-fees")
public abstract class OtherFeeController {

    protected final OtherFeeService otherFeeService;
    protected final OtherFeeValidation otherFeeValidation;
    protected final OtherFeeMapper otherFeeMapper;

    @RequestMapping(method = RequestMethod.POST)
    public OtherFeeDetailDto create(@RequestBody CreateOtherFeeDto otherFeeDto){
        otherFeeValidation.validateOnCreate(otherFeeDto);
        OtherFee otherFee = this.otherFeeMapper.mapToEntity(otherFeeDto, UserHelper.getCurrentUser());
        return otherFeeMapper.mapToDto(this.otherFeeService.save(otherFee));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public OtherFeeDetailDto update(@PathVariable long id,
                              @RequestBody CreateOtherFeeDto otherFeeDto) throws ResourceNotFoundException{
        otherFeeValidation.validateOnUpdate(otherFeeDto, id);
        otherFeeDto.setId(id);
        OtherFee otherFee = this.otherFeeMapper.mapToEntity(otherFeeDto, UserHelper.getCurrentUser());
        return otherFeeMapper.mapToDto(this.otherFeeService.save(otherFee));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public OtherFeeDetailDto getById(@PathVariable long id) throws ResourceNotFoundException{
       return this.otherFeeService.getById(id)
                .map(this.otherFeeMapper::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Other fee not found (ID=%d)", id)));
    }

    @RequestMapping(method = RequestMethod.GET)
    public Page<OtherFeeDetailDto> getAllOtherFees(Pageable pageable){
        List<OtherFeeDetailDto> detailDtoList = this.otherFeeService.getAllOtherFees()
                .stream()
                .map(this.otherFeeMapper::mapToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(detailDtoList, pageable, detailDtoList.size());
    }
}
