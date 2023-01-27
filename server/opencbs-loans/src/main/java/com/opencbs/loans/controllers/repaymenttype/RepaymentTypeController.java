package com.opencbs.loans.controllers.repaymenttype;

import com.opencbs.loans.dto.RepaymentTypeDto;
import com.opencbs.loans.services.repayment.repaymenttype.RepaymentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/repayment/types")
public class RepaymentTypeController {

    private final RepaymentTypeService repaymentTypeService;


    @RequestMapping(value = "/lookup", method = RequestMethod.GET)
    public List<RepaymentTypeDto> getRepaymentTypes() {
        return repaymentTypeService.getRepaymentTypes();
    }
}
