import Course from "../course/course.model.js"
import Student from "../student/student.model.js"
import Teacher from "../teacher/teacher.model.js"
import AsignedCourse from "./asignedCourse.model.js"
import { response, request } from "express"

export const saveAsignedStudent = async (req, res) => {
    try {
        const data = req.body;
        const student = await Student.findOne({ email: data.email });
        const course = await Course.findOne({ name: data.name.toLowerCase() });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }

        if (course.estado === false) {
            return res.status(400).json({
                success: false,
                message: 'El curso esta desactivado, no se puede asignar'
            });
        }

        const existeAsignacion = await AsignedCourse.findOne({
            student: student._id,
            course: course._id
        });

        if (existeAsignacion) {
            return res.status(400).json({
                success: false,
                message: 'El estudiante ya esta asignado a este curso'
            });
        }

        const conteoCursosAsignados = await AsignedCourse.countDocuments({
            student: student._id
        });

        if (conteoCursosAsignados >= 3) {
            return res.status(400).json({
                success: false,
                message: 'El estudiante solo puede estar asignado a máximo 3 cursos'
            });
        }

        const asigned = await AsignedCourse.create({
            ...data,
            student: student._id,
            email: student.email,
            course: course._id,
            name: course.name,
            role: "STUDENT_ROLE"
        });

        const details = {
            studentEmail: student.email,
            courseName: course.name,
        };

        res.status(200).json({
            success: true,
            message: 'Alumno asignado correctamente',
            asigned,
            details
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al asignar el curso al alumno',
            error
        });
    }
};

export const saveAsignedTeacher = async (req, res) => {
    try {
        const data = req.body;
        const teacher = await Teacher.findOne({ email: data.email });
        const course = await Course.findOne({ name: data.name.toLowerCase() });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }

        if (course.estado === false) {
            return res.status(400).json({
                success: false,
                message: 'El curso esta desactivado, no se puede asignar'
            });
        }

        const existeAsignacion = await AsignedCourse.findOne({
            teacher: teacher._id,
            course: course._id
        });

        if (existeAsignacion) {
            return res.status(400).json({
                success: false,
                message: 'El profesor ya esta asignado a este curso'
            });
        }

        const asigned = await AsignedCourse.create({
            ...data,
            teacher: teacher._id,
            email: teacher.email,
            course: course._id,
            name: course.name,
            role: "TEACHER_ROLE"
        });

        const details = {
            teacherEmail: teacher.email,
            courseName: course.name,
        };

        res.status(200).json({
            success: true,
            message: 'Profesor asignado correctamente',
            asigned,
            details
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al asignar el curso al profesor',
            error
        });
    }
};


export const getAsigned = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [ total, asignedCourse ] = await Promise.all([
            AsignedCourse.countDocuments(query),
            AsignedCourse.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            asignedCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting Asignations',
            error
        })
    }
}

export const getAsignedCourseById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const asignedCourse = await AsignedCourse.findById(id);

        if (asignedCourse.estado === false) {
            return res.status(400).json({
                success: false,
                message: 'El curso buscado no esta disponible'
            })
        }

        if (!asignedCourse) {
            return res.status(400).json({
                success: false,
                message: 'Asignation Course not found'
            });
        }

        res.status(200).json({
            success: true,
            asignedCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting asignation course by ID',
            error
        })
    }
}

export const getCoursesById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = req.teacher;
        const student = req.student;

        if (!teacher && !student) {
            return res.status(404).json({
                success: false,
                msg: "El usuario no es ni un estudiante ni un profesor"
            });
        }

        if (student && student._id.toString() !== id || teacher && teacher._id.toString() !== id) {
            return res.status(400).json({
                success: false,
                msg: "No tiene permisos para ver cursos de alguien más"
            });
        }

        if (student && student.role === "STUDENT_ROLE") {
            const asignedCourses = await AsignedCourse.find({ student: student._id });

            if (asignedCourses.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontraron cursos asignados para este estudiante'
                });
            }

            const courses = asignedCourses.map((asignedCourse) => ({
                courseId: asignedCourse.course.toString(),
                courseName: asignedCourse.name
            }));

            return res.status(200).json({
                success: true,
                total: asignedCourses.length,
                courses
            });

        } else if (teacher && teacher.role === "TEACHER_ROLE") {
            const asignedCourses = await AsignedCourse.find({ teacher: teacher._id });

            if (asignedCourses.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontraron cursos asignados para este profesor'
                });
            }

            const courses = asignedCourses.map((asignedCourse) => ({
                courseId: asignedCourse.course.toString(),
                courseName: asignedCourse.name
            }));

            return res.status(200).json({
                success: true,
                total: asignedCourses.length,
                courses
            });
        }

        return res.status(400).json({
            success: false,
            msg: "Rol no válido"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los cursos asignados',
            error
        });
    }
};

export const updateAsignedCourse = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, role, email, ...data } = req.body;
        let { name } = req.body;

        if (name) {
            name = name.toLowerCase();
            data.name = name;
        }

        if (email) {
            const student = await Student.findOne({ email });
            const teacher = await Teacher.findOne({ email });

            if (student) {

                data.student = student._id;
                data.teacher = undefined;
                data.role = "STUDENT_ROLE";
            
            } else if (teacher) {

                data.teacher = teacher._id;
                data.student = undefined;
                data.role = "TEACHER_ROLE";
            
            }
        }

        const course = await Course.findOne({ name });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }

        data.course = course._id;

        const updatedAsignedCourse = await AsignedCourse.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Asignacion actualizada correctamente',
            updatedAsignedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error actualizando la asignacion',
            error
        });
    }
};
