---
title: 自适应 K 与非负约束网络
date: '2026-06-13'
updated: '2026-06-13'
permalink: notes/adaptive-k-nnc/
description: 整理自适应维数和非负约束网络的研究记录与结果。
categories:
- 研究笔记
tags:
- 网络结构
- 数值研究
katex: true
comments: false
---

<p>这份笔记整理两个相关但不能混在一起的问题：</p>
<ol>
<li>自适应网络如何找到有效维度 <code>K</code>？</li>
<li>NNC / nonnegative similarity matching 为什么会表现得像聚类或特征发现？</li>
</ol>
<p>一句话先说结论：</p>
<blockquote>
<p>自适应找 <code>K</code> 主要是谱选择问题；NNC 的意义主要是把相似度结构压进非负的 activity slots，因此在有簇结构的数据上会自然表现成 soft clustering。</p>
</blockquote>
<hr>
<h2 id="1-两个-K-不是同一个东西">1. 两个 K 不是同一个东西</h2><p>在 similarity matching 这条线里，<code>K</code> 至少有两种含义。</p>
<p>第一种是 adaptive dimensionality reduction 里的 <code>K_eff</code>：</p>
<blockquote>
<p>输入协方差谱里有多少个方向足够强，网络就保留多少个有效输出维度。</p>
</blockquote>
<p>这里的核心对象是输入协方差矩阵：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">C_x = E[x x.T]</span><br></pre></td></tr></table></figure>

<p>如果 <code>C_x</code> 的前几个 eigenvalues 很大，后面突然掉下去，那么一个带阈值的自适应网络就可以把高于阈值的方向保留下来，把低于阈值的方向关掉。这个 <code>K_eff</code> 是数据依赖的，不一定需要手动指定。</p>
<p>第二种是 NNC / NSM 里的 output slots 数量：</p>
<blockquote>
<p>给网络几个非负输出单元，让它用这些单元解释样本之间的相似度。</p>
</blockquote>
<p>如果数据天然有几个簇，这些非负单元就很容易变成 soft cluster membership。这个 <code>K</code> 更像“我给网络几个簇/特征槽位”。</p>
<p>所以更准确的区分是：</p>
<table>
<thead>
<tr>
<th>问题</th>
<th>更接近哪种 K</th>
<th>网络在做什么</th>
</tr>
</thead>
<tbody><tr>
<td>数据有几个重要变化方向？</td>
<td><code>K_eff</code></td>
<td>谱阈值 / effective dimensionality selection</td>
</tr>
<tr>
<td>数据能否被几个非负模式解释？</td>
<td>NNC slots</td>
<td>soft clustering / sparse feature discovery</td>
</tr>
</tbody></table>
<hr>
<h2 id="2-自适应找-K：不是神秘地数簇，而是看谱">2. 自适应找 K：不是神秘地数簇，而是看谱</h2><p>假设输入数据的协方差谱长这样：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">lambda_1, lambda_2, lambda_3, ..., lambda_D</span><br></pre></td></tr></table></figure>

<p>如果前几个 eigenvalues 明显大，说明输入里有几个强方向。它们可能对应总浓度、分子族、共同背景、或者某些 dominant chemical blocks。</p>
<p>自适应找 <code>K</code> 的最简单版本就是：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">K_eff = count(lambda_i &gt; threshold)</span><br></pre></td></tr></table></figure>

<p>这听起来很朴素，但它有一个重要含义：</p>
<blockquote>
<p>网络不需要预先知道“应该保留 6 个还是 7 个方向”。只要阈值和输入统计固定，活跃维度数会自动由数据谱决定。</p>
</blockquote>
<p>更柔和一点的版本不是硬关掉，而是 soft threshold：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">lambda_y_i = max(lambda_x_i - theta, 0)</span><br></pre></td></tr></table></figure>

<p>这时强方向被保留但压缩，弱方向可能被压到接近 0。它不是完整 PCA whitening，而是带阈值的谱压缩。</p>
<hr>
<h2 id="3-为什么这对嗅觉预处理有意义">3. 为什么这对嗅觉预处理有意义</h2><p>ORN response 里常见的问题是：很多 ORN 一起动。</p>
<p>一起动的原因可能不是具体气味身份，而是：</p>
<ul>
<li>总浓度变大；</li>
<li>某个分子族整体增强；</li>
<li>背景刺激共同影响很多 ORN；</li>
<li>receptor sensitivity 矩阵太稠密，导致所有 ORN 都共享一个强轴。</li>
</ul>
<p>这些共同轴会表现为 covariance spectrum 里的大 eigenvalues。</p>
<p>LC / adaptive SM 的价值就在这里：</p>
<blockquote>
<p>它优先看见强共同方向，并通过 lateral feedback 把这些方向压小，让输出 <code>y</code> 的谱更平。</p>
</blockquote>
<p>所以 <code>K</code> 越大，经常越能去相关，不是因为它“删除了前 K 个 PCA component”，而是因为侧向通道更多，可以覆盖更多种共享模式。</p>
<p>但 <code>K</code> 不是越大越无脑好：</p>
<ul>
<li>主导相关结构处理完以后，继续增加 <code>K</code> 的收益会饱和；</li>
<li>样本少时，过大的 <code>K</code> 可能学到噪声；</li>
<li>如果反馈过强，可能压掉任务相关信息；</li>
<li>LC 是 partial whitening，不是精确 whitening。</li>
</ul>
<hr>
<h2 id="4-NNC-的目标：保留样本之间的相似度">4. NNC 的目标：保留样本之间的相似度</h2><p>普通 similarity matching 的核心目标可以粗略写成：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">min_Y || X.T X - Y.T Y ||_F^2</span><br></pre></td></tr></table></figure>

<p>意思是：</p>
<blockquote>
<p>如果两个样本在输入里相似，那么输出里也应该相似；如果输入里不同，输出里也应该不同。</p>
</blockquote>
<p>NNC / nonnegative similarity matching 加了非负约束：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">Y &gt;= 0</span><br></pre></td></tr></table></figure>

<p>这个约束很重要。没有非负约束时，输出单元可以正负抵消，更像线性子空间坐标。加了非负约束后，每个输出单元更像一个“存在量”：</p>
<ul>
<li>某个 feature 出现了多少；</li>
<li>某个 odor family 被激活了多少；</li>
<li>某个 soft cluster membership 有多强。</li>
</ul>
<p>这就是为什么 NNC 会自然连接到聚类和 sparse feature discovery。</p>
<hr>
<h2 id="5-为什么-NNC-会像-k-means">5. 为什么 NNC 会像 k-means</h2><p>如果数据有清楚的簇，同一簇内部样本彼此相似，不同簇之间相似度低，那么 <code>X.T X</code> 会出现块状结构：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><span class="line">同簇样本: high similarity</span><br><span class="line">异簇样本: low similarity</span><br></pre></td></tr></table></figure>

<p>NNC 要用非负输出 <code>Y</code> 重建这个相似度结构：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">Y.T Y ≈ X.T X</span><br></pre></td></tr></table></figure>

<p>最省力的做法是什么？</p>
<p>让同一簇的样本激活同一个输出单元。这样：</p>
<ul>
<li>同簇样本因为共享输出单元，所以 <code>Y.T Y</code> 大；</li>
<li>异簇样本激活不同输出单元，所以 <code>Y.T Y</code> 小。</li>
</ul>
<p>这就很像 k-means。</p>
<p>但 NNC 和 k-means 不完全一样：</p>
<table>
<thead>
<tr>
<th>k-means</th>
<th>NNC / NSM</th>
</tr>
</thead>
<tbody><tr>
<td>显式最小化点到中心的距离</td>
<td>匹配样本两两相似度</td>
</tr>
<tr>
<td>通常 hard assignment</td>
<td>可以 soft assignment</td>
</tr>
<tr>
<td>每个点主要属于一个中心</td>
<td>一个样本可以激活多个非负 feature</td>
</tr>
<tr>
<td>更像几何聚类算法</td>
<td>更像神经活动的非负相似度分解</td>
</tr>
</tbody></table>
<p>所以更安全的说法是：</p>
<blockquote>
<p>NNC 在 well-segregated data 上会表现得像 soft k-means，但它本质上是在做非负相似度匹配。</p>
</blockquote>
<hr>
<h2 id="6-我跑的小实验">6. 我跑的小实验</h2><p>我新增了脚本：</p>
<figure class="highlight text"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">scripts/experiment_adaptive_k_nnc_research.py</span><br></pre></td></tr></table></figure>

<p>它做两个演示。</p>
<p>第一个演示：构造一个有明显谱断点的数据集，然后看不同 threshold 下有多少 active dimensions。结果显示，gap rule 给出 <code>K=6</code>，tail noise floor rule 给出 <code>K=7</code>。这说明自适应找 <code>K</code> 其实是在问：</p>
<blockquote>
<p>哪些 covariance eigenvalues 足够大，值得作为有效维度保留？</p>
</blockquote>
<p>第二个演示：构造 4 个正值簇，用非负相似度分解代理 NNC / NSM 的直觉。结果是：</p>
<table>
<thead>
<tr>
<th align="right">K</th>
<th align="right">相似度重建误差</th>
<th align="right">ARI</th>
</tr>
</thead>
<tbody><tr>
<td align="right">2</td>
<td align="right">0.132</td>
<td align="right">0.363</td>
</tr>
<tr>
<td align="right">3</td>
<td align="right">0.078</td>
<td align="right">0.640</td>
</tr>
<tr>
<td align="right">4</td>
<td align="right">0.018</td>
<td align="right">0.794</td>
</tr>
<tr>
<td align="right">5</td>
<td align="right">0.016</td>
<td align="right">0.802</td>
</tr>
<tr>
<td align="right">6</td>
<td align="right">0.015</td>
<td align="right">0.819</td>
</tr>
<tr>
<td align="right">7</td>
<td align="right">0.013</td>
<td align="right">0.801</td>
</tr>
<tr>
<td align="right">8</td>
<td align="right">0.012</td>
<td align="right">0.802</td>
</tr>
</tbody></table>
<p>解释：</p>
<ul>
<li><code>K=2,3</code> 太小，几个真实簇被合并；</li>
<li><code>K=4</code> 已经进入主要平台，说明非负槽位基本抓住了 4 个簇；</li>
<li><code>K&gt;4</code> 继续降低 reconstruction error，但更多是在分裂子结构，而不是发现全新的主簇。</li>
</ul>
<p>图在这里：</p>
<p><img src="/images/adaptive-k-nnc-research-summary.png" alt="Adaptive K and NNC research summary"></p>
<hr>
<h2 id="7-可以变成论文-网站里的核心表达">7. 可以变成论文/网站里的核心表达</h2><p>我建议之后这样写：</p>
<blockquote>
<p>Adaptive similarity-matching networks provide a principled way to select an effective dimensionality from the input covariance spectrum. In contrast, nonnegative similarity matching gives the lateral population a different interpretation: each nonnegative activity dimension can act as a soft feature or cluster slot. Thus, adaptive LC-style circuits are naturally suited for spectral decorrelation and partial whitening, whereas NNC-style circuits connect the same similarity-matching principle to clustering and feature discovery.</p>
</blockquote>
<p>中文可以写成：</p>
<blockquote>
<p>自适应 SM/LC 主要回答“输入里有多少个值得保留或压缩的强统计方向”；NNC 则进一步回答“这些统计结构能否被几个非负的 feature / cluster 槽位解释”。前者更接近谱选择和 partial whitening，后者更接近 soft clustering 和 sparse feature discovery。</p>
</blockquote>
<hr>
<h2 id="8-下一步最值得做的实验">8. 下一步最值得做的实验</h2><p>下一步不要只做 toy data。可以直接接到你的 olfactory synthetic data：</p>
<ol>
<li>对 ORN <code>x</code> 的 covariance spectrum 做 threshold scan，估计 <code>K_eff</code>。</li>
<li>对 LC 的不同 <code>K</code> 画 spectrum flattening、mean offdiag corr、effective dimension。</li>
<li>对 NNC 的不同 <code>K</code> 画 <code>z</code> activity heatmap，看它是否对应 odor family / molecular block。</li>
<li>用 ARI/NMI 比较 NNC active slots 和真实 block labels。</li>
<li>看 <code>K</code> 从小到大时，是先恢复主簇，还是只是降低 similarity reconstruction error。</li>
</ol>
<p>这样就能把“找 K”和“NNC 聚类意义”连接回你的嗅觉预处理主题。</p>
