const express = require("express");
const router = express.Router();
const studentController = require('../controllers/studentController');





const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname); //Appending extension
    },
});

var upload = multer({ storage: storage })

var multipleUpload = multer({ storage: storage }).array('files')





router.get("/", function (req, res, next) {
    res.send("respond with a resource Student");
});

router.get("/getAllStudent", function (req, res) {
    studentController.getStudents(req, res);
});
router.post("/addStudent", upload.single("image"), function (req, res) {
    studentController.AddStudent(req, res);
});
router.patch("/updateStudent/:id", upload.single("image"), function (req, res) {
    studentController.UpdateStudent(req, res);
});
router.delete("/deleteStudent/:id", function (req, res) {
    studentController.deleteStudent(req, res);
});
router.get("/getStudent/:id", function (req, res) {
    studentController.getStudentByID(req, res);
});
module.exports = router;