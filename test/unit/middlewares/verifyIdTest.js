import { expect } from 'chai';
import { Types } from 'mongoose';
import verifyId from '../../../src/middlewares/verifyId';

describe('verifyId', () => {
    let sandbox;
    let req;
    let res;
    let next;

    beforeEach(() => {
        sandbox = createSandbox();

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
        next = TestUtils.mockNext(sandbox);
    });

    it('should return 400 if no id is given', async () => {
        const { json, status } = await verifyId(req, res, next);

        expect(status).to.equal(400);
        expect(json).to.deep.equal({ message: 'Nenhum id fornecido.' });
    });

    it('should return 400 if object id is not valid', async () => {
        sandbox.stub(Types.ObjectId, 'isValid').returns(false);

        req.params.id = '123456789000';

        const { json, status } = await verifyId(req, res, next);

        expect(status).to.equal(400);
        expect(json).to.deep.equal({ message: '123456789000 não é um id válido.' });
    });

    it('should return next if everything is ok', async () => {
        sandbox.stub(Types.ObjectId, 'isValid').returns(true);

        req.params.id = '123456789000';

        await verifyId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});
