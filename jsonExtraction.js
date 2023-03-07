const fs = require("fs");
const path = require("path");

const directoryPath = "./extracted-jsons"; // replace with your folder path

fs.readdir(directoryPath, function (err, files) {
  let devotionalObject = [];
  if (err) {
    console.log("Error reading directory: ", err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        console.log("Error reading file: ", err);
        return;
      }

      const jsonData = JSON.parse(data);
      const elementsArray = jsonData["elements"];
      //   console.log(elementsArray);
      let scriptures = [];

      for (let i = 0; i < elementsArray.length; i++) {
        scriptures.push(elementsArray[i].Text);
      }

      console.log(scriptures);
      scriptures = scriptures.filter(Boolean);

      // extract fields from the scriptures array
      const months = ["January", "February"];

      let day;
      let title;
      let verse;
      let paragraphs;
      let prayer;
      let author = "Daily Doses";

      let secondArray;
      day = scriptures.find((elements) =>
        months.some((month) => elements.includes(month))
      );

      secondArray = scriptures.filter((element) => day !== element);

      title = secondArray[0];

      secondArray = secondArray.filter(
        (element) => title !== element && day !== element
      );

      let lastVerseIndex;
      let prayerConfessionIndex;
      for (let i = 0; i < secondArray.length; i++) {
        if (secondArray[i].includes("(") && secondArray[i].includes(")")) {
          lastVerseIndex = i;
          break;
        }
      }

      verse = secondArray.slice(0, lastVerseIndex + 1).join("");

      secondArray = secondArray.slice(lastVerseIndex + 1);

      for (let i = 0; i < secondArray.length; i++) {
        if (
          secondArray[i].includes("PRAYER") &&
          secondArray[i].includes("CONFESSION")
        ) {
          prayerConfessionIndex = i;
          break;
        }
      }
      paragraphs = secondArray.slice(0, prayerConfessionIndex).join("");

      secondArray = secondArray.slice(prayerConfessionIndex + 1);

      secondArray = secondArray.filter(Boolean);
      // console.log(secondArray);
      prayer = secondArray.join();
      // console.log(prayer);

      // create a new JSON object with the extracted fields
      const json = {
        day: day?.replace("Daily Doses ", ""),
        title,
        verse,
        paragraphs,
        prayer,
        author,
      };

      devotionalObject.push(json);
      fs.writeFileSync("devotions.json", JSON.stringify(devotionalObject));

      //   const outputFilePath = path.join(
      //     "./mongodb",
      //     `${file.split(".")[0]}-output.json`
      //   );
      //   fs.writeFile(outputFilePath, JSON.stringify(json), function (err) {
      //     if (err) {
      //       console.log("Error writing file: ", err);
      //       return;
      //     }
      //     console.log(`Successfully wrote ${outputFilePath}`);
      //   });
    });
  }
});
