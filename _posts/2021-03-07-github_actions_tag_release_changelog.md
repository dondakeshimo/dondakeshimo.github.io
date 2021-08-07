---
title: 'GitHub ActionsでCHANGELOG駆動Release'
date: '2021-03-07'
tags: [github]
path: blog/github-actions-changelog
cover: ./preview.jpg
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
coverImage: '/assets/blog/dynamic-routing/cover.jpg'
---

# 目次


# 概要
GitHub Actionsというサービスがある。
サービス自体の説明についてはここでは触れない。
本ポストのテーマはタイトルの通り、CHANGELOGを用いたリリースおよびタグの管理だ。

タグがpushされたタイミングで、それまでのcommitを自動で読み取りCHANGELOG.mdおよびReleaseを発行してくれるという
至れり尽くせりなGitHub Actionsの例は各所で見受けられるが、
正直自分としてはcommitログそのままReleaseに書かれるとか嫌だし、
tagをpushするよりもReleaseの履歴がわかりやすくあってほしい。
要するに、tagが発行されたタイミングではなくCHANGELOGを修正したタイミングで、
CHANGELOGに応じた諸々のリリースフローを行ってほしいわけである。

まとめると

- CHANGELOG.mdが修正されたcommitがmasterにpushされたタイミングでActionが起動
- CHANGELOG.mdに記載されているVersionのtagを発行
- CHANGELOG.mdに記載されている内容のReleaseを発行

というGitHub Actionsを作るぞという話。


# 手法

### CHANGELOG
下記のようなCHANGELOG.mdを想定している。

```
## Version 0.1.0
* akanechan kawaii yatta-
* add choco mint ices

## Version 0.0.2
* fix release flow

## Version 0.0.1
* initial application version
```

### Action定義ファイル
上記のCHANGELOG.mdに対してのAction定義ファイル。
`Extract CHANGELOG` stepを適当にいじれば大体のCHANGELOG.mdの書き方に対応できると思われる。

```yaml
name: Release

on:
  push:
    branches: [ master ]
    paths: ['CHANGELOG.md']

jobs:

  build:
    name: Release
    runs-on: ubuntu-latest
    steps:

    - name: Check out
      uses: actions/checkout@v2

    - name: Extract CHANGELOG
      id: versioning
      run: |
        VERSION=$(head -1 CHANGELOG.md | sed -e 's/^.*Version //g')
        git fetch --prune --unshallow
        PRETAG=$(git describe --tags --abbrev=0)
        git diff $PRETAG..${{ github.sha }} -- CHANGELOG.md | grep -E '^\+' | grep -v '+++' | sed -e 's/^\+//g' > diff-changelog.txt
        echo ::set-output name=version::$VERSION

    - name: Tag
      id: tag_version
      uses: mathieudutour/github-tag-action@v5.2
      with:
        custom_tag: ${{ steps.versioning.outputs.version }}
        github_token: ${{ secrets.GITHUB_TOKEN }}

    - name: Release
      uses: softprops/action-gh-release@v1
      with:
        files: |
          CHANGELOG.md
          LICENSE
        tag_name: ${{ steps.tag_version.outputs.new_tag }}
        body_path: diff-changelog.txt
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### ポイント

#### 基本戦略
- 1行目の文字列から `Version ` 以降の文字列を抽出しversionとする
- 前回のtagとの差分をReleaseのdescriptionとする

#### git fetch --unshallow
GitHub Actionsを使用していれば大概の場合使うであろう `actions/checkout` actionだが、
こちらでcloneしているリポジトリは *shallow repository* である。
履歴情報がないので、そのままでは `git diff` やら `git describe --tags` をしても空振りに終わってしまう。

```
git fetch --unshallow
```

をしてあげることで過去の変更履歴を取得して、前回のtagからの変更履歴が参照できるようにする。

#### outputs と `*`
```
echo ::set-output name=version::$VERSION
```
という構文を用いれば、stepから情報を出力できる。
基本的にはこの手法を用いてstep間で情報の授受をすれば問題ないと思われる。

しかし、CHAGELOGの情報をoutputsに宣言した際、 `*` がファイル名に展開されてしまっていた。
いまいち原因は調べきれていないので、詳しい方いたら理由を教えていただけると幸いである。

対応策として、CHANGELOGの差分情報はファイルに書き出して、ファイル経由で情報の伝播を行うようにした。

#### 課題
validation等は一切していないので、1行目が前と同じversionの状態でmasterへマージしてしまったりすると、
tagの上書きが発生してしまうと思われるのでCHANGELOGの修正には注意が必要。(一敗)


# まとめ
CHANGELOGの修正をトリガーとし、CHANGELOGの内容に従ったtagとReleaseを発行することができた。
tagやReleaseの発行は外部Actionを使用しており、正直どこまで外部Actionに頼っていいかは疑問だし、不安の種でもある。
まあ、GitHub自体が破壊的なAPIの変更等を加えない限り同様のバージョンを使い続けていれば不慮の事故は起こらないと信じたい。
