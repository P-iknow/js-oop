import ViewModel from './ViewModel.js';
import Scanner from './Scanner.js';
import Processor from './Processor.js';

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector('#target'));
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.style[k] = v;
    }
  })('styles')
);
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.setAttribute(k, v);
    }
  })('attributes')
);
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el[k] = v;
    }
  })('properties')
);
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      console.log('event', k, v, el);
      el['on' + k] = e => v.call(el, e, vm);
    }
  })('events')
);
const viewmodel = ViewModel.get({
  isStop: false,
  changeContents() {
    this.wrapper.styles.background = `rgb(${parseInt(Math.random() * 150) +
      100},${parseInt(Math.random() * 150) + 100},${parseInt(
      Math.random() * 150
    ) + 100})`;
    this.contents.properties.innerHTML = Math.random()
      .toString(16)
      .replace('.', '');
  },
  wrapper: ViewModel.get({
    styles: {
      width: '50%',
      background: '#ffa',
      cursor: 'pointer',
    },
    events: {
      click(e, vm) {
        vm.parent.isStop = true;
        console.log('click', vm);
      },
    },
  }),
  title: ViewModel.get({
    properties: {
      innerHTML: 'Title',
    },
  }),
  contents: ViewModel.get({
    properties: {
      innerHTML: 'Contents',
    },
  }),
});
binder.watch(viewmodel);
const f = _ => {
  console.log('requestAnimationFrame -> viewModel.changeContent()');
  viewmodel.changeContents();
  if (!viewmodel.isStop) requestAnimationFrame(f);
};
requestAnimationFrame(f);
