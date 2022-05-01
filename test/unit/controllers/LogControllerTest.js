import Log from '../../../src/models/Log';
import LogController from '../../../src/controllers/LogController';
import TestUtils from '../TestUtils';

describe('LogController', () => {
    let sandbox;
    let createStub;

    beforeEach(() => {
        sandbox = createSandbox();

        createStub = sandbox.stub(Log, 'create');
    });

    describe('create()', () => {
        // FIXME: A propriedade .create não existe em Log, impedindo de fazer o stub.
        it.skip('should create a Log with the given content', async () => {
            await LogController.create('O servidor papocou');

            expect(createStub.calledWith({ content: 'O servidor papocou' })).to.be.true;
        });
    });

    describe('get()', () => {
        let req;
        let res;

        beforeEach(() => {
            req = TestUtils.mockReq();
            res = TestUtils.mockRes();

            Log.find = sandbox.stub();
        });

        it('should return 200 and find all logs', async () => {
            const logs = [{ content: 'O servidor papocou' }, { content: 'Eh resenha soh kkk' }];

            Log.find.resolves(logs);

            const { status, json } = await LogController.get(req, res);

            expect(Log.find.getCall(0).args[0]).to.eql({});
            expect(status).to.equal(200);
            expect(json).to.deep.equal(logs);
        });

        it('should return 500 if an error is thrown', async () => {
            Log.find.rejects({ message: 'Rapaz tá tudo pegando fogo' });

            const { status, json } = await LogController.get(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Rapaz tá tudo pegando fogo' });
        });
    });

    afterEach(() => sandbox.restore());
});
