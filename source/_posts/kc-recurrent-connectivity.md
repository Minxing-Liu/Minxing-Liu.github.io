---
title: KC–KC 递归连接：模型推导与逻辑核查
date: '2026-10-10'
updated: '2026-10-10'
permalink: notes/kc-recurrent-connectivity/
description: 从高斯线性响应、二值协方差和读出任务出发，整理 KC–KC 递归连接模型，并核查 APL、结构化抑制及自由概率推导的适用条件。
categories:
- 研究笔记
tags:
- 计算神经科学
- 表征维度
- 递归网络
- 数学推导
katex: true
comments: false
disableNunjucks: true
---

本文整理工作文档 *KC–KC Recurrence in the Litwin-Kumar Framework*（calculation(1).pdf，42 页）。它在 Litwin-Kumar 等（2017）的扩张层模型中加入递归连接，并研究表征维度、噪声和读出性能。前馈模型的设定见[最优突触连接数：模型与公式推导](/notes/optimal-degrees-synaptic-connectivity/)。

核查后的主要判断是：有限矩阵的高斯阈值计算、随机标签 Hebbian 读出的前两阶矩，以及条件协方差分解可以保留；弱递归展开需要保留其近似条件。PDF 后半部分关于结构化抑制和兴奋的维度变化方向，没有由现有推导建立；自由概率部分还有谱半径和尺度条件需要修正。最优连接数与连接组实验属于特定模型的数值结果，不能直接解释为生物回路的最优参数。

下文的“PDF Eq.”及页码均指这份工作文档。公式核查与数值实验复现分开记录：本次材料包含 PDF，未包含其引用的代码、矩阵和 CSV；相关实验数字均标为文档报告值。本次另做的数学检查附有[脚本](/downloads/kc-recurrence-checks.py)和[结果](/downloads/kc-recurrence-checks.json)。

<!-- more -->

## 1. 模型、归一化与递归矩阵

### 1.1 输入与二值固定点

输入层有 $N_P$ 个投射神经元（PN），扩张层有 $N_K$ 个 Kenyon 细胞（KC）。每个 KC 随机选择 $K$ 个不同输入，文档采用

$$
J_{ia}=\frac{A_{ia}}{\sqrt K},\qquad
A_{ia}\in\{0,1\},\qquad \sum_aA_{ia}=K.
$$

对标准高斯输入，单个前馈电流的方差因此为 $1$。前篇原论文的等权重记法将非零权重设为 $1$；在固定 $K$、同步缩放阈值的前馈模型中，两者只差整体尺度。加入递归后，还必须说明递归增益与阈值所使用的电流单位。

递归二值模型为

$$
\mathbf r=\Theta(J\mathbf x+M\mathbf r-\boldsymbol\theta).
$$

$M_{ij}$ 表示细胞 $j$ 对细胞 $i$ 的作用，行对应突触后、列对应突触前。该式只定义固定点条件，并未指定到达固定点的动力学。同步更新、异步更新和连续时间模型不能视为同一种模型。

目标编码水平 $f$ 是输入分布下的激活概率。逐细胞满足 $\mathbb E[r_i]=f$，与仅满足群体平均 $N_K^{-1}\sum_i\mathbb E[r_i]=f$ 不等价。

### 1.2 连接形式

令 $U=\mathbf1\mathbf1^T/N_K$。文档中的主要形式为：

| 形式 | 递归矩阵 | 需要保留的约定 |
|---|---|---|
| APL | $M_A=-g_AU$ | 秩一全局抑制，包含自作用项 |
| B1 | $(M_1)_{ij}=-g_M A_{ij}/K_M$，$i\ne j$ | 无向随机边，与 $J$ 独立；对角为零 |
| B2 | $M_2=-g_M A_{\mathrm{row}}$ | 从有向连接组构造；非空行归一化 |
| B3 | $(M_3)_{ij}\propto-\mathbf1_{\{(JJ^T)_{ij}>0\}}$，$i\ne j$ | 连接支持由共享 PN 决定 |
| 树突间兴奋 | $(M_D)_{ij}\propto+\mathbf1_{\{(JJ^T)_{ij}>0\}}$，$i\ne j$ | 与 B3 使用同一支持是建模假设 |

B1 的“对称随机边”应定义为：对每个无序细胞对，以 $K_M/N_K$ 的概率独立连边，再令 $A_{ji}=A_{ij}$。先独立生成两个方向再取平均会改变权重分布与方差。

$(JJ^T)_{ij}>0$ 表示共享至少一个 PN 输入通道，不足以确定共享同一个 PN bouton。树突爪、PN 伙伴数、膨体与 EM 突触数也不是同一个计数。

Manoim 等（2022）的实验支持 KC 轴突间 mAChR-B 介导的局部调制，可抑制邻近细胞的钙和 cAMP 信号；将这些作用统一为静态负权重，是这里进一步采用的模型简化。连接组中的递质预测不能逐条确认受体或生理增益。[文献原文](https://pmc.ncbi.nlm.nih.gov/articles/PMC9613607/)

## 2. 线性响应与高斯阈值表征

### 2.1 电流与活动协方差

以 $\Phi$、$\phi$ 分别表示标准正态分布函数与密度。在给定工作点附近，用平均响应的有效增益近似

$$
\delta\mathbf r\simeq\gamma\,\delta\mathbf h,\qquad
\gamma=\frac{\phi(z_f)}{\sigma_h},\qquad
z_f=\Phi^{-1}(1-f).
$$

这里的 $\gamma$ 是在固定电流方差下改变均值时，平均激活概率的导数。它不是阶跃函数对每个样本进行普通 Taylor 展开的斜率。

由 $\delta\mathbf h=J\delta\mathbf x+M\delta\mathbf r$ 得

$$
G=(I-\gamma M)^{-1},\qquad
H=GJ,\qquad
C^h=H\Sigma_xH^T.
$$

线性响应活动的协方差是 $\gamma^2C^h$。由于参与率对整体倍数不变，它与 $C^h$ 的参与率相同；实际二值活动的协方差还需要阈值变换。

若逐细胞增益不同，令 $\Gamma=\operatorname{diag}(\gamma_i)$，则

$$
\delta\mathbf h=(I-M\Gamma)^{-1}J\delta\mathbf x,\qquad
\delta\mathbf r=\Gamma(I-M\Gamma)^{-1}J\delta\mathbf x.
$$

电流响应使用 $I-M\Gamma$，活动残差传播使用 $I-\Gamma M$，有向网络中不能交换乘法顺序。

矩阵可逆与动力学稳定需要分开判断。$\det(I-\gamma M)\ne0$ 只保证逆存在；线性同步迭代收敛要求谱半径 $\rho(\gamma M)<1$。对另行指定的连续时间线性动力学 $\tau\dot{\mathbf h}=-\mathbf h+\gamma M\mathbf h+\mathbf b$，条件是所有 $\gamma M$ 特征值的实部小于 $1$。这些条件均不自动证明二值异步更新收敛。

### 2.2 高斯电流到二值协方差

固定 $J,M$ 且输入高斯时，线性电流联合高斯。令

$$
q_{ij}=\frac{C^h_{ij}}{\sqrt{C^h_{ii}C^h_{jj}}},\qquad
\theta_i=\mathbb E[h_i]+z_f\sqrt{C^h_{ii}}.
$$

这为每个非退化电流通道设置相同激活概率 $f$。定义中心化阈值核

$$
K_f(q)=
\int_{z_f}^{\infty}\phi(u)\,
\overline\Phi\!\left(\frac{z_f-qu}{\sqrt{1-q^2}}\right)\,\mathrm du-f^2,
\qquad
F_f(q)=\frac{K_f(q)}{f(1-f)}.
$$

其中 $\overline\Phi=1-\Phi$，$|q|<1$。于是

$$
C^{\mathrm{bin}}_{ij}=K_f(q_{ij}),\qquad
C^{\mathrm{bin}}_{ii}=f(1-f).
$$

利用二元高斯联合概率对相关系数的导数，还可写成

$$
K_f(q)=\frac1{2\pi}\int_0^{\arcsin q}
\exp\!\left[-\frac{z_f^2}{1+\sin u}\right]\,\mathrm du.
$$

这个表达式同样包含负相关。端点为 $K_f(1)=f(1-f)$、$K_f(-1)=\max(2f-1,0)-f^2$。在 $q=0$ 附近，

$$
F_f(q)=\frac{\phi(z_f)^2}{f(1-f)}q+O(q^2).
$$

有限网络的二值参与率因此严格满足

$$
\boxed{
D_{\mathrm{bin}}=
\left[
\frac1{N_K}+
\frac{N_K-1}{N_K}\left\langle F_f(q_{ij})^2\right\rangle_{i\ne j}
\right]^{-1}.}
$$

这验证了 PDF Eqs. (13)–(16) 的计算链，但“严格”仅针对已定义的高斯线性响应后再阈值化的模型。递归二值固定点 $\mathbf r=\Theta(J\mathbf x+M\mathbf r-\boldsymbol\theta)$ 一般不是 $\Theta(H\mathbf x-\boldsymbol\theta')$。

若只校准群体平均编码水平，应改用每个细胞实际的 $p_i$、不等阈值联合概率和一般式 $(\operatorname{tr}C)^2/\operatorname{tr}(C^2)$。

## 3. APL 的标量计算与 B1 弱递归展开

### 3.1 共享输入数与 APL

两个独立随机输入子集的共享数满足

$$
n\sim\operatorname{Hypergeom}(N_P,K,K),\qquad
p_n=\frac{\binom Kn\binom{N_P-K}{K-n}}{\binom{N_P}K}.
$$

取不合法的组合数为零，则求和可统一写为 $n=0,\ldots,K$。因为 $S=JJ^T$ 的非对角元为 $n/K$，

$$
\mathbb E[S_{ij}]=\frac K{N_P},\qquad
\operatorname{Var}(S_{ij})=
\frac{(N_P-K)^2}{N_P^2(N_P-1)}.
$$

取 $0<K<N_P$。APL 单独作用时，令

$$
a=\gamma g_A,\quad
c=\frac1{1+a},\quad
\beta=1-c,\quad
\delta=2\beta-\beta^2=1-c^2.
$$

由 $U^2=U$ 得到精确逆

$$
G_A=I-\beta U.
$$

随机行数充分大时，$J$ 的各行平均趋向 $\boldsymbol\mu=(\sqrt K/N_P)\mathbf1^T$，故有效输入行近似为 $J_i-\beta\boldsymbol\mu$。其方差为 $1-\delta K/N_P$，一对行的协方差为 $n/K-\delta K/N_P$，因此

$$
q_n^{A}=
\frac{n/K-\delta K/N_P}{1-\delta K/N_P}.
$$

代入阈值核得到 PDF Eq. (18)：

$$
D_{\mathrm{bin},A}^{\mathrm{ann}}\simeq
\left[\frac1{N_K}+
\frac{N_K-1}{N_K}\sum_{n=0}^Kp_nF_f(q_n^{A})^2\right]^{-1}.
$$

这里用理论成对统计替代具体网络的成对平均，还用到了大 $N_K$ 的列均值近似。它不是有限随机网络的精确恒等式，也不等于先对协方差矩阵做网络平均再计算参与率。

### 3.2 B1 的均值与波动

B1 的精确均值和非对角方差为

$$
\mathbb E[M_1]=-g_MU+\frac{g_M}{N_K}I,\qquad
v=\operatorname{Var}[(M_1)_{ij}]
=\frac{g_M^2}{K_MN_K}\left(1-\frac{K_M}{N_K}\right).
$$

忽略确定性的对角修正后，可将均值与 APL 合并为 $M_0=-(g_A+g_M)U$。令 $W$ 为中心化随机部分，弱波动尺度为

$$
\epsilon^2=\gamma^2N_Kv
=\gamma^2\frac{g_M^2}{K_M}\left(1-\frac{K_M}{N_K}\right).
$$

将 B1 完全替换为其均值，只需在上一节令 $a=\gamma(g_A+g_M)$，但这样会丢失对 $K_M$ 的波动依赖。若要保留有限 $N_K$ 修正，$g_MI/N_K$ 应显式放入参考矩阵或剩余项，不能同时把剩余项称为零均值、零对角的随机矩阵。

### 3.3 二阶成对相关性展开

PDF Eq. (22) 的思路是在相关系数层面展开，而不是直接给维度加一个修正。以下均采用其大 $N_K$ 近似。令

$$
s=1-\delta K/N_P,\quad
t_0=c^2K/N_P,\quad
t_\perp=\frac{1-K/N_P}{N_P-1}.
$$

对共享 $n$ 个输入的一对细胞，记 $q=q_n^A$，并定义

$$
\alpha^2=\frac{t_0}{s},\qquad
u=t_\perp+(t_0-t_\perp)\alpha^2,\qquad
v_n=t_\perp q+(t_0-t_\perp)\alpha^2.
$$

有效输入行的随机扰动经过长度归一化后，相关系数的漂移和方差系数写为

$$
A_{\mathrm{noise}}=\frac{q(-s+3u)-2v_n}{s},\qquad
B_{\mathrm{noise}}=\frac{2[(1+q^2)u-2qv_n]}{s},
$$

$$
A_{\mathrm{mean}}=
\frac{2c^2\beta(K/N_P)(n/K-1)}{s^2}.
$$

在这一近似中，$\mathbb E[\Delta q]\simeq\epsilon^2(A_{\mathrm{noise}}+A_{\mathrm{mean}})$，$\operatorname{Var}(\Delta q)\simeq\epsilon^2B_{\mathrm{noise}}$。令 $\psi_f=F_f^2$，则

$$
\mathbb E[\psi_f(q+\Delta q)]
\simeq
\psi_f(q)+\epsilon^2
\left[
\psi_f'(q)(A_{\mathrm{noise}}+A_{\mathrm{mean}})
+\frac12\psi_f''(q)B_{\mathrm{noise}}
\right].
$$

再对 $p_n$ 加权，并代入二值维度的倒数公式。阈值核的导数为

$$
F_f'(q)=
\frac{\exp[-z_f^2/(1+q)]}
{2\pi f(1-f)\sqrt{1-q^2}},
\qquad
F_f''(q)=F_f'(q)
\left[\frac{q}{1-q^2}+\frac{z_f^2}{(1+q)^2}\right].
$$

这一展开的结构成立，但不能由此宣布整个 B1 标量近似已被证明。它要求弱波动、独立随机连接和受控的归一化误差。$q=1$ 的阈值核不解析；相同输入集合的事件必须单独处理。其概率是 $p_K=1/\binom{N_P}K$，在讨论小 $K$ 最优值时不能只援引文档对 $K\ge7$ 的稀少事件判断。

有限网络中，同一条无向边同时影响两行，产生不可直接丢弃的交叉项。令 $R_0=I-\beta U$、$X=R_0J$，二阶逆展开中的

$$
\mathbb E[WR_0W]
=v\left[(\operatorname{tr}R_0)I+R_0-2\operatorname{diag}(R_0)\right]
$$

是对称、独立、零对角边模型的收缩恒等式。PDF Eqs. (23)–(25) 在此基础上继续用其余输入行的理论矩做平均，所以保留部分有限尺寸项后仍是近似。本次没有独立复现文档所报的整套 B1 参数扫描，不能用其误差表替代余项估计。

一个单独可用的矩阵余项界是：令 $E=\gamma R_0(M-M_0)$，若 $r=\|E\|_2<1$，则

$$
\left\|\left[(I-E)^{-1}-I-E-E^2\right]R_0J\right\|_2
\le\frac{r^3}{1-r}\|R_0J\|_2.
$$

它控制有效输入矩阵的误差，不直接控制二值维度；接近零方差行或 $q=\pm1$ 时，仍需分别处理。

## 4. 读出任务与资源约束

### 4.1 两种资源预算

只固定 PN–KC 连接总数时，

$$
S_{\mathrm{ff}}=N_KK,\qquad
N_K(K)=\left\lfloor\frac{S_{\mathrm{ff}}}{K}\right\rfloor.
$$

该预算不固定递归边数与输出连接数。文档另设总接触成本

$$
S_{\mathrm{circuit}}
=N_KK+2w_BE_{B1}+2N_K\mathbf1_{\mathrm{rec}}+N_K,
$$

其中无向 B1 边按两个方向计数，APL 按每个 KC 双向接触计数，最后一项为 KC–MBON 接触。在 $2E_{B1}=K_MN_K$ 时，递归模型的允许细胞数近似为

$$
N_K=\left\lfloor
\frac{S_{\mathrm{circuit}}}{K+3+w_BK_M}
\right\rfloor.
$$

这是明确的模型成本函数，$w_B$ 不是已测得的生理能耗。维度最优值、分类器最优值和总成本约束下的最优值应分别定义。

### 4.2 两气味的线性判别

令两类输入为 $\mathbf x\mid\pm=\pm\boldsymbol\mu/2+\boldsymbol\eta$，$\boldsymbol\eta\sim\mathcal N(0,I)$。使用高斯有效输入矩阵 $H$，设 $s_i=\|H_i\|$、$a_i=(H\boldsymbol\mu)_i/s_i$，背景阈值为 $z_fs_i$。则

$$
p_i^\pm=\Phi(\pm a_i/2-z_f),\qquad
\Delta_i=p_i^+-p_i^-.
$$

类内协方差 $C_\pm$ 由不等阈值的二元高斯概率得到，$C_{\mathrm{pool}}=(C_++C_-)/2$。对任意选定读出 $\mathbf w$，

$$
d'(\mathbf w)=
\frac{\mathbf w^T\boldsymbol\Delta}
{\sqrt{\mathbf w^TC_{\mathrm{pool}}\mathbf w}}.
$$

PDF 选取 $\mathbf w_\lambda=(C_0+\lambda I)^{-1}\boldsymbol\Delta$，其中 $C_0$ 是背景协方差。这是指定的正则化读出，并非一般情况下精确最优的 Fisher 读出；后者在 $C_{\mathrm{pool}}$ 正定时满足 $\mathbf w\propto C_{\mathrm{pool}}^{-1}\boldsymbol\Delta$。

若原型等长为 $A$、余弦相似度为 $\rho$，则去掉共同中点后的差向量长度为 $A\sqrt{2(1-\rho)}$。弱差异下，

$$
\Delta_i=\phi(z_f)a_i+O(a_i^3),
$$

因此固定方向与读出约定后，$d'\propto\sqrt{1-\rho}$。比例系数取决于信号方向和噪声协方差，不能仅由 $D_{\mathrm{bin}}$ 决定；把 $d'$ 换成错误率还需要分数分布假设。

### 4.3 Hebbian 随机标签记忆

训练 $P$ 个独立输入模式及随机标签：

$$
\mathbf w=\sum_{\mu=1}^P y^\mu(\mathbf m^\mu-f\mathbf1).
$$

测试线索为

$$
\mathbf x'=R\mathbf x+(I-R^2)^{1/2}\boldsymbol\xi,
$$

其中 $R$ 为对角矩阵，元素在 $[0,1]$，$\boldsymbol\xi$ 为独立标准高斯。训练与测试的边缘输入分布相同，但不必具有各向同性的相关性。

同一细胞两次电流的相关系数为

$$
r_i=\frac{(HRH^T)_{ii}}{(HH^T)_{ii}}.
$$

记目标模式的内积贡献为
$T=(\mathbf m^0-f\mathbf1)^T(\widetilde{\mathbf m}^0-f\mathbf1)$，则其均值为

$$
A_{\mathrm{sig}}=\mathbb E[T]
=f(1-f)\sum_iF_f(r_i).
$$

令正确标签方向的读出分数为 $u=y^0\mathbf w^T(\widetilde{\mathbf m}^0-f\mathbf1)$。有 $L=P-1$ 个独立干扰模式时，随机标签消去交叉项，得到

$$
\mathbb E[u]=A_{\mathrm{sig}},\qquad
\operatorname{Var}(u)=V_{\mathrm{self}}+L\operatorname{tr}(C_0^2),
\qquad V_{\mathrm{self}}=\operatorname{Var}(T).
$$

忽略 $V_{\mathrm{self}}$ 并假设读出分数近似高斯，才得到文档的串扰负载近似

$$
L_\varepsilon^{\mathrm{xtalk}}
=\frac{A_{\mathrm{sig}}^2}
{z_{1-\varepsilon}^2\operatorname{tr}(C_0^2)}.
$$

当 $R=rI$ 时，

$$
L_\varepsilon^{\mathrm{xtalk}}
=\frac{F_f(r)^2}{z_{1-\varepsilon}^2}D_{\mathrm{bin}}.
$$

它是连续的近似负载指标。实际允许的整数负载由完整错误概率确定；有限负载下的目标方差和非高斯尾部均可能改变排序。通道选择性噪声还会使 $A_{\mathrm{sig}}$ 随 $K$ 和递归结构变化。该量也不是最优训练感知机的容量。

PDF 第 10–13 页本身报告了这些限制：输入预算下，高斯替代模型在所测网格上可能偏好 $K=5$；非线性模型的 $K=3$ 与 $K=5$ 差异随种子改变符号，总接触成本又会改变排序。因此，当前材料没有建立“递归连接使生物回路的最优爪数发生确定偏移”。

## 5. 泛化、混合选择性与试次噪声

### 5.1 原型间与原型内协方差

将一次输入写成

$$
\mathbf x^{\mu t}=\sqrt c\,\mathbf m^\mu+\sqrt{1-c}\,\boldsymbol\epsilon^{\mu t},
\qquad 0<c<1,
$$

其中原型与独立试次噪声均为标准高斯。这里 $c$ 是同一原型不同试次的输入相关性，不是两种气味间的相似度。

令 $\mathbf p^\mu=\mathbb E[\mathbf r\mid\mathbf m^\mu]$。全协方差公式给出

$$
C=B+W,\qquad
B=\operatorname{Cov}_{\mathbf m}(\mathbf p^\mu),\qquad
W=\mathbb E_{\mathbf m}[\operatorname{Cov}(\mathbf r\mid\mathbf m)].
$$

对固定高斯输入滤波器及逐细胞相同的 $f$，设标准化行 Gram 矩阵为 $Q$，则

$$
C_{ij}=K_f(Q_{ij}),\qquad
B_{ij}=K_f(cQ_{ij}),\qquad
W_{ij}=K_f(Q_{ij})-K_f(cQ_{ij}).
$$

特别地，

$$
W_{ii}=f(1-f)-K_f(c)=:\nu_f(c).
$$

这说明在此各向同性高斯模型中，线性滤波器不能改变匹配编码水平后的单细胞平均试次噪声方差，但能改变细胞间噪声相关和信号方向。对非线性反馈、非高斯输入或只匹配群体平均活动，不能直接沿用该不变性。

### 5.2 两输入源的交互项

两个独立、等功率输入源的组合，在共享两个、一个或零个源时具有电流相关系数 $1,1/2,0$。原型均值响应的交互分量为

$$
a_{\mathrm{int}}(f,c)=K_f(c)-2K_f(c/2).
$$

概率论 Hermite 多项式展开为

$$
K_f(q)=\phi(z_f)^2\sum_{n\ge1}
\frac{\operatorname{He}_{n-1}(z_f)^2}{n!}q^n.
$$

因此

$$
a_{\mathrm{int}}=
\phi(z_f)^2\sum_{n\ge2}
\frac{\operatorname{He}_{n-1}(z_f)^2}{n!}
c^n(1-2^{1-n}).
$$

线性项消去，剩余系数非负。小 $c$ 且 $z_f\ne0$ 时首项为 $\phi(z_f)^2z_f^2c^2/4$；$f=1/2$ 时二次项消失，首项为 $c^3/(16\pi)$。

文档定义的比值

$$
R_{\mathrm{int}}=\frac{a_{\mathrm{int}}}{\nu_f(c)}
$$

只衡量该交互分量相对平均试次噪声的大小。独立积分和一维优化复核得到：$c=0.4$ 时该比值在 $f\simeq0.035304$ 最大，$c=0.8$ 时在 $f\simeq0.019425$ 最大，与 PDF 表中值一致。这不验证有限分类器也在相同 $f$ 达到最优。

当每个细胞来自两个源的能量比例分别为 $u_i$、$1-u_i$ 时，定义

$$
\begin{aligned}
S&=N_KK_f(c),\\
G_A&=\sum_iK_f(cu_i),\qquad
G_B=\sum_iK_f(c(1-u_i)),\\
A_{\mathrm{int}}&=S-G_A-G_B.
\end{aligned}
$$

对 $m_A\times m_B$ 个原型组合，期望 Gram 矩阵的交互特征值为 $A_{\mathrm{int}}$，重数为 $(m_A-1)(m_B-1)$；两个单源分量的特征值分别为 $A_{\mathrm{int}}+m_BG_A$ 和 $A_{\mathrm{int}}+m_AG_B$。这是对原型平均后的谱，不能保证单个有限样本 Gram 矩阵具有相同最小特征值。

### 5.3 有限原型上的噪声感知读出

给定一个有限原型集合，必须重新用其条件均值与条件协方差计算 $B,W$。令 $L$ 的列为中心化原型均值，$\mathbf y$ 为标签，$R=W+\lambda I$，则

$$
\mathbf w_R=R^{-1}L(L^TR^{-1}L)^+\mathbf y
$$

在插值约束可行时最小化 $\mathbf w^TR\mathbf w$。若采用伪逆截断导致约束不再可行，必须报告残差，不能继续称为精确插值。

每类分数的均值和方差可以由条件矩精确计算，但用
$\Phi(-a_\mu/\sqrt{v_\mu})$ 预测错误率仍加入了高斯尾部近似。PDF 第 16 页报告的有限分类器最优编码水平与 $R_{\mathrm{int}}$ 的最优值不同，与这一区分相符。

## 6. 连接组、非线性闭合与数值证据

### 6.1 解剖矩阵与模型矩阵

PDF 第 17–18 页报告从 FAFB v783 构造左右半脑的有向 PN–KC、KC–KC 等连接，分别使用 PN 伙伴支持和突触计数作为输入权重，再将每行归一化。递归矩阵保留方向，但把非空行的总抑制增益统一设为 $g_M$。

因此，原始接触数、有向伙伴数、归一化模型权重与生理抑制强度需要分别记录。不同突触数阈值下的平均入度差异很大，合成模型的 $K_M=20$ 不能被视为不依赖筛选方式的测量结果。模型中的统一 APL 也不等同于已经提取的实际 APL 解剖矩阵。

有向二值更新缺少对称网络的能量下降保证。对于对称且零对角的 $M$，异步单细胞更新可由

$$
E(\mathbf r)=-\frac12\mathbf r^TM\mathbf r
-(J\mathbf x-\boldsymbol\theta)^T\mathbf r
$$

给出能量论证；在没有平局引起零能量翻转等退化时，有限状态空间内的严格下降排除循环。这个结论不能原样用于 B2。

### 6.2 有限样本协方差

把独立输入分成两半，分别得到协方差估计 $\widehat C_1,\widehat C_2$。在各半估计无偏且相互独立时，

$$
\mathbb E[\operatorname{tr}(\widehat C_1\widehat C_2)]
=\operatorname{tr}(C^2).
$$

这避免直接计算 $\operatorname{tr}(\widehat C^2)$ 的自乘噪声偏差，但相应的参与率比值仍不是无偏估计。两半数据还可用于协方差误差、输入滤波器与逆维度的分组交叉乘积。

分组贡献之和可以严格等于总逆维度；某组解释超过 $100\%$ 的变化，表示其他组抵消了一部分变化，并非概率大于 $1$。这种分解也不构成对某类突触的因果归因。

### 6.3 高阶残差的协方差闭合

对冻结的高斯比较模型 $\mathbf r^0=\mathbf1_{\{H\mathbf x>\boldsymbol\theta^s\}}$，令 $s_i=\|H_i\|$、$z_i=\theta_i^s/s_i$，此处 $\Gamma_{ii}=\phi(z_i)/s_i$。其一阶输入投影为

$$
p_i=\overline\Phi(z_i),\qquad
B_i=\frac{\phi(z_i)}{s_i}H_i,\qquad
\boldsymbol\eta^0=\mathbf r^0-\mathbf p-B\mathbf x.
$$

由高斯积分可得

$$
\mathbb E[\boldsymbol\eta^0\mathbf x^T]=0,\qquad
Q=\operatorname{Cov}(\boldsymbol\eta^0)=C^0-BB^T\succeq0.
$$

正交不代表独立。文档先假设残差满足 $\boldsymbol\eta\simeq\boldsymbol\eta^0+\Gamma M\boldsymbol\eta$，令

$$
L=(I-\Gamma M)^{-1},\qquad
C^{\mathrm{raw}}=BB^T+LQL^T.
$$

它是半正定矩阵，但即使再恢复对角上的 Bernoulli 方差，也不保证能由一个联合二值分布实现。必要的成对边界为

$$
\max(0,p_i+p_j-1)-p_ip_j
\le C_{ij}\le
\min(p_i,p_j)-p_ip_j.
$$

PDF 第 22 页已经报告该闭合违反部分成对边界，所以不能把它保留为普遍有效的二值协方差公式。

### 6.4 有界残差驱动

文档随后定义一个整体二值映射：

$$
\mathbf u_L(\mathbf x)=H\mathbf x+ML\boldsymbol\eta^0(\mathbf x),\qquad
\mathbf r_L(\mathbf x)=
\mathbf1_{\{\mathbf u_L(\mathbf x)>\boldsymbol\theta-M\mathbf p\}}.
$$

因为每个输入样本对应一个完整二值向量，其总体协方差具有一致的边缘概率，自动满足二值成对边界。由残差正交还得到

$$
\mathbb E[\mathbf u_L\mathbf x^T]=H,\qquad
\operatorname{Cov}(\mathbf u_L)
=HH^T+MLQL^TM^T.
$$

但 $\mathbf u_L$ 通常非高斯，不能将其残差替换为独立高斯噪声后仍声称二值概率不变。再次阈值化后的输入投影也未必等于 $B$。这个构造是一个相容的联合二值近似，不是对原固定点方程的精确解；其维度仍需数值积分。

### 6.5 文档报告的验证范围

以下均为 PDF 报告值，本次未取得原始代码和矩阵进行复现。

| PDF 位置 | 文档报告 | 可支持的范围 |
|---|---|---|
| 第 18 页 | 20 种连接组高斯比较条件，解析与抽样二值维度差异不超过 $0.39\%$ | 检查高斯阈值实现，不能单独验证非线性固定点 |
| 第 24 页 | 有界闭合的配对维度误差平均 $0.164\%$；独立预测样本的原始误差平均 $0.530\%$ | 指定独立高斯输入、增益和终止协议 |
| 第 27 页 | 实际连接相对条件重连，群体维度增益约 $0.97$–$1.60\%$；$\alpha/\beta$ 细胞约 $3.06$–$4.03\%$ | 一个脑、特定重连约束下的描述性比较 |
| 第 31 页 | 独立高斯输入闭合误差平均 $0.401\%$；相关高斯 $27.840\%$；Student $t_5$ 为 $2.938\%$ | 已显示输入分布改变后的精度限制 |

同一脑的左右半脑不是两个独立个体。保持度数、细胞类型、权重或互惠边的重连控制，可以排除部分结构差异，但有限链的诊断不能自动证明全局混合或均匀采样。少量重连样本的范围不能当作置信区间。

文档在部分分析中把到达固定点的状态与迭代截止时仍循环的状态一起用于协方差。由此得到的是指定更新顺序、初始化和截止时刻下的终止状态统计，不能全部称为稳态协方差。循环的周期按算法扫描次数计算，也没有自动对应的生理时间尺度。

### 6.6 相关输入与 Student 输入

PDF Eq. (70) 的 $x=Tz$、$z\sim\mathcal N(0,I)$，通过 $TT^T=\Sigma_x$ 生成相关输入；这是施加相关性的变换。若 $\Sigma_x$ 正定，反向的 $z=T^{-1}x$ 才是白化。将 $J$ 替换为 $JT$ 的代数是正确的，原文“exact whitening”的措辞需调整。

对单位协方差的椭圆 Student 输入，设自由度 $\nu>2$，$c_\nu=\sqrt{(\nu-2)/\nu}$、$a_i=\theta_i^0/(c_\nu s_i)$。文档的阈值敏感度和输入投影系数分别为

$$
\Gamma_i=\frac{t_\nu(a_i)}{c_\nu s_i},\qquad
B_i=\beta_iH_i,\qquad
\beta_i=
\frac{c_\nu(\nu+a_i^2)t_\nu(a_i)}
{(\nu-1)s_i}.
$$

后式由 Student 尾部一阶矩积分得到，本次独立积分复核一致。一般有 $B\ne\Gamma H$，不能继续照搬高斯系数。源分布的矩公式正确，也不保证残差递归闭合在该分布下准确。

## 7. 电流谱计算与需要修正的结论

### 7.1 有限网络的 APL 公式可以保留

令

$$
\mathbf u=\frac{\mathbf1}{\sqrt{N_K}},\qquad
P_\perp=I-\mathbf u\mathbf u^T,\qquad
S=JJ^T,
$$

$$
\lambda_0=\mathbf u^TS\mathbf u,\qquad
\mathbf b=P_\perp S\mathbf u,\qquad
S_\perp=P_\perp SP_\perp.
$$

有限网络中 $\mathbf u$ 不一定是 $S$ 的特征向量，$\mathbf b$ 记录两部分的耦合。由 $G_A=P_\perp+cU$，直接计算迹得到

$$
\boxed{
D_A=
\frac{(c^2\lambda_0+\operatorname{tr}S_\perp)^2}
{c^4\lambda_0^2+2c^2\|\mathbf b\|^2+\operatorname{tr}(S_\perp^2)}.}
$$

这验证了 PDF Eq. (80)。$c\to0$ 时，$D_A\to D(S_\perp)\le N_P-1$，等号要求非零残余特征值相等。二值输出经过非线性后不受这个线性秩上界约束。

### 7.2 APL 增强不保证维度单调提高

PDF 的总结表将 APL 的作用概括为维度上升到残余维度，这个单调性不能由 Eq. (80) 推出。若交叉块为零，且 $r$ 个残余特征值均为 $\lambda$，则

$$
D_A(c)=
\frac{(c^2\lambda_0+r\lambda)^2}
{c^4\lambda_0^2+r\lambda^2}.
$$

当 $c^2\lambda_0=\lambda$ 时所有非零方向方差相等，维度为 $r+1$；继续压低均匀方向，极限反而为 $r$。

一个符合文档输入归一化的有限例子是：$N_P=5,K=2$，取全部 $\binom52=10$ 个不同输入子集作为十行。此时均匀特征值为 $4$，四个残余特征值均为 $1.5$。无抑制时 $D=4$，适当 APL 下 $D=5$，无限强抑制的极限为 $4$。这是对单调性结论的反例，不是生理增益预测。

### 7.3 结构化抑制的符号论证不成立

PDF 第 36–37 页从“抑制连接与输入协方差对齐”推到主方向被放大，并给出 $D_\perp^{B3}<D_\perp^{B1}$；又以翻转符号推出树突间兴奋提高残余维度。这两步没有一般依据。

即使两个对称矩阵完全共用特征向量，若 $S$ 在某方向的特征值为 $\lambda_\ell$、$M$ 为 $m_\ell$，变换后的电流特征值也是

$$
\lambda_\ell'=\frac{\lambda_\ell}{(1-\gamma m_\ell)^2}.
$$

负的 $m_\ell$ 在该方向产生抑制，而非因取逆自动转为放大。另一方面，逐元素为负的连接矩阵不必是负半定矩阵，因此单凭连接的兴奋或抑制符号也不能判断各模态。

更直接地，对 $M=-gB$、对称 $B$，在 $g=0$ 的一阶变化为

$$
\left.\frac{\mathrm d}{\mathrm dg}\log D\right|_{g=0}
=4\gamma\left[
\frac{\operatorname{tr}(BS^2)}{\operatorname{tr}(S^2)}
-\frac{\operatorname{tr}(BS)}{\operatorname{tr}S}
\right].
$$

所以符号取决于混合迹，而不是共享输入这一支持条件。以完全谱对齐的 $B=S=\operatorname{diag}(4,1)$、$\gamma=1$ 为例：

| 变换 | 电流维度 |
|---|---:|
| 无递归 | $1.470588$ |
| $M=-0.1S$ | $1.695810$ |
| $M=+0.1S$ | $1.219512$ |

该例只检验文档的谱符号论证，并不把一般矩阵 $M=-gS$ 当成其 B3 支持模型。

对 B3 支持本身也可检查上一节十个输入子集的例子。两个不同子集共享 PN 时连边，每个节点恰有六个邻居；取 $M_3=-gB/6$。去掉均匀部分后，它对四个非零残余方向的增益相同，在线性逆存在的范围内，残余维度保持为 $4$，不存在由支持关系强制产生的严格下降。

此外，$P_\perp SP_\perp$ 一般会改变矩阵元的支持，不能声称 B3 与投影后的 $S_\perp$ 具有相同支持。PDF 附录 B、C 仍标为待完成，尚未提供所需的混合迹计算。因此 Eqs. (88)、(91) 应保留为待检验的特定参数现象，不能作为一般已证结论。

### 7.4 半圆谱半径需保留连接密度因子

由 B1 方差得到的半圆近似半径是

$$
R_{\mathrm{sc}}=2\sqrt{N_Kv}
=\frac{2g_M}{\sqrt{K_M}}
\sqrt{1-\frac{K_M}{N_K}}.
$$

PDF 第 3 页给出了这个因子，但附录 Eq. (93) 将其省略后仍写为等式。只有在 $K_M/N_K\to0$ 时，才可进一步近似为 $2g_M/\sqrt{K_M}$。若连接密度趋于非零常数，该因子不能丢弃。

半圆经验谱近似还不等于极端特征值已有足够控制。很稀疏网络中的高度节点及有限尺寸效应，可能影响算子范数；近 resolvent 极点时，应检查实际矩阵，不能仅靠平均入度或经验谱形状判定误差。

### 7.5 自由概率的矩代数成立，但适用条件尚未建立

对一个已经假定为半圆分布的随机矩阵，令

$$
\bar g_k=\int(1-\gamma\nu)^{-k}\rho_{\mathrm{sc}}(\nu)\,\mathrm d\nu,\qquad
t=\gamma^2R_{\mathrm{sc}}^2<1.
$$

其积分为

$$
\bar g_2=\frac2t\left(\frac1{\sqrt{1-t}}-1\right),\qquad
\bar g_4=(1-t)^{-5/2},
$$

$$
r_g:=\frac{\bar g_4}{\bar g_2^2}
=\frac{(1+\sqrt{1-t})^2}{4(1-t)^{3/2}}
=1+t+O(t^2).
$$

本次数值积分复核与这些闭式一致。$t=0$ 的表达式按连续极限取值，此时 $\bar g_2=\bar g_4=1$。$r_g-1$ 才是 $G^2$ 谱的方差除以均值平方，$r_g$ 本身包含基线 $1$。

若进一步假设 $G^2$ 与 $S_\perp$ 渐近自由，标准的一、二阶混合矩给出

$$
\begin{aligned}
\operatorname{tr}(G^2S_\perp)
&\simeq \bar g_2\operatorname{tr}S_\perp,\\
\operatorname{tr}[(G^2S_\perp)^2]
&\simeq \bar g_2^2\operatorname{tr}(S_\perp^2)
+\frac{\bar g_4-\bar g_2^2}{N_K}
(\operatorname{tr}S_\perp)^2.
\end{aligned}
$$

记实际残余参与率为 $D_0=(\operatorname{tr}S_\perp)^2/\operatorname{tr}(S_\perp^2)$，即可写成

$$
D_\perp\simeq
\frac{D_0}{1+(D_0/N_K)(r_g-1)}.
$$

再假设残余谱完全平坦，令 $D_0=N_P-1$，才得到 PDF Eq. (111)。代数形式没有问题，问题在于将它用于当前低秩扩张模型所需的渐近条件。

附录 V3 声称 $\|S_\perp\|_{\mathrm{op}}=O(1)$。但固定 $N_P,K<N_P$、增大 $N_K$ 时，

$$
\operatorname{rank}(S_\perp)\le N_P-1,\qquad
\operatorname{tr}S_\perp\simeq N_K(1-K/N_P),
$$

所以

$$
\|S_\perp\|_{\mathrm{op}}
\ge\frac{\operatorname{tr}S_\perp}{N_P-1}
\simeq\frac{N_K(1-K/N_P)}{N_P-1}.
$$

该范数随 $N_K$ 增长，不满足文档所写的有界条件。可以另行指定归一化及同比例极限，或直接分析有限秩矩阵，但不能用当前 V3 作为现成证明。独立的稀疏 Bernoulli 对称矩阵也不能只凭“特征向量近似弥散”就等同于具有 Haar 不变性的模型。

因此，这部分可作为附加自由性与谱近似下的条件性矩估计，尚不是完整 B1 的严格结果，更不是递归二值输出的标量公式。

### 7.6 兴奋性极点不能直接推出生物必要性

纯秩一兴奋矩阵 $M=g_DU$ 确实将均匀块乘以 $(1-\gamma g_D)^{-2}$。在该方向具有非零输入方差、且其他部分保持有界时，接近极点可使线性电流维度趋于 $1$。

一般结构化兴奋矩阵的临界模态则由完整矩阵决定。远离极点、包含其他抑制或非线性饱和时，不能沿用上述极限；二值活动本身有界，线性电流近似的发散不等于二值响应幅度发散。

PDF 第 37 页“树突间兴奋必须由 APL 抵消，否则破坏气味编码”的表述超出了已推导结果。可保留的结论是：需要在明确动力学、增益和非线性模型后检查稳定性及读出性能，现有计算不足以证明某一具体生物机制的必要性。

## 8. 核查结论与复核范围

| 内容 | 核查判断 |
|---|---|
| 高斯线性电流与二值阈值核，PDF Eqs. (13)–(16) | 在固定矩阵、正确阈值和高斯假设下成立 |
| APL 超几何标量式，Eqs. (17)–(18) | 大网络、连接平均意义下的近似 |
| B1 二阶标量式，Eqs. (22)–(25) | 保留为候选近似；端点、有限尺寸和余项需要单独控制 |
| Hebbian 信号与方差，Eqs. (31)–(32) | 在随机独立标签及指定边缘统计下成立 |
| 串扰负载，Eq. (33) | 不是完整错误率容量，不能省略其近似说明 |
| 原型分解与交互核，Eqs. (38)–(43) | 对所定义的高斯原型模型成立；不保证分类器最优值 |
| 旧残差协方差闭合，Eqs. (57)–(58) | 文档已发现二值可实现性失败 |
| 有界残差映射，Eq. (65) | 是相容的联合二值模型；对原网络的精度仍属数值问题 |
| 有限网络 APL 电流维度，Eq. (80) | 成立；不推出抑制越强维度越高 |
| B3 与兴奋的方向关系，Eqs. (88)、(91) | 当前推导不足，不能作为一般结论 |
| 半圆半径，Eq. (93) | 恢复连接密度因子，或明确使用稀疏密度近似 |
| 自由概率 Eq. (111) | 条件性矩结果；当前 V3 与固定输入维数的扩张尺度不相容 |
| 连接组增益、生物最优 $K$、生理循环 | 现有材料不足以作普遍或生理结论 |

本次完成 17 项独立数学检查，包括共享输入矩、两种高斯积分、APL 逆矩阵及交叉块公式、二值参与率、有限负载 Hebbian 前两阶矩、半圆 resolvent 积分、交互比值最优点及 Student 一阶矩，并计算了上述谱反例。它们不包含原文连接组数据处理、全部 B1 参数扫描或非线性大网络实验复现。

复核文件：[Python 脚本](/downloads/kc-recurrence-checks.py)、[运行结果 JSON](/downloads/kc-recurrence-checks.json)。脚本需要 NumPy 与 SciPy，运行方式为：

~~~bash
python kc-recurrence-checks.py --output kc-recurrence-checks.json
~~~

文档中已有一条可继续使用的计算路线：固定输入分布与连接矩阵，明确阈值和动力学约定，先求有限矩阵高斯基准，再与同一任务及校准协议下的非线性结果比较。共享输入的统计关联、表征维度改善、分类收益和生物最优性，应分别检验。

## 材料定位

| 内容 | calculation(1).pdf 页码 |
|---|---|
| 模型、连接形式、高斯阈值与弱 B1 展开 | 1–9 |
| 读出任务、预算与混合选择性 | 9–17 |
| 有向连接组、残差闭合、重连与输入稳健性 | 17–33 |
| 电流谱与作用方向 | 34–39 |
| 半圆谱、resolvent 与自由概率附录 | 39–42 |

相关原始文献：

- Litwin-Kumar, A., et al. (2017). *Optimal Degrees of Synaptic Connectivity*. Neuron, 93(5), 1153–1164.e7. [DOI](https://doi.org/10.1016/j.neuron.2017.01.030)
- Barak, O., Rigotti, M., & Fusi, S. (2013). *The Sparseness of Mixed Selectivity Neurons Controls the Generalization–Discrimination Trade-Off*. Journal of Neuroscience, 33(9), 3844–3856. [DOI](https://doi.org/10.1523/JNEUROSCI.2753-12.2013)
- Manoim, J. E., et al. (2022). *Lateral axonal modulation is required for stimulus-specific olfactory conditioning in Drosophila*. Current Biology, 32(20), 4438–4450.e5. [DOI](https://doi.org/10.1016/j.cub.2022.09.007)
