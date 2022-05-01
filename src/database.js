import mongoose from 'mongoose';
import LogUtils from './utils/LogUtils';

async function connect() {
    const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    };

    await mongoose.connect(uri, options);

    LogUtils.log('Conexão ao banco de dados estabelecida com sucesso.');
}

function close() {
    mongoose.connection.close();
}

export default { connect, close, connection: mongoose.connection };
