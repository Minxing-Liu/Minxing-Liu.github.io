import {repository,github,WORKFLOW} from './core.mjs';
const $=id=>document.getElementById(id);
const saved=await chrome.storage.local.get('settings');
if(saved.settings) { $('repo').value=saved.settings.repo; $('status').textContent='已保存授权。留空 Token 可保留原值。'; }
$('settings-form').addEventListener('submit',async event=>{
  event.preventDefault(); $('status').textContent='检查仓库发布工作流…';
  try {
    const {settings:previous}=await chrome.storage.local.get('settings');
    const settings={repo:repository($('repo').value.trim()),token:$('token').value.trim() || previous?.token};
    await github(settings,`/actions/workflows/${WORKFLOW}`);
    await chrome.storage.local.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});
    await chrome.storage.local.set({settings}); $('token').value='';
    $('status').textContent='已保存，工作流可访问。写权限与飞书授权会在首次发布时验证。';
  } catch(error) { $('status').textContent=error.message; }
});
$('forget').addEventListener('click',async()=>{
  await chrome.storage.local.remove(['settings','lastJob']); $('token').value='';
  $('status').textContent='本机授权已移除。如需撤销 Token，请到 GitHub 的 Token 设置删除。';
});
$('clear-job').addEventListener('click',async()=>{ await chrome.storage.local.remove('lastJob'); $('status').textContent='本机任务记录已清除。'; });
