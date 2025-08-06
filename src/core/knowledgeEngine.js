"use strict";
/**
 * Este módulo proporciona un motor de conocimiento básico que asigna
 * patrones de código a recursos de aprendizaje.  Los recursos aquí
 * definidos son meramente ilustrativos; en una implementación real
 * podrían obtenerse de una base de datos, un servicio interno o un
 * modelo de lenguaje.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeEngine = void 0;
// Tabla de recursos.  Cada clave corresponde a un patrón detectado por
// el ContextAnalyzer y su valor es una lista de recursos relevantes.
const RESOURCE_MAP = {
    reactHooks: [
        {
            title: 'Guía oficial de useEffect',
            url: 'https://react.dev/reference/react/useEffect',
            description: 'Descripción y ejemplos del hook useEffect en React.'
        },
        {
            title: 'Hooks en React – Documentación',
            url: 'https://es.react.dev/learn/state-a-guide-to-the-useState-hook',
            description: 'Artículo introductorio sobre el hook useState y otros hooks comunes.'
        }
    ],
    asyncAwait: [
        {
            title: 'Promesas en JavaScript (MDN)',
            url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise',
            description: 'Referencia de la clase Promise, con ejemplos de uso.'
        },
        {
            title: 'Función async/await (MDN)',
            url: 'https://developer.mozilla.org/es/docs/Learn/JavaScript/Asynchronous/Async_await',
            description: 'Guía sobre la sintaxis async/await para gestionar código asíncrono.'
        }
    ],
    class: [
        {
            title: 'Clases en JavaScript (MDN)',
            url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes',
            description: 'Documentación oficial sobre clases y ejemplos de herencia.'
        }
    ],
    generator: [
        {
            title: 'Generadores y yield en JavaScript',
            url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/function*',
            description: 'Descripción de funciones generadoras y el uso de yield.'
        }
    ],
    express: [
        {
            title: 'Guía de Express.js',
            url: 'https://expressjs.com/es/starter/hello-world.html',
            description: 'Tutorial de Express para crear un servidor básico.'
        }
    ],
    decorator: [
        {
            title: 'Decoradores en TypeScript',
            url: 'https://www.typescriptlang.org/docs/handbook/decorators.html',
            description: 'Explicación de cómo funcionan los decoradores y ejemplos de uso.'
        }
    ]
};
/**
 * KnowledgeEngine mapea los patrones detectados a una lista de
 * recursos.  También filtra recursos en función del idioma o del
 * nivel del usuario, aunque en esta versión la filtración es
 * superficial.
 */
class KnowledgeEngine {
    /**
     * Obtiene recursos relevantes para una lista de patrones.
     * @param patterns Patrones detectados
     * @param languageId Identificador de lenguaje del documento (p.ej. 'javascript')
     * @param level Nivel de experiencia del usuario (junior, intermedio, avanzado)
     * @param stack Lista de tecnologías declaradas por el usuario (p.ej. ['react'])
     */
    getResourcesForPatterns(patterns, languageId, level, stack) {
        const resources = [];
        for (const pattern of patterns) {
            const items = RESOURCE_MAP[pattern];
            if (!items)
                continue;
            // Filtrar por stack: si el patrón es reactHooks pero el stack no incluye react, podría omitirse.
            if (pattern === 'reactHooks' && !stack.includes('react')) {
                continue;
            }
            resources.push(...items);
        }
        // Si el usuario es avanzado, se pueden reducir sugerencias básicas; aquí se devuelve todo.
        return resources;
    }
}
exports.KnowledgeEngine = KnowledgeEngine;
//# sourceMappingURL=knowledgeEngine.js.map