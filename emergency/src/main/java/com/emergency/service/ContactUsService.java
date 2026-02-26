package com.emergency.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.emergency.entity.ContactUs;
import com.emergency.repository.ContactUsRepository;

@Service
public class ContactUsService {

    @Autowired
    private ContactUsRepository contactUsRepository;

    public ContactUs saveContact(ContactUs contactUs) {
        return contactUsRepository.save(contactUs);
    }
    
    public List<ContactUs> getAllContacts() {
        return contactUsRepository.findAll();
    }
}
