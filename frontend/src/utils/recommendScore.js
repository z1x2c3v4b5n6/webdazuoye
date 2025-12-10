/**
 * 计算推荐项的匹配分数。
 * 规则：
 * 1. 与用户收藏标签重叠 +2/个（突出偏好主题）。
 * 2. Track 的 level 命中收藏 level +3；Resource 暂无 level则跳过。
 * 3. 用户最近浏览阶段（cloud/docker/k8s）与推荐项阶段一致 +2。
 * 4. 默认基础分 1，分数越高排序越靠前。
 */
const inferStage = (item = {}) => {
  const id = item.id || '';
  const tags = (item.tags || []).map((t) => t.toLowerCase());
  if (id.includes('docker') || tags.includes('docker')) return 'docker';
  if (id.includes('k8s') || tags.includes('k8s')) return 'k8s';
  return 'cloud';
};

const recommendScore = (item, profile = {}) => {
  const favoriteTags = profile.favoriteTags || new Set();
  const favoriteLevels = profile.favoriteLevels || new Set();
  const recentStage = profile.recentStage || null;
  let score = 1;

  (item.tags || []).forEach((tag) => {
    if (favoriteTags.has(tag)) score += 2;
  });

  if (item.level && favoriteLevels.has(item.level)) {
    score += 3;
  }

  const stage = inferStage(item);
  if (recentStage && stage === recentStage) {
    score += 2;
  }

  return score;
};

export default recommendScore;
