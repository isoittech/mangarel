# Next JS App X Firebase

## ■ App

## ■ Firestore

## ■ Cloud Function

### ▼ tsc watch

1. VSCode を開く
1. Shift + Ctrl + B
1. tsc: watch - tsconfig.json

### ▼ デプロイ

```shell
$ pwd
xxxx/mangarel_demo
$ firebase deploy --only functions
:
https://asia-northeast1-mangarel-isoittech.cloudfunctions.net/publishers
```

#### ○ Error: HTTP Error: 403, Unknown Error

```shell
$ pwd
xxxx/mangarel_demo
$ firebase logout
$ firebase login
```

### ▼ Local Test

http://localhost:5000/mangarel-isoittech/asia-northeast1/publishers が起動し、アクセスすると、  
https://asia-northeast1-mangarel-isoittech.cloudfunctions.net/publishers と同じ json が返される。

```shell
$ pwd
xxxx/mangarel_demo
$ GOOGLE_APPLICATION_CREDENTIALS=./src/mangarel-demo-firebase-adminsdk.json firebase serve --only functions
```

### ▼ スケジュール設定関数や Firestore トリガー関数のローカルでの実行

```shell
$ pwd
xxxx/mangarel_demo
$ GOOGLE_APPLICATION_CREDENTIALS=./src/mangarel-demo-firebase-adminsdk.json firebase functions:shell
!  functions: Your GOOGLE_APPLICATION_CREDENTIALS environment variable points to ./src/mangarel-demo-firebase-adminsdk.json. Non-emulated services will access production using these credentials. Be careful!
i  functions: Loaded functions: publishers, fetchCalendar
!  functions: The following emulators are not running, calls to these services will affect production: firestore, database, pubsub, storage
firebase > fetchCalendar()
> Fetched Kodansha calendar. Wrote 554 memos.
'Successfully invoked function.'
firebase > >  Fetched Kodansha calendar. Wrote 946 memos.
```

下記例ではエラーが出る。

```shell
$ pwd
xxxx/mangarel_demo
$ GOOGLE_APPLICATION_CREDENTIALS=./src/mangarel-demo-firebase-adminsdk.json firebase functions:shell
!  functions: Your GOOGLE_APPLICATION_CREDENTIALS environment variable points to ./src/mangarel-demo-firebase-adminsdk.json. Non-emulated services will access production using these credentials. Be careful!
i  functions: Loaded functions: publishers, fetchCalendar
!  functions: The following emulators are not running, calls to these services will affect production: firestore, database, pubsub, storage
firebase >registerBooks()
'Successfully invoked function.'
firebase > !  functions: Error: 9 FAILED_PRECONDITION: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/mangarel-isoittech/firestore/indexes?create_composite=ClRwcm9qZWN0cy9tYW5nYXJlbC1pc29pdHRlY2gvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2ZlZWRNZW1vcy9pbmRleGVzL18QARoICgRpc2JuEAEaDQoJZmV0Y2hlZEF0EAEaDAoIX19uYW1lX18QAQ
    at Object.callErrorFromStatus (D:\01_IT\05_Typescript\03_nextjs\mangarel-demo\functions\node_modules\@grpc\grpc-js\build\src\call.js:31:26)
    :
Caused by: Error
    at Query._get (D:\01_IT\05_Typescript\03_nextjs\mangarel-demo\functions\node_modules\@google-cloud\firestore\build\src\reference.js:1519:23)
    :
!  Your function was killed because it raised an unhandled error.
```

上記エラーメッセージ中にある URL にアクセスする。「The query requires an index.」とはどんなエラーなのか解説する。
Firestore のクエリには『==』で表現される等価評価と、『<』『<=』『>』『>=』範囲比較の二種類がある。
ドキュメント＝レコードのフィールドの範囲比較を実行するためには、そのフィールドについての昇順と降順それぞれのインデックスが必要だが、
そのフィールドだけに適用される単一インデックスは Firesotre が自動で生成してくれるようになってる。
が、任意のフィールドの範囲比較を他のフィールドの等価評価と組み合わせる場合、複合インデックスというものが必要になる。
Admin SDK を使って必要な複合インデックスがないクエリを発行した場合、
こうやってエラー出力でそのインデックスを作成するために必要なコンソール画面への URL を発行してくれる。

### ▼ 楽天 API

- アプリ ID/デベロッパー ID (applicationId / developerId)

  - Excel に記載

- application_secret

  - Excel に記載

- アフィリエイト ID(affiliateId)

  - Excel に記載

- コールバック許可ドメイン

  - Excel に記載

## ■ 共通

### ▼ Local Firebase

```shell
$ pwd
xxxx/mangarel_demo
$ firebase emulators:start
：
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://localhost:4000                │
└─────────────────────────────────────────────────────────────┘

┌───────────┬────────────────┬─────────────────────────────────┐
│ Emulator  │ Host:Port      │ View in Emulator UI             │
├───────────┼────────────────┼─────────────────────────────────┤
│ Functions │ localhost:5001 │ http://localhost:4000/functions │
├───────────┼────────────────┼─────────────────────────────────┤
│ Firestore │ localhost:8080 │ http://localhost:4000/firestore │
├───────────┼────────────────┼─────────────────────────────────┤
│ Hosting   │ localhost:5000 │ n/a                             │
└───────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500
```

上記のようにサーバが起動後、下記にアクセスするとデータが返却される。

`http://localhost:5001/mangarel-isoittech/asia-northeast1/publishers`  
ただ、ローカルの firestore に何もデータが入っていなければ返却されるデータは空である。
