---
title: 生物物理
date: '2026-06-25'
updated: '2026-06-25'
permalink: notes/biophysics/
description: 从尺度、热涨落和输运出发，建立生命系统的物理图像。
categories:
- 课程笔记
tags:
- 课程笔记
- 生命系统
katex: true
comments: false
---

<p>这页是我按课程口试和期末复习整理出来的个人笔记，不是课程 PPT、教材或老师讲义的转载。它的目标很简单：看到一个生物物理问题时，先说清楚物理图像，再写出最小模型，最后能解释这个模型为什么对真实生命系统有用。</p>
<h2 id="课程地图">课程地图</h2><table>
<thead>
<tr>
<th>周次</th>
<th>主题</th>
<th>复习抓手</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td>Introduction: length and time scales</td>
<td>数量级、(k_B T)、细胞和分子尺度</td>
</tr>
<tr>
<td>2-3</td>
<td>Model systems</td>
<td>模型系统、hemoglobin、phage、E. coli、squid giant axon</td>
</tr>
<tr>
<td>4</td>
<td>Mechanical and chemical equilibrium in cells</td>
<td>自由能、化学势、渗透压、平衡条件</td>
</tr>
<tr>
<td>5</td>
<td>Statistical mechanics in biophysics</td>
<td>配分函数、Boltzmann 权重、结合概率</td>
</tr>
<tr>
<td>6</td>
<td>Two-state systems</td>
<td>分子开关、配体结合、协同性</td>
</tr>
<tr>
<td>7</td>
<td>Random walk, diffusion and biomolecules</td>
<td>随机游走、Fick 定律、扩散时间尺度</td>
</tr>
<tr>
<td>8</td>
<td>Electrostatics for salty solutions</td>
<td>Debye 屏蔽、Poisson-Boltzmann 方程</td>
</tr>
<tr>
<td>9</td>
<td>Beam theory and cellular architecture</td>
<td>弯曲能、persistence length、细胞骨架</td>
</tr>
<tr>
<td>10</td>
<td>Biological membranes</td>
<td>脂双层、膜弯曲、通道和泵</td>
</tr>
<tr>
<td>11</td>
<td>Biological electricity and neurobiophysics</td>
<td>Nernst 电位、动作电位、HH 模型</td>
</tr>
<tr>
<td>12</td>
<td>Blood vessel and biological transport</td>
<td>黏性流、Poiseuille 流、运输限制</td>
</tr>
<tr>
<td>13</td>
<td>Rare event dynamics</td>
<td>势垒跨越、Kramers 图像、等待时间</td>
</tr>
<tr>
<td>14-15</td>
<td>Biological networks</td>
<td>基因调控、反馈、随机表达、图案形成</td>
</tr>
<tr>
<td>16</td>
<td>Experimental techniques</td>
<td>显微成像、荧光标记、分辨率极限</td>
</tr>
</tbody></table>
<p>这门课可以压缩成一条主线：生命系统不是确定性机器，而是处在热涨落、耗散、输运和反馈调控中的软物质系统。生物物理的做法就是把复杂现象降到少数状态变量、能量项和动力学方程，再检查数量级是否合理。</p>
<h2 id="1-尺度和模型系统">1. 尺度和模型系统</h2><p>生物物理第一步通常不是写复杂方程，而是估算尺度。细胞大约是微米量级，蛋白质和 DNA 的局部结构是纳米量级，分子构象变化的典型能量常常只有几个 (k_B T)。这意味着热涨落不是背景噪声，而是会直接决定分子开关、结合解离和构象变化。</p>
<p>模型系统的意义在于把机制从复杂生命体里抽出来。Hemoglobin 用来理解结构、配体结合和协同性；bacteriophage 适合讨论 DNA 包装和遗传信息；E. coli 是基因调控和代谢的经典系统；squid giant axon 因为轴突很粗，适合做动作电位实验。</p>
<p><strong>常见问法：为什么需要 model system？</strong><br>因为我们想研究的是机制，不是某个物种本身。好的模型系统通常容易操作、实验工具成熟，同时保留目标机制。比如 squid giant axon 不代表所有神经元，但它让电生理测量变得可行，所以适合建立动作电位的物理模型。</p>
<h2 id="2-自由能、化学势和渗透压">2. 自由能、化学势和渗透压</h2><p>细胞中的平衡条件更自然地用自由能和化学势表达。自由能同时包含能量和熵：</p>
<p>[<br>F = E - TS,\qquad F=-k_B T\ln Z.<br>]</p>
<p>当两个区域可以交换粒子时，平衡条件是化学势相等；如果有半透膜，水可以通过而溶质不能通过，溶质的混合熵会产生渗透压。稀溶液的 van’t Hoff 形式是</p>
<p>[<br>\Pi = c k_B T,<br>]</p>
<p>或者用摩尔浓度写成 (\Pi=cRT)。这个公式形式上像理想气体压强，本质是稀溶质的平移熵。</p>
<p><strong>常见问法：为什么自由能比能量更重要？</strong><br>因为生物系统不只是找势能最低的构型，还要考虑状态数。膜自组装、疏水效应、蛋白折叠都不能只靠势能解释；很多时候熵项决定了方向。</p>
<h2 id="3-Boltzmann-分布和两态系统">3. Boltzmann 分布和两态系统</h2><p>如果一个分子有若干离散状态，平衡概率由 Boltzmann 权重给出：</p>
<p>[<br>P_i=\frac{e^{-\beta E_i}}{Z},\qquad Z=\sum_i e^{-\beta E_i},\qquad \beta=\frac{1}{k_B T}.<br>]</p>
<p>两态模型是生物物理里最常用的最小模型。比如通道开关、配体结合、蛋白折叠都可以先近似成 open/closed、bound/unbound 或 folded/unfolded。若两态能量差为 (\Delta E=E_{\rm open}-E_{\rm closed})，则</p>
<p>[<br>P_{\rm open}=\frac{1}{1+e^{\beta\Delta E}}.<br>]</p>
<p>外界变量会改变 (\Delta E)。电压、力、配体浓度、磷酸化状态都可以通过改变自由能差来调节状态占有率。</p>
<h2 id="4-配体结合和协同性">4. 配体结合和协同性</h2><p>简单一位点结合的占有率是</p>
<p>[<br>p=\frac{c/K_D}{1+c/K_D}.<br>]</p>
<p>这里 (K_D) 是解离常数。简单结合中，当 (c=K_D) 时占有率为 (1/2)。(K_D) 越小，说明低浓度下就能明显结合，亲和力越强。</p>
<p>协同性会让响应曲线更陡。常用 Hill 形式写作</p>
<p>[<br>p=\frac{c^n}{K_D^n+c^n}.<br>]</p>
<p>(n&gt;1) 表示正协同性。Hemoglobin 的氧结合曲线是经典例子：一个氧结合后会改变整体构象，提高其他位点的氧亲和力。这样它在肺部高氧分压下容易装氧，在组织低氧分压下容易放氧。</p>
<h2 id="5-随机游走和扩散">5. 随机游走和扩散</h2><p>扩散的微观图像是随机游走。单个分子的轨迹很乱，但大量粒子的浓度场满足确定性方程。一维均方位移为</p>
<p>[<br>\langle x^2\rangle=2Dt,<br>]</p>
<p>三维为</p>
<p>[<br>\langle r^2\rangle=6Dt.<br>]</p>
<p>Fick 定律写作</p>
<p>[<br>J=-D\nabla c,<br>]</p>
<p>对应扩散方程</p>
<p>[<br>\frac{\partial c}{\partial t}=D\nabla^2 c.<br>]</p>
<p>最重要的数量级判断是</p>
<p>[<br>t\sim \frac{L^2}{D}.<br>]</p>
<p>所以扩散在纳米到微米尺度很有效，但距离增加十倍，时间会增加一百倍。细胞内局部输运可以依赖扩散，长距离神经信号和组织输运则需要电信号、流体运输或主动运输。</p>
<h2 id="6-盐溶液静电和-Debye-屏蔽">6. 盐溶液静电和 Debye 屏蔽</h2><p>DNA、蛋白和膜表面经常带电。水的高介电常数会削弱库仑相互作用，盐溶液中的可移动离子还会重新分布形成 screening cloud。电势的基本方程是</p>
<p>[<br>\nabla^2\phi=-\frac{\rho}{\varepsilon}.<br>]</p>
<p>在稀盐溶液中，离子浓度按 Boltzmann 因子分布。把 Poisson 方程和 Boltzmann 分布合在一起就是 Poisson-Boltzmann 方程。小电势近似下可以线性化，得到 Debye-Huckel 图像：电势在 Debye length (\lambda_D) 尺度上指数衰减。</p>
<p>高盐意味着可移动离子更多，屏蔽更强，(\lambda_D) 更短。因此带电分子之间的长程静电相互作用会被削弱。</p>
<p><strong>常见问法：Debye-Huckel 什么时候不可靠？</strong><br>当 (e\phi) 和 (k_B T) 同量级甚至更大时，不能把 Boltzmann 因子线性化。强带电表面、低盐、局部高电势区域都需要更完整的非线性处理。</p>
<h2 id="7-细胞骨架、梁理论和弯曲能">7. 细胞骨架、梁理论和弯曲能</h2><p>细胞内的 DNA、微管、肌动蛋白和中间纤维都可以看成有弹性的细长结构。最基本的弯曲能形式是</p>
<p>[<br>E_{\rm bend}=\frac{\kappa}{2}\int C^2,ds,<br>]</p>
<p>其中 (\kappa) 是弯曲刚度，(C) 是曲率。persistence length 描述链方向相关性衰减的长度：</p>
<p>[<br>l_p=\frac{\kappa}{k_B T}.<br>]</p>
<p>当链长远小于 (l_p) 时，它像硬杆；远大于 (l_p) 时，它表现得更像柔性链。这个概念可以用来理解 DNA loop、细胞骨架支撑和热涨落下的形变。</p>
<p><strong>常见问法：DNA looping 为什么会有合适长度？</strong><br>小 loop 弯曲能太高；大 loop 弯曲能低，但两端在空间中找到彼此的熵代价更大。弯曲能和熵代价竞争，会给出一个更容易形成 loop 的长度范围。</p>
<h2 id="8-生物膜和跨膜运输">8. 生物膜和跨膜运输</h2><p>脂双层的核心物理图像是两亲分子自组装：亲水头基面对水，疏水尾部避开水。膜既是二维流体，又有弯曲刚度。常用 Helfrich 弯曲能写成</p>
<p>[<br>F=\int \left[\frac{\kappa}{2}(2H-C_0)^2+\bar{\kappa}K+\sigma\right]dA.<br>]</p>
<p>离子不能直接穿过脂双层，因为疏水内部对带电粒子和水合壳代价很高。细胞因此需要通道和泵。channel 通常顺电化学梯度被动运输，速度快；pump 消耗 ATP 或利用其他离子梯度，可以逆梯度运输。</p>
<h2 id="9-生物电和神经生物物理">9. 生物电和神经生物物理</h2><p>膜电位来自离子浓度差和膜选择性通透。单一离子的平衡电位由 Nernst 方程给出：</p>
<p>[<br>E_i=\frac{k_B T}{z_i e}\ln\frac{c_{\rm out}}{c_{\rm in}}.<br>]</p>
<p>当膜电位等于某离子的 Nernst potential 时，该离子的浓度梯度和电场驱动力正好平衡，净电化学驱动力为零。</p>
<p>动作电位不是简单的被动扩散，而是可再生波。局部 depolarization 打开电压门控 Na(^+) 通道，Na(^+) 内流进一步 depolarize，并触发相邻膜段。Hodgkin-Huxley 模型把膜电流写成电容项加离子通道电流：</p>
<p>[<br>C_m\frac{dV}{dt}=I_{\rm ext}-g_{\rm Na}m^3h(V-E_{\rm Na})-g_K n^4(V-E_K)-g_L(V-E_L).<br>]</p>
<p>这里 (m) 是 Na(^+) activation，(h) 是 Na(^+) inactivation，(n) 是 K(^+) activation。(m) 快速打开产生上升沿，(h) 失活和 (n) 打开帮助终止脉冲并恢复静息电位。refractory period 让信号不容易反向传播，也限制神经元最高放电频率。</p>
<h2 id="10-血管、流体和生物输运">10. 血管、流体和生物输运</h2><p>在小尺度生物系统中，黏性通常比惯性重要。管道中的层流可以用 Poiseuille 图像理解：</p>
<p>[<br>Q=\frac{\pi R^4}{8\eta L}\Delta p.<br>]</p>
<p>半径 (R) 的四次方依赖很关键：血管半径轻微改变就会显著影响流量。这个结果也提醒我们，生物系统常通过几何结构调节输运效率。</p>
<p>对单个细胞而言，扩散限制也很重要。完全吸收的球形细胞在稳态扩散下吸收速率量级为</p>
<p>[<br>I=4\pi D c_0 R.<br>]</p>
<p>而代谢需求通常随体积 (R^3) 增长，所以细胞不能无限变大。变扁、增加表面积、建立主动运输和内部流动，都是缓解输运限制的方式。</p>
<h2 id="11-稀有事件和势垒跨越">11. 稀有事件和势垒跨越</h2><p>许多生物过程不是连续平滑发生的，而是需要跨越自由能势垒，比如蛋白构象切换、分子马达步进、通道开关和化学反应。基本图像是：系统大多数时间在稳定态附近热涨落，偶尔靠涨落越过势垒。</p>
<p>Kramers 图像中，跃迁速率主要由势垒高度控制：</p>
<p>[<br>k\propto e^{-\Delta F/k_B T}.<br>]</p>
<p>所以势垒只增加几个 (k_B T)，等待时间就可能增加很多。口试里如果被问到 rare event，可以先讲这个指数敏感性，再联系分子开关或反应速率。</p>
<h2 id="12-生物网络和随机表达">12. 生物网络和随机表达</h2><p>基因调控网络可以用热力学模型和动力学模型两种语言描述。热力学模型关注 promoter 各状态的权重，从而计算 RNAP 结合概率和平均表达水平；它适合解释稳态 fold-change。随机动力学模型则关注 mRNA 和蛋白数量随时间跳变，适合解释单细胞噪声和 burst。</p>
<p>最简单的转录-翻译模型可以写成</p>
<p>[<br>\frac{dm}{dt}=r_m-\gamma_m m,\qquad<br>\frac{dp}{dt}=r_p m-\gamma_p p.<br>]</p>
<p>如果考虑分子数很少，连续方程不够，需要 master equation 或 Gillespie simulation。噪声常用 Fano factor 衡量：</p>
<p>[<br>F=\frac{\mathrm{Var}(N)}{\langle N\rangle}.<br>]</p>
<p>Poisson 过程 (F=1)。如果 (F&gt;1)，常提示 promoter switching 或 bursty expression。</p>
<p>反馈和非线性会产生更复杂的网络行为。负反馈可以稳定表达、降低噪声；正反馈可以产生双稳态和开关；反应-扩散系统在合适条件下可以产生空间图案。</p>
<h2 id="13-实验技术">13. 实验技术</h2><p>实验技术部分可以抓住两个核心问题：第一，如何把看不见的分子过程转化成可测信号；第二，测量本身有什么物理限制。光学显微镜的分辨率受衍射限制，量级约为</p>
<p>[<br>d\sim \frac{\lambda}{2NA}.<br>]</p>
<p>荧光显微镜的优势是特异性标记。它不是只看细胞形状，而是能在复杂背景中观察特定蛋白、RNA、离子浓度或构象状态。真正回答实验问题时，还要考虑光漂白、信噪比、时间分辨率和标记是否扰动原系统。</p>
<h2 id="口试高频问答">口试高频问答</h2><p><strong>问：这门课的核心思想是什么？</strong><br>答：用物理模型理解生命系统。具体来说，是把复杂生物过程拆成状态变量、能量、熵、输运和动力学，再用数量级估算判断机制是否合理。</p>
<p><strong>问：为什么 (k_B T) 很重要？</strong><br>答：因为分子尺度上很多能量差只有几个 (k_B T)。此时热涨落不是无关噪声，而是决定构象变化、结合解离、通道开关的核心因素。</p>
<p><strong>问：为什么扩散在长距离上很慢？</strong><br>答：扩散时间满足 (t\sim L^2/D)。距离增加 10 倍，时间增加 100 倍。所以局部输运可以依赖扩散，厘米尺度的快速信号不能只靠扩散。</p>
<p><strong>问：Debye length 是什么？</strong><br>答：它是盐溶液中电势被离子屏蔽的长度尺度。距离带电物体超过几个 Debye length 后，电势会明显衰减。</p>
<p><strong>问：channel 和 pump 的区别？</strong><br>答：channel 通常顺电化学梯度被动运输，速度快；pump 消耗 ATP 或利用其他离子梯度，可以逆梯度运输。</p>
<p><strong>问：HH 模型中 (n,m,h) 分别是什么？</strong><br>答：(n) 是 K(^+) activation，(m) 是 Na(^+) activation，(h) 是 Na(^+) inactivation。(m) 快速打开产生上升沿，(h) 和 (n) 帮助终止脉冲并恢复静息电位。</p>
<p><strong>问：热力学模型为什么不够？</strong><br>答：它没有时间，也没有随机轨迹。单细胞中 mRNA 数量少，表达常有 burst 和噪声，因此需要随机动力学模型。</p>
<h2 id="资料公开边界">资料公开边界</h2><p>这页只放我自己的整理和复习笔记。课程 PPT、教材 PDF、老师讲义和原始作业文件保留在本地私有课程资料夹，不放到公开 GitHub 仓库或个人网站。之后如果要公开更多内容，比较稳妥的做法是只上传自己改写后的知识笔记、公式卡和思路说明，不上传原始课件或教材扫描件。</p>
