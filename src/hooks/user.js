// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function(options = {}) { // eslint-disable-line no-unused-vars
    async function get(context) {
        if (context.method === 'get') {
            const getUserRole = await context.app.service('roles').get(context.result.userRoleId);
            if (getUserRole._id) {
                // Attach user role to the user.
                context.result.userRoleId = getUserRole;
            } else throw new Error('There was a problem getting user roles.');
        }
        return context;
    }

    async function find(context) {
        const data = context.result.data;
        // Only if data length is greater than 0
        if (data.length > 0) {
            for (let user of data) {
                const getUserRole = await context.app.service('roles').get(user.userRoleId);

                if (getUserRole._id) {
                    // Attach user role to the user.
                    user.userRoleId = getUserRole;
                } else throw new Error('There was a problem getting user roles.');
            }
        }

        return context;
    }

    return async context => {
        // Before hook
        if (context.type === 'before') {
            const getUserRole = await context.app.service('roles').find({ query: { name: 'User' } });

            if (getUserRole.data && getUserRole.data.length > 0) {
                const userRole = getUserRole.data[0];
                // Attach user role to the user.
                context.data.userRoleId = userRole._id;
            } else throw new Error('There was a problem getting user roles.');
        } else if (context.type === 'after') {
            // After hook
            if (context.method === 'get') {
                context = get(context);
            } else if (context.method === 'find') {
                context = find(context);
            }
        }

        return Promise.resolve(context);
    };
};