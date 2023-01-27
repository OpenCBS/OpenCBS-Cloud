package com.opencbs.core.services.entryfeecalculation;

import com.opencbs.core.dto.DataForEntryFeeCalculationDto;
import com.opencbs.core.dto.EntryFeeDto;

import java.util.List;

public interface EntryFeeCalculationService {
    List<EntryFeeDto> calculate (DataForEntryFeeCalculationDto dto);
}