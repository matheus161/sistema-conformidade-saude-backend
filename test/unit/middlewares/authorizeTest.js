import { expect } from 'chai';
import { User } from '../../../src/models/User';
import TestUtils from '../TestUtils';
import authorize from '../../../src/middlewares/authorize';

describe('authorize()', () => {
    let req;
    let res;
    let next;
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
        req = TestUtils.mockReq(sandbox);
        res = TestUtils.mockRes(sandbox);
        next = TestUtils.mockNext(sandbox);

        req.userId = '123456789';
    });

    it('should return 500 if userId is not defined', async () => {
        req.userId = undefined;

        const { status, json } = await authorize('Vendor')(req, res, next);

        expect(status).to.equal(500);
        expect(json).to.eql({ message: 'Tentou autorizar, mas req.userId não estava definido.' });
    });

    it('should return 404 if user is not found', async () => {
        sandbox.stub(User, 'findById').resolves(null);

        const { status, json } = await authorize('Vendor')(req, res, next);

        expect(status).to.equal(404);
        expect(json).to.eql({ message: `Não foi encontrado usuário com o id ${req.userId}.` });
    });

    it('should return 403 if the user role does not have access to the resource', async () => {
        sandbox.stub(User, 'findById').resolves({ role: 'Customer' });

        const { status, json } = await authorize('Vendor')(req, res, next);

        expect(status).to.equal(403);
        expect(json).to.eql({ message: 'Customer não tem acesso a este recurso.' });
    });

    it('should return next if user role has access to the resource', async () => {
        sandbox.stub(User, 'findById').resolves({ role: 'Customer' });

        await authorize('Vendor', 'Customer')(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});
