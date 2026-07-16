/**
 * stateの保持、更新を行う。
 */
export declare class PageState {
    private currentPageId;
    private history;
    constructor(history: readonly string[] | undefined);
    getHistory(): readonly string[];
    goto(pageId: string): void;
    getCurrentPageId(): string;
    back(depth: number): string;
}
