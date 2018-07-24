import request from 'common/request'
import withCampus from './with-campus'
import withCache from 'common/api/with-cache'
// import { ACTIVITY_STATUS } from '../../common/config';

const apiWithCampus = withCampus({
  adminTeacherList: (criteria) => request('/home/user/dean/teacher/list', criteria, 'get'),
  adminTeacherSimpleList: (criteria) => request('/home/user/dean/teacher/simple-list', criteria, 'get'),
  adminTeacherDetail: (criteria) => request('/home//user/dean/teacher/detail', criteria, 'get'),
  //班级管理
  adminClassList: (criteria) => request('/home/campus/dean/class/list', criteria, 'get'),
  adminClassDetail: (criteria) => request('/home/campus/dean/class/detail', criteria, 'get'),
  adminClassAdd: (criteria) => request('/home/campus/dean/class/create', criteria, 'post'),
  adminClassUpdate: (criteria) => request('/home/campus/dean/class/update', criteria, 'post'),
  adminClassProgressList: (criteria) => request('/core/course/dean/course/list-class-switch', criteria, 'get'),
  adminClassProgressUpdate: (criteria) => request('/core/course/dean/course/update-class-switch', criteria, 'post'),
  adminLessonList: (criteria) => request('/core/course/dean/course/list-timetable', criteria, 'get'),
  adminLessonAdd: (criteria) => request('/core/course/dean/course/create-timetable', criteria, 'post'),
  adminLessonUpdate: (criteria) => request('/core/course/dean/course/update-timetable', criteria, 'post'),
  adminLessonDelete: (criteria) => request('/core/course/dean/course/delete-timetable', criteria, 'post'),
  adminLessonDetail: (criteria) => request('/home/campus/dean/class/detail', criteria, 'get'),
  //中心专业列表
  adminClassMajorList: (criteria) => request('/core/course/dean/major/list', criteria, 'get'),
  //班级列表
  adminClassMajorClassList: (criteria) => request('/core/course/dean/major/list-class', criteria, 'get'),

  adminNoticeList: (criteria) => request('/misc/notice/dean/dean/list', criteria, 'get'),
  adminNoticeUpdate: (criteria) => request('/misc/notice/dean/dean/update', criteria, 'post'),
  adminNoticeListDetail: (criteria) => request('/misc/notice/dean/dean/detail', criteria, 'post'),
  adminNoticeAdd: (criteria) => request('/misc/notice/dean/dean/create', criteria, 'post'),
  adminNoticeGetUserList: (criteria) => request('/misc/notice/admin/notice/user-list', criteria, 'get'),
  // 消息通知 （教务）
  adminMessageList: (criteria) => request('/misc/notice/dean/dean/get-list', criteria, 'get'),
  adminMessageDetail: (criteria) => request('/misc/notice/dean/dean/get-my-detail', criteria, 'get'),
  adminMessagUpdate: (criteria) => request('/misc/notice/dean/dean/set-my-notice', criteria, 'post'),
  adminMessageNoreadNoticeNumber: (criteria) => request('/misc/notice/dean/dean/get-my-noread-notice', criteria, 'get'),
  // 学员
  adminStudentList: (criteria) => request('/home/user/dean/student/list', criteria, 'get'),
  adminStudentDetail: (criteria) => request('/home/user/dean/student/detail', criteria, 'get'),
  adminStudentAdd: (criteria) => request('/home/user/dean/student/create', criteria, 'post'),
  adminStudentUpdate: (criteria) => request('/home/user/dean/student/update', criteria, 'post'),
  // 教务 问答
  systemDeanAnswerList: (criteria) => request('/core/course/dean/qa/list', criteria, 'get'),
  systemDeanAnswerDetail: (criteria) => request('/core/course/dean/qa/detail', criteria, 'get'),
  // 中心所有class
  adminCampusClassList: (criteria) => request('/home/campus/dean/campus/get-campus-class', criteria, 'get'),

  // 批量报档
  adminStudentCreateByFile: (criteria) => {
    var data = new FormData()
    Object.keys(criteria).forEach(key => data.append(key, criteria[key]))
    return request('/home/user/dean/student/create-by-file', data, 'post', false, 'multipart/form-data')
  },

  isFileExist: (criteria) => request('/core/resource/admin/resource/get-status', criteria, 'get'),
  adminNoreadNotice: (criteria) => request('/misc/notice/dean/dean/get-my-noread-notice', criteria, 'get')
})

export const api = {
  // 我的中心
  adminMyCampusList: (criteria) => request('/home/campus/dean/campus/dean-campus', criteria, 'get'),
  ...apiWithCampus
}


export const cachedApi = withCache(api)

export default api
