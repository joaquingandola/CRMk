package com.koraiken.crm.dto.Error;


import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ErrorResponseDTO {

    private int status;
    private String error;
    private String mensaje;
    private String path;
    private LocalDateTime timestamp;

}
