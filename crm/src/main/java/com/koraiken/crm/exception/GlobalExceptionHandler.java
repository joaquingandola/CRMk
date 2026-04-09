package com.koraiken.crm.exception;

import com.koraiken.crm.dto.Error.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({
            AcompananteNotFoundException.class,
            AerolineaNotFoundException.class,
            CiudadNotFoundException.class,
            PaisNotFoundException.class,
            UserNotFoundException.class,
            ViajeNotFoundException.class,
            ClienteNotFoundException.class
    })
    public ResponseEntity<ErrorResponseDTO> handleNotFound(RuntimeException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }





    //m,etodo interno
    private ResponseEntity<ErrorResponseDTO> build(HttpStatus status, String mensaje, HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .mensaje(mensaje)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(error);
    }
}
