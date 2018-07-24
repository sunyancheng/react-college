export const TEACHER_STATUS = [
  { value: '1', label: '正常', status: 'success' },
  { value: '2', label: '离职', status: 'default' },
  { value: '3', label: '休假', status: 'warning' }
]

export const USER_STATUS = [
  { value: '1', label: '正常', status: 'success' },
  { value: '2', label: '已冻结', status: 'default' },
]

export const USER_ROLE = [
  { value: '1', label: '注册用户' },
  { value: '2', label: '正式学员' },
  { value: '3', label: '老师' }
]

export const TEACHER_TITLE = [
  { value: '1', label: '认证讲师', url: 'https://p3.ssl.qhimg.com/t0173d779b2cba52f81.png' },
  { value: '2', label: '认证导师', url: 'https://p0.ssl.qhimg.com/t01efb36934d18fb60b.png' },
  { value: '3', label: '金牌导师', url: 'https://p5.ssl.qhimg.com/t01c1e5805032804df4.png' }
]

export const CENTER_STATUS = [
  { value: '1', label: '正常', status: 'success' },
  { value: '2', label: '中止', status: 'default' }
]

export const COURSE_PULICITY = [
  { value: '1', label: '公开' },
  { value: '2', label: '不公开' }
]

export const COURSE_CONFIG_STATUS = [
  { value: '1', label: '上架', status: 'success' },
  { value: '2', label: '下架', status: 'default' },
  { value: '3', label: '待审核', status: 'warning' }
]

export const COURSE_SWITCH_STATUS = [
  { value: '1', label: '有' },
  { value: '2', label: '无' },
]

export const MAJOR_CONFIG_STATUS = [
  { value: '1', label: '可用', status: 'success' },
  { value: '2', label: '不可用', status: 'default' },
]

export const COLLEGE_CONFIG_STATUS = MAJOR_CONFIG_STATUS
export const EXPERIMENT_STATUS = MAJOR_CONFIG_STATUS
export const TARGET_STATUS = MAJOR_CONFIG_STATUS
export const LECTURE_COMFIG_STATUS = MAJOR_CONFIG_STATUS
export const INVITATION_STATUS = MAJOR_CONFIG_STATUS
export const MODULE_STATUS = MAJOR_CONFIG_STATUS
export const MODULE_COURSE = MAJOR_CONFIG_STATUS

export const NOTICE_CONFIG_STATUS = [
  { value: '1', label: '已发布', status: 'success' },
  { value: '2', label: '待发布', status: 'warning' }
]


export const EXPERIMENT_LEVEL = [
  { value: '1', label: '初级', status: 'success', color: '#0FBF73' },
  { value: '2', label: '中级', status: 'warning', color: '#FFA500' },
  { value: '3', label: '高级', status: 'default', color: '#FF3B27' }
]
export const COURSE_LEVEL = [
  { value: '1', label: '初级', color: '#0FBF73' },
  { value: '2', label: '中级', color: '#FFA500' },
  { value: '3', label: '高级', color: '#FF3B27' }
]
export const TARGET_DETAIL_TYPE = [
  { value: '1', label: '终端-笔记本' },
  { value: '2', label: '终端-台式机' },
  { value: '3', label: '终端-服务器' },
  { value: '4', label: '终端-手机' },
  { value: '5', label: '网络-公有云' },
  { value: '6', label: '网络-私有云' },
  { value: '7', label: '路由-路由器' },
  { value: '8', label: '路由-交换机' },
  { value: '9', label: '路由-防火墙' },
];
export const TARGET_TYPE = [
  { value: '1', label: '终端', status: 'success' },
  { value: '2', label: '网络', status: 'warning' },
  { value: '3', label: '路由', status: 'default' },
]
export const TARGET_OS = [
  { value: '1', label: 'linux', status: 'success' },
  { value: '2', label: 'windows', status: 'warning' },
]

export const TARGET_CONNECT_TYPE = [
  { value: '1', label: 'rdp', status: 'success' },
  { value: '2', label: 'ssh', status: 'warning' },
]

export const TARGET_CONNECT_DETAIL = [
  { value: '1', label: 'rdp---nla', status: 'success' },
  { value: '2', label: 'rdp', status: 'warning' },
]

export const VIDEO_CONFIG_STATUS = [
  { value: '1', label: '上架', status: 'success' },
  { value: '2', label: '下架', status: 'default' },
  { value: '3', label: '待审核', status: 'warning' },
]

export const VIDEO_CHECK_STATUS = [
  { value: '1', label: '上架', status: 'success' },
  { value: '2', label: '下架', status: 'warning' },
]

export const INVITIED_USER_TYPE = [
  { value: '1', label: '注册用户', status: 'warning' },
  { value: '2', label: '正式学员', status: 'success' },
]

export const ACTIVITY_STATUS = [
  { value: '1', label: '打开', status: 'success' },
  { value: '2', label: '关闭', status: 'warning' },
]

export const ORDER_STATUS = [
  { value: '1', label: '支付成功', status: 'success' },
  { value: '2', label: '支付失败', status: 'danger' },
  { value: '3', label: '待支付', status: 'warning' },
  { value: '4', label: '已取消', status: 'default' },
  { value: '5', label: '重复支付', status: 'danger' },
  { value: '6', label: '待审核', status: 'danger' },
  { value: '7', label: '退款中', status: 'pending' },
  { value: '8', label: '已退款', status: 'success' },
  { value: '9', label: '退款失败', status: 'danger' },
]

export const REFUND_STATUS = [
  { value: '6', label: '待审核', status: 'danger' },
  { value: '7', label: '退款中', status: 'pending' },
  { value: '8', label: '已退款', status: 'success' },
  { value: '9', label: '退款失败', status: 'danger' }
]

export const ORDER_CHANNEL_TYPE = [
  { value: '1', label: '线下支付' },
  { value: '2', label: '支付中心' },
]

export const ORDER_PAY_TYPE = [
  { value: 'POS', label: 'POS刷卡' },
  { value: 'TRANSFER', label: '转账' },
  { value: 'OTHER', label: '其他' },
]

export const EXAM_STATUS = [
  { value: '1', label: '可用', status: 'success' },
  { value: '2', label: '不可用', status: 'warning' },
]

export const EXAM_TYPE = [
  { value: '1', label: '单选题' },
  { value: '2', label: '多选题' },
  { value: '3', label: '判断题' },
  { value: '4', label: '实验题' },
  // { value: '5', label: '问答题' },
]

export const EXAM_DIFFICULTY = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]

export const EXAM_ANSWER = [
  { value: 'T', label: '正确' },
  { value: 'F', label: '错误' },
]

export const EXERCISE_STATUS = [
  { value: '1', label: '可用', status: 'success' },
  { value: '2', label: '不可用', status: 'default' },
]

export const CLASS_STATUS = [
  { value: '1', label: '进行中', status: 'success' },
  { value: '2', label: '结业', status: 'warning' },
  { value: '3', label: '终止', status: 'warning' },
]

export const NUMBER = ['一', '二', '三', '四', '五', '六', '七', '八']

export const LESSON_CONFIG = [...Array(8).keys()].map((item, index) => ({ value: `${index + 1}`, label: `第${NUMBER[index]}节`, status: 'success' }))

export const STUDENT_STATUS = [
  { value: '1', label: '在读', status: 'success' },
  // 一期没有
  { value: '2', label: '结业', status: 'success' },
  { value: '3', label: '休学', status: 'success' },
  { value: '4', label: '转班', status: 'success' },
  { value: '5', label: '退费', status: 'success' },
  { value: '6', label: '待审核', status: 'warning' },
  { value: '7', label: '审核未通过', status: 'warning' },
]

export const DISABLED_STUDENT_STATUS = [
  { value: '6', label: '待审核', status: 'warning' },
  { value: '7', label: '审核未通过', status: 'warning' }
]

export const GENDER = [
  { value: '1', label: '男' },
  { value: '2', label: '女' },
]

export const ID_TYPE = [
  { value: '1', label: '身份证' },
  { value: '2', label: '军官证' },
  { value: '3', label: '护照' },
  { value: '4', label: '驾照' },
]

export const EDUCATION_BACKGROUND = [
  { value: '1', label: '中专' },
  { value: '2', label: '高中' },
  { value: '3', label: '大专' },
  { value: '4', label: '本科' },
  { value: '5', label: '硕士' },
  { value: '6', label: '博士' },
  { value: '7', label: '其它' },
]

export const WORKING_STATUS = [
  { value: '1', label: '在职' },
  { value: '2', label: '在读' },
  { value: '3', label: '待业' }
]
//学习进度挡板开关状态 1为开 2为关
export const CLASS_PROGRESS_STATUS_OPEN = '1'

export const YES_OR_NO = [
  { value: '1', label: '是' },
  { value: '2', label: '否' },
]
export const STUDENT_AUDIT_STATUS = [
  { value: '1', label: '通过' },
  { value: '7', label: '不通过' },
]

export const NOTICE_TYPE = [
  { value: '1', label: '通知' },
  { value: '2', label: '公告' }
]

export const ANSWER_STATUS = [
  { value: '1', label: '已回复', status: 'success' },
  { value: '2', label: '待回复', status: 'warning' }
]

export const TARGET_PIC = [
  { name: 'LAPTOP', type: '1', pic_url: 'https://p1.ssl.qhimg.com/t01a49b21a2a959ef70.png' },
  { name: 'DESKTOP', type: '2', pic_url: 'https://p1.ssl.qhimg.com/t01970babb137bf146f.png' },
  { name: 'SERVER', type: '3', pic_url: 'https://p0.ssl.qhimg.com/t0157ec8efa438f4657.png' },
  { name: 'PHONE', type: '4', pic_url: 'https://p5.ssl.qhimg.com/t0121ce172a6c8992f2.png' },
  { name: 'PUBLIC_CLOUD', type: '5', pic_url: 'https://p4.ssl.qhimg.com/t01f49f37b52c4a1ec2.png' },
  { name: 'PRIVATE_CLOUD', type: '6', pic_url: 'https://p1.ssl.qhimg.com/t01d8f08745ab4472a0.png' },
  { name: 'ROUTE', type: '7', pic_url: 'https://p2.ssl.qhimg.com/t01de7a9a4495914b70.png' },
  { name: 'SWITCH', type: '8', pic_url: 'https://p3.ssl.qhimg.com/t0112c07449bf4fccb2.png' },
  { name: 'FIREWALL', type: '9', pic_url: 'https://p5.ssl.qhimg.com/t01aa8aa9f8dec5bb7b.png' },
  { name: 'USER', type: '10', pic_url: 'https://p3.ssl.qhimg.com/t01c88ba3f49c5aafe2.png' },
  { name: 'PLATFORM', type: '11', pic_url: 'https://p4.ssl.qhimg.com/t016201be4b77e06b8a.png' },
];

export const ADMIN_NOTICE_TYPE = [
  { value: '2', label: '正式学员' },
  { value: '4', label: '中心老师' },
]
export const DEFAULT_TARGET_NODES = [{
  id: 'platform_user',
  target_id: 'platform_user',
  name: '访问者',
  detail_type: '10'
}, {
  id: 'platform',
  target_id: 'platform',
  name: '实训平台',
  detail_type: '11'
},];
export const DEFAULT_TARGET_EDGES = [{ from: 'platform_user', to: 'platform', id: 'default_edge' }]
export const ADMIN_MESSAGE_STATUS = [
  { value: '1', label: '已读' },
  { value: '2', label: '未读' },
]
export const MIRROR_DETAIL = {
  'linux': {
    os_type: '1',
    connect_type: '2',
    port: '22',
    connect_type_detail: ''
  },
  'windows': {
    os_type: '2',
    connect_type: '1',
    port: '3389',
    connect_type_detail: ''
  },
  'init': {
    os_type: '',
    connect_type: '',
    port: '',
    connect_type_detail: ''
  }
}
export const STUDENT_TITLE = [
  { value: '1', label: '注册用户' },
  { value: '2', label: '正式学员' },
]
export const COURSE_BADGE_PIC = [
  { value: '', label: '专业课', url: 'https://p3.ssl.qhimg.com/t012f9aca8c85fda16a.png' },
]
export const RESOURCE_TYPE = [{ id: '1', label: '讲义' }, { id: '2', label: '视频' }, { id: '3', label: '实验' }, { id: '4', label: '练习' }]
export const EXPERIMENT_WORK_STATUS = {
  Creating: 'Creating',
  CreateComplete: 'CreateComplete',
  CreateFailed: 'CreateFailed',
  Updating: 'Updating',
  UpdateComplate: 'UpdateComplate',
  UpdateFailed: 'UpdateFailed',
  Deleting: 'Deleting',
  DeleteFailed: 'DeleteFailed',
  DeleteSuccess: 'delete_success',
}
let env = process.env.APP_ENV;
if (env === 'production' && location.hostname.indexOf('beta.') > -1) {
  env = 'beta';
}
export const USER_EXPERIMENT_IDS = `${env.toUpperCase()}_USER_EXPERIMENT_IDS`
export const USER_EXPERIMENT_STATUS = `${env.toUpperCase()}_USER_EXPERIMENT_STATUS`
export const ADMIN_EXPERIMENT_IDS = `${env.toUpperCase()}_ADMIN_EXPERIMENT_IDS`
export const ADMIN_EXPERIMENT_STATUS = `${env.toUpperCase()}_ADMIN_EXPERIMENT_STATUS`
export const USER_EXPERIMENT_START_TIME = `${env.toUpperCase()}_USER_EXPERIMENT_START_TIME`
export const ADMIN_EXPERIMENT_START_TIME = `${env.toUpperCase()}_ADMIN_EXPERIMENT_START_TIME`
//创建topo图 可以生成vnc镜像的表达类型 即四个终端
export const TOPO_ENABLE_TYPES = ['1', '2', '3', '4']

export const EXPERIMENT_PROCESS_STATUS = [
  { value: '1', label: '已做', status: 'success' },
  { value: '2', label: '未做', status: 'omit' },
  { value: '3', label: '实验中', status: 'warning' },
]
export const NODE_ROLE = [
  { value: '1', label: '操作机' },
  { value: '2', label: '靶机' },
  { value: '3', label: '僚机' },
]

export const SCENE_STATUS = [
  { value: '1', label: '创建中', status: 'warning' },
  { value: '2', label: '进行中', status: 'success' },
  { value: '3', label: '异常', status: 'danger' },
  { value: '4', label: '进行中', status: 'success' },
  { value: '5', label: '进行中', status: 'success' },
  { value: '6', label: '异常', status: 'danger' },
  { value: '7', label: '已结束', status: 'success' },
  { value: '8', label: '异常', status: 'danger' },
]
export const SCENE_STATUS_FOR_QUERY = [
  { value: '1', label: '创建中', status: 'warning' },
  { value: '2', label: '进行中', status: 'success' },
  { value: '3', label: '已结束', status: 'warning' },
  { value: '4', label: '异常', status: 'danger' },
]
export const SCENE_ABNORMAL = [
  '2', '3', '4', '5', '6', '8'
]

export const ADVERTISE_STATUS = [
  { value: '1', label: '上架', status: 'success' },
  { value: '2', label: '下架', status: 'warning' },
]

export const ADVERTISE_TYPE = [
  { value: '1', label: '首页banner' },
]

export const BUY_SYATUS = [
  { value: '1', label: '学习中', status: 'success' },
  { value: '2', label: '已过期', status: 'warning' }
]

export const AUDIT_RESULT = [
  { value: '1', label: '通过' },
  { value: '2', label: '驳回' }
]
