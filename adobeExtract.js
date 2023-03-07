/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */
const fs = require("fs");
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");
const directory = "january2";
/**
 * This sample illustrates how to extract Text Information from PDF.
 * <p>
 * Refer to README.md for instructions on how to run the samples & understand output zip file.
 */
fs.readdir(directory, async (err, files) => {
  for (const file of files) {
    // console.log(file);
    const filename = file;
    const filenameWithoutExtension = filename.replace(".pdf", "");
    // console.log(filenameWithoutExtension);

    try {
      // Initial setup, create credentials instance.
      const credentials =
        PDFServicesSdk.Credentials.serviceAccountCredentialsBuilder()
          .fromFile("pdfservices-api-credentials.json")
          .build();

      // Create an ExecutionContext using credentials
      const executionContext =
        PDFServicesSdk.ExecutionContext.create(credentials);

      // Build extractPDF options
      const options =
        new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
          .addElementsToExtract(
            PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT
          )
          .build();

      // Create a new operation instance.
      const extractPDFOperation =
          PDFServicesSdk.ExtractPDF.Operation.createNew(),
        input = PDFServicesSdk.FileRef.createFromLocalFile(
          `${directory}/${file}`,
          PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
        );

      // Set operation input from a source file.
      extractPDFOperation.setInput(input);

      // Set options
      extractPDFOperation.setOptions(options);

      //Generating a file name
      let outputFilePath = createOutputFilePath();

      extractPDFOperation
        .execute(executionContext)
        .then((result) => result.saveAsFile(outputFilePath))
        .catch((err) => {
          if (
            err instanceof PDFServicesSdk.Error.ServiceApiError ||
            err instanceof PDFServicesSdk.Error.ServiceUsageError
          ) {
            console.log("Exception encountered while executing operation", err);
          } else {
            console.log("Exception encountered while executing operation", err);
          }
        });

      //Generates a string containing a directory structure and file name for the output file.
      function createOutputFilePath() {
        return "output/adobeExtract" + filenameWithoutExtension + ".zip";
      }
    } catch (err) {
      console.log("Exception encountered while executing operation", err);
    }
  }
});
