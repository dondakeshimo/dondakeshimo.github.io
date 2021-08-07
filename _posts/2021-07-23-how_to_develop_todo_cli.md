---
title: 'GoでCLIのTODOリストを作成した時の振り返り'
date: '2021-07-23'
tags: [go]
path: blog/how-to-develop-toco-cli
cover: ./preview.jpg
excerpt: todo-cliを開発する上で良かった点などの振り返り
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---

# 目次


# 概要
CLIでのTODO管理ツールをGoで実装しました。

<https://dondakeshimo.github.io/tech-blog/blog/introduce-todo-cli/>

<https://github.com/dondakeshimo/todo-cli>

その際に得た知見ややっていて良かったこと、やって失敗だったと思うことなどを振り返っていこうと思います。

# 開発管理や開発ルール
## GitHub
デファクトスタンダードなので特に説明することもないかもしれませんが、GitHubを用いてコード管理を行いました。
コード管理だけではなく、後述するようにCI/CDやプロジェクト管理もGitHubで完結させました。

(最近知ったのですがGitLabってオンプレ以外に普通のWebアプリケーションも提供されているんですね。
特に比較とかはしていないです。)

## GitHub Flow
ブランチ戦略というものがあります。
よく知られているものとしてGit FlowとGitHub Flowがあります。
私はGitHub Flowしか利用したことがないので、Git Flowの詳細は他サイトに譲ります[(参考)](https://www.atlassian.com/ja/git/tutorials/comparing-workflows/gitflow-workflow)。
GitHub Flowを要約すると変更をmasterに反映するときはPR経由で行えよ、ということになります。
GitHub Flowに準じた開発を行うと決めたので、個人開発ではありますが、masterに直接マージするようなことはせずにPRを毎回作成して開発を行いました。

良かった点は

- masterは常にテストが通った状態になる
- 管理しているチケットと紐付けができる
- 行った変更を自分で追いやすくなる
- 作業の中断ステータスがわかりやすい

悪かった点は

- 単純に面倒臭い
- 個人リポジトリだとmasterへのpush禁止をGitHubがしてくれないので2, 3回 masterにpushしてしまった

次回個人開発を行うことがあれば、最初はmaster pushで整えて

- test
- CI/CD パイプライン

が整ったタイミングでPRを出すようにしようかと思います。
ただ、後で反省するように上記二つともプロジェクトの最初期に整えるべきものだと考えているので、実質最初からPRを出すつもりです。

また、masterへのpush防止策としてはgit hookに何かしら突っ込んでおく必要があるかなと思っています。

## GitHub Projects
プロジェクト管理は GitHub Projectsを利用しました。

- <https://github.com/dondakeshimo/todo-cli/projects/1>
- <https://github.com/dondakeshimo/todo-cli/projects/2>

欲しい機能は最初からほとんど決まっていたので、メモ書き以下の要件を最初に記載していたようです。

<https://github.com/dondakeshimo/todo-cli/issues/1>

IssueとPRは紐付けができるので機能の作成さえしておけば、Kanbanでの移動はそこまで必要ないです。
調査系のタスクが入った時にIssueがあると自分の進捗がわかりやすいのとドキュメントが勝手に出来上がっていくのでとても良かったです。

<https://github.com/dondakeshimo/todo-cli/issues/33>

メリットはやはりコード管理ツールと統合されていることに尽きると思います。今後もGitHubで何かしらのプロジェクトを行うときは重宝すると思います。

## 英語
コードのコメントや使い方などは全て英語にしようと決めていました。
英語の勉強をしたかったという部分と、日本語が入ったコードはダサいと思ったのと、ゆくゆくは外国の方にもcommitしてもらえるようなプロダクトにしたいという野望があったからです。

2人の知人にcontributerをしていただいたのですが、その際にPRを英語で出していただいてハッとさせられました。
海外の方にcommitしてもらうためにはIssueやPRも全て英語で行う必要があったのでは？？と。
ちょっとそこまで英語にリソース割けないなと思い妥協しています。個人リポジトリですしね...

## CI/CD GitHub Actions
CI/CDツールとしてはGitHub Actionsを使用しました。
ツールで行いたかったことは下記になります。

- PRに対して
  - コードフォーマットのチェック
  - test
- master commitに対して
  - バイナリのビルド
  - Releasesの作成

コードフォーマットのチェックやtestは比較的簡単に設定できました [(設定ファイル)](https://github.com/dondakeshimo/todo-cli/blob/master/.github/workflows/go.yml)。
Releasesの作成についてはそれなりに苦闘したので、[別記事](https://dondakeshimo.github.io/tech-blog/blog/github-actions-changelog/)にまとめています。


# 設計
## ディレクトリ構造
ディレクトリ構造について初期は [golang-standards/project-layout](https://github.com/golang-standards/project-layout) を模倣して設計していました。
ところが、 [this is not a stndard Go project layout](https://github.com/golang-standards/project-layout/issues/117) というIssueがGo開発者から立てられ、これは標準ではないし、Goの思想としては標準レイアウトのようなものは存在しない、なんでも好きなように作れば良いのだよということが公言されていました。
特に問題となっていたのは `pkg` ディレクトリのようで、慣例として作られていた `vendor` との差分がよくわからないなどの意見が見られました。思考停止で利用していましたが、このIssueを受けて `internal` ディレクトリは `pkg` ディレクトリに[まとめました](https://github.com/dondakeshimo/todo-cli/pull/78)。


結果的には以下のような構成にしました。
```makefile
.
├── Makefile
├── README.md
├── cmd
│   └── todo
│       └── main.go
├── go.mod
├── go.sum
├── pkg
│   ├── commands
│   ├── domain
│   │   ├── notifier
│   │   ├── scheduler
│   │   └── task
│   ├── gateways
│   │   └── json
│   └── usecases
├── scripts
│   └── uninstall.sh
└── test
    └── scenario
        └── crud_test.go
```

`pkg` の中のディレクトリはそのままパッケージ名となります。
こちらは次節にて詳しく述べる予定ですが、クリーンアーキテクチャのレイヤ名を随所に使用しています。

## クリーンアーキテクチャ
<https://dondakeshimo.github.io/tech-blog/blog/clean-architecture-uncle-bob/>

にてまとめているクリーンアーキテクチャを念頭に設計しています。というよりは開発していくうちにクリーンアーキテクチャっぽく修正していきました。

CLIフレームワークを変更したタイミングがあったのですが、CLIフレームワークとアプリケーションルールがそのタイミングでは絡み付いており、変更が非常に重たいタスクになってしまいました。これを嫌って、先にusecase層とcontroller層(commandsディレクトリ)を分割しました。これによってフレームワークに依存しているのはcontroller層のみとなり変更を容易に行うことができました。(分割は簡単ではなかったです。)

このことから、これからはフレームワークやインプットアウトプットが少しでも変わる可能性がある場合は常にクリーンアーキテクチャを最初から意識して設計していこうと心に誓いました。

逆にクリーンアーキテクチャを意識したアーキテクチャになっていた部分で良かったのは、後述するスケジューリングや通知の詳細実装を追加していくのが非常に容易だったことです。最初にインタフェースを決めておく難易度はありましたが、今回の場合は最初から要件がある程度固まっていたのでそこまで悩まずに済みました。

## テスト
今回の場合二つのテストが必要と考えていました。

- domain/taskの単体テスト
- e2eテスト

逆にそれ以外の部分は手を抜いています。
ただし、結構アプリケーションロジックにバグが紛れたりするので、usecase層もテストするべきだったなと思っています。
これは今後追加するかもしれません。

最初にテストスコープを決めていて良かったのはdomain層に入れるべきものがはっきりとしたことです。
このロジックにはテスト必要そうだぞというものは大抵domain層にいるべきものなので、ビジネスロジックがusecaseに紛れ込むのを防ぐことができました。

テストの実装時期ですが、プロトタイプのタイミングから単体テストは実装しておくべきだと感じました。
後からやるのは辛いというのが主な理由ですが、先述の通りテストを念頭においた実装をすることでかなりすっきりとした設計になりがちですなので、気づいたらスパゲッティを錬成していたということを防ぐためにも最初からテストを書くべきです。

逆にe2eテストについてはある程度までは放置しておいて良いと感じました。
テスト項目だけ決めておいて毎回手作業で確認していくくらいで良いかなと。
結構テストの実装自体が手間ですし、その手間をかけて自動化するならまずは満足できるレベルのプロダクトを作るのが先だろというのが今の思いです。

# コーディング
## Makefile
Makefileは最初に用意しておくと良いと思います。GoのMakefileは毎回ほとんど同じものになると思うので、ここに自分が使っているものでテンプレとなりそうな部分を貼っておきます。

```
GOBUILD=go build
GOCLEAN=go clean
GOTEST=go test
GOGET=go get
GOFMT=gofmt
GOGEN=go generate
GOIMPORTS=goimports
GOLINT=golangci-lint
BINARY_NAME=todo
CMD_PKG=./cmd/todo
SCENARIO_DIR=./test/scenario

all: help

.PHONY: init
init: ## initilize developer environment
  # mockを利用する場合
	go install github.com/golang/mock/mockgen@latest

.PHONY: get
get: ## go get dependencies
	$(GOGET) -u -v -t -d ./...

.PHONY: build
build: ## build go binary
	$(GOBUILD) -o $(BINARY_NAME) -v $(CMD_PKG)

.PHONY: mockgen
mockgen: ## generate mock
	$(GOGEN) ./...

.PHONY: test
test: build ## go test
	$(GOTEST) -v ./...

.PHONY: scenario-test
scenario-test: build ## run scenario test
	$(GOTEST) -v $(SCENARIO_DIR) -tags scenario

.PHONY: clean
clean: ## remove go binary
	$(GOCLEAN)
	rm -f $(BINARY_NAME)

.PHONY: fmt
fmt: ## format go files
	$(GOFMT) -l -w -s .
	$(GOIMPORTS) -w .

.PHONY: lint
# need docker to run this command
# this command just run golangci-lint
# so, if you hate docker, you can run equivalent this installing golangci-lint locally
lint: ## check lint, format
	docker run --rm -v $(shell pwd):/app -w /app golangci/golangci-lint:v1.41.0 golangci-lint run -v

.PHONY: help
help: ## DIsplay this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
```

プロジェクトの最初期から置いておくと良いと思います。最初期は `go run` とかを結局たくさん使いますが...

## Value Object
<https://dondakeshimo.github.io/tech-blog/blog/evans-eric-ddd/>

で説明している値オブジェクトを利用できる場面では利用することを意識しました。
具体的にはタスクに紐付けられる時間などが値オブジェクトとして定義されています。

時間については基本的にただの文字列なのですが、値オブジェクトとすることで文字が時間を表現するのに有効かどうかや、時間としての加算減算に対応できるようになっています。ビルドに通ればランタイムでのエラーがほとんど起きなくなったので、値オブジェクトは利用できるシーンでは積極的に利用すべきだと感じています。

## GoDoc
[チョットできるGoプログラマーになるための詳細GoDoc](https://qiita.com/shibukawa/items/8c70fdd1972fad76a5ce) で詳細に述べられていますが、Goではドキュメント自動生成のためのコメントお作法があります。このお作法の通りにコメントを書けばIDEがメソッドの説明とかを出して来れたりします。

コードは大体最初に思い描いたものよりも長く、複雑になるので最初からGoDocを書くことを忘れずにしておくと、エディタの力を最大限に生かすことができます。(ただ本当に面倒くさい)。次回以降もちゃんと書けるかは心の余裕によると思います。

## Table Driven Test
Table Driven Testをご存知でしょうか？
テストの可読性が飛躍的に向上し、DRYなテストを実現できる手法になります。
自分が参考にしたサイトを見つけることができなかったので、お好きなサイトをGoogle先生の書庫から選んで参照いただければと思います。

これを知って実装できたことでテストがかなり書きやすかったのでここで取り上げています。
しばらくはTable Driven Testを使ってテストを書き続けるでしょう。

## ライブラリ選定
ライブラリの選定はしっかりとするべきだという話です。

ライブラリを利用するということは依存が一つ増えるということです。
依存が一つ増えたらメンテナンスのための改修が必要になるリスクが一つ増えるということです。
まずはライブラリを使うか自前で実装するべきかという部分を真剣に考えた方が良いというのが最近の考えです。

ライブラリを選定するタイミングで確認するべきは

- Star数
- 最終更新日
- 更新頻度

あたりだと考えていますが、実際に使ってみないとわからない部分も多々あると思うので参考程度に。

todo-cliではtodoリストの表示と、CLIフレームワークにおいて外部ライブラリを使用しています。
それぞれについて少し解説します。

### CLIフレームワーク cobra vs urfave/cli
初期段階では [urfave/cli](https://github.com/urfave/cli) を利用していました。
最初からcobraも選択肢には入っていたのですが、同等の人気である urfave/cliが先に検索にヒットしたのでなんとなくで使っていました。

結果としては[cobra](https://github.com/spf13/cobra)に途中で乗り換えており、これからもCLIフレームワークを利用するならcobra一択だろうと考えています。

urfave/cliのよくない点は大きく二つです。

- [twitter](https://twitter.com/campuscodi/status/1371227524127199241?s=19) で指摘されているが、謎の情報を送る処理が実装されていた
- 必ず `todo [option] [args]` の順番でコマンドを叩く必要があり、タスクの内容の後にオプションをつけるといったことができなかった

その他にも細かい点でcobraの方が気が利いている部分が多く、紹介記事やStar数だけでは実際の使用感は判断できないのだなと感じました。
このことから私が得られる教訓は、導入ハードルを恐れずにどんどん知らないツールを触っていけ、ということです。

### writerライブラリ
初期段階ではGoの標準パッケージにある [tabwriter](https://pkg.go.dev/text/tabwriter) を利用していました。
表示がリッチである必要はないと考えていたので、これで十分と考えていたのですが、知人が触って来れている時に日本語で表記がずれるという課題を共有いただき更に解決策となるパッケージもご提示していただきました。

途中で乗り換えたライブラリが [tablewriter](https://github.com/olekukonko/tablewriter) になります。 CJKに対応しており、リッチな表を書くこともできます。

表示系のライブラリではCJK(China, Japan, Korea)言語に対応しているかどうかを気にかける必要があるのだということを学べました。

## golangci-lint
Goのフォーマッターやリンターは複数のパッケージ、ツールに別れておりそれを統合したツールもいくつかありますが、自分が調べた範囲で2021/07時点では [golangci-lint](https://github.com/golangci/golangci-lint) を用いるのが良さそうだと感じました。
使い方等はREADMEや紹介記事も多数あるのでここでは省略します。

## ポインタ vs 値
(この節の内容はうろ覚えなので100%信用しないでください。)

Goではポインタがヒープ領域に割り当てられます。
そのため、軽量な値に関してはポインタでの受け渡しよりも値渡しを行った方が良いです。
具体的にはプリミティブ型で関数内で値を変更しない場合は値渡しで良いと言えると思います。

これはメソッドのレシーバにも同様のことが言えます。
軽量な構造体に対するメソッドの場合はポインタを指定するよりも値を渡した方が早くなります。

また、ポインタの利用を消極的にすることで関数型言語のように副作用のない(少ない)関数を書くことが意識できます。

## スケジューリング
この節ではスケジューリング機能をどのように実装したかを説明します。

スケジューリング機能とググると [robfig/cron](https://github.com/robfig/cron) がヒットするのではないかと思います。
当然の話ではありますが、スケジューリングを行うプログラムはプロセスとして常駐する必要があります。
Goのみでこれを行おうとすると、プロセスを走り続ける必要があり軽さや使いやすさという点で疑問が生じる設計しか思いつきませんでした。

よって、基本戦略としてはOSに備わったスケジューリング機能を使用する方針としています。

### launchd
MacOSではcronを使用するのは非推奨とされており、代わりにLauncdというプロセスをスケジューラとして利用するように言われています。
[launchdで定期的にスクリプトを実行](https://qiita.com/rsahara/items/7d37a4cb6c73329d4683) にて詳細に開設されているので、利用に際して困るというようなことはなかったです。
指定箇所に指定フォーマットのXMLファイルを配置するだけなので実装難易度もそこまで高くないです。

### cron
Linuxではcronがおおよそインストールされていると信じてcronを用いたスケジューリングもできるようにしました。

こちらについてはタスクの登録方法が複数あるのですが、課題となったのは権限です。
launchdと同様の方針で、cronファイルを `/etc/cron.d` に配置するだけで済むと考えていたのですが、配置するためにはroot権限が必要であり、またcronファイルもroot権限である必要があることがわかりました。
root権限をアプリケーションに与える方針はユーザビリティやセキュリティの観点でありえない選択肢であると感じたので、ファイルを配置する方針は諦めました。

[諸々調べた結果](https://dondakeshimo.github.io/tech-blog/blog/how-to-use-cron/) もまとめてあるので見ていただければと思いますが、結局 `crontab [file]` でスケジュール登録する方針としました。

しかし、こちらの方針にも問題点があり、指定したcronファイルで全てのジョブが上書きされてしまうのです。そのため、ユーザがもともとcrontabを使用していた場合は利用するべきではないですし、自分の登録したジョブも注意を払わなければ最新の一件しかスケジュール登録されないということになってしまいます。詳細な実装についてはリポジトリの方を参照いただければと思います。

## 通知方法
理想はポップアップを出すことだと考えていました。MacにおいてはシンプルにポップアップをCLIから呼び出すインタフェースが搭載されており、容易に実装することができましたが、linuxについてのポップアップはまだ特に考えられていないです。Slackに投げられればそれで良いだろうと甘えました。

### ossascript
遊んでもらえれば楽しいと思うのですが、

```
osascript -e 'display notification "通知したいメッセージ"'
```

とターミナルで打っていただければ通知センターにメッセージが届きます。
似たような方法で、[色々な制御ができる](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_cmds.html#//apple_ref/doc/uid/TP40000983-CH216-SW12) のでこれらを用いてポップアップ通知を実現しています。

実装としては `os/exec` によって外部コマンドを呼び出す形になっています。

### slack
SlackではIncomming Webhookを利用すればHTTP POSTリクエストを送ることでメッセージを送信することができます。
Incoming Webhookの導入はユーザに委ねるしかありませんが、その他の解決策もないと思ったので妥協しました。
LINEラブな方のためにLINE Botインタフェースを用意するとかも面白そうではありますね。


# まとめ
GoでCLIを作るのは非常に楽しかったです。cobraというフレームワークが最高です。kubectlとかを参考にできたところも良かったですね。
開発途中でドメイン駆動設計やクリーンアーキテクチャについて勉強していたので、プロトタイプからどんどん設計周りの改善案が出てきたというのも面白かったポイントです。

今後も開発は続けますし、よければ追加機能や機能修正のPRをお待ちしています。
