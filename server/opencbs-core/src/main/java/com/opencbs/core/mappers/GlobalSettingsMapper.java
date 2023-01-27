package com.opencbs.core.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.dto.GlobalSettingsDto;
import org.modelmapper.ModelMapper;

@Mapper
public class GlobalSettingsMapper {

    public GlobalSettingsDto mapToDto(GlobalSettings globalSettings) {
        return new ModelMapper().map(globalSettings, GlobalSettingsDto.class);
    }

    public GlobalSettings mapToEntity(GlobalSettingsDto dto) {
        return new ModelMapper().map(dto, GlobalSettings.class);
    }

}
