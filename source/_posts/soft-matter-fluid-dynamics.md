---
title: 流体动力学
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-fluid-dynamics/
description: 连续性方程、黏性流动和低雷诺数物理。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 张何朋<br>English version: <a href="/notes/soft-matter-fluid-dynamics/">Fluid Dynamics</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>软物质中的运动大多发生在水、油或复杂流体里。微米尺度下惯性通常很弱，粘性阻力很强，所以“停下外力，运动几乎立刻停下”。</p>
<h2 id="连续介质与速度场">连续介质与速度场</h2><p>流体动力学把流体看成连续介质，用速度场 v(r,t)、压力 p(r,t)、密度 rho 描述。</p>
<div class="equation-block">
  <div><span class="eq-left">material D</span><span class="eq-op">=</span><span>\(\frac{D}{Dt}=\partial_t+\mathbf v\cdot\nabla\)</span></div>
  <div><span class="eq-left">continuity</span><span class="eq-op">=</span><span>\(\partial_t\rho+\nabla\cdot(\rho\mathbf v)=0\)</span></div>
  <div><span class="eq-left">incompressible</span><span class="eq-op">=</span><span>\(\nabla\cdot\mathbf v=0\)</span></div>
</div>

<p>material derivative 表示跟着流体质点运动时看到的变化；不可压缩条件常用于水和多数软物质实验。</p>
<h2 id="粘性与牛顿流体">粘性与牛顿流体</h2><p>牛顿流体的剪切应力与剪切速率成正比。粘度 eta 越大，流动越难。</p>
<div class="equation-block">
  <div><span class="eq-left">shear</span><span class="eq-op">=</span><span>\(\tau=\eta\dot\gamma\)</span></div>
  <div><span class="eq-left">stress</span><span class="eq-op">=</span><span>\(\sigma_{ij}=-p\delta_{ij}+\eta(\partial_i v_j+\partial_j v_i)\)</span></div>
  <div><span class="eq-left">viscosity</span><span class="eq-op">=</span><span>\(\eta\) measures momentum diffusion</span></div>
</div>

<h2 id="Navier-Stokes-与低-Re-极限">Navier-Stokes 与低 Re 极限</h2><p>Navier-Stokes 方程是动量守恒。软物质中常用低 Reynolds number 极限，惯性项可以忽略，得到 Stokes 方程。</p>
<div class="equation-block">
  <div><span class="eq-left">NS</span><span class="eq-op">=</span><span>\(\rho\frac{D\mathbf v}{Dt}=-\nabla p+\eta\nabla^2\mathbf v+\mathbf f\)</span></div>
  <div><span class="eq-left">Re</span><span class="eq-op">=</span><span>\(\rho U L/\eta\)</span></div>
  <div><span class="eq-left">Stokes</span><span class="eq-op">=</span><span>\(0=-\nabla p+\eta\nabla^2\mathbf v+\mathbf f\)</span></div>
  <div><span class="eq-left">constraint</span><span class="eq-op">=</span><span>\(\nabla\cdot\mathbf v=0\)</span></div>
</div>

<p>Re 小表示粘性支配，流动可逆性强，没有明显惯性记忆。这是微流控、胶体和细胞尺度运动的关键。</p>
<h2 id="球形颗粒的阻力">球形颗粒的阻力</h2><p>半径 R 的球以速度 U 在粘性流体中运动，受到 Stokes 阻力。</p>
<div class="equation-block">
  <div><span class="eq-left">drag</span><span class="eq-op">=</span><span>\(F=6\pi\eta R U\)</span></div>
  <div><span class="eq-left">mobility</span><span class="eq-op">=</span><span>\(U=\mu F\)</span></div>
  <div><span class="eq-left">mu</span><span class="eq-op">=</span><span>\(\mu=\frac{1}{6\pi\eta R}\)</span></div>
</div>

<p>这条公式直接连接到布朗运动中的 Stokes-Einstein 关系。</p>
<h2 id="管流与尺度律">管流与尺度律</h2><p>Poiseuille 流说明小管道阻力对半径极其敏感。</p>
<div class="equation-block">
  <div><span class="eq-left">Poiseuille</span><span class="eq-op">=</span><span>\(Q=\frac{\pi a^4\Delta p}{8\eta L}\)</span></div>
  <div><span class="eq-left">resistance</span><span class="eq-op">=</span><span>\(\frac{\Delta p}{Q}=\frac{8\eta L}{\pi a^4}\)</span></div>
</div>

<p>半径变小一点，流阻会大幅上升。这是微流控和多孔介质流动的基本尺度律。</p>
<h2 id="考试抓手">考试抓手</h2><p>如果题目尺度是微米、速度不大、流体是水，先估 Re。若 Re 很小，直接进入 Stokes 方程、Stokes drag、mobility 和 Stokes-Einstein 的逻辑。</p>
