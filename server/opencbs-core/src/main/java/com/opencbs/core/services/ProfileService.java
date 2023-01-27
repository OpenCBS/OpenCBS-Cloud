package com.opencbs.core.services;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.mappers.AccountMapper;
import com.opencbs.core.annotations.TimeLog;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.ProfileAccounts;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.SimplifiedProfileAccount;
import com.opencbs.core.repositories.ProfileAccountsRepository;
import com.opencbs.core.repositories.ProfileRepository;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService extends BaseHistoryService<ProfileRepository> implements CrudService<Profile>, HistoryService {

    private final ProfileRepository profileRepository;
    private final AccountMapper accountMapper;
    private final ProfileAccountsRepository profileAccountsRepository;


    @Autowired
    public ProfileService(ProfileRepository profileRepository,
                          AccountMapper accountMapper,
                          ProfileAccountsRepository profileAccountsRepository) {
        super(profileRepository);
        this.profileRepository = profileRepository;
        this.accountMapper = accountMapper;
        this.profileAccountsRepository = profileAccountsRepository;
    }

    @TimeLog
    public Page<Profile> search(String searchString, Pageable pageable, User user) {
        if (StringUtils.isEmpty(searchString)) {
            return this.profileRepository.findLiveAndPendingThatHasLiveFields(pageable);
        }

        return this.profileRepository.searchLiveAndPendingThatHasLiveFields(searchString, pageable);
    }

    public Optional<Profile> findOne(Long profileId) {
        return this.getOne(profileId);
    }

    public Optional<Profile> getOne(Long id) {
        final Profile one = this.profileRepository.findOne(id);
        if (one==null) {
            int b= 0;
        }
        return Optional.ofNullable(this.profileRepository.findOne(id));
    }

    public Page<SimplifiedProfileAccount> getAllWithCurrentAccount(String queryString, Pageable pageable, User currentUser) {
        Page<Profile> profileWithCurrentAccount = this.search(queryString, pageable, currentUser);

        List<SimplifiedProfileAccount> result = new ArrayList<>();
        profileWithCurrentAccount.getContent()
                .stream()
                .filter(x -> !x.getCurrentAccounts().isEmpty())
                .forEach(profile -> {
                    for (Account account : profile.getCurrentAccounts()){
                       result.add(this.accountMapper.mapToSimplifiedProfileAccount(profile, account));

                    }
                });

        return new PageImpl<>(result, pageable, result.size());
    }

    public Long getCountProfiles(){
        return profileRepository.count();
    }

    public Account getCurrentAccountByCurrency(@NonNull Profile profile, @NonNull Currency currency){
        return profile.getCurrentAccounts()
                .stream()
                .filter(x -> currency.equals(x.getCurrency()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException(String.format("Current account for currency (ID=%d) is not found.", currency.getId())));
    }

    public List<Profile> getProfilesByIds(Collection<Long> ids) {
        return this.profileRepository.findByIdIn(ids);
    }

    public Optional<ProfileAccounts> getAccountByProfile(Long profileId) {
        return this.profileAccountsRepository.findByProfileId(profileId);
    }

    @Override
    public List<Profile> findAll() {
        return this.profileRepository.findAll();
    }

    @Override
    public Boolean isRequestSupported(RequestType requestType) {
        return RequestType.PEOPLE_CREATE.equals(requestType) ||
            RequestType.PEOPLE_EDIT.equals(requestType) ||
            RequestType.COMPANY_CREATE.equals(requestType) ||
            RequestType.COMPANY_EDIT.equals(requestType) ||
            RequestType.GROUP_CREATE.equals(requestType) ||
            RequestType.GROUP_EDIT.equals(requestType);
    }

    @Override
    public Profile create(Profile entity) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Profile update(Profile entity) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Class getTargetClass() {
        return Profile.class;
    }
}
