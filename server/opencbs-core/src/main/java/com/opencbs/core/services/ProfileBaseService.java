package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.ChangesInfo;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.repositories.ProfileBaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public abstract class ProfileBaseService<T extends Profile, TV extends CustomFieldValue> {

    private final ProfileBaseRepository<T> profileRepository;
    private final GlobalSettingsService globalSettingsService;
    private final AccountService accountService;
    private final CurrencyService currencyService;
    private final CurrentAccountGenerator currentAccountGenerator;

    ProfileBaseService(ProfileBaseRepository<T> profileRepository,
                       GlobalSettingsService globalSettingsService,
                       AccountService accountService,
                       CurrencyService currencyService,
                       CurrentAccountGenerator currentAccountGenerator) {
        this.profileRepository = profileRepository;
        this.globalSettingsService = globalSettingsService;
        this.accountService = accountService;
        this.currencyService = currencyService;
        this.currentAccountGenerator = currentAccountGenerator;
    }

    public Optional<T> findOne(long id, User currentUser) {
        T profile = this.profileRepository.findOne(id);
        if (profile == null) {
            return Optional.empty();
        }
        List<TV> values = this.getValuesByStatus(profile, EntityStatus.LIVE);
        if (profile.getStatus().equals(EntityStatus.PENDING)) {
            List<TV> pendingValues = this.getValuesByStatus(profile, EntityStatus.PENDING);
            List<TV> allValues = this.getProfileCustomFieldValues(profile);
            values = new ArrayList<>();
            for (TV value : allValues) {
                if (value == null) {
                    continue;
                }
                if (value.getStatus().equals(EntityStatus.LIVE)) {
                    Optional<TV> pendingValue = this.getValueByCustomFieldId(pendingValues, value.getCustomField().getId());
                    if (pendingValue.isPresent()) {
                        values.add(pendingValue.get());
                        continue;
                    }
                    values.add(value);
                    continue;
                }
                if (value.getStatus().equals(EntityStatus.PENDING)) {
                    values.add(value);
                }
            }
        }
        this.setProfileCustomFieldValues(profile, values);
        return Optional.ofNullable(profile);
    }

    public Optional<T> findOne(long id) {
        return Optional.ofNullable(this.profileRepository.findOne(id));
    }

    public List<ChangesInfo> getChangesById(long id) {
        T profile = this.findOne(id).get();
        List<TV> pendingValues = this.getValuesByStatus(profile, EntityStatus.PENDING);

        if (listIsEmpty(pendingValues)) {
            return new ArrayList<>();
        }
        List<TV> liveValues = this.getValuesByStatus(profile, EntityStatus.LIVE);
        return pendingValues
                .stream()
                .map(x -> {
                    Optional<TV> liveValue = this.getValueByCustomFieldId(liveValues, x.getCustomField().getId());
                    ChangesInfo changesInfo = new ChangesInfo();
                    if (liveValue.isPresent()) {
                        changesInfo.setLiveCustomFieldValue(liveValue.get());
                    }
                    changesInfo.setPendingCustomFieldValue(x);
                    changesInfo.setCustomField(x.getCustomField());
                    return changesInfo;
                }).collect(Collectors.toList());
    }

    @Transactional
    public T create(T profile, User currentUser, boolean createCurrentAccount) throws ResourceNotFoundException {
        profile.setCreatedBy(currentUser);
        profile.setCreatedAt(DateHelper.getLocalDateTimeNow());
        profile.setBranch(currentUser.getBranch());
        T createdProfile = this.createWithoutChecker(profile, currentUser);
        if (createCurrentAccount) {
        Optional<Currency> currency = this.globalSettingsService.getDefaultCurrency();
            createdProfile = this.createCurrentAccount(createdProfile, currency.get().getId(), currentUser);
        }
        return createdProfile;
    }

    private T createWithoutChecker(T profile, User currentUser) throws ResourceNotFoundException {
        this.getProfileCustomFieldValues(profile)
                .forEach(x -> {
                    x.setCreatedBy(currentUser);
                    x.setCreatedAt(profile.getCreatedAt());
                    x.setVerifiedBy(currentUser);
                    x.setVerifiedAt(profile.getCreatedAt());
                    x.setStatus(EntityStatus.LIVE);
                });
        profile.setStatus(EntityStatus.LIVE);
        profile.setVersion(1);
        profile.setName(profile.getNameFromCustomFields());
        T result = this.profileRepository.save(profile);
        return result;
    }

    @Transactional
    public T createCurrentAccount(T profile, long currencyId, User currentUser) throws ResourceNotFoundException {
        if (currentUser.getBranch() == null) {
            throw new ResourceNotFoundException("Add branch to User.");
        }
        if (profile.getCurrentAccounts() != null) {
            Assert.isTrue(!profile.getCurrentAccounts()
                    .stream()
                    .anyMatch(x -> x.getCurrency().getId().equals(currencyId)), String.format("Account for this currency already exist(CURRENCY_ID=%d).", currencyId));
        }

        Currency currency = this.currencyService.findOne(currencyId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Currency not found (ID=%d).", currencyId)));
        Account newAccount = this.currentAccountGenerator.getCurrentAccount(profile, currency);
        profile.getCurrentAccounts().add(newAccount);
        return this.profileRepository.save(profile);
    }

    @Transactional
    public T update(T profile, User currentUser) {
        return this.updateWithoutChecker(profile, currentUser);
    }

    private T updateWithoutChecker(T profile, User currentUser) {
        T unchangedProfile = this.profileRepository.findOne(profile.getId());
        List<TV> oldValues = this.getValuesByStatus(unchangedProfile, EntityStatus.LIVE);
        List<TV> values = this.getProfileCustomFieldValues(profile);
        Set<Long> diffIds = this.getChangedFieldsIds(oldValues, values);
        List<TV> newValues = values
                .stream()
                .filter(x -> diffIds.contains(x.getCustomField().getId()))
                .map((TV i) -> {
                    i.setStatus(EntityStatus.LIVE);
                    i.setCreatedAt(DateHelper.getLocalDateTimeNow());
                    i.setCreatedBy(currentUser);
                    i.setVerifiedAt(DateHelper.getLocalDateTimeNow());
                    i.setVerifiedBy(currentUser);
                    return i;
                })
                .collect(Collectors.toList());

        int version = (profile.getVersion() != null ? profile.getVersion() : 0) + 1;

        oldValues
                .stream()
                .filter(x -> diffIds.contains(x.getCustomField().getId())
                        && x.getStatus().equals(EntityStatus.LIVE))
                .collect(Collectors.toList())
                .forEach(x -> x.setStatus(EntityStatus.ARCHIVED));

        if (this.listIsEmpty(newValues)) {
            return profile;
        }

        profile.setVersion(version);
        profile.setStatus(EntityStatus.LIVE);

        //set custom field values to save
        oldValues.addAll(newValues);
        this.setProfileCustomFieldValues(profile, oldValues);
        profile.setName(profile.getNameFromCustomFields());
        profile = this.profileRepository.save(profile);
        return this.findOne(profile.getId(), currentUser).get();
    }

    @Transactional
    public Page<T> search(String searchString, Pageable pageable) {
        if (StringUtils.isEmpty(searchString)) {
            return this.profileRepository.findLiveAndPendingThatHasLiveFields(pageable);
        }
        return this.profileRepository.searchLiveAndPendingThatHasLiveFields(searchString, pageable);
    }

    public boolean exists(Long profileId) {
        return this.profileRepository.exists(profileId);
    }

    abstract List<TV> getProfileCustomFieldValues(T profile);

    abstract void setProfileCustomFieldValues(T profile, List<TV> values);

    private Set<Long> getChangedFieldsIds(List<TV> oldValues, List<TV> newValues) {
        return newValues
                .stream()
                .map((TV x) ->
                        {
                            Optional<TV> oldValue = this.getValueByCustomFieldId(oldValues, x.getCustomField().getId());
                            if (oldValue.isPresent()) {
                                if (!x.getValue().equals(oldValue.get().getValue()))
                                    return x.getCustomField().getId();
                                return null;
                            }
                            return x.getCustomField().getId();
                        }
                ).collect(Collectors.toSet());
    }

    private Optional<TV> getValueByCustomFieldId(List<TV> values, long id) {
        return values
                .stream()
                .filter(i -> i.getCustomField().getId().equals(id))
                .findFirst();
    }

    private List<TV> getValuesByStatus(T profile, EntityStatus status) {
        return this.getProfileCustomFieldValues(profile)
                .stream()
                .filter(x -> x != null && x.getStatus().equals(status))
                .collect(Collectors.toList());
    }

    private boolean listIsEmpty(List<TV> values) {
        values = values.stream().filter(i -> i != null).collect(Collectors.toList());
        return values.isEmpty();
    }

    public BigDecimal getBalance(Long accountId) {
        return this.accountService.getAccountBalance(accountId, DateHelper.getLocalDateTimeNow());
    }

    public Optional<String> getCustomValueByCode(Profile profile, String customFieldCode ) {
        final T object = this.profileRepository.findOne(profile.getId());
        final Optional<TV> customValue = this.getValuesByStatus(object, EntityStatus.LIVE).stream()
                .filter(tv -> tv.getCustomField().getName().compareTo(customFieldCode) == 0)
                .findFirst();

        if (customValue.isPresent()) {
            return Optional.of(customValue.get().getValue());
        }

        return Optional.empty();
    }
}
