import type from './tpye.js';
import { Visitor, DomVisitor } from './Visitor.js';
import { Binder, BinderItem } from './Binder';

export const Scanner = class {
  #visitor;

  constructor(visitor, _ = type(visitor, Visitor)) {
    this.#visitor = visitor;
  }

  visit(f, target) {
    this.#visitor.visit(f, target);
  }

  scan(target) {
    throw 'override';
  }
};

export const DomScanner = class extends Scanner {
  constructor(visitor, _ = type(visitor, DomVisitor)) {
    super(visitor);
  }

  scan(target, _ = type(target, HTMLElement)) {
    const binder = new Binder();
    const f = el => {
      const vm = el.getAttribute('data-viewmodel');
      if (vm) binder.add(new BinderItem(el, vm));
    };
    f(target);
    this.visit(f, target);
    return binder;
  }
};
