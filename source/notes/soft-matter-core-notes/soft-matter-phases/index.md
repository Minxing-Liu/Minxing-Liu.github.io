---
title: Soft Matter Phases
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Cao Xin<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/soft-matter-phases/">软物质相</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Colloids-and-Thermal-Scale">Colloids and Thermal Scale</h2><p>A colloid is a dispersed phase suspended in a continuous phase, typically (10,\mathrm{nm}\sim10,\mu\mathrm{m}) in size. Interactions are often measured in units of k_B T.</p>
<div class="equation-block">
  <div><span class="eq-left">thermal</span><span class="eq-op">=</span><span>interaction comparable to \(k_BT\) is reversible</span></div>
  <div><span class="eq-left">diffusion</span><span class="eq-op">=</span><span>\(D=\frac{k_B T}{6\pi\eta R}\)</span></div>
  <div><span class="eq-left">MSD</span><span class="eq-op">=</span><span>\(\langle\Delta r^2\rangle=2dDt\)</span></div>
</div>

<h2 id="van-der-Waals-Attraction-and-Electric-Double-Layer">van der Waals Attraction and Electric Double Layer</h2><div class="equation-block">
  <div><span class="eq-left">atoms</span><span class="eq-op">=</span><span>\(U(r)=-C/r^6\)</span></div>
  <div><span class="eq-left">plates</span><span class="eq-op">=</span><span>\(W(h)=-\frac{H}{12\pi h^2}\)</span></div>
  <div><span class="eq-left">spheres</span><span class="eq-op">=</span><span>\(U_{vdW}(h)\approx-\frac{HR}{12h}\)</span></div>
  <div><span class="eq-left">wall</span><span class="eq-op">=</span><span>\(U_{vdW}(h)\approx-\frac{HR}{6h}\)</span></div>
</div>

<p>Charged surfaces form a Stern layer and a diffuse layer. Higher salt concentration gives shorter Debye length and shorter-ranged repulsion.</p>
<div class="equation-block">
  <div><span class="eq-left">Debye</span><span class="eq-op">=</span><span>\(\lambda_D=\sqrt{\frac{\epsilon_0\epsilon_r k_BT}{\sum_i q_i^2c_i}}\)</span></div>
  <div><span class="eq-left">screening</span><span class="eq-op">=</span><span>\(\phi(h)=\phi_0e^{-h/\lambda_D}\)</span></div>
  <div><span class="eq-left">Yukawa</span><span class="eq-op">=</span><span>\(\phi(r)\propto e^{-r/\lambda_D}/r\)</span></div>
  <div><span class="eq-left">zeta</span><span class="eq-op">=</span><span>\(U=\epsilon_0\epsilon_r\zeta E/\eta\)</span></div>
</div>

<h2 id="DLVO-Theory">DLVO Theory</h2><p>DLVO adds electric double-layer repulsion and van der Waals attraction. High salt lowers the repulsive barrier and promotes aggregation.</p>
<div class="equation-block">
  <div><span class="eq-left">DLVO</span><span class="eq-op">=</span><span>\(U_{DLVO}(h)=U_e(h)+U_{vdW}(h)\)</span></div>
  <div><span class="eq-left">repulsion</span><span class="eq-op">=</span><span>\(U_e(h)=Ae^{-h/\lambda_D}\)</span></div>
  <div><span class="eq-left">attraction</span><span class="eq-op">=</span><span>\(U_{vdW}(h)\approx-\frac{HR}{12h}\)</span></div>
  <div><span class="eq-left">salt</span><span class="eq-op">=</span><span>higher c gives smaller lambda_D and lower barrier</span></div>
</div>

<h2 id="Depletion-Force">Depletion Force</h2><p>Small particles are excluded from the depletion layer around large particles. When two depletion layers overlap, available volume for small particles increases, creating entropy-driven attraction.</p>
<div class="equation-block">
  <div><span class="eq-left">osmotic</span><span class="eq-op">=</span><span>\(p=nk_BT\)</span></div>
  <div><span class="eq-left">depletion</span><span class="eq-op">=</span><span>\(U(r)=-p\Delta V(r)\)</span></div>
  <div><span class="eq-left">AO</span><span class="eq-op">=</span><span>\(\Delta V(r)=\frac{\pi}{6}(a+b-r)^2(a+b+r/2)\)</span></div>
  <div><span class="eq-left">range</span><span class="eq-op">=</span><span>range approx small-particle diameter b</span></div>
</div>

<h2 id="Hard-Spheres-and-Glass">Hard Spheres and Glass</h2><p>Hard spheres have no attraction but can crystallize by entropy. At high volume fraction, particles become caged by neighbors and form a colloidal glass.</p>
<div class="equation-block">
  <div><span class="eq-left">hard sphere</span><span class="eq-op">=</span><span>\(u(r)=\infty\;(r&lt;\sigma),\;0\;(r\ge\sigma)\)</span></div>
  <div><span class="eq-left">phi</span><span class="eq-op">=</span><span>\(\phi=Nb/V,\;b=\pi\sigma^3/6\)</span></div>
  <div><span class="eq-left">CS</span><span class="eq-op">=</span><span>\(Z=\frac{1+\phi+\phi^2-\phi^3}{(1-\phi)^3}\)</span></div>
  <div><span class="eq-left">coexist</span><span class="eq-op">=</span><span>\(\phi_f=0.494,\;\phi_s=0.545\)</span></div>
  <div><span class="eq-left">packing</span><span class="eq-op">=</span><span>\(\phi_0=\frac{\pi}{3\sqrt2}\approx0.74\)</span></div>
</div>

<p>KTHNY theory describes 2D melting as solid to hexatic to liquid through defect unbinding. Active colloids may undergo motility-induced phase separation.</p>
<h2 id="Exam-Cue">Exam Cue</h2><p>Identify the interaction: vdW, electrostatic, depletion, hard sphere, or activity. For phases, start from free energy A = U - TS. Hard spheres and depletion force are especially entropy-driven.</p>
