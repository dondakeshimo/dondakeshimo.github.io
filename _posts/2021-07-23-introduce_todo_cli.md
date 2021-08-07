---
title: 'CLIでTODO管理を行うツールを作ったので紹介させてください'
date: '2021-07-23'
tags: [go]
path: blog/introduce-todo-cli
cover: ./preview.jpg
excerpt: TODO管理ツールを作ったのでみんなに使って欲しいです
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---

# 目次 


# TODO管理ツールを作りました
https://github.com/dondakeshimo/todo-cli

todo-cliというTODO管理アプリを作りました。
こちら、Go製になります。

モチベーションは大きく3つあり、以下それぞれについて述べていきます。

## TODO管理はCLIでやりたい
TODOリストにタスクを加える行為は記憶容量を多少減らしてくれたり、作業再開の際にスムーズに導入できるようにといった目的だと思いますが、そのリターンに対して面倒臭さが勝ってしまうことが往々にしてありました。
自分はキーボードで操作可能なものは全てキーボードで操作すべきという強迫観念にも似た信条を持っており、マウスやタッチパッドに手を伸ばすという行為はそれだけで多少の心象的ハードルを乗り越える必要があります。
そのため、タスクの管理におけるコストを極力下げるためにはCLI操作でサッとタスクを残しておき、またその作業に戻った時にスッとタスクを手に取れるようになっていることが理想です。

## リマインダー機能が欲しい
TODO管理をCLIで行うだけなら10は裕に超えるソフトウェアが検索に引っかかります。
特に[todotxt/todo.txt-cli](https://github.com/todotxt/todo.txt-cli) はStar数が4.6k (2021/07/23時点) もありしっかりとしたコミュニティと様々な機能が提供されています。
しかし、私が検索した中でリマインダー機能を外部アプリケーションと連携せず、独立で提供しているCLIツールは見つけられませんでした。
(リマインダー機能がついたらそれはタスクリストではなくリマインダーでは？というツッコミを入れられた方は夜道にお気をつけください)。

TODOリストの本懐はコンテキストスイッチの量とコストを減らすことだと考えています。
タスク管理を行う上で時間を気にしたり、タスクリストを思い出すといった作業は定期的にコンテキストスイッチが発生することに他なりません。
余計なコンテキストスイッチが発生するのを防ぐためにリマンインダーは有効であると考えており、これを手軽に利用できるタスクリストがあると嬉しいと感じていました。

## 必要十分な機能が欲しい
その他、自分の欲しかった機能をあげていくと

- 優先度によるソート機能
- グルーピング機能
- タスクのエントリポイント(チケットのURLとか)に直接飛べる機能 <- 未実装

あたりになります。一番下については自分も本当に欲しいのか半信半疑なのと、良いUXについて迷ったので未実装になっています。

上の二つの項目においては納得いただける方が多いのではないかと思いますし、リッチなタスクマネージャーを利用すれば大抵の場合該当機能は付属しています。
問題となるのは、リッチなタスクマネージャーを利用した場合コマンドが多くてタスク管理のためのコンテキストスイッチが必要になりそうだった部分です。
コンテキストスイッチを減らすための工夫でコンテキストスイッチが増えたら本末がすっ転んでしまいます。
正直自分が作成した管理アプリがそこまでシンプルかと聞かれるとYESとは言い難い気もしますが、コマンド自体はシンプルなtodo管理アプリを参考に4つ程度に収めたのでわかりやすい方ではないかと思います。(自分で作ったので覚えられているだけかもしれませんが...)


# インストール方法
## Go
Goをインストールしている方は `go install` するのが管理しやすくて良いと思います。

```
# Go 1.16+
$ go install github.com/dondakeshimo/todo-cli/cmd/todo@latest

# Go version < 1.16
$ go get -u github.com/dondakeshimo/todo-cli/cmd/todo
```

Goのバイナリ置き場に `PATH` を通すことをお忘れなく。

```
$ export PATH=$PATH:$(go env GOPATH)/bin
```

## バイナリのダウンロード
Goがインストールされていない環境をお使いの場合はバイナリの直接ダウンロードもできます。
MacとUbuntuの環境でビルドしたものを用意しています。
それ以外の環境の方はUbuntuのものでお祈りするか、Goをインストールの方お願いいたします。

```
$ TODO_VERSION=1.0.0

$ curl -O https://github.com/dondakeshimo/todo-cli/releases/download/v${TODO_VERSION}/todo-${TODO_VERSION}.macos-10.15.tar.gz

$ tar -xvf todo-${TODO_VERSION}.macos-10.15.tar.gz

$ mv todo path/to/your/$PATH
```


# 使い方
https://github.com/dondakeshimo/todo-cli

に頑張って書いたので、ほとんどこれの転載になります。

## 概要 (helpコマンド)

こちらがtodo-cliのコマンドになります。

```
$ todo --help
Manage Your TODO

Usage:
  todo [command]

Available Commands:
  add         Add a task
  close       Close tasks
  completion  generate the autocompletion script for the specified shell
  configure   Configure your todo-cli
  help        Help about any command
  list        List tasks
  modify      Modify a task
  notify      Notify a task (basicaly be used by system)

Flags:
  -h, --help   help for todo

Use "todo [command] --help" for more information about a command.
```

各コマンドのhelpも見られます。

```
$ todo modify -h
Modify a task

Usage:
  todo modify [flags]

Aliases:
  modify, m

Flags:
  -g, --group string         task group. you can get filtered list by group.
  -h, --help                 help for modify
  -i, --id int               task's ID (default -1)
  -p, --priority int         task's priority. Lower number means high priority. (default 100)
  -d, --remind_time string   remind_time (2021/3/3 03:03, 2021/3/3, +2h3m, task-4h15m)
  -r, --reminder string      choose reminder from [macos, slack]
      --remove_reminder      remove reminder. this option overrides reminder option
  -t, --task string          task contents
```

## 実際の使用感
次に実際にどのように使用するかを見ていきます。

```
$ todo list
+----+--------------------------------+----------------+-------+----------+----------+
| ID |              Task              |   RemindTime   | Group | Reminder | Priority |
+----+--------------------------------+----------------+-------+----------+----------+
|  1 | deleting or modifying this     | 2099/1/1 00:00 |       |          |        0 |
|    | task is your first TODO        |                |       |          |          |
+----+--------------------------------+----------------+-------+----------+----------+

$ todo close -i=1

$ todo l
+----+------+------------+-------+----------+----------+
| ID | Task | RemindTime | Group | Reminder | Priority |
+----+------+------------+-------+----------+----------+
+----+------+------------+-------+----------+----------+

$ todo add "must task" -d="2021/03/03 12:00" -g="project x" -r=slack -p=0

$ todo l
+----+-----------+----------------+-----------+----------+----------+
| ID |   Task    |   RemindTime   |   Group   | Reminder | Priority |
+----+-----------+----------------+-----------+----------+----------+
|  1 | must task | 2021/3/3 12:00 | project x | slack    |        0 |
+----+-----------+----------------+-----------+----------+----------+

$ todo a "boring task" -g="project x"

$ todo a "important task" -d="2022/01/01" -p=50

$ todo l
+----+----------------+----------------+-----------+----------+----------+
| ID |      Task      |   RemindTime   |   Group   | Reminder | Priority |
+----+----------------+----------------+-----------+----------+----------+
|  1 | must task      | 2021/3/3 12:00 | project x | slack    |        0 |
|  2 | important task | 2022/1/1 00:00 |           |          |       50 |
|  3 | boaring task   |                | project x |          |      100 |
+----+----------------+----------------+-----------+----------+----------+

$ todo m -i=1 -t="should task" -p=10

$ todo l -g="project x"
+----+--------------+----------------+-----------+----------+----------+
| ID |     Task     |   RemindTime   |   Group   | Reminder | Priority |
+----+--------------+----------------+-----------+----------+----------+
|  1 | should task  | 2021/3/3 12:00 | project x | slack    |       10 |
|  3 | boaring task |                | project x |          |      100 |
+----+--------------+----------------+-----------+----------+----------+

$ todo conf --hide_reminder=true --show_config
columnwidth: 30
hidegroup: false
hidepriority: false
hidereminder: true
slackmentionto: XXXXXXXXXX
slackwebhookurl: https://hooks.slack.com/services/XXXXXXXXXX/XXXXXXXXXX/XXXXXXXXXX
taskfilepath: /home/dondakeshimo/.local/share/todo/todo.json

$ todo l
+----+----------------+----------------+-----------+----------+
| ID |      Task      |   RemindTime   |   Group   | Priority |
+----+----------------+----------------+-----------+----------+
|  1 | should task    | 2021/3/3 12:00 | project x |       10 |
|  2 | important task | 2022/1/1 00:00 |           |       50 |
|  3 | boaring task   |                | project x |      100 |
+----+----------------+----------------+-----------+----------+
```

使用感はこんな感じになります。

configのところで察された方もいるかもしれませんが、全ての情報をファイルで持っています。
短期間のTODO管理に堅牢な永続化は不要ですし、トランザクションや競合もユーザが一人想定なので不要です。
ファイルで十分だったのでそのように実装したのですが、副次的にファイルを管理することで複数のTODO管理を切り替えたり、新しい環境にTODOリストを引き継ぐことが可能になりました。(私はそのようなことはしないと思いますが)

後はそうですね、上記の例で見せられていない部分としてcloseする際のidは複数選択可能です。 `-id 1,2,3,4` のように指定できます。
また、 `-d` オプションは相対時間で指定することが可能になっています。これは後述するリマインダーの使用方法で使っています。

## リマインダー
実装に大いに苦しめられましたが、使用者からしたら開発者の苦労話など基本的にどうでも良いと思うので別記事にまとめます。

リマインダーは2種類用意しています。

- macos
- slack

名前の通りmacosはMacでのみ利用可能です。Slackは事前に設定が必要になりますが、linux環境できます。
Windows環境については未対応になります(私がWindowsで開発を行わないため、しばらく対応されないと思います)。

### macos
macosはシステムのポップアップを用いたリマインダー機能になります。
リマインダーの名前は `macos` となっています。

```
$ todo a "remind me this task" -r=macos -d=+1m

$ todo l
+----+---------------------+-----------------+-------+----------+----------+
| ID |        Task         |   RemindTime    | Group | Reminder | Priority |
+----+---------------------+-----------------+-------+----------+----------+
|  1 | remind me this task | 2021/3/3 01:01  |       | macos    |      100 |
+----+---------------------+-----------------+-------+----------+----------+
```

上記のようにタスクを登録すれば、1分後に下記のような通知を受け取れます。

![notification](https://user-images.githubusercontent.com/23194960/126190791-be2dae4a-5e56-4e59-8151-a6d88e48f0e9.png)

doneボタンを押すとタスクは自動的にクローズされて、skipを押すと特に何もしません。
当初は何分後に再通知するみたいなボタンを足そうかと考えていた気がするのですが、疲れた時期に実装していた箇所であることと、結局あったところで自分は使わないなと思い未実装です。

### slack
Slackを用いたリマインダーを利用するためには事前に設定が必要になります。
[Slack での Incoming Webhook の利用](https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8) を参考にIncoming Webhookを通知させたいSlackのworkspaceに導入したいただく必要があります。
こちらで設定した際に得られるWebhook URLと、workspaceにおける自分のmember IDをtodo-cliに設定します。
設定コマンドは下記の通りになります。

```
$ todo conf --slack_webhook_url="https://hooks.slack.com/services/XXXXXXXX/XXXXXXXX" --slack_mention_to=XXXXXXXXXX
```

それでは `-r slack` オプションを使ってタスクを追加します。

```
$ todo a "remind me this task in slack\!" -r=slack -d=+1m

$ todo l
+----+-------------------------------+-----------------+-------+----------+----------+
| ID |             Task              |   RemindTime    | Group | Reminder | Priority |
+----+-------------------------------+-----------------+-------+----------+----------+
|  1 | remind me this task in slack! | 2021/7/20 01:11 |       | slack    |      100 |
+----+-------------------------------+-----------------+-------+----------+----------+
```

1分後に下図のような通知がslackに届いていると思います。

![notification in slack](https://user-images.githubusercontent.com/23194960/126192217-cee8469b-b917-4770-ab76-f604556bd3e2.png)


# まとめ
本記事ではtodo-cliを作成した理由と使用方法の紹介を行いました。
是非使用の検討をしていただければと思います。

開発における工夫した点や学び気づきなどは別記事を書こうと思うのでそちらも見ていただければ幸いです。
