# Similarity Matching 与 LC 预处理网络：去相关原理和参数影响深度笔记

## 0. 一句话总览

这个网络想解决的问题不是“把 ORN 响应简单变成 PCA whitening”，而是：

> 在尽量保留气味样本之间相似关系的前提下，用一个生物可实现的 lateral circuit 压制 ORN 表示中的冗余主方向，让输出更去相关、更谱均衡、更适合下游稀疏读出。

可以把它理解成：

```text
ORN 原始表示
    -> 可能有通道相关、总浓度轴、少数大方差方向

LC / LN 预处理网络
    -> 学到主导相关方向
    -> 通过 lateral feedback 抑制这些方向
    -> 得到 partial decorrelation / partial whitening

PCA whitening
    -> 理想数学参照，不是该生物网络的实际计算
```

核心关键词：

- similarity matching
- Hebbian / anti-Hebbian learning
- lateral inhibition
- spectral shrinkage
- partial decorrelation
- effective dimension
- `K`、`rho`、`gamma`、学习率、输入谱

---

## 1. 为什么嗅觉前端需要去相关

ORN 把化学空间映射到神经活动空间。这个映射通常不是理想的独立编码，而会有几类冗余：

1. 通道间相关性  
   不同 ORN 可能对相似分子族都有响应，所以多个通道携带重复信息。

2. 总浓度轴  
   如果很多 ORN 都随气味总浓度一起上升，第一主成分可能主要反映“有多少气味”，而不是“是什么气味”。

3. 少数高方差方向支配表示  
   如果 covariance spectrum 很陡，前几个 PC 占据大部分方差，下游读出会被这些方向牵着走。

4. 下游 KC 稀疏扩展容易继承上游冗余  
   KC 随机抽样 ORN/PN 输入时，如果上游通道高度相关，随机扩展并不会自动创造真正独立的信息维度。

因此，预处理网络的目标不是“增加神经活动量”，而是让表示更均衡：

```text
降低通道相关性
压平 covariance spectrum
提高 effective dimension
削弱 nuisance variable
保留气味之间有用的几何关系
```

---

## 2. Similarity matching 的核心目标

设输入样本矩阵为：

```text
X = [x(1), x(2), ..., x(T)]
```

输出样本矩阵为：

```text
Y = [y(1), y(2), ..., y(T)]
```

其中：

- 每一列是一个 odor sample。
- 每一行是一个神经通道。
- `X.T X` 描述输入样本之间的 pairwise similarity。
- `Y.T Y` 描述输出样本之间的 pairwise similarity。

最直接的 similarity matching 目标是：

```text
min_Y || X.T X - Y.T Y ||_F^2
```

直觉：

- 输入中相似的两个 odor，输出中也应该相似。
- 输入中不同的两个 odor，输出中也应该不同。
- 网络不应该随便破坏 odor geometry。

但这个目标本身是全局目标，神经元不可能直接拿到整个 `X.T X` 和 `Y.T Y` 矩阵。Pehlevan 等人的关键思想是：通过引入辅助变量和约束，可以把这个全局目标改写成局部神经网络动力学和局部突触更新。

---

## 3. 从相似性保持到 Hebbian / anti-Hebbian 网络

一个典型形式中，网络有三类活动：

```text
x(t): 输入活动，例如 ORN response
y(t): 输出活动，例如 LC 预处理后的 projection output
z(t): lateral feature / interneuron activity
```

活动动力学可以抽象写成：

```text
dy/dtau = -y - gamma^2 W z + x
dz/dtau = -M z + (rho^2 / gamma^2) W.T y
```

慢变量学习规则可以写成：

```text
W <- W + eta * (y z.T - W)
M <- M + eta * (z z.T - M)
```

这几项的含义：

| 符号 | 数学角色 | 生物直觉 |
| --- | --- | --- |
| `x` | 输入驱动 | ORN 原始响应 |
| `y` | 输出表示 | 预处理后的 projection output |
| `z` | 辅助特征 / lateral population | LN / LC 内部特征活动 |
| `W` | `y` 与 `z` 的相关统计 | feedforward / feedback-like learned weights |
| `M` | `z` 内部相关统计 | lateral competition / inhibition |
| `gamma` | y-z 耦合尺度 | 影响反馈强度和活动尺度 |
| `rho` | 谱压缩强度 | 控制去相关 / shrinkage 强度 |
| `eta` | 学习率 | 突触统计更新速度 |

为什么是 Hebbian / anti-Hebbian？

- `W` 的更新项 `y z.T` 是 pre-post 活动相关，因此是 Hebbian-like。
- `M` 学到 `z z.T`，但在活动动力学中作为抑制 / competition 矩阵出现，因此整体效果是 anti-Hebbian-like lateral inhibition。

重点：

> 网络不是先显式算 PCA，再白化。它是在活动动力学和局部学习规则中逐渐学到输入的主导相关结构，然后用 lateral loop 抑制这些结构。

---

## 4. 去相关到底从哪里来

### 4.1 输入 covariance 的问题

假设输入已经中心化，输入 covariance 可以写成：

```text
C_x = E[x x.T]
```

如果做特征分解：

```text
C_x = U diag(lambda_1, lambda_2, ..., lambda_N) U.T
```

其中：

```text
lambda_1 >= lambda_2 >= ... >= lambda_N
```

如果 `lambda_1`、`lambda_2` 很大，说明输入中有几个主导方向。这些方向可能是：

- 总浓度方向
- 分子族共同响应方向
- 多个 ORN 共同激活造成的公共轴
- 数据生成过程中的 dominant block direction

去相关的目标不是把所有活动消掉，而是避免少数方向垄断表示。

### 4.2 Lateral loop 如何压制主方向

在动力学中：

```text
dy/dtau = -y - gamma^2 W z + x
```

可以把 `x` 看成外部驱动，把 `gamma^2 W z` 看成 lateral feedback 抑制项。

如果某个输入方向在数据中反复出现，`z` 会更容易对它产生响应，`W` 会学到这个方向与输出之间的相关性。之后当同类方向再次出现时，`W z` 会把这部分从 `y` 中扣掉一部分。

因此：

```text
高方差 / 高相关方向
    -> 更容易被 z 捕捉
    -> W 学得更强
    -> feedback 抑制更强
    -> 输出方差被压缩
```

低方差方向不一定被强烈压缩，因为它们没有那么容易驱动 lateral population。

这就是 partial decorrelation 的核心。

### 4.3 为什么会提高 effective dimension

Effective dimension 常用一种 participation ratio 形式：

```text
ED = (sum_i lambda_i)^2 / sum_i lambda_i^2
```

如果所有方差集中在少数方向：

```text
lambda = [100, 1, 1, 1, ...]
ED 很低
```

如果方差分布更均匀：

```text
lambda = [10, 9, 8, 7, ...]
ED 更高
```

LC 压制大 `lambda_i`，会让谱更平：

```text
lambda_1, lambda_2 被压低
总方差分布更均匀
ED 上升
```

所以你当前图里的结果：

```text
ORN ED = 25.53
LC  ED = 41.80
PCA ED = 50.00
```

说明 LC 的确把表示从“少数方向占优”推向“更多方向参与编码”。

---

## 5. LC 为什么不是 PCA whitening

PCA whitening 做的是精确数学变换：

```text
1. 计算 C_x = U diag(lambda_i) U.T
2. 旋转到 PCA 坐标 U.T x
3. 每个方向除以 sqrt(lambda_i)
4. 输出 covariance 变成 identity
```

也就是：

```text
C_white = I
```

这会导致：

```text
所有主方向方差完全相等
off-diagonal covariance 为 0
correlation heatmap 完全干净
```

LC 不同：

1. 它只有有限数量的 lateral units：`K`。
2. 它通过动态反馈压缩主方向，而不是显式除以 `sqrt(lambda_i)`。
3. 它的压缩是 nonlinear shrinkage，不是精确白化。
4. 它受活动非负性、神经动力学、学习稳定性、噪声和样本统计约束。

因此准确表述是：

> LC 是 partial decorrelation / partial spectral equalization，不是 exact PCA whitening。

---

## 6. 一个有用的谱压缩直觉

在某些解析形式或近似下，被 LC 作用的方向可以用类似关系理解：

```text
y_i + (rho^2 / n) y_i^3 = s_i
```

这里：

- `s_i` 可以理解为输入在第 `i` 个主方向上的强度或奇异值相关量。
- `y_i` 是输出中对应方向的强度。
- `rho` 控制非线性压缩强度。
- `n` 是样本数或归一化尺度相关量。

当 `rho` 较小时：

```text
y_i ≈ s_i
```

网络接近 identity，去相关弱。

当 `rho` 较大时，三次项变重要：

```text
(rho^2 / n) y_i^3 ≈ s_i
```

所以：

```text
y_i ≈ (n s_i / rho^2)^(1/3)
```

这个关系很重要，因为它说明：

```text
输入强方向 s_i 很大
输出不是线性变大
而是被压成三分之一次方级别
```

所以 LC 会压缩大方向，使谱变平。

但它也说明：

```text
rho -> infinity 不等于 PCA whitening
```

因为 PCA whitening 要把所有方向方差拉成完全一样，而这里是非线性 shrinkage：

```text
s_i -> s_i^(1/3)
```

方向之间的差异被减弱，但不被完全消除。

---

## 7. 参数影响总表

| 参数 / 因素 | 增大时通常发生什么 | 可能的问题 |
| --- | --- | --- |
| `K` | 可作用的主方向数量增加，去相关范围变宽，ED 可能上升 | K 太大可能过度压缩有用结构，也更难稳定学习 |
| `rho` | 谱压缩更强，主导方向被更明显削弱 | 过大可能损失任务相关方差信息，活动尺度变小 |
| `gamma` | 改变 y-z feedback 耦合尺度 | 不合适会导致反馈太弱或动力学不稳 |
| `eta_W` | W 学习更快 | 太大可能振荡，太小收敛慢 |
| `eta_M` | M 学习更快 | 太大可能 lateral competition 不稳定 |
| 样本数 `T` | covariance 估计更可靠 | 样本少时学到的主方向可能是噪声 |
| 输入谱陡峭程度 | 越陡，LC 可见效果越明显 | 输入本来很干净时视觉变化小 |
| 输入是否中心化/归一化 | 影响 PC1 是否变成总浓度轴 | 未处理总浓度会让网络主要压浓度而非身份结构 |
| 下游任务标签 | 决定去相关是否提升准确率 | 标签若依赖高方差方向，强去相关可能降准确率 |

---

## 8. `K` 的影响：控制能处理多少个主方向

`K` 是 lateral population 的维度。它不是输出维度，也不等于 effective dimension。

可以这样理解：

```text
K = lateral circuit 的“去相关预算”
```

如果 `K = 1`：

- 网络主要能压制最强的一个公共方向。
- 如果 PC1 是总浓度轴，K=1 可能已经很有用。
- 但 PC2、PC3 等结构还会保留。

如果 `K = 10`：

- 网络可以作用多个主方向。
- covariance spectrum 前部会更明显被压平。
- ED 通常比 K=1 更高。

如果 `K` 接近通道数：

- 网络理论上可以处理更多方向。
- 结果更接近 whitening reference。
- 但仍然不是 exact PCA whitening，因为压缩形式和学习约束不同。

重要误区：

```text
K = 50 不等于 ED = 50
```

原因：

1. `K` 只表示有 50 个 lateral units。
2. 每个方向是否被学到，取决于输入谱、样本数和学习动态。
3. 每个方向压缩多强，取决于 `rho` 和活动解。
4. 如果输入本身只有少数主导方向，增加 K 的边际收益会下降。

---

## 9. `rho` 的影响：控制压缩强度

`rho` 可以理解为 spectral shrinkage strength。

### 9.1 rho 小

```text
rho 很小
=> lateral feedback 弱
=> y 接近 x
=> correlation 降低不明显
=> ED 上升有限
```

适合：

- 不希望破坏原始表示。
- 输入本来已经较干净。
- 下游标签依赖高方差方向。

### 9.2 rho 中等

```text
rho 中等
=> 主导方向被压缩
=> 谱更平
=> mean offdiag correlation 下降
=> ED 上升
```

这是通常最合理的区间。它能减少冗余，但还保留一定任务结构。

### 9.3 rho 很大

```text
rho 很大
=> 强方向被强烈压缩
=> 输出谱继续变平
=> 活动幅度可能整体变小
=> 任务相关方差信息可能被洗掉
```

关键点：

```text
rho 大不等于越好
rho -> infinity 不等于 exact PCA whitening
```

因为过强压缩可能带来两个问题：

1. 对分类有用的方向也被压掉。
2. 输出活动尺度变小，进入 KC 阈值或非线性读出时可能改变稀疏性。

---

## 10. `gamma` 的影响：耦合尺度而不是单纯强弱旋钮

动力学里：

```text
dy/dtau = -y - gamma^2 W z + x
dz/dtau = -M z + (rho^2 / gamma^2) W.T y
```

`gamma` 同时出现在两个地方：

```text
y 方程里的 feedback: gamma^2 W z
z 方程里的 drive:     rho^2 / gamma^2 W.T y
```

所以它不是简单的“越大越抑制”。增大 `gamma` 会：

- 增强 `z` 对 `y` 的反馈项尺度。
- 但降低 `y` 驱动 `z` 的项尺度。
- 改变 `y` 和 `z` 的相对活动单位。

实践解释：

> `gamma` 更像 y-z 两个 population 之间的尺度匹配参数。它会影响动力学稳定性、活动幅度和反馈平衡，但通常不应该被解释成唯一的去相关强度参数；`rho` 更接近谱压缩强度。

---

## 11. 学习率和时间尺度的影响

慢变量：

```text
W <- W + eta * (y z.T - W)
M <- M + eta * (z z.T - M)
```

这里 `eta` 控制突触统计估计的时间尺度。

### eta 太小

- 学得慢。
- 需要更多 odor samples。
- 短实验中可能看不到明显 decorrelation。

### eta 适中

- 能稳定估计主导相关结构。
- 输出逐步去相关。
- 谱指标平滑改善。

### eta 太大

- W/M 追着单个样本波动。
- 可能学到噪声方向。
- 活动可能振荡，去相关指标不稳定。

生物解释：

> 活动变量 `y,z` 是快时间尺度；突触变量 `W,M` 是慢时间尺度。只有快慢分离足够好，网络才像是在估计长期输入统计，而不是被当前 odor sample 牵着走。

---

## 12. 输入统计比参数本身更重要

同一组 `K/rho/gamma` 在不同输入统计下效果会不同。

### 情况 A：输入高度冗余

例如早期 dense sensitivity：

```text
很多 ORN 都对很多分子正响应
PC1 近似总浓度轴
mean correlation 高
PC1 explained variance 很大
```

这时 LC 效果会很明显：

- PC1 被压低。
- PCA scatter 视觉变化明显。
- heatmap 相关性下降明显。
- ED 大幅上升。

### 情况 B：输入本来已经较干净

例如当前 sparse / balanced ORN：

```text
ORN mean abs offdiag r = 0.111
PC1 + PC2 = 16.8%
```

这时 LC 仍有效，但视觉变化可能不夸张：

```text
LC mean abs offdiag r = 0.049
LC PC1 + PC2 = 8.0%
```

这已经是明显改善，但 heatmap 上可能只是“淡了一些”。

结论：

> LC 效果大小必须相对于输入冗余程度解释。输入越冗余，去相关越显眼；输入越健康，LC 的边际改善越温和。

---

## 13. 怎么读你当前这张 ORN / LC / PCA 图

当前诊断图比较三种表示：

```text
ORN response
LC output
PCA whitening reference
```

指标：

| 表示 | Effective dim | Mean abs offdiag r | Max abs offdiag r | PC1 + PC2 |
| --- | ---: | ---: | ---: | ---: |
| ORN | 25.53 | 0.111 | 0.515 | 16.8% |
| LC | 41.80 | 0.049 | 0.234 | 8.0% |
| PCA whitening | 50.00 | 0.000 | 0.000 | 4.0% |

解释：

1. ED 从 25.53 到 41.80  
   LC 让更多维度参与编码，谱更平。

2. mean abs offdiag r 从 0.111 到 0.049  
   通道间平均相关性大约降了一半以上。

3. max abs offdiag r 从 0.515 到 0.234  
   最强的一些残余相关也被明显压低。

4. PC1+PC2 从 16.8% 到 8.0%  
   前两个 PCA 方向不再那么支配整体方差。

5. PCA whitening 是上界  
   PCA white 的 offdiag 为 0 是数学构造出来的，不代表生物网络也应该完全达到。

一句话：

> 这张图支持“LC 做了部分去相关和谱均衡”，但不应该写成“LC 实现了完整 PCA whitening”。

---

## 14. 去相关为什么不保证分类准确率提高

这是一个很重要的论文解释点。

分类准确率取决于：

```text
标签结构
噪声结构
读出模型
训练样本数
KC 稀疏连接
KC 阈值
表示中哪些方向承载标签信息
```

如果标签刚好沿着 ORN 的高方差方向分开，那么强去相关可能会削弱这部分信息。

例如：

```text
某个 molecular block 同时造成最大方差
线性分类器已经很容易读出
LC 把这个高方差方向压低
分类准确率不一定升高
```

所以当前结果：

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

不说明 LC 模型失败。它说明：

> 当前任务中，标签结构已经在 ORN 表示中比较容易被线性读出；LC 提高了表示效率，但这个效率收益没有转化成当前分类设置下的准确率收益。

去相关更可能帮助的情况：

1. 有强 nuisance axis，比如总浓度干扰身份分类。
2. 下游读出样本有限，需要减少冗余提高泛化。
3. 噪声沿高方差共享方向传播。
4. KC 随机扩展受到上游相关性限制。
5. 任务需要区分细微组成差异，而不是粗粒度 dominant block。

---

## 15. 参数扫描时应该看哪些指标

不要只看 accuracy。建议同时看：

| 指标 | 看什么 |
| --- | --- |
| Effective dimension | 表示是否更均衡 |
| Mean abs offdiag correlation | 平均通道冗余是否下降 |
| Max abs offdiag correlation | 最强相关是否被压制 |
| PC1 explained variance | 是否仍被单一主轴支配 |
| PC1+PC2 explained variance | 前几个方向是否支配 |
| Total variance / activity norm | 是否过度压缩活动 |
| Linear accuracy | 任务信息是否保留 |
| KC accuracy | 下游稀疏扩展是否受益 |
| KC sparsity | 阈值后活动是否太稀或太密 |

参数扫描建议：

```text
固定输入统计
扫描 K:    1, 5, 10, 20, 50
扫描 rho:  0.1, 0.3, 1, 3, 10
记录 ED / correlation / PC explained / accuracy
```

你想看到的不是单一指标最大，而是 trade-off：

```text
ED 上升
correlation 下降
PC1 不支配
activity scale 不崩
accuracy 不明显下降
```

---

## 16. 可以写进论文的中文表述

### 简洁版

LC 预处理网络通过 lateral circuit 学习并抑制 ORN 表示中的主导相关方向，从而降低通道间冗余、压平协方差谱并提高 effective dimension。该过程更准确地说是受生物电路约束的部分去相关或部分谱均衡，而不是严格的 PCA whitening。

### 深入版

从 similarity matching 的角度看，网络试图在保留输入样本相似性结构的同时，通过局部 Hebbian / anti-Hebbian 学习规则实现一种自适应预处理。Lateral population 捕捉输入中的高方差共享结构，并通过反馈项对输出活动进行抑制，因此主导谱方向被非线性压缩，输出表示的 effective dimension 上升、off-diagonal correlation 下降。由于该压缩受到 lateral units 数量、反馈强度、动力学尺度和输入统计的限制，LC 的结果通常表现为 partial decorrelation，而非 exact PCA whitening。

### 谨慎解释分类结果

虽然 LC 改善了表示的谱均衡和去相关指标，但这不必然带来分类准确率提升。若当前任务标签已经在 ORN 原始表示中线性可分，或者标签信息本身依赖某些高方差方向，强去相关可能不会提高、甚至可能降低下游读出性能。因此，应将 LC 的主要作用解释为提高编码效率和降低冗余，其行为学或分类收益依赖具体 odor statistics、噪声结构和下游读出机制。

---

## 17. 可以写进英文论文的表述

### Short version

The LC preprocessing network reduces redundancy in the ORN representation by suppressing dominant shared directions through a biologically constrained lateral circuit. Its effect should be interpreted as partial decorrelation or partial spectral equalization rather than exact PCA whitening.

### Mechanistic version

Under a similarity-matching framework, the circuit preserves the pairwise geometry of odor samples while introducing local Hebbian and anti-Hebbian learning rules. The lateral population learns dominant correlation structure in the output activity and feeds back inhibition along these shared directions. As a result, leading spectral components are nonlinearly compressed, increasing the effective dimensionality and reducing off-diagonal feature correlations.

### Accuracy caveat

Improved decorrelation does not necessarily imply improved classification accuracy. If the task-relevant labels are already linearly accessible in the ORN representation, or if they are aligned with high-variance input directions, spectral flattening may not improve downstream readout performance. The computational benefit of LC preprocessing is therefore task- and regime-dependent.

---

## 18. 复习时必须分清的几个问题

### Q1. Similarity matching 保留什么？

保留样本之间的相似性结构：

```text
X.T X ≈ Y.T Y
```

不是要求：

```text
Y = X
```

### Q2. 去相关来自哪里？

来自 lateral population 学到主导相关方向，并通过 feedback 抑制输出中的这些方向。

### Q3. 为什么不是 PCA whitening？

因为 LC 不显式计算完整 PCA 旋转和 `1/sqrt(lambda_i)` 缩放。它做的是受 `K/rho/gamma` 和学习动态限制的非线性谱压缩。

### Q4. `K` 是什么？

`K` 是 lateral units 数量，控制网络可直接作用的主方向数量，但 `K` 不等于 effective dimension。

### Q5. `rho` 是什么？

`rho` 是谱压缩强度。增大 `rho` 通常会增强去相关，但过大可能损失任务相关方差，且不等于 exact whitening。

### Q6. 为什么 ED 上升是好事？

ED 上升说明方差不再集中在少数方向，更多维度参与编码，表示更均衡。

### Q7. 为什么 accuracy 可能不升？

因为分类性能取决于标签和读出。如果标签信息原本就在高方差方向上，去相关可能压掉有用信号。

---

## 19. 最短记忆版

LC 预处理网络可以看成 similarity matching 原理下导出的生物可实现去相关电路。它通过 Hebbian-like 的 `W` 学习输出与 lateral feature 的相关性，通过 anti-Hebbian-like 的 `M` 形成 lateral competition。高方差共享方向更容易被 lateral population 捕捉，随后被 feedback 抑制，因此输出谱被压平、通道相关性下降、effective dimension 上升。`K` 控制可处理的方向数量，`rho` 控制谱压缩强度，`gamma` 影响 y-z 耦合尺度。LC 的作用是 partial decorrelation / partial spectral equalization，不是 exact PCA whitening；去相关改善表示效率，但是否提高分类准确率取决于任务标签、输入统计、噪声和下游 KC 读出。

---

## 20. 参考文献

- Chapochnikov, N., Pehlevan, C., and Chklovskii, D. B. (2023). Normative and mechanistic model of an adaptive circuit for efficient encoding and feature extraction. PNAS.
- Pehlevan, C., Sengupta, A. M., and Chklovskii, D. B. (2018). Why Do Similarity Matching Objectives Lead to Hebbian/Anti-Hebbian Networks? Neural Computation.

