package com.opencbs.core.services;

import com.opencbs.core.domain.profiles.CompanyMember;
import com.opencbs.core.repositories.CompanyMemberRepository;
import org.springframework.stereotype.Service;

@Service
public class CompanyMemberService {

 private final CompanyMemberRepository companyMemberRepository;

    public CompanyMemberService(CompanyMemberRepository companyMemberRepository) {
        this.companyMemberRepository = companyMemberRepository;
    }

    public void save(CompanyMember companyMember) {
        this.companyMemberRepository.save(companyMember);
    }

}
