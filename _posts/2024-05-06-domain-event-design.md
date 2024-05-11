---
title: 'Domain Event'
date: '2024-05-11'
tags: [ddd]
cover: ./preview.jpg
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
excerpt: Domain Eventとその実装について整理します
---

# 目次


# 概要

## この記事の内容

Domain Eventは非常にシンプルな概念かつ強力なモデリングパターンです。
モデリングにおいては直感的に扱うことが可能ですが、実装をする段階になるといくつか設計が必要な部分が存在します。

* Domain Eventをプログラミング言語でどのように表現するのか
* Domain Eventをどのように永続化するのか

上記のDomain Eventのみの設計であれば簡単な設計の問題に見えます。
ここで、Domain EventはEvent SourcingやCQRSなどの発展的なアーキテクチャの土台となっているモデルです。
例えば、DDDを学習して、Domain Eventをモデリングして実装までした後に、パフォーマンス要件からCQRSを導入する決定がなされたとしましょう。
CQRSではDomain EventをRead modelへ通知して変換していく手法が一般的です。
この時にDomain Eventに情報が足りていなかったり、粒度がおかしかったりすると大幅な変更が必要になってしまいます。
さらに、バージョニングについて考えられていなければその変更すら困難になるでしょう。
よって、Domain Eventを設計する際にはそれに紐づくアーキテクチャスタイルも考慮して設計することが大事だと自分は考えています。

本記事では、Domain Eventとは何であるか、その実装はどのようにすれば要件を満たした上で拡張性を保てるかについて整理します。
Event SourcingやCQRSについてはほとんど触れず、Domain Eventの実装にフォーカスしています。
Domain Eventをこれから実装するぞ！という人に読んでいただけると幸いです。

## 対象読者

* 自分
* 設計やDDDに興味がある人

## 注意事項

情報源を示していない内容は基本的に筆者の考えや整理になるので誤りを含む可能性があります。

# 前提知識

Domein EventはEric EvansがDomain-Driven Designを発刊した際にはまだ整理されていなかった概念です。
ただし、現在ではDDDの中心的な概念として広く知られている概念になるため、青本を読んだ後に必ずキャッチアップしておくべきです。
この章では本記事の前提として必要なDomain Eventの基本を整理します。

## 定義

[Domain-Driven Design Reference] におけるDomain Eventの説明文の1行目は以下の通りです。

> Something happened that domain experts care about.
>
> [Domain-Driven Design Reference]

ここで着目すべきは過去に起こったことをモデルとしている点です。

もう一点ベースとなる考えはDomain Eventはdomain objectの一員であることです。

> Represent each event as a domain object.
> ......
> A domain event is a full-fledged part of the domain model, a representation of something that happened in  the domain.
>
> [Domain-Driven Design Reference]

つまり、EntityやValue Objectと同様のレベルで表現される概念です。

[Domain-Driven Design Reference] や [実践ドメイン駆動設計] ではDomain Eventはそれ単体で独立したライフサイクルを持つものとして扱われていますが、 [microservices.io, Domain event] では

> Organize the business logic of a service as a collection of DDD aggregates that emit domain events when they created or updated. The service publishes these domain events so that they can be consumed by other services.
>
> [microservices.io, Domain event]

としており、Domain EventはAggregateによって作成されるものとして扱っています。
[マイクロサービスパターン] や [Learning Domain-Driven Design] でも同様にAggregateがDomain Eventを発行しています。
個人的には、後者のより狭義な定義の方が実践において役立つと考えているので、今後はDomain EventはAggregateによって発行されるものとします。

## 用途

Domain Eventをモデリングの手札に加えることで、アプリケーションの表現力が高まることは間違いないです。
[EventStorming] に代表されるようにモデリングの初期段階でDomain Eventから考え始めることが推奨されることすらあります。
データ設計の観点でも、 [事業分析・データ設計のためのモデル作成技術入門] では「こと」に着目する方針が述べられており、これはDomain Eventと関連していると考えられます。

また、Domain Eventはいくつかのアーキテクチャスタイルと密接に関連しています。
特によく言及されるのがEvent SourcingとCQRSです。
それぞれの詳細については参考文献に挙げている書籍などを参照してください。

# モデリング

## 不変性

Domain Eventは過去に起きた出来事を表現するものであるため、immutableにモデリングされるべきです。
参考文献に列挙されているほとんどの資料で不変であるべきと記載されており、
[Versioning in an Event Sourced System] では **必須** の要件としています。

不変性が必須の要件になる理由は、Domain Eventの意味的な背景よりは関連するアーキテクチャスタイルによるものが大きいと考えています。
(そのため、 [Domain-Driven Design Reference] ではべき論で済まされているのではないかと思っています。)
Domain Eventを使用するアーキテクチャの多くはDomain Eventが不変であることでシンプルさを保てています。

Domain Eventを不変として追記のみを行なった場合、誤ったDomain Eventの訂正はどのように行うのでしょうか。

誤ったDomain Eventやバグが発生してしまった場合はCompensating Actionを行うことが一般的です。
Compensating Actionは必ずしも自明ではないので、起こりうる障害についてプレモーテムを行い、事前に検討しておくべきです。

一方で、全てのエッジケースを拾い切れるとは限らないため、次善の策も存在します。
ad-hocなDomain Eventを追加して強引に帳尻を合わせることが多くのEvent Store実装で可能です。
ただし、ad-hocなDomain Eventに対して全てのコンシューマに対応させるコストも大きいため、基本的にad-hocなDomain Event作成は小さいシステムに限られます。

中間のアイデアとして、Corrected eventやCancelled eventというテクニックがあります。
これは、Domain Eventを指してそれをキャンセルする意図を伝えるEventを発行するものです。

## 独立性

[Versioning in an Event Sourced System] に記載の通り、Domain Eventに対して複数の動詞が紐づいている場合は、基本的に分割できるように再設計してください。

特に初学者に多いのが、1つのコマンドに対して1つのDomain Eventを発行するという設計です。
これは、コマンドとDomain Eventの間の処理に対して著しい制限をかけることになり、スケーラビリティを損ないます。

必ず1つの出来事を1つのDomain Eventで表現してください。

## 汎用情報

全てのDomain Eventに含まれるべき情報について整理します。

まず、Domain Eventという故障はEntityなどと同様で実装パターンの一つでしかないため、具体的に扱う際には概念自体に名前をつけます。
この時、Domain Eventはすでに起きた出来事を表現するものであるため過去分詞で命名します (e.g. `OrderPlaced`, `OrderShipped`, `OrderCancelled`)。
Domain Eventの名前はEvent Typeと呼ばれることが多いと感じます。
これは、Entityなどと異なり、永続化や通信の際に複数の異なるDomain Eventを同格に扱うことが多いため必要になった呼称です。

次に、Domain EventはAggregateと紐づく情報のため、Aggregateの識別子が必要です。

過去の出来事のため発生時刻のtimestampが必ず特定でき、あらゆる場面で有用な情報であることから、timestampも情報として含めます。

最後の二つの情報、Domain Eventの識別子とAggregateのバージョンは上述の情報で補うことが可能ですが、含めた方が実装が簡単になる類のものです。

Aggregateの識別子、Event Type、timestampから基本的には一意にDomain Eventを特定できます。
しかし、特に冪等性を担保するためにはDomain Eventの識別子があった方が楽に実装できる場面が多いです。

Aggregateのバージョンは、Domain Eventの永続化において楽観的ロックを実現するために必要になります。
バージョンもtimpstampを順に並べた時の自身の順位から割り出せるため、情報として明示的に含めるかは好みの範疇であると考えています。

## 個別の情報

汎用情報の次にそれぞれ個別の情報をモデリングする際の留意点について記載します。

Event Sourcingが可能な最小限の情報を付与することが基本になると私は考えています。
追加で、CQRSなど他の具体的な用途に合わせて情報の付与が求められます。

注意点として、復元時にロジックを介在させることはできないため、復元で必要になる完全な情報を含める必要があります。

[Versioning in an Event Sourced System] の例を見てみます。
商品会計において、商品価格と消費税をEntityが保持する必要がある場合を考えます。
この時、完全な情報を含めるというのは商品価格と消費税二つの情報をそのままDomain Eventに含めるということです。
現在のみを考えると消費税は商品価格から導出することができるため、これは冗長な情報に思えますが、ご存知の通り、税率は変更されることがあります。
Domain Eventに商品価格のみを保存して復元時に税率をかけるといったことをしてしまっている場合には、税率が変更されるタイミングで全ての復元ロジックを変更する必要があります。
また、税率の変更タイミング以前では継続して以前の税率をかける必要があるため復元ロジック自体が複雑化します。
よって、完全な情報を含めることが重要です。

同様の理由で、外部サービスからの情報に依存したDomain Eventも避けるべきですが、個人情報など、法的な理由から避けられない場合があります。

CQRSを考慮するとDomain Eventのコンシューマの立場で情報を増やすこともあります。
一般的な用語かは不明ですが [マイクロサービスパターン] ではevent enrichmentとして紹介されています。
この手法はDomain Eventがコンシューマにある程度依存することになり、Domain Eventの安定性が低下する懸念があることに注意しましょう。

## Versioning

Aggregateのバージョンを情報として含むべきと述べましたが、Domain Event自体の進化についても設計する必要があります。

近年のアプリケーションはインクリメンタルな変化を要求されるため、Domain Eventも当然変化する必要があります。
一方で、Domain Eventはその特性から過去のものを書き換えることができないため、バージョニングには工夫がいります。

[Versioning in an Event Sourced System] ではJSONやXMLなどに代表される、ゆるいスキーマを用いる方法を提案しています。
この手法で例えばJSONを使用した場合、

> * Exists on json and instance -> value from json
> * Exists on json but not on instance -> NOP
> * Exists on instance but not in json -> default value
>
> [Versioning in an Event Sourced System]

のように、後方互換性および前方互換性を維持することができます。

パフォーマンス上の問題などがない場合は、言語機能として提供されていることの多いMappingを用いると良いですが、全てのバイナリをメモリに取り込むのが難しい場合や、フィールドが1万あるうちの1つだけしか使用しない場合などはWrapper形式のデコーダーを用いると良いです。こちらも詳細は [Versioning in an Event Sourced System] に記載されています。

また、AtomのようにNegotiationを用いて対応しているバージョンのDomain Eventを取得する方法もあります。

アンチパターンは型としてそれぞれのバージョンを定義する方法です。
これはバージョンが2つや3つの間はうまくいきますが、バージョンが200や300になったことをイメージすると難しいことがわかると思います。

# 実装

## 前提

### フレームワーク

Event SourcingやCQRSを行うためのフレームワークはいくつも存在します。
一方で、CQRSの生みの親であるGreg Youngは [YouTube - A Decade of DDD, CQRS, Event Sourcing](https://youtu.be/LDW0QWie21s) にて、CQRSやEvent Sourcingはフレームワークを使わずに実装することを推奨しています。
Domain Eventにまつわる実装は、完全なコアドメインの実装であり、外部依存を可能な限り避けるべきという極めて単純明快な考え方です。

以下の実装例では、フレームワークのリンクがいくつか含まれますが、それらのリンクは参考としての記載であり、使用の推奨の意図はないことに注意してください。

### Domain Eventの処理

実装について見る前に、Domain Eventに関する具体的な処理の流れについて整理します。

1. AggregateによるDomain Eventの作成
2. Domain Eventの内部通知とハンドリング
3. Domain Eventの永続化
4. Domain Eventの外部通知とハンドリング

ここで気をつけるべきポイントはAggregateから境界づけられたコンテキスト内部に行われる内部通知と、境界づけられたコンテキストを超えて発信される外部通知の区別です。
同様にハンドリングも内部通知と外部通知でそれぞれ行う必要があります。

## 型定義

慣れているGoで記述します。

基本的な要件は

* イベントハンドラが全てのDomain Eventを統一して扱えるような規定となる型が存在すること
* 上述の汎用情報を既定の型から取得できること
* 既定の型から個別の型へアップキャスト可能であり、アップキャスト後には個別の情報を取得できること

です。

かなり簡略化して記載しているので、実際に実装する際は公開範囲や命名など諸々ケースバイケースで整えてください。

### interface

interfaceで必須の条件の定義と、規定の型の作成を行います。

```go
// DomainEvent 全てのDomain Eventで必要になる情報のGetterを定義しています.
type DomainEvent interface {
	AggregateID()      string
	AggregateVersion() int
	OccurredAt()       time.Time
}
```

```go
// OrderPlaced Orderが発注されたことを表すDomain Eventです.
type OrderPlaced struct {
	aggregateID      string
	aggregateVersion int
	occurredAt       time.Time
	orderID          string
}

func (e OrderPlaced) AggregateID() string { return e.aggregateID }

func (e OrderPlaced) AggregateVersion() int { return e.aggregateVersion }

func (e OrderPlaced) OccurredAt() time.Time { return e.occurredAt }

func (e OrderPlaced) OrderID() string { return e.orderID }
```

全てのDomain Eventに冗長なGetterの定義が必要になります。
Go以外の言語であればinterface (trait) にメソッドを持たせたりもできるので記述を節約できる場合があります。

### DomainEventEnvelope

Event Envelopeのパターンを使用して、Domain Eventの共通情報を一括で取り扱います。
このパターンは [マイクロサービスパターン] で紹介されています。

```go
// DomainEvent マーカーインターフェース.
type DomainEvent interface {
	isDomainEvent()
}

// DomainEventEnvelope Domain Eventの共通情報を一括で取り扱います.
type DomainEventEnvelope struct {
	AggregateID      string
	AggregateVersion int
	OccurredAt       time.Time
	Event            DomainEvent
}
```

```go
// OrderPlaced Orderが発注されたことを表すDomain Eventです.
type OrderPlaced struct {
	OrderID string
}

func (e OrderPlaced) isDomainEvent() {}
```

Aggregateは個別のDomainEventを作成する代わりにDomainEventEnvelopeを作成します。

### Enum

最後にパターンマッチをやりやすいようにEnumで記述する方法もあります。
[CQRS and Event Sourcing using Rust] で紹介されています。

これについては、GoにEnumがないためRustで実装例を示します。

```rust
pub enum OrderDomainEvent {
    Created {
        aggregate_id: AggregateID,
    },
    Closed,
    Placed {
        order_id: OrderID,
    },
}

impl DomainEvent for TaskDomainEvent {}
```

イベントハンドラで扱う際は2段階のパターンマッチが必要になります。

## Domain Eventの内部通知

Domain Eventの作成と通知には大きく分けて3つの方法があります。
[How to publish and handle domain events] のblog postで3つがまとめられています。

全ての方法で共通してDomain EventはAggregateで作成されることを前提としています。

### staticなEvent Publisherを用意してAggregateがPublisherを呼び出す

一つ目の方法は、AggregateがDomain Eventを直接通知する方法です。
原典と思しきblog post [Domain Events - Salvation] が2009年に書かれているため、かなり古い実装パターンであると思われます。
[実践ドメイン駆動設計] にて紹介されている実装パターンでもあります。

Event Publisherの実装も通知の実装もかなりシンプルになりますが、2つの欠点が存在するため近年で推奨している人はあまり見かけません。
欠点は以下の通りです。

* Event Publisherを介して即座に通知が発生するため、処理のオーケストレーションが非常に難しい (永続化前に外部公開してしまうなどが発生しやすい)
* staticな処理に依存するため副作用が発生し、処理の認知的負荷の増大やテストの困難さにつながる

#### 実装例

* <https://github.com/VaughnVernon/IDDD_Samples>

### AggregateのCommandの返り値としてDomain Eventを返す

Aggregateのメソッドの返り値としてDomain Eventのリストを返却して、クライアント側 (多くはApplication Service) が通知を行う方法です。
[マイクロサービスパターン] で紹介されている方法です。

この方法は古くから伝わる "Tell, Don't ask" に違反しているようにも見えます。
最初にこの方法を主張していたblog postがリンク切れになっていそうだったので、記憶を掘り起こしながら記述しますが、例えばCommandに対してもエラーの処理などはするので、Eventも同様に処理するのは自然だと主張していたと思います。

この方法はstaticなEvent Publisherを使用する時に発生するデメリットを解消しています。
一方で、新たに生じる問題として、クライアント側の責務が増大することが挙げられます。

#### 実装例

* <https://github.com/j5ik2o/cqrs-es-example-rs>
* <https://github.com/serverlesstechnology/cqrs>

### Aggregateで保持してGetterで取り出す

最後の方法は、Aggregateで作成したDomain Eventを自身の内部に保持して、必要に応じて取り出せるようにする方法です。
この手法の原典は [A better domain events pattern] と思われます。

Domain Eventを必要になるまで保持しておくことで、毎回返り値として返すよりもクライアント側の責務を減らすことができます。
ただし、その分Aggregateの責務が増大して、制限も生まれるため注意が必要です。

#### 実装例

* <https://github.com/hallgren/eventsourcing>
* <https://github.com/get-eventually/eventually-rs>

## 永続化と外部通知

### 要件

永続化と外部通知はアプリケーションとは別に技術選定が必要になる分野です。
例えば、永続化についてはMySQL, Kafka, EventStoreDBなどがあり、それぞれメリットデメリットが存在するので、適切なものを現場に合わせて選択する必要があります。
基本的にはDomain Eventにフォーカスして議論をしてきましたが、本章に関してはEvent SourcingやCQRSのことも念頭に置いて記載を行なっている点に留意してください。

ここでは、第一歩としてDomain Eventの永続化に使用するための要件を見ていきます。

* Read modelの更新のために全てのDomain Eventを発生順に取得できること
* Aggregateの復元のためにAggregateに紐づくDomain Eventを一括で取得できること
* 楽観的ロックを用いたDomain Eventの追加ができること
* 複数のDomain Eventを同一トランザクションで永続化できること
* 永続化と外部通知を同一トランザクションで行えること

Domain Eventは単調増加していくため、スケーラビリティが重要になるなど他にも考慮すべき点はありますが、最低限の要件として上記で十分と考えています。

最後の5番目の要件についてのみ少し補足します。
永続化と外部通知の整合性が担保されない場合は、外部通知のハンドラーからするとEntityのRead model作成に十分な情報が揃っていない、あるいは余計な情報が載っている可能性を排除できず、Read modelの整合性が担保されません。
そのため、永続化と外部通知の技術選定の際の要件として、両者の整合性の保証が挙げられます。

### 永続化

本項記載の内容は [The Good, the Bad and the Ugly: How to choose an Event Store?] を元にしたものです。
blog postにはより詳細な情報が含まれているため、実際に技術選定を行う際には参照しても良いと思います。

Domain Eventの永続化として第一候補に上がるのはEvent Storeです。
有名なものとして [EventStoreDB] があります。
全ての要件をクリアしており、外部通知についてもカバーできていることから、機能面では最適な選択肢と言えるでしょう。
一方で、Event SourcingやCQRSは日本で一般的に使用されているとは言い難い状況である中で、それらに特化したDBの普及率というのは察せられるところではあります。
日本語での知見が少なかったり、自分でマネジメントする必要があったり、学習コストが発生したりと機能面以外の課題は多く存在します。

次の候補として有力なものはRDBMSです。
ソフトウェアエンジニアであれば全員が知っている知識になるため、学習コストなどが発生しません。
機能面に関しても全ての要件を満たしています。
課題は自分で調整しなければならない範囲が多い点です。
Domain Eventのimmutabilityの確保や外部通知との整合性の保証など、自分で設定していく必要があります。
また、先述のとおりDomain Eventの内容はWeak Schemaで記述することが望ましいく、JSONなどの形式で保存することになりますが、RDBMSはそのような形式のデータを扱うのに最適な実装ではないため、Domain Event自体の検索を頻繁に行う場合などは注意が必要です。

RDBMSと比較されがちなDocument based databaseについても候補になり得ます。
Document based databaseはWeak Schemaの扱いが得意であるため、Domain Eventの内容をうまく処理できます。
一方で、複数のDomain Eventの保存を同一トランザクションで行う要件について満たしていないDBが多いため、選定には注意が必要です。

最後にインターネットで人気のKafka (永続化機能を有するメッセージブローカー) も全ての要件を満たす候補です。
Kafkaを使用する場合の問題点は3点で、全体の順序とAggregateをキーとした検索の両立が難しいこと、永続化と外部通知を同一トランザクションで行うにはレプリカを設定する必要があること、権限管理が難しいことです。
これらの課題をクリアできるのであれば、外部通知の機能を有する (むしろそちらがメイン) のKafkaを永続化アプリケーションとして使用することで学習コストやメンテナンスコストを抑えることができます。

### 外部通知

外部通知では、順序保証が要件であり、配信保証が求められる状況が多いため、メッセージブローカーが利用されることが多いです。
メッセージブローカーごとに配信保証は異なるため、ドキュメントを読み込んで適切なものを選択しましょう。

重要なポイントは永続化層との整合性を保つことです。
これはOutboxパターンを用いることで多くの場合解決できます。
OutboxパターンとはDomain Event書き込み時トランザクション中に、外部通知用のテーブルにも追加でデータを書き込んでおくことで、整合性管理が得意な永続化アプリケーションに整合性を保証させる手法です。

他にもCDC (Change Data Capture) や永続化アプリケーションの更新トリガー機能を使用することも可能です。

いずれの場合もPublishが正常に終了できなかったときに、リトライまたはロールバックが可能なことを確認しましょう。

Event Storeの多くは永続化アプリケーションとメッセージブローカーの結合機能まで提供しているため、管理する点が減ります。

# まとめ

結局、臨機応変な対応を求められることがほとんどのため、アンチパターンを理解して、それを回避しながら自分の状況に合わせて設計することが重要と感じました。

あと、まとめる過程で自分が一番勉強できたので大変有意義でした。

# 参考文献

[10 problems that Event Sourcing can help solve for you]: https://www.eventstore.com/blog/10-problems-that-event-sourcing-can-help-solve-for-you
[A better domain events pattern]: https://lostechies.com/jimmybogard/2014/05/13/a-better-domain-events-pattern/
[CQRS and Event Sourcing using Rust]: https://doc.rust-cqrs.org/intro.html
[Domain-Driven Design Reference]: https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf
[Domain Events - Salvation]: https://udidahan.com/2009/06/14/domain-events-salvation/
[EventStoreDB]: https://www.eventstore.com/
[EventStorming]: https://www.eventstorming.com/
[How to publish and handle domain events]: https://www.kamilgrzybek.com/blog/posts/how-to-publish-handle-domain-events
[Learning Domain-Driven Design]: https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/
[microservices.io, Domain event]: https://microservices.io/patterns/data/domain-event.html
[The Good, the Bad and the Ugly: How to choose an Event Store?]: https://medium.com/digitalfrontiers/the-good-the-bad-and-the-ugly-how-to-choose-an-event-store-f1f2a3b70b2d
[Versioning in an Event Sourced System]: https://leanpub.com/esversioning/read
[アーキテクチャの進化はドメインイベントが起点になる]: https://kakehashi-dev.hatenablog.com/entry/2023/12/24/091000
[マイクロサービスパターン]: https://amzn.asia/d/4OLI8J3
[実践ドメイン駆動設計]: https://amzn.asia/d/aTaMHd9
[事業分析・データ設計のためのモデル作成技術入門]: https://amzn.asia/d/4GAqWm3

* [10 problems that Event Sourcing can help solve for you]
* [A better domain events pattern]
* [CQRS and Event Sourcing using Rust]
* [Domain-Driven Design Reference]
* [Domain Events - Salvation]
* [EventStoreDB]
* [EventStorming]
* [How to publish and handle domain events]
* [Learning Domain-Driven Design]
* [microservices.io, Domain event]
* [The Good, the Bad and the Ugly: How to choose an Event Store?]
* [Versioning in an Event Sourced System]
* [アーキテクチャの進化はドメインイベントが起点になる]
* [マイクロサービスパターン]
* [実践ドメイン駆動設計]
* [事業分析・データ設計のためのモデル作成技術入門]
