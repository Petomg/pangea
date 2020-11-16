process.env.PORT = process.env.PORT || 5000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB = "";
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/mediumNodeLogin";
} else {
    urlDB = "";
};

process.env.URL_DB = urlDB;

process.env.CADUCIDAD_TOKEN = '48h';

process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION ||  'este-es-el-seed-desarrollo';