import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Pagination, Empty, Space, Typography, Tag, Button } from 'antd';
import { fetchTracks } from '../api';
import LoadingState from '../components/LoadingState';
import TrackCard from '../components/TrackCard';
import FilterBar from '../components/FilterBar';
import { useSelector, useDispatch } from 'react-redux';
import AddToPlanModal from '../components/AddToPlanModal';
import { addRecentSearch } from '../store/slices/uiSlice';

const inferStageFromTrack = (id = '') => {
  if (id.includes('docker')) return 'docker';
  if (id.includes('k8s')) return 'k8s';
  return 'cloud';
};

const Tracks = () => {
  const [query, setQuery] = useState({ q: '', tag: '', extra: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ list: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.tracks);
  const recentSearches = useSelector((state) => state.ui?.recentSearches?.tracks || []);
  const dispatch = useDispatch();
  const [planModal, setPlanModal] = useState({ open: false, item: null });

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchTracks({ q: query.q, tag: query.tag, level: query.extra, page, pageSize: 6 });
      setData(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [query, page]);

  const handleFilterChange = useCallback((val) => {
    setPage(1);
    setQuery(val);
    if (val.q?.trim()) {
      dispatch(addRecentSearch({ page: 'tracks', keyword: val.q.trim() }));
    }
  }, [dispatch]);

  const options = useMemo(() => ([
    { label: '全部难度', value: '' },
    { label: '基础', value: '基础' },
    { label: '进阶', value: '进阶' }
  ]), []);

  const hotTags = useMemo(() => {
    const counter = {};
    data.list.forEach((item) => {
      (item.tags || []).forEach((tag) => {
        counter[tag] = (counter[tag] || 0) + 1;
      });
    });
    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [data.list]);

  return (
    <div>
      <FilterBar value={query} onChange={handleFilterChange} options={options} />
      <Space direction="vertical" style={{ width: '100%', marginBottom: 12 }}>
        {recentSearches.length > 0 && (
          <Space wrap>
            <Typography.Text type="secondary">最近搜索：</Typography.Text>
            {recentSearches.map((k) => (
              <Tag.CheckableTag
                key={k}
                checked={query.q === k}
                onChange={() => handleFilterChange({ ...query, q: k })}
              >
                {k}
              </Tag.CheckableTag>
            ))}
          </Space>
        )}
        {hotTags.length > 0 && (
          <Space wrap>
            <Typography.Text type="secondary">热门标签：</Typography.Text>
            {hotTags.map((tag) => (
              <Button key={tag} size="small" onClick={() => handleFilterChange({ ...query, tag })}>{tag}</Button>
            ))}
          </Space>
        )}
      </Space>
      <LoadingState loading={loading} error={error} onRetry={load}>
        {data.list.length === 0 ? <Empty description="没有找到专题" /> : (
          <div className="card-grid">
            {data.list.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onFavorite={() => {}}
                onAddPlan={(item) => setPlanModal({ open: true, item })}
              />
            ))}
          </div>
        )}
      </LoadingState>
      <Pagination current={page} total={data.total} pageSize={6} style={{ marginTop: 16 }} onChange={(p) => setPage(p)} />
      <div style={{ marginTop: 8, color: '#888' }}>已收藏 {favorites.length} 个专题</div>
      <AddToPlanModal
        open={planModal.open}
        onClose={() => setPlanModal({ open: false, item: null })}
        defaultTitle={planModal.item?.title}
        defaultStage={inferStageFromTrack(planModal.item?.id)}
        linkedType="track"
        linkedId={planModal.item?.id}
      />
    </div>
  );
};

export default Tracks;
