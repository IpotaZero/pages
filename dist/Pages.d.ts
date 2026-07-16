export type PagesFadeOption = {
    msIn: number;
    msOut: number;
};
export type PagesTransitionArgs = {
    from: (args: {
        from: HTMLElement;
        to: HTMLElement;
    }) => Promise<void>;
    to: (args: {
        from: HTMLElement;
        to: HTMLElement;
    }) => Promise<void>;
    last: (args: {
        from: HTMLElement;
        to: HTMLElement;
    }) => Promise<void>;
    crossfade?: boolean;
};
export type PagesLoadOption = Partial<{
    history: readonly string[];
    override: boolean;
}>;
/**
 * Pages <- Dom, Run, State, EventSetter
 */
export declare class Pages {
    static hiddenClass: string;
    private static cache;
    private dom;
    private state;
    private readonly ch;
    private ac;
    dispose(): void;
    onTransitionStart: (handler: (arg: Pages) => void) => void;
    onTransitionEnd: (handler: (arg: Pages) => void) => void;
    beforeEnter: (pageId: string, callback: (pages: Pages) => void) => void;
    onEnter: (pageId: string, callback: (pages: Pages) => void) => void;
    onExit: (pageId: string, callback: (pages: Pages) => void) => void;
    getHistory(): readonly string[];
    private readonly transitions;
    setTransition(from: string, to: string, forward: PagesTransitionArgs): void;
    loadFromFile(container: HTMLElement, path: string, options?: PagesLoadOption): Promise<void>;
    load(container: HTMLElement, html: string, { history, override }?: PagesLoadOption): Promise<void>;
    getPage(pageId: string, option: {
        noError: true;
    }): HTMLElement | undefined;
    getPage(pageId: string, option?: {
        noError?: false;
    }): HTMLElement;
    getElement<Class extends typeof HTMLElement>(query: string, cls?: Class): InstanceType<Class>;
    getCurrentPage(): HTMLElement;
    getCurrentPageId(): string;
    back(depth: number, option?: Partial<PagesFadeOption>): Promise<void>;
    enter(id: string, option?: Partial<PagesFadeOption>): Promise<void>;
    private goto;
    private transition;
    private readonly DEFAULT_IN_MS;
    private readonly DEFAULT_OUT_MS;
    private setOnclick;
}
