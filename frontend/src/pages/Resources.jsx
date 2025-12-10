import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Pagination, Empty, Space, Typography, Tag, Button, Segmented } from 'antd';
import { fetchResources } from '../api';
import LoadingState from '../components/LoadingState';
import ResourceCard from '../components/ResourceCard';
import FilterBar from '../components/FilterBar';
import { useSelector, useDispatch } from 'react-redux';
import AddToPlanModal from '../components/AddToPlanModal';
import { setStatus } from '../store/slices/resourceStatusSlice';
import { addRecentSearch } from '../store/slices/uiSlice';

const inferStageFromResource = (resource = {}) => {
  const tags = (resource.tags || []).join(',').toLowerCase();
  if (tags.includes('docker')) return 'docker';
  if (tags.includes('k8s')) return 'k8s';
  return 'cloud';
};

const Resources = () => {
  const [query, setQuery] = useState({ q: '', tag: '', extra: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ list: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.resources);
  const resourceStatuses = useSelector((state) => state.resourceStatus.statuses || {});
  const recentSearches = useSelector((state) => state.ui?.recentSearches?.resources || []);
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState('all');
  const [planModal, setPlanModal] = useState({ open: false, item: null });

  const load = async () => {
    try {
      setLoading(true); setError('');
      const res = await fetchResources({ q: query.q, tag: query.tag, type: query.extra, page, pageSize: 8 });
      setData(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [query, page]);

  const handleFilterChange = useCallback((val) => {
    setPage(1);
    setQuery(val);
    if (val.q?.trim()) {
      dispatch(addRecentSearch({ page: 'resources', keyword: val.q.trim() }));
    }
  }, [dispatch]);

  const options = useMemo(() => ([
    { label: '全部类型', value: '' },
    { label: 'article', value: 'article' },
    { label: 'video', value: 'video' },
    { label: 'doc', value: 'doc' },
    { label: 'lab', value: 'lab' }
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

  const filteredList = useMemo(() => {
    if (statusFilter === 'all') return data.list;
    return data.list.filter((item) => (resourceStatuses[item.id] || 'todo') === statusFilter);
  }, [data.list, statusFilter, resourceStatuses]);

  const handleStatusChange = (id, status) => {
    dispatch(setStatus({ resourceId: id, status }));
  };

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
        <Space>
          <Typography.Text>状态筛选：</Typography.Text>
          <Segmented
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { label: '全部', value: 'all' },
              { label: '未看', value: 'todo' },
              { label: '在看', value: 'doing' },
              { label: '已看', value: 'done' }
            ]}
          />
        </Space>
      </Space>
      <LoadingState loading={loading} error={error} onRetry={load}>
        {filteredList.length === 0 ? <Empty description="暂无资源" /> : (
          <div className="card-grid">
            {filteredList.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                status={resourceStatuses[res.id] || 'todo'}
                onStatusChange={handleStatusChange}
                onAddPlan={(item) => setPlanModal({ open: true, item })}
              />
            ))}
          </div>
        )}
      </LoadingState>
      <Pagination current={page} total={data.total} pageSize={8} style={{ marginTop: 16 }} onChange={(p) => setPage(p)} />
      <div style={{ marginTop: 8, color: '#888' }}>已收藏 {favorites.length} 个资源</div>
      <AddToPlanModal
        open={planModal.open}
        onClose={() => setPlanModal({ open: false, item: null })}
        defaultTitle={planModal.item?.title}
        defaultStage={inferStageFromResource(planModal.item)}
        linkedType="resource"
        linkedId={planModal.item?.id}
      />
    </div>
  );
};

export default Resources;
