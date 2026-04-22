package com.koraiken.crm.exception;

import com.koraiken.crm.dto.Error.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    //404
    @ExceptionHandler({
            AcompananteNotFoundException.class,
            AerolineaNotFoundException.class,
            CiudadNotFoundException.class,
            PaisNotFoundException.class,
            UserNotFoundException.class,
            UserMailNotFoundException.class,
            ViajeNotFoundException.class,
            ClienteNotFoundException.class
            //faltaria un exception  de destino not found
    })
    public ResponseEntity<ErrorResponseDTO> handleNotFound(RuntimeException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    // 409 conflict
    @ExceptionHandler({
            ClienteExisteException.class,
            CiudadYaExisteException.class,
            AerolineaYaExisteException.class
    })
    public ResponseEntity<ErrorResponseDTO> handleConflict(RuntimeException ex, HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    // 422 UNPROCESSABLE content
    @ExceptionHandler({
            ClienteConViajesActivosException.class,
            ViajeTransicionInvalidaException.class,
            DestinoFechaInvalidaException.class
    })
    public ResponseEntity<ErrorResponseDTO> handleUnprocessable(RuntimeException exception, HttpServletRequest request) {
        return build(HttpStatus.UNPROCESSABLE_CONTENT, exception.getMessage(), request);
    }

    //400 BAD request
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadRequest(
            IllegalArgumentException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    //si el enum del estado del viaje no matchea ningun valor
    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handleEnumInvalido(Exception ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "Valor invalido para el parametro: " + ex.getMessage(), request);
    }

    // ==== 401 unauthorized
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Credenciales Incorrectas", request);
    }


    //403 forbidden
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {
        return build(HttpStatus.FORBIDDEN,
                "No tenes permisos para realizar esta operacion", request);
    }

    //413 content too large
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponseDTO> handleFileTooLarge(
            MaxUploadSizeExceededException ex, HttpServletRequest request) {
        return build(HttpStatus.CONTENT_TOO_LARGE, "El archivo supera el tamano maximo permitido", request);
    }


    // 500 fallback - aca no tengo que llegar en produccion
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex, HttpServletRequest request) {
        //aca logueo el stack trace completo para debuggear pero no lo veo re necesario
        ex.printStackTrace();
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "OcurriO un error inesperado", request);
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
