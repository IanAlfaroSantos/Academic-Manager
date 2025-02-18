import Student from '../student/student.model.js';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import Teacher from '../teacher/teacher.model.js';
>>>>>>> feature/teacher
=======
import Teacher from '../teacher/teacher.model.js';
import Course from '../course/course.model.js';
>>>>>>> feature/course

export const existenteEmailStudent = async (email = ' ') => {

    const existeEmail = await Student.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
export const existenteEmailTeacher = async (email = ' ') => {

    const existeEmail = await Teacher.findOne({ email });

=======
export const existenteEmailTeacher = async (email = ' ') => {
    
    const existeEmail = await Teacher.findOne({ email });
    
>>>>>>> feature/course
    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeTeacherById = async (id = '') => {
    
    const existeTeacher = await Teacher.findById(id);
<<<<<<< HEAD

=======
    
>>>>>>> feature/course
    if (!existeTeacher) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

<<<<<<< HEAD
>>>>>>> feature/teacher
export const existeStudentById = async (id = '') => {
    
    const existeStudent = await Student.findById(id);

    if (!existeStudent) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
=======
export const existeStudentById = async (id = '') => {
    
    
    const existeStudent = await Student.findById( id );
    
    if (!existeStudent) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeCourseById = async (id = '') => {
    
    const existeCourse = await Course.findById(id);
    
    if (!existeCourse) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existenteNameCourse = async (name = ' ') => {

    const existeName = await Course.findOne({ name });

    if (existeName) {
        throw new Error(`El nombre ${ name } ya existe en la base de datos`);
    }
>>>>>>> feature/course
}