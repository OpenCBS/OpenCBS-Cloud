package com.opencbs.loans.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.*;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.BranchDto;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.dto.group.FullGroupMemberAmountsDto;
import com.opencbs.core.dto.group.GroupMemberAmountsDto;
import com.opencbs.core.dto.profiles.ProfileCustomFieldSectionDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.mappers.AttachmentMapper;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.serivce.RequestService;
import com.opencbs.core.services.*;
import com.opencbs.core.workers.LookupWorker;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.dto.CreditLineInfoDto;
import com.opencbs.loans.credit.lines.mappers.CreditLineMapper;
import com.opencbs.loans.credit.lines.services.CreditLineService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomField;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;
import com.opencbs.loans.domain.enums.LoanApplicationPayeeStatus;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.LoanApplicationDto;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteDto;
import com.opencbs.loans.dto.loanapplications.*;
import com.opencbs.loans.services.*;
import com.opencbs.loans.validators.LoanApplicationCustomFieldValueValidator;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import javax.persistence.DiscriminatorValue;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Mapper
@RequiredArgsConstructor
public class LoanApplicationMapper {

    private class LoanApplicationToDtoMap extends PropertyMap<LoanApplication, LoanApplicationDto> {
        protected void configure() {
            skip().setInstallments(null);
            skip().setCreditCommitteeVotes(null);
            skip().setLoan(null);
        }
    }

    private final LoanProductService loanProductService;
    private final ProfileService profileService;
    private final LoanScheduleMapper loanScheduleMapper;
    private final AttachmentMapper attachmentMapper;
    private final LoanApplicationPayeeMapper loanApplicationPayeeMapper;
    private final LoanApplicationEntryFeeMapper loanApplicationEntryFeeMapper;
    private final PayeeService payeeService;
    private final EntryFeeService entryFeeService;
    private final LoanApplicationCustomFieldService loanApplicationCustomFieldService;
    private final LoanApplicationCustomFieldSectionService loanApplicationCustomFieldSectionService;
    private final LoanApplicationCustomFieldMapper loanApplicationCustomFieldMapper;
    private final LookupWorker lookupWorker;
    private final GuarantorMapper guarantorMapper;
    private final LoanService loanService;
    private final LoanMapper loanMapper;
    private final CurrencyService currencyService;
    private final GroupLoanApplicationService groupLoanApplicationService;
    private final UserService userService;
    private final BranchService branchService;
    private final RequestService requestService;
    private final LoanApplicationCustomFieldValueValidator loanApplicationCustomFieldValueValidator;
    private final CreditLineMapper creditLineMapper;
    private final CreditLineService creditLineService;


    public LoanApplicationDto mapToDtoSimplified(SimplifiedLoanBase loanApplication) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new PropertyMap<SimplifiedLoanBase, LoanApplicationDto>() {

            @Override
            protected void configure() {
                skip().setAmounts(null);
            }
        });
        LoanApplicationDto dto = modelMapper.map(loanApplication, LoanApplicationDto.class);
        dto.setAmounts(new ArrayList<>());

        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        if (loanApplication.getProfileType().equals(groupTypeOfProfile)) {
            LoanApplication lp = new LoanApplication() {{
                setId(loanApplication.getId());
            }};
            BigDecimal totalAmount = this.groupLoanApplicationService.findAllByLoanApplication(lp)
                    .stream()
                    .map(GroupLoanApplication::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.getAmounts().add(this.getMemberForAmount(null, totalAmount, null));
        } else {
            dto.getAmounts().add(this.getMemberForAmount(loanApplication.getProfileId(), loanApplication.getAmount(), loanApplication.getProfileName()));
        }
        return dto;
    }

    public LoanApplicationDto mapToDtoWithExtraFields(LoanApplication loanApplication) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new PropertyMap<LoanApplication, LoanApplicationDto>() {

            @Override
            protected void configure() {
                skip().setInstallments(null);
                skip().setCreditCommitteeVotes(null);
                skip().setLoan(null);
                skip().setAmounts(null);
            }
        });
        User user = this.userService.findById(loanApplication.getCreatedBy().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found (ID=%d).", loanApplication.getCreatedBy().getId())));
        loanApplication.setCreatedBy(user);

        User loanOfficer = this.userService.findById(loanApplication.getLoanOfficer().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Officer not found (ID=%d).", loanApplication.getCreatedBy().getId())));
        loanApplication.setLoanOfficer(loanOfficer);

        LoanApplicationDto dto = modelMapper.map(loanApplication, LoanApplicationDto.class);
        Currency currency = this.currencyService.findOne(loanApplication.getCurrencyId()).get();
        dto.setCurrencyName(currency.getName());
        dto.setInstallments(this.loanScheduleMapper.mapLoanApplicationInstallmentsToScheduleDto(loanApplication.getInstallments()));
        dto.setAmounts(new ArrayList<>());

        if (this.isItLoanApplicationForGroup(loanApplication)) {
            List<GroupLoanApplication> allMembers = this.groupLoanApplicationService.findAllByLoanApplication(loanApplication);
            for (GroupLoanApplication member : allMembers) {
                dto.getAmounts().add(this.getMemberForAmount(member.getId(), member.getAmount(), member.getMember().getName()));
            }
        } else {
            Loan loan = this.loanService.findByLoanApplicationIdAndProfileId(loanApplication.getId(), loanApplication.getProfile().getId());
            if (loan != null && loan.getStatus() == LoanStatus.ACTIVE) {
                dto.setLoan(this.loanMapper.mapToDto(loan));
            }
            dto.getAmounts().add(this.getMemberForAmount(loanApplication.getProfile().getId(),
                    loanApplication.getAmount(), loanApplication.getProfile().getName()));
        }

        dto.setAttachments(
                loanApplication.getAttachments()
                        .stream()
                        .map(this.attachmentMapper::mapToDto)
                        .collect(Collectors.toList())
        );
        if (loanApplication.getLoanApplicationPayees() != null) {
            List<LoanApplicationPayeesUpdateDto> payees = loanApplication.getLoanApplicationPayees()
                    .stream()
                    .map(this.loanApplicationPayeeMapper::mapToDto)
                    .collect(Collectors.toList());
            for (LoanApplicationPayeesUpdateDto payee : payees) {
                payee.setIsDeleted(payee.getClosedAt() != null);
            }
            dto.setPayees(payees);
            dto.setActivePayeesCount(payees.stream().filter(x -> x.getClosedAt() == null).count());
        }
        if (loanApplication.getLoanApplicationEntryFees() != null) {
            dto.setEntryFees(
                    loanApplication.getLoanApplicationEntryFees()
                            .stream()
                            .map(this.loanApplicationEntryFeeMapper::mapToDto)
                            .collect(Collectors.toList()));
        }
        if (loanApplication.getGuarantors() != null) {
            dto.setGuarantors(
                    loanApplication.getGuarantors()
                            .stream()
                            .map(this.guarantorMapper::mapToDto)
                            .collect(Collectors.toList()));
        }
        if (loanApplication.getCreditCommitteeVotes() != null) {
            ModelMapper temp = new ModelMapper();
            dto.setCreditCommitteeVotes(loanApplication.getCreditCommitteeVotes()
                    .stream()
                    .map(x -> temp.map(x, CreditCommitteeVoteDto.class))
                    .collect(Collectors.toList()));
        }
        dto.setReadOnly(this.requestService.isActiveRequest(RequestType.LOAN_DISBURSEMENT, loanApplication.getId()));

        if (!CollectionUtils.isEmpty(loanApplication.getLoanApplicationPenalties())) {
            ModelMapper loanApplicationPenaltyMapper = new ModelMapper();

            dto.setPenaltyDtos(
                loanApplication.getLoanApplicationPenalties()
                    .stream()
                    .map(lap->loanApplicationPenaltyMapper.map(lap, LoanApplicationPenaltyDto.class))
                    .collect(Collectors.toList())
            );
        }

        if (loanApplication.getCreditLine() != null) {
            CreditLineInfoDto creditLineInfoDto = this.creditLineMapper.mapInfoToDto(loanApplication.getCreditLine());
            dto.setCreditLineInfoDto(creditLineInfoDto);
        }

        return dto;
    }

    private FullGroupMemberAmountsDto getMemberForAmount(Long memberId, BigDecimal amount, String name) {
        return new FullGroupMemberAmountsDto() {{
            setMemberId(memberId);
            setAmount(amount);
            setName(name);
        }};
    }

    private boolean isItLoanApplicationForGroup(LoanApplication loanApplication) {
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        return loanApplication.getProfile().getType().equals(groupTypeOfProfile);
    }

    public LoanApplicationDto mapToDto(LoanApplication loanApplication) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new LoanApplicationToDtoMap());
        LoanApplicationDto dto = modelMapper.map(loanApplication, LoanApplicationDto.class);
        dto.setAmounts(new ArrayList<>());

        Branch branch = this.branchService.findOne(loanApplication.getBranch().getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Branch not found (ID =%d).", loanApplication.getBranch().getId())));
        BranchDto branchDto = new BranchDto();
        branchDto.setName(branch.getName());
        dto.setBranch(branchDto);

        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        if (loanApplication.getProfile().getType().equals(groupTypeOfProfile)) {
            BigDecimal totalAmount = this.groupLoanApplicationService.findAllByLoanApplication(loanApplication)
                    .stream()
                    .map(GroupLoanApplication::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.getAmounts().add(this.getMemberForAmount(null, totalAmount, null));
        } else {
            dto.getAmounts().add(this.getMemberForAmount(loanApplication.getProfile().getId(),
                    loanApplication.getAmount(), loanApplication.getProfile().getName()));
        }
        return dto;
    }

    public LoanApplication createMapToEntity(LoanApplicationCreateDto dto) {
        LoanApplication loanApplication = this.mapToEntity(dto);
        this.fillLoanApplicationPenalties(loanApplication);

        return loanApplication;
    }

    private LoanApplication mapToEntity(LoanApplicationBaseDto dto) {
        LoanProduct product = this.loanProductService.getOne(dto.getLoanProductId()).get();
        LoanApplication loanApplication = new ModelMapper().map(dto, LoanApplication.class);
        loanApplication.setLoanProduct(product);
        if (dto.getCreditLineId() != null) {
            CreditLine creditLine = this.creditLineService.getCreditLineById(dto.getCreditLineId());
            loanApplication.setCreditLine(creditLine);
        }

        Profile profile = this.profileService.findOne(dto.getProfileId()).get();
        loanApplication.setProfile(profile);

        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        if (profile.getType().equals(groupTypeOfProfile)) {
            loanApplication.setAmount(BigDecimal.ZERO);
        } else {
            loanApplication.setAmount(dto.getAmounts().get(0).getAmount());
        }

        loanApplication.setAttachments(new ArrayList<>());
        loanApplication.setLoanApplicationPayees(new ArrayList<>());
        loanApplication.setLoanApplicationEntryFees(new ArrayList<>());
        loanApplication.setCurrencyId(product.getCurrency() == null
                ? dto.getCurrencyId()
                : product.getCurrency().getId());
        loanApplication.setScheduleType(product.getScheduleType() == null
                ? dto.getScheduleType()
                : product.getScheduleType());

        List<LoanApplicationPayees> payees = dto.getPayees() == null ? new ArrayList<>() : dto.getPayees()
                .stream()
                .map(x -> {
                    LoanApplicationPayees loanApplicationPayees = new ModelMapper()
                            .map(x, LoanApplicationPayees.class);
                    Payee payee = this.payeeService.findOne(x.getPayeeId()).get();
                    loanApplicationPayees.setLoanApplication(loanApplication);
                    loanApplicationPayees.setPayee(payee);
                    loanApplicationPayees.setDisbursementDate(null);
                    loanApplicationPayees.setPlannedDisbursementDate(x.getPlannedDisbursementDate());
                    loanApplicationPayees.setId(null);
                    loanApplicationPayees.setStatus(LoanApplicationPayeeStatus.PENDING);
                    return loanApplicationPayees;
                }).collect(Collectors.toList());
        loanApplication.setLoanApplicationPayees(payees);

        List<LoanApplicationEntryFee> entryFees = dto.getEntryFees() == null ? new ArrayList<>() : dto.getEntryFees()
                .stream()
                .map(x -> {
                    LoanApplicationEntryFee loanApplicationEntryFee = new ModelMapper()
                            .map(x, LoanApplicationEntryFee.class);
                    EntryFee entryFee = this.entryFeeService.findOne(x.getEntryFeeId()).get();
                    loanApplicationEntryFee.setLoanApplication(loanApplication);
                    loanApplicationEntryFee.setEntryFee(entryFee);
                    loanApplicationEntryFee.setId(null);
                    return loanApplicationEntryFee;
                })
                .collect(Collectors.toList());
        loanApplication.setLoanApplicationEntryFees(entryFees);

        return loanApplication;
    }

    private void fillLoanApplicationPenalties(LoanApplication loanApplication) {
        Set<Penalty> penalties;
        if (loanApplication.getCreditLine() != null) {
            penalties = loanApplication.getCreditLine().getPenalties();
        }
        else {
            penalties = loanApplication.getLoanProduct().getPenalties();
        }

        if (CollectionUtils.isEmpty(penalties)) {
            return;
        }

        List<LoanApplicationPenalty> loanApplicationPenalties = new ArrayList<>();
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.addMappings(new PropertyMap<Penalty, LoanApplicationPenalty>() {
            @Override
            protected void configure() {
                skip().setId(null);
            }
        });
        for (Penalty penalty : penalties) {
            LoanApplicationPenalty loanApplicationPenalty = modelMapper.map(penalty, LoanApplicationPenalty.class);
            loanApplicationPenalty.setLoanApplication(loanApplication);
            loanApplicationPenalties.add(loanApplicationPenalty);
        }

        loanApplication.setLoanApplicationPenalties(loanApplicationPenalties);
    }

    public LoanApplication zip(LoanApplication loanApplication, LoanApplicationBaseDto dto) {
        LoanApplication zippedLoanApplication = this.mapToEntity(dto);
        User loanOfficer = this.userService.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Officer not found (ID=%d).", loanApplication.getCreatedBy().getId())));
        zippedLoanApplication.setLoanOfficer(loanOfficer);
        zippedLoanApplication.setCreatedAt(loanApplication.getCreatedAt());
        zippedLoanApplication.setCreatedBy(loanApplication.getCreatedBy());
        zippedLoanApplication.setAttachments(loanApplication.getAttachments());
        zippedLoanApplication.setBranch(loanApplication.getBranch());
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();
        if (loanApplication.getProfile().getType().equals(groupTypeOfProfile)) {
            for (GroupMemberAmountsDto memberAmount : dto.getAmounts()) {
                GroupLoanApplication groupLoanApplication = this.groupLoanApplicationService.findAllByLoanApplication(loanApplication)
                        .stream()
                        .filter(x -> x.getId() == memberAmount.getMemberId())
                        .findFirst()
                        .get();
                groupLoanApplication.setAmount(memberAmount.getAmount());
                this.groupLoanApplicationService.save(groupLoanApplication);
            }
        }
        this.fillLoanApplicationPenalties(zippedLoanApplication);

        return zippedLoanApplication;
    }

    private List<LoanApplicationCustomFieldValue> getCustomFieldValuesFromDto(
            LoanApplicationCustomFieldValuesDto dto,
            LoanApplication loanApplication,
            User currentUser) {
        List<LoanApplicationCustomFieldValue> loanApplicationCustomFieldValues = new ArrayList<>();
        for (FieldValueDto dtoValue : dto.getFieldValues()) {
            Optional<LoanApplicationCustomField> customField = this.getCustomField(dtoValue);
            Assert.isTrue(customField.isPresent(), String.format("Custom field with id {id: %d} not found.", dtoValue.getFieldId()));
            LoanApplicationCustomFieldValue customFieldValue = new LoanApplicationCustomFieldValue();
            customFieldValue.setOwner(loanApplication);
            customFieldValue.setCustomField(customField.get());
            customFieldValue.setValue(dtoValue.getValue());
            customFieldValue.setStatus(EntityStatus.LIVE);
            customFieldValue.setCreatedAt(DateHelper.getLocalDateTimeNow());
            customFieldValue.setCreatedBy(currentUser);
            loanApplicationCustomFieldValues.add(customFieldValue);
        }
        return loanApplicationCustomFieldValues;
    }

    private Optional<LoanApplicationCustomField> getCustomField(FieldValueDto fieldValueDto) {
        if (fieldValueDto.getFieldId()==0) {
            return loanApplicationCustomFieldService.findByName(fieldValueDto.getCode());
        }
        return loanApplicationCustomFieldService.findOne(fieldValueDto.getFieldId());
    }

    public LoanApplication setCustomFieldValuesToLoanApplication(LoanApplication loanApplication,
                                                                 LoanApplicationCustomFieldValuesDto dto, User currentUser) {
        List<LoanApplicationCustomFieldValue> customFieldValues =
                dto.getFieldValues() == null ? new ArrayList<>() : dto.getFieldValues()
                .stream()
                .map(fieldValueDto -> {
                    LoanApplicationCustomField loanApplicationCustomField =
                            this.loanApplicationCustomFieldService.findOne(fieldValueDto.getFieldId()).get();
                    LoanApplicationCustomFieldValue loanApplicationCustomFieldValue = new LoanApplicationCustomFieldValue();
                    loanApplicationCustomFieldValue.setOwner(loanApplication);
                    loanApplicationCustomFieldValue.setCustomField(loanApplicationCustomField);
                    loanApplicationCustomFieldValue.setValue(fieldValueDto.getValue());
                    loanApplicationCustomFieldValue.setStatus(EntityStatus.LIVE);
                    loanApplicationCustomFieldValue.setCreatedAt(DateHelper.getLocalDateTimeNow());
                    loanApplicationCustomFieldValue.setCreatedBy(currentUser);

                    return loanApplicationCustomFieldValue;
                })
                .collect(Collectors.toList());

        loanApplication.setCustomFieldValues(customFieldValues);
        return loanApplication;
    }

    //ToDo:Refactor it later
    public List<ProfileCustomFieldSectionDto> getLoanApplicationCustomFieldValues(LoanApplication loanApplication) {
        List<ProfileCustomFieldSectionDto> sections = null;
        if (loanApplication.getCustomFieldValues() != null) {
            sections = this.loanApplicationCustomFieldSectionService.findAll()
                    .stream()
                    .map(s -> {
                        ProfileCustomFieldSectionDto profileCustomFieldSectionDtoFunction = new ModelMapper().map(s, ProfileCustomFieldSectionDto.class);
                        List<CustomFieldValueDto> customFieldValueDtoList = s.getCustomFields()
                                .stream()
                                .map(cf -> {
                                    CustomFieldDto customFieldDto = this.loanApplicationCustomFieldMapper.map(cf);
                                    CustomFieldValueDto valueDto = new CustomFieldValueDto();

                                    Optional<LoanApplicationCustomFieldValue> customFieldValue = loanApplication.getCustomFieldValues()
                                            .stream()
                                            .filter(x -> x.getStatus().equals(EntityStatus.LIVE))
                                            .filter(cfv -> cf.getId().equals(cfv.getCustomField().getId()))
                                            .findFirst();
                                    if (customFieldValue.isPresent()) {
                                        String value = customFieldValue.get().getValue();
                                        valueDto.setValue(value);
                                        if (cf.getFieldType().equals(CustomFieldType.LOOKUP) && !customFieldValue.get().getValue().isEmpty()) {
                                            valueDto.setValue(this.lookupWorker.getLookupValueObject(customFieldDto.getExtra().get("key").toString(), Long.valueOf(value)));
                                        }
                                        valueDto.setStatus(customFieldValue.get().getStatus());
                                    } else {
                                        valueDto.setValue("");
                                    }
                                    valueDto.setCustomField(customFieldDto);
                                    return valueDto;
                                })
                                .collect(Collectors.toList());
                        profileCustomFieldSectionDtoFunction.setValues(customFieldValueDtoList);
                        return profileCustomFieldSectionDtoFunction;
                    })
                    .collect(Collectors.toList());
        }
        return sections;
    }

    public void updateLoanApplicationCustomFieldValues(LoanApplication loanApplication,
                                                       LoanApplicationCustomFieldValuesDto dto,
                                                       User currentUser) {
        loanApplication.getCustomFieldValues().forEach(x -> x.setStatus(EntityStatus.ARCHIVED));
        List<LoanApplicationCustomFieldValue> newValues = this.getCustomFieldValuesFromDto(dto, loanApplication, currentUser);
        loanApplicationCustomFieldValueValidator.validate(newValues, loanApplication.getCustomFieldValues());
        loanApplication.setCustomFieldValues(newValues);
    }

}
