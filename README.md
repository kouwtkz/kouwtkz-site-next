このプロジェクトは[Next.js](https://nextjs.org/)を使用したわたかぜコウのサイトです！

https://kouwtkz.cottonwind.com

※`.docker`ディレクトリで `Docker Compose` を使うことを前提にしてます！


このプロジェクトを一度試してみたい方は以下のprismaのコマンドで、
データベースを作成してから試してみてくださいね🖥
```bash
npx prisma db push
```

運用上の都合によりこのプロジェクトはデータベースを使用したシステムをアーカイブしたうえで、  
Static出力を前提とした設計に切り替えることにします！

Node.jsをDocker環境で動かすのはコストが高いし、  
現状のコストで運用するとそもそもインストール段階で動かせなかった…！
