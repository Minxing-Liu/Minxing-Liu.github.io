---
title: 最优突触连接数：模型与公式推导
date: '2026-10-09'
updated: '2026-10-10'
permalink: notes/optimal-degrees-synaptic-connectivity/
description: Litwin-Kumar 等（2017）阅读笔记：随机连接、表征维度、全局抑制、突触资源约束、Hebbian 分类器的信噪比与输入连接学习。
categories:
- 研究笔记
tags:
- 计算神经科学
- 论文阅读
- 表征维度
- 随机连接
katex: true
comments: false
disableNunjucks: true
---

本文整理 Litwin-Kumar 等在 *Optimal Degrees of Synaptic Connectivity*（2017）中的模型设定与主要推导，按正文的论证顺序展开：输入组合与表征维度、全局抑制、固定突触预算、权重异质性、空间连接、Hebbian 分类，最后讨论输入连接的学习。相应的 STAR Methods 推导放在各节中。

文中的 Eq. 编号沿用原论文；中间推导不另占原文编号。涉及近似时明确标注条件。对原文 Eq. (37)、Eq. (42) 的代数核对集中列于附录，与原式区分。

<!-- more -->

## 1. 模型与记号

### 1.1 网络结构

网络由输入层、混合层和读出层组成。输入层活动为 $\mathbf s\in\mathbb R^N$，混合层接收的电流及其二值输出分别为

$$
\mathbf h=J\mathbf s,\qquad
\mathbf m=\Theta(\mathbf h-\boldsymbol\theta)\in\{0,1\}^M.
$$

$J\in\mathbb R^{M\times N}$ 为输入层到混合层的有效权重矩阵，$\Theta$ 逐元素作用。引入分类任务后，一个读出神经元接收全部 $M$ 个混合层输出。

| 记号 | 定义 |
|---|---|
| $N$ | 输入通道数 |
| $M$ | 混合层神经元数 |
| $K$ | 每个混合层神经元接收的直接兴奋性输入数 |
| $M/N$ | 扩张比 |
| $f$ | 单个混合层神经元跨输入模式的激活概率，即编码水平 |
| $S=MK$ | 输入层到混合层的兴奋性连接总数 |
| $P$ | 分类器学习的模式数 |
| $\mu,\nu$ | 输入模式编号，不是类别标签 |
| $v^\mu\in\{-1,+1\}$ | 模式 $\mu$ 的类别标签 |

连接稀疏程度由 $K/N$ 描述，活动稀疏程度由 $f$ 描述，两者是不同的参数。资源约束中的 $S$ 不包含抑制通路和读出层的连接。

### 1.2 随机连接与输入分布

每个混合层神经元 $i$ 从 $N$ 个输入中均匀随机选择一个大小为 $K$ 的子集 $\mathcal S_i$。同一神经元的选择不放回，不同神经元独立选择，允许子集重合。定义

$$
A_{ik}=\mathbf 1_{\{k\in\mathcal S_i\}},\qquad
\sum_{k=1}^{N}A_{ik}=K.
$$

因此，同一行的连接指示变量并非相互独立。

等权重模型取 $J^+_{ik}=A_{ik}$。异质权重模型在选中的位置独立抽取兴奋性强度 $w$，即 $J^+_{ik}=A_{ik}w_{ik}$。无抑制时 $J=J^+$；均匀全局抑制对应

$$
J_{ik}=J^+_{ik}-a,\qquad
h_i=\sum_kJ^+_{ik}s_k-a\sum_ks_k.
$$

这里的负偏移表示共同的抑制通路，并不意味着每个神经元新增了 $N$ 条直接兴奋性连接。

基本的阈值输出维度分析采用

$$
s_k^\mu\overset{\mathrm{iid}}{\sim}\mathcal N(0,1).
$$

对线性电流维度的推导，只需 $\operatorname{Cov}(\mathbf s)=I_N$，不必要求输入为高斯。高斯假设用于后续阈值输出的联合激活概率计算。全文的输入分布并非始终相同：Fig. 6 还比较二值输入，Fig. 4C 使用改变编码水平的截断高斯输入，Fig. 7A 使用通道方差不同的高斯输入。

### 1.3 平均的对象

计算协方差时，先固定具体的网络 $J$，再对输入分布取平均。计算协方差矩阵元素的群体统计时，平均对象是神经元或不同神经元对。论文报告的结果还对随机网络结构取平均。

这三种平均需要区分。尤其是

$$
\mathbb E_J\!\left[
\frac{(\operatorname{Tr}C_J)^2}{\operatorname{Tr}(C_J^2)}
\right]
\ne
\frac{(\operatorname{Tr}\mathbb E_J[C_J])^2}
{\operatorname{Tr}\bigl((\mathbb E_J[C_J])^2\bigr)}
$$

一般不成立为等式。后文用连接分布的理论矩代替有限网络的群体统计时，属于统计近似。

## 2. 输入组合与有效维度

### 2.1 不同输入组合的数量

一个神经元可选择的输入子集共有

$$
R=\binom NK.
$$

在 $M\le R$ 时，$M$ 个神经元选择的子集两两不同的概率为

$$
p=\prod_{\ell=0}^{M-1}\left(1-\frac{\ell}{R}\right)
=\frac{R!}{(R-M)!R^M}.
\tag{7}
$$

$M>R$ 时该概率为零。原文将达到最大概率至少 $95\%$ 的最小 $K$ 记为 $K^*$。在果蝇参数 $N=50,M=2000$ 下得到 $K^*=7$；在小脑参数 $N=7000,M=209000$ 下得到 $K^*=4$。

子集不同只要求至少一个输入通道不同，不要求两个子集互不重叠。因此，组合计数没有消除共享输入导致的响应相关性。

### 2.2 维度定义

对响应向量 $\mathbf x$，定义固定网络下的协方差矩阵

$$
C=\mathbb E_{\mathbf s}\!
\left[(\mathbf x-\mathbb E_{\mathbf s}\mathbf x)
(\mathbf x-\mathbb E_{\mathbf s}\mathbf x)^T\right].
$$

若其特征值为 $\lambda_1,\ldots,\lambda_M$，原文采用的有效维度为

$$
\boxed{
D(\mathbf x):=\dim(\mathbf x)
=\frac{\left(\sum_i\lambda_i\right)^2}{\sum_i\lambda_i^2}
=\frac{(\operatorname{Tr}C)^2}{\operatorname{Tr}(C^2)}.
}
\tag{1}
$$

因为 $C$ 对称，$\operatorname{Tr}(C^2)=\sum_{i,j}C_{ij}^2$，所以

$$
D(\mathbf x)
=\frac{\left(\sum_i C_{ii}\right)^2}
{\sum_iC_{ii}^2+\sum_{i\ne j}C_{ij}^2}.
$$

该量描述总方差在不同方向上的分布程度，不等于非零特征值的数量。对非零协方差矩阵，

$$
1\le D(\mathbf x)\le\operatorname{rank}(C)\le M.
$$

若 $d$ 个非零特征值全部相等，则 $D=d$；例如特征值为 $(9,1,0)$ 时，矩阵秩为 $2$，但 $D=100/82\approx1.22$。

### 2.3 用矩阵元素的统计计算维度

令 $\langle\cdot\rangle_{\mathrm{diag}}$ 表示对 $M$ 个对角元平均，$\langle\cdot\rangle_{\mathrm{pair}}$ 表示对 $M(M-1)$ 个有序非对角元平均。对一个固定网络，严格有

$$
\boxed{
D(\mathbf x)
=\frac{M\langle C_{ii}\rangle_{\mathrm{diag}}^2}
{\langle C_{ii}^2\rangle_{\mathrm{diag}}
+(M-1)\langle C_{ij}^2\rangle_{\mathrm{pair}}}.
}
$$

这对应原文 Eqs. (9)、(22) 的结构。再利用 $\langle X^2\rangle=\langle X\rangle^2+\operatorname{Var}(X)$，即可用对角元、非对角元各自的均值和方差计算维度。

## 3. 等权重、无抑制的电流维度

本节固定 $\operatorname{Cov}(\mathbf s)=I_N$、$J=A$，只研究 $\mathbf h=J\mathbf s$，暂不经过阈值。

### 3.1 电流协方差

固定 $J$ 后，协方差的双线性给出

$$
\begin{aligned}
C^h_{ij}
&=\operatorname{Cov}_{\mathbf s}\left(\sum_kJ_{ik}s_k,\sum_\ell J_{j\ell}s_\ell\right)\\
&=\sum_{k,\ell}J_{ik}J_{j\ell}\operatorname{Cov}(s_k,s_\ell)\\
&=\sum_kJ_{ik}J_{jk}.
\end{aligned}
$$

最后一步使用 $\operatorname{Cov}(s_k,s_\ell)=\delta_{k\ell}$。因此

$$
C^h=JJ^T,\qquad C^h_{ii}=K,\qquad C^h_{ij}=n_{ij}^{++}\quad(i\ne j),
$$

其中

$$
n_{ij}^{++}:=|\mathcal S_i\cap\mathcal S_j|
=\sum_kA_{ik}A_{jk}
$$

为两个神经元共享的兴奋性输入通道数。以下在不引起混淆时将其简写为 $n$。

代入维度定义，得到对具体网络成立的表达式

$$
D(\mathbf h\mid J)
=\frac{M^2K^2}{MK^2+\sum_{i\ne j}(n_{ij}^{++})^2}.
$$

### 3.2 共享输入数的统计

固定第一个神经元的输入子集后，第二个神经元均匀随机选择 $K$ 个输入，因此

$$
\Pr(n)=\frac{\binom Kn\binom{N-K}{K-n}}{\binom NK},
\qquad
\max(0,2K-N)\le n\le K.
$$

即 $n\sim\operatorname{Hypergeom}(N,K,K)$。其均值与方差为

$$
\mathbb E[n]=\frac{K^2}{N},\qquad
\operatorname{Var}(n)=\frac{K^2}{N}
\left(1-\frac KN\right)\frac{N-K}{N-1}.
$$

利用 $n^2=n+n(n-1)$，也可直接得到所需的二阶矩：

$$
\mathbb E[n(n-1)]
=K(K-1)\frac{K(K-1)}{N(N-1)},
$$

$$
\boxed{
\mathbb E[n^2]
=\frac{K^2}{N}+\frac{K^2(K-1)^2}{N(N-1)}.
}
$$

### 3.3 代入并取大网络近似

用理论二阶矩近似网络内的神经元对平均，

$$
\sum_{i\ne j}(n_{ij}^{++})^2
\approx M(M-1)\mathbb E[n^2].
$$

于是

$$
D(\mathbf h)\approx
\left\{
\frac1M+\frac{M-1}{M}
\left[\frac1N+\frac{(K-1)^2}{N(N-1)}\right]
\right\}^{-1}.
$$

在原文采用的大网络条件下，以 $(M-1)/M\approx1$、$N-1\approx N$ 化简，得到

$$
\boxed{
D(\mathbf h)\approx
\frac{1}{1/M+1/N+(K-1)^2/N^2}
=\frac{N}{1+N/M+(K-1)^2/N}.
}
\tag{2}
$$

Methods Eq. (25) 将近似条件写为 $M,N\gg K$。该结果不是每个有限随机网络的严格恒等式。

固定网络时，电流相关系数为 $\rho^h_{ij}=n_{ij}^{++}/K$；再对随机连接平均，得到 $\mathbb E_J[\rho^h_{ij}]=K/N$。增大 $K$ 会增加共享输入造成的相关性，从而降低该模型的线性电流维度。线性映射还满足 $D(\mathbf h)\le N$。

## 4. 阈值输出维度与相关性计算

### 4.1 从二值响应推导 Eq. (3)

令 $m_i=\Theta(h_i-\theta_i)$，并为每个神经元选择阈值，使 $\Pr_{\mathbf s}(m_i=1)=f$，其中 $0<f<1$。该条件针对输入分布，不要求有限训练集内每个神经元恰好激活 $Pf$ 次。

由于 $m_i^2=m_i$，输出协方差满足

$$
C^m_{ii}=f(1-f),\qquad
C^m_{ij}=f(1-f)\rho^m_{ij}\quad(i\ne j).
$$

代入维度定义并约去 $f^2(1-f)^2$：

$$
D(\mathbf m)
=\frac{M^2}{M+\sum_{i\ne j}(\rho^m_{ij})^2}
=\frac{1}{1/M+(1-1/M)\langle(\rho^m_{ij})^2\rangle_{\mathrm{pair}}}.
$$

再取大 $M$ 近似，得到

$$
\boxed{
D(\mathbf m)\approx
\frac{1}{1/M+\langle\rho^m_{ij}\rangle_{\mathrm{pair}}^2
+\operatorname{Var}_{\mathrm{pair}}(\rho^m_{ij})}.
}
\tag{3}
$$

Eq. (3) 尚未给出具体的相关系数。$K$、$f$、权重分布和抑制方式均通过 $\rho^m_{ij}$ 的统计影响维度。显式的 $f(1-f)$ 被约去，并不意味着维度与 $f$ 无关。

在统一编码水平的条件下，有无抑制均使用这一结构；改变抑制后，需要重新计算相关性。若各神经元的编码水平不同，则应回到一般协方差表达式。

### 4.2 高斯输入下的联合激活概率

固定两行权重 $J_i,J_j$，定义

$$
\sigma_i^2=\sum_kJ_{ik}^2,\qquad
\sigma_j^2=\sum_kJ_{jk}^2,\qquad
c_{ij}=\sum_kJ_{ik}J_{jk}.
$$

对于标准高斯输入，$(h_i,h_j)$ 是由这三个量确定的二元高斯变量。这里 $c_{ij}$ 是协方差，标准化后的电流相关系数为

$$
r_{ij}=\frac{c_{ij}}{\sigma_i\sigma_j}.
$$

设 $\Phi$ 为标准正态分布函数，$\phi$ 为其密度，$t_f=\Phi^{-1}(1-f)$。取 $\theta_i=\sigma_i t_f$。当 $|r|<1$ 时，联合激活概率可写为

$$
p_{11}(r)
=\int_{t_f}^{\infty}\phi(z)
\left[1-\Phi\left(\frac{t_f-rz}{\sqrt{1-r^2}}\right)\right]\,\mathrm dz.
$$

该积分可由条件分布直接得到。取独立标准正态变量 $Z,\varepsilon$，写成

$$
h_i=\sigma_i Z,\qquad
h_j=\sigma_j\left(rZ+\sqrt{1-r^2}\,\varepsilon\right).
$$

在 $Z=z$ 条件下，第一神经元激活要求 $z>t_f$，第二神经元激活的条件概率即被积式中的正态尾概率。再对 $z$ 积分，得到联合激活概率。

原文 Eq. (43) 使用共同高斯变量的另一种分解。定义

$$
\eta_i=\sqrt{|c_{ij}|\,\sigma_i/\sigma_j},\qquad
\eta_j=\operatorname{sign}(c_{ij})\sqrt{|c_{ij}|\,\sigma_j/\sigma_i},
$$

并令 $h_i=\sqrt{\sigma_i^2-\eta_i^2}\,\varepsilon_i+\eta_i Z$，$h_j$ 同理，其中三个标准正态变量独立。该构造满足 $\operatorname{Cov}(h_i,h_j)=\eta_i\eta_j=c_{ij}$。给定 $Z$ 后，两神经元条件独立，因此

$$
p_{11}=\frac14\int_{-\infty}^{\infty}\phi(z)
\operatorname{erfc}\!\left(\frac{\theta_i-\eta_i z}{\sqrt{2(\sigma_i^2-\eta_i^2)}}\right)
\operatorname{erfc}\!\left(\frac{\theta_j-\eta_j z}{\sqrt{2(\sigma_j^2-\eta_j^2)}}\right)\,\mathrm dz.
\tag{43}
$$

这与上面的条件高斯积分等价，也保留了负协方差的符号。由此得到

$$
\rho^m_{ij}=\frac{p_{11}(r_{ij})-f^2}{f(1-f)}.
$$

退化边界可单独处理：$p_{11}(1)=f$，$p_{11}(-1)=\max(2f-1,0)$。

### 4.3 Fig. 2–4 的维度计算方法

对于等权重连接，共享输入数 $n$ 决定电流相关系数：

$$
r(n)=
\begin{cases}
n/K,&\text{无抑制},\\
\dfrac{n-K^2/N}{K(1-K/N)},&\text{平衡均匀抑制},\quad 0<K<N.
\end{cases}
$$

先对各个 $n$ 计算 $p_{11}(r(n))$ 和 $\rho^m(n)$，再按超几何概率加权：

$$
q(K):=\mathbb E[(\rho^m)^2]
=\sum_n\Pr(n)\left[\frac{p_{11}(r(n))-f^2}{f(1-f)}\right]^2.
$$

用该理论矩代替有限网络的神经元对平均后，

$$
D(\mathbf m;K)\approx
\frac{1}{1/M+(1-1/M)q(K)}.
$$

| 情形 | 计算方法 | 原文位置 |
|---|---|---|
| 等权重、高斯输入，Fig. 2、3 | 超几何分布确定共享数；高斯积分计算输出相关性；加权求和得到维度 | Methods e6–e7，Eq. (43) 及 Homogeneous Weights |
| 异质权重、高斯输入，Fig. 4 的维度曲线 | 随机生成权重行，求电流方差和协方差，再计算高斯积分，用抽样估计协方差统计 | Methods e7，Heterogeneous Weights |
| 非高斯输入 | 直接模拟响应并计算维度 | Methods e6，小节首段 |

因此，Fig. 2、3 的方法是解析分布与数值积分、求和相结合；Fig. 4 的异质权重计算还包含对连接权重的抽样。Eq. (3) 本身不足以给出这些曲线。

## 5. 等权重与均匀全局抑制

取 $J_{ik}=A_{ik}-a$。输入统计保持不变，仍有 $C^h=JJ^T$。

### 5.1 协方差的均值与方差

对角元为

$$
C^h_{ii}=K(1-a)^2+(N-K)a^2=K-2Ka+Na^2.
$$

所有对角元相同，因此它们在神经元群体中的方差为零。对 $i\ne j$，

$$
\begin{aligned}
C^h_{ij}
&=\sum_k(A_{ik}-a)(A_{jk}-a)\\
&=n_{ij}^{++}-2Ka+Na^2.
\end{aligned}
$$

由共享输入数的统计，得到原文 Eq. (27)：

$$
\begin{aligned}
\mathbb E_J[C^h_{ij}]&=\frac{K^2}{N}-2Ka+Na^2,\\
\operatorname{Var}_J(C^h_{ij})&=\operatorname{Var}(n)
=\frac{K^2}{N}\left(1-\frac KN\right)\frac{N-K}{N-1}.
\end{aligned}
$$

常数偏移不改变非对角协方差的方差。

### 5.2 平衡抑制与电流维度

取 $a=K/N$，每行的权重和为零。于是

$$
C^h_{ii}=v_h:=K\left(1-\frac KN\right),\qquad
C^h_{ij}=n_{ij}^{++}-\frac{K^2}{N}.
$$

对随机连接平均后，$\mathbb E_J[C^h_{ij}]=0$；但单个神经元对的协方差不必为零。

将理论二阶矩代入维度通式：

$$
D(\mathbf h)\approx
\frac{Mv_h^2}{v_h^2+(M-1)\operatorname{Var}(n)}.
$$

因为

$$
\operatorname{Var}(n)=\frac{K^2(1-K/N)^2}{N-1}
=\frac{v_h^2}{N-1},
$$

在 $0<K<N$ 时约去共同因子，得到

$$
D(\mathbf h)\approx
\frac{M}{1+(M-1)/(N-1)}
\approx\boxed{\frac{1}{1/M+1/N}}.
\tag{29}
$$

最后一步采用大 $M,N$ 近似。平衡抑制消除了平均电流协方差产生的、随 $K$ 增长的限制项，但协方差的波动仍然限制维度。

该结果针对线性电流。阈值变换后，输出的平均相关系数不保证为零，不能直接从 Eq. (3) 中删除 $\langle\rho^m_{ij}\rangle^2$。

### 5.3 扩张引起的维度饱和

固定 $N,K,f$ 时，一对随机连接神经元的理论相关性分布不随 $M$ 改变。因此

$$
D(\mathbf m)\approx\frac{1}{1/M+q(K)}
\longrightarrow\frac1{q(K)}\qquad(M\to\infty).
$$

阈值非线性使输出协方差的有效维度可以超过 $N$；相关性又限制了扩张带来的收益。Fig. 2B 中，每个 $M$ 都选取使相应维度最大的 $K$，所以它展示的是优化后的维度，而非固定 $K$ 的曲线。在相同统计近似下，

$$
D_{\max}(M)\approx\frac{1}{1/M+\min_Kq(K)}.
$$

对于图中的等权重模型与 $f=0.1$，扩张比达到约 $10$–$50$ 后，继续扩张的维度增益已较小。该数值依赖模型参数，不能视为通用阈值。

在 $N=1000,f=0.1$ 的等权重、大扩张情形下，无抑制的输出维度在 $K=9$ 附近最大；平衡抑制下，$K=29$ 已达到最大维度的 $95\%$。这些数值来自输出相关性的计算，不能从电流维度 Eq. (29) 直接推出。

## 6. 固定突触总数下的最优连接数

Fig. 3 固定 $N,S,f$，并随 $K$ 调整 $M=S/K$。优化目标为

$$
K^*=\underset{K}{\operatorname{argmax}}\;
D\left(\mathbf m;N,\frac SK,K,f\right).
$$

将约束代入大 $M$ 表达式：

$$
D(\mathbf m)\approx\frac{1}{K/S+q(K)}.
$$

增大 $K$ 同时改变相关性，并减少可配置的混合层神经元数。最优 $K$ 由逐个计算候选连接数下的维度、再比较最大值得到，不由 $S=MK$ 单独决定。

| 回路参数 | 无抑制的最优 $K$ | 有抑制的最优 $K$ |
|---|---:|---:|
| 果蝇：$N=50,S=14000,f=0.1$ | $4$ | $8$ |
| 小脑：$N=7000,S=8.4\times10^5,f=0.01$ | $4$ | $4$ |

这些数值对应 Fig. 3 的等权重随机模型。小脑参数下最优区域的平均共享输入数很小，因而抑制对该区域维度的影响也很小。

## 7. 异质权重

定义兴奋性权重的矩

$$
\mu_r=\mathbb E[w^r],\qquad
v_w=\mu_2-\mu_1^2.
$$

各非零权重独立抽样，并与连接位置独立。为缩短维度表达式，另记

$$
\gamma=1+\frac1K\left(\frac{\mu_4}{\mu_2^2}-1\right),\qquad
\beta=\left(\frac{\mu_1^2}{\mu_2}\right)^2.
$$

$\gamma,\beta$ 是本笔记采用的缩写。

### 7.1 异质兴奋性权重、无抑制

单个神经元的电流方差是其 $K$ 个权重的平方和，因此

$$
\mathbb E_J[C^h_{ii}]=K\mu_2,\qquad
\operatorname{Var}_J(C^h_{ii})=K(\mu_4-\mu_2^2).
\tag{30}
$$

两个神经元共享 $n$ 个输入时，

$$
C^h_{ij}=\sum_{b=1}^{n}w_{ib}w_{jb}.
$$

对乘积 $Y=w_{ib}w_{jb}$，独立性给出

$$
\mathbb E[Y]=\mu_1^2,\qquad
\operatorname{Var}(Y)=\mu_2^2-\mu_1^4.
$$

利用条件期望与全方差公式，

$$
\begin{aligned}
\mathbb E_J[C^h_{ij}]&=\frac{K^2}{N}\mu_1^2,\\
\operatorname{Var}_J(C^h_{ij})
&=\mathbb E[n](\mu_2^2-\mu_1^4)
+\operatorname{Var}(n)\mu_1^4.
\end{aligned}
$$

进而有

$$
\begin{aligned}
\mathbb E_J[(C^h_{ii})^2]
&=K\mu_4+K(K-1)\mu_2^2,\\
\mathbb E_J[(C^h_{ij})^2]
&=\frac{K^2}{N}\mu_2^2
+\frac{K^2(K-1)^2}{N(N-1)}\mu_1^4.
\end{aligned}
$$

代入维度通式，并在大 $M,N$ 下化简，得到

$$
\boxed{
D(\mathbf h)\approx
\frac{1}{\gamma/M+1/N+\beta(K-1)^2/N^2}.
}
\tag{33}
$$

在 $M\gg N\gg K$、权重分布固定的极限下，忽略有限 $M$ 项，得到正文 Eq. (4)，亦即 Methods Eq. (34)：

$$
\boxed{
D(\mathbf h)\approx
\frac{N}{1+\dfrac{(K-1)^2}{N}
\left(\dfrac{\mathbb E[w]^2}{\mathbb E[w]^2+\operatorname{Var}(w)}\right)^2}.
}
\tag{4}
$$

由于 $\beta\le1$，该大扩张极限下，权重异质性减弱了维度随 $K$ 增大而下降的程度。但有限 $M$ 时还存在 $\gamma/M$ 项，不能据 Eq. (4) 推断任意条件下增大权重异质性都会提高维度。

### 7.2 异质兴奋性权重、均匀抑制

令 $J_{ik}=J^+_{ik}-a$。展开可得原文 Eq. (35)：

$$
\begin{aligned}
\mathbb E_J[C^h_{ii}]&=K\mu_2-2Ka\mu_1+Na^2,\\
\operatorname{Var}_J(C^h_{ii})
&=K\left[\mu_4-\mu_2^2-4a(\mu_3-\mu_1\mu_2)+4a^2v_w\right],\\
\mathbb E_J[C^h_{ij}]&=\frac{K^2}{N}\mu_1^2-2Ka\mu_1+Na^2.
\end{aligned}
$$

取 $a=K\mu_1/N$，则平均非对角协方差为零。这是统计意义上的平衡；由于各神经元的兴奋性权重总和不同，每一行的权重和不必恰好为零。

在 $N\gg K$、权重分布固定时，保留主导项：

$$
\begin{aligned}
\mathbb E_J[C^h_{ii}]&\approx K\mu_2,\\
\operatorname{Var}_J(C^h_{ii})&\approx K(\mu_4-\mu_2^2),\\
\mathbb E_J[C^h_{ij}]&=0,\\
\operatorname{Var}_J(C^h_{ij})&\approx\frac{K^2\mu_2^2}{N}.
\end{aligned}
$$

代入并取大 $M$ 近似，得到

$$
\boxed{
D(\mathbf h)\approx
\frac{1}{\dfrac1M\left[1+\dfrac1K\left(\dfrac{\mu_4}{\mu_2^2}-1\right)\right]+\dfrac1N}
=\frac{1}{\gamma/M+1/N}.
}
\tag{38}
$$

均匀抑制消除了平均协方差项，但各神经元电流方差的不均匀性仍然通过 $\gamma/M$ 限制维度。有限 $K/N$ 下所需的完整非对角方差，在附录 A 中推导。

### 7.3 异质兴奋性权重、异质抑制

抑制神经元对各输入通道采用不同权重 $w_{I,k}$，并向所有混合层神经元提供共同抑制：

$$
h_i=\sum_kJ^+_{ik}s_k-a\sum_kw_{I,k}s_k.
$$

记 $\nu_1=\mathbb E[w_I]$、$\nu_2=\mathbb E[w_I^2]$，并假设兴奋性与抑制通路的权重独立。原文 Eq. (39) 给出平均非对角协方差

$$
\mathbb E_J[C^h_{ij}]
=\frac{K^2}{N}\mu_1^2-2Ka\mu_1\nu_1+Na^2\nu_2.
$$

对 $a$ 求导，得到使该量最小的抑制强度

$$
a^*=\frac{K\mu_1\nu_1}{N\nu_2}.
\tag{40}
$$

代回得到

$$
\boxed{
\mathbb E_J[C^h_{ij}]_{\min}
=\frac{K^2\mu_1^2}{N}\left(1-\frac{\nu_1^2}{\nu_2}\right)
=\frac{K^2\mu_1^2}{N}\frac{\operatorname{Var}(w_I)}{\mathbb E[w_I^2]}.
}
\tag{41}
$$

抑制通路的权重异质性因此留下正的平均电流协方差；只有 $\operatorname{Var}(w_I)=0$ 时，该项才能降为零。这里讨论的是平均协方差，不是所有神经元对均完全不相关。

### 7.4 电流维度公式汇总

下表中的式子均为相应大网络极限下的近似式。阈值输出维度则统一按第 4 节计算，不能直接以电流维度代替。

| 兴奋性权重 | 抑制 | 电流维度近似 | 条件与出处 |
|---|---|---|---|
| 等权重 | 无 | $[1/M+1/N+(K-1)^2/N^2]^{-1}$ | $M,N\gg K$；正文 Eq. (2)，Methods Eq. (25) |
| 等权重 | 均匀 | $[1/M+1/N]^{-1}$ | $a=K/N$，$M,N\gg K$；Eq. (29) |
| 异质 | 无 | $[\gamma/M+1/N+\beta(K-1)^2/N^2]^{-1}$ | 大 $M,N$；Eq. (33) |
| 异质 | 均匀 | $[\gamma/M+1/N]^{-1}$ | $a=K\mu_1/N$，$N\gg K$、大 $M$；Eq. (38) |
| 异质 | 异质 | 由 $C^h=JJ^T$ 及一般维度公式计算 | Eqs. (39)–(42) 未给出单独的简化维度闭式 |

Fig. 4 将这些权重分布代入输出的高斯积分计算。在其固定突触预算的比较中，最优连接数均不超过 $7$；这一结论属于图中给定参数的结果。Fig. 4C 则考察截断高斯输入的编码水平变化，用于比较网络的动态范围，其输入设定不同于维度曲线。

## 8. 空间局域连接与 Fig. 5

上述共享输入数的超几何分布依赖于均匀随机选取输入。原文进一步考察小脑中苔藓纤维与颗粒细胞的空间约束。模型在直径 $250\,\mu\mathrm m$、长度约 $2240\,\mu\mathrm m$ 的圆柱区域内放置颗粒细胞与苔藓纤维膨体；颗粒细胞优先连接与其距离接近 $15\,\mu\mathrm m$ 的膨体，并禁止通过多个膨体重复连接同一条苔藓纤维。

局部连接使邻近颗粒细胞更容易共享多个输入，因此不能继续将全体神经元对的共享数直接替换为均匀随机模型的超几何分布。需要根据空间模型构造 $J$，再由其行间内积计算高斯电流的协方差与阈值输出相关性。

Fig. 5C 随 $K$ 反比调整颗粒细胞密度，以保持输入连接总数不变。在该模型与参数下，局域连接使维度相对随机连接降低约 $50\%$，但维度最大的连接数仍为 $K=4$。维度的绝对值与最优连接数可以对连接结构表现出不同的敏感性。

## 9. Hebbian 读出与分类性能

### 9.1 分类任务和权重

训练集包含 $P$ 个输入模式 $\mathbf s^\mu$，标签 $v^\mu=\pm1$ 独立、等概率分配。训练响应由固定的输入连接计算：

$$
\mathbf m^\mu=\Theta(J\mathbf s^\mu-\boldsymbol\theta).
$$

在此基础上设置 Hebbian 读出权重

$$
\mathbf w=\sum_{\mu=1}^{P}(\mathbf m^\mu-f\mathbf1)v^\mu.
$$

测试使用已学习模式的含噪版本。令其混合层响应为 $\widetilde{\mathbf m}^{\mu}$，则

$$
g^\mu=\mathbf w^T(\widetilde{\mathbf m}^{\mu}-f\mathbf1),\qquad
\widehat v=\operatorname{sign}(g^\mu).
$$

上标 $\mu$ 仅用于标识测试样本的来源，分类器本身只接收响应向量，不获得模式编号或正确标签。

### 9.2 响应扰动及信号均值

定义训练与测试响应之间的平均平方距离

$$
d=\frac1M\mathbb E\left[
\|\mathbf m^\mu-\widetilde{\mathbf m}^{\mu}\|^2\right].
$$

由于响应为 $0$ 或 $1$，$d$ 等于输出状态改变的神经元比例的期望。它描述混合层输出的变化，不是输入噪声强度。

训练和测试响应具有相同编码水平 $f$ 时，

$$
\begin{aligned}
d&=2f-\frac2M\sum_i\mathbb E[m_i^\mu\widetilde m_i^\mu],\\
\mathbb E\left[(\mathbf m^\mu-f\mathbf1)^T
(\widetilde{\mathbf m}^{\mu}-f\mathbf1)\right]
&=M\left[f(1-f)-\frac d2\right].
\end{aligned}
$$

将读出分数乘以正确标签，记 $u^\mu=v^\mu g^\mu$。$u^\mu>0$ 对应正确分类。对随机模式、独立标签及测试扰动取平均，其他模式的干扰项均值为零，得到

$$
A:=\mathbb E[u^\mu]
=M\left[f(1-f)-\frac d2\right].
\tag{10}
$$

归一化扰动定义为

$$
\Delta=\frac{d}{2f(1-f)}.
$$

响应完全相同时 $\Delta=0$；训练、测试响应独立且边缘统计相同时 $\Delta=1$。后一数值是独立响应的参照值，不是任意二值响应对的普遍距离上界。

### 9.3 模式间干扰的方差

设中心化响应为 $\mathbf x^\mu=\mathbf m^\mu-f\mathbf1$，固定网络下的响应协方差为 $C=C^m$。对两个独立输入模式定义重叠

$$
O_{\mu\nu}=(\mathbf x^\mu)^T\mathbf x^\nu,\qquad \mu\ne\nu.
$$

由于模式独立且响应中心化，$\mathbb E[O_{\mu\nu}]=0$。其方差为

$$
\begin{aligned}
\operatorname{Var}(O_{\mu\nu})
&=\sum_{i,j}\mathbb E[x_i^\mu x_j^\mu]
\mathbb E[x_i^\nu x_j^\nu]\\
&=\sum_{i,j}C_{ij}^2
=\operatorname{Tr}(C^2).
\end{aligned}
$$

这与原文 Eq. (12) 的矩阵迹推导等价。再令本模式贡献为 $T=(\mathbf x^\mu)^T\widetilde{\mathbf x}^{\mu}$。测试响应与训练响应具有相同边缘统计，并与其他训练模式独立时，随机标签使不同干扰项之间、干扰项与 $T$ 之间的协方差为零。因此，对模式、标签和扰动取平均，严格有

$$
\operatorname{Var}(u^\mu)=\operatorname{Var}(T)+(P-1)\operatorname{Tr}(C^2).
$$

若训练、测试响应的协方差分别为 $C_{\mathrm{train}}$、$C_{\mathrm{test}}$，干扰方差相应为 $\operatorname{Tr}(C_{\mathrm{train}}C_{\mathrm{test}})$。原文在大 $P$ 下忽略 $\operatorname{Var}(T)$，并以 $P$ 代替 $P-1$，得到

$$
\sigma^2:=\operatorname{Var}(u^\mu)
\approx(P-1)\operatorname{Tr}(C^2)
\approx P\operatorname{Tr}(C^2).
$$

这里的“噪声”是读出分数的统计波动，包含其他已存储模式产生的干扰，不仅指外加的输入扰动。

### 9.4 SNR 与有效维度

原文将信噪比定义为正确标签方向上的均值平方与方差之比：

$$
\mathrm{SNR}
:=\frac{A^2}{\sigma^2}
=\frac{\bigl(\mathbb E[v^\mu g^\mu]\bigr)^2}
{\operatorname{Var}(v^\mu g^\mu)}.
\tag{13}
$$

统一编码水平下 $\operatorname{Tr}C=Mf(1-f)$，且 $A=\operatorname{Tr}C(1-\Delta)$。代入得到

$$
\boxed{
\mathrm{SNR}\approx
\frac{(\operatorname{Tr}C)^2(1-\Delta)^2}
{P\operatorname{Tr}(C^2)}
=\frac{D(\mathbf m)(1-\Delta)^2}{P}.
}
\tag{14}
$$

该式也是正文 Eq. (6)。在读出分数近似高斯且 $A\ge0$ 时，错误率为

$$
P_{\mathrm{error}}\approx
\frac12\operatorname{erfc}\left(\sqrt{\frac{\mathrm{SNR}}2}\right).
$$

因此，在 $P$ 和 $\Delta$ 固定时，提高有效维度可提高 SNR；若维度的增加伴随更大的响应扰动，分类性能未必改善。该关系依赖随机模式、独立标签、统一编码水平和 Hebbian 读出等设定，不是一般分类器的通用公式。

### 9.5 高斯噪声、离散输入与 Fig. 6

对标准高斯输入，可将保持边缘分布不变的测试扰动写成

$$
\widetilde{\mathbf s}=r_s\mathbf s+\sqrt{1-r_s^2}\,\boldsymbol\xi,
\qquad \boldsymbol\xi\sim\mathcal N(0,I),\quad 0\le r_s\le1.
$$

若先加上方差为 $\sigma_\xi^2$ 的独立高斯噪声再归一化，则 $r_s=(1+\sigma_\xi^2)^{-1/2}$。对任意固定非零权重行，

$$
\operatorname{Corr}(J_i\mathbf s,J_i\widetilde{\mathbf s})
=\frac{r_s\|J_i\|^2}{\|J_i\|^2}=r_s.
$$

因此，在训练和测试使用相同编码水平 $f$ 时，两次二值响应的相关系数为

$$
\rho_{\mathrm{repeat}}=\frac{p_{11}(r_s)-f^2}{f(1-f)},\qquad
\Delta=1-\rho_{\mathrm{repeat}}.
$$

它不依赖 $K$，但依赖 $f$ 和输入的重复相关性 $r_s$。所以在 Fig. 6 的高斯情形中，固定 $f$ 后，最大化维度与最大化该 SNR 近似具有相同的 $K$。改变 $f$ 时，维度与扰动必须同时计算；更稀疏的输出并不自动给出更小错误率。

离散输入不满足上述高斯阈值计算。Fig. 6 还采用二值输入与随机翻转噪声，此时 $\Delta$ 随 $K$ 变化，较小的连接数在部分参数范围内具有更小的归一化扰动。很小的 $K$ 还会受可实现编码水平的限制：图中无抑制、输入编码水平 $0.5$ 的情形，$K=1,2,3$ 无法通过确定阈值实现 $0<f\le0.1$，因而未画出这些点。

若噪声来自相互独立的突触释放波动，增加输入数还可通过平均降低扰动，最优 $K$ 会受到不同方向的影响。原文 Fig. S3–S5 分别展示编码水平、离散输入和突触可靠性带来的变化。

## 10. 输入连接的学习与 Fig. 7

前面的分类器只学习混合层到读出的权重 $\mathbf w$，输入矩阵 $J$ 保持随机。Fig. 7 进一步修改输入到混合层的权重，并区分无监督归一化与有监督表征学习。

### 10.1 无监督的输入方差归一化

原文令输入通道 $j$ 的活动服从 $\mathcal N(0,\sigma_j^2)$，其中 $\sigma_j$ 在 $[0.25,1.75]$ 均匀分布。不同通道的方差使混合层输入贡献不均衡。对每条已有连接维护变量

$$
u_{ij}(t)=(1-\alpha)u_{ij}(t-1)+\alpha s_j(t)^2,
\qquad u_{ij}(0)=1,
\tag{15}
$$

其中 $\alpha=0.01$。在输入统计固定时，

$$
\mathbb E[u_{ij}(t)]=(1-\alpha)^t+
\left[1-(1-\alpha)^t\right]\sigma_j^2
\longrightarrow\sigma_j^2.
$$

以 $J_{ij}(t)=u_{ij}(t)^{-1/2}$ 设置已有兴奋性连接的强度，便在方差估计准确时使单个加权输入的方差接近 $1$。有限学习率仍会造成估计波动，不能把这一归一化写成每一步都精确成立。

### 10.2 阈值的稳态调节

阈值随响应更新：

$$
\theta_i(t)=
\begin{cases}
\theta_i(t-1)+\eta,&m_i(t)=1,\\
\theta_i(t-1)-\eta\dfrac{f_t}{1-f_t},&m_i(t)=0,
\end{cases}
\tag{16}
$$

其中 $\eta=0.01$，目标编码水平 $f_t=0.1$。若当前激活概率为 $f_i$，一步更新的期望为

$$
\mathbb E[\theta_i(t)-\theta_i(t-1)]
=\eta\left[f_i-(1-f_i)\frac{f_t}{1-f_t}\right]
=\eta\frac{f_i-f_t}{1-f_t}.
$$

当 $f_i>f_t$ 时阈值平均升高，使激活概率下降；反之亦然。原文进行 $1000$ 次随机输入呈现，随后冻结权重与阈值再评估分类误差。Fig. 7A 中，无监督学习降低了误差，但较小的连接数仍足以获得较好的表现。

### 10.3 有监督的目标表征

为每个输入模式 $\mathbf s^\mu$ 指定混合层目标 $\mathbf t^\mu$，输入权重按 Hebbian 关联构造。原文的矩阵记法为

$$
J=\sum_{\mu=1}^{P}(\mathbf t^\mu-f\mathbf1)(\mathbf s^\mu)^T.
\tag{17}
$$

比较固定入度时，学习作用于相应连接结构上已有的权重。该规则不约束权重符号；原文因此使用允许正负权重的模型，并以高斯随机权重作为比较基准，不能直接沿用全为正的随机权重假设。

第一类目标是编码水平为 $f$ 的随机二值模式。第二类目标同时混合输入和标签：

$$
\mathbf t^\mu=\Theta\!\left(J_0\mathbf s^\mu+\mathbf J_vv^\mu-
\boldsymbol\theta_t\right),
\tag{18}
$$

其中 $(J_0)_{ij}\sim\mathcal N(0,1/N)$，$(J_v)_i\sim\mathcal N(0,100)$，阈值使每个混合层神经元在目标模式集合中的激活比例为 $f$。这里标签用于构造训练目标；测试时仍根据输入计算响应，不向分类器提供正确标签。

Fig. 7B 中，随机目标主要在较大 $K$ 时改善分类，包含输入与标签的目标带来更明显的改善。该图给定设置下，相比归一化随机表征，学习收益主要出现在 $K>10$。

### 10.4 学习后维度与任务性能的关系

Eq. (14) 使用了表示与随机标签之间的独立性。有监督学习使 $J$ 依赖训练模式及其目标，原来的模式间干扰统计不再成立。因此不能把学习后的 $D$ 直接代回随机表征的 SNR 公式来判定分类优劣。

Fig. 7C 对全体随机输入分布测得的维度可以降低，同时 Fig. 7B 中已学习模式的分类误差也降低。前者衡量对任意新输入形成的表征，后者衡量指定任务；两者的平均对象与评价目标不同。

关于加入 KC–KC 递归连接后的模型及其适用条件，另见[KC–KC 递归连接：推导与逻辑核查](/notes/kc-recurrent-connectivity/)。

## 附录 A：Eq. (36)–(38) 的代数核对

以下依据所用 PDF 的印刷公式与本笔记中的模型直接核算，属于笔记中的推导检查，不作为作者发布的勘误。

### A.1 完整协方差与截断求和

在异质兴奋性权重、均匀抑制下，令 $n=n_{ij}^{++}$。原文 $C'_{ij}$ 只对至少有一条兴奋性连接的输入通道求和。

| 输入通道类型 | 数量 | 对完整 $C^h_{ij}$ 的单项贡献 |
|---|---:|---|
| 两个神经元均接收兴奋性连接 | $n$ | $(w_i-a)(w_j-a)$ |
| 仅一个神经元接收兴奋性连接 | $2(K-n)$ | $-a(w-a)$ |
| 两者均不接收兴奋性连接 | $N-2K+n$ | $a^2$ |

这里统计的是协方差求和中的 $N$ 个输入通道，而不是两行矩阵中的 $2N$ 个连接位置。因此

$$
C^h_{ij}=C'_{ij}+(N-2K+n)a^2.
$$

### A.2 条件均值与条件方差

原文 Eq. (36) 对 $C'_{ij}$ 的条件均值和方差为

$$
\mathbb E[C'_{ij}\mid n]
=n(\mu_1-a)^2-2a(K-n)(\mu_1-a),
$$

$$
\operatorname{Var}(C'_{ij}\mid n)
=n\left[2(\mu_1-a)^2v_w+v_w^2\right]
+2a^2(K-n)v_w.
$$

这两式与所定义的截断求和一致。恢复被省略的项后，

$$
\mathbb E[C^h_{ij}\mid n]
=n\mu_1^2-2Ka\mu_1+Na^2.
$$

固定 $n$ 时，被加回的项是常数，故条件方差不变；但对 $n$ 再取方差时，该项随 $n$ 改变，不能忽略。

### A.3 完整非对角方差

全方差公式给出

$$
\begin{aligned}
\operatorname{Var}_J(C^h_{ij})
={}&\mathbb E_n[\operatorname{Var}(C^h_{ij}\mid n)]\\
&+\operatorname{Var}_n(\mathbb E[C^h_{ij}\mid n]).
\end{aligned}
$$

因此完整表达式为

$$
\boxed{
\begin{aligned}
\operatorname{Var}_J(C^h_{ij})
={}&\frac{K^2}{N}\left[2(\mu_1-a)^2v_w+v_w^2\right]\\
&+2a^2\left(K-\frac{K^2}{N}\right)v_w\\
&+\mu_1^4\frac{K^2}{N}
\left(1-\frac KN\right)\frac{N-K}{N-1}.
\end{aligned}
}
$$

原文 Eq. (37) 的末项系数印为 $(\mu_1^2-a^2)^2$，这对应截断量条件均值的方差；完整协方差要求该系数为 $\mu_1^4$。在 $w\equiv1$ 的极限下，完整结果恢复为 $\operatorname{Var}(n)$，与 Eq. (27) 一致。

取 $a=K\mu_1/N$，两种末项系数的差为

$$
\mu_1^4-(\mu_1^2-a^2)^2
=\mu_1^4\left[2(K/N)^2-(K/N)^4\right].
$$

该差异是 $K/N$ 的高阶修正。在 $K/N\ll1$ 下，完整结果的主导项仍为 $K^2\mu_2^2/N$，因此不改变 Eq. (38) 所保留的近似结果。

## 附录 B：Eq. (42) 的代入核对

在异质抑制模型中，对角元的平均值为

$$
\mathbb E_J[C^h_{ii}]
=K\mu_2-2Ka\mu_1\nu_1+Na^2\nu_2.
$$

直接代入 Eq. (40) 的 $a^*=K\mu_1\nu_1/(N\nu_2)$，得到

$$
\boxed{
\mathbb E_J[C^h_{ii}]
=K\mu_2-\frac{K^2\mu_1^2\nu_1^2}{N\nu_2}.
}
$$

所用 PDF 的 Eq. (42) 在第二项中印为 $K$，与上述代入得到的 $K^2$ 不一致。取兴奋性和抑制通路权重均为 $1$ 时，上式恢复为 $K-K^2/N$，与等权重平衡抑制的结果一致。本核对只涉及该局部表达式。

## 原文定位与参考文献

以下 PDF 页码对应包含正文、STAR Methods 及补充图的 28 页文件。

| 内容 | 论文页码 | PDF 页码 |
|---|---|---|
| 维度定义、Eq. (2)、Fig. 2 | 1155–1156 | 4–5 |
| 资源约束、Fig. 3 | 1156–1157 | 5–6 |
| 异质权重、Fig. 4 | 1157–1158 | 6–7 |
| 空间连接、Fig. 5 | 1158–1159 | 7–8 |
| 分类与噪声、Fig. 6 | 1158–1160 | 7–9 |
| 表征学习、Fig. 7 | 1159–1161 | 8–10 |
| 模型及维度通式 | e1 | 14 |
| Hebbian 分类性能，Eqs. (10)–(14) | e2 | 15 |
| 输入权重与阈值学习，Eqs. (15)–(18) | e2–e3 | 15–16 |
| 电流协方差及等权重分析 | e3–e4 | 16–17 |
| 异质权重，Eqs. (30)–(38) | e4–e6 | 17–19 |
| 异质抑制、输出高斯积分，Eqs. (39)–(43) | e6–e7 | 19–20 |
| 空间模型及统计平均顺序 | e7 | 20 |
| 扩张与相关性分布，Fig. S1 | 补充材料 1 | 22 |

Litwin-Kumar, A., Harris, K. D., Axel, R., Sompolinsky, H., & Abbott, L. F. (2017). *Optimal Degrees of Synaptic Connectivity*. **Neuron, 93**(5), 1153–1164.e7. [doi:10.1016/j.neuron.2017.01.030](https://doi.org/10.1016/j.neuron.2017.01.030).
