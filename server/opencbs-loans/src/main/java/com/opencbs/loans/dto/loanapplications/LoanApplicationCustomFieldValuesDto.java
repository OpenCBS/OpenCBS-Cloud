package com.opencbs.loans.dto.loanapplications;

import com.opencbs.core.dto.FieldValueDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoanApplicationCustomFieldValuesDto {
    private List<FieldValueDto> fieldValues;
}
