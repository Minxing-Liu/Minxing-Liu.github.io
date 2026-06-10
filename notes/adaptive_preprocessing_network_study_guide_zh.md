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

```text
dy/dtau = -y - gamma^2 W z + x
dz/dtau = -M z + (rho^2 / gamma^2) W.T y
```

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

```text
y(tau + 1) = [y(tau) + eta(-y - Wz + x)]_+
z(tau + 1) = [z(tau) + eta(-Mz + rho^2 W.T y)]_+
```

其中：

```text
[a]_+ = max(0, a)
```

为什么重要？

神经活动通常不能任意正负变化，NNC 更接近真实神经元活动。论文中 NNC 对 connectome 中 ORN-LN 权重的预测更有生物意义。

---

## 3. 去相关效果从哪里来

去相关不是网络手动调用 PCA，而是 lateral feedback 的结果。

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

LN 的作用是学到这些常见、强烈、重复出现的方向。

机制可以理解为：

```text
强相关方向反复出现
    ↓
LN z 更容易被这些方向驱动
    ↓
W 学到 y 与 z 的相关模式
    ↓
下次同类方向出现时，Wz 反馈抑制 y
    ↓
主导方向方差被压低
    ↓
输出更去相关、更谱均衡
```

这就是 partial decorrelation 的本质。

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

```text
dy/dtau = -y - gamma^2 Wz + x
dz/dtau = -Mz + (rho^2 / gamma^2) W.T y
```

它同时改变：

- `z` 对 `y` 的 feedback 强度。
- `y` 对 `z` 的 drive 强度。

所以 `gamma` 不是单纯的“越大越去相关”。它更像电路实现中的尺度匹配参数，会影响活动幅度、权重尺度、时间常数和稳定性。

### 5.4 学习率 eta

突触更新：

```text
W <- W + eta_1 (y z.T - W)
M <- M + eta_2 (z z.T - M)
```

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

