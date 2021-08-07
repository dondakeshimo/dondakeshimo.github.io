---
title: 'modern C++erの流儀'
date: '2020-11-23'
tags: [cpp]
path: blog/effective-modern-cpp
cover: ./preview.png
excerpt: C++11以降大きく変わったC++をどの様に扱うべきかを記したEffective Modern C++を読んだのでまとめる
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---

# モチベーション
私は業務でC++を使用している。
聞いて驚いてほしいことに最近までのC++のコンパイラはC++98までしか理解しないものだった。
過去形ということでお気づきだと思うが、つい最近、
と言っても数ヶ月前だがコンパイラを新しいものに変えC++11をコンパイルする準備ができた。
私はまだC++を使い始めて1年経っておらず、C++98の範囲でさえ分かっているとは言い難い状況だが、
嫌だからこそ、この機にモダンなC++の書き方というものを学びたく思い
[Effective Modern C++](https://www.oreilly.co.jp/books/9784873117362/) を購入した。
やや嘘をついた、上述の本を購入したのは実はC++を学び始めてすぐで1年ほど前である。
C++初学者であった私にこの書籍はあまりに難しく当時は挫折した。
1年の修行期間を経てリベンジした結果なんとか完走することができたので、
実際に自分が使いそうなものや覚えておいた方が良さそうなことをここにまとめる。


# Effective Modern C++

## 目次


## 型推論にまつわる流儀

#### テンプレートとauto

型推論を行う代表的な場面がテンプレートを使用した場合とautoを宣言した場合となる。
テンプレートとautoの型推論は基本的に同じものであるため、
まずはテンプレートを例にとってどの様な型推論が行われるか理解する。

```cpp
template<typename T>
void f(ParamType param);

f(expr);
```

この場合 _T_ の推論には呼び出しの型だけではなく _ParamType_ の型にも左右される。
具体的には以下の様に場合分けできる

* _ParamType_ が参照もしくはポインタだがユニヴァーサル参照ではない
* _ParamType_ がユニヴァーサル参照である
* _ParamType_ がポインタでも参照でもない

##### _ParamType_が参照もしくはポインタだがユニヴァーサル参照ではない

1. _expr_ が参照型ならば、参照性を無視する
2. _expr_ の型を _ParamType_ とパターンマッチングし、 **T** を決定する

##### _ParamType_ がユニヴァーサル参照である

- _expr_ が左辺値ならば、 **T** も _ParamType_ も左辺値参照と推論される
- _expr_ が右辺値ならば、先述の規則が適用される

##### _ParamType_ がポインタでも参照でもない

1. _expr_ の型が参照ならば、参照性を無視する
2. 参照性を無視した _expr_ の型が **const** , **volatile** であればこれを無視する

##### ポインタへの成り下がり

配列または関数実引数はテンプレートの型推論時にポインタに成り下がる

##### autoとテンプレート推論の差異

autoとテンプレートの型推論はほとんど同一のアルゴリズムで解決される。
ただ一つの違いはautoが波括弧で囲んだ初期化子をstd::initilizer\_listと *想定する* のに対し、
テンプレートの型推論は想定しないと言う点だ。

##### 明示的型宣言よりもautoを優先する

- autoで宣言した変数は初期化する必要があり未定義動作を防げる
- 一般に可搬性や効率に関する問題を引き起こす型の不一致を防げる
- 型の暗黙的変換が行われないため意図的に変更させる必要があり可読性が上がる(明示的片付け初期化子の使用)
- リファクタリングを容易にする
- タイプ量が減る
- プロクシ型はautoに誤った型を推論させるので注意する

#### decltype

decltype は変数を与えるとその型を返す関数である。

```cpp
vector<int> v;  // decltype(v) is vector<int>
```

使用用途として戻り型が仮引数の型により決定される関数テンプレートの宣言が挙げられる。

```cpp
// c++11 version
template<typename Container, typename Index>
auto sampleContainerAccesser(Container& c, Index i) -> decltype(c[i]) {
    return c[i];
}

// c++14 version
template<typename Container, typename Index>
decltype(auto) sampleContainerAccesser(Container& c, Index i) {
    return c[i];
}
```

上記の記法は **戻り型の後置** (trailing return type) と呼ばれているものである。
上記の例は改良の余地があり、一つは右辺値を受け付ける必要があること、
もう一つは返り値を必要なら右辺値にする方が効率が良いことだ。それらを反映させると

```cpp
// c++11 version
template<typename Container, typename Index>
auto sampleContainerAccesser(Container&& c, Index i) -> decltype(std::forward<Container>(c)[i]) {
    return std::forward<Container>(c)[i];
}

// c++14 version
template<typename Container, typename Index>
decltype(auto) sampleContainerAccesser(Container& c, Index i) {
    return std::forward<Container>(c)[i];
}
```

std::forwardについては後続の説明に記載予定。

##### decltypeの注意点

変数を括弧で囲むと参照が付与されてしまうので注意。

```cpp
int x = 0;
decltype(x);    // -> int
decltype((x));  // -> int&
```


## ポインタにまつわる流儀

#### std::unique_ptr

独立するリソースの管理には std::unique\_ptr を使用する。
std::unique\_ptrはムーブ専用型であり、独占所有セマンティクスを所有する。

std::unique\_ptrのインターフェースは二つあり、カスタムデリータを引数にとるものと取らないものがある。
カスタムデリータにはラムダ式を使用した方が時間、空間計算量が優れる。
カスタムデリータを用いる際の注意点としてstd::unique\_ptr 自体のメモリ使用量が増加することが挙げられる。

std::unique\_ptrの大きな魅力は独占所有権を有しながら、std::shared\_ptrへの変換が簡単なことだ。
これはfactory関数の戻り型としてstd::unique\_ptrが非常に優れている理由となる。
関数側からはポインタが共有されるべきか独占されるべきか判断できないため、
呼び出し側で好きに置き換えが可能なことで柔軟性を保持している。

#### std::shared_ptr

共同所有権を必要とするリソースの管理にはstd::shared\_ptrを利用する。
std::shared\_ptrはreference countから地震がそのリソースを指す最後のポインタか否かを判断できる。
即ちstd::shared\_ptrのコンストラクタはreference countをインクリメントし、
デストラクタはデクリメントする。

reference countを保持することでrawポインタと比較して性能面に負債を背負うこととなる。

- std::shared\_ptrのサイズがrawポインタの2倍になる
- reference countをダイナミックにメモリ割り当てする必要がある
    - std::make\_sharedの利用により回避できる
- reference countのincrement/decrementはアトミックに実行する必要がある
    - move演算をすることによってreference countを操作しなくて済む

std::shared\_ptrもstd::unique\_ptrと同様にカスタムデリータを指定できる。
これら二つのカスタムデリータを指定したスマートポインタは型にデリータを含むかどうかで差異が存在する。

```cpp
// deleter type is part of ptr type
std::unique_ptr<Widget, decltype(loggingDel)> upw(new Widget, loggingDel);

// deleter type is not part of ptr type
std::unique_ptr<Widget> spw(new Widget, loggingDel);
```

これらはポインタの取り回しの柔軟性にも差異を与える。
例えばコンテナ型に上記のポインタを代入することを考えると、
std::unique\_ptrは全て同一のカスタムデリータを指定しない限りコンテナにまとめることができないが、
std::shared\_ptrは自由にカスタムデリータを指定できる。

std::shared\_ptrはreference countを含むコントロールブロックと呼ばれるデータを所有している。
コントロールブロック内にカスタムデリータのデータも含まれるため、
std::shared\_ptrはstd::unique\_ptrと違いカスタムデリータを指定してもサイズが大きくならない。

コントロールブロックは対象オブジェクトを指すstd::shard\_ptrを最初に作成した関数が設定する。
ただし、一般にstd::shared\_ptrが既に存在しているかを知る方法はないため、下記のルールを適用する。

- std::make\_sharedは常にコントロールブロックを作成する
- 所有権が一意なポインタからstd::shared\_ptrを作成した場合は常にコントロールブロックを作成する
- rawポインタを与えstd::shared\_ptrコンストラクタを呼び出した場合はコントロールブロックを作成する

上記のルールからrawポインタをコンストラクタに複数か渡すことで
バグの温床と非効率なコードが生成されることとなる。
上述の理由からクラス設計において自身のポインタ **this** を使用したいシーンがあるが、
その際にstd::shared\_ptrのコンストラクタへthisを渡していないか注意する必要がある。
自身のポインタをstd::shared\_ptrとして扱う必要がある場合は基底クラステンプレートとして
std::enbale\_shared\_from\_thisクラスを利用し、thisの代わりにshard\_from\_this()を使用する。

#### std::weak_ptr

std::shared\_ptrのように振る舞いながらも、対象リソースの所有権を共有しない
スマートポインタが有用になる場面がある。
この種のスマートポインタは対象が破棄された場合を考え、ポインタが不正(dangle)になったことを追跡管理し、
問題に対応すル必要がある。
これらを賄うC++のスマートポインタがstd::weak\_ptrとなる。

std::weak\_ptrは必ずstd::shared\_ptrに付随して使用される。
std::weak\_ptrのコンストラクタにstd::shared\_ptrを作成した時点から両者は同じメモリ上の位置を指し示す。
ただし、std::weak\_ptrは対象オブジェクトのreference countには影響を及ぼさない。

不正ポインタとなったstd::weak\_ptrを **expireされた** と表現する。
スマートポインタが不正かどうかを判定するには `wpw.expired()` を呼び出せば良いが、
一般に不正判定する目的は対象オブジェクトに無事アクセスできるかを確認することであり、
不正判定からアクセスまでの一連の処理がアトミックに行われる必要がある。
これを実現するためにはstd::weak\_ptrをstd::shared\_ptrに変換してやれば良い。
`wpw.lock()` を用いて初期化する方法とstd::shared\_ptrのコンストラクタに直接渡す方法がある。

std::weak\_ptrは不正になる可能性のあるstd::shared\_ptrライクなポインタで使用し、
具体的な利用先としては下記のようなパターンが挙げられる。

- キャッシュ
- observer リスト
- std::shared\_ptrの循環防止

#### newの可能な範囲での撲滅

newを回避するためにstd::make\_uniqueとstd::make\_sharedを積極的に使用する。
ただし、std::make\_uniqueについてはC++14以降に追加された関数のため、以下に実装例を記す。

```cpp
template<typename T, typename... Ts>
std::unique_ptr<T> make_unique(Ts&&... params) {
    return std::unique_ptr<T>(new T(std::forward<Ts>(params)...));
}
```

std namespaceに上記関数を置いた場合、C++14にアップグレードした際に衝突するため注意。

newの直接使用と比較してmake関数はソースコードの重複を避け、例外安全性を向上できる。
また、std::make\_sharedおよびstd::allocate\_sharedでは高速化つサイズの小さなコードを生成できる。

make関数を使用できないシーンにはカスタムデリータを指定する場合と波括弧による初期化を目的とする場合の
二つがある。

std::shared\_ptrの場合ではmake関数が適切でない場面が増え、専用のメモリ管理を実装したクラスや、
メモリに特別な注意が必要なシステム、巨大オブジェクト、
対応するstd::shared\_ptrとは異なるライフタイムを持つstd::weak\_ptrなどが挙げられる。


## moveにまつわる流儀

#### std::move, std::forward

std::moveおよびstd::forwardはキャストを実行する関数にすぎず、関数内でムーブ演算は実行されない。

std::moveは右辺値への無条件キャストを実行する。

std::forwardは実引数が右辺値にバインドされている場合に限り、その実引数を右辺値へキャストする。

std::moveもstd::forwardもプログラム実行時には何も実行しない。

#### ユニヴァーサル参照, 右辺値参照

```cpp
void f(Widget&& param);          // rvalue reference

Widget&& var1 = Widget();        // rvalue reference

auto&& var2 = var1;              // universal reference

template<typename T>
void f(std::vector<T>&& param);  // rvalue reference

template <typename T>
void f(T&& param);               // universal reference
```

上記のコードから察せられるように「T&&」には二つの意味がある。
一つは右辺値参照であり、もう一つは右辺値参照か左辺値参照のどちらか一方を表すことである。
後者は型推論を伴うTに対し右辺値参照の記法を用いた際に発動する構文であり、
参照の初期化を行う際の初期化子が右辺値なら右辺値参照を、
左辺値なら左辺値参照をを表す。

#### 右辺値参照ならstd::move, ユニヴァーサル参照ならstd::forward

std::moveは右辺値参照に対し、std::forwardは最後に使用するユニヴァーサル参照に対し、
それぞれ実行するべきである。
これは値戻しする関数から返す右辺値参照、ユニヴァーサル参照についても同様のことが言える。

ただし、 **戻り値の最適化(return value optimization, RVO)** が適用される関数ではその限りではない。
RVOとは値戻しの関数において下記条件を満たした際にコピーを省略する仕様のことである。

- ローカルオブジェクトの型が関数の戻り値の型に一致している
- 戻り値となるのがそのローカルオブジェクトである

この場合、std::move等を返り値に適用してしまうとRVOが発動せず結果的に効率の悪いコードになってしまう。

#### ユニヴァーサル参照をとるオーバーロードの撲滅

ユニヴァーサル参照をとるオーバーロードを加えると、予想以上に多くの場面で、
ほぼ常にユニヴァーサル参照をとるオーバーロードが呼び出される。
完全転送コンストラクタは特に問題になる。非constな左辺値をとるコピーコンストラクタよりも
一致度が高くなるのが通例であり、派生クラスからの基底クラスの
コピー/ムーブコンストラクタ呼び出しをのっとってしまうためである。

ユニヴァーサル参照をとるオーバーロードの代替策としては

- オーバーロードしない
- const T&を渡す
- 値を渡す
- タグディスパッチを用いる

がある。

#### 参照の圧縮

参照の圧縮とは型推論などの過程で参照の参照をコンパイラが生成した際に、
単一の参照に変換する動作のことである。
_二つある参照のいずれかが左辺値参照であれば、圧縮結果は左辺値参照となる。二つとも右辺値参照の場合は、圧縮結果は右辺値参照となる。_

参照の圧縮が発生する場面は4つある。

- テンプレートのインスタンス化
- autoの型生成
- typedefとエイリアス宣言の使用と作成
- decltype

#### 完全転送

完全転送とはある関数が仮引数を他の関数へ渡す挙動であり、単なる転送と異なり、
仮引数のオブジェクトの性質(オブジェクトの型、左辺値か右辺値かなど)も転送する。
使用例としては下記のようになる。

```cpp
template<typename... Ts>
void fwd(Ts&&... params) {
    f(std::forward<Ts>(params)...)
}
```

完全転送はほとんどの場合意図通りに動作するが、まれに完全でない部分が露見する。
条例の目的関数fと転送関数fwdでは、同じ実引数に対する両者の動作が異なると完全転送できない。

完全転送できない場合は二つで、fwdの仮引数の方を推論できない、
または誤った方を推論した場合、完全転送がエラーになる。

完全転送のエラー原因となる実引数には、

- 波括弧による初期化子
- ヌルポインタとして用いた0やNULL
- 宣言のみのconst staticな汎整数メンバ変数
- テンプレート名
- オーバーロード関数名
- ビットフィールド

などがある。


## モダンC++の流儀

#### 初期化子の統一

初期化の方法は大きく以下の三つの記法に分類される。

```cpp
int x(0);

int y = 0;

int z{ 0 };
```

多くの場合、等号と波括弧は併用できるが、波括弧のみの時と同じのため等号はこの項では無視する。

C++11になり、初期化子の統一記法を導入したことで
波括弧による初期化が概ねどのような場面でも適用できるようになった。
そのため、これまで等号と丸括弧を場面場面で使い分けていたコピー不可能なオブジェクトの初期化や、
非スタティックなメンバ変数のdefault値の指定に加えて、等号と丸括弧では表現できなかった
コンテナの初期要素の指定も全て波括弧を用いて行えるようになった。

波括弧を用いることのもう一つのメリットとして **精度が落ちる変換(narrowing conversion)** を認めない
という特徴がある。

```cpp
double x, y, z;
int sum{ x + y + z }; // error!
```

これは **最も厄介な構文解析(most vexing parse)** と呼ばれる問題を回避できる。

```cpp
Widget w1(10);  // call Widget ctor with argument 10
Widget w2();    // declares a function named w2 that returns a Widget
```

波括弧の初期化子のデメリットはstd::initializer\_listをとみなせる仮引数が渡された際に、
見た目ではより高く一致するコンストラクタが他にあってもstd::initializer\_listをとるコンストラクタに
解決されてしまうことである。
これは混乱を生む場合がある。

丸括弧と波括弧の選択が生む差異の例としては下記のようなものもある。

```cpp
std::vector<int> v1(3, 5);  // [5, 5, 5]

std::vector<int> v2{3, 5};  // [3, 5]
```

結局波括弧ではないと初期化できないものがある一方、丸括弧を用いないと混乱を招く初期化もあり、
どちらの方を使うべきということはない。
開発ルールを定めることが肝要である。

ただし、他社が利用する可能性のあるライブラリの
テンプレート関数内でのオブジェクト作成に際しては関数の挙動自体が左右されてしまうので
単なる開発ルールにとどまらずよく吟味する必要がある。

#### nullptr

**0とNULLは常にint型である**。  
0やNULLをヌルポインタとして利用するしかなかったが、nullptrが実装されたためその必要性は無くなった。  
**nullptrはポインタ型である。**  
そのためオーバーロードで妙な解決をされることもない。
常にnullptrを使用すべきである。

ただし、これまでと違いnullptrがあるからと言って汎整数型とポインタ型のオーバーロードを行うと
これまで動作していた呼び出し側で意図しないオーバーロード解決されてしまうことになりかねないので注意する。

#### エイリアス宣言

長ったらしい型宣言を簡略化する際のtypedefの上位互換としてエイリアス宣言が実装された。

```cpp
typedef std::unique_ptr<std::unordered_map<std::string, std::string>> UPtrMapSS;

using UPtrMapSS = std::unique_ptr<std::unordered_map<std::string, std::string>>;


typedef void (*FP)(int, const std::string&);

using FP = void(*)(int, const std::string&);
```

typedefはテンプレート化に対応していないが、エイリアス宣言は対応しているため、気持ちの悪いネストをする必要がなくなった。

また、エイリアステンプレートを用いれば、「::type」や「typename」を排除できる。

#### scoped enum

C++98まではenum型はスコープを持たなかった。
C++11ではこれが是正され、スコープを持つenum型が導入された。
scoped enumの宣言は `enum class` と表記する。

単にスコープを持ち名前空間を汚さないようになっただけでなく、
列挙子が暗黙に他の型に変換されることもなくなった。
これまでのように列挙子を数値等と比較したい場合はキャストを利用する。

enumでは基礎とする方の指定が可能である。
スコープを持つenumの基礎とする型のdefaultはintである。
スコープを持たないenumはdefaultが存在しない。
enumの前方宣言は基礎とする型が存在する場合可能である。

#### 未定義private関数の撲滅

未定義の関数を呼び出し側に使用されたくない際、C++98ではprivateな関数とすることで秘匿にしていた。
C++11以降ではprivateとして間接的に使用を禁止するのではなく **deleteされた関数 (deleted function)**
とすることで上記の要件を満たすことができる。
加えて、deleteを利用した場合はコンパイル時に不正なアクセスを検知できる。
private宣言のものをfriend関数内から利用しようとした際などはリンク時まで不正なアクセスを発見できない。

また、非メンバ関数、テンプレートのインスタンス化も含め、どんな関数でもdeleteできる。

以上より、使用を禁止したい関数に対してはdeleteを使用する。

```cpp
bool isLucky(int) = delete;
```

#### overrideの宣言

オーバーライドを実装したい場合、オーバーライドを満たす様にクラスおよびメンバ関数を実装すれば
自動的にメンバ関数がオーバーライドされる。
しかしこの仕様には問題点もあり、
大きなものの一つがオーバーライドしたつもりができていない場合があることだ。
しかもその誤りをコンパイラは教えてくれない。

上述の問題点を回避するためにC++11以降ではオーバーライドしたい関数には明示的に `override` 宣言を用いる。

override宣言にはコンパイラ、実装者へのオーバーライドの明示化以外に、
メンバ関数の参照修飾子を用いると左辺値オブジェクトと右辺値オブジェクトを
区別することができるというメリットもある。

#### const\_iterator

一般に可能な場面ではtuneniconstを使用せよと言われており、iteratorでもそれは例外ではない。
const\_iteratorとはSTLが用意したconstをさすポインタ相当のiteratorであり
可能な場面ではこれを使用すべきである。

C++98でもC++11でも上記のルールは適用されるが、C++98でのconst\_iteratorは扱いが煩雑だ。
C++11ではこれが大幅に改良されており現実的に上述のルールに従うことが可能になった。

よって常にiteratorよりもconst\_iteratorを優先して使用する。

#### noexcept, constexpr

##### noexcept

C++11では、関数が例外を発生させないことをnoexceptにより明示できる。

```cpp
int f(int x) noexcept;
```

C++11からプログラムの仕様が変更され、`noexcept` を指定することでコンパイラが最適化する機会が生まれる。

##### constexpr

ある変数がコンパイル時定数を必要とする場面で使用可能なことをコンパイラに保証してもらうために
constexprが存在する。

可能な場面では常にconstexprを使用することで実行時ではなくコンパイル時に可能な範囲の演算が行われ、
処理が軽やかになる。

注意点はconstexprの宣言を解除すると呼び出し側で大量のエラーが発生する可能性があることだ。
constexprを宣言した後は以降constexpr宣言を削除しないと断ぜられる様にすることに留意する。

#### 要素の挿入, 直接配置

std::vectorに要素を追加する時、一般的に使用される関数はpush\_backである。
しかし、emplace\_backを使用した方が効率良い場面がある。

原則として挿入関数と比べ、同等機能の直接配置関数が効率性に優れることはあるが劣ることはない。
ただし、挿入関数なら拒否する様な型変換でも直接配置関数は実行する場合がある。

直接配置関数が実際に高速に実行されるのは下記の場合である。

- 追加する値がコンテナ内に代入ではなくコンストラクトされる
- 実引数の型がコンテナ要素の型とは異なる
- コンテナが重複すを理由に値の追加を拒否しない
