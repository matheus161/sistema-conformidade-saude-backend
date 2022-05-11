import { Admin } from '../models/Admin';
import PasswordUtils from '../utils/PasswordUtils';

async function store(req, res) {
    try {
        const { email } = req.body;

        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = await Admin.create(req.body);
        admin.password = undefined;
        return res.status(201).json(admin);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function changePassword(req, res) {
    try {
        const { userId } = req;
        const { password, newPassword } = req.body;

        const admin = await Admin.findById(userId);

        if (!admin) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${userId}` });
        }

        const passwordsMatch = await PasswordUtils.match(password, admin.password);
        if (!passwordsMatch) {
            return res.status(401).json({ message: 'Password atual está incorreto' });
        }

        admin.password = newPassword;
        await admin.save();// Possui um 'pré' que faz a encriptação

        admin.password = undefined;
        return res.status(200).json(admin);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function index(req, res) {
    try {
        const admins = await Admin.find();
        return res.status(200).json(admins);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function show(req, res) {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        return res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function update(req, res) {
    try {
        const { userId } = req;
        const { name, email } = req.body;

        const admin = await Admin.findById(userId);

        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        if (email !== admin.email) {
            const emailExist = await Admin.findOne({ email });
            if (emailExist) return res.status(400).json({ message: 'Email already exists' });
        }

        await Admin.updateOne({
            name,
            email,
        });

        const adminUpdate = await Admin.findById(userId);

        return res.status(200).json(adminUpdate);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const admin = await Admin.findByIdAndRemove(req.userId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.status(200).json({ message: 'Admin successfully deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    store, changePassword, index, show, update, remove
};
