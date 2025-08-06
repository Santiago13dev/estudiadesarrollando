"use strict";
/**
 * Servicio de recuperación de documentación.  En un proyecto real este
 * servicio podría consultar una API REST o leer de una base de
 * conocimientos para obtener documentación detallada.  En esta
 * versión se ofrecen métodos stub que retornan textos de ejemplo.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsFetcher = void 0;
class DocsFetcher {
    /**
     * Recupera la documentación de una API o palabra clave.  Este
     * método simula una búsqueda y devuelve un fragmento de texto.
     *
     * @param keyword Palabra clave o nombre de API
     */
    async fetch(keyword) {
        // Simulación de consulta.  Devuelve un texto simple; en un
        // proyecto real se podría integrar con DevDocs o MDN.
        return `Información sobre **${keyword}** aún no está disponible en línea. Consulta la documentación oficial.`;
    }
}
exports.DocsFetcher = DocsFetcher;
//# sourceMappingURL=docsFetcher.js.map