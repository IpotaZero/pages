import { type PagesTransitionArgs } from "./Pages";
/**
 * domのセットアップ、保持、フェードを行う。
 */
export declare class PageDom {
    readonly container: HTMLElement;
    private readonly pages;
    readonly ready: Promise<void>;
    private animationId;
    constructor(container: HTMLElement, html: string, override: boolean);
    getPage(pageId: string, option: {
        noError: true;
    }): HTMLElement | undefined;
    getPage(pageId: string, option?: {
        noError?: false;
    }): HTMLElement;
    animate(from: HTMLElement, to: HTMLElement, layerFrom: number, layerTo: number, transition: PagesTransitionArgs): Promise<void>;
    private setup;
    private isCanceledAnimationError;
    private waitAnimation;
}
