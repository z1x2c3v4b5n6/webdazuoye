import React from 'react';
import { Card, Tag, Button, Space, Typography } from 'antd';
import { HeartOutlined, HeartFilled, LinkOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { Link } from 'react-router-dom';

const ResourceCard = ({ resource, onFavorite }) => {
  const favorites = useSelector((state) => state.favorites.resources);
  const dispatch = useDispatch();
  const isFav = favorites.some((f) => f.id === resource.id);

  const handleFavorite = () => {
    dispatch(toggleFavorite({ item: resource, itemType: 'resource' }));
    onFavorite?.();
  };

  return (
    <Card
      title={<Link to={`/resources/${resource.id}`}>{resource.title}</Link>}
      extra={<Tag color="green">{resource.type}</Tag>}
      actions={[resource.url ? <a href={resource.url} target="_blank" rel="noreferrer"><LinkOutlined /></a> : null]}
    >
      <Typography.Paragraph ellipsis={{ rows: 2 }}>{resource.description}</Typography.Paragraph>
      <Space wrap>
        {resource.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </Space>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <span>难度：{resource.difficulty}</span>
        <Button size="small" type={isFav ? 'primary' : 'default'} icon={isFav ? <HeartFilled /> : <HeartOutlined />} onClick={handleFavorite}>
          {isFav ? '已收藏' : '收藏'}
        </Button>
      </div>
    </Card>
  );
};

export default ResourceCard;
