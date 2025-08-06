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
exports.MentorPanel = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Representa un panel Webview para el asistente de mentor.  Cada vez
 * que se solicita, se reutiliza el panel existente o se crea uno
 * nuevo.  El panel muestra la lista de sugerencias y ofrece un
 * formulario para enviar preguntas al motor de lenguaje.
 */
class MentorPanel {
    constructor(panel, extensionUri, suggestions, openaiService, progress) {
        this.disposables = [];
        this.panel = panel;
        this.extensionUri = extensionUri;
        // Configurar el HTML inicial del webview
        this.setHtmlContent(suggestions);
        // Escuchar mensajes provenientes del webview
        this.panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'askQuestion': {
                    const question = message.question;
                    // Registrar la pregunta en el progreso (cada pregunta se toma como tema)
                    progress.recordTopicLearned(question);
                    // Obtener la respuesta del servicio de IA
                    const answer = await openaiService.ask(question);
                    this.panel.webview.postMessage({ type: 'answer', text: answer });
                    break;
                }
            }
        }, undefined, this.disposables);
        // Limpiar cuando se cierre el panel
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }
    /**
     * Crea o muestra el panel del mentor.  Si ya existe, simplemente
     * actualiza su contenido con las nuevas sugerencias.
     */
    static createOrShow(context, suggestions, openaiService, progress) {
        var _a, _b;
        const column = (_b = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.viewColumn) !== null && _b !== void 0 ? _b : vscode.ViewColumn.One;
        if (MentorPanel.currentPanel) {
            MentorPanel.currentPanel.update(suggestions);
            MentorPanel.currentPanel.panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(MentorPanel.viewType, 'CodeMentor – Panel de Mentor', column, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        MentorPanel.currentPanel = new MentorPanel(panel, context.extensionUri, suggestions, openaiService, progress);
    }
    /**
     * Actualiza el contenido del panel con un nuevo listado de sugerencias.
     */
    update(suggestions) {
        this.setHtmlContent(suggestions);
    }
    /**
     * Genera el HTML del panel y lo asigna a la propiedad `html` del
     * webview.  Se utiliza un nonce para permitir la ejecución de
     * scripts en la webview de forma segura.
     */
    setHtmlContent(suggestions) {
        const nonce = getNonce();
        const suggestionItems = suggestions
            .map((res) => {
            const desc = res.description ? ` – ${res.description}` : '';
            return `<li><a href="${res.url}" target="_blank">${res.title}</a>${desc}</li>`;
        })
            .join('');
        this.panel.webview.html = `<!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeMentor AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 1rem; }
          h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
          ul { padding-left: 1.2rem; }
          li { margin-bottom: 0.3rem; }
          #qa { margin-top: 1rem; border-top: 1px solid #ddd; padding-top: 1rem; }
          #question { width: 70%; padding: 0.4rem; }
          #askBtn { margin-left: 0.5rem; padding: 0.4rem 0.8rem; }
          #answer { margin-top: 0.5rem; white-space: pre-wrap; background-color: #f7f7f7; padding: 0.5rem; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>CodeMentor AI – Sugerencias</h1>
        <p>Recursos recomendados según los patrones detectados:</p>
        <ul>${suggestionItems || '<li>No se detectaron patrones.</li>'}</ul>
        <div id="qa">
          <h2>Haz una pregunta</h2>
          <input type="text" id="question" placeholder="Escribe tu pregunta aquí…" />
          <button id="askBtn">Preguntar</button>
          <pre id="answer"></pre>
        </div>
        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          const askBtn = document.getElementById('askBtn');
          askBtn.addEventListener('click', () => {
            const input = document.getElementById('question');
            const value = input.value.trim();
            if (!value) return;
            vscode.postMessage({ type: 'askQuestion', question: value });
            input.value = '';
          });
          window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'answer') {
              const answerEl = document.getElementById('answer');
              answerEl.textContent = message.text;
            }
          });
        </script>
      </body>
    </html>`;
    }
    /**
     * Libera los recursos asociados a la webview.
     */
    dispose() {
        MentorPanel.currentPanel = undefined;
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
exports.MentorPanel = MentorPanel;
MentorPanel.viewType = 'codementor.mentorPanel';
/**
 * Genera una cadena aleatoria para el nonce requerido en las
 * políticas de seguridad de contenido de Webviews.  Esta función
 * asegura que cada carga tenga un script seguro.
 */
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=webviewPanel.js.map