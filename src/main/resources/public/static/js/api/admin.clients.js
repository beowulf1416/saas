'use strict';

class AdminClients {

    static add(name, address) {
        return fetch('/api/admin/clients/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                address: address
            })
        })
        .then((response) => response.json());
    }

    static clients() {
        return fetch('/api/admin/clients/all', {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then((response) => response.json())
    }

    static setActive(clientId, active) {
        return fetch('/api/admin/clients/active', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                active: active
            })
        })
        .then((response) => response.json());
    }

    static users(clientId) {
        return fetch('/api/admin/clients/users', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId
            })
        })
        .then((response) => response.json());
    }

    static addUserToClient(clientId, email) {
        return fetch('/api/admin/clients/user/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                email: email
            })
        })
        .then((response) => response.json());
    }

    static removeUserFromClient(clientId, email, func) {
        fetch('/api/admin/clients/user/remove', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                email: email
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static userSetActive(userId, active, func) {
        fetch('/api/admin/clients/user/active', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                active: active
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static roles(clientId) {
        return fetch('/api/admin/clients/roles', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId
            })
        })
        .then((response) => response.json());
    }

    static addRole(clientId, roleName, func) {
        fetch('/api/admin/clients/roles/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                roleName: roleName
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static roleSetActive(roleId, active, func) {
        fetch('/api/admin/clients/roles/active', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roleId: roleId,
                active: active
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static assignRolesToUser(clientId, userId, roleIds) {
        return fetch('/api/admin/clients/users/roles/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                userId: userId,
                roleIds: roleIds
            })
        })
        .then((response) => response.json());
    }

    static removeRoleFromUser(roleId, userId, func) {
        fetch('/api/admin/clients/users/roles/remove', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roleId: roleId,
                userId: userId
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static permissions(func) {
        fetch('/api/admin/clients/permissions', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static permissionSetActive(permissionId, active, func) {
        fetch('/api/admin/clients/permissions/active', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                permissionId: permissionId,
                active: active
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));

    }

    static userRoles(clientId, userId) {
        return fetch('/api/admin/clients/users/roles', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                userId: userId
            })
        })
        .then((response) => response.json());
    }

    static rolePermissions(clientId, roleId, func) {
        fetch('/api/admin/clients/roles/permissions', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                roleId: roleId
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }

    static rolePermissionsAdd(clientId, roleId, permissionIds, func) {
        fetch('/api/admin/clients/roles/permissions/add', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientId: clientId,
                roleId: roleId,
                permissionIds: permissionIds
            })
        })
        .then((response) => response.json())
        .then((data) => func ? func(data) : console.log(data));
    }
}

export { AdminClients };