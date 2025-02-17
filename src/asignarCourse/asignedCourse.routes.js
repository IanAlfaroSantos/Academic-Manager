import { Router } from "express";
import { check } from "express-validator"
import { existeAsignedCourseById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarTeacherJWT, validarStudentJWT } from "../middlewares/validar-jwt.js";
import { saveAsignedStudent, saveAsignedTeacher, getAsigned, getAsignedCourseById, getCoursesById, updateAsignedCourse } from "./asignedCourse.controller.js";

const router = Router();

router.post(
    '/student',
    [
        validarStudentJWT,
        check('email', 'Este no es un correo valido').not().isEmpty(),
        check('name', 'Este no es un curso valido').not().isEmpty(),
        validarCampos
    ],
    saveAsignedStudent
)

router.post(
    '/teacher',
    [
        validarTeacherJWT,
        check('email', 'Este no es un correo valido').not().isEmpty(),
        check('name', 'Este no es un curso valido').not().isEmpty(),
        validarCampos
    ],
    saveAsignedTeacher
)

router.get(
    '/',
    getAsigned
);

router.get(
    '/findAsigned/:id',
    [
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeAsignedCourseById),
        validarCampos
    ],
    getAsignedCourseById
);

router.get(
    '/courses/:id',
    [
        check('id', 'No es ID válido').isMongoId(),
        check('role', 'El parámetro role es obligatorio').not().isEmpty(),
        check('role').isIn(['STUDENT_ROLE', 'TEACHER_ROLE']).withMessage('El parámetro role debe ser "STUDENT_ROLE" o "TEACHER_ROLE"'),
        validarCampos
    ],
    getCoursesById
);

router.put(
    '/:id',
    [
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeAsignedCourseById),
        validarCampos
    ],
    updateAsignedCourse
);

export default router;