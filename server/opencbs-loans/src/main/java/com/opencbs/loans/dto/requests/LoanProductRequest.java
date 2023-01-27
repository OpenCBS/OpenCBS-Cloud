package com.opencbs.loans.dto.requests;

import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LoanProductRequest {
    private String search;
    private ProfileType availability;
    private List<StatusType> statusTypes = new ArrayList<>();
}
