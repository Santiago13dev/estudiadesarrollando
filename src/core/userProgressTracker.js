"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgressTracker = void 0;
/**
 * UserProgressTracker gestiona el historial de aprendizaje.  Utiliza la
 * API de almacenamiento de VS Code (Memento) para almacenar un mapa de
 * temas visitados y la cantidad de veces que se han consultado.
 */
class UserProgressTracker {
    constructor(memento) {
        this.key = 'codementor.progress';
        this.memento = memento;
    }
    /**
     * Registra que el usuario ha aprendido o consultado un tema.  Aumenta
     * el contador de visitas para ese tema.
     * @param topic Clave del tema
     */
    recordTopicLearned(topic) {
        var _a;
        const progress = this.getProgress();
        progress[topic] = ((_a = progress[topic]) !== null && _a !== void 0 ? _a : 0) + 1;
        this.memento.update(this.key, progress);
    }
    /**
     * Obtiene el mapa de progreso.  La clave es el nombre del tema y el
     * valor el número de veces que se ha consultado.
     */
    getProgress() {
        return this.memento.get(this.key, {});
    }
}
exports.UserProgressTracker = UserProgressTracker;
//# sourceMappingURL=userProgressTracker.js.map