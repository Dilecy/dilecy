const fs = require('fs-extra');
const path = require('path');

const walk = (p, fun) => {
  const d = fs.readdirSync(p);
  for (const f of d) {
    const pf = path.resolve(p, f);
    if (fun(pf)) return true;
    const s = fs.statSync(pf);
    if (s.isDirectory()) {
      if (walk(pf, fun)) return true;
    }
  }
  return false;
};

let max = 0;
walk(path.resolve(process.argv[2]), p => {
  if (p.length > max) {
    max = p.length;
    console.log(p.length, p);
    // return true;
  }
  return false;
});
