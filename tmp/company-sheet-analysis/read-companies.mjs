import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath =
  "/Users/muhammadessam/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/6DEFC865-90C9-4A44-8F86-9C96AF81029B/Flutter_Companies_Cairo_15(1).xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 20000,
  tableMaxRows: 30,
  tableMaxCols: 20,
  tableMaxCellChars: 300,
});
console.log("OVERVIEW");
console.log(overview.ndjson);

const sheets = JSON.parse(
  `[${(await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 10000 })).ndjson
    .trim()
    .split("\n")
    .filter(Boolean)
    .join(",")}]`,
);

for (const [index, sheetInfo] of sheets.entries()) {
  const sheet = workbook.resolve(sheetInfo.id);
  const used = sheet.getUsedRange();
  const rangeAddress = used?.address?.split("!").at(-1) || "A1:Z100";
  const data = await workbook.inspect({
    kind: "table",
    sheetId: sheetInfo.id,
    range: rangeAddress,
    include: "values,formulas",
    tableMaxRows: 200,
    tableMaxCols: 30,
    tableMaxCellChars: 500,
    maxChars: 100000,
  });
  console.log(`SHEET_DATA ${sheetInfo.name} ${rangeAddress}`);
  console.log(data.ndjson);

  const preview = await workbook.render({
    sheetName: sheetInfo.name,
    autoCrop: "all",
    scale: 1.5,
    format: "png",
  });
  await fs.writeFile(
    `previews/${String(index + 1).padStart(2, "0")}-${sheetInfo.name.replaceAll(/[^a-z0-9]+/gi, "-")}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}
