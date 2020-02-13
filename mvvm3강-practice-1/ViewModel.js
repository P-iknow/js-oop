import ViewModelListener from './ViewModelListener';
import type from './type';

const ViewmodelValue = class {
  subkey;
  cat;
  k;
  v;
  constructor(subkey, cat, k, v) {
    this.subkey = subkey;
    this.cat = cat;
    this.k = k;
    this.v = v;
    Object.freze(this);
  }
};

const ViewModel = class extends ViewModelListener {
  static get(data) {
    return new ViewModel(data);
  }
  static #subjects = new Set();
  static #inited = false;
  static notify(vm) {
    this.#subjects.add(vm);
    if (this.#inited) return;
    this.#inited = true;
    const f = _ => {
      this.#subjects.forEach(vm => {
        if (vm.#isUpdated.size) {
          vm.notify();
          vm.#isUpdated.clear();
        }
      });
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  static define(vm, cat, obj) {
    return Object.defineProperties(
      obj,
      Object.entries(obj).reduce((r, [k, v]) => {
        r[k] = {
          enumerable: true,
          get: _ => v,
          set: newV => {
            v = newV;
            vm.#isUpdated.add(new ViewmodelValue(vm.subkey, cat, k, v));
          },
        };
        return r;
      }, {})
    );
  }
  style = {};
  attributes = {};
  properties = {};
  events = {};
  subkey = '';
  parent = null;
  #isUpdated = new Set();
  #listeners = new Set();
  constructor(data, _ = type(data, 'object')) {
    super();
    Object.entries(data).forEach(([k, v]) => {
      if ('styles,attributes,properties'.includes(k)) {
        if (!v || typeof v != 'object') throw `invalid object k:${k}, v:#{v}`;
        this[k] = ViewModel.define(this, k, v);
      } else {
        Object.defineProperty(this, k, {
          enumerable: true,
          get: _ => v,
          set: newV => {
            v = newV;
            this.#isUpdated.add(new ViewmodelValue(this.subkey, '', k, v));
          },
        });
      }
    });
  }
};
