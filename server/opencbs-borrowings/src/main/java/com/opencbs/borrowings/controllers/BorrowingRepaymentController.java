package com.opencbs.borrowings.controllers;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.dto.BorrowingDetailDto;
import com.opencbs.borrowings.mappers.BorrowingMapper;
import com.opencbs.borrowings.mappers.BorrowingScheduleMapper;
import com.opencbs.borrowings.services.BorrowingService;
import com.opencbs.borrowings.services.repayments.BorrowingRepaymentService;
import com.opencbs.borrowings.services.repayments.BorrowingRepaymentServiceFactory;
import com.opencbs.borrowings.validators.BorrowingRepayValidator;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/api/borrowings/{borrowingId}/repayment")
@SuppressWarnings("unused")
public class BorrowingRepaymentController {

    private final BorrowingRepaymentServiceFactory borrowingRepaymentServiceFactory;

    private final BorrowingScheduleMapper borrowingScheduleMapper;

    private final BorrowingMapper borrowingMapper;

    private final BorrowingService borrowingService;

    private final BorrowingRepayValidator borrowingRepayValidator;

    @Autowired
    public BorrowingRepaymentController(
            BorrowingService borrowingService,
            BorrowingRepaymentServiceFactory borrowingRepaymentServiceFactory,
            BorrowingScheduleMapper borrowingScheduleMapper,
            BorrowingMapper borrowingMapper,
            BorrowingRepayValidator borrowingRepayValidator) {
        this.borrowingService = borrowingService;
        this.borrowingRepaymentServiceFactory = borrowingRepaymentServiceFactory;
        this.borrowingScheduleMapper = borrowingScheduleMapper;
        this.borrowingMapper = borrowingMapper;
        this.borrowingRepayValidator = borrowingRepayValidator;
    }

    @RequestMapping(value = "/split", method = POST)
    public RepaymentSplit split(
            @PathVariable Long borrowingId,
            @RequestBody RepaymentSplit repaymentSplit) {
        BorrowingRepaymentService borrowingRepaymentService = this.borrowingRepaymentServiceFactory
                .getBorrowingRepaymentService(repaymentSplit.getRepaymentType());
        Borrowing borrowing = this.borrowingService.findOne(borrowingId)
                .orElseThrow(() -> new RuntimeException(String.format("Borrowing not found with (ID=%d)", borrowingId)));
        return borrowingRepaymentService.split(borrowing, repaymentSplit, UserHelper.getCurrentUser());
    }

    @RequestMapping(value = "/preview", method = POST)
    public ScheduleDto preview(
            @PathVariable Long borrowingId,
            @RequestBody RepaymentSplit repaymentSplit) throws Exception {
        this.checkPermission(borrowingId, repaymentSplit, UserHelper.getCurrentUser());
        Borrowing borrowing = this.getBorrowing(borrowingId);
        BorrowingRepaymentService borrowingRepaymentService = this.borrowingRepaymentServiceFactory
                .getBorrowingRepaymentService(repaymentSplit.getRepaymentType());
        List<BorrowingInstallment> previewList = borrowingRepaymentService.preview(borrowing, repaymentSplit, UserHelper.getCurrentUser());
        return this.borrowingScheduleMapper.mapToScheduleDto(previewList);
    }

    @RequestMapping(value = "/repay", method = POST)
    public BorrowingDetailDto repay(
            @PathVariable Long borrowingId,
            @RequestBody RepaymentSplit repaymentSplit) throws Exception {
        this.checkPermission(borrowingId, repaymentSplit, UserHelper.getCurrentUser());
        Borrowing borrowing = this.getBorrowing(borrowingId);
        BorrowingRepaymentService loanRepaymentService = this.borrowingRepaymentServiceFactory.getBorrowingRepaymentService(repaymentSplit.getRepaymentType());
        loanRepaymentService.repay(borrowing, repaymentSplit, UserHelper.getCurrentUser());
        return this.borrowingMapper.mapToDetailDto(borrowing);
    }

    private void checkPermission(Long borrowingId, RepaymentSplit repaymentSplit, User currentUser) throws AccessDeniedException {
        this.borrowingRepayValidator.validate(repaymentSplit, borrowingId);
        LocalDate timestamp = repaymentSplit.getTimestamp().toLocalDate();
        if (timestamp.isBefore(LocalDate.now()) && !currentUser.hasPermission("PAST_REPAYMENTS")) {
            throw new AccessDeniedException("You do not have permissions to make past repayments");
        }
    }

    private Borrowing getBorrowing(Long borrowingId) throws ResourceNotFoundException {
        return this.borrowingService.findOne(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Borrowing is not found (ID=%d).", borrowingId)));
    }
}
