import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, List, Tag, Typography, Divider, Progress, Button, Space, Result, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchRecommendations } from '../api';

const fallbackRecommendations = {
  tracks: [
    { id: 'track-basic-1', title: '云计算基础入门', summary: '理解云计算核心概念与服务模型。', tags: ['基础', '云计算'] },
    { id: 'track-docker-1', title: 'Docker 基础实战', summary: '从零搭建容器化环境，掌握镜像与网络。', tags: ['Docker', '容器'] }
  ],
  resources: [
    { id: 'res-article-1', title: '容器化快速上手', description: '通过示例了解容器镜像与运行时基础。', type: '文章' },
    { id: 'res-video-2', title: 'K8s 核心对象讲解', description: '视频讲解 Pod/Service/Deployment 关系。', type: '视频' },
    { id: 'res-lab-1', title: '部署第一个 Pod 实验', description: '在线实验指导，完成基础 Pod 部署。', type: '实验' }
  ]
};

const coreTracks = [
  { id: 'track-basic-1', title: '云计算基础' },
  { id: 'track-docker-1', title: 'Docker' },
  { id: 'track-k8s-1', title: 'K8s' }
];

const Home = () => {
  const [data, setData] = useState({ tracks: [], resources: [] });
  const [status, setStatus] = useState('loading');
  const [errorCode, setErrorCode] = useState(null);
  const progress = useSelector((state) => state.progress.items || {});
  const recentViews = useSelector((state) => state.ui.recentViews || []);

  const avgProgress = useMemo(() => {
    const values = Object.values(progress);
    if (!values.length) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [progress]);

  const loadData = async () => {
    try {
      setStatus('loading');
      setErrorCode(null);
      const res = await fetchRecommendations();
      const payload = res?.data || { tracks: [], resources: [] };
      setData(payload);
      const hasData = (payload.tracks?.length || 0) + (payload.resources?.length || 0) > 0;
      setStatus(hasData ? 'success' : 'empty');
    } catch (err) {
      setErrorCode(err?.response?.status || 500);
      setStatus('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderProgress = () => (
    <Row gutter={16}>
      {coreTracks.map((item) => (
        <Col span={8} key={item.id}>
          <Card size="small" title={item.title}>
            <Progress percent={progress[item.id] || 0} status={(progress[item.id] || 0) >= 100 ? 'success' : 'active'} />
            <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
              继续完成实验或章节，提升进度。
            </Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderRecommendationContent = (sourceTracks, sourceResources) => {
    const track = sourceTracks[0];
    const resources = sourceResources.slice(0, 2);
    if (!track && resources.length === 0) {
      return (
        <Empty description="暂无推荐" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Space>
            <Button type="primary"><Link to="/tracks">去查看路径</Link></Button>
            <Button><Link to="/resources">去资源库</Link></Button>
          </Space>
        </Empty>
      );
    }

    return (
      <Row gutter={16}>
        <Col span={12}>
          {track ? (
            <Card title={<Link to={`/tracks/${track.id}`}>{track.title}</Link>} extra={<Tag color="blue">Track</Tag>}>
              <Typography.Paragraph ellipsis={{ rows: 3 }}>{track.summary}</Typography.Paragraph>
              <Space wrap>{(track.tags || []).map((tag) => <Tag key={tag}>{tag}</Tag>)}</Space>
            </Card>
          ) : (
            <Empty description="暂无路径" />
          )}
        </Col>
        <Col span={12}>
          <List
            header={<Typography.Text strong>学习资源</Typography.Text>}
            dataSource={resources}
            renderItem={(item) => (
              <List.Item actions={[<Tag key={item.type}>{item.type}</Tag>]}> 
                <List.Item.Meta
                  title={<Link to={`/resources/${item.id}`}>{item.title}</Link>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    );
  };

  const renderRecent = () => {
    const list = recentViews.slice(0, 5);
    if (!list.length) {
      return (
        <Empty description="暂无浏览记录" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Space>
            <Button type="primary"><Link to="/tracks">探索路径</Link></Button>
            <Button><Link to="/resources">查看资源</Link></Button>
          </Space>
        </Empty>
      );
    }

    return (
      <List
        dataSource={list}
        renderItem={(item) => (
          <List.Item actions={[<Tag key={item.type}>{item.type === 'track' ? '路径' : '资源'}</Tag>]}> 
            <Link to={`/${item.type === 'track' ? 'tracks' : 'resources'}/${item.id}`}>{item.title}</Link>
          </List.Item>
        )}
      />
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="学习进度概览" extra={<Typography.Text type="secondary">平均完成度 {avgProgress}%</Typography.Text>}>
        {renderProgress()}
      </Card>

      {status === 'error' ? (
        <Card>
          <Result
            status="error"
            title="服务器数据加载失败"
            subTitle={`错误码：${errorCode || 500}`}
            extra={<Button type="primary" onClick={loadData}>重试</Button>}
          />
          <Divider orientation="left">离线降级推荐</Divider>
          {renderRecommendationContent(fallbackRecommendations.tracks, fallbackRecommendations.resources)}
        </Card>
      ) : (
        <Card title="今日推荐">
          {status === 'loading' && (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Spin />
            </div>
          )}
          {status === 'empty' && (
            <Empty description="暂无推荐" image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Space>
                <Button type="primary"><Link to="/tracks">去查看路径</Link></Button>
                <Button><Link to="/resources">去资源库</Link></Button>
              </Space>
            </Empty>
          )}
          {status === 'success' && renderRecommendationContent(data.tracks, data.resources)}
        </Card>
      )}

      <Card title="最近浏览">
        {renderRecent()}
      </Card>
    </Space>
  );
};

export default Home;
