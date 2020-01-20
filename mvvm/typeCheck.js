const type = (target, type) => {
  if (typeof type === "string") {
    if (typeof target !== type) {
      throw `invlid tpye ${target} : ${type}`;
    }
  } else if (!(target instanceof type)) {
    throw `invlid type ${target} : ${type}`;
  }
  return target;
};

const test = (arr, _ = type(arr, Array)) => {
  console.log(arr);
};
