import CreateMajorCourse from 'user/routes/major/course/create-major-course'
import api from 'common/api'

export default CreateMajorCourse({
  getCourseDetail: api.teacherCourseDetail,
  getCourseQAList: api.userCourseQAList,
  getHandouts: api.userGetHandouts,
  getVideo: api.userGetVideo,
  getExperiment: api.userGetExperiment,
  getExam: api.userExamList,
  isTeacher: true
})
