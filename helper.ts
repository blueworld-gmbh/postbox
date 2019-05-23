// only enclude the collection json files that have a json ending
// and start without a double underscore. double underscores are info files
// that are generated from this tool itself
export function influcePostmanJsonFile(fileName: string): boolean {
	return !fileName.startsWith("__") && !fileName.startsWith(".") && fileName.endsWith(".json");
}
