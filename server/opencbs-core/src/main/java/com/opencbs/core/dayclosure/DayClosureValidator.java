package com.opencbs.core.dayclosure;

import com.opencbs.core.accounting.services.TillService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.dayClosure.DayClosure;
import com.opencbs.core.domain.enums.ProcessStatus;
import com.opencbs.core.domain.enums.TillStatus;
import com.opencbs.core.helpers.AmqMessageHelper;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.DayClosureService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Validator
@RequiredArgsConstructor
public class DayClosureValidator {

    private final DayClosureService dayClosureService;
    private final AmqMessageHelper amqMessageHelper;
    private final RequestService requestService;
    private final TillService   tillService;


    public void validateTryCloseDay(LocalDate date, ProcessStatus currentStatus, User user) {
        this.checkDayClosure(date, user);
        this.checkDayClosureCurrentState(currentStatus);
        this.checkTills();
        this.amqMessageHelper.checkConnectionHealth();
    }

    private void checkDayClosure(LocalDate date, User user) {
        if (this.requestService.isActiveRequests()) {
            throw new RuntimeException("There are active requests in the system. Please approve them before Day Closure launch");
        }

        Optional<DayClosure> dayClosure = dayClosureService.getLastSuccessfulDayClosureByBranch(user.getBranch());
        LocalDate lastSuccessfulDayClosureDate = dayClosure.isPresent() ? dayClosure.get().getDay() : LocalDate.of(2000, Month.JANUARY, 1);

        if (date.isBefore(lastSuccessfulDayClosureDate)) {
            throw new RuntimeException("Current Date cannot be earlier than the last Day Closure Date");
        }

        if (dayClosure.isPresent()) {
            if (date.equals(lastSuccessfulDayClosureDate)) {
                if (!dayClosure.get().isFailed()) {
                    throw new RuntimeException("You have already launched Day Closure process today");
                }
            }
        }
    }

    private void checkDayClosureCurrentState(ProcessStatus currentStatus) {
        if (this.isDayClosureInProgress(currentStatus)) {
            throw new RuntimeException("Day closure is already in progress");
        }
    }

    private boolean isDayClosureInProgress(ProcessStatus currentStatus) {
        return currentStatus.equals(ProcessStatus.IN_PROGRESS);
    }

    public void checkTills() {
        List<String> tillNames = new ArrayList();
        this.tillService.findAllByStatus(TillStatus.OPENED)
                .forEach(till->tillNames.add(till.getName()));
        if(CollectionUtils.isEmpty(tillNames)){
            return;
        }

        throw new RuntimeException(String.format("You have opened tills (%s)", String.join(",", tillNames)));
    }
}