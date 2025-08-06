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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const contextAnalyzer_1 = require("./core/contextAnalyzer");
const knowledgeEngine_1 = require("./core/knowledgeEngine");
const userProgressTracker_1 = require("./core/userProgressTracker");
const webviewPanel_1 = require("./ui/webviewPanel");
const openaiService_1 = require("./integrations/openaiService");
const tooltipRenderer_1 = require("./ui/tooltipRenderer");
// Variables para almacenar el análisis más reciente y las sugerencias
let latestPatterns = [];
let latestResources = [];
/**
 * Punto de entrada de la extensión.  Registra comandos, proveedores y
 * escucha cambios en los documentos para analizar el contexto.
 */
function activate(context) {
    const analyzer = new contextAnalyzer_1.ContextAnalyzer();
    const knowledge = new knowledgeEngine_1.KnowledgeEngine();
    const progress = new userProgressTracker_1.UserProgressTracker(context.globalState);
    const openaiService = new openaiService_1.OpenAIService();
    // Registrar proveedor de hover para todos los lenguajes
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file', language: '*' }, new tooltipRenderer_1.TooltipRenderer(analyzer, knowledge, progress)));
    // Comando: iniciar mentor (comienza a escuchar cambios en documentos)
    let textChangeListener;
    const startMentorCmd = vscode.commands.registerCommand('codementor.startMentor', () => {
        if (textChangeListener) {
            vscode.window.showInformationMessage('CodeMentor ya está activo y analizando el código.');
            return;
        }
        textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
            const document = event.document;
            latestPatterns = analyzer.analyze(document).patterns;
            // Leer configuración de usuario
            const config = vscode.workspace.getConfiguration('codementor');
            const level = config.get('level', 'intermedio');
            const stack = config.get('stack', []);
            latestResources = knowledge.getResourcesForPatterns(latestPatterns, document.languageId, level, stack);
            // Registrar el progreso
            latestPatterns.forEach((p) => progress.recordTopicLearned(p));
            if (latestResources.length > 0) {
                // Informar brevemente al usuario sobre las sugerencias encontradas
                const titles = latestResources.map((r) => r.title).join(', ');
                vscode.window.setStatusBarMessage(`CodeMentor: nuevos recursos sugeridos (${titles})`, 5000);
            }
        });
        context.subscriptions.push(textChangeListener);
        vscode.window.showInformationMessage('CodeMentor está ahora escuchando cambios en tu código.');
    });
    context.subscriptions.push(startMentorCmd);
    // Comando: explicar selección (muestra sugerencias para el documento o selección actual)
    const explainCmd = vscode.commands.registerCommand('codementor.explainSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No hay un editor activo.');
            return;
        }
        const document = editor.document;
        const analysis = analyzer.analyze(document);
        if (analysis.patterns.length === 0) {
            vscode.window.showInformationMessage('No se detectaron patrones relevantes en la selección.');
            return;
        }
        const config = vscode.workspace.getConfiguration('codementor');
        const level = config.get('level', 'intermedio');
        const stack = config.get('stack', []);
        const resources = knowledge.getResourcesForPatterns(analysis.patterns, document.languageId, level, stack);
        if (resources.length === 0) {
            vscode.window.showInformationMessage('No se encontraron recursos para los patrones detectados.');
            return;
        }
        latestPatterns = analysis.patterns;
        latestResources = resources;
        // Mostrar un listado de recursos para que el usuario elija abrirlos
        const pick = await vscode.window.showQuickPick(resources.map((res) => ({ label: res.title, description: res.description, url: res.url })), { placeHolder: 'Selecciona un recurso para abrir en tu navegador' });
        if (pick && pick.url) {
            vscode.env.openExternal(vscode.Uri.parse(pick.url));
        }
    });
    context.subscriptions.push(explainCmd);
    // Comando: abrir panel de mentor (webview)
    const openPanelCmd = vscode.commands.registerCommand('codementor.openMentorPanel', () => {
        webviewPanel_1.MentorPanel.createOrShow(context, latestResources, openaiService, progress);
    });
    context.subscriptions.push(openPanelCmd);
}
/**
 * Función llamada cuando la extensión se desactiva.  Se utiliza para
 * limpiar escuchas y recursos si fuera necesario.
 */
function deactivate() {
    // Aquí no necesitamos realizar limpieza adicional porque los
    // disposables se gestionan a través de `context.subscriptions`.
}
//# sourceMappingURL=extension.js.map