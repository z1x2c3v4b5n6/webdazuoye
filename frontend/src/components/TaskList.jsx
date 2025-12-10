import React from 'react';
import { List, Tag, Button, Space, Typography, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

const stageColorMap = {
  cloud: 'blue',
  docker: 'volcano',
  k8s: 'purple'
};

const stageLabel = {
  cloud: '云计算基础',
  docker: 'Docker',
  k8s: 'K8s'
};

const TaskList = ({ tasks, onToggle, onEdit, onDelete }) => {
  return (
    <List
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item
          key={task.id}
          actions={[
            <Button key="toggle" type={task.done ? 'default' : 'primary'} onClick={() => onToggle(task.id)}>
              {task.done ? '标记未完成' : '完成'}
            </Button>,
            <Button key="edit" onClick={() => onEdit(task)}>编辑</Button>,
            <Popconfirm
              key="delete"
              title="确定删除该任务吗？"
              onConfirm={() => onDelete(task.id)}
            >
              <Button danger>删除</Button>
            </Popconfirm>
          ]}
        >
          <List.Item.Meta
            title={(
              <Space size="middle">
                <Typography.Text delete={task.done}>{task.title}</Typography.Text>
                <Tag color={stageColorMap[task.stage]}>{stageLabel[task.stage]}</Tag>
                {task.dueDate && <Tag color="cyan">截止 {task.dueDate}</Tag>}
              </Space>
            )}
            description={(
              <Space size="small" wrap>
                <Tag color={task.done ? 'green' : 'gold'}>{task.done ? '已完成' : '待完成'}</Tag>
                {task.linkedType && task.linkedId && (
                  <Link to={`/${task.linkedType === 'track' ? 'tracks' : 'resources'}/${task.linkedId}`}>
                    查看关联{task.linkedType === 'track' ? '专题' : '资源'}
                  </Link>
                )}
                {task.note && <Typography.Text type="secondary">备注：{task.note}</Typography.Text>}
              </Space>
            )}
          />
        </List.Item>
      )}
    />
  );
};

export default TaskList;
