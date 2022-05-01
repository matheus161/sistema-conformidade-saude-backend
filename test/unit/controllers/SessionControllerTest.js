import jwt from 'jsonwebtoken';
import { User } from '../../../src/models/User';
import PasswordUtils from '../../../src/utils/PasswordUtils';
import SessionController from '../../../src/controllers/SessionController';
import { expect } from 'chai';

describe('SessionController', () => {
    describe('auth', () => {
        let req;
        let res;
        let sandbox;
        let findStub;

        const mockUser = {
            email: 'juliao@softeam.com.br',
            name: 'Julião da Motoca',
            password: '2x45V6yxhsKslsa123çCad'
        };

        beforeEach(() => {
            sandbox = createSandbox();

            req = TestUtils.mockReq();
            res = TestUtils.mockRes();

            req.body = {
                email: 'meteoro@softeam.com.br',
                password: 'altoimpacto'
            };

            findStub = sandbox.stub(User, 'findOne');
        });

        it('should find the user by email', async () => {
            findStub.returns({ select: () => null });

            await SessionController.auth(req, res);

            expect(User.findOne.calledWith({ email: req.body.email })).to.be.true;
        });

        it('should match the encrypted password against the provided password', async () => {
            sandbox.stub(PasswordUtils, 'match');
            findStub.returns({ select: () => mockUser });

            await SessionController.auth(req, res);

            expect(PasswordUtils.match.calledWith(req.body.password, mockUser.password));
        });

        it('should return 400 if user is not found', async () => {
            findStub.returns({ select: () => null });
            sandbox.stub(PasswordUtils, 'match').resolves(true);

            const { status, json } = await SessionController.auth(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'Email ou senha incorretos.' });
        });

        it('should return 400 if passwords do not match', async () => {
            findStub.returns({ select: () => mockUser });
            sandbox.stub(PasswordUtils, 'match').resolves(false);

            const { status, json } = await SessionController.auth(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'Email ou senha incorretos.' });
        });

        it('should return 200 with the user and token', async () => {
            findStub.returns({ select: () => mockUser });
            sandbox.stub(PasswordUtils, 'match').resolves(true);
            sandbox.stub(jwt, 'sign').resolves('tokenemdoido');

            const userWithoutPassword = mockUser;
            delete userWithoutPassword.password;

            const { status, json } = await SessionController.auth(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal({ user: userWithoutPassword, token: 'tokenemdoido' });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });
});
