// Port
process.env.PORT = process.env.PORT || 3000;

//Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


process.env.CADUCIDAD_TOKEN = "2h";


process.env.SEED = process.env.SEED || 'este-es-el-seed'

let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.urlDB = urlDB;

//Google
process.env.CLIENTE_ID = process.env.CLIENTE_ID || '716435935514-senjbapsmk6drv02030bnen7dqj6vtcs.apps.googleusercontent.com';