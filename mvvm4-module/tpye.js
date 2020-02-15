const type = (target, type) => {
  if (typeof type == 'string') {
    if (!typeof target == type) throw `invalit type ${target} : ${type}`;
  } else if (!(target instanceof type))
    throw `invalit type ${target} : ${type}`;
};

export default type;
