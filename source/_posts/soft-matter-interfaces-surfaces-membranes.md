---
title: 界面、表面与膜
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-interfaces-surfaces-membranes/
description: 表面张力、曲率和膜的弹性响应。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 姚振威<br>English version: <a href="/notes/soft-matter-interfaces-surfaces-membranes/">Interfaces, Surfaces and Membranes</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>界面有能量成本，因为界面上的分子环境不同于体相。液滴、泡沫、乳液、润湿、毛细现象和生物膜形状都由表面能、曲率和弯曲能控制。</p>
<h2 id="表面张力">表面张力</h2><p>表面张力 gamma 是单位面积界面自由能，也可以理解为沿界面的收缩力。</p>
<div class="equation-block">
  <div><span class="eq-left">surface F</span><span class="eq-op">=</span><span>\(F_s=\gamma A\)</span></div>
  <div><span class="eq-left">work</span><span class="eq-op">=</span><span>\(dF=\gamma dA\)</span></div>
  <div><span class="eq-left">capillary</span><span class="eq-op">=</span><span>\(l_c=\sqrt{\gamma/(\rho g)}\)</span></div>
</div>

<p>小尺度下表面张力比重力更重要；大尺度下重力会压平界面。</p>
<h2 id="Young-Laplace-与润湿">Young-Laplace 与润湿</h2><p>曲面界面两侧存在压力差。曲率越大，毛细压力越大。</p>
<div class="equation-block">
  <div><span class="eq-left">Laplace</span><span class="eq-op">=</span><span>\(\Delta p=\gamma\left(\frac{1}{R_1}+\frac{1}{R_2}\right)\)</span></div>
  <div><span class="eq-left">sphere</span><span class="eq-op">=</span><span>\(\Delta p=2\gamma/R\)</span></div>
  <div><span class="eq-left">droplet</span><span class="eq-op">=</span><span>smaller R gives larger pressure</span></div>
</div>

<p>接触角来自三条界面张力的平衡。</p>
<div class="equation-block">
  <div><span class="eq-left">Young</span><span class="eq-op">=</span><span>\(\gamma_{SV}=\gamma_{SL}+\gamma_{LV}\cos\theta\)</span></div>
  <div><span class="eq-left">wetting</span><span class="eq-op">=</span><span>small theta means good wetting</span></div>
</div>

<h2 id="膜的-Helfrich-能量">膜的 Helfrich 能量</h2><p>脂质膜是二维流体表面。膜内分子可以流动，但膜整体弯曲需要能量。</p>
<div class="equation-block">
  <div><span class="eq-left">mean</span><span class="eq-op">=</span><span>\(2H=\frac{1}{R_1}+\frac{1}{R_2}\)</span></div>
  <div><span class="eq-left">Gaussian</span><span class="eq-op">=</span><span>\(K_G=1/(R_1R_2)\)</span></div>
  <div><span class="eq-left">Helfrich</span><span class="eq-op">=</span><span>\(F=\int[\frac{\kappa}{2}(2H-C_0)^2+\bar\kappa K_G]dA\)</span></div>
</div>

<p>kappa 是弯曲刚度，C_0 是自发曲率，kappa_bar 控制高斯曲率项。若拓扑不变，高斯曲率积分通常给常数贡献。</p>
<h2 id="小斜率近似与热涨落">小斜率近似与热涨落</h2><p>把膜写成高度函数 z=h(x,y)，在小斜率近似下曲率可以简化。</p>
<div class="equation-block">
  <div><span class="eq-left">small slope</span><span class="eq-op">=</span><span>\(|\nabla h|\ll1\)</span></div>
  <div><span class="eq-left">curvature</span><span class="eq-op">=</span><span>\(2H\approx\nabla^2h\)</span></div>
  <div><span class="eq-left">bending</span><span class="eq-op">=</span><span>\(F_b=\frac{\kappa}{2}\int(\nabla^2h)^2d^2r\)</span></div>
  <div><span class="eq-left">tension</span><span class="eq-op">=</span><span>\(F_\gamma=\frac{\gamma}{2}\int|\nabla h|^2d^2r\)</span></div>
</div>

<p>Fourier 模式的涨落由能量均分给出。</p>
<div class="equation-block">
  <div><span class="eq-left">mode</span><span class="eq-op">=</span><span>\(F_q=\frac12(\kappa q^4+\gamma q^2)|h_q|^2\)</span></div>
  <div><span class="eq-left">fluctuation</span><span class="eq-op">=</span><span>\(\langle|h_q|^2\rangle=\frac{k_BT}{\kappa q^4+\gamma q^2}\)</span></div>
</div>

<h2 id="考试抓手">考试抓手</h2><p>界面题先写 F=gamma A；曲面压力写 Young-Laplace；润湿写 Young equation；膜形状写 Helfrich；小变形涨落写 h(x,y) 和 Fourier mode。</p>
