---
title: 弹性与连续介质
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-elasticity/
description: 应变、应力与弹性能的基本描述。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 张洁<br>English version: <a href="/notes/soft-matter-elasticity/">Elasticity</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>弹性研究固体受到外力后的可逆形变。线性弹性范围内，应力与应变成正比，三维问题需要用应力张量和应变张量描述。</p>
<h2 id="一维拉伸与泊松比">一维拉伸与泊松比</h2><div class="equation-block">
  <div><span class="eq-left">stress</span><span class="eq-op">=</span><span>\(F/A\)</span></div>
  <div><span class="eq-left">strain</span><span class="eq-op">=</span><span>\(\Delta l/l\)</span></div>
  <div><span class="eq-left">Hooke</span><span class="eq-op">=</span><span>\(\frac{F}{A}=Y\frac{\Delta l}{l}\)</span></div>
  <div><span class="eq-left">Poisson</span><span class="eq-op">=</span><span>\(\frac{\Delta w}{w}=-\sigma\frac{\Delta l}{l}\)</span></div>
</div>

<p>Y 是杨氏模量，表示抵抗拉伸或压缩的能力。sigma 是泊松比，表示纵向拉伸时横向收缩的比例。</p>
<div class="equation-block">
  <div><span class="eq-left">hydro</span><span class="eq-op">=</span><span>\(\frac{\Delta l}{l}=-\frac{p}{Y}(1-2\sigma)\)</span></div>
  <div><span class="eq-left">range</span><span class="eq-op">=</span><span>\(-1&lt;\sigma&lt;\frac{1}{2}\)</span></div>
  <div><span class="eq-left">mu</span><span class="eq-op">=</span><span>\(\mu=\frac{Y}{2(1+\sigma)}\)</span></div>
  <div><span class="eq-left">K</span><span class="eq-op">=</span><span>\(K=\frac{Y}{3(1-2\sigma)}\)</span></div>
</div>

<p>静水压力要求受压后体积变小，因此 sigma 不能超过 1/2；剪切模量为正要求 sigma 大于 -1。</p>
<h2 id="剪切、受限压缩与扭转">剪切、受限压缩与扭转</h2><p>剪切让形状改变但不主要改变体积。受限压缩时横向不能自由膨胀，等效模量会变大。</p>
<div class="equation-block">
  <div><span class="eq-left">shear</span><span class="eq-op">=</span><span>\(g=\mu\theta\)</span></div>
  <div><span class="eq-left">confined</span><span class="eq-op">=</span><span>\(Y'=\frac{Y(1-\sigma)}{(1+\sigma)(1-2\sigma)}\)</span></div>
  <div><span class="eq-left">order</span><span class="eq-op">=</span><span>\(\mu&lt;Y&lt;Y'\)</span></div>
  <div><span class="eq-left">torsion</span><span class="eq-op">=</span><span>\(\tau=\frac{\mu\pi a^4}{2L}\phi\)</span></div>
</div>

<p>扭转杆最重要的结论是 a^4 标度：半径变为 2 倍，抗扭刚度变为 16 倍。</p>
<h2 id="梁弯曲与屈曲">梁弯曲与屈曲</h2><p>梁弯曲时一侧拉伸、一侧压缩，中性面附近应变为零。截面二次矩 I 衡量材料离中性轴有多远。</p>
<div class="equation-block">
  <div><span class="eq-left">bending</span><span class="eq-op">=</span><span>\(M=YI/R\)</span></div>
  <div><span class="eq-left">moment</span><span class="eq-op">=</span><span>\(I=\int y^2\,dA\)</span></div>
  <div><span class="eq-left">cantilever</span><span class="eq-op">=</span><span>\(z(L)=\frac{WL^3}{3YI}\)</span></div>
  <div><span class="eq-left">buckling</span><span class="eq-op">=</span><span>\(F_c=\frac{\pi^2YI}{L^2}\)</span></div>
</div>

<p>屈曲是结构失稳，不一定是材料压坏。细长杆越长，临界压力越小。</p>
<h2 id="张量形式与弹性波">张量形式与弹性波</h2><div class="equation-block">
  <div><span class="eq-left">strain</span><span class="eq-op">=</span><span>\(e_{ij}=\frac{1}{2}(\partial_i u_j+\partial_j u_i)\)</span></div>
  <div><span class="eq-left">Hooke 3D</span><span class="eq-op">=</span><span>\(S_{ij}=2\mu e_{ij}+\lambda e_{kk}\delta_{ij}\)</span></div>
  <div><span class="eq-left">motion</span><span class="eq-op">=</span><span>\(\rho\frac{d^2u_i}{dt^2}=\partial_j S_{ij}\)</span></div>
  <div><span class="eq-left">shear wave</span><span class="eq-op">=</span><span>\(c_s=\sqrt{\mu/\rho}\)</span></div>
  <div><span class="eq-left">long wave</span><span class="eq-op">=</span><span>\(c_l=\sqrt{(\lambda+2\mu)/\rho}\)</span></div>
</div>

<h2 id="考试抓手">考试抓手</h2><p>先判断是一维拉伸、剪切、弯曲、扭转还是三维张量问题。然后找边界条件：自由膨胀、受限压缩、固定端、自由端，会直接改变有效模量或形变公式。</p>
