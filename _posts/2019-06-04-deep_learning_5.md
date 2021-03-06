---
title: '機械学習の正則化についてまとめ'
date: '2019-06-04'
tags: [python, DL, book]
path: blog/deep-learning-5
cover: ./preview.png
excerpt: 書籍 深層学習 を読みながらまとめていく
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---
かなり回を重ねてきたけど，完全に自分のことしか見ていない.
絶対他の人の役には立っていないとわかる．
そんなブログで突き進む．
前回同様，深層学習について学んだことをまとめる．
今回のテーマは深層学習における正則化である．


# 目次


# 正則化
深層学習の観点では，正則化手法のほとんどは推定量の正則化に基づいている．
推定量の正則化は，バイアスの増加とバリアンスの減少を引き換えることで機能する．
過度にバイアスを増加させずにバリアンスを大きく減少させる正則化項が望まれる．


# パラメータノルムペナルティ
$$
    \tilde{J}(\mathbf{\theta}; \mathbf{X}, \mathbf{y}) =
    J(\mathbf{\theta}; \mathbf{X}, \mathbf{y}) +
    \alpha \Omega(\mathbf{\theta})
$$

$$
    \alpha \in [0, \infty]
$$

バイアスパラメータには関与せず重みのみにペナルティを課す．


### $L^2$パラメータ正則化
重み減衰，リッジ回帰，ティホノフ正則化として知られる．
ステップごとの観点で言うと，重みの更新に際して一定の割合
($\varepsilon\alpha, \varepsilon$: learning rate)
が間引かれながら学習を進めていく頃になる．
学習全体の観点で言うと，パラメータが目的関数を減少させることに大きく寄与する方向には，
相対的に重み減衰の影響が少ない．
逆に学習において重要でない方向に対応する重みベクトルの要素は
訓練全体で正則化を使うことで減衰する．

### $L^1$パラメータ正則化
個々のパラメータの絶対値の総和を減衰項とする．
$L^2$正則化と比して$L^1$正則化ではいくつかのパラメータの最適値が0になる
スパースな解が得られる．
このスパース性を利用して特徴量選択を行うことができる．


# 条件付き最適化としてのノルムペナルティ
一般化ラグランジュ関数を構築することで制約問題にパラメータペナルティの問題を帰着させると，
パラメータ正則化は重みの解の範囲を限定する作用があることがわかる．
減衰項の係数である $\alpha$ を増減させることで，解の範囲を大まかに制御することができる．
適切な範囲の係数である$k$がわかっている場合， $\alpha = k$ として
ペナルティを課すよりも，解が範囲を超えたタイミングで $\Omega(\mathbf{\theta}) \lt k$
の範囲に再射影する方が最適解ではない極小値に $\theta$ が陥らず効率的に値を探索できる．

# 正則化と制約不足問題
正則化を行うことで，サンプルに分散が観察されない時や劣決定系問題を含む場合に
解を定めることができる．

# データ集合の拡張
機械学習モデルの汎化性能を高める最善の方法はより多くのデータで訓練することであり，
そのために偽データを訓練データの一部として用いることで，訓練データを水増しするアプローチがある．
このアプローチは分類において最も簡単な方法となる．
ただし，密度推定タスクなど，他の多くのタスクについても簡単に適用できるものではないことに
留意されたい．

特にデータ集合の拡張が効果を発揮している分野として物体認識がある．
この分野では画像の回転やスケーリングを行うことでデータの拡張を行う．

ノイズを元データに加えると言う手法もデータ拡張の一つとみなせる．
ニューラルネットワークはノイズに対してあまり頑健でないことが証明されている．
ノイズへの頑健性を高めるためには単純にノイズを加えたデータで学習をする手法がある．
入力へのノイズの注入は雑音除去自己符号器のような教師なし学習アルゴリズムの一部である．
2014年にPoole et al.によりノイズの大きさを非常に注意深く調整すれば
この手法が極めて有効であることが証明された．
ドロップアウトもノイズの乗算を用いて新しい入力を構成する皇帝とみなせる．

機械学習アルゴリズムのベンチマークを比較する際は，
スコアを算出した際にデータ拡張が行われていたか確かめることが重要である．
データ集合の拡張の有無によって差が出ている場合，
単純にモデルやアルゴリズムの比較ができないためである．


# ノイズに対する頑健性
一般的に，ノイズの追加は，特にノイズが隠れユニットに加えられた場合に，
単純にパラメータを縮小するよりずっと強力になりうる．

### 出力目標へのノイズの注入
データ集合の拡張で記述したノイズ手法以外に，出力ラベルに対してノイズを含ませる手法も存在する．
このような手法の代表的なものがラベル平滑化と呼ばれる手法である．


# 半教師あり学習
表現を学習する手法であるらしいがあまり理解できなかった．
Chapelle et al, (2006)に詳細が書いてあるらしい．

# マルチタスク学習
*異なるタスクに関連づけられているデータで観測される変動を説明する因子の中には，
二つ以上のタスクの間で共有されるものがいくつか存在する*
と言う事前信念のもとに適用される．
モデルの一部を異なるタスク間で共有し，重みも共有することで汎化性能を改善する．
このようなモデルのパラメータは

1. タスク固有のパラメータ
2. 異なるタスク間で共有されるパラメータ

汎化と汎化誤差の浄化をこれらのモデルによって改善することが可能である．


# 早期終了
エポック数を回し切った最後のパラメタではなく，
検証誤差が最少となったエポックでのパラメタを返す手法を早期終了という．
早期終了はその単純さと有効性から，深層学習において一般的に最も使われている正則化である．

最大のメリットとして，ハイパーパラメタの一つであるエポック数を排除できることが挙げられる．
逆に，デメリットは訓練中に定期的に検証誤差を測定する必要があるということと，
最良のパラメタのコピーを保持する必要があるという点である．
しかしパラメタの保持についてはメモリに格納する必要はないため，通常無視することができる．

早期終了では検証集合が必要となるため，一部のデータが訓練で使えないこととなる．
これらのデータを使いたい場合，早期終了を行い，最適なエポック数やモデル訓練回数を調べた後に，
同様の回数でもう一度始めから訓練するという手法がある．
この場合，パラメタの更新回数を等しくするのかエポック数を等しくするかの2通りの手法がある．
また，早期終了で得たパラメタを保持したまま追加分のデータを含めたデータ集合で訓練するという
手法もある．
しかし，この手法は一般的に良好な結果を示さない．


# パラメタ拘束とパラメタ共有
類似したタスクを，類似した入出力をもつ二つのモデルの重み $w_i^{(A)}, w_i^{(B)}$
があるとき，片方の学習時にもう片方の学習済みパラメタに近づけるように
ノルムペナルティを課すことをパラメタ拘束といい，
完全に学習済みのパラメタと同じになるように学習することをパラメタ共有という．

### 畳み込みニューラルネットワーク
パラメタ共有最大の活躍の場は間違いなく畳み込みニューラルネットワークである．
特に画像認識において1ピクセルのずれても猫は猫である．
そのため，入力全体に対して同様の重みを持つ隠れユニットを用いて計算することが有効となる．


# スパース表現
下記のような正則化を用いることでパラメタのスパース表現が可能になる．

- $L^1$ ノルムペナルティ
- スチューデントのt事前分布から導かれたペナルティ
- KLダイバージェンスペナルティ
- 直行マッチング追跡


# バギングやその他のアンサンブル手法
バギング(Bootstrap AGGregatING)はいくつかのモデルを組み合わせることで汎化誤差を
減少させる手法である．
モデル平均化と呼ばれる機械学習の一般的な手法や．
アンサンブル手法などが含まれる？

(この辺りの関係はイマイチわかっていないので後で調べるかもしれない)

モデル平均化は汎化誤差を削減する手法としては極めて強力で信頼できるものである．


# ドロップアウト
**ドロップアウトは最強である**

ドロップアウトは大規模なニューラルネットワークに対して
バギングを実用的に行う手法であると考えられる．
具体的な手法はランダムに隠れユニットからの出力が0になる場所を作成する．
そして，出力のないユニットが覗かれたランダムなモデルを含んだアンサンブル学習を
近似的に行っていると見做すことができる．

ドロップアウトは重み減衰やスパース活動正則化といった標準的で
計算コストの低い他の正則化手法より効果的であることが示されている．
ただし，訓練事例がニューラルネットワークに用いる標準的な量と比して，
極端に小さい場合はその限りではないという結果も得られている．

また，ドロップアウトを用いることで各隠れユニットは他の隠れユニットが
どのようなものであろうとも性能を発揮できるように学習されるという利点もある．


# 敵対的学習
ニューラルネットワークは高い線型性を持っているため，入力値の小さな変化に対して
大きく反応してしまうことがある．
例えばパンダの画像にノイズを混ぜると，
人間はその画像をただのパンダの画像としか認知できないが，
元の画像ではパンダと認識できていた深層学習モデルはそれをテナガザルと推論することもある．
この事例を逆手に取り，例えばノイズを加えた画像を訓練事例に含めていくことで
誤り率を減少させることが可能である．


# 接距離，接線伝播法，多様体接分類器
次元の呪いを克服するため，機械学習の分野では多様体仮説を元に学習を行うことが多い．
接距離アルゴリズムと接線伝播アルゴリズムはその仮説をそのままアルゴリズムに持ち込む．
特に接線伝播法はデータ集合拡張や二重逆伝播法，敵対的学習などと関係する．


# まとめ
*ドロップアウトと早期学習を組み合わせておけばなんかうまい感じによしなになりそうな説！*
