package com.opencbs.core.domain;

import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RepaymentSplit extends BaseDto implements BaseRequestDto {

    private LocalDateTime timestamp;
    private Long paymentMethod;
    private RepaymentTypes repaymentType;

    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO.setScale(2);

    @Builder.Default
    private BigDecimal principal = BigDecimal.ZERO.setScale(2);

    @Builder.Default
    private BigDecimal interest = BigDecimal.ZERO.setScale(2);

    @Builder.Default
    private BigDecimal penalty = BigDecimal.ZERO.setScale(2);

    @Builder.Default
    private BigDecimal earlyRepaymentFee = BigDecimal.ZERO.setScale(2);

    private BigDecimal max;
    private String extra;
    private boolean isAutoRepayment;
    private boolean autoPrint;


    public void addPenalty(@NonNull BigDecimal amount) {
        penalty = penalty == null ? amount : penalty.add(amount);
    }

    public void addInterest(@NonNull BigDecimal amount) {
        interest = interest == null ? amount : interest.add(amount);
    }

    public void addPrincipal(@NonNull BigDecimal amount) {
        principal = principal == null ? amount : principal.add(amount);
    }
}
