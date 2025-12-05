import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, Space, Tag, Button } from 'antd';

const tagsPreset = ['入门', '基础', '进阶', '网络', '安全', '监控', '发布'];

const FilterBar = ({ value = {}, onChange, options = [] }) => {
  const [keyword, setKeyword] = useState(value.q || '');
  const [selectedTag, setSelectedTag] = useState(value.tag || '');
  const [extra, setExtra] = useState(value.extra || '');

  useEffect(() => {
    setKeyword(value.q || '');
    setSelectedTag(value.tag || '');
    setExtra(value.extra || '');
  }, [value]);

  const trigger = useCallback((changed) => {
    onChange?.({ ...value, ...changed });
  }, [onChange, value]);

  const handleSearch = () => {
    trigger({ q: keyword });
  };

  return (
    <Space direction="vertical" style={{ marginBottom: 16, width: '100%' }} size="small">
      <Space.Compact style={{ width: '100%', maxWidth: 520 }}>
        <Input
          allowClear
          placeholder="搜索标题或描述"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
        />
        {options.length > 0 && (
          <Select
            style={{ minWidth: 160 }}
            placeholder="选择类型"
            value={extra || undefined}
            allowClear
            options={options}
            onChange={(val) => { setExtra(val || ''); trigger({ extra: val || '' }); }}
          />
        )}
        <Button type="primary" onClick={handleSearch}>搜索</Button>
      </Space.Compact>
      <Space wrap align="center">
        {tagsPreset.map((t) => (
          <Tag.CheckableTag
            key={t}
            checked={selectedTag === t}
            onChange={(checked) => { setSelectedTag(checked ? t : ''); trigger({ tag: checked ? t : '' }); }}
          >
            {t}
          </Tag.CheckableTag>
        ))}
        <Button size="small" onClick={() => { setKeyword(''); setSelectedTag(''); trigger({ q: '', tag: '' }); }}>重置</Button>
      </Space>
    </Space>
  );
};

export default FilterBar;
