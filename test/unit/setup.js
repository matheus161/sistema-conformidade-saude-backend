import chai from 'chai';
import { createSandbox } from 'sinon';
import TestUtils from './TestUtils';

global.expect = chai.expect;
global.returnItself = arg => arg;
global.createSandbox = createSandbox;
global.TestUtils = TestUtils;
