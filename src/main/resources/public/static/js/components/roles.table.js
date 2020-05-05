'use strict';

class RolesTable extends HTMLElement {

    constructor() {
        self = super();

        const div = document.createElement('div');
        div.classList.add('wrapper');

        this.initTable(self, div);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(div);

        this.setRoles = this.setRoles.bind(this);
    }

    setRoles(roles) {
        const self = this;
        if (Array.isArray(roles)) {
            const tbl = this.shadowRoot.querySelector('table.tbl-roles tbody');
            while(tbl.firstChild) {
                tbl.removeChild(tbl.lastChild);
            }
            roles.forEach(r => {
                const tr = document.createElement('tr');
                tr.classList.add('role-item');
                tr.innerHTML = `
                    <td>
                        <input type="radio" name="selectedRole" class="form-input-radio role-select" value="${r.id}" />
                    </td>
                    <td>${r.active}</td>
                    <td>${r.name}</td>
                `;

                tbl.appendChild(tr);

                const roleSelect = tr.querySelector('input.role-select');
                roleSelect.addEventListener('change', function(e) {
                    self.dispatchEvent(new CustomEvent('onselectrole', {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            roleId: roleSelect.value
                        }
                    }));
                });
            });
        } else {
            self.dispatchEvent(new CustomEvent('onerror', {
                bubbles: true,
                cancelable: true,
                detail: "Expecting an array of roles"
            }));
        }
    }

    initTable(component, container) {
        const div = document.createElement('div');
        div.classList.add('table-wrapper');
        div.innerHTML = `
            <form class="form-roles">
            <table class="tbl-roles">
                    <caption>Roles</caption>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Active</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table><!-- .tbl-roles -->
            </form>
        `;

        container.appendChild(div);
    }
}

customElements.define('roles-table', RolesTable);
export { RolesTable };