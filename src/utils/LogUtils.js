import LogController from '../controllers/LogController';

async function log(message) {
    if (process.env.NODE_ENV === 'production') {
        await LogController.create(message);
    } else {
        console.log(` > ${message}`);
    }
}

export default { log };
