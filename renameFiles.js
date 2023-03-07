const fs = require("fs");
const path = require("path");

// specify the directory you want to iterate through
const directory = "dist";

// loop through each folder in the directory
fs.readdir(directory, (err, folders) => {
  if (err) throw err;
  folders.forEach((foldername) => {
    const folderPath = path.join(directory, foldername);
    // check that the item is actually a folder (not a file)
    fs.stat(folderPath, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {
        // loop through each file in the folder
        fs.readdir(folderPath, (err, files) => {
          if (err) throw err;
          files.forEach((filename) => {
            // get the file extension
            const extension = path.extname(filename);
            // construct the new filename
            const newFilename = foldername + extension;
            // rename the file
            fs.rename(
              path.join(folderPath, filename),
              path.join(folderPath, newFilename),
              (err) => {
                if (err) throw err;
                console.log(`Renamed ${filename} to ${newFilename}`);
              }
            );
          });
        });
      }
    });
  });
});
