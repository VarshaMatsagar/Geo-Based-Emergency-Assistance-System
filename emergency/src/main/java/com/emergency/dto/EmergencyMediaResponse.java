package com.emergency.dto;

import lombok.Data;

@Data
public class EmergencyMediaResponse {
    private Long id;
    private String mediaType;
    private String mediaUrl;
    private byte[] mediaData;
}