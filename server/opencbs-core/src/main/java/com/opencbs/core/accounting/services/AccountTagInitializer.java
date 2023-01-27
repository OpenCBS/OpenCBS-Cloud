package com.opencbs.core.accounting.services;

import com.opencbs.core.accounting.domain.AccountTag;
import com.opencbs.core.accounting.domain.AccountTagType;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.StringJoiner;
import java.util.stream.Stream;

@Component
public class AccountTagInitializer {

    private final AccountTagService accountTagService;

    public AccountTagInitializer(AccountTagService accountTagService) {
        this.accountTagService = accountTagService;
    }

    @PostConstruct
    public void init() {
        List<AccountTag> dbAccountTags = this.accountTagService.getAll();

        List<AccountTagType> newTagForSaveInDb = this.getNewTagForSaveInDb(dbAccountTags);
        this.saveNewTagInDb(newTagForSaveInDb);

        this.checkRemovedTags(dbAccountTags);
    }

    private List<AccountTagType> getNewTagForSaveInDb(List<AccountTag> dbAccountTags) {
        List<AccountTagType> result = new ArrayList<>();
        for (AccountTagType tag : AccountTagType.values()) {
            Optional<AccountTag> enumInDb = dbAccountTags
                    .stream()
                    .filter(x -> x.getId().equals(tag.getId()))
                    .findFirst();
            if(!enumInDb.isPresent()) {
                result.add(tag);
            }
        }

        return result;
    }

    private void saveNewTagInDb(List<AccountTagType> newTagForSaveInDb) {
        for (AccountTagType tag: newTagForSaveInDb) {
            AccountTag accountTag = new AccountTag();
            accountTag.setName(tag);
            accountTag.setId(tag.getId());
            this.accountTagService.saveAccountTag(accountTag);
        }
    }

    private void checkRemovedTags(List<AccountTag> dbAccountTags) {
        List<AccountTag> removedElements = new ArrayList<>();
        for (AccountTag tag : dbAccountTags) {
            Optional<AccountTagType> enumElement = Stream.of(AccountTagType.values())
                    .filter(x -> x.getId().equals(tag.getId()))
                    .findFirst();
            if(!enumElement.isPresent()) {
                removedElements.add(tag);
            }
        }

        if(!removedElements.isEmpty()) {
            StringJoiner joiner = new StringJoiner(", ", "", "");
            for (AccountTag tag : removedElements) {
                joiner.add(tag.getName().toString());
            }
            String elementNames = joiner.toString();

            throw new RuntimeException(String.format("DB contain %s elements, but the %s enum absent it. Element name(s): %s",
                    AccountTagType.class.getName(), AccountTagType.class.getName(), elementNames));
        }
    }
}
