module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            title: {
                type: String,
                unique: true
            },
            description: String,
            link : {
                type: String,
                unique: true
            },
            etag: String,
            version: String
        },
        { timestamps: true }
    );
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const Source = mongoose.model("source", schema);
    return Source;
};