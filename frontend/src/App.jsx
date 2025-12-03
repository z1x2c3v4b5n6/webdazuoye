import React, { useContext, useMemo } from 'react';
import { Layout, Menu, Breadcrumb, Switch, Typography, Space } from 'antd';
import { HomeOutlined, DeploymentUnitOutlined, AppstoreOutlined, BookOutlined, UserOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import RouterConfig from './router';
import { ThemeContext } from './context/ThemeContext';
import { useDispatch } from 'react-redux';
import { toggleTheme } from './store/slices/uiSlice';

const { Header, Content, Sider, Footer } = Layout;

const App = () => {
  const location = useLocation();
  const { toggleTheme: ctxToggle, theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const menuKey = location.pathname.startsWith('/tracks') && location.pathname !== '/tracks'
    ? '/tracks'
    : location.pathname.startsWith('/resources') && location.pathname !== '/resources'
      ? '/resources'
      : location.pathname;

  const menuItems = useMemo(() => ([
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
    { key: '/paths', icon: <DeploymentUnitOutlined />, label: <Link to="/paths">学习路线</Link> },
    { key: '/tracks', icon: <AppstoreOutlined />, label: <Link to="/tracks">专题列表</Link> },
    { key: '/resources', icon: <BookOutlined />, label: <Link to="/resources">资源库</Link> },
    { key: '/me', icon: <UserOutlined />, label: <Link to="/me">我的</Link> }
  ]), []);

  const onThemeChange = () => {
    ctxToggle();
    dispatch(toggleTheme());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo">云原生学习</div>
        <Menu theme="dark" mode="inline" selectedKeys={[menuKey]} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <div className="header-content">
            <Space size="large">
              <Typography.Title level={4} style={{ margin: 0 }}>云计算 / Docker / K8s 学习路径</Typography.Title>
              <Breadcrumb items={[
                { title: <Link to="/">首页</Link> },
                { title: menuKey !== '/' ? menuItems.find(m => m.key === menuKey)?.label : '概览' }
              ]} />
            </Space>
            <Space>
              <ThunderboltOutlined />
              <span>主题</span>
              <Switch checkedChildren="暗" unCheckedChildren="亮" checked={theme === 'dark'} onChange={onThemeChange} />
            </Space>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <RouterConfig />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>云计算学习路径平台 ©2024 课程大作业</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
