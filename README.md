<h1 align="center">📬 Postbox</h1>
<p align="center">A tool to split up a Postman collection into files. One file per request.</p>
<p align="center">This helps with large collections under source control.
Goodbye, merge conflicts!</p>
<p align="center">
	<a href="https://badge.fury.io/js/%40blueworld%2Fdictionarray">
		<img src="https://badge.fury.io/js/%40blueworld%2Fpostbox.svg" alt="npm version" height="18">
	</a>
</p>

## Installation

`npm i @blueworld/postbox -g`

## Usage

The usage is very simple. We need a path to the Postman collection JSON file and a directory to write our splitted up files into.

**ℹ️Info:** No worries, the order of the Postman collection items is retained!

### Split up the Postman collection JSON

`postbox-split path/to/postman_collection.json ./outdir`

### Merge files back into a Postman collection JSON

`postbox-merge ./outdir path/to/postman_collection.json`
