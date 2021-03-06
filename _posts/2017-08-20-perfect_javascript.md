---
title: 'JavaScriptの勉強始めました'
date: '2017-08-20'
tags: [javascript, book]
path: blog/perfect-javascript
cover: ./preview.png
excerpt: Perfect JavaScriptの自分用まとめ
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---
# 目次


# JavaScript始めました

本当はインターンでずっと使ってたんですけど、
一切体系的に学んでおらず、
なぁなぁでコーディングをそろそろ脱却せねばと一念発起いたしました。

[パーフェクト JavaScript](https://www.amazon.co.jp/dp/B00P2EG5LC/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1)

上司の方にこの本とかがいいんじゃない？と言われ、
**即購入、その間30秒。**
失敗したのは当日暇だったので
普通に大学で買えば当日から始められたのにということですね！<br>
ということで、今読んでる最中なのですが、
入門書に関しては読んだ後にレビューではなくて、
要点を読みながら書いた方が絶対いい気がするので、
章が終わるたびに書き足して行っています！


# JavaScriptの概要

ブラウザ戦争とかいうものがあって、
ブラウザの独自拡張が繰り返された時代があったそうな、
JavaScriptもその戦争のせいか、
はたまた醜い人間たちの性か、
独自拡張性が高い言語になってしまったそうな。
これでは非常に使いづらいということで、ECMAScriptなる規格が発足。
現状では、JavaScriptが新しい機能を備えたバージョンを開発していき、
それに対してECMAScriptが順次それを規格化していくという流れだったような。
とりあえずは規格化されたECMAScriptを使っていれば安心ってことなのだな？


# JavaScriptの基本仕様

## JavaScriptの型について

#### JavaScriptの基本型

* 文字列型
* 数値型
* ブーリアン型
* null型
* undefined型

上記の5つが基本型となり、その他を全てオブジェクト型という。


#### 基本型のオブジェクト型

適切な表現が思いつかなかったので意味不明な題名。
上記5つの基本型に対応するオブジェクト型、クラスが存在する。
しかし、暗黙の型変換(基本型 <=> オブジェクト型)
によってその存在は認識していなくても
実質問題ないっぽい。
ので、頭の片隅にしまいながら、
基本的には忘れていて大丈夫っぽいというか、
積極的に忘れて暗黙の型変換を使っていくのがベストプラクティスなのだとか。


#### 型変換(数値型 <=> 文字列型)のイディオム

クライアントにjsファイルをぶん投げる際、
なるだけ短い文章で書いた方が通信量が抑えられて良いということから、
暗黙の型変換を使った最短表記がしばしば用いられるそうな。
可読性は低そうだけどよく使うなら慣れておかねばだ。

    // 数値から文字列
    var n = 3;
    n+'';

    // 文字列から数値
    var s = '3';
    +s;



## JavaScriptの式と文
式式文文式文文 む〜ら〜さ〜ぁき<br>
どこかの歌手が頭から離れない章名。

* ソースコードは文から構成される
* 文は文と式から構成される
* 式は式と演算子から構成される

呪文でしょうか、いいえ誰でも。。?

### 文の種類
基本的に文は;で区切られた一区画を指す。その種類として

* ブロック文(複合文)({}で囲まれたもの)
* 変数宣言文
* 関数宣言文
* 式文
* 空文
* 制御文
    * if-else文
    * switch-case文
* 繰り返し文
    * while文
    * do-while文
    * for文
    * for in文
    * for each in文(JavaScript独自拡張)
* break文
* continue文
* return文
* 例外(throw)

基本的に意味不明で特殊なものはないかな？
(for inとfor each inはなんか注意点いっぱいで使うの怖い)

### 式の種類
文と同じようにまずは列挙して同値演算子だけあとで取り上げます。
式はオペランドと演算子に分けられるらしく、
その式を特徴付けるのは演算子なので実質演算子列挙になります！

* 算術演算子
* 文字列連結演算子
* 同値演算子
* 比較演算子
* in演算子
* instanceof演算子
* 論理演算子(&&)
* ビット演算子(俺多分しばらく使わない)
* 代入演算子
* 算術代入演算子(+=)
* 条件演算子
* 条件演算子(3項演算子)
* new演算子
* delete演算子
* void演算子
* カンマ演算子
* ドット演算子とブラケット演算子
* 関数呼び出し演算子

##### 同値演算子
JavaScriptの同値演算子のやばいポイントは、

* ==
* ===

と、二種類の演算子があることに尽きる。<br>
==だと暗黙の型変換込みでの同値演算子。<br>
===だと型も含めて同値であるかの判定を行うらしいぞ！


# 基本仕様後半戦！
ここからが難しいところなのでしょうね。
気合をいれて臨みたいと思います。
まじで早くNode.jsまでたどり着きたい！


# 変数とオブジェクト

### 代入

* 基本型のリテラルは値を代入
* それ以外のオブジェクトは参照を代入

だけとりあえず覚えておけば良さそう！
バイト先でオブジェクトの値コピー方法を何回もググってる気がするけど、
未だにどれが正解かわかっていない。

### オブジェクト
めちゃくちゃ長くて、
ちょっと難しすぎたから割と読み飛ばしてしまった。
おそらく著者が言いたかったことのエッセンスは

* 基本型以外のものは全てオブジェクト
* オブジェクトそれ自体には名前がなく、
  名前がある変数などに参照を代入することで固有の名前を得る
* オブジェクトは内部にプロパティを持ち、
  アクセスはドットかブラケット
* 連想配列としての使い方もある
* this参照には注意が必要
* 実質のクラスとしても使用可能
* クラスの継承みたいなのはプロトタイプ継承というものによって行われる
* 型判定やプロパティの列挙は汎用性が高すぎるせいで多少面倒

### 大変だった5章
この章めちゃくちゃ長くて力入れてるのがひしひしと伝わってきたものの、
めちゃくちゃ意味不でめちゃくちゃ眠かった(2,3回じゃないほどの寝落ち)。
しかし頑張っていきたいと思います。。


# 関数とクロージャ

### スコープ

* ブロックスコープがJavaScriptにはない。
* JS独自拡張の変数宣言にletがありそれはブロックスコープがある
* 後は基本Pythonと同じ

### クロージャ
言葉遣いは難解だったけど、
過去最高にわかりやすかった気がする。

    function() {
      var cnt = 0;
      return function() { return ++cnt; }
    }

    var fn = f();
    fn();  // 1
    fn();  // 2
    fn();  // 3

上記コードのように関数呼び出し時に関数を返すようにすると、
関数呼び出し時に生成されるCallオブジェクトなるものが
消去できなくなるため、ずっと同様のCallオブジェクトで
この関数オブジェクトが呼び出されることとなり、
関数内の情報が保存されるという仕組みらしい。

### モジュールがない
モジュールっぽい概念が言語仕様上はないらしいです。
一つのプロジェクトのグローバル変数が共有されるので、
大事故につながる恐れがあります。
そのため、一つのファイルをクラスのように括ってしまうなどの
対策が迫られるらしいのですが、それでもprivateな変数は作れません。
そこでクロージャ！みたいな感じの話でした。


# データ処理

* 配列
* JSON
* Date()
* 正規表現

についての記載があった。
配列に関してはものすごく詳しく書かれていたが、
実用上はそれほど細かい知識は必要なさそうなので割と目を通した程度。<br>
JSONはeval関数を使わないこと。<br>
Date関数はクライアントサイドで使うと面倒なことと、
実行環境に依存すること。<br>
正規表現はリテラル表現が存在し、

    var reg = /^\s+/;  // 先頭文字が空白
    var reg = new RegExp('^\\s+');

のように記述する。他にもStringオブジェクト側から、
引数に正規表現を用いる技法も存在するが、
ここの難点は主に正規表現そのものなので、
JavaScript側で難しいことはそれほどないと思う。


# まとめ
これでJavaScript基本仕様については終了！
らしいがこれで実際にコードちゃんと読めるかは微妙なラインな気がする。
理由としては、 **コード規約自体は簡単なのに、変なイディオムとか
メソッドチェーンとかコールバック関数とか見慣れない使い方が多い**
みたいな感じやと思う。

##### つまり、結論
慣れが大事。

##### 次回からはクライアントサイドの説明をしてくれるそうです！
