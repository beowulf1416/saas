/**
 * customer relations management
 */
create schema if not exists crm;
set schema 'crm';


\echo '** CRM **'


\ir tables/organizations.sql

\ir tables/gender.sql

\ir tables/people.sql
\ir tables/contact_emails.sql
\ir tables/contact_numbers.sql
\ir tables/contact_addresses.sql

\ir tables/org_people.sql


set schema 'public';