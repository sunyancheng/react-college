import CreateMajorCourse from './create-major-course'
import api from 'common/api'
import { isStudent } from 'user/store'

export default CreateMajorCourse({
  getCourseDetail: isStudent() ? api.studentCourseDetail : api.userCourseDetail,
  getCourseQAList: isStudent() ? api.studentCourseQAList : api.userCourseQAList,
  getHandouts: api.userGetHandouts,
  getVideo: api.userGetVideo,
  getExperiment: api.experimentDetail,
  getQa: api.userExamList
})
