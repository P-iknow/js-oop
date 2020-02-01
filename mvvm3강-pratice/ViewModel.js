import ViewModelListener from "./ViewModelListener.js";
import type from "./type.js";

const ViewModelValue = class {
  subKey;
  cat;
  k;
  v;
  constructor(subKey, cat, k, v) {
    this.subKey = subKey;
    this.cat = cat;
    this.k = k;
    this.v = v;
    Object.freeze(this);
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
            vm.#isUpdated.add(new ViewModelValue(vm.subKey, cat, k, v));
          }
        };
        return r;
      }, {})
    );
  }
  styles = {};
  attributes = {};
  properties = {};
  events = {};
  subKey = "";
  parent = null;
  #isUpdated = new Set();
  #listeners = new Set();
  constructor(data, _ = type(data, "object")) {
    super();
    Object.entries(data).forEach(([k, v]) => {
      if ("styles,attributes,properties".includes(k)) {
        if (!v || typeof v != "object") throw `invalid object k:${k}, v:${v}`;
        this[k] = ViewModel.define(this, k, v);
      } else {
        Object.defineProperty(this, k, {
          enumerable: true,
          get: _ => v,
          set: newV => {
            v = newV;
            this.#isUpdated.add(new ViewModelValue(this.subKey, "", k, v));
          }
        });
        if (v instanceof ViewModel) {
          v.parent = this;
          v.subKey = k;
          v.addListener(this);
        }
      }
    });
    ViewModel.notify(this);
    Object.seal(this);
  }
  viewmodelUpdated(updated) {
    updated.forEach(v => this.#isUpdated.add(v));
  }
  addListener(v, _ = type(v, ViewModelListener)) {
    this.#listeners.add(v);
  }
  removeListener(v, _ = type(v, ViewModelListener)) {
    this.#listeners.delete(v);
  }
  notify() {
    this.#listeners.forEach(v => v.viewmodelUpdated(this.#isUpdated));
  }
};

export default ViewModel;
