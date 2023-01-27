package com.opencbs.loans.services.loancloseday;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.email.TemplateGenerator;
import com.opencbs.core.services.ProfileHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.notificators.LoanNotificatorSender;
import com.opencbs.loans.notificators.LoanRemember;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
//@Service
public class LoanReminderDayClosureProcessor implements LoanDayClosureProcessor {

    private final static String TEMPLATE_PATH = "notification/loan/%s.html";
    private final LoanService loanService;
    private final LoanNotificatorSender loanNotificatorSender;
    private final ProfileHelper profileHelper;
    private final List<LoanRemember> loanReminders;


    @Override
    public void processContract(Long loanId, LocalDate closureDate, User user) {
        final Loan loan = this.loanService.getLoanById(loanId);
        for(LoanRemember loanReminder: loanReminders) {
            if (loanReminder.isNeedSendReminder(loan, closureDate)) {
                this.loanNotificatorSender.sendReminber(
                        loanReminder.getTitle(),
                        this.getReminder(loanReminder, loanReminder.getValues(loan, closureDate)),
                        this.getRecipients(loan)
                );
            }
        }
    }

    private String getReminder(LoanRemember loanReminder, HashMap values) {
        return TemplateGenerator.getContent(String.format(TEMPLATE_PATH, loanReminder.getType().toString().toLowerCase()), values);
    }

    private List<String> getRecipients(Loan loan) {
        List<String> recipients = new ArrayList<>();
        final Optional<String> emailByProfile = this.profileHelper.getEmailByProfile(loan.getProfile());
        if (emailByProfile.isPresent()) {
            recipients.add(emailByProfile.get());
        }
        recipients.add(loan.getLoanOfficer().getEmail());
        return recipients;
    }

    @Override
    public ProcessType getProcessType() {
        return ProcessType.LOAN_REMINDER_PROCESS;
    }

    @Override
    public String getIdentityString() {
        return "loan.reminder";
    }
}
