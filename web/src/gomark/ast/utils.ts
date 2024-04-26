import { NodeType, Node } from './ast'

export function findPrevSiblingExceptLineBreak(node: Node | null): Node | null {
    if (node === null) {
        return null;
    }
    let prev = node.PrevSibling();
    if (prev !== null && prev.Type() === NodeType.LineBreakNode && prev.PrevSibling() !== null && (prev.PrevSibling() as Node).Type() !== NodeType.LineBreakNode) {
        return findPrevSiblingExceptLineBreak(prev);
    }
    return prev;
}

export function findNextSiblingExceptLineBreak(node: Node | null): Node | null {
    if (node === null) {
        return null;
    }
    let next = node.NextSibling();
    if (next !== null && next.Type() === NodeType.LineBreakNode && next.NextSibling() !== null && (next.NextSibling() as Node).Type() !== NodeType.LineBreakNode) {
        return findNextSiblingExceptLineBreak(next);
    }
    return next;
}
