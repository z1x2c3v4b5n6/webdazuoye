import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tag, Space, Button, Tabs, List, Empty } from 'antd';
import { fetchTrackDetail } from '../api';
import LoadingState from '../components/LoadingState';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addRecentView } from '../store/slices/uiSlice';

const TrackDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.tracks);
  const dispatch = useDispatch();

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchTrackDetail(id);
      setDetail(res.data);
      dispatch(addRecentView({ id: res.data.id, title: res.data.title, type: 'track' }));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const isFav = favorites.some((f) => f.id === id);

  return (
    <LoadingState loading={loading} error={error} onRetry={load}>
      {detail && (
        <Card
          title={detail.title}
          extra={<Button type={isFav ? 'primary' : 'default'} onClick={() => dispatch(toggleFavorite({ item: detail, itemType: 'track' }))}>{isFav ? '已收藏' : '收藏'}</Button>}
        >
          <Space wrap style={{ marginBottom: 12 }}>
            <Tag color={detail.level === '基础' ? 'blue' : 'purple'}>{detail.level}</Tag>
            {detail.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </Space>
          <Tabs
            items={[
              { key: 'overview', label: '概览', children: <p>{detail.summary}</p> },
              { key: 'chapters', label: '章节', children: (
                <List
                  dataSource={detail.chapters}
                  renderItem={(c) => (
                    <List.Item>
                      <List.Item.Meta title={c.title} description={c.lessons.join(' / ')} />
                    </List.Item>
                  )}
                />
              ) },
              { key: 'labs', label: '实验', children: detail.labs.length ? <List dataSource={detail.labs} renderItem={(lab) => <List.Item>{lab}</List.Item>} /> : <Empty description="暂无实验" /> },
              { key: 'related', label: '相关资源', children: (
                <List
                  dataSource={detail.relatedResources}
                  renderItem={(r) => (
                    <List.Item>
                      <List.Item.Meta title={r.title} description={r.description} />
                      <Tag>{r.type}</Tag>
                    </List.Item>
                  )}
                />
              ) }
            ]}
          />
        </Card>
      )}
    </LoadingState>
  );
};

export default TrackDetail;
