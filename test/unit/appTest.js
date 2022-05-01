describe('app', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    describe('injectMiddlewares', () => {
        let appMock;
        let middlewares;

        beforeEach(() => {
            appMock = { use: sandbox.stub() };
        });

        const injectMiddlewares = TestUtils
            .getPrivateMethod(
                '../../src/app',
                'injectMiddlewares'
            );

        it('should inject middlewares in the app', () => {
            middlewares = [
                sandbox.stub().returns('Finja que eu sou um middleware!'),
                sandbox.stub().returns('E eu sou outro :p'),
            ];

            injectMiddlewares(appMock, middlewares);

            middlewares.forEach(middleware => {
                expect(middleware.calledOnce).to.be.true;
                expect(appMock.use.calledWith(middleware())).to.be.true;
            });
        });

        it('should call the middleware with args if necessary', () => {
            middlewares = [
                sandbox.stub().returns('Middleware sem argumentos'),
                [sandbox.stub().returns('Middleware com argumentos'), { fake: true }]
            ];

            injectMiddlewares(appMock, middlewares);

            middlewares.forEach(middleware => {
                if (typeof middleware === 'function') {
                    expect(middleware.calledOnce).to.be.true;
                    expect(appMock.use.calledWith(middleware())).to.be.true;
                } else {
                    const [createMiddleware, args] = middleware;

                    expect(createMiddleware.calledOnce).to.be.true;
                    expect(appMock.use.calledWith(createMiddleware(args))).to.be.true;
                }
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
