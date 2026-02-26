package com.emergency.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emergency.entity.ContactUs;
import com.emergency.service.ContactUsService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin("*")
public class ContactUsController {

    @Autowired
    private ContactUsService contactUsService;

    @PostMapping("/submit")
    public ResponseEntity<ContactUs> submitContact(@RequestBody ContactUs contactUs) {
        ContactUs savedContact = contactUsService.saveContact(contactUs);
        return ResponseEntity.ok(savedContact);
    }
    
    @GetMapping("/admin/all")
    public ResponseEntity<List<ContactUs>> getAllContacts() {
        List<ContactUs> contacts = contactUsService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }
}
