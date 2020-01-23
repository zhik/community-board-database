# Community Board Database

An interface for community board's airtable CRM. Work in progress!

Building using svelte.js, express, and PostgreSQL

### Todo

- web hooks to sync with airtable every few minutes
- Tools and charts for requests
- Interface for other tables

## How to run

Include a .env file with the same variables from the .env.example

### Development

```
docker-compose up
```

### Production

Edit docker-compose.prod.yml with host address

```
docker-compose -f docker-compose.prod.yml up
```
