package com.opencbs.core.controllers.profiles;

import com.opencbs.core.domain.attachments.PersonAttachment;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.dto.AttachmentDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.AttachmentMapper;
import com.opencbs.core.services.PersonAttachmentService;
import com.opencbs.core.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/profiles/people/{personId}/attachments")
public class PersonAttachmentController {

    private final PersonService personService;

    private final PersonAttachmentService personAttachmentService;

    private final AttachmentMapper attachmentMapper;

    @Autowired
    public PersonAttachmentController(PersonService personService,
                                      PersonAttachmentService personAttachmentService,
                                      AttachmentMapper attachmentMapper) {
        this.personService = personService;
        this.personAttachmentService = personAttachmentService;
        this.attachmentMapper = attachmentMapper;
    }

    @RequestMapping(method = RequestMethod.POST)
    public AttachmentDto post(@PathVariable long personId,
                              @RequestParam("file") MultipartFile file,
                              @RequestParam(value = "comment", required = false) String comment) throws Exception {
        Person person = this.personService
                .findOne(personId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Person not found (ID=%d).", personId)));
        PersonAttachment attachment = personAttachmentService.create(file, person, UserHelper.getCurrentUser(), comment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<AttachmentDto> get(@PathVariable long personId) throws ApiException {
        Person person = this.personService
                .findOne(personId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Person not found (ID=%d).", personId)));

        return personAttachmentService.findByOwnerId(person.getId())
                .stream()
                .map(this.attachmentMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{attachmentId}", method = RequestMethod.DELETE)
    public AttachmentDto delete(@PathVariable long attachmentId) throws Exception {
        PersonAttachment attachment = this.personAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        this.personAttachmentService.delete(attachment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @RequestMapping(value = "/{attachmentId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity get(@PathVariable long attachmentId, @RequestParam(value = "size", required = false) Integer size) throws Exception {
        PersonAttachment attachment = this.personAttachmentService.findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        return this.personAttachmentService.getResponseEntity(attachment, size);
    }

    @RequestMapping(value = "/{attachmentId}/pin", method = RequestMethod.POST)
    public AttachmentDto pin(@PathVariable long attachmentId) throws Exception {
        PersonAttachment attachment = this.personAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        attachment = this.personAttachmentService.pin(attachment);
        return this.attachmentMapper.mapToDto(attachment);
    }

    @RequestMapping(value = "/{attachmentId}/unpin", method = RequestMethod.POST)
    public AttachmentDto unpin(@PathVariable long attachmentId) throws Exception {
        PersonAttachment attachment = this.personAttachmentService
                .findOne(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Attachment not found (ID=%d).", attachmentId)));

        attachment = this.personAttachmentService.unpin(attachment);
        return this.attachmentMapper.mapToDto(attachment);
    }
}
