const fs = require("fs");

const unlinkFiles = async (file) => {
  if (fs.existsSync(file)) {
    await fs.unlinkSync(file);
  }
};

module.exports = { unlinkFiles };
