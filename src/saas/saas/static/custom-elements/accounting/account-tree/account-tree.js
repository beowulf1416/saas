'use strict';
import { showInTab, notify } from '/static/js/ui/ui.js';
import { Accounts } from '/static/js/modules/accounting/accounts.js';
import { Groups } from '/static/js/modules/accounting/groups.js';
import { Util } from '/static/js/util.js';
class AccountTree extends HTMLElement {

    constructor() {
        const self = super();

        const style = document.createElement("link");
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', '/static/custom-elements/accounting/account-tree/account-tree.css');

        const default_style = document.createElement("link");
        default_style.setAttribute('rel', 'stylesheet');
        default_style.setAttribute('href', '/static/css/default.css');

        const div = document.createElement('div');
        div.classList.add('component-wrapper');

        this._init(div);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);
        shadow.appendChild(default_style);
        shadow.appendChild(div);

        this._attachEventHandlers = this._attachEventHandlers.bind(this);
        // this.addAccounts = this.addAccounts.bind(this);
        // this._getClientId = this._getClientId.bind(this);
        this._refresh = this._refresh.bind(this);
        this.setChart = this.setChart.bind(this);
        this._attachEventHandlerForGroupRow = this._attachEventHandlerForGroupRow.bind(this);
        this._attachEventHandlerForAccountRow = this._attachEventHandlerForAccountRow.bind(this);

        this._attachEventHandlers();
        this._refresh();
    }

    _init(container) {
        const self = this;

        const client_id = this.getAttribute('client-id');

        const div = document.createElement('div');
        div.classList.add('wrapper');
        div.innerHTML = `
            <div class="form-wrapper">
                <form class="form-account-tree">
                    <input type="hidden" id="client-id" name="client_id" value="${client_id}" />
                </form>
            </div><!-- .form-wrapper -->
            <div class="toolbar" role="toolbar">
                <button type="button" id="btn-new-acct" class="btn btn-new" title="New Account">
                    <span class="material-icons">create_new_folder</span>
                </button>
                <button type="button" id="btn-new-group" class="btn btn-new-group" title="New Account Group">
                    <span class="material-icons">folder</span>
                </button>
                <button type="button" class="btn btn-refresh" title="Refresh">
                    <span class="material-icons">refresh</span>
                </button>
            </div><!-- .toolbar -->
            <div class="table-wrapper">
                <table id="tbl-accounts" class="tbl-accounts" role="treegrid" aria-label="Chart of Accounts">
                    <caption>Chart of Accounts</caption>
                    <colgroup>
                        <col class="col-name">
                        <col class="col-amount">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div><!-- .table-wrapper -->
        `;

        container.appendChild(div);
    }

    _attachEventHandlers() {
        const self = this;
        const shadow = this.shadowRoot;

        const client_id = this.getAttribute('client-id');

        const btnnew = shadow.querySelector('button.btn-new');
        btnnew.addEventListener('click', function(e) {
            showInTab('accounting-account-editor', 'New Account', `<account-editor client-id="${client_id}"></account-editor>`);
            e.preventDefault();
        });

        const btnnewgroup = shadow.getElementById('btn-new-group');
        btnnewgroup.addEventListener('click', function() {
            showInTab('account-account-group', 'New Account Group', `<account-group client-id="${client_id}"></account-group>`);
        });

        const btnrefresh = shadow.querySelector('button.btn-refresh');
        btnrefresh.addEventListener('click', function(e) {
            self._refresh();
            e.preventDefault();
        });
    }

    _refresh() {
        const self = this;
        const client_id = this.getAttribute('client-id');

        if (self._account_types) {
            Accounts.chart(client_id).then((r) => {
                if (r.status == 'success') {
                    self.setChart(r.json.chart, self._account_types);
                } else {
                    notify(r.status, r.message, 3000);
                }
            });
        } else {
            Accounts.getAccountTypes().then((r) => {
                if (r.status == 'success') {
                    self._account_types = [];
                    r.json.types.forEach((t) => {
                        self._account_types.push(t.name);
                    });
                    
                    Accounts.chart(client_id).then((r) => {
                        if (r.status == 'success') {
                            self.setChart(r.json.chart, self._account_types);
                        } else {
                            notify(r.status, r.message, 3000);
                        }
                    });
                } else {
                    notify(r.status, r.message, 3000);
                }
            });
        }
    }

    setChart(chart = [], types = []) {
        const self = this;
        const shadow = this.shadowRoot;

        console.log(types);

        const tbody = shadow.querySelector('table#tbl-accounts tbody');
        while(tbody.firstChild) {
            tbody.removeChild(tbody.lastChild);
        }

        chart.forEach((c) => {
            const tr = document.createElement('tr');
            tr.id = 'id' + Util.generateId();
            tr.classList.add('account-group');

            tr.setAttribute('tabindex', -1);
            tr.setAttribute('role', 'row');
            tr.setAttribute('aria-level', c.groupLevel - 1);
            tr.setAttribute('aria-posinset', 1);
            tr.setAttribute('aria-setsize', 1);
            tr.setAttribute('aria-expanded', true);
            tr.setAttribute('draggable', true);

            tr.dataset.groupId = c.groupId;
            tr.dataset.typeId = c.groupTypeId;

            console.log(c.groupName);

            if (types.includes(c.groupName)) {
                tr.innerHTML = `
                    <td>
                        ${c.groupName}
                    </td>
                    <td></td>
                `;
            } else {
                tr.innerHTML = `
                    <td>
                        <a title="Edit Group" class="link-edit-group" href="#">
                            <span class="material-icons">edit</span>
                        </a>
                        ${c.groupName}
                    </td>
                    <td></td>
                `;
            }

            tbody.appendChild(tr);

            // event handlers
            self._attachEventHandlerForGroupRow(tr);
            
            const linkeditgroup = tr.querySelector('.link-edit-group');
            if (linkeditgroup) {
                linkeditgroup.addEventListener('click', function(e) {
                    e.preventDefault();

                    // TODO
                });
            }

            if (c.accounts) {
                c.accounts.forEach((a) => {
                    const id_account = 'id' + Util.generateId();
                    const tr = document.createElement('tr');
                    tr.classList.add('account');

                    tr.setAttribute('tabindex', -1);
                    tr.setAttribute('role', 'row');
                    tr.setAttribute('aria-level', c.groupLevel);
                    tr.setAttribute('aria-posinset', 1);
                    tr.setAttribute('aria-setsize', 1);
                    tr.setAttribute('aria-expanded', true);
                    tr.setAttribute('draggable', true);

                    tr.id = id_account;
                    tr.dataset.accountId = a.accountId;
                    tr.dataset.typeId = a.accountTypeId;

                    tr.innerHTML = `
                        <td>
                            <a title="Edit Account" class="link-edit-account" href="#">
                                <span class="material-icons">edit</span>
                            </a>
                            ${a.accountName}
                        </td>
                        <td>${a.value}</td>
                    `;

                    tbody.appendChild(tr);

                    // event handlers
                    self._attachEventHandlerForAccountRow(tr);

                    const linkeditaccount = tr.querySelector('.link-edit-account');
                    if (linkeditaccount) {
                        linkeditaccount.addEventListener('click', function(e) {
                            e.preventDefault();

                            // TODO
                        });
                    }
                });
            }
        });
    }

    _attachEventHandlerForGroupRow(tr) {
        const self = this;
        const shadow = this.shadowRoot;

        const client_id = this.getAttribute('client-id');

        tr.addEventListener('dragstart', function(e) {
            tr.classList.add('drag-start');
            e.dataTransfer.setData('text/plain', JSON.stringify({
                dragId: tr.id,
                groupId: tr.dataset.groupId,
                groupTypeId: tr.dataset.typeId
            }));
        });

        tr.addEventListener('dragenter', function(e) {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.groupId) {
                if (data.groupTypeId == tr.dataset.typeId) {
                    tr.classList.add('drag-valid');
                } else {
                    tr.classList.add('drag-invalid');
                }
            }

            if (data.accountId) {
                if (data.accountTypeId == tr.dataset.typeId) {
                    tr.classList.add('drag-valid');
                } else {
                    tr.classList.add('drag-invalid');
                }
            }
        });

        tr.addEventListener('dragexit', function(e) {

        });

        tr.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'link';
        });

        tr.addEventListener('drop', function(e) {
            e.preventDefault();

            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const tr_start = shadow.getElementById(data.dragId);
            tr_start.classList.remove('drag-start');

            if (tr_start.classList.contains('account-group')) {
                const group_id = data.groupId;
                const parent_group_id = tr.dataset.groupId;

                Groups.assignParentGroup(client_id, group_id, parent_group_id).then((r) => {
                    if (r.status == 'success') {
                        self._refresh();
                    } else {
                        notify(r.status, r.message, 3000);
                    }
                });
            }

            if (tr_start.classList.contains('account')) {
                const account_id = data.accountId;
                const group_id = tr.dataset.groupId;
    
                Accounts.assignGroup(client_id, account_id, group_id).then((r) => {
                    if (r.status == 'success') {
                        self._refresh();
                    } else {
                        notify(r.status, r.message);
                    }
                });   
            }
        });
    }

    _attachEventHandlerForAccountRow(tr) {
        const self = this;
        const shadow = this.shadowRoot;
        const client_id = this.getAttribute('client-id');

        tr.addEventListener('dragstart', function(e) {
            tr.classList.add('drag-start');
            e.dataTransfer.setData('text/plain', JSON.stringify({
                dragId: tr.id,
                accountId: tr.dataset.accountId,
                accountTypeId: tr.dataset.typeId
            }));
        });

        // tr.addEventListener('dragenter', function(e) {

        // });

        // tr.addEventListener('dragexit', function(e) {

        // });

        tr.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'link';
        });

        tr.addEventListener('drop', function(e) {
            e.preventDefault();

            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const tr_start = shadow.getElementById(data.dragId);
            tr_start.classList.remove('drag-start');

            // const group_id = tr.dataset.groupId;
            // const account_id = data.accountId;

            // Accounts.assignGroup(client_id, account_id, group_id).then((r) => {
            //     notify(r.status, r.message);
            // });
        });
    }
}
customElements.define('account-tree', AccountTree);
export { AccountTree };