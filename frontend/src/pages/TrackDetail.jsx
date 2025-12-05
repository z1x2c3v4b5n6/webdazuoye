import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card, Tag, Space, Button, Tabs, List, Empty, Checkbox, Progress
} from 'antd';
import { fetchTrackDetail } from '../api';
import LoadingState from '../components/LoadingState';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { addRecentView } from '../store/slices/uiSlice';
import { toggleLessonCompletion } from '../store/slices/progressSlice';
import { ThemeContext } from '../context/ThemeContext';

const TrackDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const favorites = useSelector((state) => state.favorites.tracks);
  const completedLessons = useSelector((state) => state.progress.completedLessons[id] || {});
  const trackProgress = useSelector((state) => state.progress.items[id] || 0);
  const dispatch = useDispatch();
  const { notify } = useContext(ThemeContext);

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

  const totalLessons = useMemo(() => {
    if (!detail) return 0;
    return (detail.chapters || []).reduce((acc, chapter) => acc + (chapter.lessons?.length || 0), 0);
  }, [detail]);

  const completionPercent = useMemo(() => {
    const finished = Object.values(completedLessons).filter(Boolean).length;
    if (totalLessons > 0) {
      return Math.min(100, Math.round((finished / totalLessons) * 100));
    }
    return trackProgress;
  }, [completedLessons, totalLessons, trackProgress]);

  const handleToggleLesson = useCallback((lessonKey) => {
    dispatch(toggleLessonCompletion({ trackId: id, lessonId: lessonKey, totalLessons }));
    notify?.('已更新章节完成状态');
  }, [dispatch, id, totalLessons, notify]);

  return (
    <LoadingState loading={loading} error={error} onRetry={load}>
      {detail && (
        <Card
          title={detail.title}
          extra=(
            <Space>
              <Progress
                type="circle"
                size={52}
                percent={completionPercent}
              />
              <Button
                type={isFav ? 'primary' : 'default'}
                onClick={() => { dispatch(toggleFavorite({ item: detail, itemType: 'track' })); notify?.('收藏状态已更新'); }}
              >
                {isFav ? '已收藏' : '收藏'}
              </Button>
            </Space>
          )
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
                  renderItem={(c, cIndex) => (
                    <List.Item>
                      <List.Item.Meta title={c.title} description={(c.lessons || []).join(' / ')} />
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {(c.lessons || []).map((lesson, lIndex) => {
                          const lessonKey = `${id}::${cIndex}::${lIndex}`;
                          return (
                            <Checkbox
                              key={lessonKey}
                              checked={!!completedLessons[lessonKey]}
                              onChange={() => handleToggleLesson(lessonKey)}
                            >
                              {lesson}
                            </Checkbox>
                          );
                        })}
                      </Space>
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
