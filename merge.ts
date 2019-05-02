#!/usr/bin/env node

import fs from "fs";

import FileItem from "./interfaces/FileItem";
import Info from "./interfaces/Info";
import Item from "./interfaces/Item";

const inDir: string = process.argv[2];
const outFile: string = process.argv[3];

class ExtendedFileItem implements FileItem {
	public name: string;
	public predecessor: string;
	public item: Item;

	public constructor(fileItem: FileItem) {
		this.predecessor = fileItem.predecessor;
		this.item = fileItem.item;
	}
}

if (process.argv.length !== 4) {
	console.error("Please specify all command line arguments:");
	console.error("postbox-merge ./outdir path/to/postman_collection.json");
	process.exit(1);
}

const files: string[] = fs.readdirSync(inDir);
var items: ExtendedFileItem[] = [];

// read all files into main memory
files
	.filter((file: string) => {
		// remove interal files, those start with two underscores
		return !file.startsWith("__") && !file.startsWith(".");
	})
	.forEach((file: string) => {
		// read the file content
		const fileItem: FileItem = JSON.parse(fs.readFileSync(`${inDir}/${file}`).toString());

		let item = new ExtendedFileItem(fileItem);

		// store the filename
		item.name = file.replace(".json", "");

		items.push(item);
	});

var sortedItems: ExtendedFileItem[] = [];

let currentSearchItem = null;
for (let item of items) {
	for (let searchItem of items) {
		if (searchItem.predecessor === currentSearchItem) {
			sortedItems.push(searchItem);
			currentSearchItem = searchItem.name;
		}
	}
}

// read info portion of the collection
const info: Info = JSON.parse(fs.readFileSync(`${inDir}/__info.json`).toString());

// reassemble postman collection file
const postmanCol = {
	info,
	item: sortedItems.map((item: ExtendedFileItem) => {
		return item.item;
	})
};

fs.writeFileSync(outFile, JSON.stringify(postmanCol, null, 4));
