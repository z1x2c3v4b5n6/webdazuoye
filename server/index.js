import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const readJson = (file) => {
  try {
    const filePath = path.join(__dirname, 'data', file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read JSON:', err.stack || err);
    throw err;
  }
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizePagination = (pageParam, sizeParam, defaults = { page: 1, pageSize: 10, maxPageSize: 50 }) => {
  const page = Math.max(1, parseInt(pageParam, 10) || defaults.page);
  let pageSize = parseInt(sizeParam, 10);
  if (!pageSize || Number.isNaN(pageSize) || pageSize <= 0) {
    pageSize = defaults.pageSize;
  }
  pageSize = Math.min(pageSize, defaults.maxPageSize || pageSize);
  return { page, pageSize };
};

const paginate = (list, page = 1, pageSize = 10) => {
  const safeList = toArray(list);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: safeList.slice(start, end),
    total: safeList.length,
    page,
    pageSize
  };
};

app.get('/api/paths', (req, res) => {
  try {
    const tracks = toArray(readJson('tracks.json'));
    const roadmap = [
      {
        key: '基础',
        title: '云计算基础',
        description: '理解云计算核心概念，搭建基础网络和安全',
        trackIds: tracks.filter((t) => (t?.id || '').includes('basic')).map((t) => t.id)
      },
      {
        key: 'Docker',
        title: '容器与Docker',
        description: '掌握镜像、容器、网络与CI/CD',
        trackIds: tracks.filter((t) => (t?.id || '').includes('docker')).map((t) => t.id)
      },
      {
        key: 'K8s',
        title: 'Kubernetes',
        description: '容器编排、可观测性与云原生架构',
        trackIds: tracks.filter((t) => (t?.id || '').includes('k8s')).map((t) => t.id)
      }
    ];
    res.json({ roadmap, tracks });
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/tracks', (req, res) => {
  try {
    const { q = '', level, tag, page, pageSize } = req.query;
    const tracks = toArray(readJson('tracks.json'));
    const normalizedQ = (q || '').toString().toLowerCase();
    const normalizedTag = (tag || '').toString();
    const filtered = tracks.filter((t) => {
      const title = (t?.title || '').toLowerCase();
      const summary = (t?.summary || '').toLowerCase();
      const tags = toArray(t?.tags);
      const matchQ = !normalizedQ || title.includes(normalizedQ) || summary.includes(normalizedQ);
      const matchLevel = level ? t?.level === level : true;
      const matchTag = normalizedTag ? tags.includes(normalizedTag) : true;
      return matchQ && matchLevel && matchTag;
    });
    const { page: p, pageSize: s } = normalizePagination(page, pageSize, { page: 1, pageSize: 6, maxPageSize: 50 });
    res.json(paginate(filtered, p, s));
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/tracks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tracks = toArray(readJson('tracks.json'));
    const resources = toArray(readJson('resources.json'));
    const track = tracks.find((t) => t?.id === id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    const safeTrack = {
      tags: toArray(track.tags),
      chapters: toArray(track.chapters),
      labs: toArray(track.labs),
      relatedResourceIds: toArray(track.relatedResourceIds),
      summary: track.summary || '',
      level: track.level || '',
      ...track
    };
    const relatedResources = resources.filter((r) => safeTrack.relatedResourceIds.includes(r.id));
    res.json({ ...safeTrack, relatedResources });
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/resources', (req, res) => {
  try {
    const { q = '', type, tag, page, pageSize } = req.query;
    const resources = toArray(readJson('resources.json'));
    const normalizedQ = (q || '').toString().toLowerCase();
    const normalizedTag = (tag || '').toString();
    const filtered = resources.filter((r) => {
      const title = (r?.title || '').toLowerCase();
      const description = (r?.description || '').toLowerCase();
      const tags = toArray(r?.tags);
      const matchQ = !normalizedQ || title.includes(normalizedQ) || description.includes(normalizedQ);
      const matchType = type ? r?.type === type : true;
      const matchTag = normalizedTag ? tags.includes(normalizedTag) : true;
      return matchQ && matchType && matchTag;
    });
    const { page: p, pageSize: s } = normalizePagination(page, pageSize, { page: 1, pageSize: 8, maxPageSize: 100 });
    res.json(paginate(filtered, p, s));
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/resources/:id', (req, res) => {
  try {
    const { id } = req.params;
    const resources = toArray(readJson('resources.json'));
    const resource = resources.find((r) => r?.id === id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    const safeResource = { ...resource, tags: toArray(resource.tags) };
    const related = resources
      .filter((r) => (Array.isArray(r?.tags) && safeResource.tags.length
        ? r.tags.some((tagItem) => safeResource.tags.includes(tagItem))
        : false) && r.id !== id)
      .slice(0, 4);
    res.json({ ...safeResource, related });
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/recommendations', (req, res) => {
  try {
    const tracks = toArray(readJson('tracks.json'));
    const resources = toArray(readJson('resources.json'));
    const recTracks = tracks.slice(0, 4);
    const recResources = resources.slice(0, 6);
    res.json({ tracks: recTracks, resources: recResources });
  } catch (err) {
    console.error(err.stack || err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
