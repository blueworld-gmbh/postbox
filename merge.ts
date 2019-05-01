#!/usr/bin/env node
import fs from "fs";
import FileItem from "./interfaces/FileItem";
import Info from "./interfaces/Info";

const inDir = process.argv[2];
const outFile = process.argv[3];

if (process.argv.length !== 4) {
	console.error("Please specify all command line arguments");
	process.exit(1);
}

const files: string[] = fs.readdirSync(inDir);
var items: FileItem[] = [];

// read all files into main memory
files.forEach((file: string) => {
	const fileItem: FileItem = JSON.parse(fs.readFileSync(`${inDir}/${file}`).toString());
	items.push(fileItem);
});

// sort file items by index ascending
items.sort(
	(a: FileItem, b: FileItem): number => {
		return a.index - b.index;
	}
);

// read info portion of the collection
const info: Info = JSON.parse(fs.readFileSync(`${inDir}/info.json`).toString());

// reassemble postman collection file
const postmanCol = {
	info,
	item: items.map((item: FileItem) => {
		return item.item;
	})
};

fs.writeFileSync(outFile, JSON.stringify(postmanCol, null, 4));