---
title: 'エリック・エヴァンスのドメイン駆動設計をまとめる'
date: '2021-05-18'
tags: [book]
path: blog/evans-eric-ddd
cover: ./preview.jpg
excerpt: いわゆるエヴァンス本を読んだので頭の整理がしたい
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---

# 目次


# 動機
ソフトウェアエンジニア界で活動をしている人なら誰しもが聞いたことはあろう
[エリック・エヴァンスのドメイン本](https://www.amazon.co.jp/%E3%82%A8%E3%83%AA%E3%83%83%E3%82%AF%E3%83%BB%E3%82%A8%E3%83%B4%E3%82%A1%E3%83%B3%E3%82%B9%E3%81%AE%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E9%A7%86%E5%8B%95%E8%A8%AD%E8%A8%88-Architects%E2%80%99Archive-%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E9%96%8B%E7%99%BA%E3%81%AE%E5%AE%9F%E8%B7%B5-%E3%82%A8%E3%83%AA%E3%83%83%E3%82%AF%E3%83%BB%E3%82%A8%E3%83%B4%E3%82%A1%E3%83%B3%E3%82%B9/dp/4798121967/ref=tmm_other_meta_binding_swatch_0?_encoding=UTF8&qid=&sr=)
私もようやくその本の価値が分かる時分になり、手にとった。
どうやら考えていたよりも幾分実験的な内容で、体系だっているようで煩雑としている印象を受けたが、
如何せん書かれていることは設計を行う人間にとっては不可欠な内容と思える物ばかりで、
是非とも自分のものにしたいという思いからエッセンスのみを _自分のために_ まとめる。


# ドメイン駆動設計

### ドメイン駆動設計の基本的用法
1. モデルと設計の核心が相互に形成し合う
2. モデルは、チームメンバ全員が使用する言語の基盤である
3. モデルとは、蒸留された知識である

### ユビキタス言語
ドメインエキスパートが使用する専門用語とソフトウェアエンジニアが使用する言語は共通化する必要がある。
この共通化された言語を **ユビキタス言語** という。

ユビキタス言語の語彙にはクラスや主要な操作の名前が含まれている。
開発チームは試行錯誤の上で、用語や用語の組み合わせがぎこちない場所を発見した場合、その代わりとなる表現を探す。
言語に対するこのような変更はドメインモデルに対する変更として認識される。
ドメインモデルは言語の骨格として使用されることになり、モデルはユビキタス言語を反映したものにならなければならない。
その上で、チーム内の全てのコミュニケーションとコードにおいて、その言語を厳格に用いることをチームに約束させることが重要である。

> ユビキタス言語における変更は、モデルに対する変更であると認識すること。

モデルが言語の骨格となるが、それに異議を唱えるのはもちろん開発チームのみでなくドメインエキスパートも同様にすべきである。
(むしろその方が多いとも思われる。)
ユビキタス言語の使いにくさ、ぎこちなさはモデルの不整合の発見の一助となる。


# 設計における構成要素

## アーキテクチャ
### レイヤードアーキテクチャ
ドメインモデルの隔離と依存関係の整理のためにレイヤードアーキテクチャが用いられる。
代表的な例としてMVCモデルが挙げられる。
本書で紹介されているレイヤーについて確認すると

- ユーザインタフェース層(プレゼンテーション層)
  - 外部との接続部分
- アプリケーション層
  - ソフトウェアが行うべき処理を定義する
  - ドメインオブジェクトを使用して問題を解決する
  - ビジネスルールや知識を含まない
  - ビジネスの状態は持たないが作業の進捗などの情報は持っても良い
- ドメイン層(モデル層)
  - ビジネスの概念とビジネスの状態、ルールを管理する
  - 状態の永続化などの技術的詳細はインフラストラクチャ層に委譲する
- インフラストラクチャ層
  - ドメイン層だめの永続化、ユーザインタフェースのウェジェット描画など技術的詳細を提供する

本書におけるレイヤードアーキテクチャの本質はドメインモデルの隔離に尽きると言える。
ドメイン層を技術的詳細やその他詳細と疎結合にすることで、ドメインモデルはドメインモデルのみに集中することができる。

### 利口なUI
上記のドメインモデルに集中する本懐を鑑みると表題はおかしな言葉に見えるし、
実際ドメイン駆動設計において、利口なUIはアンチパターンである。
しかし、フロントエンド開発の現状を考えるとしっかりとその長短について見つめ直す必要があろう。
もちろん複雑なビジネスロジックを含むフロントエンド開発においては単なるUIとしての機能というよりは、
それ一つでソフトウェアとみなせるため、内部でドメイン駆動設計を行うという選択肢もあるが、
ここでいうUIとは最も外部に位置するクラスであり、
ReactでいうpageごとのMainコンポーネントがそれに当たると考えて良いと思われる。

##### 利点
- **単純なアプリケーションの場合** 、生産性が高くすぐに作れる
- アーキテクチャに対する造詣が浅くても問題ない
- 単純な機能追加は簡単で、見積もりも簡単である

##### 欠点
- アプリケーションの統合は困難である
- 振る舞いの再利用が難しい
- 複雑な機能追加を行うとアプリケーションもまた複雑化していく


## オブジェクト
### ENTITIES (REFERENCE OBJECTES)
同一性によって定義されるオブジェクトのことをエンティティと呼ぶ。
エンティティは属性よっては定義されず、同じ属性を保有していても他のオブジェクトと区別される必要があり、
属性が変化したとしても同一性が損なわれてはならない。

エンティティの考え方として代表的なものを考えると「人間」という概念が挙げられる。
身長体重などの属性はいくらでも変化するが私が私であることは変わらない(本当かは正直知らないが)。

モデルでエンティティを定義する際に留意することを下記に示す。

- 同一性を第一とすること
- クラスの定義をシンプルに保ち、ライフサイクルの連続性と同一性に集中すること
- 形式や履歴に関係なく、各オブジェクトを識別する手段を定義すること
- オブジェクト同士を属性によって突き合わせる要件には注意すること
- 各オブジェクトに対して結果が保証される操作を定義すること
  - ユニークな文字列が代表的な解決策ではある
  - ユニークな文字列を使用するか否かにかかわらず、モデルが同じであるとは何を意味するかを定義する必要がある
  - 一度識別子を決定したら決して変更してはならない

### VALUE OBJECTS
あるモデル要素についてその属性にのみ関心が集中し、同一性が必要ないオブジェクトを値オブジェクトと呼ぶ。
エンティティと異なり、同じ属性を保有しているオブジェクト同士に区別は必要なく同一のものであると見なす。

- 同一性を与えない
- 不変なモデルとして設計する
  - FLYWEIGHTパターンなど考慮が非常に楽である
  - ただし多くの言語でサポートされている概念ではないので開発ルールとして開発者が遵守する必要がある

値オブジェクトに対して可変性を持たせる場合もあるが、可能ならば回避する性質である。
可変性が生じた場合はその値オブジェクトは共有してはならない。

### SERVICES
ドメインエキスパートとの会話から生まれる概念の中には、本質的に活動や行動、操作であって、
オブジェクトとしてモデル化すると不自然なものがある。
これらの概念は無理にオブジェクトとしてモデル化せずドメインサービスとしてモデル化することができる。
サービスとは、モデルにおいて独立したインタフェースとして提供される操作であり、カプセル化されない。
良く設計されたサービスの特徴として

- 操作がドメインの概念に関係しており、その概念がドメインオブジェクトの自然な一部ではない
- 引数と返り値、つまりインタフェースはドメインオブジェクトで定義されている
- 操作に状態がない
- ユビキタス言語で操作名が定義されている

それぞれのレイヤーに属するサービスを
ドメインサービス、アプリケーションサービス、インフラストラクチャサービスと呼ぶことができる。

ドメイン層にサービスを導入することで、アプリケーション層によるドメイン層の呼び出し処理が簡素化され、
ドメイン層とアプリケーション層の線引きを明確化することができる。

## モジュール (パッケージ)
モジュール間では低結合、モジュール内では高凝集と言うのは技術的に考えて自明の理だが、
モジュールは概念についても分断してしまうことを意識する。
モジュールはユビキタス言語を用いて名付けられるべきであり、
ドメインの概念に従って分割されると同時に対応するコードも独立される状態を目指す。

フレームワークにただ従ってパッケージングを行った場合、上述のような結果が得られないことも多いので注意する。


## ライフサイクル

### 集約
集約は複数オブジェクトの集まりを指す言葉であり、トランザクションの単位となる。
特に複数のオブジェクトに関連する不変条件が存在する時に、シンプルなロックの機構をやたらと使うと
過度に遅いシステムや、デッドロックが発生するシステムが作成されてしまうため、
いくつかのオブジェクト間の不変条件を満たすことを容易にするようにグルーピングしたものが集約となる。

集約において重要な概念は集約ルートと境界である。
集約ルートとはグローバルな同一性を保持したエンティティであり、外部からの参照を受け付ける集約内部で唯一のオブジェクトとなる。
境界とは集約内部においてはルートエンティティ以外の参照を持つことは自由だが、集約外部で参照を持たれて良いのは
ルートエンティティのみと言う約束および内部と外部の境目を指す。

トランザクションの具体的なルールは下記のようになる。

- 集約のルートエンティティは、グローバルな同一性をもち、不変条件をチェックする最終的な責務を負う
- 境界内部のエンティティは、集約ないのでのみ一意となるローカルな同一性を持つ
- 集約の境界外にあるオブジェクトはルートエンティティ以外の境界内のオブジェクト参照を保持できない
- ルートエンティティは境界内部のオブジェクトの参照を返却できるが、境界外部のオブジェクトはその参照を保持してはならない
- 上記のルールを満たした場合、データベースから直接取得できるのは集約ルートだけとなる
- 削除操作については境界内部に存在するオブジェクトを一度に削除する必要がある
- 境界内部に存在するオブジェクトに対する変更が反映される際、必ず集約全体の不変状態を満たすようにしなければならない

この概念を直接的に用いると言うことは少ないかもしれないが、
ファクトリとリポジトリにおいて対象となるものがここで述べた **集約** となる。

### ファクトリ
オブジェクトのライフサイクルにおいて初期の生成時、または中期の再構成に利用される。
オブジェクトを利用するクライアントに対して、

- オブジェクトの関連の詳細まで意識させたくない
- オブジェクトの生成に必要な複雑な操作を行わせたくない
- 多態的に利用されるオブジェクト群のアクセスポイントを特定させたい

上記のような要望がある場合はファクトリを利用する。

##### ファクトリの配置場所
対象が集約である場合(これがほとんどの場合であると著者は述べている)、エンティティルートにファクトリメソッドを追加することができる。

別の例としては、集約の境界外であるが対象オブジェクトを生成する際に支配的なルールを内包しているオブジェクトが
ファクトリメソッドを持つことも自然な設計である。

また、上記のどちらも自然な設計とは思えない場合は独立したファクトリオブジェクトまたはファクトリサービス
(どちらも同じものだと思われる)を作成すると言う選択肢も忘れていはならない。

##### ファクトリのインタフェース
以下の点を念頭において、シグネチャを決定する必要がある。

- 各操作はアトミックであり、一度のやり取りで完結する
- 失敗時の挙動については事前に取り決めをしておき一貫性を保つ
- ファクトリはその引数と結合する

特に引数との結合だが、引数として適切なものは

- 下位の設計層に由来する基本的なオブジェクト
- 密接に関連する(関連せざるを得ない)抽象オブジェクト
- 生成物に付与する設定項目

##### 不変条件の管理
ファクトリを使用する場合、生成物の不変条件の管理をファクトリで行うか生成物で行うかの選択に迫られる。
多くの場合、生成されるオブジェクトに不変条件のロジックを記述し、
ファクトリは不変条件の担保を生成オブジェクトに委譲させる形を取れば十分である。
ただし、下記のような条件の場合はファクトリにロジックを移動させることも可能である。

- 不変条件のロジックが必要なタイミングがオブジェクト生成時のみである
  - 値オブジェクト
  - エンティティの識別子
- 集約のルールに関するロジック

##### オブジェクトの再構成
ファクトリをライフサイクル初期の生成に関する操作を扱うものとして見てきたが、オブジェクトの再構成にもファクトリを利用することがある。
生成に対して再構成を行う場合はより複雑な操作が必要になる場合があるため注意が必要である。
また、生成とは2つの点で大きく異なる。

- エンティティのファクトリに関して、新しい追跡IDを割り当てることがない
- 不変条件の違反に対して生成時とは別の制御を行う必要がある場合が多い

##### まとめ
インスタンスの生成のアクセスポイントは何かしら必要である、それがコンストラクタであることもあるが、
ファクトリを作成することで複雑な操作や実装の詳細の隠蔽を行えるなどの多大な恩恵を得られることがある。
ファクトリはモデルを表現するものではないが、ドメイン設計の一部であり、モデルを表現するオブジェクトを鮮明にしておく上で役に立つ。
モデルの一部ではないが、モデルの詳細を知っているアクセスポイントであるため、
下手な依存関係や密結合を作成しないことや不変条件に対しる責務に対して慎重に設計する必要がある。

### リポジトリ
オブジェクトの再構成において、グローバルに検索を用いてアクセスできるデータベースは非常に有用だが、
その疎結合せいやグローバル性からドメインオブジェクトや集約ルートが無視されてしまう可能性が残る。
そのため、ほとんどのオブジェクトではグローバルな検索でアクセスすべきではない。

グローバルな検索によって再構成されるべきオブジェクトももちろんある。
ただし、クライアントが自由に検索クエリをかけるような状況、あるいは検索における技術的な枠組みを直接扱うような状況に
陥っている場合、先述のビジネスルールの無視や境界の無視が起こりかねない。
そのため、クライアントとデータへのアクセス技術との間に **リポジトリ** を挟むことでクライアントのアクセスポイントを限定する。
その他にもリポジトリを用意することによる恩恵は多数ある。

- クライアントにとって再構成の処理がシンプルになる
- アプリケーションとドメインの設計を永続化技術や複数のデータベース戦略などから分離する
- オブジェクトアクセスに関する設計上の決定を伝える
- テストで使用するために、ダミーの実装で置き換えるのが容易になる


# リファクタリング

## SPECIFICATION
あるオブジェクトが何らかの基準を満たしているかどうかを判定する述語的な値オブジェクトを仕様オブジェクトという。
仕様オブジェクトを用いることはある種のパターンである。

ビジネスルールの中にはどのエンティティ、値オブジェクトの責務にも合致しないものがあり、それらを強引にオブジェクトに含ませることで、
ドメインオブジェクト本来の意味を侵害しかねない。こうした際に仕様オブジェクトとしてビジネスルールを分離することで、
ドメインオブジェクトが保護され、モデルの保守性、表現力が増す。
仕様の価値は異なるように見えるアプリケーションの機能を統一することにある。
下記のうち一つでも当てはまる用途があればオブジェクトの状態を定義する必要がある。

- オブジェクトを **検証** して何らかの要求を満たしているか、何らかの目的のための用意ができているか調べる
- コレクションからオブジェクトを **選択** する
- 何らかの **要求** に適合する新しいオブジェクトの生成を定義する

上記の検証、選択、要求に応じた構築という3つの用途を仕様というパターンに当てはめることで、同一のルールとして扱うことができる。

##### 検証
非常に単純な用途であり、作成された仕様オブジェクトは渡された対象オブジェクトが仕様オブジェクトに記述されている
ビジネスルールを満たしているかどうかを確認する。

```java
class DelinquentInvoiceSpecification extends InvoiceSpecification {
  // 当日日付
  private Date currentData;

  public DelinquentInvoiceSpecification(Date currentDate) {
    this.currentDate = currentDate;
  }

  public boolean isSatisfiedBy(Invoice candidate) {
    int gracePeriod = candidate.customer().getPaymentGracePeriod();
    Date firmDeadline = DateUtility.addDaysToDate(candidate.dueDate(), gracePeriod);
    return currentDate.after(firmDeadline);
  }
}
```

また、仕様を述語的に扱うのを容易にするためにコンポジットパターンを適用することも可能である。

```java
public interface Specification {
  boolean isSatisfiedBy(Object candidate);

  Specification and(Specification other);
  Specification or(Specification other);
  Specification not();
}

public abstract class AbstractSpecification implements Specification {
  public Specification and(Specification other) {
    return new AndSpecification(this, other);
  }
  public Specification or(Specification other) {
    return new OrSpecification(this, other);
  }
  public Specification not() {
    return new NotSpecification(this);
  }
}
```

##### 選択
検証と同様に選択における条件を仕様オブジェクトに記述する。
例えば、上記の `DelinquentInvoiceSpecification` に 

```java
public Set selectSatisfying(InvoiceSpecification spec)
```

を追加すれば良いだろう。

ここで留意する必要があるのは、インフラストラクチャ層の責務である技術的詳細をドメイン層に持ち込まないことである。
逆にビジネスルールをインフラストラクチャ層に流出させないことも同様に重要である。
O/Rマッパーを使用するかダブルディスパッチを利用するなどして、レイヤを保つこと。

##### 要求
検証、選択が既に存在するオブジェクトに対する仕様であったが、要求は今から生成するオブジェクトに対する仕様である。
このオブジェクトを満たすように生成や再構築が行われることとなる。

同様の事象が扱えるパターンとしてジェネレータがあり、こちらを使用することで受ける恩恵もいくつかあるので
トレードオフを吟味して考える必要がある。


## 設計
- 意図の明白なインタフェース
  - 副作用のない関数
  - 表明: 操作の事後条件とクラスと集約の不変条件の宣言
- 概念の輪郭
- 独立したクラス
  - 閉じた操作


## デザインパターン
### STRATEGY (POLICY)
プロセスの中で変化する部分を柔軟に変更するためにストラテジーパターンが有効である。
先述の仕様オブジェクトはStrategyパターンとして扱うことが可能である。

書籍の具体例を借りると、運搬業務における経路選択において何を最適化するかの仕様を可変部分としてStrategyパターンを組むことができる。
この場合、経路選択内では仕様を満たすような経路を探すという作業に集中することができ、
選択されるべき経路が最も安い経路なのか、最も早い経路なのかなどは考えなくてよくなる。
選択の仕様を分離することでシステムに柔軟性が生まれていることがわかる。

### COMPOSITE
ネストされたコンテナの関係性をモデルに反映する場合コンポジットパターンが有効である。


# 戦略的設計
## モデルの整合性維持

### 境界づけられたコンテキスト
モデルが適用されるコンテキストは明確に定義されなければならない。
明示的な境界は、チーム編成、アプリケーションのようと、コードベースやデータベーススキーマなどの物理的な表現などの観点から設定する。
コンテキストの名前は当然ユビキタス言語である必要がある。
モデルに詳しくない人が誤って他のコンテキストの概念を直接扱ったりすることのないように、
コンテキストマップに代表されるドキュメントがあると良い。

### 共有カーネル
コンテキストの境界を跨ぐ概念などはそれぞれのコンテキストを担当するチーム間で合意を得て開発していく必要がある。
これらの概念をドメインモデルのサブセットとして共有する手法がある。

### 顧客/提供者 (CUSTOMER/SUPPLIER)
二つのシステム間の関係が「上流」と「下流」の関係にある場合、変更に対するオーバーヘッドが生じる場合がある。
上流のチームは下流のチームに必要だったものを止めてしまわないかと慎重になり、
下流のチームは上流のチームが新たな情報を与えてくれないとプロジェクトが進まないことがある。
この場合は、顧客/提供者の関係であることを明示的な関係性として定義すること。
上流チームのシステムで下流チームに関係のある部分は下流チームと共同でテストを作成し(受入テスト)、
継続的な統合の一部として実行するようにする。
また、提供者にとって優先されるべきは顧客であるということも取り決める必要がある。

### 順応者 (CONFORMIST)
上流/下流関係の2チームがあったとして先述のように顧客/提供者の関係を築くには上流側に恩恵がない場合、
下流チームはどうすることもできない。
上記のような時は下流チームが上流チームに隷属する他ない。
このような下流システムを順応者と呼んでいる。

### 腐敗防止層 (ANTICORRUPTION LAYER)
コンテキストの境界におけるインタフェースが膨大になると、コンテキスト内のモデルがインタフェースに合わせてしまうことがある。
インタフェースはモデルに従属されるべきであり、これはおかしい。
この場合は、インタフェースを用のレイヤを作成することで、ドメインモデルを保護する。
このレイヤを腐敗防止層と呼ぶ。

腐敗防止層はファサードバターンとアダプタパターンを合わせて使用することができる。

### 公開ホストサービス
システム間の関係として、基本的にはサーバーがクライアントの要求に応えるようにインタフェースを定義するが、
クライアントが多い場合などクライアントの要望に応えるのが難しい場合はサーバー側の主導でインタフェースを定める。
サーバはアクセするためのプロトコルを定義し公開する。この共有プロトコルは一貫性のある状態に保つ必要がある。

### 公表された言語
二つのコンテキスト間でモデルをやり取りするには共通の言語が必要になる。
必要なドメインの情報を公表された共通の媒体を通じて交換するのが良い。
例えば、化学マークアップ言語(CML: Chemical Markup Language) などがそれにあたる。


## 蒸留
蒸留とは混ざり合ったコンポーネントを分離するプロセスであり、価値があって役立つ形式で本質を抽出するためのものである。

### コアドメイン
ドメインモデルの中でも最も重要なコアドメインを明確にし位置付けることで、開発の優先順位や外部委託の判断などの判断基準となる。

### 汎用サブドメイン
ドメインモデルの中で専門的な知識を捉えることも伝えることもなく、複雑さを付け加えるだけの部分もある。
このようなサブドメインを識別し分離することで、コアドメインに対してより集中できるようになる。
また、専門的な知識に携わっていない部分に関しては汎用性が高い部分ともいえるため、
既製品や公表されているモデルの採用も視野に入れられる。

### ドメインビジョン声明文
コアドメインとそれがもたらす価値に関する簡潔な記述を作成することで、「価値の提議」を行える。
ドメインモデルがどのように役立ち、対象のアクターに対してそれぞれどのような対応を行うかを示す。
スコープはコンテキスト内のスコープに限定する。
この声明文はプロジェクトの早期に作成し、新しい洞察を得たら都度改訂すること。

### 強調されたコア
ドメインビジョン声明文は広い観点から見た提議であり、具体性に乏しい。
開発者にとってコアドメインはドメインビジョン声明文のような抽象的な状態で言語化されているだけでは十分ではない。
そこで、コアドメインとコアを構成する要素感の主要な相互作用を記述した **蒸留ドキュメント** を記載する。

### 隔離されたコア
コアドメインは洗練され、独立している状態にある必要がある。
このためには如何様な開発コストも割くべきである。

### 抽象化されたコア
モデルにおける最も根本的な概念を抽出し、それを抽象クラスやインタフェースにくくり出す。
コアドメインを洗練できたとしても、膨大な詳細に圧倒されるような設計では理解することは難しい。
抽象化の層を挟むことで階層的に理解が進むようになる。


## 大規模な構造

### 責務のレイヤ
モデル間の概念状の依存関係、ドメインの様々な部分の変更の大きさと頻度を元に、ドメインの自然な階層を探す。
階層に従い、抽象的な責務を割り当てる。
概念的依存関係として下表のような金融システムの例をあげる。

| レイヤ | 概念 | 状態 | 具体例 |
| ---- | ---- | ---- | ---- |
| 意思決定 | 分析メカニズム | 状態変化はほとんどない | リスク分析、交渉ツール |
| ポリシー | 戦略、制約 | 遅い状態変化 | 準備金の限度、資産配分目標 |
| 確約 ｜ビジネス取引と顧客の契約 | ボチボチな状態変化 | 顧客合意、シンジケート合意 |
| 業務 | ビジネスの現実 | 早い状態変化 | 未払いローンの状態、支払いと配分 |

### 知識レベル
エンティティ間にある役割と関係が状況によって変わるアプリケーションでは複雑さがます。
例えば従業員とその役割などが当てはまる。
リフレクションパターンにおけるベースモデルを業務レベル、メタレベルを知識レベルとすることで
ドメインモデルに適用したものを使うと複雑さを軽減できる。
