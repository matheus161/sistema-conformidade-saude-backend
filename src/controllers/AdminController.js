import { Admin } from '../models/Admin';

async function store(req, res) {
    try {
        const { email } = req.body;

        const adminExists = await Admin.findOne({ email: email});

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
        const {name, email} = req.body;
        
        const admin = await Admin.findById(userId);

        if (!admin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        if (email !== admin.email){
            const emailExist = await Admin.findOne({ email });
            if(emailExist)
                return res.status(400).json({ message: 'Email already exists'});
        }

        await Admin.updateOne({
            name: name,
            email: email,
        });

        const adminUpdate = await Admin.findById(userId);

        return res.status(200).json(adminUpdate);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function remove(req, res) {
    try {
        const admin = await Admin.findByIdAndRemove(req.userId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.status(200).json({ message: 'Admin successfully deleted'});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default { store, index, show, update, remove };