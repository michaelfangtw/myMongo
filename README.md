# myMongo sample
目錄: source
```
docker-compose.yml
mongosh 資料庫shell
testConn.js  連線測試
testInsertMongo.js 新增測試
```
啟用 mongo
```
    docker-compose down
    docker-compose up -d --build
    docker exec -it mongo mongosh -u admin -p your_password --authenticationDatabase admin
```