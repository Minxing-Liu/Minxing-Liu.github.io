---
title: Kenyon Cell连接模式科研背景梳理
date: '2026-10-12'
updated: '2026-10-13'
permalink: notes/kenyon-cell-connectivity-background/
description: 从全局 APL 与局部轴突抑制出发，逐步加入树突兴奋、活动门控、分区反馈与连接可塑性，推导动力学、协方差和任务指标。
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

果蝇蘑菇体的 PN–KC 前馈连接决定感觉输入如何进入扩张层。局部 KC 连接和 APL 反馈进一步改变活动的空间分布、时间过程与学习更新。本文先梳理生理背景，再从全局 APL 与固定轴突抑制出发，逐步加入树突兴奋、活动门控、分区反馈和连接可塑性。每一步都给出方程变化及对应的分析指标。

模型中的低通滤波、受体门控和学习更新采用明确的现象学假设。它们用于建立可检验模型，参数与效应方向需要通过模拟及数据比较确定。

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

这里讨论的是 **KC 轴突之间的相互作用**：一个 KC 释放乙酰胆碱，作用于另一个 KC 轴突上的 mAChR-B 受体。该受体可以抑制接收端 KC 的钙和 cAMP 信号 [2]。

mAChR-B 的抑制作用随接收端 KC 的膜电位变化 [3]：

- **静息或弱活动时**：抑制作用较强，限制该 KC→MBON 突触的学习更新，减少错误关联。
- **活跃并去极化时**：抑制作用减弱，使该 KC 在气味与多巴胺信号配对时可以发生学习更新。

![KC–KC 轴突调制与 KC→MBON 学习更新的关系](/images/kc-kc-learning-gate.svg)

*机制示意，依据文献 [2,3] 绘制。ACh 为乙酰胆碱；MBON 为蘑菇体输出神经元。图中 KC A、KC B 用于区分发送者和接收者。*

两种连接承担不同作用：**KC–KC 连接调节接收端 KC；KC→MBON 突触强度的改变参与记忆形成。** 这里的“敏感性”指相关气味能够被学会，“特异性”指未配对的气味不会被错误关联。因此，模型除比较 KC 活动，还要比较 KC→MBON 权重变化和训练后的气味反应。

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

## 4. 统一记号与最小模型

设网络包含$M$ 个 PN、$N$ 个 KC，每个 KC 的 PN 入度为 $K$。输入为 $\mathbf x\in\mathbb R^M$，KC 发放率为 $\mathbf y\in\mathbb R^N$，PN–KC 矩阵为 $W\in\mathbb R^{N\times M}$。

统一约定 $R_{ij}$ 表示 **KC $j$ 向 KC $i$ 的作用**，即行是接收者、列是发送者。阈值记为 $\mathbf b$，避免与轴突抑制标记 $(b)$ 混淆。阈值线性函数取

$$
\phi(h)=\gamma[h]_+,\qquad [h]_+=\max(h,0),\qquad \gamma>0.
\tag{1}
$$

无递归作用时，$\mathbf y=\phi(W\mathbf x-\mathbf b)$。首先加入全局 APL 与固定轴突抑制

$$
\tau_K\dot{\mathbf y}
=-\mathbf y+\phi\!\left(W\mathbf x+R^{(1)}\mathbf y-\mathbf b\right),
\qquad
R^{(1)}=-g_A P-g_b B,
\qquad P=\frac{\mathbf1\mathbf1^\top}{N}.
\tag{2}
$$

$P$ 是全局平均反馈的秩一投影；$B\ge0$ 表示轴突邻近 KC 的有效连接强度，通常不含自连接；$g_A,g_b\ge0$。因此 $R^{(b)}=-g_bB$。这一步的变化是输入电流依赖网络自身活动，输出由一次前馈计算变为自洽固定点。

### 4.1 从连接组计数到有效权重

连接组提供拓扑和突触数，并不直接提供每条连接的受体类型或有效电流。一个可明确复现的转换为

$$
B_{ij}=\frac{n^{\mathrm{axon}}_{j\to i}
\,\mathbb I[n^{\mathrm{axon}}_{j\to i}\ge n_{\min}]
\,q_i^{B}}{Z_b},\qquad B_{ii}=0.
\tag{3}
$$

$q_i^B$ 表示接收 KC 的受体证据或假设权重。若同时限制两端细胞亚型，可另乘发送者掩膜；该限制不能等同于每个突触的受体身份已被直接测得。$Z_b$ 必须记录为固定归一化规则，不能在扫参时无说明地改变。

采用 $1/\sqrt{K_b}$ 的简化标度时，可取二值邻接 $B_{ij}=A^{(b)}_{ij}/\sqrt{K_b}$，其中 $K_b$ 是 KC–KC 轴突入度。它与 PN 入度 $K$ 不同。计数加权、二值加权、固定行和是不同模型选择，应分别报告。

## 5. 区分快速 APL 与慢速轴突抑制

式（2）只含 KC 时间常数。要区分快速全局反馈与慢速局部抑制，需要增加慢通道状态变量。

用 $\mathbf z_b$ 表示经慢速通道滤波后的 KC 活动；APL 先取快反馈极限：

$$
\begin{aligned}
\tau_K\dot{\mathbf y}
&=-\mathbf y+
\phi(W\mathbf x-g_A P\mathbf y-g_bB\mathbf z_b-\mathbf b),\\
\tau_b\dot{\mathbf z}_b&=-\mathbf z_b+\mathbf y.
\end{aligned}
\tag{4}
$$

扫参时可先取 $\tau_b\sim300\,\mathrm{ms}$ 作为慢通道示例，再根据响应时间过程拟合。在固定点，$\mathbf z_b^*=\mathbf y^*$，式（4）恢复式（2）。在瞬态中，输入起始时局部慢抑制尚未积累；后期才接近固定点。因而应同时比较起始响应、稳态响应和整段气味刺激中的判别表现。

设 $\Gamma=\operatorname{diag}\phi'(\mathbf h^*)$，其中 $\mathbf h^*$ 为阈值前电流。在不跨越阈值的工作点，线性化为

$$
\frac{d}{dt}
\begin{pmatrix}\delta\mathbf y\\\delta\mathbf z_b\end{pmatrix}
=\mathcal A_1
\begin{pmatrix}\delta\mathbf y\\\delta\mathbf z_b\end{pmatrix},
\quad
\mathcal A_1=
\begin{pmatrix}
(-I-g_A\Gamma P)/\tau_K&-g_b\Gamma B/\tau_K\\
I/\tau_b&-I/\tau_b
\end{pmatrix}.
\tag{5}
$$

局部线性稳定性要求 $\max\operatorname{Re}\lambda(\mathcal A_1)<0$。不能只检查静态逆矩阵是否存在。频率响应进一步为

$$
H_y(\omega)=
\left[(1+i\omega\tau_K)I+g_A\Gamma P
+\frac{g_b\Gamma B}{1+i\omega\tau_b}\right]^{-1}\Gamma W.
\tag{6}
$$

这清楚展示慢速抑制在高频刺激下减弱并产生相位延迟。核心模型的时间分析可直接由 $H_y(\omega)$ 与时域模拟比较，不必先引入脉冲模型。

## 6. 解析对象：固定点、协方差与维度

### 6.1 有效输入映射的适用范围

有效映射 $(I-R)^{-1}W$ 只在线性工作区间适用。阈值函数与矩阵逆不能普遍交换。

固定活跃集合为 $\mathcal S$，其余 KC 的发放率为零，则

$$
\mathbf y_{\mathcal S}^*
=\gamma(I-\gamma R_{\mathcal S\mathcal S})^{-1}
(W_{\mathcal S}\mathbf x-\mathbf b_{\mathcal S}).
\tag{7}
$$

该解还必须满足活跃 KC 的阈值前电流为正、其余 KC 的电流非正。输入改变活跃集合后，需要重新求解，不能继续使用同一个全局线性映射。

对固定工作点的小扰动，令 $\delta\mathbf y=\Gamma\delta\mathbf h$，有

$$
\delta\mathbf h=W\delta\mathbf x+R\Gamma\delta\mathbf h,
\qquad
H_h=(I-R\Gamma)^{-1}W,
\qquad H_y=\Gamma H_h.
\tag{8}
$$

所以局部输入电流和输出协方差分别为

$$
C^h=H_h\Sigma_xH_h^\top,
\qquad C^y=H_y\Sigma_xH_y^\top.
\tag{9}
$$

这里 $\Sigma_x$ 是所分析输入扰动的协方差。若使用跨气味的大幅变化，必须检查活跃集合是否频繁改变。下面的高斯电流近似使用 $\Gamma\approx\gamma I$，其适用范围需要与数值模型比较。

### 6.2 APL 的秩一部分与局部抑制一起处理

在标量增益近似下，设 $\mathbf u=\mathbf1/\sqrt N$，$L=I+\gamma g_bB$。核心模型的电流响应矩阵为

$$
G_1=(I+\gamma g_bB+\gamma g_A\mathbf u\mathbf u^\top)^{-1}
=L^{-1}
-\frac{\gamma g_A L^{-1}\mathbf u\mathbf u^\top L^{-1}}
{1+\gamma g_A\mathbf u^\top L^{-1}\mathbf u}.
\tag{10}
$$

这是同时保留 $B$ 的 Sherman–Morrison 处理，要求 $L$ 可逆且分母非零。仅有 APL 时，$G_1=I-\gamma g_A P/(1+\gamma g_A)$，均匀方向被压低，正交方向保持不变。

当 $B$ 不是均匀行列和矩阵时，APL 与残余子空间不再严格解耦。用式（14）检验均匀与残余通道的分离程度，不能预先假定两者独立。

### 6.3 从高斯电流代理到二值参与率

二值维度可先用“线性高斯电流＋阈值”代理计算。它与式（4）的阈值线性发放率模型不同，也不自动等于非线性递归二值模型。

计算 $C^h=G_1W\Sigma_xW^\top G_1^\top$，令

$$
q_{ij}=\frac{C^h_{ij}}{\sqrt{C^h_{ii}C^h_{jj}}},\quad
t_f=\Phi^{-1}(1-f),\quad
F_f(q)=\frac{\Pr(Z_1>t_f,Z_2>t_f;q)-f^2}{f(1-f)}.
\tag{11}
$$

$0<f<1$，$Z_1,Z_2$ 是相关系数为 $q$ 的标准高斯变量，各通道方差非零。按每通道方差标准化并使用相同编码水平 $f$ 后，二值参与率为

$$
D_{\mathrm{bin}}
=\frac{N^2}{N+\sum_{i\ne j}F_f(q_{ij})^2}.
\tag{12}
$$

直接数值模型则用真实输出 $\mathbf y$ 或真实二值活动计算

$$
D(C)=\frac{(\operatorname{tr}C)^2}{\operatorname{tr}(C^2)}.
\tag{13}
$$

首先比较有限矩阵代理、阈值线性模型和递归二值模型的 $D(K,g_A,g_b)$，标出近似误差、稳定边界与编码水平。不能把代理式的精确数值计算称为对整个非线性网络的精确理论。

### 6.4 通道分解与最优入度

设 $Q=I-P$。对输出协方差，记录均匀方向功率、残余功率与两者耦合：

$$
S_{\parallel}=\mathbf u^\top C\mathbf u,
\quad S_{\perp}=\operatorname{tr}(QCQ),
\quad S_{\mathrm{mix}}=\|PCQ\|_F.
\tag{14}
$$

对不同机制分别消融并比较这三个量及协方差谱。$S_{\mathrm{mix}}$ 不小时，应放弃严格均匀／残余独立近似。

固定 $g_A,g_b$、归一化和编码条件后，定义

$$
K_D^*(g_A,g_b)=\arg\max_K D(K,g_A,g_b).
\tag{15}
$$

通过扫参测量加入 mAChR-B 后 $K_D^*$ 的移动方向与幅度。所有元素非正的 $R^{(b)}$ 也可能放大某些差异模态，因而不自动保证白化、维度提高或 $K_D^*$ 上移。$K\approx6$ 是特定 LK17 参数下的参照值，不是所有输入统计和预算下的固定常数。

## 7. 扩展一：树突兴奋与输入空间结构

### 7.1 新增连接及其动力学

加入 $R^{(a)}=g_aE\ge0$，连接限定在萼部空间、细胞亚型与谱系相关的支持上。参数 $\rho_a$ 控制连接密度，$g_a$ 控制单连接强度；密度与强度必须分开。

为快速树突通道加入 $\mathbf z_a$：

$$
\begin{aligned}
\tau_K\dot{\mathbf y}
&=-\mathbf y+\phi(W\mathbf x+g_aE\mathbf z_a
-g_bB\mathbf z_b-g_AP\mathbf y-\mathbf b),\\
\tau_a\dot{\mathbf z}_a&=-\mathbf z_a+\mathbf y,\\
\tau_b\dot{\mathbf z}_b&=-\mathbf z_b+\mathbf y.
\end{aligned}
\tag{16}
$$

可用 $\tau_a\sim5\,\mathrm{ms}$ 作为快速通道的起始尺度，并进行敏感性分析。时间常数与传导延迟不同；显式延迟需要另写 $\mathbf y(t-d_a)$。

固定点上的变化是 $R^{(1)}\to R^{(1)}+g_aE$。小扰动时

$$
G=G_1+\gamma g_aG_1EG_1+O(g_a^2),
\qquad
\delta C^h=\gamma g_a
\left(G_1EC_1^h+C_1^hE^\top G_1^\top\right)+O(g_a^2).
\tag{17}
$$

式（17）固定标量增益及阈值代理；实际网络的活跃集合变化需另计。兴奋对不同协方差方向的增益取决于 $E$ 与输入协方差的对齐，不能仅凭连接为正判断维度变化。

### 7.2 比较输入空间结构

将 PN–KC 输入分为三组：M0 全局随机、M1 空间约束随机、M2 实测连接。保持可比较的 PN 入度、输入统计、权重归一化和资源条件，分别计算

$$
\Delta D_a^{(m)}=D(W^{(m)},R^{(1)}+g_aE)-D(W^{(m)},R^{(1)}),
\quad m\in\{0,1,2\}.
\tag{18}
$$

同时计算任务判别变化 $\Delta\epsilon_a^{(m)}$ 和信噪比。维度降低也可能伴随任务信号增强，二者不能互相替代。

树突连接的效应取决于输入空间结构。分别测量三组的 $\Delta D_a^{(m)}$ 与任务误差，不预设维度变化的符号。

## 8. 扩展二：接收者状态门控与学习特异性

### 8.1 下标与门控位置

mAChR-B 位于接收端。按 $R_{ij}$ 表示 $j\to i$ 的约定，门控应依赖接收者 $i$ 的状态，并作用在矩阵的行上。

用接收者膜电位代理 $v_i$ 控制受体状态 $s_i$，取

$$
\tau_s\dot s_i=-s_i+s_\infty(v_i),
\qquad
s_\infty(v)=\frac{1}{1+\exp[(v-v_{1/2})/\Delta v]},
\quad \Delta v>0.
\tag{19}
$$

阈下时 $s_i$ 大，去极化时 $s_i$ 小。$s_i$ 高表示受体抑制作用强；它不是“学习许可大”。发放率 $y_i$ 在阈下恒为零，无法分辨不同阈下电位，因此优先用电位变量。若用 $v_i=v_0+c_y y_i$，应注明是简化代理，不能直接解释为真实膜电位。

定义 $S=\operatorname{diag}(s_i)$，将式（16）的轴突项改为

$$
-g_bB\mathbf z_b\quad\longrightarrow\quad-g_bSB\mathbf z_b,
\qquad R^{(b)}_{ij}(v_i)=-g_bs_i(v_i)B_{ij}.
\tag{20}
$$

式（20）保留连接支持 $B$，只改变接收端增益。

若以 $s_i=s_\infty(v_0+c_y y_i)$ 作瞬时代理，慢通道固定点处的递归电流导数为

$$
J_{b,\mathrm{eff}}
=-g_b\left[SB+\operatorname{diag}
\left(c_y s_\infty'(v_i)(B\mathbf y)_i\right)\right].
\tag{21}
$$

第二项来自受体状态随接收者活动变化；它不能在求稳定性或响应时省略。若保留式（19）的 $\tau_s$，则 $s_i$ 是独立状态，需分析包含 $\mathbf y,\mathbf z_b,\mathbf s$ 的完整 Jacobian。

### 8.2 神经响应与 KC→MBON 可塑性分开实现

响应门控与学习门控是两条作用路径。改变 $R^{(b)}$ 只影响神经活动，KC→MBON 的 LTD 还需要独立学习方程。

令局部胆碱能驱动为 $\ell_i=(B\mathbf z_b)_i$。一个有界的学习许可与资格迹实现为

$$
p_i=1-\frac{s_i\ell_i}{\kappa+\ell_i},\quad \kappa>0,
\qquad
\tau_e\dot e_i=-e_i+\psi(y_i),
\qquad
\dot w_i=-\eta\,d(t)e_i p_i.
\tag{22}
$$

$d(t)\ge0$ 表示诱导 LTD 的训练信号，$w_i$ 为 KC→MBON 权重，权重需限制在给定范围。$\psi(y_i)$ 及资格迹需根据任务设定。若本来就设 $e_i=0$ 于所有非活跃 KC，则“LTD 仅作用于活跃细胞”已由资格迹保证，不能再把该结果归因于开关。应测试弱活动、残余资格迹或相近气味所产生的非目标更新。

式（19）和式（22）采用现象学门控。分别消融响应门控与可塑性门控，测量各自对活动和权重更新的贡献。

### 8.3 对应指标

在群体稀疏度匹配条件下，比较固定 $s$、活动开关、去除 $B$ 三组。记录相似气味测试误差、CS+ 检出率和相近 CS− 假阳性率，并记录 LTD 泄漏：

$$
L_{\mathrm{off}}
=\frac{\sum_{i\notin\mathcal S_{\mathrm{CS+}}}|\Delta w_i|}
{\sum_i|\Delta w_i|},
\quad \sum_i|\Delta w_i|>0.
\tag{23}
$$

目标是提高学习特异性，并保持所需敏感性；不能只报告 $D$ 增大。

## 9. 扩展三：分区 APL 与状态调制

### 9.1 从一个平均通道到多个局部通道

用局部平均算子构建低秩反馈。区室平均是秩一算子，保留区室内所有坐标的对角掩膜则通常是高秩。对互不重叠的理想 KC 分组，定义

$$
\mathbf u_c=\frac{\mathbf1_{\mathcal C_c}}{\sqrt{n_c}},
\quad P_c=\mathbf u_c\mathbf u_c^\top,
\quad R^{(\mathrm{APL})}=-\sum_c\alpha_cP_c
=-U A U^\top,
\quad A=\operatorname{diag}(\alpha_c).
\tag{24}
$$

实际萼部、垂直叶和水平叶是解剖区室，同一个 KC 可参与多个区室，不能直接当成互斥 KC 分组。更合适的低秩表示是 $R^{(\mathrm{APL})}=-UA V$，其中 $V$ 汇集 KC 到各 APL 区室的活动，$U$ 将区室输出反馈到 KC；$\operatorname{rank}(UAV)\le C$。细胞级低秩模型仍可能不足以描述同一 KC 内不同部位的电位，必要时再引入多区室 KC。

以 $\mathbf a$ 表示 APL 快活动，$\alpha_c$ 表示慢增益：

$$
\begin{aligned}
\tau_K\dot{\mathbf y}&=-\mathbf y+
\phi(W\mathbf x+g_aE\mathbf z_a-g_bSB\mathbf z_b-UA\mathbf a-\mathbf b),\\
T_A\dot{\mathbf a}&=-\mathbf a+V\mathbf y.
\end{aligned}
\tag{25}
$$

$T_A$ 是正时间常数对角矩阵。在快速 APL 极限 $\mathbf a=V\mathbf y$，恢复上述低秩反馈。有限区室间传播可加入明确的耦合项，并据局部刺激数据拟合；三个标量增益本身不能拟合连续空间的衰减长度。

对冻结的 $S,A$，令 $L=I-\gamma g_aE+\gamma g_bSB$，低秩逆矩阵可写为

$$
G=L^{-1}-\gamma L^{-1}UA
\left(I_C+\gamma V L^{-1}UA\right)^{-1}VL^{-1}.
\tag{26}
$$

这是 Woodbury 形式，要求相关矩阵可逆。它展示分区 APL 如何与树突及轴突连接相互作用，而不是先分别算完再把维度相加。

### 9.2 SK 状态调制与训练调制

将 SK-AHP 对 APL 输出的影响表示为增益变化，可采用以下代理

$$
\alpha_c(t)=\bar\alpha_c\,q_c(t)\,\zeta_c(t),
\qquad q_c(t)=\frac{1}{1+\beta_c H_c(t)},
\quad H_c\ge0,\ \beta_c>0.
\tag{27}
$$

$H_c$ 是 AHP 强度代理，$\zeta_c$ 是训练造成的有效反馈变化。该代理保证 AHP 增强时增益下降，但不复现钙依赖钾通道的完整生物物理过程。

为了把训练去抑制与慢恢复区分，一种现象学更新是

$$
\dot\zeta_c=-\eta_A d_c(t)e_c(t)\zeta_c
+\frac{\zeta_{c,0}-\zeta_c}{\tau_{\mathrm{rec}}},
\qquad 0\le\zeta_c\le\zeta_{\max}.
\tag{28}
$$

式（28）把多巴胺调制折算为有效 APL 增益变化 [7]，属于实现假设，不代表 APL→KC 突触已被证明遵循该更新。增益变化幅度需要由响应数据拟合。

对应比较包括局部刺激的反馈范围、SK 状态变化前后的稀疏度与相似气味误差、反转学习后的 CS+ 活动集合及读出权重变化。保持固定参数时观察整体状态表型，再用稀疏度匹配对照分离整体增益与空间结构的作用。

## 10. 连接组合的非可加性

冻结工作点增益，令 $R=R_1+\delta R_a+\delta R_b$。响应矩阵展开为

$$
G=G_1+\gamma G_1\delta R G_1
+\gamma^2G_1\delta R G_1\delta R G_1+\cdots.
\tag{29}
$$

两种连接在二阶响应中产生

$$
\delta G_{ab}=\gamma^2\left(
G_1\delta R_aG_1\delta R_bG_1
+G_1\delta R_bG_1\delta R_aG_1\right).
\tag{30}
$$

矩阵一般不对易，因此两项都要保留。协方差还包含一阶响应乘积，维度又是协方差的非线性函数。固定活跃集合时，这些都可求导；活跃集合改变时，应与直接数值差分对照。

对任意指标 $T$，定义可直接计算的联合交互量

$$
\mathcal I_{ab}^{T}=T_{ab}-T_a-T_b+T_0.
\tag{31}
$$

以 $T=D$、误差、假阳性率分别计算。式（31）是在指定基线和对照协议下的交互，若各组重新调阈值，需注明它同时包含校准影响。交互量的符号由分析与模拟确定。

## 11. 连接可塑性与最优工作点的移动

### 11.1 轴突抑制的学习

采用局部反 Hebbian 更新，推动共同波动较强的 KC 之间形成更强抑制 [8,9]。令 $B$ 的可塑权重为 $Q\ge0$，固定支持 $A^{(b)}$。一种针对中心化协方差的实现为

$$
\tau_\mu\dot\mu_i=-\mu_i+y_i,
\qquad
\dot Q_{ij}=\eta_b A^{(b)}_{ij}
\left[(y_i-\mu_i)(y_j-\mu_j)-c_{ij}^{\mathrm{tar}}-\lambda_b Q_{ij}\right],
\quad i\ne j,
\tag{32}
$$

并将权重投影到 $[0,Q_{\max}]$。$R^{(b)}=-g_bQ$，正共同波动使 $Q$ 增强，即使递归权重更负；符号写反会使学习方向颠倒。原始活动乘积与中心化协方差对应不同目标，不能混用。

式（32）是一个局部受约束更新，不等同于完整的 Földiák 或 Pehlevan–Chklovskii 优化算法，也不能保证任意稀疏、带受体门控的网络严格白化。用残余协方差谱和去相关误差测量白化程度。

### 11.2 快慢时间尺度与最优点

学习速度应明显慢于式（4）、式（16）、式（25）的神经动力学。在每个训练检查点冻结 $Q,\alpha_c$，测量稳定状态，再计算目标。

$$
K_D^*(t)=\arg\max_K D(K;Q(t),\boldsymbol\alpha(t)),
\qquad
K_{\epsilon}^*(t)=\arg\min_K\epsilon_{\mathrm{test}}(K;Q(t),\boldsymbol\alpha(t)).
\tag{33}
$$

$K^*(t)$ 的变化首先表示不同网络配置的最优值移动，不能当成单个网络的 PN–KC 连线自动重接。若要让 $K$ 本身学习，必须另设结构可塑性规则。

联合参数 $\boldsymbol\vartheta=(K,g_A,g_b,\rho_a,\alpha_c)$ 的最优点需限定任务、稳定域、编码条件和资源预算。分别定义维度、误差与容量的目标，构建相图，而不合并为一个未经定义的“最佳网络”。

## 12. 指标与验证流程

### 12.1 表征与任务指标

| 指标 | 定义或估计 | 对应作用 |
|---|---|---|
| 稳定性与时间 | 完整 Jacobian 的最大特征值实部；响应峰值、衰减时间 | 排除发散或未达到稳态的配置，区分快慢机制 |
| 稀疏度 | 二值输出 $f=N^{-1}\sum_i m_i$；发放率输出用预先规定的活动判据 | 区分全局增益变化与任务特异性变化 |
| 维度与谱 | 式（12）或式（13）；式（14）；特征值分布 | 检验有限矩阵理论及均匀／残余近似 |
| 白化偏离 | 对残余子空间的归一化协方差比较平坦谱与非对角相关 | 检验去相关预测；保留有效信号方向的任务对照 |
| 判别与敏感性 | 独立测试集错误率、CS+ 检出率、CS− 假阳性率 | 开关的刺激特异性目标 |
| 学习特异性 | 式（23）、训练后各 KC 权重变化 | 检验非目标 LTD 与可塑性门控 |
| 泛化 | 沿预定义气味插值路径测量读出响应曲线或判定半径 | 区分保留同类泛化与排除相近不同类 |
| 容量 | 满足预设测试误差标准的最大训练模式数，或明确定义的线性可分容量 | 比较不同任务负载；不以维度替代容量 |
| 连接最优点 | 式（15）、式（33），附固定条件及预算 | 检验学习是否改变最优采样密度 |

对相似气味，令训练后固定读出 $o=\mathbf w^\top\mathbf y+b_o$，可辅助计算

$$
d'^2=\frac{[\mathbf w^\top(\boldsymbol\mu_+-\boldsymbol\mu_-)]^2}
{\tfrac12\mathbf w^\top(C_++C_-)\mathbf w}.
\tag{34}
$$

$C_\pm$ 是对应气味的试次内噪声协方差，不能用跨气味表征协方差替代。读出必须在训练集拟合并固定，在独立噪声试次上测量。误差改善不能仅从 $D$ 增大推断。

### 12.2 从核心模型开始的具体顺序

1. **建立核心模型。** 实现式（4），保存网络矩阵、随机种子、归一化、阈值校准与输入统计。比较无反馈、APL、轴突抑制及二者组合；同时报告固定阈值和稀疏度匹配对照。
2. **核验有限矩阵理论。** 比较式（9）–（13）与神经动力学模拟。扫描 $K,g_A,g_b$，记录稳定性和近似误差。首先使用实际抽样矩阵，不预先依赖自由概率或单一平均场公式。
3. **检查通道分解。** 用式（14）与协方差谱确认均匀／残余近似的适用范围；若耦合显著，升级到低秩分区反馈。
4. **逐个加入扩展。** 树突兴奋比较 M0/M1/M2；开关分别测试响应门控与学习门控；APL 分区分别测试空间结构、SK 状态与训练去抑制。
5. **计算交互。** 采用两因素消融和式（31），先固定校准条件，再增加稀疏度匹配对照。报告效应量、网络抽样不确定性及任务表现。
6. **加入慢学习。** 实现式（28）、式（32），冻结检查点，测量式（33）。扫描 $K$ 时，应对每个 $K$ 采用相同训练协议重新学习，或明确说明冻结了哪些权重。
7. **连接组与生理检验。** 替换为实际矩阵，并分别检查连接支持、受体推断和参数尺度。以稀疏比例、局部反馈衰减与成像响应作为外部校准目标。
8. **针对性脉冲验证。** 只对慢轴突门控及相似气味任务进行验证。发放率替换为脉冲列时，必须加入归一化突触滤波、处理单位和噪声，并重新校准；不能直接把 Dirac 脉冲列代入发放率方程后宣称参数完全不变。

## 参考文献

以下论文分别支持前馈扩张、轴突局部调制、APL 空间作用和状态依赖性等背景论述。

1. Litwin-Kumar A, et al. **Optimal Degrees of Synaptic Connectivity.** *Neuron*, 2017, 93:1153–1164.e7. [DOI](https://doi.org/10.1016/j.neuron.2017.01.030)。前馈扩张、资源约束与最优连接数。
2. Manoim JE, et al. **Lateral axonal modulation is required for stimulus-specific olfactory conditioning in Drosophila.** *Current Biology*, 2022, 32:4438–4450.e5. [DOI](https://doi.org/10.1016/j.cub.2022.09.007) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC9613607/)。KC 轴突侧向调制与 mAChR-B。
3. Manoim Wolkovitz JE, Tunc IA, et al. **A voltage-dependent switch underlies efficient yet specific learning and memory.** *Current Biology*, 2026, 36:954–967.e4. [DOI](https://doi.org/10.1016/j.cub.2026.01.014) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC12948350/)。电压依赖性受体状态与学习门控。
4. Amin H, et al. **Localized inhibition in the Drosophila mushroom body.** *eLife*, 2020, 9:e56954. [DOI](https://doi.org/10.7554/eLife.56954) · [全文及图片](https://pmc.ncbi.nlm.nih.gov/articles/PMC7541083/)。APL 的局部活动、反馈范围与连接结构。
5. Chen CC, et al. **Sleep facilitates pattern separation through SK channel-mediated sparse coding.** *Current Biology*, 2026, 36:1633–1643.e6. [DOI](https://doi.org/10.1016/j.cub.2026.02.028) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC13075853/)。睡眠、SK 通道、APL 反馈与模式分离。
6. Eichler K, et al. **The complete connectome of a learning and memory centre in an insect brain.** *Nature*, 2017, 548:175–182. [DOI](https://doi.org/10.1038/nature23455) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC5806122/)。幼虫 KC–KC 连接、APL 回路及其公开计算模型；发育阶段须与成蝇区分。

7. Zhou M, et al. **Suppression of GABAergic neurons through D2-like receptor secures efficient conditioning in Drosophila aversive olfactory learning.** *PNAS*, 2019, 116:5118–5125. [DOI](https://doi.org/10.1073/pnas.1812342116)。多巴胺对 APL 的调制。
8. Földiák P. **Forming sparse representations by local anti-Hebbian learning.** *Biological Cybernetics*, 1990, 64:165–170. [DOI](https://doi.org/10.1007/BF02331346)。局部反 Hebbian 学习。
9. Pehlevan C, Chklovskii DB. **A normative theory of adaptive dimensionality reduction in neural networks.** *NeurIPS*, 2015. [论文](https://papers.neurips.cc/paper_files/paper/2015/hash/861dc9bd7f4e7dd3cccd534d0ae2a2e9-Abstract.html)。自适应降维与竞争学习框架。
