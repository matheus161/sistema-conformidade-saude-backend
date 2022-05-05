import { config } from 'dotenv';
import createApp from './app';
import LogUtils from './utils/LogUtils';

function addExitSignals(app, server, exitSignals) {
    exitSignals.forEach(signal => {
        process.on(signal, () => {
            server.close(err => {
                if (err) {
                    LogUtils.log(err);
                    process.exit(1);
                }

                app.database.close(() => {
                    LogUtils.log('Conexão com o banco de dados foi fechada.');
                    process.exit(0);
                });
            });
        });
    });
}

(async () => {
    try {
        config();

        const app = await createApp();

        await app.database.connect();

        const server = app.listen(process.env.APP_PORT, () => {
            LogUtils.log(`App escutando na porta ${process.env.APP_PORT}.`);
        });

        addExitSignals(app, server, ['SIGINT', 'SIGTERM', 'SIGQUIT']);
    } catch (error) {
        LogUtils.log(error);
        process.exit(1);
    }
})();
