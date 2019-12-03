const pool = require('./queries');

const getProducts = (req,res)=> {
    pool.query('SELECT * FROM products', (err, result) => {
        if (err) {
            throw err;
        }
        res.status(200).send(result.rows);
    })
}

const getProduct = (req, res) => {
    const {name} = req.params;
    pool.query(`SELECT * FROM products WHERE name = $1`, [name], (err, result) =>{
        if (err) {
            throw err;
        }
        res.status(200).send(result.rows);
    })
}

module.exports = {
    getProduct,
    getProducts
}
