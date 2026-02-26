package com.emergency.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "emergency_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyMediaEntity extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emergency_id")
    private Emergency emergency;
    
    @NotBlank
    @Column(name = "media_type")
    private String mediaType;
    
    @Lob
    @Column(name = "media_data", columnDefinition = "LONGBLOB")
    private byte[] mediaData;
}
