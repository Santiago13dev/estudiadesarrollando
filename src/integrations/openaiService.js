"use strict";
/**
 * Módulo de integración opcional con modelos de lenguaje.  Este
 * servicio permite enviar preguntas o fragmentos de código a una API
 * externa y obtener una respuesta generada.  En esta versión
 * únicamente devuelve un mensaje de ejemplo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
class OpenAIService {
    /**
     * Envía una pregunta y un contexto a un modelo de lenguaje.  Para
     * utilizar un modelo real, deberá proporcionarse una clave de API y
     * endpoint en las variables de entorno o en la configuración de la
     * extensión.
     *
     * @param prompt Pregunta o instrucción del usuario
     * @param context Fragmento de código o información de soporte
     */
    async ask(prompt, context = '') {
        // Aquí podría implementarse una llamada HTTP a OpenAI u otro
        // proveedor.  Devolveremos un texto genérico para ilustrar.
        return `Respuesta generada para: "${prompt}".\nContexto: ${context.slice(0, 100)}...`;
    }
}
exports.OpenAIService = OpenAIService;
//# sourceMappingURL=openaiService.js.map