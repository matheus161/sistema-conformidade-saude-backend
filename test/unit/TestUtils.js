/* eslint-disable no-underscore-dangle */
import rewire from 'rewire';

function mockReq() {
    return { body: {}, params: {}, headers: {} };
}

function mockRes() {
    const Response = class Response {
        status(statusCode) {
            this.status = statusCode;
            return this;
        }

        json(data) {
            this.json = data;
            return this;
        }
    };

    return new Response();
}

function mockNext(sandbox) {
    return sandbox.stub();
}

function getPrivateMethod(modulePath, methodName) {
    const module = rewire(modulePath);

    return module.__get__(methodName);
}

function stubPrivateMethod(sandbox, modulePath, methodName) {
    const module = rewire(modulePath);

    const stub = sandbox.stub();

    module.__set__(methodName, stub);

    return stub;
}

export default {
    mockReq,
    mockRes,
    mockNext,
    getPrivateMethod,
    stubPrivateMethod
};
