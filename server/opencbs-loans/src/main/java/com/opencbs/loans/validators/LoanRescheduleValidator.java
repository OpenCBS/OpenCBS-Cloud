package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.repositories.LoanEventRepository;
import com.opencbs.loans.services.LoanEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;

@RequiredArgsConstructor
@Validator
public class LoanRescheduleValidator {
    private LoanEventRepository loanEventRepository;
    private final LoanValidator loanValidator;
    private final LoanEventService loanEventService;


    public void validate(RescheduleDto rescheduleDto, Loan loan) {
        this.loanValidator.validateClosedLoan(loan.getId());

        ActualizeHelper.isActualized(loan.getId(), ModuleType.LOANS, rescheduleDto.getRescheduleDate());

        Assert.notNull(rescheduleDto.getRescheduleDate(), "Reschedule date is required.");
        Assert.isTrue(!this.loanEventService.isExistsRepaymentEventWasLateDate(loan.getId(), rescheduleDto.getRescheduleDate()), "Can't make repayment because was repayment" );
        Assert.isTrue(!DateHelper.isDayOff(rescheduleDto.getRescheduleDate()), "Reschedule date should be a working date");
        Assert.notNull(rescheduleDto.getFirstInstallmentDate(), "First installment date is required.");
        Assert.notNull(rescheduleDto.getInterestRate(), "Interest rate is required.");

        if (isScheduleTypeByInstalment(loan)) {
            Assert.notNull(rescheduleDto.getMaturity(), "Maturity is required.");
        }

        if (rescheduleDto.getMaturityDate()!=null) {
            Assert.isTrue(!DateHelper.isDayOff(rescheduleDto.getMaturityDate()), "Maturity date should be a working date");
            Assert.isTrue(DateHelper.greaterOrEqual(rescheduleDto.getFirstInstallmentDate(), rescheduleDto.getMaturityDate()),
                    "First installment date should precede Maturity date.");
        }

        if (rescheduleDto.getGracePeriod() != null && isScheduleTypeByInstalment(loan)) {
            Assert.isTrue(rescheduleDto.getMaturity() > rescheduleDto.getGracePeriod(),
                    "Grace period cannot be equal or more than maturity.");
        }

        Assert.isTrue(DateHelper.greaterOrEqual(rescheduleDto.getFirstInstallmentDate(), rescheduleDto.getRescheduleDate()),
                "Reschedule date should precede First installment date.");

        LoanProduct loanProduct = loan.getLoanApplication().getLoanProduct();
        Assert.isTrue(
                loanProduct.getInterestRateMin().doubleValue() <= rescheduleDto.getInterestRate().doubleValue()
                        && rescheduleDto.getInterestRate().doubleValue() <= loanProduct.getInterestRateMax().doubleValue(),
                String.format("Interest rate has to be between %.2f and %.2f.",
                        loanProduct.getInterestRateMin().doubleValue(), loanProduct.getInterestRateMax().doubleValue()));
    }

    private boolean isScheduleTypeByInstalment(Loan loan) {
        return ScheduleBasedType.BY_INSTALLMENT.equals(loan.getLoanApplication().getLoanProduct().getScheduleBasedType());
    }
}
