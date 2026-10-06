---
title: Brownian Motion, Thermal Fluctuations and Diffusion
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Cao Xin<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/brownian-motion/">布朗运动</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Core-Picture">Core Picture</h2><p>Brownian motion is the random motion of a suspended particle caused by molecular thermal collisions. At short time it is random force plus damping; at long time it becomes diffusion.</p>
<h2 id="Langevin-Equation">Langevin Equation</h2><div class="equation-block">
  <div><span class="eq-left">Langevin</span><span class="eq-op">=</span><span>\(\frac{dV}{dt}=-\Gamma V+L(t)\)</span></div>
  <div><span class="eq-left">relaxation</span><span class="eq-op">=</span><span>\(\tau=\Gamma^{-1}=\frac{M}{6\pi\eta R}\)</span></div>
  <div><span class="eq-left">overdamped</span><span class="eq-op">=</span><span>\(\frac{dX}{dt}=\Gamma^{-1}\tilde L(t)\)</span></div>
</div>

<p>For t much larger than tau, velocity thermalizes quickly and position becomes a Wiener process.</p>
<div class="equation-block">
  <div><span class="eq-left">equipart</span><span class="eq-op">=</span><span>\(\frac{1}{2}M\langle V^2\rangle=\frac{1}{2}k_B T\)</span></div>
  <div><span class="eq-left">FDT</span><span class="eq-op">=</span><span>\(\gamma=\frac{k_B T}{M}\Gamma\)</span></div>
  <div><span class="eq-left">MSD</span><span class="eq-op">=</span><span>\(\langle x^2\rangle=2Dt\)</span></div>
  <div><span class="eq-left">Stokes-Einstein</span><span class="eq-op">=</span><span>\(D=\frac{k_B T}{6\pi\eta R}\)</span></div>
</div>

<h2 id="Fokker-Planck-Equation">Fokker-Planck Equation</h2><p>A stochastic differential equation can be rewritten as an evolution equation for probability distribution.</p>
<div class="equation-block">
  <div><span class="eq-left">SDE</span><span class="eq-op">=</span><span>\(\frac{d\xi}{dt}=a(\xi)+bL(t)\)</span></div>
  <div><span class="eq-left">FP</span><span class="eq-op">=</span><span>\(\partial_tP=-\partial_\xi[aP]+\gamma\partial_\xi^2[b^2P]\)</span></div>
  <div><span class="eq-left">diffusion</span><span class="eq-op">=</span><span>\(\partial_tP=D\partial_X^2P\)</span></div>
  <div><span class="eq-left">solution</span><span class="eq-op">=</span><span>\(P(X,t)=(4\pi Dt)^{-1/2}e^{-X^2/(4Dt)}\)</span></div>
</div>

<p>The Fokker-Planck equation for velocity requires Maxwell distribution as the stationary state, giving the fluctuation-dissipation relation.</p>
<div class="equation-block">
  <div><span class="eq-left">velocity FP</span><span class="eq-op">=</span><span>\(\partial_tP=\partial_V[(\Gamma V+\gamma\partial_V)P]\)</span></div>
  <div><span class="eq-left">Maxwell</span><span class="eq-op">=</span><span>\(P_{eq}(V)\propto e^{-MV^2/(2k_BT)}\)</span></div>
</div>

<h2 id="Dimensional-MSD">Dimensional MSD</h2><div class="equation-block">
  <div><span class="eq-left">1D</span><span class="eq-op">=</span><span>\(\langle\Delta x^2\rangle=2Dt\)</span></div>
  <div><span class="eq-left">2D</span><span class="eq-op">=</span><span>\(\langle\Delta r^2\rangle=4Dt\)</span></div>
  <div><span class="eq-left">3D</span><span class="eq-op">=</span><span>\(\langle\Delta r^2\rangle=6Dt\)</span></div>
</div>

<h2 id="Active-Brownian-Particles">Active Brownian Particles</h2><p>Active particles consume energy and self-propel, so motion is no longer purely thermal.</p>
<div class="equation-block">
  <div><span class="eq-left">passive</span><span class="eq-op">=</span><span>\(v_0=0\)</span></div>
  <div><span class="eq-left">active</span><span class="eq-op">=</span><span>\(v_0&gt;0\)</span></div>
  <div><span class="eq-left">MIPS</span><span class="eq-op">=</span><span>motility-induced phase separation</span></div>
</div>

<h2 id="Exam-Cue">Exam Cue</h2><p>For random force, write Langevin. For distributions, write Fokker-Planck. For long-time position statistics, write MSD and D. The key thread is thermal noise plus damping gives diffusion.</p>
