import React from 'react';
import { Spin, Alert, Button } from 'antd';

const LoadingState = ({ loading, error, onRetry, children }) => {
  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>;
  if (error) return <Alert message="加载失败" description={error} type="error" action={<Button onClick={onRetry}>重试</Button>} />;
  return children;
};

export default LoadingState;
