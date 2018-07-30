
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
        const id = res[0].dataValues.id;
        const classes = {
            mediaTitle: 'Hello ',
            mediaFileName: 'Hey ',
            mediaLocation: 'Kottayamaaaa',
        };


        chai.request(app)
          .put(`/private/media/media/${id}`)
          .send(classes)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.status).to.eql('updated media');

            done();
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
