---
title: 'データ指向アプリケーションデザインをまとめる'
date: '2023-05-27'
tags: [book]
cover: ./preview.jpg
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
excerpt: データ指向アプリケーションデザインを読んだので整理する
---

# 目次


# この記事の内容

[データ指向アプリケーションデザイン](https://www.oreilly.co.jp/books/9784873118703/) を読んだので、自分のために整理します。

# データシステムの基礎

## データシステムの課題

アプリケーションには機能的な要求と、非機能的な要求があり、非機能的な要求の中には、セキュリティ、信頼性、コンプライアンス、スケーラビリティ、互換性、メンテナンス性などがありますが、書籍では特に下記3つの課題について深く掘り下げていました。

* 信頼性: フォールトがあってもシステムが正しく動作できること。
* スケーラビリティ: 負荷の増大に対してパフォーマンスを保つ戦略を保つこと。負荷を定量的に表現することが重要。
* メンテナンス性: 運用性、単純性、進化性の観点からエンジニアや運用チームの業務効率を向上させること。

## データモデル

データモデルとして以下のモデルを紹介します。

* 階層モデル
* ネットワークモデル
* リレーショナルモデル
* ドキュメントモデル
* グラフ型のデータモデル

最後に最近のデータモデルの傾向を加えて本章の説明とします。

### 階層モデル

大きなツリーとしてデータを扱います。多対多の関係をうまく表現できません。今日の主流ではないです。

### ネットワークモデル（CODASYLモデル）

アクセスパスという概念を導入し階層モデルの課題である多対多の関係を表現できるようにしました。リレーショナルモデルと比較して、アプリケーションのデータモデルに変更を加えるのが難しく、リレーショナルモデルが主流となりました。

### リレーショナルモデル

多対多の関係をうまく扱えます。オブジェクト指向のデータモデルとインピーダンスミスマッチを起こします。結合が頻繁に必要になるため、パフォーマンスや複雑性の観点に難点が生じる可能性があります。事前にデータのスキーマを定義する必要があります。

### ドキュメントモデル

スキーマが柔軟に定義できます。データローカリティによってパフォーマンス向上が見込めます。データ間の関係が薄い場合に適しています。

### グラフ型のデータモデル

データ間の関係を重視したモデル。頂点とその関係をモデル化するので、関係を用いて頂点を検索できます。リレーショナルモデルでは関係は事前にすべて把握した上で結合を行う必要がありますが、グラフ型のデータモデルの場合は結合の数が変動しても問題ありません。

### 最近の傾向

RDBとしてリレーショナルモデルが、NoSQLとしてドキュメントモデルとグラフモデルが利用されています。
RDBはドキュメントモデルのサポートを行う流れがあり、NoSQLにも関係の表現を強化する流れがあることから、実際のデータベースはリレーショナルモデルとドキュメントモデルの両方を扱うことができるものも多くあります。

## クエリ言語

データモデルにそれぞれクエリ言語やフレームワークがあります。
今日の多くのクエリ言語は宣言的なクエリ言語になっています。命令的なクエリ言語と比べ可読性が高く、データの扱い方についてはデータベースへ委ねることでクエリの書き直しをすることなく、データベースを更新することなどでパフォーマンスの向上が見込めたりします。

* SQL
* MapReduce
* aggregation pipeline
* Cypher
* SPARQL
* Datalog
* etc...

グラフ型のデータモデルとグラフ指向のクエリ言語を用いた場合、うまくユースケースに当てはまるものならSQLの1/5程度の記述量で、非常に明瞭なクエリを書くことができます。

## ストレージの基礎的な概念

### ログ

追記だけが行われるレコードの並びを指してログと呼びます。

アプリケーションログのみのことを指していないので注意が必要です。

### インデックス

特定のキーの値を効率的に見つけるために、主たるデータから追加でメタデータを定義し、データを探すための方法を提供します。

### コンパクション

ログ中で重複しているキーを捨てて、それぞれのキーに対する最新の情報だけを残す処理です。

### セグメント

記録が行われるファイルは単一ではなく分割されて複数になることが一般的です。
分割されたファイルが数メガバイト以上の可変サイズである場合、一つ一つの分割されたファイルをセグメントファイル、あるいは単にセグメントと表現します。

### ブロック、ページ

上述のファイルが固定サイズ（通常4KB）の場合、ブロックやページと呼ばれます。

### 墓跡（tombstone）

キーと値の削除を表現するための特別な削除のレコードです。

### ログ vs ファイルの更新

ログを用いてデータを保存することは、以下の点においてファイルのレコードを直接変更していくよりも優位です。

* シーケンシャルな書き込み処理になるので、ランダムな書き込みよりもはるかに高速です。
* 並行処理とクラッシュリカバリの考慮がしやすいです。値の上書きの最中にクラッシュが生じ、一部が古い値で一部が新しい値になっているような状態のファイルを考慮する必要がありません。
* 古いセグメントをマージすることで、フラグメンテーションを防ぐことができます。

## ストレージのデータ構造

代表的なインデックスを構築するデータ構造として、

* ハッシュインデックス
* LSMツリー
* Bツリー

の概要を確認します。

また、LSMツリーとBツリーの比較やインデックスと値の関係についても合わせて説明します。

### ハッシュインデックス

例: Bitcask

ほとんどのプログラミング言語に見られる辞書型に近いデータ構造です。
データストレージがファイルへの追記のみを行う場合、インメモリハッシュマップへレコードのキーとバイトオフセットを記録します。

すべてのキーが利用可能なRAMに収まる必要があります。
レコードが書き込まれるたびにインメモリハッシュのサイズが大きくなっていくため、セグメントごとにコンパクションを行ってハッシュのサイズを小さく保ちます。
また、セグメントごとのハッシュが小さくなることが多いので、コンパクション後のセグメントをマージすることで、セグメントの数も小さく抑えることができます。
キーに対する値を見つけるためには、最新のセグメントのハッシュマップをチェックし、キーがなければ2番目、3番目と順にキーを探していくことになります。

並行性の制御のために、ハッシュインデックスを実装する場合は、ログへの書き込みを行うスレッドは一つだけとなります。
読み取りは変更を加えないので、複数スレッドで実行できます。

ハッシュインデックスの制約は主に以下の二つです。

* RAMにすべてのハッシュテーブルを載せることが前提です。ディスク上にハッシュテーブルを置くことも可能ですが、パフォーマンスが著しく低下し、ハッシュの衝突への対応が必要になります。
* 範囲に対するクエリへのパフォーマンスが低いです。

### SSTableとLSMツリー

例: LevelDB、RocksDB、Cassandra、HBase

Sorted String Tableを略してSSTableです。
ハッシュインデックスの仕組みに以下の2つの制約を追加します。

* セグメントファイルのキーと値のペアの並びがキーでソートされていること
* セグメントファイル内でそれぞれのキーは一度だけしか現れないこと

制約を加えることで下記の利点を得ることができます。

1. セグメントファイルが利用可能なメモリ量よりも大きくなってもマージソートと似たアルゴリズムで、ファイルのマージとキーのソートを効率的に行うことができます。同じキーがマージ対象の両ファイルに存在した場合、新しいセグメントファイルの値を残せば良いので、コンパクションも効率的に行えます。
1. セグメントファイル中のキーを探すときに、すべてのキーをメモリに保持しておく必要がなくなります。ソートが行われているため、メモリに保持してあるキーの中から順序が隣接するものを探し、そのキー二つのオフセットの間をスキャンすれば対象のキーが見つかります。
1. 読み取りのリクエスト処理では上述の通り、範囲内にある複数のキーと値のペアをスキャンする必要があるため、ディスクに書き込む際に範囲内のキーと値のペア群をグルーピングし、圧縮することが可能です。圧縮はディスクの領域削減とI/Oの帯域削減に繋がります。

データ保存時にソートする方法については、

1. 書き込み要求が来たら、まずはインメモリのバランスドツリーデータ構造（e.g. red-blackツリー）に追加します。このインメモリツリーはmemtableと呼ばれることもあります。
1. memtableが何らかの閾値を超えた際に、SSTableのファイルとしてディスクに書き出します。ソート済みのデータを書き込むので、このタイミングでのソートは不要です。書き込み要求は新しいmemtableを用意して継続して処理します。

のように、ソート済みのツリー構造を保持できるインメモリのデータ構造を利用してソートを行います。

読み取りのリクエストが来たときは、最初にそのキーをmemtableから探し、なければディスク上の最新のセグメントを、さらになければ次のセグメントを、と言ったように順に探していきます。

バックグラウンドでマージとコンパクションのプロセスを実行し、データの圧縮を行います。

SSTableの課題はデータベースがクラッシュしたときにmemtableのデータが失われてしまうことです。
対策として、書き込み要求を即座にログへ記録していきます。このログはソート順になっていませんが、memtableの復旧のみを目的としたものなので、問題ありません。

ソート済みのファイルのマージとコンパクションという原理を基盤とするストレージエンジンはLog-Structured Merge Tree（LSMツリー）と呼ばれます。

LSMツリーのインデックス構造を持つデータベースのパフォーマンス上の課題は、キーが存在しないことの確認に時間がかかることです。
そのため、データベースではブルームフィルターを用いた最適化が施されていることがあります。

### Bツリー

例: MySQL

最も広く使われているインデックス構造です。
ほとんどすべてのリレーショナルデータベースにおいて標準的なインデックス実装となっています。

セグメントではなく、ページを利用してデータを保存します。
1つのページがBツリーのルートとなります。
ページには複数のキーと子のページの参照が含まれており、それぞれの子はキーの連続的な範囲を受け持っています。
順にページを辿っていくことで、最終的に値を保持するページに辿り着きます。

```
# 123を探したい

■root
ref0, 100, ref1, 200, ref3

■ref1
ref10, 122, ref11, 125, ref12

■ref11
122, val122, 123, val123, 124, val124

```

Bツリー1ページ内の子ページへの参照数は分岐係数と呼ばれます。
これは通常数100程度の値です。
新しいキーを追加するときに、キーの値を含むページに空き領域がない場合は、そのページを2分割して親のページを分割に合わせて更新します。

Log-Structuredなデータ構造とは異なり、Bツリーはディスク内のデータを直接上書きしていくこととなります。
これはデータベースのクラッシュでインデックスが破損する可能性があるため、信頼性の担保のためにデータベースの実装で右派write-aheadログ（WAL）を持たせます。
WALへはBツリーへのすべての変更内容がログとして記録されます。
データベースがクラッシュした場合はWALを用いて復旧を行います。

並行処理のために、ツリーのデータ構造を軽量なロックであるラッチを用いて保護を行います。

### LSMツリーとBツリーの比較

広く普及しており、時の試練にも耐えているBツリーと比較して、LSMツリーの利点と欠点について整理していきます。

* pros
    * 書き込みを高速に行える
    * 圧縮率を高めることができる
    * フラグメンテーションを抑えることができる
* cons
    * 読み取りがBツリーよりも遅い
    * コンパクションがクエリのレスポンスタイムに影響することがある
    * コンパクションが書き込みのスループットを増大させてしまい、書き込み要求に割けるリソースが限られてしまう
    * ディスクのスループットが大きい場合、コンパクションが追いつかなくなる場合があり監視の必要がある
    * 複数セグメントファイルに渡ってキーが重複している可能性があり、トランザクションを実装しにくい
    * 書き込みの増幅が発生するためSSDの寿命などが問題になる可能性がある

### その他のインデックス構造

#### セカンダリインデックス

キー-バリューのインデックス構造を見てきましたが、これはリレーショナルモデルにおけるプライマリキーに該当します。

その他のインデックスとして、セカンダリインデックスがあります。
セカンダリインデックスがキー-バリューインデックスと異なる点はキーがユニークでないことです。
よって、インデックス内のそれぞれの値をマッチする行の識別子のリストにするか、それぞれのキーに行の識別子を追加してキーをユニークにすることで、これまで見てきたBツリーやlog-structuredなインデックスをセカンダリインデックスとして利用できます。

#### インデックスへの値の保存

インデックスの値は実際の行か、行への参照のどちらかです。
前者のようなインデックスをクラスタ化インデックスと呼びます。
また後者の場合、参照先の実際に行が保存されている場所をヒープファイルと呼びます。

クラスタ化インデックスと非クラスタ化インデックスの中間のインデックスをカバーリングインデックスや付加列を持つインデックスと呼び、テーブルの一部の列をインデックスに保存しています。

クラスタ化インデックスやカバーリングインデックスを利用することで、読み取りの速度を向上させられますが、書き込みにはオーバーヘッドが生じます。

#### 複合インデックス

一般的な方法として連結インデックスがあります。
これは単に複数のフィールドを連結してインデックスのキーとしたものです。

他に多次元インデックスと呼ばれるアプローチも存在します。
多次元インデックスを利用すると、緯度と軽度を用いた二次元の範囲に対する検索が効率的に扱えます。
詳細は書籍にも記されていません。

#### 全文検索と曖昧インデックス

これまで見てきたインデックスは厳密なキーに対して構築されており、曖昧なクエリに対応できません。

例えばLuceneは特定の編集距離内にある後をテキストから検索できるようになっています。

その他の方針として、ドキュメントのクラシフィケーションや機械学習が挙げられます。

#### 全データのメモリでの保持

キャッシュの用途などではインメモリデータベースも選択肢として入ってきます。

インメモリデータベースはディスクベースのストレージエンジンよりも高速ですが、これは読み取りの高速化によるものではなく、データ構造をディスクに書き込める形式にエンコードするオーバーヘッドを回避できることによるものです。

インメモリデータベースでは、ディスクベースのインデックスでは実装が難しいデータモデルを提供できます。
例えばRedisはプライオリティキューや集合と言ったデータ構造を提供しています。

## データウェアハウス

データベースはここまで見てきたオンライントランザクション処理（Online transaction processing、OLTP）のみではなく、データ分析でも利用されます。
データウェアハウスはデータ分析に特化した形のデータベースです。

データウェアハウスには企業内の様々なOLTPシステムすべてのデータのコピーがリードオンリーで置かれます。
データはOLTPデータベースから分析に適した形式に変換された後に、データウェアハウスへロードされます。
OLTPデータベースからの抽出、変換、読み込みの処理をETL（Extract-Transform-Load）と呼びます。

OLTPデータベースとデータウェアハウスのインターフェイスの多くはSQLですが、内部の実装は大きく異なり、トランザクション処理と分析的な処理の双方に焦点を当てているデータベースはありません。

多くのデータウェアハウスは商用ライセンスの下で販売していますが、最近ではオープンソースのSQL-on-Hadoopのプロジェクトも立ち上がってきています。

### スターとスノーフレーク

データウェアハウスのテーブル設計の中心にはファクトテーブルが存在します。
ファクトテーブルとはイベントの集合です。
ファクトテーブルはディメンションテーブルへの外部キーを保持しており、ディメンションテーブルは人物、日時、場所、理由などの情報を表しています。
このようなデータウェアハウスのスキーマをスタースキーマと呼びます。

スタースキーマの正規化をさらに進めて、ディメンションテーブルの先にさらにサブディメンションテーブルを作成したものをスノーフレークスキーマと呼びます。

### 列指向ストレージ

ファクトテーブルは膨大な行数になり得ますが、分析用途で大量の列が必要になることは稀です。
多くのOLTPデータベースでは、ストレージは行指向でレイアウトされていますが、データウェアハウスの用途では列指向のストレージレイアウトを用いて、列ごとに保存する方が有利になることがあります。

データウェアハウスで特に有効な方法はビットマップエンコーディングによる列の圧縮です。
行指向に対して似た値をまとめやすい列指向はより効率的にデータの圧縮を行うことができます。

## エンコーディングと進化

リレーショナルデータベースでは一つの時点では唯一のスキーマを前提として処理が行われています。
スキーマオンリードなデータベースはスキーマを強制しないため、上記の前提は適用されず、データベースには新旧のデータフォーマットが混在することになります。

データフォーマットやスキーマが変更されると、しばしばアプリケーションコードへの対応が必要になります。
一方で、アプリケーションがローリングアップデートによるデプロイメントを行っていたり、クライアントがなかなかアプリケーションのアップデートを行ってくれなかった場合には新旧のコードが混在することにもなります。

システムをダウンタイムなく稼働させるには、後方互換性と前方互換性について注意を払う必要があります。
後方互換性は新しいコードを書くときに適切に古いデータフォーマットを扱えば済むので特に難しくありません。
前方互換性は新しく扱われる可能性のあるデータフォーマットの既存のコードで扱えるようにしなければならないので、ときには難しくなることがあります。


### データエンコードのフォーマット

インメモリでのデータの表現と、外部とのやり取りに使われるバイト列を用いたデータの表現は異なります。
インメモリの表現からバイト列への変換をエンコーディング（シリアライゼーション、マーシャリング）と呼び、逆をデコーディング（デシリアライゼーション、アンマーシャリング）と呼びます。

#### 言語固有のフォーマット

PythonやJavaには `pickle` や `java.io.Serializable` のエンコーディングの機能が組み込まれています。
これらの機能にはいくつかの問題点があります。

* 言語と密に結びつけられることが多いため、データがプログラミング言語に縛られる
* オブジェクトをデコーディングする機能のため、RCEにつながる可能性がある
* 手軽さを重視して、前方互換性や後方互換性には気を遣われていないことが多い
* 効率性についても気を遣われていないことが多い

#### JSON、XML、その他

標準化されたフォーマットで代表的なものはJSONやXMLです。
これらのフォーマットにもいくつかの問題があります。

* 数値のエンコーディングが曖昧な仕様になってしまっている
* JSONやXMLはユニコード文字列のサポートには優れているものの、バイナリ文字列をサポートしていない
    * この問題を回避するためにBase64でバイナリ文字列をエンコーディングできるが、変換処理が一つ増えるのとデータ量が33%増加する
* XMLとJSONにはスキーマ言語が付随しているが、学習コストも高いため普及率が高いとは言えず、アプリケーションが適切なロジックをハードコーディングすることが多い
    * CSVにはそもそもスキーマがない

#### バイナリエンコーディング

JSONやXMLは人間が読めるデータフォーマットですが、これらの容量を削減するために、専用のバイナリ表現がいくつも開発されています。
例えばJSONにはMessagePackがありますが、劇的な圧縮を行うことはできず、JSONの人間にも読めるというメリットを失うことになります。

Apache ThriftとProtocol BuffersはどちらもIDLでスキーマを記述して、バイナリへエンコーディングします。
これらはバイナリではタグでフィールドが表現され、データサイズをかなり抑えることが可能です。
ThriftやProtocl Buffersではスキーマを定義しますが、スキーマの進化のために後方および前方互換性を担保しています。

Apache AvroはThriftがHadoopのユースケースにうまく適合しなかったことを受けて開発されました。
AvroはThriftとProtobufとスキーマ定義の方法が異なり、人間が編集することを意図したAvro IDLと機械が読むためのJSONベースの2種類のスキーマ言語を扱います。
また、Avroではタグでフィールドを示しておらず、スキーマ定義の順番に依存したバイナリ列で表現するので、データを書き込みと読み取りで完全に同じスキーマを使用しなければデータのデコードに失敗します。
Avroでは後方および前方互換性を保つために、リーダーにもスキーマ定義を持たせ、リーダーとライターのスキーマ定義の差分を吸収しつつ、補完しなければならない部分はデフォルト値で補うようにして、互換性を担保します。
先述の通りデコードにはライターのスキーマが必要になりますが、Avroのユースケースではライターのスキーマをエンコーディングされたデータの側に置けます。

ProtobufやThriftがタグを用いてるのに対し、Avroはタグを用いないことで、動的に生成されたスキーマを扱うことが容易になります。

ThriftやProtobufはコード生成が必要になるため、明示的なコンパイルを避けて気軽にプログラムを実行するための動的型付け言語とは相性が良くないと考えられます。
Avroは必ずしもコード生成をする必要がないため、動的型付け言語での利用でも問題ない可能性もあります。

バイナリエンコーディングがJSONやXMLよりも優れている点がいくつかあります。

* データサイズが小さくなること
* スキーマ定義は常に最新に保たれるのでドキュメントとして有用であること
* スキーマのデータベースを管理することで後方および前方互換性をチェックできること
* 静的型付け言語を利用する場合コンパイル時に型チェックができるようになること

### データフローの形態

* データベース経由
* サービス呼び出し経由
    * Webサービス
        * REST
        * SOAP
    * RPC
* 非同期のメッセージパッシング経由
    * メッセージブローカー
    * 分散アクターフレームワーク

# 分散データ

## レプリケーション

レプリケーションとは、ネットワークで接続された複数のマシンに同じデータがコピーされ、保持されることであり、以下の理由で行われます。

* ユーザーに近い位置にデータを配置しレイテンシを下げるため
* 冗長性を高めて、システムの可用性を向上させるため
* 読み取りを処理するマシンをスケールアウトしてスループットを高めるため

また、レプリケーションのアルゴリズムで主流なものは下記のものです。

* リーダーとフォロワー
    * シングルリーダー
    * マルチリーダー
* リーダーレス

また、これらのレプリケーションが同期的に行われるのか非同期的に行われるのかも重要な観点です。
レプリケーションにまつわる問題について考察した後に、それぞれのアルゴリズムについて見ていきます。

### レプリケーションラグにまつわる問題

#### read-after-write一貫性

read-after-write一貫性、またはread-your-writes一貫性とは、ユーザーが自分で書き込んだデータが、次回の読み取り時に必ず反映されていることを保証することです。

シングルノードのアプリケーションでは上述の保証は容易いものの、非同期なレプリケーションの結果整合性の遅延をそのままにしてはread-after-write一貫性は保たれない可能性があります。
非同期なレプリケーション環境下でread-after-write一貫性を保証するには、書き込み直後のクライアントの読み取りがリーダーから行われるようにしなければなりません。
リーダーから読み込むか否かの判定はアプリケーションごとに設計する必要があります。
いくつかの設計のヒントが書籍に記されているので、実際に必要になった際は参照してください。

#### モノトニックな読み取り

クライアントが2回読み取りを行った際に、1回目は遅延の少ないノードから最新の結果が返されたものの、2回目の読み取りで遅延の大きいノードに接続してしまい、クライアントから見ると誤った上書きがされたように見えてしまいます。

モノトニックな読み取りはこのような以上が発生しないことを保証します。
データを読み取る場合に古い結果が買える可能性はありますが、クライアントが連続して行った複数の読み取りについて、時間が巻き戻らないことを保証します。

モノトニックな読み取りを行う簡単な方法は、クライアントが接続するノードを常に同じにすることです。

#### 一貫性のあるプレフィックス読み取り

チャットアプリなどの投稿順序が前後した場合、因果関係が崩れてしまいます。
これを防ぐためには一貫性のあるプレフィックス読み取りの保証が必要です。

互いに因果関係を持つ書き込みは必ず同じパーティションに書き込まれるようにすることで、一貫性のあるプレフィックス読み取りが保証されますが、パフォーマンスとのトレードオフになる場合があります。

### シングルリーダー

1. レプリカの1つはリーダーに指定されます。データベースへの書き込み要求はすべてリーダーに対して行われ、リーダーは新しいデータをローカルストレージに書き込みます。
1. リーダー以外のレプリカはフォロワーと呼ばれます。リーダーは新しい書き込みがあったことをフォロワーへ通知します。その内容に従ってフォロワーは書き込みを行います。
1. 読み取り要求はリーダー、フォロワーの双方が受け付けることができます。

レプリケーションは同期的、非同期的あるいは準同期的に行うことができます。

* 同期的なレプリケーション
    * フォロワーが持っているデータが最新であることが保証されています。
    * フォロワーが反応しなかった場合、書き込み処理ができなくなってしまう恐れがあります。このデメリットが大きすぎるので現実的にすべてのフォロワーを同期することは不可能です。
* 順同期的なレプリケーション
    * フォロワーの一部を同期的にして、他を非同期的にすることで、同期的なレプリケーションのデメリットを緩和します。
* 非同期的なレプリケーション
    * 同期的なレプリケーションよりも可用性に優れます。
    * リーダーに障害が発生しリカバリが不可能な場合、フォロワーへレプリケーションされていないデータは失われることとなります。そのため、クライアントに書き込み成功のレスポンスが返ってきてもデータの永続性は保証されません。

リーダーとフォロワーがそれぞれ障害でダウンしてしまった場合を考えます。

* フォロワーの障害: キャッチアップリカバリ
    * フォロワーの障害は単純であり、自身の復旧を待った後にローカルディスクに反映されていない変更をリーダーから取得して処理します。
* リーダーの障害: フェイルオーバー
    * 障害の検知
        * ほとんどのシステムは単純にタイムアウトを使用して、リーダーの障害を検知します。
    * 新しいリーダの選出
        * 選出のプロセスを踏んだり、コントローラノードによる指定を行ったりしますが、これらは合意の問題です。
    * 新しいリーダーのための再設定
        * クライアントにリーダーが変更され書き込み要求の送信先が変更されたことを通知する必要があります。
        * 古いリーダーが復旧した際に降格したことを伝えられるようにする必要があります。

フェイルオーバーにはいくつもの問題があります。

* 古いリーダーが保持しているレプリケーションされていないデータの扱いに困ります。
* 特にデータベース外の他のストレージシステムと連携をとっている場合、同期が遅れていたフォロワーがリーダーに昇格した際に他のシステムと整合性が取れなくなり予想外の挙動を示すことに繋がります。
* スプリットブレインと呼ばれる2つのノードが同時に自身をリーダーと捉えてしまう事象が起こり得ます。
* タイムアウトをリーダー障害の検知に利用する場合はタイムアウトの閾値によってシステムの挙動が変化することになり、パラメタチューニングが必要です。

レプリケーションの方法で最もシンプルなのはステートメントベースのレプリケーションです。
これは書き込みリクエストをログに書き込みフォロワーへ送信するというものです。
ステートメントベースのレプリケーションでは、ステートメントないに非決定的な関数などが含まれていた場合に取り扱いを慎重に行う必要があるというデメリットがありますが、送信するデータサイズがコンパクトに収まるというメリットもあります。

write-aheadログ（WAL）を利用する方法もあります。
ストレージエンジンはすべての書き込み行をログに追記していっているので、それを用いてレプリケーションを行います。
WALを用いる欠点はデータが非常に低レベルな記述になっており、レプリケーションがストレージエンジンと密接な関係を持たなければならないため、リーダーとフォロワーで厳密にバージョンを揃える必要性が生じます。

論理ログレプリケーションという別の方法も存在します。
これはストレージエンジンのログとは異なるレプリケーション用のログを扱うことで、密な関係性を排除します。
論理ログは他のアプリケーションにとっても解釈しやすいため、後述するCDCなどでも利用されます。

最後にトリガーベースレプリケーションを紹介します。
アプリケーションによっては単純な全データのレプリケーションのみを行うだけでは機能として不十分になる場合があります。
そのような場合はアプリケーションのレイヤまでレプリケーションの実装を引き上げる必要があり、RDBに実装されているトリガやストアドプロシージャを用いることで実現できます。
この方法は他のレプリケーション手法と比べてオーバーヘッドが大きく、バグが生じやすく、データベースの制約も強く受けるようになりますが、柔軟性の観点で他よりも優位性があります。

### マルチリーダー

#### シングルリーダー構成との比較

シングルリーダーのレプリケーションの欠点はリーダーが1つであることからすべての書き込みを1ノードで捌き切る必要が出てきます。
このデメリットを打ち消すために複数のリーダーノードを用意するのがマルチリーダーレプリケーションです。
パフォーマンスや可用性が複雑性とのトレードオフになり、データセンターひとつでのデータベース運用の場合は複雑性のデメリットが大きすぎるため一般的には複数データセンターでの運用方法として扱われます。

以下では複数データセンター環境でのシングルリーダーとマルチリーダー構成の比較を行います。

* パフォーマンス
    * シングルリーダーだとデータセンターまたぎの通信が必ず発生するので、マルチリーダー構成の方がユーザーが感じるパフォーマンスは向上するかもしれません。
* データセンターの障害に対する耐性
    * シングルリーダーの場合は他のデータセンターへリーダーを移せば終わりです。
    * マルチリーダー構成では他のデータセンターと独立して他のデータセンターが動作することが期待されます。
* ネットワークの問題に対する耐性
    * マルチリーダー構成の場合はインターネットを経由したレプリケーションが減るため、通常シングルリーダー構成よりもネットワークの問題への耐性が高くなります。

#### 衝突の解決

マルチリーダーレプリケーションの大きな欠点の一つが、書き込みの衝突が発生することです。
衝突に起因して、自動インクリメントのキー、トリガー、整合性制約などについて注意深く設定しなければ問題が生じます。

マルチリーダー構成はオフラインでの書き込み処理で必要です。
たとえばスマートフォンでのカレンダーアプリへの予定の挿入などを考えると良いでしょう。
このような場合、それぞれのデバイスをデータセンターと見なすことができます。
また、Google Docsなどのコラボレーティブな編集ツールも同様の考え方ができます。
これらのアプリケーションでは衝突の解決が必要です。

マルチリーダー構成で発生しうる書き込みの衝突について、最もシンプルな回避策は、衝突の発生を設計によって避けることです。
多くのマルチリーダーレプリケーションの実装では衝突の処理が貧弱なため、衝突を避けることは推奨されることが多いアプローチです。

その他の方法として、データベースのレプリケーションが完了した後にはすべてのレプリカが同一の状態になるような収束的な衝突の解決手法がいくつかあります。

* last write wins（LWW）。
* ユニークなIDをすべての書き込みに付与し、一定のルールに従って（例えばIDの数値が大きい方をとるなど）衝突を解決する。
* 衝突した値を連結する。
* ユーザー定義のアプリケーションコードを衝突検知時に実行する。

#### トポロジー

レプリケーションのトポロジーとは、あるノードから他のノードへの通信経路を示すものです。
一般的に下記のようなトポロジーが存在します。

* 循環トポロジー
* スタートポロジー
* All-to-all トポロジー

それぞれのトポロジーでメリットデメリットが存在し、データベースによってサポートしているものも変わります。
書き込み処理に対してのラグにまつわる問題がトポロジー次第で変化するので、トポロジーを必ずチェックする必要があります。

### リーダーレス

AmazonのDynamoを発端に、Riak、Cassandra、Voldemortなどが採用しているレプリケーションの構成です。
これらのデータベースはDynamoスタイルとも呼ばれます。

後述するクオラム一貫性の仕組みの他に、読み取り修復と反エントロピー処理によって、レプリケーションが行われます。
読み取り修復と反エントロピー処理があることで結果整合性が担保されます。
この結果がいつ訪れるのかを予測することは難しく、現在も研究されていますが、どの程度の時間で結果に収束したかを監視することは運用上重要です。

#### クオラム

Dynamoスタイルのデータベースではクライアントは読み書きの要求を複数のノードに対して行います。

n個のレプリカがある時に、w個のノードへ書き込みが成功が保証され、r個のノードへクエリを発行する場合、 `w + r > n` 限りにおいて、必ず最新の書き込みが読み取れます。

wとrの値はアプリケーションにおける読み取りと書き込みの比重によって調整することが可能です。

`w + r <= n` とすることもできます。
この場合は読み取りが最新ものであることの保証はされませんが、可用性とパフォーマンスは高くなります。

クオラム一貫性には限界もあります。
下記のような場合は `w + r > n` に設定していても最新の値が返されない場合があります。

* いい加減なクオラムが使われている場合
* 書き込みの衝突が発生する場合
* 書き込みと読み取りが並行してほとんど同時に行われる場合
* 書き込み処理の成功数がwよりも小さい場合（書き込みが成功したレプリカでは書き込みがロールバックされない）
* 新しい値を持っているレプリカに障害がありリストアしたタイミングで新しい値がロストした場合
* その他タイミングによるエッジケース

よって、クオラムによる一貫性は絶対的な保証ではありません。

#### バージョンベクトル

並行書き込みの検出のためにバージョンベクトルが使われます。

並行書き込みであることが検出された後は、それぞれの実装に依存した衝突の解決が行われます。

## パーティショニング

パーティショニングまたはシャーディングは大きなデータを分割することです。
パーティショニングの主目的はスケーラビリティの向上です。

パーティショニングはレプリケーションと一緒に扱われます。
1つのパーティションは耐障害性を高めるために複数のノードに保存されることがあります。
また、1つのノードには複数のパーティションが保存されることもあります。

### パーティショニングの方法

パーティショニングを行う際には、データがあるパーティションへ偏るスキューが発生しないように気をつける必要があります。
パーティションの決定には以下のアプローチがあります。

* キーの範囲に基づくパーティショニング
    * 単純に範囲にするとスキューが発生しやすいので、キーでソートしてデータベース側にパーティション境界を決めさせる方針もあります。また、境界を動的にリバランスすることも可能です。
    * クエリ実行の効率が良いです。
* キーのハッシュに基づくパーティショニング
    * 特に何も考えなくても均等なサイズのパーティションが作成できます。

セカンダリインデックスを持つデータベースのパーティショニングはさらに複雑です。
下記二つの実装方針が考えられます。
詳細については書籍を参照ください。

* ドキュメントによるセカンダリインデックスでのパーティショニング
* 語によるセカンダリインデックスでのパーティショニング

### リバランシング

求められる実装は必要以上にデータの移動が発生しないリバランスです。
パーティション数およびパーティションの境界が固定されている実装では、ノード数よりも大きな数のパーティションを用意することでデータの移動を抑えることができます。

HBaseの場合はキーの範囲に基づくパーティショニングを前提に、動的にパーティションを分割します。
これは設定された以上のサイズにパーティションが肥大化した際に自動的にパーティションを分割することで実行されます。

3つめの方法はノード数とパーティション数を比例させる方法です。
ノードを増やした際にパーティションの分割を行います。
これを行うにはキーのハッシュに基づくパーティショニングを行っている必要があります。

現状リバランシングが完全に自動化されていることはなく、どこかに人手の介在があります。

### ルーティング

クライアントがリクエストの送信先を判別するための方法は一般的にはサービスディスカバリと呼ばれる問題になります。

ルーティングを行うにはパーティションのノードに対する割り当ての情報を誰かが保持する必要があり、これには3つのパターンが考えられます。

1. すべてのノードが割り当て情報を保持する。クライアントは任意のノードに接続し、接続したノードから求めるキーを含むパーティションを保持するノードの情報を取得する。
1. クライアントとノードの間にルーティング層を設け、ルーティング層が割り当て情報を保持する。クライアントのリクエストはすべてルーティング層を経由する。
1. クライアントに割り当て情報を持たせる。クライアントは割り当て情報を元に直接該当ノードへ接続する。

ルーティングではすべての情報が正しい必要があり、分散システムでは合意を形成する必要があります。
合意アルゴリズムの実装は難易度が高いため、多くの分散データシステムはZooKeeperなどの独立したアプリケーションを利用します。

## トランザクション

フォールトに対する処理を単純にするために導入された概念がトランザクションです。
トランザクションは複数の読み書きを一つにまとめ、その結果を成功であるコミットと失敗である中断およびロールバックの3つに限定します。

### ACID

トランザクションの安全性は、Atomicity、Consistency、Isolation、Durabilityの頭文字をとってACIDと表現されます。
しかしながら、ACIDには曖昧な部分も多く、ACID準拠であることが何を保証しているのかは不明瞭です。

不明瞭ではあるものの、ACIDについて理解していることは他の技術者と会話する上で有益であると考えられるので、簡単にここで説明します。

#### 原子性（Atomicity）

エラーが発生したときにトランザクションを中断し、そのトランザクションのすべての書き込みを破棄することを約束する特性です。

並行処理の文脈で登場する原子性とは関係がないので注意が必要です。

#### 一貫性（Consistency）

データアプリケーションで一貫性について言及する場合、以下の4つの文脈で使われることがあります。

* レプリカの一貫性
* パーティショニングの一貫性
* CAP定理における線形化可能性
* アプリケーションの不変性の担保

上記の4つめがACID定理における一貫性です。

アプリケーション固有の不変性についての概念のため、データベース単体で保証できる一貫性ではないのがACIDの一貫性です。
ACIDのCについてはクライアントアプリケーションで保証する必要があります。

#### 分離性（Isolation）

学術的には直列化可能性（serializability）のことを指します。
直列化可能性を保証したデータベースでは、トランザクションが実行されている場合、そのトランザクション以外は実行されていません。
しかし、パフォーマンス上の制約が強すぎるため、直列化可能な分離性が用いられることは少ないです。

現実的には直列化可能な分離レベルよりもゆるく、ある種の分離性のみを保証した実装を行い、Isolation特性をみなしたとすることが多いです。
また、データベースの中には「直列化可能」という分離レベルの実装がスナップショット分離ということもあります。

#### 永続性（Durability）

トランザクションのコミットが成功した後には、障害が発生しても書き込まれたデータが消失しないことを保証する特性です。

多くのデータベースでは、不揮発性のストレージにデータが書き込まれたことをもって、永続性が保証されたとしています。

### レース条件

並行性にまつわるいくつかの問題を見ていきます。

以下では並行に処理を行っているクライアントをそれぞれA, Bと表現します。

#### ダーティリード

Aが書き込み処理を行っている途中で、Bが読み取りを行い、Aの書き込みがコミットされていないにも関わらずBがその書き込み予定のデータを読み取ってしまうことです。

#### ダーティライト

Aが書き込み処理を行っている途中で、Bが書き込みを行い、意図しない上書きを生じさせてしまうことです。

#### 読み取りスキュー（nonrepeatable read）

Aのトランザクション中にBが書き込みを行い、トランザクション中にAが読み取るデータが一貫しないことです。

#### 更新のロスト

A, Bが並行してread-modify-writeサイクルを実施して、片方が意図せずに上書きを行ってデータが失われることです。

#### 書き込みスキュー

Aがトランザクション中で、何かを読み取り、判断し、書き込みを行う際に、書き込みを行ったタイミングで判断の元になったデータが変更されていることです。

#### ファントムリード

Aが一定の範囲のレコードに対して処理を行っている途中で、Bが範囲内のレコードに更新を行うとAの処理に影響を及ぼしてしまうことです。

### 弱い分離レベル

#### Read Committed

トランザクションの分離性の最も基本的なレベルがRead Committedです。

この分離レベルは、

* ダーティリード
* ダーティライト

の二つの並行性にまつわる問題に対処します。

行レベルのロックを行うことで、ダーティライトを防ぎ、古いコミット済みの値と書き込みロックを取得中の新しい値の両方を保持し、書き込みロックを取得しているトランザクションにのみ新しい値を返すことでダーティリードを防ぎます。

#### スナップショット分離

Read Committedに加えて、読み取りスキューに対処します。
それぞれのトランザクションがデータベースの一貫性のあるスナップショットから読み取りを行うようにします。

スナップショット分離は長時間実行される読み取りのみを行うクエリに適切な分離レベルです。

MVCC（multi-version concurrency control）を用いて実装されることが一般的です。

スナップショット分離はそれぞれのデータベースで違う名称で呼称される分離レベルになっているため注意が必要です。

### 直列化可能性

ファントムリードとそれによって生じる書き込みスキューへ分離性で対処するためには直列化可能性が必要です。

直列化可能性には以下の実装方針があります。

* 完全な順次実行
    * 以下のようの場合には完全な順次実行が現実界になる場合があります。
        * すべてのトランザクションが小さくて高速である。
        * アクティブなデータセットがメモリに収まること。
        * 書き込みスループットが単一のCPUコアで十分処理できること。
        * パーティションを用いないこと、あるいはパーティションを利用するためのハードリミットをかけられること。
* ツーフェーズロック（2相ロック、2PL）
    * 読み取り、書き込み関わらずロックを使って行単位の並行処理を防ぎます。
    * パフォーマンスは非常に低いです。
* 直列化可能なスナップショット分離（SSI）
    * 新しい実装方法で、パフォーマンスと分離レベルの両方を補償できる可能性があります。
    * 2PLと違い楽観的ロックを用います。

## 分散システムの問題

* フォールトと部分障害
    * フォールトの検出はタイムアウトに頼ることがほとんどです。
    * タイムアウトを利用する場合はネットワーク障害とノード障害を区別できず、また本当に障害が発生しているのかの判断も難しいです。
* ネットワーク、クロック、プロセスの信頼性
    * ネットワーク、クロック、プロセスの信頼性の低さは避けることが可能だが、大きな投資が必要になるためトレードオフを吟味する必要があります。
* リーダーとロック、フェイシングトークン
    * 一つのものを決定するのは困難であり、合意アルゴリズムを必要とします。
* システムモデル
    * タイミングの前提
        * 同期モデル: ネットワーク遅延、クロックの誤差、プロセスの一時停止期間に上限があるとするモデル
        * 部分同期モデル: ほとんどの場合同期モデルであるが、稀に上記の上限を超えることがあるとするモデル
        * 非同期モデル: タイミングに関していかなる前提を置くことを許されないモデル
    * ノード障害の前提
        * クラッシュストップフォールト: ノードの障害はクラッシュのみ
        * クラッシュリカバリフォールト: ノードはクラッシュする可能性があり、またその後リカバリする可能性がある
        * ビザンチン障害: ノードが何をするか全くわからない

## 一貫性と合意

### 線形化可能性

レプリケーションに伴う一貫性の問題について、最も強い一貫性レベルが線形化可能性（linearizability）です。
線形化可能性のもとではデータの読み取りは必ず最新の値でなければなりません。

これは以下のようなユースケースで必要になる一貫性レベルです。

* ロックとリーダー選出
* 制約およびユニーク性の保証
* クロスチャネルタイミング依存関係

レプリケーションの方法にごとに線形化可能性の実装可能性を見ると、

* シングルリーダーレプリケーション -> 潜在的に線形化可能
* 合意アルゴリズム -> 線形化可能
* マルチリーダーレプリケーション -> 線形化可能ではない
* リーダーレスアプリケーション -> おそらく線形化可能ではない

線形化可能性が必要な場合、ネットワークへの問題への耐性が低くなります。
逆に、線形化可能性が不要なアプリケーションでは、それぞれのレプリカが独立して動作できるのでネットワーク障害への耐性を高くすることができます。

CAP定理について触れると、Consistency、Availability、分断耐性の3つの特性から2妻で選択することが可能とされていますが、これはネットワークが分断した際に一貫性と可用性のどちらを選択するのかと言い換えた方が適切です。
ネットワークの分断はフォールトの一種であり、避けることができません。
また、CAP定理の可用性という用語は矛盾した複数の定義があり、誤解を生みやすいので他人に説明する際にCAP定理を利用することは避けた方が良いでしょう。

### 順序の保証

順序は因果関係を保つのに必要な概念です。

全順序があれば任意の2つの要素を比較することができます。
数学的な集合などの2つの要素が比較可能か定かでないものは半順序と呼ばれます。
線形化可能性のあるシステムの操作には全順序があります。
因果律は並行に行われた操作について比較不能なため反順序を定義します。

線形化可能性は因果律を正しく保持します。
しかし、因果律を保つ方法が線形化可能性ということはありません。
因果律を保持するためには、ある操作を行う時にどの操作が先行していたのかを知る必要があります。
そのためにシーケンス番号かタイムスタンプ（論理クロックのもの）を用いるのは良い手法です。
シーケンス番号やタイムスタンプは全順序を提供します。
シングルリーダーレプリケーションの場合は特に問題なくシーケンス番号やタイムスタンプを生成することができます。

単一のリーダーが存在しない場合はシーケンス番号の発行は少し難しくなりますが、ランポートランタイムを用いて実現できます。
ランポートランタイムでは `(counter, node ID)` という値のペアについて、すべてのノードとクライアントが過去に見た最大のカウンタを追跡し、すべてのリクエストに含ませます。
似た概念としてバージョンベクトルがありますが、バージョンベクトルが操作が並行していたのかを検出するために用いられるのに対して、ランポートランタイムは全順序を提供して因果律を保持するためのものです。

ランポートランタイムを用いれば全順序の定義ができますが、一般的な分散システムの問題、例えばユニーク制約などの担保などを行うことはできません。
ユーザー名を登録する操作を行う際に、全順序中でその操作よりも前に同じユーザー名の登録を行ったノードがないことが確認して登録を成功とできます。
そこで必要になるのが全順序のブロードキャストという概念です。

全順序ブロードキャストでは二つの安全性が満たされていなければなりません。

* 信頼できる配信
    * メッセージのロストは許されません。
* 全順序づけされた配信
    * メッセージはすべてのノードに対して同じ順序で配信されなければなりません。

ZooKeeperやetcdのような合意サービスは全順序ブロードキャストを実装しています。

詳細は省きますが、全順序ブロードキャストと線形化可能なcompare-and-setレジスタはどちらも合意と等価です。

### 分散トランザクションと合意

複数のノードを何かについて合意させることを目標とします。
分散トランザクションは合意アルゴリズムの一つに位置付けられます。
合意は以下のような場面で必要になります。

* リーダー選出
* アトミックなコミット

合意の問題は、一つ以上のノードが値をproposeし、合意アルゴリズムはそれらの値の中から一つdecideすることとして形式化されています。
上記を満たすために、合意アルゴリズムは以下の性質を持つ必要があります。

* 一様同意（uniform agreement）
    * 2つのノードが異なる決定をしていないこと。
* 整合性（integrity）
    * ノードが決定を2回しないこと。
* 妥当性（validity）
    * ノードが決定する値はいずれかのノードが提案した値であること。
* 終了性（termination）
    * 障害の起こっていないノードは必ず値を決定すること。

#### 2相コミット（2PC）

2PCではコーディネータ（トランザクションマネージャ）と呼ばれるコンポーネントが必要になります。
これはクライアントライブラリに埋め込まれていたり、独立したプロセスとして実装されたりします。

2PCの手順を下記に示します。

1. アプリケーションが複数のデータベースノードへ読み書きのリクエストを送ります。
    * リクエストを送られたノードは参加者と呼ばれます。
1. アプリケーションがコミットできる準備を整えたらコーディネータは参加者に準備リクエストを送ります。
1. すべての参加者が準備リクエストにokのレスポンスを行ったらコーディネーターはコミットリクエストを送信し、コミットが行われます。
1. いずれかの参加者が準備不可のレスポンスを返却したらコーディネータは参加者に中断リクエストを送ります。

仮に参加者がokのレスポンスを返却した後に障害になったとしたら、コーディネータは無限にリトライを続けてコミットを完遂させます。
参加者がokレスポンスを返した後に、コーディネータに障害が起こった場合はコーディネータのリカバリを待つほかありません。
これらの制約が示すのは、一部の障害が大きな影響を及ぼすことに繋がってしまうことです。

#### 耐障害性を持つ合意

2PCは合意アルゴリズムの性質を満たしますが、単一のコーディネータが独裁的に値を決定するので、障害に脆弱なアルゴリズムとなっています。

耐障害性を持つ合意アルゴリズムとして広く知られているのは、Viewstamped Replication（VSR）、Paxos、Raft、Zabです。
これらの実装は非常に困難なので、自前での実装は推奨されません。

これらのアルゴリズムは値の並びに対して決定を行うことで、全順序ブロードキャストアルゴリズムを実装しています。
全順序ブロードキャストは合意を複数回行うことと等価です。

合意アルゴリズムを利用すれば線形化可能でアトミックな処理を実現することが可能ですが、パフォーマンスが非常に低く、ネットワーク障害にも敏感なためトレードオフを考慮する必要があります。

ZooKeeperやetcdは分散キーバリューストアなどと表現され、以下のような用途があります。

* ノードへの処理の割り当て
* サービスディスカバリ
* メンバーシップサービス

# 導出データ

システムは下記の3タイプに分けることができます。

* サービス（オンラインシステム）
* バッチ処理システム（オフラインシステム）
* ストリーム処理システム（準リアルタイムシステム）

本章では、バッチ処理システムとストリーム処理システムのデータ処理にフォーカスし、近年注目されている大規模データの扱い方に言及します。

## バッチ処理

バッチ処理のシステムは、入力データを受け取り、ジョブと呼ばれる処理を実行し、出力データを生成します。
入力データは大きなサイズなことが多く、ジョブの実行には数分から数日などの時間を要するのが普通であり、通常はジョブの完了をユーザーが待つことはありません。
入力データはサイズが膨大になることもありますが、有限のサイズであるという特徴があります。
これは、後に見るストリーム処理との違いです。

以降ではバッチ処理のツールとして

* Unixのツール群
* MapReduce

を見ていき、バッチ処理の特徴に触れていきます。

### Unixのツール群

Unixのツール群は[Unix哲学](https://ja.wikipedia.org/wiki/UNIX%E5%93%B2%E5%AD%A6)と呼ばれる設計思想に則って開発されています。
その結果、Unixのツール群はパイプラインパターンと呼ばれるデザインパターンを使ってスクリプトの記述が可能になっています。

パイプラインパターンを実装するためには任意のプログラムの出力が任意のプログラムの入力に接続できるようにする必要があります。
Unixではプログラムのインターフェースとしてファイルディスクリプタが使われています。
また、多くのUnixのツール群はバイトの並びをASCIIテキストとして扱い、頻繁に使われるツールの多くは改行をテキストレコードの区切り文字としています。
区切り文字については他にも空白やカンマなどが使用され、ツールごとに指定できるようになっていることも多いです。
これらの一様なインターフェースはメンテナンス性に多少難があるものの、数十年経っても使われ続けています。

Unixのツール群が今日も使われている理由として、下記が考えられます。

* 入力がイミュータブルなこと
    * 好きなだけ実験的な実行をしても入力ファイルに影響がありません
* パイプラインを任意の位置で終わらせられること
    * デバッグが簡単になります
* パイプラインの中間結果をファイルに出力できること
    * パイプラインの全てを再度実行する必要がなくなるため実行時間を短縮できます

### MapReduceと分散ファイルシステム

MapReduceはUnixのツール群と多くの設計が似ていますが、Unixのツール群とは違い数千台のマシンで分散実行することができます。

#### 分散ファイルシステム

Unixのツール群は入出力に `stdin` と `stdout` を使用しますが、MapReduceジョブは分散ファイルシステム上のファイルを読み書きします。

MapReduceを備える代表的エコシステムであるHadoopでは、分散ファイルシステムとしてHDFS（Hadoop Distributed File System）と呼ばれるGoogle File Systemのオープンソース実装を使用しています。

HDFS以外にも分散ファイルシステムは多く存在し、GlusterFSやQuantcast File Systemなどが挙げられます。
また、これらの分散ファイルシステムの実装は多くの点でAmazon S3などのオブジェクトストレージと類似しています。
以降の説明はHDFSを念頭に行いますが、その他の分散ファイルシステムでも原則は同様に当てはまります。

HDFSはシェアードナッシング原則に基づいており、NASやSANの共有ディスクアプローチとは異なります。
これにより共有ディスクのようにハードウェア面での制約の多くがHDFSでは取り除かれます。
そのため、HDFSはスケーラビリティに優れたアプローチといえます。
数万台のマシン上で動作し、合計のストレージ容量が数百ペタバイトにもおよぶHDFS環境も存在します。
これは、コモディティハードウェアとオープンソースソフトウェアを利用するHDFSのデータストレージとアクセスコストが、同等の容量を持つ専用ストレージアプライアンスよりもはるかに低いことによります。

#### MapReduceジョブの実行

MapReduceと類似の構造を持つプログラム例としてUnixツール群をあげたので、下記に説明用のUnixプログラムとして、ログの分析スクリプトを記します。

```
cat /var/log/nginx/access.log |  ①
    awk '{print $7}' |           ②
    sort |                       ③
    uniq -c |                    ④
    sort -r -n |                 ⑤
    head -n 5 |                  ⑥
```

上記のプログラムを参考にしながらMapReduceの手順を説明します。

1. 入力ファイル群の読み取りとレコードへの分割を行います。（①）
2. mapper関数を呼び、各入力レコードからキーと値を取り出します。（②）
3. 全てのキーと値のペアをキーでソートします。（③）
4. reducer関数を呼び、ソート済みのキーと値のペアに繰り返し処理を行います。（④）

3で実施したソートによって、4のreducer関数の効率を向上させることができています。

ユーザーはmapperとreducerを実装する必要があります。

mapperは入力レコードに対して一度ずつ呼び出され、キーと値のペアを取り出します。
1つの入力レコードから複数のキーと値のペアが生成されることもあります。
mapperは各レコード間で状態を保持しないため、レコードごとに独立に処理できる必要があります。

mapperによって生成されたキーと値のペアにたいして、キーごとにreducerは呼び出され、同じキーに属するすべての値を対象に処理を行い、出力レコードを生成します。
3に該当する同じキーに属する値を収集する処理はMapReduceフレームワークによって行われます。

mapperの処理は各入力ファイルが存在するマシン上で行われます。
これはサイズの大きい入力ファイルのコピーではなく、比較的軽いプログラムをコピーすることで、ネットワークアクセスのコストを減らす工夫です。

mapperのタスク数は入力ファイル数になりますが、reducerのタスク数はジョブの作成者によって設定されます。
reducerへの入力は、mapperが生成したキーと値のペアをキーのハッシュに従って各reducerへ振り分けられます。
まず、mapperの出力結果をreducerへの割り当てごとにソートし終えたら、MapReduceのスケジューラはreducer群へデータが利用可能になったことを通知します。
reducerへのデータパーティションまでへのプロセスをシャッフルと呼びますが、決定的な処理でありランダム性はありません。
reducerを実行するマシンではデータパーティションをマージし、キーごとのイテレータをreducerに渡してreducerが実行されます。
reducerは任意の出力レコードを分散ファイルシステムに書き出します。

入力データと処理次第ではmapperが作成したキーに大きな偏りが生じる可能性があります。
偏りを生じさせるレコードをリンチピンオブジェクト（linchpin object）またはホットキーと呼び、その結果、あるreducerに処理が偏ることをスキューやホットスポットと呼びます。
ジョブは全てのmapperとreducerのタスクが完了して終了するので、スキューが生じた場合は処理時間が伸びることになります。
この緩和策としてreducerでのマージの構造を崩さないように処理を行うものがいくつかあります。
Hiveではmapperのマシン上でマージをする手法をとることでスキューを解消します。

map側でのマージの代表的なバリエーションとして下記2つが挙げられます。

* ブロードキャストハッシュ結合
* パーティション化ハッシュ結合

#### MapReduceのワークフロー

単一のMapReduceジョブで解決できない問題も多々あるため、通常MapReduceは組み合わせてワークフローとしてまとめられて使用されます。
ワークフローでは一つのジョブの出力が次のジョブへの入力になります。

Hadoopでは特にワークフローをサポートしていないので、ワークフローを作成する際にはジョブの出力結果を次のジョブの入力としてユーザーが設定します。
よって、Unixで例えるとパイプラインよりも一時ファイルの書き出しから再度読み取りを行うと言った流れに似ています。

ワークフロー中のジョブの実行には依存関係が存在するため、それらを管理するためにOozie、Airflowなどのワークフロースケジューラが開発されています。
PigやHiveと言った高レベルのツールは、複数のMapReduceのステージからなるワークフローをセットアップし、自動的に結びつけて実行します。

#### MapReduceを超えて

MapReduce処理を実装することは実際は難しく労力もかかります。
高レベルのプログラムモデル（Pig, Hive, Cascading, Crunch）も開発されましたが、MapReduceの実行モデルからジョブの種類によっては貧弱なパフォーマンスを示す結果となりました。
MapReduceは極めて柔軟で頑健であるものの、非効率な部分が多いため、現在では他の選択肢も検討する必要があります。

MapReduceの代替として開発されたもので有名なものはSpark, Tez, Flinkです。
これらはワークフローを明示的にモデル化するため、データフローエンジンと呼ばれます。

MapReduceの代替についての詳細と比較について紙面をそれなりに割かれていましたが、まとめのために省略しています。
進化が続く分野のため、利用する際には下調べが必要になるという認識が必要そうです。

## ストリーム処理

先述の通り、バッチ処理とストリーム処理の違いは扱うデータのサイズが有限であるか無限であるかです。
ストリーム処理ではバッチ処理におけるレコードをイベントと呼びますが、基本的に両者に違いはありません。

### メッセージングシステム

イベントをコンシューマに届ける方法でよく利用されるものはメッセージングシステムです。
パブリッシュ/サブスクライブモデルの中では、システムごとに目的に応じた最適なアプローチが変わってきます。
以下の2つの質問が適切なシステム構築の助けになるでしょう。

* プロデューサのメッセージ送信速度がコンシューマの処理速度よりも速い場合どうなりますか？
    * メッセージのドロップ
    * バッファリング
    * バックプレッシャー
* ノードに障害が発生した場合メッセージが失われることはあるでしょうか？
    * 永続性を担保するためにはデータベースと同様にディスクへの書き出しとレプリケーションを何らかの形で組み合わせることが必要になる可能性が高い
    * メッセージが失われることを許容できるならより高いスループットと低いレイテンシを得られる可能性がある

#### メッセージング方式

##### 直接のメッセージング

プロデューサからコンシューマへ直接メッセージングを行うことがシンプルな設計です。

設計時点で考慮されている対象については問題なく動作し、パフォーマンスも高いのが特徴です。
一方で、耐障害性は限定的にならざるを得ない場合が多く、多くの場合ある種のフォールトではメッセージのロストが避けられません。

##### メッセージブローカー

直接のメッセージングの代替としてメッセージブローカー（メッセージキュー）を利用するものがあります。
メッセージブローカーはメッセージングに特化したデータベースと捉えられます。
プロデューサはブローカーへメッセージを送信し、コンシューマはブローカーからメッセージを受信します。

データをブローカーへ集中させることで高い耐障害性を得ることができます。

ブローカーはプロデューサからコンシューマへのデータ転送にキューイングを行います。
これは以下の2つの結果を生み出します。

* コンシューマの処理が非同期になること
* キューの状態によってメッセージが配送されるまでの時間が不安定になる可能性があること

メッセージブローカーを利用するアプローチにも二つ種類があります。

* JMS/AMQPスタイル
    * e.g. RabbitMQ, ActiveMQ, Google Cloud Pub/Sub, etc...
* ログベース
    * e.g. Apache Kafka, Amazon Kinesis Streams, etc...

どちらの方式にも一長一短があるので設計段階でどのシステムを利用するのか吟味が必要です。

#### 複数のコンシューマ

複数のコンシューマへメッセージを配送するには2通りの方法があります。

* ロードバランシング（共有サブスクリプション）
    * 各メッセージはどれか一つのコンシューマへ配送される
    * 処理が並列化されているのでコンシューマを増やすことで高速化が可能
* ファンアウト
    * 各メッセージは全てのコンシューマに配送される
    * 異なる種類のコンシューマを同時に走らせることが可能

#### 変更データキャプチャ（CDC, change data capture）

一つのデータシステムで全ての要求に応えることはできないため、データシステムはアプリケーションの用途に合わせて様々な形でデータを保存し取得できるようになっています。
そのため、あるデータについて複数のデータシステムを併用することは普通であり、それぞれに整合性の取れた状態でデータが保存されることが望まれます。

同期を行う上で一般的なアプローチがバッチ処理と2重書き込みです。

バッチ処理は問題なく動作しますが、データの同期までの時間が低速という特徴があります。

2重書き込みはクライアントがデータシステムAに対して行った書き込みをデータシステムBにも書き込むことによって達成されますが、これまで見てきたような競合の問題が多々発生します。

競合を回避するためにデータベースにおけるリーダーとフォロワーの関係を構築し、同期を行うアプローチがあります。
変更データキャプチャはあるデータベースに書かれたすべてのデータの変更を監視し、他のシステムへレプリケーションできる形態で取り出すプロセスです。
特に注目すべき方式として、取り出したデータをストリームとして利用できるように配信する実装があります。

変更データキャプチャの実装にはデータベーストリガを利用する方針と、レプリケーションログをパースする方針があります。
データベーストリガを利用する方針はトリガが壊れやすく、オーバーヘッドも大きくなり、レプリケーションログのパースは頑健ではあるものの、スキーマ変更の扱いなど課題は残っています。

変更データベースキャプチャによって同期を図る場合には、起点となる初期のスナップショットが必要です。
スナップショットを定期的に更新することで、一から変更に追従するまでのログ量を切り詰めることが可能です。

また、log-structured なストレージエンジンで論じたログのコンパクションを利用してログ量を圧縮することも可能です。

最近のデータベースではCDCはデータベースの基本機能として提供されるようになってきています。

CDCのアプローチはDDDの文脈で論じられるイベントソーシングと類似性が大きいです。

イミュータブルなChangelogというデータを扱うことで下記のメリットを享受できます。

* 変更のログが全て残る
    * 監査に対応できる
    * 分析に利用できる
* 複数ビューの導出ができる
    * イベントログに対して新しいビューを容易に作成できる
* 並行性の制御を容易にできる

反対にイミュータブルなデータにも限界があります。

* 導出データの整合性は結果整合性となる
* プライバシーに関する規定からデータを削除することが要件となると困難に陥る

### ストリームの処理

#### 利用シーン

* 複合イベント処理（complex event processing, CEP）
    * 1990年代に発展したアプローチ
    * ストリーム中の特定のパターンのイベントを検索するルールを記述できる
* 分析
    * ウィンドウと呼ばれる期間においての統計値の算出ができる
* マテリアライズドビューの管理
* 検索
* メッセージパッシングとRPC
    * アクターモデルで利用できる

#### 時間に関する考察

ストリーム処理はevent timeとprocessing timeを理解し、設計する必要があります。

イベントの時間に基づいてウィンドウを定義したい場合に、特定のウィンドウ内のイベントを全て受信できているのかがわからないことが問題としてあります。
ウィンドウが完了したと宣言された後に遅れて配信されたはぐれイベントもアプリケーションは処理する必要があります。
処理の方針としては無視してドロップするか、はぐれイベントを含めて最終系した値を訂正値として再度配信し、以前の出力を撤回するアプローチがあります。

また、envent timeとしてどのクロックを使用するかも議論の対象です。
プロデューサとなるクライアントのクロックを用いるのか、ブローカーのクロックを用いるのか、イベントの厳密な発生時刻をevent timeとするのか、ブローカーへの送信時刻をevent timeとするのか、プロデューサ間のクロック誤差を吸収できるように複数の時間を扱うのかなど重要な設計対象です。

ウィンドウにもいくつかの種類があります。

* Tumbling window
* Hopping window
* Sliding window
* Session window

どのウィンドウを使用するかも組み合わせて時間を設計します。

#### ストリームの結合

ストリーム処理における結合はイベントがいつ現れるかわからないため、バッチ処理の結合よりも複雑さが上がります。

結合の場合わけをすると、

* ストリーム-ストリーム結合（ウィンドウ結合）
* ストリーム-テーブル結合（ストリームのエンリッチ）
* テーブル-テーブル結合（マテリアライズドビューのメンテナンス）

の3つの結合が生じ得ます。

結合に際しても時間が重要なファクターです。
時間に対して決定的な処理を行うアルゴリズムもありますが、ログのコンパクションが不可能になるなどのデメリットもあるため、設計時に勘案が必要です。

### 耐障害性

MapReduceはexactly-onceセマンティクスと呼ばれる原則に則っています。

ストリーム処理でもマイクロバッチのアプローチをとることで似たような効果を得ることができます。
Spark Streamingではマイクロバッチが用いられており、~1sのタンブリングウィンドウで処理を行います。

Apache Flinkではマイクロバッチの変種のチェックポイント処理と呼ばれるアプローチをとっており、クラッシュを監視することで特定のウィンドウサイズを強制することなく処理ができるようになっています。

フォールトに耐えるその他のアプローチとして冪等性に依存するという方法があります。
複数回同じ操作が行われても結果は一度だけ操作が行われた時と変わらないという特性を操作に持たせることで、メッセージの重複に対する耐性を向上できます。

# まとめ

データシステムにまつわる課題と、それに対応するアプローチを勉強することができました。
データシステムへの解像度が上がったことと、システム設計においての視野が広がったことが読み込んだ成果としてあったかと思います。

設計時には以下のことに留意する必要があると学びました。

* データシステムはデータの保存方法によって大きく特性が変わるため、アプリケーションに応じて適切なシステムを選択する必要がある
* 分散システムでは多くの問題が発生するため、全ての可能性を俯瞰した上で対策を検討する必要がある
* データを導出する方法には大きくバッチ処理とストリーム処理があり、それらは大規模データにも対応できるように調整されているが、アプローチによって大きく特性が変わるため目的に応じて設計する必要がある

あまりにも漠然としていますが、設計という作業自体が創造性の高い作業のため、これくらいの粒度で頭に入れておきます。
