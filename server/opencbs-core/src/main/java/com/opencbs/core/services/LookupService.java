package com.opencbs.core.services;

import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.TillService;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.LookupType;
import com.opencbs.core.dto.customfields.CustomFieldLookupValueDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class LookupService implements LookupInterface {

    public static Map<String, FindOneInterface> lookupTypeGetMethodMap = new HashMap<>();

    private final ProfessionService professionService;
    private final LocationService locationService;
    private final BusinessSectorService businessSectorService;
    private final PaymentMethodService paymentMethodService;
    private final PersonService personService;
    private final CompanyService companyService;
    private final GroupService groupService;
    private final UserService userService;
    private final CurrencyService currencyService;
    private final BranchService branchService;
    private final TillService tillService;
    private final AccountService accountService;

    @Autowired
    public LookupService(ProfessionService professionService,
                         LocationService locationService,
                         BusinessSectorService businessSectorService,
                         PaymentMethodService paymentMethodService,
                         PersonService personService,
                         CompanyService companyService,
                         GroupService groupService, UserService userService,
                         CurrencyService currencyService,
                         BranchService branchService,
                         TillService tillService,
                         AccountService accountService) {
        this.professionService = professionService;
        this.locationService = locationService;
        this.businessSectorService = businessSectorService;
        this.paymentMethodService = paymentMethodService;
        this.personService = personService;
        this.companyService = companyService;
        this.groupService = groupService;
        this.userService = userService;
        this.currencyService = currencyService;
        this.branchService = branchService;
        this.tillService = tillService;
        this.accountService = accountService;
        fillMethodMap();
    }

    public void fillMethodMap() {
        lookupTypeGetMethodMap.put(getLookupTypes().get(0), this.locationService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(1), this.professionService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(2), this.businessSectorService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(3), this.paymentMethodService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(4), this.personService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(5), this.companyService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(6), this.groupService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(7), this.userService::findById);
        lookupTypeGetMethodMap.put(getLookupTypes().get(8), this.currencyService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(9), this.branchService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(10), this.tillService::findOne);
        lookupTypeGetMethodMap.put(getLookupTypes().get(11), this.accountService::findOne);
    }

    @Override
    public <T extends BaseEntity> Optional<T> getLookup(String type, Long id) {
        return lookupTypeGetMethodMap.get(LookupType.getByName(type).getName()).get(id);
    }

    @Override
    public CustomFieldLookupValueDto getLookupValueObject(String lookupType, Long id) {
        String name = "";
        CustomFieldLookupValueDto customFieldLookupValueDto = new CustomFieldLookupValueDto();
        customFieldLookupValueDto.setId(id);
        Optional<? extends BaseEntity> lookup = this.getLookup(lookupType, id);

        try {
            Method method = lookup.get().getClass().getMethod("getName");
            name = (String)method.invoke(lookup.get());
        } catch (Exception e) {}

        customFieldLookupValueDto.setName(name);
        return customFieldLookupValueDto;
    }

    @Override
    public ArrayList<String> getLookupTypes() {
        ArrayList<String> typeArray = new ArrayList<>();
        typeArray.add("locations");
        typeArray.add("professions");
        typeArray.add("business-sectors");
        typeArray.add("payment-methods");
        typeArray.add("profiles/people");
        typeArray.add("profiles/companies");
        typeArray.add("profiles/groups");
        typeArray.add("users");
        typeArray.add("currencies");
        typeArray.add("branches");
        typeArray.add("tills");
        typeArray.add("accounting");
        return typeArray;
    }

    @FunctionalInterface
    public interface FindOneInterface<T extends BaseEntity> {
        Optional<T> get(Long id);
    }
}
