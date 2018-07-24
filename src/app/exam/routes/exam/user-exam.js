import CreateExam from './create-exam'


const getRole = (role) => role.includes(2) ? 2 : 1

export default CreateExam({getRole})
