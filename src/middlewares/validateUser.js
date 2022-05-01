import validate from './validate';

/**
 *
 * @param {*} roleSchemas Objeto em que cada chave é o nome de uma role e os
 * valores são Schemas de validação.
 */
function validateUser(roleSchemas) {
    return async (req, res, next) => {
        const role = req.body.role?.toLowerCase();

        if (!role) {
            return res.status(400).json({ message: 'You must provide a role.' });
        }

        const validRoles = Object.keys(roleSchemas).map(roleName => roleName.toLowerCase());

        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: `Role attribute must be one of ${validRoles}` });
        }

        const schema = roleSchemas[role];

        return validate(schema)(req, res, next);
    };
}

export default validateUser;
