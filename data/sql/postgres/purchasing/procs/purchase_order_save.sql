create or replace function purchase_order_save (
    p_client_id clients.clients.id%type,
    p_po_id purchasing.purchase_orders.id%type,
    p_description purchasing.purchase_orders.description%type,
    p_warehouse_id purchasing.purchase_orders.warehouse_id%type,
    p_instructions purchasing.purchase_orders.instructions%type
)
returns void
as $$
begin
    insert into purchasing.purchase_orders (
        id,
        client_id,
        description,
        warehouse_id,
        instructions
    ) values  (
        p_po_id,
        p_client_id,
        p_description,
        p_warehouse_id,
        p_instructions
    )
    on conflict (id) do update set
        description = p_description,
        warehouse_id = p_warehouse_id,
        instructions = p_instructions;
end
$$
language plpgsql;