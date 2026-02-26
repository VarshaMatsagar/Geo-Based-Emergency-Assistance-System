package com.emergency.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.emergency.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Validation failed", errors));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        // AuthService currently throws RuntimeException for auth/register errors.
        // Map them to meaningful HTTP statuses instead of 500.
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String msg = ex.getMessage() == null ? "Request failed" : ex.getMessage();

        if (msg.toLowerCase().contains("invalid")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (msg.toLowerCase().contains("already exists")) {
            status = HttpStatus.CONFLICT;
        }

        Map<String, Object> body = new HashMap<>();
        body.put("error", msg);
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Internal server error");
        body.put("status", 500);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}

