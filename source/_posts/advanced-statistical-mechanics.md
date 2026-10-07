---
title: 高等统计力学
date: '2026-06-20'
updated: '2026-06-20'
permalink: notes/advanced-statistical-mechanics/
description: 高等统计力学笔记与公式参考资料。
categories:
- 课程笔记
tags:
- 课程笔记
- 统计力学
katex: true
comments: false
---

<div class="statmech-hero">
  <div>
    <p class="statmech-kicker">Advanced Statistical Mechanics</p>
    <h2>为博士资格考试建立一份可持续更新的复习底稿</h2>
    <p>这门课是我当前方向的重要基础课，也是博士资格考试相关课程。当前目标很明确：课程最终成绩如果大于 82，就可以免博士资格考试。因此这页优先服务三个目标：把核心概念闭环、把公式推导变成可复现的检查表、把看视频时的实时理解沉淀下来。</p>
  </div>
  <div class="statmech-score-card">
    <span>Target</span>
    <strong>&gt; 82</strong>
    <small>免博资考线</small>
  </div>
</div>

<div class="statmech-status-grid">
  <div>
    <span>Current stage</span>
    <strong>第一轮复习</strong>
    <small>先建立讲义、参考纸和实时笔记入口。</small>
  </div>
  <div>
    <span>Update mode</span>
    <strong>随视频追加</strong>
    <small>每次追加“卡点、理解、仍不确定处”。</small>
  </div>
  <div>
    <span>Public status</span>
    <strong>Noindex</strong>
    <small>页面可访问，但不主动提交搜索收录。</small>
  </div>
</div>

<h2 id="基础资料">基础资料</h2><div class="resource-grid statmech-resource-grid">
  <a class="resource-card" href="/notes/statistical-physics/">
    <span class="resource-type">Prerequisite</span>
    <strong>本科热统基础笔记</strong>
    <small>高等统计物理的前置复习底稿，已生成 TeX/PDF 初版。</small>
  </a>
  <a class="resource-card" href="/downloads/advanced-statistical-mechanics/advanced-statistical-mechanics-notes.pdf">
    <span class="resource-type">PDF · 61 pages</span>
    <strong>高等统计力学讲义整理</strong>
    <small>当前基线版已追加自整理经典题型附录，适合按章节重读、补推导和标注不理解处。</small>
  </a>
  <a class="resource-card" href="/downloads/advanced-statistical-mechanics/advanced-statistical-mechanics-reference-sheet.pdf">
    <span class="resource-type">PDF · 53 pages</span>
    <strong>参考纸基线版</strong>
    <small>当前版本主要用于快速查公式和定义；后续会改写、压缩成真正考前版。</small>
  </a>
  <a class="resource-card" target="_blank" rel="noopener" href="https://github.com/Muatyz/review-sheet/tree/main/%E9%AB%98%E7%AD%89%E7%BB%9F%E8%AE%A1%E7%89%A9%E7%90%86">
    <span class="resource-type">Source reference</span>
    <strong>Muatyz / review-sheet</strong>
    <small>当前基线资料参考该公开仓库的高等统计物理部分；不是我的原创资料。</small>
  </a>
</div>

<div class="statmech-attribution">
  <strong>来源说明：</strong>本页当前上传的讲义整理和参考纸属于复习基线材料，参考自师兄公开仓库 <a target="_blank" rel="noopener" href="https://github.com/Muatyz/review-sheet/tree/main/%E9%AB%98%E7%AD%89%E7%BB%9F%E8%AE%A1%E7%89%A9%E7%90%86">Muatyz/review-sheet 的“高等统计物理”目录</a>。我不会把这些材料声明为原创。由于该仓库目前没有明确 LICENSE，这里先链接原始 TeX 来源而不直接转载完整 TeX。讲义 PDF 末尾新增的“经典题型附录”是我基于 Pathria &amp; Beale 经典题型结构和本机旧高统作业主题改写的复习索引，不逐字复制教材或作业原题。
</div>

<h2 id="实时复习笔记">实时复习笔记</h2><p>下面是后续看课程视频时持续追加的工作区。每条笔记尽量按“视频位置 / 主题 / 我的问题 / 现在的理解 / 还不确定的地方”来写，方便之后整理成正式复习材料。</p>
<h3 id="2026-06-20-·-初始版本">2026-06-20 · 初始版本</h3><ul>
<li>已放入当前版本的讲义整理和参考纸，作为第一轮复习入口。</li>
<li>已补充来源说明：当前基线资料参考 Muatyz/review-sheet，不声明为原创。</li>
<li>当前页面先设置为 <code>noindex</code>，避免在内容还没有完全改写前被搜索引擎主动收录。</li>
<li>后续重点不是继续堆公式，而是把每个公式背后的物理图像、适用条件、典型题型和口试问法补齐。</li>
</ul>
<h3 id="2026-06-21-·-经典题型附录">2026-06-21 · 经典题型附录</h3><ul>
<li>在讲义 PDF 末尾追加 15 页自整理经典题型附录。</li>
<li>题型来源：Pathria &amp; Beale 的经典章节结构 + 本机旧高统作业 HW4/HW5 中出现过的主题 + 讲义第三章往年卷中 2025 Spring 的题目轮廓。</li>
<li>覆盖内容：正则系综恒等式、巨正则系综、谐振子、二能级系统、van der Waals 临界点、Maxwell 等面积、Landau 临界指数、能量/粒子数涨落、Bose/Fermi 单态占据，以及 2025 Spring 的概念解释、Liouville、Virial、二能级、三自旋 Ising、Langevin 重构题。</li>
<li>原则：只保留题型、推导路线和关键结果，不直接公开完整原作业答案。</li>
</ul>
<h2 id="后续整理路线">后续整理路线</h2><div class="statmech-roadmap">
  <div>
    <span>01</span>
    <strong>系综与热力学势</strong>
    <small>配分函数、自由能、Legendre 变换、巨正则系综。</small>
  </div>
  <div>
    <span>02</span>
    <strong>涨落与响应</strong>
    <small>涨落公式、关联函数、响应函数、susceptibility。</small>
  </div>
  <div>
    <span>03</span>
    <strong>相变与平均场</strong>
    <small>序参量、Landau 理论、临界指数、近似失效条件。</small>
  </div>
  <div>
    <span>04</span>
    <strong>考前压缩版</strong>
    <small>把 53 页参考纸改写成真正可背诵、可快速定位的版本。</small>
  </div>
</div>

<h2 id="给自己的复习规则">给自己的复习规则</h2><ol>
<li>每次看视频后，先写“我到底卡在哪里”，不要只复制板书。</li>
<li>每个重要公式都补一句物理含义和一句适用条件。</li>
<li>每个章节至少整理一个典型题型或口试问法。</li>
<li>借鉴材料必须标注来源；后续自己改写的内容要和原始基线分开。</li>
</ol>
