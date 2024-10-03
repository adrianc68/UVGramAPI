/**
 * Represents a File with its content and metadata.
 * @class
 */
class File {
	/**
	 * Create a File instance.
	 *
	 * @param {Buffer|string} buffer - The content of the file, either as a Buffer or a string.
	 * @param {object} metadata - Metadata associated with the file.
	 * @param {string} metadata.filepath - The path to the file.
	 * @param {string} metadata.filename - The name of the file.
	 * @param {number} metadata.size - The size of the file in bytes.
	 * @param {string} metadata.mimetype - The MIME type of the file.
	 * @param {Date} metadata.lastModified - The last modification date of the file.
	 * @throws {Error} - Throws an error if any required metadata is missing.
	 */
	constructor(buffer, metadata) {
		this.content = buffer;
		this.metadata = {
			filepath: metadata.filepath,
			filename: metadata.filename,
			size: metadata.size,
			mimetype: metadata.mimetype,
			lastModified: metadata.lastModified,
			...metadata
		};
	}
}

module.exports = File;
