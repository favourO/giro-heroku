const expect = require('chai').expect;
const request = require('supertest');

const app = require('./server');
const conn = require('./config/db.js');

describe('POST /products', async() => {
    await before((done) => {
        conn()
            .then(() => done())
            .catch((err) => done(err))
    })

    const expected = {
        "data": {
            "moreImageKeys": [],
            "_id": "6176b9c3f84f65187c91bdaa",
            "product_name": "bb",
            "description": "kkdd",
            "category": "kkkkk",
            "price": "eewwws",
            "user": {
                "role": "merchant",
                "status": "Pending",
                "isEmailConfirmed": true,
                "twoFactorEnable": false,
                "_id": "60f2d02f5ca9480a3987878c",
                "username": "Apollos Obaego",
                "email": "technolybuilder@gmail.com",
                "phone": "08161727742",
                "createdAt": "2021-07-17T12:42:23.954Z",
                "__v": 0
            },
            "merchant": "60f2d2115ca9480a39878795",
            "createdAt": "2021-10-25T14:05:55.683Z",
            "__v": 0,
            "id": "6176b9c3f84f65187c91bdaa"
        }
    }

    const donei = await ((done) => {
        request(app).post('/api/v1/giro-app/auth/login')
            .send({
                "email": "technolybuilder@gmail.com",
                "password": "Favour%$1234"
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('success')
                expect(body).to.contain.property('token')
                done();
            })

        request(app).post('/api/v1/giro-app/merchant/:merchantId/product')
            .send({
                "product_name": "bb",
                "description": "kkdd",
                "category": "kkkkk",
                "price": "eewwws"
            })
            .then((res)=> {
                const body = res.body;
                expect(body).to.contain.property('success')
                expect(body).to.deep.equal(expected)
                done();
            })
    })

    it('Successful Login', donei)

    // it('Create new, ', (done) => {
    //     request(app).post('/api/v1/giro-app/merchant/:merchantId/product')
    //         .send({
    //             "product_name": "bb",
    //             "description": "kkdd",
    //             "category": "kkkkk",
    //             "price": "eewwws"
    //         })
    //         .then((res)=> {
    //             const body = res.body;
    //             expect(body).to.contain.property('status');
    //             expect(body).to.contain.property('data');
    //             done();
    //         })
    // })

})