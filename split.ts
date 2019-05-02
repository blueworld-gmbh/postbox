#!/usr/bin/env node

import fs from "fs";
import slug from "slug";

import Item from "./interfaces/Item";
import FileItem from "./interfaces/FileItem";

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

for (let item of <Item[]>col.item) {
	let fileName = `${slug(item.name).toLowerCase()}`;

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
}

// write info portion of the collection
fs.writeFileSync(`${outDir}/__info.json`, JSON.stringify(col.info, null, 4));
