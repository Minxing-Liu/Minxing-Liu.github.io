---
title: 自适应预处理网络复习笔记：去相关效果与机制
date: 2026-06-10
comments: false
sitemap: false
---

<meta name="robots" content="noindex,nofollow,noarchive">

# 自适应预处理网络复习笔记：去相关效果与机制

## 0. 先给自己一个总图

你论文里说的“自适应预处理网络”，对应的是 Chapochnikov, Pehlevan, Chklovskii 2023 中的 ORN-LN adaptive circuit。它的理论来源是 Pehlevan, Sengupta, Chklovskii 2018 的 similarity matching 框架。

一句话理解：

> 这个网络不是手动对 ORN 响应做 PCA whitening，而是用一个可以由局部神经元和突触实现的 ORN-LN 回路，自动学习输入中的主导相关结构，并通过 inhibitory feedback 抑制这些冗余方向，从而实现部分去相关、部分谱均衡和表示效率提升。

可以画成：

```text
odor stimulus
    ↓
ORN soma activity x
    ↓
ORN axon output y  ← inhibitory feedback from LN
    ↕
LN activity z
    ↓
learned W, M
```

其中：

- `x`：ORN soma 原始输入活动。
- `y`：ORN axon / 预处理后的输出活动。
- `z`：LN / lateral feature activity。
- `W`：ORN-LN 或 y-z 之间学到的相关结构。
- `M`：LN-LN 内部相关 / 抑制结构。

---

## 1. 这个网络到底在优化什么

Similarity matching 的核心目标是：输出表示应该保留输入样本之间的相似关系。

如果：

```text
X = [x(1), x(2), ..., x(T)]
Y = [y(1), y(2), ..., y(T)]
```

那么：

```text
X.T X = 输入样本之间的相似性
Y.T Y = 输出样本之间的相似性
```

最直观的目标是：

```text
让 Y.T Y 接近 X.T X
```

也就是：

```text
输入中相似的气味，输出中仍相似
输入中不同的气味，输出中仍不同
```

这个目标听起来像只是“保持几何关系”，但关键在于：当加入神经网络结构、辅助变量、非负性或维度限制后，它会导出具有 Hebbian / anti-Hebbian 局部学习规则的网络。

Pehlevan 2018 的重点是解释：

> 为什么一个全局的 similarity matching objective，最后可以变成每个突触只依赖局部 pre/post 活动的学习规则。

这对你的论文很重要，因为你可以说：

> 我的自适应预处理网络不是任意设计的黑箱变换，而是有 normative objective 支撑的生物可实现回路。

---

## 2. LC 和 NNC 是什么

Chapochnikov 2023 里主要有两类模型：

### 2.1 LC: Linear Circuit

LC 指 linear circuit。它的活动变量 `y` 和 `z` 没有非负性约束。

典型连续时间动力学：

<div class="equation-block">
  <div><span class="eq-left">dy/dτ</span><span class="eq-op">=</span><span>-y - γ²Wz + x</span></div>
  <div><span class="eq-left">dz/dτ</span><span class="eq-op">=</span><span>-Mz + (ρ² / γ²)Wᵀy</span></div>
</div>

直觉：

- `x` 驱动 ORN axon output `y`。
- LN activity `z` 被 `W.T y` 驱动。
- `W z` 反馈抑制 `y`。
- `M z` 表示 LN-LN 之间的竞争或抑制。

为什么叫 linear？

因为在给定 `W` 和 `M` 时，活动动力学对 `y`、`z` 是线性的。稳态解可以被解析研究，因此能看清楚它对输入谱做了什么。

### 2.2 NNC: Nonnegative Circuit

NNC 指 nonnegative circuit。它加入：

```text
y >= 0
z >= 0
```

离散动力学类似：

<div class="equation-block">
  <div><span class="eq-left">y(τ + 1)</span><span class="eq-op">=</span><span>[y(τ) + η(-y - Wz + x)]₊</span></div>
  <div><span class="eq-left">z(τ + 1)</span><span class="eq-op">=</span><span>[z(τ) + η(-Mz + ρ²Wᵀy)]₊</span></div>
</div>

其中：

```text
[a]_+ = max(0, a)
```

为什么重要？

神经活动通常不能任意正负变化，NNC 更接近真实神经元活动。论文中 NNC 对 connectome 中 ORN-LN 权重的预测更有生物意义。

---

## 3. 去相关效果从哪里来

这里最容易误解。一个常见但不准确的说法是：

> `z` 学到前 `K` 个 PCA 特征，然后 `y` 等于 `x` 减去这 `K` 个方向。

这个说法有一点直觉是对的：`z` 确实会主要响应输入中反复出现、方差大、相关性强的结构；`Wz` 也确实会反馈影响 `y`。但严格来说，它不是简单的 PCA 投影删除。更准确地说：

> LC / NNC 学到一个最多 `K` 维的辅助表示 `z`，这个辅助表示和 ORN 输出 `y` 共同满足 similarity matching 推导出的 saddle-point / circuit dynamics。网络对输入谱做的是方向依赖的连续压缩，而不是把前 `K` 个方向完全减掉。

设输入 covariance 为：

```text
C_x = E[x x.T]
```

如果输入中有很强的主方向：

```text
C_x = U diag(lambda_1, lambda_2, ..., lambda_N) U.T
lambda_1 >> lambda_2 >> ...
```

说明 ORN 表示里有少数方向占据大部分方差。这些方向可能对应：

- 总浓度轴。
- 相似分子族共同激活。
- 多个 ORN 的共享响应模式。
- dominant molecular block。

### 3.1 直觉层面：为什么强相关方向会被压缩

LN 的作用不是“复制 PCA component”，而是形成一组可以解释 ORN 输出中共享结构的辅助变量。

机制可以这样理解：

```text
强相关方向反复出现
    ↓
这些方向更容易驱动 LN activity z
    ↓
W 学到 y 和 z 之间稳定的相关关系
    ↓
当类似结构再次出现时，Wz 通过反馈项改变 y 的稳态
    ↓
高方差 / 高相关方向被压缩
    ↓
输出更去相关、更谱均衡
```

注意这里说的是“压缩”，不是“删除”。如果把某个强方向完全删掉，样本之间的相似性结构会被严重破坏；similarity matching 不允许网络随便丢掉输入几何。网络做的是在“保留样本关系”和“降低冗余”之间折中。

### 3.2 LC 的线性去相关：谱压缩而不是投影相减

LC 最适合用来理解原理，因为它没有非负约束，稳态解可以解析研究。

在一个已经学到稳定权重的 LC 中，给定输入 `x`，`y` 和 `z` 会达到稳态。把第一条方程写成稳态形式：

<div class="equation-block">
  <div><span class="eq-left">0</span><span class="eq-op">=</span><span>-y - γ²Wz + x</span></div>
  <div><span class="eq-left">y</span><span class="eq-op">=</span><span>x - γ²Wz</span></div>
</div>

这看起来像“从 `x` 中减去 `Wz`”，但关键是 `z` 不是预先固定的 PCA 坐标，而是同时由第二条稳态方程决定：

<div class="equation-block">
  <div><span class="eq-left">Mz</span><span class="eq-op">=</span><span>(ρ² / γ²)Wᵀy</span></div>
</div>

所以 `y` 和 `z` 是互相耦合求出来的。`z` 依赖 `y`，`y` 又被 `z` 反馈改变。它不是先算出 `z = PCA(x)`，再做 `y = x - projection`。

从谱的角度看，LC 的作用更像：

```text
输入方向 i 的强度 s_i
    ↓
经过一个由 rho、K、输入统计决定的 shrinkage function
    ↓
输出方向 i 的强度 y_i
```

高强度方向被压得更多，弱方向被压得较少。因此 covariance spectrum 会变平：

```text
大的 eigenvalue 下降较多
小的 eigenvalue 相对保留
effective dimension 上升
off-diagonal correlation 下降
```

这就是 LC 的去相关原理。

### 3.3 `K` 到底是什么意思

`K` 是 LN 数量，也就是 `z` 的维度。它限制了网络可以使用多少个辅助变量来解释和压缩共享结构。

更准确地说：

```text
K 不是“前 K 个 PCA 方向”的硬编码数量
K 是网络可学习的辅助子空间维度上限
```

当输入谱很陡时，最容易被学到的通常确实是高方差、高相关、反复出现的方向，所以它看起来像在处理前几个 principal directions。但这只是结果上的相似，不是算法上显式 PCA。

因此应该避免写成下面这种硬投影解释：

<div class="equation-block">
  <div><span class="eq-left">z</span><span class="eq-op">≠</span><span>前 K 个 PCA 特征</span></div>
  <div><span class="eq-left">y</span><span class="eq-op">≠</span><span>x 减去前 K 个 PCA 特征</span></div>
</div>

更稳妥的写法是：

> `z` spans a learned K-dimensional auxiliary subspace that captures dominant shared structure in the activity.
>
> `y` is the circuit output after direction-dependent feedback shrinkage, not after hard removal of those directions.

中文：

> `z` 张成的是一个由数据统计和电路约束共同学习出的 `K` 维辅助子空间，它倾向于捕捉 ORN 活动中的主导共享结构；`y` 则是在反馈耦合下得到的压缩后输出，而不是简单删除这些方向后的残差。

### 3.4 NNC 的去相关：带非负约束的特征提取和软聚类

NNC 加入非负性：

```text
y >= 0
z >= 0
```

这会改变解释。

LC 中的 `z` 可以正负变化，因此更像线性子空间变量。NNC 中的 `z` 只能非负，所以它更像：

- 某类 odor feature 的激活强度；
- ORN activity pattern 的 soft cluster membership；
- 若干 LN type 对不同输入模式的非负响应。

因此 NNC 的去相关不是“线性投影到 PCA 子空间再减掉”，而是：

1. 输入 `x` 激活某些 LN feature `z`。
2. 这些 `z` 表示当前 odor 属于哪些常见活动模式 / soft cluster。
3. LN 通过 `Wz` 对 ORN axon output `y` 产生模式特异性抑制。
4. 常见共享模式被归一化或压缩。
5. 输出 `y` 的冗余降低。

所以 NNC 的效果更像：

```text
partial whitening + normalization + feature extraction
```

它不仅降低线性相关性，也把输入组织成若干可解释的非负特征。这也是为什么 Chapochnikov 论文会说 LNs encode soft cluster memberships of ORN activity。

### 3.5 LC 和 NNC 的区别一句话

LC：

> 通过线性稳态动力学对输入谱做方向依赖的 shrinkage，最适合理解 partial decorrelation 的数学原理。

NNC：

> 在类似目标下加入非负约束，使 LN 活动更像 soft cluster / feature membership，去相关同时伴随归一化和可解释特征提取。

---

## 4. 为什么是“部分去相关”，不是完整 PCA whitening

PCA whitening 做的是：

```text
1. 计算输入 covariance
2. 找到所有 principal components
3. 旋转到 PCA 坐标
4. 每个方向除以 sqrt(lambda_i)
5. 输出 covariance 变成 identity
```

所以 PCA whitening 的理想结果是：

```text
C_y = I
```

但 LC / NNC 网络不是这样做的。

它受到这些限制：

1. LN 数量有限，记作 `K`。
2. 网络通过动态反馈压缩主方向，不是显式除以 `sqrt(lambda_i)`。
3. 压缩形式通常是 nonlinear shrinkage。
4. NNC 还有非负性约束。
5. 学习规则是局部的、在线的，依赖样本统计。

所以更准确的表述是：

> The circuit partially whitens and normalizes ORN representations through inhibitory feedback.

中文：

> 该回路通过抑制性反馈对 ORN 表示进行部分白化和归一化。

但在你的论文里更稳妥的说法是：

> 它实现的是部分去相关 / 部分谱均衡，而不是严格 PCA whitening。

---

## 5. 参数怎么影响去相关

### 5.1 K：LN 数量，也就是可处理的方向数

`K` 是 LN / lateral units 数量。

直觉：

```text
K 越大，网络理论上可以捕捉和抑制更多主导方向。
```

但：

```text
K = 50 不等于 effective dimension = 50
```

原因：

- `K` 只是 lateral population 的容量。
- 实际学到哪些方向取决于输入谱、样本数、学习动态。
- 每个方向压缩多强取决于 `rho`。
- 输入本来很干净时，增加 K 的边际收益会变小。

### 5.2 rho：谱压缩强度

`rho` 是最关键的去相关强度参数之一。

补充材料里提到 scaling `X` 和 scaling `rho` 有等价关系，这说明 `rho` 实际上控制的是输入强度与网络压缩强度之间的相对尺度。

直觉：

```text
rho 小：feedback/shrinkage 弱，y 接近 x
rho 中等：主导方向被压缩，ED 上升，correlation 下降
rho 太大：可能过度压缩，任务相关方差信息也被削弱
```

注意：

```text
rho -> infinity 不等于 exact whitening
```

因为它不是 PCA 的 `1/sqrt(lambda_i)` 缩放。

### 5.3 gamma：实现尺度参数

`gamma` 出现在：

<div class="equation-block">
  <div><span class="eq-left">dy/dτ</span><span class="eq-op">=</span><span>-y - γ²Wz + x</span></div>
  <div><span class="eq-left">dz/dτ</span><span class="eq-op">=</span><span>-Mz + (ρ² / γ²)Wᵀy</span></div>
</div>

它同时改变：

- `z` 对 `y` 的 feedback 强度。
- `y` 对 `z` 的 drive 强度。

所以 `gamma` 不是单纯的“越大越去相关”。它更像电路实现中的尺度匹配参数，会影响活动幅度、权重尺度、时间常数和稳定性。

### 5.4 学习率 eta

突触更新：

<div class="equation-block">
  <div><span class="eq-left">W</span><span class="eq-op">←</span><span>W + η₁(yzᵀ - W)</span></div>
  <div><span class="eq-left">M</span><span class="eq-op">←</span><span>M + η₂(zzᵀ - M)</span></div>
</div>

解释：

- `y z.T` 是 Hebbian term。
- `z z.T` 学到 LN 内部相关结构。
- `-W` 和 `-M` 是衰减项，防止权重无限增长。

学习率太小：

- 学得慢。
- 需要更多 odor samples。

学习率太大：

- 可能追着单个样本波动。
- 学到噪声方向。
- 稳态不稳定。

---

## 6. 你论文里的诊断指标怎么解释

你现在图里常用指标：

| 指标 | 说明 |
| --- | --- |
| Effective dimension | 方差是否分散到更多维度 |
| Mean abs offdiag correlation | 平均通道相关性 |
| Max abs offdiag correlation | 最强残余相关 |
| PC1 + PC2 | 前两个主成分是否支配表示 |

如果 LC 有去相关效果，你应该看到：

```text
Effective dimension 上升
mean abs offdiag correlation 下降
max abs offdiag correlation 下降
PC1 + PC2 explained variance 下降
```

但不要只看分类准确率。

去相关和分类准确率不是同一个目标：

```text
去相关 = 表示效率 / 冗余降低
分类准确率 = 当前标签、噪声、读出器共同决定
```

如果标签本来就沿着 ORN 的高方差方向很好分开，强行去相关可能不会提升分类，甚至略降。

所以你的论文里可以写：

> LC preprocessing improves representational efficiency by reducing redundancy and flattening the response spectrum. However, this improvement does not necessarily translate into higher classification accuracy, because downstream performance depends on the alignment between task labels and the variance structure of the input representation.

---

## 7. 推荐研读顺序

### 第 1 遍：只读问题和结论

读 Chapochnikov 2023 主文：

1. Abstract
2. Significance statement
3. Introduction 中关于 ORN-LN preprocessing 的动机
4. Fig. 1 电路结构
5. Fig. 4 或涉及模型结果的部分

目标：

```text
知道这个网络为什么被提出：
connectome + activity + similarity matching -> adaptive circuit
```

### 第 2 遍：读电路公式

重点看：

- LC equations
- NNC equations
- Synaptic plasticity equations

问自己：

```text
x, y, z 分别是什么？
W, M 分别是什么？
公式 6 是给定 W/M 后的快速活动动力学吗？
公式 8 是跨样本更新 W/M 的慢学习规则吗？
```

答案：

> 是。活动动力学是单个 stimulus 下的 fast inference；突触更新是多个 stimulus 上的 slow learning。

### 第 3 遍：读补充材料

重点看：

- Optimization problem
- Equivalence of scaling X and rho
- Circuit dynamical equations
- Steady-state solution and stability
- Effect of rho and gamma

目标：

```text
理解 rho/gamma 不是随便调参，而是电路计算和实现尺度的一部分。
```

### 第 4 遍：读 Pehlevan 2018

重点不是所有数学细节，而是：

```text
为什么 similarity matching 可以导出局部 Hebbian / anti-Hebbian 网络？
```

你只需要抓住：

- 全局目标：保持 pairwise similarity。
- 变量替换：把全局目标拆成局部可优化形式。
- 神经解释：突触只需要 pre/post 活动。
- 结果：Hebbian feedforward / anti-Hebbian lateral competition。

---

## 8. 最容易混淆的点

### 混淆 1：公式 6 和公式 8 是不是同一件事？

不是。

公式 6 / 7：

```text
给定当前 W, M 和当前输入 x
求 y, z 的稳态活动
```

这是 fast inference。

公式 8：

```text
用当前得到的 y, z 更新 W, M
```

这是 slow learning。

### 混淆 2：LN 是不是直接等于 PCA component？

不是。

LN activity `z` 可以理解为学到主导特征或 soft cluster membership，但它不是手动 PCA 之后的 component。

### 混淆 3：去相关是不是一定提高分类准确率？

不是。

去相关改善的是表示几何和效率。分类准确率取决于任务标签是否受益于这种几何改变。

### 混淆 4：LC 是不是 whitening？

不是严格 whitening。更准确：

```text
LC / NNC performs partial whitening, normalization, and decorrelation.
```

论文里如果想稳妥：

```text
partial decorrelation / partial spectral equalization
```

---

## 9. 可以写进你论文的中文解释

自适应预处理网络可以被理解为一种由 similarity matching 原理推导出的 ORN-LN 回路。该网络的目标不是简单复制输入，也不是显式执行 PCA 白化，而是在保留气味样本相似性结构的同时，通过局部 Hebbian 学习和 LN 间抑制性竞争，自适应地学习输入活动中的主导相关方向。对于单个气味刺激，给定当前突触权重后，ORN 轴突活动和 LN 活动通过快速动力学达到稳态；在多个气味样本呈现过程中，ORN-LN 和 LN-LN 权重则根据局部活动相关性缓慢更新。由于高方差共享方向更容易驱动 LN 活动，这些方向会被 LN 反馈抑制项优先压缩，从而降低 ORN 输出表示中的通道相关性，提高有效维度，并使协方差谱更加均衡。因此，该网络的去相关作用应理解为受生物电路约束的部分去相关或部分白化，而不是严格的 PCA whitening。

---

## 10. 一句话复习版

> 这个自适应预处理网络通过 similarity matching 保留气味样本之间的几何关系，同时用 LN 学到并反馈抑制 ORN 表示中的主导相关方向；因此它能降低冗余、提高 effective dimension、实现部分去相关，但它不是精确 PCA whitening，且去相关是否提高分类准确率取决于具体任务和输入统计。
