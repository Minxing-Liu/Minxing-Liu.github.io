---
title: Polymers
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Xu Heng<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/polymers/">聚合物物理</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Core-Picture">Core Picture</h2><p>A polymer is a long chain made of many monomers. The key questions are how entropy, bending rigidity, excluded volume, and solvent quality determine chain conformation.</p>
<h2 id="Ideal-Chain">Ideal Chain</h2><p>An ideal chain neglects excluded volume and long-range interactions, so it behaves like a random walk.</p>
<div class="equation-block">
  <div><span class="eq-left">contour</span><span class="eq-op">=</span><span>\(L=Nb\)</span></div>
  <div><span class="eq-left">end-to-end</span><span class="eq-op">=</span><span>\(\langle R^2\rangle=Nb^2\)</span></div>
  <div><span class="eq-left">size</span><span class="eq-op">=</span><span>\(R\approx bN^{1/2}\)</span></div>
  <div><span class="eq-left">Rg</span><span class="eq-op">=</span><span>\(R_g^2=\langle R^2\rangle/6\)</span></div>
</div>

<p>The end-to-end distribution is approximately Gaussian, giving entropic elasticity.</p>
<div class="equation-block">
  <div><span class="eq-left">Gaussian</span><span class="eq-op">=</span><span>\(P(R)\propto e^{-3R^2/(2Nb^2)}\)</span></div>
  <div><span class="eq-left">entropy F</span><span class="eq-op">=</span><span>\(F(R)=\frac{3k_BTR^2}{2Nb^2}\)</span></div>
  <div><span class="eq-left">force</span><span class="eq-op">=</span><span>\(f=\frac{3k_BTR}{Nb^2}\)</span></div>
</div>

<h2 id="Wormlike-Chain">Wormlike Chain</h2><p>Semiflexible chains require bending rigidity.</p>
<div class="equation-block">
  <div><span class="eq-left">bending</span><span class="eq-op">=</span><span>\(E_b=\frac{\kappa}{2}\int\left|\frac{d\mathbf u}{ds}\right|^2ds\)</span></div>
  <div><span class="eq-left">persistence</span><span class="eq-op">=</span><span>\(l_p=\kappa/(k_BT)\)</span></div>
  <div><span class="eq-left">correlation</span><span class="eq-op">=</span><span>\(\langle\mathbf u(s)\cdot\mathbf u(0)\rangle=e^{-s/l_p}\)</span></div>
  <div><span class="eq-left">WLC R2</span><span class="eq-op">=</span><span>\(\langle R^2\rangle=2l_pL\left[1-\frac{l_p}{L}(1-e^{-L/l_p})\right]\)</span></div>
</div>

<p>For L much smaller than l_p, the chain behaves like a rod. For L much larger than l_p, it behaves like a flexible chain with Kuhn length about 2l_p.</p>
<h2 id="Non-Ideal-Chain-and-Flory-Theory">Non-Ideal Chain and Flory Theory</h2><p>Real chains cannot pass through themselves. Excluded volume swells the chain in a good solvent.</p>
<div class="equation-block">
  <div><span class="eq-left">Flory F</span><span class="eq-op">=</span><span>\(F/k_BT\approx\frac{R^2}{Nb^2}+\frac{vN^2}{R^d}\)</span></div>
  <div><span class="eq-left">Flory nu</span><span class="eq-op">=</span><span>\(\nu=3/(d+2)\)</span></div>
  <div><span class="eq-left">3D good</span><span class="eq-op">=</span><span>\(R\approx bN^{3/5}\)</span></div>
  <div><span class="eq-left">theta</span><span class="eq-op">=</span><span>\(R\approx bN^{1/2}\)</span></div>
  <div><span class="eq-left">poor</span><span class="eq-op">=</span><span>\(R\approx bN^{1/3}\)</span></div>
</div>

<h2 id="Polymer-Solution">Polymer Solution</h2><p>Flory-Huggins theory combines mixing entropy and interaction energy. Polymer mixing entropy is small because the whole chain moves as one object.</p>
<div class="equation-block">
  <div><span class="eq-left">FH</span><span class="eq-op">=</span><span>\(f/k_BT=\frac{\phi}{N}\ln\phi+(1-\phi)\ln(1-\phi)+\chi\phi(1-\phi)\)</span></div>
  <div><span class="eq-left">excluded</span><span class="eq-op">=</span><span>\(v=b^3(1-2\chi)\)</span></div>
  <div><span class="eq-left">theta</span><span class="eq-op">=</span><span>\(\chi=1/2\)</span></div>
  <div><span class="eq-left">overlap</span><span class="eq-op">=</span><span>\(\phi^*\approx Nb^3/R^3\)</span></div>
  <div><span class="eq-left">spinodal</span><span class="eq-op">=</span><span>\(\partial_\phi^2f=0\)</span></div>
</div>

<h2 id="Exam-Cue">Exam Cue</h2><p>First identify the model: ideal chain, wormlike chain, self-avoiding chain, or polymer solution. The most important size scalings are N^(1/2), N^(3/5), and N^(1/3).</p>
