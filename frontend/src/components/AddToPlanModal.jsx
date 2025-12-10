import React, { useEffect, useMemo, useContext } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../store/slices/planSlice';
import { ThemeContext } from '../context/ThemeContext';

const stageOptions = [
  { label: '云计算基础', value: 'cloud' },
  { label: 'Docker', value: 'docker' },
  { label: 'K8s', value: 'k8s' }
];

const AddToPlanModal = ({ open, onClose, defaultTitle = '', defaultStage = 'cloud', linkedType, linkedId }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.plan.tasks || []);
  const { notify } = useContext(ThemeContext);
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: defaultTitle,
        stage: defaultStage,
        linkedType,
        linkedId,
        dueDate: null,
        note: ''
      });
    }
  }, [open, defaultStage, defaultTitle, linkedId, linkedType, form]);

  const existed = useMemo(
    () => tasks.find((t) => t.linkedType === linkedType && t.linkedId === linkedId),
    [tasks, linkedId, linkedType]
  );

  const handleSave = async () => {
    const values = await form.validateFields();
    const submit = () => {
      dispatch(
        addTask({
          ...values,
          linkedType,
          linkedId,
          dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : '',
          done: false,
          note: values.note || ''
        })
      );
      notify?.('已加入学习计划');
      onClose?.();
    };

    if (existed) {
      Modal.confirm({
        title: '已存在任务，是否仍添加？',
        onOk: submit
      });
      return;
    }
    submit();
  };

  return (
    <Modal
      title="加入学习计划"
      open={open}
      onOk={handleSave}
      onCancel={onClose}
      okText="保存"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="任务标题" name="title" rules={[{ required: true, message: '请输入任务标题' }]}>
          <Input placeholder="例如：完成 Docker 镜像练习" />
        </Form.Item>
        <Form.Item label="阶段" name="stage" rules={[{ required: true, message: '请选择阶段' }]}>
          <Select options={stageOptions} />
        </Form.Item>
        <Form.Item label="截止日期" name="dueDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="备注" name="note">
          <Input.TextArea rows={3} placeholder="可选，记录补充信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddToPlanModal;
