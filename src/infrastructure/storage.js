"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
/**
 * Servicio de almacenamiento.  Encapsula el acceso a `globalState` y
 * `workspaceState` para facilitar la persistencia de datos.  Esta
 * abstracción puede ampliarse para incluir almacenamiento en
 * archivos o en bases de datos.
 */
class StorageService {
    constructor(context) {
        this.globalState = context.globalState;
        this.workspaceState = context.workspaceState;
    }
    /**
     * Devuelve un valor almacenado en el ámbito global.
     */
    getGlobal(key, defaultValue) {
        return this.globalState.get(key, defaultValue);
    }
    /**
     * Actualiza un valor en el ámbito global.
     */
    updateGlobal(key, value) {
        return this.globalState.update(key, value);
    }
    /**
     * Devuelve un valor almacenado en el ámbito del espacio de trabajo.
     */
    getWorkspace(key, defaultValue) {
        return this.workspaceState.get(key, defaultValue);
    }
    /**
     * Actualiza un valor en el ámbito del espacio de trabajo.
     */
    updateWorkspace(key, value) {
        return this.workspaceState.update(key, value);
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=storage.js.map