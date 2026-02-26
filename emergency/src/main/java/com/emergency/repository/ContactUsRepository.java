package com.emergency.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.emergency.entity.ContactUs;

public interface ContactUsRepository extends JpaRepository<ContactUs, Long> {
}
