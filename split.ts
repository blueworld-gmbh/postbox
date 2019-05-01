#!/usr/bin/env node
import fs from "fs";
import slug from "slug";

import Item from "./interfaces/Item";

const file = process.argv[2];
const outDir = process.argv[3];

if (process.argv.length !== 4) {
	console.error("Please specify all command line arguments:");
	console.error("postbox-split path/to/postman_collection.json ./outdir");
	process.exit(1);
}

// read file to memory
const col = JSON.parse(fs.readFileSync(file).toString());

col.item.forEach((item: Item, idx: number) => {
	const fileName = `${slug(item.name).toLowerCase()}.json`;
	console.log("Splitted", fileName);

	let content = {
		index: idx,
		item: item
	};

	fs.writeFileSync(`${outDir}/${fileName}`, JSON.stringify(content, null, 4));
});

// write info portion of the collection
fs.writeFileSync(`${outDir}/__info.json`, JSON.stringify(col.info, null, 4));
