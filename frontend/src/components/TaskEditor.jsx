import React, { useEffect } from 'react';
import {
  Modal, Form, Input, DatePicker, Select, Switch, Space
} from 'antd';
import dayjs from 'dayjs';

const stageOptions = [
  { label: '云计算基础', value: 'cloud' },
  { label: 'Docker', value: 'docker' },
  { label: 'K8s', value: 'k8s' }
];

const TaskEditor = ({
  open,
  onCancel,
  onSubmit,
  initialValues = {},
  tracks = [],
  resources = []
}) => {
  const [form] = Form.useForm();
  const linkedType = Form.useWatch('linkedType', form);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...initialValues,
        dueDate: initialValues.dueDate ? dayjs(initialValues.dueDate) : null,
        done: initialValues.done || false
      });
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit({
      ...initialValues,
      ...values,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : '',
      done: values.done || false,
      note: values.note || ''
    });
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues?.id ? '编辑任务' : '新增任务'}
      open={open}
      onOk={handleOk}
      onCancel={() => { form.resetFields(); onCancel?.(); }}
      okText="保存"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="任务标题" name="title" rules={[{ required: true, message: '请输入任务标题' }]}>
          <Input placeholder="例如：完成 Docker 镜像构建实验" />
        </Form.Item>
        <Form.Item label="阶段" name="stage" rules={[{ required: true, message: '请选择阶段' }]}>
          <Select options={stageOptions} placeholder="选择所属阶段" />
        </Form.Item>
      <Form.Item label="截止日期" name="dueDate">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="备注" name="note">
        <Input.TextArea rows={3} placeholder="记录补充信息" />
      </Form.Item>
      <Form.Item label="关联内容" required={false}>
        <Space.Compact block>
            <Form.Item name="linkedType" noStyle>
              <Select
                placeholder="关联类型"
                allowClear
                options={[
                  { label: '无', value: null },
                  { label: '专题 Track', value: 'track' },
                  { label: '资源 Resource', value: 'resource' }
                ]}
              />
            </Form.Item>
            <Form.Item name="linkedId" noStyle>
              <Select
                placeholder="选择关联项"
                allowClear
                options={((linkedType === 'resource') ? resources : tracks)
                  .map((item) => ({ label: item.title, value: item.id }))}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item label="标记完成" name="done" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskEditor;
