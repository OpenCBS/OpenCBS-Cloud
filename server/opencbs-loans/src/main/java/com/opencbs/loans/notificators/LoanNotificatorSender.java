package com.opencbs.loans.notificators;

import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.ProfileHelper;
import com.opencbs.loans.domain.Loan;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
final public class LoanNotificatorSender {

    private final String DISBURSED_TEMPLATE = "loan_disbursed";
    private final String REPAYMENT_ENTERED_TEMPLATE = "repayment_entered";
    private final String RESCHEDULED_TEMPLATE = "loan_rescheduled";
    private final String CLOSED_TEMPLATE = "loan_closed";

    //private final EmailService emailService;
    private final List<LoanRemember> loanNotifications;
    private final ProfileHelper profileHelper;

    public void sendRepaymentEnteredNotifiction(@NonNull Loan loan, RepaymentSplit repayment) {
        HashMap values = new HashMap();

        values.put("repayment_data", repayment.getTimestamp().toLocalDate());
        values.put("total_amount", repayment.getTotal());
        values.put("principal_amount", repayment.getPrincipal());
        values.put("interest_amount", repayment.getInterest());
        values.put("penalty_amount", repayment.getPenalty());

        values.put("customer_name", loan.getProfile().getNameFromCustomFields());
        values.put("loan_code", loan.getCode());
        values.put("loan_office_email", loan.getLoanOfficer().getEmail());
        values.put("loan_amount", loan.getAmount());

        String content = this.getContent(REPAYMENT_ENTERED_TEMPLATE, values);
        List<String> recipients = this.getRecipients(loan);

        //this.emailService.sendEmail(recipients, "Repayment Entered", content);
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

    private String getContent(String template, HashMap values) {
        return ""; //TemplateGenerator.getContent(String.format("notification/loan/%s.html",template), values);
    }

    public void senLoanReschedulerNotification(@NonNull Loan loan, RescheduleDto reschedule){
        HashMap values = new HashMap();

        values.put("customer_name", loan.getProfile().getNameFromCustomFields());
        values.put("loan_code", loan.getCode());
        values.put("loan_amount", loan.getAmount());
        values.put("loan_rate", reschedule.getInterestRate());
        values.put("first_maturity_date", reschedule.getFirstInstallmentDate());
        values.put("loan_office_email", loan.getLoanOfficer().getEmail());

        String content = this.getContent(RESCHEDULED_TEMPLATE, values);
        List<String> recipients = this.getRecipients(loan);

        //this.emailService.sendEmail(recipients, "Loan was rescheduled", content);
    }

    public void senLoanDisbursedNotification(@NonNull Loan loan){
        HashMap values = new HashMap();
        values.put("customer_name", loan.getProfile().getNameFromCustomFields());
        values.put("loan_code", loan.getCode());
        values.put("loan_office_email", loan.getLoanOfficer().getEmail());
        values.put("loan_amount", loan.getAmount());

        String content = this.getContent(DISBURSED_TEMPLATE, values);
        List<String> recipients = this.getRecipients(loan);

        this.sendReminber("Disbursed loan", content, recipients);
    }

    public void senLoanClosedNotification(@NonNull Loan loan) {
        HashMap values = new HashMap();
        values.put("customer_name", loan.getProfile().getNameFromCustomFields());
        values.put("loan_code", loan.getCode());
        values.put("loan_office_email", loan.getLoanOfficer().getEmail());

        String content = this.getContent(CLOSED_TEMPLATE, values);
        List<String> recipients = this.getRecipients(loan);

        this.sendReminber("Loan was closed", content, recipients);
    }

    private LoanRemember getRememberByType(LoanRememberType loanRememberType) {
        return this.loanNotifications.stream()
                .filter(loanNotificator -> loanNotificator.getType().equals(loanRememberType))
                .findFirst()
                .orElseThrow(()->
                        new ResourceNotFoundException(String.format("Loan notificator with type:%s not found", loanRememberType)));
    }

    public void sendReminber(String title, String reminder, List<String> recipients) {
        //this.emailService.sendEmail(recipients, title, reminder);
    }
}
