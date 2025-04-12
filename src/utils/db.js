const {client}=require('pg')
const db = new client({ 
  user: 'postgres',
  host: 'localhost',
  port :5432,
  database: 'hackiwha_tickets',
  password: ' walidozich',
})
db.connect().then((  )=> console.log   ("connceted")  )
