import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const readJson = (file) => {
  const filePath = path.join(__dirname, 'server', 'data', file);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const paginate = (list, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: list.slice(start, end),
    total: list.length,
    page,
    pageSize
  };
};

app.get('/api/paths', (req, res) => {
  const tracks = readJson('tracks.json');
  const roadmap = [
    { key: '基础', title: '云计算基础', description: '理解云计算核心概念，搭建基础网络和安全', trackIds: tracks.filter(t => t.id.includes('basic')).map(t => t.id) },
    { key: 'Docker', title: '容器与Docker', description: '掌握镜像、容器、网络与CI/CD', trackIds: tracks.filter(t => t.id.includes('docker')).map(t => t.id) },
    { key: 'K8s', title: 'Kubernetes', description: '容器编排、可观测性与云原生架构', trackIds: tracks.filter(t => t.id.includes('k8s')).map(t => t.id) }
  ];
  res.json({ roadmap, tracks });
});

app.get('/api/tracks', (req, res) => {
  const { q = '', level, tag, page = 1, pageSize = 6 } = req.query;
  const tracks = readJson('tracks.json');
  const filtered = tracks.filter((t) => {
    const matchQ = t.title.includes(q) || t.summary.includes(q);
    const matchLevel = level ? t.level === level : true;
    const matchTag = tag ? t.tags.includes(tag) : true;
    return matchQ && matchLevel && matchTag;
  });
  res.json(paginate(filtered, Number(page), Number(pageSize)));
});

app.get('/api/tracks/:id', (req, res) => {
  const { id } = req.params;
  const tracks = readJson('tracks.json');
  const resources = readJson('resources.json');
  const track = tracks.find((t) => t.id === id);
  if (!track) return res.status(404).json({ message: 'Track not found' });
  const relatedResources = resources.filter((r) => track.relatedResourceIds?.includes(r.id));
  res.json({ ...track, relatedResources });
});

app.get('/api/resources', (req, res) => {
  const { q = '', type, tag, page = 1, pageSize = 8 } = req.query;
  const resources = readJson('resources.json');
  const filtered = resources.filter((r) => {
    const matchQ = r.title.includes(q) || r.description.includes(q);
    const matchType = type ? r.type === type : true;
    const matchTag = tag ? r.tags.includes(tag) : true;
    return matchQ && matchType && matchTag;
  });
  res.json(paginate(filtered, Number(page), Number(pageSize)));
});

app.get('/api/resources/:id', (req, res) => {
  const { id } = req.params;
  const resources = readJson('resources.json');
  const resource = resources.find((r) => r.id === id);
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  const related = resources.filter((r) => r.tags.some(tag => resource.tags.includes(tag)) && r.id !== id).slice(0, 4);
  res.json({ ...resource, related });
});

app.get('/api/recommendations', (req, res) => {
  const tracks = readJson('tracks.json');
  const resources = readJson('resources.json');
  const recTracks = tracks.slice(0, 4);
  const recResources = resources.slice(0, 6);
  res.json({ tracks: recTracks, resources: recResources });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
