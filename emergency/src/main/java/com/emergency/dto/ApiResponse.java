package com.emergency.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ApiResponse<T> {
    private LocalDateTime timeStamp;
    private String message;
    private String status;
    private boolean success;
    private T data;
    
    public ApiResponse(String message, String status) {
        this.message = message;
        this.status = status;
        this.timeStamp = LocalDateTime.now();
    }
    
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.status = success ? "SUCCESS" : "ERROR";
        this.timeStamp = LocalDateTime.now();
    }
    
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.status = success ? "SUCCESS" : "ERROR";
        this.timeStamp = LocalDateTime.now();
    }
}
