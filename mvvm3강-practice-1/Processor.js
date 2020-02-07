import type from "./type.js";
import ViewModel from "./ViewModel.js";

const Processor = class {
  category;
  constructor(catergory) {
    this.category = catergory;
    Object.freeze(this);
  }
  process(
    vm,
    el,
    k,
    v,
    _0 = type(vm, ViewModel),
    _1 = type(el, HTMLElement),
    _2 = type(k, "string")
  ) {
    this._process(vm, el, k, v);
  }

  _process(vm, el, k, v) {
    throw "this method should be overided";
  }
};

export default Processor;
