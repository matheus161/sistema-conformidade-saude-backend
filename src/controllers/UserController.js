import { User } from '../models/User';

async function create(req, res) {
    try {
        if (req.emailInUse) {
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
        const {name, email} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${userId}` });
        }

        if (email !== user.email){
            const emailExist = await User.findOne({ email });
            if(emailExist)
                return res.status(400).json({ message: 'Email already exists'});
        }

        await User.updateOne({
            name: name,
            email: email,
        });

        const updatedUser = await User.findById(userId);

        return res.status(200).json(updatedUser);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

// async function changePassword(req, res) { // Separar o update em dois: update e updatePass
//     try {
//         const { userId } = req;
//         const { password, newPassword } = req.body;

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: `Não foi encontrado usuário com o id ${userId}` });
//         }

//         if(!(await PasswordUtils.match(password, user?.password))) {
//             return res.status(403).json({ message: 'Incorrect password'});
//         }

//         // Precisamos chamar save pra acionar o middleware de criptografia.
//         //await user.save();

//         //user.password = undefined;

//         return res.status(200).json({message : 'Deus e fiel'});
//     } catch ({ message }) {
//         return res.status(500).json({ message });
//     }
// }

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
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: `Não há usuário com o id ${req.params.id}.` });
        }

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

        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

export default {
    create,
    update,
    remove,
    getAll,
    getById
};
