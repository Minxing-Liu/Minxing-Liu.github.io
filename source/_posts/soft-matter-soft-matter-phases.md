---
title: 软物质的相与有序
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-soft-matter-phases/
description: 从序参量与自由能理解相变及有序结构。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 曹鑫<br>English version: <a href="/notes/soft-matter-soft-matter-phases/">Soft Matter Phases</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="胶体与热能尺度">胶体与热能尺度</h2><p>胶体是分散相悬浮在连续相中的体系，典型尺寸约 10 nm 到 10 um。胶体相互作用常用 k_B T 衡量。</p>
<div class="equation-block">
  <div><span class="eq-left">thermal</span><span class="eq-op">=</span><span>interaction comparable to \(k_BT\) is reversible</span></div>
  <div><span class="eq-left">diffusion</span><span class="eq-op">=</span><span>\(D=\frac{k_B T}{6\pi\eta R}\)</span></div>
  <div><span class="eq-left">MSD</span><span class="eq-op">=</span><span>\(\langle\Delta r^2\rangle=2dDt\)</span></div>
</div>

<h2 id="范德华吸引与电双层">范德华吸引与电双层</h2><div class="equation-block">
  <div><span class="eq-left">atoms</span><span class="eq-op">=</span><span>\(U(r)=-C/r^6\)</span></div>
  <div><span class="eq-left">plates</span><span class="eq-op">=</span><span>\(W(h)=-\frac{H}{12\pi h^2}\)</span></div>
  <div><span class="eq-left">spheres</span><span class="eq-op">=</span><span>\(U_{vdW}(h)\approx-\frac{HR}{12h}\)</span></div>
  <div><span class="eq-left">wall</span><span class="eq-op">=</span><span>\(U_{vdW}(h)\approx-\frac{HR}{6h}\)</span></div>
</div>

<p>带电表面附近形成 Stern 层和扩散层。盐浓度越高，Debye 长度越短，排斥越短程。</p>
<div class="equation-block">
  <div><span class="eq-left">Debye</span><span class="eq-op">=</span><span>\(\lambda_D=\sqrt{\frac{\epsilon_0\epsilon_r k_BT}{\sum_i q_i^2c_i}}\)</span></div>
  <div><span class="eq-left">screening</span><span class="eq-op">=</span><span>\(\phi(h)=\phi_0e^{-h/\lambda_D}\)</span></div>
  <div><span class="eq-left">Yukawa</span><span class="eq-op">=</span><span>\(\phi(r)\propto e^{-r/\lambda_D}/r\)</span></div>
  <div><span class="eq-left">zeta</span><span class="eq-op">=</span><span>\(U=\epsilon_0\epsilon_r\zeta E/\eta\)</span></div>
</div>

<h2 id="DLVO-理论">DLVO 理论</h2><p>DLVO 把电双层排斥和范德华吸引相加。高盐降低排斥势垒，导致胶体更容易聚集。</p>
<div class="equation-block">
  <div><span class="eq-left">DLVO</span><span class="eq-op">=</span><span>\(U_{DLVO}(h)=U_e(h)+U_{vdW}(h)\)</span></div>
  <div><span class="eq-left">repulsion</span><span class="eq-op">=</span><span>\(U_e(h)=Ae^{-h/\lambda_D}\)</span></div>
  <div><span class="eq-left">attraction</span><span class="eq-op">=</span><span>\(U_{vdW}(h)\approx-\frac{HR}{12h}\)</span></div>
  <div><span class="eq-left">salt</span><span class="eq-op">=</span><span>higher c gives smaller lambda_D and lower barrier</span></div>
</div>

<h2 id="耗尽力">耗尽力</h2><p>小颗粒不能进入大颗粒附近的耗尽层。两个大颗粒靠近时耗尽层重叠，小颗粒可用体积增加，熵增加，于是大颗粒产生有效吸引。</p>
<div class="equation-block">
  <div><span class="eq-left">osmotic</span><span class="eq-op">=</span><span>\(p=nk_BT\)</span></div>
  <div><span class="eq-left">depletion</span><span class="eq-op">=</span><span>\(U(r)=-p\Delta V(r)\)</span></div>
  <div><span class="eq-left">AO</span><span class="eq-op">=</span><span>\(\Delta V(r)=\frac{\pi}{6}(a+b-r)^2(a+b+r/2)\)</span></div>
  <div><span class="eq-left">range</span><span class="eq-op">=</span><span>range approx small-particle diameter b</span></div>
</div>

<h2 id="硬球相与玻璃">硬球相与玻璃</h2><p>硬球没有吸引力，但可以由熵驱动结晶。高体积分数下颗粒被邻居困住，可形成胶体玻璃。</p>
<div class="equation-block">
  <div><span class="eq-left">hard sphere</span><span class="eq-op">=</span><span>\(u(r)=\infty\;(r&lt;\sigma),\;0\;(r\ge\sigma)\)</span></div>
  <div><span class="eq-left">phi</span><span class="eq-op">=</span><span>\(\phi=Nb/V,\;b=\pi\sigma^3/6\)</span></div>
  <div><span class="eq-left">CS</span><span class="eq-op">=</span><span>\(Z=\frac{1+\phi+\phi^2-\phi^3}{(1-\phi)^3}\)</span></div>
  <div><span class="eq-left">coexist</span><span class="eq-op">=</span><span>\(\phi_f=0.494,\;\phi_s=0.545\)</span></div>
  <div><span class="eq-left">packing</span><span class="eq-op">=</span><span>\(\phi_0=\frac{\pi}{3\sqrt2}\approx0.74\)</span></div>
</div>

<p>二维熔化可用 KTHNY 图像理解：固体相到六角相到液体相，机制是拓扑缺陷解绑定。活性胶体还可能出现 motility-induced phase separation。</p>
<h2 id="考试抓手">考试抓手</h2><p>胶体题先分清相互作用来源：vdW、electrostatic、depletion、hard sphere、activity。相行为题先看自由能 A = U - TS，硬球和耗尽力尤其要抓住熵驱动。</p>
