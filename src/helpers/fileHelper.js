
const getFilenameFromPath = (path) => {
	let filename = path.split("/").pop();
	return filename;
}

const getExtensionFromMimeType = (mimeType) => {
	let mimeMap = {
		'application/pdf': 'pdf',
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/gif': 'gif',
		'audio/mpeg': 'mp3',
		'video/mp4': 'mp4',
		'video/quicktime': 'mov',
		'video/x-msvideo' : 'avi',
		'application/zip': 'zip',
		'text/csv': 'csv',
		'text/plain': 'txt',
	};
	let extension = mimeMap[mimeType];
	return extension || null;
}

const getMimeTypeFromFilename = (filename) => {
	let mimeMap = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'zip': 'application/zip',
    'csv': 'text/csv',
    'txt': 'text/plain',
		'avi': 'video/x-msvideo',
		'mov': 'video/quicktime'
};
	let extension = filename.split(".").pop();
	return mimeMap[extension];
}

module.exports = { getFilenameFromPath, getMimeTypeFromFilename, getExtensionFromMimeType}
