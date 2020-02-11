const ViewModelListener = class {
  viewmodelUpdated(updated, viewmodel) {
    throw 'override';
  }
};

export default ViewModelListener;
