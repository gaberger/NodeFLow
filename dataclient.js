// var db = require('riak-js').getClient({host: "localhost", port: "8098" }); 
// 
// 
// var rec = db.getAll('NodeFlow') 
// db.save('test', 'packet', { source: '00:00:00:00:00:00', destination: 'FF:FF:FF:FF:FF:FF', flags: 0xFFFFFF })
// db.getAll('NodeFlow') 
// console.log(db.buckets())
// 
// console.dir(db.count('test'))      
 
var Tubbs = require('tubbs');
var User = Tubbs.create({

  // Persist our data with Riak
  dataStore: new Tubbs.RiakStore({ bucket: 'users' }),

  fields: {
    username: undefined,
    first: '',
    last: '',
  },

  virtual: {
    name: function() {
      return ((this.first || '') + ' ' + (this.last || '')).trim();
    }
  },

  validation: [
    Tubbs.Validate.required("username"),
    Tubbs.Validate.lengthOf("username", { min: 5 })
  ]
});   


var user = new User({
  username: "kbacon",
  first: "Kevin",
  last: "Bacon"
});


console.dir(user)  

dataStore.save()
