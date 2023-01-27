package com.opencbs.core.workers;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.dto.customfields.CustomFieldLookupValueDto;
import com.opencbs.core.services.LookupInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LookupWorker {

    private List<LookupInterface> lookupServiceList;

    @Autowired
    LookupWorker(List<LookupInterface> lookupServiceList) {
        this.lookupServiceList = lookupServiceList;
    }

    public <T extends BaseEntity> Optional<T> getLookup(String lookupType, Long id) {
        for(int i = 0; i <= this.lookupServiceList.size(); i++) {
            if (this.lookupServiceList.get(i).getLookupTypes().contains(lookupType)) {
                return this.lookupServiceList.get(i).getLookup(lookupType, id);
            }
        }

        return Optional.empty();
    }

    public CustomFieldLookupValueDto getLookupValueObject(String lookupType, Long id) {
        for (int i = 0; i  <= this.lookupServiceList.size(); i++) {
            if (this.lookupServiceList.get(i).getLookupTypes().contains(lookupType)) {
                return this.lookupServiceList.get(i).getLookupValueObject(lookupType, id);
            }
        }

        throw new NullPointerException();
    }
}

