CREATE OR REPLACE VIEW user_with_roles AS
SELECT 
  u.id AS user_id, 
  r.role_name AS role_name
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id;
