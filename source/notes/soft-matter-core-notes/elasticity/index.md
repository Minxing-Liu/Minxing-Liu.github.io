---
title: Elasticity
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Zhang Jie<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/elasticity/">弹性力学</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Core-Picture">Core Picture</h2><p>Elasticity describes reversible deformation of solids. In linear elasticity, stress is proportional to strain. Full 3D deformation requires strain and stress tensors.</p>
<h2 id="Stretching-and-Poisson-Ratio">Stretching and Poisson Ratio</h2><div class="equation-block">
  <div><span class="eq-left">stress</span><span class="eq-op">=</span><span>\(F/A\)</span></div>
  <div><span class="eq-left">strain</span><span class="eq-op">=</span><span>\(\Delta l/l\)</span></div>
  <div><span class="eq-left">Hooke</span><span class="eq-op">=</span><span>\(\frac{F}{A}=Y\frac{\Delta l}{l}\)</span></div>
  <div><span class="eq-left">Poisson</span><span class="eq-op">=</span><span>\(\frac{\Delta w}{w}=-\sigma\frac{\Delta l}{l}\)</span></div>
</div>

<p>Y measures resistance to stretching or compression. sigma measures transverse contraction during longitudinal extension.</p>
<div class="equation-block">
  <div><span class="eq-left">hydro</span><span class="eq-op">=</span><span>\(\frac{\Delta l}{l}=-\frac{p}{Y}(1-2\sigma)\)</span></div>
  <div><span class="eq-left">range</span><span class="eq-op">=</span><span>\(-1&lt;\sigma&lt;\frac{1}{2}\)</span></div>
  <div><span class="eq-left">mu</span><span class="eq-op">=</span><span>\(\mu=\frac{Y}{2(1+\sigma)}\)</span></div>
  <div><span class="eq-left">K</span><span class="eq-op">=</span><span>\(K=\frac{Y}{3(1-2\sigma)}\)</span></div>
</div>

<p>Hydrostatic compression requires volume to decrease, giving sigma &lt; 1/2. Positive shear modulus gives sigma &gt; -1.</p>
<h2 id="Shear-Confined-Compression-and-Torsion">Shear, Confined Compression, and Torsion</h2><div class="equation-block">
  <div><span class="eq-left">shear</span><span class="eq-op">=</span><span>\(g=\mu\theta\)</span></div>
  <div><span class="eq-left">confined</span><span class="eq-op">=</span><span>\(Y'=\frac{Y(1-\sigma)}{(1+\sigma)(1-2\sigma)}\)</span></div>
  <div><span class="eq-left">order</span><span class="eq-op">=</span><span>\(\mu&lt;Y&lt;Y'\)</span></div>
  <div><span class="eq-left">torsion</span><span class="eq-op">=</span><span>\(\tau=\frac{\mu\pi a^4}{2L}\phi\)</span></div>
</div>

<p>The key torsion result is the a^4 scaling: doubling radius increases torsional stiffness by 16 times.</p>
<h2 id="Beam-Bending-and-Buckling">Beam Bending and Buckling</h2><div class="equation-block">
  <div><span class="eq-left">bending</span><span class="eq-op">=</span><span>\(M=YI/R\)</span></div>
  <div><span class="eq-left">moment</span><span class="eq-op">=</span><span>\(I=\int y^2\,dA\)</span></div>
  <div><span class="eq-left">cantilever</span><span class="eq-op">=</span><span>\(z(L)=\frac{WL^3}{3YI}\)</span></div>
  <div><span class="eq-left">buckling</span><span class="eq-op">=</span><span>\(F_c=\frac{\pi^2YI}{L^2}\)</span></div>
</div>

<p>Buckling is a structural instability. A slender rod can bend sideways before the material is crushed.</p>
<h2 id="Tensor-Form-and-Elastic-Waves">Tensor Form and Elastic Waves</h2><div class="equation-block">
  <div><span class="eq-left">strain</span><span class="eq-op">=</span><span>\(e_{ij}=\frac{1}{2}(\partial_i u_j+\partial_j u_i)\)</span></div>
  <div><span class="eq-left">Hooke 3D</span><span class="eq-op">=</span><span>\(S_{ij}=2\mu e_{ij}+\lambda e_{kk}\delta_{ij}\)</span></div>
  <div><span class="eq-left">motion</span><span class="eq-op">=</span><span>\(\rho\frac{d^2u_i}{dt^2}=\partial_j S_{ij}\)</span></div>
  <div><span class="eq-left">shear wave</span><span class="eq-op">=</span><span>\(c_s=\sqrt{\mu/\rho}\)</span></div>
  <div><span class="eq-left">long wave</span><span class="eq-op">=</span><span>\(c_l=\sqrt{(\lambda+2\mu)/\rho}\)</span></div>
</div>

<h2 id="Exam-Cue">Exam Cue</h2><p>Identify whether the problem is stretching, shear, bending, torsion, buckling, or full tensor elasticity. Boundary conditions such as free expansion, confinement, fixed end, or free end directly determine the effective modulus and deformation.</p>
