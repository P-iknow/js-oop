const ViewModelListener = class {
  viewmodelUpdated(updated) {
    throw "override";
  }
};

export default ViewModelListener;
