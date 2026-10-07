---
title: 聚合物
date: '2026-06-19'
updated: '2026-06-19'
permalink: notes/soft-matter-polymers/
description: 链构象、熵弹性与聚合物的统计描述。
categories:
- 课程笔记
tags:
- 软物质
- 专题
katex: true
comments: false
---

<p>Instructor: 徐恒<br>English version: <a href="/notes/soft-matter-polymers/">Polymers</a><br>Back to: <a href="/notes/soft-matter/">软物质物理课程笔记</a></p>
<h2 id="核心图像">核心图像</h2><p>聚合物是一条由许多单体连接成的长链。核心问题是：链的构象如何由熵、弯曲刚度、排除体积和溶剂质量决定。</p>
<h2 id="理想链">理想链</h2><p>理想链忽略排除体积和长程相互作用，可以看成随机游走。拉直长度是 Nb，但典型尺寸只随 N 的平方根增长。</p>
<div class="equation-block">
  <div><span class="eq-left">contour</span><span class="eq-op">=</span><span>\(L=Nb\)</span></div>
  <div><span class="eq-left">end-to-end</span><span class="eq-op">=</span><span>\(\langle R^2\rangle=Nb^2\)</span></div>
  <div><span class="eq-left">size</span><span class="eq-op">=</span><span>\(R\approx bN^{1/2}\)</span></div>
  <div><span class="eq-left">Rg</span><span class="eq-op">=</span><span>\(R_g^2=\langle R^2\rangle/6\)</span></div>
</div>

<p>端到端距离分布近似为高斯分布，由此得到熵弹簧自由能。</p>
<div class="equation-block">
  <div><span class="eq-left">Gaussian</span><span class="eq-op">=</span><span>\(P(R)\propto e^{-3R^2/(2Nb^2)}\)</span></div>
  <div><span class="eq-left">entropy F</span><span class="eq-op">=</span><span>\(F(R)=\frac{3k_BTR^2}{2Nb^2}\)</span></div>
  <div><span class="eq-left">force</span><span class="eq-op">=</span><span>\(f=\frac{3k_BTR}{Nb^2}\)</span></div>
</div>

<h2 id="Wormlike-chain">Wormlike chain</h2><p>半柔性链不能看成完全柔软的随机游走，需要加入弯曲刚度。</p>
<div class="equation-block">
  <div><span class="eq-left">bending</span><span class="eq-op">=</span><span>\(E_b=\frac{\kappa}{2}\int\left|\frac{d\mathbf u}{ds}\right|^2ds\)</span></div>
  <div><span class="eq-left">persistence</span><span class="eq-op">=</span><span>\(l_p=\kappa/(k_BT)\)</span></div>
  <div><span class="eq-left">correlation</span><span class="eq-op">=</span><span>\(\langle\mathbf u(s)\cdot\mathbf u(0)\rangle=e^{-s/l_p}\)</span></div>
  <div><span class="eq-left">WLC R2</span><span class="eq-op">=</span><span>\(\langle R^2\rangle=2l_pL\left[1-\frac{l_p}{L}(1-e^{-L/l_p})\right]\)</span></div>
</div>

<p>L 远小于 l_p 时像硬杆；L 远大于 l_p 时像柔性链，Kuhn length 约为 2l_p。</p>
<h2 id="非理想链与-Flory-理论">非理想链与 Flory 理论</h2><p>真实链不能自己穿过自己，排除体积会使链在好溶剂中膨胀。</p>
<div class="equation-block">
  <div><span class="eq-left">Flory F</span><span class="eq-op">=</span><span>\(F/k_BT\approx\frac{R^2}{Nb^2}+\frac{vN^2}{R^d}\)</span></div>
  <div><span class="eq-left">Flory nu</span><span class="eq-op">=</span><span>\(\nu=3/(d+2)\)</span></div>
  <div><span class="eq-left">3D good</span><span class="eq-op">=</span><span>\(R\approx bN^{3/5}\)</span></div>
  <div><span class="eq-left">theta</span><span class="eq-op">=</span><span>\(R\approx bN^{1/2}\)</span></div>
  <div><span class="eq-left">poor</span><span class="eq-op">=</span><span>\(R\approx bN^{1/3}\)</span></div>
</div>

<h2 id="聚合物溶液">聚合物溶液</h2><p>Flory-Huggins 理论把混合熵和相互作用能写在一个自由能里。聚合物的混合熵比小分子小，因为一整条链作为一个整体移动。</p>
<div class="equation-block">
  <div><span class="eq-left">FH</span><span class="eq-op">=</span><span>\(f/k_BT=\frac{\phi}{N}\ln\phi+(1-\phi)\ln(1-\phi)+\chi\phi(1-\phi)\)</span></div>
  <div><span class="eq-left">excluded</span><span class="eq-op">=</span><span>\(v=b^3(1-2\chi)\)</span></div>
  <div><span class="eq-left">theta</span><span class="eq-op">=</span><span>\(\chi=1/2\)</span></div>
  <div><span class="eq-left">overlap</span><span class="eq-op">=</span><span>\(\phi^*\approx Nb^3/R^3\)</span></div>
  <div><span class="eq-left">spinodal</span><span class="eq-op">=</span><span>\(\partial_\phi^2f=0\)</span></div>
</div>

<h2 id="考试抓手">考试抓手</h2><p>先判断链模型：ideal chain、wormlike chain、self-avoiding chain、polymer solution。尺寸标度最常考：N^(1/2)、N^(3/5)、N^(1/3) 分别对应理想链、好溶剂、塌缩球。</p>
