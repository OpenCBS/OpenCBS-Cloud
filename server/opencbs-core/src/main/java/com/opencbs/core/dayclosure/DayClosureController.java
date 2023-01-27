package com.opencbs.core.dayclosure;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.DayClosureStateDto;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/day-closure")
@RequiredArgsConstructor

@SuppressWarnings("unused")
public class DayClosureController extends BaseController {

    private final DayClosureProcessWorker dayClosureProcessWorker;


    @PermissionRequired(moduleType = ModuleType.DAY_CLOSURE,
            name = "DAY_CLOSURE",
            description = "Day Closure activates mechanism that calculates interest, penalty, analytics and performs autorepayments.")
    @PostMapping
    public Map<String, Object> startDayClosure(@RequestParam(value = "date")
                                               @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime date) {
        dayClosureProcessWorker.dayClosure(date.toLocalDate(), UserHelper.getCurrentUser());

        HashMap<String, Object> message = new HashMap<>();
        message.put("message", "Day Closure has started");
        return message;
    }

    @GetMapping(value = "/status")
    public DayClosureStateDto getDayClosureProcessStatus() {
        return dayClosureProcessWorker.getDayClosureProcessStatus();
    }

}