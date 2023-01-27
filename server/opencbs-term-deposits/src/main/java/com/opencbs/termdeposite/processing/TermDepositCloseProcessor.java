package com.opencbs.termdeposite.processing;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.termdeposite.annotaions.CustomTermDepositDayClosureProcessor;
import com.opencbs.termdeposite.domain.TermDepositClose;
import com.opencbs.termdeposite.repositories.TermDepositCloseRepository;
import com.opencbs.termdeposite.services.TermDepositCloseInterface;
import com.opencbs.termdeposite.services.TermDepositService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@ConditionalOnMissingBean(annotation = CustomTermDepositDayClosureProcessor.class)
public class TermDepositCloseProcessor implements TermDepositDayClosureProcessor {

    private final TermDepositService termDepositService;
    private final TermDepositCloseInterface termDepositCloseInterface;
    private final TermDepositCloseRepository termDepositCloseRepository;


    @Override
    public void processContract(@NonNull  Long termDepositId, @NonNull LocalDate date, @NonNull User user) {
        TermDepositClose termDeposit = termDepositCloseRepository.findOne(termDepositId);
        LocalDate closeDate = termDepositService.getExpiredDate(termDeposit.getOpenDate(), termDeposit.getTermAgreement());
        if (date.equals(closeDate)) {
            termDepositCloseInterface.close(termDepositId, date);
        }
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.TERM_DEPOSIT_CLOSING;
    }

    @Override
    public String getIdentityString() {
        return "term-deposit.closing";
    }
}
