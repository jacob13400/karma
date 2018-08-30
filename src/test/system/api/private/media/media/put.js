const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiExclude = require('chai-exclude');

chai.use(chaiExclude);
const app = require('../../../../../../bin/www');
const methods = require('../../../../../../lib/data/methods');


process.nextTick(() => {
  app.callback = run;
});

chai.use(chaiHttp);
const { expect } = chai;


describe('/PUT/:id ', () => {
  it('it should UPDATE media given the id', (done) => {
    methods.Media.mediaMethods.getAllMedia()
      .then((res) => {
        const  id  = res[0].dataValues.id;
        const classes = {
          mediaTitle: 'Hello ',
          mediaFileName: 'Hey ',
          mediaLocation: 'Kottayamaaaa',
        };
        console.log(res)

        chai.request(app)
          .put(`/private/media/media/${id}`)
          .send(classes)
          .end((err, result) => {
            expect(result).to.have.status(200);
            expect(result.body).to.be.a('object');
            expect(result.body.status).to.eql('updated media');

            done();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  afterEach((done) => {
    methods.Media.mediaMethods.deleteAllMedia()
      .then(() => {
        console.log('deleted');
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
