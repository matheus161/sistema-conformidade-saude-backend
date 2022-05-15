import { User } from '../models/User';
import mailer from '../lib/mailer';
import resetPass from '../constants/email_body/resetPass';
import PasswordUtils from '../utils/PasswordUtils';
import { Admin } from '../models/Admin';

async function create(req, res) {
    try {
        const adminExists = await Admin.findOne({email: req.body.email});

        if (req.emailInUse || adminExists) {
            return res.status(400).json({ message: `O email ${req.body.email} já está em uso.` });
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.status(201).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function update(req, res) { // Separar o update em dois: update e updatePass
    try {
        const { userId } = req;
        const { email } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${userId}` });
        }

        if (email !== user.email) {
            const emailExist = await User.findOne({ email });
            const emailExistAdmin = await Admin.findOne({ email });
            if (emailExist || emailExistAdmin) return res.status(400).json({ message: 'Email already exists' });
        }

        const userUpdated = await User.findByIdAndUpdate(userId, req.body, { new: true });//.select('+password');
        userUpdated.password = undefined;

        return res.status(200).json(userUpdated);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function changePassword(req, res) {
    try {
        const { userId } = req;
        const { password, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${userId}` });
        }

        const passwordsMatch = await PasswordUtils.match(password, user.password);
        if (!passwordsMatch) {
            return res.status(401).json({ message: 'Password atual está incorreto' });
        }

        user.password = newPassword;
        await user.save();// Possui um 'pré' que faz a encriptação

        user.password = undefined;
        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getAll(req, res) {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getById(req, res) {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Não há usuário com o id informado' });
        }

        user.password = undefined;
        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function remove(req, res) {
    try {
        const user = await User.findByIdAndRemove(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ message: 'User successfully deleted' });
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function resetPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if(!user)
            return res.status(400).json({ message: 'User with this email does not exists '});

        const newPass = Math.random().toString(36).slice(-10); 

        mailer.sendMail({
            from: 'Equipe Avalia SBIS <validasbis@hotmail.com>',
            to: email,
            subject: 'Solicitação de nova senha',
            html: resetPass(user.name, newPass),
        }).catch(console.error);

        user.password = newPass;
        await user.save();

        return res.status(200).json({ message: 'Email has been sent'});

    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

export default {
    create,
    update,
    remove,
    getAll,
    getById,
    resetPassword,
    changePassword
};
