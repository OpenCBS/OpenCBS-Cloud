package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVoteHistory;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteHistoryDto;
import org.modelmapper.ModelMapper;

@Mapper
public class CreditCommitteeVoteHistoryMapper {
    public CreditCommitteeVoteHistoryDto mapToDto(CreditCommitteeVoteHistory creditCommitteeVoteHistory) {
        return new ModelMapper().map(creditCommitteeVoteHistory, CreditCommitteeVoteHistoryDto.class);
    }
}
