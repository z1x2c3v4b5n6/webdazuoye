import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Progress, List, Tag } from 'antd';
import LoadingState from '../components/LoadingState';
import { fetchPaths } from '../api';
import { useSelector } from 'react-redux';

const Paths = () => {
  const [data, setData] = useState({ roadmap: [], tracks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const progress = useSelector((state) => state.progress.items);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchPaths();
      setData(res.data);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <LoadingState loading={loading} error={error} onRetry={load}>
      <Row gutter={16}>
        {data.roadmap.map((stage) => (
          <Col span={8} key={stage.key}>
            <Card title={stage.title} extra={<Tag color="blue">阶段</Tag>}>
              <p>{stage.description}</p>
              <Progress percent={Math.round(stage.trackIds.reduce((sum, id) => sum + (progress[id] || 0), 0) / stage.trackIds.length || 0)} />
              <List
                size="small"
                dataSource={stage.trackIds}
                renderItem={(id) => {
                  const track = data.tracks.find((t) => t.id === id);
                  return <List.Item>{track?.title}</List.Item>;
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </LoadingState>
  );
};

export default Paths;
