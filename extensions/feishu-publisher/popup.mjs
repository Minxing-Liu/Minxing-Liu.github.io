import {documentUrl,github,WORKFLOW,findRun,runStatus} from './core.mjs';
const $=id=>document.getElementById(id);
let settings, timer;
async function refresh() {
  const {lastJob}=await chrome.storage.local.get('lastJob');
  if(!lastJob || lastJob.repo!==settings?.repo) return;
  $('run-link').hidden=false;
  $('run-link').href=`https://github.com/${settings.repo}/actions/workflows/${WORKFLOW}`;
  try {
    const data=await github(settings,`/actions/workflows/${WORKFLOW}/runs?event=workflow_dispatch&per_page=50`);
    const run=findRun(data.workflow_runs,lastJob.id);
    $('status').textContent=runStatus(run);
    if(run) $('run-link').href=`https://github.com/${settings.repo}/actions/runs/${run.id}`;
    const pending=run?.status!=='completed' && Date.now()-lastJob.created<2*60*60*1000;
    $('publish').disabled=pending;
    if(pending) timer=setTimeout(refresh,8000);
    if(!run && Date.now()-lastJob.created>120000) $('status').textContent='尚未找到任务。请打开任务页面检查请求是否成功；不要连续重复发布。';
  } catch(error) { $('status').textContent=error.message; }
}
$('publish-form').addEventListener('submit',async event=>{
  event.preventDefault(); clearTimeout(timer); $('publish').disabled=true;
  $('status').textContent='正在提交发布请求…';
  try {
    const result=await chrome.runtime.sendMessage({action:'publish',url:$('document-url').value,slug:$('slug').value,category:$('category').value});
    if(!result?.ok) throw new Error(result?.error || '扩展后台未响应。');
    await refresh();
  } catch(error) { $('status').textContent=error.message; $('publish').disabled=false; }
});
try {
  ({settings}=await chrome.storage.local.get('settings'));
  if(settings) $('destination').textContent=settings.repo;
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  try { $('document-url').value=documentUrl(tab?.url ?? '').url; } catch { /* Pasted links also work. */ }
  if(!settings) { $('publish').disabled=true; $('status').textContent='第一次使用：点击右上角“设置”。'; }
  else await refresh();
} catch(error) { $('status').textContent=error.message; }
