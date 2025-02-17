import Student from '../student/student.model.js';

export const existenteEmailStudent = async (email = ' ') => {

    const existeEmail = await Student.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeStudentById = async (id = '') => {
    
    const existeStudent = await Student.findById(id);

    if (!existeStudent) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}