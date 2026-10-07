import {createHash} from 'node:crypto';
import {readFile, writeFile, mkdir, access} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import katex from 'katex';
import {documentUrl, slugValue} from '../extensions/feishu-publisher/core.mjs';

const BASE = 'https://open.feishu.cn/open-apis';
const hash = value => createHash('sha256').update(value).digest('hex');
const safeToken = value => {
  if (!/^[A-Za-z0-9_-]{8,200}$/.test(value ?? '')) throw new Error('飞书返回了无效的资源标识。');
  return value;
};
const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/[\\`*_{}\[\]()#+.!|~$-]/g,'\\$&');
const html = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safeLink(value) {
  let u;
  try { u = new URL(value); } catch { try { u = new URL(decodeURIComponent(value)); } catch { throw new Error('文档含无法识别的链接。'); } }
  if (!['http:','https:','mailto:'].includes(u.protocol)) throw new Error('文档含不支持的链接协议。');
  return u.href.replace(/[<>"'()\s]/g,c=>encodeURIComponent(c));
}
function math(value, display = false) {
  if (!value?.trim() || value.includes('$$') || (!display && /\n/.test(value))) throw new Error('公式为空或含不支持的分隔符，请在飞书公式组件中调整。');
  try { katex.renderToString(value, {displayMode: display, throwOnError: true, trust: false, strict: 'error', maxExpand: 1000}); }
  catch { throw new Error('有公式未通过 KaTeX 检查，请检查飞书公式语法后重试。'); }
  return display ? `$$\n${value}\n$$` : `$${value}$`;
}
function inline(text, raw = false) {
  return (text?.elements ?? []).map(element => {
    if (element.equation) return raw ? element.equation.content : math(element.equation.content);
    if (element.mention_doc || element.link_preview) {
      const item = element.mention_doc ?? element.link_preview;
      if (raw) return item.title || item.url;
      return `[${escape(item.title || item.url)}](${safeLink(item.url)})`;
    }
    if (!element.text_run) throw new Error('暂不支持 @人员、提醒、内联附件等元素；请改成普通文字或链接。');
    const {content = '', text_element_style: style = {}} = element.text_run;
    if (raw) return content;
    let result = escape(content).replace(/\n/g,'  \n');
    if (style.inline_code) result = `<code>${html(content)}</code>`;
    else {
      if (style.bold) result = `<strong>${result}</strong>`;
      if (style.italic) result = `<em>${result}</em>`;
      if (style.strikethrough) result = `<del>${result}</del>`;
      if (style.underline) result = `<u>${result}</u>`;
    }
    if (style.link?.url) result = `[${result}](${safeLink(style.link.url)})`;
    return result;
  }).join('');
}

export async function convertBlocks(blocks, rootId, imageLoader) {
  const map = new Map(blocks.map(block=>[block.block_id, block]));
  if (map.size !== blocks.length) throw new Error('飞书返回了重复的内容块，请稍后重试。');
  const seen = new Set();
  async function children(block) {
    const parts = [];
    for (const id of block.children ?? []) parts.push(await render(id));
    return parts.filter(Boolean).join('\n\n');
  }
  async function render(id) {
    const b = map.get(id);
    if (!b || seen.has(id)) throw new Error('文档内容块不完整或结构异常，已停止发布。');
    seen.add(id);
    if (b.page || b.table_cell) return children(b);
    if (b.image) {
      if (b.children?.length) throw new Error('暂不支持含嵌套内容的图片。');
      return `![${escape(b.image.caption?.content || '插图')}](${await imageLoader(b.image.token)})`;
    }
    if (b.table) {
      const {row_size: rows, column_size: cols, merge_info: merges = []} = b.table.property || {};
      if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || (b.table.cells?.length !== rows * cols) || merges.some(m=>m.row_span>1 || m.col_span>1))
        throw new Error('暂不支持合并单元格或结构异常的表格。');
      const cells = [];
      for (const cell of b.table.cells) {
        const value = await render(cell);
        if (value.includes('$$') || value.includes('```') || /\n(?:#|>|- |\d+\. )/.test('\n'+value)) throw new Error('表格内仅支持普通文字、链接和行内公式。');
        cells.push(value.replace(/(?<!\\)\|/g,'\\|').replace(/\n/g,'<br>'));
      }
      const lines = [];
      // Markdown always needs a header. Preserve a table without header by inserting an empty one.
      if (!b.table.property.header_row) lines.push('| '+Array(cols).fill(' ').join(' | ')+' |');
      for (let i=0; i<rows; i++) {
        lines.push('| '+cells.slice(i*cols,(i+1)*cols).join(' | ')+' |');
        if (i === 0 && b.table.property.header_row) lines.push('| '+Array(cols).fill('---').join(' | ')+' |');
      }
      if (!b.table.property.header_row) lines.splice(1,0,'| '+Array(cols).fill('---').join(' | ')+' |');
      return lines.join('\n');
    }
    if (b.callout || b.quote_container) return (await children(b)).split('\n').map(line=>'> '+line).join('\n');
    let own;
    const heading = Object.keys(b).find(key=>/^heading[1-9]$/.test(key));
    if (heading) own = '#'.repeat(Math.min(6,Number(heading.slice(7))))+' '+inline(b[heading]);
    else if (b.text) own = inline(b.text);
    else if (b.equation) own = math(inline(b.equation,true),true);
    else if (b.code) {
      const code = inline(b.code,true);
      const fence = '`'.repeat(Math.max(3,...[...code.matchAll(/`+/g)].map(m=>m[0].length+1)));
      own = `${fence}\n${code}\n${fence}`;
    } else if (b.divider) own = '---';
    else if (b.bullet || b.ordered || b.todo) {
      const value = b.bullet ?? b.ordered ?? b.todo;
      const sequence = value.style?.sequence;
      const marker = b.bullet ? '- ' : b.todo ? `- [${value.style?.done ? 'x' : ' '}] ` : `${/^\d+$/.test(sequence) ? sequence : 1}. `;
      own = marker + inline(value).replace(/\n/g,'\n'+' '.repeat(marker.length));
      const sub = await children(b);
      return own + (sub ? '\n\n'+sub.split('\n').map(line=>' '.repeat(marker.length)+line).join('\n') : '');
    } else if (b.quote) own = inline(b.quote).split('\n').map(line=>'> '+line).join('\n');
    else throw new Error(`暂不支持飞书组件类型 ${b.block_type}。请将画板、附件、多维表格等改成图片/普通内容后重试。`);
    const sub = await children(b);
    return [own,sub].filter(Boolean).join('\n\n');
  }
  const result = await render(rootId);
  if (seen.size !== blocks.length) throw new Error('部分内容未能归入文档结构，已停止发布。');
  return result+'\n';
}

export class Feishu {
  constructor(appId, appSecret, fetcher = fetch) { this.appId=appId; this.appSecret=appSecret; this.fetcher=fetcher; }
  async request(endpoint, body) {
    const response = await this.fetcher(BASE+endpoint, {method:body?'POST':'GET', redirect:'error', headers:{'Content-Type':'application/json',...(this.token ? {Authorization:`Bearer ${this.token}`} : {})}, ...(body ? {body:JSON.stringify(body)} : {}), signal:AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`飞书接口 HTTP ${response.status}：请检查应用权限、文档授权；限流时稍后重试。`);
    const json = await response.json();
    if (json.code !== 0) throw new Error(`飞书接口错误 ${Number(json.code)}：检查应用版本已发布、权限已开通，并在原文档添加本应用。`);
    return json.data ?? json;
  }
  async login() {
    if (!this.appId || !this.appSecret) throw new Error('请先在仓库 Actions secrets 配置 FEISHU_APP_ID 和 FEISHU_APP_SECRET。');
    const data = await this.request('/auth/v3/tenant_access_token/internal',{app_id:this.appId,app_secret:this.appSecret});
    if (!data.tenant_access_token) throw new Error('飞书未返回应用访问凭证。');
    this.token = data.tenant_access_token;
  }
  async document(value) {
    const parsed = documentUrl(value);
    let id = parsed.token;
    if (parsed.kind === 'wiki') {
      const data = await this.request('/wiki/v2/spaces/get_node?token='+id);
      if (data.node?.obj_type !== 'docx') throw new Error('知识库节点必须是新版文档，暂不支持表格或旧版文档。');
      id = safeToken(data.node.obj_token);
    }
    const endpoint = '/docx/v1/documents/'+safeToken(id);
    const before = (await this.request(endpoint)).document;
    if (!before?.title || !Number.isInteger(before.revision_id)) throw new Error('无法读取文档标题或版本号。');
    const blocks=[], pages=new Set();
    let next='';
    do {
      if (pages.has(next) || pages.size >= 100) throw new Error('文档分页异常或超过 50000 块限制。');
      pages.add(next);
      const data = await this.request(endpoint+'/blocks?page_size=500&document_revision_id=-1'+(next?'&page_token='+encodeURIComponent(next):''));
      if (!Array.isArray(data.items)) throw new Error('飞书未返回文档内容块。');
      blocks.push(...data.items);
      next = data.has_more ? data.page_token : '';
      if (data.has_more && !next) throw new Error('飞书分页信息不完整。');
    } while(next);
    const after = (await this.request(endpoint)).document;
    if (after?.revision_id !== before.revision_id) throw new Error('读取期间文档发生了修改，请停止编辑片刻后重新发布。');
    return {id,title:before.title,blocks};
  }
  async image(token) {
    const response = await this.fetcher(BASE+'/drive/v1/medias/'+safeToken(token)+'/download', {headers:{Authorization:`Bearer ${this.token}`},redirect:'error',signal:AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`图片下载失败（${response.status}），请检查素材下载权限。`);
    const limit=20*1024*1024;
    if (Number(response.headers.get('content-length')) > limit) throw new Error('单张图片超过 20 MB，请压缩后重试。');
    const chunks=[]; let size=0;
    for await (const chunk of response.body) { size+=chunk.length; if(size>limit) throw new Error('单张图片超过 20 MB。'); chunks.push(chunk); }
    const bytes=Buffer.concat(chunks);
    const ext = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png' : bytes[0]===255 && bytes[1]===216 && bytes[2]===255 ? 'jpg' : /^GIF8[79]a/.test(bytes.subarray(0,6).toString()) ? 'gif' : bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP' ? 'webp' : null;
    if (!ext) throw new Error('图片需为 PNG、JPEG、GIF 或 WebP；无法识别下载内容。');
    return {bytes,ext};
  }
}

export async function importDocument({root=process.cwd(), document, client, slug='', category='', now=new Date()}) {
  const key=hash(document.id), indexFile=path.join(root,'data/feishu-posts.json');
  let index={};
  try { index=JSON.parse(await readFile(indexFile,'utf8')); } catch(error) { if(error.code!=='ENOENT') throw error; }
  const existing=index[key];
  slug=slugValue(slug) || existing?.slug || 'feishu-'+key.slice(0,12);
  if (existing && existing.slug!==slug) throw new Error('同一篇文档的网址简称已固定，请留空或使用原简称。');
  slugValue(slug);
  const postPath=path.join(root,'source/_posts',slug+'.md');
  if (!existing) {
    try { await access(postPath); throw new Error('该网址简称已被其他文章使用，请换一个。'); } catch(error) { if(error.code!=='ENOENT') throw error; }
  } else {
    const original=await readFile(postPath,'utf8');
    if (!original.includes(`feishu_key: "${key}"`)) throw new Error('目标文章的飞书绑定信息不匹配，已停止覆盖。');
    if (hash(original)!==existing.fileHash) throw new Error('文章在网站仓库中被修改过。请先将改动同步回飞书，再按说明解除冲突，避免覆盖本地修改。');
  }
  const images=new Map(), byToken=new Map(); let total=0;
  const body=await convertBlocks(document.blocks,document.id,async token=>{
    if (byToken.has(token)) return byToken.get(token);
    const {bytes,ext}=await client.image(token);
    total+=bytes.length;
    if(total>80*1024*1024) throw new Error('本篇图片合计超过 80 MB，请压缩后重试。');
    const name=hash(bytes).slice(0,24)+'.'+ext;
    images.set(name,bytes);
    const url=`/images/feishu/${slug}/${name}`; byToken.set(token,url); return url;
  });
  category=category.trim() || existing?.category || '数学工具';
  if(category.length>60 || /[\r\n]/.test(category)) throw new Error('分类需为 60 字以内的单行文字。');
  const date=existing?.date || now.toISOString();
  const contentHash=hash(JSON.stringify([document.title,body,category]));
  const updated=existing?.contentHash===contentHash ? existing.updated : now.toISOString();
  const fields={title:document.title,date,updated,permalink:`notes/${slug}/`,categories:[category],tags:[],katex:true,comments:false,disableNunjucks:true,feishu_key:key};
  const post='---\n'+Object.entries(fields).map(([k,v])=>`${k}: ${k==='permalink' ? v : JSON.stringify(v)}`).join('\n')+'\n---\n\n'+body;
  // No filesystem mutations until all content and downloads have passed validation.
  await mkdir(path.dirname(postPath),{recursive:true});
  const imageDir=path.join(root,'source/images/feishu',slug);
  if(images.size) await mkdir(imageDir,{recursive:true});
  for(const [name,bytes] of images) await writeFile(path.join(imageDir,name),bytes);
  await writeFile(postPath,post);
  index[key]={slug,date,updated,category,contentHash,fileHash:hash(post)};
  await mkdir(path.dirname(indexFile),{recursive:true});
  await writeFile(indexFile,JSON.stringify(index,null,2)+'\n');
  return {slug,images:images.size,changed:existing?.contentHash!==contentHash};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    const client=new Feishu(process.env.FEISHU_APP_ID,process.env.FEISHU_APP_SECRET);
    const value=process.env.FEISHU_DOCUMENT_URL;
    documentUrl(value ?? '');
    await client.login();
    const result=await importDocument({client,document:await client.document(value),slug:process.env.FEISHU_SLUG,category:process.env.FEISHU_CATEGORY});
    if(process.env.GITHUB_OUTPUT) await writeFile(process.env.GITHUB_OUTPUT,`slug=${result.slug}\n`,{flag:'a'});
    console.log(`导入完成：${result.slug}；图片 ${result.images} 张。`);
  } catch(error) {
    // Do not print fetch URLs, document tokens, response bodies or credentials.
    console.error(error instanceof TypeError ? '请求失败，请检查网络和文档链接后重试。' : error.message);
    process.exitCode=1;
  }
}
