import React, { useEffect, useState, useMemo } from 'react';
import { Pagination, Empty } from 'antd';
import { fetchResources } from '../api';
import LoadingState from '../components/LoadingState';
import ResourceCard from '../components/ResourceCard';
import FilterBar from '../components/FilterBar';
import { useSelector } from 'react-redux';

const Resources = () => {
  const [query, setQuery] = useState({ q: '', tag: '', extra: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ list: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.resources);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchResources({ q: query.q, tag: query.tag, type: query.extra, page, pageSize: 8 });
      setData(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [query, page]);

  const options = useMemo(() => ([
    { label: '全部类型', value: '' },
    { label: 'article', value: 'article' },
    { label: 'video', value: 'video' },
    { label: 'doc', value: 'doc' },
    { label: 'lab', value: 'lab' }
  ]), []);

  return (
    <div>
      <FilterBar value={query} onChange={(val) => { setPage(1); setQuery(val); }} options={options} />
      <LoadingState loading={loading} error={error} onRetry={load}>
        {data.list.length === 0 ? <Empty description="暂无资源" /> : (
          <div className="card-grid">
            {data.list.map((res) => <ResourceCard key={res.id} resource={res} />)}
          </div>
        )}
      </LoadingState>
      <Pagination current={page} total={data.total} pageSize={8} style={{ marginTop: 16 }} onChange={(p) => setPage(p)} />
      <div style={{ marginTop: 8, color: '#888' }}>已收藏 {favorites.length} 个资源</div>
    </div>
  );
};

export default Resources;
