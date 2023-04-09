module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            link: String,
            sourceId: String,
            feedId: String,
            read: {
                type: Boolean,
                default: false
            },
            publishedAt: Date
        },
        { timestamps: true }
    );
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const Article = mongoose.model("article", schema);
    return Article;
};