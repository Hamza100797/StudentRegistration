const constants = require('../constant/message');
const RegisterStudents = require('../models/studentRegistration')
const saltRounds = 10;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



exports.getStudents = async (req, res) => {

    const students = await RegisterStudents.find();
    try {
        if (students) {
            return res.status(200).json({
                status: true,
                message: constants.RECORD_FOUND,
                data: students
            })
        }
        else {
            return res.status(404).json({
                status: true,
                message: constants.NO_RECORD_FOUND,

            })

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: constants.SOMETHINGWENTWRONG
        })
    }
}
exports.AddStudent = async (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        return res.status(500).send({
            status: false,
            message: constants.REQUIREDFIELDS
        })
    }
    try {
        req.body.email = req.body.email.toLowerCase();
        let getUser = await RegisterStudents.findOne({ email: req.body.email });
        if (getUser) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: constants.ALREADY_REGISTERED
                })

        }
        else {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).send({
                        error: err,
                        message: constants.HASHING_PASSWORD
                    })
                }
                else {
                    const newStudent = new RegisterStudents({
                        _id: new mongoose.Types.ObjectId,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                        address: req.body.address,
                        image: req.file.path

                    })
                    console.log(`New Student  ${newStudent}`)
                    newStudent.save()
                        .then(result => {
                            console.log(`Data is adds successfully ${result}`)
                            res.status(200).send({
                                status: true,
                                newUser: result,
                                message: constants.REGISTER_USER_Sucess
                            })
                        })
                        .catch(err => {
                            console.log(`Some Error check it ${err}`)
                            res.send({
                                status: false,
                                error: err,
                                message: constants.NOT_REGISTER
                            })
                        })
                }
            })
        }
    }
    catch (error) {
        console.log("Error!", error);
        return res.status(500).json({ status: false, message: constants.ERROR_In_Registeration });
    }
}
exports.UpdateStudent = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                status: false,
                message: constants.NOT_EMPTY
            });
        }
        const id = req.params.id;
        console.log(id)
        RegisterStudents.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        status: false,
                        message: constants.NO_RECORD_FOUND
                    });
                } else res.send({
                    status: true,
                    message: constants.UPDATE_STUDENT,
                    data: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err.message,
                    status: false,
                    message: constants.ERROR_UPDATE
                });
            });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}
exports.deleteStudent = async (req, res) => {
    const id = req.params.id;
    RegisterStudents.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: constants.NOT_FOUND
                });
            } else {
                res.send({
                    status: true,
                    message: constants.DELETED_SUCCESS
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: constants.COULD_NOT_DELETED
            });
        });

}
exports.getStudentByID = async (req, res) => {
    const id = req.params.id;
    RegisterStudents.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    status: false,
                    message: constants.NOT_FOUND
                });
            else res.status(200).send({
                status: true,
                message: constants.RETRIEVE_SUCCESS,
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: constants.RETRIEVE_NOT_SUCCESS
            });
        });
}