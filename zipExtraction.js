const decompress = require("decompress");
const fs = require("fs");

const directory = "./output/adobeExtract";

fs.readdir(`${directory}`, async (err, files) => {
  for (const file of files) {
    const filename = file;
    const filenameWithoutExtension = filename.replace(".zip", "");
    console.log(file);
    decompress(`${directory}/${file}`, `dist/${filenameWithoutExtension} `)
      .then((files) => {
        console.log("Extraction complete");
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
