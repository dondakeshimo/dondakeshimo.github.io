---
title: '機械学習に必要な数学についてざっくりとしたまとめ'
date: '2018-12-11'
tags: [python, DL, book]
path: blog/deep-learning-1
cover: ./preview.png
excerpt: 書籍 深層学習 を読みながらまとめていく
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---
# 目次


# 深層学習に必要な数学

深層学習、機械学習に必要な数学についてまとめます。
参考書籍は下に貼り付けておきます。

# 微積分

参考書籍では微積分については各自で習熟しているものとされています。
微積分について必要な知識は

- 高校範囲までの微積分
- 偏微分と方向微分
- ベクトルと行列の微分

ベクトルと行列の微分については知識がなかったため、下記のサイトを参考にしました。
基本公式を押さえておけば式変形にはついていけます。

# 線形代数

### スカラー、ベクトル、行列、テンソル

- スカラーはdouble型などの1変数
- ベクトルは1次元配列
- 行列は2次元配列
- テンソルは3次元以上の多次元配列

### 線型従属と張る空間

### ノルム

##### $L^p$ノルムの定義

$$
    \|\mathbf{x}\| = (\sum_i|x_i|^p)^{\frac{1}{p}}
$$

##### 最大値ノルム

$$
    \|\mathbf{x}\|_{\infty} = \max_{i} |x_i|
$$

##### フロベニウスノルム(行列のノルム)

$$
    ||\mathbf{A}||_F = \sqrt{\sum_{ij}A^2_{ij}}
$$

### 固有値分解

##### 固有値分解

$$
    \mathbf{Av} = \lambda\mathbf{v} \qquad (\mathbf{v} \neq \mathbf{0})
$$
$$
    \mathbf{v} : Eigenvector, \lambda : Eigenvalue
$$
$$
    \mathbf{V} = [\mathbf{v^{(1)}}, \dots, \mathbf{v^{(n)}}]
$$
$$
    \mathbf{\lambda} = [\lambda_1, \dots, \lambda_n]^{\mathrm{T}}
$$
$$
    \mathbf{A} = \mathbf{V}\mathbf{\mathbf{diag}}(\lambda)\mathbf{V^{-1}}
$$

##### 実対称行列の固有値分解

$$
    \mathbf{A} = \mathbf{Q} \mathbf{\Lambda} \mathbf{Q}
    \qquad (\mathbf{Q} \quad is \quad Orthogonal \quad matrix)
$$

##### 固有値

- 全ての $\lambda > 0$ なら正定値
- 全ての $\lambda \ge 0$ なら半正定値
- 全ての $\lambda > 0$ なら負定値
- 全ての $\lambda \le 0$ なら半負定値

### 特異値分解(Singular Value Decomposition, SVD)

SVDの最も有用な特徴は逆行列法を非正方行列に部分的に一般化できること

$$
    \mathbf{A} = \mathbf{U} \mathbf{D} \mathbf{V^{\mathrm{T}}}
$$
$$
    \mathbf{U}, \mathbf{V} : Orghogonal \quad matrix, \quad \mathbf{D} : Diagonal \quad matrix
$$

### ムーア・ペンローズ擬似逆行列

$$
    \mathbf{A} : m \times n \quad matrix, \quad \mathbf{U, V, D} : Singular \quad value \quad decomposition
$$
$$
    \mathbf{A^+} = \lim_{\alpha \rightarrow 0}
    (\mathbf{A^{\mathrm{T}}A} + \alpha\mathbf{I})^{-1} \mathbf{A^{\mathrm{T}}}
$$
$$
    \mathbf{A^+} = \mathbf{VD^+U^+}
$$

- $m < n$ なら $\mathbf{x} = \mathbf{A^+y}$ は全ての解で最小の $\|\mathbf{x}\|_2$
- $m > n$ なら解が存在しない可能性、 $\|\mathbf{Ax} - \mathbf{y}\|_2$ が最小

### トレース演算子

$$
    \mathrm{Tr}(\mathbf{A}) = \sum_i \mathbf{A_{i, i}}
$$
$$
    \|\mathbf{A}\|_F = \sqrt{\sum_{ij}A^2_{ij}} =
    \sqrt{\mathrm{Tr}(\mathbf{A^{\mathrm{T}}A})}
$$
$$
    \mathrm{Tr}\left(\prod^n_{i=1}F^{(i)}\right) =
    \mathrm{Tr}\left(F^{(n)}\prod^{n-1}_{i=1}F^{(i)}\right)
$$

# 確率

### 確率変数、確率分布
観測される定義域の値を確率変数、確率変数が従う分布を確率分布

- 離散変数の場合、確率質量関数 $P(x)$
- 連続変数の場合、確率密度関数 $p(x)$

### 周辺確率分布

$$
    \forall x \in \mathrm{x}, \quad P(\mathrm{x} = x) =
    \sum_y P(\mathrm{x} = x, \mathrm{y} = y)
$$
$$
    \forall x \in \mathrm{x}, \quad p(\mathrm{x} = x) =
    \int p(x, y) \mathrm{dy}
$$

### 条件付き確率

$$
    P(\mathrm{y} = y | \mathrm{x} = x) =
    \frac{P(\mathrm{y} = y, \mathrm{x} = x)}{P(\mathrm{x} = x)}
$$

### 条件付き確率の連鎖律
条件付き確率の定義を用いれば、同時確率が条件付き確率の積で表せる

### 独立と条件付き独立
条件付き確率分布が独立であることを条件付き独立分布という

### 期待値、分散、共分散

$$
    E_{\mathrm{x} \sim P} [f(x)] = \sum_x P(x)f(x)
$$
$$
    Var(f(x)) = E \left[(f(x) - E[f(x)])^2 \right]
$$
$$
    Cov(f(x), g(y)) = E [(f(x) - E[f(x)])(g(y) - E[g(y)]) ]
$$
$$
    Cov(\mathrm{x})_{i, j} = Cov(\mathrm{x_i}, \mathrm{x_j})
$$
$$
    Cov(\mathrm{x_i}, \mathrm{x_i}) = Var(\mathrm{x_i})
$$

### 一般的な確率分布

- ベルヌーイ分布
- ガウス分布
- 指数分布とラプラス分布
- ディラック分布と経験分布

### 一般的な関数の有用な性質

- ロジスティックシグモイド関数
- ソフトマックス関数

### ベイズ則

$$
    P(\mathrm{x|y}) = \frac{P(\mathrm{x})P(\mathrm{y|x})}{\mathrm{P(y)}}
$$
$$
    P(\mathrm{y}) = \sum_x P(\mathrm{y|x})P(x)
$$

### 連続変数の保証

- 測度論と呼ばれる理論に裏付けされる
- 測度零やほとんど至るところで(almost everywhere)の概念

### 情報理論

##### 自己情報量

底が $e$ なら _ナット_ 、底が $2$ なら _ビット_

$$
    I(x) = -\log P(x)
$$

##### シャノンエントロピー

$$
    H(x) = E_{\mathrm{x} \sim P} [I(x)] = -E_{\mathrm{x} \sim P} [\log P(x)]
$$

##### カルバックライブラーダイバージェンス

$$
    D_{KL}(P \| Q) = E_{\mathrm{x} \sim P}\left[ \log \frac{P(x)}{Q(x)}\right] =
    E_{\mathrm{x} \sim P} [\log P(x) - \log Q(x)]
$$
$$
    D_{KL}(P \| Q) \ne D_{KL}(Q \| P)
$$

$P$ と $Q$ の並びによって意味合いが異なる

##### 交差エントロピー

$$
    H(P, Q) = H(P) + D_{KL}(P \| Q) = -E_{\mathrm{x} \sim P} \log Q(x)
$$
