import { expect } from 'chai';
import UserController from '../../../src/controllers/UserController';
import { User } from '../../../src/models/User';

describe('UserController', () => {
    let sandbox;
    let req;
    let res;

    beforeEach(() => {
        sandbox = createSandbox();

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
    });

    describe('create()', () => {
        let createStub;

        beforeEach(() => {
            createStub = sandbox.stub(User, 'create');

            req.body = {
                name: 'Sófocles Teamildo',
                email: 'softeam@softeam.com.br',
                password: 'cabecadegelo'
            };

            req.emailInUse = false;
        });

        it('should return 400 if email is already in use', async () => {
            req.emailInUse = true;

            const { status, json } = await UserController.create(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'O email softeam@softeam.com.br já está em uso.' });
        });

        it('should return 201 and create user', async () => {
            createStub.resolves(req.body);

            const { status, json } = await UserController.create(req, res);

            expect(createStub.calledWith(req.body)).to.be.true;
            expect(status).to.equal(201);
            expect(json).to.deep.equal(req.body);
        });

        it('should not return the user password', async () => {
            createStub.callsFake(arg => arg);

            const { json } = await UserController.create(req, res);

            expect(json.password).to.be.undefined;
        });

        it('should return 500 if an error is thrown', async () => {
            createStub.rejects({ message: 'Erro ao criar usuário' });

            const { status, json } = await UserController.create(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao criar usuário' });
        });
    });

    describe('update()', () => {
        let findStub;

        beforeEach(() => {
            findStub = sandbox.stub(User, 'findByIdAndUpdate');

            req.userId = '123456789000';

            req.body = {
                name: 'Sófocles Teamildo Espírito Januário Cruz',
                password: 'asenhasecreta',
                email: 'softeam@softeam.com.br'
            };
        });

        it('should return 404 if user was not found', async () => {
            findStub.returns({ select: () => null });

            const { status, json } = await UserController.update(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não foi encontrado usuário com o id ${req.userId}` });
        });

        it('should return 200 and update user data', async () => {
            const user = { save: sandbox.spy(), password: 'blabla' };
            findStub.returns({ select: () => user });

            const { status, json } = await UserController.update(req, res);

            expect(findStub.calledWith(req.userId, req.body));
            expect(user.save.calledOnce).to.be.true;
            expect(json.password).to.be.undefined;
            expect(status).to.equal(200);
        });

        it('should return 500 if an error is thrown', async () => {
            findStub.returns({
                select: () => {
                    throw new Error('Erro ao buscar usuário');
                }
            });

            const { status, json } = await UserController.update(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao buscar usuário' });
        });
    });

    describe('getAll()', () => {
        let findStub;

        beforeEach(() => {
            findStub = sandbox.stub(User, 'find');
        });

        it('should return 200 and a list of users', async () => {
            const users = [{
                name: 'Jonas Lima',
                email: 'jonaslima@softeam.com.br',
                password: 'designehminhapaixao'
            }, {
                name: 'Yves Bastos',
                email: 'yvesbastos@softeam.com.br',
                password: 'acabecadopovo'
            }];

            findStub.resolves(users);

            const { status, json } = await UserController.getAll(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal(users);
        });

        it('should return 500 if an error is thrown', async () => {
            findStub.rejects({ message: 'A busca falhou' });

            const { status, json } = await UserController.getAll(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'A busca falhou' });
        });
    });

    describe('getById()', async () => {
        let findStub;

        beforeEach(() => {
            findStub = sandbox.stub(User, 'findById');
            req.params.id = '123456789000';
        });

        it('should return 404 if user is not found', async () => {
            findStub.resolves(null);

            const { status, json } = await UserController.getById(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não há usuário com o id ${req.params.id}.` });
        });

        it('should return 200 and user', async () => {
            const user = {
                name: 'Zé da Onça',
                email: 'zedaonca@softeam.com.br',
                password: 'graaaaawrlllllnhaaauw'
            };

            findStub.resolves(user);

            const { status, json } = await UserController.getById(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal(user);
        });

        it('should return 500 if an error is thrown', async () => {
            findStub.rejects({ message: 'Usuário não encontrado' });

            const { status, json } = await UserController.getById(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Usuário não encontrado' });
        });
    });

    describe('remove()', () => {
        let removeStub;

        beforeEach(() => {
            req.userId = '123456789000';
            removeStub = sandbox.stub(User, 'findByIdAndRemove');
        });

        it('should return 404 if user was not found', async () => {
            removeStub.resolves(null);

            const { status, json } = await UserController.remove(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: 'Usuário não encontrado.' });
        });

        it('should return 200 and delete the user with the given id', async () => {
            const user = {
                name: 'Mor Tod Asilva',
                email: 'mortodasilva@softeam.com.br',
                password: 'senhaencriptada'
            };

            removeStub.resolves(user);

            const { status, json } = await UserController.remove(req, res);

            expect(removeStub.calledWith(req.userId)).to.be.true;
            expect(status).to.equal(200);
            expect(json).to.deep.equal(user);
        });

        it('should return 500 if an error is thrown', async () => {
            removeStub.rejects({ message: 'Não deu pra deletar =/' });

            const { status, json } = await UserController.remove(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Não deu pra deletar =/' });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
