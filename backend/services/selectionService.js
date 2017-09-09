const Mailchimp = require('mailchimp-api-v3');
const mailchimpSettingsRepository = require('../repositories/mailchimpSettingsRepository');
const selectionRepository = require('../repositories/selectionRepository');


function getAllSelections (appId, callback) {
  mailchimpSettingsRepository.findByConditions({ appId }, (err, settings) => {
    if (err)
      return callback(err);
    if (!settings[0].apiKey)
      return callback(null, null);
    // settings = [{ apiKey: 'c117176003b911e12952879f7654b476-us16' }]
    const mailchimp = new Mailchimp(settings[0].apiKey);
    mailchimp.get('/lists')
      .then((data) => {
        const filteredLists = data.lists.filter(list => list.name.indexOf('InSight-') === 0);
        filteredLists.forEach((list) => {
          list.name = list.name.substring(8, undefined);
        });
        callback(null, filteredLists);
      }).catch((err) => {
        console.log(err);
        callback(err);
      });
  });
}

function getSingleSelection (appId, selId, callback) {
  mailchimpSettingsRepository.findByConditions({ appId }, (err, settings) => {
    if (err)
      return callback(err);
    if (!settings[0].apiKey)
      return callback(null, null);
    const mailchimp = new Mailchimp(settings[0].apiKey);
    mailchimp.get(`/lists/${selId}`)
      .then((selection) => {
        selection.name = selection.name.substring(8, undefined);
        // callback(null, selection);
        mailchimp.get(`/lists/${selId}/members`).then((members) => {
          members.members.forEach(member => console.log(member.merge_fields));
          const fullSelection = Object.assign(selection, members);
          callback(null, fullSelection);
        });
      }).catch((err) => {
        console.log(err);
        callback(err);
      });
  });
}

function addSelection (appId, selection, callback) {
  selection.name = `InSight-${selection.name}`;
  // console.log('ADD SELECTION SERVICE');
  // console.log(selection);
  selection = Object.assign({
    contact: {
      company: 'InSight',
      address1: 'Far Far Away',
      city: 'Far Far Away',
      state: 'Far Far Away',
      zip: '1337',
      country: 'Far Far Away',
    },
    permission_reminder: 'You were subscribed to InSight mailings',
    campaign_defaults: {
      from_name: 'InSight',
      from_email: 'mail@server.net',
      subject: 'Message from InSight',
      language: 'English',
    },
    email_type_option: true,
  }, selection);
  mailchimpSettingsRepository.findByConditions({ appId }, (err, settings) => {
    if (err)
      return callback(err);
    if (!settings[0].apiKey)
      return callback(null, null);
    const mailchimp = new Mailchimp(settings[0].apiKey);
    mailchimp.post('/lists', selection)
      .then((data) => {
        // console.log('-----');
        // console.log('data.id');
        // console.log(data.id);
        // console.log('data.name');
        // console.log(data.name);
        // console.log('-----');
        const members = selection.users.map(user => {
          return {
            email_address: user.userId.email,
            status: 'subscribed',
            merge_fields: {
              FNAME: user.userId.firstName,
              LNAME: user.userId.lastName,
              DBID: '123',
            },
          };
        });
        console.log('members');
        // members.forEach(member => console.log(member.userId));
        return mailchimp.post(`/lists/${data.id}`, { members });
      })
      .then((data) => {
        return mailchimp.post('/lists', selection)
          .then(intData => {
            mailchimp.delete(`/lists/${intData.id}`)
              .catch(err => console.log(err));
          })
          .then(() => data)
          .catch(err => console.log(err));
        return data;
      })
      .then((data) => {
        callback(null, data);
      })
      .catch((err) => {
        console.log(err);
        callback(err);
      });
  });
}

function deleteSelection (appId, selId, callback) {
  mailchimpSettingsRepository.findByConditions({ appId }, (err, settings) => {
    if (err)
      return callback(err);
    if (!settings[0].apiKey)
      return callback(null, null);
    const mailchimp = new Mailchimp(settings[0].apiKey);
    mailchimp.delete(`/lists/${selId}`)
      .then((data) => {
        callback(null, data);
      }).catch((err) => {
        console.log(err);
        callback(err);
      });
  });
}

module.exports = {
  getAllSelections,
  getSingleSelection,
  addSelection,
  deleteSelection,
};
