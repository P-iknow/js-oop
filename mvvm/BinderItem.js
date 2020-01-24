import type from "./typeCheck.js";
import ViewModel from "./ViewModel.js";

export const BinderItem = class {
  el;

  viewmodel;

  constructor(
    el,
    viewmodel,
    _0 = type(el, HTMLElement),
    _1 = type(viewmodel, "string")
  ) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this);
  }
};

export const Binder = class {
  #items = new Set();

  add(v, _ = type(v, BinderItem)) {
    this.#items.add(v);
  }

  render(viewmodel, _ = type(viewmodel, ViewModel)) {
    this.#items.forEach(item => {
      const vm = type(viewmodel[item.viewmodel], ViewModel);
      const { el } = item;
      Object.entries(vm.styles).forEach(([k, v]) => (el.style[k] = v));
      Object.entries(vm.attributes).forEach(([k, v]) => el.setAttribute(k, v));
      Object.entries(vm.properties).forEach(([k, v]) => (el[k] = v));
      Object.entries(vm.events).forEach(
        ([k, v]) => (el[`on${k}`] = e => v.call(el, e, viewmodel))
      );
    });
  }
};
