package com.opencbs.loans.services.repayment.impl;

import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.loans.domain.LoanInstallment;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class InstallmentsHelper {

    public static LoanInstallment getInstallment(@NonNull List<LoanInstallment> installments, @NonNull Integer number) {
        return installments.stream()
                .filter(x -> x.getNumber().equals(number))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Installment not found: " + number));
    }

    public static Installment getInstallment(@NonNull List<Installment> installments, long number) {
        return installments.stream()
                .filter(x -> x.getNumber()==number)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Installment not found: " + number));
    }

    public static List<LoanInstallment> getExpiredInstallments(@NonNull List<LoanInstallment> installments, @NonNull LocalDate date) {
        return installments
                .stream()
                .filter(x -> !x.isPaid() && DateHelper.lessOrEqual(x.getMaturityDate(), date))
                .collect(Collectors.toList());
    }

    public static List<LoanInstallment> getUnpaidInstallmentsByDate(@NonNull List<LoanInstallment> installments, @NonNull LocalDate date) {
        return installments
                .stream()
                .filter(x -> !x.isPaid() && DateHelper.less(x.getMaturityDate(), date))
                .collect(Collectors.toList());
    }

    public static List<LoanInstallment> getPaidInstallments(@NonNull List<LoanInstallment> installments) {
        return installments
                .stream()
                .filter(LoanInstallment::isPaid)
                .collect(Collectors.toList());

    }

    public static List<LoanInstallment> getUnpaidInstallments(@NonNull List<LoanInstallment> installments) {
        return installments
                .stream()
                .filter(x -> !x.isPaid())
                .collect(Collectors.toList());
    }

    public static List<LoanInstallment> getNextScheduledInstallments(@NonNull List<LoanInstallment> installments, @NonNull Integer number) {
        return installments
                .stream()
                .filter(x -> x.getNumber() > number)
                .sorted(Comparator.comparingInt(LoanInstallment::getNumber))
                .collect(Collectors.toList());
    }

    public static LoanInstallment getNextScheduledInstallment(@NonNull List<LoanInstallment> installments, @NonNull Integer number) {
        return installments
                .stream()
                .filter(x -> x.getNumber() > number)
                .findFirst()
                .orElse(null);
    }

    public static LoanInstallment getNextUnpaidScheduledInstallment(@NonNull List<LoanInstallment> installments, @NonNull Integer number) {
        return installments
                .stream()
                .filter(x -> !x.isPaid() && x.getNumber() > number)
                .findFirst()
                .orElse(null);
    }

    public static Integer getLastNumberInstallment(@NonNull List<LoanInstallment> installments) {
        return installments.stream()
                .max(Comparator.comparingInt(LoanInstallment::getNumber))
                .orElseThrow(() -> new RuntimeException("Installment not found"))
                .getNumber();
    }

    public static Optional<LoanInstallment> getInstalmentByMaturityDate(List<LoanInstallment> installments, LocalDate localDate) {
        return installments.stream()
                .filter(installment->DateHelper.equal(installment.getMaturityDate(), localDate))
                .findFirst();
    }

    public static List<LoanInstallment> getFutureInstallments(List<LoanInstallment> installments, LocalDate localDate) {
        return installments.stream()
                .filter(installment->DateHelper.greaterOrEqual(installment.getMaturityDate(), localDate))
                .collect(Collectors.toList());
    }

    public static List<LoanInstallment> detachedCopyInstallments(List<LoanInstallment> installments) {
        return installments.stream()
                .map(LoanInstallment::new)
                .collect(Collectors.toList());
    }

    public static Optional<LocalDate> getNextPaymentDate(List<LoanInstallment> installments, LocalDate date) {
        final Optional<LoanInstallment> paymentInstallment = installments.stream()
                .filter(loanInstallment -> !loanInstallment.isPaid()
                        && DateHelper.greaterOrEqual(loanInstallment.getMaturityDate(), date))
                .min(Comparator.comparing(LoanInstallment::getMaturityDate));

        if (paymentInstallment.isPresent()) {
            return Optional.of(paymentInstallment.get().getMaturityDate());
        }

        return Optional.empty();
    }
}
