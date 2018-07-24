import React from 'react'
import Base from 'common/base'
import { PageLayout, PageHeader, PageContent } from 'common/page/page-layout'
import { baseURL } from 'common/request/config'
import { momentToString } from 'common/page/create-page-actions'
import PageFilter from 'common/page/page-filter'
import TableTreeWrapper from 'common/table-tree-wrapper'
import { VIDEO_CONFIG_STATUS, VIDEO_CHECK_STATUS } from 'common/config'
import actions from 'system/actions/video'
const { clearPage, initPage, getPage, showModal, hideModal } = actions
import { renderInput, renderRangePicker, renderSelect } from 'common/page/page-filter/filter'
import { BtnGroup, Btn } from 'common/button-group'
import Status from 'common/page/page-table-status'
import VideoBrand from 'common/page/page-table-video'
import FormModal, { FormModalCombine } from 'common/page/form-modal'
import ConfirmModal from 'common/page/confirm-modal'
import { IconButton } from 'common/button'
import Uploader from './video-uploader'
import Previewer from './previewer'
const { Cabinet } = PageContent;
import { Input } from 'antd'
import Tooltip from 'common/tooltip'
import { RadioGroup2 } from 'common/radio-group'
import api from 'common/api'
const { TextArea } = Input
import './video.less'

export default (class extends Base {
  state = {
    addMenuType: "",
    menuDeleteVisible: false,
    treeState: {}
  }

  componentDidMount = () => {
    this.dispatch(initPage(), getPage());
  }

  componentWillUnmount() {
    this.dispatch(clearPage());
  }

  modelFields = [
    {
      render({ props, dispatch }) {
        return props.form.getFieldDecorator('upload', { initialValue: { name: '', fname: '', duration: '' } })(
          <Uploader
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            isValid={({ json_fnames }) => actions.isVideoExist({ json_fnames })}
            actions={actions}
            uploadVideo={(files_json) => dispatch(actions.editDirectory({ pid: props.modalParams.uploadPid, files_json: JSON.stringify(files_json) }))}
          />
        )
      }
    }
  ]

  newModelFields = [
    {
      render({ props, dispatch }) {
        return props.form.getFieldDecorator('upload', { initialValue: { name: '', fname: '', duration: '' } })(
          <Uploader
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            isValid={({ json_fnames }) => actions.isVideoExist({ json_fnames })}
            actions={actions}
            uploadVideo={(files_json) => dispatch(actions.addVideo({ pid: props.modalParams.pid, files_json: JSON.stringify(files_json) }))}
          />
        )
      }
    }
  ]
  editModelFields = [
    {
      render({ props, dispatch }) {
        return props.form.getFieldDecorator('upload', { initialValue: { name: '', fname: '', duration: '' } })(
          <Uploader
            onLoading={(loading) => dispatch(actions.modalLoading(loading))}
            isValid={({ fname }) => api.systemVideoFileExist({ fname, video_id: props.modalParams.video_id })}
            actions={actions}
            uploadVideo={(files_json) => dispatch(actions.editVideo({ name: files_json[0].name, fname: files_json[0].fname, duration: files_json[0].duration, video_id: props.modalParams.video_id }))}
            editVideo
          />
        )
      }
    }
  ]

  checkModelFields = [
    {
      field: 'name',
      formItemProps: {
        label: '课程名称'
      },
      renderItem: 'static'
    }, {
      field: 'comment',
      formItemProps: {
        label: '审核意见'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '审核意见不能为空' },
        ],
      },
      renderItem() {
        return (<TextArea />)
      }
    }, {
      field: 'status',
      formItemProps: {
        label: '审核结果'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '审核结果不能为空' },
        ],
        validateTrigger: 'onChange'
      },
      renderItem() {
        return <RadioGroup2 options={VIDEO_CHECK_STATUS} getValue={i => i.value} getLabel={i => i.label} />
      }
    }
  ]


  newFolderModalFields = [
    {
      field: 'dir',
      formItemProps: {
        label: '文件夹名'
      },
      fieldDecorator: {
        rules: [
          { required: true, message: '文件夹名不能为空' },
          { pattern: /^\S{1,60}$/, message: '文件夹名不能超过60个字符' }
        ],
      }
    }
  ]

  previewModalFields = [
    {
      field: 'name',
      formItemProps: {
        label: '视频名称'
      },
      render({ state }) {
        const { name } = state.model
        return <Tooltip className="video-name" title={name} />
      }
    },
    {
      render({ state }) {
        return <Previewer url={state.model.url} />
      }
    }
  ]

  filters = [
    { label: '视频ID', name: 'video_id', render: renderInput },
    { label: '视频名称', name: 'name', render: renderInput },
    { label: '状态', name: 'status', options: VIDEO_CONFIG_STATUS, render: renderSelect },
    { label: '上传日期', name: 'range', render: renderRangePicker },
  ]

  data = {
    rootBuilder: () => {
      return (
        <TableTreeWrapper.Row>
          <TableTreeWrapper.Column fill>视频文件</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">视频ID</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">上传用户ID</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">上传时间</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">状态</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="150">操作</TableTreeWrapper.Column>
        </TableTreeWrapper.Row>
      );
    },
    nodeBuilder: (
      data,
    ) => {
      return (
        <TableTreeWrapper.Row>
          <TableTreeWrapper.Column fill>
            {<VideoBrand icon={`${data.type == 1 ? "video1" : "list-video-clips"}`}>
              {
                data.type == 1
                  ? <div onClick={() => this.previewMenu({ url: data.url, name: data.name })} className="video-play overflow">{data.name}</div>
                  : <div className="video-title overflow">{data.name}</div>
              }
            </VideoBrand>}
          </TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">{data.video_id}</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">{data.create_uid}</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">{data.ctime}</TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="100">
            {data.type == 1 && <Status config={VIDEO_CONFIG_STATUS} value={data.status} />}
          </TableTreeWrapper.Column>
          <TableTreeWrapper.Column width="150">
            <BtnGroup>
              {
                data.type == 2
                  ? (<Btn onClick={() => this.editMenu({ data, pid: data.video_id })}>添加</Btn>)
                  : (<Btn onClick={() => this.editVideo({ data })}>替换</Btn>)
              }
              {data.type != 2 && <Btn onClick={() => this.dispatch(showModal('check', data))}>审核</Btn>}
              <Btn type="danger" onClick={() => this.deleteMenu(data.video_id)}>删除</Btn>
            </BtnGroup>
          </TableTreeWrapper.Column>
        </TableTreeWrapper.Row>
      );
    }
  }

  buttons = [
    <IconButton key="dir" size="small" icon="add" onClick={() => { this.addDir({ videos: [] }) }}>添加文件夹</IconButton>,
    <IconButton key="file" size="small" icon="add" onClick={() => { this.addMenu() }}>添加视频</IconButton>,
  ]
  addMenu = (pid = '0', videos = []) => {
    this.dispatch(showModal('add', { pid, videos }));
  }

  editMenu = ({ data, pid = '0' }) => {
    this.dispatch(showModal('edit', { uploadPid: pid, videos: [], ...data }));
  }

  editVideo = ({ data }) => {
    this.dispatch(showModal('edit-video', { videos: [], ...data }))
  }

  deleteMenu = (video_id) => {
    this.dispatch(showModal('delete', { video_id }))
  }

  addDir = ({ videos = [] }) => {
    this.dispatch(showModal('add_dir', { videos }))
  }

  previewMenu = ({ url, name }) => {
    this.dispatch(showModal('preview', { url, name }))
  }

  initState = ({ modalParams }) => {
    const { video_id, type } = modalParams
    if (type == 2) {
      return actions.getVideos(video_id).then(list => ({
        model: modalParams,
        list
      }))
    }
    return Promise.resolve({
      model: modalParams
    })
  }

  checkInitState = async ({ modalParams }) => {
    return {
      model: modalParams
    }
  }

  previewInitState = ({ modalParams }) => {
    const { url, name } = modalParams
    return {
      model: {
        url,
        name
      }
    }
  }

  floderStatus = (list) => {
    return list.reduce((ret, item) => {
      if (item.type === '1') {
        return ret
      } else {
        return {
          ...ret,
          [item.video_id]: true
        }
      }
    }, {})
  }

  render() {
    const { isInit, data, queryCriteria } = this.props
    if (!isInit) {
      return null;
    }
    const { treeState } = this.state
    const list = data ? data.list : []
    return (
      <PageLayout>
        <PageHeader title="视频列表" btn={this.buttons} />
        <PageContent>
          {this.filters && this.filters.length &&
            <Cabinet>
              <PageFilter
                exportUrl="/core/resource/admin/video/export"
                handleQuery={() => this.setState({ treeState: false })}
                actions={actions}
                config={this.filters}
                isList
              />
            </Cabinet>
          }
          <TableTreeWrapper {...this.data}
            itemKey="video_id"
            model={{ children: list }}
            treeState={treeState === false ? this.floderStatus(list) : treeState}
            onTreeStateChange={ts => this.setState({ treeState: ts })}
          />
          <FormModal
            title="添加视频"
            name="add"
            modelFields={this.newModelFields}
            onCancel={() => this.dispatch(actions.modalLoading(false), actions.hideModal('add'))}
            className={'video-form-modal'}
          />
          <FormModal
            title="添加视频"
            name="edit"
            modelFields={this.modelFields}
            className={'video-form-modal'}
            onCancel={() => this.dispatch(actions.modalLoading(false), actions.hideModal('edit'))}
            initState={this.initState}
          />
          <FormModal
            title="修改单文件视频"
            name="edit-video"
            modelFields={this.editModelFields}
            className={'video-form-modal'}
            onCancel={() => this.dispatch(actions.modalLoading(false), actions.hideModal('edit-video'))}
          />
          <FormModal
            title="添加文件夹"
            name="add_dir"
            modelFields={this.newFolderModalFields}
            onCancel={() => this.dispatch(hideModal('add_dir'))}
            onSave={({ dir }) => this.dispatch(actions.addDirectory(dir))}
            initState={this.addInitState}
          />
          <FormModalCombine
            title="视频审核"
            name="check"
            modelFields={this.checkModelFields}
            onCancel={() => this.dispatch(hideModal('check'))}
            onSave={({ status, comment }, { video_id }) => this.dispatch(actions.checkVideo({ status, video_id, comment }))}
            initState={this.checkInitState}
          />
          <FormModal
            title="视频预览"
            name="preview"
            modelFields={this.previewModalFields}
            className={'video-form-modal'}
            onCancel={() => this.dispatch(hideModal('preview'))}
            initState={this.previewInitState}
          />
          <ConfirmModal
            title="操作提示"
            name="delete"
            message={"删除视频记录，视频文件会同步删除，请确认是否删除"}
            onCancel={() => this.dispatch(hideModal('delete'))}
            onSave={({ video_id }) => this.dispatch(actions.delete({ video_id }))}
          />
          <ConfirmModal
            title="操作提示"
            name="export"
            message={"确认导出数据？"}
            onCancel={() => this.dispatch(actions.hideModal('export'))}
            onSave={() => window.open(`${baseURL}/core/resource/admin/video/export?download=2&${queryCriteria}`, '_self')}
          />
        </PageContent>
      </PageLayout>
    )
  }
}).connect((state) => {
  const { modalLoading, modalVisible: visible, data, isInit, criteria = {} } = state.page
  var string = momentToString(criteria, 'YYYY-MM-DD');
  let queryCriteria = { ...criteria, ...string }
  queryCriteria = `${Object.keys(queryCriteria).map(key => `${key}=${queryCriteria[key]}`).join('&')}`
  return {
    visible,
    modalLoading,
    data,
    isInit,
    queryCriteria
  }
})
