package com.opencbs.core.services;

import com.opencbs.core.annotations.CustomLookType;
import com.opencbs.core.domain.enums.LookupType;
import com.opencbs.core.dto.LookTypeDto;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@ConditionalOnMissingBean(annotation = CustomLookType.class)
public class CoreLookUpUpTypeService implements LookUpTypeInterface {

    @Override
    public List<LookTypeDto> getLookUps() {
        List<LookTypeDto> lookTypeDtoList = new ArrayList<>();
        for (LookupType lookupType : LookupType.values()) {
            lookTypeDtoList.add(new LookTypeDto(lookupType.getName(), lookupType.getKey()));
        }
        return lookTypeDtoList;
    }
}
