export const requireAuth = async (req, res, next) => {
    req.user = { uid: 'local-test-user', email: 'test@example.com' };
    next();
};
//# sourceMappingURL=auth.js.map