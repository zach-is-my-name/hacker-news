const mongoose = require('mongoose')

const newsPostSchema = mongoose.Schema ({
  title: {type: String, required : true},
  url: {type: String, required: true},
  votes: {type: Number, defualt: 0}
});


newsPostSchema.methods.apiRepr = function() {
  return {
    id : this._id,
    title: this.title,
    url: this.url,
    votes: this.votes
  };

}

const NewsPost = mongoose.model('Newspost', newsPostSchema);

module.exports = {NewsPost}
