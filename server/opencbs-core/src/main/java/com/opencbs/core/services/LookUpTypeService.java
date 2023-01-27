package com.opencbs.core.services;

import com.opencbs.core.dto.LookTypeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LookUpTypeService {

    private final LookUpTypeInterface lookUpTypeInterface;

    public List<LookTypeDto> getLookUps() {
        return this.lookUpTypeInterface.getLookUps();
    }
}
