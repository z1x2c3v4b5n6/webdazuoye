import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Tag, Space, Button, Tabs, List, Empty } from 'antd';
import { fetchResourceDetail } from '../api';
import LoadingState from '../components/LoadingState';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addRecentView } from '../store/slices/uiSlice';
import { ThemeContext } from '../context/ThemeContext';

const ResourceDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.resources);
  const dispatch = useDispatch();
  const { notify } = useContext(ThemeContext);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchResourceDetail(id);
      setDetail(res.data);
      dispatch(addRecentView({ id: res.data.id, title: res.data.title, type: 'resource' }));
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
          extra={<Button type={isFav ? 'primary' : 'default'} onClick={() => { dispatch(toggleFavorite({ item: detail, itemType: 'resource' })); notify?.('收藏状态已更新'); }}>{isFav ? '已收藏' : '收藏'}</Button>}
        >
          <Space wrap style={{ marginBottom: 12 }}>
            <Tag color="green">{detail.type}</Tag>
            {detail.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </Space>
          <Tabs
            items={[
              { key: 'overview', label: '概览', children: <p>{detail.description}</p> },
              { key: 'meta', label: '元信息', children: <p>难度：{detail.difficulty} {detail.url && <a href={detail.url} target="_blank" rel="noreferrer">访问外链</a>}</p> },
              { key: 'related', label: '相关资源', children: detail.related?.length ? (
                <List
                  dataSource={detail.related}
                  renderItem={(r) => (
                    <List.Item>
                      <List.Item.Meta title={<Link to={`/resources/${r.id}`}>{r.title}</Link>} description={r.description} />
                      <Tag>{r.type}</Tag>
                    </List.Item>
                  )}
                />
              ) : <Empty description="暂无推荐" /> }
            ]}
          />
        </Card>
      )}
    </LoadingState>
  );
};

export default ResourceDetail;
