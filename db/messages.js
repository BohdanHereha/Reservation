const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    name1: Joi.string().required(),
    name2: Joi.string().required(),
    date1: Joi.date().required(),
	  date2: Joi.date().required(),
    select1: Joi.string().required(),
	  select2: Joi.string().required(),
  	select3: Joi.string().required(),
});

const messages = db.get('messages');

function getAll() {
    return messages.find();
}

function create(message) {
    const result = Joi.validate(message, schema);
    if (result.error == null) {
        message.created = new Date();
        return messages.insert(message);
    } else {
        return Promise.reject(result.error);
    }
}

module.exports = {
    create,
    getAll
};
