const fs = require("fs");
const path = require("path");

const rootDir = "dist";
const targetDir = "extracted-jsons";

// Make sure the target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

// Get a list of all the folders in the root directory
const folders = fs
  .readdirSync(rootDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Copy each JSON file from each folder into the target directory
folders.forEach((folder) => {
  const sourcePath = path.join(rootDir, folder);
  const files = fs.readdirSync(sourcePath);

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const sourceFile = path.join(sourcePath, file);
      const targetFile = path.join(targetDir, file);
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`Copied ${sourceFile} to ${targetFile}`);
    }
  });
});
