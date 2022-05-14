const multer = require('multer');

const storage = multer.diskStorage({
	destination: "temp/images",
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 2000000 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
}).single("image");

function checkFileType(file, cb) {
	// Allowed ext
	const fileTypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimeType = fileTypes.test(file.mimetype);

	if (mimeType && extName) {
		return cb(null, true);
	} else {
		cb("Error: Images Only !!!");
	}
}

module.exports = upload;