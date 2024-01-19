// A somewhat universal interface for the DOM
// Real DOM nodes are 100% compatible with this interface
// For domhandler, there's wrappers in parser/domhandler.ts

export interface INode {
    textContent: string | null;

    childNodes: INodeList;
    firstChild: INode | null;
    lastChild: INode | null;

    parentNode: INode | null;
    previousSibling: INode | null;
    nextSibling: INode | null;
}

export interface ICollection {
    readonly length: number;
    [index: number]: IElement;
}

export interface INodeList<TNode extends INode = INode> {
    readonly length: number;
    [index: number]: TNode;

    forEach(callbackfn: (value: TNode, key: number, parent: INodeList) => void, thisArg?: any): void;
}

export interface IParentNode extends INode {
    children: ICollection;
    firstElementChild: IElement | null;
    lastElementChild: IElement | null;

    querySelector(selector: string): IElement | null;
    querySelectorAll(selector: string): INodeList<IElement>;
}

export interface IElement extends IParentNode {
    getAttribute(name: string): string | null;

    previousElementSibling: IElement | null;
    nextElementSibling: IElement | null;
}
