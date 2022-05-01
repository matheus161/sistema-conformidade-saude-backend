import { expect } from 'chai';
import validateUser from '../../../src/middlewares/validateUser';

describe('validateUser', () => {
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

    it('should return 400 if no role is provided', async () => {
        const { status, json } = await validateUser({})(req, res, next);

        expect(status).to.equal(400);
        expect(json).to.eql({ message: 'You must provide a role.' });
    });

    it('should return 400 if the provided role is not valid', async () => {
        req.body.role = 'User';

        const validRoles = { vendor: {}, customer: {} };
        const { status, json } = await validateUser(validRoles)(req, res, next);

        expect(status).to.equal(400);
        expect(json).to.eql({ message: 'Role attribute must be one of vendor,customer' });
    });

    it('should validate with the approppriate role', async () => {
        // Write me!
    });

    afterEach(() => {
        sandbox.restore();
    });
});
