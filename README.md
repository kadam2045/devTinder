-😖in schema db i add validation for password still while creating password valdation is not checking , yes it will check when you handle in api validtion.
-in login api if email is not in db dont show error like email is not in db its leaked our database information.(intead you can add Invalid Credentional )
-we write app.use(express.json()); because whenever i reading the req i want that data to be parsed in json

homework:
read docs : req.cookies , res.cookies , express.Router, jwt
mongoose guides and api are must important in later

skip() & limit() this functions are use for pagination

- we whitelist our cors origins in app.js with configuration of origin and credentials
