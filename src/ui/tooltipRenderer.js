"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipRenderer = void 0;
const vscode = __importStar(require("vscode"));
/**
 * TooltipRenderer implementa un proveedor de hovers que muestra
 * sugerencias de aprendizaje contextualizadas.  Utiliza el
 * ContextAnalyzer para detectar patrones en el documento y luego
 * consulta a la KnowledgeEngine para obtener recursos.  Los temas
 * consultados se registran en el UserProgressTracker.
 */
class TooltipRenderer {
    constructor(analyzer, knowledge, progress) {
        this.analyzer = analyzer;
        this.knowledge = knowledge;
        this.progress = progress;
    }
    async provideHover(document, position, token) {
        const analysis = this.analyzer.analyze(document);
        if (analysis.patterns.length === 0) {
            return undefined;
        }
        // Leer configuración del usuario
        const config = vscode.workspace.getConfiguration('codementor');
        const level = config.get('level', 'intermedio');
        const stack = config.get('stack', []);
        const resources = this.knowledge.getResourcesForPatterns(analysis.patterns, analysis.languageId, level, stack);
        if (resources.length === 0) {
            return undefined;
        }
        // Registrar que el usuario ha consultado estos patrones
        analysis.patterns.forEach((p) => this.progress.recordTopicLearned(p));
        // Construir contenido Markdown
        const markdown = new vscode.MarkdownString();
        markdown.isTrusted = true;
        markdown.appendText('🔍 Recursos sugeridos por CodeMentor:\n\n');
        resources.forEach((res) => {
            markdown.appendMarkdown(`- [${res.title}](${res.url})${res.description ? ' – ' + res.description : ''}\n`);
        });
        return new vscode.Hover(markdown);
    }
}
exports.TooltipRenderer = TooltipRenderer;
//# sourceMappingURL=tooltipRenderer.js.map