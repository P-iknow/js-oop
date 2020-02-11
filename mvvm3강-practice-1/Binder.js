import type from './type.js';
import ViewModel from './ViewModel.js';
import ViewModelListener from './ViewModelListender.js';
import Processor from './Processor.js';

export const BinderItem = class {
  el;
  viewmodel;
  constructor(
    el,
    viewmodel,
    _0 = type(el, HTMLElement),
    _1 = type(viewmodel, 'string')
  ) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this);
  }
};

export const Binder = class extends ViewModelListener {
  #items = new Set();
  #processors = {};
  add(v, _ = type(v, BinderItem)) {
    this.#items.add(v);
  }
  viewmodelUpdated(updated, viewmodel) {
    const items = {};
    this.#items.forEach(item => {
      items[item.viewmodel] = [
        type(viewmodel[item.viewmodel], ViewModel),
        item.el,
      ];
    });

    updated.forEach(v => {
      if (!items[v.subkey]) return;
      const [vm, el] = items[v.subkey];
      const processor = this.#processors[v.cat];
      if (!el || !processor) return;
      processor.process(vm, el, v.k, v.v);
    });
  }
  addProcessor(v, _0 = type(v, Processor)) {
    this.#processors[v.category] = v;
  }
  watch(viewmodel, _ = type(viewmodel, ViewModel)) {
    viewmodel.addListener(this);
    this.render(viewmodel);
  }
  unWatch(viewmodel, _ = type(viewmodel, ViewModel)) {
    viewmodel.removeListener(this);
  }
  render(viewmodel, _ = type(viewmodel, ViewModel)) {
    const processors = Object.entries(this.#processors);
    this.#items.forEach(item => {
      const vm = type(viewmodel[item.viewmodel], ViewModel);
      const el = item.el;
      processors.forEach(([pk, processor]) => {
        Object.entries(vm[pk]).forEach(([k, v]) => {
          processor.process(vm, el, k, v);
        });
      });
    });
  }
};
