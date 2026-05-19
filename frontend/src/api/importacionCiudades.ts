import api from "./axios"

export interface ImportacionResultadoDTO {
    importadas: number
    errores: number
    mensaje: string
}

export const importarCiudades = (archivo: File) => {
    const formData = new FormData()
    formData.append('archivo', archivo)

    return api.post<ImportacionResultadoDTO>(
        '/api/v1/admin/ciudades/importar',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
}
