import ViewModelListener from './ViewModelListener';
import tpye from './type';

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
