import type from './tpye.js';

export const Visitor = class {
  visit(action, target, _0 = type(action, 'function')) {
    throw 'override';
  }
};

export const DomVisitor = class extends Visitor {
  visit(
    action,
    target,
    _0 = type(action, 'function'),
    _1 = type(target, HTMLElement)
  ) {
    const stack = [];
    let curr = target.firstElementChild;
    do {
      action(curr);
      if (curr.firstElementChild) stack.push(curr.firstElementChild);
      if (curr.nextElementSibling) stack.push(curr.nextElementSibling);
    } while ((curr = stack.pop()));
  }
};
