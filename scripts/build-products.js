const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content', 'products');
const dataFile = path.join(__dirname, '..', 'data', 'products.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function slugify(name, index) {
  const base = String(name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return base || ('product-' + index);
}

fs.mkdirSync(contentDir, { recursive: true });

let productFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith('.json') && f !== '.gitkeep.json');
let products = [];

// One-time migrate from old single products.json list → individual files
const legacy = readJson(dataFile);
if (productFiles.length === 0 && legacy && Array.isArray(legacy.products) && legacy.products.length) {
  legacy.products.forEach((p, i) => {
    if (!p || !p.name) return;
    let slug = slugify(p.name, i);
    let file = path.join(contentDir, slug + '.json');
    let n = 1;
    while (fs.existsSync(file)) {
      file = path.join(contentDir, slug + '-' + n + '.json');
      n++;
    }
    fs.writeFileSync(file, JSON.stringify(p, null, 2));
  });
  productFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith('.json') && f !== '.gitkeep.json');
  console.log('Migrated', productFiles.length, 'products to content/products/');
}

productFiles.forEach((f) => {
  const data = readJson(path.join(contentDir, f));
  if (data && data.name) products.push(data);
});

fs.writeFileSync(dataFile, JSON.stringify({ products }, null, 2));
console.log('Built data/products.json with', products.length, 'products');
