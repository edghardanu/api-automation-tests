import chai from 'chai';
const chaiHttp = await import('chai-http').then(module => module.default);
import jsonSchema from 'chai-json-schema';


const { expect } = chai;

chai.use(chaiHttp);
chai.use(jsonSchema);

const baseUrl = 'https://reqres.in/api';

// Schema untuk validasi
const userSchema = {
  title: 'User Schema',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    email: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    avatar: { type: 'string' },
  },
  required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
};

describe('API Automation Tests', () => {
  
  // Test GET
  it('should GET a list of users', (done) => {
    chai.request(baseUrl)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema({
          type: 'object',
          properties: {
            page: { type: 'integer' },
            per_page: { type: 'integer' },
            total: { type: 'integer' },
            total_pages: { type: 'integer' },
            data: {
              type: 'array',
              items: userSchema,
            },
          },
          required: ['page', 'per_page', 'total', 'total_pages', 'data'],
        });
        done();
      });
  });

  // Test POST
  it('should POST a new user', (done) => {
    const newUser = {
      "first_name": 'Edghar',
      "last_name" :'Danuwijaya',
      "avatar" : 'https://reqres.in/img/faces/13-image.jpg',
    };

    chai.request(baseUrl)
      .post('/users')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('first_name', newUser.first_name);
        expect(res.body).to.have.property('last_name', newUser.last_name);
        expect(res.body).to.have.property('avatar', newUser.avatar);
        done();
      });
  });

  // Test PUT
  it('should PUT (update) a user', (done) => {
    const updatedUser = {
        "first_name": 'Edghar',
        "last_name" :'Danuwijaya',
        "avatar" : 'https://reqres.in/img/faces/13-image.jpg',
    };

    chai.request(baseUrl)
      .put('/users/2')
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('first_name', updatedUser.first_name);
        expect(res.body).to.have.property('last_name', updatedUser.last_name);
        expect(res.body).to.have.property('avatar', updatedUser.avatar);
        done();
      });
  });

  // Test DELETE
  it('should DELETE a user', (done) => {
    chai.request(baseUrl)
      .delete('/users/2')
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });

});
