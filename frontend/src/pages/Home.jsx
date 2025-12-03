import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Card, List, Tag, Typography, Divider, Statistic } from 'antd';
import { fetchRecommendations } from '../api';
import LoadingState from '../components/LoadingState';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const [data, setData] = useState({ tracks: [], resources: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const progress = useSelector((state) => state.progress.items);

  const avgProgress = useMemo(() => {
    const values = Object.values(progress);
    if (!values.length) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [progress]);

  const fetchData = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchRecommendations();
      setData(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <LoadingState loading={loading} error={error} onRetry={fetchData}>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="今日推荐路线">
            <List
              grid={{ column: 2 }}
              dataSource={data.tracks}
              renderItem={(item) => (
                <List.Item>
                  <Card title={<Link to={`/tracks/${item.id}`}>{item.title}</Link>}>
                    <Typography.Paragraph ellipsis={{ rows: 2 }}>{item.summary}</Typography.Paragraph>
                    {item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                  </Card>
                </List.Item>
              )}
            />
          </Card>
          <Divider />
          <Card title="热门资源">
            <List
              itemLayout="horizontal"
              dataSource={data.resources}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Link to={`/resources/${item.id}`}>{item.title}</Link>}
                    description={item.description}
                  />
                  <Tag>{item.type}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="学习总览">
            <Statistic title="平均完成度" value={avgProgress} suffix="%" />
            <Divider />
            <Typography.Paragraph>通过路线卡片进入详情，可继续完成章节与实验。</Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </LoadingState>
  );
};

export default Home;
