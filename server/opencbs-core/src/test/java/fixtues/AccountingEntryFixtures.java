package fixtues;

import com.opencbs.core.accounting.dto.MultipleTransactionAmountDto;
import com.opencbs.core.accounting.dto.MultipleTransactionDto;

import java.math.BigDecimal;
import java.util.Collections;

public class AccountingEntryFixtures {

    public static MultipleTransactionDto getMultipleTransactionDto(Long accountId, boolean isDebit,
                                                            MultipleTransactionAmountDto multipleTransactionAmountDto) {
        MultipleTransactionDto multipleTransactionDto = new MultipleTransactionDto();
        multipleTransactionDto.setAccountId(accountId);
        multipleTransactionDto.setAccountWillBeDebit(isDebit);
        multipleTransactionDto.setAmounts(Collections.singletonList(multipleTransactionAmountDto));
        multipleTransactionDto.setDateTime(CommonFixtures.getLocalDateTime());
        multipleTransactionDto.setDescription("Some Description");
        return multipleTransactionDto;
    }

    public static MultipleTransactionAmountDto getMultipleTransactionAmountDto(BigDecimal amount, Long accountId) {
        return new MultipleTransactionAmountDto(amount, accountId);
    }
}
