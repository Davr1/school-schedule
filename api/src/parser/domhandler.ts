import selectAll, { selectOne } from "css-select";
import { type AnyNode, DomHandler, Element, type ParentNode } from "domhandler";
import { getChildren, nextElementSibling, prevElementSibling, textContent } from "domutils";
import { ElementType, Parser } from "htmlparser2";

import type { ICollection, IElement, INode, INodeList, IParentNode } from "@/parser/interfaces";

/**
 * Implementation of INodeList compatible with domhandler
 */
class domhandlerNodeList<TNode extends INode = INode> extends Array<TNode> implements INodeList<TNode> {
    forEach(callbackfn: (value: TNode, index: number, parent: domhandlerNodeList<TNode>) => void, thisArg?: any) {
        super.forEach((value, index) => callbackfn.call(thisArg, value, index, this));
    }
}

/**
 * Implementation of INode compatible with domhandler
 */
class domhandlerNode implements INode {
    #node: AnyNode;

    constructor(node: AnyNode) {
        this.#node = node;
    }

    get textContent(): string | null {
        return textContent(this.#node);
    }

    get childNodes(): INodeList {
        const nodes = getChildren(this.#node).map(wrapNode);

        return new domhandlerNodeList(...nodes);
    }

    get firstChild(): INode | null {
        return this.childNodes[0] ?? null;
    }

    get lastChild(): INode | null {
        return this.childNodes[this.childNodes.length - 1] ?? null;
    }

    get parentNode(): INode | null {
        if (this.#node.parent === null) return null;

        return wrapNode(this.#node.parent);
    }

    get previousSibling(): INode | null {
        if (this.#node.prev === null) return null;

        return wrapNode(this.#node.prev);
    }

    get nextSibling(): INode | null {
        if (this.#node.next === null) return null;

        return wrapNode(this.#node.next);
    }
}

/**
 * Implementation of IParentNode compatible with domhandler
 */
class domhandlerParentNode extends domhandlerNode implements IParentNode {
    #node: ParentNode;

    constructor(node: ParentNode) {
        super(node);

        this.#node = node;
    }

    get children(): ICollection {
        const nodes = getChildren(this.#node)
            .map(wrapNode)
            .filter((node) => node instanceof domhandlerElement) as IElement[];

        return nodes;
    }

    get firstElementChild(): IElement | null {
        return this.children[0] ?? null;
    }

    get lastElementChild(): IElement | null {
        return this.children[this.children.length - 1] ?? null;
    }

    querySelector(selector: string): IElement | null {
        const node = selectOne<ParentNode, Element>(selector, this.#node);
        if (!node) return null;

        return new domhandlerElement(node);
    }

    querySelectorAll(selector: string): INodeList<IElement> {
        const nodes = selectAll<ParentNode, Element>(selector, this.#node)
            .map(wrapNode)
            .filter((node) => node instanceof domhandlerElement) as IElement[];

        return new domhandlerNodeList<IElement>(...nodes);
    }
}

/**
 * Implementation of IElement compatible with domhandler
 */
class domhandlerElement extends domhandlerParentNode implements IElement {
    #node: Element;

    constructor(node: Element) {
        super(node);

        this.#node = node;
    }

    getAttribute(name: string): string | null {
        return this.#node.attribs[name] ?? null;
    }

    get nextElementSibling(): IElement | null {
        const el = nextElementSibling(this.#node);
        if (!el) return null;

        return new domhandlerElement(el);
    }

    get previousElementSibling(): IElement | null {
        const el = prevElementSibling(this.#node);
        if (!el) return null;

        return new domhandlerElement(el);
    }
}

/**
 * Wrap a domhandler node into a INode
 * @param node Domhandler node to wrap
 * @returns Wrapped domhandler node as INode
 */
function wrapNode(node: AnyNode): INode {
    switch (node.type) {
        case ElementType.Root:
            return new domhandlerParentNode(node);
        case ElementType.Tag:
            return new domhandlerElement(node);
        default:
            return new domhandlerNode(node);
    }
}

/**
 * Parse a string into a dom
 *
 * Note: On the web, use `new DOMParser().parseFromString` instead!
 * @param html The html string to parse
 * @returns A promise that resolves to the dom
 */
export function parseHTML(html: string): Promise<IParentNode> {
    return new Promise((resolve, reject) => {
        // Create a new dom handler that resolves the promise when it's done
        const handler = new DomHandler((error) => {
            if (error) reject(error);

            resolve(wrapNode(handler.root) as IParentNode);
        });

        // Create a new parser with the handler
        const parser = new Parser(handler);

        // Write the html to the parser
        parser.write(html);
        parser.end();
    });
}
