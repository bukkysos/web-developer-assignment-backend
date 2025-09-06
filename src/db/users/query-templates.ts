export const selectUsersTemplate = `
SELECT u.id, u.name, u.username, u.email, u.phone,
a.id as "address_id", a.user_id as "address_user_id", 
a.street as "address_street", a.state as "address_state", a.city as "address_city",
a.zipcode as "address_zipcode"
FROM users u
inner join addresses a on u.id = a.user_id
ORDER BY name
LIMIT ?, ?
`;

export const selectCountOfUsersTemplate = `
SELECT COUNT(*) as count
FROM users
`;
