'use strict';

import { Util } from '/static/js/util.js';


class AdminClientsTable extends HTMLElement {

    constructor() {
        self = super();

        const container = document.createElement('div');
        container.classList.add('client-list-container');

        this.initTable(self, container);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(container);

        this.setClients = this.setClients.bind(this);
    }
    
    connectedCallback() {
        if (this.isConnected) {
            const self = this;
            const shadow = this.shadowRoot;
        }
    }

    initTable(component, container) {
        const div = document.createElement('div');
        div.classList.add('tbl-wrapper');
        div.innerHTML = `
            <table class="clients">
                <caption>Clients</caption>
                <thead>
                    <tr>
                        <th></th>
                        <th>Active</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table><!-- .clients -->
        `;

        container.append(div);
    }

    setClients(clients, options) {
        const self = this;
        if (Array.isArray(clients)) {
            const shadow = self.shadowRoot;
            const tbl = shadow.querySelector('table.clients tbody');
            while(tbl.firstChild) {
                tbl.removeChild(tbl.lastChild);
            }

            clients.forEach(client => {
                let id = Util.generateId();
                const tr = document.createElement('tr');
                tr.classList.add('client-row');
                tr.innerHTML = `
                    <td></td>
                    <td>
                        <a title="Toggle Active" class="nav-link client-link-active" href="#active${id}" data-id="${client.id}" data-active="${client.active}">${client.active}</a>
                    </td>
                    <td>
                        <a class="nav-link client-row-link" title="${client.name}" href="#select${id}" data-id="${client.id}">
                            ${client.name}
                        </a>
                    </td>
                `;

                tbl.appendChild(tr);

                const lClient = tr.querySelector('a.client-row-link');
                lClient.addEventListener('click', function(e) {
                    self.dispatchEvent(new CustomEvent('onselectclient', {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            clientId: lClient.dataset.id
                        }
                    }));
                });

                const lActive = tr.querySelector('a.client-link-active');
                lActive.addEventListener('click', function(e) {
                    self.dispatchEvent(new CustomEvent('onupdateclientactive', {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            clientId: lActive.dataset.id,
                            active: lActive.dataset.active
                        }
                    }));
                });
            });

            if (options && options.allowAdd == true) {
                const tr = document.createElement('tr');
                tr.classList.add('client-add');
                tr.innerHTML = `
                    <td>
                        <a  id="lAdd" class="nav-link client-row-add" title="Add Client" href="#">Add</a>
                    </td>
                `;

                const lAdd = tr.querySelector('a#lAdd');
                lAdd.addEventListener('click', function(e) {
                    self.dispatchEvent(new CustomEvent('onaddclient', {
                        bubbles: true,
                        cancelable: true
                    }));
                });

                tbl.appendChild(tr);
            }
        } else {
            self.dispatchEvent(new CustomEvent('onerror', {
                bubbles: true,
                cancelable: true
            }));
        }
    }
}

customElements.define('clients-table', AdminClientsTable);
export { AdminClientsTable };