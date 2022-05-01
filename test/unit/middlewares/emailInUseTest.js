import { expect } from 'chai';
import emailInUse from '../../../src/middlewares/emailInUse';
import { User } from '../../../src/models/User';

describe('emailInUse', () => {
    let req;
    let res;
    let next;
    let sandbox;
    let findStub;

    beforeEach(() => {
        sandbox = createSandbox();

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
        next = TestUtils.mockNext(sandbox);

        req.body = { email: 'silviosantos@softeam.com.br' };

        findStub = sandbox.stub(User, 'findOne');
    });

    it('should find a user by email', async () => {
        await emailInUse(req, res, next);

        expect(findStub.calledWith({ email: req.body.email })).to.be.true;
    });

    it('should mark emailInUse as false if user is not found', async () => {
        findStub.resolves(null);

        await emailInUse(req, res, next);

        expect(next.called).to.be.true;
        expect(req.emailInUse).to.be.false;
    });

    it('should mark emailInUse as true if user is found', async () => {
        const user = new User({
            name: 'Mize Ravi',
            email: 'mizeraviacerto@softeam.com.br',
            password: 'melancia'
        });

        findStub.resolves(user);

        await emailInUse(req, res, next);

        expect(next.called).to.be.true;
        expect(req.emailInUse).to.be.true;
    });

    it('should return 500 if an error is thrown', async () => {
        findStub.rejects({ message: 'Deu certo não' });

        const { json, status } = await emailInUse(req, res, next);

        expect(status).to.equal(500);
        expect(json).to.deep.equal({ message: 'Deu certo não' });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
