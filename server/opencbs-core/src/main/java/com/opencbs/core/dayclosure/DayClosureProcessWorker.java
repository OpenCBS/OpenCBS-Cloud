package com.opencbs.core.dayclosure;

import com.opencbs.core.accounting.services.RecalculateBalanceService;
import com.opencbs.core.configs.properties.DayClosureProperties;
import com.opencbs.core.controllers.InstanceInformation;
import com.opencbs.core.dayclosure.service.DayClosureContainerExecutor;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.ProcessStatus;
import com.opencbs.core.dto.DayClosureStateDto;
import com.opencbs.core.dto.ProcessDto;
import com.opencbs.core.dto.messenger.MessageDto;
import com.opencbs.core.dto.messenger.MessageType;
import com.opencbs.core.dto.messenger.SystemMessageType;
import com.opencbs.core.email.EmailService;
import com.opencbs.core.email.TemplateGenerator;
import com.opencbs.core.helpers.AmqMessageHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.DayClosureService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.core.services.operationdayservices.Container;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

import static com.opencbs.core.helpers.DateHelper.lessOrEqual;

@Slf4j
@Service
@RequiredArgsConstructor
public class DayClosureProcessWorker {

    public static final String DAY_CLOSURE_INIT_DATE = "DAY_CLOSURE_INIT_DATE";

    private final DayClosureService dayClosureService;
    private final GlobalSettingsService globalSettingsService;
    private final AmqMessageHelper amqMessageHelper;
    private final ApplicationContext applicationContext;
    private final RecalculateBalanceService recalculateBalanceService;
    private final DayClosureValidator dayClosureValidator;
    private final DayClosureProperties dayClosureProperties;
    private final InstanceInformation instanceInformation;
    private final EmailService emailService;

    private final List<Container> containers;
    private int leftDays;

    @Getter
    private ProcessStatus status = ProcessStatus.DONE;


    @PostConstruct
    public void initialize() {
        this.containers.sort(Comparator.comparingInt(Container::getOrder));
    }

    @Scheduled(cron="${day-closure.auto-start-time}")
    public void autoStart() {
        if( this.dayClosureProperties.getAutoStart()) {
            this.dayClosure(DateHelper.getLocalDateNow(), UserHelper.getSystemUser());
        }
    }

    public void dayClosure(LocalDate launchDate, User user) {
        this.dayClosureValidator.validateTryCloseDay(launchDate, this.status, user);
        this.processDayClosure(launchDate, user);
    }

    @Async
    public void processDayClosure(LocalDate launchDate, User user) {
        this.status = ProcessStatus.IN_PROGRESS;
        LocalDate dayClosureDate = getLastDayClosureDate(user);
        final LocalDateTime startTime = DateHelper.getLocalDateTimeNow();

        try {
            log.info("Day closure was started from {} to {}", DateHelper.convert(dayClosureDate), DateHelper.convert(launchDate));
            while (lessOrEqual(dayClosureDate, launchDate)) {
                log.info("DayClosureProcessor day closure for date {} start", DateHelper.convert(dayClosureDate));
                long startTimeDay = System.currentTimeMillis();
                setLeftDays(dayClosureDate, launchDate);

                for (Container container : containers) {
                    long startTimeContainer = System.currentTimeMillis();
                    processContainer(container, dayClosureDate, user);
                    log.info("DayClosureProcessor in progress for date {}. Container {} finish, it took {} seconds",
                            DateHelper.convert(dayClosureDate), container.getType().toString(), (System.currentTimeMillis() - startTimeContainer) / 1000);
                }

                dayClosureService.createDayClosure(dayClosureDate, startTime, DateHelper.getLocalDateTimeNow(),
                        LocalDateTime.of(launchDate, startTime.toLocalTime()), null, user.getBranch());

                log.info("DayClosureProcessor day closure for date {} finish. It took {} seconds",
                        DateHelper.convert(dayClosureDate), (System.currentTimeMillis() - startTimeDay) / 1000);

                dayClosureDate = dayClosureDate.plusDays(1);
            }

            log.info("Recalculate of balances for back-date transactions start");
            this.recalculateBalanceService.recalculateBalances();
            log.info("Recalculate of balances for back-date transactions end");

            this.amqNotice(user);
            log.info("Day closure was successful done");

        } catch (Exception e) {
            log.error("Day closure was done with error: {}",e.getMessage());
            dayClosureService.createDayClosure(dayClosureDate, startTime, DateHelper.getLocalDateTimeNow(),
                    LocalDateTime.of(launchDate, startTime.toLocalTime()), e.getMessage(), user.getBranch());
            amqMessageHelper.sendSystemMessage(SystemMessageType.ERROR, String.format("Day closure was done with error: %s",e.getMessage()));
            this.sendDayClosureError(this.dayClosureProperties.getErrorToEmails(), dayClosureDate, e);
        } finally {
            status = ProcessStatus.DONE;
        }
    }

    private void processContainer(@NonNull Container container, @NonNull LocalDate dayClosureDate, @NonNull User user) {
        List<Long> contractIds = container.getIdsContracts(user.getBranch());
        List<List<Long>> contractPartitions = ListUtils.partition(contractIds, 100);

        List<Future<Void>> futures = contractPartitions.stream().map(
                x -> {
                    DayClosureContainerExecutor closureService = applicationContext.getBean(DayClosureContainerExecutor.class);
                    return closureService.processContainerContracts(container, x, dayClosureDate, user);
                }
                ).collect(Collectors.toList());

        waitContainerExecutionComplete(futures, container, user);
    }

    private void waitContainerExecutionComplete(@NonNull List<Future<Void>> futures, @NonNull Container container, @NonNull User user) {
        if (futures.isEmpty()) {
            sendProcessStatusMessage(user, container, 100);
            return;
        }

        int completed = 0;
        do {
            completed = getCompletedTaskCount(futures);
            double completedPercent = (100 / futures.size()) * completed;

            sendProcessStatusMessage(user, container, (int) completedPercent);

            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                // Ignore exception, not need to process it
            }
        } while (futures.size() > completed);

        // Re-throw exception if exist
        Exception exception = null;
        for (Future future : futures) {
            try {
                future.get();
            } catch (Exception e) {
                exception = e;
            }
        }

        if (null != exception) {
            exception.printStackTrace();
            throw new RuntimeException(exception);
        }

        sendProcessStatusMessage(user, container, 100);
    }

    @SneakyThrows
    private int getCompletedTaskCount(@NonNull List<Future<Void>> futures) {
        int completed = 0;
        for (Future future : futures) {
            try {
                future.get(1, TimeUnit.MILLISECONDS);
                completed++;
            } catch (TimeoutException e) {
                // Do nothing, only count completed threads
            }
        }

        return completed;
    }

    private void sendProcessStatusMessage(User user, Container container, int percentage) {
        DayClosureStateDto dayClosureStateDto = DayClosureStateDto.builder()
                .processes(Collections.singletonMap(container.getType(),
                        ProcessDto.builder()
                                .progress(percentage)
                                .title(container.getTitle())
                                .status(ProcessStatus.IN_PROGRESS)
                                .build())
                )
                .leftDays(leftDays)
                .build();

        this.amqMessageHelper.sendMessageToUser(user, MessageDto.builder()
                .messageType(MessageType.DAY_CLOSURE)
                .payload(dayClosureStateDto)
                .build()
        );
    }

    private void amqNotice(User user) {
        this.amqMessageHelper.sendMessageToUser(user, MessageDto.builder().messageType(MessageType.DAY_CLOSURE).payload(getDayClosureState()).build());
        this.amqMessageHelper.sendSystemMessage(SystemMessageType.INFO, "Day closure process was done");
    }

    private DayClosureStateDto getDayClosureState() {
        return DayClosureStateDto.builder()
                .leftDays(this.leftDays)
                .status(this.status)
                .build();
    }

    private void setLeftDays(LocalDate fromDate, LocalDate toDate) {
        this.leftDays = Math.toIntExact(ChronoUnit.DAYS.between(fromDate, toDate));
    }

    public DayClosureStateDto getDayClosureProcessStatus() {
        Map<ModuleType, ProcessDto> processDtos = new HashMap<>();

        for (Container container : this.containers) {
            processDtos.put(
                    container.getType(),
                    ProcessDto.builder()
                            .order(container.getOrder())
                            .title(container.getTitle())
                            .status(ProcessStatus.DONE)
                            .build()
            );
        }

        DayClosureStateDto dayClosureStateDto = getDayClosureState();
        dayClosureStateDto.setProcesses(processDtos);

        return dayClosureStateDto;
    }

    private LocalDate getLastDayClosureDate(User user) {
        return dayClosureService.getLastSuccessfulDayClosureByBranch(user.getBranch())
                .map(dc -> dc.getDay().plusDays(1))
                .orElse(DateHelper.dateToLocalDateTime(
                        DateHelper.convert(globalSettingsService.getSettingValue(DAY_CLOSURE_INIT_DATE)
                        )).toLocalDate()
                );
    }

    @SneakyThrows
    public void sendDayClosureError(Collection<String> emails, LocalDate localDate, Exception exception) {
        Map<String, Object> variables = new HashMap();
        variables.put("instance", instanceInformation.getInfo());
        variables.put("message", exception.getMessage());
        variables.put("trace",ExceptionUtils.getStackTrace(exception));
        variables.put("date", DateHelper.convert(localDate));

        this.emailService.sendEmail(emails,"Day closure error",
                TemplateGenerator.getContent("day_closure_error.html", variables));
    }
}
