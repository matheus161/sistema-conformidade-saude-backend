import { expect } from 'chai';
import validate from '../../../src/middlewares/validate';

describe('validate', () => {
    let sandbox;
    let req;
    let res;
    let next;
    let schema;

    beforeEach(() => {
        sandbox = createSandbox();

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
        next = TestUtils.mockNext(sandbox);

        req.body = {
            name: 'Ranger Vermelho',
            email: 'redranger@softeam.com.br',
            password: 'omoraldopaulorenger'
        };

        schema = { validateAsync: sandbox.stub() };
    });

    it('should validate the request body', async () => {
        await validate(schema)(req, res, next);

        expect(schema.validateAsync.calledWith(req.body)).to.be.true;
    });

    it('should call next if validation succeeds', async () => {
        schema.validateAsync.resolves();

        await validate(schema)(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should return 400 if validation fails', async () => {
        schema.validateAsync.rejects({ message: 'Dados horríveis' });

        const { status, json } = await validate(schema)(req, res, next);

        expect(status).to.equal(400);
        expect(json).to.deep.equal({ message: 'Dados horríveis' });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
