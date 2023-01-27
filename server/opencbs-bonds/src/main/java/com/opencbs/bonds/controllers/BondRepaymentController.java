package com.opencbs.bonds.controllers;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.dto.BondDetailsDto;
import com.opencbs.bonds.mappers.BondMapper;
import com.opencbs.bonds.mappers.BondScheduleMapper;
import com.opencbs.bonds.services.BondService;
import com.opencbs.bonds.services.repayment.BondRepaymentService;
import com.opencbs.bonds.services.repayment.BondRepaymentServiceFactory;
import com.opencbs.bonds.validators.BondValidator;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.helpers.UserHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/bonds/{bondId}/repayment")
@SuppressWarnings("unused")
public class BondRepaymentController {

    private final BondValidator bondValidator;
    private final BondScheduleMapper bondScheduleMapper;
    private final BondMapper bondMapper;
    private final BondService bondService;
    private final BondRepaymentServiceFactory bondRepaymentServiceFactory;

    @Autowired
    public BondRepaymentController(
            BondValidator bondValidator,
            BondService bondService,
            BondRepaymentServiceFactory bondRepaymentServiceFactory,
            BondScheduleMapper bondScheduleMapper,
            BondMapper bondMapper) {
        this.bondValidator = bondValidator;
        this.bondService = bondService;
        this.bondRepaymentServiceFactory = bondRepaymentServiceFactory;
        this.bondScheduleMapper = bondScheduleMapper;
        this.bondMapper = bondMapper;
    }

    @PostMapping(value = "/repay")
    public BondDetailsDto repay(
            @PathVariable Long bondId,
            @RequestBody RepaymentSplit repaymentSplit) throws Exception {
        Bond bond = this.bondService.findById(bondId);
        BondRepaymentService bondRepaymentService = this.bondRepaymentServiceFactory.getBondRepaymentService(repaymentSplit.getRepaymentType());
        this.bondValidator.repayValidateBond(bond, repaymentSplit);
        bondRepaymentService.repay(bond, repaymentSplit, UserHelper.getCurrentUser());
        return this.bondMapper.mapToDto(bond);
    }

    @PostMapping(value = "/preview")
    public ScheduleDto preview(
            @PathVariable Long bondId,
            @RequestBody RepaymentSplit repaymentSplit) throws Exception {
        Bond bond = this.bondService.findById(bondId);
        BondRepaymentService bondRepaymentService = this.bondRepaymentServiceFactory.getBondRepaymentService(repaymentSplit.getRepaymentType());
        List<BondInstallment> previewList = bondRepaymentService.preview(bond, repaymentSplit, UserHelper.getCurrentUser());
        return this.bondScheduleMapper.mapToScheduleDto(previewList);
    }

    @PostMapping(value = "/split")
    public RepaymentSplit split(
            @PathVariable Long bondId,
            @RequestBody RepaymentSplit repaymentSplit){
        BondRepaymentService bondRepaymentService = this.bondRepaymentServiceFactory
                .getBondRepaymentService(repaymentSplit.getRepaymentType());
        Bond bond = this.bondService.findById(bondId);
        return bondRepaymentService.split(bond, repaymentSplit, UserHelper.getCurrentUser());
    }
}


