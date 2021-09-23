import { Command } from "commander";
import admin from "firebase-admin";
import fs from "fs";
import parse from "csv-parse/lib/sync";
import { Publisher } from "../services/mangarel/models/publisher";
import { collectionName } from "../services/mangarel/constants";
import { addCounter } from "../firestore-admin/record-counter";
import serviceAccount from "../mangarel-demo-firebase-adminsdk.json";

// Firebase Admin SDKの初期化
// ※普通のCloud Functions の場合ならfirebase login をしていれば初期化に秘密キーはいらないが、
// 　これはコマンドラインから実行するNode アプリケーションなのでこの設定が必要
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
const db = admin.firestore();

const uploadSeed = async (collection: string, seedFile: string) => {
  const buffer = fs.readFileSync(seedFile);
  const records = parse(buffer.toString(), {
    columns: true,
    delimiter: "\t",
    skip_empty_lines: true,
  });
  const ref = db.collection(collection);

  switch (collection) {
    case collectionName.publishers: {
      const docs: Required<Publisher>[] =
        records.map((record: Publisher) => ({
          ...record,
          website: record.website ? record.website : null,
          // admin.firestore.FieldValue.serverTimestamp()でサーバ側のタイムスタンプを入れる
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })) || [];
      for await (const doc of docs) {
        // ドキュメントの指定について
        // ・db.collection(COLLECTION_NAME).doc(DOC_ID) とメソッドチェーンで書く方法  ※メジャー
        // ・db.doc('COLLECTION_NAME/DOC_ID') のようにスラッシュ区切りの文字列で書く方法

        // Firestore ドキュメントのID はドキュメントの外にある。
        // そのため、オブジェクトからID とそれ以外のデータを分けて抜き出して下記のように保存している。
        const { id, ...docWithoutId } = doc;
        await ref.doc(id).set(docWithoutId);
      }
      await addCounter(db, collection, docs.length);
      return;
    }
    default: {
      throw new Error("specify target collection");
    }
  }
};

// 実行コマンド
// node lib/commands/dbseed.js publishers seeds/publishers.tsv

const program = new Command();

program
  .version("0.1.0", "-v, --version")
  .arguments("<collection> <seedFile>")
  .action(uploadSeed);
program.parse(process.argv);

// 削除するときのコマンド
// ※-r（recursive）が無いとエラーになる
// ../node_modules/.bin/firebase firestore:delete publishers -r
