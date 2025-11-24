
const fs = require("fs/promises")
const path = require('path')



const DATA_DIR = path.resolve(__dirname, '../../data/');
const PRODUCTS_PATH = path.join(DATA_DIR, 'products.json');
const CARTS_PATH = path.join(DATA_DIR, 'carts.json');



//CONFIG FILE SYSTEM

class FileSystemManager {
  
 async readJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw || '[]');
}

 async writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}
}

const filesystem = new FileSystemManager();

module.exports = {
 filesystem,
  PRODUCTS_PATH,
  CARTS_PATH,
};
