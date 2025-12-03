import React from 'react';
import { Card, Tag, Button, Progress, Space, Typography } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { Link } from 'react-router-dom';

const TrackCard = ({ track, onFavorite }) => {
  const favorites = useSelector((state) => state.favorites.tracks);
  const progress = useSelector((state) => state.progress.items[track.id] || 0);
  const dispatch = useDispatch();
  const isFav = favorites.some((f) => f.id === track.id);

  const handleFavorite = () => {
    dispatch(toggleFavorite({ item: track, itemType: 'track' }));
    onFavorite?.();
  };

  return (
    <Card
      title={<Link to={`/tracks/${track.id}`}>{track.title}</Link>}
      extra={<Tag color={track.level === '基础' ? 'blue' : 'purple'}>{track.level}</Tag>}
    >
      <Typography.Paragraph ellipsis={{ rows: 2 }}>{track.summary}</Typography.Paragraph>
      <Space wrap>
        {track.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </Space>
      <div style={{ marginTop: 12 }}>
        <Progress percent={progress} size="small" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <span>章节：{track.chapters.length} · 实验：{track.labs.length}</span>
        <Button type={isFav ? 'primary' : 'default'} icon={isFav ? <HeartFilled /> : <HeartOutlined />} onClick={handleFavorite}>
          {isFav ? '已收藏' : '收藏'}
        </Button>
      </div>
    </Card>
  );
};

export default TrackCard;
