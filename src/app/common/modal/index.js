import { Modal } from 'antd';
import React from 'react';
import Draggable from './draggable';

const DraggableModal = props => {
  return (
    <Draggable><Modal maskClosable={false} {...props} /></Draggable>
  );
}

DraggableModal.info = Modal.info;
DraggableModal.success = Modal.success;
DraggableModal.error = Modal.error;
DraggableModal.warn = Modal.warn;
DraggableModal.warning = Modal.warning;
DraggableModal.confirm = Modal.confirm;
export default DraggableModal;
