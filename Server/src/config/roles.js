const ROLES = {
  ADMIN: "admin",
  ANALYST: "analyst",
  VIEWER: "viewer",
};

const PERMISSIONS = {
  [ROLES.VIEWER]: ["read:records", "read:dashboard"],
  [ROLES.ANALYST]: ["read:records", "read:dashboard", "read:insights"],
  [ROLES.ADMIN]: [
    "read:records",
    "read:dashboard",
    "read:insights",
    "write:records",
    "delete:records",
    "manage:users",
  ],
};

module.exports = { ROLES, PERMISSIONS };
