package com.emergency.dto;

import lombok.Data;
import java.util.List;

@Data
public class GoogleDistanceMatrixResponse {
    private List<Row> rows;
    private String status;
    
    @Data
    public static class Row {
        private List<Element> elements;
    }
    
    @Data
    public static class Element {
        private Distance distance;
        private Duration duration;
        private String status;
    }
    
    @Data
    public static class Distance {
        private String text;
        private Integer value; // in meters
    }
    
    @Data
    public static class Duration {
        private String text;
        private Integer value; // in seconds
    }
}