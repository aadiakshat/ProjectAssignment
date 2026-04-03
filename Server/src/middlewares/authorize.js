const { PERMISSIONS } = require("../config/roles");

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = PERMISSIONS[req.user.role] || [];

    const hasAccess = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAccess) {
      return res.status(403).json({
        error: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = authorize;
