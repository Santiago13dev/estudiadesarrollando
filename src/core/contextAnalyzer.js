"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAnalyzer = void 0;
/**
 * Analizador simple de contexto.  Explora el texto del documento y
 * descubre patrones superficiales como el uso de hooks de React, de
 * promesas, funciones asíncronas o la presencia de clases.  Este
 * analizador puede ampliarse con un parser real (por ejemplo, usando
 * TypeScript o acorn) pero para fines educativos se usan expresiones
 * regulares básicas.
 */
class ContextAnalyzer {
    /**
     * Analiza un documento abierto en VS Code y devuelve su contexto.
     * @param document Documento que se va a analizar
     */
    analyze(document) {
        const text = document.getText();
        const languageId = document.languageId;
        const patterns = [];
        // Detectar hooks de React (useState, useEffect, etc.)
        if (/\buse(State|Effect|Memo|Callback)\s*\(/.test(text)) {
            patterns.push('reactHooks');
        }
        // Detectar uso de promesas y async/await
        if (/\bPromise\b/.test(text) || /\basync\b/.test(text)) {
            patterns.push('asyncAwait');
        }
        // Detectar declaraciones de clase en JavaScript/TypeScript
        if (/\bclass\s+\w+/.test(text)) {
            patterns.push('class');
        }
        // Detectar uso de generadores
        if (/function\s*\*|yield/.test(text)) {
            patterns.push('generator');
        }
        // Detectar importación de módulos HTTP (por ejemplo, Express)
        if (/express\s*\(/.test(text)) {
            patterns.push('express');
        }
        // Detectar uso de decoradores en TypeScript
        if (/@\w+/.test(text)) {
            patterns.push('decorator');
        }
        return { languageId, patterns };
    }
}
exports.ContextAnalyzer = ContextAnalyzer;
//# sourceMappingURL=contextAnalyzer.js.map