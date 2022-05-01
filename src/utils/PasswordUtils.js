import bcrypt from 'bcrypt';

async function encrypt(password) {
    return bcrypt.hash(password, 10);
}

async function match(plainTextPassword, hashedPassword) {
    if (!plainTextPassword || !hashedPassword) {
        return false;
    }

    return bcrypt.compare(plainTextPassword, hashedPassword);
}

export default { encrypt, match };
