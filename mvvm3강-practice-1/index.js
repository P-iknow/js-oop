import ViewModel from "./ViewModel.js";
import Scanner from "./Scanner.js";
import Processor from "./Processor.js";

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector("#target"));

binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.style[k] = v;
    }
  })("style")
);
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el.setAtrribute(k, v);
    }
  })("attributes")
);
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el[k] = v;
    }
  })("properties")
);
binder.addProcessor(
  new (class extends Processor {
    _process(vm, el, k, v) {
      el[`on${k}`] = e => v.call(e, el, vm);
    }
  })("events")
);

const viewmodel = ViewModel.get({
  isStop: false,
  changeContents() {
    this.wrapper.styles.background = `rgb(${parseInt(Math.random() * 150) +
      100}, ${parseInt(Math.random() * 150) + 100}, ${parseInt(
      Math.random() * 150
    ) + 100})`;
    this.contents.properties.innerHTML = Math.random()
      .toString(16)
      .replace(".", "");
  },
  wrapper: ViewModel.get({
    styles: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer"
    },
    events: {
      click(e, vm) {
        vm.parent.isStrop = true;
        console.log("click", vm);
      }
    }
  }),
  title: ViewModel.get({
    proeperties: {
      innertHTML: "Title"
    }
  }),
  contents: ViewModel.get({
    properties: {
      innertHTML: "Contents"
    }
  })
});

binder.watch(viewmodel);
const f = _ => {
  viewmodel.changeContents();
  if (!viewmodel.isStop) requestAnimationFrame(f);
};
requestAnimationFrame(f);
