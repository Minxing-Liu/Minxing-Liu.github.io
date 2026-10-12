---
title: Kenyon Cell连接模式科研背景梳理
date: '2026-10-12'
updated: '2026-10-12'
permalink: notes/kenyon-cell-connectivity-background/
description: 依据公开论文梳理 Kenyon 细胞的前馈输入、轴突局部调制与 APL 反馈，以及它们对稀疏编码和联想学习的作用。
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

## 4. 理解表征与学习的常用指标

| 指标 | 具体含义 | 比较时需要控制的条件 |
|---|---|---|
| 活动比例 $f$ | 一次刺激中被激活的 KC 比例及其分布 | 明确固定 $f$，还是允许它随反馈改变 |
| 表征协方差与维度 $D$ | 活动是否集中于少数共同变化方向 | 使用同一刺激分布和同一种活动变量 |
| 表征重叠与试次噪声 | 相似气味是否更可分，同一气味是否更稳定 | 分开估计气味间变化与重复试次变化 |
| 学习效率与特异性 | 有效信号的漏报、无关信号的误报 | 固定训练次数、奖励规则和读出方法 |
| 分类性能与记忆负载 | 读出信噪比、测试误差及随记忆数量的变化 | 固定训练集规模与测试条件 |
| 最优连接数 $K^\star$ | 指定目标函数下最合适的输入连接数 | 明确 KC 数量、突触预算和任务统计 |

参与率维度定义为

$$
D=\frac{(\operatorname{tr}C)^2}{\operatorname{tr}(C^2)},
\qquad C=\operatorname{Cov}(\mathbf y).
$$

这里的 $C$ 是实际被评价的 KC 输出协方差。电流、放电率、二值活动和钙信号不应混用。较大的 $D$ 表示方差分布在更多方向，但不保证这些方向都携带任务所需的信号。局部兴奋即使降低 $D$，也可能增强某个任务方向；反之，维度增加也可能伴随噪声增加。

## 参考文献

以下论文分别支持前馈扩张、轴突局部调制、APL 空间作用和状态依赖性等背景论述。

1. Litwin-Kumar A, et al. **Optimal Degrees of Synaptic Connectivity.** *Neuron*, 2017, 93:1153–1164.e7. [DOI](https://doi.org/10.1016/j.neuron.2017.01.030)。前馈扩张、资源约束与最优连接数。
2. Manoim JE, et al. **Lateral axonal modulation is required for stimulus-specific olfactory conditioning in Drosophila.** *Current Biology*, 2022, 32:4438–4450.e5. [DOI](https://doi.org/10.1016/j.cub.2022.09.007) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC9613607/)。KC 轴突侧向调制与 mAChR-B。
3. Manoim Wolkovitz JE, Tunc IA, et al. **A voltage-dependent switch underlies efficient yet specific learning and memory.** *Current Biology*, 2026, 36:954–967.e4. [DOI](https://doi.org/10.1016/j.cub.2026.01.014) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC12948350/)。电压依赖性受体状态与学习门控。
4. Amin H, et al. **Localized inhibition in the Drosophila mushroom body.** *eLife*, 2020, 9:e56954. [DOI](https://doi.org/10.7554/eLife.56954) · [全文及图片](https://pmc.ncbi.nlm.nih.gov/articles/PMC7541083/)。APL 的局部活动、反馈范围与连接结构。
5. Chen CC, et al. **Sleep facilitates pattern separation through SK channel-mediated sparse coding.** *Current Biology*, 2026, 36:1633–1643.e6. [DOI](https://doi.org/10.1016/j.cub.2026.02.028) · [全文](https://pmc.ncbi.nlm.nih.gov/articles/PMC13075853/)。睡眠、SK 通道、APL 反馈与模式分离。
