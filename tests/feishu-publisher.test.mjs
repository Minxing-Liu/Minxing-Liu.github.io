import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {convertBlocks,importDocument,Feishu} from '../tools/feishu-import.mjs';
import {documentUrl,slugValue,github,findRun,runStatus} from '../extensions/feishu-publisher/core.mjs';

const text=content=>({elements:[{text_run:{content}}]});
const root='DocumentToken123';
function doc(children) { return {id:root,title:'线性代数：A & B',blocks:[{block_id:root,page:text('标题'),children:children.map(b=>b.block_id)},...children]}; }
const simple=()=>doc([{block_id:'p',text:text('第一版笔记')}]);
async function temporary(t) { const dir=await mkdtemp(path.join(tmpdir(),'feishu-test-')); t.after(()=>rm(dir,{recursive:true,force:true})); return dir; }

test('document URLs are restricted to Feishu docx/wiki, canonicalized, and slugs cannot escape paths',()=>{
  assert.equal(documentUrl('https://team.feishu.cn/docx/DocumentToken123?from=share#title').url,'https://team.feishu.cn/docx/DocumentToken123');
  assert.equal(documentUrl('https://team.feishu.cn/wiki/DocumentToken123').kind,'wiki');
  for(const input of ['http://team.feishu.cn/docx/DocumentToken123','https://feishu.cn.evil.com/docx/DocumentToken123','https://team.feishu.cn@evil.com/docx/DocumentToken123','https://team.feishu.cn:8080/docx/DocumentToken123','https://team.feishu.cn/doc/DocumentToken123']) assert.throws(()=>documentUrl(input));
  for(const input of ['../oops','Notes','$(whoami)','a/b']) assert.throws(()=>slugValue(input));
});

test('rich content preserves nested lists, TeX, code and downloaded images without executing HTML',async()=>{
  const document=doc([
    {block_id:'h',heading2:text('定义')},
    {block_id:'p',text:{elements:[{text_run:{content:'<script>alert(1)</script> $5 '}},{equation:{content:'x^2 + y^2'}}]}},
    {block_id:'l',bullet:text('外层'),children:['nested']},
    {block_id:'eq',equation:{elements:[{equation:{content:'\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}'}}]}},
    {block_id:'c',code:text('const x = `<script>`;\n```\n{% raw %}')},
    {block_id:'im',image:{token:'ImageToken123',caption:{content:'手推公式'}}}
  ]);
  document.blocks.push({block_id:'nested',bullet:text('内层')});
  const md=await convertBlocks(document.blocks,root,async()=>'/images/feishu/test/a.png');
  assert.match(md,/## 定义/); assert.match(md,/  - 内层/); assert.match(md,/\$x\^2 \+ y\^2\$/);
  assert.match(md,/\$\$\n\\begin\{pmatrix\}/); assert.match(md,/````\nconst x/);
  assert.match(md,/&lt;script&gt;/); assert.match(md,/!\[手推公式\]\(\/images\/feishu\/test\/a.png\)/);
});

test('unsupported components, missing blocks, dangerous links and invalid math stop conversion',async()=>{
  for(const block of [
    {block_id:'b',block_type:43,board:{}},
    {block_id:'b',text:text('parent'),children:['missing']},
    {block_id:'b',text:{elements:[{text_run:{content:'link',text_element_style:{link:{url:'javascript:alert(1)'}}}}]}},
    {block_id:'b',equation:text('\\notARealCommand{x}')}
  ]) { const d=doc([block]); await assert.rejects(convertBlocks(d.blocks,root,async()=>'')); }
});

test('tables preserve simple cells and reject merged cells',async()=>{
  const document=doc([{block_id:'table',table:{property:{row_size:1,column_size:2,header_row:true},cells:['cell1','cell2']},children:['cell1','cell2']}]);
  document.blocks.push({block_id:'cell1',table_cell:{},children:['a']},{block_id:'cell2',table_cell:{},children:['b']},{block_id:'a',text:text('A')},{block_id:'b',text:text('B')});
  assert.equal(await convertBlocks(document.blocks,root,async()=>''),'| A | B |\n| --- | --- |\n');
  document.blocks[1].table.property.merge_info=[{row_span:2,col_span:1}];
  await assert.rejects(convertBlocks(document.blocks,root,async()=>''),/合并/);
});

test('repeat import is idempotent, updates in place, retains original date and detects local edits',async t=>{
  const dir=await temporary(t), client={image:async()=>{throw new Error('unexpected image');}};
  const first=await importDocument({root:dir,client,document:simple(),slug:'linear-algebra',now:new Date('2026-10-01T00:00:00Z')});
  assert.equal(first.slug,'linear-algebra');
  const file=path.join(dir,'source/_posts/linear-algebra.md');
  const initial=await readFile(file,'utf8');
  await importDocument({root:dir,client,document:simple(),now:new Date('2026-10-02T00:00:00Z')});
  assert.equal(await readFile(file,'utf8'),initial);
  const document=simple(); document.blocks[1].text=text('更新后的笔记');
  await importDocument({root:dir,client,document,now:new Date('2026-10-03T00:00:00Z')});
  const updated=await readFile(file,'utf8');
  assert.match(updated,/date: "2026-10-01T00:00:00.000Z"/); assert.match(updated,/updated: "2026-10-03/); assert.match(updated,/更新后的笔记/); assert.match(updated,/disableNunjucks: true/);
  assert.equal((await readdir(path.dirname(file))).length,1);
  assert.ok(!(await readFile(path.join(dir,'data/feishu-posts.json'),'utf8')).includes(root));
  await assert.rejects(importDocument({root:dir,client,document,slug:'different'}),/已固定/);
  await writeFile(file,updated+'本地修改\n');
  await assert.rejects(importDocument({root:dir,client,document}),/仓库中被修改/);
});

test('image failure and filename collisions do not write partial posts',async t=>{
  const dir=await temporary(t);
  const document=doc([{block_id:'i',image:{token:'ImageToken123'}}]);
  await assert.rejects(importDocument({root:dir,document,client:{image:async()=>{throw new Error('image unavailable');}}}),/unavailable/);
  assert.deepEqual(await readdir(dir),[]);
  await importDocument({root:dir,document:simple(),slug:'occupied',client:{}});
  const other=simple(); other.id='OtherDocument123'; other.blocks[0].block_id=other.id;
  await assert.rejects(importDocument({root:dir,document:other,slug:'occupied',client:{}}),/被其他文章使用/);
});

test('images are local, content-addressed and reused',async t=>{
  const dir=await temporary(t); let downloads=0;
  const document=doc([{block_id:'i',image:{token:'ImageToken123'}},{block_id:'j',image:{token:'ImageToken123'}}]);
  const result=await importDocument({root:dir,document,client:{image:async()=>{downloads++;return {bytes:Buffer.from('fixture image'),ext:'png'};}}});
  assert.equal(downloads,1); assert.equal(result.images,1);
  assert.equal((await readdir(path.join(dir,'source/images/feishu',result.slug))).length,1);
});

test('Feishu client handles auth, pagination and document revisions',async()=>{
  let metadataReads=0, pages=0;
  const client=new Feishu('app','secret',async(url,options)=>{
    let data;
    if(url.endsWith('/internal')) { assert.equal(JSON.parse(options.body).app_secret,'secret'); return Response.json({code:0,tenant_access_token:'fake'}); }
    assert.equal(options.headers.Authorization,'Bearer fake');
    if(url.includes('/blocks?')) { pages++; data=pages===1 ? {items:[simple().blocks[0]],has_more:true,page_token:'page 2'} : {items:[simple().blocks[1]],has_more:false}; }
    else { metadataReads++; data={document:{title:'Test',revision_id:5}}; }
    return Response.json({code:0,data});
  });
  await client.login(); const result=await client.document('https://team.feishu.cn/docx/'+root);
  assert.equal(result.blocks.length,2); assert.equal(pages,2); assert.equal(metadataReads,2);
  const denied=new Feishu('app','secret',async()=>Response.json({code:99991400,msg:'private secret data'}));
  await assert.rejects(denied.login(),error=>/99991400/.test(error.message) && !error.message.includes('private secret'));
  let version=0;
  client.request=async endpoint=>endpoint.includes('/blocks?') ? {items:[],has_more:false} : {document:{title:'changing',revision_id:++version}};
  await assert.rejects(client.document('https://team.feishu.cn/docx/'+root),/发生了修改/);
});

test('bad image responses fail instead of publishing HTML as a picture',async()=>{
  const client=new Feishu('app','secret',async()=>new Response('<html>sign in</html>',{status:200}));
  await assert.rejects(client.image('ImageToken123'),/无法识别/);
});

test('GitHub dispatch acceptance is not publication success, status matches unique request ID',async()=>{
  let called;
  assert.equal(await github({repo:'Minxing-Liu/Minxing-Liu.github.io',token:'fake'},'/dispatches',{ref:'main'},async(url,options)=>{called={url,options};return new Response(null,{status:204});}),null);
  assert.ok(called.url.startsWith('https://api.github.com/repos/')); assert.equal(called.options.method,'POST');
  const run=findRun([{display_title:'Feishu publish other',event:'workflow_dispatch'},{id:12,display_title:'Feishu publish request',event:'workflow_dispatch',status:'queued'}],'request');
  assert.equal(run.id,12); assert.ok(!runStatus(run).includes('已发布')); assert.ok(!runStatus(null).includes('已发布'));
  assert.match(runStatus({...run,status:'completed',conclusion:'success'}),/已发布/);
  assert.match(runStatus({...run,status:'completed',conclusion:'failure'}),/未完成/);
});
