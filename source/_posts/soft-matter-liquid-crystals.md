---
title: 液晶
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-liquid-crystals/
description: 取向有序、弹性形变与液晶相。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 姚振威<br>English version: <a href="/notes/soft-matter-liquid-crystals/">Liquid Crystals</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>液晶介于液体和晶体之间。向列相 nematic 没有位置有序，但有取向有序。director n 表示平均取向，并且 n 与 -n 等价。</p>
<h2 id="标量与张量有序参数">标量与张量有序参数</h2><p>取向分布可用 f(theta, phi) 描述；若绕 director 有柱对称性，则只依赖 theta。</p>
<div class="equation-block">
  <div><span class="eq-left">scalar S</span><span class="eq-op">=</span><span>\(S=\left\langle\frac12(3\cos^2\theta-1)\right\rangle\)</span></div>
  <div><span class="eq-left">Legendre</span><span class="eq-op">=</span><span>\(S=\langle P_2(\cos\theta)\rangle\)</span></div>
  <div><span class="eq-left">tensor</span><span class="eq-op">=</span><span>\(Q_{\alpha\beta}=S(n_\alpha n_\beta-\delta_{\alpha\beta}/3)\)</span></div>
  <div><span class="eq-left">trace</span><span class="eq-op">=</span><span>\(\mathrm{Tr}\,Q=0\)</span></div>
</div>

<p>S=1 表示完全沿 director 排列，S=0 表示各向同性随机取向。Q 张量去掉各向同性部分，只保留取向各向异性。</p>
<h2 id="宏观响应张量">宏观响应张量</h2><p>液晶的各向异性可以通过外场响应测量。</p>
<div class="equation-block">
  <div><span class="eq-left">response</span><span class="eq-op">=</span><span>\(M_\alpha=\chi_{\alpha\beta}H_\beta\)</span></div>
  <div><span class="eq-left">isotropic</span><span class="eq-op">=</span><span>\(\chi_{\alpha\beta}=\chi_0\delta_{\alpha\beta}\)</span></div>
  <div><span class="eq-left">nematic</span><span class="eq-op">=</span><span>\(\chi_{\alpha\beta}=\chi_\perp\delta_{\alpha\beta}+\chi_a n_\alpha n_\beta\)</span></div>
  <div><span class="eq-left">anisotropy</span><span class="eq-op">=</span><span>\(\chi_a=\chi_\parallel-\chi_\perp\)</span></div>
</div>

<h2 id="Frank-弹性能">Frank 弹性能</h2><p>director 在空间中变化会产生弹性能。三种基本形变是 splay、twist、bend。</p>
<div class="equation-block">
  <div><span class="eq-left">Frank</span><span class="eq-op">=</span><span>\(F=\frac12\int[K_1(\nabla\cdot\mathbf n)^2+K_2(\mathbf n\cdot\nabla\times\mathbf n)^2+K_3|\mathbf n\times\nabla\times\mathbf n|^2]dV\)</span></div>
  <div><span class="eq-left">splay</span><span class="eq-op">=</span><span>\(\nabla\cdot\mathbf n\)</span></div>
  <div><span class="eq-left">twist</span><span class="eq-op">=</span><span>\(\mathbf n\cdot\nabla\times\mathbf n\)</span></div>
  <div><span class="eq-left">bend</span><span class="eq-op">=</span><span>\(\mathbf n\times\nabla\times\mathbf n\)</span></div>
</div>

<p>二维 one-constant approximation 下，director 可写成角度场 theta。</p>
<div class="equation-block">
  <div><span class="eq-left">2D n</span><span class="eq-op">=</span><span>\(\mathbf n=(\cos\theta,\sin\theta)\)</span></div>
  <div><span class="eq-left">one K</span><span class="eq-op">=</span><span>\(F=\frac{K}{2}\int|\nabla\theta|^2d^2r\)</span></div>
</div>

<h2 id="拓扑缺陷">拓扑缺陷</h2><p>绕缺陷一圈，director 角度的总变化定义拓扑荷。由于 n 与 -n 等价，nematic 允许半整数缺陷。</p>
<div class="equation-block">
  <div><span class="eq-left">charge</span><span class="eq-op">=</span><span>\(q=\frac{1}{2\pi}\oint d\theta\)</span></div>
  <div><span class="eq-left">defect</span><span class="eq-op">=</span><span>\(\theta=q\varphi+\theta_0\)</span></div>
  <div><span class="eq-left">energy</span><span class="eq-op">=</span><span>\(F_{defect}\approx\pi Kq^2\ln(R/a)\)</span></div>
  <div><span class="eq-left">sphere</span><span class="eq-op">=</span><span>\(\sum_i q_i=2\)</span></div>
</div>

<p>球面 nematic 必须有总拓扑荷 2，常见构型是四个 +1/2 缺陷。</p>
<h2 id="考试抓手">考试抓手</h2><p>液晶题先写 n 等价于 -n，再写 S 或 Q；有空间变化就写 Frank；有缺陷就算 winding number；在球面上要记住总拓扑荷约束。</p>
