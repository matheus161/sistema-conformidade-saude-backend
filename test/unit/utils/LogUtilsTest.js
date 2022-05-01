import LogUtils from '../../../src/utils/LogUtils';
import LogController from '../../../src/controllers/LogController';

describe('LogUtils', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    it('should log to the database if node env is production', async () => {
        process.env.NODE_ENV = 'production';

        const createLogStub = sandbox.stub(LogController, 'create');

        await LogUtils.log('Salvando no bd');

        expect(createLogStub.calledWith('Salvando no bd')).to.be.true;
    });

    it('should log to the console otherwise', async () => {
        process.env.NODE_ENV = 'development';

        const consoleLog = sandbox.stub(console, 'log');

        await LogUtils.log('Algo deu errado!');

        expect(consoleLog.calledWith(' > Algo deu errado!')).to.be.true;
    });

    afterEach(() => {
        process.env.NODE_ENV = 'test';
        sandbox.restore();
    });
});
