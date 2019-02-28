const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const PoemSchema = new Schema ({

    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: false
    },

    excerpt: {
        type: String,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
    
});

const Poem = mongoose.model('Poem', PoemSchema)

module.exports = Poem;