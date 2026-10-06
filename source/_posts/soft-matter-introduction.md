---
title: 软物质导论
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-introduction/
description: 理解软物质的尺度、相互作用与热涨落。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 张何朋<br>English version: <a href="/notes/soft-matter-introduction/">Introduction</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>软物质不是一种材料，而是一类物理体系：胶体、聚合物、液晶、表面活性剂、凝胶、泡沫、乳液、生物膜、活性物质等都属于软物质。它们共同的特点是：能量尺度接近热涨落，结构尺度介于分子和宏观之间，响应很容易被外场、边界和熵改变。</p>
<h2 id="为什么“软”">为什么“软”</h2><p>软物质的刚度通常远低于金属和晶体。小能量就能产生大形变，所以热涨落、熵和边界条件不能被忽略。</p>
<div class="equation-block">
  <div><span class="eq-left">thermal</span><span class="eq-op">=</span><span>\(k_B T\approx4.1\,\mathrm{pN\,nm}\) at room temperature</span></div>
  <div><span class="eq-left">softness</span><span class="eq-op">=</span><span>interaction energy often comparable to \(k_B T\)</span></div>
  <div><span class="eq-left">entropy</span><span class="eq-op">=</span><span>\(F=U-TS\)</span></div>
</div>

<p>如果相互作用能量大约是几个 k_B T，结构可以热涨落、重排和自组装；如果远大于 k_B T，体系更容易被困在不可逆结构中。</p>
<h2 id="中观尺度">中观尺度</h2><p>软物质常见结构尺寸在纳米到微米之间。这一尺度足够大，可以显微观察；又足够小，布朗运动和热涨落仍然显著。</p>
<div class="equation-block">
  <div><span class="eq-left">colloid</span><span class="eq-op">=</span><span>\(10\,\mathrm{nm}\sim10\,\mu\mathrm{m}\)</span></div>
  <div><span class="eq-left">polymer</span><span class="eq-op">=</span><span>chain conformation controlled by entropy</span></div>
  <div><span class="eq-left">membrane</span><span class="eq-op">=</span><span>2D fluid surface with bending elasticity</span></div>
</div>

<h2 id="常用无量纲数">常用无量纲数</h2><p>软物质问题经常先比较不同物理效应的强弱。考试中看到一个新体系，先判断主导机制。</p>
<div class="equation-block">
  <div><span class="eq-left">Re</span><span class="eq-op">=</span><span>\(\rho U L/\eta\)</span></div>
  <div><span class="eq-left">Pe</span><span class="eq-op">=</span><span>\(UL/D\)</span></div>
  <div><span class="eq-left">Ca</span><span class="eq-op">=</span><span>\(\eta U/\gamma\)</span></div>
  <div><span class="eq-left">energy</span><span class="eq-op">=</span><span>\(U_{\mathrm{interaction}}/k_B T\)</span></div>
</div>

<p>Re 比较惯性和粘性；Pe 比较对流和扩散；Ca 比较粘性应力和表面张力；U/k_B T 判断热涨落能否改变结构。</p>
<h2 id="本课程主线">本课程主线</h2><ol>
<li>流体动力学：软物质通常处在低 Reynolds number 环境，粘性支配运动。</li>
<li>弹性：凝胶、网络、膜和细杆都需要弹性自由能描述。</li>
<li>布朗运动：热噪声驱动扩散，也是胶体和聚合物统计物理的基础。</li>
<li>相与自组装：硬球、胶体、液晶、聚合物溶液都可以通过熵和相互作用形成结构。</li>
<li>界面与膜：表面张力和曲率能决定液滴、泡沫、乳液和生物膜的形状。</li>
</ol>
<h2 id="考试抓手">考试抓手</h2><p>先问四件事：能量是否约为 k_B T？长度尺度是否中观？动力学是粘性还是惯性主导？结构是由能量最小化还是熵最大化控制？多数软物质题都可以从这四个问题开始。</p>
