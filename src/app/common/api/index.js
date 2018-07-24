import request from 'common/request'
import withCache from './with-cache'
export const api = {
  // userList
  systemUserList: (criteria) => request('/home/user/admin/user/list', criteria, 'get'),
  systemUserUpdate: (criteria) => request('/home/user/admin/user/update-status', criteria, 'get'),
  systemUserMemoUpdate: (criteria) => request('/home/user/admin/user/update-memo', criteria, 'get'),

  // 订单列表
  systemOrderList: (criteria) => request('/misc/order/admin/order/list', criteria, 'get'),
  systemOrderCheckUser: (criteria) => request('/misc/order/admin/order/check-user', criteria, 'get'),
  systemOrderAdd: (criteria) => request('/misc/order/admin/order/create', criteria, 'post'),
  // 订单列表-退款
  systemOrderOnlineRefund: (criteria) => request('/misc/order/admin/refund/create-online', criteria, 'get'),
  systemOrderOfflineRefund: (criteria) => request('/misc/order/admin/refund/create-offline', criteria, 'get'),
  systemOrderRefundDetail: (criteria) => request('/misc/order/admin/refund/detail', criteria, 'get'),
  systemOrderRefundCancel: (criteria) => request('/misc/order/admin/refund/cancel', criteria, 'get'),

  // 退款记录
  systemRefundList: (criteria) => request('/misc/order/admin/refund/list', criteria, 'get'),
  systemRefundAudit: (criteria) => request('/misc/order/admin/refund/audit', criteria, 'get'),
  systemRefundAck: (criteria) => request('/misc/order/admin/refund/ack', criteria, 'get'),

  // 教务列表
  systemDeanList: (criteria) => request('/home/user/admin/dean/list', criteria, 'get'),
  systemDeanAdd: (criteria) => request('/home/user/admin/dean/create', criteria, 'post'),
  systemDeanDetail: (criteria) => request('/home/user/admin/dean/detail', criteria, 'get'),
  systemDeanUpdate: (criteria) => request('/home/user/admin/dean/update', criteria, 'post'),
  systemDeanAssignCamp: (criteria) => request('/home/user/admin/dean/assign-campus', criteria, 'post'),
  // 老师列表
  systemTeacherList: (criteria) => request('/home/user/admin/teacher/list', criteria, 'get'),
  systemTeacherSimpleList: (criteria) => request('/home/user/admin/teacher/simple-list', criteria, 'get'),
  systemTeacherAdd: (criteria) => request('/home/user/admin/teacher/create', criteria, 'post'),
  systemTeacherDetail: (criteria) => request('/home/user/admin/teacher/detail', criteria, 'get'),
  systemTeacherUpdate: (criteria) => request('/home/user/admin/teacher/update', criteria, 'post'),
  // 实验列表
  systemExperimentList: (criteria) => request('/core/resource/admin/experiment/list', criteria, 'get'),
  systemExperimentListAll: (criteria = { pageSize: 100000 }) => request('/core/resource/admin/experiment/add-list', criteria, 'get'),
  systemExperimentAdd: (criteria) => request('/core/resource/admin/experiment/create', criteria, 'post'),
  systemExperimentDetail: (criteria) => request('/core/resource/admin/experiment/get-one', criteria, 'get'),
  systemExperimentUpdate: (criteria) => request('/core/resource/admin/experiment/update', criteria, 'post'),
  systemExperimentDelete: (criteria) => request('/core/resource/admin/experiment/delete', criteria, 'post'),
  systemExperimentUpdateTopo: (criteria) => request('/core/resource/admin/experiment/update-topo', criteria, 'post'),
  systemExperimentGetAllAvaliable: (criteria) => request('/core/resource/admin/experiment/get-all', criteria, 'get'),
  systemExprimentUpdateFileExists: (criteria) => request('/core/resource/admin/experiment/file-exists', criteria, 'get'),
  // 标靶管理
  systemTargetList: (criteria) => request('/core/resource/admin/target/list', criteria, 'get'),
  systemTargetListAll: (criteria) => request('/core/resource/admin/target/list-all', criteria, 'get'),
  systemTargetAdd: (criteria) => request('/core/resource/admin/target/create', criteria, 'post'),
  systemTargetDetail: (criteria) => request('/core/resource/admin/target/get-one', criteria, 'get'),
  systemTargetUpdate: (criteria) => request('/core/resource/admin/target/update', criteria, 'post'),
  systemTargetDelete: (criteria) => request('/core/resource/admin/target/delete', criteria, 'post'),
  systemTargetGetSelect: (criteria) => request('/core/resource/admin/target/get-select', criteria, 'post'),
  systemTargetGetMirrorDetail: (criteria) => request('/core/resource/admin/target/get-mirr-detail', criteria, 'post'),
  // 课程中心
  systemTeacherAssignCamp: (criteria) => request('/home/user/admin/teacher/assign-campus', criteria, 'post'),
  systemTeacherAssignCourse: (criteria) => request('/home/user/admin/teacher/update-auth-course', criteria, 'post'),
  // 课程权限
  systemTeacherCourseAuth: (criteria) => request('/home/user/admin/teacher/auth', criteria, 'post'),
  // 课程配置
  systemCourseList: (criteria) => request('/core/course/admin/course/list', criteria, 'get'),
  systemCourseAuthList: (criteria) => request('/core/course/admin/course/list-auth-course', criteria, 'get'),
  systemCourseDetail: (criteria) => request('/core/course/admin/course/detail', criteria, 'get'),
  systemCourseUpdate: (criteria) => request('/core/course/admin/course/update', criteria, 'post'),
  systemCourseAdd: (criteria) => request('/core/course/admin/course/create', criteria, 'post'),
  systemCourseGetCourseOpts: (criteria) => request('/core/course/admin/college/list-all', criteria, 'get'),
  systemCourseAudit: (criteria) => request('/core/course/admin/course/audit', criteria, 'post'),
  systemCourseResource: (criteria) => request('/core/course/admin/course/list-resources', criteria, 'get'),
  // 配置模块
  systemModuleList: (criteria) => request('/core/course/admin/module/list', criteria, 'get'),
  systemModuleDelete: (criteria) => request('/core/course/admin/module/delete', criteria, 'get'),
  systemModuleAdd: (criteria) => request('/core/course/admin/module/create', criteria, 'post'),
  systemModuleUpdate: (criteria) => request('/core/course/admin/module/update', criteria, 'post'),
  // 模块内课程
  systemModuleCourseList: (criteria) => request('/core/course/admin/module-course/course-list', criteria, 'get'),
  systemModuleCourseAdd: (criteria) => request('/core/course/admin/module-course/course-create', criteria, 'post'),
  systemModuleCourseUpdate: (criteria) => request('/core/course/admin/module-course/course-update', criteria, 'post'),
  systemModuleCourseDelete: (criteria) => request('/core/course/admin/module-course/course-delete', criteria, 'get'),
  // 专业配置
  systemMajorList: (criteria) => request('/core/course/admin/major/list', criteria, 'get'),
  systemMajorUpdate: (criteria) => request('/core/course/admin/major/update', criteria, 'post'),
  systemMajorAdd: (criteria) => request('/core/course/admin/major/create', criteria, 'post'),
  // 学院配置
  systemCollegeList: (criteria) => request('/core/course/admin/college/list', criteria, 'get'),
  systemCollegeUpdate: (criteria) => request('/core/course/admin/college/update', criteria, 'post'),
  systemCollegeAdd: (criteria) => request('/core/course/admin/college/create', criteria, 'post'),
  // 中心
  systemCenterList: (criteria) => request('/home/campus/admin/campus/list', criteria, 'get'),
  systemCenterUpdate: (criteria) => request('/home/campus/admin/campus/update', criteria, 'post'),
  systemCenterMemoDetail: (criteria) => request('/home/campus/admin/campus/detail', criteria, 'get'),
  systemCenterAdd: (criteria) => request('/home/campus/admin/campus/create', criteria, 'post'),
  systemCenterAuditOpts: (criteria) => request('/core/course/admin/major/list-campus-major', criteria, 'get'),
  systemCenterAuditUpdate: (criteria) => request('/core/course/admin/major/update-campus-major', criteria, 'post'),
  // 讲义
  systemLectureList: (criteria) => request('/core/resource/admin/handouts/list', criteria, 'get'),
  systemLectureListAll: (criteria = { pageSize: 100000 }) => request('/core/resource/admin/handouts/add-list', criteria, 'get'),
  systemLectureUpdate: (criteria) => request('/core/resource/admin/handouts/update', criteria, 'get'),
  systemLectureAdd: (criteria) => request('/core/resource/admin/handouts/add', criteria, 'post'),
  systemLectureDelete: (criteria) => request('/core/resource/admin/handouts/delete', criteria, 'get'),
  systemLectureHandoutsFileExists: (criteria) => request('/core/resource/admin/handouts/file-exists', criteria, 'get'),
  // 菜单
  systemMenuList: (criteria) => request('/home/sys/admin/menu/list', criteria, 'get'),
  systemMenuUpdate: (criteria) => request('/home/sys/admin/menu/update', criteria, 'post'),
  systemMenuAdd: (criteria) => request('/home/sys/admin/menu/create', criteria, 'post'),
  systemMenuDelete: (criteria) => request('/home/sys/admin/menu/delete', criteria, 'post'),
  systemMenuDownOrder: (criteria) => request('/home/sys/admin/menu/down-order', criteria, 'post'),
  systemMenuUpOrder: (criteria) => request('/home/sys/admin/menu/up-order', criteria, 'post'),
  systemUserMenus: (criteria) => request('/home/user/admin/manage/menus', criteria, 'get'),

  // 角色
  systemManageRoleList: (criteria) => request('/home/user/admin/manage-role/list', criteria, 'get'),
  systemManageRoleAdd: (criteria) => request('/home/user/admin/manage-role/create', criteria, 'post'),
  systemManageRoleUpdate: (criteria) => request('/home/user/admin/manage-role/update', criteria, 'post'),
  systemManageRoleDelete: (criteria) => request('/home/user/admin/manage-role/delete', criteria, 'post'),

  // 获取用户授权菜单
  systemManageRoleMenus: (criteria) => request('/home/user/admin/manage/menus', criteria, 'get'),


  // 管理员
  systemManageAdminList: (criteria) => request('/home/user/admin/manage/list', criteria, 'get'),
  systemManageAdminAdd: (criteria) => request('/home/user/admin/manage/create', criteria, 'get'),
  systemManageAdminUpdate: (criteria) => request('/home/user/admin/manage/update', criteria, 'post'),
  systemManageAdminDelete: (criteria) => request('/home/user/admin/manage/delete', criteria, 'get'),
  // 公告
  systemNoticeList: (criteria) => request('/misc/notice/admin/notice/list', criteria, 'get'),
  systemNoticeListDetail: (criteria) => request('/misc/notice/admin/notice/detail', criteria, 'get'),
  systemNoticeUpdate: (criteria) => request('/misc/notice/admin/notice/update', criteria, 'post'),
  systemNoticeDelete: (criteria) => request('/misc/notice/admin/notice/delete', criteria, 'get'),
  systemNoticeGetUserList: (criteria) => request('/misc/notice/admin/notice/user-list', criteria, 'get'),
  systemNoticeCreate: (criteria) => request('/misc/notice/admin/notice/create', criteria, 'post'),
  // 邀请码
  systemInvitationList: (criteria) => request('/misc/invitation/admin/invitation/list', criteria, 'get'),
  systemInvitationAdd: (criteria) => request('/misc/invitation/admin/invitation/create', criteria, 'post'),
  systemInvitationDelete: (criteria) => request('/misc/invitation/admin/invitation/delete', criteria, 'post'),
  systemInvitationUpdate: (criteria) => request('/misc/invitation/admin/invitation/update', criteria, 'post'),
  // 问答
  systemAnswerList: (criteria) => request('/core/course/admin/qa/list', criteria, 'get'),
  systemAnswerDetail: (criteria) => request('/core/course/admin/qa/detail', criteria, 'get'),
  systemAnswerDelete: (criteria) => request('/core/course/admin/qa/delete', criteria, 'get'),
  // 邀请列表
  systemInvitiedUserList: (criteria) => request('/misc/invitation/admin/invitation/list-invited-user', criteria, 'get'),

  // 获取二维码
  getQRCode: (criteria) => request('/misc/invitation/admin/invitation/qrcode', criteria, 'get'),

  // 活动
  systemActivityList: (criteria) => request('/misc/activity/admin/activity/list', criteria, 'get'),
  systemActivityAdd: (criteria) => request('/misc/activity/admin/activity/create', criteria, 'post'),
  systemActivityDelete: (criteria) => request('/misc/activity/admin/activity/delete', criteria, 'post'),
  systemActivityUpdate: (criteria) => request('/misc/activity/admin/activity/update', criteria, 'post'),

  // 视频
  systemVideoList: (criteria) => request('/core/resource/admin/video/list-all', criteria, 'get'),
  systemVideoListAll: (criteria = { pageSize: 100000 }) => request('/core/resource/admin/video/add-list', criteria, 'get'),
  systemVideoExist: (criteria) => request('/core/resource/admin/video/is-exist', criteria, 'get'),
  systemVideoFileExist: (criteria) => request('/core/resource/admin/video/file-exists', criteria, 'get'),
  systemVideoAdd: (criteria) => request('/core/resource/admin/video/add', criteria, 'post'),
  systemVideoUpdate: (criteria) => request('/core/resource/admin/video/update', criteria, 'post'),
  systemVideoDelete: (criteria) => request('/core/resource/admin/video/delete', criteria, 'get'),
  systemVideoDirectoryGetVideos: (criteria) => request('/core/resource/admin/video/get-videos', criteria, 'get'),
  systemVideoAddDirectory: (criteria) => request('/core/resource/admin/video/add-dir', criteria, 'get'),
  systemVideoCheck: (criteria) => request('/core/resource/admin/video/check', criteria, 'post'),
  // 题库 试题列表
  systemExamList: (criteria) => request('/core/resource/admin/exam-pool/list', criteria, 'get'),
  systemExamUpdate: (criteria) => request('/core/resource/admin/exam-pool/update', criteria, 'post'),
  systemExamDelete: (criteria) => request('/core/resource/admin/exam-pool/delete', criteria, 'get'),
  systemExamAdd: (criteria) => request('/core//resource/admin/exam-pool/add', criteria, 'post'),
  systemExamGetAll: (criteria) => request('/core/resource/admin/exam-pool/get-all', criteria, 'get'),
  systemExamAddFile: (criteria) => {
    var data = new FormData()
    Object.keys(criteria).forEach(key => data.append(key, criteria[key]))
    return request('/core/resource/admin/exam-pool/add-by-file', data, 'post', false, 'multipart/form-data')
  },
  // 题库 练习列表
  systemExerciseList: (criteria) => request('/core/resource/admin/exam/list', criteria, 'get'),
  systemExerciseListAll: (criteria = { pageSize: 100000 }) => request('/core/resource/admin/exam/add-list', criteria, 'get'),
  systemExerciseAdd: (criteria) => request('/core/resource/admin/exam/add', criteria, 'post'),
  systemExerciseDelete: (criteria) => request('/core/resource/admin/exam/delete', criteria, 'get'),
  systemExerciseIsIdValid: (criteria) => request('/core/resource/admin/exam-pool/get-by-ids', criteria, 'get'),
  systemExerciseUpdate: (criteria) => request('/core/resource/admin/exam/update', criteria, 'post'),
  systemExerciseGetOne: (criteria) => request('/core/resource/admin/exam/get-one', criteria, 'get'),
  // 题库 练习记录
  systemExerciseRecordList: (criteria) => request('/core/resource/admin/exam/student-exam-list', criteria, 'get'),
  systemExerciseRecordDelete: (criteria) => request('/core/resource/admin/exam/delete-user-resource', criteria, 'get'),
  systemExerciseRecordCheck: (criteria) => request('/core/resource/admin/exam/get-one-student-exam', criteria, 'get'),

  systemStudentList: (criteria) => request('/home/user/admin/student/list', criteria, 'get'),
  systemStudentDetail: (criteria) => request('/home/user/admin/student/detail', criteria, 'get'),
  systemStudentUpdate: (criteria) => request('/home/user/admin/student/update-status', criteria, 'get'),
  systemStudentAudit: (criteria) => request('/home/user/admin/student/audit', criteria, 'get'),
  systemStudentStatusList: (criteria) => request('/home/user/admin/student/get-update-status-list', criteria, 'get'),
  systemStudentGetStatusLabels: (criteria) => request('/home/user/admin/student/get-update-status-labels', criteria, 'get'),

  systemExperimentCreateScene: (criteria) => request('/core/resource/admin/experiment/create-scene', criteria, 'post'),
  systemExperimentStopScene: (criteria) => request('/core/resource/admin/experiment/complete-scene', criteria, 'post'),
  systemExperimentSceneDetail: (criteria) => request('/core/resource/admin/experiment/get-detail', criteria, 'get'),
  systemExperimentKeepAlive: (criteria) => request('/core/resource/admin/experiment/heart-beat-experiment', criteria, 'post'),
  systemExperimentVNC: (criteria) => request('/core/resource/admin/experiment/get-vnc-url', criteria, 'post'),

  adminTeacherList: (criteria) => request('/home/user/dean/teacher/list', criteria, 'get'),
  adminTeacherDetail: (criteria) => request('/home//user/dean/teacher/detail', criteria, 'get'),
  // 消息通知 （教务）
  adminMessageList: (criteria) => request('/misc/notice/dean/dean/list', criteria, 'get'),
  //
  adminDeanCampusList: (criteria) => request('/home/campus/dean/campus/dean-campus', criteria, 'get'),
  // 看板
  userDashboard: () => request('/core/course/student/course/dashboard', undefined, 'get'),
  userDashboardInfoDetail: () => request('/home/user/user/user/detail', undefined, 'get'),
  userDashboardNotice: () => request('/misc/notice/student/student/get-one-notice', undefined, 'get'),
  // 专业
  userMajor: () => request('/core/course/student/major/detail', undefined, 'get'),
  // 课程
  studentCourseDetail: (criteria) => request('/core/course/student/course/detail', criteria, 'get'),
  studentCourseQAList: (criteria) => request('/core/course/student/qa/list-recommend', criteria, 'post'),
  userCourseDetail: (criteria) => request('/core/course/user/course/detail', criteria, 'get'),
  userCourseQAList: (criteria) => request('/core/course/user/qa/list-recommend', criteria, 'post'),
  userCourseQACreate: (criteria) => request('/core/course/student/qa/create', criteria, 'post'),
  userGetHandouts: (criteria) => request('/core/course/user/resource/get-handouts', criteria, 'get'),
  userGetVideo: (criteria) => request('/core/course/user/resource/get-video', criteria, 'get'),
  userGetExperiment: (criteria) => request('/core/course/user/resource/get-experiment', criteria, 'get'),
  userExamList: (criteria) => request('/core/course/user/resource/list-exam', criteria, 'get'),
  // 通过手机号检测学员信息
  teacherCourseDetail: (criteria) => request('/core/course/teacher/course/detail', criteria, 'get'),
  teacherCourseQAList: (criteria) => request('/core/course/teacher/qa/list-teacher', criteria, 'get'),
  adminCheckPhoneAccount: (criteria) => request('/home/user/admin/user/get-by-account', criteria, 'get'),
  deanCheckPhoneAccount: (criteria) => request('/home/user/dean/student/get-by-account', criteria, 'get'),
  isFileExist: (criteria) => request('/core/resource/admin/resource/get-status', criteria, 'get'),
  getBankList: (criteria) => request('/misc/order/admin/order/get-bank-list', criteria, 'get'),
  getModuleList: (criteria) => request('/core/course/admin/course/simple-list', criteria, 'get'),
  bindResource: (criteria) => request('/core/course/admin/course/bind-resources', criteria, 'post'),
  getMyNoreadNotice: (criteria) => request('/misc/notice/user/user/get-my-noread-notice', criteria, 'get'),

  // 学员注册
  userRegister: (criteria) => request('/home/user/user/user/update', criteria, 'post'),
  getUserDetail: (criteria) => request('/home/user/user/user/detail', criteria, 'get'),
  updateUserAvatar: (criteria) => request('/home/user/user/user/update-avatar', criteria, 'get'),
  userQAList: (criteria) => request('/core/course/student/qa/list-student', criteria, 'get'),
  userQAListDetail: (criteria) => request('/core/course/student/qa/detail-student', criteria, 'get'),
  userCurriculumList: (criteria) => request('/core/course/student/course/list-timetable', criteria, 'get'),
  getPublicCourseList: (criteria) => request('/core/course/teacher/course/list-teacher-course', criteria, 'get'),
  //teacher 教学管理
  teacherCurriculumList: (criteria) => request('/core/course/teacher/course/list-timetable', criteria, 'get'),
  teacherClassList: (criteria) => request('/home/campus/teacher/class/get-teacher-class', criteria, 'get'),
  teacherClassStudentList: (criteria) => request('/home/campus/teacher/class/get-student', criteria, 'get'),
  teacherClassStudentDetail: (criteria) => request('/home/campus/teacher/class/student-detail', criteria, 'get'),
  teacherClassStudentResourceDetail: (criteria) => request('/core/course/teacher/course/student-resource-count', criteria, 'get'),
  teacherQAList: (criteria) => request('/core/course/teacher/qa/list-teacher', criteria, 'get'),
  teacherQADetail: (criteria) => request('/core/course/teacher/qa/detail-teacher', criteria, 'get'),
  teacherQAAnswer: (criteria) => request('/core/course/teacher/qa/update-teacher', criteria, 'post'),
  getTeacherInfo: (criteria) => request('/home/campus/teacher/teacher/info', criteria, 'get'),

  teacherMessageList: (criteria) => request('/misc/notice/teacher/teacher/get-list', criteria, 'get'),
  teacherMessageDetail: (criteria) => request('/misc/notice/teacher/teacher/get-my-detail', criteria, 'get'),
  teacherGetNoReadNotice: (criteria) => request('/misc/notice/teacher/teacher/get-my-noread-notice', criteria, 'get'),
  updateTeacherNoticeStatus: (criteria) => request('/misc/notice/teacher/teacher/set-my-notice', criteria, 'get'),

  // 正式学员
  // 正式学员-公告
  studentMessageList: (criteria) => request('/misc/notice/student/student/get-list', criteria, 'get'),
  studentMessageDetail: (criteria) => request('/misc/notice/student/student/get-my-detail', criteria, 'get'),
  studentGetNoReadNotice: (criteria) => request('/misc/notice/student/student/get-my-noread-notice', criteria, 'get'),
  updateStudentNoticeStatus: (criteria) => request('/misc/notice/student/student/set-my-notice', criteria, 'get'),
  // 正式学员-订单
  getStudentOrderList: (criteria) => request('/misc/order/student/order/list', criteria, 'get'),
  // 正式学员-实验
  getStudentExperimentList: (criteria) => request('/core/course/student/resource/list-experiment', criteria, 'get'),
  // 正式学员-练习
  getStudentExerciseList: (criteria) => request('/core/course/student/resource/list-exam', criteria, 'get'),
  getStudentExamDetail: (criteria) => request('/core/course/user/resource/exam', criteria, 'get'),
  getStudentFirstExam: (criteria) => request('/core/course/user/resource/get-exam-result', criteria, 'get'),
  // 正式学员-练习提交
  submitStudentExam: (criteria) => request('/core/course/user/resource/submit-exam', criteria, 'post'),
  // 注册用户
  // 注册用户-公告
  userMessageList: (criteria) => request('/misc/notice/user/user/get-list', criteria, 'get'),
  userMessageDetail: (criteria) => request('/misc/notice/user/user/get-my-detail', criteria, 'get'),
  userGetNoReadNotice: (criteria) => request('/misc/notice/user/user/get-my-noread-notice', criteria, 'get'),
  updateUserNoticeStatus: (criteria) => request('/misc/notice/user/user/set-my-notice', criteria, 'get'),
  // 注册用户-订单
  getUserOrderList: (criteria) => request('/misc/order/user/order/list', criteria, 'get'),
  // 注册用户-实验
  getUserExperimentList: (criteria) => request('/core/course/user/resource/list-experiment', criteria, 'get'),

  experimentStart: (criteria) => request('/core/course/user/resource/create-experiment', criteria, 'post'),
  experimentRestart: (criteria) => request('/core/course/user/resource/reopen-experiment', criteria, 'post'),
  experimentStop: (criteria) => request('/core/course/user/resource/complete-experiment', criteria, 'post'),
  experimentDelay: (criteria) => request('/core/course/user/resource/delayed-experiment', criteria, 'post'),
  experimentSceneDetail: (criteria) => request('/core/course/user/resource/get-detail-experiment', criteria, 'post'),
  experimentDetail: (criteria) => request('/core/course/user/resource/get-experiment', criteria, 'post'),
  experimentVNC: (criteria) => request('/core/course/user/resource/get-vnc-url', criteria, 'post'),
  experimentKeepAlive: (criteria) => request('/core/course/user/resource/heart-beat-experiment', criteria, 'post'),
  // 已学课程
  getUserListLearn: (criteria) => request('/core/course/user/course/list-learn', criteria, 'get'),
  getStudentListLearn: (criteria) => request('/core/course/student/course/list-learn', criteria, 'get'),
  //场景管理
  getSceneList: (criteria) => request('/core/resource/admin/user-experiment/list', criteria, 'get'),
  getSceneEnd: (criteria) => request('/core/resource/admin/experiment/destroy-scene', criteria, 'get'),

  // 广告列表
  advertiseList: (criteria) => request('/misc/ad/admin/ad/list', criteria, 'get'),
  advertiseExport: (criteria) => request('/misc/ad/admin/ad/export', criteria, 'get'),
  advertiseAdd: (criteria) => request('/misc/ad/admin/ad/create', criteria, 'post'),
  advertiseUpdate: (criteria) => request('/misc/ad/admin/ad/update', criteria, 'post'),
  advertiseDetail: (criteria) => request('/misc/ad/admin/ad/detail', criteria, 'get'),
  advertiseDelete: (criteria) => request('/misc/ad/admin/ad/delete', criteria, 'get'),
  advertiseTypeList: (criteria) => request('/misc/ad/admin/ad-type/list', criteria, 'get'),
  // 购买记录
  systemBuyList: (criteria) => request('/core/course/admin/buy/list', criteria, 'get'),
  systemBuyUpdate: (criteria) => request('/core/course/admin/buy/add-time', criteria, 'get')
}
export const cachedApi = withCache(api)

export default api

