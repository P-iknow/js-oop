const type = (target, type) => {
  if (typeof type == "string") {
    if (typeof target != type) throw `Invalid type ${target} : ${type}`;
  } else if (!(target instanceof type)) {
    throw `Invalid type ${target} : ${type}`;
  }
  return target;
};

export default type;
