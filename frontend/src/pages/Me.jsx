import React, { useState } from 'react';
import { Card, List, Tag, Button, Divider, Drawer, Progress, Space, Empty } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { clearFavorites } from '../store/slices/favoritesSlice';
import { clearRecent } from '../store/slices/uiSlice';
import { Link } from 'react-router-dom';

const Me = () => {
  const favorites = useSelector((state) => state.favorites);
  const progress = useSelector((state) => state.progress.items);
  const recent = useSelector((state) => state.ui.recentViews);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Card title="学习进度">
        <List
          dataSource={Object.entries(progress)}
          renderItem={([trackId, value]) => (
            <List.Item>
              <List.Item.Meta title={trackId} />
              <Progress percent={value} style={{ width: 240 }} />
            </List.Item>
          )}
        />
      </Card>
      <Divider />
      <Space>
        <Button type="primary" onClick={() => setOpen(true)}>查看收藏</Button>
        <Button danger onClick={() => dispatch(clearFavorites())}>清空收藏</Button>
        <Button onClick={() => dispatch(clearRecent())}>清空最近浏览</Button>
      </Space>
      <Divider />
      <Card title="最近浏览">
        {recent.length === 0 ? <Empty description="暂无记录" /> : (
          <List
            dataSource={recent}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.type} />
              </List.Item>
            )}
          />
        )}
      </Card>
      <Drawer title="我的收藏" placement="right" onClose={() => setOpen(false)} open={open} width={420}>
        <Card title="专题收藏" size="small">
          {favorites.tracks.length === 0 ? <Empty description="暂无收藏" /> : (
            <List
              dataSource={favorites.tracks}
              renderItem={(t) => (
                <List.Item>
                  <Link to={`/tracks/${t.id}`}>{t.title}</Link>
                  <Tag color={t.level === '基础' ? 'blue' : 'purple'}>{t.level}</Tag>
                </List.Item>
              )}
            />
          )}
        </Card>
        <Divider />
        <Card title="资源收藏" size="small">
          {favorites.resources.length === 0 ? <Empty description="暂无收藏" /> : (
            <List
              dataSource={favorites.resources}
              renderItem={(r) => (
                <List.Item>
                  <Link to={`/resources/${r.id}`}>{r.title}</Link>
                  <Tag>{r.type}</Tag>
                </List.Item>
              )}
            />
          )}
        </Card>
      </Drawer>
    </div>
  );
};

export default Me;
