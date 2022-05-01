import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import PasswordUtils from '../utils/PasswordUtils';

async function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
}

async function auth(req, res) {
    const { email } = req.body;
    const plainTextPassword = req.body.password;

    const user = await User.findOne({ email }).select('+password');
    const passwordsMatch = await PasswordUtils.match(plainTextPassword, user?.password);

    if (!user || !passwordsMatch) {
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    user.password = undefined;
    const token = await generateToken(user.id);

    return res.status(200).json({ user, token });
}

export default { auth };
