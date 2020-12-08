const { response } = require("express");
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token : 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
})

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },
    callback: (req, res) => {
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

    buy: (req, res) => {

        let host = 'http://localhost:3000/';

        let url = host + 'callback?status=';
        
       
        let preference = {

            back_urls:{
                success : url + 'success',
                pending : url + 'pending',
                failure : url + 'failure',
            },

            notification_url: host + 'notifications',

            auto_return: 'approved',

            payer : {
                name: 'Ryan',
                surname: 'Dahl',
                email: 'test_user_63274575@testuser.com',
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

            items: [{
                id: "1234",
                picture_url: 'https://mercadoliebrepago.herokuapp.com/images/products/jordan.jpg',
                title: 'Dispositvo móvil de Tienda e-commerce',
                description: 'Descripcion del producto',
                unit_price: Number('999'),
                quantity: 1,
            }],

            external_reference: 'edgardo_vargas@outlook.com.ar'

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