---
title: 'Grokking Simplicity'
date: '2025-08-23'
tags: [functional-programming, book]
cover: ./preview.jpg
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
excerpt: Grokking Simplicityの私的なまとめ
---

# 目次

# 概要

## 内容

[Grokking Simplicity](https://ericnormand.me/grokking-simplicity) を読んだので、私的なまとめを残しておきます。

## 対象読者

- 自分
- Grokking Simplicityを読んで、内容をぼんやり思い出したい人
- これからGrokking Simplicityを読もうとしている人

# 書籍の動機

- 関数型プログラミングのエッセンスは関数型言語以外でも応用可能である。
- 関数型プログラミングの書籍は学術的なものが多く、現場のエンジニアの目に止まりづらい。
- 現場で広く利用されているJavaScriptのコードを改善していく過程を説明することで関数型プログラミングの恩恵を説明する。

# 原則

## Data, Calculation, Action

### 定義

以下はGrokking Simplicityからの引用です。

> Actions
>
> Depend on how many times or when it is run
>
> Also called functions with side-effects, side-effecting functions, impure functions
>
> Examples: Send an email, read from a database

> Calculations
>
> Computations from input to output
>
> Also called pure functions, mathematical functions
>
> Examples: Find the maximum number, check if an email address is valid

> Data
>
> Facts about events
>
> Examples: The email address a user gave us, the dollar amount read from a bank’s API

### 基本方針

この分類は排他的であり、全てのオブジェクトをこの3つに分類できます。

定義よりコールツリーを見たときに以下のことが言えます。

- ActionはAction, Calculation, Dataから構成される
- CalculationはCalculation, Dataから構成される
- DataはDataからのみ構成される

上記よりActionを内部で呼び出している処理はすべてActionになることには注意が必要です。

Dataはイベントや事実であることから不変であるとして表現します。

関数型プログラミングではDataをCacluationより優先し、CalculationをActionより優先します。
Calculationは常に同じDataを返却し、呼び出し元へいかなる変更も与えないため、Actionよりもテストが圧倒的に容易です。

### Cacluationの抽出

関数の中の暗黙的な入出力 (グローバル変数からの読み出し、標準出力への書き込みなど) を全て明示的な入出力 (引数と返り値) に変換できればその関数はCaclculationです。

Actionから明示的な入出力を扱える箇所を抜き出してCalculationとして定義していきましょう。

### copy-on-write

プログラム中で情報の変更が発生する場合、DataとCalculationの定義より直接そのオブジェクトを変更することはできません。

そこで、Dataを不変として扱うためにcopy-on-write原則を適用します。
Dataを書き換えたい時は元のDataのコピーを作成し、コピーを書き換えます。

mutableなオブジェクトを読み出す関数はすべてActionとなります。
Actionはテストが難しく再利用性も低いため、できるだけ避けることが重要です。
よって、引数は基本的にDataを受け取れるように設計します。

copy-on-writeはパフォーマンス観点でも不利とは限りません。
基本的にはshallow copyで十分のため、アロケーションコストが高くつくことは稀です。

### Defensive copying

copy-on-write原則に則っているコード範囲でCacluationを呼び出すことは安全です。
一方で、レガシーなコードやOwnerが異なるコードについてはcopy-on-writeが適用されていない可能性があります。
この場合、Calculationかどうかの判断をつけるのが難しいため、Defensive copyingというテクニックを用いて、安全な範囲を構築します。

実施することは簡単で、範囲外のコードを呼び出す際には渡す情報のコピーを作成して、呼び出した後にコピーしておいた情報で再度上書きして範囲内での不変性を保ちます。

## Stratified Design

### Stratified Designとは

Stratified Designとは機能を抽象のレイヤーで分けて管理する設計手法です。
変更容易性、可読性、テスト容易性、再利用性を向上させることができます。

コールツリー (書籍ではcall graphと呼んでいます) を見たときに、矢印が同じ長さになるようにすることが望ましいです。
つまり、あるレイヤーの処理が依存する処理群はおよそ同じレイヤーに属しているべきです。

別のレイヤーへ公開する関数はレイヤー間のインターフェースとなります。
インターフェースは最小にした上で十分抽象化したものを提供するべきです。

### 書籍外の情報

[kawasimaさんのブログ](https://scrapbox.io/kawasima/Stratified_Design) に背景や補足情報がまとまっているので一読をおすすめします。

以下は関連用語のメモです。

- Strata
- IOSP

# 実装

## 関数を渡す

関数を引数へ渡す選択肢を持つことで表現力が上がります。

- オブジェクトの属性の指定
- 演算子の指定

などを引数から行うことができます。
これによって、関数をよりDRYにすることが可能です。

また、繰り返し発生するラップパターンなどもDRYにできます。
例えば書籍では例外をキャッチしてログを出力するパターンなどが挙げられています。

## イテレーション

copy-on-writeに則ると繰り返し処理が増えていきます。
map, filter, reduceはそれらを簡潔に記述できます。

また、map, filter, reduceを繋げることで処理を簡潔に表現できます。

関数型言語にはmap, filter, reduce以外にも便利な反復処理用の関数が用意されていることが多いそうです。

## 並行処理

Actionは並行して実行される可能性があるので、それらはタイムラインをまとめて整理するとよいです。

(あまり目新しい感じではなかったのでだいぶ読み飛ばしてしまったので、機会があれば再度読みたいです。)

# 設計

## リアクティブアーキテクチャ

### 概要

イベントを検知する処理をトリガーするような設計です。

GoFのデザインパターンでいうObserverパターンに近いです。
以下に代表的なデザインパターンを紹介します。

### ValueCell

リアクティブアーキテクチャにおける一つ目のデザインパターンは値の更新を検知できるようにするValueCellです。

```javascript
function ValueCell(initalValue) {}
  var currentValue = initalValue;
  var watchers = [];
  return {
    val: function() {
      return currentValue;
    },
    update: function(f) {
      var oldValue = currentValue;
      var newValue = f(oldValue);
      if (oldValue !== newValue) {
        currentValue = newValue;
        forEach(watchers, function(watcher) {
          watcher(newValue);
        });
      }
    },
    addWatcher: function(f) {
      watchers.push(f);
    },
  };
}
```

### FormulaCell

ValueCellの値が更新されたときに自動的に更新されるFormulaCellというデザインパターンもあります。

```javascript
function FormulaCell(upstreamCell, f) {
  var myCell = ValueCell(f(upstreamCell.val()));
  upstreamCell.addWatcher(function(newUpstreamValue) {
    myCell.update(function(currentValue) {
      return f(newUpstreamValue);
    });
  });
  return {
    val: myCell.val,
    addWatcher: myCell.addWatcher
  };
}
```

## オニオンアーキテクチャ

ソフトウェアの大局的な構造として以下の3層が形成されることが多いです。

- interaction
- domain
- language

(馴染みのあるタイトルと図から馴染みのないlanguageが出てきて面食らいました)

interaction層は主にActionで形成されます。
domain層はCalculationとDataのみで形成されます。

# まとめ

原則に記した

- Data, Calculation, Action
- Stratified Design

の2つの考え方は自分の中にぼんやりとあったプログラミングの方針の解像度を一気に引き上げてくれました。

プログラムを設計することの大きな目的はテストの粒度を整えて組合せ爆発を防ぐことにあると考えています。
原則の考え方はプログラム全体を通してテスト容易性を担保できる一貫性のある方針を提供してくれます。

自分が普段扱っている言語は関数型言語ではなく、正直ここまで徹底的に副作用を避け切ることは難しいものの、少なくとも自覚的であることはできるようになりました。

書籍自体はあまりにも長かったため万人に勧めようとは思わなかったのですが、確実に自分の血肉になったとは感じています。
