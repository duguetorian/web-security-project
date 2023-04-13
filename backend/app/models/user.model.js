module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            username: { type: String, unique: true, required: true },
            password: { type: String, required: true },
            sources: Array,
        },
        { timestamps: true }
    );
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const user = mongoose.model("user", schema);
    return user;
}