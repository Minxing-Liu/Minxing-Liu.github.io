# Similarity Matching 与嗅觉预处理网络复习笔记

## 一句话总览

Similarity matching 的核心思想是：输出表示 `Y` 应该尽量保留输入表示 `X` 中样本之间的相似关系，但在神经网络约束下，这个目标会自然导出带有 Hebbian / anti-Hebbian 学习规则的局部电路。放到嗅觉系统里，它可以解释 ORN 到 LC / LN 层的预处理：降低冗余、压制主导方差方向、提高有效维度，但它不是严格的 PCA whitening。

## 1. 为什么嗅觉系统需要预处理

ORN 的原始响应可能有几个问题：

- 不同受体通道之间高度相关。
- 样本总浓度可能成为一个很强的共同轴。
- 少数主方向占据大量方差，下游分类或稀疏编码会受到几何结构影响。
- 如果每个 ORN 都对大量分子有正响应，PCA 的 PC1 很容易主要反映“总气味量”，而不是真正的分子组成结构。

所以预处理网络的目标不是简单“提高分类准确率”，而是让表示更有效、更均衡、更适合下游读出。

## 2. Similarity matching 在做什么

把所有 odor 样本写成矩阵：

```text
X = [x(1), x(2), ..., x(T)]
Y = [y(1), y(2), ..., y(T)]
```

这里：

- `X` 是输入响应矩阵，例如 ORN soma / ORN response。
- `Y` 是输出响应矩阵，例如 ORN axon / LC-preprocessed response。
- 每一列是一个 odor sample。
- 每一行是一个 neural channel。

Similarity matching 要保留样本之间的相似性：

```text
输入样本相似性: X.T X
输出样本相似性: Y.T Y

目标: 让 Y.T Y 尽量接近 X.T X
```

直觉：

- 如果两个 odor 在输入空间中相似，输出中也应该相似。
- 如果两个 odor 在输入空间中不同，输出中也应该不同。
- 在加上神经网络约束后，网络会压制冗余的主方向，让输出更均衡。

常见误解：similarity matching 不是直接说“输出等于输入”，而是在保留样本关系的同时，通过约束和辅助变量导出一个可由神经电路实现的变换。

## 3. 模型变量表

| 符号 | 含义 | 生物解释 |
| --- | --- | --- |
| `x(t)` | 第 `t` 个 odor 的输入活动 | ORN 原始响应 |
| `y(t)` | 第 `t` 个 odor 的输出活动 | 预处理后的 ORN axon / LC output |
| `z(t)` | lateral feature 活动 | LN / local interneuron 活动 |
| `W` | `y` 与 `z` 的相关统计 | reciprocal / feedforward-like learned weights |
| `M` | `z` 内部相关统计 | lateral competition / inhibition 相关矩阵 |
| `K` | lateral units 数量 | 可以作用的主方向数量 |
| `rho` | 谱压缩强度参数 | 改变 shrinkage 强度，但不等于 whitening 开关 |

## 4. 神经动力学怎么写

LC 模型的一种常见活动动力学形式可以写成：

```text
dy/dtau = -y - gamma^2 W z + x
dz/dtau = -M z + (rho^2 / gamma^2) W.T y
```

直觉：

- `x` 驱动输出层 `y`。
- `z` 提取输入 / 输出中的主导结构。
- `W z` 通过反馈项压制 `y` 中的冗余方向。
- `M z` 让 lateral population 内部产生竞争。

这就是为什么它可以做 decorrelation：不是因为人为调用 PCA，而是因为 lateral circuit 在动态上会压制主导相关结构。

## 5. 学习规则为什么是 Hebbian / anti-Hebbian

慢变量更新可以写成：

```text
W <- W + eta * (y z.T - W)
M <- M + eta * (z z.T - M)
```

解释：

- `y z.T` 是 pre-post 活动相关，因此像 Hebbian 学习。
- `z z.T` 学到 lateral population 内部的相关结构。
- 在动力学里，`M` 进入的是竞争 / 抑制项，所以整体效果类似 anti-Hebbian 的 lateral competition。

Pehlevan et al. 2018 的关键贡献之一是解释：为什么 similarity matching 这种全局目标，最后会导出局部 synapse 可以实现的 Hebbian / anti-Hebbian 更新。

## 6. LC 不是 PCA whitening

这是最重要的易混点。

PCA whitening 做的是：

```text
1. 找到全部 principal components
2. 旋转到 PCA 坐标
3. 把所有方向的方差拉成一样
4. 输出 covariance 近似 identity
```

LC 做的是：

```text
1. 通过 lateral units 提取若干主导方向
2. 对这些方向做非线性谱压缩
3. 降低平均相关性
4. 提高 effective dimension
5. 但不保证所有方向方差完全相等
```

所以准确表述应该是：

> LC performs partial decorrelation / partial spectral equalization, not exact PCA whitening.

中文可以写成：

> LC 是受约束的部分去相关 / 部分谱均衡机制，不是完整 PCA 白化。

## 7. K、rho、ED 的关系

### K 是什么

`K` 是 lateral units 的数量。它大致决定网络可以直接作用多少个主导方向。

注意：

```text
K = 50 不等于 ED = 50
```

原因：`K=50` 只是说明 LC 理论上可以作用到 50 个方向；每个方向被压缩到什么程度，还取决于输入谱形状、`rho`、样本数和具体实现。

### rho 是什么

`rho` 控制谱压缩强度，但：

```text
rho -> infinity 也不等于 PCA whitening
```

在当前解析形式中，被 LC 作用的方向大致满足类似关系：

```text
y_i + (rho^2 / n) y_i^3 = s_i
```

当 `rho` 很大时：

```text
y_i ~ (n s_i / rho^2)^(1/3)
```

这会让谱更平，但不是把所有方差变成完全一样。它更像 nonlinear shrinkage，不是 exact whitening。

## 8. 本论文当前诊断图怎么读

图中比较三种表示：

1. ORN response: `x = f_ORN(c)`
2. LC output: `y_LC`
3. PCA whitening reference: `y_white`

当前数值：

| 表示 | Effective dim | Mean abs offdiag r | Max abs offdiag r | PC1 + PC2 |
| --- | ---: | ---: | ---: | ---: |
| ORN | 25.53 | 0.111 | 0.515 | 16.8% |
| LC | 41.80 | 0.049 | 0.234 | 8.0% |
| PCA whitening | 50.00 | 0.000 | 0.000 | 4.0% |

结论：

- ORN 已经比早期版本正常很多，不再被总浓度 PC1 支配。
- LC 把 ED 从 25.53 提高到 41.80。
- LC 把平均 off-diagonal correlation 从 0.111 降到 0.049。
- LC 把 PC1+PC2 从 16.8% 降到 8.0%。
- PCA whitening 是理想上界，不是 LC 的实际目标。

## 9. 为什么图上 LC 去相关有时看起来“不明显”

主要原因有三个：

1. 新版 ORN 输入本来已经较干净。
   早期 dense sensitivity 会导致 PC1 约 0.93，LC 压制会非常明显。现在 ORN mean correlation 只有 0.111，所以视觉改善空间变小。

2. LC 是 partial decorrelation。
   如果 `K` 较小，只会明显压制前几个主方向。压完之后，原来的第 3、第 4 方向可能变成新的 PC1/PC2，所以 PCA scatter 仍然可能有结构。

3. heatmap 色标通常是 `-1` 到 `1`。
   当大多数 offdiag correlation 在 0.05 到 0.10 左右时，视觉上天然很淡。数值指标比肉眼更可靠。

## 10. 去相关不等于分类准确率必然提高

当前 dominant molecular block task 里，ORN 本身已经能很好分类，所以 LC 不一定提高分类准确率。

当前大致结果：

```text
without KC expansion:
ORN       0.921 +/- 0.011
LC        0.918 +/- 0.012
PCA white 0.904 +/- 0.010

with sparse KC expansion:
ORN-KC       0.918 +/- 0.009
LC-KC        0.908 +/- 0.009
PCA white-KC 0.891 +/- 0.013
```

正确解释：

- LC 提高的是 coding efficiency / spectral balance / decorrelation。
- 分类准确率是否提升取决于任务标签、噪声、下游 KC 稀疏扩展、阈值和读出方式。
- 如果标签结构已经在 ORN 中很线性可分，强行白化甚至可能洗掉对当前任务有用的方差信息。

## 11. 可以写进论文或汇报的标准表述

英文：

> The LC preprocessing network modestly flattens the ORN spectrum and reduces pairwise feature correlations. This should be interpreted as a biologically constrained partial-decorrelation mechanism rather than exact PCA whitening.

中文：

> LC 预处理网络能够压平 ORN 表示的谱结构并降低通道间相关性，但这种作用应理解为受生物电路约束的部分去相关 / 部分谱均衡，而不是严格的 PCA 白化。

更谨慎版本：

> In the present odor statistics, LC improves representation efficiency but does not automatically improve the downstream classification accuracy, suggesting that the computational benefit of decorrelation is task- and regime-dependent.

中文：

> 在当前气味统计结构下，LC 提高了表示效率，但不必然提高下游分类准确率，说明去相关的行为学收益依赖具体任务、噪声条件和下游读出机制。

## 12. 复习检查清单

复习时问自己：

- Similarity matching 保留的是 `X.T X` 和 `Y.T Y` 的相似结构吗？
- 为什么这个目标可以导出局部 Hebbian / anti-Hebbian 网络？
- `z` 的生物解释是什么？
- `W` 和 `M` 分别学习什么统计量？
- LC 为什么不是 PCA whitening？
- `K=50` 为什么不等于 `ED=50`？
- `rho -> infinity` 为什么也不等于 exact whitening？
- Effective dimension 怎么解释？
- Mean abs offdiag correlation 下降说明什么？
- 为什么 decorrelation 不保证 classification accuracy 上升？

## 13. 最短版摘要

Similarity matching 提供了一个从表示几何到神经电路的桥梁：它要求输出保留输入样本之间的相似性，同时在神经约束下导出局部 Hebbian / anti-Hebbian 学习规则。放到嗅觉系统中，LC / LN 预处理网络可以压制 ORN 表示中的主导相关方向，使输出更去相关、更谱均衡、effective dimension 更高。当前结果中，LC 将 ED 从 25.53 提高到 41.80，并将 mean abs offdiag correlation 从 0.111 降到 0.049。但 LC 不是 PCA whitening；它是 partial decorrelation / partial spectral equalization。其对下游分类的帮助取决于 odor statistics、任务标签、噪声和 KC 稀疏扩展方式。

## 参考文献

- Chapochnikov, N., Pehlevan, C., and Chklovskii, D. B. (2023). Normative and mechanistic model of an adaptive circuit for efficient encoding and feature extraction. PNAS. DOI: https://doi.org/10.1073/pnas.2117484120
- Pehlevan, C., Sengupta, A. M., and Chklovskii, D. B. (2018). Why Do Similarity Matching Objectives Lead to Hebbian/Anti-Hebbian Networks? Neural Computation. DOI: https://doi.org/10.1162/NECO_A_01018
