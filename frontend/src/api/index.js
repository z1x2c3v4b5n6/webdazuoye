import http from './http';

export const fetchPaths = () => http.get('/api/paths');
export const fetchTracks = (params) => http.get('/api/tracks', { params });
export const fetchTrackDetail = (id) => http.get(`/api/tracks/${id}`);
export const fetchResources = (params) => http.get('/api/resources', { params });
export const fetchResourceDetail = (id) => http.get(`/api/resources/${id}`);
export const fetchRecommendations = () => http.get('/api/recommendations');
