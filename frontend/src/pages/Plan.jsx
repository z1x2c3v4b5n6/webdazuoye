import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext
} from 'react';
import {
  Card,
  Button,
  Space,
  Segmented,
  Row,
  Col,
  Statistic,
  Divider,
  Empty,
  Typography,
  Tag
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources, fetchTracks } from '../api';
import TaskEditor from '../components/TaskEditor';
import TaskList from '../components/TaskList';
import {
  addTask,
  updateTask,
  toggleTaskDone,
  removeTask
} from '../store/slices/planSlice';
import { ThemeContext } from '../context/ThemeContext';

const Plan = () => {
  const tasks = useSelector((state) => state.plan.tasks);
  const dispatch = useDispatch();
  const { notify } = useContext(ThemeContext);
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [resources, setResources] = useState([]);

  const loadOptions = useCallback(async () => {
    try {
      const [tRes, rRes] = await Promise.all([
        fetchTracks({ pageSize: 50 }),
        fetchResources({ pageSize: 80 })
      ]);
      setTracks(tRes?.data?.list || []);
      setResources(rRes?.data?.list || []);
    } catch (e) {
      // offline fallback，无需打断用户
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const stagePass = stageFilter === 'all' || task.stage === stageFilter;
    const statusPass = statusFilter === 'all' || (statusFilter === 'active' ? !task.done : task.done);
    return stagePass && statusPass;
  }), [tasks, stageFilter, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const completed = tasks.filter((t) => t.done);
    const completedThisWeek = completed.filter((t) => t.completedAt && new Date(t.completedAt) >= weekAgo).length;
    return {
      total: tasks.length,
      done: completed.length,
      completedThisWeek
    };
  }, [tasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setEditorOpen(true);
  };

  const handleSubmit = useCallback((payload) => {
    if (editingTask?.id) {
      dispatch(updateTask({ id: editingTask.id, changes: payload }));
      notify?.('任务已更新');
    } else {
      dispatch(addTask(payload));
      notify?.('新增任务已保存');
    }
    setEditorOpen(false);
    setEditingTask(null);
  }, [dispatch, editingTask, notify]);

  const handleToggle = useCallback((id) => {
    dispatch(toggleTaskDone(id));
    notify?.('任务状态已更新');
  }, [dispatch, notify]);

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setEditorOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    dispatch(removeTask(id));
    notify?.('任务已删除');
  }, [dispatch, notify]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card
        title="学习计划概览"
        extra={<Button type="primary" onClick={handleCreate}>新增任务</Button>}
      >
        <Row gutter={16}>
          <Col span={8}><Statistic title="总任务" value={stats.total} /></Col>
          <Col span={8}><Statistic title="已完成" value={stats.done} valueStyle={{ color: '#52c41a' }} /></Col>
          <Col span={8}><Statistic title="本周完成" value={stats.completedThisWeek} valueStyle={{ color: '#1890ff' }} /></Col>
        </Row>
      </Card>

      <Card title="筛选与阶段视图" extra={<Tag color="processing">三阶段闭环</Tag>}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <Typography.Text>阶段：</Typography.Text>
            <Segmented
              value={stageFilter}
              onChange={(val) => setStageFilter(val)}
              options={[
                { label: '全部', value: 'all' },
                { label: '云计算基础', value: 'cloud' },
                { label: 'Docker', value: 'docker' },
                { label: 'K8s', value: 'k8s' }
              ]}
            />
          </Space>
          <Space>
            <Typography.Text>状态：</Typography.Text>
            <Segmented
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { label: '待完成', value: 'active' },
                { label: '已完成', value: 'done' },
                { label: '全部', value: 'all' }
              ]}
            />
          </Space>
          <Divider style={{ margin: '12px 0' }} />
          {filteredTasks.length ? (
            <TaskList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <Empty description="暂无任务，点击右上角新增一个吧" />
          )}
        </Space>
      </Card>

      <TaskEditor
        open={editorOpen}
        onCancel={() => { setEditorOpen(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        initialValues={editingTask || { stage: stageFilter !== 'all' ? stageFilter : 'cloud' }}
        tracks={tracks}
        resources={resources}
      />
    </Space>
  );
};

export default Plan;
