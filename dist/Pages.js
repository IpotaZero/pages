import { CallbackHandlerRegExp } from "@ipota/my-utils";
import { PageDom } from "./PageDom";
import { PageState } from "./PageState";
import { parseToNumber } from "./parseToNumber";
import { defaultTransition } from "./defaultTransition";
/**
 * Pages <- Dom, Run, State, EventSetter
 */
export class Pages {
    static hiddenClass = "hidden";
    static cache = new Map();
    dom;
    state;
    ch = new CallbackHandlerRegExp();
    ac = new AbortController();
    dispose() {
        this.ac.abort();
    }
    onTransitionStart = this.ch.on.bind(this.ch, "transition-start");
    onTransitionEnd = this.ch.on.bind(this.ch, "transition-end");
    beforeEnter = (pageId, callback) => this.ch.on(`before-enter-(${pageId})`, callback);
    onEnter = (pageId, callback) => this.ch.on(`on-enter-(${pageId})`, callback);
    onExit = (pageId, callback) => this.ch.on(`on-exit-(${pageId})`, callback);
    getHistory() {
        return this.state.getHistory();
    }
    transitions = {};
    setTransition(from, to, forward) {
        if (!this.transitions[from]) {
            this.transitions[from] = {};
        }
        this.transitions[from][to] = forward;
    }
    async loadFromFile(container, path, options = {}) {
        if (!Pages.cache.has(path)) {
            const html = await fetch(path).then((res) => res.text());
            Pages.cache.set(path, html);
        }
        await this.load(container, Pages.cache.get(path), options);
    }
    async load(container, html, { history, override = true } = {}) {
        if (this.dom) {
            throw new Error("Pages have already been loaded");
        }
        this.dom = new PageDom(container, html, override);
        await this.dom.ready;
        this.setOnclick(this.dom.container);
        this.state = new PageState(history);
        await this.goto(this.state.getCurrentPageId(), { msIn: 0, msOut: 0, isBack: false });
    }
    getPage(pageId, option = {}) {
        if (option.noError) {
            return this.dom.getPage(pageId, { noError: true });
        }
        return this.dom.getPage(pageId);
    }
    getElement(query, cls) {
        const element = this.dom.container.querySelector(query);
        if (element === null) {
            throw new Error("そんな要素はない。");
        }
        if (cls && !(element instanceof cls)) {
            throw new Error(`${cls.name}でなかった。`);
        }
        return element;
    }
    getCurrentPage() {
        return this.dom.getPage(this.state.getCurrentPageId());
    }
    getCurrentPageId() {
        return this.state.getCurrentPageId();
    }
    async back(depth, option = {}) {
        await this.goto(this.state.back(depth), Object.assign(option, { msIn: 100, msOut: 100, isBack: true }));
    }
    async enter(id, option = {}) {
        await this.goto(id, Object.assign(option, { msIn: 100, msOut: 100, isBack: false }));
    }
    async goto(nextPageId, option) {
        this.transition(this.getCurrentPage(), this.dom.getPage(nextPageId, { noError: true }), nextPageId, option);
    }
    async transition(from, to, nextPageId, { isBack, msIn, msOut }) {
        console.log(`before-enter-${nextPageId}`);
        const result = await this.ch.run(`before-enter-${nextPageId}`, this);
        if (!result)
            return;
        if (!to)
            throw new Error("存在しないページに行こうとした。");
        const layerFrom = parseToNumber(from.dataset.layer, 0);
        const layerTo = parseToNumber(to.dataset.layer, 0);
        if (layerFrom > layerTo && !isBack) {
            console.error(`下のlayerにback以外でgotoしようとした。from: ${layerFrom}, to: ${layerTo}`);
            return;
        }
        this.ch.run("transition-start", this);
        const currentPageId = this.state.getCurrentPageId();
        const transition = this.transitions[currentPageId]?.[nextPageId] ?? defaultTransition(layerFrom, layerTo, msIn, msOut);
        this.state.goto(nextPageId);
        this.dom.animate(from, to, layerFrom, layerTo, transition);
        this.ch.run(`on-exit-${currentPageId}`, this);
        this.ch.run(`on-enter-${nextPageId}`, this);
        this.ch.run("transition-end", this);
    }
    DEFAULT_IN_MS = 100;
    DEFAULT_OUT_MS = 100;
    setOnclick(container) {
        container.addEventListener("click", (e) => {
            const target = e.target;
            if (!target || !(target instanceof HTMLButtonElement))
                return;
            if (target.hasAttribute("data-link")) {
                const id = target.dataset["link"] || "first";
                const msIn = parseToNumber(target.dataset["msIn"], this.DEFAULT_IN_MS);
                const msOut = parseToNumber(target.dataset["msOut"], this.DEFAULT_OUT_MS);
                this.enter(id, { msIn, msOut });
            }
            else if (target.hasAttribute("data-back")) {
                const depth = parseToNumber(target.dataset["back"], 1);
                const msIn = parseToNumber(target.dataset["msIn"], this.DEFAULT_IN_MS);
                const msOut = parseToNumber(target.dataset["msOut"], this.DEFAULT_OUT_MS);
                this.back(depth, { msIn, msOut });
            }
        }, { signal: this.ac.signal });
    }
}
