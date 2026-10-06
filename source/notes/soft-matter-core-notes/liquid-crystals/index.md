---
title: Liquid Crystals
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Yao Zhenwei<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/liquid-crystals/">液晶</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Core-Picture">Core Picture</h2><p>Liquid crystals sit between liquids and crystals. A nematic phase has orientational order but no positional order. The director n represents average orientation, with n equivalent to -n.</p>
<h2 id="Scalar-and-Tensor-Order-Parameters">Scalar and Tensor Order Parameters</h2><p>Orientation can be described by f(theta, phi). With cylindrical symmetry around the director, it depends only on theta.</p>
<div class="equation-block">
  <div><span class="eq-left">scalar S</span><span class="eq-op">=</span><span>\(S=\left\langle\frac12(3\cos^2\theta-1)\right\rangle\)</span></div>
  <div><span class="eq-left">Legendre</span><span class="eq-op">=</span><span>\(S=\langle P_2(\cos\theta)\rangle\)</span></div>
  <div><span class="eq-left">tensor</span><span class="eq-op">=</span><span>\(Q_{\alpha\beta}=S(n_\alpha n_\beta-\delta_{\alpha\beta}/3)\)</span></div>
  <div><span class="eq-left">trace</span><span class="eq-op">=</span><span>\(\mathrm{Tr}\,Q=0\)</span></div>
</div>

<p>S=1 means perfect alignment. S=0 means isotropic orientation. The Q tensor removes the isotropic part and keeps anisotropy.</p>
<h2 id="Macroscopic-Response-Tensor">Macroscopic Response Tensor</h2><p>Nematic anisotropy can be measured through response to an external field.</p>
<div class="equation-block">
  <div><span class="eq-left">response</span><span class="eq-op">=</span><span>\(M_\alpha=\chi_{\alpha\beta}H_\beta\)</span></div>
  <div><span class="eq-left">isotropic</span><span class="eq-op">=</span><span>\(\chi_{\alpha\beta}=\chi_0\delta_{\alpha\beta}\)</span></div>
  <div><span class="eq-left">nematic</span><span class="eq-op">=</span><span>\(\chi_{\alpha\beta}=\chi_\perp\delta_{\alpha\beta}+\chi_a n_\alpha n_\beta\)</span></div>
  <div><span class="eq-left">anisotropy</span><span class="eq-op">=</span><span>\(\chi_a=\chi_\parallel-\chi_\perp\)</span></div>
</div>

<h2 id="Frank-Free-Energy">Frank Free Energy</h2><p>Spatial variation of director costs elastic energy. The three basic deformations are splay, twist, and bend.</p>
<div class="equation-block">
  <div><span class="eq-left">Frank</span><span class="eq-op">=</span><span>\(F=\frac12\int[K_1(\nabla\cdot\mathbf n)^2+K_2(\mathbf n\cdot\nabla\times\mathbf n)^2+K_3|\mathbf n\times\nabla\times\mathbf n|^2]dV\)</span></div>
  <div><span class="eq-left">splay</span><span class="eq-op">=</span><span>\(\nabla\cdot\mathbf n\)</span></div>
  <div><span class="eq-left">twist</span><span class="eq-op">=</span><span>\(\mathbf n\cdot\nabla\times\mathbf n\)</span></div>
  <div><span class="eq-left">bend</span><span class="eq-op">=</span><span>\(\mathbf n\times\nabla\times\mathbf n\)</span></div>
</div>

<p>In two dimensions and the one-constant approximation, the director is represented by an angle field theta.</p>
<div class="equation-block">
  <div><span class="eq-left">2D n</span><span class="eq-op">=</span><span>\(\mathbf n=(\cos\theta,\sin\theta)\)</span></div>
  <div><span class="eq-left">one K</span><span class="eq-op">=</span><span>\(F=\frac{K}{2}\int|\nabla\theta|^2d^2r\)</span></div>
</div>

<h2 id="Topological-Defects">Topological Defects</h2><p>The total rotation of director around a defect defines its topological charge. Because n is equivalent to -n, half-integer defects are allowed.</p>
<div class="equation-block">
  <div><span class="eq-left">charge</span><span class="eq-op">=</span><span>\(q=\frac{1}{2\pi}\oint d\theta\)</span></div>
  <div><span class="eq-left">defect</span><span class="eq-op">=</span><span>\(\theta=q\varphi+\theta_0\)</span></div>
  <div><span class="eq-left">energy</span><span class="eq-op">=</span><span>\(F_{defect}\approx\pi Kq^2\ln(R/a)\)</span></div>
  <div><span class="eq-left">sphere</span><span class="eq-op">=</span><span>\(\sum_i q_i=2\)</span></div>
</div>

<p>A nematic on a sphere must carry total topological charge 2, often realized by four +1/2 defects.</p>
<h2 id="Exam-Cue">Exam Cue</h2><p>For liquid crystals, first state n is equivalent to -n, then write S or Q. If director varies, use Frank free energy. If defects appear, compute winding number and remember the spherical charge constraint.</p>
