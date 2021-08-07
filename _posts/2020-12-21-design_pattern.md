---
title: 'デザインパターンについてまとめる'
date: '2020-12-21'
tags: [book]
path: blog/design-pattern
cover: ./preview.png
excerpt: JAVA言語で学ぶデザインパターン入門を読んだのでざっくりまとめる
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---

# 目次


# デザインパターン


## Iterator

```java
for (int i = 0; i < arr.length; i++) {
    System.out.Println(arr[i]);
}
```

上記のような基本的なループは集合体のスキャンを行っている。
上記において一時変数 `i` の働きを抽象化し、一般化したものをIteratorパターンと呼ぶ。

```java
Iterator it = SampleAggregate.iterator();
while (it.hasNext()) {
    Sample sample = (Sample)it.next();
    System.out.Println(sample);
}
```

Iteratorインタフェースによって終了条件と「次」の要素の抽出を抽象化している。
このことで、Sampleクラスの実装とスキャンを独立させることができている。
SampleAggregateがどのようなコンテナを使用しても上記のコードに手を加える必要がない。


## Adapter
「すでに提供されているもの」と「必要なもの」のズレを埋めるためのデザインパターン。
知られている実装方法として継承を用いたものと以上を用いたものがある。
「すでに提供されているもの」をTarget、「必要なもの」をAdaptee、「ズレを埋めるもの」をAdapterとする。

##### 継承を用いたパターン
Targetをインターフェースとしたパターン。
この場合、単一継承のみ可能なJavaでもAdapteeを継承できる。
特にひねりもなくAdapterパターンを使用する時はこちらのパターンで十分と考えられる。
Adapterの宣言が下記のようになる。

```java
public class Adapter extends Adaptee implements Target{
    ...
}
```

##### 委譲を用いたパターン
Targetをクラスとしたパターン。
Targetにstatic functionが必要な場合や、Adapteeを継承すると可読性が落ちるような場合は
Adapteeを委譲することでAdapterパターンを使用することができる。

```java
public class Adapter extends Target {
    private Adaptee adaptee;

    public void targetFunc() {
        adaptee.func();
    }
}
```

既にある十分に時の試練に耐えた実用的なクラスがあった時、そのクラスを利用したいと考えるのは自然である。
その際に、既にあるクラスと今必要なメソッドの小さなズレを解消するために
既にあるクラスを修正してしまった場合、既にあるクラスはまた十分なテストを行う必要が生まれる。
Adapterパターンを用いて既にあるクラスに何も手を加えずに利用した場合は、何かバグが発生しても基本的には
Adapter, Targetのみを疑えば良いことになる。
また、互換性を生み出す際にもAdapterパターンを使用することは有用であり、
この場合は旧バージョンにAdapterパターンを適用することでVersionが異なりインターフェースが変わっても動作するようにできる。


## Template Method
抽象クラスを用いて必要なメソッドと、その利用方法のロジックを先に定義する手法。
抽象クラスにはサブクラスに実装を任せるための抽象メソッドと、抽象クラスから提供するfinalメソッドがある。
サブクラスは抽象メソッド実装し、clientコードは抽象クラスを型としたサブクラスをインスタンス化することで、
同様のfinalメソッドから異なるロジックを引き出すことができる。
このパターンの最も大きな恩恵はfinalメソッドを抽象クラスで定義することで生まれる。
finalメソッド内のロジックはどのサブクラスをインスタンス化しても共通のため、
バグが生まれた箇所を見つけやく、もしfinalメソッドのロジックにバグがあったとしても一箇所中傷メソッドを書き換えればよい。


## Factory Method
Template Methodパターンの応用である。
インスタンスの生成についてTemplate Methodパターンを用いることで、インスタンス生成時のロジックを一様化できる。
インスタンスの生成を担うクラスをFactory、生成されるインスタンスをProductと置くと

```java
pacakge framework;

public abstract class Product {
    public abstract void use();
}
```

```java
package framework;

public abstract class Factory {
    public final Product create(String owner) {
        Product p = create Product(owner);
        registerProduct(p);
        return p;
    }
    protected abstract Product createProduct(String owner);
    protected abstract void registerProduct(Product product);
}
```

上記のように記述することで、

- インスタンス生成のために `create` を用いること
- Stringを引数と取るコンストラクタをProductに記載すること
- Factoryのサブクラスは `createProduct`, `registerProduct` を実装すること

がわかる。
実際にこれらの抽象クラスを適用するサブクラスについてはpackageレベルで独立させることが可能となる。


## Singleton
- 指定したクラスのインスタンスが絶対に一つしか存在しないことを保証したい
- インスタンスが一つしか存在しないことをプログラム上で表現したい

時に使用されるパターンがSingletonパターンである。
コンストラクタをprivateにして、staticフィールドに自クラスのインスタンスを生成し、
そのインスタンスを返却するstatic publicな関数を定義することで実現できる。

```java
public class Singleton {
    private static Singleton singleton = new Singleton();
    private Singleton() {
        System.out.Println("インスタンスを生成しました。");
    }
    public static Singleton getInstance() {
        return singleton;
    }
}
```

上記のFactory MethodパターンにおけるFactoryなどもこのようにSingletonとして記述されることが多い。


## Prototype
- 種類が多すぎてクラスにまとめられない場合
- クラスからのインスタンス生成が難しい場合
- フレームワークと生成するインスタンスを分けたい場合

このような場合、クラス名を指定してインスタンスを生成することが困難となる。
インスタンスから別のインスタンスを生成するパターンをPrototypeパターンと呼び、上記のような課題を解決することができる。

図形エディタアプリケーションを作成することを想定する。
三角や四角などオブジェクトをObjectインタフェースとして定義し、
個々のオブジェクトの詳細実装をTriangleObject, RectangleObjectなどとする。
また、それらのインスタンスを管理するクラスをManager、メインの処理系を記述するクラスをMainクラスとする。

Objectインタフェースは `java.lang.Cloneable` インタフェースを継承する。
上記インタフェースを継承することで、インスタンスのコピー生成が可能になる。

Managerクラスで個々のインスタンスを管理するが、ここでTriangleObjectについて色の情報を付与する必要があるとしよう。
Managerクラスで行えることはインスタンスのコピーと登録である。
Managerクラス内のmapにインスタンスの名称(String)とインスタンスを格納している。
さて、色情報についてだがTriangleObjectのコンストラクタに渡して色情報を付与することが自然であろう。
MainクラスでManagerクラスに機械的に色情報を付与したインスタンスを生成し格納していく。
事前に色情報を付与したインスタンスを生成しておくことで、コピーの下準備が完了する。

マウスを用いた図形エディタを考えると、
図形の座標、スケール、回転角、アスペクト比などが必要になると考えられ、
それらのコピーをエディタ上でを行う際に
1からコンストラクタやセッターに図形の座標などの情報を引き渡すよりも
インスタンスを丸ごとクローンできた方が圧倒的に楽である。

説明が紆余曲折した気がするが、これは私がこのパターンの利点を理解するまでに時間がかかったためである。
このパターンの主な利点はコピー可能性であり、
インスタンスを動的に作成する必要がある時に発揮されると考えている。


## Builder
ビルを建てる時のように基盤から段階的に組み立てていき最終的なインスタンスを生成するパターンである。

登場するクラスは4つであり、
メインプロセスを担当するClient, 実際に組み立てを行うDirector, 組み立ての手順を規定するBuilder,
手順に従って実質的な処理を記載したConcreteBuilderとなる。

Builderは抽象クラスで必要となるすべての手順を先んじて記載しておく必要がある。
Directorは抽象クラスBUilderを用いて構築手順の通りメソッドを呼ぶ。
ConcreteBuilderは実際に使用されるクラスであり、Builderを継承した後に必要な処理を記載する。
以上を踏まえた上でClientのコードを下記に示す。

```java
public class Main {
    public static void main(String[] args) {
        ConcreteBuilder concreteBuilder = new ConcreteBuilder();
        Director director = new Director(concreteBuilder);
        director.construct();
        String result = concreteBuilder.getResult();
        System.out.println(result);
    }
}
```

Builderパターンは交換可能性について大きなアドバンテージを得ることができる。
その反面、Builderクラスには必要十分なメソッド群をあらかじめ定義しておく必要があり、
設計の難易度が高いパターンや、修正の難しいパターンとも言える。

_私見: クラスメソッドのたびに自分のインスタンスを返すことでメソッドチェーンができるようになっているクラスを
よくBuilderクラスと呼んでいることが多い気がするのだが、それとは別のパターンのようである。_


## Abstract Factory
Factoryパターンが決められた手順で製品単体を生み出すパターンだとすれば、
Abstract Factoryパターンは複数の製品群を組み合わせるパターンである。

メインプロセスを担当するClientの他に、Factoryの動作を定義するAbstractFactory抽象クラス、
製品のAPIを規定するAbstractProduct抽象クラス、
実際のFactory動作を記述したConcreteFactoryクラス、
実際の製品の挙動を記したConcreteProductクラスが必要なクラスとなる。
ここで、Productクラスについては複数ある方が自然である。

Factoryクラスでは各Productのインスタンスを作成し返す関数を定義する。
また、依存関係を減らすためにAbstractFactoryクラスにはstatic関数として

```java
public abstract class Factory {
    public static Factory getFactory(String classname) {
        Factory factory = null;
        try {
            factory = (Factory)Class.forName(classname).newInstance();
        } catch (ClassNotFoundException e) {
            System.err.println("クラス " + classname + " が見つかりません。")
        } catch (Exception e) {
            e.printStackTrace(e);
        }
        return factory;
    }
    public abstract ProductA createProductA(String name);
    public abstract ProductB createProductB(ProductA productA, Amount amount);
    public abstract ProductC createProductC();
}
```

のようにクラス名をStringで渡してインスタンスを生成できるようにしておくとよい。

これらを踏まえた上でMain関数は下記のようになる。

```java
import factory.*;

public class Main {
    public static void main(String[] args) {
        Factory factory = Factory.getFactory(args[0]);

        ProductA productA1 = factory.createProductA("A1");
        ProductA productA2 = factory.createProductA("A2");

        ProductB productB1 = factory.createProductB(productA1, 10);
        ProductB productB2 = factory.createProductB(productA2, 4);

        ProductC productC = factory.createProductC();
        productC.add(productB1);
        productC.add(productB2);
        productC.output();
    }
}
```

Abstract Factoryパターンにおいて、ConcreteFactoryの種類を増やすことは容易である。
ただし、組み立てに必要な部品(製品)を増やすことは抽象クラスから書き換える必要があるため、面倒である。
それぞれのConcreteFactory, ConcreteProductの単位でパッケージングを行えばより再利用が容易なものができるが、
機械学習においてパイプラインを構築する際に使用する場合は、部品をすべて同一のパッケージに入れておき、
Factoryで各組み合わせを試していく実装を大量に用意するなどの書き方が良さそう。


## Bridge
- 機能の追加
- 機能の実装

のどちらかを行うために一般にサブクラスは実装される。
ただし、どちらも同様にスーバークラスから派生したサブクラスを作るだけのためこれらの意図は混在してしまう。
うまくこれらの階層を分離するためのパターンがBridgeパターンである。

ここでは実装が必要な部分とクラスのAPIを分離して考え、
APIを定義したAbstraction抽象クラスを作成し、実質的な実装の必要な箇所をImplementor抽象クラスに委譲する。
このように実装が必要な箇所とAPIを定義する箇所に分離しておけば、

- 機能の追加を行う場合はAbstractionクラスを継承してクラス作成
- 機能の実装を行う場合はImplementorクラスを継承してクラス作成

と言うようにサブクラスを作成する際の意図を明確にクラス図として示せるようになる。


## Strategy
ソースコードのうち、アルゴリズムの部分のみを抽出しモジュール化する考え方。
アルゴリズムに必要なAPIとシグネチャのみ先に定めてしまい、実際にそれを利用するクラスでは
アルゴリズムを委譲して使用する。
委譲によって複数のアルゴリズムを切り替えることが容易になっている。

Abstract Factoryパターンなどとの主な差別化は着目しているものがアルゴリズムであることであろう。
これまではオブジェクト指向におけるオブジェクトの共有化等について考えてきたが、
アルゴリズムの分離については考えてこなかった。
アルゴリズムについてもオブジェクトと捉えることでプログラムの再利用性や疎結合性、テスト可能性が広がっていく。


## Composite
端的に言うとマトリョーシカのようなパターンである。
代表的にファイルシシテムが挙げられ、「ディレクトリ」の中に「ディレクトリ」を入れることが可能である。
このような入子構造について表現する際に使えるのがCompositeパターンとなる。

中身を表すLeafクラス、容器を表すCompositeクラス、LeafとCompositeを同一視するためのComponentクラスの3つを定義する必要がある。

上記でほとんど説明が済んだようなものだが、容器と中身を同一視することで入子構造が容易に表現できるようになる。

ファイルシステムを考えた場合、Componentの追加を行う関数をどこで実装するかはいくつかのパターンに分けられる。

- Componentクラスに実装しエラーを発生させる。Compositeクラスではoverrideを行う。
- Componentクラスに実装しエラーにしない。Leafクラスにも実装せずファイルの場合何も起こらない。
- Componentクラスで宣言し実装はCompositeクラス、Leafクラスで行う。
- Componentクラスには何も書かず、Compositeクラスにのみ定義する。使用する際はCompositeクラスへのキャストを毎回試みる。

再起的な構造を表現する際に一考するとよい。


## Decorator
あるクラスについて外側から何かを追加し、また追加されたものも含めて元のクラスと同一視するクラスである。

Componentクラスは上記のCompositeパターンと同様、同一視する元となるクラスを表す。
ConcreteComponentクラスは最も大元となるComponentクラスの実装者である。
DecoratorクラスはComponentクラスと同様のAPIを持ち、Componentクラスをメンバーとして保持する。
ConcreteDecoratorクラスはDecoratorクラスの実装であり、メンバーであるComponentクラスのメソッドを用いて、
付加価値をつけながら同一APIを提供する。

このように元のComponentクラスにいくつかの衣装を着せるように機能を追加していくことで、
中身を変えずに機能の追加が行えたり、動的な機能追加を実現することができる。

ただし、問題点としてはよく似た小さいクラスが幾つも生まれてしまうと言うものがある。


## Visitor
処理と構造を分離するためのパターンである。
Compositeパターンに代表されるように構造化されたクラス群を扱う際に、
そのクラスに直接処理を書き込むことはいたずらに修正箇所を増やすことにつながりかねない。
そのため、処理を構造から分離しVisitorという形で構造に沿って再帰的に呼び出させることで実装する。

Visitorではvisitメソッドを構造における要素の種類分overloadして定義する。
ConcreteVisitorでは実際の処理を定義する。ここで、再帰的に処理を実現する必要があるが、
Iteratorパターンや、ダブルディスパッチをうまく利用して実現する。
ElementはVisitorの訪問先である。Visitorのためのダブルディスパッチ用関数として `public void accept(visitor)` を用意しておくとよい。
ObjectStructureは構造が定義されているクラスである。Elementのサブクラスとなることが多い。Iterator等、構造において次に繋がる処理を記述しておく必要がある。

基本的にはVisitorクラスのvisitメソッドに構造データを渡せば、再帰的にvisitメソッドとacceptメソッドが相互依存して呼び出され、最終的なnode, leafにたどり着く。

一般にConcreteVisitorを増やすことは容易だが、Elementの種類を増やすことは面倒である。


## Chain of Responsibility
効率的にたらい回しを行うためのパターンである。

処理者を規定するHandler抽象クラス、実装されたConcreteHandlerクラスが主なクラスである。

```java
public abstract class Handler {
    private Handler next;
    public Handler setNext(Handler next) {
        this.next = next;
        return next;
    }
    public final void handle(Event event) {
        if (resolve(event)) {
            done(event);
            return;
        }
        if (next != null) {
            next.handle(event);
            return
        }
        fail(event);
    }
    protected abstract boolean resolve(Event event);
    protected void done(Event event) {
        System.out.println(event + " is resolved by " + this);
    }
    protected void fail(Event event) {
        System.out.println(event + " cannot be resolved.")
    }
}
```

上記のようにsetNextメソッドなどで次のたらい回し先を決めておくことで、処理を順繰りに行っていく。
直接的なswitch-caseなどよりは処理が遅くなるが、処理内容や条件の独立性が担保される。


## Facade
Facadeは「建物の正面」という意味を持った言葉であり、実質的に必要な処理に対してユースケースが限られ、
外部に提供するAPIを絞ることが可能なときにその処理の窓口としてFacadeクラスを提供することで、
Client目線でプログラムの可読性を上げるパターンである。

複数クラスに処理がまたがっている場合でも、それらをまとめて行う決まった手順などがあり、
外部から必要な引数などが限られている場合は、全てをラッピングして新しいFacadeクラスを作ることで
単純な呼び出しによって処理を完遂することが可能になる。


## Mediator
多数のオブジェクトの間の調整を行わなければならない時に、Mediatorパターンは役に立つ。

Mediatorインタフェースは調整の中心であり、
全てのColleagueクラスをメンバーとして保持していることを前提としたそれらの振る舞いについて規定するメソッドを定義している。
ConcreteMediatorクラスは実際に全てのColleagueクラスをメンバにもち処理について実装する。
Colleague抽象クラスはメンバーとしてMediatorインタフェースを所有し、自インスタンスの振る舞いについてのメソッドが定義され、
ConcreteColleagueクラスにより実装される。
この際、メソッドには他のインスタンスとの協調部分については書かず、あくまで自インスタンスの振る舞いの範疇で記述する。

上記のようにすることで、複雑な複数のオブジェクトの協調処理を中央集中的に管理することができ、
複雑な処理のデバッグ箇所を大幅に減らすことができる。


## Observer
このパターンは状態の管理を監視するためのパターンである。

主要なクラスは4つであり、

- Subject
- ConcreteSubject
- Observer
- ConcreteObserver

となる。

```java
public interface Observer {
    public abstract void update(Subject subject);
}
```

```java
import java.util.ArrayList;
import java.util.Iterator;

public abstract class Subject {
    private ArrayList observers = new ArrayList();
    public void addObserver(Observer observer) {
        observers.add(observer);
    }
    public void deleteObserver(Observer observer) {
        observers.remove(observer);
    }
    public void notifyObservers() {
        Iterator it = observers.iterator();
        while (it.hasNext()) {
            Observer o = (Observer)it.next();
            o.update(this);
        }
    }
    public abstract void execute();
}
```

上記のようにSubjectは自分に必要な観察者を自身で保有し、
必要なタイミングで通知を飛ばすようにする。
Observerはupdateに記載された処理を行う。


## Memento
状態の保存を行う時に考えられるパターンである。

OrigiatorクラスがMementoクラスを作成することで、Origiatorクラスのある状態を保存する。
この時、Mementoクラスにアクセスできるのは基本的にOrigiatorクラスに制限され、
外部へのAPIとしてはnarrow interfaceのみを提供するようにする。
narrow interfaceではMementoクラスの状態を操作することはできず、
可能なことは公開データの取得程度にとどまる。
Origiatorクラスにその状態を保存しろと指示し、保存されたMementoクラスを管理するクラスとしてCaretakerクラスも定義するとよい。
こうすることで、Mementoクラスの管理、操作に関する処理をOrigiatorクラスから分離し、複雑になりがちな
Mementoクラスの保存条件や、保存期間などを独立して考えることができる。


## State
状態をクラスとして保持するパターンである。
これまではオブジェクトや処理について着目していたが、今回は状態について着目する。

このパターンに当然必要になるのがStateクラスである。ここでは状態に依存した振る舞いをするメソッドを定義する。
ConcreteStateクラスは実際の状態ごとに定義される。状態の数だけConcreteStateクラスが実装されることとなる。
Contextクラスは現在の状態を表すConcreteStateクラスを保持し、ダックタイピングを使用して必要なメソッドを引き出す。

状態に依存した処理をダックタイピングで捌けることが最大のメリットである。

このパターンにおいて、状態遷移を誰が管理するのかは非常に重要である。
ContextクラスからConcreteStateクラスの実態を分離する場合は状態遷移を行うのはConcreteStateクラス内が良い。
この場合は、状態遷移に変更を加える必要が出てきた際に変更範囲が各ConcreteStateクラスになるというデメリットを受容する。
逆にContextクラスにおいて全ての状態遷移を管理するという方法もあるが、この場合はConcreteStateクラスと密結合になる。
その他に状態遷移のテーブルを使用する方法や、独立したクラスをさらに用意する方法などが考えられる。


## Flyweight
flyweightはご想像の通り「フライ級」のことであり、メモリ量を節約するためのデザインパターンである。
メモリ量の削減をFlyweightパターンはインスタンスの共有によって実現する。

Flyweightクラスは共有したいプログラムである。
基本的には複雑な状態を持たず、放っておけば何度も新規インスタンスが作成されるものが対象となる。
FlyweightFactoryクラスはFlyweightクラスのインスタンスを作成し、自身のインスタンスの中に保持する。
2回目以降、Flyweightクラスが必要になった際はすでに作成して保持してあるインスタンスを返却する。

Flyweightクラスが複数箇所に共有して持たせるクラスとなるため、本当に共有して問題ないかを吟味する必要がある。
一行の改変で思いもよらない場所に影響を与える可能性がある。


## Proxy
proxyは「代理人」を意味する英単語で、このパターンでは実際に処理を行うクラスの前段に代理のクラスを立てる。

このパターンは単純でSubject抽象クラスあるいはインタフェースが対象の振る舞いを規定する。
その上で、ProxyクラスとRealSubjectクラスが実装され、ClientはProxyクラスを呼び出す。
例えば、Proxyクラスには重たい処理をおかずに軽い処理のみを記述し、思い処理が必要になった場合のみ、
RealSubjectクラスのインスタンスを作成し処理を委譲する。
この仕組みよって、可能な限り軽い動作で処理を行うことができる。
また、HTTPにおいて有名なキャッシュ機能をProxyクラスに持たせることも可能である。
頭の片隅においておく必要があることはRealSubjectクラスはProxyクラスに依存せず、
逆にProxyクラスはRealSubjectクラスに依存することである。


## Command
オブジェクト、処理、状態のクラスを紹介したが、今回は命令のクラス化である。
CommandパターンはEventパターンと呼ばれることもあり、特にGUIの開発では「イベント」がよく登場する。

Commandクラスは命令のインタフェースを定義し、これを実装するのがConcreteCommandクラスである。
Commandクラスの処理の対象となるクラスをReceiverクラスとし、Commandクラスの命令実行インタフェースを起動するのがInvokerクラスとなる。

命令をクラス化することで履歴の保存が容易になる。
命令が持つ情報量には気を使う必要がある。不要な情報まで持たせることはよくない。


## Interpreter
このパターンではプログラムが解決しようとしている問題を簡単な「ミニ言語」で表現する。
正規表現などがこれにあたる。
詳細がややこしすぎるので踏み込まないが、文字列に対して構文解析を行いややこしい処理を文字列で起こすことを可能にする。
あるいはパターン化された処理の簡潔な表現を生み出すことが目的である。


# まとめ
- 何を主眼に置くかが重要
    - 一番拡張したい場所に注目
        - 種類の増えるクラス
        - 足していきたい機能群
    - 一番修正の多い箇所に注目
        - クラスのデータ構造
        - メソッドを呼び出す手順
    - 一番複雑な箇所に注目
        - アルゴリズム
        - データ構造
- 拡張したい場所はなるだけ疎結合に
- 修正の多い箇所はなるだけ一箇所に
- 一番複雑な箇所はなるだけ一箇所で独立させて
