package com.opencbs.loans.services.sepaintegration;

import com.opencbs.loans.domain.SepaDocument;
import com.opencbs.loans.domain.enums.SepaDocumentType;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentCreateForm;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentDto;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentUpdateForm;
import com.opencbs.loans.repositories.SepaDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SepaDocumentServiceImpl implements SepaDocumentService{

    private final SepaDocumentRepository sepaDocumentRepository;

    private static final DateTimeFormatter localDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public SepaDocument create(SepaDocumentCreateForm form) {
        SepaDocument sepaDocument = new SepaDocument();
        sepaDocument.setCreatedAt(form.getCreatedAt());
        sepaDocument.setCreatedBy(form.getCreatedBy());
        sepaDocument.setDocumentType(form.getDocumentType());
        sepaDocument.setUid(form.getUid());
        sepaDocument.setGeneratedForDate(form.getGeneratedForDate());
        sepaDocument.setNumberOfTaxes(form.getNumberOfTaxes());
        sepaDocument.setControlSum(form.getControlSum());
        sepaDocument.setDocumentStatus(form.getDocumentStatus());
        return sepaDocumentRepository.save(sepaDocument);
    }

    @Override
    public SepaDocument update(SepaDocument entity, SepaDocumentUpdateForm form) {
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setDocumentStatus(form.getDocumentStatus());
        return sepaDocumentRepository.save(entity);
    }

    @Override
    public Page<SepaDocumentDto> findAll(Pageable pageable) {
        List<SepaDocument> documentList = sepaDocumentRepository.findAll();
        return getResultListAsPage(pageable, documentList);
    }

    @Override
    public Page<SepaDocumentDto> findAllByType(Pageable pageable, SepaDocumentType documentType) {
        List<SepaDocument> documentList = sepaDocumentRepository.findAllByDocumentType(documentType);
        return getResultListAsPage(pageable, documentList);
    }

    @Override
    public SepaDocument getDocumentByCode(String code) {
        return sepaDocumentRepository.findByUid(code);
    }

    private Page<SepaDocumentDto> getResultListAsPage(Pageable pageable, List<SepaDocument> documentList){
        List<SepaDocumentDto> result = new ArrayList<>();
        for (SepaDocument item : documentList){
            result.add(SepaDocumentDto
                    .builder()
                    .uid(item.getUid())
                    .date(item.getGeneratedForDate().format(localDateFormatter))
                    .createdUser(item.getCreatedBy().getFullName())
                    .comment("")
                    .status(item.getDocumentStatus())
                    .build());
        }

        int start = pageable.getOffset();
        int end = (start + pageable.getPageSize()) > result.size() ? result.size() : (start + pageable.getPageSize());
        return new PageImpl<>(result.subList(start, end), pageable, result.size());
    }
}
