const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token : 'TEST-5746360101443781-120117-e49d38a2b08634739a216400d4a18a2a-136499623',
    intregrator_id: 'TEST-0bc4ce37-ca13-49b5-8330-4053837b1ab2'
})

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },
    callback: (req,res) => {
        console.log(req.query)

        if (req.query.status.includes('success')){
            return res.render('success', {
                payment_type : req.query.payment_type,
                external_reference : req.query.external_reference,
                collection_id : req.query.collection_id,
            })
        }

        if (req.query.status.includes('pending')){
            return res.render('pending')
        }

        if (req.query.status.includes('failure')){
            return res.render('failure')
        }

        return res.status(404).end()

    },

    notifications: (req, res) => {
        console.log(req.body);

        res.status(200).end('OK')
    },

    comprar: (req, res) => {

        const host = 'https://mercadoliebrepago.herokuapp.com/';

        const url = host + 'callback?status=';
        
       
        let preference = {

            back_urls:{
                success : url + 'success',
                pending : url + 'pending',
                failure : url + 'failure',
            },

            notifications_url: host + 'notifications',

            auto_return: 'approved',

            payer : {
                name: 'Ryan',
                surname: 'Dahl',
                email: 'titan@gmail.com',
                phone: {
                    area_code: '11',
                    number: 55556666
                },
                address: {
                    zip_code:'1234',
                    street_name: 'Monroe',
                    street_number: 850 
                }

            },


            payment_methods : {
                excluded_payment_types: [
                    { id: 'atm'}
                ],
                excluded_payment_methods: [
                    { id: 'visa'}
                ],
                installments: 12
            },
     


            items: [
                {
                id: "1",
                picture_url: '',
                title: 'Nombre del producto',
                price: 2000,
                description: 'Descripcion del producto',
                unit_price: Number('999'),
                quantity: 9
                }

            ]

        }

        mercadopago.preferences.create(preference).then(response => {
            global.init_point = response.body.init_point
            res.render('confirm')
            
        }).catch(error => {
            console.log(error)
            res.send('error')
        })

    },
    
}