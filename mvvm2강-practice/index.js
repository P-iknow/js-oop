import ViewModel from "./ViewModel.js";
import Scanner from "./Scanner.js";

const viewmodel = ViewModel.get({
  isStop: false,
  changeContents() {
    this.wrapper.styles.background = `rgb(${parseInt(Math.random() * 150) +
      100},${parseInt(Math.random() * 150) + 100},${parseInt(
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
        vm.isStop = !vm.isStop;
        console.log("click", vm);
      }
    }
  }),
  title: ViewModel.get({
    properties: {
      innerHTML: "Title"
    }
  }),
  contents: ViewModel.get({
    properties: {
      innerHTML: "Contents"
    }
  })
});

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector("#target"));
binder.render(viewmodel);

const f = _ => {
  viewmodel.changeContents();
  binder.render(viewmodel);
  if (!viewmodel.isStop) requestAnimationFrame(f);
};
requestAnimationFrame(f);
