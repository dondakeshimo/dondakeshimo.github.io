---
title: '機械学習の誤差逆伝播法についてまとまらない'
date: '2019-05-19'
tags: [python, DL, book]
path: blog/deep-learning-4
cover: ./preview.png
excerpt: 書籍 深層学習 を読みながらまとめていく
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---
前回の続きで今回は深層順伝播型ネットワークにおける誤差逆伝播法についてまとめていく．

# 目次

# 誤差逆伝播法
順伝播型ネットワークでは訓練時，スカラー値の損失を得るまで順伝播を続ける．
損失を最小化することが訓練の目標であり，最小化するための重みの最適化に使われる情報が勾配である．
解析的に勾配を計算することは困難なため，誤差逆伝播法と呼ばれる手法を用いて導出する．


# 計算グラフ
説明には，図を用いた方がはるかにわかりやすいが面倒なので，リンクを貼り付ける．

[https://qiita.com/t-tkd3a/items/031c0a4dbf25fd2866a3]


# 微積分の連鎖律
基本的な微分の連鎖律は下式である．
$$
    \frac{dz}{dx} = \frac{dz}{dy} \frac{dy}{dx}
$$
これはスカラー以外にも一般化することができる．
$$
    \nabla_{\mathbf{x}^{z}} = \left(
    \frac{\partial \mathbf{y}}{\partial \mathbf{x}} \right)^{\mathrm{T}}
    \nabla_{\mathbf{y}^{z}}
$$
この式から変数 $\mathbf{x}$ に関する勾配はヤコビ行列
$\frac{\partial \mathbf{x}}{\partial \mathbf{x}}$ に勾配
$\nabla_{\mathbf{y}^{z}}$ を掛けて求められることがわかる．
誤差逆伝播法はこのようなヤコビ行列と勾配の積をグラフ上の各演算で実行するように構成される．


# MLPにおける誤差逆転伝播法
上述の連鎖律を使うことでMLPにおける任意の重みに勾配を届けることができる．
その実装方法は毎回数値を扱うようなことはせず，シンボリックな表現で行われる．
厳密な計算方法はTorch, Caffeが「シンボルと数値間」の微分であり，
Tehano, TensorFlowがシンボリックな記述をグラフに加える手法であるらしいが，
正直よくわからない．

一つの隠れ層に着目してどのように誤差逆伝播が行われていくかをみてみる．
簡単のため各層におけるバイアスを無視し，損失の計算に重みに関する正規化項はなしとする．

損失を $J$,
子ノードから渡される勾配に隠れ層の活性化関数を考慮したものを $\mathbf{G}$ ，
その隠れ層における入力を $\mathbf{u_i}$，
その隠れ層における出力を $\mathbf{u_{i+1}}$，
その隠れ層の重みを $\mathbf{W}$ とすると
$$
    \mathbf{u}_{i+1} = \mathbf{W}^{\mathrm{T}} \mathbf{u}_i
$$
$$
    \mathbf{G} = \frac{\partial J}{\partial \mathbf{u}_{i+1}}
$$
$$
    \frac{\partial \mathbf{u}_{i+1}}{\partial \mathbf{W}_i} =
    \mathbf{u}_i^{\mathrm{T}}
$$
$$
    \frac{\partial J}{\partial \mathbf{W}_i} =
    \frac{\partial \mathbf{u}_{i+1}}{\partial \mathbf{W}_i} \mathbf{G} =
    \mathbf{u}_i^{\mathrm{T}} \mathbf{G}
$$

(えと，行列の微分ちとわからんすぎて最後の式間違ってる可能性がかなり高いです...)

MLPの演算は主に行列あるいはテンソルの加算，乗算，非線型関数の適用でできている．
上記の計算は乗算の場合を記述している．加算の場合はこれより単純なため割愛する．
非線形関数については誤差逆伝播を行いやすいように調整されたものが多い．
特にReLUなどは勾配において0以下のものを0にするという作業を行うだけである．
このようにして計算グラフにおいて任意の点で勾配を計算する．

実際の実装ではここまでの簡略化は不可能なので，計算自体はかなりややこしくなる．
またメモリやデータ型についても気を使う必要がある．

# しれっと説明を回避した問題
- メモリの管理
- データ型
- 単一ノードが複数出力を持つ場合
- 誤差逆伝播方以外の自動微分が存在すること
- 高次の微分(TensorFlow等で使用可能)
