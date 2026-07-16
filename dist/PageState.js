/**
 * stateの保持、更新を行う。
 */
export class PageState {
    currentPageId = "first";
    history = [];
    constructor(history) {
        // Initialize history
        const first = history && history.length ? history.at(-1) : "first";
        this.history = history && history.length ? history.slice(0, -1) : [];
        this.currentPageId = first;
    }
    getHistory() {
        return this.history;
    }
    goto(pageId) {
        this.history.push(pageId);
        this.currentPageId = pageId;
    }
    getCurrentPageId() {
        return this.currentPageId;
    }
    back(depth) {
        if (!Number.isInteger(depth) || depth <= 0)
            throw new Error("depth must be an integer (>= 1).");
        if (this.history.length <= depth) {
            this.history = [];
            return "first";
        }
        for (let i = 0; i < depth; i++) {
            this.history.pop();
        }
        return this.history.pop();
    }
}
