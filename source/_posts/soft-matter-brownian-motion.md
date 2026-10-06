---
title: 布朗运动与扩散
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-brownian-motion/
description: Langevin 方程、涨落耗散关系与扩散过程。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 曹鑫<br>English version: <a href="/notes/soft-matter-brownian-motion/">Brownian Motion</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>布朗运动是悬浮颗粒受到流体分子热碰撞后产生的随机运动。短时间看是随机力和阻尼，长时间看是扩散。</p>
<h2 id="Langevin-方程">Langevin 方程</h2><div class="equation-block">
  <div><span class="eq-left">Langevin</span><span class="eq-op">=</span><span>\(\frac{dV}{dt}=-\Gamma V+L(t)\)</span></div>
  <div><span class="eq-left">relaxation</span><span class="eq-op">=</span><span>\(\tau=\Gamma^{-1}=\frac{M}{6\pi\eta R}\)</span></div>
  <div><span class="eq-left">overdamped</span><span class="eq-op">=</span><span>\(\frac{dX}{dt}=\Gamma^{-1}\tilde L(t)\)</span></div>
</div>

<p>当 t 远大于 tau，速度很快热化，位置成为 Wiener process。</p>
<div class="equation-block">
  <div><span class="eq-left">equipart</span><span class="eq-op">=</span><span>\(\frac{1}{2}M\langle V^2\rangle=\frac{1}{2}k_B T\)</span></div>
  <div><span class="eq-left">FDT</span><span class="eq-op">=</span><span>\(\gamma=\frac{k_B T}{M}\Gamma\)</span></div>
  <div><span class="eq-left">MSD</span><span class="eq-op">=</span><span>\(\langle x^2\rangle=2Dt\)</span></div>
  <div><span class="eq-left">Stokes-Einstein</span><span class="eq-op">=</span><span>\(D=\frac{k_B T}{6\pi\eta R}\)</span></div>
</div>

<h2 id="Fokker-Planck-方程">Fokker-Planck 方程</h2><p>随机微分方程可以等价地写成概率分布的演化方程。</p>
<div class="equation-block">
  <div><span class="eq-left">SDE</span><span class="eq-op">=</span><span>\(\frac{d\xi}{dt}=a(\xi)+bL(t)\)</span></div>
  <div><span class="eq-left">FP</span><span class="eq-op">=</span><span>\(\partial_tP=-\partial_\xi[aP]+\gamma\partial_\xi^2[b^2P]\)</span></div>
  <div><span class="eq-left">diffusion</span><span class="eq-op">=</span><span>\(\partial_tP=D\partial_X^2P\)</span></div>
  <div><span class="eq-left">solution</span><span class="eq-op">=</span><span>\(P(X,t)=(4\pi Dt)^{-1/2}e^{-X^2/(4Dt)}\)</span></div>
</div>

<p>速度分布的 Fokker-Planck 方程要求 Maxwell 分布为稳态解，因此再次得到涨落-耗散关系。</p>
<div class="equation-block">
  <div><span class="eq-left">velocity FP</span><span class="eq-op">=</span><span>\(\partial_tP=\partial_V[(\Gamma V+\gamma\partial_V)P]\)</span></div>
  <div><span class="eq-left">Maxwell</span><span class="eq-op">=</span><span>\(P_{eq}(V)\propto e^{-MV^2/(2k_BT)}\)</span></div>
</div>

<h2 id="维度与扩散">维度与扩散</h2><div class="equation-block">
  <div><span class="eq-left">1D</span><span class="eq-op">=</span><span>\(\langle\Delta x^2\rangle=2Dt\)</span></div>
  <div><span class="eq-left">2D</span><span class="eq-op">=</span><span>\(\langle\Delta r^2\rangle=4Dt\)</span></div>
  <div><span class="eq-left">3D</span><span class="eq-op">=</span><span>\(\langle\Delta r^2\rangle=6Dt\)</span></div>
</div>

<h2 id="主动布朗颗粒">主动布朗颗粒</h2><p>主动颗粒消耗能量并自驱动，不再只由热噪声决定。</p>
<div class="equation-block">
  <div><span class="eq-left">passive</span><span class="eq-op">=</span><span>\(v_0=0\)</span></div>
  <div><span class="eq-left">active</span><span class="eq-op">=</span><span>\(v_0&gt;0\)</span></div>
  <div><span class="eq-left">MIPS</span><span class="eq-op">=</span><span>motility-induced phase separation</span></div>
</div>

<h2 id="考试抓手">考试抓手</h2><p>看到随机力，先写 Langevin；看到概率分布，写 Fokker-Planck；看到长时间位置统计，写 MSD 和 D。Brownian 课的核心是把热噪声、阻尼、扩散系数连成一条线。</p>
