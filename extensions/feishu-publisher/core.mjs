export const WORKFLOW = 'feishu-publish.yml';
export function documentUrl(value) {
  let url;
  try { url = new URL(value.trim()); } catch { throw new Error('请打开或粘贴飞书文档链接。'); }
  const match = url.pathname.match(/^\/(docx|wiki)\/([A-Za-z0-9]{8,100})\/?$/);
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.feishu.cn') || url.username || url.password || url.port || !match)
    throw new Error('支持 https://你的团队.feishu.cn/docx/… 或 /wiki/… 链接。');
  return { url: `${url.origin}/${match[1]}/${match[2]}`, kind: match[1], token: match[2] };
}
export function slugValue(value = '') {
  const slug = value.trim();
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('网址简称只用小写英文字母、数字和短横线。');
  if (slug.length > 80) throw new Error('网址简称最多 80 个字符。');
  return slug;
}
export function repository(value) {
  if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/.test(value)) throw new Error('仓库格式应为 用户名/仓库名。');
  return value;
}
export async function github(settings, path, body, fetcher = fetch) {
  repository(settings.repo);
  if (!settings.token) throw new Error('请先在设置中保存 GitHub Token。');
  const response = await fetcher(`https://api.github.com/repos/${settings.repo}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${settings.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(body ? {'Content-Type': 'application/json'} : {}) },
    ...(body ? {body: JSON.stringify(body)} : {}), signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`GitHub 请求失败（${response.status}）。检查 Token 是否过期、是否选择本仓库且有 Actions 读写权限。`);
  return response.status === 204 ? null : response.json();
}
export function findRun(runs, id) {
  return runs.find(run => run.display_title === `Feishu publish ${id}` && run.event === 'workflow_dispatch');
}
export function runStatus(run) {
  if (!run) return '请求已提交，等待 GitHub 创建任务…';
  if (run.status !== 'completed') return '正在导入、检查并发布…';
  return run.conclusion === 'success' ? '已发布，网站更新完成。' : `发布未完成（${run.conclusion}），请查看任务日志。`;
}
