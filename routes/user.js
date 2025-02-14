// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth");

// const upload = require("../middleware/uploads");

// const {
//   register,
//   login,
//   uploadImage,
// } = require("../controllers/user");

// router.post("/uploadImage", upload, uploadImage);
// router.post("/register", register);
// router.post("/login", login);


// module.exports = router;

const express = require("express");
const router = express.Router();
const { register, login, uploadImage } = require("../controllers/user");
const upload = require("../middleware/uploads");
const UserValidation = require("../validation/userValidation");

router.post("/register", UserValidation, register);
router.post("/login", login);
router.post("/uploadImage", upload.single("profilePicture"), uploadImage);

module.exports = router;