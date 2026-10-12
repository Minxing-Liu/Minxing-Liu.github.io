---
title: 稀疏与扩张：模型、重叠与分类信噪比
date: '2026-10-10'
updated: '2026-10-10'
permalink: notes/sparseness-expansion-sensory-representations/
description: Babadi 与 Sompolinsky（2014）阅读笔记：从随机与结构化投影出发，推导簇内距离、重叠方差、Hebbian 读出的信号、噪声及分类误差。
categories:
- 研究笔记
tags:
- 计算神经科学
- 论文阅读
- 稀疏编码
- 随机连接
- 信噪比
katex: true
comments: false
disableNunjucks: true
---

本文整理 Babadi 与 Sompolinsky 的 *Sparseness and Expansion in Sensory Representations*（2014）。按正文顺序，先分析随机投影的簇内变化与簇间重叠，再推导 Hebbian 读出的信噪比，最后讨论结构化连接。对话中涉及的条件平均、独立性与样本编号，在相应推导处说明。

论文的主要结论是：扩张可以减轻有限神经元数量带来的分类干扰，但其收益受输入维度限制。随机连接下，稀疏化同时减小簇间干扰、放大相对簇内变化；编码输入簇结构的连接则可以同时改善这两项性质。

文中的 Eq. 编号沿用原论文，中间步骤不另编号。原文解析结果建立在大系统近似上；定义、恒等式与近似结果分别标明。

<!-- more -->

## 1. 模型与任务

### 1.1 输入原型、簇与类别

网络包含输入层、扩展层和一个二分类读出神经元。输入层有 $N_S$ 个单元，扩展层有 $N_C>N_S$ 个单元。

先独立生成 $P$ 个二值输入原型：

$$
\bar{\mathbf S}^{\mu}\in\{0,1\}^{N_S},
\qquad
\bar S_i^\mu\overset{\mathrm{iid}}{\sim}
\operatorname{Bernoulli}\!\left(\frac12\right),
\qquad \mu=1,\ldots,P.
$$

第 $\mu$ 个簇中的样本 $\mathbf S^{\mu,a}$，由原型的每一位以概率 $\Delta S/2$ 独立翻转得到。本文讨论 $0\leq\Delta S\leq1$。因而

$$
\mathbb E\|\mathbf S^{\mu,a}-\bar{\mathbf S}^{\mu}\|_1
=N_S\frac{\Delta S}{2},
$$

也就是

$$
\Delta S
=\frac{\mathbb E\|\mathbf S^{\mu,a}-\bar{\mathbf S}^{\mu}\|_1}{N_S/2}.
$$

分母 $N_S/2$ 是两个独立稠密二值模式的平均 Hamming 距离。$\Delta S$ 既是设定翻转概率的参数，也等于按此基准归一化后的平均簇半径；它不是单个样本实际翻转位数的比例。

不同原型独立生成，没有额外施加等距离或相互排斥的条件。独立生成保证统计上的零中心化相关，并不保证每一对有限长向量严格正交。

每个簇再独立分配一个标签

$$
L^\mu\in\{-1,+1\},\qquad
\Pr(L^\mu=+1)=\Pr(L^\mu=-1)=\frac12.
$$

同簇样本共享标签。训练使用这些簇，测试其新的含噪样本。因此，任务衡量对已学习刺激变化的容忍程度。由于不同簇的标签独立随机，训练数据不能决定一个全新簇的标签。

### 1.2 电流、二值编码与活动比例

定义中心化输入

$$
\bar x_i^\mu=\bar S_i^\mu-\frac12,\qquad
x_i^{\mu,a}=S_i^{\mu,a}-\frac12.
$$

输入到扩展层的权重为 $J\in\mathbb R^{N_C\times N_S}$。扩展单元收到的电流及其输出分别为

$$
h_j=\sum_{i=1}^{N_S}J_{ji}x_i,\qquad
C_j=\Theta(h_j-T)\in\{0,1\}.
$$

$h_j$ 是连续电流，$C_j$ 是二值活动。原型诱导的编码记为 $\bar C_j^\mu$，含噪样本诱导的编码记为 $C_j^{\mu,a}$。

活动比例 $f$ 是预先选定的控制参数，越小表示活动越稀疏。阈值根据电流分布调节，使总体活动比例为 $f$。原文数值方法按所有簇、所有扩展单元的电流设置阈值，并不要求每个有限样本都恰好有 $fN_C$ 个活动单元。

阈值调节与突触学习是不同的操作。随机投影在不同噪声水平下具有相同的边缘电流分布，可使用同一阈值。结构化投影的分布随噪声改变，原文 Eq. (13)–(14) 分别使用原型阈值 $T_0$ 和含噪样本阈值 $T$，详见第 5 节。

### 1.3 记号与平均对象

| 记号 | 含义 |
|---|---|
| $i$、$j$ | 输入单元、扩展单元的编号 |
| $\mu,\nu$ | 簇编号，不是类别 |
| $a$ | 同一簇内的样本编号 |
| $\bar{\mathbf C}^{\mu}$、$\mathbf C^{\mu,a}$ | 原型编码、含噪样本编码 |
| $\Delta C$ | 输出簇的归一化平均半径 |
| $r^{\mu\nu}$ | 两个编码之间的中心化重叠 |
| $Q$ | 重叠波动中，由有限输入维度引起的额外强度 |
| $\alpha_S=P/N_S$、$\alpha_C=P/N_C$ | 每个输入单元、扩展单元对应的簇数 |

后文的期望需要区分三个对象：

- $\mathbb E_J[\cdot\mid\bar{\mathbf x}^{\mu},\bar{\mathbf x}^{\nu}]$：固定输入原型，对随机连接取平均。
- $\mathbb E_{\bar x,\mathrm{noise}}[\cdot\mid J]$：固定连接，对原型和样本扰动取平均。
- 读出统计中的期望：固定被测试簇的编号及正确标签，对其余随机标签、输入、连接和测试扰动取平均。

这些是对随机实验总体的理论平均。训练好一个网络后，其 $J$ 和读出权重不会在每次预测时重新抽取。

## 2. 随机投影与簇内变化

### 2.1 电流的归一化

随机连接模型取

$$
J_{ji}\overset{\mathrm{iid}}{\sim}
\mathcal N\!\left(0,\frac4{N_S}\right).
$$

这里高斯分布的第二个参数表示方差。因为 $x_i=\pm1/2$，固定任意输入向量后，对 $J$ 平均有

$$
\mathbb E_J[h_j\mid\mathbf x]=0,\qquad
\operatorname{Var}_J(h_j\mid\mathbf x)
=\frac4{N_S}\sum_i x_i^2=1.
$$

高斯权重的线性组合仍为高斯，所以此处 $h_j\mid\mathbf x\sim\mathcal N(0,1)$。若固定一组典型权重、改为对输入取平均，则用大 $N_S$ 的中心极限定理得到相应近似。

定义标准高斯密度与上尾概率

$$
\phi(z)=\frac{e^{-z^2/2}}{\sqrt{2\pi}},
\qquad
H(t)=\int_t^\infty\phi(z)\,dz.
$$

维持活动比例 $f$ 的阈值满足

$$
f=H(T).
$$

### 2.2 输入扰动与电流相关系数

暂时省略簇和样本编号。每一位的扰动可以写为

$$
x_i=\xi_i\bar x_i,\qquad
\Pr(\xi_i=-1)=\frac{\Delta S}{2},\qquad
\mathbb E[\xi_i]=1-\Delta S.
$$

由于 $\bar x_i^2=1/4$，

$$
\mathbb E[\bar x_i x_i]
=\mathbb E[\xi_i\bar x_i^2]
=\frac{1-\Delta S}{4}.
$$

对于 $i\ne k$，不同位置的原型和翻转变量相互独立，且输入均值为零，因此

$$
\mathbb E[\bar x_i x_k]=0.
$$

固定 $J$，将原型电流 $\bar h_j$ 与样本电流 $h_j$ 的乘积展开：

$$
\begin{aligned}
\operatorname{Cov}(\bar h_j,h_j\mid J)
&=\mathbb E\!\left[
\sum_iJ_{ji}\bar x_i\sum_kJ_{jk}x_k
\middle|J\right]\\
&=\sum_{i,k}J_{ji}J_{jk}\mathbb E[\bar x_i x_k]\\
&=\frac{1-\Delta S}{4}\sum_iJ_{ji}^2.
\end{aligned}
$$

两种电流的方差均为 $\frac14\sum_iJ_{ji}^2$，所以

$$
\rho:=\operatorname{Corr}(\bar h_j,h_j\mid J)=1-\Delta S.
$$

协方差计算中只留下 $i=k$ 项，依据是不同输入位置的独立性与零均值。该步骤不要求不同扩展神经元的输出独立。

在大 $N_S$ 的联合高斯近似下，可写成

$$
\bar h=z_1,\qquad
h=\rho z_1+\sqrt{1-\rho^2}\,z_2,
\qquad z_1,z_2\overset{\mathrm{iid}}{\sim}\mathcal N(0,1).
$$

### 2.3 输出簇半径的定义

输出簇半径定义为

$$
\boxed{
\Delta C=
\frac{\mathbb E\|\mathbf C^{\mu,a}-\bar{\mathbf C}^{\mu}\|_1}
{2N_Cf(1-f)}.
}
$$

对于独立的两个 $\operatorname{Bernoulli}(f)$ 变量，它们不同的概率为 $2f(1-f)$，因此分母是两个独立稀疏编码的平均距离。

二值变量满足

$$
|C-\bar C|=(C-\bar C)^2.
$$

所以分子也等于平均平方欧氏距离，但并不等于欧氏距离本身。$\Delta C$ 衡量相对于独立编码距离的簇内变化。不同 $f$ 下比较 $\Delta C$，不能直接解释为实际翻转位数的比较。

由于样本和原型的边缘活动概率都为 $f$，

$$
\Pr(\bar C=1,C=0)=\Pr(\bar C=0,C=1).
$$

于是原文 Eq. (11) 为

$$
\Delta C=\frac{\Pr(\bar C=1,C=0)}{f(1-f)}.
\tag{11}
$$

### 2.4 从条件概率得到积分式

给定 $\bar h=h_0$ 后，

$$
h\mid\bar h=h_0
\sim\mathcal N(\rho h_0,1-\rho^2).
$$

原型活动、样本关闭对应 $\bar h>T$ 且 $h<T$。因此

$$
\begin{aligned}
\Pr(\bar C=1,C=0)
&=\int_T^\infty
\phi(h_0)\Pr(h<T\mid\bar h=h_0)\,dh_0\\
&=\int_T^\infty
\phi(h_0)H\!\left(
\frac{\rho h_0-T}{\sqrt{1-\rho^2}}
\right)\,dh_0.
\end{aligned}
$$

代入 $\rho=1-\Delta S$，得到

$$
\boxed{
\Delta C=
\frac1{f(1-f)}
\int_T^\infty\phi(h)
H\!\left(
\frac{(1-\Delta S)h-T}
{\sqrt{\Delta S(2-\Delta S)}}
\right)\,dh.
}
\tag{12}
$$

这是联合高斯描述中的积分结果。$\Delta S=0$ 时取连续极限 $\Delta C=0$；$\Delta S=1$ 时，两次输入独立，得到 $\Delta C=1$。

### 2.5 小噪声、稀疏活动的近似

当 $\Delta S$ 很小，主要是电流靠近阈值的单元改变状态。令 $h=T+u$，在宽度为 $O(\sqrt{\Delta S})$ 的阈值邻域内取 $\phi(h)\simeq\phi(T)$，则

$$
\begin{aligned}
\Pr(\bar C=1,C=0)
&\simeq\phi(T)\int_0^\infty
H\!\left(\frac{u}{\sqrt{2\Delta S}}\right)\,du\\
&=\phi(T)\sqrt{\frac{\Delta S}{\pi}}.
\end{aligned}
$$

这里使用了

$$
\int_0^\infty H(v)\,dv
=\int_0^\infty z\phi(z)\,dz
=\frac1{\sqrt{2\pi}}.
$$

因而

$$
\Delta C\simeq
\frac{\phi(T)}{f(1-f)}
\sqrt{\frac{\Delta S}{\pi}}.
$$

进一步令 $f\ll1$，利用高斯尾部近似

$$
f=H(T)\simeq\frac{\phi(T)}T,\qquad
T^2\simeq2|\log f|,
$$

得到原文的主要近似

$$
\boxed{
\Delta C\simeq
\sqrt{\frac2\pi|\log f|\,\Delta S}.
}
\tag{1}
$$

此式描述小噪声区间，要求 $\Delta S|\log f|\ll1$；不能把它外推到右侧超过 1 的区域。固定非零输入噪声时，继续降低 $f$ 应使用 Eq. (12)。

随机阈值投影会放大归一化簇半径，且稀疏化使这一效应更强。其直接原因是：阈值附近改变状态的单元，相对于较少的活动单元占据了更大比例。

## 3. 随机投影的重叠方差

### 3.1 中心化重叠与独立编码基准

固定两个不同簇 $\mu\ne\nu$，定义

$$
a_j^{\mu\nu}
=(\bar C_j^\mu-f)(\bar C_j^\nu-f),
\qquad
r^{\mu\nu}
=\frac1{N_C}\sum_{j=1}^{N_C}a_j^{\mu\nu}.
$$

$a_j^{\mu\nu}$ 是单个扩展单元对这对模式重叠的贡献。固定模式对后，可简写成 $a_j$，省略上标不代表它与模式无关。

若两组编码的每一位都独立服从 $\operatorname{Bernoulli}(f)$，记 $v=f(1-f)$，则

$$
\mathbb E[a_j]=0,\qquad
\operatorname{Var}(a_j)
=\mathbb E[(\bar C_j^\mu-f)^2]\,
\mathbb E[(\bar C_j^\nu-f)^2]
=v^2.
$$

不同 $j$ 也独立，所以

$$
\operatorname{Var}(r)=\frac{v^2}{N_C}.
$$

这里采用原文 Methods 中的中心化重叠定义。若定义未中心化的共激活比例

$$
O^{\mu\nu}=\frac1{N_C}\sum_j\bar C_j^\mu\bar C_j^\nu,
\qquad
F_\mu=\frac1{N_C}\sum_j\bar C_j^\mu,
$$

则严格关系是

$$
r^{\mu\nu}
=O^{\mu\nu}-fF_\mu-fF_\nu+f^2.
$$

只有当两个模式都恰好满足 $F_\mu=F_\nu=f$ 时，才有 $r=O-f^2$。独立 Bernoulli 编码下，$\operatorname{Var}(O)=f^2(1-f^2)/N_C$，与中心化重叠的方差不同。后续读出使用中心化活动，因此应计算 $r$。

### 3.2 有限输入维度留下的偶然重叠

定义两个输入原型的归一化中心化重叠

$$
q^{\mu\nu}
=\frac4{N_S}
\sum_{i=1}^{N_S}\bar x_i^\mu\bar x_i^\nu.
$$

每个乘积 $4\bar x_i^\mu\bar x_i^\nu$ 独立取 $\pm1$，所以

$$
\mathbb E[q]=0,\qquad
\operatorname{Var}(q)=\frac1{N_S}.
$$

因此，一个具体模式对的 $q$ 通常有 $O(N_S^{-1/2})$ 的大小。输入独立指总体分布的性质，并不把这一次抽样得到的重叠强制设为零。

固定这对原型，对随机权重行平均：

$$
\begin{aligned}
\operatorname{Cov}_J(\bar h_j^\mu,\bar h_j^\nu
\mid\bar{\mathbf x}^{\mu},\bar{\mathbf x}^{\nu})
&=\sum_{i,k}\mathbb E[J_{ji}J_{jk}]
\bar x_i^\mu\bar x_k^\nu\\
&=\frac4{N_S}\sum_i\bar x_i^\mu\bar x_i^\nu\\
&=q.
\end{aligned}
$$

两种电流的方差都是 1，故 $q$ 也是其相关系数。所有扩展单元处理同一对原型，所以都受到同一个 $q$ 的影响。

### 3.3 给定输入重叠后的输出平均

定义

$$
m(q):=\mathbb E_J[a_j\mid q].
$$

由于给定 $q$ 后，两种电流仍各自服从标准高斯，两种输出的活动概率均为 $f$，展开中心化乘积得到

$$
\begin{aligned}
m(q)
&=\mathbb E_J[\bar C_j^\mu\bar C_j^\nu\mid q]
-f\mathbb E_J[\bar C_j^\mu\mid q]
-f\mathbb E_J[\bar C_j^\nu\mid q]+f^2\\
&=\Pr(\bar h_j^\mu>T,\bar h_j^\nu>T\mid q)-f^2.
\end{aligned}
$$

相关系数为 $q$ 的二元标准高斯密度为

$$
p_q(x,y)=
\frac1{2\pi\sqrt{1-q^2}}
\exp\!\left[
-\frac{x^2-2qxy+y^2}{2(1-q^2)}
\right].
$$

对小 $q$ 展开：

$$
p_q(x,y)=\phi(x)\phi(y)\,[1+qxy+O(q^2)].
$$

将其在 $x>T,y>T$ 上积分：

$$
\begin{aligned}
\Pr(\bar h^\mu>T,\bar h^\nu>T\mid q)
&=f^2
+q\left(\int_T^\infty x\phi(x)\,dx\right)^2
+O(q^2)\\
&=f^2+\phi(T)^2q+O(q^2).
\end{aligned}
$$

最后一步使用 $\phi'(x)=-x\phi(x)$。因此

$$
\boxed{m(q)=\phi(T)^2q+O(q^2).}
$$

此式把输入重叠转化为输出重叠的条件平均。

### 3.4 条件独立与非零协方差

固定完整的输入原型对后，$a_j$ 只依赖 $J$ 的第 $j$ 行。不同权重行独立，因此

$$
\mathbb E_J[a_ja_k
\mid\bar{\mathbf x}^{\mu},\bar{\mathbf x}^{\nu}]
=
\mathbb E_J[a_j\mid\bar{\mathbf x}^{\mu},\bar{\mathbf x}^{\nu}]
\mathbb E_J[a_k\mid\bar{\mathbf x}^{\mu},\bar{\mathbf x}^{\nu}],
\qquad j\ne k.
$$

本模型的输入范数固定，且权重为各向同性高斯。给定原型对的两电流联合分布只通过 $q$ 依赖于原型，因此还可简写为

$$
\mathbb E[a_ja_k\mid q]=m(q)^2.
$$

这一简化依赖当前模型，不能仅凭“权重行独立”就推广到任意输入分布。

再对原型平均：

$$
\begin{aligned}
\operatorname{Cov}(a_j,a_k)
&=\mathbb E[a_ja_k]-\mathbb E[a_j]\mathbb E[a_k]\\
&=\mathbb E_q[m(q)^2]
-\bigl(\mathbb E_q[m(q)]\bigr)^2\\
&=\operatorname{Var}_q(m(q)).
\end{aligned}
$$

所以，条件独立并不意味着去掉条件后独立。$q>0$ 时两个条件平均同时偏正，$q<0$ 时同时偏负；两种情况都增加乘积的平均，不会像 $q$ 的一阶平均那样抵消。

由 $m(q)\simeq\phi(T)^2q$，

$$
\boxed{
\operatorname{Cov}(a_j,a_k)
\simeq\frac{\phi(T)^4}{N_S},
\qquad j\ne k.
}
$$

### 3.5 总方差与额外重叠强度

从定义直接展开

$$
\operatorname{Var}(r)
=\frac1{N_C^2}
\left[
\sum_j\operatorname{Var}(a_j)
+\sum_{j\ne k}\operatorname{Cov}(a_j,a_k)
\right].
$$

保留大系统的主导项：

$$
\operatorname{Var}(r)
\simeq\frac{f^2(1-f)^2}{N_C}
+\frac{\phi(T)^4}{N_S}.
$$

定义

$$
\boxed{
Q=\frac{\phi(T)^2}{f(1-f)}
=\frac{e^{-T^2}}{2\pi f(1-f)}.
}
\tag{16}
$$

就得到论文的重叠方差表达式

$$
\boxed{
\operatorname{Var}(r)
\simeq f^2(1-f)^2
\left(\frac1{N_C}+\frac{Q^2}{N_S}\right).
}
\tag{2}
$$

$Q$ 将额外波动相对于单个二值活动的方差归一化。它是比较不同投影机制的无量纲系数，并非另一个随机噪声源，也不是平均神经元相关系数。

两项具有不同来源：$1/N_C$ 是有限扩展层的独立编码基准；$Q^2/N_S$ 来自所有单元共享的有限维输入。增加 $N_C$ 可以减小前者，却不能直接消除后者。

稀疏极限下，$\phi(T)\simeq fT$，因此

$$
Q\simeq fT^2\simeq2f|\log f|.
\tag{3}
$$

随机投影下，降低 $f$ 会减小额外重叠，但第 2 节表明，这同时会增大归一化簇内变化。

### 3.6 有限尺寸与平均值的精度

在当前随机高斯权重模型中，全方差公式给出

$$
\operatorname{Var}(r)
=
\frac{\mathbb E_q[\operatorname{Var}(a_j\mid q)]}{N_C}
+\operatorname{Var}_q(m(q)).
$$

对两个边缘活动概率均为 $f$ 的二值变量，可以直接算得

$$
\operatorname{Var}(a_j\mid q)
=f^2(1-f)^2+(1-2f)^2m(q)-m(q)^2.
$$

在 $q=0$ 时，它退化为独立编码结果。对一般 $q$，不能始终把单元方差精确写成 $f^2(1-f)^2$。

此外，$\mathbb E[q]=0$ 只消除了 $m(q)$ 的线性项。有限 $N_S$ 下，高阶项通常使 $\mathbb E[r]$ 有 $O(N_S^{-1})$ 修正。Eq. (2) 保留的是 $1/N_C$ 和 $1/N_S$ 的主导方差；省略了更高阶以及混合的有限尺寸修正。

### 3.7 谱中的表现

将所有中心化原型编码组成矩阵 $\bar Z_{j\mu}=\bar C_j^\mu-f$，模式重叠矩阵为

$$
R_{\mathrm{pat}}=\frac1{N_C}\bar Z^\top\bar Z.
$$

Fig. 3D 比较它与独立随机编码的谱。共享的低维输入使部分较大特征值增强；当 $P/N_S$ 足够大时，前约 $N_S$ 个模式可与其余谱分离。降低 $f$ 后，$Q$ 减小，谱更接近独立编码基准。

这表示输入维度仍影响输出相关结构，不意味着经过非线性阈值后的整个表示严格只有 $N_S$ 维。

## 4. Hebbian 读出与 SNR

### 4.1 权重的训练与预测

原型训练条件下，读出权重为

$$
\boxed{
W_j=\sum_{\mu=1}^{P}(\bar C_j^\mu-f)L^\mu.
}
\tag{4}
$$

每个训练样本贡献一次“中心化活动乘以标签”的更新。将这些更新累加，就得到上述闭式表达式。它是一种监督学习规则，只是不需要通过梯度下降反复优化。训练完成后，$\mathbf W$ 在测试期间固定。

分类器对任意输入编码使用同一个函数

$$
g(\mathbf C)=\sum_jW_j(C_j-f),
\qquad
\hat L(\mathbf C)=\operatorname{sign}g(\mathbf C).
$$

写成 $g(\mathbf C^{\nu,a})$，仅表示研究者正在分析来自第 $\nu$ 个簇的第 $a$ 个样本。分类器只接收 $\mathbf C$，不接收 $\nu$ 或正确标签 $L^\nu$。

### 4.2 SNR 的定义

为了统一正负两类，研究者在评估时定义带符号分数

$$
u^{\nu,a}=L^\nu g(\mathbf C^{\nu,a}).
$$

$u>0$ 表示分类正确，$u<0$ 表示分类错误。固定 $\nu$ 及 $L^\nu$，定义

$$
A:=\mathbb E[u^{\nu,a}\mid L^\nu],
\qquad
\sigma_g^2:=
\mathbb E[(u^{\nu,a}-A)^2\mid L^\nu].
$$

各簇的生成方式相同，故总体统计不依赖具体编号，可以省略上标。本文的信噪比为

$$
\boxed{\mathrm{SNR}:=\frac{A^2}{\sigma_g^2}.}
$$

$A$ 是分数向正确方向偏离零边界的平均大小，$\sigma_g$ 是分数围绕该平均值的标准差。这里的“噪声”包括随机串扰导致的分数波动，不仅指生成输入样本时加入的翻转噪声。

在正负类对称的条件下，

$$
\mathbb E[g\mid L=+1]=A,\qquad
\mathbb E[g\mid L=-1]=-A.
$$

两类均值之间的距离是 $2A$。本文采用的是单类均值到零边界的距离 $A$，没有把两类均值差的平方直接当作 SNR 分子。将两类混在一起求 $\mathbb E[g]$，其结果可以为零，不能据此判断分类无信号。

### 4.3 把读出拆成自身匹配与其他簇的贡献

定义测试样本与第 $\mu$ 个训练原型的匹配

$$
B_\mu^{\nu,a}
:=\sum_j(\bar C_j^\mu-f)(C_j^{\nu,a}-f).
$$

将 Hebbian 权重代入读出：

$$
\begin{aligned}
g(\mathbf C^{\nu,a})
&=\sum_j\sum_{\mu=1}^{P}
L^\mu(\bar C_j^\mu-f)(C_j^{\nu,a}-f)\\
&=\sum_{\mu=1}^{P}L^\mu B_\mu^{\nu,a}.
\end{aligned}
$$

乘以正确标签，并分离 $\mu=\nu$：

$$
u^{\nu,a}
=
\underbrace{B_\nu^{\nu,a}}_{\text{自身原型匹配}}
+
\underbrace{\sum_{\mu\ne\nu}L^\nu L^\mu
B_\mu^{\nu,a}}_{\eta^{\nu,a}\text{：其他簇的贡献}}.
$$

标签不参与扩展表示的生成，并且独立、均值为零。因此，即使 $B_\mu^{\nu,a}$ 的均值并非严格为零，也仍有

$$
\mathbb E[\eta^{\nu,a}\mid L^\nu]=0.
$$

这里依靠的是标签与表示的独立性。一般而言，$\mathbb E[X]=0$ 不能单独推出 $\mathbb E[XY]=0$。

### 4.4 平均信号由簇半径决定

对同一簇的原型与测试编码，边缘活动概率均为 $f$。二值恒等式

$$
|\bar C-C|=\bar C+C-2\bar C C
$$

给出

$$
2f(1-f)\Delta C
=2f-2\mathbb E[\bar C C].
$$

于是

$$
\mathbb E[\bar C C]=f-f(1-f)\Delta C,
$$

以及

$$
\begin{aligned}
\mathbb E[(\bar C-f)(C-f)]
&=\mathbb E[\bar C C]-f^2\\
&=f(1-f)(1-\Delta C).
\end{aligned}
$$

对扩展单元求和得到

$$
\boxed{
A=N_Cf(1-f)(1-\Delta C).
}
$$

等价地，原文的条件均值为

$$
\mathbb E[g(\mathbf C^{\nu,a})\mid L^\nu]
=N_Cf(1-f)(1-\Delta C)L^\nu.
\tag{20}
$$

该关系来自二值活动和相同边缘活动概率，无须假设不同扩展单元独立。$\Delta C$ 越小，测试编码与自身原型的平均中心化匹配越强。

### 4.5 读出方差来自重叠的二阶矩

固定正确标签，先对其余随机标签平均。对于 $\mu,\lambda\ne\nu$，

$$
\mathbb E[L^\mu L^\lambda]
=\begin{cases}
1,&\mu=\lambda,\\
0,&\mu\ne\lambda.
\end{cases}
$$

所以

$$
\begin{aligned}
\mathbb E[(\eta^{\nu,a})^2]
&=\sum_{\mu,\lambda\ne\nu}
\mathbb E[L^\mu L^\lambda
B_\mu^{\nu,a}B_\lambda^{\nu,a}]\\
&=\sum_{\mu\ne\nu}
\mathbb E[(B_\mu^{\nu,a})^2].
\end{aligned}
$$

消除交叉项的是随机标签，不必额外假定不同 $B_\mu^{\nu,a}$ 相互独立。自身匹配与 $\eta$ 的协方差也因标签平均而为零，因此完整分解为

$$
\sigma_g^2
=\operatorname{Var}(B_\nu^{\nu,a})
+\sum_{\mu\ne\nu}\mathbb E[(B_\mu^{\nu,a})^2].
$$

自身匹配也有波动。论文的大系统表达式保留大量其他原型累积产生的主导串扰，并用 $P$ 近似 $P-1$。

分类所需的异簇重叠实际是

$$
r_{\mathrm{test}}^{\mu;\nu,a}
=\frac1{N_C}
\sum_j(\bar C_j^\mu-f)(C_j^{\nu,a}-f),
\qquad \mu\ne\nu,
$$

因此 $B_\mu^{\nu,a}=N_Cr_{\mathrm{test}}^{\mu;\nu,a}$。

对于随机 $J$，含噪输入仍是边缘稠密二值模式，且与另一个簇的原型独立；所需重叠统计与第 3 节相同。在主导阶上，其二阶矩可用 Eq. (2) 的方差代替，得到

$$
\begin{aligned}
\sigma_g^2
&\simeq P N_C^2f^2(1-f)^2
\left(\frac1{N_C}+\frac{Q^2}{N_S}\right)\\
&=PN_Cf^2(1-f)^2
+\frac{PN_C^2}{N_S}f^2(1-f)^2Q^2.
\end{aligned}
\tag{21}
$$

结构化连接也使用原型—测试样本重叠，但其 $Q$ 通常依赖输入噪声，不能自动替换为无噪原型间的结果。

### 4.6 信噪比与分类错误率

将 $A$ 和 $\sigma_g^2$ 代入定义，公共尺度 $N_C^2f^2(1-f)^2$ 消去：

$$
\boxed{
\mathrm{SNR}
\simeq
\frac{(1-\Delta C)^2}
{P/N_C+(P/N_S)Q^2}
=\frac{(1-\Delta C)^2}{\alpha_C+\alpha_SQ^2}.
}
\tag{5}
$$

这是由当前模型推导的近似表达式；SNR 的定义本身仍是 $A^2/\sigma_g^2$。

再对读出分数作高斯近似，

$$
u\approx\mathcal N(A,\sigma_g^2),
$$

分类错误对应 $u<0$，从而

$$
\boxed{
\epsilon
\approx H\!\left(\frac A{\sigma_g}\right)
=H\!\left(\sqrt{\mathrm{SNR}}\right).
}
$$

该错误率表达式适用于此处 $A\geq0$ 的情况。它不直接适用于任意分类器，也不是任意有限网络上的精确恒等式。

### 4.7 扩张的饱和与最优活动比例

固定 $N_S,P,f$ 和输入噪声，增加 $N_C$ 会减小 $\alpha_C=P/N_C$。当两种串扰贡献相当，

$$
\frac{P}{N_C}\sim\frac{P}{N_S}Q^2,
$$

得到特征饱和规模

$$
\boxed{N_C^{\mathrm{sat}}\sim\frac{N_S}{Q^2}.}
\tag{6}
$$

它是收益开始明显减弱的尺度，并非超过此点后收益严格为零。在 $Q>0$ 的条件下，

$$
\lim_{N_C\to\infty}\mathrm{SNR}
\simeq\frac{(1-\Delta C)^2}{\alpha_SQ^2}.
$$

随机投影的稀疏化具有两个相反效应：$Q$ 减小使串扰减弱，$\Delta C$ 增大使平均信号减弱。非零输入噪声下，两者形成有限的最优活动比例。原文在相应渐近范围内给出尺度关系

$$
f_{\mathrm{opt}}
\propto
\left(\frac{N_S}{N_C}\right)^{1/2}
(\Delta S)^{1/4}.
\tag{7}
$$

这是省略对数修正及比例常数的尺度关系；具体最优值应由完整的 $\Delta C(f,\Delta S)$ 和 $Q(f)$ 计算。

## 5. 结构化投影

### 5.1 以外积存储输入与目标编码的关联

为每个输入原型独立生成一个稀疏目标编码

$$
R_j^\mu\overset{\mathrm{iid}}{\sim}\operatorname{Bernoulli}(f),
$$

并定义连接

$$
\boxed{
J_{ji}
=\frac1{N_S}\sum_{\mu=1}^{P}
\left(\bar S_i^\mu-\frac12\right)(R_j^\mu-f).
}
\tag{8}
$$

令 $\mathbf y^\mu=\mathbf R^\mu-f\mathbf1$，则

$$
J=\frac1{N_S}\sum_\mu
\mathbf y^\mu(\bar{\mathbf x}^{\mu})^\top.
$$

每个外积存储一对输入与目标表示。呈现原型 $\bar{\mathbf x}^{\mu}$ 后，

$$
J\bar{\mathbf x}^{\mu}
=\frac1{N_S}\sum_\nu
\mathbf y^\nu
(\bar{\mathbf x}^{\nu})^\top\bar{\mathbf x}^{\mu}.
$$

自身内积为 $N_S/4$，其他原型的内积均值为零，所以匹配原型的目标编码产生确定的信号，其余原型产生串扰。

这里能对乘积取零均值，是因为随机目标编码与输入原型独立。仅知道输入内积的均值为零，而不了解另一个因子与它的关系，并不足以作此判断。

这一构造属于线性异关联存储。它利用原型的近似正交性，有限维输入留下的非正交部分形成串扰。

### 5.2 自身信号与串扰的尺度

原文 Eq. (8) 的电流包含整体因子 $1/4$。将电流与阈值同时乘以 4 不改变输出。后续采用这一归一化：

$$
\tilde h_j^\mu:=4\bar h_j^\mu
=(R_j^\mu-f)
+\sum_{\nu\ne\mu}(R_j^\nu-f)q^{\nu\mu}.
$$

定义后面的和为 $\zeta_j^\mu$。对随机目标编码和输入平均，串扰均值为零，方差为

$$
\begin{aligned}
\operatorname{Var}(\zeta_j^\mu)
&=\sum_{\nu\ne\mu}
\mathbb E[(R_j^\nu-f)^2]\,
\mathbb E[(q^{\nu\mu})^2]\\
&=\frac{P-1}{N_S}f(1-f)\\
&\simeq\alpha_Sf(1-f).
\end{aligned}
$$

记

$$
\tau^2:=\alpha_Sf(1-f).
$$

在大系统近似下，

$$
\tilde h_j^\mu\mid R_j^\mu=r
\approx\mathcal N(r-f,\tau^2).
$$

因此总体电流是两个高斯分布的混合：比例 $f$ 的单元均值为 $1-f$，比例 $1-f$ 的单元均值为 $-f$。两个均值相差 1，串扰标准差为 $\tau$。

固定 $\alpha_S$ 时，降低 $f$ 会减小 $\tau$，有利于分开两个电流群体。原型的实际输出 $\bar{\mathbf C}^{\mu}$ 因串扰与阈值化误差，一般不严格等于目标 $\mathbf R^\mu$。

### 5.3 含噪电流与阈值条件

令 $\rho=1-\Delta S$。样本与自身原型的归一化输入重叠集中于 $\rho$。忽略次领先的有限尺寸波动，含噪电流满足

$$
\tilde h_j^{\mu,a}\mid R_j^\mu=r
\approx\mathcal N(\rho(r-f),\tau^2).
$$

原型与样本的串扰协方差为 $\rho\tau^2$。在同一目标组 $R_j^\mu=r$ 内，可表示为

$$
\begin{aligned}
\tilde{\bar h}
&=r-f+\tau z_1,\\
\tilde h
&=\rho(r-f)+\tau
\left(\rho z_1+\sqrt{1-\rho^2}\,z_2\right),
\end{aligned}
$$

其中 $z_1,z_2$ 独立标准高斯。这一表示同时给出

$$
\tilde h\mid\tilde{\bar h}=h
\sim\mathcal N\!\left(\rho h,\tau^2(1-\rho^2)\right).
$$

以下 $T_0,T$ 也采用乘以 4 后的电流单位。为了让含噪编码保持活动比例 $f$，阈值满足

$$
\boxed{
f=(1-f)H\!\left(\frac{T+\rho f}{\tau}\right)
+fH\!\left(\frac{T-\rho(1-f)}{\tau}\right).
}
\tag{14}
$$

令 $\rho=1$ 即得到原型阈值 $T_0$。对于一般 $\Delta S>0$，$T$ 不必等于 $T_0$。

这是一项总体活动比例控制条件，并不需要知道测试样本属于哪个簇。若实际实现中始终固定原型阈值 $T_0$，则含噪样本的活动比例可能变化，必须重新计算对应统计，不能原样使用此处等活动比例的公式。

### 5.4 结构化连接的簇内距离

原型电流的混合密度为

$$
p_0(h)=
\frac f{\tau}\phi\!\left(\frac{h-(1-f)}{\tau}\right)
+\frac{1-f}{\tau}\phi\!\left(\frac{h+f}{\tau}\right).
$$

原型活动要求 $h>T_0$。给定这个电流，含噪样本关闭的条件概率为

$$
H\!\left(
\frac{\rho h-T}{\tau\sqrt{1-\rho^2}}
\right).
$$

与随机连接的推导相同，

$$
\boxed{
\Delta C=
\frac1{f(1-f)}
\int_{T_0}^{\infty}p_0(h)
H\!\left(
\frac{\rho h-T}{\tau\sqrt{1-\rho^2}}
\right)\,dh.
}
\tag{13}
$$

式中 $T_0,T$ 由 Eq. (14) 分别确定。取 $\Delta S=0$ 时，输入完全相同且阈值相同，$\Delta C=0$。

固定 $0<\Delta S<1$，在 $\alpha_Sf$ 足够小的区间，两组电流之间形成明显间隔，阈值落在低概率区域。改变单元状态需要跨越这一间隔，错误概率由高斯尾部控制。原文 Eq. (9) 给出的主导指数尺度为

$$
\log\Delta C
\sim-\frac{(1-\Delta S)^2}{8\alpha_Sf},
\qquad f\to0
$$

（固定 $\alpha_S$ 与 $\Delta S$，省略次领先项）。具体值仍由 Eq. (13)–(14) 计算。该固定噪声渐近不能代替 $\Delta S=0$ 的精确边界。

因此，在稀疏且串扰可控的范围内，结构化连接可使 $\Delta C<\Delta S$，并随 $f$ 减小进一步收缩。若 $\alpha_Sf$ 很大，串扰宽度相对于信号间隔不再小，优势随之减弱。

### 5.5 结构化连接的额外重叠

理想目标 $\mathbf R^\mu$ 彼此独立；实际编码 $\bar{\mathbf C}^\mu$ 仍受同一批输入与关联权重影响，所以其额外重叠一般不为零。

原文 Eq. (18)–(19) 给出无噪原型间的结果。为避免与读出信号 $A$、匹配量 $B_\mu$ 混淆，将原文此处的 $A,B$ 改记为 $\chi,\beta$：

$$
\chi=
\frac{
f\phi\!\left(\frac{T_0-(1-f)}{\tau}\right)
+(1-f)\phi\!\left(\frac{T_0+f}{\tau}\right)
}{\tau},
$$

$$
\beta=
H\!\left(\frac{T_0-(1-f)}{\tau}\right)
-H\!\left(\frac{T_0+f}{\tau}\right).
$$

$\chi$ 是原型电流在阈值处的概率密度，$\beta$ 是两种目标组的实际激活概率之差。原文结果为

$$
\boxed{
Q_0=\chi\sqrt{\alpha_S\chi^2+
(\alpha_S\chi+2\beta)^2}.
}
\tag{18}
$$

此处下标 0 强调 $\Delta S=0$。当两个电流峰充分分离时，$\chi$ 很小，$\beta$ 接近 1，$Q_0$ 随之受到强烈抑制；其稀疏极限具有指数衰减，而随机投影仅有 $Q\simeq2f|\log f|$ 的下降。

带噪分类时应按照原文 Eq. (17)，使用

$$
r_{\mathrm{test}}^{\mu;\nu,a}
=\frac1{N_C}\sum_j
(\bar C_j^\mu-f)(C_j^{\nu,a}-f),
\qquad \mu\ne\nu,
$$

并从其主导方差定义 $Q(\Delta S)$：

$$
\operatorname{Var}(r_{\mathrm{test}})
\simeq f^2(1-f)^2
\left(\frac1{N_C}+\frac{Q(\Delta S)^2}{N_S}\right).
$$

Eq. (18) 不能不加修改地充当任意噪声水平的闭式结果。本文保留这一范围区别，不补写原文未给出的有限噪声闭式。

### 5.6 同一读出下的比较

结构化连接不使用行为标签 $L^\mu$。它利用输入原型及与之配对的目标编码 $R^\mu$；随后，读出依然用实际原型编码 $\bar{\mathbf C}^\mu$ 和标签训练 $W$。

因此，两种连接使用同一个分类任务与 Hebbian 读出，区别主要来自扩展表示。结构化连接的 SNR 仍写成

$$
\mathrm{SNR}
\simeq
\frac{(1-\Delta C)^2}
{\alpha_C+\alpha_SQ(\Delta S)^2}.
$$

在论文强调的稀疏、串扰可控区间，降低 $f$ 可以同时减小 $\Delta C$ 和 $Q$，提高平均信号并降低串扰。其扩张收益仍有饱和尺度，但由于 $Q$ 更小，该尺度可远大于随机连接。

| 比较量 | 随机投影 | 结构化投影 |
|---|---|---|
| 连接中的输入信息 | 不使用训练原型构造 $J$ | 编码原型与稀疏目标的关联 |
| 主要电流分布 | 单峰高斯 | 两组条件高斯的混合 |
| 降低 $f$ 对 $\Delta C$ 的影响 | 相对簇内变化增大 | 串扰可控时减小 |
| 降低 $f$ 对 $Q$ 的影响 | 减小 | 可受到更强的抑制 |
| 分类表现 | 非零噪声下存在稀疏性权衡 | 适当区间内信号与串扰可同时改善 |

这些结论要求活动单元数仍足够多，尤其是 $N_Cf\gg1$。固定有限网络时，不能把 $f\to0$ 理解为无条件提高性能。

## 6. 原文中的补充验证

### 6.1 含噪样本训练与其他读出

正文的主要解析结果使用原型训练。补充材料还令每个簇提供 $N_{\mathrm{learn}}$ 个含噪训练样本：

$$
W_j=\sum_{\mu=1}^{P}
\sum_{\ell=1}^{N_{\mathrm{learn}}}
(C_j^{\mu,\ell}-f)L^\mu.
$$

此时读出信号取决于训练样本与测试样本之间的距离，不能继续只用“测试样本到原型”的 $\Delta C$。

例如，随机投影下，两个样本分别由同一原型以独立翻转噪声生成，噪声参数为 $\Delta S_1,\Delta S_2$。它们的中心化输入相关系数为

$$
\rho_{12}
=\mathbb E[\xi^{(1)}\xi^{(2)}]
=(1-\Delta S_1)(1-\Delta S_2).
$$

将 Eq. (12) 中的 $\rho$ 换成 $\rho_{12}$，便得到两样本之间的 $\Delta C(\Delta S_1,\Delta S_2)$。多次训练样本还会改变读出方差，所以原型训练的 Eq. (5) 不能直接照搬。

原文还比较感知机、伪逆和线性 SVM。它们的绝对错误率及训练过程不同，但补充数值实验在所研究参数下支持两项主要趋势：随机扩张存在有限最优稀疏度，扩张收益受残余相关限制。这些数值趋势不等同于已经为所有读出证明了同一个 SNR 公式。

### 6.2 在线学习与理想结构化连接

Eq. (8) 直接给定原型及目标配对，没有说明如何仅从含噪数据发现原型、分配目标。

补充材料另从随机 $J$ 出发，每次抽取一个含噪输入，计算当前扩展活动，再作在线更新

$$
\Delta J_{ji}
=\eta\left(S_i-\frac12\right)(C_j-f),
$$

随后归一化权重，并调节阈值以维持活动比例。此时用于学习的是网络当前产生的 $C_j$，而不是事先分配的独立 $R_j^\mu$。

Fig. S5 中，这种在线规则产生了部分结构化特征，但重叠抑制没有达到理想配对模型的程度，分类性能通常介于随机连接与理想结构化连接之间。因而不能将两种构造视为同一个算法。

### 6.3 其他输入与任务

原文还用低内在维度输入、非平衡类别标签和自然图像进行补充分析。低维输入保留更强的共同结构，从而限制扩张收益；非平衡标签改变读出统计；自然图像实验展示在线学习形成的感受野。这些实验扩大了检验范围，但不改变正文按“簇内稳定性—异簇干扰—读出性能”组织的主要分析。

## 7. 图与公式的对应

| 原文图 | 主要内容 | 本文对应推导 |
|---|---|---|
| Fig. 1 | 输入簇、扩展层与二分类任务 | 第 1 节 |
| Fig. 2 | 随机投影放大相对簇内变化 | Eq. (11)–(12)、Eq. (1) |
| Fig. 3 | 额外重叠及其谱表现 | Eq. (2)、Eq. (16)、第 3.7 节 |
| Fig. 4 | 随机投影的扩张饱和与最优稀疏度 | Eq. (5)–(7) |
| Fig. 5 | 结构化连接的双峰电流与簇收缩 | Eq. (8)、Eq. (13)–(14) |
| Fig. 6 | 结构化连接压低原型间额外重叠 | Eq. (18) |
| Fig. 7 | 结构化连接的读出性能 | 第 5.6 节 |
| Fig. 8 | 不同簇数、噪声水平与活动比例下的性能比较 | 相应 $\Delta C,Q$ 代入 Eq. (5) |

原文解析计算取 $N_S,N_C,P$ 都较大，$\alpha_S,\alpha_C$ 有限，并要求 $N_Cf\gg1$。数值模拟用典型含噪样本估计簇半径与错误率，分类结果还对随机标签实现进行平均。大系统公式、稀疏渐近式和有限网络实测值应分别理解。

本笔记与[最优突触连接数：模型与公式推导](/notes/optimal-degrees-synaptic-connectivity/)讨论的控制变量不同：这里主要改变活动比例 $f$、扩张规模 $N_C$ 与连接的统计结构；该文进一步研究每个扩展单元的输入连接数及资源约束。活动稀疏与连接稀疏不能混用。

## 参考资料

1. Babadi, B., & Sompolinsky, H. (2014). *Sparseness and Expansion in Sensory Representations*. Neuron, 83, 1213–1226. [DOI: 10.1016/j.neuron.2014.07.035](https://doi.org/10.1016/j.neuron.2014.07.035)。
2. 同文 Supplemental Information，主要使用 Supplemental Experimental Procedures 及 Fig. S1–S6。

推导重点结合个人阅读讨论整理；公式与适用范围以论文正文及补充材料核对。本文没有复现原论文的全部模拟。
