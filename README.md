# CodeMentor AI – Asistente de aprendizaje contextual en VS Code

CodeMentor AI es una extensión para Visual Studio Code pensada para ayudar a los desarrolladores mientras programan.  Su meta es analizar el contexto del archivo y fragmento de código en el que trabajas, detectar patrones de uso de APIs o estructuras avanzadas y ofrecer sugerencias de aprendizaje en tiempo real.

## ¿Cómo funciona?

Esta extensión aprovecha varias partes de la API de extensiones de VS Code:

* **Eventos de activación y puntos de contribución**: las extensiones se activan a partir de eventos declarados (por ejemplo, al ejecutar un comando).  El manifiesto `package.json` expone comandos y puntos de menú para integrarse en el editor【337590563636614†screenshot】.
* **API de VS Code**: se utiliza el espacio de nombres `vscode` para registrar comandos, obtener el documento activo, observar cambios y mostrar paneles o notificaciones【337590563636614†screenshot】.
* **Proveedores de lenguaje programáticos**: gracias a la API `vscode.languages` es posible registrar un `HoverProvider` que devuelve un contenido enriquecido al pasar el ratón por encima de un fragmento.  En el ejemplo oficial se muestra cómo `registerHoverProvider` devuelve un contenido de tipo `MarkdownString` cuando el usuario se sitúa sobre código JavaScript【801611424857408†screenshot】.
* **Webview API**: cuando necesitas interfaces más complejas que los tooltips, una *webview* funciona como un `iframe` dentro de VS Code.  Permite renderizar HTML/JS/CSS propios y comunicarse con la extensión mediante intercambio de mensajes【715109725880540†screenshot】.

## Características principales

1. **Detección contextual de código**.  Un analizador básico revisa el código del documento activo, identifica el lenguaje y busca patrones clave (por ejemplo, hooks de React como `useEffect`, el uso de `Promise`, `async/await` o estructuras de clase).  Con base en esos patrones se consultan recursos en la base de conocimiento.

2. **Sugerencias de aprendizaje**.  La extensión sugiere artículos, fragmentos de documentación o vídeos relacionados con el patrón detectado.  Si el patrón corresponde a un hook de React, se pueden enlazar guías de React; si detecta un `Promise`, ofrece documentación de promesas en JavaScript.  Las sugerencias se muestran como *tooltips* (`HoverProvider`) o dentro de un panel de Webview para experiencias más ricas.

3. **Modo mentor interactivo**.  A través de comandos registrados, el usuario puede solicitar explicaciones de una selección de código o hacer preguntas.  El modo mentor puede integrarse con un modelo de lenguaje (opcional) para generar respuestas más detalladas.

4. **Historial y progreso**.  Se utiliza el almacenamiento global de la API de VS Code (`globalState`) para recordar qué temas ha consultado el usuario.  Con esta información se pueden proponer retos o contenidos a futuro y gamificar el aprendizaje.

5. **Personalización por nivel y stack**.  La extensión ofrece ajustes para que el usuario declare su nivel (junior, intermedio o avanzado) y las tecnologías en las que trabaja (por ejemplo, React+TypeScript).  Esto filtra los recursos sugeridos.

## Estructura del proyecto

La extensión sigue una arquitectura modular inspirada en *Clean Architecture* para facilitar su mantenimiento y escalabilidad:

```
code-mentor-vscode/
├── src/
│   ├── core/
│   │   ├── contextAnalyzer.ts      # Analiza el contexto y detecta patrones de código
│   │   ├── knowledgeEngine.ts      # Mapea patrones detectados a recursos de aprendizaje
│   │   └── userProgressTracker.ts  # Gestiona el historial y progreso del usuario
│   ├── ui/
│   │   ├── webviewPanel.ts         # Gestiona la creación y comunicación de la webview
│   │   └── tooltipRenderer.ts      # Implementa proveedores de hovers para mostrar sugerencias
│   ├── integrations/
│   │   ├── openaiService.ts        # (Opcional) conexión con modelos de lenguaje
│   │   └── docsFetcher.ts          # (Opcional) obtención de documentación externa
│   ├── infrastructure/
│   │   └── storage.ts              # Persistencia de estado usando Memento
│   └── extension.ts                # Punto de entrada de la extensión
├── media/                          # Recursos estáticos para la webview
├── package.json
├── README.md
└── tsconfig.json
```

## Uso básico

Después de instalar la extensión en VS Code y recargar la ventana, dispondrás de varios comandos en la paleta (⇧⌘P / Ctrl+Shift+P):

* **“CodeMentor: Iniciar Mentor”** – Inicia el modo de escucha para analizar el código activo en cada cambio.
* **“CodeMentor: Explicar Selección”** – Explica el fragmento seleccionado en el editor utilizando el analizador de contexto y la base de conocimiento.
* **“CodeMentor: Abrir Panel de Mentor”** – Abre un panel Webview con sugerencias y una interfaz para preguntas.

Cuando pasas el ratón sobre ciertos símbolos (como `useEffect` o `Promise`) se mostrará un tooltip con enlaces a documentación o artículos relevantes.  Si abres el panel, tendrás acceso a una interfaz más completa que también registra tu progreso.

## Futuras mejoras

Este proyecto es una base sobre la que construir un asistente de aprendizaje completo.  Entre las extensiones posibles se encuentran:

* Integrar modelos de lenguaje de gran tamaño para generar explicaciones personalizadas o resolver dudas.
* Ampliar la base de patrones y recursos a más lenguajes y stacks (Python, Go, Rust, etc.).
* Diseñar retos interactivos basados en el código del usuario y otorgar insignias o logros.

Con este punto de partida y la API de extensiones de VS Code【715109725880540†screenshot】, tienes un entorno potente para crear experiencias educativas contextuales.