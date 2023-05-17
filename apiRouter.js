const express = require("express");
const apiRouter = express.Router();
const db = require("./db");
const checkAuth = require("./middleware/checkAuth");
const { check, validationResult } = require("express-validator");

apiRouter.get("/", checkAuth, async (req, res, next) => {
    try {
        const employees = await db.getAllEmployees();
        res.status(200).json({ employees: employees });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

apiRouter.param("employeeId", async (req, res, next, employeeId) => {
    try {
        const employee = await db.getOneEmployee(employeeId);
        req.employee = employee;
        next(); // go to apiRouter.get('/:employeeId')
    } catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});

apiRouter.get("/:employeeId", (req, res, next) => {
    res.status(200).json({ employee: req.employee });
});

apiRouter.post(
    "/",
    [
        /**Check the form and validated it before submitting  */
        check("first_name", "First Name cannot be blank").not().isEmpty().isString().isLength({ min: 3 }).matches(/^[a-zA-Z][\w\s-]+/),
        check("last_name", "Last Name cannot be blank").not().isEmpty().isString().isLength({ min: 3 }).matches(/^[a-zA-Z][\w\s-]+/),
        check("email", "Email is not valid").isEmail(),
        check("email").normalizeEmail({
            gmail_remove_subaddress: false, // correct
            outlookdotcom_remove_subaddress: false,
            gmail_remove_dots: false,
            icloud_remove_subaddress: false,
        }),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            try {
                const firstName = req.body.first_name;
                const lastName = req.body.last_name;
                const email = req.body.email;

                if (!firstName || !lastName || !email) {
                    return res.sendStatus(400);
                }

                const employee = await db
                    .insertEmployee(firstName, lastName, email)
                    .then((insertId) => {
                        return db.getOneEmployee(insertId);
                    });
                res.json({ employee: employee });
            } catch (e) {
                console.log(e);
                res.sendStatus(400);
            }
        }
    }
);

apiRouter.put(
    "/:employeeId",
    [
        /**Check the form and validated it before submitting  */
        check("first_name", "First Name cannot be blank").not().isEmpty().isString().isLength({ min: 3 }).matches(/^[a-zA-Z][\w\s-]+/),
        check("last_name", "Last Name cannot be blank").not().isEmpty().isString().isLength({ min: 3 }).matches(/^[a-zA-Z][\w\s-]+/),
        check("email", "Email is not valid").isEmail(),
        check("email").normalizeEmail({
            gmail_remove_subaddress: false, // correct
            outlookdotcom_remove_subaddress: false,
            gmail_remove_dots: false,
            icloud_remove_subaddress: false,
        }),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            try {
                const firstName = req.body.first_name;
                const lastName = req.body.last_name;
                const email = req.body.email;
                const employeeId = req.params.employeeId;

                if (!firstName || !lastName || !email) {
                    return res.sendStatus(400);
                }

                const employee = await db
                    .updateEmployee(firstName, lastName, email, employeeId)
                    .then(() => {
                        return db.getOneEmployee(employeeId);
                    });
                res.json({ employee: employee });
            } catch (e) {
                console.log(e);
                res.sendStatus(400);
            }
        }
    }
);

apiRouter.delete("/:employeeId", async (req, res, next) => {
    try {
        const employeeId = req.params.employeeId;
        const response = await db.deleteEmployee(employeeId);
        return res.sendStatus(204);
    } catch (e) {
        console.log(e);
    }
});

module.exports = apiRouter;
