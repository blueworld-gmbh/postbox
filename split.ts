#!/usr/bin/env node

import fs from "fs";
import slug from "slug";

import FileItem from "./interfaces/FileItem";
import { influcePostmanJsonFile } from "./helper";

const file: string = process.argv[2];
const outDir: string = process.argv[3];

if (process.argv.length !== 4) {
	console.error("Please specify all command line arguments:");
	console.error("postbox-split path/to/postman_collection.json ./outdir");
	process.exit(1);
}

// read file to memory
var col;
try {
	col = JSON.parse(fs.readFileSync(file).toString());
} catch (e) {
	console.info(e);
	process.exit(0);
}

var visitedNames: { [id: string]: number } = {};
var lastFileName = null;

// read and memorize all files from the output directory
var existingJsonFilesInOutDir: string[] = fs
	.readdirSync(outDir)
	.filter((file) => {
		return influcePostmanJsonFile(file);
	})
	.map((file) => {
		return file.split(".")[0];
	});

// iterate all items in collection
for (let item of col.item) {
	let fileName = `${slug(item["name"]).toLowerCase()}`;

	// if duplicate, count up
	if (fileName in visitedNames) {
		fileName += `-${visitedNames[fileName]}`;
	} else {
		visitedNames[fileName] = 1;
	}

	visitedNames[fileName]++;

	console.log("Splitted:", fileName);

	// store the item and its predecessor
	const content: FileItem = {
		predecessor: lastFileName,
		item: item
	};

	fs.writeFileSync(`${outDir}/${fileName}.json`, JSON.stringify(content, null, 4));
	lastFileName = fileName;

	// remove this filename from the array of existing json files within the out directory
	// in the end this leaves the files that should be deleted by the split operation
	const index = existingJsonFilesInOutDir.indexOf(fileName);
	if (index !== -1) {
		existingJsonFilesInOutDir.splice(index, 1);
	}
}

// write info portion of the collection
fs.writeFileSync(`${outDir}/__info.json`, JSON.stringify(col.info, null, 4));

// remove all files that are still left within the out dir and were not part of this split
existingJsonFilesInOutDir.forEach((fileName) => {
	console.log("Deleted:", fileName);
	fs.unlinkSync(`${outDir}/${fileName}.json`);
});
