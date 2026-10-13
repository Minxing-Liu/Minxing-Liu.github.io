---
title: Kenyon Cell连接模式科研背景梳理
date: '2026-10-12'
updated: '2026-10-13'
permalink: notes/kenyon-cell-connectivity-background/
description: 从 LK17 的前馈与递归抑制模型出发，明确 KC 局部连接、APL 动力学、线性响应、表征维度、噪声和学习读出的方程与比较条件。
categories:
- 研究笔记
tags:
- 计算神经科学
- 蘑菇体
- Kenyon细胞
- 递归网络
katex: true
comments: false
disableNunjucks: true
---

果蝇蘑菇体通过 Kenyon 细胞（KC）的稀疏活动表征气味。PN–KC 前馈连接决定感觉输入如何进入这一表征，KC 轴突之间的局部调制和 APL 反馈则参与活动调节与学习。本文依据公开论文，梳理这些连接的位置、受体机制及其对气味表征和联想学习的影响。

第 1–3 节整理生物学背景，第 4 节从 LK17 原始方程进入递归扩展，第 5–7 节给出动力学、线性响应和评价指标，第 8–9 节说明状态门控与数值比较。新增的连续动力学和学习规则均注明建模假设，不作为 LK17 原文或生理实验已经确定的方程。

<!-- more -->

## 1. 前馈扩张模型提供的起点

果蝇蘑菇体的嗅觉通路中，投射神经元（projection neuron，PN）将感觉输入传递到 Kenyon 细胞（KC）。KC 的树突位于萼部（calyx），轴突沿柄部进入蘑菇体叶部；叶部的 KC→蘑菇体输出神经元（MBON）连接参与联想记忆的形成与读出。

前馈模型强调两点：输入被映射到数量更多的 KC，形成扩张表征；一次气味刺激只激活其中一小部分 KC，形成稀疏活动。Litwin-Kumar 等（2017）进一步研究每个 KC 的输入连接数 $K$，以及它在资源约束下对表征维度和学习性能的影响 [1]。

以二值 KC 模型为例，

$$
y_i=\Theta\!\left(\sum_j J_{ij}x_j-\theta_i\right),
$$

其中 $x_j$ 是 PN 活动，$J_{ij}$ 是 PN→KC 权重，$\Theta$ 为阶跃函数。输入连接数增加可以丰富单个 KC 对输入的混合，也可能增加不同 KC 的共享输入；阈值、活动水平和突触预算共同决定最终结果。

因此，$K^\star$ 是在指定目标和约束下得到的最优值，不能脱离活动水平和突触预算给出统一数值。原模型的推导见[最优突触连接数：模型与公式推导](/notes/optimal-degrees-synaptic-connectivity/)。

前馈模型描述输入到 KC 的映射。理解真实回路还需要考虑局部神经调制和反馈抑制，它们分别影响神经信号与可塑性的不同环节。

## 2. 局部调制与反馈抑制

| 连接 | 主要位置 | 公开研究支持的作用 |
|---|---|---|
| PN→KC | 萼部 | 将感觉输入映射到 KC 群体，形成扩张与稀疏表征 [1] |
| KC 轴突间侧向调制 | 蘑菇体叶部 | mAChR-B 介导局部信号抑制及状态相关的学习门控 [2,3] |
| KC→APL→KC 反馈 | 萼部及叶部 | GABA 能反馈抑制，具有空间局部性 [4] |

### 2.1 叶部轴突间作用：mAChR-B 与学习特异性

Manoim 等（2022）表明，KC 之间的轴突侧向作用可通过毒蕈碱型乙酰胆碱受体 mAChR-B，抑制邻近 KC 中的钙信号和 cAMP 信号，并限制非特异性的嗅觉条件学习 [2]。

这一结果说明，胆碱能连接不等于快速兴奋连接。对该机制的简化可以采用负的有效耦合，但这种近似主要描述指定工作点附近的净作用，不能覆盖受体调制和突触可塑性的全部过程。

Manoim Wolkovitz 等（2026）进一步发现，mAChR-B 的作用依赖膜电位：在静息、未活跃的 KC 中，受体处于较高活性状态，限制可塑性；KC 去极化时，受体转入较低活性状态，允许相关学习发生 [3]。

| KC 状态 | mAChR-B 状态 | 对学习的作用 |
|---|---|---|
| 未被当前气味充分激活 | 较高活性 | 限制无关 KC 的可塑性，减少错误关联 |
| 被当前气味激活并去极化 | 较低活性 | 减弱对可塑性的限制，保留有效学习 |

因此，这种局部调制同时涉及学习的**敏感性**与**特异性**：前者要求弱但有效的信号仍能形成记忆，后者要求无关信号不会被错误关联。只计算 KC 活动的相关系数，不能完整评估这一机制；还需要把 KC→MBON 可塑性及行为读出纳入模型。

### 2.2 APL 反馈：广泛覆盖下的局部作用

APL（anterior paired lateral）是覆盖蘑菇体较大范围的非脉冲型 GABA 能神经元。它接收 KC 输入并向 KC 提供反馈抑制。

Amin 等（2020）通过局部刺激和体积钙成像发现，APL 内的活动传播及其对 KC 的抑制均具有空间局部性。结合连接组的模型还预测，单个 KC 经 APL 产生的自抑制可能强于它对另一个 KC 的抑制 [4]。

这为模型选择提供了依据：全局均匀反馈可以作为简化基准；研究空间结构时，需要允许反馈强度随突触位置和传播距离改变。功能分区也不意味着各区域完全独立。

![APL 与 KC 的连接位置、局部传播和有效抑制结构，Amin 等 2020 Figure 8](https://cdn.ncbi.nlm.nih.gov/pmc/blobs/5ee1/7541083/d655837f56af/elife-56954-fig8.jpg)

*图 1：Amin 等（2020）Figure 8，原图完整引用。A–D 展示 KC、APL 及两者之间的突触分布；G 示意如何由沿 APL 的传播距离估计 KC 之间的有效抑制；H–J 比较不同传播条件下的模型结果。后者是结合解剖和生理信息得到的预测，并非直接测得的抑制权重。来源：[原文与图注](https://pmc.ncbi.nlm.nih.gov/articles/PMC7541083/#fig8)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，未修改。点击图片可放大查看。*

## 3. 状态和学习会改变连接的有效作用

### 3.1 睡眠与 SK 通道

Chen 等（2026）发现，在其实验条件下，急性睡眠剥夺损害相似气味的模式分离，却未损害所测试的经典条件学习。这伴随更多 KC 被激活，以及气味表征重叠增加 [5]。

其机制涉及 APL 中小电导钙激活钾通道（SK）：睡眠不足增强 SK 介导的后超极化，降低对 KC 的反馈抑制。特异性降低 APL 中的 SK 表达能够缓解相应缺陷。

这表明，稀疏度和抑制增益并非始终固定的生物量。建模时应区分两种比较：固定稀疏度，用于识别连接结构本身的作用；允许稀疏度随状态变化，用于模拟生理状态改变的总体效应。这项工作并未直接证明表征维度或 $K^\star$ 随睡眠按某个方向变化。

## 4. 从 LK17 的原始方程到连接矩阵扩展

### 4.1 统一记号与前馈模型

下面用 $N$ 表示 PN 数，$M$ 表示 KC 数。$J_{ik}$ 表示 PN $k$ 到 KC $i$ 的权重，递归矩阵 $R_{ij}$ 表示 KC $j$ 对 KC $i$ 的作用，即**列为发送端，行为接收端**。

| 记号 | 定义 |
|---|---|
| $\mathbf x\in\mathbb R^N$ | PN 输入 |
| $\mathbf m\in\{0,1\}^M$ | 二值 KC 活动 |
| $K$ | 每个 KC 接收的 PN 兴奋性连接数 |
| $\boldsymbol\theta$ | KC 阈值 |
| $g_A,g_B,g_E\ge0$ | APL、局部负耦合和局部正耦合的强度 |
| $\mathbf u,\mathbf r$ | 连续模型的有效输入和连续活动 |

定义连接指示矩阵 $A_{ik}\in\{0,1\}$，满足 $\sum_k A_{ik}=K$。为与 LK17 补充图 S2 的归一化一致，以下取 $J^+_{ik}=A_{ik}/\sqrt K$。这是权重标度的选择；更改标度时，阈值和抑制强度也须相应调整。

LK17 的前馈模型可写成

$$
h_i^{\mathrm{ff}}=\sum_{k=1}^N J^+_{ik}x_k-a\sum_{k=1}^N x_k,
\qquad
m_i=\Theta(h_i^{\mathrm{ff}}-\theta_i).
\tag{1}
$$

负项由 **PN 输入**驱动，可以吸收到有效输入矩阵 $J_{ik}=J^+_{ik}-a$ 中。于是原始映射仍是 $\mathbf m=\Theta(J\mathbf x-\boldsymbol\theta)$，不需要求解 KC 活动的自洽方程。

### 4.2 LK17 已有的递归抑制模型

LK17 补充图 S2 将前馈抑制替换为 KC 群体活动驱动的反馈 [1]。将原文的 $w^-$ 记作 $g_A$，被选中神经元的更新为

$$
m_i^{(n+1)}=
\Theta\!\left[
\sum_kJ^+_{ik}x_k-
\frac{g_A}{M}\sum_jm_j^{(n)}-\theta_i
\right].
\tag{2}
$$

原文每一步随机选择一个 KC 更新，其他 KC 保持原值；$n$ 是更新次数，不是已经标定的生理时间。原文固定 $\theta_i=0$、改变抑制强度以获得不同活动水平，再与活动水平匹配的前馈网络比较。

令 $\Pi=\mathbf1\mathbf1^\top/M$，则这一反馈的有效矩阵是

$$
R_A=-g_A\Pi.
$$

与式（1）的差别是，抑制由输出 $\mathbf m$ 决定。固定点必须满足

$$
\mathbf m^*=\Theta(J^+\mathbf x+R_A\mathbf m^*-\boldsymbol\theta).
\tag{3}
$$

因此，“增加反馈”首先改变的是输入和输出之间的依赖关系：KC 输出成为下一次 KC 更新的输入。

### 4.3 从均匀反馈到局部连接

引入非负矩阵 $E,B$，分别表示候选正耦合和有效负耦合的空间权重，令 $E_{ii}=B_{ii}=0$。一种明确的静态扩展是

$$
R=g_EE-g_BB-g_A\Pi,
\qquad
m_i^{(n+1)}=\Theta\!\left[
(J^+\mathbf x)_i+\sum_jR_{ij}m_j^{(n)}-\theta_i
\right].
\tag{4}
$$

这里仍可采用式（2）的异步更新。若改成所有神经元同步更新，就改变了动力学规则，必须重新检查振荡和收敛。

| 加入的连接 | 方程新增项 | 被改变的依赖关系 |
|---|---|---|
| 全局 APL | $-g_A\sum_jm_j/M$ | 每个 KC 受群体平均活动影响 |
| 局部有效负耦合 | $-g_B\sum_jB_{ij}m_j$ | KC 受特定邻近或相连 KC 的活动影响 |
| 局部候选正耦合 | $+g_E\sum_jE_{ij}m_j$ | 相连 KC 的活动可增强接收细胞的输入 |

Eichler 等（2017）的幼虫连接组研究已在公开模型中纳入 KC–KC 连接及 APL 反馈，并区分树突与轴突连接 [6]。这一研究提供结构建模的先例，但幼虫连接不能直接等同于成蝇中的受体机制。尤其是，将 $E$ 设为正耦合属于明确的模型假设，不能只凭 EM 突触数确定功能符号。

若 $C_{ij}$ 是某类连接的突触数，可以采用 $B=C/s_B$，其中 $s_B>0$ 是预先指定的归一化尺度，$g_B$ 单独控制整体强度。比较真实结构与随机对照时，应匹配所关心的连接数、总权重或度分布，并说明保留了哪些量。

同样，不能默认 KC 共享的 PN 越多，KC–KC 连接就越强。Eichler 等的幼虫数据没有检出这两者的相关性 [6]；若采用此关系，只能将其列作额外的对照假设。

本节中的 $-g_BB\mathbf m$ 是对局部净作用的现象学近似。mAChR-B 对钙信号、cAMP 和可塑性的调制并不自动等价于对放电的固定负权重，状态门控需要另行描述，见第 8 节。

## 5. 连续动力学及 APL 的显式时间尺度

### 5.1 给 KC 和 APL 各自引入状态变量

二值更新给出了算法，但尚未指定膜或突触的时间常数。为了分析连续时间响应，可以另外构造

$$
\begin{aligned}
\tau_K\dot{\mathbf u}
&=-\mathbf u+J^+\mathbf x
+(g_EE-g_BB)\mathbf r-g_AU\mathbf a,\\
\mathbf r&=\phi(\mathbf u-\boldsymbol\theta),\\
\tau_A\dot{\mathbf a}&=-\mathbf a+V\mathbf r.
\end{aligned}
\tag{5}
$$

$\mathbf u$ 是有效输入变量，$\mathbf r$ 是连续活动。$\phi$ 可以取平滑 sigmoid，或在可微工作区使用阈值线性函数。该连续模型是新增的分析模型，不是式（2）的严格连续时间等价形式。

$\mathbf a\in\mathbb R^L$ 表示 APL 的 $L$ 个有效区室，$V\in\mathbb R^{L\times M}$ 描述 KC 对这些区室的驱动，$U\in\mathbb R^{M\times L}$ 描述区室对 KC 的抑制。$L$ 个变量并不表示 $L$ 个 APL 神经元。

全局均匀反馈对应 $L=1$、$U=\mathbf1$、$V=\mathbf1^\top/M$。局部反馈允许 $U,V$ 非均匀；它们是对 APL 空间作用 [4] 的简化，区室之间是否独立仍是需要说明的假设。

当 APL 比被研究的 KC 变化过程足够快，或只计算稳态时，可以代入 $\mathbf a\approx V\mathbf r$，得到

$$
\tau_K\dot{\mathbf u}
=-\mathbf u+J^+\mathbf x+R\mathbf r,
\qquad
R=g_EE-g_BB-g_AUV.
\tag{6}
$$

$UV$ 的秩至多为 $L$。只有特定的 $U,V$ 才给出投影矩阵；一般的空间反馈矩阵不能直接称为“秩 $L$ 投影”。当 $\tau_A$ 不可忽略时，应保留式（5），不能用静态消元研究反馈延迟造成的振荡。

### 5.2 固定点、可逆性与稳定性

式（6）的固定点满足

$$
\mathbf u^*=J^+\mathbf x+R\mathbf r^*,
\qquad
\mathbf r^*=\phi(\mathbf u^*-\boldsymbol\theta).
\tag{7}
$$

由于 $\phi$ 非线性，一般不能把它改写成 $\phi((I-R)^{-1}J^+\mathbf x-\boldsymbol\theta)$。解析响应应从固定点附近的小扰动出发。

令 $\Gamma=\operatorname{diag}(\phi'(u_i^*-\theta_i))$。对快 APL 模型，局部动力学矩阵为

$$
A_K=\frac{-I+R\Gamma}{\tau_K}.
\tag{8}
$$

线性化系统渐近稳定当且仅当 $A_K$ 所有特征值实部严格小于零，即 $\max\operatorname{Re}\lambda(R\Gamma)<1$；这也给出原非线性系统局部渐近稳定的充分判据。特征值实部等于零的边界需要进一步分析。矩阵 $I-R\Gamma$ 可逆只说明零频线性方程能求解，不足以保证稳定。

若使用平滑的同步迭代 $\mathbf r^{(n+1)}=\phi(J^+\mathbf x+R\mathbf r^{(n)}-\boldsymbol\theta)$，其线性化迭代收敛条件则是 $\rho(\Gamma R)<1$，这也是原平滑迭代的充分局部收敛条件。这个条件不能不加说明地用于二值异步更新。

对保留 APL 时间常数的式（5），令 $R_0=g_EE-g_BB$，应检查完整矩阵

$$
A_{\mathrm{full}}=
\begin{pmatrix}
(-I+R_0\Gamma)/\tau_K & -g_AU/\tau_K\\
V\Gamma/\tau_A & -I/\tau_A
\end{pmatrix}.
\tag{9}
$$

这也明确了加入连接后动力学分析的变化：不仅要看稳态活动，还要看收敛速度、振荡、多稳态和对初始条件的依赖。

## 6. 从连接变化到协方差和维度

### 6.1 固定工作点附近的有效输入映射

固定阈值和权重，在式（7）附近施加小输入扰动 $\delta\mathbf x$，有

$$
\delta\mathbf u=J^+\delta\mathbf x+R\delta\mathbf r,
\qquad
\delta\mathbf r=\Gamma\delta\mathbf u.
$$

代入并移项得到

$$
\begin{aligned}
H_u&=(I-R\Gamma)^{-1}J^+,\\
H_r&=\Gamma(I-R\Gamma)^{-1}J^+
=(I-\Gamma R)^{-1}\Gamma J^+,\\
\delta\mathbf u&=H_u\delta\mathbf x,
\qquad \delta\mathbf r=H_r\delta\mathbf x.
\end{aligned}
\tag{10}
$$

因此，增加连接后，原来的输入映射 $J^+$ 被网络反馈和局部增益共同变换。$R$ 与 $\Gamma$ 一般不能交换顺序；当 $\Gamma=\gamma I$ 时才简化为标量增益形式。

若 $\Sigma_x=\operatorname{Cov}(\delta\mathbf x)$，则

$$
C^u=H_u\Sigma_xH_u^\top,
\qquad
C^r=H_r\Sigma_xH_r^\top.
\tag{11}
$$

这是固定工作点附近、由静态输入扰动产生的协方差。若不同气味使活跃细胞和 $\Gamma$ 大幅改变，单个 $H_r$ 无法代表整个气味集合，应直接模拟各气味响应后估计协方差。

### 6.2 全局反馈和局部反馈对不同方向的作用

对 $R=-g_A\Pi$、$\Gamma=\gamma I$，利用 $\Pi^2=\Pi$，

$$
H_r=\gamma\left(I-\frac{\gamma g_A}{1+\gamma g_A}\Pi\right)J^+.
\tag{12}
$$

在这个均匀增益近似中，群体共同方向 $\mathbf1$ 的增益是 $\gamma/(1+\gamma g_A)$，正交方向的增益是 $\gamma$。全局 APL 因而直接压低共同波动；实际阈值变化仍可能间接改变其他方向。

局部负耦合则不一定压低所有方向。以两个 KC 为例，

$$
R=\begin{pmatrix}0&-b\\-b&0\end{pmatrix},\qquad b\ge0.
$$

共同方向 $(1,1)$ 的特征值是 $-b$，差异方向 $(1,-1)$ 的特征值是 $+b$，对应增益分别为

$$
G_{\mathrm{common}}=\frac{\gamma}{1+\gamma b},
\qquad
G_{\mathrm{difference}}=\frac{\gamma}{1-\gamma b}.
\tag{13}
$$

局部竞争可以压低共同响应、增强差异响应；当 $\gamma b$ 接近 $1$ 时，差异方向也接近失稳。这个例子说明，不能从“连接元素均为负”直接推出“所有模式都被抑制”或“网络始终稳定”。

### 6.3 参与率维度及二值阈值变换

对实际评价的响应向量 $\mathbf y$，定义

$$
D(\mathbf y)=\frac{(\operatorname{tr}C)^2}{\operatorname{tr}(C^2)},
\qquad C=\operatorname{Cov}(\mathbf y).
\tag{14}
$$

当 $C\ne0$ 时，$1\le D\le\operatorname{rank}C$。对式（11）的静态线性响应，秩不超过输入维数；阈值非线性后的输出维度则可以超过输入维数。电流维度、连续活动维度与二值输出维度应分别标记。

若使用**联合高斯电流经过阈值**的近似，并给每个细胞设置相同激活概率 $0<f<1$，对电流方差非零的细胞令

$$
q_{ij}=\frac{C^u_{ij}}{\sqrt{C^u_{ii}C^u_{jj}}},
\qquad z_f=\Phi^{-1}(1-f),
\qquad \theta_i=\bar u_i+z_f\sqrt{C^u_{ii}}.
$$

对 $|q|<1$，二值输出的相关系数由高斯阈值核给出：

$$
F_f(q)=\frac{
\displaystyle\int_{z_f}^{\infty}\varphi(z)
\overline\Phi\!\left(\frac{z_f-qz}{\sqrt{1-q^2}}\right)\,\mathrm dz-f^2
}{f(1-f)},
\tag{15}
$$

其中 $\varphi,\Phi$ 为标准正态密度与分布函数，$\overline\Phi=1-\Phi$；$q=\pm1$ 时使用对应极限。此时 $C^m_{ii}=f(1-f)$、$C^m_{ij}=f(1-f)F_f(q_{ij})$，代入式（14）得到

$$
D_{\mathrm{bin}}=
\frac{M^2}{M+\sum_{i\ne j}F_f(q_{ij})^2}.
\tag{16}
$$

该式在所定义的高斯阈值模型内成立，但非线性递归网络的稳态电流不一定高斯。尤其是更改阈值会改变递归活动和工作点，不能只做一次阈值后处理，就把结果称为原递归网络的精确维度。可先用该表达式作近似，再与完整网络的样本协方差比较。

## 7. 表征之外的分析指标

### 7.1 稀疏度与试次噪声

二值模型的群体激活比例为

$$
f=\mathbb E_{\mu,\xi}\left[\frac1M\sum_i m_i^{\mu,\xi}\right],
$$

$\mu$ 标记气味，$\xi$ 标记同一气味的重复试次。连续模型中，平均活动 $M^{-1}\sum_i r_i$ 与“超过指定判定阈值的细胞比例”是两个不同指标，不能混称为 $f$。

比较连接结构时，可以调节阈值使二值输出的 $f$ 匹配。比较睡眠或抑制改变的总体效应时，则可以固定阈值并让 $f$ 自然变化。这两种比较需要分别报告。

为区分信号与噪声，对统一选定的响应 $\mathbf y^{\mu,\xi}$ 定义

$$
\begin{aligned}
\bar{\mathbf y}^{\mu}&=\mathbb E_\xi[\mathbf y^{\mu,\xi}],\\
C_{\mathrm{signal}}&=\operatorname{Cov}_\mu(\bar{\mathbf y}^{\mu}),\\
C_{\mathrm{noise}}&=\mathbb E_\mu[
\operatorname{Cov}_\xi(\mathbf y^{\mu,\xi}\mid\mu)],\\
C_{\mathrm{total}}&=C_{\mathrm{signal}}+C_{\mathrm{noise}}.
\end{aligned}
\tag{17}
$$

总维度上升可能来自信号方向增加，也可能来自噪声增加。对于气味 $a,b$ 和固定读出方向 $\mathbf w$，可进一步计算

$$
d'_{a,b}=\frac{|\mathbf w^\top(\bar{\mathbf y}^a-\bar{\mathbf y}^b)|}
{\sqrt{\tfrac12\mathbf w^\top(C_a^{\mathrm{noise}}+C_b^{\mathrm{noise}})\mathbf w}}.
\tag{18}
$$

分母非零时，该量同时考虑气味间差异与读出方向上的试次噪声。连接放大某个方向后，必须检查该方向的信号和噪声是否一起被放大。

若研究的是持续的时间噪声，应对线性化状态 $\mathbf z=(\delta\mathbf u,\delta\mathbf a)$ 写出随机动力学

$$
\mathrm d\mathbf z=A_{\mathrm{full}}\mathbf z\,\mathrm dt+L_\eta\,\mathrm d\mathbf W_t.
$$

在稳定条件下，其平稳协方差 $P_z$ 满足

$$
A_{\mathrm{full}}P_z+P_zA_{\mathrm{full}}^\top+L_\eta L_\eta^\top=0.
\tag{19}
$$

这里 $\mathbf W_t$ 是标准 Wiener 过程，$L_\eta$ 给出白噪声强度。式（19）描述时间噪声，式（11）描述静态输入样本的传播，二者对应不同问题。

### 7.2 保持 LK17 的读出规则，比较新增连接的效果

将网络对训练气味的响应记为 $\mathbf y^\mu$，随机二分类标签为 $\ell^\mu\in\{-1,+1\}$。中心化后采用 Hebbian 读出：

$$
\mathbf w=\sum_{\mu=1}^{P}\ell^\mu(\mathbf y^\mu-\bar{\mathbf y}),
\qquad
s=\mathbf w^\top(\widetilde{\mathbf y}-\bar{\mathbf y}),
\qquad
\widehat\ell=\operatorname{sign}s.
\tag{20}
$$

$\bar{\mathbf y}$ 由训练或独立校准数据确定；二值且各细胞激活概率都为 $f$ 时，可用 $f\mathbf1$。训练和测试样本必须分别经过各自的完整网络动力学，不能只给训练表征加上一个矩阵变换。

令正确标签乘以测试分数为 $q=\ell s$，则报告

$$
\epsilon=\Pr(\widehat\ell\ne\ell),
\qquad
\mathrm{SNR}=\frac{\mathbb E[q]^2}{\operatorname{Var}(q)}.
\tag{21}
$$

只有当 $\mathbb E[q]>0$ 且 $q$ 近似高斯时，才可用 $\epsilon\approx\Phi(-\sqrt{\mathrm{SNR}})$；一般情况下直接统计测试误差，并预先规定零分数的分类规则。还应分别统计正类漏报和负类误报，以评价学习效率与特异性。

固定网络规模和任务后，逐渐增大训练模式数 $P$，可定义满足测试误差不超过 $\epsilon_0$ 的最大负载 $P_{\max}$。这是一项给定读出规则下的性能指标，不等同于任意最优分类器的理论容量。

### 7.3 最优连接数必须带有预算与目标

LK17 的一个关键比较固定输入突触预算 $S_{\mathrm{PN}}=MK$，因此改变 $K$ 时同时改变 $M=S_{\mathrm{PN}}/K$。加入递归后有两种不同约束：保持相同 PN 预算、另行报告递归成本；或把新增突触也纳入总预算。

例如，可明确定义

$$
S_{\mathrm{total}}=
c_{\mathrm{PN}}MK+c_E\operatorname{nnz}(E)
+c_B\operatorname{nnz}(B)
+c_A[\operatorname{nnz}(U)+\operatorname{nnz}(V)].
\tag{22}
$$

$c$ 是所选的单位连接成本，$\operatorname{nnz}$ 计数非零连接。全局 APL 虽然消元后产生稠密的 $UV$，其物理通路在最简模型中只有约 $2M$ 条 KC↔APL 连接，不能按 $M^2$ 条直接 KC–KC 突触计费。

在明确预算、活动水平和任务后，分别定义

$$
K_D^*=\operatorname*{argmax}_K D,
\qquad
K_{\epsilon}^*=\operatorname*{argmin}_K\epsilon,
\qquad
K_P^*=\operatorname*{argmax}_K P_{\max}.
\tag{23}
$$

这些最优点未必相同。比较不同连接模式时，需要同时说明其余参数是固定、共同扫描，还是分别优化。

## 8. 从固定负耦合到活动门控与学习

固定的 $B$ 只能描述一种静态有效作用。为表达 mAChR-B 的电压依赖性 [3]，可以增加受体状态 $b_i\in[0,1]$：

$$
\tau_b\dot b_i=b_\infty(v_i)-b_i,
\qquad
b_\infty(v)=\frac1{1+\exp[(v-v_{1/2})/s_v]},
\quad s_v>0.
\tag{24}
$$

这里 $v_i$ 是接受调制的 KC 的膜电位，去极化使 $b_\infty$ 下降。sigmoid 形状、时间常数和参数属于待标定的现象学选择，式（24）不是文献的唯一模型。若只保留式（5）的有效输入 $u_i$，还需说明如何由它近似膜电位，不能直接把无量纲输入当作 mV。

令 $\ell_i^{\mathrm{ACh}}=\sum_jB_{ij}r_j\ge0$ 近似来自其他 KC 的胆碱能驱动，可构造可塑性许可因子

$$
p_i=1-b_i\frac{\ell_i^{\mathrm{ACh}}}{\kappa+\ell_i^{\mathrm{ACh}}},
\qquad \kappa>0.
\tag{25}
$$

当胆碱能驱动存在且受体活性较高时，$p_i$ 变小；接收 KC 去极化、$b_i$ 下降时，$p_i$ 增大。门控变量使用接收细胞的下标 $i$，输入求和使用发送细胞的下标 $j$。

在只研究多巴胺诱导 LTD 的一个简化读出模型中，例如可以写

$$
\tau_e\dot e_i=-e_i+r_i,
\qquad
\dot w_i^{\mathrm{out}}=-\eta\,d(t)e_i p_i,
\tag{26}
$$

其中 $e_i$ 是活动资格迹，$d(t)\ge0$ 表示该 LTD 通路的强化信号，并将权重限制在预先指定的范围内。受体门控因而可以限制噪声活动或残留资格迹导致的错误更新。这是展示“受体状态进入学习方程”的例子；它不替代完整的 cAMP 生化过程，也不覆盖所有多巴胺效应。

式（20）的 Hebbian 分类器和式（26）的局部 LTD 读出是两种不同实验设定：前者用于固定规则下比较表征，后者用于检验学习门控。采用后者时，需重新训练并统计误报、漏报和训练次数，不能沿用前者的性能结果。

若同时保留活动方程中的 $-g_BB\mathbf r$ 和学习方程中的门控，需要分别标定两者，避免重复计算同一受体作用。引入 $b_i,e_i$ 后，完整系统的状态变量增多；若还允许 $E,B$ 或 APL 权重学习，必须另给权重更新规则和边界，不能从静态协方差直接推出学习后的最优点。

## 9. 与公式对应的数值比较流程

1. **固定输入与基础连接。** 为各模型使用相同的气味及试次噪声样本，固定 PN 数、输入预算与 $J^+$ 的生成规则。记录权重归一化。
2. **分别定义比较模型。** 比较前馈、全局反馈、局部负耦合及联合模型；候选正耦合、APL 区室和受体门控作为单独明确的条件。由式（4）或式（5）产生响应。
3. **先判定动力学状态。** 连续模型检查完整 Jacobian，并核对时间轨迹；二值异步模型检查状态是否停止改变，并从多个初值重复。持续振荡或多稳态结果单独记录，不当作唯一固定点。
4. **在校准集上匹配活动水平。** 需要固定 $f$ 时重新调阈值，并重新求解整个递归网络。阈值和读出参数均不根据测试标签调整。
5. **分别测量表征与任务指标。** 由样本响应得到 $f$、$C_{\mathrm{signal}}$、$C_{\mathrm{noise}}$、$D$、$d'$、误报、漏报和分类误差。用式（10）–（16）检验近似在哪些参数范围内可靠。
6. **在稳定且预算一致的范围扫描。** 分别扫描 $K$、连接强度、APL 时间常数或门控参数，报告不同目标对应的最优点，并在多个网络抽样上给出变异范围。

这条分析链把连接矩阵、时间响应、协方差和学习表现逐项对应起来。连接的正负号决定方程中的作用方向，最终的表征与任务收益仍由网络结构、输入统计和读出共同决定。

## 参考文献

以下论文分别支持前馈扩张、轴突局部调制、APL 空间作用和状态依赖性等背景论述。

1. Litwin-Kumar A, et al. **Optimal Degrees of Synaptic Connectivity.** *Neuron*, 2017, 93:1153–1164.e7. [DOI](https://doi.org/10.1016/j.neuron.2017.01.030)。前馈扩张、资源约束与最优连接数。
2. Manoim JE, et al. **Lateral axonal modulation is required for stimulus-specific olfactory conditioning in Drosophila.** *Current Biology*, 2022, 32:4438–4450.e5. [DOI](https://doi.org/10.1016/j.cub.2022.09.007) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC9613607/)。KC 轴突侧向调制与 mAChR-B。
3. Manoim Wolkovitz JE, Tunc IA, et al. **A voltage-dependent switch underlies efficient yet specific learning and memory.** *Current Biology*, 2026, 36:954–967.e4. [DOI](https://doi.org/10.1016/j.cub.2026.01.014) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC12948350/)。电压依赖性受体状态与学习门控。
4. Amin H, et al. **Localized inhibition in the Drosophila mushroom body.** *eLife*, 2020, 9:e56954. [DOI](https://doi.org/10.7554/eLife.56954) · [全文及图片](https://pmc.ncbi.nlm.nih.gov/articles/PMC7541083/)。APL 的局部活动、反馈范围与连接结构。
5. Chen CC, et al. **Sleep facilitates pattern separation through SK channel-mediated sparse coding.** *Current Biology*, 2026, 36:1633–1643.e6. [DOI](https://doi.org/10.1016/j.cub.2026.02.028) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC13075853/)。睡眠、SK 通道、APL 反馈与模式分离。
6. Eichler K, et al. **The complete connectome of a learning and memory centre in an insect brain.** *Nature*, 2017, 548:175–182. [DOI](https://doi.org/10.1038/nature23455) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC5806122/)。幼虫 KC–KC 连接、APL 回路及其公开计算模型；发育阶段须与成蝇区分。
