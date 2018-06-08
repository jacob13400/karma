var Promise = require('bluebird')
var models = require('_/data/models')
var peopleMethods = {}

// Method to add people to the database
peopleMethods.addPeople = (info) => {
  return new Promise((resolve, reject) => {
    models.People.people.create(info)
      .then((model) => {
        resolve(model)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

// Method to find people given their people_id
peopleMethods.findPeopleById = (peopleId) => {
  return new Promise((resolve, reject) => {
    models.People.people.findById(peopleId)
      .then((person) =>
        resolve(person)
      )
      .catch((err) => {
        reject(err)
      })
  })
}

// Method to insert a new slug
peopleMethods.insertSlug = (slugName) => {
  return new Promise((resolve, reject) => {
    models.People.people_information_slugs.findOrCreate({
      where: { slug_name: slugName }
    }).spread((slug, created) => {
      if (created) {
        resolve(slug)
      } else {
        reject(new Error('Slug already exists.'))
      }
    }).catch((err) => {
      console.log('Error')
      reject(err)
    })
  })
}

// Method to get information using slug
peopleMethods.getInformationUsingSlug = (peopleId, slugName) => {
  return new Promise((resolve, reject) => {
    models.People.people.findOne({
      include: [
        {
          model: models.People.people_information_slugs,
          where: {
            slug_name: slugName
          }
        }
      ]
    })
      .then((peopleInfomation) => {
        resolve(peopleInfomation)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// Method to put information using slug
peopleMethods.putInformationUsingSlug = (peopleId, slugName, slugValue) => {
  return new Promise((resolve, reject) => {
    models.People.people_information_slugs.findOne({
      where: { slug_name: slugName }
    })
      .then((slug) => {
        var existingData
        var existingDataSql = 'select json from people_informations where people_id = ' + peopleId + ' and slug_id = ' + slug.id

        models.sequelize.query(existingDataSql, { type: models.sequelize.QueryTypes.SELECT })
          .spread((results, metadata) => {
            // The value which the user asked to insert to database should be
            // converted to an array as the function JSON_MERGE_PRESERVE
            // provided by MySQL takes two arrays as input.
            var newData = []
            newData.push(slugValue.replace(/^\s+|\s+$/g, ''))
            console.log(results)
            if (results) {
              // A value for the slug exists

              // console.log('A value for the slug exists')

              existingData = results.json
              models.sequelize.query('insert into people_informations (people_id, slug_id, json, createdAt, updatedAt) values (' + peopleId + ', ' + slug.id + ', JSON_MERGE_PRESERVE(\'' + JSON.stringify(existingData) + '\',\'' + JSON.stringify(newData) + '\'), NOW(), NOW()) ON DUPLICATE KEY UPDATE json = JSON_MERGE_PRESERVE(\'' + JSON.stringify(existingData) + '\',\'' + JSON.stringify(newData) + '\')')
                .spread((results, metadata) => {
                  console.log(results)
                })
                .catch((err) => {
                  console.log(err)
                })
            } else {
              // No values for the slug exist.

              // console.log('No values for the slug exist.')

              models.sequelize.query('insert into people_informations (people_id, slug_id, json, createdAt, updatedAt) values (' + peopleId + ', ' + slug.id + ', \'' + JSON.stringify(newData) + '\', NOW(), NOW())')
                .spread((results, metadata) => {
                  console.log(results)
                })
                .catch((err) => {
                  console.log(err)
                })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

peopleMethods.getUserIdUsingEmail = require('./get_user_id_using_email')

module.exports = peopleMethods
