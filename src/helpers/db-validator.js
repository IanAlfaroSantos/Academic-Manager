import Student from '../student/student.model.js';
import Teacher from '../teacher/teacher.model.js';
import Course from '../course/course.model.js';
import AsignedCourse from '../asignarCourse/asignedCourse.model.js';

export const existenteEmail = async (email = ' ') => {

    const existeStudentEmail = await Student.findOne({ email });
    const existeTeacherEmail = await Teacher.findOne({ email });

    if (existeTeacherEmail || existeStudentEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeTeacherById = async (id = '') => {
    
    const existeTeacher = await Teacher.findById(id);
    
    if (!existeTeacher) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeStudentById = async (id = '') => {
    
    
    const existeStudent = await Student.findById( id );
    
    if (!existeStudent) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeStudentOrTeacher = async (id) => {
    const existeStudent = await Student.findById(id);
    const existeTeacher = await Teacher.findById(id);

    if (!existeStudent && !existeTeacher) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeCourseById = async (id = '') => {
    
    const existeCourse = await Course.findById(id);
    
    if (!existeCourse) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existeAsignedCourseById = async (id = '') => {
    
    const existeAsignedCourse = await AsignedCourse.findById(id);
    
    if (!existeAsignedCourse) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const existenteNameCourse = async (name = ' ') => {

    const existeName = await Course.findOne({ name });

    if (existeName) {
        throw new Error(`El nombre ${ name } ya existe en la base de datos`);
    }
}