import {documentUrl, slugValue, github, WORKFLOW, findRun} from './core.mjs';
chrome.storage.local.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});
let dispatching = false;
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if(sender.id !== chrome.runtime.id) return false;
  (async()=>{
    if(message.action !== 'publish') throw new Error('未知操作。');
    if(dispatching) throw new Error('请求正在提交，请稍候。');
    dispatching=true;
    try {
      const {settings,lastJob} = await chrome.storage.local.get(['settings','lastJob']);
      if(!settings) throw new Error('请先完成插件设置。');
      const url=documentUrl(message.url).url;
      const slug=slugValue(message.slug);
      const category=(message.category ?? '').trim();
      if(category.length>60 || /[\r\n]/.test(category)) throw new Error('分类需为 60 字以内的单行文字。');
      if(lastJob && lastJob.repo===settings.repo && Date.now()-lastJob.created<2*60*60*1000) {
        const data=await github(settings,`/actions/workflows/${WORKFLOW}/runs?event=workflow_dispatch&per_page=50`);
        const previous=findRun(data.workflow_runs,lastJob.id);
        if(previous?.status!=='completed') throw new Error('上一项发布仍在排队或运行，请完成后再发布。可在任务页面核对；已确定请求未创建时可在设置中清除记录。');
      }
      const id=crypto.randomUUID();
      const job={id,repo:settings.repo,created:Date.now()};
      // Save before sending: after a timeout the server may still have accepted the request.
      await chrome.storage.local.set({lastJob:job});
      const result=await github(settings,`/actions/workflows/${WORKFLOW}/dispatches`,{ref:'main',inputs:{document_url:url,slug,category,request_id:id}});
      if(result?.workflow_run_id) job.runId=result.workflow_run_id;
      await chrome.storage.local.set({lastJob:job});
      respond({ok:true,job});
    } finally { dispatching=false; }
  })().catch(error=>respond({ok:false,error:error.message}));
  return true;
});
