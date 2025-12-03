import React, { useEffect, useState, useMemo } from 'react';
import { Pagination, Empty } from 'antd';
import { fetchTracks } from '../api';
import LoadingState from '../components/LoadingState';
import TrackCard from '../components/TrackCard';
import FilterBar from '../components/FilterBar';
import { useSelector } from 'react-redux';

const Tracks = () => {
  const [query, setQuery] = useState({ q: '', tag: '', extra: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ list: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.tracks);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchTracks({ q: query.q, tag: query.tag, level: query.extra, page, pageSize: 6 });
      setData(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [query, page]);

  const options = useMemo(() => ([
    { label: '全部难度', value: '' },
    { label: '基础', value: '基础' },
    { label: '进阶', value: '进阶' }
  ]), []);

  return (
    <div>
      <FilterBar value={query} onChange={(val) => { setPage(1); setQuery(val); }} options={options} />
      <LoadingState loading={loading} error={error} onRetry={load}>
        {data.list.length === 0 ? <Empty description="没有找到专题" /> : (
          <div className="card-grid">
            {data.list.map((track) => <TrackCard key={track.id} track={track} onFavorite={() => {}} />)}
          </div>
        )}
      </LoadingState>
      <Pagination current={page} total={data.total} pageSize={6} style={{ marginTop: 16 }} onChange={(p) => setPage(p)} />
      <div style={{ marginTop: 8, color: '#888' }}>已收藏 {favorites.length} 个专题</div>
    </div>
  );
};

export default Tracks;
