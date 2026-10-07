---
title: Fluid Dynamics
date: '2026-06-19'
layout: page
katex: true
comments: false
---

<p>Instructor: Zhang Hepeng<br>中文版：<a href="/zh/course-notes/soft-matter-core-notes/fluid-dynamics/">流体动力学</a><br>Back to: <a href="/notes/soft-matter-core-notes/">Soft Matter Physics Course Notes</a></p>
<h2 id="Core-Picture">Core Picture</h2><p>Soft matter usually moves in water, oil, or complex fluids. At micron scales, inertia is often weak and viscosity dominates. When force is removed, motion stops almost immediately.</p>
<h2 id="Continuum-Description">Continuum Description</h2><p>Fluid dynamics describes a fluid with velocity field v(r,t), pressure p(r,t), and density rho.</p>
<div class="equation-block">
  <div><span class="eq-left">material D</span><span class="eq-op">=</span><span>\(\frac{D}{Dt}=\partial_t+\mathbf v\cdot\nabla\)</span></div>
  <div><span class="eq-left">continuity</span><span class="eq-op">=</span><span>\(\partial_t\rho+\nabla\cdot(\rho\mathbf v)=0\)</span></div>
  <div><span class="eq-left">incompressible</span><span class="eq-op">=</span><span>\(\nabla\cdot\mathbf v=0\)</span></div>
</div>

<p>The material derivative follows a moving fluid element. Incompressibility is a good approximation for water and many soft-matter experiments.</p>
<h2 id="Viscosity-and-Newtonian-Fluid">Viscosity and Newtonian Fluid</h2><p>For a Newtonian fluid, shear stress is proportional to shear rate.</p>
<div class="equation-block">
  <div><span class="eq-left">shear</span><span class="eq-op">=</span><span>\(\tau=\eta\dot\gamma\)</span></div>
  <div><span class="eq-left">stress</span><span class="eq-op">=</span><span>\(\sigma_{ij}=-p\delta_{ij}+\eta(\partial_i v_j+\partial_j v_i)\)</span></div>
  <div><span class="eq-left">viscosity</span><span class="eq-op">=</span><span>\(\eta\) measures momentum diffusion</span></div>
</div>

<h2 id="Navier-Stokes-and-Low-Re-Limit">Navier-Stokes and Low-Re Limit</h2><p>Navier-Stokes is momentum conservation. In soft matter, the low-Reynolds-number limit often applies, giving the Stokes equation.</p>
<div class="equation-block">
  <div><span class="eq-left">NS</span><span class="eq-op">=</span><span>\(\rho\frac{D\mathbf v}{Dt}=-\nabla p+\eta\nabla^2\mathbf v+\mathbf f\)</span></div>
  <div><span class="eq-left">Re</span><span class="eq-op">=</span><span>\(\rho U L/\eta\)</span></div>
  <div><span class="eq-left">Stokes</span><span class="eq-op">=</span><span>\(0=-\nabla p+\eta\nabla^2\mathbf v+\mathbf f\)</span></div>
  <div><span class="eq-left">constraint</span><span class="eq-op">=</span><span>\(\nabla\cdot\mathbf v=0\)</span></div>
</div>

<p>Small Re means viscous forces dominate and inertial memory is negligible. This is the basis of microfluidics, colloidal hydrodynamics, and cellular-scale motion.</p>
<h2 id="Drag-on-a-Sphere">Drag on a Sphere</h2><p>A sphere of radius R moving with speed U through a viscous fluid experiences Stokes drag.</p>
<div class="equation-block">
  <div><span class="eq-left">drag</span><span class="eq-op">=</span><span>\(F=6\pi\eta R U\)</span></div>
  <div><span class="eq-left">mobility</span><span class="eq-op">=</span><span>\(U=\mu F\)</span></div>
  <div><span class="eq-left">mu</span><span class="eq-op">=</span><span>\(\mu=\frac{1}{6\pi\eta R}\)</span></div>
</div>

<p>This formula connects directly to the Stokes-Einstein relation in Brownian motion.</p>
<h2 id="Poiseuille-Flow">Poiseuille Flow</h2><p>Flow through a narrow tube is extremely sensitive to tube radius.</p>
<div class="equation-block">
  <div><span class="eq-left">Poiseuille</span><span class="eq-op">=</span><span>\(Q=\frac{\pi a^4\Delta p}{8\eta L}\)</span></div>
  <div><span class="eq-left">resistance</span><span class="eq-op">=</span><span>\(\frac{\Delta p}{Q}=\frac{8\eta L}{\pi a^4}\)</span></div>
</div>

<h2 id="Exam-Cue">Exam Cue</h2><p>For micron-scale motion in water, estimate Re first. If Re is small, use Stokes equation, Stokes drag, mobility, and then connect to Stokes-Einstein diffusion when thermal noise is included.</p>
