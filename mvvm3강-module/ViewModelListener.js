const ViewModelListener = class {
  viewmodelUpdated(viewmodel, updated) {
    throw 'override';
  }
};

export default ViewModelListener;
