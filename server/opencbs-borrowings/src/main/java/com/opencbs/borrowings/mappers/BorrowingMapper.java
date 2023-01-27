package com.opencbs.borrowings.mappers;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.SimplifiedBorrowing;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.borrowings.dto.BorrowingDetailDto;
import com.opencbs.borrowings.dto.BorrowingDto;
import com.opencbs.borrowings.dto.BorrowingSimplifiedDto;
import com.opencbs.borrowings.services.BorrowingProductService;
import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.accounting.services.AccountService;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Mapper
public class BorrowingMapper {

    private final BorrowingProductService borrowingProductService;
    private final ProfileService profileService;
    private final BorrowingScheduleMapper borrowingScheduleMapper;
    private final AccountService accountService;

    public BorrowingMapper(BorrowingProductService borrowingProductService,
                           ProfileService profileService,
                           BorrowingScheduleMapper borrowingScheduleMapper,
                           AccountService accountService) {
        this.borrowingProductService = borrowingProductService;
        this.profileService = profileService;
        this.borrowingScheduleMapper = borrowingScheduleMapper;
        this.accountService = accountService;
    }

    public BorrowingDetailDto mapToDetailDto(Borrowing borrowing) {
        ModelMapper modelMapper = new ModelMapper();
        BorrowingDetailDto result = modelMapper.map(borrowing, BorrowingDetailDto.class);
        result.setDisbursementDate(borrowing.getDisbursementDate().toLocalDate());
        return result;
    }

    public BorrowingDto mapToDto(Borrowing borrowing){
        BorrowingDto borrowingDto = new ModelMapper().map(borrowing, BorrowingDto.class);
        borrowingDto.setBorrowingProductId(borrowing.getBorrowingProduct().getId());
        borrowingDto.setProfileId(borrowing.getProfile().getId());
        borrowingDto.setCorrespondenceAccountId(borrowing.getCorrespondenceAccount().getId());
        borrowingDto.setDisbursementDate(borrowing.getDisbursementDate().toLocalDate());
        return borrowingDto;
    }

    public ScheduleDto mapToSchedule(List<BorrowingInstallment> borrowingInstallments) {
        return this.borrowingScheduleMapper.mapToScheduleDto(borrowingInstallments);
    }

    public Borrowing mapToEntity(BorrowingDto borrowingDto, User currentUser) {
        Borrowing map = new ModelMapper().map(borrowingDto, Borrowing.class);
        map.setBorrowingProduct(this.borrowingProductService.findOne(borrowingDto.getBorrowingProductId()).get());
        map.setCreatedAt(LocalDateTime.now());
        map.setCreatedBy(currentUser);
        map.setStatus(BorrowingStatus.PENDING);
        map.setLoanOfficer(currentUser);
        map.setProfile(this.profileService.findOne(borrowingDto.getProfileId()).get());
        map.setDisbursementDate(LocalDateTime.of(borrowingDto.getDisbursementDate(), LocalTime.now()));
        map.setCorrespondenceAccount(this.accountService.findOne(borrowingDto.getCorrespondenceAccountId()).get());
        map.setBranch(currentUser.getBranch());
        return map;
    }

    public Borrowing zip(Borrowing loanApplication, BorrowingDto dto, User currentUser) {
        Borrowing zippedBorrowing = this.mapToEntity(dto, currentUser);
        zippedBorrowing.setLoanOfficer(currentUser);
        zippedBorrowing.setCreatedAt(loanApplication.getCreatedAt());
        zippedBorrowing.setCreatedBy(loanApplication.getCreatedBy());
        return zippedBorrowing;
    }

    public BorrowingSimplifiedDto mapToSimplifiedDto(SimplifiedBorrowing simplifiedBorrowing) {
        BorrowingSimplifiedDto dto = new ModelMapper().map(simplifiedBorrowing, BorrowingSimplifiedDto.class);
        dto.setCreatedBy(simplifiedBorrowing.getUserName());
        return dto;
    }
}
