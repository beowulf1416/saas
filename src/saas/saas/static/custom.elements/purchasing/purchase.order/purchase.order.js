'use strict';
import { Inventory } from '/static/js/modules/inventory/inventory.js';
import { PurchaseOrders } from '/static/js/modules/purchasing/purchase_orders.js';
import { notify } from '/static/js/ui/ui.js';
class PurchaseOrder extends HTMLElement {

    constructor() {
        const self = super();

        const style = document.createElement("link");
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', '/static/custom.elements/purchasing/purchase.order/purchase.order.css');

        const google_web_fonts = document.createElement("link");
        google_web_fonts.setAttribute('rel', 'stylesheet');
        google_web_fonts.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');

        const div = document.createElement('div');
        div.classList.add('component-wrapper');

        this._init(div);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);
        shadow.appendChild(google_web_fonts);
        shadow.appendChild(div);

        this._getClientId = this._getClientId.bind(this);
        this._getPOId = this._getPOId.bind(this);
        this._attachEventHandlers = this._attachEventHandlers.bind(this);
        this._prefetch = this._prefetch.bind(this);
        this._getWarehouseId = this._getWarehouseId.bind(this);

        this._attachEventHandlers();
        this._prefetch();
    }

    _init(container) {
        const client_id = this.getAttribute('client-id');
        const po_id = this.hasAttribute('po-id') ? this.getAttribute('po-id') : '';

        const div = document.createElement('div');
        div.classList.add('wrapper');
        div.innerHTML = `
            <div class="toolbar" role="toolbar">
                <button id="btn-save" type="button" class="btn btn-save" title="Save">
                    <span class="material-icons">save</span>
                </button>
            </div><!-- .toolbar -->
            <div class="form-wrapper">
                <form class="form-purchase-order">
                    <input type="hidden" id="client-id" name="client_id" value="${client_id}" />
                    <input type="hidden" id="po-id" name="po_id" value="${po_id}" />

                    <!-- date -->
                    <label for="date">Date</label>
                    <input type="date" id="date" name="date" class="form-input-date" />

                    <!-- description -->
                    <label for="description">Description</label>
                    <textarea id="description" name="description" class="form-input-textarea"></textarea>

                    <!-- delivery -->
                    <label for="warehouse">Delivery Instructions</label>
                    <warehouse-selector client-id="${client_id}"></warehouse-selector>

                    <div class="table-wrapper">
                        <table class="tbl-po-items">
                            <caption>Purchase Order Items</caption>
                            <colgroup>
                                <col class="col-remove">
                                <col class="col-description">
                                <col class="col-qty">
                                <col class="col-uom">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">UOM</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>
                                        <a id="link-add-item" class="link-add-item" title="Add Purchase Order Item" href="#">&plus;</a>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div><!-- .table-wrapper -->
                </form>
            </div><!-- .form-wrapper -->
        `;

        container.appendChild(div);
    }

    _prefetch() {
        const self = this;

        Inventory.uoms().then((r) => {
            if (r.status == 'success') {
                self._uoms = r.json.uoms;
            } else {
                notify(r.status, r.message);
            }
        });
    }

    _getClientId() {
        const shadow = this.shadowRoot;
        const client = shadow.getElementById('client-id');
        return client.value;
    }

    _getPOId() {
        const shadow = this.shadowRoot;
        const po = shadow.getElementById('po-id');
        return po.value;
    }

    _getWarehouseId() {
        const shadow = this.shadowRoot;
        const warehouse = shadow.querySelector('warehouse-selector');
        return warehouse.getWarehouseId();
    }

    _attachEventHandlers() {
        const self = this;
        const shadow = this.shadowRoot;

        const save = shadow.getElementById('btn-save');
        save.addEventListener('click', function(e) {
            const client_id = self._getClientId();
            const po_id = self._getPOId();
            const warehouseId = self._getWarehouseId();

            const description = shadow.getElementById('description').value;
            
            const trs = shadow.querySelectorAll('table.tbl-po-items tbody tr');
            const items = [];
            trs.forEach((tr) => {
                const item_desc = tr.querySelector('.form-input-description').value;
                const item_qty = tr.querySelector('.form-input-qty').value;
                const item_uom = tr.querySelector('.form-input-uom').value

                items.push({
                    description: item_desc,
                    quantity: parseFloat(item_qty),
                    uom: parseInt(item_uom)
                });
            });

            PurchaseOrders.save({
                clientId: client_id,
                purchaseOrderId: po_id,
                description: description,
                warehouseId: warehouseId,
                items: items
            }).then((r) => {
                notify(r.status, r.message);
            });
        });

        const add = shadow.getElementById('link-add-item');
        add.addEventListener('click', function(e) {
            e.preventDefault();

            const uoms = self._uoms;
            const options = [];
            uoms.forEach((u) => {
                if (u.symbol) {
                    options.push(`<option value="${u.id}">${u.name} (${u.symbol})</option>`);
                } else {
                    options.push(`<option value="${u.id}">${u.name} </option>`);
                }
                
            });
            const optionsall = options.join('');
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a class="link-remove-item" title="Remove" href="#">&minus;</a></td>
                <td><input type="text" name="description" class="form-input-description" title="Description" placeholder="Description" /></td>
                <td><input type="number" name="quantity" class="form-input-qty" title="Quantity" /></td>
                <td>
                    <select name="uom" class="form-input-uom" title="Unit of Measure">
                        ${optionsall}
                    </select>
                </td>
            `;

            const tbody = shadow.querySelector('table.tbl-po-items tbody');
            tbody.appendChild(tr);

            // event handlers
            const remove = tr.querySelector('.link-remove-item');
            remove.addEventListener('click', function(e) {
                e.preventDefault();

                tbody.removeChild(remove);
            });
        });
    }
}
customElements.define('purchase-order', PurchaseOrder);