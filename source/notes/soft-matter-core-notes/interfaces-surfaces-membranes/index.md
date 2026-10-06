---
title: Interfaces, Surfaces and Membranes
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Yao Zhenwei<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/interfaces-surfaces-membranes/">界面、表面与膜</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Core-Picture">Core Picture</h2><p>Interfaces cost free energy because molecules at an interface have a different environment from molecules in the bulk. Droplets, foams, emulsions, wetting, capillarity, and biological membrane shapes are controlled by surface energy, curvature, and bending energy.</p>
<h2 id="Surface-Tension">Surface Tension</h2><p>Surface tension gamma is free energy per unit area and also acts as a contracting force along the interface.</p>
<div class="equation-block">
  <div><span class="eq-left">surface F</span><span class="eq-op">=</span><span>\(F_s=\gamma A\)</span></div>
  <div><span class="eq-left">work</span><span class="eq-op">=</span><span>\(dF=\gamma dA\)</span></div>
  <div><span class="eq-left">capillary</span><span class="eq-op">=</span><span>\(l_c=\sqrt{\gamma/(\rho g)}\)</span></div>
</div>

<p>At small scales, surface tension dominates gravity. At large scales, gravity flattens interfaces.</p>
<h2 id="Young-Laplace-and-Wetting">Young-Laplace and Wetting</h2><p>A curved interface has a pressure jump across it. Larger curvature gives larger capillary pressure.</p>
<div class="equation-block">
  <div><span class="eq-left">Laplace</span><span class="eq-op">=</span><span>\(\Delta p=\gamma\left(\frac{1}{R_1}+\frac{1}{R_2}\right)\)</span></div>
  <div><span class="eq-left">sphere</span><span class="eq-op">=</span><span>\(\Delta p=2\gamma/R\)</span></div>
  <div><span class="eq-left">droplet</span><span class="eq-op">=</span><span>smaller R gives larger pressure</span></div>
</div>

<p>The contact angle comes from force balance among three interfacial tensions.</p>
<div class="equation-block">
  <div><span class="eq-left">Young</span><span class="eq-op">=</span><span>\(\gamma_{SV}=\gamma_{SL}+\gamma_{LV}\cos\theta\)</span></div>
  <div><span class="eq-left">wetting</span><span class="eq-op">=</span><span>small theta means good wetting</span></div>
</div>

<h2 id="Helfrich-Membrane-Energy">Helfrich Membrane Energy</h2><p>A lipid membrane is a two-dimensional fluid surface. Molecules can move in the membrane, but bending the whole membrane costs energy.</p>
<div class="equation-block">
  <div><span class="eq-left">mean</span><span class="eq-op">=</span><span>\(2H=\frac{1}{R_1}+\frac{1}{R_2}\)</span></div>
  <div><span class="eq-left">Gaussian</span><span class="eq-op">=</span><span>\(K_G=1/(R_1R_2)\)</span></div>
  <div><span class="eq-left">Helfrich</span><span class="eq-op">=</span><span>\(F=\int[\frac{\kappa}{2}(2H-C_0)^2+\bar\kappa K_G]dA\)</span></div>
</div>

<p>kappa is bending rigidity, C_0 is spontaneous curvature, and kappa_bar controls the Gaussian curvature term.</p>
<h2 id="Small-Slope-Approximation-and-Fluctuations">Small-Slope Approximation and Fluctuations</h2><p>Write the membrane as z=h(x,y). If the slope is small, curvature simplifies.</p>
<div class="equation-block">
  <div><span class="eq-left">small slope</span><span class="eq-op">=</span><span>\(|\nabla h|\ll1\)</span></div>
  <div><span class="eq-left">curvature</span><span class="eq-op">=</span><span>\(2H\approx\nabla^2h\)</span></div>
  <div><span class="eq-left">bending</span><span class="eq-op">=</span><span>\(F_b=\frac{\kappa}{2}\int(\nabla^2h)^2d^2r\)</span></div>
  <div><span class="eq-left">tension</span><span class="eq-op">=</span><span>\(F_\gamma=\frac{\gamma}{2}\int|\nabla h|^2d^2r\)</span></div>
</div>

<p>Fourier-mode fluctuations follow from equipartition.</p>
<div class="equation-block">
  <div><span class="eq-left">mode</span><span class="eq-op">=</span><span>\(F_q=\frac12(\kappa q^4+\gamma q^2)|h_q|^2\)</span></div>
  <div><span class="eq-left">fluctuation</span><span class="eq-op">=</span><span>\(\langle|h_q|^2\rangle=\frac{k_BT}{\kappa q^4+\gamma q^2}\)</span></div>
</div>

<h2 id="Exam-Cue">Exam Cue</h2><p>For interfaces, write F=gamma A. For curved pressure, write Young-Laplace. For wetting, write Young equation. For membrane shape, write Helfrich. For small fluctuations, use h(x,y) and Fourier modes.</p>
